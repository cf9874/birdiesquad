import { PayloadAction, createSlice } from "@reduxjs/toolkit"

/**
 * @brief appInit함수, kakaobypass api 실행 시 앱 버전 정보 저장
 * @author Nibble
 * @create 2023-06-27
 */

interface AppVersionInfo {
    appBasicVersion: string;
    appForceVersion: string;
    appStoreUrl: string;
}

const appVersionInfoSlice = createSlice({
    name: "appVersionInfo",
    initialState: { appBasicVersion: "", appForceVersion: "", appStoreUrl: "" },
    reducers: {
        setAppVersionInfo: (state, action: PayloadAction<AppVersionInfo>) => {
            state.appBasicVersion = action.payload.appBasicVersion;
            state.appForceVersion = action.payload.appForceVersion;
            state.appStoreUrl = action.payload.appStoreUrl;
        },
    },
})

export const { setAppVersionInfo } = appVersionInfoSlice.actions
export default appVersionInfoSlice.reducer