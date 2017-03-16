import React from 'react';
import File from './File.jsx';
import Directory from './Directory.jsx';
const fs = require('fs');
const path = require('path');
const {remote, ipcRenderer, dialog} = require('electron');
const fileTree = require('../../lib/file-tree');


export default class FileTree extends React.Component {
  constructor() {
    super();
    this.state = {
      fileTree: null,
      watch: null,
      rootDirPath: ''
    }
    this.fileTreeInit();
  }

  fileTreeInit() {
    ipcRenderer.on('openDir', (event, dirPath) => {
      console.log('openDIr');
      if (dirPath !== this.state.rootDirPath) {
        this.setFileTree(dirPath);
      }
    });
    ipcRenderer.on('newProject', (event, arg) => {
      if(this.state.watch) this.state.watch.close();
      this.setState({
        fileTree: null,
        watch: null,
        rootDirPath: ''
      }, ()=>{console.log('newProject:', this.state)})
    })
  }


  setFileTree(dirPath) {
    fileTree(dirPath, (fileTree) => {
      if (this.state.watch) {
        this.state.watch.close();
      }
      let watch = fs.watch(dirPath, { recursive: true }, (eventType, fileName) => {
        // this.setFileTree(dirPath);
        console.log('watch emit');
      });
      this.setState({
        fileTree,
        rootDirPath: dirPath,
        watch
      }, ()=>{console.log('setFileTree:', this.state)});
    })
  }

  render() {
    if (this.state.fileTree) {
      return (
        <div className="tree-view-resizer tool-panel">
          <div className="tree-view-scroller">
            <ul className="tree-view full-menu list-tree has-collapsable-children">
              <Directory directory={this.state.fileTree} openFile={this.props.openFile} />
            </ul>
          </div>
          <div className="tree-view-resize-handle"></div>
        </div>
      )
    } else {
      return (
        <div className="tree-view-resizer tool-panel">
          <div className="tree-view-resize-handle"></div>
        </div>
      )
    }
  }
}