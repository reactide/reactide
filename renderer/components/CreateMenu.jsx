import React from 'react';

export default class CreateMenu extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className="create-menu">
        <button className="create-button" onClick={()=>{console.log('createfile')}}>Create File</button>
        <button className="create-button" onClick={()=>{console.log('createdirectory')}}>Create Directory</button>
      </div>
    )
  }
} 