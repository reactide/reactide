import React, { PureComponent, PropTypes } from 'react';

export default class DeletePrompt extends PureComponent {
  handleDeletePrompt = () => (
    this.props.deletePromptHandler(true)
  )

  handleCancelDeletePrompt = () => (
    this.props.deletePromptHandler(false)
  )

  render() {
    return (
      <div className="delete-prompt">
        <h1>Are you sure you want to delete {this.props.name}?</h1>
        <button onClick={this.handleCancelDeletePrompt}>NO</button>
        <button onClick={this.handleDeletePrompt}>YES</button>
      </div>
    )
  }
}

DeletePrompt.propTypes = {
  deletePromptHandler: PropTypes.func.isRequired,
  name: PropTypes.string,
}

DeletePrompt.defaultProps = {
  name: '',
}
