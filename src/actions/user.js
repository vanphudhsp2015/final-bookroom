import * as types from '../constants/actionType';
import { http } from '../libraries/http/http';
import { message } from 'antd';
export function requestGetUsers() {
  return (dispatch) => {
    return http.request({
      method: 'GET',
      url: `/admin/users`,
    }).then(function (response) {
      dispatch(receiveData(types.REQUEST_GET_USERS, response))
    }).catch(function (error) {
      message.error(error);
    })
  }
}
export function receiveData(action, payload) {
  return { type: action, payload };
}
