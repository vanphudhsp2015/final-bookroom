import axios from 'axios';
import { message } from 'antd';
import * as types from '../constants/actionType';
import * as API from '../constants/actionAPI';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
export function requestGetLogin(data) {
    
    let token = {
        'token': data.accessToken,
        'email': data.profileObj.email
    }
    return (dispatch) => {
        return axios.request({
            method: 'POST',
            url: `${API.API_URL}/auth/google`,
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
                    url: `${API.API_URL}/me`,
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
                cookies.remove('accessToken');
                cookies.remove('APISID');
                cookies.remove('G_AUTHUSER_H');
                cookies.remove('HSID');
                cookies.remove('NID');
                cookies.remove('SAPISID');
                cookies.remove('SID');
                cookies.remove('SIDCC');
                cookies.remove('SSID');
                if (error.response.data.title === 'Validation Error') {
                    cookies.remove('token');
                    cookies.remove('data');
                    cookies.remove('accessToken');
                    cookies.remove('APISID');
                    cookies.remove('G_AUTHUSER_H');
                    cookies.remove('HSID');
                    cookies.remove('NID');
                    cookies.remove('SAPISID');
                    cookies.remove('SID');
                    cookies.remove('SIDCC');
                    cookies.remove('SSID');
                    message.error('Bạn không phải thành viên GreenGlobal');

                }
            }

        })
    }
}
// logout
export function requestLogout(data) {
    let body = {
        'token': data
    }
    return (dispatch) => {
        return axios.request({
            method: 'POST',
            url: `${API.API_URL}/auth/logout`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            },
            data: body
        }).then(function (response) {
            cookies.remove('token');
            cookies.remove('data');
            cookies.remove('accessToken');
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
            url: `${API.API_URL}/me`,
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

