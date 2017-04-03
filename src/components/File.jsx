import React from 'react';
import RenameForm from './RenameForm';

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

File.propTypes = {
  file: React.PropTypes.any,
  openFile: React.PropTypes.any,
  selectedItem: React.PropTypes.any,
  id: React.PropTypes.any,
  clickHandler: React.PropTypes.any,
  rename: React.PropTypes.any,
  renameHandler: React.PropTypes.any,
}

export default File;