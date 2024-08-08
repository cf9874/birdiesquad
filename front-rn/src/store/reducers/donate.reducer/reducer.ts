import { DonateAction, IDonateState } from "./types"
import { createReducer } from "typesafe-actions"
import { DONATEDUSER } from "./actions"
import produce from "immer"
// 초기 상태 선언
const initialState: IDonateState = {
    iconName: "",
    iconType: 0,
    cash: 0,
    nick: "",
    playerCode: 0,
}

// 리듀서 작성
const reducer = createReducer<IDonateState, DonateAction>(initialState, {
    [DONATEDUSER]: (state, { payload }) => {
        return produce(state, draft => {
            draft.iconName = payload.iconName
            draft.iconType = payload.iconType
            draft.cash = payload.cash
            draft.nick = payload.nick
            draft.playerCode = payload.playerCode
        })
    },
})
export default reducer
