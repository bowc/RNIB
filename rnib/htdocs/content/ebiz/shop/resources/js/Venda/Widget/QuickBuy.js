/**
 * @fileoverview Venda.Widget.QuickBuy
 *
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 */

//create QuickBuy namespace
Venda.namespace('Widget.QuickBuy');

Venda.Widget.QuickBuy.doSelectStyle = '';
jQuery(document).on("click",".js-quicklink-box a", function(e) {
	/* variable are for sending a selected colour to quickBuy dialog */
	var reg = new RegExp('[?&]colour=([^&]+)');
	var attColour = (jQuery(this).attr("href").match(reg)) ? jQuery(this).attr("href").match(reg)[1] : "";
	var URL = jQuery(this).attr("href").replace(attColour, escape(attColour));
	var trackingProdAddUrl = jQuery(this).attr("href").split("&");
	//Venda.Widget.MinicartDetail.trackingProdAddUrl = trackingProdAddUrl[0];
	URL = Venda.Ebiz.doProtocal(URL);

	//using an existing modal div but different modal size
	jQuery("#vModal").addClass('large').removeClass('xlarge');
	jQuery("#vModal").foundation('reveal', 'open');
	jQuery("#vModal .js-modalContent").html('<div class="text-center"><i class="icon-spinner icon-spin icon-4x text-center"></i></div>');
	jQuery("#vModal .js-modalContent").load(URL, function(){
		jQuery('#productdetail-altview').jqSlider({isTouch: Modernizr.touch,sliderEnable: 1});
		Venda.Widget.QuickBuy.actionAftetShowPopup();
	});

	jQuery('#vModal').on('closed', function () {
		Venda.Attributes.ImageSwapReset();
		jQuery("#vModal").addClass('xlarge').removeClass('large');
	});

	return false;
});

Venda.Widget.QuickBuy.actionAftetShowPopup = function(){
	jQuery("[id^='js-submit']").bind('click', function(e) {
        e.preventDefault();
		Venda.mcd.checkMultipage('quickBuyDetails');
	});

	jQuery('#addproductform').on('keypress','#qty', function(e) {
		if (e.keyCode == 13) {
			jQuery('.js-addproduct').trigger('click');
			e.preventDefault();
		}
	});
};

/**
 * To show quickBuy/View functionality from a flash module
 * @param {string} 	invtref - A product ref which need to add to your basket
 * @param {string} 	invtname -  A product name that will be used for a title dialog
 * @param {string} 	template - 2 values can be "quickBuyFast" and "quickBuyDetails"
 * added by bowc@venda.com
 */
Venda.Widget.QuickBuy.addParam = function(invtref, invtname, template){
	var url = jQuery("#ebizurl").html()+"/invt/"+invtref+"&temp="+template+"&layout=noheaders";

	jQuery("#vModal .js-productContent").load(url, function(){
		jQuery("#vModal").foundation('reveal', 'open');
		Venda.Widget.QuickBuy.actionAftetShowPopup();
	});
	return false;
};