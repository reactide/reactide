import React, { Component } from 'react';

export default class AppRoot extends Component {
  // we can't use `connect` in this component, so must do naiively:

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div>
        <h1>This is just an empty demo</h1>
        <p>(Run the tests.)</p>
      </div>
    );
  }
}
