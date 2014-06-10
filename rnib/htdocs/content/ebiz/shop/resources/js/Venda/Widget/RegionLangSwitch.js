Venda.namespace("Widget.RegionSwitch");

jQuery("#flag").click(function(e){ 
    e.preventDefault();
    jQuery("#flagContent, #regionLangContent").toggle("300");   
});

jQuery("#flagContent, #regionLangContent").mouseleave(function(e) {
    e.preventDefault();
    jQuery("#flagContent, #regionLangContent").fadeOut("300"); 
});

jQuery(document).on("click", "#regionLangContent li a,#selectRegion li a", function(){
    var $this = jQuery(this),
    region  = $this.data('region') ? $this.data('region') : jQuery('#tag-sessionlocation').text(),
    lang    = $this.data('lang') ? $this.data('lang') : jQuery('#tag-sessionlanguage').text();
    Venda.Widget.RegionSwitch.redirect(lang,region);
}); 

Venda.Widget.RegionSwitch.redirect = function(lang,region){
    window.location = window.location.protocol + "//" + window.location.host + '/'+ lang + '/' + region + '/page/home';
};