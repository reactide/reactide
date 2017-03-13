import React from 'react';
import TextEditor from './TextEditor.jsx';
import TabContainer from './TabContainer.jsx';

export default class TextEditorPane extends React.Component {
  constructor() {
    super();
  }
  render() {
    const editorArr = [];
    for (var i in this.props.appState.openTabs) {
      editorArr.push(<TextEditor key={i} id={i} tab={this.props.appState.openTabs[i]} activeTab={this.props.appState.activeTab} addEditorInstance={this.props.addEditorInstance}/>);
    }
    return (
      <ride-pane>
        <TabContainer appState={this.props.appState} setActiveTab={this.props.setActiveTab} closeTab={this.props.closeTab}/>
        {editorArr}
      </ride-pane>
    )
  }
}