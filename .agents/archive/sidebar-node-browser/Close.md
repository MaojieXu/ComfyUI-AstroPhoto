# 侧栏与节点浏览 · Close

**v1.3 · 2026-11-21 · CLOSED**

PRD v0.14 / D-18 已同步摄影素材库 v0.7 与 UI/UX v1.0。共享工作树 75 项组件与契约测试通过，类型、静态检查、构建及代理验证通过。实际发布构件在隔离 Windows 宿主 ComfyUI Backend 0.46.0 / Frontend 1.59.6 的 Classic 和 Nodes 2.0 均通过。 [运行与基线](06_TEST_REPORT.md#v014-共享集成验证) · [阶段索引](00_FEATURE_INDEX.md)

| 需求 | 当前交付与验收状态 | 对应证据 |
| --- | --- | --- |
| FR-01 · AC-01.1～7 | 接入单一侧栏，覆盖重复挂载和清理、鼠标与键盘、宿主中英和明暗、设备草稿优先、浏览上下文与导航图不变。 | CASE-01-A/B，组件回归、integrated-r6 与触控。 |
| FR-02 · AC-02.1～11 | 验证模块归属、改名包、示例排除、稳定 ID、分类搜索、刷新乱序及失败重试、收藏精确路径和写入回读。真实主机省略某 ID 的目录响应后隐藏收藏，恢复同 ID 后重新显示。 | CASE-02、06、07，integrated-r6 与跨窗口书签观察。 |
| FR-03 · AC-03.1～10 | 两画布主图和子图对照原生位置，覆盖缩放和平移、权限及旧拖放拒绝、保存内容重开。真实主图与子图插入失败后均验证原生历史。能力缺失有无写入拒绝。 | CASE-03、07，integrated-r6 与 canvas.test.ts。 |
| FR-04 · AC-04.1～7 | 缺省与完整详情、原文文本、Escape、键盘焦点、触控和刷新撤下均有证据。 | CASE-04，integrated-r6、组件及真实触控详情。 |
| FR-05 · AC-05.1～7 | 共享构件默认 Projects，提供 All Assets；打开及浏览保持只读。导入快捷入口可直达 Storage，显式激活顶层素材回 Projects 并保护未保存编辑。Settings 能力与设备草稿以组件隔离验证。 | CASE-05，integrated-r6、Storage 导航回归、Library 与 BundleBoundary 组件测试。 |

| 决定 | 落实或偏差 | 关闭证据 |
| --- | --- | --- |
| D-12 | 刷新先撤下旧树与详情；乱序、失败和重试已验。 | CASE-02-C、04-B、07-A |
| D-13 | 统一使用排除示例后的目录集合，改名安装已验证。 | CASE-02-A、07-A |
| D-14 | 已实现分路径移除、单次设置写入、成功回执与失败回读。 | CASE-06-A/B 与宿主回执 |
| D-15 | 现行默认 Assets、有草稿时优先 Settings。 | CASE-01-B、05-A/B |
| D-16 | 现行注册闭包持有草稿，领域 API 保存正式记录。 | CASE-05-B |
| D-17 | 本专题经验证的组合为 Backend 0.46.0 / Frontend 1.59.6 的 Classic 与 Nodes 2.0，Windows / Chromium。 | CASE-03、07，integrated-r6 |
| D-18 | 默认视图接入素材库 Projects 和 All Assets，按需只读加载。 | CASE-05-A，integrated-r6 与 Storage 导航回归 |
| D-19 | 三主标签返回首页，沿用已有未保存保护及存储直达。 | [v0.15 定向组件与当前宿主回归](06_TEST_REPORT.md#v015-顶层标签回归) |

书签写入前保留已落盘的其他页面改动，重叠全数组写入遵循宿主后提交值，属于 FR-02.5 明确的非原子边界。素材、存储和科学处理保留各专题的领域验收。 [测试计划](05_TEST_PLAN.md) · [摄影素材库](../04-equipment-optical-trains/00_FEATURE_INDEX.md) · [收藏任务](../../notes/node-bookmarks.md)
