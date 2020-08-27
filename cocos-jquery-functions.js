/***
 *        _  ___  _   _ ___ _____   __  ___     _
 *       (_)/ _ \| | | | __| _ \ \ / / | __|_ _| |_ _ _ __ _ ___
 *       | | (_) | |_| | _||   /\ V /  | _|\ \ /  _| '_/ _` (_-<
 *      _/ |\__\_\\___/|___|_|_\ |_|   |___/_\_\\__|_| \__,_/__/
 *     |__/
 *     
 * -------------------------------------------------------------------------------------------------
 * @author(s)		Stefan van Buren
 * @copyright 		(concera software - https://concera.software
 * @dateCreated		2018-11-05
 * @lastChange		2020-07-23
 * @version		1.20.204
 * -------------------------------------------------------------------------------------------------
 *
 * -- CHANGELOG:
 * 
 * All notable changes to this project will be documented in this file. The format will be based on
 * the example below. The first line will indicate when, in what version and who made the change(s),
 * followed by the change(s). (1 tab indented). When multiple changes for the same day / version /
 * developer, use multiple lines to list them all. Use one of these types: 'Added', 'Changed',
 * 'Deprecated', 'Removed', 'Fixed' or 'Security', to indicate the type of change that was made.
 * 
 *  date		version		who
 *  	[Type] what...
 *  	[Type] what else...
 *
 *  2020-07-23		1.20.204	SvB
 *  	[Fixed] Fixed the $.button-extension in order to be complatible with both FontAwesome 4 and
 *	FontAwesome 5.
 *
 *  2020-02-17		1.20.047	SvB
 *  	[Added] Added the $.button-object, which can be used to toggle the state of a button to a
 *	loading-state, showing a loader and an different text.
 *
 * -------------------------------------------------------------------------------------------------
 *
 * # FILEDESCRIPTION:
 * 
 * During development the development of the CoCoS Management and all kinds of web-applications,
 * we've created various jQuery-functions which were considered useful. To ensure that these
 * functions are available everywhere, we created this file. This is not a library, just a gathering
 * of of all kinds of custom jQuery-functions which are used by the CoCoS applications and can be
 * handy to use.
 * 
 */
var keyboardAction_ctrlIsDown = false;
var keyboardAction_shiftIsDown = false;

/**
 * [description]
 * @param  {[type]}	e	[description]
 * @return {[type]}  		[description]
 */
$(window).on('keydown', function(e)
{
	keyboardAction_ctrlIsDown = e.ctrlKey;
	keyboardAction_shiftIsDown = e.shiftKey;

}).bind('keyup', function(e)
{
	keyboardAction_ctrlIsDown = e.ctrlKey;
	keyboardAction_shiftIsDown = e.shiftKey;
});

/**
 * [ctrlKeyIsDown description]
 * @return {[type]} [description]
 */
$.ctrlKeyIsDown = function()
{
	return (keyboardAction_ctrlIsDown === true);
}

/**
 * [shiftKeyIsDown description]
 * @return {[type]} [description]
 */
$.shiftKeyIsDown = function()
{
	return (keyboardAction_shiftIsDown === true);
}

/**
 * [urlParam description]
 * @param  {[type]} name [description]
 * @param  {[type]} url  [description]
 * @return {[type]}      [description]
 */
$.urlParam = function(name, url)
{
	if (!url)
	{
		url = window.location.href;
	}

	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
	if (!results)
	{
		return "";
	}
	return results[1] || "";
};

/**
 * [htmlEntitiesDecode description]
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
$.htmlEntitiesDecode = function(html)
{
	return $('<div>').text(html).html();
};

/**
 * [htmlStrip description]
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
$.htmlStrip = function(html, allowNewlines)
{
	if(isTrue(allowNewlines))
	{
		// Replace all matches of <br>, <br >, <br/>, <br /> to ___NEW_LINE___
		//
		html = html.replace(/\<br\s*\/?\>/gi, '___NEW_LINE___');

		// Replace all matches of </p> to ___NEW_LINE___
		//
		html = html.replace(/\<\/p\>/gi, '___NEW_LINE___');

		// Replace all matches of </li> to ___NEW_LINE___
		//
		html = html.replace(/\<\/li\>/gi, '___NEW_LINE___');
	}

	var text = $('<div>').html(html).text();
	text =  $.trim(text);

	// Replace < by &lt; and > by &gt; to prevent html-inclusions. This happened to be a problem
	// for the tooltips, who parsed the stripped html not correctly, which caused HTML-tags to
	// be handled.
	//
	text = text.replace(/</g,"&lt;").replace(/>/g,"&gt;");

	if(isTrue(allowNewlines))
	{	
		// Replace all matches of ___NEW_LINE___ back to <br>'s
		//
		text = text.replace(/\_\_\_NEW\_LINE\_\_\_/gi, '<br>');
	}

	return text;
};

/**
 * [description]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function($)
{
	$.fn.hasParent = function(e)
	{
		return (($(this).parents(e).length) > 0);
	};
})(jQuery);

/**
 * [description]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function($)
{
	$.fn.myShow = function()
	{
		$(this).removeClass("hidden");
		$(this).show();
	};
})(jQuery);

/**
 * [description]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function($)
{
	$.fn.myHide = function()
	{
		$(this).addClass("hidden");
		$(this).hide();
	};
})(jQuery);

/**
 * [scriptAvailable description]
 * @method scriptAvailable
 * @param  {[type]}        url [description]
 * @return {[type]}            [description]
 */
$.scriptAvailable = function(url)
{
	var script = $("script[src^='"+url+"']");
	if(script.length > 0)
	{
		return ($(script).attr("isLoading") != "true");
	}

	return false;
};

/**
 * [styleAvailable description]
 * @method styleAvailable
 * @param  {[type]}       url [description]
 * @return {[type]}           [description]
 */
$.styleAvailable = function(url)
{
	var link = $("link[href^='"+url+"']");
	if(link.length > 0)
	{
		return ($(link).attr("isLoading") != "true");
	}

	return false;
};

// http://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
$.scrollbarWidth = function()
{
	var parent, child, width;

	if(width===undefined)
	{
		parent = $('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo('body');
		child=parent.children();
		width=child.innerWidth()-child.height(99).innerWidth();
		parent.remove();
	}

	return (width+1);
};

$.reverse = [].reverse;

/**
 * [objectSize description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
$.objectSize = function(obj)
{
	var count = 0;
	if (typeof obj == "object")
	{
		if (Object.keys)
		{
			count = Object.keys(obj).length;
		}
		else if (window._)
		{
			count = _.keys(obj).length;
		}
		else if (window.$)
		{
			count = $.map(obj, function() { return 1; }).length;
		}
		else
		{
			for (var key in obj) if (obj.hasOwnProperty(key)) count++;
		}
	}

	return count;
};

/**
 * [isInArray description]
 * @param  {[type]}  value     [description]
 * @param  {[type]}  array     [description]
 * @param  {[type]}  fromIndex [description]
 * @return {Boolean}           [description]
 */
$.isInArray = function(value, array, fromIndex)
{
	return ($.inArray(value, array, fromIndex) > -1);
};

/**
 * [setTransitions description]
 * @param {[type]} obj              [description]
 * @param {[type]} props            [description]
 * @param {[type]} delay            [description]
 * @param {[type]} style            [description]
 * @param {[type]} callbackFunction [description]
 */
$.setTransitions = function(obj, props, delay, style, callbackFunction)
{
	$.each(props, function(k, prop)
	{
		$.setTransition(obj, prop, delay, style);
	});

	if(typeof(callbackFunction) == "function")
	{
		callbackFunction(obj);
	}
}

$.resetTransitions = function(obj)
{
	$.setTransition(obj, 'reset');

	if(typeof(callbackFunction) == "function")
	{
		callbackFunction(obj);
	}
}

/**
 * [setTransition description]
 * @param {[type]} obj              [description]
 * @param {[type]} prop             [description]
 * @param {[type]} delay            [description]
 * @param {[type]} style            [description]
 * @param {[type]} callbackFunction [description]
 */
$.setTransition = function(obj, prop, delay, style, callbackFunction)
{
	if(prop == 'reset')
	{
		$(obj).css('-webkit-transition', '');
		$(obj).css('-moz-transition', '');
		$(obj).css('-o-transition', '');
		$(obj).css('transition', '');
	}
	else
	{
		$(obj).css({'-webkit-transition': prop + ' ' + delay + ' ' + style + ''});
		$(obj).css({'-moz-transition': prop + ' ' + delay + ' ' + style + ''});
		$(obj).css({'-o-transition': prop + ' ' + delay + ' ' + style + ''});
		$(obj).css({'transition': prop + ' ' + delay + ' ' + style + ''});
	}

	if(typeof(callbackFunction) == "function")
	{
		callbackFunction(obj);
	}
};

// http://stackoverflow.com/questions/2419749/get-selected-elements-outer-html
(function($)
{
	$.fn.outerHTML = function()
	{
		return $(this).clone().wrap('<div></div>').parent().html();
	};
})(jQuery);

/**
 * [browser description]
 * @type {Object}
 */
$.browser = {};
(function ()
{
	$.browser.msie = false;
	$.browser.version = 0;
	if (navigator.userAgent.match(/MSIE ([0-9]+)\./))
	{
		$.browser.msie = true;
		$.browser.version = RegExp.$1;
	}
})();

// http://charleskonsor.com/blogs/jQuery%3A-Getting-an-elements-position-offset-relative-to-a-parent-element/34.html
// offsetRelative (or, if you prefer, positionRelative)
(function($)
{
	$.fn.offsetRelative = function(top)
	{
		var $this = $(this);
		var $parent = $this.offsetParent();
		var offset = $this.position();
		if(!top) return offset; // Didn't pass a 'top' element
		else if($parent.get(0).tagName == "BODY") return offset; // Reached top of document
		else if($(top,$parent).length) return offset; // Parent element contains the 'top' element we want the offset to be relative to
		else if($parent[0] == $(top)[0]) return offset; // Reached the 'top' element we want the offset to be relative to
		else
		{ // Get parent's relative offset
			var parent_offset = $parent.offsetRelative(top);
			offset.top += parent_offset.top;
			offset.left += parent_offset.left;
			return offset;
		}
    };

    $.fn.positionRelative = function(top)
    {
        return $(this).offsetRelative(top);
    };

}(jQuery));

/**
 * [description]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function($)
{
	$.fn.myHide = function(cssClass)
	{
		if(!isset(cssClass)) cssClass = 'hidden';

		$(this).hide();
		$(this).addClass(cssClass);
		$(this).attr('data-visible', 'false');
	}
}(jQuery));

/**
 * [description]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function($)
{
	$.fn.myShow = function(cssClass)
	{
		if(!isset(cssClass)) cssClass = 'hidden';

		$(this).removeClass(cssClass);
		$(this).removeAttr('data-visible');
		$(this).show();
	}
}(jQuery));

/**
 * [description]
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
(function($)
{
	$.fn.myIsVisible = function(cssClass)
	{
		if(!isset(cssClass)) cssClass = 'hidden';

		return (!$(this).hasClass('hidden') && ($(this).attr('data-visible') != 'no'));
	}
}(jQuery));

var _fontAwesomeVersion = 0;

/**
 * { function_description }
 *
 * @param      {string}  action  The action
 */
$.fn.button = function(action)
{
	if (this.length > 0)
	{
		if(_fontAwesomeVersion == 0)
		{
			if(typeof(FontAwesome) != 'undefined')
			{
  				_fontAwesomeVersion = 5;
			}
			else 
			{
				var span = document.createElement('span');
	  			span.className = 'fa';
	  			span.style.display = 'none';
	  			document.body.insertBefore(span, document.body.firstChild);
	  			if(window.getComputedStyle(span, null).getPropertyValue('font-family') == 'FontAwesome')
	  			{
	  				_fontAwesomeVersion = 4;
	  			}
  			}

  			if(_fontAwesomeVersion === 0)
  			{
	  			_fontAwesomeVersion = -1; 
  			}
  		}

		this.each(function()
		{
			if ((action === 'loading') || (action === 'load'))
			{
				if($(this).attr('buttonLoading') != 'true')
				{
					$(this).attr('buttonLoading', 'true');	

					if(typeof($(this).data('loading-text')) == 'undefined')
					{
						$(this).data('loading-text', 'Laden...');
					}

					var iconClass = '';
					switch(_fontAwesomeVersion)
					{
						case 4:
							// Class font fontAwesome v4
							//
							iconClass = 'fa fa-circle-o-notch fa-spin';
							break;

						case 5:
							// Class font fontAwesome v5
							//
							iconClass = 'fas fa-circle-notch fa-spin';
							break;
					}

					if($(this).data('loading-text') != '')
					{
						$(this).data('original-text', $(this).html()).html(((iconClass != '')?'<i class="'+iconClass+'"></i>&nbsp;':'')+'<span>' + $(this).data('loading-text') + '</span>').prop('disabled', true);
					}
					else
					{
						$(this).data('original-text', $(this).html()).html(((iconClass != '')?'<i class="'+iconClass+'"></i>':'')).prop('disabled', true);
					}
					
					$(this).css({'cursor': 'wait'});
				}
			}
			else if (((action === 'reset') || (action === 'done')) && typeof($(this).data('original-text') != 'undefined'))
			{
				if($(this).attr('buttonLoading') == 'true')
				{
					$(this).html($(this).data('original-text')).prop('disabled', false);

					$(this).css({'cursor': 'default'});
					$(this).removeAttr('buttonLoading');
				}
			}
		});
	}
};