"""檢查靜態頁面與來源資料是否一致，不依賴第三方套件。"""
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
from urllib.parse import urlsplit
from collections import Counter
import json
import re

ROOT = Path(__file__).resolve().parents[1]

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.refs, self.categories, self.playlists = [], [], [], []
        self.translations = 0
        self.errors = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if 'id' in values:
            self.ids.append(values['id'])
        for key in ('href', 'src'):
            if key in values:
                self.refs.append(values[key])
        if 'data-zh' in values:
            assert 'data-en' in values
            self.translations += 1
        if 'pub-card' in values.get('class', '').split():
            self.categories.append(values['data-category'].split())
        if 'course-card' in values.get('class', '').split():
            self.playlists.append(values['href'])
        if values.get('target') == '_blank' and 'noopener' not in values.get('rel', ''):
            self.errors.append('外部新分頁缺少 noopener')

html = (ROOT / 'index.html').read_text(encoding='utf-8')
page = Page()
page.feed(html)
assert not page.errors, page.errors
assert not [key for key, count in Counter(page.ids).items() if count > 1], '存在重複 ID'
for ref in page.refs:
    if ref.startswith('#'):
        assert ref[1:] in page.ids, f'缺少錨點：{ref}'
    elif not urlsplit(ref).scheme:
        assert (ROOT / urlsplit(ref).path).is_file(), f'缺少本機檔案：{ref}'
assert sum('journal' in category for category in page.categories) == 19
assert sum('conference' in category for category in page.categories) == 18
source = json.loads((ROOT / 'content/all_links_and_media.json').read_text(encoding='utf-8-sig'))
assert set(page.playlists) == {course['Url'] for course in source['YouTubePlaylists']}
assert len(page.playlists) == 16
assert len(set(page.playlists)) == 15
assert 'images.unsplash.com' not in html
assert 'pi-intro_img_1.png' in html and 'Associate Professor' in html
for internal_note in ['期刊指標依原始資料保留', '依官網列出', '核對日期', '英文姓名待確認', 'Impact Factor:', 'Journal metrics are retained']:
    assert internal_note not in html, '維護資訊不應顯示於公開頁：' + internal_note
assert '{{' not in html and '[[' not in html
assert 'JACS (IF ' not in html, '公開頁不應顯示殘留期刊指標標籤'
assert page.translations > 100
source_pubs = (ROOT / 'content/publications.html').read_text(encoding='utf-8')
original_titles = re.findall(r'<h4[^>]*>(.*?)</h4>', source_pubs, re.S)
publication_html = html[html.index('<div id="publication-list">'):html.index('<p id="pub-empty"')]
generated_titles = re.findall(r'<h4[^>]*>(.*?)</h4>', publication_html, re.S)
clean = lambda values: [' '.join(unescape(value).split()) for value in values]
assert clean(original_titles) == clean(generated_titles), '期刊標題與來源不一致'
print(f'PASS：19 篇期刊、18 筆研討會、16 筆教學連結（15 個不重複清單）；{page.translations} 個雙語欄位；路徑與錨點完整；期刊標題保留。')
