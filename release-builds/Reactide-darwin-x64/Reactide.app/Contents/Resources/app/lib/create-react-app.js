const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
module.exports = (dest) => {

  //TODOS------------------>
  //1. Somehow, kill node processes when simulator exits
  //2. Update current directory, when folder is loaded in
  //3. Add spinner for build (STRETCH)

  //cwd is the destinations parent folder
  let cwd = path.dirname(dest);
  //Command is the terminal script for creating a create-react-app in the dest folder
  let command = 'npx create-react-app ' + path.basename(dest);
  //Execute terminal command, then add a .env file for skipping preflight check and disable default browser load, then send the 'openDir' event listener
  let child = exec(
    command,
    {
      cwd: cwd
    },
    (err, stdout, stderr) => {
      if(err) console.log(err);
      global.mainWindow.webContents.send('craOut', stdout)
      fs.writeFileSync(path.resolve(dest, '.env'), 'SKIP_PREFLIGHT_CHECK=true\nBROWSER=none', { encoding: 'utf8' }, (err) => {
        if(err) console.log(err);
      });
      global.mainWindow.webContents.send('openDir', dest);
    }
  );
}