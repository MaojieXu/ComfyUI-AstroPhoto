"""Verify TP-002 synthetic FITS and fully decode each generated video."""

import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path

import imageio_ffmpeg
import numpy as np
from astropy.io import fits

EXPECTED = {
    "master_frame": 3,
    "image_result": 3,
    "calibration_master": 8,
    "video": 5,
    "edge_case": 2,
}


def verify(root: Path) -> dict:
    manifest = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["synthetic"] and len(manifest["groups"]) == 14
    files = manifest["files"]
    counts = {**EXPECTED, "subframe_collection": sum(group["count"] for group in manifest["groups"])}
    assert Counter(item["import_entry"] for item in files) == counts
    assert Counter(item["group"] for item in files if item.get("group")) == {
        Path(group["path"]).name: group["count"] for group in manifest["groups"]
    }
    expected = {Path(item["path"]) for item in files}
    actual = {path.relative_to(root) for path in root.rglob("*") if path.is_file()}
    assert actual == expected | {Path("manifest.json")}
    hashes, videos = {}, {}
    for item in files:
        path = root / item["path"]
        with path.open("rb") as stream:
            hashes[item["path"]] = hashlib.file_digest(stream, "sha256").hexdigest()
        if item["import_entry"] == "video":
            frames = imageio_ffmpeg.read_frames(str(path))
            try:
                metadata = next(frames)
                assert tuple(metadata["size"]) == (1280, 720), (path.name, metadata)
                count = sum(1 for _ in frames)
                fps = metadata["fps"]
                assert fps > 0 and abs(count / fps - 10) < 0.1, (path.name, count, fps)
                videos[item["path"]] = {"frames": count, "fps": fps, "seconds": count / fps}
            finally:
                frames.close()
        else:
            with fits.open(path, memmap=False) as hdus:
                data = hdus[0].data
                assert data.shape == (item["height"], item["width"]) and data.size > 2_000_000, path.name
                assert data.dtype == np.uint16 and np.all(data == 600), path.name
                assert hdus[0].header["ORIGIN"] == "Synthetic test data", path.name
    return {"manifest": manifest, "sha256": hashes, "videos": videos}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("first", type=Path)
    parser.add_argument("second", type=Path, nargs="?")
    args = parser.parse_args()
    first = verify(args.first)
    counts = Counter(item["import_entry"] for item in first["manifest"]["files"])
    if args.second is None:
        print(json.dumps({"counts": counts, "videos": first["videos"]}, indent=2))
        return
    assert args.first.resolve() != args.second.resolve()
    second = verify(args.second)
    assert first["manifest"] == second["manifest"]
    assert first["videos"] == second["videos"]
    for path, digest in first["sha256"].items():
        if path not in first["videos"]:
            assert second["sha256"][path] == digest, path
    print(json.dumps({"counts": counts, "first_sha256": first["sha256"],
                      "second_sha256": second["sha256"], "videos": first["videos"]}, indent=2))


if __name__ == "__main__":
    main()
