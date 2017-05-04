import React from 'react';

export default class TextEditor extends React.Component {
  constructor(props) {
    super();
  }

  componentDidMount() {
    let amdRequire = global.require('monaco-editor/min/vs/loader.js').require;
    var path = require('path');
    var fs = require('fs');
    var file = fs.readFileSync(this.props.tab.path, { encoding: 'utf8' });
    function uriFromPath(_path) {
      var pathName = path.resolve(_path).replace(/\\/g, '/');
      if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
      }
      return encodeURI('file://' + pathName);
    }
    // 
    amdRequire.config({
      baseUrl: uriFromPath(path.resolve(__dirname, '../node_modules/monaco-editor/min'))
    });
    // workaround monaco-css not understanding the environment
    self.module = undefined;
    // workaround monaco-typescript not understanding the environment
    self.process.browser = true;
    const id = this.props.id;
    var editor;
    amdRequire(['vs/editor/editor.main'], () => {
      editor = monaco.editor.create(document.getElementById(id), {
        value: file,
        language: 'javascript',
        theme: "vs-dark",
      });
      this.props.addEditorInstance(editor, id);
    });
  }

  render() {
    return (
      <div className="item-views" style={{ display: (this.props.id == this.props.activeTab ? 'block' : 'none') }}>
        <div className="styleguide pane-item">
          <div
            className="editor-container"
            id={this.props.id}
            style={{ height: '100%', width: '100%' }}
          ></div>
        </div>
      </div>
    );
  }
}
