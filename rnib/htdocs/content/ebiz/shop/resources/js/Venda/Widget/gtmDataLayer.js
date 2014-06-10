/**
 * @fileoverview gtmDataLayer.js - DataLayer for Google Tag Manager. See https://developers.google.com/tag-manager/reference
 *
 * @requires /resources/js/Venda/Widget/Tracking.js
 * @requires /resources/js/external/jquery-1.8.3.min.js (http://api.jquery.com)
 * @requires /resources/js/external/modernizr.js - with localStorage included in build (http://modernizr.com)
 * @requires /resources/js/Venda/Search.js
 * @requires /resources/js/Venda/Widget/MinicartDetail.js
 * @requires /templates/tracking/gtmSnippet
 *
 * @author Oliver Secluna <oliversecluna@venda.com>
 */

(function (Venda, $) {
    /*Wrapper function ensures variables are not global*/

    var step = Venda.Widget.Tracking.Step(),
    ord = Venda.Widget.Tracking.orderJSON,
    items = Venda.Widget.Tracking.orditemsArray,
    user = Venda.Widget.Tracking.Ses(),
    srch = Venda.Widget.Tracking.Search();

    if(step){
        /*If this is a workflow step*/
        dataLayer.push({
            'event': 'pageURL',
            'pageURL': step
        });
    }

    if(typeof ord !== 'undefined'){
        /*If an order has been placed*/

        /*Create array for order items*/
        var gtmItems = [];

        for (var i=0; i < items.length; i++){
        /* Loop through order items */

            /* Google Analytics has a single column for product variant data */
            /* Send as categoryref: attribute values brand product type giftwrap */
            var atts = items[i].attributes,
            cat = items[i].category += ':';

            /* Append attributes to category name */
            if(atts.att1!==''){cat += ' ' + atts.att1;}
            if(atts.att2!==''){cat += ' ' + atts.att2;}
            if(atts.att3!==''){cat += ' ' + atts.att3;}
            if(atts.att4!==''){cat += ' ' + atts.att4;}

            /* Add brand to category name */
            if(items[i].brand){cat += ' ' + items[i].brand;}

            /* Add product type to category name */
            cat += ' ' + items[i].type;


            /* Add giftwrap info to category name */
            if(items[i].giftwrap!==''){cat += ' Gift Wrapped (' + items[i].giftwrap + ')';}

            var obj = {
                'id': items[i].sku,
                'sku': items[i].sku,
                'name': items[i].name,
                'category': cat,
                'price': items[i].price,
                'discount': items[i].discount,
                'quantity': items[i].qty
            };
            gtmItems.push(obj);
         }

        var pay = ord.payment;
        switch (ord.payment) {
        /* Translate venda_ohpaytype values into English*/
            case '0':
                pay = 'Credit Card';
                break;
            case '5':
                pay = 'Manual Payment';
                break;
            case '8':
                pay = 'Free Order';
                break;
            case '12':
                pay = 'PayPal';
                break;
            default:
                pay = 'Payment Type' + pay;
        }

        dataLayer.push({
        'event': 'transaction',
        'transactionId': ord.ref,
        'transactionAffiliation': ord.store,
        'transactionTotal': ord.total,
        'transactionTax': ord.tax,
        'transactionShipping': ord.shipping,
        'transactionDiscount': ord.discount,
        'transactionPaymentType': pay,
        'transactionCurrency': ord.currency,
        'transactionProducts': gtmItems
        });
    }

    /*Track Session data*/
    var sess = {
        'event': 'updateUser',
        'Language': user.lang,
        'Region': user.locn,
        'visitorGroup': user.group,
        'visitorId': user.usid,
        'visitorType': user.ustype
    }

    /* Use session storage to ensure session data is only sent to the dataLayer once per session, or when it changes */
    if (Modernizr.sessionstorage) {
    /* window.localStorage is available */
        var stored = sessionStorage.gtmSess;
        if (!stored) {
        /* new session data */
            dataLayer.push(sess);
            sessionStorage.gtmSess = JSON.stringify(sess);
        } else {
        /* stored session data */
            if (JSON.stringify(sess) !== stored) {
                /* session data has changed */
                dataLayer.push(sess);
                sessionStorage.gtmSess = JSON.stringify(sess);
            }
        }
    } else {
    /* window.localStorage is not available so send session data always */
        dataLayer.push(sess);
    }

    /* Track Search (N.B. not required for Google Analytics) */
    jQuery('#content-search').bind('search-loading-end', function() {
        dataLayer.push({
            'event': 'sitesearch',
            'siteSearchTerm': srch.term,
            'siteSearchResults': srch.results
        });
    });

    /* Track jQuery AJAX requests. See www.alfajango.com/blog/track-jquery-ajax-requests-in-google-analytics*/
    jQuery(document).ajaxSend(function(event, xhr, settings){
            dataLayer.push({
                'event': 'pageURL',
                'pageURL': settings.url
            });
    });

    /*Track Add to Cart*/
    jQuery('body').bind('minicart-items-added', function() {
        dataLayer.push({
            'event': 'gaEvent',
            'eventCategory': 'Shopping',
            'eventAction': 'Add to Cart',
            'eventLabel': jQuery('#tag-invtname').text()
        });
    });

    /* Track all links within a container as Events - used for Google Analytics event tracking */
    jQuery('body').on( 'click', '[data-trackNav] a', function(ev) {
        var nav = $(ev.target).closest('[data-trackNav]'), // Find the parent
        category = nav.attr('data-trackNav'), // Get the value of the data- param
        label;
        if (this.host !== window.location.host) {
            label = this.href; // For an external link record the absolute url
        } else {
            label = this.pathname; // For an internal link record the relative path
        }
        dataLayer.push({
                'event': 'gaEvent',
                'eventCategory': category,
                'eventAction': 'Navigation',
                'eventLabel': label
        });
    });

    /* Track click on any element as Event - used for Google Analytics event tracking  */
    jQuery('body').on( 'click', '[data-trackEvent]', function(ev) {
        var btn = $(ev.target),
            category = btn.attr('data-trackEvent'),
            tag = btn.prop('tagName'),
            label,
            action;
        switch (tag) {
        case 'IMG':
            label = btn.attr('src');
            action = 'Image';
            break;
        case 'A':
            label = btn.text();
            action = 'Link';
            break;
        case 'INPUT':
            label = btn.val();
            action = 'Input';
            break;
        default:
            label = btn.attr('id');
            action = tag;
        }
        dataLayer.push({
            'event': 'gaEvent',
            'eventCategory': category,
            'eventAction': action,
            'eventLabel': label
        });
    });

}(window.Venda || {}, jQuery));
