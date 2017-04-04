import React, { PureComponent, PropTypes } from 'react';

export default class CreateMenu extends PureComponent {
  handleCreateFileForm = () => (
    this.props.createForm(this.props.id, 'file')
  )

  handleCreateDirectoryForm = () => (
    this.props.createForm(this.props.id, 'directory')
  )

  render() {
    return (
      <div className="create-menu">
        <button
          className="create-button"
          onClick={this.handleCreateFileForm}>
          Create File
        </button>
        <button
          className="create-button"
          onClick={this.handleCreateDirectoryForm}>
          Create Directory
        </button>
      </div>
    )
  }
}

CreateMenu.propTypes = {
  id: PropTypes.number,
  createForm: PropTypes.func.isRequired,
}
