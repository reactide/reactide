import React from 'react';

const RenameForm = ({renameHandler}) => {
  return (
    <span>
      <input className='rename-input' onKeyPress={renameHandler} onClick={(event)=>{event.stopPropagation()}}/>
    </span>
  )
}

export default RenameForm;