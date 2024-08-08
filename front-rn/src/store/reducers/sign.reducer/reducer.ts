import { type SignAction, ISignState } from "./types"
import { createReducer } from "typesafe-actions"
import { ISFIRST, ISLOGIN, USER_INFO } from "./actions"
import produce from "immer"
// 초기 상태 선언
const initialState: ISignState = {
    isLogin: false,
    userInfo: {},
    isFirst: false,
}

// 리듀서 작성
const reducer = createReducer<ISignState, SignAction>(initialState, {
    [ISLOGIN]: (state, { payload }) => {
        return produce(state, draft => {
            draft.isLogin = payload
        })
    },
    [USER_INFO]: (state, { payload }) => {
        return produce(state, draft => {
            draft.userInfo = payload
        })
    },
    [ISFIRST]: (state, { payload }) => {
        return produce(state, draft => {
            draft.isFirst = payload
        })
    },
})
export default reducer
