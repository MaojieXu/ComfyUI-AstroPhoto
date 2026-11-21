# 设备与光路管理 · 开发规格与实现

**v0.3 · 当前源码回溯**。本轮文档同步，共享 [索引](00_FEATURE_INDEX.md) 的 HEAD + dirty 基线。React 历史页可查 `git show 4c0cf4d:frontend/ui/src/features/settings/equipment/EquipmentPage.tsx`，当前入口为 Vue，七条主要页面路由在有状态的 EquipmentPage 中。

| 需求 | 现行文件和符号 | 实际路径、拒绝与副作用 | 用例 |
| --- | --- | --- | --- |
| FR-04、FR-05 | `frontend/src/features/sidebar/SettingsPage.tsx:SettingsPage`；`frontend/src/features/library/pages/EquipmentPage.tsx:EquipmentPage,leave,discardAndLeave`；`frontend/src/host/sidebar.ts:registerSidebar` | 依赖 capabilities，已访问视图挂载。编辑脏状态同步到注册实例 `EquipmentSession.current`，卸载解除 guard 和 beforeunload，重新打开重建当前编辑。表单 busy 禁止离开，正常离开可确认丢弃。查询状态只在 EquipmentPage 实例保留。 | CASE-04、05 |
| FR-01、FR-04 | `frontend/src/features/library/pages/EquipmentList.tsx:EquipmentList`、`EquipmentForm.tsx:EquipmentForm,SpecDetails`、`EquipmentDetails.tsx:EquipmentDetails` | 输入去抖后以查询/筛选/epoch 载入分页，后续页按游标追加。新增按种类构造字段，PATCH 带原版本；读取权威 DTO 显示折叠详情、引用。409 重读现有设备，确认后替换版本基线，保留提交表单。 | CASE-01、04 |
| FR-01、FR-03、FR-05 | `astrophoto/equipment/schemas.py:equipment_fields,validate_specs,validate_passbands,readout_modes,list_options`；`service.py:EquipmentService,persist_specs,change_version,check_equipment_references` | 字段校验器检查文本、枚举、类型和未知字段；文本通常最多 120，备注 4000；读出/通带各最多 32，重复标签/ID或反向范围拒绝。创建事务写父和规格；更新事务载入类型后校验、比较版本、写规格和 DTO。带 ID 的通带必须属于该滤镜。删除先核版本再查当前配置和全部旧快照，受保护时事务退出，无数据删除。 | CASE-01、03 |
| FR-02、FR-04 | `frontend/src/features/library/pages/OpticalTrainEditor.tsx:OpticalTrainEditor,withNewDevice`；`OpticalTrainDetails.tsx:OpticalTrainDetails`；`frontend/src/api/equipment.ts:fetchSelectable,createTrain,saveTrainDraft` | 可选设备按 archived=all 分页加载，选择层显示归档项失效，活动列表排除。新建 POST 含配置，编辑 PUT 带 `expected_draft_version`；快速新增设备独立保存并填入当前光路草稿。编辑 409 重读，归档则报错，人工确认后原输入使用新版本。 | CASE-02、04、06 |
| FR-02、FR-03 | `astrophoto/equipment/trains.py:OpticalTrainService,train_to_dto,revision_dto`；`snapshots.py:validate_train_components,validate_train_snapshot`；`schemas.py:parse_train_draft` | 草稿校验名称、唯一 UUID 部件及各列表最多 50、旋转 [-360,360]；部分配置允许为空。写事务先拒绝归档光路和过期 draft 版本，再校验组件存在及类型，清空 base revision 更新配置和主行版本。读取当前优先，旧默认/最新为回退，真实名称来自当前设备。删除按主行版本核验，延迟 FK，移除默认及配置、暂移除不可删触发器、删目标快照、重建触发器，再删主行，任何异常由事务回滚。 | CASE-02、03、06 |
| FR-03、FR-05 | `astrophoto/api/equipment.py:equipment_routes`、`api/storage.py:handler`、`api/security.py:authorize_equipment_request`；`frontend/src/features/library/components/useMutation.ts:confirmAction,useMutation` | 宿主确认（删除带对象名、确认返回恢复焦点）、pending guard、HTTP 权限与输入校验、服务检查与写入按顺序发生。未确认无 DELETE；使用引用独立于页面检查。HTTP 反馈带 request ID，409 从详情或表单有不同恢复动作。Abort 后忽略客户端结果，服务端提交状态需查询确认。 | CASE-03～05 |

## v0.4 待实现差异

- **名称与反馈 · CASE-07。** 用户词条改称「设备组合」。设备创建和更新、OpticalTrainService.create_train 与 _write_draft 写组合名称。目前服务和持久层无同名守卫，后续覆盖并发、旧数据与 Q-07 比较口径，向名称字段回传重名反馈。
- **归档引用 · CASE-06。** validate_train_components 目前检查存在性和类型。待在实际写入入口区分已有引用和新增引用，覆盖带组件新建、修改、删除引用后再尝试加入。保留版本冲突、快照兼容和失败回滚。
- **现有路径回归 · CASE-06、CASE-08。** 两列表独立单选、原表单不开放额外控件。验证普通编辑保留兼容字段。

**实施差异与影响**。已实现 Vue 详情、保存、重基及响应回执。API 仍允许符合类型的归档设备被直接加入配置；旧值在编辑器只读保留，配置备注/旋转/平场字段无编辑控件。光路默认及发布接口受保护，主详情未提供旧快照浏览页面；历史通过仅作历史兼容参考。MCP 入口 `mcp/src/astrophoto_mcp/api/equipment.py:EquipmentHTTP.get` 经独立连接与 Bearer 调用相同设备路由，当前没有写入 Tool。当前未定义网络不确定后自动恢复创建、字段级合并或批量操作。 [待决规则](01_PRD.md) · [事务与规则](03_TECH.md) · [测试计划](05_TEST_PLAN.md) · [删除历史记录](../../notes/equipment-delete.md)
