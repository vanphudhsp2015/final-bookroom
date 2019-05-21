import * as types from '../constants/actionType';
const INITIAL_STATE = {
    all: [],
    fetching: false,
    fetched: false,
    error: null,
}
export default function (state = INITIAL_STATE, action = {}) {
    switch (action.type) {
        case types.REQUEST_LOADING:
            return Object.assign({}, state, {
                fetching: true,
                fetched: INITIAL_STATE.fetched
            });
        case types.REQUEST_REJECTED:
            return Object.assign({}, state, {
                fetching: INITIAL_STATE.fetching,
                fetched: INITIAL_STATE.fetched,
                error: action.payload.data
            });
        case types.REQUEST_GET_EVENTS:
            return Object.assign({}, state, {
                all: action.payload,
                fetching: INITIAL_STATE.fetching,
                fetched: true
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
        case types.REQUEST_FILTER_EVENT_ROOM:
            return Object.assign({}, state, {
                all: action.payload,
            })
        case types.REQUEST_RESEARCH:
            return Object.assign({}, state, {
                all: action.payload,
            })
        default:
            return state;
    }

}