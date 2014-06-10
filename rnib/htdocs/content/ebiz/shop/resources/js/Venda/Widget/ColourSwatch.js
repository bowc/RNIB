/**
 * @fileoverview Venda.ColourSwatch - Display colour swatch onto product list/ search result.
 *
 * This script provides us with the ability to change a main image colour by clicking on a colour swatch below the image.
 * The information displayed in the colour swatch div.
 *
 * @requires jQuery	js/external/jquery-1.5.min.js
 * @requires jQuery	js/external/jquery-ui-1.8.9.custom.min.js
 * @author Issawararat Chumchinda (Bow) <bowc@venda.com>
 */

//create ColourSwatch namespace
Venda.namespace("Widget.ColourSwatch");

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Widget.ColourSwatch
 * @constructor
 */

 /**
 * Sets up the object in preparation for rendering.
 *
 * @constructor
 * @class
 * @param {Object} config - An object representing the colour swatch configuration
 *
 */
Venda.Widget.ColourSwatch = function(config){
	var conf = config || {};
	this.init(conf);
};

Venda.Widget.ColourSwatch.prototype = {
	/**
	* Store an images source path
	* @type Array
	*/
	allImages: [],

	/**
	* Sets the configuration values
	* @param {array} config - the setting value of each config (configMainImage, configObjArea)
	*/
	init: function(config) {
		this.allImages = [];
		for(var eachProp in config){
			this[eachProp] = config[eachProp];
		}
	},

	/**
	* Sets the image values
	* @param {String} attValue - attribute 1 (color) value
	* @param {String} imgSources - image source path
	*/
	loadImage: function(attValue,imgSources) {
		this.allImages[attValue] = imgSources;
	},

	/**
	* To change relevant object behaviour after colour swatch is selected
	* @param {String} attValue - attribute 1 (color) value
	* @param {String} self - attribute value where is selected
	*/
	changeSet: function(attValue,self) {
		if (this.allImages[attValue]) {
			this.changeMainImage(attValue);
			//only do if colour swatch images are enabled
			if(jQuery(this.configObjArea["objSwatchArea"]).length!=0){ this.updateSelected(attValue,self); }
		}
	},

	/**
	* Sets the image HTML tag and update main image
	* @param {object} attValue - attribute 1 (color) value
	*
	*/
	changeMainImage: function(attValue) {
		/* workaround solution: cannot goto productdetail when VBM is enabled, so remove bklist from link if its blank */
		var bklist = Venda.Ebiz.BKList.configBKList.bklist || Venda.Ebiz.BKList.getUrl() || "";
		var imgLink = this.configMainImage["prodLink"];
		if(bklist == ""){
			imgLink = imgLink.replace("&bklist=", "")+"?colour="+attValue;
		}else{
			imgLink = imgLink + "&colour="+attValue;
		}

		var mappingData = ({
			"defaultImage": this.configMainImage["defaultImage"],
			"objSmall": jQuery(this.configObjArea["objProductArea"]),
			"imgLink": imgLink,
			"imgTag": (this.allImages[attValue].setimage!="") ? '<img src="'+this.allImages[attValue].setimage+'" alt="'+this.configMainImage["prodAlt"]+'" style="display: none;">' : '<img src="'+this.configMainImage["defaultImage"]+'" alt="'+this.configMainImage["prodAlt"]+'" style="display: none;">'
		});

		if(this.configMainImage["displayNotifyMsg"] && this.allImages[attValue].setimage==""){
			// Just show a notify message but the image doesn't change
			this.showMessage(attValue);
		} else {
			this.doChange(mappingData);
		}
		// pass a selected colour to quickBuy fast/details
		if(jQuery(".js-quickBuyFast").length > 0) {
			var quickBuyFast = mappingData.objSmall.find("a.js-quickBuyFast").attr("href").split("&colour=");
			mappingData.objSmall.find("a.js-quickBuyFast").attr("href",quickBuyFast[0]+"&colour="+attValue);
		}
		if(jQuery(".js-quickBuyDetails").length > 0) {
			var quickBuyDetails = mappingData.objSmall.find("a.js-quickBuyDetails").attr("href").split("&colour=");
			mappingData.objSmall.find("a.js-quickBuyDetails").attr("href",quickBuyDetails[0]+"&colour="+attValue);
		}

		// pass a selected colour to product detail
		mappingData.objSmall.find("a:first").attr("href",mappingData.imgLink);
		mappingData.objSmall.parent().find("h2").find("a").attr("href",mappingData.imgLink);
		mappingData.objSmall.parent().find("a.js-moreInfo").attr("href",mappingData.imgLink);
	},

	/**
	* Sets the image HTML tag and update main image
	* @param {object} mappingData - properties collection of each image
	*
	*/
	doChange: function(mappingData) {
		mappingData.objSmall.find(".js-notavailable").hide();
		mappingData.objSmall.addClass("js-preload").css({
			width: jQuery("a.js-moredetail img").outerWidth(),
			height: jQuery("a.js-moredetail img").outerHeight(),
			backgroundPosition: "center",
			border: "none",
			opacity: 1
		});
		mappingData.objSmall.find("a:first").html("").append(mappingData.imgTag);
		mappingData.objSmall.find("img").load(function(){
			jQuery(this).unbind("load").show();
			mappingData.objSmall.removeClass("js-preload");
		}).error(function(){
			jQuery(this).attr("src", mappingData.defaultImage).unbind("load").show();
		});
	},

	/**
	* To display swatch colour area
	*
	*/
	displaySwatch: function() {
		var allSwatch = "";
		var objSwatch = jQuery(this.configObjArea["objSwatchArea"]);
		for (var eachSwatch in this.allImages) {
			if (eachSwatch != "" && eachSwatch != "filter") {
				var swatchId = Venda.Ebiz.clearText(eachSwatch).replace(/ /g,"");
				allSwatch += (this.allImages[eachSwatch].setswatch) ? "<a class=\"js-sw-"+swatchId+"\" href=\"#\" onclick=\"colourSwatch['"+this.configMainImage["uuid"]+"'].changeSet('"+eachSwatch+"','"+this.configMainImage["prodSKU"]+"'); return false;\" title=\""+eachSwatch+"\"><img src=\""+this.allImages[eachSwatch].setswatch+"\" alt=\""+eachSwatch+"\"></a>" : "<a class=\"js-sw-"+swatchId+" js-sw-noimage\" href=\"#\" onclick=\"colourSwatch['"+this.configMainImage["uuid"]+"'].changeSet('"+eachSwatch+"','"+this.configMainImage["prodSKU"]+"'); return false;\" title=\""+eachSwatch+"\">"+eachSwatch+"</a>";
			}
		}
		objSwatch.html("").append(allSwatch);
		objSwatch.find("> a:first").trigger("click");
	},

	/**
	* To hightlight a colour swatch which is selecting
	* @param {Object} self	- Object collection value
	*/
	updateSelected: function (attValue, self) {
		jQuery("#swatch"+self).find("a").removeClass("js-sw-selected");
		jQuery("#swatch"+self).find("a").each(function(){
			 if(jQuery(this).is(".js-sw-"+attValue)){jQuery(this).addClass("js-sw-selected");}
		});
	},

	/**
	* To display a notify message if a main image is not colour changeable
	* @param {String} attValue - attribute colour is selecting
	*/
	showMessage: function (attValue) {
		var whereId = this.configObjArea["objProductArea"].id;
		var msg = "<div class=\"js-notavailable\"><div class=\"js-notifymsg\">"+this.configMainImage["notifyText"]+"<span> "+attValue+"</span></div></div>";

		jQuery("#"+whereId).find(".js-notavailable").remove();
		jQuery("#"+whereId).append(msg);
		jQuery("#"+whereId).find(".js-notavailable").fadeOut(this.configMainImage["fadeOutTime"]);
	}
};