/*!

This file is totally under construction. Do not use!

Consent Popup jQuery plugin
Version: 0.01 (2020-11-06 10:00)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto
Website: https://konsepto.fi
License: The MIT License





Description: 

This plugin creates a popup component that you can use to obtain user's consent before adding any JavaScript code which may need user's active consent (e.g. set up third-party cookies).

TODO: description

Based on its options, it adds: 

- Clickable popup div that opens and closes the drawer
- Hover interactions that works better than plain CSS hover styles (because of delays and animations)

It also adds certain ARIA attributes and assistive texts for screen readers. The result should be quite accessible as a drawer component. It follows WCAG 2.1 guidelines.

The drawer element (selector) can be any container element (often a DIV element). The popup div should be a BUTTON element or similar (like INPUT type 'button' or A).

You can set closed drawers to be always visible on certain screen withds by defining 'display: block !important' to the drawer element.

You can use 'no-script' HTML class to add plain CSS functionality in case this plugin is not running.

You can use the settings' 'group' parameter to create drawer groups, inside which other drawers will automatically close before opening a new drawer. This allows you to create an accordion component.




JQuery plugins are initialized by attaching them into DOM elements at document's ready event. However, you cannot use the document.write() method at that point, as it would clear the current document completely and replace it with the SCRIPT tags. Those scripts that we would like to include often uses the document.write() method themselves. This also means that you cannot trigger scripts containing document.write() method later without reloading the webpage either manually or programmatically

Thus icluding SCRIPT tags (like Google Analytics scripts) conditionally (based on consent) is somewhat tricky, but there are at least two ways to achieve this, which both have their own caveats: 

1. Use a conditional 'if' block and the document.write() method to write the SCRIPT tags during document's rendering. Just remember that you must break the ending SCRIPT tag ("</script>" => "<" + "/script>") inside a string to be written or it will instantly break the JavaScript code. You may also have to escape single or double quotes inside the string. Unfortunately this will make those tags somewhat harder to read. You may want to use a JavaScript escaping tool in order to prevent syntax errors (like this one: https://www.freeformatter.com/javascript-escape.html).

2. Put those SCRIPT tags into an external HTML (snippet) file and include it using a conditional 'if' block and the document.write() method. In this case you do not have to worry about converting HTML-code to JavaScript-safe strings. Including an external file will slightly increase the page load times, but often just once after the consent is given. However, you may run into problems with browser cache or website's external or internal cache if you try to change the content of that file. Easiest way to prevent cache problems is to add a new file and and use a different filename. You may want to include a version number, a timestamp or similar into the filename (for example "consent-scripts-1.html").





See examples below for the available options.

Tested at 2020-05-28: Windows 10: Chrome (latest), NVDA (latest); Samsung Galaxy S7: Chrome (latest).


Usage: 

$(selector).consentPopup([object options]);

Returns: object jQuery

Requires: jQuery


Examples: 


// Create a consent popup for main navigation
$('#block-main-navigation').consentPopup();

// Create a consent popup for main navigation with all options
$('#block-main-navigation').consentPopup({
	translations: {
		'show': 'Show navigation menu', // Show button label
		'hide': 'Hide navigation menu' // Hide button label
		}
	}, // Text translations
	toggleButton: $('#toggle-navigation-menu-button'), // A jQuery object / an element / a selector string that opens and closes the consent popup (should be a button; if null, a new button is created)
	state: 'closed', // Consent Popup's initial state
	click: true, // Click interaction
	clickShowSpeed: 250, // Click show speed (ms)
	clickHideSpeed: 250, // Click hide speed (ms)
	clickDelay: 0, // Click delay speed (ms)
	hoverElement: null, // A jQuery object / an element / a selector string that opens and closes the consent popup on hover
	hover: true, // Hover interaction
	hoverShowSpeed: 500, // Hover show speed (ms)
	hoverHideSpeed: 500, // Hover hide speed (ms)
	hoverDelay: 500, // Hover delay speed (ms)
	transition: 'slide', // Transition: 'slide' (default) or 'fade'
	easing: 'swing' // Easing: 'swing' (default) or 'linear'
});


Accessibility: 

https://www.w3.org/TR/WCAG21/
https://www.w3.org/WAI/WCAG21/quickref/
https://www.w3.org/WAI/tutorials/menus/flyout/
https://www.accessibility-developer-guide.com/examples/widgets/dropdown/


Plugin structure: 

https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js


*/

"use strict";

// Add protective wrapper
;(function ($, window, document, undefined) {
	

	// Declare the plugin name
	var pluginName = "consentPopup";
	
	// Declare the plugin language based on html element's lang attribute
	var language = ($('html').attr('lang') ? $('html').attr('lang') : 'en');
	
	// Declare the translations
	var translations = {
		// https://translate.google.com/
		'en': {
			labels: {
				'question': 'May we set third-party tracking cookies on your browser? They allow us to track visitor statistics and measure our communications.', // It is recommended to add a link to your privacy policy page for more information (link text: "Read more" / "Privacy policy")
				'allow': 'Allow', 
				'deny': 'Deny', 
				'show': 'Show', 
				'hide': 'Hide'
			}
		}, 
		'fi': {
			labels: {
				'question': 'Saammeko asettaa kolmannen osapuolen seurantaevästeitä selaimeesi? Niiden avulla voimme seurata kävijätilastoja ja mitata viestintäämme.', // It is recommended to add a link to your privacy policy page for more information (link text: "Lue lisää" / "Tietosuojakäytäntö")
				'allow': 'Salli', 
				'deny': 'Kiellä', 
				'show': 'Näytä', 
				'hide': 'Piilota'
			}
		}, 
		'sv': {
			labels: {
				'question': 'Får vi ställa in tredje part spårningskakor i din webbläsare? De låter oss spåra besökarstatistik och mäta vår kommunikation.', // It is recommended to add a link to your privacy policy page for more information (link text: "Läs mer" / "Integritetspolicy")
				'allow': 'Tillåta', 
				'deny': 'Förvägra', 
				'show': 'Visa', 
				'hide': 'Dölj'
			}
		}, 
		'fr': {
			labels: {
				'question': 'Pouvons-nous installer des cookies tiers sur votre navigateur? Ils nous permettent de suivre les statistiques des visiteurs et de mesurer nos communications. ', // It is recommended to add a link to your privacy policy page for more information (link text: "Lire la suite" / "Politique de confidentialité")
				'allow': 'Accepter', 
				'deny': 'Refuser', 
				'show': 'Montrer', 
				'hide': 'Cacher'
			}
		}
	};
	
	// Declare the default options
	var defaultOptions = {
		translations: (typeof translations[language] === 'undefined' ? (typeof translations[language.split('-')[0]] === 'undefined' ? translations['en'] : translations[language.split('-')[0]]) : translations[language]), // Text translations (tries to load translations based on HTML element's lang attribute with and without country code, defaults to 'en')
		popupDiv: null, // A jQuery object / an element / a selector string that matches the element containing the consent question
		state: 'visible', // Consent popup's initial state: 'visible' (default) or 'hidden'
		allowHiding: true, // Allow hiding by user without making decision: true (default) or false
		order: 'first', // Reading order: 'first' (default) or 'last'
		position: 'bottom', // Display position: 'bottom' (default) or 'top'
		// TODO: Tarvitaanko alempia?
		click: true, // Click interaction
		clickShowSpeed: 250, // Click show speed (ms)
		clickHideSpeed: 250, // Click hide speed (ms)
		clickDelay: 0, // Click delay speed (ms)
		hover: true, // Hover interaction
		hoverShowSpeed: 500, // Hover show speed (ms)
		hoverHideSpeed: 500, // Hover hide speed (ms)
		hoverDelay: 500, // Hover delay speed (ms)
		transition: 'slide', // Transition: 'slide' (default) or 'fade'
		easing: 'swing', // Easing: 'swing' (default) or 'linear'
		onAllow: null,  
		onDeny: null, 
		onHide: null
	};
	

	// The actual plugin constructor
	function Plugin (element, options) {
		this._name = pluginName;
		this.element = element;
		this.state = 'visible';
		this.$element = $(element);
		this.$popupDiv = $();
		this.$toggleButton = $();
		this.$allowButton = $();
		this.$denyButton = $();
		this.settings = $.extend(true, {}, defaultOptions, options);
		this._init();
	}
	
	
	// Avoid Plugin.prototype conflicts
	$.extend(true, Plugin.prototype, {
		
		
		// Initializes the plugin
		_init: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			/*
			// If a consent popup group was specified
			if (typeof base.settings.group === 'string') {
				// If the group does not exists
				if (typeof groups[base.settings.group] === 'undefined') {
					// Create a new consent popup group
					groups[base.settings.group] = [];
				}
				// Store plugin instace to the consent popup group
				groups[base.settings.group].push(base);
			}
			*/
			
				
			$[pluginName].writeConsent(true);
			
			console.log("Consent: " + $[pluginName].readConsent());
			
			//$[pluginName].deleteConsent();
			
			if ($[pluginName].readConsent()) {
				
				$('script[type$="-consent"]').each(function (e) {
					$(this).attr('type', $(this).attr('type').replace('-consent', ''));
				});
				
				// Process consent popup elements
				//base._processElements();
			
			}
			
		}, 
		
		
		// Adds consent popup functionality to consent popup elements
		_processElements: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// If the settings specify a popup div
			if (base.settings.popupDiv !== null) {
				// Get the popup div based on settings
				base.$popupDiv = $(base.settings.popupDiv);
			}
			// Else
			else {
				// Create a new popup div
				base.$popupDiv = $('<div class="consent-popup">');
			}
			
			if (base.settings.order == 'first') {
				base.$element.prepend(base.$popupDiv);
			}
			else if (base.settings.order == 'last') {
				base.$element.append(base.$popupDiv);
			}
			
			// Set the HTML classes of the consent popup's container element
			base.$element.addClass('consent-popup-container');
			
			// Set the HTML classes of the consent popup element
			base.$popupDiv.removeClass('no-script visible hidden').addClass('consent-popup');
			
			// If set to allow hiding by user
			if (base.settings.allowHiding) {
				// Create a toggle button
				$toggleButton = $('<button class="toggle-consent-popup-button">');
				// Set the toggle button's ARIA attributes
				$toggleButton.attr('aria-haspopup', 'true');
				// Append the toggle button to consent popup
				base.$popupDiv.append($toggleButton);
			}
			
			// If consent popup's initial state is 'closed'
			if (base.settings.state == 'closed') {
				
				// Set consent popup's state
				base.state = 'closed';
				
				// Set the HTML classes of the consent popup element
				base.$element.removeClass('open').addClass('closed');
				
				// Set the HTML classes of the popup div
				base.$popupDiv.removeClass('active');
				
				// Set the ARIA attributes and the text of the popup div
				base.$popupDiv.attr('aria-expanded', 'false').html('<span class="assistive text">' + base.settings.translations['show'] + '</span>');
			
			}
			// Else
			else {
				
				// Set consent popup's state
				base.state = 'open';
				
				// Set the HTML classes of the consent popup element
				base.$element.removeClass('closed').addClass('open');
				
				// Set the HTML classes of the popup div
				base.$popupDiv.addClass('active');
				
				// Set the ARIA attributes and the text of the popup div
				base.$popupDiv.attr('aria-expanded', 'true').html('<span class="assistive text">' + base.settings.translations['hide'] + '</span>');
				
			}
			
			// Attach event handlers
			base._attachEventHandlers();
			
		}, 
		
		
		// Attachs event handlers to consent popup elements
		_attachEventHandlers: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// If set to react to click interaction
			if (base.settings.click) {
				
				// Add 'click-to-use' HTML class to consent popup popup div
				base.$popupDiv.addClass('click-interaction');
				
				// On click events of consent popup popup divs
				base.$popupDiv.on('click', function (e) {
					// Toggle consent popup
					base.toggleConsentPopup();
					// Prevent the default action (for example following a link)
					e.preventDefault();
				});
			
			}
			
			// If set to react to hover interaction
			if (base.settings.hover) {
				
				// Add 'hover-to-use' HTML class to consent popup element
				base.$element.addClass('hover-interaction');
				
				// On mouse enter event
				base.$hoverElement.on('mouseenter', function (e) {
					// If the consent popup is closed
					if (base.state === 'closed') {
						// Open consent popup
						base.openConsentPopup('hover');
					}
				});
				
				// On mouse leave event
				base.$hoverElement.on('mouseleave', function (e) {
					// If the consent popup is closed
					if (base.state === 'closed') {
						// Close consent popup
						base.closeConsentPopup('hover');
					}
				});
				
			}			
			
			// On keyup events inside consent popup
			base.$element.on('keyup', function (e) {
				
				// If Esc key
				if (e.key === 'Escape') {
						// Close consent popup
						base.closeConsentPopup();
				}
				
			});
			
		}, 
		
		/* Opens / closes the consent popup element */
		toggleConsentPopup: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// If this consent popup was closed
			if (base.state === 'closed') {
				// Open this consent popup
				base.openConsentPopup();
			}
			else {
				// Close this consent popup
				base.closeConsentPopup();
			}
			
		}, 
		
		
		/* Opens consent popup (interaction: 'click' (default) or 'hover') */
		openConsentPopup: function (interaction) {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Declare a variable to store delay to wait for other group's consent popups to close
			var closeDelay = 0;	
			
			// If a consent popup group does exists
			if (typeof groups[base.settings.group] !== 'undefined') {
				// Go through all same group's consent popups
				groups[base.settings.group].forEach(function (consentPopup) {
					// If the consent popup is open
					if (consentPopup.state === 'open') {
						// Close consent popup
						consentPopup.closeConsentPopup(interaction);
						// Get the delay to wait for other consent popups to close
						closeDelay = (typeof interaction !== 'undefined' && interaction == 'hover' ? base.settings.hoverDelay : base.settings.clickDelay) + (typeof interaction !== 'undefined' && interaction == 'hover' ? base.settings.hoverHideSpeed : base.settings.clickHideSpeed);
					}
				});
			}
			
			// If 'click' interaction (default)
			if (typeof interaction === 'undefined' || interaction == 'click') {
			
				// Set consent popup's state
				base.state = 'open';
				
				// Set the HTML classes of the consent popup element
				base.$element.removeClass('closed').addClass('open');
				
				// Set the HTML classes of the popup div
				base.$popupDiv.addClass('active');
				
				// Set the ARIA attributes and the text of the popup div
				base.$popupDiv.attr('aria-expanded', 'true').html('<span class="assistive text">' + base.settings.translations['hide'] + '</span>');
				
			}
			
			// Get transition function's name
			var transition = (base.settings.transition === 'slide' ? 'slideDown' : 'fadeIn');
			
			// Stop existing animations
			base.$element.stop(true, false);
			// Show consent popup
			base.$element[transition]((typeof interaction !== 'undefined' && interaction == 'hover' ? base.settings.hoverShowSpeed : base.settings.clickShowSpeed), base.settings.easing, function () {
				// https://bugs.jquery.com/ticket/11635
				base.$element.css('overflow', 'visible');
			});
			
		}, 
		
		
		/* Closes consent popup (interaction: 'click' (default) or 'hover') */
		closeConsentPopup: function (interaction) {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// If 'click' interaction (default)
			if (typeof interaction === 'undefined' || interaction == 'click') {
			
				// Set consent popup's state
				base.state = 'closed';
				
				// Set the HTML classes of the consent popup element
				base.$element.removeClass('open').addClass('closed');
				
				// Set the HTML classes of the popup div
				base.$popupDiv.removeClass('active');
				
				// Set the ARIA attributes and the text of the popup div
				base.$popupDiv.attr('aria-expanded', 'false').html('<span class="assistive text">' + base.settings.translations['show'] + '</span>');
				
			}
			
			// Get transition function's name
			var transition = (base.settings.transition === 'slide' ? 'slideUp' : 'fadeOut');
			
			// Stop existing animations
			base.$element.stop(true, false);
			// Hide consent popup
			base.$element.delay((typeof interaction !== 'undefined' && interaction == 'hover' ? base.settings.hoverDelay : base.settings.clickDelay))[transition]((typeof interaction !== 'undefined' && interaction == 'hover' ? base.settings.hoverHideSpeed : base.settings.clickHideSpeed), base.settings.easing, function () {
				// https://bugs.jquery.com/ticket/11635
				base.$element.css('overflow', 'visible');
			});
			
		}
		
		
	});
	

	// A plugin wrapper around the constructor
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
			}
		});
	};
	
	
	// Cookie helper functions
	// https://www.quirksmode.org/js/cookies.html
	
	// Write cookie
	function writeCookie(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = '; expires=' + date.toGMTString();
		}
		else var expires = '';
		document.cookie = name + '=' + value + expires + '; path=/';
	}
	
	// Read cookie
	function readCookie(name) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}
	
	// Delete cookie
	function deleteCookie(name) {
		// The negative expiration time causes the cookie to be instantly deleted by the browser
		writeCookie(name, '', -1);
	}
	
	
	// Create a container for static plugin medhods
	$[pluginName] = { };
	
	
	/* 
	
	A public static plugin method for reading the user consent cookie.
	
	Returns: true (consent given), false (consent denied) or null (no decision yet)
	
	Note the difference between true, false and null:
	
	https://stackoverflow.com/questions/27632391/why-null-false-and-null-true-both-return-false
	
	To be called like this: 
	
	// If the consent is given (reads the consent status from a cookie)
	if ($.consentPopup.readConsent()) {
		// [Insert code that requires user consent]
	}
	
	*/
	$[pluginName].readConsent = function() {
		var consent = readCookie('ff_cookie_consent');
		if (consent === 'true') {
			return true;
		}
		else if (consent === 'false') {
			return false;
		}
		else {
			return null;
		}
	};
	
	
	/* 
	
	A public static plugin method for writing the user consent cookie.
	
	To be called like this: 
	
	// Write the consent status into cookie
	$.consentPopup.writeConsent(consent);
	
	*/
	$[pluginName].writeConsent = function(consent) {
		writeCookie('ff_cookie_consent', consent, 365);
	};
	
	
	/* 
	
	A public static plugin method for deleting the user consent cookie.
	
	To be called like this: 
	
	// Delete the consent status cookie completely
	$.consentPopup.deleteConsent();
	
	*/
	$[pluginName].deleteConsent = function() {
		deleteCookie('ff_cookie_consent');
	};
	

	//document.write('<script>alert("Test: using document.write() method inside an external JavaScript file.");</script>');
	
	
})(jQuery, window, document);

