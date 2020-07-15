/***
 *     ___      ___     ___ 
 *    / __|___ / __|___/ __|
 *   | (__/ _ \ (__/ _ \__ \
 *    \___\___/\___\___/___/, grown by (concera
 * 
 * -------------------------------------------------------------------------------------------------
 * @author(s)		Stefan van Buren
 * @copyright 		Concera Software - https://concera.software
 * @dateCreated		2016-??-??
 * @lastChange		2020-07-15
 * @version		1.20.196
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
 *  2020-07-15		1.20.196	SvB
 *  	[Fixed] Fixed a bug in the _getPayload, _getPayloadMeta, _getPayloadData. When a key is
 *  	requested, but not found in the payload, payloadMeta, payloadData, an empty value will be
 *  	returned, instead of the full object.
 *
 *  2020-07-10		1.20.191	SvB
 *  	[Fixed] Fixed a small bug in the handleLoginWithToken-function. Instead of returning the
 *  	error in the first parameter of the callback-function, the response was being returned.
 *
 *  2020-05-27		1.20.147	SvB
 *  	[Fixed] Fixed a small issue in the continuousRead-method. When the boolean-parameter
 *  	executeCallbackSuccessOnEmptyResponse is set to true, the meta-element won't be checked,
 *  	but the callbackSuccess will always be called.
 *
 *  2020-05-15		1.20.135	SvB
 *  	[Fixed] When executing a read onto the CoCoS API, in order to download the output, the
 *	xhr.responseType will be set to blob in order to handle every kind of output, not just only
 *	plain text.
 *
 *  2020-05-06		1.20.126	SvB
 *  	[Fixed] Calling a successFunction/errorFunction from a continuousRead will not take place
 *  	asynchronously (using setTimeout), so an error in the callbackFunction won't have any
 *  	effect on the continuing of the read.
 *
 *  2020-05-04		1.20.124	SvB
 *  	[Added] Added method getVersion for getting information about the version of the JS-SDK.
 *  	[Added] Added durations to the _logToConsole()-method.
 *  	[Added] Added variable _activeSessionHash. Based on the hash in the JWT-payload, the
 *  	hash of the session will be checked. When the session changed, this will be reported using
 *  	the method _logToConsole.
 *  	[Deprecated] Removed handling for cocosDeployOnAuthorize-variable. Executing deploys only
 *  	allowed at the server, not by doing web-requests.
 *  	[Fixed] Created separate function _createHandlerId() for creating unique id's, instead of
 *  	using the _createRequestId()-function. So requestId's will always be sequentially.
 *
 *  2020-04-29		1.20.119	SvB
 *  	[Changed] Changed licenseCheck in function checkStatusResponse.
 *	[Added] Added setReadyState and getReadyState for requestHandler-objects.
 *
 *  2020-04-28		1.20.118	SvB
 *  	[Changed] Changed handling of continuousRead in case of errors. When a small pollingCycle is
 *  	given, the next retry must always be at least 5.000ms (5 seconds) instead of directly trying
 *  	it again and again and again etc.
 *
 *  2020-03-11		1.20.070	SvB
 *  	[Fixed] Solved a bug which caused a continuousRead to keep executing requests, after the
 *  	request was stopped/aborted manually.
 *
 *  2019-12-13		1.19.346	SvB
 *  	[Fixed] Solved a bug which cause the upload-function not to call the callbackComplete after
 *	the upload was done.
 *
 *  2019-09-12		1.19.254	SvB
 *  	[Added] Function advancedStatus added to the SDK in order to call the status-request with
 *  	options, for example, the fields parameter.
 *  		
 *  2019-09-04		1.19.246	SvB
 *  	[Changed] Changed handling for the JWT-payload. When no expirationTime set/given, the
 *	cookie won't be renewed and the logoutTimeout won't be set again, but will continue with
 *	it's current setting.
 *
 *  2019-08-28		1.19.239	SvB
 *  	[Added] Added the loginWithPincode and handleLoginWithPincode functions for login in with
 *	only a pincode (no username and password).
 *	[Fixed] Fixed a bug in keeping track of active requests which should be closed as soon as
 *	the session expires. For some reasons, endless requests kept going on and on and on, even
 *	after logging out.
 *
 *  2019-08-12		1.19.223	SvB
 *  	[Added] Added function _now for getting microtime/timestamp.
 *	[Added] Added functions for setting (setCallbackLoginExpiration) and handling expiration
 *	of the session/token. When a callbackFunction is set, as long as the session/token is valid
 *	and not expired, the callback function will be called and get the remaining seconds.
 *	[Changed] Updated the handleLogout-function in order to use the global checkAuthResponse-
 *	function to check if the action was successful.
 *	[Changed] When the handleLogout-function gets a 401-httpStatusCode, the logout will be
 *	handled as successful and the token and cookies will be reset.
 *
 *  2019-07-12		1.19.192	SvB
 *	The API SDK is extended with an object which will keep track of all active requests. When
 *	using the handleLogout-method during logout, all active requests in the object will be
 *	aborted before logging out. This is done to prevent any active/pending requests to return
 *	after the logout was completed, which would overwrite the accessToken with information
 *	about the logged out user and expired session.
 *  	
 *  2019-06-19		1.19.169	SvB
 *  	Added the chunkedUploader-object in order to upload large files over several posts to the
 *	CoCoS API, using idUpload to glue the file back together serverside, using the contentRange
 *	headers / parameters when uploading.
 *  	
 *  2019-06-13		1.19.163	SvB
 *  	Changed the _getAccessToken-function. When cookies are used, the accessToken from the
 *  	cookie always will be returned. Even when it's empty.
 *  	
 *  2019-01-22		1.19.021	SvB
 *  	Some minor fixes on the continuousRead-function, which will only use the timestamp of the
 * 	last response, once the response successfully returned once.
 *  	
 *  2019-01-22		1.19.021	SvB
 *  	Changed the download-method. Said goodbye to the File API, due to problems with browsers
 *  	from Microsoft (Internet Explorer and Edge).
 *  	
 *  2019-01-16		1.19.015	SvB
 *  	Added extra error-handlers for the isAvailable-function from the CoCoS API SDK.
 *  	Removed the SameSite=Strict property from the _setCookie-function, because this is should
 *  	be set by the server, not by the client.
 *  	
 *  2018-12-10		1.18.343	SvB
 *  	Changed the _setLoginExpireTimeout to prevent direct execution of the callback / timeout
 *  	on large durations.
 *  	
 *  2018-12-07		1.18.340	SvB
 *  	Minor changed in the continuousRead-function and added callbacks for abort() and stop()
 *  	
 *  2018-11-27		1.18.330	SvB
 *  	Changed download-function in order to download .lic-files (license files)
 *  	
 *  2018-10-17		1.18.289	SvB
 *  	Added functions setLanguage and setDataLanguage in order to set default languages for
 *    	connecting with and getting data from the CoCoS API.
 *  	
 *  2018-08-06		1.18.217	SvB
 *  	Changed the SDK so, despite of the debugMode being enabled or not, multi-request will always
 *  	be handed as request with headers and data in the body instead of (trying to) sending the
 *  	data and all options in the URL.
 *  
 *  2018-08-01		1.18.211	SvB
 *  	Changed the getFileUrl-function, which will now return a link to a storageRequest onto the
 *  	API instead of a link to the files-app. (which was located in /files/apps)
 *  	
 *   2018-07-05		1.18.185	SvB
 *  	Added the functions download() and _handleDownload(). Also made some changed to the function
 *  	_createCORSRequest which now can handle multiple receiveFormats.
 *  	
 *   2018-06-29		1.18.179	SvB
 *  	Added the PARAM_FLUSH-variable and flush() function.
 *
 * -----------------------------------------------------------------------------------------
 *
 * # FILEDESCRIPTION:
 * 
 * This javascript-library can be used as SDK (Software Development Kit) to use when developing an
 * application which needs to communicate with the CoCoS API.
 *
 * The CoCoS API will act as an interface between the CoCoS Database and your application. Data can
 * be fetched from and send to the API using web-requests. To make an request, an apiKey is required
 * to identify the application to the API. Based on this key, permissions will be granted.
 *
 * Additionally, when user-permissions are needed to send and/or receive data, an accessToken will
 * be needed
 * 
 */

/**
 *
 * @constructor
 * @param       {String} host   The host to use to connect to the CoCoS API.
 * @param       {String} path   The path to use to locate the CoCoS API on the
 *                              given host.
 * @param       {String} apiKey The apiKey to use to identify the application
 *                              and get access to the CoCoS API.
 * @return      {Void}
 */
var cocosAPI = function(host, path, apiKey, freshStart)
{
	var JS_SDK_VERSION = '1.20.196';

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   _
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) / |
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  | |
	 *     |___/___\___| |_| |___\___/|_|\_| (_) |_|
	 * ---------------------------------------------------------------------
	 * SECTION 1: Constants
	 * ---------------------------------------------------------------------
	 *
	 * This section can be seen as the 'configuration' of the connector. The
	 * actual configuration of the connector will take place by including it
	 * and configure it. But to prevent the full code needs to be searched
	 * when some modifications must be made, everything can be changed here
	 * by adjusting the values of the constants below.
	 *
	 * This includes the formats which will be allowed to be used to send
	 * and receive data, but also, some names of parameters and/or headers
	 * which will be used to build a request to the CoCoS API.
	 *
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Array holding all the protocols that can be used to call the CoCoS
	 * API.
	 *
	 * @constant
	 * @type     {Array}
	 * @default  ['http', 'https']
	 */
	var ALLOWED_PROTOCOLS = ['http:', 'https:'];

	/**
	 * Array holding all formats that can be used to send data to the CoCoS
	 * API. For example: json.
	 *
	 * @constant
	 * @type     {Array}
	 * @default  ['json']
	 */
	var ALLOWED_SEND_FORMATS = ['json'];

	/**
	 * Array holding all formats that can be used to recieve data from the
	 * CoCoS API. For example: json.
	 *
	 * @constant
	 * @type     {Array}
	 * @default  ['json']
	 */
	var ALLOWED_RECEIVE_FORMATS = ['json','xml','yaml','yml','csv'];

	/**
	 * Name of the header-key to use to send the apiKey to the CoCoS API.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'X-Api-Key'
	 */
	var HEADER_APIKEY = 'X-Api-Key';

	/**
	 * Name of the parameter to use to send the apiKey to the CoCoS API.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'apiKey'
	 */
	var PARAM_APIKEY = 'apiKey';

	/**
	 * Name of the header-key to use to send the JWT-token to the CoCoS API.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'X-Access-Token'
	 */
	var HEADER_ACCESS_TOKEN = 'X-Access-Token';

	/**
	 * Name of the parameter to use to send the JWT-token to the CoCoS API.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'accessToken'
	 */
	var PARAM_ACCESS_TOKEN = 'accessToken';

	var HEADER_DEVICE_KEY = 'X-Device-Key';

	var PARAM_DEVICE_KEY = 'deviceKey';

 	/**
 	 * Name of the parameter to use in the URL when an endless-call will be made.
	 *
	 * @constant
 	 * @type     {String}
	 * @default  'waitforresults'
 	 */
	var PARAM_WAITFORRESULTS = 'waitForResults';

	/**
 	 * Name of the parameter to use in the URL when a call will be made, of which the session
	 * doesn't need to be extended/renewed.
	 *
	 * @constant
 	 * @type     {String}
	 * @default  'extendSession'
 	 */
	var PARAM_EXTENDSESSION = 'extendSession';

 	/**
 	 * Name of the parameter to use in the URL to specify which content-type to use.
	 *
	 * @constant
 	 * @type     {String}
	 * @default  'contentType'
 	 */
	var PARAM_CONTENT_TYPE = 'contentType';

	/**
	 * Name of the parameter to use in the URL to send the HTTP method to the CoCoS API instead
	 * of using the METHOD in the request.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'method'
	 */
	var PARAM_METHOD = 'method';

	/**
	 * Name of the parameter to use in the URL to send the requested format of the data to
	 * receive from the CoCoS API.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'format'
	 */
	var PARAM_FORMAT = 'format';

	/**
	 * Name of the parameter to use in the URL to expand data.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'expand'
	 */
	var PARAM_EXPAND = 'expand';

	/**
	 * Name of the parameter to used in the URL to enable debug-mode in the CoCoS API.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'debug'
	 */
	var PARAM_DEBUG = 'debug';

	/**
	 * Name of the parameter to used in the URL to execute a deploy on the database.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'deploy'
	 */
	var PARAM_DEPLOY = 'deploy';

	/**
	 * Name of the parameter to use in the URL to use (in combination with httpMethod DELETE) to
	 * execute a real remove. No way back
	 *
	 * @constant
	 * @type     {String}
	 * @default  'flush'
	 */
	var PARAM_FLUSH = 'flush';

	/**
	 * Name of the parameter to used in the URL to execute a download instead of receiving the
	 * response.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'download'
	 */
	var PARAM_DOWNLOAD = 'download';

	/**
	 * Name of the parameter to use in the URL to use to tell the API in what language it must
	 * response, for example names of libraries, collections, fieldCaption, descriptions, info-
	 * messages etc.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'language'
	 */
	var PARAM_LANGUAGE = 'language';

	/**
	 * Name of the parameter to use in the URL to use to tell the API in what language the data
	 * must be returned.
	 *
	 * @constant
	 * @type     {String}
	 * @default  'dataLanguage'
	 */
	var PARAM_DATALANGUAGE = 'dataLanguage';

	/**
	 * Name of the parameter to use in the URL to use to tell the API to send extra information
	 * about the library, collection and fields in the meta-object of the response.
	 * 
	 *
	 * @constant
	 * @type     {String}
	 * @default  'metaFields'
	 */
	var PARAM_METAFIELDS = 'metaFields';

	/**
	 * Path to use when going to search for data. The complete path / URL will be build, based
	 * on the library, collection, identifier and/or association, followed by the URL-part below
	 * in case of search-action.
	 *
	 * @constant
	 * @type     {String}
	 * @default  '/search'
	 */
	var PATH_SEARCH = '/search';

	/**
	 * Path to storage.
	 *
	 * @constant
	 * @type     {String}
	 * @default  '/storage'
	 */
	var PATH_STORAGE = '/storage';

	/**
	 * Path to use when going to count data. The complete path / URL will be build, based on the
	 * library, collection, identifier and/or association, followed by the URL-part below in
	 * case of search-action.
	 *
	 * @constant
	 * @type     {String}
	 * @default  '/count'
	 */
	var PATH_COUNT = '/count';

	/**
	 * The path to POST to when login onto the CoCoS API.
	 *
	 * @constant
	 * @type     {String}
	 * @default  '/auth/login'
	 */
	var PATH_LOGIN = '/auth/login';

	/**
	 * The path to POST to when logout from the CoCoS API.
	 *
	 * @constant
	 * @type     {String}
	 * @default  '/auth/logout'
	 */
	var PATH_LOGOUT = '/auth/logout';

	/**
	 * The path to use to get information about the current user. If nobody is logged in, then
	 * userId -1 will be returned.
	 *
	 * @constant
	 * @type     {String}
	 * @default  '/auth/me'
	 */
	var PATH_AUTH = '/auth/me';

	/**
	 * The path to used to get te status of the API, so is't availability
	 * can be checked.
	 *
	 * @constant
	 * @type     {String}
	 * @default  '/auth/status'
	 */
	var PATH_STATUS = '/status';

	/**
	 * URL-part to use when a discover is called. The complete path / URL
	 * will be build, based on the library and/or collection, followed by
	 * the URL-part below.
	 *
	 * @constant
	 * @type     {String}
	 * @default  '/discover'
	 */
	var PATH_DISCOVER = '/discover';

	/**
	 * URL-part to use when a upload is called. The complete path / URL
	 * will be build, based on the library and/or collection, followed by
	 * the URL-part below.
	 *
	 * @constant
	 * @type     {String}
	 * @default  '/media/uploads'
	 */
	var PATH_UPLOAD = '/upload';

	/**
	 * URL-part to use when a upload is called. The complete path / URL
	 * will be build, based on the library and/or collection, followed by
	 * the URL-part below.
	 *
	 * @constant
	 * @type     {String}
	 * @default  '/media/uploads'
	 */
	var PATH_SAVE_UPLOAD = '/media/uploads';
	
	var COOKIE_NAME_TOKEN = 'token';
	var COOKIE_NAME_COOKIES = 'cookies';
	var COOKIE_NAME_CROSS_DOMAIN_COOKIES = 'crossdomaincookies';

	var COCOS_API_ACTION_LOGIN = 'login';
	var COCOS_API_ACTION_AUTHENTICATE = 'authenticate';
	var COCOS_API_ACTION_STATUS = 'status';
	var COCOS_API_ACTION_LOGOUT = 'logout';

	var REQUEST_OBJECT_XMLHTTP = 'XMLHTTPRequest';
	var REQUEST_OBJECT_XMLHTTP2 = 'XMLHttpRequest2';
	var REQUEST_OBJECT_XDOMAIN = 'XDomainRequest';

	var READY_STATE_UNSENT = 0;
	var READY_STATE_OPENED = 1;
	var READY_STATE_HEADERS_RECEIVED = 2;
	var READY_STATE_LOADING = 3;
	var READY_STATE_DONE = 4;

	var REQUEST_TYPE_UPLOAD = 'upload';
	var REQUEST_TYPE_ENDLESS = 'endless';

	var HTTP_METHOD_POST = 'POST';
	var HTTP_METHOD_GET = 'GET';
	var HTTP_METHOD_PUT = 'PUT';
	var HTTP_METHOD_PATCH = 'PATCH';
	var HTTP_METHOD_DELETE = 'DELETE';

	var HTTP_METHODS = [HTTP_METHOD_POST, HTTP_METHOD_GET, HTTP_METHOD_PUT, HTTP_METHOD_PATCH, HTTP_METHOD_DELETE];

	var HTTP_STATUS_CODE_NONE = 0;
	var HTTP_STATUS_CODE_OK = 200;
	var HTTP_STATUS_CODE_MULTISTATUS = 207;
	var HTTP_STATUS_CODE_TEMPORARYREDIRECT = 307;
	var HTTP_STATUS_CODE_PERMANENTREDIRECT = 308;
	var HTTP_STATUS_CODE_BADREQUEST = 400;
	var HTTP_STATUS_CODE_UNAUTHORIZED = 401;
	var HTTP_STATUS_CODE_PAYMENTREQUIRED = 402;
	var HTTP_STATUS_CODE_FORBIDDEN = 403;
	var HTTP_STATUS_CODE_NOTFOUND = 404;
	var HTTP_STATUS_CODE_METHODNOTALLOWED = 405;
	var HTTP_STATUS_CODE_REQUESTTIMEOUT = 408;
	var HTTP_STATUS_CODE_CONFLICT = 409;
	var HTTP_STATUS_CODE_UNPROCESSABLEENTITY = 422;
	var HTTP_STATUS_CODE_INTERNALSERVERERROR = 500;

	var DATA_KEY_UPLOAD_FILE = 'uploadFile';
	var DATA_KEY_UPLOAD_CHECKSUM = 'fileChecksum';
	var DATA_KEY_UPLOAD_FILENAME = 'fileName';
	var DATA_KEY_UPLOAD_FILEHASH = 'fileHash';

	this.getVersion = function()
	{
		return JS_SDK_VERSION;
	};

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   ___
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) |_  )
	 *     \__ \ _| (__  | |  | | (_) | .` |  _   / /
	 *     |___/___\___| |_| |___\___/|_|\_| (_) /___|
	 * ---------------------------------------------------------------------
	 * SECTION 2: Functions
	 * ---------------------------------------------------------------------
	 *
	 * This section contains some global functions, which will be used in
	 * the connector.
	 *
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Function to determine if a variable or object has contents.
	 *
	 * @method cocosAPI._isset
	 * @access private
	 * @param  {String|Array|Object}  value  The value to check, can be a
	 *                                       string or object.
	 * @return {Boolean}
	 */
	var _isset = function(value, allowEmptyString)
	{
		if((typeof(value) == 'undefined') || (typeof(value) == 'unknown'))
		{
			return false;
		}

		if((value === undefined)  || (value === null) || (!_isTrue(allowEmptyString) && (value === '')))
		{
			return false;
		}

		/*
		var i, max_i;
		for (i = 1, max_i = arguments.length; i < max_i; i++)
		{
			if (value[arguments[i]] === undefined)
			{
				return false;
			}

			value = value[arguments[i]];
		}
		*/

		return true;
	};

	/**
	 * Function to check if a given value is NULL or not...
	 *
	 * @param  {mixed} val The value to check
	 * @return {bool}      The outcome of the check, true for null, false if not.
	 */
	var _isNull = function(val)
	{
		return (!_isset(val) && (val === null));
	};

	/**
	 * Function to determine if the given parameter is a function or not.
	 *
	 * @method cocosAPI._isFunction
	 * @access private
	 * @param  {String|Array|Object}  func   The value to check
	 * @return {Boolean}
	 */
	var _isFunction = function(func)
	{
		return (_isset(func) && (typeof(func) == 'function'));
	}

	/**
	 * Function to determine if the given parameter is an object or not.
	 *
	 * @method cocosAPI._isObject
	 * @access private
	 * @param  {String|Array|Object}  obj   The value to check
	 * @return {Boolean}
	 */
	var _isObject = function(obj)
	{
		return (_isset(obj) && (typeof(obj) == 'object'));
	}

	/**
	 * Function to determine if the given parameter is an array or not.
	 *
	 * @method cocosAPI._isArray
	 * @access private
	 * @param  {Array}  array   The value to check
	 * @return {Boolean}
	 */
	var _isArray = function(array)
	{
		return (_isset(array) && (array.constructor === Array));
	}

	/**
	 * Function to determine if the given value is a string of not.
	 *
	 * @method cocosAPI._isString
	 * @access private
	 * @param  {String}  bool   The string to check
	 * @return {Boolean}
	 */
	var _isString = function(string)
	{
		return (_isset(string) && (typeof(string) == 'string'));
	}

	/**
	 * Determines whether the specified number is number.
	 *
	 * @param      {<type>}   number  The number
	 * @return     {boolean}  True if the specified number is number, False otherwise.
	 * @source     https://stackoverflow.com/questions/9716468/is-there-any-function-like-isnumeric-in-javascript-to-validate-numbers
	 */
	var _isNumber = function(number)
	{
  		return !isNaN(parseFloat(number)) && isFinite(number);
	}

	/**
	 * Function to determine if the given boolean is true or not.
	 *
	 * @method cocosAPI._isTrue
	 * @access private
	 * @param  {String|Array|Object}  bool   The boolean to check
	 * @return {Boolean}
	 */
	var _isTrue = function(bool)
	{
		return (_isset(bool) && ((bool === true) || (bool === 'true') || (bool === 'yes') || (bool === '1') || (bool === 1)));
	}

	/**
	 * Function to determine if the given boolean is false or not.
	 *
	 * @method cocosAPI._isFalse
	 * @access private
	 * @param  {String|Array|Object}  bool   The boolean to check
	 * @return {Boolean}
	 */
	var _isFalse = function(bool)
	{
		return (_isset(bool) && ((bool === false) || (bool === 'false') || (bool === 'no') || (bool === '0') || (bool === 0)));
	}

	/**
	 * Function to determine if the given boolean is false or not.
	 *
	 * @method cocosAPI._isEmpty
	 * @access private
	 * @param  {String|Array|Object}  bool   The boolean to check
	 * @return {Boolean}
	 */
	var _isEmpty = function(val)
	{
		// Return true when value is not set (null / undefined / etc.);
		if(!_isset(val))
		{
			return true;
		}

		// Return true when value is an empty string
		if(_isString(val))
		{
			if(val === '')
			{
				return true;
			}
		}
		
		// Return true when value is an empty object
		// if(_isObject(val) && (!_isset(val.length) || (val.length == 0))) <-- OLD METHOD: Changed on 2017-10-12
		if(_isObject(val))
		{
			if((_isset(val.length) && (val.length === 0) || (Object.keys(val).length) === 0))
			{
				return true;
			}
		}

		return (!_isset(val) || (val === ''));
	}

	/**
	 * This function can be used th check if a value exists inside an array.
	 * This function will no return it's position, only if it's in the array
	 * or not.
	 *
	 * @method cocosAPI._inArray
	 * @access private
	 * @param  {String}  needle    The string to search for
	 * @param  {String}  haystack  The array to search in
	 * @return {Boolean}
	 */
	var _inArray = function(needle, haystack)
	{
		var length = haystack.length;
		for(var i = 0; i < length; i++)
		{
			if(haystack[i] == needle) return true;
		}
		return false;
	}

	/**
	 * Function to determine if the given boolean is true or not.
	 *
	 * @method cocosAPI._isTrue
	 * @access private
	 * @param  {String|Array|Object}  bool   The boolean to check
	 * @return {Boolean}
	 */
	var _now = function(milliseconds)
	{
		if(_isTrue(milliseconds))
		{
			return new Date().getTime();
		}
		else
		{
			return Math.round(+new Date()/1000);
		}
	}

	/**
	 * Function to get the lenght of an Javasctipt-object (JSON-object).
	 *
	 * @method cocosAPI._objectLength
	 * @access private
	 * @param  {Object}  obj  The object which length needs to be checked.
	 * @return {Number}       The length of the object. When nothing is
	 *                        found, 0 will be returned.
	 */
	var _objectLength = function(obj)
	{
		var count = 0;
		var i;

		for(i in obj)
		{
			if(obj.hasOwnProperty(i))
			{
				count++;
			}
		}

		return count;
	};

	/**
	 * [_loopObject description]
	 * @param  {[type]}   object   [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	var _loopObject = function(object, callback)
	{
		if(_isObject(object) && (_objectLength(object) > 0))
		{
			for(var key in object)
			{
				if(object.hasOwnProperty(key))
				{
					if(_isFunction(callback))
					{
          					callback(key, object[key]);
          				}
          			}
          		}
		}
	}

	/**
	 * [_trim description]
	 * @param  {[type]} string [description]
	 * @return {[type]}        [description]
	 */
	var _trim = function(string, character)
	{
		if(_isString(string))
		{
			if(typeof(character) == 'undefined')
			{
				return string.trim();
			}
			else
			{
				character = character.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
				var regExp = new RegExp('^'+character+'+|'+character+'+$', 'g');
				return string.replace(regExp, '');
			}
		}

		//
		return string;
	}

	/**
	 * Function to append a URL-part (chunk) into an existing path.
	 *
	 * @example
	 * _appendToPath('/library/collection', 'search');
	 * _appendToPath('/library/collection/', '/search');
	 * _appendToPath('/library/collection', 'search/');
	 * // all will return '/library/collection/search/'

	 * @method cocosAPI._appendToPath
	 * @access private
	 * @param  {String}  path   The path the chunk must be appended to.
	 * @param  {String}  chunk  The URL-part that needs to be appended.
	 * @return {String}         New path, with given URL-part appended.
	 */
	var _appendToPath = function(path, chunk)
	{
		path = _trim(path);
		chunk = _trim(chunk);

		// When path doesn't start with a /, add it
		//
		if(path.substring(0, 1) != '/')
		{
			path = '/'+path;
		}

		// When path doesn't end with a /, add it
		//
		if(path.substring(path.length-1, path.length) != '/')
		{
			path = path + '/';
		}

		// Check if the given chunk is valid
		//
		if(_isset(chunk))
		{
			// Append the given chunk to the path
			//
			path += chunk;

			// When new path doesn't end with a /, add it
			//
			if(path.substring(path.length-1, 1) != '/')
			{
				path = path + '/';
			}

			// To prevent double slashed, strip them to single ones.
			//
			path = path.replace('//', '/');
		}

		// Return
		//
		return path;
	}

	/**
	 * This function can be used to append an paramater and its value to an
	 * URL. Based on the URL, it will be added with a ? of &, followed by
	 * the parameter and it's value.
	 *
	 * @example
	 * _appendToUrl('index.php', 'param1', 'value1');
	 * // returns index.php?param1=value1
	 *
	 * @example
	 * _appendToUrl('index.php?param1=value1', 'param2', 'value2');
	 * // returns index.php?param1=value1&param2=value2
	 *
	 * @method cocosAPI._appendToUrl
	 * @access private
	 * @param  {String}  url    The URL which need to be filled with an
	 *                          extra parameter and value.
	 * @param  {String}  param  The parameter to append to the URL.
	 * @param  {String}  value  The value of the parameter.
	 * @return {String}         The new URL, including the added parameter
	 *                          and value.
	 */
	var _appendToUrl = function(url, param, value)
	{
		if(_isObject(value))
		{
			var sendFullObject = false;

			_loopObject
			(
				value,
				function(k, subValue)
				{
					if(_isObject(subValue))
					{
						// subValue = JSON.stringify(subValue);
						// url += ((url.indexOf('?') == -1)?'?':'&')+param+'[]='+encodeURIComponent(subValue);
						sendFullObject = true;
					}
					else
					{
						url += ((url.indexOf('?') == -1)?'?':'&')+param+'['+k+']='+encodeURIComponent(subValue);
					}
				}
			);

			if(_isTrue(sendFullObject))
			{
				url += ((url.indexOf('?') == -1)?'?':'&')+param+'='+JSON.stringify(value);
			}
		}
		else
		{
			url += ((url.indexOf('?') == -1)?'?':'&')+param+'='+encodeURIComponent(value);
		}

		return url;
	};

	/**
	 * [_logToConsole description]
	 *
	 * @method cocosAPI._logToConsole
	 * @param  {String}  message    [description]
	 * @param  {String}  requestId  [description]
	 * @return {Void}               [description]
	 */
	var _logToConsole = function(message, requestId, duration)
	{
		_executeCallbackLogToConsole(message, requestId, duration);

		if(_useConsoleLog())
		{
			var d = new Date();
			console.log(d.toUTCString() + (_isset(requestId)?'- ' + requestId:'') + ' :: ' + message);
		}
	};

	/**
	 * [description]
	 * @method
	 * @author    Angel Marin, Paul Johnston.
	 * @source    http://www.webtoolkit.info/javascript_sha256.html#.WYhFN8dJack
	 * @copyright (concera
	 * @param     {[type]} string [description]
	 * @return    {[type]}        [description]
	 */
	var _executeEncode_utf8 = function(string)
	{
		string = string.replace(/\r\n/g,"\n");
		var utftext = '';

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
	}

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   ____
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) |__ /
	 *     \__ \ _| (__  | |  | | (_) | .` |  _   |_ \
	 *     |___/___\___| |_| |___\___/|_|\_| (_) |___/
	 * ---------------------------------------------------------------------
	 * SECTION 3: Variables
	 * ---------------------------------------------------------------------
	 *
	 * This section will contain functions (setters and getters), which can
	 * be used to set a variable, which will be 'public' functions, like:
	 * 	this.setVariable(var)
	 * and to get a varaiable, which will be 'private' functions, like:
	 * 	var _getVariable()
	 *
	 * Also this section will alse have functions (enablers and disabled) to
	 * use to enable & disabled a boolean, like:
	 * 	this.enableBoolean();
	 * and:
	 * 	this.disableBoolean();
	 *
	 * ---------------------------------------------------------------------
	 */

	/**
	 * Boolean used if the connector is initialized correct. When not not ok
	 * (bad protocal for example), nothing will happen when a function is§
	 * called.
	 *
	 * @var     cocosAPI._cocosOk
	 * @type    {Boolean}
	 * @default true
	 * @access  private
	 *
	 * @see {@link cocosAPI._notOk}
	 * @see {@link cocosAPI._isOk}
	 */
	var _cocosOk = true;

	/**
	 * The protocol to use connecting with the CoCoS API.
	 *
	 * @var     cocosAPI.cocosProtocol
	 * @type    {String}
	 * @default 'https'
	 * @access  private
	 *
	 * @see	    {@link cocosAPI.setProtocol}
	 * @see     {@link cocosAPI._getPrococol}
	 */
	var cocosProtocol = 'https:';

	/**
	 * The host to use when connection to the CoCoC API. This can be a
	 * domain-name or an IP-address.
	 *
	 * @var     cocosAPI.cocosHost
	 * @type    {String}
	 * @default ''
	 * @access  private
	 *
	 * @see	    {@link cocosAPI.setHost}
	 * @see     {@link cocosAPI._getHost}
	 */
	var cocosHost = '';

	/**
	 * The path to the API on the given host, this can contain information
	 * like the verion-number of the CoCoS API.
	 *
	 * @var     cocosAPI.cocosPath
	 * @type    {String}
	 * @default ''
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setPath}
	 * @see	    {@link cocosAPI._getPath}
	 */
	var cocosPath  = '';

	/**
	 * This is the API key to use for connecting with tot CoCoS API.
	 *
	 * @var     cocosAPI.cocosApiKey
	 * @type    {String}
	 * @default ''
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setApiKey}
	 * @see	    {@link cocosAPI._getApiKey}
	 */
	var cocosApiKey  = '';

	/**
	 * This variable will be used for saving the JWT-token from the CoCoS
	 * API, so it can be send with the request when calling the API again.
 	 *
 	 * @var     cocosAPI.cocosAccessToken
	 * @type    {String}
	 * @default ''
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setAccessToken}
	 * @see	    {@link cocosAPI._getAccessToken}
	 */
	var cocosAccessToken = '';


	/**
	 * This variable will be used for saving the deviceKey for the CoCoS
	 * API, so it can be send with the request when calling the API again.
 	 *
 	 * @var     cocosAPI.cocosDeviceKey
	 * @type    {String}
	 * @default ''
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setDeviceKey}
	 * @see	    {@link cocosAPI._getDeviceKey}
	 */
	var cocosDeviceKey = '';

	/**
	 * This variable will be used for saving the maximum time (in seconds) a
	 * request may take before an abort will be sent and an (timeout)error
	 * will be returned.
	 *
	 * @var     cocosAPI.cocosTimeout
	 * @type    {Number}
	 * @default 20
	 * @access  private
	 *
	 * @see	    {@link cocosAPI.setTimeout}
	 * @see     {@link cocosAPI._getTimeout}
	 */
	var cocosTimeout = 20;

	/**
	 * This variable will be used for saving the maximum time (in seconds) a
	 * pending request may take before an abort will be sent and an
	 * (timeout)error will be returned.
	 *
	 * @var     cocosAPI.cocosPendingTimeout
	 * @type    {Number}
	 * @default 60
	 * @access  private
	 *
	 * @see	    {@link cocosAPI.setPendingTimeout}
	 * @see     {@link cocosAPI._getPendingTimeout}
	 */
	var cocosPendingTimeout = 60;

	/**
	 * This variable will be used to hold the header-bool. When set to true,
	 * the headers of the request will be used to send data within the
	 * request, like the apiKey and token.
	 *
	 * @var     cocosAPI.useHeaders
	 * @type    {Boolean}
	 * @default true
	 * @access  private
	 *
	 * @see     {@link cocosAPI.enableRequestHeaders}
	 * @see     {@link cocosAPI.disableRequestHeaders}
	 * @see     {@link cocosAPI._useRequestHeaders}
	 */
	var cocosUseHeaders = true;

	/**
	 * This variable will be used to hold the debug-bool. When set to true,
	 * http methods (POST, GET, PUT, DELETE) will be used. When set to
	 * false, only GET-request will be executed. The method will be send
	 * using the parameter ?method=...
	 *
	 * @var     cocosAPI.cocosUseMethods
	 * @type    {Boolean}
	 * @default true
	 * @access  private
	 *
	 * @see	    {@link cocosAPI.enableHttpMethods}
	 * @see	    {@link cocosAPI.disableHttpMethods}
	 * @see	    {@link cocosAPI._useHttpMethods}
	 */
	var cocosUseMethods = true;

	/**
	 * This variable will be used to hold the cookie-bool. When set to true,
	 * cookies will be used to save the received JWT-token from a request
	 * into a cookie, so when the page reloads, the token will still be
	 * there. When set to false, the JWT-token will be saved into an local
	 * variable. When the page reloads, the variable is gone and (when
	 * logged in) the user will be logged out.
	 *
	 * @var     cocosAPI.cocosUseCookie
	 * @type    {Boolean}
	 * @default	true
	 * @access  private
	 *
	 * @see     {@link cocosAPI.enableSaveCookie}
	 * @see	    {@link cocosAPI.disableSaveCookie}
	 * @see	    {@link cocosAPI._useCookie}
	 */
	var cocosUseCookie = true;

	/**
	 * When cookies will be used, the cookie that will be set needs a name.
	 * The value in this variable will be used for the name of the cookie.
	 *
	 * @var     cocosAPI.cocosCookieName
	 * @type    {String}
	 * @default 'CoCos-Token'
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setCookieName}
	 * @see     {@link cocosAPI._getCookieName}
	 */
	var cocosCookieNames = {};
	cocosCookieNames[COOKIE_NAME_TOKEN] = 'AccessToken';
	cocosCookieNames[COOKIE_NAME_COOKIES] = 'CookiesAllowed';
	cocosCookieNames[COOKIE_NAME_CROSS_DOMAIN_COOKIES] = 'CrossDomainCookiesAllowed';
	
	var cocosCookiePrefix = 'CoCoS';

	/**
	 * When cookies will be used, the cookie that will be set needs a path.
	 * The value in this variable will be used for the path of the cookie.
	 *
	 * @var     cocosAPI.cocosCookiePath
	 * @type    {String}
	 * @default 'CoCos-Token'
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setCookiePath}
	 * @see     {@link cocosAPI._getCookiePath}
	 */
	var cocosCookiePath = '';

	/**
	 * The dataformat which will be used whikle sending data to the CoCoS
	 * API.
	 *
	 * @var     cocosAPI.cocosFormatSend
	 * @type    {String}
	 * @default 'json'
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setFormatSend}
	 * @see     {@link cocosAPI._getFormatSend}
	 */
	var cocosFormatSend = 'json';

	/**
	 * The dataformat which will be used to receive data from the CoCoS API.
	 *
	 * @var     cocosAPI.cocosFormatReceive
	 * @type    {String}
	 * @default 'json'
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setFormatReceive}
	 * @see     {@link cocosAPI._getFormatReceive}
	 */
	var cocosFormatReceive = 'json';

	var cocosDeployOnAuthorize = false;

	/**
	 * This variable will be used to hold the default callback-function to
	 * call after a succesfully API-call.
	 *
	 * @var     cocosAPI.callbackSucess
	 * @type    {Function}
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setCallbackSuccess}
	 * @see     {@link cocosAPI._executeCallbackSuccess}
	 */
	var cocosCallbackSuccess;

	/**
	 * This variable will be used to hold the default callback-function to
	 * call after an API-call, which gave an error.
	 *
	 * @var     cocosAPI.cocosCallbackError
	 * @type    {Function}
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setCallbackError}
	 * @see     {@link cocosAPI._executeCallbackError}
	 */
	var cocosCallbackError;

	/**
	 * This variable will be used to hold the default callback-function to
	 * call after executing an API-call. This function will be executed
	 * always, when a API-call was succesfully or gave an error.
	 *
	 * @var     cocosAPI.callbackComplete
	 * @type    {Function}
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setCallbackComplete}
	 * @see	    {@link cocosAPI._executeCallbackComplete}
	 */
	var cocosCallbackComplete;

	/**
	 * This variable will be used to hold the callback-function that needs
	 * to be called when some progress has been made while handling the
	 * request. Based on the progress of the request, various values will
	 * be sent
	 *
	 * @example
	 * callbackProgress(-1)      // When a xhrCall starts
 	 * callbackProgress([0-100]) // While loading
 	 * callbackProgress(100)     // When xhrCall is completed
 	 * callbackProgress(-100)    // On abort
	 *
	 * @var     cocosAPI.callbackProgress
	 * @type    {Function}
	 * @access  private
	 *
	 * @see     {@link cocosAPI.setCallbackProgress}
	 * @see	    {@link cocosAPI._executeCallbackProgress}
	 */
	var cocosCallbackProgress;

	/**
	 * This variable will be used to hold the default callback-function to call when the
	 * expiration of the login changes / gets updated.
	 *
	 * @var     cocosAPI.cocosCallbackExpiration
	 * @type    {Function}
	 * @access  private
	 *
	 * @see     {@link cocosAPI.cocosLoginExpirationInterval}
	 * @see     {@link cocosAPI.cocosLoginExpirationTimestamp}
	 * @see     {@link cocosAPI.setCallbackExpiration}
	 * @see	    {@link cocosAPI._executeCallbackExpiration}
	 */
	var cocosCallbackExpiration;

	/**
	 *
	 */

	var cocosLoginExpirationInterval = null;

	/**
	 *
	 */

	var cocosLoginExpirationTimestamp = 0;

	/**
	 * This variable will be used to hold the default callback-function to call for when the
	 * login expires. This function will be executed when the time of the session / cookie
	 * expires, so based on this timeout, it's possible to (for example) pop a login-screen to
	 * the user.
	 *
	 * @var     cocosAPI.cocosCallbackLoginExpired
	 * @type    {Function}
	 * @access  private
	 *
	 * @see     {@link cocosAPI.cocosLoginExpireTimer}
	 * @see     {@link cocosAPI.setCallbackLoginExpired}
	 * @see	    {@link cocosAPI._executeCallbackLoginExpired}
	 */
	var cocosCallbackLoginExpired;

	/**
	 *
	 */
	var cocosLoginExpireTimer = null;

	/**
	 * ..
	 */
	var cocosCallbackLogToConsole;

	/**
	 * This variable will be used to hold the debug-bool. When set to true,
	 * debug will be enabled.
	 *
	 * @var     cocosAPI.cocosDebug
	 * @type    {Boolean}
	 * @default false
	 * @access  private
	 *
	 * @see     {@link cocosAPI.enableDebug}
	 * @see     {@link cocosAPI.disableDebug}
	 * @see     {@link cocosAPI._inDebug}
	 */
	var cocosDebug = false;

	/**
	 * ...
	 */
	var cocosLogToConsole = false;

	/**
	 * [cocosAbortTimer description]
	 * @type {[type]}
	 */
	var cocosRequestAbortTimer = null;

	/**
	 * [cocosAlertsAllowed description]
	 * @type {Boolean}
	 */
	var cocosAlertsAllowed = true;

	/**
	 * { var_description }
	 *
	 * @type       {<type>}
	 */
	var cososLastRequestTimestamp = null;

	/**
	 * { var_description }
	 *
	 * @type       {<type>}
	 */
	var cocosApiLanguage = null;

	/**
	 * { var_description }
	 *
	 * @type       {<type>}
	 */
	var cocosApiDataLanguage = null;

	/**
	 * The activeRequests-object will be used to store all the requestHandler-objects, based on
	 * the requestId.
	 *
	 * @type       {<type>}
	 */
	var _activeRequests = {};

	var _activeSessionHash = null;

	/**
	 * Adds an active request.
	 *
	 * @param      {<type>}  requestId  The request identifier
	 * @param      {<type>}  rqh        The rqh
	 */
	var _addActiveRequest = function(requestId, rqh)
	{
		if(_isset(rqh) && !_isNull(rqh) && _isObject(rqh))
		{
			_activeRequests[requestId] = rqh;
		}
	}

	/**
	 * Removes an active request.
	 *
	 * @param      {<type>}  requestId  The request identifier
	 */
	var _removeActiveRequest = function(requestId)
	{
		if(_isset(_activeRequests[requestId]))
		{
			delete _activeRequests[requestId];
		}
	}

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   _ _
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) | | |
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  |_  _|
	 *     |___/___\___| |_| |___\___/|_|\_| (_)   |_|
	 * ---------------------------------------------------------------------
	 * SETCTION 4: Getters & Setters / Enablers & Disablers
	 * ---------------------------------------------------------------------
	 *
	 * This section will contain functions (setters and getters), which can
	 * be used to set a variable, which will be 'public' functions, like:
	 * 	this.setVariable(var)
	 * and to get a varaiable, which will be 'private' functions, like:
	 * 	var getVariable()
	 *
	 * Also this section will alse have functions (enablers and disabled) to
	 * use to enable & disabled a boolean, like:
	 * 	this.enableBoolean();
	 * and:
	 * 	this.disableBoolean();
	 *
	 * ---------------------------------------------------------------------
	 */

	/**
	 * This function can be called to set the API-key which needs to be used
	 * to communicate with the CoCoS API.
	 *
	 * @method cocosAPI.setProtocol
	 * @access public
	 * @param  {String}  protocol  The protocol (http or https) to use to
	 *                             connect with the CoCoS API.
	 * @return {Void}              Will return true of false to indicate of
	 *                             the given protocol was
	 *
	 * @see     {@link cocosAPI.cocosProtocol}
	 * @see     {@link cocosAPI._getProtocol}
	 */
	this.setProtocol = function(protocol)
	{
		// Check if the protocol is allowed. If not, an alert will be
		// given.
		//
		if(_inArray(protocol, ALLOWED_PROTOCOLS))
		{
			cocosProtocol = protocol;

			return true;
		}

		_notOk();

		if(_alertsAllowed())
		{
			alert(_getTextFromLib('protocolError', [protocol]));
		}
		return false;
	};

	/**
	 * This function will be used to get the protocol which is set.
	 *
	 * @method cocosAPI._getProtocol
	 * @access private
	 * @return {String}              The protocol which is set to use.
	 *
	 * @see    {@link cocosAPI.cocosProtocol}
	 * @see    {@link cocosAPI.setProtocol}
	 */
	var _getProtocol = function()
	{
		return cocosProtocol;
	};

	/**
	 * [setHost description]
	 *
	 * @method cocosAPI.setHost
	 * @access public
	 * @param  {String}   host  [description]
	 * @return {Boolean}        [description]
	 *
	 * @see    https://regex101.com/r/0WMysi/2
	 * @see    http://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address#comment71717865_106223
	 *
	 * @see    {@link cocosApi.cososHost}
	 * @see    {@link cocosApi._getHost}
	 */
	this.setHost = function(host)
	{
		var pattern = new RegExp(/^(((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))|((([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z|[A-Za-z][A-Za-z0-9\‌​-]*[A-Za-z0-9])))$/gi);
		if(pattern.test(host))
		{
			cocosHost = host;
		}
		else
		{
			_executeCallbackError(null, _getTextFromLib('invalidHost', [host]));
			return false;
		}

		return true;
	};

	/**
	 * [_getHost description]
	 *
	 * @method cocosAPI._getHost
	 * @access private
	 * @return {String} [description]
	 *
	 * @see    {@link cocosApi.cososHost}
	 * @see    {@link cocosApi.setHost}
	 */
	var _getHost = function()
	{
		if(_isset(cocosHost))
		{
			return cocosHost;
		}
		return false;
	};

	/**
	 * This function can be used to set the path to locate the CoCoS API on
	 * the given host. This function can be used to change the path on an
	 *
	 * @example
	 * setPath(/api/v1)l
	 *
	 * @method cocosAPI.setPath
	 * @access public
	 * @param  {String}   path  The path to use on the given host
	 * @return {Boolean} 	    Return if the given path was valid or not.
	 *
	 * @see    {@link cocosApi.cocosPath}
	 * @see    {@link cocosApi._getPath}
	 */
	this.setPath = function(path)
	{
		if(path.substring(0, 1) != '/')
		{
			path = '/'+path;
		}

		if(path.substring((path.length)-1, path.length) != '/')
		{
			path = path+'/';
		}

		cocosPath = path;

		return true;
	};

	/**
	 * [_getPath description]
	 *
	 * @method cocosAPI._getPath
	 * @access private
	 * @return {String}          [description]
	 *
	 * @see    {@link cocosApi.cocosPath}
	 * @see    {@link cocosApi.setPath}
	 */
	var _getPath = function()
	{
		return cocosPath;
	}

	/**
	 * This function can be called to set the API-key which needs to be used
	 * to communicate with the CoCoS API.
	 *
	 * @method cocosAPI.setApiKey
	 * @access public
	 * @param  {String} apiKey    The apiKey to use while connecting to the
	 *                            CoCoS API.
	 * @return {Void}             [description]
	 *
	 * @see    {@link cocosApi.cocosApiKey}
	 * @see    {@link cocosApi._getApiKey}
	 */
	this.setApiKey = function(apiKey)
	{
		cocosApiKey = apiKey;

		return true;
	};

	/**
	 * [_getApiKey description]
	 *
	 * @method cocosAPI._getApiKey
	 * @access private
	 * @return {String}  [description]
	 *
	 * @see    {@link cocosApi.cocosApiKey}
	 * @see    {@link cocosApi.setApiKey}
	 */
	var _getApiKey = function()
	{
		return cocosApiKey;
	}

	/**
	 * This function can be used to set the maximum amount of seconds a
	 * request may take to give back an response. When the given time is
	 * passed, an abort will be sent to the request.
	 *
	 * @method cocosAPI.setTimeout
	 * @param  {Number}   timeoutInSeconds The timeout for a request (in
	 *                                     seconds).
	 * @return {Boolean}                   [description]
	 *
	 * @see    {@link cocosApi.cocosTimeout}
	 * @see    {@link cocosApi._getTimeout}
	 */
	this.setTimeout = function(timeoutInSeconds)
	{
		if((timeoutInSeconds > 0 || timeoutInSeconds === 0 || timeoutInSeconds === '0') && timeoutInSeconds !== true && isFinite(timeoutInSeconds))
		{
			cocosTimeout = parseInt(timeoutInSeconds);
		}
		else
		{
			_executeCallbackError(null, _getTextFromLib('invalidTimeout', [timeoutInSeconds]));
			return false;
		}
	}


	/**
	 * This function can be called to get the maximum timeout for a request.
	 *
	 * @method cocosAPI._getTimeout
	 * @access private
	 * @return {Number}             The amount of seconds a request may take
	 *                              to give back an response, before an abort
	 *                              will be sent.
	 *
	 * @see    {@link cocosApi.cocosTimeout}
	 * @see    {@link cocosApi.setTimeout}
	 */
	var _getTimeout = function()
	{
		return cocosTimeout;
	}

	/**
	 * This function can be used to set the maximum amount of seconds a
	 * pending request may take to give back an response. When the given
	 * time is passed, an abort will be sent to the pending request.
	 *
	 * @method cocosAPI.setTimeout
	 * @param  {Number}   timeoutInSeconds The timeout for a pending request
	 *                                     (in seconds).
	 * @return {Boolean}                   [description]
	 *
	 * @see    {@link cocosApi.cocosPendingTimeout}
	 * @see    {@link cocosApi._getPendingTimeout}
	 */
	this.setPendingTimeout = function(timeoutInSeconds)
	{
		if((timeoutInSeconds > 0 || timeoutInSeconds === 0 || timeoutInSeconds === '0') && timeoutInSeconds !== true && isFinite(timeoutInSeconds))
		{
			cocosPendingTimeout = parseInt(timeoutInSeconds);
		}
		else
		{
			_executeCallbackError(null, _getTextFromLib('invalidTimeout', [timeoutInSeconds]));
			return false;
		}
	}


	/**
	 * This function can be called to get the maximum timeout for a 
	 * pending request.
	 *
	 * @method cocosAPI._getPendingTimeout
	 * @access private
	 * @return {Number}             	The amount of seconds a pending
	 *                                   	request may take to give back an
	 *                                   	response, before an abort will
	 *                                   	be sent.
	 *
	 * @see    {@link cocosApi.cocosPendingTimeout}
	 * @see    {@link cocosApi.setPendingTimeout}
	 */
	var _getPendingTimeout = function()
	{
		return cocosPendingTimeout;
	}

	/**
	 * [disallowAlerts description]
	 * @return {[type]} [description]
	 */
	this.allowAlerts = function()
	{
		cocosAlertsAllowed = true;
	}

	/**
	 * [disallowAlerts description]
	 * @return {[type]} [description]
	 */
	this.disallowAlerts = function()
	{
		cocosAlertsAllowed = false;
	}

	/**
	 * [_alertsAllowed description]
	 * @return {[type]} [description]
	 */
	var _alertsAllowed = function()
	{
		return _isTrue(cocosAlertsAllowed);
	}

	/**
	 * [enableRequestHeaders description]
	 * @method cocosAPI.enableRequestHeaders
	 * @access public
	 * @return {void}
	 *
	 * @see    {@link cocosApi.cocosUseHeaders}
	 * @see    {@link cocosApi.disableRequestHeaders}
	 * @see    {@link cocosApi._useRequestHeaders}
	 */
	this.enableRequestHeaders = function()
	{
		cocosUseHeaders = true;
	};

	/**
	 * [disableRequestHeaders description]
	 *
	 * @method cocosAPI.disableRequestHeaders
	 * @access public
	 * @return {void}
	 *
	 * @see    {@link cocosApi.cocosUseHeaders}
	 * @see    {@link cocosApi.enableRequestHeaders}
	 * @see    {@link cocosApi._useRequestHeaders}
	 */
	this.disableRequestHeaders = function()
	{
		cocosUseHeaders = false;
	};

	/**
	 * [_useRequestHeaders description]
	 *
	 * @method cocosAPI._useRequestHeaders
	 * @access private
	 * @return {Boolean}                   [description]
	 *
	 * @see    {@link cocosApi.cocosUseHeaders}
	 * @see    {@link cocosApi.enableRequestHeaders}
	 * @see    {@link cocosApi.disableRequestHeaders}
	 */
	var _useRequestHeaders = function()
	{
		return (cocosUseHeaders === true);
	};

	/**
	 * [cocosAPI.enableHttpMethods description]
	 *
	 * @method cocosAPI.enableHttpMethods
	 * @access public
	 * @return {void}          [description]
	 *
	 * @see    {@link cocosApi.cocosUseMethods}
	 * @see    {@link cocosApi.disableHttpMethods}
	 * @see    {@link cocosApi._useHttpMethods}
	 */
	this.enableHttpMethods = function()
	{
		cocosUseMethods = true;
	};

	/**
	 * [cocosAPI.disableHttpMethods description]
	 * @method cocosAPI.disableHttpMethods
	 * @access public
	 * @return {void}
	 *
	 * @see    {@link cocosApi.cocosUseMethods}
	 * @see    {@link cocosApi.enableHttpMethods}
	 * @see    {@link cocosApi._useHttpMethods}
	 */
	this.disableHttpMethods = function()
	{
		cocosUseMethods = false;
	};

	/**
	 * [cocosAPI._useHttpMethods description]
	 *
	 * @method cocosAPI._useHttpMethods
	 * @access private
	 * @return {Boolean}                [description]
	 *
	 * @see    {@link cocosApi.cocosUseMethods}
	 * @see    {@link cocosApi.enableHttpMethods}
	 * @see    {@link cocosApi.disableHttpMethods}
	 */
	var _useHttpMethods = function()
	{
		return (cocosUseMethods === true);
	};

	/**
	 * [enableSaveCookie description]
	 *
	 * @method cocosAPI.enableSaveCookie
	 * @access public
	 * @return {void}
	 *
	 * @see    {@link cocosApi.cocosUseCookie}
	 * @see    {@link cocosApi.disableSaveCookie}
	 * @see    {@link cocosApi._useCookie}
	 */
	this.enableSaveCookie = function()
	{
		cocosUseCookie = true;
	};

	/**
	 * [disableSaveCookie description]
	 *
	 * @method cocosAPI.disableSaveCookie
	 * @access public
	 * @return {void}
	 *
	 * @see    {@link cocosApi.cocosUseCookie}
	 * @see    {@link cocosApi.enableSaveCookie}
	 * @see    {@link cocosApi._useCookie}
	 */
	this.disableSaveCookie = function()
	{
		cocosUseCookie = false;
		_checkCookie();
	};

	/**
	 * [_useCookie description]
	 *
	 * @method cocosAPI._useCookie
	 * @access private
	 * @return {Boolean}           [description]
	 *
	 * @see    {@link cocosApi.cocosUseCookie}
	 * @see    {@link cocosApi.disableSaveCookie}
	 * @see    {@link cocosApi._useCookie}
	 */
	var _useCookie = function()
	{
		return (cocosUseCookie === true);
	};

	/**
	 * [setCookieName description]
	 * @method cocosAPI.setCookieName
	 * @access pubic
	 * @param  {void} name            [description]
	 *
	 * @see    {@link cocosApi.cososCookieName}
	 * @see    {@link cocosApi._getCookieName}
	 */
	this.setCookieName = function(cookie, name)
	{
		if(!_isEmpty(name))
		{
			switch(cookie)
			{
				case COOKIE_NAME_TOKEN:
				case COOKIE_NAME_COOKIES:
				case COOKIE_NAME_CROSS_DOMAIN_COOKIES:
					cososCookieNames[cookie] = name;
					break;
				
				default:
					//
					break;
			}
		}
	}

	/**
	 * [_getCookieName description]
	 * @method cocosAPI._getCookieName
	 * @access private
	 * @return {String}                [description]
	 *
	 * @see    {@link cocosApi.cososCookieName}
	 * @see    {@link cocosApi.setCookieName}
	 */
	var _getCookieName = function(cookie)
	{
		if(_isset(cocosCookieNames[cookie]))
		{
			var cookieName = cocosCookieNames[cookie];
			var cookiePrefix = _getCookiePrefix();
			if(!_isEmpty(cookiePrefix))
			{
				return _trim(cookiePrefix, '-') + '-' + cookieName;
			}
		}
	}
	
	/**
	 * Sets the cookie prefix.
	 *
	 * @param      {<type>}  prefix  The prefix
	 */
	this.setCookiePrefix = function(prefix)
	{
		if(_isset(prefix))
		{
			cocosCookiePrefix = prefix;
		}
	}
		
	/**
	 * Gets the cookie prefix.
	 *
	 * @return     {<type>}  The cookie prefix.
	 */
	var _getCookiePrefix = function()
	{
		return cocosCookiePrefix;
	}	

	/**
	 * This function can be used to set the format that needs to be used,
	 * when data is sent to the CoCoS API.
	 *
	 * @method cocosAPI.setFormatSend
	 * @access public
	 * @param  {String} format        [description]
	 *
	 * @see    {@link cocosApi.ALLOWED_SEND_FORMATS}
	 * @see    {@link cocosApi.cocosFormatSend}
	 * @see    {@link cocosApi._getFormatSend}
	 */
	this.setFormatSend = function(format)
	{
		if(_inArray(format, ALLOWED_SEND_FORMATS))
		{
			cocosFormatSend = format;
		}
		else
		{
			_executeCallbackError(null, _getTextFromLib('sendFormatError', [format, ALLOWED_SEND_FORMATS.join(', ')]));
			_notOk();
		}
	};

	/**
	 * [_getFormatSend description]
	 * @method cocosAPI._getFormatSend
	 * @access private
	 * @return {String}                [description]
	 *
	 * @see    {@link cocosApi.ALLOWED_SEND_FORMATS}
	 * @see    {@link cocosApi.cocosFormatSend}
	 * @see    {@link cocosApi.setFormatSend}
	 */
	var _getFormatSend = function()
	{
		return cocosFormatSend;
	};

	/**
	 * [setFormatReceive description]
	 *
	 * @method cocosAPI.setFormatReceive
	 * @access public
	 * @param  {String} format           [description]
	 * @return {Void}
	 *
	 * @see    {@link cocosApi.ALLOWED_RECEIVE_FORMATS}
	 * @see    {@link cocosApi.cocosFormatReceive}
	 * @see    {@link cocosApi._getFormatReceive}
	 */
	this.setFormatReceive = function(format)
	{
		if(_inArray(format, ALLOWED_RECEIVE_FORMATS))
		{
			cocosFormatReceive = format;
		}
		else
		{
			_executeCallbackError(null, _getTextFromLib('receiveFormatError', [format, ALLOWED_RECEIVE_FORMATS.join(', ')]));
			_notOk();
		}
	};

	/**
	 * [_getFormatReceive description]
	 * @method cocosAPI._getFormatReceive
	 * @access private
	 * @return {String}                   [description]
	 *
	 * @see    {@link cocosApi.ALLOWED_RECEIVE_FORMATS}
	 * @see    {@link cocosApi.cocosFormatReceive}
	 * @see    {@link cocosApi.setFormatReceive}
	 */
	var _getFormatReceive = function()
	{
		return cocosFormatReceive;
	};

	/**
	 * [cocosAPI.enableDeployOnAuthorize description]
	 *
	 * @method cocosAPI.enableDeployOnAuthorize
	 * @access public
	 * @return {void}          [description]
	 *
	 * @see    {@link cocosApi.cocosDeployOnAuthorize}
	 * @see    {@link cocosApi.disableDeployOnAuthorize}
	 * @see    {@link cocosApi._deployOnAuthorize}
	 */
	this.enableDeployOnAuthorize = function()
	{
		cocosDeployOnAuthorize = true;
	};

	/**
	 * [cocosAPI.disableDeployOnAuthorize description]
	 * @method cocosAPI.disableDeployOnAuthorize
	 * @access public
	 * @return {void}
	 *
	 * @see    {@link cocosApi.cocosDeployOnAuthorize}
	 * @see    {@link cocosApi.enableDeployOnAuthorize}
	 * @see    {@link cocosApi._deployOnAuthorize}
	 */
	this.disableDeployOnAuthorize = function()
	{
		cocosDeployOnAuthorize = false;
	};

	/**
	 * [cocosAPI._deployOnAuthorize description]
	 *
	 * @method cocosAPI._deployOnAuthorize
	 * @access private
	 * @return {Boolean}                [description]
	 *
	 * @see    {@link cocosApi.cocosDeployOnAuthorize}
	 * @see    {@link cocosApi.enableDeployOnAuthorize}
	 * @see    {@link cocosApi.disableDeployOnAuthorize}
	 */
	var _deployOnAuthorize = function()
	{
		// Deprecated
		//
		// return (cocosDeployOnAuthorize === true);
		return false;
		
	};

	/**
	 * [setCallbackSuccess description]
	 *
	 * @method cocosAPI.setCallbackSuccess
	 * @access public
	 * @param  {Function}  successFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackSuccess}
	 * @see    {@link cocosApi._executeCallbackSuccess}
	 */
	this.setCallbackSuccess = function(successFunction)
	{
		if(_isFunction(successFunction))
		{
			cocosCallbackSuccess = successFunction;
			return true;
		}

		return false;
	};

	/**
	 * [setCallbackSuccess description]
	 *
	 * @method cocosAPI.setCallbackSuccess
	 * @access public
	 * @param  {Function}  successFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackSuccess}
	 * @see    {@link cocosApi._executeCallbackSuccess}
	 */
	this.resetCallbackSuccess = function()
	{
		cocosCallbackSuccess = null;
		return true;
	};

	/**
	 * [setCallbackError description]
	 *
	 * @method cocosAPI.setCallbackError
	 * @access public
	 * @param  {Function}  errorFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackError}
	 * @see    {@link cocosApi._executeCallbackError}
	 */
	this.setCallbackError = function(errorFunction)
	{
		if(_isFunction(errorFunction))
		{
			cocosCallbackError = errorFunction;
			return true;
		}

		return false;
	};

	/**
	 * [setCallbackError description]
	 *
	 * @method cocosAPI.setCallbackError
	 * @access public
	 * @param  {Function}  errorFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackError}
	 * @see    {@link cocosApi._executeCallbackError}
	 */
	this.resetCallbackError = function()
	{
		cocosCallbackError = null;
		return true;
	};

	/**
	 * [setCallbackComplete description]
	 *
	 * @method cocosAPI.setCallbackComplete
	 * @access public
	 * @param  {Function}  completeFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackComplete}
	 * @see    {@link cocosApi._executeCallbackComplete}
	 */
	this.setCallbackComplete = function(completeFunction)
	{
		if(_isFunction(completeFunction))
		{
			cocosCallbackComplete = completeFunction;
			return true;
		}

		return false;
	};

	/**
	 * [setCallbackComplete description]
	 *
	 * @method cocosAPI.setCallbackComplete
	 * @access public
	 * @param  {Function}  completeFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackComplete}
	 * @see    {@link cocosApi._executeCallbackComplete}
	 */
	this.resetCallbackComplete = function()
	{
		cocosCallbackComplete = null;
		return true;
	};

	/**
	 * [setCallbackProgress description]
	 *
	 * @method cocosAPI.setCallbackProgress
	 * @access public
	 * @param  {Function}  progressFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackProgress}
	 * @see    {@link cocosApi._executeCallbackProgress}
	 */
	this.setCallbackProgress = function(progressFunction)
	{
		if(_isFunction(progressFunction))
		{
			cocosCallbackProgress = progressFunction;
			return true;
		}

		return false;
	}

	/**
	 * [setCallbackProgress description]
	 *
	 * @method cocosAPI.setCallbackProgress
	 * @access public
	 * @param  {Function}  progressFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackProgress}
	 * @see    {@link cocosApi._executeCallbackProgress}
	 */
	this.resetCallbackProgress = function()
	{
		cocosCallbackProgress = null;
		return true;
	}

	/**
	 * [setCallbackLoginExpiration description]
	 *
	 * @method cocosAPI.setCallbackLoginExpiration
	 * @access public
	 * @param  {Function}  loginExpiredFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackLoginExpired}
	 * @see    {@link cocosApi._executeCallbackLoginExpired}
	 */
	this.setCallbackLoginExpiration = function(expiredFunction, interval)
	{
		if(_isFunction(expiredFunction))
		{
			cocosCallbackExpiration = expiredFunction;

			if(!_isset(interval))
			{
				interval = 1000;
			}

			_handleLoginExpiration();
			cocosLoginExpirationInterval = setInterval(function()
			{
				_handleLoginExpiration();
			}, interval);

			return true;
		}
		else
		{
			this.resetCallbackLoginExpired();
		}

		return false;
	};

	this.resetCallbackLoginExpiration = function()
	{
		_clearLoginExpirationInterval();
	}

	/**
	 * [setCallbackLoginExpired description]
	 *
	 * @method cocosAPI.setCallbackLoginExpired
	 * @access public
	 * @param  {Function}  loginExpiredFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackLoginExpired}
	 * @see    {@link cocosApi._executeCallbackLoginExpired}
	 */
	this.setCallbackLoginExpired = function(loginExpiredFunction)
	{
		if(_isFunction(loginExpiredFunction))
		{
			cocosCallbackLoginExpired = loginExpiredFunction;
			return true;
		}

		return false;
	};

	this.resetCallbackLoginExpired = function()
	{
		_clearLoginExpireTimer();
	}

	/**
	 * [setCallbackLoginExpired description]
	 *
	 * @method cocosAPI.setCallbackLoginExpired
	 * @access public
	 * @param  {Function}  loginExpiredFunction  [description]
	 * @return {Boolean}
	 *
	 * @see    {@link cocosApi.cocosCallbackLoginExpired}
	 * @see    {@link cocosApi._executeCallbackLoginExpired}
	 */
	this.resetCallbackLoginExpired = function()
	{
		cocosCallbackLoginExpired = null;
		return true;
	};

	/**
	 * ...
	 */
	this.setCallbackLogToConsole = function(logToConsoleFunction)
	{
		if(_isFunction(logToConsoleFunction))
		{
			cocosCallbackLogToConsole = logToConsoleFunction;
			return true;
		}

		return false;
	};

	/**
	 * ...
	 */
	this.resetCallbackLogToConsole = function()
	{
		cocosCallbackLogToConsole = null;
		return true;
	};

	/**
	 * [enableDebug description]
	 *
	 * @method cocosAPI.enableDebug
	 * @return {Void}               [description]
	 *
	 * @see    {@link cocosApi.cocosDebug}
	 * @see    {@link cocosApi.disableDebug}
	 * @see    {@link cocosApi._inDebug}
	 *
	 * @see    {@link cocosApi.disableHttpMethods}
	 * @see    {@link cocosApi.disableRequestHeaders}
	 */
	this.enableDebug = function(enableLogToConsole)
	{
		// Disable usages of methods and headers. That way the URL which will
		// be called (as GET) will contain all data, so it can be copied and
		// pasted into a webbrowser-addressbar for example, si debugging can
		// be done
		//
		this.disableHttpMethods();
		this.disableRequestHeaders();

		//
		cocosDebug = true;

		if(_isTrue(enableLogToConsole))
		{
			this.enableLogToConsole();
		}
	}

	/**
	 * [disableDebug description]
	 *
	 * @method cocosAPI.disableDebug
	 * @return {Void}                [description]
	 *
	 * @see    {@link cocosApi.cocosDebug}
	 * @see    {@link cocosApi.enableDebug}
	 * @see    {@link cocosApi._inDebug}
	 *
	 * @see    {@link cocosApi.enableHttpMethods}
	 * @see    {@link cocosApi.enableRequestHeaders}
	 */
	this.disableDebug = function(keepLogToConsole)
	{
		this.enableHttpMethods();
		this.enableRequestHeaders();

		cocosDebug = false;

		if(!_isTrue(keepLogToConsole))
		{
			this.disableLogToConsole();
		}
	}

	/**
	 * ...
	 */
	this.enableLogToConsole = function()
	{
		cocosLogToConsole = true;
	}

	/**
	 * ...
	 */
	this.disableLogToConsole = function()
	{
		cocosLogToConsole = false;
	}

	/**
	 * This function can be used to set the language to communicate with the CoCoS API.
	 * 
	 * @example
	 * setLanguage('NL');
	 *
	 * @method cocosAPI.setLanguage
	 * @access public
	 * @param  {String}   path  The language to set.
	 *
	 * @see    {@link cocosApi.cocosApiLanguage}
	 * @see    {@link cocosApi._getLanguage}
	 */
	this.setLanguage = function(language)
	{
		if(_isString(language))
		{
			cocosApiLanguage = language.toUpperCase();
		}
		else
		{
			cocosApiLanguage = null;
		}
	};

	/**
	 * [_getLanguage description]
	 *
	 * @method cocosAPI._getLanguage
	 * @access private
	 * @return {String}          [description]
	 *
	 * @see    {@link cocosApi.cocosApiLanguage}
	 * @see    {@link cocosApi.setLanguage}
	 */
	var _getLanguage = function()
	{
		return cocosApiLanguage;
	}

	/**
	 * This function can be used to set the language to communicate with the CoCoS API.
	 * 
	 * @example
	 * setDataLanguage('NL');
	 *
	 * @method cocosAPI.setDataLanguage
	 * @access public
	 * @param  {String}   path  The language to set.
	 *
	 * @see    {@link cocosApi.cocosApiDataLanguage}
	 * @see    {@link cocosApi._getDataLanguage}
	 */
	this.setDataLanguage = function(dataLanguage)
	{
		if(_isString(dataLanguage))
		{
			cocosApiDataLanguage = dataLanguage.toUpperCase();
		}
		else
		{
			cocosApiDataLanguage = null;
		}
	};

	/**
	 * [_getDataLanguage description]
	 *
	 * @method cocosAPI._getDataLanguage
	 * @access private
	 * @return {String}          [description]
	 *
	 * @see    {@link cocosApi.cocosApiDataLanguage}
	 * @see    {@link cocosApi.setDataLanguage}
	 */
	var _getDataLanguage = function()
	{
		return cocosApiDataLanguage;
	}

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   ___
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) | __|
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  |__ \
	 *     |___/___\___| |_| |___\___/|_|\_| (_) |___/
	 * ---------------------------------------------------------------------
	 * SETCTION 5: Various
	 * ---------------------------------------------------------------------
	 *
	 * This section contains a few functions the check if the connector is
	 * running in debug and to get/set if the connector is 'ok'.
	 *
	 * ---------------------------------------------------------------------
	 */

	/**
	 * [_inDebug description]
	 *
	 * @method cocosAPI._inDebug
	 * @access private
	 * @return {void}
	 *
	 * @see    {@link cocosApi.cocosDebug}
	 * @see    {@link cocosApi.enable}
	 * @see    {@link cocosApi.disableDebug}
	 */
	var _inDebug = function()
	{
		return _isTrue(cocosDebug);
	}

	/**
	 * ...
	 */
	var _useConsoleLog = function()
	{
		return _isTrue(cocosLogToConsole);
	}

	/**
	 * This function will be used to set the ok-var to false. When this
	 * variable is false, a call will be blocked when it's called.
	 *
	 * @method cocosAPI._notOk
	 * @access private
	 * @return {Void}
	 *
	 * @see {@link cocosAPI._cocosOk}
	 * @see {@link cocosAPI._isOk}
	 */
	var _notOk = function()
	{
		_cocosOk = false;
	};

	/**
	 * This function will be used to check if the ok-var is rrue or false,
	 * to determine if a valid call can be made to the CoCoS API or not.
	 *
	 * @method cocosAPI._isOk
	 * @access private
	 * @return {Boolean}
	 *
	 * @see {@link cocosAPI._cocosOk}
	 * @see {@link cocosAPI._notOk}
	 */
	var _isOk = function()
	{
		return (_cocosOk === true);
	};

	/**
	 * [_isValidIdentifier description]
	 * @param  {[type]}  identifier [description]
	 * @return {Boolean}            [description]
	 */
	var _isValidIdentifier = function(identifier)
	{
		// CHECK IDENTIFIER
		// 
		return ((_isNumber(identifier) && (parseInt(identifier) > 0)) || (
			!_isNumber(identifier)
			&& !_isEmpty(identifier)
			&& !_isFalse(identifier)
			&& !_isNull(identifier)
			&& (_trim(identifier).toLowerCase() !== 'null')
			&& (_trim(identifier).toLowerCase() !== '0')
			&& (_trim(identifier).toLowerCase() !== '')
			&& (_trim(identifier).toLowerCase() !== 'undefined')
			&& (_trim(identifier).toLowerCase() !== 'false')
		));
	};

	var _executeCallbackErrorFunction = function(errorFunction, error, completeFunction)
	{
		// Check if a error-function is given. If not, go use the default error-function
		// (if available)
		//
		if(!_isFunction(errorFunction) && _isFunction(cocosCallbackError))
		{
			errorFunction = cocosCallbackError;
		}

		// Check if a complete-function is given. If not, go use the default complete-
		// function (if available)
		//
		if(!_isFunction(completeFunction) && _isFunction(cocosCallbackComplete))
		{
			completeFunction = cocosCallbackComplete;
		}

		if(_isFunction(errorFunction))
		{
			// When true returned on a custom callback-function, the global callback-
			// function will (also) be executed (if available).
			//
			functionResult = errorFunction(error);
		}
		else
		{
			if(_alertsAllowed())
			{
				// Showing alert in combination with the noErrorFunction-message is
				// disabled. When a error occurs and no errorFunction is available,
				// just show an alert (if allowed) with the error received from the
				// CoCoS API. A developer should know that when alerts are being
				// shown, he/she forgot to register a callable errorFunction in the
				// CoCoS API SDK which can be called on errors.
				// 
				// alert(_getTextFromLib('noErrorFunction', [error]));
				alert(error);
			}
		}
	};

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _    __
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_)  / /
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  / _ \
	 *     |___/___\___| |_| |___\___/|_|\_| (_) \___/
	 * ---------------------------------------------------------------------
	 * SETCTION 6: Payload
	 * ---------------------------------------------------------------------
	 *
	 * This section has function which can be used to get the payload from
	 * the JWT-token from a request, including functions to get the meta-
	 * and data-part out of it.
	 *
	 * ---------------------------------------------------------------------
	 */

	/**
	 * [_getPayload description]
	 *
	 * @method cocosAPI._getPayload
	 * @access private
	 * @param  {String}  key  [description]
	 * @return {Array}        [description]
	 */
	var _getPayload = function(key, accessToken)
	{
		if(!_isset(accessToken) || _isEmpty(accessToken))
		{
			accessToken = _getAccessToken();
		}

		// Check access token
		//
		if(_isset(accessToken))
		{
			// Split JWT-token into segments
			//
			var segments = accessToken.split('.', 3);

			// Decode (base64) payload
			//
			var payload = atob(segments[1]);

			// Parse payload
			//
			payload = JSON.parse(payload);

			// Find key in payload and return value
			//
			if(_isset(key) && !_isNull(key))
			{
				if(_isset(payload[key]))
				{
					return payload[key];	
				}

				return '';
			}
			else
			{
				// Return full payload when no key give
				//
				return payload;
			}
		}

		// Return empty value by default
		//
		return '';
	};

	/**
	 * [_getPayloadMeta description]
	 *
	 * @method cocosAPI._getPayloadMeta
	 * @access private
	 * @param  {String}  key  [description]
	 * @return {Array}        [description]
	 */
	var _getPayloadMeta = function(key, accessToken)
	{
		if(!_isset(accessToken) || _isEmpty(accessToken))
		{
			accessToken = _getAccessToken();
		}

		// Get payload from JWT-token
		//
		var payload = _getPayload(null, accessToken);

		// Check if payload-meta exists
		//
		if(_isset(payload['meta']))
		{
			var meta = payload['meta'];

			// Find key in payload-meta and return value
			//
			if(_isset(key))
			{
				if(_isset(meta[key]))
				{
					return meta[key];
				}

				return '';
			}
			else
			{
				// Return full payload-meta when no key give
				//
				return meta;
			}
		}

		// Return empty value by default
		//
		return '';
	};

	/**
	 * [_getPayloadData description]
	 *
	 * @method cocosAPI._getPayloadData
	 * @access private
	 * @param  {String}  key  [description]
	 * @return {Array}        [description]
	 */
	var _getPayloadData = function(key, accessToken)
	{
		if(!_isset(accessToken) || _isEmpty(accessToken))
		{
			accessToken = _getAccessToken();
		}

		// Get payload from JWT-token
		//
		var payload = _getPayload(null, accessToken);

		// Check if payload-data exists
		//
		if(_isset(payload['data']))
		{
			var data = payload['data'];

			// Find key in payload-data and return value
			//
			if(_isset(key))
			{
				if(_isset(data[key]))
				{
					return data[key];
				}

				return '';
			}
			else
			{
				// Return full payload-data when no key give
				//
				return data;
			}
		}

		return '';
	};

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   ____
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) |__  |
	 *     \__ \ _| (__  | |  | | (_) | .` |  _    / /
	 *     |___/___\___| |_| |___\___/|_|\_| (_)  /_/
	 * ---------------------------------------------------------------------
	 * SETCTION 7: AccessToken and Cookie
	 * ---------------------------------------------------------------------
	 *
	 * This section contains function to set/get/reset values from a cookie.
	 * Also a function to set/store the JWT-token, which  will be returned
	 * in the headers of a response from the CoCoS API. This function will
	 * automaticly check the payload of the JWT and set the cookie for it.
	 *
	 * ---------------------------------------------------------------------
	 */

	/**
	 * [enableFullDomainCookie description]
	 * @method
	 * @date      2017-06-30
	 * @author    S.vanBuren
	 * @copyright (concera
	 * @return    {[type]}   [description]
	 */
	this.enableFullDomainCookie = function()
	{
		this.setCookiePath('/');
	};

	/**
	 * [setCookiePath description]
	 * @method
	 * @date      2017-06-30
	 * @author    S.vanBuren
	 * @copyright (concera
	 * @param     {[type]}   path [description]
	 * @return    {[type]}        [description]
	 */
	this.setCookiePath = function(path)
	{
		if(!_isset(path) || _isEmpty(path))
		{
			var href = window.location.href.replace(window.location.hash, '').replace(window.location.search, '').replace(window.location.origin, '');
			path = href.substring(0, href.lastIndexOf('/')) + '/';

			// Added on 2017-11-10: Remove http(s)://hostname from path in order to be
			// compatible for older versions of Internet Explorer
			// 
			path = path.replace(window.location.protocol + '//' + window.location.hostname, '');
		}

		cocosCookiePath = path; //.toLowerCase();
	};

	/**
	 * [_getCookiePath description]
	 * @method
	 * @date      2017-06-30
	 * @author    S.vanBuren
	 * @copyright (concera
	 * @return    {[type]}   [description]
	 */
	var _getCookiePath = function()
	{
		if(!_isset(cocosCookiePath) || (cocosCookiePath == ''))
		{
			this.setCookiePath();
		}
		return cocosCookiePath;
	}.bind(this);

	/**
 	 * [setAccessToken description]
 	 *
 	 * @method cocosAPI.setAccessToken
	 * @access private
 	 * @param  {String}  accessToken  [description]
 	 * @return {Void}                 [description]
 	 */
 	var _setAccessToken = function(accessToken)
 	{
 		cocosAccessToken = accessToken;
 	}

 	/**
 	 * { function_description }
 	 *
 	 * @param      {<type>}  accessToken               The access token
 	 * @param      {<type>}  extendLoginExpireTimeout  The extend login expire timeout
 	 */
 	var _handleAccessToken = function(accessToken, extendLoginExpireTimeout)
 	{	
 		// Get 'now' (current time from API) from payload.
 		//
 		var payloadNow = _getPayload('now', accessToken);

 		// When we found a 'now'-time, go store this as the last request timestamp we've
 		// received. This timestamp will be used in endlessRequests as starting point when
 		// fetching for new data.
 		//
 		if(payloadNow > 0)
 		{
 			cososLastRequestTimestamp = payloadNow;
 		}

 		// Check if cookies must be used. Of not, we can skip the rest of the handling for
 		// the accessToken.
 		//
		if(_useCookie())
		{
			// Check if we received an accessToken. When empty, go reset the cookies
			//
	 		if(_isEmpty(accessToken))
	 		{
	 			this.resetCookies();
	 		}
	 		// Otherwise, when a accessToken is given, go analyze / handle the JWT-
	 		// accessToken we received from the CoCoS API.
	 		// 
	 		else
	 		{
	 			// Split the token by dots. A JWT-accessToken will consist of three
	 			// segments; the header, the payload and the verify signature. See
	 			// https://jwt.io/ for more info about JWT.
	 			// 
				var segments = accessToken.split('.', 3);

				// Check if we got all 3 segments from the JWT-accessToken. If so,
				// we'll use the second item (key 1), which is the payload.
				//
	 			if(segments.length == 3)
	 			{
	 				// The payload of JWT-accessToken will be a base64-encoded
	 				// JSON-object. We'll decode and parse it in order to get
	 				// the JSON-object.
	 				// 
	 				var payload = atob(segments[1]);
	 				payload = JSON.parse(payload);

	 				// Check if we successfully parsed the JWT-accessToken into
	 				// a JSON-object with a payload, go set/save the accessToken
	 				// into a cookie.
	 				//
					if(_isObject(payload))
	 				{
						_setCookie(COOKIE_NAME_TOKEN, accessToken, '', _getCookiePath());
	 				}

					// Check if we have a logged in user...
					//
	 				if(!_isEmpty(_getPayloadData['name'], accessToken))
	 				{
	 					// Get time (now). Check if it's correct.
	 					//
	 					if(parseInt(_getPayload('now', accessToken)) > 0)
	 					{
							// Get the timestamp of when the accessToken
							// expires. If found, go set a new time for
							// the duration from now till the expire-
							// timestamp.
							// 
							// For example, when now is 1000004000 and
							// the exp is 1000004900, we'll set a timer
							// for 900 seconds = 15 minutes.
							//
							if((parseInt(_getPayload('exp', accessToken)) > 0) && _isTrue(extendLoginExpireTimeout))
							{
								var loginTimeout = (parseInt(_getPayload('exp', accessToken))-parseInt(_getPayload('now', accessToken)));
								_setLoginExpireTimeout(loginTimeout);
							}
						}
					}
	 			}
	 		}
		}

		var sessionHash = _getPayloadMeta(1);
		if(_activeSessionHash != sessionHash)
		{
			_logToConsole('JWT-sessionHash changed from \'' + _activeSessionHash + '\' to \'' + sessionHash + '\'.');
			_activeSessionHash = sessionHash;
		}

 	}.bind(this);

	/**
	 * [_getAccessToken description]
	 *
	 * @method cocosAPI._getAccessToken
	 * @access private
	 * @return {String}                 [description]
	 */
	var _getAccessToken = function()
	{
		if(_useCookie())
		{		
			// Return the contents of the cookie. When no cookie available, this
			// function will return empty.
			//
			return _getCookie(COOKIE_NAME_TOKEN);
		}

		return cocosAccessToken;
	};

	/**
	 * [description]
	 * @method
	 * @author    S.vanBuren
	 * @copyright (concera
	 * @return    {[type]} [description]
	 */
	var _clearLoginExpirationInterval = function()
	{
		if(_isset(cocosLoginExpirationInterval))
		{
			clearTimeout(cocosLoginExpirationInterval);
			cocosLoginExpirationInterval = null;
		}
	}

	/**
	 * [description]
	 * @method
	 * @author    S.vanBuren
	 * @copyright (concera
	 * @return    {[type]} [description]
	 */
	var _clearLoginExpireTimer = function()
	{
		if(_isset(cocosLoginExpireTimer))
		{
			clearTimeout(cocosLoginExpireTimer);
			cocosLoginExpireTimer = null;
		}
	}

	/**
	 * [description]
	 * @method
	 * @author    S.vanBuren
	 * @copyright (concera
	 * @param     {[type]} duration [description]
	 * @return    {[type]}          [description]
	 */
	var _setLoginExpireTimeout = function(duration)
	{
		if((parseInt(duration) > 0) && (parseInt(duration) < 2147483647))
		{
			_clearLoginExpireTimer();
			var timeout = (duration*1000);

			// The maximum delay which can be set into JavaScripts setTimeout-function
			// is a 32 bit signed int. This means, the maximum value can be 4294967295,
			// but, because it's signed, this will become -1, which will cause the 
			// timeout to be triggered immediately.
			//
			// When using only positive values, the maximum duration (in milliseconds)
			// can be 2147483647. This is 2147483 seconds, 35791 minutes, 596,5 hours
			// which will be about 24.85 days. 
			// 
			// To prevent problems, we'll set the maxTimeout for 21 days. Everything
			// above will be decreased.
			//
			var maxTimeout = (21*24*60*60*1000);

			if(timeout > maxTimeout)
			{
				timeout = maxTimeout;
			}

			// Always strip 5 seconds from the actual timeout, so we have some time to
			// clean up request, stop timed methods etc.
			//
			timeout = (timeout - 5000);

			cocosLoginExpirationTimestamp = _now() + (timeout/1000);
			_handleLoginExpiration();

			cocosLoginExpireTimer = setTimeout(function()
			{
				this.handleLogout(function(isLoggedOut)
				{
					if(_isTrue(isLoggedOut))
					{
						_executeCallbackLoginExpired();
					}

				}.bind(this));

			}.bind(this), timeout);
		}
		else
		{
			cocosLoginExpirationTimestamp = 0;
		}

	}.bind(this);

	var _handleLoginExpiration = function()
	{
		var now = _now();
		var expiration = cocosLoginExpirationTimestamp;
		var remaining = (expiration - now);

		if(remaining < 0)
		{
			expiration = now;
			remaining = -1;
		}
		
		_executeCallbackExpiration(now, expiration, remaining);
	}

	/**
	 * [_setCookie description]
	 *
	 * @method cocosAPI._setCookie
	 * @access private
	 * @param  {String}  value    [description]
	 * @param  {String}  expires  [description]
	 * @param  {String}  path     [description]
	 */
	var _setCookie = function(cookie, value, expires, path)
	{
		var cookieOpts = [];
		cookieOpts.push(_getCookieName(cookie)+'='+value);

		if(_isset(expires))
		{
			cookieOpts.push('Expires='+expires);
		}

		if(_isset(path))
		{
			cookieOpts.push('Path=/'+_trim(path, '/'));
		}

		if(window.location.protocol == 'https:')
		{
			cookieOpts.push('Secure');
		}

		cookie = cookieOpts.join('; ');

		// Write cookie
		document.cookie = cookie;
	};

	/**
	 * [setCookieExpiresOffset description]
	 *
	 * @method cocosAPI._setCookieExpiresOffset
	 * @access private
	 * @param  {String}  value   [description]
	 * @param  {Number}  offset  [description]
	 * @param  {String}  path    [description]
	 */
	var _setCookieExpiresOffset = function(cookie, value, offset, path)
	{
		var expires = '';
		if(offset > 0)
		{
			var d = new Date();
			d.setTime(d.getTime() + (offset * 1000));
			expires = d.toUTCString();
		}

		_setCookie(cookie, value, expires, path);
	};

	/**
	 * [resetCookies description]
	 *
	 * @method cocosAPI.resetCookie
	 * @access public
	 * @return {Void}               [description]
	 *
	 * @see    {@link _setCookie}
	 */
	this.resetCookies = function()
	{
		this.resetCookie(COOKIE_NAME_TOKEN);
		this.resetCookie(COOKIE_NAME_COOKIES);
		this.resetCookie(COOKIE_NAME_CROSS_DOMAIN_COOKIES);
	}

	/**
	 * [resetCookie description]
	 *
	 * @method cocosAPI.resetCookie
	 * @access public
	 * @return {Void}               [description]
	 *
	 * @see    {@link _setCookie}
	 */
	this.resetCookie = function(cookie)
	{
		if(!_isset(cookie))
		{
			cookie = COOKIE_NAME_TOKEN;
		}
		
		_setCookie(cookie, '', 'expires=Thu, 01-Jan-1970 00:00:01 GMT', _getCookiePath());
	}

	/**
	 * [_getCookie description]
	 *
	 * @method cocosAPI._getCookie
	 * @access private
	 * @param  {String}  name  [description]
	 * @return {String}        [description]
	 *
	 * @see    {@link _getCookieName}
	 */
	var _getCookie = function(name)
	{
		var value = ' ' + document.cookie;

		var start = value.indexOf(' ' + _getCookieName(name) + '=');
		if (start == -1)
		{
			return '';
		}

		start = value.indexOf('=', start) + 1;
		var end = value.indexOf(';', start);
		if (end == -1)
		{
			end = value.length;
		}

		cookieValue = unescape(value.substring(start,end));

		return cookieValue;

	};

	/**
	 * [checkCookie description]
	 *
	 * @method cocosAPI.checkCookie
	 * @access private
	 * @return {Void}
	 *
	 * @see    {@link _useCookie}
	 * @see    {@link _getCookie}
	 * @see    {@link resetCookie}
	 */
	var _checkCookie = function()
	{
		// Disable cookie usage if file is loaded locally instead of
		// from a webserver (and cookies are enabled)
		//
		if((location.origin == 'file://') && _useCookie())
		{
			this.disableSaveCookie();
		}
		else
		{
			// _setCookie(COOKIE_NAME_COOKIES, '', 'expires=Thu, 01-Jan-1970 00:00:01 GMT', _getCookiePath());
			// _setCookie(COOKIE_NAME_CROSS_DOMAIN_COOKIES, '', 'expires=Thu, 01-Jan-1970 00:00:01 GMT', _getCookiePath());

			// Check if the usage of cookies is disabled...
			//
			if(!_useCookie())
			{
				// If so, check if the current cookie has a value...
				//
				if(_getCookie(COOKIE_NAME_TOKEN) != '')
				{
					// If so, reset the cookie
					//
					this.resetCookie(COOKIE_NAME_TOKEN);
				}
			}
			else
			{
				// When cookie usage is enabled, go get the
				// cookie that is stored.
				//
				accessToken = _getCookie(COOKIE_NAME_TOKEN);

				// Check if the stored cookie has some contents.
				// If so, go analyze the JWT, get the payload of
				// the seconds segment (header.payload.signature)
				// and go analyze it
				//
				if(_isset(accessToken))
				{
					var segments = accessToken.split('.', 3);
		 			if(segments.length == 3)
		 			{
		 				var payload = atob(segments[1]);
		 				payload = JSON.parse(payload);

						// Check if the payload is valid
						// and could be paresed as an
						// JSON-object.
						//
						if(_isObject(payload))
		 				{
							// Go check for the exp
							// (expiration) in the
							// token.
							//
							if(_isset(payload['exp']) && (payload['exp'] > 0))
		 					{
								// Check the exp
								// from the token
								// with the time
								// right now.
								//
								// Reset when
								// token is
								// expired.
								var d = new Date();
								var now = d.getTime();
								var expires = (payload['exp']*1000);

								if(now >= expires)
								{
									// Reset
									// cookie
									//
									this.resetCookies();
								}
		 					}
		 				}
		 			}
				}
			}
		}
	}.bind(this);

	/**
	 * [description]
	 * @method
	 * @author    S.vanBuren
	 * @copyright (concera
	 * @return    {[type]} [description]
	 */
	var _clearRequestAbortTimer = function()
	{
		if(_isset(cocosRequestAbortTimer))
		{
			clearTimeout(cocosRequestAbortTimer);
			cocosRequestAbortTimer = null;
		}
	}

	/**
	 * This function can be called to set the deviceKey which needs to be
	 * used to communicate with the CoCoS API when connection as a device
	 * via a remove connection. Because when using a remote connection, the
	 * ip-address will be the same for each device, so an additional
	 * deviceKey should be given to identify the device who's connecting
	 * to the CoCoS API.
	 *
	 * @method cocosAPI.setDeviceKey
	 * @access public
	 * @param  {String} deviceKey    The deviceKey to use when communicating
	 *                               with the CoCoS API.
	 * @return {Void}               [description]
	 *
	 * @see    {@link cocosApi.cocosDeviceKey}
	 * @see    {@link cocosApi._getDeviceKey}
	 */
	this.setDeviceKey = function(deviceKey)
	{
		cocosDeviceKey = deviceKey;
		return true;
	};

	/**
	 * [_getApiKey description]
	 *
	 * @method cocosAPI._getApiKey
	 * @access private
	 * @return {String}  [description]
	 *
	 * @see    {@link cocosApi.cocosDeviceKey}
	 * @see    {@link cocosApi.setDeviceKey}
	 */
	var _getDeviceKey = function()
	{
		return cocosDeviceKey;
	}
	

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   ___
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) ( _ )
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  / _ \
	 *     |___/___\___| |_| |___\___/|_|\_| (_) \___/
	* ---------------------------------------------------------------------
	* SETCTION 8: CRUD, Search, Login, Discover
	* ---------------------------------------------------------------------
	*
	* This section contains all the functions that can be used to call the
	* CoCoS API, using CRUD (Create, Read, Update, Delete) functions and/or
	* some extra function like search, login, logout, discover etc.
	*
	* ---------------------------------------------------------------------
	*/

	/**
	 * [create description]
	 *
	 * @method cocosAPI.create
	 * @access public
	 * @param  {String}    library               [description]
	 * @param  {String}    collection            [description]
	 * @param  {String}    [identifier]          [description]
	 * @param  {String}    [association]         [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Object}    [data]                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used to set the function
	 *                                           that must be called when an error occurs. When
	 *                                           no function is given, the default callback-
	 *                                           function, given to the setCallbackError-
	 *                                           function will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used to set the function
	 *                                           that must be called when a call to the CoCoS
	 *                                           API is made. No matter if it was successful or
	 *                                           gave an error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.
	 */
	this.create = function(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		var path = '';

		if(_isset(library))
		{
			path = _appendToPath(path, library);
		}

		if(_isset(collection))
		{
			path = _appendToPath(path, collection);
		}

		if(_isset(identifier))
		{
			if(_isValidIdentifier(identifier))
			{
				path = _appendToPath(path, identifier);

				if(_isset(association))
				{
					path = _appendToPath(path, association);
				}
			}
			else
			{
				_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidIdentifier', [identifier]));
				return false;
			}
		}

		return _post(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
	};

	/**
	 * [_post description]
	 *
	 * @method cocosAPI._post
	 * @access private
	 * @param  {String}    path                  [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Object}    [data]                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occurs. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No matter if it was
	 *                                           successful or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.
	 */
	var _post = function(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult, type, ignoreDebug)
	{
		var rqh = _createRequestHandler(arguments, successFunction, errorFunction, completeFunction, progressFunction, validateResult, null, type);
		return _call(rqh, HTTP_METHOD_POST, path, options, data, ignoreDebug);
	};

	/**
	 * [read description]
	 *
	 * @method cocosAPI.read
	 * @access public
	 * @param  {String}    library               [description]
	 * @param  {String}    collection            [description]
	 * @param  {String}    [identifier]          [description]
	 * @param  {String}    [association]         [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Object}    [data]                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occurs. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No matter if it was
	 *                                           successful or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.
	 */
	this.read = function(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh, ignoreDebug)
	{
		var path = '';

		if(_isset(library))
		{
			path = _appendToPath(path, library);
		}

		if(_isset(collection))
		{
			path = _appendToPath(path, collection);
		}

		if(_isset(identifier))
		{
			if(_isValidIdentifier(identifier))
			{
				path = _appendToPath(path, identifier);

				if(_isset(association))
				{
					path = _appendToPath(path, association);
				}
			}
			else
			{
				_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidIdentifier', [identifier]));
				return false;
			}
		}

		return _get(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh);
	};

		/**
		 * [download description]
		 * @method
		 * @date      2018-07-05
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @param  {[type]} library          [description]
		 * @param  {[type]} collection       [description]
		 * @param  {[type]} identifier       [description]
		 * @param  {[type]} association      [description]
		 * @param  {[type]} options          [description]
		 * @param  {[type]} data             [description]
		 * @param  {[type]} successFunction  [description]
		 * @param  {[type]} errorFunction    [description]
		 * @param  {[type]} completeFunction [description]
		 * @param  {[type]} progressFunction [description]
		 * @param  {[type]} validateResult   [description]
		 * @param  {[type]} rqh              [description]
		 * @return {[type]}                  [description]
		 */
		this.download = function(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh)
		{
			if(!_isObject(options))
			{
				options = {};
			}

			if(!_isset(options[PARAM_DOWNLOAD]) || !_isTrue(options[PARAM_DOWNLOAD]))
			{
				options[PARAM_DOWNLOAD] = true;
			}

			if(_isset(options[PARAM_FORMAT]))
			{
				if(!_inArray(options[PARAM_FORMAT], ALLOWED_RECEIVE_FORMATS))
				{
					_executeCallbackError(errorFunction, _getTextFromLib('receiveFormatError', [options[PARAM_FORMAT], ALLOWED_RECEIVE_FORMATS.join(', ')]));
					return false;
				}
			}

			return this.read(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh);
		};

		/**
		 * { function_description }
		 *
		 * @param      {<type>}    library           The library
		 * @param      {<type>}    collection        The collection
		 * @param      {<type>}    identifier        The identifier
		 * @param      {<type>}    association       The association
		 * @param      {<type>}    options           The options
		 * @param      {<type>}    data              The data
		 * @param      {<type>}    successFunction   The success function
		 * @param      {<type>}    errorFunction     The error function
		 * @param      {<type>}    completeFunction  The complete function
		 * @param      {<type>}    progressFunction  The progress function
		 * @param      {<type>}    validateResult    The validate result
		 * @param      {Function}  rqh               The rqh
		 * @return     {boolean}   { description_of_the_return_value }
		 */
		this.open = function(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh)
		{
			if(!_isObject(options))
			{
				options = {};
			}

			if(!_isset(options[PARAM_DOWNLOAD]) || !_isTrue(options[PARAM_DOWNLOAD]))
			{
				options[PARAM_DOWNLOAD] = true;
			}

			if(_isset(options[PARAM_FORMAT]))
			{
				if(!_inArray(options[PARAM_FORMAT], ALLOWED_RECEIVE_FORMATS))
				{
					_executeCallbackError(errorFunction, _getTextFromLib('receiveFormatError', [options[PARAM_FORMAT], ALLOWED_RECEIVE_FORMATS.join(', ')]));
					return false;
				}
			}

			var path = '';

			if(_isset(library))
			{
				path = _appendToPath(path, library);
			}

			if(_isset(collection))
			{
				path = _appendToPath(path, collection);
			}

			if(_isset(identifier))
			{
				if(_isValidIdentifier(identifier))
				{
					path = _appendToPath(path, identifier);

					if(_isset(association))
					{
						path = _appendToPath(path, association);
					}
				}
				else
				{
					_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidIdentifier', [identifier]));
					return false;
				}
			}

			var usingRequestHeaders = false;

			if(_isTrue(_useRequestHeaders()))
			{
				usingRequestHeaders = true;
				this.disableRequestHeaders();
			}

			var rqh = _createRequestHandler(arguments, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh);

			if(url = _createFullUrl(path, options))
			{
				// Create CORS-request
				//
				var xhr = _createCORSRequest(rqh, HTTP_METHOD_GET, url, options, data);

				if(_isTrue(usingRequestHeaders))
				{
					this.enableRequestHeaders();
				}

				var openUrl = rqh.getRequestUrl();

				window.open(openUrl, '_blank');
			}

			// return this.read(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh, true);
		}

		/**
		 * [description]
		 * @method
		 * @date      2017-07-14
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @param     {[type]}   library          [description]
		 * @param     {[type]}   collection       [description]
		 * @param     {[type]}   identifier       [description]
		 * @param     {[type]}   association      [description]
		 * @param     {[type]}   options          [description]
		 * @param     {[type]}   data             [description]
		 * @param     {[type]}   pollingFrequency [description]
		 * @param     {[type]}   successFunction  [description]
		 * @param     {[type]}   errorFunction    [description]
		 * @param     {[type]}   completeFunction [description]
		 * @param     {[type]}   validateResult   [description]
		 * @param     {[type]}   rqh              [description]
		 * @return    {[type]}                    [description]
		 */
		this.continuousRead = function(library, collection, identifier, association, options, data, pollingFrequency, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh, executeCallbackSuccessOnEmptyResponse, useTimestamp, useId)
		{
			if(typeof(pollingFrequency) != 'number')
			{
				console.error('Invalid pollingFrequency given to continuousRead-function');
				return;
			}

			if(parseInt(pollingFrequency) <= 0)
			{
				if(!_isObject(options))
				{
					options = {};
				}

				if(!_isset(options[PARAM_WAITFORRESULTS]) || !_isTrue(options[PARAM_WAITFORRESULTS]))
				{
					options[PARAM_WAITFORRESULTS] = true;
				}
			}

			var lastSuccesfullResponseWithData = null;
			if(_isset(rqh) && _isFunction(rqh.getLastSuccesfullResponseWithData))
			{
				lastSuccesfullResponseWithData = rqh.getLastSuccesfullResponseWithData();
			}
			else
			{
				firstTime = true;
			}

			if(!_isObject(options))
			{
				options = {};
			}

			if(!_isset(options['q']))
			{
				options['q'] = {}
			}

			if(!_isset(options['q']['timestamp']) && !_isset(options['q']['id']))
			{
				options['q']['timestamp'] = '>@lastResponse.meta.timestamp@';
			}
			else
			{
				if(_isset(options['q']['timestamp']))
				{
					if(options['q']['timestamp'].substring(0, 1) == '>')
					{
						if(!_isset(useTimestamp))
						{
							useTimestamp = options['q']['timestamp'].substring(1);
						}

						options['q']['timestamp'] = '>@lastResponse.meta.timestamp@';
					}
					else if(options['q']['timestamp'] == '*')
					{
						options['q']['timestamp'] = '>@lastResponse.meta.timestamp@';
					}
				}

				if(_isset(options['q']['id']))
				{
					if(_isString(options['q']['id']))
					{
						if(options['q']['id'].substring(0, 1) == '>')
						{
							useId = options['q']['id'].substring(1);
							options['q']['id'] = '>@lastResponse.data[0].data.id@';
						}
					}
				}
			}

			var continuousOptions = {};

			if(_isObject(options))
			{
				// Add options
				for (var key in options)
				{
					if (options.hasOwnProperty(key))
					{
						var value = options[key];

						if(_isObject(value))
						{
							continuousOptions[key] = {};

							//
							for(var vKey in value)
							{
								var vValue = value[vKey];

								if(_isString(vValue))
								{
									if((vValue.indexOf('@lastResponse.meta.timestamp@') !== -1) || (vValue.indexOf('@lastResponse.data[0].data.id@') !== -1))
									{
										if(_isset(lastSuccesfullResponseWithData) && !_isNull(lastSuccesfullResponseWithData) && _isObject(lastSuccesfullResponseWithData))
										{
											var lastTimeStamp = lastSuccesfullResponseWithData.meta.timestamp;
											var lastId = lastSuccesfullResponseWithData.data[0].data.id;

											if(_isset(lastTimeStamp))
											{
												vValue = vValue.replace(/@lastResponse.meta.timestamp@/g, lastTimeStamp);
											}

											if(_isset(lastId))
											{
												vValue = vValue.replace(/@lastResponse.data\[0\].data.id@/g, lastId);
											}
										}
									}
									
									if(vValue.indexOf('@lastResponse.meta.timestamp@') !== -1)
									{
										if(!_isset(useTimestamp))
										{
											//GO CHECK FOR LAST TIMESTAMP FROM PREVIOUS RESPONSE
											//
											if(cososLastRequestTimestamp <= 0)
											{
												var currentTimestamp = (Math.floor(+new Date()/1000));
												vValue = vValue.replace(/@lastResponse.meta.timestamp@/g, currentTimestamp);

												/*
												// I guess we will never get here anymore...	
												//
												var currentTimestamp = (Math.floor(+new Date()/1000));

												this.read(library, collection, null, null, {sort:'-timestamp',limit:1,fields:'timestamp'}, {'q': 'timestamp:>'+currentTimestamp}, function(response)
												{
													var useTimestamp = 0;

													if(_isObject(response.data) && (_objectLength(response.data) > 0) && _isObject(response.data[0]) && _isObject(response.data[0].data) && _isset(response.data[0].data['timestamp']))
													{
														useTimestamp = response.data[0].data['timestamp'];
													}
													else if(_isObject(response.meta) && _isset(response.meta['timestamp']))
													{
														useTimestamp = response.meta['timestamp'];
													}

													if(useTimestamp > 0)
													{
														return this.continuousRead(library, collection, identifier, association, options, data, pollingFrequency, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh, executeCallbackSuccessOnEmptyResponse, useTimestamp);
													}
													else
													{
														_executeCallbackErrorFunction(errorFunction, _getTextFromLib('timestampConflict', [identifier]));

													}
												}.bind(this));

												//
												return false;
												*/
											}
											else
											{
												vValue = vValue.replace(/@lastResponse.meta.timestamp@/g, cososLastRequestTimestamp);
											}
										}
										else
										{
											vValue = vValue.replace(/@lastResponse.meta.timestamp@/g, useTimestamp);
										}
									}
									
									if(vValue.indexOf('@lastResponse.data[0].data.id@') !== -1)
									{
										if(!_isEmpty(useId))
										{
											vValue = vValue.replace(/@lastResponse.data\[0\].data.id@/g, useId);
										}
									}
									
									if(vValue.indexOf('@lastResponse.meta.timestamp@') !== -1)
									{
										// I guess we will never get here anymore...
										//
										var currentTimestamp = (Math.floor(+new Date()/1000));
										vValue = vValue.replace(/@lastResponse.meta.timestamp@/g, currentTimestamp);
									}
									
									if(vValue.indexOf('@lastResponse.data[0].data.id@') !== -1)
									{
										vValue = vValue.replace(/@lastResponse.data\[0\].data.id@/g, '0');
									}
								}

								continuousOptions[key][vKey] = vValue;
							}
						}
						else if(_isString(value))
						{
							if((value.indexOf('@lastResponse.meta.timestamp@') !== -1) || (value.indexOf('@lastResponse.data[0].data.id@') !== -1))
							{
								if(_isset(lastSuccesfullResponseWithData) && !_isNull(lastSuccesfullResponseWithData) && _isObject(lastSuccesfullResponseWithData))
								{
									var lastTimeStamp = lastSuccesfullResponseWithData.meta.timestamp;
									var lastId = lastSuccesfullResponseWithData.data[0].data.id;

									if(_isset(lastTimeStamp))
									{
										value = value.replace(/@lastResponse.meta.timestamp@/g, lastTimeStamp);
									}

									if(_isset(lastId))
									{
										value = value.replace(/@lastResponse.data\[0\].data.id@/g, lastId);
									}
								}
							}
							
							if(value.indexOf('@lastResponse.meta.timestamp@') !== -1)
							{
								if(!_isset(useTimestamp))
								{
									//GO CHECK FOR LAST TIMESTAMP FROM PREVIOUS RESPONSE
									//
									if(cososLastRequestTimestamp <= 0)
									{
										var currentTimestamp = (Math.floor(+new Date()/1000));
										value = value.replace(/@lastResponse.meta.timestamp@/g, cososLastRequestTimestamp);

										// I guess we will never get here anymore...
										//
										/*
										this.read(library, collection, null, null, {sort:'-timestamp',limit:1,fields:'timestamp'}, {'q': 'timestamp:>'+currentTimestamp}, function(response)
										{
											var useTimestamp = 0;

											if(_isObject(response.data) && (_objectLength(response.data) > 0) && _isObject(response.data[0]) && _isObject(response.data[0].data) && _isset(response.data[0].data['timestamp']))
											{
												useTimestamp = response.data[0].data['timestamp'];
											}
											else if(_isObject(response.meta) && _isset(response.meta['timestamp']))
											{
												useTimestamp = response.meta['timestamp'];
											}

											if(useTimestamp > 0)
											{
												this.continuousRead(library, collection, identifier, association, options, data, pollingFrequency, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh, executeCallbackSuccessOnEmptyResponse, useTimestamp);
											}
											else
											{
												_executeCallbackErrorFunction(errorFunction, _getTextFromLib('timestampConflict', [identifier]));

											}
										}.bind(this));

										//
										return false;
										*/
									}
									else
									{
										value = value.replace(/@lastResponse.meta.timestamp@/g, cososLastRequestTimestamp);
									}
								}
								else
								{
									value = value.replace(/@lastResponse.meta.timestamp@/g, useTimestamp);
								}
							}
								
							if(value.indexOf('@lastResponse.data[0].data.id@') !== -1)
							{
								if(!_isEmpty(useId))
								{
									value = value.replace(/@lastResponse.data\[0\].data.id@/g, useId);
								}
							}
								
							if(value.indexOf('@lastResponse.meta.timestamp@') !== -1)
							{
								// I guess we will never get here anymore...
								//
								var currentTimestamp = (Math.floor(+new Date()/1000));
								value = value.replace(/@lastResponse.meta.timestamp@/g, currentTimestamp);
							}

							if(value.indexOf('@lastResponse.data[0].data.id@') !== -1)
							{
								value = value.replace(/@lastResponse.data\[0\].data.id@/g, '0');
							}
							
							continuousOptions[key] = value;
						}
						else
						{
							// Do nothing, just pass through...
							//
							continuousOptions[key] = value;
						}

					}
				}
			}

			return this.read
			(
				library,
				collection,
				identifier,
				association,
				continuousOptions,
				data,

				// continuousRead-succesFunction
				//
				function(response, requestHandler)
				{
					if(_isset(response.meta) && (_isset(response.meta.total, true) && (response.meta.total > 0)) || _isTrue(executeCallbackSuccessOnEmptyResponse))
					{
						requestHandler.resetErrors();
						if(_isFunction(successFunction))
						{
							setTimeout(function()
							{
								successFunction(response, requestHandler);
							}, 0);
						}
						else if(_isFunction(cocosCallbackSuccess))
						{
							setTimeout(function()
							{
								cocosCallbackSuccess(response, requestHandler);
							}, 0);
						}
					}
				},

				// continuousRead-errorFunction
				//
				function(error, response, requestHandler)
				{
					// console.log(requestHandler.handlerId + ' :: continuousRead-error()');

					requestHandler.increaseError();

					if(requestHandler.getErrors() > 3)
					{
						if(_isFunction(errorFunction))
						{
							setTimeout(function()
							{
								errorFunction(error, response, requestHandler);
							}, 0);
						}
						else if(_isFunction(cocosCallbackError))
						{
							setTimeout(function()
							{
								cocosCallbackError(error, response, requestHandler);
							}, 0);
						}
					}
				},

				// continuousRead-completeFunction
				//
				function(response, requestHandler)
				{	
					// console.log(requestHandler.handlerId + ' :: continuousRead-complete()');

					if(_isFunction(completeFunction))
					{
						setTimeout(function()
						{
							completeFunction(response, requestHandler);
						}, 0);
					}
					else if(_isFunction(cocosCallbackComplete))
					{
						setTimeout(function()
						{
							cocosCallbackComplete(response, requestHandler);
						}, 0);
					}

					if(!_isTrue(requestHandler.manuallyAborted()))
					{
						/* Get timeout based on given frequency. The given frequency
						 * can be an integer larger then 500 ms to enable a polling 
						 * request which will be executed 500ms after we got a
						 * response from the API. When the given frequency is set to
						 * 0, we will execute an 'endless-call', which means the
						 * request sent to the API will be pending as long as no
						 * results are available and the maximum timeout isn't
						 * exceeded jet. This means it can take up to 20 or 30
						 * seconds before the API will come up with a result, which
						 * can be an empty result. But it's also possible the API
						 * responds directly (or after a few seconds) when there is
						 * data available, based on the given parameters.
						 */
						var continuousReadTimeout = pollingFrequency;

						/* When using an 'endless-call' (so the pollingFrequency is
						 * set to 0) and errors occurs (network unavailable / server
						 * down) we don't want to try again and again and again
						 * every 0 milliseconds. So to prevent this, we check the
						 * amount of errors occurred and, based on that, we will
						 * increase the 'continuousReadTimeout'-variable when it's
						 * to small.
						 *
						 * So when the timeout is set to 0, but some errors occurs,
						 * the timeout will be increased to give the application
						 * some rest to handle the reconnects calmly...
						 */
						
						/* When more then 100 errors occurs and the time-out based
						 * on the given frequency is below 60.000 ms (60 seconds),
						 * increase the timeout to 60000. So, after 100 errors, the
						 * continuous read will now only be executed once every 60
						 * seconds / once a minute.
						 */
						if((requestHandler.getErrors() > 1000) && (continuousReadTimeout < 60000))
						{
							continuousReadTimeout = 60000;
						}
						
						/* When more then 50 errors occurs and the time-out based
						 * on the given frequency is below 10.000 ms (10 seconds),
						 * increase the timeout to 10000. So, after 50 errors, the
						 * continuous read will now only be executed once every 10
						 * seconds.
						 */
						if((requestHandler.getErrors() > 50) && (continuousReadTimeout < 10000))
						{
							continuousReadTimeout = 10000;
						}
						/* When more then 25 errors occurs and the time-out based
						 * on the given frequency is below 5.000 ms (5 seconds),
						 * increase the timeout to 5000. So, after 25 errors, the
						 * continuous read will now only be executed once every 5
						 * seconds.
						 */
						else if((requestHandler.getErrors() > 25) && (continuousReadTimeout < 5000))
						{
							continuousReadTimeout = 5000;
						}
						/* When more then 10 errors occurs and the time-out based
						 * on the given frequency is below 2.500 ms (2.5 seconds),
						 * increase the timeout to 2500. So, after 10 errors, the
						 * continuous read will now only be executed once every 2.5
						 * seconds.
						 */
						else if((requestHandler.getErrors() > 10) && (continuousReadTimeout < 2000))
						{
							continuousReadTimeout = 2000;
						}
						/* When more then 3 errors occurs and the time-out based
						 * on the given frequency is below 1.000 ms (1 second),
						 * increase the timeout to 1000. So, after 3-errors, the
						 * continuous read will now only be executed once every
						 * second.
						 */
						else if((requestHandler.getErrors() > 3) && (continuousReadTimeout < 1000))
						{
							continuousReadTimeout = 1000;
						}

						/*
						 * When the first error occured and the time-out based on
						 * the given frequency is above 1.000 ms (1 second), go set
						 * the timeout to 1000. So, we don't have to wait very long
						 * before we detect the CoCoS API to be unavailable.
						 */
						else if((requestHandler.getErrors() > 0) && (continuousReadTimeout > 2500))
						{
							continuousReadTimeout = 1000;
						}

						// console.log(requestHandler.handlerId + ' :: next continuousRead in ' + continuousReadTimeout + ' ms.');

						setTimeout(function()
						{
							var goUseTimestamp = null;

							if(_isObject(response))
							{
								if(_isset(response.meta) && _isset(response.meta.total) && (response.meta.total == 0))
								{
									if(_isset(useTimestamp) || (_isTrue(firstTime) && _isset(continuousOptions.q.timestamp)))
									{
										goUseTimestamp = continuousOptions.q.timestamp.replace(/>|<|=/g, '');
									}
								}
							}

							if(!_isTrue(requestHandler.manuallyAborted()))
							{
								if((requestHandler.getHttpStatusCode() != 200) && (requestHandler.getHttpStatusCode() != 207) && (pollingFrequency <= 5000))
								{
									setTimeout(function()
									{
										this.continuousRead(
											library,
											collection,
											identifier,
											association,
											options,
											data,
											pollingFrequency,
											successFunction,
											errorFunction,
											completeFunction,
											progressFunction,
											validateResult,
											requestHandler,
											executeCallbackSuccessOnEmptyResponse,
											goUseTimestamp
										);										
									}.bind(this), 5000);
								}
								else
								{
									this.continuousRead(
										library,
										collection,
										identifier,
										association,
										options,
										data,
										pollingFrequency,
										successFunction,
										errorFunction,
										completeFunction,
										progressFunction,
										validateResult,
										requestHandler,
										executeCallbackSuccessOnEmptyResponse,
										goUseTimestamp
									);
								}
							}
						
						}.bind(this), continuousReadTimeout);
					}
					else
					{
						// continuousRead on frequency (pollingFrequency) aborted!
						// console.log(requestHandler.handlerId + ' :: continuousRead aborted manually!');
					}

				}.bind(this),
				function(progress, requestHandler)
				{
					if(_isFunction(progressFunction))
					{
						setTimeout(function()
						{
							progressFunction(progress, requestHandler);
						}, 0);
					}
					else if(_isFunction(cocosCallbackProgress))
					{
						setTimeout(function()
						{
							cocosCallbackProgress(progress, requestHandler);
						}, 0);
					}
				}.bind(this),
				validateResult,
				rqh
			);
		}

	/**
	 * [search description]
	 *
	 * @method cocosAPI.search
	 * @access public
	 * @param  {String}    library               [description]
	 * @param  {String}    collection            [description]
	 * @param  {String}    [identifier]          [description]
	 * @param  {String}    [association]         [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Object}    [data]                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occurs. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No matter if it was
	 *                                           successful or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.
	 */
	this.search = function(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		var path = '';

		if(_isset(library))
		{
			path = _appendToPath(path, library);
		}

		if(_isset(collection))
		{
			path = _appendToPath(path, collection);
		}

		if(_isset(identifier))
		{
			if(_isValidIdentifier(identifier))
			{
				path = _appendToPath(path, identifier);

				if(_isset(association))
				{
					path = _appendToPath(path, association);
				}
			}
			else
			{
				_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidIdentifier', [identifier]));
				return false;
			}
		}

		path = _appendToPath(path, PATH_SEARCH);

		return _get(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
	};

	/**
	 * [count description]
	 *
	 * @method cocosAPI.count
	 * @access public
	 * @param  {String}    library               [description]
	 * @param  {String}    collection            [description]
	 * @param  {String}    [identifier]          [description]
	 * @param  {String}    [association]         [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Object}    [data]                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occurs. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No matter if it was
	 *                                           successful or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.

	 */
	this.count = function(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		var path = '';

		if(_isset(library))
		{
			path = _appendToPath(path, library);
		}

		if(_isset(collection))
		{
			path = _appendToPath(path, collection);
		}

		if(_isset(identifier))
		{
			if(_isValidIdentifier(identifier))
			{
				path = _appendToPath(path, identifier);

				if(_isset(association))
				{
					path = _appendToPath(path, association);
				}
			}
			else
			{
				_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidIdentifier', [identifier]));
				return false;
			}
		}

		path = _appendToPath(path, PATH_COUNT);

		return _get(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
	};

	/**
	 * [get description]
	 *
	 * @method cocosAPI.get
	 * @access private
	 * @param  {String}    path                  [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Object}    [data]                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occurs. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No matter if it was
	 *                                           successful or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.

	 */
	var _get = function(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh, rqhCallback)
	{
		var rqh = _createRequestHandler(arguments, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh);
		if(_isFunction(rqhCallback))
		{
			rqhCallback(rqh);
		}
		return _call(rqh, HTTP_METHOD_GET, path, options, data);
	};

	/**
	 * [update description]
	 *
	 * @method cocosAPI.update
	 * @access public
	 * @param  {String}    library               [description]
	 * @param  {String}    collection            [description]
	 * @param  {String}    [identifier]          [description]
	 * @param  {String}    [association]         [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Object}    [data]                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occurs. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No matter if it was
	 *                                           successful or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.

	 */
	this.update = function(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		var path = '';

		if(_isset(library))
		{
			path = _appendToPath(path, library);
		}

		if(_isset(collection))
		{
			path = _appendToPath(path, collection);
		}

		if(_isset(identifier))
		{
			if(_isValidIdentifier(identifier))
			{
				path = _appendToPath(path, identifier);

				if(_isset(association))
				{
					path = _appendToPath(path, association);
				}
			}
			else
			{
				_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidIdentifier', [identifier]));
				return false;
			}
		}

		_put(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
	};

	/**
	 * [_put description]
	 *
	 * @method cocosAPI._put
	 * @access private
	 * @param  {String}    path                  [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Object}    [data]                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occurs. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No matter if it was
	 *                                           successful or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.

	 */
	var _put = function(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		var rqh = _createRequestHandler(arguments, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
		return _call(rqh, HTTP_METHOD_PUT, path, options, data);
	};

	/**
	 * [patch description]
	 *
	 * @method cocosAPI.patch
	 * @access public
	 * @param  {String}    library               [description]
	 * @param  {String}    collection            [description]
	 * @param  {String}    [identifier]          [description]
	 * @param  {String}    [association]         [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Object}    [data]                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occurs. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No matter if it was
	 *                                           successful or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.
	 */
	this.patch = function(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		var path = '';

		if(_isset(library))
		{
			path = _appendToPath(path, library);
		}

		if(_isset(collection))
		{
			path = _appendToPath(path, collection);
		}

		if(_isset(identifier))
		{
			if(_isValidIdentifier(identifier))
			{
				path = _appendToPath(path, identifier);

				if(_isset(association))
				{
					path = _appendToPath(path, association);
				}
			}
			else
			{
				_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidIdentifier', [identifier]));
				return false;
			}
		}

		_patch(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
	};

	/**
	 * [_patch description]
	 *
	 * @method cocosAPI._patch
	 * @access private
	 * @param  {String}    path                  [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Object}    [data]                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occurs. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No matter if it was
	 *                                           successful or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.
	 */
	var _patch = function(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		var rqh = _createRequestHandler(arguments, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
		return _call(rqh, HTTP_METHOD_PATCH, path, options, data);
	};

	/**
	 * [remove description]
	 *
	 * @method cocosAPI.remove
	 * @access public
	 * @param  {String}    library               [description]
	 * @param  {String}    collection            [description]
	 * @param  {String}    [identifier]          [description]
	 * @param  {String}    [association]         [description]
	 * @param  {Object}    [options]             [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was successfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occurs. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No matter if it was
	 *                                           successful or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return the
	 *					     created requestHandler, which
	 *					     stores info about the request and
	 *					     the XMLHttpRequest-object.

	 */
	this.remove = function(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		var path = '';

		if(_isset(library))
		{
			path = _appendToPath(path, library);
		}

		if(_isset(collection))
		{
			path = _appendToPath(path, collection);
		}

		if(_isset(identifier))
		{
			if(_isValidIdentifier(identifier))
			{
				path = _appendToPath(path, identifier);

				if(_isset(association))
				{
					path = _appendToPath(path, association);
				}
			}
			else
			{
				_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidIdentifier', [identifier]));
				return false;
			}
		}

		var rqh = _createRequestHandler(arguments, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
		return _call(rqh, HTTP_METHOD_DELETE, path, options, null);
	};


		/**
		 * [flush description]
		 *
		 * @method cocosAPI.flush
		 * @access public
		 * @param  {String}    library               [description]
		 * @param  {String}    collection            [description]
		 * @param  {String}    [identifier]          [description]
		 * @param  {String}    [association]         [description]
		 * @param  {Object}    [options]             [description]
		 * @param  {Function}  [successFunction]     This parameter can be used
		 *					     to set the function that
		 *                                           must be called when the
		 *                                           request was successfully.
		 *                                           WHen no function is given,
		 *                                           the default callback-
		 *                                           function, given to the
		 *                                           setCallbackSuccess-function
		 *                                           will be called.
		 * @param  {Function}  [errorFunction]       This parameter can be used
		 *                                           to set the function that
		 *                                           must be called when an
		 *                                           error occurs. When no
		 *                                           function is given, the
		 *                                           default callback-function,
		 *                                           given to the
		 *                                           setCallbackError-function
		 *                                           will be called.
		 * @param  {Function}  [completeFunction]    This parameter can be used
		 *                                           to set the function that
		 *                                           must be called when a call
		 *                                           to the CoCoS API is made.
		 *                                           No matter if it was
		 *                                           successful or gave an
		 *                                           error.
		 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
		 *                                           possible to tell the
		 *                                           request to validate the
		 *                                           result from the CoCoS API.
		 *                                           This means that the meta-
		 *                                           count value and the amount
		 *                                           of items in the data-object
		 *                                           must be the same size.
		 * @return {requestHandler}                  This function will return the
		 *					     created requestHandler, which
		 *					     stores info about the request and
		 *					     the XMLHttpRequest-object.

		 */
		this.flush = function(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
		{
			if(!_isObject(options))
			{
				options = {};
			}

			if(!_isset(options[PARAM_FLUSH]) || !_isTrue(options[PARAM_FLUSH]))
			{
				options[PARAM_FLUSH] = true;
			}

			return this.remove(library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
		}

	/**
	 * [multi description]
	 * @param  {[type]} method          [description]
	 * @param  {[type]} library          [description]
	 * @param  {[type]} collection       [description]
	 * @param  {[type]} identifier       [description]
	 * @param  {[type]} association      [description]
	 * @param  {[type]} options          [description]
	 * @param  {[type]} data             [description]
	 * @param  {[type]} successFunction  [description]
	 * @param  {[type]} errorFunction    [description]
	 * @param  {[type]} completeFunction [description]
	 * @param  {[type]} progressFunction [description]
	 * @param  {[type]} validateResult   [description]
	 * @return {[type]}                  [description]
	 */
	this.multi = function(method, library, collection, identifier, association, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		// TODO: Mogelijk dat hier in de toekomst nog intelligentie ingebouwd kan worden die
		// ervoor zorgt dat het toch mogelijk is om de opgevraagde requests uit te voeren.
		// Echter dan niet in 1 request, maar gewoon als allemaal losse. Die dan 1 voor 1
		// naar de API worden gestuurd, zodat deze allen in debug-kunnen draaien en de data
		// en opties buiten de headers en body van het request meegstuurd kunnen worden, dus
		// gewoon in de URL, zoals dit wel bij een enkele actie kan.
		// 
		// Onderstaande functies zijn leuk bedacht, maar wanneer er een verzameling van
		// multi-method-request verstuurd moet worden naar de API, dienen deze wel in de
		// juiste volgorde te geschieden. Met onderstaande code wordt het geheel asynchroon
		// afgehandeld.
		// 
		// Dit kan tot problemen leiden wanneer de requests van elkaar afhankelijk zijn.
		// Bijvoorbeeld omdat er eerst een DELETE wordt verstuurd en daarna een POST voor
		// het aanmaken van nieuwe items die (na de DELETE) geen fout op unieke combinaties
		// geven, maar op het moment dat deze uitgevoerd worden voordat de DELETE eerst is
		// afgehandeld, wel met een error terugkomen, waardoor informatie niet goed verwerkt
		// kan worden.
		// 
		// Om dit mogelijk te maken zal er dus een soort handler moeten komen die alle
		// requests van een multi-request sequentieel kan afhandelen. Tevens moet dan ook
		// elk los response worden verzameld, zodat, wanneer alle request na elkaar zijn
		// uitgevoerd, hier weer 1 multi-response (status 207) kan van worden gemaakt, dit
		// dan in 1 keer teruggestuurd kan worden naar de callbackFunctions zoals deze zijn
		// meegegeven aan deze functie.
		// 
		// Hierbij moet tevens rekening gehouden worden dat deze API SDK (apiConnector) één
		// object is waarin acties asynchroon worden uitgevoerd. Het opslaan / onthouden van
		// gegevens in een lokale variabele kan ervoor zorgen dat iets wat bij request A
		// hoort, ineens bij request B terecht komt en vice versa. Er zal dan dus ook een
		// uitbreiding moeten komen op de requestHandler-object (uniek voor elke request),
		// waarom responses opgeslagen kunnen worden, totdat de volledige multi-request is
		// afgehandeld. Daarna pas mag deze alle verzamelde responses combineren tot een
		// multi-response en deze terugsturen. 
		// 
		// Voorlopig is het dus niet mogelijk om een multi-request als debug op te sturen.
		// Deze zal (ondanks de debug-instelling) altijd gewoon worden opgestuurd als een
		// request met de opties in de headers en de data in de body van het request, in
		// plaats van (bij debug mode) alles in de URL als parameter, zodat deze URL als
		// volledige api-call gebruikt kan worden t.b.v. debuggen (denk bijvoorbeeld aan het
		// openen in een nieuw tabblad, zodat hetzelfde request steeds opnieuw uitgevoerd
		// kan worden door even te vernieuwen of [ F5 ] te drukken, in plaats van alle
		// handelingen die leiden tot het request opnieuw uit te voeren in de applicatie.
		// 
		// if(_inDebug())
		// {

			/*
			if(_isObject(data) && !_isEmpty(data))
			{
				if(!_isset(method) || _isEmpty(method))
				{
					_multiMethods(library, collection, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
				}
				else if(!_isset(library) || _isEmpty(library))
				{
					_multiLibraries(method, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
				}
				else if(!_isset(collection) || _isEmpty(collection))
				{
					_multiCollections(method, library, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
				}
				else if(!_isset(collection) || _isEmpty(collection))
				{
					_multiItems(method, library, collection, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
				}
			}
			*/
		// }
		// else
		// {	
			var path = '';

			if(_isset(library))
			{
				path = _appendToPath(path, library);
			}

			if(_isset(collection))
			{
				path = _appendToPath(path, collection);
			}

			if(_isset(identifier))
			{
				if(_isValidIdentifier(identifier))
				{
					path = _appendToPath(path, identifier);

					if(_isset(association))
					{
						path = _appendToPath(path, association);
					}
				}
				else
				{
					_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidIdentifier', [identifier]));
					return false;
				}
			}

			var dataValid = true;

			if(!_isset(method) || _isEmpty(method))
			{
				_loopObject(data, function(method, subData)
				{
					if(!_inArray(method, HTTP_METHODS))
					{
						_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidMultiMethod', [method]));
						dataValid = false;
					}
				});
			}
			else
			{
				var postData = {};
				postData[method] = data;
				data = postData;
			}

			if(_isTrue(dataValid))
			{
				//TODO: Zorgen dat het data-object valide HTTP-methodes als de eerste key
				//bevat. Als deze het niet heeft, dan niet opsturen!
				//
				return _post(path, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult, null, true);
			}

			return null;
		// }
	};

		/**
		 * [_multiMethods description]
		 *
		 * Go loop through data object, finding methods
		 * 
		 * @param  {[type]} library          [description]
		 * @param  {[type]} collection       [description]
		 * @param  {[type]} options          [description]
		 * @param  {[type]} data             [description]
		 * @param  {[type]} successFunction  [description]
		 * @param  {[type]} errorFunction    [description]
		 * @param  {[type]} completeFunction [description]
		 * @param  {[type]} progressFunction [description]
		 * @param  {[type]} validateResult   [description]
		 * @return {[type]}                  [description]
		 */
		var _multiMethods = function(library, collection, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
		{
			_loopObject(data, function(method, subData)
			{
				if(_inArray(method, HTTP_METHODS))
				{
					if(_isset(library) && !_isEmpty(library))
					{
						if(_isset(collection) && !_isEmpty(collection))
						{
							if(!_isset(subData.meta) && !_isset(subData.data))
							{
								_multiItems(method, library, collection, options, subData, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
							}
							else
							{
								var identifier = '';
								if(_isset(subData.meta.identifier))
								{
									identifier = subData.meta.identifier;
								}

								var itemData = {};
								if(_isset(subData.data) && _isObject(subData.data))
								{
									itemData = subData.data;
								}

								_multiItem(method, library, collection, identifier, options, itemData, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
							}
						}
						else
						{
							_multiCollections(method, library, options, subData, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
						}
					}
					else
					{
						_multiLibraries(method, options, subData, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
					}
				}
				else
				{
					_executeCallbackErrorFunction(errorFunction, _getTextFromLib('invalidMultiMethod', [method]));
					return false;
				}
			});
		}
		
		/**
		 * [_multiLibraries description]
		 *
		 * Go loop through data object, finding libraries
		 * 
		 * @param  {[type]} method           [description]
		 * @param  {[type]} options          [description]
		 * @param  {[type]} data             [description]
		 * @param  {[type]} successFunction  [description]
		 * @param  {[type]} errorFunction    [description]
		 * @param  {[type]} completeFunction [description]
		 * @param  {[type]} progressFunction [description]
		 * @param  {[type]} validateResult   [description]
		 * @return {[type]}                  [description]
		 */
		var _multiLibraries = function(method, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
		{
			_loopObject(data, function(library, subData)
			{
				_multiCollections(method, library, options, subData, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
			});
		}

		/**
		 * [_multiCollections description]
		 * 
		 * Go loop through data object, finding collections
		 * 
		 * @param  {[type]} method           [description]
		 * @param  {[type]} library          [description]
		 * @param  {[type]} options          [description]
		 * @param  {[type]} data             [description]
		 * @param  {[type]} successFunction  [description]
		 * @param  {[type]} errorFunction    [description]
		 * @param  {[type]} completeFunction [description]
		 * @param  {[type]} progressFunction [description]
		 * @param  {[type]} validateResult   [description]
		 * @return {[type]}                  [description]
		 */
		var _multiCollections = function(method, library, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
		{
			_loopObject(data, function(collection, subData)
			{
				_multiItems(method, library, collection, options, subData, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
			});
		}

		/**
		 * [_multiItems description]
		 * @param  {[type]} method           [description]
		 * @param  {[type]} library          [description]
		 * @param  {[type]} collection       [description]
		 * @param  {[type]} options          [description]
		 * @param  {[type]} data             [description]
		 * @param  {[type]} successFunction  [description]
		 * @param  {[type]} errorFunction    [description]
		 * @param  {[type]} completeFunction [description]
		 * @param  {[type]} progressFunction [description]
		 * @param  {[type]} validateResult   [description]
		 * @return {[type]}                  [description]
		 */
		var _multiItems = function(method, library, collection, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
		{
			_loopObject(data, function(item, subData)
			{
				var identifier = '';
				var itemData = {};
				if(_isset(subData.meta) || _isset(subData.data))
				{
					if(_isset(subData.meta.identifier))
					{
						identifier = subData.meta.identifier;
					}

					if(_isset(subData.data) && _isObject(subData.data))
					{
						itemData = subData.data;
					}
				}
				else
				{
					itemData = subData;
				}

				_multiItem(method, library, collection, '', options, subData, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
			});
		}

		/**
		 * [_multiItem description]
		 * @param  {[type]} method           [description]
		 * @param  {[type]} library          [description]
		 * @param  {[type]} collection       [description]
		 * @param  {[type]} identifier       [description]
		 * @param  {[type]} options          [description]
		 * @param  {[type]} data             [description]
		 * @param  {[type]} successFunction  [description]
		 * @param  {[type]} errorFunction    [description]
		 * @param  {[type]} completeFunction [description]
		 * @param  {[type]} progressFunction [description]
		 * @param  {[type]} validateResult   [description]
		 * @return {[type]}                  [description]
		 */
		var _multiItem = function(method, library, collection, identifier, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
		{
			switch(method)
			{
				case HTTP_METHOD_POST:
					this.create(library, collection, identifier, '', options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
					break;

				case HTTP_METHOD_GET:
					this.read(library, collection, identifier, '', options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
					break;

				case HTTP_METHOD_PUT:
					this.update(library, collection, identifier, '', options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
					break;

				case HTTP_METHOD_PATCH:
					this.patch(library, collection, identifier, '', options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
					break;

				case HTTP_METHOD_DELETE:
					this.remove(library, collection, identifier, '', options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
					break;
			}
		}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {number}  rangeStart        The range start
	 * @param      {<type>}  rangeEnd          The range end
	 * @param      {<type>}  fileSize          The file size
	 * @param      {<type>}  uploadId          The upload identifier
	 * @param      {<type>}  data              The data
	 * @param      {<type>}  successFunction   The success function
	 * @param      {<type>}  errorFunction     The error function
	 * @param      {<type>}  completeFunction  The complete function
	 * @param      {<type>}  progressFunction  The progress function
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	var _upload = function(rangeStart, rangeEnd, fileSize, idUpload, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		var rqh = _createRequestHandler(arguments, successFunction, errorFunction, completeFunction, progressFunction, validateResult, null, REQUEST_TYPE_UPLOAD);
		rqh.setUploadContentRange(rangeStart, rangeEnd, fileSize);

		var options = {
			idUpload: idUpload
		};

		if(rangeStart === 0)
		{
			return _call(rqh, HTTP_METHOD_POST, PATH_UPLOAD, options, data, true);
		}
		else
		{
			return _call(rqh, HTTP_METHOD_PUT, PATH_UPLOAD, options, data, true);
		}
	};

	/**
	 * [loginWithUsernamePassword description]
	 *
	 * @method cocosAPI.loginWithUsernamePassword
	 * @access public
	 * @param  {String}    username         [description]
	 * @param  {String}    password         [description]
	 * @param  {Function}  successFunction  This parameter can be used to
	 *					set the function that must be
	 *					called when the request was
	 *					succesfully. WHen no function is
	 *					given, the default callback-
	 *					function, given to the
	 *					setCallbackSuccess-function will
	 *					be called.
	 * @param  {Function}  errorFunction    This parameter can be used to
	 *					set the function that must be
	 *					called when an error occures.
	 *					WHen no function is given, the
	 *					default callback-function, given
	 *					to the setCallbackError-function
	 *					will be called.
	 * @param  {Function}  completeFunction This parameter can be used to
	 *					set the function that must be
	 *					called when a call to the CoCoS
	 *					API is made. No mather if it was
	 *					succesfull or gave an error.
	 * @return {requestHandler}             This function will return the
	 *					created requestHandler, which
	 *					stores info abour the request and
	 *					the XMLHttpRequest-object.
	 */
	this.loginWithUsernamePassword = function(username, password, successFunction, errorFunction, completeFunction, progressFunction)
	{
		return this.loginWithUsernamePasswordPincode(username, password, null, successFunction, errorFunction, completeFunction, progressFunction);
	}
		
	/**
	 * { function_description }
	 *
	 * @param      {<type>}  username          The username
	 * @param      {<type>}  password          The password
	 * @param      {<type>}  pincode           The pincode
	 * @param      {<type>}  successFunction   The success function
	 * @param      {<type>}  errorFunction     The error function
	 * @param      {<type>}  completeFunction  The complete function
	 * @param      {<type>}  progressFunction  The progress function
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	this.loginWithUsernamePasswordPincode = function(username, password, pincode, successFunction, errorFunction, completeFunction, progressFunction)
	{
		return _login(username, password, pincode, null, null, successFunction, errorFunction, completeFunction, progressFunction)
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  pincode           The pincode
	 * @param      {<type>}  successFunction   The success function
	 * @param      {<type>}  errorFunction     The error function
	 * @param      {<type>}  completeFunction  The complete function
	 * @param      {<type>}  progressFunction  The progress function
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	this.loginWithPincode = function(pincode, successFunction, errorFunction, completeFunction, progressFunction)
	{
		return this.loginWithUsernamePasswordPincode(null, null, pincode, successFunction, errorFunction, completeFunction, progressFunction);
	}

	/**
	 * [loginWithUsernamePasswordVerifier description]
	 *
	 * @method cocosAPI.loginWithUsernamePasswordVerifier
	 * @access public
	 * @param  {String}    username         [description]
	 * @param  {String}    password         [description]
	 * @param  {String}    verifier         [description]
	 * @param  {Function}  successFunction  This parameter can be used to
	 *					set the function that must be
	 *					called when the request was
	 *					succesfully. WHen no function is
	 *					given, the default callback-
	 *					function, given to the
	 *					setCallbackSuccess-function will
	 *					be called.
	 * @param  {Function}  errorFunction    This parameter can be used to
	 *					set the function that must be
	 *					called when an error occures.
	 *					WHen no function is given, the
	 *					default callback-function, given
	 *					to the setCallbackError-function
	 *					will be called.
	 * @param  {Function}  completeFunction This parameter can be used to
	 *					set the function that must be
	 *					called when a call to the CoCoS
	 *					API is made. No mather if it was
	 *					succesfull or gave an error.
	 * @return {requestHandler}             This function will return the
	 *					created requestHandler, which
	 *					stores info abour the request and
	 *					the XMLHttpRequest-object.
	 */
	this.loginWithUsernamePasswordVerifier = function(username, password, verifier, successFunction, errorFunction, completeFunction, progressFunction)
	{
		return _login(username, password, null, null, verifier, successFunction, errorFunction, completeFunction, progressFunction)
	}

	/**
	 * [loginWithToken description]
	 *
	 * @method cocosAPI.loginWithToken
	 * @access public
	 * @param  {String}    token            [description]
	 * @param  {Function}  successFunction  This parameter can be used to
	 *					set the function that must be
	 *					called when the request was
	 *					succesfully. WHen no function is
	 *					given, the default callback-
	 *					function, given to the
	 *					setCallbackSuccess-function will
	 *					be called.
	 * @param  {Function}  errorFunction    This parameter can be used to
	 *					set the function that must be
	 *					called when an error occures.
	 *					WHen no function is given, the
	 *					default callback-function, given
	 *					to the setCallbackError-function
	 *					will be called.
	 * @param  {Function}  completeFunction This parameter can be used to
	 *					set the function that must be
	 *					called when a call to the CoCoS
	 *					API is made. No mather if it was
	 *					succesfull or gave an error.
	 * @return {requestHandler}             This function will return the
	 *					created requestHandler, which
	 *					stores info abour the request and
	 *					the XMLHttpRequest-object.
	 */
	this.loginWithToken = function(token, successFunction, errorFunction, completeFunction, progressFunction)
	{
		return _login(null, null, null, token, null, successFunction, errorFunction, completeFunction, progressFunction)
	}

	/**
	 * [login description]
	 *
	 * @method cocosAPI.login
	 * @access private
	 * @param  {String}    username         [description]
	 * @param  {String}    password         [description]
	 * @param  {String}    token            [description]
	 * @param  {String}    verifier         [description]
	 * @param  {Function}  successFunction  This parameter can be used to
	 *					set the function that must be
	 *					called when the request was
	 *					succesfully. WHen no function is
	 *					given, the default callback-
	 *					function, given to the
	 *					setCallbackSuccess-function will
	 *					be called.
	 * @param  {Function}  errorFunction    This parameter can be used to
	 *					set the function that must be
	 *					called when an error occures.
	 *					WHen no function is given, the
	 *					default callback-function, given
	 *					to the setCallbackError-function
	 *					will be called.
	 * @param  {Function}  completeFunction This parameter can be used to
	 *					set the function that must be
	 *					called when a call to the CoCoS
	 *					API is made. No mather if it was
	 *					succesfull or gave an error.
	 * @return {requestHandler}             This function will return the
	 *					created requestHandler, which
	 *					stores info abour the request and
	 *					the XMLHttpRequest-object.
	 */
	var _login = function(username, password, pin, token, verifier, successFunction, errorFunction, completeFunction, progressFunction)
	{
		data = {};
		if(_isset(username) && _isset(password))
		{
			data['username'] = username.toString();
			data['password'] = password.toString();
		}

		if(_isset(pin))
		{
			data['pin'] = pin.toString();
		}

		if(_isset(token))
		{
			data['token'] = token.toString();
		}

		if(_isset(verifier))
		{
			data['verifier'] = verifier.toString();
		}

		return _post(PATH_LOGIN, null, data, successFunction, errorFunction, completeFunction, progressFunction);
	}

	/**
	 * [logout description]
	 *
	 * @method cocosAPI.logout
	 * @access public
	 * @param  {Function}  successFunction  This parameter can be used to
	 *					set the function that must be
	 *					called when the request was
	 *					succesfully. WHen no function is
	 *					given, the default callback-
	 *					function, given to the
	 *					setCallbackSuccess-function will
	 *					be called.
	 * @param  {Function}  errorFunction    This parameter can be used to
	 *					set the function that must be
	 *					called when an error occures.
	 *					WHen no function is given, the
	 *					default callback-function, given
	 *					to the setCallbackError-function
	 *					will be called.
	 * @param  {Function}  completeFunction This parameter can be used to
	 *					set the function that must be
	 *					called when a call to the CoCoS
	 *					API is made. No mather if it was
	 *					succesfull or gave an error.
	 * @return {requestHandler}             This function will return the
	 *					created requestHandler, which
	 *					stores info abour the request and
	 *					the XMLHttpRequest-object.
	 */
	this.logout = function(successFunction, errorFunction, completeFunction, progressFunction)
	{
		return _post(PATH_LOGOUT, null, null, successFunction, errorFunction, completeFunction, progressFunction);
	}

	/**
	 * This function can be used to check if a user is logged in. If not,
	 * the returned userId will be -1.
	 *
	 * @example
	 * cocosAPI.authorize(function(data){ }, function(error){ }, function(){ });

	 * @method cocosAPI.authorize
	 * @access public
	 * @param  {Function}  successFunction  This parameter can be used to
	 *					set the function that must be
	 *					called when the request was
	 *					succesfully. WHen no function is
	 *					given, the default callback-
	 *					function, given to the
	 *					setCallbackSuccess-function will
	 *					be called.
	 * @param  {Function}  errorFunction    This parameter can be used to
	 *					set the function that must be
	 *					called when an error occures.
	 *					WHen no function is given, the
	 *					default callback-function, given
	 *					to the setCallbackError-function
	 *					will be called.
	 * @param  {Function}  completeFunction This parameter can be used to
	 *					set the function that must be
	 *					called when a call to the CoCoS
	 *					API is made. No mather if it was
	 *					succesfull or gave an error.
	 * @return {requestHandler}             This function will return the
	 *					created requestHandler, which
	 *					stores info abour the request and
	 *					the XMLHttpRequest-object.
	 */
	this.authorize = function(successFunction, errorFunction, completeFunction, progressFunction)
	{
		var options = null;

		// Deprecated
		// 
		// if(_isTrue(_deployOnAuthorize()))
		// {
		// 	options = {};
		// 	options[PARAM_DEPLOY] = true;
		// }
		return _get(PATH_AUTH, options, null, successFunction, errorFunction, completeFunction, progressFunction);
	}

	/**
	 * [status description]
	 *
	 * @method cocosAPI.status
	 * @access public
	 * @param  {Function}  successFunction  This parameter can be used to
	 *					set the function that must be
	 *					called when the request was
	 *					succesfully. WHen no function is
	 *					given, the default callback-
	 *					function, given to the
	 *					setCallbackSuccess-function will
	 *					be called.
	 * @param  {Function}  errorFunction    This parameter can be used to
	 *					set the function that must be
	 *					called when an error occures.
	 *					WHen no function is given, the
	 *					default callback-function, given
	 *					to the setCallbackError-function
	 *					will be called.
	 * @param  {Function}  completeFunction This parameter can be used to
	 *					set the function that must be
	 *					called when a call to the CoCoS
	 *					API is made. No mather if it was
	 *					succesfull or gave an error.
	 * @param  {Function}  progressFunction This parameter can be used to
	 *					set the function that must be
	 *					called to report the progress
	 *					about the call that is made onto
	 *					the CoCoS API.
	 */
	this.status = function(successFunction, errorFunction, completeFunction, progressFunction)
	{
		return this.advancedStatus(null, null, successFunction, errorFunction, completeFunction, progressFunction);
	}

	/**
	 * [advancedStatus description]
	 *
	 * @method cocosAPI.advancedStatus
	 * @access public
	 * @param  {<type>}    options           The options
	 * @param  {<type>}    data              The data
	 * @param  {Function}  successFunction  This parameter can be used to
	 *					set the function that must be
	 *					called when the request was
	 *					succesfully. WHen no function is
	 *					given, the default callback-
	 *					function, given to the
	 *					setCallbackSuccess-function will
	 *					be called.
	 * @param  {Function}  errorFunction    This parameter can be used to
	 *					set the function that must be
	 *					called when an error occures.
	 *					WHen no function is given, the
	 *					default callback-function, given
	 *					to the setCallbackError-function
	 *					will be called.
	 * @param  {Function}  completeFunction This parameter can be used to
	 *					set the function that must be
	 *					called when a call to the CoCoS
	 *					API is made. No mather if it was
	 *					succesfull or gave an error.
	 * @param  {Function}  progressFunction This parameter can be used to
	 *					set the function that must be
	 *					called to report the progress
	 *					about the call that is made onto
	 *					the CoCoS API.
	 */
	this.advancedStatus = function(options, data, successFunction, errorFunction, completeFunction, progressFunction)
	{
		return _get(PATH_STATUS, options, data, successFunction, errorFunction, completeFunction, progressFunction, false, null, function(rqh)
		{
			// rqh.sentApiKey = false;
			// rqh.sentAccessToken = false;
		});
	}

	/**
	 * [discover description]
	 *
	 * @method cocosAPI.discover
	 * @access public
	 * @param  {String}    library               [description]
	 * @param  {String}    collection            [description]
	 * @param  {String}    expand                [description]
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was succesfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occures. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No mather if it was
	 *                                           succesfull or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return
	 *                                           the created XMLHttpRequest-
	 *                                           object.
	 */
	this.discover = function(library, collection, expand, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		return this.advancedDiscover(library, collection, expand, null, null, successFunction, errorFunction, completeFunction, progressFunction, validateResult);
	};

	// We once thought we wouldn't have use the options and/or data parameters when executing a
	// discover-request on the CoCoS API, so these parameter where left out of the call of the
	// .discover()-function. Unfortunately, on 2018-08-15, this turned out to be the case. Extra
	// options were needed to send with the discover-request, but this wasn't possible, because
	// the .discover()-function didn't provide in such functionality, the intentionally left out
	// parameter turned out to be necessary in retrospect.
	// 
	// In order to be backwards-compatible, the current .discover()-function was left intact and
	// a new .advancedDiscover()-function was created who now does also provide the parameters
	// options and data. For now, only options is needed, but who knows... So, in order to use
	// the discover like all other functions in this CoCoS API SDK, the .advancedDiscover() has
	// to be used. The .discover()-function is a simple one, which will call this function also,
	// but with the options- and data-parameters left blank, so this function will still works
	// as it used to be,  so that all previous written code can remain unchanged.
	// 
	this.advancedDiscover = function(library, collection, expand, options, data, successFunction, errorFunction, completeFunction, progressFunction, validateResult)
	{
		var url = '';

		if(!_isObject(options))
		{
			options = {};
		}

		if(_isset(library))
		{
			if(_isset(collection))
			{
				url += '/'+library+'/'+collection;
				url += PATH_DISCOVER;
			}
			else
			{
				url += '/'+library;
				url += PATH_DISCOVER;
				if((expand === true) || (expand === 1))
				{
					options[PARAM_EXPAND] = 'fields';
				}
			}
		}
		else
		{
			url += PATH_DISCOVER;
			if((expand === true) || (expand === 1))
			{
				options[PARAM_EXPAND] = 'collections';
			}
			else if(expand === 2)
			{
				options[PARAM_EXPAND] = 'collections(fields)';
			}
		}

		if(!_isset(options[PARAM_METAFIELDS]))
		{
			options[PARAM_METAFIELDS] = true;
		}

		var rqh = _createRequestHandler(arguments, successFunction, errorFunction, completeFunction, progressFunction, validateResult);

		return _call(rqh, HTTP_METHOD_GET, url, options, data);
	}

	/**
	 * [getFileHash description]
	 * @param  {[type]} file             [description]
	 * @param  {[type]} uniqueId         [description]
	 * @param  {[type]} successFunction  [description]
	 * @param  {[type]} errorFunction    [description]
	 * @param  {[type]} progressFunction [description]
	 * @return {[type]}                  [description]
	 */
	this.getFileHash = function(file, uniqueId, successFunction, errorFunction, progressFunction)
	{
		setTimeout(function()
		{
			var reader = new FileReader();

			reader.onload = function()
			{
				if(_isFunction(progressFunction))
				{
					progressFunction(100, uniqueId);
				}

				if(_isFunction(successFunction))
				{
					var fileHash = md5(reader.result);
					successFunction(fileHash, uniqueId);
				}
			};

			reader.onerror = function()
			{
				if(_isFunction(errorFunction))
				{
					errorFunction(uniqueId);
				}
			};

			reader.onloadstart = function(evt)
			{
				if(_isFunction(progressFunction))
				{
					progressFunction(0, uniqueId);
				}
			}

			reader.onprogress = function(evt)
			{
				if(_isFunction(progressFunction))
				{
					// evt is an ProgressEvent.
					if (evt.lengthComputable)
					{
		      				var percentLoaded = ((evt.loaded / evt.total)*100);
		      				progressFunction(percentLoaded, uniqueId);
		      			}
		      		}
			}

			if(_isFunction(progressFunction))
			{
				progressFunction(0, uniqueId);
			}

			reader.readAsArrayBuffer(file);
		}, 1);
	}

	/**
	 * [getFileChecksum description]
	 * @param  {[type]} file             [description]
	 * @param  {[type]} uniqueId         [description]
	 * @param  {[type]} successFunction  [description]
	 * @param  {[type]} errorFunction    [description]
	 * @param  {[type]} progressFunction [description]
	 * @return {[type]}                  [description]
	 */
	this.getFileChecksum = function(file, uniqueId, successFunction, errorFunction, progressFunction)
	{
		setTimeout(function()
		{
			var reader = new FileReader();

			reader.onload = function()
			{
				if(_isFunction(progressFunction))
				{
					progressFunction(100, uniqueId);
				}

				if(_isFunction(successFunction))
				{
					var fileHash = md5(reader.result);
					var fileName = file['name'];

					// https://stackoverflow.com/questions/882727/is-there-a-way-to-use-variable-keys-in-a-javascript-object-literal
					var fileChecksumObject = {};
					fileChecksumObject[DATA_KEY_UPLOAD_FILENAME] = fileName;
					fileChecksumObject[DATA_KEY_UPLOAD_FILEHASH] = fileHash;

					var fileChecksum = btoa(JSON.stringify(fileChecksumObject));
					successFunction(fileChecksum, fileHash, uniqueId);
				}
			};

			reader.onerror = function()
			{
				if(_isFunction(errorFunction))
				{
					errorFunction(uniqueId);
				}
			};

			reader.onloadstart = function(evt)
			{
				if(_isFunction(progressFunction))
				{
					progressFunction(0, uniqueId);
				}
			}

			reader.onprogress = function(evt)
			{
				if(_isFunction(progressFunction))
				{
					// evt is an ProgressEvent.
					if (evt.lengthComputable)
					{
		      				var percentLoaded = ((evt.loaded / evt.total)*100);
		      				progressFunction(percentLoaded, uniqueId);
		      			}
		      		}
			}

			if(_isFunction(progressFunction))
			{
				progressFunction(0, uniqueId);
			}

			reader.readAsArrayBuffer(file);
		}, 1);
	}

	/**
	 * [description]
	 * @method
	 * @author    S.vanBuren
	 * @copyright (concera
	 * @param     {[type]} file             [description]
	 * @param     {[type]} uploadKey        [description]
	 * @param     {[type]} successFunction  [description]
	 * @param     {[type]} errorFunction    [description]
	 * @param     {[type]} completeFunction [description]
	 * @return    {[type]}                  [description]
	 */
	this.upload = function(file, fileChecksum, successFunction, errorFunction, completeFunction, progressFunction)
	{
		var fileChecksumObject = JSON.parse(atob(fileChecksum));
		
		if(!_isObject(fileChecksumObject) || !_isset(fileChecksumObject[DATA_KEY_UPLOAD_FILENAME]) || !_isset(fileChecksumObject[DATA_KEY_UPLOAD_FILEHASH]))
		{
			console.error('Error uploading file - given fileChecksum invalid. Please make sure the given fileChecksum is created by the getFileChecksum-function in the CoCoS API Javascript SDK.');
		}
		else
		{
			var fileName = fileChecksumObject[DATA_KEY_UPLOAD_FILENAME];
			var fileHash = fileChecksumObject[DATA_KEY_UPLOAD_FILEHASH];

			if(file['name'] != fileName)
			{
				console.error('Error uploading file - Given file and fileName from fileChecksum don\t match. Please make sure the given fileChecksum is created by the getFileChecksum-function in the CoCoS API Javascript SDK and the right file-object is given.');
			}
			else
			{
				this.getFileHash(file, '', function(fileHashByFile)
				{
					if(fileHashByFile != fileHash)
					{
						console.error('Error uploading file - Hash of given file and fileHash from fileChecksum don\t match. Please make sure the given fileChecksum is created by the getFileChecksum-function in the CoCoS API Javascript SDK and the right file-object is given.');
					}
					else
					{
						var data = {};

						if(_isset(fileChecksum))
						{
							data[DATA_KEY_UPLOAD_CHECKSUM] = fileChecksum;
						}

						if(_isset(fileName))
						{
							data[DATA_KEY_UPLOAD_FILENAME] = fileName;
						}

						if(_isset(fileHash))
						{
							data[DATA_KEY_UPLOAD_FILEHASH] = fileHash;
						}

						// First, go post the file, so it will be registered
						// in the database.
						//
						_post
						(
							PATH_SAVE_UPLOAD,
							null,
							data,

							// successFunction for upload-post
							function(response)
							{
								if(_isObject(response) && _isObject(response.data) && _isObject(response.data[0]) && _isObject(response.data[0].data) && isset(response.data[0].data.id))
								{
									var idFile = response.data[0].data.id;

									var uploader = new ChunkedUploader
									(
										file,

										// uploadFunction for chunkedUploader
										function(contentRangeStart, contentRangeEnd, fileSize, idUpload, data, uploadSuccessFunction, uploadErrorFunction, uploadCompleteFunction, uploadProgressFunction)
										{
											_upload(contentRangeStart, contentRangeEnd, fileSize, idUpload, data, uploadSuccessFunction, uploadErrorFunction, uploadCompleteFunction, uploadProgressFunction);
										},

										// successFunction for chunkedUploader
										function(response, requestHandler)
										{
											idUpload = response.data[0].data.idUpload;

											_patch
											(
												_appendToPath(PATH_SAVE_UPLOAD, idFile),
												null,
												{
													idUpload: idUpload
												},

												// successFunction for upload-patch
												successFunction,

												// errorFunction for upload-patch
												function(error, response, requestHandler)
												{
													progressFunction(100, requestHandler);
													errorFunction(error, response, requestHandler);
												},

												// completeFunction for upload-patch
												completeFunction,

												// progressFunction for upload-patch
												function(progress, requestHandler)
												{
													var uploadProgress = (95 + ((progress/100) *5) );
													progressFunction(uploadProgress, requestHandler);
												}
											);

										},

										// errorFunction for chunkedUploader
										function(error, response, requestHandler)
										{
											progressFunction(100, requestHandler);
											errorFunction(error, response, requestHandler);

										},

										// completeFunction for chunkedUploader
										null,

										// progressFunction for chunkedUploader
										function(progress, requestHandler)
										{
											var uploadProgress = (5 + ( (progress/100) * 90 ) );
											progressFunction(uploadProgress, requestHandler);
										}
									);

									uploader.start();
									return false;
								}

							},

							// errorFunction for upload-post
							function(error, response, requestHandler)
							{
								progressFunction(100, requestHandler);
								errorFunction(error, response, requestHandler);
							},

							// completeFunction for upload-post
							completeFunction,

							// progressFunction for upload-post
							function(progress, requestHandler)
							{		
								var uploadProgress = (0 + ( (progress/100) * 5 ) );
								progressFunction(uploadProgress, requestHandler);
							}
						);
					}
				});
			}
				
		}
	};

	/**
	 * { function_description }
	 *
	 * @class      ChunkedUploader (name)
	 * @param      {<type>}    file              The file
	 * @param      {Function}  uploadFunction    The upload function
	 * @param      {Function}  successFunction   The success function
	 * @param      {Function}  errorFunction     The error function
	 * @param      {<type>}    completeFunction  The complete function
	 * @param      {Function}  progressFunction  The progress function
	 */
	var ChunkedUploader = function(file, uploadFunction, successFunction, errorFunction, completeFunction, progressFunction)
	{
		var _uploadFunction = uploadFunction;
		var _successFunction = successFunction;
		var _errorFunction = errorFunction;
		var _completeFunction = completeFunction;
		var _progressFunction = progressFunction;

		var _file = file;

	    	var _is_paused = false;
	 
		var _file_size = file.size;
		var _chunk_size = (1024 * 1024); // 1MB
		var _range_start = 0;
		var _range_end = _chunk_size;
		var _uploadId = '';

		var _slice_method = 'slice';
	 
		if ('mozSlice' in _file)
		{
			_slice_method = 'mozSlice';
		}
	    	else if('webkitSlice' in _file)
	    	{
			_slice_method = 'webkitSlice';
		}
	 
	// Event Handlers ____________________________________________________
	 
	    	var _onChunkComplete = function(response, requestHandler)
	    	{
	    		var idUpload = '';

	    		if(_isObject(response) && _isObject(response.meta) && _isset(response.meta.result) && _isTrue(response.meta.result) && _isObject(response.data) && _isObject(response.data[0]) && _isObject(response.data[0].data))
			{
				var uploadedSize = response.data[0].data.fileSize;

				// If the end range is already the same size as our file, we
				// can assume that our last chunk has been processed and exit
				// out of the function.
	        		if (_range_end === _file_size)
	        		{
	        			if(uploadedSize === _file_size)
	        			{
	        				if(_isFunction(_successFunction))
	        				{
	        					// Go call the given successFunction for the
	        					// given requestHandler when the full upload
	        					// was completed and all chunks are succes-
	        					// fully sent to the CoCoS API.
	        					//
	        					_successFunction(response, requestHandler);
	        				}
	        			}
	        		}
	        		else
	        		{	
					idUpload = response.data[0].data.idUpload;

	        			if(_range_start === 0)
	        			{
						_uploadId = idUpload;
	        			}
	        			else if(_uploadId !== idUpload)
	        			{
	        				_uploadId = '';
	        			}

	        			if((_uploadId !== null) && (_uploadId !== ''))
			        	{
						// Update the ranges for the next loop.
						//
						_range_start = _range_end;
						_range_end = _range_start + _chunk_size;

						// Continue as long as we aren't paused
						//
						if (!_is_paused)
						{
							setTimeout
							(
								function()
								{
									// When the whole file isn't
									// uploaded yet, go call
									// this function again. With
									// the new calculated start-
									// and end-ranges. The next
									// part of the file will be
									// uploaded
									//
									_upload();
								},
								50
							);
						}
					}
	        		}
	        	}
	        	else
	        	{
	        		// 
				_errorFunction(_getTextFromLib('responseInvalid'), response, requestHandler);
	        	}
	    	};
	 
	// Internal Methods __________________________________________________
	 
		var _upload = function()
		{
			var chunk;
	 
			// Slight timeout needed here (File read / AJAX readystate conflict?)
	        	setTimeout
	        	(
				function()
		        	{
		            		// Prevent range overflow
		            		if (_range_end > _file_size)
		            		{
		                		_range_end = _file_size;
		            		}

		            		chunk = _file[_slice_method](_range_start, _range_end);

		            		if(_isFunction(_uploadFunction))
		            		{
		            			_uploadFunction
		            			(
		            			 	_range_start,
		            			 	_range_end,
		            			 	_file_size,
		            			 	_uploadId,
		            			 	chunk,
		            			 	function(response)
				            		{
				            			_onChunkComplete(response, requestHandler);
				            		},
				            		function(error, response, requestHandler)
				            		{
				            			if(isFunction(_errorFunction))
				            			{
				            				_errorFunction(error, response, requestHandler);
				            			}
				            		},
				            		function()
				            		{
				            		},
				            		function(progress, requestHandler)
				            		{
									var _range_progress = (_range_start + ( (progress/100) * (_range_end - _range_start) ) );
									var chunkProgress = ((_range_progress / _file_size) * 100);

				        				if(_isFunction(_progressFunction))
				        				{
				        					_progressFunction(chunkProgress, requestHandler);
				        				}
				            		}
				            	);
					}
		        	},
		        	1
	        	);
	    	};
	 
	// Public Methods ____________________________________________________
	 
	    	this.start = function()
	    	{
	        	_upload();
	    	};
	 
	    	this.pause = function()
	    	{
	        	_is_paused = true;
	    	};
	 
	    	this.resume = function()
	    	{
	        	_is_paused = false;
	        	_upload();
	    	};

	};

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   ___
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) / _ \
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  \_, /
	 *     |___/___\___| |_| |___\___/|_|\_| (_)  /_/
	* ---------------------------------------------------------------------
	* SETCTION 9: The actual request
	* ---------------------------------------------------------------------
	*
	* This section has the function to build and execute the actual request
	* that will be sent to the CoCos API.
	*
	* ---------------------------------------------------------------------
	*/

	/**
	 * [_createRequest description]
	 *
	 * @method cocosAPI._createRequest
	 * @access private
	 * @param  {Function}  [successFunction]     This parameter can be used
	 *					     to set the function that
	 *                                           must be called when the
	 *                                           request was succesfully.
	 *                                           WHen no function is given,
	 *                                           the default callback-
	 *                                           function, given to the
	 *                                           setCallbackSuccess-function
	 *                                           will be called.
	 * @param  {Function}  [errorFunction]       This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when an
	 *                                           error occures. When no
	 *                                           function is given, the
	 *                                           default callback-function,
	 *                                           given to the
	 *                                           setCallbackError-function
	 *                                           will be called.
	 * @param  {Function}  [completeFunction]    This parameter can be used
	 *                                           to set the function that
	 *                                           must be called when a call
	 *                                           to the CoCoS API is made.
	 *                                           No mather if it was
	 *                                           succesfull or gave an
	 *                                           error.
	 * @param  {Boolean}  [validateResult=true]  With this boolean, it's
	 *                                           possible to tell the
	 *                                           request to validate the
	 *                                           result from the CoCoS API.
	 *                                           This means that the meta-
	 *                                           count value and the amount
	 *                                           of items in the data-object
	 *                                           must be the same size.
	 * @return {requestHandler}                  This function will return
	 *                                           an requestHandler-object.
	 */
	var _createRequestHandler = function(apiConnectorCall, successFunction, errorFunction, completeFunction, progressFunction, validateResult, rqh, type)
	{
		var requestId = _createRequestId();
			
		if(!_isset(rqh))
		{
			var rqh = new requestHandler(requestId);
			rqh.saveRequestCall(apiConnectorCall);
		}
		else
		{
			rqh.reset(requestId);
		}

		if(_isFunction(successFunction))
		{
			rqh.setCallbackSuccess(successFunction);
		}
		else if(_isFunction(cocosCallbackSuccess))
		{
			rqh.setCallbackSuccess(cocosCallbackSuccess, true);
		}

		if(_isFunction(errorFunction))
		{
			rqh.setCallbackError(errorFunction);
		}
		else if(_isFunction(cocosCallbackError))
		{
			rqh.setCallbackError(cocosCallbackError, true);
		}

		if(_isFunction(completeFunction))
		{
			rqh.setCallbackComplete(completeFunction);
		}
		else if(_isFunction(cocosCallbackComplete))
		{
			rqh.setCallbackComplete(cocosCallbackComplete, true);
		}

		if(_isFunction(progressFunction))
		{
			rqh.setCallbackProgress(progressFunction);
		}
		else if(_isFunction(cocosCallbackProgress))
		{
			rqh.setCallbackProgress(cocosCallbackProgress, true);
		}

		if(_isFalse(validateResult))
		{
			rqh.disableResultValidation();
		}

		if(_isset(type))
		{
			rqh.setType(type);
		}

		rqh.setProtocol(_getProtocol());
		rqh.setHost(_getHost());
		rqh.setPath(_getPath());

		return rqh;
	}

	// Counter for unique identifier generation
	//
	var requestCounter=0;

	/**
	 * [_createRequestId description]
	 *
	 * @method cocosAPI._createRequestId
	 * @return {String}                  [description]
	 */
	function _createRequestId()
	{
		// Increase counter
		requestCounter = parseInt(requestCounter)+1;

		// Create the 'base' of the requestId, it will always start with a C (for CoCoS),
		// followed by the counter, JS (for JavaScript) and end with a X, followed by some
		// random chars.
		// 
		// So, for example, the requestId C7JSXBJJ1FP99OP32LJ2 will be the 7th request, and
		// C2981JSX37FZUMM4FCJ6 will be the 2981th one from the CoCoS JS SDK.
		// 
		requestId = 'C'+requestCounter+'JSX';

		return _fillOutString(requestId, 20);
	};

	// Counter for unique identifier generation
	//
	var handlerCounter=0;

	/**
	 * Creates a handler identifier.
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function _createHandlerId()
	{
		// Increase counter
		handlerCounter = parseInt(handlerCounter)+1;

		// Create the 'base' of the handlerId, it will always start with a H (for Handler),
		// followed by the counter and end with a X, followed by some
		// random chars.
		// 
		// So, for example, the handlerId C7JSXBJJ1FP99OP32LJ2 will be the 7th request, and
		// C2981JSX37FZUMM4FCJ6 will be the 2981th one from the CoCoS JS SDK.
		// 
		handlerId = 'H'+handlerCounter+'X'

		return _fillOutString(handlerId, 20);
	}

	/**
	 * { function_description }
	 *
	 * @param      {string}  string  The string
	 * @param      {number}  length  The length
	 */
	function _fillOutString(string, length)
	{
		var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

		// To make sure it's absolutely impossible to return the same
		// requestId twice, we add some random numbers between 1 and 9
		// as long as the length of the ID is below 10.
		//
		// The output will be something like: 123.23748964 for request-
		// counter 123.
		//
    		while (string.length < length)
		{
			// string = string + Math.round((Math.random()*8)+1);
			string = string + possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
		}

		return string;
	}

	/**
	 * [_createFullUrl description]
	 *
	 * @method cocosAPI._createFullUrl
	 * @param  {String}  urlPart  [description]
	 * @return {String}           [description]
	 */
	function _createFullUrl(urlPart, options)
	{
		var url = '';

		var protocol = _getProtocol();
		if(!_isset(protocol))
		{
			_executeCallbackError(null, _getTextFromLib('noProtocol'));
			return false;
		}

		var host = _getHost();

		if(!_isset(host))
		{
			_executeCallbackError(null, _getTextFromLib('noHost'));
			return false;
		}

		var path = _getPath();
		if(!_isset(path))
		{
			_executeCallbackError(null, _getTextFromLib('noPath'));
			return false;
		}

		var fullPath = _appendToPath(path, urlPart);
		fullPath = fullPath.replace(/\/{2,}$/, '/');

		// Append host and path to URL
		//
		url = protocol+'//'+host+fullPath;

		// options = {
		//	q: 'action(1,4),status(1,2),id>07d09602d52e48a1e9cc45a9b748e9881818118',
		// }

		// options = {
		//	q: {
		//		action: [ 1, 4 ],
		//		status: [ 1, 2 ],
		//		id: '>07d09602d52e48a1e9cc45a9b748e9881818118',
		//	}
		// }
		// 
		// [ options ] = {
		// 	[ param ] : [ value ]
		// 	{
		// 		[ vKey ] : [ vValue ],
		// 		[ vKey ] : [ vValue ],
		// 		etc.
		// 	}
		// }
		// 

		// Loop through the object given object.
		//
		if(_isObject(options) && !_isEmpty(options))
		{
			for(var param in options)
			{
				if(param != PARAM_FORMAT)
				{
					var value = options[param];
					value = _parseValueForOption(value);
					url = _appendToUrl(url, param, value);

				}
			}
		}

		return url;
	}

	/**
	 * { function_description }
	 *
	 * @param      {(string|string[])}  value   The value
	 * @return     {(string|string[])}  { description_of_the_return_value }
	 */
	var _parseValueForOption = function(value)
	{
		if(_isObject(value))
		{
			//
			var valueArray = [];

			//
			for(var vKey in value)
			{
				var vValue = value[vKey];

				if(_isArray(vValue))
				{
					if(vValue.length > 1)
					{
						valueArray.push(vKey+'('+vValue.join(',')+')');
					}
					else
					{
						valueArray.push(vKey+':'+vValue[0]);
					}
				}
				else if(_isObject(vValue))
				{
					valueArray.push(vKey+'('+_parseValueForOption(vValue)+')');
				}
				else
				{
					valueArray.push(vKey+':'+vValue);
				}
			}

			return valueArray.join(',');
		}
		else
		{
			return value;
		}
	}

	/**
	 * [_createXMLHTTPObject description]
	 * @method    _createXMLHTTPObject
	 * @date      2012-09-24
	 * @author    S.vanBuren
	 * @copyright (concera
	 * @return    {[type]}            [description]
	 */
	var _createXMLHTTPObject = function()
	{
		//ajax object possibilities.
		var XMLHttpFactories = [
			function () {return new XMLHttpRequest()},
			function () {return new ActiveXObject("Msxml2.XMLHTTP")},
			function () {return new ActiveXObject("Msxml3.XMLHTTP")},
			function () {return new ActiveXObject("Microsoft.XMLHTTP")}
		];

		var xmlHttpObject = false;

		for (var i=0;i<XMLHttpFactories.length;i++)
		{
			try
			{
				xmlHttpObject = XMLHttpFactories[i]();
			}
			catch (err)
			{
				continue;
			}
			break;
		}

		return xmlHttpObject;
	};

	/**
	 * Cross-Origin Resource Sharing (CORS) is a W3C spec that allows
	 * cross-domain communication from the browser. By building on top
	 * of the XMLHttpRequest object, CORS allows developers to work
	 * with the same idioms as same-domain requests.
	 * // http://www.html5rocks.com/en/tutorials/cors/
	 *
	 * @method cocosAPI._createCORSRequest
	 * @access private
	 * @param  {requestHandler}  rqh  [description]
	 * @param  {String}          method   HTTP method ('GET', 'POST',
	 *                                    'DELETE', etc.)
	 * @param  {String}          url      [description]
	 * @param  {object}          data     [description]
	 * @return {XMLHttpRequest}  	      This function will return the
	 *                                    created XMLHttpRequest-object.
	 */
	var _createCORSRequest = function(rqh, method, url, options, data, ignoreDebug)
	{
		var callWithCredentials = false;

		// Start with creating and XMLHttpRequest
		// 
		var xhr = new XMLHttpRequest();

		// Check for the 'withCredentials' in the XMLHttpRequest, so we know we have to deal
		// with an XMLHttpRequest2 object (XMLHttpRequest Level 2)
		//
		if(_isset(xhr.withCredentials))
		{
			// Check if the XMLHttpRequest object has a 'withCredentials' property
			// 'withCredentials' only exists on XMLHTTPRequest2 objects.
			//
			callWithCredentials = true;

			rqh.setRequestType(REQUEST_OBJECT_XMLHTTP2);
		}
		else
		{
			if(location.host == _getHost())
			{
				xhr = _createXMLHTTPObject();
				rqh.setRequestType(REQUEST_OBJECT_XMLHTTP);
				
				if(method == HTTP_METHOD_PATCH)
				{
					url = _appendToUrl(url, PARAM_METHOD, HTTP_METHOD_PATCH);
					method = HTTP_METHOD_PUT;
				}
			}
			else if (typeof XDomainRequest != 'undefined')
			{
				// Otherwise, check if the XDomainRequest-object is available. The
				// XDomainRequest only exists in IE, and is IE's way of making CORS
				// requests.
				//
				xhr = new XDomainRequest();
				if(_isFunction(xhr.setRequestHeader))
				{
					xhr = new XMLHttpRequest();
				}

				// XDomainRequest doesn't support methods like PUT, PATCH and DELETE
				// so, all other methods then POST and GET will be converted to a
				// POST, appending the requested method to the URL, so the CoCoS API
				// knows what action to do.
				// 
				if((method != HTTP_METHOD_POST) && (method != HTTP_METHOD_GET))
				{
					url = _appendToUrl(url, PARAM_METHOD, method.toUpperCase());
					method = HTTP_METHOD_POST;
				}

				rqh.setRequestType(REQUEST_OBJECT_XDOMAIN);
			}
			else
			{
				// Check if URL of host of this file / site and the host from the
				// url are the same. If so, we'll be able to execute a request... If
				// not it won't be possible to create / execute a XMLHttpRequest /
				// XDomainRequest which can be used to call the requested URL.
				// 
				xhr = null;
			}
		}

		if(xhr !== null)
		{
			if(rqh.isUpload())
			{
				method = HTTP_METHOD_POST;
			}
			else if(!_useHttpMethods() && !_isTrue(ignoreDebug))
			{
				if(method.toUpperCase() != HTTP_METHOD_GET)
				{
					url = _appendToUrl(url, PARAM_METHOD, method.toUpperCase());
				}
				method = HTTP_METHOD_GET;
			}

			if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)))
			{
				// Create variable for headers
				//
				var headers = {};

				headers['X-Requested-With'] = 'xmlHttpRequest';
			}

			if(rqh.isUpload())
			{
				// No handling data when upload
				// 
				headers['Content-Type'] = 'application/octet-stream';

				var uploadContentRange = rqh.getUploadContentRange();

				if(_isObject(uploadContentRange))
				{
					headers['Content-Range'] = 'bytes ' + uploadContentRange['start'] + '-' + uploadContentRange['end'] + '/' + uploadContentRange['size'];
				}
			}
			else if(_isset(data) && (_objectLength(data) > 0))
			{
				// At this point, when we have a GET-request (Read), we will not
				// send any data with the request (as payload). All options and 
				// data will be sent in the URL. This is because the CoCoS API
				// currently doesn't support data / payload being sent with a GET
				// request.
				// 
				if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)) && (method != HTTP_METHOD_GET))
				{
					// Check in which format we send the data and add to header
					//
					switch(_getFormatSend())
					{
						case 'json':
							headers['Content-Type'] = 'application/json';
							break;
					}
				}
				else
				{	
					if(((rqh.getRequestType() == REQUEST_OBJECT_XMLHTTP) || (rqh.getRequestType() == REQUEST_OBJECT_XDOMAIN)) && (method != HTTP_METHOD_GET))
					{
						// Check in which format we send the data and add to header
						//
						switch(_getFormatSend())
						{
							case 'json':
								url = _appendToUrl(url, PARAM_CONTENT_TYPE, 'application/json');
								break;
						}
					}
					else
					{
						for(var param in data)
						{
							url = _appendToUrl(url, param, data[param]);
						}
					}
				}
			}

			// Append API key to header or URL (if apiKey is available))
			//
			if(_isTrue(rqh.sentApiKey) && (_getApiKey() != ''))
			{
				if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)))
				{
					headers[HEADER_APIKEY] = _getApiKey();
				}
				else
				{
					url = _appendToUrl(url, PARAM_APIKEY, _getApiKey());
				}
			}

			var accessToken = _getAccessToken();

			// Append token to header or URL (if token is available)
			//
			if(_isTrue(rqh.sentAccessToken) && (!_isEmpty(accessToken)))
			{
				if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)))
				{
					headers[HEADER_ACCESS_TOKEN] = accessToken;
				}
				else
				{
					url = _appendToUrl(url, PARAM_ACCESS_TOKEN, accessToken);
				}
			}

			var deviceKey = _getDeviceKey();

			// Append deviceKey to header or URL (if deviceKey is available)
			//
			if(!_isEmpty(deviceKey))
			{
				if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)))
				{
					headers[HEADER_DEVICE_KEY] = deviceKey;
				}
				else
				{
					url = _appendToUrl(url, PARAM_DEVICE_KEY, deviceKey);
				}
			}

			if(_inDebug() && !_isTrue(ignoreDebug))
			{
				url = _appendToUrl(url, PARAM_DEBUG, 'true');
			}

			var format = '';
			if(_isObject(options) && _isset(options[PARAM_FORMAT]))
			{
				format = options[PARAM_FORMAT];
			}
			else
			{
				format = _getFormatReceive();
			}

			// Check in which format we want to receive the data and add to URL
			//
			switch(format.toLowerCase())
			{
				case 'json':

					if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)))
					{
						headers['Accept'] = 'application/json';
					}
					else
					{
						url = _appendToUrl(url, PARAM_FORMAT, 'json');
					}
					break;

				case 'xml':

					if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)))
					{
						headers['Accept'] = 'application/xml';
					}
					else
					{
						url = _appendToUrl(url, PARAM_FORMAT, 'xml');
					}
					break;

				case 'yaml':

					if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)))
					{
						headers['Accept'] = 'text/yaml';
					}
					else
					{
						url = _appendToUrl(url, PARAM_FORMAT, 'yaml');
					}
					break;

				case 'yml':

					if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)))
					{
						headers['Accept'] = 'text/yaml';
					}
					else
					{
						url = _appendToUrl(url, PARAM_FORMAT, 'yml');
					}
					break;

				case 'csv':

					if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)))
					{
						headers['Accept'] = 'text/csv';
					}
					else
					{
						url = _appendToUrl(url, PARAM_FORMAT, 'csv');
					}
					break;

				/*
				case 'php':

					if(_isFunction(xhr.setRequestHeader) && _useRequestHeaders())
					{
						headers['Accept'] = 'text/php';
					}
					else
					{
						url = _appendToUrl(url, PARAM_FORMAT, 'php');
					}
					break;

				case 'txt':

					if(_isFunction(xhr.setRequestHeader) && _useRequestHeaders())
					{
						headers['Accept'] = 'text/plain';
					}
					else
					{
						url = _appendToUrl(url, PARAM_FORMAT, 'txt');
					}
					break;
				*/
			}

			rqh.setFormat(format.toLowerCase());

			if(!_isNull(_getLanguage()))
			{
				url = _appendToUrl(url, PARAM_LANGUAGE, _getLanguage());
			}

			if(!_isNull(_getDataLanguage()))
			{
				url = _appendToUrl(url, PARAM_DATALANGUAGE, _getDataLanguage());
				rqh.setLanguage(_getDataLanguage());
			}

			// When in debug or method isn't GET... append timestamp to the URL to prevent cached calls and
			// set cache-control header
			// 
			if(_inDebug() || (method != HTTP_METHOD_GET))
			{
				url = _appendToUrl(url, '_t=', new Date().getTime() + '.' + Math.round(100000+(Math.random()*899999)));
				if(_isFunction(xhr.setRequestHeader) && (_useRequestHeaders() || _isTrue(ignoreDebug)))
				{
					headers['Cache-Control'] = 'no-cache';
				}
			}

			//
			_logToConsole('Go ' + method + ' on ' + url, rqh.getRequestId());

			//
			url = _appendToUrl(url, '_requestId', rqh.getRequestId()); 

			// Set stuff
			// 
			rqh.setRequestMethod(method);
			rqh.setRequestUrl(url);
			rqh.setRequestHeaders(headers);

			// console.log("Calling URL " + rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath() + " for rqh: " + rqh.handlerId);

			try
			{
				if(callWithCredentials)
				{
					xhr.open(method, url, true);
					xhr.withCredentials = true;
				}
				else
				{
					xhr.open(method, url);
				}

				// Append headers to xhrRequest
				//
				for(var header in headers)
				{
					xhr.setRequestHeader(header, headers[header]);
				}

				if(_isObject(options) && _isset(options[PARAM_DOWNLOAD]) && _isTrue(options[PARAM_DOWNLOAD]))
				{
					xhr.responseType = 'blob';
				}


				// Return XMLHttpRequest / XDomainRequest
				return xhr;
			}
			catch(e)
			{
				_handleError(rqh, e, xhr, '_createCORSRequest#3122');
			}
		}

		return null;

	};

	/**
	 * [call description]
	 *
	 * @method cocosAPI._call
	 * @access private
	 * @param  {requestHandler} rqh        [description]
	 * @param  {String}         method     [description]
	 * @param  {String}         url        [description]
	 * @param  {Object}         [options]  [description]
	 * @param  {Object}         [data]     [description]
	 * @return {requestHandler}             This function will return the
	 *					created requestHandler, which
	 *					stores info abour the request and
	 *					the XMLHttpRequest-object.

	 */
	var _call = function(rqh, method, url, options, data, ignoreDebug)
	{
		// Check if ok
		// 
		if(!_isOk())
		{
			// Return requestHandlerObject when not ok
			// 
			return rqh;
		}

		// Check protocol
		// 
		if((_getProtocol() == 'http:') && (window.location.protocol == 'https:'))
		{
			_executeCallbackError(rqh, _getTextFromLib('blockedRequest'));

			// Return requestHandlerObject when not ok
			// 
			return rqh;
		}

		if(_getCookie(COOKIE_NAME_COOKIES) != btoa('allowed'))
		{
			var now = ((Date.now ? Date.now() : new Date().getTime()) / 1e3);
			var writeCookieValue = btoa(now);

			// Set cookie
			_setCookie(COOKIE_NAME_COOKIES, writeCookieValue, '', _getCookiePath(), '');

			// Get cookie
			var readCookieValue = _getCookie(COOKIE_NAME_COOKIES);

			if(readCookieValue != writeCookieValue)
			{
				_executeCallbackError(rqh, _getTextFromLib('cookiesDisabled', [rqh.getHost()]));

				// Return requestHandlerObject when not ok
				// 
				return rqh;
			}
			else
			{
				_setCookie(COOKIE_NAME_COOKIES, btoa('allowed'), '', _getCookiePath());
			}
		}
		
		if(_getHost() !== window.location.host)
		{
			if(_getCookie(COOKIE_NAME_CROSS_DOMAIN_COOKIES) != btoa('allowed'))
			{
				var thirdPartyAllowed = _getCookie(COOKIE_NAME_CROSS_DOMAIN_COOKIES);
					
				if((thirdPartyAllowed != 'check') && (thirdPartyAllowed != 'verify'))
				{
					var session1 = '';
					var session2 = '';
					
					_setCookie(COOKIE_NAME_CROSS_DOMAIN_COOKIES, 'check', '', _getCookiePath());
					
					_get('/session', null, null, function(response)
					{
						session1 = response.data[0].data.session;
						_setCookie(COOKIE_NAME_CROSS_DOMAIN_COOKIES, 'verify', '', _getCookiePath());

						_get('/session', null, null, function(response)
						{
							session2 = response.data[0].data.session;

							if(session2 != session1)
							{
								_executeCallbackError(rqh, _getTextFromLib('crossDomeinCookiesDisabled', [rqh.getHost()]));

								// Return requestHandlerObject when not ok
								// 
								return rqh;
							}
							else
							{
								_setCookie(COOKIE_NAME_CROSS_DOMAIN_COOKIES, btoa('allowed'), '', _getCookiePath());
								_call(rqh, method, url, options, data);
							}
						});
					});

					return xhr;
				}
			}
		}

		if(url = _createFullUrl(url, options))
		{
			// Create CORS-request
			//
			var xhr = _createCORSRequest(rqh, method, url, options, data, ignoreDebug);

			// if((_isset(options[PARAM_EXTENDSESSION]) && _isFalse(options[PARAM_EXTENDSESSION])) || (_isset(options[PARAM_WAITFORRESULTS]) && _isTrue(options[PARAM_WAITFORRESULTS])))
			// {
			// 	??
			// }

			if (!xhr)
			{
				throw new Error(_getTextFromLib('unsupportedCORS'));
			}
			else
			{
				rqh.setHttpStatusCode(HTTP_STATUS_CODE_NONE);
				rqh.setHttpReadyState(READY_STATE_UNSENT);

				// Check for xhr.onload function (xmlHttpRequest2)
				//
				if(typeof(xhr.onload) !== 'undefined')
				{	
					// Response handlers.
					//
					xhr.onload = function(e)
					{
						if(_isTrue(_handleRequest('onload', xhr, rqh)))
						{
							if(xhr.status == HTTP_STATUS_CODE_MULTISTATUS)
							{
								_logToConsole('Received httpStatusCode: ' + xhr.status + ' from ' + method + ' on ' + rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath(), rqh.getRequestId(), rqh.getDuration());

								if(_isObject(options) && _isset(options[PARAM_DOWNLOAD]) && _isTrue(options[PARAM_DOWNLOAD]))
								{
									_handleDownload(rqh, xhr.response, xhr);
								}
								else
								{
									_handleMultiResponse(rqh, xhr.responseText, xhr);
								}
							}
							else if(xhr.status == HTTP_STATUS_CODE_OK)
							{
								_logToConsole('Received httpStatusCode: ' + xhr.status + ' from ' + method + ' on ' + rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath(), rqh.getRequestId(), rqh.getDuration());

								if(_isObject(options) && _isset(options[PARAM_DOWNLOAD]) && _isTrue(options[PARAM_DOWNLOAD]))
								{
									_handleDownload(rqh, xhr.response, xhr);
								}
								else
								{
									// Handle response
									//
									_handleResponse(rqh, xhr.responseText, xhr);
								}
							}
							else
							{
								_logToConsole('Received httpStatusCode: ' + xhr.status + ' from ' + method + ' on ' + rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath(), rqh.getRequestId(), rqh.getDuration());

								// Handle error
								//
								_handleError(rqh, '', xhr, '_call#3221');
							}
						}

					};

					// Response handlers.
					//
					xhr.onerror = function()
					{
						_logToConsole('Received httpStatusCode: ' + xhr.status + ' from ' + method + ' on ' + rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath(), rqh.getRequestId(), rqh.getDuration(), rqh.getDuration());

						if(_isTrue(_handleRequest('onerror', xhr, rqh)))
						{
							// Handle error
							//
							_handleError(rqh, '', xhr, '_call#3250');
						}
					};
				}
				else
				{
					// Response handlers.
					//
					xhr.onreadystatechange = function()
					{
						if(_isTrue(_handleRequest('onreadystatechange', xhr, rqh)))
						{
							if(xhr.status == HTTP_STATUS_CODE_MULTISTATUS)
							{
								_logToConsole('Received httpStatusCode: ' + xhr.status + ' from ' + method + ' on ' + rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath(), rqh.getRequestId(), rqh.getDuration());

								if(_isObject(options) && _isset(options[PARAM_DOWNLOAD]) && _isTrue(options[PARAM_DOWNLOAD]))
								{
									_handleDownload(rqh, xhr.response, xhr);
								}
								else
								{
									_handleMultiResponse(rqh, xhr.responseText, xhr);
								}
							}
							else if(xhr.status == HTTP_STATUS_CODE_OK)
							{
								_logToConsole('Received httpStatusCode: ' + xhr.status + ' from ' + method + ' on ' + rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath(), rqh.getRequestId(), rqh.getDuration());

								if(_isObject(options) && _isset(options[PARAM_DOWNLOAD]) && _isTrue(options[PARAM_DOWNLOAD]))
								{
									_handleDownload(rqh, xhr.response, xhr);
								}
								else
								{
									// Handle response
									//
									_handleResponse(rqh, xhr.responseText, xhr);
								}
							}
							else
							{
								_logToConsole('Received httpStatusCode: ' + xhr.status + ' from ' + method + ' on ' + rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath(), rqh.getRequestId(), rqh.getDuration());
								
								// Handle error
								//
								_handleError(rqh, '', xhr, '_call#3289');
							}
						}
					};
				}

				// Get timeout for request
				// 
				var requestTimeout = _getTimeout();

				// Report progress
				//
				var reportProgress = true;
				if((url.indexOf(PARAM_WAITFORRESULTS+'=true') > -1) || (url.indexOf(PARAM_WAITFORRESULTS+'=1') > -1))
				{
					reportProgress = false;

					// Set pending timeout as timeout when the
					// request seems to be a pending request...
					// 
					requestTimeout = _getPendingTimeout();

					//
					rqh.setEndlessRequest();
				}
				else if(_isTrue(rqh.isUpload()))
				{
					//
					xhr.upload.onprogress = function(evt)
					{
						_executeCallbackProgress(evt, rqh, xhr);
					}
				}
				else
				{
					//
					xhr.onprogress = function(evt)
					{
						_executeCallbackProgress(evt, rqh, xhr);
					}
				}

				// Check data
				// 
				if(_isset(data))
				{
					if(_isFalse(rqh.isUpload()))
					{
						// Check in which format we send the data and add to
						// the header
						//
						switch(_getFormatSend())
						{
							case 'json':

								data = JSON.stringify(data);

								break;

							default:
								data = '';
						}

						if(_isset(data) && !_isEmpty(data))
						{
							rqh.setRequestData(data);
						}
					}
				}

				if(reportProgress)
				{
					_executeCallbackProgress(0, rqh, xhr);
				}

				if((requestTimeout > 0) && (_isFalse(rqh.isUpload())))
				{
					rqh.setTimeout(requestTimeout);

					// Set timeout to XMLHttpRequest
					//
					xhr.timeout = (requestTimeout*1000);
					
					// _logToConsole('Using max duration of ' + (requestTimeout*1000) + 'ms for request', rqh.getRequestId());

					_clearRequestAbortTimer();
					cocosRequestAbortTimer = setTimeout(function()
					{
						// GO SET TIMEOUT ON RQH!
						rqh.timeout();
					}, ((requestTimeout*1000)-100));
					
					// Add timeout-callback to XMLHttpRequest
					//
					xhr.ontimeout = function ()
					{
						rqh.timeout();

						if(_isTrue(_handleRequest('ontimeout', xhr, rqh)))
						{
							_logToConsole('Got timeout after ' + rqh.duration() + ' from ' + method + ' on ' + rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath(), rqh.getRequestId());

							//
							_handleError(rqh, _getTextFromLib('errorConnectTimeout', [rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath(), requestTimeout]), xhr, '_call#3353');
						}
					};
				}

				// Sent XMLHttpRequest- or XDomainRequest-object to requestHandler
				rqh.setRequestObject(xhr);

				// Start requestHandler
				rqh.start();

				try
				{
					if(!_isNull(data))
					{
						xhr.send(data);
					}
					else
					{
						xhr.send();
					}

					if(reportProgress)
					{
						_executeCallbackProgress(0, rqh, xhr);
					}
				}
				catch(e)
				{
					if(_isTrue(_handleRequest('onerror', xhr, rqh)))
					{
						_handleError(rqh, e, xhr, '_call#3362');
					}
				}

				return rqh;
			}
		}

		return rqh;
	};

	/**
	 * [_handleRequest description]
	 * @param  {Function} callback [description]
	 * @param  {[type]}   xhr      [description]
	 * @param  {[type]}   rqh      [description]
	 * @return {[type]}            [description]
	 */
	var _handleRequest = function(callback, xhr, rqh)
	{
		if((callback == 'onerror') || (callback == 'ontimeout'))
		{
			_endRequest(xhr, rqh);

			// Check if request was aborted by user / application. If not, the error was
			// triggered due to an XMLHttpRequest / XDomainRequest, so we must go and
			// handle the response / the error.
			// 
			if(_isFalse(rqh.manuallyAborted()))
			{
				if(rqh.getRequestType !== REQUEST_OBJECT_XDOMAIN)
				{
					if((_getProtocol() == 'https:') && (((typeof(xhr.status) !== 'undefined') && (typeof(xhr.status) !== 'unknown')) && (xhr.status == 0)))
					{
						error = _getTextFromLib('errorInsecureResponse', [rqh.getProtocol()+'//'+rqh.getHost()+'/']);
						_handleError(rqh, error, xhr, '_call#3324');
						return false;
					}
				}
				
				_handleHttpStatusCode(xhr, rqh);

				if(callback == 'onerror')
				{
					// 
					headers = _handleHeaders(xhr, rqh);
				}

				return true;
			}
		}
		else
		{
			// Check if request was aborted by user / application. If so, we will stop
			// the handling of the response. No callbacks will be executed.
			// 
			if(_isFalse(rqh.manuallyAborted()))
			{
				// Only continue if requestType is XDomainRequest of XMLHttpRequest has readyState
				// and readyState = 4. Both indicates the request is done.
				// 
				if((rqh.getRequestType() == REQUEST_OBJECT_XDOMAIN) || (_isset(xhr.readyState) && (xhr.readyState == READY_STATE_DONE)))
				{
					_endRequest(xhr, rqh);

					_handleHttpStatusCode(xhr, rqh);

					// 
					headers = _handleHeaders(xhr, rqh);

					return true;
				}
				else if(rqh.getRequestType !== REQUEST_OBJECT_XDOMAIN)
				{
					if((_getProtocol() == 'https:') && (((typeof(xhr.status) !== 'undefined') && (typeof(xhr.status) !== 'unknown')) && (xhr.status == 0)))
					{
						error = _getTextFromLib('errorInsecureResponse', [rqh.getProtocol()+'//'+rqh.getHost()+'/']);
						_handleError(rqh, error, xhr, '_call#3324');
					}
				}
			}
			else
			{
				// Mark request as ended and be done.
				// 
				_endRequest(xhr, rqh);
			}
		}
	
		return false;
	}

	/**
	 * [_endRequest description]
	 * @param  {[type]} rqh [description]
	 * @return {[type]}     [description]
	 */
	var _endRequest = function(xhr, rqh)
	{
		// Clear timeout for request-abort
		// 
		_clearRequestAbortTimer();

		// Mark the end of the request in the requestHandler
		// 
		rqh.end();
	}

	/**
	 * [_handleHttpStatusCode description]
	 * @param  {[type]} xhr [description]
	 * @param  {[type]} rqh [description]
	 * @return {[type]}     [description]
	 */
	var _handleHttpStatusCode = function(xhr, rqh)
	{
		// if(rqh.timedOut())
		// {
		//	rqh.setHttpStatusCode(HTTP_STATUS_CODE_REQUESTTIMEOUT);
		// }
		// else
		if((typeof(xhr.status) !== 'undefined') && (typeof(xhr.status) !== 'unknown'))
		{
			rqh.setHttpStatusCode(xhr.status);
		}
	}

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   _  __
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) / |/  \
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  | | () |
	 *     |___/___\___| |_| |___\___/|_|\_| (_) |_|\__/
	* ---------------------------------------------------------------------
	* SETCTION 10: Header Handlers
	* ---------------------------------------------------------------------
	*
	* This section contains functions for handling the header of a request
	*
	* ---------------------------------------------------------------------
	*/

	/**
	 * [_handleHeaders description]
	`*
	 * @method cocosAPI._handleHeaders
	 * @access private
	 * @param  {String}  headers  [description]
	 * @return {Void}             [description]
	 */
	var _handleHeaders = function(xhr, rqh)
	{
		var headers;

		if(_isFunction(xhr.getAllResponseHeaders))
		{	
			// Get headers from xhr-function.
			//
			headers = xhr.getAllResponseHeaders();
		}
		// In older versions of Internet Explorer the XMLHttpRequest.getAllResponseHeaders
		// isn't a function, but an object. By 'executing' this object, it will be returned
		// and we can handle it as a function-result.
		// 
		else if(_isObject(xhr.getAllResponseHeaders))
		{
			// Get headers from xhr-object.
			// 
			try
			{
				headers = xhr.getAllResponseHeaders()
			}
			catch(e)
			{
				headers = null;
			}
		}
			
		// Check headers
		if(_isset(headers) && !_isEmpty(headers))
		{
			// Go parse headers
			headers = _parseHeaders(headers);

			// Find accessToken (lowercase key, because the _parseHeaders will lowercase them)
			//
			if(_isset(headers[HEADER_ACCESS_TOKEN.toLowerCase()]))
			{
				// Set accessToken when found in headers. Extend the login expire timeout
				// when the request is not an endless request.
				//
				_setAccessToken(headers[HEADER_ACCESS_TOKEN.toLowerCase()])

				//
				// _handleAccessToken(headers[HEADER_ACCESS_TOKEN.toLowerCase()], !_isTrue(rqh.isEndlessRequest()));
				_handleAccessToken(headers[HEADER_ACCESS_TOKEN.toLowerCase()], true);
			}
		}

		return headers;
	};

	/**
	 * [_parseHeaders description]
	`*
	 * @method cocosAPI._parseHeaders
	 * @access private
	 * @param  {String}  headerStr  [description]
	 * @return {Object}             [description]
	 */
	var _parseHeaders = function(headerStr)
	{
		var headers = {};
		if (!headerStr)
		{
			return headers;
		}

		var headerPairs = headerStr.split('\u000d\u000a');
		for (var i = 0; i < headerPairs.length; i++)
		{
			var headerPair = headerPairs[i];
			// Can't use split() here because it does the wrong thing
			// if the header value has the string ": " in it.
			var index = headerPair.indexOf('\u003a\u0020');
			if (index > 0)
			{
				var key = headerPair.substring(0, index);
				var val = headerPair.substring(index + 2);

				// We lowercase the key... Probably some stupid Chrome-developers
				// thought  it was funny to make everything lowercase in Chrome 60+.
				// So, in order to be independent off browsers who change the way
				// the're functions work, we lowercase the header fields names by
				// ourself. So when they someday decide to make it all uppercase, we
				// don't have to patch our code like we needed to now.
				//
				headers[key.toLowerCase()] = val;
			}
		}
		
		return headers;
	}

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   _ _
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) / / |
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  | | |
	 *     |___/___\___| |_| |___\___/|_|\_| (_) |_|_|
	* ---------------------------------------------------------------------
	* SETCTION 11: Response Handlers
	* ---------------------------------------------------------------------
	*
	* This section contains functions for handling the response of a request
	*
	* ---------------------------------------------------------------------
	*/

	var _handleDownload = function(rqh, response, xhr)
	{
		var filename = '';
	        var disposition = xhr.getResponseHeader('Content-Disposition');

	        if (disposition && disposition.indexOf('attachment') !== -1)
	        {
			var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
			var matches = filenameRegex.exec(disposition);
			if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
	        }
	        else
	        {
	        	filename = rqh.getFullPath().replace(/\//g, '_')+'_'+rqh.getLanguage();
	        	filename = filename.replace(/_{1,}/g, '_').replace(/^\_+|\_+$/g, '');
	        	filename += '.'+rqh.getFormat();
	        }

	        //
	        var type = xhr.getResponseHeader('Content-Type');
	        var blob;

	        // Disabled, due to errors in Internet Explorer / Edge. Apparently, the File API is
	        // still a working draft and not supported by Microsoft. For some reason, the File
	        // object IS available in their browsers, but when using them, they do not anymore.
	        // So, to prevent problems, we'll always use the Blob API for now.
	        // 
	        // if(typeof(File) === 'function')
	        // {
	        	// blob = new File([response], filename, {type: type});
	        // }
	        // else
	        // {
	        	 blob = new Blob([response], {type: type});
	        // }

	        if (typeof window.navigator.msSaveBlob !== 'undefined')
	        {
			// IE workaround for "HTML7007: One or more blob URLs were revoked by
			// closing the blob for which they were created. These URLs will no longer
			// resolve as the data backing the URL has been freed."
			window.navigator.msSaveBlob(blob, filename);

			// Callback
	            	setTimeout
	            	(
				function()
				{
					_executeCallbackSuccess(rqh, response);
				},
				0
			);
	        }
	        else
	        {
			var URL = window.URL || window.webkitURL;
			var downloadUrl = URL.createObjectURL(blob);
	        	
			if (filename)
			{
		                // Use HTML5 a[download] attribute to specify filename
		                var a = document.createElement('a');
				a.style = 'display: none';

		                // Safari doesn't support this yet
		                if (typeof a.download === 'undefined')
		                {
					window.location = downloadUrl;
		                }
		                else
		                {
					a.href = downloadUrl;
					a.download = filename;
					document.body.appendChild(a);
					a.click();
		                }
	            	}
	            	else
	            	{
	                	window.location = downloadUrl;
	            	}

			// // Cleanup
			// //
			setTimeout
			(
				function()
				{
					URL.revokeObjectURL(downloadUrl);
					_executeCallbackSuccess(rqh, response);
				},
				100
			);
	        }
	}

	/**
	 * [_handleResponse description]
	`*
	 * @method cososAPI._handleResponse
	 * @access private
	 * @param  {RequestHandler}  rqh       [description]
	 * @param  {String}          response  [description]
	 * @param  {XMLHttpRequest}  xhr       [description]
	 * @return {Void}                      [description]
	 */
	var _handleResponse = function(rqh, response, xhr)
	{
		_executeCallbackProgress(100, rqh, xhr);

		setTimeout(function()
		{
			response = _parseResponse(rqh, response);

			if(_isObject(response))
			{
				if(_isset(response.meta) && _isset(response.meta.action) && (response.meta.action == COCOS_API_ACTION_LOGOUT) && _isset(response.meta.result) && _isTrue(response.meta.result))
				{
					this.resetCookies();
				}

				if(response)
				{
					_executeCallbackSuccess(rqh, response);
				}
			}
			else
			{
				_executeCallbackError(rqh, _getTextFromLib('responseInvalid'), '_handleResponse#7278');
			}
		}.bind(this), 1);
	}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {<type>}    rqh       The rqh
	 * @param      {Function}  response  The response
	 * @param      {<type>}    xhr       The xhr
	 */
	var _handleMultiResponse = function(rqh, response, xhr)
	{
		_executeCallbackProgress(100, rqh, xhr);

		setTimeout(function()
		{
			response = _parseResponse(rqh, response);

			if(response)
			{
				// TODO: Moet een multi-response doorgelopen worden, waarbij elk los
				// request individueel afgehandeld moet worden?
				// 
				_executeCallbackSuccess(rqh, response);
			}
		}, 1);
	}

	/**
	 * [_handleError description]
	`*
	 * @method cocosAPI._handleError
	 * @access private
	 * @param  {RequestHandler}  rqh    [description]
	 * @param  {String}          error  [description]
	 * @param  {XMLHttpRequest}  xhr    [description]
	 * @return {Void}                   [description]
	 */
	var _handleError = function(rqh, error, xhr, origin)
	{
		var status = 0;
		var readyState = 0;

		if((typeof(xhr.status) != 'unknown') && _isset(xhr.status))
		{
			status = xhr.status;
		}

		if((typeof(xhr.readyState) != 'unknown') && _isset(xhr.readyState))
		{
			readyState = xhr.readyState;
		}

		if((status > READY_STATE_UNSENT) && (readyState == READY_STATE_DONE))
		{
			_executeCallbackProgress(100, rqh, xhr);
			setTimeout(function()
			{
				if(_isset(xhr.responseText))
				{
					var response = _parseResponse(rqh, xhr.responseText);

					if(_isset(response))
					{
						var errors = [];
						var msgCount = 0;

						if(_isset(response.info) && _isset(response.info.messages))
						{
							var messages = response.info.messages;
							msgCount = _objectLength(messages);
							for(var i=0; i<msgCount; i++)
							{
								var message = messages[i];
								if(_isset(message.type) && (message.type == 'error'))
								{
									if(_isset(message.text))
									{
										errors.push(message.text);
									}
								}
							}
						}

						if(errors.length > 0)
						{
							error = errors.join('<br><br>');
						}
						else
						{
							if(msgCount == 0)
							{
								error += _getTextFromLib('gotErrorsButEmpty', [(_isset(response.httpStatusCode)?response.httpStatusCode:''), rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath()]);
							}
						}
					}
				}
				else
				{
					error = _getTextFromLib('errorStatus', [status]);
					if(status == 0)
					{
						error += _getTextFromLib('errorSuffixCantConnect', [rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath()]);
					}
				}

				_executeCallbackError(rqh, error, '3534', response);
			}, 1);
		}
		else
		{
			_executeCallbackProgress(-100, rqh, xhr);

			if(!_isset(error) && (status == 0))
			{
				error = _getTextFromLib('errorCantConnect', [rqh.getProtocol()+'//'+rqh.getHost()+rqh.getFullPath()]);
			}

			if(!_isset(origin)) origin = '_handleError#3546';
			_executeCallbackError(rqh, error, origin);
		}
	};

	/**
	 * [_parseResponse description]
	 *
	 * @method cocosAPI._parseResponse
	 * @access private
	 * @param  {RequestHandler}  rqh       [description]
	 * @param  {String}          response  [description]
	 * @return {Void}                      [description]
	 */
	var _parseResponse = function(rqh, response)
	{
		switch(_getFormatReceive())
		{
			case 'json':
				try
				{
					var response = _parseJSON(rqh, response);

					if(_isObject(response))
					{
						return response;
					}
					else
					{
						return;
					}
				}
				catch(e)
				{
					_executeCallbackError(rqh, _getTextFromLib('responseJSONInvalid'), '3579');
				}
				break;

			case 'txt':
				// huh?
				//if(typeof(callbackSucces == 'function'))
				//{
					return response;
				//}
				break;

			default:
				// huh?
				//if(typeof(callbackSucces == 'function'))
				//{
					return '';
				//}
		}
	};

	/**
	 * [parseJSON description]
 	 *
	 * @method cocosAPI.parseJSON
	 * @access private
	 * @param  {RequestHandler}  rqh   [description]
	 * @param  {String}          data  [description]
	 * @return {Object}                [description]
	 */
	var _parseJSON = function(rqh, data)
	{
		var object = JSON.parse(data);

		if(rqh.validateResult)
		{
			if(_validateResult(rqh, object))
			{
				return object;
			}

			return false;
		}

		return object;
	};

	/**
	 * [validateResult description]
	 *
	 * @method cocosAPI.validateResult
	 * @access private
	 * @param  {RequestHandler}  rqh   [description]
	 * @param  {Object}          list  [description]
	 * @return {Boolean}               [description]
	 */
	var _validateResult = function(rqh, list)
	{
		// Check if meta-element and data-element exists in list
		//
		if(_isset(list.meta))
		{
			/*
			// Check is meta-count element is available and set
			//
			if(_isset(list.meta.total) && _isset(list.meta.total))
			{
				var metaTotal = list.meta.total;
				var metaLimit = list.meta.limit;

				// Get meta-count
				var metaCount = ((metaTotal > metaLimit)?metaLimit:metaTotal);

				// Count data-elements
				var dataCount = _objectLength(list.data);

				// Check if given meta-count and counted data-elements match
				if(metaCount != dataCount)
				{
					_executeCallbackError(rqh, _getTextFromLib('responseCountInvalid'), '_validateResult#3654');
					return false;
				}
			}
			*/

			return true;
		}

		_executeCallbackError(rqh, _getTextFromLib('responseInvalid'), '_validateResult#3662');
		return false;
	};

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   _ ___
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) / |_  )
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  | |/ /
	 *     |___/___\___| |_| |___\___/|_|\_| (_) |_/___|
	 * ---------------------------------------------------------------------
	 * SETCTION 12: Callback Execution
	 * ---------------------------------------------------------------------
	 *
	 * This section contains functions which will take care of calling the
	 * given callbacks
	 *
	 * ---------------------------------------------------------------------
	 */

	/**
	 * [_executeCallbackSuccess description]
	 *
	 * @method cocosAPI._executeCallbackSuccess
	 * @access private
	 * @param  {RequestHandler}  requestHandler  [description]
	 * @param  {String}          response        [description]
	 * @return {void}                            [description]
	 */
	var _executeCallbackSuccess = function(requestHandler, response)
	{
		requestHandler.setLastSuccesfullResponse(response);
		if(_isset(response.data) && (_objectLength(response.data) > 0))
		{
			requestHandler.setLastSuccesfullResponseWithData(response);
		}
		if(_isset(requestHandler) && _isFunction(requestHandler.callbackSuccess))
		{
			// When true returned on a custom callback-function, the global callback-
			// function will (also) be executed (if available).
			//
			functionResult = requestHandler.callbackSuccess(response, requestHandler);

			if(_isset(functionResult) && _isTrue(functionResult) && _isFalse(requestHandler.callbackSuccessIsDefaultFunction))
			{
				if(_isFunction(cocosCallbackSuccess))
				{
					cocosCallbackSuccess(response, requestHandler);
				}
			}
		}
		else
		{
			if(_isObject(response))
			{
				response = JSON.stringify(response);
			}

			if(response.length > 100)
			{
				response = response.substring(0, 97) + '...';
			}
			if(_alertsAllowed())
			{
				alert(_getTextFromLib('noSuccessFunction', [response]));
			}
		}

		_executeCallbackComplete(requestHandler, response);
	};

	/**
	 * [_executeCallbackError description]
	 *
	 * @method cocosAPI._executeCallbackError
	 * @access private
	 * @param  {RequestHandler}  requestHandler  [description]
	 * @param  {String}          error           [description]
	 * @return {void}                            [description]
	 */
	var _executeCallbackError = function(requestHandler, error, origin, response)
	{
		if(_isset(requestHandler) && _isFunction(requestHandler.callbackError))
		{
			// When true returned on a custom callback-function, the global callback-
			// function will (also) be executed (if available).
			//
			functionResult = requestHandler.callbackError(error, response, requestHandler);

			if(_isset(functionResult) && _isTrue(functionResult) && _isFalse(requestHandler.callbackErrorIsDefaultFunction))
			{
				if(_isFunction(cocosCallbackError))
				{
					cocosCallbackError(error, response, requestHandler);
				}
			}
		}
		else
		{
			if(_alertsAllowed())
			{
				// Showing alert in combination with the noErrorFunction-message is
				// disabled. When a error occurs and no errorFunction is available,
				// just show an alert (if allowed) with the error received from the
				// CoCoS API. A developer should know that when alerts are being
				// shown, he/she forgot to register a callable errorFunction in the
				// CoCoS API SDK which can be called on errors.
				// 
				// alert(_getTextFromLib('noErrorFunction', [error]));
				alert(error);
			}
		}

		_executeCallbackComplete(requestHandler, response);
	};

	/**
	 * [_executeCallbackComplete description]
	 *
	 * @method cocosAPI._executeCallbackComplete
	 * @access private
	 * @param  {RequestHandler}  requestHandler  [description]
	 * @return {void}                            [description]
	 */
	var _executeCallbackComplete = function(requestHandler, response)
	{
		if(_isset(requestHandler) && _isFunction(requestHandler.callbackComplete))
		{
			// When true returned on a custom callback-function, the global callback-
			// function will (also) be executed (if available).
			//
			functionResult = requestHandler.callbackComplete(response, requestHandler);

			if(_isset(functionResult) && _isTrue(functionResult) && _isFalse(requestHandler.callbackCompleteIsDefaultFunction))
			{
				if(_isFunction(cocosCallbackComplete))
				{
					cocosCallbackComplete(response, requestHandler);
				}
			}
		}

		// delete requestHandler;
	};

	/**
	 * [_executeCallbackProgress description]
	 *
	 * @method cocosAPI._executeCallbackProgress
	 * @access private
	 * @param  {Number}  progress  [description]
	 * @return {Void}              [description]
	 */
	var _executeCallbackProgress = function(progress, requestHandler, xmlHttpRequest)
	{
		//
		requestHandler.setHttpReadyState(xmlHttpRequest.readyState);

		if(_isset(progress))
		{
			if(_isObject(progress))
			{
				if (progress.lengthComputable)
				{
					progress = Math.round((progress.loaded/progress.total)*100);
				}
			}

			if(_isset(requestHandler) && _isFunction(requestHandler.callbackProgress))
			{
				// When true returned on a custom callback-function, the global callback-
				// function will (also) be executed (if available).
				//
				functionResult = requestHandler.callbackProgress(progress, requestHandler);

				if(_isset(functionResult) && _isTrue(functionResult) && _isFalse(requestHandler.callbackProgressIsDefaultFunction))
				{
					if(_isFunction(cocosCallbackProgress))
					{
						cocosCallbackProgress(progress, response, requestHandler);
					}
				}
			}

			/*
			// Check if current callback function for progress is available
			//
			if(_isFunction(cocosCallbackProgress))
			{
				setTimeout(function()
				{
					cocosCallbackProgress(progress);
				}, 1);
			}
			*/
		}

	};

	/**
	 * [_executeCallbackExpiration description]
	 *
	 * @method cocosAPI._executeCallbackExpiration
	 * @access private
	 * @param  {Number}  duration  [description]
	 * @return {Void}              [description]
	 */
	var _executeCallbackExpiration = function(now, expiration, remaining)
	{
		// Check if current callback function for progress is available
		//
		if((remaining >= 0) && _isFunction(cocosCallbackExpiration))
		{
			setTimeout(function()
			{
				cocosCallbackExpiration(now, expiration, remaining);
			}, 1);
		}
	};

	/**
	 * [_executeCallbackProgress description]
	 *
	 * @method cocosAPI._executeCallbackProgress
	 * @access private
	 * @param  {Number}  progress  [description]
	 * @return {Void}              [description]
	 */
	var _executeCallbackLoginExpired = function()
	{
		// Check if current callback function for progress is available
		//
		if(_isFunction(cocosCallbackLoginExpired))
		{
			setTimeout(function()
			{
				cocosCallbackLoginExpired();
			}, 1);
		}

		_clearLoginExpireTimer();
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  message    The message
	 * @param      {<type>}  requestId  The request identifier
	 */
	var _executeCallbackLogToConsole = function(message, requestId, duration)
	{
		// Check if current callback function for progress is available
		//
		if(_isFunction(cocosCallbackLogToConsole))
		{
			setTimeout(function()
			{
				cocosCallbackLogToConsole(message, requestId, duration);
			}, 1);
		}
	};

 	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   _ ____
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) / |__ /
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  | ||_ \
	 *     |___/___\___| |_| |___\___/|_|\_| (_) |_|___/
 	 * ---------------------------------------------------------------------
 	 * SETCTION 13: Request Handler
 	 * ---------------------------------------------------------------------
 	 *
 	 * This section contains the requestHandler-object. This object will be
 	 * used for each request.
 	 *
 	 * ---------------------------------------------------------------------
 	 */

 	/**
 	 * [requestHandler description]
 	 * @constructor
	 * @access private
 	 * @return {void}       [description]
 	 */
 	var requestHandler = function(requestId)
 	{
		/**
		 * This variable will store the generated id for the request.
		 *
		 * @var     requestHandler._requestId
		 * @type    {String}
		 * @access  private
		 *
		 * @see     {@link requestHandler._setRequestId}
		 * @see     {@link requestHandler.getRequestId}
		 */
		var _requestId;

		//
		this.handlerId = _createHandlerId();

		/**
		 * This variable will store the XMLHttpRequest-object the request.
		 *
		 * @var     requestHandler._requestObject
		 * @type    {String}
		 * @access  private
		 *
		 * @see     {@link requestHandler.setRequestObject}
		 * @see     {@link requestHandler.getRequestObject}
		 */
		var _requestObject;

		/**
		 * This variable will store the type of request-object. This can vary between a
		 * XMLHTTPRequest, XMLHTTPRequest (Level 2) or an XDomainRequest.
		 *
		 * @var     requestHandler._requestType
		 * @type    {String}
		 * @access  private
		 *
		 * @see     {@link requestHandler.setRequestType}
		 * @see     {@link requestHandler.getRequestType}
		 */
		var _requestType;

		/**
		 * This variable will store the protocol that is used in the
		 * request.
		 *
		 * @var     requestHandler._requestProtocol
		 * @type    {String}
		 * @access  private
		 *
		 * @see     {@link requestHandler.setProtocol}
		 * @see     {@link requestHandler.getProtocol}
		 */
		var _requestProtocol;

		/**
		 * This variable will store the host that is used in the
		 * request.
		 *
		 * @var     requestHandler._requestHost
		 * @type    {String}
		 * @access  private
		 *
		 * @see     {@link requestHandler.setHost}
		 * @see     {@link requestHandler.getHost}
		 */
		var _requestHost;

		/**
		 * This variable will store the path that is used in the
		 * request. This is the path as it's configured by the
		 * application that used the cososAPI. For example: /api/v1/
		 *
		 * @var     requestHandler._requestPath
		 * @type    {String}
		 * @access  private
		 *
		 * @see     {@link requestHandler.setPath}
		 * @see     {@link requestHandler.getPath}
		 */
		var _requestPath;

		/**
		 * This variable will store the type
		 *
		 * @var     requestHandler._type
		 * @type    {String}
		 * @access  private
		 *
		 * @see     {@link requestHandler.setType}
		 * @see     {@link requestHandler.getType}
		 */
		var _type;

		/**
		 * This variable can be used to set a specific type of request.
		 * For example, when a upload is being executed on the API, the
		 * type 'upload' will be used. Based on this type, the handling
		 * of the CORS-request and _call-function can be adjusted when
		 * necessary.
		 *
		 * @var    requestHandler.requestType
		 * @type   string
		 * @access public
		 */
		var _requestType;

		/**
		 * This variable will store the format
		 *
		 * @var     requestHandler._format
		 * @type    {String}
		 * @access  private
		 *
		 * @see     {@link requestHandler.setFormat}
		 * @see     {@link requestHandler.getFormat}
		 */
		var _format;

		/**
		 * This variable will store the language
		 *
		 * @var     requestHandler._language
		 * @type    {String}
		 * @access  private
		 *
		 * @see     {@link requestHandler.setLanguage}
		 * @see     {@link requestHandler.getLanguage}
		 */
		var _language = '';

		/**
		 * { var_description }
		 *
		 * @type       {<type>}
		 */
		var _uploadContentRangeStart = -1;

		/**
		 * { var_description }
		 *
		 * @type       {<type>}
		 */
		var _uploadContentRangeEnd = -1;

		/**
		 * { var_description }
		 *
		 * @type       {<type>}
		 */
		var _uploadContentRangeSize = -1;

		/**
		 * This variable will be used to save the timestamp when the
		 * start()-function is called at the beginning of a request.
		 *
		 * @var     requestHandler._start
		 * @type    {Boolean}
		 * @default false
		 * @access  private
		 *
		 * @see     {@link requestHandler.start}
		 * @see     {@link requestHandler.duration}
		 */
		var _start = 0;

		/**
		 * This variable will be used to save the timestamp when the
		 * end()-function is called at the end of a request.
		 *
		 * @var     requestHandler._end
		 * @type    {Number}
		 * @default 0
		 * @access  private
		 *
		 * @see     {@link requestHandler.end}
		 * @see     {@link requestHandler.duration}
		 */
		var _end = 0;

		/**
		 * { var_description }
		 *
		 * @type       {boolean}
		 */
		var _busy = false;

		/**
		 * { var_description }
		 *
		 * @type       {boolean}
		 */
		var _timedOut = false;

		var _timeout = -1;

		/**
		 * { var_description }
		 *
		 * @type       {boolean}
		 */
		var _abortedManually = false;

		/**
		 * This variable will hold the callback-function that must be
		 * executed after a succesfull request. This function is stored
		 * inside this object, because each call to the cocosAPI can
		 * have a different callback-function.
		 *
		 * @var    requestHandler.callbackSuccess
		 * @type   {Function}
		 * @access public
		 */
		this.callbackSuccess;

		this.callbackSuccessIsDefaultFunction = false;

		/**
		 * This variable will hold the callback-function that must be
		 * executed after a request with errors. This function is stored
		 * inside this object, because each call to the cocosAPI can
		 * have a different callback-function.
		 *
		 * @var    requestHandler.callbackError
		 * @type   {Function}
		 * @access public
		 */
		this.callbackError;

		/**
		 * { item_description }
		 */
		this.callbackErrorIsDefaultFunction = false;

		/**
		 * This variable will hold the callback-function that must be
		 * executed after a request is done. No mather it was succesfull
		 * or had errors. This function is stored inside this object,
		 * because each call to the cocosAPI can have a different
		 * callback-function.
		 *
		 * @var    requestHandler.callbackComplete
		 * @type   {Function}
		 * @access public
		 */
		this.callbackComplete;

		/**
		 * { item_description }
		 */
		this.callbackCompleteIsDefaultFunction = false;

		/**
		 * This variable will hold the callback-function that must be
		 * executed when progress is made during the request.
		 *
		 * @var    requestHandler.callbackProgress
		 * @type   {Function}
		 * @access public
		 */
		this.callbackProgress;

		/**
		 * { item_description }
		 */
		this.callbackProgressIsDefaultFunction = false;

		/**
		 * [requestMethod description]
		 *
		 * @var    requestHandler.requestMethod
		 * @type   {String}
		 * @access public
		 */
		this.requestMethod = '';

		/**
		 * [requestUrl description]
		 *
		 * @var    requestHandler.requestUrl
		 * @type   {String}
		 * @access public
		 */
		this.requestUrl = '';

		/**
		 * [requestHeaders description]
		 *
		 * @var    requestHandler.requestHeaders
		 * @type   {Array}
		 * @access public
		 */
		this.requestHeaders = [];

		/**
		 * [requestData description]
		 *
		 * @var    requestHandler.requestData
		 * @type   {String}
		 * @access public
		 */
		this.requestData = '';

		/**
		 * [validateResult description]
		 *
		 * @var    requestHandler.validateResult
		 * @type {Boolean}
		 */
		this.validateResult = true;

		this.sentApiKey = true;

		this.sentAccessToken = true;

		/**
		 * { item_description }
		 */
		this.lastSuccesfullResponse = null;

		/**
		 * { function_description }
		 *
		 * @param      {<type>}  requestId  The request identifier
		 */
		this.reset = function(requestId)
		{
			if(_isset(requestId))
			{
				_requestId = requestId;
			}
			else
			{
				_requestId = null;
			}
			_requestObject = null;
		 	_requestType = null;
		 	_requestProtocol = null;
			_requestHost = null;
			_requestPath = null;
			_requestFullPath = null;
			_type = null;
			_requestType = null;

			_start = 0;
			_end = 0;
			_busy = false;

			_timeout = -1;
			_timedOut = false;

			_httpReadyStates = [];
			_httpStatusCode = HTTP_STATUS_CODE_NONE;

			_abortedManually = false;

			this.callbackSuccess = null;
			this.callbackSuccessIsDefaultFunction = false;
			this.callbackError = null;
			this.callbackErrorIsDefaultFunction = false;
			this.callbackComplete = null;
			this.callbackCompleteIsDefaultFunction = false;
			this.callbackProgress = null;
			this.callbackProgressIsDefaultFunction = false;
			this.requestMethod = '';
			this.requestUrl = '';
			this.requestHeaders = [];
			this.requestData = '';
			this.validateResult = true;
			this.lastSuccesfullResponse = null;

			if(_isset(requestId))
			{
				_setRequestId(requestId);
			}
		}	

		var _requestFunction = null;
		var _requestArguments = null;

		/**
		 * Saves a request call.
		 *
		 * @param      {<type>}  requestCall  The request call
		 */
		this.saveRequestCall = function(requestCall)
		{
			if(!_isNull(requestCall))
			{
				// Store the _call-function and it's arguments here, so we can use the same
				// function again when a retry is being triggered.
				//
				_requestFunction = requestCall.callee;
				_requestArguments = requestCall;
			}
		}

		/**
		 * { function_description }
		 */
		this.retry = function()
		{
			if(_isFunction(_requestFunction))
			{
				_requestFunction.apply(this, _requestArguments);
			}
		};

		/**
		 * Sets the last succesfull response.
		 *
		 * @param      {<type>}  lastSuccesfullResponse  The last succesfull response
		 */
		this.setLastSuccesfullResponse = function(lastSuccesfullResponse)
		{
			this.lastSuccesfullResponse = lastSuccesfullResponse;
		}

		/**
		 * Gets the last succesfull response.
		 *
		 * @return     {<type>}  The last succesfull response.
		 */
		this.getLastSuccesfullResponse = function()
		{
			return this.lastSuccesfullResponse;
		}

		this.lastSuccesfullResponseWithData = null;

		/**
		 * Sets the last succesfull response with data.
		 *
		 * @param      {<type>}  lastSuccesfullResponseWithData  The last succesfull response with data
		 */
		this.setLastSuccesfullResponseWithData = function(lastSuccesfullResponseWithData)
		{
			this.lastSuccesfullResponseWithData = lastSuccesfullResponseWithData;
		}

		/**
		 * Gets the last succesfull response with data.
		 *
		 * @return     {<type>}  The last succesfull response with data.
		 */
		this.getLastSuccesfullResponseWithData = function()
		{
			return this.lastSuccesfullResponseWithData;
		}

		var _httpStatusCode = HTTP_STATUS_CODE_NONE;

		/**
		 * Sets the http status code.
		 *
		 * @param      {<type>}  httpStatusCode  The http status code
		 */
		this.setHttpStatusCode = function(httpStatusCode)
		{
			_httpStatusCode = httpStatusCode;
		}

		/**
		 * Gets the http status code.
		 *
		 * @return     {<type>}  The http status code.
		 */
		this.getHttpStatusCode = function()
		{
			return parseInt(_httpStatusCode);
		}

		var _httpReadyStates = [];

		/**
		 * Sets the  http ready state.
		 *
		 * @param      {<type>}  httpStatusCode  The http ready state
		 */
		this.setHttpReadyState = function(httpReadyState)
		{
			if(_httpReadyStates.indexOf(httpReadyState) == -1)
			{
				_httpReadyStates.push(httpReadyState);
			}
		}

		/**
		 * Gets the  http ready state.
		 *
		 * @return     {<type>}  The http ready state.
		 */
		this.getHttpReadyStates = function(implode)
		{
			if((typeof(implode) != 'undefined') && _isTrue(implode))
			{
				return _httpReadyStates.join(',');
			}
			return _httpReadyStates
		}

		var _occuredErrors = 0;

		/**
		 * { function_description }
		 */
		this.increaseError = function()
		{
			_occuredErrors = (_occuredErrors + 1);
		}

		/**
		 * { function_description }
		 */
		this.resetErrors = function()
		{
			_occuredErrors = 0;
		}

		/**
		 * Gets the errors.
		 *
		 * @return     {<type>}  The errors.
		 */
		this.getErrors = function()
		{
			return _occuredErrors;
		}

		/**
		 * Determines if busy.
		 *
		 * @return     {boolean}  True if busy, False otherwise.
		 */
		this.isBusy = function()
		{
			return _isTrue(_busy);
		}

		/**
		 * [description]
		 * @method
		 * @date      2017-07-18
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @return    {[type]}   [description]
		 */
		this.manuallyAborted = function()
		{
			return (_abortedManually === true);
		}

		/**
		 * Sets the timeout.
		 *
		 * @param      {<type>}  timeout  The timeout
		 */
		this.setTimeout = function(timeout)
		{
			_timeout = timeout;
		}

		/**
		 * Gets the timeout.
		 *
		 * @return     {<type>}  The timeout.
		 */
		this.getTimeout = function()
		{
			return _timeout;
		}

		/**
		 * [description]
		 * @method
		 * @date      2017-07-18
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @return    {[type]}   [description]
		 */
		this.timedOut = function()
		{
			return (_timedOut === true);
		}

		/**
		 * [start description]
		 *
		 * @method requestHandler.start
		 * @access public
		 * @return {Void}             [description]
		 */
		this.start = function()
		{
			// When receiving the start-command, go add this
			// requestHandler to the object of active requests,
			// based on the id of the request
			//
			_addActiveRequest(_requestId, this);

			// Set start time
			//
			_start = ((Date.now ? Date.now() : new Date().getTime()) / 1e3);
			_end = 0;

			// Reset variables to prevent stuff
			_httpStatusCode = 0;

			_abortedManually = false;
			_timedOut = false;
			_busy = true;
		}

		/**
		 * [end description]
		 *
		 * @method requestHandler.end
		 * @access public
		 * @return {Void}             [description]
		 */
		this.end = function()
		{
			// Set end time
			//
			_end = ((Date.now ? Date.now() : new Date().getTime()) / 1e3);
			_busy = false;

			// When receiving the end-command, go remove this
			// requestHandler from the object of active requests,
			// based on the id of the request.
			//
			_removeActiveRequest(_requestId);
		}

		/**
		 * [timedOut description]
		 * @return {[type]} [description]
		 */
		this.timeout = function()
		{
			_timedOut = true;
		}

		/**
		 * [description]
		 *
		 * @method    requestHandler.abort
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @return    {[type]} [description]
		 */
		this.abort = function(callbackFunction)
		{
			_abortedManually = true;

			if((_requestObject.status == READY_STATE_UNSENT) || (_requestObject.readyState != READY_STATE_DONE))
			{
				_requestObject.abort();

				// On abort, go remove this requestHandler from the
				// object of active requests, based on the id of
				// the request.
				//
				_removeActiveRequest(_requestId);
			}

			if(_isFunction(callbackFunction))
			{
				callbackFunction();
			}

		}

			/**
			 * This is a alias of this.abort() - It's here to prevent faulty code after
			 * upgrades when software was using a previous version of the apiConnector.
			 *
			 * @method    requestHandler.stop
			 * @author    S.vanBuren
			 * @copyright (concera
			 * @return    {[type]} [description]
			 */
			this.stop = function(callbackFunction)
			{
				this.abort(callbackFunction);
			}

		/**
		 * Gets the duration.
		 *
		 * @return     {number}  The duration.
		 */
		this.getDuration = function()
		{
			// Calculate duration based on start- and end-time
			//
			if((_end > 0) && (_start > 0))
			{
				return (_end - _start).toFixed(3) + ' seconds';
			}
			return 0;
		}

			/**
			 * Alias for method getDuration, only here for backwards compatibility.
			 *
			 * @method requestHandler.duration
			 * @access public
			 * @return {Number}                [description]
			 */
			this.duration = function()
			{
				return this.getDuration();
			}

		/**
		 * Gets the timings.
		 *
		 * @return     {Object}  The timings.
		 */
		this.getTimings = function()
		{
			return {
				start: _start,
				end: _end,
				duration: (((_end > 0) && (_start > 0))?(_end-_start):0),
				timeout: _timeout,
			};
		}

		/**
		 * [_setRequestId description]
		 *
		 * @method requestHandler._setRequestId
		 * @access private
		 * @param  {String}  id  [description]
		 * @return {Void}        [description]
		 */
		var _setRequestId = function(id)
		{
			_requestId = id;
		}

		/**
		 * [getRequestId description]
		 *
		 * @method requestHandler.getRequestId
		 * @access public
		 * @return {Void}                      [description]
		 */
		this.getRequestId = function()
		{
			return _requestId;
		}

		 /**
 		 * [requestHandler.setRequestObject description]
 		 *
 		 * @method    requestHandler.setRequestObject
		 * @date      2017-07-06
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @param     {XMLHttpRequest}   requestMethod [description]
		 * @return    {Void}                           [description]
		 */
		this.setRequestObject = function(requestObject)
		{
			_requestObject = requestObject;
		}

		/**
		 * [requestHandler.getRequestObject description]
		 *
		 * @method    requestHandler.getRequestObject
		 * @date      2017-07-06
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @return    {XMLHttpRequest}   [description]
		 */
		this.getRequestObject = function()
		{
			return _requestObject;
		}

		 /**
 		 * [requestHandler.setRequestType description]
 		 *
 		 * @method    requestHandler.setRequestType
		 * @date      2017-11-09
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @param     {string}   requestType [description]
		 * @return    {Void}                           [description]
		 */
		this.setRequestType = function(requestType)
		{
			_requestType = requestType;
		}

		/**
		 * [requestHandler.getRequestType description]
		 *
		 * @method    requestHandler.getRequestType
		 * @date      2017-11-09
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @return    {string}   [description]
		 */
		this.getRequestType = function()
		{
			return _requestType;
		}

		/**
		 * [setProtocol description]
		 *
		 * @method requestHandler.setProtocol
		 * @access public
		 * @return {Void}                     [description]
		 */
		this.setProtocol = function(protocol)
		{
			_requestProtocol = protocol;
		}

		/**
		 * [getProtocol description]
		 *
		 * @method requestHandler.getProtocol
		 * @access public
		 * @return {Void}                     [description]
		 */
		this.getProtocol = function()
		{
			return _requestProtocol;
		}

		/**
		 * [setHost description]
		 *
		 * @method requestHandler.setHost
		 * @access public
		 * @return {Void}                  [description]
		 */
		this.setHost = function(host)
		{
			_requestHost = host;
		}

		/**
		 * [getHost description]
		 *
		 * @method requestHandler.getHost
		 * @access public
		 * @return {Void}                  [description]
		 */
		this.getHost = function()
		{
			return _requestHost;
		}

		/**
		 * [setPath description]
		 *
		 * @method requestHandler.setPath
		 * @access public
		 * @return {Void}                  [description]
		 */
		this.setPath = function(path)
		{
			_requestPath = path;
		}

		/**
		 * [getPath description]
		 *
		 * @method requestHandler.getPath
		 * @access public
		 * @return {Void}                  [description]
		 */
		this.getPath = function()
		{
			return _requestPath;
		}

		/**
		 * [setPath description]
		 *
		 * @method requestHandler.setPath
		 * @access private
		 * @param  {String} fullPath       [description]
		 * @return {Void}                  [description]
		 */
		var _setFullPath = function(fullPath)
		{
			_requestFullPath = fullPath;
		}

		/**
		 * [getFullPath description]
		 *
		 * @method requestHandler.getFullPath
		 * @access public
		 * @return {String}                   [description]
		 */
		this.getFullPath = function()
		{
			return _requestFullPath;
		}

		/**
		 * [description]
		 * @method
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @return    {[type]} [description]
		 */
		this.setEndlessRequest = function()
		{
			this.setType(REQUEST_TYPE_ENDLESS);
		}

		/**
		 * [setType description]
		 *
		 * @method requestHandler.setType
		 * @access private
		 * @param  {String} type       [description]
		 * @return {Void}              [description]
		 */
		this.setType = function(type)
		{
			_type = type;
		}

		/**
		 * [getType description]
		 *
		 * @method requestHandler.getType
		 * @access public
		 * @return {Void}                  [description]
		 */
		this.getType = function()
		{
			return _type;
		}

		 /**
 		 * [requestHandler.setFormat description]
 		 *
 		 * @method    requestHandler.setFormat
		 * @date      2018-11-26
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @param     {string}   format [description]
		 * @return    {Void}                           [description]
		 */
		this.setFormat = function(format)
		{
			_format = format;
		}

		/**
		 * [requestHandler.getFormat description]
		 *
		 * @method    requestHandler.getFormat
		 * @date      2018-11-26
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @return    {string}   [description]
		 */
		this.getFormat = function()
		{
			return _format;
		}

		 /**
 		 * [requestHandler.setLanguage description]
 		 *
 		 * @method    requestHandler.setLanguage
		 * @date      2018-11-26
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @param     {string}   language [description]
		 * @return    {Void}                           [description]
		 */
		this.setLanguage = function(language)
		{
			_language = language;
		}

		/**
		 * [requestHandler.getLanguage description]
		 *
		 * @method    requestHandler.getLanguage
		 * @date      2018-11-26
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @return    {string}   [description]
		 */
		this.getLanguage = function()
		{
			return _language;
		}

		/**
		 * Sets the upload content range.
		 *
		 * @param      {<type>}  start   The start
		 * @param      {<type>}  end     The end
		 * @param      {<type>}  size    The size
		 */
		this.setUploadContentRange = function(start, end, size)
		{
			_uploadContentRangeStart = start;
			_uploadContentRangeEnd = end;
			_uploadContentRangeSize = size;
		}

		/**
		 * Gets the upload content range.
		 *
		 * @return     {Object}  The upload content range.
		 */
		this.getUploadContentRange = function()
		{
			if((_uploadContentRangeStart > -1) && (_uploadContentRangeEnd > -1) && (_uploadContentRangeSize > -1))
			{
				return {
					'start': _uploadContentRangeStart,
					'end': _uploadContentRangeEnd,
					'size': _uploadContentRangeSize,
				};
			}

			return;
		}

		/**
		 * [description]
		 * @method
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @return    {[type]} [description]
		 */
		this.isUpload = function()
		{
			return (this.getType() == REQUEST_TYPE_UPLOAD);
		}

		/**
		 * [description]
		 * @method
		 * @author    S.vanBuren
		 * @copyright (concera
		 * @return    {[type]} [description]
		 */
		this.isEndlessRequest = function()
		{
			return (this.getType() == REQUEST_TYPE_ENDLESS);
		}

		this.extendSession = function()
		{
			return;
		}

		/**
		 * [setCallbackSuccess description]
		 *
		 * @method requestHandler.setCallbackSuccess
		 * @access public
		 * @param  {Function}  successFunction  [description]
		 * @return {Boolean}                    [description]
		 */
		this.setCallbackSuccess = function(successFunction, isDefaultFunction)
		{
			if(_isFunction(successFunction))
			{
				this.callbackSuccess = successFunction;

				if(_isTrue(isDefaultFunction))
				{
					this.callbackSuccessIsDefaultFunction = true;
				}

				return true;
			}

			return false;
		}

		/**
		 * [setCallbackError description]
		 *
		 * @method requestHandler.setCallbackError
		 * @access public
		 * @param  {Function}  successFunction  [description]
		 * @return {Boolean}                    [description]
		 */
		this.setCallbackError = function(errorFunction, isDefaultFunction)
		{
			if(_isFunction(errorFunction))
			{
				this.callbackError = errorFunction;

				if(_isTrue(isDefaultFunction))
				{
					this.callbackErrorIsDefaultFunction = true;
				}

				return true;
			}
			return false;
		}

		/**
		 * [setCallbackComplete description]
		 *
		 * @method requestHandler.setCallbackComplete
		 * @access public
		 * @param  {Function}  successFunction  [description]
		 * @return {Boolean}                    [description]
		 */
		this.setCallbackComplete = function(completeFunction, isDefaultFunction)
		{
			if(_isFunction(completeFunction))
			{
				this.callbackComplete = completeFunction;

				if(_isTrue(isDefaultFunction))
				{
					this.callbackCompleteIsDefaultFunction = true;
				}

				return true;
			}
			return false;
		}

		/**
		 * [setCallbackComplete description]
		 *
		 * @method requestHandler.setCallbackComplete
		 * @access public
		 * @param  {Function}  successFunction  [description]
		 * @return {Boolean}                    [description]
		 */
		this.setCallbackProgress = function(progressFunction, isDefaultFunction)
		{
			if(_isFunction(progressFunction))
			{
				this.callbackProgress = progressFunction;

				if(_isTrue(isDefaultFunction))
				{
					this.callbackProgressIsDefaultFunction = true;
				}

				return true;
			}
			return false;
		}

		/**
		 * [setRequestMethod description]
		 *
		 * @method requestHandler.setRequestMethod
		 * @param  {String}   requestMethod  [description]
		 * @return {Boolean}                 [description]
		 */
		this.setRequestMethod = function(requestMethod)
		{
			if(_isset(requestMethod))
			{
				this.requestMethod = requestMethod;
				return true;
			}
			return false;
		}

		/**
		 * [setRequestUrl description]
		 *
		 * @method requestHandler.setRequestUrl
		 * @param  {String}   requestUrl  [description]
		 * @return {Boolean}              [description]
		 */
		this.setRequestUrl = function(requestUrl)
		{
			if(_isset(requestUrl))
			{
				fullPath = requestUrl;
				fullPath = fullPath.replace(this.getProtocol()+'//', '');
				fullPath = fullPath.replace(this.getHost(), '');
				fullPath = '/'+fullPath.substring(0, ((fullPath.indexOf('?') > 0)?fullPath.indexOf('?'):fullPath.length))+'/';
				fullPath = fullPath.replace(/\/\//gi, '/');

				_setFullPath(fullPath);

				this.requestUrl = requestUrl;
				return true;
			}
			return false;
		}

		/**
		 * [setRequestHeaders description]
		 *
		 * @method requestHandler.setRequestHeaders
		 * @param  {String}   requestHeaders  [description]
		 * @return {Boolean}                  [description]
		 */
		this.setRequestHeaders = function(requestHeaders)
		{
			if(_isset(requestHeaders))
			{
				this.requestHeaders = requestHeaders;
				return true;
			}
			return false;
		};

		/**
		 * [setRequestData description]
		 *
		 * @method requestHandler.setRequestData
		 * @param  {String}  requestData  [description]
		 * @return {Boolean}              [description]
		 */
		this.setRequestData = function(requestData)
		{
			if(_isset(requestData))
			{
				this.requestData = requestData;
				return true;
 			}
 			return false;
		};

		/**
		 * Gets the request url.
		 *
		 * @return     {<type>}  The request url.
		 */
		this.getRequestUrl = function()
		{
			return this.requestUrl;
		}

		/**
		 * [enableResultValidation description]
		 *
		 * @method requestHandler.enableResultValidation
		 * @return {Void}                                [description]
		 */
		this.enableResultValidation = function()
		{
			this.validateResult = true;
		};

		/**
		 * [disableResultValidation description]
		 * @method requestHandler.disableResultValidation
		 * @return {Void}                                 [description]
		 */
		this.disableResultValidation = function()
		{
			this.validateResult = false;
		};

		// When a request id is given, set is using the _setRequestId
		// function inside this class.
		//
		if(_isset(requestId))
		{
			_setRequestId(requestId);
		}
 	};

	 /***
 	 *      ___ ___ ___ _____ ___ ___  _  _   _   _ _ _
 	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) / | | |
 	 *     \__ \ _| (__  | |  | | (_) | .` |  _  | |_  _|
 	 *     |___/___\___| |_| |___\___/|_|\_| (_) |_| |_|
 	  * ---------------------------------------------------------------------
 	  * SETCTION 14: Textlibrary
 	  * ---------------------------------------------------------------------
 	  *
 	  * This section contains a textLib-object in JSON-format, containing all the messages and
 	  * the languages the're available in. By using this textlib, an error will be displayed in
 	  * the users own language (if available).
 	  *
 	  * Please keep in mind that, for older browsers like Internet Explorer 6 and 7, the JSON-
 	  * object may not contain any comma' without a following element. See also:
 	  * http://www.sitemasters.be/forum/3/37928/JavaScript/Form_validation_werkt_niet_in_IE7_+_IE6
 	  *
 	  * var textlib = {
 	  * 	tag1: {
 	  * 		A: "Lorem ipsum ...",
 	  * 		B: "Lorem ipsum ...",	<!-- This comma is not allowed in older browsers
 	  * 	},
 	  * 	tag2: {
 	  * 		A: "Lorem ipsum ...",
 	  * 		B: "Lorem ipsum ...",	<!-- This comma is not allowed in older browsers
 	  * 	},	<!-- This comma is not allowed in older browsers
 	  * }
 	  * 
 	  * ---------------------------------------------------------------------
 	  */
	var textLib = {

		invalidHost:
		{
			EN: "The given host '%0%', is not a valid domain-name or ip-address. The connection tot the API is not possible.",
			NL: "De opgegeven hostnaam '%0%' is geen geldige domeinnaam of ip-adres. De connectie met de API kan hierdoor niet worden opgebouwd."
		},

		invalidTimeout:
		{
			EN: "The given timeout '%0%', is not a valid, numeric value. Please use a currect value.",
			NL: "De opgegeven timeout '%0%' is geen geldige, numerieke waarde. Gelieve een geldige waarde te gebruiken."
		},

		protocolError:
		{
			EN: "Unable to set protocol '%0%'! Only 'http:' or 'https:' allowed.",
			NL: "Het protocol '%0%' kan niet worden ingesteld. Alleen 'http:' of 'https:' is toegestaan."
		},

		receiveFormatError:
		{
			EN: "Unable to set receive format to '%0%'! Allowed methods are: %1%.",
			NL: "Het formaat voor het ontvangen van data kon niet worden ingesteld op '%0%'. Toegestane formaten zijn: %1%."
		},

		sendFormatError:
		{
			EN: "Unable to set sent format to '%0%'! Allowed methods are: %1%.",
			NL: "Het formaat voor het versturen van data kon niet worden ingesteld op '%0%'. Toegestane formaten zijn: %1%."
		},

		blockedRequest:
		{
			EN: "A request has been blocked. Unable to execute an insecure HTTP-call while the page is accessed by HTTPS.",
			NL: "Een request is geblokkeerd. Het was niet mogelijk om een onveilige HTTP-url aan te roepen, terwijl deze pagina over HTTPS is geladen."
		},

		cookiesDisabled:
		{
			EN: "It looks like the browser doesn't allow cookies, however, this is needed for this application.\n\nPlease make sure domain '%0%' is allowed to use cookies",
			NL: "Het lijkt erop dat uw browser het niet toestaat om cookies te plaatsen, echter is dit vereist voor de werking van deze applicatie.\n\nGelieve toe te staan cookies te plaatsen voor domein '%0%'."
		},

		noHost:
		{
			EN: "No (valid) hostname given, therefore, the connection tot the API is not possible.",
			NL: "Er is geen (geldige) hostnaam opgegeven. De connectie met de API kan hierdoor niet worden opgebouwd."
		},

		noPath:
		{
			EN: "No (valid) path given, therefore, the connection tot the API is not possible.",
			NL: "Er is geen (geldige) pad opgegeven. De connectie met de API kan hierdoor niet worden opgebouwd."
		},

		unsupportedCORS:
		{
			EN: "CORS (Cross Origin Resource Sharing) not supported",
			NL: "CORS (Cross Origin Resource Sharing) werd niet ondersteund"
		},

		invalidRequest:
		{
			EN: "The created request seems to be invalid and can not be processed.",
			NL: "Het lijkt erop dat het request ongeldig is en kan daarom niet uitgevoerd worden.."
		},

		errorInsecureResponse:
		{
			EN: "An error has occurred while connecting to %0%.\n\nYour browser might have refused to trust the HTTPS/SSL certificate. This connection may be using an expirared or untrusted certificate.\n\nPlease make sure your browser accepts the certificate to continue.",
			NL: "Er is een fout opgetreden bij verbinden met %0%.\n\nUw browser heeft mogelijk het SSL certificaat geweigerd. De verbinding gebruikt mogelijk een verlopen of niet-vertrouwd certificaat.\n\nOm door te kunnen gaan, zorg ervoor dat uw webbroser het certificaat accepteert."
		},

		errorStatus:
		{
			EN: "Status: %0%",
			NL: "Status: %0%"
		},

		errorConnectTimeout:
		{
			EN: "The connection with %0% was aborted, because it took longer then %1% seconds.",
			NL: "De verbinding met %0% werd afgebroken, omdat deze langer dan %1% seconde duurde."
		},

		errorSuffixCantConnect:
		{
			EN: " - Unable to connect to: %0%",
			NL: " - Het was niet mogelijk een verbinding te maken met %0%"
		},

		errorCantConnect:
		{
			EN: "Unable to connect to: %0%",
			NL: "Het was niet mogelijk een verbinding te maken met %0%"
		},

		gotErrorsButEmpty:
		{
			EN: " - Got response with error-code (%0%), but no messages, from: %1%",
			NL: " - Error-code (%0%) verkregen, zonder verdere berichtgeving, van %1%"
		},

		responseInvalid:
		{
			EN: "Response is missing meta- or data-object.",
			NL: "Het resultaat mist het meta- of data-element."
		},

		responseCountInvalid:
		{
			EN: "Count-value in meta-response didn't match count-value of data-object",
			NL: "De telwaarde in het meta-element en het aantal items in het data-element komen niet met elkaar overeen."
		},

		responseJSONInvalid:
		{
			EN: "Response seems to be invalid JSON-format.",
			NL: "Het verkregen resultaat is een incorrect JSON-formaat."
		},

		noSuccessFunction:
		{
			EN: "No (valid) success-function available for handling request. Response from API:\n\n%0%",
			EN: "Er was geen (geldige) functie beschikbaar om het resultaat te verwerken. Verkregen resultaat van de API:\n\n%0%"
		},

		noErrorFunction:
		{
			EN: "No (valid) error-function available for handling request. Occured error:\n\n%0%",
			NL: "Er was geen (geldige) functie beschikbaar om het fouten af te handelen. Opgetreden fout:\n\n%0%"
		},

		invalidIdentifier:
		{
			EN: "Unable to make a request to the API, because the given identifier \'%0%\' seems to be invalid.",
			NL: "Het was niet mogelijk om een request naar de API te sturen, omdat de opgegeven identifier \'%0%\' ongeldig lijkt te zijn."
		},

		multiMethodNotSupportedInDebug:
		{
			EN: "It is (currently) not possible to perform a multi-method-request when running the SDK in debug mode.",
			NL: "Het is (op dit moment) niet mogelijk om met de SDK in debug-mode, een multi-method-request uit te voeren"
		},

		invalidMultiMethod:
		{
			EN: "The given method '%0%' was not allowed to be used while sending a multi-method-request to the CoCoS API.",
			NL: "De opgegeven HTTP-methode '%0%' kon niet gebruikt worden bij het versturen van een multi-method-request naar de CoCoS API."
		}
	};

	/**
	 * [_getTextFromLib description]
	 *
	 * @method cocosAPI._getTextFromLib
	 * @access private
	 * @param  {String}  tag     [description]
	 * @param  {Array}   params  [description]
	 * @return {String}          [description]
	 */
	var _getTextFromLib = function(tag, params)
	{
		var text = '';

		if(_isset(textLib[tag]))
		{
			var tagLib = textLib[tag];
			var language = '';

			if(_isset(navigator.language))
			{
				language = navigator.language;
			}
			else if(_isset(navigator.browserLanguage))
			{
				var browserLanguage = navigator.browserLanguage;
				if(browserLanguage.indexOf('-') > -1)
				{
					browserLanguage = browserLanguage.split('-');
					language = browserLanguage[1];
				}
				else
				{
					language = browserLanguage;
				}
			}

			if(typeof(language) == 'string')
			{
				language = language.toUpperCase()
			}

			if(_isset(tagLib[language]))
			{
				text = tagLib[language];
			}

			if(!_isset(text))
			{
				// fallback to english
				//
				if(language != 'EN')
				{
					language = 'EN';
					if(_isset(tagLib[language]))
					{
						text = tagLib[language];
					}
				}
			}
		}

		if(_isset(text))
		{
			if(_isObject(params))
			{
				var length = params.length;
				if(length > 0)
				{
					for(var i=0; i<length; i++)
					{
						text = text.replace('%'+i+'%', params[i]);
					}
				}
			}
			return text;
		}

		return 'Unknown error: [' + tag + ']';
	};

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   _ ___
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) / | __|
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  | |__ \
	 *     |___/___\___| |_| |___\___/|_|\_| (_) |_|___/
	 * ---------------------------------------------------------------------
	 * SECTION 15: Helper functions (Private)
	 * ---------------------------------------------------------------------
	 *
	 * This section will contains some (private) helper-functions which will be used by the
	 * (public) helper-functions (SECTION 17) in this CoCoS API SDK.
	 *
	 * For example, when an authorize-request is made (this can be /auth/me, /auth/login and/or
	 * /auth/logout), the response needs to be analyzed to check if it's correct. To prevent
	 * writing the same code over and over again in public function like 'isAuthorized', we have
	 * some private helper functions available, which can be used by the public helper-functions
	 * processing the data from the CoCoS API.

	 * ---------------------------------------------------------------------
	 */
	
	var _checkStatusResponse = function(response, checkLicensed, callbackSuccess, callbackError)
	{
		var metaOk = false;
		var versionOk = false;
		var licenseOk = false;

		var statusData = {};
		var error = '';

		// Check if response has meta
		//
		if(_isset(response.meta))
		{
			// Check if action was authenticate
			// 2019-04-10 - In order to be backwards compatible with older versions of
			// the CoCoS API, also  no response.meta.action will be valid as long as the
			// response.meta.result is true.
			// 
			if((_isset(response.meta.action) && (response.meta.action == COCOS_API_ACTION_STATUS)) || (!_isset(response.meta.action)))
			{
				// Check if action was successful
				if(_isset(response.meta.result) && _isTrue(response.meta.result))
				{
					metaOk = true;
				}
				else
				{
					error = 'No/invalid meta-result in response';
				}
			}
			else
			{
				error = 'No/invalid meta-action in response';
			}
		}
		else
		{
			error = 'No meta-element in response';
		}

		// Check for API version
		//
		if(_isset(response.version) && !_isEmpty(response.version))
		{	
			versionOk = true;
		}
		else
		{
			error = 'No/invalid version!'
		}

		if(_isFalse(checkLicensed))
		{
			licenseOk = true;
		}
		else
		{
			// Check license
			//
			if(_isset(response.license) && _isObject(response.license) && _isTrue(response.license.licensed))
			{
				licenseOk = true;
			}
			else if(_isset(response.licensed) && _isTrue(response.licensed))
			{
				licenseOk = true;
			}
			else
			{
				error = 'No license!'
			}
		}

		if(_isset(response.data) && (_isObject(response.data)))
		{
			// Check if data has item
			//
			if(_isset(response.data[0]))
			{
				// Check if item has data
				//
				if(_isset(response.data[0].data))
				{
					statusData = response.data[0].data;
				}
			}
		}

		if(metaOk && versionOk && licenseOk)
		{
			if(_isFunction(callbackSuccess))
			{
				callbackSuccess(statusData);
			}
		}
		else if(_isFunction(callbackError))
		{
			callbackError(statusData, error);
		}
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}   response         The response
	 * @param      {<type>}   callbackSuccess  The callback success
	 * @param      {<type>}   callbackError    The callback error
	 * @return     {boolean}  { description_of_the_return_value }
	 */
	this.checkLoginResponse = function(response, callbackSuccess, callbackError)
	{
		if(_checkAuthResponse(COCOS_API_ACTION_LOGIN, response, callbackSuccess, callbackError))
		{
			return true;	
		}

		return false;
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}   response         The response
	 * @param      {<type>}   callbackSuccess  The callback success
	 * @param      {<type>}   callbackError    The callback error
	 * @return     {boolean}  { description_of_the_return_value }
	 */
	this.checkAuthenticateResponse = function(response, callbackSuccess, callbackError)
	{
		if(_checkAuthResponse(COCOS_API_ACTION_AUTHENTICATE, response, callbackSuccess, callbackError))
		{
			return true;	
		}

		return false;
	}

	/**
	 * { function_description }
	 *
	 * @param      {string}    action           The action
	 * @param      {<type>}    response         The response
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 * @return     {boolean}   { description_of_the_return_value }
	 */
	var _checkAuthResponse = function(action, response, callbackSuccess, callbackError)
	{
		var metaOk = false;
		var dataOk = false;

		var userData = {};

		// Check if response has meta
		//
		if(_isset(response.meta))
		{
			// Check if action was correct
			//
			if(_isset(response.meta.action) && (response.meta.action == action))
			{
				// Check if action was successful
				//
				if(_isset(response.meta.result) && _isTrue(response.meta.result))
				{
					metaOk = true;
				}
			}
		}

		if(action == COCOS_API_ACTION_LOGOUT)
		{
			dataOk = true;
		}
		else
		{
			// Check if response has meta
			//
			if(_isset(response.data) && (_isObject(response.data)))
			{
				// Check if data has item
				//
				if(_isset(response.data[0]))
				{
					// Check if item has data
					//
					if(_isset(response.data[0].data))
					{
						userData = response.data[0].data;

						// Check if userId found
						//
						if(_isset(userData['userid']))
						{
							dataOk = true;
						}
					}
				}
			}
		}

		if(metaOk && dataOk)
		{
			if(_isFunction(callbackSuccess))
			{
				callbackSuccess(userData);
			}

			return true;
		}
		else if(_isFunction(callbackError))
		{
			callbackError(userData);

			return false;
		}
	}

	var cocosApiResults = {};
	var COCOS_API_RESULT_AUTHORIZED = 'authorized';
	var COCOS_API_RESULT_LOGGEDIN = 'loggedin';
	var COCOS_API_RESULT_USERDATA = 'userdata';

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   _   __
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) / | / /
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  | |/ _ \
	 *     |___/___\___| |_| |___\___/|_|\_| (_) |_|\___/
	 * ---------------------------------------------------------------------
	 * SECTION 16: Helper functions (Public)
	 * ---------------------------------------------------------------------
	 *
	 * This section will contain some functions which will help you as a developer by creating
	 * applications using this CoCoS API SDK.
	 *
	 * For example, to determine if a user is logged in or not, the authorize-function must be
	 * called, the response from that function must be analyzed to check if the response was ok
	 * and if the data sent back contains information about the logged in user (when logged in
	 * of course).
	 * To help you with this, we already written a isAuthorized-function, which will call the
	 * given callback-function with a boolean (true/false) to tell if there is someone logged
	 * in and (if so) a data-object with the data of the logged in user.
	 *
	 * ---------------------------------------------------------------------
	 */
	
	/**
	 * Determines if available.
	 *
	 * @param      {Function}  callbackFunction  The callback function
	 */
	this.isAvailable = function(callbackFunction, checkLicensed)
	{
		_logToConsole('Go check status of CoCoS API, using JavaScript-SDK');

		this.status
		(
		 	function(response)
			{
				_checkStatusResponse
				(
				 	response,
				 	checkLicensed,
				 	function(statusData)
					{
						if(_isFunction(callbackFunction))
						{
							callbackFunction(true);
						}
					},
					function(statusData, error)
					{
						if(_isFunction(callbackFunction))
						{
							callbackFunction(false, error);
						}
					}
				);
			},
			function(error, response)
			{
				if(_isFunction(callbackFunction))
				{
					callbackFunction(false, error);
				}
			}
		)
	}

	/**
	 * This function can be used to check if it's authorized to connect with the CoCoS API.
	 *
	 * @method
	 * @date      2017-06-30
	 * @author    S.vanBuren
	 * @copyright (concera
	 * @param     {[type]}   callbackFunction [description]
	 * @return    {[type]}                    [description]
	 */
	this.isAuthorized = function(callbackFunction)
	{
		_logToConsole('Go check authorization on CoCoS API, using JavaScript-SDK');

		if(!_isset(cocosApiResults.COCOS_API_RESULT_AUTHORIZED))
		{
			// Go authorize. The CoCoS API-SDK will do a call on the API
			// with (if available) a token. Based on this call, a loggedIn
			// notLoggedIn or error will be returned. Based on that, we
			// continue handling
			//
			this.authorize
			(
				// Function to be called when authorized
				function(response)
				{
					_checkAuthResponse
					(
					 	COCOS_API_ACTION_AUTHENTICATE,
					 	response,
					 	function(userData)
						{
							var authorized = false;
							if(_isset(userData['userid']) && (userData['userid'] != 0))
							{
								_logToConsole('Authorized with userId: ' + userData['userid']);
								authorized = true;
							}

							cocosApiResults.COCOS_API_RESULT_AUTHORIZED = authorized;
							cocosApiResults.COCOS_API_RESULT_USERDATA = userData;

							_logToConsole('isAuthorized result: ' + authorized);

							if(_isFunction(callbackFunction))
							{
								callbackFunction(authorized, userData);
							}
						},
						function()
						{
							if(_isFunction(callbackFunction))
							{
								callbackFunction(false, null);
							}
						}
					);
				},
				function(error, response)
				{
					if(_isObject(response))
					{
						if(_isset(response['httpStatusCode']) && (response['httpStatusCode'] == 401))
						{
							_logToConsole('Authorize failed, go reset cookies');

							// When authorized gives an unauthorized
							// message / code, go reset the cookies.
							//
							this.resetCookies();
							cocosApiResults.COCOS_API_RESULT_AUTHORIZED = false;
							cocosApiResults.COCOS_API_RESULT_USERDATA = null;
						}

						if(_isFunction(callbackFunction))
						{
							callbackFunction(false, null);
						}
					}
					else
					{

						if(_isFunction(callbackFunction))
						{
							callbackFunction(false, null);
						}
						
						// Check if a a default cocosCallbackError-function
						// is given. If not, go alert (if allowed) the error
						// that occurred.
						//
						else if(_isFunction(cocosCallbackError))
						{
							cocosCallbackError();
						}
						else
						{
							if(_alertsAllowed())
							{
								// Showing alert in combination with the noErrorFunction-message is
								// disabled. When a error occurs and no errorFunction is available,
								// just show an alert (if allowed) with the error received from the
								// CoCoS API. A developer should know that when alerts are being
								// shown, he/she forgot to register a callable errorFunction in the
								// CoCoS API SDK which can be called on errors.
								// 
								// alert(_getTextFromLib('noErrorFunction', [error]));
								alert(error);
							}
						}
					}
				}.bind(this)
			);
		}
		else if(_isFunction(callbackFunction))
		{
			callbackFunction(cocosApiResults.COCOS_API_RESULT_AUTHORIZED, cocosApiResults.COCOS_API_RESULT_USERDATA);
		}
	};

	/**
	 * Determines if logged in.
	 *
	 * @param      {Function}  callbackFunction  The callback function
	 */
	this.isLoggedIn = function(callbackFunction)
	{
		if(!_isset(cocosApiResults.COCOS_API_RESULT_LOGGEDIN))
		{
			this.isAuthorized(function(authorized, userData)
			{
				var loggedIn = false;
				if(authorized && (_isset(userData['userid']) && (userData['userid'] > 0)))
				{
					loggedIn = true;
				}

				cocosApiResults.COCOS_API_RESULT_LOGGEDIN = authorized;
				cocosApiResults.COCOS_API_RESULT_USERDATA = userData;

				if(_isFunction(callbackFunction))
				{
					callbackFunction(loggedIn, userData);
				}
			});
		}
		else if(_isFunction(callbackFunction))
		{
			callbackFunction(cocosApiResults.COCOS_API_RESULT_LOGGEDIN, cocosApiResults.COCOS_API_RESULT_USERDATA);
		}
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  username          The username
	 * @param      {<type>}  password          The password
	 * @param      {<type>}  callbackFunction  The callback function
	 */
	this.handleLoginWithUserNamePassword = function(username, password, callbackFunction)
	{
		this.handleLoginWithUserNamePasswordPincode(username, password, null, callbackFunction);
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  pincode           The pincode
	 * @param      {<type>}  callbackFunction  The callback function
	 */
	this.handleLoginWithPincode = function(pincode, callbackFunction)
	{
		this.handleLoginWithUserNamePasswordPincode(null, null, pincode, callbackFunction);
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}    username          The username
	 * @param      {<type>}    password          The password
	 * @param      {<type>}    pincode           The pincode
	 * @param      {Function}  callbackFunction  The callback function
	 */
	this.handleLoginWithUserNamePasswordPincode = function(username, password, pincode, callbackFunction)
	{
		this.loginWithUsernamePasswordPincode
		(
		 	username,
		 	password,
		 	pincode,
		 	function(response)
			{
				_checkAuthResponse
				(
				 	COCOS_API_ACTION_LOGIN,
				 	response,
				 	function(userData)
					{
						if(_isset(userData['name']) && !_isEmpty(userData['name']))
						{
							cocosApiResults.COCOS_API_RESULT_AUTHORIZED = true;
							cocosApiResults.COCOS_API_RESULT_LOGGEDIN = true;
							cocosApiResults.COCOS_API_RESULT_USERDATA = userData;
						}

						if(_isFunction(callbackFunction))
						{
							callbackFunction(cocosApiResults.COCOS_API_RESULT_LOGGEDIN, cocosApiResults.COCOS_API_RESULT_USERDATA, response);
						}

					},
					function()
					{
						callbackFunction(false, null);
					}
				);
			}.bind(this),
			function(error, response)
			{
				cocosApiResults.COCOS_API_RESULT_AUTHORIZED = false;
				cocosApiResults.COCOS_API_RESULT_LOGGEDIN = false;
				cocosApiResults.COCOS_API_RESULT_USERDATA = null;

				if(_isFunction(callbackFunction))
				{
					callbackFunction(cocosApiResults.COCOS_API_RESULT_LOGGEDIN, cocosApiResults.COCOS_API_RESULT_USERDATA, response);
				}
			}.bind(this)
		);
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}    token             The token
	 * @param      {Function}  callbackFunction  The callback function
	 */
	this.handleLoginWithToken = function(token, callbackFunction)
	{
		this.loginWithToken
		(
		 	token,
		 	function(response)
			{
				_checkAuthResponse
				(
				 	COCOS_API_ACTION_LOGIN,
				 	response,
				 	function(userData)
					{
						if(_isset(userData['name']) && !_isEmpty(userData['name']))
						{
							cocosApiResults.COCOS_API_RESULT_AUTHORIZED = true;
							cocosApiResults.COCOS_API_RESULT_LOGGEDIN = true;
							cocosApiResults.COCOS_API_RESULT_USERDATA = userData;
						}

						if(_isFunction(callbackFunction))
						{
							callbackFunction(cocosApiResults.COCOS_API_RESULT_LOGGEDIN, cocosApiResults.COCOS_API_RESULT_USERDATA, response);
						}

					},
					function()
					{
						callbackFunction(false, null);
					}
				);
			}.bind(this),
			function(error, response)
			{
				cocosApiResults.COCOS_API_RESULT_AUTHORIZED = false;
				cocosApiResults.COCOS_API_RESULT_LOGGEDIN = false;
				cocosApiResults.COCOS_API_RESULT_USERDATA = null;

				if(_isFunction(callbackFunction))
				{
					callbackFunction(cocosApiResults.COCOS_API_RESULT_LOGGEDIN, cocosApiResults.COCOS_API_RESULT_USERDATA, response);
				}
			}.bind(this)
		);
	};

	/**
	 * { function_description }
	 */
	this.handleLogout = function(callbackFunction)
	{
		// When the handleLogout-method is called, go check if there are any active/pending
		// requests at this time. If so, so get the first active request from the stored
		// list and send an abort to it. After the abort is done, this method will be called
		// again. This process will continue until no active/pending requests are found.
		// When there are no active/pending requests, the logout-function will be called.
		// 
		if(_objectLength(_activeRequests) > 0)
		{
			var requestIds = Object.keys(_activeRequests);
			var requestId = requestIds[0];
			var rqh = _activeRequests[requestId];

			if(isObject(rqh) && isFunction(rqh.abort))
			{
				rqh.abort(function()
				{
					this.handleLogout(callbackFunction);
				}.bind(this));
			}
			else
			{
				_removeActiveRequest(requestId);
				this.handleLogout(callbackFunction);
			}
		}
		else
		{
			this.logout
			(
			 	function(response, rqh)
			 	{
					_checkAuthResponse
					(
					 	COCOS_API_ACTION_LOGOUT,
					 	response,
					 	function()
						{
							cocosAccessToken = '';
							this.resetCookies();

							if(_isFunction(callbackFunction))
							{
								callbackFunction(true);
							}	
						}.bind(this)
					)
			 	}.bind(this),
			 	function(error, response, rqh)
			 	{
			 		// When the POST on /api/v1/auth/logout failed, returned a
			 		// status 401. This means we're Unauthorized. The session
			 		// might be already expired and the accessToken won't grant
			 		// any permissions anymore. Therefore, we can assume we're
			 		// already logged out.
			 		//
			 		if(_isObject(response) && _isset(response.httpStatusCode) && (response.httpStatusCode == 401))
			 		{
						cocosAccessToken = '';
						this.resetCookies();

			 			if(_isFunction(callbackFunction))
						{
							callbackFunction(true);
						}
			 		}
			 		else
			 		{
			 			console.error('ERROR ON LOGOUT!');
			 		}
			 	}.bind(this)
			 );
		}
	}

	/**
	 * This function can be used to receive a fileUrl from the data of a fileObject inside the
	 * API response. In earlier versions, fetching files was done by a separate app (located in
	 * /apps/files) which returned the requested file.
	 * 
	 * Since 2018-08-01, file can be fetch through the API, using a storageRequest, therefore, a
	 * separate app/tools isn't needed anymore. The API returns now the full URL to the file,
	 * which will be stored in the elements named fileUrl and fileUrlVerified, where the key
	 * fileUrlVerified is a URL including the hash of the uploaded file, so when the file is
	 * begin fetched, we can assure it's the same file and wasn't changed in the fileSystem by
	 * FTP / Samba or whatever. 
	 * 
	 * @param  {[type]} fileData [description]
	 * @return {[type]}          [description]
	 */
	this.getFileURL = function(fileData, verified)
	{
		if(_isObject(fileData))
		{
			if(!isFalse(verified) && _isset(fileData['fileUrlVerified']) && !_isEmpty(fileData['fileUrlVerified']))
			{
				return fileData['fileUrlVerified'];
			}
			else if(_isset(fileData['fileUrl']) && !_isEmpty(fileData['fileUrl']))
			{
				return fileData['fileUrl'];
			}
			else
			{
				var locationKey = fileData['locationKey'];
				var fileHash = fileData['fileHash'];
				var locationPath = fileData['locationPath'];

				var fileUrl = _appendToPath(_getPath(), PATH_STORAGE);
				fileUrl = _appendToPath(fileUrl, locationKey);
				fileUrl = _appendToPath(fileUrl, locationPath);

				if(!isFalse(verified) && !_isEmpty(fileHash))
				{
					fileUrl += '?h='+fileHash;
				}

				return fileUrl;
			}
		}
		return false;
	}

	/***
	 *      ___ ___ ___ _____ ___ ___  _  _   _   _ ____
	 *     / __| __/ __|_   _|_ _/ _ \| \| | (_) / |__  |
	 *     \__ \ _| (__  | |  | | (_) | .` |  _  | | / /
	 *     |___/___\___| |_| |___\___/|_|\_| (_) |_|/_/
	 * ---------------------------------------------------------------------
	 * SETCTION 17: End of Connector
	 * ---------------------------------------------------------------------
	 */

	/**
	 * [construct description]
	 * .
	 * @method construct
	 * @param  {String}  host    [description]
	 * @param  {String}  path    [description]
	 * @param  {String}  apiKey  [description]
	 * @return {Void}            [description]
	 */
	this.construct = function(host, path, apiKey, freshStart)
	{
		if(_isset(host))
		{
			if(!this.setHost(host))
			{
				_notOk();
				return;
			}
		}
		else
		{
			if(!this.setHost(window.location.host))
			{
				_notOk();
				return;
			}
		}

		if(_isset(path))
		{
			if(!this.setPath(path))
			{
				_notOk();
				return;
			}
		}

		if(_isset(apiKey))
		{
			if(!this.setApiKey(apiKey))
			{
				_notOk();
				return;
			}
		}

		if(window.location.protocol == 'http:')
		{
			this.setCookiePrefix('CoCoS-Http-');
		}

		this.setCookiePath();

		if(_isTrue(freshStart))
		{
			this.resetCookies();
		}

	}

	this.construct(host, path, apiKey, freshStart);
	
	//
	_checkCookie();
};


/**
 * [description]
 * @method 	 md5
 * @author    
 * @source   	 
 * @copyright   
 * @param     	 {string} string [description]
 * @return       {string}        [description]
 */
!function(){'use strict';function Md5(t){if(t)blocks[0]=blocks[16]=blocks[1]=blocks[2]=blocks[3]=blocks[4]=blocks[5]=blocks[6]=blocks[7]=blocks[8]=blocks[9]=blocks[10]=blocks[11]=blocks[12]=blocks[13]=blocks[14]=blocks[15]=0,this.blocks=blocks,this.buffer8=buffer8;else if(ARRAY_BUFFER){var r=new ArrayBuffer(68);this.buffer8=new Uint8Array(r),this.blocks=new Uint32Array(r)}else this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];this.h0=this.h1=this.h2=this.h3=this.start=this.bytes=0,this.finalized=this.hashed=!1,this.first=!0}var ERROR="input is invalid type",WINDOW="object"==typeof window,root=WINDOW?window:{};root.JS_MD5_NO_WINDOW&&(WINDOW=!1);var WEB_WORKER=!WINDOW&&"object"==typeof self,NODE_JS=!root.JS_MD5_NO_NODE_JS&&"object"==typeof process&&process.versions&&process.versions.node;NODE_JS?root=global:WEB_WORKER&&(root=self);var COMMON_JS=!root.JS_MD5_NO_COMMON_JS&&"object"==typeof module&&module.exports,AMD="function"==typeof define&&define.amd,ARRAY_BUFFER=!root.JS_MD5_NO_ARRAY_BUFFER&&"undefined"!=typeof ArrayBuffer,HEX_CHARS="0123456789abcdef".split(""),EXTRA=[128,32768,8388608,-2147483648],SHIFT=[0,8,16,24],OUTPUT_TYPES=["hex","array","digest","buffer","arrayBuffer","base64"],BASE64_ENCODE_CHAR="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),blocks=[],buffer8;if(ARRAY_BUFFER){var buffer=new ArrayBuffer(68);buffer8=new Uint8Array(buffer),blocks=new Uint32Array(buffer)}(root.JS_MD5_NO_NODE_JS||!Array.isArray)&&(Array.isArray=function(t){return"[object Array]"===Object.prototype.toString.call(t)});var createOutputMethod=function(t){return function(r){return new Md5(!0).update(r)[t]()}},createMethod=function(){var t=createOutputMethod("hex");NODE_JS&&(t=nodeWrap(t)),t.create=function(){return new Md5},t.update=function(r){return t.create().update(r)};for(var r=0;r<OUTPUT_TYPES.length;++r){var e=OUTPUT_TYPES[r];t[e]=createOutputMethod(e)}return t},nodeWrap=function(method){var crypto=eval("require('crypto')"),Buffer=eval("require('buffer').Buffer"),nodeMethod=function(t){if("string"==typeof t)return crypto.createHash("md5").update(t,"utf8").digest("hex");if(null===t||void 0===t)throw ERROR;return t.constructor===ArrayBuffer&&(t=new Uint8Array(t)),Array.isArray(t)||ArrayBuffer.isView(t)||t.constructor===Buffer?crypto.createHash("md5").update(new Buffer(t)).digest("hex"):method(t)};return nodeMethod};Md5.prototype.update=function(t){if(!this.finalized){var r="string"!=typeof t;if(r){if(null===t||void 0===t)throw ERROR;t.constructor===root.ArrayBuffer&&(t=new Uint8Array(t))}var e=t.length;if(r&&("number"!=typeof e||!Array.isArray(t)&&(!ARRAY_BUFFER||!ArrayBuffer.isView(t))))throw ERROR;for(var s,i,o=0,h=this.blocks,f=this.buffer8;e>o;){if(this.hashed&&(this.hashed=!1,h[0]=h[16],h[16]=h[1]=h[2]=h[3]=h[4]=h[5]=h[6]=h[7]=h[8]=h[9]=h[10]=h[11]=h[12]=h[13]=h[14]=h[15]=0),r)if(ARRAY_BUFFER)for(i=this.start;e>o&&64>i;++o)f[i++]=t[o];else for(i=this.start;e>o&&64>i;++o)h[i>>2]|=t[o]<<SHIFT[3&i++];else if(ARRAY_BUFFER)for(i=this.start;e>o&&64>i;++o)s=t.charCodeAt(o),128>s?f[i++]=s:2048>s?(f[i++]=192|s>>6,f[i++]=128|63&s):55296>s||s>=57344?(f[i++]=224|s>>12,f[i++]=128|s>>6&63,f[i++]=128|63&s):(s=65536+((1023&s)<<10|1023&t.charCodeAt(++o)),f[i++]=240|s>>18,f[i++]=128|s>>12&63,f[i++]=128|s>>6&63,f[i++]=128|63&s);else for(i=this.start;e>o&&64>i;++o)s=t.charCodeAt(o),128>s?h[i>>2]|=s<<SHIFT[3&i++]:2048>s?(h[i>>2]|=(192|s>>6)<<SHIFT[3&i++],h[i>>2]|=(128|63&s)<<SHIFT[3&i++]):55296>s||s>=57344?(h[i>>2]|=(224|s>>12)<<SHIFT[3&i++],h[i>>2]|=(128|s>>6&63)<<SHIFT[3&i++],h[i>>2]|=(128|63&s)<<SHIFT[3&i++]):(s=65536+((1023&s)<<10|1023&t.charCodeAt(++o)),h[i>>2]|=(240|s>>18)<<SHIFT[3&i++],h[i>>2]|=(128|s>>12&63)<<SHIFT[3&i++],h[i>>2]|=(128|s>>6&63)<<SHIFT[3&i++],h[i>>2]|=(128|63&s)<<SHIFT[3&i++]);this.lastByteIndex=i,this.bytes+=i-this.start,i>=64?(this.start=i-64,this.hash(),this.hashed=!0):this.start=i}return this}},Md5.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,r=this.lastByteIndex;t[r>>2]|=EXTRA[3&r],r>=56&&(this.hashed||this.hash(),t[0]=t[16],t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.bytes<<3,this.hash()}},Md5.prototype.hash=function(){var t,r,e,s,i,o,h=this.blocks;this.first?(t=h[0]-680876937,t=(t<<7|t>>>25)-271733879<<0,s=(-1732584194^2004318071&t)+h[1]-117830708,s=(s<<12|s>>>20)+t<<0,e=(-271733879^s&(-271733879^t))+h[2]-1126478375,e=(e<<17|e>>>15)+s<<0,r=(t^e&(s^t))+h[3]-1316259209,r=(r<<22|r>>>10)+e<<0):(t=this.h0,r=this.h1,e=this.h2,s=this.h3,t+=(s^r&(e^s))+h[0]-680876936,t=(t<<7|t>>>25)+r<<0,s+=(e^t&(r^e))+h[1]-389564586,s=(s<<12|s>>>20)+t<<0,e+=(r^s&(t^r))+h[2]+606105819,e=(e<<17|e>>>15)+s<<0,r+=(t^e&(s^t))+h[3]-1044525330,r=(r<<22|r>>>10)+e<<0),t+=(s^r&(e^s))+h[4]-176418897,t=(t<<7|t>>>25)+r<<0,s+=(e^t&(r^e))+h[5]+1200080426,s=(s<<12|s>>>20)+t<<0,e+=(r^s&(t^r))+h[6]-1473231341,e=(e<<17|e>>>15)+s<<0,r+=(t^e&(s^t))+h[7]-45705983,r=(r<<22|r>>>10)+e<<0,t+=(s^r&(e^s))+h[8]+1770035416,t=(t<<7|t>>>25)+r<<0,s+=(e^t&(r^e))+h[9]-1958414417,s=(s<<12|s>>>20)+t<<0,e+=(r^s&(t^r))+h[10]-42063,e=(e<<17|e>>>15)+s<<0,r+=(t^e&(s^t))+h[11]-1990404162,r=(r<<22|r>>>10)+e<<0,t+=(s^r&(e^s))+h[12]+1804603682,t=(t<<7|t>>>25)+r<<0,s+=(e^t&(r^e))+h[13]-40341101,s=(s<<12|s>>>20)+t<<0,e+=(r^s&(t^r))+h[14]-1502002290,e=(e<<17|e>>>15)+s<<0,r+=(t^e&(s^t))+h[15]+1236535329,r=(r<<22|r>>>10)+e<<0,t+=(e^s&(r^e))+h[1]-165796510,t=(t<<5|t>>>27)+r<<0,s+=(r^e&(t^r))+h[6]-1069501632,s=(s<<9|s>>>23)+t<<0,e+=(t^r&(s^t))+h[11]+643717713,e=(e<<14|e>>>18)+s<<0,r+=(s^t&(e^s))+h[0]-373897302,r=(r<<20|r>>>12)+e<<0,t+=(e^s&(r^e))+h[5]-701558691,t=(t<<5|t>>>27)+r<<0,s+=(r^e&(t^r))+h[10]+38016083,s=(s<<9|s>>>23)+t<<0,e+=(t^r&(s^t))+h[15]-660478335,e=(e<<14|e>>>18)+s<<0,r+=(s^t&(e^s))+h[4]-405537848,r=(r<<20|r>>>12)+e<<0,t+=(e^s&(r^e))+h[9]+568446438,t=(t<<5|t>>>27)+r<<0,s+=(r^e&(t^r))+h[14]-1019803690,s=(s<<9|s>>>23)+t<<0,e+=(t^r&(s^t))+h[3]-187363961,e=(e<<14|e>>>18)+s<<0,r+=(s^t&(e^s))+h[8]+1163531501,r=(r<<20|r>>>12)+e<<0,t+=(e^s&(r^e))+h[13]-1444681467,t=(t<<5|t>>>27)+r<<0,s+=(r^e&(t^r))+h[2]-51403784,s=(s<<9|s>>>23)+t<<0,e+=(t^r&(s^t))+h[7]+1735328473,e=(e<<14|e>>>18)+s<<0,r+=(s^t&(e^s))+h[12]-1926607734,r=(r<<20|r>>>12)+e<<0,i=r^e,t+=(i^s)+h[5]-378558,t=(t<<4|t>>>28)+r<<0,s+=(i^t)+h[8]-2022574463,s=(s<<11|s>>>21)+t<<0,o=s^t,e+=(o^r)+h[11]+1839030562,e=(e<<16|e>>>16)+s<<0,r+=(o^e)+h[14]-35309556,r=(r<<23|r>>>9)+e<<0,i=r^e,t+=(i^s)+h[1]-1530992060,t=(t<<4|t>>>28)+r<<0,s+=(i^t)+h[4]+1272893353,s=(s<<11|s>>>21)+t<<0,o=s^t,e+=(o^r)+h[7]-155497632,e=(e<<16|e>>>16)+s<<0,r+=(o^e)+h[10]-1094730640,r=(r<<23|r>>>9)+e<<0,i=r^e,t+=(i^s)+h[13]+681279174,t=(t<<4|t>>>28)+r<<0,s+=(i^t)+h[0]-358537222,s=(s<<11|s>>>21)+t<<0,o=s^t,e+=(o^r)+h[3]-722521979,e=(e<<16|e>>>16)+s<<0,r+=(o^e)+h[6]+76029189,r=(r<<23|r>>>9)+e<<0,i=r^e,t+=(i^s)+h[9]-640364487,t=(t<<4|t>>>28)+r<<0,s+=(i^t)+h[12]-421815835,s=(s<<11|s>>>21)+t<<0,o=s^t,e+=(o^r)+h[15]+530742520,e=(e<<16|e>>>16)+s<<0,r+=(o^e)+h[2]-995338651,r=(r<<23|r>>>9)+e<<0,t+=(e^(r|~s))+h[0]-198630844,t=(t<<6|t>>>26)+r<<0,s+=(r^(t|~e))+h[7]+1126891415,s=(s<<10|s>>>22)+t<<0,e+=(t^(s|~r))+h[14]-1416354905,e=(e<<15|e>>>17)+s<<0,r+=(s^(e|~t))+h[5]-57434055,r=(r<<21|r>>>11)+e<<0,t+=(e^(r|~s))+h[12]+1700485571,t=(t<<6|t>>>26)+r<<0,s+=(r^(t|~e))+h[3]-1894986606,s=(s<<10|s>>>22)+t<<0,e+=(t^(s|~r))+h[10]-1051523,e=(e<<15|e>>>17)+s<<0,r+=(s^(e|~t))+h[1]-2054922799,r=(r<<21|r>>>11)+e<<0,t+=(e^(r|~s))+h[8]+1873313359,t=(t<<6|t>>>26)+r<<0,s+=(r^(t|~e))+h[15]-30611744,s=(s<<10|s>>>22)+t<<0,e+=(t^(s|~r))+h[6]-1560198380,e=(e<<15|e>>>17)+s<<0,r+=(s^(e|~t))+h[13]+1309151649,r=(r<<21|r>>>11)+e<<0,t+=(e^(r|~s))+h[4]-145523070,t=(t<<6|t>>>26)+r<<0,s+=(r^(t|~e))+h[11]-1120210379,s=(s<<10|s>>>22)+t<<0,e+=(t^(s|~r))+h[2]+718787259,e=(e<<15|e>>>17)+s<<0,r+=(s^(e|~t))+h[9]-343485551,r=(r<<21|r>>>11)+e<<0,this.first?(this.h0=t+1732584193<<0,this.h1=r-271733879<<0,this.h2=e-1732584194<<0,this.h3=s+271733878<<0,this.first=!1):(this.h0=this.h0+t<<0,this.h1=this.h1+r<<0,this.h2=this.h2+e<<0,this.h3=this.h3+s<<0)},Md5.prototype.hex=function(){this.finalize();var t=this.h0,r=this.h1,e=this.h2,s=this.h3;return HEX_CHARS[t>>4&15]+HEX_CHARS[15&t]+HEX_CHARS[t>>12&15]+HEX_CHARS[t>>8&15]+HEX_CHARS[t>>20&15]+HEX_CHARS[t>>16&15]+HEX_CHARS[t>>28&15]+HEX_CHARS[t>>24&15]+HEX_CHARS[r>>4&15]+HEX_CHARS[15&r]+HEX_CHARS[r>>12&15]+HEX_CHARS[r>>8&15]+HEX_CHARS[r>>20&15]+HEX_CHARS[r>>16&15]+HEX_CHARS[r>>28&15]+HEX_CHARS[r>>24&15]+HEX_CHARS[e>>4&15]+HEX_CHARS[15&e]+HEX_CHARS[e>>12&15]+HEX_CHARS[e>>8&15]+HEX_CHARS[e>>20&15]+HEX_CHARS[e>>16&15]+HEX_CHARS[e>>28&15]+HEX_CHARS[e>>24&15]+HEX_CHARS[s>>4&15]+HEX_CHARS[15&s]+HEX_CHARS[s>>12&15]+HEX_CHARS[s>>8&15]+HEX_CHARS[s>>20&15]+HEX_CHARS[s>>16&15]+HEX_CHARS[s>>28&15]+HEX_CHARS[s>>24&15]},Md5.prototype.toString=Md5.prototype.hex,Md5.prototype.digest=function(){this.finalize();var t=this.h0,r=this.h1,e=this.h2,s=this.h3;return[255&t,t>>8&255,t>>16&255,t>>24&255,255&r,r>>8&255,r>>16&255,r>>24&255,255&e,e>>8&255,e>>16&255,e>>24&255,255&s,s>>8&255,s>>16&255,s>>24&255]},Md5.prototype.array=Md5.prototype.digest,Md5.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(16),r=new Uint32Array(t);return r[0]=this.h0,r[1]=this.h1,r[2]=this.h2,r[3]=this.h3,t},Md5.prototype.buffer=Md5.prototype.arrayBuffer,Md5.prototype.base64=function(){for(var t,r,e,s="",i=this.array(),o=0;15>o;)t=i[o++],r=i[o++],e=i[o++],s+=BASE64_ENCODE_CHAR[t>>>2]+BASE64_ENCODE_CHAR[63&(t<<4|r>>>4)]+BASE64_ENCODE_CHAR[63&(r<<2|e>>>6)]+BASE64_ENCODE_CHAR[63&e];return t=i[o],s+=BASE64_ENCODE_CHAR[t>>>2]+BASE64_ENCODE_CHAR[t<<4&63]+"=="};var exports=createMethod();COMMON_JS?module.exports=exports:(root.md5=exports,AMD&&define(function(){return exports}))}();
// 
// 

/**
 * [Function.bind description]
 * @param  {[type]} oThis [description]
 * @return {[type]}       [description]
 * @source https://stackoverflow.com/questions/11054511/how-to-handle-lack-of-javascript-object-bind-method-in-ie-8#11054570
 */
if (!Function.prototype.bind)
{
	Function.prototype.bind = function(oThis)
	{
		if (typeof this !== 'function')
		{
		// closest thing possible to the ECMAScript 5
		// internal IsCallable function
		throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs   = Array.prototype.slice.call(arguments, 1);
	    	var fToBind = this;
	    	var fNOP    = function() {};
	    	var fBound  = function()
	    	{
			return fToBind.apply(this instanceof fNOP && oThis
				? this
				: oThis,
				aArgs.concat(Array.prototype.slice.call(arguments)));
	    	};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}

/**
 * [String.trim description]
 * @source: https://stackoverflow.com/questions/2308134/trim-in-javascript-not-working-in-ie#2308157
 * @return {[type]} [description]
 */
if(typeof String.prototype.trim !== 'function')
{
	String.prototype.trim = function()
	{
		return this.replace(/^\s+|\s+$/g, ''); 
	};
}

/**
 * [keys description]
 * @source https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
 * @param  {[type]} o [description]
 * @return {[type]}   [description]
 */
if (!Object.keys)
{
	Object.keys = function(obj)
	{
		var keys = [];

		for (var i in obj)
		{
			if (obj.hasOwnProperty(i))
			{
				keys.push(i);
			}
		}

		return keys;
	};
}

/**
 * [JSON description]
 * @source: https://stackoverflow.com/questions/4715373/json-object-undefined-in-internet-explorer-8#4715399
 * @return {[type]} [description]
 */
var JSON = JSON || {};

// implement JSON.stringify serialization
JSON.stringify = JSON.stringify || function (obj)
{
	var t = typeof (obj);
	if (t != 'object' || obj === null) 
	{
		// simple data type
		if (t == 'string')
		{
			obj = '"'+obj+'"';
		}
		return String(obj);
	}
	else
	{
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);

		for (n in obj)
		{
			v = obj[n]; t = typeof(v);

			if (t == 'string')
			{
				v = '"'+v+'"';
			}
			else if (t == 'object' && v !== null)
			{
				v = JSON.stringify(v);
			}

			json.push((arr ? '' : '"' + n + '":') + String(v));
		}

		return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}');
	}
};

// implement JSON.parse de-serialization
JSON.parse = JSON.parse || function (str)
{
	if (str === '')
	{
		str = '""';
	}
	eval('var p=' + str + ';');
	return p;
};
