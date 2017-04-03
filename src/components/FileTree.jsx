import React from 'react';
import Directory from './Directory';

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
                      rename={this.props.rename}
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
}

FileTree.propTypes = {
  fileTree: React.PropTypes.any,
  openFile: React.PropTypes.any,
  clickHandler: React.PropTypes.any,
  selectedItem: React.PropTypes.any,
  openCreateMenu: React.PropTypes.any,
  openMenuId: React.PropTypes.any,
  createMenuInfo: React.PropTypes.any,
  createForm: React.PropTypes.any,
  createItem: React.PropTypes.any,
  rename: React.PropTypes.any,
  renameHandler: React.PropTypes.any,
}