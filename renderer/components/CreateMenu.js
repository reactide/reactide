import React from 'react';

const CreateMenu = ({id, createForm}) => {
  return (
    <div className="create-menu">
      <button className="create-button" onClick={createForm.bind(null, id, 'file')}>Create File</button>
      <button className="create-button" onClick={createForm.bind(null, id, 'directory')}>Create Directory</button>
    </div>
  )
}
export default CreateMenu;