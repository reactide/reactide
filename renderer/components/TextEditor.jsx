import React from 'react';
import TabContainer from './TabContainer.jsx';

export default class TextEditor extends React.Component {
  constructor() {
    super();

  }

  render() {
    return (
      // <TabContainer />
      <div className="item-views">
        <div className="styleguide pane-item">
          <div
            className="editor-container"
            id="editor-container"
            style={{ height: '100%', width: '100%' }}
          ></div>
        </div>
      </div>
    );
  }
}