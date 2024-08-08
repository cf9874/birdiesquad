import { createAction } from "typesafe-actions"
import { ILoading, IModal, IPopUp, IToast } from "./types"

export const SET_LOADING = "store/reducers/config/SET_LOADING"
export const SET_MODAL = "store/reducers/config/SET_MODAL"
export const SET_POPUP = "store/reducers/config/SET_POPUP"
export const SET_TOAST = "store/reducers/config/SET_TOAST"

export const setLoading = createAction(SET_LOADING)<ILoading>()
export const setModal = createAction(SET_MODAL)<IModal>()
export const setPopUp = createAction(SET_POPUP)<IPopUp>()
export const setToast = createAction(SET_TOAST)<IToast>()
