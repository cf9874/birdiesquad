import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert } from "react-native"
import axios from "axios"
import { ACCESS_TOKEN_KAKAO, CLIENT_ID, ID_TOKEN_KAKAO, LINK_CHECK_EXPIRE, LINK_RENEW_TOKEN } from "const/wallet.const"
type Keys = string | string[]

export const TokenKakaoUtil = {
    isExpire: async (accessToken?: string) => {
        const response = await axios
            .get(LINK_CHECK_EXPIRE, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then(function (response) {
                console.log(response.data)
                return true
            })
            .catch(function (error) {
                console.log(error.response.data)
                Alert.alert("", error.response.data.msg)
                return false
            })
        return response
    },

    renewToken: async (refresh_token: string) => {
        const response = await axios
            .post(
                LINK_RENEW_TOKEN,
                {
                    grant_type: "refresh_token",
                    client_id: CLIENT_ID,
                    refresh_token: refresh_token,
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            )
            .then(async function (response) {
                console.log(response.data)
                await AsyncStorage.setItem(ACCESS_TOKEN_KAKAO, response.data.access_token)
                await AsyncStorage.setItem(ID_TOKEN_KAKAO, response.data.id_token)
                return response.data
            })
            .catch(function (error) {
                console.log(error.response.data)
                Alert.alert("", error.response.data.msg)
                return
            })

        return response
    },
}
