"""Check the maintained documentation entrypoints after path changes."""

from pathlib import Path
import re
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[2]
ENTRYPOINTS = (ROOT / 'README.md', ROOT / 'AGENTS.md', ROOT / 'mcp/README.md', ROOT / 'benchmark/README.md')


def slug(text):
    text = re.sub(r'<[^>]+>|[`*_~]', '', text.lower())
    return re.sub(r'\s', '-', re.sub(r'[^\w\-\s]', '', text))


def test_maintained_markdown_links_resolve():
    errors = []
    feature_root = ROOT / '.agents/features'
    active_features = sorted(path for path in feature_root.iterdir() if path.is_dir() and path.name != 'archive')
    maintained = sorted((ROOT / 'docs').rglob('*.md'))
    for directory in active_features:
        maintained.extend(sorted(directory.rglob('*.md')))
    for source in (*ENTRYPOINTS, *maintained):
        assert source.is_file(), source
        for link in re.findall(r'\]\(([^)]+)\)', source.read_text(encoding='utf-8-sig')):
            target, separator, anchor = link.partition('#')
            if re.match(r'^(?:https?:|mailto:)', target):
                continue
            path = (source.parent / unquote(target)).resolve() if target else source
            if not path.exists():
                errors.append(f'{source.relative_to(ROOT)}: {link}')
            elif separator and anchor and path.is_file() and path.suffix == '.md':
                contents = path.read_text(encoding='utf-8-sig')
                if match := re.fullmatch(r'L([1-9]\d*)(?:-L([1-9]\d*))?', anchor):
                    first, last = match.groups()
                    if not int(first) <= int(last or first) <= len(contents.splitlines()):
                        errors.append(f'{source.relative_to(ROOT)}: {link}')
                    continue
                headings = re.findall(r'^#{1,6}\s+(.+?)\s*#*$', contents, re.M)
                if unquote(anchor).lower() not in {slug(heading) for heading in headings}:
                    errors.append(f'{source.relative_to(ROOT)}: {link}')
    assert not errors, '\n'.join(errors)


def test_feature_pipeline_entrypoints_available():
    skill = ROOT / '.agents/skills/feature-pipeline'
    for reference in ('requirements', 'development', 'testing', 'knowledge'):
        assert (skill / 'references' / f'{reference}.md').is_file()
    for name in ('PRD', 'DEV', 'DEV_LOG', 'TEST_PLAN', 'TEST_REPORT', 'CLOSE'):
        assert (skill / 'assets/templates' / f'{name}.md').is_file()
