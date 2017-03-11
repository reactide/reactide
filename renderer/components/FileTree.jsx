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
    ipcRenderer.on('openDir', (event, dirPath) => {
      this.setFileTree(dirPath);
      let watch = fs.watch(dirPath, { recursive: true }, (eventType, fileName) => {
        this.setFileTree(dirPath);
      });
    });
  }
  openSim() {
    ipcRenderer.send('openSimulator')
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
        <div className="file-tree">
          <h1>File Trees</h1>
          <button onClick={this.openSim}>Simulator</button>
          <ul><Directory directory={this.state.fileTree} /></ul>
        </div>
      )
    } else {
      return (
        <div className="file-tree">
          <h1>File Tree</h1>
          <button onClick={this.openSim}>Simulator</button>
        </div>
      )
    }
  }
}