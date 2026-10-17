"""比對指定日期官網快照與本機重要資訊，僅使用標準函式庫。"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, parse_qs, unquote
import json
import re

ROOT = Path(__file__).resolve().parents[1]

class Source(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.texts = []
        self.urls = []

    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'):
            self.skip += 1
        url = dict(attrs).get('href', '')
        if 'youtube.com/' in url:
            if 'google.com/url?' in url:
                url = parse_qs(urlsplit(url).query).get('q', [url])[0]
            self.urls.append(url)

    def handle_endtag(self, tag):
        if tag in ('script', 'style'):
            self.skip -= 1

    def handle_data(self, text):
        if not self.skip and text.strip():
            self.texts.append(' '.join(text.split()))

parser = Source()
parser.feed((ROOT / 'raw_html/snapshots/2026-10-17/pi-intro.html').read_text(encoding='utf-8'))
text = ' '.join(parser.texts)
playlist_ids = {parse_qs(urlsplit(url).query)['list'][0] for url in parser.urls if 'list=' in url}
data = json.loads((ROOT / 'content/all_links_and_media.json').read_text(encoding='utf-8-sig'))
local_ids = {course['Id'] for course in data['YouTubePlaylists']}
assert playlist_ids == local_ids, {'only_local':sorted(local_ids-playlist_ids),'only_official':sorted(playlist_ids-local_ids)}
assert len(data['YouTubePlaylists']) == 16 and len(playlist_ids) == 15
quantum = next(course for course in data['YouTubePlaylists'] if course['Title'] == 'Quantum Chemistry & Spectra')
matlab = next(course for course in data['YouTubePlaylists'] if course['Title'] == 'MATLAB Clips')
assert quantum['Url'] == matlab['Url']
generated = (ROOT / 'index.html').read_text(encoding='utf-8')
for fact in ['Tzu-Jen Lin', 'Assistant Professor', 'University of Akron', 'University of Manchester', 'National Cheng Kung University', '2013', '2008', '2004', '2022/08', '2016/08', '2022/07', '2014/08', '2016/07', '2013/08', '2014/07', 'tjlin@mail.ntust.edu.tw']:
    assert fact.lower() in text.lower(), '官網未找到：' + fact
    assert fact.lower() in generated.lower(), '本機未找到：' + fact
for course in ['Mechanics of Materials', 'General Physics (I)', 'Engineering Mathematics (I)', 'Introduction to Quantum Chemistry and Spectra']:
    assert course in text and course in generated
homepage = Source()
homepage.feed((ROOT / 'raw_html/snapshots/2026-10-17/homepage.html').read_text(encoding='utf-8'))
homepage_text = ' '.join(homepage.texts)
for fact in ['E1-101-2', 'E1-241-2', 'Multi-Scale Modeling and Thermodynamics LAB']:
    assert fact.lower() in homepage_text.lower() and fact.lower() in generated.lower(), '首頁資訊未對應：' + fact
assert 'Associate Professor' in generated and '副教授' in generated
print('PASS：姓名、學位年份、經歷年月、Email與課程依官網快照；現職副教授依使用者2026-10-17更新，歷史助理教授經歷保留；16筆資源對應15個清單。')
