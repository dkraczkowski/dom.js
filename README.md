DOM.js
======

DOM.js is a lightweight, fast cross browser library for DOM traversal, manipulation and event handling.

Only 8KB!

API Reference
=============

### Dom.addListener (`element`, `event`, `listener`)

Attaches javascript listener to the element(s) for the given event type.

 - `element` a DOMElement, NodeList or just an array with DOMElements
 - `event` a dom event name, eg. (`click`, `dblclick`, etc.)
 - `listener` a javascript function wich will be called when given event occurs

Dom.js also offers aliases for `Dom.addListener` function.
You can check list of aliases, explanation and event names below.

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

#####`drag` Dom.onDrag(`element`, `listener`)
An element or text selection is being dragged (every 350ms).

#####`dragstart` Dom.onDragStart(`element`, `listener`)
The user starts dragging an element or text selection.

#####`dragend` Dom.onDragEnd(`element`, `listener`)
A drag operation is being ended (by releasing a mouse button or hitting the escape key).

#####`focus` Dom.onFocus(`element`, `listener`)
An element has received focus (does not bubble).

#####`blur` Dom.onBlur(`element`, `listener`)
An element has lost focus (does not bubble).





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


### Dom.dispatch (`element`, `type`, `options`)

Execute all handlers and behaviors attached to the element(s) for the given event type

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
<ul>
    <li><a href="#1">click me</a></li>
    <li><a href="#2">click me</a></li>
    <li><a href="#3">click me</a></li>
</ul>

<script type="text/javascript">

    //Attaching event listener to many elements
    Dom.addListener(Dom.findByTagName('a'), Dom.Event.ON_CLICK, function(event) {
        event.preventDefault();
        alert('element ' + this + ' was clicked');
    });

    //Dispatching click event
    Dom.dispatch(Dom.findByTagName('a'), Dom.Event.ON_CLICK);
</script>
</body>
</html>
```