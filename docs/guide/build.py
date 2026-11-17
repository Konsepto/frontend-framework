"""Builds the Protosite user guide (build/protosite-opas.html) with live component previews.
Run build-css.mjs first (npm run build does both)."""
import html, re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from components import COMPONENTS

FW = os.path.normpath(os.path.join(HERE, '..', '..')) + '/'
esc = html.escape

def code(text, lang=''):
    return f'<div class="code"><button class="copy" type="button">Kopioi</button><pre><code>{esc(text.strip())}</code></pre></div>'

def table(head, rows):
    h = ''.join(f'<th>{c}</th>' for c in head)
    b = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in r) + '</tr>' for r in rows)
    return f'<div class="table-wrap"><table><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table></div>'

# --- settings reference parsed from settings.css ---
settings = open(FW + 'theme-default/css/settings.css').read()
media_rows = [(f'<code>{n}</code>', f'<code>{q}</code>') for n, q in re.findall(r'@custom-media (--[a-z0-9-]+) ([^;]+);', settings)]
root = settings[settings.index(':root'):]
prop_rows, group = [], ''
for line in root.split('\n'):
    m = re.match(r'\s*/\* (.+?)(?: \(.*)?\*/', line)
    if m: group = m.group(1); continue
    m = re.match(r'\s*(--ff-[a-z0-9-]+):\s*(.+);', line)
    if m:
        val = m.group(2)
        swatch = f'<span class="sw" style="background:{val}"></span>' if re.fullmatch(r'#[0-9A-Fa-f]{6}', val) else ''
        prop_rows.append((group, f'<code>{m.group(1)}</code>', f'{swatch}<code>{esc(val)}</code>'))

# --- components ---
nav_groups, comp_html, templates = {}, [], []
for c in COMPONENTS:
    nav_groups.setdefault(c['group'], []).append((c['id'], c['title']))
    parts = [f'<section class="component" id="{c["id"]}"><h3>{c["title"]}</h3>', c['desc']]
    if c.get('demo'):
        templates.append(f'<template id="t-{c["id"]}">{c["demo"]}</template>')
        parts.append(f'''<div class="preview" data-demo="t-{c['id']}">
  <div class="preview-bar"><span>Esikatselu</span><div class="seg" role="group" aria-label="Esikatselun leveys">
    <button type="button" class="w on" data-w="wide" aria-pressed="true">Leveä</button><button type="button" class="w" data-w="375" aria-pressed="false">375 px</button></div></div>
  <div class="stage"><iframe title="Esikatselu: {esc(c['title'])}" loading="lazy"></iframe></div>
</div>''')
        parts.append('<h4>HTML</h4>' + code(c['demo']))
    if c.get('code'):
        parts.append('<h4>JavaScript</h4>' + code(c['code']))
    parts.append('<div class="meta">')
    parts.append('<div><h4>Luokat</h4><dl class="classes">' + ''.join(f'<dt><code>{esc(k)}</code></dt><dd>{v}</dd>' for k, v in c['classes']) + '</dl></div>')
    side = '<div><h4>Tiedostot</h4><ul class="files">' + ''.join(f'<li><code>{f}</code></li>' for f in c['files']) + '</ul>'
    if c['settings']:
        side += '<h4>Asetukset</h4><ul class="files">' + ''.join(f'<li><code>{s}</code></li>' for s in c['settings']) + '</ul>'
    parts.append(side + '</div></div></section>')
    comp_html.append('\n'.join(parts))

comp_nav = ''.join(f'<li class="navgroup">{g}</li>' + ''.join(f'<li><a href="#{i}">{t}</a></li>' for i, t in items) for g, items in nav_groups.items())
comp_index = ''.join(f'<div class="cgroup"><h4>{g}</h4><ul>' + ''.join(f'<li><a href="#{i}">{t}</a></li>' for i, t in items) + '</ul></div>' for g, items in nav_groups.items())

demo_css = open(HERE + '/build/framework-demo.css').read().replace('</', '<\\/')

page = open(HERE + '/template.html').read()
page = (page.replace('{{COMPONENTS}}', '\n'.join(comp_html))
            .replace('{{COMP_NAV}}', comp_nav)
            .replace('{{COMP_INDEX}}', comp_index)
            .replace('{{TEMPLATES}}', '\n'.join(templates))
            .replace('{{MEDIA_TABLE}}', table(['Nimi', 'Oletus (frameworkin settings.css)'], media_rows))
            .replace('{{PROP_TABLE}}', table(['Ryhmä', 'Muuttuja', 'Oletusarvo'], prop_rows))
            .replace('{{DEMO_CSS}}', demo_css))
# code blocks written in the template as <pre data-code>…</pre>
page = re.sub(r'<pre data-code>(.*?)</pre>', lambda m: code(html.unescape(m.group(1))), page, flags=re.S)
open(HERE + '/build/protosite-opas.html', 'w').write(page)
print(len(page))
