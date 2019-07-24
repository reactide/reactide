import React,{ Component } from 'react';
import Cell from './Cell.jsx'

class Row extends Component {
  constructor(props){
    super(props);
  }

  render(){
    let cells = [];
    for(let i = 0; i < 3; i += 1){
      cells.push(
        <Cell rowNum= {this.props.rowNum} cellNum = {i} value = {this.props.value[i]} handleClick = {this.props.handleClick}/>
      )
    }

    return (
      <div className='rows'> 
        {cells}
      </div>
    )
  }
}

export default Row;