const {exec, spawn} = require('child_process');
require('fix-path')();
/**
 * Takes in a command and current working directory from Terminal.js then runs and executes command using Node child process
 * @param {String} cwd Current working directory of the terminal
 * @param {String} command Command entered by the user
 * @param {Terminal} terminal Terminal instance to write messages to the pseudo terminal GUI
 */
const runTerminal = (cwd, command, terminal) => {
  //Clear weird case where command includes \r
  const basicCommands = ['cd', 'pwd', 'hostname', 'mkdir', 'ls', 'find', 'rmdir', 'less', 'cp', 'mv', 'pushd', 'popd', 'grep', 'xargs', 'cat', 'env', 'export', 'echo', 'man', 'apropos', 'chown', 'chmod', 'exit']
  if(command[0] === '\\'){
    command = command.slice(2);
  }
  //If not npm, just run an exec because its faster output
  if(command.split(' ')[0] !== 'npm' || basicCommands.includes(command.split(' ')[0])){
    return new Promise((resolve, reject) => {
      let child = exec(command, 
        {
          cwd: cwd
        });
        //when data is returned, write it to the terminal
      child.stdout.on('data', (data) => {
        terminal.write('\r\n' + data.toString().replace(/(\r\n|\n|\r)/gm," ") + ' \r\n');
      });
        //When child process is done executing, write a new prompt line in terminal
      child.on('close', (code) => {
        terminal.write('\r\n' + cwd + '\r\n');
        terminal.write('$');
        resolve();
      });
        //Error handling
      child.stderr.on('data', (data) => {
        terminal.write(data.toString() + '\r\n');
        reject();
      })
    })
      //If it is an npm command, use SPAWN for heavier computation
  } else{
    //user prompt to understand their command is running
    terminal.write('\r\n' + 'Running ' + command + '...' + '\r\n');
    //Create the child_process spawn with current working directory
    let child = spawn(command.split(' ')[0], command.split(' ').slice(1), {cwd: cwd, shell: true});
    //On data, write it to the terminal
    child.stdout.on('data', (data) => {
      let output = data.toString().replace(/(\r\n|\n|\r)/gm,"");
      terminal.write(output + '\r\n');
    });
    //on close, reprompt
    child.on('close', () => {
      terminal.write(cwd + '\r\n');
      terminal.write('$');
    })
  }
}
module.exports = {runTerminal}