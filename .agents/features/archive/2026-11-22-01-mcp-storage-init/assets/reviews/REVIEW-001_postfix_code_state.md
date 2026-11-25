# REVIEW-001 修复后代码状态

Git HEAD: f84442be5f16dd36f6cfff85a686ce30027dd383。下列为工作树文件的 SHA-256。此快照记录 DEV 修复后的状态，原独立审查覆盖修复前状态。

| 文件 | SHA-256 |
| --- | --- |
| astrophoto/storage/runtime.py | 47f4f67082287ce46a36d5ae75c24c240e568829715d1f51b76ad6144e322e3c |
| astrophoto/storage/initializer.py | ae44f73dd6e3aab31bb9fb035d6fdd7449fed1334a4875f5d799a33b8f1c4df1 |
| astrophoto/storage/locations.py | e0d3a4f7ae5c18e9270b5be578dda4be4714b80616d5a185f0afea37d32abb7e |
| astrophoto/storage/paths.py | f0371ecaa9324d1a639bda230a4c637b3d31ce21e4728421319e32f0c3ffe3fa |
| astrophoto/storage/cache.py | 368c7bef38491960bd7761d6c655152c13d1c586beba50005e7ba58d0494d1ab |
| astrophoto/storage/data_root.py | 116fd285c971d4a2738a5f68f778f5bff014cd2f1bf06032d87f90f709ad3c9b |
| astrophoto/storage/migration.py | 9c4ec6aa28c000067eb648c717c890e524200a446218cd5827ca934d1fe1e70c |
| astrophoto/core/config.py | d081b949bfd903d3c5d64d154f1c868e822f96654866343711ea6566f2235707 |
| astrophoto/database/manager.py | 0b3a5cda3e5c993ade984f8d04b9299ba0bb6bad682c8020d67055cbf7eb106a |
| astrophoto/api/storage.py | 4eaa06d99af614bcf34c3e77f4776a0c9489fa2ad20bcc1e209a8c3994bb2605 |
| astrophoto/api/routes.py | 445d640a77768323fbceb78981ba986f781f43a11f4d70de018f074cf9cc7a12 |
| astrophoto/bootstrap.py | c8a250f9bf0d1b7bb0d8060b68e50b8130c243ba1205af7e275b7d06f062177f |
| mcp/src/astrophoto_mcp/server.py | 3d7af4dd803e41c112e0001a8f348b4ea49acbb122ebae7e877c1694bafd787a |
| mcp/src/astrophoto_mcp/tools/init.py | 328071d5341c5810a08ca06597daf88f2340958924a48729aa70f7d9c693ac4a |
| mcp/tests/test_init.py | b7ab83fc63b2db3191b1041ee0ddcd0265a2dab0ec59a1d1174d8c3b9943ca82 |
| mcp/tests/test_server.py | 3747b7822714d9567714bc77dc760dd135bc6285e65ba5cb153b14ed770a8d42 |
| mcp/tests/test_equipment.py | 5ab86758cf8b337c06c668c08ad242bddae80daf5a2b2d35aa9519075ef82d7d |
| tests/backend/test_storage_init.py | d9a0a91f3ea0c2b89f608eeef62b6e15691dc6681b1d2de2bbd5ff3d510ed077 |
| tests/backend/test_storage.py | 2a37c1b53b995775b8bc3973c7522f43f9e46b80b32698d79c31cb39195e2e79 |
| tests/backend/test_storage_review.py | ba8dda58d7c65d97da62824593ca7c4a67a6db2159b5a02e1c4de01f783abcb5 |
| tests/integration/test_storage_init.py | 3dbd358899feb25bad9471527513f47e73f1b79feba2e6f7ae2abcce59419d3f |
| tests/integration/test_storage_api.py | 0fed36321c068ddf115084f3ef4b1546fddab17d50f5a50693d439a752a0aea5 |
| scripts/check_install.py | 3668c2279169e6125875ef0f58fd3ac9f642d8206f47f66002ddda9cc83aca43 |
