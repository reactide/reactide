import React from 'react';

const DeletePrompt = ({deletePromptHandler, name}) => {
  return (
    <div className='delete-prompt'>
      <h1>Are you sure you want to delete {name}?</h1>
      <button onClick={deletePromptHandler.bind(null, false)}>NO</button>
      <button onClick={deletePromptHandler.bind(null, true)}>YES</button>
    </div>
  )
}

export default DeletePrompt;