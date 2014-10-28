/**
 * DOM.js is a lightweight & fast cross browser library for
 * dom traversal and manipulation.
 *
 * Supports
 *
 * @author Dawid Kraczowski <Crac>
 * @license MIT
 */
;(function (window, document, undefined) {

    /**
     * DOM global object
     * @type {{}}
     */
    var Dom = {};

    /**
     * Array.indexOf support
     * @param {Array} array
     * @param {*} obj
     * @returns {number}
     * @private
     */
    function _indexOf(array, obj) {
        if (Array.prototype.indexOf) {
            return Array.prototype.indexOf.call(array, obj);
        }
        for (var i = 0, j = array.length; i < j; i++) {
            if (array[i] === obj) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Checks if given value is an array
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isArray(object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    }

    /**
     * Checks if given value is a string
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isString(object) {
        return typeof object === 'string';
    }

    /**
     * Checks if given value is a number
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isNumeric(object) {
        return typeof object === 'number' && isFinite(object);
    }

    /**
     * Checks if given value is an object
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isObject(object) {
        return typeof object === 'object';
    }

    /**
     * Checks if given value is a function
     * @param {*} object
     * @returns {boolean}
     * @private
     */
    function _isFunction(object) {
        return typeof object === 'function';
    }

    /**
     * Checks if javascript object is plain object
     * @param object
     * @returns {*|boolean}
     * @private
     */
    function _isLiteralObject(object) {
        return object && typeof object === "object" && Object.getPrototypeOf(object) === Object.getPrototypeOf({});
    }

    /**
     * Checks if object is iterable
     * @param {Object} object
     * @returns {boolean}
     * @private
     */
    function _isIterable(object) {
        if (Dom.isNode(object) || Dom.isElement(object) || object === window) {
            return false;
        }

        var r = _isLiteralObject(object) || _isArray(object) || (typeof object === 'object' && object !== null && object['length'] !== undefined);
        return r;
    }

    /**
     * Clones object and returns its copy.
     * Copies Objects, Arrays, Functions and primitives.
     *
     * @param {Object} object
     * @private
     */
    function _cloneObject(object) {
        var copy;
        var property;
        var type;

        if (!_isObject(object) || object === null) {
            copy = object;
            return copy;
        }

        if (_isArray(object)) {
            copy = [];
            for (var i = 0, l = object.length; i < l; i++) {
                copy[i] = _cloneObject(object[i]);
            }
            return copy;
        }

        try {
            copy = new object.constructor();
        } catch (e) {
            copy = {};
        }

        for (property in object) {
            if (!object.hasOwnProperty(property)) {
                continue;
            }

            if (_isObject(object[property]) && object[property] !== null) {
                copy[property] = _cloneObject(object[property]);
            } else {
                copy[property] = object[property];
            }
        }
        return copy;
    }

    /**
     * Simple extend object helper
     * @param {Object} a base object
     * @param {Object} b extender object
     * @returns {Object}
     * @private
     */
    function _extendObject(a, b) {
        for ( var prop in b ) {
            a[ prop ] = b[ prop ];
        }
        return a;
    }

    /**
     * Gets element's computed style
     * @param element
     * @param prop
     * @returns {*}
     * @private
     */
    function _getComputedStyle(element, prop) {

        var computedStyle;

        if (typeof window.getComputedStyle === 'function') { //normal browsers
            computedStyle = window.getComputedStyle(element);
        } else if (typeof document.currentStyle !== undefined) { //shitty browsers
            computedStyle = element.currentStyle;
        } else {
            computedStyle = element.style;
        }

        if (prop) {
            return computedStyle[prop];
        } else {
            return computedStyle;
        }
    }

    /**
     *
     * @param object
     * @param callback
     * @private
     */
    function _each(object, callback) {
        if (_isArray(object) || (typeof object === 'object' && object['length'] !== undefined)) {
            for (var i = 0, l = object.length; i < l; i++) {
                callback.apply(object[i], [object[i], i]);
            }
            return;
        }

        if (_isLiteralObject(object)) {
            for (var key in object) {
                callback.apply(object[key], [object[key], key]);
            }
        }
    }

    var _domReadyHandlers = [];
    var _domLoadedHandlers = [];
    var _isDomReady = false;
    var _isDomLoaded = false;
    var _animationLastTime;

    var addListener = document.addEventListener ? 'addEventListener' : 'attachEvent';
    var removeListener = document.removeEventListener ? 'removeEventListener' : 'detachEvent';
    var eventPrefix = document.addEventListener ? '' : 'on';
    var createEvent = document.createEvent ? 'createEvent' : 'createEventObject';
    var dispatchEvent = document.dispatchEvent ? 'dispatchEvent' : 'fireEvent';
    var vendors = ['-moz-', '-ms-', '-webkit-', '-o-', ''];
    var cssNameProperty = function(prop) {return prop;};
    var requestAnimationFrame = window.requestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;
    var div = document.createElement('div');
    var style = _getComputedStyle(div);

    //ie?
    var ie = (function() {
        var undef, v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
        while ( div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
        return v > 4 ? v : undef;
    }());

    //css name property detection
    if (ie && ie < 9) {
        cssNameProperty = function(prop) {
            for(var exp=/-([a-z0-9])/; exp.test(prop); prop = prop.replace(exp,RegExp.$1.toUpperCase()));
            return prop;
        };
    }
    //transition detection
    var transitionSupport = (function() {
        for (var i in vendors) {
            if (_isString(style[vendors[i] + 'transition'])) {
                return true;
            }
        }
        return false;
    })();

    //request animation pollyfill
    if (!requestAnimationFrame || !cancelAnimationFrame ) {
        for( var i = 0; i < vendors.length; i++ ) {
            var vendor = vendors[i];
            requestAnimationFrame = requestAnimationFrame || window[vendor + 'RequestAnimationFrame'];
            cancelAnimationFrame = cancelAnimationFrame || window[vendor + 'CancelAnimationFrame'] || window[vendor + 'CancelRequestAnimationFrame'];
        }
    }

    if (!requestAnimationFrame || !cancelAnimationFrame) {
        requestAnimationFrame = function(callback) {
            var currentTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currentTime - _animationLastTime));
            var id = window.setTimeout(function _requestAnimationFrameTimeout() {
                callback(currentTime + timeToCall);
            }, timeToCall);

            _animationLastTime = currentTime + timeToCall;
            return id;
        };

        cancelAnimationFrame = function(id) {
            window.clearTimeout(id);
        };
    }

    /**
     * Draggable object presentation
     * @param {HTMLElement} element
     * @param {Object} options
     * @constructor
     */
    var Draggable = function(element, options) {
        var options = options || {};
        this.element = element;
        this.options = {
            onDragStart: options.onDragStart || function() {},
            onDragMove: options.onDragMove || function() {},
            onDragEnd: options.onDragEnd || function() {},
            handler: options.handler || element,
            cursor: options.cursor || 'move',
            axis: options.axis || false,
            grid: options.grid || [1, 1],
            constrain: options.constrain || false
        };
        this.isDragging = false;
        this.position = {
            x: 'auto',
            y: 'auto'
        };
        this._savedCursorState = this.options.handler.style.cursor;

        function _onDragStart(e) {

            if (e.button != Dom.Mouse.BUTTON_LEFT) {
                return;
            }
            e.preventDefault();

            var self = this;
            var style = _getComputedStyle(self.element);
            self.isDragging = true;
            self.deltaX = 0;
            self.deltaY = 0;
            self.position.x = parseInt(style['left']);
            self.position.y = parseInt(style['top']);
            self.startX = e.x;
            self.startY = e.y;
            self.offset = Dom.offset(self.element);
            self.options.onDragStart.call(self, e);

            if (isNaN(self.position.x)) {
                self.position.x = 0;
            }

            if (isNaN(self.position.y)) {
                self.position.y = 0;
            }

            var position = style['position'];
            if (position != 'relative' && position != 'absolute') {
                position = 'relative';
            }

            Dom.css(self.element, {
                position: position,
                top: self.position.y + 'px',
                left: self.position.x + 'px',
                '-moz-user-select': 'none',
                '-webkit-user-select': 'none',
                'user-select': 'none',
                '::selection': 'none'
            });

            Dom.css(self.options.handler, {
                cursor: self.options.cursor
            });

            (function _animate() {

                if (self.isDragging) {
                    requestAnimationFrame(_animate);
                } else {
                    return;
                }
                var y = self.deltaY + 'px';
                var x = self.deltaX + 'px';


                if (transitionSupport) {
                    for (var i in vendors) {
                        var transform = vendors[i] + 'transform';
                        self.element.style[transform] = 'translate(' + x + ',' + y + ')';
                    }
                } else {
                    self.element.style.top = self.position.y + self.deltaY + 'px';
                    self.element.style.left = self.position.x + self.deltaX + 'px';
                }
            })();

            function _onDrag(e) {
                var deltaX = e.x - self.startX;
                var deltaY = e.y - self.startY;
                var gridX = self.options.grid[0];
                var gridY = self.options.grid[1];

                if (gridX > 1) {
                    deltaX = Math.round(deltaX / gridX) * gridX;
                }

                if (gridY > 1) {
                    deltaY = Math.round(deltaY / gridY) * gridY;
                }

                var isConstainedToElement = Dom.isElement(self.options.constrain);
                var isConstainedToRectangle = _isArray(self.options.constrain) && self.options.constrain.length === 4;

                if (self.options.constrain && (isConstainedToElement || isConstainedToRectangle)) {
                    if (isConstainedToElement) {
                        var offset = Dom.offset(self.options.constrain);
                        var rectangle = [offset.left, offset.top, offset.width, offset.height];
                    } else {
                        var rectangle = self.options.constrain;
                    }

                    var minDeltaY = rectangle[1] - self.offset.top;
                    var maxDeltaY = rectangle[1] + rectangle[3] - (self.offset.top + self.offset.height);

                    if (deltaY <= 0 && deltaY < minDeltaY) {
                        deltaY = minDeltaY;
                    }

                    if (deltaY >= 0 && deltaY > maxDeltaY) {
                        deltaY = maxDeltaY;
                    }

                    var minDeltaX = rectangle[0] - self.offset.left;
                    var maxDeltaX = rectangle[0] + rectangle[2] - (self.offset.left + self.offset.width);

                    if (deltaX <= 0 && deltaX < minDeltaX) {
                        deltaX = minDeltaX;
                    }

                    if (deltaX >= 0 && deltaX > maxDeltaX) {
                        deltaX = maxDeltaX;
                    }
                }

                switch (self.options.axis) {
                    case 'x':
                        self.deltaX = deltaX;
                        break;
                    case 'y':
                        self.deltaY = deltaY;
                        break;
                    default:
                        self.deltaX = deltaX;
                        self.deltaY = deltaY;
                        break;
                }

                e.target = self.options.handler;//fix target
                self.options.onDragMove.call(self, e);
            }

            function _onDragEnd(e) {
                self.isDragging = false;
                Dom.removeListener(document, Dom.Event.ON_MOUSEMOVE, _onDrag);
                Dom.removeListener(document, Dom.Event.ON_TOUCHMOVE, _onDrag);
                Dom.removeListener(document, Dom.Event.ON_MOUSEUP, _onDragEnd);
                Dom.removeListener(document, Dom.Event.ON_TOUCHEND, _onDragEnd);


                var y = self.position.y + self.deltaY + 'px';
                var x = self.position.x + self.deltaX + 'px';
                self.element.style.top = y;
                self.element.style.left = x;

                if (transitionSupport) {
                    for (var i in vendors) {
                        var transform = vendors[i] + 'transform';
                        self.element.style[transform] = "";
                    }
                }
                self.options.handler.style.cursor = self._savedCursorState;

                e.target = self.options.handler;//fix target
                self.options.onDragEnd.call(self, e);
            }

            Dom.onMouseMove(document, _onDrag);
            Dom.onTouchMove(document, _onDrag);//support touch devices
            Dom.onMouseUp(document, _onDragEnd);
            Dom.onTouchEnd(document, _onDragEnd);//support touch devices
        }
        Dom.onMouseDown(this.options.handler, _onDragStart.bind(this));
        Dom.onTouchStart(this.options.handler, _onDragStart.bind(this));//support touch devices
    };

    /**
     * Checks if given object is a DOMElement
     * @param {object} element
     * @returns {boolean}
     */
    Dom.isElement = function(element) {
        if (typeof HTMLElement === 'object') {
            return element instanceof HTMLElement;
        }

        return element && typeof element === 'object' && element.nodeType === 1 && typeof  element.nodeName === 'string';
    };

    /**
     * Checks if given parameter is a DOMNode
     * @param node
     * @returns {*}
     */
    Dom.isNode = function(node) {
        if (typeof Node === 'object') {
            return node instanceof Node;
        }
        return node && typeof node === 'object' && typeof node.nodeType === 'number' && typeof node.nodeName === 'string';
    };

    /**
     * Polyfill for window.requestAnimationFrame
     * @see https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame
     * @returns {Function}
     */
    Dom.requestAnimationFrame = function() {
        return requestAnimationFrame;
    };

    /**
     * Polyfill for window.cancelAnimationFrame
     * @see https://developer.mozilla.org/en-US/docs/Web/API/window.cancelAnimationFrame
     * @returns {Function}
     */
    Dom.cancelAnimationFrame = function() {
        return cancelAnimationFrame;
    };

    /**
     * Makes element draggable
     * @param {HTMLElement} element
     * @param {Object} options
     * @returns {Draggable}
     */
    Dom.draggable = function(element, options) {
        return new Draggable(element, options);
    };


    /**
     * Normalized Event object
     *
     * @param {DOMEvent} e
     * @constructor
     */
    Dom.Event = function(e) {
        this._e = e;
        /**
         * Stops event bubbling
         */
        Dom.Event.prototype.stopPropagation = function() {
            if (this._e.stopPropagation) {
                this._e.stopPropagation();
            } else {
                this._e.cancelBubble = true;
            }
        };

        /**
         * Prevents default behaviour
         */
        Dom.Event.prototype.preventDefault = function() {
            if (this._e.preventDefault) {
                this._e.preventDefault();
            } else {
                this._e.returnValue = false;
            }
        };

        this.target = this._e.target || this._e.srcElement;
        this.ctrlKey = this._e.ctrlKey;
        this.shiftKey = this._e.shiftKey;
        this.altKey = this._e.altKey;
        this.layerY = this._e.layerY || this._e.offsetY;
        this.layerX = this._e.layerX || this._e.offsetX;
        this.x = this._e.x ||this. _e.clientX;
        this.y = this._e.y || this._e.clientY;
        this.keyCode = this._e.keyCode;
        this.name = this.type = this._e.type;
        this.path = this._e.path;
        this.timeStamp = this._e.timeStamp;
        if (ie & ie < 9) {
            this.button = this._e.button == 1 ? Dom.Mouse.BUTTON_LEFT : (this._e.button == 4 ? Dom.Mouse.BUTTON_MIDDLE : Dom.Mouse.BUTTON_RIGHT);
        } else if (this._e.hasOwnProperty('which')) {
            this.button = this._e.which == 1 ? Dom.Mouse.BUTTON_LEFT : (this._e.which == 2 ? Dom.Mouse.BUTTON_MIDDLE : Dom.Mouse.BUTTON_RIGHT);
        } else {
            this.button = this._e.button;
        }
    };

    Dom.Mouse = {};

    Dom.Mouse.BUTTON_LEFT = 0;
    Dom.Mouse.BUTTON_MIDDLE = 1;
    Dom.Mouse.BUTTON_RIGHT = 2;

    /**
     * Mouse events
     */
    Dom.Event.ON_CLICK = 'click';
    Dom.Event.ON_DBLCLICK = 'dblclick';
    Dom.Event.ON_CONTEXTMENU = 'contextmenu';
    Dom.Event.ON_MOUSEDOWN = 'mousedown';
    Dom.Event.ON_MOUSEENTER = 'mouseenter';
    Dom.Event.ON_MOUSELEAVE = 'mouseleave';
    Dom.Event.OM_MOUSEMOVE = 'mousemove';
    Dom.Event.ON_MOUSEOVER = 'mouseover';
    Dom.Event.ON_MOUSEOUT = 'mouseout';
    Dom.Event.ON_MOUSEUP = 'mouseup';
    Dom.Event.ON_MOUSEMOVE = 'mousemove';

    /**
     * Touch Events
     */
    Dom.Event.ON_TOUCHSTART = 'touchstart';
    Dom.Event.ON_TOUCHEND = 'touchend';
    Dom.Event.ON_TOUCHMOVE = 'touchmove';
    Dom.Event.ON_TOUCHCANCEL = 'touchcancel';

    /**
     * Keyboard events
     */
    Dom.Event.ON_KEYDOWN = 'keydown';
    Dom.Event.ON_KEYUP = 'keyup';
    Dom.Event.ON_KEYPRESS = 'keypress';

    /**
     * UI Events
     */

        //form events
    Dom.Event.ON_SELECT = 'select';
    Dom.Event.ON_RESET = 'reset';
    Dom.Event.ON_FOCUS = 'focus';
    Dom.Event.ON_BLUR = 'blur';
    Dom.Event.ON_SUBMIT = 'submit';
    Dom.Event.ON_CHANGE = 'change';

    //frame/window events
    Dom.Event.ON_LOAD = 'load';
    Dom.Event.ON_UNLOAD = 'unload';
    Dom.Event.ON_RESIZE = 'resize';
    Dom.Event.ON_UNLOAD = 'unload';
    Dom.Event.ON_ERROR = 'error';
    Dom.Event.ON_SCROLL = 'scroll';

    /**
     * Standard drag and drop events
     */
    Dom.Event.ON_DRAG = 'drag';
    Dom.Event.ON_DRAGSTART = 'dragstart';
    Dom.Event.ON_DRAGEND = 'dragend';
    Dom.Event.ON_DRAGENTER = 'dragenter';
    Dom.Event.ON_DRAGLEAVE = 'dragleave';
    Dom.Event.ON_DRAGOVER = 'dragover';
    Dom.Event.ON_DROP = 'drop';

    /**
     * Dom drag and drop events
     */
    Dom.Event.ON_DOM_DRAGSTART = 'onDomDragStart';
    Dom.Event.ON_DOM_DRAGEND = 'onDomDragEnd';
    Dom.Event.ON_DOM_DRAGMOVE = 'onDomDragMove';
    Dom.Event.ON_DOM_DROP = 'onDomDrop';
    Dom.Event.ON_DOM_DRAGENTER = 'onDomDragEnter';
    Dom.Event.ON_DOM_DRAGLEAVE = 'onDomDragLeave';

    /**
     * Attaches javascript listener to the element(s) for the given event type
     *
     * @param {HTMLElement|NodeList} element
     * @param {String} event
     * @param {Function} listener
     *
     * @returns {Dom|false} returns Dom if listener has been attached otherwise false
     */
    Dom.addListener = function (element, event, listener) {
        if (element === undefined) {
            throw new Error("Parameter cannot be undefined");
        }

        if (_isIterable(element)) {
            _each(element, function(e, index) {
                Dom.addListener(e, event, listener);
            });
            return Dom;
        }

        if (!Dom.isNode(element) && element !== window) {
            throw new Error(element + " is not a DOMNode object");
        }

        element._event = element._event || {};
        element._event[event] = element._event[event] || { keys:[], values:[] };

        //checks if listener already exists
        if (_indexOf(element._event[event].keys, listener) != -1) {
            return Dom;
        }

        element._event[event].keys.push(listener);
        var _listener = function(e) {
            var evt = new Dom.Event(e);
            if (listener.call(element, evt) === false) {
                e.stop();
            }
        };
        element._event[event].values.push(_listener);

        element[addListener](eventPrefix + event, _listener);

        return Dom;
    };

    /**
     * Execute all handlers and behaviors attached to the element(s)
     * for the given event type
     *
     * @param {HTMLElement|NodeList} element
     * @param {string} type
     * @param {Object} options event options
     * @returns {Dom}
     */
    Dom.dispatch = function(element, type, options) {
        if (element === undefined) {
            throw new Error("Parameter cannot be undefined");
        }

        if (_isIterable(element)) {

            _each(element, function(e, index) {
                Dom.dispatch(e, type, options);
            });
            return Dom;
        }

        if (!Dom.isNode(element)) {
            throw new Error(element + " is not a DOMNode object");
        }

        if (!options) {
            options = {};
        }

        var o = {
            type: type,
            view: options.view || element.ownerDocument.defaultView,
            detail: options.detail || 1,
            screenX: options.screenX || 0,
            screenY: options.screenY || 0,
            clientX: options.clientX || 0,
            clientY: options.clientY || 0,
            button: options.button || 0,
            ctrlKey: options.ctrlKey || false,
            altKey: options.altKey || false,
            shiftKey: options.shiftKey || false,
            metaKey: options.metaKey || false,
            bubbles: options.bubbles || true,
            cancelable: options.cancelable || true
        };
        var eventObjects = {
            'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
            'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
        };
        var eventClass = 'Event';
        var event;

        for (var name in eventObjects) {
            if (eventObjects[name].test(type)) { eventClass = name; break; }
        }

        if (document.createEvent) {
            event = element.ownerDocument.createEvent(eventClass);
            if (eventClass == 'MouseEvents') {
                event.initMouseEvent( o.type, o.bubbles, o.cancelable, o.view,
                    o.detail, o.screenX, o.screenY, o.clientX, o.clientY, o.ctrlKey,
                    o.altKey, o.shiftKey, o.metaKey, 0, null);
            } else {
                event.initEvent(type, o.bubbles, o.cancelable);
            }
            element.dispatchEvent(event);
            return Dom;

        } else if (document.createEventObject) {
            o.clientX = o.pointerX;
            o.clientY = o.pointerY;
            event = document.createEventObject();
            for (var key in o) {
                event[key] = o[key];
            }
            element.fireEvent(eventPrefix + type, event);
            return Dom;
        }

    };

    /**
     * Removes javascript listener from the element(s) for the given event type.
     * @param {HTMLElement|NodeList} element
     * @param {String} event
     * @param {Function} listener
     * @returns {object|false} returns Dom object if success otherwise false
     */
    Dom.removeListener = function (element, event, listener) {
        if (element === undefined) {
            throw new Error("Parameter cannot be undefined");
        }

        if (_isIterable(element)) {
            _each(element, function(e, index) {
                Dom.removeListener(e, event, listener);
            });
            return Dom;
        }

        if (!Dom.isNode(element) && element !== window) {
            throw new Error(element + " is not a DOMNode object");
        }

        if (!element._event || !element._event[event]) {
            return false;
        }

        var key = _indexOf(element._event[event].keys, listener);
        if (key === -1) {
            return false;
        }
        var _listener = element._event[event].values[key];

        element[removeListener](eventPrefix + event, _listener);
        delete element._event[event].values[key];
        delete element._event[event].keys[key];

        return Dom;
    };

    /**
     * Determine whether a supplied listener is attached to the element
     *
     * @param {HTMLElement} element
     * @param {String} event
     * @param {Function} listener
     * @returns {boolean}
     */
    Dom.hasListener = function (element, event, listener) {
        if (!Dom.isNode(element) && element !== window) {
            throw new Error(element + " is not a DOMNode object");
        }

        if (!element._event || !element._event[event]) {
            return false;
        }
        return _indexOf(element._event[event].keys, listener) !== -1;
    };

    /* Dom Event Aliases */

    /**
     * Bind an event handler to the “click” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param {Function} listener
     * @returns {Dom|false}
     */
    Dom.onClick = function (element, listener) {
        return Dom.addListener(element, Dom.Event.ON_CLICK, listener);
    };

    /**
     * Bind an event handler to the “dblclick” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onDblClick = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DBLCLICK, listener);
    };

    /**
     * Bind an event handler to the “onmouseover” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onMouseOver = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEOVER, listener);
    };

    /**
     * Bind an event handler to the “onmouseout” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onMouseOut = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEOUT, listener);
    };

    /**
     * Bind an event handler to the “onmousedown” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onMouseDown = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEDOWN, listener);
    };

    /**
     * Bind an event handler to the “onmouseup” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onMouseUp = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEUP, listener);
    };

    /**
     * Bind an event handler to the “onmouseenter” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onMouseEnter = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEENTER, listener);
    };

    /**
     * Bind an event handler to the “onmouseleave” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onMouseLeave = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSELEAVE, listener);
    };

    /**
     * Bind an event handler to the “mousemove” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onMouseMove = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEMOVE, listener);
    };

    /**
     * Bind an event handler to the “touchstart” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onTouchStart = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_TOUCHSTART, listener);
    };

    /**
     * Bind an event handler to the “touchend” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onTouchEnd = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_TOUCHEND, listener);
    };

    /**
     * Bind an event handler to the “touchmove” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onTouchMove = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_TOUCHMOVE, listener);
    };

    /**
     * Bind an event handler to the “touchcancel” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onTouchCancel = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_TOUCHCANCEL, listener);
    };

    /**
     * Bind an event handler to the “ondrag” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onDrag = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DRAG, listener);
    };

    /**
     * Bind an event handler to the “ondragstart” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onDragStart = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DRAGSTART, listener);
    };

    /**
     * Bind an event handler to the “ondragend” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onDragEnd = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DRAGEND, listener);
    };

    /**
     * Bind an event handler to the “focus” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onFocus = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_FOCUS, listener);
    };

    /**
     * Bind an event handler to the “blur” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onBlur = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_BLUR, listener);
    };

    /**
     * Bind an event handler to the “select” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onSelect = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_SELECT, listener);
    };

    /**
     * Bind an event handler to the “change” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onChange = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_CHANGE, listener);
    };

    /**
     * Bind an event handler to the “submit” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onSubmit = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_SUBMIT, listener);
    };

    /**
     * Bind an event handler to the “reset” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onReset = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_RESET, listener);
    };

    /**
     * Bind an event handler to the “load” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onLoad = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_LOAD, listener);
    };

    /**
     * Bind an event handler to the “scroll” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onScroll = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_SCROLL, listener);
    };

    /**
     * Bind an event handler to the “unload” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onUnload = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_UNLOAD, listener);
    };

    /**
     * Bind an event handler to the “resize” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param listener
     * @returns {Dom|false}
     */
    Dom.onResize = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_RESIZE, listener);
    };

    /**
     * Bind an event handler to the “keydown” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param {Function} listener
     * @returns {Dom|false}
     */
    Dom.onKeyDown = function (element, listener) {
        return Dom.addListener(element, Dom.Event.ON_KEYDOWN, listener);
    };

    /**
     * Bind an event handler to the “keyup” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param {Function} listener
     * @returns {Dom|false}
     */
    Dom.onKeyUp = function (element, listener) {
        return Dom.addListener(element, Dom.Event.ON_KEYUP, listener);
    };

    /**
     * Bind an event handler to the “keypress” JavaScript event
     *
     * @see Dom.addListener
     * @param {HTMLElement|NodeList} element
     * @param {Function} listener
     * @returns {Dom|false}
     */
    Dom.onKeyPress = function (element, listener) {
        return Dom.addListener(element, Dom.Event.ON_KEYPRESS, listener);
    };

    /* Dom Traversal */

    /**
     * Finds HTMLElements that match css pattern
     *
     * Supported from IE 8.0, FF 3.5, Chrome 4.0, Safari 3.1
     * @param {String} selector
     * @oaram {HTMLElement} element not required
     * @returns {NodeList}
     */
    Dom.find = function (selector, element) {
        var result = [];
        if (Dom.isNode(element)) {
             result = element.querySelectorAll(selector);
        } else {
            result = document.querySelectorAll(selector);
        }
        return result;
    };

    /**
     * Returns HTMLElement with given id
     *
     * @param {String} id
     * @returns {HTMLElement}
     */
    Dom.id = function (id) {
        return document.getElementById(id);
    };

    /**
     * Finds HTMLElements that match given tagname
     *
     * @param {String} name
     * @returns {NodeList}
     */
    Dom.findByTagName = function (name) {
        return document.getElementsByTagName(name);
    };

    /**
     * Finds HTMLElements with given class name
     *
     * Supported from IE 8.0, FF 3.5, Chrome 4.0, Safari 3.1
     * @param name
     * @returns {NodeList}
     */
    Dom.findByClass = function (name) {
        if (name.substring(0,1) == ".") {
            name = name.substring(1);
        }

        if (document.getElementsByClassName) {
            return document.getElementsByClassName(name);
        }

        if(document.querySelector && document.querySelectorAll ) {
            return document.querySelectorAll("." + name);
        }
    };

    /**
     * Returns current coordinates of the element,
     * relative to the document
     *
     * @param {HTMLElement} element
     * @returns {*}
     */
    Dom.offset = function(element) {
        if (!Dom.isElement(element)) {
            return false;
        }
        var rect = element.getBoundingClientRect();

        var offset = {
            top: Math.round(rect.top),
            right: Math.round(rect.right),
            bottom: Math.round(rect.bottom),
            left: Math.round(rect.left),
            width: rect.width ? Math.round(rect.width) : Math.round(element.offsetWidth),
            height: rect.height ? Math.round(rect.height) : Math.round(element.offsetHeight)

        };

        //fallback to css width and height
        if (offset.width <= 0) {
            offset.width = parseFloat(_getComputedStyle(element, 'width'));
        }
        if (offset.height <= 0) {
            offset.height = parseFloat(_getComputedStyle(element, 'height'));
        }

        return offset;
    };

    /**
     * Returns the width of the element
     *
     * @param {HTMLElement} element
     */
    Dom.width = function(element) {
        return Dom.offset(element).width;
    };

    /**
     * Returns the height of the element
     *
     * @param {HTMLElement} element
     */
    Dom.height = function(element) {
        return Dom.offset(element).height;
    };

    /**
     * Gets the parent of the html element
     *
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    Dom.parent = function(element) {
        if (!Dom.isNode(element)) {
            throw new Error(element + " is not a DOMNode object");
        }
        return element.parentNode;
    };

    /**
     * Gets children elements of html element. Text nodes are ommited by default.
     * To get textnodes tag must be set to true, eg.
     *
     *      Dom.children(element, true)
     *
     * @param {HTMLElement} element
     * @param {String|boolean} tag filters children by tag name or tells to retrieve text nodes as well
     * @returns {NodeList|Array}
     */
    Dom.children = function(element, tag) {

        if (typeof tag === 'boolean' && tag) {
            return element.childNodes;
        }

        var result = [];

        if (_isString(tag)) {

            for (var i = 0, j = element.childNodes.length; i < j; i++) {
                if (element.childNodes[i].nodeName.toLowerCase() === tag.toLowerCase()) {
                    result.push(element.childNodes[i]);
                }
            }
            return result;
        }

        for (var i in element.childNodes) {
            if (element.childNodes[i].nodeType === 1) {
                result.push(element.childNodes[i]);
            }
        }

        return result;
    };

    /**
     * Gets following sibling element of the HTMLElement
     *
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    Dom.next = function(element) {
        if (!Dom.isNode(element)) {
            throw new Error(element + " is not a DOMNode object");
        }

        var result = element.nextSibling;
        if (result.nodeType != 1) {
            return Dom.next(result);
        }
        return result;
    };

    /**
     * Gets previous sibling element of the HTMLElement
     *
     * @param {HTMLElement} element
     * @returns {HTMLElement}
     */
    Dom.previous = function(element) {
        if (!Dom.isNode(element)) {
            throw new Error(element + " is not a DOMNode object");
        }

        var result = element.previousSibling;
        if (result.nodeType != 1) {
            return Dom.previous(result);
        }
        return result;
    };

    /* Dom Manipulation */

    /**
     * Gets or sets element attributes
     * if the attribute is not defined this method
     * return an empty string
     *
     * @param element
     * @param attribute
     * @param {*} attribute attribute name or names
     *
     * @example
     * Dom.attribute(el, "href"); // returns href attribute's value of the element
     * Dom.attribute(el, ["href", "target"]); //returns object of attributed of the element
     * Dom.attribute(el, {href: "#new"}); //sets href attribute's value
     */
    Dom.attribute = function(element, attribute)  {
        if (!Dom.isNode(element)) {
            throw new Error(element + " is not a DOMNode object");
        }

        //get one attribute
        if (typeof attribute === "string") {

            var result;

            if (attribute === 'class' && element['className'] !== undefined) {//class?
                result = element.className;
            } else if (attribute === 'for' && element['htmlFor'] !== undefined) {//for?
                result = element.htmlFor;
            } else if (attribute === 'value' && element['value'] !== undefined) {//value?
                result = element.value;
            } else {
                result = element.getAttribute(attribute);
            }

            if (result === '') {
                result = null;
            }
            return result;
        }

        //get many
        if (_isArray(attribute)) {
            var result = {};
            for (var i in attribute) {
                result[attribute[i]] = Dom.attribute(element, attribute[i]);
            }
            return result;
        }

        //set attribute(s)
        if (_isLiteralObject(attribute)) {
            for (var i in attribute) {
                if (attribute[i] === null) {
                    element.removeAttribute(i);
                } else {
                    element.setAttribute(i, attribute[i]);
                }
            }
            return attribute;
        }

        return false;
    };

    /**
     * Sets or gets HTMLElement's style
     *
     * @param {HTMLElement} element
     * @param {Object} style key value pair object
     * @returns {Object|false}
     */
    Dom.css = function(element, style) {

        if (_isIterable(element) && _isLiteralObject(style)) {
            _each (element, function(e) {
                Dom.css(e, style);
            });
            return Dom;
        }

        if (!Dom.isNode(element)) {
            throw new Error(element + " is not a DOMNode object");
        }

        //get one element
        if (typeof style === "string") {
            return _getComputedStyle(element, cssNameProperty(style));
        }

        //get array of elements
        if (_isArray(style)) {
            var css = {};
            for (var i in style) {
                css[style[i]] = _getComputedStyle(element, cssNameProperty(style[i]));
            }
            return css;
        }

        if (_isLiteralObject(style)) {
            //set csses
            for (var i in style) {
                element.style[cssNameProperty(i)] = style[i];
            }
            return style;
        }

        return false;
    };

    /**
     * Gets css classes of the given element
     *
     * @param {HTMLElement} element
     * @returns {Array}
     */
    Dom.getClass = function(element) {
        if (!Dom.isNode(element)) {
            throw new Error(element + " is not a DOMNode object");
        }

        var attribute = Dom.attribute(element, 'class');
        if (!attribute) {
            return [];
        }
        attribute = attribute.split(' ');
        var classNames = [];
        for (var i in attribute) {
            if (attribute[i] === '') {
                continue;
            }
            classNames.push(attribute[i]);
        }
        return classNames;
    };

    /**
     * Checks whether html element is assigned to the given class(es)
     *
     * @param element
     * @param {String|Array} className
     * @returns {boolean}
     */
    Dom.hasClass = function(element, className) {
        if (!Dom.isNode(element)) {
            throw new Error(element + " is not a DOMNode object");
        }

        if (_isString(className)) {
            return _indexOf(Dom.getClass(element), className) > -1 ? true : false;
        } else if (_isArray(className)) {
            var elementClasses = Dom.getClass(element);
            for (var i in className) {
                if (_indexOf(className[i], elementClasses) === -1) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }

        return false;
    };

    /**
     * Assign new css class(es) to the html element(s)
     *
     * @param {HTMLElement} element
     * @param {String} className
     * @returns {boolean}
     */
    Dom.addClass = function(element, className) {
        if (element === undefined) {
            throw new Error("Dom.addClass first parameter cannot be undefined");
        }

        if (_isIterable(element)) {
            _each(element, function(e) {
                Dom.addClass(e, className);
            });
            return Dom;
        }

        if (!Dom.isNode(element)) {
            throw new Error(element + " is not a DOMNode object");
        }

        if (_isArray(className)) {
            for (var i in className) {
                Dom.addClass(element, className[i]);
            }
            return Dom;
        }

        var classes = Dom.getClass(element);

        if (_indexOf(classes, className) === -1) {
            classes.push(className);
        }
        classes = classes.join(' ');
        return Dom.attribute(element, {class: classes});
    };

    /**
     * Removes html element's assignment to the css class(es)
     *
     * @param {HTMLElement} element
     * @param {String} className
     */
    Dom.removeClass = function(element, className) {
        if (element === undefined) {
            throw new Error("Dom.removeClass first parameter cannot be undefined");
        }

        if (_isIterable(element)) {
            _each(element, function(e) {
                Dom.removeClass(e, className);
            });
            return Dom;
        }

        if (!Dom.isNode(element)) {
            throw new Error("Dom.removeClass" + element + " is not a DOMNode object");
        }

        if (!className) {
            return Dom.attribute(element, {class: null});
        }

        var classes = Dom.getClass(element);
        var i = _indexOf(classes, className);

        if (i === -1) {
            return;
        }
        classes.splice(i, 1);
        return Dom.attribute(element, {class: classes.join(' ')});

    };

    /**
     * Creates html element(s)
     *
     * @param {String} html
     * @return {HTMLElement}
     */
    Dom.create = function(html) {
        var div = document.createElement('tbody');
        var doc = document.createDocumentFragment();
        Dom.html(div, html);
        var children = Dom.children(div);


        for (var i = 0, j = children.length; i < j; i++) {
            Dom.append(doc, children[i]);
        }

        return doc;
    };

    /**
     * Creates a copy of a node, and returns the clone.
     *
     * @param {HTMLElement} element
     * @return {HTMLElement}
     */
    Dom.copy = function(element) {
        if (!Dom.isNode(element)) {
            throw new Error("Dom.copy" + element + " is not a DOMNode object");
        }
        return element.cloneNode(true);
    };

    /**
     * Gets or sets inner html of HTMLElement
     *
     * @param {HTMLElement} element
     * @param {String} string
     * @returns {String}
     */
    Dom.html = function(element, string) {
        if (!Dom.isNode(element)) {
            throw new Error("Dom.html" + element + " is not a DOMNode object");
        }

        if (_isString(string)) {
            element.innerHTML = string;
            return string;
        }

        return element.innerHTML;
    };

    /**
     * Gets or sets text value of the HTML element
     *
     * @param {HTMLElement} element
     * @param {String} string
     * @returns {*}
     */
    Dom.text = function(element, string) {

        if (!Dom.isNode(element)) {
            throw new Error("Dom.text " + element + " is not a DOMNode object");
        }

        if (_isString(string)) {

            if (element.innerText) {
                element.innerText = string;
            } else {
                element.textContent = string;
            }
            return string;
        }

        if (element.innerText) {
            return element.innerText;
        }

        return element.textContent;
    };

    /**
     * Micro template support, replaces the {{tag}} with variable
     * in hash array passed to function
     *
     * @param {String} tpl template string
     * @param {Object} hash
     * @returns {String}
     *
     * @example
     * ```
     * var str = '<h1 class="{{class}}">{{text}}</h1>';
     * var hash = {class: 'example', text: function () {return 'header';}};
     *
     * var result = Dom.template(str, hash);//<h1 class="example">header</h1>
     * ```
     */
    Dom.template = function(tpl, hash) {

        var regex = /\{\{.*?\}\}/gi;

        return tpl.replace(regex, function replacer(str, pos, tpl) {
            var properties = str.replace('{{', '').replace('}}', '').trim().split(' ');
            var tag = properties[0];
            if (!tag || !hash.hasOwnProperty(tag)) {
                return '';
            }
            if (_isFunction(hash[tag])) {
                return hash[tag].apply(tpl, properties);
            }
            if (_isString(hash[tag]) || _isNumeric(hash[tag])) {
                return hash[tag];
            }
            return '';
        });
    };

    /**
     * Inserts content specified by the html argument at the end of HTMLElement
     *
     * @param {HTMLElement} element
     * @param {String|HTMLElement} html
     * @return {HTMLElement} inserted element
     */
    Dom.append = function(element, html) {

        if (!Dom.isNode(element)) {
            throw new Error("Dom.append " + element + " is not a DOMNode object");
        }

        if (_isString(html)) {
            html = Dom.create(html);
        }
        element.appendChild(html);
        return html;
    };

    /**
     * Inserts content specified by the html argument at the beginning of HTMLElement
     *
     * @param {HTMLElement} element
     * @param {String|HTMLElement} html
     * @returns {HTMLElement} inserted element
     */
    Dom.prepend = function(element, html) {

        if (!Dom.isNode(element)) {
            throw new Error("Dom.prepend " + element + " is not a DOMNode object");
        }

        if (_isString(html)) {
            html = Dom.create(html);
        }
        element.insertBefore(html, element.firstChild);
        return html;
    };

    /**
     * Inserts content specified by the html argument after the HTMLElement
     *
     * @param {HTMLElement} element
     * @param {String|HTMLElement} html
     * @returns {HTMLElement} inserted element
     */
    Dom.after = function(element, html) {

        if (!Dom.isNode(element)) {
            throw new Error("Dom.after " + element + " is not a DOMNode object");
        }

        if (_isString(html)) {
            html = Dom.create(html);
        }

        element.parentNode.insertBefore(html, element.nextSibling);
        return html;
    };

    /**
     * Inserts content specified by the html argument before the HTMLElement
     *
     * @param {HTMLElement} element
     * @param {String|HTMLElement} html
     * @returns {HTMLElement} inserted element
     */
    Dom.before = function(element, html) {

        if (!Dom.isNode(element)) {
            throw new Error("Dom.before " + element + " is not a DOMNode object");
        }

        if (_isString(html)) {
            html = Dom.create(html);
        }

        element.insertBefore(html, element);
        return html;
    };

    /**
     * Replaces given html element with content specified in html parameter
     *
     * @param {HTMLElement} element
     * @param {String|HTMLElement} html
     * @returns {HTMLElement} inserted element
     */
    Dom.replace = function(element, html) {

        if (!Dom.isNode(element)) {
            throw new Error("Dom.replace " + element + " is not a DOMNode object");
        }

        if (_isString(html)) {
            html = Dom.create(html);
        }
        element.parentNode.replaceChild(html, element);
        return html;
    };

    /**
     * Removes HTMLElement from dom tree
     *
     * @param {HTMLElement} element
     * @returns {HTMLElement} removed element
     */
    Dom.remove = function(element) {

        if (!Dom.isNode(element)) {
            throw new Error("Dom.remove " + element + " is not a DOMNode object");
        }

        var parent = element.parentNode;
        return parent.removeChild(element);
    };

    /**
     * Gets/Sets element data
     * @param {HTMLElement} element
     * @param {String|object} name not required
     * @returns {*}
     */
    Dom.data = function(element, name) {
        if (!Dom.isNode(element)) {
            throw new Error("Dom.data " + element + " is not a DOMNode object");
        }

        //get all element's data
        if (name === undefined) {
            if (element.hasOwnProperty('dataset')) {
                var dataset = {};
                for (var i in element.dataset) {
                    dataset[i] = element.dataset[i];
                }
                return dataset;
            } else {//pollyfill for shitty browsers
                var dataset = {};
                for (var i = 0, attributes = element.attributes, l = attributes.length; i < l; i++) {
                    var attr = attributes.item(i);
                    if (attr.nodeName.substr(0, 5) !== 'data-') {
                        continue;
                    }
                    dataset[attr.nodeName.substr(5)] = attr.nodeValue;
                }
                return dataset;
            }
        }

        //get one attribute
        if (_isString(name)) {
            return Dom.attribute(element, 'data-' + name);
        }

        //get dataset by user names
        if (_isArray(name)) {
            var dataset = {};
            for (var i = 0, l = name.length; i < l; i++) {
                var prop = name[i];
                dataset[prop] = Dom.attribute(element, 'data-' + prop);
            }
            return dataset;
        }

        //set/remove attributes
        if (_isLiteralObject(name)) {
            var attrs = {};
            for (var i in name) {
                var value = name[i];
                attrs['data-' + i] = value;
            }
            Dom.attribute(element, attrs);
        }

    };

    /**
     * Sets handler which will be executed as soon as
     * document will load
     *
     * @param {Function} handler
     * @returns {Dom}
     */
    Dom.loaded = function(handler) {
        if (_isDomLoaded !== false) {
            handler.call(null, _isDomLoaded);
            return Dom;
        }

        _domLoadedHandlers.push(handler);
        return Dom;
    };

    /**
     * Sets handler which will be executed as soon as
     * document will be ready
     *
     * @param {Function} handler
     * @returns {Dom}
     */
    Dom.ready = function(handler) {
        if (_isDomReady !== false) {
            handler.call(null, _isDomReady);
            return Dom;
        }
        _domReadyHandlers.push(handler);
        return Dom;
    };

    function _onDOMReady(e) {
        //add most used selectors
        Dom.body = Dom.findByTagName('body')[0];
        Dom.head = Dom.findByTagName('head')[0];

        var event = new Dom.Event(e);
        _isDomReady = event;

        _each(_domReadyHandlers, function(fn) {
            fn.call(null, event);
        });
    }

    function _onDOMLoaded(e) {

        var event = new Dom.Event(e);
        _isDomLoaded = event;

        _each(_domLoadedHandlers, function(fn) {
            fn.call(null, event);
        });
    }

    //on load
    if (window.onload !== null) {
        _domLoadedHandlers.push(window.onload);
    }
    window.onload = _onDOMLoaded;

    //on ready
    if (addListener === 'attachEvent') {//shitty browsers
        document[addListener]('onreadystatechange', function(e) {
            if (document.readyState === 'complete') {
                document[removeListener]('onreadystatechange', arguments.callee);
                _onDOMReady(e);
            }
        });
    } else {//ecma compatible browsers
        document[addListener]('DOMContentLoaded', function(e) {
            document[removeListener]('DOMContentLoaded', arguments.callee, false);
            _onDOMReady(e);
        }, false);
    }


    //export dom
    window.Dom = Dom;


})(this, document);