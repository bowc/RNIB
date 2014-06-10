/**
 * @fileoverview Venda.CountrySelect
 *
 * Rearange country dropdown list to show top most popular countries first.
 * Manage a country specific registration form display.
 *
 * @author Donatas Cereska <dcereska@venda.com>
 */

Venda.namespace('CountrySelect');


/**
 * Stub function is used to support JSDoc.
 * @class Venda.CountrySelect
 * @constructor
 */

Venda.CountrySelect = function () {};


 /**
 * Initiate an empty object to collect the country data printed from within the
 */

Venda.CountrySelect.countryAndData = {};

Venda.CountrySelect.Init = function() {

    var topCountries;

    switch(jQuery('#venda_locn').text()) {

        case 'uk':
            topCountries = [
            'United Kingdom',
            'Ireland',
            'France',
            'Germany',
            'Spain',
            'Italy'
            ];
        break;

        case 'us':
            topCountries = [
            'United States',
            'Canada',
            'Mexico',
            'Brazil'
            ];
        break;

        //restoftheworld
        default:
            topCountries = [
            'United States',
            'United Kingdom',
            'France',
            'Germany',
            'Spain',
            'Italy'
            ];

    }

    var el = {
        countrySelect           :       jQuery('select#cntrylist'),
        countrySelectOption :       jQuery('select#cntrylist option'),
        stateSelect             :       jQuery('select#statelist'),
        stateText                   :       jQuery('input#stateText'),

        houseNum                    :       jQuery('#houseNum'),
        houseNumInput           :       jQuery('input#num'),
        zipLabel                    :       jQuery('#zipcLabel'),
        zipInput                    :       jQuery('#zipc'),

        countyDiv                   :       jQuery('#stateDiv'),
        countyLabel                 :       jQuery('#stateLabel'),
        countyInput                 :       jQuery('#statelist'),
        countyText              :       jQuery('#statetext'),

        addresslookup   :   jQuery('.js-addresslookup'),
        postcodeLookup          :       jQuery("#postcodelookup")
    };
    var selectOptions = {};

    el.stateSelect.change(function() {
		if(jQuery('#statelist option:selected').index() > 0){
			el.countyText.val(Venda.CountrySelect.countryAndData[jQuery("#cntrylist option:selected").val()][jQuery('#statelist option:selected').index() -1].split(':')[0]);
		}
    });

    el.countrySelectOption.each(function(index) {
        selectOptions[index] = jQuery(this).text();
    });


    if(topCountries.length > 0) {
        //el.countrySelect.prepend('<option value="-" disabled>-</option>');
        var matchDiff = 0;
        for(var i = (topCountries.length-1); i >= 0; i--) {
            for(key in selectOptions) {
                if(selectOptions[key] == topCountries[i]) {
                    jQuery("select#cntrylist option[value='" + topCountries[i] + "']").remove();
                    el.countrySelect.prepend("<option value='" + topCountries[i] + "'>" + topCountries[i] + "</option>");
                    matchDiff++;
                }
            }
        }
        matchDiff = topCountries.length - matchDiff;
        el.countrySelect.prepend(jQuery('select#cntrylist option').get(topCountries.length - matchDiff + 1));
    }


    if(jQuery('#venda_cntry').text().length > 0) {
        Venda.CountrySelect.SetCountry(jQuery('#venda_cntry').text(), el, true);
        jQuery("select#cntrylist option[value='" + jQuery('#venda_cntry').text() + "']").attr("selected","selected");
    } else {
        Venda.CountrySelect.SetCountry(null, el, true);
        jQuery('select#cntrylist option').get(0).setAttribute("selected","selected");
    }

    el.countrySelect.change(function () {
        jQuery("#zipc").parents("form").validate().resetForm();
        Venda.CountrySelect.SetCountry(jQuery(this).val(), el, false);
    });

    var hideWrapper = setTimeout(function() {
        jQuery('select#statelist').closest('.ui-select').hide();
    }, 100);
};


jQuery(window).load(function() {
    if(jQuery('select#cntrylist').length > 0){
        //Attach event to lookup button and enter key
        jQuery("#js-lookupBtn").on("click", function(e){
            e.preventDefault();
            jQuery("#zipc").rules("remove", "populatedaddress");
            jQuery("#zipc").parents("form").validate().resetForm();

            Venda.Checkout.addressList();

        });
        jQuery(".js-addaddressform, .js-editaddressform").on({
            keypress: function(event) {
                if(event.keyCode===13){
                    event.preventDefault();
                    if(jQuery("#js-lookupBtn").is(':visible')) {
                        jQuery("#js-lookupBtn").trigger("click");
                    }
                }
            }
        }, "#zipc");

        Venda.CountrySelect.Init();

        var enterManually   = jQuery('#js-enterManually').text(),
            lookup          = jQuery('#js-lookupBtn span').text();

        //Attach event to enter manually link
        jQuery(document).on('click','#js-enterManually',function(){
            jQuery(this).toggleClass('js-manually');
            if(jQuery(this).is('.js-manually')) {
                jQuery("#js-hideOrShowAddress").show();
                jQuery(this).text(lookup);
                jQuery('#zipcDiv').show();
                jQuery('#js-lookupBtn,#addresslookup,#js-search-again').hide();
                // remove validation rules and placeholder when haven't used postcode lookup
                jQuery("#zipc").parents("form").validate().resetForm();
                jQuery("#zipc").rules("remove", "populatedaddress");
            } else {
                jQuery("#js-hideOrShowAddress").hide();
                jQuery(this).text(enterManually);
                jQuery('#js-lookupBtn,#addresslookup').show();
                jQuery('#uklist,#js-search-again').hide();
                jQuery("#zipc").val("");
                // add validation rules and placeholder back to the field when back to postcode lookup again
                jQuery("#zipc").parents("form").validate().resetForm();
                jQuery("#zipc").rules("add", "populatedaddress");
            }
        });
    }

    // Need to setTimeout to trigger 'enter manually' link for edit address form
    var expandedFields = setTimeout(function() {
        if(jQuery('.js-editaddressform').length>0) jQuery('#js-enterManually').click();
    }, 1);
});

Venda.CountrySelect.changePlaceholder = function(PHinput, textID){
    if(PHinput.attr("placeholder")){
        PHinput.attr("placeholder",jQuery(textID).text());
		PHinput.val(PHinput.val());
    }
};


// Populate input according to selection
//el.stateText.val(jQuery("select#statelist option[option='" + jQuery('#venda_state').text() + "']"));

Venda.CountrySelect.SetCountry = function(cntry, el, isFirstLoad) {

    //el.countyText.val('');
	jQuery("#statetext").attr('name','state');
    switch(cntry) {

        case 'United States':
            Venda.CountrySelect.ShowHide('hide', el.houseNum);
            Venda.CountrySelect.ShowHide('show', el.countyDiv);
            Venda.CountrySelect.ShowHide('hide', el.countyText);
            Venda.CountrySelect.ShowHide('show', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#js-hideOrShowAddress, #zipcDiv").show(); //set it back
			jQuery('select#statelist').next('.js-select').show();
            el.countyLabel.text(jQuery('#user_details_label_us_state').text());
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_us_zip').text());
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_placeholder_us_zip');
            Venda.CountrySelect.changePlaceholder(el.countyInput,'#user_details_label_us_state');
            el.postcodeLookup.addClass("hide");
            isRequiredField = true;
			jQuery("#statetext").attr('name','');
            jQuery("#statelist").rules("add", "required");
            jQuery("#zipc").rules("add", "required");
            jQuery("#num").rules("remove", "required");
			jQuery("#statelist").parents("form").validate().resetForm();
            jQuery("#zipc").rules("remove", "populatedaddress");

        break;

        case 'United Kingdom':
            Venda.CountrySelect.ShowHide('show', el.houseNum);
            Venda.CountrySelect.ShowHide('show', el.countyDiv);
            Venda.CountrySelect.ShowHide('show', el.countyText);
            Venda.CountrySelect.ShowHide('hide', el.countyInput);
            Venda.CountrySelect.ShowHide('show', el.addresslookup);

            jQuery('select#statelist').next('.js-select').hide();
            el.countyLabel.text(jQuery('#user_details_label_uk_county').text());
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text());
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_non_us_postcode_lookup');
            Venda.CountrySelect.changePlaceholder(el.countyText,'#user_details_label_uk_county');
            el.postcodeLookup.removeClass("hide");
            isRequiredField = false;
            jQuery("#statelist").rules("remove", "required");

            // The following things are for separating a different behaviour between 'ADD/ EDIT' address
            var clickedManually = (jQuery('#js-enterManually').text() == jQuery('#js-lookupBtn span').text()) ? true : false;
            if(jQuery('.js-addaddressform').length > 0) {
                // ADD ADDRESS
                jQuery("#zipc").rules("add", "required populatedaddress");
                jQuery("#uklist").hide(); // hiding address dropdown if it's exist
                if (isFirstLoad) {
                    jQuery("#js-hideOrShowAddress").hide();
                }
                if(!clickedManually) {
                    //change to UK but haven't clicked on 'Enter Manually' yet
                    jQuery("#js-hideOrShowAddress").hide();
                }
            }
            if(jQuery('.js-editaddressform').length > 0) {
                // EDIT ADDRESS
                jQuery("#js-hideOrShowAddress, #zipcDiv").show();
               if(!clickedManually) {
                    //change to UK and 'Enter Manually' clicked
                   jQuery("#js-enterManually").click();
                }
            }
        break;

        case 'Germany':
            Venda.CountrySelect.ShowHide('show', el.houseNum);
            Venda.CountrySelect.ShowHide('hide', el.countyDiv);
            Venda.CountrySelect.ShowHide('hide', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#js-hideOrShowAddress, #zipcDiv").show(); //set it back
            jQuery('select#statelist').next('.js-select').hide();
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text());
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_non_us_postcode');
            el.postcodeLookup.removeClass("hide");
            isRequiredField = false;
            jQuery("#statetext").rules("remove", "required");
            jQuery("#zipc").rules("remove", "required populatedaddress");

        break;

        case 'France':
            Venda.CountrySelect.ShowHide('show', el.houseNum);
            Venda.CountrySelect.ShowHide('hide', el.countyDiv);
            Venda.CountrySelect.ShowHide('hide', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#js-hideOrShowAddress, #zipcDiv").show(); //set it back
            jQuery('select#statelist').next('.js-select').hide();
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text());
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_non_us_postcode');
            el.postcodeLookup.removeClass("hide");
            isRequiredField = false;
            jQuery("#statetext").rules("remove", "required");
            jQuery("#zipc").rules("remove", "required populatedaddress");

        break;

        case 'Spain':
            Venda.CountrySelect.ShowHide('hide', el.houseNum);
            Venda.CountrySelect.ShowHide('show', el.countyDiv);
            Venda.CountrySelect.ShowHide('show', el.countyText);
            Venda.CountrySelect.ShowHide('hide', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#js-hideOrShowAddress, #zipcDiv").show(); //set it back
            jQuery('select#statelist').next('.js-select').hide();
            el.countyLabel.text(jQuery('#user_details_label_non_us_uk_region').text());
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text());
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_non_us_postcode');
            Venda.CountrySelect.changePlaceholder(el.countyText,'#user_details_label_non_us_uk_region');
            el.postcodeLookup.removeClass("hide");
            isRequiredField = false;
			jQuery("#statelist").rules("remove", "required");
            jQuery("#statetext").rules("remove", "required");
            jQuery("#zipc").rules("remove", "required populatedaddress");

        break;

        case 'Canada':
            Venda.CountrySelect.ShowHide('hide', el.houseNum);
            Venda.CountrySelect.ShowHide('show', el.countyDiv);
            Venda.CountrySelect.ShowHide('hide', el.countyText);
            Venda.CountrySelect.ShowHide('show', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#js-hideOrShowAddress, #zipcDiv").show(); //set it back
            jQuery('select#statelist').next('.js-select').show();
            el.countyLabel.text(jQuery('#user_details_label_us_state').text());
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_us_zip').text());
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_placeholder_us_zip');
            Venda.CountrySelect.changePlaceholder(el.countyInput,'#user_details_label_us_state');
            el.postcodeLookup.addClass("hide");
            isRequiredField = true;
			jQuery("#statetext").attr('name','');
            jQuery("#statelist").rules("add", "required");
			jQuery("#statetext").parents("form").validate().resetForm();
            jQuery("#zipc").rules("remove", "populatedaddress");

        break;

        default:
            Venda.CountrySelect.ShowHide('show', el.houseNum);
            Venda.CountrySelect.ShowHide('show', el.countyText);
            Venda.CountrySelect.ShowHide('hide', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#js-hideOrShowAddress, #zipcDiv").show(); //set it back
            jQuery('select#statelist').next('.js-select').hide();
            el.countyLabel.text(jQuery('#user_details_label_non_us_uk_region').text());
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text());
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_non_us_postcode');
            Venda.CountrySelect.changePlaceholder(el.countyText,'#user_details_label_non_us_uk_region');
            el.postcodeLookup.addClass("hide");
            isRequiredField = false;
			jQuery("#statelist").rules("remove", "required");
            jQuery("#statetext").rules("remove", "required");
            jQuery("#zipc").rules("remove", "required populatedaddress");

        break;

    };

    if(cntry && Venda.CountrySelect.countryAndData[cntry]) {
        var state_options = "<option value=''>" + jQuery("#please_select_multi_dot").text() + "</option>";
        for(var i = 0; i < Venda.CountrySelect.countryAndData[cntry].length; i++) {
            if(typeof(Venda.CountrySelect.countryAndData[cntry][i]) == 'string'){
                state_options+="<option value='" + Venda.CountrySelect.countryAndData[cntry][i].split(':')[0] + "'>" + Venda.CountrySelect.countryAndData[cntry][i].split(':')[1] + "</option>";
            }
            Venda.CountrySelect.ShowHide('show', el.stateSelect);
        }
        el.stateSelect.html(state_options);
        if(typeof Venda.CountrySelect.countryAndData[cntry][0] != 'undefined') {
            el.countyText.val(Venda.CountrySelect.countryAndData[cntry][0].split(':')[0]);
        }
        if(jQuery('#venda_state').text().length > 0) {
            jQuery("select#statelist option[value='" + jQuery('#venda_state').text() + "']").attr("selected","selected");
        }
		jQuery("#statetext").val(jQuery('#venda_state').text());
        jQuery('select#statelist').next('.js-select').find('span.js-selected').text(jQuery("select#statelist option:selected").text());
    }
};


Venda.CountrySelect.ShowHide = function(act, el) {

    if(el) {
         switch(act) {

            case 'show':
                jQuery('#' + el.attr('id') + ' :input').css('display','inline-block');
                el.show();
            break;

            case 'hide':
                el.hide();
                jQuery('#' + el.attr('id') + ' :input').css('display','none').val('');
            break;

        };
    };

}