import React from 'react';

const CreateForm = ({createItem}) => {
  return (
    <div className='list-item'>
      <input className='create-form' onKeyPress={createItem} onClick={(event) => {event.stopPropagation()}}/> 
    </div>
  )
}
export default CreateForm;