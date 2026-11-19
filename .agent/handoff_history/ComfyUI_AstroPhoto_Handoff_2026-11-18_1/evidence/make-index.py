"""Rebuild the derived handoff indices from the reports and immutable audit inputs."""
import ast
from collections import Counter, defaultdict
from hashlib import sha256
import json
from pathlib import Path
import re
import subprocess
from xml.etree import ElementTree as ET

root = Path.cwd()
out = Path(__file__).resolve().parent.parent
ev = out / 'evidence'
results = ev / 'test-results'
quote = chr(96)

def load(path):
    return path.read_text(encoding='utf-8-sig')

def write(path, body):
    path.write_text(body.strip() + '\n', encoding='utf-8')

def q(value):
    return quote + str(value).replace(quote, '') + quote

def clean(value):
    return str(value).replace('|', '&#124;').replace('\r', '').replace('\n', '<br>')

def table(headers, rows):
    return '\n'.join(['| ' + ' | '.join(headers) + ' |',
                      '| ' + ' | '.join(['---'] * len(headers)) + ' |'] +
                     ['| ' + ' | '.join(map(clean, row)) + ' |' for row in rows])

def report_ref(name, line):
    return f'[{name}:{line}](evidence/subagents/{name})'

def routes():
    grouped = []
    grouped.append(('GET', '/astrophoto/v1/status', 'status_handler', 200, 'astrophoto/api/routes.py:31', 'public'))
    for kind in ('storage','assets','equipment','siril'):
        path = Path(f'astrophoto/api/{kind}.py')
        source = load(path)
        fn = next(node for node in ast.parse(source).body if isinstance(node, ast.FunctionDef) and node.name in {'storage_routes','asset_routes','equipment_routes','siril_routes'})
        for node in fn.body[-1].value.elts:
            method, suffix, handler, status = node.elts
            grouped.append((method.value, '/astrophoto/v1'+suffix.value, q(ast.get_source_segment(source, handler)), status.value, f'{path}:{node.lineno}', '设备独立策略' if kind == 'equipment' else '直连 loopback + header'))
    write(ev/'routes.md', '# 实际路由表\n\n返回码列来自 route 注册元组。认证、数据校验和状态冲突依 handler 返回其他结果。HEAD 隐式行为未枚举。\n\n' +
          table(['方法','路径','handler','注册状态','源码','授权'], grouped))
    return len(grouped)

def files():
    hashes = json.loads(load(ev / 'source-hashes.json'))
    groups = (
        (r'(?:(?:astrophoto|nodes)/.*\.py|__init__\.py)$', 'Extension Python', '后端 / 资产设备 / Node专项，关键业务调用链'),
        (r'mcp/src/.*\.(?:py|json|md)$', 'MCP 源码', 'MCP专项，包入口与实现'),
        (r'frontend/(?:entry\.ts|(?:ui/)?src/.*\.(?:ts|tsx|vue|css|json))$', '前端源码', '前端专项；纯样式、翻译及 vendor 取关键路径'),
        (r'(?:tests/|mcp/tests/|frontend/tests/|frontend/ui/src/__tests__/).*', '测试和 fixture', '测试账本和专项，配置/fixture不计测试函数'),
        (r'^(?:scripts/|\.github/|frontend/[^/]+$|frontend/ui/[^/]+\.mjs$|js/|locales/|docs/)', '工程、产物与文档', '版本/交接/本地构建与专项；bundle 按哈希及加载核对'),
        (r'^(?:uv\.lock|pyproject\.toml|mcp/pyproject\.toml|requirements\.txt|\.python-version|\.comfyignore|AGENTS\.md|README\.md)$','工程配置','配置关键项，锁文件非逐依赖审查'),
    )
    groups = groups[3:4] + groups[:3] + groups[4:]
    rows, counts = [], Counter()
    for name, digest in hashes.items():
        match = next((g for g in groups if re.match(g[0],name)),None)
        if match is None:
            continue
        counts[match[1]] += 1
        rows.append((q(name), match[1], digest[:12] if digest else '缺失', match[2]))
    write(ev/'source-inventory.md', '# 活跃源码、测试和工程文件账本\n\n' +
          '与工作树快照对应的路径范围。范围归类表示发现/归档，不保证每个 helper 每一行都已人工语义审计。' +
          '历史参考、工作区依赖、二进制和截图在完整文件或输入账本独立追踪。\n\n' +
          '\n'.join(f'- {name} {count} 个' for name,count in counts.items()) + '\n\n' +
          table(['仓库相对路径','领域','基线哈希前缀','核对范围'], rows))
    return counts

reports = {'B':'backend.md','A':'assets-equipment.md','N':'nodes-siril.md',
           'F':'frontend.md','M':'mcp-packaging.md'}
features, guards = {}, {}
for domain, report in reports.items():
    for lineno,line in enumerate(load(ev/'subagents'/report).splitlines(),1):
        if line.startswith('| '):
            cells = [p.strip() for p in line.strip('|').split(' |')]
            if not re.fullmatch(r'(?:G)?'+domain+r'-\d{2}', cells[0]):
                continue
            id, *detail = cells
        else:
            match = re.match(r'- ((?:G)?'+domain+r'-\d{2})\s+(.*)',line)
            if not match:
                continue
            id, description = match.groups()
            detail = [description]
        records = guards if id.startswith('G') else features
        records.setdefault(id, (lineno, ' · '.join(detail)))

features['M-09'] = (46,'equipment_get：canonical ID → GET /equipment/{id} → DTO；成功调用的独立用例未定位（mcp/src/astrophoto_mcp/tools/equipment.py:21–24）。')
features['M-10'] = (47,'optical_train_list：分页与归档筛选 → GET /optical-trains → 列表；真调用未验证（mcp/src/astrophoto_mcp/tools/equipment.py:26–31）。')
features['M-11'] = (48,'optical_train_get：按 ID 读取 train DTO；不写库（mcp/src/astrophoto_mcp/tools/equipment.py:33–36）。')
features['M-12'] = (49,'optical_train_revision_list：按 train ID → 兼容历史 GET；不写库（mcp/src/astrophoto_mcp/tools/equipment.py:38–41）。')
features['M-13'] = (50,'optical_train_revision_get：两个 ID → 只读快照 DTO（mcp/src/astrophoto_mcp/tools/equipment.py:43–47）。')
features['M-14'] = (45,'equipment_list：设备类型与搜索、归档筛选 → 设备分页 DTO；MockTransport 实际调用（mcp/src/astrophoto_mcp/tools/equipment.py:9–19）。')
features['F-20'] = (81,'保留宿主其他节点与目录的收藏条目，活动页 500ms 同步，忽略 folder 标识作为设备节点、现场失败回读。NodesPage.tsx:16–81 与 NodeTree.tsx:80。')
features['F-21'] = (81,'科学输出面板主图折叠、手工刷新、固定画布几何；NodePreview.tsx / host/scientific.tsx:176–178。')
for id, detail in {
    'P-01':'完整 Capture Session 主实体、浏览和校准关联。当前是关系键和占位，astrophoto/database/models.py:36、frontend/ui/src/features/assets/AssetsPage.tsx。',
    'P-02':'Observing Site / light-pollution domain。当前 Settings 注册表无该入口；没有业务服务/表。',
    'P-03':'Knowledge/RAG、Memory、Experiments 与试验历史。astrophoto/core/capabilities.py 为 false。',
    'P-04':'非本期的校准链、硬件驱动和 PixInsight 生产处理。Software 页仅计划项。',
    'P-05':'可认证的远程 Canvas/工作流创作、Siril MCP Tool 和资产写 Tool。现仅设备只读条件工具。',
    'P-06':'首期端口 ASTRO_FRAME 与新增光路发布/默认选择已明确替代。内部 AstroFrame 元数据与旧只读快照仍保留。',
}.items():
    features[id] = (0,detail)

by_feature = {}
def map_guards(domain, entries):
    for i, numbers in entries.items():
        by_feature[f'{domain}-{i:02}'] = ' / '.join(f'G{domain}-{n:02}' for n in numbers)

map_guards('B',{
    1:[3,11],2:[4],3:[4,6,11],4:[6,11],5:[12],6:[1,12],7:[3,6],
    8:[4,6],9:[5,6,7],10:[4,7],11:[4,6,10],12:[5,10],13:[6,8],
    14:[4,5,8,9],15:[6,8,9],16:[6,9],17:[1,3,5],18:[1,2,12],
    **{n:[1,3,6] for n in range(19,32)},32:[9],33:[6,9],34:[5,10],
    35:[10],36:[4,10],37:[6,9]})
map_guards('A',{
    1:[1,2,3],2:[],3:[1,2],4:[1,4],5:[1,3,5,6],6:[5,6],7:[5,6],8:[7,8],9:[7],10:[8],
    11:[9,10],12:[9,10],13:[9,11],14:[11,12],
    15:[13],16:[1,2,3],17:[1,3,5,6],18:[6,13],19:[6],20:[5,6],
    21:[7],22:[8],23:[7],24:[9,13],25:[9,13],26:[9],27:[9,10],28:[10],
    29:[10],30:[10],31:[9,11],32:[9,11],33:[11,12],34:[12],35:[11,13],
    36:[9,11],37:[12,13],38:[12,13],39:[12],40:[12],41:[12],42:[12],43:[11],44:[11]})
map_guards('N',{
    1:[1],2:[],3:[1,2,9],4:[1,4,5,6],5:[2,3],6:[5,12],7:[4,5,10,13],
    8:[6,10,13],9:[7,14],10:[8,11],11:[8,11],12:[2,9],13:[2,3],
    14:[3],15:[4],16:[3],17:[5,12],18:[5,13],19:[12],20:[5,12],
    21:[6,9],22:[6,10,13],23:[6,10],24:[7,13],25:[7,14],26:[7,11,14],27:[8,15]})
map_guards('F',{
    1:[1],2:[1,15],3:[2],4:[3],5:[4],6:[5],7:[2,15],8:[6],9:[7,8],10:[7,8],
    11:[9],12:[6],13:[10],14:[10,11],15:[12],16:[13],17:[14],18:[15],19:[16],20:[4],21:[10,11]})
map_guards('M',{
    1:[1,6],2:[5,6],3:[2,3,4],4:[6],5:[7],6:[9],7:[7,8],8:[],
    **{n:[2,3,4] for n in range(9,15)}})
extra_guard = {
    'A-15':'GB-03 / GA-13','B-01':'GB-11 / 注册去重见 astrophoto/api/routes.py:15',
    'A-34':'GB-06 / GA-12','M-05':'GM-07 / GM-08','F-05':'GF-04',
}
verified = {
    'B-01':'V3 stub、现存 8207 注册 GET；不含重复进程冲突','B-02':'Core 非法配置之 fixture',
    'B-03':'首次/重入/进程样本','B-04':'WAL、FK、busy rollback、备份与旧基线 fixture',
    'B-05':'8207 GET 及独立健康状态测试','B-06':'aiohttp 未授权与状态 DTO',
    'B-08':'临时 Workspace 创建','B-09':'离线/默认/禁用 fixture','B-10':'离线 relo fixture，移除独立边界仍有限',
    'B-12':'owned Cache 清理与 live lease fixture','B-13':'同盘迁移启动','B-14':'同盘迁移/HASH 及失败注入',
    'B-15':'同盘切换前后恢复','B-17':'aiohttp 业务请求，非完整错误矩阵',
    'B-18':'aiohttp trusted local 与拒绝样本',
    'A-01':'导入预检数量与容量 fixture','A-03':'拒绝未授权路径样本',
    'A-04':'外部位置、不复制与 mode 快照','A-05':'真实 copy 字节、重试和幂等','A-06':'staging 中断与恢复样本',
    'A-28':'独立临时 DB 删除以及调用者状态检查','A-34':'SQLite 回滚和 aiohttp 删除',
    'A-36':'旧草稿冲突与单配置','A-39':'HTTP 410 回归','A-42':'HTTP 410 回归',
    'N-01':'绘图 V3 注册与 mock LoadImage，真执行未重跑','N-02':'stub 路径透传与真实 schema','N-03':'文件变动 fingerprint、真实 schema','N-04':'真实 schema 与正式服务 CLI，宿主未队列执行',
    'N-05':'有限 FITS RGB/截断样本','N-06':'Windows 1.4.5 probe 与旧配置保留样本','N-07':'正式处理真实 CLI',
    'N-08':'真实 CLI 输出、取消样本和重启清理 fixture','N-12':'外部真实临时 FITS','N-13':'真实 FITS 尺寸/精度/损坏样本',
    'N-15':'参数负面与真 CLI 固定脚本','N-18':'通用真实子进程与真实 CLI 样本','N-22':'真实 CLI 返回+登记与字节原件','N-23':'隔离恢复',
    'F-01':'Chromium 真宿主单 root；重复卸载由 JSDOM 探针','F-02':'真宿主中三栏可见 + 隔离 Jest',
    'F-15':'通用组件 CSS 探针，非真实 NodeView','F-17':'Chromium 真实 Canvas 和模拟上传','F-18':'中英资源断言与中文版真宿主，未改真实主题',
    'M-01':'真实 stdio 子进程','M-02':'真实 stdio version／MockTransport connection','M-05':'两套根测试临时 Wheel/sdist/Registry',
    'M-06':'隔离 Vite 字节一致、Chromium proxy stub','M-14':'FastMCP 内存 + MockTransport',
}
overrides = {'A-02':'IMPLEMENTED_UNVERIFIED：通用导入没有内容校验要求','A-12':'PARTIAL：历史-only 引用解释',
             'A-36':'VERIFIED：旧版本冲突；归档设备关联保护缺失',
             'N-12':'VERIFIED：允许根外绝对路径是现行语义，见 D04',
             'N-24':'PARTIAL：取消实现存在，成功/压力/清理验证不足',
             'F-06':'PARTIAL：资产引入及查看，完整 Session 无 UI',
             'F-07':'PARTIAL：占位与实装区分',
             'F-10':'IMPLEMENTED_UNVERIFIED：单配置为目标，隔离 UI 探针覆盖部分流',
             'F-11':'IMPLEMENTED_UNVERIFIED：旧测试与当前 DTO/入口不一致，见 06',
             'F-14':'PARTIAL：源码存在，真实候选竞态未测',
             'F-16':'IMPLEMENTED_UNVERIFIED：实际 Inspector 调参同步与重置待回归',
             'M-04':'PARTIAL：provider 支持，当前无产品 Skill',
             'M-07':'IMPLEMENTED_UNVERIFIED：本地检查与 CI 运行分开',
             'M-08':'PLANNED：新增业务 tools' }
for p in range(1,6):
    overrides[f'P-{p:02}'] = 'PLANNED'
overrides['P-06']='OBSOLETE'
test_domain = {'B':'SQLite、文件、aiohttp，见 06 与 backend','A':'真实临时 SQLite/文件，见 06 与 assets-equipment',
               'N':'节点 stub、SQLite/FITS、指定项真 CLI，见 06 与 nodes-siril','F':'Jest CSS 探针／Chromium／真 GET，见 06 与 frontend',
               'M':'MockTransport/真 stdio/构件，见 06 与 mcp-packaging','P':'NOT_RUN'}
feature_rows=[]
for id, (line, desc) in features.items():
    dom=id[0]
    for status in ('IMPLEMENTED_UNVERIFIED','VERIFIED','PARTIAL','PLANNED','CONFLICT','OBSOLETE','UNKNOWN'):
        desc=desc.replace(status + '：','').replace(status + ':','')
    state=overrides.get(id,('VERIFIED：'+verified[id]) if id in verified else 'IMPLEMENTED_UNVERIFIED')
    protection=extra_guard.get(id,by_feature.get(id,'UNKNOWN')) or 'NO_GUARD_FOUND（入口无独立校验）'
    if dom=='P' or id=='M-08':
        protection='不适用'
    feature_rows.append((id, desc, state, protection, test_domain[dom], report_ref(reports[dom],line) if line else '[决策](02_REQUIREMENTS_AND_DECISIONS.md)'))
path=out/'04_COMPLETE_FEATURE_INVENTORY.md'
intro=load(path).split('\n## 分域索引\n',1)[0]
write(path,intro+'\n## 分域索引\n\n'+table(['ID','行为 / 入点 / I/O 与数据','状态与验证边界','Guard 关联','用例分域和结果','专题源码及断言'], feature_rows))


cases = {
'GB-01': 'tests/integration/test_storage_api.py::test_http_storage_import_and_access_boundary — PASS：回环、header、Origin 与 capability 响应样本。',
'GB-02': 'tests/integration/test_equipment_api.py::test_equipment_and_train_api_permissions_receipts_and_errors — PASS：浏览器/只读 Token、错误 Origin/权限；无真实宿主 Token。',
'GB-03': 'tests/integration/test_equipment_api.py::test_equipment_and_train_api_permissions_receipts_and_errors — PASS：坏 DTO/UUID 样本。JSON chunk 超限未定位。',
'GB-04': 'tests/backend/test_storage.py::test_reject_links_unc_and_relative_paths — PASS：拒绝路径且真实目录保持空。',
'GB-05': 'tests/backend/test_storage.py::test_copy_preflight_blocks_offline_read_only_full_and_unauthorized — PASS：模拟空间/状态；未真实耗尽卷。',
'GB-06': 'tests/backend/test_storage.py::test_multi_process_bootstrap、test_foreign_keys_busy_rollback_and_backup、test_copy_override_idempotency_and_real_bytes — PASS；并发覆盖有限。',
'GB-07': 'tests/backend/test_storage.py::test_multiple_workspaces_default_disable_and_offline_relocation — PASS；全量删除拒绝与真实宿主无测试。',
'GB-08': 'tests/backend/test_storage.py::test_migration_verification_error_keeps_source — PASS；test_migration_actual_cross_volume SKIPPED。',
'GB-09': 'tests/backend/test_storage.py::test_migration_recovers_around_database_switch、test_process_exit_during_copy_resumes_own_staging — PASS；实际持久层隔离样本。',
'GB-10': 'tests/backend/test_storage.py::test_cache_owner_entries_only_with_live_lease — PASS：live 锁、不认识的文件；descriptor crash 组合无测试。',
'GB-11': 'tests/backend/test_storage.py::test_never_replaces_an_existing_asset_database、test_explicit_wal_failure_has_no_fake_ready、test_legacy_dev_schema_is_preserved — PASS。',
'GB-12': 'tests/integration/test_host_runtime.py::test_running_comfyui_status_and_node — PASS 只证实 status，未断言敏感路径披露约束。',
'GA-01': 'tests/backend/test_storage.py::test_copy_preflight_blocks_offline_read_only_full_and_unauthorized — PASS；业务源路径拒绝。',
'GA-02': '未定位 100/10000/40000 边界的专项断言。test_http_storage_import_and_access_boundary 只覆盖基本预检。',
'GA-03': 'tests/backend/test_storage.py::test_copy_preflight_blocks_offline_read_only_full_and_unauthorized — PASS。',
'GA-04': 'tests/backend/test_storage.py::test_reference_shared_sessions_leave_the_file_and_other_reference — PASS；同路径异内容但相同 size/mtime 不受此机制保护。',
'GA-05': 'tests/backend/test_storage.py::test_copy_detects_inflight_source_change、test_copy_recovers_after_publish_before_db_commit — PASS。',
'GA-06': 'tests/backend/test_storage.py::test_cancel_partial_staging、test_process_exit_during_copy_resumes_own_staging — PASS；取消状态和孤儿 staging 有限。',
'GA-07': 'tests/backend/test_storage.py::test_reference_multiple_roots_mode_snapshot_and_relocation — PASS；同尺寸新文件的内容验证无此 Guard。',
'GA-08': 'tests/backend/test_storage.py::test_reference_shared_sessions_leave_the_file_and_other_reference — PASS；Session 输入全矩阵未确认。',
'GA-09': 'tests/backend/test_equipment.py::test_invalid_fields_never_persist、test_database_constraints_and_incompatible_same_version — PASS。',
'GA-10': 'tests/backend/test_equipment.py::test_equipment_lifecycle_and_optional_specs、test_single_configuration_concurrent_save_and_live_specs — PASS；UI 冲突合并未覆盖。',
'GA-11': 'tests/backend/test_equipment.py::test_incomplete_configuration_and_reference_validation — PASS；归档组件新关联不受后端 guard。',
'GA-12': 'tests/backend/test_equipment.py::test_legacy_train_delete_rolls_back_history_and_trigger、test_existing_default_loads_without_rewriting_legacy_history — PASS。',
'GA-13': 'tests/integration/test_equipment_api.py::test_equipment_and_train_api_permissions_receipts_and_errors — PASS；复合拒绝条件不能单归某个标头。',
'GN-01': 'tests/nodes/test_image_io.py::test_invalid_widget_data_rejected_before_host_io — PASS；ImagePath 边界本身透传。',
'GN-02': 'tests/backend/test_siril.py::test_direct_fits_path_outside_import_roots — PASS。',
'GN-03': 'tests/backend/test_siril.py::test_frames_validate_precision_metadata_and_truncation — PASS；非有限值、超大图及多 HDU 全矩阵无测试。',
'GN-04': 'tests/backend/test_siril.py::test_parameters_reject_untrusted_script_values、test_mono_normalizes_linked — PASS。',
'GN-05': 'tests/backend/test_siril.py::test_real_cli_immutable_source_and_formal_output、test_runner_timeout_and_mid_process_cancellation — PASS；后者使用真实 Python 子进程。',
'GN-06': 'tests/backend/test_siril.py::test_restart_reconciles_only_owned_unregistered_run、test_real_cli_direct_path_and_repeated_runs — PASS。',
'GN-07': 'tests/integration/test_siril_api.py::test_scientific_api_access_source_and_cache — PASS；缺成功候选复用与竞态。',
'GN-08': 'tests/integration/test_siril_api.py::test_scientific_api_access_source_and_cache — PASS：相关 API 权限；未确认 canvas 字段接受不生效。',
'GN-09': 'tests/backend/test_storage.py::test_reject_links_unc_and_relative_paths + test_direct_fits_path_outside_import_roots — PASS；Windows 设备和共享路径集合不全。',
'GN-10': 'tests/backend/test_siril.py::test_restart_reconciles_only_owned_unregistered_run — PASS：未注册输出和用户文件；同名并发未见专项。',
'GN-11': 'tests/integration/test_siril_api.py::test_scientific_api_access_source_and_cache — PASS；body 阈值/异常 JSON 未穷举。',
'GN-12': 'tests/backend/test_siril.py::test_config_rejects_incompatible_version_and_keeps_previous、test_invalid_and_gui_paths_rejected — PASS。',
'GN-13': 'tests/backend/test_siril.py::test_runner_timeout_and_mid_process_cancellation、test_real_cli_immutable_source_and_formal_output — PASS；正式阶段的全部取消窗口未覆盖。',
'GN-14': 'NOT_RUN：曾有真实宿主历史证据，本轮未运行前端 formal 预览脚本。',
'GN-15': 'NOT_RUN：未定位对旧 PUT canvas 字段而固定响应的专项断言。',
'GF-01': 'lifecycle.test.tsx:5 — PASS：测试环境与探针；真实 8207 只测一个 root。',
'GF-02': 'api.test.ts:10,16,26 — PASS；navigation.test.tsx:57 探针 PASS，默认加载失败。',
'GF-03': 'canvas.test.ts:15,21,27,31 — PASS：宿主替身 mutation 与清理；真宿主写入 NOT_RUN。',
'GF-04': '真实收藏同步及并行写 NOT_RUN；未定位专项用例。',
'GF-05': 'navigation.test.tsx:140 探针 PASS，验证未可用时筛选操作，未验证真实服务帧分类。导入写链 NOT_RUN。',
'GF-06': 'storage.test.tsx:24,55,96 探针 PASS；默认加载失败；Environment revision 专测未定位。',
'GF-07': 'equipment.test.tsx:72,126 探针 PASS；默认加载失败；MCP 和真实 host 不推定。',
'GF-08': 'equipment.test.tsx:40,180,195 探针 PASS；真正 Vue picker 与最多 50 项边界需专测。',
'GF-09': 'siril.test.tsx:8 FAIL（临时 CSS 映射）；严格 enabled DTO 拒绝旧 fixture。真实配置写入 NOT_RUN。',
'GF-10': 'NOT_RUN：未定位真实 NodeView 竞态、失配、旧图、写 graph 循环的精确断言。',
'GF-11': 'NOT_RUN：可见性未限定输入变化的竞态行为；无此 guard。',
'GF-12': 'siril.test.tsx:28 通用 Inspector 探针 PASS；实际 NodeView 另计。',
'GF-13': 'NOT_RUN：siril.test.tsx:28 未传 parameters，未覆盖实际 NodeView 的调参、重置及同步。',
'GF-14': 'frontend/tests/widgets/serialization.test.ts 恢复/上传多用例 PASS；当前宿主 IMAGE 队列 NOT_RUN。',
'GF-15': 'i18n.test.tsx:10,12 探针 PASS，Vue 键等价与中文真宿主 PASS；当前切换主题/宽度未跑。',
'GF-16': 'search.test.tsx:3 PASS：IME 与去抖；React Vue bridge 用替身；空宿主与真实 dropdown NOT_RUN。',
'GM-01': 'mcp/tests/test_config.py::test_invalid_urls、test_url_precedence — PASS。',
'GM-02': 'mcp/tests/test_equipment.py::test_missing_credential_or_nondirect_host_keeps_diagnostics、test_invalid_or_denied_backend_is_mcp_error — PASS；实际 HTTP 使用替身。',
'GM-03': 'mcp/tests/test_equipment.py::test_read_tools_schema_permissions_and_adapter — PASS：部分 schema；全输入边界未独立测试。',
'GM-04': 'mcp/tests/test_equipment.py::test_invalid_or_denied_backend_is_mcp_error — PASS：错误/秘密不出回执；非网络代理实测。',
'GM-05': 'mcp/tests/test_client.py::test_invalid_json_response、test_invalid_system_shape、test_transport_errors_and_timeout_configuration — PASS。',
'GM-06': 'mcp/tests/test_server.py::test_duplicate_registration_fails、test_invalid_packaged_skill_fails_startup、test_stdio_stdout_contains_only_protocol_json — PASS。',
'GM-07': 'tests/packaging/test_contents.py::test_registry_archive、test_mcp_artifacts_exclude_extension；test_versions.py::test_versions_and_tag — PASS。',
'GM-08': 'NOT_RUN：独立联网安装或生产发行。',
'GM-09': 'tests/packaging/test_contents.py::test_built_frontend_external_urls_preserve_proxy_prefix 与 check-proxy — PASS；本地测试前缀。',
}

guard_rows = []
for id, (line, desc) in guards.items():
    dom=id[1]
    related=[f for f,g in by_feature.items() if id in g]
    status = {
        'GB-03':'部分负向；body 64 KiB/chunk 全矩阵未确认','GB-12':'NO_GUARD_FOUND；直接 status payload 已静态复查',
        'GF-03':'部分 PASS：canvas.test.ts；真实写模式 NOT_RUN',
        'GF-04':'NOT_RUN：宿主收藏写入/竞态',
        'GF-05':'部分探针；取消或竞态无专项结论',
        'GF-09':'FAIL：CSS 探针 test manual verification，fixture/入口与当前契约不一致',
        'GF-10':'NOT_RUN：真实竞态及卸载',
        'GF-11':'NO_GUARD_FOUND；可见性只限制 validate',
        'GF-12':'PASS：通用 Inspector JSDOM；实际编辑链见 GF-13',
        'GF-13':'专项验证待补：宿主编辑限制和单色 linked 门控',
        'GF-14':'PASS：Chromium；真实 queue NOT_RUN',
        'GF-16':'部分 PASS：搜索 JSDOM，Vue bridge 为 Mock / 真宿主下拉 NOT_RUN',
        'GN-02':'PASS：测试用例覆盖几个直接路径与损坏样本，用户路径授权为部署级',
        'GN-05':'PASS：真实 1.4.5、版本 Mock、真实通用子进程；无默认处理 timeout',
        'GN-06':'PASS：真实 CLI 输出与隔离文件/SQLite 恢复样本',
        'GN-08':'部分 PASS：aiohttp 鉴权；配置兼容值不生效为静态观察',
        'GN-14':'NOT_RUN：真实 formal receipt 之后的浏览器预览',
        'GN-15':'NOT_RUN：旧 canvas 配置接受但忽略的专项断言',
        'GM-08':'NOT_RUN：联网公开安装/远程工作流',
    }.get(id, '部分见证或未测：按子报告精确测试及当前结果核对')
    guard_rows.append((id, ', '.join(related) or '公共边界', desc, cases[id] + ' ' + status, report_ref(reports[dom],line)))
path=out/'05_DEFENSIVE_PROGRAMMING_AUDIT.md'
intro=load(path).split('\n## Guard 编号索引\n',1)[0]
write(path,intro+'\n## Guard 编号索引\n\n'+table(['Guard','Feature','触发 → 处理 → 回执/风险','本轮实际范围','精确证据'],guard_rows))

def classification(file, name):
    if file.startswith('mcp/tests'):
        if 'equipment' in file:
            return ('M-03 / M-09..14','GM-02..04','MockTransport 或实际 stdio 枚举')
        return ('M-01..04','GM-01 / GM-05 / GM-06','HTTPX Mock/内存或真实子进程，按测试断言')
    if '/packaging/' in file:
        return ('M-05..07','GM-07 / GM-09','临时构件或静态校验')
    if 'host_runtime' in file:
        return ('B-01 / B-05 / N-01','GB-12（公共状态，无凭证）','真实 GET，另行 opt-in')
    if file.startswith('tests/nodes/'):
        return ('N-01..04','GN-01','V3 Host stub')
    if file.endswith(('test_core.py','test_status.py','test_status_api.py')):
        return ('B-01..05 / B-17','GB-04 / GB-11 / GB-12','Core/host stub，status API 用 aiohttp')
    if 'siril' in file and file.endswith('.py'):
        if name.startswith('test_real_cli'):
            return ('N-06..08 / N-21..23','GN-05 / GN-06 / GN-09 / GN-13','真实 Siril 1.4.5 + FITS/SQLite')
        if '/integration/' in file:
            return ('N-09..10 / N-24..27','GN-07 / GN-08 / GN-11','aiohttp TestServer、真实 FITS/SQLite、无 Siril 配置')
        return ('N-03..08 / N-12..23','GN-02..06 / GN-09..13','Astropy/SQLite fixture、部分 mock 和真实通用子进程')
    if 'equipment' in file and file.endswith('.py'):
        if 'train' in name or 'history' in name or 'revision' in name:
            return ('A-31..44','GA-09 / GA-11 / GA-12','真实 SQLite；integration = aiohttp TestServer')
        return ('A-24..30 / A-31..44','GA-09..13','真实 SQLite；integration = aiohttp TestServer')
    if 'storage' in file and file.endswith('.py'):
        if any(key in name for key in ('copy','reference','staging','import')):
            return ('A-01..23 / B-16','GA-01..08 / GB-09','临时 SQLite + 文件；按用例 fault injection')
        if 'migration' in name:
            return ('B-13..16','GB-08 / GB-09','临时 SQLite + 文件；跨盘 opt-in')
        if 'cache' in name:
            return ('B-11..12','GB-10','临时 Cache marker / lease')
        return ('B-01..37','GB-01..11','临时 SQLite / 文件 / TestServer；见精确断言')
    if file.startswith('frontend/tests'):
        return ('F-17 / F-18','GF-14 / GF-15','真实 Chromium Canvas + Host stub')
    if 'equipment' in file:
        return ('F-09 / F-10','GF-07 / GF-08','JSDOM / Vue picker Mock')
    if 'siril' in file:
        if 'Inspector' in name:
            return ('F-15（非 F-16）','GF-12','JSDOM 通用组件')
        return ('F-11','GF-09','JSDOM API Mock')
    if 'storage' in file:
        return ('F-06 / F-08','GF-05 / GF-06','JSDOM API Mock')
    if 'i18n' in file:
        return ('F-18','GF-15','JSDOM 字符串/静态资源')
    if 'canvas' in file:
        return ('F-04','GF-03','JSDOM Canvas stub')
    if 'lifecycle' in file:
        return ('F-01','GF-01','JSDOM 宿主替身')
    if 'Accordion' in file:
        return ('F-09 / F-10','GF-07 / GF-08','JSDOM Disclosure')
    if 'search' in file:
        return ('F-03 / F-19','GF-02 / GF-16','JSDOM timer & IME')
    if 'navigation' in file:
        return ('F-02 / F-03 / F-06 / F-07','GF-02 / GF-05','JSDOM mock')
    if 'api.test' in file:
        return ('F-03 / F-07','GF-02','JSDOM HTTP mock')
    return ('独立工具检查','未定位','按源码核对')

def test_results():
    rows = []
    result_groups = Counter()
    for stem in ('python-extension','python311-extension','mcp','python311-mcp','host-get','vue'):
        xml = results/f'{stem}.xml'
        if not xml.exists():
            continue
        for node in ET.parse(xml).iter('testcase'):
            class_name=node.get('classname','')
            name=node.get('name','')
            file=node.get('file') or class_name.replace('.','/')+'.py'
            if stem=='vue':
                file=next((p.relative_to(root).as_posix() for p in (root/'frontend/tests').rglob('*.test.ts') if p.name.split('.')[0] in class_name), 'frontend/tests/*')
            elif stem in {'mcp','python311-mcp'} and not file.startswith('mcp/'):
                file='mcp/'+file
            elif not Path(file).is_file():
                lookup = list(Path('mcp/tests' if 'mcp' in stem else 'tests').rglob(file.rsplit('/',1)[-1]))
                if len(lookup)==1:
                    file=lookup[0].as_posix()
            status = next((k.upper() for k in ('failure','error','skipped') if node.find(k) is not None),'PASS')
            if 'xfail' in str(node.findtext('skipped','')).lower():
                status='XFAIL'
            result_groups[(stem,status)]+=1
            feat, guard, typ=classification(file,name)
            rows.append((stem,q(file),q(name),status,node.get('time',''),feat,guard,typ))
    react_suites=[]
    for stem in ('react','react-css-mapped'):
        data=json.loads(load(results/f'{stem}.json'))
        for suite in data['testResults']:
            absolute=Path(suite['name'])
            file=absolute.relative_to(root).as_posix()
            if not suite['assertionResults']:
                react_suites.append((stem,q(file),'SUITE_LOAD_ERROR','未收集测试断言'))
            for assertion in suite['assertionResults']:
                name=assertion['fullName']
                status=assertion['status'].upper()
                result_groups[(stem,status)]+=1
                feat, guard, typ=classification(file,name)
                rows.append((stem,q(file),q(name),status,assertion.get('duration',''),feat,guard,typ))
    return rows, result_groups, react_suites

def defs():
    rows=[]
    source_files=list(Path('tests').rglob('test_*.py'))+list(Path('mcp/tests').rglob('test_*.py'))
    for path in sorted(source_files):
        source=load(path)
        for fun in ast.walk(ast.parse(source)):
            if not isinstance(fun,(ast.FunctionDef,ast.AsyncFunctionDef)) or not fun.name.startswith('test_'):
                continue
            evid=[]
            for statement in sorted(ast.walk(fun),key=lambda node:getattr(node,'lineno',0)):
                found=isinstance(statement,ast.Assert)
                if isinstance(statement,ast.Call):
                    called=ast.unparse(statement.func)
                    found=called.startswith('pytest.raises') or '.assert_' in called or called.startswith('case.assert')
                if found:
                    evid.append(f'{statement.lineno} '+ast.unparse(statement))
            feat,guard,typ=classification(path.as_posix(),fun.name)
            rows.append((q(path.as_posix()+':'+str(fun.lineno)),q(fun.name),feat,guard,typ,'<br>'.join(q(e) for e in evid) or '断言委托 helper / 案例通过表示未抛异常，查测试源码'))
    for folder in (Path('frontend/tests'),Path('frontend/ui/src/__tests__')):
        for path in sorted(p for p in folder.rglob('*.test.ts*') if p.is_file()):
            source=load(path).splitlines()
            anchors=[i for i,line in enumerate(source) if re.match(r'\s*(?:it|test)(?:\.\w+)?\s*\(',line)]
            for i,end in zip(anchors,[*anchors[1:],len(source)]):
                body=source[i:end]
                name=next((m.group(1) for line in body[:15] if (m:=re.search(r"(?:\btest\b|\bIt\b|\bit\b)(?:\.\w+)?\s*\(\s*['\x22]([^'\x22]+)",line))),body[0].strip())
                assertions=[q(f'{j+1} {line.strip()}') for j,line in enumerate(source[i:end],i) if re.search(r'\bexpect(?:[.(])',line)]
                feat,guard,typ=classification(path.as_posix(),name)
                rows.append((q(path.as_posix()+':'+str(i+1)), q(name), feat, guard, typ, '<br>'.join(assertions) or '参数化/多行 helper，查测试源码'))
    return rows

executed, counts, suites = test_results()
definitions = defs()
write(ev/'test-inventory.md', '# 逐测试源码与执行索引\n\n'
      '源码索引抽取 Python assert／pytest.raises 和 TypeScript expect 调用点。参数化展开以 XML/JSON 为准，辅助函数与动态断言看代码。'
      'Feature/Guard 为可检索的候选范围，精确语义、异常与未覆盖见分域子报告。PASS 只归该具体测试定义、环境与输入。\n\n'
      '## 执行结果\n\n'+table(['运行','源码路径','参数化用例','结果','时间','Feature','Guard 候选','类型'],executed)+'\n\n'
      '## 默认项目配置加载失败的套件\n\n'+table(['运行','路径','状态','实际范围'],suites)+'\n\n'
      '## 源码测试定义及断言\n\n'+table(['源码:行','定义','Feature','Guard 候选','类型','断言摘录（带行）'],definitions)+'\n\n'
      '## 不属于上述框架的检查\n\n'
      '- frontend/ui/host-runtime.mjs、storage-host.mjs、equipment-host.mjs、siril-host.mjs 有真实宿主交互断言，本轮未运行；见前端/各专题。'
      '这些脚本会更改宿主测试设置或业务数据，部分断言仍处于旧场景。\n'
      '- check-build.mjs、check-proxy.mjs、tsc、lint、release version 检查与仅 GET 的 8207 浏览器 smoke 结果见 test-runs.md。')

def runs():
    rows=[]
    for path in sorted(results.glob('*.log')):
        lines=load(path).splitlines()
        complete=re.match(r'END (\S+) EXIT (\S+) SECONDS (.*)', lines[-1]) if lines else None
        command = [line for line in lines[1:] if (line.startswith(('pnpm ','uv ','git ','node ','& ')))]
        times=complete.groups() if complete else ('日志无结尾','未知','未知')
        rows.append((f'[{path.name}](test-results/{path.name})','<br>'.join(q(c) for c in command[:3]),
                    lines[0].removeprefix('START ') if lines else '',*times, '; '.join(f'{key[1]} {value}' for key,value in counts.items() if key[0]==path.stem)))
    write(ev/'test-runs.md','# 命令与结果索引\n\n'
          '日志保留实际命令及退出。配置探针早期失败记在原始日志。机器报告起源、skip 原因及真实路径环境见主要测试矩阵。\n\n'+
          table(['日志','命令','开始','结束','exit','秒','用例结果'],rows))

route_count=routes()
file_counts=files()
runs()
summary = {'feature_rows':len(features), 'feature_domains':dict(Counter(k[0] for k in features)),
           'guard_rows':len(guards), 'guard_domains':dict(Counter(k[1] for k in guards)),
           'routes':route_count, 'files':dict(file_counts), 'test_definitions':len(definitions),
           'results':{f'{a}/{b}':c for (a,b),c in counts.items()},
           'suite_load_errors':len(suites)}
write(ev/'index-summary.json', json.dumps(summary,ensure_ascii=False,indent=2))
print(json.dumps(summary,ensure_ascii=False,indent=2))





# Record individually which source paths had a named audit reference.
# A reference is weaker than a line-by-line review and stronger than mere discovery.
file_provenance = []
corpus = {path.name: load(path) for path in out.glob('[0-9][0-9]_*.md')}
corpus.update({path.name:load(path) for path in (ev/'subagents').glob('*.md')})
corpus['source-review.md'] = load(ev/'source-review.md')
fingerprints = json.loads(load(ev/'source-hashes.json'))
named, only_inventory = [], []
core_paths = [name for name in fingerprints if ('/src/' in name or re.match(r'(?:astrophoto|nodes)/',name) or name in {'__init__.py','frontend/entry.ts'}) and name.endswith(('.py','.ts','.tsx','.vue','.css','.json')) and '/__tests__/' not in name and re.match(r'(?:astrophoto|nodes|mcp|frontend)/|__init__\.py$',name)]
base_count = Counter(Path(name).name for name in core_paths)
for name in core_paths:
    p = Path(name)
    basename=p.name
    if basename == '__init__.py':
        matches=[k for k,doc in corpus.items() if name+':' in doc or (name!='__init__.py' and name in doc)]
    else:
        matches=[k for k,doc in corpus.items() if name in doc or (base_count[basename]==1 and re.search(r'(^|[/ {\\(])'+re.escape(basename)+r'(?=[\x60: ,}/)\n])',doc))]
    if not matches:
        only_inventory.append((q(name),'仅路径清点。没有人工逐文件证据，保留 UNKNOWN。'))
    else:
        named.append((q(name), ', '.join(matches)))
write(ev/'source-provenance.md',
      '# 活跃源码逐路径调查边界\n\n'
      '本页把业务源码的文件名称引用与仅有清点区分开。报告中有名的引用可能来自局部函数、模块清查或测试，'
      '并不代表覆盖文件每一行，也不代表所有防御组合已实测。纯样式、vendor、翻译、构件及依赖的进一步限制见 14。\n\n'
      '## 有专题证据引用\n\n'+table(['源码','报告文件名（范围）'],named)+'\n\n'
      '## 无足够独立具名证据\n\n'+table(['文件','当前状态'],only_inventory))
print(f'Core source reference ledger: {len(named)} named in reports, {len(only_inventory)} inventory-only')
