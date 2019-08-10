import React from 'react'

const {ipcRenderer } = require('electron');

const createNewProj = ()=> ipcRenderer.send('createNewProj')
const openProject = () => ipcRenderer.send('openExistingProject')

const WelcomePage = ()=>{
    return(
        <div id='welcome-page'>
            <h1>Hello world!</h1>
            <p onClick={createNewProj}>Create new project</p>
            <p onClick ={openProject}>Open Existing Project</p>
        </div>
    )
}



export default WelcomePage