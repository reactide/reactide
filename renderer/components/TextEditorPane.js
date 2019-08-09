import React from 'react';
import TextEditor from './TextEditor';
import TabContainer from './TabContainer';
import PropTypes from 'prop-types';

const TextEditorPane = ({ appState, setActiveTab, closeTab, onEditorValueChange, cbOpenSimulator_Main, cbOpenSimulator_Ext }) => {
  // const editorArr = [];
  // if (Object.keys(appState.openTabs).length > 0) {
  //   //console.log(appState.previousPaths[appState.previousPaths.length-1]);
  //   editorArr.push(
  //     <TextEditor
  //       path={appState.previousPaths[appState.previousPaths.length-1]}
  //       onValueChange={onEditorValueChange}
  //     />);
  // }

  return (
    <ride-pane>
      {Object.keys(appState.openTabs).length > 0 &&
        <React.Fragment>
          <TextEditor
            path={appState.previousPaths[appState.previousPaths.length - 1]}
            onValueChange={onEditorValueChange}
          />
        </React.Fragment>
      }
    </ride-pane>
  );
};

TextEditorPane.propTypes = {
  appState: PropTypes.object.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  closeTab: PropTypes.func.isRequired
};

export default TextEditorPane;
