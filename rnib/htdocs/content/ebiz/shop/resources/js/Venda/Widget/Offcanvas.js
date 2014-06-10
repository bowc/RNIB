/**
 * An Off-canvas approach for small device
 * Account details and Minicart off-canvas style (left/right) when viewing the site on a small device
*/
jQuery(function() {
  jQuery(document).on('click', '#js-canvas-left, #js-canvas-content-left li:not(".js-recentorders-nav")', function () {
    jQuery('html').toggleClass("js-activeLeft");
    // to reset 'Recent Orders' content every time off-canvas-left is clicked
    jQuery('#js-recentorders-content').empty();
    jQuery('.js-recentorders a').removeClass('active');
    // to ensure screenreaders read the content of open off-canvas-left, and return focus to nav when closed. The hide/show jQuery is needed or else screenreaders don't recognise its content
    if(jQuery('html').hasClass('js-activeLeft')) {
      jQuery('#js-canvas-content-left')
        .hide()
        .show()
        .focus();
    } else {
      jQuery('#js-canvas-left').focus();
    }
  });

  jQuery(document).on('click', '#js-canvas-right, #minicartHeader', function (e) {
    e.preventDefault();
    jQuery('html').toggleClass("js-activeRight");
    if (!Venda.MinicartDetail.minicartLoaded) { Venda.MinicartDetail.loadMinicartHtml(); }
    // to ensure screenreaders read the content of open off-canvas-right, and return focus to nav when closed. The hide/show jQuery is needed or else screenreaders don't recognise its content
    if(jQuery('html').hasClass('js-activeRight')) {
      jQuery('#js-canvas-content-right')
        .hide()
        .show()
        .focus();
    } else {
      jQuery('#js-canvas-right').focus();
    }
  });

  // to load recent order
  jQuery('.js-recentorders-nav a').on('click', function(e) {
      e.preventDefault();
      var url = Venda.Ebiz.doProtocal(jQuery(this).attr('href'));

      jQuery(this).toggleClass('active');
      if(jQuery(this).hasClass('active')) {
          jQuery('#js-recentorders-content').show();
          jQuery('#js-recentorders-content').append('<div class="loading text-center"><i class="icon-spinner icon-spin icon-2x"></i></div>');
          jQuery('#js-recentorders-content').load(url, function() {
              if (status === 'error') {
                  var msg = 'Sorry but there was an error: ';
                  jQuery('#js-recentorders-content').html(msg + xhr.status + " " + xhr.statusText);
              }
          });
      } else {
          jQuery('#js-recentorders-content').empty();
          jQuery('#js-recentorders-content').hide();
      }
  });
});

jQuery(window).load(function () {
  jQuery(window).on('resize', function () {
    // ONLY do if screen size is equal/more than 768
    if (Modernizr.mq('only all and (min-width: 768px)')) {
    jQuery('html').removeClass("js-activeLeft js-activeRight");
    }
  });
});