"""Keep the platform's static header and footer identical across pages."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent / 'dist'
links = [('index.html', 'Home'), ('info.html', 'Missions'), ('solar.html', 'Solar System'), ('games.html', 'Games'), ('videos.html', 'Videos')]
for page in ROOT.glob('*.html'):
    html = page.read_text(encoding='utf-8')
    html = re.sub(r'(<body\b[^>]*?)\sdata-white-page="true"', r'\1', html)
    if page.name not in ('index.html', 'solar.html'):
        html = re.sub(r'<body\b', '<body data-white-page="true"', html, count=1)
    home = page.name == 'index.html'
    active = {'detail.html': 'info.html', 'quiz.html': 'info.html', 'missions.html': 'info.html', 'stories.html': 'info.html', 'rover.html': 'index.html'}.get(page.name, page.name)
    navigation = '\n'.join(f'      <a href="{href}"' + (' class="active" aria-current="page"' if active == href else '') + f'>{label}</a>' for href, label in links)
    header = f'''<header class="home-header{' home-header--transparent' if home else ''}" aria-label="Main navigation">
    <a class="home-brand" href="index.html" aria-label="EXSPACE home"><img src="assets/brand/exspace-logo-transparent.png" alt="EXSPACE"></a>
    <nav class="header-group" aria-label="Primary">
{navigation}
    </nav>
    <div class="header-group right">
      <a class="header-favorites" href="info.html?favorites=1" aria-label="Favorites" title="Favorites"><svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg></a>
      <a class="account-cta" href="login.html" data-account-link aria-label="Sign in" title="Sign in"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg></a>
      <a class="register-cta" href="register.html" data-register-link>Sign up</a>
    </div>
  </header>'''
    footer = '''<footer class="site-footer">
    <a class="site-footer-logo" href="index.html" aria-label="EXSPACE home"><img src="assets/brand/exspace-logo-transparent.png" alt="EXSPACE"></a>
    <nav aria-label="Footer navigation"><a href="info.html">Missions</a><a href="solar.html">Solar System</a><a href="games.html">Games</a><a href="videos.html">Videos</a></nav>
  </footer>'''
    if '<header' in html:
        html = re.sub(r'<header\b[\s\S]*?</header>', lambda _: header, html, count=1)
    else:
        html = html.replace('<body>', '<body>' + header, 1)
    if '<footer' in html:
        html = re.sub(r'<footer\b[\s\S]*?</footer>', lambda _: footer, html, count=1)
    elif '</main>' in html:
        html = html.replace('</main>', '</main>\n' + footer, 1)
    html = re.sub(r'\s*<link rel="stylesheet" href="css/site-chrome.css">', '', html)
    html = html.replace('</head>', '  <link rel="stylesheet" href="css/site-chrome.css">\n</head>')
    page.write_text(html, encoding='utf-8')
