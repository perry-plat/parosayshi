import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

const CELL_COLUMNS = 2;
const CELL_ROWS = 3;
const CELLS_PER_GLYPH = CELL_COLUMNS * CELL_ROWS;

interface CellCenter {
  x: number;
  y: number;
}

interface CellSpring {
  value: number;
  velocity: number;
}

interface CursorPoint {
  x: number;
  y: number;
}

interface ProximityTypeProps {
  className?: string;
  disabled?: boolean;
  radius?: number;
  stroke?: number;
  text: string;
}

function gaussian(distanceSquared: number, sigma: number) {
  return Math.exp(-distanceSquared / (2 * sigma * sigma));
}

export function ProximityType({
  className,
  disabled = false,
  radius,
  stroke = 2.4,
  text,
}: ProximityTypeProps) {
  const words = useMemo(() => text.trim().split(/\s+/).map((word) => Array.from(word)), [text]);
  const glyphCount = useMemo(
    () => words.reduce((total, word) => total + word.length, 0),
    [words],
  );
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const glyphRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const cellRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const centersRef = useRef<CellCenter[]>([]);
  const springsRef = useRef<CellSpring[]>([]);
  const pointerTargetRef = useRef<CursorPoint | null>(null);
  const pointerCurrentRef = useRef<CursorPoint | null>(null);
  const frameRef = useRef<number | null>(null);
  const previousTimeRef = useRef(0);
  const sigmaRef = useRef(radius || 96);

  const ensureSpringCount = useCallback(() => {
    const cellCount = glyphCount * CELLS_PER_GLYPH;
    if (springsRef.current.length === cellCount) return;
    springsRef.current = Array.from({ length: cellCount }, () => ({
      value: 0,
      velocity: 0,
    }));
    centersRef.current = Array.from({ length: cellCount }, () => ({ x: 0, y: 0 }));
  }, [glyphCount]);

  const measureCells = useCallback(() => {
    ensureSpringCount();
    const root = rootRef.current;
    if (!root) return;

    const fontSize = Number.parseFloat(window.getComputedStyle(root).fontSize) || 48;
    sigmaRef.current = radius || Math.max(58, fontSize * 1.8);

    glyphRefs.current.forEach((glyph, glyphIndex) => {
      if (!glyph) return;
      const bounds = glyph.getBoundingClientRect();

      for (let row = 0; row < CELL_ROWS; row += 1) {
        for (let column = 0; column < CELL_COLUMNS; column += 1) {
          const cellIndex = glyphIndex * CELLS_PER_GLYPH + row * CELL_COLUMNS + column;
          centersRef.current[cellIndex] = {
            x: bounds.left + bounds.width * ((column + 0.5) / CELL_COLUMNS),
            y: bounds.top + bounds.height * ((row + 0.5) / CELL_ROWS),
          };
        }
      }
    });
  }, [ensureSpringCount, radius]);

  const drawFrame = useCallback((time: number) => {
    frameRef.current = null;
    if (disabled) return;

    const previousTime = previousTimeRef.current || time;
    const frameDelta = Math.min(2, Math.max(0.45, (time - previousTime) / (1000 / 60)));
    previousTimeRef.current = time;

    const pointerTarget = pointerTargetRef.current;
    let pointerCurrent = pointerCurrentRef.current;

    if (pointerTarget) {
      if (!pointerCurrent) pointerCurrent = { ...pointerTarget };
      const follow = 1 - Math.pow(0.74, frameDelta);
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * follow;
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * follow;
      pointerCurrentRef.current = pointerCurrent;
    }

    let unsettled = false;
    const sigma = sigmaRef.current;

    springsRef.current.forEach((spring, index) => {
      const center = centersRef.current[index];
      let target = 0;

      if (pointerCurrent && pointerTarget && center) {
        const deltaX = pointerCurrent.x - center.x;
        const deltaY = pointerCurrent.y - center.y;
        target = gaussian(deltaX * deltaX + deltaY * deltaY, sigma);
        if (target < 0.012) target = 0;
      }

      const row = Math.floor((index % CELLS_PER_GLYPH) / CELL_COLUMNS);
      const column = index % CELL_COLUMNS;
      const stiffness = 0.115 + row * 0.008 + column * 0.006;
      const damping = Math.pow(0.7, frameDelta);

      spring.velocity = (spring.velocity + (target - spring.value) * stiffness * frameDelta) * damping;
      spring.value += spring.velocity * frameDelta;

      if (target === 0 && Math.abs(spring.value) < 0.001 && Math.abs(spring.velocity) < 0.001) {
        spring.value = 0;
        spring.velocity = 0;
      } else {
        unsettled = true;
      }

      const renderedValue = Math.max(0, Math.min(1.08, spring.value));
      cellRefs.current[index]?.style.setProperty("--proximity", renderedValue.toFixed(4));
    });

    if (pointerTarget || unsettled) {
      frameRef.current = window.requestAnimationFrame(drawFrame);
    } else {
      pointerCurrentRef.current = null;
      previousTimeRef.current = 0;
    }
  }, [disabled]);

  const requestFrame = useCallback(() => {
    if (disabled || frameRef.current !== null) return;
    frameRef.current = window.requestAnimationFrame(drawFrame);
  }, [disabled, drawFrame]);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLSpanElement>) => {
    if (disabled || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;

    if (!pointerTargetRef.current) measureCells();
    pointerTargetRef.current = { x: event.clientX, y: event.clientY };
    requestFrame();
  }, [disabled, measureCells, requestFrame]);

  const handlePointerLeave = useCallback(() => {
    pointerTargetRef.current = null;
    requestFrame();
  }, [requestFrame]);

  useEffect(() => {
    ensureSpringCount();
    const handleResize = () => {
      if (pointerTargetRef.current) measureCells();
    };
    const releasePointerOutside = (event: globalThis.PointerEvent) => {
      if (!pointerTargetRef.current || !rootRef.current) return;
      const bounds = rootRef.current.getBoundingClientRect();
      const isInside = event.clientX >= bounds.left
        && event.clientX <= bounds.right
        && event.clientY >= bounds.top
        && event.clientY <= bounds.bottom;
      if (isInside) return;
      pointerTargetRef.current = null;
      requestFrame();
    };
    const releasePointer = () => {
      if (!pointerTargetRef.current) return;
      pointerTargetRef.current = null;
      requestFrame();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", releasePointerOutside, { passive: true });
    window.addEventListener("blur", releasePointer);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", releasePointerOutside);
      window.removeEventListener("blur", releasePointer);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [ensureSpringCount, measureCells, requestFrame]);

  useEffect(() => {
    if (!disabled) return;
    pointerTargetRef.current = null;
    pointerCurrentRef.current = null;
    springsRef.current.forEach((spring, index) => {
      spring.value = 0;
      spring.velocity = 0;
      cellRefs.current[index]?.style.setProperty("--proximity", "0");
    });
  }, [disabled]);

  let glyphIndex = 0;
  const proximityStyle = {
    "--proximity-stroke": `${stroke}px`,
  } as CSSProperties;

  return (
    <span
      className={`proximity-type${className ? ` ${className}` : ""}`}
      data-proximity-disabled={disabled || undefined}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      ref={rootRef}
      style={proximityStyle}
    >
      <span className="proximity-type__sr">{text}</span>
      <span aria-hidden="true" className="proximity-type__visual">
        {words.map((word, wordIndex) => (
          <Fragment key={`${word.join("")}-${wordIndex}`}>
            <span className="proximity-type__word">
              {word.map((character, characterIndex) => {
                const currentGlyphIndex = glyphIndex;
                glyphIndex += 1;

                return (
                  <span
                    className="proximity-type__glyph"
                    key={`${character}-${characterIndex}`}
                    ref={(element) => {
                      glyphRefs.current[currentGlyphIndex] = element;
                    }}
                  >
                    <span className="proximity-type__base">{character}</span>
                    {Array.from({ length: CELLS_PER_GLYPH }, (_, cellIndex) => {
                      const row = Math.floor(cellIndex / CELL_COLUMNS);
                      const column = cellIndex % CELL_COLUMNS;
                      const absoluteCellIndex = currentGlyphIndex * CELLS_PER_GLYPH + cellIndex;

                      return (
                        <span
                          className="proximity-type__cell"
                          data-column={column}
                          data-row={row}
                          key={cellIndex}
                          ref={(element) => {
                            cellRefs.current[absoluteCellIndex] = element;
                          }}
                        >
                          {character}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </span>
            {wordIndex < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
