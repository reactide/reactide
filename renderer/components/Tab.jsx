import React from 'react';

const Tab = ({name, setActiveTab, id, closeTab}) => {
  return (
    <li className="texteditor tab" onClick={setActiveTab.bind(null, id)}>
      <div className="title">{name}</div>
      <div className="close-icon" onClick={closeTab.bind(null, id)}>X</div>
    </li>
  )
}
export default Tab;