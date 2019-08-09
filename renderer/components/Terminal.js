import React from 'react';
import { Terminal } from 'xterm';
import * as fit from 'xterm/lib/addons/fit/fit';
import path from 'path';
const { runTerminal } = require('../../nodeTerminal.js');
Terminal.applyAddon(fit);
let term = new Terminal({
  theme: { background: '#090c0f' },
  rendererType: 'dom'
});

//Declare terminal for use throughout the component lifecycle
class XTerm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currCommand: '',
      cwd: this.props.rootdir,
      pastCommands: [],
      commandIndex: 0,
      cursorIndex: -1,
      rootDir: this.props.rootdir
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.rootdir !== this.state.cwd && prevProps.rootdir !== this.props.rootdir) {
      //Perform some operation
      this.setState({ cwd: prevProps.rootdir, rootDir: prevProps.rootdir }, () => {
        term.clear();
        term.write(this.state.cwd + '\r\n' + '$');
        shell.cd(this.state.cwd);
      });
    }
  }
  // //Compare rootdir being passed to determine whether or not we need to render a new terminal
  // //with a different rootpath
  // componentWillReceiveProps(nextProps) {
  //   console.log('terminal next props' , nextProps)
  //   console.log('terminal this props' , this.props)
  //   if (nextProps.rootdir !== this.state.cwd && nextProps.rootdir !== this.props.rootdir) {
  //     //Perform some operation
  //     this.setState({ cwd: nextProps.rootdir, rootDir: nextProps.rootdir }, () => {
  //       term.clear();
  //       term.write(this.state.cwd + '\r\n' + '$');
  //       shell.cd(this.state.cwd);
  //     });
  //   }
  // }
  componentDidMount() {
    //Set up some terminal options
    term.setOption('cursorStyle', 'block');
    term.setOption('cursorBlink', true);
    term.setOption('fontSize', 14);
    //Grab div from the DOM to render terminal
    term.open(document.getElementById('terminal'));
    let greeting = '';
    term.fit();
    //On keypress, execute. Switch case to handle the enter, lft, rght, up, down arrow and normal keys
    term.on('key', (key, ev) => {
      const fileManipulation = new Set(['cp', 'mkdir', 'touch', 'rm', 'rmdir', 'mv']);
      switch (ev.keyCode) {
        //When a user hits enter, clean up the input for execution of the command within node child_process
        case 13:
          let output;
          let command = this.state.currCommand;
          let newPath;
          //Check for cd to be handled on the front-end without communication with spawn
          if (command.split(' ')[0] === 'cd' && command.split(' ').length === 2) {
            newPath = path.join(this.state.cwd, command.split(' ')[1]);
            this.setState({ cwd: newPath });
            greeting = newPath;
            term.write('\r\n' + greeting + '\r\n');
            term.write('$');
            //Check for cd with other options, strip the cd command away and run the rest of the command in spawn
          } else {
            if (command.split(' ')[0] === 'cd' && command.split(' ').length > 2) {
              newPath = path.join(this.state.cwd, command.split(' ')[1]);
              this.setState({ cwd: newPath });
              greeting = newPath;
              command = command.split(' ').slice(2).join(' ');
            }
            output = runTerminal(this.state.cwd, command, term);
            if (Promise.resolve(output) === output) {
              output.then(() => {
                if (fileManipulation.has(command.split(' ')[0])) {
                  this.props.cb_setFileTree(this.state.rootDir);
                }
              })
                .catch(err => {
                  console.log(err);
                })
            }
          }
          //Clear state for the next command
          this.setState({ currCommand: '' });
          break;
        //When a backspace is hit, write it, then delete the latest char from the curr Command
        case 8:
          term.write('\b \b');
          this.setState({ currCommand: this.state.currCommand.slice(0, -1) });
          break;
        default:
          //Disable left and right keys from changing state, only allow them to change how the terminal looks
          if (ev.keyCode === 37) {
            term.write(key);
            this.setState({ cursorIndex: this.state.cursorIndex - 1 })
          } else if (ev.keyCode === 39) {
            term.write(key);
            this.setState({ cursorIndex: this.state.cursorIndex + 1 });
          }
          else {
            term.write(key);
            this.setState({ currCommand: this.state.currCommand + key, cursorIndex: this.state.cursorIndex + 1 });
          }
      }
    })
  }
  componentWillUnmount() {
    term.destroy();
    term = new Terminal({
      theme: { background: '#090c0f' }
    });
    term.write(this.state.cwd + '\r\n' + '$');
  }
  render() {
    // const divStyle = {
    //   height: '40%',
    //   width: '105%'
    // }
    return (
      <div id='terminal' />
    )
  }
}
export default XTerm;