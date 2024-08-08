import { type SignAction, ISignState } from "./types"
import { createReducer } from "typesafe-actions"
import produce from "immer"
import { SET_GAME, SET_SHOW_GAME_MODAL, SET_SHOW_GAME_MODAL_DATA, SET_LOADER } from "./actions"
// 초기z 상태 선언
const initialState: ISignState = {
    gameData: [],
    showModal: false,
    title: "",
    desc1: "",
    desc2: "",
    showloader: false,
}

// 리듀서 작성
const reducer = createReducer<ISignState, SignAction>(initialState, {
    [SET_GAME]: (state, { payload }) => {
        return produce(state, draft => {
            draft.gameData = payload
        })
    },
    [SET_SHOW_GAME_MODAL]: (state, { payload }) => {
        return produce(state, draft => {
            draft.showModal = payload
            if (!payload) {
                draft.title = ''
                draft.desc1 = ''
                draft.desc2 = ''
                
            }
        })
    },
    [SET_SHOW_GAME_MODAL_DATA]: (state, { payload }) => {
        console.warn("showModal", payload)

        return produce(state, draft => {
            draft.title = payload?.title
            draft.desc1 = payload?.desc1
            draft.desc2 = payload?.desc2
        })
    },
    [SET_LOADER]: (state, { payload }) => {
        return produce(state, draft => {
            draft.showloader = payload
        })
    },
})
export default reducer
