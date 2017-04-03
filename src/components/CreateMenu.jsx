import React from 'react';

const CreateMenu = ({id, createForm}) => {
  return (
    <div className="create-menu">
      <button className="create-button" onClick={createForm.bind(null, id, 'file')}>Create File</button>
      <button className="create-button" onClick={createForm.bind(null, id, 'directory')}>Create Directory</button>
    </div>
  )
}

CreateMenu.propTypes = {
  id: React.PropTypes.any,
  createForm: React.PropTypes.any
}

export default CreateMenu;