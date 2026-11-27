import asyncio

import httpx
import pytest
from fastmcp.exceptions import ToolError

from astrophoto_mcp.api.equipment import EquipmentHTTP
from astrophoto_mcp.api.library import LibraryHTTP


def test_explicit_instance_header_prevents_read_or_delete_on_replacement():
    seen = []

    def respond(request):
        seen.append((request.method, request.headers.get('X-AstroPhoto-Instance-ID')))
        if request.headers.get('X-AstroPhoto-Instance-ID') != 'current-instance':
            return httpx.Response(409, json={'error': {'code': 'TARGET_INSTANCE_MISMATCH'}})
        return httpx.Response(200, json={'items': [], 'next': None})

    async def run():
        transport = httpx.MockTransport(respond)
        library = LibraryHTTP('http://127.0.0.1:8188', transport)
        equipment = EquipmentHTTP('http://127.0.0.1:8188', transport)
        with pytest.raises(ToolError, match='TARGET_INSTANCE_MISMATCH'):
            await library.catalog_request('DELETE', 'image_result/asset', expected_instance='old-instance')
        with pytest.raises(ToolError, match='TARGET_INSTANCE_MISMATCH'):
            await equipment.get('equipment', 'equipment', collection=True, paged=True,
                                expected_instance='old-instance')
        assert (await library.catalog_request('GET', 'assets', page=True,
                                              expected_instance='current-instance'))['items'] == []
        assert (await equipment.get('equipment', 'equipment', collection=True, paged=True,
                                    expected_instance='current-instance'))['items'] == []

    asyncio.run(run())
    assert seen == [('DELETE', 'old-instance'), ('GET', 'old-instance'),
                    ('GET', 'current-instance'), ('GET', 'current-instance')]
