import { PaperTexture } from "@paper-design/shaders-react";

interface CaseStudyTextureProps {
  seed?: number;
}

export function CaseStudyTexture({ seed = 19 }: CaseStudyTextureProps) {
  return (
    <PaperTexture
      aria-hidden="true"
      className="case-study-texture"
      colorBack="#f5eee500"
      colorFront="#11111130"
      contrast={0.3}
      crumpleSize={0.22}
      crumples={0.012}
      drops={0.008}
      fade={0.12}
      fiber={0.52}
      fiberSize={0.075}
      fit="cover"
      foldCount={1}
      folds={0.006}
      maxPixelCount={700_000}
      minPixelRatio={1}
      roughness={0.68}
      scale={1.15}
      seed={seed}
      speed={0}
    />
  );
}
