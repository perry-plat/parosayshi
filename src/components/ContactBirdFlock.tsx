/*
 * Direct modern port of "Paranoid vs shy birds" by Karim Maaloul.
 * Original public CodePen: https://codepen.io/Yakudoo/pen/LVyJXw
 * MIT license retained at ../vendor/paranoid-shy-birds.LICENSE.txt
 * Adaptations are limited to current Three.js APIs, React lifecycle,
 * responsive sizing and the portfolio color palette.
 */
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ContactBirdFlockProps { reducedMotion: boolean; }
interface BirdPalette { normal: THREE.Color; }
type BadgeKind = "linkedin" | "gmail" | "x";

const birdChirpSources = [
  "/assets/audio/bird-chirp-blue.ogg",
  "/assets/audio/bird-chirp-brown.ogg",
  "/assets/audio/bird-chirp-charcoal.ogg",
];

const palettes: BirdPalette[] = [
  { normal: new THREE.Color(0x326ca5) },
  { normal: new THREE.Color(0x966a48) },
  { normal: new THREE.Color(0x292a2d) },
];

function createTree(scale = 1, foliageColor = 0x71835a) {
  const tree = new THREE.Group();
  const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x79604a, flatShading: true });
  const foliageMaterials = [
    new THREE.MeshLambertMaterial({ color: foliageColor, flatShading: true }),
    new THREE.MeshLambertMaterial({ color: 0x87966a, flatShading: true }),
  ];

  const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.4, 0.22), trunkMaterial);
  trunk.position.y = 0.38;
  trunk.rotation.z = 0.045;
  tree.add(trunk);

  [
    { x: -0.28, y: 1.02, z: 0, size: [0.72, 0.76, 0.58], rotation: -0.2 },
    { x: 0.24, y: 1.18, z: -0.03, size: [0.78, 0.82, 0.64], rotation: 0.16 },
    { x: 0, y: 1.55, z: 0.02, size: [0.68, 0.72, 0.6], rotation: -0.06 },
  ].forEach(({ x, y, z, size, rotation }, index) => {
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.62, 0), foliageMaterials[index % foliageMaterials.length]);
    crown.position.set(x, y, z);
    crown.scale.set(size[0], size[1], size[2]);
    crown.rotation.set(rotation * 0.5, rotation, rotation);
    tree.add(crown);
  });

  tree.scale.setScalar(scale);
  tree.traverse((object) => {
    if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; }
  });
  return tree;
}

function createGrassTuft(scale = 1, color = 0x697b50) {
  const tuft = new THREE.Group();
  const material = new THREE.MeshLambertMaterial({ color, flatShading: true });

  [-0.18, -0.09, 0, 0.1, 0.2].forEach((x, index) => {
    const height = 0.28 + (index % 3) * 0.08;
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.055, height, 4), material);
    blade.position.set(x, height / 2 - 0.3, (index % 2) * 0.04);
    blade.rotation.z = (index - 2) * -0.11;
    tuft.add(blade);
  });

  tuft.scale.setScalar(scale);
  tuft.traverse((object) => {
    if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; }
  });
  return tuft;
}

function createRaisedBar(start: [number, number], end: [number, number], width: number, material: THREE.Material) {
  const deltaX = end[0] - start[0];
  const deltaY = end[1] - start[1];
  const bar = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(deltaX, deltaY), width, 0.024), material);
  bar.position.set((start[0] + end[0]) / 2, (start[1] + end[1]) / 2, 0.069);
  bar.rotation.z = Math.atan2(deltaY, deltaX);
  return bar;
}

function createRaisedBadgeLogo(kind: BadgeKind) {
  const logo = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: kind === "gmail" ? 0xd9473f : 0xffffff });

  if (kind === "linkedin") {
    logo.add(
      createRaisedBar([-0.076, -0.075], [-0.076, 0.018], 0.028, material),
      createRaisedBar([0.004, -0.075], [0.004, 0.045], 0.027, material),
      createRaisedBar([0.004, 0.04], [0.092, 0.008], 0.027, material),
      createRaisedBar([0.092, 0.015], [0.092, -0.075], 0.027, material),
    );
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.018, 10), material);
    dot.position.set(-0.076, 0.071, 0.082);
    logo.add(dot);
  } else if (kind === "gmail") {
    logo.add(
      createRaisedBar([-0.145, -0.078], [-0.145, 0.078], 0.027, material),
      createRaisedBar([-0.145, 0.078], [0, -0.015], 0.027, material),
      createRaisedBar([0, -0.015], [0.145, 0.078], 0.027, material),
      createRaisedBar([0.145, 0.078], [0.145, -0.078], 0.027, material),
    );
  } else {
    logo.add(
      createRaisedBar([-0.105, -0.12], [0.105, 0.12], 0.031, material),
      createRaisedBar([-0.105, 0.12], [0.105, -0.12], 0.031, material),
    );
  }

  return logo;
}

function createBadgeShape(kind: BadgeKind) {
  const shape = new THREE.Shape();
  if (kind === "gmail") {
    shape.moveTo(-0.2, -0.12);
    shape.lineTo(0.2, -0.12);
    shape.lineTo(0.22, -0.08);
    shape.lineTo(0.22, 0.08);
    shape.lineTo(0.18, 0.12);
    shape.lineTo(-0.18, 0.12);
    shape.lineTo(-0.22, 0.08);
    shape.lineTo(-0.22, -0.08);
  } else if (kind === "linkedin") {
    shape.moveTo(-0.14, -0.18);
    shape.lineTo(0.14, -0.18);
    shape.lineTo(0.18, -0.14);
    shape.lineTo(0.18, 0.14);
    shape.lineTo(0.14, 0.18);
    shape.lineTo(-0.14, 0.18);
    shape.lineTo(-0.18, 0.14);
    shape.lineTo(-0.18, -0.14);
  } else {
    const sides = 10;
    for (let index = 0; index < sides; index += 1) {
      const angle = (index / sides) * Math.PI * 2 + Math.PI / 2;
      const x = Math.cos(angle) * 0.18;
      const y = Math.sin(angle) * 0.18;
      if (index === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
  }
  shape.closePath();
  return shape;
}

function createEnamelBadge(kind: BadgeKind) {
  const badge = new THREE.Group();
  const metalMaterial = new THREE.MeshStandardMaterial({ color: 0xc8c1b5, metalness: 0.62, roughness: 0.34 });
  const enamelColors: Record<BadgeKind, number> = { linkedin: 0x2b72a9, gmail: 0xf6f1e8, x: 0x1d1d1f };
  const enamelMaterial = new THREE.MeshStandardMaterial({ color: enamelColors[kind], metalness: 0.08, roughness: 0.26 });
  const outerGeometry = new THREE.ExtrudeGeometry(createBadgeShape(kind), {
    depth: 0.055,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    curveSegments: 1,
  });
  outerGeometry.center();
  const outer = new THREE.Mesh(outerGeometry, metalMaterial);
  outer.castShadow = true;
  badge.add(outer);

  const faceGeometry = new THREE.ExtrudeGeometry(createBadgeShape(kind), {
    depth: 0.022,
    bevelEnabled: false,
    curveSegments: 1,
  });
  faceGeometry.center();
  const face = new THREE.Mesh(faceGeometry, enamelMaterial);
  face.position.z = 0.039;
  face.scale.setScalar(0.84);
  badge.add(face);

  badge.add(createRaisedBadgeLogo(kind));

  badge.position.set(0, -0.3, 0.585);
  badge.scale.setScalar(1.18);
  return badge;
}

class Bird {
  bodyBird: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshLambertMaterial>;
  bodyBirdInitialPositions: Float32Array;
  face = new THREE.Group();
  hAngle = 0;
  threegroup = new THREE.Group();
  vAngle = 0;
  beak: THREE.Mesh;
  feather1: THREE.Mesh;
  feather2: THREE.Mesh;
  feather3: THREE.Mesh;
  leftEye: THREE.Mesh;
  leftIris: THREE.Mesh;
  rightEye: THREE.Mesh;
  rightIris: THREE.Mesh;

  constructor(palette: BirdPalette, badgeKind: BadgeKind) {
    const birdMaterial = new THREE.MeshLambertMaterial({ color: palette.normal, flatShading: true });
    const whiteMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const blackMaterial = new THREE.MeshLambertMaterial({ color: 0x171717, flatShading: true });
    const orangeMaterial = new THREE.MeshLambertMaterial({ color: 0xef6b36, flatShading: true });

    const wingGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.05);
    const wingLeftGroup = new THREE.Group();
    const wingLeft = new THREE.Mesh(wingGeometry, birdMaterial);
    wingLeftGroup.add(wingLeft);
    wingLeftGroup.position.set(0.7, 0, 0);
    wingLeftGroup.rotation.y = Math.PI / 2;
    wingLeft.rotation.x = -Math.PI / 4;

    const wingRightGroup = new THREE.Group();
    const wingRight = new THREE.Mesh(wingGeometry, birdMaterial);
    wingRightGroup.add(wingRight);
    wingRightGroup.position.set(-0.7, 0, 0);
    wingRightGroup.rotation.y = -Math.PI / 2;
    wingRight.rotation.x = -Math.PI / 4;

    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.7, 2, 4, 3);
    this.bodyBird = new THREE.Mesh(bodyGeometry, birdMaterial);
    this.bodyBird.position.y = 0.7;
    this.bodyBirdInitialPositions = Float32Array.from(bodyGeometry.getAttribute("position").array as ArrayLike<number>);

    const eyeGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.1);
    const irisGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    this.leftEye = new THREE.Mesh(eyeGeometry, whiteMaterial);
    this.leftEye.position.set(-0.3, 1.2, 0.35);
    this.leftEye.rotation.y = -Math.PI / 4;
    this.leftIris = new THREE.Mesh(irisGeometry, blackMaterial);
    this.leftIris.position.set(-0.3, 1.2, 0.4);
    this.leftIris.rotation.y = -Math.PI / 4;
    this.rightEye = new THREE.Mesh(eyeGeometry, whiteMaterial);
    this.rightEye.position.set(0.3, 1.2, 0.35);
    this.rightEye.rotation.y = Math.PI / 4;
    this.rightIris = new THREE.Mesh(irisGeometry, blackMaterial);
    this.rightIris.position.set(0.3, 1.2, 0.4);
    this.rightIris.rotation.y = Math.PI / 4;

    this.beak = new THREE.Mesh(new THREE.CylinderGeometry(0, 0.2, 0.2, 4, 1), orangeMaterial);
    this.beak.position.set(0, 0.7, 0.65);
    this.beak.rotation.x = Math.PI / 2;

    const featherGeometry = new THREE.BoxGeometry(0.1, 0.2, 0.05);
    this.feather1 = new THREE.Mesh(featherGeometry, birdMaterial);
    this.feather1.position.set(0, 1.85, 0.55);
    this.feather1.rotation.x = Math.PI / 4;
    this.feather1.scale.set(1.5, 1.5, 1);
    this.feather2 = new THREE.Mesh(featherGeometry, birdMaterial);
    this.feather2.position.set(0.2, 1.8, 0.5);
    this.feather2.rotation.set(Math.PI / 4, 0, -Math.PI / 8);
    this.feather3 = new THREE.Mesh(featherGeometry, birdMaterial);
    this.feather3.position.set(-0.2, 1.8, 0.5);
    this.feather3.rotation.set(Math.PI / 4, 0, Math.PI / 8);

    this.face.add(this.rightEye, this.rightIris, this.leftEye, this.leftIris, this.beak, this.feather1, this.feather2, this.feather3);
    this.bodyBird.add(createEnamelBadge(badgeKind));
    this.threegroup.add(this.bodyBird, wingLeftGroup, wingRightGroup, this.face);
    this.threegroup.traverse((object) => {
      if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; }
    });
  }

  look(hAngle: number, vAngle: number) {
    this.hAngle = hAngle;
    this.vAngle = vAngle;
    this.leftIris.position.set(-0.3 + hAngle * 0.1, 1.2 - vAngle * 0.3, 0.4 + hAngle * 0.1);
    this.rightIris.position.set(0.3 + hAngle * 0.1, 1.2 - vAngle * 0.3, 0.4 - hAngle * 0.1);
    this.leftEye.position.y = this.rightEye.position.y = 1.2 - vAngle * 0.1;
    this.beak.position.y = 0.7 - vAngle * 0.2;
    this.beak.rotation.x = Math.PI / 2 + vAngle / 3;

    for (const feather of [this.feather1, this.feather2, this.feather3]) {
      feather.rotation.x = Math.PI / 4 + vAngle / 2;
      feather.position.y = (feather === this.feather1 ? 1.85 : 1.8) - vAngle * 0.1;
      feather.position.z = (feather === this.feather1 ? 0.55 : 0.5) + vAngle * 0.1;
    }

    const positions = this.bodyBird.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let index = 0; index < positions.count; index += 1) {
      const offset = index * 3;
      const line = Math.floor(index / 5);
      const angle = line >= 2 ? 0 : hAngle / (line + 1);
      const initialX = this.bodyBirdInitialPositions[offset];
      const initialZ = this.bodyBirdInitialPositions[offset + 2];
      positions.setX(index, initialX * Math.cos(angle) + initialZ * Math.sin(angle));
      positions.setZ(index, -initialX * Math.sin(angle) + initialZ * Math.cos(angle));
    }
    positions.needsUpdate = true;
    this.face.rotation.y = hAngle;
  }

}

export function ContactBirdFlock({ reducedMotion }: ContactBirdFlockProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const copyResetRef = useRef<number | null>(null);
  const chirpAudioRef = useRef<HTMLAudioElement[]>([]);
  const lastChirpAtRef = useRef(0);
  const [emailCopied, setEmailCopied] = useState(false);

  const playChirp = (variant: number) => {
    const now = performance.now();
    if (now - lastChirpAtRef.current < 120) return;
    lastChirpAtRef.current = now;
    const chirp = chirpAudioRef.current[variant];
    if (!chirp) return;
    chirp.currentTime = 0;
    void chirp.play().catch(() => undefined);
  };

  const copyEmail = async () => {
    const email = "parthjha202@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setEmailCopied(true);
    if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current);
    copyResetRef.current = window.setTimeout(() => setEmailCopied(false), 1600);
  };

  useEffect(() => {
    chirpAudioRef.current = birdChirpSources.map((source) => {
      const audio = new Audio(source);
      audio.preload = "auto";
      audio.volume = 0.42;
      return audio;
    });

    return () => {
      if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current);
      chirpAudioRef.current.forEach((audio) => {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      });
      chirpAudioRef.current = [];
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 2.5, 0.01, 20);
    camera.position.set(0, 3, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.prepend(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 1.4));
    const shadowLight = new THREE.DirectionalLight(0xffffff, 2.2);
    shadowLight.position.set(2, 2, 2); shadowLight.castShadow = true; scene.add(shadowLight);
    const backLight = new THREE.DirectionalLight(0xffffff, 1.1);
    backLight.position.set(-1, 2, 0.5); scene.add(backLight);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 14), new THREE.ShadowMaterial({ color: 0x47392e, opacity: 0.18 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -0.33; floor.receiveShadow = true; scene.add(floor);

    const bird1 = new Bird(palettes[1], "gmail"); bird1.threegroup.scale.setScalar(1.85); scene.add(bird1.threegroup);
    const bird2 = new Bird(palettes[0], "linkedin"); bird2.threegroup.position.set(-2.5, -0.08, 0); bird2.threegroup.scale.setScalar(1.5); scene.add(bird2.threegroup);
    const bird3 = new Bird(palettes[2], "x"); bird3.threegroup.position.set(2.5, -0.08, 0); bird3.threegroup.scale.setScalar(1.5); scene.add(bird3.threegroup);

    [
      { x: -5.05, z: -0.55, scale: 0.88, rotation: -0.18, color: 0x667d52 },
      { x: -4.42, z: -1.62, scale: 0.63, rotation: 0.28, color: 0x7d8d62 },
      { x: -3.78, z: -0.86, scale: 0.78, rotation: -0.26, color: 0x71845a },
      { x: -3.14, z: -1.74, scale: 0.5, rotation: 0.18, color: 0x87966a },
      { x: -2.02, z: -2.12, scale: 0.56, rotation: -0.12, color: 0x64784f },
      { x: -0.92, z: -2.38, scale: 0.46, rotation: 0.32, color: 0x7b8c60 },
      { x: 0.76, z: -2.42, scale: 0.52, rotation: -0.24, color: 0x6b8053 },
      { x: 1.88, z: -2.08, scale: 0.44, rotation: 0.16, color: 0x829168 },
      { x: 3.04, z: -1.7, scale: 0.58, rotation: -0.3, color: 0x65794f },
      { x: 3.72, z: -0.94, scale: 0.82, rotation: 0.22, color: 0x76885b },
      { x: 4.4, z: -1.58, scale: 0.62, rotation: -0.16, color: 0x87966a },
      { x: 5.02, z: -0.48, scale: 0.78, rotation: 0.3, color: 0x6c8054 },
      { x: -4.62, z: -2.78, scale: 0.48, rotation: 0.2, color: 0x718359 },
      { x: -3.46, z: -3.04, scale: 0.55, rotation: -0.28, color: 0x829168 },
      { x: -2.56, z: -2.86, scale: 0.4, rotation: 0.12, color: 0x65794f },
      { x: -1.42, z: -3.18, scale: 0.5, rotation: -0.2, color: 0x798b60 },
      { x: 1.34, z: -3.2, scale: 0.46, rotation: 0.26, color: 0x698054 },
      { x: 2.48, z: -2.9, scale: 0.54, rotation: -0.12, color: 0x84946b },
      { x: 3.4, z: -3.06, scale: 0.42, rotation: 0.3, color: 0x64784e },
      { x: 4.56, z: -2.74, scale: 0.52, rotation: -0.24, color: 0x788b5d },
      { x: -5.28, z: -3.72, scale: 0.38, rotation: -0.26, color: 0x74875a },
      { x: -4.76, z: -4.46, scale: 0.46, rotation: 0.2, color: 0x65794f },
      { x: -4.12, z: -3.84, scale: 0.34, rotation: -0.12, color: 0x84946a },
      { x: -3.58, z: -4.64, scale: 0.5, rotation: 0.3, color: 0x708458 },
      { x: -2.98, z: -3.7, scale: 0.42, rotation: -0.22, color: 0x798b60 },
      { x: -2.34, z: -4.34, scale: 0.36, rotation: 0.14, color: 0x62764b },
      { x: -1.76, z: -3.82, scale: 0.47, rotation: -0.3, color: 0x829168 },
      { x: -1.12, z: -4.54, scale: 0.32, rotation: 0.24, color: 0x6b8052 },
      { x: -0.56, z: -3.92, scale: 0.4, rotation: -0.16, color: 0x788a5c },
      { x: -0.08, z: -4.68, scale: 0.35, rotation: 0.28, color: 0x64794d },
      { x: 0.48, z: -3.9, scale: 0.38, rotation: -0.24, color: 0x839269 },
      { x: 1.02, z: -4.58, scale: 0.44, rotation: 0.18, color: 0x667b50 },
      { x: 1.62, z: -3.78, scale: 0.33, rotation: -0.1, color: 0x798c5f },
      { x: 2.18, z: -4.4, scale: 0.48, rotation: 0.26, color: 0x718559 },
      { x: 2.78, z: -3.74, scale: 0.37, rotation: -0.28, color: 0x86956c },
      { x: 3.36, z: -4.62, scale: 0.43, rotation: 0.12, color: 0x62774b },
      { x: 3.94, z: -3.86, scale: 0.35, rotation: -0.2, color: 0x7b8c61 },
      { x: 4.46, z: -4.42, scale: 0.49, rotation: 0.3, color: 0x697e51 },
      { x: 4.94, z: -3.7, scale: 0.34, rotation: -0.14, color: 0x829267 },
      { x: 5.34, z: -4.22, scale: 0.41, rotation: 0.22, color: 0x65794e },
      { x: -5.46, z: -0.54, scale: 0.64, rotation: -0.24, color: 0x71855a },
      { x: -5.82, z: -1.46, scale: 0.5, rotation: 0.2, color: 0x839269 },
      { x: -6.1, z: -2.44, scale: 0.58, rotation: -0.14, color: 0x64794e },
      { x: -6.36, z: -0.82, scale: 0.74, rotation: 0.28, color: 0x798b5f },
      { x: -6.62, z: -1.88, scale: 0.46, rotation: -0.3, color: 0x687e51 },
      { x: -6.88, z: -3.08, scale: 0.55, rotation: 0.12, color: 0x86956c },
      { x: -7.08, z: -0.48, scale: 0.68, rotation: -0.18, color: 0x657a4f },
      { x: -7.3, z: -1.54, scale: 0.52, rotation: 0.3, color: 0x7d8e63 },
      { x: -7.5, z: -2.62, scale: 0.43, rotation: -0.1, color: 0x708358 },
      { x: -7.68, z: -3.56, scale: 0.58, rotation: 0.24, color: 0x829168 },
      { x: 5.48, z: -0.58, scale: 0.62, rotation: 0.22, color: 0x687e52 },
      { x: 5.8, z: -1.52, scale: 0.48, rotation: -0.26, color: 0x84936a },
      { x: 6.08, z: -2.38, scale: 0.6, rotation: 0.14, color: 0x65794e },
      { x: 6.34, z: -0.76, scale: 0.72, rotation: -0.3, color: 0x7b8c61 },
      { x: 6.64, z: -1.94, scale: 0.45, rotation: 0.18, color: 0x708559 },
      { x: 6.86, z: -3.02, scale: 0.56, rotation: -0.12, color: 0x87966c },
      { x: 7.1, z: -0.5, scale: 0.66, rotation: 0.26, color: 0x647a4f },
      { x: 7.32, z: -1.48, scale: 0.5, rotation: -0.22, color: 0x7f8f64 },
      { x: 7.52, z: -2.58, scale: 0.44, rotation: 0.1, color: 0x6d8255 },
      { x: 7.7, z: -3.5, scale: 0.57, rotation: -0.28, color: 0x83936a },
    ].forEach(({ x, z, scale, rotation, color }) => {
      const tree = createTree(scale * 1.44, color);
      tree.position.set(x, -0.05, z);
      tree.rotation.y = rotation;
      scene.add(tree);
    });

    [
      { x: -5.12, z: 0.12, scale: 0.78, color: 0x64774c },
      { x: -4.7, z: 0.24, scale: 0.58, color: 0x78875b },
      { x: -4.18, z: 0.08, scale: 0.92, color: 0x697c50 },
      { x: -3.68, z: 0.18, scale: 0.66, color: 0x829167 },
      { x: -3.22, z: 0.04, scale: 0.74, color: 0x607448 },
      { x: -2.94, z: 0.16, scale: 0.48, color: 0x788a5c },
      { x: 2.92, z: 0.14, scale: 0.5, color: 0x64784a },
      { x: 3.2, z: 0.02, scale: 0.76, color: 0x7c8c60 },
      { x: 3.66, z: 0.2, scale: 0.62, color: 0x64794d },
      { x: 4.12, z: 0.08, scale: 0.9, color: 0x839168 },
      { x: 4.66, z: 0.22, scale: 0.56, color: 0x697d50 },
      { x: 5.08, z: 0.1, scale: 0.8, color: 0x748558 },
    ].forEach(({ x, z, scale, color }, index) => {
      const grass = createGrassTuft(scale * 1.44, color);
      grass.position.set(x, -0.02, z);
      grass.rotation.y = index % 2 === 0 ? -0.18 : 0.22;
      scene.add(grass);
    });

    const groveColors = [0x65794f, 0x71855a, 0x7d8e63, 0x839269, 0x687e51, 0x86956c];
    const additionalTrees = [
      ...Array.from({ length: 48 }, (_, index) => {
        const sideIndex = index % 24;
        const side = index < 24 ? -1 : 1;
        return {
          x: side * (5.42 + (sideIndex % 6) * 0.43 + Math.floor(sideIndex / 6) * 0.08),
          z: -0.28 - Math.floor(sideIndex / 6) * 1.08 - (sideIndex % 2) * 0.3,
          scale: 0.34 + (sideIndex % 5) * 0.075,
          rotation: (sideIndex % 2 === 0 ? -1 : 1) * (0.1 + (sideIndex % 4) * 0.06),
          color: groveColors[(index + 2) % groveColors.length],
        };
      }),
      ...Array.from({ length: 12 }, (_, index) => ({
        x: -4.72 + index * 0.86,
        z: -2.62 - (index % 3) * 0.7,
        scale: 0.31 + (index % 4) * 0.055,
        rotation: (index % 2 === 0 ? -1 : 1) * (0.12 + (index % 3) * 0.07),
        color: groveColors[index % groveColors.length],
      })),
    ];

    additionalTrees.forEach(({ x, z, scale, rotation, color }) => {
      const tree = createTree(scale * 1.44, color);
      tree.position.set(x, -0.05, z);
      tree.rotation.y = rotation;
      scene.add(tree);
    });

    Array.from({ length: 84 }, (_, index) => {
      const side = index % 2 === 0 ? -1 : 1;
      const lane = Math.floor(index / 2);
      return {
        x: side * (2.8 + (lane % 8) * 0.57),
        z: 0.28 - Math.floor(lane / 8) * 0.72 - (lane % 3) * 0.12,
        scale: 0.42 + (index % 5) * 0.09,
        color: groveColors[(index + 4) % groveColors.length],
      };
    }).forEach(({ x, z, scale, color }, index) => {
      const grass = createGrassTuft(scale * 1.44, color);
      grass.position.set(x, -0.02, z);
      grass.rotation.y = index % 2 === 0 ? -0.24 : 0.28;
      scene.add(grass);
    });

    let pointerX = 0; let pointerY = 0;
    const handlePointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      pointerX = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
      pointerY = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) * 2;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    const resize = () => {
      const width = Math.max(1, Math.floor(host.clientWidth)); const height = Math.max(1, Math.floor(host.clientHeight));
      renderer.setSize(width, height, false); camera.aspect = width / height; camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host); resize();

    let frame = 0;
    const gazeHistory: Array<{ time: number; h: number; v: number }> = [];
    const sampleGaze = (targetTime: number) => {
      let before = gazeHistory[0];
      let after = before;
      for (const sample of gazeHistory) {
        if (sample.time <= targetTime) before = sample;
        else { after = sample; break; }
      }
      if (!before) return { h: 0, v: 0 };
      if (!after || after.time === before.time) return before;
      const progress = THREE.MathUtils.clamp((targetTime - before.time) / (after.time - before.time), 0, 1);
      return {
        h: THREE.MathUtils.lerp(before.h, after.h, progress),
        v: THREE.MathUtils.lerp(before.v, after.v, progress),
      };
    };
    const render = (now = performance.now()) => {
      const userHAngle = THREE.MathUtils.clamp(pointerX * 1.35, -Math.PI / 3, Math.PI / 3);
      const userVAngle = THREE.MathUtils.clamp(pointerY * 1.35, -Math.PI / 3, Math.PI / 3);
      gazeHistory.push({ time: now, h: userHAngle, v: userVAngle });
      while (gazeHistory.length > 1 && gazeHistory[1].time < now - 2200) gazeHistory.shift();
      const bird2Gaze = sampleGaze(now - 1000);
      const bird3Gaze = sampleGaze(now - 2000);
      bird1.look(userHAngle, userVAngle);
      bird2.look(bird2Gaze.h, bird2Gaze.v);
      bird3.look(bird3Gaze.h, bird3Gaze.v);
      renderer.render(scene, camera); frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame); window.removeEventListener("pointermove", handlePointerMove); resizeObserver.disconnect();
      scene.traverse((object) => { if (!(object instanceof THREE.Mesh)) return; object.geometry.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach((material) => { if ("map" in material && material.map instanceof THREE.Texture) material.map.dispose(); material.dispose(); }); });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [reducedMotion]);

  return (
    <div className="folio-contact__flock" ref={hostRef}>
      <nav aria-label="Contact links" className="folio-contact__actions">
        <a aria-label="View Parth Jha on LinkedIn" href="https://www.linkedin.com/in/parthjha03/" onPointerEnter={() => playChirp(0)} rel="noreferrer" target="_blank">
          <span className="folio-contact__pill">View LinkedIn</span>
        </a>
        <button aria-label="Copy Parth's email address" onClick={copyEmail} onPointerEnter={() => playChirp(1)} type="button">
          <span className="folio-contact__pill">{emailCopied ? "Copied!" : "Copy email"}</span>
        </button>
        <a aria-label="Follow Parosayshi on X" href="https://x.com/parosayshi" onPointerEnter={() => playChirp(2)} rel="noreferrer" target="_blank">
          <span className="folio-contact__pill">Follow on X</span>
        </a>
      </nav>
    </div>
  );
}
