"""Regression contract for asset removal through the public MCP surface."""

import asyncio
import sys

import pytest
from fastmcp import Client
from fastmcp.client.transports import StdioTransport

from astrophoto_mcp.server import create_server
from tests.integration.test_photography_library import import_items, library_client, request


def test_confirmation_across_modern_stdio_calls(tmp_path):
    source = tmp_path / "stdio.fit"
    source.write_bytes(b"original")

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            await import_items(client, sources=[str(source)], catalog={
                "kind": "image_result", "name": "Target", "asset_type": "image_result",
            })
            row, = (await request(client, "GET", "/catalog/image_result", 200))["items"]
            project = await request(client, "POST", "/catalog/projects", 201, {"name": "M31"})
            await request(client, "POST", "/catalog/projects/" + project["id"] + "/references", 201, {
                "parent_path": "/", "assets": [{"kind": "image_result", "resource_id": row["id"]}],
            })
            transport = StdioTransport(command=sys.executable, args=[
                "-m", "astrophoto_mcp", "--comfy-url", f"http://127.0.0.1:{client.server.port}",
            ])
            async with Client(transport) as agent:
                impact = (await agent.call_tool("call_tool", {
                    "name": "library_deletion_impact", "arguments": {"name": "Target"},
                })).data
                result = (await agent.call_tool("call_tool", {
                    "name": "library_remove", "arguments": {
                        "name": "Target", "confirmation": impact["confirmation"], "confirmed": True,
                    },
                })).data
                assert result["removed"]
            assert source.read_bytes() == b"original"

    asyncio.run(exercise())


def test_subframe_filename_must_be_unique(tmp_path):
    first = tmp_path / "a" / "light.fit"
    second = tmp_path / "b" / "light.fit"
    first.parent.mkdir()
    second.parent.mkdir()
    first.write_bytes(b"first")
    second.write_bytes(b"second")

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            await import_items(client, sources=[str(first), str(second)], catalog={
                "kind": "subframe_collection", "name": "Lights",
            })
            async with Client(create_server(f"http://127.0.0.1:{client.server.port}"), mode="legacy") as agent:
                result = await agent.call_tool("library_remove_subframe", {
                    "collection_name": "Lights", "file_name": "light.fit",
                }, raise_on_error=False)
                assert result.is_error and "AMBIGUOUS_PATH" in result.content[0].text
                await agent.call_tool("library_remove_subframe", {
                    "collection_name": "Lights", "file_path": str(first),
                })
            assert first.exists() and second.exists()

    asyncio.run(exercise())


@pytest.mark.parametrize("mode", ["reference", "copy"])
def test_library_remove_respects_file_ownership(tmp_path, mode):
    source = tmp_path / "source.fit"
    source.write_bytes(b"original")

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            current = await request(client, "GET", "/storage", 200)
            storage.update_settings(current["imports"]["revision"], imports=mode)
            await import_items(client, sources=[str(source)], catalog={
                "kind": "image_result", "name": "Target", "asset_type": "image_result",
            })
            row, = (await request(client, "GET", "/catalog/image_result", 200))["items"]
            physical = storage.assets.resolve_asset(row["id"])
            async with Client(create_server(f"http://127.0.0.1:{client.server.port}")) as agent:
                categories = (await agent.call_tool("list_tool_categories", {})).data["categories"]
                assert "storage" not in {category["name"] for category in categories}
                result = (await agent.call_tool("library_remove", {"name": "Target"})).data
                assert result["removed"] is True
            await request(client, "GET", "/catalog/image_result/" + row["id"], 404)
            assert source.read_bytes() == b"original"
            if mode == "copy":
                assert not physical.exists()

    asyncio.run(exercise())


def test_deletion_impact_tracks_project_changes(tmp_path, monkeypatch):
    from astrophoto_mcp.api.library import LibraryHTTP

    source = tmp_path / "impact.fit"
    source.write_bytes(b"original")

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            await import_items(client, sources=[str(source)], catalog={
                "kind": "image_result", "name": "Target", "asset_type": "image_result",
            })
            row, = (await request(client, "GET", "/catalog/image_result", 200))["items"]
            path = "/catalog/image_result/" + row["id"]
            before = await request(client, "GET", path + "/deletion-impact", 200)
            assert not before["has_associations"]
            project = await request(client, "POST", "/catalog/projects", 201, {"name": "M31"})
            await request(client, "POST", "/catalog/projects/" + project["id"] + "/references", 201, {
                "parent_path": "/", "assets": [{"kind": "image_result", "resource_id": row["id"]}],
            })
            impact = await request(client, "GET", path + "/deletion-impact", 200)
            assert impact["has_associations"] and impact["projects"][0]["project"] == "M31"
            assert before["impact_revision"] != impact["impact_revision"]
            rejected = await request(client, "DELETE", path, 409, {"revision": row["revision"]})
            assert rejected["error"]["code"] == "DELETION_CONFIRMATION_REQUIRED"
            raw = "/library/assets/" + row["id"]
            rejected = await request(client, "DELETE", raw, 409, {})
            assert rejected["error"]["code"] == "DELETION_CONFIRMATION_REQUIRED"
            stale = await request(client, "DELETE", path, 409, {
                "revision": row["revision"], "impact_revision": before["impact_revision"],
            })
            assert stale["error"]["code"] == "REVISION_CONFLICT"
            mcp_server = create_server(f"http://127.0.0.1:{client.server.port}")
            async with Client(mcp_server, mode="legacy") as agent:
                preview = (await agent.call_tool("library_deletion_impact", {"name": "Target"})).data
                assert preview["confirmation"]
                assert "impact_revision" not in preview
                denied = await agent.call_tool("library_remove", {
                    "name": "Target", "confirmation": preview["confirmation"],
                }, raise_on_error=False)
                assert denied.is_error
                invalid = await agent.call_tool("library_remove", {
                    "name": "Target", "confirmation": "UNKNOWN", "confirmed": True,
                }, raise_on_error=False)
                assert invalid.is_error
                send = LibraryHTTP._send
                async def replaced_instance(self, method, route, **kwargs):
                    status, payload = await send(self, method, route, **kwargs)
                    if route == 'status':
                        payload = {**payload, 'storage_instance_id': 'replacement-instance'}
                    return status, payload
                with monkeypatch.context() as patch:
                    patch.setattr(LibraryHTTP, '_send', replaced_instance)
                    replaced = await agent.call_tool("library_remove", {
                        "name": "Target", "confirmation": preview["confirmation"], "confirmed": True,
                    }, raise_on_error=False)
                    assert replaced.is_error and "CONFIRMATION_EXPIRED" in replaced.content[0].text
                async with Client(mcp_server, mode="legacy") as other:
                    cross_session = await other.call_tool("library_remove", {
                        "name": "Target", "confirmation": preview["confirmation"], "confirmed": True,
                    }, raise_on_error=False)
                    assert cross_session.is_error
                another = await request(client, "POST", "/catalog/projects", 201, {"name": "M42"})
                await request(client, "POST", "/catalog/projects/" + another["id"] + "/references", 201, {
                    "parent_path": "/", "assets": [{"kind": "image_result", "resource_id": row["id"]}],
                })
                changed = await agent.call_tool("library_remove", {
                    "name": "Target", "confirmation": preview["confirmation"], "confirmed": True,
                }, raise_on_error=False)
                assert changed.is_error
                preview = (await agent.call_tool("library_deletion_impact", {"name": "Target"})).data
                removed = (await agent.call_tool("library_remove", {
                    "name": "Target", "confirmation": preview["confirmation"], "confirmed": True,
                })).data
                assert removed["removed"]

    asyncio.run(exercise())


def test_managed_file_removal_retries_after_catalog_rollback(tmp_path, monkeypatch):
    from astrophoto.core.errors import StorageError

    source = tmp_path / "recover.fit"
    source.write_bytes(b"original")

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            storage.update_settings(0, imports="copy")
            await import_items(client, sources=[str(source)], catalog={"kind": "image_result", "name": "Recover"})
            row, = (await request(client, "GET", "/catalog/image_result", 200))["items"]
            managed = storage.assets.resolve_asset(row["id"])
            path = "/catalog/image_result/" + row["id"]

            def fail(*_):
                raise StorageError("RECOVERY_REQUIRED")

            with monkeypatch.context() as patch:
                patch.setattr(storage.library, "_remove_asset", fail)
                await request(client, "DELETE", path, 409, {})
            assert not managed.exists()
            await request(client, "GET", path, 200)
            result = await request(client, "DELETE", path, 200, {})
            assert result["removed_asset_ids"] == result["deleted_files"] == [row["id"]]
            await request(client, "GET", path, 404)
            assert source.read_bytes() == b"original"

    asyncio.run(exercise())


def test_collection_reports_completed_members_and_retries(tmp_path, monkeypatch):
    from pathlib import Path

    sources = [tmp_path / name for name in ("first.fit", "second.fit")]
    for source in sources:
        source.write_bytes(b"original")

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            storage.update_settings(0, imports="copy")
            receipt = await import_items(client, sources=list(map(str, sources)), catalog={
                "kind": "subframe_collection", "name": "Group",
            })
            path = "/catalog/subframe_collection/" + receipt["collection_id"]
            members = (await request(client, "GET", path + "/files", 200))["items"]
            first, second = sorted(member["id"] for member in members)
            blocked = storage.assets.resolve_asset(second)
            unlink = Path.unlink

            def block(path, *args, **kwargs):
                if path == blocked:
                    raise PermissionError("file in use")
                return unlink(path, *args, **kwargs)

            with monkeypatch.context() as patch:
                patch.setattr(Path, "unlink", block)
                failed = await request(client, "DELETE", path, 409, {})
            assert failed["error"]["code"] == "MANAGED_FILE_DELETE_FAILED"
            details = failed["error"]["details"]
            assert details["removed_asset_ids"] == details["deleted_files"] == [first]
            assert details["remaining_asset_ids"] == [second]
            remaining, = (await request(client, "GET", path + "/files", 200))["items"]
            assert remaining["id"] == second and blocked.exists()
            await request(client, "DELETE", path, 200, {})
            assert not blocked.exists() and all(source.exists() for source in sources)
            await request(client, "GET", path, 404)

    asyncio.run(exercise())


@pytest.mark.parametrize("change", ["modified", "shared"])
def test_managed_protection_checks_before_unlink(tmp_path, change):
    from os.path import normcase
    from uuid import uuid4
    from astrophoto.database.models import Asset, AssetLocation

    source = tmp_path / "protected.fit"
    source.write_bytes(b"original")

    async def exercise():
        async with library_client(tmp_path) as (client, storage):
            storage.update_settings(0, imports="copy")
            await import_items(client, sources=[str(source)], catalog={"kind": "image_result", "name": "Protected"})
            row, = (await request(client, "GET", "/catalog/image_result", 200))["items"]
            managed = storage.assets.resolve_asset(row["id"])
            path = "/catalog/image_result/" + row["id"]
            original = await request(client, "GET", path + "/deletion-impact", 200)
            if change == "modified":
                managed.write_bytes(b"replacement")
            else:
                with storage.db.session(transaction="write") as session:
                    ident = str(uuid4())
                    session.add(Asset(id=ident, name=managed.name, size_bytes=8, mtime_ns=0))
                    session.flush()
                    session.add(AssetLocation(id=str(uuid4()), asset_id=ident, storage_mode="external_reference",
                                              external_path=str(managed), external_key=normcase(str(managed))))
            impact = await request(client, "GET", path + "/deletion-impact", 200)
            code = "SOURCE_CHANGED" if change == "modified" else "MANAGED_FILE_SHARED"
            assert impact["files"][0]["blocked"] == code
            stale = await request(client, "DELETE", path, 409, {"impact_revision": original["impact_revision"]})
            assert stale["error"]["code"] == "REVISION_CONFLICT"
            blocked = await request(client, "DELETE", path, 409, {"impact_revision": impact["impact_revision"]})
            assert blocked["error"]["code"] == code
            assert managed.read_bytes() == (b"replacement" if change == "modified" else b"original")
            await request(client, "GET", path, 200)

    asyncio.run(exercise())
