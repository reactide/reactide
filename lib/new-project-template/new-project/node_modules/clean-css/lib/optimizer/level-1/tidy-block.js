function tidyBlock(values, spaceAfterClosingBrace) {
  var i;

  for (i = values.length - 1; i >= 0; i--) {
    values[i][1] = values[i][1]
      .replace(/\n|\r\n/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/(,|:|\() /g, '$1')
      .replace(/ \)/g, ')')
      .replace(/'([a-zA-Z][a-zA-Z\d\-_]+)'/, '$1')
      .replace(/"([a-zA-Z][a-zA-Z\d\-_]+)"/, '$1')
      .replace(spaceAfterClosingBrace ? null : /\) /g, ')');
  }

  return values;
}

module.exports = tidyBlock;
