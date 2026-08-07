import { FOOTER_FABRIC, WORD_PATCHES, type WordPatch } from "./patches";

export type EmbroideryScene = {
  art: HTMLCanvasElement;
  field: {
    data: Uint8Array;
    width: number;
    height: number;
  };
};

const makeCanvas = (width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

const contextFor = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas 2D is unavailable");
  return context;
};

export async function makeEmbroideryScene(
  width: number,
  height: number,
  fontFamily: string,
): Promise<EmbroideryScene> {
  const sceneWidth = Math.max(1, Math.round(width));
  const sceneHeight = Math.max(1, Math.round(height));
  const shortEdge = Math.min(sceneWidth, sceneHeight);
  const borderPx = Math.max(3, shortEdge * 0.018);
  const bevelPx = Math.max(1.5, shortEdge * 0.007);

  if ("fonts" in document) {
    await document.fonts.ready;
    await document.fonts.load(`900 96px ${fontFamily}`).catch(() => undefined);
  }

  const coverage = makeCanvas(sceneWidth, sceneHeight);
  const coverageContext = contextFor(coverage);
  const ink = makeCanvas(sceneWidth, sceneHeight);
  const inkContext = contextFor(ink);
  const ring = makeCanvas(sceneWidth, sceneHeight);
  const ringContext = contextFor(ring);
  const direction = makeCanvas(sceneWidth, sceneHeight);
  const directionContext = contextFor(direction);
  const art = makeCanvas(sceneWidth, sceneHeight);
  const artContext = contextFor(art);

  artContext.fillStyle = rgb(FOOTER_FABRIC);
  artContext.fillRect(0, 0, sceneWidth, sceneHeight);

  coverageContext.globalCompositeOperation = "lighten";
  inkContext.globalCompositeOperation = "lighten";
  ringContext.globalCompositeOperation = "lighten";
  directionContext.globalCompositeOperation = "lighten";

  for (const patch of WORD_PATCHES) {
    const glyph = makeCanvas(sceneWidth, sceneHeight);
    const glyphContext = contextFor(glyph);
    drawWord(glyphContext, patch, sceneWidth, sceneHeight, fontFamily);

    const silhouette = makeCanvas(sceneWidth, sceneHeight);
    const silhouetteContext = contextFor(silhouette);
    dilate(silhouetteContext, glyph, borderPx * 2.15);

    const borderInner = makeCanvas(sceneWidth, sceneHeight);
    const borderInnerContext = contextFor(borderInner);
    dilate(borderInnerContext, glyph, borderPx * 1.04);

    const borderBand = makeCanvas(sceneWidth, sceneHeight);
    const borderBandContext = contextFor(borderBand);
    borderBandContext.drawImage(silhouette, 0, 0);
    borderBandContext.globalCompositeOperation = "destination-out";
    borderBandContext.drawImage(borderInner, 0, 0);
    borderBandContext.globalCompositeOperation = "source-over";

    const layer = makeCanvas(sceneWidth, sceneHeight);
    const layerContext = contextFor(layer);
    layerContext.drawImage(silhouette, 0, 0);
    layerContext.globalCompositeOperation = "source-in";
    layerContext.fillStyle = rgb(patch.fill);
    layerContext.fillRect(0, 0, sceneWidth, sceneHeight);
    layerContext.globalCompositeOperation = "source-over";
    paintMasked(layerContext, borderBand, patch.border);
    paintMasked(layerContext, glyph, patch.ink);
    artContext.drawImage(layer, 0, 0);

    coverageContext.drawImage(silhouette, 0, 0);
    punchThenAdd(inkContext, silhouette, glyph);
    punchThenAdd(ringContext, silhouette, borderBand);
    punchThenAdd(directionContext, silhouette, glyph);
  }

  const puff = makeCanvas(sceneWidth, sceneHeight);
  const puffContext = contextFor(puff);
  puffContext.filter = `blur(${bevelPx.toFixed(2)}px)`;
  puffContext.drawImage(coverage, 0, 0);
  puffContext.filter = "none";

  const glyphGradient = makeCanvas(sceneWidth, sceneHeight);
  const glyphGradientContext = contextFor(glyphGradient);
  glyphGradientContext.filter = `blur(${Math.max(2, shortEdge * 0.02).toFixed(2)}px)`;
  glyphGradientContext.drawImage(direction, 0, 0);
  glyphGradientContext.filter = "none";

  const rimGradient = makeCanvas(sceneWidth, sceneHeight);
  const rimGradientContext = contextFor(rimGradient);
  rimGradientContext.filter = `blur(${Math.max(2, shortEdge * 0.016).toFixed(2)}px)`;
  rimGradientContext.drawImage(coverage, 0, 0);
  rimGradientContext.filter = "none";

  const coverageData = puffContext.getImageData(0, 0, sceneWidth, sceneHeight).data;
  const inkData = inkContext.getImageData(0, 0, sceneWidth, sceneHeight).data;
  const ringData = ringContext.getImageData(0, 0, sceneWidth, sceneHeight).data;
  const glyphGradientData = glyphGradientContext.getImageData(0, 0, sceneWidth, sceneHeight).data;
  const rimGradientData = rimGradientContext.getImageData(0, 0, sceneWidth, sceneHeight).data;
  const field = new Uint8Array(sceneWidth * sceneHeight * 4);

  const gradient = (data: Uint8ClampedArray, x: number, y: number) => {
    const at = (nextX: number, nextY: number) => {
      const safeX = Math.max(0, Math.min(sceneWidth - 1, nextX));
      const safeY = Math.max(0, Math.min(sceneHeight - 1, nextY));
      return data[(safeY * sceneWidth + safeX) * 4 + 3];
    };

    return [
      at(x + 1, y) - at(x - 1, y),
      at(x, y + 1) - at(x, y - 1),
    ] as const;
  };

  for (let y = 0; y < sceneHeight; y += 1) {
    for (let x = 0; x < sceneWidth; x += 1) {
      const index = (y * sceneWidth + x) * 4;
      const isBorder = ringData[index + 3] > 40 && inkData[index + 3] < 40;
      const [dx, dy] = isBorder
        ? gradient(rimGradientData, x, y)
        : gradient(glyphGradientData, x, y);
      let angle = Math.atan2(dy, dx) + Math.PI / 2;
      angle = ((angle % Math.PI) + Math.PI) % Math.PI;

      field[index] = coverageData[index + 3];
      field[index + 1] = inkData[index + 3];
      field[index + 2] = ringData[index + 3];
      field[index + 3] = Math.round((angle / Math.PI) * 255);
    }
  }

  return {
    art,
    field: {
      data: field,
      width: sceneWidth,
      height: sceneHeight,
    },
  };
}

function rgb(color: [number, number, number]) {
  const channel = (value: number) => Math.round(Math.max(0, Math.min(1, value)) * 255);
  return `rgb(${channel(color[0])} ${channel(color[1])} ${channel(color[2])})`;
}

function paintMasked(
  context: CanvasRenderingContext2D,
  mask: HTMLCanvasElement,
  color: [number, number, number],
) {
  const layer = makeCanvas(context.canvas.width, context.canvas.height);
  const layerContext = contextFor(layer);
  layerContext.drawImage(mask, 0, 0);
  layerContext.globalCompositeOperation = "source-in";
  layerContext.fillStyle = rgb(color);
  layerContext.fillRect(0, 0, layer.width, layer.height);
  context.drawImage(layer, 0, 0);
}

function dilate(
  context: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  radius: number,
) {
  const steps = 28;
  for (let scale = 1; scale >= 0.5; scale -= 0.5) {
    for (let index = 0; index < steps; index += 1) {
      const angle = (index / steps) * Math.PI * 2;
      context.drawImage(
        source,
        Math.cos(angle) * radius * scale,
        Math.sin(angle) * radius * scale,
      );
    }
  }
  context.drawImage(source, 0, 0);
}

function punchThenAdd(
  accumulator: CanvasRenderingContext2D,
  silhouette: HTMLCanvasElement,
  addition: HTMLCanvasElement,
) {
  accumulator.globalCompositeOperation = "destination-out";
  accumulator.drawImage(silhouette, 0, 0);
  accumulator.globalCompositeOperation = "lighten";
  accumulator.drawImage(addition, 0, 0);
}

function drawWord(
  context: CanvasRenderingContext2D,
  patch: WordPatch,
  width: number,
  height: number,
  fontFamily: string,
) {
  const typeUnit = Math.min(height, width * 0.82);
  const fontSize = patch.scale * typeUnit;
  const isPortrait = width / height < 0.72;
  const responsiveY = isPortrait
    ? 0.5 + (patch.cy - 0.52) * 0.64
    : patch.cy;

  context.save();
  context.translate(patch.cx * width, responsiveY * height);
  context.rotate((patch.rotDeg * Math.PI) / 180);
  context.font = `900 ${fontSize}px ${fontFamily}`;
  context.fillStyle = "#fff";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(patch.word, 0, 0);
  context.restore();
}
