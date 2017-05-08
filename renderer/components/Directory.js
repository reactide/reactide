import React from 'react';
import File from './File';
import CreateMenu from './CreateMenu';
import CreateForm from './CreateForm';
import RenameForm from './RenameForm';
import PropTypes from 'prop-types';

const Directory = ({
  directory,
  dblClickHandler, PropTypes.func.isRequired
  clickHandler,
  selectedItem,
  openCreateMenu,
  openMenuId,
  createMenuInfo,
  createMenuHandler,
  createItem,
  renameFlag,
  renameHandler,
  id
}) => {
  const arr = [];
  let uniqueId;
  for (var i = 0; i < directory.subdirectories.length; i++) {
    arr.push(
      <Directory
        key={directory.subdirectories[i].id}
        id={directory.subdirectories[i].id}
        directory={directory.subdirectories[i]}
        dblClickHandler= {dblClickHandler} 
        clickHandler={clickHandler}
        selectedItem={selectedItem}
        openCreateMenu={openCreateMenu}
        openMenuId={openMenuId}
        createMenuInfo={createMenuInfo}
        createMenuHandler={createMenuHandler}
        createItem={createItem}
        renameFlag={renameFlag}
        renameHandler={renameHandler}
      />)
  }
  for (var i = 0; i < directory.files.length; i++) {
    arr.push(
      <File
        key={directory.files[i].id}
        id={directory.files[i].id}
        file={directory.files[i]}
        dblClickHandler= {dblClickHandler} 
        clickHandler={clickHandler}
        selectedItem={selectedItem}
        renameFlag={renameFlag}
        renameHandler={renameHandler}
      />)
  }
  let item = (
    <div
      className="list-item"
      onClick={clickHandler.bind(null, id, directory.path, directory.type)}
    >
      <span className="icon icon-file-directory">
        {directory.name}
      </span>
      <span className="plus-icon" onClick={openCreateMenu.bind(null, id, directory.path)}>+</span>
      {openMenuId === id ? <CreateMenu createMenuHandler={createMenuHandler} id={id} /> : <span />}
      {createMenuInfo.id === id ? <CreateForm createItem={createItem} /> : <span />}
    </div>)
  if (directory.opened) {
    return (
      <li className={selectedItem.id === id ? 'list-nested-item selected' : 'list-nested-item'}>
        {renameFlag && selectedItem.id === id ? <RenameForm renameHandler={renameHandler} /> : item}
        <ul className="list-tree">
          {arr}
        </ul>
      </li>
    )
  } else {
    return (
      <li
        className={selectedItem.id === id ? 'list-nested-item collapsed selected' : 'list-nested-item collapsed'}
      >
        {renameFlag && selectedItem.id === id ? <RenameForm renameHandler={renameHandler} /> : item}
      </li>
    )
  }
}

Directory.propTypes = {
  directory: PropTypes.object.isRequired,
  dblClickHandler: PropTypes.func.isRequired,
  clickHandler: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
  openCreateMenu: PropTypes.func.isRequired,
  openMenuId,
  createMenuInfo,
  createMenuHandler,
  createItem,
  renameFlag,
  renameHandler,
  id
}

export default Directory;