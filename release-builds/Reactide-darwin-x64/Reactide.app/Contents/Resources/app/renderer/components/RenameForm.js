import React from 'react';
import PropTypes from 'prop-types';

const RenameForm = ({
  renameHandler
}) => {
  return (
    <span>
      <input autoFocus className='rename-input' onKeyPress={renameHandler} onClick={(event)=>{event.stopPropagation()}}/>
    </span>
  )
}

RenameForm.propTypes = {
  renameHandler: PropTypes.func.isRequired
}

export default RenameForm;