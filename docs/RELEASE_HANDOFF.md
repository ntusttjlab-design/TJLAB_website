# 1.4.0 發布與驗收

更新日期：2026-10-17。

## 目前狀態

網站改版、科學分子模型、老師原圖與副教授職稱、雙語及手機版已完成本機檢查。GAS 已公開部署，真實貪食蛇 4 DP 寫入及試算表讀回通過，測試冠軍已清空。彈跳球尚待真人獲勝回合的雲端驗收。

GitHub 連接帳號為 `zhichiangai`，專案權限包含 `push=true`；但連接器建立 blob 和 Contents 更新都回傳 `403 Resource not accessible by integration`，本輪沒有推送到遠端。因此公開網站仍是舊版。已停止 Codex 瀏覽器 GitHub 登入流程。

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
