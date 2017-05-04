// Editor Pane
let nextTabId = 0;
export const addTab = fileSource => ({
  type: 'ADD_TAB',
  tabId: nextTabId++,
  fileSource,
});

export const toggleActiveTab = tabId => ({
  type: 'TOGGLE_ACTIVE_TAB',
  tabId,
});

export const moveTab = (tabId, tabIndex) => ({
  type: 'MOVE_TAB',
  tabId,
  tabIndex,
});

export const closeTab = tabId => ({
  type: 'CLOSE_TAB',
  tabId,
});

export const openProject = projectPath => ({
  type: 'OPEN_PROJECT',
  projectPath,
});

export const saveFile = () => ({
  type: 'SAVE_FILE',
});

export const toggleModified = tabId => ({
  type: 'TOGGLE_MODIFIED',
  tabId,
});


// App
export const openProjectFile = fileSource => ({
  type: 'OPEN_PROJECT_FILE',
  fileSource,
});

export const openBrowserSimulator = () => ({
  type: 'OPEN_BROWSER_SIMULATOR',
});

