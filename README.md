# mariogruber.com

Marketing site for **DR. GRUBER LTD** (company number 13761319), trading as Dr Gruber Consulting.

Static, zero-dependency, no build step: two HTML pages, one stylesheet, one script. It loads fast, scores well on Core Web Vitals and costs nothing to host.

```
index.html        page, metadata and structured data
privacy.html      privacy notice
styles.css        design system and layout
main.js           scroll reveals, counters, menu, moving strips, fold-out answers
assets/           icons, link-preview image, logo, photos (Pexels) and organisation logos
robots.txt        crawl rules
sitemap.xml       sitemap (home and privacy)
vercel.json       security headers, caching, clean URLs
```

## Deploy free on GitHub plus Vercel

1. Create a repository on GitHub, for example `mariogruber-site`, and keep it private if you prefer.
2. Either upload on github.com (in the new repository: Add file, Upload files, then drag in everything inside this folder, not the folder itself, so index.html sits at the top level), or from this folder:

   ```bash
   git init
   git add .
   git commit -m "Launch mariogruber.com"
   git branch -M main
   git remote add origin https://github.com/<your-username>/mariogruber-site.git
   git push -u origin main
   ```

3. Sign in to vercel.com with the same GitHub account, choose **Add New, Project**, import the repository.
4. Framework preset: **Other**. Leave the build command empty and set the output directory to the repository root. Deploy.
5. In **Project, Settings, Domains**, add `mariogruber.com` and `www.mariogruber.com`.
6. At your domain registrar, point the domain at Vercel using the records Vercel shows you, usually an `A` record for the apex at `76.76.21.21` and a `CNAME` for `www` to `cname.vercel-dns.com`. HTTPS is issued automatically.

Every push to `main` redeploys. Pull requests get their own preview URL.

### Security

`vercel.json` sets HSTS, a strict Content Security Policy, `X-Content-Type-Options`, `X-Frame-Options`, a tight `Referrer-Policy` and a restrictive `Permissions-Policy`. There is no server, no database, no form handler and no third-party tracker, so the attack surface is the static files themselves. If you later add analytics or a form, widen the CSP deliberately rather than removing it.

### Fonts

Inter and JetBrains Mono load from Google Fonts. To remove that third-party request entirely, download both families into `assets/fonts/`, add `@font-face` rules to `styles.css`, delete the two `preconnect` tags and the stylesheet link, and drop `https://fonts.googleapis.com` and `https://fonts.gstatic.com` from the CSP.

## Editing

- **Contact**: every button points at `mario@mariogruber.com`. Search for `mailto:` to change it.
- **Services**: each council service is one `<li>` inside the relevant `.svc` list, with the price band and duration in the `.meta` span. Add or remove rows freely.
- **Testimonials**: the `.carousel__track` holds one `<figure class="quote">` per card. Add more as recommendations come in.
- **Colours**: every colour is a custom property at the top of `styles.css`.
- **Metrics**: hero figures animate from the `data-count`, `data-prefix` and `data-suffix` attributes.

## SEO notes

- One `h1`, descriptive `h2` per section, British English throughout.
- Schema.org `Person`, `ProfessionalService`, `WebSite` and `FAQPage` in a single JSON-LD graph.
- Canonical URL, Open Graph and Twitter cards with a 1200x630 image.
- Internal links from the navigation and footer to every section anchor, plus an outbound `rel="me"` link to the LinkedIn profile.

After launch, add the site to Google Search Console and Bing Webmaster Tools and submit `https://mariogruber.com/sitemap.xml`.

## If you host on GitHub Pages instead of Vercel

- Settings, Pages: deploy from branch `main`, folder `/ (root)`; custom domain `mariogruber.com`; tick Enforce HTTPS once it is offered.
- DNS at the registrar: only the four GitHub `A` records for the apex (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and `www` as a `CNAME` to `<username>.github.io`. Delete any other `A` records for the apex and turn off domain forwarding, or visitors land on the registrar's page instead of the site.
- `vercel.json` is ignored on GitHub Pages, so its security headers and Content Security Policy do not apply there.
- All paths in the pages are relative, so the site also displays correctly at the `<username>.github.io/<repository>/` preview address.
