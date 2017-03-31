import * as types from '../actions/index'
// example
const initialState = {};

const reducer = (state = initialState, action={type:'hello'}) => {
  switch (action.type) {
    case 'HELLO': (state = {}, action) => {
      return state;
    }
    default: return state;
  } 
}

export default reducer;


// const initialState = [];

// const reducer = (state = initialState, action) => {
  
//   switch (action.type) {
//     case OPEN_FILE:
//       if (!tabIsOpen) {
//         return [...state, {
//           path: action.file.path,
//           id,
//         }];
//       }
//       return state;

//     case SET_ACTIVE_TAB:
//       return action.id

//     case CHECK_IF_OPEN:
//       return action.

//     case SAVE_TAB:
//       return action.

//     case ADD_EDITOR_INSTANCE:
//       return action.

//     case CLOSE_TAB:
//       return action.

//  // case 'HELLO': (state = {}, action) => {
//  //   return state;
//  // }
//         default: return state;
//   }
// }

// export default reducer;