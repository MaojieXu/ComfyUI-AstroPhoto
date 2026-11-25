---
name: comfyui
description: 路由 ComfyUI 宿主原生接口与官方实现参考。用于自定义节点、前端扩展、执行行为、V1 到 V3 迁移和扩展打包；按当前任务加载对应专题。
---

# ComfyUI 开发参考入口

以当前要解决的宿主问题选择专题。先读最直接的一项，任务跨多个接口时再补读相关项。

| 要解决的问题 | 读取 |
| --- | --- |
| 新建或注册 V3 节点，定义 `io.Schema`、`execute` 和扩展入口 | [节点基础](references/node-basics.md) |
| 声明端口、控件、可选参数、隐藏参数和懒输入 | [节点输入](references/node-inputs.md) |
| 确认 `IMAGE`、`MASK`、`LATENT` 等类型的形状、内容和连线契约 | [数据类型](references/node-datatypes.md) |
| 返回 `NodeOutput`，接下游节点，生成预览或保存结果 | [节点输出](references/node-outputs.md) |
| 排查执行顺序、缓存指纹、输入校验、懒求值和执行错误 | [执行生命周期](references/node-lifecycle.md) |
| 使用动态端口、类型匹配、节点展开、循环或异步进度 | [高级节点模式](references/node-advanced.md) |
| 接入前端钩子、Widget、侧栏、设置、命令和事件 | [前端扩展](references/node-frontend.md) |
| 将现有 V1 节点改为 V3，核对字段、方法和注册映射 | [V1 到 V3 迁移](references/node-migration.md) |
| 组织扩展目录、依赖、Web 资源、译文和 Registry 打包 | [扩展打包](references/node-packaging.md) |

例如，预览有图但下游没有 `IMAGE` 时，先核对节点输出，再用数据类型确认连线契约。只有需要检查自定义 Widget 或预览界面时，再读前端扩展。

## 核对官方实现

专题用于定位接口和示例。涉及兼容性、行为判断或源码复用时，先确定目标 ComfyUI 或 ComfyUI Frontend 版本，再用同版本的宿主源码或官方文档确认具体符号、调用入口及依赖。能通过公开接口接入时优先使用；需要适配内部实现时记录来源、版本和适用条件。
