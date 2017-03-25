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
        <div className="item-views">
          <div className="styleguide pane-item">
            <header className="styleguide-header">
              <h5>File Directory</h5>
            </header>
            <main className="styleguide-sections">

              <div className="tree-view-resizer tool-panel">
                <div className="tree-view-scroller">
                  <ul className="tree-view full-menu list-tree has-collapsable-children">
                    <Directory
                      directory={this.props.fileTree}
                      openFile={this.props.openFile}
                      id={this.props.fileTree.id}
                      clickHandler={this.props.clickHandler}
                      selectedItem={this.props.selectedItem}
                      openCreateMenu={this.props.openCreateMenu}
                      openMenuId={this.props.openMenuId}
                      createMenuInfo={this.props.createMenuInfo}
                      createForm={this.props.createForm}
                      createItem={this.props.createItem}
                    />
                  </ul>
                </div>
                <div className="tree-view-resize-handle"></div>
              </div>

            </main>
          </div>
        </div>
      )
    } else {
      return (
        <div className="item-views">
          <div className="styleguide pane-item">
            <header className="styleguide-header">
              <h5>File Directory</h5>
            </header>
            <main className="styleguide-sections">

              <div className="tree-view-resizer tool-panel">
              </div>

            </main>
          </div>
        </div>
      )
    }
  }
}