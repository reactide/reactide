import {
  dom,
  roles,
} from 'aria-query';
import JSXAttributeMock from './JSXAttributeMock';
import JSXElementMock from './JSXElementMock';

const domElements = [...dom.keys()];

const pureInteractiveElements = domElements
  .filter(name => dom.get(name).interactive === true)
  .reduce((interactiveElements, name) => {
    interactiveElements[name] = [];
    return interactiveElements;
  }, {});

const interactiveElementsMap = {
  ...pureInteractiveElements,
  a: [
    {prop: 'href', value: '#'}
  ],
  area: [
    {prop: 'href', value: '#'}
  ],
  input: [
    {prop: 'type', value: 'text'}
  ],
};

const pureNonInteractiveElementsMap = domElements
  .filter(name => !dom.get(name).interactive)
  .reduce((nonInteractiveElements, name) => {
    nonInteractiveElements[name] = [];
    return nonInteractiveElements;
  }, {});

const nonInteractiveElementsMap = {
  ...pureNonInteractiveElementsMap,
  input: [
    {prop: 'type', value: 'hidden'}
  ],
};

const roleNames = [...roles.keys()];

const interactiveRoles = roleNames.filter(
  role => roles.get(role).interactive === true
);

const nonInteractiveRoles = roleNames.filter(
  role => roles.get(role).interactive === false
);

export function genInteractiveElements () {
  return Object.keys(interactiveElementsMap)
    .map(name => {
      const attributes = interactiveElementsMap[name].map(
        ({prop, value}) => JSXAttributeMock(prop, value)
      );
      return JSXElementMock(name, attributes);
    });
}

export function genInteractiveRoleElements () {
  return interactiveRoles.map(
    value => JSXElementMock('div', [
      JSXAttributeMock('role', value)
    ])
  );
}

export function genNonInteractiveElements () {
  return Object.keys(nonInteractiveElementsMap)
    .map(name => {
      const attributes = nonInteractiveElementsMap[name].map(
        ({prop, value}) => JSXAttributeMock(prop, value)
      );
      return JSXElementMock(name, attributes);
    });
}

export function genNonInteractiveRoleElements () {
  return nonInteractiveRoles.map(
    value => JSXElementMock('div', [
      JSXAttributeMock('role', value)
    ])
  );
}
