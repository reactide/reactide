/* eslint-env jest */
/**
 * @fileoverview Enforce non-interactive elements have no interactive handlers.
 * @author Ethan Cohen
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import parserOptionsMapper from '../../__util__/parserOptionsMapper';
import rule from '../../../src/rules/no-static-element-interactions';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();

const errorMessage =
  'Visible, non-interactive elements should not have mouse or keyboard event listeners';

const expectedError = {
  message: errorMessage,
  type: 'JSXOpeningElement',
};

ruleTester.run('onclick-has-role', rule, {
  valid: [
    { code: '<div className="foo" />;' },
    { code: '<div className="foo" {...props} />;' },
    { code: '<div onClick={() => void 0} aria-hidden />;' },
    { code: '<div onClick={() => void 0} aria-hidden={true} />;' },
    { code: '<input type="text" onClick={() => void 0} />' },
    { code: '<input onClick={() => void 0} />' },
    { code: '<button onClick={() => void 0} className="foo" />' },
    { code: '<option onClick={() => void 0} className="foo" />' },
    { code: '<select onClick={() => void 0} className="foo" />' },
    { code: '<textarea onClick={() => void 0} className="foo" />' },
    { code: '<a tabIndex="0" onClick={() => void 0} />' },
    { code: '<a onClick={() => void 0} href="http://x.y.z" />' },
    { code: '<a onClick={() => void 0} href="http://x.y.z" tabIndex="0" />' },
    { code: '<input onClick={() => void 0} type="hidden" />;' },
    { code: '<TestComponent onClick={doFoo} />' },
    { code: '<Button onClick={doFoo} />' },
  ].map(parserOptionsMapper),
  invalid: [
    { code: '<div onClick={() => void 0} />;', errors: [expectedError] },
    {
      code: '<div onClick={() => void 0} role={undefined} />;',
      errors: [expectedError],
    },
    { code: '<div onClick={() => void 0} {...props} />;', errors: [expectedError] },
    { code: '<section onClick={() => void 0} />;', errors: [expectedError] },
    { code: '<main onClick={() => void 0} />;', errors: [expectedError] },
    { code: '<article onDblClick={() => void 0} />;', errors: [expectedError] },
    { code: '<header onKeyDown={() => void 0} />;', errors: [expectedError] },
    { code: '<footer onKeyPress={() => void 0} />;', errors: [expectedError] },
    {
      code: '<div onKeyUp={() => void 0} aria-hidden={false} />;',
      errors: [expectedError],
    },
    { code: '<a onClick={() => void 0} />', errors: [expectedError] },
  ].map(parserOptionsMapper),
});
