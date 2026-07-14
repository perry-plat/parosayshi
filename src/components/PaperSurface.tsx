import { PaperTexture } from "@paper-design/shaders-react";

export function PaperSurface() {
  return (
    <PaperTexture
      aria-hidden="true"
      className="paper-texture-shader"
      colorBack="#fffaf300"
      colorFront="#5b493a26"
      contrast={0.18}
      crumpleSize={0.42}
      crumples={0.05}
      drops={0.025}
      fade={0.18}
      fiber={0.23}
      fiberSize={0.16}
      fit="cover"
      foldCount={3}
      folds={0.025}
      maxPixelCount={1_400_000}
      minPixelRatio={1}
      roughness={0.48}
      scale={0.85}
      seed={7}
      speed={0}
    />
  );
}
