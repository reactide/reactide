import React from 'react';
import File from './File';
import CreateMenu from './CreateMenu';
import CreateForm from './CreateForm';
import RenameForm from './RenameForm';

export default class Directory extends React.Component {
  constructor() {
    super();
  }
  render() {
    const arr = [];
    for (var i = 0; i < this.props.directory.subdirectories.length; i++) {
      arr.push(
        <Directory
          key={this.props.directory.subdirectories[i].id}
          id={this.props.directory.subdirectories[i].id}
          directory={this.props.directory.subdirectories[i]}
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
        />)
    }
    for (let i = 0; i < this.props.directory.files.length; i++) {
      arr.push(
        <File
          key={this.props.directory.files[i].id}
          id={this.props.directory.files[i].id}
          file={this.props.directory.files[i]}
          openFile={this.props.openFile}
          clickHandler={this.props.clickHandler}
          selectedItem={this.props.selectedItem}
          rename={this.props.rename}
          renameHandler={this.props.renameHandler}
        />)
    }
    let item = (
      <div
        className="list-item"
        onClick={this.props.clickHandler.bind(null, this.props.id, this.props.directory.path, this.props.directory.type)}
      >
        <span className="icon icon-file-directory">
          {this.props.directory.name}
        </span>
        <span className="plus-icon" onClick={this.props.openCreateMenu.bind(null, this.props.id, this.props.directory.path)}>+</span>
        {this.props.openMenuId === this.props.id ? <CreateMenu createForm={this.props.createForm} id={this.props.id} /> : <span />}
        {this.props.createMenuInfo.id === this.props.id ? <CreateForm createItem={this.props.createItem} /> : <span />}
    </div>)
    if (this.props.directory.opened) {
      return (
        <li className={this.props.selectedItem.id === this.props.id ? 'list-nested-item selected' : 'list-nested-item'}>
          {this.props.rename && this.props.selectedItem.id === this.props.id ? <RenameForm renameHandler={this.props.renameHandler} /> : item}
          <ul className="list-tree">
            {arr}
          </ul>
        </li>
      )
    } else {
      return (
        <li
          className={this.props.selectedItem.id === this.props.id ? 'list-nested-item collapsed selected' : 'list-nested-item collapsed'}
        >
          {this.props.rename && this.props.selectedItem.id === this.props.id ? <RenameForm renameHandler={this.props.renameHandler} /> : item}
        </li>
      )
    }
  }
}

Directory.propTypes = {
  rename: React.PropTypes.any,
  selectedItem: React.PropTypes.any,
  id: React.PropTypes.any,
  openMenuId: React.PropTypes.any,
  createMenuInfo: React.PropTypes.any,
  directory: React.PropTypes.any,
  renameHandler: React.PropTypes.any,
  openCreateMenu: React.PropTypes.any,
  clickHandler: React.PropTypes.any,
  createForm: React.PropTypes.any,
  openFile: React.PropTypes.any,
  createItem: React.PropTypes.any,
}
