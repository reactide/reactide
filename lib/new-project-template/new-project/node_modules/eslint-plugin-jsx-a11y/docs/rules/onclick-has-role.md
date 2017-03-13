# onclick-has-role

Enforce visible, non-interactive elements with click handlers use role attribute. Visible means that it is not hidden from a screen reader. Examples of non-interactive elements are `div`, `section`, and `a` elements without a href prop. The purpose of the role attribute is to identify to screenreaders the exact function of an element. This rule will only test low-level DOM components, as we can not deterministically map wrapper JSX components to their correct DOM element.

In cases where a non-interactive element has a handler, but does not map to an interactive role such as `button` or `link` -- for example a `div` container that catches bubbled click events -- `onclick-has-role` may be satisfied by providing a role value of `presentation`. This indicates that the element has no semantic value. A role like `button` or `link` should only be applied when the non-interactive element truly represents such a UI element.

#### References
1. [MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role#Keyboard_and_focus)

## Rule details

This rule takes no arguments.

### Succeed
```jsx
<div onClick={() => void 0} role="button" />
<div onClick={() => void 0} role="presentation" />
<input type="text" onClick={() => void 0} /> // Interactive element does not require role.
<a tabIndex="0" onClick={() => void 0} /> // tabIndex makes this interactive.
<button onClick={() => void 0} className="foo" /> // button is interactive.
<div onClick={() => void 0} role="button" aria-hidden /> // This is hidden from screenreader.
<Input onClick={() => void 0} type="hidden" /> // This is a higher-level DOM component
```

### Fail
```jsx
<div onClick={() => void 0} />
<div onClick={() => void 0} {...props} />
<div onClick={() => void 0} aria-hidden={false} />
<a onClick={() => void 0} />
```
