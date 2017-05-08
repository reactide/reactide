import React from 'react';
import File from './File';
import Directory from './Directory';
const fs = require('fs');
const path = require('path');
const {remote, ipcRenderer, dialog} = require('electron');

const FileTree = ({
  fileTree,
  dblClickHandler,
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
                      dblClickHandler={dblClickHandler}
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