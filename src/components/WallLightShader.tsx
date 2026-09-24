import { useEffect, useRef } from "react";
import * as THREE from "three";

interface WallLightShaderProps {
  paused?: boolean;
  blossom?: boolean;
  glowColor: string;
  glowStrength: number;
  lightColor: string;
  reducedMotion: boolean;
  wallColor: string;
}

type MovingLeaf = {
  basePosition: THREE.Vector3;
  baseRotation: number;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  phase: number;
  strength: number;
};

type MovingCanopy = {
  basePosition: THREE.Vector3;
  baseRotation: number;
  group: THREE.Group;
  phase: number;
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function makeLeafTexture(blossom = false) {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 128;
  textureCanvas.height = 128;
  const context = textureCanvas.getContext("2d");
  if (!context) return null;

  context.clearRect(0, 0, 128, 128);
  context.fillStyle = "#fff";
  if (blossom) {
    // A loose cluster reads more like blossom-laden twigs in silhouette than
    // one repeated flower stamp. Slightly different sizes keep the shadow
    // organic once the texture is scattered across the procedural branches.
    const flowers = [
      { x: 34, y: 45, radius: 19, rotation: -0.18 },
      { x: 66, y: 32, radius: 17, rotation: 0.12 },
      { x: 91, y: 51, radius: 20, rotation: -0.06 },
      { x: 49, y: 78, radius: 21, rotation: 0.2 },
      { x: 82, y: 87, radius: 18, rotation: -0.22 },
    ];
    flowers.forEach(({ x, y, radius, rotation }) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      for (let petal = 0; petal < 5; petal += 1) {
        context.save();
        context.rotate(petal * Math.PI * 2 / 5);
        context.beginPath();
        context.moveTo(0, radius * 0.08);
        context.bezierCurveTo(
          -radius * 0.46,
          -radius * 0.12,
          -radius * 0.42,
          -radius * 0.88,
          0,
          -radius,
        );
        context.bezierCurveTo(
          radius * 0.42,
          -radius * 0.88,
          radius * 0.46,
          -radius * 0.12,
          0,
          radius * 0.08,
        );
        context.fill();
        context.restore();
      }
      context.restore();
    });
    // Small petal-shaped openings let the wall colour shine through the
    // cluster, giving the shadow a floral dapple without adding pink pigment.
    context.globalCompositeOperation = "destination-out";
    [
      { x: 56, y: 55, rx: 4.2, ry: 8.2, rotation: -0.55 },
      { x: 74, y: 62, rx: 3.8, ry: 7.4, rotation: 0.62 },
      { x: 63, y: 88, rx: 3.4, ry: 6.8, rotation: 0.14 },
    ].forEach(({ x, y, rx, ry, rotation }) => {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.beginPath();
      context.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
    });
    context.globalCompositeOperation = "source-over";
  } else {
  context.beginPath();
  context.moveTo(63, 6);
  context.bezierCurveTo(91, 15, 109, 38, 106, 62);
  context.bezierCurveTo(102, 90, 78, 111, 63, 122);
  context.bezierCurveTo(47, 110, 23, 89, 19, 62);
  context.bezierCurveTo(16, 37, 35, 15, 63, 6);
  context.closePath();
  context.fill();
  }

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.NoColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function wallLuma(color: string) {
  const normalized = color.replace("#", "").trim();
  const hex = normalized.length === 3
    ? normalized.split("").map((character) => `${character}${character}`).join("")
    : normalized;
  const parsed = Number.parseInt(hex, 16);
  if (!Number.isFinite(parsed)) return 1;
  const red = (parsed >> 16) & 255;
  const green = (parsed >> 8) & 255;
  const blue = parsed & 255;
  return (red * 0.299 + green * 0.587 + blue * 0.114) / 255;
}

export function WallLightShader({ paused = false, blossom = false, glowColor, glowStrength, reducedMotion, wallColor }: WallLightShaderProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });
    renderer.domElement.className = "wall-light-shader__canvas";
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-8, 8, 6, -6, 0.1, 40);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);

    const lightWall = wallLuma(wallColor) > 0.55;
    const receiverMaterial = new THREE.ShadowMaterial({
      color: blossom ? (lightWall ? 0x5b5960 : 0x1f2024) : (lightWall ? 0x171311 : 0x050403),
      opacity: lightWall ? (blossom ? 0.17 : 0.165) : 0.1,
      transparent: true,
      depthWrite: false,
    });
    const receiver = new THREE.Mesh(new THREE.PlaneGeometry(48, 36), receiverMaterial);
    receiver.receiveShadow = true;
    scene.add(receiver);

    // A restrained accent pass receives shadows from blossom clusters only.
    // Its small offset lets a blush edge peek out without tinting branches or
    // turning the full canopy shadow pink.
    const blossomAccentMaterial = blossom ? new THREE.ShadowMaterial({
      color: new THREE.Color(glowColor),
      opacity: lightWall ? Math.min(0.095 * glowStrength, 0.12) : 0.04,
      transparent: true,
      depthWrite: false,
    }) : null;
    const blossomAccentReceiver = blossomAccentMaterial
      ? new THREE.Mesh(new THREE.PlaneGeometry(48, 36), blossomAccentMaterial)
      : null;
    if (blossomAccentReceiver) {
      blossomAccentReceiver.position.z = -0.015;
      blossomAccentReceiver.renderOrder = -1;
      blossomAccentReceiver.receiveShadow = true;
      blossomAccentReceiver.layers.set(1);
      scene.add(blossomAccentReceiver);
      camera.layers.enable(1);
    }

    // This follows the accepted Journal Desk construction: actual leaf and
    // branch silhouettes cast through a softened directional-light shadow map.
    const sunlight = new THREE.DirectionalLight(0xfff3dd, 3.4);
    sunlight.position.set(-2.4, 4.2, 18);
    sunlight.target.position.set(0, 0, 0);
    sunlight.castShadow = true;
    const memoryAwareNavigator = navigator as Navigator & { deviceMemory?: number };
    const constrainedDevice = window.matchMedia("(max-width: 760px)").matches
      || (memoryAwareNavigator.deviceMemory ?? 8) <= 4;
    const shadowMapSize = constrainedDevice ? 1024 : 2048;
    sunlight.shadow.mapSize.set(shadowMapSize, shadowMapSize);
    sunlight.shadow.camera.left = -16;
    sunlight.shadow.camera.right = 16;
    sunlight.shadow.camera.top = 14;
    sunlight.shadow.camera.bottom = -14;
    sunlight.shadow.camera.near = 1;
    sunlight.shadow.camera.far = 44;
    sunlight.shadow.bias = -0.00035;
    sunlight.shadow.normalBias = 0.018;
    sunlight.shadow.radius = constrainedDevice ? 6.5 : 13;
    scene.add(sunlight, sunlight.target);

    const blossomAccentLight = blossom ? new THREE.DirectionalLight(0xfff3dd, 2.2) : null;
    if (blossomAccentLight) {
      blossomAccentLight.position.copy(sunlight.position).add(new THREE.Vector3(-0.44, 0.26, 0));
      blossomAccentLight.target.position.copy(sunlight.target.position);
      blossomAccentLight.castShadow = true;
      blossomAccentLight.layers.set(1);
      blossomAccentLight.shadow.mapSize.set(constrainedDevice ? 512 : 1024, constrainedDevice ? 512 : 1024);
      blossomAccentLight.shadow.camera.left = -16;
      blossomAccentLight.shadow.camera.right = 16;
      blossomAccentLight.shadow.camera.top = 14;
      blossomAccentLight.shadow.camera.bottom = -14;
      blossomAccentLight.shadow.camera.near = 1;
      blossomAccentLight.shadow.camera.far = 44;
      blossomAccentLight.shadow.bias = -0.00035;
      blossomAccentLight.shadow.normalBias = 0.02;
      blossomAccentLight.shadow.radius = constrainedDevice ? 8 : 13;
      scene.add(blossomAccentLight, blossomAccentLight.target);
    }

    const leafTexture = makeLeafTexture(blossom);
    if (!leafTexture) {
      host.dataset.shaderFailed = "true";
      renderer.dispose();
      renderer.domElement.remove();
      return undefined;
    }

    const branchGeometry = new THREE.CylinderGeometry(1, 1, 1, 7, 1, false);
    const branchMaterial = new THREE.MeshBasicMaterial({ color: 0x15110e });
    branchMaterial.colorWrite = false;
    branchMaterial.depthWrite = false;

    const leafGeometry = new THREE.PlaneGeometry(1, 1);
    const leafMaterial = new THREE.MeshBasicMaterial({
      alphaMap: leafTexture,
      alphaTest: 0.28,
      color: 0x14110e,
      depthWrite: false,
      side: THREE.DoubleSide,
      transparent: true,
    });
    leafMaterial.colorWrite = false;

    const up = new THREE.Vector3(0, 1, 0);
    const random = seededRandom(8417);
    const movingLeaves: MovingLeaf[] = [];
    const movingCanopies: MovingCanopy[] = [];

    const addBranch = (
      parent: THREE.Group,
      start: THREE.Vector2,
      end: THREE.Vector2,
      radius: number,
      z: number,
    ) => {
      const direction = new THREE.Vector3(end.x - start.x, end.y - start.y, 0);
      const length = direction.length();
      const branch = new THREE.Mesh(branchGeometry, branchMaterial);
      branch.position.set((start.x + end.x) / 2, (start.y + end.y) / 2, z);
      branch.scale.set(radius, length, radius);
      branch.quaternion.setFromUnitVectors(up, direction.normalize());
      branch.castShadow = true;
      parent.add(branch);
    };

    const addLeafCluster = (
      parent: THREE.Group,
      point: THREE.Vector2,
      branchAngle: number,
      z: number,
      depth: number,
    ) => {
      const count = blossom ? (depth === 0 ? 4 : 3) : (depth === 0 ? 5 : 3);
      for (let index = 0; index < count; index += 1) {
        const angle = branchAngle + (random() - 0.5) * 2.1;
        const distance = 0.16 + random() * 0.52;
        const width = blossom ? 0.34 + random() * 0.32 : 0.48 + random() * 0.4;
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(
          point.x + Math.cos(angle) * distance,
          point.y + Math.sin(angle) * distance,
          z + 0.08 + random() * 0.48,
        );
        leaf.scale.set(width, width * (blossom ? (0.8 + random() * 0.2) : (0.3 + random() * 0.12)), 1);
        leaf.rotation.z = angle + (random() - 0.5) * 0.55;
        leaf.castShadow = true;
        if (blossom) leaf.layers.enable(1);
        parent.add(leaf);
        movingLeaves.push({
          basePosition: leaf.position.clone(),
          baseRotation: leaf.rotation.z,
          mesh: leaf,
          phase: random() * Math.PI * 2,
          strength: 0.075 + random() * 0.05,
        });
      }
    };

    const growTree = (
      parent: THREE.Group,
      start: THREE.Vector2,
      angle: number,
      length: number,
      radius: number,
      depth: number,
      z: number,
    ) => {
      const end = new THREE.Vector2(
        start.x + Math.cos(angle) * length,
        start.y + Math.sin(angle) * length,
      );
      addBranch(parent, start, end, radius, z);

      if (depth <= 1 || random() > 0.63) addLeafCluster(parent, end, angle, z, depth);
      if (depth === 0) return;

      const branches = depth > 3 && random() > 0.8 ? 3 : 2;
      const spread = 0.42 + random() * 0.22;
      for (let branchIndex = 0; branchIndex < branches; branchIndex += 1) {
        const centered = branches === 2 ? branchIndex * 2 - 1 : branchIndex - 1;
        const childAngle = angle
          + centered * spread
          + (random() - 0.5) * 0.26
          + Math.sin(depth * 1.7) * 0.035;
        growTree(
          parent,
          end,
          childAngle,
          length * (0.67 + random() * 0.1),
          radius * 0.69,
          depth - 1,
          z + 0.05 + random() * 0.1,
        );
      }
    };

    const canopyDefinitions = [
      { angle: 1.03, length: 2.75, phase: 0.2, position: [-7.5, -6.6] as const, rotation: -0.06, scale: 1.28 },
      { angle: 1.58, length: 2.85, phase: 2.4, position: [-0.7, -7.05] as const, rotation: 0.04, scale: 1.22 },
      { angle: 2.08, length: 2.7, phase: 4.6, position: [7.45, -6.55] as const, rotation: 0.08, scale: 1.28 },
    ];

    canopyDefinitions.forEach((definition, index) => {
      const canopy = new THREE.Group();
      canopy.position.set(definition.position[0], definition.position[1], 0);
      canopy.rotation.z = definition.rotation;
      canopy.scale.setScalar(definition.scale);
      growTree(
        canopy,
        new THREE.Vector2(0, 0),
        definition.angle,
        definition.length,
        0.03,
        5,
        2.6 + index * 0.22,
      );

      movingCanopies.push({
        basePosition: canopy.position.clone(),
        baseRotation: definition.rotation,
        group: canopy,
        phase: definition.phase,
      });
      scene.add(canopy);
    });

    let motionTime = 0;
    let previousFrameTime: number | null = null;
    let animationFrame = 0;
    let scrollFadeFrame = 0;
    let lastRender = -Infinity;
    let visible = !document.hidden;

    const render = (time: number) => {
      movingCanopies.forEach((canopy, index) => {
        const longBreeze = Math.sin(time * (0.72 + index * 0.045) + canopy.phase);
        const passingGust = Math.sin(time * 0.29 + canopy.phase * 0.7);
        const gustEnvelope = 0.76
          + (Math.sin(time * 0.13 + canopy.phase * 0.41) + 1) * 0.2;
        const gustArrival = Math.max(0, Math.sin(time * 0.37 + canopy.phase * 1.3)) ** 3;
        const breeze = (longBreeze * 0.68 + passingGust * 0.32) * gustEnvelope
          + gustArrival * 0.18;
        canopy.group.rotation.z = canopy.baseRotation + breeze * 0.055;
        canopy.group.position.x = canopy.basePosition.x + breeze * (0.13 + index * 0.012);
        canopy.group.position.y = canopy.basePosition.y
          + Math.sin(time * 0.46 + canopy.phase) * 0.05
          + gustArrival * 0.025;
      });
      movingLeaves.forEach((leaf, index) => {
        const flutter = Math.sin(time * (1.18 + (index % 7) * 0.045) + leaf.phase);
        const tremble = Math.sin(time * 2.1 + leaf.phase * 1.31) * 0.24;
        const airPulse = 0.78
          + (Math.sin(time * 0.3 + leaf.phase * 0.19) + 1) * 0.2;
        leaf.mesh.rotation.z = leaf.baseRotation
          + (flutter + tremble) * leaf.strength * airPulse;
        leaf.mesh.position.x = leaf.basePosition.x + flutter * 0.026 * airPulse;
        leaf.mesh.position.y = leaf.basePosition.y + tremble * 0.02 * airPulse;
      });
      renderer.render(scene, camera);
    };

    const syncScrollFade = () => {
      const contact = document.querySelector<HTMLElement>(".folio-contact__flock");
      if (!contact) {
        host.style.opacity = "1";
        return;
      }

      const contactTop = contact.getBoundingClientRect().top + window.scrollY;
      const fadeStart = contactTop - window.innerHeight;
      const fadeEnd = contactTop - window.innerHeight * 0.35;
      const progress = Math.min(1, Math.max(0, (window.scrollY - fadeStart) / Math.max(1, fadeEnd - fadeStart)));
      const eased = progress * progress * (3 - 2 * progress);
      host.style.opacity = String(1 - eased);
    };

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      const aspect = width / height;
      const sceneHeight = 12.5;
      const sceneWidth = sceneHeight * aspect;
      camera.left = -sceneWidth / 2;
      camera.right = sceneWidth / 2;
      camera.top = sceneHeight / 2;
      camera.bottom = -sceneHeight / 2;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
      renderer.setSize(width, height, false);
      render(reducedMotion ? 13 : motionTime);
      syncScrollFade();
      if (!host.dataset.ready) {
        window.requestAnimationFrame(() => {
          host.dataset.ready = "true";
        });
      }
    };

    const animate = (now: number) => {
      animationFrame = 0;
      if (!visible) return;
      const delta = previousFrameTime === null ? 0 : Math.min(50, Math.max(0, now - previousFrameTime));
      previousFrameTime = now;
      if (!pausedRef.current) motionTime += delta / 1000;
      if (!pausedRef.current && now - lastRender >= 41) {
        lastRender = now;
        render(motionTime);
      }
      animationFrame = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (reducedMotion || !visible || animationFrame) return;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const onScroll = () => {
      window.cancelAnimationFrame(scrollFadeFrame);
      scrollFadeFrame = window.requestAnimationFrame(syncScrollFade);
    };

    const onVisibilityChange = () => {
      visible = !document.hidden;
      previousFrameTime = null;
      if (!visible) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        return;
      }
      render(reducedMotion ? 13 : motionTime);
      startAnimation();
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      host.dataset.shaderFailed = "true";
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();
    startAnimation();

    return () => {
      delete host.dataset.ready;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("scroll", onScroll);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
      window.cancelAnimationFrame(scrollFadeFrame);
      scene.clear();
      blossomAccentReceiver?.geometry.dispose();
      blossomAccentMaterial?.dispose();
      receiver.geometry.dispose();
      receiverMaterial.dispose();
      branchGeometry.dispose();
      branchMaterial.dispose();
      leafGeometry.dispose();
      leafMaterial.dispose();
      leafTexture.dispose();
      sunlight.shadow.map?.dispose();
      blossomAccentLight?.shadow.map?.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [blossom, glowColor, glowStrength, reducedMotion, wallColor]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="wall-light-shader"
      data-reduced-motion={reducedMotion ? "true" : "false"}
      data-light-mood={blossom ? "blossom" : "leaf"}
    />
  );
}
