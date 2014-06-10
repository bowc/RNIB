/**
 * @fileoverview Venda.Widget.Tracking - Creates variables for use in tracking scripts, e.g. Google Analytics
 *
 * @requires resources/js/external/jquery-1.8.3.min.js (jQuery)
 * @requires templates/tracking/shared/tagsForJs
 * @requires templates/tracking/shared/workflowSteps
 * @requires templates/tracking/shared/orderReceipts
 * @requires templates/order/itemJSON
 * The data used to populate the variables is contained in hidden divs in the required templates stated before the functions.
 * This file must be loaded before any tracking scripts that use it's variables
 *
 * @author Oliver Secluna <oliversecluna@venda.com>
 */

// Initiate namespacing

Venda.namespace('Widget.Tracking');

/**
 * Function used to pass current workflow step to tracking javascript
  * Requires templates/tracking/shared/workflowSteps
 */
Venda.Widget.Tracking.Step = function () {
    if (jQuery("#tag-workflow").length > 0){

        var workflowStep = jQuery("#tag-workflow").html() + "/",
            curstep = jQuery("#tag-curstep").html().replace(/^\s+|\s+$/g, "");

        workflowStep += curstep;

        if (jQuery("#tag-emptytemplate").length > 0){
            workflowStep += "/empty";
        }

        if (jQuery("#tag-errorsboolean").length > 0){
            workflowStep += "/error";
        }

        return workflowStep;
    }
    return false;
};

/**
 * Create object to pass session-level variables to tracking javascipt
 * Requires templates/mainIncludes/tagsForJs
 */

Venda.Widget.Tracking.Ses = function () {
    var obj = {
        lang : jQuery("#tag-sessionlanguage").html(),
        locn : jQuery("#tag-sessionlocation").html(),
        usid : jQuery("#tag-usrfnbr").html(),
        ustype : jQuery("#tag-ustype").html(),
        group : jQuery("#tag-usgrref").html()
    };
    switch (obj.ustype) {
    case 'R':
        obj.ustype = 'Registered';
        break;
    case 'P':
        obj.ustype = 'Partially Registered';
        break;
    case 'E':
        obj.ustype = 'Email-Only';
        break;
    default:
        obj.ustype = 'Guest';
    }
    return obj;
};

/**
 * Create object to pass search information to tracking javascipt
 * Requires templates/search/defaultResults
 */

Venda.Widget.Tracking.Search = function () {
    return {
        term : jQuery("#tag-primarysearchtext").html(),
        results : jQuery("#tag-totalresults").html()
    };
};

/**
 * Create array to store order item objects
 * Requires templates/tracking/shared/orderReceipt & templates/order/itemJSON
 */
Venda.Widget.Tracking.orditemsArray = []; //Create array to store order item objects

/* Function to push order item objects to array */
Venda.Widget.Tracking.orditemJSON = function(orditemObj) {
    this.orditemsArray.push(orditemObj);
};