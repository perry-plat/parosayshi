# Superr / exp

A separate homepage card; the existing Superr case study is unchanged by this addition.

## Current presentation

- Device recordings for profile icons, draggable toolkit, ToC, bookmarks, colorpad and notebook AI chat.
- Interactive periodic table from the original SuperrBook HTML5 book.
- Portrait recordings retain 5:8. The periodic table retains its original 8:5 landscape viewport.
- Native recordings are kept in `artifacts/superr-recordings/`. Web videos and posters live in `public/assets/superr-experiments/recordings/`.
- Capture device: SuperrBook `NHDE092591000239`, 1200 × 1920, Android density 240.
- Build: `ai.superr.launcher.dev`, `hqDebug`, versionCode 2684, `v1.19-15-g4b0f4b5d5-dirty-hq-dev`.
- Notebook demonstrations use a newly created EXP notebook. Profile footage shows the existing notebook library context.
- No deployment or publishing is included.

## Retained interactive draft

`src/components/superr-experiments/SuperrInteractiveDraft.tsx` and its supporting components preserve the exploratory web ports. They are not mounted in the website. These were approximations, not verified pixel-identical copies, and were superseded by device captures at the user's request.

## Periodic table provenance

Copied from SuperrBook `origin/feat/library-launch` at `2bb1d72aef4b659dc8b5b8916340bca7943dce20`, under `app/src/main/assets/html5-books/periodic-table/`. Includes original element data, CSS, fonts, grid/detail JavaScript and Bohr animation. Browser adaptations cover accessible buttons, close messaging, history replacement, reduced motion and page visibility. Its landscape manifest is preserved.

## UI implementation

`SuperrExperimentsCard.tsx` owns the card and modal. `DeviceViewport.tsx` proportionally fits the actual device rectangle; it never reflows the interface. Video controls render at browser size rather than being scaled with device pixels. Only the selected recording mounts, so switching demos stops previous playback. Reduced-motion preference disables autoplay.
