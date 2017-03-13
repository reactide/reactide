# label-has-for

Enforce label tags have htmlFor attribute. Form controls using a label to identify them must have only one label that is programmatically associated with the control using: label htmlFor=[ID of control].

## Rule details

This rule takes one optional object argument of type object:

```json
{
    "rules": {
        "jsx-a11y/label-has-for": [ 2, {
            "components": [ "Label" ],
          }],
    }
}
```

For the `components` option, these strings determine which JSX elements (**always including** `<label>`) should be checked for having `htmlFor` prop. This is a good use case when you have a wrapper component that simply renders a `label` element (like in React):

```js
// Label.js
const Label = props => {
  const {
    htmlFor,
    ...otherProps
  } = props;

  return (
    <label htmlFor={htmlFor} {...otherProps} />
  );
}

...

// CreateAccount.js (for example)
...
return (
  <form>
    <input id="firstName" type="text" />
    <Label htmlFor="firstName">First Name</Label>
  </form>
);
```

Note that passing props as spread attribute without `htmlFor` explicitly defined will cause this rule to fail. Explicitly pass down `htmlFor` prop for rule to pass. The prop must have an actual value to pass. Use `Label` component above as a reference. **It is a good thing to explicitly pass props that you expect to be passed for self-documentation.** For example:

#### Bad
```jsx
function Foo(props) {
  return <label {...props} />
}
```

#### Good
```jsx
function Foo({ htmlFor, ...props}) {
    return <label htmlFor={htmlFor} {...props} />
}

// OR

function Foo(props) {
    const {
        htmlFor,
        ...otherProps
    } = props;

   return <label htmlFor={htmlFor} {...otherProps} />
}
```

### Succeed
```jsx
<input type="text" id="firstName" />
<label htmlFor="firstName">First Name</label>
```

### Fail
```jsx
<input type="text" id="firstName" />
<label>First Name</label>
```
