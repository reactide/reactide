<p align="center"><a href='http://reactide.io/'><img alt="reactide" src="http://reactide.io/images/reactide-header.png" height="60%" width="60%"></a></p>

### Reactide is the first dedicated IDE for React web application development.
Reactide is a cross-platform desktop application that offers a simulator, made for live reloading and quick React component prototyping. React brings an integrated suite of development tools to streamline react development. The days of flipping between browser, IDE, and server are over.

#### Reactide is in active development. Please follow this repo for contribution guidelines and our development road map.

##
<p align="center">
  <img alt="Reactide Screenshot" src="https://farm5.staticflickr.com/4911/44158127700_b8c3246b72_k.jpg">

</p>

## Get right to coding
Reactide runs an integrated Node server and custom browser simulator, which works best with Webpack and Webpack dev-server. As projects evolve, the developer can continually track changes through live reloading directly in the development environment without the need for constant flipping to the browser. Reactide also offers integration with Create React App for faster project boilerplate configuration. The simulator and component tree are both functioning for Create-React-App made applications.

## State flow visualization.
Managing state across a complex React application is the biggest pain point of developing React apps. Reactide offers a visual component tree that dynamically loads and changes based on components within the working directory while giving information about props and state at every component. By navigating through a live-representation of the architecture of a project, developers can quickly identify and pinpoint the parent-child relationships of even the most complex applications.

The component tree works by finding the entry point to your React application from the webpack.config.js file. It works out-of-the-box with Create React App.

## Integrated Terminal for powerful commands and workflows
The terminal is the life and blood of any IDE, allowing for complex manipulation of the file system, node, and even build-tools. Reactide offers a compatible terminal for running commands in bin/bash for Unix, and cmd for Windows to provide powerful workflows to even seasoned developers.

## Setting up Webpack dev-server to work with Simulator
In order to take advantage of the live simulator, please follow the below steps. We are assuming you have a basic webpack config file, which you can find an example of in our repo under the example folder.

1. `npm install webpack dev-server -D`
2. Go to your webpack.config.js file and add the following lines of code. Make sure you set the port to 8085.
```
    devServer: {
       publicPath: path.resolve(__dirname, '/build/'),
       port: 8085,
       hot: true,
     },
    plugins: [
       new webpack.HotModuleReplacementPlugin(),
     ],
    mode: 'development',
```
3. Go to your package.json and add the following scripts under the "scripts" object:
```
"dev-server": "webpack-dev-server"
```

4. Run this script in your terminal: 
```
npm run electron-packager
```
For any questions, please look at the example project in the example folder for how to set-up webpack and dev-server.

## Contributors
[Jin Choi](https://github.com/jinihendrix) | [Mark Marcelo](https://github.com/markmarcelo) | [Bita Djaghouri](https://github.com/bitadj) | [Pablo Lee](https://github.com/pablytolee) | [Ryan Yang](https://github.com/ryany1819) | [Oscar Chan](https://github.com/chanoscar0)
