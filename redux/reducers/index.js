import { combineReducers } from 'redux';
/* Reducers */
import authReducer from './authReducer';
import chatReducer from './chatReducer';

export default combineReducers({
    auth: authReducer,
    chat: chatReducer
});