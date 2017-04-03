import React from 'react';

const Tab = ({name, setActiveTab, id, closeTab}) => {
  return (
    <li className="texteditor tab" onClick={setActiveTab.bind(null, id)}>
      <div className="title">{name}</div>
      <div className="close-icon" onClick={closeTab.bind(null, id)}></div>
    </li>
  )
}

Tab.propTypes = {
  name: React.PropTypes.any,
  setActiveTab: React.PropTypes.any,
  id: React.PropTypes.any,
  closeTab: React.PropTypes.any,
}

export default Tab;