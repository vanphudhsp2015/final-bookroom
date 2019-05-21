import axios from 'axios';
import * as types from '../constants/actionType';
import * as API from '../constants/actionAPI';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export function requestGetUsers(){
    return (dispatch)=>{
        return axios.request({
            method: 'GET',
            url: `${API.API_URL}/admin/users`,
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json',
                'Authorization': `${'bearer ' + cookies.get('token')}`
            }
        }).then(function(response){
            dispatch(receiveData(types.REQUEST_GET_USERS,response.data.data))
        }).catch(function(error){
            console.log(error)
        })
    }
}
export function receiveData(action, payload) {
    return { type: action, payload };
}