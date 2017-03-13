'use strict';

module.exports = {
  meta: {
    docs: {}
  },

  create: function (context) {
    let specifierExportCount = 0;
    let hasDefaultExport = false;
    let hasStarExport = false;
    let namedExportNode = null;

    return {
      'ExportSpecifier': function (node) {
        if (node.exported.name === 'default') {
          hasDefaultExport = true;
        } else {
          specifierExportCount++;
          namedExportNode = node;
        }
      },

      'ExportNamedDeclaration': function (node) {
        // if there are specifiers, node.declaration should be null
        if (!node.declaration) return;

        function captureDeclaration(identifierOrPattern) {
          if (identifierOrPattern.type === 'ObjectPattern') {
            // recursively capture
            identifierOrPattern.properties.forEach(function (property) {
              captureDeclaration(property.value);
            });
          } else {
            // assume it's a single standard identifier
            specifierExportCount++;
          }
        }

        if (node.declaration.declarations) {
          node.declaration.declarations.forEach(function (declaration) {
            captureDeclaration(declaration.id);
          });
        } else {
          // captures 'export function foo() {}' syntax
          specifierExportCount++;
        }

        namedExportNode = node;
      },

      'ExportDefaultDeclaration': function () {
        hasDefaultExport = true;
      },

      'ExportAllDeclaration': function () {
        hasStarExport = true;
      },

      'Program:exit': function () {
        if (specifierExportCount === 1 && !hasDefaultExport && !hasStarExport) {
          context.report(namedExportNode, 'Prefer default export.');
        }
      }
    };
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL3ByZWZlci1kZWZhdWx0LWV4cG9ydC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjcmVhdGUiLCJjb250ZXh0Iiwic3BlY2lmaWVyRXhwb3J0Q291bnQiLCJoYXNEZWZhdWx0RXhwb3J0IiwiaGFzU3RhckV4cG9ydCIsIm5hbWVkRXhwb3J0Tm9kZSIsIm5vZGUiLCJleHBvcnRlZCIsIm5hbWUiLCJkZWNsYXJhdGlvbiIsImNhcHR1cmVEZWNsYXJhdGlvbiIsImlkZW50aWZpZXJPclBhdHRlcm4iLCJ0eXBlIiwicHJvcGVydGllcyIsImZvckVhY2giLCJwcm9wZXJ0eSIsInZhbHVlIiwiZGVjbGFyYXRpb25zIiwiaWQiLCJyZXBvcnQiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTTtBQURGLEdBRFM7O0FBS2ZDLFVBQVEsVUFBU0MsT0FBVCxFQUFrQjtBQUN4QixRQUFJQyx1QkFBdUIsQ0FBM0I7QUFDQSxRQUFJQyxtQkFBbUIsS0FBdkI7QUFDQSxRQUFJQyxnQkFBZ0IsS0FBcEI7QUFDQSxRQUFJQyxrQkFBa0IsSUFBdEI7O0FBRUEsV0FBTztBQUNMLHlCQUFtQixVQUFTQyxJQUFULEVBQWU7QUFDaEMsWUFBSUEsS0FBS0MsUUFBTCxDQUFjQyxJQUFkLEtBQXVCLFNBQTNCLEVBQXNDO0FBQ3BDTCw2QkFBbUIsSUFBbkI7QUFDRCxTQUZELE1BRU87QUFDTEQ7QUFDQUcsNEJBQWtCQyxJQUFsQjtBQUNEO0FBQ0YsT0FSSTs7QUFVTCxnQ0FBMEIsVUFBU0EsSUFBVCxFQUFlO0FBQ3ZDO0FBQ0EsWUFBSSxDQUFDQSxLQUFLRyxXQUFWLEVBQXVCOztBQUV2QixpQkFBU0Msa0JBQVQsQ0FBNEJDLG1CQUE1QixFQUFpRDtBQUMvQyxjQUFJQSxvQkFBb0JDLElBQXBCLEtBQTZCLGVBQWpDLEVBQWtEO0FBQ2hEO0FBQ0FELGdDQUFvQkUsVUFBcEIsQ0FDR0MsT0FESCxDQUNXLFVBQVNDLFFBQVQsRUFBbUI7QUFDMUJMLGlDQUFtQkssU0FBU0MsS0FBNUI7QUFDRCxhQUhIO0FBSUQsV0FORCxNQU1PO0FBQ1A7QUFDRWQ7QUFDRDtBQUNGOztBQUVELFlBQUlJLEtBQUtHLFdBQUwsQ0FBaUJRLFlBQXJCLEVBQW1DO0FBQ2pDWCxlQUFLRyxXQUFMLENBQWlCUSxZQUFqQixDQUE4QkgsT0FBOUIsQ0FBc0MsVUFBU0wsV0FBVCxFQUFzQjtBQUMxREMsK0JBQW1CRCxZQUFZUyxFQUEvQjtBQUNELFdBRkQ7QUFHRCxTQUpELE1BS0s7QUFDSDtBQUNBaEI7QUFDRDs7QUFFREcsMEJBQWtCQyxJQUFsQjtBQUNELE9BdENJOztBQXdDTCxrQ0FBNEIsWUFBVztBQUNyQ0gsMkJBQW1CLElBQW5CO0FBQ0QsT0ExQ0k7O0FBNENMLDhCQUF3QixZQUFXO0FBQ2pDQyx3QkFBZ0IsSUFBaEI7QUFDRCxPQTlDSTs7QUFnREwsc0JBQWdCLFlBQVc7QUFDekIsWUFBSUYseUJBQXlCLENBQXpCLElBQThCLENBQUNDLGdCQUEvQixJQUFtRCxDQUFDQyxhQUF4RCxFQUF1RTtBQUNyRUgsa0JBQVFrQixNQUFSLENBQWVkLGVBQWYsRUFBZ0Msd0JBQWhDO0FBQ0Q7QUFDRjtBQXBESSxLQUFQO0FBc0REO0FBakVjLENBQWpCIiwiZmlsZSI6InJ1bGVzL3ByZWZlci1kZWZhdWx0LWV4cG9ydC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIGRvY3M6IHt9LFxuICB9LFxuXG4gIGNyZWF0ZTogZnVuY3Rpb24oY29udGV4dCkge1xuICAgIGxldCBzcGVjaWZpZXJFeHBvcnRDb3VudCA9IDBcbiAgICBsZXQgaGFzRGVmYXVsdEV4cG9ydCA9IGZhbHNlXG4gICAgbGV0IGhhc1N0YXJFeHBvcnQgPSBmYWxzZVxuICAgIGxldCBuYW1lZEV4cG9ydE5vZGUgPSBudWxsXG5cbiAgICByZXR1cm4ge1xuICAgICAgJ0V4cG9ydFNwZWNpZmllcic6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuZXhwb3J0ZWQubmFtZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgaGFzRGVmYXVsdEV4cG9ydCA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcGVjaWZpZXJFeHBvcnRDb3VudCsrXG4gICAgICAgICAgbmFtZWRFeHBvcnROb2RlID0gbm9kZVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbic6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgLy8gaWYgdGhlcmUgYXJlIHNwZWNpZmllcnMsIG5vZGUuZGVjbGFyYXRpb24gc2hvdWxkIGJlIG51bGxcbiAgICAgICAgaWYgKCFub2RlLmRlY2xhcmF0aW9uKSByZXR1cm5cblxuICAgICAgICBmdW5jdGlvbiBjYXB0dXJlRGVjbGFyYXRpb24oaWRlbnRpZmllck9yUGF0dGVybikge1xuICAgICAgICAgIGlmIChpZGVudGlmaWVyT3JQYXR0ZXJuLnR5cGUgPT09ICdPYmplY3RQYXR0ZXJuJykge1xuICAgICAgICAgICAgLy8gcmVjdXJzaXZlbHkgY2FwdHVyZVxuICAgICAgICAgICAgaWRlbnRpZmllck9yUGF0dGVybi5wcm9wZXJ0aWVzXG4gICAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgY2FwdHVyZURlY2xhcmF0aW9uKHByb3BlcnR5LnZhbHVlKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gYXNzdW1lIGl0J3MgYSBzaW5nbGUgc3RhbmRhcmQgaWRlbnRpZmllclxuICAgICAgICAgICAgc3BlY2lmaWVyRXhwb3J0Q291bnQrK1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucykge1xuICAgICAgICAgIG5vZGUuZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zLmZvckVhY2goZnVuY3Rpb24oZGVjbGFyYXRpb24pIHtcbiAgICAgICAgICAgIGNhcHR1cmVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbi5pZClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vIGNhcHR1cmVzICdleHBvcnQgZnVuY3Rpb24gZm9vKCkge30nIHN5bnRheFxuICAgICAgICAgIHNwZWNpZmllckV4cG9ydENvdW50KytcbiAgICAgICAgfVxuXG4gICAgICAgIG5hbWVkRXhwb3J0Tm9kZSA9IG5vZGVcbiAgICAgIH0sXG5cbiAgICAgICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgaGFzRGVmYXVsdEV4cG9ydCA9IHRydWVcbiAgICAgIH0sXG5cbiAgICAgICdFeHBvcnRBbGxEZWNsYXJhdGlvbic6IGZ1bmN0aW9uKCkge1xuICAgICAgICBoYXNTdGFyRXhwb3J0ID0gdHJ1ZVxuICAgICAgfSxcblxuICAgICAgJ1Byb2dyYW06ZXhpdCc6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoc3BlY2lmaWVyRXhwb3J0Q291bnQgPT09IDEgJiYgIWhhc0RlZmF1bHRFeHBvcnQgJiYgIWhhc1N0YXJFeHBvcnQpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChuYW1lZEV4cG9ydE5vZGUsICdQcmVmZXIgZGVmYXVsdCBleHBvcnQuJylcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9XG4gIH0sXG59XG4iXX0=