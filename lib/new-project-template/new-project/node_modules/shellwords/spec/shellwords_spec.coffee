shellwords = require "../src/shellwords"

describe "Shellwords", ->
  describe "#split", ->
    it "splits normal words", ->
      results = shellwords.split "foo bar baz"
      (expect results).toEqual ["foo", "bar", "baz"]

    it "splits single quoted phrases", ->
      results = shellwords.split "foo 'bar baz'"
      (expect results).toEqual ["foo", "bar baz"]

    it "splits double quoted phrases", ->
      results = shellwords.split '"foo bar" baz'
      (expect results).toEqual ["foo bar", "baz"]

    it "respects escaped characters", ->
      results = shellwords.split "foo\\ bar baz"
      (expect results).toEqual ["foo bar", "baz"]

    it "respects escaped characters within single quotes", ->
      results = shellwords.split "foo 'bar\\ baz'"
      (expect results).toEqual ["foo", "bar baz"]

    it "respects escaped characters within double quotes", ->
      results = shellwords.split 'foo "bar\\ baz"'
      (expect results).toEqual ["foo", "bar baz"]

    it "respects escaped quotes within quotes", ->
      results = shellwords.split 'foo "bar\\" baz"'
      (expect results).toEqual ['foo', 'bar" baz']

      results = shellwords.split "foo 'bar\\' baz'"
      (expect results).toEqual ["foo", "bar' baz"]

    it "throws on unmatched single quotes", ->
      fn = ->
        shellwords.split "foo 'bar baz"

      (expect fn).toThrow()

    it "throws on unmatched double quotes", ->
      fn = ->
        shellwords.split 'foo "bar baz'

      (expect fn).toThrow()

  describe "#escape", ->
    it "escapes a string to be safe for shell command line", ->
      results = shellwords.escape "foo '\"' bar"
      (expect results).toEqual "foo\\ \\'\\\"\\'\\ bar"

    it "dummy escapes any multibyte chars", ->
      results = shellwords.escape "あい"
      (expect results).toEqual "\\あ\\い"
