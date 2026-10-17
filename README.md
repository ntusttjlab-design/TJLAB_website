# 多尺度模擬與熱力學實驗室 · NTUST

林子仁老師研究團隊的靜態網站。現有資料收錄 30 篇期刊、34 筆研討會紀錄、16 筆教學資源連結（15 個不重複播放清單），支援繁中／英文切換、文獻搜尋與兩個元素遊戲。

目前狀態：**2.0.0 本機候選版已完成自動檢查；正式站仍是 1.4.0。** 新版 GAS 與 GitHub Pages 尚待發布及線上驗收，詳見 [目前進度](docs/PROGRESS.md) 與 [部署紀錄](docs/DEPLOYMENT_LOG.md)。

入口：[Google 協作平台](https://sites.google.com/view/tjlab/tjlab) · [GitHub Pages](https://ntusttjlab-design.github.io/TJLAB_website/)。

## 預覽

直接開啟 `index.html` 即可使用核心內容。需使用本機伺服器時，在專案目錄執行：

```powershell
node scripts/preview.mjs
```

開啟 http://127.0.0.1:4173 。按 Ctrl+C 停止。無需安裝 npm 套件。3D 示意使用外部 Three.js；無法載入或不支援 WebGL 時會顯示靜態示意，不影響其他內容。

## 目錄與編輯入口

```text
index.html                       產生的完整頁面，可直接開啟
assets/
  css/style.css                  基礎版面與手機樣式
  css/editorial.css              石墨黑、霧灰、米白的新版視覺
  js/main.js                     語言、搜尋、終端機、遊戲
  js/molecule.js                 捲動式 3D 材料視覺
  js/material-scenes.js          分子、Si–O 網絡與 AB 石墨獨立模型
  js/elements.js                 118 種元素名稱與原子序
  js/story.js                    GSAP 時間軸與動畫偏好
  vendor/gsap/                   固定版本動畫執行檔與來源紀錄
  images/                        保留原始圖檔；非所有圖檔都在使用
content/
  site_template.html             網頁結構及中英文文案來源
  hero_story.html                首頁三段捲動敘事來源
  publications.html              舊版卡片來源封存
  all_links_and_media.json        課程與媒體來源
  01_*.md … 05_*.md              舊站整理資料，供追溯
  publications_raw.txt           舊站論文擷取文字
scripts/
  build_site.py                  以標準函式庫產生 index.html
  build_publications.py          依官網快照產生 30／34 筆完整書目
  check_site.py                  內容數量、雙語與路徑檢查
  check_official_source.py       官網日期快照與重要資訊比對
  check_interactions.mjs          遊戲行為與紀錄保存檢查
  preview.mjs                    僅提供網頁與 assets 的本機伺服器
  package.ps1                    整理發布檔案至 _site
docs/                            待辦、進度、部署、維護與檢查紀錄
raw_html/                        五個舊 Google Sites 頁面備份
.github/workflows/deploy.yml      驗證並部署 GitHub Pages
.local-backups/                  本機改版前快照，不納入 Git
_site/                           發布產物，不納入 Git
```

不要直接修改產生的 `index.html`；修改來源後重新產生，避免下次覆寫。研究方向與課程中文名稱在 `scripts/build_site.py` 維護；書目由 `scripts/build_publications.py` 保留官網原文產生。

## 維護與驗收

依本機規則，Python 從 **Windows 主機端提升權限的 PowerShell** 呼叫 Ubuntu，使用既有環境；不安裝套件：

```powershell
wsl.exe -d Ubuntu bash -lc '/home/ubuntu/miniconda3/envs/codex_conda_base/bin/python /mnt/e/tjlab_website/scripts/build_site.py'
wsl.exe -d Ubuntu bash -lc '/home/ubuntu/miniconda3/envs/codex_conda_base/bin/python /mnt/e/tjlab_website/scripts/check_site.py'
node --check assets/js/main.js
node --check assets/js/molecule.js
node scripts/check_interactions.mjs
```

## 工作紀錄

- [待辦與驗收條件](docs/TODO.md)
- [目前進度與測試結果](docs/PROGRESS.md)
- [部署紀錄](docs/DEPLOYMENT_LOG.md)
- [維護手冊](docs/MAINTENANCE_GUIDE.md)
- [版本更新紀錄](CHANGELOG.md)
- [初次接續檢查快照](docs/PROJECT_STATUS_2026-10-17.md)

## 專案連結

- GitHub：https://github.com/ntusttjlab-design/TJLAB_website
- 線上網站：https://ntusttjlab-design.github.io/TJLAB_website/
- 舊站：https://sites.google.com/view/msmtjl/homepage
- YouTube：https://www.youtube.com/user/sdd3390

官網重要資訊已於 2026-10-17 重新核對，詳見 [核對紀錄](docs/OFFICIAL_CONTENT_CHECK_2026-10-17.md)。

動畫與學生視角請見 [設計原則](docs/DESIGN_GUIDE.md)。共用榜單已完成 Apps Script 公開部署及貪食蛇寫入驗收，請見 [排行榜設定](docs/LEADERBOARD_SETUP.md)。
