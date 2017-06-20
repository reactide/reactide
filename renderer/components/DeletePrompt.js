import React from 'react';
import PropTypes from 'prop-types';

const DeletePrompt = ({ deletePromptHandler, name }) => {
  return (
    <div className="delete-prompt">
      <h1>Are you sure you want to delete {name}?</h1>
      <button onClick={deletePromptHandler.bind(null, false)}>NO</button>
      <button onClick={deletePromptHandler.bind(null, true)}>YES</button>
    </div>
  );
};

DeletePrompt.propTypes = {
  deletePromptHandler: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

export default DeletePrompt;
