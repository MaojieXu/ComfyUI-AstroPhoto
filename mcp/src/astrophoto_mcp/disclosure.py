"""Progressive discovery without changing the underlying MCP tools."""

from typing import Any, Literal

from fastmcp import Context
from fastmcp.exceptions import ToolError
from fastmcp.server.transforms.catalog import CatalogTransform
from fastmcp.server.transforms.search import serialize_tools_for_output_json
from fastmcp.tools import ToolResult

Category = Literal['connection', 'equipment', 'equipment_groups', 'library', 'projects', 'storage']
DESCRIPTIONS = {
    'connection': 'Connection, instance selection and MCP version.',
    'equipment': 'Individual equipment records.',
    'equipment_groups': 'Equipment groups and their members.',
    'library': 'Assets, imports, subframes and calibration bindings.',
    'projects': 'Projects, logical folders and asset references.',
    'storage': 'Deletion of AstroPhoto-managed physical files.',
}
ENTRY_POINTS = {'list_tool_categories', 'list_category_tools', 'call_tool'}


def category_for(name: str) -> str | None:
    if name in {'version', 'connection_status', 'connection_select'}:
        return 'connection'
    for prefix, category in (('equipment_', 'equipment'), ('optical_train_', 'equipment_groups'),
                             ('library_', 'library'), ('project_', 'projects'), ('storage_', 'storage')):
        if name.startswith(prefix):
            return category
    return None


class CategoryDisclosure(CatalogTransform):
    """Expose discovery tools while keeping direct business-tool lookup intact."""

    async def transform_tools(self, tools):
        return [tool for tool in tools if tool.name in ENTRY_POINTS]


def register_discovery(server, transform: CategoryDisclosure):
    @server.tool(annotations={'readOnlyHint': True, 'openWorldHint': False})
    async def list_tool_categories(ctx: Context) -> dict:
        """List available AstroPhoto tool categories before selecting a category."""
        tools = await transform.get_tool_catalog(ctx)
        available = {category_for(tool.name) for tool in tools}
        return {'categories': [{'name': name, 'description': description} for name, description in DESCRIPTIONS.items()
                               if name in available]}

    @server.tool(annotations={'readOnlyHint': True, 'openWorldHint': False})
    async def list_category_tools(category: Category, ctx: Context) -> dict:
        """List the names, descriptions and input schemas of tools in one category."""
        tools = await transform.get_tool_catalog(ctx)
        selected = [tool for tool in tools if category_for(tool.name) == category]
        return {'category': category, 'tools': serialize_tools_for_output_json(selected)}

    @server.tool
    async def call_tool(name: str, ctx: Context, arguments: dict[str, Any] | None = None) -> ToolResult:
        """Call a discovered AstroPhoto business tool by name with its arguments."""
        if not any(tool.name == name and category_for(name) for tool in await transform.get_tool_catalog(ctx)):
            raise ToolError(f'UNKNOWN_TOOL: {name}')
        return await ctx.fastmcp.call_tool(name, arguments or {})
