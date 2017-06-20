import React from 'react';
import PropTypes from 'prop-types';

const Tab = ({ name, setActiveTab, id, closeTab }) => {
  return (
    <li className="texteditor tab" onClick={setActiveTab.bind(null, id)}>
      <div className="title">{name}</div>
      <div className="close-icon" onClick={closeTab.bind(null, id)} />
    </li>
  );
};

Tab.propTypes = {
  name: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  closeTab: PropTypes.func.isRequired
};

export default Tab;
