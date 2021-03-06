/*
 *  gizmoMenu - v1.0.0
 *
 *  Made by Callum Hopkins
 *  Under MIT License
 */
;(function ( $, window, document, undefined ) {

	"use strict";

	var gizmoMenu = "gizmoMenu",
		defaults = {
            cssAnimate: false,
            animationDuration: 350,
            mobileMenuWidth: '75%',
            movementMaxDistance: '100%',
            slideDirection: 'left',
            navListClass: 'clsPrpnd',
            mobileNavButton: '#gizmoRespButton',
            prependClose: '<li><a id="gizmoMenuClose" href="#">close</a></li>',
            mobileMenuWrapper: 'header',
            mobileMenuFollowClass: 'gzPeek',
            movementMinDistance: '0%'
		};


	function Plugin ( element, options ) {
		this.element = element;

		this.settings = $.extend( {}, defaults, options );
		this._defaults = defaults;
		this._name = gizmoMenu;
		this.init();
	}

	$.extend(Plugin.prototype, {
		init: function () {
			var $that = this;

			this.elemBody = $(document.body);
			this.theMenu = $(this.element);
			this.theLinks = this.theMenu.find('a');
			this.settings.mobileNavButton = $(this.settings.mobileNavButton);
			this.settings.prependClose = $(this.settings.prependClose);
			this.settings.mobileMenuWrapper = $(this.settings.mobileMenuWrapper);

			this.settings.iScrollPos = 0;
			this.settings.iCurScrollPos = 0;

            this.settings.theDist = parseInt(this.settings.mobileMenuWidth) - 1;
            this.settings.moveDist = this.settings.theDist+this.settings.mobileMenuWidth.replace(/[1-9]/g,'');

			this.setCSS(this.theMenu, this.elemBody, this.settings);

			$(window).resize(function(){
				$that.setCSS($that.theMenu, $that.elemBody, $that.settings);
			});

			this.watchAnimate(this.theMenu, this.elemBody, this.theLinks, this.settings);

			this.settings.mobileMenuWrapperTop = this.settings.mobileMenuWrapper.offset().top;
			this.settings.mobileMenuWrapperHeight = this.settings.mobileMenuWrapper.outerHeight();

			$(window).scroll(function(){
				$that.peekMenu($that.theMenu, $that.elemBody, $that.settings, $(this));
			});
		},

		peekMenu: function (theMenu, theBody, options, scrollElm){
			options.iCurScrollPos = scrollElm.scrollTop();
		    if (options.iCurScrollPos > options.iScrollPos) {
			    options.mobileMenuWrapper.css('position', 'static').css('height', 'auto').removeClass(options.mobileMenuFollowClass);
		    } else {
		    	if($(window).scrollTop() > (options.mobileMenuWrapperTop + options.mobileMenuWrapperHeight)){
			       	options.mobileMenuWrapper.css('position', 'fixed').addClass(options.mobileMenuFollowClass);
			    }else{
			       	options.mobileMenuWrapper.css('position', 'static').css('height', 'auto').removeClass(options.mobileMenuFollowClass);
			    }
		    }
		    options.iScrollPos = options.iCurScrollPos;
		},

		watchAnimate: function (theMenu, theBody, theLinks, options) {
			var that = this;
            options.mobileNavButton.on('click', function(){
            	that.slideIn(theMenu, theBody, options);
            	return false;
            });

            options.prependClose.on('click', function(){
				that.slideOut(theMenu, theBody, options);
				return false;
            });

            theLinks.on('click', function(){
            	that.slideOut(theMenu, theBody, options);
            });
		},

		slideIn: function(theMenu, theBody, options){
		   	if(options.mobileNavButton.is(':visible')){
            	options.prependClose.prependTo(theMenu.find('.'+options.navListClass).addBack('.'+options.navListClass));
            	if(!options.cssAnimate){
            		if(options.slideDirection === 'left'){
            			theBody.css('overflow-y','hidden').animate({left: options.moveDist},options.animationDuration);
            		}else{
         				theBody.css('overflow-y','hidden').animate({right: options.moveDist},options.animationDuration);
            		}
            	}else{
            		theBody.addClass('animateIn');
            	}
            }
		},

		slideOut: function(theMenu, theBody, options){
		    if(options.mobileNavButton.is(':visible')){
            	options.closeBtn = theMenu.find('.'+options.navListClass).addBack('.'+options.navListClass).prepend(options.prependClose);
            	if(!options.cssAnimate){
            		if(options.slideDirection === 'left'){
         				theBody.css('overflow-y','auto').animate({left: 0},options.animationDuration);
            		}else{
         				theBody.css('overflow-y','auto').animate({right: 0},options.animationDuration);
            		}
            	}else{
            		theBody.removeClass('animateIn');
            	}
            }
		},

		setCSS: function (theMenu, theBody, options) {
			if(!options.cssAnimate){
				if(options.mobileNavButton.is(':visible')){
					if(options.slideDirection === 'left'){
	                	theMenu.css('left', '-'+options.mobileMenuWidth).css('width', options.mobileMenuWidth);
	            	}else{
	            		theMenu.css('right', '-'+options.mobileMenuWidth).css('width', options.mobileMenuWidth);
	            	}
	            }else{
	              theMenu.css('left', 0).css('width', 'auto'); 
	              theBody.css('left',0);
	            }
        	}else{
        		if(options.mobileNavButton.is(':visible')){
	                theMenu.addClass('gz-resp-menu');
	                if(options.slideDirection === 'left'){
	                	theBody.addClass('slideInLeft');
	            	}else{
	            		theMenu.addClass('gz-opposite');
	            		theBody.addClass('slideInRight');
	            	}
	            }else{
	             	theMenu.removeClass('gz-resp-menu'); 
	              	theBody.removeClass('animateIn').removeClass('slideInLeft');
	            }	
        	}
		}
	});

	$.fn[ gizmoMenu ] = function ( options ) {
		return this.each(function() {
			if ( !$.data( this, "plugin_" + gizmoMenu ) ) {
				$.data( this, "plugin_" + gizmoMenu, new Plugin( this, options ) );
			}
		});
	};

})( jQuery, window, document );