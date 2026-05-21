# Paro Says Hi

Static portfolio starter for `parosayshi.com`, rebuilt from the existing Framer homepage content.

## Local preview

```sh
python3 -m http.server 3002
```

Open `http://localhost:3002`.

## Deploy

This site is static, so it can deploy on Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

- Vercel: import this folder/repo, set the framework preset to "Other", and add `parosayshi.com` in Project Settings -> Domains.
- Netlify: publish this folder with publish directory `.` and add `parosayshi.com` under Domain management.
- GitHub Pages: push these files to a GitHub repo and enable Pages. The included `CNAME` points Pages to `parosayshi.com`.

After deployment, point the domain's DNS to whichever host you choose.
