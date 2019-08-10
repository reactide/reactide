import React, { Component } from 'react';
import XTerm from './Terminal';
import OutputConsole from './OutputConsole';

const CONSOLE_TAB_ENUMS = ['OUTPUT', 'TERMINAL'];

class ConsolePane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabEnum: CONSOLE_TAB_ENUMS[0]
    };
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(event, tabEnum) {
    event.stopPropagation();
    this.setState({ activeTabEnum: tabEnum });
  }

  isActiveTab(tabEnum) {
    return tabEnum === this.state.activeTabEnum;
  }

  renderTab() {
    let tabRenderer = [];
    for (let i = 0; i < CONSOLE_TAB_ENUMS.length; i++) {
      let key = CONSOLE_TAB_ENUMS[i];
      tabRenderer.push(<li key={"console-tab-" + key} className={"list-item" + (this.isActiveTab(key) ? " active" : "")}>
        <span
          onClick={(event) => { this.handleTabClick(event, key) }}>
          {key}
        </span>
      </li>);
    }
    return (
      <ul className="list">
        {tabRenderer}
      </ul>);
  }

  renderContent() {
    switch (this.state.activeTabEnum) {
      case CONSOLE_TAB_ENUMS[0]:
        return <OutputConsole cb_cra={this.props.cb_cra} cb_craOut={this.props.cb_craOut} />
      case CONSOLE_TAB_ENUMS[1]:
        return (
          <XTerm
            rootdir={this.props.rootDirPath}
            cb_setFileTree={this.props.cb_setFileTree}
          />
        );
    }
    return null;
  }

  render() {
    return (
      <ride-pane id="console-pane" style={{ height: '' }}>
        <div id="console-tab">
          {this.renderTab()}
        </div>
        <div id="console-content">
          {this.renderContent()}
        </div>
      </ride-pane>
    );
  }
}

export default ConsolePane;