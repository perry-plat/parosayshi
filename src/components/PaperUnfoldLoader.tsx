import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type PaperUnfoldLoaderProps = {
  active: boolean;
  onComplete: () => void;
  onReady: () => void;
};

function createFrontPageTexture() {
  return new Promise<THREE.CanvasTexture>((resolve) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const image = new Image();
    let didDraw = false;
    canvas.width = 1200;
    canvas.height = 1540;

    const draw = () => {
      if (!context || didDraw) return;
      didDraw = true;
      context.fillStyle = "#fffaf3";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = "#2d2b29";
      context.font = "700 30px monospace";
      context.fillText("05  JUL '26", 64, 82);
      context.textAlign = "right";
      context.fillText("RESUME", 1136, 82);
      context.textAlign = "center";
      context.font = "700 92px Georgia";
      context.fillText("PAROSAYSHI", 600, 112);

      context.strokeStyle = "rgba(96, 77, 61, .35)";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(64, 154);
      context.lineTo(1136, 154);
      context.stroke();

      context.textAlign = "left";
      context.font = "700 22px monospace";
      context.fillText("THE LEAD STORY", 64, 222);
      context.font = "700 92px Georgia";
      const lines = ["I will keep designing", "for fun even in this", "economy"];
      lines.forEach((line, index) => context.fillText(line, 64, 330 + index * 102));
      context.font = "32px Georgia";
      context.fillText("says Parth Jha, an AI optimist, who believes intentmaxxxing is the solution", 64, 660);

      if (image.complete && image.naturalWidth > 0) {
        const targetX = 64;
        const targetY = 728;
        const targetWidth = 1072;
        const targetHeight = 660;
        const imageRatio = image.naturalWidth / image.naturalHeight;
        const targetRatio = targetWidth / targetHeight;
        const sourceWidth = imageRatio > targetRatio ? image.naturalHeight * targetRatio : image.naturalWidth;
        const sourceHeight = imageRatio > targetRatio ? image.naturalHeight : image.naturalWidth / targetRatio;
        const sourceX = (image.naturalWidth - sourceWidth) / 2;
        const sourceY = (image.naturalHeight - sourceHeight) / 2;
        context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, targetX, targetY, targetWidth, targetHeight);
      }

      context.fillStyle = "#4b4842";
      context.font = "24px Georgia";
      context.fillText("Shangarh, Himachal Pradesh, India", 64, 1436);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      resolve(texture);
    };

    image.addEventListener("load", draw, { once: true });
    image.addEventListener("error", draw, { once: true });
    image.src = "/assets/new/hero.png";
    if (image.complete) draw();
  });
}

function PaperMesh({ active, onComplete, onReady }: PaperUnfoldLoaderProps) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const elapsed = useRef(0);
  const hasCompleted = useRef(false);
  const { geometry, basePositions } = useMemo(() => {
    const nextGeometry = new THREE.PlaneGeometry(3.1, 3.98, 34, 44);
    const nextBasePositions = Float32Array.from(nextGeometry.attributes.position.array);
    const positions = nextGeometry.attributes.position.array as Float32Array;
    for (let index = 0; index < positions.length; index += 3) {
      if (positions[index + 1] < 0) positions[index + 1] *= -1;
    }
    nextGeometry.attributes.position.needsUpdate = true;
    nextGeometry.computeVertexNormals();
    return { geometry: nextGeometry, basePositions: nextBasePositions };
  }, []);

  useEffect(() => {
    let disposed = false;
    void createFrontPageTexture().then((nextTexture) => {
      if (disposed) {
        nextTexture.dispose();
        return;
      }
      setTexture(nextTexture);
      onReady();
    });
    return () => {
      disposed = true;
      geometry.dispose();
    };
  }, [geometry, onReady]);

  useEffect(() => () => texture?.dispose(), [texture]);

  useFrame((_, delta) => {
    if (!active || !texture) return;
    elapsed.current += delta;
    const duration = 1.75;
    const rawProgress = Math.min(elapsed.current / duration, 1);
    const progress = 1 - Math.pow(1 - rawProgress, 3);
    const angle = Math.PI * (1 - progress);
    const positions = geometry.attributes.position.array as Float32Array;

    for (let index = 0; index < positions.length; index += 3) {
      const x = basePositions[index];
      const y = basePositions[index + 1];
      if (y >= 0) {
        positions[index] = x;
        positions[index + 1] = y;
        positions[index + 2] = 0;
        continue;
      }

      const distance = -y;
      const normalized = Math.min(distance / 1.99, 1);
      const resistance = Math.sin(normalized * Math.PI) * Math.sin(angle) * 0.13;
      positions[index] = x + Math.sin(x * 2.4) * resistance * 0.035;
      positions[index + 1] = y * Math.cos(angle);
      positions[index + 2] = y * Math.sin(angle) + resistance;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    if (rawProgress === 1 && !hasCompleted.current) {
      hasCompleted.current = true;
      onComplete();
    }
  });

  if (!texture) return null;

  return (
    <group rotation={[-0.08, 0.04, -0.012]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial map={texture} roughness={0.88} metalness={0} side={THREE.FrontSide} />
      </mesh>
      <mesh geometry={geometry} position={[0, 0, 0.006]}>
        <meshStandardMaterial color="#efe9df" roughness={0.96} metalness={0} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export function PaperUnfoldLoader(props: PaperUnfoldLoaderProps) {
  return (
    <Canvas
      className="paper-webgl-canvas"
      camera={{ position: [0, 0.05, 5.25], fov: 43 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      shadows
    >
      <ambientLight intensity={1.55} />
      <directionalLight castShadow intensity={2.8} position={[-2.5, 4, 5]} shadow-mapSize={[1024, 1024]} />
      <pointLight intensity={0.8} position={[3, -1, 3]} />
      <PaperMesh {...props} />
    </Canvas>
  );
}
