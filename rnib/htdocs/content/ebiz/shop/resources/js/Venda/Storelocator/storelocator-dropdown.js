/**
* @fileoverview Venda.storeloc
 * Venda's storeloc storelocator: This functionlaity  is a fallback for Google API implementation.
 * There is a switch in the VCP to activate this 'NON GOOGLE STORE LOCATOR'
 *
 * @requires js/external/jquery-1.7.1.min.js
 * @author Alby Barber <abarber@venda.com>
*/

Venda.namespace('storeloc');
Venda.storeloc = function () {};

Venda.storeloc.stores;
Venda.storeloc.URL = window.location.href;

jQuery(function(){
	Venda.storeloc.createSelect();
	Venda.storeloc.ajaxPopulate('storelocator');
	//jQuery('#DTScontinue').hide();
})

/**
* Creates a blank select and loading image div to be populated via AJAX
* @param{string} that is the this passed from the chnaged select
* @author Alby Barber <abarber@venda.com>
**/
Venda.storeloc.createSelect = function(that) {

		jQuery(that).nextAll('.js-storeLocSelect').remove();

		if (that && that.value){
			jQuery('.js-storeLocSelectHolder').append('<select class="js-storeLocSelect"></select><div class="js-loadingimg"></div>');
		}
		else{
			jQuery('.js-storeLocSelectHolder').append('<select class="js-storeLocSelect"></select>');
		}

		jQuery('.js-storeLocSelectHolder select:last').hide();

}

/**
* Populates the created select with values supplied by the passed story id via AJAX
* @param{string} stryid is the id of the story category or story store
* @author Alby Barber <abarber@venda.com>
**/
Venda.storeloc.ajaxPopulate = function(stryid) {

	if (stryid != ""){
		jQuery.get( jQuery('#tag-ebizurl').text().replace('http:',window.location.protocol) + "/scat/" + stryid + "&temp=storesjsonDropdown&layout=blank", function(dataString) {
			var data = jQuery.parseJSON('[' + dataString + ']');

			var options = '<option value="">' + jQuery('#tag-selectaregion').text() + '</option>';

			if(data[0].StoreID){
				jQuery('.js-storeLocSelectHolder select:last').addClass('js-storeSelect');
				Venda.storeloc.stores = data;
				options = '<option value="">' + jQuery('#tag-selectastore').text() + '</option>';
			}

			for (var i = 0; i < data.length; i++) {
				options += '<option data-StoreID="' + data[i].StoreID + '" value="' + data[i].optionValue + '">' + data[i].optionDisplay + '</option>';
			}
			jQuery('.js-loadingimg').remove();
			jQuery('.js-storeLocSelectHolder select:last').html(options).show();
		});
	}
}

/**
* Populates the hidden form with the values from the selected store
* @param{string} that is the unique store id
* @author Alby Barber <abarber@venda.com>
**/
Venda.storeloc.fillForm = function(that){

	for (i=0;i<Venda.storeloc.stores.length;i++){

		if (Venda.storeloc.stores[i].StoreID == that){
			jQuery('input[name="num"]').val(Venda.storeloc.stores[i].StoreName).parent().find('span').html(Venda.storeloc.stores[i].StoreName);
			jQuery('input[name="addr1"]').val(Venda.storeloc.stores[i].Address).parent().find('span').html(Venda.storeloc.stores[i].Address);
			jQuery('input[name="addr2"]').val(Venda.storeloc.stores[i].Address2).parent().find('span').html(Venda.storeloc.stores[i].Address2);
			jQuery('input[name="city"]').val(Venda.storeloc.stores[i].City).parent().find('span').html(Venda.storeloc.stores[i].City);
			jQuery('input[name="cntry"]').val(Venda.storeloc.stores[i].Country).parent().find('span').html(Venda.storeloc.stores[i].Country);
			jQuery('input[name="zipc"]').val(Venda.storeloc.stores[i].PostCode).parent().find('span').html(Venda.storeloc.stores[i].PostCode);
			jQuery('input[name="state"]').val(Venda.storeloc.stores[i].State).parent().find('span').html(Venda.storeloc.stores[i].State);
			// This sets 2 hidden inputs that are used in conditions on the order summary screen
			jQuery('input[name="addrname"]').val(Venda.storeloc.stores[i].StoreName).parent().find('span').html(Venda.storeloc.stores[i].StoreName);
			//jQuery('input[name="fax"]').val(Venda.storeloc.stores[i].StoreID);

		}
	}

	jQuery("#DTSchangeStore, #dtsSubmit, #storedeliveryaddress").show();
}

/**
* EVENTS - General
**/
jQuery(document).on('change','.js-storeLocSelect:not(.js-storeSelect)', function() {
		Venda.storeloc.createSelect(this);
		Venda.storeloc.ajaxPopulate(this.value);
});

// Drop down select Store
jQuery(document).on('change', '.js-storeSelect', function(){
	jQuery('#loadingbar').addClass('js-active');

	var height = jQuery('#storelocator #storelookup').height();
	jQuery('#storelocator').css('height',height).addClass('js-loadingimg');
	jQuery('#storelocator #storelookup').animate({ opacity: 0, display: 'block' }, 1000 ).hide();

 	jQuery.get(this.value.replace('http:',window.location.protocol) + '&layout=blank', function(data) {

		jQuery('#storelocator').removeClass('js-loadingimg');
		jQuery('#storelocator').append('<div class="js-storeview">' + data + '<button class="button">'+ jQuery('#tag-back').text() +'</button></div>');
		jQuery('#storelocator .js-storeview').animate({ opacity: 1, display: 'block' }, 1000 );
		// Add the select store button
		jQuery('#dtsStorelocator').append('<div class="js-linkstore js-dtsfallback-linkstore"><a class="button" href="#">' + jQuery('#tag-selectthisstore').text() + '</a></div>').hide().fadeIn();
  	})
  return false
})
// Back button
jQuery(".js-storeview .button").live("click", function(){

	jQuery('#loadingbar').removeClass('js-active');
	jQuery('#storelocator .js-storeview').animate({ opacity: 0, display: 'block' }, 1000 ).hide();
	jQuery('#storelocator').addClass('js-loadingimg');
	jQuery('#storelocator #storelookup').show().animate({ opacity: 1, display: 'block' }, 1000 );
	jQuery('#storelocator').delay(3000).removeClass('js-loadingimg');
	jQuery('.js-storeLocSelectHolder select:last').val(''); // Reset the original dropdown
	jQuery('.js-dtsfallback-linkstore').remove(); // Remove the select store button

})



/**
* EVENTS - DTS
**/
// 'Select Store' Button
jQuery("#dtsStorelocator .js-linkstore a").live("click", function(e){

  	var StoreID = jQuery('.js-storeLocSelectHolder select:last option:selected').attr('data-StoreID');

	Venda.storeloc.fillForm(StoreID);

	jQuery(".js-dtsfallback-linkstore").remove(); // Remove the select store button

	// hide store locator DTS
	jQuery("#dtsStorelocator").fadeOut();

  e.preventDefault();
  return false
})

// DTS show store locator DTS
jQuery("#DTSchangeStore").live("click", function(){
	jQuery("#dtsStorelocator").fadeIn();
})
