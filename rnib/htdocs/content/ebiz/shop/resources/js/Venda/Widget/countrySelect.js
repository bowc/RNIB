/**
 * @fileoverview Venda.CountrySelect
 *
 * Rearange country dropdown list to show top most popular countries first.
 * Manage a country specific registration form display.
 *
 * @author Donatas Cereska <dcereska@venda.com>,  Keith Freeman <kfreeman@venda.com>
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

Venda.CountrySelect.Init = function () {
  var topCountries, el, selectOptions;

  switch (jQuery('#venda_locn').text()) {

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

  //cache selectors
  el = {
    countrySelect: jQuery('select#cntrylist'),
    countrySelectOption: jQuery('select#cntrylist option'),
    stateSelect: jQuery('select#statelist'),
    stateLabel: jQuery('#stateLabel'),
    stateInput: jQuery('#statetext'),
    stateListSelect: jQuery('select#statelist'),
    stateList: jQuery('#statelist'),
    zipLabel: jQuery('#zipcLabel'),
    zipInput: jQuery('#zipc'),
    houseNum: jQuery('#houseNum'),
    numInput: jQuery('#num')
  };
  selectOptions = {};

  el.stateSelect.change(function () {
    if (jQuery('#statelist option:selected').index() > 0) {
      el.stateInput.val(Venda.CountrySelect.countryAndData[jQuery('#cntrylist option:selected').val()][jQuery('#statelist option:selected').index() - 1].split(':')[0]);
    }
  });

  el.countrySelectOption.each(function (index) {
    selectOptions[index] = jQuery(this).text();
  });

  if (topCountries.length > 0) {
    var matchDiff, i, key;
    matchDiff = 0;

    //el.countrySelect.prepend('<option value="-" disabled>-</option>');
    for (i = (topCountries.length - 1); i >= 0; i--) {
      for (key in selectOptions) {
        if (selectOptions[key] === topCountries[i]) {
          jQuery('select#cntrylist option[value="' + topCountries[i] + '"]').remove();
          el.countrySelect.prepend('<option value="' + topCountries[i] + '">' + topCountries[i] + '</option>');
          matchDiff++;
        }
      }
    }
    matchDiff = topCountries.length - matchDiff;
    el.countrySelect.prepend(jQuery('select#cntrylist option').get(topCountries.length - matchDiff + 1));
  }

  if (jQuery('#venda_cntry').text().length > 0) {
    jQuery('select#cntrylist option[value="' + jQuery('#venda_cntry').text() + '"]').attr('selected', 'selected');
    Venda.CountrySelect.SetCountry(jQuery('#venda_cntry').text(), el);
  } else {
    Venda.CountrySelect.SetCountry(null, el);
    jQuery('select#cntrylist option').get(0).attr('selected', 'selected');
  }

  el.countrySelect.change(function () {
    el.zipInput.parents('form').validate().resetForm();
    Venda.CountrySelect.SetCountry(jQuery(this).val(), el);
  });

  var hideWrapper = setTimeout(function () {
    jQuery('select#statelist').closest('.ui-select').hide();
  }, 100);
};

// On page load set form rules for currently selected country
jQuery(window).load(function () {
  if (jQuery('select#cntrylist').length > 0) {
    Venda.CountrySelect.Init();
  }
});

Venda.CountrySelect.SetCountry = function (cntry, el) {

  switch (cntry) {

    case 'United States':
      // values: enabled,disabled - num field
      Venda.CountrySelect.numField('disabled', el);
      // values: county,state,province,region
      Venda.CountrySelect.Locality('state', 'required', el);
      // values: postcode,zipcode
      Venda.CountrySelect.postalCode('zipcode', 'required', el);
      // values: inputtext, inputselect
      Venda.CountrySelect.LocalityInputType('select', el);
      // values: lookup, manual
      Venda.CountrySelect.addressEntry('manual', el);
      el.stateList.parents('form').validate().resetForm();
      break;

    case 'United Kingdom':
      // values: enabled,disabled - num field
      Venda.CountrySelect.numField('enabled', el);
      // values: county,state,province,region
      Venda.CountrySelect.Locality('county', 'optional', el);
      // values: postcode,zipcode
      Venda.CountrySelect.postalCode('postcode', 'required', el);
      // values: inputtext, inputselect
      Venda.CountrySelect.LocalityInputType('text', el);
      // values: true, false
      Venda.CountrySelect.addressEntry('lookup', el);
      break;

    case 'Germany':
      // values: enabled,disabled - num field
      Venda.CountrySelect.numField('disabled', el);
      // values: county,state,province,region
      Venda.CountrySelect.Locality('state', 'optional', el);
      // values: postcode,zipcode
      Venda.CountrySelect.postalCode('postcode', 'required', el);
      // values: inputtext, inputselect
      Venda.CountrySelect.LocalityInputType('text', el);
      // values: lookup, manual
      Venda.CountrySelect.addressEntry('manual', el);
      break;

    case 'France':
      // values: enabled,disabled - num field
      Venda.CountrySelect.numField('disabled', el);
      // values: county,state,province,region
      Venda.CountrySelect.Locality('disabled', 'optional', el);
      // values: postcode,zipcode
      Venda.CountrySelect.postalCode('postcode', 'required', el);
      // values: inputtext, inputselect
      Venda.CountrySelect.LocalityInputType('disabled', el);
      // values: lookup, manual
      Venda.CountrySelect.addressEntry('manual', el);
      break;

    case 'Italy':
      // values: enabled,disabled - num field
      Venda.CountrySelect.numField('disabled', el);
      // values: county,state,province,region
      Venda.CountrySelect.Locality('region', 'optional', el);
      // values: postcode,zipcode
      Venda.CountrySelect.postalCode('postcode', 'required', el);
      // values: inputtext, inputselect
      Venda.CountrySelect.LocalityInputType('text', el);
      // values: lookup, manual
      Venda.CountrySelect.addressEntry('manual', el);
      break;

    case 'Spain':
      // values: enabled,disabled - num field
      Venda.CountrySelect.numField('disabled', el);
      // values: county,state,province,region
      Venda.CountrySelect.Locality('province', 'optional', el);
      // values: postcode,zipcode
      Venda.CountrySelect.postalCode('postcode', 'required', el);
      // values: inputtext, inputselect
      Venda.CountrySelect.LocalityInputType('text', el);
      // values: lookup, manual
      Venda.CountrySelect.addressEntry('manual', el);
      break;

    case 'Canada':
      // values: enabled,disabled - num field
      Venda.CountrySelect.numField('disabled', el);
      // values: county,state,province,region
      Venda.CountrySelect.Locality('province', 'optional', el);
      // values: postcode,zipcode
      Venda.CountrySelect.postalCode('zipcode', 'required', el);
      // values: inputtext, inputselect
      Venda.CountrySelect.LocalityInputType('text', el);
      // values: lookup, manual
      Venda.CountrySelect.addressEntry('manual', el);
      el.stateList.parents('form').validate().resetForm();
      break;

    default:
      // values: enabled,disabled - num field
      Venda.CountrySelect.numField('disabled', el);
      // values: county,state,province,region
      Venda.CountrySelect.Locality('region', 'optional', el);
      // values: postcode,zipcode
      Venda.CountrySelect.postalCode('postcode', 'optional', el);
      // values: inputtext, inputselect
      Venda.CountrySelect.LocalityInputType('text', el);
      // values: lookup, manual
      Venda.CountrySelect.addressEntry('manual', el);
      el.zipInput.rules('remove', 'required');
      break;
  }

  if (cntry && Venda.CountrySelect.countryAndData[cntry]) {
    var state_options = '<option value="">' + jQuery('#js-countryselect-pleaseselect').text() + '</option>';
    for (var i = 0; i < Venda.CountrySelect.countryAndData[cntry].length; i++) {
      if (typeof Venda.CountrySelect.countryAndData[cntry][i] === 'string') {
        state_options += '<option value="' + Venda.CountrySelect.countryAndData[cntry][i].split(':')[0] + '">' + Venda.CountrySelect.countryAndData[cntry][i].split(':')[1] + '</option>';
      }
      el.stateSelect.show();
    }
    el.stateSelect.html(state_options);
    if (typeof Venda.CountrySelect.countryAndData[cntry][0] !== 'undefined') {
      el.stateInput.val(Venda.CountrySelect.countryAndData[cntry][0].split(':')[0]);
    }
    if (jQuery('#venda_state').text().length > 0) {
      jQuery('select#statelist option[value=' + jQuery('#venda_state').text() + ']').attr('selected', 'selected');
    }
    el.stateInput.val(jQuery('#venda_state').text());
    el.stateListSelect.next('.js-select').find('span.js-selected').text(jQuery('select#statelist option:selected').text());
  }
};


Venda.CountrySelect.Locality = function (type, setfield, el) {

  switch (type) {

    case 'state':

      switch (setfield) {

        case 'required':
          el.stateInput.rules('add', 'required');
          el.stateLabel.text(jQuery('#js-countryselect-state').text());
          break;

        case 'optional':
          el.stateInput.rules('remove', 'required');
          el.stateLabel.text(jQuery('#js-countryselect-state').text() + ' ' + jQuery('#js-countryselect-optional').text());
          break;
      }
      break;

    case 'county':

      switch (setfield) {

        case 'required':
          el.stateInput.rules('add', 'required');
          el.stateLabel.text(jQuery('#js-countryselect-county').text());
          break;

        case 'optional':
          el.stateInput.rules('remove', 'required');
          el.stateLabel.text(jQuery('#js-countryselect-county').text() + ' ' + jQuery('#js-countryselect-optional').text());
          break;
      }
      break;

    case 'province':

      switch (setfield) {

        case 'required':
          el.stateInput.rules('add', 'required');
          el.stateLabel.text(jQuery('#js-countryselect-province').text());
          break;

        case 'optional':
          el.stateInput.rules('remove', 'required');
          el.stateLabel.text(jQuery('#js-countryselect-province').text() + ' ' + jQuery('#js-countryselect-optional').text());
          break;
      }
      break;

    case 'region':

      switch (setfield) {

        case 'required':
          el.stateInput.rules('add', 'required');
          el.stateLabel.text(jQuery('#js-countryselect-region').text());
          break;

        case 'optional':
          el.stateInput.rules('remove', 'required');
          el.stateLabel.text(jQuery('#js-countryselect-region').text() + ' ' + jQuery('#js-countryselect-optional').text());
          break;

      }
      break;

    case 'disabled':
      // hide label - all other stuff is disabled in the LocalityInputType below
      el.stateLabel.hide();
      break;
  }
};

Venda.CountrySelect.LocalityInputType = function (type, el) {

  switch (type) {

    case 'text':
      el.stateLabel.show();
      el.stateInput.show();
      el.stateList.hide();
      // Remove jquery validate rules
      el.stateList.rules('remove', 'required');
      //resets the state field name - removed when state select is used
      el.stateInput.attr('name', 'state');
      //Hide JS generated dropdown
      el.stateListSelect.next('.js-select').hide();
      //Clear statelist values
      el.stateListSelect.empty();
      break;

    case 'select':
      el.stateLabel.show();
      el.stateInput.hide();
      //removes the state field name so this value isn't submitted
      el.stateInput.attr('name', '');
      el.stateList.show();
      // Remove jquery validate rules
      el.stateList.rules('add', 'required');
      el.stateListSelect.next('.js-select').show();
      el.stateListSelect.empty();
      break;

    case 'disabled':
      // Disable + reset + hide state input
      el.stateInput.val('');
      el.stateInput.rules('remove', 'required');
      el.stateInput.hide();

      //Disable + reset + hide the state select
      el.stateList.hide();
      // Remove jquery validate rules
      el.stateList.rules('remove', 'required');
      //Hide JS generated dropdown
      el.stateListSelect.next('.js-select').hide();
      //Clear statelist values
      el.stateListSelect.empty();
      break;
  }
};

Venda.CountrySelect.postalCode = function (type, setfield, el) {

  switch (type) {

    case 'zipcode':

      switch (setfield) {

        case 'required':
          el.zipInput.rules('add', 'required');
          el.zipLabel.text(jQuery('#js-countryselect-zipc').text());
          break;

        case 'optional':
          el.zipInput.rules('remove', 'required');
          el.zipLabel.text(jQuery('#js-countryselect-zipc').text() + ' ' + jQuery('#js-countryselect-optional').text());
          break;
      }
      break;

    case 'postcode':

      switch (setfield) {

        case 'required':
          el.zipInput.rules('add', 'required');
          el.zipLabel.text(jQuery('#js-countryselect-postcode').text());
          break;

        case 'optional':
          el.zipInput.rules('remove', 'required');
          el.zipLabel.text(jQuery('#js-countryselect-postcode').text() + ' ' + jQuery('#js-countryselect-optional').text());
          break;
      }
      break;
  }
};

Venda.CountrySelect.addressEntry = function (type, el) {

  switch (type) {

    case 'lookup':
      if (jQuery('#addr1').val() !== '') {
        //edit address or server side error
        Venda.AddressLookup.manualFormReset();
      } else {
        //add address
        Venda.AddressLookup.lookupFormReset();
      }
      break;

    case 'manual':
      Venda.AddressLookup.manualFormReset();
      //reset button not required for manual entry only countries
      jQuery('#js-lookup-reset-btn').hide();
      //set it back
      jQuery('#js-hideOrShowAddress, #zipcDiv').show();
      el.zipInput.rules('remove', 'findaddress');
      break;
  }
};

Venda.CountrySelect.numField = function (type, el) {

  switch (type) {

    case 'enabled':
      el.houseNum.show();
      el.numInput.rules('add', 'required');
      break;

    case 'disabled':
      el.numInput.val('');
      el.numInput.rules('remove', 'required');
      // num field is only used in the UK
      el.houseNum.hide();
      break;
  }
};
