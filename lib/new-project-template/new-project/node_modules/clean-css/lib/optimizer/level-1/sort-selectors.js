var naturalCompare = require('../../utils/natural-compare');

function naturalSorter(scope1, scope2) {
  return naturalCompare(scope1[1], scope2[1]);
}

function standardSorter(scope1, scope2) {
  return scope1[1] > scope2[1] ? 1 : -1;
}

function sortSelectors(selectors, method) {
  var sorter;

  switch (method) {
    case 'natural':
      sorter = naturalSorter;
      break;
    case 'standard':
      sorter = standardSorter;
  }

  return selectors.sort(sorter);
}

module.exports = sortSelectors;
