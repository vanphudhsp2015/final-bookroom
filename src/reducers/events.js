import * as types from '../constants/actionType';
const INITIAL_STATE = {
    all: [],
    fetching: false,
    fetched: false,
    error: null,
    distinct: false
}
export default function (state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case types.REQUEST_LOADING:
            return Object.assign({}, state, {
                fetching: true
            });
        case types.REQUEST_GET_EVENTS:
            return Object.assign({}, state, {
                all: action.payload,
            })
        case types.REQUEST_ADD_EVENT:
            return Object.assign({}, state, {
                all: [...state.all, action.payload]
            })
        case types.REQUEST_DELETE_EVENT:
            return Object.assign({}, state, {
                all: state.all.filter(item => item.id !== action.payload)
            })
        case types.REQUEST_UPDATE_EVENT:
            return Object.assign({}, state, {
                all: state.all.map(data => data.id === action.payload.id ? action.payload : data)
            })
        case types.REQUEST_DELETE_EVENT_EXCEPTION:
            return Object.assign({}, state, {
                all: state.all.map(data => data.id === action.payload.id ? action.payload : data)
            })
        case types.REQUEST_EDIT_EVENT_EXCEPTION:
            return Object.assign({}, state, {
                all: state.all.map(data => data.id === action.payload.id ? action.payload : data)
            })
        case types.REQUEST_FILTER_EVENT_ROOM:
            return Object.assign({}, state, {
                all: action.payload,
            })
        case types.REQUEST_RESEARCH:
            return Object.assign({}, state, {
                all: action.payload,
            })
        case types.REQUEST_DISTICNT_EVENT:
            return Object.assign({}, state, {
                distinct: action.payload
            })
        default:
            return state;
    }

}