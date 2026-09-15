import { useLayoutEffect, useRef, useState } from "react";
import "../styles/wizpay-invoice-demo.css";

const base = "/assets/invoice-folio/wizpay-case-study/";
export function WizpayCreditsDemo() {
  const [method, setMethod] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageHeight, setStageHeight] = useState<number>();
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const form = stage.querySelector<HTMLElement>(".wc-form")!;
    const card = form.querySelector<HTMLElement>(".wi-card")!;
    const panels = [...card.querySelectorAll<HTMLElement>(".wc-panel-inner")];
    const measure = () => {
      const style = getComputedStyle(card);
      const children = [...card.children] as HTMLElement[];
      const fixed = children.filter(child => !child.classList.contains("wc-panels")).reduce((sum, child) => {
        const css = getComputedStyle(child);
        return sum + child.offsetHeight + parseFloat(css.marginTop) + parseFloat(css.marginBottom);
      }, 0);
      const tallest = Math.max(...panels.map(panel => panel.scrollHeight));
      const logical = fixed + tallest + parseFloat(style.rowGap) * (children.length - 1) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const zoom = parseFloat(getComputedStyle(form).zoom) || 1;
      setStageHeight(Math.ceil(logical * zoom + 96));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(form);
    panels.forEach(panel => observer.observe(panel));
    measure();
    return () => observer.disconnect();
  }, []);
  return <figure className="wp-blocks-figure">
    <div ref={stageRef} className="wi-stage wc-stage" style={{ height: stageHeight, boxSizing: "border-box" }} onClick={event => event.stopPropagation()}>
      <div className="wi-form wc-form">
        <div className="wi-card">
          <div className="wc-customer">
            <span className="wc-avatar">BFC</span>
            <div><strong className="wi-heading">Beers Future Compny</strong><div className="wi-row"><span>Available credits</span><span>$ 27</span></div></div>
          </div>
          <strong className="wi-heading">Select payment method</strong>
          <div className="wc-methods">
            {[["Credit card", "card"], ["Payment link", "link"], ["Collect offline", "offline"], ["ACH", "check"]].map(([label, icon], index) =>
              <button type="button" key={index} className="wc-method" data-selected={method === index} aria-pressed={method === index} onClick={() => setMethod(index)}><span className="wi-icon wc-method-icon" aria-hidden="true" style={{ maskImage: `url(${base}credits/${icon}.svg)`, WebkitMaskImage: `url(${base}credits/${icon}.svg)` }} /><span>{label}</span></button>
            )}
          </div>
          <div className="wc-panels">
          <div className="wc-panel" data-open={method === 0} aria-hidden={method !== 0} inert={method !== 0}><div className="wc-panel-inner">
            <div className="wi-row wc-card-heading"><strong>Available cards (4)</strong><strong>Add card</strong></div>
            {[0, 1, 2, 3].map(index => <div className="wc-saved-card" key={index}>
              <img className="wi-icon" src={base + "invoice-demo/" + (index === 0 ? "imgSizeMediumCheckedOn.svg" : "imgSizeMediumCheckedOff.svg")} alt={index === 0 ? "Selected" : ""} />
              <div><span>Ending in 3559</span><small>Expiry 05/24</small></div>
              {index === 0 ? <img className="wc-visa" src={base + "invoice-demo/visa.png"} alt="Visa" /> : <span className="wc-mastercard"><img src={base + "credits/mastercard-source.png"} alt="Mastercard" /></span>}
              {index === 0 && <span className="wc-assigned">Assigned</span>}
            </div>)}
          </div></div>
          <div className="wc-panel" data-open={method === 1} aria-hidden={method !== 1} inert={method !== 1}><div className="wc-panel-inner">
            <label className="wc-input-label">Email to<input type="email" defaultValue="john@bestbuyer.com" /></label>
          </div></div>
          <div className="wc-panel" data-open={method === 2} aria-hidden={method !== 2} inert={method !== 2}><div className="wc-panel-inner wc-offline-fields">
            <label className="wc-input-label">Record payment mode<select defaultValue="Credit card"><option>Credit card</option><option>Cash</option><option>Check</option><option>Bank transfer</option></select></label>
            <label className="wc-input-label">Collection date<input type="date" defaultValue="2025-01-01" /></label>
          </div></div>
          <div className="wc-panel" data-open={method === 3} aria-hidden={method !== 3} inert={method !== 3}><div className="wc-panel-inner">
            <strong className="wc-card-heading wc-accounts-heading">Available accounts</strong>
            {[["Tarun M", "Business savings"], ["Pranav Anand", "Business checking"]].map(([name, type], index) => <div className="wc-account" key={name}>
              <img className="wi-icon" src={base + "invoice-demo/" + (index === 0 ? "imgSizeMediumCheckedOn.svg" : "imgSizeMediumCheckedOff.svg")} alt={index === 0 ? "Selected" : ""} />
              <div><div className="wc-account-name"><span>{name}</span><span className="wc-bank-type"><img src={base + "credits/bank.svg"} alt="" />{type}</span></div><small>XXXXXXXXXXX1032</small></div>
              {index === 0 && <span className="wc-assigned">Default</span>}
            </div>)}
          </div></div>
          </div>
          <div className="wi-row wc-footer"><div className="wc-charge"><strong>Charge</strong><strong>$0</strong></div><span className="wc-charge-label">{method === 1 ? "Send link" : method === 2 ? "Record payment" : "Charge"}</span></div>
        </div>
      </div>
    </div>
    <figcaption className="wp-blocks-caption">Select a payment method to see how teams could add customer credits</figcaption>
  </figure>;
}
