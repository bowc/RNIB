/*global util, alert: true */

/*jshint bitwise: true */
/*jshint browser: true */
/*jshint camelcase: false */
/*jshint curly: true */
/*jshint eqeqeq: true */
/*jshint expr: true */
/*jshint immed: false */
/*jshint indent: 2 */
/*jshint latedef: true */
/*jshint laxbreak: true */
/*jshint noarg: true */
/*jshint plusplus: false */
/*jshint quotmark: single */
/*jshint undef: true */
/*jshint unused: true */
/*jshint trailing: true */

!function (global) {
  'use strict';

  /**
   * Define the MinicartDetail module.
   */
  function defineModule(Venda, $) {

    var options, Atts;

    options = {

      endpoint: {
        details: '/page/home&layout=minicart',
        basket: '/bin/venda?ex=co_wizr-shopcart&bsref=shop&log=22',
        checkout: '#tag-checkoutlink',
        addProduct: '#tag-codehttp'
      },

      node: {
        general: {
          wrapper: '.minicartDetailWrapper',
          details: '.basketholder'
        },
        dropdown: {
          attachedTo: '#basketSection',
          wrapper: '#basketSection .minicartDetailWrapper',
          header: '#basketSection #minicart-header',
          footer: '#basketSection #minicart-footer',
          content: '#basketSection #basketWrapper, #basketSection #minicart_empty',
          details: '#basketSection .basketholder'
        },
        offCanvas: {
          wrapper: '#js-canvas-content-right .minicartDetailWrapper'
        },
        addToBasket: '.js-addtobasket',
        addingToBasket: '.js-addingtobasket',
        buttonUp: '.buttonUp',
        buttonDown: '.buttonDown',
        form: '#addproductform',
        totalItems: '#basketSection .js-updateItems',
        totalItemsTiny: '.js-canvas-right .js-updateTotalMini',
        totalItemsText: '.js-updateItemsText',
        totalPrice: '#basketSection .js-updateTotal',
        addProduct: '.js-addproduct',
        minicartHeaderText: '.minicart-header-text',
        productUpdate: '.prod-detail-buttons',
        productUpdateMulti: '.js-buyControlsMulti',
        quantity: 'input[name="qty"]',
        notify: '#addproductform #notify',
        notifyTemplate: '#notifyTemplate',
        productName: '#tag-invtname',
        attStyles: '.js-attributesForm',
        labels: '#attributeNames'
      },
      device: util.checkDevice(),
      duration1: 250,
      duration2: 3000,
      duration3: 5000,
      duration4: 500,
      duration5: 250,
      isResponsive: false,

      // 'disabled', 'hover', or 'click'
      showMinicartDetail: 'disabled',
      showAfterAddProd: false,
      showNotifications: true,
      appendNotify: false,
      highlight: true,
      scrollSpeed: 40,
      autoload: false,
      animOpen: true,
      largeDeviceSmoothScroll: true
    };

    Atts = Venda.Attributes;

    var MinicartDetail = {

      init: function (options) {
        util.merge(this, options);
        this.minicartLoaded = false;
        this.pending = false;
        this.visible = false;
        this.productIds = {};
        this.multiForm = false;
        this.multiFormType = false;
        this.multiTest = ['productdetailSet', 'productset'];
        this.largeDevices = ['standard', 'large', 'tablet'];
        this.checkboxes = {};
        this.device = util.checkDevice();
        if (this.autoload && this.showMinicartDetail !== 'disabled') {
          this.loadMinicartHtml();
        }
        return this;
      },

      loadMinicartHtml: function (highlight, update, callback) {
        var _this, loader, $wrapper, loaded;
        _this = this;
        loaded = 0;
        this.minicartLoaded = false;
        $('.js-minicart i.icon-shopping-cart').replaceWith('<i class="icon-spinner"></i>');
        loader = this.template('loader').join('');
        $wrapper = $(this.node.general.wrapper);
        if (this.device === 'mobile') { $wrapper.empty().append(loader); }
        $wrapper.load(this.endpoint.details, function () {
            loaded++;
            _this.cacheProductIds();
            _this.minicartLoaded = true;
            if (loaded < 2 && update && _this.showAfterAddProd) {
              _this.toggleVisibility();
            }
            if (highlight && _this.highlight) {
              _this.highlightProduct(highlight);
            }
            $('.js-minicart i.icon-spinner').replaceWith('<i class="icon-shopping-cart"></i>');
            if (callback) { callback(); }
          });
        return this;
      },

      highlightProduct: function (highlight) {
        var $el, position;
        $el = $(this.node.dropdown.details).find('li.minicart-' + highlight);
        $el.addClass('minicartHighlight');
        position = $el.position();
        if (this.showAfterAddProd) {
          this.scrollMinicartDetails(null, position.top);
        }
        return this;
      },

      cacheProductIds: function () {
        var $hidden, obj, i;
        obj = {};
        $hidden = $(this.node.general.details).find('.hiddenfields');
        $hidden.each(function () {
          var hash, id;
          id = $(this).find('[name="line-id"]').val();
          hash = $(this).find('[name="hash"]').val();
          obj[hash] = id;
        });
        for (i in obj) {
          if (obj.hasOwnProperty(i)) {
            if (!this.productIds[i]) {
              this.productIds[i] = obj[i];
            }
          }
        }
        return this;
      },

      template: function (template) {
        var obj;
        obj = {
          alert: [
            '<div id="notify" class="box box-section">',
            '<div class="box-header alert">Oops!</div>',
            '<div class="box-body alert">',
            '<div class="row">',
            '<div class="large-24 columns">',
            '#{alert}',
            '</div>',
            '</div>',
            '</div>',
            '</div>'
          ],
          detailsLine: [
            '<span class="bold">#{label}:</span> #{select}'
          ],
          multicheckbox: [
            '<label>#{text} ',
            '<input type="checkbox" id="checkAllProducts" />',
            '</label>'
          ],
          loader: [
            '<div class="canvas-loading">',
            '<i class="icon-spinner icon-spin icon-2x"></i>',
            '<span>Please wait...</span>',
            '</div>'
          ]
        };
        return obj[template];
      },

      toggleVisibility: function () {
        var isDesktop, _this, checkDevice;
        _this = this;
        checkDevice = util.checkDevice();
        this.device = (checkDevice === undefined) ? 'large' : checkDevice;
        isDesktop = this.largeDevices.contains(this.device);
        if (isDesktop) {
          if (this.visible) {
            this.toggleMinicart('close');
          } else {
            if (!this.minicartLoaded) {
              this.loadMinicartHtml(null, null, function () {
                _this.setPosition();
                _this.toggleMinicart('show');
              });
            } else {
              this.setPosition();
              this.toggleMinicart('show');
            }
          }
        }
        return this;
      },

      hideElements: function () {
        var elements, i, l;
        elements = Array.prototype.slice.call(arguments);
        for (i = 0, l = elements.length; i < l; i++) {
          elements[i].css({
            opacity: 0,
            visibility: 'hidden'
          }).animate({opacity: 0});
        }
        return this;
      },

      showElements: function () {
        var elements, i, l;
        elements = Array.prototype.slice.call(arguments);
        for (i = 0, l = elements.length; i < l; i++) {
          elements[i].css({
            opacity: 0,
            visibility: 'visible'
          }).animate({ opacity: 1.0 });
        }
        return this;
      },

      prepareElements: function () {
        var elements, i, l;
        elements = Array.prototype.slice.call(arguments);
        for (i = 0, l = elements.length; i < l; i++) {
          elements[i].css({ opacity: 0, visibility: 'visible'});
        }
        return this;
      },

      showMinicart: function () {
        var $content, $footer, $wrapper, _this, height;
        _this = this;
        $wrapper = $(this.node.dropdown.wrapper).show();
        $footer = $(this.node.dropdown.footer);
        $content = $(this.node.dropdown.content);
        height = $footer.position().top + $footer.outerHeight();
        if (this.animOpen) {
          this.hideElements($content, $footer);
          this.prepareElements($wrapper);
          $wrapper.css({ opacity: 1.0 });
          $wrapper.animate({
            height: height
          }, this.duration1, function () {
            _this.showElements($content, $footer);
            _this.setPosition('resize');
            _this.visible = true;
            _this.pending = false;
          });
        } else {
          $wrapper.css({ visibility: 'visible', height: height });
          this.showElements($content, $footer);
          this.setPosition('resize');
          this.visible = true;
          this.pending = false;
          $wrapper.css({ opacity: 1.0 });
//          $wrapper.animate({ opacity: 1.0 }, this.duration1, function () {
          //});/
        }
        return this;
      },

      hideMinicart: function () {
        var $content, $footer, $wrapper, _this;
        _this = this;
        $wrapper = $(this.node.dropdown.wrapper);
        $footer = $(this.node.dropdown.footer);
        $content = $(this.node.dropdown.content);
        if (this.animOpen) {
          this.hideElements($content, $footer);
          $wrapper.animate({
            height: 0
          }, this.duration4, function () {
            $wrapper.hide();
            _this.pending = false;
            _this.visible = false;
          });
        } else {
          $wrapper.hide();
          this.pending = false;
          this.visible = false;
        }
        return this;
      },

      toggleMinicart: function (type) {
        if (type === 'show') { this.showMinicart(); }
        if (type === 'close') { this.hideMinicart(); }
        return this;
      },

      setPosition: function (type) {
        this.positionContent();
        this.positionFooter();
        this.positionMinicartDetail(type);
        this.toggleDirectionButtons();
        return this;
      },

      positionContent: function () {
        var $content, $header, detailsHeight, height, mainHeight,
            headerLowerPos;
        $content = $(this.node.dropdown.content);
        $header = $(this.node.dropdown.header);
        detailsHeight = $(this.node.dropdown.details).outerHeight() + 10;
        mainHeight = $(window).height() - $(this.node.dropdown.attachedTo).outerHeight() - 450;
        if (mainHeight > detailsHeight) {
          height = detailsHeight;
        } else {
          height = (mainHeight < 120) ? 120 : mainHeight;
        }
        headerLowerPos = $header.offset().top + $header.outerHeight();
        $content.offset({top: headerLowerPos});
        $content.height(height);
        return this;
      },

      positionFooter: function () {
        var contentLowerPos, $content, $footer;
        $footer = $(this.node.dropdown.footer);
        $content = $(this.node.dropdown.content);
        contentLowerPos = $content.offset().top + $content.height();
        $footer.offset({top: contentLowerPos});
        return this;
      },

      positionMinicartDetail: function (type) {
        var $wrapper, $attachedTo, $footer, widthDiff;
        $wrapper = $(this.node.dropdown.wrapper);
        $attachedTo = $(this.node.dropdown.attachedTo);
        $footer = $(this.node.dropdown.footer);
        widthDiff = $wrapper.outerWidth() - $attachedTo.outerWidth() - 1;
        $wrapper.css({
          top: $attachedTo.position().top + $attachedTo.height(),
          left: -widthDiff
        });
        if (type === 'resize') {
          $wrapper.css({height: $footer.position().top + $footer.outerHeight() });
        }
        if (type === 'removed') {
          $wrapper.animate({
            height: $footer.position().top + $footer.outerHeight()
          }, 500);
        }
        return this;
      },

      resetForm: function () {
        var $selects, text, $form;
        $form = $(this.node.form);
        text = $(this.node.attStyles).text();
        switch (text) {
          case 'dropdown':
            $selects = $form.find('select');
            $selects.each(function () {
              $(this).prop('selectedIndex', 0)
                .trigger('change')
                .trigger('liszt:updated');
            });
            break;
          case 'swatch':
            $selects = $form.find('select');
            break;
          case 'halfswatch':
            break;
        }
        return this;
      },

      enableButton: function (button, text, type) {
        var $button;
        $button = $(button);
        if (type && type === 'anchor') {
          $button.html(text);
        } else {
          $button.val(text);
        }
        $button.removeAttr('disabled');
        $button.css({ opacity: 1.0 });
        $button.find('i').remove();
        return this;
      },

      disableButton: function (button, text, type) {
        var $button;
        $button = $(button);
        if (type && type === 'anchor') {
          $button.html(text);
        } else {
          $button.val(text);
        }
        $button.append('<i class="icon-spinner icon-spin icon-large thinpad-side"></i>');
        $button.attr('disabled', 'disabled');
        $button.css({ opacity: 0.5 });
        return this;
      },

      addProduct: function (el) {
        var serialisedForm, $form, _this, isValid;
        _this = this;
        isValid = this.validate(el);
        if (isValid) {
          $form = $(this.node.form);
          $form.find('input[name="layout"]').val('minicart');
          $form.find('input[name="ex"]').val('co_disp-shopc');
          this.disableButton($(this.node.addProduct), $(this.node.addingToBasket).text(), 'anchor');
          this.removeNotify();
          serialisedForm = $form.serializeToLatin1();
          $.ajax({
            type: 'POST',
            global: false,
            url: $(this.endpoint.addProduct).html(),
            data: serialisedForm,
            success: function (html) {
              var highlight, hasAlert;
              hasAlert = $(html).find('.alert-box').length > 0 ? true : false;
              if (!hasAlert) {
                _this.updateTotals(html);
                if (_this.showMinicartDetail !== 'disabled') {
                  highlight = Atts.dataObj.atrsku;
                  _this.loadMinicartHtml(highlight, true);
                  $('body').trigger('minicart-items-added');
                }
              }
              _this.processNotifications(html, $form);
              _this.enableButton($(_this.node.addProduct), $(_this.node.addToBasket).text(), 'anchor');
              $form.find('input[name="layout"]').val('');
              $form.find('input[name="ex"]').val('co_wizr-shopcart');
              $('#js-aria')
                .attr('role', 'alert')
                .attr('aria-live', 'assertive')
                .hide()
                .show();
              $('#js-aria-viewbasket').focus();
            }
          });
        }
        return this;
      },

      updateTotals: function (html) {
        var $html, obj;
        obj = {};
        $html = $(html);
        obj.totalItems = $html.find('.js-updateItems').text();
        obj.totalItemsTiny = $html.find('.js-updateTotalMini').text();
        obj.totalItemsText = $html.find('.js-updateItemsText').text();
        obj.totalPrice = $html.find('.js-updateTotal').text();
        $(this.node.totalItems).text(obj.totalItems);
        $(this.node.totalItemsTiny).text(obj.totalItems);
        $(this.node.totalItemsText).text(obj.totalItemsText);
        $(this.node.totalPrice).text(obj.totalPrice);
        return this;
      },

      processNotifications: function (html, $form) {
        var $html, $alert, templateObject, hasAlert;
        $html = $(html);
        $alert = $html.find('.alert-box[data-alert]');
        hasAlert = $alert.length > 0 ? true : false;
        if (this.showNotifications) {
          if (hasAlert) {
            templateObject = {
              alert: $alert.html()
            };
            this.showNotify(templateObject, 'alert');
          } else {
            if (this.multiForm) {
              templateObject = { text: 'Items added to your basket.' };
            } else {
              templateObject = this.createProductNotify($form);
            }
            this.showNotify(templateObject, 'default');
          }
        }
        return this;
      },

      getLabels: function () {
        var labels;
        labels = [];
        $(this.node.labels).find('div').each(function () {
          var text;
          text = $(this).text();
          if (text) { labels.push(text); }
        });
        return labels;
      },

      createProductNotify: function ($form) {
        var product, quantity, details, attribute, attr, labels, obj,
            $choice, select, label, i, l, o, template;
        product = $(this.node.productName).text();
        quantity = $form.find(this.node.quantity).val();
        labels = this.getLabels();
        if ($('.js-attributesForm').length > 0) {
          template = this.template('detailsLine');
          details = '';
          for (i = 0, l = labels.length; i < l; i++) {
            attr = i + 1;
            attribute = '[name="att' + attr + '"]';
            if (attribute && attribute.length > 0) {
              $choice = $form.find(attribute);
              select = $choice.val();
              label = labels[i];
              o = { label: label, select: select };
              details += util.applyTemplate(template, o);
              if (i < labels.length - 1) { details += ', '; }
            }
          }
          if (labels.length > 0) { details = '(' + details + ')'; }
          obj = {
            quantity: quantity,
            product: product,
            details: details,
            basketUrl: this.endpoint.basket,
            checkoutUrl: $(this.endpoint.checkout).text()
          };
        } else {
          obj = {
            quantity: quantity,
            product: product,
            basketUrl: this.endpoint.basket,
            checkoutUrl: $(this.endpoint.checkout).text()
          };
        }
        return obj;
      },

      removeNotify: function () {
        $(this.node.notify)
          .animate({ height: 0 }, {
            duration: this.duration1,
            complete: function () { $(this).remove(); }
          });
        return this;
      },

      showNotify: function (templateObject, type) {
        var html, template, attachedTo, node, $template;
        if (type === 'default') {
          $template = $(this.node.notifyTemplate);
          if (!this.multiForm) { $template.find('#js-notify-text').empty(); }
          if (this.multiForm || $('.js-attributesForm').length === 0) {
            $template.find('#js-notify-details').empty();
          }
          template = $template.html();
        } else {
          template = this.template(type);
        }
        html = util.applyTemplate(template, templateObject);
        node = this.node;
        attachedTo = this.multiForm ? node.productUpdateMulti : node.productUpdate;
        if (this.appendNotify) {
          $(html).insertAfter($(attachedTo));
        } else {
          $(html).insertBefore($(attachedTo));
        }
        return this;
      },

      toggleDirectionButtons: function () {
        var $content, position, height, scrollHeight, $up, $down, totalItems;
        $content = $(this.node.dropdown.content);
        $up = $(this.node.buttonUp);
        $down = $(this.node.buttonDown);
        position = $content.scrollTop();
        scrollHeight = $content[0].scrollHeight;
        height = $content.outerHeight();
        totalItems = parseInt($(this.node.totalItems).html(), 10);
        if (totalItems > 0) {
          $up.removeClass('off').addClass('on');
          $down.removeClass('off').addClass('on');
          if (position <= 0) {
            $up.removeClass('active').addClass('inactive');
            this.scrollStop();
          }
          if (position > 0) {
            $up.removeClass('inactive').addClass('active');
          }
          if (position >= scrollHeight - height) {
            $down.removeClass('active').addClass('inactive');
            this.scrollStop();
          }
          if (position < scrollHeight - height) {
            $down.removeClass('inactive').addClass('active');
          }
        } else {
          $up.removeClass('on').addClass('off');
          $down.removeClass('on').addClass('off');
        }
        return this;
      },

      scrollMinicartDetails: function (direction, highlightPos) {
        var pos, $wrapper, speed;
        $wrapper = $(this.node.dropdown.content);
        pos = $wrapper.scrollTop();
        if (direction) {
          speed = this.scrollSpeed;
          $wrapper.scrollTop(direction === 'up' ? pos - speed : pos + speed);
        } else {
          $wrapper.scrollTop(highlightPos);
        }
        this.setPosition();
        return this;
      },

      scrollStart: function (direction) {
        var _this;
        _this = this;
        if (['mobile', 'tablet'].contains(this.device) || !this.largeDeviceSmoothScroll) {
          this.scrollMinicartDetails(direction);
        } else {
          (function scroller() {
            _this.scrollMinicartDetails(direction);
            _this.scrollInterval = setTimeout(scroller, 100);
          }());
        }
        return this;
      },

      scrollStop: function () {
        if (this.largeDeviceSmoothScroll) {
          clearTimeout(this.scrollInterval);
        }
        return this;
      },

      populateProductIds: function () {
        var $hidden, _this;
        _this = this;
        $hidden = $(this.node.general.details).find('.hiddenfields');
        $hidden.each(function () {
          var hash, id, $this, $input;
          $this = $(this);
          id = $this.find('[name="line-id"]').val();
          hash = $this.find('[name="hash"]').val();
          if (_this.productIds[hash]) {
            $input = $this.find('input');
            $input.each(function () {
              var name, value, regex, $this;
              $this = $(this);
              name = $this.attr('name');
              value = $this.attr('value');
              regex = new RegExp('\\*|' + id, 'g');
              $this.attr('name', name.replace(regex, _this.productIds[hash]));
              $this.attr('value', value.replace(regex, _this.productIds[hash]));
            });
          }
        });
        return this;
      },

      createItemRemovalForm: function (el, callback) {
        var $hidden, $normal, $dataline, numberStart, quantity, i, l,
            lineid, $form, template;
        $form = $('<form id="deleteitem"></form>');
        $hidden = $(el).closest('.prod-details').find('.hiddenfields');
        $normal = $hidden.find('input.normal');
        $dataline = $hidden.find('input.dataline');
        $normal.appendTo($form);
        $dataline.appendTo($form);
        lineid = $normal.filter('[name="line-id"]').val();
        numberStart = parseInt($normal.filter('[name="numberstart"]').val(), 10);
        quantity = parseInt($normal.filter('[name="quantity"]').val(), 10);
        template = '<input name="oirfnbr-id-#{lineid}" value="#{i}"/>';
        for (i = numberStart, l = numberStart + quantity; i < l; i++) {
          template.replace('#{lineid}', lineid).replace('#{i}', i);
          $(template).appendTo($form);
        }
        callback($form);
      },

      removeItem: function (el) {
        var _this;
        _this = this;
        this.disableButton(el, 'Removing', 'anchor');
        this.populateProductIds();
        setTimeout(function () {
          _this.createItemRemovalForm(el, function (form) {
            $.ajax({
              type: 'POST',
              async: false,
              url: '/bin/venda',
              data: form.serialize(),
              success: function (html) {
                _this.loadMinicartHtml(null, null, function () {
                  _this.setPosition('removed');
                  _this.updateTotals(html);
                });
              }
            });
          });
        }, 10);
        return this;
      },

      checkMultipage: function (type) {
        var check;
        check = this.multiTest.contains(type);
        this.multiFormType = type;
        if (check) {
          this.multiForm = check;
          this.addCheckAllBox();
          this.initCheckboxes();
          this.toggleAllProducts(false);
        }
        return this;
      },

      initCheckboxes: function () {
        $('.js-addToCheckBoxLabel').css('display', 'block');
        $('.js-addToCheckBox').each(function () {
          $(this).removeAttr('checked');
        });
        $('#checkAllProducts').removeAttr('checked');
        return this;
      },

      addCheckAllBox: function () {
        var text, label, template;
        text = $('#attributes-addAllProduct').text();
        template = this.template('multicheckbox');
        label = util.applyTemplate(template, { text: text });
        $('.js-buyControlsMulti').prepend(label);
        return this;
      },

      getCheckboxUid: function (el) {
        var id, uid, type, $el;
        $el = $(el);
        id = $el.attr('id');
        type = this.multiFormType;
        if (type !== 'productdetailMulti') {
          uid = $el.closest('.js-oneProduct').attr('id').substr(11);
        } else {
          uid = id;
        }
        return {id: id, uid: uid};
      },

      enableCheckbox: function (el) {
        var obj;
        obj = this.getCheckboxUid(el);
        this.checkboxes[obj.uid] = true;
        $('#itemlist_' + obj.id).removeAttr('disabled');
        $('#qtylist_' + obj.id).removeAttr('disabled');
        this.checkCheckAllBox();
        return this;
      },

      disableCheckbox: function (el) {
        var obj;
        obj = this.getCheckboxUid(el);
        this.checkboxes[obj.uid] = false;
        $('#itemlist_' + obj.id).attr('disabled', true);
        $('#qtylist_' + obj.id).attr('disabled', true);
        this.checkCheckAllBox();
        return this;
      },

      checkCheckAllBox: function () {
        var prop, check;
        check = true;
        for (prop in this.checkboxes) {
          if (this.checkboxes.hasOwnProperty(prop)) {
            if (!this.checkboxes[prop]) { check = false; }
          }
        }
        if (check) {
          $('#checkAllProducts').attr('checked', true);
        } else {
          $('#checkAllProducts').removeAttr('checked');
        }
        return this;
      },

      itemsSelected: function () {
        var prop, check;
        check = false;
        for (prop in this.checkboxes) {
          if (this.checkboxes.hasOwnProperty(prop)) {
            if (this.checkboxes[prop]) { check = true; }
          }
        }
        return check;
      },

      toggleAllProducts: function (box) {
        var $checkboxes, $box, _this, checked;
        _this = this;
        $checkboxes = $('input.js-addToCheckBox');
        if (!box) {
          $checkboxes.each(function () { _this.disableCheckbox(this); });
        } else {
          $box = $(box);
          checked = $box.attr('checked') === 'checked' ? true : false;
          if (checked) {
            $box.attr('checked', true);
            $checkboxes.attr('checked', true);
            $checkboxes.each(function () { _this.enableCheckbox(this); });
          } else {
            $box.removeAttr('checked');
            $checkboxes.removeAttr('checked');
            $checkboxes.each(function () { _this.disableCheckbox(this); });
          }
        }
        return this;
      },

      validateRoutine: function (uID) {
        var i, l, arr, att1, att2, att3, att4, isValid;
        isValid = false;
        if (Atts.productArr.length > 0) {
          switch (this.multiFormType) {
            case 'productdetail':
            case 'quickBuyFast':
            case 'quickBuyDetails':
            case 'productdetailSet':
            case 'productset':
            case 'quickShop':
              for (i = 0, l = Atts.productArr.length; i < l; i++) {
                arr = Atts.productArr[i];
                att1 = arr.attSet.att1.selected;
                att2 = arr.attSet.att2.selected;
                att3 = arr.attSet.att3.selected;
                att4 = arr.attSet.att4.selected;
                if (uID === arr.attSet.id) {
                  if (Atts.IsAllSelected(att1, att2, att3, att4, uID)) {
                    switch (Atts.Get('stockstatus')) {
                      case 'Out of stock':
                        alert($('#attributes-stockOut').text());
                        isValid = false;
                        break;
                      case 'Not Available':
                        alert($('#attributes-stockNA').text());
                        isValid = false;
                        break;
                      default:
                        isValid = true;
                        break;
                    }
                  }
                }
              }
              break;
          }
        }
        return isValid;
      },

      validate: function () {
        var _this, arr, uID;
        _this = this;
        arr = [];
        if (!$('#addproductform').valid()) { return false; }
        if (this.multiForm && !this.itemsSelected()) { return false; }
        if ($('.js-attributesForm').length === 0) { return true; }
        $('.js-oneProduct').each(function () {
          uID = $(this).attr('id').substr(11);
          arr.push(_this.validateRoutine(uID));
        });
        if (arr.contains(false)) { return false; }
        return true;
      },

      updateDisplay: function () {
        var isDesktop;
        this.device = util.checkDevice();
        isDesktop = this.largeDevices.contains(this.device);
        if (isDesktop) {
          this.setPosition('resize');
          $(this.node.el).fadeIn(this.duration1);
        } else {
          $(this.node.el).fadeOut(this.duration1);
        }
      }

    };


    // UI
    $(window).on('load', function () {
      $('.js-minicart a').on('click');
      $(this).bind('resize', function () {
        if (MinicartDetail.visible) { MinicartDetail.updateDisplay(); }
      });
    });

    $(document).ready(function () {

      MinicartDetail.init(options);

      $('.js-minicart a').off('click');

      var formType, timer;

      formType = $('.js-attributesForm').attr('id');
      MinicartDetail.checkMultipage(formType);

      $(document)
        .on('touchstart', '.buttonUp', function () { MinicartDetail.scrollStart('up'); })
        .on('touchstart', '.buttonDown', function () { MinicartDetail.scrollStart('down'); })
        .on('touchend', '.buttonDown, .buttonUp', function () { MinicartDetail.scrollStop(); })
        .on('mousedown', '.buttonUp', function () { MinicartDetail.scrollStart('up'); })
        .on('mousedown', '.buttonDown', function () { MinicartDetail.scrollStart('down'); })
        .on('mouseup', '.buttonDown, .buttonUp', function () { MinicartDetail.scrollStop(); })
        .on('click', '.js-offCanvasClose', function () { MinicartDetail.toggleVisibility(); })
        .on('click', '#continue', function () { MinicartDetail.removeNotify(); MinicartDetail.resetForm(); });

      $('.js-minicart').click(function (e) {
        if (MinicartDetail.showMinicartDetail === 'click') {
          e.preventDefault();
          MinicartDetail.toggleVisibility();
        } else {
          return true;
        }
      });

      $('#basketSection').hover(function () {
        if (MinicartDetail.showMinicartDetail === 'hover') {
          if (MinicartDetail.visible && !MinicartDetail.pending) {
            clearTimeout(timer);
          }
          if (!MinicartDetail.visible && !MinicartDetail.pending) {
            MinicartDetail.pending = true;
            MinicartDetail.toggleVisibility();
          }
        }
      }, function () {
        timer = setTimeout(function () {
          if (MinicartDetail.visible && !MinicartDetail.pending && MinicartDetail.showMinicartDetail === 'hover') {
            MinicartDetail.pending = true;
            MinicartDetail.toggleVisibility();
          }
        }, MinicartDetail.duration5);
      });

      $(document).on('click', function (e) {
        if ($('#basketSection').length > 0) {
          var nodeInBasket = $.contains($('#basketSection')[0], e.target);
          if (!nodeInBasket && MinicartDetail.visible && MinicartDetail.showMinicartDetail === 'click') {
            MinicartDetail.toggleVisibility();
          }
        }
      });

      $(document).on('keypress', '#qty', function (e) {
        if (e.which === '13') {
          $('.js-addproduct').trigger('click');
          return false;
        }
      });

      $(document).on('click', '.js-addproduct, .js-buynow', function (e) {
        if (MinicartDetail.validate()) {
          if ($(this).is('.js-addproduct')) { e.preventDefault(); MinicartDetail.addProduct(this); }
        } else {
          var $productStatus = $('.js-stockFeedbackBox #productstatus');
          if ($productStatus.length > 0 && $productStatus.is(':visible')) {
            //$productStatus.effect('pulsate', { times: 2 }, 700);
			$productStatus.parent().addClass('js-Out_of_stock_box');
            return false;
          }
        }
      });

      $(document).on('change', '#addproductform select', function () {
        if ($('#addproductform #notify').length > 0) { MinicartDetail.removeNotify(); }
      });

      $(document).on('click', '#addproductform .js-attributeSwatch', function () {
        if ($('#addproductform #notify').length > 0) { MinicartDetail.removeNotify(); }
      });

      $('.minicartDetailWrapper').on('click', '.js-removeItem', function (e) {
        e.preventDefault();
        MinicartDetail.removeItem(this);
      });

      $(document).on('click', '#checkAllProducts', function () {
        MinicartDetail.toggleAllProducts(this);
      });

      $(document).on('click', '.js-addToCheckBox', function () {
        var checked;
        checked = $(this).attr('checked') === 'checked' ? true : false;
        if (checked) {
          MinicartDetail.enableCheckbox(this);
        } else {
          MinicartDetail.disableCheckbox(this);
        }
      });

    });

    return MinicartDetail;

  }

  global.Venda = global.Venda || {};
  global.Venda.MinicartDetail = defineModule(global.Venda, global.jQuery);

}(this);