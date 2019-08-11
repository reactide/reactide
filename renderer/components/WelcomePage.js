import React from 'react'
const {ipcRenderer} = require('electron');


const createNewProj = ()=> ipcRenderer.send('createNewProj')
const openProject = () => ipcRenderer.send('openExistingProject')


const openReactideSite = ()=> ipcRenderer.send('openReactideSite')
const openGithub = () => ipcRenderer.send('openGithub')


const WelcomePage = ()=>{
    console.log(__dirname + '../splash')

    return(
        <div id='welcome-page'>
            <h2 class='welcome-heading'>Start</h2>
            <div class='create-project'>
                <p onClick={createNewProj}>Create new project</p>
                <p onClick ={openProject}>Open Existing Project</p>
            </div>
            <div class='help-heading'>
                <h2>Help</h2>
                <p onClick={openReactideSite}>Setup existing project</p>
                <p onClick={openGithub}> Github Repository</p>
            </div>

        </div>
    )
}

export default WelcomePage