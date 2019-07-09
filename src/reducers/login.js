import * as types from '../constants/actionType';
const INITIAL_STATE = {
  isLogin: false,
  error: null,
  user: {}
}
export default function (state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case types.REQUEST_LOGIN:
      return Object.assign({}, state, {
        isLogin: true,
        user: action.payload
      })
    case types.REQUEST_CHECK_LOGIN:
      return Object.assign({}, state, {
        isLogin: true,
        user: action.payload
      })
    case types.REQUEST_LOGOUT:
      return Object.assign({}, state, {
        isLogin: false
      })
    default:
      return state;
  }

}
