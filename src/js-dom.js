;(function (window, document, undefined) {

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

    function _isArray(object) {
        return Object.prototype.toString.call(object) === '[object Array]';
    }

    function _isString(object) {
        return typeof object === 'string';
    }

    function _isObject(object) {
        return typeof object === 'object';
    }


    function _isIterable(object) {
        if (object['length'] !== undefined && object.length > 0) {
            return true;
        }
        return false;
    }

    function _isDomNode(object) {
        try {
            return object instanceof HTMLElement;
        }
        catch(e){
            return (typeof object === 'object') && (object.nodeType === 1) && (typeof object.ownerDocument === 'object');
        }
    }


    var addListener = document.addEventListener ? 'addEventListener' : 'attachEvent',
        removeListener = document.removeEventListener ? 'removeEventListener' : 'detachEvent',
        eventPrefix = document.addEventListener ? '' : 'on',
        createEvent = document.createEvent ? 'createEvent' : 'createEventObject',
        dispatchEvent = document.dispatchEvent ? 'dispatchEvent' : 'fireEvent',
        Dom = {},
        cssNameProperty = function(prop) {return prop;};

    //trident 4?
    var ua = navigator.userAgent;
    var re  = new RegExp('Trident/([0-9]{1,}[\.0-9]{0,})');
    if (re.exec(ua) != null) {
        rv = parseFloat( RegExp.$1 );
        if (rv == 4) {
            cssNameProperty = function(prop) {
                for(var exp=/-([a-z0-9])/; exp.test(prop); prop = prop.replace(exp,RegExp.$1.toUpperCase()));
                return prop;
            };
        }
    }

    /**
     * Normalized Event object
     * @param {DOMEvent} e
     * @constructor
     */
    Dom.Event = function(e) {
        var _e = e;

        /**
         * Stops event bubbling
         */
        Dom.Event.prototype.stopPropagation = function() {
            if (_e.stopPropagation) {
                _e.stopPropagation();
            } else {
                _e.cancelBubble = true;
            }
        };

        /**
         * Prevents default behaviour
         */
        Dom.Event.prototype.preventDefault = function() {
            if (_e.preventDefault) {
                _e.preventDefault();
            } else {
                _e.returnValue = false;
            }
        };

        /**
         * Return native event object
         * @returns {DOMEvent}
         */
        Dom.Event.prototype.event = function() {
            return _e;
        };


        this.target = _e.target || _e.srcElement;
        this.ctrlKey = _e.ctrlKey;
        this.shiftKey = _e.shiftKey;
        this.altKey = _e.altKey;
        this.relativeY = _e.layerY || _e.offsetY;
        this.relativeX = _e.layerX || _e.offsetX;
        this.x = _e.x || _e.clientX;
        this.y = _e.y || _e.clientY;
    };

    /**
     * Mouse events
     */
    Dom.Event.ON_CLICK = 'click';
    Dom.Event.ON_DBLCLICK = "dblclick";
    Dom.Event.ON_CONTEXTMENU = "contextmenu";
    Dom.Event.ON_MOUSEDOWN = "mousedown";
    Dom.Event.ON_MOUSEENTER = "mouseenter";
    Dom.Event.ON_MOUSELEAVE = "mouseleave";
    Dom.Event.OM_MOUSEMOVE = "mousemove";
    Dom.Event.ON_MOUSEOVER = 'mouseover';
    Dom.Event.ON_MOUSEOUT = 'mouseout';
    Dom.Event.ON_MOUSEUP = "mouseup";
    /**
     * Keyboard events
     */
    Dom.Event.ON_KEYDOWN = "keydown";
    Dom.Event.ON_KEYUP = "keyup";
    Dom.Event.ON_KEYPRESS = "keypress";
    /**
     * UI Events
     */
    Dom.Event.ON_SELECT = "select";
    Dom.Event.ON_LOAD = "load";
    Dom.Event.ON_UNLOAD = "unload";
    Dom.Event.ON_RESIZE = "resize";
    Dom.Event.ON_UNLOAD = "unload";
    Dom.Event.ON_ERROR = "error";
    Dom.Event.ON_SCROLL = "scroll";
    Dom.Event.ON_RESET = "reset";
    Dom.Event.ON_SUBMIT = "submit";
    /**
     * Drag and drop events
     */
    Dom.Event.ON_DRAG = "drag";
    Dom.Event.ON_DRAGSTART = "dragstart";
    Dom.Event.ON_DRAGEND = "dragend";
    Dom.Event.ON_DRAGENTER = "dragenter";
    Dom.Event.ON_DRAGLEAVE = "dragleave";
    Dom.Event.ON_DRAGOVER = "dragover";
    Dom.Event.ON_DROP = "drop";

    /**
     * Attach listener on element
     * @param {DOMNode|NodeList} element
     * @param {String} event
     * @param {Function} listener
     * @returns {*}
     */
    Dom.addListener = function (element, event, listener) {
        if (element === undefined) {
            return false;
        }

        if (_isIterable(element)) {
            for (var i = 0, n = element.length; i < n; i++) {
                Dom.addListener(element[i], event, listener);
            }
            return element;
        }

        element._event = element._event || {};
        element._event[event] = element._event[event] || { keys:[], values:[] };

        //checks if listener already exists
        if (_indexOf(element._event[event].keys, listener) != -1) {
            return element;
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

        return element;
    };

    /**
     * Dispatches an event of given type
     * @param element
     * @param type
     * @param options
     * @returns {Event}
     */
    Dom.dispatch = function(element, type, options) {
        if (element === undefined) {
            return false;
        }

        if (_isIterable(element)) {
            for (var i = 0, n = element.length; i < n; i++) {
                Dom.dispatch(element[i], type, options);
            }
            return element;
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
            },
            eventObjects = {
                'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
                'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
            },
            eventClass = 'Event',
            event;

        for (var name in eventObjects) {
            if (eventObjects[name].test(type)) { eventClass = name; break; }
        }

        if (document.createEvent) {
            event = element.ownerDocument.createEvent(eventClass);
            if (eventClass = 'MouseEvents') {
                event.initMouseEvent( o.type, o.bubbles, o.cancelable, o.view,
                    o.detail, o.screenX, o.screenY, o.clientX, o.clientY, o.ctrlKey,
                    o.altKey, o.shiftKey, o.metaKey, 0, null);
            } else {
                event.initEvent(type, o.bubbles, o.cancelable);
            }
            element.dispatchEvent(event);
            return event;

        } else if (document.createEventObject) {
            o.clientX = o.pointerX;
            o.clientY = o.pointerY;
            event = document.createEventObject();
            for (var key in o) {
                event[key] = o[key];
            }
            element.fireEvent(eventPrefix + type, event);
            return event;
        }

    };

    /**
     * Removes previously attached event
     * @param {DOMNode|NodeList} element
     * @param {String} event
     * @param {Function} listener
     * @returns {*}
     */
    Dom.removeListener = function (element, event, listener) {
        if (element === undefined) {
            return false;
        }
        if (_isIterable(element)) {
            for (var i = 0, n = element.length; i < n; i++) {
                Dom.removeListener(element[i], event, listener);
            }
            return element;
        }

        if (!element._event || !element._event[event]) {
            return false;
        }

        var key = _indexOf(element._event[event].keys, listener);
        if (key == -1) {
            return false;
        }
        var _listener = element._event[event].values[key];

        element[removeListener](eventPrefix + event, _listener);
        delete element._event[event].values[key];
        delete element._event[event].keys[key];

        return element;
    };

    /* Dom Event Aliases */

    Dom.onClick = function (element, listener) {
        return Dom.addListener(element, Dom.Event.ON_CLICK, listener);
    };

    Dom.onDblclick = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DBLCLICK, listener);
    };

    Dom.onMouseOver = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEOVER, listener);
    };

    Dom.onMouseOut = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEOUT, listener);
    };

    Dom.onMouseDown = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEDOWN, listener);
    };

    Dom.onMouseUp = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEUP, listener);
    };

    Dom.onMouseEnter = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSEENTER, listener);
    };

    Dom.onMouseLeave = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_MOUSELEAVE, listener);
    };

    Dom.onDrag = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DRAG, listener);
    };

    Dom.onDragStart = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DRAGSTART, listener);
    };

    Dom.onDragEnd = function(element, listener) {
        return Dom.addListener(element, Dom.Event.ON_DRAGEND, listener);
    };


    Dom.hasListener = function (element, event, listener) {
        if (!element._event || !element._event[event]) {
            return false;
        }
        return _indexOf(element._event[event].keys, listener) != -1;
    };

    /* Dom Manipulation */

    Dom.find = function (selector) {
        return document.querySelectorAll(selector);
    };

    Dom.id = function (id) {
        return document.getElementById(id);
    };

    Dom.findByTagName = function (name) {
        return document.getElementsByTagName(name);
    };

    Dom.findByClass = function (name) {
        if (name.substring(0,1) == ".") {
            name = name.substring(1);
        }

        if (document.getElementsByClassName ) {
            return document.getElementsByClassName(name);
        }

        if(document.querySelector && document.querySelectorAll ) {
            return document.querySelectorAll("." + name);
        }
    };

    /* Dom Manipulation */

    Dom.css = function(element, style) {

        //get one element
        if (typeof style === "string") {
            return element.style[cssNameProperty(style)];
        }

        //get array of elements
        if (_isArray(style)) {
            var css = {};
            for (var i in style) {
                css[style[i]] = element.style[cssNameProperty(style[i])];
            }
            return css;
        }

        if (_isObject(style)) {
            //set csses
            for (var i in style) {
                element.style[cssNameProperty(i)] = style[i];
            }
            return style;
        }

        return false;
    };

    /**
     * Create dom element
     * @param string
     */
    Dom.create = function(string) {
        return document.createDocumentFragment(string);
    };

    /**
     *  Gets or sets innerHtml of element
     * @param element
     * @param string
     */
    Dom.html = function(element, string) {

        if (_isString(string)) {
            element.innerHTML = string;
            return string;
        }

        return element.innerHTML;
    };

    Dom.text = function(element, string) {

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

    Dom.parent = function(element) {

        return element.parentNode;
    };

    Dom.children = function(element) {

        return element.childNodes;
    };

    /**
     *
     * @param element
     * @param {String|HTMLElement} html
     */
    Dom.append = function(element, html) {

        if (_isString(html)) {
            html = Dom.create(html);
        }
        element.appendChild(html);
        return html;
    };

    Dom.prepend = function(element, html) {

        if (_isString(html)) {
            html = Dom.create(html);
        }
        element.insertBefore(html, element.firstChild);
        return html;
    };

    Dom.after = function(element, html) {

        if (_isString(html)) {
            html = Dom.create(html);
        }

        element.parentNode.insertBefore(html, element.nextSibling);
        return html;
    };

    Dom.before = function(element, html) {

        if (_isString(html)) {
            html = Dom.create(html);
        }

        element.insertBefore(html, element);
        return html;
    };

    Dom.next = function(element) {
        return element.nextSibling;
    };

    Dom.previous = function(element) {
        return element.previousSibling;
    };

    Dom.replace = function(element, html) {
        if (_isString(html)) {
            html = Dom.create(html);
        }
        element.parentNode.replaceChild(html, element);
        return html;
    };

    Dom.remove = function(element) {
        var parent = element.parentNode;
        return parent.removeChild(element);
    };

    /**
     * Gets or sets element attributes
     * if the attribute is not defined this method
     * return an empty string
     *
     * @param element
     * @param name
     * @param {*} attribute attribute name or names
     *
     * @example
     * Dom.attribute(el, "href"); // returns href attribute's value of the element
     * Dom.attribute(el, ["href", "target"]); //returns object of attributed of the element
     * Dom.attribute(el, {href: "#new"}); //sets href attribute's value
     */
    Dom.attribute = function(element, attribute)  {

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
        if (_isObject(attribute)) {
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

    //export dom
    window.Dom = Dom;

})(this, document);
