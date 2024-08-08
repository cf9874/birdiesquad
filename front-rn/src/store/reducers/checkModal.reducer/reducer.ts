import { type SignAction, ISignState } from "./types"
import { createReducer } from "typesafe-actions"
import produce from "immer"
import { GETGAMEERROR, GETGAMESUCCESS, GETGAMEWATCHER } from ".";
import { Alert } from "react-native";
// 초기 상태 선언
const initialState = {
    error: null,
    loader: false,
    checkModaldata: [],
}

const reducer = createReducer(initialState, (builder) => {
    // Alert.alert(builder)
    // [GETGAMEWATCHER]: (state, { payload }) => {
    //     Alert.alert("payload++++++",payload);        
    //     return produce(state, draft => {
    //         draft.loader = true
    //     })
    // },
    // [GETGAMESUCCESS]: (state, { payload }) => {
    //     return produce(state, draft => {
    //         draft.loader = false
    //         draft.checkModaldata = payload
    //     })
    // },
    // [GETGAMEERROR]: (state, { payload }) => {
    //     return produce(state, draft => {
    //         draft.error = payload
    //         draft.loader = false
    //     })
    // },
})
export default reducer

// export default function checkModalReducer (state = initialState, action) {
//     switch (action.type) {
//         case CHECK_MODAL_WATCHER:
//             return {
//                 ...state,
//                 loader: true,
//             };
//         case CHECK_MODAL_SUCCESS:{
//             console.warn('--------');
            
//             return {
//                 ...state,
//                 loader: false,
//                 checkModaldata: action.payload,
//                 error: '',
//             };
//         }
//         case CHECK_MODAL_FALIURE:
//             return {
//                 ...state,
//                 loader: false,
//                 error: action.payload,
//             };
//         default:
//             return state;
//     }
// };
