import React from 'react';
import File from './File.jsx';
import Directory from './Directory.jsx';

export default class Subdirectory extends React.Component {
  constructor() {
    super();
    this.state = {
      clicked: false
    }
    this.click = this.click.bind(this);
  }
  click() {
    this.setState({
      clicked: !this.state.clicked
    })
  }
  render() {
    const arr = [];
    for (var i = 0; i < this.props.directory.subdirectories.length; i++) {
      arr.push(<Directory key={'d'+i}  directory={this.props.directory.subdirectories[i]} openFile={this.props.openFile}/>)
    }
    for (var i = 0; i < this.props.directory.files.length; i++) {
      arr.push(<File key={'f'+i} file={this.props.directory.files[i]} openFile={this.props.openFile}/>)
    }
    if (this.state.clicked) {
      return (
        <li className="list-nested-item">
          <div
            className="list-item"
            onClick={this.click}
          >
            <span className="icon icon-file-directory">
              {this.props.directory.name}
            </span>
          </div>
          <ul className="list-tree">
            {arr}
          </ul>
        </li>
      )
    } else {
      return (
        <li
          className="list-nested-item collapsed"
          onClick={this.click}
        >
          <div className="list-item">
            <span className="icon icon-file-directory">
              {this.props.directory.name}
            </span>
          </div>
        </li>
      )
    }
  }
}