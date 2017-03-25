import React, { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      count: 0
    }

    this.clickHandler = this.clickHandler.bind(this);
  }
  clickHandler() {
    this.setState({
      count: ++this.state.count
    })
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2 onClick={this.clickHandler}>Welcome to REACTIDE dudes</h2>
          <h3>{this.state.count}</h3>
        </div>
      </div>
    );
  }
}

export default App;
