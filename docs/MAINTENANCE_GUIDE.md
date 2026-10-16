# 實驗室網站維護與更新手冊 (Maintenance & SOP Guide)

> **致未來的實驗室網站維護者（學弟妹或研究助理）**：  
> 本手冊旨在讓任何沒有深入前端開發背景的實驗室成員，都能在 **5 分鐘內** 輕鬆完成論文更新、成員修改、相簿發布與部署。

---

## 目錄 (Table of Contents)
1. [專案目錄結構速查](#1-專案目錄結構速查)
2. [SOP 1: 如何新增一篇論文發表](#2-sop-1-如何新增一篇論文發表)
3. [SOP 2: 如何新增實驗室成員或更新 PI 資訊](#3-sop-2-如何新增實驗室成員或更新-pi-資訊)
4. [SOP 3: 如何在相簿 (Gallery) 新增活動照片](#4-sop-3-如何在相簿-gallery-新增活動照片)
5. [SOP 4: 如何更新 YouTube 開課影片](#5-sop-4-如何更新-youtube-開課影片)
6. [SOP 5: 推送至 GitHub Pages 檢核清單 (Pre-Push Checklist)](#6-sop-5-推送至-github-pages-檢核清單)
7. [常見問題排解 (Troubleshooting)](#7-常見問題排解)

---

## 1. 專案目錄結構速查

```text
e:/tjlab_website/
├── index.html                  # 網站核心頁面（所有視覺與卡片均在此檔）
├── CHANGELOG.md                # 網站版本更新紀錄（每次更新請在此登記）
├── README.md                   # 專案說明與索引
│
├── assets/                     # 靜態資源
│   ├── css/style.css           # 樣式表（深色主題、玻璃擬態、終端機動效）
│   ├── js/main.js              # 互動腳本（3D 分子、終端機、論文過濾）
│   └── images/                 # 圖檔庫（所有圖片請放此處，小寫檔名）
│
├── content/                    # 文本資料庫（方便閱讀、備份與未來擴充）
│   ├── 01_homepage.md          # 首頁文字備份
│   ├── 02_pi_intro.md          # PI 簡介與開課清單
│   ├── 03_publications_and_presentations.md  # 完整論文發表明細
│   └── all_links_and_media.json# 結構化資料庫
│
├── docs/                       # 維護文件庫
│   └── MAINTENANCE_GUIDE.md    # 本操作手冊
│
└── .github/workflows/          # 自動化 CI/CD
    └── deploy.yml              # GitHub Pages 自動部署腳本
```

---

## 2. SOP 1: 如何新增一篇論文發表

當實驗室有新論文 Accepted 或研討會發表時，只需修改 `index.html` 中的 `#publications` 區塊：

### 步驟：
1. 用文字編輯器（如 VS Code、Notepad++）打開 `index.html`。
2. 搜尋關鍵字 `<!-- Paper 1 -->`，找到論文卡片列表。
3. 複製一個卡片模板，貼在最上方，並替換內容：

```html
<!-- 新論文卡片模板 -->
<div class="pub-item glass-panel p-5 rounded-xl border border-slate-800/90" data-category="polyimide dft">
    <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-900/40 text-cyan-300 border border-cyan-800/50">2026 最新發表</span>
            <span class="text-xs font-mono text-slate-400">Journal Name, Volume, Page</span>
        </div>
        <span class="text-xs font-mono text-emerald-400 font-bold">First Author: 學生姓名 (學生)</span>
    </div>
    <h4 class="text-sm sm:text-base font-bold text-white leading-snug">
        "Paper Title Here"
    </h4>
    <p class="text-xs text-slate-400 mt-1">Author 1, Author 2, <strong>Tzu-Jen Lin*</strong></p>
</div>
```

> **注意**：`data-category` 屬性決定標籤過濾（例如填寫 `polyimide`、`dft`、`catalysis`、`student` 等）。

4. 同步將論文記錄追加到 `content/03_publications_and_presentations.md` 中備份。

---

## 3. SOP 2: 如何新增實驗室成員或更新 PI 資訊

若要更新辦公室分機、Email、或是未來新增專屬的「成員名冊（Members）」：
1. 打開 `index.html`，搜尋 `#pi` 區塊。
2. 若要更新頭像：將新照片丟到 `assets/images/`（例如 `pi_photo_new.jpg`），並將 `img src="./assets/images/..."` 改為新檔名。
3. 若要切換迷因模式：在 `index.html` 底部 `<script>` 中可自訂切換的圖片 URL。

---

## 4. SOP 3: 如何在相簿 (Gallery) 新增活動照片

1. 將聚餐、研討會或機器設備照片縮小尺寸（建議長邊不大於 1600px，寬高比 16:9 或 4:3 最佳，以維持載入速度）。
2. 將照片存入 `assets/images/`，命名例如：`event_2026_twiche.jpg`。
3. 在 `index.html` 的合適位置加入圖片卡片。

---

## 5. SOP 4: 如何更新 YouTube 開課影片

林老師若有新的工數或計算模擬影片上傳：
1. 取得該 YouTube 播放清單的網址（Playlist URL）。
2. 打開 `index.html` 搜尋 `#tutorials` 區塊。
3. 找到對應的卡片，替換 `href="https://www.youtube.com/playlist?list=..."` 即可。

---

## 6. SOP 5: 推送至 GitHub Pages 檢核清單

每次修改完成並準備推上 GitHub 前，請依照以下檢查清單逐一確認：

- [ ] **1. 本機雙擊測試**：在檔案總管雙擊 `index.html`，確認瀏覽器排版無跑版、無破圖。
- [ ] **2. 檢查相對路徑**：所有圖片、CSS、JS 路徑必須以 `./` 或相對路徑開頭（如 `./assets/images/...`），**切勿使用 `/assets/...`（絕對路徑在 GitHub Pages 會破圖）**。
- [ ] **3. 英文檔名大小寫**：所有圖檔檔名一律使用小寫英數字（如 `photo.png`，不要用 `Photo.PNG`）。
- [ ] **4. 更新 Changelog**：在 `CHANGELOG.md` 頂端寫上一句簡短紀錄（如 `## [1.0.1] - 2026-11-01 新增 2026 TwIChE 得獎論文`）。
- [ ] **5. 推送上傳**：
  - 若使用 **GitHub Desktop**：按 Commit to main -> Push origin。
  - 若使用 **網頁端上傳**：將修改後的檔案拖入 GitHub 倉庫覆蓋，點 Commit。
- [ ] **6. 線上確認**：靜待 30~60 秒後，打開網站網址，按 `Ctrl + Shift + R` 強制重新整理確認更新成功。

---

## 7. 常見問題排解 (Troubleshooting)

### Q1: 為什麼上傳後圖片全部顯示叉叉（破圖）？
* **A**: 99% 是因為路徑寫成了 `/assets/...`（絕對路徑）。請改為 `./assets/...`。
* 另一個原因是圖片副檔名大小寫不合（例如檔案是 `.PNG` 但代碼寫 `.png`，Linux 伺服器會找不到）。

### Q2: 為什麼我 push 之後網頁還是舊的？
* **A**: 瀏覽器有本機快取。請在網頁上按下鍵盤快捷鍵：
  * **Windows**: `Ctrl + Shift + R` 或 `Ctrl + F5`
  * **Mac**: `Cmd + Shift + R`

### Q3: 如何綁定學校網域（例如 `msm.mse.ntust.edu.tw`）？
1. 向台科大計中申請 DNS 設定，新增一筆 CNAME 紀錄指向 `ntusttjlab-design.github.io`。
2. 在專案根目錄新增一個純文字檔，檔名為 `CNAME`（無副檔名），裡面只寫一行：`msm.mse.ntust.edu.tw`。
3. 推上 GitHub，GitHub 會在幾分鐘內自動完成 SSL 安全連線設定。
