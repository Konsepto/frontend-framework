/*!

Front-end Framework Cookie Script
Version: 0.2 (2023-12-07 15:30)
Package: Konsepto Front-end Framework
Author: Mikko Paltamaa / Konsepto
Website: https://konsepto.fi
License: The MIT License

This script contains functions that allows you to read, write and delete cookies.


*/

"use strict";


// Add protective wrapper
;(function (document, undefined) {


	// Variables

	// ...
		
		
	// Functions

	// ...
	

	// Execution

	// Cookie helper functions
	// https://www.quirksmode.org/js/cookies.html

	// Write cookie
	document.writeCookie = function (name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = '; expires=' + date.toGMTString();
		}
		else var expires = '';
		document.cookie = name + '=' + value + expires + '; path=/';
	};

	// Read cookie
	document.readCookie = function (name) {
		var nameEQ = name + '=';
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	};

	// Delete cookie
	document.deleteCookie = function (name) {
		// The negative expiration time causes the cookie to be instantly deleted by the browser
		writeCookie(name, '', -1);
	};
	
	
})(document);

