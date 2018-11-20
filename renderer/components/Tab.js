import React from 'react';
import PropTypes from 'prop-types';

const { getFileExt, getCssClassByFileExt } = require('../../lib/file-tree.js');

const Tab = ({ name, isActive, setActiveTab, path, closeTab }) => {
  return (
    <li className={"texteditor tab " + (isActive? "active" : "")} onClick={() => { setActiveTab(path); }} >
      <div className={"title " + getCssClassByFileExt(getFileExt(name))}>{name}</div>
      <div className="close-icon" onClick={(event) => { closeTab(path, event); }} />
    </li>
  );
};

export default Tab;
