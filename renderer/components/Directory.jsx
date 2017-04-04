import React, { Component } from 'react';
import cx from 'classnames';
import File from './File.jsx';
import CreateMenu from './CreateMenu.jsx';
import CreateForm from './CreateForm.jsx';
import RenameForm from './RenameForm.jsx';

export default class Directory extends Component {
  handleListItemClick = proxyEvent => (
    this.props.clickHandler(
      this.props.id,
      this.props.directory.path,
      this.props.directory.type,
      proxyEvent
    )
  )

  handlePlusIconClick = proxyEvent => (
    this.props.openCreateMenu(
      this.props.id,
      this.props.directory.path,
      proxyEvent
    )
  )

  render() {
    const subdirectories = this.props.directory.subdirectories.map(directory => (
      <Directory
        key={directory.id}
        id={directory.id}
        directory={directory}
        openFile={this.props.openFile}
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
    ));
    const files = this.props.directory.files.map(file => (
      <File
        key={file.id}
        id={file.id}
        file={file}
        openFile={this.props.openFile}
        clickHandler={this.props.clickHandler}
        selectedItem={this.props.selectedItem}
        rename={this.props.rename}
        renameHandler={this.props.renameHandler}
      />
    ));
    const directory = subdirectories.concat(files);

    const item = (
      <div className="list-item" onClick={this.handleListItemClick}>
        <span className="icon icon-file-directory">
          {this.props.directory.name}
        </span>
        <span className="plus-icon" onClick={this.handlePlusIconClick}>+</span>
        {this.props.openMenuId === this.props.id ?
          <CreateMenu createForm={this.props.createForm} id={this.props.id} /> :
          <span />
        }
        {this.props.createMenuInfo.id === this.props.id ?
          <CreateForm createItem={this.props.createItem} /> :
          <span />
        }
      </div>
    );

    const listItemClassName = cx('list-nested-item', {
      collapsed: !this.props.directory.opened,
      selected: this.props.selectedItem.id === this.props.id
    });

    return (
      <li className={listItemClassName}>
        {this.props.rename && this.props.selectedItem.id === this.props.id ?
          <RenameForm renameHandler={this.props.renameHandler} /> :
          item
        }
        {this.props.directory.opened &&
          <ul className="list-tree">
            {directory}
          </ul>
        }
      </li>
    )
  }
}
