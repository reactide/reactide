import React, { PropTypes } from 'react';
import TextEditor from './TextEditor.jsx';
import TabContainer from './TabContainer.jsx';

export default function TextEditorPane ({appState, addEditorInstance, setActiveTab, closeTab}) {
  const openTabs = appState.openTabs || []
  return (
    <ride-pane>
      <TabContainer
        appState={appState}
        setActiveTab={setActiveTab}
        closeTab={closeTab}
      />
      {openTabs.map(tab => (
        <TextEditor
          key={tab.id}
          id={tab.id}
          tab={tab}
          activeTab={appState.activeTab}
          addEditorInstance={addEditorInstance}
        />
      ))}
    </ride-pane>
  )
}

TextEditorPane.propTypes = {
  appState: PropTypes.shape({
    openTabs: PropTypes.array,
  }).isRequired,
  addEditorInstance: PropTypes.func,
  setActiveTab: PropTypes.func,
  closeTab: PropTypes.func,
}

TextEditorPane.defaultProps = {
  addEditorInstance: () => {},
  setActiveTab: () => {},
  closeTab: () => {},
}
