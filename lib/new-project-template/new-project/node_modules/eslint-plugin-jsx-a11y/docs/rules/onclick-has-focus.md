# onclick-has-focus

Enforce that visible elements with onClick handlers must be focusable. Visible means that it is not hidden from a screen reader. Examples of non-interactive elements are `div`, `section`, and `a` elements without a href prop. Elements which have click handlers but are not focusable can not be used by keyboard-only users.

To make an element focusable, you can either set the tabIndex property, or use an element type which is inherently focusable.

Elements that are inherently focusable are as follows:
- `<input>`, `<button>`, `<select>` and `<textarea>` elements which are not disabled
- `<a>` or `<area>` elements with an `href` attribute.

This rule will only test low-level DOM components, as we can not deterministically map wrapper JSX components to their correct DOM element.

## `tabIndex` of an element with role `gridcell`

Within a grid, a grid cell may itself be tabbable if it contains text content.
In this case apply a `tabIndex` of 0.

If the content of the grid cell is tabbable -- for example a button or link --
then apply a `tabIndex` of -1.

#### References
1. [AX_FOCUS_02](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_focus_02)
2. [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role#Keyboard_and_focus)

## Rule details

This rule takes no arguments.

### Succeed
```jsx
<!-- Good: div with onClick attribute is hidden from screen reader -->
<div aria-hidden onClick={() => void 0} />
<!-- Good: span with onClick attribute is in the tab order -->
<span onClick="doSomething();" tabIndex="0">Click me!</span>
<!-- Good: span with onClick attribute may be focused programmatically -->
<span onClick="doSomething();" tabIndex="-1">Click me too!</span>
<!-- Good: anchor element with href is inherently focusable -->
<a href="javascript:void(0);" onClick="doSomething();">Click ALL the things!</a>
<!-- Good: buttons are inherently focusable -->
<button onClick="doSomething();">Click the button :)</button>
```

### Fail
```jsx
<!-- Bad: span with onClick attribute has no tabindex -->
<span onclick="submitForm();">Submit</span>
<!-- Bad: anchor element without href is not focusable -->
<a onclick="showNextPage();">Next page</a>
```
