# Backend 文件地图 · 测试、构建与发布

[本端实现](implementation.md) · [仓库地图](../../core/repository-map.md)

覆盖 25 个文件。文件名后的职责和子节点一起阅读。L 为该文件中的工作树行号；变量赋值和读取穿插在对应执行步骤中。

项目内导入记录可定位到仓库文件的依赖。分支下列出满足条件时的操作；函数和回调随调用而执行。提前返回、跳过、抛错、捕获和清理就地标注。依赖抛出的异常沿调用栈传递，遇到捕获分支后按该分支处理。省略号代表较长的表达式摘录。测试断言属于静态核对。

````text
backend/（逻辑分组；子路径相对仓库根）
├── .comfyignore — Registry 打包排除清单，去掉 MCP 源码、开发环境、测试、文档和运行数据，保留 js 与 locales。
│   └── 生效值
│       ├── .git/
│       ├── .github/
│       ├── .agents/
│       ├── .artifact/
│       ├── .codegraph/
│       ├── .venv/
│       ├── .venv-backup-*/
│       ├── .python-version
│       ├── node_modules/
│       ├── frontend/
│       ├── mcp/
│       ├── reference/
│       ├── tests/
│       ├── conftest.py
│       ├── scripts/
│       ├── docs/
│       ├── doc/
│       ├── dist/
│       ├── build/
│       ├── **/__pycache__/
│       ├── *.pyc
│       ├── *.db
│       ├── *.sqlite
│       ├── *.sqlite3
│       ├── *.log
│       ├── *.tmp
│       ├── *.egg-info/
│       ├── .pytest_cache/
│       ├── .ruff_cache/
│       ├── AGENT.md
│       ├── AGENTS.md
│       ├── uv.lock
│       ├── .gitignore
│       ├── .gitattributes
│       ├── .comfyignore
│       ├── .editorconfig
│       ├── .pre-commit-config.yaml
│       ├── node.zip
│       ├── .astrophoto/
│       ├── *.db-wal
│       ├── *.db-shm
│       ├── *.db-journal
│       └── *.lock
├── .github/ — GitHub Actions 与仓库托管侧配置，覆盖持续验证和双包发布。
│   └── workflows/ — CI 与发版编排，发布复用 CI 测试过的构件。
│       ├── ci.yml — Python 3.11/3.12、Node 22 矩阵与冻结依赖，运行两类前端测试、代理检查、Python/MCP 测试、构件边界和隔离安装；上传 3.12 构件。
│       │   └── 步骤、入口与条件
│       │       ├── name: CI
│       │       ├── - uses: actions/checkout@v4
│       │       ├── - uses: actions/setup-node@v4
│       │       ├── - uses: pnpm/action-setup@v4
│       │       ├── - uses: astral-sh/setup-uv@v6
│       │       ├── - run: uv sync --frozen
│       │       ├── - run: pnpm --dir frontend install --frozen-lockfile
│       │       ├── - run: pnpm -C frontend typecheck
│       │       ├── - run: pnpm -C frontend lint
│       │       ├── - name: React Sidebar (Jest and RTL)
│       │       ├── run: pnpm -C frontend test:react
│       │       ├── - run: pnpm --dir frontend exec playwright install --with-deps chromium
│       │       ├── - name: Vue components and widgets (Vitest Chromium)
│       │       ├── run: pnpm -C frontend test
│       │       ├── - run: pnpm -C frontend check:build
│       │       ├── - run: pnpm -C frontend check:proxy
│       │       ├── - run: uv run ruff check astrophoto nodes mcp/src mcp/tests scripts tests __init__.py
│       │       ├── - name: Extension unit tests (host API doubles)
│       │       ├── run: uv run pytest tests/nodes tests/backend
│       │       ├── - name: Native aiohttp integration (no ComfyUI process)
│       │       ├── run: uv run pytest tests/integration -m "not host"
│       │       ├── - name: Distribution boundaries
│       │       ├── run: uv run pytest tests/packaging
│       │       ├── - name: Independent MCP server and client
│       │       ├── run: uv run --project mcp pytest mcp/tests
│       │       ├── - run: uv run python scripts/release.py check
│       │       ├── - if: startsWith(github.ref, 'refs/tags/')
│       │       ├── run: uv run python scripts/release.py check --tag "$GITHUB_REF_NAME"
│       │       ├── - name: Build isolated MCP distributions after tests
│       │       ├── run: uv build mcp --no-sources --out-dir dist/mcp
│       │       ├── - name: Stage and verify Registry package
│       │       ├── run: |
│       │       ├── - name: Verify independent installation and stdio
│       │       ├── run: |
│       │       ├── - uses: actions/upload-artifact@v4
│       │       ├── if: matrix.python == '3.12'
│       │       └── name: distributions
│       └── release.yml — 在 v* tag 复用 CI，先以 Trusted Publishing 发布 MCP，再确认公开 PyPI 安装与握手，最后发布暂存 Registry 包。
│           └── 步骤、入口与条件
│               ├── name: Release lockstep packages
│               ├── uses: ./.github/workflows/ci.yml
│               ├── needs: verify
│               ├── - uses: actions/download-artifact@v4
│               ├── name: distributions
│               ├── - name: Publish MCP using PyPI Trusted Publishing
│               ├── uses: pypa/gh-action-pypi-publish@release/v1
│               ├── needs: pypi
│               ├── - uses: actions/checkout@v4
│               ├── - uses: astral-sh/setup-uv@v6
│               ├── - run: uv sync --frozen
│               ├── - uses: actions/download-artifact@v4
│               ├── name: distributions
│               ├── - name: Confirm public PyPI installation before Registry publication
│               ├── run: |
│               ├── - name: Verify and extract the tested Registry artifact
│               ├── run: |
│               ├── - name: Publish the staged extension with fixed MCP requirement
│               ├── working-directory: dist/registry
│               └── run: ../../.venv/bin/comfy node publish --token "$COMFY_REGISTRY_TOKEN"
├── .python-version — 指定开发默认 Python 3.12；发行下限另由两个 pyproject 定义。
│   └── 生效值
│       └── 3.12
├── pyproject.toml — 根项目版本与 Registry 元数据，声明锁步 MCP 和运行依赖、uv workspace、Python 下限及 pytest/Ruff/mypy 设置。
│   └── 配置与默认值
│       ├── project
│       │   ├── name ← ComfyUI_AstroPhoto
│       │   ├── version ← 0.0.1
│       │   ├── description ← An astrophotography toolkit for ComfyUI featuring astronomical image asset management, established astronomy software exposed as workflow nodes, an image-processing knowledge base, and MCP interfaces for workflow creation and exec
│       │   ├── authors ← [{'name': 'MaojieXu', 'email': 'maojiexu16@gmail.com'}]
│       │   ├── readme ← README.md
│       │   ├── license ← {'text': 'GNU General Public License v3'}
│       │   ├── requires-python ← >=3.11
│       │   ├── classifiers ← []
│       │   ├── dependencies ← ['astrophoto-mcp==0.0.1', 'SQLAlchemy>=2,<3', 'alembic>=1.13,<2', 'filelock>=3.16,<5', 'astropy>=6.1,<8', 'pillow>=10,<14']
│       │   └── urls ← {'Repository': 'https://github.com/MaojieXu/ComfyUI-AstroPhoto', 'BugTracker': 'https://github.com/MaojieXu/ComfyUI-AstroPhoto/issues', 'Documentation': 'https://github.com/MaojieXu/ComfyUI-AstroPhoto/wiki'}
│       ├── dependency-groups
│       │   └── dev ← ['aiohttp>=3.9,<4', 'pytest>=8,<9', 'pathspec>=0.12,<1', 'tomli-w>=1,<2', 'ruff>=0.11,<1', 'comfy-cli>=1.16,<2']
│       └── tool
│           ├── uv ← {'package': False, 'workspace': {'members': ['mcp']}, 'sources': {'astrophoto-mcp': {'workspace': True}}}
│           ├── comfy ← {'PublisherId': 'MaojieXu', 'DisplayName': 'ComfyUI-AstroPhoto', 'Icon': '', 'Tags': [], 'Repository': 'https://github.com/MaojieXu/ComfyUI-AstroPhoto', 'includes': ['js', 'locales']}
│           ├── pytest ← {'ini_options': {'minversion': '8.0', 'testpaths': ['tests/nodes', 'tests/packaging', 'tests/backend', 'tests/integration'], 'markers': ['host: requires a real running ComfyUI host; opt in with COMFYUI_TEST_URL'], 'addopts': '--im
│           ├── mypy ← {'files': '.', 'strict': True, 'warn_unreachable': True, 'warn_no_return': True, 'overrides': [{'module': 'tests.*', 'allow_untyped_defs': True, 'disable_error_code': 'attr-defined'}]}
│           └── ruff ← {'line-length': 140, 'src': ['nodes', 'mcp/src', 'tests'], 'target-version': 'py311', 'extend-exclude': ['reference', '.agents', '.codegraph'], 'lint': {'select': ['S102', 'S307', 'W293', 'F'], 'flake8-quotes': {'inline-quotes': '
├── requirements.txt — 从源码安装 Extension 时使用本地 ./mcp 和运行依赖；Registry 暂存时换成同版本 PyPI pin。
│   └── 生效值
│       ├── ./mcp
│       ├── SQLAlchemy>=2,<3
│       ├── alembic>=1.13,<2
│       ├── filelock>=3.16,<5
│       ├── astropy>=6.1,<8
│       └── Pillow>=10,<14
├── scripts/ — 发布版本同步、包边界校验及隔离安装探针。
│   ├── check_install.py — 临时 venv 安装 wheel 或公共 PyPI pin，验证版本、stdio 握手、工具枚举与 version 调用。
│   │   ├── 项目内导入
│   │   │   └── __version__ ← mcp/src/astrophoto_mcp/__init__.py（L14），用于 if __version__ != expected: / raise RuntimeError(f"Installed {__version__}, expected {expected}")
│   │   ├── 异步函数 probe(expected: str) → None [L12]
│   │   │   ├── 若 __version__ != expected [L18]
│   │   │   │   └── 抛出 RuntimeError(f'Installed {__version__}, expected {expected}') [L19]
│   │   │   ├── 进入上下文 anyio.fail_after(30)，退出时交由上下文释放资源 [L20]
│   │   │   │   ├── transport ← StdioTransport(command=sys.executable, args=['-I', '-m', 'astrophoto_mcp'])；transport 在 L22 读 [L21]
│   │   │   │   └── 进入上下文 Client(transport, mode='legacy', auto_initialize=False) → client，退出时交由上下文释放资源 [L22]
│   │   │   │       ├── 执行 await client.initialize() [L23]
│   │   │   │       ├── tools ← await client.list_tools()；tools 在 L25 读 [L24]
│   │   │   │       ├── 若 {tool.name for tool in tools} != {'version', 'connection_status'} [L25]
│   │   │   │       │   └── 抛出 RuntimeError('Unexpected tool contract') [L26]
│   │   │   │       ├── result ← await client.call_tool('version', {})；result 在 L28 读 [L27]
│   │   │   │       └── 若 result.is_error or json.loads(result.content[0].text)['version'] != expected [L28]
│   │   │   │           └── 抛出 RuntimeError('Installed stdio server returned an invalid version') [L29]
│   │   │   └── 执行 print(f'Independent install + stdio handshake/tool call passed: {expected}') [L30]
│   │   ├── 函数 main() → None [L33]
│   │   │   ├── parser ← argparse.ArgumentParser(description=__doc__)；parser 在 L35、36、37、38 读 [L34]
│   │   │   ├── 执行 parser.add_argument('requirement', help='Wheel path or astrophoto-mcp==X.Y.Z') [L35]
│   │   │   ├── 执行 parser.add_argument('--version', required=True) [L36]
│   │   │   ├── 执行 parser.add_argument('--probe', action='store_true', help=argparse.SUPPRESS) [L37]
│   │   │   ├── args ← parser.parse_args()；args 在 L39、40、42、52 读 [L38]
│   │   │   ├── 若 args.probe [L39]
│   │   │   │   ├── 执行 asyncio.run(probe(args.version)) [L40]
│   │   │   │   └── 提前返回 None [L41]
│   │   │   ├── requirement ← str(Path(args.requirement).resolve()) if Path(args.requirement).is_file() else args.requirement；requirement 在 L50、51 读 [L42]
│   │   │   └── 进入上下文 tempfile.TemporaryDirectory(prefix='astrophoto-install-') → temp，退出时交由上下文释放资源 [L43]
│   │   │       ├── venv ← Path(temp) / 'venv'；venv 在 L45、46 读 [L44]
│   │   │       ├── 执行 subprocess.run(['uv', 'venv', str(venv), '--python', sys.executable], check=True) [L45]
│   │   │       ├── python ← venv / ('Scripts/python.exe' if sys.platform == 'win32' else 'bin/python')；python 在 L49、51 读 [L46]
│   │   │       ├── 执行 subprocess.run(['uv', 'pip', 'install', '--no-config', '--no-cache', '--python', str(python), '--index-url', 'https://pypi.org/simple', requirement], check=True, cwd=temp… [L49]
│   │   │       └── 执行 subprocess.run([str(python), '-I', str(Path(__file__).resolve()), requirement, '--version', args.version, '--probe'], check=True, cwd=temp, timeout=45) [L51]
│   │   └── 若 __name__ == '__main__' [L55]
│   │       └── 执行 main() [L56]
│   ├── release.py — 核对并同步根/MCP 版本及许可证，暂存 Registry ZIP、替换依赖 pin，校验 ZIP、wheel 和 sdist 文件范围。
│   └── siril_locales.py — 从命令注册表生成原生节点和类别翻译，检查同步。
│       ├── 尝试 [L15]
│       ├── 捕获 ModuleNotFoundError [L17]
│       ├── ROOT ← Path(__file__).resolve().parents[1]；ROOT 在 L34、38、54、70、123 等 6 处 读 [L20]
│       ├── STABLE_SEMVER ← re.compile('(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)\\Z')；STABLE_SEMVER 在 L41、56 读 [L21]
│       ├── 函数 chdir(path: Path) [L25]
│       │   ├── previous ← Path.cwd()；previous 在 L31 读 [L26]
│       │   ├── 执行 os.chdir(path) [L27]
│       │   ├── 尝试 [L28]
│       │   │   └── 产出并暂停 (yield) [L29]
│       │   └── finally 退出清理 [L28]
│       │       └── 执行 os.chdir(previous) [L31]
│       ├── 函数 metadata(root: Path=ROOT) → dict [L34]
│       │   └── 返回 tomllib.loads((root / 'pyproject.toml').read_text(encoding='utf-8')) [L35]
│       ├── 函数 check_versions(root: Path=ROOT, tag: str | None=None) → str [L38]
│       │   ├── project ← metadata(root)['project']；project 在 L40、45 读 [L39]
│       │   ├── version ← project['version']；version 在 L41、43、45、47、48 等 6 处 读 [L40]
│       │   ├── 若 not STABLE_SEMVER.fullmatch(version) [L41]
│       │   │   └── 抛出 ValueError('Use a stable SemVer X.Y.Z version') [L42]
│       │   ├── 若 metadata(root / 'mcp')['project']['version'] != version [L43]
│       │   │   └── 抛出 ValueError('MCP version differs from root version') [L44]
│       │   ├── 若 f'astrophoto-mcp=={version}' not in project['dependencies'] [L45]
│       │   │   └── 抛出 ValueError('Extension must pin the matching MCP version') [L46]
│       │   ├── 若 tag is not None and tag != f'v{version}' [L47]
│       │   │   └── 抛出 ValueError(f'Tag {tag!r} does not match v{version}') [L48]
│       │   ├── 若 (root / 'LICENSE').read_bytes() != (root / 'mcp/LICENSE').read_bytes() [L49]
│       │   │   └── 抛出 ValueError('MCP license differs from root LICENSE') [L50]
│       │   └── 返回 version [L51]
│       ├── 函数 sync_version(version: str | None=None, root: Path=ROOT) → str [L54]
│       │   ├── version ← version or metadata(root)['project']['version']；version 在 L55、56、60、64 读 [L55]
│       │   ├── 若 not STABLE_SEMVER.fullmatch(version) [L56]
│       │   │   └── 抛出 ValueError('Use a stable SemVer X.Y.Z version') [L57]
│       │   ├── 循环 path ← (root / 'pyproject.toml', root / 'mcp/pyproject.toml') [L58]
│       │   │   ├── text ← path.read_text(encoding='utf-8')；text 在 L60、64、65 读 [L59]
│       │   │   ├── (text, count) ← re.subn('^version = "[^"]+"$', f'version = "{version}"', text, count=1, flags=re.M)；text 在 L60、64、65 读，count 在 L61 读 [L60]
│       │   │   ├── 若 count != 1 [L61]
│       │   │   │   └── 抛出 ValueError(f'Missing literal version in {path}') [L62]
│       │   │   ├── 若 path.parent == root [L63]
│       │   │   │   └── text ← re.sub('astrophoto-mcp==[^"\\s]+', f'astrophoto-mcp=={version}', text)；text 在 L60、64、65 读 [L64]
│       │   │   └── 执行 path.write_text(text, encoding='utf-8') [L65]
│       │   ├── 执行 shutil.copyfile(root / 'LICENSE', root / 'mcp/LICENSE') [L66]
│       │   └── 返回 check_versions(root) [L67]
│       ├── 函数 registry_files(root: Path=ROOT) → list[str] — Include uncommitted new files for local review, filtered like Registry. [L70]
│       │   ├── spec ← PathSpec.from_lines('gitwildmatch', (root / '.comfyignore').read_text(encoding='utf-8').splitlines())；spec 在 L78 读 [L74]
│       │   ├── output ← subprocess.check_output(['git', 'ls-files', '-z', '--cached', '--others', '--exclude-standard'], cwd=root).decode('utf-8')；output 在 L78 读 [L75]
│       │   ├── files ← {name for name in output.split('\x00') if name and (not spec.match_file(name)) and (root / name).is_file()}；files 在 L79、81 读 [L78]
│       │   ├── 若 any(((root / name).is_symlink() for name in files)) [L79]
│       │   │   └── 抛出 ValueError('Registry input must not contain symbolic links') [L80]
│       │   └── 返回 sorted(files) [L81]
│       ├── 函数 check_registry(path: Path, version: str) → list[str] [L84]
│       │   └── 进入上下文 zipfile.ZipFile(path) → archive，退出时交由上下文释放资源 [L85]
│       │       ├── names ← archive.namelist()；names 在 L99、100、101、105、120 读 [L86]
│       │       ├── required ← {'__init__.py', 'nodes/__init__.py', 'nodes/ComfyUIFEExampleVueBasic.py', 'astrophoto/bootstrap.py', 'astrophoto/api/routes.py', 'astrophoto/api/status.py', 'astrophoto/c…；required 在 L99、100 读 [L87]
│       │       ├── 若 not required.issubset(names) [L99]
│       │       │   └── 抛出 ValueError(f'Missing Registry files: {required - set(names)}') [L100]
│       │       ├── 若 {name for name in names if name.startswith('js/') and name.endswith('.js')} != {'js/main.js'} [L101]
│       │       │   └── 抛出 ValueError('Registry must ship exactly one AstroPhoto JavaScript entry') [L102]
│       │       ├── allowed_roots ← {'nodes', 'astrophoto', 'js', 'locales'}；allowed_roots 在 L113 读 [L103]
│       │       ├── allowed_files ← {'__init__.py', 'pyproject.toml', 'requirements.txt', 'LICENSE', 'README.md'}；allowed_files 在 L113 读 [L104]
│       │       ├── 循环 name ← names [L105]
│       │       │   ├── parts ← Path(name).parts；parts 在 L110、112、113 读 [L106]
│       │       │   ├── prohibited ← {'.pyc', '.db', '.sqlite', '.sqlite3', '.log', '.tmp'}；prohibited 在 L111 读 [L107]
│       │       │   ├── private ← {'.astrophoto', 'databases', 'runtime', '.staging', 'objects', 'outputs', 'backups'}；private 在 L110 读 [L108]
│       │       │   ├── suffix ← Path(name).suffix；suffix 在 L111、112 读 [L109]
│       │       │   └── 若 '..' in parts or '__pycache__' in parts or private.intersection(parts) or (suffix in prohibited) or name.endswith(('-wal', '-shm', '-journal', '.lock')) or (parts[0] in {… [L110]
│       │       │       └── 抛出 ValueError(f'Unexpected Registry content: {name}') [L114]
│       │       ├── project ← tomllib.loads(archive.read('pyproject.toml').decode())['project']；project 在 L116、118 读 [L115]
│       │       ├── 若 project['version'] != version or f'astrophoto-mcp=={version}' not in project['dependencies'] [L116]
│       │       │   └── 抛出 ValueError('Registry metadata version/dependency mismatch') [L117]
│       │       ├── 若 archive.read('requirements.txt').decode().splitlines() != project['dependencies'] [L118]
│       │       │   └── 抛出 ValueError('Registry requirements must use PyPI, not a local source') [L119]
│       │       └── 返回 sorted(names) [L120]
│       ├── 函数 build_registry(output: Path, root: Path=ROOT) → Path — Stage runtime files, replace development-only metadata, use official packer. [L123]
│       │   ├── version ← check_versions(root)；version 在 L147 读 [L128]
│       │   ├── output ← output.resolve()；output 在 L129、130、146、147、148 读 [L129]
│       │   ├── 执行 output.parent.mkdir(parents=True, exist_ok=True) [L130]
│       │   ├── 进入上下文 tempfile.TemporaryDirectory(prefix='astrophoto-registry-') → temp，退出时交由上下文释放资源 [L131]
│       │   │   ├── stage ← Path(temp)；stage 在 L134、139、140、143、144 等 6 处 读 [L132]
│       │   │   ├── 循环 name ← registry_files(root) [L133]
│       │   │   │   ├── destination ← stage / name；destination 在 L135、136 读 [L134]
│       │   │   │   ├── 执行 destination.parent.mkdir(parents=True, exist_ok=True) [L135]
│       │   │   │   └── 执行 shutil.copyfile(root / name, destination) [L136]
│       │   │   ├── config ← metadata(root)；config 在 L138 读 [L137]
│       │   │   ├── runtime ← {'project': config['project'], 'tool': {'comfy': config['tool']['comfy']}}；runtime 在 L139、140、146 读 [L138]
│       │   │   ├── 执行 (stage / 'pyproject.toml').write_text(tomli_w.dumps(runtime), encoding='utf-8') [L139]
│       │   │   ├── 执行 (stage / 'requirements.txt').write_text('\n'.join(runtime['project']['dependencies']) + '\n', encoding='utf-8') [L140]
│       │   │   ├── 执行 subprocess.run(['git', 'init', '-q'], cwd=stage, check=True) [L143]
│       │   │   ├── 执行 subprocess.run(['git', 'add', '.'], cwd=stage, check=True, capture_output=True) [L144]
│       │   │   └── 进入上下文 chdir(stage)，退出时交由上下文释放资源 [L145]
│       │   │       └── 执行 zip_files(str(output), includes=runtime['tool']['comfy']['includes']) [L146]
│       │   ├── 执行 check_registry(output, version) [L147]
│       │   └── 返回 output [L148]
│       ├── 函数 check_wheel(path: Path, version: str) → list[str] [L151]
│       │   └── 进入上下文 zipfile.ZipFile(path) → archive，退出时交由上下文释放资源 [L152]
│       │       ├── names ← archive.namelist()；names 在 L154、159、161、164 读 [L153]
│       │       ├── 循环 name ← names [L154]
│       │       │   ├── top ← name.split('/')[0]；top 在 L156 读 [L155]
│       │       │   └── 若 top not in {'astrophoto_mcp', f'astrophoto_mcp-{version}.dist-info'} [L156]
│       │       │       └── 抛出 ValueError(f'Unexpected MCP wheel content: {name}') [L157]
│       │       ├── 循环 module ← ('__init__', '__main__', 'server', 'client', 'config', 'api/__init__', 'api/comfy', 'api/equipment', 'tools/__init__', 'tools/status', 'tools/equipment') [L158]
│       │       │   └── 若 f'astrophoto_mcp/{module}.py' not in names [L159]
│       │       │       └── 抛出 ValueError(f'Missing MCP module: {module}') [L160]
│       │       ├── info ← [name for name in names if name.endswith('.dist-info/METADATA')]；info 在 L162 读 [L161]
│       │       ├── 若 len(info) != 1 or Parser().parsestr(archive.read(info[0]).decode())['Version'] != version [L162]
│       │       │   └── 抛出 ValueError('MCP wheel version mismatch') [L163]
│       │       └── 返回 sorted(names) [L164]
│       ├── 函数 check_sdist(path: Path, version: str) → list[str] [L167]
│       │   ├── prefix ← f'astrophoto_mcp-{version}/'；prefix 在 L172、173、178 读 [L168]
│       │   └── 进入上下文 tarfile.open(path) → archive，退出时交由上下文释放资源 [L169]
│       │       ├── names ← archive.getnames()；names 在 L181 读 [L170]
│       │       ├── 循环 member ← archive.getmembers() [L171]
│       │       │   ├── name ← member.name.removeprefix(prefix)；name 在 L173、175、176、177 读 [L172]
│       │       │   ├── 若 not member.name.startswith(prefix) or not member.isfile() or '..' in Path(name).parts [L173]
│       │       │   │   └── 抛出 ValueError(f'Unexpected MCP sdist entry: {member.name}') [L174]
│       │       │   └── 若 not (name.startswith(('src/astrophoto_mcp/', 'tests/')) or name in {'.gitignore', 'LICENSE', 'README.md', 'pyproject.toml', 'PKG-INFO'}) [L175]
│       │       │       └── 抛出 ValueError(f'Unexpected MCP sdist content: {name}') [L177]
│       │       ├── project ← tomllib.loads(archive.extractfile(prefix + 'pyproject.toml').read().decode())['project']；project 在 L179 读 [L178]
│       │       ├── 若 project['version'] != version [L179]
│       │       │   └── 抛出 ValueError('MCP sdist version mismatch') [L180]
│       │       └── 返回 sorted(names) [L181]
│       ├── 函数 main() → None [L184]
│       │   ├── parser ← argparse.ArgumentParser(description=__doc__)；parser 在 L186、197 读 [L185]
│       │   ├── sub ← parser.add_subparsers(dest='command', required=True)；sub 在 L187、189、191、193 读 [L186]
│       │   ├── sync ← sub.add_parser('sync')；sync 在 L188 读 [L187]
│       │   ├── 执行 sync.add_argument('version', nargs='?') [L188]
│       │   ├── check ← sub.add_parser('check')；check 在 L190 读 [L189]
│       │   ├── 执行 check.add_argument('--tag') [L190]
│       │   ├── registry ← sub.add_parser('registry')；registry 在 L192 读 [L191]
│       │   ├── 执行 registry.add_argument('--output', type=Path, default=ROOT / 'dist/registry.zip') [L192]
│       │   ├── artifacts ← sub.add_parser('artifacts')；artifacts 在 L194、195、196 读 [L193]
│       │   ├── 执行 artifacts.add_argument('--registry', type=Path, required=True) [L194]
│       │   ├── 执行 artifacts.add_argument('--wheel', type=Path, required=True) [L195]
│       │   ├── 执行 artifacts.add_argument('--sdist', type=Path) [L196]
│       │   ├── args ← parser.parse_args()；args 在 L198、199、200、201、202 等 9 处 读 [L197]
│       │   ├── 若 args.command == 'sync' [L198]
│       │   │   └── 执行 print(sync_version(args.version)) [L199]
│       │   └── 否则 [L198]
│       │       ├── 若 args.command == 'check' [L200]
│       │       │   └── 执行 print(check_versions(tag=args.tag)) [L201]
│       │       └── 否则 [L200]
│       │           ├── 若 args.command == 'registry' [L202]
│       │           │   └── 执行 print(build_registry(args.output)) [L203]
│       │           └── 否则 [L202]
│       │               ├── version ← check_versions()；version 在 L206、209 读 [L205]
│       │               ├── 循环 (label, names) ← (('Registry', check_registry(args.registry, version)), ('MCP', check_wheel(args.wheel, version))) [L206]
│       │               │   └── 执行 print(f'{label}: {len(names)} files\n' + '\n'.join(names)) [L207]
│       │               └── 若 args.sdist [L208]
│       │                   └── 执行 print(f'MCP sdist: {len(check_sdist(args.sdist, version))} files') [L209]
│       └── 若 __name__ == '__main__' [L212]
│           └── 执行 main() [L213]
├── tests/ — 扩展后端、宿主集成、节点和打包测试。
│   ├── backend/ — 领域服务及存储单元测试。
│   │   ├── test_core.py — 测试配置与路径解析不创建目录、默认数据目录和非法路径。
│   │   │   ├── 项目内导入
│   │   │   │   ├── load_config ← astrophoto/core/config.py（L6），用于 config = load_config()
│   │   │   │   ├── ConfigurationError ← astrophoto/core/errors.py（L7），用于 with pytest.raises(ConfigurationError):
│   │   │   │   └── paths ← astrophoto/core/paths.py（L8），用于 importlib.reload(paths) / assert paths.data_home() == root / assert paths.data_home({}) == tmp_path / ".astrophoto" / paths.data_home({"ASTROPHOTO_HOME": value})
│   │   │   ├── 函数 test_import_and_config_do_not_create_directories(monkeypatch, tmp_path) [L11]
│   │   │   │   ├── root ← tmp_path / 'not-created'；root 在 L13、15、17、20 读 [L12]
│   │   │   │   ├── 执行 monkeypatch.setenv('ASTROPHOTO_HOME', str(root)) [L13]
│   │   │   │   ├── 执行 importlib.reload(paths) [L14]
│   │   │   │   ├── 断言 paths.data_home() == root，失败抛出 AssertionError [L15]
│   │   │   │   ├── config ← load_config()；config 在 L17、18、19 读 [L16]
│   │   │   │   ├── 断言 config.data_home == root，失败抛出 AssertionError [L17]
│   │   │   │   ├── 断言 config.extension_id == 'ComfyUI_AstroPhoto'，失败抛出 AssertionError [L18]
│   │   │   │   ├── 断言 config.version == '0.0.1'，失败抛出 AssertionError [L19]
│   │   │   │   ├── 断言 not root.exists()，失败抛出 AssertionError [L20]
│   │   │   │   └── 断言 list(tmp_path.iterdir()) == []，失败抛出 AssertionError [L21]
│   │   │   ├── 函数 test_default_data_home(monkeypatch, tmp_path) [L24]
│   │   │   │   ├── 执行 monkeypatch.setattr(Path, 'home', lambda: tmp_path) [L25]
│   │   │   │   ├── 断言 paths.data_home({}) == tmp_path / '.astrophoto'，失败抛出 AssertionError [L26]
│   │   │   │   └── 断言 not (tmp_path / '.astrophoto').exists()，失败抛出 AssertionError [L27]
│   │   │   ├── 函数 test_invalid_home(value) [L31]
│   │   │   │   └── 进入上下文 pytest.raises(ConfigurationError)，退出时交由上下文释放资源 [L32]
│   │   │   │       └── 执行 paths.data_home({'ASTROPHOTO_HOME': value}) [L33]
│   │   │   └── 测试覆盖（本文件的用例与断言）
│   │   │       ├── test_import_and_config_do_not_create_directories（11 行） → paths.data_home() == root，config.data_home == root，config.extension_id == 'ComfyUI_AstroPhoto'，config.version == '0.0.1'
│   │   │       ├── test_default_data_home（24 行） → paths.data_home({}) == tmp_path / '.astrophoto'，not (tmp_path / '.astrophoto').exists()
│   │   │       └── test_invalid_home（31 行） → pytest.raises(ConfigurationError)
│   │   ├── test_equipment.py — 测试设备生命周期、规格校验、分页回滚、数据库约束、光学链并发与历史修订保护。
│   │   │   ├── 项目内导入
│   │   │   │   ├── StorageError ← astrophoto/core/errors.py（L10），用于 with pytest.raises(StorageError, match="EQUIPMENT_VERSION_CONFLICT"): / with pytest.raises(StorageError, match="EQUIPMENT_NOT_FOUND"): / with pytest.raises(StorageError) as rejected: / with pytest.raises(StorageError, match="DEV_SCHEMA_RESET_REQUIRED"):
│   │   │   │   ├── SCHEMA ← astrophoto/database/manager.py（L11），用于 assert reopened.db.health()["schema"] == SCHEMA / assert runtime.db.health()["schema"] == SCHEMA
│   │   │   │   ├── OpticalTrainDefault ← astrophoto/database/equipment_models.py（L12），用于 session.add(OpticalTrainDefault(train_id=ident, revision_id=revisions[0]))
│   │   │   │   ├── OpticalTrainDraft ← astrophoto/database/equipment_models.py（L12），用于 session.delete(session.get(OpticalTrainDraft, ident))
│   │   │   │   ├── OpticalTrainRevision ← astrophoto/database/equipment_models.py（L12），用于 session.add(OpticalTrainRevision(
│   │   │   │   ├── device_service ← astrophoto/equipment/service.py（L13），用于 persist = device_service.persist_specs / monkeypatch.setattr(device_service, "persist_specs", interrupted)
│   │   │   │   └── StorageRuntime ← astrophoto/storage/runtime.py（L14），用于 storage = StorageRuntime.initialize(tmp_path / "astrodata", {}) / StorageRuntime.initialize(runtime.root, {}) / reopened = StorageRuntime.initialize(runtime.root, {})
│   │   │   ├── 函数 runtime(tmp_path) [L18]
│   │   │   │   ├── storage ← StorageRuntime.initialize(tmp_path / 'astrodata', {})；storage 在 L21、23 读 [L19]
│   │   │   │   ├── 尝试 [L20]
│   │   │   │   │   └── 产出并暂停 (yield storage) [L21]
│   │   │   │   └── finally 退出清理 [L20]
│   │   │   │       └── 执行 storage.operations.pool.shutdown(wait=True) [L23]
│   │   │   ├── 函数 create_device(runtime, kind='camera', **data) [L26]
│   │   │   │   └── 返回 runtime.equipment.create_equipment({'equipment_type': kind, 'name': kind, **data}) [L27]
│   │   │   ├── 函数 setup_train(runtime, accessory_ids=None, filter_ids=None) [L30]
│   │   │   │   ├── camera ← create_device(runtime, 'camera', name='Old camera', specs={'sensor_kind': 'mono'})；camera 在 L33、36 读 [L31]
│   │   │   │   ├── optics ← create_device(runtime, 'primary_optics', specs={'aperture_mm': 80, 'native_focal_length_mm': 480})；optics 在 L33 读 [L32]
│   │   │   │   ├── body ← {'name': 'Deep sky', 'camera_id': camera['id'], 'primary_optics_id': optics['id'], 'accessory_ids': accessory_ids or [], 'filter_ids': filter_ids or [], 'optical_state': …；body 在 L36 读 [L33]
│   │   │   │   └── 返回 (camera, runtime.optical_trains.create_train({'name': body['name'], 'draft': body})) [L36]
│   │   │   ├── 函数 test_equipment_lifecycle_and_optional_specs(runtime, kind, specs) [L47]
│   │   │   │   ├── api ← runtime.equipment；api 在 L52、53、54、59、66 等 11 处 读 [L48]
│   │   │   │   ├── initial ← create_device(runtime, kind, name='Baseline')；initial 在 L51、63 读 [L49]
│   │   │   │   ├── chosen ← create_device(runtime, kind, name='α Camera', manufacturer='Example', model='M-100%', specs=specs)；chosen 在 L51、52、53、54、56 等 18 处 读 [L50]
│   │   │   │   ├── 断言 initial['id'] != chosen['id']，失败抛出 AssertionError [L51]
│   │   │   │   ├── 断言 api.get_equipment(chosen['id']) == chosen，失败抛出 AssertionError [L52]
│   │   │   │   ├── 断言 api.list_equipment(kind=kind, q='m-100%')['items'][0]['id'] == chosen['id']，失败抛出 AssertionError [L53]
│   │   │   │   ├── 断言 api.list_equipment(q='Α camera')['items'][0]['id'] == chosen['id']，失败抛出 AssertionError [L54]
│   │   │   │   ├── 若 kind == 'filter' [L55]
│   │   │   │   │   ├── 断言 [band['band_label'] for band in chosen['specs']['passbands']] == ['Ha', 'OIII']，失败抛出 AssertionError [L56]
│   │   │   │   │   ├── 断言 chosen['specs']['passbands'][0]['fwhm_nm'] is None，失败抛出 AssertionError [L57]
│   │   │   │   │   ├── (first, second) ← chosen['specs']['passbands']；first 在 L59、60 读，second 在 L59、60 读 [L58]
│   │   │   │   │   ├── replacement ← api.update_equipment(chosen['id'], {'expected_version': 1, 'specs': {'passbands': [second, first]}})；replacement 在 L60、61 读 [L59]
│   │   │   │   │   ├── 断言 [band['id'] for band in replacement['specs']['passbands']] == [second['id'], first['id']]，失败抛出 AssertionError [L60]
│   │   │   │   │   └── chosen ← replacement；chosen 在 L51、52、53、54、56 等 18 处 读 [L61]
│   │   │   │   ├── 若 kind == 'camera' [L62]
│   │   │   │   │   ├── 断言 initial['specs']['cooling_supported'] is None and chosen['specs']['cooling_supported'] is False，失败抛出 AssertionError [L63]
│   │   │   │   │   └── 断言 chosen['specs']['readout_modes'][0]['gain_min'] == 0，失败抛出 AssertionError [L64]
│   │   │   │   ├── form ← {key: chosen[key] for key in ('manufacturer', 'model', 'notes', 'specs')}；form 在 L66 读 [L65]
│   │   │   │   ├── updated ← api.update_equipment(chosen['id'], {**form, 'expected_version': chosen['row_version'], 'name': 'Updated'})；updated 在 L69 读 [L66]
│   │   │   │   ├── 进入上下文 pytest.raises(StorageError, match='EQUIPMENT_VERSION_CONFLICT')，退出时交由上下文释放资源 [L67]
│   │   │   │   │   └── 执行 api.update_equipment(chosen['id'], {'expected_version': chosen['row_version'], 'name': 'Stale'}) [L68]
│   │   │   │   ├── archived ← api.set_archived(chosen['id'], updated['row_version'], True)；archived 在 L70、72 读 [L69]
│   │   │   │   ├── 断言 archived['archived_at_utc']，失败抛出 AssertionError [L70]
│   │   │   │   ├── 断言 api.list_equipment(archived='true')['items'][0]['id'] == chosen['id']，失败抛出 AssertionError [L71]
│   │   │   │   ├── restored ← api.set_archived(chosen['id'], archived['row_version'], False)；restored 在 L73、74 读 [L72]
│   │   │   │   ├── 断言 restored['archived_at_utc'] is None，失败抛出 AssertionError [L73]
│   │   │   │   ├── 执行 api.delete_unused_equipment(chosen['id'], restored['row_version']) [L74]
│   │   │   │   └── 进入上下文 pytest.raises(StorageError, match='EQUIPMENT_NOT_FOUND')，退出时交由上下文释放资源 [L75]
│   │   │   │       └── 执行 api.get_equipment(chosen['id']) [L76]
│   │   │   ├── 函数 test_invalid_fields_never_persist(runtime, kind, specs, field) [L87]
│   │   │   │   ├── 进入上下文 pytest.raises(StorageError) → rejected，退出时交由上下文释放资源 [L88]
│   │   │   │   │   └── 执行 create_device(runtime, kind, specs=specs) [L89]
│   │   │   │   ├── 断言 rejected.value.details['fields'][field]，失败抛出 AssertionError [L90]
│   │   │   │   └── 断言 runtime.equipment.list_equipment()['items'] == []，失败抛出 AssertionError [L91]
│   │   │   ├── 函数 test_pagination_same_model_and_rollback(runtime, monkeypatch) [L94]
│   │   │   │   ├── api ← runtime.equipment；api 在 L97、100、111、112 读 [L95]
│   │   │   │   ├── ids ← sorted((create_device(runtime, model='Same model')['id'] for _ in range(3)))；ids 在 L98、99、100、111、112 读 [L96]
│   │   │   │   ├── result ← api.list_equipment(limit=2)；result 在 L98、99、100 读 [L97]
│   │   │   │   ├── 断言 [item['id'] for item in result['items']] == ids[:2]，失败抛出 AssertionError [L98]
│   │   │   │   ├── 断言 result['next'] == ids[1]，失败抛出 AssertionError [L99]
│   │   │   │   ├── 断言 [item['id'] for item in api.list_equipment(limit=2, after=result['next'])['items']] == ids[2:]，失败抛出 AssertionError [L100]
│   │   │   │   ├── persist ← device_service.persist_specs；persist 在 L104 读 [L101]
│   │   │   │   ├── 函数 interrupted(*args, **kwargs) [L103]
│   │   │   │   │   ├── 执行 persist(*args, **kwargs) [L104]
│   │   │   │   │   └── 抛出 RuntimeError('injected after specification write') [L105]
│   │   │   │   ├── 执行 monkeypatch.setattr(device_service, 'persist_specs', interrupted) [L107]
│   │   │   │   ├── 进入上下文 pytest.raises(RuntimeError, match='injected')，退出时交由上下文释放资源 [L108]
│   │   │   │   │   └── 执行 create_device(runtime, 'filter', specs={'passbands': [{'band_label': 'OIII'}]}) [L109]
│   │   │   │   ├── 进入上下文 pytest.raises(RuntimeError, match='injected')，退出时交由上下文释放资源 [L110]
│   │   │   │   │   └── 执行 api.update_equipment(ids[0], {'expected_version': 1, 'name': 'Uncommitted'}) [L111]
│   │   │   │   ├── 断言 api.get_equipment(ids[0])['name'] == 'camera'，失败抛出 AssertionError [L112]
│   │   │   │   └── 进入上下文 closing(sqlite3.connect(runtime.db.path)) → conn，退出时交由上下文释放资源 [L113]
│   │   │   │       └── 断言 conn.execute('SELECT COUNT(*) FROM filter_passbands').fetchone() == (0,)，失败抛出 AssertionError [L114]
│   │   │   ├── 函数 test_database_constraints_and_incompatible_same_version(runtime) [L117]
│   │   │   │   ├── ident ← create_device(runtime, 'filter')['id']；ident 在 L125 读 [L118]
│   │   │   │   ├── 进入上下文 runtime.db.engine.begin() → conn，退出时交由上下文释放资源 [L119]
│   │   │   │   │   ├── 断言 conn.exec_driver_sql('PRAGMA quick_check').scalar() == 'ok'，失败抛出 AssertionError [L120]
│   │   │   │   │   └── 断言 conn.exec_driver_sql('PRAGMA foreign_key_check').all() == []，失败抛出 AssertionError [L121]
│   │   │   │   ├── 进入上下文 closing(sqlite3.connect(runtime.db.path)) → conn，退出时交由上下文释放资源 [L122]
│   │   │   │   │   ├── 执行 conn.execute('PRAGMA foreign_keys=ON') [L123]
│   │   │   │   │   ├── 进入上下文 pytest.raises(sqlite3.IntegrityError, match='EQUIPMENT_TYPE_MISMATCH')，退出时交由上下文释放资源 [L124]
│   │   │   │   │   │   └── 执行 conn.execute('INSERT INTO camera_specs (equipment_id) VALUES (?)', (ident,)) [L125]
│   │   │   │   │   ├── 进入上下文 pytest.raises(sqlite3.IntegrityError, match='FOREIGN KEY')，退出时交由上下文释放资源 [L126]
│   │   │   │   │   │   └── 执行 conn.execute("INSERT INTO filter_passbands (id,filter_id,position,band_label) VALUES ('x','missing',0,'Ha')") [L127]
│   │   │   │   │   ├── 执行 conn.execute('DROP TRIGGER immutable_train_revision_update') [L128]
│   │   │   │   │   └── 执行 conn.commit() [L129]
│   │   │   │   ├── 进入上下文 pytest.raises(StorageError, match='DEV_SCHEMA_RESET_REQUIRED')，退出时交由上下文释放资源 [L130]
│   │   │   │   │   └── 执行 runtime.db.health() [L131]
│   │   │   │   └── 进入上下文 pytest.raises(StorageError, match='DEV_SCHEMA_RESET_REQUIRED')，退出时交由上下文释放资源 [L132]
│   │   │   │       └── 执行 StorageRuntime.initialize(runtime.root, {}) [L133]
│   │   │   ├── 函数 test_incomplete_configuration_and_reference_validation(runtime) [L136]
│   │   │   │   ├── api ← runtime.optical_trains；api 在 L138、142、144、145 读 [L137]
│   │   │   │   ├── train ← api.create_train({'name': 'Incomplete', 'draft': {'name': 'Incomplete'}})；train 在 L139、142、144、145 读 [L138]
│   │   │   │   ├── 断言 train['status'] == 'draft'，失败抛出 AssertionError [L139]
│   │   │   │   ├── band ← create_device(runtime, 'filter')；band 在 L143 读 [L140]
│   │   │   │   ├── 进入上下文 pytest.raises(StorageError, match='EQUIPMENT_TYPE_MISMATCH')，退出时交由上下文释放资源 [L141]
│   │   │   │   │   └── 执行 api.save_draft(train['id'], {'expected_draft_version': train['draft']['draft_version'], 'draft': {'name': 'Bad', 'camera_id': band['id']}}) [L142]
│   │   │   │   ├── 断言 api.get_train(train['id'])['configuration'] == train['configuration']，失败抛出 AssertionError [L144]
│   │   │   │   └── 断言 api.list_revisions(train['id']) == {'items': []}，失败抛出 AssertionError [L145]
│   │   │   ├── 函数 test_single_configuration_concurrent_save_and_live_specs(runtime) [L148]
│   │   │   │   ├── api ← runtime.optical_trains；api 在 L155、157、166、174、176 等 6 处 读 [L149]
│   │   │   │   ├── first ← create_device(runtime, 'optical_accessory', name='Reducer')；first 在 L153、159 读 [L150]
│   │   │   │   ├── second ← create_device(runtime, 'optical_accessory', name='Barlow')；second 在 L153、159 读 [L151]
│   │   │   │   ├── band ← create_device(runtime, 'filter')；band 在 L153 读 [L152]
│   │   │   │   ├── (camera, train) ← setup_train(runtime, [first['id'], second['id']], [band['id']])；camera 在 L156、180 读，train 在 L154、158、160 读 [L153]
│   │   │   │   ├── ident ← train['id']；ident 在 L155、157、166、174、176 等 7 处 读 [L154]
│   │   │   │   ├── 断言 api.list_trains(q='old camera', status='published')['items'][0]['id'] == ident，失败抛出 AssertionError [L155]
│   │   │   │   ├── 执行 runtime.equipment.update_equipment(camera['id'], {'expected_version': 1, 'name': 'New camera'}) [L156]
│   │   │   │   ├── 断言 api.get_train(ident)['summary']['camera'] == 'New camera'，失败抛出 AssertionError [L157]
│   │   │   │   ├── data ← train['configuration']['draft']；data 在 L159 读 [L158]
│   │   │   │   ├── command ← {'draft': {**data, 'accessory_ids': [second['id'], first['id']]}, 'expected_draft_version': train['configuration']['draft_version']}；command 在 L166 读 [L159]
│   │   │   │   ├── barrier ← Barrier(2)；barrier 在 L164 读 [L161]
│   │   │   │   ├── 函数 save() [L163]
│   │   │   │   │   ├── 执行 barrier.wait() [L164]
│   │   │   │   │   ├── 尝试 [L165]
│   │   │   │   │   │   └── 返回 api.save_draft(ident, command) [L166]
│   │   │   │   │   └── 捕获 StorageError → exc [L167]
│   │   │   │   │       └── 提前返回 exc.code [L168]
│   │   │   │   ├── 进入上下文 ThreadPoolExecutor(2) → pool，退出时交由上下文释放资源 [L170]
│   │   │   │   │   ├── threads ← [pool.submit(save) for _ in range(2)]；threads 在 L172 读 [L171]
│   │   │   │   │   └── results ← [thread.result(timeout=5) for thread in threads]；results 在 L173 读 [L172]
│   │   │   │   ├── 断言 results.count('DRAFT_VERSION_CONFLICT') == 1，失败抛出 AssertionError [L173]
│   │   │   │   ├── current ← api.get_train(ident)；current 在 L175、178、184 读 [L174]
│   │   │   │   ├── 断言 current['summary']['accessories'] == ['Barlow', 'Reducer']，失败抛出 AssertionError [L175]
│   │   │   │   ├── 断言 api.list_trains(q='Barlow', status='published')['items'][0]['id'] == ident，失败抛出 AssertionError [L176]
│   │   │   │   ├── 断言 api.list_revisions(ident) == {'items': []}，失败抛出 AssertionError [L177]
│   │   │   │   ├── 断言 len([device for device in current['components'] if device['name'] == 'New camera']) == 1，失败抛出 AssertionError [L178]
│   │   │   │   ├── 进入上下文 pytest.raises(StorageError, match='EQUIPMENT_REFERENCED')，退出时交由上下文释放资源 [L179]
│   │   │   │   │   └── 执行 runtime.equipment.delete_unused_equipment(camera['id'], 2) [L180]
│   │   │   │   ├── reopened ← StorageRuntime.initialize(runtime.root, {})；reopened 在 L183、184、186 读 [L181]
│   │   │   │   ├── 尝试 [L182]
│   │   │   │   │   ├── 断言 reopened.db.health()['schema'] == SCHEMA，失败抛出 AssertionError [L183]
│   │   │   │   │   └── 断言 reopened.optical_trains.get_train(ident)['configuration'] == current['configuration']，失败抛出 AssertionError [L184]
│   │   │   │   └── finally 退出清理 [L182]
│   │   │   │       └── 执行 reopened.operations.pool.shutdown(wait=True) [L186]
│   │   │   ├── 函数 seed_legacy_revisions(runtime, train) [L189]
│   │   │   │   ├── ident ← train['id']；ident 在 L194、196、201、206 读 [L190]
│   │   │   │   ├── data ← train['configuration']['draft']；data 在 L197、198、199 读 [L191]
│   │   │   │   ├── revisions ← [str(uuid4()), str(uuid4())]；revisions 在 L195、202、206、207 读 [L192]
│   │   │   │   ├── 进入上下文 runtime.db.session(transaction='write') → session，退出时交由上下文释放资源 [L193]
│   │   │   │   │   ├── 执行 session.delete(session.get(OpticalTrainDraft, ident)) [L194]
│   │   │   │   │   ├── 循环 (number, revision) ← enumerate(revisions, start=1) [L195]
│   │   │   │   │   │   ├── snapshot ← {'snapshot_version': 1, 'train_id': ident, 'name_at_publish': train['name'], 'notes': None, 'camera': {'equipment_id': data['camera_id'], 'equipment_type': 'camera'}, 'pr…；snapshot 在 L201 读 [L196]
│   │   │   │   │   │   └── 执行 session.add(OpticalTrainRevision(id=revision, train_id=ident, revision_number=number, snapshot_json=snapshot, base_revision_id=revisions[number - 2] if number > 1 else No… [L200]
│   │   │   │   │   ├── 执行 session.flush() [L205]
│   │   │   │   │   └── 执行 session.add(OpticalTrainDefault(train_id=ident, revision_id=revisions[0])) [L206]
│   │   │   │   └── 返回 revisions [L207]
│   │   │   ├── 函数 test_existing_default_loads_without_rewriting_legacy_history(runtime) [L210]
│   │   │   │   ├── api ← runtime.optical_trains；api 在 L215、218、219、220、221 等 9 处 读 [L211]
│   │   │   │   ├── (camera, train) ← setup_train(runtime)；camera 在 L234 读，train 在 L213、214 读 [L212]
│   │   │   │   ├── ident ← train['id']；ident 在 L215、218、219、220、221 等 9 处 读 [L213]
│   │   │   │   ├── revisions ← seed_legacy_revisions(runtime, train)；revisions 在 L221 读 [L214]
│   │   │   │   ├── existing ← api.get_train(ident)['configuration']；existing 在 L216、217、219 读 [L215]
│   │   │   │   ├── 断言 existing['draft']['optical_state']['rotation_deg'] == 1，失败抛出 AssertionError [L216]
│   │   │   │   ├── 断言 existing['draft_version'] is None，失败抛出 AssertionError [L217]
│   │   │   │   ├── 断言 api.list_trains(q='Old camera', status='published')['items'][0]['id'] == ident，失败抛出 AssertionError [L218]
│   │   │   │   ├── 执行 api.save_draft(ident, {'draft': dict(existing['draft'], name='Updated'), 'expected_draft_version': None}) [L219]
│   │   │   │   ├── 断言 api.get_train(ident)['configuration']['draft']['name'] == 'Updated'，失败抛出 AssertionError [L220]
│   │   │   │   ├── 断言 [row['id'] for row in api.list_revisions(ident)['items']] == revisions[::-1]，失败抛出 AssertionError [L221]
│   │   │   │   ├── 进入上下文 closing(sqlite3.connect(runtime.db.path)) → conn，退出时交由上下文释放资源 [L222]
│   │   │   │   │   └── 循环 statement ← ("UPDATE optical_train_revisions SET change_summary='edited'", 'DELETE FROM optical_train_revisions', 'INSERT OR REPLACE INTO optical_train_revisions SELECT * FROM optica… [L223]
│   │   │   │   │       └── 进入上下文 pytest.raises(sqlite3.IntegrityError, match='PUBLISHED_REVISION_IMMUTABLE')，退出时交由上下文释放资源 [L226]
│   │   │   │   │           └── 执行 conn.execute(statement) [L227]
│   │   │   │   ├── current ← api.get_train(ident)；current 在 L230、231 读 [L228]
│   │   │   │   ├── 进入上下文 pytest.raises(StorageError, match='DRAFT_VERSION_CONFLICT')，退出时交由上下文释放资源 [L229]
│   │   │   │   │   └── 执行 api.delete_train(ident, current['row_version'] - 1) [L230]
│   │   │   │   ├── 执行 api.delete_train(ident, current['row_version']) [L231]
│   │   │   │   ├── 进入上下文 pytest.raises(StorageError, match='TRAIN_NOT_FOUND')，退出时交由上下文释放资源 [L232]
│   │   │   │   │   └── 执行 api.get_train(ident) [L233]
│   │   │   │   ├── 执行 runtime.equipment.delete_unused_equipment(camera['id'], camera['row_version']) [L234]
│   │   │   │   └── 断言 runtime.db.health()['schema'] == SCHEMA，失败抛出 AssertionError [L235]
│   │   │   ├── 函数 test_legacy_train_delete_rolls_back_history_and_trigger(runtime) [L238]
│   │   │   │   ├── api ← runtime.optical_trains；api 在 L244、245、246、256、260 等 10 处 读 [L239]
│   │   │   │   ├── (camera, target) ← setup_train(runtime)；camera 在 L272 读，target 在 L242、244、245、246、256 等 10 处 读 [L240]
│   │   │   │   ├── (_, other) ← setup_train(runtime)；other 在 L243、270、271 读 [L241]
│   │   │   │   ├── revisions ← seed_legacy_revisions(runtime, target)；revisions 在 L261 读 [L242]
│   │   │   │   ├── other_revisions ← seed_legacy_revisions(runtime, other)；other_revisions 在 L270、271 读 [L243]
│   │   │   │   ├── before ← api.get_train(target['id'])；before 在 L245、247、260 读 [L244]
│   │   │   │   ├── 执行 api.save_draft(target['id'], {'draft': before['configuration']['draft'], 'expected_draft_version': None}) [L245]
│   │   │   │   ├── before ← api.get_train(target['id'])；before 在 L245、247、260 读 [L246]
│   │   │   │   ├── version ← before['row_version']；version 在 L256、267 读 [L247]
│   │   │   │   ├── 函数 fail_after_history_delete(_conn, _cursor, statement, *_args) [L249]
│   │   │   │   │   └── 若 statement.startswith('DELETE FROM optical_train_revisions') [L250]
│   │   │   │   │       └── 抛出 RuntimeError('injected after revision delete') [L251]
│   │   │   │   ├── 执行 event.listen(runtime.db.engine, 'after_cursor_execute', fail_after_history_delete) [L253]
│   │   │   │   ├── 尝试 [L254]
│   │   │   │   │   └── 进入上下文 pytest.raises(RuntimeError, match='injected after revision delete')，退出时交由上下文释放资源 [L255]
│   │   │   │   │       └── 执行 api.delete_train(target['id'], version) [L256]
│   │   │   │   ├── finally 退出清理 [L254]
│   │   │   │   │   └── 执行 event.remove(runtime.db.engine, 'after_cursor_execute', fail_after_history_delete) [L258]
│   │   │   │   ├── 断言 api.get_train(target['id']) == before，失败抛出 AssertionError [L260]
│   │   │   │   ├── 断言 [row['id'] for row in api.list_revisions(target['id'])['items']] == revisions[::-1]，失败抛出 AssertionError [L261]
│   │   │   │   ├── 断言 runtime.db.health()['schema'] == SCHEMA，失败抛出 AssertionError [L262]
│   │   │   │   ├── 进入上下文 closing(sqlite3.connect(runtime.db.path)) → conn，退出时交由上下文释放资源 [L263]
│   │   │   │   │   └── 进入上下文 pytest.raises(sqlite3.IntegrityError, match='PUBLISHED_REVISION_IMMUTABLE')，退出时交由上下文释放资源 [L264]
│   │   │   │   │       └── 执行 conn.execute('DELETE FROM optical_train_revisions WHERE train_id = ?', (target['id'],)) [L265]
│   │   │   │   ├── 执行 api.delete_train(target['id'], version) [L267]
│   │   │   │   ├── 进入上下文 pytest.raises(StorageError, match='TRAIN_NOT_FOUND')，退出时交由上下文释放资源 [L268]
│   │   │   │   │   └── 执行 api.get_train(target['id']) [L269]
│   │   │   │   ├── 断言 [row['id'] for row in api.list_revisions(other['id'])['items']] == other_revisions[::-1]，失败抛出 AssertionError [L270]
│   │   │   │   ├── 断言 api.get_train(other['id'])['default_revision']['id'] == other_revisions[0]，失败抛出 AssertionError [L271]
│   │   │   │   ├── 断言 runtime.equipment.get_equipment(camera['id'])['usage_summary'] == []，失败抛出 AssertionError [L272]
│   │   │   │   ├── 进入上下文 runtime.db.engine.connect() → conn，退出时交由上下文释放资源 [L273]
│   │   │   │   │   └── 断言 conn.exec_driver_sql('PRAGMA foreign_key_check').all() == []，失败抛出 AssertionError [L274]
│   │   │   │   └── 断言 runtime.db.health()['schema'] == SCHEMA，失败抛出 AssertionError [L275]
│   │   │   └── 测试覆盖（本文件的用例与断言）
│   │   │       ├── test_equipment_lifecycle_and_optional_specs（47 行） → initial['id'] != chosen['id']，api.get_equipment(chosen['id']) == chosen，api.list_equipment(kind=kind, q='m-100%')['items'][0]['id'] == chosen['id']，api.list_equipment(q='Α camera')['items'][0]['id'] == chosen['id']
│   │   │       ├── test_invalid_fields_never_persist（87 行） → pytest.raises(StorageError)，rejected.value.details['fields'][field]，runtime.equipment.list_equipment()['items'] == []
│   │   │       ├── test_pagination_same_model_and_rollback（94 行） → [item['id'] for item in result['items']] == ids[:2]，result['next'] == ids[1]，[item['id'] for item in api.list_equipment(limit=2, after=result['next'])['items']] == ids[2:]，pytest.raises(RuntimeError, match='injected')
│   │   │       ├── test_database_constraints_and_incompatible_same_version（117 行） → conn.exec_driver_sql('PRAGMA quick_check').scalar() == 'ok'，conn.exec_driver_sql('PRAGMA foreign_key_check').all() == []，pytest.raises(sqlite3.IntegrityError, match='EQUIPMENT_TYPE_MISMATCH')，pytest.raises(sqlite3.IntegrityError, match='FOREIGN KEY')
│   │   │       ├── test_incomplete_configuration_and_reference_validation（136 行） → train['status'] == 'draft'，pytest.raises(StorageError, match='EQUIPMENT_TYPE_MISMATCH')，api.get_train(train['id'])['configuration'] == train['configuration']，api.list_revisions(train['id']) == {'items': []}
│   │   │       ├── test_single_configuration_concurrent_save_and_live_specs（148 行） → api.list_trains(q='old camera', status='published')['items'][0]['id'] == ident，api.get_train(ident)['summary']['camera'] == 'New camera'，results.count('DRAFT_VERSION_CONFLICT') == 1，current['summary']['accessories'] == ['Barlow', 'Reducer']
│   │   │       ├── test_existing_default_loads_without_rewriting_legacy_history（210 行） → existing['draft']['optical_state']['rotation_deg'] == 1，existing['draft_version'] is None，api.list_trains(q='Old camera', status='published')['items'][0]['id'] == ident，api.get_train(ident)['configuration']['draft']['name'] == 'Updated'
│   │   │       └── test_legacy_train_delete_rolls_back_history_and_trigger（238 行） → pytest.raises(RuntimeError, match='injected after revision delete')，api.get_train(target['id']) == before，[row['id'] for row in api.list_revisions(target['id'])['items']] == revisions[::-1]，runtime.db.health()['schema'] == SCHEMA
│   │   ├── test_siril.py — 用临时 StorageRuntime 与可选真实 Siril 验证科学处理。
│   │   │   ├── 项目内导入
│   │   │   │   ├── inspect_fits、resolve_input ← astrophoto/assets/fits.py（L14），检查输入身份、位深和损坏样本
│   │   │   │   ├── load_storage_settings、read_json、write_json_atomically ← astrophoto/core/config.py（L15），读取设置、写入和比对运行回执
│   │   │   │   ├── StorageError ← astrophoto/core/errors.py（L16），断言稳定错误码
│   │   │   │   ├── Asset、AssetLocation ← astrophoto/database/models.py（L17），以外部位置登记合成 FITS
│   │   │   │   ├── StorageRuntime ← astrophoto/storage/runtime.py（L18），初始化独立根
│   │   │   │   ├── processing、software ← extension/siril/（L19），测试探测、子进程和错误分支
│   │   │   │   ├── SirilBundle ← extension/siril/bundle.py（L20），提供软件配置和候选服务
│   │   │   │   └── formal_run、parameters、recover_runs ← extension/siril/processing.py（L21），测试正式链、参数和恢复
│   │   │   ├── sample/bundle/storage（L87–110）创建合成 FITS、注入 Bundle 初始化，退出时关闭候选 worker 和存储线程池。
│   │   │   ├── test_probe_directory_retries_only_windows_sharing_violations（L27）注入 WinError 32 验证重试和回收，普通拒绝仍抛错。
│   │   │   ├── test_direct_fits_path_outside_import_roots / test_load_image_node_outputs_path_and_tracks_file_changes（L56、71）核对绝对外部路径、坏 FITS 和重算指纹。
│   │   │   ├── test_fits_inspection_validates_precision_metadata_and_truncation / test_formal_run_requires_an_absolute_path（L113、124）验证合成样本维度、位深、元数据、截断拒绝和正式路径约束。
│   │   │   ├── 参数和配置用例（L134–163）检查不合法数字与类型、单通道 linked、错误版本保留原配置、拒绝错误路径及 GUI。
│   │   │   ├── test_runner_timeout_and_mid_process_cancellation（L166）用真实 Python 子进程校验超时、中断与后续可运行。
│   │   │   ├── test_windows_runner_isolates_siril_from_msys_environment（L182）用真实 Python 子进程验证 Windows 子环境清理，保留父进程变量、常规变量和 C locale。
│   │   │   ├── test_restart_reconciles_only_owned_unregistered_run（L193）将自己未登记的运行标为 interrupted，保留同目录未知用户文件。
│   │   │   ├── test_real_cli_immutable_source_and_formal_output（L210）用 ASTROPHOTO_SIRIL_TEST_CLI 发现并保存真实 CLI，候选 PNG 两侧可读，正式输出及回执登记到第二 Workspace，确认位深、像素变化、取消与源 FITS 保全。
│   │   │   └── test_real_cli_direct_path_and_chained_output（L255）两次真实输出，校验直接路径与上游资产身份、后一路回执、不同产物及原件和前一结果完整。
│   │   ├── test_status.py — 测试能力状态随实际注册变化，未实现功能不被报告为可用。
│   │   │   ├── 项目内导入
│   │   │   │   ├── bootstrap ← astrophoto/bootstrap.py（L1），用于 runtime = bootstrap(lambda: live["registered"], AppConfig("ComfyUI_AstroPhoto", "0.0.1", tmp_path))
│   │   │   │   ├── AppConfig ← astrophoto/core/config.py（L2），用于 runtime = bootstrap(lambda: live["registered"], AppConfig("ComfyUI_AstroPhoto", "0.0.1", tmp_path))
│   │   │   │   └── status_payload ← astrophoto/api/status.py（L3），用于 first = status_payload(runtime) / result = status_payload(runtime) / assert status_payload(runtime)["status"] == "degraded"
│   │   │   ├── 函数 test_capabilities_follow_registration_not_plans(tmp_path) [L6]
│   │   │   │   ├── live ← {'registered': False}；live 在 L8、13、21 读 [L7]
│   │   │   │   ├── runtime ← bootstrap(lambda: live['registered'], AppConfig('ComfyUI_AstroPhoto', '0.0.1', tmp_path))；runtime 在 L9、12、14、22 读 [L8]
│   │   │   │   ├── first ← status_payload(runtime)；first 在 L10、11 读 [L9]
│   │   │   │   ├── 断言 first['status'] == 'degraded'，失败抛出 AssertionError [L10]
│   │   │   │   ├── 断言 not first['capabilities']['drawing_node']['available']，失败抛出 AssertionError [L11]
│   │   │   │   ├── runtime.routes_registered ← True [L12]
│   │   │   │   ├── live['registered'] ← True；live['registered'] 在 L8 读 [L13]
│   │   │   │   ├── result ← status_payload(runtime)；result 在 L15、16、17、18、20 读 [L14]
│   │   │   │   ├── 断言 result['status'] == 'ok'，失败抛出 AssertionError [L15]
│   │   │   │   ├── 断言 result['extension'] == {'id': 'ComfyUI_AstroPhoto', 'version': '0.0.1'}，失败抛出 AssertionError [L16]
│   │   │   │   ├── 断言 result['api_version'] == 'v1'，失败抛出 AssertionError [L17]
│   │   │   │   ├── 断言 result['capabilities']['status_api']['available']，失败抛出 AssertionError [L18]
│   │   │   │   ├── 循环 name ← ('storage', 'assets', 'software', 'processing', 'knowledge', 'memory', 'experiments', 'canvas_bridge') [L19]
│   │   │   │   │   └── 断言 result['capabilities'][name] == {'available': False, 'reason': 'not_implemented'}，失败抛出 AssertionError [L20]
│   │   │   │   ├── live['registered'] ← False；live['registered'] 在 L8 读 [L21]
│   │   │   │   └── 断言 status_payload(runtime)['status'] == 'degraded'，失败抛出 AssertionError [L22]
│   │   │   └── 测试覆盖（本文件的用例与断言）
│   │   │       └── test_capabilities_follow_registration_not_plans（6 行） → first['status'] == 'degraded'，not first['capabilities']['drawing_node']['available']，result['status'] == 'ok'，result['extension'] == {'id': 'ComfyUI_AstroPhoto', 'version': '0.0.1'}
│   │   ├── test_storage.py — 测试存储初始化恢复、并发、工作区与缓存、引用及副本导入、取消、迁移、路径和数据库故障。
│   │       ├── 项目内导入
│   │       │   ├── load_storage_settings ← astrophoto/core/config.py（L14），用于 return load_storage_settings(service.root)["workspace"]["default_workspace_id"]
│   │       │   ├── StorageError ← astrophoto/core/errors.py（L15），用于 with pytest.raises(StorageError) as error: / with pytest.raises(StorageError, match="STORAGE_PATH_CONFLICT"): / with pytest.raises(StorageError, match="WORKSPACE_IDENTITY_MISMATCH"): / with pytest.raises(StorageError, match="SOURCE_NOT_FOUND"):
│   │       │   ├── AssetLocation ← astrophoto/database/models.py（L16），用于 session.add(AssetLocation(id="orphan", asset_id="missing", external_key="one", / assert not list(session.scalars(select(AssetLocation))) / if any(isinstance(row, AssetLocation) for row in session.new):
│   │       │   ├── WORKSPACE_MARKER ← astrophoto/storage/initializer.py（L17），用于 assert (target / WORKSPACE_MARKER).exists() / assert not (target / WORKSPACE_MARKER).exists()
│   │       │   ├── StorageRuntime ← astrophoto/storage/runtime.py（L18），用于 storage = StorageRuntime.initialize(tmp_path / "data", {"ASTROPHOTO_IMPORT_ROOTS": str(tmp_path / "capture")}) / other = StorageRuntime.initialize(service.root, {}) / StorageRuntime.initialize(root, {}) / after = StorageRuntime.initialize(root, {})
│   │       │   ├── CacheManager ← astrophoto/storage/cache.py（L65），用于 patched.setattr(CacheManager, "initialize", interrupt)
│   │       │   ├── read_json ← astrophoto/core/config.py（L66），用于 before = read_json(root / "config/manifest.json")
│   │       │   ├── migration ← astrophoto/storage/migration.py（L302），用于 patched.setattr(migration, "rebind_workspace", interrupt) / original = migration.file_hash / monkeypatch.setattr(migration, "file_hash", corrupt_checksum)
│   │       │   ├── migration ← astrophoto/storage/migration.py（L401），用于 patched.setattr(migration, "rebind_workspace", interrupt) / original = migration.file_hash / monkeypatch.setattr(migration, "file_hash", corrupt_checksum)
│   │       │   ├── canonicalize_root ← astrophoto/storage/paths.py（L420），用于 canonicalize_root(unsafe)
│   │       │   ├── safe_join_workspace ← astrophoto/storage/paths.py（L420），用于 safe_join_workspace(service.root / "workspace", unsafe)
│   │       │   └── DatabaseManager ← astrophoto/database/manager.py（L465），用于 database = DatabaseManager(tmp_path / "wal-unavailable.db")
│   │       ├── 函数 service(tmp_path) [L22]
│   │       │   ├── storage ← StorageRuntime.initialize(tmp_path / 'data', {'ASTROPHOTO_IMPORT_ROOTS': str(tmp_path / 'capture')})；storage 在 L24、25 读 [L23]
│   │       │   ├── 产出并暂停 (yield storage) [L24]
│   │       │   └── 执行 storage.operations.pool.shutdown(wait=True) [L25]
│   │       ├── 函数 file_at(path, data=b'FITS bytes\x00\xff') [L28]
│   │       │   ├── 执行 path.parent.mkdir(parents=True, exist_ok=True) [L29]
│   │       │   ├── 执行 path.write_bytes(data) [L30]
│   │       │   └── 返回 path [L31]
│   │       ├── 函数 receipt(service, operation_id, kind='import', phase=None) [L34]
│   │       │   ├── deadline ← time.monotonic() + 20；deadline 在 L36 读 [L35]
│   │       │   ├── 循环 time.monotonic() < deadline [L36]
│   │       │   │   ├── result ← service.operations.status(operation_id, kind)；result 在 L38、39、41 读 [L37]
│   │       │   │   ├── 若 result['phase'] == phase or result['phase'] in {'completed', 'cancelled', 'failed'} or result['error'] [L38]
│   │       │   │   │   └── 提前返回 result [L39]
│   │       │   │   └── 执行 time.sleep(0.025) [L40]
│   │       │   └── 抛出 AssertionError(result) [L41]
│   │       ├── 函数 default_id(service) [L44]
│   │       │   └── 返回 load_storage_settings(service.root)['workspace']['default_workspace_id'] [L45]
│   │       ├── 函数 start_import(service, source, key='test', **options) [L48]
│   │       │   └── 返回 service.imports.import_assets({'sources': [str(source)], 'idempotency_key': key, **options}) [L49]
│   │       ├── 函数 test_first_start_and_reentry(service) [L52]
│   │       │   ├── initial ← service.snapshot('test')；initial 在 L55、57、58、60、61 读 [L53]
│   │       │   ├── other ← StorageRuntime.initialize(service.root, {})；other 在 L55、56 读 [L54]
│   │       │   ├── 断言 initial['default_workspace_id'] == default_id(other)，失败抛出 AssertionError [L55]
│   │       │   ├── 断言 service.workspaces.instance_id == other.workspaces.instance_id，失败抛出 AssertionError [L56]
│   │       │   ├── 断言 initial['imports'] == {'default_mode': 'reference', 'revision': 0}，失败抛出 AssertionError [L57]
│   │       │   ├── 断言 initial['cache']['max_size_gb'] == 20，失败抛出 AssertionError [L58]
│   │       │   ├── 断言 {path.name for path in (service.root / 'databases').iterdir()} == {'assets.db'}，失败抛出 AssertionError [L59]
│   │       │   ├── 断言 initial['database']['journal_mode'] == 'wal'，失败抛出 AssertionError [L60]
│   │       │   └── 断言 initial['database']['foreign_keys']，失败抛出 AssertionError [L61]
│   │       ├── 函数 test_bootstrap_interrupted_after_database_commit(tmp_path, monkeypatch) [L64]
│   │       │   ├── root ← tmp_path / 'data'；root 在 L74、75、76 读 [L68]
│   │       │   ├── 进入上下文 monkeypatch.context() → patched，退出时交由上下文释放资源 [L69]
│   │       │   │   ├── 函数 interrupt(*_args, **_kwargs) [L70]
│   │       │   │   │   └── 抛出 RuntimeError('injected startup failure') [L71]
│   │       │   │   ├── 执行 patched.setattr(CacheManager, 'initialize', interrupt) [L72]
│   │       │   │   └── 进入上下文 pytest.raises(RuntimeError, match='injected')，退出时交由上下文释放资源 [L73]
│   │       │   │       └── 执行 StorageRuntime.initialize(root, {}) [L74]
│   │       │   ├── before ← read_json(root / 'config/manifest.json')；before 在 L77、78 读 [L75]
│   │       │   ├── after ← StorageRuntime.initialize(root, {})；after 在 L77、78 读 [L76]
│   │       │   ├── 断言 after.workspaces.instance_id == before['instance_id']，失败抛出 AssertionError [L77]
│   │       │   └── 断言 default_id(after) == before['initial_workspace_id']，失败抛出 AssertionError [L78]
│   │       ├── 函数 test_never_replaces_an_existing_asset_database(service, change, code) [L85]
│   │       │   ├── file ← service.db.path；file 在 L90、92、94、96、100 读 [L86]
│   │       │   ├── 若 change in {'manifest', 'settings'} [L87]
│   │       │   │   └── 执行 (service.root / f'config/{change}.json').unlink() [L88]
│   │       │   ├── 若 change == 'missing_db' [L89]
│   │       │   │   └── 执行 file.rename(file.with_suffix('.saved')) [L90]
│   │       │   ├── 若 change == 'corrupt' [L91]
│   │       │   │   └── 执行 file.write_bytes(b'not sqlite') [L92]
│   │       │   ├── 若 change == 'revision' [L93]
│   │       │   │   └── 进入上下文 sqlite3.connect(file) → conn，退出时交由上下文释放资源 [L94]
│   │       │   │       └── 执行 conn.execute("UPDATE alembic_version SET version_num='9999_newer'") [L95]
│   │       │   ├── before ← file.read_bytes() if file.exists() else None；before 在 L100 读 [L96]
│   │       │   ├── 进入上下文 pytest.raises(StorageError) → error，退出时交由上下文释放资源 [L97]
│   │       │   │   └── 执行 StorageRuntime.initialize(service.root, {}) [L98]
│   │       │   ├── 断言 error.value.code == code，失败抛出 AssertionError [L99]
│   │       │   └── 断言 (file.read_bytes() if file.exists() else None) == before，失败抛出 AssertionError [L100]
│   │       ├── 函数 test_multi_process_bootstrap(tmp_path) [L103]
│   │       │   ├── code ← 'import sys; from pathlib import Path; from astrophoto.storage.runtime import StorageRuntime; s=StorageRuntime.initialize(Path(sys.argv[1]), {}); print(s.workspaces.insta…；code 在 L106 读 [L104]
│   │       │   ├── args ← [sys.executable, '-c', code, str(tmp_path / 'data')]；args 在 L107、108 读 [L106]
│   │       │   ├── 进入上下文 subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE) → a, subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE) → b，退出时交由上下文释放资源 [L107]
│   │       │   │   ├── (a_result, a_error) ← a.communicate(timeout=20)；a_result 在 L113 读，a_error 在 L112 读 [L110]
│   │       │   │   └── (b_result, b_error) ← b.communicate(timeout=20)；b_result 在 L113 读，b_error 在 L112 读 [L111]
│   │       │   ├── 断言 a.returncode == b.returncode == 0，失败抛出 AssertionError [L112]
│   │       │   └── 断言 a_result and a_result == b_result，失败抛出 AssertionError [L113]
│   │       ├── 函数 test_foreign_keys_busy_rollback_and_backup(service, tmp_path) [L116]
│   │       │   ├── 进入上下文 pytest.raises(IntegrityError)，退出时交由上下文释放资源 [L117]
│   │       │   │   └── 进入上下文 service.db.session() → session，退出时交由上下文释放资源 [L118]
│   │       │   │       └── 执行 session.add(AssetLocation(id='orphan', asset_id='missing', external_key='one', external_path='one', storage_mode='external_reference')) [L119]
│   │       │   ├── 进入上下文 service.db.session() → session，退出时交由上下文释放资源 [L121]
│   │       │   │   └── 断言 not list(session.scalars(select(AssetLocation)))，失败抛出 AssertionError [L122]
│   │       │   ├── 进入上下文 service.db.engine.connect() → owner, service.db.engine.connect() → contender，退出时交由上下文释放资源 [L123]
│   │       │   │   ├── 执行 owner.exec_driver_sql('BEGIN IMMEDIATE') [L124]
│   │       │   │   ├── 执行 contender.exec_driver_sql('PRAGMA busy_timeout=25') [L125]
│   │       │   │   └── 进入上下文 pytest.raises(OperationalError, match='locked')，退出时交由上下文释放资源 [L126]
│   │       │   │       └── 执行 contender.exec_driver_sql('BEGIN IMMEDIATE') [L127]
│   │       │   ├── target ← tmp_path / 'backup.db'；target 在 L129、130 读 [L128]
│   │       │   ├── 执行 service.db.backup(target) [L129]
│   │       │   └── 进入上下文 sqlite3.connect(target) → copied，退出时交由上下文释放资源 [L130]
│   │       │       ├── 断言 copied.execute('PRAGMA integrity_check').fetchone() == ('ok',)，失败抛出 AssertionError [L131]
│   │       │       └── 断言 copied.execute('SELECT id FROM storage_locations').fetchone() == (default_id(service),)，失败抛出 AssertionError [L132]
│   │       ├── 函数 test_multiple_workspaces_default_disable_and_offline_relocation(service, tmp_path) [L135]
│   │       │   ├── a ← service.workspaces.register(str(tmp_path / 'A'), 'A')；a 在 L138、143、150、153、155 等 7 处 读 [L136]
│   │       │   ├── b ← service.workspaces.register(str(tmp_path / 'B'), 'B')；b 在 L138、145、146 读 [L137]
│   │       │   ├── 断言 a['id'] != b['id']，失败抛出 AssertionError [L138]
│   │       │   ├── 进入上下文 pytest.raises(StorageError, match='STORAGE_PATH_CONFLICT')，退出时交由上下文释放资源 [L139]
│   │       │   │   └── 执行 service.workspaces.register(str(tmp_path / 'A/nested'), 'Nested') [L140]
│   │       │   ├── 进入上下文 pytest.raises(StorageError, match='STORAGE_PATH_CONFLICT')，退出时交由上下文释放资源 [L141]
│   │       │   │   └── 执行 service.cache.configure(str(tmp_path / 'B/cache'), 10, 0) [L142]
│   │       │   ├── 执行 service.update_settings(0, workspace=a['id']) [L143]
│   │       │   ├── previous ← file_at(service.root / 'workspace/outputs/prior.fits')；previous 在 L157 读 [L144]
│   │       │   ├── 执行 service.workspaces.update(b['id'], b['revision'], enabled=False) [L145]
│   │       │   ├── 断言 service.workspaces.check_status(service.workspaces.get(b['id']))['status'] == 'disabled'，失败抛出 AssertionError [L146]
│   │       │   ├── old ← tmp_path / 'A'；old 在 L149、151、152、155 读 [L147]
│   │       │   ├── new ← tmp_path / 'Relocated'；new 在 L149、156、158 读 [L148]
│   │       │   ├── 执行 old.rename(new) [L149]
│   │       │   ├── 断言 service.workspaces.check_status(service.workspaces.get(a['id']))['status'] == 'offline'，失败抛出 AssertionError [L150]
│   │       │   ├── 断言 not old.exists()，失败抛出 AssertionError [L151]
│   │       │   ├── 执行 old.mkdir() [L152]
│   │       │   ├── 断言 service.workspaces.check_status(service.workspaces.get(a['id']))['status'] == 'identity_mismatch'，失败抛出 AssertionError [L153]
│   │       │   ├── 进入上下文 pytest.raises(StorageError, match='WORKSPACE_IDENTITY_MISMATCH')，退出时交由上下文释放资源 [L154]
│   │       │   │   └── 执行 service.workspaces.relocate(a['id'], old) [L155]
│   │       │   ├── 断言 service.workspaces.relocate(a['id'], new)['id'] == a['id']，失败抛出 AssertionError [L156]
│   │       │   ├── 断言 previous.is_file()，失败抛出 AssertionError [L157]
│   │       │   └── 断言 StorageRuntime.initialize(service.root, {}).workspaces.get(a['id']).root_path == str(new)，失败抛出 AssertionError [L158]
│   │       ├── 函数 test_cache_owner_entries_only_with_live_lease(service, tmp_path) [L161]
│   │       │   ├── first ← service.cache.store('previews', b'old')；first 在 L165 读 [L162]
│   │       │   ├── root ← tmp_path / 'alternate'；root 在 L164、168 读 [L163]
│   │       │   ├── 断言 service.cache.configure(root, 7, 0)['max_size_gb'] == 7，失败抛出 AssertionError [L164]
│   │       │   ├── 断言 first.read_bytes() == b'old'，失败抛出 AssertionError [L165]
│   │       │   ├── kept ← service.cache.store('previews', b'active')；kept 在 L170、173 读 [L166]
│   │       │   ├── removed ← service.cache.store('previews', b'remove')；removed 在 L173 读 [L167]
│   │       │   ├── unknown ← file_at(root / 'previews' / ('a' * 32 + '.cache'), b'not owned')；unknown 在 L173 读 [L168]
│   │       │   ├── managed ← file_at(service.root / 'workspace/outputs/keep.fits')；managed 在 L173 读 [L169]
│   │       │   ├── 进入上下文 service.cache.entry_lock(kept)，退出时交由上下文释放资源 [L170]
│   │       │   │   └── result ← service.cache.clear_owned_cache('all')；result 在 L172 读 [L171]
│   │       │   ├── 断言 result == {'removed': 1, 'removed_bytes': 6, 'skipped': 1, 'failed': 0}，失败抛出 AssertionError [L172]
│   │       │   └── 断言 unknown.exists() and kept.exists() and (not removed.exists()) and managed.exists()，失败抛出 AssertionError [L173]
│   │       ├── 函数 test_reference_multiple_roots_mode_snapshot_and_relocation(service, tmp_path, monkeypatch) [L176]
│   │       │   ├── a ← file_at(tmp_path / 'capture/one/a.fits')；a 在 L179、189、192、194、195 读 [L177]
│   │       │   ├── b ← file_at(tmp_path / 'capture/two/b.ser')；b 在 L179、189 读 [L178]
│   │       │   ├── wire ← {'sources': [str(a.parent), str(b.parent)], 'idempotency_key': 'reference', 'session_id': 'M42'}；wire 在 L182、190 读 [L179]
│   │       │   ├── 进入上下文 monkeypatch.context() → patched，退出时交由上下文释放资源 [L180]
│   │       │   │   ├── 执行 patched.setattr(service.operations, 'submit', lambda _id: None) [L181]
│   │       │   │   ├── operation ← service.imports.import_assets(wire)；operation 在 L184、185 读 [L182]
│   │       │   │   └── 执行 service.update_settings(0, imports='copy') [L183]
│   │       │   ├── 执行 service.operations.run(operation) [L184]
│   │       │   ├── result ← receipt(service, operation)；result 在 L186、187 读 [L185]
│   │       │   ├── 断言 result['effective_import_mode'] == 'reference'，失败抛出 AssertionError [L186]
│   │       │   ├── 断言 result['receipt']['registered'] == 2，失败抛出 AssertionError [L187]
│   │       │   ├── 断言 not list((service.root / 'workspace/objects').iterdir())，失败抛出 AssertionError [L188]
│   │       │   ├── 断言 a.read_bytes() == b.read_bytes() == b'FITS bytes\x00\xff'，失败抛出 AssertionError [L189]
│   │       │   ├── again ← service.imports.import_assets({**wire, 'idempotency_key': 'again', 'import_mode_override': 'reference'})；again 在 L191 读 [L190]
│   │       │   ├── 断言 receipt(service, again)['receipt']['skipped'] == 2，失败抛出 AssertionError [L191]
│   │       │   ├── asset ← next((row for row in service.assets.list()['assets'] if row['name'] == a.name))；asset 在 L193、197、198、199 读 [L192]
│   │       │   ├── 断言 asset['session_ids'] == ['M42']，失败抛出 AssertionError [L193]
│   │       │   ├── moved ← a.with_name('moved.fits')；moved 在 L195、198、199 读 [L194]
│   │       │   ├── 执行 a.rename(moved) [L195]
│   │       │   ├── 进入上下文 pytest.raises(StorageError, match='SOURCE_NOT_FOUND')，退出时交由上下文释放资源 [L196]
│   │       │   │   └── 执行 service.assets.resolve_asset(asset['id']) [L197]
│   │       │   ├── 执行 service.assets.relocate(asset['id'], str(moved)) [L198]
│   │       │   └── 断言 service.assets.resolve_asset(asset['id']) == moved，失败抛出 AssertionError [L199]
│   │       ├── 函数 test_copy_override_idempotency_and_real_bytes(service, tmp_path) [L202]
│   │       │   ├── source ← file_at(tmp_path / 'capture/photo.fit')；source 在 L204、211、212、213、215 读 [L203]
│   │       │   ├── operation ← start_import(service, source, import_mode_override='copy')；operation 在 L205、213 读 [L204]
│   │       │   ├── result ← receipt(service, operation)；result 在 L206、207、208 读 [L205]
│   │       │   ├── 断言 result['phase'] == 'completed'，失败抛出 AssertionError [L206]
│   │       │   ├── 断言 result['receipt']['copied'] == 1，失败抛出 AssertionError [L207]
│   │       │   ├── 断言 result['receipt']['verification'] == 'size_and_stat'，失败抛出 AssertionError [L208]
│   │       │   ├── (asset,) ← service.assets.list()['assets']；asset 在 L210 读 [L209]
│   │       │   ├── managed ← service.assets.resolve_asset(asset['id'])；managed 在 L211、212 读 [L210]
│   │       │   ├── 断言 managed.read_bytes() == source.read_bytes()，失败抛出 AssertionError [L211]
│   │       │   ├── 断言 managed.stat().st_ino != source.stat().st_ino，失败抛出 AssertionError [L212]
│   │       │   ├── 断言 start_import(service, source, import_mode_override='copy') == operation，失败抛出 AssertionError [L213]
│   │       │   ├── 进入上下文 pytest.raises(StorageError, match='IDEMPOTENCY_CONFLICT')，退出时交由上下文释放资源 [L214]
│   │       │   │   └── 执行 start_import(service, source, import_mode_override='reference') [L215]
│   │       │   └── 断言 not list((service.root / 'workspace/.staging').iterdir())，失败抛出 AssertionError [L216]
│   │       ├── 函数 test_copy_preflight_blocks_offline_read_only_full_and_unauthorized(service, tmp_path, monkeypatch) [L219]
│   │       │   ├── path ← file_at(tmp_path / 'capture/file.fits')；path 在 L224、229、233、234 读 [L220]
│   │       │   ├── root ← service.root / 'workspace'；root 在 L222、225 读 [L221]
│   │       │   ├── 执行 root.rename(service.root / 'offline') [L222]
│   │       │   ├── 进入上下文 pytest.raises(StorageError, match='WORKSPACE_OFFLINE')，退出时交由上下文释放资源 [L223]
│   │       │   │   └── 执行 start_import(service, path, import_mode_override='copy') [L224]
│   │       │   ├── 执行 (service.root / 'offline').rename(root) [L225]
│   │       │   ├── 进入上下文 monkeypatch.context() → patched，退出时交由上下文释放资源 [L226]
│   │       │   │   ├── 执行 patched.setattr(os, 'access', lambda *_: False) [L227]
│   │       │   │   └── 进入上下文 pytest.raises(StorageError, match='WORKSPACE_READ_ONLY')，退出时交由上下文释放资源 [L228]
│   │       │   │       └── 执行 start_import(service, path, import_mode_override='copy') [L229]
│   │       │   ├── 进入上下文 monkeypatch.context() → patched，退出时交由上下文释放资源 [L230]
│   │       │   │   ├── 执行 patched.setattr(shutil, 'disk_usage', lambda *_: shutil._ntuple_diskusage(20, 20, 0)) [L231]
│   │       │   │   ├── 进入上下文 pytest.raises(StorageError, match='INSUFFICIENT_DISK_SPACE')，退出时交由上下文释放资源 [L232]
│   │       │   │   │   └── 执行 service.imports.preview({'sources': [str(path)], 'import_mode_override': 'copy'}) [L233]
│   │       │   │   ├── operation ← start_import(service, path, import_mode_override='copy')；operation 在 L235 读 [L234]
│   │       │   │   └── 断言 receipt(service, operation)['error']['code'] == 'INSUFFICIENT_DISK_SPACE'，失败抛出 AssertionError [L235]
│   │       │   ├── 进入上下文 pytest.raises(StorageError, match='SOURCE_NOT_AUTHORIZED')，退出时交由上下文释放资源 [L236]
│   │       │   │   └── 执行 start_import(service, service.root / 'config/settings.json', key='unsafe') [L237]
│   │       │   └── 断言 service.assets.list()['assets'] == []，失败抛出 AssertionError [L238]
│   │       ├── 函数 test_copy_detects_inflight_source_change(service, tmp_path, monkeypatch) [L241]
│   │       │   ├── source ← file_at(tmp_path / 'capture/a.fits')；source 在 L249、253 读 [L242]
│   │       │   ├── original ← service.operations.checkpoint；original 在 L246 读 [L243]
│   │       │   ├── 函数 modify(operation) [L245]
│   │       │   │   ├── 执行 original(operation) [L246]
│   │       │   │   ├── stage ← service.root / 'workspace/.staging' / operation；stage 在 L248 读 [L247]
│   │       │   │   └── 若 stage.exists() and list(stage.glob('*.part')) [L248]
│   │       │   │       └── 进入上下文 source.open('ab') → stream，退出时交由上下文释放资源 [L249]
│   │       │   │           └── 执行 stream.write(b'new content') [L250]
│   │       │   ├── 执行 monkeypatch.setattr(service.operations, 'checkpoint', modify) [L252]
│   │       │   ├── operation ← start_import(service, source, import_mode_override='copy')；operation 在 L246、247、254 读 [L253]
│   │       │   ├── 断言 receipt(service, operation)['receipt']['errors'][0]['code'] == 'SOURCE_CHANGED'，失败抛出 AssertionError [L254]
│   │       │   ├── 断言 not service.assets.list()['assets']，失败抛出 AssertionError [L255]
│   │       │   └── 断言 not list((service.root / 'workspace/.staging').iterdir())，失败抛出 AssertionError [L256]
│   │       ├── 函数 test_copy_recovers_after_publish_before_db_commit(service, tmp_path) [L259]
│   │       │   ├── source ← file_at(tmp_path / 'capture/a.fits')；source 在 L269 读 [L260]
│   │       │   ├── 函数 rollback_before_commit(session, _context) [L263]
│   │       │   │   └── 若 any((isinstance(row, AssetLocation) for row in session.new)) [L264]
│   │       │   │       └── 抛出 RuntimeError('injected DB rollback after flushing the managed asset') [L265]
│   │       │   ├── 执行 event.listen(service.db.sessions.class_, 'after_flush', rollback_before_commit) [L267]
│   │       │   ├── 尝试 [L268]
│   │       │   │   ├── operation ← start_import(service, source, import_mode_override='copy')；operation 在 L270、278 读 [L269]
│   │       │   │   ├── result ← receipt(service, operation)；result 在 L271、272 读 [L270]
│   │       │   │   ├── 断言 result['phase'] == 'publishing'，失败抛出 AssertionError [L271]
│   │       │   │   ├── 断言 result['error']['code'] == 'INTERNAL_STORAGE_ERROR'，失败抛出 AssertionError [L272]
│   │       │   │   └── 断言 not service.assets.list()['assets']，失败抛出 AssertionError [L273]
│   │       │   ├── finally 退出清理 [L268]
│   │       │   │   └── 执行 event.remove(service.db.sessions.class_, 'after_flush', rollback_before_commit) [L275]
│   │       │   ├── recovered ← StorageRuntime.initialize(service.root, service.environ)；recovered 在 L277、278 读 [L276]
│   │       │   ├── 执行 recovered.operations.pool.shutdown(wait=True) [L277]
│   │       │   ├── 断言 receipt(recovered, operation)['receipt']['copied'] == 1，失败抛出 AssertionError [L278]
│   │       │   ├── 断言 len(list((service.root / 'workspace/objects').glob('*/*'))) == 1，失败抛出 AssertionError [L279]
│   │       │   └── 断言 not list((service.root / 'workspace/.staging').iterdir())，失败抛出 AssertionError [L280]
│   │       ├── 函数 test_cancel_partial_staging(service, tmp_path, monkeypatch) [L283]
│   │       │   ├── source ← file_at(tmp_path / 'capture/a.fits')；source 在 L294、297 读 [L284]
│   │       │   ├── original ← service.operations.checkpoint；original 在 L291 读 [L285]
│   │       │   ├── 函数 cancel(operation) [L287]
│   │       │   │   ├── staging ← service.root / 'workspace/.staging' / operation；staging 在 L289 读 [L288]
│   │       │   │   ├── 若 staging.exists() and list(staging.glob('*.part')) [L289]
│   │       │   │   │   └── 执行 service.operations.cancel(operation, 'import') [L290]
│   │       │   │   └── 执行 original(operation) [L291]
│   │       │   ├── 执行 monkeypatch.setattr(service.operations, 'checkpoint', cancel) [L293]
│   │       │   ├── operation ← start_import(service, source, import_mode_override='copy')；operation 在 L288、290、291、295 读 [L294]
│   │       │   ├── 断言 receipt(service, operation)['phase'] == 'cancelled'，失败抛出 AssertionError [L295]
│   │       │   ├── 断言 not service.assets.list()['assets']，失败抛出 AssertionError [L296]
│   │       │   └── 断言 source.exists() and (not list((service.root / 'workspace/.staging').iterdir()))，失败抛出 AssertionError [L297]
│   │       ├── 函数 test_migration_recovers_around_database_switch(service, tmp_path, monkeypatch, checkpoint) [L301]
│   │       │   ├── source ← file_at(tmp_path / 'capture/a.fits')；source 在 L305、308、329、335、339 读 [L304]
│   │       │   ├── copied ← start_import(service, source, import_mode_override='copy')；copied 在 L306 读 [L305]
│   │       │   ├── initial ← receipt(service, copied)；initial 在 L307 读 [L306]
│   │       │   ├── 断言 initial['receipt']['copied'] == 1，失败抛出 AssertionError [L307]
│   │       │   ├── outside ← start_import(service, source, key='external')；outside 在 L309 读 [L308]
│   │       │   ├── 断言 receipt(service, outside)['receipt']['registered'] == 1，失败抛出 AssertionError [L309]
│   │       │   ├── archived ← service.workspaces.register(str(tmp_path / 'archive'), 'Archive')；archived 在 L337 读 [L310]
│   │       │   ├── 执行 (tmp_path / 'archive').rename(tmp_path / 'unmounted') [L311]
│   │       │   ├── asset ← next((row for row in service.assets.list()['assets'] if row['storage_mode'] == 'managed'))；asset 在 L313、334 读 [L312]
│   │       │   ├── old_file ← service.assets.resolve_asset(asset['id'])；old_file 在 L334、335 读 [L313]
│   │       │   ├── workspace ← default_id(service)；workspace 在 L323、327、333 读 [L314]
│   │       │   ├── target ← tmp_path / 'migrated'；target 在 L323、326、334、336 读 [L315]
│   │       │   ├── 进入上下文 monkeypatch.context() → patched，退出时交由上下文释放资源 [L316]
│   │       │   │   ├── 函数 interrupt(*_args, **_kwargs) [L317]
│   │       │   │   │   └── 抛出 RuntimeError('simulated crash') [L318]
│   │       │   │   ├── 若 checkpoint == 'before' [L319]
│   │       │   │   │   └── 执行 patched.setattr(migration, 'rebind_workspace', interrupt) [L320]
│   │       │   │   ├── 否则 [L319]
│   │       │   │   │   └── 执行 patched.setattr(service.migrations, '_complete', interrupt) [L322]
│   │       │   │   ├── operation ← service.migrations.start({'workspace_id': workspace, 'target_path': str(target), 'idempotency_key': 'migration'})；operation 在 L324、332 读 [L323]
│   │       │   │   ├── status ← receipt(service, operation, 'migration')；status 在 L325 读 [L324]
│   │       │   │   ├── 断言 status['phase'] == ('publishing' if checkpoint == 'before' else 'committed')，失败抛出 AssertionError [L325]
│   │       │   │   ├── expected ← target if checkpoint == 'after' else service.root / 'workspace'；expected 在 L327 读 [L326]
│   │       │   │   ├── 断言 Path(service.workspaces.get(workspace).root_path) == expected，失败抛出 AssertionError [L327]
│   │       │   │   └── 进入上下文 pytest.raises(StorageError, match='STORAGE_BUSY')，退出时交由上下文释放资源 [L328]
│   │       │   │       └── 执行 start_import(service, source, key='busy', import_mode_override='copy') [L329]
│   │       │   ├── recovered ← StorageRuntime.initialize(service.root, service.environ)；recovered 在 L331、332、333、334、337 读 [L330]
│   │       │   ├── 执行 recovered.operations.pool.shutdown(wait=True) [L331]
│   │       │   ├── 断言 receipt(recovered, operation, 'migration')['phase'] == 'completed'，失败抛出 AssertionError [L332]
│   │       │   ├── 断言 recovered.workspaces.get(workspace).id == workspace，失败抛出 AssertionError [L333]
│   │       │   ├── 断言 recovered.assets.resolve_asset(asset['id']) == target / old_file.relative_to(service.root / 'workspace')，失败抛出 AssertionError [L334]
│   │       │   ├── 断言 old_file.read_bytes() == source.read_bytes()，失败抛出 AssertionError [L335]
│   │       │   ├── 断言 (target / WORKSPACE_MARKER).exists()，失败抛出 AssertionError [L336]
│   │       │   ├── 断言 recovered.workspaces.check_status(recovered.workspaces.get(archived['id']))['status'] == 'offline'，失败抛出 AssertionError [L337]
│   │       │   ├── ref ← next((row for row in service.assets.list()['assets'] if row['storage_mode'] == 'external_reference'))；ref 在 L339 读 [L338]
│   │       │   └── 断言 service.assets.resolve_asset(ref['id']) == source，失败抛出 AssertionError [L339]
│   │       ├── 函数 test_migration_actual_cross_volume(service, tmp_path) [L342]
│   │       │   ├── volume ← os.environ.get('ASTROPHOTO_TEST_SECOND_VOLUME')；volume 在 L344、346 读 [L343]
│   │       │   ├── 若 not volume [L344]
│   │       │   │   └── 跳过测试 pytest.skip('Set ASTROPHOTO_TEST_SECOND_VOLUME to authorize a temporary directory on a second local volume') [L345]
│   │       │   └── 进入上下文 TemporaryDirectory(prefix='astrophoto-test-', dir=volume) → temporary，退出时交由上下文释放资源 [L346]
│   │       │       ├── target ← Path(temporary).resolve() / 'workspace'；target 在 L348、350、354 读 [L347]
│   │       │       ├── 断言 target.parent.stat().st_dev != service.root.stat().st_dev，失败抛出 AssertionError [L348]
│   │       │       ├── old ← file_at(service.root / 'workspace/outputs/result.fits')；old 在 L354 读 [L349]
│   │       │       ├── operation ← service.migrations.start({'workspace_id': default_id(service), 'target_path': str(target), 'idempotency_key': 'cross'})；operation 在 L351 读 [L350]
│   │       │       ├── result ← receipt(service, operation, 'migration')；result 在 L352、353 读 [L351]
│   │       │       ├── 断言 result['phase'] == 'completed'，失败抛出 AssertionError [L352]
│   │       │       ├── 断言 result['receipt']['verification'] == 'sha256'，失败抛出 AssertionError [L353]
│   │       │       └── 断言 (target / 'outputs/result.fits').read_bytes() == old.read_bytes()，失败抛出 AssertionError [L354]
│   │       ├── 函数 test_reference_shared_sessions_leave_the_file_and_other_reference(service, tmp_path) [L358]
│   │       │   ├── path ← file_at(tmp_path / 'capture/one.fits')；path 在 L360、361、367 读 [L359]
│   │       │   ├── first ← start_import(service, path, session_id='first')；first 在 L362 读 [L360]
│   │       │   ├── second ← start_import(service, path, key='second', session_id='second')；second 在 L362 读 [L361]
│   │       │   ├── 断言 receipt(service, first)['phase'] == receipt(service, second)['phase'] == 'completed'，失败抛出 AssertionError [L362]
│   │       │   ├── (asset,) ← service.assets.list()['assets']；asset 在 L364、365、367 读 [L363]
│   │       │   ├── 断言 asset['session_ids'] == ['first', 'second']，失败抛出 AssertionError [L364]
│   │       │   ├── 执行 service.assets.set_session(asset['id'], 'first', False) [L365]
│   │       │   ├── 断言 service.assets.list()['assets'][0]['session_ids'] == ['second']，失败抛出 AssertionError [L366]
│   │       │   └── 断言 service.assets.resolve_asset(asset['id']).read_bytes() == path.read_bytes()，失败抛出 AssertionError [L367]
│   │       ├── 函数 test_process_exit_during_copy_resumes_own_staging(service, tmp_path) [L370]
│   │       │   ├── source ← file_at(tmp_path / 'capture/abrupt.fits')；source 在 L389 读 [L371]
│   │       │   ├── child ← '\nimport os\nimport sys\nfrom pathlib import Path\nfrom astrophoto.storage.runtime import StorageRuntime\nroot, capture = (Path(p) for p in sys.argv[1:])\nservice = Stor…；child 在 L389 读 [L372]
│   │       │   ├── process ← subprocess.run([sys.executable, '-c', child, str(service.root), str(source)], timeout=20)；process 在 L390 读 [L389]
│   │       │   ├── 断言 process.returncode == 77，失败抛出 AssertionError [L390]
│   │       │   ├── (pending,) ← service.operations.recent()；pending 在 L392、396 读 [L391]
│   │       │   ├── 断言 pending['phase'] == 'importing'，失败抛出 AssertionError [L392]
│   │       │   ├── 断言 service.assets.list()['assets'] == []，失败抛出 AssertionError [L393]
│   │       │   ├── recovered ← StorageRuntime.initialize(service.root, service.environ)；recovered 在 L395、396 读 [L394]
│   │       │   ├── 执行 recovered.operations.pool.shutdown(wait=True) [L395]
│   │       │   ├── 断言 receipt(recovered, pending['operation_id'])['receipt']['copied'] == 1，失败抛出 AssertionError [L396]
│   │       │   └── 断言 not list((service.root / 'workspace/.staging').iterdir())，失败抛出 AssertionError [L397]
│   │       ├── 函数 test_migration_verification_error_keeps_source(service, tmp_path, monkeypatch) [L400]
│   │       │   ├── source ← file_at(service.root / 'workspace/outputs/result.fits')；source 在 L415 读 [L403]
│   │       │   ├── target ← tmp_path / 'migrated'；target 在 L408、411、416 读 [L404]
│   │       │   ├── original ← migration.file_hash；original 在 L408 读 [L405]
│   │       │   ├── 函数 corrupt_checksum(path, checkpoint) [L407]
│   │       │   │   └── 返回 'invalid target digest' if path.is_relative_to(target) else original(path, checkpoint) [L408]
│   │       │   ├── 执行 monkeypatch.setattr(migration, 'file_hash', corrupt_checksum) [L410]
│   │       │   ├── operation ← service.migrations.start({'workspace_id': default_id(service), 'target_path': str(target), 'idempotency_key': 'hash'})；operation 在 L412 读 [L411]
│   │       │   ├── result ← receipt(service, operation, 'migration')；result 在 L413 读 [L412]
│   │       │   ├── 断言 result['phase'] == 'failed' and result['error']['code'] == 'COPY_VERIFY_FAILED'，失败抛出 AssertionError [L413]
│   │       │   ├── 断言 service.workspaces.get(default_id(service)).root_path == str(service.root / 'workspace')，失败抛出 AssertionError [L414]
│   │       │   ├── 断言 source.read_bytes() == b'FITS bytes\x00\xff'，失败抛出 AssertionError [L415]
│   │       │   └── 断言 not (target / WORKSPACE_MARKER).exists()，失败抛出 AssertionError [L416]
│   │       ├── 函数 test_reject_links_unc_and_relative_paths(service, tmp_path) [L419]
│   │       │   ├── 循环 unsafe ← ('relative', '\\\\server\\share', str(tmp_path.anchor)) [L422]
│   │       │   │   └── 进入上下文 pytest.raises(StorageError)，退出时交由上下文释放资源 [L423]
│   │       │   │       └── 执行 canonicalize_root(unsafe) [L424]
│   │       │   ├── 循环 unsafe ← ('../outside', 'objects//a', 'objects/CON', 'objects/a:stream') [L425]
│   │       │   │   └── 进入上下文 pytest.raises(StorageError)，退出时交由上下文释放资源 [L426]
│   │       │   │       └── 执行 safe_join_workspace(service.root / 'workspace', unsafe) [L427]
│   │       │   ├── real ← tmp_path / 'real'；real 在 L429、432、436、439 读 [L428]
│   │       │   ├── 执行 real.mkdir() [L429]
│   │       │   ├── redirect ← tmp_path / 'redirect'；redirect 在 L432、436、438 读 [L430]
│   │       │   ├── 尝试 [L431]
│   │       │   │   └── 执行 redirect.symlink_to(real, target_is_directory=True) [L432]
│   │       │   ├── 捕获 (NotImplementedError, OSError) [L433]
│   │       │   │   ├── 若 os.name != 'nt' [L434]
│   │       │   │   │   └── 重新抛出当前异常 [L435]
│   │       │   │   └── 执行 subprocess.run(['cmd.exe', '/d', '/c', 'mklink', '/j', str(redirect), str(real)], check=True, capture_output=True) [L436]
│   │       │   ├── 进入上下文 pytest.raises(StorageError)，退出时交由上下文释放资源 [L437]
│   │       │   │   └── 执行 service.workspaces.register(redirect / 'new', 'unsafe') [L438]
│   │       │   └── 断言 not list(real.iterdir())，失败抛出 AssertionError [L439]
│   │       ├── 函数 test_reference_on_distinct_windows_volumes(service, tmp_path) [L442]
│   │       │   ├── volume ← os.environ.get('ASTROPHOTO_TEST_SECOND_VOLUME')；volume 在 L444、446 读 [L443]
│   │       │   ├── 若 not volume [L444]
│   │       │   │   └── 跳过测试 pytest.skip('Second local volume unavailable') [L445]
│   │       │   └── 进入上下文 TemporaryDirectory(prefix='astrophoto-reference-', dir=volume) → temporary，退出时交由上下文释放资源 [L446]
│   │       │       ├── capture_a ← tmp_path / 'capture'；capture_a 在 L449、452、454 读 [L447]
│   │       │       ├── capture_b ← Path(temporary).resolve()；capture_b 在 L450、452、454 读 [L448]
│   │       │       ├── first ← file_at(capture_a / 'first.fit', b'from first volume')；first 在 L451、458、459 读 [L449]
│   │       │       ├── second ← file_at(capture_b / 'second.ser', b'from second volume')；second 在 L451、458、459 读 [L450]
│   │       │       ├── 断言 first.stat().st_dev != second.stat().st_dev，失败抛出 AssertionError [L451]
│   │       │       ├── service.environ['ASTROPHOTO_IMPORT_ROOTS'] ← os.pathsep.join((str(capture_a), str(capture_b))) [L452]
│   │       │       ├── operation ← service.imports.import_assets({'sources': [str(capture_a), str(capture_b)], 'idempotency_key': 'cross-volume-reference'})；operation 在 L456 读 [L453]
│   │       │       ├── result ← receipt(service, operation)；result 在 L457 读 [L456]
│   │       │       ├── 断言 result['receipt']['registered'] == 2，失败抛出 AssertionError [L457]
│   │       │       ├── 断言 {service.assets.resolve_asset(asset['id']) for asset in service.assets.list()['assets']} == {first, second}，失败抛出 AssertionError [L458]
│   │       │       ├── 断言 first.read_bytes() == b'from first volume' and second.read_bytes() == b'from second volume'，失败抛出 AssertionError [L459]
│   │       │       └── 断言 not list((service.root / 'workspace/objects').iterdir())，失败抛出 AssertionError [L460]
│   │       ├── 函数 test_explicit_wal_failure_has_no_fake_ready(tmp_path) [L463]
│   │       │   ├── database ← DatabaseManager(tmp_path / 'wal-unavailable.db')；database 在 L469、476、477 读 [L467]
│   │       │   ├── 函数 previous_journal(connection, cursor, statement, parameters, context, executemany) [L470]
│   │       │   │   ├── 若 statement == 'PRAGMA journal_mode=WAL' [L471]
│   │       │   │   │   └── 提前返回 ('PRAGMA journal_mode=DELETE', parameters) [L472]
│   │       │   │   └── 返回 (statement, parameters) [L473]
│   │       │   ├── 进入上下文 pytest.raises(StorageError, match='WAL_UNAVAILABLE')，退出时交由上下文释放资源 [L475]
│   │       │   │   └── 执行 database.initialize('test', creating=True) [L476]
│   │       │   └── 进入上下文 sqlite3.connect(database.path) → connection，退出时交由上下文释放资源 [L477]
│   │       │       ├── 断言 connection.execute('PRAGMA journal_mode').fetchone() == ('delete',)，失败抛出 AssertionError [L478]
│   │       │       └── 断言 not connection.execute("SELECT name FROM sqlite_schema WHERE type='table'").fetchall()，失败抛出 AssertionError [L479]
│   │       ├── 函数 test_legacy_dev_schema_is_preserved(service) [L482]
│   │       │   ├── file ← service.db.path；file 在 L484、487、491 读 [L483]
│   │       │   ├── 进入上下文 sqlite3.connect(file) → conn，退出时交由上下文释放资源 [L484]
│   │       │   │   ├── 执行 conn.execute("UPDATE alembic_version SET version_num='0002_asset_sessions'") [L485]
│   │       │   │   └── 执行 conn.execute("INSERT INTO assets VALUES ('existing', 'existing.fits', 1, 0)") [L486]
│   │       │   ├── original ← file.read_bytes()；original 在 L491 读 [L487]
│   │       │   ├── 进入上下文 pytest.raises(StorageError) → rejected，退出时交由上下文释放资源 [L488]
│   │       │   │   └── 执行 StorageRuntime.initialize(service.root, {}) [L489]
│   │       │   ├── 断言 rejected.value.code == 'DEV_SCHEMA_RESET_REQUIRED'，失败抛出 AssertionError [L490]
│   │       │   └── 断言 file.read_bytes() == original，失败抛出 AssertionError [L491]
│   │       └── 测试覆盖（本文件的用例与断言）
│   │           ├── test_first_start_and_reentry（52 行） → initial['default_workspace_id'] == default_id(other)，service.workspaces.instance_id == other.workspaces.instance_id，initial['imports'] == {'default_mode': 'reference', 'revision': 0}，initial['cache']['max_size_gb'] == 20
│   │           ├── test_bootstrap_interrupted_after_database_commit（64 行） → pytest.raises(RuntimeError, match='injected')，after.workspaces.instance_id == before['instance_id']，default_id(after) == before['initial_workspace_id']
│   │           ├── test_never_replaces_an_existing_asset_database（85 行） → pytest.raises(StorageError)，error.value.code == code，(file.read_bytes() if file.exists() else None) == before
│   │           ├── test_multi_process_bootstrap（103 行） → a.returncode == b.returncode == 0，a_result and a_result == b_result
│   │           ├── test_foreign_keys_busy_rollback_and_backup（116 行） → pytest.raises(IntegrityError)，not list(session.scalars(select(AssetLocation)))，pytest.raises(OperationalError, match='locked')，copied.execute('PRAGMA integrity_check').fetchone() == ('ok',)
│   │           ├── test_multiple_workspaces_default_disable_and_offline_relocation（135 行） → a['id'] != b['id']，pytest.raises(StorageError, match='STORAGE_PATH_CONFLICT')，service.workspaces.check_status(service.workspaces.get(b['id']))['status'] == 'disabled'，service.workspaces.check_status(service.workspaces.get(a['id']))['status'] == 'offline'
│   │           ├── test_cache_owner_entries_only_with_live_lease（161 行） → service.cache.configure(root, 7, 0)['max_size_gb'] == 7，first.read_bytes() == b'old'，result == {'removed': 1, 'removed_bytes': 6, 'skipped': 1, 'failed': 0}，unknown.exists() and kept.exists() and (not removed.exists()) and managed.exists()
│   │           ├── test_reference_multiple_roots_mode_snapshot_and_relocation（176 行） → result['effective_import_mode'] == 'reference'，result['receipt']['registered'] == 2，not list((service.root / 'workspace/objects').iterdir())，a.read_bytes() == b.read_bytes() == b'FITS bytes\x00\xff'
│   │           ├── test_copy_override_idempotency_and_real_bytes（202 行） → result['phase'] == 'completed'，result['receipt']['copied'] == 1，result['receipt']['verification'] == 'size_and_stat'，managed.read_bytes() == source.read_bytes()
│   │           ├── test_copy_preflight_blocks_offline_read_only_full_and_unauthorized（219 行） → pytest.raises(StorageError, match='WORKSPACE_OFFLINE')，pytest.raises(StorageError, match='WORKSPACE_READ_ONLY')，pytest.raises(StorageError, match='INSUFFICIENT_DISK_SPACE')，receipt(service, operation)['error']['code'] == 'INSUFFICIENT_DISK_SPACE'
│   │           ├── test_copy_detects_inflight_source_change（241 行） → receipt(service, operation)['receipt']['errors'][0]['code'] == 'SOURCE_CHANGED'，not service.assets.list()['assets']，not list((service.root / 'workspace/.staging').iterdir())
│   │           ├── test_copy_recovers_after_publish_before_db_commit（259 行） → result['phase'] == 'publishing'，result['error']['code'] == 'INTERNAL_STORAGE_ERROR'，not service.assets.list()['assets']，receipt(recovered, operation)['receipt']['copied'] == 1
│   │           ├── test_cancel_partial_staging（283 行） → receipt(service, operation)['phase'] == 'cancelled'，not service.assets.list()['assets']，source.exists() and (not list((service.root / 'workspace/.staging').iterdir()))
│   │           ├── test_migration_recovers_around_database_switch（301 行） → initial['receipt']['copied'] == 1，receipt(service, outside)['receipt']['registered'] == 1，status['phase'] == ('publishing' if checkpoint == 'before' else 'committed')，Path(service.workspaces.get(workspace).root_path) == expected
│   │           ├── test_migration_actual_cross_volume（342 行） → target.parent.stat().st_dev != service.root.stat().st_dev，result['phase'] == 'completed'，result['receipt']['verification'] == 'sha256'，(target / 'outputs/result.fits').read_bytes() == old.read_bytes()
│   │           ├── test_reference_shared_sessions_leave_the_file_and_other_reference（358 行） → receipt(service, first)['phase'] == receipt(service, second)['phase'] == 'completed'，asset['session_ids'] == ['first', 'second']，service.assets.list()['assets'][0]['session_ids'] == ['second']，service.assets.resolve_asset(asset['id']).read_bytes() == path.read_bytes()
│   │           ├── test_process_exit_during_copy_resumes_own_staging（370 行） → process.returncode == 77，pending['phase'] == 'importing'，service.assets.list()['assets'] == []，receipt(recovered, pending['operation_id'])['receipt']['copied'] == 1
│   │           ├── test_migration_verification_error_keeps_source（400 行） → result['phase'] == 'failed' and result['error']['code'] == 'COPY_VERIFY_FAILED'，service.workspaces.get(default_id(service)).root_path == str(service.root / 'workspace')，source.read_bytes() == b'FITS bytes\x00\xff'，not (target / WORKSPACE_MARKER).exists()
│   │           ├── test_reject_links_unc_and_relative_paths（419 行） → pytest.raises(StorageError)，not list(real.iterdir())
│   │           ├── test_reference_on_distinct_windows_volumes（442 行） → first.stat().st_dev != second.stat().st_dev，result['receipt']['registered'] == 2，{service.assets.resolve_asset(asset['id']) for asset in service.assets.list()['assets']} == {first, second}，first.read_bytes() == b'from first volume' and second.read_bytes() == b'from second volume'
│   │           ├── test_explicit_wal_failure_has_no_fake_ready（463 行） → pytest.raises(StorageError, match='WAL_UNAVAILABLE')，connection.execute('PRAGMA journal_mode').fetchone() == ('delete',)，not connection.execute("SELECT name FROM sqlite_schema WHERE type='table'").fetchall()
│   │           └── test_legacy_dev_schema_is_preserved（482 行） → pytest.raises(StorageError)，rejected.value.code == 'DEV_SCHEMA_RESET_REQUIRED'，file.read_bytes() == original
│   │   └── test_storage_review.py — 正式回归 R-01～R-05，真实临时目录、SQLite 与定点中断注入。
│   │       ├── R-01：旧根消失后，目标缺失、同尺寸内容变化都留待清单；恢复目标后同 ID 重试成功。
│   │       ├── R-02：直接删登记文件后复检、快照报缺件，现存文件与新增 copy 可用，补回后恢复。
│   │       ├── R-03：搬家 catalog 提交前、回退提交后中断均可通过原入口恢复有效根及资产。
│   │       ├── R-04：plan 与 move 对缺件返回相同代码和明细，目标与 catalog 保持原状态。
│   │       └── R-05：有持久迁移记录时目标 Workspace 禁止解除。
│   ├── conftest.py — 提供隔离的 ComfyUI 宿主替身和扩展 fixture。
│   │   └── 函数 extension(monkeypatch, tmp_path) [L13]
│   │       ├── 类 Input [L16]
│   │       │   └── 函数 __init__(self, id, **_kwargs) [L17]
│   │       │       └── self.id ← id [L18]
│   │       ├── 类 Output [L20]
│   │       │   └── 函数 __init__(self, display_name=None) [L21]
│   │       │       ├── self.display_name ← display_name [L22]
│   │       │       └── self.io_type ← 'IMAGE' [L23]
│   │       ├── 函数 custom(io_type) [L25]
│   │       │   └── 返回 SimpleNamespace(Input=type('CustomInput', (Input,), {'io_type': io_type}), Output=lambda **kwargs: SimpleNamespace(io_type=io_type, **kwargs)) [L26]
│   │       ├── 类 NodeOutput [L29]
│   │       │   └── 函数 __init__(self, *args, **kwargs) [L30]
│   │       │       ├── self.result ← args [L31]
│   │       │       └── self.ui ← kwargs.get('ui') [L32]
│   │       ├── latest ← ModuleType('comfy_api.latest')；latest 在 L35、36、41 读 [L34]
│   │       ├── latest.ComfyExtension ← type('ComfyExtension', (), {}) [L35]
│   │       ├── latest.io ← SimpleNamespace(ComfyNode=type('ComfyNode', (), {}), Schema=SimpleNamespace, Custom=custom, Image=SimpleNamespace(Output=Output), NodeOutput=NodeOutput, Float=custom('FLO… [L36]
│   │       ├── 执行 monkeypatch.setitem(sys.modules, 'comfy_api', ModuleType('comfy_api')) [L40]
│   │       ├── 执行 monkeypatch.setitem(sys.modules, 'comfy_api.latest', latest) [L41]
│   │       ├── folder_paths ← ModuleType('folder_paths')；folder_paths 在 L55、62 读 [L42]
│   │       ├── host_nodes ← ModuleType('nodes')；host_nodes 在 L56、57、63、71 读 [L43]
│   │       ├── state ← SimpleNamespace(image=object(), mask=object(), calls=[], path=str(tmp_path / 'drawing.png'))；state 在 L47、48、52、53、71 读 [L44]
│   │       ├── 函数 resolve(path) [L46]
│   │       │   ├── 执行 state.calls.append(('resolve', path)) [L47]
│   │       │   └── 返回 state.path [L48]
│   │       ├── 类 LoadImage [L50]
│   │       │   └── 函数 load_image(self, image) [L51]
│   │       │       ├── 执行 state.calls.append(('load', image)) [L52]
│   │       │       └── 返回 (state.image, state.mask) [L53]
│   │       ├── folder_paths.get_annotated_filepath ← resolve [L55]
│   │       ├── host_nodes.LoadImage ← LoadImage [L56]
│   │       ├── host_nodes.NODE_CLASS_MAPPINGS ← {}；host_nodes.NODE_CLASS_MAPPINGS 在 L71 读 [L57]
│   │       ├── server ← ModuleType('server')；server 在 L60、61 读 [L58]
│   │       ├── routes ← web.RouteTableDef()；routes 在 L60、71 读 [L59]
│   │       ├── server.PromptServer ← SimpleNamespace(instance=SimpleNamespace(routes=routes)) [L60]
│   │       ├── 执行 monkeypatch.setitem(sys.modules, 'server', server) [L61]
│   │       ├── 执行 monkeypatch.setitem(sys.modules, 'folder_paths', folder_paths) [L62]
│   │       ├── 执行 monkeypatch.setitem(sys.modules, 'nodes', host_nodes) [L63]
│   │       ├── root ← Path(__file__).resolve().parents[1]；root 在 L66、71 读 [L64]
│   │       ├── name ← 'astrophoto_extension_test'；name 在 L66、68、75 读 [L65]
│   │       ├── spec ← importlib.util.spec_from_file_location(name, root / '__init__.py', submodule_search_locations=[str(root)])；spec 在 L67、70 读 [L66]
│   │       ├── module ← importlib.util.module_from_spec(spec)；module 在 L68、70、71 读 [L67]
│   │       ├── 执行 monkeypatch.setitem(sys.modules, name, module) [L68]
│   │       ├── 尝试 [L69]
│   │       │   ├── 执行 spec.loader.exec_module(module) [L70]
│   │       │   └── 产出并暂停 (yield SimpleNamespace(module=module, host=state, root=root, routes=routes, registry=host_nodes.NODE_CLASS_MAPPINGS)) [L71]
│   │       └── finally 退出清理 [L69]
│   │           └── 循环 key ← list(sys.modules) [L74]
│   │               └── 若 key.startswith(name + '.') [L75]
│   │                   └── 执行 del sys.modules[key] [L76]
│   ├── integration/ — HTTP 路由及可选真实宿主集成测试。
│   │   ├── test_equipment_api.py — 测试设备及组合 HTTP 授权、版本、历史、路由冲突及官网样本创建、读回和逐用例 API 清理。
│   │   │   ├── 项目内导入
│   │   │   │   ├── BASE ← astrophoto/api/routes.py（L7），用于 equipment = BASE + "/equipment" / trains = BASE + "/optical-trains" / status = await (await client.get(BASE + "/status")).json() / assert (await client.get(BASE + "/storage", headers=BROWSER)).status == 200
│   │   │   │   ├── register_routes ← astrophoto/api/routes.py（L7），用于 register_routes(routes, runtime) / assert register_routes(routes, runtime) is runtime
│   │   │   │   ├── bootstrap ← astrophoto/bootstrap.py（L8），用于 runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data")) / runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "unused"))
│   │   │   │   ├── initialize_storage_runtime ← astrophoto/bootstrap.py（L8），用于 initialize_storage_runtime(runtime)
│   │   │   │   └── AppConfig ← astrophoto/core/config.py（L9），用于 runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data")) / runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "unused"))
│   │   │   ├── BROWSER ← {'X-AstroPhoto-Local': '1', 'Sec-Fetch-Site': 'same-origin'}；BROWSER 在 L33、34、35、36、37 等 22 处 读 [L11]
│   │   │   ├── TOKEN ← 'test-only-' + 'a' * 45；TOKEN 在 L18、29 读 [L12]
│   │   │   ├── 函数 test_equipment_and_train_api_permissions_receipts_and_errors(tmp_path) [L15]
│   │   │   │   ├── runtime ← bootstrap(lambda: True, AppConfig('test', '0.0.1', tmp_path / 'data'))；runtime 在 L17、18、20、21、31 等 6 处 读 [L16]
│   │   │   │   ├── 执行 initialize_storage_runtime(runtime) [L17]
│   │   │   │   ├── runtime.equipment_read_token ← TOKEN [L18]
│   │   │   │   ├── routes ← web.RouteTableDef()；routes 在 L20、21、23 读 [L19]
│   │   │   │   ├── 执行 register_routes(routes, runtime) [L20]
│   │   │   │   ├── 断言 register_routes(routes, runtime) is runtime，失败抛出 AssertionError [L21]
│   │   │   │   ├── app ← web.Application()；app 在 L23、26 读 [L22]
│   │   │   │   ├── 执行 app.add_routes(routes) [L23]
│   │   │   │   ├── 异步函数 exercise() [L25]
│   │   │   │   │   └── 进入上下文 TestClient(TestServer(app)) → client，退出时交由上下文释放资源 [L26]
│   │   │   │   │       ├── equipment ← BASE + '/equipment'；equipment 在 L30、38、41、44、45 等 13 处 读 [L27]
│   │   │   │   │       ├── trains ← BASE + '/optical-trains'；trains 在 L65、67、83 读 [L28]
│   │   │   │   │       ├── agent ← {'Authorization': 'Bearer ' + TOKEN}；agent 在 L30、37、41、44、46 等 12 处 读 [L29]
│   │   │   │   │       ├── 断言 (await client.get(equipment, headers=agent)).status == 403，失败抛出 AssertionError [L30]
│   │   │   │   │       ├── runtime.trusted_local ← True [L31]
│   │   │   │   │       ├── 循环 headers ← ({}, {'X-AstroPhoto-Local': '1', 'Comfy-User': 'someone'}, {**BROWSER, 'Origin': 'https://example.invalid'}, {**BROWSER, 'X-Forwarded-For': '127.0.0.1'}, {**BROWSER, 'Hos… [L32]
│   │   │   │   │       │   ├── denied ← await client.get(equipment, headers=headers)；denied 在 L39、40 读 [L38]
│   │   │   │   │       │   ├── 断言 denied.status == 403，失败抛出 AssertionError [L39]
│   │   │   │   │       │   └── 断言 (await denied.json())['error']['code'] == 'UNAUTHORIZED_EQUIPMENT_OPERATION'，失败抛出 AssertionError [L40]
│   │   │   │   │       ├── 断言 (await client.post(equipment, headers=agent, json={'name': 'No', 'equipment_type': 'camera'})).status == 403，失败抛出 AssertionError [L41]
│   │   │   │   │       ├── status ← await (await client.get(BASE + '/status')).json()；status 在 L43 读 [L42]
│   │   │   │   │       ├── 断言 status['capabilities']['equipment']['available'] and status['capabilities']['optical_trains']['available']，失败抛出 AssertionError [L43]
│   │   │   │   │       ├── 断言 (await client.get(equipment, headers=agent)).status == 200，失败抛出 AssertionError [L44]
│   │   │   │   │       ├── 断言 (await client.post(equipment, headers=BROWSER, data='not JSON')).status == 400，失败抛出 AssertionError [L45]
│   │   │   │   │       ├── 断言 (await client.get(equipment + '?limit=101', headers=agent)).status == 422，失败抛出 AssertionError [L46]
│   │   │   │   │       ├── invalid ← await client.post(equipment, headers=BROWSER, json={'equipment_type': 'camera', 'name': 'A', 'specs': {'sensor_width_px': -1}})；invalid 在 L49、50 读 [L47]
│   │   │   │   │       ├── body ← await invalid.json()；body 在 L50、51 读 [L49]
│   │   │   │   │       ├── 断言 invalid.status == 422 and body['request_id']，失败抛出 AssertionError [L50]
│   │   │   │   │       ├── 断言 body['error']['details']['fields'] == {'specs.sensor_width_px': 'invalid_value'}，失败抛出 AssertionError [L51]
│   │   │   │   │       ├── devices ← {}；devices 在 L57、62、69、70 读 [L52]
│   │   │   │   │       ├── 循环 kind ← ('camera', 'primary_optics', 'filter', 'optical_accessory') [L53]
│   │   │   │   │       │   ├── created ← await client.post(equipment, headers=BROWSER, json={'equipment_type': kind, 'name': 'Test ' + kind})；created 在 L55、56 读 [L54]
│   │   │   │   │       │   ├── 断言 created.status == 201，失败抛出 AssertionError [L55]
│   │   │   │   │       │   ├── device ← await created.json()；device 在 L57、58 读 [L56]
│   │   │   │   │       │   ├── devices[kind] ← device['id'] [L57]
│   │   │   │   │       │   └── 断言 device['row_version'] == 1，失败抛出 AssertionError [L58]
│   │   │   │   │       ├── first ← await (await client.get(equipment + '?limit=2', headers=agent)).json()；first 在 L60、61 读 [L59]
│   │   │   │   │       ├── later ← await (await client.get(equipment, params={'after': first['next']}, headers=agent)).json()；later 在 L61 读 [L60]
│   │   │   │   │       ├── 断言 len({row['id'] for row in first['items'] + later['items']}) == 4 and later['next'] is None，失败抛出 AssertionError [L61]
│   │   │   │   │       ├── camera ← equipment + '/' + devices['camera']；camera 在 L63、64、84、90 读 [L62]
│   │   │   │   │       ├── 断言 (await client.patch(camera, json={'expected_version': 1, 'name': 'Renamed'}, headers=BROWSER)).status == 200，失败抛出 AssertionError [L63]
│   │   │   │   │       ├── 断言 (await client.patch(camera, json={'expected_version': 1, 'name': 'Stale'}, headers=BROWSER)).status == 409，失败抛出 AssertionError [L64]
│   │   │   │   │       ├── create ← await client.post(trains, json={'name': 'Test train'}, headers=BROWSER)；create 在 L66、67 读 [L65]
│   │   │   │   │       ├── 断言 create.status == 201，失败抛出 AssertionError [L66]
│   │   │   │   │       ├── path ← trains + '/' + (await create.json())['id']；path 在 L68、73、76、79、82 等 9 处 读 [L67]
│   │   │   │   │       ├── draft ← await client.put(path + '/draft', headers=BROWSER, json={'expected_draft_version': None, 'draft': {'name': 'Test train', 'camera_id': devices['camera'], 'primary_optics_i…；draft 在 L71、72 读 [L68]
│   │   │   │   │       ├── 断言 draft.status == 200，失败抛出 AssertionError [L71]
│   │   │   │   │       ├── saved ← await draft.json()；saved 在 L80 读 [L72]
│   │   │   │   │       ├── stale ← await client.put(path + '/draft', headers=BROWSER, json={'expected_draft_version': None, 'draft': {'name': 'Stale'}})；stale 在 L74 读 [L73]
│   │   │   │   │       ├── 断言 stale.status == 409，失败抛出 AssertionError [L74]
│   │   │   │   │       ├── 循环 (method, suffix) ← (('POST', '/revisions'), ('PUT', '/default-revision')) [L75]
│   │   │   │   │       │   ├── response ← await client.request(method, path + suffix, headers=BROWSER, json={})；response 在 L77、78 读 [L76]
│   │   │   │   │       │   ├── 断言 response.status == 410，失败抛出 AssertionError [L77]
│   │   │   │   │       │   └── 断言 (await response.json())['error']['code'] == 'TRAIN_HISTORY_READ_ONLY'，失败抛出 AssertionError [L78]
│   │   │   │   │       ├── detail ← await (await client.get(path, headers=agent)).json()；detail 在 L80、81、85、86、87 读 [L79]
│   │   │   │   │       ├── 断言 detail['configuration']['draft_version'] == saved['draft_version']，失败抛出 AssertionError [L80]
│   │   │   │   │       ├── 断言 detail['summary']['camera'] == 'Renamed'，失败抛出 AssertionError [L81]
│   │   │   │   │       ├── 断言 (await (await client.get(path + '/revisions', headers=agent)).json())['items'] == []，失败抛出 AssertionError [L82]
│   │   │   │   │       ├── 断言 (await client.get(trains + '?q=Renamed', headers=agent)).status == 200，失败抛出 AssertionError [L83]
│   │   │   │   │       ├── 断言 (await client.delete(camera, headers=BROWSER, json={'expected_version': 2})).status == 409，失败抛出 AssertionError [L84]
│   │   │   │   │       ├── 断言 (await client.delete(path, headers=agent, json={'expected_version': detail['row_version']})).status == 403，失败抛出 AssertionError [L85]
│   │   │   │   │       ├── 断言 (await client.delete(path, headers=BROWSER, json={'expected_version': detail['row_version'] + 1})).status == 409，失败抛出 AssertionError [L86]
│   │   │   │   │       ├── deleted_train ← await client.delete(path, headers=BROWSER, json={'expected_version': detail['row_version']})；deleted_train 在 L88 读 [L87]
│   │   │   │   │       ├── 断言 deleted_train.status == 204，失败抛出 AssertionError [L88]
│   │   │   │   │       ├── 断言 (await client.get(path, headers=agent)).status == 404，失败抛出 AssertionError [L89]
│   │   │   │   │       ├── 断言 (await client.delete(camera, headers=BROWSER, json={'expected_version': 2})).status == 204，失败抛出 AssertionError [L90]
│   │   │   │   │       ├── unused ← await (await client.post(equipment, headers=BROWSER, json={'equipment_type': 'camera', 'name': 'Unused'})).json()；unused 在 L93 读 [L91]
│   │   │   │   │       ├── deleted ← await client.delete(equipment + '/' + unused['id'], headers=BROWSER, json={'expected_version': 1})；deleted 在 L94 读 [L93]
│   │   │   │   │       ├── 断言 deleted.status == 204 and deleted.headers['X-Request-ID']，失败抛出 AssertionError [L94]
│   │   │   │   │       ├── 断言 (await client.get(BASE + '/storage', headers=BROWSER)).status == 200，失败抛出 AssertionError [L95]
│   │   │   │   │       └── 断言 (await client.get(BASE + '/assets', headers=BROWSER)).status == 200，失败抛出 AssertionError [L96]
│   │   │   │   ├── 尝试 [L98]
│   │   │   │   │   └── 执行 asyncio.run(exercise()) [L99]
│   │   │   │   └── finally 退出清理 [L98]
│   │   │   │       └── 执行 runtime.storage.operations.pool.shutdown(wait=True) [L101]
│   │   │   ├── 函数 test_equipment_route_conflict_has_no_partial_registration(tmp_path) [L104]
│   │   │   │   ├── routes ← web.RouteTableDef()；routes 在 L106、109、110 读 [L105]
│   │   │   │   ├── 执行 routes.get(BASE + '/equipment')(lambda request: None) [L106]
│   │   │   │   ├── runtime ← bootstrap(lambda: True, AppConfig('test', '0.0.1', tmp_path / 'unused'))；runtime 在 L109 读 [L107]
│   │   │   │   ├── 进入上下文 pytest.raises(RuntimeError, match='/equipment')，退出时交由上下文释放资源 [L108]
│   │   │   │   │   └── 执行 register_routes(routes, runtime) [L109]
│   │   │   │   └── 断言 len(routes) == 1，失败抛出 AssertionError [L110]
│   │   │   └── 测试覆盖（本文件的用例与断言）
│   │   │       ├── test_equipment_and_train_api_permissions_receipts_and_errors（15 行） → register_routes(routes, runtime) is runtime，(await client.get(equipment, headers=agent)).status == 403，denied.status == 403，(await denied.json())['error']['code'] == 'UNAUTHORIZED_EQUIPMENT_OPERATION'
│   │   │       └── test_equipment_route_conflict_has_no_partial_registration（104 行） → pytest.raises(RuntimeError, match='/equipment')，len(routes) == 1
│   │   ├── test_host_runtime.py — 设置 COMFYUI_TEST_URL 后读取真实宿主状态及 vue-basic schema，断言绘图节点注册、输入 CUSTOM_VUE_COMPONENT_BASIC 和输出类型 IMAGE；不提交队列。
│   │   │   ├── 函数 test_running_comfyui_status_and_node() [L11]
│   │   │   │   ├── base ← os.environ.get('COMFYUI_TEST_URL')；base 在 L13、16 读 [L12]
│   │   │   │   ├── 若 not base [L13]
│   │   │   │   │   └── 跳过测试 pytest.skip('Set COMFYUI_TEST_URL to opt in to real host verification') [L14]
│   │   │   │   ├── 函数 get(path) [L15]
│   │   │   │   │   └── 进入上下文 urlopen(base.rstrip('/') + '/' + path, timeout=10) → response，退出时交由上下文释放资源 [L16]
│   │   │   │   │       └── 返回 json.load(response) [L17]
│   │   │   │   ├── status ← get('astrophoto/v1/status')；status 在 L19、20 读 [L18]
│   │   │   │   ├── 断言 status['status'] == 'ok'，失败抛出 AssertionError [L19]
│   │   │   │   ├── 断言 status['capabilities']['drawing_node']['available']，失败抛出 AssertionError [L20]
│   │   │   │   ├── node ← get('object_info/vue-basic')['vue-basic']；node 在 L22、23 读 [L21]
│   │   │   │   ├── 断言 node['input']['required']['custom_vue_component_basic'][0] == 'CUSTOM_VUE_COMPONENT_BASIC'，失败抛出 AssertionError [L22]
│   │   │   │   └── 断言 node['output'] == ['IMAGE']，失败抛出 AssertionError [L23]
│   │   │   └── 测试覆盖（本文件的用例与断言）
│   │   │       └── test_running_comfyui_status_and_node（11 行） → status['status'] == 'ok'，status['capabilities']['drawing_node']['available']，node['input']['required']['custom_vue_component_basic'][0] == 'CUSTOM_VUE_COMPONENT_BASIC'，node['output'] == ['IMAGE']
│   │   ├── test_siril_api.py — 在临时数据根验证公共科学接口及 Siril 路由。
│   │   │   ├── 项目内导入
│   │   │   │   ├── register_routes ← astrophoto/api/routes.py（L12），组装正式路由表
│   │   │   │   ├── bootstrap、initialize_storage_runtime ← astrophoto/bootstrap.py（L13），分别构建有 Bundle 与无 Bundle 的运行时
│   │   │   │   ├── AppConfig ← astrophoto/core/config.py（L14），隔离数据根
│   │   │   │   ├── Asset、AssetLocation ← astrophoto/database/models.py（L15），为 FITS 列表登记外部素材
│   │   │   │   ├── SirilBundle ← extension/siril/bundle.py（L16），通过 processing_bundle 参数装配
│   │   │   │   └── parameters ← extension/siril/processing.py（L17），生成候选请求中的参数
│   │   │   ├── BASE=/astrophoto/v1，LOCAL 提供 X-AstroPhoto-Local 头（L19–20）。
│   │   │   ├── test_scientific_api_access_source_and_cache（L23–88）创建有 Bundle 的 aiohttp 宿主，核对授权、无配置/错误路径、FITS 列表、登记资产及直接路径候选。未配置 Siril 时仍能读取 before PNG，after 为 404。删除外部样本后缓存读取为 404。结束时关闭 worker 和线程池。
│   │   │   └── test_generic_scientific_nodes_and_routes_without_siril（L91 起）经真实扩展入口的空 Bundle 配置检查独立科学节点、FITS/预览设置的读取与保存、Siril 专属路由缺席。
│   │   ├── test_status_api.py — 用 aiohttp 测试 V3 加载时状态路由注册、路由所有权及服务器隔离。
│   │   │   ├── 项目内导入
│   │   │   │   ├── STATUS_PATH ← astrophoto/api/routes.py（L9），用于 assert len([r for r in extension.routes if r.path == STATUS_PATH]) == 1 / response = await client.get(STATUS_PATH) / @foreign.get(STATUS_PATH)
│   │   │   │   ├── register_routes ← astrophoto/api/routes.py（L9），用于 assert register_routes(first, runtime) is runtime / assert register_routes(first, updated) is runtime / register_routes(second, updated) / register_routes(foreign, runtime)
│   │   │   │   ├── bootstrap ← astrophoto/bootstrap.py（L10），用于 runtime = bootstrap(lambda: True, config) / updated = bootstrap(lambda: False, config)
│   │   │   │   └── AppConfig ← astrophoto/core/config.py（L11），用于 config = AppConfig("test", "0.0.1", tmp_path)
│   │   │   ├── 函数 test_v3_load_registers_one_live_status_route(extension, monkeypatch, tmp_path) [L14]
│   │   │   │   ├── 执行 monkeypatch.setenv('ASTROPHOTO_HOME', str(tmp_path / 'data')) [L15]
│   │   │   │   ├── 异步函数 exercise() [L17]
│   │   │   │   │   ├── plugin ← await extension.module.comfy_entrypoint()；plugin 在 L19、20、28 读 [L18]
│   │   │   │   │   ├── 执行 await plugin.on_load() [L19]
│   │   │   │   │   ├── 执行 await plugin.on_load() [L20]
│   │   │   │   │   ├── 断言 len([r for r in extension.routes if r.path == STATUS_PATH]) == 1，失败抛出 AssertionError [L21]
│   │   │   │   │   ├── app ← web.Application()；app 在 L23、24 读 [L22]
│   │   │   │   │   ├── 执行 app.add_routes(extension.routes) [L23]
│   │   │   │   │   ├── 进入上下文 TestClient(TestServer(app)) → client，退出时交由上下文释放资源 [L24]
│   │   │   │   │   │   ├── response ← await client.get(STATUS_PATH)；response 在 L26、27、31 读 [L25]
│   │   │   │   │   │   ├── 断言 response.status == 200，失败抛出 AssertionError [L26]
│   │   │   │   │   │   ├── 断言 (await response.json())['status'] == 'degraded'，失败抛出 AssertionError [L27]
│   │   │   │   │   │   ├── node ← (await plugin.get_node_list())[0]；node 在 L29 读 [L28]
│   │   │   │   │   │   ├── extension.registry['vue-basic'] ← node [L29]
│   │   │   │   │   │   ├── response ← await client.get(STATUS_PATH)；response 在 L26、27、31 读 [L30]
│   │   │   │   │   │   └── 断言 (await response.json())['status'] == 'ok'，失败抛出 AssertionError [L31]
│   │   │   │   │   └── 断言 (tmp_path / 'data/databases/assets.db').is_file()，失败抛出 AssertionError [L32]
│   │   │   │   └── 执行 asyncio.run(exercise()) [L33]
│   │   │   ├── 函数 test_route_ownership_and_per_server_isolation(tmp_path) [L36]
│   │   │   │   ├── config ← AppConfig('test', '0.0.1', tmp_path)；config 在 L39、41 读 [L37]
│   │   │   │   ├── (first, second) ← (web.RouteTableDef(), web.RouteTableDef())；first 在 L40、42、45 读，second 在 L44、45 读 [L38]
│   │   │   │   ├── runtime ← bootstrap(lambda: True, config)；runtime 在 L40、42、43、53 读 [L39]
│   │   │   │   ├── 断言 register_routes(first, runtime) is runtime，失败抛出 AssertionError [L40]
│   │   │   │   ├── updated ← bootstrap(lambda: False, config)；updated 在 L42、44 读 [L41]
│   │   │   │   ├── 断言 register_routes(first, updated) is runtime，失败抛出 AssertionError [L42]
│   │   │   │   ├── 断言 not runtime.node_registered()，失败抛出 AssertionError [L43]
│   │   │   │   ├── 执行 register_routes(second, updated) [L44]
│   │   │   │   ├── 断言 len(first) == len(second) > 1，失败抛出 AssertionError [L45]
│   │   │   │   ├── foreign ← web.RouteTableDef()；foreign 在 L48、53 读 [L46]
│   │   │   │   ├── 异步函数 unrelated(_request) [L49]
│   │   │   │   │   └── 返回 web.Response() [L50]
│   │   │   │   └── 进入上下文 pytest.raises(RuntimeError, match='already owns')，退出时交由上下文释放资源 [L52]
│   │   │   │       └── 执行 register_routes(foreign, runtime) [L53]
│   │   │   └── 测试覆盖（本文件的用例与断言）
│   │   │       ├── test_v3_load_registers_one_live_status_route（14 行） → len([r for r in extension.routes if r.path == STATUS_PATH]) == 1，response.status == 200，(await response.json())['status'] == 'degraded'，(await response.json())['status'] == 'ok'
│   │   │       └── test_route_ownership_and_per_server_isolation（36 行） → register_routes(first, runtime) is runtime，register_routes(first, updated) is runtime，not runtime.node_registered()，len(first) == len(second) > 1
│   │   └── test_storage_api.py — 测试存储 HTTP 授权、配置、导入、整库预检和活动迁移目标解绑保护。
│   │       ├── v1.3 新增：`coordinated_storage_app` 隔离账号 catalog、Data Root 和 aiohttp。缺件、错误标记、脏暂存、活动作业、非空目标由 HTTP 返回详细拒绝，恢复夹具后 200。迁移目标 DELETE 在活动时 423，在终态后成功并回读，目录保留。
│   │       ├── 项目内导入
│   │       │   ├── register_routes ← astrophoto/api/routes.py（L6），用于 register_routes(routes, runtime)
│   │       │   ├── bootstrap ← astrophoto/bootstrap.py（L7），用于 runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
│   │       │   ├── initialize_storage_runtime ← astrophoto/bootstrap.py（L7），用于 initialize_storage_runtime(runtime)
│   │       │   └── AppConfig ← astrophoto/core/config.py（L8），用于 runtime = bootstrap(lambda: True, AppConfig("test", "0.0.1", tmp_path / "data"))
│   │       ├── BASE ← '/astrophoto/v1'；BASE 在 L29、68、71、74、78 等 7 处 读 [L10]
│   │       ├── LOCAL ← {'X-AstroPhoto-Local': '1'}；LOCAL 在 L30、32、35、37、39 等 17 处 读 [L11]
│   │       ├── 函数 test_http_storage_import_and_access_boundary(tmp_path, monkeypatch) [L14]
│   │       │   ├── capture ← tmp_path / 'capture'；capture 在 L16、17、19 读 [L15]
│   │       │   ├── 执行 capture.mkdir() [L16]
│   │       │   ├── file ← capture / 'capture.fit'；file 在 L18、71、73、89 读 [L17]
│   │       │   ├── 执行 file.write_bytes(b'original') [L18]
│   │       │   ├── 执行 monkeypatch.setenv('ASTROPHOTO_IMPORT_ROOTS', str(capture)) [L19]
│   │       │   ├── runtime ← bootstrap(lambda: True, AppConfig('test', '0.0.1', tmp_path / 'data'))；runtime 在 L21、23、34、69、88 读 [L20]
│   │       │   ├── 执行 initialize_storage_runtime(runtime) [L21]
│   │       │   ├── routes ← web.RouteTableDef()；routes 在 L23、25 读 [L22]
│   │       │   ├── 执行 register_routes(routes, runtime) [L23]
│   │       │   ├── app ← web.Application()；app 在 L25、28 读 [L24]
│   │       │   ├── 执行 app.add_routes(routes) [L25]
│   │       │   ├── 异步函数 exercise() [L27]
│   │       │   │   └── 进入上下文 TestClient(TestServer(app)) → client，退出时交由上下文释放资源 [L28]
│   │       │   │       ├── path ← BASE + '/storage'；path 在 L30、32、35、37、39 等 10 处 读 [L29]
│   │       │   │       ├── response ← await client.get(path, headers=LOCAL)；response 在 L31、40、41、79 读 [L30]
│   │       │   │       ├── 断言 (await response.json())['status'] == 'unavailable'，失败抛出 AssertionError [L31]
│   │       │   │       ├── denied ← await client.patch(path + '/settings', json={}, headers={**LOCAL, 'Comfy-User': 'someone'})；denied 在 L33 读 [L32]
│   │       │   │       ├── 断言 denied.status == 403 and (await denied.json())['error']['code'] == 'UNAUTHORIZED_STORAGE_OPERATION'，失败抛出 AssertionError [L33]
│   │       │   │       ├── runtime.trusted_local ← True [L34]
│   │       │   │       ├── forbidden ← await client.get(path, headers={**LOCAL, 'Origin': 'https://example.invalid'})；forbidden 在 L36 读 [L35]
│   │       │   │       ├── 断言 (await forbidden.json())['status'] == 'unavailable'，失败抛出 AssertionError [L36]
│   │       │   │       ├── proxied ← await client.get(path, headers={**LOCAL, 'X-Forwarded-For': '127.0.0.1'})；proxied 在 L38 读 [L37]
│   │       │   │       ├── 断言 (await proxied.json())['status'] == 'unavailable'，失败抛出 AssertionError [L38]
│   │       │   │       ├── response ← await client.get(path, headers=LOCAL)；response 在 L31、40、41、79 读 [L39]
│   │       │   │       ├── data ← await response.json()；data 在 L41、42、76、78 读 [L40]
│   │       │   │       ├── 断言 response.status == 200 and data['status'] == 'ready'，失败抛出 AssertionError [L41]
│   │       │   │       ├── 断言 data['workspaces'][0]['status'] == 'online'，失败抛出 AssertionError [L42]
│   │       │   │       ├── registered ← await client.post(path + '/locations', headers=LOCAL, json={'path': str(tmp_path / 'extra'), 'name': 'Extra'})；registered 在 L44、45 读 [L43]
│   │       │   │       ├── 断言 registered.status == 201，失败抛出 AssertionError [L44]
│   │       │   │       ├── workspace ← await registered.json()；workspace 在 L46 读 [L45]
│   │       │   │       ├── workspace_path ← path + '/locations/' + workspace['id']；workspace_path 在 L47、49、51 读 [L46]
│   │       │   │       ├── validated ← await client.post(workspace_path + '/validate', headers=LOCAL, json={})；validated 在 L48 读 [L47]
│   │       │   │       ├── 断言 (await validated.json())['status'] == 'online'，失败抛出 AssertionError [L48]
│   │       │   │       ├── disabled ← await client.patch(workspace_path, headers=LOCAL, json={'expected_revision': 0, 'enabled': False})；disabled 在 L50 读 [L49]
│   │       │   │       ├── 断言 (await disabled.json())['status'] == 'disabled'，失败抛出 AssertionError [L50]
│   │       │   │       ├── removed ← await client.delete(workspace_path, headers=LOCAL, json={'expected_revision': 1})；removed 在 L52 读 [L51]
│   │       │   │       ├── 断言 (await removed.json())['removed'] and (tmp_path / 'extra').is_dir()，失败抛出 AssertionError [L52]
│   │       │   │       ├── 循环 invalid ← ['move', None] [L53]
│   │       │   │       │   ├── invalid_mode ← await client.patch(path + '/settings', json={'expected_revision': 0, 'imports': {'default_mode': invalid}}, headers=LOCAL)；invalid_mode 在 L57、58 读 [L54]
│   │       │   │       │   ├── 断言 invalid_mode.status == 422，失败抛出 AssertionError [L57]
│   │       │   │       │   └── 断言 (await invalid_mode.json())['error']['code'] == 'INVALID_IMPORT_MODE'，失败抛出 AssertionError [L58]
│   │       │   │       ├── settings ← await client.patch(path + '/settings', json={'expected_revision': 0, 'imports': {'default_mode': 'copy'}}, headers=LOCAL)；settings 在 L62、63 读 [L59]
│   │       │   │       ├── 断言 settings.status == 200，失败抛出 AssertionError [L62]
│   │       │   │       ├── 断言 (await settings.json())['revision'] == 1，失败抛出 AssertionError [L63]
│   │       │   │       ├── conflict ← await client.patch(path + '/settings', json={'expected_revision': 0, 'imports': {'default_mode': 'reference'}}, headers=LOCAL)；conflict 在 L67 读 [L64]
│   │       │   │       ├── 断言 conflict.status == 409，失败抛出 AssertionError [L67]
│   │       │   │       ├── invalid_source ← await client.post(BASE + '/assets/import/preview', headers=LOCAL, json={'sources': [str(runtime.config.data_home / 'config/settings.json')]})；invalid_source 在 L70 读 [L68]
│   │       │   │       ├── 断言 invalid_source.status == 403，失败抛出 AssertionError [L70]
│   │       │   │       ├── preview ← await client.post(BASE + '/assets/import/preview', headers=LOCAL, json={'sources': [str(file)]})；preview 在 L72 读 [L71]
│   │       │   │       ├── 断言 (await preview.json())['size_bytes'] == 8，失败抛出 AssertionError [L72]
│   │       │   │       ├── payload ← {'sources': [str(file)], 'idempotency_key': 'http', 'import_mode_override': 'copy'}；payload 在 L74 读 [L73]
│   │       │   │       ├── accepted ← await client.post(BASE + '/assets/import', json=payload, headers=LOCAL)；accepted 在 L75、76 读 [L74]
│   │       │   │       ├── data ← await accepted.json()；data 在 L41、42、76、78 读 [L75]
│   │       │   │       ├── 断言 accepted.status == 202 and 'phase' not in data，失败抛出 AssertionError [L76]
│   │       │   │       ├── 循环 _ ← range(150) [L77]
│   │       │   │       │   ├── response ← await client.get(BASE + '/assets/imports/' + data['operation_id'], headers=LOCAL)；response 在 L31、40、41、79 读 [L78]
│   │       │   │       │   ├── job ← await response.json()；job 在 L80、83 读 [L79]
│   │       │   │       │   ├── 若 job['phase'] in ('completed', 'failed') [L80]
│   │       │   │       │   │   └── 提前退出循环 [L81]
│   │       │   │       │   └── 执行 await asyncio.sleep(0.025) [L82]
│   │       │   │       ├── 断言 job['phase'] == 'completed' and job['receipt']['copied'] == 1，失败抛出 AssertionError [L83]
│   │       │   │       ├── listing ← await client.get(BASE + '/assets', headers=LOCAL)；listing 在 L85 读 [L84]
│   │       │   │       └── 断言 (await listing.json())['assets'][0]['storage_mode'] == 'managed'，失败抛出 AssertionError [L85]
│   │       │   ├── 执行 asyncio.run(exercise()) [L87]
│   │       │   ├── 执行 runtime.storage.operations.pool.shutdown(wait=True) [L88]
│   │       │   └── 断言 file.read_bytes() == b'original'，失败抛出 AssertionError [L89]
│   │       ├── 函数 test_invalid_storage_config_preserves_status_route(extension, tmp_path, monkeypatch) [L92]
│   │       │   ├── 执行 monkeypatch.setenv('ASTROPHOTO_HOME', str(tmp_path / 'unsafe')) [L93]
│   │       │   ├── 执行 (tmp_path / 'unsafe').mkdir() [L94]
│   │       │   ├── 执行 (tmp_path / 'unsafe/keep').write_bytes(b'user') [L95]
│   │       │   ├── 异步函数 exercise() [L96]
│   │       │   │   ├── plugin ← await extension.module.comfy_entrypoint()；plugin 在 L98、99 读 [L97]
│   │       │   │   ├── 执行 await plugin.on_load() [L98]
│   │       │   │   ├── extension.registry['vue-basic'] ← (await plugin.get_node_list())[0] [L99]
│   │       │   │   ├── app ← web.Application()；app 在 L101、102 读 [L100]
│   │       │   │   ├── 执行 app.add_routes(extension.routes) [L101]
│   │       │   │   └── 进入上下文 TestClient(TestServer(app)) → client，退出时交由上下文释放资源 [L102]
│   │       │   │       ├── response ← await client.get(BASE + '/status')；response 在 L104、105 读 [L103]
│   │       │   │       ├── status ← await response.json()；status 在 L105、106、107 读 [L104]
│   │       │   │       ├── 断言 response.status == 200 and status['status'] == 'degraded'，失败抛出 AssertionError [L105]
│   │       │   │       ├── 断言 not status['capabilities']['storage']['available']，失败抛出 AssertionError [L106]
│   │       │   │       └── 断言 status['capabilities']['drawing_node']['available']，失败抛出 AssertionError [L107]
│   │       │   ├── 执行 asyncio.run(exercise()) [L108]
│   │       │   └── 断言 list((tmp_path / 'unsafe').iterdir()) == [tmp_path / 'unsafe/keep']，失败抛出 AssertionError [L109]
│   │       └── 测试覆盖（本文件的用例与断言）
│   │           ├── test_http_storage_import_and_access_boundary（14 行） → (await response.json())['status'] == 'unavailable'，denied.status == 403 and (await denied.json())['error']['code'] == 'UNAUTHORIZED_STORAGE_OPERATION'，(await forbidden.json())['status'] == 'unavailable'，(await proxied.json())['status'] == 'unavailable'
│   │           └── test_invalid_storage_config_preserves_status_route（92 行） → response.status == 200 and status['status'] == 'degraded'，not status['capabilities']['storage']['available']，status['capabilities']['drawing_node']['available']，list((tmp_path / 'unsafe').iterdir()) == [tmp_path / 'unsafe/keep']
│   ├── nodes/ — 节点注册、输入和图像输出测试。
│   │   ├── test_image_io.py — 测试绘图节点委托 LoadImage 并输出宿主图像，以及无效组件数据在宿主 I/O 前被拒绝。
│   │   │   ├── 函数 test_load_image_delegation_and_output(extension) [L4]
│   │   │   │   ├── cls ← asyncio.run(asyncio.run(extension.module.comfy_entrypoint()).get_node_list())[0]；cls 在 L6 读 [L5]
│   │   │   │   ├── result ← cls.execute(custom_vue_component_basic={'image': 'threed/drawing.png [temp]'})；result 在 L7、8 读 [L6]
│   │   │   │   ├── 断言 result.result == (extension.host.image,)，失败抛出 AssertionError [L7]
│   │   │   │   ├── 断言 result.result[0] is extension.host.image，失败抛出 AssertionError [L8]
│   │   │   │   └── 断言 extension.host.calls == [('resolve', 'threed/drawing.png [temp]'), ('load', extension.host.path)]，失败抛出 AssertionError [L9]
│   │   │   ├── 函数 test_invalid_widget_data_rejected_before_host_io(extension, value) [L16]
│   │   │   │   ├── cls ← asyncio.run(asyncio.run(extension.module.comfy_entrypoint()).get_node_list())[0]；cls 在 L19 读 [L17]
│   │   │   │   ├── 进入上下文 pytest.raises(ValueError, match='uploaded image path')，退出时交由上下文释放资源 [L18]
│   │   │   │   │   └── 执行 cls.execute(value) [L19]
│   │   │   │   └── 断言 extension.host.calls == []，失败抛出 AssertionError [L20]
│   │   │   └── 测试覆盖（本文件的用例与断言）
│   │   │       ├── test_load_image_delegation_and_output（4 行） → result.result == (extension.host.image,)，result.result[0] is extension.host.image，extension.host.calls == [('resolve', 'threed/drawing.png [temp]'), ('load', extension.host.path)]
│   │   │       └── test_invalid_widget_data_rejected_before_host_io（16 行） → pytest.raises(ValueError, match='uploaded image path')，extension.host.calls == []
│   │   └── test_registration.py — 测试 V3 节点注册、稳定节点 ID、IMAGE_PATH 连接类型及绘图组件 Schema。
│   │       ├── 函数 test_v3_registration_and_definition(extension) [L4]
│   │       │   ├── module ← extension.module；module 在 L6、7、23 读 [L5]
│   │       │   ├── 断言 not hasattr(module, 'NODE_CLASS_MAPPINGS')，失败抛出 AssertionError [L6]
│   │       │   ├── plugin ← asyncio.run(module.comfy_entrypoint())；plugin 在 L8 读 [L7]
│   │       │   ├── classes ← asyncio.run(plugin.get_node_list())；classes 在 L9、12、16、17 读 [L8]
│   │       │   ├── 断言 [node.define_schema().node_id for node in classes] == ['vue-basic', 'AstroPhotoFITSSource', 'AstroPhotoSirilAutoStretch', 'AstroPhotoImagePath']，失败抛出 AssertionError [L9]
│   │       │   ├── (source, stretch, path_node) ← (node.define_schema() for node in classes[1:])；source 在 L13 读，stretch 在 L13、14 读，path_node 在 L15 读 [L12]
│   │       │   ├── 断言 source.outputs[0].io_type == stretch.inputs[0].io_type == stretch.outputs[0].io_type == 'IMAGE_PATH'，失败抛出 AssertionError [L13]
│   │       │   ├── 断言 stretch.inputs[0].id == 'image_path'，失败抛出 AssertionError [L14]
│   │       │   ├── 断言 path_node.outputs[0].io_type == 'IMAGE_PATH'，失败抛出 AssertionError [L15]
│   │       │   ├── 断言 classes[3].execute('\\\\server\\share\\image.fits').result == ('\\\\server\\share\\image.fits',)，失败抛出 AssertionError [L16]
│   │       │   ├── schema ← classes[0].define_schema()；schema 在 L18、19、20、21、22 读 [L17]
│   │       │   ├── 断言 schema.node_id == 'vue-basic'，失败抛出 AssertionError [L18]
│   │       │   ├── 断言 schema.display_name == 'Vue Basic'，失败抛出 AssertionError [L19]
│   │       │   ├── 断言 schema.category == 'examples'，失败抛出 AssertionError [L20]
│   │       │   ├── 断言 [(i.id, i.io_type) for i in schema.inputs] == [('custom_vue_component_basic', 'CUSTOM_VUE_COMPONENT_BASIC')]，失败抛出 AssertionError [L21]
│   │       │   ├── 断言 [(o.io_type, o.display_name) for o in schema.outputs] == [('IMAGE', 'image')]，失败抛出 AssertionError [L22]
│   │       │   └── 断言 (extension.root / module.WEB_DIRECTORY / 'main.js').is_file()，失败抛出 AssertionError [L23]
│   │       └── 测试覆盖（本文件的用例与断言）
│   │           └── test_v3_registration_and_definition（4 行） → not hasattr(module, 'NODE_CLASS_MAPPINGS')，[node.define_schema().node_id for node in classes] == ['vue-basic', 'AstroPhotoFITSSource', 'AstroPhotoSirilAutoStretch', 'AstroPhotoImagePath']，source.outputs[0].io_type == stretch.inputs[0].io_type == stretch.outputs[0].io_type == 'IMAGE_PATH'，stretch.inputs[0].id == 'image_path'
│   └── packaging/ — 发布包内容、代理路径与版本一致性测试。
│       ├── test_contents.py — 测试 Registry 和 MCP 构建包内容与泄漏检查，以及前端外部 URL 保留代理前缀。
│       │   ├── 项目内导入
│       │   │   ├── ROOT ← scripts/release.py（L9），用于 subprocess.run(["uv", "build", str(ROOT / "mcp"), "--no-sources", "--out-dir", str(destination)], / source = (ROOT / "js/main.js").read_text(encoding="utf-8")
│       │   │   ├── build_registry ← scripts/release.py（L9），用于 archive = build_registry(tmp_path / "registry.zip")
│       │   │   ├── check_registry ← scripts/release.py（L9），用于 names = check_registry(archive, check_versions()) / check_registry(archive, check_versions())
│       │   │   ├── check_versions ← scripts/release.py（L9），用于 names = check_registry(archive, check_versions()) / check_registry(archive, check_versions()) / version = check_versions()
│       │   │   ├── registry_files ← scripts/release.py（L9），用于 files = registry_files()
│       │   │   ├── check_wheel ← scripts/release.py（L9），用于 names = check_wheel(wheel, version) / check_wheel(corrupted, version)
│       │   │   └── check_sdist ← scripts/release.py（L9），用于 assert any("/src/astrophoto_mcp/server.py" in name for name in check_sdist(sdist, version))
│       │   ├── 函数 mcp_artifacts(tmp_path_factory) [L13]
│       │   │   ├── destination ← tmp_path_factory.mktemp('mcp-distributions')；destination 在 L15、17 读 [L14]
│       │   │   ├── 执行 subprocess.run(['uv', 'build', str(ROOT / 'mcp'), '--no-sources', '--out-dir', str(destination)], check=True, capture_output=True, text=True) [L15]
│       │   │   └── 返回 (next(destination.glob('*.whl')), next(destination.glob('*.tar.gz'))) [L17]
│       │   ├── 函数 test_registry_archive(tmp_path, leak) [L21]
│       │   │   ├── files ← registry_files()；files 在 L23 读 [L22]
│       │   │   ├── 断言 not any((Path(name).parts[0] in {'mcp', 'reference', 'frontend', 'tests'} for name in files))，失败抛出 AssertionError [L23]
│       │   │   ├── archive ← build_registry(tmp_path / 'registry.zip')；archive 在 L25、30、33 读 [L24]
│       │   │   ├── names ← check_registry(archive, check_versions())；names 在 L26、27、28、29 读 [L25]
│       │   │   ├── 断言 'locales/zh/main.json' in names，失败抛出 AssertionError [L26]
│       │   │   ├── 断言 'astrophoto/api/status.py' in names，失败抛出 AssertionError [L27]
│       │   │   ├── 断言 'astrophoto/core/paths.py' in names，失败抛出 AssertionError [L28]
│       │   │   ├── 断言 'astrophoto/database/migrations/versions/0001_equipment_baseline.py' in names，失败抛出 AssertionError [L29]
│       │   │   ├── 进入上下文 zipfile.ZipFile(archive, 'a') → package，退出时交由上下文释放资源 [L30]
│       │   │   │   └── 执行 package.writestr(leak, '') [L31]
│       │   │   └── 进入上下文 pytest.raises(ValueError, match='Unexpected Registry')，退出时交由上下文释放资源 [L32]
│       │   │       └── 执行 check_registry(archive, check_versions()) [L33]
│       │   ├── 函数 test_mcp_artifacts_exclude_extension(mcp_artifacts, tmp_path, leak) [L37]
│       │   │   ├── (wheel, sdist) ← mcp_artifacts；wheel 在 L40、44、45 读，sdist 在 L42 读 [L38]
│       │   │   ├── version ← check_versions()；version 在 L40、42、49 读 [L39]
│       │   │   ├── names ← check_wheel(wheel, version)；names 在 L41 读 [L40]
│       │   │   ├── 断言 {'astrophoto_mcp/server.py', 'astrophoto_mcp/tools/equipment.py', 'astrophoto_mcp/api/equipment.py'} <= set(names)，失败抛出 AssertionError [L41]
│       │   │   ├── 断言 any(('/src/astrophoto_mcp/server.py' in name for name in check_sdist(sdist, version)))，失败抛出 AssertionError [L42]
│       │   │   ├── corrupted ← tmp_path / wheel.name；corrupted 在 L45、46、49 读 [L44]
│       │   │   ├── 执行 corrupted.write_bytes(wheel.read_bytes()) [L45]
│       │   │   ├── 进入上下文 zipfile.ZipFile(corrupted, 'a') → package，退出时交由上下文释放资源 [L46]
│       │   │   │   └── 执行 package.writestr(leak, '') [L47]
│       │   │   └── 进入上下文 pytest.raises(ValueError, match='Unexpected MCP wheel')，退出时交由上下文释放资源 [L48]
│       │   │       └── 执行 check_wheel(corrupted, version) [L49]
│       │   └── 函数 test_built_frontend_external_urls_preserve_proxy_prefix() [L52]
│       │       ├── source ← (ROOT / 'js/main.js').read_text(encoding='utf-8')；source 在 L54 读 [L53]
│       │       ├── imports ← re.findall('\\bimport\\s*\\{[^}]+\\}\\s*from\\s*"([^"]+)"', source)；imports 在 L55、56 读 [L54]
│       │       ├── 断言 set(imports) == {'../../scripts/app.js', '../../scripts/api.js'}，失败抛出 AssertionError [L55]
│       │       └── 循环 url ← imports [L56]
│       │           └── 断言 urljoin('http://comfy.test/proxy/extensions/ComfyUI_AstroPhoto/main.js', url).startswith('http://comfy.test/proxy/scripts/')，失败抛出 AssertionError [L57]
│       └── test_versions.py — 测试版本及标签一致性、版本同步和 SemVer 不匹配错误。
│           ├── 项目内导入
│           │   ├── ROOT ← scripts/release.py（L5），用于 shutil.copyfile(ROOT / name, tmp_path / name)
│           │   ├── check_versions ← scripts/release.py（L5），用于 assert check_versions(tag="v" + check_versions()) / check_versions(tag="v999.0.0") / assert check_versions(tmp_path, "v1.2.3") == "1.2.3" / check_versions(tmp_path)
│           │   └── sync_version ← scripts/release.py（L5），用于 assert sync_version("1.2.3", tmp_path) == "1.2.3" / sync_version("01.2.3", tmp_path)
│           ├── 函数 test_versions_and_tag() [L8]
│           │   ├── 断言 check_versions(tag='v' + check_versions())，失败抛出 AssertionError [L9]
│           │   └── 进入上下文 pytest.raises(ValueError, match='Tag')，退出时交由上下文释放资源 [L10]
│           │       └── 执行 check_versions(tag='v999.0.0') [L11]
│           └── 函数 test_sync_and_mismatch(tmp_path) [L14]
│               ├── 执行 (tmp_path / 'mcp').mkdir() [L15]
│               ├── 循环 name ← ('pyproject.toml', 'mcp/pyproject.toml', 'LICENSE', 'mcp/LICENSE') [L16]
│               │   └── 执行 shutil.copyfile(ROOT / name, tmp_path / name) [L17]
│               ├── 断言 sync_version('1.2.3', tmp_path) == '1.2.3'，失败抛出 AssertionError [L18]
│               ├── 断言 check_versions(tmp_path, 'v1.2.3') == '1.2.3'，失败抛出 AssertionError [L19]
│               ├── path ← tmp_path / 'mcp/pyproject.toml'；path 在 L21 读 [L20]
│               ├── 执行 path.write_text(path.read_text().replace('version = "1.2.3"', 'version = "1.2.4"')) [L21]
│               ├── 进入上下文 pytest.raises(ValueError, match='MCP version')，退出时交由上下文释放资源 [L22]
│               │   └── 执行 check_versions(tmp_path) [L23]
│               └── 进入上下文 pytest.raises(ValueError, match='SemVer')，退出时交由上下文释放资源 [L24]
│                   └── 执行 sync_version('01.2.3', tmp_path) [L25]
└── uv.lock — 锁定根 Extension 和 MCP workspace 及其 125 个解析包，含 Python 3.11+ 平台条件和分发哈希。
````
