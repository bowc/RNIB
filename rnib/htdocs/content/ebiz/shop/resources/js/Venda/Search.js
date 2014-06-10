Venda.namespace('Venda.Search');

Venda.Search = function(options) {
    this._searchLifo = [];
    jQuery.extend(this, {
        maxPagesCached: 5,
        showViewAll:    false,
        viewAllLimit:   10,
        useHistory:     true,
        features:       []
    }, options);

    // showing all options
    this.features.push('PriceSlider', 'MultiRefine','IndicateLoading','FilterRefinements','ViewStyleSwitcher','ColorSwatch');
};

// Utility method.
Venda.Search.start = function(options) {
   new Venda.Search(options).initialise();
};

Venda.Search._decodeURI = function(u) {
    // Because UNIFORM Resource Identifiers aren't.
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
    return decodeURIComponent(u.replace(/\+/g, '%20'));
};
// Workaround for bug in older code.
Venda.Search.fixRefinementUri = function(refine, chosen) {
    var uri = new Uri(refine.url);
    if(chosen) {
        // Workaround because uri.deleteQueryParam(k,v) is broken.
        var rem = uri.getQueryParamValues(refine.field);
        uri.deleteQueryParam(refine.field);
        jQuery.each(rem, function(i, f) {
            // Only decode at point of comparison to handle "+" in param values.
            if(Venda.Search._decodeURI(f) != refine.facet)
                uri.addQueryParam(refine.field, f);
        });
    }
    return uri.toString();
};

Venda.Search.prototype = {
    initialise: function() {
        // We don't want to initialise History if we're not using it.
        if(this.useHistory)
            History.init();

        this.setupSearchHandlers();
        this.setupDomHandlers();
        jQuery(window).bind('statechange', jQuery.proxy(this, 'stateChangeHandler'));

        var state = History.getState();
        // This is a workaround for IE for the case where the user has
        // navigated through the results, gone to another page then come back
        // again. It will forceably load the last known set of results.
        if(History.getHash().match(/&_suid=/)) {
            var newState = jQuery.extend(state.data, {forceLoad: new Date});
            History.replaceState(newState, this.getDocumentTitle(), state.url);
        } else {
            jQuery('#content-search').trigger('search-loading-end', [{ url: state.url }]);
        }
    },

    setupSearchHandlers: function() {
        // Recreate the price slider and run other configured Features.
        jQuery('#content-search').bind('search-loading-end', jQuery.proxy(this, 'showFeaturesHandler'));

        // Handle history navigation.
        jQuery('#content-search').bind('search-navigate', jQuery.proxy(this, 'updateHistoryHandler'));
        // Only scroll the page up if we're using the History API.
        if(this.useHistory)
            // Move view to the top of the results if necessary
            jQuery('#content-search').bind('search-navigate', jQuery.proxy(this, 'moveResultsIntoViewHandler'));
    },

    setupDomHandlers: function() {
        var me = this;
        // Sorting
        jQuery('#content-search').delegate('#sortby', 'change', this.getNavHandler());

        // Facets links & checkboxes
        var refine = this.getNavHandler({ resetPrice: true });
        jQuery('#content-search').delegate('#collate a.js-updatesearch, #term a.js-removesearch', 'click',  refine);
        jQuery('#content-search').delegate('#collate input:checkbox', 'change', refine);

        // Pagination links & dropdown
        var pagination = this.getNavHandler({ pagination: true });
        jQuery('#content-search').delegate('.js-pagn a:not(.js-iconGrid, .js-iconImage, .js-iconList)', 'click',  pagination);
        jQuery('#content-search').delegate('.js-pagn select', 'change', pagination);
    },

    validSearchUrl: function(url) {
        var u = new Uri(url);
        return url && u.path().match(new RegExp('/(icat/|search\\b)'));
    },

    getNavHandler: function(params) {
        var self = this;
        return function navigationHandler(evt) {
            var href = this.href || jQuery(this).val();
            if(!self.validSearchUrl(href))
                return;
            jQuery('#content-search').trigger('search-navigate', [jQuery.extend(params || {}, { url: href })]);
            return false;
        };
    },

    // TODO - Have this reflect useful things.
    getDocumentTitle: function(uri) {
        return window.document.title;
    },

    updateHistoryHandler: function(evt, params) {
        var uri = new Uri(params.url);
        // Ensure the protocol always reflects the requested page.
        uri.setProtocol(window.location.protocol);
        if(!params.pagination)
            uri.deleteQueryParam('setpagenum');
        if(params.resetPrice) {
            uri.deleteQueryParam('minprice');
            uri.deleteQueryParam('maxprice');
        }

        var uriStr = uri.toString();
        if(this.useHistory)
            History.pushState({realUri: uriStr}, this.getDocumentTitle(), uriStr);
        else
            window.location.href = uriStr;
    },

    moveResultsIntoViewHandler: function() {
        if(jQuery('#content-top:in-viewport').is('a'))
            return;
        jQuery('html, body').animate({ scrollTop : jQuery("#searchResults").offset().top });
    },

    showFeaturesHandler: function() {
        jQuery.each(this.features, function(idx, f) {
            var feature = typeof f === 'string' ? Venda.Search.Feature[f] : f;
            if(!feature) return; // XXX Warn here somehow?
            var featureObj = new feature();
            if(featureObj.display) featureObj.display();
        });
    },

    stateChangeHandler: function(evt) {
        var state = History.getState(),
              // History.js helpfully "unescapes" URLs, this workaround will handle
              // params containing ampersands.
              url = state.data.realUri || state.url;
        jQuery('#content-search').trigger('search-loading-start', [{ url: url }]);
        this.loadResults(url);
    },

    _addToStack: function(content, url) {
        this._searchLifo.push({content: content, url: url});
        if(this._searchLifo.length > this.maxPagesCached)
            this._searchLifo.shift();
    },

    _onStack: function(url) {
        var res = jQuery.grep(this._searchLifo, function(res, idx) { return res.url == url });
        return res[0];
    },

    loadResults: function (url) {
        var seenOnStack = this._onStack(url);

        if(!this.validSearchUrl(url)) {
            jQuery('#content-search').trigger('search-loading-end', [{ url: null }]);
        } else if(seenOnStack) {
            jQuery('#content-search')
                .html(seenOnStack.content)
                .trigger('search-loading-end', [{ url: url }]);
                //Venda.Ebiz.customSelect();
        } else {
            jQuery('#content-search').load(url + ' #content-search-body',
                jQuery.proxy(function(html, status, xhr) {
                    this._addToStack(jQuery('#content-search').html(), url);
                    jQuery('#content-search').trigger('search-loading-end', [{ url: url }]);
                    //Venda.Ebiz.customSelect();
                }, this));
        }
    }
};

Venda.namespace('Venda.Search.Feature');

Venda.Search.Feature.PriceSlider = function() {
    var state = History.getState(),
          uri = new Uri(state.data.realUri || state.url),
     minprice = uri.getQueryParamValue('minprice'),
     maxprice = uri.getQueryParamValue('maxprice');

    jQuery.extend(this, {
        currency: jQuery("#tag-currsym").text(),
        minprice: minprice !== undefined ? Number(minprice) : Math.floor(this._getPrice('minprice')),
        maxprice: maxprice !== undefined ? Number(maxprice) : Math.ceil( this._getPrice('maxprice')),
        from:     Math.floor(this._getPrice('pricefrom')),
        to:       Math.ceil( this._getPrice('priceto'))
    });

    this._sliderOptions = {
        range:  true,
        min:    this.minprice,
        max:    this.maxprice,
        values: [this.from, this.to]

    };
};

Venda.Search.Feature.PriceSlider.prototype = {
    setText: function(from, to) {
        var removesearchId = "#removeprice"+from+"-"+to; //will be translated to: id='#price0-1399'
        jQuery("#pricerangevalues, "+removesearchId).text(this.currency + from + ' - ' + this.currency + to);
		jQuery("#pricerangevalues, "+removesearchId).html(function(idx, price) {
			return price.replace(/\u0080([\d.]+)/g, "\u20ac$1");
		});
    },

    _getPrice: function(id) {
        return parseFloat(jQuery("#tag-"+id).text());
    },

    slideHandler: function (event, ui) {
        this.setText(ui.values[0], ui.values[1]);
    },

    stopHandler: function (event, ui) {
        var uri = new Uri(History.getState().url),
        newFrom = ui.values[0],
          newTo = ui.values[1];
        // Don't search again if the values haven't changed.
        if(newFrom == this.from & newTo == this.to)
            return;
        uri.replaceQueryParam('price_from', newFrom);
        uri.replaceQueryParam('price_to',   newTo);
        uri.replaceQueryParam('minprice',   this.minprice);
        uri.replaceQueryParam('maxprice',   this.maxprice);
        jQuery('#content-search').trigger('search-navigate', [{ url: uri.toString() }]);
    },

    display: function() {
        jQuery("#priceslider").slider(
            jQuery.extend(this._sliderOptions, {
                slide: jQuery.proxy(this, 'slideHandler'),
                stop:  jQuery.proxy(this, 'stopHandler')
            })
        );
        this.setText(this.from, this.to);
    }
};

Venda.Search.Feature.ViewMoreLess = function() {
    this.showViewAll  = 1 == jQuery('#tag-showviewall').text();
    this.viewAllLimit = Number(jQuery('#tag-viewallcount').text());

    // Take off one as this is used by :eq - http://api.jquery.com/eq-selector/
    if(this.viewAllLimit)
        this.viewAllLimit -= 1;
};

Venda.Search.Feature.ViewMoreLess.prototype = {
    clickHandler: function(evt) {
        var facet = jQuery(evt.currentTarget).parent().parent();
        // Only switch more/less if the link is there e.g on click.
        facet.find('.js-toggleviewall .js-viewmorerefinements').toggle();
        facet.find('.js-toggleviewall .js-viewlessrefinements').toggle();
        facet.find('div:nth-child('+ this.viewAllLimit +') ~ div').toggle();
        return false;
    },
    display: function() {
        if(!this.showViewAll)
            return false;

        // Link to toggle large numbers of refinements.
        jQuery('#content-search').delegate('#collate .js-toggleviewall a', 'click', jQuery.proxy(this, 'clickHandler'));

        var limit = this.viewAllLimit;
        jQuery('#content-search .js-showviewall').each(function() {
            var facet = jQuery(this);
            // Don't show the link if a refinement has been chosen.
            if(facet.find('.js-termtext').length <= limit
            || facet.find('.js-chosen').length > 0)
                return;
            facet.find('.js-toggleviewall').show();
            facet.find('div:nth-child('+ limit +') ~ div').toggle();
        });
        return false;
    }
};

Venda.Search.Feature.MultiRefine = function() {};
Venda.Search.Feature.MultiRefine.prototype = {
    clickHandler: function(evt) {
        return false;
    },
    display: function() {

        jQuery('#content-search').bind('search-loading-end', jQuery.proxy(this, 'clickHandler'));

        var self = this;
        jQuery('.js-multirefine .js-termtext').each(function(idx, refine) {
            var multi = jQuery('#multirefine-tmpl label').clone(true),
               single = jQuery(refine),
               chosen = single.hasClass('js-chosen'),
                   cb = multi.find('input:checkbox');
            if(chosen)
                cb.get(0).checked = true;
            cb.val(Venda.Search.fixRefinementUri(single.data(), chosen));
            multi.find('.js-facet').html( single.find('.js-facet').html() );
            single.html(multi);
        });
        return false;
    }
};

Venda.Search.Feature.IndicateLoading = function() {};
Venda.Search.Feature.IndicateLoading.prototype = {
    clickHandler: function(evt) {
        jQuery('#loadingsearch').show();
        return false;
    },
    display: function() {
        jQuery('#content-search').bind('search-loading-start', jQuery.proxy(this, 'clickHandler'));
        return false;
    }
};

Venda.Search.Feature.HideLoading = function() {};
Venda.Search.Feature.HideLoading.prototype = {
    clickHandler: function(evt) {
        jQuery('#loadingsearch').hide();
        return false;
    },
    display: function() {
        jQuery('#content-search').bind('search-loading-end',   jQuery.proxy(this, 'clickHandler'));
        return false;
    }
};

Venda.Search.Feature.FilterRefinements = function() {};
Venda.Search.Feature.FilterRefinements.prototype = {
    clickHandler: function(evt) {

        var $this = jQuery(evt.target);

        jQuery(".js-refine-" + $this.data('areaToRefine') + " .js-termtext").each(function () {

            var $termtextThis = jQuery(this);

            if ($termtextThis.text().search(new RegExp($this.val(), "i")) < 0) {
                $termtextThis.addClass("hide");
            }
            else {
                $termtextThis.removeClass("hide");
            }
        });
        return false;
    },
    display: function() {

    var input = jQuery('<input type="text" class="js-filterinput search-collate-filter"/>').attr({ name: 'filtertype' });

        jQuery('.js-search-collate-facet:not(#priceresults)').prepend(input);

        jQuery(".js-filterinput").each(function () {
           jQuery(this).data('areaToRefine',jQuery(this).parent().prev('.js-collateheading').attr('id'));
        });

        jQuery(".js-filterinput").bind('keyup', jQuery.proxy(this, 'clickHandler'));
        return false;
    }
};

Venda.Search.Feature.PopListItems = function() {};
Venda.Search.Feature.PopListItems.prototype = {
    display: function() {
        // pops in the list elements
        jQuery('#content-search-body .js-prod').hide();
        jQuery(".js-prod").each(function(index) {
            jQuery(this).delay(200*index).fadeIn(300);
        })
        return false;
    }
};

Venda.Search.Feature.ViewStyleSwitcher = function() {};
Venda.Search.Feature.ViewStyleSwitcher.prototype = {
    display: function() {
        // ViewStyle - Grid switcher
        Venda.Widget.ViewStyle.setCookieForViewStyle();
        Venda.Widget.ViewStyle.addClassForViewStyle(viewStyleCookieName);
        return false;
    }
};

Venda.Search.Feature.ColorSwatch = function() {};
Venda.Search.Feature.ColorSwatch.prototype = {
    display: function() {
        // colorSwatch - Colour swatch image switcher
        var colorSwatch = new Venda.Ebiz.colorSwatch();
        colorSwatch.init();
        return false;
    }
};

