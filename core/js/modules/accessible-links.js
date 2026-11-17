/*!
Accessible Links (ES module, no jQuery)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto (jQuery version), ES module port 2026
License: The MIT License

Adds assistive texts (in parentheses) and classes / icon spans to links by type: anchor, protocol
(email, phone, application), file type, external host and new tab. Same output as
jquery.ff.accessibleLinks.js. Hide the assistive texts from sighted users with CSS if you wish.
https://webaim.org/techniques/hypertext/hypertext_links

Usage:

import { accessibleLinks } from '@front-end-framework/accessible-links';
accessibleLinks(document.querySelectorAll('a:not([role="button"])'), { translations: { … } });
*/

import { pickTranslations } from '@front-end-framework/animate';

const TRANSLATIONS = {
	en: {
		'anchor': 'anchor', 'email': 'email', 'phone': 'phone', 'application': 'application',
		'pdf file': 'PDF file', 'word file': 'Word file', 'excel file': 'Excel file', 'powerpoint file': 'PowerPoint file',
		'image file': 'image file', 'video file': 'video file', 'audio file': 'audio file', 'archive file': 'archive file',
		'text file': 'text file', 'rich text file': 'rich text file', 'tabular data file': 'tabular data file',
		'code file': 'code file', 'file': 'file', 'external': 'external', 'new tab': 'new tab',
	},
	fi: {
		'anchor': 'ankkuri', 'email': 'sähköposti', 'phone': 'puhelin', 'application': 'sovellus',
		'pdf file': 'PDF-tiedosto', 'word file': 'Word-tiedosto', 'excel file': 'Excel-tiedosto', 'powerpoint file': 'PowerPoint-tiedosto',
		'image file': 'kuvatiedosto', 'video file': 'videotiedosto', 'audio file': 'äänitiedosto', 'archive file': 'arkistotiedosto',
		'text file': 'tekstitiedosto', 'rich text file': 'rikastekstitiedosto', 'tabular data file': 'taulukkodatatiedosto',
		'code file': 'kooditiedosto', 'file': 'tiedosto', 'external': 'ulkoinen', 'new tab': 'uusi välilehti',
	},
	sv: {
		'anchor': 'förankrings', 'email': 'e-post', 'phone': 'telefon', 'application': 'app',
		'pdf file': 'PDF-fil', 'word file': 'Word-fil', 'excel file': 'Excel-fil', 'powerpoint file': 'PowerPoint-fil',
		'image file': 'bidfil', 'video file': 'videofil', 'audio file': 'audiofil', 'archive file': 'arkivfil',
		'text file': 'textfil', 'rich text file': 'riktextfil', 'tabular data file': 'tabelldatafil',
		'code file': 'kodfil', 'file': 'fil', 'external': 'extern', 'new tab': 'ny flik',
	},
	fr: {
		'anchor': 'ancre', 'email': 'e-mail', 'phone': 'numéro de téléphone', 'application': 'application',
		'pdf file': 'fichier PDF', 'word file': 'fichier Word', 'excel file': 'fichier Excel', 'powerpoint file': 'fichier Powerpoint',
		'image file': 'fichier d’image', 'video file': 'fichier de vidéo', 'audio file': 'fichier audio', 'archive file': 'fichier d’archive',
		'text file': 'fichier texte', 'rich text file': 'fichier RTF', 'tabular data file': 'fichier de données tabulaire',
		'code file': 'fichier de code', 'file': 'fichier', 'external': 'extérieur', 'new tab': 'nouvel onglet',
	},
};

// [class suffix, translation key, path pattern]; the first match wins
// https://www.computerhope.com/issues/ch001789.htm, https://fileinfo.com/filetypes/
const FILE_TYPES = [
	['pdf-file', 'pdf file', /\.pdf$/i],
	['word-file', 'word file', /\.(docx?|docm?|dotx?|dotm?)$/i],
	['excel-file', 'excel file', /\.(xlsx?|xlsm?|xltx?|xltm?)$/i],
	['powerpoint-file', 'powerpoint file', /\.(pptx?|pptm?|ppsx?|ppsm?)$/i],
	['image-file', 'image file', /\.(svg|ai|bmp|gif|icon?|jpe?g|png|psd|svg|tiff?|webp|mng|jng|jpx|jpg2?|j2k|jpf)$/i],
	['video-file', 'video file', /\.(3gp|3g2|avi|h264|m4v|mkv|mov|mp4|mpe?g|rm|wmv)$/i],
	['audio-file', 'audio file', /\.(aif|midi?|mp3|mpa|ogg|wav|wma)$/i],
	['archive-file', 'archive file', /\.(zip|7z|gz|z|arj|deb|pkg|rar|rpm|tar)$/i],
	['text-file', 'text file', /\.(txt|log|readme|nfo)$/i],
	['rich-text-file', 'rich text file', /\.(rtf|rtx)$/i],
	['tabular-data-file', 'tabular data file', /\.(csv|tsv)$/i],
	['code-file', 'code file', /\.(js|css|less|sass)$/i],
];
const ANY_FILE = /\.[^/]{0,8}$/i;
const WEB_PAGE = /\.(html?|xhtml|xml|jhtml|php[345]?|cfm|cgi|pl|py|aspx?|axd|asx|asmx|ashx|jspx?|java|do|action|xml|rss)$/i;

const processed = new WeakSet();

function mark(link, type, iconClass, label) {
	link.classList.add('accessible-link', 'link-' + type);
	link.insertAdjacentHTML('beforeend', `<span class="${iconClass}"><span class="assistive text">(${label})</span></span>`);
}

function enhance(a, t) {
	if (a.pathname === location.pathname && a.hash && a.hash !== '#') {
		mark(a, 'anchor', 'link-anchor-icon', t['anchor']);
	}
	else if (a.protocol !== 'javascript:' && a.href) {
		if (a.protocol === 'mailto:') {
			mark(a, 'email', 'link-protocol-icon', t['email']);
		}
		else if (a.protocol === 'tel:') {
			mark(a, 'phone', 'link-protocol-icon', t['phone']);
		}
		else if (a.protocol !== 'http:' && a.protocol !== 'https:') {
			mark(a, 'application', 'link-protocol-icon', t['application']);
		}
		else {
			const type = FILE_TYPES.find(([, , pattern]) => pattern.test(a.pathname));
			if (type) {
				mark(a, type[0], 'link-file-type-icon', t[type[1]]);
			}
			else if (ANY_FILE.test(a.pathname) && !WEB_PAGE.test(a.pathname)) {
				mark(a, 'file', 'link-file-type-icon', t['file']);
			}
			// https://stackoverflow.com/a/6549132
			if (a.hostname !== location.hostname) {
				mark(a, 'external', 'link-host-icon', t['external']);
			}
		}
		const target = a.getAttribute('target');
		if (target && target !== '_self') {
			mark(a, 'new-tab', 'link-target-icon', t['new tab']);
		}
	}
	// Linked images: usually you do not want an image and an icon at the same time
	if (a.classList.contains('accessible-link') && a.querySelector('img')) {
		a.classList.add('has-image');
	}
}

/** Enhances links (an element, a NodeList / array or a selector); each link only once. */
export function accessibleLinks(links, options = {}) {
	const translations = { ...pickTranslations(TRANSLATIONS), ...(options.translations || {}) };
	const list = typeof links === 'string' ? document.querySelectorAll(links) : (links instanceof Element ? [links] : links);
	for (const link of list) {
		if (!processed.has(link)) {
			processed.add(link);
			enhance(link, translations);
		}
	}
}
