import type { MouseEventHandler } from "react";

export function PersonalEnvelope({ onOpen }: { onOpen: MouseEventHandler<HTMLButtonElement> }) {
  return <section className="personal-envelope" aria-label="A little beyond work">
    <button className="personal-envelope__cover" aria-label="Open a letter from Parth — a little beyond work" aria-haspopup="dialog" onClick={onOpen}>
      <img className="personal-envelope__image" src="/assets/invoice-folio/personal-mailer-paper.png" alt="" draggable={false} width={1024} height={1536} />
      <span className="folio-bento-card__nda-stamp personal-envelope__stamp" aria-hidden="true">PAROSAYSHI</span>
    </button>
  </section>;
}
