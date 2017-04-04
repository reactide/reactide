import React, { PureComponent, PropTypes } from 'react';

export default class Tab extends PureComponent {
  handleSetActiveTab = proxyEvent => (
    this.props.setActiveTab(this.props.id, proxyEvent)
  )

  handleCloseTab = proxyEvent => (
    this.props.closeTab(this.props.id, proxyEvent)
  )

  render() {
    return (
      <li className="texteditor tab" onClick={this.handleSetActiveTab}>
        <div className="title">{this.props.name}</div>
        <div className="close-icon" onClick={this.handleCloseTab}></div>
      </li>
    )
  }
}

Tab.propTypes = {
  name: PropTypes.string,
  setActiveTab: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  closeTab: PropTypes.func.isRequired,
}

Tab.defaultProps = {
  name: '',
}
