import axios from 'axios'
import qs from 'qs'
import * as types from '../../constants/actionAPI';
import Cookies from 'universal-cookie';
import { message } from 'antd';
const cookies = new Cookies();
function parseError(messages) {
  // Thông Báo Lỗi
  if (messages) {
    if (messages instanceof Array) {
      return Promise.reject({ messages: messages })
    } else {
      return Promise.reject({ messages: [messages] })
    }
  } else {
    return Promise.reject({ messages: ['Lỗi'] })
  }
}
/**
 * parse response
 */
function parseBody(response) {
  if (response.status === 200) {
    return response.data.data;
  } else if (response.status === 201) {
    return response.data.data;
  } else {
    return this.parseError(response.data.messages)
  }
}
function parseBodyItem(response) {
  if (response.status === 200) {
    return response.data;
  } else if (response.status === 201) {
    return response.data.data;
  } else {
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
  message.warn(error.response.status);
  if (error.response) {
    return parseError(error.response.data)
  } else {
    return Promise.reject(error)
  }
})
// request header  http Item
instanceItem.interceptors.request.use((config) => {
  // Do something before request is sent
  // Truyền token vào header
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
  message.warn(error.response.status);
  if (error.response) {
    return parseError(error.response.data)
  } else {
    return Promise.reject(error)
  }
})
export const http = instance
export const httpItem = instanceItem
