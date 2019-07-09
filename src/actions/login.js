import axios from 'axios';
import { message } from 'antd';
import * as types from '../constants/actionType';
import * as API from '../constants/actionAPI';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
export function requestGetLogin(data) {
  let token = {
    'token': data.Zi.access_token,
    'email': data.profileObj.email
  }
  return (dispatch) => {
    return axios.request({
      method: 'POST',
      url: `${API.API_URL}/api/v1/auth/google`,
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
      },
      data: token
    }).then(function (response) {
      if (response !== undefined) {
        cookies.set('token', response.data.access_token);
        axios.request({
          method: 'GET',
          url: `${API.API_URL}/api/v1/me`,
          headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
            'Authorization': `${'bearer  ' + response.data.access_token}`
          }
        }).then(function (response) {
          if (response) {
            cookies.set('data', response.data.data);
            message.success('Đăng Nhập Thành Công !!');
            dispatch(receiveData(types.REQUEST_LOGIN, response.data.data))
          }
        })
      }
    }).catch(function (error) {
      if (error.response) {
        if (error.response.data.title === 'Validation Error') {
          message.error('Bạn không phải thành viên GreenGlobal');
        }
      }

    })
  }
}
// logout
export function requestLogout(token) {
  return (dispatch) => {
    return axios.request({
      method: 'GET',
      url: `${API.API_URL}/api/v1/auth/logout`,
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
        'Authorization': `${'bearer ' + token}`
      }
    }).then(function (response) {
      message.success('Đăng Xuất Thành Công!');
      dispatch(receiveData(types.REQUEST_LOGOUT, response))
    }).catch(function (error) {
      console.log(error);
    })
  }
}
// check login
// add room
export function requestCheckLogin() {
  return (dispatch) => {
    return axios.request({
      method: 'GET',
      url: `${API.API_URL}/api/v1/me`,
      headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json',
        'Authorization': `${'bearer ' + cookies.get('token')}`
      },
    }).then(function (response) {
      dispatch(receiveData(types.REQUEST_CHECK_LOGIN, response.data))
    }).catch(function (error) {
      console.log(error);

    })
  }
}
export function receiveData(action, payload) {
  return { type: action, payload };
}
