import React from 'react';
import TextEditor from './TextEditor.jsx';
import TabContainer from './TabContainer.jsx';

const TextEditorPane = ({
  appState,
  addEditorInstance,
  setActiveTab,
  closeTab
}) => {
  const editorArr = [];
    for (var i = 0; i < appState.openTabs.length; i++) {
      editorArr.push(
        <TextEditor 
          key={appState.openTabs[i].id} 
          id={appState.openTabs[i].id} 
          tab={appState.openTabs[i]} 
          activeTab={appState.activeTab} 
          addEditorInstance={addEditorInstance}
        />);
    }
    return (
      <ride-pane>
        <TabContainer 
          appState={appState} 
          setActiveTab={setActiveTab} 
          closeTab={closeTab}
        />
        {editorArr}
      </ride-pane>
    )
}
export default TextEditorPane;