import React from 'react';

const Tab = ({name, setActiveTab, id}) => {
  return (
    <li className="texteditor tab" onClick={setActiveTab.bind(null, id)}>
      <div className="title">{name}</div>
      <div className="close-icon"></div>
    </li>
  )
}
export default Tab;