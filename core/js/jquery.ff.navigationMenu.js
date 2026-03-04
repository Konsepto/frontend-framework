/*!

Navigation Menu jQuery plugin
Version: 1.2 (2024-05-18 18:15)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto
Website: https://konsepto.fi
License: The MIT License


Description: 

This plugin creates a dropdown navigation menu component based on normal HTML list element (ul or ol).

Based on its options, it adds: 

- Clickable toggle buttons that expands and collapses submenus
- Hover interactions that works better than plain CSS hover styles (CSS transitions cannot be stopped and reversed)

It also adds certain ARIA attributes for screen readers. The resulting navigation menu should be quite accessible and follow WCAG 2.1 guidelines.

The navigation menu element (selector) must be an UL or OL element. List items must be LI elements. List item labels/links must be A elements. Submenus must be UL or OL elements.

You can use 'no-script' HTML class to add plain CSS functionality in case this plugin is not running.

See examples below for the available options.

Tested at 2023-11-20: Windows 10: Chrome (latest), Firefox (latest), Opera (latest), Edge (latest), NVDA (latest); Samsung Galaxy S8: Chrome (latest).


Usage: 

$(selector).navigationMenu([object options]);

Returns: object jQuery

Requires: jQuery


Examples: 


// Create a main navigation menu
$('#menu-main-navigation').navigationMenu();

// Create a main navigation menu with all options
$('#menu-main-navigation').navigationMenu({
	translations: {
		'name': 'Main navigation', // Navigation menu's aria-label attribute
		'expand-label': 'Expand', // Expand button label
		'collapse-label': 'Collapse' // Collapse button label
	}, // Text translations
	click: true, // Click interaction
	clickShowSpeed: 250, // Click show speed (ms)
	clickHideSpeed: 250, // Click hide speed (ms)
	hover: true, // Hover interaction
	hoverShowSpeed: 500, // Hover show speed (ms)
	hoverHideSpeed: 500, // Hover hide speed (ms)
	simultaneous: false, // Allow hover interaction even when a submenu is expanded
	transition: 'fade', // Transition: 'fade' (default) or 'slide'
	easing: 'swing' // Easing: 'swing' (default) or 'linear'
});


Accessibility: 

https://adrianroselli.com/2017/10/dont-use-aria-menu-roles-for-site-nav.html
https://marcozehe.de/2019/05/30/wai-aria-menus-use-with-care/
https://www.w3.org/TR/WCAG21/
https://www.w3.org/WAI/WCAG21/quickref/
https://www.w3.org/WAI/tutorials/menus/
https://www.w3.org/WAI/tutorials/menus/structure/
https://www.w3.org/WAI/tutorials/menus/styling/
https://www.w3.org/WAI/tutorials/menus/flyout/
https://www.accessibility-developer-guide.com/examples/widgets/dropdown/


Plugin structure: 

https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js


*/

"use strict";

// Add protective wrapper
;(function ($, window, document, undefined) {
	

	// Declare the plugin name
	var pluginName = 'navigationMenu';
	
	// Declare the plugin language based on HTML element's lang attribute, defaults to 'en'
	var language = ($('html').attr('lang') ? $('html').attr('lang') : 'en');
	
	// Declare the translations
	var translations = {
		'en': {
			'name': 'Main navigation', // Navigation menu's aria-label attribute
			'expand-label': 'Expand', // Expand button label
			'collapse-label': 'Collapse' // Collapse button label
		}, 
		'fi': {
			'name': 'Päänavigaatio', // Navigation menu's aria-label attribute
			'expand-label': 'Laajenna', // Expand button label
			'collapse-label': 'Kutista' // Collapse button label
		}, 
		'sv': {
			'name': 'Huvudnavigering', // Navigation menu's aria-label attribute
			'expand-label': 'Utvidga', // Expand button label
			'collapse-label': 'Kollaps' // Collapse button label
		}, 
		'fr': {
			'name': 'Navigation principale', // Navigation menu's aria-label attribute
			'expand-label': 'Étendre', // Expand button label
			'collapse-label': 'Réduire' // Collapse button label
		}, 
		'de': {
			'name': 'Hauptnavigation', // Navigation menu's aria-label attribute
			'expand-label': 'Expandieren', // Expand button label
			'collapse-label': 'Zusammenbruch' // Collapse button label
		}, 
		'es': {
			'name': 'Navegación principal', // Navigation menu's aria-label attribute
			'expand-label': 'Expandir', // Expand button label
			'collapse-label': 'Colapso' // Collapse button label
		}
	};
	
	// Declare the default options
	var defaultOptions = {
		translations: (typeof translations[language] === 'undefined' ? (typeof translations[language.split('-')[0]] === 'undefined' ? translations['en'] : translations[language.split('-')[0]]) : translations[language]), // Text translations (tries to load translations based on HTML element's lang attribute with and without country code, defaults to 'en')
		click: true, // Click interaction
		clickShowSpeed: 250, // Click show speed (ms)
		clickHideSpeed: 250, // Click hide speed (ms)
		hover: true, // Hover interaction
		hoverShowSpeed: 500, // Hover show speed (ms)
		hoverHideSpeed: 500, // Hover hide speed (ms)
		simultaneous: false, // Allow hover interaction even when a submenu is expanded
		transition: 'fade', // Transition: 'fade' (default) or 'slide'
		easing: 'swing' // Easing: 'swing' (default) or 'linear'
	};
	
	// Declare a variable to store submenu order number
	var subMenuOrder = 1000;
	

	// The actual plugin constructor
	function Plugin (element, options) {
		this._name = pluginName;
		this.element = element;
		this.state = 'inactive';
		this.$element = $(element);
		this.settings = $.extend(true, {}, defaultOptions, options);
		this._init();
	}
	
	
	// Avoid Plugin.prototype conflicts
	$.extend(true, Plugin.prototype, {
		
		
		// Initializes the plugin
		_init: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Process the navigation menu elements
			base._processElements();
			
		}, 
		
		
		// Adds menu functionality to menu elements
		_processElements: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Add ARIA label to the wrapping nav element
			base.$element.closest('nav').attr('aria-label', base.settings.translations['name']);
			
			// Set the HTML classes of the menu element
			// https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html
			base.$element.removeClass('no-script active').addClass('navigation-menu').attr('role', 'list');
			
			// Process menu items and find submenus
			base.$element.find('li').each(function () {
				
				// Get submenu
				var $submenu = $(this).children('ul, ol');
				
				// Set the HTML classes of the menu item
				// https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html
				$(this).removeClass('collapsed expanded has-children').addClass('navigation-menu-item').attr('role', 'listitem');				
				// Remove existing toggle buttons
				$(this).children('.toggle').remove();
				// Set the HTML classes of the submenu
				// https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html
				$submenu.addClass('submenu').attr('role', 'list');
				
				// If there is a submenu
				if ($submenu.length > 0) {
					
					// Set the HTML classes of the menu item
					$(this).addClass('has-children collapsed');
					
					// If set to react to click interaction
					if (base.settings.click) {
						// Create a submenu toggle element with ARIA attributes
						var $toggle = $('<button class="toggle" aria-haspopup="true" aria-expanded="false"><span class="assistive text">' + base.settings.translations['expand-label'] + '</span></button>');
						// Add submenu toggle element before submenu
						$submenu.before($toggle);
					}
					
				}
				
			});

			// Process links
			base.$element.find('li > a').each(function () {
				// Mark all links that points to the current page URL
				if (this.href == window.location.href.split('#')[0]) {
					// Mark the link that points to the current page URL with assistive text
					$(this).attr('aria-current', 'page');
					// Add class to the li element
					$(this).parent().addClass('current-menu-item');
					$(this).parent().parentsUntil(base.$element, 'li').addClass('current-menu-ancestor');
				}
			});
			
			// Attach event handlers
			base._attachEventHandlers();
			
		}, 
		
		
		// Attachs event handlers to menu elements
		_attachEventHandlers: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// If set to react to click interaction
			if (base.settings.click) {
				
				// Add 'click-to-use' HTML class to menu element
				base.$element.addClass('click-interaction');
				
				// On click events of submenu toggle buttons
				base.$element.find('.toggle').on('click', function (e) {
					// Toggle submenu
					base.toggleSubmenu($(this).parent());
					// Prevent normal link behavior
					e.preventDefault();
				});
			
			}
			
			// If set to react to hover interaction
			if (base.settings.hover) {
				
				// Add 'hover-to-use' HTML class to menu element
				base.$element.addClass('hover-interaction');
				
				// On mouse enter event of a collapsed menu item
				base.$element.find('li.collapsed').on('mouseenter', function (e) {
					// If in simultaneous mode or if the menu is 'inactive'
					if (base.settings.simultaneous || base.state === 'inactive') {
						// Add class 'hovering' to the menu item for styling purposes
						$(this).addClass('hovering');
						// Show submenu
						base.showSubmenu($(this), 'hover');
					}
				});
				
				// On mouse leave event of a collapsed menu item
				base.$element.find('li.collapsed').on('mouseleave', function (e) {
					// If in simultaneous mode or if the menu is not 'inactive'
					if (base.settings.simultaneous || base.state === 'inactive') {
						// Remove class 'hovering' from the menu item for styling purposes
						$(this).removeClass('hovering');
						// Hide submenu
						base.hideSubmenu($(this), 'hover');
					}
				});
				
			}
			
			// On link click events
			base.$element.find('a').on('click', function (e) {
				
				// Get the link's href attribute value (note that this is different than this.href, which would give the complete URL of the page + '#')
				var href = $(this).attr('href');
				// If the href attribute was missing or '#'
				if (typeof href === 'undefined' || href == '#') {
					// Set event's target to toggle element
					//e.target = $(this).parent().children('.toggle').get(0);
					// Trigger toggle button's click event
					$(this).parent().children('.toggle').trigger('click');
					// Prevent normal link behavior
					e.preventDefault();
				}
				
			});
			
			// On keyup events inside menu
			base.$element.on('keyup', function (e) {
				
				// If Esc key
				if (e.key === "Escape") {
					// Collapse all menu items
					base.collapseAll(e);
				}
				
			});
			
		}, 
		
		
		/* Collapses all menu items */
		collapseAll: function (e) {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Get expanded menu items
			var $expandedMenuItems = base.$element.find('.expanded');

			// Mark all expanded menu items collapsed (ARIA attributes)
			$expandedMenuItems.removeClass('hovering').removeClass('expanded').addClass('collapsed').children('.toggle').removeClass('active').attr('aria-expanded', 'false').html('<span class="assistive text">' + base.settings.translations['expand-label'] + '</span>');
			// Hide all visible submenus
			// https://api.jquery.com/get/#get
			$($expandedMenuItems.has('.submenu:visible').get().reverse()).each(function () {
				base.hideSubmenu($(this));
			});
			
			// Change menu's state to 'inactive'
			base.state = 'inactive';
			// Remove 'active' HTML class from the menu element
			base.$element.removeClass('active');
			
		}, 
		
	
		/* Expands / collapses a menu item */
		toggleSubmenu: function ($menuItem) {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Get all expanded menu items
			var $expandedMenuItems = base.$element.find('.expanded');
			// Get menu item and ancestor menu items
			var $menuItemAndAncestors = $menuItem.parentsUntil(base.$element, 'li').add($menuItem);
			// Get menu item and descendant menu items
			var $menuItemAndDescendants = $menuItem.find('li').add($menuItem);
			
			// If this menu item was collapsed
			if ($menuItem.hasClass('collapsed')) {
				// Hide other visible submenus
				$expandedMenuItems.not($menuItemAndAncestors).each(function () {
					//if ($(this).children('.submenu:visible').length > 0) {
						//setTimeout(function () {
							base.hideSubmenu($(this));
						//}, 100);
					//}
				});
				// Show this menu item's and ancestors' hidden submenus
				$menuItemAndAncestors.each(function () {
					//if ($(this).children('.submenu:hidden').length > 0) {
						//setTimeout(function () {
							base.showSubmenu($(this));
						//}, 100);
					//}
				});
				// Mark all expanded menu items except this and ancestors collapsed (ARIA attributes)
				$expandedMenuItems.not($menuItemAndAncestors).filter('.has-children').removeClass('expanded hovering').addClass('collapsed').children('.toggle').removeClass('active').attr('aria-expanded', 'false').html('<span class="assistive text">' + base.settings.translations['expand-label'] + '</span>');
				// Mark this and all ancestor menu items expanded (ARIA attributes)
				$menuItemAndAncestors.removeClass('collapsed').addClass('expanded hovering').children('.toggle').addClass('active').attr('aria-expanded', 'true').html('<span class="assistive text">' + base.settings.translations['collapse-label'] + '</span>');
			}
			// Else
			else {
				// Hide this menu item's and descendants' visible submenus
				$menuItemAndDescendants.each(function () {
					if ($(this).children('.submenu:visible').length > 0) {
						//setTimeout(function () {
							base.hideSubmenu($(this));
						//}, 100);
					}
				});
				// Mark this and all expanded descendant menu items collapsed (ARIA attributes)
				$menuItemAndDescendants.filter('.has-children').removeClass('expanded hovering').addClass('collapsed').children('.toggle').removeClass('active').attr('aria-expanded', 'false').html('<span class="assistive text">' + base.settings.translations['expand-label'] + '</span>');
			}
			
			// If there are expanded menu items
			if (base.$element.find('.expanded').length > 0) {
				// Change menu's state to 'active'
				base.state = 'active';
				// Add 'active' HTML class to the menu element
				base.$element.addClass('active');
			}
			// Else
			else {
				// Change menu's state to 'inactive'
				base.state = 'inactive';
				// Remove 'active' HTML class from the menu element
				base.$element.removeClass('active');
			}
			
		}, 
		
		
		/* Shows menu item's submenu (interaction: 'click' (default) or 'hover') */
		// See https://bugs.jquery.com/ticket/11635
		showSubmenu: function ($menuItem, interaction) {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Get the submenu
			var $submenu = $menuItem.children('.submenu');
			
			// Stop existing animations
			$submenu.stop(true, false);
			//$submenu.addClass('finished');
			//$submenu.css({'height': ''});
			//$submenu.css({'width': ''});
			//$submenu.css({'overflow': 'visible'});
			
			// Get the transition
			var transition = base.settings.transition;
			
			// Get the transition duration based on interaction type
			var duration = (typeof interaction !== 'undefined' && interaction == 'hover' ? base.settings.hoverShowSpeed : base.settings.clickShowSpeed);
			
			// Make overflow of the parent element visible
			$submenu.parent().css({'overflow': 'visible !important'});
			
			// Put this dropdown above earlier dropdowns
			$submenu.css('z-index', subMenuOrder++);
			
			// Remove class 'finished' for styling purposes
			$submenu.removeClass('finished');
			
			// There seems to be a bug on Chrome that causes a hidden submenu to still get clicks, but position: absolute seems to fix it
			$submenu.css({'position': ''});
			
			// If 'slide' transition
			if (transition === 'slide') {
			
				// Set the default values for the current width and height
				var currentWidth = 0;
				var currentHeight = 0;
				
				// If the submenu is displayed
				if ($submenu.is(':visible')) {
					// Get the current width and height of the submenu
					currentWidth = $submenu.width();
					currentHeight = $submenu.height();
				}
				
				// Make the submenu displayed in order to get its dimensions
				$submenu.css({'display': 'block'});
				$submenu.css({'overflow': 'hidden'});
				// Reset the width of the child LI elements
				$submenu.children('li').each(function () {
					$(this).css('width', 'auto');
				});
				// Get the full width of the submenu
				var fullWidth = $submenu.css({'width': 'max-content'}).width();
				// Set the width of the child LI elements to be the same as their container's full width (this must be done before getting the full height)
				$submenu.children('li').each(function () {
					$(this).css('width', fullWidth + 'px');
				});
				// Get the full height of the submenu
				var fullHeight = $submenu.css({'height': 'auto'}).height();
				
				// Set the 'slide' transition's direction
				transition = ($submenu.offset().top - $submenu.parent().offset().top < $submenu.offset().left - $submenu.parent().offset().left ? 'slide-x' : 'slide-y');
			
				// If 'slide-y' transition
				if (transition === 'slide-y') {
					// Adjust transition duration for partially expanded/collapsed menus
					duration *= (fullHeight === 0 ? 0 : (fullHeight - currentHeight) / fullHeight);
					// Set the original state of the submenu
					$submenu.css({'height': currentHeight + 'px', 'overflow': 'visible clip', 'display': 'block'});
					// Animate submenu
					$submenu.animate({'height': fullHeight + 'px'}, duration, base.settings.easing, function () {
						// Add class 'finished' for styling purposes
						// https://bugs.jquery.com/ticket/11635
						$submenu.addClass('finished');
						$submenu.css({'height': 'auto'});
						$submenu.css({'overflow': 'visible'});
					});
				}
				// Else if 'slide-x' transition
				else if (transition === 'slide-x') {
					// Adjust the transition duration for partially expanded/collapsed menus
					duration *= (fullWidth === 0 ? 0 : (fullWidth - currentWidth) / fullWidth);
					// Set the original state of the submenu
					$submenu.css({'width': currentWidth + 'px', 'overflow': 'clip visible', 'display': 'block'});
					// Animate the submenu
					$submenu.animate({'width': fullWidth + 'px', 'padding-right': 0}, duration, base.settings.easing, function () {
						// Add class 'finished' for styling purposes
						// https://bugs.jquery.com/ticket/11635
						$submenu.addClass('finished');
						$submenu.css({'width': 'auto'});
						$submenu.css({'overflow': 'visible'});
						// Reset the width of the child LI elements
						$submenu.children('li').each(function () {
							//$(this).css({'width': 'auto'});
						});
					});
				}
				
			}
			// Else use the default 'fade' transition
			else {
				
				// Set the styles when showing for the first time
				if ($submenu.css('display') === 'none') {
					$submenu.css({'opacity': '0'});
				}
				var currentOpacity = $submenu.css('opacity');
				$submenu.css({'display': 'block'})
				// Adjust the transition duration for partially expanded/collapsed menus
				duration *= (1 - currentOpacity);
				// Animate the submenu
				$submenu.animate({'opacity': '1'}, duration, base.settings.easing, function () {
					// Add class 'finished' for styling purposes
					// https://bugs.jquery.com/ticket/11635
					$submenu.addClass('finished');
				});
				
			}
		
		}, 
		
		
		/* Hides menu item's submenu (interaction: 'click' (default) or 'hover') */
		// See https://bugs.jquery.com/ticket/11635
		hideSubmenu: function ($menuItem, interaction) {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Get the submenu
			var $submenu = $menuItem.children('.submenu');
			
			// Stop existing animations
			$submenu.stop(true, false);
			//$submenu.addClass('finished');
			//$submenu.css({'height': ''});
			//$submenu.css({'width': ''});
			//$submenu.css({'overflow': 'visible'});
			
			// Get the transition
			var transition = base.settings.transition;
			
			// Get the transition duration based on interaction type
			var duration = (typeof interaction !== 'undefined' && interaction == 'hover' ? base.settings.hoverHideSpeed : base.settings.clickHideSpeed);
			
			// Remove class 'finished' for styling purposes
			$submenu.removeClass('finished');
			
			// There seems to be a bug on Chrome that causes a hidden submenu to still get clicks, but position: absolute seems to fix it
			$submenu.css({'position': ''});
			
			// If 'slide' transition
			if (transition === 'slide') {
			
				// Set the default values for the current width and height
				var currentWidth = 0;
				var currentHeight = 0;
				
				// If the submenu is displayed
				if ($submenu.is(':visible')) {
					// Get the current width and height of the submenu
					currentWidth = $submenu.width();
					currentHeight = $submenu.height();
				}
				
				// Make the submenu displayed in order to get its dimensions
				$submenu.css({'display': 'block'});
				$submenu.css({'overflow': 'hidden'});
				// Reset the width of the child LI elements
				$submenu.children('li').each(function () {
					$(this).css('width', 'auto');
				});
				// Get the full width of the submenu
				var fullWidth = $submenu.css({'width': 'max-content'}).width();
				// Set the width of the child LI elements to be the same as their container's full width (this must be done before getting the full height)
				$submenu.children('li').each(function () {
					$(this).css('width', fullWidth + 'px');
				});
				// Get the full height of the submenu
				var fullHeight = $submenu.css({'height': 'auto'}).height();
				
				// Set the 'slide' transition's direction
				transition = ($submenu.offset().top - $submenu.parent().offset().top < $submenu.offset().left - $submenu.parent().offset().left ? 'slide-x' : 'slide-y');
				
				// if 'slide-x' transition
				if (transition === 'slide-x') {
					// Adjust the transition duration for partially expanded/collapsed menus
					duration *= (fullWidth === 0 ? 0 : currentWidth / fullWidth);
					// Set the original state of the submenu
					$submenu.css({'width': currentWidth + 'px', 'overflow': 'clip visible', 'display': 'block'});
					// Animate the submenu
					$submenu.animate({'width': 0 + 'px'}, duration, base.settings.easing, function () {
						// Add class 'finished' for styling purposes
						// https://bugs.jquery.com/ticket/11635
						$submenu.addClass('finished');
						// There seems to be a bug on Chrome that causes a hidden submenu to still get clicks, but position: absolute seems to fix it
						$submenu.css({'display': 'none', 'width': 'auto', 'z-index': '0', 'position': 'absolute'});
						// Reset the width of the child LI elements
						$submenu.children('li').each(function () {
							//$(this).css({'width': 'auto'});
						});
					});
				}
				// Else if 'slide-y' transition
				else if (transition === 'slide-y') {
					// Adjust the transition duration for partially expanded/collapsed menus
					duration *= (fullHeight === 0 ? 0 : currentHeight / fullHeight);
					// Set the original state of the submenu
					$submenu.css({'height': currentHeight + 'px', 'overflow': 'visible clip', 'display': 'block'});
					// Animate the submenu
					$submenu.animate({'height': 0 + 'px'}, duration, base.settings.easing, function () {
						// Add class 'finished' for styling purposes
						// https://bugs.jquery.com/ticket/11635
						$submenu.addClass('finished');
						// There seems to be a bug on Chrome that causes a hidden submenu to still get clicks, but position: absolute seems to fix it
						$submenu.css({'display': 'none', 'height': 'auto', 'z-index': '0', 'position': 'absolute'});
					});
				}
				
			}
			// Else use the default 'fade' transition
			else {
				
				var currentOpacity = $submenu.css('opacity');
				// Adjust transition duration for partially expanded/collapsed menus
				duration *= currentOpacity;
				// Hide submenu
				$submenu.animate({'opacity': '0'}, duration, base.settings.easing, function () {
					// Add class 'finished' for styling purposes
					// https://bugs.jquery.com/ticket/11635
					$submenu.addClass('finished');
					// There seems to be a bug on Chrome that causes a hidden submenu to still get clicks, but position: absolute seems to fix it
					$submenu.css({'display': 'none', 'z-index': '0', 'position': 'absolute'});
				});
				
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

