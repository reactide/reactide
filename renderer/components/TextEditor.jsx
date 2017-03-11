import React from 'react';
import TabContainer from './TabContainer.jsx';

export default class TextEditor extends React.Component {
  constructor() {
    super();

  }

  render() {
    return (
      <div className="text-editor">
        <TabContainer />
        <div className="editor-container" id="editor-container"style={{ height:'100%', width:'100%', backgroundColor: 'grey' }} ></div>
      </div>
    )
  }
}