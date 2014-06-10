jQuery.fn.textboxCount = function (obj, options) {
		var t_settings = {
			maxChar : 80,
			countStyle : 'down',
			/* up, down*/
			countNegative : false,
			alert : ""
		}
		var settings = jQuery.extend(t_settings, options);
		var t_obj = jQuery(this);
		
		function addClassCharNumber() {
			jQuery(obj).removeClass("c_green c_red");
			if (t_objLength <= options.maxChar) {
				jQuery(obj).addClass("c_green");
			} else {
				jQuery(obj).addClass("c_red");
			}
		}
		
		function showCharNumber() {
			t_objLength = t_obj.val().length;
			if (options.countStyle == 'up') {
				jQuery(obj).html(t_objLength + "/" + options.maxChar);
			} else if (options.countStyle == 'down') {
				jQuery(obj).html(options.maxChar - t_objLength);
			}
			addClassCharNumber(t_objLength);
		}
		
		function doAlertMsg(event) {
			var key = event.which;
			if (key >= 33) {
				if (t_obj.val().length >= options.maxChar) {
					event.preventDefault();
					alert(options.alert);
				}
			}
		}
		
		charLength = 0;
		function doCount(event) {
			t_objLength = t_obj.val().length;
			
			if ((t_objLength <= options.maxChar) || (options.countNegative)) {
				if (options.countStyle == 'up') {
					charLength = t_objLength;
					jQuery(obj).html(charLength + "/" + options.maxChar);
				} else if (options.countStyle == 'down') {
					charLength = options.maxChar - t_objLength;
					jQuery(obj).html(charLength);
				}
			} else {
				var scrollPos = t_obj.scrollTop();
				t_obj.val(t_obj.val().substring(0, options.maxChar));
				t_obj.scrollTop(scrollPos);
				
			}
			addClassCharNumber(t_objLength);
			
			if (options.alert != "") {
				doAlertMsg(event);
			}
		}
		
		showCharNumber();
		jQuery(this).bind('keydown keyup keypress mousedown', doCount);
		
		jQuery(this).bind('paste', function (e) {
			// check if right button is clicked
			setTimeout(function () {
				doCount();
				showCharNumber();
			}, 5);
		});
	}