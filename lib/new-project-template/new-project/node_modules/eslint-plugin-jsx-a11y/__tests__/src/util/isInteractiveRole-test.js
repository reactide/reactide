/* eslint-env mocha */
import expect from 'expect';
import { elementType, getProp, getLiteralPropValue } from 'jsx-ast-utils';
import isInteractiveRole from '../../../src/util/isInteractiveRole';
import {
  genInteractiveRoleElements,
  genNonInteractiveRoleElements,
} from '../../../__mocks__/genInteractives';

describe('isInteractiveRole', () => {
  describe('JSX Components (no tagName)', () => {
    it('should identify them as interactive role elements', () => {
      expect(isInteractiveRole(undefined, []))
        .toBe(true);
    });
  });
  describe('elements with a non-interactive role', () => {
    genNonInteractiveRoleElements().forEach(
      ({ openingElement }) => {
        const attributes = openingElement.attributes;
        const role = getLiteralPropValue(getProp(attributes, 'role')).toLowerCase();
        it(`should not identify \`${role}\` as an interactive role element`, () => {
          expect(isInteractiveRole(
            elementType(openingElement),
            attributes,
          )).toBe(false);
        });
      },
    );
  });
  describe('elements without a role', () => {
    it('should not identify them as interactive role elements', () => {
      expect(isInteractiveRole('div', [])).toBe(false);
    });
  });
  describe('elements with an interactive role', () => {
    genInteractiveRoleElements().forEach(
      ({ openingElement }) => {
        const attributes = openingElement.attributes;
        const role = getLiteralPropValue(getProp(attributes, 'role')).toLowerCase();
        it(`should identify \`${role}\` as an interactive role element`, () => {
          expect(isInteractiveRole(
            elementType(openingElement),
            attributes,
          )).toBe(true);
        });
      },
    );
  });
});
