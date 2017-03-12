import React from 'react';

const File = ({file, openFile}) => {
  return (
    <li className="list-item" onDoubleClick={openFile.bind(null, file)}>
      <span className="icon icon-file-text">{file.name}</span>
    </li>
  )
}
export default File;