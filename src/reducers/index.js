import { combineReducers } from 'redux';
import EventReducer from './events';
import RoomReducer from './room';

import LoginReducer from './login';
import UserReducer from './user'
const rootReducer = combineReducers({
  event: EventReducer,
  room: RoomReducer,
  login: LoginReducer,
  user: UserReducer
});
export default rootReducer;
