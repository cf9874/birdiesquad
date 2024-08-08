import { ActionType } from "typesafe-actions"
import * as actions from "./actions"

export type DonateAction = ActionType<typeof actions>

export interface IDonateState {
    iconName: string
    iconType: number
    cash: number
    nick: string
    playerCode: number
}
