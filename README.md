# Triceratops Editor Core
![](./resources/triceratops.png)

[![Build Status](https://travis-ci.org/alessandroscarlatti/triceratops-editor-core.svg?branch=master)](https://travis-ci.org/alessandroscarlatti/triceratops-editor-core)


## Rules for Paths

Triceratops Editor will support JSON Path with mandatory `$` and `["key"]` notation.

type | slashes | dots | javascript accessors
-|-|- | -
full path | `/library/books/0/author/firstName` | `.library.books[0].author.firstName` | `$['library']['books'][0]['author']['firstName']`
root | `/` | `.` | `$`
special characters | `/library/booksByTitle/1/2 cup` | `.library.booksByTitle["1/2 cup"]` | `$['library']['booksByTitle']['1/2 cup']`

> What about paths that include special characters?  Using javascript accessor paths means that special characters are native to the language.

# `Editor:`

## `InternalController` is:

```
{
    "/asdf": instance controller for /asdf, could be an object, array, or value
    "/qwer": instance controller for /qwer, could be an object, array, or value
}
```

## for a `ValueController`:

method | side effect | logical response | response example | rationale
-|-|-|-|-
`type()` | none | type of this controller. One of `OBJ`, `ARR`, or `VAL`.  This could be shortened to `int` for comparison speed. | "VAL" | We want to know what kind of data this control thinks it is holding.
`path()` | none | path of this controller | "/asdf" | I would want to know the path that this controller thinks it is
`getValue()` | none | the value stored in the instance this controller represents.  Could be `undefined`, `null`, or real. | "hey!" | I would want to know the actual real value at the atomic level.
`setValue(value)` | stores `value` in the controller state | `void` or `Exception` | `void` | This will actually set the "value" at the controller path.
`getChildPaths()` | none | the direct child paths of this controller. | always `[]` | use the children
`numChildren()` | none | the number of direct children | always 0 | It will probably be useful to have a more convenient and more efficient method 
`getParentPath()` | none | return the path to the parent | "/" | This path should have a controller available in the lookup table.
`delete()` | this controller will no longer be connected to the rest of the controllers. | `void` or `Exception` | `void` | All methods called on the controller instance after this method should throw an `IllegalStateException`.  All references to external objects must be relinquished.
`setProperty(key, value)` | add the key and value to the custom data properties map for this controller, or update the value if the key already exists. | `void` | `void` | There may be a need to have custom stateful data within a controller.  But that data must also be able to persist across the controller being "moved".
`getProperty(key)` | none | return the custom value at this key | `undefined`, `null`, or real | We will want to be able to retrieve a custom property once it has been set.

## for an `ObjectController`:

method | side effect | logical response | response example | rationale
-|-|-|-|-
`type()` | none | type of this controller. One of `OBJ`, `ARR`, or `VAL`.  This could be shortened to `int` for comparison speed. | "OBJ" | We want to know what kind of data this control thinks it is holding.
`path()` | none | path of this controller | "/asdf" | I would want to know the path that this controller thinks it is`
`getValue()` | none | the value stored in the instance this controller represents.  Could be `undefined`, `null`, or real.  Since this is an object, it's not as simple as for a `ValueController`.  The "value" of an object controller is the compilation of all children instances, so it would have to be obtained **recursively.** | "hey!" | I would want to know the actual real value at the atomic level.
`setValue(value)` | stores `value` in the controller state... but what does it mean to "set the value" on an object controller, when other controllers actually own the child values?  We could take a **recursive approach** and delegate children to each child controller.  What impact would that have on some kind of validation of internal controller actions?  That would be difficult once this initial action triggers multiple actions further down the line.  **What if** the new value changes this field from an object to an array? | `void` or `Exception` | `void` | This will actually set the "value" at the controller path.  However, will we actually use this function at a low level?  Perhaps it's easier to ask: how else will I handle things like "change the value inside this object controller"?
`getChildPaths()` | none | the direct child paths of this controller. | ["/asdf","/qwer"] | use the children
`numChildren()` | none | the number of direct children | 2 | It will probably be useful to have a more convenient and more efficient method here than to always return all string paths, only to count the number of strings in the array.
`getParentPath()` | none | return the path to the parent | "/" | This path should have a controller available in the lookup table.
`delete()` | this controller will no longer be connected to the rest of the controllers.  All children must first be **recursively** deleted. | `void` or `Exception` | `void` | All methods called on the controller instance after this method should throw an `IllegalStateException`.  All references to external objects must be relinquished.
`setProperty(key, value)` | add the key and value to the custom data properties map for this controller, or update the value if the key already exists. | `void` | `void` | There may be a need to have custom stateful data within a controller.  But that data must also be able to persist across the controller being "moved".
`getProperty(key)` | none | return the custom value at this key | `undefined`, `null`, or real | We will want to be able to retrieve a custom property once it has been set.
