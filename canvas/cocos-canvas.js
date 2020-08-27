/***
 *     ___      ___     ___ 
 *    / __|___ / __|___/ __|
 *   | (__/ _ \ (__/ _ \__ \
 *    \___\___/\___\___/___/, grown by (concera
 * 
 * -------------------------------------------------------------------------------------------------
 * @author(s)		Stefan van Buren
 * @copyright 		Concera Software - https://concera.software
 * @dateCreated		2018-?
 * @lastChange		2020-08-18
 * @version		1.20.230
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
 *  2020-08-18		1.20.230	SvB
 *  	[Fixed] Fixed issues when switching between canvasses with/without a backgroundColor and/or
 *	backgroundImage.
 *	[Deprecated] Disabled handling for actions openCanvas and prompt, because they're not working
 *	properly.
 *
 *  2020-06-17		1.20.168	SvB
 *  	[Fixed] When enabling/disabling groups/objects with childs (or making them visible/invisible),
 *	the properties of the objects 'inside' (the childs) will also be changed, making them all
 *	visible/invisible at the same time.
 *
 *  2020-06-15		1.20.166	SvB
 *  	[Fixed] Fixed some issues with the canvas, which kept opening new requests again and again
 *	when resizing/rebuilding the canvas. Exceding the maximum amount of simultanious requests
 *	on the same domain/host.
 *	[Removed] Removed lot of console.log-calls and other junk-code.
 *
 *  2019-09-06		1.19.248	SvB
 *  	[Changed] Changed the sort-parameter from -microtime to -timestamp to prevent executing a
 *	invalid API-call.
 *
 * -------------------------------------------------------------------------------------------------
 *
 * # FILEDESCRIPTION:
 * 
 * This file is build on top of the CoCoS API, grown by (concera. A restFULL
 * API, which acts as an service to provide data and communication between
 * (web-)interfaces and physical devices using only web-techniques.
 */

/***
 * CoCoS Canvas
 * This class is defined to generate a canvas and its objects by data from the CoCoS API
 * It uses the libary jCanvas(https://projects.calebevans.me/jcanvas/) for generating canvasses with jQuerty/Javascript.
 *  
 * It uses ECMAScript 6 classes to easily generate a canvas.
 *
 */
var object = null;

class CocosCanvas
{
	/**
	* Constructor CoCoS Canvas
	*
	* This will set all variables needed to generate a canvas, and it will start a event listening to the webAPI after
	* succesfully logged in credentials based on the config file.
	*
	* @param dataUrl This is the URL for the webAPI for example 'hmi/canvases/01e25444aad821ef6d9f9ac4bc0e7e402'
	* @param canvasHolder This needs to be the element where the canvas has to be build in.
	*
	*/ 
	constructor(canvasHolder,identifier,apiConnector,callbackFunction,callbackTagUpdate)
	{
		// Initialize some vars we need here...
		//
		this.canvas = null;
		this.canvasBuilded = false;
		this.cocosEventListener = null;

		// Set object
		//
		object = this;
		
		// Go handle parameters!

		//You can give in the canvasHolder either as domObject or identifier.
		//
		if(typeof(canvasHolder) == 'string')
		{
			this.canvasHolder = $(canvasHolder);
		}
		else if(typeof(canvasHolder) == 'object')
		{
			this.canvasHolder = canvasHolder;
		}
		else
		{
			console.error("Type of canvasHolder is incorrect.");
		}
		
		// Set identifier
		//
		this.identifier = identifier;

		// Go
		if(isset(apiConnector))
		{
			this.apiConnector = apiConnector;	
		}
		else
		{
			console.error("Geen apiConnector beschikbaar");
			return false;
		}

		// Set callbackFunction
		this.callback = callbackFunction;
		this.callbackTagUpdate = callbackTagUpdate;

		// console.log("GO CANVAS!");
		// console.log(this.apiConnector);

		this.apiAuth(function(success)
		{
			//
			this.getCanvasItems();

		}.bind(this));
	}

	//
	apiAuth(callbackFunction)
	{
		// console.log('apiAuth');
		this.apiConnector.isLoggedIn(function(loggedin, userData)
		{
			// console.log('this.apiConnector.isLoggedIn :: ' + loggedin);
			
			if(isTrue(loggedin))
			{
				if(isFunction(callbackFunction))
				{
					callbackFunction();
				}
			}
			else
			{
				this.apiConnector.isAuthorized(function(authorized, userData)
				{
					if(isTrue(authorized))
					{
						callbackFunction();
					}
					else
					{
						/*this.apiConnector.handleLoginWithToken(getConfigVar('apiLoginToken'), function(loggedin, userData)
						{
							if(isTrue(loggedin))
							{
								callbackFunction();
							}
						});*/
					}
				}.bind(this));
			}
		}.bind(this));
	}
	
	//
	getCanvasItems()
	{
		// console.log(197);

		if(!isEmpty(this.identifier))
		{
			var options = 
			{
				expand: 'files,canvasItems(files,events)',
				q: 'canvasItems(status:***)',
				sort: 'canvasItems(idParent)',

				// Field for hmi/canvas
				fields: [
					'id',
					'idParent',
					'name',
					'width',
					'height',
					'backgroundUrl',
					'backgroundColor',
					'timestamp'
				].join(',')
					
					// Field for hmi/canvas/files
					+ ',files(' + [
						'id',
						'name',
						'fileUrl',
					].join(',') + ')'

					// Field for hmi/canvas/canvasItems
					+ ',canvasItems(' + [
						'id',
						'idParent',
						'name',
						'prefix',
						'x',
						'y',
						'z',
						'type',
						'index',
						'itemIndex',
						'visible',
						'blinkingVisibleActive',
						'blinkingVisibleFrequency',
						'enabled',
						'width',
						'height',
						'color',
						'strokeWidth',
						'strokeColor',
						'blinkingBorderColorActive',
						'blinkingBorderColorOn',
						'blinkingBorderColorOff',
						'blinkingBorderColorFrequency',
						'cornerRadius',
						'fromCentre',
						'text',
						'fontSize',
						'fontFamily',
						'iconSource',
						'status'
					].join(',')

						// Field for hmi/canvas/canvasItems/events
						+ ',events(' + [
							'id',
							'idCanvas',
							'idTargetTag',
							'idScript',
							'eventType',
							'location',
							'action',
							'value',
							'status',
						].join(',') + ')'

					 + ')'
			};

			this.apiConnector.read('hmi', 'canvases', this.identifier, null, options, null, function(response)
			{
				// Check backgroundUrl from API Response
				//
				var backgroundUrl = extract(response, 'data', 0, 'data', 'backgroundUrl');

				// When no backgroundUrl is found, check if we can find a linked
				// file from the files-expand.
				// 
				if(isEmpty(backgroundUrl))
				{
					var backgroundFile = extract(response, 'data', 0, 'data', 'files', 'data', 0);
					if(isObject(backgroundFile))
					{
						// When found, fetch the filrUrl from the fileData
						//
						backgroundUrl = this.apiConnector.getFileURL(extract(backgroundFile, 'data'), false);
						
						// If any backgroundUrl is found, overwrite the data
						// in the original response.
						//
						if(!isEmpty(backgroundUrl))
						{
							response.data[0].data.backgroundUrl = backgroundUrl;
						}
					}
				}

				//
				overwriteConfigVar('designedLayoutWidth',response.data[0].data.width); 
				overwriteConfigVar('designedLayoutHeight',response.data[0].data.height); 
					
				//
				this.canvasItems = response.data[0].data.canvasItems.data;
				this.buildCanvas(response.data[0].data);

			}.bind(this));
		}
		else
		{
			if(isFunction(this.callback))
			{
				this.callback(null);
			}
		}
	}

	/**
	* Function buildCanvas
	*
	* This function will build the canvas in the holder.
	* 
	* @param data This could be the params for the canvas dom Object, such as ID
	*
	* @throws consoleError if no canvasHolder is present.
	*/ 

	buildCanvas(data=null, handleCallbacks=true, canvas=null)
	{
		this.canvasBuilded = false;

		if(this.canvasHolder.length > 0) //If canvasHolder exits.
		{
			if(isset(data))
			{
				var id = data.id;
				if(isset(canvas))
				{	
					id = canvas.attr('data-id');
				}
				this.canvas = $("<canvas data-id='" + id + "'>");
			}
			else
			{
				this.canvas = $("<canvas>");
			}
			
			this.scaleFactor = this.calcScaleFactor();

			var backgroundColor = extract(data, 'backgroundColor');
			var backgroundUrl = extract(data, 'backgroundUrl');

			if(!isEmpty(backgroundColor))
			{
				this.canvas.css("background-color", backgroundColor);
			}
			else
			{
				this.canvas.css("background-color", 'transparent');
			}

			if(!isEmpty(backgroundUrl))
			{
				this.canvas.css("background-image", "url(" + backgroundUrl + ")");
				this.canvas.css("background-size", "cover");
				this.canvas.css("background-repeat", "no-repeat");
			}
			else
			{
				this.canvas.css("background-image", "none");
			}

			this.canvas.css
			(
				{
					"position": "relative",
					"top": "0px",
					"left": "0px",
					"z-index": $('canvas').length
				}
			);

			this.canvas[0].width = this.getScaleSize(getConfigVar("designedLayoutWidth"));
			this.canvas[0].height = this.getScaleSize(getConfigVar("designedLayoutHeight"));
			// console.log("width:" + getConfigVar("designedLayoutWidth")) ;
			// console.log("height:" + getConfigVar("designedLayoutHeight"));

			this.canvasHolder.append(this.canvas);

			//This will append all the canvas Items to the just generated canvas
			this.buildCanvasItems();

			// console.log(this.canvasItems);
			//Move the layers to the right index, no idea if this neccesary.
			$.each(this.canvasItems, function(key, value)
			{				
				this.canvas.moveLayer("item_" + value.data.id, value.data.index);
			}.bind(this));

			//Finaly draw the layers.
			this.canvas.drawLayers();

			/*
			console.warn('Canvas builded in 5 seconds...');
			setTimeout(function()
			{
				// Set boolean to true to 'report' the canvas is builed.
				this.canvasBuilded = true;
			}.bind(this), 5000);
			*/

			// Question: Moeten we hier nog op zoek naar eventuele responses die in de tussentijd
			// nog zijn binnengekomen, maar nog niet afgehandeld zijn omdat bovenstaande boolean
			// op false stond??? Zie ook commentaar op regel 708 (of daar ergens in de buurt...)
			//
		}
		else
		{
			console.error("Undefined canvasHolder");
		}

		this.canvasBuilded = true;

		if(isTrue(handleCallbacks))
		{
			this.eventHandling();		
			
			if(isFunction(this.callback))
			{
				this.callback(data);
			}
		}
	}

	/**
	* Function buildCanvasItems
	*
	* This function will add a canvasItem in the canvas
	* Either the item will be a array of items or just a single item
	* This function will check if it's an array or a item, and either loop through all the items or just a single switch
	*
	* @param item this is a canvasitem
	*
	* @throws consoleError if no canvasHolder is present.
	*/
	buildCanvasItems(item)
	{
		if(typeof(item) == 'undefined')
		{
			$.each(this.canvasItems, function(key, value)
			{
				this.buildCanvasItems(value)				
			}.bind(this))
		}
		else
		{
			switch(item.data.type)
			{					
				case 'rectangle'	:	this.createRectangle(this.canvas,item.data);		break;
				case 'text'		:	this.createText(this.canvas,item.data); 		break;
				case 'icon'		:	this.createIcon(this.canvas,item.data);			break;
				case 'group'		:	this.createGroup(this.canvas,item.data);		break;
				default			:	log("shape " + value + " not defined");
			}
		}
	}
	
	/**
	* Function moveChilds
	*
	* This function will move the child objects when you move a parent object.
	*
	* @param parent - This is the parent object where we will search its childs for.
	*
	*/ 
	moveChilds(parent)
	{
		var childs = this.getChilds(parent.id); 
		if(isset(childs))
		{
			$.each(childs, function(key, child)
			{		
				var x = this.getScaleSize(parseInt(parent.x) + parseInt(child.x));				
				// Let's update the layers
				this.canvas.setLayer("item_" + child.id, 
				{
					x: this.getScaleSize(parseInt(parent.x) + parseInt(child.x)), // Set the new X position to the position of the parent plus it's own X value
					y: this.getScaleSize(parseInt(parent.y) + parseInt(child.y)), // Set the new Y position to the position of the parent plus it's own Y value
					
				}).drawLayers();

			}.bind(this));
		}
	}
	getLayerEvents(layer, eventType)
	{
		var source = this.canvasItems;
		var layerEvents = [];

		var itemsLength = source.length;
		var loop = true;
		var i = 0;

		// console.log("getLayerEvents");
		while((i < itemsLength) && (loop === true))
		{
			var item = source[i].data;

			// console.log(item);
			if(item.id == layer.id)
			{
				loop = false;

				var events = source[i].data.events.data;
				// console.log(source[i]);
				var eventsLength = events.length;

				for(var j = 0; j <eventsLength; j++)
				{
					var event = events[j].data;
					
					if(event.eventType == eventType)
					{
						if(event.status == 1)
						{
							layerEvents.push(event);
						}
					}
				}
			}			
			i++;
		}

		return layerEvents;
	}
	
	//
	createRectangle(canvas,data)
	{
		var item = {
			type: 'rectangle',
			fillStyle: data.color,
			cornerRadius: this.getScaleSize(data.cornerRadius),
			fromCenter: data.fromCenter,
			index: 0,
			name: data.id,
			strokeWidth: this.getScaleSize(data.strokeWidth),
			strokeStyle: data.strokeColor,
			height: this.getScaleSize(data.height),
			width: this.getScaleSize(data.width),
		};

		//
		this.createItem(canvas,data,item);
		
	}

	//
	createGroup(canvas,data)
	{
		var item = {
			type: 'rectangle',
			visible: false,
			name: data.id,
		}

		//
		this.createItem(canvas,data,item);
	}

	//
	createText(canvas,data)
	{
		var item = {
			type: 'text',
			fillStyle: data.color,
			fromCenter: Boolean(Number(data.fromCentre)),
			name: data.id,
			fontSize: this.getScaleSize(data.fontSize),
			strokeWidth: this.getScaleSize(data.strokeWidth),
			strokeStyle: data.strokeColor,
			fontStyle: data.fontStyle,
			index: data.index,
			fontFamily: data.fontFamily,
			text: data.text,
		};
		
		//
		this.createItem(canvas,data,item);	
	}

	//
	createIcon(canvas,data)
	{	
		if(isset(data.files.data) && data.files.data.length > 0)
		{
			var iconSource = this.apiConnector.getFileURL(data.files.data[0].data, false);
			
			var item = 
			{
				type: 'image',
				source: iconSource,
				index: data.index,
				fromCenter: data.fromCenter,
				name: data.id,
				width: this.getScaleSize(data.width),
				height: this.getScaleSize(data.height)
			};

			//
			this.createItem(canvas,data,item);
		}		
	}

	//
	createItem(canvas,data,item)
	{
		var layer = canvas.getLayer(data.id);

		var parentItem = this.getItemById([data.idParent]);
		item.name = "item_" + item.name;
		
		if((isset(data.visible) && (data.visible != "1")) || (isset(data.status) && (data.status != "1")))
		{
			item.visible = false;
			data['selfVisible'] = false;
		}
		else
		{
			item.visible = true;
			data['selfVisible'] = true;
		}

		if(parentItem)
		{			
			var parentLayer = canvas.getLayer('item_' + parentItem.id);

			item.x = parseInt(parentLayer.x) + this.getScaleSize(parseInt(data.x));
			item.y = parseInt(parentLayer.y) + this.getScaleSize(parseInt(data.y));

			if(isFalse(parentLayer.visible))
			{
				item.visible = false;
			}
		}
		else
		{
			item.x = this.getScaleSize(data.x);
			item.y = this.getScaleSize(data.y);
		}
		
		item.cursors = {
		    // Show pointer on hover
		    mouseover: 'pointer',
		    // Show 'move' cursor on mousedown
		    // Revert cursor on mouseup
		    mouseup: 'pointer'
		 };

		item.contextmenu = function(layer)
		{
			//
			this.handleEvent(layer,"rmbClick");

		}.bind(this);

		item.mousedown = function(layer)
		{
			//
			this.handleEvent(layer,"lmbClick");

		}.bind(this);

		if(!isset(layer))
		{
			canvas.addLayer(item).drawLayers();
		}

		data.layer = canvas.getLayer('item_' + data.id);
		this.handleBlinkings(data);
	}

	//
	handleEvent(layer, event)
	{
		var canvasItem = this.getCanvasItemByLayer(layer);

		if(isTrue(canvasItem.enabled))
		{
			if(isset(canvasItem))
			{
				var events = this.getLayerEvents(canvasItem , event);
				if(events.length > 0)
				{
					$.each(events, function(key, event)
					{
						this.executeEventResponse(event);
					}.bind(this));
				}
				else
				{	
					var parent = this.getParentByChild(canvasItem.id);
					
					if(isset(parent))
					{
						var parentLayer = this.getLayerByid(parent.id)
						this.handleEvent(parentLayer,event);
					}
				}

			}
		}
	}

	//
	executeEventResponse(response)
	{
		if(response.location == 'client')
		{
			switch(response.action)
			{
				/*
				case "openCanvas":
					if($("#01d0a15c5e01f9f9bb31b4e931ef48691").length == 0)
					{
						var cocosCanvas2 = new CocosCanvas
						(		
							"hmi/canvases/",
							this.canvasHolder,"01d0a15c5e01f9f9bb31b4e931ef48691",
							function(canvas)
							{
								//canvas.buildCanvas();	
							}
						);
					}
				break;
				case "prompt":
					var postData = {
					
						
					};
					var promtValue = prompt(response.promptMessage);
					if (promtValue != null)
					{
						postData = 
						{
							value: promtValue
						};
						
						this.apiConnector.patch("system","taglist",response.idTargetTag,null,null,postData, function(response)
						{

						}.bind(this));
					}
				break;
				*/
			}
		}
		else if(response.location == 'server')
		{
			this.apiConnector.patch('hmi', 'canvasItemEvents', response.id, null, null, {'handle':1}, function(response)
			{
				//
				
			}.bind(this));

			/*
			this.apiConnector.create("hmi","canvasItemRegisterEvent",null,null,null,postData, function(response)
			{
				//this.executeEventResponse(response);
			}.bind(this));
			*/
		}
	}

	//
	correntItemPositionsAndStuff(item)
	{
		return item;
		
		/*if((typeof(item.strokeWidth) != 'undefined') && (!isNaN(item.strokeWidth)) && (item.strokeWidth != 0))
		{ 

			item.x = (item.x + (item.strokeWidth/2));
			item.y = (item.y + (item.strokeWidth/2));
			item.width = (item.width - item.strokeWidth);
			item.height = (item.height - item.strokeWidth);
		}*/

		//return item;
	}

	/*
	*	EventHandling
	*
	*	This function will open a endless request to the webAPI and keeps listening for changes.
	*	When a change is detected the function will simply push the changes towards createOrUpdate item function.
	*	There it will be either generated or changed.
	*/
	updateItem(id,variable,value,isChild,byBlink)
	{
		var layer = this.canvas.getLayer('item_' + id);
		var handleBlinkings = false;

		if(isset(layer))
		{
			var canvasItem = this.getCanvasItemByLayer(layer);
			var parentItem = this.getParentByChild(id);
			var parentLayer = null;

			if(isset(parentItem))
			{
				parentLayer = this.canvas.getLayer('item_' + parentItem.id);	
			}

			if(isChild)
			{
				switch(variable)
				{	
					case 'x':
						if(!isNull(parentLayer))
						{
							layer.x = parseInt(parentLayer.x) + parseInt(value);
							//item.y = parseInt(parentLayer.y) + this.getScaleSize(parseInt(value));

						/*	layer.x = parseInt(parentLayer.x) + parseInt(value);
							layer.x = this.getScaleSize(layer.x);*/
						}
						else
						{
							layer.x = this.getScaleSize(value);
						}			
						break;

					case 'y':
						if(!isNull(parentLayer))
						{
							layer.y = parseInt(parentLayer.y) + parseInt(value);
							//layer.y = this.getScaleSize(layer.y);
						}
						else
						{							
							layer.y = this.getScaleSize(value);
						}			
						break;			

					case 'z':
							layer.z = this.getScaleSize(value);
							break;

					case 'visible':
						if(isTrue(value))
						{
							canvasItem['selfVisible'] = true;
							if(!isNull(parentLayer) && isTrue(parentItem['selfVisible']))
							{
								layer.visible = true;
							}
						}
						else
						{
							layer.visible = false;
							canvasItem['selfVisible'] = false;
						}
						break;
									
					default:
							layer[variable] = value;
				}
			}
			else
			{
				switch(variable)
				{					
					case 'color':
						layer.fillStyle = value;
						break;
					
					case 'strokeColor':
						layer.strokeStyle = value;
						break;

					case 'x':
						if(isset(parentLayer))
						{
							layer.x = parseInt(parentLayer.x) + this.getScaleSize(parseInt(value));
							//item.y = parseInt(parentLayer.y) + this.getScaleSize(parseInt(value));

						/*	layer.x = parseInt(parentLayer.x) + parseInt(value);
							layer.x = this.getScaleSize(layer.x);*/
						}
						else
						{
							layer.x = this.getScaleSize(value);
						}			
						break;

					case 'y':
						if(isset(parentLayer))
						{
							layer.y = parseInt(parentLayer.y) + this.getScaleSize(parseInt(value));
							//layer.y = this.getScaleSize(layer.y);
						}
						else
						{							
							layer.y = this.getScaleSize(value);
						}		
						break;

					case 'enabled':
						// console.log("setting enabled to" + value);
						canvasItem.enabled 	= value;
						break;

					case 'z':
						layer.z 			= this.getScaleSize(value);
						break;

					case 'width':
						layer.width 		= this.getScaleSize(value);
						break;

					case 'height':
						layer.height 		= this.getScaleSize(value);
						break;

					case 'strokeWidth':
						layer.strokeWidth 	= this.getScaleSize(value);
						break;

					case 'cornerRadius':
						layer.cornerRadius 	= this.getScaleSize(value);
						break;

					case 'fontSize':
						layer.fontSize = this.getScaleSize(value);
						break;

					case 'blinkingBorderColorActive':
						canvasItem['blinkingBorderColorActive'] = value;
						handleBlinkings = true;
						break;
					
					case 'blinkingBorderColorOn':
						// console.log("Setting blinkingBorderColorOn to " + value);
						canvasItem['blinkingBorderColorOn'] = value;
						break;
					
					case 'blinkingBorderColorOff':
						// console.log("Setting blinkingBorderColorOff to " + value);
						canvasItem['blinkingBorderColorOff'] = value;
						break;
					
					case 'blinkingBorderColorFrequency':
						// console.log("Setting blinkingBorderColorFrequency to" + value);
						canvasItem['blinkingBorderColorFrequency'] = value;
						break;

					case 'visible':
						if(isTrue(value))
						{
							layer.visible = true;
							canvasItem['selfVisible'] = true;
						}
						else
						{
							layer.visible = false;
							canvasItem['selfVisible'] = false;
						}

						if(!byBlink)
						{
							handleBlinkings = true;	
						}
						
						break;
					case 'blinkingVisibleActive':
						canvasItem['blinkingVisibleActive'] = value;
						handleBlinkings = true;
						
						break;
					case 'blinkingVisibleFrequency':
						canvasItem['blinkingVisibleFrequency'] = value;
						break;
									
					default:
						layer[variable] = value;
				}
				if(!byBlink)
				{
					canvasItem[variable] = value;	
				}				
			}

			if(variable == 'status')
			{
				if(parseInt(value) == 0)
				{
					layer.visible = false;
					canvasItem['selfVisible'] = false;
				}
				else if(isTrue(canvasItem['selfVisible']))
				{
					layer.visible = true;
					canvasItem['selfVisible'] = true;
				}
			}

			if(handleBlinkings === true)
			{
				this.handleBlinkings(canvasItem);
			}

			this.handleChildVisibility(id, layer.visible);

			/*
			parent = this.getItemById(id);
			var childs = this.getChilds(parent.id); 
			if(isset(childs))
			{
				$.each(childs, function(key, child)
				{	
					//this.updateItem(child.id,variable,value,true);		
					if(variable == 'status')
					{
						this.updateItem(child.id,variable,value,true);		
					}
			
					if(variable == 'x' || variable == 'y')
					{					

						parent = this.canvas.getLayer('item_' + parent.id);
						if(variable == 'x')
						{
							var x = parseInt(child.x) + parseInt(parent.x);
							this.canvas.setLayer("item_" + child.id, 
							{
							 // Set the new Y position to the position of the parent plus it's own Y value
							
								x:x
						
							});
						}
						if(variable == 'y')
						{
							var y = parseInt(child.y) + parseInt(value);
							this.canvas.setLayer("item_" + child.id, 
							{
							
								y:y
						
							})
						}			

					}

				}.bind(this));
			}*/

			//
			this.canvas.setLayer('item_' + id, layer);

			this.canvas.drawLayers();
		}
	}

	//
	handleChildVisibility(id, visible)
	{
		//
		var childs = this.getChilds(id); 

		//
		if(isset(childs) && isObject(childs) && (objectSize(childs) > 0))
		{
			$.each(childs, function(key, child)
			{
				var childLayer = this.canvas.getLayer('item_' + child.id);
				if(typeof(childLayer) != 'undefined')
				{
					if(isTrue(visible))
					{
						if(isTrue(child['selfVisible']) && isFalse(childLayer.visible))
						{
							childLayer.visible = true;
						}
					}
					else
					{
						if(isTrue(childLayer.visible))
						{
							childLayer.visible = false;
						}
					}

					this.canvas.setLayer('item_' + child.id, childLayer);
					this.handleChildVisibility(child.id, visible);
				}

			}.bind(this));
		}
	}

	//
	handleBlinkings(canvasItem)
	{
		// console.log("handleBlinkings");
		if(isTrue(canvasItem.visible))
		{
			$.each(canvasItem, function(key, value)
			{
				switch(key)
				{
					case 'blinkingBorderColorActive':
						// console.log("Go blink blinkingBorderColorActive ");
						this.blink(canvasItem.layer,canvasItem,"borderColor")						
					break;
					case 'blinkingVisibleActive':
						// console.log("Go blink blinkingVisibleActive ");
						this.blink(canvasItem.layer,canvasItem,"visible")						
					break;
				}
			}.bind(this));
		}
		else
		{
			// console.warn("skipping blink because " + canvasItem.name + " is not visible")
		}
	}

	//
	blink(layer,canvasItem,property,start,toggle)
	{
		if(typeof(start) == 'undefined') start = 1;
		if(typeof(toggle) == 'undefined') toggle = ((start==1)?0:1);

		var active = true;
		var updateVariable = null;
		var updateValue = null;
		var frequencyTimeout = 0;

		var returnValue = null;
		var returnKey = null;

		switch(property)
		{
			case "borderColor":
				active = (canvasItem['blinkingBorderColorActive'] == '1');
				updateVariable = 'strokeColor';
				returnValue = canvasItem.strokeColor;
				if(toggle == 1)
				{
					updateValue = canvasItem['blinkingBorderColorOn'];
				}
				else
				{
					updateValue = canvasItem['blinkingBorderColorOff'];
				}
				frequencyTimeout = canvasItem['blinkingBorderColorFrequency'];
				break;
			case "visible":
				active = (canvasItem['blinkingVisibleActive'] == '1');
				returnValue = canvasItem.visible;
				updateVariable = 'opacity';
				if(toggle == 1)
				{
					updateValue = 1;
				}
				else
				{
					updateValue = 0;
				}
				frequencyTimeout = canvasItem['blinkingVisibleFrequency'];
				break;
		}

		if(frequencyTimeout < 10)
		{
			frequencyTimeout = 10;
		}

		
		if(isTrue(active) && !isNull(updateVariable) && !isNull(updateValue) && canvasItem.visible == 1)
		{
			// console.log("blinking!!!");
			this.updateItem(canvasItem.id,updateVariable,updateValue,false,true)

			setTimeout(function()
		    {
		      this.blink(layer, canvasItem, property, start, ((toggle==1)?0:1));
		    }.bind(this), frequencyTimeout);
		}
		else
		{
			this.updateItem(canvasItem.id,updateVariable,returnValue,true);
		}
		


		/*if(typeof(start) == 'undefined') start = 1;
		if(typeof(toggle) == 'undefined') toggle = ((start==1)?0:1);
	  
	  	console.log('timeout: ' + timeout + ', amount: ' + amount + ', start: ' + start + ', toggle: ' + toggle);
		if(toggle == start) amount = amount-1;
		
		if(amount > 0)
	  	{
		  	setTimeout(function()
		    {
		      blink(id, timeout, amount, start, ((toggle==1)?0:1));
		    }, timeout);
		}*/
	}

	//
	getLayerByid(id)
	{
		return this.canvas.getLayer('item_' + id);
	}

	//
	eventHandling()
	{
		this.stopEventListener();

		// Get eventPollingFrequency from config (if available, otherwise, get default value)
		// 
		var eventPollingFrequency = parseInt(getConfigVar('eventPollingFrequency', 10000));
		// Check eventPollingFrequency to determine how many milliseconds must be used between the
		// fetches of the eventlist. WHen the value 0 is given, the API-call will be executed as an
		// endless request, waiting for results. In other cases, the given value will be used. When
		// the value is below 1.000 milliseconds, set it to 1.000 milliseconds to prevent
		// 
		if((eventPollingFrequency > 0 && eventPollingFrequency < 500))
		{
			eventPollingFrequency = 500;
			overwriteConfigVar('eventPollingFrequency',eventPollingFrequency);
		}

		// When canvas is fully builded, go listen on the taglist for updates
		//
		this.cocosEventListener = this.apiConnector.continuousRead(
			// library
			"system",
			// collection
			"taglist",
			// identifier
			// "01e25444aad821ef6d9f9ac4bc0e7e402",
			null,
			// association
			null,
			// item
			{
				limit:1000,
				q:{
					timestamp: '>@lastResponse.meta.timestamp@',
					tableLibrary: 'hmi',
					tableCollection: 'canvasItems'
				},
				sort:'-timestamp'
			},
			// data
			{
				
			},
			// eventPollingFrequency
			0,
			// callbackSuccess
			function(response, requestHandler)
			{
				if(isTrue(this.canvasBuilded))
				{
					if(response.data.length > 0)
					{
						$.each(response.data, function(key, value)
						{
							if(value.data.tableLibrary == "hmi" && value.data.tableCollection == "canvasItems")
							{
								if(isTrue(value.data.status) && isTrue(value.data.objectStatus))
								{
									this.updateItem(value.data.idObject,value.data.variable,value.data.value,false,false);
								}
								else
								{
									this.updateItem(value.data.idObject,'status','0',false,false);
								}
							}
						}.bind(this));
					}
				}
				else
				{
					console.error('RESPONSE FROM CONTINUOUSREAD IGNORED - CANVAS NOT READY YET...');
					// Question: Moeten we hier alle responses die binnenkomen opslaan / onthouden
					// en op het moment dat de canvasBuilded boolean op true gezet wordt, controlleren
					// of er in de tussentijd nog updates zijn binnengekomen en deze met terugwerkende
					// kracht alsnog doorvoeren?
					// En zo ja... Wat doen we met tag-wijzigingen die tijdens dit doorvoeren óók nog
					// binnenkomen? Moeten we deze dan óók queue-en? Mag de canvasBuilded boolean pas
					// op true gezet worden als de volledige 'queue' met on-afgehandelde responses leeg
					// is? Ja toch?
					//
				}

				if(isFunction(this.callbackTagUpdate))
				{
					this.callbackTagUpdate();
				}

			}.bind(this),
			// callbackError
			function(error, response, requestHandler)
			{
			},
			// callbackComplete
			function(response, requestHandler)
			{
			
			}.bind(this),
			// progressFunction
			null,
			// validateResult 
			true,
			// rqh
			null,
			// executeCallbackSuccessOnEmptyResponse
			true
		);
	}

	getScaleSize(input)
	{
		return this.scaleFactor * input;
	}

	getChilds(id)
	{
		var source = this.canvasItems;
		var childs = [];

		for(var i = 0; i < source.length; i++)
		{
			if(source[i].data.idParent == id)
			{ 
				childs.push(source[i].data);				
			}			
		}
		return childs;
	}

	getParentByChild(id)
	{
		var item = this.getItemById(id);
		var source = this.canvasItems;

		for(var i = 0; i < source.length; i++)
		{
			if(source[i].data.id == item.idParent)
			{ 
				return source[i].data;		
			}			
		}		
	}

	getCanvasItemByLayer(layer)
	{
		if(isset(layer) && isset(layer.name))
		{
			var id = layer.name.split("_").pop();
			var canvasItem = this.getItemById(id);
			if(isset(canvasItem))
			{
				return canvasItem;
			}
		}
	}

	getItemById(id)
	{
		var source = this.canvasItems;
		for(var i = 0; i < source.length; i++)
		{
			if(source[i].data.id == id)
			{
				return source[i].data;
			}			
		}		
	}

	calcScaleFactor()
	{
		// Get sizes from original design
		//
		var designedWidth = getConfigVar("designedLayoutWidth"); // 1280;
		var designedHeight = getConfigVar("designedLayoutHeight"); // 1024;   
	
		// Get sizes based on the current view of the application.
		//
		var applicationWidth = this.getApplicationWidth();
		var applicationHeight = this.getApplicationHeight();

		// console.log(applicationWidth);
		// console.log(applicationHeight);

		// Calculate the factor for width and height, based on the sizes from
		// width and height
		//
		var widthFactor = (applicationWidth / designedWidth);
		var heightFactor = (applicationHeight / designedHeight);
		// Get the lowest factor to use for scaling all the elements.
		//
		var calcFactor = Math.min(widthFactor, heightFactor);
		
		return calcFactor;
	}

	getApplicationWidth()
	{
		// console.log(this.canvasHolder);
		return parseInt(Math.round(this.canvasHolder.innerWidth()));
	}

	/**
	 * [getApplicationHeight description]
	 * @return {int} [description]
	 */
	getApplicationHeight()
	{
		return parseInt(Math.round(this.canvasHolder.innerHeight()));
	}

	/**
	 * This function can be called to stop open / active eventListener (request that are waiting
	 * for results / endless request.
	 */
	stopEventListener(forceStop)
	{
		if(this.canvasBuilded || isTrue(forceStop))
		{
			if(isset(this.cocosEventListener) && isFunction(this.cocosEventListener.stop))
			{
				this.cocosEventListener.stop();
			}
		}
	}
}


$( document ).ready(function()
{
	$(window).bind('resizeEnd', function()
	{
		if(isset(object) && isFunction(object.reBuildCanvas))
		{
			object.reBuildCanvas();
		}
		
	}.bind(this));

	$(window).resize(function()
	{
	        if(this.resizeTO) clearTimeout(this.resizeTO);
	        this.resizeTO = setTimeout(function() {
	            $(this).trigger('resizeEnd');
	        }, 200);
	});
});