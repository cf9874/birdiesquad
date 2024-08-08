import { ErrorType, WalletErrorType } from "const"
import { IDataWrapperRes, IErrorResData } from "../data"
import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import { API_URL, APP_USER_ID, DEVICE_KEY, REFRESH_TOKEN_ID, TOKEN_ID } from "utils/env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ConfigUtil } from "utils"

export class ApiConnectorAxios {
    private readonly baseUrl: string
    private config: AxiosRequestConfig = {}

    private renewingToken: Promise<any> | null = null

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl

        this.config = {
            headers: {
                "content-type": "application/json",
                "Cache-Control": "no-cache, must-revalidate",
            },
        }
    }

    genAuthConfig(token: string | null = null) {
        const Authorization = token === null ? "" : `Bearer ${token}`
        return { headers: { ...this.config.headers, Authorization } }
    }
    genAuthHeader(token: string | null = null) {
        const Authorization = token === null ? "" : `Bearer ${token}`
        return { ...this.config.headers, Authorization }
    }
    private genUrl(url: string): string {
        return `${this.baseUrl}${url}`
    }

    private genConfig(options: AxiosRequestConfig = {}): AxiosRequestConfig {
        return { ...this.config, ...options }
    }

    async get<D>(url: string, options = {}): Promise<IDataWrapperRes<IErrorResData | null> | D> {
        try {
            const { data } = await axios.get<D>(this.genUrl(url), this.genConfig(options))

            return data
        } catch (err) {
            return await this.errorHandler(err)
        }
    }

    async post<D>(url: string, body = {}, options = {}): Promise<IDataWrapperRes<IErrorResData | null> | D> {
        try {
            const { data } = await axios.post<D>(this.genUrl(url), body, this.genConfig(options))

            return data
        } catch (err) {
            return await this.errorHandler(err)
        }
    }
    //hazel - method 추가
    async patch<D>(url: string, body = {}, options = {}): Promise<IDataWrapperRes<IErrorResData | null> | D> {
        try {
            const { data } = await axios.patch<D>(this.genUrl(url), body, this.genConfig(options))

            return data
        } catch (err) {
            return await this.errorHandler(err)
        }
    }

    async put<D>(url: string, body = {}, options = {}): Promise<IDataWrapperRes<IErrorResData | null> | D> {
        try {
            const { data } = await axios.put<D>(this.genUrl(url), body, this.genConfig(options))
            return data
        } catch (err) {
            return await this.errorHandler(err)
        }
    }

    async renewToken() {
        if (this.renewingToken) {
            return this.renewingToken
        }

        this.renewingToken = (async () => {
            try {
                const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_ID)
                const fcmToken = await AsyncStorage.getItem("FCM_TOKEN")
                if (!refreshToken) return null

                const { data } = await axios
                    .post<{ code: string; data: { accessToken: string; refreshToken: string } }>(
                        API_URL + "/api/v1/auth/jwt/refresh",
                        {
                            refreshToken,
                            deviceKey: fcmToken ? fcmToken : DEVICE_KEY,
                        }
                    )
                    .catch(err => {
                        return { data: { code: 0, data: -1 } }
                    })

                return data.data
            } finally {
                this.renewingToken = null
            }
        })()

        return this.renewingToken
    }

    async delete<D>(url: string, options = {}): Promise<IDataWrapperRes<IErrorResData | null> | D> {
        try {
            const { data } = await axios.delete<D>(this.genUrl(url), this.genConfig(options))
            return data
        } catch (err) {
            return await this.errorHandler(err)
        }
    }

    async errorHandler(err: unknown): Promise<IDataWrapperRes<IErrorResData | null>> {
        let result: IDataWrapperRes<IErrorResData | null> = {
            code: 0,
            data: null,
        }
        if (axios.isAxiosError(err)) {
            const response = err.response as AxiosResponse<IErrorResData>

            if (
                response.data.message === ErrorType.JWT_TOKEN_EXPIRED ||
                response.data.message === WalletErrorType.JWT_TOKEN_EXPIRED
            ) {
                const data = await this.renewToken()

                await AsyncStorage.setItem(TOKEN_ID, data?.accessToken || "")
                await AsyncStorage.setItem(REFRESH_TOKEN_ID, data?.refreshToken || "")
                const headers = this.genAuthHeader(data?.accessToken || "")
                try {
                    const res = await axios.request({
                        baseURL: this.baseUrl,
                        method: response.config.method,
                        url: response.config.url,
                        headers,
                        data: response.config.data,
                    })

                    result = res.data
                } catch (error: any) {
                    result = {
                        code: error.response ? error.response.status : 0,
                        data: error.response ? error.response.data : null,
                    }
                }
            } else {
                result = {
                    code: response.status,
                    data: response.data,
                }
            }
        }

        return result
    }
}
