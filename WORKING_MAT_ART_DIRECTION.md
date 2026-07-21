# The Working Mat

## Recommended direction

The homepage should feel like a **print-production workbench caught between tasks**: physically believable enough that the objects have weight, but graphically strange enough that it still feels authored by Parosayshi.

This is not a literal desk simulator and it is not a physics game. It is a publishing interface where every physical object has a clear role.

The core visual equation is:

> **physical truth + editorial weirdness**

- Physical truth comes from consistent light, contact, overlap, material edges, scale, and weight.
- Editorial weirdness comes from tilted compositions, giant type, odd labels, translucent colour, annotations, and occasional playful tools.

The scene should remain calm until the user touches something.

## Why the current scene feels artificial

The mat itself is convincing, but the objects currently behave like flat assets pasted at coordinates.

1. **The manifesto sheet is too perfect.** It is a clean rectangle with an even surface and a broad shadow. Real paper usually reveals itself through local contact: one edge catches light, one corner lifts, or a slight curl changes the shadow.
2. **Every object occupies the same conceptual layer.** The paper, publication, sticker, and controls do not yet communicate different weights or materials.
3. **The colour switcher reads as interface chrome.** A pill with circular buttons floats over the physical scene instead of belonging to it.
4. **Nothing explains what can move.** Hoverable, clickable, and decorative objects need different responses.
5. **The scene has effects but not enough relationships.** Realism is produced by one thing covering, pressing, reflecting, or revealing another.

## The hierarchy of objects

Only a few objects should be present, and each level should behave differently.

| Level | Objects | Purpose | Behaviour |
| --- | --- | --- | --- |
| Anchor | Manifesto/catalogue sheet | Introduces the portfolio and organizes the scene | Mostly inert; tiny edge response only |
| Primary artifacts | Case-study books and frosted folders | Open the work | Lift, clarify, and transform into the reader |
| Working tools | Inspection loupe, acetate colour swatches | Offer a useful alternate way to inspect or customize | Constrained drag or tap |
| Ephemera | Name sticker, binder clip, paperclip, tape, registration scraps | Add personality and explain construction | Small pressure, peel, or metallic response |
| Optional toy | One puck or ball | Gives the empty mat a little life | Flickable only in unused margins |

The primary artifacts must remain the strongest and easiest targets. A visitor should never wonder whether a toy is the portfolio navigation.

## Signature interaction: the inspection loupe

The strongest playful interaction is not the ball. It is a **small acrylic inspection loupe** that lets the user reveal what is beneath a finished artifact.

Why it belongs:

- It is connected to product-design practice: inspecting details, states, revisions, and systems.
- It gives the frosted-folder idea a functional reason to exist.
- It creates surprise without interrupting reading.
- It gives the saved process-history treatment a natural trigger.

### Behaviour

1. The loupe rests partly off the manifesto sheet in an empty mat area.
2. On hover, its edge catches one crisp highlight and the handle rises by roughly 3–4 px.
3. It can be dragged within the mat.
4. Passing it over a marked area reveals one alternate layer through a circular mask:
   - a rejected cover,
   - an early wireframe,
   - a launch note,
   - a before/after state,
   - or the found case-file scan treatment already saved for process history.
5. Outside a valid inspection region, the lens only produces a very small magnification/refraction response. It does not distort the whole page.
6. On touch devices, the user taps an `inspect` annotation and then taps the marked object. No precision dragging is required.

This should be limited to three or four discoveries. Scarcity makes the interaction feel intentional.

## Secondary interaction: the optional desk puck

A small weighted puck or ball can work later as an ambient toy, but it should be clearly subordinate.

- It lives only in the empty mat margins.
- The user can drag and flick it with inertia.
- It does not collide with books, block links, or trigger navigation.
- It pauses when a case study opens, when the tab is hidden, or when reduced motion is enabled.
- It disappears on narrow screens.

Start with Motion's drag momentum and bounds. Add a 2D physics engine only if real collisions become important. Do not introduce WebGL or a physics engine for the core publication interactions.

## Object interaction grammar

### Case-study books and folders

**Rest**

- Tight contact shadow.
- Cover and underlying page block remain aligned.
- Rotation is part of the composition, not a continuous animation.

**Hover**

- Lift 5–8 px.
- Rotate by no more than 1–1.5 degrees toward the pointer.
- Contact shadow becomes slightly darker and narrower near the spine, while a softer lifted shadow appears underneath.
- Frosted folders shift the insert beneath the shell by 3–5 px, making the translucency legible.
- A tiny annotation may appear near the object: `OPEN FILE`, `READ 16 PAGES`, or `INSPECT`.

**Press**

- The object compresses by roughly 1–2 px before release.
- The highlight and shadow react from the actual pointer location.

**Open**

- The clicked object itself becomes the full-screen reader through one shared-element transition.
- It rises, rotates to zero, and scales into place.
- The cover may move upward or outward to reveal the publication, but no duplicate object should remain on the mat.
- The mat and manifesto sheet stay fixed. They do not rotate, blur, or perform a second animation.

**Close**

- Reverse the same path quickly.
- Restore scroll immediately.
- Return the same object to the same position and rotation.

### Manifesto sheet

- Do not make the whole sheet draggable.
- Use local edge behaviour: one corner can lift by 2–3 px as the pointer approaches it.
- Introduce extremely slight edge irregularity or curl, not a global wavy shader.
- Use contact occlusion at two or three edge sections rather than one large rectangular shadow.
- Keep the typography completely stable.

### Sticker

- Crisp die-cut edge and a small glossy sweep.
- A corner may peel by a few pixels on hover.
- It can remain clickable for home/about, but should not float or bob continuously.

### Acetate colour swatches

Replace the current pill switcher with a short fan or stack of translucent plastic chips.

- Each chip corresponds to a mat colour.
- The selected chip sits slightly forward.
- Hover separates the fan enough to expose the colours.
- Clicking a chip changes the mat immediately.
- The chips remain real buttons with labels for keyboard and screen-reader users.

This turns configuration UI into an object that belongs to the workbench.

### Binder clip or paperclip

Use only one.

- It should visibly pin a small note, résumé slip, or contact card.
- Metal needs one sharp highlight and one tight shadow; avoid generic gray gradients.
- Clicking the attached note, not the clip itself, performs the action.

### Rubber stamp

An optional later Easter egg:

- The stamp lifts on hover.
- Clicking it makes a temporary `SHIPPED`, `IN PROD`, or issue-number mark on a nearby scrap.
- The mark fades when the session resets.

This is more meaningful than adding decorative particles.

## Material grammar

All materials share one light direction, but they do not share one shadow preset.

| Material | Edge | Highlight | Shadow/contact | Motion |
| --- | --- | --- | --- | --- |
| Uncoated paper | Warm, slightly irregular, sub-pixel fiber | Broad and almost invisible | Local edge contact; no large halo | Very light corner response |
| Book cloth | Soft woven edge and visible spine ridge | Diffuse, never mirror-like | Heavier, tighter near spine | Slow and restrained |
| Frosted polypropylene | Hard 1–2 px shell edge with milky grain | Narrow moving sheen | Visible shell separation from insert | Shell and insert move by different amounts |
| Vinyl sticker | Crisp white cut line | Small glossy sweep | Tiny lifted corner shadow | Quick pressure/peel |
| Metal clip | Hard silhouette | One sharp specular line | Small dark contact shadow | Minimal |
| Acrylic loupe | Clear edge with slight chromatic split | Crisp arc highlight | Small handle shadow | Smooth constrained drag |

Use `filter: drop-shadow()` for irregular PNG/SVG silhouettes because it follows the asset's alpha shape, unlike a rectangular box shadow. [MDN documents this distinction.](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/filter-function/drop-shadow)

## Lighting system

The sunlight is a fixed property of the mat, not a filter laid over the portfolio.

- Keep two or three small, warm light patches.
- Patches stay below every paper, book, folder, sticker, and tool.
- Use one direction, as if a window is outside the upper-left or upper-right edge of the screen.
- The bright patch should be a local contrast event, not a change in the mat's global saturation.
- A small dark point and a small bright point create depth more effectively than covering the scene in gradients. Adobe's photography guidance similarly notes that even a small rich black point can add depth. [Adobe: Shadows and highlights](https://www.adobe.com/creativecloud/photography/discover/highlights-and-shadows.html)
- The light does not scroll or chase the pointer.

## Proposed desktop composition

The scene should read in this order:

1. Parosayshi sticker.
2. Manifesto sheet.
3. Case-study publications lying half on and half off the sheet.
4. One useful tool.
5. Small ephemera.

Suggested placement:

| Area | Placement |
| --- | --- |
| Top left | Name sticker, partly outside the measurement grid |
| Center | Manifesto sheet, about 1 degree counter-clockwise, with generous mat visible |
| Top/right margin | Acetate colour-chip fan |
| Lower field | Case-study editions with more vertical spacing; each crosses the sheet edge differently |
| Lower-left empty mat | Inspection loupe |
| One paper edge | A single clip holding a résumé/contact slip |
| Far lower-right | Optional puck, only after the core scene works |

Avoid evenly distributing the objects. Use one dense lower cluster and two large quiet mat areas so the scene feels composed rather than filled.

## Opening animation

The opening animation should communicate continuity, not spectacle.

1. Pointer release confirms the object.
2. The selected artifact lifts 8–12 px and begins rotating to zero.
3. The artifact moves toward the reader's final position along a short arc.
4. Its shell/cover becomes the reader shell while the first content page resolves underneath.
5. Reader controls fade in after the physical object has almost settled.

One object remains visible throughout. This avoids the current feeling of a random duplicate or a cover disappearing. Material motion guidance recommends maintaining a clear focal element and using motion to explain spatial relationships and intent. [Material motion](https://m1.material.io/motion/material-motion.html) and [choreography](https://m1.material.io/motion/choreography.html) support this continuity-first approach.

Suggested timing:

- Hover response: 160–200 ms.
- Press response: 80–120 ms.
- Open/close: 420–520 ms.
- Annotation reveal: 120–160 ms.

The durations should vary slightly by apparent weight: a book is slower than a sticker.

## Reference map: what to borrow

### [Stripe Press](https://press.stripe.com/)

Borrow: every publication has enough cover identity to be recognized as an object before it is read.

Do not borrow: the dark shelf composition or literal product photography.

### [Niccolò Miranda's Paper Portfolio](https://www.niccolomiranda.com/)

Borrow: a strict editorial system underneath a highly expressive paper surface. The weirdness works because hierarchy and navigation remain controlled.

Do not borrow: torn-paper animation everywhere.

### [mmm.page](https://mmm.page/)

Borrow: permission for a canvas to feel imperfect, personal, and slightly messy.

Do not borrow: equal freedom for every object. The portfolio still needs strong primary navigation.

### [Chi Quach](https://chiquach.com/about) and [Paula Lu](https://www.paulalu.com/)

Borrow: spatial exploration and clear drag language.

Do not borrow: making the entire portfolio depend on drag. Publications should still open with a normal click or tap.

### [Bruno Simon](https://bruno-simon.com/)

Borrow: one signature interaction can define the memory of a portfolio.

Do not borrow: turning this portfolio into a game world. The loupe should be the signature, while reading remains conventional.

### [DigitalDesk: A Framework for Interacting with Paper](https://www.cl.cam.ac.uk/research/origami/Origami1997c/index.html)

Borrow: a physical paper or tool becomes convincing when its position is associated with a meaningful digital action.

This is the conceptual reason the loupe reveals process material and the colour chips control the mat.

### [MoMA Material Lab](https://www.moma.org/explore/inside_out/2011/03/10/making-discoveries-creating-material-lab/)

Borrow: tactility and play should help visitors explore the underlying collection, not become a disconnected attraction.

## Implementation strategy

### Use the existing stack first

The current project already has Motion and Three.js. Most of this direction should remain DOM and CSS:

- Motion for hover, press, constrained drag, inertia, shared layout, and reduced-motion variants.
- CSS masks and pseudo-elements for the loupe reveal, sticker peel, paper edge, and frosted shell.
- `drop-shadow()` for alpha-conforming object shadows.
- One scene-level set of CSS custom properties for light direction and elevation.

Three.js should not render every publication. Reserve it for a genuinely impossible DOM effect, if one is discovered after the material pass.

### Layer system

```text
0   mat colour and measurement grid
1   fixed sunlight patches
10  manifesto contact shadows
11  manifesto sheet
20  publications
30  loupe, clips, stickers, acetate chips
80  navigation and accessibility controls
100 opened case-study reader
```

### Physics decision

Start the puck with Motion's bounded drag and momentum. Motion supports constraints, elasticity, momentum, and drag events without introducing a physics canvas. [Motion drag documentation](https://motion.dev/docs/react-drag)

If object-to-object collision becomes essential later, use a small Matter.js layer for decorative items only. Keep publications, links, and reader controls out of the simulation.

## Responsive behaviour

Desktop and mobile should share the art direction, not the same mechanics.

### Desktop

- Pointer tilt and lift.
- Constrained loupe drag.
- Optional puck.
- Publications overlap the manifesto and mat.

### Tablet

- Reduced tilt.
- Tap-and-drag loupe with larger hotspots.
- No puck.
- Fewer overlaps and larger spacing.

### Mobile

- A vertical publication stack with edges breaking outside the manifesto column.
- Tap states replace hover.
- `Inspect` buttons reveal process layers inline.
- No decorative physics.
- Mat chips become a compact horizontal acetate stack.

Respect `prefers-reduced-motion`: remove inertia, rolling, parallax, and large arcs while keeping immediate state changes and focus feedback. [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)

## Build order

### Phase 1 — make the still frame believable

1. Define one light direction.
2. Replace global shadows with material-specific contact.
3. Add slight local paper edge/corner variation.
4. Reposition publications so each has a different relationship to the manifesto edge.
5. Replace the floating colour-switcher pill with acetate chips.

The static screenshot must work before any playful interaction is added.

### Phase 2 — establish one interaction language

1. Add the same lift/press grammar to all publications.
2. Tune response by apparent object weight.
3. Add tiny annotations that clarify `open`, `inspect`, and `drag`.
4. Ensure keyboard focus gets an equally clear response.

### Phase 3 — fix publication continuity

1. Convert opening into a shared-element transition.
2. Remove duplicate/popped-up cover states.
3. Reverse the exact transition on close.
4. Restore scroll immediately.

### Phase 4 — add the inspection loupe

1. Build the acrylic tool.
2. Add three inspection hotspots.
3. Use the saved found case-file scan treatment for one process/rejected-work reveal.
4. Add the tap alternative for touch.

### Phase 5 — optional personality

Add only one:

- constrained puck,
- temporary stamp,
- or peelable note.

Do not add all three until the homepage has been observed with real users.

## Kill list

- No freely draggable case-study books.
- No full-scene physics.
- No per-book WebGL canvas.
- No giant soft shadow beneath every object.
- No sunlight layer over paper or publications.
- No cursor-following blob over the reading experience.
- No constantly floating or breathing objects.
- No decorative object that looks clickable but does nothing.
- No opening animation where multiple large objects cross in unrelated directions.
- No desktop metaphor copied onto mobile.
- No coffee cup, keyboard, plant, or other generic “creative desk” filler.

## The one-shot recommendation

Build **The Working Mat** around five visible things:

1. the manifesto sheet,
2. the case-study publications,
3. a physical acetate colour fan,
4. the existing name sticker,
5. one inspection loupe.

Make those five objects materially excellent and behaviourally consistent. Then add a ball or stamp only if the page still needs one more moment of personality.

The result should feel less like a website decorated as a desk and more like a real publishing system that happens to be interactive.
