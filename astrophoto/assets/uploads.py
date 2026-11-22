"""Browser-selected Copy sources staged in bounded chunks."""

import asyncio
import os
from pathlib import PureWindowsPath
from urllib.parse import unquote

from ..core.errors import StorageError
from ..storage.manager import choose_space, rename_noreplace, source_stat
from ..storage.paths import safe_join_workspace
from .library_rules import identifier


def folder(runtime, upload_id):
    return safe_join_workspace(runtime.root, f"runtime/library-uploads/{identifier(upload_id)}")


def uploaded_file(runtime, upload_id):
    path = folder(runtime, upload_id)
    files = [child for child in path.iterdir() if child.name != ".upload.part"] if path.is_dir() else []
    if len(files) != 1:
        raise StorageError("UPLOAD_NOT_FOUND")
    candidate = safe_join_workspace(path, files[0].name)
    source_stat(candidate)
    return candidate


async def stage_upload(runtime, request):
    upload_id = request.match_info["id"]
    name = unquote(request.headers.get("X-AstroPhoto-Filename", ""))
    if (not name or name == ".upload.part" or len(name) > 255
            or PureWindowsPath(name).name != name or "/" in name or "\\" in name):
        raise StorageError("INVALID_REQUEST")
    size = request.content_length
    if size is None or size < 0:
        raise StorageError("INVALID_REQUEST")
    directory = folder(runtime, upload_id)
    destination = safe_join_workspace(directory, name)
    temporary = safe_join_workspace(directory, ".upload.part")
    await asyncio.to_thread(choose_space, runtime.root, size)
    directory.parent.mkdir(exist_ok=True)
    try:
        directory.mkdir()
    except FileExistsError as exc:
        raise StorageError("OBJECT_CONFLICT") from exc
    try:
        with temporary.open("xb") as file:
            remaining = size
            async for block in request.content.iter_chunked(1024 * 1024):
                remaining -= len(block)
                if remaining < 0:
                    raise StorageError("INVALID_REQUEST")
                await asyncio.to_thread(file.write, block)
            if remaining:
                raise StorageError("SOURCE_CHANGED")
            await asyncio.to_thread(file.flush)
            await asyncio.to_thread(os.fsync, file.fileno())
        await asyncio.to_thread(rename_noreplace, temporary, destination)
    finally:
        temporary.unlink(missing_ok=True)
        if not destination.exists():
            directory.rmdir()
    return {"upload_id": upload_id, "name": name, "size_bytes": size}


def discard_upload(runtime, upload_id):
    try:
        path = uploaded_file(runtime, upload_id)
        path.unlink()
        path.parent.rmdir()
    except (OSError, StorageError):
        pass
