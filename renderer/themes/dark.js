/* @flow */

export default {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: 'd9d7ce' },
    { token: 'invalid', foreground: 'ff3333' },
    { token: 'emphasis', fontstyle: 'italic' },
    { token: 'strong', fontstyle: 'bold' },

    { token: 'variable', foreground: 'd9d7ce' },
    { token: 'variable.predefined', foreground: 'd9d7ce' },
    { token: 'constant', foreground: 'ff9d45' },
    { token: 'comment', foreground: '5c6773', fontstyle: 'italic' },
    { token: 'number', foreground: 'ff9d45' },
    { token: 'number.hex', foreground: 'ff9d45' },
    { token: 'regexp', foreground: '95e6cb' },
    { token: 'annotation', foreground: '5ccfe6' },
    { token: 'type', foreground: '5ccfe6' },

    { token: 'delimiter', foreground: 'd9d7ce' },
    { token: 'delimiter.html', foreground: 'd9d7ce' },
    { token: 'delimiter.xml', foreground: 'd9d7ce' },

    { token: 'tag', foreground: '80d4ff' },
    { token: 'tag.id.jade', foreground: '80d4ff' },
    { token: 'tag.class.jade', foreground: '80d4ff' },
    { token: 'meta.scss', foreground: '80d4ff' },
    { token: 'metatag', foreground: '80d4ff' },
    { token: 'metatag.content.html', foreground: 'bae67e' },
    { token: 'metatag.html', foreground: '80d4ff' },
    { token: 'metatag.xml', foreground: '80d4ff' },
    { token: 'metatag.php', fontstyle: 'bold' },

    { token: 'key', foreground: '5ccfe6' },
    { token: 'string.key.json', foreground: '5ccfe6' },
    { token: 'string.value.json', foreground: 'bae67e' },

    { token: 'attribute.name', foreground: '5ccfe6' },
    { token: 'attribute.value', foreground: 'bae67e' },
    { token: 'attribute.value.number', foreground: 'ff9d45' },
    { token: 'attribute.value.unit', foreground: 'bae67e' },
    { token: 'attribute.value.html', foreground: 'bae67e' },
    { token: 'attribute.value.xml', foreground: 'bae67e' },

    { token: 'string', foreground: 'bae67e' },
    { token: 'string.html', foreground: 'bae67e' },
    { token: 'string.sql', foreground: 'bae67e' },
    { token: 'string.yaml', foreground: 'bae67e' },

    { token: 'keyword', foreground: 'ffae57' },
    { token: 'keyword.json', foreground: 'ffae57' },
    { token: 'keyword.flow', foreground: 'ffae57' },
    { token: 'keyword.flow.scss', foreground: 'ffae57' },

    { token: 'operator.scss', foreground: '666666' }, //
    { token: 'operator.sql', foreground: '778899' }, //
    { token: 'operator.swift', foreground: '666666' }, //
    { token: 'predefined.sql', foreground: 'ff00ff' }, //
  ],
  colors: {
    'editor.background': '#212733',
    'editor.foreground': '#d9d7ce',
    'editorIndentGuide.background': '#393b41',
    'editorIndentGuide.activeBackground': '#494b51',
  },
};
