import { type CSSProperties, useId, useRef, useState } from "react";
import "../styles/wizpay-payment-blocks.css";

const blocks = [
  { id: "collect", label: "Collect payment", alt: "Collect payment blocks: order summary, charges, total amount, and card selection.", width: 584, height: 671 },
  { id: "refund", label: "Refunds", alt: "Refund blocks: select transactions, enter an amount and reason, and choose the refund destination.", width: 480, height: 811 },
  { id: "preauthorize", label: "Pre-authorize", alt: "Pre-authorization blocks: select a card and review past authorized transactions.", width: 480, height: 436 },
  { id: "recurring", label: "Recurring", alt: "Recurring payment block: payable amount, start and end dates, frequency, and schedule.", width: 480, height: 500 },
] as const;

function PaymentIcon({ type }: { type: typeof blocks[number]["id"] }) {
  return <svg className="wp-blocks__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === "collect" && <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h3" /></>}
    {type === "refund" && <><path d="M8 4 3 9l5 5M3 9h11a6 6 0 0 1 0 12h-3" /></>}
    {type === "preauthorize" && <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>}
    {type === "recurring" && <><path d="m17 2 4 4-4 4M21 6H9a6 6 0 0 0-6 6m4 10-4-4 4-4M3 18h12a6 6 0 0 0 6-6" /></>}
  </svg>;
}

export function WizpayPaymentBlocks() {
  const [active, setActive] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return <figure className="wp-blocks-figure">
    <div className="wp-blocks">
    <div className="wp-blocks__tabs" role="tablist" aria-label="Payment actions">
      {blocks.map((block, index) => <button key={block.id} ref={el => { tabs.current[index] = el; }}
        type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`}
        aria-selected={active === index} tabIndex={active === index ? 0 : -1}
        onClick={() => setActive(index)} onKeyDown={event => {
          const next = event.key === "ArrowRight" ? (index + 1) % blocks.length
            : event.key === "ArrowLeft" ? (index + blocks.length - 1) % blocks.length
            : event.key === "Home" ? 0 : event.key === "End" ? blocks.length - 1 : null;
          if (next === null) return;
          event.preventDefault(); event.stopPropagation(); setActive(next); tabs.current[next]?.focus();
        }}><PaymentIcon type={block.id} />{block.label}</button>)}
    </div>
    <div className="wp-blocks__stage">
      {blocks.map((block, index) => <div key={block.id} role="tabpanel" id={`${id}-panel-${index}`}
        aria-labelledby={`${id}-tab-${index}`} hidden={active !== index} tabIndex={0} className="wp-blocks__panel">
        <div className="wp-blocks__art" style={{ aspectRatio: `480 / ${block.height}`, "--wp-art-height": block.height } as CSSProperties}>
          <img src={`/assets/invoice-folio/wizpay-case-study/payment-blocks/${block.id}.png?v=${block.id === "recurring" ? 6 : 4}`} alt={block.alt}
            width={block.width} height={block.height} draggable={false}
            style={{ width: `${block.width / 480 * 100}%` }} />
        </div>
      </div>)}
    </div>
    </div>
    <figcaption className="wp-blocks-caption">From one-time collections to recurring payments, each flow draws from the same set of payment blocks</figcaption>
  </figure>;
}
