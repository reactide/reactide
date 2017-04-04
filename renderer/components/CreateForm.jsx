import React, { PropTypes } from 'react';

export default function CreateForm ({createItem}) {
  return (
    <div className="list-item">
      <input
        className="create-form"
        onKeyPress={createItem}
        onClick={event => event.stopPropagation()}
      />
    </div>
  )
}

CreateForm.propTypes = {
  createItem: PropTypes.func,
}
