import { useEffect, useMemo, useState, type MouseEvent } from "react";
import {
  ArrowDownRightIcon,
  MagnifyingGlassPlusIcon,
  XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import type { ProjectId } from "../types/project";
import "../styles/archive-garden.css";

export interface ArchiveGardenAsset {
  label: string;
  position?: string;
  src: string;
}

export interface ArchiveGardenProject {
  accent: string;
  id: ProjectId;
  images: ArchiveGardenAsset[];
  kind: string;
  number: string;
  period: string;
  summary: string;
  title: string;
}

interface ProjectArchiveGardenProps {
  items: ArchiveGardenProject[];
  onOpenNotebook: (trigger: HTMLElement) => void;
  onOpenProject: (id: ProjectId, trigger: HTMLElement) => void;
  reducedMotion: boolean;
}

interface MosaicPlacement {
  column: string;
  row: string;
}

const mosaicPatterns: MosaicPlacement[][] = [
  [
    { column: "1", row: "1 / 4" },
    { column: "2", row: "1 / 3" },
    { column: "2", row: "3 / 6" },
    { column: "1", row: "4 / 7" },
    { column: "1", row: "7 / 9" },
    { column: "2", row: "6 / 9" },
    { column: "1", row: "9 / 12" },
    { column: "2", row: "9 / 12" },
    { column: "1", row: "12 / 14" },
    { column: "2", row: "12 / 15" },
    { column: "1", row: "14 / 17" },
    { column: "2", row: "15 / 17" },
  ],
  [
    { column: "1", row: "1 / 3" },
    { column: "2", row: "1 / 4" },
    { column: "1", row: "3 / 6" },
    { column: "2", row: "4 / 6" },
    { column: "1", row: "6 / 9" },
    { column: "2", row: "6 / 9" },
    { column: "1", row: "9 / 11" },
    { column: "2", row: "9 / 12" },
    { column: "1", row: "11 / 14" },
    { column: "2", row: "12 / 14" },
    { column: "1", row: "14 / 17" },
    { column: "2", row: "14 / 17" },
  ],
  [
    { column: "1", row: "1 / 4" },
    { column: "2", row: "1 / 4" },
    { column: "1", row: "4 / 6" },
    { column: "2", row: "4 / 7" },
    { column: "1", row: "6 / 9" },
    { column: "2", row: "7 / 9" },
    { column: "1", row: "9 / 12" },
    { column: "2", row: "9 / 12" },
    { column: "1", row: "12 / 15" },
    { column: "2", row: "12 / 14" },
    { column: "2", row: "14 / 17" },
    { column: "1", row: "15 / 17" },
  ],
];

const wizDossierIds: ProjectId[] = [
  "wiz-commerce",
  "wiz-sales-data",
  "wiz-email-flows",
];

const wizDossierLabels: Partial<Record<ProjectId, string>> = {
  "wiz-commerce": "Operating layer",
  "wiz-sales-data": "Sales-floor signals",
  "wiz-email-flows": "Mailroom manual",
};

const artifactKinds = ["SYSTEM", "STATE", "PROOF"] as const;

const fieldNoteStatuses: Partial<Record<ProjectId, string>> = {
  "curo": "ACTIVE",
  "periodic-table": "ONGOING",
  "farevv": "ARCHIVED",
  "kriyadex": "FINISHED",
  "uber-kids": "FINISHED",
};

function getSectionId(id: ProjectId) {
  return `archive-${id}`;
}

export function ProjectArchiveGarden({
  items,
  onOpenNotebook,
  onOpenProject,
  reducedMotion,
}: ProjectArchiveGardenProps) {
  const [lightboxAsset, setLightboxAsset] = useState<ArchiveGardenAsset | null>(null);
  const notesAssets = useMemo(
    () => items.flatMap((item) => item.images.slice(0, 2)).filter((_, index) => index % 2 === 0).slice(0, 8),
    [items],
  );
  const dossierProjects = useMemo(
    () => wizDossierIds.map((id) => items.find((item) => item.id === id)).filter((item): item is ArchiveGardenProject => Boolean(item)),
    [items],
  );
  const standaloneProjects = useMemo(
    () => items.filter((item) => !wizDossierIds.includes(item.id)),
    [items],
  );
  const fieldNoteEntries = useMemo(
    () => [
      {
        id: "archive-garden",
        period: "2026",
        status: "ACTIVE",
        summary: "A homepage organised as a working archive.",
        title: "Archive garden",
      },
      ...standaloneProjects.map((project) => ({
        id: project.id,
        period: project.id === "periodic-table" ? "2026—" : project.period,
        project,
        status: fieldNoteStatuses[project.id] || "FILED",
        summary: project.summary,
        title: project.title,
      })),
    ],
    [standaloneProjects],
  );
  const archiveGroupCount = standaloneProjects.length + 2;

  useEffect(() => {
    if (!lightboxAsset) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxAsset(null);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [lightboxAsset]);

  const openProject = (
    event: MouseEvent<HTMLButtonElement>,
    project: ArchiveGardenProject,
  ) => {
    onOpenProject(project.id, event.currentTarget);
  };

  return (
    <div className="archive-garden">
      <section aria-labelledby="archive-garden-title" className="archive-garden__hero" id="archive-index">
        <motion.article
          animate={{ opacity: 1 }}
          className="archive-garden__identity-paper"
          initial={reducedMotion ? false : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.62, ease: [0.22, 0.72, 0.2, 1] }}
        >
          <h1 id="archive-garden-title">Parth Jha</h1>
          <div className="archive-garden__identity-line" />
          <p>PRODUCT DESIGNER / PRODUCT SYSTEMS<br />PREV. WIZCOMMERCE / STARTUPS</p>
          <div className="archive-garden__identity-line" />
          <p>BENGALURU, INDIA<br />MAKING PRODUCTS AND EVIDENCE</p>
        </motion.article>

        <motion.nav
          animate={{ opacity: 1 }}
          aria-label="Project archive"
          className="archive-garden__index-card"
          initial={reducedMotion ? false : { opacity: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.1, duration: reducedMotion ? 0 : 0.66, ease: [0.22, 0.72, 0.2, 1] }}
        >
          <div className="archive-garden__index-heading">
            <span>THE ARCHIVE</span>
          </div>
          <ol>
            <li className="archive-garden__index-group">
              <a
                className="archive-garden__index-link"
                data-preview-id={dossierProjects[0]?.id}
                href="#archive-workplace-wizcommerce"
              >
                <span>01</span>
                <strong>WizCommerce</strong>
              </a>
              <ol aria-label="WizCommerce project files">
                {dossierProjects.map((item, itemIndex) => (
                  <li key={item.id}>
                    <a
                      className="archive-garden__index-link"
                      data-preview-id={item.id}
                      href={`#${getSectionId(item.id)}`}
                    >
                      <span>{String.fromCharCode(65 + itemIndex)}</span>
                      <strong>{wizDossierLabels[item.id] || item.title}</strong>
                    </a>
                  </li>
                ))}
              </ol>
            </li>
            {standaloneProjects.map((item, itemIndex) => (
              <li key={item.id}>
                <a
                  className="archive-garden__index-link"
                  data-preview-id={item.id}
                  href={`#${getSectionId(item.id)}`}
                >
                  <span>{String(itemIndex + 2).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                </a>
              </li>
            ))}
            <li>
              <a href="#archive-notes">
                <span>{String(archiveGroupCount).padStart(2, "0")}</span>
                <strong>Field notes</strong>
              </a>
            </li>
          </ol>
        </motion.nav>

        <aside className="archive-garden__contact-slip">
          <div>
            <a href="mailto:hello@parosayshi.com">EMAIL</a>
            <a href="https://drive.google.com/file/d/1t2szuLpJstQ-ktsZ5rvWYJ8svIZWmhT2/view?usp=sharing">RESUME</a>
            <span>BENGALURU</span>
          </div>
          <span aria-hidden="true" className="archive-garden__contact-arrow">
            <ArrowDownRightIcon size={22} weight="bold" />
          </span>
        </aside>

        {items.map((project) => (
          <figure
            aria-hidden="true"
            className="archive-garden__hover-preview"
            data-preview-id={project.id}
            key={`menu-preview-${project.id}`}
          >
            <img alt="" src={project.images[0]?.src} style={{ objectPosition: project.images[0]?.position || "center" }} />
          </figure>
        ))}
      </section>

      <main className="archive-garden__files">
        <section
          aria-labelledby="archive-workplace-wizcommerce-title"
          className="archive-garden__dossier-sheet"
          id="archive-workplace-wizcommerce"
        >
          <span aria-hidden="true" className="archive-garden__spine-label">
            01 / {String(archiveGroupCount).padStart(2, "0")} WORKPLACE DOSSIER
          </span>
          <span aria-hidden="true" className="archive-garden__binder-hole archive-garden__binder-hole--one" />
          <span aria-hidden="true" className="archive-garden__binder-hole archive-garden__binder-hole--two" />

          <header className="archive-garden__dossier-copy">
            <div className="archive-garden__dossier-kicker">
              <span>WORKPLACE 01</span>
              <span>2023 — 2025</span>
            </div>
            <h2 id="archive-workplace-wizcommerce-title">WizCommerce</h2>
            <p>PRODUCT DESIGN ACROSS THE OPERATING LAYER FOR WHOLESALE: CORE COMMERCE, SALES SIGNALS, AND CUSTOMER COMMUNICATION.</p>
            <dl>
              <div><dt>ROLE</dt><dd>PRODUCT DESIGNER</dd></div>
              <div><dt>FILES</dt><dd>{String(dossierProjects.length).padStart(2, "0")} PROJECT STUDIES</dd></div>
            </dl>
          </header>

          <div className="archive-garden__dossier-projects">
            {dossierProjects.map((project, projectIndex) => (
              <article
                aria-labelledby={`${getSectionId(project.id)}-title`}
                className="archive-garden__dossier-insert"
                id={getSectionId(project.id)}
                key={project.id}
              >
                <span aria-hidden="true" className="archive-garden__dossier-tab">
                  WIZ · 01{String.fromCharCode(65 + projectIndex)}
                </span>
                <header className="archive-garden__dossier-insert-copy">
                  <div className="archive-garden__project-meta">
                    <span>WIZCOMMERCE / {project.period}</span>
                  </div>
                  <button
                    aria-label={`Open ${project.title} case study`}
                    className="archive-garden__dossier-title"
                    data-project={project.id}
                    id={`${getSectionId(project.id)}-title`}
                    onClick={(event) => openProject(event, project)}
                    type="button"
                  >
                    {wizDossierLabels[project.id] || project.title}
                  </button>
                  <p>{project.summary}</p>
                  <span className="archive-garden__dossier-open-cue">OPEN FULL CASE STUDY ↗</span>
                </header>

                <div className="archive-garden__dossier-mosaic">
                  {project.images.slice(0, 3).map((asset, assetIndex) => (
                    <button
                      aria-label={`Enlarge ${asset.label}`}
                      className="archive-garden__mosaic-item"
                      data-featured={assetIndex === 0 ? "true" : undefined}
                      key={`${project.id}-${asset.src}`}
                      onClick={() => setLightboxAsset(asset)}
                      type="button"
                    >
                      <img
                        alt=""
                        loading={projectIndex === 0 ? "eager" : "lazy"}
                        src={asset.src}
                        style={{ objectPosition: asset.position || "center" }}
                      />
                      <MagnifyingGlassPlusIcon aria-hidden="true" className="archive-garden__zoom-icon" size={18} weight="bold" />
                    </button>
                  ))}
                </div>

                <div aria-label={`${project.title} evidence index`} className="archive-garden__evidence-rail">
                  <div className="archive-garden__evidence-heading">
                    <span>EVIDENCE</span>
                    <b>{String(Math.min(project.images.length, 3)).padStart(2, "0")}</b>
                  </div>
                  {project.images.slice(0, 3).map((asset, assetIndex) => (
                    <button
                      aria-label={`Open evidence ${asset.label}`}
                      className="archive-garden__evidence-item"
                      key={`evidence-${project.id}-${asset.src}`}
                      onClick={() => setLightboxAsset(asset)}
                      type="button"
                    >
                      <span>{`01${String.fromCharCode(65 + projectIndex)}.${assetIndex + 1}`}</span>
                      <strong>{asset.label}</strong>
                      <small>{artifactKinds[assetIndex] || "TRACE"}</small>
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {standaloneProjects.map((project, standaloneIndex) => {
          const projectIndex = items.findIndex((item) => item.id === project.id);
          const pattern = mosaicPatterns[projectIndex % mosaicPatterns.length];
          const archiveNumber = String(standaloneIndex + 2).padStart(2, "0");
          return (
            <section
              aria-labelledby={`${getSectionId(project.id)}-title`}
              className="archive-garden__project-sheet"
              id={getSectionId(project.id)}
              key={project.id}
            >
              <span aria-hidden="true" className="archive-garden__spine-label">
                {archiveNumber} / {String(archiveGroupCount).padStart(2, "0")} {project.title}
              </span>
              <span aria-hidden="true" className="archive-garden__binder-hole archive-garden__binder-hole--one" />
              <span aria-hidden="true" className="archive-garden__binder-hole archive-garden__binder-hole--two" />

              <header className="archive-garden__project-copy">
                <div className="archive-garden__project-meta">
                  <span>{project.period}</span>
                  <span>{project.kind}</span>
                </div>
                <button
                  aria-label={`Open ${project.title} case study`}
                  className="archive-garden__project-title"
                  data-project={project.id}
                  data-long-word={project.title.split(/\s+/).some((word) => word.length >= 10) ? "true" : undefined}
                  id={`${getSectionId(project.id)}-title`}
                  onClick={(event) => openProject(event, project)}
                  type="button"
                >
                  {project.title}
                </button>
                <p>{project.summary}</p>
              </header>

              <div className="archive-garden__mosaic">
                {project.images.slice(0, 12).map((asset, assetIndex) => {
                  const placement = pattern[assetIndex % pattern.length];
                  return (
                    <button
                      aria-label={`Enlarge ${asset.label}`}
                      className="archive-garden__mosaic-item"
                      data-color-note={assetIndex === (projectIndex * 3 + 2) % Math.min(project.images.length, 12) ? "true" : undefined}
                      key={`${asset.src}-${assetIndex}`}
                      onClick={() => setLightboxAsset(asset)}
                      style={{ gridColumn: placement.column, gridRow: placement.row }}
                      type="button"
                    >
                      <img
                        alt=""
                        loading={projectIndex < 1 ? "eager" : "lazy"}
                        src={asset.src}
                        style={{ objectPosition: asset.position || "center" }}
                      />
                      <MagnifyingGlassPlusIcon aria-hidden="true" className="archive-garden__zoom-icon" size={18} weight="bold" />
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section aria-labelledby="archive-notes-title" className="archive-garden__notes-sheet" id="archive-notes">
          <span aria-hidden="true" className="archive-garden__spine-label">
            {String(archiveGroupCount).padStart(2, "0")} / {String(archiveGroupCount).padStart(2, "0")} FIELD NOTES
          </span>
          <span aria-hidden="true" className="archive-garden__binder-hole archive-garden__binder-hole--one" />
          <span aria-hidden="true" className="archive-garden__binder-hole archive-garden__binder-hole--two" />
          <header className="archive-garden__project-copy archive-garden__notes-copy">
            <div className="archive-garden__project-meta"><span>2019 — PRESENT</span></div>
            <button
              aria-label="Open field notes"
              className="archive-garden__project-title"
              data-project="notebook"
              id="archive-notes-title"
              onClick={(event) => onOpenNotebook(event.currentTarget)}
              type="button"
            >
              Field notes
            </button>
            <p>LOOSE EXPERIMENTS, INTERFACE STUDIES, AND IDEAS STILL BECOMING SOMETHING.</p>
          </header>
          <div aria-label="Field notes ledger" className="archive-garden__notes-ledger">
            <div className="archive-garden__notes-ledger-heading">
              <span>WORKING LEDGER</span>
              <span>STATUS / YEAR / OBJECT</span>
            </div>
            {fieldNoteEntries.map((entry, entryIndex) => (
              <button
                aria-label={`Open ${entry.title}`}
                className="archive-garden__notes-ledger-row"
                key={entry.id}
                onClick={(event) => {
                  if ("project" in entry && entry.project) {
                    openProject(event, entry.project);
                    return;
                  }
                  onOpenNotebook(event.currentTarget);
                }}
                type="button"
              >
                <span>{String(entryIndex + 1).padStart(2, "0")}</span>
                <span data-status={entry.status.toLowerCase()}>{entry.status}</span>
                <span>{entry.period}</span>
                <strong>{entry.title}</strong>
                <small>{entry.summary}</small>
              </button>
            ))}
          </div>
          <div className="archive-garden__mosaic archive-garden__mosaic--notes">
            {notesAssets.map((asset, assetIndex) => {
              const placement = mosaicPatterns[1][assetIndex % mosaicPatterns[1].length];
              return (
                <button
                  aria-label={`Enlarge ${asset.label}`}
                  className="archive-garden__mosaic-item"
                  key={`notes-${asset.src}-${assetIndex}`}
                  onClick={() => setLightboxAsset(asset)}
                  style={{ gridColumn: placement.column, gridRow: placement.row }}
                  type="button"
                >
                  <img alt="" loading="lazy" src={asset.src} style={{ objectPosition: asset.position || "center" }} />
                  <MagnifyingGlassPlusIcon aria-hidden="true" className="archive-garden__zoom-icon" size={18} weight="bold" />
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <AnimatePresence>
        {lightboxAsset ? (
          <motion.div
            animate={{ opacity: 1 }}
            aria-label={`${lightboxAsset.label} image preview`}
            aria-modal="true"
            className="archive-garden__lightbox"
            initial={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setLightboxAsset(null);
            }}
            role="dialog"
          >
            <motion.figure
              animate={{ opacity: 1, scale: 1, y: 0 }}
              initial={reducedMotion ? false : { opacity: 0, scale: 0.97, y: 16 }}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 0.72, 0.2, 1] }}
            >
              <img alt={lightboxAsset.label} src={lightboxAsset.src} style={{ objectPosition: lightboxAsset.position || "center" }} />
            </motion.figure>
            <button autoFocus aria-label="Close image preview" onClick={() => setLightboxAsset(null)} type="button">
              <XIcon aria-hidden="true" size={22} weight="bold" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
