/***
 *     ___      ___     ___ 
 *    / __|___ / __|___/ __|
 *   | (__/ _ \ (__/ _ \__ \
 *    \___\___/\___\___/___/, grown by (concera
 * 
 * -------------------------------------------------------------------------------------------------
 * @author(s)		Erwin Vorenhout, Stefan van Buren
 * @copyright 		Concera Software - https://concera.software/
 * @dateCreated		2018-02-xx
 * @lastChange		2020-09-20
 * @version		1.20.263
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
 *  2020-09-20		1.20.263	SvB
 *  	[Fixed] Updated handling for noLicense-error. When the application (for example the CoCos
 *	management) disallows this message, the application will continue, also when no license is
 * 	available.
 *	[Changed] Changed some overlay-messages in order to inform better about why the application
 *	can't start, for example: No license or Device not allowed.
 *	[Added] Added private _disconnectFromCoCoSAPI-function.
 *
 *  2020-08-27		1.20.239	SvB
 *  	[Changed] Changed reload-handling.
 *
 *  2020-08-18		1.20.230	SvB
 *  	[Added] Function _handleLoginResponse added in order to fetch available locations from the
 *	response of the loginRequest. When found, these will be stored so a new request isn't needed
 *	anymore.
 *	[Changed] Updated the getAvailableLocations-function, using locations from a local variable
 *	from an earlier request (if available) and/or fetching the available locations from the
 *	CoCoS API.
 *	[Added] Added handling for when a device or location is found/available, but not actived.
 *
 *  2020-08-11		1.20.223	SvB
 *  	[Added] Added a defaultTextLib for the application to use as fallback when no library is
 *	available.
 *	[Changed] The default languages for the application will come from the getBrowserLanguage()
 *	function.
 *	[Added] Added handling for the idDevice/deviceName and idTopology/topologyName during the
 *	login/authorisation-process, saving which device and location we're dealing with.
 *	[Added] Added method handleLocation() and addLocationOptions() for handling a user's location
 *	(the location will be returned if one can be detected) and/or showing a list/expanding a select-
 *	element when the user must choose the location manually.
 *
 *  2020-08-07		1.20.219	SvB
 *  	[Added] Added automatic handling for the iam-parameter in order to be able to pretend to
 *	be another device.
 *
 *  2020-07-23		1.20.204	SvB
 *  	[Added] Added handling for the COCOS_APPLICATION_LOG_WELCOME_TO_API define. When set to
 *	false, to application won't log to the CoCoS API on startup.
 *
 *  2020-05-06		1.20.126	SvB
 *  	[Changed] Changed method _handleNetworkInterruption. The full URL of the request will be
 *  	stored in the requestMessage.
 *
 *  2020-05-04		1.20.124	SvB
 *  	[Added] Added methods getVersion and getVersions for getting information about the version
 *  	of the JavaScript Application SDK and/or the JS CoCoS SDK and Application-version.
 *  	[Changed] Changed the debugConsole. Instead of by a parameter, is can also be activated
 *  	(hidden or visible) by the define COCOS_APPLICATION_DEBUG_CONSOLE. When logging to the
 *  	console, messages will also be stored into the local _consoleMessages-variable, which can be
 *  	used to produce a log of the lines/messages reported.
 *  	[Changed] All log-functions (logType, logTypeToConsole, logTypeToApi) have been extended
 *  	with callback functions for success and error.
 *  	[Added] Method reportConsoleLogs added in order to report the logs from the variable
 *  	_consoleMessages to the CoCoS API or the /apps/report-app or via mail. If one fails, the
 *  	next option will be tried.
 *  	[Added] Added methods doReload and showReload. Optionally, when doing a reload, cookies can
 *  	be cleared.
 *
 *  2020-04-28		1.20.118	SvB
 *  	[Changed] Changed handling of httpStatusCode 0. Instead of directly going into outOfUse or
 *  	reloading the application, a message will be shown using toastr (if available) or sweetAlert
 *  	(if available), otherwise JavaScript's alert() itself, telling the user the action taken
 *  	couldn't be performed due to network issues. A small/single interruption in the network can
 *  	be intercepted this way. When multiple network-issues have been detected, the application 
 *  	will reload, after reporting the network-interception to the API.
 *  	[Fixed] Added parameter errorWithoutCredentials onto the _loginOntoCoCoSAPI-method in order
 *  	to tell is must execute the callbackError instead of the callbackSuccess when no loginToken
 *  	and/or loginUsername+loginPassword can be found.
 *
 *  2019-12-13		1.19.346	SvB
 *  	[Changed] Changed function showLoading, using default title and message from the textlib.
 *  	
 *  2018-09-27		1.18.269	SvB
 *  	Major changed to the '
 *  	start' of a application, checking languages from the initTextLib and
 *  	the textTags from the API. Comparing the received tags from both libraries and creating or
 *  	updating missing values back to the API.
 *
 *  2018-12-07		1.18.340	SvB
 *	Some minor changes in the handling/catching errors when no initTextLib.json or
 *	initConfig.json can be found.
 * 	Started implementation for the COCOS_APPLICATION_ACT_DEVICE constant, which can be used to
 * 	tell the application it should act as an device. This means it will use the CoCoS API to
 * 	identify itself.
 *	Added loadView-function, in order to dynamically load views (HTML-templates from the /views
 * 	directory of the application) and, when found, placing them into the given selector or 
 * 	DOM-element.
 * 	
 *  2018-12-21		1.18.354	SvB
 *  	Lots and lots of changes to the CoCoS Application SDK. It now fully supports the 
 *  	COCOS_APPLICATION_ACT_DEVICE constant. When the application will act as device, it will get
 *  	the data, textlibs, configs and tags from the device, also, the status-tag will be used to
 *  	indicate the status of the application, the event-list will be handled automatically, the
 *  	creation of texts and configs will be linked to the device.
 *  	Also, since this version, it's advised not to store the apiKey and loginToken in the config
 *  	of the application, these will not come from the URL (if given).
 *  	More and better handling of errors, consoleDebug, stepTracing (during the startup of the
 *  	application), outOfUse and loaders. Loader now features a css-keyframe-animation instead of
 *  	a gif. So it's much smaller to load / implement and better scalable.
 *  	
 *  2019-01-14		1.19.013	SvB
 *  	More and more changes to the CoCoS Application SDK. Added the heartbeat-monitor. Patching
 *  	status and version to the CoCoS API for the application, sending configs and textlibs via
 *  	deviceActions, added implementation for deviceKeys, added functions for logging to the
 *  	CoCoS API (based on the settings for the device). Better/more secure handlings for the
 *  	reboot of a device , more documentation in the code. Better handling of errors when getting
 *  	configs, textlibs, identifying as device, logging in etc.
 *  	
 *  2019-01-15		1.19.014	SvB
 *  	Improved the _checkApiAvailableForReload and _checkAppAvailableForReload-function for a more
 *  	secure check / better response and making sure the given callbackFunctions will always be
 *  	called after the functions we're completed.
 *  	
 *  2019-01-16		1.19.015	SvB
 *  	Added extra error-handlers for the isAvailable-function from the CoCoS API SDK.
 *  	
 *  2019-02-11		1.19.041	SvB
 *  	Changed the requestHandler.retry-call() in order to automatically logIn after receiving a
 *  	401 Unauthorized httpStatusCode from the CoCoS API.
 *  	
 *  2019-04-21		1.19.110	SvB
 *  	Added deprecated function showOutOfUse in order to maintain backwards compatible.
 *  	
 *  2019-05-21		1.19.140	SvB
 *  	Added handling for COCOS_APPLICATION_IN_MAINTENANCE_MODE constant, which allows to enable
 *  	the maintenance-mode for non-device-applications.
 *
 *  2019-08-28		1.19.239	SvB
 *  	[Added] Defined COCOS_APPLICATION_USE_CONFIG and COCOS_APPLICATION_USE_TEXTLIB can now be set
 * 	to local, in order to use the values from the JSON-files initTextlib.json and initConfig.json, 
 *	without sending them to the CoCoS API.
 *	[Added] Added functions for setting minimum and maximum screen width and height. An overlay-
 *	message will be added which will be shown/hidden using css media-queries, based on the clients
 *	resolution.
 *  	
 * -------------------------------------------------------------------------------------------------
 *
 * # FILEDESCRIPTION:
 * 
 * This file can be seen as the 'base' of a application, build to run on the CoCoS API. It will be
 * the 'heart' of an application, taking care of things like logging in, getting configurations and
 * texts from the API. When everything is successfully 'started', the appIsReadyToGo()-function will
 * be called. In that function, the rest of the application can be started.
 * 
 * Unlike the CoCoS API SDK, which is build completely using native JavaScript, this file will need
 * to have a jQuery-object available in order to run. Otherwise, an error will be thrown.
 * 
 * A CoCoS Default-App:
 * 
 *  - Can be configured using the COCOS_APPLICATION_ACT_DEVICE constant/variable. When enabled, an
 *    application will identify itself at the API, checking (based on the ipAddress) if it may run
 *    or not.
 *  - Can be
 * 
 */

// This is the variable which holds the cocosApplication()-object
//
var app					=	null;

// This is the variable which holds the cocosAPI()-object
//
var apiConnector			=	null;

var JS_APP_SDK_VERSION			=	'1.20.223';

// Variables for debug-purposes / debug-console.
//
var _debugConsoleEnabled		=	false;
var _debugConsoleVisible		=	false;
var _debugConsoleCounter		=	0;
var _consoleMessages 			=	[];

// Defines / constants for COCOS
var DEBUG_ORIGIN_APPLICATION_SDK	=	'application';
var DEBUG_ORIGIN_API_CONNECTOR		=	'api';
var DEBUG_ORIGIN_DEVICE			=	'device';
var DEBUG_ORIGIN_CONFIG			=	'config';
var DEBUG_ORIGIN_TEXTLIB		=	'textlib';
var DEBUG_ORIGIN_TAGS			=	'taglist';
var DEBUG_ORIGIN_EVENTS			=	'eventList';

var COCOS_LOG_TYPE_ERRROR		=	'error';
var COCOS_LOG_TYPE_WARNING		=	'warning';
var COCOS_LOG_TYPE_INFO			=	'info';
var COCOS_LOG_TYPE_SUCCESS		=	'success';
var COCOS_LOG_TYPE_DEBUG		=	'debug';

// Defines / constants for COCOS
var COCOS_WILDCARD_IDENTIFIER		=	'***';

var COCOS_TEXTLIB_DEFAULTVALUE		=	'-';
var COCOS_TEXTLIB_GLOBALPREFIX		=	'globalText_';
var COCOS_TEXTLIB_SPECIFICPREFIX	=	'specificText_';

var COCOS_LANGUAGE_GLOBALPREFIX		=	'globalText_';
var COCOS_LANGUAGE_SPECIFICPREFIX	=	'specificText_';

var COCOS_DEVICE_STATUS_OFFLINE		=	0;

var COCOS_DEVICE_STATUS_INITIALIZING	=	0x1;
var COCOS_DEVICE_STATUS_RUNNING		=	0x2;
var COCOS_DEVICE_STATUS_STOPPING	=	0x4;
var COCOS_DEVICE_STATUS_RECONNECTING	=	0x8;

var COCOS_DEVICE_STATUS_CONNECTING	=	0x10;
var COCOS_DEVICE_STATUS_DISCONNECTING	=	0x40;
var COCOS_DEVICE_STATUS_DISCONNECTED	=	0x80;

var COCOS_DEVICE_STATUS_WARNING		=	0x100;
var COCOS_DEVICE_STATUS_ERROR		=	0x200;
var COCOS_DEVICE_STATUS_RESTARTING	=	0x400;
// var COCOS_DEVICE_STATUS_??		=	0x800;
// 
// var COCOS_DEVICE_STATUS_??		=	0x1000;
// var COCOS_DEVICE_STATUS_??		=	0x2000;
// var COCOS_DEVICE_STATUS_??		=	0x4000;
var COCOS_DEVICE_STATUS_SIMULATION	=	0x8000;

var COCOS_DEVICE_STATUS_LOST		=	0x10000;
var COCOS_DEVICE_STATUS_GONE		=	0x20000;
// var COCOS_DEVICE_STATUS_??		=	0x40000;
// var COCOS_DEVICE_STATUS_??		=	0x80000;
// 
// var COCOS_DEVICE_STATUS_??		=	0x100000;
// var COCOS_DEVICE_STATUS_??		=	0x200000;
// var COCOS_DEVICE_STATUS_??		=	0x400000;
// var COCOS_DEVICE_STATUS_??		=	0x800000;
// 
// var COCOS_DEVICE_STATUS_??		=	0x1000000;
// var COCOS_DEVICE_STATUS_??		=	0x2000000;
// var COCOS_DEVICE_STATUS_??		=	0x4000000;
// var COCOS_DEVICE_STATUS_??		=	0x8000000;

var cocosApplicationScriptsToLoad	=	0;
var cocosApplicationScriptsLoaded	=	0;

var cocosApplicationStylesToLoad	=	0;
var cocosApplicationStylesLoaded	=	0;

// Start by checking the availability of jQuery. When not found, exit with an error directly.
//
if (typeof(jQuery) == 'undefined')
{
	console.error('jQuery not available. Please include jQuery in order to use the CoCoS-Application-SDK');
}
else
{
	// Check for the existence of the getRequestParameter-function. When not found, go create
	// the function, so we're sure we can use it.
	//
	if(typeof(getRequestParameter) !== 'function')
	{
		function getRequestParameter(name, url)
		{
			if (!url) url = location.href;
			name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
			var regexS = "[\\?&]"+name+"=([^&#]*)";
			var regex = new RegExp( regexS );
			var results = regex.exec( url );
			return results == null ? null : results[1];
		}
	}

	
	/**
	 * In the window.onload-function, go create an array for the extra external scripts and
	 * external stylesheets we'll need. 
	 */
	$(window).on('load', function()
	{
		cocosApplicationScriptsToLoad = 0;
		cocosApplicationStylesToLoad = 0;

		// Go create array for scripts
		//
		var cocosApplicationScripts = [];
		cocosApplicationScripts.push('/sdk/js/cocos-javascript-functions.js');
		cocosApplicationScripts.push('/sdk/js/cocos-jquery-functions.js');
		cocosApplicationScripts.push('/sdk/js/cocos-api-sdk.js');

		// Go create array for stylesheets
		//
		var cocosApplicationStyles = [];

		// Only add the cocos-reset.css file, when the cocosApplicationUseResetCss() allows
		// it. This function will check a constant/define in order to determine whether or
		// not the reset-css should be added/used.
		//
		if(cocosApplicationUseResetCss())
		{
			cocosApplicationStyles.push('/sdk/css/cocos-reset.css');
		}
		cocosApplicationStyles.push('/sdk/css/cocos-classes.css');

		// Go count arrays for scripts and stylesheets and store them lengths in the
		// cocosApplicationScriptsToLoad- and cocosApplicationStylesToLoad-counters, so
		// we'll known how many resources we must load.
		//
		cocosApplicationScriptsToLoad = cocosApplicationScripts.length;
		cocosApplicationStylesToLoad = cocosApplicationStyles.length;

		// Check if any scripts must be loaded
		//
		if(cocosApplicationScriptsToLoad > 0)
		{
			// Get the head-element
			//
			var head = document.getElementsByTagName('head')[0];

			$.each(cocosApplicationScripts, function(k, cocosApplicationScript)
			{
				// Check if no script is already found with the same src. If not,
				// go create the script-element and add insert it onto the head-
				// element.
				//
				if($('script[src^=\''+cocosApplicationScript+'\']').length == 0)
				{
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.onload = function()
					{
						// When loaded, increase the counter for the
						// cocosApplicationScriptsLoaded variable and call
						// the cocosApplicationCheckResources()-method.
						//
						cocosApplicationScriptsLoaded++;
						cocosApplicationCheckResources(cocosApplicationScript);
					}
					script.onerror = function()
					{
						// Go call the cocosApplicationCheckResources()-
						// method on error, the second parameter set to true
						// will indicate something went wrong.
						//
						cocosApplicationCheckResources(cocosApplicationScript, true);
					}

					// Add timestamp to the href in order to prevent caching.
					//
					script.src = cocosApplicationScript+'?_t='+$.now();
					var firstchild = head.childNodes[0];
					head.insertBefore(script,firstchild);
				}
				else
				{
					// When already loaded, increase the counter for the
					// cocosApplicationScriptsLoaded variable and call the
					// cocosApplicationCheckResources()-method.
					//
					cocosApplicationScriptsLoaded++;
				}
			});
		}

		// Check if any stylesheets must be loaded
		// 
		if(cocosApplicationStyles.length > 0)
		{
			var head = document.getElementsByTagName('head')[0];

			$.each(cocosApplicationStyles, function(k, cocosApplicationStyle)
			{
				// Check if no stylesheet is already found with the same href. If
				// not, go create the link-element and add insert it onto the head-
				// element.
				//
				if($('link[href^=\''+cocosApplicationStyle+'\']').length == 0)
				{
					var link = document.createElement('link');
					link.rel = 'stylesheet';
					link.onload = function()
					{
						// When loaded, increase the counter for the
						// cocosApplicationStylesLoaded variable and call
						// the cocosApplicationCheckResources()-method.
						//
						cocosApplicationStylesLoaded++;
						cocosApplicationCheckResources(cocosApplicationStyle);
					}
					link.onerror = function()
					{
						// Go call the cocosApplicationCheckResources()-
						// method on error, the second parameter set to true
						// will indicate something went wrong.
						//
						cocosApplicationCheckResources(cocosApplicationStyle, true);
					}

					// Add timestamp to the href in order to prevent caching.
					//
					link.href = cocosApplicationStyle+'?_t='+$.now();
					var firstchild = head.childNodes[0];
					head.insertBefore(link,firstchild);
				}
				else
				{
					// When already loaded, increase the counter for the
					// cocosApplicationStylesLoaded variable and call the
					// cocosApplicationCheckResources()-method.
					//
					cocosApplicationStylesLoaded++;
				}
			});
		}

		// Call the cocosApplicationCheckResources()-method. When all scripts and
		// stylesheets are already available, all counters in the variables
		// cocosApplicationScriptsLoaded and cocosApplicationStylesLoaded will be increased
		// to match the cocosApplicationScriptsToLoad- and cocosApplicationStylesToLoad-
		// counters. The cocosApplicationCheckResources will detect everything is loaded and
		// will continue.
		//
		cocosApplicationCheckResources();
	});

	/**
	 * This function will be called after scripts and/or stylesheets are loaded or given an
	 * error. Based on the amount of scripts and/or stylesheets to load and the amount of
	 * scripts and/or styles actually loaded, we can verify that all resources are available. If
	 * so, we'll continue by calling the startCoCoSApplication()-method.
	 * 
	 * @param      {string}   resourceUrl  The URL of the resource to load
	 * @param      {boolean}  error        Boolean indicating whether or not the load was
	 *                                     successful.
	 */
	function cocosApplicationCheckResources(resourceUrl, error)
	{
		// Check if loading the resources gave an error. If so, show/append the missing URL
		// to the list of resources.
		//
		if(error === true)
		{	
			if($('ul#faulyCoCoSApplicationResources').length == 0)
			{
				$('body').html('<h1 style=\'margin: 10px\'>Error</h1><br><p style=\'margin: 10px\'>Unable to load applicationResources:<br><ul id=\'faulyCoCoSApplicationResources\'></ul><hr>');
			}
			$('ul#faulyCoCoSApplicationResources').append('<li>' + resourceUrl + '</li>');

			// When loading a resource went wrong, we'll set a timeout for 60 seconds.
			// After this time, the application will reload itself again as long as one
			// or multiple resources can't be loaded.
			//
			setTimeout(function()
			{
				window.location.reload();
			}, 60000);
		}

		// Otherwise, check if all resources that should be loaded are available. If so, go
		// call the startCoCoSApplication()-method.
		else
		{
			if((cocosApplicationScriptsLoaded >= cocosApplicationScriptsToLoad) && (cocosApplicationStylesLoaded >= cocosApplicationStylesToLoad))
			{
				startCoCoSApplication();
			}
		}
	}

	/**
	 * Starts the CoCoS Application.
	 */
	function startCoCoSApplication(withDebugConsole)
	{
		// Check if the debug-parameter in the URL is set to 'trace' or 'true' or the
		// cocosApplicationUseDebugConsole()-method, based on a constant/define, tells us
		// to use the debugConsole.
		//
		if(((getRequestParameter('debug') == 'trace') || (getRequestParameter('debug') == 'true')) || isTrue(cocosApplicationUseDebugConsole()))
		{
			// Go enable the debugConsole. Use the result from the method
			// cocosApplicationHideDebugConsole() to indicate whether or not the
			// debugConsole should be hidden.
			// 
			enableDebugConsole(cocosApplicationHideDebugConsole());
			logToConsole('Console debug enabled');
		}	

		logToConsole('Go initialize cocosApplication');

		app = new cocosApplication
		(
		 	function(isAuthorized, isLoggedIn, userData, isDevice, isDeviceActive, deviceData, topologyData)
			{
				setTimeout
				(
					function()
					{
						cocosApplicationSuccesfullyLoaded(isAuthorized, isLoggedIn, userData, isDevice, isDeviceActive, deviceData, topologyData)
					},
					1
				);
			},

			// We'll set the second parameter to false to prevent the application from
			// starting immediately. We only create the cocosApplication-object here.
			// 
			false
		);

		// After the app is created successfully, go start. If the start()-method completes,
		// the cocosApplication will go look for the appIsReadyToGo- or appIsReadyToLogin-
		// function. When found, these will be called, from where the developer can create
		// it's own application further, build on top of the cocosApplication.
		// 
		if((typeof(app) != 'undefined') && (typeof(app.start) == 'function'))
		{
			app.start();
		}
	}

	/**
	 * { function_description }
	 *
	 * @param      {string}  isAuthorized    Indicates if authorized
	 * @param      {string}  isLoggedIn      Indicates if logged in
	 * @param      {<type>}  userData        The user data
	 * @param      {string}  isDevice        Indicates if device
	 * @param      {string}  isDeviceActive  Indicates if device active
	 * @param      {<type>}  deviceData      The device data
	 */
	function cocosApplicationSuccesfullyLoaded(isAuthorized, isLoggedIn, userData, isDevice, isDeviceActive, deviceData, topologyData)
	{
		var applicationTitle = app.getConfigVar('title');

		if(!isEmpty(applicationTitle) && !isNull(applicationTitle))
		{
			document.title = applicationTitle;
		}

		var faviconRel = 'icon';
		var faviconType = 'image/x-icon';

		if($('head').find('link[rel=\''+faviconRel+'\']').length == 0)
		{
			$('head').append('<link rel=\''+faviconRel+'\' type=\''+faviconType+'\' href=\''+app.getFaviconSrc()+'\' />');
		}
		
		if(!isTrue(isDevice) || (isTrue(isDevice) && isTrue(isDeviceActive)))
		{
			if(isTrue(isAuthorized))
			{
				logToConsole('Successfully initialized application, go find appIsReadyToGo-function!', DEBUG_ORIGIN_APPLICATION_SDK);

				if(typeof(appIsReadyToGo) === 'function')
				{	
					if(!cocosApplicationKeepLoader())
					{
						logToConsole('Variable COCOS_APPLICATION_KEEP_LOADER not set or false, go hide loader', DEBUG_ORIGIN_APPLICATION_SDK);
						app.isReady();
					}
					
					logSuccessToConsole('appIsReadyToGo-function found, calling it.', DEBUG_ORIGIN_APPLICATION_SDK);	
					appIsReadyToGo(isAuthorized, isLoggedIn, userData, deviceData, topologyData);

					if(isTrue(isAuthorized))
					{
						// Added: Log info to API.
						//
						logInfo('Application loaded and started successfully. ('+app.getVersions(true)+')', DEBUG_ORIGIN_APPLICATION_SDK, true, cocosApplicationLogWelcomeMessageToApi());
					}
				}
				else
				{
					logError('No appIsReadyToGo-function found, application stopped.');
					app.showApplicationOutOfUse('Deze applicatie kon niet gestart worden...');
				}
			}
			else
			{
				logToConsole('Successfully initialized application, go find appIsReadyToGo/appIsReadyToLogin-function!', DEBUG_ORIGIN_APPLICATION_SDK);

				if(typeof(appIsReadyToLogin) === 'function')
				{
					if(!cocosApplicationKeepLoader())
					{
						logToConsole('Variable COCOS_APPLICATION_KEEP_LOADER not set or false, go hide loader', DEBUG_ORIGIN_APPLICATION_SDK);
						app.isReady();
					}
					
					logSuccessToConsole('appIsReadyToLogin-function found, calling it.', DEBUG_ORIGIN_APPLICATION_SDK);	
					appIsReadyToLogin(isAuthorized, isLoggedIn, userData, deviceData, topologyData);

					if(isTrue(isAuthorized))
					{
						// Added: Log info to API.
						//
						logInfo('Application loaded, ready for login. ('+app.getVersions(true)+')', DEBUG_ORIGIN_APPLICATION_SDK, true, cocosApplicationLogWelcomeMessageToApi());
					}
				}
				else if(typeof(appIsReadyToGo) === 'function')
				{	
					if(!cocosApplicationKeepLoader())
					{
						logToConsole('Variable COCOS_APPLICATION_KEEP_LOADER not set or false, go hide loader', DEBUG_ORIGIN_APPLICATION_SDK);
						app.isReady();
					}
					
					logSuccessToConsole('appIsReadyToGo-function found, calling it.', DEBUG_ORIGIN_APPLICATION_SDK);
					appIsReadyToGo(isAuthorized, isLoggedIn, userData, deviceData, topologyData);

					if(isTrue(isAuthorized))
					{
						// Added: Log info to API.
						//
						logInfo('Application loaded and started successfully. ('+app.getVersions(true)+')', DEBUG_ORIGIN_APPLICATION_SDK, true, cocosApplicationLogWelcomeMessageToApi());
					}
				}
				else
				{
					logError('No appIsReadyToGo/appIsReadyToLogin-function found, application stopped.');
					app.showApplicationOutOfUse('Deze applicatie kon niet gestart worden...');
				}

			}
		}
		else
		{
			logInfoToConsole('Successfully initialized application, unable to identify as device, go stop here.');
			app.showDeviceOutOfUse();
			app.enableReloadWhenDeviceActivates();
		}
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationUseResetCss()
	{
		return ((typeof(COCOS_APPLICATION_STYLE_RESET) == 'undefined') || (COCOS_APPLICATION_STYLE_RESET === true));
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationActAsDevice()
	{
		return ((typeof(COCOS_APPLICATION_ACT_DEVICE) != 'undefined') && (COCOS_APPLICATION_ACT_DEVICE === true));
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationActAsApplication()
	{
		return ((typeof(COCOS_APPLICATION_ACT_APPLICATION) == 'undefined') || (COCOS_APPLICATION_ACT_APPLICATION === false));
	}	

	/**
	 * { function_description }
	 *
	 * @return     {boolean}  { description_of_the_return_value }
	 */
	function cocosApplicationInMaintenanceMode()
	{
		return ((typeof(COCOS_APPLICATION_IN_MAINTENANCE_MODE) != 'undefined') && (COCOS_APPLICATION_IN_MAINTENANCE_MODE === true));
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationUseDebugConsole()
	{
		return ((typeof(COCOS_APPLICATION_DEBUG_CONSOLE) != 'undefined') && ((COCOS_APPLICATION_DEBUG_CONSOLE === true) || (COCOS_APPLICATION_DEBUG_CONSOLE === 'hidden') || (COCOS_APPLICATION_DEBUG_CONSOLE === 'hide')));
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationHideDebugConsole()
	{
		return ((typeof(COCOS_APPLICATION_DEBUG_CONSOLE) != 'undefined') && ((COCOS_APPLICATION_DEBUG_CONSOLE === 'hidden') || (COCOS_APPLICATION_DEBUG_CONSOLE === 'hide')));
	}

	function cocosApplicationLogWelcomeMessageToApi()
	{
		return ((typeof(COCOS_APPLICATION_LOG_WELCOME_TO_API) == 'undefined') || (COCOS_APPLICATION_LOG_WELCOME_TO_API === true));
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationUseFiles()
	{
		return ((typeof(COCOS_APPLICATION_USE_FILES) == 'undefined') || (COCOS_APPLICATION_USE_FILES === true));
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationUseConfig()
	{
		return ((typeof(COCOS_APPLICATION_USE_CONFIG) != 'undefined') && ((COCOS_APPLICATION_USE_CONFIG === true) || (COCOS_APPLICATION_USE_CONFIG === 'local')));
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationUseLocalConfig()
	{
		return ((typeof(COCOS_APPLICATION_USE_CONFIG) != 'undefined') && (COCOS_APPLICATION_USE_CONFIG === 'local'));
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationUseTextlib()
	{
		return ((typeof(COCOS_APPLICATION_USE_TEXTLIB) != 'undefined') && ((COCOS_APPLICATION_USE_TEXTLIB === true) || (COCOS_APPLICATION_USE_TEXTLIB === 'local')));
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationUseLocalTextlib()
	{
		return ((typeof(COCOS_APPLICATION_USE_TEXTLIB) != 'undefined') && (COCOS_APPLICATION_USE_TEXTLIB === 'local'));
	}

	/**
	 * { function_description }
	 *
	 * @return     {Object}  { description_of_the_return_value }
	 */
	function cocosApplicationGetLibraryCollectionType()
	{
		var library = '';
		var collection = '';
		var type = '';
		
		if(
			((typeof(APP_CONFIG_LIBRARY) != 'undefined') && (APP_CONFIG_LIBRARY != ''))
			&& ((typeof(APP_CONFIG_COLLECTION) != 'undefined') && (APP_CONFIG_COLLECTION != ''))
			&& ((typeof(APP_CONFIG_TYPE) != 'undefined') && (APP_CONFIG_TYPE != ''))
		) {
			library = APP_CONFIG_LIBRARY;
			collection = APP_CONFIG_COLLECTION;
			type = APP_CONFIG_TYPE;
		}		
		else if(
			((typeof(COCOS_APPLICATION_LIBRARY) != 'undefined') && (COCOS_APPLICATION_LIBRARY != ''))
			&& ((typeof(COCOS_APPLICATION_COLLECTION) != 'undefined') && (COCOS_APPLICATION_COLLECTION != ''))
			&& ((typeof(COCOS_APPLICATION_TYPE) != 'undefined') && (COCOS_APPLICATION_TYPE != ''))
		) {
			library = COCOS_APPLICATION_LIBRARY;
			collection = COCOS_APPLICATION_COLLECTION;
			type = COCOS_APPLICATION_TYPE;
		}
		else
		{
			return null;
		}
		
		return {library: library, collection: collection, type: type};
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationKeepLoader()
	{
		return ((typeof(COCOS_APPLICATION_KEEP_LOADER) != 'undefined') && (COCOS_APPLICATION_KEEP_LOADER === true));
	}

	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	function cocosApplicationMonitorHeartbeat()
	{
		return ((typeof(COCOS_APPLICATION_MONITOR_HEARTBEAT) == 'undefined') || (COCOS_APPLICATION_MONITOR_HEARTBEAT === true));
	}

	/**
	 * [cocosApplicationAllowNoLicense description]
	 * @return {[type]} [description]
	 */
	function cocosApplicationAllowNoLicense()
	{
		return ((typeof(COCOS_APPLICATION_ALLOW_NO_LICENSE) != 'undefined') && (COCOS_APPLICATION_ALLOW_NO_LICENSE === true));
	}

	/**
	 * [cocosApplicationIsLicenseError description]
	 * @param  {[type]} error [description]
	 * @return {[type]}       [description]
	 */
	function cocosApplicationIsLicenseError(error)
	{
		return (error.toLowerCase().indexOf('no license') > -1);
	}
}

/**
 * Enables the debug console.
 */
var enableDebugConsole = function(hidden)
{
	_debugConsoleEnabled = true;
	_debugConsoleVisible = true;

	$('body').append
	(
	 	'<div id=\'overlayCoCoSDebugConsole\' style=\'width: 100%; height: 100%; position: absolute; z-index: 999999; left: 0; top: 0; background-color: rgba(255,255,255,0.8);\'>' 
			+ '<div id=\'popupCoCoSDebugConsole\' style=\'width: 90%; height: 90%; position: absolute; z-index: 999999; left: 5%; top: 5%; background-color: #FFFFFF; -webkit-box-shadow: 0px 0px 40px 0px rgba(33,33,33,0.75); -moz-box-shadow: 0px 0px 40px 0px rgba(33,33,33,0.75); box-shadow: 0px 0px 40px 0px rgba(33,33,33,0.75);\'>'
				+ '<div style=\'width: 100%; height: 40px; background-color: #212121; float: left;\'>'
					+ '<p style=\'margin: 0px; padding: 8px 20px; color: #FFFFFF; line-height: 24px; font-size: 20px; float: left;\'> Debug console </p>'
					+ '<div data-action=\'closeCoCoSDebugConsole\' style=\'width: 40px; height: 40px; float: right; background-color: #BB0000; color: #FFFFFF; line-height: 40px; text-align: center; font-size: 32px; font-family: Arial; cursor: pointer;\' onMouseOver=\'this.style.backgroundColor="#DD0000"\' onMouseOut=\'this.style.backgroundColor="#BB0000"\'>&times;</div>'
				+ '</div>'
				+ '<div style=\'width: 100%; height: calc(100% - 70px); background-color: #FFFFFF; float: left;\'>'
					+ '<div id=\'contentCoCoSDebugConsole\' style=\'width: calc(100% - 40px); height: calc(100% - 40px); overflow-y: scroll; background-color: #EEEEEE; margin: 20px; padding: 10px 0px; font-size: 12px; font-family: Arial;\'>'
					+ '</div>'
				+ '</div>'
				+ '<div style=\'width: 100%; height: 30px; background-color: #212121; float: left;\'>'
					+ '<button data-action=\'sendCoCoSDebugConsole\' style=\'width: 100px; height: 20px; margin: 5px; padding: 0px; float: left; background-color: #CCCCCC; color: #333333; line-height: 20px; text-align: center; font-size: 12px; font-family: Arial; cursor: pointer;\' onMouseOver=\'this.style.backgroundColor="#DDDDDD"\' onMouseOut=\'this.style.backgroundColor="#CCCCCC"\'> Send/report logs </button>'
				+ '</div>'
			+ '</div>'
		+ '</div>'
	);

	if($('body').find('[data-action=\'openCoCoSDebugConsole\']').length == 0)
	{
		$('body').append
		(
			'<div data-action=\'openCoCoSDebugConsole\' style=\'display: none; width: 40px; height: 40px; position: absolute; top: -2px; right: -2px; right; border: 2px solid #FFFFFF; background-color: #76AF0A; color: #FFFFFF; line-height: 20px; text-align: center; font-size: 10px; font-family: Arial; cursor: pointer; z-index: 9999\' onMouseOver=\'this.style.backgroundColor="#637B44"\' onMouseOut=\'this.style.backgroundColor="#76AF0A"\'>Debug<br>console</div>'
		);
	}

	$('body').find('[data-action=\'closeCoCoSDebugConsole\']').off('click').on('click', function()
	{
		_debugConsoleVisible = false;

		$('body').find('#overlayCoCoSDebugConsole').hide();
		
		$('body').find('[data-action=\'openCoCoSDebugConsole\']').css({'border': '2px solid #FFFFFF'});
		$('body').find('[data-action=\'openCoCoSDebugConsole\']').show();
	});

	$('body').find('[data-action=\'openCoCoSDebugConsole\']').off('click').on('click', function()
	{
		$('body').find('[data-action=\'openCoCoSDebugConsole\']').css({'border': '2px solid #FFFFFF'});
		$('body').find('[data-action=\'openCoCoSDebugConsole\']').hide();
		
		$('body').find('#overlayCoCoSDebugConsole').show();

		_debugConsoleVisible = true;
	});

	$('body').find('[data-action=\'sendCoCoSDebugConsole\']').off('click').on('click', function()
	{
		$('body').find('[data-action=\'sendCoCoSDebugConsole\']').attr('disabled', true);
		app.reportConsoleLogs(
			null,
			function()
			{
				$('body').find('[data-action=\'sendCoCoSDebugConsole\']').removeAttr('disabled');
				logSuccessToConsole('Reports succesfully sent');
			},
			function()
			{
				$('body').find('[data-action=\'sendCoCoSDebugConsole\']').removeAttr('disabled');
				logErrorToConsole('Error sending logs.');
			}
		);
	});

	if(isTrue(hidden))
	{
		_debugConsoleVisible = false;
		$('body').find('#overlayCoCoSDebugConsole').hide();
		
		$('body').find('[data-action=\'openCoCoSDebugConsole\']').css({'border': '2px solid #FFFFFF'});
		$('body').find('[data-action=\'openCoCoSDebugConsole\']').show();
	}
}

/**
 * Gets the console output.
 *
 * @return     {string}  The console output.
 */
function getConsoleOutput(comments)
{
	if(!isEmpty(comments))
	{
		comments = 'User-feedback: \'' + comments + '\''+"\n\n";
	}
	else
	{
		comments = '';
	}

	return comments + app.getVersions(true) + "\n\n" + _consoleMessages.join("\n\n");
}

/**
 * Logs an error-message to console (and optionally to the CoCoS API).
 *
 * @param      {<type>}  message   The message
 * @param      {<type>}  origin    The origin
 * @param      {<type>}  logToApi  The log to api
 */
var logErrorToConsole = function(message, origin, logToApi, comments, callbackSuccess, callbackError)
{	
	logError(message, origin, true, (logToApi === true), comments, callbackSuccess, callbackError);
}

/**
 * Logs an error-message to the CoCoS API (and optionally to the console).
 *
 * @param      {<type>}  message       The message
 * @param      {<type>}  origin        The origin
 * @param      {<type>}  logToConsole  The log to console
 */
var logErrorToApi = function(message, origin, logToConsole, comments, callbackSuccess, callbackError)
{
	logError(message, origin, (logToConsole === true), true, comments, callbackSuccess, callbackError);
}

/**
 * Logs an error-message to the console and/or the CoCoS API.
 *
 * @param      {<type>}    message       The message
 * @param      {<type>}    origin        The origin
 * @param      {Function}  logToConsole  The log to console
 * @param      {<type>}    logToApi      The log to api
 */
var logError = function(message, origin, logToConsole, logToApi, comments, callbackSuccess, callbackError)
{
	//
	_handleLog(message, origin, COCOS_LOG_TYPE_ERRROR, logToConsole, logToApi, comments, callbackSuccess, callbackError);
}

/**
 * Logs a warning-message to console (and optionally to the CoCoS API).
 *
 * @param      {<type>}  message   The message
 * @param      {<type>}  origin    The origin
 * @param      {<type>}  logToApi  The log to api
 */
var logWarningToConsole = function(message, origin, logToApi, comments, callbackSuccess, callbackError)
{
	logWarning(message, origin, true, (logToApi === true), comments, callbackSuccess, callbackError);
}

/**
 * Logs a warning-message to the CoCoS API (and optionally to the console).
 *
 * @param      {<type>}  message       The message
 * @param      {<type>}  origin        The origin
 * @param      {<type>}  logToConsole  The log to console
 */
var logWarningToApi = function(message, origin, logToConsole, comments, callbackSuccess, callbackError)
{
	logWarning(message, origin, (logToConsole === true), true, comments, callbackSuccess, callbackError);
}

/**
 * Logs a warning-message to the console and/or the CoCoS API.
 *
 * @param      {<type>}    message       The message
 * @param      {<type>}    origin        The origin
 * @param      {Function}  logToConsole  The log to console
 * @param      {<type>}    logToApi      The log to api
 */
var logWarning = function(message, origin, logToConsole, logToApi, comments, callbackSuccess, callbackError)
{
	//
	_handleLog(message, origin, COCOS_LOG_TYPE_WARNING, logToConsole, logToApi, comments, callbackSuccess, callbackError);
}

/**
 * Logs an info-message to console (and optionally to the CoCoS API).
 *
 * @param      {<type>}  message   The message
 * @param      {<type>}  origin    The origin
 * @param      {<type>}  logToApi  The log to api
 */
var logInfoToConsole = function(message, origin, logToApi, comments, callbackSuccess, callbackError)
{
	logInfo(message, origin, true, (logToApi === true), comments, callbackSuccess, callbackError);
}

/**
 * Logs an info-message to the CoCoS API (and optionally to the console).
 *
 * @param      {<type>}  message       The message
 * @param      {<type>}  origin        The origin
 * @param      {<type>}  logToConsole  The log to console
 */
var logInfoToApi = function(message, origin, logToConsole, comments, callbackSuccess, callbackError)
{
	logInfo(message, origin, (logToConsole === true), true, comments, callbackSuccess, callbackError);
}

/**
 * Logs an info-message to the console and/or the CoCoS API.
 *
 * @param      {<type>}    message       The message
 * @param      {<type>}    origin        The origin
 * @param      {Function}  logToConsole  The log to console
 * @param      {<type>}    logToApi      The log to api
 */
var logInfo = function(message, origin, logToConsole, logToApi, comments, callbackSuccess, callbackError)
{
	_handleLog(message, origin, COCOS_LOG_TYPE_INFO, logToConsole, logToApi, comments, callbackSuccess, callbackError);
}

/**
 * Logs a success-message to console (and optionally to the CoCoS API).
 *
 * @param      {<type>}  message   The message
 * @param      {<type>}  origin    The origin
 * @param      {<type>}  logToApi  The log to api
 */
var logSuccessToConsole = function(message, origin, logToApi, comments, callbackSuccess, callbackError)
{
	logSuccess(message, origin, true, (logToApi === true), comments, callbackSuccess, callbackError);
}

/**
 * Logs a success-message to the CoCoS API (and optionally to the console).
 *
 * @param      {<type>}  message       The message
 * @param      {<type>}  origin        The origin
 * @param      {<type>}  logToConsole  The log to console
 */
var logSuccessToApi = function(message, origin, logToConsole, comments, callbackSuccess, callbackError)
{
	logSuccess(message, origin, (logToConsole === true), true, comments, callbackSuccess, callbackError);
}

/**
 * Logs a success-message to the console and/or the CoCoS API.
 *
 * @param      {<type>}    messages      The messages
 * @param      {<type>}    origin        The origin
 * @param      {Function}  logToConsole  The log to console
 * @param      {<type>}    logToApi      The log to api
 */
var logSuccess = function(message, origin, logToConsole, logToApi, comments, callbackSuccess, callbackError)
{
	_handleLog(message, origin, COCOS_LOG_TYPE_SUCCESS, logToConsole, logToApi, comments, callbackSuccess, callbackError);
}

/**
 * Logs a confirm-message to console (and optionally to the CoCoS API).
 *
 * @param      {<type>}  message   The message
 * @param      {<type>}  origin    The origin
 * @param      {<type>}  logToApi  The log to api
 */
var logConfirmToConsole = function(message, origin, logToApi, comments, callbackSuccess, callbackError)
{
	logConfirm(message, origin, true, (logToApi === true), comments, callbackSuccess, callbackError);
}

/**
 * Logs a confirm-message to the CoCoS API (and optionally to the console).
 *
 * @param      {<type>}  message       The message
 * @param      {<type>}  origin        The origin
 * @param      {<type>}  logToConsole  The log to console
 */
var logConfirmToApi = function(message, origin, logToConsole, comments, callbackSuccess, callbackError)
{
	logConfirm(message, origin, (logToConsole === true), true, comments, callbackSuccess, callbackError);
}

/**
 * Logs a confirm-message to the console and/or the CoCoS API.
 *
 * @param      {<type>}    message       The message
 * @param      {<type>}    origin        The origin
 * @param      {Function}  logToConsole  The log to console
 * @param      {<type>}    logToApi      The log to api
 */
var logConfirm = function(message, origin, logToConsole, logToApi, comments, callbackSuccess, callbackError)
{
	_handleLog(message, origin, COCOS_LOG_TYPE_SUCCESS, logToConsole, logToApi, comments, callbackSuccess, callbackError);
}

/**
 * Logs a debug-message to console (and optionally to the CoCoS API).
 *
 * @param      {<type>}  message   The message
 * @param      {<type>}  origin    The origin
 * @param      {<type>}  logToApi  The log to api
 */
var logDebugToConsole = function(message, origin, logToApi, comments, callbackSuccess, callbackError)
{
	logDebug(message, origin, true, (logToApi === true), comments, callbackSuccess, callbackError);
}

/**
 * Logs a debug-message to the CoCoS API (and optionally to the console).
 *
 * @param      {<type>}  message       The message
 * @param      {<type>}  origin        The origin
 * @param      {<type>}  logToConsole  The log to console
 */
var logDebugToApi = function(message, origin, logToConsole, comments, callbackSuccess, callbackError)
{
	logDebug(message, origin, (logToConsole === true), true, comments, callbackSuccess, callbackError);
}

/**
 * Logs a debug-message to the console and/or the CoCoS API.
 *
 * @param      {<type>}    message       The message
 * @param      {<type>}    origin        The origin
 * @param      {Function}  logToConsole  The log to console
 * @param      {<type>}    logToApi      The log to api
 */
var logDebug = function(message, origin, logToConsole, logToApi, comments, callbackSuccess, callbackError)
{
	_handleLog(message, origin, COCOS_LOG_TYPE_DEBUG, logToConsole, logToApi, comments, callbackSuccess, callbackError);
}

/**
 * Logs a message to console (and optionally to the CoCoS API).
 *
 * @param      {<type>}  message   The message
 * @param      {<type>}  origin    The origin
 * @param      {<type>}  logToApi  The log to api
 */
var logMessageToConsole = function(message, origin, logToApi, comments, callbackSuccess, callbackError)
{
	logMessage(message, origin, true, (logToApi === true), comments, callbackSuccess, callbackError);
}

	/**
	 * Logs a message to console (and optionally to the CoCoS API).
	 *
	 * @param      {<type>}  message   The message
	 * @param      {<type>}  origin    The origin
	 * @param      {<type>}  logToApi  The log to api
	 */
	var logToConsole = function(message, origin, logToApi, comments, callbackSuccess, callbackError)
	{
		logMessageToConsole(message, origin, (logToApi === true), comments, callbackSuccess, callbackError);
	}

	/**
	 * Only here for backwards compatibility
	 *
	 * @param      {<type>}  message  The message
	 */
	var traceDebug = function(message)
	{
		logMessageToConsole(message);
	}

/**
 * Logs a message to the CoCoS API (and optionally to the console).
 *
 * @param      {<type>}  message       The message
 * @param      {<type>}  origin        The origin
 * @param      {<type>}  logToConsole  The log to console
 */
var logMessageToApi = function(message, origin, logToConsole, comments, callbackSuccess, callbackError)
{
	logMessage(message, origin, (logToConsole === true), true, comments, callbackSuccess, callbackError);
}

	/**
	 * Logs a message to the CoCoS API (and optionally to the console).
	 *
	 * @param      {<type>}  message       The message
	 * @param      {<type>}  origin        The origin
	 * @param      {<type>}  logToConsole  The log to console
	 */
	var logToApi = function(message, origin, logToConsole, comments, callbackSuccess, callbackError)
	{
		logMessageToApi(message, origin, (logToConsole === true), comments, callbackSuccess, callbackError);
	}

/**
 * Logs a message to the console and/or the CoCoS API.
 *
 * @param      {<type>}  message       The message
 * @param      {<type>}  origin        The origin
 * @param      {<type>}  logToConsole  The log to console
 * @param      {<type>}  logToApi      The log to api
 */
var logMessage = function(message, origin, logToConsole, logToApi, comments, callbackSuccess, callbackError)
{
	_handleLog(message, origin, null, logToConsole, logToApi, comments, callbackSuccess, callbackError);
}

/**
 * Logs a message to console.
 *
 * @param      {string}  message  The message
 * @param      {string}  origin   The origin
 * @param      {<type>}  type     The type
 */
var _handleLog = function(message, origin, type, logToConsole, logToApi, comments, callbackSuccess, callbackError)
{
	if((typeof(logToConsole) == 'undefined') || (logToConsole === true))
	{
		_logToConsole(message, origin, type, comments);
	}

	if((typeof(logToApi) == 'undefined') || (logToApi === true))
	{
		_logToApi(message, origin, type, comments, callbackSuccess, callbackError);
	}
}

/**
 * Logs to console.
 *
 * @param      {string}  message  The message
 * @param      {string}  origin   The origin
 * @param      {<type>}  type     The type
 */
var _logToConsole = function(message, origin, type, comments)
{
	var useConsoleLog = false;

	if((typeof(origin) != 'undefined') && (origin != ''))
	{
		message = '[' + origin + '] :: ' + message;
	}

	if(isset(console))
	{
		switch(type)
		{
			case COCOS_LOG_TYPE_ERRROR:
				if(isFunction(console.error))
				{
					console.error(message);
				}
				else if(isFunction(console.log))
				{
					console.log('ERROR | ' + message);
				}
				break;

			case COCOS_LOG_TYPE_WARNING:
			 	if(isTrue(useConsoleLog))
			 	{
					if(isFunction(console.warn))
					{
						console.warn(message);
					}
					else if(isFunction(console.log))
					{
						console.log('WARNING | ' + message);
					}
				}
				break;

			case COCOS_LOG_TYPE_INFO:
			 	if(isTrue(useConsoleLog))
			 	{
					if(isFunction(console.info))
					{
						console.info(message);
					}
					else if(isFunction(console.log))
					{
						console.log('INFO | ' + message);
					}
				}
				break;

			case COCOS_LOG_TYPE_SUCCESS:
			case 'confirm':
			 	if(isTrue(useConsoleLog))
			 	{
					if(isFunction(console.log))
					{
						console.log('CONFIRM | ' + message);
					}
				}
				break;

			case COCOS_LOG_TYPE_DEBUG:
			 	if(isTrue(useConsoleLog))
			 	{
					if(isFunction(console.debug))
					{
						console.debug(message);
					}
					else if(isFunction(console.log))
					{
						console.log('DEBUG | ' + message);
					}
				}
				break;

			default:
			 	if(isTrue(useConsoleLog))
			 	{
					if(isFunction(console.log))
					{
						console.log(message);
					}
				}
				break;
		}
	}

	if(_debugConsoleEnabled == true)
	{
		_debugConsoleCounter++;

		var color = '#000000';
		var bold = false;
		switch(type)
		{
			case COCOS_LOG_TYPE_ERRROR:
				color = '#CC342B';
				bold = true;
				break;

			case COCOS_LOG_TYPE_WARNING:
				color = '#CCB000';
				break;

			case COCOS_LOG_TYPE_INFO:
				color = '#005DAE';
				break;

			case COCOS_LOG_TYPE_SUCCESS:
			case 'confirm':
				color = '#25A333';
				bold = true;
				break;

			case COCOS_LOG_TYPE_DEBUG:
				color = '#8f4797';
				break;
		}

		var d = new Date();
		$('body').find('#contentCoCoSDebugConsole').prepend('<p style=\'display: block; margin: 0px; padding: 5px 15px; border-bottom: 1px solid #CCCCCC; float: left; clear: left; width: calc(100% - 30px);\'> '
				+ ' <small style=\'font-size: 10px; color: #999999; width:150px; display: inline-block; float: left; line-height: 12px;\'> '
					+ d.toLocaleString() + '&nbsp;|&nbsp;#' + _debugConsoleCounter + '</small> '
				+ ' <font style=\'font-size: 12px; display: inline-block; float: left; width: calc(100% - 150px); line-height: 12px; word-break: break-all; color: '+color+';'+(isTrue(bold)?' font-weight: bold;':'')+'\'> '
					+ message
				+ '</font>'
			+ '</p>');

		// Go remove last row
		if ($('body').find('#contentCoCoSDebugConsole').find('p').length > 250)
		{
			$('body').find('#contentCoCoSDebugConsole').find('p:last-child').remove();
		}

		//
		_consoleMessages.push(d.toUTCString() + ' | #'+_debugConsoleCounter+' - ' + message);
		if(_consoleMessages.length > 250)
		{
			_consoleMessages.shift();
		}

		if(_debugConsoleVisible == false)
		{
			// $('body').find('[data-action=\'openDebugTracer\']').css({'border': '2px solid #BB0000'});
		}
	}
}

var _logToApi = function(message, origin, type, comments, callbackSuccess, callbackError)
{
	if(isset(app) && isObject(app) && isFunction(app.logToApi))
	{
		switch(type)
		{
			case COCOS_LOG_TYPE_ERRROR:
				break;

			case COCOS_LOG_TYPE_WARNING:
				break;

			case COCOS_LOG_TYPE_INFO:
				break;

			case COCOS_LOG_TYPE_SUCCESS:
			case 'confirm':
				type = COCOS_LOG_TYPE_SUCCESS;
				break;

			case COCOS_LOG_TYPE_DEBUG:
				break;

			default:
				type = COCOS_LOG_TYPE_INFO;
		}

		app.logToApi(message, origin, type, comments, callbackSuccess, callbackError);
	}
}

/**
 *
 * @constructor
 * @param       {Function} applicationCallbackFunction  applicationCallbackFunction
 * @param       {Function} applicationStartImmediately	applicationStartImmediately
 * @return      {Void}
 */
var cocosApplication = function(applicationCallbackFunction, applicationStartImmediately)
{
	var _applicationCallbackFunction = applicationCallbackFunction;
	var _applicationStartImmediately = applicationStartImmediately;
	
	var _applicationConfig = {};

	var _applicationTextlib = {};
	var _applicationTextlibIds = {};

	var _defaultTextlib = {
		"selectLocationText": {
			"NL": "Selecteer een locatie",
			"EN": "Select a location",
		},
		"noLocationText": {
			"NL": "Doorgaan zonder locatie",
			"EN": "Continue without a location",
		}
	};
	_defaultTextlib = lowercaseObjectKeys(_defaultTextlib);

	var _applicationDeviceId = null;
	var _applicationDeviceData = {};
	var _applicationDeviceTags = {};

	var _applicationTopologyId = null;

	var _applicationLanguage = getBrowserLanguage();
	var _applicationLanguages = {};

	var _applicationStarted = false;
	var _applicationReady = false;
	var _applicationStopped = false;

	var _applicationHeartbeatTimer = null;
	// Set the heartbeat to 1 minute. When no response received withing 1 minute, go reload
	//
	var _applicationHeartbeatTimeout = ( 1 * 60 * 1000);
	var _applicationHeartbeatReloadDelay = 3000;

	var _applicationReloadTimer = null;
	var _applicationReloadTimeout = (3 * 60 * 1000);

	var _applicationReloadWhenDeviceActivates = false;

	var _networkInterruptions = 0;
	var _firstNetworkInterruption = null;
	var _lastNetworkInterruption = null;
	var _networkInterruptedRequests = [];

	/**
	 * Gets the version.
	 *
	 * @return     {<type>}  The version.
	 */
	this.getVersion = function()
	{
		return JS_APP_SDK_VERSION;
	};

	/**
	 * Gets the versions.
	 *
	 * @return     {Object}  The versions.
	 */
	this.getVersions = function(asString)
	{
		var versions = {
			jsSDK: (!isNull(apiConnector)?apiConnector.getVersion():null),
			jsAppSDK: this.getVersion(),
			app: ((typeof(APP_VERSION) != 'undefined')?APP_VERSION:null),
		};

		if(isTrue(asString))
		{
			return 'Frontend-application: v'+versions.app + ' - CoCoS SDK: v'+versions.jsSDK + ' - Application SDK: v'+versions.jsAppSDK;
		}

		return versions;
	}

	/**
	 * Enables the reload when device activates.
	 */
	this.enableReloadWhenDeviceActivates = function()
	{
		_applicationReloadWhenDeviceActivates = true;
	}

	/**
	 * @brief      { function_description }
	 * @param      comments          { parameter_description }
	 * @param      callbackSuccess   { parameter_description }
	 * @param      callbackFunction  { parameter_description }
	 * @return     { description_of_the_return_value } */
	this.reportConsoleLogs = function(comments, callbackSuccess, callbackFunction)
	{
		var title = 'Log report, sent from CoCoS frontend application';
		var text = getConsoleOutput(comments);

		// Try to sent/report logs to the CoCoS API.
		//
		_reportLogsToCoCoSAPI(
			title,
			text,
			function()
			{
				if(isFunction(callbackSuccess))
				{
					callbackSuccess();
				}
			},
			function()
			{
				// Try to sent/report logs to the server directly
				//
				_reportLogsToServer(
					title, 
					text,
					function()
					{
						if(isFunction(callbackSuccess))
						{
							callbackSuccess();
						}
					},
					function()
					{	
						// Try to sent/report logs by mail
						//
						_reportLogsByMail(
							title, 
							text,
							function()
							{
								if(isFunction(callbackSuccess))
								{
									callbackSuccess();
								}
							},
							function()
							{	
								if(isFunction(callbackError))
								{
									callbackError();
								}
							}
						);
					}
				);
			}
		);
	}

	/**
	 * Reports a logs to co co sapi.
	 *
	 * @param      {<type>}  title            The title
	 * @param      {<type>}  text             The text
	 * @param      {<type>}  callbackSuccess  The callback success
	 * @param      {<type>}  callbackError    The callback error
	 */
	var _reportLogsToCoCoSAPI = function(title, text, callbackSuccess, callbackError)
	{
		this.logToApi(
			title,
			'',
			'debug',
			text,
			callbackSuccess,
			callbackError
		);
	};

	/**
	 * Reports a logs to server.
	 *
	 * @param      {<type>}    title            The title
	 * @param      {<type>}    text             The text
	 * @param      {<type>}    callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 */
	var _reportLogsToServer = function(title, text, callbackSuccess, callbackError)
	{
		$.ajax({
			type: 'POST',
			url: '/apps/report/send.php',
			data: JSON.stringify({title: title, text: text}),
			dataType: 'json',
			processData: false,
            		contentType: 'application/json',
			success: function()
			{
				if(isFunction(callbackSuccess))
				{
					callbackSuccess();
				}
			},
			error: function()
			{
				if(isFunction(callbackError))
				{
					callbackError();
				}
			}
		});
	};

	/**
	 * Reports a logs by mail.
	 *
	 * @param      {<type>}  [(title, text, comments, callbackSuccess, callbackError){document.location.href='mailto:?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(text);if(isFunction(callbackSuccess)){callbackSuccess();}};this.logToApi=function(message, origin, type, comments, callbackSuccess, callbackError){if(cocosApplicationActAsDevice()){var idDevice=this.getDataFromDevice('id');if(!isEmpty(idDevice)){var log=false;switch(type){case COCOS_LOG_TYPE_ERRROR:log=this.getDataFromDevice('logError');break;case COCOS_LOG_TYPE_WARNING:log=this.getDataFromDevice('logWarning');break;case COCOS_LOG_TYPE_INFO:log=this.getDataFromDevice('logInfo');break;case COCOS_LOG_TYPE_SUCCESS:log=this.getDataFromDevice('logSuccess');break;case COCOS_LOG_TYPE_DEBUG:log=this.getDataFromDevice('logDebug');break;default:log=this.getDataFromDevice('logInfo');}if(isTrue(log)){apiConnector.update('system', 'devices', 'me', null, null, {'deviceAction':'logMessage', 'actionData':JSON.stringify({'message':message, 'type':type, 'origin':origin})}, function(response, requestHandler){if(isFunction(callbackSuccess)){callbackSuccess(response, requestHandler);}return false;}, function(error, response, requestHandler){if(isFunction(callbackError)){callbackError(error, response, requestHandler);}return false;}, function(response, requestHandler){return false;});}}}else{apiConnector.create('system', 'logMessage', null, null, {}, {group:'CoCoS JS Application', type:type, message:message, comments:((typeof(comments)!='undefined')?comments:''), }, function(response, requestHandler){if(isFunction(callbackSuccess)){callbackSuccess(response, requestHandler);}return false;}, function(error, response, requestHandler){if(isFunction(callbackError)){callbackError(error, response, requestHandler);}return false;}, function(response, requestHandler){return false;});}}var_logStepToConsole=function(message, type, step, origin){if(!isset(origin)||isEmpty(origin)){origin=DEBUG_ORIGIN_APPLICATION_SDK;}if(!isset(step)||isEmpty(step)){step=_currentStep;}message+=' (Currently in step '+step+')';switch(type){case'error':logErrorToConsole(message, origin);break;case'warning':logWarningToConsole(message, origin);break;case'info':logInfoToConsole(message, origin);break;case'debug':logDebugToConsole(message, origin);break;case'success':case'confirm':logConfirmToConsole(message, origin);break;default:logMessageToConsole(message, origin);break;}}var_handleResponseMessages=function(messages){if(isObject(messages)&&(objectSize(messages)>0)){$.each(messages, function(k, message){switch(extract(message, 'type')){case'error':_logStepToConsole(extract(message, 'text'), 'error');break;case'warning':_logStepToConsole(extract(message, 'text'), 'warning');break;case'info':_logStepToConsole(extract(message, 'text'), 'info');break;default:_logStepToConsole(extract(message, 'text'));}});}}this.getConfigVar=function(variable, fallbackValue){if(typeof(_applicationConfig[variable])!='undefined'){return_applicationConfig[variable];}else if(typeof(fallbackValue)!='undefined'){return fallbackValue;}return null;};this.getVarFromConfig=function(variable, fallbackValue){return this.getConfigVar(variable, fallbackValue);}this.setLanguage=function(languageCode, selector){if(isString(languageCode)){languageCode=trim(languageCode).toUpperCase();}_applicationLanguage=languageCode;this.applyLanguage(selector);}this.getApplicationLanguage=function(){return_applicationLanguage;}this.getApplicationLanguages=function(){]  The log to api
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	var _reportLogsByMail = function(title, text, callbackSuccess, callbackError)
	{
		document.location.href = 'mailto:?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(text);
		if(isFunction(callbackSuccess))
		{
			callbackSuccess();
		}
	};

	/**
	 * Logs to api.
	 *
	 * @param      {<type>}  message  The message
	 * @param      {<type>}  origin   The origin
	 * @param      {<type>}  type     The type
	 */
	this.logToApi = function(message, origin, type, comments, callbackSuccess, callbackError)
	{
		// Check if we're acting as a device. If so, get the idDevice and check it's state.
		// Also, check if the given logType is allowed or not. 
		//
		if(cocosApplicationActAsDevice())
		{
			var idDevice = this.getDataFromDevice('id');
			// var isDeviceActive = this.getDataFromDevice('status');

			if(!isEmpty(idDevice)) // && isTrue(isDeviceActive))
			{
				var log = false;

				switch(type)
				{
					case COCOS_LOG_TYPE_ERRROR:
						log = this.getDataFromDevice('logError');
						break;

					case COCOS_LOG_TYPE_WARNING:
						log = this.getDataFromDevice('logWarning');
						break;

					case COCOS_LOG_TYPE_INFO:
						log = this.getDataFromDevice('logInfo');
						break;

					case COCOS_LOG_TYPE_SUCCESS:
						log = this.getDataFromDevice('logSuccess');
						break;

					case COCOS_LOG_TYPE_DEBUG:
						log = this.getDataFromDevice('logDebug');
						break;

					default:
						log = this.getDataFromDevice('logInfo');
				}

				// Only continue when we're allowed to log the given type for the
				// device we are.
				//
				if(isTrue(log))
				{
					// In order to create/post a message from the frontend
					// application into the CoCoS API when acting as a device,
					// we'll execute a patch/update on our device, sending a
					// deviceMessage and some actionData.
					// 
					apiConnector.update
					(
						'system',
						'devices',
						'me',
						null,
						null,
						{
							'deviceAction': 'logMessage',
							'actionData': JSON.stringify({'message': message, 'type': type, 'origin': origin})
						},
						function(response, requestHandler)
						{
							if(isFunction(callbackSuccess))
							{
								callbackSuccess(response, requestHandler);
							}

							// Catch response/result. Do nothing here,
							// only return false to prevent the global
							// callbackSucces is begin executed.
							// 
							return false;
						},
						function(error, response, requestHandler)
						{
							if(isFunction(callbackError))
							{
								callbackError(error, response, requestHandler);
							}

							// Catch response/result. Do nothing here,
							// only return false to prevent the global
							// callbackError is begin executed. It
							// doesn't matter if the request gave an
							// error. It can go wrong when, for example,
							// nobody is logged in, the user doesn't
							// have the right permissions, the network
							// can't be reached or whatsoever. When it
							// went wrong, just bad luck. There's
							// probably a reason for that, no need to
							// handle it any further.
							// 
							return false;
						},
						function(response, requestHandler)
						{
							// Catch response/result. Do nothing here,
							// only return false to prevent the global
							// callbackComplete is begin executed.
							// 
							return false;
						}
					);
				}
			}
		}
		else
		{	
			// Go create/post a message from this frontend application into the CoCoS
			// API, using the system/logMessage-collection
			//
			apiConnector.create(
				'system',
				'logMessage',
				null,
				null,
				{},
				{
					group: 'CoCoS JS Application',
					type: type,
					message: message,
					comments: ((typeof(comments) != 'undefined')?comments:''),
				},
				function(response, requestHandler)
				{
					if(isFunction(callbackSuccess))
					{
						callbackSuccess(response, requestHandler);
					}

					// Catch response/result. Do nothing here, only return false
					// to prevent the global callbackSucces is begin executed.
					// 
					return false;
				},
				function(error, response, requestHandler)
				{
					if(isFunction(callbackError))
					{
						callbackError(error, response, requestHandler);
					}

					// Catch response/result. Do nothing here, only return false
					// to prevent the global callbackError is begin executed.
					// It doesn't matter if the request gave an error. It can
					// go wrong when, for example, nobody is logged in, the user
					// doesn't have the right permissions, the network can't be
					// reached or whatsoever. When it went wrong, just bad luck.
					// There's probably a reason for that, no need to handle it
					// any further.
					// 
					return false;
				},
				function(response, requestHandler)
				{
					// Catch response/result. Do nothing here, only return false
					// to prevent the global callbackComplete is begin executed.
					// 
					return false;
				}
			);
		}
	}

	/**
	 * Logs a step to console.
	 *
	 * @param      {string}  message  The message
	 * @param      {<type>}  type     The type
	 * @param      {string}  step     The step
	 * @param      {<type>}  origin   The origin
	 */
	var _logStepToConsole = function(message, type, step, origin)
	{
		if(!isset(origin) || isEmpty(origin))
		{
			origin = DEBUG_ORIGIN_APPLICATION_SDK;
		}

		if(!isset(step) || isEmpty(step))
		{
			step = _currentStep;
		}

		message += ' (Currently in step ' + step+')';

		switch(type)
		{
			case 'error':
				logErrorToConsole(message, origin);
				break;
				
			case 'warning':
				logWarningToConsole(message, origin);
				break;
				
			case 'info':
				logInfoToConsole(message, origin);
				break;
				
			case 'debug':
				logDebugToConsole(message, origin);
				break;
				
			case 'success':
			case 'confirm':
				logConfirmToConsole(message, origin);
				break;
				
			default:
				logMessageToConsole(message, origin);
				break;
		}
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  messages  The messages
	 */
	var _handleResponseMessages = function(messages)
	{
		if(isObject(messages) && (objectSize(messages) > 0))
		{
			$.each(messages, function(k, message)
			{
				switch(extract(message, 'type'))
				{
					case 'error':
						_logStepToConsole(extract(message, 'text'), 'error');
						break;

					case 'warning':
						_logStepToConsole(extract(message, 'text'), 'warning');
						break;

					case 'info':
						_logStepToConsole(extract(message, 'text'), 'info');
						break;

					default:
						_logStepToConsole(extract(message, 'text'));
				}
			});
		}
	}

	/**
	 * Gets the configuration variable.
	 *
	 * @param      {<type>}  variable       The variable
	 * @param      {<type>}  fallbackValue  The fallback value
	 * @return     {<type>}  The configuration variable.
	 */
	this.getConfigVar = function(variable, fallbackValue)
	{
		if(typeof(_applicationConfig[variable]) != 'undefined')
		{			
			return _applicationConfig[variable];
		}
		else if(typeof(fallbackValue) != 'undefined')
		{
			return fallbackValue;
		}

		return null;
	};

	/**
	 * Gets the variable from configuration.
	 *
	 * @param      {<type>}  variable       The variable
	 * @param      {<type>}  fallbackValue  The fallback value
	 * @return     {<type>}  The variable from configuration.
	 */
	this.getVarFromConfig = function(variable, fallbackValue)
	{
		return this.getConfigVar(variable, fallbackValue);
	}

	/**
	 * Sets the language.
	 *
	 * @param      {Function}  languageCode  The language code
	 * @param      {<type>}    selector      The selector
	 */
	this.setLanguage  = function(languageCode, selector)
	{
		if(isString(languageCode))
		{
			languageCode = trim(languageCode).toUpperCase();
		}

		//
		_applicationLanguage = languageCode;
		this.applyLanguage(selector);
	}

	/**
	 * Gets the application language.
	 *
	 * @return     {<type>}  The application language.
	 */
	this.getApplicationLanguage = function()
	{
		return _applicationLanguage;
	}

	/**
	 * Gets the application languages.
	 *
	 * @return     {<type>}  The application languages.
	 */
	this.getApplicationLanguages = function()
	{
		return _applicationLanguages;
	}

		/**
		 * Gets the languages.
		 *
		 * @return     {<type>}  The languages.
		 */
		this.getLanguages = function()
		{
			return this.getApplicationLanguages();
		}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  selector  The selector
	 */
	this.applyLanguage = function(selector)
	{
		this.applyTextlib(selector);	
	}

	/**
	 * { function_description }
	 *
	 * @param      {Function}  selector  The selector
	 */
	this.applyTextlib = function(selector)
	{
		var textlibElements = [];

		if(isString(selector) && !isEmpty(selector))
		{
			selector = $(selector);
		}

		if(isset(selector))
		{
			textlibElements = selector.find('[data-textlib]');
		}
		else
		{
			textlibElements = $('[data-textlib]');
		}

		$.each(textlibElements, function(k, obj)
		{
			var text = null;

			if(!isset($(obj).attr('data-textlibid')))
			{
				text = this.getTextFromLib($(obj).attr('data-textlib'));	
			}
			else
			{
				text = this.getTextFromIdentifier($(obj).attr('data-textlibid'), $(obj).attr('data-textlib'));
			}

			if(isNull(text) || isEmpty(text))
			{
				if(!isEmpty($(obj).attr('data-textlibFallback')))
				{
					text = this.getTextFromLib($(obj).attr('data-textlibFallback'));
				}
			}

			if(isNull(text) || isEmpty(text))
			{
				if(!isEmpty($(obj).attr('data-textlib-originalValue')))
				{
					$(obj).html($(obj).attr('data-textlib-originalValue'));
				}
			}

			if(!isNull(text) && !isEmpty(text))
			{
				// When object hasn't attribute telling HTML is allowed, go strip the text
				// to prevent ? ..
				// 
				if(!isTrue($(obj).attr('data-textlibHtml')))
				{
					text = escapeHtml(text);
				}

				if(isEmpty($(obj).attr('data-textlib-originalValue')))
				{
					$(obj).attr('data-textlib-originalValue', $(obj).text());
				}
			}

			$(obj).html(text);

		}.bind(this));
	};

	/**
	 * Gets the text from identifier.
	 *
	 * @param      {<type>}  identifier    The identifier
	 * @param      {<type>}  tag           The tag
	 * @param      {<type>}  params        The parameters
	 * @param      {<type>}  languageCode  The language code
	 * @return     {<type>}  The text from identifier.
	 */
	this.getTextFromIdentifier = function(identifier, tag, params, languageCode)
	{
		return this.getTextFromLib(tag, params, languageCode, identifier);
	}

	/**
	 * Gets the text from library.
	 *
	 * @param      {Function}           tag           The tag
	 * @param      {<type>}             params        The parameters
	 * @param      {(Function|string)}  languageCode  The language code
	 * @param      {<type>}             identifier    The identifier
	 * @return     {string}             The text from library.
	 */
	this.getTextFromLib = function(tag, params, languageCode, identifier)
	{
		if(isString(tag))
		{
			tag = trim(tag).toLowerCase();
		}

		if(!isset(languageCode) || isEmpty(languageCode))
		{
			languageCode = this.getApplicationLanguage();
		}

		if(isString(languageCode))
		{
			languageCode = trim(languageCode).toUpperCase();
		}

		if(!isset(identifier) || isEmpty(identifier))
		{
			identifier = COCOS_WILDCARD_IDENTIFIER;
		}

		var text = null;

		if(isset(_applicationTextlib[tag]))
		{
			if(languageCode == '*')
			{
				return _applicationTextlib[tag];
			}
			else
			{
				if(isset(_applicationTextlib[tag][languageCode]))
				{
					if(isset(_applicationTextlib[tag][languageCode][identifier]))
					{
						text = _applicationTextlib[tag][languageCode][identifier];
					}
				}

				// Only fallback to another language when the text is fetched
				// without a identifier. When a specific text in a specific language
				// for a specific item (identifier) is fetched, only that text can
				// be returned. When not found, it will return empty.
				// 
				// When a text for a language is required without identifier, so
				// just a 'global' text. We will try to always return a value, even
				// if this means a other language will be returned.
				//
				if(isNull(text) && (identifier == COCOS_WILDCARD_IDENTIFIER) && (objectSize(_applicationTextlib[tag]) > 0))
				{
					// When no text found for the desired language,
					// go check for some other...
					//
					languageCode = Object.keys(_applicationTextlib[tag])[0];
					if(isset(_applicationTextlib[tag][languageCode][identifier]))
					{
						text = _applicationTextlib[tag][languageCode][identifier];
					}
				}
			}
		}
		else if(isset(_defaultTextlib[tag]))
		{
			if(languageCode == '*')
			{
				return _defaultTextlib[tag];
			}
			else
			{
				if(isset(_defaultTextlib[tag][languageCode]))
				{
					if(isset(_defaultTextlib[tag][languageCode]))
					{
						text = _defaultTextlib[tag][languageCode];
					}
				}

				// Only fallback to another language when the text is fetched
				// without a identifier. When a specific text in a specific language
				// for a specific item (identifier) is fetched, only that text can
				// be returned. When not found, it will return empty.
				// 
				// When a text for a language is required without identifier, so
				// just a 'global' text. We will try to always return a value, even
				// if this means a other language will be returned.
				//
				if(isNull(text) && (objectSize(_defaultTextlib[tag]) > 0))
				{
					// When no text found for the desired language,
					// go check for some other...
					//
					languageCode = Object.keys(_defaultTextlib[tag])[0];
					if(isset(_defaultTextlib[tag][languageCode]))
					{
						text = _defaultTextlib[tag][languageCode];
					}
				}
			}
		}

		if(isString(text))
		{
			if(isObject(params) && (objectSize(params) > 0))
			{
				$.each(params, function(k, value)
				{
					text = text.replace('%'+k+'%', value);
				});
			}
		}
		else
		{
			// 'TAG: ' + tag + '  CAN NOT BE FOUND IN TEXTLIB FOR LANGUAGE: ' + language;
		}

		if(text != '')
		{
			return text;
		}

		return '';
	}

	/**
	 * Gets the textlib.
	 *
	 * @return     {<type>}  The textlib.
	 */
	this.getTextlib = function()
	{
		return _applicationTextlib;
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  username          The username
	 * @param      {<type>}  password          The password
	 * @param      {<type>}  successFunction   The success function
	 * @param      {<type>}  errorFunction     The error function
	 * @param      {<type>}  completeFunction  The complete function
	 */
	this.handleLoginWithUserNamePassword = function(username, password, successFunction, errorFunction, completeFunction)
	{
		apiConnector.handleLoginWithUserNamePassword(username, password, function(isLoggedIn, userData, response)
		{
			_handleLoginResponse(isLoggedIn, userData, response, successFunction, errorFunction, completeFunction)
		});
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  pincode           The pincode
	 * @param      {<type>}  successFunction   The success function
	 * @param      {<type>}  errorFunction     The error function
	 * @param      {<type>}  completeFunction  The complete function
	 */
	this.handleLoginWithPincode = function(pincode, successFunction, errorFunction, completeFunction)
	{
		apiConnector.handleLoginWithPincode(pincode, function(isLoggedIn, userData, response)
		{
			_handleLoginResponse(isLoggedIn, userData, response, successFunction, errorFunction, completeFunction)
		});
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  username          The username
	 * @param      {<type>}  password          The password
	 * @param      {<type>}  pincode           The pincode
	 * @param      {<type>}  successFunction   The success function
	 * @param      {<type>}  errorFunction     The error function
	 * @param      {<type>}  completeFunction  The complete function
	 */
	this.handleLoginWithUserNamePasswordPincode = function(username, password, pincode, successFunction, errorFunction, completeFunction)
	{
		apiConnector.handleLoginWithUserNamePasswordPincode(username, password, pincode, function(isLoggedIn, userData, response)
		{
			_handleLoginResponse(isLoggedIn, userData, response, successFunction, errorFunction, completeFunction)
		});
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  token             The token
	 * @param      {<type>}  successFunction   The success function
	 * @param      {<type>}  errorFunction     The error function
	 * @param      {<type>}  completeFunction  The complete function
	 */
	this.handleLoginWithToken = function(token, successFunction, errorFunction, completeFunction)
	{
		apiConnector.handleLoginWithToken(token, function(isLoggedIn, userData, response)
		{
			_handleLoginResponse(isLoggedIn, userData, response, successFunction, errorFunction, completeFunction)
		});
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}    loggedIn          The logged in
	 * @param      {<type>}    userData          The user data
	 * @param      {<type>}    response          The response
	 * @param      {Function}  successFunction   The success function
	 * @param      {Function}  errorFunction     The error function
	 * @param      {Function}  completeFunction  The complete function
	 */
	_handleLoginResponse = function(isLoggedIn, userData, response, successFunction, errorFunction, completeFunction)
	{
		if(isFunction(successFunction) && !isset(errorFunction) && !isset(completeFunction))
		{
			if(isTrue(isLoggedIn))
			{
				var availableLocations = extract(userData, 'locations');
				if(isObject(availableLocations))
				{
					_handleLocationResponse(availableLocations, function()
					{
						successFunction(true, userData, response);
					});
				}
				else
				{
					successFunction(true, userData, response);
				}
			}
			else
			{
				successFunction(false, userData, response);
			}
		}
		else
		{
			if(isTrue(isLoggedIn))
			{
				var availableLocations = extract(userData, 'locations');
				if(isObject(availableLocations))
				{
					_handleLocationResponse(availableLocations, function()
					{
						if(isFunction(successFunction))
						{
							successFunction(response);
						}
	
						if(isFunction(completeFunction))
						{
							completeFunction();
						}
					});
				}
				else
				{
					if(isFunction(successFunction))
					{
						successFunction(response);
					}
		
					if(isFunction(completeFunction))
					{
						completeFunction();
					}
				}
			}
			else
			{
				if(isFunction(errorFunction))
				{
					errorFunction(null, response);
				}
		
				if(isFunction(completeFunction))
				{
					completeFunction();
				}
			}
		}
	};

	/**
	 * Gets the topology identifier.
	 *
	 * @return     {<type>}  The topology identifier.
	 */
	this.getDeviceId = function()
	{
		return apiConnector.getDeviceId();
	};

	this.getDeviceName = function()
	{
		return apiConnector.getDeviceName();
	};

	/**
	 * Gets the device data.
	 *
	 * @return     {<type>}  The device data.
	 */
	this.getDeviceData = function(variable)
	{
		if(!isEmpty(variable))
		{
			if(isObject(_applicationDeviceData) && isset(_applicationDeviceData[variable]))
			{
				return extract(_applicationDeviceData, variable);
			}

			return null;
		}
		else
		{
			return _applicationDeviceData;
		}
	}

	/**
	 * Gets the data from device.
	 *
	 * @param      {<type>}  variable  The variable
	 * @return     {<type>}  The data from device.
	 */
	this.getDataFromDevice = function(variable)
	{
		return this.getDeviceData(variable);
	}

	/**
	 * Gets the device files.
	 *
	 * @param      {string}  type    The type
	 * @return     {<type>}  The device files.
	 */
	this.getDeviceFiles = function(type)
	{
		var files = {};
		$.each(_applicationDeviceData, function(field, value)
		{
			if(field.substr(0, 6) == 'files.')
			{
				if(isEmpty(type) || (field == 'files.'+type))
				{
					files[field] = value;
				}
			}
		});

		return files;
	}

	/**
	 * Gets the device file.
	 *
	 * @param      {string}  type    The type
	 * @return     {<type>}  The device file.
	 */
	this.getDeviceFile = function(type)
	{
		var files = this.getDeviceFiles(type);
		if(isObject(files) && (objectSize(files) > 0))
		{
			var firstKey = Object.keys(files)[0];
			return files[firstKey];
		}

		return null;
	}

	/**
	 * Gets the file from device.
	 *
	 * @param      {<type>}  type    The type
	 * @return     {<type>}  The file from device.
	 */
	this.getFileFromDevice = function(type)
	{
		return this.getDeviceFile(type);
	}

	/**
	 * Gets the device tags.
	 *
	 * @return     {<type>}  The device tags.
	 */
	this.getDeviceTags = function()
	{
		return _applicationDeviceTags;
	}

	/**
	 * Gets the tag from device.
	 *
	 * @param      {<type>}  tag     The tag
	 * @return     {<type>}  The tag from device.
	 */
	this.getTagFromDevice = function(tag)
	{
		if(isObject(_applicationDeviceTags) && isset(_applicationDeviceTags[tag]))
		{
			return extract(_applicationDeviceTags, tag);
		}

		return null;
	}

	/**
	 * Gets the tag value from device.
	 *
	 * @param      {<type>}  tag     The tag
	 * @return     {<type>}  The tag value from device.
	 */
	this.getTagValueFromDevice = function(tag)
	{
		var deviceTag = this.getTagFromDevice(tag);
		if(isObject(deviceTag))
		{
			return extract(deviceTag, 'value');
		}

		return null;
	};

	/**
	 * Gets the topology identifier.
	 *
	 * @return     {<type>}  The topology identifier.
	 */
	this.getTopologyId = function()
	{
		return apiConnector.getTopologyId();
	}

	/**
	 * Gets the topology name.
	 *
	 * @return     {<type>}  The topology name.
	 */
	this.getTopologyName = function()
	{
		return apiConnector.getTopologyName();
	}

	var _availableLocations = null;

	/**
	 * Adds location options.
	 *
	 * @param      {Function}  selectElement       The select element
	 * @param      {string}    selectLocationText  The select location text
	 * @param      {string}    noLocationText      No location text
	 */
	this.addLocationOptions = function(selectElement, selectLocationText, noLocationText)
	{
		if(isString(selectElement))
		{
			selectElement = $(selectElement);
		}

		if((selectElement.length == 1) && (selectElement.get(0).tagName.toLowerCase() == 'select'))
		{
			logToConsole('Creating select-element with available locations/topology from the CoCoS API.', DEBUG_ORIGIN_APPLICATION_SDK);
			
			this.getAvailableLocations(function(availableLocations)
			{
				if(availableLocations.length > 0)
				{
					// Remove all options
					//
					$(selectElement).find('option').remove();

					// Check if _applicationTopologyId is set to -1 (public). If so, add an
					// empty option for selecting no location.
					// 
					if(_applicationTopologyId == -1)
					{
						if(!isset(noLocationText) || isEmpty(noLocationText))
						{
							noLocationText = this.getTextFromLib('noLocationText', [], null, '');
						}
						$(selectElement).append('<option value=\'-1\'>'+noLocationText+'</option>');
					}
					else
					{
						if(!isset(selectLocationText) || isEmpty(selectLocationText))
						{
							selectLocationText = this.getTextFromLib('selectLocationText', [], null, '');
						}
						$(selectElement).append('<option value=\'\' disabled>'+selectLocationText+'</option>');
					}

					$.each(availableLocations, function(k, location)
					{
						$(selectElement).append('<option value=\''+location.id+'\'>'+location.name+'</option>');
					});

					var locationCookie = apiConnector.getLocationCookie();
					if(!isEmpty(locationCookie))
					{
						if($(selectElement).find('option[value=\''+locationCookie+'\']').length > 0)
						{
							$(selectElement).find('option[value=\''+locationCookie+'\']').attr('selected', true);
							logInfoToConsole('Pre-selected locations/topology \'' + $(selectElement).find('option[value=\''+locationCookie+'\']').text() + '\' based on preferences from cookie.', DEBUG_ORIGIN_APPLICATION_SDK);
						}
					}
					else if(availableLocations.length == 1)
					{
						var onlyLocationId = extract(availableLocations, 0, 'id');
						if($(selectElement).find('option[value=\''+onlyLocationId+'\']').length > 0)
						{
							$(selectElement).find('option[value=\''+onlyLocationId+'\']').attr('selected', true);
							logInfoToConsole('Pre-selected locations/topology \'' + $(selectElement).find('option[value=\''+onlyLocationId+'\']').text() + '\', because only option available.', DEBUG_ORIGIN_APPLICATION_SDK);
						}
					}
					else
					{
						$(selectElement).find('option[value=\'\']').attr('selected', true);
					}
				}
				else
				{
					// TODO: What here?
				}
			}.bind(this));
		}
	}

	/**
	 * { function_description }
	 *
	 * @param      {Function}  callbackFunction  The callback function
	 */
	this.getAvailableLocations = function(callbackFunction)
	{
		logMessageToConsole('Start getting available locations/topology...', DEBUG_ORIGIN_APPLICATION_SDK);

		var topologyId = this.getTopologyId();
		var topologyName = this.getTopologyName();


		// When the topologyId AND the topologyName both are null (based on the values in
		// the payload of the JWT/AccessToken), using locations isn't supported by the CoCoS
		// API.
		// 
		if(isNull(topologyId) && isNull(topologyName))
		{
			logInfoToConsole('Locations/topology not available from CoCoS API, continue without.', DEBUG_ORIGIN_APPLICATION_SDK);

			// Locations/topology not available. When a callbackFunction is provided, go
			// execute it with an empty array.
			//
			if(isFunction(callbackFunction))
			{
				callbackFunction([]);
			}
		}
		else
		{	
			// When locations is/are available, go check if a location isn't set yet.
			// This will be the case when the value for the topologyId isn't empty and
			// is set to 0 (required) or -1 (optional). In the case of value -1, the
			// name should also be empty. When the topologyId is -1, but we also have a
			// topologyName, this will mean -1 is chosen. In case of an empty name, a
			// location should be chosen in order to continue.
			//
			if( !isEmpty(topologyId) && ( ((topologyId == -1) && isEmpty(topologyName)) || (topologyId == 0) ) )
			{
				// Check if the _availableLocations-variable is null. If so, this
				// means no locations are fetched from the CoCOS API yet. So we must
				// get them.
				// 
				if(isNull(_availableLocations))
				{
					//
					logMessageToConsole('Go fetch available locations/topology from CoCoS API.', DEBUG_ORIGIN_APPLICATION_SDK);

					// Get from CoCoS
					//
					_getAvailableLocationsFromCoCoS(callbackFunction);
				}

				// Otherwise, we've already got a list of availableLocations, so no
				// extra request should be executed. We can just return the list of
				// locations.
				//
				else
				{
					logMessageToConsole('Returning available locations/topology from local cache.', DEBUG_ORIGIN_APPLICATION_SDK);

					if(isFunction(callbackFunction))
					{
						callbackFunction(_availableLocations);
					}
				}
			}

			// In all other cases, a location is already chosen. So selecting a location
			// isn't required anymore.  When a callbackFunction is provided, go execute
			// it with an empty array.
			//
			else
			{
				logInfoToConsole('Locations/topology detected by CoCoS API, continue using location \'' + topologyName + '\.', DEBUG_ORIGIN_APPLICATION_SDK);
	
				// Set available locations to an empty array because no
				// selection must/can be made.
				//
				if(isFunction(callbackFunction))
				{
					callbackFunction([]);
				}
			}
		}
	};

	var _getAvailableLocationsFromCoCoS = function(callbackFunction)
	{
		apiConnector.read(
			'topology',
			'availableLocations',
			null,
			null,
			null,
			null,
			function(response, xhr)
			{
				//
				_handleLocationResponse(response, callbackFunction);
				
			}.bind(this),
			function(error, response, xhr)
			{
				// When we've got a 403-statusCode (Forbidden), this
				// means we don't have permissions to read the
				// locations from the CoCoS API. 
				//
				if(xhr.getHttpStatusCode() == 403)
				{
					var topologyId = this.getTopologyId();

					// However, if the topologyId is set to -1,
					// this means a location is optional, not
					// required. So instead of throwing an 
					// error, we'll automatically choose -1 as
					// the location for this user/session,
					// sending it to the CoCoS API and (on
					// success) return/confirm our location will
					// be -1 (public/no location).
					// 
					if(topologyId == -1)
					{
						var onlyLocationId = -1;

						logWarningToConsole('Unable to get locations/topology from CoCoS API (not allowed), continue selecting the \'no-location\' with id \''+onlyLocationId+'\'.', DEBUG_ORIGIN_APPLICATION_SDK);

						// No permissions for a location...
						//
						_setLocation(onlyLocationId, function(response, xhr)
						{
							logSuccessToConsole('Successfully selected location with id \''+onlyLocationId+'\', we\'re now at \'' + this.getTopologyName() + '\'.', DEBUG_ORIGIN_APPLICATION_SDK);
							
							// Set available locations to an empty array
							// because no selection must/can be made.
							//
							_availableLocations = [];
							if(isFunction(callbackFunction))
							{
								callbackFunction(_availableLocations);
							}

						}.bind(this), function(error, response, xhr)
						{
							// TODO: What here?
							//

						}, null, false);
					}
					// Otherwise, when not -1, a location will
					// be required, but none can be selected. So
					// we'll exit here.
					// 
					else
					{
						logErrorToConsole('Error fetching locations/topology from the CoCoS API, but required by the apiKey. Can\t continue.', DEBUG_ORIGIN_APPLICATION_SDK);

						// Show error/overlay about missing topology
						//
						showMissingTopology();
						return;
					}
				}
				else
				{
					// Otherwise, in case of other statusCodes
					// TODO: What here?
					//
				}

			}.bind(this)
		);
	}.bind(this);

	var _handleLocationResponse = function(response, callbackFunction)
	{
		var topologyId = this.getTopologyId();

		// Set available locations to be an empty array...
		//
		_availableLocations = [];

		//
		$.each(extract(response, 'data'), function(k, location)
		{
			_availableLocations.push(extract(location, 'data'));
		});

		// No topologyId selected/available. Value 0 indicates a
		// location is required, so go check if any locations are
		// available. Otherwise, exit here.
		// 
		if((topologyId == 0) && (_availableLocations.length == 0))
		{
			logErrorToConsole('No locations/topology fetched from the CoCoS API, but required by the apiKey. Can\'t continue.', DEBUG_ORIGIN_APPLICATION_SDK);

			// Show error/overlay about missing topology
			//
			showMissingTopology();
			return;
		}
		// When a location is required (topologyId == 0) and we've
		// got only 1 location, automatically choose the one and
		// only available location.
		// 
		else if((topologyId == 0) && (_availableLocations.length == 1))
		{
			var onlyLocationId = extract(_availableLocations, 0, 'id');
			var onlyLocationName = extract(_availableLocations, 0, 'name');

			logMessageToConsole('Only 1 available location/topology found and the \'no-location\' option isn\'t allowed. Continue selecting location with id \''+onlyLocationId+'\'.', DEBUG_ORIGIN_APPLICATION_SDK);

			_setLocation(onlyLocationId, function(response, xhr)
			{
				logSuccessToConsole('Successfully selected location with id \''+onlyLocationId+'\', we\'re now at \'' + onlyLocationName + '\'.', DEBUG_ORIGIN_APPLICATION_SDK);

				_availableLocations = [];
				if(isFunction(callbackFunction))
				{
					callbackFunction(_availableLocations);
				}

			}, function(error, response, xhr)
			{
				// TODO: What here?
				//
				if(isFunction(callbackFunction))
				{
					callbackFunction(_availableLocations);
				}

			}, null, false);
		}
// // When no locations found, but the location isn't require (topologyId == -1),
// // automatically select -1  as location.
// // 
// else if((topologyId == -1) && (_availableLocations.length == 0))
// {
// 	logMessageToConsole('No locations found, but none required. Go use public location, continue selecting location with id \'-1\'.', DEBUG_ORIGIN_APPLICATION_SDK);

// 	_setLocation(-1, function(response, xhr)
// 	{
// 		logSuccessToConsole('Successfully selected location with id \'1\', we\'re now at \'' + onlyLocationName + '\'.', DEBUG_ORIGIN_APPLICATION_SDK);

// 		_availableLocations = [];
// 		if(isFunction(callbackFunction))
// 		{
// 			callbackFunction(_availableLocations);
// 		}

// 	}, function(error, response, xhr)
// 	{
// 		// TODO: What here?
// 		//
// 		if(isFunction(callbackFunction))
// 		{
// 			callbackFunction(_availableLocations);
// 		}

// 	}, null, false);

// }
		else
		{
			logMessageToConsole('Found '+_availableLocations.length+' locations/topology, a location must be selected in order to continue...', DEBUG_ORIGIN_APPLICATION_SDK);
			if(isFunction(callbackFunction))
			{
				callbackFunction(_availableLocations);
			}
		}
	}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  idTopology       The identifier topology
	 * @param      {<type>}  callbackSuccess  The callback success
	 * @param      {<type>}  callbackError    The callback error
	 */
	this.iamHere = function(idTopology, callbackSuccess, callbackError, callbackComplete, saveLocationCookie)
	{
		apiConnector.handleLocation(idTopology, function(locationSuccess, error, response, xhr)
		{
			if(isTrue(locationSuccess))
			{
				if(isFunction(callbackSuccess))
				{
					callbackSuccess(response, xhr);
				}
			}
			else
			{
				if(isFunction(callbackError))
				{
					callbackError(error, response, xhr);
				}
			}

			if(isFunction(callbackComplete))
			{
				callbackComplete(response, xhr);
			}

		}, saveLocationCookie);
	}

		/**
		 * Sets the location.
		 *
		 * @param      {<type>}  idTopology       The identifier topology
		 * @param      {<type>}  callbackSuccess  The callback success
		 * @param      {<type>}  callbackError    The callback error
		 */
		var _setLocation = function(idTopology, callbackSuccess, callbackError, callbackComplete, saveLocationCookie)
		{
			this.iamHere(idTopology, callbackSuccess, callbackError, callbackComplete, saveLocationCookie);
		}.bind(this);

	/**
	 * Adds an application language.
	 *
	 * @param      {Function}  languageCode  The language code
	 * @param      {<type>}    languageName  The language name
	 */
	var _addApplicationLanguage = function(languageCode, languageName)
	{
		if(isset(languageCode) && isset(languageName))
		{
			if(isString(languageCode))
			{
				languageCode = trim(languageCode).toUpperCase();
			}

			_applicationLanguages[languageCode] = languageName;
		}
	}

	/**
	 * Adds to configuration.
	 *
	 * @param      {string}  variable  The variable
	 * @param      {<type>}  value     The value
	 */
	var _addToConfig = function(variable, value, unit)
	{
		if(isset(variable) && isset(value))
		{
			if(!empty(variable))
			{
				if(!isObject(_applicationConfig))
				{
					_applicationConfig = {};
				}

				if(isset(unit) && !isEmpty(unit))
				{
					var multiplier = 0;

					switch(unit)
					{
						case 'seconds':
							multiplier = 1;
							break;

						case 'minutes':
							multiplier = 60;
							break;

						case 'hours':
							multiplier = (60*60);
							break;

						case 'days':
							multiplier = (60*60*24);
							break;

						case 'weeks':
							multiplier = (60*60*24*7);
							break;

						case 'months':
							multiplier = ((60*60*24*365.25)/12);
							break;

						case 'years':
							multiplier = (60*60*24*365.25);
							break;
					}

					value = parseInt(value) * multiplier;
				}

				if(isString(value))
				{
					logDebugToConsole('Adding variable \''+variable+'\' to config, value: \'' + escapeHtml(value) + '\'.', DEBUG_ORIGIN_CONFIG);
				}
				else
				{
					logDebugToConsole('Adding variable \''+variable+'\' to config, type: \'' + typeof(value) + '\'.', DEBUG_ORIGIN_CONFIG);
				}

				//
				_applicationConfig[variable] = value;
			}

		}
	}
	
	/**
	 * { function_description }
	 *
	 * @param      {<type>}  variable  The variable
	 * @param      {<type>}  value     The value
	 */
	var _overwriteConfigVar = function(variable, value)
	{
		if(isset(variable) && isset(value))
		{
			if(isset(variable) && isset(value))
			{	
				_applicationConfig[variable] = value;
			}
		}
	}

	/**
	 * Adds to text library.
	 *
	 * @param      {<type>}  tag           The tag
	 * @param      {<type>}  languageCode  The language code
	 * @param      {<type>}  value         The value
	 * @param      {<type>}  identifier    The identifier
	 */
	this.addToTextLib = function(tag,languageCode,value,identifier)
	{
		_addToTextLib(tag,languageCode,value,identifier);
	}

	/**
	 * Adds to text library.
	 *
	 * @param      {string}  tag           The tag
	 * @param      {string}  languageCode  The language code
	 * @param      {<type>}  value         The value
	 * @param      {string}  identifier    The identifier
	 */
	var _addToTextLib = function(tag,languageCode,value,identifier)
	{
		if(isset(tag) && isset(languageCode))
		{
			if(!empty(tag) && !empty(languageCode))
			{
				// Set value to empty when empty or not found
				//
				if(!isset(value)) //  || isEmpty(value))
				{
					value = '';
				}

				if(!isObject(_applicationTextlib))
				{
					_applicationTextlib = {};
				}
				
				if(isString(tag))
				{
					tag = tag.toLowerCase();
				}

				if(isString(languageCode))
				{
					languageCode = languageCode.toUpperCase();
				}

				if(!isset(identifier) || isEmpty(identifier))
				{
					identifier = COCOS_WILDCARD_IDENTIFIER;
				}

				if(!isset(_applicationTextlib[tag]))
				{
					_applicationTextlib[tag] = {};
				}

				if(!isset(_applicationTextlib[tag][languageCode]))
				{
					_applicationTextlib[tag][languageCode] = {};
				}

				logDebugToConsole('Adding tag \''+tag+'\', languageCode \''+languageCode+'\', identifier \''+identifier+'\' to textlib, value: \'' + escapeHtml(value) + '\'.', DEBUG_ORIGIN_TEXTLIB);

				//
				_applicationTextlib[tag][languageCode][identifier] = value;
			}
		}
	};

	/**
	 * Sets the device data.
	 *
	 * @param      {<type>}  deviceData  The device data
	 */
	var _setDeviceData = function(deviceData)
	{
		_applicationDeviceData = deviceData;
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  field   The field
	 * @param      {<type>}  value   The value
	 */
	var _overwriteDeviceData = function(field, value)
	{
		_applicationDeviceData[field] = value;
	}

	/**
 	 * { item_description }
 	 */	
	var _setDeviceId = function(idDevice)
	{
		_applicationDeviceId = idDevice;
	}

	/**
	 * @brief      { function_description }
	 * @param      idTopology  { parameter_description }
	 * @return     { description_of_the_return_value } */
	var _setTopologyId = function(idTopology)
	{
		_applicationTopologyId = idTopology;
	}

	/**
	 * Adds a device tag.
	 *
	 * @param      {string}  id        The identifier
	 * @param      {string}  name      The name
	 * @param      {string}  variable  The variable
	 * @param      {<type>}  value     The value
	 */
	var _addDeviceTag = function(id, name, variable, value)
	{
		if(!isObject(_applicationDeviceTags))
		{
			_applicationDeviceTags = {};
		}

		if(!isset(_applicationDeviceTags[variable]))
		{
			logDebugToConsole('Adding tag \''+variable+'\', id \''+id+'\', name \''+name+'\' to deviceTags, value: \'' + escapeHtml(value) + '\'.', DEBUG_ORIGIN_TAGS);

			_applicationDeviceTags[variable] = {
				id: id,
				name: name,
				value: value
			};
		}
	}

	var _applicationLoaderTimeout = null;
	var _defaultOverlayBackgroundColor = 'rgba(0,0,0,0.9)';
	var _defaultFontFamily = 'Arial, Helvetica, sans-serif';
	var _defaultFontColor = '#FEFEFE';

	/**
	 * Does a reload.
	 *
	 * @param      {<type>}  title         The title
	 * @param      {<type>}  message       The message
	 * @param      {<type>}  clearCookies  The clear cookies
	 */
	this.doReload = function(title, message, clearCookies)
	{
		this.showReload(title, message);
		if(isTrue(clearCookies))
		{
			apiConnector.resetCookies();
		}

		setTimeout(function()
		{
			window.location.reload();
		}, 500);
	}
	
	/**
	 * Shows the reload.
	 *
	 * @param      {<type>}  title    The title
	 * @param      {<type>}  message  The message
	 */
	this.showReload = function(title, message)
	{
		if(isEmpty(title))
		{
			title = this.getTextFromLib('applicationReloadingTitle');
		}
			
		if(isEmpty(title))
		{
			title = 'Applicatie wordt opnieuw gestart...';
		}

		this.showLoading(title, message, 0);
	}

	/**
	 * Starts a loading.
	 *
	 * @param      {<type>}  title    The title
	 * @param      {<type>}  message  The message
	 * @param      {number}  delay    The delay
	 */
	this.startLoading = function(title, message, delay)
	{
		if(!isset(delay) || !isNumeric(delay))
		{
			delay = 0;
		}

		this.showLoading(title, message, delay);
	}

	/**
	 * Shows the loading.
	 *
	 * @param      {string}  title    The title
	 * @param      {string}  message  The message
	 */
	this.showLoading = function(title, message, delay)
	{
		if(!isset(delay) || !isNumeric(delay))
		{
			delay = 500;
		}

		_applicationLoaderTimeout = mySetTimeout(_applicationLoaderTimeout, function()
		{
			if(isEmpty(title))
			{
				title = this.getTextFromLib('applicationLoadingTitle');
			}
			
			if(isEmpty(title))
			{
				title = 'Bezig met laden...';
			}

			if(isEmpty(message))
			{
				message = this.getTextFromLib('applicationLoadingText');
			}

			if(isEmpty(message))
			{
				message = 'Een ogenblik geduld aub';
			}

			var loadingId = 'cocosApplicationIsLoading';
			if($('body').find('#'+loadingId).length < 1)
			{
				$('body').append
				(
				 	'<div id=\''+loadingId+'\' style=\'display: none; position: absolute; top: 0px; left: 0px; z-index: 99997; width: 100%; height: 100%; background-color: '+_defaultOverlayBackgroundColor+';\'>'
						+ ' <div style=\'width: 80%; height: 30vmin; position: absolute; left: 10%; top: 50%; margin-top: -13vmin; text-align: center;\'>'
							+ ' <font style=\'color: '+_defaultFontColor+'; line-height: 7vmin; font-size: 4vmin; font-family: '+_defaultFontFamily+'\' data-use=\'loadingTitle\'>'+title+'</font><br>'
							+ '<div style=\'height:10vmin; width: 10vmin; margin:4vmin;\'>'
								// + ' <img style=\'height: 10vmin; width: 10vmin; margin: 2vmin;\' src=\''+_loadingGif+'\'><br>'
								+ _loadingHtml
							+ '</div>'
							+ ' <font style=\'color: '+_defaultFontColor+'; line-height: 5vmin; font-size: 3vmin; font-family: '+_defaultFontFamily+'\' data-use=\'loadingMessage\'>'+message+'</font>'
						+ ' </div>'
					+ ' </div>'
				);
			}
			else
			{
				$('body').find('#'+loadingId).find('[data-use=\'loadingTitle\']').text(title);
				$('body').find('#'+loadingId).find('[data-use=\'loadingMessage\']').text(message);
			}

			if($('head').find('style[data-use=\'cocosApplicationLoader\']').length < 1)
			{
				$('head').prepend(
					'<style type=\'text/css\' data-use=\'cocosApplicationLoader\'>'
					+ _loadingCss
					+ '</style>'
				);
			}

			if(delay > 0)
			{
				$('body').find('#'+loadingId).fadeIn();
			}
			else
			{
				$('body').find('#'+loadingId).show();
			}

		}.bind(this), delay);
	};

	/**
	 * Shows the loading now.
	 *
	 * @param      {<type>}  title    The title
	 * @param      {<type>}  message  The message
	 */
	this.showLoadingNow = function(title, message)
	{
		this.showLoading(title, message, 0);
	}

	/**
	 * Sets the ready.
	 *
	 * @return     {boolean}  True if ready, False otherwise.
	 */
	this.isReady = function()
	{
		return this.setReady();
	}

	/**
	 * Sets the ready.
	 */
	this.setReady = function()
	{
		if(isFalse(_applicationReady))
		{
			_applicationReady = true;

			if(cocosApplicationActAsDevice())
			{		
				var idDevice = this.getDataFromDevice('id');
				// var isDeviceActive = this.getDataFromDevice('status');

				if(!isEmpty(idDevice)) // && isTrue(isDeviceActive))
				{
					_setStatusToAPI(COCOS_DEVICE_STATUS_RUNNING);
				}
			}
			this.hideLoading();
		}
	}

	/**
	 * Stops a loading.
	 */
	this.stopLoading = function()
	{
		this.hideLoading();
	}

	/**
	 * Hides the loading.
	 */
	this.hideLoading = function()
	{
		myClearTimeout(_applicationLoaderTimeout);

		var loadingId = 'cocosApplicationIsLoading';
		$('body').find('#'+loadingId).stop().hide();
	}

	// Deprecated function, but still here to be backwards-compatible.
	this.showOutOfUse = function(title, message)
	{
		this.showApplicationOutOfUse(title, message);
	}

	/**
	 * Shows the application out of use.
	 */
	this.showApplicationOutOfUse = function(title, message)
	{
		if(isEmpty(title))
		{
			title = 'Er is een fout opgetreden bij deze applicatie...';;
		}

		_showOutOfUse(title, message);
		_setStatusToAPI(COCOS_DEVICE_STATUS_ERROR);
	}

	/**
	 * Shows the device out of use.
	 */
	this.showDeviceOutOfUse = function(title, message)
	{
		if(isEmpty(title))
		{
			title = 'Dit systeem is op dit moment buiten gebruik...';
		}
		_showOutOfUse(title, message, true);
	}

	var showNoLicense = function(title, message)
	{
		if(isEmpty(title))
		{
			title = 'Licentie verlopen/niet beschikbaar.';
		}

		if(isEmpty(message))
		{
			message = 'Neem contact op met uw (applicatie)beheerder.';
		}

		_showOutOfUse(title, message);	
	}

	var showMissingDevice = function(title, message)
	{
		if(isEmpty(title))
		{
			title = 'Apparaat niet herkend/beschikbaar.';
		}

		if(isEmpty(message))
		{
			message = 'Neem contact op met uw (applicatie)beheerder.';
		}

		_showOutOfUse(title, message);
	}

	var showMissingGuestDevice = function(title, message)
	{
		if(isEmpty(title))
		{
			title = 'Geen toegang voor dit apparaat.';
		}

		if(isEmpty(message))
		{
			message = 'Neem contact op met uw (applicatie)beheerder.';
		}

		_showOutOfUse(title, message);
	}

	var showMissingTopology = function(title, message)
	{
		if(isEmpty(title))
		{
			title = 'Werkplek of locatie niet herkend/beschikbaar.';
		}

		if(isEmpty(message))
		{
			message = 'Neem contact op met uw (applicatie)beheerder.';
		}

		_showOutOfUse(title, message);
	}

	/**
	 * Shows the out of use.
	 *
	 * @param      {string}  title    The title
	 * @param      {string}  message  The message
	 */
	var _showOutOfUse = function(title, message, fromDevice)
	{
		this.heartbeat();

		if(isEmpty(title))
		{
			title = 'Dit systeem is op dit moment buiten gebruik...';
		}

		if(isEmpty(message))
		{
			message = 'Onze excuses voor het ongemak';
		}

		var outOfUseId = 'cocosApplication__OutOfUse';
		if($('body').find('#'+outOfUseId).length < 1)
		{
			$('body').append(
			 	'<div id=\''+outOfUseId+'\' style=\'display: none; position: absolute; top: 0px; left: 0px; z-index: 88888; width: 100%; height: 100%; background-color: '+_defaultOverlayBackgroundColor+'\'>'
					+ ' <div style=\'width: 80%; height: 12vmin; position: absolute; left: 10%; top: 50%; margin-top: -6vmin; text-align: center;\'>'
						+ ' <font style=\'color: '+_defaultFontColor+'; line-height: 7vmin; font-size: 4vmin; font-family: '+_defaultFontFamily+'\'>'+title+'</font><br>'
						+ ' <font style=\'color: '+_defaultFontColor+'; line-height: 5vmin; font-size: 3vmin; font-family: '+_defaultFontFamily+'\'>'+message+'</font>'
					+ ' </div>'
				+ ' </div>'
			);
		}

		if($('body').hasClass('hidden'))
		{
			$('body').removeClass('hidden');
		}

		$('body').find('#'+outOfUseId).fadeIn(function()
		{
			this.hideLoading();
		}.bind(this));

	}.bind(this);

	/**
	 * Creates an invalid size message.
	 *
	 * @param      {string}  title       The title
	 * @param      {string}  message     The message
	 * @param      {<type>}  fromDevice  The from device
	 */
	var _createInvalidSizeMessage = function(title, message, fromDevice)
	{
		if((typeof(COCOS_APPLICATION_MIN_WIDTH) != 'undefined')
		   || (typeof(COCOS_APPLICATION_MAX_WIDTH) != 'undefined')
		   || (typeof(COCOS_APPLICATION_MIN_HEIGHT) != 'undefined')
		   || (typeof(COCOS_APPLICATION_MAX_HEIGHT) != 'undefined')
		) {

			if(isEmpty(title))
			{
				title = 'Resolutie niet ondersteund';
			}

			if(isEmpty(message))
			{
				message = 'Deze applicatie kan niet worden gebruikt/weergegeven op deze resolutie.';
			}

			var invalidSizeId = 'cocosApplication__InvalidSize';
			if($('body').find('#'+invalidSizeId).length < 1)
			{
				$('body').append(
				 	'<div id=\''+invalidSizeId+'\' style=\'position: absolute; top: 0px; left: 0px; z-index: 88888; width: 100%; height: 100%; background-color: '+_defaultOverlayBackgroundColor+'\'>'
						+ ' <div style=\'width: 80%; height: 12vmin; position: absolute; left: 10%; top: 50%; margin-top: -6vmin; text-align: center;\'>'
							+ ' <font style=\'color: '+_defaultFontColor+'; line-height: 7vmin; font-size: 4vmin; font-family: '+_defaultFontFamily+'\'>'+title+'</font><br>'
							+ ' <font style=\'color: '+_defaultFontColor+'; line-height: 5vmin; font-size: 3vmin; font-family: '+_defaultFontFamily+'\'>'+message+'</font>'
						+ ' </div>'
					+ ' </div>'
				);
			}

			var screenSizes = [];

			if(typeof(COCOS_APPLICATION_MIN_WIDTH) != 'undefined') 
			{
				screenSizes.push('min-width: ' + parseInt(COCOS_APPLICATION_MIN_WIDTH)+'px');
			}
			if(typeof(COCOS_APPLICATION_MAX_WIDTH) != 'undefined') 
			{
				screenSizes.push('max-width: ' + parseInt(COCOS_APPLICATION_MAX_WIDTH)+'px');
			}

			if(typeof(COCOS_APPLICATION_MIN_HEIGHT) != 'undefined') 
			{
				screenSizes.push('min-height: ' + parseInt(COCOS_APPLICATION_MIN_HEIGHT)+'px');
			}
			if(typeof(COCOS_APPLICATION_MAX_HEIGHT) != 'undefined') 
			{
				screenSizes.push('max-height: ' + parseInt(COCOS_APPLICATION_MAX_HEIGHT)+'px');
			}

			if($('head').find('style[data-use=\'CoCoS-screenSizes\']').length < 1)
			{
				$('head').append('<style data-use=\'CoCoS-screenSizes\'></style>');
			}
			$('head').find('style[data-use=\'CoCoS-screenSizes\']').html(''
				+ ' @media screen and (' + screenSizes.join(') and (') + ') '
				+ ' { '
					+ ' #cocosApplication__InvalidSize { display: none !important; } '
				+ ' } '
			);
		}

	}.bind(this);

	/**
	 * Hides the out of use.
	 */
	this.hideOutOfUse = function(reportRunning)
	{
		this.heartbeat();

		var outOfUseId = 'cocosApplication__OutOfUse';
		$('body').find('#'+outOfUseId).hide();

		if(isTrue(reportRunning))
		{
			_setStatusToAPI(COCOS_DEVICE_STATUS_RUNNING);
		}
	}

	/**
	 * { function_description }
	 */
	this.blockUserInput = function()
	{
		var userBlockId = 'cocosApplication__UserBlock';
		if($('body').find('#'+userBlockId).length < 1)
		{
			$('body').append(
			 	'<div id=\''+userBlockId+'\' style=\'display: block; position: absolute; top: 0px; left: 0px; z-index: 99999; width: 100%; height: 100%; background-color: rgba(0,0,0,0); cursor: wait;\'>'
				+ ' </div>'
			);
		}

		$('body').find('#'+userBlockId).show();
	}

	/**
	 * { function_description }
	 */
	this.unblockUserInput = function()
	{
		this.heartbeat();

		var userBlockId = 'cocosApplication__UserBlock';
		if($('body').find('#'+userBlockId).length > 0)
		{
			$('body').find('#'+userBlockId).hide();
		}
	}


	/**
	 * { function_description }
	 *
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	this.applicationRunning = function()
	{
		return (isTrue(_applicationStarted) && isFalse(_applicationStopped));
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  forceBeat  The force beat
	 */
	this.heartbeat = function()
	{
		if(cocosApplicationMonitorHeartbeat())
		{
			if(isFalse(_applicationStopped))
			{
				// console.log('Received heartbeat; Waiting maximum of ' + (_applicationHeartbeatTimeout/1000) + ' seconds for next one. When no heartbeat received, application will start it\'s reload procedure!');

				_applicationHeartbeatTimer = mySetTimeout(_applicationHeartbeatTimer, function()
				{
					// console.log('HEARTBEAT STOPPED... APPLICATION PASSED AWAY, STARTING CPR! - Go reload over ' + (_applicationHeartbeatReloadDelay/1000) + ' seconds!', 'error');
					// logErrorToApi('Application reloaded due to lack of (inter)action for ' + heartbeatTimeout + 'ms.');

					// QUESTION: Moet hier de outOfUse getoond worden?

					setTimeout(function()
					{
						//
						_reloadApplication();
					}, _applicationHeartbeatReloadDelay);

				}, _applicationHeartbeatTimeout);
			}
		}
	}

	/// -------------------------------------------------------------------------
	///
	/// 'PRIVATE' FUNCTIONS BELOW HERE... CANNOT BE CALLED FROM OUTSIDE.
	///
	/// -------------------------------------------------------------------------

	var _networkInterruptionMessageVisible = false;

	var _handleNetworkInterruption = function(error, response, requestHandler)
	{
		var now = new Date();

		if(_networkInterruptions == 0)
		{
			_firstNetworkInterruption = now;
		}
		else
		{
			_lastNetworkInterruption = now;
		}
		_networkInterruptions++;

		// Get timings from request and store then into variables, using the timestamps
		// start and end to convert them into UTC dateTime-strings.
		// 
		var requestTimings = requestHandler.getTimings();
		var requestStarted = ((requestTimings.start > 0)?new Date(requestTimings.start*1000).toUTCString():'');
		var requestEnded = ((requestTimings.end > 0)?new Date(requestTimings.end*1000).toUTCString():'');
		var requestDuration = requestTimings.duration.toFixed(2) + ' seconds';
		var requestTimeout = requestTimings.timeout.toFixed(2) + ' seconds';

		// Create message, based on interrupted request, holding info about the requestId,
		// duration, httpStatusCode and reached readyStates.
		//
		var requestMessage = 'RequestID: ' + requestHandler.getRequestId()
			+ ' - URL: ' + requestHandler.getProtocol()+'//'+requestHandler.getHost()+requestHandler.getFullPath()
			+ ' - Started ' + requestStarted
			+ ' - Ended: ' + requestEnded
			+ ' - Took: ' + requestDuration
			+ '. Got httpStatusCode: ' + requestHandler.getHttpStatusCode()
			+ ' - readyStates: ' + requestHandler.getHttpReadyStates(true)
			+ ' (timeout setting: ' + requestTimeout + ')';

		if(_networkInterruptedRequests.length < 20)
		{
			// Add message for request to _networkInterruptedRequests, with a maximum
			// length of 20 items. More items will be ignored, in order to prevent the
			// memory (and eventually the CoCoS API) to be flooded with these messages.
			// 
			_networkInterruptedRequests.push(requestMessage);
		}

		// Create message to display to the user, because the requested action could not be
		// executed.
		//
		var errorMessage = 'Fout bij het '+((requestHandler.requestMethod == 'GET')?'ophalen van gegevens':'uitvoeren van de actie(s)')+', netwerk niet beschikbaar. Probeer opnieuw of raadpleeg de netwerk-beheerder.';

		// 
		if(isFalse(_networkInterruptionMessageVisible))
		{
			_networkInterruptionMessageVisible = true;

			if((typeof(toastr) != 'undefined') && isFunction(toastr.error))
			{
				toastr.error('', errorMessage);
			}
			else if((typeof(Swal) != 'undefined') &&  isFunction(Swal.fire))
			{
				Swal.fire({
					position: 'top-end',
					// icon: 'error',
					// title: '',
					text: errorMessage,
					showConfirmButton: true,
					timer: 3000
				});
			}
			else
			{
				alert(errorMessage);
			}	

			// Reset message visible
			//
			setTimeout(function()
			{
				_networkInterruptionMessageVisible = false;
			}, 5000);
		}
	}

	/**
	 * { function_description }
	 */
	var _resetNetworkInterruptions = function()
	{
		if(_networkInterruptions > 0)
		{
			// Gather message and comments to be logged to the CoCoS API.
			//
			if(_networkInterruptions == 1)
			{
				var message = 'Got ' + _networkInterruptions + ' network interruption at ' + _firstNetworkInterruption.toUTCString();
			}
			else
			{
				var message = 'Got ' + _networkInterruptions + ' network interruption between ' + _firstNetworkInterruption.toUTCString() + ' and ' + _lastNetworkInterruption.toUTCString();
				if(_networkInterruptions > 20)
				{
					_networkInterruptedRequests.push(' ... and ' + (_networkInterruptions-20) + ' more. ')
				}
			}

			var comments = 'Failed requests:'+"\n\n" + _networkInterruptedRequests.join("\n\n");

			// Reset networkInterruption-variables
			//
			_networkInterruptions = 0;
			_firstNetworkInterruption = null;
			_lastNetworkInterruption = null;
			_networkInterruptedRequests = [];

			// Log warning
			//
			logWarning(message, DEBUG_ORIGIN_APPLICATION_SDK, true, true, comments);

			// When more than 20 networkInterruptions occurred, go force the application
			// to reload, because in the meantime, a lot can be changed. A reload is the
			// easiest method to make sure everything will be up-to-date again, after
			// the network interruptions were restored.
			// 
			if(_networkInterruptions > 20)
			{
				setTimeout(function()
				{
					_reloadApplication(true);
				}, 5000);
			}
		}
	}

	/**
	 * Stops an application.
	 */
	var _stopApplication = function()
	{
		_applicationStopped = true;

		_stopListenToEvents();
		_stopHeartbeat();
		this.blockUserInput();

	}.bind(this);

	/**
	 * Stops a heartbeat.
	 */
	var _stopHeartbeat = function()
	{
		myClearTimeout(_applicationHeartbeatTimer);
	}

	/**
	 * { function_description }
	 */
	var _scheduleReload = function()
	{
		console.error(' !! GO FORCE A RELOAD-PROCEDURE IN ABOUT : ' + (_applicationReloadTimeout / 1000) + ' SECONDS !! ');

		_applicationReloadTimer = mySetTimeout(_applicationReloadTimer, function()
		{
			_reloadApplication(true);

		}, _applicationReloadTimeout);
	}	

	/**
	 * { function_description }
	 */
	var _reloadApplication = function(forceReload)
	{
		if(this.applicationRunning() || isTrue(forceReload))
		{
			_stopApplication();
			logInfo('Application going down for reload');
			this.showReload();

			_setStatusToAPI
			(
				COCOS_DEVICE_STATUS_STOPPING,
				function()
				{
					_patchRefreshToAPI
					(
			 			2,
			 			function()
						{
							_tryToReloadApplication(true);
						},
						function()
						{
							_tryToReloadApplication(true);
						}
					);
				},
				function()
				{
					_tryToReloadApplication(true);
				}
			);
		}
		else
		{
			this.showReload();

			// Nothing to do here... application is already 'stopped', so it will / must
			// reload soon, hopefully.
			_tryToReloadApplication(true);
		}

		/* DISABLED CODE BELOW:
		if((getCurrentScreen() == getConfigVar('startScreen')) || (getCurrentScreen() == getConfigVar('splashScreen')) || (isTrue(forcedReload)))
		{
			window.location.reload();
		}
		else
		{
			applicationMustReload = true;
		}
		*/
	
	}.bind(this);

	var _apiAvailableForReload = false;
	var _appAvailableForReload = false;
	
	var _tryToReloadTimer = 1000;
	var _tryToReloadCounter = 0;

	var _succesfullReloadCheckCounter = 0;
	var _succesfullReloadChecksBeforeReload = 5;

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  resetParameters  The reset parameters
	 */
	var _tryToReloadApplication = function(resetParameters)
	{	
		if(isTrue(resetParameters))
		{
			_apiAvailableForReload = false;
			_appAvailableForReload = false;
			_tryToReloadCounter = 0;
		}
		else
		{
			_tryToReloadCounter++;
			if(_tryToReloadCounter > 2)
			{
				this.showDeviceOutOfUse();
			}
		}

		var tryToReloadInterval = ((_tryToReloadCounter-2) * 1000);
		
		if(tryToReloadInterval > 10000)
		{
			tryToReloadInterval = 10000;
		}

		_tryToReloadTimer = mySetTimeout(_tryToReloadTimer, function()
		{
			if(isFalse(_apiAvailableForReload))
			{
				_checkApiAvailableForReload(function()
				{
					if(isFalse(_apiAvailableForReload))
					{
						_succesfullReloadCheckCounter = 0;
					}
						
					// Go (again) try to reload the application
					//
					_tryToReloadApplication();
				});
			}
			else if(isFalse(_appAvailableForReload))
			{
				_checkAppAvailableForReload(function()
				{
					if(isFalse(_appAvailableForReload))
					{
						_succesfullReloadCheckCounter = 0;
					}
						
					// Go (again) try to reload the application
					//
					_tryToReloadApplication();
				});
			}
			else if(isTrue(_apiAvailableForReload) && isTrue(_appAvailableForReload))
			{
				if(_tryToReloadCounter == 2)
				{
					_succesfullReloadCheckCounter++;

					if(_succesfullReloadCheckCounter == _succesfullReloadChecksBeforeReload)
					{
						_setStatusToAPI
						(
							COCOS_DEVICE_STATUS_RESTARTING,
							function()
							{
								// When success, go reload
								//
								this.doReload()
							}.bind(this),
							function()
							{
								// When error, go reload
								//
								this.doReload()
							}.bind(this)
						);
					}
					else
					{
						_tryToReloadApplication(true);
					}
				}
				else
				{
					_tryToReloadApplication(true);
				}
			}

		}.bind(this), tryToReloadInterval);
	}.bind(this);

	/**
	 * _checkApiAvailableForReload()
	 * @lastChange		2019-01-15
	 * 
	 * This function can be called to theck if the API is available for a reload. We'll do this
	 * to prevent reloading the application (for example, when the eventList failed and/or the
	 * heartbeat stopped), as long as the API is still not available.
	 * 
	 * When the connection with the API fails or the heartbeat stops, the application will go
	 * show it's outOfUse-message and will go try to reload in order to get back online.
	 * However, as long as the API isn't available, a reload won't have much impact, because
	 * after the reload, the API will also tell it's not available, causing the outOfUse-message
	 * to be shown again, which will again cause a reload when no heartbeat will be found.
	 * 
	 * To prevent applications from reloading all the time as long as the API is not available
	 * anymore, we will use the apiConnector.isAvailable-method to initially check if the CoCoS
	 * API is available, before executing a reload.
	 * 
	 * When the CoCoS API is available (of we don't have an apiConnector at all), the
	 * _apiAvailableForReload-boolean to true to indicate the CoCoS API is available and the app
	 * can likely be reloaded. Otherwise, the _apiAvailableForReload-boolean will be set to
	 * false.
	 * 
	 * After the check, the given callbackFunction will be called (if available), from where
	 * the further checks for a pending reload can be executed.
	 *
	 * @param      {Function}  callbackFunction  The callback function
	 */
	var _checkApiAvailableForReload = function(callbackFunction)
	{
		if(isset(apiConnector) && !isNull(apiConnector) && isFunction(apiConnector.isAvailable))
		{
			apiConnector.isAvailable(function(available)
			{
				if(isTrue(available))
				{
					_apiAvailableForReload = true;
				}
				else
				{
					_apiAvailableForReload = false;
				}

				if(isFunction(callbackFunction))
				{
					callbackFunction()
				}
			});
		}
		else
		{
			// When no apiConnector-object found (this can happen when no apiKey was
			// given / the appConfig couldn't be loaded / contained an error), we're
			// unable to check the status of the CoCoS APi, to detect if it's available
			// or not. So, to prevent the application for looping and checking a API
			// which will never be available (due to missing / corrupt configurations),
			// we force this boolean to true, telling the application the API (we could
			// not connect with) is available for reload.
			// 
			// After the reload, the application will (again) get it's appConfig and try
			// to connect to the CoCoS API (if available) etc. etc.
			// 
			_apiAvailableForReload = true;

			if(isFunction(callbackFunction))
			{
				callbackFunction()
			}
		}
	}

	/**
	 *_checkAppAvailableForReload()
	 * @lastChange		2019-01-15
	 *
	 * This function can be called to check if the current application (based on it's current
	 * URL / location.href) is available. We'll do this by getting the URL of the application
	 * through AJAX (so no reload yet) and check the response.
	 * 
	 * When the response was successful, we'll assume that executing a reload won't result into
	 * a fault. For example, when the client loses it's connection the the server (because the
	 * network is down or the server is unavailable), requesting our own URL will result into an
	 * error. When we reload, the browser will come up with a 'Page not Found' message, which
	 * can be restored, unless the user refreshed / reloads the page manually, for example by
	 * hitting [F5] or [Ctrl] + [R].
	 * 
	 * To prevent this, we'll use AJAX to check if our own URL is available. If so, we will set
	 * the _appAvailableForReload-boolean to true to indicate the AJAX-request was successful
	 * and the app can likely be reloaded. Otherwise, the _appAvailableForReload-boolean will
	 * be set to false.
	 * 
	 * After the check, the given callbackFunction will be called (if available), from where
	 * the further checks for a pending reload can be executed.
	 * 
	 * @param      {Function}  callbackFunction  The callback function
	 */
	var _checkAppAvailableForReload = function(callbackFunction)
	{
		// Get the URL from location.href for the current / our own application.
		//
		var applicationUrl = window.location.href;

		// Go create the statusCodesApplicationAvailable-array, which will hold all the
		// statusCodes that will indicate the response of the applicationUrl was successful.
		// 
		var statusCodesApplicationAvailable = [];

		// Allosw status 200 : OK
		//
		statusCodesApplicationAvailable.push(200);
		
		// Allow status 401 : Forbidden. This is allowed, because this doesn't mean the
		// application isn't available, only that the requested page / URL doesn't have the
		// right credentials. This, for example, can be a loginPage, which (in case it
		// returns a 401) doesn't mean it's unavailable, only that logging in is required.
		// 
		statusCodesApplicationAvailable.push(401);

		// Set a boolean for the AJAX-response, which we'll use to detect if the response
		// was successful or not, so we known how we must use the parameters sent to the
		// .always-method after the response was done.
		//
		var ajaxUrlSuccess = null;

		$.ajax
		(
			applicationUrl,
			{
				// Disabled cache to prevent the URL being fetched from the cache.
				// We must known for sure the page / response comes from the server,
				// not from the cache.
				//
				cache: false,

				//
				contentType: 'text/plain',

				// Set timeout for 5 seconds
				//
			 	timeout: 5000,	
			}
		).done
		(
		 	function(data, textStatus, jqXHR)
			{
				// Because we'll use jQuery's .always-method for the AJAX-callback
				// to catch the response, the only thing the .done-methods does is
				// setting the ajaxUrlSuccess-boolean to true, so we know (in the
				// .always-method) the request was successful.
				//
				ajaxUrlSuccess = true;
	 		}
	 	).fail
	 	(
	 	 	function(jqXHR, textStatus, errorThrown)
			{
				// Because we'll use jQuery's .always-method for the AJAX-callback
				// to catch the response, the only thing the .fail-methods does is
				// setting the ajaxUrlSuccess-boolean to false, so we know (in the
				// .always-method) the request failed.
				//
				ajaxUrlSuccess = false;
	 		}
	 	).always
	 	(
	 	 	function(dataOnDone_jqXHROnFail, textStatus, jqXHROnDone_errorThrownOnFail)
	 		{
	 			// Because jQuery has some typical use of it's function parameters
	 			// in the .always-method, we'll use our ajaxUrlSuccess-boolean to
	 			// detect if the .done of .fail-method was called, so we known if
	 			// the first parameter is the data (on done) or the jqXHR-object
	 			// (on fail) and if the seconds parameter is the jqXHR-object (on
	 			// done) or the errorThrown (on fail).
	 			//
	 			// To have the jqXHR-object available both cases, we will set them
	 			// based on the ajaxUrlSuccess-boolean. After that, we can use the
	 			// jqXHR-object for getting the readyState and status from the
	 			// request.
	 			//
	 			var data = null;
				var jqXHR = null;
				var errorThrown = null;

				if(isTrue(ajaxUrlSuccess))
				{
					data = dataOnDone_jqXHROnFail;
					jqXHR = jqXHROnDone_errorThrownOnFail;
				}
				else if(isFalse(ajaxUrlSuccess))
				{
					jqXHR = dataOnDone_jqXHROnFail;
					errorThrown = jqXHROnDone_errorThrownOnFail;
				}

				// After getting the parameters into the right variables, go fetch
				// the readyState and status from the jqXHR-object.
				//
				var ajaxUrlStatus = textStatus;
				var ajaxUrlReadyState = parseInt(extract(jqXHR, 'readyState'));
				var ajaxUrlStatusCode = parseInt(extract(jqXHR, 'status'));

				// Based on the readyState and the status, go check if we can 'mark'
				// the application as 'available for reload' or not. This will be
				// the case was the readyState is 4 (meaning, the request is
				// complete) and the statusCode in in the array of statusCodes for
				// an available application. This can also be a 401, see the
				// comments at the creation of the statusCodesApplicationAvailable-
				// array in the code above for more explanation about this.
				//
		 		if((ajaxUrlReadyState == 4) && ($.inArray(ajaxUrlStatusCode, statusCodesApplicationAvailable) > -1)) // && (!isEmpty(data)))
		 		{
					_appAvailableForReload = true;
		 		}
		 		else
		 		{
					_appAvailableForReload = false;
		 		}

		 		// In all cases, no matter the outcome of the request, go call the
		 		// given callbackFunction. The callbackFunction will use the 
		 		// _appAvailableForReload-variable (set to true or not) to detect
		 		// if the application can be reloaded or not.
		 		//
				if(isFunction(callbackFunction))
				{
					callbackFunction()
				}
	 		}
	 	);
	}

	/**
	 * { function_description }
	 *
	 * @param      {string}    refresh          The refresh
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 */
	var _patchRefreshToAPI = function(refresh, callbackSuccess, callbackError)
	{
		var idDevice = this.getDataFromDevice('id');
		var isDeviceActive = this.getDataFromDevice('status');

		if(!isEmpty(idDevice) && isTrue(isDeviceActive))
		{
			logInfoToConsole('Go communicate refreshValue \'' + refresh + '\' to the CoCoS API', DEBUG_ORIGIN_DEVICE);

			apiConnector.patch
			(
				'system',
				'devices',
				'me',
				null,
				null,
				{
					'deviceAction': 'updateRefreshStatus',
					'actionData': refresh
				},
				function(response)
				{
					_overwriteDeviceData('refresh', refresh);

					if(isFunction(callbackSuccess))
					{
						callbackSuccess();
					}
				},
				function(error)
				{
					//
					if(isFunction(callbackError))
					{
						callbackError();
					}
				}
			);
		}
		else
		{
			if(isFunction(callbackError))
			{
				callbackError();
			}
		}
	}.bind(this);

	/**
	 * Sets the status to api.
	 *
	 * @param      {string}    deviceStatus      The device status
	 * @param      {Function}  callbackFunction  The callback function
	 */
	var _setStatusToAPI = function(deviceStatus, callbackSuccess, callbackError)
	{
		var idDevice = this.getDataFromDevice('id');
		var isDeviceActive = this.getDataFromDevice('status');

		if(!isEmpty(idDevice) && isTrue(isDeviceActive))
		{
			logInfoToConsole('Go communicate deviceStatus \'' + deviceStatus + '\' to the CoCoS API', DEBUG_ORIGIN_DEVICE);

			apiConnector.patch
			(
				'system',
				'devices',
				'me',
				null,
				null,
				{
					'deviceAction': 'updateStatusTag',
					'actionData': deviceStatus
				},
				function(response)
				{
					if(isFunction(callbackSuccess))
					{
						callbackSuccess();
					}
				},
				function(error)
				{
					//
					if(isFunction(callbackError))
					{
						callbackError();
					}
					else if(isFunction(callbackSuccess))
					{
						callbackSuccess();
					}
				}
			);
		}
		else
		{
			//
			if(isFunction(callbackSuccess))
			{
				callbackSuccess();
			}
		}
	}.bind(this);

	/**
	 * Sets the application version to api.
	 *
	 * @param      {Function}  callbackFunction  The callback function
	 */
	var _setApplicationVersionToAPI = function(callbackSuccess, callbackError)
	{
		var idDevice = this.getDataFromDevice('id');

		if(!isEmpty(idDevice) && (typeof(APP_VERSION) != 'undefined') && !isEmpty(APP_VERSION))
		{
			logInfoToConsole('Go communicate applicationVersion \'' + APP_VERSION + '\' to the CoCoS API', DEBUG_ORIGIN_DEVICE);

			apiConnector.patch
			(
				'system',
				'devices',
				'me',
				null,
				null,
				{
					'deviceAction': 'updateDeviceVersion',
					'actionData': APP_VERSION
				},
				function(response)
				{
					if(isFunction(callbackSuccess))
					{
						callbackSuccess();
					}
				},
				function(error)
				{
					//
					if(isFunction(callbackError))
					{
						callbackError();
					}
				}
			);
		}
		else
		{
			//
			if(isFunction(callbackSuccess))
			{
				callbackSuccess();
			}
		}
	}.bind(this);

	/**
	 * Gets the application configuration.
	 *
	 * @param      {Function}  callbackFunction  The callback function
	 */
	var _getApplicationConfig = function(callbackSuccess, callbackError)
	{
		$.getJSON
		(
			'/apps/config/app.config.json?appHref='+window.location.href,

			function(response)
			{	
				if(typeof(callbackSuccess) === 'function')
				{
					var appConfig = {};

					if(isset(response.data) && isObject(response.data))
					{
						appConfig = response.data;
					}

					callbackSuccess(appConfig);
				}
			}
		)
		.fail
		(
			function(jqXHR, textStatus, error)
			{
				if((extract(jqXHR, 'readyState') == 4) && (extract(jqXHR, 'status') == 404))
				{
					logWarningToConsole('No configuration available for application', DEBUG_ORIGIN_CONFIG);

					if(typeof(callbackSuccess) === 'function')
					{
						callbackSuccess({});
					}
				}
				else
				{
					var error = 'Error getting applicationConfig. ' + textStatus + ', ' + error;

					if(typeof(callbackError) === 'function')
					{
						callbackError(error);
					}
				}
			}
		);
	};

	/**
	 * Gets the co co s api key.
	 *
	 * @return     {(Function|string)}  The co co s api key.
	 */
	var _getCoCoSApiKey = function()
	{
		var apiKeyFromConfig = this.getConfigVar('apiKey');

		if(!isEmpty(apiKeyFromConfig))
		{
			return apiKeyFromConfig;
		}
		else
		{
			var apiKeyFromUrl = getRequestParameter('apiKey');

			if(!isEmpty(apiKeyFromUrl))
			{
				return apiKeyFromUrl;
			}
		}

		return '';

	}.bind(this);

	/**
	 * @brief      { function_description }
	 * @return     { description_of_the_return_value } */
	var _getCoCoSDeviceKey = function()
	{
		var deviceKeyFromUrl = getRequestParameter('deviceKey');

		if(!isEmpty(deviceKeyFromUrl))
		{
			return deviceKeyFromUrl;
		}

		return '';
	}

	/**
	 * @brief      { function_description }
	 * @return     { description_of_the_return_value } */
	var _getCoCoSIAm = function()
	{
		var iAmFromUrl = getRequestParameter('iam');

		if(!isEmpty(iAmFromUrl))
		{
			return iAmFromUrl;
		}

		return '';
	}

	/**
	 * Gets the co co s login token.
	 *
	 * @return     {(Function|string)}  The co co s login token.
	 */
	var _getCoCoSLoginToken = function()
	{
		var apiLoginTokenFromConfig = this.getConfigVar('apiLoginToken');

		if(!isEmpty(apiLoginTokenFromConfig))
		{
			return apiLoginTokenFromConfig;
		}
		else
		{
			var apiLoginTokenFromUrl = getRequestParameter('loginToken');

			if(!isEmpty(apiLoginTokenFromUrl))
			{
				return apiLoginTokenFromUrl;
			}
		}
		
		return '';
	}.bind(this);

	/**
	 * Gets the co co s username password.
	 *
	 * @return     {Object}  The co co s username password.
	 */
	var _getCoCoSUsernamePassword = function()
	{
		var loginUsername = null;
		var loginPassword = null;

		//
		var apiLoginUsernameFromConfig = this.getConfigVar('apiLoginUsername');

		if(!isEmpty(apiLoginUsernameFromConfig))
		{
			loginUsername =  apiLoginUsernameFromConfig;
		}
		else
		{
			var apiLoginUsernameFromUrl = getRequestParameter('apiLoginUsernameFromUrl');

			if(!isEmpty(apiLoginUsernameFromUrl))
			{
				loginUsername =  apiLoginUsernameFromUrl;
			}
		}

		//
		var apiLoginPasswordFromConfig = this.getConfigVar('apiLoginPassword');

		if(!isEmpty(apiLoginPasswordFromConfig))
		{
			loginPassword =  apiLoginPasswordFromConfig;
		}
		else
		{
			var apiLoginPasswordFromUrl = getRequestParameter('apiLoginPassword');

			if(!isEmpty(apiLoginUsernameFromUrl))
			{
				loginPassword =  apiLoginUsernameFromUrl;
			}
		}

		//
		return {'u': loginUsername, 'p': loginPassword};

	}.bind(this);

	var _tryToLogin;

	/**
	 * Connects a with the CoCoS API.
	 *
	 * @param      {Function}  callbackFunction  The callback function
	 */
	var _connectWithCoCoSAPI = function(callbackSuccess, callbackError)
	{
		var apiHost = this.getConfigVar('apiHost', '');
		var apiPath = this.getConfigVar('apiPath', '/api/v1');
		var apiKey = _getCoCoSApiKey();
		
		// 
		//
		if(!isEmpty(apiKey))
		{
			_logStepToConsole('Go connect to API on host: \'' + apiHost + '\' - path: \'' + apiPath + '\' - Using key: \'' + apiKey + '\'.');

			if(isEmpty(apiHost))
			{
				apiHost = window.location.host;
				_logStepToConsole('No host given, using \''+apiHost+'\' instead.');
			}

			var freshConnect = false;

			if(typeof(cocosAPI) == 'function')
			{
				apiConnector = new cocosAPI(apiHost, apiPath, apiKey, freshConnect);
			}

			if(cocosApplicationActAsDevice())
			{
				var apiDeviceKey = _getCoCoSDeviceKey();
				if(!isEmpty(apiDeviceKey))
				{
					apiConnector.setDeviceKey(apiDeviceKey);
				}
			}

			var apiIAm = _getCoCoSIAm()
			if(!isEmpty(apiIAm))
			{
				apiConnector.setIAm(apiIAm);
			}

			//
			apiConnector.setCallbackError(function(error, response, requestHandler)
			{
				var httpStatusCode = requestHandler.getHttpStatusCode();

				switch(parseInt(httpStatusCode))
				{
					case 0:
						_handleNetworkInterruption(error, response, requestHandler);
						break;

					case 401:

						// Go login when a 401 is received from the
						// CoCoS API.
						//
						_loginOntoCoCoSAPI
						(
						 	function(isAuthorized, isLoggedIn, userData)
							{
								if(isset(requestHandler) && isFunction(requestHandler.retry))
								{
									requestHandler.retry();
								}
								else
								{
									_reloadApplication(true);
								}
							},
							function()
							{
								// this.showDeviceOutOfUse();
								// _scheduleReload();
								apiConnector.resetCookie();
								_reloadApplication(true);

							}.bind(this),
							true
						);
						break;

					case 500:
					default:
			
						if(cocosApplicationActAsDevice())
						{
							//
							this.showDeviceOutOfUse();
							_scheduleReload();
						}
						else if(cocosApplicationActAsApplication())
						{
							//
							this.showApplicationOutOfUse();
							_scheduleReload();
						}

						break;
				}

			}.bind(this));

			apiConnector.setCallbackComplete(function(response, requestHandler)
			{
				var httpStatusCode = requestHandler.getHttpStatusCode();

				if(httpStatusCode !== 0)
				{
					_resetNetworkInterruptions();
				}

				if((httpStatusCode !== 200) && (httpStatusCode !== 207))
				{
					$.each($('[buttonloading=true]'), function(k, button)
					{
						$(button).button('done');
					});
				}
			});

			apiConnector.setCallbackLogToConsole(function(message, requestId, duration)
			{
				if(isset(requestId) && !isEmpty(requestId))
				{
					message += ' (RequestID: ' + requestId;
					if(isset(duration) && !isEmpty(duration))
					{
						message += ' - Took: ' + duration;
					}

					message += ')';
				}

				logToConsole(message, DEBUG_ORIGIN_API_CONNECTOR);
			});

			//
			apiConnector.setCallbackUserSwitched(function()
			{
				_reloadApplication(true);
			});


			// Check if debug for the API is enabled by the apps-configuration.
			// If so, enable debug in the apiConnector.
			//
			if(isTrue(this.getConfigVar('apiDebug')))
			{
				apiConnector.enableDebug();
			}
			else
			{
				apiConnector.disableDebug();
			}

			_logStepToConsole('Successfully setup apiConnector-instance');

			// if(isTrue(this.getConfigVar('allowAPINonSSL')) && (window.location.protocol != 'https:'))
			//
			if(isTrue(this.getConfigVar('allowAPINonSSL')) && (window.location.protocol != 'https:'))
			{
				// Set protocol for API to http: when allowAPINonSSL is
				// enabled / set to true.
				//
				apiConnector.setProtocol('http:');
				_logStepToConsole('Changed protocol to http:');
			}

			apiConnector.setTimeout(30);
			_logStepToConsole('Set timeout for apiRequests to 30 seconds');
			
			apiConnector.isAvailable(function(available,  error, response, rqh)
			{
				if(isTrue(available))
				{
					_logStepToConsole('Successfully connected with the CoCoS API on \''+apiHost+'\'.', COCOS_LOG_TYPE_SUCCESS);

					apiConnector.isAuthorized(function(isAuthorized, userData, response, rqh)
					{
						// Set deviceId and/or topologyId based on data from
						// payload of accessToken, received from the CoCoS
						// API.
						//
						_setDeviceId(apiConnector.getDeviceId())
						_setTopologyId(apiConnector.getTopologyId());

						if(isAuthorized === true)
						{
							_logStepToConsole('Authorized on CoCoS API', COCOS_LOG_TYPE_INFO);

							// Check for callbackFunction, execute is available.
							if(typeof(callbackSuccess) === 'function')
							{
								callbackSuccess(true, (!isEmpty(userData['userid']) && (userData['userid'] != '0') && (userData['userid'] != '-1')), userData);
							}
						}
						else
						{
							if(isObject(rqh) && isFunction(rqh.getHttpStatusCode) && (rqh.getHttpStatusCode() == 403))
							{
								if(cocosApplicationActAsDevice())
								{
									//
									this.showDeviceOutOfUse();
									_scheduleReload();
								}
								else if(cocosApplicationActAsApplication())
								{
									var messages = extract(response, 'info', 'messages');
									var messageFound = false;

									if(messages.length > 0)
									{
										$.each(messages, function(k, message)
										{
											if(isFalse(messageFound))
											{
												var tag = extract(message, 'tag');
												switch(tag)
												{
													case 'deviceNotFound':
													case 'deviceUnavailable':
														messageFound = true;
														showMissingDevice();
														break;

													case 'guestDeviceUnavailable':
														messageFound = true;
														showMissingGuestDevice();
														break;

													case 'locationNotFound':
													case 'locationUnavailable':
														messageFound = true;
														showMissingTopology();
														break;
												}
											}
										});
									}

									if(isFalse(messageFound))
									{
										var error = apiConnector.getErrorFromResponse(response);

										//
										this.showApplicationOutOfUse(error);
									}
									_scheduleReload();
								}
							}
							else
							{
								_logStepToConsole('Not authorized on CoCoS API');
								_loginOntoCoCoSAPI(callbackSuccess, callbackError);
							}
						}

						return false;

					}.bind(this));
				}
				else
				{
					if(cocosApplicationIsLicenseError(error))
					{
						if(cocosApplicationAllowNoLicense())
						{
							// Check for callbackFunction, execute is available.
							if(typeof(callbackSuccess) === 'function')
							{
								callbackSuccess(true, false, {});
							}

						}
					}
					else if(isObject(rqh) && isFunction(rqh.getHttpStatusCode) && (rqh.getHttpStatusCode() == 403))
					{
						if(cocosApplicationActAsDevice())
						{
							//
							_disconnectFromCoCoSAPI();

							//
							this.showDeviceOutOfUse();
							_scheduleReload();
						}
						else if(cocosApplicationActAsApplication())
						{
							var messages = extract(response, 'info', 'messages');
							var messageFound = false;
							
							if(messages.length > 0)
							{
								$.each(messages, function(k, message)
								{
									if(isFalse(messageFound))
									{
										var tag = extract(message, 'tag');
										switch(tag)
										{
											case 'deviceNotFound':
											case 'deviceUnavailable':
												messageFound = true;
												showMissingDevice();
												break;

											case 'guestDeviceUnavailable':
												messageFound = true;
												showMissingGuestDevice();
												break;

											case 'locationNotFound':
											case 'locationUnavailable':
												messageFound = true;
												showMissingTopology();
												break;
										}
									}
								});
							}

							if(isFalse(messageFound))
							{
								var error = apiConnector.getErrorFromResponse(response);
									
								//
								_disconnectFromCoCoSAPI();

								//
								this.showApplicationOutOfUse(error);
							}
							_scheduleReload();
						}
					}
					else if(typeof(callbackError) === 'function')
					{
						//
						_disconnectFromCoCoSAPI();

						if(isset(error) && !isEmpty(error))
						{
							callbackError('Unable to connect; ' + error);	
						}						
						else
						{
							callbackError('Unable to connect; CoCoS API not available.');	
						}
					}
				}
			}.bind(this));
		}
		else
		{
			if(typeof(callbackError) === 'function')
			{
				callbackError('Unable to connect, no apiKey available.');
			}
		}
	}.bind(this);

	var _disconnectFromCoCoSAPI = function()
	{
		apiConnector = null;
		delete apiConnector;
	}

	/**
	 * { function_description }
	 *
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 */
	var _loginOntoCoCoSAPI = function(callbackSuccess, callbackError, errorWithoutCredentials)
	{
		// Go check for API loginToken
		//
		var apiLoginToken = _getCoCoSLoginToken();
		if(!isEmpty(apiLoginToken))
		{	
			//
			_logStepToConsole('Go login using loginToken');

			//
			apiConnector.handleLoginWithToken(apiLoginToken, function(isLoggedIn, userData)
			{
				// --
				//
				if(isLoggedIn === true)
				{
					_logStepToConsole('Succesfully logged in, using loginToken');

					// Check for callbackFunction, execute is available.
					if(typeof(callbackSuccess) === 'function')
					{
						callbackSuccess(true, true, userData);
					}
				}
				else
				{
					// Check for callbackError, execute is available.
					if(typeof(callbackError) === 'function')
					{
						callbackError('Login failed');
					}	
				}
			});
		}
		else
		{
			// Go find loginUsername and loginPassword for CoCoS API
			//
			var apiLoginUsername = null;
			var apiLoginPassword = null;

			var apiLoginUsernameAndPassword = _getCoCoSUsernamePassword();
			if(isObject(apiLoginUsernameAndPassword))
			{
				apiLoginUsername = extract(apiLoginUsernameAndPassword, 'u');
				apiLoginPassword = extract(apiLoginUsernameAndPassword, 'p');
			}

			//
			_logStepToConsole('Go login using username and password');

			// Go check for API loginUsername and loginPassword
			//
			if((apiLoginUsername != null) && (apiLoginPassword != null))
			{
				//
				apiConnector.handleLoginWithUserNamePassword(apiLoginUsername, apiLoginPassword, function(isLoggedIn, userData)
				{
					// --
					//
					if(isLoggedIn === true)
					{
						_logStepToConsole('Successfully logged in, using username and password');

						// Check for callbackFunction, execute is available.
						if(typeof(callbackSuccess) === 'function')
						{
							callbackSuccess(true, true, userData);
						}
					}
					else
					{
						// Check for callbackError, execute is available.
						if(typeof(callbackError) === 'function')
						{
							callbackError('Login failed');
						}	
					}
				});
			}
			else
			{	
				if(isTrue(errorWithoutCredentials))
				{
					// Check for callbackError, execute is available.
					//
					if(typeof(callbackError) === 'function')
					{
						callbackError('Unable to login, no login-credentials given.');
					}
				}
				else
				{
					// Check for callbackSuccess, execute is available.
					if(typeof(callbackSuccess) === 'function')
					{
						callbackSuccess(false, false, null);
					}
				}
			}
		}
	}

	/**
	 * Gets the device information.
	 *
	 * @param      {Function}  callbackFunction  The callback function
	 */
	var _getDeviceDataFromAPI = function(expandFiles, expandConfiguration, expandTextlib, expandTags, callbackSuccess, callbackError)
	{	
		//
		var options = {};

		//
		var expand = [];

		// Check if expand on files is needed
		//
		if(isTrue(expandFiles) && cocosApplicationUseFiles())
		{
			expand.push('files')
		}

		// Check if expand on configuration is needed
		//
		if(isTrue(expandConfiguration) && cocosApplicationUseConfig())
		{
			expand.push('configuration')
		}

		// Check if expand on textlib is needed
		//
		if(isTrue(expandTextlib) && cocosApplicationUseTextlib())
		{
			expand.push('textlib')
		}

		// Check if expand on tags is needed
		//
		if(isTrue(expandTags))
		{
			expand.push('tags');
		}

		if(expand.length > 0)
		{
			options['expand'] = expand.join(',');
		}

		apiConnector.read
		(
			'system',
			'devices',
			'me',
			null,
			options,
			null,
			function(response)
			{
				var deviceData = {};

				if(isset(response.data) && isObject(response.data) && (objectSize(response.data) == 1))
				{
					var device = response.data[0];
					deviceData = extract(device, 'data');

					if(typeof(callbackSuccess) === 'function')
					{
						callbackSuccess(deviceData);
					}
				}
				else
				{
					if(typeof(callbackError) === 'function')
					{
						var error = 'Unable to identify device';
						callbackError(error);
					}
				}
			}.bind(this),
			function(error)
			{
				if(typeof(callbackError) === 'function')
				{
					callbackError(error);
				}
			}
		);
	}.bind(this);

	/**
	 * Gets the application initialize configuration.
	 *
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 */
	var _getApplicationInitConfig = function(callbackSuccess, callbackError)
	{
		$.getJSON
		(
			'initConfig.json',
			function(response)
			{
				if(typeof(callbackSuccess) === 'function')
				{
					callbackSuccess(response);
				}
			}
		)
		.fail
		(
			function(jqXHR, textStatus, error)
			{
				if((extract(jqXHR, 'readyState') == 4) && (extract(jqXHR, 'status') == 404))
				{
					if(typeof(callbackSuccess) === 'function')
					{
						callbackSuccess({});
					}
				}
				else
				{
					var error = 'Error getting initConfig.json, ' + textStatus + ', ' + error;

					if(typeof(callbackError) === 'function')
					{
						callbackError(error);
					}
				}
			}
		);

	}.bind(this);

	/**
	 * Gets the application api configuration.
	 *
	 * @param      {<type>}    datastore        The datastore
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 * @return     {boolean}   The application api configuration.
	 */
	var _getApplicationAPIConfig = function(datastore, callbackSuccess, callbackError)
	{
		var configLibrary = '';
		var configCollection = '';
		var configIdentifier = '';
		var configAssociation = '';
		var configOptions = null;

		var isDevice = extract(datastore, 'isDevice');
		if(isTrue(isDevice))
		{
			var deviceData = extract(datastore, 'deviceData');

			configLibrary = 'system';
			configCollection = 'devices';
			configIdentifier = extract(deviceData, 'id');
			configAssociation = 'configuration';
		}
		else
		{
			var libColType = cocosApplicationGetLibraryCollectionType();
			if(!isNull(libColType))
			{
				configLibrary = 'system';
				configCollection = 'configurations';
				configOptions = {
					q: 'library:' + libColType['library'] + ',collection:' + libColType['collection'] +',type:' + libColType['type'],
					limit: 10000
				};
			}
			else
			{
				_logStepTonConsole('Skipped receiving configurations from the CoCoS API due to missing values for constants COCOS_APPLICATION_LIBRARY, COCOS_APPLICATION_COLLECTION and/or COCOS_APPLICATION_TYPE', 'warning');
				if(typeof(callbackSuccess) === 'function')
				{
					callbackSuccess({});
					return false;
				}
			}
		}
										
		apiConnector.read
		(
		 	configLibrary,
		 	configCollection,
		 	configIdentifier,
		 	configAssociation,
		 	configOptions,
		 	null,
		 	function(response)
			{
				var apiConfig = {};
				if(extract(response, 'meta', 'total') > 0)
				{	
					apiConfig = extract(response, 'data');
				}

				if(typeof(callbackSuccess) === 'function')
				{
					callbackSuccess(apiConfig);
				}
			},
			function(error)
			{
				if(typeof(callbackError) === 'function')
				{
					callbackError(error);
				}
			}
		);
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}    datastore        The datastore
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 */
	var _intersectConfigs = function(datastore, callbackSuccess, callbackError)
	{
		var initConfig = extract(datastore, 'initConfig');
		var apiConfig =  extract(datastore, 'apiConfig');

		var configLibrary = '';
		var configCollection = '';
		var configType = '';

		var isDevice = extract(datastore, 'isDevice');
		var idDevice = 0;

		if(isTrue(isDevice))
		{
			configLibrary = 'system';
			configCollection = 'devices'

			var deviceData = extract(datastore, 'deviceData');
			configType = extract(deviceData, 'type');
		}
		else
		{	
			var libColType = cocosApplicationGetLibraryCollectionType();
			if(!isNull(libColType))
			{
				configLibrary = libColType['library'];
				configCollection = libColType['collection'];
				configType = libColType['type'];
			}
		}

		if(!isTrue(isDevice) || (isTrue(isDevice) && !isEmpty(configType)))
		{
			var initConfigValid = true;
			var configurationsToCreate = [];
			var configurationsToUpdate = [];

			$.each(initConfig,function(k,configVar)
			{
				if(!isset(_applicationConfig[configVar.name]))
				{
					if(_isValidConfigVar(configVar))
					{
						var data = {
							library: configLibrary,
							collection: configCollection,
							type: configType,
							variable: configVar.name,
							form: configVar.form,
							comments: configVar.comments,
						};

						if(configVar.form == 'duration')
						{
							if(isArray(configVar.value))
							{
								data.valueDurationQuantity = configVar.value[0]
								data.valueDurationUnit = configVar.value[1];
							}
							else
							{
								initConfigValid = false;
								if(typeof(callbackError) === 'function')
								{
									error = 'Fout in configuratie van configVar: \''+configVar.name+'\' vanuit initConfig';
									callbackError(error);
									return false;
								}
							}
						}
						// Append selectOptions (if the configuration variable has 'select' as type
						// of form)
						//
						else if((configVar.form == 'select') && isset(configVar.options))
						{
							data.selectOptions = configVar.options.join("\n");
							data.globalValue = configVar.value;
						}
						else
						{
							data.globalValue = configVar.value;
						}

						configurationsToCreate.push(data);
					}
					else
					{
						initConfigValid = false;
						if(typeof(callbackError) === 'function')
						{
							error = 'Fout in configuratie van configVar: \''+configVar.name+'\' vanuit initConfig';
							callbackError(error);
							return false;
						}
					}
				}
			});

			if(isTrue(initConfigValid))
			{
				if(!cocosApplicationUseLocalConfig())
				{
					if(isArray(configurationsToCreate) && (configurationsToCreate.length > 0))
					{
						datastore['configurationsToCreate'] = configurationsToCreate;
					}

					if(isArray(configurationsToUpdate) && (configurationsToUpdate.length > 0))
					{
						datastore['configurationsToUpdate'] = configurationsToUpdate;
					}
				}

				if(typeof(callbackSuccess) === 'function')
				{
					callbackSuccess();
				}
			}
		}
		else
		{
			_logStepToConsole('Unable to sync configurations from initConfig onto the CoCoS API due to missing values for constants COCOS_APPLICATION_TYPE or unable to detect deviceType.', 'warning');

			// TOOD: Go append missing configs from initConfig onto the config-array
			//
			$.each(initConfig,function(k,configVar)
			{
				if(!isset(config[configVar.name]))
				{
					_addToConfig(configVar.name, configVar.value);
				}
			});

			if(typeof(callbackSuccess) === 'function')
			{
				callbackSuccess();
			}
		}
	}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {<type>}    datastore        The datastore
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 */
	var _updateConfigurationsOntoAPI = function(datastore, callbackSuccess, callbackError)
	{
		var isDevice = extract(datastore, 'isDevice');
		var configurationsToCreate = extract(datastore, 'configurationsToCreate');
		var configurationsToUpdate = extract(datastore, 'configurationsToUpdate');

		if(isArray(configurationsToCreate) && (configurationsToCreate.length > 0))
		{
			_logStepToConsole('Go create configurations onto CoCoS API.');

			if(isTrue(isDevice))
			{
				apiConnector.patch
				(
					'system',
					'devices',
					'me',
					null,
					null,
					{
						'deviceAction': 'handleConfiguration',
						'actionData': JSON.stringify(configurationsToCreate)
					},
				 	function(response)
					{	
						if(isTrue(extract(response, 'meta', 'result')))
						{
							$.each(configurationsToCreate,function(k,configVar)
							{
								if(isset(configVar.valueDurationQuantity) && isset(configVar.valueDurationUnit))
								{
									_addToConfig(configVar.variable, configVar.valueDurationQuantity, configVar.valueDurationUnit);
								}
								else
								{
									_addToConfig(configVar.variable, configVar.globalValue);
								}
							});
						}
						else
						{
							var messages = extract(response, 'info', 'messages');
							_handleResponseMessages(messages);
						}

						// After create is done, unset the configurations to
						// create and go execute this same function again.
						// 
						delete datastore['configurationsToCreate'];
						_updateConfigurationsOntoAPI(datastore, callbackSuccess, callbackError);

					}.bind(this),
					function(error)
					{
						if(typeof(callbackError) === 'function')
						{
							callbackError(error);
						}
					}
				);
			}
			else
			{
				_executeMultiPost
				(
				 	'system',
				 	'configurations',
				 	configurationsToCreate,
				 	function(response)
					{	
						if(isTrue(extract(response, 'meta', 'result')))
						{
							$.each(configurationsToCreate,function(k,configVar)
							{								
								_addToConfig(configVar.variable, configVar.globalValue);
							});
						}
						else
						{
							var messages = extract(response, 'info', 'messages');
							_handleResponseMessages(messages);
						}

						// After create is done, unset the configurations to
						// create and go execute this same function again.
						// 
						delete datastore['configurationsToCreate'];
						_updateConfigurationsOntoAPI(datastore, callbackSuccess, callbackError);

					}.bind(this),
					function(error)
					{
						if(typeof(callbackError) === 'function')
						{
							callbackError(error);
						}
					}
				);
			}
		}
		else if(isArray(configurationsToUpdate) && (configurationsToUpdate.length > 0))
		{
			_logStepToConsole('Go update configurations onto CoCoS API.');

			if(isTrue(isDevice))
			{
				apiConnector.patch
				(
					'system',
					'devices',
					'me',
					null,
					null,
					{
						'deviceAction': 'handleConfiguration',
						'actionData': JSON.stringify(configurationsToUpdate)
					},
				 	function(response)
					{	
						if(isTrue(extract(response, 'meta', 'result')))
						{
							$.each(configurationsToUpdate,function(k,configVar)
							{				
								if(isset(configVar.valueDurationQuantity) && isset(configVar.valueDurationUnit))
								{
									_addToConfig(configVar.variable, configVar.valueDurationQuantity, configVar.valueDurationUnit);
								}
								else
								{
									_addToConfig(configVar.variable, configVar.globalValue);
								}
							});
						}
						else
						{
							var messages = extract(response, 'info', 'messages');
							_handleResponseMessages(messages);
						}

						// After update is done, unset the configurations to
						// update and go execute this same function again.
						// 
						delete datastore['configurationsToUpdate'];
						_updateConfigurationsOntoAPI(datastore, callbackSuccess, callbackError);

					}.bind(this),
					function(error)
					{
						if(typeof(callbackError) === 'function')
						{
							callbackError(error);
						}
					}
				);
			}
			else
			{
				// TODO: Not implemented... 
			}
		}
		else
		{
			_logStepToConsole('No configurations to create and/or update onto CoCoS API.');

			if(typeof(callbackSuccess) === 'function')
			{
				callbackSuccess(datastore);
			}	
		}
	}

	/**
	 * Gets the application initialize textlib.
	 *
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 */
	var _getApplicationInitTextlib = function(callbackSuccess, callbackError)
	{
		$.getJSON
		(
			'initTextlib.json',
			function(response)
			{
				if(typeof(callbackSuccess) === 'function')
				{
					callbackSuccess(response);
				}
			}
		)
		.fail
		(
			function(jqXHR, textStatus, error)
			{
				if((extract(jqXHR, 'readyState') == 4) && (extract(jqXHR, 'status') == 404))
				{
					if(typeof(callbackSuccess) === 'function')
					{
						callbackSuccess({});
					}
				}
				else
				{
					var error = 'Error getting initTextlib.json, ' + textStatus + ', ' + error;

					if(typeof(callbackError) === 'function')
					{
						callbackError(error);
					}
				}
			}
		);

	}.bind(this);

	/**
	 * Gets the application api languages.
	 *
	 * @param      {Function}  callbackFunction  The callback function
	 */
	var _getApplicationAPILanguages = function(callbackFunction)
	{
		apiConnector.read(
			'mastertables',
			'languages',
			null,
			null,
			null,
			null,
			function(response)
			{
				if(isset(callbackFunction) && typeof(callbackFunction) === 'function')
				{
					callbackFunction(response.data);
				}
			},
			function(error, response, xhr)
			{
				logWarningToConsole('Unable to fetch/get languages from API, continuing without. Got error: \''+error+'\'.');

				// When not allowed to fetch/get languages... then... no languages!
				//
				if(xhr.getHttpStatusCode() == 403)
				{
					if(isset(callbackFunction) && typeof(callbackFunction) === 'function')
					{
						callbackFunction({});
					}	
				}
			}
		);
	};

	/**
	 * Gets the application api configuration.
	 *
	 * @param      {<type>}    datastore        The datastore
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 * @return     {boolean}   The application api configuration.
	 */
	var _getApplicationAPITextlib = function(datastore, callbackSuccess, callbackError)
	{
		var textlibLibrary = '';
		var textlibCollection = '';
		var textlibIdentifier = '';
		var textlibAssociation = '';
		var textlibOptions = null;

		var isDevice = extract(datastore, 'isDevice');
		if(isTrue(isDevice))
		{
			var deviceData = extract(datastore, 'deviceData');

			textlibLibrary = 'system';
			textlibCollection = 'devices';
			textlibIdentifier = extract(deviceData, 'id');
			textlibAssociation = 'textlib';
		}
		else
		{
			var libColType = cocosApplicationGetLibraryCollectionType();
			if(!isNull(libColType))
			{
				textlibLibrary = 'languages';
				textlibCollection = 'textlibTags';
				textlibOptions = {
					q: 'library:' + libColType['library'] + ',collection:' + libColType['collection'] + ',type:' + libColType['type'],
					limit: 10000,
				};
			}	
			else
			{
				_logStepToConsole('Skipped receiving configurations from the CoCoS API due to missing values for constants COCOS_APPLICATION_LIBRARY, COCOS_APPLICATION_COLLECTION and/or COCOS_APPLICATION_TYPE', 'warning');
				if(typeof(callbackSuccess) === 'function')
				{
					callbackSuccess({});
					return false;
				}
			}
		}
										
		apiConnector.read
		(
		 	textlibLibrary,
		 	textlibCollection,
		 	textlibIdentifier,
		 	textlibAssociation,
		 	textlibOptions,
		 	null,
		 	function(response)
			{
				var apiTextlib = {};
				if(extract(response, 'meta', 'total') > 0)
				{	
					apiTextlib = extract(response, 'data');
				}

				if(typeof(callbackSuccess) === 'function')
				{
					callbackSuccess(apiTextlib);
				}
			},
			function(error)
			{
				if(typeof(callbackError) === 'function')
				{
					callbackError(error);
				}
			}
		);
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}    datastore        The datastore
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {<type>}    callbackError    The callback error
	 */
	var _intersectTextlibs = function(datastore, callbackSuccess, callbackError)
	{
		var initTextlib = extract(datastore, 'initTextlib');
		var apiTextlib =  extract(datastore, 'apiTextlib');

		var textlibLibrary = '';
		var textlibCollection = '';
		var textlibType = '';

		var isDevice = extract(datastore, 'isDevice');

		if(isTrue(isDevice))
		{
			textlibLibrary = 'system';
			textlibCollection = 'devices'

			var deviceData = extract(datastore, 'deviceData');
			textlibType = extract(deviceData, 'type');
		}
		else
		{	
			var libColType = cocosApplicationGetLibraryCollectionType();
			if(!isNull(libColType))
			{
				textlibLibrary = libColType['library'];
				textlibCollection = libColType['collection'];
				textlibType = libColType['type'];
			}
		}

		if(!isTrue(isDevice) || (isTrue(isDevice) && !isEmpty(textlibType)))
		{
			var initTextlibValid = true;
			var textLabelsToCreate = [];
			var textLabelsToUpdate = [];

			// After receiving the textlib fron the API, go check all the textTags from
			// the initTextLib. When a tag is found in the initTextLib, but not in the
			// textlib we received from the API, we'll create the tag in the API so it
			// can be managed from now on. After receiving the textlib again from the 
			// API, the missing tags will now be added and this loop below will result
			// in no further actions when called again (when the application reloads).
			// 
			// So this loop won't do anything until a new tag is added in the
			// initTextLib, then the new tag will be posted to the API and then it's
			// again doing nothing unless a new tag is added again.
			// 					
			$.each(initTextlib,function(tag,languages)
			{
				// Check if the tag from the initTextlib is found in the textLib
				// from the API.
				//
				if(!isset(_applicationTextlib[tag.toLowerCase()]))
				{
					// When not, go create a textTag which can be posted to the
					// API.
					//
					var textLabel = {
						'tag':		tag,
						'library':	textlibLibrary,
						'collection':	textlibCollection,
						'type':		textlibType,
						'form':		'shortText',
					}

					// Now, for all languages available in the initTextLib, go
					// add a globalValue for that language, using the
					// translation from the initTextLib.
					// 
					$.each(languages,function(shortCode,translation)
					{
						if(isset(_applicationLanguages[shortCode]))
						{
							textLabel['' + COCOS_TEXTLIB_GLOBALPREFIX + '' + shortCode.toUpperCase() + ''] = translation;
						}
					});

					// Then, go check all languages received for this
					// application from the API. Check for each languages if a
					// value was set from the initTextLib, if not, go add the
					// COCOS_TEXTLIB_DEFAULTVALUE for the missing languages.
					// 
					$.each(_applicationLanguages, function(shortCode, languageName)
					{
						if(!isset(textLabel['' + COCOS_TEXTLIB_GLOBALPREFIX + '' + shortCode.toUpperCase() + '']))
						{
							// Try to get a translation for the tag
							// based on the _applicationLanguages. If
							// not found, use the
							// COCOS_TEXTLIB_DEFAULTVALUE.
							//
							if(isset(_applicationTextlib[tag.toLowerCase()]) && isset(_applicationTextlib[tag.toLowerCase()][shortCode.toUpperCase()]))
							{
								textLabel['' + COCOS_TEXTLIB_GLOBALPREFIX + '' + shortCode.toUpperCase() + ''] = '1'+_applicationTextlib[tag.toLowerCase()][shortCode.toUpperCase()];
							}
							else if(isset(initTextlib[tag]) && isset(initTextlib[tag][_applicationLanguage.toUpperCase()]))
							{
								textLabel['' + COCOS_TEXTLIB_GLOBALPREFIX + '' + shortCode.toUpperCase() + ''] = '2'+initTextlib[tag][_applicationLanguage.toUpperCase()];
							}
							else
							{
								textLabel['' + COCOS_TEXTLIB_GLOBALPREFIX + '' + shortCode.toUpperCase() + ''] = '3'+COCOS_TEXTLIB_DEFAULTVALUE;
							}
						}
					});

					// Push the created textlabel onto the textLabelsToCreate-
					// array, so after the whole loop of checking text-tags, we
					// know if new tags must be added or not and, if so, we can
					// add them all together in a mulitRequest to the CoCoS API.
					// 
					textLabelsToCreate.push(textLabel);
				}
				else
				{
					// When the tag IS found in the
					// textlib we received from the API,
					// we'll check all languages we
					// received for this application
					// from the API. Check for each
					// languages if a value was set in
					// the textlib, if not, go add the
					// COCOS_TEXTLIB_DEFAULTVALUE for the
					// missing languages.
					$.each(_applicationLanguages, function(shortCode, languageName)
					{
						if(isset(_applicationTextlib[tag.toLowerCase()]) && !isset(_applicationTextlib[tag.toLowerCase()][shortCode.toUpperCase()]))
						{
							var textLabel = {'meta': {'identifier': ''}, 'data': {}};

							if(isTrue(isDevice))
							{
								textLabel['meta']['identifier'] = 'tag:'+[tag.toLowerCase()];
							}
							else
							{
								textLabel['meta']['identifier'] = _applicationTextlibIds[tag.toLowerCase()];
							}

							// Try to get a translation
							// for the tag based on the
							// _applicationLanguages. If
							// not fount, use the
							// COCOS_TEXTLIB_DEFAULTVALUE.
							//
							if(isset(_applicationTextlib[tag.toLowerCase()]) && isset(_applicationTextlib[tag.toLowerCase()][_applicationLanguage.toUpperCase()]) && isset(_applicationTextlib[tag.toLowerCase()][_applicationLanguage.toUpperCase()][COCOS_WILDCARD_IDENTIFIER]))
							{
								textLabel['data']['' + COCOS_TEXTLIB_GLOBALPREFIX + '' + shortCode.toUpperCase() + ''] = _applicationTextlib[tag.toLowerCase()][_applicationLanguage][COCOS_WILDCARD_IDENTIFIER];
							}
							else if(isset(initTextlib[tag]) && isset(initTextlib[tag][_applicationLanguage.toUpperCase()]))
							{
								textLabel['data']['' + COCOS_TEXTLIB_GLOBALPREFIX + '' + shortCode.toUpperCase() + ''] = initTextlib[tag][_applicationLanguage];	
							}
							else
							{
								textLabel['data']['' + COCOS_TEXTLIB_GLOBALPREFIX + '' + shortCode.toUpperCase() + ''] = COCOS_TEXTLIB_DEFAULTVALUE;
							}
							

							// Push the created
							// textlabel onto the
							// textLabelsToCreate-
							// array, so after
							// the whole loop of
							// checking text-tags,
							// we know if new
							// languages for tags
							// must be added or
							// not and, if so,
							// we can add them
							// all together in a
							// mulit-request to
							// the CoCoS API.
							// 
							textLabelsToUpdate.push(textLabel);
						}
					});
				}
			});

			if(isTrue(initTextlibValid))
			{
				if(isArray(textLabelsToCreate) && (textLabelsToCreate.length > 0))
				{
					datastore['textLabelsToCreate'] = textLabelsToCreate;
				}

				if(isArray(textLabelsToUpdate) && (textLabelsToUpdate.length > 0))
				{
					datastore['textLabelsToUpdate'] = textLabelsToUpdate;
				}

				// When the loop of the initTextLib is done and all
				// the tags from the API matched the tags in the
				// initTextLib, nothing has to be done. So we'll
				// check if we have a callbackSuccess available.
				// If so, call it in order to continue.
				// 
				if(typeof(callbackSuccess) === 'function')
				{
					callbackSuccess();
				}
			}
		}
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}    datastore        The datastore
	 * @param      {Function}  callbackSuccess  The callback success
	 * @param      {Function}  callbackError    The callback error
	 */
	var _updateTextlibsOntoAPI = function(datastore, callbackSuccess, callbackError)
	{
		var isDevice = extract(datastore, 'isDevice');
		var textLabelsToCreate = extract(datastore, 'textLabelsToCreate');
		var textLabelsToUpdate = extract(datastore, 'textLabelsToUpdate');

		if(isArray(textLabelsToCreate) && (textLabelsToCreate.length > 0))
		{
			_logStepToConsole('Go create textlabels onto CoCoS API.');

			if(isTrue(isDevice))
			{
				apiConnector.patch
				(
					'system',
					'devices',
					'me',
					null,
					null,
					{
						'deviceAction': 'handleTextlabels',
						'actionData': JSON.stringify(textLabelsToCreate)
					},
				 	function(response)
					{	
						if(isTrue(extract(response, 'meta', 'result')))
						{
							// 
							$.each(textLabelsToCreate,function(k, data)
							{
								var applicationLanguages = this.getApplicationLanguages();
								var textTag = extract(data, 'tag');

								$.each(applicationLanguages, function(languageCode, languageName)
								{
									var textTagValue = extract(data, COCOS_TEXTLIB_GLOBALPREFIX+''+languageCode.toUpperCase());

									_addToTextLib(textTag, languageCode, textTagValue);
								});

							}.bind(this));
						}
						else
						{
							var messages = extract(response, 'info', 'messages');
							_handleResponseMessages(messages);
						}

						// After create is done, unset the configurations to
						// create and go execute this same function again.
						// 
						delete datastore['configurationsToCreate'];
						_updateConfigurationsOntoAPI(datastore, callbackSuccess, callbackError);

					}.bind(this),
					function(error)
					{
						if(typeof(callbackError) === 'function')
						{
							callbackError(error);
						}
					}
				);
			}
			else
			{
				_executeMultiPost
				(
				 	'languages',
				 	'textlibTags',
				 	textLabelsToCreate,
				 	function(response)
					{
						if(isTrue(extract(response, 'meta', 'result')))
						{
							// 
							$.each(textLabelsToCreate,function(k, data)
							{
								var applicationLanguages = this.getApplicationLanguages();
								var textTag = extract(data, 'tag');

								$.each(applicationLanguages, function(languageCode, languageName)
								{
									var textTagValue = extract(data, COCOS_TEXTLIB_GLOBALPREFIX+''+languageCode.toUpperCase());

									_addToTextLib(textTag, languageCode, textTagValue);
								});

							}.bind(this));
						}
						else
						{
							var messages = extract(response, 'info', 'messages');
							_handleResponseMessages(messages);
						}

						// After create is done, unset the textlabels to
						// create and go execute this same function again.
						// 
						delete datastore['textLabelsToCreate'];
						_updateTextlibsOntoAPI(datastore, callbackSuccess, callbackError);

					}.bind(this),
					function(error)
					{
						if(typeof(callbackError) === 'function')
						{
							callbackError(error);
						}
					}
				);
			}
		}
		else if(isArray(textLabelsToUpdate) && (textLabelsToUpdate.length > 0))
		{
			_logStepToConsole('Go update textlabels onto CoCoS API.');

			if(isTrue(isDevice))
			{
				apiConnector.patch
				(
					'system',
					'devices',
					'me',
					null,
					null,
					{
						'deviceAction': 'handleTextlabels',
						'actionData': JSON.stringify(textLabelsToUpdate)
					},
				 	function(response)
					{	
						if(isTrue(extract(response, 'meta', 'result')))
						{
							//
							$.each(textLabelsToUpdate,function(textTag, data)
							{
								var applicationLanguages = this.getApplicationLanguages();
								var textTag = extract(data, 'tag');

								$.each(applicationLanguages, function(languageCode, languageName)
								{
									var textTagValue = extract(data, COCOS_TEXTLIB_GLOBALPREFIX+''+languageCode.toUpperCase());

									_addToTextLib(textTag, languageCode, textTagValue);
								});

							}.bind(this));
						}
						else
						{
							var messages = extract(response, 'info', 'messages');
							_handleResponseMessages(messages);
						}

						// After update is done, unset the textlabels to
						// update and go execute this same function again.
						// 
						delete datastore['textLabelsToUpdate'];
						_updateTextlibsOntoAPI(datastore, callbackSuccess, callbackError);

					}.bind(this),
					function(error)
					{
						if(typeof(callbackError) === 'function')
						{
							callbackError(error);
						}
					}
				);
			}
			else
			{
				_executeMultiPatch
				(
				 	'languages',
				 	'textlibTags',
					textLabelsToUpdate,
					function(response)
					{
						if(isTrue(extract(response, 'meta', 'result')))
						{
							//
							$.each(textLabelsToUpdate,function(textTag, data)
							{
								var extract = this.getApplicationLanguages();
								var textTag = extract(data, 'tag');

								$.each(applicationLanguages, function(languageCode, languageName)
								{
									var textTagValue = extract(data, COCOS_TEXTLIB_GLOBALPREFIX+''+languageCode.toUpperCase());

									_addToTextLib(textTag, languageCode, textTagValue);
								});

							}.bind(this));
						}
						else
						{
							var messages = extract(response, 'info', 'messages');
							_handleResponseMessages(messages);
						}

						// After update is done, unset the textlabels to
						// update and go execute this same function again.
						// 
						delete datastore['textLabelsToUpdate'];
						_updateTextlibsOntoAPI(datastore, callbackSuccess, callbackError);
					},
					function(error)
					{
						if(typeof(callbackError) === 'function')
						{
							callbackError(error);
						}
					}
				);
			}
		}
		else
		{
			_logStepToConsole('No textlabels to create and/or update onto CoCoS API.');

			if(typeof(callbackSuccess) === 'function')
			{
				callbackSuccess(datastore);
			}	
		}
	}.bind(this);

	/**
	 * Determines if valid configuration variable.
	 *
	 * @param      {<type>}   configVar  The configuration variable
	 * @return     {boolean}  True if valid configuration variable, False otherwise.
	 */
	var _isValidConfigVar = function(configVar)
	{
		if((configVar.form != 'input') && (configVar.form != 'number') && (configVar.form != 'toggle') && (configVar.form != 'select') && (configVar.form != 'duration'))
		{
			return false;
		}

		return true;
	};

	/**
	 * { function_description }
	 *
	 * @param      {<type>}    library           The library
	 * @param      {<type>}    collection        The collection
	 * @param      {<type>}    data              The data
	 * @param      {Function}  callbackSucces    The success callback
	 * @param      {Function}  callbackError     The error callback
	 */
	var _executeMultiPost = function(library, collection, data, callbackSucces, callbackError)
	{
		_executeMultiRequest('POST', library, collection, data, callbackSucces, callbackError);
		
	}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {<type>}    library          The library
	 * @param      {<type>}    collection       The collection
	 * @param      {<type>}    data             The data
	 * @param      {Function}  callbackSucces   The success callback
	 * @param      {Function}  callbackError    The error callback
	 */
	var _executeMultiPatch = function(library, collection, data, callbackSucces, callbackError)
	{
		//
		_executeMultiRequest('PATCH', library, collection, data, callbackSucces, callbackError);

	}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {Function}  method           The method
	 * @param      {<type>}    library          The library
	 * @param      {<type>}    collection       The collection
	 * @param      {<type>}    data             The data
	 * @param      {Function}  callbackSucces   The success callback
	 * @param      {Function}  callbackError    The error callback
	 */
	var _executeMultiRequest = function(method, library, collection, data, callbackSucces, callbackError)
	{
		apiConnector.multi
		(
			method,
			library,
			collection,
			null,
			null,
			null,
			data,
			function(response)
			{
				if(typeof(callbackSucces) === 'function')
				{
					callbackSucces();
				}			
			},
			function(error)
			{
				if(typeof(callbackError) === 'function')
				{
					callbackError(error);
				}			
			}
		);
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}   deviceData     The device data
	 * @param      {<type>}   detectChanges  The detect changes
	 * @return     {boolean}  { description_of_the_return_value }
	 */
	var _handleDeviceDataFromApi = function(deviceData, detectChanges)
	{
		var changesDetected = false;

		if(isObject(deviceData) && (objectSize(deviceData) > 0))
		{
			if(isTrue(detectChanges))
			{
				$.each(deviceData, function(field, value)
				{
					if(field == 'files')
					{
						var files = extract(value, 'data');
						if(isObject(files))
						{
							_handleDeviceFilesFromApi(files, true);
						}
					}
					else
					{
						var currentValue = this.getDataFromDevice(field);

						if((currentValue != value))
						{
							changesDetected = true;

							//
							_overwriteDeviceData(field, value);
							_handleChangedDeviceData(field, value);
						}
					}

				}.bind(this));
			}
			else
			{
				var files = null;

				if(isset(deviceData.files))
				{
					files = extract(deviceData.files, 'data');
					delete deviceData.files;
				}

				_setDeviceData(deviceData);

				if(isObject(files) && (objectSize(files) > 0))
				{
					_handleDeviceFilesFromApi(files);
				}

			}
		}
		
		if(!isTrue(detectChanges) || isTrue(changesDetected))
		{
			return true;
		}

	}.bind(this);

	var _handleDeviceFilesFromApi = function(filesData, detectChanges)
	{
		var deviceFilesToRemove = this.getDeviceFiles();

		if(isObject(filesData) && (objectSize(filesData) > 0))
		{
			$.each(filesData, function(k, file)
			{
				var fileData = extract(file, 'data');

				var fileType = extract(fileData, 'linkType');
				var key = 'files.'+fileType;
				var file = extract(fileData, 'fileUrl');

				if(isset(deviceFilesToRemove[key]))
				{
					delete deviceFilesToRemove[key];
				}

				if(isTrue(detectChanges))
				{
					var currentFile = this.getDataFromDevice(key);
					if((currentFile != file))
					{
						changesDetected = true;

						//
						_overwriteDeviceData(key, file);
						_handleChangedDeviceData(key, file);
					}
				}
				else
				{
					_overwriteDeviceData(key, file);
				}

			}.bind(this));
		}

		if(isObject(deviceFilesToRemove) && (objectSize(deviceFilesToRemove) > 0))
		{
			$.each(deviceFilesToRemove, function(key, file)
			{
				_overwriteDeviceData(key, '');
				if(isTrue(detectChanges))
				{
					_handleChangedDeviceData(key, '');
				}
			});
		}

	}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {<type>}   tagsFromApi    The tags from api
	 * @param      {<type>}   detectChanges  The detect changes
	 * @return     {boolean}  { description_of_the_return_value }
	 */
	var _handleTagsFromApi = function(tagsFromApi, detectChanges)
	{
		var changesDetected = false;

		if(isObject(tagsFromApi) && (objectSize(tagsFromApi) > 0))
		{
			$.each(tagsFromApi, function(k, item)
			{
				var itemData = extract(item, 'data');

				if(isTrue(detectChanges))
				{
					var currentValue = this.getTagValueFromDevice(extract(itemData, 'variable'));
					if(extract(itemData, 'variable') != currentValue)
					{
						changesDetected = true;
						_addDeviceTag
						(
						 	extract(itemData, 'id'),
						 	extract(itemData, 'name'),
						 	extract(itemData, 'variable'),
						 	extract(itemData, 'value')
						);
						_handleChangedDeviceTag(extract(itemData, 'variable'), extract(itemData, 'value'));
					}
				}

				_addDeviceTag
				(
				 	extract(itemData, 'id'),
				 	extract(itemData, 'name'),
				 	extract(itemData, 'variable'),
				 	extract(itemData, 'value')
				);
			})
		}
		
		if(!isTrue(detectChanges) || isTrue(changesDetected))
		{
			return true;
		}
	}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {<type>}   textlibFromApi  The textlib from api
	 * @param      {<type>}   detectChanges   The detect changes
	 * @return     {boolean}  { description_of_the_return_value }
	 */
	var _handleTextlibsFromApi = function(textlibFromApi, detectChanges)
	{
		var changesDetected = false;

		if(isObject(textlibFromApi) && (objectSize(textlibFromApi) > 0))
		{
			$.each(textlibFromApi, function(k,item)
			{
				var itemData = extract(item, 'data');

				$.each(itemData, function(field, value)
				{			
					if(field.substring(0, COCOS_TEXTLIB_GLOBALPREFIX.length) == COCOS_TEXTLIB_GLOBALPREFIX)
					{
						var languageCode = field.substring(COCOS_TEXTLIB_GLOBALPREFIX.length);
						var fieldSpecificText = COCOS_TEXTLIB_SPECIFICPREFIX+''+languageCode;
						var textTagValue = '';

						if(isset(itemData[fieldSpecificText]) && !isEmpty(itemData[fieldSpecificText], true))
						{
							textTagValue = itemData[fieldSpecificText];	
						}
						else
						{
							textTagValue = value;	
						}

						if(!isset(_applicationTextlib[itemData.tag.toLowerCase()]))
						{
							_applicationTextlib[itemData.tag.toLowerCase()] = {};
						}

						if(isTrue(detectChanges))
						{
							var currentTagValue = this.getTextFromLib(itemData.tag, [], languageCode);

							if((currentTagValue != textTagValue))
							{
								changesDetected = true;

								//
								_addToTextLib(itemData.tag, languageCode, textTagValue);
								_handleChangedTextlib(itemData.tag, textTagValue, languageCode);
							}
						}
						else
						{
							_addToTextLib(itemData.tag, languageCode, textTagValue);
						}

					}

					_applicationTextlibIds[itemData.tag.toLowerCase()] = itemData.id;

				}.bind(this));
			}.bind(this));
		}
		
		if(!isTrue(detectChanges) || isTrue(changesDetected))
		{
			return true;
		}
	}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {<type>}   configFromApi  The configuration from api
	 * @param      {<type>}   detectChanges  The detect changes
	 * @return     {boolean}  { description_of_the_return_value }
	 */
	var _handleConfigsFromApi = function(configFromApi, detectChanges)
	{
		var changesDetected = false;

		if(isObject(configFromApi) && (objectSize(configFromApi) > 0))
		{
			$.each(configFromApi, function(k, item)
			{
				if(isset(item.data) && isObject(item.data))
				{
					var itemData = item.data;
					if(isset(itemData.variable) && isset(itemData.value))
					{
						var configVariable = extract(itemData, 'variable');
						var configValue = extract(itemData, 'value');

						if(isTrue(detectChanges))
						{
							var currentValue = this.getVarFromConfig(configVariable);

							if((currentValue != configValue))
							{
								changesDetected = true;

								//
								_overwriteConfigVar(configVariable, configValue);
								_handleChangedConfigVar(configVariable, configValue);
							}
						}
						else
						{
							_addToConfig(configVariable, configValue);
						}
					}
				}
			}.bind(this))
		}
		
		if(!isTrue(detectChanges) || isTrue(changesDetected))
		{
			return true;
		}
	}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {string}  variable  The variable
	 * @param      {string}  value     The value
	 */
	var _handleChangedConfigVar = function(variable, value)
	{
		logDebugToConsole('Value changed for configVariable \'' + variable + '\' - New value: \'' + value + '\'.', DEBUG_ORIGIN_CONFIG);

		switch(variable)
		{
			case 'eventPollingFrequency':
				_restartListenToEvents();
				break;
		}

		if(typeof(appConfigVarChanged) == 'function')
		{
			appConfigVarChanged(variable, value);
		}
	}

	/**
	 * { function_description }
	 *
	 * @param      {string}  textTag       The text tag
	 * @param      {string}  value         The value
	 * @param      {string}  languageCode  The language code
	 */
	var _handleChangedTextlib = function(textTag, value, languageCode)
	{
		logDebugToConsole('Text changed for textlib \'' + textTag + '\', languageCode \'' + languageCode + '\' - New value: \'' + value + '\'.', DEBUG_ORIGIN_TEXTLIB);

		if(typeof(appTextlibChanged) == 'function')
		{
			appTextlibChanged(textTag, value, languageCode);
		}
	}

	/**
	 * { function_description }
	 *
	 * @param      {string}  tag     The tag
	 * @param      {string}  value   The value
	 */
	var _handleChangedDeviceTag = function(tag, value)
	{
		logDebugToConsole('Value changed for tag \'' + tag + '\' - New value: \'' + value + '\'.', DEBUG_ORIGIN_TEXTLIB);

		if(typeof(appDeviceTagChanged) == 'function')
		{
			appDeviceTagChanged(tag, value);
		}
	}	

	/**
	 * { function_description }
	 *
	 * @param      {string}           field   The field
	 * @param      {(number|string)}  value   The value
	 */
	var _handleChangedDeviceData = function(field, value)
	{
		logDebugToConsole('Value changed for field \'' + field + '\' - New value: \'' + value + '\'.', DEBUG_ORIGIN_DEVICE);

		switch(field)
		{
			case 'status':
				// console.log('STATUS CHANGED!');
				break;

			case 'refresh':
				if(value > 0)
				{
					_reloadApplication();
				}
				break;

			case 'ipAddress':
				// console.log('IP ADDRESS CHANGED!');
				break;

			case 'keyForDevice':
				// console.log('DEVICE KEY CHANGED!');
				break;
		}

		if(typeof(appDeviceDataChanged) == 'function')
		{
			appDeviceDataChanged(field, value);
		}

	}.bind(this);

	var _currentStep = 0;

	/**
	 * { function_description }
	 */
	var _start = function()
	{
		_createInvalidSizeMessage();

		this.showLoading();
		this.heartbeat();

		_goToStep(1, {});
	}.bind(this);

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _goNextStep = function(datastore)
	{
		_goToStep((_currentStep+1), datastore);
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _goSuccessStep = function(datastore)
	{
		_goToStep(98, datastore);
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _goErrorStep = function(datastore)
	{
		_goToStep(99, datastore);
	}

	/**
	 * { function_description }
	 *
	 * @param      {<type>}  step       The step
	 * @param      {<type>}  datastore  The datastore
	 */
	var _goToStep = function(step, datastore)
	{
		if(isset(step) && !isEmpty(step))
		{
			// Overwrite currentStep
			//
			_currentStep = step;

			switch(_currentStep)
			{
				case 1:		_01_start(datastore);				break;
				case 2:		_02_handleAppConfig(datastore);			break;
				case 3:		_03_connectToCoCoSAPI(datastore);		break;

				case 4:		_04_identifyAsDevice(datastore);		break;

				case 5:		_05_getApplicationInitConfig(datastore);	break;
				case 6:		_06_getApplicationAPIConfig(datastore);		break;
				case 7:		_07_handleConfiguration(datastore);		break;
				case 8:		_08_updateConfigurationsToAPI(datastore);	break;

				case 9:		_09_getAplicationLanguages(datastore);		break;

				case 10:	_10_getApplicationInitTextlib(datastore);	break;
				case 11:	_11_getApplicationAPITextlib(datastore);	break;
				case 12:	_12_handleTextlibs(datastore);			break;
				case 13:	_13_updateTextlibsOntoAPI(datastore);		break;

				case 98:	_98_handleCallbackSuccess(datastore);		break;
				case 99:	_99_handleCallbackError(datastore);		break;
			}
		}
	}

	/**
	 * STEP 1: Go receive configuration from CoCoS API
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _01_start = function(datastore)
	{
		_logStepToConsole('Start');

		_getApplicationConfig
		(
			// Function to execute when _getApplicationConfig() was successful.
			//
			function(appConfig)
			{
				if(objectSize(appConfig) > 0)
				{
					//
					_logStepToConsole('Succesfully received configuration for application!', 'confirm');
				}
				else
				{
					_logStepToConsole('Got empty configuration for application!', 'warning');
				}

				//
				datastore['appConfig'] = appConfig;

				// Successfully received appConfig... Go to next step
				//
				_goNextStep(datastore);

			}.bind(this),

			// Function to execute when _getApplicationConfig() failed
			//
			function(error)
			{	
				//
				_logStepToConsole(error, 'error');

				//
				datastore['error'] = error;
				_goErrorStep(datastore);
			}
		);
	}.bind(this);

	/**
	 * STEP 2: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _02_handleAppConfig = function(datastore)
	{
		_logStepToConsole('Go handle appConfig');

		//
		var appConfig = extract(datastore, 'appConfig');

		if(isObject(appConfig) && (objectSize(appConfig) > 0))
		{
			_logStepToConsole('Got '+objectSize(appConfig)+' configurations for application!', 'info');

			$.each(appConfig, function(k, item)
			{
				if(isset(item.data) && isObject(item.data))
				{
					var itemData = item.data;
					if(isset(itemData.name) && isset(itemData.value))
					{
						if((typeof(itemData.value) != 'undefined') && (itemData.value != 'undefined'))
						{
							_addToConfig(itemData.name, itemData.value);
						}
					}
				}
			});
		
			_logStepToConsole('Successfully handled config for app!');
		}
		else
		{
			_logStepToConsole('No configuration found for application!', 'warning');
		}

		if(!isTrue(this.getConfigVar('allowNonSSL')) && (window.location.protocol != 'https:'))
		{
			window.location.href = 'https://'+window.location.host+window.location.pathname+window.location.search+window.location.hash;
		}

		// Successfully handled config for app, go to next step
		//
		_goNextStep(datastore);

	}.bind(this);

	/**
	 * STEP 3: Connect with CoCoS API
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _03_connectToCoCoSAPI = function(datastore)
	{
		_logStepToConsole('Go try to connect to CoCoS API');

		_connectWithCoCoSAPI
		(
			// Function to execute when _connectWithCoCoSAPI() failed
			//
			function(isAuthorized, isLoggedIn, userData)
			{
				_logStepToConsole('Successfully connected (and authorized) onto the CoCoS API!');

				datastore['isAuthorized'] = isAuthorized;
				datastore['isLoggedIn'] = isLoggedIn;
				datastore['userData'] = userData;

				_goNextStep(datastore);
			},

			// Function to execute when _connectWithCoCoSAPI() failed
			//
			function(error)
			{
				if(cocosApplicationIsLicenseError(error))
				{
					if(cocosApplicationAllowNoLicense())
					{
						_logStepToConsole('Connected onto a unlicensed CoCoS API!');
						datastore['isAuthorized'] = false;
						datastore['isLoggedIn'] = false;
						datastore['userData'] = {};

						_goNextStep(datastore);
					}
					else
					{
						showNoLicense();
					}
				}
				else
				{
					//
					_logStepToConsole(error, 'error');

					//
					datastore['error'] = error;
					_goErrorStep(datastore);
				}
			}
		);
	}

	/**
	 * STEP 4: Connect with CoCoS API
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _04_identifyAsDevice = function(datastore)
	{
		if(cocosApplicationActAsDevice())
		{
			_logStepToConsole('Go identify device');

			_getDeviceDataFromAPI
			(
			 	true,
			 	true,
			 	true,
			 	true,

				// Function to execute when _getDeviceDataFromAPI() failed
				//
				function(deviceData)
				{
					_logStepToConsole('Successfully identified as device on the CoSoS API.');
					
					if(isset(deviceData.configuration))
					{
						var deviceConfiguration = extract(deviceData, 'configuration', 'data');
						if(isObject(deviceConfiguration))
						{
							datastore['apiConfig'] = deviceConfiguration;
						}
						delete deviceData.configuration;
					}

					if(isset(deviceData.textlib))
					{
						var deviceTextlib = extract(deviceData, 'textlib', 'data');
						if(isObject(deviceTextlib))
						{
							datastore['apiTextlib'] = deviceTextlib;
						}
						delete deviceData.textlib;
					}

					if(isset(deviceData.tags))
					{
						var deviceTaglist = extract(deviceData, 'tags', 'data');
						_handleTagsFromApi(deviceTaglist);
						delete deviceData.tags;
					}

					var isDeviceActive = isTrue(extract(deviceData, 'status'));

					datastore['isDevice'] = true;
					datastore['isDeviceActive'] = isDeviceActive;
					datastore['deviceData'] = deviceData;

					_handleDeviceDataFromApi(deviceData);

					_setStatusToAPI(COCOS_DEVICE_STATUS_INITIALIZING, function()
					{
						_setApplicationVersionToAPI();

						if(extract(deviceData, 'refresh') > 0)
						{
							_patchRefreshToAPI(0, function()
							{
								// Successfully received deviceInformation, go to next step.
								//
								_goNextStep(datastore);
							});
						}
						else
						{
							// Successfully received deviceInformation, go to next step.
							//
							_goNextStep(datastore);
						}
					});

				}.bind(this),

				// Function to execute when _getDeviceDataFromAPI() failed
				//
				function(error)
				{
					this.showDeviceOutOfUse();

					//
					_logStepToConsole(error, 'error');

					setTimeout(function()
					{
						_04_identifyAsDevice(datastore);
					}, 10000);

					/*
					datastore['error'] = error;
					_goErrorStep(datastore);
					*/

				}.bind(this)
			)
		}
		else
		{
			_logStepToConsole('Device-identification skipped due to value of constant COCOS_APPLICATION_ACT_DEVICE.');

			// Check if identified as device from userData
			//
			var userData = extract(datastore, 'userData');
			if(!isEmpty(extract(datastore, 'userData', 'deviceid')) && (extract(datastore, 'userData', 'deviceid') != 0))
			{
				datastore['isDevice'] = true;
				datastore['isDeviceActive'] = true;
				datastore['deviceData'] = {
					'idDevice': extract(datastore, 'userData', 'deviceId')
				};
			}

			// Device-identification skipped, go to next step.
			//
			_goNextStep(datastore);
		}
	}.bind(this);

	/**
	 * STEP 5: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _05_getApplicationInitConfig = function(datastore)
	{
		// Check if config is needed
		//
		if(cocosApplicationUseConfig())
		{
			datastore['initConfig'] = null;

			if(cocosApplicationActAsDevice())
			{
				if(isTrue(extract(datastore, 'isDevice')) && isTrue(extract(datastore, 'deviceData', 'maintenance')))
				{
					_logStepToConsole('Get initConfig for application');

					_getApplicationInitConfig
					(
						function(initConfig)
						{
							_logStepToConsole('Successfully received initConfig from JSON-file.');
							datastore['initConfig'] = initConfig;

							//
							_goNextStep(datastore);
						}, 

						function(error)
						{
							//
							_logStepToConsole(error, 'error');

							//
							datastore['error'] = error;
							_goErrorStep(datastore);
						}
					);
				}
				else
				{
					//
					_goNextStep(datastore);
				}
			}
			else if(cocosApplicationInMaintenanceMode() || cocosApplicationUseLocalConfig())
			{
				_logStepToConsole('Get initConfig for application');

				_getApplicationInitConfig
				(
					function(initConfig)
					{
						_logStepToConsole('Successfully received initConfig from JSON-file.');
						datastore['initConfig'] = initConfig;

						//
						_goNextStep(datastore);
					}, 

					function(error)
					{
						//
						_logStepToConsole(error, 'error');

						//
						datastore['error'] = error;
						_goErrorStep(datastore);
					}
				);
			}
			else
			{
				//
				_goNextStep(datastore);
			}
		}
		// Otherwise, execute callback function
		//
		else
		{
			_logStepToConsole('Getting configuration skipped due to value of constant COCOS_APPLICATION_USE_CONFIG.');
			_goToStep(9, datastore);
		}
	}

	/**
	 * STEP 6: { function_description }
	 * 
	 * @param      {<type>}  datastore  The datastore
	 */
	var _06_getApplicationAPIConfig = function(datastore)
	{
		if(!cocosApplicationUseLocalConfig())
		{
			_logStepToConsole('Get config for application');

			var apiConfig = extract(datastore, 'apiConfig');

			if(isObject(apiConfig))
			{
				_logStepToConsole('Already found config from API (probably from device...)');
				datastore['apiConfig'] = apiConfig;

				// 
				_handleConfigsFromApi(apiConfig);

				//
				_goNextStep(datastore);
			}
			else
			{
				_logStepToConsole('Go get config from CoCoS API');

				_getApplicationAPIConfig
				(
					datastore,
				 	function(apiConfig)
					{
						_logStepToConsole('Successfully received apiConfig from CoCoS API.');
						datastore['apiConfig'] = apiConfig;

						// 
						_handleConfigsFromApi(apiConfig);

						//
						_goNextStep(datastore);
					},
					function(error)
					{
						//
						_logStepToConsole(error, 'error');

						//
						datastore['error'] = error;
						_goErrorStep(datastore);
					}
				);
			}
		}
		else
		{
			//
			_goNextStep(datastore);
		}
	}

	/**
	 * STEP 7: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _07_handleConfiguration = function(datastore)
	{
		_logStepToConsole('Go intersect configurations');

		//
		_intersectConfigs
		(
		 	datastore,
		 	function()
			{
				_logStepToConsole('Configurations merged successfully');

				//
				_goNextStep(datastore);
			},
			function(error)
			{
				//
				_logStepToConsole(error, 'error');

				//
				datastore['error'] = error;
				_goErrorStep(datastore);
			}
		);
	}.bind(this);

	/**
	 * STEP 8: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _08_updateConfigurationsToAPI = function(datastore)
	{
		_logStepToConsole('Go update configurations onto API...');

		var configurationsToCreate = extract(datastore, 'configurationsToCreate');
		var configurationsToUpdate = extract(datastore, 'configurationsToUpdate');

		var updateToApi = true;
		if(cocosApplicationUseLocalConfig())
		{
			updateToApi = false;
		}
		else if(cocosApplicationActAsDevice())
		{
			updateToApi = (isTrue(extract(datastore, 'isDevice')) && isTrue(extract(datastore, 'deviceData', 'maintenance')));
		}

		if(isTrue(updateToApi) && ((isArray(configurationsToCreate) && (configurationsToCreate.length > 0)) || (isArray(configurationsToUpdate) && (configurationsToUpdate.length > 0))))
		{
			_updateConfigurationsOntoAPI
			(
			 	datastore,
			 	function(datastore)
				{
					_logStepToConsole('Configurations updated successfully');

					_goNextStep(datastore)
				},
				function(error)
				{
					//
					_logStepToConsole(error, 'error');

					//
					datastore['error'] = error;
					_goErrorStep(datastore);
				}
			);
		}
		else
		{
			_goNextStep(datastore);
		}
	}

	/**
	 * STEP 9: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _09_getAplicationLanguages = function(datastore)
	{
		// Check if textlibs are needed
		//
		if(cocosApplicationUseTextlib())
		{
			_logStepToConsole('Get languages for application from API');

			if(cocosApplicationUseLocalTextlib())
			{
				// Add default language
				//
				_addApplicationLanguage('NL', 'Nederlands');

				//
				_goNextStep(datastore);
			}
			else
			{
				_getApplicationAPILanguages
				(
					// Function to execute when _connectWithCoCoSAPI() failed
					//
					function(apiLanguages)
					{
						_logStepToConsole('Successfully received languages from CoCoS API.');

						$.each(apiLanguages,function(k,language)
						{	
							if(language.data.status == 1)
							{
								_addApplicationLanguage(language.data.shortcode, language.data.name);
							}
						});

						//
						_goNextStep(datastore);
					},

					// Function to execute when _connectWithCoCoSAPI() failed
					//
					function(error)
					{
						//
						_logStepToConsole(error, 'error');

						//
						datastore['error'] = error;
						_goErrorStep(datastore);
					}
				);
			}
		}
		// Otherwise, execute callback function
		//
		else
		{
			_logStepToConsole('Getting textlibs skipped due to value of constant COCOS_APPLICATION_USE_TEXTLIB.');

			// Add default language
			//
			_addApplicationLanguage('NL', 'Nederlands');

			//
			_goSuccessStep(datastore);
		}
	}

	/**
	 * STEP 10: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _10_getApplicationInitTextlib = function(datastore)
	{
		_logStepToConsole('Get initTextlib for application');

		// Check if textlibs are needed
		//
		if(cocosApplicationUseTextlib())
		{
			datastore['initTextlib'] = null; 

			if(cocosApplicationActAsDevice())
			{
				if(isTrue(extract(datastore, 'isDevice')) && isTrue(extract(datastore, 'deviceData', 'maintenance')))
				{
					_logStepToConsole('Get initTextlib for application');

					_getApplicationInitTextlib
					(
						function(initTextlib)
						{
							_logStepToConsole('Successfully received initTextlib from JSON-file.');
							datastore['initTextlib'] = initTextlib;

							//
							_goNextStep(datastore);
						}, 

						function(error)
						{
							//
							_logStepToConsole(error, 'error');

							//
							datastore['error'] = error;
							_goErrorStep(datastore);
						}
					);
				}
				else
				{
					//
					_goNextStep(datastore);
				}
			}
			else if(cocosApplicationInMaintenanceMode() || cocosApplicationUseLocalTextlib())
			{
				_logStepToConsole('Get initTextlib for application');

				_getApplicationInitTextlib
				(
					function(initTextlib)
					{
						_logStepToConsole('Successfully received initTextlib from JSON-file.');
						datastore['initTextlib'] = initTextlib;

						//
						_goNextStep(datastore);
					}, 

					function(error)
					{
						//
						_logStepToConsole(error, 'error');

						//
						datastore['error'] = error;
						_goErrorStep(datastore);
					}
				);
			}
			else
			{
				//
				_goNextStep(datastore);
			}
		}
		// Otherwise, execute callback function
		//
		else
		{
			_logStepToConsole('Getting textlibs skipped due to value of constant COCOS_APPLICATION_USE_TEXTLIB.');

			//
			_goSuccessStep(datastore);
		}
	}

	/**
	 * STEP 11: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _11_getApplicationAPITextlib = function(datastore)
	{
		if(!cocosApplicationUseLocalTextlib())
		{
			_logStepToConsole('Get textlibs for application');

			var apiTextlib = extract(datastore, 'apiTextlib');

			if(isObject(apiTextlib))
			{
				_logStepToConsole('Already found textlib from API (probably from device...)');

				//
				if(isObject(apiTextlib) && (objectSize(apiTextlib) > 0))
				{
					_handleTextlibsFromApi(apiTextlib);
				}

				datastore['apiTextlib'] = apiTextlib;

				//
				_goNextStep(datastore);
			}
			else
			{
				_logStepToConsole('Go get textlib from CoCoS API');

				_getApplicationAPITextlib
				(
					datastore,
				 	function(apiTextlib)
					{
						_logStepToConsole('Successfully received apiTextlib from CoCoS API.');

						//
						if(isObject(apiTextlib) && (objectSize(apiTextlib) > 0))
						{
							_handleTextlibsFromApi(apiTextlib);
						}

						datastore['apiTextlib'] = apiTextlib;

						//
						_goNextStep(datastore);
					},
					function(error)
					{
						//
						_logStepToConsole(error, 'error');

						//
						datastore['error'] = error;
						_goErrorStep(datastore);
					}
				);
			}
		}
		else
		{
			//
			_goNextStep(datastore);
		}
	}

	/**
	 * STEP 12: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _12_handleTextlibs = function(datastore)
	{
		_logStepToConsole('Go handle textlibs');

		//
		_intersectTextlibs
		(
		 	datastore,
		 	function()
			{
				_logStepToConsole('Textlibs merged successfully');
				_goNextStep(datastore)
				
			},
			function(error)
			{
				//
				_logStepToConsole(error, 'error');

				//
				datastore['error'] = error;
				_goErrorStep(datastore);
			}
		);
	}.bind(this);

	/**
	 * STEP 13: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _13_updateTextlibsOntoAPI = function(datastore)
	{
		_logStepToConsole('Go update textlibs onto API...');

		var textLabelsToCreate = extract(datastore, 'textLabelsToCreate');
		var textLabelsToUpdate = extract(datastore, 'textLabelsToUpdate');

		var updateToApi = true;
		if(cocosApplicationUseLocalTextlib())
		{
			updateToApi = false;
		}
		else if(cocosApplicationActAsDevice())
		{
			updateToApi = (isTrue(extract(datastore, 'isDevice')) && isTrue(extract(datastore, 'deviceData', 'maintenance')));
		}

		if(isTrue(updateToApi) && ((isArray(textLabelsToCreate) && (textLabelsToCreate.length > 0)) || (isArray(textLabelsToUpdate) && (textLabelsToUpdate.length > 0))))
		{
			_updateTextlibsOntoAPI
			(
			 	datastore,
			 	function(datastore)
				{
					_logStepToConsole('Textlibs updated successfully');
					_goSuccessStep(datastore);
				},
				function(error)
				{
					//
					_logStepToConsole(error, 'error');

					//
					datastore['error'] = error;
					_goErrorStep(datastore);
				}
			);
		}
		else
		{
			if(isArray(textLabelsToCreate) && (textLabelsToCreate.length > 0))
			{
				// 
				$.each(textLabelsToCreate,function(k, data)
				{
					var applicationLanguages = this.getApplicationLanguages();
					var textTag = extract(data, 'tag');

					$.each(applicationLanguages, function(languageCode, languageName)
					{
						var textTagValue = extract(data, COCOS_TEXTLIB_GLOBALPREFIX+''+languageCode.toUpperCase());

						_addToTextLib(textTag, languageCode, textTagValue);
					});

				}.bind(this));
			}

			if(isArray(textLabelsToUpdate) && (textLabelsToUpdate.length > 0))
			{
				//
				$.each(textLabelsToUpdate,function(textTag, data)
				{
					var applicationLanguages = this.getApplicationLanguages();
					var textTag = extract(data, 'tag');

					$.each(applicationLanguages, function(languageCode, languageName)
					{
						var textTagValue = extract(data, COCOS_TEXTLIB_GLOBALPREFIX+''+languageCode.toUpperCase());

						_addToTextLib(textTag, languageCode, textTagValue);
					});

				}.bind(this));
			}

			_goSuccessStep(datastore);
		}
	}.bind(this);

	/**
	 * STEP 98: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _98_handleCallbackSuccess = function(datastore)
	{
		//
		_logStepToConsole('Go handle callback-success');

		_applicationStarted = true;
		this.heartbeat();

		if(isTrue(extract(datastore, 'isDevice')))
		{
			_startListenToEvents(true);
		}
		else
		{
			if(!isEmpty(_applicationDeviceId) && (_applicationDeviceId != 0))
			{
				datastore['isDevice'] = true;
				datastore['isDeviceActive'] = true;
				datastore['deviceData'] = {
					'id': _applicationDeviceId,
					'name': apiConnector.getDeviceName()
				};
			}
		}

		if(!isEmpty(_applicationTopologyId) && (_applicationTopologyId != 0))
		{
			datastore['idTopologyActive'] = true;
			datastore['idTopologyActive'] = true;
			datastore['topologyData'] = {
				'id': _applicationTopologyId,
				'name': apiConnector.getTopologyName()
			};
		}

		if(typeof(_applicationCallbackFunction) === 'function')
		{
			_applicationCallbackFunction(
				extract(datastore, 'isAuthorized'),
				extract(datastore, 'isLoggedIn'),
				extract(datastore, 'userData'),
				extract(datastore, 'isDevice'),
				extract(datastore, 'isDeviceActive'),
				extract(datastore, 'deviceData'),
				extract(datastore, 'topologyData'),
			);
		};

	}.bind(this);

	/**
	 * STEP 99: { function_description }
	 *
	 * @param      {<type>}  datastore  The datastore
	 */
	var _99_handleCallbackError = function(datastore)
	{
		//
		_logStepToConsole('Go handle callback-error');

		if(isTrue(extract(datastore, 'isDevice')))
		{
			_setStatusToAPI(COCOS_DEVICE_STATUS_ERROR);
		}

		// Handle error

		var error = extract(datastore, 'error');
		if(isEmpty(error))
		{
			logErrorToConsole('Error during start of application, application halted in step ' + _currentStep + '.');
		}

		this.showApplicationOutOfUse();

	}.bind(this);

	/**
	 * { var_description }
	 *
	 * @type       {<type>}
	 */
	var _applicationEventListner = null;

	/**
	 * { function_description }
	 */
	var _restartListenToEvents = function()
	{
		_stopListenToEvents();
		_applicationEventListner = null;
		_startListenToEvents();
	}

	/**
	 * Stops listen to events.
	 */
	var _stopListenToEvents = function()
	{
		// Check if we have a cocosEventListner-event which has a stop-function.
		// If so, stop the request to prevent multiple simultaneous polling-
		// requests on the CoCoS-API.
		// 
		if(isset(_applicationEventListner) && (isFunction(_applicationEventListner.stop)))
		{
			// Stop current continuousRead on events
			//
			_applicationEventListner.stop();
		}
	}

	/**
	 * Gets the event polling frequency.
	 *
	 * @return     {(Function|number)}  The event polling frequency.
	 */
	var _getEventPollingFrequency = function()
	{
		// Get eventPollingFrequency from config (if available, otherwise, get default value)
		// 
		var eventPollingFrequency = parseFloat(this.getVarFromConfig('eventPollingFrequency', 10));

		// Check eventPollingFrequency to determine how many milliseconds must be used between the
		// fetches of the eventlist. WHen the value 0 is given, the API-call will be executed as an
		// endless request, waiting for results. In other cases, the given value will be used. When
		// the value is below 1.000 milliseconds, set it to 1.000 milliseconds to prevent
		// 
		if((eventPollingFrequency > 0 && eventPollingFrequency < 0.5))
		{
			eventPollingFrequency = 0.5;
		}

		return eventPollingFrequency;
	}.bind(this);

	/**
	 * Starts listen to events.
	 */
	var _startListenToEvents = function(waitForStart)
	{
		if(isNull(_applicationEventListner))
		{
			// Get eventPollingFrequency from config (if available, otherwise, get default value)
			// 
			var eventPollingFrequency = _getEventPollingFrequency();

			var startTimeout = 0;

			// When waitForstart-boolean is set to true, don't immediately start with
			// fetching events, but wait the given eventPollingFrequency before starting
			// to fetch events. For example, when the eventPollingFrequency is set to 10
			// and the waitForstart-boolean is true, we will set a timeout for 10.000 ms
			// before starting the eventLister.
			// 
			// When the eventPollingFrequency is set to 0 (no polling, using endless
			// requests on the CoCoS API), we will set the timeout for 0 milliseconds,
			// which will cause the eventListner to start immediately, despite the 
			// waitForstart-boolean set to true. 
			// 
			if(isTrue(waitForStart))
			{
				startTimeout = (parseInt(eventPollingFrequency)*1000);
			}

			setTimeout
			(
			 	function()
				{
					_applicationEventListner = apiConnector.continuousRead
					(
					 	// library
						'system',

						// collection
						'eventlist',

						// identifier
						'',

						// association
						null,

						// data
						{
							q: 'deviceId:'+this.getDataFromDevice('id')
						},

						// options
						{
							fetchAndRemove: true,
							reportPresence: true
						},

						// eventPollingFrequency
						(eventPollingFrequency*1000),

						// callbackSuccess for eventList
						//
						function(response, requestHandler)
						{
							// Send a heartbeat signal to notify we're still up and running
							this.heartbeat();

							var deviceUpdate = false;
							var configUpdate = false;
							var languageUpdate = false;
							var tagUpdate = false;

							if(isset(response.data))
							{
								$.each
								(
									response.data,
									function(k, item)
									{
										if(isset(item.data))
										{
											var itemData = item.data;

											switch(itemData.name)
											{
												case 'changed':
													deviceUpdate = true;
													break;

												 case 'configUpdate':
				 									configUpdate = true;
													break;

				 								 case 'languageUpdate':
				 									languageUpdate = true;
													break;

												 case 'tagUpdate':
				 									tagUpdate = true;
													break;
											}
										}
									}
								);
							}

							if(isTrue(deviceUpdate) || isTrue(configUpdate) || isTrue(languageUpdate) || isTrue(tagUpdate))
							{
								_getDeviceDataFromAPI
								(
								 	true,
								 	configUpdate,
								 	languageUpdate,
								 	tagUpdate,
								 	function(deviceData)
								 	{
								 		// Go check if configs must be updated
								 		// and configuration is found in the
								 		// response / deviceData-object from
								 		// the CoCoS API.
								 		// 
										if(isTrue(configUpdate) && isset(deviceData.configuration))
										{
											// Fetch deviceConfiguration
											// from API-response and go
											// _handleConfigsFromApi().
											// 
											// Set second parameter to
											// true to detect changes.
											// 
											var deviceConfiguration = extract(deviceData, 'configuration', 'data');
											if(_handleConfigsFromApi(deviceConfiguration, true))
											{
												// New configuration
												// from API handled
												// successfully. 
												// 
												// Changes were
												// detected!
												//
											}

											delete deviceData.configuration;
										}

								 		// Go check if textlibs must be
								 		// updated and texts are found in the
								 		// response / deviceData-object from
								 		// the CoCoS API.
								 		// 
										if(isTrue(languageUpdate) && isset(deviceData.textlib))
										{
											// Fetch deviceTextlib
											// from API-response and go
											// _handleTextlibsFromApi().
											// 
											// Set second parameter to
											// true to detect changes.
											// 
											var deviceTextlib = extract(deviceData, 'textlib', 'data');
											if(_handleTextlibsFromApi(deviceTextlib, true))
											{
												// New configuration
												// from API handled
												// successfully. 
												// 
												// Changes were
												// detected, go 
												// apply the textlib
												// onto all the
												// DOM-elements.
												//
												this.applyTextlib();
											}

											delete deviceData.textlib;
										}
										
								 		// Go check if tags must be updated
								 		// and tags are found in the
								 		// response / deviceData-object from
								 		// the CoCoS API.
								 		// 
										if(isTrue(tagUpdate) && isset(deviceData.tags))
										{
											// Fetch deviceTaglist
											// from API-response and go
											// _handleTagsFromApi().
											// 
											// Set second parameter to
											// true to detect changes.
											// 
											var deviceTaglist = extract(deviceData, 'tags', 'data');
											_handleTagsFromApi(deviceTextlib, true);
											delete deviceData.tags;
										}

										var isDeviceActive = isTrue(extract(deviceData, 'status'));
										var wasDeviceActive = this.getDataFromDevice('status');

										//
										_handleDeviceDataFromApi(deviceData, true);

										if(isFalse(isDeviceActive) && isTrue(wasDeviceActive))
										{
											this.showDeviceOutOfUse();
										}
										else if(isTrue(isDeviceActive) && isFalse(wasDeviceActive))
										{
											if(isTrue(_applicationReloadWhenDeviceActivates))
											{
												_reloadApplication(true);	
											}
											else
											{
												_setStatusToAPI(COCOS_DEVICE_STATUS_RUNNING);
											}
										}

								 	}.bind(this),
								 	function(error)
								 	{
								 		// Received event, but
								 		// after getting the
								 		// data for the device,
								 		// we got no response.
								 		// 
								 		// This can mean the
								 		// data is changed so
								 		// much the device is
								 		// no longer available.
								 		// 
								 		// Go reload to verify
								 		// we are still a valid
								 		// device?
								 		// 
										_reloadApplication(true);
								 	}
								);
							}
						}.bind(this),

						// callbackError for eventList
						//
						function(error, response, requestHandler)
						{
							var httpStatusCode = requestHandler.getHttpStatusCode();
							
							// ERROR FROM EVENTLIST
							//
							if(httpStatusCode == 401)
							{	
								_loginOntoCoCoSAPI
								(
								 	function()
									{
										_restartListenToEvents();
									},
									function()
									{
										apiConnector.resetCookie();
										_reloadApplication();
									},
									true
								);
							}
							else if((httpStatusCode != 200) && (httpStatusCode != 207))
							{
								apiConnector.resetCookie();
								_reloadApplication();
							}
							else
							{
								var currentValue = this.getDataFromDevice('status');

								if(currentValue != -1)
								{
									//
									_overwriteDeviceData('status', -1);
									_handleChangedDeviceData('status', -1);
								}
							}
						}.bind(this),

						// callbackComplete
						function(response, requestHandler)
						{
							// Nothing here...
							//
						}.bind(this),

						// progressFunction
						null,

						// validateResult	
						true,

						// rqh
						null,

						// executeCallbackSuccessOnEmptyResponse
						true	
					)
				}.bind(this),
				startTimeout
			);
		}
	}.bind(this);

	/**
	 * Loads a view.
	 *
	 * @param      {string}    view              The view
	 * @param      {Function}  target            The target
	 * @param      {Function}  callbackFunction  The callback function
	 */
	this.loadView = function(view, target, callbackFunction)
	{
		this.blockUserInput();

		logToConsole('Go load view: ' + view);

		if(!isset(target) || isEmpty(target))
		{
			target = $('body');
		}
		else if(isString(target))
		{
			target = $(target);
		}

		if(!isset(view) || isEmpty(view))
		{
		 	view = 'main';
		}

		$.ajax
		({
		 	url: 'views/'+view+'.html',
		 	timeout: 5000,
		 	success: function(data, textStatus, jqXHR)
		 	{
				logToConsole('View: ' + view + ' successfully loaded');

		 		target.html(data);
		 		this.applyTextlib(target);

		 		if(isFunction(callbackFunction))
		 		{
		 			var callbackFunctionResult = callbackFunction();
		 			if(callbackFunctionResult !== false)
		 			{
		 				this.unblockUserInput();
		 			}
		 		}
		 	}.bind(this)
		});
	}

	// Thanks to Fabrizio Bianchi, https://codepen.io/_fbrz/pen/mpiFE
	//
	/* var _loadingHtml = ''
		+ '<div id=\'cocosApplicationLoader\'>'
  			+ '<div id=\'cocosApplicationLoaderBox\'></div>'
		+ '</div>'; 

	/* var _loadingCss = ''
		+ ' #cocosApplicationLoader { '
  			+ ' position: absolute; ' 
    			+ ' top: calc(50% - 4vmin); '
    			+ ' left: calc(50% - 4vmin); '
  		+ ' } '

  		+ ' #cocosApplicationLoaderBox { '
    			+ ' width: 8vmin; '
    			+ ' height: 8vmin; '
    			+ ' background: #FEFEFE; '
    			+ ' animation: jellyBox .6s ease-in-out infinite; '
    			+ ' position: absolute; '
    			+ ' top: 0; '
    			+ ' left: 0; '
    			+ ' border-radius: 1vmin; '
  		+ ' } '

  		+ ' @keyframes jellyBox { '
    			+ ' 17% { border-bottom-right-radius: 1vmin; } '
    			+ ' 25% { transform: translateY(1vmin) rotate(22.5deg); } '
    			+ ' 40% { background-color: #FEFEFE; } '
    			+ ' 48% { background-color: #FFFFFF; } '
    			+ ' 50% { '
      				+ ' transform: translateY(2vmin) scale(1,.9) rotate(45deg) ; '
    	  			+ ' border-bottom-right-radius: 5vmin; '
    			+ ' 	} '
    			+ ' 52% { background-color: #FFFFFF; } '
    			+ ' 60% { background-color: #EEEEEE; } '
    			+ ' 75% { transform: translateY(1vmin) rotate(67.5deg); } '
    			+ ' 100% { transform: translateY(0) rotate(90deg); } '
    		+ '}'; */

    	// Thanks to Luuk Haas, https://projects.lukehaas.me/css-loaders/
    	//
	var _loadingHtml = ''
		+ ' <div id=\'cocosApplicationLoader\'>Loading...</div> ';

    	var _loadingCss = ''
    		+ ' #cocosApplicationLoader { '
  			+ ' position: absolute; ' 
    			+ ' top: calc(50% - 2vmin); '
    			+ ' left: calc(50% - 1vmin); '
    			+ ' color: #FEFEFE; '
      			+ ' font-size: 2vmin; '
      			+ ' width: 1.5vmin; '
      			+ ' height: 1.5vmin; '
      			+ ' border-radius: 50%; '
      			+ ' text-indent: -9999em; '
      			+ ' -webkit-animation: load4 1.3s infinite linear; '
      			+ ' animation: load4 1.3s infinite linear; '
      			+ ' -webkit-transform: translateZ(0); '
      			+ ' -ms-transform: translateZ(0); '
      			+ ' transform: translateZ(0); '
      			+ ' margin-top: 1.5vmin; '
		+ ' } '
		+ ' '
		+ ' @-webkit-keyframes load4 { '
  			+ ' 0%, '
  			+ ' 100% { '
  				+ 'box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0; '
    			+ ' } '
    			+ ' 12.5% { '
    	  			+ 'box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em; '
    			+ ' } '
    			+ ' 25% { '
      				+ 'box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em; '
    			+ ' } '
    			+ ' 37.5% { '
      				+ 'box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em; '
    			+ ' } '
    			+ ' 50% { '
    	  			+ 'box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em; '
  			+ ' } '
    			+ ' 62.5% { '
    	  			+ 'box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em; '
    			+ ' } '
    			+ ' 75% { '
    	  			+ 'box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0; '
    			+ ' } '
    			+ ' 87.5% { '
    	  			+ ' box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em; '
    			+ ' } '
		+ ' } '
  		+ ' @keyframes load4 { '
    			+ ' 0%,'
    			+ ' 100% { '
      				+ ' box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0; '
    			+ ' } '
    			+ ' 12.5% { '
      				+ ' box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em; '
    			+ ' } '
    			+ ' 25% { '
      				+ ' box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em; '
    			+ ' } '
    			+ ' 37.5% { '
      				+ ' box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em; '
    			+ ' } '
    			+ ' 50% { '
    	  			+ ' box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em; '
	  		+ ' } '
    			+ ' 62.5% { '
      				+ ' box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em; '
    			+ ' } '
    			+ ' 75% { '
      				+ ' box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0; '
    			+ ' } '
  	  		+ ' 87.5% { '
      				+ ' box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em; '
    			+ ' } '
		+ ' } ';

	var _faviconSrc = 'data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAE'
    		+ 'ACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAADx8vYAULSBAPLy9gDIytEAy8vLADydcwD09PMAhpGnADF'
    		+ 'tfQDi4uIAV2uaAEF4XwA+YIwARah5ANTU1ABErXYA/f38ANXU1AAwZlcAMFZvAOvr6wBGsXkASbJ8ADR'
    		+ 'kYwDGxsYASrJ8AE6zfwDd3d0AOGxgAD6ddACYocUAyMzhAD53XQBBeGAAQqd3AENcigBAY40AR7F6AEi'
    		+ 'xegDY2dsA2dnbAKyxvwBLsn0ANl1zAMfJ0ADKysoAhpCmAOHh4QA+nngAVW2ZAD93XgDk5vAA1NPTAOr'
    		+ 'q6gBEsHgARbB4AEllggA2j3AApKzMAEixewBJsXsAxcXFAECPZwBOaIIANmtfADdxVgA6mnYA8/PzAOD'
    		+ 'g3wDOzs4APXZcAODi7gDl5eUARbB5AEaweQBLqnkAxcjPAMbIzwA3cVcA8vLxADJwbwDh4OAAPFaEAD5'
    		+ '2XQBEqHQAQ1uKAOnp6QBGsHoAxMTEAEmwegAqa2oATWeBAC1mdgA2XHMA29zeAC9vbQDz9PgAO2B2ADx'
    		+ '1WwCKk6kAQqB4AECldQDR0dAAWWyZAOPl8ACfp8kA6OjnADqIZwA0UGsARK94AC9lWQD///4Aqa+9ADN'
    		+ 'rWQAzaVwAyMjIANvc3wDx8fAA39/fADp0WQA/nHYAQ3piADFXbwDDw8MASrN8AEuzfAA2WXUAPZt0AD2'
    		+ 'edAA7dFoAVGiYAD1zYABAnXoAOHxgAOPj4wCepsgAPX9gAEF5YABCeWAARF2KAP7+/QBHXo0ARLF3AEe'
    		+ 'yegBIsnoAOZFyAEuzfQDHx8cAN15zAD2RewDe3t4A397eAPPz+ADGyd8APG5kAN7g7QDQ0NAAQKV4AEB'
    		+ '4XgAoXmIAQWGOAMLCwgBFsXgATWOCAEmyewBMs34AOppz' + 'A'.repeat(476) + 'U3mJiiBiTkGI'
    		+ 'S5KlKhqlASGJgVN3gXFuEoVUkDwmOypTiVMgmn4jZ6Nsnx2PJRYqYjJiF406MwBeTC5dkXw7GTKeQFUf'
    		+ 'EHVIRWaXKV1kfCYyRhOHEFYJdnOhLVFjUBYlC4OLR08JCXZzWD0OA2ENJXccCmAUCYZ2c3tYBCc/eI8+'
    		+ 'coKYFC8JlpN7ewQoW38VWWtSm0MvLxsYoXs0LCtlNyUPXB6MNS8bGKEERC5aNzclojAMmW8GapwRRHB6'
    		+ 'BaJtNzYVlaBpaAJ0TQd6ORU3bUlKO32ECCQxOJRfgKIlSjY3bUklkKSdQqYikqQlJjslSjdXPBalJY4V'
    		+ 'GRY7OyUZKg' + 'A'.repeat(85) + '=';

    	/**
    	 * Gets the favicon source.
    	 *
    	 * @return     {<type>}  The favicon source.
    	 */
    	this.getFaviconSrc = function()
    	{
    		return _faviconSrc;
    	}

    	if(applicationStartImmediately === true)
    	{
		// GO START!
		//
		_start();
    	}
    	else
    	{
		this.start = function()
		{
			_start();
		}
	}
	
};
