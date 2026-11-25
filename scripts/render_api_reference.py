"""Render API inventories as Markdown; do not infer undocumented HTTP contracts."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'docs/api/inventory.json'
GROUPS = {
    'status': '状态', 'storage': '存储', 'equipment': '设备和设备组合',
    'catalog': '素材目录、校准与项目', 'direct-import': '浏览器直传',
    'library': '素材记录、导入与受管文件', 'assets': '宿主路径导入与引用重定位',
    'scientific-deferred': '科学接口（暂缓专项）', 'siril-deferred': 'Siril Bundle（暂缓专项）',
}


def main():
    data = json.loads(DATA.read_text(encoding='utf-8'))
    out = ROOT / 'docs/api/http/routes.md'
    out.parent.mkdir(parents=True, exist_ok=True)
    rows = ['# HTTP 注册路由清单', '', '清单对照源码和宿主实际注册。状态码为声明的默认成功状态。'
            '请求、条件分支、错误和副作用见 [HTTP 契约](contracts.md)。', '']
    for group, title in GROUPS.items():
        rows += [f'## {title}', '', '| 方法 | 路径 | 成功码 | 注册处理器与源码 |', '| --- | --- | --- | --- |']
        for item in data['http'][group]:
            ref = '../../../' + item['source']
            action = item.get('handler', 'status_handler').replace('|', '\\|')
            rows.append(f"| `{item['method']}` | `/astrophoto/v1{item['path']}` | {item['status']} | [{action}]({ref})（注册行 {item['line']}） |")
        rows.append('')
        for item in data['http'][group]:
            if item.get('field_checks'):
                rows += [f"### {item['method']} `{item['path']}`", '',
                         '处理器中的字段校验线索（原始源码表达式；可能因方法或分支不同而变化，非完整 Schema）：', '']
                rows += [f'- `{expr}`' for expr in item['field_checks']]
                rows.append('')
    out.write_text('\n'.join(rows), encoding='utf-8')
    out = ROOT / 'docs/api/mcp'
    out.mkdir(parents=True, exist_ok=True)
    for category, tools in data['mcp']['auto'].items():
        lines = [f'# MCP：{category}', '', '以下 Schema 从自动发现模式的隔离进程内服务导出。'
                 '逐工具返回、调用链和错误见 [MCP 契约](contracts.md)。', '']
        for tool in tools:
            name = tool['name']
            annotations = tool.get('annotations') or {}
            flags = ', '.join(f'{k}={v}' for k, v in annotations.items()) or '未声明'
            lines += [f'## `{name}`', '', tool.get('description') or '无描述。', '',
                      f'注解：{flags}。', '']
            if tool.get('source'):
                lines += [f"实现：[源码]({ '../../../' + tool['source'] })（第 {tool['source_line']} 行）。", '']
            lines += [f"[隔离调用与结果核对](examples.md#{name.replace('_', '-')})", '']
            lines += ['输入 Schema：', '', '```json',
                      json.dumps(tool['inputSchema'], ensure_ascii=False, indent=2, sort_keys=True), '```', '']
            if tool.get('outputSchema'):
                lines += ['输出 Schema（仅包含已声明部分）：', '', '```json',
                          json.dumps(tool['outputSchema'], ensure_ascii=False, indent=2, sort_keys=True), '```', '']
        (out / f'{category}.md').write_text('\n'.join(lines), encoding='utf-8')
    print('Rendered HTTP routes and MCP input/output schemas')


if __name__ == '__main__':
    main()
