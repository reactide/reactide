import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import style from './style.js'
import ErrorStackParser from 'error-stack-parser'
import assign from 'object-assign'
import {isFilenameAbsolute, makeUrl, makeLinkText} from './lib'

export class RedBoxError extends Component {
  static propTypes = {
    error: PropTypes.instanceOf(Error).isRequired,
    filename: PropTypes.string,
    editorScheme: PropTypes.string,
    useLines: PropTypes.bool,
    useColumns: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
  }
  static displayName = 'RedBoxError'
  static defaultProps = {
    useLines: true,
    useColumns: true
  }
  renderFrames (frames) {
    const {filename, editorScheme, useLines, useColumns} = this.props
    const {frame, file, linkToFile} = assign({}, style, this.props.style)
    return frames.map((f, index) => {
      let text
      let url

      if (index === 0 && filename && !isFilenameAbsolute(f.fileName)) {
        url = makeUrl(filename, editorScheme)
        text = makeLinkText(filename)
      } else {
        let lines = useLines ? f.lineNumber : null
        let columns = useColumns ? f.columnNumber : null
        url = makeUrl(f.fileName, editorScheme, lines, columns)
        text = makeLinkText(f.fileName, lines, columns)
      }

      return (
        <div style={frame} key={index}>
          <div>{f.functionName}</div>
          <div style={file}>
            <a href={url} style={linkToFile}>{text}</a>
          </div>
        </div>
      )
    })
  }
  render () {
    const {error, className} = this.props
    const {redbox, message, stack, frame} = assign({}, style, this.props.style)

    let frames
    let parseError
    try {
      frames = ErrorStackParser.parse(error)
    } catch (e) {
      parseError = new Error('Failed to parse stack trace. Stack trace information unavailable.')
    }

    if (parseError) {
      frames = (
        <div style={frame} key={0}>
          <div>{parseError.message}</div>
        </div>
      )
    } else {
      frames = this.renderFrames(frames)
    }

    return (
      <div style={redbox} className={className}>
        <div style={message}>{error.name}: {error.message}</div>
        <div style={stack}>{frames}</div>
      </div>
    )
  }
}

// "Portal" component for actual RedBoxError component to
// render to (directly under body). Prevents bugs as in #27.
export default class RedBox extends Component {
  static propTypes = {
    error: PropTypes.instanceOf(Error).isRequired
  }
  static displayName = 'RedBox'
  componentDidMount () {
    this.el = document.createElement('div')
    document.body.appendChild(this.el)
    this.renderRedBoxError()
  }
  componentDidUpdate () {
    this.renderRedBoxError()
  }
  componentWillUnmount () {
    ReactDOM.unmountComponentAtNode(this.el)
    document.body.removeChild(this.el)
    this.el = null
  }
  renderRedBoxError () {
    ReactDOM.render(<RedBoxError {...this.props}/>, this.el)
  }
  render () {
    return null
  }
}
