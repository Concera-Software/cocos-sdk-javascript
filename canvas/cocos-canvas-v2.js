/***
 *     ___      ___     ___ 
 *    / __|___ / __|___/ __|
 *   | (__/ _ \ (__/ _ \__ \
 *    \___\___/\___\___/___/, grown by (concera
 * 
 * -------------------------------------------------------------------------------------------------
 * @author(s)		Erwin Vorenhout, Stefan van Buren
 * @copyright 		Concera Software - https://concera.software
 * @dateCreated		2018-?
 * @lastChange		2020-06-15
 * @version		1.20.166
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
 * Watch out, ECMA script 6 is not compatible with some browsers ,in case you need to use this class on these kind of browsers visit:
 * https://babeljs.io/, a open source javascript compiler / decompiler which is capable of converting ECMA 6 to vanilla javascript.
 *
 */
var object = null;
var shiftPressed = false;
var applyPatchTimers = [];
var libaryHmi = "hmi";
var collectionCanvasItems = 'canvasItems';

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
	constructor(canvasHolder,identifier,api,node,byGroup,callback)
	{
		object = this;
		//this.identifier = identifier;
		//You can give in the canvasHolder either as domObject or identifier.
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
		this.canvas = null;

		this.canvasBuilded = false;
		//Get parameters from config File
		this.apiUrl = getConfigVar("apiHost"); // API hostname

		this.identifier = identifier;
		this.callback = callback;
		this.node = node;
		this.byGroup = byGroup;

		this.allowedToDeselectSelectedItem = true;

		this.cocosEventListener = null;

		// Usage for manipulating x,y coordinates based on key inputs.
		document.onkeydown = function(e)
		{
			var canvasItem = this.getCanvasItemByLayer(this.selectedItem);

			if(!empty(this.selectedItem))
			{
				var applyPatchTimer = false;
				
				switch (e.keyCode) 
				{
					case 37: // left
						this.updateItem(canvasItem.id,'x',this.getUnscaledSize(this.selectedItem.x) - 2,false,true);
						applyPatchTimer = true;
						endEvent(e);
					   break;
					case 38: // up
					    this.updateItem(canvasItem.id,'y',this.getUnscaledSize(this.selectedItem.y) - 2,false,true);
						applyPatchTimer = true;
					    endEvent(e);
					    break;
					case 39: // right
					    this.updateItem(canvasItem.id,'x',this.getUnscaledSize(this.selectedItem.x) + 2,false,true);
						applyPatchTimer = true;
					    endEvent(e);
					    break;
					case 40: // down
					    this.updateItem(canvasItem.id,'y',this.getUnscaledSize(this.selectedItem.y) + 2,false,true);
						applyPatchTimer = true;
					    endEvent(e);
					    break;
					case 46: // delete
					    break;
				}

				if(isTrue(applyPatchTimer))
				{
					if(isset(applyPatchTimers[canvasItem.id]))
					{
						clearTimeout(applyPatchTimers[canvasItem.id]);	
					}
				
					applyPatchTimers[canvasItem.id] = setTimeout
					(
						function()
						{
							this.patchItemAfterKeyDown(canvasItem.id);
							delete applyPatchTimers[canvasItem.id];
						}.bind(this),
						500
					);
				}
			}
			
		}.bind(this);	

		if(isset(api))
		{
			this.apiConnector = api;	
		}
		else
		{
			console.error("Geen apiConnector beschikbaar");
			return false;
		}



		// console.log("GO CANVAS!");
		// console.log(this.apiConnector);

		this.apiAuth(function(success)
		{
			if(byGroup)
			{
				this.getCanvasItems(true);				
			}
			else
			{
				this.getCanvasItems();
			}
			
		}.bind(this));
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

	buildCanvas(data=null, handleCallbacks=true, canvas=null,calcScaleFactor = true, callbackFunction = null)
	{	
		// console.log('Go build canvas');

		this.scaleFactor = this.calcScaleFactor();
		this.canvasBuilded = false;
		
		if(this.canvasHolder.length > 0) //If canvasHolder exits.
		{
			if(isset(data) && data != false)
			{
				var id = data.id;
				if(isset(canvas) && canvas != false)
				{	
					id = canvas.attr('data-id');
				}
				this.canvas = $("<canvas data-id='" + id + "'>");
			}
			else
			{
				this.canvas = $("<canvas>");	
			}			

			if(calcScaleFactor)
			{
				// console.log("Scalefactor");
				this.scaleFactor = this.calcScaleFactor();	
			}
			

			if(isset(getConfigVar("designedLayoutBackground")))
			{
				this.canvas.css("background-image", "url(" + getConfigVar("designedLayoutBackground") + ")");
				this.canvas.css("background-size", "cover");
				this.canvas.css("background-repeat", "no-repeat");
				this.canvas.css("background-color","#c9c9c9");
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

			this.canvas[0].width = this.getScaleSize(getConfigVar("designedLayoutWidth"),true);
			this.canvas[0].height = this.getScaleSize(getConfigVar("designedLayoutHeight"),true);
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

			this.canvas.click(function()
			{
				// console.log('this.allowedToDeselectSelectedItem: ' + this.allowedToDeselectSelectedItem);
				if(this.allowedToDeselectSelectedItem)
				{
					// console.warn("canvas Click!",this.selectedItem);
					// console.log('236: ' + empty(this.selectedItem));

					var notEmpty = !empty(this.selectedItem);

					// console.log('237: ' + notEmpty)

					if(notEmpty)
					{
						// 
						// console.error('241 - this.removeAllHandles()');
						this.removeAllHandles();	
					}
				}
				
			}.bind(this));

		}
		else
		{
			console.error("Undefined canvasHolder");
		}

		// console.log('done build canvas');
		this.canvasBuilded = true;

		console.error("Go handle callbacks1");
		
		if(isNull(this.cocosEventListener))
		{
			this.eventHandling();
		}

		if(isTrue(handleCallbacks))
		{	
			if(isFunction(this.callback))
			{
				console.error("Go handle callbacks2");
				this.callback(data);
			}
		}

		if(isFunction(callbackFunction))
		{
			callbackFunction();
		}
	}
	
	reBuildCanvas(data = null)
	{
		if(isTrue(this.canvasBuilded))
		{
			//
			this.canvasBuilded = false;

			this.canvasHolder.empty();
			this.buildCanvas(this.canvasItems,false,this.canvas,false);
		}
	}

	getCanvasByItemGroup(idGroup)
	{
		this.identifier = idGroup;
		this.getCanvasItems(true);
	}


	getCanvasItems(byGroup = false,calcFactor = false, callbackFunction = null)
	{
		if(!isEmpty(this.identifier))
		{
			if(!byGroup)
			{
				var options = 
				{
					expand: 'files,canvasItems(files,events)',
					q: 'canvasItems(status:1)',
					sort: 'canvasItems(idParent)'
				};

				this.apiConnector.read(libaryHmi, 'canvases', this.identifier, null, options, null, function(response)
				{
					this.canvasItems = response.data[0].data.canvasItems.data;
					if(isset(response.data[0].data.files.data[0]))
					{
						var backgroundUrl = this.apiConnector.getFileURL(response.data[0].data.files.data[0].data);
						overwriteConfigVar('designedLayoutBackground', encodeURI(backgroundUrl));
					}

					overwriteConfigVar('designedLayoutWidth',response.data[0].data.width); 
					overwriteConfigVar('designedLayoutHeight',response.data[0].data.height); 

					if(calcFactor)
					{
						this.buildCanvas(response.data[0].data,false,false,true, callbackFunction);	
					}
					else
					{
						this.buildCanvas(response.data[0].data,false,false,false, callbackFunction);
					}					
				}.bind(this));
			}
			else
			{

				var options = 
				{
					expand: 'files',
					q: 'idParent:' + this.identifier,
				};

				this.apiConnector.read(libaryHmi,collectionCanvasItems, null, null, options, null, function(response)
				{
					overwriteConfigVar('designedLayoutWidth','375'); 
					overwriteConfigVar('designedLayoutHeight','187'); 

					overwriteConfigVar('designedLayoutBackground','');
					this.canvasItems = response.data;
					this.buildCanvas(response.data,false,false,true, callbackFunction);	
				}.bind(this));
			}
		}
		else
		{
			
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

		if (item == undefined)
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
				case 'text'			:	this.createText(this.canvas,item.data); 			break;
				case 'icon'			:	this.createIcon(this.canvas,item.data);				break;
				case 'group'		:	this.createGroup(this.canvas,item.data);			break;
				default				:	log("shape " + value + " not defined");
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
	removeAllHandles()
	{
		this.canvas.setLayers({
			handlePlacement : 'none',
			handle : {
				type: 'rectangle',
				fillStyle: '#fff',
				strokeStyle: '#c33',
				strokeWidth: 0,
				width: 0, height: 0,
				cornerRadius: 1,
			} 
		}).drawLayers()
	}
	getLayerEvents(layer, eventType)
	{
		var source = this.canvasItems;
		var layerEvents = [];

		var itemsLength = source.length;
		var loop = true;
		var i = 0;

		while((i < itemsLength) && (loop === true))
		{
			var item = source[i].data;

			if(item.id == layer.id)
			{
				loop = false;

				var events = source[i].data.events.data;
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

		if(layerEvents.length > 0)
		{
			return layerEvents;
		}
		else
		{
			return false;
		}
	}
	
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


		this.createItem(canvas,data,item);
		
	}
	createGroup(canvas,data)
	{
		var item = {
			type: 'rectangle',
			visible: false,
			name: data.id,
		}
		this.createItem(canvas,data,item);
	}
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
		
		this.createItem(canvas,data,item);	
	}
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
		
			this.createItem(canvas,data,item);
		}
		
	}
	executeEventResponse(response)
	{
		if(response.location == 'client')
		{
			switch(response.action)
			{
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
						
						this.apiConnector.patch("system","taglist",response.idTag,null,null,postData, function(response)
						{

						}.bind(this));
					}
				break;
			}
		}
		else if(response.location == 'server')
		{
			this.apiConnector.patch(libaryHmi, 'canvasItemEvents', response.id, null, null, {'handle':1}, function(response)
			{

			}.bind(this));
		}
	}

	createItem(canvas,data,item)
	{
		var layer = canvas.getLayer(data.id);

		var parent = this.getItemById([data.idParent]);
		item.name = "item_" + item.name;
		item.draggable = true;
		if(isset(data.visible) && (data.visible != "1"))
		{
			item.visible = false;
		}
		if(parent)
		{
			
			parent = canvas.getLayer('item_' + parent.id);

			item.x = parseInt(parent.x) + this.getScaleSize(parseInt(data.x));
			item.y = parseInt(parent.y) + this.getScaleSize(parseInt(data.y));
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

	

		item.handlestop = function(layer)
		{
			var canvasItem = this.getCanvasItemByLayer(layer);
			var data = {
				"width" : this.getUnscaledSize(layer.width),
				"x" : this.getUnscaledSize(layer.x),
				"y" : this.getUnscaledSize(layer.y),
				"height" : this.getUnscaledSize(layer.height),
				
			};
			
		
    		apiConnector.patch(libaryHmi,collectionCanvasItems,canvasItem.id,null,null,data,function(response)
   			{

   			});
    	}.bind(this);

    	item.handlemove = function(layer)
    	{
    		if(isTrue(shiftPressed))
    		{
    	
    			layer.constrainProportions = true;
    		}
    		else
    		{
    			layer.constrainProportions = false;
    		}   			
		};


		item.contextmenu = function(layer)
		{
			
		}.bind(this);

		item.drag = function(layer,ui)
		{
			if(isTrue(shiftPressed))
			{
				layer.restrictDragToAxis = 'y';	
			}
			else
			{
				layer.restrictDragToAxis = '';
			}

			var canvasItem = this.getCanvasItemByLayer(layer);
			var parent = this.getParentByChild(canvasItem.id);

			if(isset(parent))
			{
				var childs = this.getChilds(parent.id);
				
				$.each(childs,function(k,child)
				{				
					var id = layer.name.split("_").pop();

					if(child.id != id)
					{
						if(!isTrue(shiftPressed))
						{
							child.layer.x += layer.dx;
						}
						child.layer.y += layer.dy;
					}				
				});	
			}
			
  		}.bind(this);

		item.dragstop = function(layer)
		{
   			//apiConnector.patch("hmi","canvas")
   			var canvasItem = this.getCanvasItemByLayer(layer);
   			var data = {};
   			var targetID;
   			var parent = this.getParentByChild(canvasItem.id);
					
			if(isset(parent))
			{
				var parentLayer = this.getLayerByid(parent.id);
			
				var parentX = parentLayer.x;
				var parentY = parentLayer.y;

				var layerX = layer.x;
				var layerY = layer.y;

				var xDiff = layer.x - layer._startX;
				var yDiff = layer.y - layer._startY;


				data.x = parseInt(parent.x) + this.getUnscaledSize(xDiff);
				data.y = parseInt(parent.y) + this.getUnscaledSize(yDiff);
				targetID = parent.id;

			}
			else			
			{		
				data.x = this.getUnscaledSize(parseInt(layer.x));
				data.y = this.getUnscaledSize(parseInt(layer.y));
				targetID = canvasItem.id;
			}
			
			apiConnector.patch(libaryHmi,collectionCanvasItems,targetID,null,null,data,function(response)
   			{
   				// console.log(response);
   			});
   			

 	 	}.bind(this);

 	 	this.selectedItem;
 	 	/**
 	 	 * Binds a click function on an item.
 	 	 *
 	 	 * @param      {<type>}  layer   The layer
 	 	 */
 	 	item.click = function(layer)
		{
			this.allowedToDeselectSelectedItem = false;
			var canvasItem = this.getCanvasItemByLayer(layer);
			this.selectedItem = layer;
			this.removeAllHandles();

			if(this.byGroup)
			{

				if(layer.handlePlacement != 'both')
				{
					
					canvas.setLayer(layer.name, {
						
						handlePlacement : 'both',
						resizeFromCenter : false,
						handle : {
							type: 'rectangle',
							fillStyle: '#fff',
							strokeStyle: '#c33',
							strokeWidth: 2,
							width: 10, height: 10,
							cornerRadius: 1,
						} 
					}).drawLayers();
				}
				else
				{
					this.removeAllHandles();
				}
			}
			else
			{
				if(!this.hasChilds(canvasItem.id))
				{
					canvas.setLayer(layer.name,
					{
						handlePlacement : 'both',
						resizeFromCenter : false,
						handle : {
							type: 'rectangle',
							fillStyle: '#fff',
							strokeStyle: '#c33',
							strokeWidth: 2,
							width: 10, height: 10,
							cornerRadius: 1,
						} 
					}).drawLayers();
				}
				
			}

			setTimeout(function()
			{
				this.allowedToDeselectSelectedItem = true;
			}.bind(this), 200);

		}.bind(this);

		item.dblclick = function(layer)
		{
		
			var canvasItem = this.getCanvasItemByLayer(layer);
			var id;
			var parent = this.getParentByChild(canvasItem.id);

			if(isset(parent))
			{
				id = parent.id;
			}
			else
			{
				id = canvasItem.id;
			}

			this.node.control.openPropertyView(id);
			var fields = {};
			

		}.bind(this);

		if(!isset(layer))
		{
			canvas.addLayer(item).drawLayers();
		}

		data.layer = canvas.getLayer('item_' + data.id);
	
	}
	/**
	 * patchItemAfterKeyDown
	 *
	 *	This method is used to patch an item after we dragged it by using the arrow keys.
	 *	
	 * @param      {<type>}  id      The identifier
	 */
	patchItemAfterKeyDown(id)
	{
		var item = this.getLayerByid(id);
		var data = [];
		data.x = this.getUnscaledSize(item.x);
		data.y = this.getUnscaledSize(item.y);

		apiConnector.patch(libaryHmi,collectionCanvasItems,id,null,null,data,function(response)
		{

		});
	};
	/**
	 * Handles event from the CoCoS API
	 *
	 * @param      {<type>}  layer   The layer
	 * @param      {<type>}  event   The event
	 */

	/*
	*	EventHandling
	*
	*	This function will open a endless request to the webAPI and keeps listening for changes.
	*	When a change is detected the function will simply push the changes towards createOrUpdate item function.
	*	There it will be either generated or changed.
	*/
	handleEvent(layer, event)
	{
		var canvasItem = this.getCanvasItemByLayer(layer);

		if(isTrue(canvasItem.enabled))
		{
			if(isset(canvasItem))
			{
				var events = this.getLayerEvents(canvasItem , event);
				if(!events)
				{	
					var parent = this.getParentByChild(canvasItem.id);
					
					if(isset(parent))
					{
						var parentLayer = this.getLayerByid(parent.id)
						this.handleEvent(parentLayer,event);
					}
				}
				$.each(events, function(key, event)
				{
					this.executeEventResponse(event);
				}.bind(this));

			}
		}
	}

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



	/**
	 * Updates an Item
	 *
	 * @param      {string}   id        The identifier
	 * @param      {string}   variable  The variable
	 * @param      {number}   value     The value
	 * @param      {boolean}  isChild   Indicates if child
	 * @param      {<type>}   byBlink   The by blink
	 * @return     {boolean}  { description_of_the_return_value }
	 */
	updateItem(id,variable,value,isChild,byBlink)
	{
		var layer = this.canvas.getLayer('item_' + id);
		var handleBlinkings = false;

		if(isset(layer))
		{

			var canvasItem = this.getCanvasItemByLayer(layer);
			var parent = this.getParentByChild(id);
			
			if(isset(parent))
			{
				parent = this.canvas.getLayer('item_' + parent.id);				
			}

			if(isChild)
			{
				switch(variable)
				{					
					
					case 'x':
						if(isset(parent))
						{
							layer.x = parseInt(parent.x) + parseInt(value);
						}
						else
						{
							layer.x = this.getScaleSize(value);
						}			
						break;

					case 'y':
						if(isset(parent))
						{
							layer.y = parseInt(parent.y) + parseInt(value);
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
							value == 1  ? layer.visible = true : layer.visible = false;
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
						if(isset(parent))
						{
							layer.x = parseInt(parent.x) + this.getScaleSize(parseInt(value));
						}
						else
						{
							layer.x = this.getScaleSize(value);
						}			
						break;

					case 'y':
						if(isset(parent))
						{
							layer.y = parseInt(parent.y) + this.getScaleSize(parseInt(value));
							//layer.y = this.getScaleSize(layer.y);
						}
						else
						{							
							layer.y = this.getScaleSize(value);
						}		
						break;

					case 'enabled':
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
						canvasItem['blinkingBorderColorOn'] = value;
						break;

					case 'blinkingBorderColorOff':
						canvasItem['blinkingBorderColorOff'] = value;
						break;
					
					case 'blinkingBorderColorFrequency':
						canvasItem['blinkingBorderColorFrequency'] = value;
						break;

					case 'visible':
						value == 1 ? layer.visible = true : layer.visible = false;
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

			if(handleBlinkings === true)
			{
				this.handleBlinkings(canvasItem);
			}

			parent = this.getItemById(id);

			var childs = this.getChilds(parent.id);
			
			if(isset(childs))
			{
				$.each(childs, function(key, child)
				{
					//this.updateItem(child.id,variable,value,true);		
					if(variable == 'visible')
					{
						
						if(value == 0)
						{
							child.layer.visible = false;
						}
						else
						{
							child.visible == 1 ? child.layer.visible = true : child.layer.visible = false;
						}

						this.canvas.setLayer(child.layer.name,child.layer);
					}
			
					if(variable == 'x' || variable == 'y')
					{	
						if(variable == "x")
						{
							child.layer.x = (parent.layer.x + this.getScaleSize(child.x));
						}
						else if(variable == "y")
						{
							child.layer.y = (parent.layer.y + this.getScaleSize(child.y));
						}
						this.canvas.setLayer(child.layer.name,child.layer);
					}

				}.bind(this));
			}

			this.canvas.setLayer('item_' + id, layer);	
			this.canvas.drawLayers();
			return true;
		}
		else
		{
			return false;
		}
	}
	/**
	 * HandleBlinkings
	 *
	 * @param      {<type>}  canvasItem  The canvas item
	 */
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
	}
	getLayerByid(id)
	{
		return this.canvas.getLayer('item_' + id);
	}
	eventHandling()
	{
		//this.stopEventListener();
		console.error("Go eventHandling!");
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

		// console.log('this.cocosEventListener = this.apiConnector.continuousRead(...);');

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
				sort:'-timestamp',
				q: {
					tableLibrary: 'hmi',
					tableCollection: 'canvasItems'
				},
			},
			// data
			{
			},
			// eventPollingFrequency
			0,
			// callbackSuccess
			function(response, requestHandler)
			{
				var newItems = [];
				if(isTrue(this.canvasBuilded))
				{
					if(response.data.length > 0)
					{
						// console.log(response);
						$.each(response.data, function(key, value)
						{
							if(value.data.tableLibrary == libaryHmi && value.data.tableCollection == "canvasItems")
							{
								if(this.updateItem(value.data.idObject,value.data.variable,value.data.value,false,false))
								{
																	
								}
								else
								{
									if($.inArray(value.data.idObject, newItems) == -1)
									{
										newItems.push(value.data.idObject);
									}
								}
							}
						}.bind(this));

						if(newItems.length > 0 )
						{
							$.each(newItems, function(key, value)
							{
								var item = this.apiConnector.read(libaryHmi, 'canvasItems', value, null, null, null, function(response)
								{
									item = response.data[0];
									this.canvasItems.push(response.data[0]);
									this.buildCanvasItems(item);
								}.bind(this));
							}.bind(this));
						}
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
	getScaleSize(input,by=false)
	{
		if(this.byGroup && !by)
		{
			return this.scaleFactor * input;
		}

		return this.scaleFactor * input;
	}
	getUnscaledSize(input)
	{
		return parseInt(input / this.scaleFactor);
	}
	getChilds(id)
	{
		var source = this.canvasItems;
		// console.log(this.canvasItems)
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
	hasChilds(id)
	{

		if(isset(this.getParentByChild(id)))
		{
			// console.log("return true");
			return true;
		}
		// console.log("return False");
		return false;
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
				}.bind(this));
			}
		}.bind(this));
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
		return parseInt(Math.round(this.canvasHolder.innerWidth(),2));
	}
	/**
	 * [getApplicationHeight description]
	 * @return {int} [description]
	 */
	getApplicationHeight()
	{
		return parseInt(Math.round(this.canvasHolder.innerHeight(),2));
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
				// console.log('this.cocosEventListener.stop();');
				this.cocosEventListener.stop();
				this.cocosEventListener = null;
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

	$(document).keydown(function (e) {
	    if (e.keyCode == 16) {
	        shiftPressed = true;
	    }
	});

	$(document).keyup(function (e) {
	    if (e.keyCode == 16) {
	        shiftPressed = false;
	    }
	});

	$(window).resize(function()
	{
	        if(this.resizeTO) clearTimeout(this.resizeTO);
	        this.resizeTO = setTimeout(function() {
	            $(this).trigger('resizeEnd');
	        }, 200);
	});
});