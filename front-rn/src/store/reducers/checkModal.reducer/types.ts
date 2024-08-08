import { ActionType } from "typesafe-actions"
import * as actions from "./actions"

export type SignAction = ActionType<typeof actions>

export interface ISignState {
    isLogin: IsLogin
    userInfo: UserInfo
}

export type UserInfo = any | {} // 이후 변경 필요함
export type IsLogin = boolean
