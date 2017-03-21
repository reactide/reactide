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
  }

  render() {
    if (this.props.fileTree) {
      return (
        <div className="tree-view-resizer tool-panel">
          <div className="tree-view-scroller">
            <ul className="tree-view full-menu list-tree has-collapsable-children">
              <Directory
                directory={this.props.fileTree}
                openFile={this.props.openFile}
                id={this.props.fileTree.id}
                clickHandler={this.props.clickHandler}
                selected={this.props.selected}
                openCreateMenu={this.props.openCreateMenu}
                openMenuId={this.props.openMenuId}
                formInfo={this.props.formInfo}
                createForm={this.props.createForm}
                createItem={this.props.createItem}
              />
            </ul>
          </div>
          <div className="tree-view-resize-handle"></div>
        </div>
      )
    } else {
      return (
        <div className="tree-view-resizer tool-panel">
          <div className="tree-view-resize-handle">No Project Opened</div>
        </div>
      )
    }
  }
}