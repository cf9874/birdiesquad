import React, { useState } from "react"
import { View, Text, ViewStyle, Platform } from "react-native"
import { navigate, RatioUtil } from "utils"
import { AnalyticsEventName, Colors, ErrorType, Screen } from "const"
import { CustomButton, PretendText } from "components/utils"
import { useRoute } from "@react-navigation/native"
import { ReadyModal } from "components/Common"
import { useScreen, useWrapDispatch } from "hooks"
import { setModal } from "store/reducers/config.reducer"
import { jsonSvc, systemSvc } from "apis/services"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgIcon } from "components/Common/SvgIcon"
import DeviceInfo from "react-native-device-info"
import semver from "semver"
import { AppForceUpdatePopup } from "screens/nft/components/popup/appForceUpdate.popup"
import store from "store"
import { setAppVersionInfo } from "store/reducers/appVersionInfo.reducer"
import { Analytics } from "utils/analytics.util"

interface IMyPageFooter {
    style?: ViewStyle
}

export const PageFooterHeight = (): number => {
    const insets = useSafeAreaInsets()
    return (Platform.OS === "ios" ? insets.bottom : 0) + RatioUtil.lengthFixedRatio(62)
}

export const MyPageFooter = (props: IMyPageFooter) => {
    const route = useRoute()
    const [menu, setMenu] = useState(menuList)
    const [FourceUpdateModalVisible, setFourceUpdateModalVisible] = useState(false)

    const modalDispatch = useWrapDispatch(setModal)
    useScreen(() => {
        const fetchAppVersionCheck = async () => {
            const { osVersionInfo } = await systemSvc.getOsVersionInfo()

            // 강업 여부 체크
            if (osVersionInfo) {
                const { appBasicVersion, appForceVersion, appStoreUrl } = osVersionInfo
                const currentVersion = DeviceInfo.getVersion() // 사용자의 현재 앱 버전을 가져옴
                store.dispatch(setAppVersionInfo({ appBasicVersion, appForceVersion, appStoreUrl }))
                if (appForceVersion && semver.lt(currentVersion, appForceVersion)) {
                    setFourceUpdateModalVisible(true)
                    return
                }
            }
        }
        fetchAppVersionCheck()
        // 선택된 버튼의 disabled 상태를 true로 변경합니다.

        setMenu(list =>
            list.map(v => {
                const routeCheck =
                    route.name === Screen.PLAYERSELECTION ? v.screen === Screen.NFTTABSCENE : v.screen === route.name
                return {
                    ...v,
                    disabled: routeCheck,
                    // disabled: routeCheck && (route.params == undefined || route.params.type == v.params.type),
                }
            })
        )
    }, [route.name])

    // const onPress = () => {
    //     modalDispatch({
    //         open: true,
    //         children: <ReadyModal />,
    //     })
    // }

    const insets = useSafeAreaInsets()

    return (
        <View
            style={{
                width: RatioUtil.lengthFixedRatio(360),
                height: RatioUtil.lengthFixedRatio(62) + insets.bottom,
                paddingBottom: insets.bottom,
                backgroundColor: Colors.WHITE,
                position: "absolute",
                bottom: 0,
                borderColor: Colors.GRAY7,
                borderWidth: 1,
                borderBottomWidth: 0,
                borderTopLeftRadius: RatioUtil.lengthFixedRatio(15),
                borderTopRightRadius: RatioUtil.lengthFixedRatio(15),
                flexDirection: "row",
                alignItems: "center",
                ...props.style,
            }}
        >
            {menu.map(({ title, icon, screen, disabled, icons, params }) => (
                <CustomButton
                    key={title}
                    onPress={async () => {
                        // if (screen === Screen.TEST) onPress()
                        // else navigate(screen, params)
                        switch (screen) {
                            case Screen.NFTLIST:
                                await Analytics.logEvent(AnalyticsEventName.click_navi_home_45, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                                break
                            case Screen.RANK:
                                await Analytics.logEvent(AnalyticsEventName.click_navi_rank_45, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                                break
                            case Screen.RAFFLETABSCENE:
                                await Analytics.logEvent(AnalyticsEventName.click_navi_raffle_45, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                                break
                            case Screen.NFTTABSCENE:
                                await Analytics.logEvent(AnalyticsEventName.click_navi_market_45, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                                break
                            case Screen.MYPAGE:
                                await Analytics.logEvent(AnalyticsEventName.click_navi_mypage_45, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                                break
                        }
                        navigate(screen, params)
                    }}
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    disabled={disabled}
                >
                    {disabled ? (
                        <SvgIcon
                            name={icons}
                            width={RatioUtil.lengthFixedRatio(16)}
                            height={RatioUtil.lengthFixedRatio(16)}
                        />
                    ) : (
                        // <WithLocalSvg asset={icons} width={RatioUtil.lengthFixedRatio(16)} height={RatioUtil.lengthFixedRatio(16)} />
                        <SvgIcon
                            name={icon}
                            width={RatioUtil.lengthFixedRatio(16)}
                            height={RatioUtil.lengthFixedRatio(16)}
                        />
                        // <WithLocalSvg asset={icon} width={RatioUtil.lengthFixedRatio(16)} height={RatioUtil.lengthFixedRatio(16)} />
                    )}
                    <Text
                        style={{
                            marginTop: RatioUtil.lengthFixedRatio(2),
                            fontSize: RatioUtil.font(10),
                            lineHeight: RatioUtil.font(10) * 1.4,
                            color: disabled ? Colors.BLACK : Colors.GRAY3,
                            fontWeight: disabled ? RatioUtil.fontWeightBold() : "400",
                        }}
                    >
                        {title}
                    </Text>
                </CustomButton>
            ))}
            <AppForceUpdatePopup modalVisible={FourceUpdateModalVisible} />
        </View>
    )
}

// 전역에서 관리가 필요합니다. 그렇지 않으면 매번 새로운 창으로 로딩할 때마다 마이페이지만 true입니다.
const menuList = [
    {
        title:
            // "홈"
            jsonSvc.findLocalById("1036"),
        // icon: footerImg.link.home,
        // icons: footerImg.link.homes,
        icon: "FooterHomeSvg",
        icons: "FooterHomesSvg",
        screen: Screen.NFTLIST,
        disabled: false,
        params: { type: "home" },
    },
    {
        title:
            // "랭크"
            jsonSvc.findLocalById("150000"),
        // icon: footerImg.link.rank,
        // icons: footerImg.link.ranks,
        icon: "FooterRankSvg",
        icons: "FooterRanksSvg",
        screen: Screen.RANK,
        disabled: false,
        params: { type: "rank" },
    },
    {
        title:
            // "래플",
            jsonSvc.findLocalById("13107"),
        // icon: footerImg.link.social,
        // icons: footerImg.link.socials,
        icon: "FooterRaffleSvg",
        icons: "FooterRafflesSvg",
        screen: Screen.RAFFLETABSCENE,
        disabled: false,
        params: { type: "raffle" },
    },
    {
        title:
            // "마켓",
            jsonSvc.findLocalById("13105"),
        // icon: footerImg.link.market,
        // icons: footerImg.link.markets,
        icon: "FooterMarketSvg",
        icons: "FooterMarketsSvg",
        screen: Screen.NFTTABSCENE,
        disabled: false,
        params: { type: "nft" },
    },
    {
        title:
            // "마이페이지",
            jsonSvc.findLocalById("170001"),
        // icon: footerImg.link.mypage,
        // icons: footerImg.link.mypages,
        icon: "FooterMypageSvg",
        icons: "FooterMypagesSvg",
        screen: Screen.MYPAGE,
        disabled: false,
        params: { type: "mypage" },
    },
] //마이페이지 이미지 선택 이미지 추가해야함 icons 에서 mypage에 s 추가
function modalDispatch(arg0: { open: boolean; children: JSX.Element }) {
    throw new Error("Function not implemented.")
}
