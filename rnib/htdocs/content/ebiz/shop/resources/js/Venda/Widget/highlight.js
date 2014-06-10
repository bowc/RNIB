/**
* This script applies to a top nav (single line) menu, multilevel / Mega Menu and category highlighting *
* @requires jQuery.js *
*/
//create namespace for Highlight
Venda.namespace('Widget.Highlight');

Venda.Widget.Highlight.initialize = function () {

	var Settings = {

		// ON - true | OFF - false
		topnav: 		true,
		multimenu: 	true,
		category: 		true

	};

	Venda.Widget.Highlight.menuHighlight(Settings);

};


Venda.Widget.Highlight.menuHighlight = function (obj) {

	var referenceAsString = document.getElementById("tags_cattree").innerHTML;
	referenceAsString = referenceAsString.replace(/\s+/g," ");

	var references = referenceAsString.split(",");

 	for (var i = 0; i < references.length; i++) {

		references[i] = references[i].split(' ').join('');

		switch (i) {
			case 0:
				if(obj.topnav) jQuery("#topnav" + references[i]).addClass("js-topnav-active");
				if(obj.multimenu) jQuery("#mm_icat" + references[i]).addClass("js-mm-active1");
				if(obj.category) jQuery("#categoryNavigation #nav" + references[i] + " a:first").addClass("js-nav-active1");
				if(obj.category) jQuery("#helpNavigation #nav" + references[i] + " a:first").addClass("js-nav-active1");
			break;
			case 1:
				if(obj.multimenu) jQuery("#mm_sub" + references[i]).addClass("js-mm-active2");
				if(obj.category) jQuery("#categoryNavigation #nav" + references[i] + " a:first").addClass("js-nav-active2");
				if(obj.category) jQuery("#helpNavigation #nav" + references[i] + " a:first").addClass("js-nav-active2");
			break;
			case 2:
				if(obj.multimenu) jQuery("#mm_sub" + references[i]).addClass("js-mm-active2");
				if(obj.category) jQuery("#categoryNavigation #nav" + references[i] + " a:first").addClass("js-nav-active2");
				if(obj.category) jQuery("#helpNavigation #nav" + references[i] + " a:first").addClass("js-nav-active2");
			break;
		}

	}


};

jQuery(document).ready(function () {

	if (Venda.Widget.Highlight.initialize && document.getElementById("tags_cattree") !== null) {
		Venda.Widget.Highlight.initialize();
	};

});