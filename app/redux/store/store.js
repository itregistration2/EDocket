import { combineReducers, createStore, applyMiddleware } from 'redux'
import { generalReducer } from '../reducers/GeneralReducers';

import thunk from 'redux-thunk'
import { appReducer } from '../reducers/AppReducers';

const rootReducer = combineReducers({
    generalReducer,
    appReducer,

});
const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(thunk));
}
export default configureStore;