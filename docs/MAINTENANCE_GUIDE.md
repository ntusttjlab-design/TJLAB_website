# 網站維護手冊

## 1. 修改入口

先閱讀根目錄 README。`index.html` 是產物，請修改來源後重新產生。

| 內容 | 編輯位置 |
| --- | --- |
| 一般中英文文案與版面 | `content/site_template.html` |
| 研究方向與說明 | `scripts/build_site.py` 的 research |
| 期刊、研討會官網原文 | `raw_html/snapshots/2026-10-17/publication-and-presentation.html` 與 `scripts/build_publications.py` |
| 文獻呈現 | `scripts/build_publications.py`；保留官網原文，不另作書目翻譯 |
| 課程網址／英文名稱 | `content/all_links_and_media.json` 的 YouTubePlaylists |
| 課程中文名稱 | `scripts/build_site.py` 的 course_names，順序須與 JSON 一致 |
| 配色與響應式 | `assets/css/editorial.css`（新版視覺）與 `assets/css/style.css`（基礎） |
| 語言、搜尋、終端機、遊戲 | `assets/js/main.js` |
| 3D 示意 | `assets/js/molecule.js`、`material-scenes.js`、`molecular-model.js` |
| 元素順序與名稱 | `assets/js/elements.js` |
| 共用前五名 | `backend/google-apps-script/Code.gs`、`record-client.js`；執行 `scripts/build_arcade.mjs` 產生 `Arcade.html` |

## 2. 新增文獻

取得新的官網快照後，先調整 `scripts/build_publications.py` 的來源及數量，再產生完整原文。`content/publications.html` 為舊版來源封存，現在不再讀取。

保留標題、作者、期刊與年份及原始語言；不要猜測學生英文姓名或加入期刊指標。預設近期成果依年份排列，搜尋與分類會搜尋全部 64 筆。

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

目前優先使用已授權的 GitHub 連接器發布，帳號、安裝範圍與驗證證據見下方第 8 節。使用者已授權本專案的修改與部署；只有新增範圍或需要本人完成的登入／授權才另行確認。

使用者確認本機版後，才處理推送。沿用遠端既有提交歷史，排除 `.local-backups`、`_site` 等暫存資料。`scripts/package.ps1` 只複製 index.html 與 assets；不要改成上傳整個專案根目錄。

每次工作同步更新 TODO、PROGRESS、CHANGELOG；實際推送部署後才填寫 DEPLOYMENT_LOG 的提交及 Actions 結果。訪客的語言偏好與貪食蛇最高分存於瀏覽器，不會寫回 GitHub。

## 7. 首頁動態與訪客文案

首頁內容在 content/hero_story.html，捲動時間軸在 assets/js/story.js，3D 在 assets/js/molecule.js。使用者提供的 Google 試算表與後端草稿另見 LEADERBOARD_SETUP.md。維護核對、期刊指標說明與清單去重等工作資訊只放 MD，不放公開頁面。任何後端連接狀態都不得以假的分數或排行榜呈現。

## 8. GitHub 授權與後續更新方式（2026-10-17 確認）

- 連接器登入帳號：`zhichiangai`；儲存庫：`ntusttjlab-design/TJLAB_website`，分支 `main`。
- 儲存庫擁有者 `ntusttjlab-design` 已安裝 **ChatGPT Codex Connector**，選擇 **Only select repositories**，僅授權 `TJLAB_website`。
- 安裝畫面已確認包含 actions、code、issues、pull requests、workflows 的讀寫權限，以及 checks、commit statuses、metadata 的讀取權限。
- 原本帳號雖有 `push=true`，連接器建立 blob 與 Contents 更新仍回傳 `403 Resource not accessible by integration`。安裝到儲存庫擁有者帳號後，使用相同 `zhichiangai` 連接成功建立 blob，SHA 為 `9948fc5a1f6b14332597ec343855b7147ec7b5c3`。測試未變更分支或觸發部署；尚未以修復後連接器完成整輪提交、分支更新與部署。
- 後續流程：先取得遠端最新 main → 修改與驗證 → 以既有遠端歷史建立提交 → 檢查分支仍是預期版本後更新 main → 確認 Actions 成功 → 檢查正式網站 → 更新部署紀錄。遇到遠端新提交時先整合，不使用 force push。
- 成功建立 blob 是寫入權限恢復的證據，不能代替每次實際提交與部署驗證；不要承諾登入或權杖永不過期。
- GitHub Desktop、命令列 Git Credential Manager、GitHub 連接器是不同的認證來源。Desktop 已成功推送；命令列 Git 的非互動 dry-run 仍因無可用憑證失敗。不要從 Git `user.name` 推定登入帳號，不匯出或複製 Desktop 權杖。
- 優先沿用已授權連接器，不要求使用者重複登入或每次手動推送。GitHub Desktop 保留作備援；連接器授權不會自動讓本機 Git CLI 登入。
- 設定入口的實際路徑：應用程式設定 → 整合 → 外掛程式 → GitHub → 使用的應用程式中的 GitHub。不要以開啟本機「完整存取權限」處理 GitHub 的 403。
