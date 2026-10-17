# 2026-10-18 舊站媒體與學術資訊復原紀錄

## 已確認條件

- 現職副教授；辦公室 E1-101-2；實驗室 E1-241-2（使用者明確確認）。
- 30 篇期刊、34 筆研討會應以舊站 2026-10-17 快照為準，標題、年份、順序、作者不改。
- 舊版學術附註：27 筆 Impact Factor / Rank、13 筆作者貢獻說明，改為可展開原站歷史註記。
- 舊 Gallery 8 支影片；獨立 Tutorial Resources 14 支影片與 3 個播放清單；原本 PI 課程 16 筆不變。
- 原 Markdown 的影片標題誤配已按舊站 iframe 標籤修正。
- 舊站的 Langmuir INTERFACE Force Field 記為 2014，出版社為 2013；因本次要求舊站文字一致，未擅改。

## 邊界與待驗證

- 本次重用 GitHub 儲存庫中的舊站 HTML 備份，並非逐支重新觀看 YouTube 影片。
- 25 個嵌入的公開播放、地區限制、隱私政策、跨瀏覽器效果需要實際測試。
- 舊站作者姓名、論文題名與會議資訊保留；不自行改正未經授權的舊出版資料。
- 不能把此分支寫成已正式發布；正式站要等 PR 合併且部署成功。

## 來源

- `raw_html/gallery.html`
- `raw_html/tutorial-resources.html`
- `raw_html/snapshots/2026-10-17/publication-and-presentation.html`
- `content/media_embeds.json`

## 2026-10-18 使用者最新要求：公開教學僅顯示老師 YouTube

- 公開的 Computational Tutorials 僅展示 3 個原站老師 YouTube 播放清單（Materials Studio、Quantum Chemistry、Molecular Dynamics）；其餘 14 支其他頻道的單支教學影片不展示。
- 完整 17 筆舊來源仍留在 JSON/HTML 備份；原有 16 筆 Open Courses 及 Gallery 8 支不變。
- 老師頻道由官方舊站指出：`https://www.youtube.com/user/sdd3390`；清單內容的逐支上傳者未獨立驗證，不能以此宣稱每支都由老師上傳。
- 最新自動驗收：公開 Tutorial 3 個、原課程 16 筆、Gallery 8 支；舊 Tutorial 原始來源仍 17 筆。

## 2026-10-18 最新使用者決策：隱藏 Gallery；保留程式互動

- 新版不需要公開「研究模擬影片（Gallery）」章節，已移除網站導航與八支 YouTube 影片卡片。
- 原 Google Sites 的 8 筆 Gallery 影片來源完整保存在 `raw_html/gallery.html`、`content/media_embeds.json` 和 `content/05_gallery.md`，以便歷史追溯。
- **3D 科學動畫及介電互動不是 YouTube**，維持原本 JavaScript/Three.js 示意及控制功能，不因移除 Gallery 而改動。
- 教學區仍顯示 3 個老師舊站播放清單、Open Courses 原有 16 筆連結，論文 30 篇、研討會 34 筆原文保留。
- 舊版歷史段落記錄先前進度；本節為最新決策及目前發布規則。
