# Embroidered word-patch footer

Status: research direction only. Do not implement without a separate build request.

## Source

This direction was supplied on 2026-07-25 as a framework-agnostic WebGL1
prototype. The prototype rasterizes overlapping word-shaped patches into an art
texture and a packed field texture, then lights them as thread in one fragment
shader.

The supplied prototype points to a weave image on an unverified `r2.dev` URL.
Do not ship that file until its provenance and redistribution terms are known.
Prefer a self-made seamless weave or a documented CC0 source such as:

- [Poly Haven Fabric Pattern 07](https://polyhaven.com/a/fabric_pattern_07)
- [ProcTexture plain weave](https://proctexture.com/textures/fabric/woven/plain-weave)

## Portfolio-specific direction

The footer becomes one final fabric sample, not another full-page scene:

- A dark, nearly flat textile field replaces the cutting mat only at the very
  end of the page.
- Three short embroidered word patches overlap in a loose diagonal stack.
- The preferred first copy test is `MADE / WITH / CARE`.
- Alternative copy tests are `ASK / MAKE / TINKER` and
  `DESIGNED / BUILT / HERE`.
- Keep email, social links, resume, and copyright as real DOM text beside or
  beneath the textile scene. The patches are a sign-off, not the footer's
  navigation.
- Use one restrained pointer-light sweep to reveal thread direction. Do not add
  floating physics, cursor replacement, autonomous patch motion, or sunlight.
- On touch, reduced motion, WebGL failure, or low-power fallback, show one
  complete static render.

## Material accuracy

A true merrowed border is normally used on simple shapes such as circles,
ovals, and rectangles. Intricate word silhouettes are more plausibly die-cut
and finished with an embroidered or satin edge. The desired thick white rim
should therefore be described as a **merrow-inspired overlock bead** or a
**raised satin border**, rather than a physically exact merrow.

Short, bold letterforms will survive the simulated embroidery better than
delicate serif details. Maintain open counters, generous spacing, and a minimum
visual stroke width. Avoid long phrases or small metadata inside the patches.

References:

- [American Patch: border selection](https://www.americanpatch.com/about/blog/general-information/how-to-design-your-embroidered-patches/)
- [Stomorica: merrowed versus die-cut borders](https://stomorica.eu/designing.html)
- [Pine & Bear chain-stitched name patches](https://pineandbear.co.uk/products/custom-chain-stitched-name-patch)
- [World Famous Original cut-felt word patches](https://worldfamousoriginal.com/products/mini-cut-felt-patches)

## Supplied engine audit

The core approach is viable:

- CPU Canvas 2D creates the colored scene and packed coverage/ink/rim/angle
  field.
- A WebGL1 fullscreen quad uses the weave, puff ramp, stitch angle, contact
  shadow, and cursor-directed light to create the textile reading.
- The field texture must remain unpremultiplied because its alpha channel stores
  stitch direction rather than compositing alpha.
- Capping the generated field near 1400 px and rebuilding during idle time is
  appropriate for a footer-sized effect.

However, the pasted engine does not itself provide every lifecycle behavior
claimed in its introduction. A future React wrapper must add:

- `IntersectionObserver` to start near the viewport and stop offscreen.
- `visibilitychange` handling to pause while the document is hidden.
- `ResizeObserver` with debounced scene rebuilds.
- `prefers-reduced-motion` handling that renders one still frame.
- A static Canvas 2D fallback when WebGL creation or shader compilation fails.
- WebGL context-loss handling.
- `aria-hidden="true"` on the decorative canvas and equivalent footer copy in
  semantic HTML.
- Cleanup for observers, media queries, events, textures, buffers, and the
  animation frame.

The CPU dilation and per-pixel gradient pass are acceptable when built once
while idle, but should not rerun continuously during resize. The existing
sunlight WebGL scene must also be paused or absent when this footer context is
active so the portfolio does not run two decorative render loops at once.

## Restraint rule

This effect owns the final footer moment only. Do not repeat embroidery on
project folders, reader controls, stickers, or the hero. The portfolio should
arrive at the fabric scene after a calmer reading experience, making the patches
feel like a small sewn signature rather than another layer of maximalism.
