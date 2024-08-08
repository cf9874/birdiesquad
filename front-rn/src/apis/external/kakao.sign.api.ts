import {
    getProfile as getKakaoProfile,
    login,
    logout,
    unlink as unKakaoLink,
    getAccessToken as getKakaoAccessToken,
    loginWithKakaoAccount,
} from "@react-native-seoul/kakao-login"
export class KakaoSignApi {
    async signIn() {
        const auth = await login()
        return auth
    }
    async signInOtherAccount() {
        const auth = await loginWithKakaoAccount()
        return auth
    }

    async signOut() {
        const msg = await logout()
        return msg
    }

    async getProfile() {
        const profile = await getKakaoProfile()
        return profile
    }
    async getAccessToken() {
        try {
            const { accessToken } = await getKakaoAccessToken()
            return accessToken
        } catch (error) {
            console.log(error)

            return false
        }
    }

    async unLink() {
        const msg = await unKakaoLink()
        return msg
    }
}

//const { accessToken } = await getAccessToken()
