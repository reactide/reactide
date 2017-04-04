import React, { PropTypes } from 'react';

export default function RenameForm ({renameHandler}) {
  return (
    <span>
      <input
        className="rename-input"
        onKeyPress={renameHandler}
        onClick={event => event.stopPropagation()}
      />
    </span>
  )
}

RenameForm.propTypes = {
  renameHandler: PropTypes.func.isRequired,
}
