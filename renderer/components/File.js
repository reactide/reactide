import React from 'react';
import RenameForm from './RenameForm';

const File = ({file, openFile, selectedItem, id, clickHandler, renameFlag, renameHandler}) => {

  return (
    <li 
      className={selectedItem.id === id ? 'list-item selected' : 'list-item'}  
      onDoubleClick={openFile.bind(null, file)}
      onClick={clickHandler.bind(null, id, file.path, file.type)}
    >
    {renameFlag && selectedItem.id === id ? <RenameForm renameHandler={renameHandler}/> : <span className="icon icon-file-text">{file.name}</span>}
    </li>
  )
}
export default File;