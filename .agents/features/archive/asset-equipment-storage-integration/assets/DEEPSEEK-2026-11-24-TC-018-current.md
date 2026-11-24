> 主窗口核对：目录 API 哈希与本报告一致。分页测试文件在审查期间继续更新，本报告中的测试覆盖建议对应旧版测试夹具，当前覆盖待核对。

# 辅助审查：DEV-108 / TC-018 分页实现

模型：deepseek-v4.1-flash｜effort：high  
HEAD：`268d5682db91d41da4dbfce477abaabae353b7b0`（工作区快照，HEAD 不能单独代表完整代码树）  
性质：仅基于所给文件的静态辅助审查；未运行测试、未做性能剖析、未修改源码或 Feature 索引；非正式审查，不宣称测试通过。

**审查范围**

| 文件 | 行 | SHA256 |
| --- | --- | --- |
| `AGENTS.md` | 1-46 | `63CEF07A67EB7D6EA26D67D82B76D0A86A4847CD149E74F5707A2C1B92FB4E0C` |
| `.agents/features/asset-equipment-storage-integration/00_FEATURE_INDEX.md` | 1-45 | `8E07DC330BE9D6844003F37EA7368AC56B9ED35873EA237F6F717FD84DF212A9` |
| `.agents/skills/feature-pipeline/SKILL.md` | 1-124 | `D5B134AA71D09DFF332187602FED628992B30C7BAD583EFDCA72B3A728DC6959` |
| `astrophoto/api/catalog.py` | 1-122 | `5D09C65B31E0963EDFBA7591AB63B68B636F43B241572EA18F6F64CA8EF49307` |
| `astrophoto/assets/catalog.py` | 1-372 | `29FE4BBD3EF7E4ADDF68CA46E5F302FF30769DC642083CA445EDBDA995050303` |
| `astrophoto/assets/library.py` | 1-70 | `2D5F364661CF38C5CE9F29F0F4E6D6F40A59569194A4AC80F95E78498600EE84` |
| `mcp/src/astrophoto_mcp/tools/catalog_client.py` | 1-183 | `4A8B343B6BE5CEA810EF11BC18AD76483035F9BDD59E8F81FF8F5A87DC04A812` |
| `mcp/src/astrophoto_mcp/tools/catalog.py` | 1-333 | `2BFB10C83BDC8951604237AEF3C499FDE0BA041FBEC863F4B23BFA3C9BF96C88` |
| `tests/integration/test_catalog_pagination.py` | 1-66 | `AD55242C3C3B26DA2A83F64B55D93000E13CCDEBAE356EEA525443EA73CFA6F2` |

**支持性观察（静态代码）**

- **高｜逐页全量扫描与线性游标定位。** `astrophoto/api/catalog.py:41,82-86,102`、`astrophoto/assets/library.py:22-32`：每请求遍历全库并构造 summary/records，`total=len(rows)`，`after` 再在列表线性找位。P 页约 O(P×N)，10k 行 × 100 页会重复处理约百万行，放大往返、CPU 和内存；与超时的因果关系仍待剖析。建议 SQL 侧过滤、稳定排序和 keyset 游标（多取 `limit+1`），计数独立 SQL 或只在首屏返回。
- **中｜切片后仍有逐项 view 查询。** `astrophoto/api/catalog.py:102-106`、`astrophoto/assets/catalog.py:322-332`：本快照的完整 `catalog.view` 确在 `filtered_page` 之后，仅对页内项调用，未对 10k 全量水合；但每项重复读取日期、`count` 与文件 facts，100 项页可产生数百次查询。建议按页 ID 批量聚合，复用列表查询已有的日期，完整详情只走 detail 路径。
- **中｜校准候选比较早于过滤和分页。** `astrophoto/api/catalog.py:92-102`：先对未绑定候选逐条执行 `catalog.comparison`，之后才处理 type、q、limit，每页重复。建议先按 type/q/绑定预筛再比较；若 status 排序必须全量，则缓存或下推。

**假设与既有证据**

“全量扫描、重复查询和多轮 MCP 往返共同导致 10k 超时”是假设，本文未剖析或复测。既有记录（非本次执行）仅称 1000 条通过、10000 条经 MCP 与 HTTP 均超时（含单独复测）；不能将其当作本次验证结果。

**TC-018/018.a 建议**

- 现测试仅默认 `name_asc`，虽使用相同时间戳却未覆盖 `created_desc/updated_desc` 的 ID 次序；补混合 `assets` 路由、双排序键、末页、`limit` 1/100、过滤后游标延续。
- 记录冷/热首屏、整次遍历、载荷、查询次数及 1/100/1k/10k 分层；覆盖非法/篡改游标、`after` 为末项、过滤变化拒绝游标复用，并核对不漏不重。
- 校准候选补大集比较与分页过滤规模采样；并发写明确记录可能漏/重，不假定游标提供数据库快照。