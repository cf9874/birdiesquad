import { ProfileHeader } from "components/layouts"
import { PretendText } from "components/utils"
import { AnalyticsEventName, Colors, Screen, settingMenu, type SettingMenu } from "const"
import { useScreen, useWrapDispatch } from "hooks"
import React, { useEffect, useState } from "react"
import { BackHandler, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { mineGStyle } from "styles"
import { settingStyle } from "styles/setting.style"
import ToggleSwitch from "toggle-switch-react-native"
import { ConfigUtil, DateUtil, RatioUtil, navigate } from "utils"

import { useNavigation } from "@react-navigation/native"
import { jsonSvc, profileSvc } from "apis/services"
import { nftDetailImg } from "assets/images"
import { WalletToast } from "screens/nft/components"
import { setToast } from "store/reducers/config.reducer"
import { SETTING_ID } from "utils/env"
import { Analytics } from "utils/analytics.util"

const SetAlarm = () => {
    const navigation = useNavigation()
    const toastDispatch = useWrapDispatch(setToast)
    const [menu, setMenu] = useState(settingMenu)

    const initSetting = async () => {
        const data = await ConfigUtil.getStorage<SettingMenu>(SETTING_ID)
        console.error(data)

        data && setMenu(data)
    }
    const saveSetting = async () => {
        const data = await profileSvc.setAlarm(menu)
        if (data) {
            await ConfigUtil.setStorage({
                [SETTING_ID]: JSON.stringify(data),
            })
        }
    }

    useScreen(() => {
        initSetting()
    }, [])
    //
    useEffect(() => {
        const backAction = () => {
            navigate(Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])
    useEffect(() => {
        const unsubscribe = navigation.addListener("beforeRemove", async e => {
            e.preventDefault()
            await saveSetting()
            navigation.dispatch(e.data.action)
        })

        return unsubscribe
    }, [navigation, saveSetting])

    useEffect(() => {
        saveSetting()
    }, [menu])

    const onToast = (toggle: boolean) => {
        const date = DateUtil.format(Date())
        const message = jsonSvc.formatLocal(jsonSvc.findLocalById(toggle ? "10000057" : "10000056"), [
            (date?.year).toString(),
            (Number(date?.month) < 10 ? "0" + date?.month : date?.month).toString(),
            (Number(date?.day) < 10 ? "0" + date?.day : date?.day).toString(),
        ])
        toastDispatch({
            open: true,
            children: <WalletToast message={message} image="NftDetailErrorSvg" />,
        })

        setTimeout(() => {
            toastDispatch({ open: false })
        }, 2000)
    }
    return (
        <SafeAreaView style={mineGStyle.con}>
            <ProfileHeader title="알림 설정" />
            <View
                style={[
                    mineGStyle.bgCon,
                    {
                        marginTop: RatioUtil.height(20),
                    },
                ]}
            >
                {menu.slice(0, 5).map(({ title, isCheck }, i) => (
                    <View key={i} style={[settingStyle.alarm.menuCon]}>
                        <View
                            style={{
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <PretendText style={settingStyle.alarm.text}>{title}</PretendText>
                            <ToggleSwitch
                                isOn={isCheck}
                                onColor={Colors.PURPLE}
                                offColor={Colors.GRAY7}
                                trackOffStyle={settingStyle.alarm.toggleTrack}
                                trackOnStyle={settingStyle.alarm.toggleTrack}
                                thumbOffStyle={{ ...settingStyle.alarm.thumb, marginLeft: RatioUtil.width(4) }}
                                thumbOnStyle={{ ...settingStyle.alarm.thumb }}
                                onToggle={async () => {
                                    await Analytics.logEvent(AnalyticsEventName.view_detail_profile_155, {
                                        hasNewUserData: true,
                                        notice_state: isCheck ? "FALSE" : "TRUE",
                                    })
                                    await setMenu(menu =>
                                        menu.map(v => ({ ...v, isCheck: v.title === title ? !v.isCheck : v.isCheck }))
                                    )
                                }}
                            />
                        </View>

                        <View
                            style={{
                                backgroundColor: Colors.WHITE3,
                                height: i !== 4 ? 1 : 0,
                                width: RatioUtil.width(320),
                                marginTop: RatioUtil.height(10),
                            }}
                        ></View>
                    </View>
                ))}
                <View
                    style={{
                        height: RatioUtil.height(10),
                        backgroundColor: "#f7f9fc",
                    }}
                ></View>
                {menu.slice(5, 7).map(({ title, isCheck }, i) => {
                    return (
                        <View key={i} style={settingStyle.alarm.menuCon}>
                            <View
                                style={{
                                    width: "100%",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <PretendText style={settingStyle.alarm.text}>{title}</PretendText>
                                <ToggleSwitch
                                    isOn={isCheck}
                                    onColor={Colors.PURPLE}
                                    offColor={Colors.GRAY7}
                                    trackOffStyle={settingStyle.alarm.toggleTrack}
                                    trackOnStyle={settingStyle.alarm.toggleTrack}
                                    thumbOffStyle={{ ...settingStyle.alarm.thumb, marginLeft: RatioUtil.width(4) }}
                                    thumbOnStyle={{ ...settingStyle.alarm.thumb }}
                                    onToggle={() => {
                                        onToast(isCheck)
                                        setMenu(menu =>
                                            menu.map(v => ({
                                                ...v,
                                                isCheck: v.title === title ? !v.isCheck : v.isCheck,
                                            }))
                                        )
                                    }}
                                />
                            </View>

                            <View
                                style={{
                                    backgroundColor: Colors.WHITE3,
                                    height: i !== 1 ? 1 : 0,
                                    width: RatioUtil.width(320),
                                    marginTop: RatioUtil.height(10),
                                }}
                            ></View>
                        </View>
                    )
                })}
                <View
                    style={{
                        backgroundColor: "#f7f9fc",
                        width: RatioUtil.width(320),
                        height: RatioUtil.height(140),
                        borderRadius: RatioUtil.width(6),
                        marginLeft: RatioUtil.width(20),
                        paddingHorizontal: RatioUtil.width(20),
                        paddingVertical: RatioUtil.height(20),
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(13),
                            fontWeight: "700",
                            color: Colors.GRAY2,
                        }}
                    >
                        {/* 이벤트 및 마케팅 활용 동의 */}
                        {jsonSvc.findLocalById("172030")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(12),
                            fontWeight: "400",
                            marginTop: RatioUtil.height(10),
                            color: Colors.GRAY8,
                            letterSpacing: RatioUtil.font(14) * -0.043,
                        }}
                    >
                        {/* {
                            "동의 시 고객님의 정보가 이벤트 및 광고 등에 활용됩니다.\n동의하지 않으셔도 서비스 이용이 가능합니다."
                        } */}
                        {jsonSvc.findLocalById("172031")}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(12),
                            fontWeight: "400",
                            marginTop: RatioUtil.height(10),
                            color: Colors.GRAY8,
                            letterSpacing: RatioUtil.font(14) * -0.043,
                        }}
                    >
                        {/* {
                            "*항목: 카카오 계정, 서비스 이용 내역, 서비스 내 결제 내역\n*보유기간: 마케팅, 광고 이용 동의 철회 및 탈퇴 시까지"
                        } */}
                        {jsonSvc.findLocalById("172032")}
                    </PretendText>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SetAlarm
