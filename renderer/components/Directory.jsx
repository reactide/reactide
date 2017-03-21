import React from 'react';
import File from './File.jsx';

export default class Directory extends React.Component {
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
    let uniqueId;
    for (var i = 0; i < this.props.directory.subdirectories.length; i++) {
      arr.push(
        <Directory 
          key={this.props.directory.subdirectories[i].id} 
          id={this.props.directory.subdirectories[i].id} 
          directory={this.props.directory.subdirectories[i]} 
          openFile={this.props.openFile}
          clickHandler={this.props.clickHandler}
          selected={this.props.selected}
        />)
    }
    for (var i = 0; i < this.props.directory.files.length; i++) {
      arr.push(
        <File 
          key={this.props.directory.files[i].id} 
          id={this.props.directory.files[i].id} 
          file={this.props.directory.files[i]} 
          openFile={this.props.openFile}
          clickHandler={this.props.clickHandler}
          selected={this.props.selected}
        />)
    }
    if (this.props.directory.opened) {
      return (
        <li className={this.props.selected.id === this.props.id ? 'list-nested-item selected' : 'list-nested-item'}>
          <div
            className="list-item"
            onClick={this.props.clickHandler.bind(null, this.props.id, this.props.directory.path, this.props.directory.type)}
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
          className={this.props.selected.id === this.props.id ? 'list-nested-item collapsed selected' : 'list-nested-item collapsed'}
          onClick={this.props.clickHandler.bind(null, this.props.id, this.props.directory.path, this.props.directory.type)}
        >
          <div className="list-item">
            <span className="icon icon-file-directory">{this.props.directory.name}</span>
          </div>
        </li>
      )
    }
  }
}