import * as types from '../constants/actionType';
import * as typeAPI from '../constants/actionAPI';
import axios from 'axios';
import { message } from 'antd';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
var moment = require('moment');
var dateFormat = require('dateformat');
var now = new Date();
// api

export function requestGetEvent() {
    return (dispatch) => {
        dispatch(requestLoading());
        return axios.request({
            method: 'GET',
            url: `${typeAPI.API_URL}/bookrooms`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
            },
        }).then(function (response) {
            dispatch(receiveData(types.REQUEST_GET_EVENTS, response.data.data))
            if (response.data.data.length > 0) {
                response.data.data.forEach(data => {
                    if (data.attributes.daystart === dateFormat(now, 'yyyy-mm-dd')) {
                        if (moment(data.attributes.daystart + ' ' + data.attributes.timestart).diff(now, 'minutes') < 30) {
                            if (moment(data.attributes.daystart + ' ' + data.attributes.timestart).diff(now, 'minutes') === 30) {
                                console.log('Còn 30 phút nữa là cuộc họp ');
                                message.success('Còn 30 phút nữa là cuộc họp ' + data.attributes.content + ' bắt đầu ');
                            }
                            if (moment(data.attributes.daystart + ' ' + data.attributes.timestart).diff(now, 'minutes') === 0) {
                                message.success('Cuộc họp ' + data.attributes.content + 'đang bắt đầu ');
                            }
                        }
                    }
                })
            }
        }).catch(function (error) {
            // noteError(error);
            dispatch(requestRejected(error));
        })
    }
}
// add tour 
export function requestAddEvents(data) {
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
            'content': data.title,
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
        formDataObject = {
            'room_id': data.rooms,
            'content': data.title,
            'user_id': cookies.get('data').id,
            'daystart': data.dateStart,
            'timestart': data.timestart,
            'timeend': data.timeend
        }
    }
    return (dispatch) => {
        return axios.request({
            method: 'POST',
            url: `${typeAPI.API_URL}/bookrooms`,
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
            url: `${typeAPI.API_URL}/bookrooms/${id}`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            },
        }).then(function (response) {
            message.success('Xóa Sự Kiện Thành Công');
            dispatch(receiveData(types.REQUEST_DELETE_EVENT, id))
        }).catch(function (error) {
            // noteError(error);
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
                'content': data.title,
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
            url: `${typeAPI.API_URL}/bookrooms/${data.id}`,
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
            url: `${typeAPI.API_URL}/getbrbyid/${id}`,
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
            url: `${typeAPI.API_URL}/admin/getbrbyday`,
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
export function requestLoading() {
    return { type: types.REQUEST_LOADING };
}
export function requestRejected(response) {
    return { type: types.REQUEST_REJECTED, payload: response };
}
export function receiveData(type, payload) {
    return { type: type, payload };
}
