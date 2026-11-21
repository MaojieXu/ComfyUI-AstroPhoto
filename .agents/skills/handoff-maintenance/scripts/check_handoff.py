"""Read-only checks for AstroPhoto's Core and Module handoff maps."""

import argparse
import re
import subprocess
import sys
import unicodedata
from collections import Counter
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit


HANDOFF = Path(".agents/handoff")
CORE = HANDOFF / "core"
MODULE = HANDOFF / "module"
CORE_MAP = CORE / "repository-map.md"
MODULE_PREFIXES = {
    "backend": ("astrophoto/", "nodes/", "tests/", "scripts/", ".github/workflows/"),
    "frontend": ("frontend/", "js/", "locales/", "extension/siril/frontend/"),
    "mcp": ("mcp/",),
}
BACKEND_ROOT_FILES = {
    "__init__.py", ".comfyignore", ".python-version", "pyproject.toml", "requirements.txt", "uv.lock",
}
MAX_MARKDOWN_FILES = 20
SPLIT_THRESHOLD = 200_000
TICK = chr(96)
FENCE = re.compile(r"^ {0,3}(" + TICK + r"{3,}|~{3,})(.*)$")
TREE_EDGE = re.compile(r"^((?:│   |    )*)(?:├── |└── )(.*)$")
SNAPSHOT_COUNT = re.compile(r"树覆盖 \*\*([\d,]+) 个文件、([\d,]+) 个目录\*\*")
INLINE_CODE = re.compile(r"(" + TICK + r"+).*?\1")
DESTINATION = r'''(?:<([^>]+)>|((?:[^\s()]|\([^()\n]*\))+))'''
INLINE_LINK = re.compile(r"\]\(\s*" + DESTINATION + r"""(?:\s+["'][^"']*["'])?\s*\)""")
REFERENCE = re.compile(r"^\s{0,3}\[[^\]]+\]:\s*" + DESTINATION)
HTML_ID = re.compile(r"""<(?:a|[a-z][a-z0-9]*)\b[^>]*?\s(?:id|name)=["']([^"']+)["']""", re.I)
HTML_LINK = re.compile(r"""<a\b[^>]*?\shref=["']([^"']+)["']""", re.I)
AUTOLINK = re.compile(r"<([a-z][a-z0-9+.-]*:[^ <>]+|[^ <>@]+@[^ <>@]+)>", re.I)


def git(root, *args):
    return subprocess.check_output(["git", "-C", str(root), *args]).decode("utf-8")


def worktree_files(root):
    entries = git(root, "ls-files", "-z", "--cached", "--others", "--exclude-standard")
    return {name for name in entries.split("\0") if name and (root / name).is_file()}


def document_parts(text):
    """Return numbered prose lines and numbered lines inside plain-text fences."""
    prose, text_blocks = [], []
    marker = ""
    block = None
    for number, line in enumerate(text.splitlines(), 1):
        fence = FENCE.match(line)
        if marker:
            if fence and fence[1][0] == marker[0] and len(fence[1]) >= len(marker) and not fence[2].strip():
                marker, block = "", None
            elif block is not None:
                block.append((number, line))
        elif fence:
            marker = fence[1]
            if fence[2].strip() == "text":
                block = []
                text_blocks.append(block)
        else:
            prose.append((number, line))
    return prose, text_blocks


def tree_paths(doc, blocks, errors):
    files, directories = Counter(), Counter()
    for block in blocks:
        parents = []
        file_depth = None
        for number, line in block:
            edge = TREE_EDGE.match(line)
            if not edge:
                continue
            depth = len(edge[1]) // 4
            if file_depth is not None and depth > file_depth:
                continue
            file_depth = None
            name, separator, role = edge[2].partition(" — ")
            segment = name.removesuffix("/")
            if (
                depth > len(parents)
                or not separator
                or not role.strip()
                or segment in ("", ".", "..")
                or "/" in segment
                or "\\" in segment
            ):
                errors.append(f"{doc}:{number}: invalid tree entry: {edge[2]}")
                continue
            parents = parents[:depth]
            path = "/".join([*parents, segment])
            if name.endswith("/"):
                directories[path] += 1
                parents.append(segment)
            else:
                files[path] += 1
                file_depth = depth
    return files, directories


def anchors(prose):
    result = set()
    used_slugs = set()
    for _, line in prose:
        result.update(HTML_ID.findall(line))
        heading = re.match(r"^ {0,3}#{1,6}\s+(.+?)(?:\s+#+)?$", line)
        if heading:
            label = re.sub(r"\[([^\]]+)\]\([^)]*\)", r"\1", heading[1]).lower()
            slug = "".join(
                "-" if char == " " else char
                for char in label
                if char in " -_" or unicodedata.category(char)[0] in "LMN"
            )
            unique = slug
            suffix = 1
            while unique in used_slugs:
                unique = f"{slug}-{suffix}"
                suffix += 1
            used_slugs.add(unique)
            result.add(unique)
    return result


def check_links(root, prose_by_doc, errors):
    anchor_sets = {doc: anchors(prose) for doc, prose in prose_by_doc.items()}
    permitted = {root / doc: doc for doc in prose_by_doc}
    checked = 0
    for doc, prose in prose_by_doc.items():
        for number, line in prose:
            line = INLINE_CODE.sub("", line)
            targets = [match[1] or match[2] for match in INLINE_LINK.finditer(line)]
            if definition := REFERENCE.match(line):
                targets.append(definition[1] or definition[2])
            targets.extend(HTML_LINK.findall(line))
            targets.extend(AUTOLINK.findall(line))
            for target in targets:
                checked += 1
                try:
                    url = urlsplit(target)
                    local_path = unquote(url.path)
                    destination = root / doc
                    if local_path:
                        destination = destination.parent / local_path
                    linked_doc = permitted.get(destination.resolve())
                except (ValueError, OSError, RuntimeError):
                    linked_doc = None
                if (
                    not linked_doc
                    or url.scheme
                    or url.netloc
                    or url.query
                    or local_path.startswith(("/", "\\"))
                    or "\\" in local_path
                ):
                    errors.append(f"{doc}:{number}: invalid handoff link: {target}")
                elif doc.is_relative_to(CORE) and not linked_doc.is_relative_to(CORE):
                    errors.append(f"{doc}:{number}: Core link leaves Core: {target}")
                elif url.fragment and unquote(url.fragment) not in anchor_sets[linked_doc]:
                    errors.append(f"{doc}:{number}: missing link anchor: {target}")
    return checked


def directory_set(files):
    return {parent.as_posix() for name in files for parent in PurePosixPath(name).parents if parent != PurePosixPath(".")}


def duplicates(label, paths, errors):
    for path, count in sorted(paths.items()):
        if count > 1:
            errors.append(f"{label}: duplicate path ({count} entries): {path}")


def compare_paths(label, actual, expected, in_scope, errors):
    for path in sorted(expected - actual):
        if in_scope(path):
            errors.append(f"{label}: missing path: {path}")
    for path in sorted(actual - expected):
        if in_scope(path):
            errors.append(f"{label}: stale or out-of-scope path: {path}")


def check(root, full, changed):
    current_files = worktree_files(root)
    current_dirs = directory_set(current_files)
    selected = set(changed)
    selected_dirs = directory_set(selected) | selected

    def in_scope(path):
        return full or path in selected or any(
            parent.as_posix() in selected for parent in PurePosixPath(path).parents
        )

    errors, warnings = [], []
    core_docs = sorted(p.relative_to(root) for p in (root / CORE).rglob("*.md"))
    if len(core_docs) > MAX_MARKDOWN_FILES:
        errors.append(f"Core has {len(core_docs)} Markdown files; maximum is {MAX_MARKDOWN_FILES}")
    if CORE_MAP not in core_docs:
        errors.append(f"Core map is missing: {CORE_MAP}")

    module_docs = {}
    for folder in sorted((root / MODULE).glob("*")):
        if folder.is_dir():
            docs = sorted(p.relative_to(root) for p in folder.rglob("*.md"))
            module_docs[folder.name] = docs
            if len(docs) > MAX_MARKDOWN_FILES:
                errors.append(f"Module {folder.name} has {len(docs)} Markdown files; maximum is {MAX_MARKDOWN_FILES}")
    for endpoint in sorted(MODULE_PREFIXES.keys() - module_docs.keys()):
        errors.append(f"Missing Module endpoint: {endpoint}")

    prose_by_doc = {}
    core_files, core_dirs = Counter(), Counter()
    module_files = {}
    module_dirs = {}
    for doc in core_docs + [doc for docs in module_docs.values() for doc in docs]:
        text = (root / doc).read_text(encoding="utf-8-sig")
        prose, blocks = document_parts(text)
        prose_by_doc[doc] = prose
        if doc == CORE_MAP:
            core_files, core_dirs = tree_paths(doc, blocks, errors)
            counts = SNAPSHOT_COUNT.search("\n".join(line for _, line in prose))
            declared = tuple(int(value.replace(",", "")) for value in counts.groups()) if counts else None
            if declared != (len(core_files), len(core_dirs)):
                errors.append(f"Core snapshot counts: declared {declared}, tree has {len(core_files)} files and {len(core_dirs)} directories")
        elif doc.is_relative_to(MODULE):
            endpoint = doc.relative_to(MODULE).parts[0]
            paths, directories = tree_paths(doc, blocks, errors)
            module_dirs.setdefault(endpoint, set()).update(directories)
            module_files.setdefault(endpoint, Counter()).update(paths)
            if len(text) > SPLIT_THRESHOLD:
                warnings.append(f"{doc}: {len(text):,} Unicode characters; consider splitting if space allows")

    duplicates("Core files", core_files, errors)
    duplicates("Core directories", core_dirs, errors)
    compare_paths("Core files", set(core_files), current_files, in_scope, errors)
    def directory_in_scope(path):
        return path in selected_dirs or in_scope(path)

    compare_paths("Core directories", set(core_dirs), current_dirs, directory_in_scope, errors)
    duplicates("All Module maps", sum(module_files.values(), Counter()), errors)
    for endpoint, paths in module_files.items():
        if endpoint in MODULE_PREFIXES:
            expected = {path for path in current_files if path.startswith(MODULE_PREFIXES[endpoint])}
            if endpoint == "backend":
                expected |= current_files & BACKEND_ROOT_FILES
                expected |= {path for path in current_files if path.startswith("extension/") and path.endswith(".py")}
            if endpoint == "frontend":
                expected |= current_files & {"extension/frontend-entry.ts"}
        else:
            expected = current_files & set(paths)
        compare_paths(f"Module {endpoint}", set(paths), expected, in_scope, errors)
        compare_paths(f"Module {endpoint} directories", module_dirs[endpoint],
                      directory_set(expected), directory_in_scope, errors)

    links = check_links(root, prose_by_doc, errors)
    for warning in warnings:
        print(f"NOTE: {warning}")
    for error in errors:
        print(f"ERROR: {error}", file=sys.stderr)
    print(f"Core: {len(core_files)} files, {len(core_dirs)} directories, {len(core_docs)} Markdown files")
    for endpoint, docs in module_docs.items():
        print(f"Module {endpoint}: {len(module_files.get(endpoint, {}))} files, {len(docs)} Markdown files")
    scope = "full" if full else f"{len(selected)} selected paths" if selected else "structure only"
    print(f"Checked {links} handoff links ({scope}); {len(errors)} structural errors")
    return 1 if errors else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--full", action="store_true", help="compare both maps against the whole working tree")
    parser.add_argument("paths", nargs="*", help="repository-relative changed paths, including deleted paths")
    args = parser.parse_args()
    if args.full and args.paths:
        parser.error("choose --full or specific paths")
    changed = []
    for value in args.paths:
        path = PurePosixPath(value.replace("\\", "/"))
        if not path.parts or path.is_absolute() or ".." in path.parts or ":" in path.parts[0]:
            parser.error(f"expected a repository-relative path: {value}")
        changed.append(path.as_posix())
    try:
        root = Path(git(Path.cwd(), "rev-parse", "--show-toplevel").strip())
        return check(root, args.full, changed)
    except (OSError, subprocess.CalledProcessError, UnicodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
