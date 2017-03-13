'use strict';

var _staticRequire = require('../core/staticRequire');

var _staticRequire2 = _interopRequireDefault(_staticRequire);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @fileoverview Rule to enforce new line after import not followed by another import.
 * @author Radek Benkel
 */

const log = (0, _debug2.default)('eslint-plugin-import:rules:newline-after-import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

function containsNodeOrEqual(outerNode, innerNode) {
  return outerNode.range[0] <= innerNode.range[0] && outerNode.range[1] >= innerNode.range[1];
}

function getScopeBody(scope) {
  if (scope.block.type === 'SwitchStatement') {
    log('SwitchStatement scopes not supported');
    return null;
  }

  const body = scope.block.body;

  if (body && body.type === 'BlockStatement') {
    return body.body;
  }

  return body;
}

function findNodeIndexInScopeBody(body, nodeToFind) {
  return body.findIndex(node => containsNodeOrEqual(node, nodeToFind));
}

function getLineDifference(node, nextNode) {
  return nextNode.loc.start.line - node.loc.end.line;
}

module.exports = {
  meta: {
    docs: {}
  },
  create: function (context) {
    let level = 0;
    const requireCalls = [];

    function checkForNewLine(node, nextNode, type) {
      if (getLineDifference(node, nextNode) < 2) {
        let column = node.loc.start.column;

        if (node.loc.start.line !== node.loc.end.line) {
          column = 0;
        }

        context.report({
          loc: {
            line: node.loc.end.line,
            column
          },
          message: `Expected empty line after ${ type } statement not followed by another ${ type }.`
        });
      }
    }

    function incrementLevel() {
      level++;
    }
    function decrementLevel() {
      level--;
    }

    return {
      ImportDeclaration: function (node) {
        const parent = node.parent;

        const nodePosition = parent.body.indexOf(node);
        const nextNode = parent.body[nodePosition + 1];

        if (nextNode && nextNode.type !== 'ImportDeclaration') {
          checkForNewLine(node, nextNode, 'import');
        }
      },
      CallExpression: function (node) {
        if ((0, _staticRequire2.default)(node) && level === 0) {
          requireCalls.push(node);
        }
      },
      'Program:exit': function () {
        log('exit processing for', context.getFilename());
        const scopeBody = getScopeBody(context.getScope());
        log('got scope:', scopeBody);

        requireCalls.forEach(function (node, index) {
          const nodePosition = findNodeIndexInScopeBody(scopeBody, node);
          log('node position in scope:', nodePosition);

          const statementWithRequireCall = scopeBody[nodePosition];
          const nextStatement = scopeBody[nodePosition + 1];
          const nextRequireCall = requireCalls[index + 1];

          if (nextRequireCall && containsNodeOrEqual(statementWithRequireCall, nextRequireCall)) {
            return;
          }

          if (nextStatement && (!nextRequireCall || !containsNodeOrEqual(nextStatement, nextRequireCall))) {

            checkForNewLine(statementWithRequireCall, nextStatement, 'require');
          }
        });
      },
      FunctionDeclaration: incrementLevel,
      FunctionExpression: incrementLevel,
      ArrowFunctionExpression: incrementLevel,
      BlockStatement: incrementLevel,
      ObjectExpression: incrementLevel,
      'FunctionDeclaration:exit': decrementLevel,
      'FunctionExpression:exit': decrementLevel,
      'ArrowFunctionExpression:exit': decrementLevel,
      'BlockStatement:exit': decrementLevel,
      'ObjectExpression:exit': decrementLevel
    };
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL25ld2xpbmUtYWZ0ZXItaW1wb3J0LmpzIl0sIm5hbWVzIjpbImxvZyIsImNvbnRhaW5zTm9kZU9yRXF1YWwiLCJvdXRlck5vZGUiLCJpbm5lck5vZGUiLCJyYW5nZSIsImdldFNjb3BlQm9keSIsInNjb3BlIiwiYmxvY2siLCJ0eXBlIiwiYm9keSIsImZpbmROb2RlSW5kZXhJblNjb3BlQm9keSIsIm5vZGVUb0ZpbmQiLCJmaW5kSW5kZXgiLCJub2RlIiwiZ2V0TGluZURpZmZlcmVuY2UiLCJuZXh0Tm9kZSIsImxvYyIsInN0YXJ0IiwibGluZSIsImVuZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNyZWF0ZSIsImNvbnRleHQiLCJsZXZlbCIsInJlcXVpcmVDYWxscyIsImNoZWNrRm9yTmV3TGluZSIsImNvbHVtbiIsInJlcG9ydCIsIm1lc3NhZ2UiLCJpbmNyZW1lbnRMZXZlbCIsImRlY3JlbWVudExldmVsIiwiSW1wb3J0RGVjbGFyYXRpb24iLCJwYXJlbnQiLCJub2RlUG9zaXRpb24iLCJpbmRleE9mIiwiQ2FsbEV4cHJlc3Npb24iLCJwdXNoIiwiZ2V0RmlsZW5hbWUiLCJzY29wZUJvZHkiLCJnZXRTY29wZSIsImZvckVhY2giLCJpbmRleCIsInN0YXRlbWVudFdpdGhSZXF1aXJlQ2FsbCIsIm5leHRTdGF0ZW1lbnQiLCJuZXh0UmVxdWlyZUNhbGwiLCJGdW5jdGlvbkRlY2xhcmF0aW9uIiwiRnVuY3Rpb25FeHByZXNzaW9uIiwiQXJyb3dGdW5jdGlvbkV4cHJlc3Npb24iLCJCbG9ja1N0YXRlbWVudCIsIk9iamVjdEV4cHJlc3Npb24iXSwibWFwcGluZ3MiOiI7O0FBS0E7Ozs7QUFFQTs7Ozs7O0FBUEE7Ozs7O0FBUUEsTUFBTUEsTUFBTSxxQkFBTSxpREFBTixDQUFaOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTQyxtQkFBVCxDQUE2QkMsU0FBN0IsRUFBd0NDLFNBQXhDLEVBQW1EO0FBQy9DLFNBQU9ELFVBQVVF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Y2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUnVsZSB0byBlbmZvcmNlIG5ldyBsaW5lIGFmdGVyIGltcG9ydCBub3QgZm9sbG93ZWQgYnkgYW5vdGhlciBpbXBvcnQuXG4gKiBAYXV0aG9yIFJhZGVrIEJlbmtlbFxuICovXG5cbmltcG9ydCBpc1N0YXRpY1JlcXVpcmUgZnJvbSAnLi4vY29yZS9zdGF0aWNSZXF1aXJlJ1xuXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBsb2cgPSBkZWJ1ZygnZXNsaW50LXBsdWdpbi1pbXBvcnQ6cnVsZXM6bmV3bGluZS1hZnRlci1pbXBvcnQnKVxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUnVsZSBEZWZpbml0aW9uXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBjb250YWluc05vZGVPckVxdWFsKG91dGVyTm9kZSwgaW5uZXJOb2RlKSB7XG4gICAgcmV0dXJuIG91dGVyTm9kZS5yYW5nZVswXSA8PSBpbm5lck5vZGUucmFuZ2VbMF0gJiYgb3V0ZXJOb2RlLnJhbmdlWzFdID49IGlubmVyTm9kZS5yYW5nZVsxXVxufVxuXG5mdW5jdGlvbiBnZXRTY29wZUJvZHkoc2NvcGUpIHtcbiAgICBpZiAoc2NvcGUuYmxvY2sudHlwZSA9PT0gJ1N3aXRjaFN0YXRlbWVudCcpIHtcbiAgICAgIGxvZygnU3dpdGNoU3RhdGVtZW50IHNjb3BlcyBub3Qgc3VwcG9ydGVkJylcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgY29uc3QgeyBib2R5IH0gPSBzY29wZS5ibG9ja1xuICAgIGlmIChib2R5ICYmIGJvZHkudHlwZSA9PT0gJ0Jsb2NrU3RhdGVtZW50Jykge1xuICAgICAgICByZXR1cm4gYm9keS5ib2R5XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvZHlcbn1cblxuZnVuY3Rpb24gZmluZE5vZGVJbmRleEluU2NvcGVCb2R5KGJvZHksIG5vZGVUb0ZpbmQpIHtcbiAgICByZXR1cm4gYm9keS5maW5kSW5kZXgoKG5vZGUpID0+IGNvbnRhaW5zTm9kZU9yRXF1YWwobm9kZSwgbm9kZVRvRmluZCkpXG59XG5cbmZ1bmN0aW9uIGdldExpbmVEaWZmZXJlbmNlKG5vZGUsIG5leHROb2RlKSB7XG4gIHJldHVybiBuZXh0Tm9kZS5sb2Muc3RhcnQubGluZSAtIG5vZGUubG9jLmVuZC5saW5lXG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIG1ldGE6IHtcbiAgICBkb2NzOiB7fSxcbiAgfSxcbiAgY3JlYXRlOiBmdW5jdGlvbiAoY29udGV4dCkge1xuICAgIGxldCBsZXZlbCA9IDBcbiAgICBjb25zdCByZXF1aXJlQ2FsbHMgPSBbXVxuXG4gICAgZnVuY3Rpb24gY2hlY2tGb3JOZXdMaW5lKG5vZGUsIG5leHROb2RlLCB0eXBlKSB7XG4gICAgICBpZiAoZ2V0TGluZURpZmZlcmVuY2Uobm9kZSwgbmV4dE5vZGUpIDwgMikge1xuICAgICAgICBsZXQgY29sdW1uID0gbm9kZS5sb2Muc3RhcnQuY29sdW1uXG5cbiAgICAgICAgaWYgKG5vZGUubG9jLnN0YXJ0LmxpbmUgIT09IG5vZGUubG9jLmVuZC5saW5lKSB7XG4gICAgICAgICAgY29sdW1uID0gMFxuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIGxvYzoge1xuICAgICAgICAgICAgbGluZTogbm9kZS5sb2MuZW5kLmxpbmUsXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgZW1wdHkgbGluZSBhZnRlciAke3R5cGV9IHN0YXRlbWVudCBub3QgZm9sbG93ZWQgYnkgYW5vdGhlciAke3R5cGV9LmAsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaW5jcmVtZW50TGV2ZWwoKSB7XG4gICAgICBsZXZlbCsrXG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlY3JlbWVudExldmVsKCkge1xuICAgICAgbGV2ZWwtLVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbjogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgY29uc3QgeyBwYXJlbnQgfSA9IG5vZGVcbiAgICAgICAgY29uc3Qgbm9kZVBvc2l0aW9uID0gcGFyZW50LmJvZHkuaW5kZXhPZihub2RlKVxuICAgICAgICBjb25zdCBuZXh0Tm9kZSA9IHBhcmVudC5ib2R5W25vZGVQb3NpdGlvbiArIDFdXG5cbiAgICAgICAgaWYgKG5leHROb2RlICYmIG5leHROb2RlLnR5cGUgIT09ICdJbXBvcnREZWNsYXJhdGlvbicpIHtcbiAgICAgICAgICBjaGVja0Zvck5ld0xpbmUobm9kZSwgbmV4dE5vZGUsICdpbXBvcnQnKVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgQ2FsbEV4cHJlc3Npb246IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKGlzU3RhdGljUmVxdWlyZShub2RlKSAmJiBsZXZlbCA9PT0gMCkge1xuICAgICAgICAgIHJlcXVpcmVDYWxscy5wdXNoKG5vZGUpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnUHJvZ3JhbTpleGl0JzogZnVuY3Rpb24gKCkge1xuICAgICAgICBsb2coJ2V4aXQgcHJvY2Vzc2luZyBmb3InLCBjb250ZXh0LmdldEZpbGVuYW1lKCkpXG4gICAgICAgIGNvbnN0IHNjb3BlQm9keSA9IGdldFNjb3BlQm9keShjb250ZXh0LmdldFNjb3BlKCkpXG4gICAgICAgIGxvZygnZ290IHNjb3BlOicsIHNjb3BlQm9keSlcblxuICAgICAgICByZXF1aXJlQ2FsbHMuZm9yRWFjaChmdW5jdGlvbiAobm9kZSwgaW5kZXgpIHtcbiAgICAgICAgICBjb25zdCBub2RlUG9zaXRpb24gPSBmaW5kTm9kZUluZGV4SW5TY29wZUJvZHkoc2NvcGVCb2R5LCBub2RlKVxuICAgICAgICAgIGxvZygnbm9kZSBwb3NpdGlvbiBpbiBzY29wZTonLCBub2RlUG9zaXRpb24pXG5cbiAgICAgICAgICBjb25zdCBzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwgPSBzY29wZUJvZHlbbm9kZVBvc2l0aW9uXVxuICAgICAgICAgIGNvbnN0IG5leHRTdGF0ZW1lbnQgPSBzY29wZUJvZHlbbm9kZVBvc2l0aW9uICsgMV1cbiAgICAgICAgICBjb25zdCBuZXh0UmVxdWlyZUNhbGwgPSByZXF1aXJlQ2FsbHNbaW5kZXggKyAxXVxuXG4gICAgICAgICAgaWYgKG5leHRSZXF1aXJlQ2FsbCAmJiBjb250YWluc05vZGVPckVxdWFsKHN0YXRlbWVudFdpdGhSZXF1aXJlQ2FsbCwgbmV4dFJlcXVpcmVDYWxsKSkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG5leHRTdGF0ZW1lbnQgJiZcbiAgICAgICAgICAgICAoIW5leHRSZXF1aXJlQ2FsbCB8fCAhY29udGFpbnNOb2RlT3JFcXVhbChuZXh0U3RhdGVtZW50LCBuZXh0UmVxdWlyZUNhbGwpKSkge1xuXG4gICAgICAgICAgICBjaGVja0Zvck5ld0xpbmUoc3RhdGVtZW50V2l0aFJlcXVpcmVDYWxsLCBuZXh0U3RhdGVtZW50LCAncmVxdWlyZScpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIEZ1bmN0aW9uRGVjbGFyYXRpb246IGluY3JlbWVudExldmVsLFxuICAgICAgRnVuY3Rpb25FeHByZXNzaW9uOiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIEFycm93RnVuY3Rpb25FeHByZXNzaW9uOiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIEJsb2NrU3RhdGVtZW50OiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIE9iamVjdEV4cHJlc3Npb246IGluY3JlbWVudExldmVsLFxuICAgICAgJ0Z1bmN0aW9uRGVjbGFyYXRpb246ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ0Z1bmN0aW9uRXhwcmVzc2lvbjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgICAnQXJyb3dGdW5jdGlvbkV4cHJlc3Npb246ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ0Jsb2NrU3RhdGVtZW50OmV4aXQnOiBkZWNyZW1lbnRMZXZlbCxcbiAgICAgICdPYmplY3RFeHByZXNzaW9uOmV4aXQnOiBkZWNyZW1lbnRMZXZlbCxcbiAgICB9XG4gIH0sXG59XG4iXX0=