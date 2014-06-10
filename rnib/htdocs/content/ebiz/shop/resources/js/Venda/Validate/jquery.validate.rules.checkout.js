// Used for checkout and my account.
jQuery('body').bind('contact-loaded', function() {
	    jQuery("#contactForm").validate({
        rules: {
            field1   : {
                required: true,
                email: true
            },
            field2   : {
                required: true
            },
            field3   : {
                required: true
            }
        },
        messages: {
            field1   : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            },
            field2   : {
                    required: Venda.Validate.msg.nametxt
            },
            field3 : Venda.Validate.msg.message
        },
		submitHandler: function() {
			Venda.Ebiz.submitFormModal('form');
		}
    });
});

jQuery(function() {

    jQuery("form[name=emailsonly1]").validate({
        rules: {
            email   : {
                required: true,
                email: true
            }
        },
        messages: {
            email   : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            }
        }
    });

    jQuery("#formsolrsearch").validate({
        rules: {
            q   : {
                required: true
            }
        },
        messages: {
            q   : {
                required    : Venda.Validate.msg.search
            }
        },
        errorPlacement: function(error, element) {}
    });

	 jQuery('form[name=multipledeliveryaddressesform]').validate({
	   errorPlacement: function(error, element) {}
	 });

	 jQuery('form[name=shopcartform]').validate({
	   errorPlacement: function(error, element) {}
	 });
    jQuery("form[name=ordersummaryform-giftcert]").validate({
        rules: {
            giftcode   : {
                required: true
            }
        },
        messages: {
            giftcode : Venda.Validate.msg.giftcert_code
        },
        submitHandler: function(form) {
            Venda.Checkout.manualsubmit(form, jQuery('#js-giftcode-waitMsg').text());
        }
    });
    jQuery("form[name=promotionform]").validate({
        rules: {
            vcode   : {
                required: true,
                specialChars: true
            }
        },
        messages: {
            vcode : {
                required: Venda.Validate.msg.promo_code
            }
        },
		submitHandler: function() {
			Venda.Ebiz.checkVoucherForm();
		}
    });
    jQuery("#existingcustomer").validate({
        rules: {
            email   : {
                required: true,
                email: true
            },
            password : {
                required: true
            }
        },
        messages: {
            email   : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            },
            password: Venda.Validate.msg.password
        }
    });

    jQuery("#reminderform").validate({
        rules: {
            usemail : {
                required: true,
                email: true
            }
        },
        messages: {
            usemail : {
                required    : Venda.Validate.msg.email,
                email       : Venda.Validate.msg.email_vaild
            }
        }
    });

    jQuery("#dtsform").validate({
        rules: {
            fname   : {
                required: true,
                maxlength: 30
            },
            lname   : {
                required: true,
                maxlength: 30            }
        },
        messages: {
            fname   : {
                    required: Venda.Validate.msg.fname
            },
            lname   : {
                    required: Venda.Validate.msg.lname
            }
        }
    });

    jQuery('form[name=billingaddressaddform],#tl_user-myform form,form[name=addressbookform],form[name=billingaddresseditform],form[name=deliveryaddressaddform],form[name=deliveryaddresseditform]').validate({
        rules: {
            title   : {
                required: true
            },
            fname   : {
                required: true,
                maxlength: 30
            },
            lname   : {
                required: true,
                maxlength: 30
            },
            cntry   : {
                required: true
            },
            num : {
                required: false
            },
            addr1   : {
                required: true
            },
            city    : {
                required: true
            },
            state   : {
                required: true
            },
            zipc    : {
                required: true,
                findaddress: true
            },
            zcdropdown : {
                required: true
            },
            phone   : {
                required: true,
                phonenumber: true,
                maxlength: 20
            },
            usemail : {
                required: true,
                email: true
            },
            uspswd  : {
                required: true,
                minlength: 5,
                maxlength: 16
            },
            uspswd2 : {
                required: true,
                minlength: 5,
                maxlength: 16,
                equalTo: "#uspswd"
            },
            uspswd0 : {
                required: true,
                minlength: 5,
                maxlength: 16
            }
        },
        messages: {
            title   : {
                    required: Venda.Validate.msg.title
            },
            fname   : {
                    required: Venda.Validate.msg.fname
            },
            lname   : {
                    required: Venda.Validate.msg.lname
            },
            cntry   : {
                    required: Venda.Validate.msg.country
            },
            addr1   : {
                    required: Venda.Validate.msg.addr1
            },
            city    : {
                    required: Venda.Validate.msg.city
            },
            state : {
                    required: Venda.Validate.msg.state
            },
            zipc    : {
                    required: Venda.Validate.msg.postcode,
                    findaddress: Venda.Validate.msg.postcode_populate
            },
            zcdropdown    : {
                    required: Venda.Validate.msg.postcode_dropdown
            },
            phone   : {
                    required: Venda.Validate.msg.phone,
                    phonenumber: Venda.Validate.msg.phone_valid
            },
            usemail : {
                    required: Venda.Validate.msg.email
            },
            uspswd  : {
                    required: Venda.Validate.msg.password,
                    minlength: Venda.Validate.msg.verify_password_minlength,
                    maxlength: Venda.Validate.msg.verify_password_maxlength
            },
            uspswd2 : {
                    required: Venda.Validate.msg.confirm_password,
                    equalTo: Venda.Validate.msg.verify_password_match
            },
            uspswd0 : {
                    required: Venda.Validate.msg.verify_current_password
            }
        },
		 errorPlacement: Venda.Validate.errorPlacement
    });

    if (jQuery('form[name=ordersummaryform]').length > 0 ){

        Venda.Validate.paytypes();

        jQuery('input[name=ohpaytype]').click(function() {
            Venda.Validate.paytypes();
        });
    }

    if (jQuery('form[name=storelocatorform]').length > 0 ){

        Venda.Validate.storelocator();

        jQuery('#storelocatorform').on('click','#pcsubmit',function(){
           Venda.Validate.storelocator();
        });
    }

    if (jQuery('form[name=giftwrappingform]').length > 0 ){
        jQuery("form[name=giftwrappingform]").validate(); //sets up the validator
        jQuery("form[name=giftwrappingform] textarea[name*=cm-]").each(function() {
            jQuery(this).rules("add", {
                rangelength: [0, 80],
                charactersCount: [80, ".js-textMsgCount-"+jQuery(this).data('oirfnbr')]
            });
        });
    }
});

jQuery('form[name=ordersummaryinstoreform]').validate({
	rules: {
		orxeposref   : {
			required: true
		}
	}
});

Venda.Validate.storelocator = function(){
    var $this = jQuery('#address');
    if ($this.val() == $this.attr('placeholder')) {$this.val('');}
    jQuery('form[name=storelocatorform]').validate({
        rules: {
            address : {
                required: true
            }
        }
    });
};

Venda.Validate.paytypes = function(){

    if (jQuery('#creditcard').is(':checked') === true || jQuery('#formpaypal').is(':checked') === true){

        jQuery('form[name=ordersummaryform]').validate({
            rules: {
                exvatconfirmation : {
                    required: true
                },
                ohccnum : {
                    required: {
						depends: function(element) {
							if (jQuery('#creditcard').is(':checked')){
							return true;
							} else {
							return false;
							}
						}
					}
                },
                ohccname : {
                    required: {
						depends: function(element) {
							if (jQuery('#creditcard').is(':checked')){
							return true;
							} else {
							return false;
							}
						}
					},
					vendainput: {
						depends: function(element) {
							if (jQuery('#creditcard').is(':checked')){
							return true;
							} else {
							return false;
							}
						}
					}
                },
                month : {
                    required: {
						depends: function(element) {
							if (jQuery('#creditcard').is(':checked')){
							return true;
							} else {
							return false;
							}
						}
					}
                },
                year : {
                    required: {
						depends: function(element) {
							if (jQuery('#creditcard').is(':checked')){
							return true;
							} else {
							return false;
							}
						}
					},
                    cardexpiry: true
                },
                ohcccsc : {
                    required: {
						depends: function(element) {
							if (jQuery('#creditcard').is(':checked')){
							return true;
							} else {
							return false;
							}
						}
					},
                    number: true,
                    rangelength: [3, 4]
                }
            },
            groups: {
                    expirydate: "month year"
            },
            messages: {
                exvatconfirmation : {
                    required    : 'Please confirm you are registered VAT exempt'
                },
                ohccnum : {
                    required    : Venda.Validate.msg.credit_card_number
                },
                ohccname: Venda.Validate.msg.credit_card_name,
                month : {
                    min: Venda.Validate.msg.credit_card_expired
                },
                year: {
                    cardexpiry: Venda.Validate.msg.credit_card_expired
                },
                ohcccsc : {
                    required    : Venda.Validate.msg.security_code,
                    rangelength : Venda.Validate.msg.security_code_length
                }

            },
			errorPlacement: Venda.Validate.errorPlacement,
            submitHandler: function(form) {
                if(!jQuery(form).is('.submitted')){
                    jQuery(form).addClass('submitted');
                    form.submit();
                }
            }
        });

        jQuery('form[name=ordersummaryform]').validate().currentForm = jQuery('form[name=ordersummaryform]')[0];
    }  else {
        var validatedform = jQuery('form[name=ordersummaryform]').validate();
        validatedform.resetForm();
        validatedform.currentForm = '';
    }
}