/*!
Navigation Menu (ES module, no jQuery)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto (jQuery version), ES module port 2026
License: The MIT License

Dropdown navigation menu from a normal HTML list (ul/ol > li > a, submenus ul/ol). Same behaviour,
HTML classes and ARIA attributes as jquery.ff.navigationMenu.js:

- nav: aria-label; menu: class "navigation-menu", role="list" (+ "active" when a submenu is open)
- li: class "navigation-menu-item", role="listitem"; with a submenu also "has-children" and
  "collapsed" | "expanded" (+ "hovering")
- submenu toggle: <button class="toggle" aria-haspopup="true" aria-expanded="…"> with an assistive
  label, inserted before the submenu; submenus get class "submenu" (+ "finished" after animating)
- links to the current page: aria-current="page", li "current-menu-item", ancestors "current-menu-ancestor"
- Esc inside the menu collapses everything; links without href (or "#") toggle their submenu

Usage:

import { navigationMenu } from '@front-end-framework/navigation-menu';
navigationMenu(document.querySelector('#menu-main-navigation'), {
	translations: { name: 'Main navigation', 'expand-label': 'Expand', 'collapse-label': 'Collapse' },
	click: true, clickShowSpeed: 250, clickHideSpeed: 250,
	hover: true, hoverShowSpeed: 500, hoverHideSpeed: 500,
	simultaneous: false, // allow hover interaction even when a submenu is expanded
	transition: 'fade', // 'fade' or 'slide'
	easing: 'swing',
});
*/

import { animate, stop, pickTranslations } from '@front-end-framework/animate';

const TRANSLATIONS = {
	en: { name: 'Main navigation', 'expand-label': 'Expand', 'collapse-label': 'Collapse' },
	fi: { name: 'Päänavigaatio', 'expand-label': 'Laajenna', 'collapse-label': 'Kutista' },
	sv: { name: 'Huvudnavigering', 'expand-label': 'Utvidga', 'collapse-label': 'Kollaps' },
	fr: { name: 'Navigation principale', 'expand-label': 'Étendre', 'collapse-label': 'Réduire' },
	de: { name: 'Hauptnavigation', 'expand-label': 'Expandieren', 'collapse-label': 'Zusammenbruch' },
	es: { name: 'Navegación principal', 'expand-label': 'Expandir', 'collapse-label': 'Colapso' },
};

const DEFAULTS = {
	translations: null,
	click: true,
	clickShowSpeed: 250,
	clickHideSpeed: 250,
	hover: true,
	hoverShowSpeed: 500,
	hoverHideSpeed: 500,
	simultaneous: false,
	transition: 'fade',
	easing: 'swing',
};

// Later submenus are stacked above earlier ones
let subMenuOrder = 1000;
const instances = new WeakMap();

const childrenMatching = (element, selector) => [...element.children].filter(child => child.matches(selector));
const isVisible = element => Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);

// jQuery's .width() / .height(): content size without padding and border. Like jQuery, a value
// that is not in px (e.g. "100%" or "auto" on an element that is not rendered) counts as 0, and a
// rendered element with such a value is measured from its box.
function contentSize(element, dimension) {
	const style = getComputedStyle(element);
	const [a, b] = dimension === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];
	const edges = parseFloat(style['padding' + a]) + parseFloat(style['padding' + b])
		+ parseFloat(style['border' + a + 'Width']) + parseFloat(style['border' + b + 'Width']);
	const value = style[dimension];
	if (!value.endsWith('px')) {
		if (!element.getClientRects().length) {
			return 0;
		}
		const box = dimension === 'width' ? element.offsetWidth : element.offsetHeight;
		return Math.max(0, box - edges);
	}
	const size = parseFloat(value);
	return style.boxSizing === 'border-box' ? Math.max(0, size - edges) : size;
}

export class NavigationMenu {
	constructor(element, options = {}) {
		this.element = element;
		this.settings = { ...DEFAULTS, ...options };
		this.settings.translations = { ...pickTranslations(TRANSLATIONS), ...(options.translations || {}) };
		this.state = 'inactive';
		this.processElements();
		this.attachEventHandlers();
	}

	toggleLabel(expanded) {
		return '<span class="assistive text">' + this.settings.translations[expanded ? 'collapse-label' : 'expand-label'] + '</span>';
	}

	processElements() {
		const { element, settings } = this;
		const nav = element.closest('nav');
		if (nav) {
			nav.setAttribute('aria-label', settings.translations.name);
		}
		// role="list": https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html
		element.classList.remove('no-script', 'active');
		element.classList.add('navigation-menu');
		element.setAttribute('role', 'list');

		for (const item of element.querySelectorAll('li')) {
			const submenus = childrenMatching(item, 'ul, ol');
			item.classList.remove('collapsed', 'expanded', 'has-children');
			item.classList.add('navigation-menu-item');
			item.setAttribute('role', 'listitem');
			childrenMatching(item, '.toggle').forEach(toggle => toggle.remove());
			for (const submenu of submenus) {
				submenu.classList.add('submenu');
				submenu.setAttribute('role', 'list');
			}
			if (submenus.length > 0) {
				item.classList.add('has-children', 'collapsed');
				if (settings.click) {
					for (const submenu of submenus) {
						const toggle = document.createElement('button');
						toggle.className = 'toggle';
						toggle.setAttribute('aria-haspopup', 'true');
						toggle.setAttribute('aria-expanded', 'false');
						toggle.innerHTML = this.toggleLabel(false);
						submenu.before(toggle);
					}
				}
			}
		}

		// Mark links to the current page
		const current = window.location.href.split('#')[0];
		for (const link of element.querySelectorAll('li > a')) {
			if (link.href === current) {
				link.setAttribute('aria-current', 'page');
				const item = link.parentElement;
				item.classList.add('current-menu-item');
				for (let ancestor = item.parentElement; ancestor && ancestor !== element; ancestor = ancestor.parentElement) {
					if (ancestor.tagName === 'LI') {
						ancestor.classList.add('current-menu-ancestor');
					}
				}
			}
		}
	}

	attachEventHandlers() {
		const { element, settings } = this;
		if (settings.click) {
			element.classList.add('click-interaction');
			for (const toggle of element.querySelectorAll('.toggle')) {
				toggle.addEventListener('click', event => {
					this.toggleSubmenu(toggle.parentElement);
					event.preventDefault();
				});
			}
		}
		if (settings.hover) {
			element.classList.add('hover-interaction');
			// Bound to the items that have a submenu (all of them are collapsed at this point)
			for (const item of element.querySelectorAll('li.collapsed')) {
				item.addEventListener('mouseenter', () => {
					if (settings.simultaneous || this.state === 'inactive') {
						item.classList.add('hovering');
						this.showSubmenu(item, 'hover');
					}
				});
				item.addEventListener('mouseleave', () => {
					if (settings.simultaneous || this.state === 'inactive') {
						item.classList.remove('hovering');
						this.hideSubmenu(item, 'hover');
					}
				});
			}
		}
		// Links without a target toggle their submenu
		for (const link of element.querySelectorAll('a')) {
			link.addEventListener('click', event => {
				const href = link.getAttribute('href');
				if (href === null || href === '#') {
					const toggle = childrenMatching(link.parentElement, '.toggle')[0];
					if (toggle) {
						toggle.click();
					}
					event.preventDefault();
				}
			});
		}
		element.addEventListener('keyup', event => {
			if (event.key === 'Escape') {
				this.collapseAll();
			}
		});
	}

	// Classes, ARIA attributes and toggle label of a menu item
	markItem(item, expanded) {
		if (expanded) {
			item.classList.remove('collapsed');
			item.classList.add('expanded', 'hovering');
		}
		else {
			item.classList.remove('expanded', 'hovering');
			item.classList.add('collapsed');
		}
		for (const toggle of childrenMatching(item, '.toggle')) {
			toggle.classList.toggle('active', expanded);
			toggle.setAttribute('aria-expanded', String(expanded));
			toggle.innerHTML = this.toggleLabel(expanded);
		}
	}

	updateState() {
		const active = this.element.querySelector('.expanded') !== null;
		this.state = active ? 'active' : 'inactive';
		this.element.classList.toggle('active', active);
	}

	/** Collapses all menu items */
	collapseAll() {
		const expanded = [...this.element.querySelectorAll('.expanded')];
		for (const item of expanded) {
			item.classList.remove('hovering');
			this.markItem(item, false);
		}
		// Innermost first
		for (const item of expanded.filter(item => item.querySelector('.submenu') && [...item.querySelectorAll('.submenu')].some(isVisible)).reverse()) {
			this.hideSubmenu(item);
		}
		this.state = 'inactive';
		this.element.classList.remove('active');
	}

	/** Expands / collapses a menu item */
	toggleSubmenu(item) {
		const expandedItems = [...this.element.querySelectorAll('.expanded')];
		const itemAndAncestors = [];
		for (let node = item; node && node !== this.element; node = node.parentElement) {
			if (node.tagName === 'LI') {
				itemAndAncestors.unshift(node);
			}
		}
		const itemAndDescendants = [item, ...item.querySelectorAll('li')];

		if (item.classList.contains('collapsed')) {
			const others = expandedItems.filter(other => !itemAndAncestors.includes(other));
			others.forEach(other => this.hideSubmenu(other));
			itemAndAncestors.forEach(node => this.showSubmenu(node));
			others.filter(other => other.classList.contains('has-children')).forEach(other => this.markItem(other, false));
			itemAndAncestors.forEach(node => this.markItem(node, true));
		}
		else {
			for (const node of itemAndDescendants) {
				if (childrenMatching(node, '.submenu').some(isVisible)) {
					this.hideSubmenu(node);
				}
			}
			itemAndDescendants.filter(node => node.classList.contains('has-children')).forEach(node => this.markItem(node, false));
		}
		this.updateState();
	}

	// Measures a submenu for the 'slide' transition and picks its direction
	measure(submenu) {
		let currentWidth = 0;
		let currentHeight = 0;
		if (isVisible(submenu)) {
			currentWidth = contentSize(submenu, 'width');
			currentHeight = contentSize(submenu, 'height');
		}
		submenu.style.display = 'block';
		submenu.style.overflow = 'hidden';
		const items = childrenMatching(submenu, 'li');
		items.forEach(li => { li.style.width = 'auto'; });
		submenu.style.width = 'max-content';
		const fullWidth = contentSize(submenu, 'width');
		// Items as wide as the submenu (before measuring its height)
		items.forEach(li => { li.style.width = fullWidth + 'px'; });
		submenu.style.height = 'auto';
		const fullHeight = contentSize(submenu, 'height');
		const box = submenu.getBoundingClientRect();
		const parentBox = submenu.parentElement.getBoundingClientRect();
		const direction = box.top - parentBox.top < box.left - parentBox.left ? 'slide-x' : 'slide-y';
		return { currentWidth, currentHeight, fullWidth, fullHeight, direction };
	}

	/** Shows a menu item's submenu (interaction: 'click' (default) or 'hover') */
	showSubmenu(item, interaction = 'click') {
		const { settings } = this;
		for (const submenu of childrenMatching(item, '.submenu')) {
			stop(submenu);
			let duration = interaction === 'hover' ? settings.hoverShowSpeed : settings.clickShowSpeed;
			submenu.style.zIndex = String(subMenuOrder++);
			submenu.classList.remove('finished');
			submenu.style.position = '';
			if (settings.transition === 'slide') {
				const m = this.measure(submenu);
				if (m.direction === 'slide-y') {
					duration *= m.fullHeight === 0 ? 0 : (m.fullHeight - m.currentHeight) / m.fullHeight;
					Object.assign(submenu.style, { height: m.currentHeight + 'px', overflow: 'visible clip', display: 'block' });
					animate(submenu, { height: m.fullHeight + 'px' }, duration, settings.easing, () => {
						submenu.classList.add('finished');
						submenu.style.height = 'auto';
						submenu.style.overflow = 'visible';
					});
				}
				else {
					duration *= m.fullWidth === 0 ? 0 : (m.fullWidth - m.currentWidth) / m.fullWidth;
					Object.assign(submenu.style, { width: m.currentWidth + 'px', overflow: 'clip visible', display: 'block' });
					animate(submenu, { width: m.fullWidth + 'px', paddingRight: '0px' }, duration, settings.easing, () => {
						submenu.classList.add('finished');
						submenu.style.width = 'auto';
						submenu.style.overflow = 'visible';
					});
				}
			}
			else {
				if (getComputedStyle(submenu).display === 'none') {
					submenu.style.opacity = '0';
				}
				const currentOpacity = parseFloat(getComputedStyle(submenu).opacity);
				submenu.style.display = 'block';
				duration *= 1 - currentOpacity;
				animate(submenu, { opacity: '1' }, duration, settings.easing, () => {
					submenu.classList.add('finished');
				});
			}
		}
	}

	/** Hides a menu item's submenu (interaction: 'click' (default) or 'hover') */
	hideSubmenu(item, interaction = 'click') {
		const { settings } = this;
		// Hidden submenus: no clicks (Chrome) and below the others
		const hidden = { display: 'none', zIndex: '0', position: 'absolute' };
		for (const submenu of childrenMatching(item, '.submenu')) {
			stop(submenu);
			let duration = interaction === 'hover' ? settings.hoverHideSpeed : settings.clickHideSpeed;
			submenu.classList.remove('finished');
			submenu.style.position = '';
			if (settings.transition === 'slide') {
				const m = this.measure(submenu);
				if (m.direction === 'slide-x') {
					duration *= m.fullWidth === 0 ? 0 : m.currentWidth / m.fullWidth;
					Object.assign(submenu.style, { width: m.currentWidth + 'px', overflow: 'clip visible', display: 'block' });
					animate(submenu, { width: '0px' }, duration, settings.easing, () => {
						submenu.classList.add('finished');
						Object.assign(submenu.style, hidden, { width: 'auto' });
					});
				}
				else {
					duration *= m.fullHeight === 0 ? 0 : m.currentHeight / m.fullHeight;
					Object.assign(submenu.style, { height: m.currentHeight + 'px', overflow: 'visible clip', display: 'block' });
					animate(submenu, { height: '0px' }, duration, settings.easing, () => {
						submenu.classList.add('finished');
						Object.assign(submenu.style, hidden, { height: 'auto' });
					});
				}
			}
			else {
				duration *= parseFloat(getComputedStyle(submenu).opacity);
				animate(submenu, { opacity: '0' }, duration, settings.easing, () => {
					submenu.classList.add('finished');
					Object.assign(submenu.style, hidden);
				});
			}
		}
	}
}

/** Creates a navigation menu for a list element (once per element) and returns it. */
export function navigationMenu(element, options = {}) {
	if (!element) {
		return null;
	}
	if (!instances.has(element)) {
		instances.set(element, new NavigationMenu(element, options));
	}
	return instances.get(element);
}
