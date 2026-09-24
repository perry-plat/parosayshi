import { useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import type { FolioProjectMedia } from "../data/folioProjects";

function StackPhoto({ photo, depth, count, onMove }: {
  photo: FolioProjectMedia & { kind: "image" }; depth: number; count: number; onMove: (step: number) => void;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-13, -1, 13]);
  const busy = useRef(false);
  const dragged = useRef(false);
  const z = useMotionValue(count - depth);
  useLayoutEffect(() => { z.set(count - depth); }, [count, depth, z]);
  const front = depth === 0;
  const layer = Math.min(depth, 2);
  const cycle = (side = -1, step = 1) => {
    if (busy.current || !front || count < 2) return;
    busy.current = true;
    const finish = () => {
      onMove(step);
      x.set(0);
      busy.current = false;
      dragged.current = false;
    };
    if (reduced) { finish(); return; }
    // One animation owns the whole handoff, so interrupted spring promises
    // cannot leave the active card locked forever.
    const start = x.get();
    z.set(count + 1);
    animate(x, [start, side * 220, 10], {
      duration: .28, times: [0, .45, 1], ease: "easeInOut",
      onUpdate: value => { if (Math.abs(value) >= 205) z.set(0); },
      onComplete: finish,
    });
  };
  return <motion.div className="personal-photo-stack__layer"
    initial={false}
    animate={{ x: layer * 5, y: layer * 5, rotate: front ? 0 : depth === 1 ? 4 : -5 }}
    transition={{ duration: reduced ? 0 : .16 }}
    style={{ zIndex: z, pointerEvents: front ? "auto" : "none" }}>
    <motion.button type="button" className="personal-photo-stack__print personal-photo-stack__card"
      aria-label={front ? `${photo.alt}. Show next photograph` : undefined}
      aria-hidden={!front} tabIndex={front ? 0 : -1}
      style={{ x, rotate: front ? rotate : 0, touchAction: "pan-y" }}
      drag={front ? "x" : false} dragMomentum={false}
      onPointerDown={() => { dragged.current = false; }}
      onDragStart={() => { dragged.current = true; }}
      onDragEnd={(_, info) => {
        if (busy.current) return;
        if (Math.abs(info.offset.x) > 65 || Math.abs(info.velocity.x) > 450) {
          const side = (Math.abs(info.offset.x) > 20 ? info.offset.x : info.velocity.x) < 0 ? -1 : 1;
          cycle(side, side < 0 ? 1 : -1);
        } else { void animate(x, 0, { type: "spring", stiffness: 380, damping: 32 }); }
      }}
      onClick={() => { if (!dragged.current) void cycle(); }}
      onKeyDown={event => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          event.stopPropagation();
          cycle(event.key === "ArrowRight" ? -1 : 1, event.key === "ArrowRight" ? 1 : -1);
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          void cycle();
        }
      }}>
      <img src={photo.src} alt="" draggable={false} />
    </motion.button>
  </motion.div>;
}

export function PersonalPhotoStack({ photos }: { photos: (FolioProjectMedia & { kind: "image" })[] }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (root.current?.contains(document.activeElement)) root.current.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus({ preventScroll: true });
  }, [active]);
  if (!photos.length) return null;
  return <section ref={root} className="personal-photo-stack" aria-label="Personal photographs" aria-roledescription="carousel">
    <div className="personal-photo-stack__pile">
      {photos.map((photo, index) => <StackPhoto key={photo.src} photo={photo}
        depth={(index - active + photos.length) % photos.length} count={photos.length}
        onMove={step => setActive(current => (current + step + photos.length) % photos.length)} />)}
    </div>
    <span className="personal-photo-stack__announcement" aria-live="polite">{photos[active].alt}</span>
  </section>;
}
