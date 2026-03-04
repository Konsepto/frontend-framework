/*!

Front-end Framework Debugging Script
Version: 1.1 (2022-05-16 20:00)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto
Website: https://konsepto.fi
License: The MIT License

This script adds certain debugging tools that you see at the bottom right of the page when the debugging mode is enabled.

Note that this file must be included before LESS.js!

Also note that in order to watch mode to work, you must have something like this in you .htaccess file: 

# Disable .less file caching in browsers (they should not be used in production)
<filesMatch "\.less$">
	Header set Cache-Control "no-cache"
</filesMatch>

Otherwise the .less files will come from the browser's cache even in watch mode.

*/

"use strict";


// Variables

// Set the LESS JS mode on
var LESS_JS = true;
	
	
// Functions

// ...


// Execution


// Add protective wrapper
;(function ($, window, document, undefined) {
	
	
	// Variables
	
	// ...
	
	
	// Functions
	
	// ...
	
	
	// Execution

	// Check if there is a console for logging and create a dummy if not
	// https://curtistimson.co.uk/post/js/preventing-console-log-issues-in-ie/
	// https://caniuse.com/#feat=console-basic
	window.console = window.console || {log: function(a) {}};
		
	// If local storage clear method is available
	if (typeof localStorage.clear === 'function') {
		// Clear any files from local storage (just to be sure)
		// https://developer.mozilla.org/en-US/docs/Web/API/Storage/clear
		localStorage.clear();
	}

	// http://lesscss.org/usage/#using-less-in-the-browser-options
	var less = {
		// To enable watch mode, option 'env' must be set to development
		// Environment to run may be either development or production (default)
		env: 'development', 
		// The amount of time (in milliseconds) between polls while in watch mode.
		// Default: 1000 (Set a more sensible polling interval!!!)
		poll: 15000, 
		// Set LESS to work asynchronously, which improves the speed a lot
		// Default: false (true makes the page display faster but without styles, which is not good)
		async: false, 
		// Whether to request the import asynchronously when in a page with a file protocol.
		// Default: false (not sure which is better)
		fileAsync: true, 
		// Whether to use the per session file cache. This caches less files so that you can call modifyVars and it will not retrieve all the less files again. If you use the watcher or call refresh with reload set to true, then the cache will be cleared before running.
		// Default: true (previously false in before v2; no need for any file cache while on watch mode)
		useFileCache: false, 
		// Set the method of error reporting when compilation fails
		// Options: html|console|function; Default: html
		errorReporting: 'html', 
		// The amount of logging in the javascript console. Note: If you are in the production environment you will not get any logging.
		// 2 - Information and errors, 1 - Errors, 0 - Nothing; Default: 2
		logLevel: 2, 
		// Add source line information to the output css file
		// Options: ''| 'comments'|'mediaquery'|'all' Default: ''
		dumpLineNumbers: 'all'
		/*
		// Set options in a global less object before loading the less.js script
		globalVars: {
			version: "'" + Math.round((new Date()).getTime() / 1000) + "'"
		}
		*/
	};
	
	// Execute when the document is ready
	$(function () {
		
		// Print jquery version for debugging
		//console.log('jQuery version', $.fn.jquery);
		
		$('html').addClass('debug-mode');
		
		$('body').append('<div id="debug-tools"></div>');
	
		// Add client size button functionality
		$('#debug-tools').append('<div id="client-size-display">' + document.body.clientWidth + 'px &times; ' + document.body.clientHeight + 'px' + '</div>');
		if (window.attachEvent) {
			window.attachEvent('onresize', function () {
				$('#client-size-display').html(document.body.clientWidth + 'px &times; ' + document.body.clientHeight + 'px');
			});
		}
		else if (window.addEventListener) {
			window.addEventListener('resize', function () {
				$('#client-size-display').html(document.body.clientWidth + 'px &times; ' + document.body.clientHeight + 'px');
			}, true);
		}
		$('#debug-tools').append(
			$('<button id="button-client-size-display-mode" title="Toggle client size display"><span class="screen-reader">Toggle client size display</span></button>').on('click', function (e) {
				console.log(($('html').hasClass('client-size-display-mode') ? 'Disabling' : 'Enabling') + ' the client size display.');
				$('html').toggleClass('client-size-display-mode');
				e.preventDefault();
			})
		);
	
		// Add grid layout button functionality
		$('#debug-tools').append(
			$('<button id="button-grid-layout-mode" title="Toggle grid layout mode"><span class="screen-reader">Toggle grid layout mode</span></button>').on('click', function (e) {
				console.log(($('html').hasClass('grid-layout-mode') ? 'Disabling' : 'Enabling') + ' the grid layout mode.');
				$('html').toggleClass('grid-layout-mode');
				e.preventDefault();
			})
		);
		
		// Add large text mode button functionality
		$('#debug-tools').append(
			$('<button id="button-large-text-mode-mode" title="Toggle large text mode"><span class="screen-reader">Toggle large text mode</span></button>').on('click', function (e) {
				console.log(($('html').hasClass('large-text-mode') ? 'Disabling' : 'Enabling') + ' the large text mode.');
				$('html').toggleClass('large-text-mode');
				//console.log('Reloading the page.');
				//$('html').css({'font-size': '24px'});
				// Reload the page
				// TODO: Does not work
				//location.reload(true);
				// https://www.w3schools.com/jsref/met_loc_reload.asp
				//var url = location.href.split('#')[0];
				//url = url.split('?')[0];
				//location.replace(url + '?version=' + Math.round((new Date()).getTime() / 1000));
				e.preventDefault();
			})
		);
	
		// Add mark image dimensions button functionality
		var dimensionsCallbackFunction = function () {
			var $this = $(this);
			var width  = $this.prop("width");
			var height = $this.prop("height");
			var oWidth  = Math.round($this.prop("naturalWidth") * window.devicePixelRatio);
			var oHeight = Math.round($this.prop("naturalHeight") * window.devicePixelRatio);
			var scalingInfo = '';
			$this.removeClass('loss-of-quality-upscaling loss-of-quality-downscaling divisible-downscaling not-scaled');
			if ($('html').hasClass('mark-image-dimensions-mode')) {
				if (
					oWidth < width || oHeight < height
				) {
					//$this.css('outline', '2px solid red');
					$this.addClass('loss-of-quality-upscaling');
					scalingInfo = 'Loss of quality upscaling';
				}
				else if (
					oWidth % width !== 0 || oHeight % height !== 0
				) {
					//$this.css('outline', '2px solid orange');
					$this.addClass('loss-of-quality-downscaling');
					scalingInfo = 'Loss of quality downscaling';
				}
				else if (oWidth > width || oHeight > height) {
					//$this.css('outline', '2px solid blue');
					$this.addClass('divisible-downscaling');
					scalingInfo = 'Divisible downscaling';
				}
				else {
					//$this.css('outline', '2px solid green');
					$this.addClass('not-scaled');
					scalingInfo = 'Not scaled';
				}
				$this.data('original-title', $this.attr('title'));
				$this.attr('title', scalingInfo + ' (original: ' + oWidth + '×' + oHeight + ', rendered: ' + width + '×' + height + ')');
				$this.on('load', dimensionsCallbackFunction);
			}
			else {
				$this.removeAttr('title');
				$this.attr('title', $this.data('original-title'));
				$this.removeData('original-title');
				$this.off('load', dimensionsCallbackFunction);
			}
		};
		$('#debug-tools').append(
			$('<button id="button-mark-image-dimensions" title="Mark image dimensions"><span class="screen-reader">Mark image dimensions</span></button>').on('click', function (e) {
				console.log('Enabling mark image dimensions mode.');
				// Mark all images that are rendered to different dimensions than the originals and which may not look sharp
				$('html').toggleClass('mark-image-dimensions-mode');
				$('img:not([src$=".svg"]):not([src$=".SVG"])').each(dimensionsCallbackFunction);
				e.preventDefault();
			})
		);
	
		// Add reload stylesheets button functionality
		$('#debug-tools').append(
			$('<button id="button-reload-stylesheets" title="Reload linked stylesheets (but no LESS files)"><span class="screen-reader">Reload linked stylesheets (but no LESS files)</span></button>').on('click', function (e) {
				console.log('Reloading linked stylesheets.');
				// If local storage clear method is available
				if (typeof localStorage.clear === 'function') {
					// Clear any files from local storage (just to be sure)
					// https://developer.mozilla.org/en-US/docs/Web/API/Storage/clear
					localStorage.clear();
				}
				// For each link
				$('link[type="text/css"][href]').each(function() {
					var urlParts = $(this).attr('href').split('?');
					url = urlParts[0] + '?version=' + Math.round((new Date()).getTime() / 1000);
					$(this).attr('href', url);
				});
				e.preventDefault();
			})
		);
		
		// If LESS.js methods are available
		if (typeof less.watch === 'function' && typeof less.refresh === 'function') {
			
			// Add LESS watch mode button functionality
			$('#debug-tools').append(
				$('<button id="button-less-watch-mode-mode" title="Toggle LESS watch mode"><span class="screen-reader">Toggle LESS watch mode</span></button>').on('click', function (e) {
					$('html').toggleClass('less-watch-mode');
					if ($('html').hasClass('less-watch-mode')) {
						console.log('Refreshing LESS files (it may take a while).');
						// If local storage clear method is available
						if (typeof localStorage.clear === 'function') {
							// Clear any files from local storage (just to be sure)
							// https://developer.mozilla.org/en-US/docs/Web/API/Storage/clear
							localStorage.clear();
						}
						// Request a refresh immediately instead of polling interval
						less.refresh(true);
						// Start watch mode
						less.watch();
						console.log('Watching for LESS file changes for every ' + (less.options.poll / 1000) + ' seconds.');
					}
					else {
						// End watch mode
						less.unwatch();
						console.log('Not watching for LESS file changes anymore.');
					}
					e.preventDefault();
				})
			);
			
		}
		
	});
	
})(jQuery, window, document);
