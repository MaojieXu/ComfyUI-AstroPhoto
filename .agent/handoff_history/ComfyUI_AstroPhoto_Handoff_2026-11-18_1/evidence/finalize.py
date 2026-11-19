"""Assemble the handoff and verify that project content was preserved."""
from collections import Counter
from hashlib import sha256
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote

root = Path.cwd()
out = Path(__file__).resolve().parent.parent
evidence = out / 'evidence'

def read(path):
    return path.read_text(encoding='utf-8-sig')

def write(path, text):
    path.write_text(text.rstrip() + '\n', encoding='utf-8')

def digest(path):
    return sha256(path.read_bytes()).hexdigest() if path.is_file() else None

main = sorted(out.glob('[0-9][0-9]_*.md'))
assert len(main) == 15, f'Expected 15 Markdown chapters, got {len(main)}'
reports = sorted((evidence / 'subagents').glob('*.md'))
assert len(reports) == 6, f'Expected six source reports, got {len(reports)}'
toc = '\n'.join(f'- [{path.stem}]({path.name})' for path in main)
txt = ['# ComfyUI AstroPhoto · FULL HANDOFF · 2026-11-18', '',
       '本文件收录主交接各专题以及六个静态审计附录。运行结果、旧决策纠正与证据边界以主交接章节为准。',
       '命令原始日志、完整用例账本、输入与源码哈希位于 evidence/。', '', toc]
for path in main:
    txt.extend(('\n---\n', read(path).strip()))
for path in reports:
    content = read(path).strip()
    txt.extend(('\n---\n', '## 静态审计附录 · ' + path.stem, '', content))
write(out/'FULL_HANDOFF.md','\n'.join(txt))

prefix = out.relative_to(root).as_posix() + '/'
snapshot = json.loads(read(evidence/'source-hashes.json'))
modified = [(path, old, digest(root/path)) for path,old in snapshot.items() if digest(root/path)!=old]
cmd = ['git','-c','core.quotePath=false','status','--porcelain=v1','--branch','--untracked-files=all']
after = subprocess.check_output(cmd).decode('utf-8').splitlines()
before = read(evidence/'git-status-before.txt').splitlines()
filtered = [line for line in after if not line[3:].strip('"').startswith(prefix)]
difference = sorted(set(filtered)^set(before))
outside = [line for line in after if line not in filtered]
write(evidence/'git-status-after.txt', '\n'.join(after))

inputs = {name:sha for name,sha in snapshot.items() if name.startswith('.artifact/Handoff/')}
actual_inputs={p.relative_to(root).as_posix() for p in (root/'.artifact/Handoff').rglob('*') if p.is_file()}
assert inputs.keys() == actual_inputs
archived_inputs=Counter(name.split('/')[2] for name in inputs)

# Verify package-relative links across original and synthesized Markdown chapters.
links = []
for path in list(out.rglob('*.md')):
    if path.name=='MANIFEST.md':
        continue
    for target in re.findall(r'\]\(([^)\s]+\.md|[^)\s]+\.(?:txt|json|log|xml))\)',read(path)):
        if re.match(r'(?:[a-z]+://|[A-Z]:/)',target,re.I):
            continue
        candidate=(path.parent/unquote(target)).resolve()
        if not candidate.is_file():
            links.append((path.relative_to(out).as_posix(),target))

feature_data = read(out/'04_COMPLETE_FEATURE_INVENTORY.md')
guard_data = read(out/'05_DEFENSIVE_PROGRAMMING_AUDIT.md')
feature_ids = re.findall(r'^\| ([A-Z]-\d{2}) ',feature_data,re.M)
guard_ids = re.findall(r'^\| (G[A-Z]-\d{2}) ',guard_data,re.M)
guard_links = set(re.findall(r'\bG[A-Z]-\d{2}\b',feature_data))
assert len(feature_ids)==len(set(feature_ids))
assert len(guard_ids)==len(set(guard_ids))
assert not (guard_links-set(guard_ids)), sorted(guard_links-set(guard_ids))
assert not modified, modified
assert not difference, difference
assert not links, links
stats=Counter(line[:2] for line in before[1:])
write(evidence/'integrity.txt','\n'.join([
    '2026-11-18 — Handoff integrity',
    f'Git before: tracked-status lines {sum(n for k,n in stats.items() if k!="??")}, untracked {stats["??"]}.',
    f'Git after: {len(outside)} untracked handoff paths currently visible (ignored test-results excluded); outside-handoff status identical.',
    f'Baseline SHA-256 checked {len(snapshot)} paths; content changes outside handoff {len(modified)}.',
    'Input recursive presence/hash ledger: '+json.dumps(archived_inputs,ensure_ascii=False)+f'; total {len(inputs)}; unique SHA-256 {len(set(inputs.values()))}.',
    f'Top-level numbered chapters {len(main)}; static subreports {len(reports)}; mandatory shape present.',
    f'Unique Feature IDs {len(feature_ids)} and Guard IDs {len(guard_ids)}; broken Feature→Guard references {len(guard_links-set(guard_ids))}.',
    f'Missing relative file links {len(links)}. Remote link availability excluded; supplemental equipment share read timed out.',
    'Scope: static input/feature/guard semantics partially sampled only where specified in main and subreports.',
    'Manifest: all shipped artifacts except MANIFEST.md itself are independently re-hashed after manifest creation.'
]))
files=sorted((p for p in out.rglob('*') if p.is_file() and p.name!='MANIFEST.md'))
rows=[(path.relative_to(out).as_posix(),path.stat().st_size,digest(path)) for path in files]
manifest=['# Handoff 文件清单与 SHA-256','','清单自身除外，大小单位为字节。未生成 ZIP。','',
          '| 路径 | Bytes | SHA-256 |','|---|---:|---|']
manifest += [f'| {name} | {size} | {sha} |' for name,size,sha in rows]
write(out/'MANIFEST.md','\n'.join(manifest))
manifest_rows=[(name,int(size),sha) for name,size,sha in re.findall(r'^\| (.*?) \| (\d+) \| ([a-f0-9]{64}) \|$',read(out/'MANIFEST.md'),re.M)]
assert manifest_rows==rows
for name,size,sha in manifest_rows:
    target=out/name
    assert target.stat().st_size==size and digest(target)==sha, name
print(read(evidence/'integrity.txt'))
print('Manifest independent verification:',len(rows),'files')

