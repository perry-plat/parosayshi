import type { CSSProperties } from "react";
import { AnnualEmbossMark } from "./AnnualEmbossMark";

export interface AnnualCoverTab {
  color: string;
  ink: string;
  label: string;
}

export interface AnnualCoverPalette {
  backing: string;
  ink: string;
  tabs: [AnnualCoverTab, AnnualCoverTab, AnnualCoverTab];
  title: string;
  underprint: string;
  tint: string;
}

export interface AnnualCoverStructure {
  binding?: boolean;
  capsule: string;
  embossMark: string;
  mark?: string;
  titleLines: string[];
  titleSize?: string;
  underprintText: string;
  year: string;
}

export interface AnnualCoverConfig extends AnnualCoverPalette, AnnualCoverStructure {
  embossEnabled?: boolean;
}

interface AnnualReportCoverProps {
  config: AnnualCoverConfig;
  descriptor: string;
  mode?: "desk" | "focused";
  number: string;
  projectId: string;
}

export function AnnualReportCover({
  config,
  descriptor,
  mode = "desk",
  number,
  projectId,
}: AnnualReportCoverProps) {
  const style = {
    "--annual-cover-backing": config.backing,
    "--annual-cover-ink": config.ink,
    "--annual-cover-title": config.title,
    "--annual-cover-tint": config.tint,
    "--annual-cover-underprint": config.underprint,
    "--annual-title-size": config.titleSize || "10.6cqw",
  } as CSSProperties;

  return (
    <span
      aria-hidden="true"
      className={`annual-cover annual-cover--${mode}`}
      data-binding={config.binding ? "rail" : "none"}
      data-annual-project={projectId}
      style={style}
    >
      <span className="annual-cover__assembly">
        <span className="annual-cover__backing" />

        <span className="annual-cover__inserts">
          <span className="annual-cover__insert annual-cover__insert--one" />
          <span className="annual-cover__insert annual-cover__insert--two" />
        </span>

        <span className="annual-cover__tabs">
          {config.tabs.map((tab, index) => (
            <span
              className="annual-cover__tab"
              key={`${tab.label}-${index}`}
              style={{
                "--annual-tab-color": tab.color,
                "--annual-tab-ink": tab.ink,
              } as CSSProperties}
            >
              <span>{tab.label}</span>
            </span>
          ))}
        </span>

        <span className="annual-cover__underprint">
          <span>{config.underprintText}</span>
        </span>

        <span className="annual-cover__membrane">
          <span className="annual-cover__grain" />
        </span>

        {config.embossEnabled !== false ? (
          <AnnualEmbossMark
            highlight={config.title}
            mark={config.embossMark}
            shadow={config.ink}
          />
        ) : null}

        <span className="annual-cover__surface-print">
          <span className="annual-cover__top-row">
            <span>{config.year}</span>
            <span className="annual-cover__capsule">{config.capsule}</span>
            <span>{number.padStart(2, "0")}</span>
          </span>

          <span className="annual-cover__title" aria-label={config.titleLines.join(" ")}>
            {config.titleLines.map((line) => <span key={line}>{line}</span>)}
          </span>

          {config.mark ? <span className="annual-cover__mark">{config.mark}</span> : null}

          <span className="annual-cover__bottom-copy">
            <span>{descriptor}</span>
            <small>PAROSAYSHI PRESS / PRODUCT DESIGN / INDIA</small>
          </span>
        </span>

        <span className="annual-cover__spine" />
        <span className="annual-cover__binding">
          <span />
        </span>
      </span>
    </span>
  );
}
