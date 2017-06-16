import React from 'react';
import TextEditor from './TextEditor';
import TabContainer from './TabContainer';
import PropTypes from 'prop-types';

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

TextEditorPane.propTypes = {
  appState: PropTypes.object.isRequired,
  addEditorInstance: PropTypes.func.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  closeTab: PropTypes.func.isRequired
}

export default TextEditorPane;