import React from 'react';
import TextEditor from './TextEditor.jsx'
import FileTree from './FileTree.jsx'


export default class App extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <FileTree />
        <TextEditor />
      </div>
    )
  }
}