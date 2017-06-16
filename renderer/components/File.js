import React from 'react';
import RenameForm from './RenameForm';
import PropTypes from 'prop-types';

const File = ({
  file, 
  dblClickHandler, 
  selectedItem, 
  id, 
  clickHandler, 
  renameFlag, 
  renameHandler
}) => {

  return (
    <li 
      className={selectedItem.id === id ? 'list-item selected' : 'list-item'}  
      onDoubleClick={dblClickHandler.bind(null, file)}
      onClick={clickHandler.bind(null, id, file.path, file.type)}
    >
    {renameFlag && selectedItem.id === id ? <RenameForm renameHandler={renameHandler}/> : <span className="icon icon-file-text">{file.name}</span>}
    </li>
  )
}

File.propTypes = {
  file: PropTypes.object.isRequired,
  dblClickHandler: PropTypes.func.isRequired,
  selectedItem: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  clickHandler: PropTypes.func.isRequired,
  renameFlag: PropTypes.bool.isRequired,
  renameHandler: PropTypes.func.isRequired
}

export default File;