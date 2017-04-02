import React from 'react';
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

import FileTree from './FileTree'
import TextEditorPane from './TextEditorPane';
import DeletePrompt from './DeletePrompt';

const { getTree } = require('../../lib/file-tree');
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
    this.openFile = this.openFile.bind(this);
    this.setActiveTab = this.setActiveTab.bind(this);
    this.checkIfProjOpened = this.checkIfProjOpened.bind(this);
    this.saveTab = this.saveTab.bind(this);
    this.addEditorInstance = this.addEditorInstance.bind(this);
    this.closeTab = this.closeTab.bind(this);
    this.openCreateMenu = this.openCreateMenu.bind(this);
    this.closeOpenDialogs = this.closeOpenDialogs.bind(this);
    this.createForm = this.createForm.bind(this);
    this.createItem = this.createItem.bind(this);
    this.findParentDir = this.findParentDir.bind(this);
    this.deletePromptHandler = this.deletePromptHandler.bind(this);
    this.renameHandler = this.renameHandler.bind(this);

    //reset tabs, should store state in local storage before doing this though
    ipcRenderer.on('openDir', (event, arg) => {
      if (this.state.openedProjectPath !== arg) {
        this.setState({ openTabs: [], activeTab: null, openedProjectPath: arg, nextTabId: 0 });
      }
    });
    ipcRenderer.on('saveFile', () => {
      if (this.state.activeTab !== null) {
        this.saveTab();
      }
    })
    ipcRenderer.on('delete', () => {
      if (this.state.selectedItem.id) {
        this.setState({
          deletePromptOpen: true,
          fileChangeType: 'delete'
        });
      }
    })
    ipcRenderer.on('enter', () => {
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
    ipcRenderer.on('newProject', () => {
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

      const toggleClicked = (dir) => {
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
      if (this.state.watch) {
        this.state.watch.close();
      }
      this.setState({
        fileTree,
        rootDirPath: dirPath,
        watch
      });
      let watch = fs.watch(dirPath, { recursive: true }, (eventType, fileName) => {
        if (eventType === 'rename') {
          const fileTree = this.state.fileTree;
          const absPath = path.join(this.state.rootDirPath, fileName);
          const parentDir = this.findParentDir(path.dirname(absPath), fileTree);
          const name = path.basename(absPath);
          const openTabs = this.state.openTabs;

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
          else if (this.state.fileChangeType === 'new') {
            if (this.state.createMenuInfo.type === 'directory') {
              parentDir.subdirectories.push(new Directory(absPath, name));
            } else {
              parentDir.files.push(new File(absPath, name));
            }
          } else if (this.state.fileChangeType === 'rename' && this.state.newName) {
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
            this.setState({
              selectedItem: {
                id: this.state.selectedItem.id,
                type: this.state.selectedItem.type,
                path: path.join(path.dirname(absPath), this.state.newName)
              }
            })
            for (let i = 0; i < this.state.openTabs.length; i++) {
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
            openTabs
          });
        }
      });
    })
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
  createForm(id, type, event) {
    document.body.onkeydown = () => { };
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
        fileChangeType: 'new'
      })
    }
  }
  // closeTab(id, event) {
  //   const temp = this.state.openTabs;
  //   for (var i = 0; i < temp.length; i++) {
  //     if (temp[i].id === id) {
  //       temp.splice(i, 1);
  //       break;
  //     }
  //   }
  //   event.stopPropagation();
  //   this.setState({ openTabs: temp, activeTab: temp[0] ? temp[0].id : null });
  // }
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
    this.setState({ activeTab: id }, () => {
      let editorNode = document.getElementById(id);
      let parent = editorNode.parentElement;
      editorNode.style.width = parent.clientWidth;
      editorNode.firstElementChild.style.width = parent.clientWidth;
      editorNode.firstElementChild.firstElementChild.style.width = parent.clientWidth;
      editorNode.getElementsByClassName('monaco-scrollable-element')[0].style.width = parent.clientWidth - 46;
    });

  }

  openFile(file) {
    let id = this.checkIfProjOpened(file);
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

  checkIfProjOpened(file) {
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
      <ride-workspace className="scrollbars-visible-always" onClick={this.closeOpenDialogs} >

        <ride-panel-container className="header"></ride-panel-container>

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
                rename={this.state.rename}
                renameHandler={this.renameHandler}
              />
              {this.state.deletePromptOpen ? <DeletePrompt deletePromptHandler={this.deletePromptHandler} name={path.basename(this.state.selectedItem.path)} /> : <span />}


              <div className="item-views">
                <div className="styleguide pane-item">
                  <header className="styleguide-header">
                    <h5>Component Tree</h5>
                  </header>

                  <main className="styleguide-sections">

                    <div className="tree-view-resizer tool-panel">
                      <div className="tree-view-scroller">

                        <ul className="tree">
                          <li>
                            <input type="checkbox" checked="checked" id="a1" />
                            <label className="tree_label" htmlFor="a1">app</label>
                            <ul>
                              <li>
                                <input type="checkbox" checked="checked" id="c1" />
                                <label className="tree_label" htmlFor="c1">header</label>
                                <ul>
                                  <li>
                                    <input type="checkbox" checked="checked" id="c2" />
                                    <label htmlFor="c2" className="tree_label">h1</label>
                                    <ul>
                                      <li>
                                        <input type="checkbox" id="c14" disabled />
                                        <label htmlFor="c14" className="tree_label">todos</label>
                                      </li>
                                      <li>
                                        <input type="checkbox" id="c15" disabled />
                                        <label htmlFor="c15" className="tree_label">input</label>
                                      </li>
                                    </ul>
                                  </li>
                                  <li>
                                    <input type="checkbox" checked="checked" id="c3" />
                                    <label htmlFor="c3" className="tree_label">Looong level 1 <br />label text</label>
                                    <ul>
                                      <li>
                                        <input type="checkbox" id="c13" disabled />
                                        <label htmlFor="c13" className="tree_label">Level 2</label>
                                      </li>
                                      <li>
                                        <input type="checkbox" checked="checked" id="c4" />
                                        <label htmlFor="c4" className="tree_label">
                                          <span className="treecaret">Sample</span>
                                          <span className="tree_custom">
                                            type: <span className="text-info">'input'</span><br />
                                            className: <span className="text-info">'new-todo'</span><br />
                                            type: <span className="text-info">'text'</span><br />
                                            placeholder: <span className="text-info">'What needs to be done?'</span><br />
                                            autoFocus: <span className="text-info">true</span><br />
                                            value: <span className="text-info">''</span>
                                          </span>
                                        </label>
                                        <ul>
                                          <li>
                                            <input type="checkbox" id="c12" disabled />
                                            <label htmlFor="c12" className="tree_label">Level 3</label>
                                          </li>
                                        </ul>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>

                              <li>
                                <input type="checkbox" checked="checked" id="c5" />
                                <label className="tree_label" htmlFor="c5">section</label>
                                <ul>
                                  <li>
                                    <input type="checkbox" checked="checked" id="c6" />
                                    <label htmlFor="c6" className="tree_label">input</label>
                                    <ul>
                                      <li>
                                        <input type="checkbox" id="c11" disabled />
                                        <label htmlFor="c11" className="tree_label">Level 2</label>
                                      </li>
                                    </ul>
                                  </li>
                                  <li>
                                    <input type="checkbox" checked="checked" id="c7" />
                                    <label htmlFor="c7" className="tree_label">ul</label>
                                    <ul>
                                      <li>
                                        <input type="checkbox" id="c10" disabled />
                                        <label htmlFor="c10" className="tree_label">Level 2</label>
                                      </li>
                                      <li>
                                        <input type="checkbox" checked="checked" id="c8" />
                                        <label htmlFor="c8" className="tree_label">Level 2</label>
                                        <ul>
                                          <li>
                                            <input type="checkbox" id="c9" disabled />
                                            <label htmlFor="c9" className="tree_label">Level 3</label>
                                          </li>
                                        </ul>
                                      </li>
                                    </ul>
                                  </li>
                                  <li>
                                    <input type="checkbox" checked="checked" id="c20" />
                                    <label htmlFor="c20" className="tree_label">footer</label>
                                    <ul>
                                      <li>
                                        <input type="checkbox" id="c21" disabled />
                                        <label htmlFor="c21" className="tree_label">span</label>
                                      </li>
                                      <li>
                                        <input type="checkbox" checked="checked" id="c22" />
                                        <label htmlFor="c22" className="tree_label">ul</label>
                                        <ul>
                                          <li>
                                            <input type="checkbox" checked="checked" id="c23" />
                                            <label htmlFor="c23" className="tree_label">li</label>
                                            <ul>
                                              <li>
                                                <input type="checkbox" id="c25" disabled />
                                                <label htmlFor="c25" className="tree_label">a</label>
                                              </li>
                                            </ul>
                                          </li>
                                          <li>
                                            <input type="checkbox" id="c24" disabled />
                                            <label htmlFor="c24" className="tree_label">li</label>
                                          </li>
                                        </ul>
                                      </li>
                                    </ul>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </li>
                        </ul>

                      </div>
                    </div>

                  </main>
                </div>
              </div>

            </ride-pane>
            <ride-pane-resize-handle class="horizontal"></ride-pane-resize-handle>


            <TextEditorPane
              appState={this.state}
              setActiveTab={this.setActiveTab}
              addEditorInstance={this.addEditorInstance}
              closeTab={this.closeTab}
            />

            <ride-pane-resize-handle className="horizontal"></ride-pane-resize-handle>

            <ride-pane style={{ flexGrow: 0, flexBasis: '300px' }}>

              <div className="item-views">
                <div className="styleguide pane-item">
                  <header className="styleguide-header">
                    <h5>Component Inspector</h5>
                  </header>
                  <main className="styleguide-sections">

                    <section className="bordered">
                      <button className='btn' onClick={this.openSim}>Simulator</button>
                      <h3>Props</h3>
                      <div className="control">
                        <div className="control-rendered">
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">className</div>
                              <div className="controls">
                                <input className='input-text' type='text' placeholder='todo-item active' />
                              </div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">placeholder</div>
                              <div className="controls">
                                <input className='input-text' type='text' placeholder='What needs to be done?' />
                              </div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">value</div>
                              <div className="controls">
                                <input className='input-text' type='text' placeholder='' />
                              </div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">autoFocus</div>
                              <div className="controls">
                                <div className='btn-group'>
                                  <button className='btn'>Off</button>
                                  <button className='btn selected'>On</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <section className="bordered">
                      <h3>Styles</h3>
                      <div className="control">
                        <div className="control-rendered">
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">count</div>
                              <div className="controls"><input className='input-range' type='range' /></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">columns</div>
                              <div className="controls"><input className='input-range' type='range' /></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">width</div>
                              <div className="controls"><input className='input-range' type='range' /></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">padding</div>
                              <div className="controls"><input className='input-number' type='number' min='1' max='10' placeholder='1-10' /></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">margin</div>
                              <div className="controls"><input className='input-number' type='number' min='1' max='10' placeholder='1-10' /></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">color</div>
                              <div className="controls"><input className='input-color' type='color' value='#FF85FF' /></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">position</div>
                              <div className="controls">
                                <select className='input-select'><option>Relative</option><option>Option 2</option><option>Option 3</option></select>
                              </div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">float</div>
                              <div className="controls"><select className='input-select'><option>Left</option><option>Option 2</option><option>Option 3</option></select></div>
                            </div>
                          </div>
                          <div className='block'>
                            <div className="control-wrap">
                              <div className="label">active</div>
                              <div className="controls">
                                <div className='btn-group'>
                                  <button className='btn'>Off</button>
                                  <button className='btn selected'>On</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="bordered">
                      <br /><br /><br /><br /><br /><br /><br /><br /><br />
                      <br /><br /><br /><br /><br /><br /><br /><br /><br />
                      <br /><br /><br /><br /><br /><br /><br /><br /><br />
                      <br /><br /><br /><br /><br /><br /><br /><br /><br />
                      <br /><br /><br /><br /><br /><br /><br /><br /><br />
                      <h1 className="section-heading">Controls Library</h1>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
                      <button className='btn' onClick={this.openSim}>Simulator</button>
                    </section>
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
