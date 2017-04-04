import React, { PureComponent, PropTypes } from 'react';
import Tab from './Tab.jsx';

export default function TabContainer ({appState, setActiveTab, closeTab}) {
  return (
    <ul className="list-inline tab-bar inset-panel tab-container">
      {appState.openTabs.map(tab => (
        <Tab
          key={tab.id}
          name={tab.name}
          setActiveTab={setActiveTab}
          id={tab.id}
          closeTab={closeTab}
        />
      ))}
    </ul>
  )
}

TabContainer.propTypes = {
  appState: PropTypes.object.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  closeTab: PropTypes.func.isRequired,
}
