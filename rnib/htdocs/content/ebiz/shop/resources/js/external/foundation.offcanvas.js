/*global console: true */
/*global jQuery: false */
/*jslint browser: true */
/*jslint white: true */

/**
 * Foundation off-canvas script
 * From their example code, not the Foundation 4 core.
 * ---------
 * REVISIONS
 * ---------
 * 100813 - AJW - Modified the code to allow it to be run when a search is updated.
 *                Also: refactored the code to make it more DOM efficient, and linted.
 * Legacy - Foundation
 * -----
 * EXPOSES:
 * -----
 * WINDOW: initOffcanvas.
 */
;(function (window, document, $) {
  "use strict";

  var initOffcanvas = function() {

    var $selector1, $selector2, $selector3, $selector4, events, docWidth1, $docWidth2;

    // Set the negative margin on the top menu for slide-menu pages
    $selector1 = $('#topMenu');
    events = 'click.fndtn';
    docWidth1 = document.documentElement.clientWidth;
    // only hide the nav if viewport is tablet portrait or smaller
    if ($selector1.length > 0 && docWidth1 < 768) {
      $selector1.css("margin-top", $selector1.height() * -1);
    }

    // Watch for clicks to show the sidebar
    $selector2 = $('.js-sidebarButton');
    if ($selector2.length > 0) {
      $('.js-sidebarButton').on(events, function (e) {
        e.preventDefault();
        $('body').toggleClass('js-offcanvas');
      });
    }

    // Watch for clicks to show the menu for slide-menu pages
    $selector3 = $('#menuButton');
    if ($selector3.length > 0)  {
      $('#menuButton').on(events, function (e) {
        e.preventDefault();
        $('body').toggleClass('js-offcanvas-menu');
      });
    }

    // Adjust sidebars and sizes when resized
    $(window).resize(function() {
      if (!navigator.userAgent.match(/Android/i)) {
        $('body').removeClass('js-offcanvas'); //not sure what this does yet
      }
      $selector4 = $('#topMenu');
      //if ($selector4.length > 0) $selector4.css("margin-top", $selector4.height() * -1);
      $docWidth2 = document.documentElement.clientWidth;
      // show the nav if the screen size is desktop or larger
      if ($selector4.length > 0 && $docWidth2 > 767) {
        $selector4.css("margin-top", "0");
      } else {
        $selector4.css("margin-top", $selector4.height() * -1);
      }
    });

    /* Not sure what this does yet but its causing a JS error
      $('#nav li a').on(events, function (e) {
      e.preventDefault();
      var href = $(this).attr('href'),
        $target = $(href);
      $('html, body').animate({scrollTop : $target.offset().top}, 300);
    });*/

  };

  window.initOffcanvas = initOffcanvas;
  initOffcanvas();

}(this, document, jQuery));