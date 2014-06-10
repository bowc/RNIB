//Declare namespace for ebiz
Venda.namespace("Ebiz");

/**
* http://n33.co/2013/03/23/browser-on-jquery-19x-for-legacy-ie-detection
* The following snippet will bring back $.browser.msie and $.browser.version on jQuery 1.9.x
**/
jQuery.browser={};
(function(){
    jQuery.browser.msie=false;
    jQuery.browser.version=0;
    if(navigator.userAgent.match(/MSIE ([0-9]+)\./)){
        jQuery.browser.msie=true;
        jQuery.browser.version=RegExp.$1;
    }
})();

jQuery(function(){
  // Close alert boxes sitewide
  jQuery(document).on("click", ".alert-box a.close", function(event) {
    event.preventDefault();
    jQuery(this).closest(".alert-box").fadeOut(function(event){
      jQuery(this).remove();
    });
  });
  // show/hide nav for tablet and under
  jQuery(document).on("click", "#nav-browse,#show-small-nav", function(event) {
    jQuery("#mm_ul").slideToggle("slow");
    jQuery("#nav-browse").toggleClass("js-nav-browse-active");
  });
  // show/hide search for mobile
  jQuery(document).on("click", "#show-small-search", function(event) {
    jQuery("#header-row-two").toggleClass("js-search-active");
  });

  if (jQuery('.js-togglebox').length > 0 ){
	Venda.Ebiz.togglebox();
  }
    if (jQuery('.js-slidetoggle').length > 0 ) {
        Venda.Ebiz.slidetoggle();
    }
});

// FROM ./templates/widgets/styleSwitch/styleSwitch.html
jQuery(function () {
    if (typeof Venda.Widget.ViewStyle != "undefined") {
        Venda.Widget.ViewStyle.showProductPreview();
    }
});


// FROM ./templates/invt/productdetail/productdetail.html
jQuery(function () {

    // This is used by VBM and must be taken out and shoot
    if (jQuery('#infotab').length > 0 ){
        var infotab = new Venda.Widget.createTab("#infotab");
        infotab.init();
    }

    if (jQuery('#bottomtab').length > 0 ){
        var bottomtab = new Venda.Widget.createTab("#bottomtab");
        bottomtab.init();
    }
});
// show/hide for mobile
Venda.Ebiz.togglebox = function() {
  jQuery(document).on("click", ".js-togglebox", function(event) {
   if (Modernizr.mq('only all and (max-width: 767px)')) {
        var toggleClass = '.'+  jQuery(this).attr('data-toggle');

        if(jQuery(toggleClass).hasClass("hide-for-small")){
            jQuery(toggleClass).removeClass("hide-for-small");
            jQuery(toggleClass).css('display', 'none');
            jQuery(toggleClass).slideDown(150);
        }else {
            jQuery(toggleClass).slideUp(150, function(){
                 jQuery(toggleClass).addClass("hide-for-small");
            });
        }

        jQuery(this).toggleClass('active');

        if(jQuery(this).attr('data-toggle-icon')) {
            if(jQuery(this).hasClass('active')) {
                jQuery(this).find('i').addClass(jQuery(this).attr('data-toggle-icon'));
            } else {
                jQuery(this).find('i').removeClass(jQuery(this).attr('data-toggle-icon'));
            }
        }
    }
  });
};

// toggle show/hide
Venda.Ebiz.slidetoggle = function() {
  jQuery(document).on("click", ".js-slidetoggle", function(event) {
    var toggleClass = '.'+  jQuery(this).attr('data-slidetoggle');
    jQuery(toggleClass).slideToggle('slow');
    jQuery(this).toggleClass('active');

    if(jQuery(this).attr('data-slidetoggle-icon')) {
        if(jQuery(this).hasClass('active')) {
            jQuery(this).find('i').addClass(jQuery(this).attr('data-slidetoggle-icon'));
        } else {
            jQuery(this).find('i').removeClass(jQuery(this).attr('data-slidetoggle-icon'));
        }
    }
  });
};

Venda.Ebiz.ExecuteDialogOpen = function() {

 if(jQuery('#vModal').find('form').length > 0){
	if(jQuery('#emailmeback').length > 0){
		var attributeSku = Venda.Attributes.Get('atrsku');
		if(attributeSku != ""){
			document.emailmebackform.invtref.value = attributeSku;
		}
	}
    // EO FROM ./templates/invt/tellafriend/tellafriend.html
    var  modalFormName = jQuery('#vModal').find('form').attr('name');
	jQuery('form[name='+modalFormName+']').find('input[name="layout"]').val('noheaders');
	Venda.Ebiz.submitFormModal(modalFormName);
 }else {
        document.form.submit();
    }
 }

// FROM ./templates/widgets/compareItems/compareItems.html
jQuery(function () {
    if(document.getElementById("js-compare")) {
        Venda.Widget.Compare.toCompare = function(){
            var compareList = Venda.Widget.Compare.toCompareItems();
            var itemList = '';
            var item ='';
            var k = 0; // counting how many checkboxes are checked

            if(compareList) {
                // Setup the compare items list.
                for(var i = 0; i < compareList.length; i++) {
                   item = '&compare=' + compareList[i];
                   itemList += item;
                   k++;
                }

                if (k >= 2) { // only open the compare window if more then 2 checkboxes are checked
                    var strUrl = document.getElementById("js-compare-codehttp").innerHTML + '?ex=co_disp-comp&bsref=' + document.getElementById("js-compare-bsref").innerHTML + '&layout=noheaders' + itemList;
                    Venda.Widget.Compare.popupCompare(strUrl);
                }else{
                    alert(document.getElementById("js-compare-product-list-compare-validation").innerHTML);
                }
            }
        }

        AddtoCompare = function(productType,sku,name,image){
            var invtName = document.getElementById(name).innerHTML;
            var image = document.getElementById(image).getElementsByTagName("img");
            var invtImage = image[0].src;

            Venda.Widget.Compare.addToCompareAndProductString(productType,sku,invtName,invtImage);
        }
    }
});
// EO FROM ./templates/widgets/compareItems/compareItems.html


//SEARCH.JS
// Links to: /resources/js/Ebiz.js
// Links to: /resources/js/Venda/Widget/ColourSwatch.js
// None of the classes below are in any templates/page/css
Venda.namespace("Ebiz.BKList");
Venda.Ebiz.BKList.jq = jQuery;
Venda.Ebiz.BKList.configBKList = {
    bklist : "",
    divArray : ['#sortby', '.sort_results', '.searchpsel', '.pagn', '#refinelist'],
    removeDivArray : ['.categorytree'],
    enableBklist : true
};


//SEARCH.JS
// Links to: /resources/js/Ebiz.js
// Links to: /resources/js/Venda/Widget/ColourSwatch.js
Venda.Ebiz.BKList.getUrl = function () {
    var curUrl = document.location.href;
    if (curUrl.indexOf("&amp;") != -1) {
        curUrl = curUrl.replace(/&amp;/gi, '&');
    }
    return Venda.Platform.getUrlParam(curUrl, "bklist");
}

// NOT SURE YET
// Links to: /resources/js/Venda/Widget/RegionLangSwitch.js
// Links to: /resources/js/Venda/Widget/ViewStyle.js
// Links to: /templates/widgets/euRegionLanguage/euRegionLanguage.html
// Links to: /templates/widgets/usRegionLanguage/usRegionLanguage.html
Venda.Ebiz.CookieJar = new CookieJar({
        expires : 3600 * 24 * 7,
        path : '/'
    });

// NOT SURE YET
// Links to: /resources/js/Ebiz.js
// Links to: /resources/js/Venda/Widget/Compare.js
// Links to: /resources/js/Venda/Widget/MegaMenu.js
// Links to: /resources/js/Venda/Widget/QuickBuy.js
// Links to: /resources/js/Venda/Widget/RegionLangSwitch.js
// Links to: /resources/js/Venda/Widget/ViewStyle.js
jQuery.fn.popupIframe = function () {
    if (jQuery.browser.msie && jQuery.browser.version < "7.0") {
        var src = 'javascript:false;';
        html = '<iframe class="js-popup-iframe" src="' + src + '" style="-moz-opacity: .10;filter: alpha(opacity=1);height:expression(this.parentNode.offsetHeight+\'px\');width:expression(this.parentNode.offsetWidth+\'px\');' + '"></iframe>';
        if (jQuery(this).find('.js-popup-iframe').length == 0) {
            this.prepend(html);
        }
    }
};
// CHECKOUT.JS
// Links to: /templates/wizr/wz_orsc-screen/mediacodeinput/mediacodeinput.html
/**
 * Media Code
 * Validate and submit media code using ajax if not on basket for in-page display
 * Update minicart figures with ajax too if not on basket
 */
Venda.Ebiz.checkVoucherForm = function () {
    var curstep = jQuery("#tag-curstep").html();
    var str = jQuery.trim(jQuery("#vcode").val());
    if (jQuery("#vcode_submit_shopcart").length > 0) { //if on workflow
            jQuery("#vcode").val(str);
            jQuery("#js-modal-style span").html(jQuery("#js-promo-waitMsg").text());
            jQuery("#js-modal-style").foundation('reveal', 'open');

            // instead of submit, submit in background to check for errors
            if (document.createElement) {
                var oScript = document.createElement("script");
                oScript.type = "text/javascript";

                if (curstep == 'ordersummary') {
                    oScript.src = jQuery("#tag-codehttp").html() + "?ex=co_wizr-promocodehttps&curstep=vouchercode&step=next&mode=process&curlayout=errorsorderconfirm&layout=errorsorderconfirm&vcode=" + jQuery("#vcode").val() + "&action=add";
                }else{
                    oScript.src = jQuery('#tag-codehttp').html() + '?ex=co_wizr-promocodehttp&curstep=vouchercode&step=next&mode=process&curlayout=errors&layout=errors&vcode=' + jQuery("#vcode").val() + '&action=add';
                }
                document.getElementById("ajax-error").appendChild(oScript);
            }
    }
};

// NOT SURE YET
// Links to: /resources/js/Ebiz.js
/**
 * simple popup
 */
Venda.Ebiz.doProtocal = function (url) {
    var protocal = document.location.protocol;
    if (url.indexOf("http:") == 0 && protocal == "https:") {
        url = url.replace("http:", "https:");
    }
    return url;
};

// NOT SURE YET
// Links to: /resources/js/Ebiz.js
// Links to: /templates/icat/productset/productset.html
// Links to: /templates/invt/emailinstock/emailinstock.html
// Links to: /templates/invt/package/package.html
// Links to: /templates/invt/productdetail/productdetail.html
// Links to: /templates/invt/productdetailMulti/productdetailMulti.html
// Links to: /templates/invt/productdetailPackage/productdetailPackage.html
// Links to: /templates/invt/productdetailSet/productdetailSet.html
// Links to: /templates/scat/productreviews/productreviews.html
Venda.Ebiz.initialDialog = function (dialogList) {
    var param = {
        createDialogList : '',
        closeDialogList : '',
        settings : ''
    }
    var options = jQuery.extend(param, dialogList);
    var popupWidth = '500';
    var popupHeight = 'auto';
    var popupClass = '';
    var anchorName = '';
    jQuery(options.createDialogList).on('click',function () {
        Venda.Ebiz.initialDialog.clickedElement = this;
        if (jQuery(this).attr("rel")) {
            var attrRel = jQuery(this).attr("rel").split(",");
            popupWidth = attrRel[0] || '500';
            popupHeight = attrRel[1] || 'auto';
            popupClass = attrRel[2];
            anchorName = attrRel[3];
        }
        jQuery(this).createDialog('dialogContent', {
            'width' : popupWidth,
            'height' : popupHeight
        }, options.closeDialogList, popupClass, anchorName);
        return false;
    });
};

// NOT SURE YET
// Links to: /page/faqs/lang/en/1306417471_0.html
/**
 * Expand contents
 */
Venda.Ebiz.expandContent = function () {
    var txtShow = (jQuery("#txtShow").length != 0) ? jQuery("#txtShow").html() : "";
    var txtHide = (jQuery("#txtHide").length != 0) ? jQuery("#txtHide").html() : "";

    jQuery(".js-toggleContent > div").hide();
    jQuery(".js-toggleContent > h3").each(function () {
        jQuery(this).attr("title", txtShow)
    });
    jQuery(".js-toggleContent > h3").click(function () {
        jQuery(this).toggleClass("js-selected");
        if (jQuery(this).is(".js-selected")) {
            jQuery(this).attr("title", txtHide);
        } else {
            jQuery(this).attr("title", txtShow);
        }
        jQuery(this).next().slideToggle("fast");
    });
};

// find the link that has 'rel=popup' to do the window popup
Venda.Ebiz.findPopUps = function () {
    var popups = document.getElementsByTagName("a");
    for (i = 0; i < popups.length; i++) {
        if (popups[i].rel.indexOf("popup") != -1) {
            // attach popup behaviour
            popups[i].onclick = Venda.Ebiz.doPopUp;
        }
    }
};

// NOT SURE YET comes along with "Venda.Ebiz.findPopUps"
// Links to: /resources/js/Ebiz.js
// Links to: /templates/pcat/helpNavigation/helpNavigation.html
Venda.Ebiz.doPopUp = function (e) {
    //set defaults - if nothing in rel attrib, these will be used
    var type = "standard";
    var strWidth = "780";
    var strHeight = "580";
    //look for parameters
    attribs = this.rel.split(" ");
    if (attribs[1] != null) {
        type = attribs[1];
    }
    if (attribs[2] != null) {
        strWidth = attribs[2];
    }
    if (attribs[3] != null) {
        strHeight = attribs[3];
    }
    if(!e) var e = window.event;
   //e.cancelBubble is supported by IE - this will kill the bubbling process.
    e.cancelBubble = true;
    e.returnValue = false;

    //e.stopPropagation works only in Firefox.
    if ( e.stopPropagation ) e.stopPropagation();
    if ( e.preventDefault ) e.preventDefault();

    type = type.toLowerCase();
    if (type == "fullscreen") {
        strWidth = screen.availWidth;
        strHeight = screen.availHeight;
    }
    var tools = "";
    if (type == "standard") {
        tools = "resizable,toolbar=yes,location=yes,scrollbars=yes,menubar=yes,width=" + strWidth + ",height=" + strHeight + ",top=0,left=0";
    }
    if (type == "console" || type == "fullscreen") {
        tools = "resizable,toolbar=no,location=no,scrollbars=yes,width=" + strWidth + ",height=" + strHeight + ",left=0,top=0";
    }
    newWindow = window.open(this.href, 'newWin', tools);
    newWindow.focus();
};

// NOT SURE YET
// Links to: /resources/js/Venda/Widget/ColourSwatch.js
// Links to: /resources/js/Venda/Attribute/attributes.js
/**
 * Remove any special characterSet
 * @param {string} str - string with any special characters
 * @return {string} str - string WITHOUT any special characters
 */
Venda.Ebiz.clearText = function (str) {
    var iChars = /\$| |,|@|#|~|`|\%|\*|\^|\&|\(|\)|\+|\=|\/|\[|\-|\_|\]|\[|\}|\{|\;|\:|\'|\"|\<|\>|\?|\||\\|\!|\$|\./g;
    return str.replace(iChars, "");
};

// NOT SURE YET
// Links to: /templates/wizr/wz_orcf-screen/wz_orcf-screen.html
Venda.Ebiz.validateGiftcode = function (formName, msg) {
    if (document.forms[formName].giftcode.value == "") {
        alert(msg);
        document.forms[formName].giftcode.focus();
        return false;
    }
    Step2(document.forms[formName], "confirm", "process", "show", "giftcert", "_self", "", "", "", "");
};

// NOT SURE YET
// Links to: /resources/js/Ebiz.js
// Links to: /page/signupforemails/lang/en/1273720905_0.html
// Links to: /templates/invt/emailinstock/emailinstock.html
// Links to: /templates/invt/tellafriend/tellafriend.html
// Links to: /templates/invt/writereview/writereview.html
// Links to: /templates/wizr/wz_orbt-screen/contact_address/contact_address.html
// Links to: /templates/wizr/wz_orzc-screen/singlestep_lookup/contact_address/contact_address.html
// Links to: /templates/wizr/wz_orzc-screen/singlestep_lookup/singlestep_lookup.html
/**
 *  Element - Email newsletter signup / EMWBIS
 */
Venda.Ebiz.checkemail = function (str) {
    var filter = /^\w+[\+\.\w-]*@([\w-]+\.)*\w+[\w-]*\.([a-z]{2,7}|\d+)$/i;
    return (filter.test(str))
};

// NOT SURE YET
// Links to: /templates/widgets/emailSignup/emailSignup.html
Venda.Ebiz.validateEmail = function (mail, msg) {
    if (Venda.Ebiz.checkemail(mail.email.value)) {
        mail.submit();
    } else {
        alert(msg);
        mail.email.focus();
    }
};

// NOT SURE YET
// Links to: /templates/invt/package/package.html
// Links to: /templates/widgets/compareItems/compareItems.html
// Links to: /templates/widgets/lastViewedItems/lastViewedItems.html
// Links to: /templates/widgets/recentSearch/recentSearch.html
// Links to: /templates/widgets/recentlyViewedItems/recentlyViewedItems.html
// Links to: /templates/widgets/recentlyViewedProductDetailSlider/recentlyViewedProductDetailSlider.html
// Links to: /templates/wizr/wz_gift-screen/wz_gift-screen.html
// Links to: /templates/wizr/wz_orcp-screen/wz_orcp-screen.html
/**
 *  addEvent script from http://www.accessify.com/features/tutorials/the-perfect-popup/
 *  This function is moved from 'sitewide.js', so avoid the error.
 */
function addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) {
        elm.addEventListener(evType, fn, useCapture);
        return true;
    } else if (elm.attachEvent) {
        var r = elm.attachEvent('on' + evType, fn);
        return r;
    } else {
        elm['on' + evType] = fn;
    }
};
jQuery(window).on('load resize', function(e) {
	if(!jQuery('html').hasClass('lt-ie9')){
		if (Modernizr.mq('only all and (max-width: 767px)')) {
			// turn modal off if you are on a small device
			jQuery('.js-doDialog').each(function(){
				jQuery(this).attr('target','_blank');
			});
		}
	}
    // load socialButtons
    if(jQuery('#socialButtons').length > 0) {
		if((Modernizr.mq('only screen and (min-width: 768px)')||jQuery('html').hasClass('lt-ie9')) && (!jQuery('#socialButtons').hasClass('js-loaded')) ){
			jQuery('#socialButtons').socialButtons();
			jQuery('#socialButtons').addClass('js-loaded');
		}
    }
});
jQuery(function () {

    Venda.Ebiz.findPopUps();

	//Promotion code redeem - extracted from ordersummary
	jQuery('form[name=promotionform]').on('keypress', '#vcode', function(event) {
        if (event.which == '13') {
            jQuery('#vcode_submit_shopcart').trigger('click');
            return false;
        }
    });
    /**
     * Media Code
     * Hide noscript comment
     * Add listeners to media code form elements
     * This class not used on any templates/page/css
     */
    jQuery(".nonjs").css("display", "none");

    jQuery.fn.textboxCount = function (obj, options) {
        var t_settings = {
            maxChar : 80,
            countStyle : 'down',
            /* up, down*/
            countNegative : false,
            alert : ""
        }
        var settings = jQuery.extend(t_settings, options);
        var t_obj = jQuery(this);

        function addClassCharNumber() {
            jQuery(obj).removeClass("js-textCount js-textCountAlt");
            if (t_objLength <= options.maxChar) {
                jQuery(obj).addClass("js-textCount");
            } else {
                jQuery(obj).addClass("js-textCountAlt");
            }
        }

        function showCharNumber() {
            t_objLength = t_obj.val().length;
            if (options.countStyle == 'up') {
                jQuery(obj).html(t_objLength + "/" + options.maxChar);
            } else if (options.countStyle == 'down') {
                jQuery(obj).html(options.maxChar - t_objLength);
            }
            addClassCharNumber(t_objLength);
        }

        function doAlertMsg(event) {
            var key = event.which;
            if (key >= 33) {
                if (t_obj.val().length >= options.maxChar) {
                    event.preventDefault();
                    alert(options.alert);
                }
            }
        }

        charLength = 0;
        function doCount(event) {
            t_objLength = t_obj.val().length;

            if ((t_objLength <= options.maxChar) || (options.countNegative)) {
                if (options.countStyle == 'up') {
                    charLength = t_objLength;
                    jQuery(obj).html(charLength + "/" + options.maxChar);
                } else if (options.countStyle == 'down') {
                    charLength = options.maxChar - t_objLength;
                    jQuery(obj).html(charLength);
                }
            } else {
                var scrollPos = t_obj.scrollTop();
                t_obj.val(t_obj.val().substring(0, options.maxChar));
                t_obj.scrollTop(scrollPos);

            }
            addClassCharNumber(t_objLength);

            if (options.alert != "") {
                doAlertMsg(event);
            }
        }

        showCharNumber();
        jQuery(this).bind('keydown keyup keypress mousedown', doCount);

        jQuery(this).bind('paste', function (e) {
            // check if right button is clicked
            setTimeout(function () {
                doCount();
                showCharNumber();
            }, 5);
        });
    }

    //view itemperpage/ sort by  dropdown changed a duplicate id
    if (jQuery("#pagnBtm")) {
        if (jQuery("#pagnBtm .js-pagnPerpage label")) {
            //view itemperpage
            jQuery("#pagnBtm .js-pagnPerpage label").attr('for', 'perpagedpdBT');
            jQuery("#pagnBtm .js-pagnPerpage select").attr({
                id : 'perpagedpdBT',
                name : 'perpagedpdBT'
            });
            //sort by
            jQuery("#pagnBtm .js-sort label").attr('for', 'sortbyBT');
            jQuery("#pagnBtm .js-sort select").attr({
                id : 'sortbyBT',
                name : 'sortbyBT'
            });
        }
    }

        // FROM ./templates/workflow/giftcertificates/giftvoucher/giftvoucher.html
        if (jQuery("#giftcertificatesform #comment").length === 1) {
            jQuery("#comment").keypress(function(event) {
                if (this.value.length > 250) {
                // trim if too long
                this.value = this.value.substring(0, 250);
                }
            });
            jQuery("#comment").textboxCount(".js-textMsgCount",{
                maxChar: 250,
                countStyle: 'down',
                alert: ""
            })
        }

    // to reset 'Recent Orders' content every time off-canvas-left is clicked
    jQuery('#js-canvas-left').on('click', function(event) {
        jQuery('#js-recentorders-content').empty();
        jQuery('.js-recentorders a').removeClass('active');
    });

});
jQuery(window).load(function(){
	//for fixing next/previous button of orbit home banner
	if((jQuery('.orbit-container').length > 0) && (jQuery('html').hasClass('lt-ie9'))) {
		jQuery('.orbit-prev, .orbit-next').append('<span></span>');
	}
});
/**
* simple color swatch on productlist/searchresult
* @requires jQuery v1.7.1 or greater
* @param {object} - configutation
*   - contentID: search content ID
*   - selectFirstColor: set to true to enable preselect first color swatch
*/
Venda.namespace("Ebiz.colorSwatch");
Venda.Ebiz.colorSwatch = function(conf){
    var defaults = {
        contentID: '#content-search',
        selectFirstColor: true
    };
    this.conf=jQuery.extend(defaults, conf);
};

Venda.Ebiz.colorSwatch.prototype = {
    init: function(){
            jQuery(this.conf.contentID).on("click", ".js-swatchContainer a", function(){

            var $this = jQuery(this);

            var mainImg      = $this.data("setimage"),
                mainImgObj   = jQuery("#"+ $this.data("prodid") ),
                mediumImg    = $this.data("setimagemedium"),
                detailsObj   = jQuery("#"+ $this.data("detailsid") ),
                prodLink     = mainImgObj.find("a:first").data("prodLink");

            if(mainImg == ""){
                mainImg = mainImgObj.find("a:first").data("defaultImage");
            }

            mainImgObj.find('img:first')
                .attr("src", mainImg)
                .end()
                .find("a:first")
                .attr("href", this.href || "");

            $this.parent("").find("a").removeClass("js-sw-selected");
            $this.addClass("js-sw-selected");
            detailsObj.find(".js-imgSource").html(mediumImg); //reset image source value to corresponding with colour swatch selected
            return false;

        });
        if(this.conf.selectFirstColor){
            jQuery('.js-swatchContainer div').find(" > a:first").click();
        }
    }
};

/**
* prevent missing euro sign if use ajax on IE
* @requires jQuery v1.5 or greater
*/
jQuery(document).ajaxComplete(function() {
    if(jQuery.browser.msie){
        jQuery('#term .js-refine-list, .js-prod-price, #pricerangevalues, #updateTotal').html(function(idx, price) {
            return price.replace(/\u0080([\d.]+)/g, "\u20ac$1");
        });
    }
});



// function calls that used to be in line //

if (jQuery('#sliderlist').length > 0){
    jqSlider({
        sliderID:'sliderlist',
        displayCount: 5,
        slideAmtNum: 1,
        slideLeft:'slideLeft',
        slideRight:'slideRight',
        duration: 0.3});
    if (is_touch_device()) { // these classes are not in any templates/page/css
        jQuery('.sliderWrapper').css('overflow','auto');
        jQuery('.sliderBt').remove();
    }
}

if (jQuery('#showRVI').length > 0){
    var venda_invtref = jQuery('#tag-invtref').text();
    Venda.Widget.RecentlyViewedItems.setRecentlyViewedItems(venda_invtref, (venda_invtref, 10));
}

if (jQuery('#showRVISiteWide').length > 0){
    Venda.Widget.RecentlyViewedItems.setRVISiteWide(Venda.Platform.CookieJar)
}

if (jQuery('.js-toggleContent').length > 0){
    Venda.Ebiz.expandContent()
}

//workaround solution: "Add to Basket" button should be disabled when product is out of stock
if (jQuery('.quickshop').length > 0){
    if (jQuery('.js-oneProduct').length == jQuery('.js-prodoutofstock').length){
        jQuery('.js-addproduct').attr('disabled', 'true');
        jQuery('.js-addproduct').css('opacity','0.5');
    }
}

jQuery(document).bind('quickbuy-loaded', function(){
    Venda.Attributes.Initialize();
    jQuery('.cloud-zoom, .cloud-zoom-gallery').CloudZoom();
});


/**
* remove product from quick shop page
* @param {string} the sku removed
*/
Venda.Ebiz.qshopRemove = function(invtref){
    var curUrl = document.location.href;
    var newUrl = curUrl.replace(invtref,'');
    var dialogOpts = {modal: true,autoOpen: false,width:'320px'};
    jQuery("#waitMesg").dialog(dialogOpts);
    jQuery("#waitMesg").dialog("open");
    document.location.href = newUrl;
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

Venda.Ebiz.submitFormModal = function(formName){
	var obj = jQuery('form[name='+formName+']');
	var URL = obj.attr('action');
	obj.find('input[name="layout"]').val('noheaders');
	var params = obj.find("input, select, textarea").serialize();/* get the value from all input type*/
	jQuery.ajax({
		type : "GET",
		url : URL,
		dataType : "html",
		data : params,
		cache : false,
		error : function () {
			jQuery(".js-modalContent").html('Error!');
		},
		success : function (data) {
			jQuery(".js-modalContent").html(data);
		}
	 });
	 return false;
};
Venda.Ebiz.doModalContent = function(){
	jQuery("#helpNavigation a").click(function() {
		var url = Venda.Ebiz.doProtocal(jQuery(this).attr("href"));
		jQuery(".js-staticContent").load(url +'&layout=noheaders' , function(){
			if (jQuery('.js-toggleContent').length > 0){
				Venda.Ebiz.expandContent();
			}
			if (jQuery('#contactForm').length > 0){
				 jQuery("body").trigger("contact-loaded");
			}
		});
		return false;
	});
};

/*Venda.Ebiz.customSelect = function(){
if (!jQuery('html').hasClass('lt-ie8')) {
	if(jQuery('.js-custom select').length > 0) {
		jQuery('.js-custom select').each(function(){
			if(jQuery(this).next('.js-select').length == 0){
				var title = jQuery(this).find('option:first').text() || '';
				if( jQuery('option:selected', this).val() != ''  ) {
					title = jQuery('option:selected',this).text();
				}
				jQuery(this).css({'z-index':10,'opacity':0,'-khtml-appearance':'none'}).after('<span class="js-select"><span class="js-selected">' + title + '</span><i class="icon-angle-down marg-side right"></i></span>');

				jQuery(this).change(function(){
					val = jQuery('option:selected',this).text();
					jQuery(this).next().find('.js-selected').text(val);
				});
			}
		});
	}
}
};*/

Venda.Ebiz.doModal = function(){
	jQuery(".js-doDialog").on('click',function(e) {
        // ONLY do if screen size is equal/more than 768 or is less than IE9
        if (Modernizr.mq('only all and (min-width: 768px)')||jQuery('html').hasClass('lt-ie9')) {
    		var url = Venda.Ebiz.doProtocal(jQuery(this).attr("href"));
    		var layout = jQuery(this).attr("data-layout") || "noheaders";

            jQuery("#vModal").foundation('reveal', 'open');
            jQuery("#vModal .js-modalContent").html('<div class="text-center"><i class="icon-spinner icon-spin icon-4x text-center"></i></div>');

    		jQuery("#vModal .js-modalContent").load(url + '&layout='+layout , function(){
    			if (jQuery('.js-toggleContent').length > 0){
    				Venda.Ebiz.expandContent();
    			}
                if(jQuery("#helpNavigation").length > 0){
    				Venda.Ebiz.doModalContent();
                }
    			if(jQuery('#tellafriend').length > 0) {
    				jQuery("#field1").textboxCount(".js-textMsgCount",{
    					maxChar: 200,
    					countStyle: 'down',
    					alert: ""
    				});
    			}
    			jQuery("#back_link").on('click',function() {
    				jQuery("#vModal").foundation('reveal', 'close');
    				return false;
    			});
    		});
    		return false;
        }
    });
};

jQuery(function(){
	if(jQuery('#emailSignup').length > 0){
		Venda.Ebiz.emailSignup();
	}

	if(jQuery(".js-doDialog").length > 0) {
		Venda.Ebiz.doModal();
	}
	//Venda.Ebiz.customSelect();
/**
* for digital downloads
*/
	if(jQuery('#ordersummary .js-downloadProduct, #orderreceipt .js-downloadProduct').length > 0){
		jQuery('.js-downloadProduct').parents('.js-productItem').find('.js-downloadText').show();
		jQuery('.js-downloadProduct').parents('.js-productItem').find('.js-giftcertText').hide();
		jQuery('.js-downloadProduct').parents('.js-productItem').find('a.prod-gift-wrap-item').hide();
		jQuery('.js-downloadProduct').parents('.js-productItem').find('a.prod-diff-ship-item').hide();
	}
});

jQuery(document).bind('quickview-loaded', function() {
  Venda.Attributes.Initialize();
  Venda.Widget.handleCloudzoom.setCloudzoom();
});
