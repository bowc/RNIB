// Create Checkout namespace
Venda.namespace('Checkout.Mobile');

/**
* Update shipping method by submitting the form
* @param {String} formId - a form id to submit
*/
Venda.Checkout.updateShipmethod = function (formId){
	Venda.Ebiz.showLoading(jQuery("#tag-shipWaitMsg").text());
	jQuery(formId).submit();
};

/**
* Clean login session value in the form
* @param {String} formId - a form id to clear unnecessary value
*/
Venda.Checkout.cleanUp = function(formSelector){
    var email = jQuery(formSelector+" #email").val();
	if(email !== ""){
		if ((email.substring(0,1)==="<") || (email.substring(0,4)==="user")) {
			jQuery(formSelector+" #email").val("");
		}
	}
	if(jQuery(formSelector+" #password").val()!== ""){
		jQuery(formSelector+" #password").val("");
	}
};
/**
* Get UK address
*/
Venda.Checkout.addressList = function(){
	var zipc = jQuery("#zipc").val();
	var zipcodeUrl = encodeURI(jQuery("#zipcodeUrl").html()+zipc);

	if (!jQuery("#zipc").parents("form").validate().element("#zipc")){
		return false;
	}
	jQuery(".loading").show();
	jQuery("#error").parent().hide();
	if(jQuery("#uklist").find("#error").length) jQuery("#uklist").html(" ");

	jQuery("#uklist").load(zipcodeUrl,function(response, status, xhr) {
		jQuery(".loading").hide();
		jQuery("select[name=zcdropdown]").attr("id","zcdropdown");
		jQuery("select").selectmenu();
		if(jQuery("#uklist select[name=zcdropdown]").length==0) {
			jQuery("#error").html("Postcode not found");
			jQuery("#error").parent().show().delay(2000).fadeOut();
		}
		if (status === "error") {
			var msg = "Sorry but there was an error: ";
			jQuery("#error").html(msg + xhr.status + " " + xhr.statusText);
		}
	});
};

/**
* Fill the UK address from dropdown to input field
*/
Venda.Checkout.selectAddress = function(){
	var addressUrl = encodeURI(jQuery("#tag-addressUrl").html());
	var zcdropdown = "&zcdropdown="+ jQuery("select[name=zcdropdown] option:selected").val();
	var zipc = "&zipc="+ jQuery("#zipc").val();
    jQuery("#ukaddress").load(encodeURI(addressUrl+zcdropdown+zipc),function(response, status, xhr) {
        var field = {
            'company': jQuery("#ukaddress #tag-zccompany").text(),
            'num': jQuery("#ukaddress #tag-zcnum").text(),
            'addr1': jQuery("#ukaddress #tag-zcaddr1").text(),
            'addr2': jQuery("#ukaddress #tag-zcaddr2").text(),
            'city': jQuery("#ukaddress #tag-zccity").text(),
            'statetext': jQuery("#ukaddress #tag-zcstate").text()
        };
        jQuery.each(field, function(key, value) {
            jQuery("#"+key).val(value);
        });
		if (status === "error") {
			var msg = "Sorry but there was an error: ";
			jQuery("#error").html(msg + xhr.status + " " + xhr.statusText);
		}
	});
};

jQuery(function(){
	jQuery('input[name*="shipmethod_"]').click(function(){
		Venda.Checkout.updateShipmethod('#'+(this).form.id);
	});

	//Bind change event for UK address dropdown
	jQuery("select[name=zcdropdown]").live("change",function() {
		Venda.Checkout.selectAddress();
		return false;
	});

	//Clear email field if there's a login form
	var loginForm = "#existingcustomer";
	var onLogin = jQuery(loginForm).length;
	if(onLogin>0){
		Venda.Checkout.cleanUp(loginForm);
	};

	//Delete item from shopcart - extracted from shopcart
	jQuery("#shopcart").on("click","a.removeItem",function(){
	    var line = jQuery(this).attr("data-line");
        jQuery("input[name='"+line+"']").val(1);
	    jQuery('form#shopcart').submit();
	});

	//order summary payment types - extracted from ordersummary
	if(typeof document.paymentoptionsform !== "undefined" && document.paymentoptionsform.ohpaytype !== "undefined") {
	    var paylocate;
	    for (var i=0; i<document.paymentoptionsform.ohpaytype.length; i++) {
			if ( document.paymentoptionsform.ohpaytype[i].value == 2) {
				paylocate = i;
			}
	    }
    }
	jQuery("#paymentdetails").on("click","#creditcard,#formpaypal",function(){
		var objPay = this;
		if (typeof document.paymentoptionsform.payall!=="undefined") {
		    if (objPay.checked === true && objPay.value != 2) {
			    document.paymentoptionsform.payall.checked = false;
			    document.paymentoptionsform.sendpaypaid.readOnly = false;
			    document.paymentoptionsform.sendpaypaid.value = "";
		    }
	    }
	});
	//extracted from paymenttype_card
	if(jQuery("#ohccnum").length>0){
        Venda.Platform.SelectBoxToggle( 'cardtype','directdebitsde',['expiryshow','ohcccscshow','switchsolo','issuenumber','startdateshow','ohccnum-label'],['sortcodeshow','ohccnum-elv-label'], 80);
    };
	//Promotion code redeem - extracted from ordersummary
	jQuery("#additionalservices").on('keypress', "#vcode", function(event) {
            if(event.keyCode===13){
				jQuery('#promotionform').submit();
            }
    });

	//Update shopcart quantities on multiple deliver addresses - extracted from multipledeliveryaddresses
	jQuery(".multipledeliveryaddresses .bottomButtons").on("click","#updatequantities",function(){
		jQuery("input[type=hidden][name=param2]").val("updated");
		jQuery("input[type=hidden][name=step]").val("multipledeliveryaddresses");
	});
});

/**
* Pass email address between login and password reminder screens, by appending to the url
* Add this back once 1.7 is used by jQuery mobile

jQuery(function() {
	jQuery(document).on('click','a#passwordreminder',function(){ //used on login screen - forgotten password link
		var email = jQuery('input#email').val();
		if (email){
			jQuery('a#passwordreminder').attr('href',function(i, val) {return val + '&param1=' + email});
		}
	});
	jQuery(document).on('click','a#cancelreminder',function(){ //used on pwrm screen - cancel button
		var email = jQuery('input#usemail').val();
		if (email){
			jQuery('a#cancelreminder').attr('href',function(i, val) {return val + '&param1=' + email});
		}
	});
	jQuery(document).on('click','input#passwordsent',function(){ //used on pwrm screen - continue button
		var email = jQuery('input#usemail').val();
		if (email){
			jQuery('input[name=param1]').val(email);
		}
	});
});
*/