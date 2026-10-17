"""Run a dependency-free Chrome headless smoke check in GitHub Actions."""
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
CHROME = shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")
if not CHROME:
    raise SystemExit("Chrome/Chromium missing: cannot verify browser behavior")
markup = (ROOT / "index.html").read_text(encoding="utf-8")
script = """
<script>
document.addEventListener('DOMContentLoaded', () => {
 setTimeout(() => {
  const errors = [];
  const fail = (ok, label) => { if (!ok) errors.push(label); };
  fail(document.querySelectorAll('.pub-card').length === 64, 'publications');
  fail(document.querySelectorAll('.course-card').length === 16, 'courses');
  fail(document.querySelectorAll('.media-launch[data-collection="tutorial"]').length === 17, 'tutorials');
  fail(document.querySelectorAll('.media-launch[data-collection="gallery"]').length === 8, 'gallery');
  fail(document.querySelectorAll('.media-player iframe').length === 0, 'players-before-activation');
  const toggle = document.getElementById('language-toggle');
  toggle.click();
  fail(document.documentElement.lang === 'en', 'English-translation');
  toggle.click();
  fail(document.documentElement.lang === 'zh-TW', 'Chinese-translation');
  const menu = document.getElementById('mobile-menu-btn');
  menu.click();
  fail(menu.getAttribute('aria-expanded') === 'true', 'menu-open');
  menu.click();
  fail(menu.getAttribute('aria-expanded') === 'false', 'menu-close');
  const launch = document.querySelector('.media-launch[data-collection="tutorial"]');
  launch.click();
  fail(document.querySelectorAll('.media-player iframe').length === 1, 'player-activation');
  fail(document.documentElement.scrollWidth <= window.innerWidth + 5, 'horizontal-overflow');
  document.body.dataset.smokeStatus = errors.length ? 'fail' : 'pass';
  document.body.dataset.smokeIssues = errors.join(',');
 }, 900);
});
</script>
"""
assert "</body>" in markup
tmp = ROOT / "_browser_smoke.html"
tmp.write_text(markup.replace("</body>", script + "</body>"), encoding="utf-8")
try:
    for width in (390, 1024, 1440):
        proc = subprocess.run(
            [
                CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
                "--disable-dev-shm-usage", "--hide-scrollbars",
                "--disable-background-networking", "--virtual-time-budget=2500",
                f"--window-size={width},900", "--dump-dom", tmp.as_uri()
            ],
            cwd=ROOT, capture_output=True, text=True, timeout=60
        )
        document = proc.stdout
        if 'data-smoke-status="pass"' not in document:
            marker = "data-smoke-issues="
            loc = document.find(marker)
            issues = document[loc:loc+220] if loc >= 0 else "missing smoke status"
            raise AssertionError(f"{width}px smoke failed; {issues}; exit={proc.returncode}; stderr={proc.stderr[-700:]}")
        print(f"PASS browser {width}px: resources, navigation, language and click-to-play")
finally:
    tmp.unlink(missing_ok=True)
