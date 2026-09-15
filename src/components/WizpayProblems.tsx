const problems = [
  { title: "Wholesale payments don’t happen in a single checkout", body: "Teams needed to take payments against quotes, orders, or directly against a customer." },
  { title: "Different ways to pay need different details", body: "Each method brought its own inputs and rules, without every option needing to appear at once." },
  { title: "One order doesn’t mean one payment", body: "Deposits, partial and recurring payments meant tracking what had been collected and what was still due." },
];


function ProblemMotion({ index, reducedMotion }: { index: number; reducedMotion: boolean }) {
  if (index === 1) return <img className="wp-ballpoint-methods" src="/assets/invoice-folio/wizpay-case-study/payment-capabilities-row.png" alt="A single row of blue pen sketches: card, ACH bank, cash, a refund returning to a wallet, a recurring-payment calendar, and a card with a pre-authorization hold tag." />;
  if (index === 0) return <img className="wp-original-timeline" src="/assets/invoice-folio/wizpay-case-study/order-flow-typed-blue-notes.png" alt="Sales rep reaches out to the customer, cart, quote creation, order confirmation and shipment. Payments can be collected directly against a customer, against a quote or order, or in parts as shipments go out." />;
  return <div className={"wp-story wp-story--" + index} role="img" aria-label={[
    "Order timeline: sales rep reaches customer, cart, quote creation, order confirmation, shipment. A small Payments question card asks where payments fit.",
    "Card, ACH and cash payments each require different details.",
    "A thousand-dollar order has a 300-dollar deposit, a 350-dollar payment and 350 dollars still due.",
    "A 100-dollar refund connects back to the original 350-dollar payment, leaving 250 dollars retained.",
  ][index]}>
    <div aria-hidden="true" className="wp-story__canvas">
      <svg className="wp-story__connections" viewBox="0 0 320 210"><path d={index === 0 ? "M40 88V121H280V88M160 88V145" : index === 1 ? "M95 65H156V145H229" : index === 2 ? "M84 64V100H270M84 100V156H228" : "M100 67V109H222V147"}/><circle className="wp-story__traveller" r="3.5">{!reducedMotion && <animateMotion dur="5s" repeatCount="2" fill="freeze" path={index === 0 ? "M40 88V121H160V145" : index === 1 ? "M95 65H156V145H229" : index === 2 ? "M84 64V100H270" : "M100 67V109H222V147"}/>}</circle></svg>
      {index === 0 && <>
        <ol className="wp-story__timeline">
          {["Sales rep reaches customer", "Cart", "Quote creation", "Order confirmation", "Shipment"].map(step => <li key={step}><span className="wp-story__timeline-dot"/><span>{step}</span></li>)}
        </ol>
        <div className="wp-story__ticket wp-story__payment-question"><span>Payments<span className="wp-story__question-mark">?</span></span></div>
      </>}
      {index === 1 && <>
        <div className="wp-object wp-object--card"><svg viewBox="0 0 140 88"><path className="wp-object__card-face" d="M13 3Q69 0 127 3Q138 4 137 14L138 74Q138 85 126 85L13 84Q2 84 3 73L2 14Q2 3 13 3Z"/><path className="wp-object__card-shine" d="M82 2h46L48 86H2z"/><rect className="wp-object__chip" x="17" y="28" width="23" height="18" rx="4"/><path className="wp-object__chip-line" d="M25 28v18m7-18v18M17 37h23"/><path className="wp-object__contactless" d="M47 30q7 7 0 14m5-18q11 11 0 22"/><text className="wp-object__card-dots" x="17" y="66">••••  ••••  ••••</text><circle className="wp-object__brand-a" cx="112" cy="65" r="9"/><circle className="wp-object__brand-b" cx="124" cy="65" r="9"/></svg><span>Card</span></div>
        <div className="wp-object wp-object--bank"><svg viewBox="0 0 100 96"><path className="wp-object__bank-shadow" d="M9 89h85l-9-8H18z"/><path className="wp-object__bank-roof" d="M9 32L49 7Q70 18 91 32l-1 6-80-1Z"/><circle className="wp-object__bank-seal" cx="50" cy="24" r="6"/>{[21,43,65].map(x=><g key={x}><rect className="wp-object__bank-pillar" x={x} y="41" width="14" height="37" rx="2"/><path className="wp-object__bank-flute" d={"M"+(x+5)+" 45v29"}/></g>)}<path className="wp-object__bank-base" d="M15 78l70 1v6l-70-1zM9 85l82 1-1 5-81-1z"/><path className="wp-pencil-hatch" d="M24 49l6-5m-6 12 6-5m-6 12 6-5m16 0 6-5m-6 12 6-5m16-9 6-5m-6 12 6-5m-6 12 6-5M12 88l5-3m5 4 5-4m5 4 5-4"/></svg><span>ACH</span></div>
        <div className="wp-object wp-object--cash"><svg viewBox="0 0 136 76"><rect className="wp-object__note-back" x="12" y="3" width="120" height="58" rx="4" transform="rotate(5 72 32)"/><rect className="wp-object__note-middle" x="7" y="9" width="120" height="58" rx="4"/><rect className="wp-object__note" x="2" y="15" width="120" height="58" rx="4"/><path className="wp-object__note-border" d="M18 22h88q0 9 9 9v26q-9 0-9 9H18q0-9-9-9V31q9 0 9-9z"/><ellipse className="wp-object__note-medallion" cx="62" cy="44" rx="17" ry="21"/><text className="wp-object__dollar" x="62" y="53">$</text><path className="wp-object__note-lines" d="M24 39l13 1m-13 6 13-1m50-6 13 1m-13 6 13-1"/><path className="wp-pencil-hatch" d="M13 55l7 7m-7-13 13 13m75-36 9 9m-15-9 15 15"/></svg><span>Cash</span></div>
      </>}
      {index === 2 && <>
        <div className="wp-story__receipt wp-receipt-editorial">
          <div className="wp-receipt-order-id">ORDER #WC-12344</div>
          <div className="wp-receipt-columns"><span>DESCRIPTION</span><span>AMOUNT</span></div>
          <div className="wp-receipt-line"><span>Order total</span><span>$1,000</span></div>
          <div className="wp-receipt-line"><span>Deposit received<small className="wp-receipt-method">Paid by card</small></span><span>$300</span></div>
          <div className="wp-receipt-line"><span>Next payment received<small className="wp-receipt-method">Paid by ACH</small></span><span>$350</span></div>
          <div className="wp-receipt-summary"><div className="wp-receipt-line"><span>Collected so far</span><span>$650</span></div><div className="wp-receipt-line"><span className="wp-receipt-due-label">Still due</span><span className="wp-receipt-circled">$350<svg className="wp-receipt-pen-arrow" viewBox="0 0 60 40"><path d="M5 34Q47 40 48 6m-8 7 8-9 6 10"/></svg></span></div></div>
          <div className="wp-receipt-note">One order, paid in parts.</div>
        </div>
      </>}
      {index === 3 && <>
        <div className="wp-story__ticket wp-story__original"><span>Original payment</span><b>$350</b><div className="wp-story__badge">Received</div></div>
        <div className="wp-story__ticket wp-story__return"><span>↶ Partial refund</span><b>$100</b><small>Back to original source</small></div>
        <div className="wp-story__ticket wp-story__retained"><span>Amount retained</span><b>$250</b></div>
      </>}
    </div>
  </div>;
}

export function WizpayProblems({ reducedMotion }: { reducedMotion: boolean }) {
  return <section className="wizpay-problems" data-reduced-motion={reducedMotion} aria-labelledby="wizpay-problems-heading">
    <h2 id="wizpay-problems-heading">Problems</h2>
    <div className="wizpay-problems__grid">{problems.map((problem, index) => <article key={problem.title}>
      <h3>{problem.title}</h3><p>{problem.body}</p><div className="wizpay-problems__visual"><ProblemMotion index={index} reducedMotion={reducedMotion}/></div>
    </article>)}</div>
  </section>;
}
