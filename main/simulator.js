"use strict";

const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { BrowserWindow } = require("electron");

const simulator = root => {
  const WIDTH = 800;
  const HEIGHT = 600;
  //Deserialize project info from projInfo file, contains path to index.html and presence of webpack among other things
  const projInfo = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../lib/projInfo.js"))
  );

  //Dynamic simulation
  if (projInfo.hotLoad) {
    let child = exec(
      "npm start",
      {
        cwd: projInfo.rootPath
      },
      (err, stdout, stderr) => {
        let child = new BrowserWindow({
          width: WIDTH,
          height: HEIGHT
        });
        child.loadURL("http://localhost:8080");
        child.toggleDevTools();
      }
    );
  } else if (projInfo.webpack) {
    let child = exec(
      "webpack",
      {
        cwd: projInfo.rootPath,
        shell: "/bin/bash"
      },
      (err, stdout, stderr) => {
        let child = new BrowserWindow({
          width: WIDTH,
          height: HEIGHT
        });
        child.loadURL("file://" + projInfo.htmlPath);
        child.toggleDevTools();
      }
    );
  } else if (projInfo.htmlPath) {
    let child = new BrowserWindow({
      width: WIDTH,
      height: HEIGHT
    });
    child.loadURL("file://" + projInfo.htmlPath);
    child.toggleDevTools();
  } else {
    console.log("No Index.html found");
  }
};

module.exports = simulator;
