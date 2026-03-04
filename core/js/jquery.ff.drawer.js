/*!

Drawer jQuery plugin
Version: 0.6 (2022-05-29 9:45)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto
Website: https://konsepto.fi
License: The MIT License


TODO: Add a setting to defide if the button text should be visible to everyone or only to screen readers.


Description: 

This plugin creates a drawer component that you can use to hide additional functionality or content.

Based on its options, it adds: 

- Clickable toggle button that opens and closes the drawer
- Hover interactions that works better than plain CSS hover styles (because of delays and animations)

It also adds certain ARIA attributes and assistive texts for screen readers. The result should be quite accessible as a drawer component. It follows WCAG 2.1 guidelines.

The drawer element (selector) can be any container element (often a DIV element). The toggle button should be a BUTTON element or similar (like INPUT type 'button' or A).

You can set closed drawers to be always visible on certain screen withds by defining 'display: block !important' to the drawer element.

You can use 'no-script' HTML class to add plain CSS functionality in case this plugin is not running.

You can use the settings' 'group' parameter to create drawer groups, inside which other drawers will automatically close before opening a new drawer. This allows you to create an accordion component.

See examples below for the available options.

Tested at 2020-05-28: Windows 10: Chrome (latest), NVDA (latest); Samsung Galaxy S7: Chrome (latest).


Usage: 

$(selector).drawer([object options]);

Returns: object jQuery

Requires: jQuery


Examples: 


// Create a drawer for main navigation
$('#block-main-navigation').drawer();

// Create a drawer for main navigation with all options
$('#block-main-navigation').drawer({
	translations: {
		'show-label': 'Show navigation menu', // Show button label
		'hide-label': 'Hide navigation menu' // Hide button label
	}, // Text translations
	toggleButton: $('#toggle-navigation-menu-button'), // A jQuery object / an element / a selector string that opens and closes the drawer (should be a button; if null, a new button is created)
	group: 'header', // Drawer group's name (automatically closes other drawers of the same group when opened)
	state: 'closed', // Drawer's initial state
	click: true, // Click interaction
	clickShowSpeed: 250, // Click show speed (ms)
	clickHideSpeed: 250, // Click hide speed (ms)
	clickDelay: 0, // Click delay speed (ms)
	hoverElement: null, // A jQuery object / an element / a selector string that opens and closes the drawer on hover
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
	var pluginName = 'drawer';
	
	// Declare the plugin language based on html element's lang attribute
	var language = ($('html').attr('lang') ? $('html').attr('lang') : 'en');
	
	// Declare the translations
	var translations = {
		'en': {
			'show-label': 'Show main navigation', // Show button label
			'hide-label': 'Hide main navigation' // Hide button label
		}, 
		'fi': {
			'show-label': 'Näytä päänavigaatio', // Show button label
			'hide-label': 'Piilota päänavigaatio' // Hide button label
		}, 
		'sv': {
			'show-label': 'Visa huvudnavigering', // Show button label
			'hide-label': 'Dölj huvudnavigering' // Hide button label
		}, 
		'fr': {
			'show-label': 'Afficher la navigation principale', // Show button label
			'hide-label': 'Cacher la navigation principale' // Hide button label
		}, 
		'de': {
			'show-label': 'Hauptnavigation anzeigen', // Show button label
			'hide-label': 'Hauptnavigation ausblenden' // Hide button label
		}, 
		'es': {
			'show-label': 'Mostrar navegación principal', // Show button label
			'hide-label': 'Ocultar navegación principal' // Hide button label
		}
	};
	
	// Declare the default options
	var defaultOptions = {
		translations: (typeof translations[language] === 'undefined' ? (typeof translations[language.split('-')[0]] === 'undefined' ? translations['en'] : translations[language.split('-')[0]]) : translations[language]), // Text translations (tries to load translations based on HTML element's lang attribute with and without country code, defaults to 'en')
		toggleButton: null, // A jQuery object / an element / a selector string that opens and closes the drawer when clicked
		group: null, // Drawer group's name (automatically closes other drawers of the same group when opened)
		state: 'closed', // Drawer's initial state
		click: true, // Click interaction
		clickShowSpeed: 250, // Click show speed (ms)
		clickHideSpeed: 250, // Click hide speed (ms)
		clickDelay: 0, // Click delay speed (ms)
		hoverElement: null, // A jQuery object / an element / a selector string that opens and closes the drawer on hover
		hover: true, // Hover interaction
		hoverShowSpeed: 500, // Hover show speed (ms)
		hoverHideSpeed: 500, // Hover hide speed (ms)
		hoverDelay: 500, // Hover delay speed (ms)
		transition: 'slide', // Transition: 'slide' (default) or 'fade'
		easing: 'swing', // Easing: 'swing' (default) or 'linear'
	};
	
	// Declare a variable to store drawer groups
	var groups = {};
	

	// The actual plugin constructor
	function Plugin (element, options) {
		this._name = pluginName;
		this.element = element;
		this.state = 'closed';
		this.$element = $(element);
		this.$toggleButton = $();
		this.$hoverElement = $();
		this.settings = $.extend(true, {}, defaultOptions, options);
		this._init();
	}
	
	
	// Avoid Plugin.prototype conflicts
	$.extend(true, Plugin.prototype, {
		
		
		// Initializes the plugin
		_init: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// If a drawer group was specified
			if (typeof base.settings.group === 'string') {
				// If the group does not exists
				if (typeof groups[base.settings.group] === 'undefined') {
					// Create a new drawer group
					groups[base.settings.group] = [];
				}
				// Store plugin instace to the drawer group
				groups[base.settings.group].push(base);
			}
			
			// Process drawer elements
			base._processElements();
			
		}, 
		
		
		// Adds drawer functionality to drawer elements
		_processElements: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Set the HTML classes of the drawer element
			base.$element.removeClass('no-script open closed').addClass('drawer');
			
			// If the settings specify a toggle button
			if (base.settings.toggleButton !== null) {
				// Get the toggle button based on settings
				base.$toggleButton = $(base.settings.toggleButton);
			}
			// Else
			else {
				// If set to react to click interaction
				if (base.settings.click) {
					// Create a new toggle button
					base.$toggleButton = $('<button class="drawer-toggle">').insertBefore(base.$element);
				}
			}
			
			// If the settings specify a hover element
			if (base.settings.hoverElement !== null) {
				// Get the hover element based on settings
				base.$hoverElement = $(base.settings.hoverElement);
			}
			
			// Set the toggle button's ARIA attributes
			base.$toggleButton.attr('aria-haspopup', 'true');
			
			// Set the HTML classes of the toggle button
			base.$toggleButton.removeClass('no-script active').addClass('drawer-toggle');
			
			// If drawer's initial state is 'closed'
			if (base.settings.state === 'closed') {
				
				// Set drawer's state
				base.state = 'closed';
				
				// Set the HTML classes of the drawer element
				base.$element.removeClass('open').addClass('closed');
				
				// Set the HTML classes of the toggle button
				base.$toggleButton.removeClass('active');
				
				// Set the ARIA attributes and the text of the toggle button
				base.$toggleButton.attr('aria-expanded', 'false').html(base.settings.translations['show-label']);
			
			}
			// Else
			else {
				
				// Set drawer's state
				base.state = 'open';
				
				// Set the HTML classes of the drawer element
				base.$element.removeClass('closed').addClass('open');
				
				// Set the HTML classes of the toggle button
				base.$toggleButton.addClass('active');
				
				// Set the ARIA attributes and the text of the toggle button
				base.$toggleButton.attr('aria-expanded', 'true').html(base.settings.translations['hide-label']);
				
			}
			
			// Attach event handlers
			base._attachEventHandlers();
			
		}, 
		
		
		// Attachs event handlers to drawer elements
		_attachEventHandlers: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// If set to react to click interaction
			if (base.settings.click) {
				
				// Add 'click-to-use' HTML class to drawer toggle button
				base.$toggleButton.addClass('click-interaction');
				
				// On click events of drawer toggle buttons
				base.$toggleButton.on('click', function (e) {
					// Toggle drawer
					base.toggleDrawer();
					// Prevent the default action (for example following a link)
					e.preventDefault();
				});
			
			}
			
			// If set to react to hover interaction
			if (base.settings.hover) {
				
				// Add 'hover-to-use' HTML class to drawer element
				base.$element.addClass('hover-interaction');
				
				// On mouse enter event
				base.$hoverElement.on('mouseenter', function (e) {
					// If the drawer is closed
					if (base.state === 'closed') {
						// Open drawer
						base.openDrawer('hover');
					}
				});
				
				// On mouse leave event
				base.$hoverElement.on('mouseleave', function (e) {
					// If the drawer is closed
					if (base.state === 'closed') {
						// Close drawer
						base.closeDrawer('hover');
					}
				});
				
			}			
			
			// On keyup events inside drawer
			base.$element.on('keyup', function (e) {
				
				// If Esc key
				if (e.key === "Escape") {
						// Close drawer
						base.closeDrawer();
				}
				
			});
			
		}, 
		
		
		/* Opens / closes the drawer element */
		toggleDrawer: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// If this drawer was closed
			if (base.state === 'closed') {
				// Open this drawer
				base.openDrawer();
			}
			else {
				// Close this drawer
				base.closeDrawer();
			}
			
		}, 
		
		
		/* Opens drawer (interaction: 'click' (default) or 'hover') */
		openDrawer: function (interaction) {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Declare a variable to store delay to wait for other group's drawers to close
			var closeDelay = 0;	
			
			// If a drawer group does exists
			if (typeof groups[base.settings.group] !== 'undefined') {
				// Go through all same group's drawers
				groups[base.settings.group].forEach(function (drawer) {
					// If the drawer is open
					if (drawer.state === 'open') {
						// Close drawer
						drawer.closeDrawer(interaction);
						// Get the delay to wait for other drawers to close
						closeDelay = (typeof interaction !== 'undefined' && interaction === 'hover' ? base.settings.hoverDelay : base.settings.clickDelay) + (typeof interaction !== 'undefined' && interaction == 'hover' ? base.settings.hoverHideSpeed : base.settings.clickHideSpeed);
					}
				});
			}
			
			// Get transition function's name
			var transition = (base.settings.transition === 'slide' ? 'slideDown' : 'fadeIn');
			
			// Stop existing animations
			base.$element.stop(true, false);
			
			// Show drawer
			base.$element[transition]((typeof interaction !== 'undefined' && interaction === 'hover' ? base.settings.hoverShowSpeed : base.settings.clickShowSpeed), base.settings.easing, function () {
				// https://bugs.jquery.com/ticket/11635
				base.$element.css('overflow', 'visible');
			});
			
			// If 'click' interaction (default)
			if (typeof interaction === 'undefined' || interaction == 'click') {
			
				// Set drawer's state
				base.state = 'open';
				
				// Set the HTML classes of the drawer element
				base.$element.removeClass('closed').addClass('open');
				
				// Set the HTML classes of the toggle button
				base.$toggleButton.addClass('active');
				
				// Set the ARIA attributes and the text of the toggle button
				base.$toggleButton.attr('aria-expanded', 'true').html(base.settings.translations['hide-label']);
				
			}
			
		}, 
		
		
		/* Closes drawer (interaction: 'click' (default) or 'hover') */
		closeDrawer: function (interaction) {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Get transition function's name
			var transition = (base.settings.transition === 'slide' ? 'slideUp' : 'fadeOut');
			
			// Stop existing animations
			base.$element.stop(true, false);
				
			// Add an inline style that prevents the element from getting hidden instantly by styles for '.closed'
			base.$element.css('display', 'block');
			
			// Hide drawer
			base.$element.delay((typeof interaction !== 'undefined' && interaction === 'hover' ? base.settings.hoverDelay : base.settings.clickDelay))[transition]((typeof interaction !== 'undefined' && interaction === 'hover' ? base.settings.hoverHideSpeed : base.settings.clickHideSpeed), base.settings.easing, function () {
				// https://bugs.jquery.com/ticket/11635
				base.$element.css('overflow', 'visible');
			});
			
			// If 'click' interaction (default)
			if (typeof interaction === 'undefined' || interaction == 'click') {
			
				// Set drawer's state
				base.state = 'closed';
				
				// Set the HTML classes of the drawer element
				base.$element.removeClass('open').addClass('closed');
				
				// Set the HTML classes of the toggle button
				base.$toggleButton.removeClass('active');
				
				// Set the ARIA attributes and the text of the toggle button
				base.$toggleButton.attr('aria-expanded', 'false').html(base.settings.translations['show-label']);
				
			}
			
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
	

})(jQuery, window, document);

