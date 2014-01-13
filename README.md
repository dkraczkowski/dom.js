DOM.js
======

DOM.js is a lightweight, fast cross browser library for DOM traversal, manipulation and event handling.

Only 10KB!

API Reference
=============

###Table of contents

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
    - [Dom.attribute](#domattributeelement-attribute)
    - [Dom.css](#domcsselement-style)
    - [Dom.getClass](#domgetclasselement)
    - [Dom.addClass](#domaddclasselement-classname)
    - [Dom.hasClass](#domhasclasselement-classname)
    - [Dom.removeClass](#domremoveclasselement-classname)
    - [Dom.create](#domcreatehtml)
    - [Dom.html]()
    - [Dom.text]()
    - [Dom.append]()
    - [Dom.prepend]()
    - [Dom.after]()
    - [Dom.before]()
    - [Dom.replace]()
    - [Dom.remove]()

 - Event handling
    - [Dom.addListener](#domaddlistener-element-event-listener)
    - [Dom.removeListener](#domremovelistener-element-event-listener)
    - [Dom.hasListener](#domhaslistener-element-event-listener)
    - [Dom.dispatch](#domdispatch-element-event-options)

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

### Dom.addClass(`element`, `className`)

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

### Dom.removeClass(`element`, `className`)

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

### Dom.copy(`html`)

Creates a copy of a node, and returns the clone.

#### Parameters
 - `html` html element

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

#### [Example](examples\dom.text.html)

### Dom.append(`element`, `html`)

Inserts content specified by the html argument at the end of HTMLElement

#### Parameters
 - `element` html element
 - `html` html string or element that will be inserted

#### [Example](examples\dom.append.html)

### Dom.prepend(`element`, `html`)

Inserts content specified by the html argument at the beginning of HTMLElement

#### Parameters
 - `element` html element
 - `html` html string or element that will be inserted

#### [Example](examples\dom.prepend.html)

#### Parameters
 - `html` string containings element's html
 - `className` class(es) that will be removed from the element's class attribute

#### [Example](examples/dom.removeclass.html)

### Dom.addListener (`element`, `event`, `listener`)

Attaches javascript listener to the element(s) for the given event type.

#### Parameters

 - `element` a DOMElement, NodeList or just an array with DOMElements
 - `event` a dom event name, eg. (`click`, `dblclick`, etc.)
 - `listener` a javascript function wich will be called when given event occurs

Dom.js also offers aliases for `Dom.addListener` function.
You can check list of aliases, explanation and event names [here](#dom-events).

#### [Example](examples/dom.addlistener.html)

### Dom.removeListener (`element`, `event`, `listener`)

Removes javascript listener from the element(s) for the given event type.

#### Parameters

 - `element` a DOMElement, NodeList or just an array with DOMElements
 - `event` a dom event name, eg. (`click`, `dblclick`, etc.)
 - `listener` a javascript function wich will be called when given event occurs

### Dom.dispatch (`element`, `event`, `options`)

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

###DOM Events

#### Mouse Events

#####`click` Dom.onClick(`element`, `listener`)
A pointing device button has been pressed and released on an element.

#####`dblclick` Dom.onDblClick(`element`, `listener`)
A pointing device button is clicked twice on an element.

#####`mouseover` Dom.onMouseOver(`element`, `listener`)
A pointing device is moved onto the element that has the listener attached or onto one of its children.

#####`mouseout` Dom.onMouseOut(`element`, `listener`)
A pointing device is moved off the element that has the listener attached or off one of its children.

#####`mousedown` Dom.onMouseOut(`element`, `listener`)
A pointing device button (usually a mouse) is pressed on an element.

#####`mouseup` Dom.onMouseUp(`element`, `listener`)
A pointing device button is released over an element.

#####`mouseenter` Dom.onMouseEnter(`element`, `listener`)
A pointing device is moved onto the element that has the listener attached.

#####`mouseleave` Dom.onMouseLeave(`element`, `listener`)
A pointing device is moved off the element that has the listener attached.

#####`mousemove` Dom.onMouseMove(`element`, `listener`)
A pointing device is moved over an element.


### Form Events

#####`focus` Dom.onFocus(`element`, `listener`)
An element has received focus (does not bubble).

#####`blur` Dom.onBlur(`element`, `listener`)
An element has lost focus (does not bubble).

#####`select` Dom.onSelect(`element`, `listener`)
Some text is input being selected.

#####`change` Dom.onChange(`element`, `listener`)
An element loses focus and its value changed since gaining focus.

#####`submit` Dom.onSubmit`element`, `listener`)
A form is submitted.

#####`reset` Dom.onReset(`element`, `listener`)
A form is reset.

### Keyboard Events

#####`keydown` Dom.onKeyDown(`element`, `listener`)
A key is pressed down.

#####`keyup` Dom.onKeyUp(`element`, `listener`)
A key is released.

#####`keypress` Dom.onKeyPress(`element`, `listener`)
A key is pressed down and that key normally produces a character value (use input instead).

### Drag Events

#####`drag` Dom.onDrag(`element`, `listener`)
An element or text selection is being dragged (every 350ms).

#####`dragstart` Dom.onDragStart(`element`, `listener`)
The user starts dragging an element or text selection.

#####`dragend` Dom.onDragEnd(`element`, `listener`)
A drag operation is being ended (by releasing a mouse button or hitting the escape key).

### UI Events

#####`load` Dom.onLoad(`element`, `listener`)
A resource and its dependent resources have finished loading.

#####`scroll` Dom.onScroll(`element`, `listener`)
The document view or an element has been scrolled.

#####`unload` Dom.onUnload(`element`, `listener`)
The document or a dependent resource is being unloaded.

#####`resize` Dom.onResize(`element`, `listener`)
The document view has been resized.