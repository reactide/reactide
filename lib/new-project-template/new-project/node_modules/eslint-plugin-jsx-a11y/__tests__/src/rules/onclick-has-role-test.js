/* eslint-env jest */
/**
 * @fileoverview Enforce non-interactive elements with click handlers use role attribute.
 * @author Ethan Cohen
 */

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

import { RuleTester } from 'eslint';
import parserOptionsMapper from '../../__util__/parserOptionsMapper';
import rule from '../../../src/rules/onclick-has-role';

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

const ruleTester = new RuleTester();

const expectedError = {
  message: 'Visible, non-interactive elements with click ' +
  'handlers must have role attribute.',
  type: 'JSXOpeningElement',
};

ruleTester.run('onclick-has-role', rule, {
  valid: [
    { code: '<div onClick={() => void 0} role="button" />;' },
    { code: '<div onClick={() => void 0} role={role} />;' },
    { code: '<div onClick={() => void 0} role={"button"} />;' },
    { code: '<div onClick={() => void 0} role={`${role}`} />;' },
    { code: '<div onClick={() => void 0} role="button" {...props} />;' },
    { code: '<div className="foo" />;' },
    { code: '<div onClick={() => void 0} role="button" aria-hidden />;' },
    { code: '<div onClick={() => void 0} role="button" aria-hidden={true} />;' },
    { code: '<div onClick={() => void 0} role="button" aria-hidden={false} />;' },
    { code: '<div onClick={() => void 0} role="button" aria-hidden={undefined} />;' },
    { code: '<input type="text" onClick={() => void 0} />' },
    { code: '<input onClick={() => void 0} />' },
    { code: '<button onClick={() => void 0} className="foo" />' },
    { code: '<option onClick={() => void 0} className="foo" />' },
    { code: '<select onClick={() => void 0} className="foo" />' },
    { code: '<textarea onClick={() => void 0} className="foo" />' },
    { code: '<a tabIndex="0" onClick={() => void 0} />' },
    { code: '<a role="button" onClick={() => void 0} />' },
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
    { code: '<article onClick={() => void 0} />;', errors: [expectedError] },
    { code: '<header onClick={() => void 0} />;', errors: [expectedError] },
    { code: '<footer onClick={() => void 0} />;', errors: [expectedError] },
    {
      code: '<div onClick={() => void 0} aria-hidden={false} />;',
      errors: [expectedError],
    },
    { code: '<a onClick={() => void 0} />', errors: [expectedError] },
  ].map(parserOptionsMapper),
});
