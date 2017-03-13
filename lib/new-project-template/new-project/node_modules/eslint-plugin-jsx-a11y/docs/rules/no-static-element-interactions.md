# no-static-element-interactions

Enforce non-interactive DOM elements have no interactive handlers. Static elements such as `<div>` and `<span>` should not have mouse/keyboard event listeners. Instead use something more semantic, such as a button or a link.

Valid interactive elements are:
  - `<a>` elements with `href` or `tabIndex` props
  - `<button>` elements
  - `<input>` elements that are not `hidden`
  - `<select>` and `<option>` elements
  - `<textarea>` elements
  - `<area>` elements

## Rule details

This rule takes no arguments.

### Succeed
```jsx
<button onClick={() => {}} className="foo" />
<div className="foo" {...props} />
<input type="text" onClick={() => {}} />
```

### Fail
```jsx
<div onClick={() => {}} />
```
