# 两层文件地图

路径相对仓库根。同一个文件在每层只出现一次。目录和文件名之间用 ` — ` 加职责。Module 将项目内导入、变量、执行分支和测试直接挂在文件节点下。公共包的有效行为写入流程。记录变量的初始化、关键读取和重赋值。把所有出口放在对应条件下，写清错误传播到哪里、捕获后如何处理及谁负责清理。

测试条目列真实用例与断言。标明直接覆盖、经入口覆盖或仅有相关引用。查不到断言时保留证据缺口。

## 同一个存储文件在两层地图中的写法

Core 记录定位和职责。

```text
└── astrophoto/ — 扩展后端源码。
    └── storage/ — 工作区、缓存及存储运行时。
        └── runtime.py — 组装存储服务，首次启动或重入时恢复状态，按 revision 更新设置并汇总健康状态。
```

Module 节选启动链，其他方法继续挂在 `runtime.py` 下。

```text
└── astrophoto/ — 扩展后端源码。
    └── storage/ — 存储启动、工作区与缓存。
        └── runtime.py — 组装存储服务，首次启动或重入时恢复状态，按 revision 更新设置并汇总健康状态。
            ├── 项目内导入（节选）
            │   ├── astrophoto/storage/paths.py → canonicalize_root，在启动前规范化数据根。
            │   └── astrophoto/siril/processing.py → recover_runs，在释放启动锁后恢复 Siril 运行。
            ├── 类 StorageRuntime
            │   ├── initialize(root, environ)
            │   │   ├── root 重赋值为规范化路径，检查后创建目录；依赖异常向上传播。
            │   │   └── 返回 _initialize(root, environ) 的结果；捕获该调用抛出的 Timeout，转为 STORAGE_BUSY 并保留异常链。
            │   └── _initialize(root, environ)
            │       ├── 持启动锁加载 manifest 和 settings，构造数据库管理器并置 creating ← not manifest["initialized"]。
            │       ├── creating 为真时清理启动临时文件；重入跳过这一步。初始化数据库和服务、默认工作区及缓存。
            │       ├── 初始化完成且 creating 为真时原子写入 initialized=True。此前异常跳过写标记及恢复。
            │       └── 离开锁后依次恢复 Siril 和后台操作，成功才返回 service；恢复异常向上传播，已写的标记保留。
            └── 测试覆盖（tests/backend/test_storage.py，直接调用）
                ├── test_first_start_and_reentry：重入保留实例 ID 和默认工作区 ID。
                └── test_bootstrap_interrupted_after_database_commit：注入缓存初始化失败，重试保留已落盘身份。
```

## 带取消和清理的前端函数

```text
└── frontend/ — 前端源码。
    └── ui/ — 侧栏工程。
        └── src/ — 侧栏实现。
            └── api/ — 请求及响应校验。
                └── client.ts — 发起宿主 JSON 请求，区分调用方取消、超时、网络和响应错误。
                    ├── 项目内导入
                    │   └── frontend/ui/src/host/comfy.ts → app，通过 app.api.fetchApi 发请求。
                    ├── requestJson(path, method, body?, signal?, timeoutMs=10000)
                    │   ├── controller 初始为新 AbortController，供请求、外部取消和超时共用。timeout 初始为 false，定时器触发时置 true 并中止请求。
                    │   ├── signal 已取消时先中止内部 controller，再安装一次性监听和定时器，进入请求。
                    │   ├── 非成功响应尝试提取业务错误、字段和 request_id。错误体解析失败时按 HTTP 状态发出 ApiError。
                    │   ├── 204 提前返回 null；其他成功响应解析 JSON，坏 JSON 归类为 json，中止导致的解析异常交给外层。
                    │   ├── 外层按调用方取消、超时、既有 ApiError、网络错误的顺序处理。
                    │   └── finally 清除 timer，移除外部 signal 的 abort 监听。
                    └── 测试覆盖（frontend/ui/src/__tests__/api.test.ts，经 getJson）
                        └── timeout and caller abort cancel the host request：分别断言 timeout、AbortError 和计时器已清除。
```
