DOM.js
======

DOM.js is a lightweight, fast cross browser library for DOM traversal, manipulation and event handling.

Only 8KB!

API Reference
=============

### Dom.addListener (`element`, `event`, `listener`)

Attaches javascript listener to the element(s) for the given event type.

#### Parameters

 - `element` a DOMElement, NodeList or just an array with DOMElements
 - `event` a dom event name, eg. (`click`, `dblclick`, etc.)
 - `listener` a javascript function wich will be called when given event occurs

Dom.js also offers aliases for `Dom.addListener` function.
You can check list of aliases, explanation and event names below.

#### Example

---
```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Dom.addListener</title>
  <script src="../src/dom.js"></script>
</head>
<body>
    <div id="test">click me</div>
    <ul>
        <li><a href="#1">click me</a></li>
        <li><a href="#2">click me</a></li>
        <li><a href="#3">click me</a></li>
    </ul>

    <script type="text/javascript">
        //Attaching event listener to one element
        Dom.addListener(Dom.id('test'), 'click', function(event) {
          alert('element #test was clicked');
        });

        //Attaching event listener to many elements
        Dom.addListener(Dom.findByTagName('a'), 'click', function(event) {
          event.preventDefault();
          alert('element ' + this + ' was clicked');
        });
    </script>
</body>
</html>
```

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