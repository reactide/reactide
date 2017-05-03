import React from 'react';
import File from './File.jsx';
import Directory from './Directory.jsx';
const fs = require('fs');
const path = require('path');
const {remote, ipcRenderer, dialog} = require('electron');


/*export default class FileTree extends React.Component {
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
                      createMenuHandler={this.props.createMenuHandler}
                      createItem={this.props.createItem}
                      renameFlag={this.props.renameFlag}
                      renameHandler={this.props.renameHandler}
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
}*/

const FileTree = ({
  fileTree,
  openFile,
  clickHandler,
  selectedItem,
  openCreateMenu,
  openMenuId,
  createMenuInfo,
  createMenuHandler,
  createItem,
  renameFlag,
  renameHandler
}) => {
      if (fileTree) {
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
                      directory={fileTree}
                      openFile={openFile}
                      id={fileTree.id}
                      clickHandler={clickHandler}
                      selectedItem={selectedItem}
                      openCreateMenu={openCreateMenu}
                      openMenuId={openMenuId}
                      createMenuInfo={createMenuInfo}
                      createMenuHandler={createMenuHandler}
                      createItem={createItem}
                      renameFlag={renameFlag}
                      renameHandler={renameHandler}
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

export default FileTree;