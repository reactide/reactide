<p align="center"><a href='http://reactide.io/'><img alt="reactide" src="https://i.imgur.com/HRNmuJs.png" width="30%"></a></p>

[![GitHub license](https://img.shields.io/github/license/reactide/reactide)](https://github.com/reactide/reactide/blob/master/LICENSE.txt) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/reactide/reactide/pulls)

### Reactide is the first dedicated IDE for React web application development.
Reactide is a cross-platform desktop application that offers a simulator, made for live reloading and quick React component prototyping. React brings an integrated suite of development tools to streamline react development. The days of flipping between browser, IDE, and server are over.

#### Reactide is in active development. Please follow this repo for contribution guidelines and our development road map.

##
<p align="center">
  <img alt="Reactide Screenshot" src="https://i.imgur.com/A29J8fs.jpg">

</p>

## Get right to coding
Reactide runs an integrated Node server and custom browser simulator. As projects evolve, the developer can continually track changes through live reloading directly in the development environment without the need for constant flipping to the browser. Reactide also offers integration with Create React App for faster project boilerplate configuration. The simulator and component tree are both functioning for all React applications.

## State flow visualization.
Managing state across a complex React application is the biggest pain point of developing React apps. Reactide offers a visual component tree that dynamically loads and changes based on components within the working directory while giving information about props and state at every component. By navigating through a live-representation of the architecture of a project, developers can quickly identify and pinpoint the parent-child relationships of even the most complex applications.

The component tree works out-of-the-box by finding the entry point to your React application that you provide inside the reactide.config.js file.

## Integrated Terminal for powerful commands and workflows
The terminal is the life and blood of any IDE, allowing for complex manipulation of the file system, node, and even build-tools. Reactide offers a compatible terminal for running commands in bin/bash for Unix, and cmd for Windows to provide powerful workflows to even seasoned developers.

## Getting Started with Reactide
The Reactide IDE can be set up in two ways, the first is to bundle the electron app and run it as a native desktop App. The instructions are as follows:

1. go to your terminal and type the following:
```
git checkout 3.0-release
npm install
npm run webpack-production
npm run electron-packager
```
2. in your Reactide folder, navigate to the release-builds folder and double-click on Reactide (executable).

## To check out Reactide in developer mode follow these instructions:
1. go to your terminal and type the following:
```
git checkout 3.0-release
npm install
npm run webpack-production
npm start
```

## Setting up the Simulator
In order to take advantage of the live simulator, please follow the below steps in your project directory. 

1. Go to the reactide.config.js file and change the .html and .js entry points to the relative path of your respective files. 
2. In the terminal run: `npm run reactide-server`

For any questions, please look at the example project in the example folder for how to set-up webpack and dev-server.

## Contributors
[Jin Choi](https://github.com/jinihendrix) | [Mark Marcelo](https://github.com/markmarcelo) | [Bita Djaghouri](https://github.com/bitadj) | [Pablo Lee](https://github.com/pablytolee) | [Ryan Yang](https://github.com/ryany1819) | [Oscar Chan](https://github.com/chanoscar0) | [Juan Hart](https://github.com/juanhart1) | [Eric Pham](https://github.com/EP36) | [Khalid Umar](https://github.com/khalid050) | [Rocky Liao](https://github.com/seemsrocky)
