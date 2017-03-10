import React from 'react';
import File from './File.jsx';
import Directory from './Directory.jsx';
const fs = require('fs');
const path = require('path');
const {remote, ipcRenderer, dialog} = require('electron');
const fileTree = require('../../lib/file-tree-sync');


export default class FileTree extends React.Component {
  constructor() {
    super();
    this.state = {
      fileTree: null
    }
    this.fileTreeInit();
  }

  fileTreeInit() {
    ipcRenderer.on('openDir', (event, dirPathArr) => {
      this.setFileTree(dirPathArr);
      let watch = fs.watch(dirPathArr, { recursive: true }, (eventType, fileName) => {
        this.setFileTree(dirPathArr);
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
        <div>
          <h1>File Tree</h1>
          <Directory directory={this.state.fileTree} />
        </div>
      )
    } else {
      return (
        <div>
          <h1>File Tree</h1>
        </div>
      )
    }
  }
}