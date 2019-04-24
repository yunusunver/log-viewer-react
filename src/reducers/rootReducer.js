import { combineReducers } from 'redux'
const initialState={
    file:[],
    ignore:false
}

const rootReducer = (state=initialState,action) => {
    switch (action.type) {
        case 'READ_FILE':
            state = {
                ...state,
                file:action.payload
            }
            break;
        case 'IGNORE_CASE':
            state={
                ...state,
                ignore:action.payload
            }
            break;
        default:
            break;
    }
    return state;
}

export default combineReducers({
    rootReducer: rootReducer
});