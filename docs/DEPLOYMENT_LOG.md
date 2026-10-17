# 部署紀錄

## 2.1.0：2026-10-18

- 基底為遠端 main `9d622a2b97238bcfb699635adfd4518fa0c519b2`，發布前重新讀取，不以備份 checkout 的舊 HEAD 覆寫。
- GAS 02:27 更新既有部署為第 6 版；Code.gs / Arcade.html 編輯器全選複製讀回與本機一致。
- 公開蛇 1 元素及球 5:1、34009ms 經正常遊玩、表單與 Sheets 讀回通過；測試兩列清理，合法玩家及舊表保留。
- 變更內容、逐項驗收與截圖：ACCEPTANCE_2.1.md。功能提交 `a6ecdff0f1a6991e9ba812a73425d2d8c78ba375`；[Actions 39059948073](https://github.com/ntusttjlab-design/TJLAB_website/actions/runs/39059948073) completed / success，全部生成檢查與部署步驟成功。正式 HTML 與本機逐字比對一致，7 個轉場及 2.1.0 資產標記確認。Google Sites 的 innerFrame 指向正式 Pages，框內也讀到 7 個轉場及 2.1.0 CSS。

此檔只記錄實際狀態；本機完成不代表已上線。

| 日期（台灣時間） | 版本／提交 | 狀態 | 證據與備註 |
| --- | --- | --- | --- |
| 2026-10-18 | 2.0.0 視覺收尾 / 43670953457cc0c9aec03ebb9c1d84a2c2d11336 / main | 部署成功 | 桌機正式站驗收發現石墨節點會蓋到材料名稱，已提高標籤層級並加深色底。[Actions 39056862332](https://github.com/ntusttjlab-design/TJLAB_website/actions/runs/39056862332) completed / success。功能、GAS 與書目保持前列驗收結果。 |
| 2026-10-18 | 2.0.0 / 3015d879a562e73d08361c0751a042aa02db1df3 / main | GitHub Pages 部署成功 | 經已授權 GitHub 連接器提交並以預期分支 SHA 更新 main，未強制推送。[Actions 39056434377](https://github.com/ntusttjlab-design/TJLAB_website/actions/runs/39056434377) completed / success。正式站確認 30 篇期刊、34 筆研討會、16 筆課程與 7 個研究方向；展開／分類／搜尋、390px 中英文、GAS 前五名讀榜／語言同步正常。Google 協作平台整頁嵌入已實際載入新版。 |
| 2026-10-17 | GAS v5 / 網站 2.0.0 | GAS 已部署並通過雲端資料驗收 | 原部署網址保留，第 5 版於 23:43 更新。23:33 的一次性試算表分頁測試通過兩款各五名、排序、同分先到、日期及錯誤處理，結束後清除測試分頁。主站確認元素遊戲、共用榜單、語言同步、自動高度，以及新局 H→He、暫停保留當局元素。GitHub Pages 尚待本輪提交部署。 |
| 2026-10-17 | 2.0.0 本機候選版 | 尚未部署 | 30／34 筆成果、三種獨立材料場景、元素遊戲與每款前五名已完成本機內容、語法與行為檢查。正式站及 GAS 仍是 1.4.0；本列不代表線上完成。 |
| 2026-10-17 | Codex Connector 授權修復 | 寫入物件驗證成功 | 擁有者 ntusttjlab-design 安裝 ChatGPT Codex Connector，僅選 TJLAB_website 並授予程式碼及工作流程讀寫。連接器仍登入 zhichiangai；建立 blob 成功，SHA 9948fc5a1f6b14332597ec343855b7147ec7b5c3。未更新 main、未新增部署；修復後的完整提交發布流程留待下次實際更新驗證。 |
| 2026-10-17 | 1.4.0 / dd2a571946028621f39a7d1c7dc0983c2bb4bf96 / main | GitHub Pages 部署成功 | 使用者透過 GitHub Desktop 推送；[Actions 39035342939](https://github.com/ntusttjlab-design/TJLAB_website/actions/runs/39035342939) completed / success。正式網站 HTTP 200，已確認載入 molecular-model.js、副教授英文職稱、arcade-embed.js 與已部署 GAS 網址。 |
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

`zhichiangai` 對 `ntusttjlab-design/TJLAB_website` 已確認 `pull=true`、`push=true`、`admin=false`。擁有者完成 Codex Connector 安裝後，連接器建立 blob 已成功。Desktop 已成功推送；命令列 Git 的非互動 dry-run 仍因無可用憑證失敗，三者登入狀態不能混為一談。完整後續流程見 MAINTENANCE_GUIDE.md 第 8 節。

## 發布方式

推送 main/master 或手動啟動 `.github/workflows/deploy.yml` 後：產生頁面 → 檢查內容及 JavaScript → 確認 index.html 與來源一致 → 打包 `_site` → GitHub Pages。1.4.0 已在上述 Actions 執行並成功；下列較早的受限紀錄保留作歷史，不代表目前仍受限。

## 每次部署需新增

日期、版本、完整 commit SHA、分支、Actions URL、成功／失敗結果、網站 URL、線上檢查結果、必要時的回復操作。失敗嘗試也要記錄，不能以預計完成時間代替結果。

## 回復方式

在既有 Git 歷史上以 revert 回復造成問題的提交並推送，讓部署流程重新執行。不要使用 force push 覆蓋歷史。若新流程本身失敗，先修正流程或回復其變更，確認成功的部署仍在服務。
