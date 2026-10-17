# 部署紀錄

此檔只記錄實際狀態；本機完成不代表已上線。

| 日期（台灣時間） | 版本／提交 | 狀態 | 證據與備註 |
| --- | --- | --- | --- |
| 2026-10-17 | 1.4.0 / 發布副本已提交 | GitHub 連接器寫入受限 | 已連接帳號再次確認為 zhichiangai，儲存庫 push=true；建立 blob 與一般 Contents 更新均回傳 403 Resource not accessible by integration，沒有變更遠端。依使用者要求停止 Codex 瀏覽器登入；網站尚未上線新版。後續發布與驗收步驟見 RELEASE_HANDOFF.md。 |
| 2026-10-17 | 1.4.0 / 本機提交 a6dd8ea，尚未推送 | 發布等待Git登入 | GitHub連接器建立blob回傳403 Resource not accessible by integration；改用獨立Git發布副本，已完成提交。非互動push回報無登入憑證，已開啟Git Credential Manager裝置登入，等待使用者確認。後續修正會更新本機提交。 |
| 2026-10-17 | GAS v1 | 匿名入口驗收通過 | 不帶瀏覽器Cookie的HTTP請求回傳200，內容是userCodeAppPanel而非登入頁；真實4DP寫入紀錄已清空並讀回確認兩遊戲皆空白。 |
| 2026-10-17 | GAS v1 / 網站1.4.0準備發布 | GAS已部署，網站待推送 | 使用者明確確認匿名公開與研究室身分執行，自行完成Google授權；真實4 DP提交與試算表讀回通過，測試紀錄已清空。 |
| 2026-10-17 | 1.3.1 電場互動恢復版，無提交編號 | 本機完成；GAS 草稿已存 | 新增獨立分子電場互動，瀏覽器可預覽；GAS 專案兩檔已儲存核對，未執行、授權或公開部署，網站尚未接上共用榜。 |
| 2026-10-17 02:50 | `9f176cdd04b88ee5a9970eb842dc8eb5b656b02b` | 既有部署成功 | [Actions 38950402933](https://github.com/ntusttjlab-design/TJLAB_website/actions/runs/38950402933)，先前唯讀查詢確認 success；公開網站 HTTP 200。這是舊版。 |
| 2026-10-17 | 1.2.0 本機驗收版，無提交編號 | 尚未部署 | 淺色、雙語、16 個課程、遊戲修正與文件更新；本輪沒有 commit、push 或觸發部署。 |
| 2026-10-17 | 1.2.1 官網核對本機版，無提交編號 | 尚未部署 | 依官網補完整經歷年月、授課名稱，校正量子化學網址；16 筆資源連結對應15個不同清單。 |
| 2026-10-17 | 1.3.0 動畫與訪客文案本機版，無提交編號 | 尚未部署 | 已加入 GSAP 首頁及清理公開維護說明；Google 試算表專用分頁已建立，Apps Script 尚未部署。 |

## 已確認的權限

`zhichiangai` 對 `ntusttjlab-design/TJLAB_website` 已於本對話後續查詢確認 `pull=true`、`push=true`、`admin=false`。這不代表本機 Git CLI 已登入；CLI 認證尚未驗證。

## 發布方式

推送 main/master 或手動啟動 `.github/workflows/deploy.yml` 後：產生頁面 → 檢查內容及 JavaScript → 確認 index.html 與來源一致 → 打包 `_site` → GitHub Pages。尚未在 GitHub 執行本輪新增的檢查步驟。

## 每次部署需新增

日期、版本、完整 commit SHA、分支、Actions URL、成功／失敗結果、網站 URL、線上檢查結果、必要時的回復操作。失敗嘗試也要記錄，不能以預計完成時間代替結果。

## 回復方式

在既有 Git 歷史上以 revert 回復造成問題的提交並推送，讓部署流程重新執行。不要使用 force push 覆蓋歷史。若新流程本身失敗，先修正流程或回復其變更，確認成功的部署仍在服務。
