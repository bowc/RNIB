/**
* @fileoverview Venda.Widget.handleCloudzoom
 * This script provides us with the ability to enable/disable Cloudzoom functionality based on screen size
 * Documentation: https://docs.venda.com/x/AQBWB
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 * @edited Issawararat Chumchinda (Bow) <bowc@venda.com>
*/

Venda.namespace('Widget.handleCloudzoom');

Venda.Widget.handleCloudzoom.switched = true;
Venda.Widget.handleCloudzoom.setCloudzoom = function() {
    if ((jQuery('.js-quickbuyDetails').length > 0) || (Modernizr.mq('only screen and (max-width: 767px)') && !Venda.Widget.handleCloudzoom.switched)) {
        // Disable cloudzoom on a small screen and Quickbuy function
        Venda.Widget.handleCloudzoom.switched = true;
        if(jQuery('.cloudzoom').hasClass('activeZoom')){
            jQuery('.cloudzoom').data('CloudZoom').destroy();
            jQuery('.cloudzoom').removeClass('activeZoom');
        }
        jQuery(swipeEvent);
    } else if (Venda.Widget.handleCloudzoom.switched && Modernizr.mq('only screen and (min-width: 768px)')) {
        // Enable cloudzoom on a large screen
        Venda.Widget.handleCloudzoom.switched = false;
        if(Venda.Attributes.howManyLargeImgs > 0) {
            jQuery('.cloudzoom').addClass('activeZoom');
            jQuery('.js-productdetail-swipe').hide();
            var options = {
                zoomSizeMode: 'image',
                zoomPosition: 3,
                variableMagnification: false,
                disableZoom: 'auto',
                zoomFlyOut: false
            };

            jQuery('.cloudzoom, .cloudzoom-gallery').CloudZoom(options);
            jQuery('#productdetail-image').bind('cloudzoom_ready',function(){
                jQuery(this).css('min-height', jQuery('#productdetail-image img').height());
            });
        }
    }
};

Venda.Widget.handleCloudzoom.ViewAlternativeImg = function(obj) {
    jQuery('#productdetail-altview').find('a').on('click', function(event) {
        event.preventDefault();
        var strJSON = '{'+ jQuery(this).attr('data-cloudzoom') +'}';
        var objJSON = eval("(function(){return " + strJSON + ";})()");
        jQuery(objJSON.useZoom).attr('src', objJSON.image);
        jQuery.each(jQuery('#productdetail-altview a'),function(){
            jQuery(this).removeClass('cloudzoom-gallery-active');
        });
        jQuery(this).addClass('cloudzoom-gallery-active');
    });
};
jQuery(window).load(function(){
	if(jQuery('html').hasClass('lt-ie9')) {
		var options = {zoomSizeMode: 'image',zoomPosition: 3,variableMagnification: false,disableZoom: 'auto',zoomFlyOut: false};	
		jQuery('.cloudzoom, .cloudzoom-gallery').CloudZoom(options);
	}
	
	jQuery('#productdetail-altview').jqSlider({isTouch: Modernizr.touch,sliderEnable: 1});
	Venda.Widget.handleCloudzoom.setCloudzoom();	
	jQuery(window).on('resize',function(){
	  Venda.Widget.handleCloudzoom.setCloudzoom();
	});
});
// Events
var swipeEvent = function(){
    var objAltview = jQuery('#productdetail-altview');
    var howManyAlt = parseInt(objAltview.find('a').length);
    var itemnum = (objAltview.find('a.cloudzoom-gallery-active').data('itemnum')) ? objAltview.find('a.cloudzoom-gallery-active').data('itemnum') : 0;

    if(howManyAlt <= 1){
        jQuery('.js-productdetail-swipe').hide();
        return false;
    } else {
        jQuery('.js-productdetail-swipe').fadeIn();
        setTimeout('jQuery(".swipetext").fadeOut();',7000);
        Venda.Widget.handleCloudzoom.ViewAlternativeImg();
        var current = itemnum;
        jQuery('.js-productdetail-swipe').swipe({
            allowPageScroll: 'auto',
            swipe: function(event, direction, distance, duration, fingerCount) {
                jQuery('.swipetext').fadeOut();
                switch(direction){
                    case "left":
                        ++current;
                        current = (current >= howManyAlt) ? 0 : current;
                        itemnum = current;
                        objAltview.find('a').eq(current).trigger('click');
                        return false;
                    break;

                    case "right":
                        --current;
                        current = (current < 0) ? howManyAlt-1 : current;
                        itemnum = current;
                        objAltview.find('a').eq(current).trigger('click');
                        return false;
                    break;
                }
            }
        });
    }
};