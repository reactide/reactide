import React from 'react';
import FileTree from './FileTree'
import TextEditorPane from './TextEditorPane';
import DeletePrompt from './DeletePrompt';
import MockComponentTree from './MockComponentTree';
import MockComponentInspector from './MockComponentInspector';

const { ipcRenderer } = require('electron');
const fileTree = require('../../lib/file-tree');
const fs = require('fs');
const path = require('path');
const { File, Directory } = require('../../lib/item-schema');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      nextTabId: 0,
      openTabs: [],
      activeTab: null,
      openedProjectPath: '',
      openMenuId: null,
      createMenuInfo: {
        id: null,
        type: null
      },
      fileTree: null,
      watch: null,
      rootDirPath: '',
      selectedItem: {
        id: null,
        path: '',
        type: null
      },
      fileChangeType: null,
      deletePromptOpen: false
    }

    this.fileTreeInit();
    this.clickHandler = this.clickHandler.bind(this);
    this.setFileTree = this.setFileTree.bind(this);
    this.openFile = this.openFile.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.checkIfAlreadyOpened = this.checkIfAlreadyOpened.bind(this);
    this.saveTab = this.saveTab.bind(this);
    this.addEditorInstance = this.addEditorInstance.bind(this);
    this.closeTab = this.closeTab.bind(this);
    this.openCreateMenu = this.openCreateMenu.bind(this);
    this.closeOpenDialogs = this.closeOpenDialogs.bind(this);
    this.createForm = this.createForm.bind(this);
    this.createItem = this.createItem.bind(this);
    this.findParentDir = this.findParentDir.bind(this);
    this.deletePromptHandler = this.deletePromptHandler.bind(this);

    //reset tabs, should save tabs before doing this though
    ipcRenderer.on('openDir', (event, arg) => {
      if (this.state.openedProjectPath !== arg) {
        this.setState({
          openTabs: [],
          activeTab: null,
          openedProjectPath: arg,
          nextTabId: 0
        });
      }
    });
    ipcRenderer.on('saveFile', (event, arg) => {
      if (this.state.activeTab !== null) {
        this.saveTab();
      }
    })
    ipcRenderer.on('delete', (event, arg) => {
      if (this.state.selectedItem.id) {
        this.setState({
          deletePromptOpen: true,
          fileChangeType: 'delete'
        });
      }
    })
  }
  fileTreeInit() {
    ipcRenderer.on('openDir', (event, dirPath) => {
      if (dirPath !== this.state.rootDirPath) {
        this.setFileTree(dirPath);
      }
    });
    ipcRenderer.on('newProject', (event, arg) => {
      if (this.state.watch) this.state.watch.close();
      this.setState({
        fileTree: null,
        watch: null,
        rootDirPath: '',
        selectedItem: {
          id: null,
          path: null,
          type: null
        }
      })
    })
  }
  deletePromptHandler(answer) {
    if (answer) {
      ipcRenderer.send('delete', this.state.selectedItem.path);
    } else {
      this.setState({
        fileChangeType: null
      });
    }

    this.setState({
      deletePromptOpen: false,
    });
  }
  clickHandler(id, filePath, type, event) {
    const temp = this.state.fileTree;

    if (type === 'directory') {

      function toggleClicked(dir) {
        if (dir.path === filePath) {
          dir.opened = !dir.opened;
          return;
        }
        else {
          for (var i = 0; i < dir.subdirectories.length; i++) {
            toggleClicked(dir.subdirectories[i]);
          }
        }
      }

      toggleClicked(temp);
    }
    if (this.state.openMenuId === null) event.stopPropagation();
    this.setState({
      selectedItem: {
        id,
        path: filePath,
        type: type
      },
      fileTree: temp
    });
  }

  setFileTree(dirPath) {
    fileTree(dirPath, (fileTree) => {
      if (this.state.watch) {
        this.state.watch.close();
      }
      let watch = fs.watch(dirPath, { recursive: true }, (eventType, fileName) => {
        if (eventType === 'rename') {
          const fileTree = this.state.fileTree;
          const absPath = path.join(this.state.rootDirPath, fileName);
          const parentDir = this.findParentDir(path.dirname(absPath), fileTree);

          if (this.state.fileChangeType === 'delete') {
            let index;
            if (this.state.selectedItem.type === 'directory') {
              index = this.findItemIndex(parentDir.subdirectories, path.basename(absPath));
              parentDir.subdirectories.splice(index, 1);
            } else {
              index = this.findItemIndex(parentDir.files, path.basename(absPath));
              parentDir.files.splice(index, 1);
            }
            const openTabs = this.state.openTabs;
            for (var i = 0; i < this.state.openTabs.length; i++) {
              if (openTabs[i].name === path.basename(absPath)) {
                openTabs.splice(i, 1);
                this.setState({
                  openTabs
                });
                break;
              }
            }
          }
          else if (this.state.fileChangeType === 'new') {
            if (this.state.selectedItem.type === 'directory') {
              parentDir.subdirectories.push(new Directory(absPath, path.basename(absPath)));
            } else {
              parentDir.files.push(new File(absPath, path.basename(absPath)));
            }
          }
          this.setState({
            fileTree,
            fileChangeType: null
          });
        }
      });
    this.setState({
      fileTree,
      rootDirPath: dirPath,
      watch
    });
  })
}
findItemIndex(filesOrDirs, name) {
  for (var i = 0; i < filesOrDirs.length; i++) {
    if (filesOrDirs[i].name === name) {
      return i;
    }
  } return -1;
}
findParentDir(dirPath, directory = this.state.fileTree) {
  if (directory.path === dirPath) return directory;
  else {
    let dirNode;
    for (var i in directory.subdirectories) {
      dirNode = this.findParentDir(dirPath, directory.subdirectories[i]);
      if (dirNode) return dirNode;
    }
  }
}
openCreateMenu(id, itemPath, type, event) {
  event.stopPropagation();
  this.setState({
    openMenuId: id,
    selectedItem: {
      id: id,
      path: itemPath,
      type
    }
  });
}
createForm(id, type, event) {
  event.stopPropagation();
  this.setState({
    createMenuInfo: {
      id,
      type
    },
    openMenuId: null
  })
}
createItem(event) {
  if (event.key === 'Enter') {
    //send path and file type to main process to actually create file/dir
    if (event.target.value) ipcRenderer.send('createItem', this.state.selectedItem.path, event.target.value, this.state.createMenuInfo.type);

    this.setState({
      createMenuInfo: {
        id: null,
        type: null
      },
      fileChangeType: 'new'
    })
  }
}
closeTab(id, event) {
  const temp = this.state.openTabs;
  for (var i = 0; i < temp.length; i++) {
    if (temp[i].id === id) {
      temp.splice(i, 1);
      break;
    }
  }
  event.stopPropagation();
  this.setState({ openTabs: temp, activeTab: temp[0] ? temp[0].id : null });
}
addEditorInstance(editor, id) {
  const temp = this.state.openTabs;
  let i = 0;
  while (this.state.openTabs[i].id !== id) {
    i++;
  }
  temp[i].editor = editor;
  this.setState({
    openTabs: temp
  })
}
saveTab() {
  for (var i = 0; i < this.state.openTabs.length; i++) {
    if (this.state.openTabs[i].id === this.state.activeTab) {
      fs.writeFileSync(this.state.openTabs[i].path, this.state.openTabs[i].editor.getValue(), { encoding: 'utf8' });
      break;
    }
  }
}
setActiveTab(id) {
  this.setState({ activeTab: id });
}
openFile(file) {
  let id = this.checkIfAlreadyOpened(file);
  if (id === -1) {
    const openTabs = this.state.openTabs;
    id = this.state.nextTabId;
    openTabs.push({
      path: file.path,
      id,
      name: file.name,
      modified: false,
      editor: null
    })
    this.setState({ openTabs, activeTab: id, nextTabId: id + 1 });
  } else {
    this.setState({ activeTab: id });
  }
}
checkIfAlreadyOpened(file) {
  for (var i = 0; i < this.state.openTabs.length; i++) {
    if (this.state.openTabs[i].path === file.path) {
      return this.state.openTabs[i].id;
    }
  } return -1;
}
openSim() {
  ipcRenderer.send('openSimulator');
}
closeOpenDialogs() {
  this.setState({
    openMenuId: null,
    createMenuInfo: {
      id: null,
      type: null
    }
  })
}
render() {
  return (
    <ride-workspace className="scrollbars-visible-always" onClick={this.closeOpenDialogs}>

      <ride-panel-container className="header" />

      <ride-pane-container>
        <ride-pane-axis className="horizontal">

          <ride-pane style={{ flexGrow: 0, flexBasis: '300px' }}>
            <FileTree
              openFile={this.openFile}
              openCreateMenu={this.openCreateMenu}
              openMenuId={this.state.openMenuId}
              createMenuInfo={this.state.createMenuInfo}
              createForm={this.createForm}
              createItem={this.createItem}
              fileTree={this.state.fileTree}
              selectedItem={this.state.selectedItem}
              clickHandler={this.clickHandler}
            />
            {this.state.deletePromptOpen ?
              <DeletePrompt
                deletePromptHandler={this.deletePromptHandler}
                name={path.basename(this.state.selectedItem.path)}
              /> :
              <span />}

            <MockComponentTree />

          </ride-pane>
          <ride-pane-resize-handle class="horizontal" />


          <TextEditorPane
            appState={this.state}
            setActiveTab={this.setActiveTab}
            addEditorInstance={this.addEditorInstance}
            closeTab={this.closeTab}
            openMenuId={this.state.openMenuId}
          />

          <ride-pane-resize-handle className="horizontal" />

          <ride-pane style={{ flexGrow: 0, flexBasis: '300px' }}>

            <button
              className='btn'
              onClick={this.openSim}
            >
              Simulator
            </button>
            <MockComponentInspector />

          </ride-pane>

        </ride-pane-axis>
      </ride-pane-container>

    </ride-workspace>
  );
}
}
