import React from 'react';
import TextEditor from './TextEditor.jsx';
import TabContainer from './TabContainer.jsx';

export default class TextEditorPane extends React.Component {
  constructor() {
    super();
  }
  render() {
    const editorArr = [];
    for (var i = 0; i < this.props.appState.openTabs.length; i++) {
      editorArr.push(
        <TextEditor 
          key={this.props.appState.openTabs[i].id} 
          id={this.props.appState.openTabs[i].id} 
          tab={this.props.appState.openTabs[i]} 
          activeTab={this.props.appState.activeTab} 
          addEditorInstance={this.props.addEditorInstance}
        />);
    }
    return (
      <ride-pane>
        <TabContainer 
          appState={this.props.appState} 
          setActiveTab={this.props.setActiveTab} 
          closeTab={this.props.closeTab}
        />
        {editorArr}
      </ride-pane>
    )
  }
}