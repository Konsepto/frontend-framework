/*!

Fixed footer jQuery plugin
Version: 0.1.1 (2016-12-07 11:20)
Package: Konsepto Web Frontend Framework
Author: Kalle Mäntsälä / Konsepto
Website: http://konsepto.fi
License: Licensed under MIT

Description: 

Sticks the footer to the bottom of the browser window on short pages.

Usage: 

$(selector).fixFooter([object options]);
Returns: object jQuery

Make sure that 'selector' is the html element

See below for the available options

Examples: 

// Stick the footer to the bottom of the browser window on short pages, uses default 20px margin on top
$('html').fixFooter();

// Use custom top margin
$('html').fixFooter({
  footerTopMarginPx: 40 
});

*/


// Add protective wrapper
;(function ($, window, document, undefined) {

  "use strict";


  // Create the defaults once
  var pluginName = "fixFooter",
      _self,
      $contentSection,
      $footerSection,
      contentBottomPadding,
      defaults = {
        footerTopMarginPx: '0',
        pageSelector: '#page',
        footerSectionSelector: '#section-footer'
      };

  // The actual plugin constructor
  function Plugin (el, options) {
    _self = this;
    
    this.el = el;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    
    this.init();
  }
  
  
  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    
    init: function () {   
      
      var $html = $('html'); 
      
      $contentSection = $html.find(_self.settings.pageSelector);
      $footerSection = $html.find(_self.settings.footerSectionSelector);
            
      contentBottomPadding = parseInt(_self.settings.footerTopMarginPx);
      
      $footerSection.css('height', 'auto');
      $html.addClass('js-fixed-footer');
      
      // Add some space to document bottom for the footer 
      _self.adjustToFooterHeight();
      
      // Readjust when layout changes
      $(window).resize(_self.adjustToFooterHeight);
    },
    
    
    // Adjusts the setup to footer content height
    adjustToFooterHeight: function() {
      var footerH = $footerSection.height();
      $contentSection.css('padding-bottom', (footerH + contentBottomPadding) + 'px');
    }    

  });
  
  

  // Wrapper preventing against multiple instantiations
  $.fn[ pluginName ] = function (options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);