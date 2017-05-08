import React from 'react';
import FileTree from './FileTree'
import TextEditorPane from './TextEditorPane';
import DeletePrompt from './DeletePrompt';
import MockComponentTree from './MockComponentTree';
import MockComponentInspector from './MockComponentInspector';

const { ipcRenderer } = require('electron');
const {getTree} = require('../../lib/file-tree');
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
        type: null,
        focused: false
      },
      rename: false,
      fileChangeType: null,
      deletePromptOpen: false,
      newName: ''
    }

    this.fileTreeInit();
    this.clickHandler = this.clickHandler.bind(this);
    this.setFileTree = this.setFileTree.bind(this);
    this.dblClickHandler = this.dblClickHandler.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.isFileOpened = this.isFileOpened.bind(this);
    this.saveTab = this.saveTab.bind(this);
    this.addEditorInstance = this.addEditorInstance.bind(this);
    this.closeTab = this.closeTab.bind(this);
    this.openCreateMenu = this.openCreateMenu.bind(this);
    this.closeOpenDialogs = this.closeOpenDialogs.bind(this);
    this.createMenuHandler = this.createMenuHandler.bind(this);
    this.createItem = this.createItem.bind(this);
    this.findParentDir = this.findParentDir.bind(this);
    this.deletePromptHandler = this.deletePromptHandler.bind(this);
    this.renameHandler = this.renameHandler.bind(this);

    //reset tabs, should store state in local storage before doing this though
    ipcRenderer.on('openDir', (event, projPath) => {
      if (this.state.openedProjectPath !== projPath) {
        this.setState({ openTabs: [], activeTab: null, openedProjectPath: projPath, nextTabId: 0 });
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
    ipcRenderer.on('enter', (event, arg) => {
      if (this.state.selectedItem.focused) {
        //rename property just true or false i guess
        this.setState({
          rename: true
        })
      }
    })
  }
  //registers listeners for opening projects and new projects
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
  //sends old path and new name to main process to rename, closes rename form and sets filechangetype and newName for fswatch
  renameHandler(event) {
    if (event.key === 'Enter' && event.target.value) {
      ipcRenderer.send('rename', this.state.selectedItem.path, event.target.value);
      this.setState({
        rename: false,
        fileChangeType: 'rename',
        newName: event.target.value
      })
    } else if (event.key === 'Enter' && !event.target.value) {
      this.setState({
        rename: false
      })
    }
  }
  //handles click event from delete prompt 
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
  //handles click events for directories and files in file tree render
  clickHandler(id, filePath, type, event) {
    const temp = this.state.fileTree;

    document.body.onkeydown = (event) => {
      if (event.key === 'Enter') {
        this.setState({
          rename: true
        })
        document.body.onkeydown = () => { };
      }
    }
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
    //so opened menu doesn't immediately close
    if (this.state.openMenuId === null) event.stopPropagation();

    this.setState({
      selectedItem: {
        id,
        path: filePath,
        type: type,
        focused: true
      },
      fileTree: temp,
      rename: false,
      createMenuInfo: {
        id: null,
        type: null
      }
    });
  }
  
  //calls file tree module and sets state with file tree object representation in callback
  setFileTree(dirPath) {
    getTree(dirPath, (fileTree) => {

      //if watcher instance already exists close it as it's for the previously opened project
      if (this.state.watch) {
        this.state.watch.close();
      }

      let watch = fs.watch(dirPath, { recursive: true }, (eventType, fileName) => {
        if (eventType === 'rename') {
          const fileTree = this.state.fileTree;
          const absPath = path.join(this.state.rootDirPath, fileName);
          const parentDir = this.findParentDir(path.dirname(absPath), fileTree);
          const name = path.basename(absPath);
          const openTabs = this.state.openTabs;

          //delete handler
          if (this.state.fileChangeType === 'delete') {
            let index;
            if (this.state.selectedItem.type === 'directory') {
              index = this.findItemIndex(parentDir.subdirectories, name);
              parentDir.subdirectories.splice(index, 1);
            } else {
              index = this.findItemIndex(parentDir.files, name);
              parentDir.files.splice(index, 1);
            }
            for (var i = 0; i < this.state.openTabs.length; i++) {
              if (openTabs[i].name === name) {
                openTabs.splice(i, 1);
                break;
              }
            }
          }

          //new handler
          else if (this.state.fileChangeType === 'new') {
            if (this.state.createMenuInfo.type === 'directory') {
              parentDir.subdirectories.push(new Directory(absPath, name));
            } else {
              parentDir.files.push(new File(absPath, name));
            }
          }

          //rename handler
          else if (this.state.fileChangeType === 'rename' && this.state.newName) {
            //fileName has new name, selectedItem has old name and path
            let index;
            if (this.state.selectedItem.type === 'directory') {
              index = this.findItemIndex(parentDir.subdirectories, name);
              parentDir.subdirectories[index].name = this.state.newName;
              parentDir.subdirectories[index].path = path.join(path.dirname(absPath), this.state.newName);

            } else {
              index = this.findItemIndex(parentDir.files, name);
              parentDir.files[index].name = this.state.newName;
              parentDir.files[index].path = path.join(path.dirname(absPath), this.state.newName);
            }

            //renames path of selected renamed file so it has the right info
            this.setState({
              selectedItem: {
                id: this.state.selectedItem.id,
                type: this.state.selectedItem.type,
                path: path.join(path.dirname(absPath), this.state.newName)
              }
            });

            //rename the opened tab of the renamed file if it's there
            for (var i = 0; i < this.state.openTabs.length; i++) {
              if (openTabs[i].name === name) {
                openTabs[i].name = this.state.newName;
                break;
              }
            }
          }

          this.setState({
            fileTree,
            fileChangeType: null,
            newName: '',
            createMenuInfo: {
              id: null,
              type: null
            },
            openTabs,
          });
        }
      });

      this.setState({
        fileTree,
        rootDirPath: dirPath,
        watch
      });
    });
  }

  //returns index of file/dir in files or subdirectories array
  findItemIndex(filesOrDirs, name) {
    for (var i = 0; i < filesOrDirs.length; i++) {
      if (filesOrDirs[i].name === name) {
        return i;
      }
    } return -1;
  }

  //returns parent directory object of file/directory in question
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

  //click handler for plus button on directories, 'opens' new file/dir menu by setting openMenuID state
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

  //handler for create menu
  createMenuHandler(id, type, event) {
    
    //unhook keypress listeners
    document.body.onkeydown = () => {};

    event.stopPropagation();

    this.setState({
      createMenuInfo: {
        id,
        type
      },
      openMenuId: null
    })
  }

  //sends input name to main, where the file/directory is actually created. 
  //creation of new file/directory will trigger watch handler
  createItem(event) {
    if (event.key === 'Enter') {
      //send path and file type to main process to actually create file/dir only if there is value
      if (event.target.value) ipcRenderer.send('createItem', this.state.selectedItem.path, event.target.value, this.state.createMenuInfo.type);

      //set type of file change so watch handler knows which type
      this.setState({
        fileChangeType: 'new'
      })
    }
  }

  //tab close handler
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

  //save handler
  saveTab() {
    for (var i = 0; i < this.state.openTabs.length; i++) {
      if (this.state.openTabs[i].id === this.state.activeTab) {
        fs.writeFileSync(this.state.openTabs[i].path, this.state.openTabs[i].editor.getValue(), { encoding: 'utf8' });
        break;
      }
    }
  }

  //sets active tab
  setActiveTab(id) {
    this.setState({ activeTab: id }, () => {
      let editorNode = document.getElementById(id);

      //for text editor window resizing
      let parent = editorNode.parentElement;
      editorNode.style.width = parent.clientWidth;
      editorNode.firstElementChild.style.width = parent.clientWidth;
      editorNode.firstElementChild.firstElementChild.style.width = parent.clientWidth;
      editorNode.getElementsByClassName('monaco-scrollable-element')[0].style.width = parent.clientWidth - 46;
    });

  }

  //double click handler for files
  dblClickHandler(file) {
    let id = this.isFileOpened(file);
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
      // store.dispatch()
    } else {
      this.setState({ activeTab: id });
    }
  }

  //checks if project is already open
  isFileOpened(file) {
    for (var i = 0; i < this.state.openTabs.length; i++) {
      if (this.state.openTabs[i].path === file.path) {
        return this.state.openTabs[i].id;
      }
    } return -1;
  }

  //simulator click handler
  openSim() {
    ipcRenderer.send('openSimulator');
  }

  //closes any open dialogs, handles clicks on anywhere besides the active open menu/form
  closeOpenDialogs() {
    const selectedItem = this.state.selectedItem;
    selectedItem.focused = false;

    document.body.onkeydown = () => { };
    this.setState({
      openMenuId: null,
      createMenuInfo: {
        id: null,
        type: null
      },
      selectedItem,
      rename: false
    });
  }

  render() {
    return (
      <ride-workspace className="scrollbars-visible-always" onClick={this.closeOpenDialogs}>

        <ride-panel-container className="header" />

        <ride-pane-container>
          <ride-pane-axis className="horizontal">

            <ride-pane style={{ flexGrow: 0, flexBasis: '300px' }}>
              <FileTree
                dblClickHandler={this.dblClickHandler}
                openCreateMenu={this.openCreateMenu}
                openMenuId={this.state.openMenuId}
                createMenuInfo={this.state.createMenuInfo}
                createMenuHandler={this.createMenuHandler}
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
