import {
  ArrowCounterClockwise,
  SpeakerHigh,
  SpeakerSlash,
} from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { BeybladeAudio } from "./beyblade/audio";
import "../styles/beyblade-battle.css";

type TopArchetype = "attack" | "defense" | "stamina" | "balance";
type TopColor = "pink" | "blue" | "yellow" | "silver";

type TopView = {
  archetype: TopArchetype;
  color: TopColor;
  id: string;
};

type TopState = TopView & {
  bornAt: number;
  burst: number;
  direction: 1 | -1;
  hitCooldown: number;
  mass: number;
  railCooldown: number;
  retiring: boolean;
  rotation: number;
  rpm: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
};

interface BeybladeBattleProps {
  onActiveChange?: (active: boolean) => void;
  reducedMotion: boolean;
}

const ARENA = {
  centerX: 500,
  centerY: 300,
  radiusX: 430,
  radiusY: 242,
};

const MAX_TOPS = 12;
const TOP_RADIUS = 37;
const TOP_BUILDS: Array<{
  archetype: TopArchetype;
  color: TopColor;
  mass: number;
}> = [
  { archetype: "attack", color: "pink", mass: 0.92 },
  { archetype: "defense", color: "blue", mass: 1.24 },
  { archetype: "stamina", color: "yellow", mass: 1 },
  { archetype: "balance", color: "silver", mass: 1.08 },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeSpawnPoint(x: number, y: number) {
  const dx = x - ARENA.centerX;
  const dy = y - ARENA.centerY;
  const distance = Math.sqrt(
    (dx * dx) / (ARENA.radiusX * ARENA.radiusX) +
      (dy * dy) / (ARENA.radiusY * ARENA.radiusY),
  );

  if (distance <= 0.82) return { x, y };
  const scale = 0.82 / distance;
  return {
    x: ARENA.centerX + dx * scale,
    y: ARENA.centerY + dy * scale,
  };
}

function topView(top: TopState): TopView {
  return {
    archetype: top.archetype,
    color: top.color,
    id: top.id,
  };
}

export function BeybladeBattle({
  onActiveChange,
  reducedMotion,
}: BeybladeBattleProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [topViews, setTopViews] = useState<TopView[]>([]);
  const [isLive, setIsLive] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<BeybladeAudio | null>(null);
  const elementRefs = useRef(new Map<string, HTMLDivElement>());
  const frameRef = useRef(0);
  const impactRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef(0);
  const nextIdRef = useRef(1);
  const onActiveChangeRef = useRef(onActiveChange);
  const timersRef = useRef(new Set<number>());
  const topsRef = useRef(new Map<string, TopState>());

  if (!audioRef.current && typeof window !== "undefined") {
    audioRef.current = new BeybladeAudio();
  }

  useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  const setActivity = useCallback((active: boolean) => {
    setIsLive(active);
    onActiveChangeRef.current?.(active);
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    timersRef.current.add(timer);
  }, []);

  const syncViews = useCallback(() => {
    setTopViews(
      [...topsRef.current.values()]
        .filter((top) => !top.retiring)
        .sort((a, b) => a.bornAt - b.bornAt)
        .map(topView),
    );
  }, []);

  const showImpact = useCallback((x: number, y: number, force: number) => {
    const impact = impactRef.current;
    if (!impact) return;
    impact.style.left = `${x / 10}%`;
    impact.style.top = `${y / 6}%`;
    impact.style.setProperty("--impact-scale", `${clamp(force / 250, 0.72, 1.42)}`);
    impact.classList.remove("is-hit");
    void impact.offsetWidth;
    impact.classList.add("is-hit");
  }, []);

  const renderTop = useCallback((top: TopState) => {
    const element = elementRefs.current.get(top.id);
    if (!element) return;

    const speed = Math.hypot(top.vx, top.vy);
    element.style.left = `${top.x / 10}%`;
    element.style.top = `${top.y / 6}%`;
    element.style.setProperty("--top-rotation", `${top.rotation}deg`);
    element.style.setProperty(
      "--top-wobble",
      `${Math.max(0, 1 - top.rpm / 520) * 0.075}`,
    );
    element.style.setProperty(
      "--trail-angle",
      `${Math.atan2(top.vy, top.vx) + Math.PI}rad`,
    );
    element.style.setProperty(
      "--trail-length",
      `${Math.min(96, speed * 0.16)}px`,
    );
    element.style.setProperty(
      "--trail-opacity",
      `${clamp(speed / 620, 0.06, 0.62)}`,
    );
  }, []);

  const finalizeTop = useCallback((id: string) => {
    const top = topsRef.current.get(id);
    if (!top) return;

    audioRef.current?.stopTop(id);
    topsRef.current.delete(id);
    syncViews();

    const hasActiveTop = [...topsRef.current.values()].some(
      (candidate) => !candidate.retiring,
    );
    if (!hasActiveTop) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      setActivity(false);
    }
  }, [setActivity, syncViews]);

  const retireTop = useCallback((
    top: TopState,
    reason: "burst" | "over" | "spin",
  ) => {
    if (top.retiring) return;
    top.retiring = true;
    audioRef.current?.stopTop(top.id);

    const element = elementRefs.current.get(top.id);
    element?.classList.add(reason === "burst" ? "is-burst" : "is-out");
    if (reason === "burst") audioRef.current?.finish("burst");
    if (reason === "over") audioRef.current?.finish("over");

    schedule(() => finalizeTop(top.id), reason === "burst" ? 390 : 260);
  }, [finalizeTop, schedule]);

  const tick = useCallback((now: number) => {
    const delta = clamp((now - lastTimeRef.current) / 1000, 0.001, 0.032);
    lastTimeRef.current = now;
    const tops = [...topsRef.current.values()].filter((top) => !top.retiring);

    for (const top of tops) {
      top.hitCooldown = Math.max(0, top.hitCooldown - delta);
      top.railCooldown = Math.max(0, top.railCooldown - delta);

      const centerDx = top.x - ARENA.centerX;
      const centerDy = top.y - ARENA.centerY;
      top.vx += -centerDx * 0.17 * delta;
      top.vy += -centerDy * 0.29 * delta;

      if (tops.length > 1 && (top.archetype === "attack" || top.archetype === "balance")) {
        let nearest: TopState | null = null;
        let nearestDistance = Number.POSITIVE_INFINITY;
        for (const candidate of tops) {
          if (candidate.id === top.id) continue;
          const distance = Math.hypot(candidate.x - top.x, candidate.y - top.y);
          if (distance < nearestDistance) {
            nearest = candidate;
            nearestDistance = distance;
          }
        }

        if (nearest && nearestDistance > 1) {
          const pursuit = top.archetype === "attack" ? 105 : 42;
          top.vx += ((nearest.x - top.x) / nearestDistance) * pursuit * delta;
          top.vy += ((nearest.y - top.y) / nearestDistance) * pursuit * delta;
        }
      }

      const drag = Math.pow(top.archetype === "attack" ? 0.987 : 0.99, delta * 60);
      top.vx *= drag;
      top.vy *= drag;
      const speed = Math.hypot(top.vx, top.vy);
      const rpmDecay = {
        attack: 43,
        balance: 32,
        defense: 35,
        stamina: 22,
      }[top.archetype];
      top.rpm = Math.max(0, top.rpm - delta * (rpmDecay + speed * 0.018));
      top.x += top.vx * delta;
      top.y += top.vy * delta;
      top.rotation += top.direction * top.rpm * delta * 0.82;

      const radiusX = ARENA.radiusX - TOP_RADIUS;
      const radiusY = ARENA.radiusY - TOP_RADIUS;
      const normalizedX = (top.x - ARENA.centerX) / radiusX;
      const normalizedY = (top.y - ARENA.centerY) / radiusY;
      const boundaryDistance = Math.sqrt(
        normalizedX * normalizedX + normalizedY * normalizedY,
      );

      if (boundaryDistance > 0.84 && top.railCooldown <= 0 && speed > 155) {
        const tangentDirection = top.direction;
        top.vx += -normalizedY * tangentDirection * 42;
        top.vy += normalizedX * tangentDirection * 42;
        top.railCooldown = 0.48;
        arenaRef.current?.classList.add("is-railing");
        schedule(() => arenaRef.current?.classList.remove("is-railing"), 120);
        audioRef.current?.rail(tangentDirection);
      }

      if (boundaryDistance > 1) {
        top.x = ARENA.centerX + (normalizedX / boundaryDistance) * radiusX;
        top.y = ARENA.centerY + (normalizedY / boundaryDistance) * radiusY;

        let normalX = (top.x - ARENA.centerX) / (radiusX * radiusX);
        let normalY = (top.y - ARENA.centerY) / (radiusY * radiusY);
        const normalLength = Math.hypot(normalX, normalY) || 1;
        normalX /= normalLength;
        normalY /= normalLength;
        const outwardSpeed = top.vx * normalX + top.vy * normalY;
        if (outwardSpeed > 0) {
          top.vx -= outwardSpeed * normalX * 1.72;
          top.vy -= outwardSpeed * normalY * 1.72;
          top.rpm *= 0.975;
        }

        if (speed > 510 && top.archetype !== "defense") {
          retireTop(top, "over");
          continue;
        }
      }
    }

    for (let firstIndex = 0; firstIndex < tops.length; firstIndex += 1) {
      const first = tops[firstIndex];
      if (first.retiring) continue;

      for (let secondIndex = firstIndex + 1; secondIndex < tops.length; secondIndex += 1) {
        const second = tops[secondIndex];
        if (second.retiring) continue;

        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const distance = Math.hypot(dx, dy) || 0.001;
        const minimumDistance = TOP_RADIUS * 2;
        if (distance >= minimumDistance) continue;

        const normalX = dx / distance;
        const normalY = dy / distance;
        const overlap = minimumDistance - distance;
        const totalMass = first.mass + second.mass;
        first.x -= normalX * overlap * (second.mass / totalMass);
        first.y -= normalY * overlap * (second.mass / totalMass);
        second.x += normalX * overlap * (first.mass / totalMass);
        second.y += normalY * overlap * (first.mass / totalMass);

        const relativeSpeed =
          (first.vx - second.vx) * normalX +
          (first.vy - second.vy) * normalY;
        const impact = Math.abs(relativeSpeed) + overlap * 6;
        if (relativeSpeed > 0) {
          const restitution = 1.08;
          const impulse = (restitution * relativeSpeed) / totalMass;
          first.vx -= impulse * second.mass * normalX;
          first.vy -= impulse * second.mass * normalY;
          second.vx += impulse * first.mass * normalX;
          second.vy += impulse * first.mass * normalY;
        }

        if (first.hitCooldown <= 0 && second.hitCooldown <= 0 && impact > 42) {
          const hitX = (first.x + second.x) / 2;
          const hitY = (first.y + second.y) / 2;
          showImpact(hitX, hitY, impact);
          audioRef.current?.hit(impact, hitX);
          first.hitCooldown = 0.13;
          second.hitCooldown = 0.13;

          const baseDamage = clamp((impact - 34) * 0.075, 2, 24);
          const firstGuard = first.archetype === "defense" ? 0.64 : 1;
          const secondGuard = second.archetype === "defense" ? 0.64 : 1;
          const firstAttack = first.archetype === "attack" ? 1.22 : 1;
          const secondAttack = second.archetype === "attack" ? 1.22 : 1;
          first.burst -= baseDamage * secondAttack * firstGuard;
          second.burst -= baseDamage * firstAttack * secondGuard;
          first.rpm *= 0.982;
          second.rpm *= 0.982;

          if (first.burst <= 0) retireTop(first, "burst");
          if (second.burst <= 0) retireTop(second, "burst");
        }
      }
    }

    for (const top of tops) {
      if (top.retiring) continue;
      if (top.rpm < 118) {
        retireTop(top, "spin");
        continue;
      }
      renderTop(top);
      audioRef.current?.updateSpin(
        top.id,
        top.rpm,
        top.x,
        Math.hypot(top.vx, top.vy),
      );
    }

    const hasActiveTop = [...topsRef.current.values()].some(
      (top) => !top.retiring,
    );
    if (hasActiveTop) {
      frameRef.current = window.requestAnimationFrame(tick);
    } else {
      frameRef.current = 0;
    }
  }, [renderTop, retireTop, schedule, showImpact]);

  const releaseTop = useCallback((rawX: number, rawY: number) => {
    const buildIndex = (nextIdRef.current - 1) % TOP_BUILDS.length;
    const build = TOP_BUILDS[buildIndex];
    const point = normalizeSpawnPoint(
      clamp(rawX, 36, 964),
      clamp(rawY, 34, 566),
    );
    const id = `bey-${nextIdRef.current}`;
    nextIdRef.current += 1;

    const activeTops = [...topsRef.current.values()]
      .filter((top) => !top.retiring)
      .sort((a, b) => a.bornAt - b.bornAt);
    if (activeTops.length >= MAX_TOPS) {
      const oldest = activeTops[0];
      audioRef.current?.stopTop(oldest.id);
      topsRef.current.delete(oldest.id);
    }

    const inwardAngle = Math.atan2(
      ARENA.centerY - point.y,
      ARENA.centerX - point.x,
    );
    const direction: 1 | -1 = nextIdRef.current % 2 === 0 ? 1 : -1;
    const tangentAngle = inwardAngle + direction * Math.PI * 0.5;
    const launchSpeed = 225 + Math.random() * 105;
    const top: TopState = {
      ...build,
      bornAt: performance.now(),
      burst: build.archetype === "defense" ? 255 : 210,
      direction,
      hitCooldown: 0.1,
      id,
      railCooldown: 0.28,
      retiring: false,
      rotation: Math.random() * 360,
      rpm: 980 + Math.random() * 390,
      vx:
        Math.cos(inwardAngle) * 95 +
        Math.cos(tangentAngle) * launchSpeed,
      vy:
        Math.sin(inwardAngle) * 95 +
        Math.sin(tangentAngle) * launchSpeed,
      x: point.x,
      y: point.y,
    };

    const opponents = [...topsRef.current.values()].filter(
      (candidate) => !candidate.retiring,
    );
    topsRef.current.set(id, top);
    syncViews();
    setActivity(true);

    const audio = audioRef.current;
    audio?.setEnabled(soundEnabled);
    void audio?.unlock().then((unlocked) => {
      if (!unlocked || !topsRef.current.has(id)) return;
      audio.launch(clamp(launchSpeed / 340, 0.45, 1));
      if (!reducedMotion) {
        audio.startTop(id, (point.x - ARENA.centerX) / 520);
      }
    });

    schedule(() => renderTop(top), 0);

    if (reducedMotion) {
      if (opponents.length) {
        const opponent = opponents[opponents.length - 1];
        schedule(() => {
          if (opponent.retiring || top.retiring) return;
          showImpact((opponent.x + top.x) / 2, (opponent.y + top.y) / 2, 220);
          audioRef.current?.hit(220, (opponent.x + top.x) / 2);
          retireTop(opponent, "burst");
        }, 120);
      }
      return;
    }

    if (!frameRef.current) {
      lastTimeRef.current = performance.now();
      frameRef.current = window.requestAnimationFrame(tick);
    }
  }, [
    reducedMotion,
    renderTop,
    retireTop,
    schedule,
    setActivity,
    showImpact,
    soundEnabled,
    syncViews,
    tick,
  ]);

  const handlePointerDown = useCallback((
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    releaseTop(
      ((event.clientX - bounds.left) / bounds.width) * 1000,
      ((event.clientY - bounds.top) / bounds.height) * 600,
    );
  }, [releaseTop]);

  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const offset = ((nextIdRef.current % 5) - 2) * 52;
    releaseTop(ARENA.centerX + offset, ARENA.centerY + offset * 0.35);
  }, [releaseTop]);

  const clearStadium = useCallback(() => {
    window.cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
    topsRef.current.clear();
    audioRef.current?.stopSpin();
    arenaRef.current?.classList.remove("is-railing");
    setTopViews([]);
    setActivity(false);
  }, [setActivity]);

  const toggleSound = useCallback(() => {
    const audio = audioRef.current;
    setSoundEnabled((current) => {
      const next = !current;
      audio?.setEnabled(next);
      if (next) {
        void audio?.unlock().then((unlocked) => {
          if (!unlocked || reducedMotion) return;
          topsRef.current.forEach((top) => {
            if (top.retiring) return;
            audio.startTop(top.id, (top.x - ARENA.centerX) / 520);
            audio.updateSpin(top.id, top.rpm, top.x, Math.hypot(top.vx, top.vy));
          });
        });
      }
      return next;
    });
  }, [reducedMotion]);

  useEffect(() => {
    return () => {
      window.cancelAnimationFrame(frameRef.current);
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      audioRef.current?.destroy();
      onActiveChangeRef.current?.(false);
    };
  }, []);

  const nextBuild = TOP_BUILDS[(nextIdRef.current - 1) % TOP_BUILDS.length];
  const count = topViews.length;
  const status =
    count === 0
      ? "CLICK THE STADIUM · RELEASE A BEY"
      : count === 1
        ? "1 BEY SPINNING · CLICK TO CHALLENGE"
        : `${count} BEYS COLLIDING · KEEP CLICKING`;

  return (
    <div
      className={`beyblade-battle${isLive ? " beyblade-battle--live" : ""}`}
      aria-label="Secret interactive spinning top stadium"
    >
      <div className="beyblade-battle__status" aria-live="polite">
        <span>TOP VIEW / SECRET STADIUM</span>
        <strong>{status}</strong>
      </div>

      <div className="beyblade-battle__world">
        <div className="beyblade-battle__arena" ref={arenaRef}>
          <span className="beyblade-battle__bowl" aria-hidden="true" />
          <span className="beyblade-battle__rail" aria-hidden="true" />
          <span className="beyblade-battle__seam beyblade-battle__seam--outer" aria-hidden="true" />
          <span className="beyblade-battle__seam beyblade-battle__seam--inner" aria-hidden="true" />
          <span className="beyblade-battle__pocket beyblade-battle__pocket--left" aria-hidden="true" />
          <span className="beyblade-battle__pocket beyblade-battle__pocket--center" aria-hidden="true" />
          <span className="beyblade-battle__pocket beyblade-battle__pocket--right" aria-hidden="true" />

          <div className="beyblade-battle__top-layer" aria-hidden="true">
            {topViews.map((top) => (
              <div
                className="beyblade-battle__top"
                data-archetype={top.archetype}
                data-color={top.color}
                key={top.id}
                ref={(element) => {
                  if (element) elementRefs.current.set(top.id, element);
                  else elementRefs.current.delete(top.id);
                }}
              >
                <span className="beyblade-battle__trail" />
                <span className="beyblade-battle__top-shadow" />
                <span className="beyblade-battle__top-stack">
                  <span className="beyblade-battle__top-blade" />
                  <span className="beyblade-battle__top-ring" />
                  <span className="beyblade-battle__top-core">
                    <span>{top.archetype.charAt(0).toUpperCase()}</span>
                  </span>
                </span>
              </div>
            ))}
          </div>

          <button
            className="beyblade-battle__spawn-surface"
            type="button"
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            aria-label={`Release a ${nextBuild.archetype} type spinning top into the stadium`}
          />

          <div className="beyblade-battle__impact" ref={impactRef} aria-hidden="true">
            <span />
            <i>CLACK</i>
          </div>
        </div>
      </div>

      <div className="beyblade-battle__controls">
        <span className="beyblade-battle__next">
          NEXT · {nextBuild.archetype.toUpperCase()}
        </span>
        <button
          className="beyblade-battle__utility"
          type="button"
          aria-label={soundEnabled ? "Mute stadium sounds" : "Enable stadium sounds"}
          aria-pressed={soundEnabled}
          onClick={toggleSound}
        >
          {soundEnabled ? <SpeakerHigh size={14} /> : <SpeakerSlash size={14} />}
          <span>{soundEnabled ? "SOUND ON" : "SOUND OFF"}</span>
        </button>
        {count > 0 && (
          <button
            className="beyblade-battle__utility"
            type="button"
            onClick={clearStadium}
          >
            <ArrowCounterClockwise size={14} />
            <span>CLEAR</span>
          </button>
        )}
      </div>
    </div>
  );
}
