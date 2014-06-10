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

        addresslookup   :   jQuery('.addresslookup'),
        postcodeLookup          :       jQuery("#postcodelookup")
    };
    var selectOptions = {};

    el.stateSelect.change(function() {
        el.countyText.val(Venda.CountrySelect.countryAndData[jQuery("#cntrylist option:selected").val()][jQuery('#statelist option:selected').index() -1].split(':')[0]);
    });

    el.countrySelectOption.each(function(index) {
        selectOptions[index] = jQuery(this).text();
    });


    if(topCountries.length > 0) {
        el.countrySelect.prepend('<option value="-" disabled>-</option>');
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
        Venda.CountrySelect.SetCountry(jQuery('#venda_cntry').text(), el);
        jQuery("select#cntrylist option[value='" + jQuery('#venda_cntry').text() + "']").attr("selected","selected");
    } else {
        Venda.CountrySelect.SetCountry(null, el);
        jQuery('select#cntrylist option').get(0).setAttribute("selected","selected");
    }

    el.countrySelect.change(function () {
        jQuery("#zipc").parents("form").validate().resetForm();
        jQuery("#zipc").rules("add", "required");
        Venda.CountrySelect.SetCountry(jQuery(this).val(), el);

        if (jQuery('#enterManually').text() == 'Lookup'){
            jQuery("#hideOrShowAddress").show();
        }
    });

    var hideWrapper = setTimeout(function() {
        jQuery('select#statelist').closest('.ui-select').hide();
    }, 100);
};


jQuery(document).ready(function() {
    if(jQuery('select#cntrylist').length > 0){

    //Attach event to lookup button and enter key
    jQuery("#lookupBtn").on("click", function(e){
        e.preventDefault();
        jQuery("#zipc").rules("remove", "populatedaddress");
        jQuery("#zipc").parents("form").validate().resetForm();
        Venda.Checkout.addressList();

    });
    jQuery("form.addressform").on({
        keypress: function(event) {
            if(event.keyCode===13){
                jQuery("#lookupBtn").trigger("click");
                event.preventDefault();
            }
        }
    }, "#zipc");
    //Attach event to enter manually link

        Venda.CountrySelect.Init();

        var enterManually   = jQuery('#enterManually').text(),
            lookup          = jQuery('#lookupBtn').val();

        jQuery('#enterManually').toggle(function() {
            Venda.CountrySelect.enterManually();
            jQuery(this).text(lookup);
            jQuery('#lookupBtn').parent().hide();
            jQuery('#addresslookup').hide();
            jQuery("#zipc").rules("remove", "required");
            jQuery("#zipc").parents("form").validate().element("#zipc");
            Venda.CountrySelect.changePlaceholder(jQuery('#zipc'),"#user_details_label_non_us_postcode");
        }, function() {
            Venda.CountrySelect.enterManually();
            jQuery(this).text(enterManually);
            jQuery('#lookupBtn').parent().show();
            jQuery('#addresslookup').show();
            jQuery("#zipc").parents("form").validate().resetForm();
            jQuery("#zipc").rules("add", "required");
            Venda.CountrySelect.changePlaceholder(jQuery('#zipc'),"#user_details_label_non_us_postcode_required");
        });
    }
});
Venda.CountrySelect.enterManually = function(){
    jQuery("#hideOrShowAddress").toggle();
};

Venda.CountrySelect.changePlaceholder = function(PHinput, textID){
    if(PHinput.attr("placeholder")){
        PHinput.attr("placeholder",jQuery(textID).text());
    }
};

// Populate input according to selection
//el.stateText.val(jQuery("select#statelist option[option='" + jQuery('#venda_state').text() + "']"));

Venda.CountrySelect.SetCountry = function(cntry, el) {

    el.countyText.val('');

    switch(cntry) {

        case 'United States':
            Venda.CountrySelect.ShowHide('hide', el.houseNum);
            Venda.CountrySelect.ShowHide('show', el.countyDiv);
            Venda.CountrySelect.ShowHide('hide', el.countyText);
            Venda.CountrySelect.ShowHide('show', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#hideOrShowAddress").show();
            jQuery('select#statelist').closest('.ui-select').show();
            el.countyLabel.text(jQuery('#user_details_label_us_state').text() + ':');
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_us_zip').text() + ':');
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_us_zip');
            Venda.CountrySelect.changePlaceholder(el.countyInput,'#user_details_label_us_state');
            el.postcodeLookup.addClass("hide");
            isRequiredField = true;

        break;

        case 'Canada':
            Venda.CountrySelect.ShowHide('hide', el.houseNum);
            Venda.CountrySelect.ShowHide('show', el.countyDiv);
            Venda.CountrySelect.ShowHide('hide', el.countyText);
            Venda.CountrySelect.ShowHide('show', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#hideOrShowAddress").show();
            jQuery('select#statelist').closest('.ui-select').show();
            el.countyLabel.text(jQuery('#user_details_label_us_state').text() + ':');
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_us_zip').text() + ':');
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_us_zip');
            Venda.CountrySelect.changePlaceholder(el.countyInput,'#user_details_label_us_state');
            el.postcodeLookup.addClass("hide");
            isRequiredField = true;

        break;

        case 'United Kingdom':
            Venda.CountrySelect.ShowHide('show', el.houseNum);
            Venda.CountrySelect.ShowHide('show', el.countyDiv);
            Venda.CountrySelect.ShowHide('show', el.countyText);
            Venda.CountrySelect.ShowHide('hide', el.countyInput);
            Venda.CountrySelect.ShowHide('show', el.addresslookup);
            jQuery("#hideOrShowAddress").hide();
            jQuery('select#statelist').closest('.ui-select').hide();
            el.countyLabel.text(jQuery('#user_details_label_uk_county').text() + ':');
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_non_us_postcode_required').text() + ':');
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_non_us_postcode_required');
            Venda.CountrySelect.changePlaceholder(el.countyText,'#user_details_label_uk_county');
            el.postcodeLookup.removeClass("hide");
            isRequiredField = false;

        break;

        case 'Germany':
            Venda.CountrySelect.ShowHide('show', el.houseNum);
            Venda.CountrySelect.ShowHide('hide', el.countyDiv);
            Venda.CountrySelect.ShowHide('hide', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#hideOrShowAddress").show();
            jQuery('select#statelist').closest('.ui-select').hide();
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text() + ':');
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_non_us_postcode');
            el.postcodeLookup.removeClass("hide");
            isRequiredField = false;

            jQuery("#zipc").rules("remove", "required");

        break;

        case 'France':
            Venda.CountrySelect.ShowHide('show', el.houseNum);
            Venda.CountrySelect.ShowHide('hide', el.countyDiv);
            Venda.CountrySelect.ShowHide('hide', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#hideOrShowAddress").show();
            jQuery('select#statelist').closest('.ui-select').hide();
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text() + ':');
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_non_us_postcode');
            el.postcodeLookup.removeClass("hide");
            isRequiredField = false;

            jQuery("#zipc").rules("remove", "required");

        break;

        case 'Spain':
            Venda.CountrySelect.ShowHide('hide', el.houseNum);
            Venda.CountrySelect.ShowHide('show', el.countyDiv);
            Venda.CountrySelect.ShowHide('show', el.countyText);
            Venda.CountrySelect.ShowHide('hide', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#hideOrShowAddress").show();
            jQuery('select#statelist').closest('.ui-select').hide();
            el.countyLabel.text(jQuery('#user_details_label_non_us_uk_region').text() + ':');
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text() + ':');
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_non_us_postcode');
            Venda.CountrySelect.changePlaceholder(el.countyText,'#user_details_label_non_us_uk_region');
            el.postcodeLookup.removeClass("hide");
            isRequiredField = false;
        break;

        default:
            Venda.CountrySelect.ShowHide('show', el.houseNum);
            Venda.CountrySelect.ShowHide('show', el.countyText);
            Venda.CountrySelect.ShowHide('hide', el.countyInput);
            Venda.CountrySelect.ShowHide('hide', el.addresslookup);
            jQuery("#hideOrShowAddress").show();
            jQuery('select#statelist').closest('.ui-select').hide();
            el.countyLabel.text(jQuery('#user_details_label_non_us_uk_region').text() + ':');
            el.stateSelect.empty();
            el.zipLabel.text(jQuery('#user_details_label_non_us_postcode').text() + ':');
            Venda.CountrySelect.changePlaceholder(el.zipInput,'#user_details_label_non_us_postcode');
            Venda.CountrySelect.changePlaceholder(el.countyText,'#user_details_label_non_us_uk_region');
            el.postcodeLookup.addClass("hide");
            isRequiredField = false;

            jQuery("#zipc").rules("remove", "required");
            jQuery("#cntrylist").rules("add", "required");

        break;

    };

    if(cntry && Venda.CountrySelect.countryAndData[cntry]) {
        el.stateSelect.append("<option value=''>" + jQuery("#please_select_multi_dot").text() + "</option>");
        for(var i = 0; i < Venda.CountrySelect.countryAndData[cntry].length; i++) {
            Venda.CountrySelect.ShowHide('show', el.stateSelect);
            el.stateSelect.append("<option value='" + Venda.CountrySelect.countryAndData[cntry][i].split(':')[0] + "'>" + Venda.CountrySelect.countryAndData[cntry][i].split(':')[1] + "</option>");
        }
        jQuery('select#statelist').closest('.ui-select').find('span.ui-btn-inner .ui-btn-text').text(jQuery("select#statelist option:selected").text());
        if(typeof Venda.CountrySelect.countryAndData[cntry][0] != 'undefined') {
            el.countyText.val(Venda.CountrySelect.countryAndData[cntry][0].split(':')[0]);
        }
        if(jQuery('#venda_state').text().length > 0) {
            jQuery("select#statelist option[value='" + jQuery('#venda_state').text() + "']").attr("selected","selected");
        }
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

};