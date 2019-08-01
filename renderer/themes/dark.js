/* @flow */

export default {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: '', foreground: 'd9d7ce', background: '292A2B'  },
    { token: 'invalid', foreground: 'ff3333' },
    { token: 'emphasis', fontstyle: 'italic' },
    { token: 'strong', fontstyle: 'bold' },

    { token: 'variable', foreground: 'C7C7C7' },  // panda veriable
    { token: 'variable.predefined', foreground: 'FF0000' }, // panda 
    { token: 'constant', foreground: 'FFB86C' },  // panda const
    { token: 'comment', foreground: '676B79', fontstyle: 'italic' },// panda comment
    { token: 'comment.js', foreground: '008800' },
    { token: 'comment.css', foreground: '008800' },
    { token: 'comment.scss', foreground: '008800' },
    { token: 'number', foreground: 'ff9d45' },
    { token: 'number.hex', foreground: 'ff9d45' },
    { token: 'regexp', foreground: '95e6cb' },
    { token: 'annotation', foreground: '5ccfe6' },
    { token: 'type', foreground: '6DB1FF' },  // panda user-defined - blue

    { token: 'delimiter', foreground: 'd9d7ce' },
    { token: 'delimiter.html', foreground: 'd9d7ce' },
    { token: 'delimiter.xml', foreground: 'd9d7ce' },

    { token: 'tag', foreground: 'FFC990' }, // panda class keyword - orange
    { token: 'tag.id.jade', foreground: 'FFC990' },
    { token: 'tag.class.jade', foreground: 'FFC990' },  // panda class
    { token: 'meta.scss', foreground: 'FFC990' },
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
    { token: 'attribute.value.html', foreground: 'FFB86C' },  // panda html attribute
    { token: 'attribute.value.xml', foreground: 'bae67e' },

    { token: 'string', foreground: '19F9D8' },  // panda string
    { token: 'string.html', foreground: 'bae67e' },
    { token: 'string.sql', foreground: 'bae67e' },
    { token: 'string.yaml', foreground: 'bae67e' },

    { token: 'keyword', foreground: 'ff75b5' }, // panda keyword
    { token: 'keyword.json', foreground: 'ffae57' },
    { token: 'keyword.flow', foreground: 'ffae57' },
    { token: 'keyword.flow.scss', foreground: 'ffae57' },

    { token: 'operator.scss', foreground: '666666' }, //
    { token: 'operator.sql', foreground: '778899' }, //
    { token: 'operator.swift', foreground: '666666' }, //
    { token: 'predefined.sql', foreground: 'ff00ff' }, //
  ],
  colors: {
    'editor.background': '#292A2B',   // panda background #292A2B
    'editor.foreground': '#E6E6E6',   // panda foreground
    'editorIndentGuide.background': '#393b41',
    'editorIndentGuide.activeBackground': '#494b51',
  },
};
