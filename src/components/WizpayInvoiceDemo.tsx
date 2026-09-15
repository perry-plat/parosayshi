import { useId, useState } from "react";
import "../styles/wizpay-invoice-demo.css";

const base = "/assets/invoice-folio/wizpay-case-study/invoice-demo/";
function Icon({ name }: { name: string }) {
  return <img className="wi-icon" src={`${base}${name}.svg`} alt="" />;
}

export function WizpayInvoiceDemo({ interactive = true }: { interactive?: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const id = useId();
  return <figure className="wp-blocks-figure">
    <div className="wi-stage" data-static={!interactive}>
      <div className="wi-form">
        <div className="wi-card">
          <strong className="wi-heading">Payment summary</strong>
          <div className="wi-summary">
            <strong className="wi-order">WC_12344 <Icon name="imgIconsOutline" /></strong>
            {[["Order Total", "$ 1000"], ["Amount collected", "$ 350"], ["Amount refunded", "$ 350"]].map(([label, amount]) => <div className="wi-row" key={label}><span>{label}</span><strong>{amount}</strong></div>)}
          </div>
          <div className="wi-divider" />
          <div className="wi-invoices" data-nudge={interactive && !interacted}>
            <button disabled={!interactive} type="button" className="wi-toggle-row" role="switch" aria-checked={enabled} aria-labelledby={`${id}-label`} aria-controls={`${id}-list`} onClick={() => { setEnabled(value => !value); setInteracted(true); }}>
              <strong id={`${id}-label`}>Payment against Invoice</strong>
              <span className="wi-switch" aria-hidden="true">
                <span className="wi-switch-track" /><img src={`${base}imgKnob.svg`} alt="" />
              </span>
            </button>
            <div className="wi-expand" data-open={enabled} id={`${id}-list`} aria-hidden={!enabled}>
              <div className="wi-expand-inner">
                <div className="wi-invoice-list">
                  <div className="wi-invoice-item"><div className="wi-row"><Icon name="imgSizeMediumCheckedOn" /><strong>INV - 38637</strong><strong className="wi-push">$ 400</strong></div><div className="wi-collected wi-row"><span>Amount collected</span><span>$ 350</span></div></div>
                  <div className="wi-invoice-item"><div className="wi-row"><Icon name="imgSizeMediumCheckedOff" /><span>INV - 38637</span><span className="wi-push">$ 500</span></div></div>
                </div>
              </div>
            </div>
          </div>
          <div className="wi-divider" />
          <div className="wi-charges">
            {[["Order/Invoice amount", "1000"], ["Shipping charge", "50"], ["Miscellaneous charge", "0"]].map(([label, amount], index) => <div className="wi-charge" key={label}><span>{label}{index === 0 && <em>*</em>}</span><div className="wi-field"><Icon name="imgIconsOutline1" />{amount}</div></div>)}
          </div>
          <div className="wi-total wi-row"><strong>Total amount</strong><strong>$ 1050</strong></div>
        </div>

      </div>
    </div>
    {interactive && <figcaption className="wp-blocks-caption">Turn on invoice payments to link a collection to an existing invoice</figcaption>}
  </figure>;
}
