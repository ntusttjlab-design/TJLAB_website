# PR #4 — Members page matches the Laboratory two-scene introduction

Latest confirmed direction: **Use exactly the same introductory layout and interaction paradigm as the Laboratory overview**, replacing scientific molecule / Si–O glass illustrations with original vector art of people and collaboration.

- The actual first `#members` section contains exactly one pinned `.story-stage` and two internal `.story-copy` states. There are two scene buttons `01 Team`, `02 Collaboration` and the same compact scroll progress and motion preference control as the Laboratory.
- Scene 1 uses connected team/person diagram nodes. Scene 2 uses collaboration groups and shared conceptual planning illustration, never unapproved portraits or fabricated student names.
- `assets/js/member-motion.js` follows the same `gsap.matchMedia`, scroll progress p=.15→1.85, pinned-stage and `show(progress)` model as `assets/js/story.js` without loading the overview's 3D rendering code.
- The stage's model text and illustration are synchronized with the chapter state, and chapter buttons jump to the two scenes. In reduced-motion mode they switch content directly; no pinning occurs.
- Following the single two-scene intro section, the actual member list, lab life gallery, games and contact remain direct sibling sections with original features, gentle academic reveals, and nuanced background colors.
- The site overview `index.html`, the original PR #3, and `main` remain unchanged. PR #4 is still a review-only stacked draft; merge to PR #3 only after the user approves the appearance.
- QA: 390/1024/1440px desktop/mobile, chapter state at mid-scroll, click buttons and reduced-motion, bilingual controls, no generated-HTML drift, photo gallery and games.
