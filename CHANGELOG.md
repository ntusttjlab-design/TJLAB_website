# 網站更新紀錄 (Changelog & Update History)

本專案遵循 [Semantic Versioning (語意化版本 2.0.0)](https://semver.org/lang/zh-TW/) 與 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/) 規範進行更新紀錄與維護。

---

## [1.0.0] - 2026-10-17

### 🚀 重大重構 (Major Redesign & Migration)
- **原始網站遷移**：自原始 [Google Sites (msmtjl)](https://sites.google.com/view/msmtjl/homepage) 完整備份所有文字、論文、外部超連結與圖檔至專案庫。
- **全新現代深色科技視覺 (Dark Tech UI)**：
  - 導入 Tailwind CSS 現代深色調風格（Dark Slate / Terminal Green / Cyber Cyan），搭配玻璃擬態（Glassmorphism）與霓虹微光。
  - 全響應式排版（支援手機、平板、筆電與 4K 螢幕）。

### ✨ 新增互動功能 (Interactive Features Added)
- **3D 分子結構即時渲染 (Three.js WebGL)**：
  - 首頁右側嵌入低介電聚醯亞胺（Polyimide）三維分子單元，支援滑鼠/觸控 360 度旋轉縮放。
  - **「⚡ 施加 10 GHz 電場」動態模擬**：點擊切換交流高頻電場，模擬偶極動態響應與分子微觀振動，具象化實驗室核心研究。
- **Linux 終端機彩蛋 (Terminal CLI Mode)**：
  - 支援點擊導覽列或按下鍵盤 **`~`（波浪鍵）** 喚出終端機視窗。
  - 支援指令：`help`、`run_md`（即時系綜放能數值演算）、`cat pi.txt`、`skills`、`papers`、`join`、`clear`、`exit`。
- **論文著作即時搜尋與多標籤過濾器 (Real-time Filter & Search)**：
  - 支援關鍵字即時輸入過濾（作者、期刊、年份）。
  - 提供 `#全部`、`#低介電與高分子`、`#量子化學與DFT`、`#能源與光電`、`#學生發表` 一鍵標籤篩選。
  - 高亮標註學生第一作者成果與國內外年會獲獎紀錄。
- **開放式課程整合專區 (Open Educational Resources)**：
  - 系統化梳理林老師 YouTube 頻道之工程數學、質能均衡、分子動力學、Linux、Matlab 等 10+ 個播放清單。
- **PI 形象彩蛋切換**：
  - 保留原始網站金正恩迷因頭像，提供「正式形象 / 迷因形象」一鍵無縫切換。

### ⚙️ 工程與自動化部署 (DevOps & CI/CD)
- **GitHub Actions 自動化部署**：建立 `.github/workflows/deploy.yml`，每次推送程式碼自動部署至 GitHub Pages。
- **零依賴架構 (Zero-Build Vanilla)**：採用純原生 HTML5 + ES Module，免本地安裝 Node.js，開箱即用、雙擊可開。
- **路徑防呆處理**：所有靜態資源與圖片均使用標準相對路徑（`./assets/...`），杜絕 GitHub Pages 子目錄破圖問題。

---

## [未發布計畫 (Upcoming / Roadmap)]

### 規劃中功能 (Planned Features)
- [ ] **相簿區擴充 (Gallery Lightroom)**：收集實驗室伺服器機房、學生研討會口頭報告與聚餐合照，加入燈箱大圖預覽。
- [ ] **實驗室成員專區 (Members & Alumni)**：增加碩博士生、專題生個人簡介與畢業學長姐出路統計（半導體、高分子材料與科技業）。
- [ ] **CIF 晶體結構 3D 上傳解析器**：讓訪客可拖曳自己的分子或晶體結構檔（.pdb, .cif）至瀏覽器中即時檢視。
- [ ] **自訂網域綁定**：申請並配置台科大子網域（如 `msm.mse.ntust.edu.tw`）。

---

## 📝 版本紀錄填寫格式規範 (For Future Maintainers)

每當實驗室成員更新網站（例如新增一篇 Paper 或新進研究生），請依照以下格式在頂部追加紀錄：

```markdown
## [版本號] - YYYY-MM-DD
### 新增 (Added)
- 新增項目描述
### 修正 (Fixed)
- 修正項目描述
### 變更 (Changed)
- 變更項目描述
```
