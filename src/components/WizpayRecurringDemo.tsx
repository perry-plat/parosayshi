import { useId, useRef, useState } from "react";


export function WizpayRecurringDemo() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  function close() { setOpen(false); trigger.current?.focus(); }
  return <figure className="wp-blocks-figure">
    <div className="wi-stage wr-stage" onClick={event => event.stopPropagation()} onKeyDown={event => {
      if (open && event.key === "Escape") { event.stopPropagation(); close(); }
      if (open && event.key === "Tab") { event.preventDefault(); event.currentTarget.querySelector<HTMLElement>(".wr-sheet")?.focus(); }
    }}>
      <div className="wr-original" inert={open}>
        <div className="wr-details">
          <strong>Payment Details</strong>
          <div className="wr-field">Monthly collection</div>
          <div className="wr-amount"><span>Payable amount<span className="wr-required">*</span></span><div className="wr-field">$ <span>1000</span></div></div>
          <div className="wr-dates"><span>Schedule</span><div className="wr-date-pair">
            <div className="wr-field"><small>Start date</small>01/01/25<img src="/assets/invoice-folio/wizpay-case-study/invoice-demo/calendar.svg" alt="" /></div>
            <div className="wr-field"><small>End date</small>10/01/25<img src="/assets/invoice-folio/wizpay-case-study/invoice-demo/calendar.svg" alt="" /></div>
          </div><div className="wr-field"><small>Frequency</small>Monthly</div></div>
          <div className="wr-total"><strong>Recurring amount</strong><strong>$ 100</strong></div>
        </div>
        <button ref={trigger} className="wr-view" data-nudge={!open} type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={id} onClick={() => { setOpen(true); }}>View payment schedule</button>
      </div>
      {open && <>
        <div className="wr-backdrop" onClick={close} />
        <section ref={node => { node?.focus({ preventScroll: true }); }} tabIndex={-1} id={id} className="wr-sheet" role="dialog" aria-modal="true" aria-label="Payment schedule">
          <header><strong>Upcoming payment</strong><span className="wr-next-date"><img src="/assets/invoice-folio/wizpay-case-study/invoice-demo/calendar.svg" alt="" />Jan 1, 2025</span></header>
          <table className="wr-schedule-table"><thead><tr><th>Date</th><th>Payment method</th><th>Status</th></tr></thead><tbody>
            {["Jan 1, 2025", "Feb 1, 2025", "Mar 1, 2025", "Apr 1, 2025", "May 1, 2025", "Jun 1, 2025", "Jul 1, 2025", "Aug 1, 2025", "Sep 1, 2025", "Oct 1, 2025"].map(date => <tr key={date}><td>{date}</td><td><span className="wr-visa"><img src="/assets/invoice-folio/wizpay-case-study/invoice-demo/visa.png" alt="Visa" />Ending in 3559</span></td><td><span>Scheduled</span></td></tr>)}
          </tbody></table><p className="wr-schedule-note">10 payments of $100 · $1,000 total</p>
        </section>
      </>}
    </div>
    <figcaption className="wp-blocks-caption">View the payment schedule to see when each collection is due</figcaption>
  </figure>;
}
