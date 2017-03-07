const initialState = {};

const reducer = (state = initialState, action={type:'hello'}) => {
  switch (action.type) {
    case 'HELLO': (state = {}, action) => {
      return state;
    }
    default: return state;
  } 
}

export { reducer };