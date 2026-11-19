#!/usr/bin/env python3
"""Check portable Markdown links/anchors and an optional SHA256 file inventory.

Usage: python verify_bundle.py ROOT [--check-manifest]
       python verify_bundle.py ROOT --write-manifest [--force-manifest]
       python verify_bundle.py ROOT --raw-chat-sources [--check-manifest]

No network access. Default execution only reads ROOT. A present MANIFEST.sha256
is checked automatically; --check-manifest also requires it to exist. Writing
requires --write-manifest; replacing a manifest additionally requires
--force-manifest. The manifest excludes itself and includes all other files.
With --raw-chat-sources, only outbound navigation syntax and targets in raw
Markdown under sources/local-chats/ are excluded. Those files still undergo
enumeration, UTF-8 decoding, anchor indexing, symlink rejection, and hashing
when a manifest is written or checked. Incoming links to them remain checked.
Their historical references require mappings or gaps in 15_LOCAL_CHAT_INTAKE.md.
These checks do not prove semantic completeness, source truth, or test coverage.
"""

import argparse
import hashlib
import html
import json
import os
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


MANIFEST = "MANIFEST.sha256"
FENCE = re.compile(r"^ {0,3}(`{3,}|~{3,})(.*)$")
INLINE = re.compile(r"!?\[[^\]\n]*\]\(")
REFERENCE = re.compile(r"!?\[([^\]\n]+)\]\s*\[([^\]\n]*)\]")
DEFINITION = re.compile(r"^ {0,3}\[([^\]\n]+)\]:\s*(.*)$", re.M)
EXPLICIT_ID = re.compile(r"<[^>]+\bid\s*=\s*([\"'])(.*?)\1", re.I)
NAMED_ANCHOR = re.compile(r"<a\b[^>]*\bname\s*=\s*([\"'])(.*?)\1", re.I)


def blank(text):
    return "".join("\n" if char == "\n" else " " for char in text)


def unfence(text):
    """Hide fenced and indented code while preserving source line numbers."""
    lines = []
    active = None
    for line in text.splitlines(keepends=True):
        match = FENCE.match(line)
        if active:
            lines.append(blank(line))
            if match and match[1][0] == active[0] and len(match[1]) >= active[1] and not match[2].strip():
                active = None
        elif match:
            active = (match[1][0], len(match[1]))
            lines.append(blank(line))
        elif line.startswith("    ") or line.startswith("\t"):
            lines.append(blank(line))
        else:
            lines.append(line)
    return "".join(lines)


def uncode(text):
    return re.sub(r"(`+)(.*?)(?<!`)\1(?!`)", lambda m: blank(m[0]), text, flags=re.S)


def anchors(text):
    visible = unfence(text)
    markup = uncode(visible)
    result = {html.unescape(m[2]) for regex in (EXPLICIT_ID, NAMED_ANCHOR) for m in regex.finditer(markup)}
    used = set()
    rows = visible.splitlines()
    for index, line in enumerate(rows):
        heading = re.match(r"^ {0,3}#{1,6}(?:[ \t]+|$)(.*)$", line)
        if heading:
            title = re.sub(r"[ \t]+#+[ \t]*$", "", heading[1])
        elif index + 1 < len(rows) and line.strip() and re.fullmatch(r" {0,3}(?:=+|-+)\s*", rows[index + 1]):
            title = line.strip()
        else:
            continue
        title = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", title)
        title = re.sub(r"<[^>]+>", "", html.unescape(title)).lower().strip()
        slug = re.sub(r"[^\w\s-]", "", title, flags=re.UNICODE)
        slug = re.sub(r"\s", "-", slug)
        base, suffix = slug, 0
        while slug in used:
            suffix += 1
            slug = f"{base}-{suffix}"
        used.add(slug)
        result.add(slug)
    return result


def destination(text, start):
    """Read an inline-link body, including balanced parentheses and titles."""
    depth, angle, escaped = 1, False, False
    pos = start
    while pos < len(text):
        char = text[pos]
        if escaped:
            escaped = False
        elif char == "\\":
            escaped = True
        elif char == "<":
            angle = True
        elif char == ">":
            angle = False
        elif not angle and char == "(":
            depth += 1
        elif not angle and char == ")":
            depth -= 1
            if depth == 0:
                return text[start:pos], pos + 1
        pos += 1
    return None, len(text)


def target_from_body(body):
    body = body.strip()
    if body.startswith("<"):
        end = body.find(">")
        return body[1:end] if end >= 0 else body
    # Link titles follow whitespace; local names containing spaces use <...>
    # or percent encoding. Escaped spaces and parentheses remain supported.
    match = re.match(r"(?:\\.|[^\s])+", body)
    target = match[0] if match else ""
    return re.sub(r"\\([ !\"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])", r"\1", target)


def markdown_links(text, errors, label):
    visible = uncode(unfence(text))
    definitions = {}
    occupied = []
    for match in DEFINITION.finditer(visible):
        key = " ".join(match[1].lower().split())
        definitions[key] = target_from_body(match[2])
        occupied.append(match.span())
    for match in INLINE.finditer(visible):
        if any(a <= match.start() < b for a, b in occupied):
            continue
        body, end = destination(visible, match.end())
        line = visible.count("\n", 0, match.start()) + 1
        occupied.append((match.start(), end))
        if body is None:
            errors.append(f"{label}:{line}: unclosed Markdown link")
        else:
            yield line, target_from_body(body)
    for match in REFERENCE.finditer(visible):
        if any(a <= match.start() < b for a, b in occupied):
            continue
        key = " ".join((match[2] or match[1]).lower().split())
        line = visible.count("\n", 0, match.start()) + 1
        occupied.append(match.span())
        if key in definitions:
            yield line, definitions[key]
        else:
            errors.append(f"{label}:{line}: undefined link reference [{key}]")
    for match in re.finditer(r"!?\[([^\]\n]+)\]", visible):
        if any(a <= match.start() < b for a, b in occupied):
            continue
        key = " ".join(match[1].lower().split())
        if key in definitions:
            yield visible.count("\n", 0, match.start()) + 1, definitions[key]


def collect_files(root, errors):
    files = []
    def onerror(exc):
        errors.append(f"cannot enumerate package: {exc}")
    for directory, dirs, names in os.walk(root, followlinks=False, onerror=onerror):
        for name in list(dirs):
            path = Path(directory) / name
            if path.is_symlink():
                errors.append(f"symlink directory is not portable: {path.relative_to(root)}")
                dirs.remove(name)
        for name in names:
            path = Path(directory) / name
            if path.is_symlink():
                errors.append(f"symlink file is not portable: {path.relative_to(root)}")
            elif path.is_file():
                files.append(path)
    return sorted(files)


def sha256(path):
    value = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


def check_manifest(root, files, errors):
    entries = {}
    path = root / MANIFEST
    for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        match = re.fullmatch(r"([0-9a-fA-F]{64}) [ *](.+)", line)
        if not match:
            errors.append(f"{MANIFEST}:{number}: invalid checksum line")
            continue
        name = match[2]
        relative = Path(name)
        if relative.is_absolute() or ".." in relative.parts or "\\" in name or re.match(r"^[A-Za-z]:", name):
            errors.append(f"{MANIFEST}:{number}: unsafe relative path")
        elif name == MANIFEST:
            errors.append(f"{MANIFEST}:{number}: manifest must exclude itself")
        elif name in entries:
            errors.append(f"{MANIFEST}:{number}: duplicate path {name}")
        else:
            entries[name] = match[1].lower()
    actual = {p.relative_to(root).as_posix(): p for p in files if p.name != MANIFEST or p.parent != root}
    for name in sorted(entries.keys() - actual.keys()):
        errors.append(f"manifest file missing from package: {name}")
    for name in sorted(actual.keys() - entries.keys()):
        errors.append(f"package file missing from manifest: {name}")
    for name in sorted(actual.keys() & entries.keys()):
        if sha256(actual[name]) != entries[name]:
            errors.append(f"SHA256 mismatch: {name}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path)
    parser.add_argument("--check-manifest", action="store_true")
    parser.add_argument("--write-manifest", action="store_true")
    parser.add_argument("--force-manifest", action="store_true")
    parser.add_argument(
        "--raw-chat-sources", action="store_true",
        help="exclude only outbound navigation in raw Markdown under sources/local-chats/; preserve file, anchor, and manifest checks",
    )
    args = parser.parse_args()
    if args.force_manifest and not args.write_manifest:
        parser.error("--force-manifest requires --write-manifest")
    if args.check_manifest and args.write_manifest:
        parser.error("choose --check-manifest or --write-manifest")
    root = args.root.resolve()
    if not root.is_dir():
        parser.error("root must be an existing package directory")
    errors, cache, links = [], {}, 0
    navigation_checked = 0
    files = collect_files(root, errors)
    markdown = [p for p in files if p.suffix.lower() in {".md", ".markdown"}]
    raw_chat_sources = {
        p for p in markdown
        if args.raw_chat_sources and p.relative_to(root).parts[:2] == ("sources", "local-chats")
    }
    try:
        for path in markdown:
            cache[path] = path.read_text(encoding="utf-8-sig")
        anchor_cache = {p: anchors(t) for p, t in cache.items()}
        for source, content in cache.items():
            if source in raw_chat_sources:
                continue
            label = source.relative_to(root).as_posix()
            for line, target in markdown_links(content, errors, label):
                if not target:
                    continue
                if re.match(r"^[A-Za-z]:[\\/]", target) or target.startswith("/") and not target.startswith("//") or target.startswith("\\"):
                    errors.append(f"{label}:{line}: absolute local link is not portable: {target}")
                    continue
                parsed = urlsplit(target)
                if parsed.scheme.lower() in {"file", "sandbox"}:
                    errors.append(f"{label}:{line}: local URI is not portable: {target}")
                    continue
                if parsed.scheme or parsed.netloc:
                    continue
                links += 1
                destination_path = (source.parent / unquote(parsed.path)).resolve() if parsed.path else source
                if not destination_path.is_relative_to(root):
                    errors.append(f"{label}:{line}: link escapes package: {target}")
                elif not destination_path.exists():
                    errors.append(f"{label}:{line}: missing target: {target}")
                elif parsed.fragment and destination_path.is_file():
                    if destination_path.suffix.lower() in {".md", ".markdown", ".html", ".htm"}:
                        if destination_path not in anchor_cache:
                            data = destination_path.read_text(encoding="utf-8-sig")
                            anchor_cache[destination_path] = anchors(data)
                        if unquote(parsed.fragment) not in anchor_cache[destination_path]:
                            errors.append(f"{label}:{line}: missing anchor: {target}")
            navigation_checked += 1
        manifest = root / MANIFEST
        manifest_state = "not present"
        if args.write_manifest:
            if manifest.exists() and not args.force_manifest:
                errors.append("manifest exists; replacement requires --force-manifest")
            if not errors:
                rows = []
                for path in files:
                    if path != manifest:
                        name = path.relative_to(root).as_posix()
                        if "\n" in name or "\r" in name:
                            raise ValueError("manifest cannot represent a filename containing a newline")
                        rows.append(f"{sha256(path)}  {name}\n")
                with manifest.open("w" if args.force_manifest else "x", encoding="utf-8", newline="\n") as stream:
                    stream.writelines(rows)
                manifest_state = "written (self excluded)"
        elif manifest.exists():
            if manifest.is_symlink():
                errors.append("refuse symlink manifest")
            else:
                check_manifest(root, files, errors)
                manifest_state = "checked (self excluded)"
        elif args.check_manifest:
            errors.append("required MANIFEST.sha256 is missing")
    except (OSError, ValueError, UnicodeError) as exc:
        errors.append(str(exc))
        manifest_state = "not completed"
    report = {"status": "FAIL" if errors else "PASS", "root": str(root),
              "markdown_files": len(markdown),
              "markdown_navigation_checked": navigation_checked,
              "raw_chat_sources_enabled": args.raw_chat_sources,
              "raw_chat_outbound_skipped_count": len(raw_chat_sources),
              "raw_chat_outbound_skipped": sorted(p.relative_to(root).as_posix() for p in raw_chat_sources),
              "local_links_checked": links,
              "manifest": manifest_state, "errors": errors,
              "limits": "Structural checks only: semantic preservation, source truth, and test coverage require separate review. Markdown uses standard inline/reference links and explicit or GitHub-style heading anchors. With --raw-chat-sources, skipped source outbound references must have mappings or explicit gaps in 15_LOCAL_CHAT_INTAKE.md; exclusion does not establish that source content was read by an agent or semantically preserved."}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
