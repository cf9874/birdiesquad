export interface IWalletBaseRes<T> {
    code: number
    data: IWalletBaseData<T>
}

export interface IWalletBaseData<T> {
    code: number
    data: T
    message: string
    result: boolean
    status: number
}

export interface IWalletErrorBaseData {}
// result: boolean
// status: number
// message: string

export const enum WalletRouteKey {
    SPEND = "spending",
    WALLET = "wallet",
}
