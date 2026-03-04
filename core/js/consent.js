/*!

Front-end Framework Consent Script
Version: 0.5 (2020-11-12 11:30)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto
Website: https://konsepto.fi
License: The MIT License

This script adds a new method into the document object that checks if the user has given their consent before writing any HTML snippets that require user's consent according to GDPR or similar.

The reason you would want to use this method is that if you check user's consent status at the server's end and then save the resulting HTML page into page cache, that same HTML page will get delivered to other users, regardless of their consent.

User's consent status is checked from a cookie and based on this method's arguments. Note that cookies can only contain textual (string) values.

You will need some other method to set that consent cookie. Here is one WordPress plugin you could use: 

Cookie Notice for GDPR & CCPA
https://wordpress.org/plugins/cookie-notice/

You should execute this method only when the document is being created, usually at the bottom of the HEAD part or at the bottom of the BODY part. That is because the HTML snippets we would like to include often use the document.write() method themselves. You can also use this method inside external JavaScript files (e.g. 'site.js') but only if it is executed when the document is being created.

(JQuery plugins are usually initialized by attaching them into DOM elements at document's ready event. However, you cannot use the document.write() method at that point, because it would clear the finished document completely before writing the new content. This means also that you cannot add any scripts that use document.write() method after the document is finished. If you have those, and if you want to track the current page after the user has given their consent, you must reload the page programmatically.)

When you use this method inside a SCRIPT tag, you should encode the HTML snippet as a JavaScript string, preferably using automated tools in order to avoid syntax errors. Here is one you could use: 

https://www.freeformatter.com/javascript-escape.html

(If you do not want to escape the whole string, you must at least break the ending SCRIPT tag (e.g. '</script>' => '<' + '/script>') inside a string so that they do not break the SCRIPT tag, and possibly escape some single or double quotes so that they do not break the JavaScript string.)


Usage (with the abovementioned WordPress plugin): 

<script>
// Write any consent requiring scripts (e.g. Google Analytics, Google Ads, Facebook Pixel) into the document, but only if user has given consent
// https://www.freeformatter.com/javascript-escape.html
document.consentWrite(
	'cookie_notice_accepted', // Cookie name
	'true', // Consent given value (a string)
	'<!-- Consent requiring scripts -->\r\n<script>\r\n\t\/\/ Replace this tag with your HTML snippets\r\n<\/script>\r\n<!-- \/ Consent requiring scripts -->' // Escaped HTML code snippet to write
);
</script>

*/

"use strict";


// Add protective wrapper
;(function (window, document, undefined) {


	// Variables

	// ...
		
		
	// Functions

	// Read cookie
	// https://www.quirksmode.org/js/cookies.html
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


	// Execution

	// Add consentWrite method to document
	document.consentWrite = function (cookieName, valueString, htmlSnippet) {
		if (readCookie(cookieName) == valueString) {
			document.write(htmlSnippet);
		}
	};
	
	
})(window, document);

