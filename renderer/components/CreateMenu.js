import React from 'react';

const CreateMenu = ({id, createMenuHandler}) => {
  return (
    <div className="create-menu">
      <button className="create-button" onClick={createMenuHandler.bind(null, id, 'file')}>Create File</button>
      <button className="create-button" onClick={createMenuHandler.bind(null, id, 'directory')}>Create Directory</button>
    </div>
  )
}
export default CreateMenu;