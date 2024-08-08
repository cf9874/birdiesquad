import React, { useRef, useState, useEffect } from "react"
import { Image, View, Animated } from "react-native"
import { IntroImg } from "assets/images"
import { SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DateUtil, ConfigUtil, RatioUtil } from "utils"
import { APP_USER_ID } from "utils/env"

import { CustomButton, PretendText } from "components/utils"
import { Screen, Colors, AnalyticsEventName, ThirdPartyAnalyticsEventName } from "const"
import { jsonSvc } from "apis/services"
import { navigateReset } from "utils"
import {
    HOME_SCREEN_TUTORIAL,
    LOGIN_SCREEN_TUTORIAL,
    NFT_ADVANCEMENT_SCREEN_TUTORIAL,
    NFT_DETAIL_SCREEN_TUTORIAL,
    NFT_SPENDING_SCREEN_TUTORIAL,
    RELAY_SCREEN_BEFORE_TUTORIAL,
    RELAY_SCREEN_ENDED_TUTORIAL,
    RELAY_SCREEN_LIVE_TUTORIAL,
    RELAY_SCREEN_POPUP_TUTORIAL,
    RANK_SCREEN_TUTORIAL,
    SIGNUP_REWARD,
    TutorialId,
} from "const/wallet.const"
import { Shadow } from "react-native-shadow-2"
import { BlurView } from "@react-native-community/blur"
import { useWrapDispatch } from "hooks"
import { setToast } from "store/reducers/config.reducer"
import { useRoute } from "@react-navigation/native"
import { WalletToast } from "../nft/components/popup/walletToast"
import { Analytics } from "utils/analytics.util"

const IntroTutorial = () => {
    const numCards = 6
    const fadeAnims: Animated.Value[] = []
    let imageLoaded: boolean = false

    const toastDispatch = useWrapDispatch(setToast)
    const route = useRoute<any>()

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

    useEffect(() => {
        const check = route.params?.isRaffleCheck

        if (check === undefined) return

        onToast(!check)
    }, [route.params?.isRaffleCheck])

    const [tutorialIndex, setTutorialIndex] = useState<number>(-1)
    const [btnDisabled, setBtnDisable] = useState<boolean>(true)
    const [tutorialStarted, setTutorialStarted] = useState<boolean>(false)

    for (let index = 0; index < numCards; index++) {
        fadeAnims.push(useRef(new Animated.Value(index == 0 ? 1 : 0)).current)
    }

    let fadeInScreenAnim = useRef(new Animated.Value(0)).current

    const fadeInDurationMSec = 700

    const onComplete = async () => {
        const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
        await AsyncStorage.setItem(USER_ID + HOME_SCREEN_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_ENDED_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_LIVE_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_BEFORE_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_POPUP_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + NFT_DETAIL_SCREEN_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + NFT_SPENDING_SCREEN_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + NFT_ADVANCEMENT_SCREEN_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + RANK_SCREEN_TUTORIAL, "1")
        await AsyncStorage.setItem(USER_ID + LOGIN_SCREEN_TUTORIAL, "2").then(() => {
            Analytics.thirdPartyLogEvent(ThirdPartyAnalyticsEventName.af_tutorial_completion, {
                af_success: "TRUE",
                af_tutorial_id: TutorialId[LOGIN_SCREEN_TUTORIAL],
            })
        })

        Analytics.thirdPartyLogEvent(ThirdPartyAnalyticsEventName.af_complete_registration)

        navigateReset(Screen.NFTLIST, { receiveIntroReward: true })
    }

    const nextInfo = async () => {
        if (tutorialIndex + 1 == numCards) {
            await Analytics.logEvent(AnalyticsEventName.click_start_10, {
                slideNum: numCards,
                hasNewUserData: true,
            })
            setBtnDisable(true)
            onComplete()
            return
        } else {
            await Analytics.logEvent(
                AnalyticsEventName[`view_tutorial_10_${tutorialIndex + 1}` as AnalyticsEventName],
                {
                    hasNewUserData: true,
                }
            )
        }

        setBtnDisable(true)

        // fadeout
        Animated.timing(fadeAnims[tutorialIndex], {
            toValue: 0,
            duration: fadeInDurationMSec,
            useNativeDriver: true,
        }).start()

        // fadein
        Animated.timing(fadeAnims[tutorialIndex + 1], {
            toValue: 1,
            duration: fadeInDurationMSec,
            useNativeDriver: true,
        }).start()

        setTutorialIndex(tutorialIndex + 1)
    }

    const startTutorial = () => {
        imageLoaded = true
        if (tutorialStarted) return

        setTutorialStarted(true)

        // fadein
        Animated.timing(fadeInScreenAnim, {
            toValue: 1,
            duration: fadeInDurationMSec * 2,
            useNativeDriver: true,
        }).start()

        setTutorialIndex(0)
    }

    useEffect(() => {
        if (imageLoaded == false) return

        setTimeout(() => {
            setBtnDisable(false)
        }, jsonSvc.findConstBynId("TUTORIAL_NEXT_BUTTON_VISIBLE_TIME_SEC").nIntValue * 1000)
    }, [tutorialIndex])

    const getPageView = (index: number) => {
        return (
            <View
                style={{
                    marginTop: RatioUtil.heightSafeArea(74),
                    width: RatioUtil.heightSafeArea(47),
                    height: RatioUtil.heightSafeArea(27),
                    borderRadius: RatioUtil.heightSafeArea(20),
                    borderColor: "#DFDFDF",
                    borderWidth: RatioUtil.width(1),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        color: "#000000",
                    }}
                >
                    {index + 1}
                </PretendText>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        color: "#C7C7C7",
                    }}
                >
                    {"/"}
                </PretendText>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                        color: "#9B9BA3",
                    }}
                >
                    {numCards}
                </PretendText>
            </View>
        )
    }

    interface _ITextInfo {
        color: string
        text: string
    }
    const getColorTextView = (msg: string, fontSize: number, fontWeight: any) => {
        if (!msg || msg.length < 1) return <></>

        const words = msg.split(" ")

        const texts: _ITextInfo[] = []
        words.map((word, index) => {
            let _index = 0
            let tempWord = word + (index == words.length + 1 ? "" : " ")
            while (true) {
                const colorStartIndex = tempWord.indexOf("#", _index)
                if (colorStartIndex >= 0) {
                    const colorEndIndex = tempWord.indexOf("#", colorStartIndex + 1)
                    if (colorEndIndex >= 0) {
                        texts.push({
                            color: tempWord.substring(colorStartIndex, colorStartIndex + 7),
                            text: tempWord.substring(colorStartIndex + 7, colorEndIndex),
                        })
                        _index = colorEndIndex
                        tempWord = tempWord.substring(colorEndIndex + 1)
                        continue
                    }
                }

                texts.push({ color: "#000000", text: tempWord })
                break
            }
        })

        return (
            <View
                style={{
                    flexDirection: "row",
                }}
            >
                {texts.map(textInfo => (
                    <PretendText
                        style={{
                            fontSize: fontSize,
                            fontWeight: fontWeight,
                            color: textInfo.color,
                        }}
                    >
                        {textInfo.text}
                    </PretendText>
                ))}
            </View>
        )
    }

    const getCard01View = (onImageLoaded: Function) => {
        return (
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                {getPageView(0)}
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    {getColorTextView("골프를 즐기는", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                    {getColorTextView("#5465FF색#다른 방법", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                </View>
                <Image
                    source={IntroImg.intro01}
                    style={{
                        width: RatioUtil.width(275),
                        height: RatioUtil.lengthFixedRatio(272),
                        position: "absolute",
                        top: RatioUtil.height(239),
                        bottom: RatioUtil.height(149),
                        left: RatioUtil.width(59),
                        right: RatioUtil.width(26),
                    }}
                    resizeMode="contain"
                    onLoadEnd={onImageLoaded()}
                />
            </View>
        )
    }

    const getCard02View = () => {
        return (
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                {getPageView(1)}
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    {getColorTextView("프로들의 #5465FFNFT#로", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                    {getColorTextView("컬렉션을 만들고,", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                </View>
                <Image
                    source={IntroImg.intro02}
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.width(740),
                        position: "absolute",
                        top: RatioUtil.height(0),
                        bottom: RatioUtil.height(0),
                        left: RatioUtil.width(0),
                        right: RatioUtil.width(0),
                    }}
                    resizeMode="contain"
                />
            </View>
        )
    }

    const getCard03View = () => {
        return (
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                {getPageView(2)}
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    {getColorTextView("#5465FF최애프로#를", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                    {getColorTextView("응원하고,", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                </View>
                <Image
                    source={IntroImg.intro03}
                    style={{
                        width: RatioUtil.width(234),
                        height: RatioUtil.width(231),
                        position: "absolute",
                        top: RatioUtil.height(233),
                        bottom: RatioUtil.height(196),
                        left: RatioUtil.width(63),
                        right: RatioUtil.width(63),
                    }}
                    resizeMode="contain"
                />
            </View>
        )
    }

    const getCard04View = () => {
        return (
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                {getPageView(3)}
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    {getColorTextView("래플로", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                    {getColorTextView("#5465FF선물#도 받고,", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                </View>
                <View
                    style={{
                        width: RatioUtil.width(360 - 45 - 18),
                        height: RatioUtil.width(38 + 123 + 242),
                        position: "absolute",
                        top: RatioUtil.height(201),
                        bottom: RatioUtil.height(136),
                        left: RatioUtil.width(18),
                        right: RatioUtil.width(45),
                    }}
                >
                    <Image
                        source={IntroImg.intro0403}
                        style={{
                            width: RatioUtil.width(107),
                            height: RatioUtil.width(123),
                            position: "absolute",
                            top: 0,
                            left: RatioUtil.width(38),
                        }}
                        resizeMode="contain"
                    />
                    <Image
                        source={IntroImg.intro0402}
                        style={{
                            width: RatioUtil.width(142),
                            height: RatioUtil.width(170),
                            position: "absolute",
                            top: RatioUtil.width(49),
                            right: 0,
                        }}
                        resizeMode="contain"
                    />
                    <Image
                        source={IntroImg.intro0401}
                        style={{
                            width: RatioUtil.width(256),
                            height: RatioUtil.width(286),
                            position: "absolute",
                            bottom: 0,
                            left: RatioUtil.width(0),
                        }}
                        resizeMode="contain"
                    />
                </View>
            </View>
        )
    }

    const getCard05View = () => {
        return (
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                {getPageView(4)}
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    {getColorTextView("즐거움을", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                    {getColorTextView("#5465FF실시간#으로 나누는", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                </View>
                <Image
                    source={IntroImg.intro05}
                    style={{
                        width: RatioUtil.width(328),
                        height: RatioUtil.width(353),
                        position: "absolute",
                        top: RatioUtil.height(169),
                        bottom: RatioUtil.height(137.5),
                        left: RatioUtil.width(12),
                        right: RatioUtil.width(20),
                    }}
                    resizeMode="contain"
                />
            </View>
        )
    }

    const getCard06View = () => {
        return (
            <View
                style={{
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <Image
                    source={IntroImg.intro0601}
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.width(740),
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                    }}
                    resizeMode="cover"
                />
                {getPageView(5)}
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: RatioUtil.lengthFixedRatio(20),
                    }}
                >
                    {getColorTextView("세상에 없던", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                    {getColorTextView("#5465FF새로운# #5465FF필드#", RatioUtil.font(32), RatioUtil.fontWeightBold())}
                </View>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        width: RatioUtil.width(269),
                        height: RatioUtil.lengthFixedRatio(218),
                        position: "absolute",
                        top: RatioUtil.height(267),
                        bottom: RatioUtil.height(175),
                        left: RatioUtil.width(46),
                        right: RatioUtil.width(45),
                    }}
                >
                    <View>
                        <Shadow
                            distance={8}
                            startColor="#00000010"
                            style={{
                                borderRadius: RatioUtil.width(10),
                                overflow: "hidden",
                            }}
                            containerStyle={{
                                ...RatioUtil.sizeFixedRatio(269, 62),
                            }}
                        >
                            <BlurView
                                style={{ ...RatioUtil.sizeFixedRatio(269, 62) }}
                                blurType="light"
                                blurRadius={25}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    ...RatioUtil.sizeFixedRatio(269, 62),
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                            >
                                <Image
                                    source={IntroImg.intro0602}
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(22, 22),
                                        marginLeft: RatioUtil.width(20),
                                        marginRight: RatioUtil.width(12),
                                        marginVertical: RatioUtil.lengthFixedRatio(20),
                                    }}
                                    resizeMode="contain"
                                />
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(18),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: "#66666B",
                                    }}
                                >
                                    응원, 보상, 소통을 한번에!
                                </PretendText>
                            </View>
                        </Shadow>
                    </View>
                    <View style={{ marginTop: RatioUtil.lengthFixedRatio(16) }}>
                        <Shadow
                            distance={8}
                            startColor="#00000010"
                            style={{
                                borderRadius: RatioUtil.width(10),
                                overflow: "hidden",
                            }}
                            containerStyle={{
                                ...RatioUtil.sizeFixedRatio(269, 62),
                            }}
                        >
                            <BlurView
                                style={{ ...RatioUtil.sizeFixedRatio(269, 62) }}
                                blurType="light"
                                blurRadius={25}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    ...RatioUtil.sizeFixedRatio(269, 62),
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                }}
                            >
                                <Image
                                    source={IntroImg.intro0602}
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(22, 22),
                                        marginLeft: RatioUtil.width(20),
                                        marginRight: RatioUtil.width(12),
                                        marginVertical: RatioUtil.lengthFixedRatio(20),
                                    }}
                                    resizeMode="contain"
                                />
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(18),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: "#66666B",
                                    }}
                                >
                                    프로와 팬을 이어주는 공간
                                </PretendText>
                            </View>
                        </Shadow>
                    </View>
                    <View style={{ marginTop: RatioUtil.lengthFixedRatio(16) }}>
                        <Shadow
                            distance={8}
                            startColor="#00000010"
                            style={{
                                borderRadius: RatioUtil.width(10),
                                overflow: "hidden",
                            }}
                            containerStyle={{
                                ...RatioUtil.sizeFixedRatio(269, 62),
                            }}
                        >
                            <BlurView
                                style={{ ...RatioUtil.sizeFixedRatio(269, 62) }}
                                blurType="light"
                                blurRadius={25}
                            />
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    ...RatioUtil.sizeFixedRatio(269, 62),
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                }}
                            >
                                <Image
                                    source={IntroImg.intro0602}
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(22, 22),
                                        marginLeft: RatioUtil.width(20),
                                        marginRight: RatioUtil.width(12),
                                        marginVertical: RatioUtil.lengthFixedRatio(20),
                                    }}
                                    resizeMode="contain"
                                />
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(18),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: "#66666B",
                                    }}
                                >
                                    골프 팬들의 플레이그라운드
                                </PretendText>
                            </View>
                        </Shadow>
                    </View>
                </View>
            </View>
        )
    }

    const getCardView = (index: number, onImageLoaded: Function) => {
        if (index < 0 || index >= numCards) return null

        switch (index) {
            case 0:
                return getCard01View(onImageLoaded)
            case 1:
                return getCard02View()
            case 2:
                return getCard03View()
            case 3:
                return getCard04View()
            case 4:
                return getCard05View()
            case 5:
                return getCard06View()
            default:
                return getCard01View(onImageLoaded)
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            <Animated.View
                style={{
                    flex: 1,
                    opacity: fadeInScreenAnim,
                }}
            >
                {fadeAnims.map((fadeAnim, index) => (
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            width: RatioUtil.width(360),
                        }}
                        key={index}
                    >
                        {getCardView(index, () => {
                            if (index == 0) startTutorial()
                        })}
                    </Animated.View>
                ))}

                <CustomButton
                    disabled={btnDisabled}
                    style={{
                        marginHorizontal: RatioUtil.width(20),
                        width: RatioUtil.width(320),
                        height: RatioUtil.heightSafeArea(60),
                        position: "absolute",
                        bottom: RatioUtil.heightSafeArea(26),
                    }}
                    onPress={() => {
                        nextInfo()
                    }}
                >
                    <View
                        style={{
                            backgroundColor: btnDisabled
                                ? "#E9ECEF"
                                : tutorialIndex + 1 == numCards
                                ? "#5465FF"
                                : Colors.BLACK,
                            width: RatioUtil.width(320),
                            height: RatioUtil.heightSafeArea(60),
                            borderRadius: RatioUtil.width(100),
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: btnDisabled ? Colors.GRAY8 : Colors.WHITE,
                            }}
                        >
                            {tutorialIndex + 1 == numCards
                                ? "NFT 무료로 받고 시작하기"
                                : jsonSvc.findLocalById("110102")}
                        </PretendText>
                    </View>
                </CustomButton>
            </Animated.View>
        </SafeAreaView>
    )
}

export default IntroTutorial
