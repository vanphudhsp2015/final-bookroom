import * as types from '../constants/actionType';
import { message } from 'antd';
import Cookies from 'universal-cookie';
import { http } from '../libraries/http/http';
const cookies = new Cookies();
const htmlToText = require('html-to-text');
export function requestGetEvent() {
    return (dispatch) => {
        return http.request({
            method: 'GET',
            url: '/bookrooms',
        }).then(function (response) {
            dispatch(receiveData(types.REQUEST_GET_EVENTS, response))
        }).catch(function (error) {
            dispatch(requestRejected(error));
        })
    }
}
// add tour 
export function requestAddEvents(data) {
    let email = '';
    if (data.arrayEmail !== undefined && data.arrayEmail.length > 0) {
        if (data.arrayEmail.length > 1) {
            data.arrayEmail.forEach((i, index, item) => {
                if (index === item.length - 1) {
                    email += `${item[index].email}`;
                } else {
                    email += `${item[index].email},`;
                }
            })
        } else {
            data.arrayEmail.forEach((i, index, item) => {
                email += `${item[index].email}`
            })
        }

    }
    let formDataObject = {};
    if (data.checkbox === true) {
        let arrayDay = '';
        if (data.byweekday !== null) {
            if (data.byweekday.length > 1) {
                data.byweekday.forEach((i, index, item) => {
                    if (index === item.length - 1) {
                        arrayDay += `${item[index]} `;
                    } else {
                        arrayDay += `${item[index]}, `;
                    }
                })
            } else {
                data.byweekday.forEach((i, index, item) => {
                    arrayDay += `${item[index]} `;
                })
            }

        }
        formDataObject = {
            'room_id': data.rooms,
            'title': data.title,
            'content': htmlToText.fromString(data.content),
            'user_id': cookies.get('data').id,
            'daystart': data.dateStart,
            'timestart': data.timestart,
            'timeend': data.timeend,
            'repeatby': data.choice,
            'interval': 1,
            'count': data.count,
            'byweekday': data.choice === 'weekly' ? arrayDay : '',
            'mail': data.arrayEmail === undefined ? '' : email
        }
    } else {
        formDataObject = {
            'room_id': data.rooms,
            'content': htmlToText.fromString(data.content),
            'user_id': cookies.get('data').id,
            'daystart': data.dateStart,
            'timestart': data.timestart,
            'timeend': data.timeend,
            'title': data.title,
            'mail': data.arrayEmail === undefined ? '' : email
        }
    }
    return (dispatch) => {
        return http.request({
            url: `/bookrooms`,
            method: 'POST',
            data: formDataObject
        }).then(function (response) {
            message.success('Đặt Thành Công')
            dispatch(receiveData(types.REQUEST_ADD_EVENT, response))
        }).catch(function (error) {
            message.error(error.messages[0])            
            dispatch(requestRejected(error));
        })
    }
}
export function requestDeleteEvent(id) {
    return (dispatch) => {
        return http.request({
            method: 'DELETE',
            url: `/bookrooms/${id}`,
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
    if (data.checkbox === true) {
        let arrayDay = '';
        if (data.byweekday !== null) {
            if (data.byweekday.length > 1) {
                data.byweekday.forEach((i, index, item) => {
                    if (index === item.length - 1) {
                        arrayDay += `${item[index]} `;
                    } else {
                        arrayDay += `${item[index]}, `;
                    }
                })
            } else {
                data.byweekday.forEach((i, index, item) => {
                    arrayDay += `${item[index]} `;
                })
            }

        }
        formDataObject = {
            'room_id': data.rooms,
            'content': htmlToText.fromString(data.content),
            'title': data.title,
            'user_id': cookies.get('data').id,
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
            'content': htmlToText.fromString(data.content),
            'user_id': cookies.get('data').id,
            'daystart': data.dateStart,
            'timestart': data.timestart,
            'timeend': data.timeend,
            'check': '0',
            'title': data.title
        }
    }

    return (dispatch) => {
        return http.request({
            url: `/bookrooms/${data.id}`,
            method: 'PUT',
            data: formDataObject
        }).then(function (response) {
            message.success('Sửa Sự Kiện Thành Công');
            dispatch(receiveData(types.REQUEST_UPDATE_EVENT, response))
        }).catch(function (error) {

            dispatch(requestRejected(error));
        })
    }
}
// filter event rooms

export function requestGetEventByRoom(id) {
    return (dispatch) => {
        dispatch(requestLoading());
        return http.request({
            method: 'GET',
            url: `/getbrbyid/${id}`,
        }).then(function (response) {
            dispatch(receiveData(types.REQUEST_FILTER_EVENT_ROOM, response))
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
        return http.request({
            method: 'GET',
            url: `/admin/getbrbyday`,
            params,
        }).then(function (response) {
            if (response.data.data.length > 0) {
                dispatch(receiveData(types.REQUEST_RESEARCH, response));
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
        return http.request({
            method: 'POST',
            url: `/deletebrrepeat/${data.id}`,
            data: formDataObject
        }).then(function (response) {
            message.success('Bạn Xóa Sự Kiện Lặp Lại Thành Công !');
            dispatch(receiveData(types.REQUEST_DELETE_EVENT_EXCEPTION, response));
        }).catch(function (error) {
            dispatch(requestRejected(error));
        })
    }
}
export function requestEditException(data, day, room) {

    let formDataObject = {};
    formDataObject = {
        'content': data.content,
        'day': day,
        'timestart': data.timestart,
        'timeend': data.timeend,
        'title': data.title,
        'room_id': room
    }

    return (dispatch) => {
        return http.request({
            method: 'POST',
            url: `/editbrrepeat/${data.id}`,
            data: formDataObject
        }).then(function (response) {
            message.success('Sửa Ngoại Lệ Thành Công');
            dispatch(receiveData(types.REQUEST_EDIT_EVENT_EXCEPTION, response));
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
