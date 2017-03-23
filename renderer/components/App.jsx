import React from 'react';
import FileTree from './FileTree.jsx'
import TextEditorPane from './TextEditorPane.jsx';
import TextEditor from './TextEditor.jsx';
const {remote, ipcRenderer, dialog} = require('electron');
const fileTree = require('../../lib/file-tree');
const fs = require('fs');
const path = require('path');
const {File, Directory} = require('../../lib/item-schema');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      nextTabId: 0,
      openTabs: [],
      activeTab: null,
      openedProjectPath: '',
      openMenuId: null,
      formInfo: {
        id: null,
        type: null
      },
      fileTree: null,
      watch: null,
      rootDirPath: '',
      selectedItem: {
        id: null,
        path: ''
      },
      fileChangeType: null
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

    //reset tabs, should save tabs before doing this though
    ipcRenderer.on('openDir', (event, arg) => {
      if (this.state.openedProjectPath !== arg) {
        this.setState({ openTabs: [], activeTab: null, openedProjectPath: arg, nextTabId: 0 });
      }
    });
    ipcRenderer.on('saveFile', (event, arg) => {
      if (this.state.activeTab !== null) {
        this.saveTab();
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
          path: null
        }
      })
    })
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
        path: filePath
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

          fs.stat(absPath, (err, stat) => {
            if (stat.isFile()) {
              let fileIndex, subdirIndex;
              switch (this.state.fileChangeType) {
                case 'new':
                  dirNode.files.push(new File(absPath, path.basename(absPath)));
                  break;
                case 'rename':
                  fileIndex = this.findItemIndex(dirNode.files, path.basename(absPath));
                  dirNode.files[fileIndex].name = path.basename(absPath);
                  dirNode.files[fileIndex].path = absPath;
                  break;
                case 'delete':
                  fileIndex = this.findItemIndex(dirNode.files, path.basename(absPath));
                  dirNode.files.splice(fileIndex, 1);
                  break;
                default:
                  this.setFileTree;
                  break;
              }
            } else {
              switch (this.state.fileChangeType) {
                case 'new':
                  dirNode.subdirectories.push(new Directory(absPath, path.basename(absPath)));
                  break;
                case 'rename':
                  subdirIndex = this.findItemIndex(dirNode.files, path.basename(absPath));
                  dirNode.subdirectories[subdirIndex].name = path.basename(absPath);
                  dirNode.subdirectories[subdirIndex].path = absPath;
                  break;
                case 'delete':
                  subdirIndex = this.findItemIndex(dirNode.subdirectories, path.basename(absPath));
                  dirNode.subdirectories.splice(subdirIndex, 1);
                  break;
                default:
                  this.setFileTree;
                  break;
              }
            }
            this.setState({
              fileTree,
              fileChangeType: null
            })
          })
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
  openCreateMenu(id, itemPath, event) {
    event.stopPropagation();
    this.setState({
      openMenuId: id,
      selectedItem: {
        id: id,
        path: itemPath
      }
    });
  }
  createForm(id, type, event) {
    event.stopPropagation();
    this.setState({
      formInfo: {
        id,
        type
      },
      openMenuId: null
    })
  }
  createItem(event) {
    if (event.key === 'Enter') {
      //send path and file type to main process to actually create file/dir
      if (event.target.value) ipcRenderer.send('createItem', this.state.selectedItem.path, event.target.value, this.state.formInfo.type);

      this.setState({
        formInfo: {
          id: null,
          type: null,
          fileChangeType: 'new'
        }
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
      formInfo: {
        id: null,
        type: null
      }
    })
  }
  render() {
    return (
      <ride-workspace className="scrollbars-visible-always" onClick={this.closeOpenDialogs}>

        <ride-panel-container className="header"></ride-panel-container>

        <ride-pane-container>
          <ride-pane-axis className="horizontal">

            <ride-pane style={{ flexGrow: 0, flexBasis: '200px' }}>
              <FileTree
                openFile={this.openFile}
                openCreateMenu={this.openCreateMenu}
                openMenuId={this.state.openMenuId}
                formInfo={this.state.formInfo}
                createForm={this.createForm}
                createItem={this.createItem}
                fileTree={this.state.fileTree}
                selectedItem={this.state.selectedItem}
                clickHandler={this.clickHandler}
              />
            </ride-pane>

            <TextEditorPane
              appState={this.state}
              setActiveTab={this.setActiveTab}
              addEditorInstance={this.addEditorInstance}
              closeTab={this.closeTab}
              openMenuId={this.state.openMenuId}
            />

            <ride-pane-resize-handle className="horizontal"></ride-pane-resize-handle>

            <ride-pane style={{ flexGrow: 0, flexBasis: '300px' }}>
              <ul className="list-inline tab-bar inset-panel">
                <li className="tab active">
                  <div className="title">Property Inspector</div>
                  <div className="close-icon"></div>
                </li>
              </ul>

              <div className="item-views">
                <div className="styleguide pane-item">
                  <header className="styleguide-header">
                    <h1>Header</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                    <button className='btn' onClick={this.openSim}>Simulator</button>
                  </header>
                  <main className="styleguide-sections">
                    <section className="bordered">
                      <h1 className="section-heading">Controls Library</h1>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                      <h3>Button Groups &amp; Selectors</h3>
                      <div className="control">
                        <div className="control-rendered">
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">Sample</div>
                              <div className="controls">
                                <div className='btn-group'>
                                  <button className='btn'>One</button>
                                  <button className='btn selected'>Two</button>
                                  <button className='btn'>Three</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h3>Selectors</h3>
                      <div className="control">
                        <div className="control-rendered">
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">Range</div>
                              <div className="controls"><input className='input-range' type='range' /></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">Number</div>
                              <div className="controls"><input className='input-number' type='number' min='1' max='10' placeholder='1-10' /></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">Color</div>
                              <div className="controls"><input className='input-color' type='color' value='#FF85FF' /></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">Selector</div>
                              <div className="controls"><select className='input-select'><option>Option 1</option><option>Option 2</option><option>Option 3</option></select></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h3>Booleans</h3>
                      <div className="control">
                        <div className="control-rendered">
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">Checkbox</div>
                              <div className="controls"><input className='input-checkbox' type='checkbox' checked /></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">Toggle</div>
                              <div className="controls"><input className='input-toggle' type='checkbox' checked /></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h3>Inputs Alternate</h3>
                      <div className="control">
                        <div className="control-rendered">
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">Text Input</div>
                              <div className="controls">
                                <input className='input-text' type='text' placeholder='Text' />
                              </div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">Search Input</div>
                              <div className="controls">
                                <input className='input-search' type='search' placeholder='Search' />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h3>Wide Inputs</h3>
                      <div className="control">
                        <div className="control-rendered">
                          <input className='input-text' type='text' placeholder='Text' />
                          <input className='input-search' type='search' placeholder='Search' />
                          <textarea className='input-textarea' placeholder='Text Area'></textarea>
                        </div>
                      </div>
                    </section>
                  </main>
                </div>
              </div>

            </ride-pane>

          </ride-pane-axis>
        </ride-pane-container>

      </ride-workspace>
    );
  }
}
