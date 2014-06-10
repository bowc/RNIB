/**
* @fileoverview Venda.Widget.ViewStyle
 * Grid / List / Image View
 * Using the cookie to keep the current style
 * Cookie Name : setView
 * Cookie Value : Grid / List / Image  [default 'js-viewGrid']
 * Cookie Name PerPage : setViewPerPage
 * Cookie PerPage Value : 16 - itemperpage [default '16']
 * Add class name as each the style (js-iconList, js-iconGrid, js-iconImage)
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 * @edited Juanjo Dominguez <jdominguez@venda.com> (change class names to camel case convention, and changed "-on" suffix for "Active")
*/
Venda.namespace("Widget.ViewStyle");
var viewStyleCookieName = "setView";
var cookieNamePerPage = "setViewPerPage";

Venda.Widget.ViewStyle.getUrlParam = function(url,urlParam) {
	var re = new RegExp('[?&]'+urlParam+'=([^&]+)');
	var match = url.match(re);
	return match ? unescape(match[1]) : false;
};
Venda.Widget.ViewStyle.setCookieForViewStyle = function(){
	if(!Venda.Ebiz.CookieJar.get(viewStyleCookieName)){
		Venda.Ebiz.CookieJar.put(viewStyleCookieName,"Grid");
	}
	jQuery(document).on('click', '.js-viewProduct', function(){
		var view =  this.id;
		var viewPath = jQuery(this).attr("href");
		var perPage = Venda.Widget.ViewStyle.getUrlParam(viewPath, 'setperpage') ||  Venda.Widget.ViewStyle.getUrlParam(viewPath, 'itemsperpage') || Venda.Widget.ViewStyle.getUrlParam(viewPath, 'perpage');
		Venda.Ebiz.CookieJar.put(cookieNamePerPage,perPage);
		Venda.Ebiz.CookieJar.put(viewStyleCookieName,view);
		Venda.Widget.ViewStyle.addClassForViewStyle(viewStyleCookieName);
		return false;
	});
};
Venda.Widget.ViewStyle.addClassForViewStyle = function(viewStyleCookieName){
	var getViewCookie = Venda.Ebiz.CookieJar.get(viewStyleCookieName);
	jQuery(".js-viewstyle").removeClass('js-viewList js-viewGrid js-viewImage');
	jQuery(".js-viewstyle").addClass("js-view"+getViewCookie);
	jQuery(".js-viewProduct").removeClass("js-iconListActive js-iconGridActive js-iconImageActive");
	jQuery(".js-iconView .js-icon"+getViewCookie).addClass("js-icon"+getViewCookie+"Active");

};
/**
* Display Product Preview
*/
Venda.Widget.ViewStyle.showProductPreview = function(){
	var timeoutHandle ="";
	var dialogOpts = {title: '', minHeight:433, width:330,autoOpen: false, closeOnEscape: true, resizable: false, dialogClass: 'js-imgView'};
	jQuery("#productPreview").dialog(dialogOpts);
	jQuery("#productPreview").css("width","330");
	jQuery(document).on('mouseenter mouseleave', '.js-viewImage .js-prod-image a', function(){
	if(e.type == "mouseenter"){
		var id = this.id;
		var prodName = jQuery("#details-"+id+" h2").html();
		jQuery("#productPreview").dialog("option", "title", prodName);
		jQuery(".js-productPrice").html(jQuery("#details-"+id+" .js-prod-price").html());
		jQuery(".js-productDesc").html(jQuery("#details-"+id+" .js-prod-invtdesc2").html());
		jQuery(".js-productPreviewImage img").attr("src",jQuery("#details-"+id+" .js-imgSource").html());
		jQuery("#productPreview").dialog("open");
		jQuery(".js-imgView").hide();
		jQuery(".js-imgView").popupIframe();
		jQuery(".js-imgView").show();
		jQuery(".js-productPreviewArrow").removeClass("js-arrowLeft js-arrowRight js-arrowTop js-arrowBottom");
			var offset=jQuery(this).offset();
			var W=jQuery(window).width();
			var H=jQuery(window).height();
			var w=jQuery(this).width();
			var h=jQuery(this).height();
			var Hw=jQuery(".js-imgView").width();
			var Hh=jQuery(".js-imgView").height();
			var left=offset.left;
			var top=offset.top;
			var T=offset.top;

			if((W-left-w) > Hw){
				left=left+w;
				jQuery('.js-productPreviewArrow').addClass("js-arrowLeft");
			}else{
				left=left-Hw;
				jQuery('.js-productPreviewArrow').addClass("js-arrowRight");
			}
			if(top>Hh){
				top = (top - Hh) + h;
				jQuery('.js-productPreviewArrow').addClass("js-arrowBottom");
			}else{
				top=top;
				jQuery('.js-productPreviewArrow').addClass("js-arrowTop");
			}
			jQuery(".js-imgView").css({"left":left,"top":top});
	}else{
		jQuery(".js-imgView").hide();
		jQuery("#productPreview").dialog("close");
		jQuery(".js-productPreviewImage img").attr("src","");
	}
	});
 };