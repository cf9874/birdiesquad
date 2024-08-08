import { ActionType } from "typesafe-actions"
import * as actions from "./actions"

export type SignAction = ActionType<typeof actions>

export interface ISignState {
    gameData: [],
    showModal: boolean,
    title: string,
    desc1: string,
    desc2: string,
    showloader: boolean,
}

export type gameData = any | {} // 이후 변경 필요함
export type IsLogin = boolean
