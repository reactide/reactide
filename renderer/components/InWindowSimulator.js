import React from 'react';

class InWindowSimulator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url : 'about:blank'
    }
  }
  componentDidUpdate(prevProps) {
    if(prevProps.url !== this.state.url) {
      this.setState({url: this.props.url});
    }
  }
  render() {
    const style = {
      height: '60%',
      width: '100%',
      borderWidth: '0px',
    }
      return (
        <div>
          <iframe style = {style} src={this.state.url}></iframe>
        </div>
      )
  }
}
export default InWindowSimulator;
