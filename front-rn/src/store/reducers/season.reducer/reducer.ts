import { type ConfigAction, IConfigState } from "./types"
import { createReducer } from "typesafe-actions"
import produce from "immer"
import { FETCH_SEASON_FAILURE, FETCH_SEASON_REQUEST, FETCH_SEASON_SUCCESS } from "."
// 초기 상태 선언
const initialState: IConfigState = {
    error: null,
    loader: false,
    data: [],

}

// 리듀서 작성
// const rootReducer = createReducer<IConfigState, ConfigAction>(initialState, {
//     [FETCH_SEASON_REQUEST]: (state, { payload }) => {
//         return produce(state, draft => {
//             state.loader = true
//         })
//     },
//     [FETCH_SEASON_SUCCESS]: (state, { payload }) => {
//         return produce(state, draft => {
//             state.loader = false,
//             state.data = payload.data,
//             state.error = null
//         })
//     },
//     [FETCH_SEASON_FAILURE]: (state, { payload }) => {
//         return produce(state, draft => {
//             state.loader = false,
//             state.data = payload.data,
//             state.error = payload
//         })
//     },
// })

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SEASON_REQUEST:
            return {
                ...state,
                loader: true,
            };
        case FETCH_SEASON_SUCCESS:
            return {
                ...state,
                loader: false,
                data: action.payload,
                error: '',
            };
        case FETCH_SEASON_FAILURE:
            return {
                ...state,
                loader: false,
                data: [],
                error: action.payload,
            };
        default:
            return state;
    }
};
export default rootReducer
