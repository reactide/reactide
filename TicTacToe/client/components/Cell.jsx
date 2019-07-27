import React,{ Component } from 'react';

class Cell extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <React.Fragment> 
        <button id={`${this.props.rowNum}${this.props.cellNum}`}onClick={this.props.handleClick}>
          {this.props.value}
        </button>
      </React.Fragment>
    )
  }
}

export default Cell;