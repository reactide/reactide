import React from 'react';
const fs = require('fs');
const path = require('path');
const {remote, ipcRenderer, dialog} = require('electron');
const fileTree = require('../../lib/file-tree-sync');

export default class FileTree extends React.Component {
  constructor() {
    super()
    this.fileTreeInit();
  }

  fileTreeInit() {
    ipcRenderer.on('openDir', (event, dirPathArr) => {
      //dirPath is an array with the absolute path to the opened directory
      this.setFileTree(dirPathArr[0]);
      let watch = fs.watch(dirPathArr[0], {recursive: true}, (eventType, fileName) => {
        this.setFileTree(dirPathArr[0]);
      });
    });
  }

  setFileTree(path) {
    const projFileTree = fileTree(path);
    console.log(JSON.stringify(projFileTree, null, this.state.num));
  }
  render() {
    return (
      <div>
        <h1>File Tree</h1>
      </div>
    )
  }
}