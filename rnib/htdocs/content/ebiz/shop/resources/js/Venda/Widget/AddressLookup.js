/* global Venda, jQuery, console */

/**
 * @fileoverview Venda.AddressLookup
 *
 * Address lookup script
 *
 * @author Keith Freeman <kfreeman@venda.com>
 */

Venda.namespace('AddressLookup');

/**
 * Stub function is used to support JSDoc.
 * @class Venda.AddressLookup
 * @constructor
 */

(function (Venda, $) {
  'use strict';

  Venda.AddressLookup.lookupSubmit = function (event) {
    event.preventDefault(); //Prevent click anchor
    $('#js-lookupresults').empty();  //Remove previous select content
    $('#js-addresses-found').hide(); // hide previous lookup
    $('#js-lookup-error').hide(); //hide previous lookup error
    $('#zipc').removeClass('js-validateError'); //workaround to remove zipc validation
    $('span[for=zipc]').remove(); //workaround to remove zipc validation

    //Need to validate postcode. Is this already done via $ validate?
    if ($('#zipc').val() === '' && (!$('#zipc').parents('form').validate().element('#zipc'))) { return false; } //horrid hack related to validation
    // Disable lookup button
    $('#js-lookup-submit-btn').attr('disabled', true).find('i').show();

    var postcode = $('#zipc').val();

    //get json data
    $.ajax ({
      dataType: 'json',
      url: '/ajax/postcode?country=UK&postcode=' + postcode,
    })
    .done(function (data) {
      if (data.errors && data.errors[0].key === 'postcode_not_found') {
        $('#js-lookup-error').show().delay(5000).fadeOut();
        $('#js-lookup-submit-btn').attr('disabled', false).find('i').hide();
        $('#zipc').val('').focus();
        $('#zipc').removeClass('js-validateError'); //workaround to remove zipc validation
        $('span[for=zipc]').remove(); //workaround to remove zipc validation
      } else {
        $('#js-lookupresults').empty(); //Remove previous select
        $('#js-lookupresults').append('<select name="zcdropdown" id="js-lookupselect"><option value="">' + $("#js-countryselect-pleaseselect").text() + '</option></select>'); // Create select

        for (var i = 0, l = data.results.length; i < l; i++) {
          // Create option for each object and append to select
          var company = data.results[i].company === null ? '' : data.results[i].company + ',' ;
          var option = '<option value="'+[i]+'">' + company + data.results[i].num + '' +' '+''+data.results[i].addr1+''+', '+''+data.results[i].zipc+'</option>';
            $('#js-lookupselect').append(option);
        }

        // Show address results
        Venda.AddressLookup.displayResults();
        // Enable lookup button
        $('#js-lookup-submit-btn').attr('disabled', false).find('i').hide();
      }

      // on change of postcode dropdown
      $('#js-lookupselect').change(function () {
        var k = $('#js-lookupselect option:selected').val(); // get current selected value
        // Mapping address object data to form ids
        $('#company').val(data.results[k].company);
        $('#num').val(data.results[k].num);
        $('#addr1').val(data.results[k].addr1);
        $('#addr2').val(data.results[k].addr2);
        $('#city').val(data.results[k].city);
        $('#statetext').val(data.results[k].state);
        $('#zipc').val(data.results[k].zipc);
        // Select from results
        Venda.AddressLookup.lookupSelect();
      });
    })
    .fail(function () {
      //No data returned (url fail)
      $('#js-lookup-error').show().delay(5000).fadeOut();
      $('#js-lookup-submit-btn').attr('disabled', false).find('i').hide();
    });
  };

  // Display address results
  Venda.AddressLookup.displayResults = function () {
    //Venda.Ebiz.customSelect(); // call customSelect to style dropdown
    $('#js-addresses-found').fadeIn(300); // Show results dropdown
    $('#js-lookupselect').focus(); //Focus on dropdown - accessibility
  };

  // Select from address dropdown
  Venda.AddressLookup.lookupSelect = function () {
    $('#js-lookupselect').parents('form').validate().resetForm();
    $('#js-hideOrShowAddress').fadeIn(300); // Show the address form
    $('#js-lookupresults').empty(); // Empty the previous lookup results
    $('#js-addresses-found').fadeOut(300); // Hide the address lookup box
    $('#js-lookup-reset-btn').fadeIn(300); // Show the lookup reset button
    $('#js-manual-reset-btn').hide(); // Hide the manual reset button
    $('#js-lookup-submit-btn').hide(); // Hide the lookup submit button
  };

  // Lookup form setup
  Venda.AddressLookup.lookupFormReset = function () {
    $('#js-lookupresults').empty(); // Empty the previous lookup results
    $('#js-addresses-found').fadeOut(300); // Hide the address lookup box
    $('#js-hideOrShowAddress').fadeOut(300); // Hide the address form
    $('#zipcDiv, #js-lookup-submit-btn').fadeIn(300); // Show the zipc field and lookup button
    $('#js-lookup-reset-btn').hide(); // Hide the lookup button
    $('#js-manual-reset-btn').show(); // Show the manual reset button
    $('#company, #num, #addr1, #addr2, #city, #statetext, #zipc').val(''); // Delete all address form data
    $('#cntrylist').parents('form').validate().resetForm(); //reset the validation
    return false;
  };

  // Manual form setup
  Venda.AddressLookup.manualFormReset = function () {
    $('#js-hideOrShowAddress').fadeIn(300); // Show the address form
    $('#js-lookup-submit-btn').hide(); // Hide the lookup button
    $('#js-lookupresults').empty(); // Empty the previous lookup results
    $('#js-addresses-found').fadeOut(300); // Hide the address lookup box
    $('#zipcDiv').fadeIn(300); // Show the zipc field
    $('#js-lookup-reset-btn').fadeIn(300); // Show the lookup reset button
    $('#js-manual-reset-btn').hide(); // Hide the manual reset button
    $('#zipc').removeClass('js-validateError'); //workaround to remove zipc validation (click lookup)
    $('span[for=zipc]').remove(); //workaround to remove zipc validation (click lookup)
    return false;
  };

  // Set up the DOM events.
  $(function () {
    // Click events
    $('#js-manual-reset-btn, #js-manual-error-btn').click(Venda.AddressLookup.manualFormReset);
    $('#js-lookup-reset-btn').click(Venda.AddressLookup.lookupFormReset);
    $('#js-lookup-submit-btn').click(Venda.AddressLookup.lookupSubmit);

    // User presses return on postcode field
    $('#zipc').on('keypress', function (e) {
      if ((e.which === 13) && $('#js-lookup-submit-btn').is(':visible')) {
        Venda.AddressLookup.lookupSubmit(e);
      }
    });
  });

}(Venda, jQuery));
