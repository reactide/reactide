import React from 'react';
import RenameForm from './RenameForm.jsx';

const File = ({file, openFile, selectedItem, id, clickHandler, rename, renameHandler}) => {

  return (
    <li 
      className={selectedItem.id === id ? 'list-item selected' : 'list-item'}  
      onDoubleClick={openFile.bind(null, file)}
      onClick={clickHandler.bind(null, id, file.path, file.type)}
    >
    {rename && selectedItem.id === id ? <RenameForm renameHandler={renameHandler}/> : <span className="icon icon-file-text">{file.name}</span>}
    </li>
  )
}
export default File;