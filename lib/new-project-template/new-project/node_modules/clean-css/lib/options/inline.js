function inlineOptionsFrom(rules) {
  if (Array.isArray(rules)) {
    return rules;
  }

  return undefined === rules ?
    ['local'] :
    rules.split(',');
}

module.exports = inlineOptionsFrom;
