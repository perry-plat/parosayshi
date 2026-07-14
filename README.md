# Paro Says Hi

React + TypeScript newspaper portfolio for `parosayshi.com`.

The current site lives at `/`. The previous Framer export is archived at `/old`.

## Code map

See [`COMPONENT_MAP.md`](./COMPONENT_MAP.md) for the component tree, data flow, route map, CSS contracts, and update checklist.

See [`DESIGN_REFERENCES.md`](./DESIGN_REFERENCES.md) for the visual reference ledger, interaction principles, and where each influence belongs in the folio.

## Local preview

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

To test the production bundle locally:

```sh
npm run build
npm run preview
```

## Deploy

This site builds to `dist/`.

- Vercel: import this folder/repo. `vercel.json` handles clean URLs, `/old`, and asset caching.
- Netlify: `netlify.toml` runs `npm run build` and publishes `dist`.
- The included `public/CNAME` is copied into `dist/CNAME`.

After deployment, point the domain's DNS to whichever host you choose.
