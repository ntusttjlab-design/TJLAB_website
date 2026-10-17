# Google 試算表前五名服務

更新：2026-10-18，2.1.0，GAS 第 6 版（02:27 台灣時間）。

- [公開遊戲與排行榜](https://script.google.com/macros/s/AKfycbyRZxGSqJSSxOFhRZMFIfw5SUisX_PRHwzgLF0lUmIgEROdrOsHkE2koX3nATMIJGDZ/exec)
- [GAS 編輯器](https://script.google.com/home/projects/1gI_IUOdCPgtig0U4XoBbcPA4bv0un-fhGe0t2FCaCDzNZ_7k3h3bS0jl/edit)
- [指定試算表](https://docs.google.com/spreadsheets/d/1DyZMK0cQe0eMIpvAofCX-JpzEL4nQxKDzsjSVEcpiUw/edit)

使用者已授權以研究室帳號執行、所有人（含未登入訪客）使用，並自行完成 Google OAuth；本輪更新同一部署，未擴大權限。

## 現行資料

現行榜單使用 `MSMTJL_Leaderboard!A1:F11`，Sheet ID 563196642；每遊戲最多五筆。舊 `MSMTJL_Records` 唯讀保留，首次有效寫入將合法元素規則成績帶到新表，舊 DP 不混入。其他分頁不動。兩表請勿互相覆蓋。

欄位：game_id、nickname、score、duration_ms、recorded_at、rules_version。新表固定表頭、適當欄寬及 30px 列高。不儲存登入帳號、識別碼或整段遊玩過程。

- snake-elements-v1：按原子序收集數，0 至 118；越多越好。
- rally-elements-v1：先得五分獲勝的有效遊戲時間，越短越好，暫停不計時。
- 提交必須帶符合該遊戲的 rules_version，缺少或不相符在取得寫入鎖前拒絕。不能把舊客戶端成績重新蓋成新版本。
- 伺服器鎖內重新比較；同成績保留先達成者。ISO UTC 時間由伺服器記錄，網站顯示台灣時間。
- 暱稱 1 至 20 字，拒絕公式開頭並以純文字顯示；分數及時間有基本範圍檢查，但不是伺服器重播驗證。
- 讀榜快取 records-v4，20 秒；無每幀連線或輪詢。候選進榜才提交，連線失敗仍可玩，不顯示假成功。

## 更新方式

Code.gs 為後端；Arcade.html 由 `node scripts/build_arcade.mjs` 從網站遊戲與 record-client.js 產生，不維護兩套遊戲。舊 Leaderboard.html 不再由 doGet 使用。

先跑本機檢查，再貼入現有 GAS 專案、儲存，在管理部署更新既有部署的版本，維持原 /exec 網址。主站只保存公開 URL，不保存憑證。修改欄位或規則時須同時更新客戶端與測試。

如需清除維護測試資料，先讀回並確認暱稱、時間與分頁，再只清指定測試列；不要套用舊版「清空 B:E」的單冠軍操作，也不要清空舊資料表。等待快取過期後重讀。

## 驗收

公開遊戲以正常操作完成元素蛇 1 個 H（1398ms）、彈跳球 5:1（34009ms），正常暱稱表單提交、成功 UI、新表讀回一致。僅清除兩筆驗收暱稱，保留既有 hi 的 9 元素與原時間，舊表不變。這是瀏覽器自動化遊玩，不是分數注入或真人手動測試。

本機測試另涵蓋各五名、同分先到、錯誤／缺少版本拒絕、舊表唯讀、合法資料遷移、輸入檢查、鎖釋放與連線失敗。詳見 [2.1 驗收證據](ACCEPTANCE_2.1.md)。