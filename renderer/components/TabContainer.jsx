import React from 'react';
import Tab from './Tab.jsx';

export default class TabContainer extends React.Component {
  constructor() {
    super();
  }

  render() {
    const tabs = [];
    for (var i = 0; i < this.props.appState.openTabs.length; i++) {
      tabs.push(<Tab name={this.props.appState.openTabs[i].name} setActiveTab={this.props.setActiveTab} id={this.props.appState.openTabs[i].id}/>);
    }
    return (
      <ul className="list-inline tab-bar inset-panel">
        {tabs}
      </ul>
    )
  }
}