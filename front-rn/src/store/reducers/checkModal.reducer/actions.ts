import { API_URL, TOKEN_ID } from "utils/env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_CALLER from "apis"
import { seasonKey } from "apis/endpoints"
import { useDispatch } from "react-redux"
import store from "store"
import { createAction } from "typesafe-actions"

export const CHECK_MODAL_WATCHER = "CHECK_MODAL_WATCHER"
export const CHECK_MODAL_SUCCESS = "CHECK_MODAL_SUCCESS"
export const CHECK_MODAL_FALIURE = "CHECK_MODAL_FALIURE"
export const GETGAMEWATCHER = "store/reducers/checkModal.reducer/GETGAMEWATCHER"
export const GETGAMESUCCESS = "store/reducers/checkModal.reducer/GETGAMESUCCESS"
export const GETGAMEERROR = "store/reducers/checkModal.reducer/GETGAMEERROR"

export const getGameListWatcher = createAction(GETGAMEWATCHER)<boolean>()
// export const getGameListSuccess = createAction(GETGAMESUCCESS)()
// export const getGameListFailer = createAction(GETGAMEERROR)()

// export const getModalWatcher = () => {
//   return {
//       type: CHECK_MODAL_WATCHER,
//   }
// }

// export const getModalSuccess = posts => {
//   return {
//       type: CHECK_MODAL_SUCCESS,
//       payload: posts,
//   }
// }

// export const getModalFailure = error => {
//   return {
//       type: CHECK_MODAL_FALIURE,
//       payload: error,
//   }
// }

// const dispatch = useDispatch();
export const fetchGameList = async () => {
    const token = await AsyncStorage.getItem(TOKEN_ID)
    // getModalWatcher()
    // store.dispatch(getModalWatcher())
    // dispatch(getModalWatcher())
    getGameListWatcher(true)
    console.log("urll++++", API_URL + seasonKey)
    return await API_CALLER.get(API_URL + seasonKey, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })
        ?.then((res: any) => {
            console.log("response++++", res.data)
            // getModalSuccess(res?.data)
            // dispatch(getModalSuccess(res?.data))
            console.warn(res?.data?.data)
            return res?.data
        })
        ?.catch(e => {
            console.log("error+++", e)
            // getModalFailure(e)
            // dispatch(getModalFailure(e))
            console.warn(e)
            return e
        })
}
