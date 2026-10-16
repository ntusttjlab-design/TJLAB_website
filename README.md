# 台科大材料系 多尺度模擬與熱力學實驗室 (Multi-Scale Modeling LAB @ NTUST)
> 本專案為林子敬教授實驗室官方新版網站原始碼與資源庫，支援純靜態開箱即用與 GitHub Pages 全自動部署。

---

## ⚡ 快速預覽 (Quick Preview)

本專案採用**零依賴架構 (Zero-Build Vanilla)**，本機不需安裝 Node.js 或任何繁瑣環境：
* **直接點開**：在檔案總管中雙擊 [`index.html`](./index.html)，即可在任何瀏覽器中體驗完整的 3D 旋轉分子模型、Linux 終端機彩蛋與論文篩選系統。

---

## 📂 完整專案結構 (Project Structure)

```text
e:/tjlab_website/
├── index.html                               # 網站核心單頁入口 (支援響應式、3D WebGL、終端機)
├── README.md                                # 專案導覽說明（本檔案）
├── CHANGELOG.md                             # 網站更新紀錄 (遵循語意化版本與 Keep a Changelog)
├── .gitignore                               # Git 忽略設定
│
├── .github/
│   └── workflows/
│       └── deploy.yml                       # GitHub Pages 自動化 CI/CD 部署設定檔
│
├── assets/                                  # 核心前端資產
│   ├── css/
│   │   └── style.css                        # 玻璃擬態、光暈文字、霓虹按鈕與終端機動效樣式
│   ├── js/
│   │   └── main.js                          # Three.js 3D 分子震盪、Linux 終端機解譯、即時搜尋過濾
│   └── images/                              # 實驗室圖片庫 (9 張原始圖檔已標準化小寫命名)
│       ├── homepage_img_1.png               # 多尺度模擬光譜圖 (1 Å ~ 50 nm)
│       ├── homepage_img_2.png               # 軟體群 (LAMMPS, GROMACS, Gaussian, Materials Studio)
│       ├── homepage_img_3.png ~ img_8.png   # CP2K, xTB, CASTEP, scikit-learn, RDKit, NumPy
│       └── pi-intro_img_1.png               # PI 迷因頭像 (金正恩演說彩蛋)
│
├── content/                                 # 結構化內容與資料庫備份
│   ├── 01_homepage.md                       # 首頁研究主軸與工具備份
│   ├── 02_pi_intro.md                       # 主持人學經歷與開課影片備份
│   ├── 03_publications_and_presentations.md  # 完整 19 篇期刊與歷年研討會紀錄
│   ├── 04_tutorial_resources.md             # 量子化學與分子動力學講義整理
│   ├── 05_gallery.md                        # 相簿未來規劃指引
│   └── all_links_and_media.json             # 所有 YouTube 播放清單與媒體連結對應表
│
├── docs/                                    # 開發與維護手冊
│   └── MAINTENANCE_GUIDE.md                 # 網站維護 SOP (如何新增 Paper、成員、照片與除錯)
│
└── raw_html/                                # 原始 Google Sites 5 個頁面之 UTF-8 HTML 原始碼備份
```

---

## 🛠️ 維護與更新指引 (Maintenance Guides)

實驗室新進成員或管理者進行更新時，請參考以下文件：
* **[網站更新紀錄 (CHANGELOG.md)](./CHANGELOG.md)**：檢視目前版本歷程與待開發計畫。
* **[網站維護手冊 (docs/MAINTENANCE_GUIDE.md)](./docs/MAINTENANCE_GUIDE.md)**：包含「如何新增論文」、「如何更新開課影片」、「如何綁定學校網址」等標準 SOP。

---

## 🌐 專案與部屬網址 (Project & Live URLs)
* **GitHub 倉庫**: [https://github.com/ntusttjlab-design/TJLAB_website](https://github.com/ntusttjlab-design/TJLAB_website)
* **GitHub Pages 上線網址**: [https://ntusttjlab-design.github.io/TJLAB_website/](https://ntusttjlab-design.github.io/TJLAB_website/)
* **原始 Google Sites 舊站**: [https://sites.google.com/view/msmtjl/homepage](https://sites.google.com/view/msmtjl/homepage)
* **林子敬老師 YouTube 教學頻道**: [https://www.youtube.com/user/sdd3390](https://www.youtube.com/user/sdd3390)