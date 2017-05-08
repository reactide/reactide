import React from 'react';
import PropTypes from 'prop-types';

const CreateForm = ({createItem}) => {console.log('created form')
  return (
    <div className='list-item'>
      <input className='create-form' onKeyPress={createItem} onClick={(event) => {event.stopPropagation()}} /> 
    </div>
  )
}

CreateForm.propTypes = {
  createItem: PropTypes.func.isRequired
}

export default CreateForm;