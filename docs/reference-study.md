# FufuLauncher homepage source study

Repository: https://github.com/FufuLauncher/Official_website

Downloaded with shallow git clone into `temp/reference-fufulauncher` (ignored research copy), commit `0cc66f8bc695ee63d387781a195cdcb57dd96493`. The initial Windows Schannel credential error was resolved by using Git's OpenSSL backend; certificate verification remained enabled. No reference dependencies were installed or scripts executed.

## Findings and XDYou adaptation

- `src/components/FeaturesSection.vue`: feature blocks use sticky positioning, top 0, min-height 100vh, stacking z-index and rounded top edges. XDYou uses fixed viewport-sized pages with reserved navbar space, original black/white backgrounds and responsive image fitting. Natural-flow anchor markers make previous-page navigation reliable.
- `src/App.vue`: IntersectionObserver triggers entry reveals with opacity, translation and small scale changes. XDYou uses this visual pattern for the downloads and developer invitation, using CSS and a small observer rather than adopting the reference animation stack.
- `src/components/ContributorsSection.vue`: grid-distributed randomized positions, GSAP floating and hover emphasis. XDYou keeps its existing source-backed contributor list and dialogs; seeded best-candidate circle packing scatters avatars across the available screen without grid cells. Sizes adapt to available area. Focus/hover/offscreen/reduced-motion control motion; no pause button is shown.
- The reference does not contain a separate downloads page component: its download call to action is the final feature block. The XDYou download transition is an adaptation of that stacked reveal, not a claim of an identical download-specific effect.

The reference repository is MIT licensed (Copyright 2026 FufuLauncher); its LICENSE is retained with the downloaded research copy. Implementation here was written for the existing React components, without copying the reference background assets, GSAP code or third-party application preview.

## Verification

Desktop 1440×900: introduction pages measure 820px and use sticky positioning. Mobile 390×844: all four pages measure one 844px viewport with no content overflow. Hero directory hidden, content directory visible. Both developer links verified. All 42 contributor triggers present; contributor detail dialog checked; browser warning/error log empty. Production build, typecheck, ESLint and 11 tests passed. No commit, push or deployment performed.


## Behind the Code adaptation

Reviewed `src/components/StorySection.vue`: left-aligned eyebrow/title/prose alongside a bordered quote panel. XDYou uses that two-column composition for the join section, but replaces the quote with three actionable contribution entry points grounded in its own contribution guide. No fabricated team quote or reference assets are included. Join and contributor headings now share a smaller, left-aligned component.
