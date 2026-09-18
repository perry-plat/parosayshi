import type { ReactNode } from "react";
const assetRoot = "/assets/invoice-folio/wizcommerce-case-study/listing";

export interface ListingPreviewProduct {
  id: string;
  name: string;
  price: string;
  image?: string;
}

// Sample catalogue from IKEA US: https://www.ikea.com/us/en/cat/rugs-10653/
// Edit these entries (or pass products) to change the preview.
const referenceProducts: ListingPreviewProduct[] = [
  {
    "id": "40559166",
    "name": "TIPHEDE, Rug, flatwoven",
    "price": "$ 39.99",
    "image": "/assets/invoice-folio/wizcommerce-case-study/listing/rug-1.jpg"
  },
  {
    "id": "90607688",
    "name": "STOENSE, Rug, low pile",
    "price": "$ 149.99",
    "image": "/assets/invoice-folio/wizcommerce-case-study/listing/rug-2.jpg"
  },
  {
    "id": "50277393",
    "name": "LOHALS, Rug, flatwoven",
    "price": "$ 129.99",
    "image": "/assets/invoice-folio/wizcommerce-case-study/listing/rug-3.jpg"
  },
  {
    "id": "80635451",
    "name": "ÄRENDE, Rug, high pile",
    "price": "$ 149.99",
    "image": "/assets/invoice-folio/wizcommerce-case-study/listing/rug-4.jpg"
  },
  {
    "id": "20623408",
    "name": "LOKALTÅG, Rug, low pile",
    "price": "$ 149.99",
    "image": "/assets/invoice-folio/wizcommerce-case-study/listing/rug-5.jpg"
  },
  {
    "id": "20595698",
    "name": "JÄRNVÄG, Rug, low pile",
    "price": "$ 129.99",
    "image": "/assets/invoice-folio/wizcommerce-case-study/listing/rug-6.jpg"
  }
];

export function WizProductListingPreview({ products = referenceProducts }: { products?: readonly ListingPreviewProduct[] }) {
  return <figure className="wiz-listing-preview">
    <div className="wiz-listing-preview__crop" role="img" aria-label="Recreated original product listing page, with a sidebar and product cards showing an image, ID, name, price and Add to cart action.">
      <WizProductListingWindow>
            <div className="wiz-listing-preview__grid">{products.map((product, index) => <div className="wiz-listing-preview__card" key={`${product.id}-${index}`}>
              <div className="wiz-listing-preview__photo">{product.image && <img src={product.image} alt="" />}</div>
              <div className="wiz-listing-preview__details"><div>ID - {product.id}</div><div>Title - {product.name}</div><strong>{product.price}</strong><span className="wiz-listing-preview__action">Add to cart</span></div>
            </div>)}</div>
      </WizProductListingWindow>
    </div>
    <figcaption>The product listing page reps used during sales calls.</figcaption>
  </figure>;
}

export function WizProductListingWindow({ children }: { children: ReactNode }) {
  return (
      <div className="wiz-listing-preview__window">
        <aside aria-hidden="true"><img className="wiz-listing-preview__sidebar-art" src={`${assetRoot}/sidebar.png`} alt="" /></aside>
        <div className="wiz-listing-preview__main">
          <div className="wiz-listing-preview__breadcrumb">Dashboard <span>/</span> Products</div>
          <div className="wiz-listing-preview__catalogue">
            <div className="wiz-listing-preview__count">Showing 1-50 of 244 results</div>
            {children}
          </div>
        </div>
      </div>
  );
}
