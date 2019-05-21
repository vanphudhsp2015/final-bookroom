import * as types from '../constants/actionType';
const INITIAL_STATE = {
    all: [],
    fetching: false,
    fetched: false,
    error: null,
}
export default function (state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case types.REQUEST_GET_ROOMS:
            return Object.assign({}, state, {
                all: action.payload,
            })
        case types.REQUEST_DELETE_ROOM:
            return Object.assign({}, state, {
                all: state.all.filter(item => item.id !== action.payload)
            })
        case types.REQUEST_ADD_ROOM:
            return Object.assign({}, state, {
                all: [...state.all, action.payload]
            })
        case types.REQUEST_UPDATE_ROOM:        
            return Object.assign({}, state, {
                all: state.all.map(data => data.id === action.payload.data.id ? action.payload.data : data)
            })
        default:
            return state;
    }

}