import axios from 'axios'
import qs from 'qs'
import * as types from '../../constants/actionAPI';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function parseError(messages) {
    // error
    if (messages) {
        if (messages instanceof Array) {
            return Promise.reject({ messages: messages })
        } else {
            return Promise.reject({ messages: [messages] })
        }
    } else {
        return Promise.reject({ messages: ['エラーが発生しました'] })
    }
}

/**
 * parse response
 */
function parseBody(response) {    
    //  if (response.status === 200 && response.data.status.code === 200) { // - if use custom status code    
    if (response.status === 200) {
        return response.data.data;
    } else if (response.status === 204) {
        return "Delete success";
    }
    else if (response.status === 200) {
        return response.data.data;
    } else if (response.status === 201) {
        return response.data.data;
    } else if (response.status === 429) {
        return "Not Data";
    }
    else {
        return this.parseError(response.data.messages)
    }
}
function parseBodyItem(response) {
    //  if (response.status === 200 && response.data.status.code === 200) { // - if use custom status code    
    if (response.status === 200) {
        return response.data;
    } else if (response.status === 204) {
        return "Delete success";
    }
    else if (response.status === 200) {
        return response.data.data;
    } else if (response.status === 201) {
        return response.data.data;
    }
    else {
        return this.parseError(response.data.messages)
    }
}
/**
 * axios instance
 */
let instance = axios.create({
    baseURL: `${types.API_URL}/api/v1`,
    paramsSerializer: function (params) {
        return qs.stringify(params, { indices: false })
    }
})

let instanceItem = axios.create({
    baseURL: `${types.API_URL}/api/v1`,
    paramsSerializer: function (params) {
        return qs.stringify(params, { indices: false })
    }
})
// request header
instance.interceptors.request.use((config) => {
    // Do something before request is sent

    // api tokenなどを利用してheaderに載せる場合
    // const apiToken = sessionStorage.getItem('token')
    // config.headers = { 'Custom-Header-IF-Exist': apiToken }3
    config.headers = {
        "Accept": "application/json",
        'Content-Type': 'application/json',
    }
    const token = cookies.get('token')
    if (token) {
        config.headers.Authorization = `${'bearer ' + cookies.get('token')}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// response parse
instance.interceptors.response.use((response) => {
    return parseBody(response)
}, error => {
    console.warn('Error status', error.response.status)
    // return Promise.reject(error)
    if (error.response) {
        return parseError(error.response.data)
    } else {
        return Promise.reject(error)
    }
})
// Http Item
// request header
instanceItem.interceptors.request.use((config) => {
    // Do something before request is sent

    // api tokenなどを利用してheaderに載せる場合
    // const apiToken = sessionStorage.getItem('token')
    // config.headers = { 'Custom-Header-IF-Exist': apiToken }3
    config.headers = {
        "Accept": "application/json",
        'Content-Type': 'application/json',
    }
    const token = cookies.get('token')
    if (token) {
        config.headers.Authorization = `${'bearer ' + cookies.get('token')}`
    }
    return config
}, error => {
    return Promise.reject(error)
})

// response parse
instanceItem.interceptors.response.use((response) => {
    return parseBodyItem(response)
}, error => {
    console.warn('Error status', error.response.status)
    // return Promise.reject(error)
    if (error.response) {
        return parseError(error.response.data)
    } else {
        return Promise.reject(error)
    }
})
export const http = instance
export const httpItem = instanceItem