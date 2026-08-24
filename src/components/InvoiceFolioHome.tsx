import type { ProjectId } from "../types/project";
import { WallLightShader } from "./WallLightShader";

interface InvoiceFolioHomeProps {
  onOpenProject: (id: ProjectId, trigger: HTMLButtonElement) => void;
  reducedMotion: boolean;
}

export function InvoiceFolioHome({ reducedMotion }: InvoiceFolioHomeProps) {
  return (
    <main
      className="invoice-folio invoice-folio--wall"
      aria-label="Parth Jha portfolio"
    >
      <WallLightShader reducedMotion={reducedMotion} />
      <section className="wall-folio">
      <div className="wall-folio__window-labels" aria-hidden="true">
        <span>Parosayshi</span>
      </div>
        <footer className="wall-folio__footer">
          <span>Bengaluru / 2026</span>
          <a href="mailto:hello@parosayshi.com?subject=Parth%20Jha%20resume">Resume</a>
        </footer>
      </section>
    </main>
  );
}
