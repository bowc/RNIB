/**
* @fileoverview Venda.Attributes
 * Venda's Attributes functionality incorporates a standardized way of interfacing Attribute Products with the front-end as to make
 * the modification and creation of selection methods easier.
 *
 * This is the halfswatch interface used to display a swatch for the first attribute and select dropdown boxes for each additional attribute
 *
 * The files below will be included dynamicly when required:
 * @requires js/Venda/Attributes/attributeAsset-Dropdown.js
 * @requires js/Venda/Attributes/attributeAsset-Swatch.js
 *
 * @author Alby Barber <abarber@venda.com>
 * @author Donatas Cereska <DonatasCereska@venda.com>
*/

Venda.Attributes.HalfSwatch = function () {

	jQuery(".js-oneProduct").each(function(index) {
		var uID = this.id.substr(11);
		Venda.Attributes.productArr[index] = new Venda.Attributes.GenerateOptionsJSON(index, uID);
		if(jQuery("#oneProduct_" + uID + " #attributeInputs").length) {
			jQuery("#oneProduct_" + uID + " #attributeInputs").addClass("js-type-halfswatch");
			Venda.Attributes.generateSwatch('att1', uID);
			Venda.Attributes.generateDropDowns('att2', uID);
			Venda.Attributes.generateDropDowns('att3', uID);
			Venda.Attributes.generateDropDowns('att4', uID);
			Venda.Attributes.PresetAtt(index, uID);
/* 			jQuery('#oneProduct_' + uID + ' #pricerange').text(Venda.Attributes.GetPriceRange(uID));
			jQuery('#oneProduct_' + uID + ' #price').text(Venda.Attributes.GetPriceRange(uID));
			Venda.Attributes.updateAttributes(uID); */
		}
		Venda.Attributes.swatchImage('att1',uID);
	});

	// This is getting all the assets that can be loaded after the Onload
	var url1 = '/content/ebiz/' + jQuery("#tag-ebizref").text() + '/resources/js/Venda/Attributes/attributeAsset-Swatch.js';
	jQuery.getScript(url1, function(Status){ if (!Status){console.warn('Whoops! attributeAsset-Swatch.js did not load');} else {
	var url2 = '/content/ebiz/' + jQuery("#tag-ebizref").text() + '/resources/js/Venda/Attributes/attributeAsset-Dropdown.js';
	jQuery.getScript(url2, function(Status){ if (!Status){console.warn('Whoops! attributeAsset-Dropdown.js did not load');} else {
	//All loaded

 		//ColourSwatch selection
		var singleuID = jQuery(".js-oneProduct").attr("id").substr(11);
		var urlParam = location.href.split("=")[1];
		if((jQuery(".js-oneProduct").length === 1) && (urlParam != "")) {
			for(var i = 0; i < Venda.Attributes.storeImgsArr.length; i++) {
				if(Venda.Attributes.storeImgsArr[i].param == urlParam) {
					Venda.Attributes.HalfswatchBehaviour('att1', urlParam, singleuID);
				}
			}
		}

	//All loaded
	}
	});
	}
	});

}();


// Events
jQuery('.attribute-inputs').off('click').on('click', '.js-attributeSwatch', function() {
	var uID 		= this.id.substr(16),
		attName 	= this.getAttribute('data-attName'),
		attValue 	= this.getAttribute('data-attValue');

	Venda.Attributes.HalfswatchBehaviour(attName, attValue, uID);

	// If you have currency converter include the following line
	if(jQuery("#currencyConverter").length) {
		if (jQuery('#tag-currencycode') && (typeof jQuery().pennies !== 'undefined')){
			jQuery('.js-attributesPrice .js-prod-price').pennies('convert',{to:jQuery(this).pennies('get'),from: jQuery('#tag-currencycode').html()})
		}
	}

});

jQuery('.attribute-inputs').on('change', 'select', function() {
	var uID = this.id.substr(5),
		attName 	= this.name,
		attValue 	= this.value,
		attText 	= jQuery('#' + attName + '_' + uID +' option:selected').attr('data-attText');

	Venda.Attributes.HalfswatchBehaviour(attName, attText, uID);

	// If you have currency converter include the following line
	if (jQuery('#tag-currencycode') && (typeof jQuery().pennies !== 'undefined')){
		jQuery('.js-attributesPrice .js-prod-price').pennies('convert',{to:jQuery(this).pennies('get'),from: jQuery('#tag-currencycode').html()})
	}

});

Venda.Attributes.HalfswatchBehaviour = function(attName, attValue, uID) {
	Venda.Attributes.setSelectedJSON(attName,attValue, uID);
	Venda.Attributes.updateAttributes(uID);
	Venda.Attributes.UpdateSwatch('att1', uID);
	Venda.Attributes.UpdateDD('att2', uID);
	Venda.Attributes.UpdateDD('att3', uID);
	Venda.Attributes.UpdateDD('att4', uID);
	Venda.Attributes.setSelectedClass(uID);
	Venda.Attributes.swatchImage('att1',uID);
}