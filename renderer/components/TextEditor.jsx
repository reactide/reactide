import React from 'react';
import CodeMirror from 'codemirror';

export default class TextEditor extends React.Component {
  constructor() {
    super();
    
  }
  componentDidMount() {
    const elem = document.getElementsByTagName('textarea')[0];
    let codeMirror = new CodeMirror.fromTextArea(elem, { mode: 'javascript' });
  }

  render() {
    return (
      <div>
        <h1> HELLO WORLD </h1>
        <textarea style={{ height: '500px', width: '500px', backgroundColor: 'grey' }} ></textarea>
      </div>
    )
  }
}