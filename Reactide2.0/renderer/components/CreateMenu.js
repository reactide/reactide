import React from 'react';
import PropTypes from 'prop-types';

const CreateMenu = ({ id, createMenuHandler, type, path}) => {
  let contextMenu;
  if(type === 'directory') {
    contextMenu = (
      <div>
        <button className="create-button" onClick={(event) => createMenuHandler(id, 'file', event, 'create')}>Create File</button>
        <button className="create-button" onClick={(event) => createMenuHandler(id, 'directory', event, 'create')}>Create Directory</button>
        <button className="create-button" onClick = {(event) => createMenuHandler(id, type, event, 'rename')}>Rename</button>
        <button className="create-button" onClick = {(event) => createMenuHandler(id, type, event, 'delete', path)}>Delete</button>
      </div>
    )
  } else{
    contextMenu = (
      <div>
          <button className="create-button" onClick={(event) => createMenuHandler(id, type, event, 'rename')}>Rename</button>
          <button className="create-button" onClick={(event) => createMenuHandler(id, type, event, 'delete', path)}>Delete</button>
      </div>)
  }
  return (
    <div className = "create-menu">
      {contextMenu}
    </div>
  );
};

CreateMenu.propTypes = {
  id: PropTypes.number.isRequired,
  createMenuHandler: PropTypes.func.isRequired
};

export default CreateMenu;
