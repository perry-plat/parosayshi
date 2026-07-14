# Design Reference Ledger

This is the working visual and interaction reference set for Parosayshi. References are recorded for the principle they contribute, not as templates to reproduce literally.

## Current synthesis

The folio should feel like a small publishing house after a very productive deadline:

- **Structure:** case studies are distinct book objects scattered over a quieter catalog sheet.
- **Movement:** objects lift and reveal their depth; the work is available immediately, without a loading performance.
- **Material:** covers, spines, page blocks, print registration marks, notes, and visible construction.
- **Identity:** every project gets its own cover color while the underlying publishing system stays consistent.
- **Restraint:** the table can be unruly, but each book cover and opened case study must remain legible.

## Interaction references

### Stripe Press

- Reference: [press.stripe.com](https://press.stripe.com/) and [Yuin Chien's design notes](https://yuinchien.com/p/stripe-press)
- Contribution: books are treated as tactile, dimensional interfaces rather than thumbnail cards. Their covers and spines create identity before any synopsis is read.
- Use here: each case study becomes a bound edition with its own color, cover hierarchy, page depth, and physical hover behavior.
- Deliberate divergence: Stripe Press uses a controlled black shelf. Parosayshi uses a top-down working table where editions overlap, rotate, and cross the catalog sheet.
- Avoid: reproducing Stripe Press's stack, lighting, or dark palette literally.

### Codrops 3D book studies

- Reference: [3D Book Showcase](https://tympanus.net/codrops/2013/01/08/3d-book-showcase/) and [Animated Books with CSS 3D Transforms](https://tympanus.net/codrops/2013/07/11/animated-books-with-css-3d-transforms/)
- Contribution: convincing book depth comes from separate cover, spine, page block, and edge planes sharing one perspective—not from a heavy drop shadow alone.
- Use here: shallow 3D cover lift, visible fore-edge and bottom pages, a darker spine plane, and a restrained hover tilt.
- Avoid: fully opening every book on hover or letting the 3D treatment delay access to the case study.

### Three.js focused book object

- Reference: [transparent WebGL canvas](https://threejs.org/manual/en/tips.html#making-the-canvas-transparent), [WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html), and [RoundedBoxGeometry](https://threejs.org/docs/pages/RoundedBoxGeometry.html).
- Contribution: the selected case-study cover is rendered as actual front and back boards, a page block, spine, and edge planes while the renderer remains fully transparent.
- Use here: Three.js owns only the focused closed-book moment; the table remains accessible HTML/CSS and the case-study reader remains DOM content.
- Avoid: a floor plane, scene background, shadow receiver, or one WebGL context per book on the table.

### Poly Haven wood table

- Reference: [Wood Table](https://polyhaven.com/a/wood_table)
- Contribution: broad tonal variation, fine linear grain, occasional knots, and quiet seams make a surface read as wood without competing with the objects on it.
- Use here: low-contrast layered grain and board seams generated in CSS so the table remains lightweight and subordinate to the books.
- Avoid: photorealistic knots or high-contrast planks underneath cover typography.

### Holographic sticker treatments

- Reference: [Effect.Labs CSS holographic study](https://effect-labs.com/en/pages/blog/effet-holographique-css.html) and [StickerApp's material guide](https://stickerapp.ca/blog/sticker-academy/design-holographic-stickers-that-stand-out)
- Contribution: layered gradients and moving highlights can suggest iridescent foil, but solid high-contrast artwork should control where the shine appears.
- Use here: the existing Parosayshi wordmark SVG remains readable while a masked, low-opacity spectrum moves only inside its sticker silhouette.
- Avoid: a full-width rainbow header or shine strong enough to wash out the wordmark.

### Folding the DOM / tri-fold mechanics

- Reference: [Josh Comeau's *Folding the DOM*](https://www.joshwcomeau.com/react/folding-the-dom/) and [Adobe's tri-fold layer explanation](https://community.adobe.com/questions-529/how-to-make-trifold-page-turn-animation-52453)
- Contribution: convincing folds come from separate panels with perspective and transform origins placed on the physical hinges.
- Use here: the catalog arrives as three equal paper panels; the right and left leaves unfold around the center before the printed content appears.
- Avoid: bringing back a blocking loader or rotating the whole tabletop during the interaction.

### Re:Structure / the book as a performative object

- Reference: [Bianca Graphic Design](https://bianca-graphic-design.com/projects/restructure)
- Contribution: a digital book should change how the reader approaches and navigates the content, not merely decorate a link with a cover.
- Use here: the object is the invitation to the case study; lifting a book, opening it, and returning it to the table form one continuous interaction.
- Avoid: making dimensionality more important than legibility or keyboard access.

### Stages / a monograph in many formats

- Reference: [David Kohn Architects' *Stages*](https://www.wallpaper.com/architecture/david-kohn-architects-book-stages-uk)
- Contribution: one portfolio can be a coherent publication while letting each project take on its own format, scale, and visual voice.
- Use here: consistent publisher marks, numbering, and cover anatomy hold the library together while individual projects get distinct proportions and palettes.
- Avoid: forcing every case study into an identical card or book size.

### Daily Dispatch

- Reference: [dailydispatch.app](https://www.dailydispatch.app/)
- Contribution: the homepage behaves as a physical sheet; opened stories sit above it as separate pages.
- Use here: case-study reader choreography, background-page repositioning, and the relationship between the index and opened story.
- Avoid: cloning its product layout or letting every transition rotate the full document.

### Matthew Yu sketchbook

- Reference: [site](https://matthewyu.dev/) and [hero video](https://x.com/matthewyuart/status/2076105332108231087/video/1)
- Contribution: preloaded images, a fixed spine, and a real half-page `rotateY` turn with a brief directional smear.
- Use here: the `Sketchbook` section and future photo/notebook material.
- Avoid: treating the whole folio as a carousel.

### StPageFlip

- Reference: [Nodlik/StPageFlip](https://github.com/Nodlik/StPageFlip)
- Contribution: corner-driven fold geometry, soft and hard paper densities, moving inner/outer shadows, touch dragging, and portrait/landscape switching.
- Use here: the notebook engine when a genuinely deforming page matters more than matching Matthew Yu's rigid half-turn exactly.
- Avoid: using it for full-page navigation or turning every case study into a book.

## Analog collage references

### More analog collages

- Reference: [Oliver Hamrin](https://x.com/oliverhamrin/status/2075965093511102465)
- Contribution: found-image combinations, torn apertures, catalogue typography, and deliberately mismatched scales.
- Best home: the future photography/experiments section, where one composed spread can interrupt the cleaner newspaper grid.
- Rule: use actual masks and layered assets; do not fake tactility with generic grain over everything.

### 25 unused posters and covers

- Reference: [Oliver Hamrin](https://x.com/i/status/2050895281428820389)
- Contribution: dense poster composition, type that acts as image, nested frames, and repeated source material.
- Best home: case-study chapter covers, selected-work thumbnails, or a rotating archive of unused explorations.
- Rule: keep body copy quiet. The expressive type belongs to covers and dividers.

### Edge cover shader study

- Reference: [Oliver Hamrin](https://x.com/i/status/2075561040155160957)
- Contribution: a simple collage transformed through a small family of controlled distortions rather than many unrelated effects.
- Best home: a single transition inside the photo archive or an optional hover on one experimental cover.
- Rule: the source collage must already work when motion is disabled; shader treatment is an enhancement.

## Typography and system references

### Anthrogen web exploration board

![Anthrogen web exploration board](public/assets/references/anthrogen-web-exploration.png)

- Reference: user-provided visual board, saved as `public/assets/references/anthrogen-web-exploration.png`.
- Contribution: a measured editorial serif paired with compact mono metadata; generous white space; thin construction rules; dark ink; and small geometric corner marks.
- Use here: future type-system passes across the masthead, project cards, case-study pages, labels, dates, and calls to action.
- Accent cue: reserve electric blue for useful actions, links, or annotations rather than treating it as a general palette.
- Avoid: copying the biotech voice or layout literally, overusing blue, or replacing the folio's personal newspaper character.

## Identity and color references

### Quartr identity motion

- Reference: [Oliver Hamrin](https://x.com/i/status/2074827273706836165)
- Contribution: identity revealed through construction lines, spacing logic, and confident but short motion.
- Best home: a future Parosayshi wordmark study, issue transition, or tiny masthead detail.
- Rule: keep it separate from page loading. Brand motion should not delay access to the folio.

### Blue things archive

- Reference: [Oliver Hamrin](https://x.com/i/status/2072697085061660994)
- Contribution: one saturated color tying together objects from different eras and media.
- Best home: the existing Resume blue, selected annotations, links, and one physical object within a collage.
- Rule: blue is punctuation, not the paper color.

## Placement map

| Folio area | Reference influence | Intended treatment |
| --- | --- | --- |
| Homepage table | Stripe Press + working-desk references | Distinct book editions scattered over a catalog sheet |
| Case-study opening | Daily Dispatch | Separate foreground sheet over a shifted homepage |
| Sketchbook | Matthew Yu | Preloaded half-page flip with a fixed spine |
| Photography / experiments | Analog collage posts | One tactile layered spread with torn masks and scans |
| Case-study chapter covers | Poster archive | Expressive typography and nested image frames |
| Brand details | Quartr motion | Short construction-based reveal, only when useful |
| Accent system | Blue archive | Focused blue punctuation across otherwise neutral surfaces |

## Decision filter

Before bringing in a reference, ask:

1. Does it strengthen the personal-publication idea?
2. Is there one clear place where it owns the moment?
3. Does the static version still feel complete?
4. Can it remain readable and usable on mobile?
5. Are we borrowing a principle rather than reproducing someone else's composition?
