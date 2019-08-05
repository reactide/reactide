import React from 'react';
import RenameForm from './RenameForm';
import PropTypes from 'prop-types';
import CreateMenu from './CreateMenu';

const { getCssClassByFileExt } = require('../../lib/file-tree');

const File = ({ file, dblClickHandler, selectedItem, id, clickHandler, renameFlag, renameHandler, openCreateMenu, openMenuId, createMenuHandler}) => {
  return (
    <li
      className={selectedItem.id === id ? 'list-item selected' : 'list-item'}
      onDoubleClick={(event) => dblClickHandler(file, event)}
      onClick={(event) => clickHandler(id, file.path, file.type, event)}
      onContextMenu ={(event) => openCreateMenu(id, file.path, file.type, event)}
    >
    {openMenuId === id ? <CreateMenu createMenuHandler={createMenuHandler} path = {file.path} type = {file.type} id={id} /> : <span />}
    {renameFlag && selectedItem.id === id
        ? <RenameForm renameHandler={renameHandler} />
        : <span className={getCssClassByFileExt(file.ext)}>{file.name}</span>}
    </li>
  );
};


File.propTypes = {
  file: PropTypes.object.isRequired,
  dblClickHandler: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  clickHandler: PropTypes.func.isRequired,
  renameFlag: PropTypes.bool.isRequired,
  renameHandler: PropTypes.func.isRequired
};

export default File;
