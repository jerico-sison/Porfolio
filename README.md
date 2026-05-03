# Jerico G. Sison — Portfolio Website

A **static, production-style portfolio** for an early-career full-stack web developer. The site is built with **semantic HTML5**, **modern CSS** (custom properties, grid, flexbox), and **vanilla JavaScript**—no frameworks or build step required.

It highlights academic and capstone work (including the **PSAU admission system**), technical skills, experience, and contact pathways suitable for recruiters and collaborators.

---

## Repository layout

| Path | Purpose |
|------|---------|
| `index.html` | Single-page structure: hero, about, skills, projects, experience & education, contact |
| `styles.css` | Global design tokens, layout, components, responsive rules, motion, and cursor styling |
| `script.js` | Loader, mobile navigation, scroll reveals, progress indicator, custom cursor, contact form handler |
| `img/` | Optimised raster assets (e.g. profile photograph) |
| `LICENSE` | MIT License — see terms below |
| `README.md` | This documentation |
| `CONTRIBUTING.md` | Expectations for feedback and forks |

If your workspace also contains duplicate files at the parent folder (e.g. for Apache `htdocs` convenience), treat **`Porfolio/`** as the **canonical** source for GitHub Pages or primary deployment.

---

## Features

- **Responsive layout** from large desktops down to small phones; typography and spacing scale with `clamp()` and fluid grids.
- **Accessibility-minded markup**: skip link, landmark regions, button `aria-expanded` for the menu, live region hints on the contact form.
- **Fullscreen mobile navigation** (viewports ≤980px): opaque panel covering the viewport; sticky header (brand + toggle) remains above the overlay; body scroll locked while open; Escape and link navigation close the menu.
- **Scroll-driven polish**: lightweight section reveals (`IntersectionObserver`), top-of-page reading progress bar.
- **Optional custom cursor** on devices with a fine pointer (`any-pointer: fine`): gradient dot + eased follower ring; disabled on touch-first devices and respected alongside keyboard focus for form fields.
- **Subtle hover treatments** on cards (where `prefers-reduced-motion` allows): gentle border and glow oscillation between brand accent colours.
- **Contact workflow**: client-side validation then `mailto:` with prefilled subject and body (requires a configured default mail client).
- **Initial loader**: short branded splash that removes after load for perceived performance.

---

## Tech stack

- HTML5  
- CSS3 (custom properties, `@keyframes`, `@media`, `backdrop-filter` where supported)  
- ECMAScript (IIFE, DOM APIs, `matchMedia`, passive listeners where applicable)

---

## Local development

### Open the file directly

1. Clone or download this repository.  
2. Open `index.html` in a modern browser.

> Note: Some browsers restrict `file://` behaviour; a local HTTP server is preferable.

### Serve with XAMPP (Apache)

1. Place the project under `htdocs` (for example `htdocs/Jerico Sison/Porfolio`).  
2. Start Apache.  
3. Visit `http://localhost/Jerico%20Sison/Porfolio/` (adjust the path to match your folder names).

### Quick static server (optional)

From the `Porfolio` directory, any static server works, for example:

```bash
npx --yes serve .
```

---

## Deployment (example: GitHub Pages)

1. Publish the contents of **`Porfolio/`** (or the whole repo if only this site exists) to the branch GitHub Pages reads from (`main` / `gh-pages`).  
2. Set the Pages source to that folder if using a monorepo subdirectory (`/Porfolio` in repository settings when supported).  
3. Confirm asset paths remain relative (`./styles.css`, `./img/...`) so the site resolves correctly at your Pages URL.

---

## Customisation checklist

| Goal | Where to edit |
|------|----------------|
| Copy, headings, sections | `index.html` |
| Colours, radii, typography rhythm | `:root` and related rules in `styles.css` |
| Behaviour (thresholds, cursor on/off patterns) | `script.js` |
| Portrait / imagery | Replace files under `img/` and update `src` / `alt` text |
| Legal / licence notice | `LICENSE`; reference in README |

Always keep **alternative text** meaningful on images and test **keyboard navigation** after structural changes.

---

## Browser support

Targets **current evergreen browsers** (Chrome, Firefox, Safari, Edge). Progressive enhancement is used where possible; degraded behaviour on older engines should still leave content readable and navigable.

---

## Contributing

See **[CONTRIBUTING.md](./CONTRIBUTING.md)** for how to propose fixes or reuse the template responsibly.

---

## License

This project is licensed under the **MIT License**. See [`LICENSE`](./LICENSE) for the full text.

You may reuse or adapt the code with attribution as specified in the license. **Personal branding, biography text, and photographs** remain representations of the author; replace them when forking for your own portfolio.

---

## Author

**Jerico G. Sison**  
- GitHub: [@jerico-sison](https://github.com/jerico-sison)  
- Portfolio (example deployment): [jerico-sison.github.io/Porfolio](https://jerico-sison.github.io/Porfolio)

For licensing or collaboration questions, use the contact channels listed on the live site.
