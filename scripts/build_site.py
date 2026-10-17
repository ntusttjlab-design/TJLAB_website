"""使用標準函式庫產生可直接開啟的靜態網站。"""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
import json
import re

ROOT = Path(__file__).resolve().parents[1]

def bilingual(zh, en):
    return f'<span data-zh="{escape(zh, quote=True)}" data-en="{escape(en, quote=True)}">{escape(zh)}</span>'

research = [
    ('01', '高分子、玻璃態材料與溶劑的介電損耗', 'Dielectric loss in polymers, glasses & solvents', '研究高分子、玻璃態材料與溶劑系統的介電損耗及相關物理化學問題。', 'Research on dielectric loss and related physical chemistry in polymers, glassy materials, and solvents.', 'Dielectric loss'),
    ('02', '催化劑的金屬與載體交互作用', 'Metal–support interactions in catalysts', '研究催化劑系統中金屬與載體之間的交互作用。', 'Research on interactions between metals and support materials in catalytic systems.', 'Metal–support interactions'),
    ('03', '原子層沉積的化學物種與反應', 'Chemistry of atomic layer deposition', '研究原子層沉積所涉及的化學物種與反應。', 'Research on chemical species and reactions involved in atomic layer deposition.', 'Atomic layer deposition'),
    ('04', '有機光電材料的分子設計', 'Molecular design for organic photovoltaics', '探討有機光電材料的分子設計與相關物理化學問題。', 'Research on molecular design and related physical chemistry of organic photovoltaic materials.', 'Organic photovoltaics'),
    ('05', '材料結構與性質關係的機器學習', 'Machine learning for structure–property relations', '以機器學習方法研究材料結構與性質之間的關係。', 'Study of structure–property relationships in materials using machine learning.', 'Structure–property relations'),
    ('06', '溶液交互作用參數', 'Solution interaction parameters', '探討溶液系統中的分子交互作用與相關參數。', 'Research on molecular interactions and associated parameters in solution systems.', 'Solution interactions'),
    ('07', '高分子、溶劑與特殊化合物的分子力場開發', 'Force-field development for molecular systems', '研究高分子、溶劑與特殊化合物的分子力場開發。', 'Research on force-field development for polymers, solvents, and specialized chemical compounds.', 'Force-field development'),
]

from types import SimpleNamespace
from build_publications import render_publications
pubs = SimpleNamespace(journals=30, conferences=34, output=[render_publications()])

data = json.loads((ROOT / 'content/all_links_and_media.json').read_text(encoding='utf-8-sig'))
courses = data['YouTubePlaylists']
course_names = ['基礎微積分', '一階常微分方程', '二階常微分方程', '拉普拉斯轉換', '常微分方程數值解', '質能均衡原理', '質能均衡實習（一）', '質能均衡實習（二）', '質能均衡實習（三）', '質能均衡實習（四）', 'MATLAB 程式設計', 'Linux 基礎操作', '材料與分子模擬（一）', '材料與分子模擬（二）', '量子化學與光譜', '高中化學與物理']
assert len(courses) == len(course_names)
course_html = []
for i, (course, name) in enumerate(zip(courses, course_names), 1):
    course_html.append(f'<a class="course-card" href="{escape(course["Url"], quote=True)}" target="_blank" rel="noopener noreferrer"><span class="course-number">{i:02d}</span><h3>{bilingual(name, course["Title"])}</h3><span class="course-link" aria-label="YouTube">↗</span></a>')
# 小型向量示意對應各研究問題，不表示計算結果或量測數據。
research_visuals = [
    '<path d="M12 15h144M12 60h144"/><path d="M30 44l20-14m15 14l20-14m15 14l20-14"/><g fill="currentColor"><circle cx="30" cy="44" r="4"/><circle cx="65" cy="44" r="4"/><circle cx="100" cy="44" r="4"/></g><g fill="#9babb1"><circle cx="50" cy="30" r="4"/><circle cx="85" cy="30" r="4"/><circle cx="120" cy="30" r="4"/></g>',
    '<path d="M10 57h150M20 67h130"/><g fill="#9babb1"><circle cx="55" cy="50" r="7"/><circle cx="72" cy="50" r="7"/><circle cx="89" cy="50" r="7"/><circle cx="63" cy="37" r="7"/><circle cx="80" cy="37" r="7"/></g><path d="M100 16l-10 12m15-3l-5-9"/><circle cx="104" cy="12" r="5"/>',
    '<path d="M12 61h144M12 52h144"/><path stroke-dasharray="3 5" d="M40 28v17m45-17v17m45-17v17"/><circle cx="40" cy="23" r="6"/><circle cx="85" cy="23" r="6"/><circle cx="130" cy="23" r="6"/>',
    '<path d="M15 22h60v34H15zM95 22h60v34H95z"/><path d="M50 39h65m-8-6l8 6-8 6"/><circle cx="45" cy="39" r="6"/><circle cx="125" cy="39" r="6"/>',
    '<path d="M25 17l55 12-55 30 55-12-55-30m55 12l60-12-60 30 60 12"/><g fill="currentColor"><circle cx="25" cy="17" r="5"/><circle cx="25" cy="59" r="5"/><circle cx="80" cy="29" r="5"/><circle cx="80" cy="47" r="5"/><circle cx="140" cy="17" r="5"/><circle cx="140" cy="59" r="5"/></g>',
    '<path d="M12 42q12-33 24 0t24 0 24 0 24 0 24 0 24 0"/><g fill="#9babb1"><circle cx="30" cy="65" r="4"/><circle cx="65" cy="15" r="4"/><circle cx="99" cy="62" r="4"/><circle cx="140" cy="15" r="4"/></g>',
    '<path d="M15 13v53h140M30 17q15 71 45 25t65-20"/><circle cx="65" cy="49" r="4"/><path stroke-dasharray="3 4" d="M65 49v17"/>',
]
research_html = ''.join(f'<article class="research-card"><span class="card-number">{n}</span><h3>{bilingual(zh, en)}</h3><svg class="research-visual" viewBox="0 0 170 78" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5">{visual}</svg><p>{bilingual(desc, desc_en)}</p><small>{escape(tags)}</small></article>' for (n, zh, en, desc, desc_en, tags), visual in zip(research, research_visuals))
groups = [
    ('數學基礎', 'Mathematics', range(0, 5)),
    ('工程計算', 'Engineering calculations', range(5, 10)),
    ('程式與工具', 'Programming & tools', range(10, 12)),
    ('材料與分子模擬', 'Materials & molecular modeling', range(12, 15)),
    ('高中理化', 'School science', range(15, 16)),
]
course_html = [f'<section class="course-group"><h3>{bilingual(zh,en)}</h3><div class="course-items">{"".join(course_html[i] for i in indices)}</div></section>' for zh,en,indices in groups]
# Gallery 8 and independent tutorial resources 17: do not merge with the PI's 16 playlists.
media = json.loads((ROOT / 'content/media_embeds.json').read_text(encoding='utf-8'))
assert len(media['gallery']) == 8 and len(media['tutorials']) == 17
assert len([x for x in media['tutorials'] if x.get('publish_teacher_only')]) == 3
def render_embeds(items, collection):
    cards = []
    for item in items:
        if item['kind'] == 'video':
            preview = (
                f'<img src="https://i.ytimg.com/vi/{escape(item["youtube_id"], quote=True)}/hqdefault.jpg" '
                f'alt="" loading="lazy" decoding="async">'
            )
        else:
            preview = f'<span class="media-playlist-label">{bilingual("YouTube 播放清單", "YouTube playlist")}</span>'
        cards.append(
            f'<article class="media-card"><div class="media-player"><button class="media-launch" '
            f'type="button" data-collection="{collection}" '
            f'data-embed-url="{escape(item["embed_url"], quote=True)}" '
            f'data-video-title="{escape(item["title_en"], quote=True)}" '
            f'aria-label="{escape(item["title_zh"], quote=True)}">{preview}'
            f'<span class="media-play-icon" aria-hidden="true">▶</span></button></div>'
            f'<div class="media-caption"><h4>{bilingual(item["title_zh"], item["title_en"])}</h4>'
            f'<a href="{escape(item["watch_url"], quote=True)}" target="_blank" rel="noopener noreferrer">'
            f'{bilingual("在 YouTube 開啟", "Open on YouTube")} ↗</a></div></article>'
        )
    return ''.join(cards)

html = (ROOT / 'content/site_template.html').read_text(encoding='utf-8')
html = html.replace('{{HERO}}', (ROOT / 'content/hero_story.html').read_text(encoding='utf-8'))
html = html.replace('{{DIELECTRIC}}', (ROOT / 'content/dielectric_demo.html').read_text(encoding='utf-8'))
html = re.sub(r'\[\[(.*?)\|\|(.*?)\]\]', lambda match: bilingual(*match.groups()), html)
for key, value in {'JOURNAL_COUNT': str(pubs.journals), 'COURSE_COUNT': str(len(courses)), 'COURSE_UNIQUE_COUNT': str(len({course['Id'] for course in courses})), 'RESEARCH': research_html, 'PUBLICATIONS': ''.join(pubs.output), 'COURSES': ''.join(course_html), 'TUTORIAL_TEACHER': render_embeds([x for x in media['tutorials'] if x.get('publish_teacher_only')], 'tutorial')}.items():
    html = html.replace('{{' + key + '}}', value)
assert '{{' not in html
(ROOT / 'index.html').write_text(html, encoding='utf-8')
activity_data = json.loads((ROOT / 'content/lab_activities.json').read_text(encoding='utf-8'))
assert isinstance(activity_data.get('albums'), list)
def activity_lang(item, name):
    result = item.get(name, {})
    assert isinstance(result, dict) and isinstance(result.get('zh'), str) and isinstance(result.get('en'), str)
    return result
def activity_gallery(albums):
    cards = []
    for album in albums:
        assert isinstance(album, dict)
        title = activity_lang(album, 'title')
        date = album['date']
        assert isinstance(date, str) and re.fullmatch(r'\d{4}-\d{2}-\d{2}', date)
        photos = album.get('photos', [])
        assert isinstance(photos, list) and photos, 'Only publish albums with verified photographs'
        images = []
        for photo in photos:
            assert isinstance(photo, dict)
            path = photo['src']
            assert isinstance(path, str) and re.fullmatch(r'assets/images/lab-life/[a-zA-Z0-9_./-]+\.(?:jpg|jpeg|png|webp)', path)
            assert '..' not in path and (ROOT / path).is_file(), 'Activity image must be a local approved file'
            alt = activity_lang(photo, 'alt')
            caption = activity_lang(photo, 'caption')
            images.append(
                '<button class="activity-photo" type="button" data-activity-photo '
                f'data-alt-zh="{escape(alt["zh"], quote=True)}" data-alt-en="{escape(alt["en"], quote=True)}" '
                f'data-caption-zh="{escape(caption["zh"], quote=True)}" data-caption-en="{escape(caption["en"], quote=True)}" '
                f'data-title-zh="{escape(title["zh"], quote=True)}" data-title-en="{escape(title["en"], quote=True)}" '
                f'aria-label="{escape(caption["zh"], quote=True)}"><img src="./{escape(path, quote=True)}" alt="{escape(alt["zh"], quote=True)}" loading="lazy" decoding="async"></button>'
            )
        cards.append('<article class="activity-album"><div class="activity-album-heading"><h3>'
            + bilingual(title['zh'], title['en']) + '</h3><time datetime="' + escape(date) + '">' + escape(date)
            + '</time></div><div class="activity-photos">' + ''.join(images) + '</div></article>')
    return ''.join(cards)
member_template = (ROOT / 'content/members_template.html').read_text(encoding='utf-8')
arcade_source = (ROOT / 'content/arcade_section.html').read_text(encoding='utf-8')
member_html = member_template.replace('{{ARCADE}}', arcade_source)
member_html = member_html.replace('{{ACTIVITY_GALLERY}}', activity_gallery(activity_data['albums']))
if activity_data['albums']:
    member_html = member_html.replace('class="activity-empty" id="activity-empty"', 'class="activity-empty" id="activity-empty" hidden')
member_html = re.sub(r'\[\[(.*?)\|\|(.*?)\]\]', lambda match: bilingual(*match.groups()), member_html)
assert '{{' not in member_html
(ROOT / 'members.html').write_text(member_html, encoding='utf-8')

print(f'已產生 index.html：{pubs.journals} 篇期刊、{pubs.conferences} 筆研討會、{len(courses)} 筆教學連結。')
