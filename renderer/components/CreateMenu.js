import React from 'react';
import PropTypes from 'prop-types';

const CreateMenu = ({ id, createMenuHandler }) => {
  return (
    <div className="create-menu">
      <button className="create-button" onClick={createMenuHandler.bind(null, id, 'file')}>Create File</button>
      <button className="create-button" onClick={createMenuHandler.bind(null, id, 'directory')}>
        Create Directory
      </button>
    </div>
  );
};

CreateMenu.propTypes = {
  id: PropTypes.number.isRequired,
  createMenuHandler: PropTypes.func.isRequired
};

export default CreateMenu;
