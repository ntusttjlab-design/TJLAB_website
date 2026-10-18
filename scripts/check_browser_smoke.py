"""Run a dependency-free Chrome headless smoke check in GitHub Actions."""
from pathlib import Path
import shutil
import re
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
  fail(document.querySelectorAll('.game-card').length === 0, 'games-removed-from-overview');
  fail(document.querySelector('a[href="./members.html"]') !== null, 'members-link');
  fail(document.querySelectorAll('.pub-card').length === 64, 'publications');
  fail(document.querySelectorAll('.story-copy').length === 2 && document.querySelectorAll('[data-scene]').length === 2, 'two-scene-hero');
  fail(!document.querySelector('[data-model-label="2"]'), 'no-graphite');
  const chapters = ['pi','research','publications','tutorials','tutorial-resources','dielectric','join'].map(id=>document.getElementById(id));
  fail(chapters.every((node,i)=>node && (!i || !!(chapters[i-1].compareDocumentPosition(node)&Node.DOCUMENT_POSITION_FOLLOWING))), 'academic-first-order');
  fail(document.querySelector('.pi-statement')?.textContent.includes('Hello World！'), 'PI-original-translation');
  fail(document.querySelectorAll('.course-card').length === 16, 'courses');
  fail(document.querySelectorAll('.media-launch[data-collection="tutorial"]').length === 3, 'tutorials');
  fail(document.querySelectorAll('.media-launch[data-collection="gallery"]').length === 0, 'gallery-hidden');
  fail(document.querySelectorAll('.media-player iframe').length === 0, 'players-before-activation');
  fail(!document.querySelector('#gallery') && !document.querySelector('a[href="#gallery"]'), 'gallery-nav-or-section');
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
# Isolate browser functional checks from external CDN / YouTube availability.
# The real site remains unchanged; only this ephemeral test copy omits network scripts.
markup = re.sub(r'<script defer src="https://[^"]+"[^>]*></script>', '', markup)
tmp.write_text(markup.replace("</body>", script + "</body>"), encoding="utf-8")
try:
    for width in (390, 1024, 1440):
        proc = subprocess.run(
            [
                CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
                "--disable-dev-shm-usage", "--hide-scrollbars",
                "--disable-background-networking", "--host-resolver-rules=MAP * ~NOTFOUND",
                "--blink-settings=imagesEnabled=false", "--virtual-time-budget=1800",
                f"--window-size={width},900", "--dump-dom", tmp.as_uri()
            ],
            cwd=ROOT, capture_output=True, text=True, timeout=30
        )
        document = proc.stdout
        if 'data-smoke-status="pass"' not in document:
            marker = "data-smoke-issues="
            loc = document.find(marker)
            issues = document[loc:loc+220] if loc >= 0 else "missing smoke status"
            raise AssertionError(f"{width}px smoke failed; {issues}; exit={proc.returncode}; stderr={proc.stderr[-700:]}")
        print(f"PASS browser {width}px: resources, navigation, language and click-to-play")
    members_markup = (ROOT / "members.html").read_text(encoding="utf-8")
    members_script = """
<script>
document.addEventListener('DOMContentLoaded', () => {
 setTimeout(() => {
  const failures = [];
  const test = (good, label) => { if (!good) failures.push(label); };
  test(document.querySelectorAll('.member-category').length === 4, 'member-categories');
  test(document.querySelectorAll('.game-card').length === 2, 'game-cards');
  test(document.querySelectorAll('.pub-card').length === 0, 'no-publications');
  test(document.querySelector('a[href="./index.html"]') !== null, 'back-to-overview');
  test(document.querySelector('#student-resources') === null && document.querySelector('a[href="#student-resources"]') === null, 'resources-removed');
  test(document.querySelector('#lab-life') !== null, 'activity-gallery');
  test(document.querySelectorAll('.member-bridge,.member-transition-copy').length===0,'no-separate-slides');
  // Same two-scene hero design system as the academic Laboratory homepage.
  const flow=[...document.querySelectorAll('main > section[data-member-flow]')];
  test(flow.map(s=>s.id).join(',')==='members,members-list,lab-life,arcade,members-contact','five-real-topics');
  test(flow.slice(1).every((node,i)=>flow[i].nextElementSibling===node),'direct-neighbor-sections');
  test(!document.querySelector('.member-bridge,.cinematic-next'),'no-transition-slide');
  const header=document.querySelector('.site-header');
  const hero=document.querySelector('.members-story-stage');
  const usable=innerHeight-header.getBoundingClientRect().height;
  test(hero.getBoundingClientRect().height>=usable-6 && hero.getBoundingClientRect().height<=usable+100,
    'members-story-viewport:'+Math.round(hero.getBoundingClientRect().height)+'/'+Math.round(usable));
  test(document.querySelectorAll('#members .story-copy').length===2,'two-member-story-panels');
  test(document.querySelectorAll('#members [data-graphic]').length===2,'two-distinct-team-illustrations');
  test(document.querySelectorAll('#members [data-scene]').length===2,'two-chapter-buttons');
  test(document.querySelectorAll('#members [data-model-label]').length===2,'two-scene-labels');
  const story=window.ScrollTrigger?.getById('members-dual-story');
  test(!!story?.animation && !!story.vars.pin,'members-story-pinned-like-overview');
  test(hero.dataset.material==='0','story-begins-on-team');
  if(story?.animation){
   const timeline=story.animation;
   const original=timeline.progress();
   timeline.progress(.85).pause();
   test(hero.dataset.material==='1','scroll-swaps-to-collaboration');
   test(parseFloat(getComputedStyle(document.querySelector('[data-graphic="1"]')).opacity)>.85,'collaboration-illustration-visible');
   test(document.querySelector('#members .story-copy[data-step="1"]')?.style.visibility==='visible','collaboration-copy-visible');
   timeline.progress(original).pause();
  }
  test(document.body.dataset.memberFlow==='active','member-motion-active');
  test((window.ScrollTrigger?.getAll()||[]).filter(t=>(t.vars?.id||'').startsWith('member-flow-')).length===4,'four-academic-section-reveals');
  test(['members-list','arcade','members-contact'].every(id=>getComputedStyle(document.getElementById(id)).backgroundImage.includes('linear-gradient')),'subtle-section-gradients');
  const labLife=document.getElementById('lab-life');
  const photosTrigger=window.ScrollTrigger?.getById('members-photo-color-transition');
  test(!!photosTrigger?.animation,'lab-life-background-transition');
  const wash=labLife.querySelector('.lab-life-color-wash');
  test(!!wash && getComputedStyle(wash).backgroundImage.includes('linear-gradient'),'warm-background-overlay');
  if(photosTrigger?.animation){
    const timeline=photosTrigger.animation,was=timeline.progress();
    timeline.progress(0).pause();const initialOpacity=parseFloat(getComputedStyle(wash).opacity);
    timeline.progress(1).pause();const finalOpacity=parseFloat(getComputedStyle(wash).opacity);
    test(initialOpacity<.15&&finalOpacity>.85,'second-to-third-color-changes-with-scroll');
    timeline.progress(was).pause();
  }
  test(Math.abs(document.getElementById('members-list').getBoundingClientRect().width-document.documentElement.clientWidth)<4,'full-width-color');
  const motion=document.getElementById('members-motion-toggle');
  test(!!motion&&motion.getAttribute('aria-pressed')==='true','members-story-motion-control');
  motion?.click();
  test(document.body.dataset.memberFlow==='reduced','can-reduce-motion');
  test(!window.ScrollTrigger?.getById('members-dual-story'),'pinned-story-disabled-with-reduced-motion');
  const sceneButtons=[...document.querySelectorAll('#members [data-scene]')];
  sceneButtons[1]?.click();
  test(hero.dataset.material==='1','manual-chapter-2-works-with-reduced-motion');
  sceneButtons[0]?.click();
  test(hero.dataset.material==='0','manual-chapter-1-works-with-reduced-motion');
  motion?.click();
  test(document.body.dataset.memberFlow==='active','can-restore-motion');
  test(!!window.ScrollTrigger?.getById('members-dual-story'),'two-scene-timeline-restored');
  test(document.querySelector('#activity-empty') !== null && !document.querySelector('.activity-album'), 'gallery-empty-state');
  test(document.querySelector('#activity-lightbox') !== null, 'gallery-dialog');
  test(document.querySelector('a[href="#lab-life"]') !== null, 'activity-navigation');
  const lang = document.getElementById('language-toggle');
  lang.click();
  test(document.documentElement.lang === 'en', 'member-english');
  lang.click();
  test(document.documentElement.lang === 'zh-TW', 'member-chinese');
  const mobileMenu = document.getElementById('mobile-menu-btn');
  mobileMenu.click();
  test(mobileMenu.getAttribute('aria-expanded') === 'true', 'menu-open');
  mobileMenu.click();
  test(mobileMenu.getAttribute('aria-expanded') === 'false', 'menu-close');
  // Inject a test-only approved local thumbnail into the empty gallery to exercise the dialog.
  const testGallery = document.getElementById('activity-gallery');
  const testPhoto = document.createElement('button');
  testPhoto.type = 'button';
  testPhoto.className = 'activity-photo';
  testPhoto.dataset.activityPhoto = '';
  Object.assign(testPhoto.dataset, {
    titleZh:'測試活動', titleEn:'Test activity',
    altZh:'測試圖片', altEn:'Test image',
    captionZh:'測試照片說明', captionEn:'Test caption'
  });
  const testImage = document.createElement('img');
  testImage.src = './assets/images/pi-intro_img_1.png';
  testPhoto.appendChild(testImage);
  testGallery.appendChild(testPhoto);
  testPhoto.click();
  const lightbox = document.getElementById('activity-lightbox');
  test(lightbox.open, 'activity-lightbox-open');
  test(document.getElementById('activity-lightbox-caption').textContent === '測試照片說明', 'lightbox-caption');
  document.getElementById('activity-lightbox-close').click();
  test(!lightbox.open, 'activity-lightbox-close');
  testPhoto.remove();
  document.getElementById('snake-start-btn').click();
  test(document.getElementById('snake-status').textContent.length > 0, 'snake-start');
  document.getElementById('volley-start-btn').click();
  test(document.getElementById('volley-status').textContent.length > 0, 'paddle-start');
  document.getElementById('snake-pause-btn').click();
  test(document.documentElement.scrollWidth <= innerWidth + 5, 'horizontal-overflow');
  document.body.dataset.smokeStatus = failures.length ? 'fail' : 'pass';
  document.body.dataset.smokeIssues = failures.join(',');
 }, 900);
});
</script>
"""
    member_tmp = ROOT / "_member_browser_smoke.html"
    members_markup = re.sub(r'<script defer src="https://[^"]+"[^>]*></script>', '', members_markup)
    member_tmp.write_text(members_markup.replace("</body>", members_script + "</body>"), encoding="utf-8")
    try:
        for width in (390, 1024, 1440):
            proc = subprocess.run(
                [CHROME, "--headless=new", "--no-sandbox", "--disable-gpu",
                 "--disable-dev-shm-usage", "--hide-scrollbars",
                 "--disable-background-networking", "--host-resolver-rules=MAP * ~NOTFOUND",
                 "--blink-settings=imagesEnabled=false", "--virtual-time-budget=1800",
                 f"--window-size={width},900", "--dump-dom", member_tmp.as_uri()],
                cwd=ROOT, capture_output=True, text=True, timeout=30
            )
            document = proc.stdout
            if 'data-smoke-status="pass"' not in document:
                marker = "data-smoke-issues="
                loc = document.find(marker)
                issues = document[loc:loc+230] if loc >= 0 else "missing smoke status"
                raise AssertionError(f"members {width}px smoke failed; {issues}; exit={proc.returncode}; stderr={proc.stderr[-700:]}")
            print(f"PASS members {width}px: navigation, i18n, games and responsive layout")
    finally:
        member_tmp.unlink(missing_ok=True)
finally:
    tmp.unlink(missing_ok=True)
