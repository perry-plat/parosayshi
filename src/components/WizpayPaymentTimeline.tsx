import { HugeiconsIcon } from "@hugeicons/react";
import UserSearch01Icon from "@hugeicons/core-free-icons/UserSearch01Icon";
import BubbleChatUserIcon from "@hugeicons/core-free-icons/BubbleChatUserIcon";
import Invoice01Icon from "@hugeicons/core-free-icons/Invoice01Icon";
import BubbleChatIcon from "@hugeicons/core-free-icons/BubbleChatIcon";
import CheckmarkCircle01Icon from "@hugeicons/core-free-icons/CheckmarkCircle01Icon";
import DeliveryTruck01Icon from "@hugeicons/core-free-icons/DeliveryTruck01Icon";

const stages = [
  { icon: UserSearch01Icon, title: "Identify lead", detail: "Initial outreach" },
  { icon: BubbleChatUserIcon, title: "Understand needs", detail: "Talk to the customer" },
  { icon: Invoice01Icon, title: "Create quote / cart", detail: "Tailor the order" },
  { icon: BubbleChatIcon, title: "Negotiate", detail: "Agree on the deal" },
  { icon: CheckmarkCircle01Icon, title: "Confirm order", detail: "Finalise the order" },
  { icon: DeliveryTruck01Icon, title: "Ship goods", detail: "One or multiple lots" },
] as const;

const annotations = [
  { title: "Before a quote", detail: "Collect directly against the customer." },
  { title: "At quote or order", detail: "Collect a payment within the sales flow." },
  { title: "After confirmation", detail: "Collect further or partial payments as shipments go out." },
];

export function WizpayPaymentTimeline() {
  return (
    <figure className="wizpay-payment-timeline" aria-label="Wholesale order-taking process, annotated with possible payment entry points">
      <ol className="wizpay-payment-timeline__stages">
        {stages.map(stage => (
          <li key={stage.title}>
            <span className="wizpay-payment-timeline__icon"><HugeiconsIcon icon={stage.icon} size={24} strokeWidth={1.5} aria-hidden="true" /></span>
            <span className="wizpay-payment-timeline__title">{stage.title}</span>
            <span className="wizpay-payment-timeline__detail">{stage.detail}</span>
          </li>
        ))}
      </ol>
      <div className="wizpay-payment-timeline__annotations" aria-label="Payment entry points">
        {annotations.map(note => <div className="wizpay-payment-timeline__annotation" key={note.title}>
          <span className="wizpay-payment-timeline__annotation-title">{note.title}</span>
          <span>{note.detail}</span>
        </div>)}
      </div>
    </figure>
  );
}
