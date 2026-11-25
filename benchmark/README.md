# 链路检查与测评

本目录目前提供 Pi 环境和 AstroPhoto 只读链路的冒烟检查，还不包含数据集、评分规则或自动化 benchmark 结论。

从仓库根目录运行，使用项目独立的 Python 环境，并确保 Pi 可执行程序在 PATH 中且已配置默认模型：

```powershell
.\.venv\Scripts\python.exe benchmark\checks\pi_hello.py
.\.venv\Scripts\python.exe benchmark\checks\pi_astrophoto.py
```

- `pi_hello.py` 检查 Pi 模型是否返回 `Hello` 并保存会话。结果位于 `.artifact/pi-hello-smoke/<运行编号>/`。
- `pi_astrophoto.py` 要求本机 AstroPhoto MCP 和 8188 预览宿主可用，先查询独立 MCP 对照，再让 Pi 只读查询设备、素材和项目。结果位于 `.artifact/pi-astrophoto-smoke/<运行编号>/`。`review_required` 表示需要人工核对结果和调用轨迹，不代表验收通过。详见[开发与验证](../docs/development/setup-and-testing.md)。

结果可能包含本地路径和数据名称。检查不验证 Skill 激活或写入操作。
