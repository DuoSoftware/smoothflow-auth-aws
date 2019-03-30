import { combineReducers } from 'redux'
import {reducer as toastrReducer} from 'react-redux-toastr'
import UIHelperReducer from './uihelper.reducer'
import {UserReducer} from "./user.reducer";

export default combineReducers({
    'toastr': toastrReducer,
    'uihelper' : UIHelperReducer,
    'user' : UserReducer
})