import * as types from '../constants/actionType';
import * as typeAPI from '../constants/actionAPI';
import axios from 'axios';
import { message } from 'antd';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
// var moment = require('moment');
// var dateFormat = require('dateformat');
// var now = new Date();
// api

export function requestGetEvent() {
    return (dispatch) => {
        dispatch(requestLoading());
        return axios.request({
            method: 'GET',
            url: `${typeAPI.API_URL}/api/v1/bookrooms`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            dispatch(receiveData(types.REQUEST_GET_EVENTS, response.data.data))
        }).catch(function (error) {
            // noteError(error);
            dispatch(requestRejected(error));
        })
    }
}
// add tour 
export function requestAddEvents(data) {
    // let email = '';
    // data.value.forEach((i, index, item) => {
    //     if (index === item.length - 1) {
    //         email += `${item[index].key}`;
    //     } else {
    //         email += `${item[index].key},`;
    //     }
    // })
    // console.log(email);
    let formDataObject = {};
    if (data.checkbox === true) {
        let arrayDay = '';
        data.byweekday.forEach((i, index, item) => {
            if (index === item.length - 1) {
                arrayDay += `${item[index]}`;
            } else {
                arrayDay += `${item[index]},`;
            }
        })
        formDataObject = {
            'room_id': data.rooms,
            'title': data.title,
            'content': data.content,
            'user_id': cookies.get('data').id,
            'daystart': data.dateStart,
            'timestart': data.timestart,
            'timeend': data.timeend,
            'repeatby': data.choice,
            'interval': 1,
            'count': data.count,
            'byweekday': data.choice === 'weekly' ? arrayDay : ''
        }
    } else {
        if (data.is_quickly) {
            formDataObject = {
                'room_id': data.rooms,
                'content': data.content,
                'user_id': cookies.get('data').id,
                'daystart': data.daystart,
                'timestart': data.timestart,
                'timeend': data.timeend,
                'title': data.title,
                // 'mail': 'vanphudhsp2015@gmail.com'
            }
        } else {
            formDataObject = {
                'room_id': data.rooms,
                'content': data.content,
                'user_id': cookies.get('data').id,
                'daystart': data.dateStart,
                'timestart': data.timestart,
                'timeend': data.timeend,
                'title': data.title,
                // 'mail': 'vanphudhsp2015@gmail.com'
            }
        }

    }
    return (dispatch) => {
        return axios.request({
            method: 'POST',
            url: `${typeAPI.API_URL}/api/v1/bookrooms`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            },
            data: formDataObject
        }).then(function (response) {
            if (response.data.original === "Thời gian đặt không hợp lệ") {
                message.warning('Trùng Lịch Đặt');
                dispatch(receiveData(types.REQUEST_DISTICNT_EVENT, true))
            } else {
                message.success('Thêm Sự Kiện Thành Công');
                dispatch(receiveData(types.REQUEST_ADD_EVENT, response.data.data))
            }
        }).catch(function (error) {

            dispatch(requestRejected(error));
        })
    }
}
export function requestDeleteEvent(id) {
    return (dispatch) => {
        return axios.request({
            method: 'DELETE',
            url: `${typeAPI.API_URL}/api/v1/bookrooms/${id}`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            },
        }).then(function (response) {
            message.success('Xóa Sự Kiện Thành Công');
            dispatch(receiveData(types.REQUEST_DELETE_EVENT, id))
        }).catch(function (error) {
            if (error.response) {
                console.log(error.response);
            }
            dispatch(requestRejected(error));
        })
    }
}
export function requestUpdateEvent(data) {
    let formDataObject = {};
    if (data.is_resize) {
        if (data.is_drop) {
            formDataObject = {
                'daystart': data.daystart,
                'timestart': data.timestart,
                'timeend': data.timeend,
            }
        } else {
            formDataObject = {
                'timeend': data.timeEnd
            }
        }
    } else {
        if (data.checkbox === true) {
            let arrayDay = '';
            if (data.byweekday !== null) {
                data.byweekday.forEach((i, index, item) => {
                    if (index === item.length - 1) {
                        arrayDay += `${item[index]}`;
                    } else {
                        arrayDay += `${item[index]},`;
                    }
                })
            }
            formDataObject = {
                'room_id': data.rooms,
                'content': data.cotent,
                'title': data.title,
                'user_id': cookies.get('data').name,
                'daystart': data.dateStart,
                'timestart': data.timestart,
                'timeend': data.timeend,
                'check': '1',
                'repeatby': data.choice,
                'interval': 1,
                'count': data.count,
                'byweekday': data.choice === 'weekly' ? arrayDay : ''
            }
        } else {
            formDataObject = {
                'room_id': data.rooms,
                'content': data.title,
                'user_id': cookies.get('data').name,
                'daystart': data.dateStart,
                'timestart': data.timestart,
                'timeend': data.timeend,
                'check': '0'
            }
        }
    }

    return (dispatch) => {
        return axios.request({
            method: 'PUT',
            url: `${typeAPI.API_URL}/api/v1/bookrooms/${data.id}`,
            params: formDataObject,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            },
        }).then(function (response) {
            message.success('Sửa Sự Kiện Thành Công');
            dispatch(receiveData(types.REQUEST_UPDATE_EVENT, response.data.data))
        }).catch(function (error) {
            dispatch(requestRejected(error));
        })
    }
}
// filter event rooms

export function requestGetEventByRoom(id) {
    return (dispatch) => {
        dispatch(requestLoading());
        return axios.request({
            method: 'GET',
            url: `${typeAPI.API_URL}/api/v1/getbrbyid/${id}`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            dispatch(receiveData(types.REQUEST_FILTER_EVENT_ROOM, response.data.data))
        }).catch(function (error) {
            dispatch(requestRejected(error));
        })
    }
}
// research 
export function requestSearchEvent(data) {
    let params = {
        'daystart': data.dateStart,
        'timestart': data.timestart,
        'timeend': data.timeend
    }
    return (dispatch) => {
        dispatch(requestLoading());
        return axios.request({
            method: 'GET',
            url: `${typeAPI.API_URL}/api/v1/admin/getbrbyday`,
            params,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            },
        }).then(function (response) {
            if (response.data.data.length > 0) {
                dispatch(receiveData(types.REQUEST_RESEARCH, response.data.data));
            } else {
                message.warning('Không có lịch nào trong khoảng thời gian này !!!');
            }
        }).catch(function (error) {
            dispatch(requestRejected(error));
        })
    }
}
// add tour 
export function requestDeleteException(data) {
    let formDataObject = {};
    formDataObject = {
        'content': data.content,
        'day': data.day,
        'timestart': data.timestart,
        'timeend': data.timeend,
        'title': data.title,
    }
    return (dispatch) => {
        return axios.request({
            method: 'POST',
            url: `${typeAPI.API_URL}/api/v1/deletebrrepeat/${data.id}`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            },
            data: formDataObject
        }).then(function (response) {
            dispatch(receiveData(types.REQUEST_DELETE_EVENT_EXCEPTION, response.data.data));
        }).catch(function (error) {
            dispatch(requestRejected(error));
        })
    }
}
export function requestEditException(data, day) {

    let formDataObject = {};
    formDataObject = {
        'content': data.content,
        'day': day,
        'timestart': data.timestart,
        'timeend': data.timeend,
        'title': data.title,
    }

    return (dispatch) => {
        return axios.request({
            method: 'POST',
            url: `${typeAPI.API_URL}/api/v1/editbrrepeat/${data.id}`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            },
            data: formDataObject
        }).then(function (response) {
            message.success('Sửa Ngoại Lệ Thành Công');
            dispatch(receiveData(types.REQUEST_EDIT_EVENT_EXCEPTION, response.data.data));
        }).catch(function (error) {
            dispatch(requestRejected(error));
        })
    }
}
export function requestLoading() {
    return { type: types.REQUEST_LOADING };
}
export function requestRejected(response) {
    return { type: types.REQUEST_REJECTED, payload: response };
}
export function receiveData(type, payload) {
    return { type: type, payload };
}
export function requestAddEventDispatch(data) {
    return (dispatch) => {
        dispatch(receiveData(types.REQUEST_ADD_EVENT, data))
    }
}