import React from 'react';
import FileTree from './FileTree.jsx'
import TextEditorPane from './TextEditorPane.jsx';
import TextEditor from './TextEditor.jsx';
const {remote, ipcRenderer, dialog} = require('electron');
const fileTree = require('../../lib/file-tree');
const fs = require('fs');
const path=require('path');


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
      selected: {
        id: null,
        path: ''
      }
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

    //reset tabs, should save tabs before doing this though
    ipcRenderer.on('openDir', (event, arg) => {
      if (this.state.openedProjectPath !== arg) {
        this.setState({ openTabs: [], activeTab: null, openedProjectPath: arg, nextTabId: 0 });
      }
    });
    ipcRenderer.on('saveFile', (event, arg) => {
      if (this.state.activeTab !== null) {
        this.saveTab(this.state.activeTab);
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
      selected: {
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
        this.setFileTree(dirPath);
      });
      this.setState({
        fileTree,
        rootDirPath: dirPath,
        watch
      });
    })
  }
  openCreateMenu(id, event) {
    this.setState({openMenuId: id});
  }
  createForm(id, type, event) {
    event.stopPropagation();
    this.setState({
      formInfo :{
        id,
        type
      },
      openMenuId: null
    })
  }
  createItem(event) {
    if (event.key === 'Enter') {
      console.log(event.target.value);
      this.setState({
        formInfo: {
          id: null,
          type: null
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
    let i;
    for (i = 0; this.state.openTabs[i].id !== id; i++) {}
    temp[i].editor = editor;
    this.setState({
      openTabs: temp
    })
  }
  saveTab(tabIndex) {
    fs.writeFileSync(this.state.openTabs[tabIndex].path, this.state.openTabs[tabIndex].editor.getValue(), { encoding: 'utf8' });
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
    ipcRenderer.send('openSimulator')
  }
  closeOpenDialogs(){
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
                selected={this.state.selected}
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
