"""Inspect registered HTTP definitions and MCP schemas without business calls."""
import argparse
import ast
import asyncio
import json
import os
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch

from aiohttp.web import RouteTableDef
from fastmcp import Client
from astrophoto.api.routes import BASE, register_routes
from astrophoto_mcp.server import create_server

ROOT = Path(__file__).resolve().parents[1]
ROUTES = {
    'storage': ('astrophoto/api/storage.py', 'storage_routes'),
    'equipment': ('astrophoto/api/equipment.py', 'equipment_routes'),
    'assets': ('astrophoto/api/assets.py', 'asset_routes'),
    'scientific-deferred': ('astrophoto/api/scientific.py', 'scientific_routes'),
    'direct-import': ('astrophoto/api/direct_import.py', 'direct_routes'),
    'library': ('astrophoto/api/library.py', 'library_routes'),
    'catalog': ('astrophoto/api/catalog.py', 'catalog_routes'),
    'canvas': ('astrophoto/api/canvas.py', 'canvas_routes'),
    'siril-deferred': ('extension/siril/routes.py', 'siril_routes'),
}
CATEGORIES = ('connection', 'equipment', 'equipment_groups', 'library', 'projects', 'storage', 'canvas')


def routes():
    result = {'status': [{'method': 'GET', 'path': '/status', 'status': 200,
                          'source': 'astrophoto/api/routes.py', 'line': 15}]}
    for name, (filename, function) in ROUTES.items():
        tree = ast.parse((ROOT / filename).read_text(encoding='utf-8'))
        node = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == function)
        ret = next(n for n in node.body if isinstance(n, ast.Return))
        rows = []
        for entry in ret.value.elts:
            method, path, action, status = entry.elts
            handler = next((n for n in tree.body if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))
                            and isinstance(action, ast.Name) and n.name == action.id), None)
            field_checks = []
            if handler:
                for call in ast.walk(handler):
                    if (isinstance(call, ast.Call) and isinstance(call.func, ast.Name)
                            and call.func.id in ('fields', 'object_fields')):
                        field_checks.append(ast.unparse(call))
            rows.append({'method': ast.literal_eval(method), 'path': ast.literal_eval(path),
                         'status': ast.literal_eval(status), 'handler': ast.unparse(action),
                         'source': filename, 'line': entry.lineno,
                         'field_checks': sorted(set(field_checks))})
        result[name] = rows
    verify_registration(result)
    return result


def registered_paths(bundle=None):
    table = RouteTableDef()
    register_routes(table, SimpleNamespace(processing_bundle=bundle))
    return {(route.method, route.path) for route in table}


def verify_registration(groups, bundle=None):
    deferred = 'siril-deferred'
    expected = {(row['method'], BASE + row['path'])
                for name, rows in groups.items() if name != deferred or bundle is not None
                for row in rows}
    actual = registered_paths(bundle)
    if actual != expected:
        raise ValueError(f'HTTP inventory drift: missing {sorted(actual - expected)}, extra {sorted(expected - actual)}')


async def schemas():
    modes = {'auto': None, 'local': 'http://127.0.0.1:8188', 'remote': 'http://example.test'}
    definitions = {}
    for source in sorted((ROOT / 'mcp/src/astrophoto_mcp/tools').glob('*.py')):
        for node in ast.walk(ast.parse(source.read_text(encoding='utf-8'))):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                definitions[node.name] = {'source': source.relative_to(ROOT).as_posix(), 'source_line': node.lineno}
    result = {}
    for mode, address in modes.items():
        # Isolate server construction from any configured local MCP target.
        with patch.dict(os.environ):
            os.environ.pop('COMFYUI_URL', None)
            server = create_server(address)
        async with Client(server) as client:
            discovered = (await client.call_tool('list_tool_categories', {})).data
            result[mode] = {}
            for category in discovered['categories']:
                name = category['name']
                tools = (await client.call_tool('list_category_tools', {'category': name})).data['tools']
                for tool in tools:
                    tool.update(definitions.get(tool['name'], {}))
                result[mode][name] = tools
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, required=True, help='Write JSON inventory to an explicit path')
    args = parser.parse_args()
    data = {'http': routes(), 'mcp': asyncio.run(schemas())}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + '\n', encoding='utf-8')
    print(f"HTTP definitions: {sum(map(len, data['http'].values()))}; MCP auto/local/remote: "
          + '/'.join(str(sum(map(len, data['mcp'][m].values()))) for m in ('auto', 'local', 'remote')))


if __name__ == '__main__':
    main()
