import React from 'react';
import Tab from './Tab.jsx';

export default class TabContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      tabs: [
        'some.js',
        'another.js',
        'dude.js'
      ]
    }
  }

  render() {
    const tabs = [];
    for (var i = 0; i < this.state.tabs.length; i++) {
      tabs.push(<Tab name={this.state.tabs[i]} />);
    }
    return (
      <div className="tab-container">
        {tabs}
      </div>
    )
  }
}