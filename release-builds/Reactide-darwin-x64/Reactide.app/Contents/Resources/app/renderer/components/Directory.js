import React from 'react';
import File from './File';
import CreateMenu from './CreateMenu';
import CreateForm from './CreateForm';
import RenameForm from './RenameForm';
import PropTypes from 'prop-types';

const Directory = ({
  directory,
  dblClickHandler,
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
        openCreateMenu={openCreateMenu}
        openMenuId={openMenuId}
        createMenuHandler={createMenuHandler}
        parentDirectory = {directory}
      />)
  }
  let item = (
    <div
      className="list-item"
      onClick={(event) => clickHandler(id, directory.path, directory.type, event)}
      onContextMenu={(event) => openCreateMenu(id, directory.path, directory.type, event)}
    >
      <span className="octi-file-directory">
        {directory.name}
      </span>
      {/* <span className="plus-icon" onClick={(event) => openCreateMenu(id, directory.path, directory.type, event)}>+</span> */}
      {openMenuId === id ? <CreateMenu createMenuHandler={createMenuHandler} path = {directory.path} type = {directory.type} id={id} /> : <span />}
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
  openMenuId: PropTypes.number,
  createMenuInfo: PropTypes.object.isRequired,
  createMenuHandler: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  renameFlag: PropTypes.bool.isRequired,
  renameHandler: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired
}

export default Directory;