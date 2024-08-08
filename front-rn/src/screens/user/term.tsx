import React, { Fragment, useEffect } from "react"
import { View, Image } from "react-native"
import { termImg } from "assets/images"
import { userStyle, userGStyle } from "styles/user.style"
import { useCheckbox, CheckBox } from "components/Checkbox"
import { CustomButton, PretendText } from "components/utils"
import { ConfigUtil, navigate, RatioUtil } from "utils"
import { AnalyticsEventName, Colors, Screen, SettingTitle, settingMenu } from "const"
import { useAsyncEffect, useStyle } from "hooks"
import { SafeAreaView } from "react-native-safe-area-context"
import { jsonSvc, profileSvc, signSvc } from "apis/services"
import { KakaoSignApi, UniteSignApi } from "apis/external"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LOGIN_SCREEN_TUTORIAL } from "const/wallet.const"
import { SvgIcon } from "components/Common/SvgIcon"
import { APP_USER_ID } from "utils/env"
import { SETTING_ID } from "utils/env"
import { Analytics } from "utils/analytics.util"

const uniteSignApi = new UniteSignApi()
const kakaoSignApi = new KakaoSignApi()

const Term = () => {
    const { style: termCss } = useStyle(userStyle.genTerm)
    // const route = useRoute<RouteProp<ScreenParams, Screen.TERM>>()

    // console.log(route.params.term)
    // const [term, setTerm] = useState<any>()

    // useEffect(() => {
    //     ;(async () => {
    //         console.log(1)
    //         const { accessToken } = await kakaoSignApi.signIn()
    //         const profile = await kakaoSignApi.getProfile()
    //         const { kakaovx } = await uniteSignApi.signUpCheck(profile)
    //         setTerm(kakaovx.data.terms)
    //     })()
    // }, [])

    // console.log(term?.map(v => v.title))
    // ["카카오VX  공통약관 4", "위치정보 서비스 이용약관", "개인정보 수집 및 이용 내역"]

    const { checkedList, onAllCheck, onCheck, isCheck, isAllcheck } = useCheckbox({
        checkable: [100, 101, 102, 103, 104, 105],
    })

    const isPermission = isCheck([101, 102, 103, 104])

    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_agree_2, { hasNewUserData: true })
    }, [])

    const onComplete = async () => {
        if (isPermission) {
            await signSvc.login().then(async (res: any) => {
                const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
                const profile = await kakaoSignApi.getProfile()
                await AsyncStorage.setItem(USER_ID + LOGIN_SCREEN_TUTORIAL, "1")

                let initialSetting = settingMenu

                if (!isCheck([105])) {
                    initialSetting = settingMenu.map(item => {
                        if (item.title === SettingTitle.RAFFLE_BEGIN || item.title === SettingTitle.RAFFLE_RESULT) {
                            return { ...item, isCheck: false }
                        } else {
                            return item
                        }
                    })
                }

                await Analytics.logEvent(AnalyticsEventName.click_complete_2, {
                    marketing_agree: isCheck([105]) ? "TRUE" : "FALSE",
                })

                console.error(initialSetting)

                const data = await profileSvc.setAlarm(initialSetting)

                console.error(data)

                await ConfigUtil.setStorage({
                    [SETTING_ID]: JSON.stringify(data),
                })

                await AsyncStorage.setItem(LOGIN_SCREEN_TUTORIAL, "1")
                const { nickname } = profile || {}
                navigate(Screen.INTROTUTORIAL, { nickname, isRaffleCheck: isCheck([105]) })
                // navigate(Screen.TEST)
            })
        }
    }

    const checkList = checkedList.filter(e => e.ischeck === true && e.name !== 100).length

    return (
        <SafeAreaView style={termCss.con}>
            <CustomButton style={termCss.header} onPress={() => navigate(Screen.BACK)}>
                <SvgIcon name="BackSvg" />
            </CustomButton>
            <View style={termCss.titleCon}>
                <PretendText style={termCss.titleText}>
                    {/* 버드스쿼드 이용약관에 동의해주세요. */}
                    {jsonSvc.findLocalById("5001")}
                </PretendText>
            </View>
            <View style={termCss.main}>
                {checkedList.map((v, i, { length }) => {
                    const isAllCheckBox = v.name === 100
                    const isLast = i === length - 1

                    return (
                        <Fragment key={v.name}>
                            <CheckBox
                                onCheck={async () => {
                                    if (isAllCheckBox) {
                                        onAllCheck()
                                        await Analytics.logEvent(AnalyticsEventName.click_all_agree_2)
                                    } else {
                                        onCheck(v.name)
                                    }
                                }}
                                ischeck={isAllCheckBox ? (checkList < 5 ? false : true) : v.ischeck}
                                unCheckedView={
                                    <View
                                        style={{
                                            flexDirection: "row",
                                        }}
                                    >
                                        <Image
                                            source={termImg.uncheck}
                                            style={{
                                                width: RatioUtil.width(20),
                                                height: RatioUtil.width(20),
                                            }}
                                            resizeMode="contain"
                                        />
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                width: RatioUtil.width(280),
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...termCss.checkboxText,
                                                    color: isAllCheckBox ? Colors.PURPLE : Colors.BLACK,
                                                    fontWeight: RatioUtil.fontWeightBold(),
                                                }}
                                            >
                                                {termcontents[v.name].title}
                                            </PretendText>

                                            {termcontents[v.name].link && (
                                                <TermWebView link={termcontents[v.name].link ?? ""} />
                                            )}
                                        </View>
                                    </View>
                                }
                                checkedView={
                                    <View
                                        style={{
                                            flexDirection: "row",
                                        }}
                                    >
                                        <Image
                                            source={termImg.check}
                                            style={{
                                                width: RatioUtil.width(20),
                                                height: RatioUtil.width(20),
                                            }}
                                            resizeMode="contain"
                                        />
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                width: RatioUtil.width(280),
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    ...termCss.checkboxText,
                                                    color: isAllCheckBox ? Colors.PURPLE : Colors.BLACK,
                                                    fontWeight: RatioUtil.fontWeightBold(),
                                                }}
                                            >
                                                {termcontents[v.name].title}
                                            </PretendText>

                                            {termcontents[v.name].link && (
                                                <TermWebView link={termcontents[v.name].link ?? ""} />
                                            )}
                                        </View>
                                    </View>
                                }
                                style={{
                                    ...termCss.checkboxCon,
                                    backgroundColor: isAllCheckBox ? Colors.BLUE2 : Colors.WHITE,
                                    paddingVertical: RatioUtil.height(15),
                                    borderRadius: RatioUtil.width(6),
                                }}
                            ></CheckBox>
                        </Fragment>
                    )
                })}
            </View>
            <View style={userGStyle.userbtn.conIntro}>
                <CustomButton
                    style={{
                        ...userGStyle.userbtn.box,
                        height: RatioUtil.heightSafeArea(60),
                        backgroundColor: isPermission ? Colors.PURPLE : Colors.GRAY5,
                    }}
                    onPress={onComplete}
                >
                    <PretendText
                        style={{
                            ...userGStyle.userbtn.text,
                            color: Colors.WHITE,
                            fontSize: RatioUtil.font(16),
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}
                    >
                        {/* 완료 */}
                        {jsonSvc.findLocalById("5000")}
                    </PretendText>
                </CustomButton>
            </View>
        </SafeAreaView>
    )
}

export default Term

const TermWebView = ({ link }: { link: string }) => {
    const { style: termCss } = useStyle(userStyle.genTerm)
    return (
        <>
            <CustomButton
                onPress={() =>
                    navigate(Screen.WEBVIEWTERM, {
                        url: link,
                    })
                }
            >
                <Image source={termImg.showMore} style={termCss.checkboxShowMore} resizeMode="contain" />
            </CustomButton>
        </>
    )
}

const termcontents: { [key: string]: { title: string; link?: string } } = {
    100: {
        title:
            // "모든 약관에 동의합니다."
            jsonSvc.findLocalById("5002"),
    },
    101: {
        title:
            // "만 14세 이상입니다 (필수)",
            jsonSvc.findLocalById("5008"),
    },
    102: {
        title: "카카오VX 통합이용약관 (필수)",
        // // "서비스 이용 약관 (필수)",
        // jsonSvc.findLocalById("5003"),
        link: "https://kakaovx.com/agreement.php?type=terms",
    },
    103: {
        title:
            // "서비스 이용 약관 (필수)",
            jsonSvc.findLocalById("5003"),
        link: "https://birdiesquad.io/terms/use_service.html",
    },
    104: {
        title:
            // "개인정보 수집 및 이용 (필수)",
            jsonSvc.findLocalById("5004"),
        // link: "https://kakaovx.com/agreement.php?type=privacy",
        link: "https://birdiesquad.io/terms/use_person_info_policy.html",
    },
    105: {
        title: "마케팅 수집 및 활용 동의 (선택)",
        // // "버디스쿼드 플러스친구 추가 (선택)"
        // jsonSvc.findLocalById("5005"),
        link: "https://birdiesquad.io/terms/use_marketing.html",
    },
}
