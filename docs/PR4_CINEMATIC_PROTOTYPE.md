# PR #4 — Members page matches the Laboratory two-scene introduction

Latest confirmed direction: **Use exactly the same introductory layout and interaction paradigm as the Laboratory overview**, replacing scientific molecule / Si–O glass illustrations with original vector art of people and collaboration.

- The actual first `#members` section contains exactly one pinned `.story-stage` and two internal `.story-copy` states. There are two scene buttons `01 Team`, `02 Collaboration` and the same compact scroll progress and motion preference control as the Laboratory.
- Scene 1 uses connected team/person diagram nodes. Scene 2 uses collaboration groups and shared conceptual planning illustration, never unapproved portraits or fabricated student names.
- `assets/js/member-motion.js` follows the same `gsap.matchMedia`, scroll progress p=.15→1.85, pinned-stage and `show(progress)` model as `assets/js/story.js` without loading the overview's 3D rendering code.
- The stage's model text and illustration are synchronized with the chapter state, and chapter buttons jump to the two scenes. In reduced-motion mode they switch content directly; no pinning occurs.
- Following the single two-scene intro section, the actual member list, lab life gallery, games and contact remain direct sibling sections with original features, gentle academic reveals, and nuanced background colors.
- The site overview `index.html`, the original PR #3, and `main` remain unchanged. PR #4 is still a review-only stacked draft; merge to PR #3 only after the user approves the appearance.
- QA: 390/1024/1440px desktop/mobile, chapter state at mid-scroll, click buttons and reduced-motion, bilingual controls, no generated-HTML drift, photo gallery and games.


## PR #4 update: user-approved game/footer simplification

- Rename section **元素互動遊戲 → 舒壓小遊戲** / **Relaxing Mini Games**; keep Element Snake and Element Paddle Rally names and scoring rules unchanged.
- Embedded Google Apps Script leaderboard formerly included its own `record-language` button. Remove that second button and retain the host website's existing `languagechange → msmtjl-language` postMessage link. Directly opening the standalone Apps Script app still supports the `?lang=` initial language.
- Eliminate nested iframe scrollbar via generated GAS source using `html,body{overflow:hidden}` plus intrinsic-content `ResizeObserver` height broadcast. The outer page accepts all plausible heights up to 15,000px without old 4,000px clipping, sets `scrolling=no`, and refreshes ScrollTrigger only when height changes.
- Enforce `[hidden]` CSS on both `games-grid` (native fallback) and `arcade-frame` (GAS) because existing author `display` rules can otherwise override browser hidden defaults.
- Remove the duplicated Members `#members-contact` section. Footer links to the complete verified contact info at `./index.html#join`. Keep other sections, bilingual intro animations, games, leaderboard, and photo albums.
- **Deployment caveat**: the PR updates `backend/google-apps-script/Arcade.html` and `Code.gs` in GitHub, but the live Google Apps Script URL remains the previously deployed version until the Apps Script deployment is updated by an authorized editor. The PR preview can validate the host sizing and local markup; it cannot immediately suppress the old EN button inside the cross-origin deployed game iframe.
- No merge to PR3/main without user approval.

- Language messages are accepted only from the approved production GitHub Pages and PR4 RawGitHack preview origins (plus localhost dev). The embedded app still requires redeployment for source changes to take effect.


## PR4.7 — Solid backgrounds aligned with the Laboratory overview

- Removed the 100–210px background gradients between the actual member list, lab-life gallery, mini-games and footer. Each section now has a solid muted academic color (#dfeae0, #f1f2ee, #19232a, #faf9f6 respectively).
- Removed the PR4.4 lab-life warm color-wash overlay and its dedicated GSAP timeline, plus the subtle decorative radial highlight at section boundaries. These were responsible for the unwanted gradient bands.
- The two-scene GSAP/SVG Team–Collaboration hero, 01/02 chapter buttons, content title/card animations, images, games, leaderboard and bilingual behavior are unchanged.
- CI now explicitly checks computed background colors and `backgroundImage: none` at 390/1024/1440px, and that no gallery wash trigger/element is present.
- Updates are limited to the PR #4 experiment branch; PR #3 and main remain unchanged.
