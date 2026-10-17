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
        self.ids, self.refs, self.categories, self.playlists, self.embeds = [], [], [], [], []
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
        if tag == 'iframe' and 'data-collection' in values:
            self.embeds.append((values['data-collection'], values['src']))
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
assert sum('journal' in category for category in page.categories) == 30
assert sum('conference' in category for category in page.categories) == 34
source = json.loads((ROOT / 'content/all_links_and_media.json').read_text(encoding='utf-8-sig'))
assert set(page.playlists) == {course['Url'] for course in source['YouTubePlaylists']}
assert len(page.playlists) == 16
assert len(set(page.playlists)) == 15
media = json.loads((ROOT / 'content/media_embeds.json').read_text(encoding='utf-8'))
assert len(media['gallery']) == 8 and len(media['tutorials']) == 17
assert sorted(page.embeds) == sorted(
    [('gallery', item['embed_url']) for item in media['gallery']] +
    [('tutorial', item['embed_url']) for item in media['tutorials']]
)
assert 'tutorial-resources' in page.ids and 'gallery' in page.ids
assert 'E1-241-2' in html and 'Associate Professor' in html
assert html.count('class="pub-original-notes"') >= 27
assert html.count('Impact Factor:') == 27

assert 'images.unsplash.com' not in html
assert 'pi-intro_img_1.png' in html and 'Associate Professor' in html
for internal_note in ['期刊指標依原始資料保留', '依官網列出', '核對日期', '英文姓名待確認', 'Journal metrics are retained']:
    assert internal_note not in html, '維護資訊不應顯示於公開頁：' + internal_note
assert '{{' not in html and '[[' not in html
assert 'JACS (IF ' not in html, '公開頁不應顯示殘留期刊指標標籤'
assert page.translations > 100
from build_publications import render_publications
expected = render_publications()
assert expected in html, '書目與官網快照產生的完整原文不一致'
assert len(page.categories) == 64
print('PASS：30篇期刊、34筆研討會、16筆課程、17筆教學影片或清單、8筆Gallery、完整官網原文、雙語及路徑檢查。')
