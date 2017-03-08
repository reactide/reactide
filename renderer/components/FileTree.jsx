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
      this.setFileTree(dirPathArr);
      let watch = fs.watch(dirPathArr, {recursive: true}, (eventType, fileName) => {
        this.setFileTree(dirPathArr);
      });
    });
  }

  setFileTree(path) {
    const projFileTree = fileTree(path);
  }

  render() {
    return (
      <div>
        <h1>File Tree</h1>
      </div>
    )
  }
}