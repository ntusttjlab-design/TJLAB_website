# Google 試算表最高紀錄服務

更新日期：2026-10-17。2.0.0 前五名版本已部署至既有公開網址；指定試算表實際讀寫、排序、同分先到及錯誤輸入測試通過。

## 已部署資源

- [公開遊戲與最高紀錄](https://script.google.com/macros/s/AKfycbyRZxGSqJSSxOFhRZMFIfw5SUisX_PRHwzgLF0lUmIgEROdrOsHkE2koX3nATMIJGDZ/exec)
- [GAS 編輯器](https://script.google.com/home/projects/1gI_IUOdCPgtig0U4XoBbcPA4bv0un-fhGe0t2FCaCDzNZ_7k3h3bS0jl/edit)
- [指定試算表](https://docs.google.com/spreadsheets/d/1DyZMK0cQe0eMIpvAofCX-JpzEL4nQxKDzsjSVEcpiUw/edit)
- 網站入口：https://sites.google.com/view/tjlab/tjlab（整頁嵌入 GitHub Pages）。

使用者已明確確認：以研究室帳號執行，所有人（含未登入訪客）可使用公開紀錄服務，並自行完成 Google 授權。

## 資料與規則

2026-10-17 23:33 的 Apps Script 執行記錄確認：一次性分頁中的兩款遊戲各五名、排序、同分先到、伺服器日期與拒絕公式暱稱均通過。分頁在 `finally` 清除；正式 `MSMTJL_Records` 未放入測試資料。GAS 第 5 版於 23:43 更新，公開頁與主站實測語言同步、新局換元素及暫停正常。編輯器驗收截圖只保留於本機，不上傳 GitHub。

只操作 `MSMTJL_Records` 的 A1:F11。欄位為 game_id、nickname、score、duration_ms、recorded_at、rules_version。每款遊戲最多五筆，不保存遊玩過程、玩家識別碼或登入帳號。

- snake-elements-v1：依原子序收集的元素數，最多 118；舊 DP 紀錄不混入新版榜單。
- rally-elements-v1：先得5分獲勝的有效遊戲時間，越短越佳；暫停不計時。
- 每款遊戲最多五筆；同成績位於榜單邊界時保留先達成者。
- 日期由伺服器產生 ISO UTC，公開畫面換算台灣時間。
- 只有遊戲結束且可進前五名，才詢問公開暱稱；伺服器在鎖內重新排序，決定是否寫入。
- 暱稱限1至20字中英文字、數字與部分符號；拒絕公式開頭，畫面以純文字呈現。
- 遊戲時間及分數只有基本格式／範圍檢查，不等同伺服器重播驗證或完整防作弊。匿名服務仍受 Google 配額限制。
- 原工作表1未改動。MSMTJL_Scores 是舊送審草稿使用的空表，現行程式不讀寫；MSMTJL_Games／Setup 為維護說明。

## 程式與更新

`Code.gs` 是後端，`Arcade.html` 是前端。前端由 `node scripts/build_arcade.mjs` 從同一份網站遊戲程式與 `record-client.js` 產生，不另維護兩套遊戲。

GAS 專案裡舊 `Leaderboard.html` 不再被 doGet 使用。本機舊檔已移到本機備份；現行檔名為 Arcade。

修改後先執行本機檢查，再把 Code.gs／Arcade.html 更新到既有專案，儲存；在「管理部署作業」更新既有部署版本，可維持 `/exec` 網址。網站只在 `assets/js/arcade-config.js` 保存公開網址，不保存憑證。

主站延遲載入 GAS iframe；讀取紀錄每次開啟一次、快取20秒，沒有輪詢；提交只在候選破紀錄時發生。連線失敗不阻止遊玩，也不顯示儲存成功。

若管理者要重置某個遊戲，只清除該列 B:E，保留 A 的遊戲名稱與 F 的版本；重新讀取可能需等待20秒快取。此操作會移除目前冠軍，平常不要清空。

## 驗收證據

真實操作公開遊戲得到4 DP，填暱稱「網站驗收」後出現「最高紀錄已儲存」，試算表讀回4、5026ms及伺服器日期。驗收完已清除這筆測試冠軍，保留兩個遊戲空白紀錄位置。

本機測試涵蓋兩遊戲比較方向、同分保留、固定資料範圍、輸入拒絕、鎖釋放及公開欄位。彈跳球雲端獲勝回合尚未真人完成，未把本機測試說成該遊戲雲端獲勝驗收。

截圖：[GAS 部署](screenshots/2026-10-17-gas-deployed.jpg)、[真實寫入](screenshots/2026-10-17-live-record-saved.jpg)。
