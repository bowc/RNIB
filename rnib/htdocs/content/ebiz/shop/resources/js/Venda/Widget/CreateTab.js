/**
* jQuery plugin for display tabview please create css by class name .js-tabview
* @requires /venda-support/js/external/jquery-1.4.x.min.js
* @param {String} id of element
* @param {object}
*		activeIndex: set active index
* 		className: set class name for styling
*		hideEmpty: if this true hide tab that not has text inside
*		totalHide: total hidden tab
*		callBack():  the function that call after tab clicked
* @author Sakesan Panjamawat (Auii) <sakp@venda.com>
*/
Venda.namespace("Widget.createTab");

Venda.Widget.createTab = function(ID,config) {
	var defaults = {
		activeIndex:0,
		className:"js-tabview",
		hideEmpty:true,
		callBack:function(){}
	};
	this.totalHide=0;
	/* pass option from agrument to default */
	this.options=jQuery.extend(defaults, config);
	this.tabID=ID;
};

Venda.Widget.createTab.prototype= {
	/**
	 * Tab options
	 * @type Object
	 */
	options:{},
	/**
	 * Total empty tab
	 * @type Number
	 */
	totalHide: null,
	/**
	 *  The element containing the tab
	 * @type jQuery Element
	 */
	tabElement: null,
	/**
	 *  The element containing the tab nav
	 * @type jQuery Element
	 */
	tabNav: null,
	 /**
	 * Set up the slider functionality.
	 */
	init: function(){
		jQuery(this.tabID).addClass(this.options.className);
		this.tabNav=jQuery(this.tabID).find(".js-tab-header > .js-tab-nav li a");
		this.tabElement=jQuery(this.tabID).find(".js-tab-content > .js-tab");
		/* hide Empty tab first if options.hideEmpty was set */
		if(this.options.hideEmpty){
			this.hideEmptyTab(this.tabID);
		}
		if(this.totalHide<this.getTotalTab()){
			this.setActiveTab(this.options.activeIndex);
			/* pass this object into this.clickedTab for set/get tab options */
			this.tabNav.bind("click",{scope: this},this.clickedTab);
		}else{
			jQuery(this.tabID).hide();
		}
	},
	hideEmptyTab: function(ID){
		var totalHide=0,txt="";
		var activeTab = this.options.activeIndex;
		var setNewactiveTab = false;
		jQuery(ID).find(".js-tab-header > .js-tab-nav li").each(function(i){
			txt=jQuery(ID).find(".js-tab-content > .js-tab").eq(i).text();
			txt=jQuery.trim(txt);
			if(txt.length==0){
				totalHide++;
				jQuery(ID).find(".js-tab-header > .js-tab-nav li").eq(i).hide();
				jQuery(ID).find(".js-tab-content > .js-tab").eq(i).hide();
				if(i==activeTab){ setNewactiveTab=true; }
			}
		});
		if(setNewactiveTab){this.options.activeIndex=jQuery(ID).find(".js-tab-header > .js-tab-nav li:visible").index(ID+' .js-tab-header > .js-tab-nav li');this.setActiveTab(this.options.activeIndex);}
		this.totalHide=totalHide;
	},
	/**
	 * active tab
	 * @type function
	 */
	setActiveTab: function(index){
		/* remove all class active from .js-tab-nav li and hide all tab first */
		this.tabNav.parent().removeClass("js-tab-active");
		this.tabElement.hide().removeClass("js-tab-active");
		/* set class active to tab and .js-tab-nav li */
		this.tabNav.eq(index).parent().addClass("js-tab-active");
		this.tabElement.eq(index).addClass("js-tab-active").show();
	},
	/**
	 * get tab number
	 * @type function
	 */
	getTotalTab: function(){
		return this.tabNav.length;
	},
	/**
	 * even on clicked tab
	 * @type function
	 */
	clickedTab: function(evt){
		/* prevent from event click */
		evt.preventDefault();
		/* pass obect::createTab for set active index and active Callback function  */
		var obj =evt.data.scope;
		/* find clicked tab index */
		obj.options.activeIndex=obj.tabNav.index(jQuery(this));
		/* do activeTab */
		obj.setActiveTab(obj.options.activeIndex);
		/* do callback(); */
		obj.options.callBack();
	}
};