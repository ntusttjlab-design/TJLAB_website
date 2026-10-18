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
        if tag == 'button' and 'media-launch' in values.get('class', '').split():
            self.embeds.append((values['data-collection'], values['data-embed-url']))
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
teacher_tutorials = [item for item in media['tutorials'] if item.get('publish_teacher_only')]
assert len(teacher_tutorials) == 3
assert all(item['kind'] == 'playlist' and item['group'] == 'playlists' for item in teacher_tutorials)
assert all(not item.get('publish_teacher_only') for item in media['tutorials'] if item['kind'] == 'video')
assert sorted(page.embeds) == sorted(
    [('tutorial', item['embed_url']) for item in teacher_tutorials]
)
assert 'tutorial-resources' in page.ids and 'gallery' not in page.ids
assert not any(kind == 'gallery' for kind, _ in page.embeds), 'Gallery must remain archival only'
assert 'href="#gallery"' not in html
assert 'Research video gallery' not in html and '研究模擬影片' not in html
# Keep original eight video records for historical traceability, not publication.
assert len({item['youtube_id'] for item in media['gallery']}) == 8
assert (ROOT / 'raw_html/gallery.html').is_file()
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
assert 'href="#join"' in html and 'Contact information' in html and '聯絡資訊' in html
assert 'JOIN THE LAB' not in html and 'Join the lab' not in html and '加入研究室' not in html
assert 'What you can learn here' not in html and '你可以在這裡練習' not in html
assert 'Quantum chemistry' in html and 'Non-equilibrium MD' in html
assert 'CP2K' not in html and 'scikit-learn' not in html, '未核實之軟體清單不應顯示於公開頁'
assert 'not a quantitative dielectric response' in html
assert len(re.findall(r'class="research-card"', html)) == 7
assert len(re.findall(r'data-step="[01]"', html)) == 2 and 'data-step="2"' not in html
assert len(re.findall(r'data-scene="[01]"', html)) == 2 and 'data-scene="2"' not in html
assert 'GRAPHITE / AB STACKING' not in html and 'Layered carbon' not in html
assert 'Research introduction (original wording)' in html
assert 'I am fascinated by and study fundamental physical chemistry problems' in html
assert 'PhD in Polymer Engineering' in html and 'Associate Professor' in html
assert 'Journal reviewing' not in html and '期刊審稿服務' not in html
assert html.index('id="pi"') < html.index('id="research"') < html.index('id="publications"') < html.index('id="tutorials"') < html.index('id="dielectric"')
assert len(re.findall(r'class="chapter-bridge', html)) == 6
assert len(page.categories) == 64
assert 'arcade' not in page.ids and 'snake-canvas' not in page.ids
assert 'href="./members.html"' in html and 'href="./index.html"' in html
assert html.count('class="primary-site-link') == 2
members_html = (ROOT / 'members.html').read_text(encoding='utf-8')
members = Page()
members.feed(members_html)
assert not members.errors, members.errors
assert not [key for key, count in Counter(members.ids).items() if count > 1]
for ref in members.refs:
    if ref.startswith('#'):
        assert ref[1:] in members.ids, f'成員頁缺少錨點：{ref}'
    elif not urlsplit(ref).scheme:
        assert (ROOT / urlsplit(ref).path).is_file(), f'成員頁缺少本機檔案：{ref}'
assert len(members.categories) == 0 and len(members.playlists) == 0
assert members.translations >= 12, '成員頁需有基本雙語標示'
assert all(id in members.ids for id in ('members', 'members-list', 'lab-life', 'arcade', 'snake-canvas', 'volley-canvas', 'activity-gallery', 'activity-lightbox'))
assert members_html.count('class="primary-site-link') == 2
assert members_html.count('class="game-card"') == 2
assert members_html.count('class="member-category"') == 4
assert 'href="./index.html#pi"' in members_html and 'href="./index.html#publications"' not in members_html
assert 'student-resources' not in members.ids and 'Public teaching & research resources' not in members_html
assert 'id="lab-life"' in members_html and '研究室生活與活動' in members_html
assert 'class="chapter-bridge member-bridge' not in members_html
assert 'class="member-transition-copy"' not in members_html
assert members_html.count('data-member-flow=') == 4
assert 'id="members-motion-toggle"' in members_html
assert 'assets/js/chapter-transitions.js' not in members_html
assert 'assets/js/member-motion.js?v=pr4.5' in members_html
assert 'class="members-story-stage"' not in members_html
assert 'class="story-stage members-story-stage"' in members_html
assert members_html.count('class="story-copy members-story-copy"') == 2
assert members_html.count('class="members-story-graphic"') == 2
assert members_html.count('data-graphic=') == 2
assert members_html.count('data-model-label=') == 2
assert members_html.count('data-scene=') == 2
assert 'class="cinematic-next"' not in members_html
assert 'cinematic-member-destination' not in members_html
assert 'editorial.css?v=pr4.7' in members_html
assert 'lab-life-color-wash' not in members_html
assert members_html.count('data-member-flow=') == 4
assert members_html.count('class="lab-life-color-wash"') == 0

assert 'assets/js/chapter-transitions.js' in html
assert 'assets/js/lab-life-gallery.js' in members_html
activity_data = json.loads((ROOT / 'content/lab_activities.json').read_text(encoding='utf-8'))
assert isinstance(activity_data.get('albums'), list)
if not activity_data['albums']:
    assert 'id="activity-empty"' in members_html and 'Activity photos will be added here' in members_html
    assert 'class="activity-photo"' not in members_html
assert 'href="./index.html"' in members_html
assert 'href="./index.html"' in members_html
assert 'href="./members.html"' in members_html
assert 'window.labArcadeUrl' not in html
assert 'assets/js/arcade-config.js' in members_html and 'assets/js/arcade-embed.js?v=pr4.6' in members_html
assert '舒壓小遊戲' in members_html and 'Relaxing Mini Games' in members_html
assert '元素互動遊戲' not in members_html and 'Interactive element games' not in members_html
assert 'id="members-contact"' not in members_html
assert 'href="./index.html#join"' in members_html
gas_html = (ROOT / 'backend/google-apps-script/Arcade.html').read_text(encoding='utf-8')
assert 'id="record-language"' not in gas_html and "getElementById('record-language')" not in gas_html
assert 'msmtjl-language' in gas_html and 'msmtjl-arcade-size' in gas_html
assert 'html,body{overflow:hidden' in gas_html
assert 'broadcastArcadeHeight' in gas_html and 'lastReportedHeight' in gas_html
assert 'https://raw.githack.com' in gas_html and 'https://ntusttjlab-design.github.io' in gas_html
embed_js = (ROOT / 'assets/js/arcade-embed.js').read_text(encoding='utf-8')
assert "frame.setAttribute('scrolling','no')" in embed_js
assert 'Math.min(4000' not in embed_js
assert "gameWindow?.postMessage({type:'msmtjl-language'" in embed_js
assert 'data-step="2"' not in html and 'GRAPHITE / AB STACKING' not in html

print('PASS：30篇期刊、34筆研討會、16筆課程、3筆老師教學播放清單、Gallery保留來源不公開、完整官網原文、雙語及路徑檢查。')
