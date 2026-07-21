import { useEffect, useState, type CSSProperties } from "react";

interface AnnualEmbossMarkProps {
  highlight: string;
  mark: string;
  shadow: string;
}

const embossTextureCache = new Map<string, string>();

function readHexColor(hex: string) {
  const value = hex.replace("#", "").trim();
  const expanded = value.length === 3
    ? value.split("").map((channel) => channel + channel).join("")
    : value;
  const number = Number.parseInt(expanded, 16);

  if (!Number.isFinite(number) || expanded.length !== 6) return [255, 255, 255] as const;
  return [number >> 16, (number >> 8) & 255, number & 255] as const;
}

function renderEmbossTexture(mark: string, highlight: string, shadow: string) {
  const key = `${mark}|${highlight}|${shadow}`;
  const cached = embossTextureCache.get(key);
  if (cached) return cached;

  const width = 640;
  const height = 220;
  const crisp = document.createElement("canvas");
  crisp.width = width;
  crisp.height = height;
  const crispContext = crisp.getContext("2d", { willReadFrequently: true });
  if (!crispContext) return "";

  crispContext.clearRect(0, 0, width, height);
  crispContext.fillStyle = "#fff";
  crispContext.font = '900 106px "Arial Black", Arial, sans-serif';
  crispContext.textAlign = "center";
  crispContext.textBaseline = "middle";
  const measured = crispContext.measureText(mark).width;
  const maxWidth = width * 0.78;
  if (measured > maxWidth) {
    const size = 106 * (maxWidth / measured);
    crispContext.font = `900 ${size}px "Arial Black", Arial, sans-serif`;
  }
  crispContext.fillText(mark, width / 2, height / 2);

  const softened = document.createElement("canvas");
  softened.width = width;
  softened.height = height;
  const softenedContext = softened.getContext("2d", { willReadFrequently: true });
  if (!softenedContext) return "";
  softenedContext.filter = "blur(1.8px)";
  softenedContext.drawImage(crisp, 0, 0);
  softenedContext.filter = "none";

  const crispPixels = crispContext.getImageData(0, 0, width, height).data;
  const softPixels = softenedContext.getImageData(0, 0, width, height).data;
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const outputContext = output.getContext("2d");
  if (!outputContext) return "";
  const outputPixels = outputContext.createImageData(width, height);
  const data = outputPixels.data;
  const highlightRgb = readHexColor(highlight);
  const shadowRgb = readHexColor(shadow);

  // A fixed upper-left scene light. The inverted slope makes this a shallow press,
  // rather than raised or metallic lettering.
  const lightAngle = (70 * Math.PI) / 180;
  const lightX = -Math.cos(lightAngle);
  const lightY = -Math.sin(lightAngle);
  const alphaAt = (x: number, y: number) => softPixels[(y * width + x) * 4 + 3] / 255;

  for (let y = 2; y < height - 2; y += 1) {
    for (let x = 2; x < width - 2; x += 1) {
      const index = (y * width + x) * 4;
      const gradientX = alphaAt(x + 2, y) - alphaAt(x - 2, y);
      const gradientY = alphaAt(x, y + 2) - alphaAt(x, y - 2);
      const length = Math.hypot(gradientX, gradientY);
      const bevel = Math.min(1, length * 5.4);
      const pressedLight = length > 0
        ? -((gradientX / length) * lightX + (gradientY / length) * lightY)
        : 0;
      const isHighlight = pressedLight > 0;
      const source = isHighlight ? highlightRgb : shadowRgb;
      const directional = 0.35 + Math.abs(pressedLight) * 0.65;
      const contribution = isHighlight ? 0.18 : 0.27;
      const face = crispPixels[index + 3] / 255;
      const faceContribution = face * 0.018;

      data[index] = source[0];
      data[index + 1] = source[1];
      data[index + 2] = source[2];
      data[index + 3] = Math.round(255 * Math.min(0.3, bevel * directional * contribution + faceContribution));
    }
  }

  outputContext.putImageData(outputPixels, 0, 0);
  const texture = output.toDataURL("image/png");
  embossTextureCache.set(key, texture);
  return texture;
}

export function AnnualEmbossMark({ highlight, mark, shadow }: AnnualEmbossMarkProps) {
  const cacheKey = `${mark}|${highlight}|${shadow}`;
  const [texture, setTexture] = useState(() => embossTextureCache.get(cacheKey) || "");

  useEffect(() => {
    setTexture(renderEmbossTexture(mark, highlight, shadow));
  }, [cacheKey, highlight, mark, shadow]);

  return (
    <span
      className="annual-cover__emboss"
      data-texture-ready={texture ? "true" : "false"}
      style={{ "--annual-emboss-texture": texture ? `url(${texture})` : "none" } as CSSProperties}
    >
      <span>{mark}</span>
    </span>
  );
}
