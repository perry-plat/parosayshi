import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { ProjectCoverData } from "./ProjectSlip";

interface ThreeBookPreviewProps {
  cover: ProjectCoverData;
  onOpen: () => void;
  reducedMotion: boolean;
}

function wrappedLines(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function createCoverTexture(cover: ProjectCoverData) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1536;
  const context = canvas.getContext("2d");
  if (!context) return { texture: new THREE.CanvasTexture(canvas), redraw: () => undefined };

  const redraw = (coverImage?: HTMLImageElement) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = cover.color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (coverImage) {
      const scale = Number.parseFloat(cover.artScale) || 1;
      const width = canvas.width * scale;
      const height = canvas.height * scale;
      context.drawImage(coverImage, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    }

    const shade = context.createLinearGradient(0, 0, canvas.width, 0);
    shade.addColorStop(0, "rgba(0,0,0,0.17)");
    shade.addColorStop(0.075, "rgba(255,255,255,0.08)");
    shade.addColorStop(0.16, "rgba(0,0,0,0)");
    shade.addColorStop(1, "rgba(0,0,0,0.035)");
    context.fillStyle = shade;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = cover.ink;
    context.textBaseline = "top";
    context.font = "700 24px ui-monospace, SFMono-Regular, Menlo, monospace";
    context.letterSpacing = "3px";
    context.fillText(`PAROSAYSHI PRESS / ${cover.number}`, 98, 118);

    const titleSize = cover.title.length > 27 ? 86 : cover.title.length > 18 ? 98 : 112;
    context.font = `600 ${titleSize}px Georgia, 'Times New Roman', serif`;
    context.letterSpacing = "-5px";
    const titleLines = wrappedLines(context, cover.title, 815).slice(0, 4);
    titleLines.forEach((line, index) => context.fillText(line, 98, 210 + index * titleSize * 0.84));

    const titleBottom = 210 + titleLines.length * titleSize * 0.84;
    context.font = "700 23px ui-monospace, SFMono-Regular, Menlo, monospace";
    context.letterSpacing = "2px";
    wrappedLines(context, cover.line.toUpperCase(), 820).slice(0, 3).forEach((line, index) => {
      context.fillText(line, 98, titleBottom + 42 + index * 32);
    });

    context.fillRect(98, 1280, 420, 3);
    context.font = "700 24px ui-monospace, SFMono-Regular, Menlo, monospace";
    context.letterSpacing = "3px";
    context.fillText("PARTH JHA", 98, 1324);
    context.fillText("PRODUCT DESIGN", 98, 1360);
  };

  redraw();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return {
    texture,
    redraw: (image?: HTMLImageElement) => {
      redraw(image);
      texture.needsUpdate = true;
    },
  };
}

function createPageEdgeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#eee7da";
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < canvas.height; y += 8) {
      context.fillStyle = y % 24 === 0 ? "rgba(71,57,43,0.28)" : "rgba(71,57,43,0.13)";
      context.fillRect(0, y, canvas.width, 1);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function ThreeBookPreview({ cover, onOpen, reducedMotion }: ThreeBookPreviewProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, premultipliedAlpha: false });
    } catch {
      setFailed(true);
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "three-book-canvas";
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 10.2);

    const book = new THREE.Group();
    book.rotation.set(-0.12, -0.28, -0.025);
    scene.add(book);

    const { texture: coverTexture, redraw } = createCoverTexture(cover);
    const edgeTexture = createPageEdgeTexture();
    const anisotropy = renderer.capabilities.getMaxAnisotropy();
    coverTexture.anisotropy = anisotropy;
    edgeTexture.anisotropy = anisotropy;

    const coverGeometry = new RoundedBoxGeometry(3.38, 5.08, 0.15, 5, 0.1);
    const pageGeometry = new RoundedBoxGeometry(3.2, 4.86, 0.42, 4, 0.1);
    const coverMaterial = new THREE.MeshPhysicalMaterial({
      map: coverTexture,
      color: 0xffffff,
      roughness: 0.78,
      metalness: 0,
      clearcoat: 0.05,
      clearcoatRoughness: 0.82,
    });
    const backMaterial = new THREE.MeshStandardMaterial({ color: cover.color, roughness: 0.86 });
    const pageMaterial = new THREE.MeshStandardMaterial({ color: 0xeee7da, roughness: 0.92 });
    const edgeMaterial = new THREE.MeshStandardMaterial({ map: edgeTexture, color: 0xffffff, roughness: 0.9 });

    const pageBlock = new THREE.Mesh(pageGeometry, pageMaterial);
    pageBlock.position.set(0.08, -0.01, 0);
    book.add(pageBlock);

    const backCover = new THREE.Mesh(coverGeometry, backMaterial);
    backCover.position.z = -0.28;
    book.add(backCover);

    const frontCover = new THREE.Mesh(coverGeometry, coverMaterial);
    frontCover.position.z = 0.29;
    book.add(frontCover);

    const spine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.13, 4.92, 24),
      new THREE.MeshStandardMaterial({ color: cover.color, roughness: 0.82 }),
    );
    spine.position.set(-1.67, 0, 0.015);
    book.add(spine);

    const pageEdge = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 4.62), edgeMaterial);
    pageEdge.position.set(1.686, -0.01, 0.01);
    pageEdge.rotation.y = Math.PI / 2;
    book.add(pageEdge);

    const bottomEdge = new THREE.Mesh(new THREE.PlaneGeometry(3.02, 0.4), edgeMaterial);
    bottomEdge.position.set(0.08, -2.445, 0.01);
    bottomEdge.rotation.x = Math.PI / 2;
    book.add(bottomEdge);

    scene.add(new THREE.HemisphereLight(0xfff7ea, 0x55483d, 2.15));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.1);
    keyLight.position.set(-4, 5, 7);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xffd6b0, 1.4);
    rimLight.position.set(5, -1, 4);
    scene.add(rimLight);

    const targetRotation = new THREE.Vector2(-0.12, -0.28);
    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const bounds = host.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      targetRotation.x = -0.12 - y * 0.22;
      targetRotation.y = -0.28 + x * 0.42;
    };
    const onPointerLeave = () => targetRotation.set(-0.12, -0.28);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const image = new Image();
    image.decoding = "async";
    image.onload = () => redraw(image);
    image.src = cover.art;

    const clock = new THREE.Clock();
    renderer.setAnimationLoop(() => {
      const elapsed = clock.getElapsedTime();
      book.rotation.x += (targetRotation.x - book.rotation.x) * 0.075;
      book.rotation.y += (targetRotation.y - book.rotation.y) * 0.075;
      book.position.y = reducedMotion ? 0 : Math.sin(elapsed * 1.15) * 0.025;
      renderer.render(scene, camera);
    });

    return () => {
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
      renderer.setAnimationLoop(null);
      book.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      coverTexture.dispose();
      edgeTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [cover, reducedMotion]);

  return (
    <button className="three-book-trigger" type="button" onClick={onOpen} aria-label={`Open the complete ${cover.title} case study`}>
      {failed ? <img className="three-book-fallback" src={cover.art} alt="" /> : null}
      <div className="three-book-host" ref={hostRef} aria-hidden="true" />
    </button>
  );
}
