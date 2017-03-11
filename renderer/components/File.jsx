import React from 'react';

const File = ({file}) => {
  return (
    <li className="list-item">
      <span className="icon icon-file-text">{file.name}</span>
    </li>
  )
}
export default File;