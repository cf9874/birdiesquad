import { ApiConnectorAxios } from "apis/connector/"
import { ErrorHandler, IDataWrapperRes, IDataWrapperTotalRes, IErrorResData } from "../data/data.wrapper"
import { API_URL, NODE_ENV, TOKEN_ID, API_WALLET_URL, REFRESH_TOKEN_ID } from "utils/env"
//
import AsyncStorage from "@react-native-async-storage/async-storage"
import RNExitApp from "react-native-exit-app"
import store from "store"
import { setLoading } from "store/reducers/config.reducer"
import { ErrorUtil, navigate } from "utils"
import { ErrorType, Screen, WalletMessageCode, WalletErrorType, WalletServerErrorCode, SanctionMsg } from "const"
import { IWalletBaseData, IWalletBaseRes } from "apis/data/wallet.data"
import _ from "lodash"
import { jsonSvc } from "apis/services"
import { signSvc } from "apis/services"
import { MySquadList } from "apis/data/mySquad.data"
import { SANCTION_STATUS } from "const/user.const"

export abstract class ABaseApi {
    protected static connector: ApiConnectorAxios | null

    constructor(url = API_URL) {
        console.log("URL BASE:", url)
        if (!ABaseApi.connector) {
            ABaseApi.connector = new ApiConnectorAxios(url)
        }
    }

    setConnector() {
        if (!ABaseApi.connector) {
            ABaseApi.connector = new ApiConnectorAxios(API_URL)
        }
    }

    resetConnector() {
        ABaseApi.connector = null
    }

    async genAuthConfig() {
        const token = await AsyncStorage.getItem(TOKEN_ID)
        return ABaseApi.connector?.genAuthConfig(token) ?? {}
    }
    async genAuthHeader() {
        const token = await AsyncStorage.getItem(TOKEN_ID)
        return ABaseApi.connector?.genAuthHeader(token) ?? {}
    }

    async get<D>({ url = "/", options = {} }, onError?: ErrorHandler) {
        const data = await ABaseApi.connector?.get<IDataWrapperRes<D>>(url, options)

        return this.checkReturnData(data, url, onError)
    }

    async getTotalResponse<D extends MySquadList, W extends IDataWrapperTotalRes<D> = IDataWrapperRes<D>>(
        { url = "/", options = {} },
        onError?: ErrorHandler
    ) {
        const data = await ABaseApi.connector?.get<W>(url, options)

        return this.checkReturnDataTotalResponse(data, url, onError)
    }

    async post<D>({ url = "/", body = {}, options = {} }, onError?: ErrorHandler) {
        const data = await ABaseApi.connector?.post<IDataWrapperRes<D>>(url, body, options)

        return this.checkReturnData(data, url, onError)
    }

    //hazel - method 추가
    async patch<D>({ url = "/", body = {}, options = {} }, onError?: ErrorHandler) {
        const data = await ABaseApi.connector?.patch<IDataWrapperRes<D>>(url, body, options)

        return this.checkReturnData(data, url, onError)
    }

    async put<D>({ url = "/", body = {}, options = {} }, onError?: ErrorHandler) {
        const data = await ABaseApi.connector?.put<IDataWrapperRes<D>>(url, body, options)
        return this.checkReturnData(data, url, onError)
    }

    async delete<D>({ url = "/", options = {} }, onError?: ErrorHandler) {
        const data = await ABaseApi.connector?.delete<IDataWrapperRes<D>>(url, options)
        return this.checkReturnData(data, url, onError)
    }

    protected async onError(data: IDataWrapperRes<IErrorResData>) {
        const message = data.data?.message ?? ""
        const code = data.code ?? ""

        if (!message && !code) return
        if (message === ErrorType.SANCTION_STATUS_USER) {
            this.resetConnector()
            await signSvc.removeAccountData()
            const sanction_status = Number((await AsyncStorage.getItem(SANCTION_STATUS)) ?? 0)
            store.dispatch(
                setLoading({
                    isloading: false,
                })
            )

            const errMsg = SanctionMsg.find(err => err.code === sanction_status)?.msg ?? SanctionMsg[0].msg
            ErrorUtil.sanctionModal(errMsg)
        } else if (
            message === ErrorType.WRONGTOKEN ||
            message === ErrorType.UNAUTHORIZED ||
            message === ErrorType.JWT_TOKEN_INVALID ||
            message === ErrorType.JWT_REFRESH_TOKEN_INVALID ||
            message === ErrorType.JWT_RELOGIN ||
            message === ErrorType.NOTFOUNDUSER
        ) {
            this.resetConnector()
            await signSvc.removeAccountData()
            store.dispatch(
                setLoading({
                    isloading: false,
                })
            )
            await ErrorUtil.signIn()
        } else if (code === ErrorType.SERVER_MAINTENANCE_CHECK) {
            const errMsg = message.split("__")
            ErrorUtil.genTitleModal(errMsg[0], errMsg[1], () => navigate(Screen.SPLASH), true)
        } else if (code && /^5[0-9]{2}$/.test(code + "")) {
            ErrorUtil.genModal(jsonSvc.findLocalById("ERROR_DISCONNECT_SERVER"))
        } else if (code && /^4[0-9]{2}$/.test(code + "")) {
            ErrorUtil.genModal(message)
        } else if (NODE_ENV === "dev") {
            ErrorUtil.log(data.code, message)
        } else if (NODE_ENV === "qa" && /^4[0-9]{2}$/.test(code + "")) {
            ErrorUtil.genModal(message)
        }
    }

    private checkReturnData<D>(
        data: IDataWrapperRes<IErrorResData | null | D> | undefined,
        url: string,
        onError?: ErrorHandler
    ) {
        if (data === undefined) return { data: null } as IDataWrapperRes<D>

        if (data.code === "SUCCESS") {
            const successData = data?.data !== undefined ? data : { data: true }
            return successData as IDataWrapperRes<D>
        } else {
            console.warn(API_URL + url)
            const errorData = data as IDataWrapperRes<IErrorResData>
            onError ? onError(errorData) : this.onError(errorData)
            return { data: null } as IDataWrapperRes<D>
        }
    }

    private checkReturnDataTotalResponse<D>(
        data: IDataWrapperRes<IErrorResData | null | D>,
        url: string,
        onError?: ErrorHandler
    ) {
        if (data === undefined) return { data: null } as IDataWrapperRes<D>

        if (data.code === "SUCCESS" || /^2[0-9]{2}$/.test(data.code + "")) {
            const successData = data
            return successData as IDataWrapperRes<D>
        } else {
            console.warn(API_URL + url)
            const errorData = data as IDataWrapperRes<IErrorResData>
            onError ? onError(errorData) : this.onError(errorData)
            return { data: null } as IDataWrapperRes<D>
        }
    }
}

export abstract class WBaseApi {
    protected static connector: ApiConnectorAxios

    constructor(url = API_WALLET_URL) {
        console.log("URL BASE:", url)

        if (!WBaseApi.connector) {
            WBaseApi.connector = new ApiConnectorAxios(url)
        }
    }

    async genAuthConfig() {
        const token = await AsyncStorage.getItem(TOKEN_ID)
        return WBaseApi.connector.genAuthConfig(token)
    }
    async genAuthHeader() {
        const token = await AsyncStorage.getItem(TOKEN_ID)
        return WBaseApi.connector.genAuthHeader(token)
    }

    async get<D, W extends IWalletBaseRes<D> = IWalletBaseRes<D>>(
        { url = "/", options = {} },
        onError?: (error: IWalletBaseData<IErrorResData>) => void
    ) {
        const data = await WBaseApi.connector.get<W>(url, options)

        return this.checkReturnData(data as W, url, onError)
    }

    async post<D, W extends IWalletBaseRes<D> = IWalletBaseRes<D>>(
        { url = "/", body = {}, options = {} },
        onError?: (error: IWalletBaseData<IErrorResData>) => void
    ) {
        const data = await WBaseApi.connector.post<W>(url, body, options)
        return this.checkReturnData(data as W, url, onError)
    }

    async put<D, W extends IWalletBaseRes<D> = IWalletBaseRes<D>>(
        { url = "/", body = {}, options = {} },
        onError?: (error: IWalletBaseData<IErrorResData>) => void
    ) {
        const data = await WBaseApi.connector.put<W>(url, body, options)
        return this.checkReturnData(data as W, url, onError)
    }

    async delete<D, W extends IWalletBaseRes<D> = IWalletBaseRes<D>>(
        { url = "/", options = {} },
        onError?: (error: IWalletBaseData<IErrorResData>) => void
    ) {
        const data = await WBaseApi.connector.delete<W>(url, options)
        return this.checkReturnData<D>(data as W, url, onError)
    }
    protected async onError(data: IWalletBaseData<IErrorResData>) {
        const message = data?.message
        const errorMessage = data?.data?.message
        const code = data.code ?? 0
        if (
            // message === ErrorType.WRONGTOKEN ||
            // message === ErrorType.UNAUTHORIZED ||
            // message === ErrorType.JWT_TOKEN_INVALID ||
            // message === ErrorType.JWT_REFRESH_TOKEN_INVALID ||
            // message === ErrorType.JWT_RELOGIN
            message === WalletErrorType.EXPECT_TOKEN
        ) {
            // if (msg === ErrorType.WRONGTOKEN) {
            await signSvc.removeAccountData()

            store.dispatch(
                setLoading({
                    isloading: false,
                })
            )

            //  }
            await ErrorUtil.signIn()
        } else if (code === WalletErrorType.SERVER_MAINTENANCE_CHECK) {
            const errMsg = errorMessage.split("__")
            ErrorUtil.genTitleModal(errMsg[0], errMsg[1], () => navigate(Screen.SPLASH), true)
            // ErrorUtil.genTitleModal(errMsg[0], errMsg[1], () => {
            //     RNExitApp.exitApp()
            // })
        } else if (WalletMessageCode.includes(code) && data?.status === 200) {
            // 지갑 api
            ErrorUtil.genToast(message ?? "서버 에러")
        } else if (WalletServerErrorCode.includes(code)) {
            // 지갑 api 500 에러일 경우
            ErrorUtil.genModal(jsonSvc.findLocalById("ERROR_DISCONNECT_SERVER"))
        } else if (code && /^5[0-9]{2}$/.test(code + "")) {
            ErrorUtil.genModal(errorMessage ?? jsonSvc.findLocalById("ERROR_DISCONNECT_SERVER"))
        } else if (!data.result && !errorMessage && !message) {
            ErrorUtil.genModal(message)
        } else if (NODE_ENV === "dev") {
            ErrorUtil.log(data.code, errorMessage ? errorMessage : message)
        } else if (NODE_ENV === "qa" && /^4[0-9]{2}$/.test(code + "")) {
            ErrorUtil.genModal()
        }
    }

    private checkReturnData<D>(
        data: IWalletBaseRes<D>,
        url: string,
        onError?: (error: IWalletBaseData<IErrorResData>) => void
    ) {
        if (data.code === 0) {
            return { data: data.data } as { data: D }
        } else {
            console.warn(API_WALLET_URL + url)
            const errorData = data as unknown as IWalletBaseData<IErrorResData>
            onError ? onError(errorData) : this.onError(errorData)
            return { data: null } as { data: null }
        }
    }
}

// private isErrorData<D>(data: IDataWrapperRes<IErrorResData | null | D>) {
//     if (data.code === "SUCCESS") return data as IDataWrapperRes<IErrorResData | null>
//     else return data as IDataWrapperRes<D>
// }
