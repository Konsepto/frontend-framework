/*!

Front-end Framework Debugging Script
Version: 2.0 (2026-11-20)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto
Website: https://konsepto.fi
License: The MIT License

This script adds certain debugging tools that you see at the bottom right of the page when the
debugging mode is enabled (Protosite: define('PROTOSITE_DEV', true) in wp-config.php). The styles
are in theme-default/css/debug.css, loaded together with this script.

Tools: client size display, grid layout mode, large text mode, mark image dimensions and reload
stylesheets. Version 2.0 removed the LESS.js options and the LESS watch mode (no more LESS.js in
the browser) and no longer clears localStorage on every page load.

*/

"use strict";



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
			$('<button id="button-reload-stylesheets" title="Reload linked stylesheets"><span class="screen-reader">Reload linked stylesheets</span></button>').on('click', function (e) {
				console.log('Reloading linked stylesheets.');
				// Add a timestamp parameter to each stylesheet link so that the browser fetches it again
				$('link[rel="stylesheet"][href]').each(function () {
					var url = new URL($(this).attr('href'), document.baseURI);
					url.searchParams.set('reload', Date.now());
					$(this).attr('href', url.href);
				});
				e.preventDefault();
			})
		);
		
	});
	
})(jQuery, window, document);
