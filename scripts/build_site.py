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

translations = {
    '★ 學生第一作者: Jaysen Brian Susanto': ('★ 學生第一作者：Jaysen Brian Susanto', '★ Student first author: Jaysen Brian Susanto'),
    '★ 學生第一作者: 蘇威儒 (Wei-Ru Su)': ('★ 學生第一作者：Wei-Ru Su', '★ Student first author: Wei-Ru Su'),
    'Wan-Feng Kao (高琬琁), Tzu-Jui Peng, Chao-Li Lee, Huan-Chia Chang, and': ('Wan-Feng Kao, Tzu-Jui Peng, Chao-Li Lee, Huan-Chia Chang, and', 'Wan-Feng Kao, Tzu-Jui Peng, Chao-Li Lee, Huan-Chia Chang, and'),
    '低介電聚醯亞胺代表作': ('聚醯亞胺介電研究', 'Polyimide dielectric research'),
    '高分子界面力場經典奠基之作': ('高分子界面力場研究', 'Polymer interface force fields'),
    '熱力學與程序系統研討會 (Nantou County)': ('熱力學與程序系統研討會（南投）', 'Symposium on Thermodynamics and Process Systems Engineering (Nantou)'),
    '高分子學會年會 (NTHU, Hsinchu)': ('高分子學會年會（清大，新竹）', 'Polymer Society Annual Meeting (NTHU, Hsinchu)'),
    '高分子學會年會 (NCUT, Taichung)': ('高分子學會年會（勤益科大，台中）', 'Polymer Society Annual Meeting (NCUT, Taichung)'),
    '第 72 屆 台灣化工年會 TwIChE (NCKU, Tainan)': ('第 72 屆台灣化工年會（成大，台南）', '72nd TwIChE Annual Meeting (NCKU, Tainan)'),
    '第 71 屆 台灣化工年會 TwIChE (CYCU, Taoyuan)': ('第 71 屆台灣化工年會（中原，桃園）', '71st TwIChE Annual Meeting (CYCU, Taoyuan)'),
    '第 66 屆 台灣化工年會 TwIChE (THU, Taichung, 2019)': ('第 66 屆台灣化工年會（東海，台中，2019）', '66th TwIChE Annual Meeting (THU, Taichung, 2019)'),
    '理論與計算分子科學年會 T2CoMSA (FCU, Taichung)': ('理論與計算分子科學年會（逢甲，台中）', 'T2CoMSA Annual Meeting (FCU, Taichung)'),
    '化學年會 (TKU, New Taipei)': ('化學年會（淡江，新北）', 'Chemistry National Meeting (TKU, New Taipei)'),
    '"探討利用全原子分子動力學研究高分子發泡材料的可行性" -': ('「探討利用全原子分子動力學研究高分子發泡材料的可行性」 —', '“Feasibility of studying polymer foams using all-atom molecular dynamics” —'),
    '"非富勒烯受體分子在有機太陽能電池中之排列行為與電荷轉移特性模擬研究" -': ('「非富勒烯受體分子在有機太陽能電池中之排列行為與電荷轉移特性模擬研究」 —', '“Simulation of molecular packing and charge transfer of non-fullerene acceptors in organic solar cells” —'),
    '報告學生: 劉兆恆': ('學生海報報告', 'Student poster presentation'),
    '報告學生: 林佩蓉': ('學生海報報告', 'Student poster presentation'),
    '主講: 林子仁 老師 (Invited Speaker)': ('特邀演講：林子仁老師', 'Invited speaker: 林子仁 (Tzu-Jen Lin)'),
    'A8 Section「AI、多尺度模擬與程序系統」': ('A8 組「AI、多尺度模擬與程序系統」', 'A8: AI, Multi-Scale Modeling and Process Systems'),
    '分組主席 (Session Chair): 林子仁 老師': ('分組主席：林子仁老師', 'Session chair: 林子仁 (Tzu-Jen Lin)'),
    '主講 & Session Chair: 林子仁 老師': ('主講暨分組主席：林子仁老師', 'Speaker & session chair: 林子仁 (Tzu-Jen Lin)'),
    '林子仁 老師': ('林子仁老師', '林子仁 (Tzu-Jen Lin)'),
    '🏆 得獎海報發表': ('得獎海報發表', 'Award-winning poster'),
}
for source, name in [('蘇威儒', 'Wei-Ru Su'), ('鄭揚譯 (Yang Yi Zheng)', 'Yang Yi Zheng'), ('鄭揚譯', 'Yang Yi Zheng'), ('Jaysen Brian Susanto', 'Jaysen Brian Susanto'), ('高琬琁 (Wan-Feng Kao)', 'Wan-Feng Kao'), ('張峻豪 (Jun-Hao Chang)', 'Jun-Hao Chang')]:
    translations['報告學生: ' + source] = ('報告學生：' + name, 'Student presenter: ' + name)
translations['獲獎學生: 李宇柔 (Yu-Jou Lee)'] = ('獲獎學生：Yu-Jou Lee', 'Student award: Yu-Jou Lee')
for date, zh, en in [('2025.11', '特邀演講', 'Invited talk'), ('2025.05', '特邀演講', 'Invited talk'), ('2025.01', '口頭報告', 'Oral presentation'), ('2024.11', '分組主席', 'Session chair'), ('2024.08', '口頭報告', 'Oral presentation'), ('2023.11', '國際會議口頭 & 主席', 'Talk & session chair'), ('2023.10', '特邀演講', 'Invited talk')]:
    translations[date + ' ' + zh] = (date + ' · ' + zh, date + ' · ' + en)

class Publications(HTMLParser):
    def __init__(self):
        super().__init__()
        self.output = []
        self.journals = self.conferences = 0
        self.unknown = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'pub-card' in attrs.get('class', '').split():
            category = attrs['data-category']
            if 'conference' in category.split():
                self.conferences += 1
            else:
                category += ' journal'
                self.journals += 1
            self.output.append(f'<div class="pub-card" data-category="{escape(category)}">')
        else:
            self.output.append(f'<{tag}>')

    def handle_endtag(self, tag):
        self.output.append(f'</{tag}>')

    def handle_data(self, text):
        clean = ' '.join(text.split())
        if clean in translations:
            self.output.append(bilingual(*translations[clean]))
        else:
            if re.search(r'[\u4e00-\u9fff]', clean):
                self.unknown.append(clean)
            self.output.append(escape(text))

pubs = Publications()
publication_source = (ROOT / 'content/publications.html').read_text(encoding='utf-8')
# 期刊指標與排名留在來源資料，不呈現給一般訪客。
publication_source = re.sub(r'<span[^>]*>\s*Impact Factor:.*?</span>', '', publication_source, flags=re.S)
publication_source = re.sub(r'<span[^>]*>\s*JACS \(IF .*?</span>', '', publication_source, flags=re.S)
pubs.feed(publication_source)
assert (pubs.journals, pubs.conferences) == (19, 18)
assert not pubs.unknown, '缺少翻譯：' + repr(pubs.unknown)
data = json.loads((ROOT / 'content/all_links_and_media.json').read_text(encoding='utf-8-sig'))
courses = data['YouTubePlaylists']
course_names = ['基礎微積分', '一階常微分方程', '二階常微分方程', '拉普拉斯轉換', '常微分方程數值解', '質能均衡原理', '質能均衡實習（一）', '質能均衡實習（二）', '質能均衡實習（三）', '質能均衡實習（四）', 'MATLAB 程式設計', 'Linux 基礎操作', '材料與分子模擬（一）', '材料與分子模擬（二）', '量子化學與光譜', '高中化學與物理']
assert len(courses) == len(course_names)
course_html = []
for i, (course, name) in enumerate(zip(courses, course_names), 1):
    course_html.append(f'<a class="course-card" href="{escape(course["Url"], quote=True)}" target="_blank" rel="noopener noreferrer"><span class="course-number">{i:02d}</span><h3>{bilingual(name, course["Title"])}</h3><span class="course-link">YouTube ↗</span></a>')
research_html = ''.join(f'<article class="research-card"><span class="card-number">{n}</span><h3>{bilingual(zh, en)}</h3><p>{bilingual(desc, desc_en)}</p><small>{escape(tags)}</small></article>' for n, zh, en, desc, desc_en, tags in research)
html = (ROOT / 'content/site_template.html').read_text(encoding='utf-8')
html = html.replace('{{HERO}}', (ROOT / 'content/hero_story.html').read_text(encoding='utf-8'))
html = html.replace('{{DIELECTRIC}}', (ROOT / 'content/dielectric_demo.html').read_text(encoding='utf-8'))
html = re.sub(r'\[\[(.*?)\|\|(.*?)\]\]', lambda match: bilingual(*match.groups()), html)
for key, value in {'JOURNAL_COUNT': str(pubs.journals), 'COURSE_COUNT': str(len(courses)), 'COURSE_UNIQUE_COUNT': str(len({course['Id'] for course in courses})), 'RESEARCH': research_html, 'PUBLICATIONS': ''.join(pubs.output), 'COURSES': ''.join(course_html)}.items():
    html = html.replace('{{' + key + '}}', value)
assert '{{' not in html
(ROOT / 'index.html').write_text(html, encoding='utf-8')
print(f'已產生 index.html：{pubs.journals} 篇期刊、{pubs.conferences} 筆研討會、{len(courses)} 筆教學連結。')
