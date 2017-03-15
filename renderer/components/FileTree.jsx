import React from 'react';
import File from './File.jsx';
import Directory from './Directory.jsx';
const fs = require('fs');
const path = require('path');
const {remote, ipcRenderer, dialog} = require('electron');
const fileTree = require('../../lib/file-tree-sync');
// const fileTree = require('../../lib/file-tree');


export default class FileTree extends React.Component {
  constructor() {
    super();
    this.state = {
      fileTree: null
    }
    this.fileTreeInit();
  }

  fileTreeInit() {
    ipcRenderer.on('openDir', (event, dirPath) => {
      this.setFileTree(dirPath);
      let watch = fs.watch(dirPath, { recursive: true }, (eventType, fileName) => {
        this.setFileTree(dirPath);
      });
    });
  }

  setFileTree(path) {
    const projFileTree = fileTree(path);
    this.setState({
      fileTree: projFileTree
    })
  }

  render() {
    if (this.state.fileTree) {
      return (
        <div className="tree-view-resizer tool-panel">
          <div className="tree-view-scroller">
            <ul className="tree-view full-menu list-tree has-collapsable-children">
              <Directory directory={this.state.fileTree} openFile={this.props.openFile}/>
            </ul>
          </div>
          <div className="tree-view-resize-handle"></div>
        </div>
      )
    } else {
      return (
        <div className="tree-view-resizer tool-panel">
          <em>No project loaded</em>
          <div className="tree-view-resize-handle"></div>
        </div>
      )
    }
  }
}