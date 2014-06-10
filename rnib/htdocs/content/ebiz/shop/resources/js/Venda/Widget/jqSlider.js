/**
 * @fileoverview Venda.Widget.jqSlider - Display a specific element with slider
 *
 * This widget provides us with the ability to create a slider for any elements
 *
 * @requires jQuery	js/external/jquery-1.7.1.min.js
 * @requires jQuery	js/external/jquery-ui-1.8.14.custom.min.js
 * @author Sakesan Panjamawat (Auii) <sakp@venda.com>
*/

//create namespace for jqSlider
Venda.namespace('jqSlider');

Venda.jqSlider.width   = 0;
(function($){
	$.fn.jqSlider = function(opt){
		/**
		* jqSlider default configuration
		* @type Object
		*/
		var options = {
			display: 4,
			slidenum: 1,
			duration: 0.3,
			direction: 'horizontal',
			elementwidth: 200,
			elementheight: 200,
			uuid: ''
		};
		$.extend(options, opt);
		var equalHeight = function(elements){
			if(typeof(Venda.Platform.EqualHeight) != "undefined"){
				Venda.Platform.EqualHeight.init(elements.split(','));
			}
		};
		var hoverHandler = function(){

		};

		return this.each(function(index){
			/* apply default option + override option */
			/* ignore if not has child element / or already apply  */
			$this = $(this);
			var total = $this.children().length;
			var opt = $.extend({}, options, $this.data());
			opt.total = total;
			opt.display = (opt.display < 1) ? 1 : opt.display;
			opt.slidenum = (opt.slidenum > opt.display) ? opt.display : opt.slidenum;
			if(!(/horizontal|vertical/).test(opt.direction)){opt.direction = 'horizontal';}
			if(opt.equalheight != '' && typeof(opt.equalheight) != 'undefined') equalHeight(opt.equalheight);

			opt.elementwidth = $this.children().first().outerWidth();
			opt.elementheight = $this.children().first().outerHeight();
			if(opt.uuid == ''){opt.uuid = (this.id) ? 'slider-'+this.id : 'slider-'+index;}
			$this.data(opt);

			/* make slider structure */
			if($this.parent().is('.js-slider-innerwrap')){
				$parentEle = $this.parents('.js-slider-wrap');
				var current = -1;
				var $sliderEle = $parentEle.find('.js-slider-body');
				$sliderEle.data('current', current);
				$parentEle.find('.js-slider-next').click();
			}else{
				$this.addClass('js-slider-body');
				$this.wrap('<div class="js-'+opt.uuid+'-wrap js-slider-wrap" id="'+opt.uuid+'"><div class="js-slider-innerwrap"></div></div>');
				$parentEle = $this.parents('.js-slider-wrap');
				$parentEle.find('.js-slider-innerwrap').css({position: 'relative'});
				$parentEle.addClass('js-slider-style-'+opt.direction);
			}
			opt = $this.data();
			/* assign width-height*/

			if(opt.direction == 'horizontal'){
				$this.css({position: 'relative', width: (opt.total*opt.elementwidth)+1});
				// disable the width for responsive layout
				// $parentEle.find('.js-slider-innerwrap').width(opt.display*opt.elementwidth);
			}else{
				$this.css({position: 'relative', height: (opt.total*opt.elementheight)+1});
				$parentEle.find('.js-slider-innerwrap').width(1*opt.elementwidth);
				$parentEle.find('.js-slider-innerwrap').height(opt.display*opt.elementheight);
			}
			if($parentEle.find('.js-slider-control').length > 0){return ;}
			if(opt.isTouch){
				$parentEle.find('.js-slider-innerwrap').css('overflow','auto');
			}else{
				if(opt.total > opt.display) {
					if(opt.direction=='horizontal'){
						$parentEle.prepend('<div class="js-slider-control js-slider-prev js-slider-state-disabled" data-control="prev"><i class="icon-carousel-left icon-3x"></i></div>')
						.append('<div class="js-slider-control js-slider-next" data-control="next"><i class="icon-carousel-right icon-3x"></i></div>');
					} else {
						$parentEle.prepend('<div class="js-slider-control js-slider-prev js-slider-state-disabled" data-control="prev"><i class="icon-carousel-up icon-3x"></i></div>')
						.append('<div class="js-slider-control js-slider-next" data-control="next"><i class="icon-carousel-down icon-3x"></i></div>');
					}
					$parentEle.find('.js-slider-control').bind({
						mouseenter: function(e){ $(this).toggleClass('js-slider-state-hover'); },
						mouseleave: function(e){ $(this).toggleClass('js-slider-state-hover'); },
						click: function(e){
							var $parentEle = $(this).parent();
							var $sliderEle = $parentEle.find('.js-slider-body');

							var opt = $sliderEle.data();
							var current = opt.current || 1;
							var doSlide=false;
							if($(this).is('.js-slider-prev') && current > 1){
								current-=opt.slidenum;
								doSlide=true;
							}
							if($(this).is('.js-slider-next') && current+opt.display <= opt.total){
								current+=opt.slidenum;
								doSlide=true;
							}
							if(current < 1) current = 1;
							if(!doSlide) return ;

							if(opt.direction == 'horizontal'){
								$sliderEle.animate({right : ((current-1)*opt.elementwidth)},opt.duration*1000);
							}else{
								$sliderEle.animate({bottom : ((current-1)*opt.elementheight)},opt.duration*1000);
							}
							$sliderEle.data('current', current);

							if(current+opt.display > opt.total){
								$parentEle
									.find('.js-slider-next')
									.addClass('js-slider-state-disabled');
							}else{
								$parentEle
									.find('.js-slider-next')
									.removeClass('js-slider-state-disabled');
							}
							if(current == 1){
								$parentEle
									.find('.js-slider-prev')
									.addClass('js-slider-state-disabled');
							}else{
								$parentEle
									.find('.js-slider-prev')
									.removeClass('js-slider-state-disabled');
							}
						}
					});
				}
			}
		});
	}
})(jQuery);

Venda.jqSlider.itemNumber = 4;
Venda.jqSlider.sliderObj = jQuery('.product-slider .js-slider');
Venda.jqSlider.hideItems = function(){
	Venda.jqSlider.sliderObj.find('li').each(function(index){
		if(jQuery(this).index() >= Venda.jqSlider.itemNumber){
			jQuery(this).fadeOut(200 );
		}
	});
};

Venda.jqSlider.showbutton = function(){
	jQuery('.product-slider').each(function(){
		if(jQuery(this).find('.js-slider li').length  > Venda.jqSlider.itemNumber){
			if(jQuery(this).find('.js-slider-button').length == 0 ){
				jQuery(this).append('<a href="#" class="js-slider-button tertiary radius button" data-alt-icon="icon-reduce" data-default-icon="icon-expand"><i class="icon-expand icon-large"></i>  <span>'+Venda.jqSlider.sliderObj.data().viewmore+'</span>  <i class="icon-expand icon-large"></i></a>');
			}
		}
	});
	jQuery('.js-slider-button').click(function(event){
		event.preventDefault();
		if(jQuery(this).parents('.product-slider').hasClass('showall')){

			jQuery(this).parents('.product-slider').find('li').each(function(index){
				if(jQuery(this).index() >= Venda.jqSlider.itemNumber){
					jQuery(this).fadeOut(200 );
				}
			});
			jQuery(this).find('span').html(Venda.jqSlider.sliderObj.data().viewmore);
			jQuery(this).find('i').addClass(jQuery('.js-slider-button').attr('data-default-icon')).removeClass(jQuery('.js-slider-button').attr('data-alt-icon'));
			jQuery(this).parents('.product-slider').removeClass('showall');
		} else {
			jQuery(this).parents('.product-slider').find('li').fadeIn( "slow" );
			jQuery(this).parents('.product-slider').addClass('showall');
			jQuery(this).find('span').html(Venda.jqSlider.sliderObj.data().viewless);
			jQuery(this).find('i').removeClass(jQuery('.js-slider-button').attr('data-default-icon')).addClass(jQuery('.js-slider-button').attr('data-alt-icon'));
		}
	});

};

Venda.jqSlider.loadSlider = function(){
		if(Modernizr.mq('only screen and (min-width: 768px)') && (!Venda.jqSlider.sliderObj.hasClass('js-small'))){
			Venda.jqSlider.sliderObj.jqSlider({isTouch: is_touch_device()});
			Venda.jqSlider.sliderObj.addClass('js-small');
			Venda.jqSlider.sliderObj.find('li').show();
			jQuery('.js-slider-button').remove();
		}
		else if(Modernizr.mq('only screen and (max-width: 767px)')  && (Venda.jqSlider.sliderObj.hasClass('js-small'))){
			jQuery('.js-slider-control').remove();
			Venda.jqSlider.sliderObj.removeClass('js-small');
			Venda.jqSlider.sliderObj.css({'width': 'auto', 'right': '0'});
			Venda.jqSlider.hideItems();
			Venda.jqSlider.showbutton();
		}
};

jQuery(window).load(function(){
	if(jQuery('html').hasClass('lt-ie9')) {
		Venda.jqSlider.sliderObj.jqSlider({isTouch: is_touch_device()});
	}else {
		if(Modernizr.mq('only screen and (max-width: 767px)') ){
			Venda.jqSlider.sliderObj.addClass('js-small');
		}
		Venda.jqSlider.loadSlider();	
	
		jQuery(window).on('resize',function(){
			Venda.jqSlider.loadSlider();
		});
	}
});