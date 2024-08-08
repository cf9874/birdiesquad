import { View, Image, Linking, Modal, BackHandler, StatusBar } from "react-native"
import React, { useEffect, useState } from "react"
import { ProfileHeader } from "components/layouts"
import { AnalyticsEventName, Colors, Screen } from "const"
import { navigate, RatioUtil, RegexUtil } from "utils"
import { CustomButton, PretendText } from "components/utils"
import { mineGStyle, mineStyle } from "styles"
import VersionCheck from "react-native-version-check"
import { useScreen, useWrapDispatch } from "hooks"
import { setModal } from "store/reducers/config.reducer"
import { SettingCompo } from "./mine.compo"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { jsonSvc, systemSvc } from "apis/services"
import { SvgIcon } from "components/Common/SvgIcon"
import DeviceInfo from "react-native-device-info"
import semver from "semver/classes/semver"
import store from "store"
import { setAppVersionInfo } from "store/reducers/appVersionInfo.reducer"
import { Analytics } from "utils/analytics.util"

const Setting = () => {
    const version = VersionCheck.getCurrentVersion()
    const modalDispatch = useWrapDispatch(setModal)
    const [termVisible, setTermVisible] = useState(false)
    const [termLink, setTermLink] = useState("")
    const inset = useSafeAreaInsets()
    let [appBasicVersion, setAppBasicVersion] = useState("")

    useEffect(() => {
        const backAction = () => {
            navigate(Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])

    //hazel 0731 - 현재 설치되어 있는 앱 버전과 하단에 최신 버전 여부를 표기
    useScreen(() => {
        const fetchAppVersionCheck = async () => {
            const { osVersionInfo } = await systemSvc.getOsVersionInfo()
            if (osVersionInfo) {
                const { appBasicVersion: fetchAppBasicVersion, appForceVersion, appStoreUrl } = osVersionInfo
                appBasicVersion = fetchAppBasicVersion
                setAppBasicVersion(appBasicVersion)
                store.dispatch(setAppVersionInfo({ appBasicVersion, appForceVersion, appStoreUrl }))
            }
        }
        fetchAppVersionCheck()
    }, [])

    return (
        <SafeAreaView style={mineGStyle.con}>
            <View style={{ flex: 1 }}>
                {/* <ProfileHeader title="설정" /> */}
                <ProfileHeader title={jsonSvc.findLocalById("170005")} />
                <StatusBar barStyle={"dark-content"} backgroundColor={termVisible ? "black" : "white"} />
                <View style={mineGStyle.bgCon}>
                    <View style={mineStyle.setting.menuCon}>
                        {menu.map(({ title, link, event }) => (
                            <CustomButton
                                key={title}
                                style={mineGStyle.menuBox.con}
                                onPress={async () => {
                                    if (link === Screen.SETMYINFO) {
                                        await Analytics.logEvent(AnalyticsEventName.click_myInfo_405, {
                                            hasNewUserData: true,
                                        })
                                    }
                                    if (typeof link !== "string") return

                                    if (RegexUtil.isUrl(link)) {
                                        navigate(Screen.WEBVIEWTERM, {
                                            url: link,
                                        })
                                    } else {
                                        if (event) {
                                            await Analytics.logEvent(AnalyticsEventName[event as AnalyticsEventName], {
                                                hasNewUserData: true,
                                            })
                                        }
                                        navigate(link as Screen)
                                    }
                                }}
                            >
                                <PretendText style={mineStyle.setting.menuText}>{title}</PretendText>
                                <View style={mineStyle.setting.imageCon}>
                                    <SvgIcon name="Next" style={{ ...RatioUtil.size(7, 12) }} />
                                </View>
                            </CustomButton>
                        ))}
                    </View>
                    <View
                        style={{
                            flex: 1,
                            width: RatioUtil.width(360),
                            alignItems: "center",
                            paddingHorizontal: RatioUtil.width(20),
                            marginBottom: RatioUtil.height(20),
                        }}
                    >
                        <View style={mineGStyle.grayBar} />
                        <View
                            style={{
                                width: RatioUtil.width(320),
                                flexDirection: "row",
                                marginTop: RatioUtil.height(11),
                                justifyContent: "space-between",
                            }}
                        >
                            <PretendText style={mineStyle.setting.text}>
                                {/* 앱 버전 {version} */}
                                {jsonSvc.formatLocal(jsonSvc.findLocalById("172006"), [version])}
                            </PretendText>

                            {/* hazel 0731 - 현재 설치되어 있는 앱 버전과 하단에 최신 버전 여부를 표기 */}
                            {appBasicVersion > version ? (
                                <>
                                    <PretendText style={mineStyle.setting.text}>
                                        {"최신 버전 "}
                                        {appBasicVersion}
                                    </PretendText>
                                </>
                            ) : (
                                <>
                                    <PretendText style={mineStyle.setting.text}>
                                        {/* 최신 버전 입니다. */}
                                        {jsonSvc.findLocalById("172007")}
                                    </PretendText>
                                </>
                            )}
                        </View>
                        {appBasicVersion > version && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                    width: RatioUtil.width(320),
                                    marginLeft: RatioUtil.lengthFixedRatio(10),
                                }}
                            >
                                <PretendText style={mineStyle.setting.text}>{"업데이트가 필요합니다."}</PretendText>
                            </View>
                        )}

                        <CustomButton
                            style={mineStyle.setting.buttonCon}
                            onPress={async () => {
                                await Analytics.logEvent(AnalyticsEventName.click_logout_405, {
                                    hasNewUserData: true,
                                })
                                modalDispatch({
                                    open: true,
                                    children: <SettingCompo.LogoutModal />,
                                })
                            }}
                        >
                            <PretendText style={mineStyle.setting.text}>
                                {/* 로그아웃 */}
                                {jsonSvc.findLocalById("172009")}
                            </PretendText>
                        </CustomButton>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Setting

const menu = [
    {
        title:
            //  "내 정보"
            jsonSvc.findLocalById("172000"),
        link: Screen.SETMYINFO,
    },
    {
        title:
            // "알림 설정",
            jsonSvc.findLocalById("172001"),
        link: Screen.SETALARM,
    },
    {
        title:
            // "약관 및 정책",
            jsonSvc.findLocalById("172002"),
        link: jsonSvc.findConstById(42000).sStrValue,
    },
    {
        title:
            // "자주 묻는 질문",
            jsonSvc.findLocalById("172003"),
        link: Screen.SETFAQ,
        event: "click_faq_405",
    },
    {
        title:
            //  "1:1 문의",
            jsonSvc.findLocalById("172004"),
        link: Screen.SETINQUIRY,
        event: "click_inquiry_405",
    },
    {
        title: "오픈소스 라이선스",
        link: jsonSvc.findConstById(45000).sStrValue,
    },
]
