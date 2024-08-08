import { ABaseApi } from "./base.api"
import { IDataWrapperRes, IErrorResData, SignApiData } from "../data"
import { ConfigUtil, ErrorUtil } from "utils"
import { KakaoProfile } from "@react-native-seoul/kakao-login"
import { Platform } from "react-native"
import { AppVersionInfo } from "apis/data/system.data"


export class SystemApi extends ABaseApi {
    constructor() {
        super()
    }

    async getOsVersionInfo() {
      let errData = {};
        const { data } = await this.get<AppVersionInfo>({
            url: `/api/v1/account/app-info?osType=${Platform.OS}`,
        },
        err => {
            errData = err;
        })

        return {osVersionInfo:data, errData}
    }
}
