scan = (string, pattern, callback) ->
  result = ""

  while string.length > 0
    match = string.match pattern

    if match
      result += string.slice 0, match.index
      result += callback match
      string = string.slice(match.index + match[0].length)
    else
      result += string
      string = ""

  result

exports.split = (line = "") ->
  words = []
  field = ""
  scan line, ///
    \s*                     # Leading whitespace
    (?:                       #
      ([^\s\\\'\"]+)          # Normal words
      |                       #
      '((?:[^\'\\]|\\.)*)'    # Stuff in single quotes
      |                       #
      "((?:[^\"\\]|\\.)*)"    # Stuff in double quotes
      |                       #
      (\\.?)                  # Escaped character
      |                       #
      (\S)                    # Garbage
    )                         #
    (\s|$)?                 # Seperator
  ///, (match) ->
    [raw, word, sq, dq, escape, garbage, seperator] = match

    throw new Error "Unmatched quote" if garbage?

    field += (word or (sq or dq or escape).replace(/\\(?=.)/, ""))

    if seperator?
      words.push field
      field = ""

  words.push field if field

  words

exports.escape = (str = "") ->
  return "''" unless str?

  str.replace(/([^A-Za-z0-9_\-.,:\/@\n])/g, "\\$1").replace(/\n/g, "'\n'")

