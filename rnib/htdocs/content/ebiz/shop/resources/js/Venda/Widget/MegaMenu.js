/**
* @fileoverview Venda.Widget.Megamenu
 * Megamenu.js provides the functionality required to generate Static and Dynamic menus for the tp navigation
 * Documentation: https://vendadocs.onconfluence.com/x/1YFH
 *
 * @author Juanjo Dominguez <juanjodominguez@venda.com>
*/

//create namespace for MegaMenu
Venda.namespace('Widget.MegaMenu');

Venda.Widget.MegaMenu.mmContainerWidth = function () {
    /* by default it calculates the width for the container UL */
    var newWidth = 0;
    /* edit this value if the right edge is not the container UL's */
    var maxUlWidth = 0;
    if (newWidth > 0) {
        maxUlWidth = newWidth;
    } else {
        maxUlWidth = parseFloat(jQuery("ul#mm_ul").width());
    }
    return maxUlWidth;
};

Venda.Widget.MegaMenu.mmTouch = function (element) {
    var that = element;

    jQuery("ul#mm_ul li .js-mm-sub:visible").removeClass('js-mm-liselected').stop().fadeTo(50, 0, function () {
            jQuery(this).hide();
        });

    jQuery(".js-mm-liselected").removeClass('js-mm-liselected');

    jQuery(that).parent().toggleClass("js-mm-liselected");
	
	if (jQuery(that).parent().hasClass('js-mm-liselected')) {
		jQuery(this).attr('aria-hidden', 'false');	
	} else {
		jQuery(this).attr('aria-hidden', 'true');
	}

    var checkWidthClass = 0;

    if (jQuery(that).parent().find(".js-mm-row").length > 0) {
        var classListRow = jQuery(that).parent().find(".js-mm-sub").attr('class').split(/\s+/);
        jQuery.each(classListRow, function (index, item) {
                itemStr = item.substr((item.length - 6), 6);
                if (itemStr == '_width') {
                    checkWidthClass = parseInt(item);
                }
            });
    } else {
        if (jQuery(that).parent().find(".js-mm-sub").length > 0) {
            var classListSub = jQuery(that).parent().find(".js-mm-sub").attr('class').split(/\s+/);
            jQuery.each(classListSub, function (index, item) {
                    itemStr = item.substr((item.length - 6), 6);
                    if (itemStr == '_width') {
                        checkWidthClass = parseInt(item);
                    }
                });
        }
    }


     if (jQuery(that).parent().find(".js-mm-sub").length > 0) {
        if (jQuery(that).parent().find(".js-mm-sub ul").length > 1) {
            rowWidth = '100%';

        } else {
            rowWidth = jQuery(that).parent().find(".js-mm-sub ").outerWidth();
            offset = jQuery(that).position();
            if ((offset.left +rowWidth) > (Venda.Widget.MegaMenu.mmContainerWidth())) {
                jQuery(that).next(".js-mm-sub ").addClass("js-mm-left");
            }
        }

         jQuery(that).next(".js-mm-sub").css({
            // use this if you want a fixed pixel width on the subnav, but it doesn't work well with responsive and best dealt with in the CSS
            //'width' : rowWidth
        });
        jQuery(that).parent().find(".js-mm-sub").stop().fadeTo(50, 1).show();
     }

     jQuery('.wrapper').not('.mm_ul').on('click',function(){
            jQuery(that).parent().removeClass("js-mm-liselected");
             jQuery(that).parent().find(".js-mm-sub").hide();
    });

    /* do not show if there is no sub category */
    if (jQuery(that).parent().find(".js-mm-sub li").length == 0) {
        jQuery(".js-mm-sub").removeClass('js-mm-liselected').stop().fadeTo(50, 0, function () {
                //jQuery(that).parent().hide();
            });
    }

};

Venda.Widget.MegaMenu.mmHover = function () {
    jQuery("ul#mm_ul li .js-mm-sub:visible").removeClass('js-mm-liselected').stop().fadeTo(50, 0, function () {
            jQuery(this).hide();
        });
    jQuery(this).toggleClass("js-mm-liselected");
	
	if (jQuery(this).hasClass('js-mm-liselected')) {
		jQuery(this).children('.js-mm-sub').attr('aria-hidden', 'false');
		jQuery(this).find('.js-mm-sub ul li a').each(function() { 
			jQuery(this).attr('tabindex', '0');	
		});
	} else {
		jQuery(this).children('.js-mm-sub').attr('aria-hidden', 'true');
		jQuery(this).find('.js-mm-sub ul li a').each(function() { 
			jQuery(this).attr('tabindex', '-1');	
		});
	}

    var checkWidthClass = 0;

    if (jQuery(this).find(".js-mm-row").length > 0) {
        var classListRow = jQuery(this).find(".js-mm-sub").attr('class').split(/\s+/);
        jQuery.each(classListRow, function (index, item) {
                itemStr = item.substr((item.length - 6), 6);
                if (itemStr == '_width') {
                    checkWidthClass = parseInt(item);
                }
            });
    } else {
        if (jQuery(this).find(".js-mm-sub").length > 0) {
            var classListSub = jQuery(this).find(".js-mm-sub").attr('class').split(/\s+/);
            jQuery.each(classListSub, function (index, item) {
                    itemStr = item.substr((item.length - 6), 6);
                    if (itemStr == '_width') {
                        checkWidthClass = parseInt(item);
                    }
                });
        }
    }


 if (jQuery(this).find(".js-mm-sub").length > 0) {
    if (jQuery(this).find(".js-mm-sub ul").length > 1) {
        rowWidth = '100%';

    } else {
        rowWidth = jQuery(this).find(".js-mm-sub ").outerWidth();
        offset = jQuery(this).position();
        if ((offset.left +rowWidth) > (Venda.Widget.MegaMenu.mmContainerWidth())) {
            jQuery(this).find(".js-mm-sub ").addClass("js-mm-left");
        }
    }

    jQuery(this).find(".js-mm-sub").css({
        // use this if you want a fixed pixel width on the subnav, but it doesn't work well with responsive and best dealt with in the CSS
        //'width' : rowWidth
    });
    jQuery(this).find(".js-mm-sub").stop().fadeTo(50, 1).show();
 }

    if (jQuery.browser.msie && /6.0/.test(navigator.userAgent)) {
        if (jQuery(this).find(".js-mm-sub").length > 0) {
            var src = 'javascript:false;';
            var height = jQuery(this).find(".js-mm-sub").outerHeight();
            var width = jQuery(this).find(".js-mm-sub").outerWidth();
            var offset = jQuery(this).find(".js-mm-sub").position();

            html = '<iframe class="js-popup-iframe" src="' + src + '" style="-moz-opacity: .10;filter: alpha(opacity=1);height:' + height + 'px;width:' + width + 'px;"></iframe>';
            if (jQuery(this).find('.js-popup-iframe').length == 0) {
                jQuery(this).prepend(html);
            }
            jQuery(this).find('.js-popup-iframe').css({
                    "height" : height,
                    "width" : width
                });
            jQuery(this).find('.js-popup-iframe').css({
                    "right" : offset.right,
                    "left" : offset.left
                });
            jQuery(this).find('.js-popup-iframe').css({
                    "top" : offset.top
                });
        }
    }
    /* do not show if there is no sub category */
    if (jQuery(this).find(".js-mm-sub li").length == 0) {
            jQuery(".js-mm-sub").removeClass('js-mm-liselected').stop().fadeTo(50, 0, function () {
               // jQuery(this).hide();
            });
    }
};

Venda.Widget.MegaMenu.mmOut = function () {
    jQuery(this).toggleClass("js-mm-liselected");
	
	if (jQuery(this).hasClass('js-mm-liselected')) {
		jQuery(this).children('.js-mm-sub').attr('aria-hidden', 'false');
		jQuery(this).find('.js-mm-sub ul li a').each(function() { 
			jQuery(this).attr('tabindex', '0');	
		});
	} else {
		jQuery(this).children('.js-mm-sub').attr('aria-hidden', 'true');
		jQuery(this).find('.js-mm-sub ul li a').each(function() { 
			jQuery(this).attr('tabindex', '-1');	
		});
	}
	
    jQuery(this).find(".js-mm-sub").stop().fadeTo(100, 0, function () {
            jQuery(this).hide();
        });
    if (jQuery.browser.msie && /6.0/.test(navigator.userAgent)) {
        if (jQuery('.js-popup-iframe').length > 0) {
            jQuery(this).find('.js-popup-iframe').css({
                    "height" : "0"
                });
        }
    }
};

var config = {
    sensitivity : 20,
    /* number = sensitivity threshold (must be 1 or higher) */
    interval : 200,
    /* number = milliseconds for onMouseOver polling interval */
    over : Venda.Widget.MegaMenu.mmHover,
    /* function = onMouseOver callback (REQUIRED) */
    timeout : 200,
    /* number = milliseconds delay before onMouseOut */
    out : Venda.Widget.MegaMenu.mmOut/* function = onMouseOut callback (REQUIRED) */
};

Venda.Widget.MegaMenu.switched   = true;
Venda.Widget.MegaMenu.scrWidth = 998;

Venda.Widget.MegaMenu.switchMenu  = function() {
    if (jQuery('#nav-header').is(':visible') && !Venda.Widget.MegaMenu.switched  ){
        //mobile screen
        Venda.Widget.MegaMenu.switched = true;
        Venda.Widget.MegaMenu.toggleMenu();
    }   else if (jQuery('#nav-header').is(':hidden') && Venda.Widget.MegaMenu.switched  ){
            Venda.Widget.MegaMenu.switched = false;
        Venda.Widget.MegaMenu.hoverMenu();
    }
};


jQuery(window).on({
     load:function(){
        if (jQuery('#nav-header').is(':visible')){
            Venda.Widget.MegaMenu.switched   = false;
        }
        Venda.Widget.MegaMenu.switchMenu();
     },
     resize:function(){
        Venda.Widget.MegaMenu.switchMenu();
     }
});


Venda.Widget.MegaMenu.toggleMenu = function(){
        jQuery("ul#mm_ul li").off();
        jQuery('ul#mm_ul .js-mm_icat').off();
        jQuery('ul#mm_ul').addClass('js-mobile_ul');

        jQuery('ul#mm_ul .js-mm_icat').on("click",function(e){
            e.preventDefault();
            if(jQuery(this).next(".js-mm-sub").hasClass("is-open")){
                jQuery(this).next('.js-mm-sub').removeAttr('style');
                jQuery(this).next('.js-mm-sub').removeClass('is-open');
				jQuery(this).next('.js-mm-sub').attr('aria-hidden', 'true');
				jQuery(this).next('.js-mm-sub').find('a').each(function() { 
					jQuery(this).attr('tabindex', '-1');	
				});
            }else{
                jQuery('.js-mm-sub').removeAttr('style');
                jQuery('.js-mm-sub').removeClass('is-open');
                jQuery(this).next('.js-mm-sub').css({'display': 'inherit' ,'opacity' : '1' });
                jQuery(this).next('.js-mm-sub').addClass('is-open');
				jQuery(this).next('.js-mm-sub').attr('aria-hidden', 'false');
				jQuery(this).next('.js-mm-sub').find('a').each(function() {
					jQuery(this).attr('tabindex', '0');	
				});
                jQuery('html, body').animate({ scrollTop: jQuery(this).offset().top }, 800);
				
            }
        });

};

Venda.Widget.MegaMenu.hoverMenu = function(){
        jQuery('ul#mm_ul').removeAttr('style');
        jQuery('ul#mm_ul').find('.js-mm-sub').hide();
        if (Modernizr.touch) {
            var $navLinksWithChildren = jQuery("ul#mm_ul > li > a").next('.js-mm-sub').prev('a');
            $navLinksWithChildren.bind({
                click: function(e) {
                    e.preventDefault();return false;},
                touchstart: function(e) {
                    e.preventDefault();return false;},
                touchend: function(e) {
                    if (jQuery(this).parent().hasClass('js-mm-liselected')) {
                        window.location = jQuery(this).attr("href");
                    }
                    else {
                        e.preventDefault();
                        Venda.Widget.MegaMenu.mmTouch(this);return false;
                    }
                },
                touchmove: function(e) {
                    e.preventDefault();return false;},
                touchcancel: function(e) {
                    e.preventDefault();return false;}
            });
        }
        else {
            jQuery('ul#mm_ul .js-mm_icat').off('click');
        jQuery("ul#mm_ul > li").mouseenter(Venda.Widget.MegaMenu.mmHover);
        jQuery("ul#mm_ul > li").mouseleave(Venda.Widget.MegaMenu.mmOut);

            jQuery("ul#mm_ul li .js-mm-sub:visible").removeClass('js-mm-liselected').stop().fadeTo(50, 0, function () {
                    jQuery(this).hide();
            });

        jQuery("ul#mm_ul li a").focus(function (e) {
            jQuery(this).parent().trigger("mouseover");
        });
        jQuery("ul#mm_ul li a").focusout(function (e) {
            jQuery(this).parent().trigger("mouseout");
        });

        }
};