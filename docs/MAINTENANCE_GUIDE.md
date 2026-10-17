# 網站維護手冊

## 1. 修改入口

先閱讀根目錄 README。`index.html` 是產物，請修改來源後重新產生。

| 內容 | 編輯位置 |
| --- | --- |
| 一般中英文文案與版面 | `content/site_template.html` |
| 研究方向與說明 | `scripts/build_site.py` 的 research |
| 期刊、研討會原始卡片 | `content/publications.html` |
| 文獻姓名／文字翻譯 | `scripts/build_site.py` 的 translations |
| 課程網址／英文名稱 | `content/all_links_and_media.json` 的 YouTubePlaylists |
| 課程中文名稱 | `scripts/build_site.py` 的 course_names，順序須與 JSON 一致 |
| 配色與響應式 | `assets/css/style.css` |
| 語言、搜尋、終端機、遊戲 | `assets/js/main.js` |
| 3D 示意 | `assets/js/molecule.js` |

## 2. 新增文獻

在 `content/publications.html` 複製相同類型的 `.pub-card`。`data-category` 使用空白分隔，例如 `polyimide energy`；研討會一定包含 `conference`。產生器會自動為其餘卡片補上 `journal` 類別。

保留標題、作者、期刊與年份；新增中文文字時，同步加入 translations 的中英文對應。不要自行猜測學生英文姓名或填入無來源的期刊指標。

新增資料後，更新 `scripts/build_site.py` 與 `scripts/check_site.py` 的預期數量，以及模板中的收錄說明。數量斷言是刻意設置的資料遺失檢查，不能只刪除斷言以通過驗證。

## 3. 雙語文案

模板中寫 `[[繁體中文||English]]`。產生器會輸出安全編碼的文字欄位。不要在該語法中放 HTML；結構標籤寫在語法外面。英文學術書目原文維持原文；中文報告英文譯題需在核對官方資料後更新。

## 4. 重新產生與驗證

在 Windows 主機端，以提升權限的 PowerShell 執行根目錄 README 中的兩個 WSL 指令。既有 conda 路徑為 `/home/ubuntu/miniconda3/envs/codex_conda_base/bin/python`。全部 Python 程式僅使用標準函式庫；不要直接改用 Windows Python，也不要安裝套件。WSL 無法啟動時保留完整錯誤並停止該步。

接著執行 `node --check assets/js/main.js`、`node --check assets/js/molecule.js` 與 `node scripts/check_interactions.mjs`。使用 `node scripts/preview.mjs` 啟動預覽，驗收繁中／英文、搜尋分類、無結果提示、兩款遊戲、暫停與手機操作。驗收完按 Ctrl+C 停止；本次驗收用的伺服器會在交付時停止，之後需要時可重新啟動。

## 5. 圖片與相簿

圖檔使用小寫檔名、相對路徑及有意義的替代文字。老師照片需確認身分及使用權；不要以圖庫人像替代。現在以姓名縮寫圖形呈現。原始迷因圖仍保留供追溯，不在新版頁面當作老師照片。

活動照片尚未提供，沒有自動產生相簿。新增時先確認可公開內容，再於模板新增區塊並驗收手機排版。

## 6. 部署與紀錄

使用者確認本機版後，才處理推送。沿用遠端既有提交歷史，排除 `.local-backups`、`_site` 等暫存資料。`scripts/package.ps1` 只複製 index.html 與 assets；不要改成上傳整個專案根目錄。

每次工作同步更新 TODO、PROGRESS、CHANGELOG；實際推送部署後才填寫 DEPLOYMENT_LOG 的提交及 Actions 結果。訪客的語言偏好與貪食蛇最高分存於瀏覽器，不會寫回 GitHub。

## 7. 首頁動態與訪客文案

首頁內容在 content/hero_story.html，捲動時間軸在 assets/js/story.js，3D 在 assets/js/molecule.js。使用者提供的 Google 試算表與後端草稿另見 LEADERBOARD_SETUP.md。維護核對、期刊指標說明與清單去重等工作資訊只放 MD，不放公開頁面。任何後端連接狀態都不得以假的分數或排行榜呈現。
