# Portfolio redesign

## Direction

Personal developer portfolio for people reviewing Rashad's projects and background. Warm neutral surfaces, dark charcoal text, restrained teal, editorial composition. ENERGY 2 / RHYTHM 3 / MOTION 1.

- Plus Jakarta Sans stays as the existing primary font: its rounded letterforms soften the large name without making the portfolio informal. Georgia is restricted to the personal caption and one About accent.
- Small JetBrains Mono labels identify section numbers and technical metadata; it is not used for large headings.
- Section numbering and thin dividers form the repeated identity motif. Whitespace separates the visual project showcase from the denser technical directory.
- Glass is reserved for the floating navigation (including its mobile menu) and contact surface. The contact gradient gently distinguishes the last section; there are no background blobs or gradient headings.
- Existing Lucide icons indicate actual actions: opening an external link, downloading, copying, editing, deleting, reordering, or toggling a menu. Screenshots replace decorative project icons.
- Screenshot shadows separate the actual application image from its mount. Content sections have no elevated card containers.
- Hover underlines and a small screenshot zoom provide interaction feedback. Reduced motion disables animation and smooth scrolling.
- The original portrait and its CMS-managed caption remain. The offset caption is a personal photo annotation, shared with the CMS preview.

## Repository audit

| Area | Existing implementation and decision |
| --- | --- |
| Framework | Next.js 16.3.4 App Router, React 19.2.8, TypeScript; retained. Local Next documentation read before edits. |
| Styling | Tailwind 4 plus global CSS. Replaced the public CSS foundation; scoped CMS adjustments under `admin-root`. |
| Components | Existing section components retained. Added a shared portrait and a native dialog wrapper because both have multiple consumers. |
| Public page | Server page composes Hero, Projects, About, Experience, Skills, GitHub, Languages, Contact, Footer. |
| CMS | `/admin` manages projects, skill categories/items and profile. Tabs, forms, upload and ordering retained. |
| Storage | JSON files in `data/`, read and written through `fs/promises`; no SQL database or schema migration. |
| APIs | Existing public read endpoints and authenticated admin handlers retained. Projects use POST/PUT/DELETE/PATCH; skills and profile use PUT. |
| Authentication | Existing HTTP-only session cookie and server checks retained. |
| Upload | Authenticated multipart image upload writes to `public/`; retained. |
| Project model | Title, description, category, type, tags, links, image, dimensions, accent/glow fields retained. No featured field exists. |
| Skills model | Ordered categories containing ordered skill items, all rendered dynamically. |
| GitHub | Existing server-side fetch, timeout, token and hourly cache retained. Static repository statistics removed from failure fallback. |
| Responsive | Reworked layouts for mobile, tablet and desktop. Public navigation has a labeled mobile menu; CMS header stops sticking on phones. |
| Motion | CSS feedback only. Removed card lifts, decorative glow and full-page glass. |
| Reuse | Section structure, Next Image, font loading, data libraries, authentication and CMS handlers reused. |
| Dependencies | No package added or removed. Existing Vitest and Testing Library used for regression checks. |

Data flow: CMS forms → authenticated API → JSON storage → `getProjects` / `getSkills` / `getProfile` → server page → public components. Project filters derive their options from the returned records. Skills retain category and item ordering.

## Corrections found during the audit

- Empty arrays previously restored default projects/skills. Storage readers, public components and CMS skill loading now preserve intentional empty content.
- Public project categories previously omitted custom CMS categories. Filters now derive from the data.
- The page now calls `connection()` before reading CMS files, so production output is rendered per request rather than frozen at build time.
- CMS profile values now reach About, the CV link, Contact and Footer as well as the hero.
- Existing image dimensions survive ordinary project edits.
- Failed project reordering and skill saves no longer report a successful save; the UI reloads persisted data after a failed skill save.
- Skill deletion asks for confirmation. The four CMS modals use native dialogs with accessible names, background inertness, Escape dismissal and focus restoration.
- Form controls have associated labels; CMS errors/toasts have announcement roles; mobile controls have at least 44px hit areas.
- Three project descriptions were shortened without changing their factual features. Original project records, skills and portrait were retained.

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with TypeScript checks. `/` is reported as dynamically rendered.
- `npm run test:run`: 43 tests passed across six files, including new empty-storage CRUD regressions, 1/3/6/12 project rendering, new categories, absent links, and 5/10/20/36 skill rendering.
- Real browser CRUD: wrong/correct login, required field validation, create/edit/delete project, cancel deletion, custom category, tags, GitHub/demo links, image upload, project and skill ordering, add/edit/delete skill/category, profile save, logout and unauthorized endpoint checks passed. Temporary records and the uploaded test image were removed; original content was restored. Only the intentional project-description edits remain.
- Browser stress test: 12 project records and 36 skill records rendered without overflow at 320, 375, 430, 768, 1024 and 1440px. Empty arrays showed empty states, not defaults.
- Public and CMS layouts checked at all six widths. All public images decoded successfully; no runtime page errors were recorded.
- Final production-browser pass repeated all six widths and CMS dialog keyboard checks. A WebP optimization request initially stalled in the sandboxed server; restarting the production server outside the sandbox resolved it, and every image decoded successfully.
- Public navigation, filters, CV response, email copying, external link destinations/rel attributes, mobile menu and Escape tested. Reduced-motion CSS verified. Native modal keyboard navigation and focus restoration tested.
- A 320px browser viewport with 200% page zoom initially exposed overflow. Navigation and CTA wrapping were corrected; the repeated check reported a 320px document width and no overflowing elements.
- Screenshots are stored locally under ignored `artifacts/redesign/`. Test fixtures are not published content.
- GitHub live API returned HTTP 200 with an empty repository array for the configured account. Fetch success and network/rate-limit/timeout fallback behavior are covered by mocked tests; a populated live account was not available for visual verification. No live repository statistics were invented.

Measured text contrast: muted on warm background 5.26:1; teal on warm background 5.81:1; white on primary teal 6.40:1; portrait caption 9.49:1; muted on contact tint 4.85:1; white on CMS teal 4.88:1.

## Anti-slop delivery gate

Each PASS applies to the implemented scope and the checks above, not a claim of a formal accessibility certification.

| Gate | Status and evidence |
| --- | --- |
| R-02 | PASS: rewritten public copy has no em-dash prose; dates retain date-range punctuation. |
| R-03 | PASS: six viewport checks found no horizontal overflow; mobile layout reflows. |
| R-17 | PASS: repository statistics only come from the API; counts derive from CMS arrays. |
| R-18 | PASS: no testimonials added. |
| R-23 | PASS: original portrait/assets retained; no synthetic identity assets. |
| R-24 | PASS: navigation anchors resolve to existing sections. |
| R-25 | PASS: primary text pairings measured above; selected CMS count corrected after visual review. |
| R-26 | PASS: navigation/filter/copy/CV and CMS workflows exercised; absent project URLs render no link. |
| R-27 | PASS: server loading fallback, GitHub unavailable/empty message, content empty states and CMS feedback retained or added. |
| R-28 | PASS: no filler FAQ. |
| R-32 | PASS: focus styles, labeled fields, skip link, menu Escape, native modal navigation/restoration checked. |
| R-33 | PASS: implementation resides directly in source and CSS; browser scripts only verify it. |
| R-34 | PASS: one intentional light theme; no unsupported theme switch. |
| R-35 | PASS: build, tests, viewport screenshots and recorded browser interaction checks completed. |
| R-36 | PASS: no invented performance/security/customer claims in the UI. |
| R-37 | PASS: direction declared from the user's detailed brief before implementation. |
| R-38 | PASS: no invented project or skill content shipped; QA fixtures removed. |
| R-01 | PASS: only contact tint uses a gradient; purpose documented above. |
| R-04 | PASS: icons indicate existing actions; decorative project glyphs removed. |
| R-06 | PASS: retained font choices and technical labels have explicit roles. |
| R-07 | PASS: no decorative grid/dot background. |
| R-08 | PASS: directional arrows identify navigation or external actions. |
| R-09 | PASS: no public status pills or invented availability indicator. |
| R-10 | PASS: glass limited to navigation and contact, not content sections. |
| R-12 | PASS: shadows limited to navigation and image separation, with a faint contact elevation. |
| R-13 | PASS: no glow treatments. |
| R-14 | PASS: project images alternate with content; text-only projects use compact rows. |
| R-19 | PASS: hover feedback only; reduced motion respected. |
| R-22 | PASS: no generic illustrations. |
| Liveliness | PASS: explicit 2/3/1 dials, large personal name and portrait, screenshot focal points, structural whitespace, restrained teal and numbered index motif. |
| C-1 / R-31 | PASS: palette, typography, spacing and visual treatment have documented purposes. |
| C-2 | PASS: existing controls retained with real behavior and verification. |
| C-3 / R-05 | PASS: all sections contain existing portfolio content; visual and technical sections use different compositions. |
| C-4 | PASS: tested data quantities, empty states, six widths and keyboard workflows. |
| C-5 | PASS: CMS facts and original imagery retained; fallback statistics removed. |
| R-11 | PASS: square image mounts, small-radius buttons and restrained navigation/contact radius. |
| R-15 / R-16 | PASS: specific CTAs and factual copy replace generic landing-page claims. |
| R-20 / R-30 | PASS: portrait, name and actual project screenshots define the page; no copied product template. |
| R-21 / R-29 | PASS: warm light background requested by the brief, charcoal text, teal accent and muted sage surfaces. |

## Ponytail review

Applied the requested `ponytail-review` after functional verification. The repeated portrait preview was the remaining duplication; both uses now share `Portrait`. Native `<dialog>` supplies modal behavior instead of a focus-trap dependency. Filtering is a Set plus array filter; skill rendering uses native CSS grids. No new dependency, speculative CMS schema, animation library or data layer was introduced.

The existing JSON storage still requires a writable, persistent filesystem for deployed CMS edits. Deployment/storage/authentication architecture was not rewritten by this presentation redesign.
