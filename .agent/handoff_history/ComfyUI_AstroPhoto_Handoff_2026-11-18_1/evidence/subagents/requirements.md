# 需求与决策只读审计（局部，未完成）

本报告基于文件清点、专题读取、以下明确引用的内容、CodeGraph 源码及九张截图的视觉检查；不声称完整阅读每篇文本。本轮未运行测试，以下均不得标 VERIFIED。主审应补齐全文、截图及独立功能链路的检查。输入共 81 文件。相同 SHA 的文件是同一内容，不算独立来源；两个原始 Siril 文件和交接 primary 副本哈希不同；逐行 diff 确认各仅多一条开头契约补丁，详见补充。零字节中文设备需求文件不提供需求证据。

## 文件清单与覆盖

| 路径 | 字节 | SHA256 | 检查状态 |
|---|---:|---|---|
| .artifact/Handoff/Chat_Handoff/00_READ_FIRST.md | 5872 | 9D119FD39A878F9FE93EDC952DA3C727B84DB24220E8D6D0E73FC0F246E8D8DB | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/13_NEXT_CHAT_RECOVERY_PROMPT.md | 5513 | 8DD3AEB43D7EB23652491E7EFFDB1371208D76B58B5C87D68A81346F86CB3CB6 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhoto_Sidebar_Chat_Full_Handoff_2026-11-17.md | 120047 | 5A8360EB7CAFC710AC8E1C42AF3B8DB4399B2C4568639E4526E309A69DBE6AB2 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/FULL_CONTEXT.md | 120863 | D53316F0333FBFE36251D915BB8E338CABD9C5460A0D4DED7D8998CF9C70AE46 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/00_START_HERE.md | 4203 | F45CDC21DBD139DD194A6C14722720E4EFE1830FCC12089351EDE6416CAE509F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/01_PROJECT_VISION_AND_SCOPE.md | 4012 | 60C708CF2711D29E80D01DF077CB454384ED55AFDAE6FDFC7370E78CFB8DE558 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/02_LATEST_DECISIONS_AND_CONFLICTS.md | 5397 | 9D62482757AAD1BE1BF6E7BC8E3434C80114D70DC5E3E8757DBFDEBDC867227A | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/03_CURRENT_REPOSITORY_SNAPSHOT.md | 6813 | 5C371825A4AE118B3E70321AF769201FBD2089650CAA3C67D90593E84B098B57 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md | 7880 | 421A3BE79B59002CA68B7649DF425525075219AA8E11F6CE75BE2653252A6D69 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/05_NODE_IMAGE_PATH_CONTRACT.md | 7580 | 8AD6FCA42C9815E5D72245A6EF07EB748449157AA26D8A56639E2472053C1D90 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/06_SIRIL_1_4_5_FACTS.md | 6635 | CC581F5E1567688A7CB4339C0B344E9BDA2E8575C301EC4DD64F585E5E9F9A34 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/07_UI_DESKTOP_SPEC.md | 9636 | 41FFDFD678CB22B3591BF47914499323BFF2574AF3A6BB4FDC8321C5B9BACB91 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/08_WORKSPACE_SECURITY_AND_LIFECYCLE.md | 4920 | 2D8143BE088D3D39F375D0AA48BF3286FE6E23E5B571A855465BF393902BEC83 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/09_IMPLEMENTATION_ROADMAP.md | 7493 | 535E680C3EEA8929F5001E8815D5CC4DA08D580F2FD41D5A26FB99522DDED048 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/10_TEST_ACCEPTANCE_RISKS.md | 6247 | 004198F316D3BB7A6AB51F3872998D26D0911149FAF9864FCB11D843C2805742 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/11_NEXT_AGENT_PROMPT.md | 4211 | 48E6596BF3D3FE3C5C049725E25252EF04B6CF8A73A38A38BA81F5E622CB10C0 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/12_SOURCE_INDEX_AND_EVIDENCE.md | 5661 | 82D48B74FD8D08532F9A2C1DE01849DB25A7FA026CF5A2E54E43F6DADFFCB01D | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/13_OPEN_QUESTIONS.md | 3464 | 6118750C81ADCAE0E81784AE6CB26B856B01C8FFB3CA40545CF4BF00CA170849 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/FULL_HANDOFF.md | 85744 | 90D3040A5089A6EE5E664D66C2F7F4F1FFF1CDD9C85AC9A9ACA1F9AAB046F500 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/HANDOFF_MANIFEST.json | 8330 | DF0CE59E57BA5BA3B2DF4A30B69C2D1ED8838C779ACF9EBCA4C1531CBD572DD2 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/MANIFEST_SHA256.txt | 5007 | 3E9457E484BA196B6FC61FDC8A2EA397CC747872C7D92FF7126A59A6F0A8D4BB | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/新Chat导入说明.txt | 724 | F17EDEC62B02A3F981D1B3D3E7734F2185CD1ED24C93C5CA0B7EBD843A532B4A | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/00_README(4).md | 3015 | 7C481BBF93A32A0C1009C406EAC64EB64A0FFF8914BFD336E46086211D1E4BE8 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/01_CURRENT_STATE(4).md | 3000 | 6010CD98DD03A675ACB1C9AD7433B0E631C8B67219C276C48C2958D019EB7348 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/02_REQUIREMENTS(4).md | 43133 | 5FFB35A102B4CC96DCADB3365B35F0CFC3A7D9454264261239FB1B8C3EBDBE9F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/03_ARCHITECTURE(4).md | 13429 | AB16BF582C021066E77DE57686C37001C83E6C5C230CEFF0EFF87B1EC3F43C01 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/04_TECH_STACK(4).md | 9396 | 642EA6FB901727CB65835117570EFFE27E04070DC84043DFA55CEEA0A4D3B9F5 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/05_MCP_AND_SKILLS(4).md | 10891 | 2BFDE66A2E2DAC10613231FFD16C6499ED67F131142C09AEAC391B1F576D916B | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/06_DATA_MEMORY_RAG(4).md | 3901 | 148C0B833B65B47B3CAE6074C07B8A9714D1A39A6EB67C90A4CD2D96E339A184 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/07_TEST_EVIDENCE(4).md | 10424 | 2DC9929B7A864B188AACA9D4A539015E590F69564459D09CFB0579D270EA2BCC | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/08_GAPS_AND_RISKS(4).md | 3658 | 7119E87172B40921D34B6AB0FBF6C809E27EA1117CFB9FDC8A01B4A47B22DFB0 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/09_DECISIONS(4).md | 2629 | B0CB0751A3F70F983B93B6B79D00F42EBDC06F5AAC7A2FC39E4264E7C0F1798D | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/10_NEXT_AGENT_PROMPT(4).md | 3107 | DCF1297F116020B67A2C6507D4B14C71BD84BCE8333AF6512D7F42143487282E | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/11_RECONCILIATION(4).md | 9447 | B85F0FC3ABF65854F53BB2D74D7BC1F536C9B093971B83921877BABB6D1279FD | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/12_SOURCES(4).md | 3323 | 98F55B2A6099D30A090FDDA67E03B629E69C854AEF5D7363547C4A8A49DC36DD | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/CHANGELOG(4).md | 1651 | 16D37E0FCCD3BEBA3C2AACA7A0290FA8A06625CED2702360BB1DDDF8D1B63063 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/FULL_HANDOFF(4).md | 122573 | FA5AA1E5A75EB1E6594B6F3447750EE60DF401B7E9D750C82B97B7A4D1049792 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/historical_2026-11-16/MANIFEST(4).md | 5250 | 92BEC1495EDA6E9C417FDAAA5D02A32C7F0E02424F57F0C405716FCD9D7A13AE | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/previous_prd/AstroPhotoFlow_Node_Interaction_PRD_v0.1.md | 24827 | 1CE5A0C7C3E3FE0F1EB00194F9CD71AB46F394D6A79709518E8EB848E5BE2869 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/previous_prd/AstroPhotoFlow_Siril_AutoStretch_MVP_PRD_v1.0.md | 45544 | 5A80D81C1F0790558BFF72451DB507F2A1D60198D79135F446FAFCADFD858FE9 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/primary/AstroPhotoFlow_Inspector_Final_Desktop_Prototype.html | 16829 | D81427CCDCD497D6B86DADB11AD3975A58A2EDA77C1E81588929AA7542843FDF | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/primary/AstroPhotoFlow_Siril_1.4.5_AutoStretch_Engineering_Development_Guide_v1.0.md | 66441 | 843782AA900C6E2414E65B218DFA22E98A0F87C5314CA3C2DF9AD90DF09B342F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/primary/AstroPhotoFlow_Siril_1.4.5_AutoStretch_PRD_v1.1.md | 40184 | 279F656DDC368B67B7BDF81326C81AFCCEAFF8616D504AC1521428B3C07FFE2A | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/primary/Pasted markdown(4).md | 25998 | 458CF40ECC4D26B90A257C0D944F042D22166165B4B26A01BF0290C56123FE3A | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/react_sidebar/AstroPhoto_React_Sidebar_Requirements_v1.0(2).md | 36336 | A8E330927264EEBD68DB631E5720A13883B7EF3D1861C60544B4176AAFF95BE5 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/react_sidebar/AstroPhoto_React_Sidebar_Technical_Development_Guide_v1.1(2).md | 57102 | A733156E0ABE20098C698CD69190CA9FC58B84349D7E88963DF6658829EB6311 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/screenshots/image(20261118-053401).png | 20827 | A5FFA9291B68141573050213A20E25D0C89E5605B28341906C50F0ACED68A71E | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/screenshots/image(20261118-061202).png | 30163 | 2BD9B22BF89A4367AAAC97480A50F0F593C627303E6DCD8BB2D7F37BFA96A0D7 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/AstroPhoto_Sidebar_Chat_Full_Handoff_2026-11-17.md | 120047 | 5A8360EB7CAFC710AC8E1C42AF3B8DB4399B2C4568639E4526E309A69DBE6AB2 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/manifest.json | 4624 | C0BE1A39A141A8AA371DDDD03816F8B078C874AC35E026E70551F3C4E0CDDE8F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/README.txt | 769 | 4F69C9FB0D54BD49CF65963048A068959D556E0AAA6F3A52F514FC73E0889371 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-041729).png | 48872 | B1F667936D2F77E240E9D4C2E8108CE18561FD3CA0C8D4F4B636E148714AD865 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-042528).png | 52711 | 16A2F51CEA6D46155A9F2DF6F45443D64F81F4640DDEB63E033528854C191885 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-044420).png | 27626 | 8D13AEE2FBD8B2D17BA1A1244E5AE83ED8EAA6B395433227FC8378ECBBFD09D6 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-073629).png | 35062 | D9F6167A71C0F0F8021F39D33D54FB1A0EA9DE1BFBBD951AD49080EA27884067 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-074740).png | 2978 | 90974F422DCFDB1765A7EF5EADD66B660E89AEAE7611921F25CC922825AA1DC9 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-074801).png | 2546 | 0BBE2ADDB03927D6AEABAE7FA7BAD843543073DF3BFEB23DAD705BA79D619C8F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/screenshots/image(20261117-075258).png | 4001 | 8FF328820049A46F36AE573AFC2C85F94FCA48BA68A9C86C393E6694250671D9 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/00_README.md | 3015 | 7C481BBF93A32A0C1009C406EAC64EB64A0FFF8914BFD336E46086211D1E4BE8 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/01_CURRENT_STATE.md | 3000 | 6010CD98DD03A675ACB1C9AD7433B0E631C8B67219C276C48C2958D019EB7348 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/02_REQUIREMENTS.md | 43133 | 5FFB35A102B4CC96DCADB3365B35F0CFC3A7D9454264261239FB1B8C3EBDBE9F | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/03_ARCHITECTURE.md | 13429 | AB16BF582C021066E77DE57686C37001C83E6C5C230CEFF0EFF87B1EC3F43C01 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/04_TECH_STACK.md | 9396 | 642EA6FB901727CB65835117570EFFE27E04070DC84043DFA55CEEA0A4D3B9F5 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/05_MCP_AND_SKILLS.md | 10891 | 2BFDE66A2E2DAC10613231FFD16C6499ED67F131142C09AEAC391B1F576D916B | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/06_DATA_MEMORY_RAG.md | 3901 | 148C0B833B65B47B3CAE6074C07B8A9714D1A39A6EB67C90A4CD2D96E339A184 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/07_TEST_EVIDENCE.md | 10424 | 2DC9929B7A864B188AACA9D4A539015E590F69564459D09CFB0579D270EA2BCC | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/08_GAPS_AND_RISKS.md | 3658 | 7119E87172B40921D34B6AB0FBF6C809E27EA1117CFB9FDC8A01B4A47B22DFB0 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/09_DECISIONS.md | 2629 | B0CB0751A3F70F983B93B6B79D00F42EBDC06F5AAC7A2FC39E4264E7C0F1798D | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/10_NEXT_AGENT_PROMPT.md | 3107 | DCF1297F116020B67A2C6507D4B14C71BD84BCE8333AF6512D7F42143487282E | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/11_RECONCILIATION.md | 9447 | B85F0FC3ABF65854F53BB2D74D7BC1F536C9B093971B83921877BABB6D1279FD | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/12_SOURCES.md | 3323 | 98F55B2A6099D30A090FDDA67E03B629E69C854AEF5D7363547C4A8A49DC36DD | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/AstroPhoto_React_Sidebar_Requirements_v1.0.md | 36336 | A8E330927264EEBD68DB631E5720A13883B7EF3D1861C60544B4176AAFF95BE5 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/AstroPhoto_React_Sidebar_Technical_Development_Guide_v1.1.md | 57102 | A733156E0ABE20098C698CD69190CA9FC58B84349D7E88963DF6658829EB6311 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/CHANGELOG.md | 1651 | 16D37E0FCCD3BEBA3C2AACA7A0290FA8A06625CED2702360BB1DDDF8D1B63063 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/FULL_HANDOFF.md | 122573 | FA5AA1E5A75EB1E6594B6F3447750EE60DF401B7E9D750C82B97B7A4D1049792 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Last_Handoff/sources/MANIFEST.md | 5250 | 92BEC1495EDA6E9C417FDAAA5D02A32C7F0E02424F57F0C405716FCD9D7A13AE | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Original_request/Siril_Integrate/AstroPhotoFlow_Siril_1.4.5_AutoStretch_Engineering_Development_Guide_v1.0.md | 66733 | 046C9EA2F6CB9939D6A839D5EF94DC61A000DFFE6FA137762F6A79BC7F5738EC | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Original_request/Siril_Integrate/AstroPhotoFlow_Siril_1.4.5_AutoStretch_PRD_v1.1.md | 40564 | 8B8A615D5110C84C69D092FCCBD692A7ED3EBD90C09AAF2542ED34AABED7F4D2 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Original_request/设备板块/AstroPhoto_Equipment_Optical_Train_Three_Tier_Engineering_Guide_v1.0.md | 88466 | F5F5EC3940916F7E08562E9C3ED44C366EAF98E7C751844A5F406EB63C598879 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Original_request/设备板块/AstroPhoto_Equipment_Optical_Train_UI_Requirements_v1.0.md | 41670 | 8BAE1CD4A2ECE6EA2964AD3DED65DC8CBA5AE4285ACCFF7A724D4895BA7B63F3 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |
| .artifact/Handoff/Original_request/设备板块/设备管理与光学链路前后端需求规格.md | 0 | E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855 | 清点及哈希；文本仅专题抽查，图片见下方逐图结果 |

## 决策矩阵（限已定位证据；路径均相对项目根）

| ID | 原始 / 上次 / 本次及冲突 | 现源码与结论 |
|---|---|---|
| D01 Inspector | 旧专题 .artifact/Handoff/Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/02_LATEST_DECISIONS_AND_CONFLICTS.md:34–36 与 04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:35–39,46–55 曾指定只读。用户目前明确 Inspector 参数可以修改。 | frontend/ui/src/host/scientific.tsx:150–172,180–193 修改并重置实际 widget 参数。判为实现符合最新决定，编辑链回归待核验。旧只读条款 OBSOLETE。本期无 Trial 管理。 |
| D02 IMAGE_PATH | 旧 ASTRO_FRAME 方案被首期实际路径字符串取代；Source → Siril 内部 load/process/save，非独立命令节点，未来科学类型未全局否决（`02_LATEST_DECISIONS_AND_CONFLICTS.md:15-30`，`04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:24-28,35-38`）。| `__init__.py:5-6,40-41` 注册 FITS source、ImagePath、Siril；`frontend/ui/src/host/scientific.tsx:12-14,36-46` 跟踪路径/上游结果。**PARTIAL**：此处仅核对入口，完整类型、缓存、权限及产物链应由代码审计核实，不得由节点存在推断全部验收。 |
| D03 Siril | `02_LATEST_DECISIONS_AND_CONFLICTS.md:37-38` CLI、仅 1.4.5 首期；`04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:61-67` 三参数，受控输出且原图不变。 | `frontend/ui/src/api/siril.ts:4-7,14-17` 配置和预览 API、默认参数与严格 ready 版本检查；`__init__.py:40-41` 节点注册。**IMPLEMENTED_UNVERIFIED**；后端执行、权限和真实 CLI 未在本轮验证。 |
| D04 数据与 workspace | `08_WORKSPACE_SECURITY_AND_LIFECYCLE.md:27-37,54-62,66-74` 复用现有存储；外部原址不隐式复制；正式产物持久、预览缓存；路径受控检查、CLI 不经 shell；物理路径会泄露，需要信任边界。设备指南 `.artifact/Handoff/Original_request/设备板块/AstroPhoto_Equipment_Optical_Train_Three_Tier_Engineering_Guide_v1.0.md:9,24,102-103` 仅开发测试 DB 可显式重建，无旧库迁移但禁止启动自动擦除。| **PARTIAL / UNKNOWN**：本专题未核对全部真实路径策略、迁移与恢复行为；现有开发库授权不能推及用户生产数据。`tests/backend/test_siril.py:25-31` 明确测试导入根外直接 FITS 路径可用，需核对实际信任边界，不能将“导入根限制”当作已实现 guard。 |
| D05 Sidebar | 原始设备 UI 需求 `.artifact/Handoff/Original_request/设备板块/AstroPhoto_Equipment_Optical_Train_UI_Requirements_v1.0.md:14-21` Settings 下设备和光路，宿主仍 Nodes/Assets/Settings 三主视图。| **UNKNOWN**：未完整核对当前视图注册及宿主；旧版交接是历史快照，不能证明当前 UI 或运行通过。 |
| D06 设备及光路历史 | 原始 UI `.../AstroPhoto_Equipment_Optical_Train_UI_Requirements_v1.0.md:22-29`；工程指南 `.../AstroPhoto_Equipment_Optical_Train_Three_Tier_Engineering_Guide_v1.0.md:17-18,78-84` 要求草稿、发布不可变 revision、历史 snapshot，设备修改不重写历史。| `astrophoto/equipment/trains.py:1` 明示单一可编辑光路、旧 revision 只读；**OBSOLETE（旧多版本需求）/ IMPLEMENTED_UNVERIFIED（单配置）**：当前会话用户明确要求设备和光路不维护历史版本，并要求删除历史版本；此更新决定覆盖原始文档。遗留 revision 的保留/访问与删除范围需按当前源码和授权另审。尚未完整核查服务与 UI。 |
| D07 权限 | `08_WORKSPACE_SECURITY_AND_LIFECYCLE.md:37,58-62` 要求服务器路径许可、规范化和信任限制，不能给远程 Agent 任意读写。| `__init__.py:20-38` 在 on_load 确定 trusted_local 并注册路由；不是各端点授权充分性的证据。**UNKNOWN**，请核查 guard 触发、HTTP 错误及实际允许范围。 |
| D08 长期目标 | `02_LATEST_DECISIONS_AND_CONFLICTS.md:11,28` 保留泛化科学类型和未来交互可能，`04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md:71` 不把 Memory/RAG/Experiments/业务 MCP 与完整格式支持算成本期。 | **PLANNED / UNKNOWN**：禁止依据规划文档宣称实施。设备文档明确不做驱动、硬件控制和校准匹配（设备 UI:29；工程指南:24）。 |

## 功能、Guard 与测试裂缝

- Inspector 有输入、输出、刷新与参数修改路径，编辑造成 workflow 变化；当 `canvas.read_only` 或 `selectOnly` 为真时 `scientific.tsx:153` 提前返回，其他情况通过 `beforeChange` / `onWidgetChanged` / `graph.change` / `afterChange` 改变状态（150-172）。这些是可编辑功能的宿主权限守卫。
- 预览源路径从连接的 source/image path/上游已匹配执行结果获取（`scientific.tsx:36-46`）；参数或来源变化后匹配失效（68-76），400ms 请求候选（93-115），活跃预览每 8 秒验证并将失败标为 stale（117-133）；这些是源码陈述，未运行验证。路径可达性、请求权限、缓存回收、正式结果恢复须由主审逐条核对。
- `tests/integration/test_siril_api.py:22,43-49,55-80` 使用 aiohttp TestClient/TestServer，断言无本地头和跨源写入 403、配置错误、无 Siril 时可生成 before 而 after 缺失；**测试源码存在，不是本轮运行结果**。`tests/backend/test_siril.py:40-51,76-81,91-110,138-151` 有文件变更 fingerprint、精度/元数据、参数错误、版本拒绝保留旧配置与恢复只清自有运行目录等断言；真实 CLI 测试从 155 行起，环境与 skip 条件需要另行完整核查。
- `frontend/ui/equipment-host.mjs:103-122,246-252` 是包含真实宿主与重启/删除断言的脚本源码，不是本轮运行证明；其中会修改设备与设置，不在本只读任务运行。
- 每个独立功能的 I/O、调用链、持久副作用、并发、校验、异常与恢复、精确测试环境及断言未完成逐项审核；正式 guard 亦未列全。请主审合并其他代码审计并保留此限制。

## 证据级别与未覆盖

历史交接中的测试结论仅为历史自述；本轮没有运行测试，不能标 VERIFIED。已比较原始/副本差异并视觉检查九张 PNG；三套材料尚未全文逐行语义阅读，完整正式执行/权限边界及测试断言分析仍未完成。应把未确认项保留 UNKNOWN，禁止用本局部矩阵代表完整需求验收。


## 后续指令与证据纠正

- 设备与光路：当前会话/直接用户指令为“设备不需要维护多个历史版本”“光路也不需要维护多个版本”“不需要历史版本，删除历史版本”。这晚于原始 UI 和工程文档；D06 的原历史版本设计为 OBSOLETE，当前单配置方向与明确用户意图相符，是否实现彻底及遗留数据处理仍以代码审计为准。
- Inspector 当前会话明确可编辑，替代上一轮审计引用的只读条款，与 Node实现(3) 的参数同步设计及当前源码一致。
- 逐行差异：Git `diff --no-index --unified=2` 对原始 `Original_request/Siril_Integrate/` 两个文件和 `Chat_Handoff/AstroPhotoFlow_Siril_Handoff_2026-11-18/source_materials/primary/` 同名副本执行。每一对唯一文本差异均是原始文件第 3 行新增 2026-11-18 契约补丁：工程规范明确自定义 IMAGE_PATH、底层字符串、登记资产与授权导入目录服务端校验、Workspace 输出；PRD 明确 Source 到 Siril 的 IMAGE_PATH 与合法 FITS/工作区输出。交接副本仍保留 ASTRO_FRAME 的原始正文；补丁声明该正文为历史记录及未来规划。由此差别是实质边界而非换行或仅格式。两份补丁措辞包含“授权导入目录”，而源码测试 `tests/backend/test_siril.py:25-31` 接受导入根外直接路径；这只能定位权限契约差异，是否在当前 trusted-local 策略下获较新授权须主审结合当前会话和代码确认。

## 九张截图逐项视觉检查

| 文件名（完整目录见清单） | 本轮实际看到 | 证据限度 |
|---|---|---|
| image(20261118-053401).png | 资源管理器列出设备 UI、Siril PRD、PRD.md | 只证明当时文件列表，非产品截图 |
| image(20261118-061202).png | Siril_Integrate 目录列出两个 Markdown 文件、显示大小 | 文件存在历史画面，非运行 |
| image(20261117-041729).png | 暗色宿主媒体资产面板，生成/导入切换及生成空态 | UI 参考，不是 AstroPhoto 功能通过 |
| image(20261117-042528).png | 同类媒体资产面板的较宽布局与空态 | 宿主参考，不证明响应式验收 |
| image(20261117-044420).png | 浅色 AstroPhoto 素材概念图：拍摄会话、Light/Dark/Flat/Bias 和 FITS | 模拟数据及设计参考，非当前实现 |
| image(20261117-073629).png | 浅色 Settings 原型，含语言、主题及规划模块 | 历史设计，后续删除独立语言/主题行见 `Last_Handoff/AstroPhoto_Sidebar_Chat_Full_Handoff_2026-11-17.md:1731` |
| image(20261117-074740).png | 深色“已生成/已导入”切换局部 | 视觉参考 |
| image(20261117-074801).png | 深色“节点/素材/设置”导航局部 | 视觉参考 |
| image(20261117-075258).png | 深色节点搜索、排序、筛选控件局部 | 视觉参考 |

## 阅读与去重补充

`05_NODE_IMAGE_PATH_CONTRACT.md`、`06_SIRIL_1_4_5_FACTS.md`、`10_TEST_ACCEPTANCE_RISKS.md`、`13_OPEN_QUESTIONS.md` 本轮全文读取；`02_LATEST_DECISIONS_AND_CONFLICTS.md`、`04_CONSOLIDATED_PRODUCT_REQUIREMENTS.md`、`08_WORKSPACE_SECURITY_AND_LIFECYCLE.md`、两份设备原始文档、Siril 原始 PRD/工程规范按关键主题读取，余下文本以清单和标题/关键词抽查为主，不能标全文已读。FULL 汇编和专题同时清点及抽查：Siril `FULL_HANDOFF.md` 汇集专题（例如全文 146-184 对应专题 02；349-390 对应 04），不将同一决策计为独立证明；`FULL_CONTEXT.md` 是合订本但有设备相关独立内容（如 140、409、738、768 行），不能仅凭名称判完全重复；历史 FULL 与专题文件同样须区分汇编与独立来源。精确相同 SHA 文件仅计一个内容，其他哈希不同的文本未证明完全重复。当前未完成用户要求的所有独立文本全文实质阅读；这里明确保留缺口。

哈希统计：81 个文件、62 个不同 SHA-256、19 组重复（每组各两份）。重复包括 Last_Handoff/sources 的 00–12、CHANGELOG、MANIFEST、FULL 与 Chat_Handoff 的 historical_2026-11-16 同名 `(4)` 副本，React Sidebar 两份规范及 Sidebar Chat Full 两份。清单中保留两条路径便于追溯，但每组只能算一份内容。`FULL_CONTEXT.md`、新版 Siril `FULL_HANDOFF.md` 和历史 FULL 不同 SHA，不能按字节相同合并；它们的汇编内容仅作同源材料核对，专有前言、冲突和合订内容仍需要阅读。

旧 Siril 调查的 50 passed/3 skipped、MCP 52、React 7 suites/37 的数字来自 `03_CURRENT_REPOSITORY_SNAPSHOT.md:85-96` 及 `10_TEST_ACCEPTANCE_RISKS.md:23-29`，是历史报告，不是当前执行；该报告明确 Vue Vitest、build、真实 Host 未运行。Siril `10_TEST_ACCEPTANCE_RISKS.md:3-20` 的 13 条 AC 均是调查时待验证；不能据此声称现仓仍未实现，也不能把后续实现自动标通过。
