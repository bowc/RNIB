// Create Checkout namespace
Venda.namespace('Platform.Checkout.jsContent');
Venda.namespace('Checkout');
/**
 * Check for JavaScript and load checkbox for different delivery address
 * @param {swapid}	id of tag
 * @param {tags}	output for JS view
 */
Venda.Platform.Checkout.jsContent.create = function(swapid, tags) {
	Venda.Platform.Checkout.jsContent.tags = tags;

	// check if DOM is available
	if(!document.getElementById || !document.createTextNode){return;}
	// check if there is a "No JavaScript" message
	var nojsmsg=document.getElementById(swapid);
	if(!nojsmsg){return;}

	switch(swapid) {
		case 'differentdeliveryaddress':
			// create a new div containing different delivery address checkbox
			var newDiv=document.createElement('div');

			var newInput=document.createElement('input');
			newInput.type='checkbox';
			newInput.setAttribute('name','differentaddress');// there is an IE bug where you cannot add a name attribute
			newInput.id='differentaddress';

			var label = document.createElement('label');
			label.setAttribute('for','differentaddress');
			label.appendChild(document.createTextNode(Venda.Platform.Checkout.jsContent.tags.label));

			newDiv.appendChild(newInput);
			newDiv.appendChild(label);
			newDiv.appendChild(document.createTextNode(' '+Venda.Platform.Checkout.jsContent.tags.message));
			nojsmsg.parentNode.replaceChild(newDiv,nojsmsg);
		break;
	}
};

//Function to prevent single quotes in text input - used in gift wrap screen
function noSingleQuotes(formName) {
for(i=0;i<(formName.elements.length);i++){
    	if(((formName.elements[i].type === "textarea") || (formName.elements[i].type === "text")) && (formName.elements[i].value!="")){
    		formName.elements[i].value = formName.elements[i].value.replace(/'/gi, '');
    	}
	}
};
/**
 * Selecting the delivery option automatically by depend the delivery address
 * @param {paramList}	id of the delivery option
 */
Venda.Checkout.initialDTS = function(dtsenabled){
	var dtsOption ="#dts"; //the delivery option ID for store address
	var defaultOption = "";
	if(dtsenabled == 1){
		if(jQuery(".js-deliveryoptions").find(dtsOption).length){
			if(jQuery(".js-storeaddress").length){
				jQuery(".js-storeaddress").each(function(){
					if(!jQuery(this).find(dtsOption).attr('checked')){
						jQuery(this).find(dtsOption).attr('checked',true).trigger("click");
					}
					jQuery(this).find("input:not(:checked)").each(function(){
						jQuery(this).attr("disabled","disabled");
					});
				});
			}
			if(jQuery(".js-homeaddress").length){
				jQuery(".js-homeaddress").each(function(){
					if(jQuery(this).find(dtsOption).attr('checked')){
						jQuery(this).find('li input').not(dtsOption).eq(0).attr('checked',true).trigger("click");
					}
					jQuery(this).find(dtsOption).attr("disabled","disabled");
				});
			}
		}
	}else {
		if(jQuery(".js-deliveryoptions").find(dtsOption).length){
			jQuery(".js-deliveryoptions").find(dtsOption).parents('li').hide();
		}
	}
};

/**
* To manual submit for 'Shipping method/Gift certificate code' form
* @param {Object} formobj - a form object
* @param {String} msg - message to show in a modal during a page submit
*/
Venda.Checkout.manualsubmit = function (formobj, msg){
    if(msg==''){ msg = jQuery('#js-default-waitMsg').text(); }
    jQuery('#js-modal-style span').html(msg);
	jQuery('#js-modal-style').foundation('reveal', 'open');
	formobj.submit();
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

jQuery(function(){
    //Clear email field if there's a login form
    var loginForm = "#existingcustomer";
    var onLogin = jQuery(loginForm).length;
    if(onLogin>0){
        Venda.Checkout.cleanUp(loginForm);
    };
	//Pass email address between login and password reminder screens, by appending to the url
	jQuery(document).on('click','a#passwordreminder',function(){ //used on login screen - forgotten password link
		var email = jQuery('input#email').val();
		if (email){
			jQuery('a#passwordreminder').attr('href',function(i, val) {return val + '&param1=' + email});
		}
	});
	jQuery(document).on('click','a#cancelreminder',function(){ //used on pwrm screen - cancel button
		var email = jQuery('input#usemail').val();
		if (email){
			jQuery('a#cancelreminder').attr('href',function(i, val) {return val + '&param1=' + email + '&param2=passwordcancel'});
		}
	});
	jQuery(document).on('click','input#passwordsent',function(){ //used on pwrm screen - continue button
		var email = jQuery('input#usemail').val();
		if (email){
			jQuery('input[name=param1]').val(email);
		}
	});
    if(jQuery(".js-shopcart").length > 0) {
        // Update QTY - extracted from shopcart
        jQuery('form[name=shopcartform]').on('keypress','.js-qty', function(event) {
            if (event.which == '13') {
                jQuery('#update'+jQuery(this).attr('name')).trigger('click');
                return false;
            }
        });
        jQuery('form[name=shopcartform]').on("click","a.js-update",function() {
            jQuery('form[name=shopcartform] input[name=wizard]').val(jQuery('#tag-workflow').text());
            jQuery('form[name=shopcartform] input[name=step]').val(jQuery('#tag-curstep').text());
            jQuery('form[name=shopcartform] input[type=submit]:first').trigger('click');
            return false;
        });

        // Delete item - extracted from shopcart
        jQuery('form[name=shopcartform]').on("click","a.js-removeItem",function() {
            var line = jQuery(this).attr("data-line");
            var wizard = jQuery(this).attr("data-wizard");
            jQuery("input[name='"+line+"']").val(1);
            jQuery("input[name='wizard']").val(wizard);
            jQuery('form[name=shopcartform]').submit();
        });
    }
	//order summary payment types - extracted from ordersummary
	if(document.ordersummaryform && document.ordersummaryform.ohpaytype) {
			var paylocate;
			for (var i = 0; i < document.ordersummaryform.ohpaytype.length; i++) {
				if ( document.ordersummaryform.ohpaytype[i].value === 2) {
					paylocate = i;
				}
			}
    }
	jQuery("#paymentdetails").on("click","#creditcard,#formpaypal,#sendinpayment,#manualpayment,#finance,#faxpayment,#purchaseorder",function(){
		var objPay = this;
		if (typeof document.ordersummaryform.payall!=="undefined") {
		    if (objPay.checked === true && objPay.value != 2) {
			    document.ordersummaryform.payall.checked = false;
			    document.ordersummaryform.sendpaypaid.readOnly = false;
			    document.ordersummaryform.sendpaypaid.value = "";
		    }
	    }
	});
	//extracted from paymenttype_card
	if(jQuery("#ohccnum").length>0){
        Venda.Platform.SelectBoxToggle( 'cardtype','directdebitsde',['expiryshow','ohcccscshow','switchsolo','issuenumber','startdateshow','ohccnum-label'],['sortcodeshow','ohccnum-elv-label'], 80);
    };
    if(jQuery("#ohcccsc").length>0){
        Venda.Platform.SelectBoxToggle( 'cardtype','directdebitsde',['expiryshow','ohcccscshow','switchsolo','issuenumber','startdateshow','ohccnum-label'],['sortcodeshow','ohccnum-elv-label'], 80);
    };
    jQuery("#paymentdetails").on("click",".js-changecard",function(){
        if(!jQuery(this).is('.active')) {
            jQuery("#cardpreviewpanel").hide();
        }
    });

	//Update shopcart quantities on multiple deliver addresses - extracted from multipledeliveryaddresses
	jQuery("#multipledeliveryaddresses").on("click","#updatequantities",function(){
	    jQuery("input[type=hidden][name=param2]").val("updated");
	    jQuery("input[type=hidden][name=step]").val("multipledeliveryaddresses");
	});

    // Gift certificate - input on order summary
    jQuery('form[name=ordersummaryform-giftcert]').on('keypress','#giftcode', function(event) {
        if (event.which == '13') {
            jQuery('#js-applygiftcode').trigger('click');
            return false;
        }
    });

	//Gift wrapping
    //form id=giftwrap id="formgw-<venda_oirfnbr>" onchange="showGiftwrap('gw-<venda_oirfnbr>');"
	//data-oirfnbr
	if(jQuery("#giftwrap").length>0){
		//The class from <venda_gwname> could have spaces so replace spaces with - and add new class
		jQuery(".js-wrapdetail td").each(function(){
			var newClass = jQuery(this).attr("class");
			newClass = newClass.replace(/\s/g,"-");
			jQuery(this).addClass(newClass);
		});
		//dropdown
		jQuery(".js-wrapitem").on("change","select",function(){
		    var oirfnbr = jQuery(this).attr("data-oirfnbr");
			showGiftwrap("gw-"+oirfnbr);
		});
		showGiftwrap = function(wrapselect){
			var selectObj = jQuery("select[id=form"+wrapselect+"] option:selected");
            var selectText = selectObj.text();
            selectText = selectText.replace(/\s/g,"-");
              if(selectObj.val() != "" ) {
                jQuery(".js-"+wrapselect).find(".js-gwsell").html(jQuery(".js-sell"+selectText).html());
                jQuery(".js-"+wrapselect).find(".js-gwimg").html(jQuery(".js-img"+selectText).html());
              }else {
                jQuery(".js-"+wrapselect).find(".js-gwsell").html('');
                jQuery(".js-"+wrapselect).find(".js-gwimg").html('');
              }
		};
		//gift message
		countGiftMsg = function(oirfnbr){
			jQuery("#formcm-"+oirfnbr).textboxCount(".js-textMsgCount-"+oirfnbr,{
				maxChar: 80,
				countStyle: 'down',
				alert: ""
			});
		};
        jQuery(function() {
            jQuery(".js-wrapitem textarea").each(function(){
			    countGiftMsg(jQuery(this).attr("data-oirfnbr")); //errors here dunno why
		    });
            jQuery(".js-wrapitem.js-wrapitem select").each(function(){
                var oirfnbr = jQuery(this).attr("data-oirfnbr");
                showGiftwrap("gw-"+oirfnbr);
            });
        });
		jQuery(".js-wrapitem textarea").focus(function() {
            countGiftMsg(jQuery(this).attr("data-oirfnbr"));
        });
	};

	//Venda.Ebiz.customSelect();

	jQuery('input[name*="shipmethod_"]').click(function(){
            Venda.Checkout.manualsubmit(jQuery('#'+(this).form.id), jQuery('#js-deliver-waitMsg').text());
        }
    );

	if (jQuery('.js-dtsenabled').length > 0 ){
		Venda.Checkout.initialDTS(jQuery('.js-dtsenabled').html());
	}
});
