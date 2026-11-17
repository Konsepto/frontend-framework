// Bundles the framework (theme-default/css/framework.css, default settings) for the guide's
// component previews. The icon font and accordion images are embedded as data URIs because the
// guide is a standalone page.
import { bundle, browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const FW = fileURLToPath(new URL('../../', import.meta.url));
const OUT = fileURLToPath(new URL('build/', import.meta.url));
const ROOT = '/wp-content/themes/front-end-framework/theme-default/';
const b64 = file => readFileSync(FW + 'theme-default/' + file).toString('base64');

let css = bundle({
	filename: FW + 'theme-default/css/framework.css',
	minify: true,
	drafts: { customMedia: true },
	targets: browserslistToTargets(browserslist('defaults')),
}).code.toString();
css = css
	.replaceAll(`url(${ROOT}fonts/fa-solid-900.woff2)`, `url(data:font/woff2;base64,${b64('fonts/fa-solid-900.woff2')})`)
	.replace(/url\(\/wp-content\/themes\/front-end-framework\/theme-default\/img\/(accordion-(?:collapsed|expanded)\.png)\)/g,
		(m, file) => `url(data:image/png;base64,${b64('img/' + file)})`);
mkdirSync(OUT, { recursive: true });
writeFileSync(OUT + 'framework-demo.css', css);
console.log(`build/framework-demo.css written (${css.length} bytes)`);
