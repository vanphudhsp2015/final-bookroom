import { message } from 'antd';
import * as types from '../constants/actionType';
import { http } from '../libraries/http/http';
export function requestGetRoom() {
    return (dispatch) => {
        return http.request({
            method: 'GET',
            url: '/rooms'
        }).then(function (response) {
            dispatch(receiveData(types.REQUEST_GET_ROOMS, response))
        }).catch(function (error) {
            console.log(error);
        })
    }
}
// delete room
export function requestDeleteRoom(id) {
    return (dispatch) => {
        return http.request({
            method: 'DELETE',
            url: `/admin/rooms/${id}`
        }).then(function (response) {
            message.success('Bạn Đã Xóa Thành Công')
            dispatch(receiveData(types.REQUEST_DELETE_ROOM, id))
        }).catch(function (error) {
            console.log(error);
        })
    }
}
// add room
export function requestAddRoom(data) {
    let body = {
        name: data.name,
        seats: data.seat,
        color: data.background
    }
    return (dispatch) => {
        return http.request({
            method: 'POST',
            url: '/admin/rooms',
            data: body
        }).then(function (response) {
            message.success('Bạn Đã Thêm  Thành Công')
            dispatch(receiveData(types.REQUEST_ADD_ROOM, response))
        }).catch(function (error) {
            console.log(error);

        })
    }
}
//Edit
export function requestEditRoom(data) {
    let body = {
        name: data.name,
        seats: data.seat,
        color: data.background
    }
    return (dispatch) => {
        return http({
            method: 'PUT',
            url: `/admin/rooms/${data.id}`,
            data: body
        }).then(function (response) {
            message.success('Sửa Thành Công!');
            dispatch(receiveData(types.REQUEST_UPDATE_ROOM, response))
        }).catch(function (error) {
            console.log(error);
        })
    }
}
export function receiveData(action, payload) {
    return { type: action, payload };
}

