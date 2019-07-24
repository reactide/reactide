import React,{ Component } from 'react';
import Row from './Row.jsx'

class Board extends Component {
  constructor(props){
    super(props);
    this.state = {
      rows : [['-','-','-'],['-','-','-'],['-','-','-']],
      playerMove: 'X',
    }
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    event.preventDefault();
    let cellPressed = event.target.id.split('');
    let rows = [...this.state.rows];
    rows[cellPressed[0]][cellPressed[1]] = this.state.playerMove;
    let playerMove = this.state.playerMove==='X' ? 'O' : 'X';
    let state = {rows,playerMove};
    this.setState(state);
  }

  render(){
    let rows = [];
    for(let i = 0; i < 3; i += 1){
      rows.push(
        <Row rowNum= {i} value = {this.state.rows[i]} handleClick = {this.handleClick}/>
      )
    }

    return (
      <div id='boardDoom'> 
        {rows}
      </div>
    );
  }
}

export default Board;