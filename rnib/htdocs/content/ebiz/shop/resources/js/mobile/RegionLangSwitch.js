/**
 * @fileoverview Venda.Widget.RegionLangSwitch
 *
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 * @edited Issawararat Chumchinda <bowc@venda.com> (to support mobile specific event)
 */
Venda.namespace("Widget.RegionLangSwitch");
var sURL = unescape(location.href);
var currRegion = jQuery('#tag-sessionlocation').text();
var currLang = jQuery('#tag-sessionlanguage').text();
var ebizURL = jQuery('#tag-serveradd').text();

jQuery(function(){
	var menuStatus;

	jQuery("select#region, select#lang").selectmenu({ theme: "a" });
	jQuery(".closeDiv a").buttonMarkup({ theme: "a" });

	jQuery(".regionLangLink").delegate("a", "click", function(){
		jQuery("body").addClass("bgColourChanged");
		if(!menuStatus) {
			jQuery(".regionLangPanel").fadeToggle();
			jQuery(".ui-page-active").animate({
				marginLeft: "215px",
			}, 300, function(){menuStatus = true});
			return false;
		} else {
			jQuery(".regionLangPanel").fadeToggle();
			jQuery(".ui-page-active").animate({
				marginLeft: "0px",
			}, 300, function(){
				menuStatus = false;
				jQuery("body").removeClass("bgColourChanged");
			});
			return false;
		}
	});

	jQuery(".regionLangPanel select").live("change", function() {
		var selectedObj = jQuery(this).find(":selected").val();

		if(jQuery(this).attr("id") == "region") {
			if (selectedObj != "") Venda.Widget.RegionLangSwitch.doURL("setlocn",selectedObj,currRegion);
			return false;
		}
		if(jQuery(this).attr("id") == "lang") {
			if (selectedObj != "") Venda.Widget.RegionLangSwitch.doURL("setlang",selectedObj,currLang);
			return false;
		}
	});

	// Closing RegionLangSwitch by two events
	jQuery("#mobile").live("swipeleft", function(e){
		if (menuStatus){
			jQuery(".regionLangPanel").fadeToggle();
			jQuery(".ui-page-active").animate({
				marginLeft: "0px",
			}, 300, function(){
				menuStatus = false;
				jQuery("body").removeClass("bgColourChanged");
			});
		}
	});

	jQuery(".closeDiv a").live("click", function(){
		jQuery(".regionLangPanel").fadeToggle();
		jQuery(".ui-page-active").animate({
			marginLeft: "0px",
		}, 300, function(){
			menuStatus = true;
		});
	});
});

Venda.Widget.RegionLangSwitch.doURL = function(setType,selectedObj,currSelected){
	var redirectURL = sURL;
	var rep = "/"+currSelected+"/";
	var newRep = "/"+selectedObj+"/";

	if((sURL.indexOf(rep) < 0) && (jQuery('#tag-serveradd').text() != '1') ){
		sURL = ebizURL +"/"+currLang+"/"+currRegion+"/"+"page/home";
		sURL = sURL.replace(rep, newRep);
		redirectURL = sURL;
	} else if((sURL.indexOf(rep) < 0) && (jQuery('#tag-serveradd').text() == '1')){
			var setTypeValue = selectedObj;
			if(sURL.indexOf(setType) > -1) {
				repStr = setType+"="+ currSelected;
				newRepStr = setType+"="+ setTypeValue;
				redirectURL = sURL.replace(repStr, newRepStr);
			}else{
				redirectURL = sURL+"&"+setType+"="+setTypeValue;
			}
	} else {
		sURL = sURL.replace(rep, newRep);
		redirectURL = sURL;
	};
	window.location.href = redirectURL;
	jQuery("#mobile").trigger("swipeleft"); // Triggering the swipeleft event for closing the panel
};