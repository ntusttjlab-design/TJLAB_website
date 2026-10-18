# PR #4 — Cinematic Members Hero Prototype

PR type: **Stacked Draft PR** into `academic-neutral-copy-20261018` (PR #3); **NOT** into `main`.

## Goal

Reinterpret the immersive, screen-sized scroll storytelling seen on high-production editorial websites, without copying brand artwork or using unapproved people photographs.

This proof of concept implements the **first** key scene only: complete viewport-sized **Members & Students** introduction → animated reveal into the actual **Lab Members** section. The photo gallery, games, leaderboard, and contact sections remain functional and naturally scrollable for comparative review.

## How it works

- First viewport: responsive full-screen hero inside the existing real `#members` section, with big display typography, navigational controls, and a unique laboratory-team abstract connected-nodes SVG.
- On scroll: GSAP ScrollTrigger briefly pins **this actual hero** (not a new intermediate section), expands/rotates the SVG, moves the previous copy out, and unveils a full-screen sage-green second state with `clip-path: circle(...)`. A new 'Lab Members' message and network illustration move into view.
- After the pin ends, the actual `#members-list` begins at a matching color and supplies the verified PI, PhD, master's, undergraduate and alumni categories. The text/list itself can scroll naturally.
- The remaining `#lab-life`, `#arcade`, `#members-contact` sections are unchanged apart from the first section's trailing color coordination.
- No fake student portraits. The symbols are deliberate abstract portraits and connectivity diagrams, not literal human depictions.
- For reduced-motion or disabled JavaScript: full first viewport still displays, there is no scroll pin, the next section is accessible by ordinary scrolling; all content remains readable.
- The existing motion toggle keeps its original preference storage. Anchor links, language controls, photo gallery, games, and leaderboard remain available.

## Acceptance checklist

1. At page load, the first viewport contains **only** the Members hero (no first member card).
2. Scrolling down transforms a first full-screen scene into a visibly different second scene (color, mask, visual scale, title).
3. The color at the end of the transition matches the first member section; no additional intermediate slide or section.
4. Scrolling back reverses the masked scene conversion. Mouse-wheel and touch have normal scrolling when reading member profiles/games.
5. User can disable animation and the design respects `prefers-reduced-motion`.
6. Chrome CI checks 390/1024/1440px, both languages, controls, absence of overflow, and team/scene structure.
7. Review visual pacing manually. CI cannot guarantee aesthetic quality or reproduce every browser device.

**Merge PR #4 into PR #3 only after user confirms; leave PR #3 and main untouched until then.**


## PR4.2 — real content replaces duplicate scene

Removed the decorative `cinematic-next` presentation entirely. The actual `#members-list` section is now the second scene, and its real PI, PhD, master’s, undergraduate and alumni content is revealed with a GSAP-controlled mask while the original hero transforms away. No pinned hero, no extra slide/section, no artificial scrolling distance. Exactly five real content sections remain siblings. Reduced motion leaves everything readable.


## PR4.3 — narrowly scoped second-to-third section color handoff

User requested no further first-screen or first-to-second changes. These are **untouched**. Only the existing `#lab-life` background now uses an overlay from pale sage to warm paper, driven by the existing photo-section ScrollTrigger. Its existing headline and album/empty-state reveal are preserved, with subtle movement like the academic overview. No interstitial, pin or extra section was created. Reduced motion and no JavaScript render the final warm color. Browser tests verify the second-to-third transition's overlay actually fades from transparent to opaque at timeline endpoints and no unrelated section is changed.
