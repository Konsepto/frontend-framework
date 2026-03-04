/*!

Accessible Links jQuery plugin
Version: 0.6 (2024-09-24 18:30)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto
Website: https://konsepto.fi
License: The MIT License


Description: 

This plugin adds assistive texts (in parenthesis) and classes and span elements for icons or similar style changes based on link types: anchor, protocol, file type, external, new tab. 

If you wish, you can hide assistive texts from other users except screen reader users with CSS.

The result should be quite accessible. It follows WCAG 2.1 guidelines.

See examples below for the available options.

Tested at 2020-05-29: Windows 10: Chrome (latest), NVDA (latest); Samsung Galaxy S7: Chrome (latest).


Usage: 

$(selector).accessibleLinks([object options]);

Returns: object jQuery

Requires: jQuery


Examples: 


// Enhance links with assistive text and icons
$('a').accessibleLinks();

// Enhance links with assistive text and icons with all options
$('a').accessibleLinks({
	labels: { // Labels (use for translations)
				'anchor': 'anchor', 
		//...
	}
});


Accessibility: 

https://webaim.org/techniques/hypertext/hypertext_links


Plugin structure: 

https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js


*/

"use strict";

// Add protective wrapper
;(function ($, window, document, undefined) {
	

	// Declare the plugin name
	var pluginName = "accessibleLinks";
	
	// Declare the plugin language based on html element's lang attribute
	var language = ($('html').attr('lang') ? $('html').attr('lang') : 'en');
	
	// Declare the translations
	var translations = {
		'en': {
			'anchor': 'anchor', 
			'email': 'email', 
			'phone': 'phone', 
			'application': 'application', 
			'pdf file': 'PDF file', 
			'word file': 'Word file', 
			'excel file': 'Excel file', 
			'powerpoint file': 'PowerPoint file', 
			'image file': 'image file', 
			'video file': 'video file', 
			'audio file': 'audio file', 
			'archive file': 'archive file', 
			'text file': 'text file', 
			'rich text file': 'rich text file', 
			'tabular data file': 'tabular data file', 
			'code file': 'code file', 
			'file': 'file', 
			'external': 'external', 
			'new tab': 'new tab'
		}, 
		'fi': {
			'anchor': 'ankkuri', 
			'email': 'sähköposti', 
			'phone': 'puhelin', 
			'application': 'sovellus', 
			'pdf file': 'PDF-tiedosto', 
			'word file': 'Word-tiedosto', 
			'excel file': 'Excel-tiedosto', 
			'powerpoint file': 'PowerPoint-tiedosto', 
			'image file': 'kuvatiedosto', 
			'video file': 'videotiedosto', 
			'audio file': 'äänitiedosto', 
			'archive file': 'arkistotiedosto', 
			'text file': 'tekstitiedosto', 
			'rich text file': 'rikastekstitiedosto', 
			'tabular data file': 'taulukkodatatiedosto', 
			'code file': 'kooditiedosto', 
			'file': 'tiedosto', 
			'external': 'ulkoinen', 
			'new tab': 'uusi välilehti'
		}, 
		'sv': {
			'anchor': 'förankrings', 
			'email': 'e-post', 
			'phone': 'telefon', 
			'application': 'app', 
			'pdf file': 'PDF-fil', 
			'word file': 'Word-fil', 
			'excel file': 'Excel-fil', 
			'powerpoint file': 'PowerPoint-fil', 
			'image file': 'bidfil', 
			'video file': 'videofil', 
			'audio file': 'audiofil', 
			'archive file': 'arkivfil', 
			'text file': 'textfil', 
			'rich text file': 'riktextfil', 
			'tabular data file': 'tabelldatafil', 
			'code file': 'kodfil', 
			'file': 'fil', 
			'external': 'extern', 
			'new tab': 'ny flik'
		}, 
		'fr': {
			'anchor': 'ancre', 
			'email': 'e-mail', 
			'phone': 'numéro de téléphone', 
			'application': 'application', 
			'pdf file': 'fichier PDF', 
			'word file': 'fichier Word', 
			'excel file': 'fichier Excel', 
			'powerpoint file': 'fichier Powerpoint', 
			'image file': 'fichier d’image', 
			'video file': 'fichier de vidéo', 
			'audio file': 'fichier audio', 
			'archive file': 'fichier d’archive', 
			'text file': 'fichier texte', 
			'rich text file': 'fichier RTF', 
			'tabular data file': 'fichier de données tabulaire', 
			'code file': 'fichier de code', 
			'file': 'fichier', 
			'external': 'extérieur', 
			'new tab': 'nouvel onglet'
		}
	};
	
	// Declare the default options
	var defaultOptions = {
		translations: (typeof translations[language] === 'undefined' ? (typeof translations[language.split('-')[0]] === 'undefined' ? translations['en'] : translations[language.split('-')[0]]) : translations[language]), // Text translations (tries to load translations based on HTML element's lang attribute with and without country code, defaults to 'en')
	};
	
	// Declare a variable to store drawer groups
	var groups = {};
	

	// The actual plugin constructor
	function Plugin (element, options) {
		this._name = pluginName;
		this.element = element;
		this.state = 'closed';
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
			
			// Process link elements
			base._processElements();
			
		}, 
		
		
		// Adds accessibility enchancements to link items
		_processElements: function () {
			
			// Prevent conflicts with other objects
			var base = this;
			
			// Element shortcut
			var a = base.element;
			
			// Go through different link types (anchor, protocol, file type, host and new tab) and mark elements accordingly
			if (a.pathname == location.pathname && a.hash && a.hash !== '#') {
				$(a).addClass('accessible-link link-anchor').append('<span class="link-anchor-icon"><span class="assistive text">(' + base.settings.translations['anchor'] + ')</span></span>');
			}
			else if (a.protocol !== 'javascript:' &&  a.href) {
				if (a.protocol === 'mailto:') {
					$(a).addClass('accessible-link link-email').append('<span class="link-protocol-icon"><span class="assistive text">(' + base.settings.translations['email'] + ')</span></span>');
				}
				else if (a.protocol === 'tel:') {
					$(a).addClass('accessible-link link-phone').append('<span class="link-protocol-icon"><span class="assistive text">(' + base.settings.translations['phone'] + ')</span></span>');
				}
				else if (a.protocol !== 'http:' && a.protocol !== 'https:') {
					$(a).addClass('accessible-link link-application').append('<span class="link-protocol-icon"><span class="assistive text">(' + base.settings.translations['application'] + ')</span></span>');
				}
				else {
					
					// https://www.computerhope.com/issues/ch001789.htm
					// https://fileinfo.com/filetypes/
					if (a.pathname.match(new RegExp('\\.pdf$', 'i'))) {
						$(a).addClass('accessible-link link-pdf-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['pdf file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(docx?|docm?|dotx?|dotm?)$', 'i'))) {
						$(a).addClass('accessible-link link-word-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['word file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(xlsx?|xlsm?|xltx?|xltm?)$', 'i'))) {
						$(a).addClass('accessible-link link-excel-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['excel file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(pptx?|pptm?|ppsx?|ppsm?)$', 'i'))) {
						$(a).addClass('accessible-link link-powerpoint-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['powerpoint file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(svg|ai|bmp|gif|icon?|jpe?g|png|psd|svg|tiff?|webp|mng|jng|jpx|jpg2?|j2k|jpf)$', 'i'))) {
						$(a).addClass('accessible-link link-image-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['image file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(3gp|3g2|avi|h264|m4v|mkv|mov|mp4|mpe?g|rm|wmv)$', 'i'))) {
						$(a).addClass('accessible-link link-video-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['video file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(aif|midi?|mp3|mpa|ogg|wav|wma)$', 'i'))) {
						$(a).addClass('accessible-link link-audio-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['audio file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(zip|7z|gz|z|arj|deb|pkg|rar|rpm|tar)$', 'i'))) {
						$(a).addClass('accessible-link link-archive-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['archive file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(txt|log|readme|nfo)$', 'i'))) {
						$(a).addClass('accessible-link link-text-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['text file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(rtf|rtx)$', 'i'))) {
						$(a).addClass('accessible-link link-rich-text-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['rich text file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(csv|tsv)$', 'i'))) {
						$(a).addClass('accessible-link link-tabular-data-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['tabular data file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.(js|css|less|sass)$', 'i'))) {
						$(a).addClass('accessible-link link-code-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['code file'] + ')</span></span>');
					}
					else if (a.pathname.match(new RegExp('\\.[^/]{0,8}$', 'i')) && !a.pathname.match(new RegExp('\\.(html?|xhtml|xml|jhtml|php[345]?|cfm|cgi|pl|py|aspx?|axd|asx|asmx|ashx|jspx?|java|do|action|xml|rss)$', 'i'))) {
						$(a).addClass('accessible-link link-file').append('<span class="link-file-type-icon"><span class="assistive text">(' + base.settings.translations['file'] + ')</span></span>');
					}
				
					// https://stackoverflow.com/a/6549132
					if (a.hostname !== location.hostname) {
						$(a).addClass('accessible-link link-external').append('<span class="link-host-icon"><span class="assistive text">(' + base.settings.translations['external'] + ')</span></span>');
					}
					
				}
				
				if ($(a).attr('target') && $(a).attr('target') !== '_self') {
					$(a).addClass('accessible-link link-new-tab').append('<span class="link-target-icon"><span class="assistive text">(' + base.settings.translations['new tab'] + ')</span></span>');
				}
				
			}
			
			// If the link has an image as a child element, mark it with a class name for styling purposes
			// Normally you do not want to show images and icons at the same time, so this allows you to hide them
			$(a).filter('.accessible-link').has('img').addClass('has-image');
			
		}, 
		
		
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

