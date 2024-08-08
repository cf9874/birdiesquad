import { MySquadList } from "./mySquad.data"

export interface IBaseRes {
    readonly code: number | string
}

export interface IErrorResData {
    message: string
    // cause: string
    stack: string
    code?: string
}

export interface IDataWrapperRes<T> extends IBaseRes {
    //hazel 수정
    currentDate: any
    code: any
    message: any
    readonly data: T
}

export type ErrorData = IDataWrapperRes<IErrorResData | null>
export type ErrorHandler = (error: ErrorData) => void

//hazel 에러처리를 위해 200번대 코드 추가 interface
export interface IDataWrapperTotalRes<T> extends IBaseRes {
    currentDate: any
    code: any
    message: any
    data: MySquadList
}
