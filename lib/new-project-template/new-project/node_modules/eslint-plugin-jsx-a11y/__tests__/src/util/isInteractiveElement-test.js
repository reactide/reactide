/* eslint-env mocha */
import expect from 'expect';
import { elementType } from 'jsx-ast-utils';
import isInteractiveElement from '../../../src/util/isInteractiveElement';
import {
  genInteractiveElements,
  genNonInteractiveElements,
} from '../../../__mocks__/genInteractives';

describe('isInteractiveElement', () => {
  describe('JSX Components (no tagName)', () => {
    it('should identify them as interactive elements', () => {
      expect(isInteractiveElement(undefined, []))
        .toBe(true);
    });
  });
  describe('non-interactive elements', () => {
    genNonInteractiveElements().forEach(
      ({ openingElement }) => {
        it(`should not identify \`${openingElement.name.name}\` as an interactive element`, () => {
          expect(isInteractiveElement(
            elementType(openingElement),
            openingElement.attributes,
          )).toBe(false);
        });
      },
    );
  });
  describe('interactive elements', () => {
    genInteractiveElements().forEach(
      ({ openingElement }) => {
        it(`should identify \`${openingElement.name.name}\` as an interactive element`, () => {
          expect(isInteractiveElement(
            elementType(openingElement),
            openingElement.attributes,
          )).toBe(true);
        });
      },
    );
  });
});
