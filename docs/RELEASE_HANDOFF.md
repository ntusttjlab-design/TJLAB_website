# 發布與驗收

## 2.0.0 正式發布（2026-10-18）

三段獨立材料場景、灰黑米白版面、七個研究方向示意、30／34 筆原文成果、分組課程與元素遊戲已完成。GAS 第 5 版沿用既有專案／公開網址／試算表；雲端實測每款五名、排序、同分先到、時間與錯誤處理通過，測試分頁已移除。主站與遊戲語言同步、嵌入高度、手機簡化動態及暫停操作已確認。

GitHub 連接器已完成提交 `3015d879a562e73d08361c0751a042aa02db1df3` 與 main 更新；[Actions 39056434377](https://github.com/ntusttjlab-design/TJLAB_website/actions/runs/39056434377) 成功。正式網站及 Google 協作平台入口已驗收，詳見 [驗收對照](ACCEPTANCE_2.0.md) 與 [部署紀錄](DEPLOYMENT_LOG.md)。以下為 1.4.0 的歷史交接資料。

更新日期：2026-10-17。

## 1.4.0 歷史狀態

網站改版、科學分子模型、老師原圖與副教授職稱、雙語及手機版已完成本機檢查。GAS 已公開部署，真實貪食蛇 4 DP 寫入及試算表讀回通過，測試冠軍已清空。彈跳球尚待真人獲勝回合的雲端驗收。

1.4.0 已由 GitHub Desktop 推送，提交 `dd2a571946028621f39a7d1c7dc0983c2bb4bf96`，Actions 39035342939 部署成功；正式網站已確認提供新版資產。之後擁有者完成 ChatGPT Codex Connector 安裝，`zhichiangai` 連接器建立 blob 已成功，原先 403 限制已解除。

後續優先透過連接器提交更新並驗證部署，不必每次由使用者操作 Desktop。完整帳號與授權方式見 [維護手冊第 8 節](MAINTENANCE_GUIDE.md)。以下本機 Git 指令僅保留作備援；連接器登入不等於命令列 Git 已登入。

## 從自己的 Git 完成發布

已準備好的 Git 發布副本位於 `E:\tjlab_website\.local-backups\publish-checkout`，不是沒有 Git 歷史的專案根目錄。請在自己的 Windows PowerShell 執行：

```powershell
git -C E:\tjlab_website\.local-backups\publish-checkout status --short
git -C E:\tjlab_website\.local-backups\publish-checkout push origin main
```

若 Git 要求驗證，使用有專案寫入權限的 `zhichiangai` 完成 Git Credential Manager 驗證；這是電腦的 Git 憑證，不需要使用 Codex 瀏覽器。GitHub 網頁登入與 ChatGPT 的 GitHub 連接不會自動成為本機 Git 憑證。不要在對話貼密碼或權杖。

若遠端有新提交而拒絕推送，先檢查遠端變更並整合，不使用 force push。

推送成功後，在 [GitHub Actions](https://github.com/ntusttjlab-design/TJLAB_website/actions) 確認本次 `Deploy to GitHub Pages` 全部成功，並將提交 SHA、執行網址與結果寫回 `DEPLOYMENT_LOG.md`。

## 發布後驗收

1. 開啟 [GitHub Pages](https://ntusttjlab-design.github.io/TJLAB_website/)，重新整理；首頁應出現「多尺度模擬與熱力學實驗室」及明確苯環鍵結的球棍模型。
2. 向下捲動檢查三段首頁動畫、電場示意的旋轉／縮放／暫停，以及減少動態設定。
3. 主持人區確認「林子仁」、「副教授／Associate Professor」及原站圖片。切換英文並以手機寬度確認內容不超出畫面。
4. 開啟 [Google 協作平台入口](https://sites.google.com/view/tjlab/tjlab)，確認既有嵌入顯示相同新版；不必更改原本指向 GitHub Pages 的網址。
5. 遊戲區讀取共用最高紀錄。完成貪食蛇新高分，應在回合結束後才詢問暱稱，儲存成功後顯示暱稱、成績與時間。從另一個瀏覽器讀取確認一致。
6. 完成彈跳球獲勝回合，確認紀錄為最快獲勝時間，較慢或同分不覆寫冠軍；暫停時間不計入成績。
7. 在 [試算表](https://docs.google.com/spreadsheets/d/1DyZMK0cQe0eMIpvAofCX-JpzEL4nQxKDzsjSVEcpiUw/edit) 的 `MSMTJL_Records` 核對兩筆紀錄。這是 Google Apps Script／Google 試算表服務，並非 Google Ads。

測試紀錄清理前先確認不會刪到真正玩家的冠軍。網路故障時遊戲應仍可玩，介面不可提前顯示已上榜。
