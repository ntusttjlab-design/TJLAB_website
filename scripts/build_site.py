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
    ('01', '高頻介電材料', 'High-frequency dielectrics', '研究高分子、玻璃態材料與溶劑的介電行為，了解分子結構與能量損耗的關係。', 'We study dielectric behavior in polymers, glasses and solvents to connect molecular structure with energy loss.', 'Polyimides / Low Dk & Df'),
    ('02', '催化劑與載體', 'Catalysts & supports', '以量子化學計算分析金屬與載體的交互作用，探討催化反應與材料穩定性。', 'Quantum chemical calculations help us understand metal–support interactions, catalytic reactions and stability.', 'Metal–support interactions'),
    ('03', '原子層沉積', 'Atomic layer deposition', '研究前驅物在表面的吸附與反應，從原子尺度理解薄膜形成的機制。', 'We investigate precursor adsorption and surface reactions to understand thin-film growth at the atomic scale.', 'ALD / Surface chemistry'),
    ('04', '有機光電材料', 'Organic photovoltaics', '分析有機分子的排列與電荷轉移，探討分子設計如何影響太陽能電池材料。', 'We examine molecular packing and charge transfer to understand how molecular design affects photovoltaic materials.', 'OPV / Charge transfer'),
    ('05', '材料機器學習', 'Machine learning for materials', '結合分子特徵與計算資料，建立結構與物性之間的預測模型。', 'Molecular descriptors and simulation data help us build predictive models linking structure and properties.', 'Structure–property relations'),
    ('06', '溶液熱力學', 'Solution thermodynamics', '研究高分子與溶劑的交互作用，了解混合、溶解與相分離的行為。', 'We study polymer–solvent interactions to understand mixing, solubility and phase separation.', 'Flory–Huggins interactions'),
    ('07', '分子力場開發', 'Molecular force fields', '發展與驗證高分子、溶劑及特殊化合物的力場，改善模擬對材料行為的描述。', 'We develop and validate force fields for polymers, solvents and specialized compounds to improve molecular simulations.', 'Force-field development / IFF'),
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
html = (ROOT / 'content/site_template.html').read_text(encoding='utf-8')
html = html.replace('{{HERO}}', (ROOT / 'content/hero_story.html').read_text(encoding='utf-8'))
html = html.replace('{{DIELECTRIC}}', (ROOT / 'content/dielectric_demo.html').read_text(encoding='utf-8'))
html = re.sub(r'\[\[(.*?)\|\|(.*?)\]\]', lambda match: bilingual(*match.groups()), html)
for key, value in {'JOURNAL_COUNT': str(pubs.journals), 'COURSE_COUNT': str(len(courses)), 'COURSE_UNIQUE_COUNT': str(len({course['Id'] for course in courses})), 'RESEARCH': research_html, 'PUBLICATIONS': ''.join(pubs.output), 'COURSES': ''.join(course_html)}.items():
    html = html.replace('{{' + key + '}}', value)
assert '{{' not in html
(ROOT / 'index.html').write_text(html, encoding='utf-8')
print(f'已產生 index.html：{pubs.journals} 篇期刊、{pubs.conferences} 筆研討會、{len(courses)} 筆教學連結。')
