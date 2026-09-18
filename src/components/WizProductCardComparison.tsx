import { useState, type CSSProperties } from "react";
const root = "/assets/invoice-folio/wizcommerce-case-study/comparison";

interface ProductCardData {
  image: string;
  name: string;
  id: string;
  price: string;
  tags: readonly string[];
  additionalProducts: number;
  available?: boolean;
}
const defaultProduct: ProductCardData = {
  image: `${root}/bag.png`, name: "Green Crocheted Tote Bag", id: "SK-123124",
  price: "$24.7 - $35.4", tags: ["Green", "Handwoven", "8’X8”"], additionalProducts: 2,
};

const stackedProduct: ProductCardData = {
  image: "/assets/invoice-folio/wizcommerce-case-study/listing/rug-2.jpg",
  name: "STOENSE low-pile rug", id: "90607688", price: "$149.99",
  tags: ["Dark green", "Low pile", "Multiple sizes"], additionalProducts: 2, available: true,
};

function ProductCard({ redesigned, product = defaultProduct, stacked = false }: { redesigned: boolean; product?: ProductCardData; stacked?: boolean }) {
  return <div className={`wiz-compare-card ${redesigned ? "is-new" : "is-old"}`}>
    <div className="wiz-compare-card__photo">
      <img draggable={false} className="wiz-compare-card__bag" src={product.image} alt="" />
      {redesigned && <>{stacked ? <span className="wiz-compare-card__badge wiz-compare-card__badge--bestseller">BESTSELLER</span> : <><span className="wiz-compare-card__badge wiz-compare-card__badge--sale">DECEMBER SALE</span><span className="wiz-compare-card__badge wiz-compare-card__badge--trending">TRENDING</span></>}<span className="wiz-compare-card__heart"><img draggable={false} src={`${root}/heart.svg`} alt="" /></span><span className="wiz-compare-card__similar"><img draggable={false} src={`${root}/similar.svg`} alt="" />View Similar</span></>}
    </div>
    {redesigned && <div className={`wiz-compare-card__stock${product.available ? " is-available" : ""}`}>{product.available ? "In stock :300" : "Back order : 11/14/2025"}</div>}
    <div className="wiz-compare-card__body">
      {!redesigned && <div className="wiz-compare-card__id">ID - {product.id}</div>}
      <div className="wiz-compare-card__name">{product.name}</div>
      {redesigned && <div className="wiz-compare-card__id">{product.id}</div>}
      <strong className="wiz-compare-card__price">{product.price}</strong>
      {redesigned && <><div className="wiz-compare-card__tags">{product.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="wiz-compare-card__history"><img draggable={false} src={`${root}/history.svg`} alt="" /><span className="wiz-history-window"><span className="wiz-history-track"><span>Previously ordered</span><span>4 units last ordered on 11 Jun ’24</span></span></span></div></>}
      <div className="wiz-compare-card__cta">Add to cart{redesigned && <small>+{product.additionalProducts} products</small>}</div>
    </div>
  </div>;
}

export function WizProductCardComparison() {
  const [split, setSplit] = useState(50);
  return <figure className="wiz-card-comparison">
    <div className="wiz-card-comparison__stage" style={{ "--split": `${split}%` } as CSSProperties}>
      <div className="wiz-card-comparison__layer wiz-card-comparison__new" aria-hidden="true"><ProductCard redesigned /></div>
      <div className="wiz-card-comparison__layer wiz-card-comparison__old" aria-hidden="true"><ProductCard redesigned={false} /></div>
      <span className="wiz-card-comparison__label is-before">Original card</span><span className="wiz-card-comparison__label is-after">Redesigned card</span>
      <div className="wiz-card-comparison__divider" aria-hidden="true"><span>‹ ›</span></div>
      <input type="range" min="0" max="100" value={split} onChange={event => setSplit(Number(event.target.value))} aria-label="Compare old and redesigned product cards" aria-valuetext={`${split}% old card, ${100 - split}% redesigned card`} />
    </div>
    <figcaption>Same product, before and after. Drag to compare.</figcaption>
  </figure>;
}


export function WizProductHistoryDemo() {
  return <figure className="wiz-history-demo">
    <div className="wiz-history-demo__stage" role="img" aria-label="Product card showing previous order details: 4 units last ordered on 11 June 2024.">
      <div className="wiz-history-demo__zoom"><ProductCard redesigned /></div>
    </div>
    <figcaption>Scrolling information, right on the product card.</figcaption>
  </figure>;
}

export function WizProductVariantsDemo({ product = stackedProduct }: { product?: ProductCardData }) {
  return <figure className="wiz-variants-reference">
    <div className="wiz-variants-stage wiz-variants-stage--single wiz-variants-stage--isolated" role="img" aria-label="Product card with two closely stacked cards behind it, representing grouped variants">
      <div className="wiz-variants-stack"><ProductCard redesigned product={product} stacked /></div>
    </div>
    <figcaption>Similar variants grouped together, with the count shown below Add to cart.</figcaption>
  </figure>;
}
