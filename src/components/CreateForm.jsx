import React from 'react';

const CreateForm = ({createItem}) => {
  return (
    <div className='list-item'>
      <input className='create-form' onKeyPress={createItem} onClick={(event) => {event.stopPropagation()}} /> 
    </div>
  )
}

CreateForm.propTypes = {
  createItem: React.PropTypes.any
}

export default CreateForm;