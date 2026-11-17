Front-end Framework
===================

CSS components, a default theme and JavaScript helpers for websites (mainly WordPress and Drupal
themes). The framework comes in two versions that produce the same styles:

| | Native CSS (recommended) | LESS (legacy) |
| --- | --- | --- |
| Stylesheets | `core/css/`, `theme-default/css/` | `core/less/`, `theme-default/less/` |
| Entry point | `theme-default/css/framework.css` | `theme-default/less/imports.less` |
| Settings | `theme-default/css/settings.css`: CSS custom properties `--ff-*` and `@custom-media` | `theme-default/less/base.less` and the variables at the top of each file |
| Build | Any CSS bundler that resolves `@import` and `@custom-media` (Lightning CSS, PostCSS) | LESS compiler (Gulp, the WP-LESS plugin, LESS.js) |

The LESS version is kept unchanged for sites that still compile it (for example with the WP-LESS
plugin). New work goes into the native version.

JavaScript: `core/js/modules/` contains ES modules without jQuery (drawer, navigation menu,
accessible links, animate). The older jQuery plugins (`core/js/jquery.ff.*.js`) are kept for sites
that use them.


Native CSS version
------------------

### Files

- `theme-default/css/settings.css`: breakpoints and the default values of all `--ff-*` custom
  properties (the LESS defaults). Import it first.
- `core/css/*.css`: core components (structure and behaviour), one file per LESS
  `core/less/*-core.less` file, without the `component-` prefix and `-core` suffix.
- `theme-default/css/*.css`: the default theme (looks), one file per `theme-default/less/*.less`.
- `theme-default/css/framework.css`: imports `settings.css` and every component in the LESS cascade
  order. LESS files that only define variables or mixins have no native file.

Image and font URLs are root-relative (`/wp-content/themes/front-end-framework/theme-default/…`),
like the LESS version's paths in a WordPress install.

### Use

Bundle your own entry file. Either import the whole framework:

```css
@import "../front-end-framework/theme-default/css/framework.css";
@import "settings.css";   /* your values: later @custom-media and :root values win */
@import "site.css";
```

or only the parts you use, keeping the framework order (core files first, then the theme files):

```css
@import "../front-end-framework/theme-default/css/settings.css";
@import "settings.css";
@import "../front-end-framework/theme-default/css/base.css";
@import "../front-end-framework/core/css/normalize.css";
@import "../front-end-framework/core/css/elements.css";
/* … */
@import "../front-end-framework/theme-default/css/elements.css";
```

Build with Lightning CSS (Node):

```js
const lightningcss = require('lightningcss');
const browserslist = require('browserslist');
const { code } = lightningcss.bundle({
	filename: 'styles/main.css',
	minify: true,
	targets: lightningcss.browserslistToTargets(browserslist()),
	drafts: { customMedia: true },
});
```

`@custom-media` is not supported by browsers yet, so the bundler has to replace it. Nesting and
other modern syntax are lowered for the browserslist targets.

protosite-child (WordPress) is a working example: `styles/main.css`, `gulpfile.js`.

### Settings

Breakpoints (`@custom-media`):

| Name | Default | LESS |
| --- | --- | --- |
| `--small` | max-width 747.98px | `@small-screen`, `@layout-1` |
| `--medium` | 748px – 923.98px | `@layout-2` |
| `--medium-up` | min-width 748px | |
| `--below-large` | max-width 923.98px | |
| `--large` | min-width 924px | `@layout-3` and up |
| `--layout-1` … `--layout-5` | the five LESS layout levels | `@layout-1` … `@layout-5` |

Custom properties (see `settings.css` for the full list):

| Group | Properties | LESS variables |
| --- | --- | --- |
| Grid | `--ff-x`, `--ff-y`, `--ff-gutter-width`, `--ff-gutter-height` | `@x`, `@y`, `@gutter-width`, `@gutter-height` |
| Palette | `--ff-color-1` …, `--ff-gray-0` … `--ff-gray-100` (lightness %) | `@color-1` …, `@color-grayscale-N` |
| Text colors | `--ff-color-text-primary`, `-inverse`, `-disabled`, `-link` | `@body-text-color`, `@link-color`, `@button-text-color` … |
| Component colors | `--ff-color-button-bg-*`, `--ff-color-input-bg-*`, `--ff-color-border-*`, `--ff-color-nav-bg-*`, `--ff-color-message-*` | `@button-color*`, `@text-input-color*`, `@navigation-menu-color*`, `@system-message-*` |
| Fonts | `--ff-font-body`, `--ff-font-heading`, `--ff-font-mono` | `@font-1`, `@font-2`, `@font-3` |
| Type scale | `--ff-body-font-size`, `--ff-body-line-height`, `--ff-paragraph-margin`, `--ff-heading-1-font-size` … `-6-`, `--ff-lead-font-size`, `--ff-caption-font-size`, `--ff-small-screen-*` | same names with `@` |
| Buttons | `--ff-button-padding` | `@button-padding` |

Derived defaults are `calc()` expressions (for example the heading scale and paragraph margin follow
`--ff-body-font-size`), so overriding a base value updates them. A site can also set every value
directly.

In a WordPress theme, point the properties at theme.json variables:

```css
:root {
	--ff-color-text-primary: var(--wp--custom--color--text--primary);
	--ff-font-body: var(--wp--preset--font-family--body);
}
```

(protosite-child generates this mapping from theme.json: `design-tokens/build-css-tokens.mjs`.)


Moving a site from LESS to the native version
---------------------------------------------

1. Replace the LESS entry with a CSS entry (see *Use*) and set up the bundler.
2. Settings: write the site's LESS variable values as custom properties after `settings.css`
   (`@body-text-color: #333` → `--ff-color-text-primary: #333`; see the table above).
3. Site stylesheets:
   - `@media @small-screen` → `@media (--small)`; `@layout-N` → `(--layout-N)`.
   - Variables → `var(--ff-…)`; LESS math → `calc()`.
   - Color functions (`darken()`, `fade()` …) → `color-mix()` or a fixed value.
   - Nesting and `&` stay as they are (native CSS nesting). Do not nest under a selector list whose
     selectors have different specificity: it compiles to `:is()`, which takes the highest
     specificity of the list.
   - Mixins: native CSS has none. Most framework mixins also exist as classes; use the class in
     the markup, or copy the rules from the component file into the site selector.

| LESS mixin | Class / native file |
| --- | --- |
| `.button()` | `.button` (`core/css/button.css`, `theme-default/css/button.css`) |
| `.form()`, `.form-tip()`, `.form-value-label()` | `.form`, `.form-tip`, `.form-value-label` (`form.css`) |
| `.search-form()` | `.search-form` (`search-form.css`) |
| `.pagination()`, `.pagination-numbers()` | `.pagination`, `.pagination-numbers` (`pagination.css`) |
| `.list-linear()`, `.list-horizontal()` | `.list-linear`, `.list-horizontal` (`core/css/tricks.css`) |
| `.screen-reader()` | `.screen-reader` (`tricks.css`) |
| `.flex-middle()`, `.flex-grid(N)` | `.flex-middle`, `.flex-grid-N` (`core/css/grid.css`) |
| `.centered-content()` | `.centered-content` (`core/css/tricks.css`) |
| `.navigation-menu-mobile()`, `.navigation-menu-bar-dropdown()` | `.navigation-menu-mobile`, `.navigation-menu-bar-dropdown` (`navigation-menu.css`) |
| `.listing-grid()` | `.listing-grid` (`listing.css`) |
| `.link-unmarked()` | `.link-unmarked` (`link.css`) |
| `.field()` | `.field` (`article.css`) |
| `.icon-font('name')` | write the icon: `font-family: 'Font Awesome 6'; content: '\f002';` (codes in `theme-default/less/icons.less`) |
| `.pagination-control()`, `.pagination-number()`, `.article-teaser()` | no class: copy the rules from the LESS mixin |

4. Compare the result with the LESS build in a browser (computed styles of the same pages), and
   fix differences before removing the LESS files from the site.


How the native files were made
------------------------------

Each LESS file was compiled in the context of the whole framework (other files imported as
references) with the theme variables set to `var(--ff-…)`; the output was then given custom media
queries, `--ff-gray-*` colors and theme-default image paths. The components Protosite uses were
additionally checked in a browser against the LESS build (computed styles identical). Known
intentional difference: the accordion title line height (LESS printed `1.5px`, now the unitless
body line height).
