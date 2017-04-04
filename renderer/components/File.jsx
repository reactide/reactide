import React, { PureComponent, PropTypes } from 'react';
import cx from 'classnames';
import RenameForm from './RenameForm.jsx';

export default class File extends PureComponent {
  handleOpenFile = proxyEvent => (
    this.props.openFile(
      this.props.file,
      proxyEvent
    )
  )

  handleClick = proxyEvent => (
    this.props.clickHandler(
      this.props.id,
      this.props.file.path,
      this.props.file.type,
      proxyEvent
    )
  )

  render() {
    const {file, selectedItem, id, rename, renameHandler} = this.props
    return (
      <li
        className={cx('list-item', {selected: selectedItem.id === id})}
        onDoubleClick={this.handleOpenFile}
        onClick={this.handleClick}>
        {rename && selectedItem.id === id ?
          <RenameForm renameHandler={renameHandler} /> :
          <span className="icon icon-file-text">{file.name}</span>
        }
      </li>
    )
  }
}

File.propTypes = {
  openFile: PropTypes.func.isRequired,
  clickHandler: PropTypes.func.isRequired,
  renameHandler: PropTypes.func.isRequired,
  file: PropTypes.object.isRequired,
  selectedItem: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  rename: PropTypes.bool.isRequired,
}
