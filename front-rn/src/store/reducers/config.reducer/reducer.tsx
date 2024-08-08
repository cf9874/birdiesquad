import { type ConfigAction, IConfigState } from "./types"
import { createReducer } from "typesafe-actions"
import { SET_LOADING, SET_MODAL, SET_POPUP, SET_TOAST } from "./actions"
import produce from "immer"
import { Fragment } from "react"
import { ActivityIndicator, View } from "react-native"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import { RatioUtil } from "utils"
// 초기 상태 선언
const initialState: IConfigState = {
    loading: {
        isloading: false,
        children: (
            <AnimatedLottieView
                source={lotties.loading}
                style={{ width: RatioUtil.font(48), height: RatioUtil.font(48) }}
                autoPlay
                loop
            />
        ),
    },
    modal: {
        open: false,
        children: <Fragment />,
        preventClose: false,
    },
    popUp: {
        open: false,
        children: <Fragment />,
    },
    toast: {
        open: false,
        children: <Fragment />,
    },
}

// 리듀서 작성
const reducer = createReducer<IConfigState, ConfigAction>(initialState, {
    [SET_LOADING]: (state, { payload }) => {
        return produce(state, draft => {
            payload.children = payload.children ?? (
                <AnimatedLottieView
                    source={lotties.loading}
                    style={{ width: RatioUtil.font(48), height: RatioUtil.font(48) }}
                    autoPlay
                    loop
                />
            )

            draft.loading = { ...state.loading, ...payload }
        })
    },
    [SET_MODAL]: (state, { payload }) => {
        return produce(state, draft => {
            console.error(payload)

            draft.modal = { ...state.modal, ...payload }
        })
    },
    [SET_POPUP]: (state, { payload }) => {
        return produce(state, draft => {
            draft.popUp = { ...state.popUp, ...payload }
        })
    },
    [SET_TOAST]: (state, { payload }) => {
        return produce(state, draft => {
            draft.toast = { ...state.toast, ...payload }
        })
    },
})
export default reducer
