import { ActionType } from "typesafe-actions"
import * as actions from "./actions"

export type ConfigAction = ActionType<typeof actions>

// export interface DropDownEvent extends React.MouseEvent<HTMLElement> {
//   target: {
//     getBoundingClientRect: () => { right: number; top: number; height: number; x: number; width: number; left: number }
//   }
// }

export interface IConfigState {
    error: any,
    loader: boolean,
    data: any,
}

// export type IsLoading = boolean

export interface ILoading {
    isloading: boolean
    children?: JSX.Element
}
export interface IModal {
    open: boolean
    children?: JSX.Element
}
export interface IPopUp {
    open: boolean
    children?: JSX.Element
}

export interface IToast {
    open: boolean
    children?: JSX.Element
}
