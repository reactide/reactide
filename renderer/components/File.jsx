import React from 'react';

const File = ({file, openFile, selectedItem, id, clickHandler}) => {
  return (
    <li 
      className={selectedItem.id === id ? 'list-item selected' : 'list-item'}  
      onDoubleClick={openFile.bind(null, file)}
      onClick={clickHandler.bind(null, id, file.path, file.type)}
    >
      <span className="icon icon-file-text">{file.name}</span>
    </li>
  )
}
export default File;