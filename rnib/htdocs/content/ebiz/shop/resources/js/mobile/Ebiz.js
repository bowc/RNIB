//Declare namespace for ebiz
Venda.namespace("Ebiz");

Venda.Ebiz.showLoading = function(msg) {
	var loadingMsg = (typeof msg != "undefined") ? msg : "loading";
	jQuery.mobile.showPageLoadingMsg("", loadingMsg);
};

/**
* Media Code
* Validate and submit media code using ajax if not on basket for in-page display
* Update minicart figures with ajax too if not on basket
*/
Venda.Ebiz.checkVoucherForm = function(defaulttext) {
	var str = jQuery.trim(jQuery("#vcode").val());
	jQuery("#ajax-error").hide();
	if(jQuery("#vcode_submit_shopcart").length > 0){ //if on workflow
		jQuery("#vcode").val(str);
		Venda.Ebiz.showLoading(jQuery("#tag-shipWaitMsg").text());
		var src = (jQuery("#tag-curstep").html() == "ordersummary") ? jQuery("#tag-protocol").html()+"?ex=co_wizr-promocodehttpsmobile&curstep=vouchercode&step=next&mode=process&curlayout=promocoderesultmobile&layout=promocoderesultmobile&vcode="+jQuery("#vcode").val()+"&action=add"
				: jQuery('#tag-protocol').html()+'?ex=co_wizr-promocodehttpmobile&curstep=vouchercode&step=next&mode=process&curlayout=promocoderesultmobile&layout=promocoderesultmobile&vcode='+jQuery("#vcode").val()+'&action=add';

		var oScript = jQuery("<script />", {
			type: "text/javascript",
			src: src
		});
		jQuery("#ajax-error").append(oScript).show();
		jQuery.mobile.hidePageLoadingMsg();
	}
};

/**
* A prompt shows when you first visit the site allowing the user to add a link to the iphone/ipad dashboard
* Add this back once the functionality is needed
*/
Venda.Ebiz.addToHome = function (){
	var iconSrc = (jQuery('head link[rel=apple-touch-icon-precomposed]').length>0)
				? jQuery('head link[rel=apple-touch-icon-precomposed]').attr('href')
				: jQuery('head link[rel=apple-touch-icon]').attr('href');
	if(jQuery.cookie('visited') == null) {
		jQuery.cookie('visited', '1',  { path: '/' });
		jQuery("#addToHomeScreen").remove();
		if(iconSrc!=""){
			jQuery('<div id="addToHomeScreen" class="addToHomeIphone"><span style="background-image:url(' + iconSrc + ')" class="addToHomeTouchIcon"></span>Install this web app on your iPhone: tap <span class="addToHomePlus">+</span> and then <strong>"Add to Home Screen"</strong>.<span class="addToHomeArrow"></span><span class="addToHomeClose">x</span></div>').appendTo("body");
		} else {
			jQuery('<div id="addToHomeScreen" class="addToHomeIphone">Install this web app on your iPhone: tap <span class="addToHomePlus">+</span> and then <strong>"Add to Home Screen"</strong>.<span class="addToHomeArrow"></span><span class="addToHomeClose">x</span></div>').appendTo("body");
		}
		jQuery(window).bind("scroll", function(){
			jQuery("#addToHomeScreen").css("top", window.pageYOffset+window.innerHeight-(jQuery("#addToHomeScreen").outerHeight()+jQuery("#addToHomeScreen .addToHomeArrow").outerHeight())+"px");
		});
		jQuery("#mobile, .addToHomeClose").bind("click", function() {
			jQuery("#addToHomeScreen").remove();
		});
	}
};

/**
* To show the information of gift certificate value
*/
Venda.Ebiz.giftInfo = function (){
	jQuery(".giftInfo").hide();
	jQuery("#amount").bind("click focus", function(){
		jQuery(".giftInfo").show();
		jQuery("#amount").bind("blur", function(){
			jQuery(".giftInfo").hide();
		});
	});
};

Venda.Ebiz.textCounter = function(field, maxlimit) {
	if (field.value.length > maxlimit) {
		// trim if too long
		field.value = field.value.substring(0, maxlimit);
	}
};

/**
* Update quantity on your basket page
* @param {Object} self
*/
Venda.Ebiz.updateQTYBasket = function(self) {
	var qtyID = "#"+jQuery(self).attr('id');
	var formName = jQuery(self).closest("form").attr('name');

	if(jQuery(self).is('.qtyDropdown')) {
		/* Dropdown version */
		jQuery(qtyID).val(jQuery(qtyID+" option:selected").val());
	}
	jQuery("form[name="+formName+"] input[type=hidden][name=param2]").val("updated");
	jQuery("form[name="+formName+"]").submit();
};

/**
* To validate Qty - the accept value is only number
*
* @return {boolean} - true if only number entered
*/
Venda.Ebiz.validateQty = function(){
	var filterNumber = /(^-?[1-9](\d{1,2}(\,\d{3})*|\d*)|^0{1})$/;
	var hasQty = true;

	jQuery("#qty, .qty").each(function (index) {
		if((parseInt(jQuery(this).val()) < 0) || (filterNumber.test(jQuery(this).val())==false)){
			if(jQuery(this).attr("type") == "text") jQuery(this).val(1);
			hasQty = false;
			return false;
		}
	});
	if(!hasQty){
		alert(jQuery("#tag-qtymsg").text());
		return false;
	}

	return true;
};

/**
* Form submition with no reload page
*
*/
jQuery.fn.submitForm = function(){
	var formObj = jQuery(this);
	var URL = formObj.attr('action'); /* get target*/
	var params = formObj.find("input, select, textarea").serialize(); /* get the value from all input type*/

	Venda.Ebiz.showLoading();
	jQuery.ajax({
		type: "POST",
		url: URL,
		dataType: "html",
        data: params,
		cache: false, /* do not cache*/
		error: function() {
			jQuery("div.ui-page-active div[data-role='content']").html('error');
		},
		success: function(data) {
			jQuery.mobile.hidePageLoadingMsg();
			jQuery("div.ui-page-active div[data-role='content']").html(data);
		}
	});
};

/**
* Detect a touch screen device
* return true if a touch screen device uses
*/
Venda.Ebiz.isTouchDevice = function() {
	var deviceAgent = navigator.userAgent.toLowerCase();
	var isTouchDevice = (deviceAgent.match(/(ipad)|(iphone)|(ipod)|(android)|(webos)/i)) ? true : false;
	return isTouchDevice;
};

Venda.Ebiz.replaceValue = function(reValue){
	var re = new RegExp('[?&]'+reValue+'=([^&]+)');
	jQuery("#collate").find("select option").each(function(){
		optionQbj = jQuery(this);
		var match = optionQbj.val().match(re);
		if(match){
			optionQbj.val(optionQbj.val().replace(match[0],""));
		}
	});
	jQuery("#term").find("a").each(function(){
		optionQbj = jQuery(this).attr("href");
		var match = optionQbj.match(re);
		if(match){
			jQuery(this).attr("href",optionQbj.replace(match[0],""));
		}
	});
};

Venda.Ebiz.refineSearch = function(selectObj){
	var $this = jQuery(selectObj);
	if($this.val() != ''){
		var target = $this.find(':selected').val();
		target = target.replace(/&setpagenum=([^?&]+)/g,'');

		if($this.attr('id')=='price') {
			var price = $this.find(':selected').data('price').split('-');
			target = target.replace(/&price_from=([^?&]+)/g,'');
			target = target.replace(/&price_to=([^?&]+)/g,'');
			location = target+'&price_from='+price[0]+'&price_to='+price[1];
		} else {
			location = target;
		}
	}
};

/**
* Grid/List view
*/
Venda.Ebiz.setVeiwProduct = function(){
	var getViewCookie = jQuery.cookie("setViewMobile") || 'List';
	if(getViewCookie == "Grid"){
		jQuery(".searchResults ul.prods").attr("data-role","");
	}
	jQuery(".searchResults ul.prods").removeClass('prodsList prodsGrid');
	jQuery(".searchResults ul.prods").addClass("prods"+getViewCookie);
	jQuery(".searchResults .viewProduct").removeClass("iconListActive iconGridActive");
	jQuery(".searchResults .viewProduct.icon"+getViewCookie).addClass("icon"+getViewCookie+"Active");
};

/**
* Store locator dropdown version
*/
Venda.Ebiz.changeSelectStore = function(selectObj,parentsObj) {
	var sURL = selectObj.options[selectObj.selectedIndex].value;
	jQuery(selectObj).parents(parentsObj).next().html("");
	jQuery("#storeDetail").html("");
	if(parentsObj == ".regionselect"){
		jQuery(".store").html("");
	}
	jQuery(selectObj).parents(parentsObj).next().load(sURL, function(){
		jQuery(this).find("select").selectmenu();
	});

};

Venda.Ebiz.showStoreDetails =function(selectObj){
	var sURL = selectObj.options[selectObj.selectedIndex].value;
	jQuery("#storeDetail").load(sURL);
};

/**
 * Remove any special characterSet
 * @param {string} str - string with any special characters
 * @return {string} str - string WITHOUT any special characters
 */
Venda.Ebiz.clearText = function (str) {
	var iChars = /\$|,| |@|#|~|`|\%|\*|\^|\&|\(|\)|\+|\=|\/|\[|\-|\_|\]|\[|\}|\{|\;|\:|\'|\"|\<|\>|\?|\||\\|\!|\$|\./g;
	return str.replace(iChars, "");
};

Venda.Ebiz.emailSignup = function() {
	var userEmail = Venda.Platform.getUrlParam(location.href, 'email');
	var displyEmail = Venda.Platform.escapeHTML(userEmail);
	var sesUsEmail = jQuery('#sesUsEmailDiv').html();
	var userType = jQuery('#userType').html();
	if ((sesUsEmail == userEmail) || (sesUsEmail == '')) {
		document.emailsonly.usemail.value = userEmail;
		document.getElementById("newsignup").style.display ="block";
		document.getElementById("newsignupemail").innerHTML =  displyEmail ;
	} else {
		document.emailsonly.usemail.value = userEmail;
		document.emailsonly.log.value = '4';
		if (userType != 'G') {
			document.getElementById("alreadysignup").style.display ="block";
			document.getElementById("sesUsEmail").innerHTML =  sesUsEmail ;
			document.getElementById("displyEmail").innerHTML =  displyEmail ;
		} else {
			document.getElementById("newsignup").style.display ="block";
			document.getElementById("newsignupemail").innerHTML =  displyEmail ;
		}
	}
};

/**
* To override default settings, bind to mobileinit
*/
jQuery(document).bind("mobileinit", function(){
  jQuery.mobile.ajaxEnabled = false;
  jQuery.mobile.hashListeningEnabled = false;
  jQuery.mobile.loadingMessageTextVisible = true;
});

/**
* Triggered on the page being initialized
*/
jQuery(document).bind("pageinit", function(event) {
	jQuery.mobile.hidePageLoadingMsg(); //prevent loading appears continuously
	//if(window.navigator.userAgent.indexOf('iPhone')!=-1) Venda.Ebiz.addToHome();

	// FROM ./templates/invt/mobile/mobile.html
	// This is used by VBM and must be taken out and shoot
    if (jQuery('#infotab').length > 0 ){
        var infotab = new Venda.Widget.createTab("#infotab");
        infotab.init();
    }

    if (jQuery('#bottomtab').length > 0 ){
        var bottomtab = new Venda.Widget.createTab("#bottomtab");
        bottomtab.init();
    }
	// FROM ./page/signupforemailsmobile
	// This is used by Newsletter Sign Up
    if(jQuery('#emailSignup').length > 0){
		Venda.Ebiz.emailSignup();
	}

	// ATTACH EVENTS
	jQuery("#desktop").click(function(){
		// Creating cookie with all available options
		jQuery.cookie('device', 'desktop', { path: '/', domain: document.domain });
	});

	//Login page
	jQuery(".existing").live( "click", function(event, ui) {
		jQuery(".newCustomerbuttonDiv").toggleClass("greyButton");
		jQuery(".guestCheckout").toggleClass("greyButton");
	});

	if(jQuery(".productdetailMulti").length > 0){
		var qtylist = 0;
		var url = location.href;
		if(url.indexOf("&ex=co_disp-shopc") != -1){
			var params = url.split("&");
			for (i=0; i<params.length; i++) {
				val = params[i].split("=");
				if( (val[0] == "qtylist") && (val[1] != "")){
					qtylist = qtylist + parseInt(val[1]);
				}
			 }
			jQuery("#multiaddedmsg").removeClass("hide");
			jQuery("#multiaddedmsg .multiaddedmessage").find("span").text(qtylist);
		}else{
			jQuery("#multiaddedmsg").addClass("hide");
		}
	}
	//Grid/List view link
	jQuery(".searchOptions .viewProduct").live("click", function() {
		var view =  jQuery(this).attr("data-viewstyle");
		jQuery.cookie("setViewMobile", view, { path: '/' });
		location.reload();
	});

	//Bind change event for search refine list
	jQuery("select.refineselect").live("change",function() {
		Venda.Ebiz.refineSearch(this);
		return false;
	});

	//Bind change event for update QTY on basket page
	jQuery(".qtyDiv select").live("change",function() {
		Venda.Ebiz.updateQTYBasket(this);
		return false;
	});
});

jQuery(document).bind('pagecreate',function(){
	if(jQuery(".searchResults .viewStyle").length){
		Venda.Ebiz.setVeiwProduct();
	}
});