"""從官網快照保留原文產生完整書目，不額外翻譯題目或人名。"""
from html.parser import HTMLParser
from html import escape
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

class Entries(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.parts = []
        self.entries = []

    def handle_starttag(self, tag, attrs):
        if tag == 'li':
            if not self.depth:
                self.parts = []
            self.depth += 1

    def handle_endtag(self, tag):
        if tag == 'li' and self.depth:
            self.depth -= 1
            if not self.depth:
                self.entries.append(re.sub(r'\s+', ' ', ''.join(self.parts)).strip())

    def handle_data(self, text):
        if self.depth:
            self.parts.append(text)

def official_entries():
    parser = Entries()
    parser.feed((ROOT / 'raw_html/snapshots/2026-10-17/publication-and-presentation.html').read_text(encoding='utf-8'))
    start = next(i for i, value in enumerate(parser.entries) if value.startswith('Jaysen Brian Susanto'))
    conference = next(i for i, value in enumerate(parser.entries) if value.startswith('Poster reviewer at'))
    journals = parser.entries[start:conference]
    journals = [value for value in journals if re.search(r'20\d\d', value)]
    talks = []
    for value in parser.entries[conference:]:
        if not re.match(r'(Poster|Oral|Invited|Session|Awarded)', value):
            break
        talks.append(value)
    assert (len(journals), len(talks)) == (30, 34), (len(journals), len(talks))
    return journals, talks

def render_publications():
    journals, talks = official_entries()
    output = []
    for kind, entries in [('journal', journals), ('conference', talks)]:
        for text in entries:
            # 只移除指標及重複貢獻註記，學術書目其餘原文保留。
            text = re.sub(r'\s*\((?:Impact Factor|Second |Third |Co-Corresponding).*?\)', '', text)
            quote = re.search(r'["“”](.*?)["“”]', text)
            service = kind == 'conference' and not quote
            title = quote.group(1).strip() if quote else text
            prefix = text[:quote.start()].strip(' ,') if quote else ''
            suffix = text[quote.end():].strip(' ,') if quote else ''
            presenter = re.search(r'(?:Presenter:|Pre\s*senter,)\s*([^,]+)', suffix, re.I)
            person = presenter.group(1).strip() if presenter else ''
            if presenter:
                suffix = (suffix[:presenter.start()] + suffix[presenter.end():]).strip(' ,')
            year = re.search(r'(?:19|20)\d{2}', suffix or text)
            year = year.group() if year else ''
            categories = kind
            lower = text.lower()
            if any(word in lower for word in ['polyimide', 'polymer', '高分子']): categories += ' polyimide'
            if any(word in lower for word in ['density functional', 'dft', 'first-principle', 'ab initio']): categories += ' dft'
            if any(word in lower for word in ['energy', 'solar', 'battery', 'photocatal', '光電']): categories += ' energy'
            if service:
                role = re.match(r'^(Poster reviewer|Session Chair)\b(.*)$', text)
                if role:
                    title = role.group(1)
                    prefix = role.group(2).strip()
                    suffix = ''
            if kind == 'journal':
                detail = f'<p class="pub-authors">{escape(prefix)}</p><p class="pub-meta">{escape(suffix)}</p>'
            else:
                detail = (f'<p class="pub-presenter">{escape(person)}</p>' if person else '') + f'<p class="pub-meta">{escape(prefix)}{(" · " + escape(suffix)) if suffix else ""}</p>'
            extra = ' pub-service' if service else ''
            output.append(f'<article class="pub-card{extra}" data-category="{categories}"><span class="pub-year">{year}</span><div class="pub-entry"><h4>{escape(title)}</h4>{detail}</div></article>')
    return ''.join(output)
