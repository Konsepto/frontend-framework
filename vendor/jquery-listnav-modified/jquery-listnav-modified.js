/*
* jQuery listnav plugin
*
* Add a slick "letter-based" navigation bar to all of your lists.
* Click a letter to quickly filter the list to items that match that letter.
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
* Version 2.4.10 (09/02/2015)
* Author: Eric Steinborn
* Compatibility: jQuery 1.3.x through 1.11.0 and jQuery 2
* Browser Compatibility: IE6+, FF, Chrome & Safari
* CSS is a little wonky in IE6, just set your listnav class to be 100% width and it works fine.
*
*/
(function ($) {
  $.fn.listnav = function (options) {
        firstClick = false,
        clickEventType = '';
    var opts = $.extend({}, $.fn.listnav.defaults, options),
	 /* Modified this part so that it is possible to include Finnish/Swedish alphabets. Also added the default letter mapping if not found in the chosen alphabet.
	 
	 Original: 
	 
        letters = ['_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-'],
		  
	 New: 
	 */
        letters = (options.letters ? options.letters : ['_', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '-']),
	 /* 
	 Modified part ends */
        firstClick = false,
        clickEventType = '';

    //detect if you are on a touch device easily.
    if (document.ontouchstart !== null) {
      clickEventType = 'click';
    } else {
      // We added 'click' to this becuase on touchscreen computers, when you click with a mouse, it will not fire the click function on a letter, hence disabling the entire plugin functionality. Thanks to my homeboy @clechner77 for pointing this out to me:
      // https://github.com/esteinborn/jquery-listnav/issues/34
      clickEventType = 'touchend click';
    }

    opts.prefixes = $.map(opts.prefixes, function (n) {
      return n.toLowerCase();
    });
    
    return this.each(function () {
      var $wrapper, $letters, $letterCount, left, width, count,
          id = this.id,
          $list = $(this),
          counts = {},
          allCount = 0, fullCount = 0,
          isAll = true,
          prevLetter = '';
          
          
   	 /* Modified this part so that it is possible to include Finnish/Swedish alphabets. Also added the default letter mapping if not found in the chosen alphabet.

   	 Original: 

        if ( !$('#' + id + '-nav').length ) {
    
          $('<div id="' + id + '-nav" class="listNav"/>').insertBefore($list);
          // Insert the nav if its not been inserted already (preferred method)
          // Legacy method was to add the nav yourself in HTML, I didn't like that requirement
        }
        
        $wrapper = $('#' + id + '-nav');
  
   	 New: 
   	 */
      /* Modified (inserted)this to support multiple lists per page without original id attribute */

      if (id) {
        if ( !$('#' + id + '-nav').length ) {
          $('<div id="' + id + '-nav" class="listNav"/>').insertBefore($list);
          // Insert the nav if its not been inserted already (preferred method)
          // Legacy method was to add the nav yourself in HTML, I didn't like that requirement
        }
        $wrapper = $('#' + id + '-nav');
      }
      else {
        $('<div class="listNav"/>').insertBefore($list);
        $wrapper = $list.prev('.listNav');      
      }
      
  	 /* 
  	 Modified part ends */
      

      // <ul id="myList"> for list and <div id="myList-nav"> for nav wrapper

      function init() {
        $wrapper.append(createLettersHtml());

        $letters = $('.ln-letters', $wrapper).slice(0, 1);

        if ( opts.showCounts ) {
          $letterCount = $('.ln-letter-count', $wrapper).slice(0, 1);
        }

        addClasses();

        addNoMatchLI();

        bindHandlers();

        if (opts.flagDisabled) {
          addDisabledClass();
        }

        // remove nav items we don't need

        if ( !opts.includeAll ) {
          $('.all', $letters).remove();
        }

        if ( !opts.includeNums ) {
          $('._', $letters).remove();
        }

        if ( !opts.includeOther ) {
          $('.-', $letters).remove();
        }

        if ( opts.removeDisabled ) {
          $('.ln-disabled', $letters).remove();
        }

        $(':last', $letters).addClass('ln-last');

        if ( $.cookie && (opts.cookieName !== null) ) {
          var cookieLetter = $.cookie(opts.cookieName);

          if ( cookieLetter !== null && typeof cookieLetter !== "undefined" ) {
            opts.initLetter = cookieLetter;
          }
        }

        // decide what to show first
        // Is there an initLetter set, if so, show that letter first
        if ( opts.initLetter !== '' ) {
          firstClick = true;

          // click the initLetter if there was one
          $('.' + opts.initLetter.toLowerCase(), $letters).slice(0, 1).trigger(clickEventType);
        } else {
          // If no init letter is set, and you included All, then show it
          if ( opts.includeAll ) {
            // make the All link look clicked, but don't actually click it
            $('.all', $letters).addClass('ln-selected');
          } else {
            // All was not included, lets find the first letter with a count and show it
            for ( var i = ((opts.includeNums) ? 0 : 1); i < letters.length; i++) {
              if ( counts[letters[i]] > 0 ) {
                firstClick = true;

                $('.' + letters[i], $letters).slice(0, 1).trigger(clickEventType);

                break;
              }
            }
          }
        }
      }

      // position the letter count above the letter links
      function setLetterCountTop() {
        // we're going to need to subtract this from the top value of the wrapper to accomodate changes in font-size in CSS.
        var letterCountHeight = $letterCount.outerHeight();

        $letterCount.css({
          top: $('a:first', $wrapper).slice(0, 1).position().top - letterCountHeight
          // we're going to grab the first anchor in the list
          // We can no longer guarantee that a specific letter will be present
          // since adding the "removeDisabled" option

        });

      }

      // adds a class to each LI that has text content inside of it (ie, inside an <a>, a <div>, nested DOM nodes, etc)
      function addClasses() {
        var str, spl, $this,
          firstChar = '',
          hasPrefixes = (opts.prefixes.length > 0),
          hasFilterSelector = (opts.filterSelector.length > 0);

        // Iterate over the list and set a class on each one and use that to filter by
        $($list).children().each(function () {
          $this = $(this);

          // I'm assuming you didn't choose a filterSelector, hopefully saving some cycles
          if ( !hasFilterSelector ) {
            //Grab the first text content of the LI, we'll use this to filter by
            str = $.trim($this.text()).toLowerCase();
          } else {
            // You set a filterSelector so lets find it and use that to search by instead
            str = $.trim($this.find(opts.filterSelector).text()).toLowerCase();
          }

          // This will run only if there is something to filter by, skipping over images and non-filterable content.
          if (str !== '') {
            // Apply the non-prefix class to LIs that have prefixed content in them
            if (hasPrefixes) {
              var prefixes = $.map(opts.prefixes, function(value) {
                return value.indexOf(' ') <= 0 ? value + ' ' : value;
              });
              var matches = $.grep(prefixes, function(value) {
                return str.indexOf(value) === 0;
              });
              if (matches.length > 0) {
                var afterMatch = str.toLowerCase().split(matches[0])[1];

                if(afterMatch !== null) {
                  firstChar = $.trim(afterMatch).charAt(0);
                } else {
                  firstChar = str.charAt(0);
                }
                addLetterClass(firstChar, $this, true);
                return;
              }
            }
            // Find the first letter in the LI, including prefixes
            firstChar = str.charAt(0);
            
            
            /* Modified (added) this */
            // Try to replace the letter if it's not included in our letter navigation
            if (letters.indexOf(firstChar) === -1 && opts.defaultLetterMapping[firstChar]) {
              firstChar = opts.defaultLetterMapping[firstChar];
            }
            /* End modification */

            // Doesn't send true to function, which will ++ the All count on prefixed items
            addLetterClass(firstChar, $this);
          }
        });
      }
      

      // Add the appropriate letter class to the current element
      function addLetterClass(firstChar, $el, isPrefix) {
		 /* Modified this part so that it is possible to include Finnish/Swedish alphabets.
		 
		 Original: 
		  
        if ( /\W/.test(firstChar) ) {
          firstChar = '-'; // not A-Z, a-z or 0-9, so considered "other"
        }
			  
		 New: 
		 
			 -
			 
		 */

        if ( !isNaN(firstChar) ) {
          firstChar = '_'; // use '_' if the first char is a number
        }

        $el.addClass('ln-' + firstChar);

        if ( counts[firstChar] === undefined ) {
          counts[firstChar] = 0;
        }

        counts[firstChar]++;

        if (!isPrefix) {
          allCount++;
        }
      }

      function addDisabledClass() {
        for ( var i = 0; i < letters.length; i++ ) {
          if ( counts[letters[i]] === undefined ) {
            $('.' + letters[i], $letters).addClass('ln-disabled');
          }
        }
      }

      function addNoMatchLI() {
        $list.append('<li class="ln-no-match listNavHide">' + opts.noMatchText + '</li>');
      }

      function getLetterCount(el) {
        if ($(el).hasClass('all')) {
          if (opts.dontCount) {
            fullCount = allCount - $list.find(opts.dontCount).length;
          } else {
            fullCount = allCount;
          }

          return fullCount;
        } else {
          el = '.ln-' + $(el).attr('class').split(' ')[0];

          if (opts.dontCount) {
            count = $list.find(el).not(opts.dontCount).length;
          } else {
            count = $list.find(el).length;
          }

          return (count !== undefined) ? count : 0; // some letters may not have a count in the hash
        }
      }

      function bindHandlers() {
        if (opts.showCounts) {
          // sets the top position of the count div in case something above it on the page has resized
          $wrapper.mouseover(function () {
            setLetterCountTop();
          });

          //shows the count above the letter
          //
          $('.ln-letters a', $wrapper).mouseover(function () {
            left = $(this).position().left;
            width = ($(this).outerWidth()) + 'px';
            count = getLetterCount(this);

            $letterCount.css({
              left: left,
              width: width
            }).text(count).addClass("letterCountShow").removeClass("listNavHide"); // set left position and width of letter count, set count text and show it
          }).mouseout(function () { // mouseout for each letter: hide the count
            $letterCount.addClass("listNavHide").removeClass("letterCountShow");
          });
        }

        // click handler for letters: shows/hides relevant LI's
        //
        $('a', $letters).bind(clickEventType, function (e) {
          e.preventDefault();
          var $this = $(this),
            letter = $this.attr('class').split(' ')[0],
            noMatches = $list.children('.ln-no-match');

          if ( prevLetter !== letter ) {
          // Only to run this once for each click, won't double up if they clicked the same letter
          // Won't hinder firstRun
            $('a.ln-selected', $letters).removeClass('ln-selected');

            if ( letter === 'all' ) {
              // If ALL button is clicked:
              $list.children().addClass("listNavShow").removeClass("listNavHide"); // Show ALL

              noMatches.addClass("listNavHide").removeClass("listNavShow"); // Hide the list item for no matches

              isAll = true; // set this to quickly check later
            } else {
              // If you didn't click ALL
              if ( isAll ) {
                // since you clicked ALL last time:
                $list.children().addClass("listNavHide").removeClass("listNavShow");

                isAll = false;
              } else if (prevLetter !== '') {
                $list.children('.ln-' + prevLetter).addClass("listNavHide").removeClass("listNavShow");
              }

              var count = getLetterCount(this);

              if (count > 0) {
                $list.children('.ln-' + letter).addClass("listNavShow").removeClass("listNavHide");
                noMatches.addClass("listNavHide").removeClass("listNavShow"); // in case it's showing
              } else {
                noMatches.addClass("listNavShow").removeClass("listNavHide");
              }
            }

            prevLetter = letter;

            if ($.cookie && (opts.cookieName !== null)) {
              $.cookie(opts.cookieName, letter, {
                expires: 999
              });
            }

            $this.addClass('ln-selected');

            $this.blur();

            if (!firstClick && (opts.onClick !== null)) {
              opts.onClick(letter);
            } else {
              firstClick = false; //return false;
            }
          } // end if prevLetter !== letter
        }); // end click()
      } // end BindHandlers()

      // creates the HTML for the letter links
      //
      function createLettersHtml() {
        var html = [];
        for (var i = 1; i < letters.length; i++) {
          if (html.length === 0) {
            html.push('<a class="all" href="#">'+ opts.allText + '</a><a class="_" href="#">0-9</a>');
          }
          html.push('<a class="' + letters[i] + '" href="#">' + ((letters[i] === '-') ? '...' : letters[i].toUpperCase()) + '</a>');
        }
        return '<div class="ln-letters">' + html.join('') + '</div>' + ((opts.showCounts) ? '<div class="ln-letter-count listNavHide">0</div>' : '');
        // Remove inline styles, replace with css class
        // Element will be repositioned when made visible
      }
      init();
    });
  };

  $.fn.listnav.defaults = {
    initLetter: '',
    includeAll: true,
    allText: 'All',
    includeOther: false,
    includeNums: true,
    flagDisabled: true,
    removeDisabled: false,
    noMatchText: 'No matching entries',
    showCounts: true,
    dontCount: '',
    cookieName: null,
    onClick: null,
    prefixes: [],
    filterSelector: '',
    // Modified (added) the following
    defaultLetterMapping: {
      "á":"a",
      "ă":"a",
      "ắ":"a",
      "ặ":"a",
      "ằ":"a",
      "ẳ":"a",
      "ẵ":"a",
      "ǎ":"a",
      "â":"a",
      "ấ":"a",
      "ậ":"a",
      "ầ":"a",
      "ẩ":"a",
      "ẫ":"a",
      "ä":"a",
      "ǟ":"a",
      "ȧ":"a",
      "ǡ":"a",
      "ạ":"a",
      "ȁ":"a",
      "à":"a",
      "ả":"a",
      "ȃ":"a",
      "ā":"a",
      "ą":"a",
      "ᶏ":"a",
      "ẚ":"a",
      "å":"a",
      "ǻ":"a",
      "ḁ":"a",
      "ⱥ":"a",
      "ã":"a",
      "ꜳ":"a",
      "æ":"a",
      "ǽ":"a",
      "ǣ":"a",
      "ꜵ":"a",
      "ꜷ":"a",
      "ꜹ":"a",
      "ꜻ":"a",
      "ꜽ":"a",
      "ḃ":"b",
      "ḅ":"b",
      "ɓ":"b",
      "ḇ":"b",
      "ᵬ":"b",
      "ᶀ":"b",
      "ƀ":"b",
      "ƃ":"b",
      "ɵ":"o",
      "ć":"c",
      "č":"c",
      "ç":"c",
      "ḉ":"c",
      "ĉ":"c",
      "ɕ":"c",
      "ċ":"c",
      "ƈ":"c",
      "ȼ":"c",
      "ď":"d",
      "ḑ":"d",
      "ḓ":"d",
      "ȡ":"d",
      "ḋ":"d",
      "ḍ":"d",
      "ɗ":"d",
      "ᶑ":"d",
      "ḏ":"d",
      "ᵭ":"d",
      "ᶁ":"d",
      "đ":"d",
      "ɖ":"d",
      "ƌ":"d",
      "ı":"i",
      "ȷ":"j",
      "ɟ":"j",
      "ʄ":"j",
      "ǳ":"d",
      "ǆ":"d",
      "é":"e",
      "ĕ":"e",
      "ě":"e",
      "ȩ":"e",
      "ḝ":"e",
      "ê":"e",
      "ế":"e",
      "ệ":"e",
      "ề":"e",
      "ể":"e",
      "ễ":"e",
      "ḙ":"e",
      "ë":"e",
      "ė":"e",
      "ẹ":"e",
      "ȅ":"e",
      "è":"e",
      "ẻ":"e",
      "ȇ":"e",
      "ē":"e",
      "ḗ":"e",
      "ḕ":"e",
      "ⱸ":"e",
      "ę":"e",
      "ᶒ":"e",
      "ɇ":"e",
      "ẽ":"e",
      "ḛ":"e",
      "ꝫ":"e",
      "ḟ":"f",
      "ƒ":"f",
      "ᵮ":"f",
      "ᶂ":"f",
      "ǵ":"g",
      "ğ":"g",
      "ǧ":"g",
      "ģ":"g",
      "ĝ":"g",
      "ġ":"g",
      "ɠ":"g",
      "ḡ":"g",
      "ᶃ":"g",
      "ǥ":"g",
      "ḫ":"h",
      "ȟ":"h",
      "ḩ":"h",
      "ĥ":"h",
      "ⱨ":"h",
      "ḧ":"h",
      "ḣ":"h",
      "ḥ":"h",
      "ɦ":"h",
      "ẖ":"h",
      "ħ":"h",
      "ƕ":"h",
      "í":"i",
      "ĭ":"i",
      "ǐ":"i",
      "î":"i",
      "ï":"i",
      "ḯ":"i",
      "ị":"i",
      "ȉ":"i",
      "ì":"i",
      "ỉ":"i",
      "ȋ":"i",
      "ī":"i",
      "į":"i",
      "ᶖ":"i",
      "ɨ":"i",
      "ĩ":"i",
      "ḭ":"i",
      "ꝺ":"d",
      "ꝼ":"f",
      "ᵹ":"g",
      "ꞃ":"r",
      "ꞅ":"s",
      "ꞇ":"t",
      "ꝭ":"i",
      "ǰ":"j",
      "ĵ":"j",
      "ʝ":"j",
      "ɉ":"j",
      "ḱ":"k",
      "ǩ":"k",
      "ķ":"k",
      "ⱪ":"k",
      "ꝃ":"k",
      "ḳ":"k",
      "ƙ":"k",
      "ḵ":"k",
      "ᶄ":"k",
      "ꝁ":"k",
      "ꝅ":"k",
      "ĺ":"l",
      "ƚ":"l",
      "ɬ":"l",
      "ľ":"l",
      "ļ":"l",
      "ḽ":"l",
      "ȴ":"l",
      "ḷ":"l",
      "ḹ":"l",
      "ⱡ":"l",
      "ꝉ":"l",
      "ḻ":"l",
      "ŀ":"l",
      "ɫ":"l",
      "ᶅ":"l",
      "ɭ":"l",
      "ł":"l",
      "ǉ":"l",
      "ſ":"s",
      "ẜ":"s",
      "ẛ":"s",
      "ẝ":"s",
      "ḿ":"m",
      "ṁ":"m",
      "ṃ":"m",
      "ɱ":"m",
      "ᵯ":"m",
      "ᶆ":"m",
      "ń":"n",
      "ň":"n",
      "ņ":"n",
      "ṋ":"n",
      "ȵ":"n",
      "ṅ":"n",
      "ṇ":"n",
      "ǹ":"n",
      "ɲ":"n",
      "ṉ":"n",
      "ƞ":"n",
      "ᵰ":"n",
      "ᶇ":"n",
      "ɳ":"n",
      "ñ":"n",
      "ǌ":"n",
      "ó":"o",
      "ŏ":"o",
      "ǒ":"o",
      "ô":"o",
      "ố":"o",
      "ộ":"o",
      "ồ":"o",
      "ổ":"o",
      "ỗ":"o",
      "ö":"o",
      "ȫ":"o",
      "ȯ":"o",
      "ȱ":"o",
      "ọ":"o",
      "ő":"o",
      "ȍ":"o",
      "ò":"o",
      "ỏ":"o",
      "ơ":"o",
      "ớ":"o",
      "ợ":"o",
      "ờ":"o",
      "ở":"o",
      "ỡ":"o",
      "ȏ":"o",
      "ꝋ":"o",
      "ꝍ":"o",
      "ⱺ":"o",
      "ō":"o",
      "ṓ":"o",
      "ṑ":"o",
      "ǫ":"o",
      "ǭ":"o",
      "ø":"o",
      "ǿ":"o",
      "õ":"o",
      "ṍ":"o",
      "ṏ":"o",
      "ȭ":"o",
      "ƣ":"o",
      "ꝏ":"o",
      "ɛ":"e",
      "ᶓ":"e",
      "ɔ":"o",
      "ᶗ":"o",
      "ȣ":"o",
      "ṕ":"p",
      "ṗ":"p",
      "ꝓ":"p",
      "ƥ":"p",
      "ᵱ":"p",
      "ᶈ":"p",
      "ꝕ":"p",
      "ᵽ":"p",
      "ꝑ":"p",
      "ꝙ":"q",
      "ʠ":"q",
      "ɋ":"q",
      "ꝗ":"q",
      "ŕ":"r",
      "ř":"r",
      "ŗ":"r",
      "ṙ":"r",
      "ṛ":"r",
      "ṝ":"r",
      "ȑ":"r",
      "ɾ":"r",
      "ᵳ":"r",
      "ȓ":"r",
      "ṟ":"r",
      "ɼ":"r",
      "ᵲ":"r",
      "ᶉ":"r",
      "ɍ":"r",
      "ɽ":"r",
      "ↄ":"c",
      "ꜿ":"c",
      "ɘ":"e",
      "ɿ":"r",
      "ś":"s",
      "ṥ":"s",
      "š":"s",
      "ṧ":"s",
      "ş":"s",
      "ŝ":"s",
      "ș":"s",
      "ṡ":"s",
      "ṣ":"s",
      "ṩ":"s",
      "ʂ":"s",
      "ᵴ":"s",
      "ᶊ":"s",
      "ȿ":"s",
      "ɡ":"g",
      "ᴑ":"o",
      "ᴓ":"o",
      "ᴝ":"u",
      "ť":"t",
      "ţ":"t",
      "ṱ":"t",
      "ț":"t",
      "ȶ":"t",
      "ẗ":"t",
      "ⱦ":"t",
      "ṫ":"t",
      "ṭ":"t",
      "ƭ":"t",
      "ṯ":"t",
      "ᵵ":"t",
      "ƫ":"t",
      "ʈ":"t",
      "ŧ":"t",
      "ᵺ":"t",
      "ɐ":"a",
      "ᴂ":"a",
      "ǝ":"e",
      "ᵷ":"g",
      "ɥ":"h",
      "ʮ":"h",
      "ʯ":"h",
      "ᴉ":"i",
      "ʞ":"k",
      "ꞁ":"l",
      "ɯ":"m",
      "ɰ":"m",
      "ᴔ":"o",
      "ɹ":"r",
      "ɻ":"r",
      "ɺ":"r",
      "ⱹ":"r",
      "ʇ":"t",
      "ʌ":"v",
      "ʍ":"w",
      "ʎ":"y",
      "ꜩ":"t",
      "ú":"u",
      "ŭ":"u",
      "ǔ":"u",
      "û":"u",
      "ṷ":"u",
      "ü":"u",
      "ǘ":"u",
      "ǚ":"u",
      "ǜ":"u",
      "ǖ":"u",
      "ṳ":"u",
      "ụ":"u",
      "ű":"u",
      "ȕ":"u",
      "ù":"u",
      "ủ":"u",
      "ư":"u",
      "ứ":"u",
      "ự":"u",
      "ừ":"u",
      "ử":"u",
      "ữ":"u",
      "ȗ":"u",
      "ū":"u",
      "ṻ":"u",
      "ų":"u",
      "ᶙ":"u",
      "ů":"u",
      "ũ":"u",
      "ṹ":"u",
      "ṵ":"u",
      "ᵫ":"u",
      "ꝸ":"u",
      "ⱴ":"v",
      "ꝟ":"v",
      "ṿ":"v",
      "ʋ":"v",
      "ᶌ":"v",
      "ⱱ":"v",
      "ṽ":"v",
      "ꝡ":"v",
      "ẃ":"w",
      "ŵ":"w",
      "ẅ":"w",
      "ẇ":"w",
      "ẉ":"w",
      "ẁ":"w",
      "ⱳ":"w",
      "ẘ":"w",
      "ẍ":"x",
      "ẋ":"x",
      "ᶍ":"x",
      "ý":"y",
      "ŷ":"y",
      "ÿ":"y",
      "ẏ":"y",
      "ỵ":"y",
      "ỳ":"y",
      "ƴ":"y",
      "ỷ":"y",
      "ỿ":"y",
      "ȳ":"y",
      "ẙ":"y",
      "ɏ":"y",
      "ỹ":"y",
      "ź":"z",
      "ž":"z",
      "ẑ":"z",
      "ʑ":"z",
      "ⱬ":"z",
      "ż":"z",
      "ẓ":"z",
      "ȥ":"z",
      "ẕ":"z",
      "ᵶ":"z",
      "ᶎ":"z",
      "ʐ":"z",
      "ƶ":"z",
      "ɀ":"z",
      "ﬀ":"f",
      "ﬃ":"f",
      "ﬄ":"f",
      "ﬁ":"f",
      "ﬂ":"f",
      "ĳ":"i",
      "œ":"o",
      "ﬆ":"s",
      "ₐ":"a",
      "ₑ":"e",
      "ᵢ":"i",
      "ⱼ":"j",
      "ₒ":"o",
      "ᵣ":"r",
      "ᵤ":"u",
      "ᵥ":"v",
      "ₓ":"x"
    }
  };
  

})(jQuery);
