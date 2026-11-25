"""Detect route and runtime tool-schema drift in the API reference snapshot."""
import asyncio
import json
import re

from fastmcp import Client
from jsonschema import Draft202012Validator

from astrophoto_mcp.server import create_server

from scripts.api_inventory import ROOT, routes, schemas, verify_registration


def test_registered_http_definitions_match_inventory():
    snapshot = json.loads((ROOT / 'docs/api/inventory.json').read_text(encoding='utf-8'))
    # Source line numbers can change without changing the contract.
    def normalize(groups):
        return {name: [{key: value for key, value in row.items() if key != 'line'}
                       for row in rows] for name, rows in groups.items()}
    assert normalize(routes()) == normalize(snapshot['http'])


def test_siril_bundle_routes_are_listed_only_when_registered(extension):
    from importlib import import_module

    module = import_module(f"{extension.module.__name__}.extension.siril.bundle")
    verify_registration(routes(), module.SirilBundle())


def test_mcp_tool_names_and_input_schemas_match_inventory(monkeypatch):
    snapshot = json.loads((ROOT / 'docs/api/inventory.json').read_text(encoding='utf-8'))
    monkeypatch.setenv('COMFYUI_URL', 'http://example.test')
    current = asyncio.run(schemas())
    def normalize_schema(value):
        if isinstance(value, dict):
            return {key: sorted(item, key=repr) if key == 'enum' else normalize_schema(item)
                    for key, item in value.items()}
        if isinstance(value, list):
            return [normalize_schema(item) for item in value]
        return value

    def normalize(modes):
        return {mode: {category: {tool['name']: (normalize_schema(tool['inputSchema']), normalize_schema(tool.get('outputSchema')), tool.get('annotations')) for tool in tools}
                       for category, tools in categories.items()} for mode, categories in modes.items()}
    actual = normalize(current)
    expected = normalize(snapshot['mcp'])
    for mode in expected:
        assert actual[mode].keys() == expected[mode].keys(), mode
        for category in expected[mode]:
            assert actual[mode][category].keys() == expected[mode][category].keys(), (mode, category)
            for name in expected[mode][category]:
                assert actual[mode][category][name] == expected[mode][category][name], (mode, category, name)


def test_rendered_reference_contains_every_inventory_entry():
    snapshot = json.loads((ROOT / 'docs/api/inventory.json').read_text(encoding='utf-8'))
    routes_page = (ROOT / 'docs/api/http/routes.md').read_text(encoding='utf-8')
    contracts = (ROOT / 'docs/api/http/contracts.md').read_text(encoding='utf-8')
    for group, rows in snapshot['http'].items():
        for row in rows:
            assert f"`{row['method']}` | `/astrophoto/v1{row['path']}`" in routes_page
            if not group.endswith('-deferred'):
                assert f"| `{row['method']} {row['path']}` |" in contracts
    mcp_contracts = (ROOT / 'docs/api/mcp/contracts.md').read_text(encoding='utf-8')
    for category, tools in snapshot['mcp']['auto'].items():
        page = (ROOT / 'docs/api/mcp' / f'{category}.md').read_text(encoding='utf-8')
        for tool in tools:
            assert f"## `{tool['name']}`" in page
            assert json.dumps(tool['inputSchema'], ensure_ascii=False, indent=2, sort_keys=True) in page
            assert f"| `{tool['name']}` |" in mcp_contracts
            assert f"(examples.md#{tool['name'].replace('_', '-')})" in page


def test_every_mcp_tool_has_an_example_validated_against_its_schema(monkeypatch):
    async def discover():
        async with Client(create_server(None)) as client:
            return {tool.name: tool.input_schema for tool in await client.list_tools()}

    monkeypatch.delenv('COMFYUI_URL', raising=False)
    current = asyncio.run(schemas())
    tools = asyncio.run(discover())
    for categories in current.values():
        for entries in categories.values():
            tools.update({tool['name']: tool['inputSchema'] for tool in entries})
    page = (ROOT / 'docs/api/mcp/examples.md').read_text(encoding='utf-8')
    rows = re.findall(r'^### ([\w-]+)\n(?:(?!^#)[\s\S])*?^```json\n([\s\S]*?)\n^```', page, re.M)
    examples = {name.replace('-', '_'): json.loads(body) for name, body in rows}
    assert len(examples) == len(rows)
    assert examples.keys() == tools.keys()
    for name, arguments in examples.items():
        assert isinstance(arguments, dict), name
        errors = list(Draft202012Validator(tools[name]).iter_errors(arguments))
        assert not errors, (name, [error.message for error in errors])
