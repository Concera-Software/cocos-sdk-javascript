/***
 *       ___      ___     ___     _   ___ ___ 
 *      / __|___ / __|___/ __|   /_\ | _ \_ _|
 *     | (__/ _ \ (__/ _ \__ \  / _ \|  _/| | 
 *      \___\___/\___\___/___/ /_/ \_\_| |___|
 *                                            
 *                                      Grown by (concera
 *                                      
 * -----------------------------------------------------------------------------
 * Version  :   1.18.099            
 * Copyright    :   Concera Software (C) 2018 - https://concera.software
 * -----------------------------------------------------------------------------
 * 
 * This file is build on top of the CoCoS API, grown by (concera. A restFULL
 * API, which acts as an service to provide data and communication between
 * (web-)interfaces and physical devices using only web-techniques.
 */

 /**
 * [calcScaleFactor description]
 * @return {float} [description]
 */
function calcScaleFactor()
{
      // Get sizes from original design
    //
    var designedWidth = getConfigVar("designedLayoutWidth"); // 1280;
    var designedHeight = getConfigVar("designedLayoutHeight"); // 1024;

    // Get sizes based on the current view of the application.
    //
    var applicationWidth = getApplicationWidth();
    var applicationHeight = getApplicationHeight();

    // Calculate the factor for width and height, based on the sizes from
    // width and height
    //
    var widthFactor = (applicationWidth/designedWidth);
    var heightFactor = (applicationHeight/designedHeight);

    // Get the lowest factor to use for scaling all the elements.
    //
    var calcFactor = Math.min(widthFactor, heightFactor);

    return calcFactor;
}

/**
 * Gets the application width.
 *
 * @return     {<type>}  The application width.
 */
function getApplicationWidth()
{
    return parseInt(Math.round($("div.canvasHolder").innerWidth()));
}

/**
 * [getApplicationHeight description]
 * @return {int} [description]
 */
function getApplicationHeight()
{
    return parseInt(Math.round($("div.canvasHolder").innerHeight()));
}

/**
 * Function to check if a given value is set, not undefined, not null.
 *
 * @param  {mixed} val The value to check
 * @return {bool}      The outcome of the check, true for set, false if not.
 */
function isset(val)
{
    try
    {
        return ((typeof(val) !== "undefined") && (typeof(val) != null) && (val !== null));
    }
    catch (err)
    {
        return false;
    }
};

/**
 * Removes url hashes.
 */
function removeUrlHashes()
{
    var uri = window.location.toString();
    if (uri.indexOf("#") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("#"));
        window.history.replaceState({}, document.title, clean_uri);
    }
}

/**
 * Function to check if a given value is empty or not...
 *
 * @param  {mixed} val The value to check
 * @return {bool}      The outcome of the check, true for empty, false if not.
 */
function isEmpty(val)
{
    // Return true when value is not set (null / undefined / etc.);
    if(!isset(val))
    {
        return true;
    }

    // Return true when value is an empty string
    if(isString(val) && (trim(val) === ''))
    {
        return true;
    }

    
    // Return true when value is an empty object
    // if(isObject(val) && (!isset(val.length) || (val.length == 0))) <-- OLD METHOD: Changed on 2017-10-12
    if(isObject(val) && ((isset(val.length) && (val.length === 0) || (Object.keys(val).length) === 0)))
    {
        return true;
    }

    return (!isset(val) || (val === ''));
};

function empty(val){ return isEmpty(val) };

/**
 * Function to check if a given value is NULL or not...
 *
 * @param  {mixed} val The value to check
 * @return {bool}      The outcome of the check, true for null, false if not.
 */
function isNull(val)
{
    return (!isset(val) && (val === null));
};

/**
 * Function to check if a given value is TRUE of not...
 *
 * @param  {bool} bool The boolean to check
 * @return {bool}      The outcome of the check, true for true, false if not.
 */
function isTrue(bool)
{
    return (isset(bool) && ((bool === true) || (bool === 'true') || (bool === 1) || (bool === '1')))
};

/**
 * Function to check if a given value is FALSE or not...
 *
 * @param  {bool} bool The boolean to check
 * @return {bool}      The outcome of the check, true for true, false if not.
 */
function isFalse(bool)
{
    return (isset(bool) && (isNull(bool) || (bool === false) || (bool === 'false') || (bool === '') || (bool === 0) || (bool === '0')))
};

/**
 * Function to check if a given value is a function or not...
 *
 * @param  {function} func The function to check
 * @return {bool}     The outcome of the check, true for function, false if not.
 */
function isFunction(func)
{
    return (isset(func) && (typeof(func) == 'function'));
}

/**
 * Function to check if a given value is a string or not...
 *
 * @param  {string}  string The string to check
 * @return {bool}           The outcome of the check, true for object, false if not.
 */
function isString(string)
{
    return (isset(string) && (typeof(string) == 'string'));
}

/**
 * Function to check if a given value is a object or not...
 *
 * @param  {object}  obj The object to check
 * @return {bool}        The outcome of the check, true for object, false if not.
 */
function isObject(obj)
{
    return (isset(obj) && (typeof(obj) == "object"));
}

// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
function isNumeric(n)
{
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * [getRequestParameter description]
 * @method    getRequestParameter
 * @date      2017-07-25
 * @author    S.vanBuren
 * @copyright (concera
 * @source    https://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
 * @param     {[type]}            name [description]
 * @param     {[type]}            url  [description]
 * @return    {[type]}                 [description]
 */
function getRequestParameter(name, url)
{
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}

/**
 * [trim description]
 * @method    trim
 * @date      2017-07-25
 * @author    S.vanBuren
 * @copyright (concera
 * @param     {[type]}   input    [description]
 * @param     {[type]}   charlist [description]
 * @return    {[type]}            [description]
 */
function trim(input, charlist)
{
    var whitespace = [' ', '\n', '\r', '\t', '\f', '\x0b', '\xa0', '\u2000', '\u2001', '\u2002', '\u2003', '\u2004', '\u2005', '\u2006', '\u2007', '\u2008', '\u2009', '\u200a', '\u200b', '\u2028', '\u2029', '\u3000'].join('');
    var l = 0
    var i = 0
    input += ''
    if (charlist)
    {
        whitespace = (charlist + '').replace(/([[\]().?/*{}+$^:])/g, '$1')
    }
    l = input.length
    for (i = 0; i < l; i++)
    {
        if (whitespace.indexOf(input.charAt(i)) === -1)
        {
            input = input.substring(i)
            break
        }
    }
    l = input.length
    for (i = l - 1; i >= 0; i--)
    {
        if (whitespace.indexOf(input.charAt(i)) === -1)
        {
            input = input.substring(0, i + 1)
            break
        }
    }
    return whitespace.indexOf(input.charAt(0)) === -1 ? input : ''
}

/**
 * [restoreCoCoSApiID description]
 * @param  {[type]} encodedId [description]
 * @return {[type]}           [description]
 */
function restoreCoCoSApiID(encodedId)
{
    if(!isEmpty(encodedId))
    {
        if(isNaN(encodedId) && isString(encodedId))
        {
            var encodedIdLength = encodedId.length;
            var restoredIdLength = parseInt(encodedId.substr(0, 2));

            if(isNumeric(restoredIdLength) && (parseInt(restoredIdLength) > 0))
            {
                restoredIdLength = parseInt(restoredIdLength);
                var restoredId = encodedId.substring((encodedIdLength-restoredIdLength), encodedIdLength);

                if(isNumeric(restoredId))
                {
                    return parseInt(restoredId);
                }
            }
        }
    }

    return encodedId;
}

/**
 * [myClearTimeout description]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
function myClearTimeout(obj)
{
    mySetTimeout(obj);
}

/**
 * [mySetTimeout description]
 * @param  {[type]} obj              [description]
 * @param  {[type]} callbackFunction [description]
 * @param  {[type]} timeout          [description]
 * @return {[type]}                  [description]
 */
function mySetTimeout(obj, callbackFunction, timeout)
{
    if(!isNull(obj))
    {
        clearTimeout(obj);
    }

    if(isset(callbackFunction) && isFunction(callbackFunction))
    {
        if(parseInt(timeout) > 0)
        {
            //
            obj = setTimeout
            (
                function()
                {
                    callbackFunction();
                },
                timeout
            );

            return obj;
        }
        else
        {
            callbackFunction();
        }
    }

    return null;
}



/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 =
{
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input)
    {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length)
        {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2))
            {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3))
            {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }

        return output;
    },

    // public method for decoding
    decode : function (input)
    {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length)
        {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64)
            {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64)
            {
                output = output + String.fromCharCode(chr3);
            }

        }

            output = Base64._utf8_decode(output);

            return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string)
    {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

            for (var n = 0; n < string.length; n++)
        {
            var c = string.charCodeAt(n);

            if (c < 128)
            {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048))
            {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else
            {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext)
    {
        var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while ( i < utftext.length )
        {
            c = utftext.charCodeAt(i);

            if (c < 128)
            {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224))
            {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else
            {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }

        return string;
    }
}

if ((typeof(btoa) === "undefined") && (typeof(atob) === "undefined"))
{
        _keyStr = Base64._keyStr;
        btoa = Base64.encode;
        atob = Base64.decode;
}

/**
 * { function_description }
 *
 * @param      {<type>}  input   The input
 * @return     {<type>}  { description_of_the_return_value }
 */
function base64_encode(input)
{
    return Base64.encode(input);
}

/**
 * { function_description }
 *
 * @param      {<type>}  input   The input
 * @return     {<type>}  { description_of_the_return_value }
 */
function base64_decode(input)
{
    return Base64.decode(input);
}





/**
 * [convertToLocalTime description]
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function convertToLocalTime(value, dataOrFormat, metaOrformat, format)
{
    var data = {};
    var meta = {};

    if(isString(dataOrFormat))
    {
        format = dataOrFormat;
    }
    else
    {
        data = dataOrFormat;
        if(isString(metaOrformat))
        {
            format = metaOrformat;
        }
        else
        {
            meta = metaOrformat;
            if(isString(format))
            {
                format = format;
            }
        }
    }

    if((value.indexOf('-') > -1) || (value.indexOf(':') > -1))
    {
        // Create local time from GMT/UTC time, input value should be the format
        // YYYY-MM-DD HH:ii:ss, for example 2016-01-02 03:34:45 which will be
        // converted into 2016-01-02T03:34:45.000Z
        //
        var date = new Date(value.replace(/ /g,'T') + '.000Z');
    }
    else
    {
        var date = new Date(value*1000);
    }

    if(!isNaN(date.valueOf()) && (date.valueOf() > 0))
    {
        if(!isset(format) || isEmpty(format))
        {
            format = 'Y-m-d H:i:s';
        }

        format = format.replace(/Y/g, pad(date.getFullYear(), 4));
        format = format.replace(/m/g, pad((date.getMonth()+1), 2));
        format = format.replace(/d/g, pad(date.getDate(), 2));

        format = format.replace(/H/g, pad(date.getHours(), 2));
        format = format.replace(/i/g, pad(date.getMinutes(), 2));
        format = format.replace(/s/g, pad(date.getSeconds(), 2));

        format = format.replace(/u|v/g, pad(date.getMilliseconds(), 4));

        // After creating a date-time object using javascript default functions,
        // return the new date in local time using the same format as requested,
        // so YY-MM-DD HH:ii:ss. When the local time is in a +02:00 timezone,
        // this function will return 2016-01-02 05:34:45 (2 hours later compared
        // to the original value)
        //
        /* return pad(date.getFullYear(), 4) + "-" +
            pad((date.getMonth()+1), 2) + "-" +
            pad(date.getDate(), 2) + " " +
            pad(date.getHours(), 2) + ":" +
            pad(date.getMinutes(), 2) + ":" +
            pad(date.getSeconds(), 2);
        */
    
        return format;
    }


    return '-';
}