import React from 'react';

const Tab = ({name}) => {
  return (
    <li className="texteditor tab">
      <div className="title">{name}</div>
      <div className="close-icon"></div>
    </li>
  )
}
export default Tab;