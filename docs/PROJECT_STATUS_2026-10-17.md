# 網站對話接續與專案檢查紀錄

> 本檔保留初次接續時的歷史快照，包含當時尚未授權的 GitHub 權限。後續已確認 `zhichiangai` 有寫入權限，且已完成本機改版；最新狀態請看 [PROGRESS.md](PROGRESS.md)、[TODO.md](TODO.md) 與 [DEPLOYMENT_LOG.md](DEPLOYMENT_LOG.md)。

檢查日期：2026-10-17（台灣時間）

## 範圍與來源

- 對話：Antigravity `c9b75ad1-2125-4a6b-a059-e5e91529f681`，標題為 Website Redesign And Organization Plan。
- 以唯讀 SQLite 連線擷取可辨識訊息文字；包含圖片的回合未逐張解讀，因此不把圖片內容當成已確認需求。
- 本機專案：`E:\tjlab_website`。
- GitHub：https://github.com/ntusttjlab-design/TJLAB_website
- 線上網站：https://ntusttjlab-design.github.io/TJLAB_website/
- 本次確認的是這一個網站及其備份、文件、部署設定；未宣稱已檢查電腦上的所有其他專案。

## 先前需求與最後進度

1. 保存舊 Google Sites 的五個頁面、文字、圖片及教學連結，整理於專案目錄。
2. 建立有趣、學生容易理解、能吸引新成員的實驗室網站。
3. 採用 HTML、CSS、JavaScript 靜態網站，透過 GitHub Pages 部署。
4. 建立 README、CHANGELOG 及維護手冊。
5. 論文直接完整往下閱讀，提供搜尋與研究主題篩選；加入貪食蛇及排球遊戲。
6. 最後一輪已同意開始：淺色背景、符合台灣用語的介紹、老師名字用「林子仁」、學生保留英文姓名、中英文切換、增加耐玩且可記錄最高分的遊戲；先在本機確認。

最後一輪僅見檢查檔案，隨後出現 HTTP 429 / RESOURCE_EXHAUSTED 額度錯誤。未見這輪完成寫入的紀錄，實際檔案亦仍為深色版本。

## 本機現況與待辦

| 項目 | 確認結果 | 待辦 |
| --- | --- | --- |
| 舊站備份 | 五份 raw_html、內容 Markdown、九張 PNG 及媒體 JSON 已存在 | 尚未逐項核實舊站所有內容與外部連結有效性 |
| 視覺 | 深色背景仍存在 | 改淺色並驗證文字對比與手機版 |
| 台灣用語 | 仍有「探索 7 大研究」「計算武器庫」「白話講人話」等 | 依最後需求重寫並檢查研究介紹的準確性 |
| 姓名 | 主持人為林子仁；部分學生仍帶中文姓名 | 依來源保留學生英文姓名；無英文來源者需確認拼寫 |
| 雙語 | 未找到語言切換控制或翻譯機制 | 補繁中／英文切換及偏好記憶 |
| 期刊 | 19 張卡片，無需展開按鈕 | 尚未逐筆核實作者、DOI、年份及期刊指標 |
| 研討會 | 18 張卡片 | 與文件宣稱 20+ 筆核對，不應直接補造資料 |
| 課程 | 頁面 8 個不同播放清單；宣稱 12 套 | 核對清單，備份中至少兩個播放清單未出現在頁面 |
| 遊戲 | 貪食蛇與人機排球程式已存在；貪食蛇以 localStorage 儲存最高分 | 2048／節奏遊戲仍只有提案；跨裝置排行榜未實作；實際操作及手機觸控待驗證 |
| 頭像 | 學術模式切換至 Unsplash 外部人像網址 | 換成已確認的老師照片，或移除該替代人像 |
| 相簿 | 只有規劃文件 | 尚無活動相簿；需要真實照片 |
| 維護文件 | README、CHANGELOG、維護手冊存在 | 數量宣稱不一致；論文模板使用 pub-item，而實作篩選器抓 pub-card，新增卡片可能不參與篩選 |
| 外部依賴 | 使用 Tailwind CDN、Lucide latest、Three.js CDN、Google Fonts | 正式發布前確認載入穩定性；目前並非完全離線網站 |

## 已完成的檢查

- `assets/js/main.js` 與兩段 inline JavaScript 均通過 `node --check`。
- HTML 引用的本機資源與非空錨點均存在，未發現重複 ID。
- 媒體 JSON 可解析。
- 未發現以 .env、.pem、.key、credentials、token、secret 命名的專案檔案；此為檔名檢查，不等同完整機密掃描。
- 未做瀏覽器互動、視覺、手機及所有外部連結的完整驗收。

## GitHub 與部署狀態

- 本機目錄沒有 `.git`，不能直接在此執行正常 commit / push 流程。
- 遠端存在 main 分支，檢查時提交為 `9f176cdd04b88ee5a9970eb842dc8eb5b656b02b`。
- 最近 GitHub Actions 部署成功：https://github.com/ntusttjlab-design/TJLAB_website/actions/runs/38950402933
- 公開網站回應 HTTP 200，頁面 63,727 bytes，尚無 snake-canvas；與本機遊戲版本不同。
- 與遠端 Git blob SHA 按位元組比較，以下九個本機檔案不同：CHANGELOG.md、README.md、assets/css/style.css、assets/js/main.js、content/01_homepage.md、content/02_pi_intro.md、content/04_tutorial_resources.md、content/all_links_and_media.json、index.html。此比較包含任何換行差異，不代表每檔都有實質內容修改。
- 目前 GitHub 連接器帳號為 `zhichiangai`；對 `ntusttjlab-design/TJLAB_website` 的 permissions 為 pull=true、push=false、admin=false。
- 此連接器目前不能直接寫入該儲存庫。本機其他 Git 登入狀態尚未驗證，不能據此斷言所有管道都無寫入權限。

## 接續順序

1. 在本機完成最後一輪已同意的改版，核對文獻與課程數量，排除替代人像及失真的文案。
2. 瀏覽器驗收桌機、手機、雙語、搜尋及遊戲。
3. 讓有權限的 GitHub 帳號連接，或由擁有者授予目前帳號寫入權限。
4. 基於遠端既有歷史建立本機 Git 關聯，檢視差異後提交；避免以全新歷史覆蓋遠端。
5. 推送後檢查 Actions 結果與實際線上頁面。

本次只新增此檢查紀錄，未修改網站功能，未推送或變更遠端。
