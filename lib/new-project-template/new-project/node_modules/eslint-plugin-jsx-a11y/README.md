<p align="center">
  <a href="https://travis-ci.org/evcohen/eslint-plugin-jsx-a11y">
    <img src="https://api.travis-ci.org/evcohen/eslint-plugin-jsx-a11y.svg?branch=master"
         alt="build status">
  </a>
  <a href="https://npmjs.org/package/eslint-plugin-jsx-a11y">
    <img src="https://img.shields.io/npm/v/eslint-plugin-jsx-a11y.svg"
         alt="npm version">
  </a>
  <a href="https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/eslint-plugin-jsx-a11y.svg"
         alt="license">
  </a>
  <a href='https://coveralls.io/github/evcohen/eslint-plugin-jsx-a11y?branch=master'>
    <img src='https://coveralls.io/repos/github/evcohen/eslint-plugin-jsx-a11y/badge.svg?branch=master' alt='Coverage Status' />
  </a>
  <a href='https://npmjs.org/package/eslint-plugin-jsx-a11y'>
    <img src='https://img.shields.io/npm/dt/eslint-plugin-jsx-a11y.svg'
    alt='Total npm downloads' />
  </a>
</p>

# eslint-plugin-jsx-a11y

Static AST checker for accessibility rules on JSX elements.

## Why?
Ryan Florence built out this awesome runtime-analysis tool called [react-a11y](https://github.com/reactjs/react-a11y). It is super useful. However, since you're probably already using linting in your project, this plugin comes for free and closer to the actual development process. Pairing this plugin with an editor lint plugin, you can bake accessibility standards into your application in real-time.

**Note**: This project does not *replace* react-a11y, but can and should be used in conjunction with it. Static analysis tools cannot determine values of variables that are being placed in props before runtime, so linting will not fail if that value is undefined and/or does not pass the lint rule.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```sh
# npm
npm install eslint --save-dev

# yarn
yarn add eslint --dev
```

Next, install `eslint-plugin-jsx-a11y`:

```sh
# npm
npm install eslint-plugin-jsx-a11y --save-dev

# yarn
yarn add eslint-plugin-jsx-a11y --dev
```

**Note:** If you installed ESLint globally (using the `-g` flag in npm, or the `global` prefix in yarn) then you must also install `eslint-plugin-jsx-a11y` globally.

## Usage

Add `jsx-a11y` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": [
    "jsx-a11y"
  ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "jsx-a11y/rule-name": 2
  }
}
```


You can also enable all the recommended rules at once. Add `plugin:jsx-a11y/recommended` in `extends`:

```json
{
  "extends": {
    "plugin:jsx-a11y/recommended"
  }
}
```


## Supported Rules

- [accessible-emoji](docs/rules/accessible-emoji.md): Enforce emojis are wrapped in <span> and provide screenreader access.
- [anchor-has-content](docs/rules/anchor-has-content.md): Enforce all anchors to contain accessible content.
- [aria-activedescendant-has-tabindex](docs/rules/aria-activedescendant-has-tabindex.md): Enforce elements with aria-activedescendant are tabbable.
- [aria-props](docs/rules/aria-props.md): Enforce all `aria-*` props are valid.
- [aria-proptypes](docs/rules/aria-proptypes.md): Enforce ARIA state and property values are valid.
- [aria-role](docs/rules/aria-role.md): Enforce that elements with ARIA roles must use a valid, non-abstract ARIA role.
- [aria-unsupported-elements](docs/rules/aria-unsupported-elements.md): Enforce that elements that do not support ARIA roles, states, and properties do not have those attributes.
- [click-events-have-key-events](docs/rules/click-events-have-key-events.md): Enforce a clickable non-interactive element has at least one keyboard event listener.
- [heading-has-content](docs/rules/heading-has-content.md): Enforce heading (`h1`, `h2`, etc) elements contain accessible content.
- [href-no-hash](docs/rules/href-no-hash.md): Enforce an anchor element's `href` prop value is not just `#`.
- [html-has-lang](docs/rules/html-has-lang.md): Enforce `<html>` element has `lang` prop.
- [iframe-has-title](docs/rules/iframe-has-title.md): Enforce iframe elements have a title attribute.
- [img-has-alt](docs/rules/img-has-alt.md): Enforce that `<img>` JSX elements use the `alt` prop.
- [img-redundant-alt](docs/rules/img-redundant-alt.md): Enforce `<img>` alt prop does not contain the word "image", "picture", or "photo".
- [label-has-for](docs/rules/label-has-for.md): Enforce that `<label>` elements have the `htmlFor` prop.
- [lang](docs/rules/lang.md): Enforce lang attribute has a valid value.
- [mouse-events-have-key-events](docs/rules/mouse-events-have-key-events.md): Enforce that `onMouseOver`/`onMouseOut` are accompanied by `onFocus`/`onBlur` for keyboard-only users.
- [no-access-key](docs/rules/no-access-key.md): Enforce that the `accessKey` prop is not used on any element to avoid complications with keyboard commands used by a screenreader.
- [no-autofocus](docs/rules/no-autofocus.md): Enforce autoFocus prop is not used.
- [no-distracting-elements](docs/rules/no-distracting-elements.md): Enforce distracting elements are not used.
- [no-onchange](docs/rules/no-onchange.md): Enforce usage of `onBlur` over `onChange` on select menus for accessibility.
- [no-redundant-roles](docs/rules/no-redundant-roles.md): Enforce explicit role property is not the same as implicit/default role property on element.
- [no-static-element-interactions](docs/rules/no-static-element-interactions.md): Enforce non-interactive elements have no interactive handlers.
- [onclick-has-focus](docs/rules/onclick-has-focus.md): Enforce that elements with `onClick` handlers must be focusable.
- [onclick-has-role](docs/rules/onclick-has-role.md): Enforce that non-interactive, visible elements (such as `<div>`) that have click handlers use the role attribute.
- [role-has-required-aria-props](docs/rules/role-has-required-aria-props.md): Enforce that elements with ARIA roles must have all required attributes for that role.
- [role-supports-aria-props](docs/rules/role-supports-aria-props.md): Enforce that elements with explicit or implicit roles defined contain only `aria-*` properties supported by that `role`.
- [scope](docs/rules/scope.md): Enforce `scope` prop is only used on `<th>` elements.
- [tabindex-no-positive](docs/rules/tabindex-no-positive.md): Enforce `tabIndex` value is not greater than zero.

## Creating a new rule

If you are developing new rules for this project, you can use the `create-rule`
script to scaffold the new files.

```
$ ./scripts/create-rule.js my-new-rule
```

## License

eslint-plugin-jsx-a11y is licensed under the [MIT License](LICENSE.md).
