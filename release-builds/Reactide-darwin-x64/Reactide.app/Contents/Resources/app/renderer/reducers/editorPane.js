const initialState = {
  activeTab: undefined,
  tabs: [],
};

const tab = (state, action) => {
  switch (action.type) {
    case 'ADD_TAB':
      return {
        tabId: action.tabId,
        modified: false,
        fileSrouce: action.fileSource,
      };
    default:
      return state;
  }
};

const tabs = (state, action) => {
  switch (action.type) {
    case 'ADD_TAB':
      return [
        ...state,
        tab(undefined, action),
      ];
    default:
      return state;
  }
};

const editorPane = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TAB':
      return {
        activeTab: action.tabId,
        tabs: tabs(state.tabs, action),
      };
    case 'TOGGLE_ACTIVE_TAB':
      return Object.assign({}, state, {
        activeTab: action.tabId,
      });
    case 'CLOSE_TAB':
      // needs logic for reassigning active tabs when close tab equals active tab
      return Object.assign({}, state, {
        tabs: state.tabs.filter(tabObj => tabObj.tabId !== action.tabId),
      });
    default:
      return state;
  }
};

export default editorPane;
