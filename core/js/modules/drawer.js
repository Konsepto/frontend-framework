/*!
Drawer (ES module, no jQuery)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto (jQuery version), ES module port 2026
License: The MIT License

A drawer hides additional functionality or content (e.g. the mobile navigation or a search form)
behind a toggle button. Same behaviour, HTML classes and ARIA attributes as jquery.ff.drawer.js:

- toggle button: class "drawer-toggle" (+ "active" when open, "click-interaction"),
  aria-haspopup="true", aria-expanded="true|false", label from translations
- drawer element: class "drawer" + "open" | "closed" (+ "hover-interaction")
- drawers in the same group close each other; Esc inside a drawer closes it
- closed drawers can be made always visible on some screen widths with `display: block !important`

Usage:

import { drawer } from '@front-end-framework/drawer';
drawer(document.querySelector('#block-main-navigation'), {
	translations: { 'show-label': 'Show navigation menu', 'hide-label': 'Hide navigation menu' },
	toggleButton: '#toggle-navigation-menu-button', // element or selector; if null, a button is created
	group: 'header',
	state: 'closed',
	click: true, clickShowSpeed: 250, clickHideSpeed: 250, clickDelay: 0,
	hoverElement: null, hover: true, hoverShowSpeed: 500, hoverHideSpeed: 500, hoverDelay: 500,
	transition: 'slide', // 'slide' or 'fade'
	easing: 'swing', // 'swing' or 'linear'
});
*/

import { slideDown, slideUp, fadeIn, fadeOut, stop, resolve, pickTranslations } from '@front-end-framework/animate';

const TRANSLATIONS = {
	en: { 'show-label': 'Show main navigation', 'hide-label': 'Hide main navigation' },
	fi: { 'show-label': 'Näytä päänavigaatio', 'hide-label': 'Piilota päänavigaatio' },
	sv: { 'show-label': 'Visa huvudnavigering', 'hide-label': 'Dölj huvudnavigering' },
	fr: { 'show-label': 'Afficher la navigation principale', 'hide-label': 'Cacher la navigation principale' },
	de: { 'show-label': 'Hauptnavigation anzeigen', 'hide-label': 'Hauptnavigation ausblenden' },
	es: { 'show-label': 'Mostrar navegación principal', 'hide-label': 'Ocultar navegación principal' },
};

const DEFAULTS = {
	translations: null,
	toggleButton: null,
	group: null,
	state: 'closed',
	click: true,
	clickShowSpeed: 250,
	clickHideSpeed: 250,
	clickDelay: 0,
	hoverElement: null,
	hover: true,
	hoverShowSpeed: 500,
	hoverHideSpeed: 500,
	hoverDelay: 500,
	transition: 'slide',
	easing: 'swing',
};

const groups = {};
const instances = new WeakMap();

export class Drawer {
	constructor(element, options = {}) {
		this.element = element;
		this.settings = { ...DEFAULTS, ...options };
		this.settings.translations = { ...pickTranslations(TRANSLATIONS), ...(options.translations || {}) };
		this.state = 'closed';
		this.timer = null;
		if (typeof this.settings.group === 'string') {
			(groups[this.settings.group] ||= []).push(this);
		}
		this.processElements();
	}

	processElements() {
		const { element, settings } = this;
		element.classList.remove('no-script', 'open', 'closed');
		element.classList.add('drawer');
		this.toggleButton = resolve(settings.toggleButton);
		if (!this.toggleButton && settings.click) {
			this.toggleButton = document.createElement('button');
			this.toggleButton.className = 'drawer-toggle';
			element.before(this.toggleButton);
		}
		this.hoverElement = resolve(settings.hoverElement);
		if (this.toggleButton) {
			this.toggleButton.setAttribute('aria-haspopup', 'true');
			this.toggleButton.classList.remove('no-script', 'active');
			this.toggleButton.classList.add('drawer-toggle');
		}
		this.setState(settings.state === 'closed' ? 'closed' : 'open');
		this.attachEventHandlers();
	}

	// Classes, ARIA attributes and button label for the state
	setState(state) {
		const open = state === 'open';
		this.state = state;
		this.element.classList.remove(open ? 'closed' : 'open');
		this.element.classList.add(open ? 'open' : 'closed');
		if (this.toggleButton) {
			this.toggleButton.classList.toggle('active', open);
			this.toggleButton.setAttribute('aria-expanded', String(open));
			this.toggleButton.innerHTML = this.settings.translations[open ? 'hide-label' : 'show-label'];
		}
	}

	attachEventHandlers() {
		const { element, settings } = this;
		if (settings.click && this.toggleButton) {
			this.toggleButton.classList.add('click-interaction');
			this.toggleButton.addEventListener('click', event => {
				this.toggle();
				event.preventDefault();
			});
		}
		if (settings.hover) {
			element.classList.add('hover-interaction');
			if (this.hoverElement) {
				this.hoverElement.addEventListener('mouseenter', () => {
					if (this.state === 'closed') {
						this.open('hover');
					}
				});
				this.hoverElement.addEventListener('mouseleave', () => {
					if (this.state === 'closed') {
						this.close('hover');
					}
				});
			}
		}
		element.addEventListener('keyup', event => {
			if (event.key === 'Escape') {
				this.close();
			}
		});
	}

	toggle() {
		if (this.state === 'closed') {
			this.open();
		}
		else {
			this.close();
		}
	}

	/** Opens the drawer (interaction: 'click' (default) or 'hover') */
	open(interaction = 'click') {
		const { settings } = this;
		const hover = interaction === 'hover';
		for (const other of groups[settings.group] || []) {
			if (other !== this && other.state === 'open') {
				other.close(interaction);
			}
		}
		clearTimeout(this.timer);
		const show = settings.transition === 'slide' ? slideDown : fadeIn;
		show(this.element, hover ? settings.hoverShowSpeed : settings.clickShowSpeed, settings.easing, () => {
			this.element.style.overflow = 'visible';
		});
		if (!hover) {
			this.setState('open');
		}
	}

	/** Closes the drawer (interaction: 'click' (default) or 'hover') */
	close(interaction = 'click') {
		const { settings } = this;
		const hover = interaction === 'hover';
		stop(this.element);
		clearTimeout(this.timer);
		// Keep it displayed while it animates, although the 'closed' class hides it
		this.element.style.display = 'block';
		const hide = settings.transition === 'slide' ? slideUp : fadeOut;
		const run = () => hide(this.element, hover ? settings.hoverHideSpeed : settings.clickHideSpeed, settings.easing, () => {
			this.element.style.overflow = 'visible';
		});
		const delay = hover ? settings.hoverDelay : settings.clickDelay;
		if (delay > 0) {
			this.timer = setTimeout(run, delay);
		}
		else {
			run();
		}
		if (!hover) {
			this.setState('closed');
		}
	}
}

/** Creates a drawer for an element (once per element) and returns it. */
export function drawer(element, options = {}) {
	if (!element) {
		return null;
	}
	if (!instances.has(element)) {
		instances.set(element, new Drawer(element, options));
	}
	return instances.get(element);
}
