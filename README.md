DOM.js
======

DOM.js is a lightweight, fast cross browser (IE 8+, FF31+, SF5+, CH31+, OP24+) library for DOM traversal, manipulation and event handling.
Dom.js also includes drag library for simplify crossbrowser drag operations.

Only 5KB compressed and gzipped!

API Reference
=============

### Table of contents

 - DOM traversal
    - [Dom.find](#domfindselector)
    - [Dom.id](#domidid)
    - [Dom.findByTagName](#domfindbytagnametagname)
    - [Dom.findByClass](#domfindbyclassclassname)
    - [Dom.parent](#domparentelement)
    - [Dom.children](#domchildrenelement-tag)
    - [Dom.next](#domnextelement)
    - [Dom.previous](#dompreviouselement)


 - DOM manipulation
    - [Dom.offset](#domoffsetelement)
    - [Dom.width](#domwidthelement)
    - [Dom.height](#domheightelement)
    - [Dom.attribute](#domattributeelement-attribute)
    - [Dom.css](#domcsselement-style)
    - [Dom.getClass](#domgetclasselement)
    - [Dom.addClass](#domaddclasselement-classname)
    - [Dom.hasClass](#domhasclasselement-classname)
    - [Dom.removeClass](#domremoveclasselement-classname)
    - [Dom.create](#domcreatehtml)
    - [Dom.html](#domhtmlelement-html)
    - [Dom.text](#domtextelement-text)
    - [Dom.append](#domappendelement-html)
    - [Dom.prepend](#domprependelement-html)
    - [Dom.after](#domafterelement-html)
    - [Dom.before](#dombeforeelement-html)
    - [Dom.replace](#domreplaceelement-html)
    - [Dom.remove](#domremoveelement)
    - [Dom.template](#domtemplatetpl-hash)
    - [Dom.draggable](#domdraggableelement-options)

 - Utils
    - [Dom.requestAnimationFrame](#domrequestanimationframecallback)
    - [Dom.cancelAnimationFrame](#domcancelanimationframeid)
    - [Dom.isElement](#domiselementobject)
    - [Dom.isNode](#domisnodeobject)

 - Event handling
    - [Dom.addListener](#domaddlistener-elementnodelistarray-event-listener)
    - [Dom.removeListener](#domremovelistener-elementnodelistarray-event-listener)
    - [Dom.hasListener](#domhaslistener-element-event-listener)
    - [Dom.dispatch](#domdispatch-elementnodelistarray-event-options)

 - [Dom Events](#dom-events)
    - [Mouse Events](#mouse-events)
        - `click`
        - `dblclick`
        - `mouseover`
        - `mouseout`
        - `mousedown`
        - `mouseup`
        - `mouseenter`
        - `mouseleave`
        - `mousemove`
    - [Form Events](#form-events)
        - `focus`
        - `blur`
        - `select`
        - `change`
        - `submit`
        - `reset`
    - [Keyboard Events](#keyboard-events)
        - `keydown`
        - `keyup`
        - `keypress`

### Dom.find(`selector`)

Finds HTMLElements that match css pattern.

*Supported from IE 8.0, FF 3.5, Chrome 4.0, Safari 3.1*
**Partial support in IE8 is due to being limited to CSS 2.1 selectors as well as only supporting simple selectors (not descendant selectors like p a)**
#### Parameters
 - `selector` css seletor eg.(`ul > li`)

#### [Example](examples/dom.find.html)


### Dom.id(`id`)

Returns HTMLElement with given id

#### Parameters
 - `id` element's id

#### [Example](examples/dom.id.html)

### Dom.findByTagName(`tagName`)

Finds HTMLElements that match given tag name

#### Parameters
 - `tagName` tag's name eg.(a, span, div, etc)

#### [Example](examples/dom.findbytagname.html)

### Dom.findByClass(`className`)

Finds HTMLElements that match given class name

*Supported from IE 8.0, FF 3.5, Chrome 4.0, Safari 3.1*

#### Parameters
 - `className` css class name

#### [Example](examples/dom.findbyclassname.html)

### Dom.parent(`element`)

Gets the parent of the html element

#### Parameters
 - `element` html element

#### [Example](examples/dom.parent.html)

### Dom.children(`element`, `tag`)

Gets children elements of the html element

#### Parameters
 - `element` html element
 - `tag` determines whether text nodes should be returned or tells function to filter children by tagname

#### [Example](examples/dom.children.html)


### Dom.next(`element`)

Gets following sibling element of the HTMLElement

#### Parameters
 - `element` html element

#### [Example](examples/dom.next.html)

### Dom.previous(`element`)

Gets previous sibling element of the HTMLElement

#### Parameters
 - `element` html element

#### [Example](examples/dom.previous.html)

### Dom.offset(`element`)

Returns current coordinates of the element, relative to the document.
Returned object contains properties:
 - top
 - right
 - bottom
 - left
 - width
 - height

#### Parameters
 - `element` html element

#### [Example](examples/dom.offset.html)

### Dom.width(`element`)

Returns width of the element

#### Parameters
 - `element` html element

#### [Example](examples/dom.offset.html)

### Dom.height(`element`)

Returns height of the element

#### Parameters
 - `element` html element

#### [Example](examples/dom.offset.html)

### Dom.attribute(`element`, `attribute`)

Gets or sets element's attribute(s) if the attribute(s) is not defined this method returns an empty string

#### Parameters
 - `element` html element
 - `attribute` attribute name, array of attribute names or object

#### [Example](examples/dom.attribute.html)

### Dom.css(`element`, `style`)

Sets or gets HTMLElement's style

#### Parameters
 - `element` html element
 - `style` css property name, array of css properties or object

#### [Example](examples/dom.css.html)

### Dom.getClass(`element`)

Gets css classes of the given element

#### Parameters
 - `element` html element

#### [Example](examples/dom.getclass.html)

### Dom.addClass(`element|nodeList|Array`, `className`)

Assignes css class(es) to the html element(s)

#### Parameters
 - `element` html element or array of elements
 - `className` class(es) that will be assigned to the element

#### [Example](examples/dom.addclass.html)

### Dom.hasClass(`element`, `className`)

Checks whether html element is assigned to the given class(es)

#### Parameters
 - `element` html element or array of elements
 - `className` class that function will check against

#### [Example](examples/dom.hasclass.html)

### Dom.removeClass(`element|nodeList|Array`, `className`)

Removes html element's assignment to the css class(es)

#### Parameters
 - `element` html element or array of elements
 - `className` class(es) that will be removed from the element's class attribute

#### [Example](examples/dom.removeclass.html)

### Dom.create(`html`)

Creates and returns html element created from provided content

#### Parameters
 - `html` html string

#### [Example](examples/dom.create.html)

### Dom.copy(`element`)

Creates a copy of a node, and returns the clone.

#### Parameters
 - `element` html element

#### [Example](examples/dom.copy.html)

### Dom.html(`element` `html`)

Gets or sets inner html of HTMLElement

#### Parameters
 - `element` html element
 - `html` html string

#### [Example](examples/dom.html.html)

### Dom.text(`element`, `text`)

Gets or sets text value of the HTML element

#### Parameters
 - `element` html element
 - `text` text string

#### [Example](examples/dom.text.html)

### Dom.append(`element`, `html`)

Inserts content specified by the html argument at the end of HTMLElement

#### Parameters
 - `element` html element
 - `html` html string or element that will be inserted

#### [Example](examples/dom.append.html)

### Dom.prepend(`element`, `html`)

Inserts content specified by the html argument at the beginning of HTMLElement

#### Parameters
 - `element` html element
 - `html` html string or element that will be inserted

#### [Example](examples/dom.prepend.html)

### Dom.after(`element`, `html`)

Inserts content specified by the html argument after the HTMLElement

#### Parameters
 - `element` html element after which html content will be placed
 - `html` html string or element that will be inserted

#### [Example](examples/dom.after.html)

### Dom.before(`element`, `html`)

Inserts content specified by the html argument before the HTMLElement

#### Parameters
 - `element` html element before which html content will be placed
 - `html` html string or element that will be inserted

#### [Example](examples/dom.before.html)

### Dom.replace(`element`, `html`)

Replaces given html element with content specified in html parameter

#### Parameters
 - `element` html element that will be replaced
 - `html` html string or element that will be inserted

#### [Example](examples/dom.replace.html)

### Dom.remove(`element`)

Removes HTMLElement from dom tree

#### Parameters
 - `element` html element that will be removed

#### [Example](examples/dom.remove.html)

#### Parameters
 - `html` string containings element's html
 - `className` class(es) that will be removed from the element's class attribute

#### [Example](examples/dom.removeclass.html)

### Dom.template(`tpl`, `hash`)

Parses micro template string. Replaces `{{ tag }}` occurrences in string into values taken
from hash object. Supports functions, numbers and strings.

#### Parameters
 - `tpl` micro template string
 - `hash` hash object

#### [Example](examples/dom.template.html)

### Dom.draggable(`element`, `options`)

Makes html element draggable.

#### Parameters
 - `element` html element
 - `options` options hash

#### Options
 - `axis` _String_ (`x` or `y`) constrains movement to x or y axis
 - `grid` _Array_ ([`x`, `y`]) snaps the element to a grid
 - `handler` _HTMLElement_ specifies on what element the drag starts
 - `onDragStart` sets callback function which will be called when drag starts
 - `onDragMove` sets callback function which will be called when dragged elements move
 - `onDragEnd` sets callback function which will be called when drag ends
 - `constrain` _HTMLElement_ constrains movement to element's area or given box `[x0, y0, width, height]`

#### [Example](examples/dom.draggable.html)



### Dom.requestAnimationFrame(`callback`)

The Window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes as an argument a callback to be invoked before the repaint.
[learn more](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame)

### Dom.cancelAnimationFrame(`id`)

Cancels an animation frame request previously scheduled through a call to `Dom.requestAnimationFrame`
[learn more](https://developer.mozilla.org/en-US/docs/Web/API/Window.cancelAnimationFrame)

### Dom.isElement(`object`)

Checks if given object is a DOMElement.

#### Parameters

 - `object` input object

### Dom.isNode(`object`)

Checks if given object is a DOMNode.

#### Parameters

 - `object` input object

### Dom.addListener (`element|nodeList|Array`, `event`, `listener`)

Attaches javascript listener to the element(s) for the given event type.

#### Parameters

 - `element` a DOMElement, NodeList or just an array with DOMElements
 - `event` a dom event name, eg. (`click`, `dblclick`, etc.)
 - `listener` a javascript function wich will be called when given event occurs

Dom.js also offers aliases for `Dom.addListener` function.
You can check list of aliases, explanation and event names [here](#dom-events).

#### [Example](examples/dom.addlistener.html)

### Dom.removeListener (`element|nodeList|Array`, `event`, `listener`)

Removes javascript listener from the element(s) for the given event type.

#### Parameters

 - `element` a DOMElement, NodeList or just an array with DOMElements
 - `event` a dom event name, eg. (`click`, `dblclick`, etc.)
 - `listener` a javascript function wich will be called when given event occurs

### Dom.dispatch (`element|nodeList|Array`, `event`, `options`)

Execute all handlers and behaviors attached to the element(s) for the given event type

#### Parameters

 - `element` a DOMElement, NodeList or just an array with DOMElements
 - `event` a dom event name, eg. (`click`, `dblclick`, etc.)
 - `options` event options object eg. (`screenX`, `screenY`, etc.)

### Dom.hasListener (`element`, `event`, `listener`)

Determine whether a supplied listener is attached to the element

#### Parameters

 - `element` a DOMElement, NodeList or just an array with DOMElements
 - `event` a dom event name, eg. (`click`, `dblclick`, etc.)
 - `listener` a javascript callback function

### DOM Events

#### Mouse Events

##### `click` Dom.onClick(`element|nodeList|Array`, `listener`)
A pointing device button has been pressed and released on an element.

##### `dblclick` Dom.onDblClick(`element|nodeList|Array`, `listener`)
A pointing device button is clicked twice on an element.

##### `mouseover` Dom.onMouseOver(`element|nodeList|Array`, `listener`)
A pointing device is moved onto the element that has the listener attached or onto one of its children.

##### `mouseout` Dom.onMouseOut(`element|nodeList|Array`, `listener`)
A pointing device is moved off the element that has the listener attached or off one of its children.

##### `mousedown` Dom.onMouseOut(`element|nodeList|Array`, `listener`)
A pointing device button (usually a mouse) is pressed on an element.

##### `mouseup` Dom.onMouseUp(`element|nodeList|Array`, `listener`)
A pointing device button is released over an element.

##### `mouseenter` Dom.onMouseEnter(`element|nodeList|Array`, `listener`)
A pointing device is moved onto the element that has the listener attached.

##### `mouseleave` Dom.onMouseLeave(`element|nodeList|Array`, `listener`)
A pointing device is moved off the element that has the listener attached.

##### `mousemove` Dom.onMouseMove(`element|nodeList|Array`, `listener`)
A pointing device is moved over an element.


### Form Events

##### `focus` Dom.onFocus(`element|nodeList|Array`, `listener`)
An element has received focus (does not bubble).

##### `blur` Dom.onBlur(`element|nodeList|Array`, `listener`)
An element has lost focus (does not bubble).

##### `select` Dom.onSelect(`element|nodeList|Array`, `listener`)
Some text is input being selected.

##### `change` Dom.onChange(`element|nodeList|Array`, `listener`)
An element loses focus and its value changed since gaining focus.

##### `submit` Dom.onSubmit`element|nodeList|Array`, `listener`)
A form is submitted.

##### `reset` Dom.onReset(`element|nodeList|Array`, `listener`)
A form is reset.

### Keyboard Events

##### `keydown` Dom.onKeyDown(`element|nodeList|Array`, `listener`)
A key is pressed down.

##### `keyup` Dom.onKeyUp(`element|nodeList|Array`, `listener`)
A key is released.

##### `keypress` Dom.onKeyPress(`element|nodeList|Array`, `listener`)
A key is pressed down and that key normally produces a character value (use input instead).

### Drag Events

##### `drag` Dom.onDrag(`element|nodeList|Array`, `listener`)
An element or text selection is being dragged (every 350ms).

##### `dragstart` Dom.onDragStart(`element|nodeList|Array`, `listener`)
The user starts dragging an element or text selection.

##### `dragend` Dom.onDragEnd(`element|nodeList|Array`, `listener`)
A drag operation is being ended (by releasing a mouse button or hitting the escape key).

### UI Events

##### `load` Dom.onLoad(`element|nodeList|Array`, `listener`)
A resource and its dependent resources have finished loading.

##### `scroll` Dom.onScroll(`element|nodeList|Array`, `listener`)
The document view or an element has been scrolled.

##### `unload` Dom.onUnload(`element|nodeList|Array`, `listener`)
The document or a dependent resource is being unloaded.

##### `resize` Dom.onResize(`element|nodeList|Array`, `listener`)
The document view has been resized.
