import * as types from '../constants/actionType';
const INITIAL_STATE = {
    all: [],
    fetching: false,
    fetched: false,
    error: null,
}
export default function (state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case types.REQUEST_GET_USERS:
            return Object.assign({}, state, {
                all: action.payload,
            })
       
        default:
            return state;
    }

}