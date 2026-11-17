/*!
Animation helpers (ES module)
Package: Konsepto Front-end Framework
License: The MIT License

Replaces the parts of jQuery's effects API that the framework components use: animate(), stop(),
slideDown() and slideUp(), using the Web Animations API. Like jQuery, the end state is written as
inline styles, and stop() freezes an element where its running animation currently is.

Animations are skipped (end state applied immediately) when the user prefers reduced motion.
*/

// jQuery's easings as CSS timing functions ('swing' = 0.5 - cos(p * π) / 2)
const EASINGS = {
	swing: 'cubic-bezier(0.37, 0, 0.63, 1)',
	linear: 'linear',
};

const running = new WeakMap();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const toCss = property => property.replace(/[A-Z]/g, c => '-' + c.toLowerCase());

/** Stops the element's running animation, leaving it where it currently is (like jQuery's .stop(true, false)). */
export function stop(element) {
	const animation = running.get(element);
	if (!animation) {
		return;
	}
	running.delete(element);
	try {
		animation.commitStyles();
	}
	catch (error) {
		// commitStyles() fails for elements that are not rendered; nothing to keep then
	}
	animation.onfinish = null;
	animation.cancel();
}

/**
 * Animates inline styles from their current computed values to `to` (an object of camelCase CSS
 * properties), then writes `to` as inline styles and calls `done`.
 */
export function animate(element, to, duration, easing = 'swing', done = null) {
	stop(element);
	const finish = () => {
		for (const [property, value] of Object.entries(to)) {
			element.style.setProperty(toCss(property), value);
		}
		if (done) {
			done();
		}
	};
	if (duration <= 0 || reducedMotion.matches) {
		finish();
		return;
	}
	const computed = getComputedStyle(element);
	const from = Object.fromEntries(Object.keys(to).map(property => [property, computed.getPropertyValue(toCss(property))]));
	const animation = element.animate([from, to], { duration, easing: EASINGS[easing] || easing });
	running.set(element, animation);
	animation.onfinish = () => {
		running.delete(element);
		finish();
		animation.cancel();
	};
}

// Box properties that jQuery's slide effects animate
const SLIDE_PROPERTIES = ['height', 'paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'];

const isHidden = element => getComputedStyle(element).display === 'none';

// Like jQuery's .show(): drop an inline display:none, and only if the stylesheet still hides the
// element set display:block inline
function show(element) {
	if (element.style.display === 'none') {
		element.style.display = '';
	}
	if (isHidden(element)) {
		element.style.display = 'block';
	}
}

/** Shows a hidden element by sliding it open (like jQuery's .slideDown()). */
export function slideDown(element, duration, easing = 'swing', done = null) {
	stop(element);
	const wasHidden = isHidden(element);
	if (wasHidden) {
		show(element);
	}
	// Natural size: measure without the inline values a stopped animation may have left
	const saved = SLIDE_PROPERTIES.map(property => element.style[property]);
	SLIDE_PROPERTIES.forEach(property => { element.style[property] = ''; });
	const computed = getComputedStyle(element);
	const target = Object.fromEntries(SLIDE_PROPERTIES.map(property => [property, computed[property]]));
	// Start from zero when it was hidden, otherwise from where a stopped animation left it
	SLIDE_PROPERTIES.forEach((property, i) => { element.style[property] = wasHidden ? '0px' : saved[i]; });
	const overflow = element.style.overflow;
	element.style.overflow = 'hidden';
	animate(element, target, duration, easing, () => {
		SLIDE_PROPERTIES.forEach(property => { element.style[property] = ''; });
		element.style.overflow = overflow;
		if (done) {
			done();
		}
	});
}

/** Hides an element by sliding it closed (like jQuery's .slideUp()). */
export function slideUp(element, duration, easing = 'swing', done = null) {
	stop(element);
	if (isHidden(element)) {
		if (done) {
			done();
		}
		return;
	}
	const overflow = element.style.overflow;
	element.style.overflow = 'hidden';
	const zero = Object.fromEntries(SLIDE_PROPERTIES.map(property => [property, '0px']));
	animate(element, zero, duration, easing, () => {
		element.style.display = 'none';
		SLIDE_PROPERTIES.forEach(property => { element.style[property] = ''; });
		element.style.overflow = overflow;
		if (done) {
			done();
		}
	});
}

/** Fades an element in (like jQuery's .fadeIn()). */
export function fadeIn(element, duration, easing = 'swing', done = null) {
	stop(element);
	if (isHidden(element)) {
		element.style.opacity = '0';
		show(element);
	}
	animate(element, { opacity: '1' }, duration, easing, () => {
		element.style.opacity = '';
		if (done) {
			done();
		}
	});
}

/** Fades an element out (like jQuery's .fadeOut()). */
export function fadeOut(element, duration, easing = 'swing', done = null) {
	stop(element);
	animate(element, { opacity: '0' }, duration, easing, () => {
		element.style.display = 'none';
		element.style.opacity = '';
		if (done) {
			done();
		}
	});
}

/** Resolves an element, a selector string or null to an element (or null). */
export function resolve(target, root = document) {
	if (!target) {
		return null;
	}
	return typeof target === 'string' ? root.querySelector(target) : target;
}

/** Picks translations for the page language (with and without country code), defaulting to English. */
export function pickTranslations(translations) {
	const language = document.documentElement.getAttribute('lang') || 'en';
	return translations[language] || translations[language.split('-')[0]] || translations.en;
}
