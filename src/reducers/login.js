import * as types from '../constants/actionType';
const INITIAL_STATE = {
  isLogin: false,
  error: null,
  isToken: false,
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
    case types.REQUEST_CHECK_TOKEN:
      return Object.assign({}, state, {
        isToken: true
      })
    default:
      return state;
  }

}
