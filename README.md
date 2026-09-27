# One Thing — landing page

Plain HTML, CSS and JavaScript. No build step, no dependencies.

```
index.html   page markup (all sections + download disclaimer)
styles.css   styles
main.js      headline reveal, fade-ins, copy button, waitlist form, disclaimer modal
assets/      favicons
```

## Preview locally

```sh
cd one-thing-website
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Placeholders

1. **The waitlist form**: create a form at https://formspree.io, then put its ID in
   two places: `FORMSPREE_ENDPOINT` at the top of `main.js`, and the `action` of
   `#waitlist-form` in `index.html` (`https://formspree.io/f/YOUR_FORM_ID`).
2. **Screenshots** (optional): the How it works cards use real app screenshots in
   `assets/screens/` (1200×1200 WebP, dark mode, sample data). Replace the files
   to update them.

## Deploy to Vercel

No configuration is needed; Vercel serves the folder as a static site.

**CLI:**

```sh
npm i -g vercel          # once
cd one-thing-website
vercel                   # first run: log in, accept the defaults → preview URL
vercel --prod            # publish to production
```

**Or from GitHub:** push this folder to its own repo, then in the Vercel
dashboard choose *Add New… → Project*, import the repo, leave Framework Preset
as *Other* with no build command, and deploy. Every push redeploys.

## Mac download

The download button links to
`https://github.com/aditya2005chatterjee-bit/one-thing-website/releases/latest/download/One-Thing.dmg`,
which always serves the `One-Thing.dmg` attached to the newest GitHub Release.
To ship a new version: create a new release and attach the new build, named
`One-Thing.dmg`. The site doesn't need to change.
