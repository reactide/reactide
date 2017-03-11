import React from 'react';
import TabContainer from './TabContainer.jsx';
const {ipcRenderer} = require('electron');

export default class TextEditor extends React.Component {
  constructor() {
    super();
    ipcRenderer.on('dirname', (err, result) => {
      console.log('dirname:', result);
    })
  }
  componentDidMount() {
    console.log(__dirname);
    // Monaco uses a custom amd loader that over-rides node's require.
    // Keep a reference to node's require so we can restore it after executing the amd loader file.
    // var nodeRequire = global.require;
    // console.log(global.require);
    // <script src="../node_modules/monaco-editor/min/vs/loader.js"></script>
    let amdRequire = require('monaco-editor/min/vs/loader.js').require;
    // console.log(whatisthis);
    // Save Monaco's amd require and restore Node's require
    // var amdRequire = global.require;
    // global.require = nodeRequire;
    // require node modules before loader.js comes in
    var path = require('path');
    var fs = require('fs');
    var file = fs.readFileSync(path.join(__dirname, './index.js'), { encoding: 'utf8' });
    function uriFromPath(_path) {
      var pathName = path.resolve(_path).replace(/\\/g, '/');
      if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
      }
      return encodeURI('file://' + pathName);
    }
    amdRequire.config({
      baseUrl: uriFromPath(path.resolve(__dirname, '../../node_modules/monaco-editor/min'))
    });
    // workaround monaco-css not understanding the environment
    self.module = undefined;
    // workaround monaco-typescript not understanding the environment
    self.process.browser = true;
    var editor;
    amdRequire(['vs/editor/editor.main'], function () {
      editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: file,
        language: 'javascript'
      });
      console.log('editor:', editor.getValue());
    });
  }
  render() {
    return (
      <div className="text-editor">
        <TabContainer />
        <div className="editor-container" id="editor-container" style={{ height: '100%', width: '100%', backgroundColor: 'grey' }} ></div>
      </div>
    );
  }
}