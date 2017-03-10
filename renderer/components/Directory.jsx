import React from 'react';
import File from './File.jsx';
import Subdirectory from './Subdirectory.jsx';

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
    for (var i = 0; i < this.props.directory.subdirectories.length; i++) {
      arr.push(<Subdirectory directory={this.props.directory.subdirectories[i]} />)
    }
    for (var i = 0; i < this.props.directory.files.length; i++) {
      arr.push(<File file={this.props.directory.files[i]} />)
    }
    if (this.state.clicked) {
      return (
        <div>
          <li onClick={this.click}>{this.props.directory.name}</li>
          <ul>{arr}</ul>
        </div>
      )
    } else {
      return (
        <div>
          <li onClick={this.click}>{this.props.directory.name}</li>
        </div>
      )
    }
  }
}