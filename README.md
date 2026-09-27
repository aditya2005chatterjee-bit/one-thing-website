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

## Waitlist

The iOS waitlist posts to Formspree (`https://formspree.io/f/xjykpaky`, set in
`main.js` and in the form's `action` in `index.html`). Signups appear in the
Formspree dashboard under the form's Submissions, and are emailed to you.

## Screenshots

**Screenshots** (optional): the How it works cards use real app screenshots in
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
