import React, { PropTypes } from 'react';
import File from './File.jsx';
import Directory from './Directory.jsx';
import fs from 'fs';
import path from 'path';
import {remote, ipcRenderer, dialog} from 'electron';

export default function FileTree (props) {
  const {
    fileTree,
    openFile,
    clickHandler,
    selectedItem,
    openCreateMenu,
    openMenuId,
    createMenuInfo,
    createForm,
    createItem,
    rename,
    renameHandler,
  } = props
  return (
    <div className="item-views">
      <div className="styleguide pane-item">
        <header className="styleguide-header">
          <h5>File Directory</h5>
        </header>
        <main className="styleguide-sections">
          <div className="tree-view-resizer tool-panel">
            {fileTree ?
              [
                <div className="tree-view-scroller" key={1}>
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
                      createForm={createForm}
                      createItem={createItem}
                      rename={rename}
                      renameHandler={renameHandler}
                    />
                  </ul>
                </div>,
                <div className="tree-view-resize-handle" key={2}></div>
              ] :
              null
            }
          </div>
        </main>
      </div>
    </div>
  )
}

FileTree.propTypes = {
  fileTree: PropTypes.object,
  openFile: PropTypes.func,
  clickHandler: PropTypes.func,
  selectedItem: PropTypes.object,
  openCreateMenu: PropTypes.func,
  openMenuId: PropTypes.number,
  createMenuInfo: PropTypes.func,
  createForm: PropTypes.func,
  createItem: PropTypes.func,
  rename: PropTypes.bool,
  renameHandler: PropTypes.func,
}
