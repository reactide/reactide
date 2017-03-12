import React from 'react';
import TabContainer from './TabContainer.jsx';

export default class TextEditor extends React.Component {
  constructor() {
    super();
  }
  componentDidMount() {
    console.log(__dirname);
    // Monaco uses a custom amd loader that over-rides node's require.
    // Keep a reference to node's require so we can restore it after executing the amd loader file.
    // var nodeRequire = global.require;
    // console.log(global.require);
    // <script src="../node_modules/monaco-editor/min/vs/loader.js"></script>
    let amdRequire = global.require('monaco-editor/min/vs/loader.js').require;
    // Save Monaco's amd require and restore Node's require
    // var amdRequire = global.require;
    // global.require = nodeRequire;
    // require node modules before loader.js comes in
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
    amdRequire.config({
      baseUrl: uriFromPath(path.resolve(__dirname, '../node_modules/monaco-editor/min'))
    });
    // workaround monaco-css not understanding the environment
    self.module = undefined;
    // workaround monaco-typescript not understanding the environment
    self.process.browser = true;
    const id= this.props.id;
    var editor;
    console.log(document.getElementById('e' + this.props.id));
    amdRequire(['vs/editor/editor.main'], function () {
      editor = monaco.editor.create(document.getElementById('e'+id), {
        value: file,
        language: 'javascript'
      });
    });
    // let newfile = fs.readFileSync(path.join(__dirname, './index.js'), {encoding:'utf8'});
    // setTimeout(()=> {editor.setValue(newfile)}, 5000)
  }
  render() {
    console.log('id:', this.props.id);
    console.log('activetab:', this.props.activeTab);
    return (
      <div className="item-views" style={{display:(this.props.id===this.props.activeTab ? 'block':'none')}}>
        <div className="styleguide pane-item">
          <div
            className="editor-container"
            id={'e'+this.props.id}
            style={{ height: '100%', width: '100%'  }}
          ></div>
        </div>
      </div>
    );
  }
}