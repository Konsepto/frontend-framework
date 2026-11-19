# Protosite user guide

Builds `build/protosite-opas.html`: a standalone HTML guide (in Finnish) covering design tokens from
Figma, using and customising the framework's native CSS, and every component with a live preview
rendered with the real framework CSS.

```
cd docs/guide
npm install
npm run build        # build-css.mjs (framework bundle for previews) + build.py (the page)
```

Requires Node 18+ and Python 3. Open `build/protosite-opas.html` in a browser or publish it.

- `template.html`: page layout and the written sections (Figma, setup, customising, block theme and
  content: templates, theme blocks, listings and filters, ACF fields, Fluent Forms; commands)
- `components.py`: one entry per component: description, classes, files, settings, demo HTML
  (shown both as the preview and as the copyable code) and optional JavaScript
- `build.py`: fills the template; the settings tables are read from `theme-default/css/settings.css`

When you add or change a component, update its entry in `components.py` and rebuild.
