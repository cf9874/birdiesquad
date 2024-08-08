import {
    CHAT_POLICE_TYPE,
    Colors,
    settingMenu,
    SettingTitle,
    type SettingMenu,
    Screen,
    Dimension,
    AnalyticsEventName,
} from "const"
import { useWrapDispatch, useInputs, useAppSelector, useAsyncEffect } from "hooks"
import { useEffect, useRef, useState } from "react"
import {
    Image,
    TextInput,
    View,
    Keyboard,
    KeyboardEvent,
    Platform,
    TouchableWithoutFeedback,
    Alert,
    TextInputChangeEventData,
    TouchableOpacity,
    Modal,
    InteractionManager,
    ImageBackground,
} from "react-native"
import { setModal } from "store/reducers/config.reducer"
import { DateUtil, ErrorUtil, GameUtil, RatioUtil, navigate } from "utils"
import { mineStyle, cheerStyle, mineCompoStyle, liveStyle, LayoutCompoStyle } from "styles"
import { DonateValid } from "validators"
import { NFTCardImages, myPageImg, nftDetailImg, profileHeaderImg, rankImg } from "assets/images"
import { Slider } from "@miblanchard/react-native-slider"
import LinearGradient from "react-native-linear-gradient"
import { CustomButton, PretendText } from "components/utils"
import { liveImg, termImg } from "assets/images"
import { CheckBox, useCheckbox } from "components/Checkbox"
import { useKeyboardVisible, useQuery, useToggle } from "hooks"
import {
    KeyboardAvoidingView,
    NativeSyntheticEvent,
    ScrollView,
    TextInputFocusEventData,
    ViewStyle,
} from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import GestureRecognizer from "react-native-swipe-gestures"
import { setPopUp } from "store/reducers/config.reducer"
import { liveCompoStyle, liveGeneral } from "styles"
import { ConfigUtil, NumberUtil } from "utils"
import produce from "immer"
import { chatSvc, jsonSvc, nftSvc, profileSvc, rankSvc } from "apis/services"
import { IChatRes, IMyProfile, IPlayer } from "apis/data"
import { isArray } from "lodash"
import { SETTING_ID } from "utils/env"
import nftPlayerJson from "json/nft_player.json"
import { liveSvc } from "apis/services/live.svc"
import ProgressBar from "./circularProgress"
import ProfileImage from "components/utils/ProfileImage"

import { shallowEqual } from "react-redux"
import { updateDonatedUser } from "store/reducers/donate.reducer"
import { styles } from "../NftPayment/PlayerSelection/styles"
import WebView from "react-native-webview"
import { ISeasonDetail } from "apis/data/season.data"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import FastImage from "react-native-fast-image"
import { Analytics } from "utils/analytics.util"

export interface HeartContentsProps {
    selectPlayer?: IPlayer
    setSelectPlayer: React.Dispatch<React.SetStateAction<IPlayer | undefined>>
    id: number
    gameData?: ISeasonDetail
    isVisible: boolean
    // onSendHeart: () => void
    onAnimate: () => void
    onAnimationStart: (id: number) => void
}
export const HeartContents = ({
    selectPlayer,
    setSelectPlayer,
    id,
    gameData,
    isVisible,
    // onSendHeart,
    onAnimate,
    onAnimationStart,
}: HeartContentsProps) => {
    // livesvc check를 통해 라운드 종료판단 종료일경우 selectplayer 없애고 하트 잠금 필요
    const [locked, setLocked] = useState<boolean>(true)
    const [isFirst, setIsFirst] = useState<boolean>(false)

    if (!gameData) return <></>

    const weekcode = DateUtil.getWeekCode(gameData.BEGIN_AT)

    const [heartAmount, setHeartAmount] = useState<{
        weekCode: number
        type: string
        playerCode: number
        score: number
    } | null>(null)

    const [rankInfo, setRakInfo] = useState<any>({})
    // const [isEnd, setIsEnd] = useState<boolean>(false)

    const getHeartAmount = async (player: IPlayer | undefined) => {
        if (!player) return

        const data = await rankSvc.rankHeartAmount({
            weekcode: Number(weekcode),
            playercode: Number(player.nPersonID),
        })

        setHeartAmount(data)
    }

    const getRankInfo = async (player: IPlayer | undefined) => {
        if (!player) return

        const data = await rankSvc.playerRank({ gamecode: id, playercode: selectPlayer?.nPersonID ?? 0 })
        setRakInfo(data)
    }

    useEffect(() => {
        getHeartAmount(selectPlayer)
        getRankInfo(selectPlayer)
        const interval = setInterval(() => {
            getHeartAmount(selectPlayer)
            getRankInfo(selectPlayer)
        }, 15000)

        return () => clearInterval(interval)
    }, [selectPlayer, gameData])

    // useEffect(() => {
    //     const {
    //         data: { round },
    //     } = GameUtil.checkRound(gameData)
    //     if (round.isEnd) {
    //         setSelectPlayer(undefined)
    //         onSendHeart()
    //         setLocked(true)
    //         setIsEnd(true)
    //         // 라운드 없으면 선택된 플레이어 제거
    //     }
    // }, [gameData, selectPlayer])

    const modalDispatch = useWrapDispatch(setModal)
    const popUpDispatch = useWrapDispatch(setPopUp)

    const onSelectPlayer = async () => {
        const storageSetting = await ConfigUtil.getStorage<SettingMenu>(SETTING_ID)

        const isNever = storageSetting ? storageSetting.find(v => v.title === SettingTitle.LIVE_HEART)?.isCheck : false

        if (isNever) {
            modalDispatch({
                open: true,
                children: (
                    <BdstConfirm selectPlayer={selectPlayer} setSelectPlayer={setSelectPlayer} gameData={gameData} />
                ),
            })
        } else {
            popUpDispatch({
                open: true,
                children: <BdstSelectPlayer selectPlayer={selectPlayer} setSelectPlayer={setSelectPlayer} />,
            })
        }
    }

    // send heart event
    const onSend = async () => {
        if (!chatSvc.isLive()) {
            ErrorUtil.genModal(
                "현재 채팅연결이 끊어졌습니다\n 다시 입장해주세요.",
                () => navigate(Screen.NFTLIST),
                true
            )
            return
        }

        if (!selectPlayer && !locked) {
            await Analytics.logEvent(AnalyticsEventName.click_heart_lock_50, {
                hasNewUserData: true,
                first_action: "FALSE",
                game_id: gameData?.GAME_CODE,
            })
            onSelectPlayer()
            return
        }

        onAnimate()
        onAnimationStart(selectPlayer?.nPersonID ?? 0)

        if (!locked) {
            setLocked(true)
        }
    }

    const handleChangeStatus = async () => {
        await Analytics.logEvent(
            AnalyticsEventName.longpress_heart_lock_50,

            {
                hasNewUserData: true,
                first_action: "FALSE",
                game_id: gameData?.GAME_CODE,
            }
        )

        setLocked(false)
    }
    const handleUnlocked = () => {
        if (!selectPlayer) {
            setLocked(false)
            onSelectPlayer()
        }
    }
    const handleDummy = () => {}

    return (
        <>
            {!selectPlayer ? (
                <View
                    style={{
                        backgroundColor: Colors.PURPLE2,
                        ...RatioUtil.sizeFixedRatio(320, 37),
                        position: "absolute",
                        bottom: RatioUtil.lengthFixedRatio(58),
                        zIndex: 1,
                        elevation: 1,
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        ...RatioUtil.borderRadius(20, 20, 20, 20),
                        opacity: isVisible ? 1 : 0
                    }}
                >
                    <PretendText style={liveStyle.cheerTab.heartMsg}>
                        {/* 꾹~ 누르면 잠금해제! 선수에게 하트를 보내 응원하세요! */}
                        {jsonSvc.findLocalById("110051")}
                    </PretendText>
                    {/* <CustomButton
                        onPress={() => {
                            setMetaProps((state: any) =>
                                produce(state, (draft: any) => {
                                    // draft.heartMsgCon.style.display = "none"
                                    // draft.errorCon.style.bottom = RatioUtil.height(62)
                                })
                            )
                        }}
                    >
                        <Image source={liveImg.heartClose} style={liveStyle.cheerTab.heartClose} />
                    </CustomButton> */}
                    <Image source={liveImg.heartAngle} style={liveStyle.cheerTab.heartAngle} />
                </View>
            ) : (
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: RatioUtil.width(320),
                        position: "absolute",
                        bottom: RatioUtil.lengthFixedRatio(58),
                        alignSelf: "center",
                        alignItems: "center",
                        opacity: isVisible ? 1 : 0
                    }}
                >
                    <View
                        style={{
                            width: RatioUtil.lengthFixedRatio(260),
                            height: RatioUtil.lengthFixedRatio(32),
                            backgroundColor: Colors.PURPLE2,
                            //marginLeft: RatioUtil.width(20),
                            marginRight: RatioUtil.width(10),
                            ...RatioUtil.borderRadius(30),
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <LinearGradient
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    ...RatioUtil.sizeFixedRatio(32, 32),
                                    borderRadius: 100,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                colors={["#5B6BFF", "#979AFF"]}
                            >
                                <View
                                    style={{
                                        backgroundColor: Colors.WHITE,
                                        borderRadius: 100,
                                    }}
                                >
                                    <FastImage
                                        source={{ uri: ConfigUtil.getPlayerImage(selectPlayer.sPlayerImagePath) }}
                                        style={{ ...RatioUtil.sizeFixedRatio(28, 28), borderRadius: 100 }}
                                    ></FastImage>
                                </View>
                            </LinearGradient>

                            <View
                                style={{ flexDirection: "row", marginLeft: RatioUtil.width(10), alignItems: "center" }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.PURPLE,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        fontSize: RatioUtil.font(12),
                                    }}
                                >
                                    {rankInfo?.rank?.rank === -1 || rankInfo?.rank?.rank === undefined
                                        ? // ? "순위 없음"
                                          // : `${rankInfo?.rank?.rank}위 `}
                                          jsonSvc.findLocalById("150060")
                                        : jsonSvc.formatLocal(jsonSvc.findLocalById("110053"), [
                                              (rankInfo?.rank?.rank ?? "").toString(),
                                          ])}
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginLeft: RatioUtil.width(2),
                                        color: Colors.BLACK,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        fontSize: RatioUtil.font(12),
                                    }}
                                >
                                    {selectPlayer.sPlayerName}
                                </PretendText>
                            </View>
                        </View>
                        <CustomButton
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                marginRight: RatioUtil.width(13),
                                justifyContent: "space-between",
                                //width: RatioUtil.width(35),
                            }}
                            onPress={onSelectPlayer}
                        >
                            <PretendText
                                style={{
                                    color: Colors.PURPLE,
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    fontSize: RatioUtil.font(12),
                                    marginRight: RatioUtil.width(9),
                                }}
                            >
                                {/* 교체 */}
                                {jsonSvc.findLocalById("110057")}
                            </PretendText>
                            <Image
                                source={liveImg.arrow.right}
                                style={{
                                    width: RatioUtil.width(5),
                                    height: RatioUtil.width(9),
                                }}
                                resizeMode="contain"
                            ></Image>
                        </CustomButton>
                    </View>
                    <View
                        // style={{ alignSelf: "center" }}
                        style={{ alignItems: "center" }}
                    >
                        <Image
                            source={liveImg.polygon}
                            style={{ position: "absolute", top: RatioUtil.lengthFixedRatio(29) }}
                        ></Image>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            style={{
                                ...RatioUtil.sizeFixedRatio(52, 32),
                                borderRadius: RatioUtil.width(25),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            colors={["#5566FF", "#A3A3FF"]}
                        >
                            <PretendText style={{ color: Colors.WHITE, fontSize: RatioUtil.font(12) }}>
                                {NumberUtil.unitTransferFloat(heartAmount?.score ?? 0)}
                            </PretendText>
                        </LinearGradient>
                    </View>
                </View>
            )}

            <View
                style={[
                    {
                        ...RatioUtil.sizeFixedRatio(48, 48),
                        marginLeft: RatioUtil.width(10),
                        borderWidth: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: RatioUtil.width(24),
                        borderColor: Colors.GRAY,
                        marginRight: isVisible ? 0 : RatioUtil.width(-58),
                        opacity: isVisible ? 1 : 0
                    },
                    {
                        // overflow: 'hidden',
                        // backgroundColor: 'orange',
                    },
                ]}
            >
                {/* {!selectPlayer ? (
                    <TouchableOpacity
                        activeOpacity={.8}
                        onPress={onSend}
                        style={{
                            backgroundColor: Colors.WHITE,
                            borderRadius: 100,
                            position: "absolute",
                            ...RatioUtil.size(35, 35),
                            alignSelf: "center",
                            bottom: "12%",
                        }}
                    >
                        <Image
                            source={liveImg.heart}
                            style={{
                                position: "absolute",
                                alignSelf: "center",
                                borderRadius: 100,
                                ...RatioUtil.size(25, 25),
                                bottom: "13%",
                            }}
                        />
                    </TouchableOpacity>
                ) : ( */}
                <ProgressBar
                    // isEnd={isEnd}
                    onChangeFirst={isFirst => {
                        setIsFirst(isFirst), !isFirst && setSelectPlayer(undefined)
                    }}
                    onChangeStatus={handleChangeStatus}
                    isFirst={isFirst}
                    onUnlocked={handleUnlocked}
                    onPress={onSend}
                    onAnimationStart={handleDummy}
                />
                {/* )} */}
            </View>
        </>
    )
}

export interface DonateContentsProps {
    userCoin: number
    player?: IPlayer
    onDonate: (donateCoin: number, cheerText: string) => void
    onDonation: (msg: string, cash: number, code: number) => void
    profile: IMyProfile | null
    gameData: ISeasonDetail | undefined
}

export const DonateContents = (props: DonateContentsProps) => {
    const popupDispatch = useWrapDispatch(setPopUp)
    const [defaultCash] = jsonSvc.mapShopDonateCash()
    const [activeBorder, setActiveBorder] = useState(1)
    const [donateCoin, setDonateCoin] = useState(defaultCash)
    const [gradientColor, setGradientColor] = useState<string[]>([Colors.GREEN2, Colors.GREEN])
    const [thumbColor, setThumbColor] = useState(Colors.GREEN)
    const [keyboardHeight, setKeyboardHeight] = useState(0)
    const [isEnable, setIsEnable] = useState(false)
    const [termVisible, setTermVisible] = useState(false)
    const [sliderValue, setSliderValue] = useState(props.userCoin * 0.45)
    const webViewRef = useRef<WebView | null>(null)
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_supportSelect_popup_60, {
            hasNewUserData: true,
        })
    }, [])
    useEffect(() => {
        function onKeyboardDidShow(e: KeyboardEvent) {
            setKeyboardHeight(e.endCoordinates.height)
        }

        function onKeyboardDidHide() {
            setKeyboardHeight(0)
        }

        handleChangeCoin(sliderValue)

        const showSubscription = Keyboard.addListener("keyboardDidShow", onKeyboardDidShow)
        const hideSubscription = Keyboard.addListener("keyboardDidHide", onKeyboardDidHide)
        return () => {
            showSubscription.remove()
            hideSubscription.remove()
        }
    }, [])

    useEffect(() => {
        const { colors, thumbColor } = chatSvc.getCashColor(donateCoin)
        setGradientColor(colors)
        setThumbColor(thumbColor)
    }, [donateCoin])
    // const [cheerInput, setCheerInput] = useState<string>("")
    const cheerInput = useInputs({
        validCheck: DonateValid.cheering,
        value: "",
        maxLength: 35,
    })

    const onClose = () => {
        popupDispatch({
            open: true,
            children: <DonateSelectPlayer profile={props.profile} onDonation={props.onDonation} />,
        })
    }

    const handleChangeCoin = (coin: number) => {
        const data = jsonSvc.mapShopDonateCash()

        const maxDonateAmount = Math.max(...data)
        for (let i = 0; i < data.length; i++) {
            if (coin <= maxDonateAmount * ((i + 1) / 6)) {
                setDonateCoin(data[i])
                return
            }
        }
        setDonateCoin(maxDonateAmount)
    }

    const handleDonate = async () => {
        popupDispatch({ open: false })
        props.onDonate(donateCoin, cheerInput.value)
    }
    const onEnable = () => {
        setIsEnable(!isEnable)
    }
    const Term: any = jsonSvc.findConstBynId("MARKET_NFT_REFUND_TERM_LINK")

    const insets = useSafeAreaInsets()

    return (
        <View
            style={{
                ...cheerStyle.donatePopup.con,
                bottom: keyboardHeight * 0.5,
            }}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
                <View
                    style={{
                        width: RatioUtil.width(320),
                        marginHorizontal: RatioUtil.width(20),
                    }}
                >
                    <View
                        style={{
                            height: RatioUtil.lengthFixedRatio(60),
                            width: RatioUtil.width(320),
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <PretendText style={cheerStyle.donatePopup.headerTitle}>
                            {/* 후원 보내기 */}
                            {jsonSvc.findLocalById("110100")}
                        </PretendText>
                        <CustomButton
                            onPress={async () => {
                                await Analytics.logEvent(
                                    AnalyticsEventName.click_close_60,

                                    {
                                        hasNewUserData: true,
                                        first_action: "FALSE",
                                    }
                                )
                                onClose()
                            }}
                            style={{
                                marginLeft: RatioUtil.width(20),
                                position: "absolute",
                                right: 0,
                            }}
                        >
                            <Image
                                resizeMode="contain"
                                source={nftDetailImg.close}
                                style={{ width: RatioUtil.width(30), height: RatioUtil.width(30) }}
                            />
                        </CustomButton>
                    </View>
                    <View
                        style={{
                            marginBottom: RatioUtil.lengthFixedRatio(15),
                        }}
                    >
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            colors={gradientColor}
                            style={cheerStyle.donatePopup.infoCon}
                        >
                            <View style={cheerStyle.donatePopup.infoLeftCon}>
                                {/* <Image
                                    source={ConfigUtil.getProfile(data?.profile.ICON_NAME, data?.profile.ICON_TYPE)}
                                    resizeMode="contain"
                                    style={{ ...RatioUtil.size(30, 30), borderRadius: 15 }}
                                /> */}
                                <ProfileImage
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(24, 24),
                                        borderRadius: 15,
                                    }}
                                    name={props.profile?.ICON_NAME}
                                    type={props.profile?.ICON_TYPE}
                                    resizeMode="contain"
                                />
                                <PretendText
                                    style={[cheerStyle.donatePopup.infoText, { marginLeft: RatioUtil.width(10) }]}
                                >
                                    {props.profile?.NICK ?? ""}
                                </PretendText>
                            </View>
                            <View style={{ ...cheerStyle.donatePopup.wCon }}>
                                <View
                                    style={{
                                        backgroundColor: "transparent",
                                        marginLeft: RatioUtil.lengthFixedRatio(-2),
                                        borderColor: Colors.WHITE,
                                        borderWidth: 2,
                                        width: RatioUtil.lengthFixedRatio(23),
                                        height: RatioUtil.lengthFixedRatio(23),
                                        borderRadius: RatioUtil.lengthFixedRatio(30),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            fontSize: RatioUtil.font(14),
                                            color: Colors.WHITE,
                                        }}
                                    >
                                        ￦
                                    </PretendText>
                                </View>
                                <View style={{ ...cheerStyle.donatePopup.coinCon }}>
                                    <PretendText
                                        style={{
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            fontSize: RatioUtil.font(13),
                                            color: Colors.WHITE,
                                            textAlign: "center",
                                        }}
                                    >
                                        {NumberUtil.denoteComma(donateCoin)}
                                    </PretendText>
                                </View>
                            </View>
                        </LinearGradient>
                        <View>
                            <TextInput
                                // value={cheerInput}
                                // onChangeText={(text: any) => {
                                //     setCheerInput(text)
                                // }}
                                value={cheerInput.value}
                                onChange={cheerInput.onValidChange}
                                onFocus={async () => {
                                    await Analytics.logEvent(
                                        AnalyticsEventName.click_messageInput_60,

                                        {
                                            hasNewUserData: true,
                                            first_action: "FALSE",
                                        }
                                    )

                                    setActiveBorder(2)
                                }}
                                onBlur={() => setActiveBorder(1)}
                                style={{
                                    ...cheerStyle.donatePopup.input,
                                    borderWidth: activeBorder,
                                    // borderColor: Colors.GRAY7,
                                    borderColor: cheerInput.isValid ? Colors.GRAY7 : Colors.RED2,
                                    height: RatioUtil.lengthFixedRatio(94),
                                    textAlignVertical: "top",
                                    fontSize: RatioUtil.font(14),
                                    color: Colors.BLACK,
                                }}
                                maxLength={35}
                                multiline={false}
                                // placeholder="구매 금액 및 메시지가 공개적으로 표시됩니다."
                                placeholder={jsonSvc.findLocalById("110106")}
                                placeholderTextColor={Colors.GRAY3}
                            />
                            <PretendText
                                style={{
                                    ...cheerStyle.donatePopup.inputLength,
                                    bottom: cheerInput.isValid ? RatioUtil.height(5) : RatioUtil.height(30),
                                }}
                            >
                                {/* {cheerInput.value.length}/35 */}
                                {jsonSvc.formatLocal(jsonSvc.findLocalById("7078"), [
                                    cheerInput.value.length.toString(),
                                    "35",
                                ])}
                            </PretendText>
                            {cheerInput.isValid || (
                                <View style={cheerStyle.donatePopup.errCon}>
                                    <Image source={myPageImg.error} />
                                    <PretendText style={mineStyle.edit.errMsg}>{cheerInput.errorMsg}</PretendText>
                                </View>
                            )}
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            width: RatioUtil.width(320),
                            height: RatioUtil.heightFixedRatio(20),
                            justifyContent: "space-between"
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                        >
                            <View
                                style={{
                                    borderRadius: RatioUtil.width(100),
                                    padding: RatioUtil.width(2),
                                    ...RatioUtil.sizeFixedRatio(15, 15),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: Colors.BLACK
                                }}
                            >
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(10),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: Colors.WHITE
                                    }}
                                >
                                    ￦
                                </PretendText>
                            </View>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                    marginLeft: RatioUtil.width(4)
                                }}
                            >
                                2,200
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center"
                            }}
                        >
                            <View
                                style={{
                                    borderRadius: RatioUtil.width(100),
                                    padding: RatioUtil.width(2),
                                    ...RatioUtil.sizeFixedRatio(15, 15),
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: Colors.BLACK
                                }}
                            >
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(10),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: Colors.WHITE
                                    }}
                                >
                                    ￦
                                </PretendText>
                            </View>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                    marginLeft: RatioUtil.width(4)
                                }}
                            >
                                110,000
                            </PretendText>
                        </View>
                    </View>
                    <Slider
                        onSlidingComplete={async () => {
                            await Analytics.logEvent(
                                AnalyticsEventName.click_supportValue_60,

                                {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                }
                            )
                        }}
                        animateTransitions
                        maximumValue={props.userCoin}
                        minimumValue={defaultCash}
                        minimumTrackTintColor={thumbColor}
                        thumbStyle={{
                            backgroundColor: thumbColor,
                            ...cheerStyle.donatePopup.thumb,
                        }}
                        onValueChange={coin => {
                            handleChangeCoin(isArray(coin) ? coin[0] : coin)
                            setSliderValue(isArray(coin) ? coin[0] : coin)
                        }}
                        trackStyle={cheerStyle.donatePopup.track}
                        value={sliderValue}
                    />
                    <View style={styles.policyMainBox}>
                        <TouchableOpacity activeOpacity={1} onPress={() => onEnable()} style={styles.checkbox}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    style={[styles.policyImage]}
                                    source={!isEnable ? NFTCardImages.checkbox : NFTCardImages.selectedCheckbox}
                                />

                                <PretendText style={[styles.policy, { marginLeft: RatioUtil.width(3) }]}>
                                    <PretendText style={[styles.policy, { fontWeight: RatioUtil.fontWeightBold() }]}>
                                        {/* [필수] */}
                                        {jsonSvc.findLocalById("13115")}{" "}
                                    </PretendText>
                                    {jsonSvc.findLocalById("13116")}
                                </PretendText>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.policyBox]}>
                            <TouchableOpacity
                                onPress={() => {
                                    setTermVisible(true)
                                }}
                            >
                                <PretendText
                                    style={[styles.policy, { color: Colors.GRAY3, textDecorationLine: "underline" }]}
                                >
                                    {/* 보기 */}
                                    {jsonSvc.findLocalById("13113")}
                                </PretendText>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={[
                            cheerStyle.donatePopup.groupButtonCon,
                            {
                                marginBottom:
                                    insets.bottom > RatioUtil.lengthFixedRatio(20)
                                        ? insets.bottom
                                        : RatioUtil.lengthFixedRatio(20),
                            },
                        ]}
                    >
                        {keyboardHeight == 0 && (
                            <>
                                <CustomButton
                                    onPress={async () => {
                                        await Analytics.logEvent(
                                            AnalyticsEventName.click_cash_support_previous_60,

                                            {
                                                hasNewUserData: true,
                                                first_action: "FALSE",
                                                game_id: props.gameData?.GAME_CODE,
                                            }
                                        )
                                        onClose()
                                    }}
                                >
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: 30,
                                            ...RatioUtil.sizeFixedRatio(108, 60),
                                            backgroundColor: Colors.GRAY7,
                                        }}
                                    >
                                        <PretendText
                                            style={{
                                                ...cheerStyle.donatePopup.buttonTitle,
                                                fontWeight: RatioUtil.fontWeightBold(),
                                                color: Colors.BLACK,
                                                fontSize: RatioUtil.font(16),
                                            }}
                                        >
                                            {/* 이전단계 */}
                                            {jsonSvc.findLocalById("110101")}
                                        </PretendText>
                                    </View>
                                </CustomButton>
                                <CustomButton onPress={handleDonate} disabled={!isEnable || !cheerInput.isValid}>
                                    <View
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderRadius: 30,
                                            ...RatioUtil.sizeFixedRatio(202, 60),
                                            // backgroundColor: donateCoin == 0 ? Colors.GRAY : Colors.BLACK,
                                            backgroundColor:
                                                isEnable && cheerInput.isValid ? Colors.BLACK : Colors.GRAY7,
                                            // backgroundColor: isEnable ? Colors.BLACK : Colors.GRAY7,
                                        }}
                                    >
                                        <PretendText
                                            style={{
                                                ...cheerStyle.donatePopup.buttonTitle,
                                                fontWeight: RatioUtil.fontWeightBold(),
                                                color: isEnable && cheerInput.isValid ? Colors.WHITE : Colors.BLACK,
                                                // color: isEnable ? Colors.WHITE : Colors.BLACK,
                                                fontSize: RatioUtil.font(16),
                                            }}
                                        >
                                            {/* 구매 후 보내기 */}
                                            {jsonSvc.findLocalById("110104")}
                                        </PretendText>
                                    </View>
                                </CustomButton>
                            </>
                        )}
                    </View>
                    {keyboardHeight > 0 && (
                        <></>
                        // <CustomButton
                        //     onPress={() => {
                        //         setKeyboardHeight(0)
                        //         Keyboard.dismiss()
                        //     }}
                        //     disabled={donateCoin == 0}
                        // >
                        //     <View
                        //         style={{
                        //             ...cheerStyle.donatePopup.buttonKeyboard,
                        //             backgroundColor: cheerInput.length > 0 ? Colors.BLACK : Colors.GRAY,
                        //         }}
                        //     >
                        //         <PretendText
                        //             style={{
                        //                 ...cheerStyle.donatePopup.buttonTitle,
                        //                 color: cheerInput.length > 0 ? Colors.WHITE : Colors.BLACK,
                        //             }}
                        //         >
                        //             {/* 완료 */}
                        //             {jsonSvc.findLocalById("5000")}
                        //         </PretendText>
                        //     </View>
                        // </CustomButton>
                    )}
                </View>
            </TouchableWithoutFeedback>
            <Modal
                visible={termVisible}
                statusBarTranslucent
                transparent
                style={{
                    flex: 1,
                }}
                onRequestClose={() => setTermVisible(false)}
            >
                <SafeAreaView
                    style={{
                        flex: 1,
                        marginTop: insets.top,
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            height: RatioUtil.lengthFixedRatio(60),
                            justifyContent: "center",
                            alignItems: "flex-end",
                            backgroundColor: Colors.WHITE,
                            borderTopLeftRadius: RatioUtil.lengthFixedRatio(16),
                            borderTopRightRadius: RatioUtil.lengthFixedRatio(16),
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                setTermVisible(false)
                            }}
                            style={{
                                marginRight: RatioUtil.width(20),
                            }}
                        >
                            <Image
                                resizeMode="contain"
                                source={nftDetailImg.close}
                                style={{ width: RatioUtil.width(30), height: RatioUtil.width(30) }}
                            />
                        </TouchableOpacity>
                    </View>
                    <WebView
                        source={{
                            uri: `${Term?.sStrValue || ""}`,
                        }}
                        ref={webViewRef}
                        javaScriptEnabled={true}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    )
}

export const EndCheer = () => {
    return (
        <View>
            <PretendText>
                {/* {"경기가 종료되어 응원이 마감되었습니다.\n다음 시즌에서 만나요!"} */}
                {jsonSvc.findLocalById("140015")}
            </PretendText>
        </View>
    )
}

export interface SetSelectPlayerProps {
    setSelectPlayer: React.Dispatch<React.SetStateAction<IPlayer | undefined>>
    selectPlayer: IPlayer | undefined
    gameData?: ISeasonDetail
}

export const BdstConfirm = ({ setSelectPlayer, selectPlayer, gameData }: SetSelectPlayerProps) => {
    const [isCheck, toggle] = useToggle()

    const modalDispatch = useWrapDispatch(setModal)
    const popUpDispatch = useWrapDispatch(setPopUp)

    useAsyncEffect(async () => {
        if (!gameData) return

        await Analytics.logEvent(AnalyticsEventName.view_heart_popup_65, {
            hasNewUserData: true,
            game_id: gameData.GAME_CODE,
        })
    }, [gameData])

    const [confirmed, setConfirmed] = useState<boolean>(false)

    useEffect(() => {
        if (confirmed == false) return

        const interactionPromise = InteractionManager.runAfterInteractions(() => {
            popUpDispatch({
                open: true,
                children: <BdstSelectPlayer selectPlayer={selectPlayer} setSelectPlayer={setSelectPlayer} />,
            })
        })

        return () => interactionPromise.cancel()
    }, [confirmed])

    const onConfirm = async () => {
        //setting menu

        await Analytics.logEvent(
            AnalyticsEventName.click_heart_popup_progress_65,

            {
                hasNewUserData: false,
                first_action: "FALSE",
                game_id: gameData?.GAME_CODE,
                check_disable: isCheck ? "TRUE" : "FALSE",
            }
        )

        if (isCheck) {
            const storageSetting = await ConfigUtil.getStorage<SettingMenu>(SETTING_ID)

            const menu = storageSetting ? storageSetting : settingMenu

            const editedMenu = menu.map(v =>
                v.title === SettingTitle.LIVE_HEART ? { title: v.title, isCheck: false } : { ...v }
            )

            const data = await profileSvc.setAlarm(editedMenu)

            if (data) {
                await ConfigUtil.setStorage({
                    [SETTING_ID]: JSON.stringify(data),
                })
            }
        }

        setConfirmed(true)

        modalDispatch({ open: false })

        /*
        setTimeout(
            () => {
                popUpDispatch({
                    open: true,
                    children: <BdstSelectPlayer selectPlayer={selectPlayer} setSelectPlayer={setSelectPlayer} />,
                })
            },
            500
        )
        */
        /*
        popUpDispatch({
            open: true,
            children: <BdstSelectPlayer selectPlayer={selectPlayer} setSelectPlayer={setSelectPlayer} />,
        })
        */
    }

    return (
        <View
            style={{
                width: RatioUtil.width(272),
                ...RatioUtil.paddingFixedRatio(30, 22, 20, 22),
                backgroundColor: Colors.WHITE,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                ...RatioUtil.borderRadius(20),
            }}
        >
            <PretendText
                style={{
                    fontSize: RatioUtil.font(16),
                    color: Colors.BLACK,
                    lineHeight: RatioUtil.font(16) * 1.4,
                    textAlign: "center",
                }}
            >
                {/* {"하트는 1번 터치할 때마다 1BDST가\n차감됩니다. 진행하시겠습니까?"} */}
                {jsonSvc.findLocalById("110069")} {jsonSvc.formatLocal(jsonSvc.findLocalById("110070"), ["1"])}
                {jsonSvc.findLocalById("110071")} {jsonSvc.findLocalById("110072")}
            </PretendText>
            <CheckBox
                onCheck={toggle}
                ischeck={isCheck}
                unCheckedView={<Image source={liveImg.uncheck} style={RatioUtil.size(20, 20)} />}
                checkedView={<Image source={termImg.check} style={RatioUtil.size(20, 20)} />}
                style={{
                    ...RatioUtil.marginFixedRatio(10, 20, 20, 20),
                }}
            >
                <PretendText
                    style={{
                        marginLeft: RatioUtil.width(8),
                        fontSize: RatioUtil.font(14),
                        color: Colors.BLACK,
                    }}
                >
                    {/* 다시 물어보지 않기 */}
                    {jsonSvc.findLocalById("110060")}
                </PretendText>
            </CheckBox>

            <View
                style={{
                    width: RatioUtil.width(232),
                    backgroundColor: Colors.GRAY9,
                    ...RatioUtil.paddingFixedRatio(10, 20, 10, 20),
                    borderWidth: 1,
                    ...RatioUtil.borderRadius(6),
                    borderColor: Colors.GRAY7,
                }}
            >
                <PretendText
                    style={{
                        color: "#101010",
                        fontSize: RatioUtil.font(12),
                    }}
                >
                    유의사항
                </PretendText>
                <PretendText style={liveCompoStyle.confirm.warningText}>
                    {/* · 차감 된 BDST는 환불이 불가합니다. */}· {jsonSvc.findLocalById("110062")}
                </PretendText>
                <PretendText style={liveCompoStyle.confirm.warningText}>
                    {/* {"· 하트 보내기 안내 팝업 기능은 마이>\n설정> 알림 및 기타 설정에서 변경 가능\n합니다."} */}·{" "}
                    {jsonSvc.findLocalById("110063")}
                </PretendText>
                <PretendText style={liveCompoStyle.confirm.warningText}>
                    {/* {"· 하트 보내기 버튼은 활성화 후 3초 동안\n길게 누르면 다시 잠금할 수 있습니다."} */}·{" "}
                    {jsonSvc.findLocalById("110064")}
                </PretendText>
            </View>

            <View style={{ flexDirection: "row", marginTop: RatioUtil.lengthFixedRatio(20) }}>
                <CustomButton
                    style={{
                        ...RatioUtil.sizeFixedRatio(113, 48),
                        ...RatioUtil.borderRadius(24),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.GRAY7,
                    }}
                    onPress={async () => {
                        await Analytics.logEvent(
                            AnalyticsEventName.click_heart_popup_cancel_65,

                            {
                                hasNewUserData: true,
                                first_action: "FALSE",
                                game_id: gameData?.GAME_CODE,
                            }
                        )
                        modalDispatch({ open: false })
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.BLACK2,
                        }}
                    >
                        {/* 취소 */}
                        {jsonSvc.findLocalById("10010001")}
                    </PretendText>
                </CustomButton>
                <CustomButton
                    style={{
                        ...RatioUtil.sizeFixedRatio(113, 48),
                        ...RatioUtil.borderRadius(24),
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.BLACK,
                        marginLeft: RatioUtil.width(6),
                    }}
                    onPress={onConfirm}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.WHITE,
                        }}
                    >
                        {/* 진행하기 */}
                        {jsonSvc.findLocalById("110066")}
                    </PretendText>
                </CustomButton>
            </View>
        </View>
    )
}

export interface SearchPlayerProps {
    styleCustom?: ViewStyle
    value?: string
    onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
    onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
    onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void
}

export const SearchPlayer = ({ styleCustom, onFocus, onBlur, onChange, value }: SearchPlayerProps) => {
    return (
        <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={Platform.OS === "ios" ? RatioUtil.height(272) : -20}
            // style={{...RatioUtil.padding(10, 20, 10, 20)}}
            style={{ ...RatioUtil.padding(10, 0, 10, 0), ...styleCustom }}
            // scrollEnabled={false}
            contentContainerStyle={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: RatioUtil.width(320),
            }}
            // style={style}
        >
            <Image
                source={liveImg.search}
                style={{
                    position: "absolute",
                    left: RatioUtil.width(15),
                }}
            />
            <TextInput
                style={{
                    borderRadius: RatioUtil.width(10),
                    borderColor: Colors.GRAY,
                    ...RatioUtil.sizeFixedRatio(320, 48),
                    // ...RatioUtil.padding(14, 14, 45, 14),
                    fontSize: RatioUtil.font(14),
                    paddingLeft: RatioUtil.width(45),
                    borderWidth: 1,
                    color: Colors.BLACK,
                }}
                onFocus={onFocus}
                onBlur={onBlur}
                value={value ?? ""}
                onChange={onChange}
                // placeholder="선수 이름을 검색하세요"
                placeholder={jsonSvc.findLocalById("7018")}
                placeholderTextColor={Colors.GRAY12}
            />
        </KeyboardAvoidingView>
    )
}

export const RankContents = ({ id }: { id: number }) => {
    const [data] = useQuery(() => rankSvc.playerRankList({ gamecode: id, max: 100, min: 1 }), {
        loading: false,
    })
    const top3 = data?.rankList?.slice(0, 3)
    const searchInput = useInputs({
        validCheck: () => {},
        value: "",
    })
    const isVisible = useKeyboardVisible()
    const [isSwipeUp, setisSwipeUp] = useState(false)

    const popupDispatch = useWrapDispatch(setPopUp)
    const [style, setstyle] = useState<ViewStyle>({ display: "flex", marginBottom: RatioUtil.height(20) })

    useEffect(() => {
        if (isVisible) {
            if (isSwipeUp) {
                animation.value = {
                    height: Platform.OS == "ios" ? RatioUtil.height(610) : RatioUtil.height(410),
                    marginTop: RatioUtil.height(31),
                    top: RatioUtil.height(341),
                }
            } else {
                animation.value = {
                    height: Platform.OS == "ios" ? RatioUtil.height(610) : RatioUtil.height(410),
                    marginTop: RatioUtil.height(280),
                    top: RatioUtil.height(350),
                }
            }
        } else {
            if (isSwipeUp) {
                animation.value = {
                    height: RatioUtil.height(631),
                    marginTop: RatioUtil.height(61),
                    top: RatioUtil.height(561),
                }
            } else {
                animation.value = {
                    height: RatioUtil.height(410),
                    marginTop: RatioUtil.height(280),
                    top: RatioUtil.height(330),
                }
            }
        }
    }, [isVisible, isSwipeUp])

    const animation = useSharedValue({
        height: RatioUtil.height(410),
        marginTop: RatioUtil.height(280),
        top: RatioUtil.height(330),
    })
    const ifCloseToTop = ({ contentOffset }: any) => {
        return contentOffset.y == 0
    }
    const animatedStyle = useAnimatedStyle(
        () => ({
            height: withTiming(animation.value.height, {
                duration: isVisible ? 0 : isSwipeUp ? 500 : 300,
            }),
            marginTop: withTiming(animation.value.marginTop, {
                duration: isVisible ? 0 : isSwipeUp ? 500 : 300,
            }),
        }),
        [isSwipeUp, isVisible]
    )

    return (
        <Animated.View
            style={[
                {
                    backgroundColor: Colors.WHITE,
                    ...RatioUtil.borderRadius(20),
                },
                animatedStyle,
            ]}
        >
            <GestureRecognizer
                onSwipeDown={() => popupDispatch({ open: false })}
                onSwipeUp={() => setisSwipeUp(true)}
                style={{
                    ...RatioUtil.size(320, 60),
                    ...liveGeneral.popup.center,
                    alignSelf: "center",
                }}
            >
                <CustomButton
                    style={{
                        ...RatioUtil.size(320, 60),
                        ...liveGeneral.popup.center,
                        alignSelf: "center",
                    }}
                >
                    <PretendText style={liveGeneral.popup.title}>선수 랭킹</PretendText>
                </CustomButton>
            </GestureRecognizer>
            <SearchPlayer styleCustom={style} onChange={searchInput.onChange} value={searchInput.value} />
            <ScrollView
                onMomentumScrollBegin={({ nativeEvent }) => {
                    if (ifCloseToTop(nativeEvent)) {
                        setisSwipeUp(false)
                    } else {
                        setisSwipeUp(true)
                    }
                }}
            >
                {top3?.length === 3 ? (
                    <View style={liveGeneral.popup.viewRow}>
                        <View style={{ width: "30%" }}>
                            <View style={liveGeneral.popup.container}>
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        ...RatioUtil.size(110, 13),
                                    }}
                                    colors={[Colors.GRAY9, Colors.GRAY11]}
                                />

                                <View style={liveGeneral.popup.txtUserName}>
                                    <PretendText
                                        numberOfLines={1}
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(18) }}
                                    >
                                        {top3[1].info?.sPlayerName}s
                                    </PretendText>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Image
                                            source={liveImg.rankFullHeart}
                                            style={{
                                                ...RatioUtil.size(15, 15),
                                            }}
                                        />
                                        <PretendText
                                            numberOfLines={1}
                                            style={{ fontWeight: RatioUtil.fontWeightBold() }}
                                        >
                                            {" "}
                                            {NumberUtil.addUnit(top3[1].score ?? 0)}
                                        </PretendText>
                                    </View>
                                </View>
                            </View>
                            <Image source={rankImg[2]} style={liveGeneral.popup.icon} />
                        </View>
                        <View style={{ width: "30%" }}>
                            <View
                                style={{
                                    ...liveGeneral.popup.container,
                                    height: RatioUtil.width(150),
                                }}
                            >
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        ...RatioUtil.size(110, 13),
                                    }}
                                    colors={[Colors.YELLOW8, Colors.YELLOW7]}
                                />
                                <View style={liveGeneral.popup.txtUserName}>
                                    <PretendText
                                        numberOfLines={1}
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(18) }}
                                    >
                                        {top3[0].info?.sPlayerName}
                                    </PretendText>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Image
                                            source={liveImg.rankFullHeart}
                                            style={{
                                                ...RatioUtil.size(15, 15),
                                            }}
                                        />
                                        <PretendText
                                            numberOfLines={1}
                                            style={{ fontWeight: RatioUtil.fontWeightBold() }}
                                        >
                                            {" "}
                                            {NumberUtil.addUnit(top3[0].score ?? 0)}
                                        </PretendText>
                                    </View>
                                </View>
                            </View>
                            <Image
                                source={rankImg[1]}
                                style={{
                                    ...liveGeneral.popup.icon,
                                    top: -RatioUtil.width(15),
                                    left: RatioUtil.width(31),
                                }}
                            />
                        </View>
                        <View style={{ width: "30%" }}>
                            <View style={liveGeneral.popup.container}>
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        ...RatioUtil.size(110, 13),
                                    }}
                                    colors={[Colors.YELLOW9, Colors.YELLOW10]}
                                />

                                <View style={liveGeneral.popup.txtUserName}>
                                    <PretendText
                                        numberOfLines={1}
                                        style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(18) }}
                                    >
                                        {top3[2].info?.sPlayerName}
                                    </PretendText>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Image
                                            source={liveImg.rankFullHeart}
                                            style={{
                                                ...RatioUtil.size(15, 15),
                                            }}
                                        />
                                        <PretendText
                                            numberOfLines={1}
                                            style={{ fontWeight: RatioUtil.fontWeightBold() }}
                                        >
                                            {NumberUtil.addUnit(top3[2].score ?? 0)}
                                        </PretendText>
                                    </View>
                                </View>
                            </View>
                            <Image source={rankImg[3]} style={liveGeneral.popup.icon} />
                        </View>
                    </View>
                ) : null}
                {data?.rankList
                    .filter(v => v.info?.sPlayerName.includes(searchInput.value))
                    .map((v, i) => (
                        <View style={liveGeneral.popup.rankListItem} key={i}>
                            <View style={{ flexDirection: "row", ...liveGeneral.popup.center }}>
                                <PretendText
                                    style={{
                                        color: Colors.GRAY3,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        marginRight: RatioUtil.width(20),
                                    }}
                                >{`${v.rank}위`}</PretendText>
                                <View style={{ flexDirection: "row", ...liveGeneral.popup.center }}>
                                    <Image
                                        source={{ uri: v.info?.sPlayerImagePath }}
                                        style={{
                                            ...RatioUtil.size(30, 30),
                                            marginRight: RatioUtil.width(10),
                                            borderRadius: 50,
                                        }}
                                    />
                                    <PretendText
                                        style={{
                                            color: Colors.BLACK,
                                            fontSize: RatioUtil.font(14),
                                        }}
                                    >
                                        {v.info?.sPlayerName}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={{ flexDirection: "row", ...liveGeneral.popup.center }}>
                                <Image source={liveImg.rankHeart} style={{ marginRight: RatioUtil.width(2) }} />
                                <PretendText>{NumberUtil.unitTransferFloat(v.score)}</PretendText>
                            </View>
                        </View>
                    ))}
            </ScrollView>
        </Animated.View>
    )
}

export const BdstSelectPlayer = ({ setSelectPlayer, selectPlayer }: SetSelectPlayerProps) => {
    const popupDispatch = useWrapDispatch(setPopUp)
    const [select, setselect] = useState<IPlayer | null>()
    const isVisible = useKeyboardVisible()
    const [isSwipeUp, setisSwipeUp] = useState(false)
    const [visibleChecked, setVisibleChecked] = useState(false)

    const searchInput = useInputs({
        validCheck: () => {},
        value: "",
    })
    useEffect(() => {
        if (isVisible) {
            setButtonProps(state =>
                produce(state, draft => {
                    draft.confirm = {
                        ...state.confirm,
                        width: RatioUtil.width(370),
                        ...RatioUtil.borderRadius(0),
                    }
                    draft.cancel.display = "none"
                })
            )

            if (isSwipeUp) {
                animation.value = {
                    height: Platform.OS == "ios" ? RatioUtil.height(610) : RatioUtil.height(610),
                    marginTop: RatioUtil.height(31),
                    top: RatioUtil.height(341),
                }
            } else {
                animation.value = {
                    height: Platform.OS == "ios" ? RatioUtil.height(610) : RatioUtil.height(610),
                    marginTop: RatioUtil.height(280),
                    top: RatioUtil.height(350),
                }
            }
        } else {
            setButtonProps(state =>
                produce(state, draft => {
                    draft.confirm = {
                        ...state.confirm,
                        width: RatioUtil.width(202),
                        ...RatioUtil.borderRadius(30),
                    }
                    draft.cancel.display = "flex"
                })
            )
            if (isSwipeUp) {
                animation.value = {
                    height: RatioUtil.height(631),
                    marginTop: RatioUtil.height(61),
                    top: RatioUtil.height(561),
                }
            } else {
                animation.value = {
                    height: RatioUtil.height(410),
                    marginTop: RatioUtil.height(280),
                    top: RatioUtil.height(330),
                }
            }
        }
    }, [isVisible, isSwipeUp])
    const animation = useSharedValue({
        height: RatioUtil.height(410),
        marginTop: RatioUtil.height(280),
        top: RatioUtil.height(330),
    })
    const ifCloseToTop = ({ contentOffset }: any) => {
        return contentOffset.y == 0
    }
    const animatedStyle = useAnimatedStyle(
        () => ({
            height: withTiming(animation.value.height, {
                duration: isVisible ? 0 : isSwipeUp ? 500 : 300,
            }),
            marginTop: withTiming(animation.value.marginTop, {
                duration: isVisible ? 0 : isSwipeUp ? 500 : 300,
            }),
        }),
        [isSwipeUp, isVisible]
    )
    const aniBtnStyle = useAnimatedStyle(() => ({
        top: Platform.OS == "ios" && isVisible ? "47%" : animation.value.top,
    }))

    const [buttonProps, setButtonProps] = useState({
        confirm: {
            ...RatioUtil.borderRadius(30),
            backgroundColor: Colors.BLACK,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: RatioUtil.width(10),
        } as ViewStyle,
        cancel: {
            ...RatioUtil.sizeFixedRatio(108, 60),
            ...RatioUtil.borderRadius(30),
            backgroundColor: Colors.GRAY7,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
        } as ViewStyle,
    })

    const onSelect = (v: IPlayer | null) => {
        if (v?.nID === select?.nID) {
            setselect(null)
            setVisibleChecked(false)
        } else {
            setselect(v)
            setVisibleChecked(true)
        }
    }
    const onClose = () => {
        popupDispatch({ open: false })
    }
    const onConfirm = () => {
        popupDispatch({ open: false })
        if (select) setSelectPlayer(select)
    }

    const insets = useSafeAreaInsets()

    return (
        <Animated.View
            style={[
                {
                    backgroundColor: Colors.WHITE,
                    ...RatioUtil.borderRadius(10, 10),
                    marginTop: RatioUtil.height(261),
                    position: "absolute",
                    bottom: 0,
                    width: RatioUtil.width(360),
                },
                animatedStyle,
            ]}
        >
            <GestureRecognizer
                onSwipeDown={onClose}
                onSwipeUp={() => setisSwipeUp(true)}
                style={{
                    ...RatioUtil.sizeFixedRatio(320, 60),
                    ...liveGeneral.popup.center,
                    alignSelf: "center",
                }}
            >
                <View
                    style={{
                        ...RatioUtil.sizeFixedRatio(320, 60),
                        ...liveGeneral.popup.center,
                        alignSelf: "center",
                    }}
                >
                    <PretendText style={liveGeneral.popup.title}>
                        {/* 프로 선택 */}
                        {jsonSvc.findLocalById("2035")}
                    </PretendText>
                    <CustomButton
                        onPress={onClose}
                        style={{
                            position: "absolute",
                            right: 0,
                        }}
                    >
                        <Image
                            source={nftDetailImg.close}
                            style={{ width: RatioUtil.width(30), height: RatioUtil.width(30) }}
                        />
                    </CustomButton>
                </View>
            </GestureRecognizer>
            <View>
                <PretendText
                    style={{
                        marginHorizontal: RatioUtil.lengthFixedRatio(20),
                        textAlign: "center",
                        color: Colors.GRAY8,
                        fontSize: RatioUtil.font(13),
                    }}
                >
                    {/* {
                        "내가 좋아하는 선수에게 하트를 보내 응원하세요!\n하트를 보낸 만큼 응원픽의 응원 점수를 획득하게 됩니다."
                    } */}
                    {jsonSvc.findLocalById("110068")}
                </PretendText>
                <View>
                    <SearchPlayer
                        styleCustom={{
                            ...RatioUtil.marginFixedRatio(20, 20, 20, 20),
                            ...RatioUtil.padding(0, 0, 0, 0),
                            maxHeight: RatioUtil.lengthFixedRatio(160),
                        }}
                        onChange={searchInput.onChange}
                        value={searchInput.value}
                    />
                </View>
            </View>
            <ScrollView
                onMomentumScrollBegin={({ nativeEvent }) => {
                    if (ifCloseToTop(nativeEvent)) {
                        setisSwipeUp(false)
                    } else {
                        setisSwipeUp(true)
                    }
                }}
                contentContainerStyle={{
                    width: RatioUtil.width(320),
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignSelf: "center",
                }}
            >
                {nftPlayerJson
                    ?.filter(v => v.sPlayerName.includes(searchInput.value))
                    .map((v, i) => (
                        <CustomButton
                            key={i}
                            style={{
                                // ...mineCompoStyle.photoPopup.galleryBox,
                                ...RatioUtil.sizeFixedRatio(100, 124),
                                ...RatioUtil.marginFixedRatio(0, (i + 1) % 3 === 0 ? 0 : 8, 10, 0),
                                marginBottom: RatioUtil.lengthFixedRatio(10),
                                alignSelf: "center",
                            }}
                            onPress={() => {
                                onSelect(v)
                            }}
                        >
                            {/* <FastImage
                                source={{ uri: ConfigUtil.getPlayerImage(v.sPlayerImagePath) }}
                                style={{
                                    ...RatioUtil.size(100, 144),
                                }}
                            /> */}
                            <View
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    ...RatioUtil.sizeFixedRatio(100, 124),
                                    backgroundColor: Colors.GRAY9,
                                    borderRadius: RatioUtil.lengthFixedRatio(10),
                                }}
                            >
                                <FastImage
                                    source={{ uri: ConfigUtil.getPlayerImage(v.sPlayerImagePath) }}
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(60),
                                        height: RatioUtil.lengthFixedRatio(60),
                                        borderRadius: RatioUtil.lengthFixedRatio(60),
                                    }}
                                />
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        fontSize: RatioUtil.font(14),
                                        lineHeight: RatioUtil.font(14) * 1.3,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {v.sPlayerName}
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.lengthFixedRatio(4),
                                        fontSize: RatioUtil.font(12),
                                        lineHeight: RatioUtil.font(12) * 1.3,
                                        fontWeight: "normal",
                                        color: Colors.GRAY8,
                                    }}
                                >
                                    {v.sTeam}
                                </PretendText>
                            </View>

                            {select?.nPersonID === v.nPersonID && visibleChecked ? (
                                <View
                                    style={{
                                        position: "absolute",
                                        top: "10%",
                                        right: "10%",
                                    }}
                                >
                                    <Image
                                        source={myPageImg.checkPhoto}
                                        style={{
                                            width: RatioUtil.width(20),
                                            height: RatioUtil.width(20),
                                        }}
                                        resizeMode="contain"
                                    />
                                </View>
                            ) : null}
                        </CustomButton>
                    ))}
                <View style={{ height: RatioUtil.lengthFixedRatio(30) }} />
            </ScrollView>
            <View
                style={{
                    marginTop: RatioUtil.lengthFixedRatio(60) + Math.max(RatioUtil.lengthFixedRatio(20), insets.bottom),
                }}
            />
            <View
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        position: "absolute",
                        bottom: 0,
                        marginBottom: Math.max(RatioUtil.lengthFixedRatio(20), insets.bottom),
                    },
                ]}
            >
                {/* /*- */}
                <CustomButton
                    onPress={onConfirm}
                    disabled={!visibleChecked}
                    style={[
                        buttonProps.confirm,
                        {
                            backgroundColor: visibleChecked ? Colors.BLACK : Colors.GRAY7,
                            ...RatioUtil.sizeFixedRatio(320, 60),
                        },
                    ]}
                >
                    <PretendText
                        style={{
                            color: visibleChecked ? Colors.WHITE : Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(16),
                        }}
                    >
                        {/* 확인 */}
                        {jsonSvc.findLocalById("1012")}
                    </PretendText>
                </CustomButton>
            </View>
        </Animated.View>
    )
}

export interface DeclareChatUserProps {
    data: IChatRes
    policeListen: (res: { isDeclare: boolean; seq: number }) => void
}

export const DeclareContents = ({ data, policeListen }: DeclareChatUserProps) => {
    const [menu, setMenu] = useState<{
        [key: string | number]: { title: string; contents: string[]; visible: boolean }
    }>({
        [CHAT_POLICE_TYPE.SPAM]: {
            title: jsonSvc.findLocalById("130100"),
            contents: [
                jsonSvc.findLocalById("130101"),
                jsonSvc.findLocalById("130102"),
                jsonSvc.findLocalById("130103"),
                jsonSvc.findLocalById("130104"),
                jsonSvc.findLocalById("130105"),
                jsonSvc.findLocalById("130106"),
            ],
            visible: false,
        },
        [CHAT_POLICE_TYPE.SEXUAL]: {
            title: jsonSvc.findLocalById("130200"),
            contents: [
                jsonSvc.findLocalById("130201"),
                jsonSvc.findLocalById("130202"),
                jsonSvc.findLocalById("130203"),
                jsonSvc.findLocalById("130204"),
            ],
            visible: false,
        },
        [CHAT_POLICE_TYPE.INSULT]: {
            title: jsonSvc.findLocalById("130300"),
            contents: [
                jsonSvc.findLocalById("130301"),
                jsonSvc.findLocalById("130302"),
                jsonSvc.findLocalById("130303"),
                jsonSvc.findLocalById("130304"),
            ],
            visible: false,
        },
        [CHAT_POLICE_TYPE.EXPOSURE]: {
            title: jsonSvc.findLocalById("130400"),
            contents: [jsonSvc.findLocalById("130401"), jsonSvc.findLocalById("130402")],
            visible: false,
        },
    })

    const popupDispatch = useWrapDispatch(setPopUp)
    const modalDispatch = useWrapDispatch(setModal)

    const [isConfirmed, setConfirmed] = useState<boolean>(false)
    const [isChatReport, setIsChatReport] = useState<boolean>(false)
    const insets = useSafeAreaInsets()

    useEffect(() => {
        // 신고하기 버튼이 글릭 되면 isConfirmed가 true로 변경된다.
        if (isConfirmed === false && isChatReport === false) return
        if(isChatReport) {
            // 신고된 채팅일 경우
            const interactionPromise = InteractionManager.runAfterInteractions(() => {
            modalDispatch({
                    open: true,
                    children: (
                        <View
                            style={{
                                backgroundColor: Colors.WHITE,
                                ...RatioUtil.borderRadius(16),
                                alignSelf: "center",
                                alignItems: "center",
                                ...RatioUtil.sizeFixedRatio(272, 220),
                                ...RatioUtil.paddingFixedRatio(20, 20, 20, 20),
                            }}
                        >
                            <View
                                style={{
                                    width: RatioUtil.width(50),
                                    height: RatioUtil.width(50),
                                    borderRadius: RatioUtil.width(25),
                                    backgroundColor: Colors.GRAY7,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: RatioUtil.lengthFixedRatio(10),
                                }}
                            >
                                <Image source={profileHeaderImg.alert} />
                            </View>
                            <View
                                style={{
                                    marginTop: RatioUtil.lengthFixedRatio(10),
                                    marginBottom: RatioUtil.lengthFixedRatio(20),
                                    padding: RatioUtil.width(10),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.BLACK2,
                                        fontSize: RatioUtil.font(16),
                                        fontWeight: "400",
                                        lineHeight: RatioUtil.font(16) * 1.4,
                                    }}
                                >
                                    이미 신고한 채팅입니다.
                                </PretendText>
                            </View>
                            <CustomButton
                                onPress={() => {
                                    modalDispatch({ open: false })
                                }}
                                style={{
                                    width: RatioUtil.width(232),
                                    height: RatioUtil.lengthFixedRatio(48),
                                    borderRadius: RatioUtil.width(24),
                                    backgroundColor: Colors.BLACK,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        lineHeight: RatioUtil.font(14) * 1.4,
                                    }}
                                >
                                    확인
                                </PretendText>
                            </CustomButton>
                        </View>
                    ),
                })
            })
            return () => interactionPromise.cancel()     

        } else {
            const interactionPromise = InteractionManager.runAfterInteractions(() => {
                modalDispatch({
                    open: true,
                    children: (
                        <View
                            style={{
                                backgroundColor: Colors.WHITE,
                                ...RatioUtil.borderRadius(16),
                                alignSelf: "center",
                                alignItems: "center",
                                ...RatioUtil.sizeFixedRatio(272, 220),
                                ...RatioUtil.paddingFixedRatio(20, 20, 20, 20),
                            }}
                        >
                            <View
                                style={{
                                    width: RatioUtil.width(50),
                                    height: RatioUtil.width(50),
                                    borderRadius: RatioUtil.width(25),
                                    backgroundColor: Colors.GRAY7,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: RatioUtil.lengthFixedRatio(10),
                                }}
                            >
                                <Image source={profileHeaderImg.check} />
                            </View>
                            <View
                                style={{
                                    marginTop: RatioUtil.lengthFixedRatio(10),
                                    marginBottom: RatioUtil.lengthFixedRatio(20),
                                    padding: RatioUtil.width(10),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.BLACK2,
                                        fontSize: RatioUtil.font(16),
                                        fontWeight: "400",
                                        lineHeight: RatioUtil.font(16) * 1.4,
                                    }}
                                >
                                    신고 접수가 완료되었습니다.
                                </PretendText>
                            </View>
                            <CustomButton
                                onPress={() => {
                                    modalDispatch({ open: false })
                                }}
                                style={{
                                    width: RatioUtil.width(232),
                                    height: RatioUtil.lengthFixedRatio(48),
                                    borderRadius: RatioUtil.width(24),
                                    backgroundColor: Colors.BLACK,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        lineHeight: RatioUtil.font(14) * 1.4,
                                    }}
                                >
                                    확인
                                </PretendText>
                            </CustomButton>
                        </View>
                    ),
                })
            })
            return () => interactionPromise.cancel()
        }

    }, [isConfirmed, isChatReport])

    const onClose = () => {
        popupDispatch({ open: false })
    }
    const onReport = () => {
        const policeType = checkedList.find(v => v.ischeck)?.name
        chatSvc.onReport(data.seq, policeType, res => {
            // 이미 신고된 계정일 때
            if (res === false) {
                setIsChatReport(true)
                popupDispatch({ open: false })
                return
            }

            policeListen(res)

            if (!res.isDeclare) {
                setConfirmed(true)
                popupDispatch({ open: false })
            }
        })
    }

    const { checkedList, onOneCheck, isCheck } = useCheckbox({
        checkable: [CHAT_POLICE_TYPE.SPAM, CHAT_POLICE_TYPE.SEXUAL, CHAT_POLICE_TYPE.INSULT, CHAT_POLICE_TYPE.EXPOSURE],
    })

    const isSelect =
        isCheck([CHAT_POLICE_TYPE.SPAM]) ||
        isCheck([CHAT_POLICE_TYPE.SEXUAL]) ||
        isCheck([CHAT_POLICE_TYPE.INSULT]) ||
        isCheck([CHAT_POLICE_TYPE.EXPOSURE])
    return (
        <SafeAreaView>
            <View
                style={{
                    width: RatioUtil.width(360),
                    height: RatioUtil.height(Dimension.BASE.HEIGHT) - insets.top,
                    backgroundColor: Colors.WHITE,
                    marginTop: insets.top,
                    borderTopLeftRadius: RatioUtil.width(16),
                    borderTopRightRadius: RatioUtil.width(16),
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}
            >
                <View
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.lengthFixedRatio(60),
                        ...RatioUtil.paddingFixedRatio(0, 20, 0, 20),
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View
                        style={{
                            width: RatioUtil.width(30),
                        }}
                    />
                    <PretendText
                        style={{
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(18),
                            height: RatioUtil.lengthFixedRatio(24),
                            textAlign: "center",
                        }}
                    >
                        {/* 신고하기 */}
                        {jsonSvc.findLocalById("130005")}
                    </PretendText>
                    <CustomButton
                        style={{
                            width: RatioUtil.width(30),
                            height: RatioUtil.lengthFixedRatio(30),
                        }}
                        onPress={() => {
                            popupDispatch({ open: false })
                        }}
                    >
                        <Image
                            style={{
                                width: RatioUtil.width(30),
                                height: RatioUtil.lengthFixedRatio(30),
                            }}
                            resizeMode="contain"
                            source={nftDetailImg.close}
                        />
                    </CustomButton>
                </View>
                <ScrollView
                    contentContainerStyle={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "scroll",
                    }}
                    style={{ flex: 1 }}
                >
                    <View
                        style={{
                            backgroundColor: Colors.GRAY9,
                            ...RatioUtil.paddingFixedRatio(14, 14, 14, 14),
                            width: RatioUtil.width(320),
                            borderRadius: RatioUtil.width(10),
                            marginBottom: RatioUtil.lengthFixedRatio(20),
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                marginBottom: RatioUtil.lengthFixedRatio(5),
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                            }}
                        >
                            <PretendText
                                style={{
                                    width: RatioUtil.width(52),
                                    color: Colors.BLACK,
                                    fontSize: RatioUtil.font(14),
                                    textAlign: "left",
                                }}
                            >
                                {/* 작성자 */}
                                {jsonSvc.findLocalById("130006")}
                            </PretendText>
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(14),
                                    color: Colors.GRAY8,
                                }}
                            >
                                {data.name}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                            }}
                        >
                            <PretendText
                                style={{
                                    width: RatioUtil.width(52),
                                    color: Colors.BLACK,
                                    fontSize: RatioUtil.font(14),
                                    textAlign: "left",
                                }}
                            >
                                {/* 내용 */}
                                {jsonSvc.findLocalById("130007")}
                            </PretendText>
                            <PretendText
                                style={{
                                    width: RatioUtil.width(240),
                                    fontSize: RatioUtil.font(14),
                                    lineHeight: RatioUtil.font(14) * 1.3,
                                    color: Colors.GRAY8,
                                    textAlign: "left",
                                }}
                            >
                                {data.contents}
                            </PretendText>
                        </View>
                    </View>
                    <PretendText
                        style={{
                            alignSelf: "flex-start",
                            marginBottom: RatioUtil.height(10),
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(16),
                        }}
                    >
                        {/* 신고 사유 */}
                        {jsonSvc.findLocalById("130008")}
                    </PretendText>

                    {checkedList.map(v => (
                        <CustomButton
                            style={{
                                width: RatioUtil.width(320),
                                minHeight: RatioUtil.lengthFixedRatio(50),
                                borderWidth: 1,
                                borderColor: Colors.GRAY,
                                ...RatioUtil.paddingFixedRatio(13, 14, 13, 14),
                                marginBottom: RatioUtil.lengthFixedRatio(10),
                                ...RatioUtil.borderRadius(10),
                            }}
                            key={v.name}
                            onPress={() => {
                                setMenu(prev => ({
                                    ...prev,
                                    [v.name]: {
                                        ...prev[v.name],
                                        visible: !prev[v.name].visible,
                                    },
                                }))
                            }}
                        >
                            <View
                                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                            >
                                <CheckBox
                                    onCheck={() => onOneCheck(v.name)}
                                    ischeck={v.ischeck}
                                    unCheckedView={
                                        <Image
                                            source={liveImg.check.off}
                                            style={{
                                                ...RatioUtil.size(24, 24),
                                            }}
                                        />
                                    }
                                    checkedView={
                                        <Image
                                            source={liveImg.check.on}
                                            style={{
                                                ...RatioUtil.size(24, 24),
                                            }}
                                        />
                                    }
                                    style={{ alignItems: "center" }}
                                >
                                    <PretendText
                                        style={{
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: Colors.BLACK,
                                            fontSize: RatioUtil.font(14),
                                            marginLeft: RatioUtil.width(12),
                                        }}
                                    >
                                        {menu[v.name].title}
                                    </PretendText>
                                </CheckBox>
                                <View>
                                    <Image
                                        source={menu[v.name].visible ? liveImg.arrow.up : liveImg.arrow.down}
                                        style={{
                                            ...RatioUtil.sizeFixedRatio(10, 5),
                                        }}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                            {menu[v.name].visible && (
                                <>
                                    <View
                                        style={{
                                            width: RatioUtil.width(258),
                                            borderBottomWidth: RatioUtil.lengthFixedRatio(1),
                                            borderColor: Colors.GRAY7,
                                            ...RatioUtil.marginFixedRatio(15, 0, 20, 35),
                                        }}
                                    />
                                    <View style={{ marginLeft: RatioUtil.width(35) }}>
                                        {menu[v.name].contents.map((d, i) => (
                                            <View
                                                key={i}
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    width: RatioUtil.width(220),
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        ...RatioUtil.size(2, 2),
                                                        borderRadius: RatioUtil.width(5),
                                                        backgroundColor: Colors.GRAY8,
                                                        alignSelf: "flex-start",
                                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                                        marginRight: RatioUtil.width(5),
                                                    }}
                                                />
                                                <PretendText
                                                    style={{
                                                        marginBottom: RatioUtil.lengthFixedRatio(5),
                                                        fontSize: RatioUtil.font(12),
                                                        color: Colors.GRAY8,
                                                    }}
                                                >
                                                    {d}
                                                </PretendText>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}
                        </CustomButton>
                    ))}
                </ScrollView>
                <View
                    style={{
                        height: RatioUtil.lengthFixedRatio(90),
                    }}
                ></View>
                <View
                    style={{
                        flexDirection: "row",
                        bottom: Math.max(RatioUtil.height(20), insets.bottom),
                        alignItems: "center",
                        justifyContent: "space-between",
                        alignSelf: "center",
                        position: "absolute",
                    }}
                >
                    <CustomButton
                        style={{
                            ...RatioUtil.sizeFixedRatio(157, 48),
                            backgroundColor: Colors.GRAY7,
                            alignItems: "center",
                            justifyContent: "center",
                            ...RatioUtil.borderRadius(100),
                        }}
                        onPress={onClose}
                    >
                        <PretendText
                            style={{
                                color: Colors.BLACK,
                                fontWeight: RatioUtil.fontWeightBold(),
                                fontSize: RatioUtil.font(14),
                            }}
                        >
                            취소
                        </PretendText>
                    </CustomButton>
                    <CustomButton
                        style={{
                            ...RatioUtil.sizeFixedRatio(157, 48),
                            backgroundColor: isSelect ? Colors.RED2 : Colors.GRAY7,
                            alignItems: "center",
                            justifyContent: "center",
                            ...RatioUtil.borderRadius(100),
                            marginLeft: RatioUtil.width(4),
                        }}
                        onPress={onReport}
                        disabled={!isSelect}
                    >
                        <PretendText
                            style={{
                                color: Colors.WHITE,
                                fontWeight: RatioUtil.fontWeightBold(),
                                fontSize: RatioUtil.font(14),
                            }}
                        >
                            {/* 신고하기 */}
                            {jsonSvc.findLocalById("130005")}
                        </PretendText>
                    </CustomButton>
                </View>
            </View>
        </SafeAreaView>
    )
}
//TODO:
export const DonateSelectPlayer = ({
    onDonation,
    profile,
    gameData,
}: {
    onDonation: (msg: string, cash: number, code: number) => void
    profile: IMyProfile | null
    gameData?: ISeasonDetail
}) => {
    const popupDispatch = useWrapDispatch(setPopUp)
    const [select, setselect] = useState<IPlayer | null>()
    const [visibleChecked, setVisibleChecked] = useState<boolean>(false)
    const isKeyboardVisible = useKeyboardVisible()
    const [isSwipeUp, setisSwipeUp] = useState(false)

    const searchInput = useInputs({
        validCheck: () => {},
        value: "",
    })
    useAsyncEffect(async () => {
        if (!gameData) return

        await Analytics.logEvent(
            AnalyticsEventName.view_support_proSelect_popup_55,

            {
                hasNewUserData: true,
                game_id: gameData.GAME_CODE,
                game_status: gameData.gameStatus,
            }
        )
    }, [gameData])

    useEffect(() => {
        if (isKeyboardVisible) {
            setButtonProps(state =>
                produce(state, draft => {
                    draft.confirm = {
                        ...state.confirm,
                        width: RatioUtil.width(370),
                        ...RatioUtil.borderRadius(0),
                    }
                    draft.cancel.display = "none"
                })
            )

            animation.value = {
                height: Platform.OS == "ios" ? RatioUtil.height(610) : RatioUtil.height(610),
                marginTop: RatioUtil.height(31),
                top: RatioUtil.height(350),
            }
        } else {
            setButtonProps(state =>
                produce(state, draft => {
                    draft.confirm = {
                        ...state.confirm,
                        width: RatioUtil.width(202),
                        ...RatioUtil.borderRadius(30),
                    }
                    draft.cancel.display = "flex"
                })
            )
            if (isSwipeUp) {
                animation.value = {
                    height: RatioUtil.height(631),
                    marginTop: RatioUtil.height(61),
                    top: RatioUtil.height(561),
                }
            } else {
                animation.value = {
                    height: RatioUtil.height(440),
                    marginTop: RatioUtil.height(280),
                    top: RatioUtil.height(330),
                }
            }
        }
    }, [isKeyboardVisible, isSwipeUp])

    const [buttonProps, setButtonProps] = useState({
        confirm: {
            ...RatioUtil.sizeFixedRatio(202, 60),
            ...RatioUtil.borderRadius(30),
            backgroundColor: Colors.BLACK,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: RatioUtil.width(10),
        } as ViewStyle,
        cancel: {
            ...RatioUtil.sizeFixedRatio(108, 60),
            ...RatioUtil.borderRadius(30),
            backgroundColor: Colors.GRAY7,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
        } as ViewStyle,
    })

    const animation = useSharedValue({
        height: RatioUtil.lengthFixedRatio(450),
        marginTop: RatioUtil.lengthFixedRatio(280),
        top: RatioUtil.lengthFixedRatio(350),
    })
    const ifCloseToTop = ({ contentOffset }: any) => {
        return contentOffset.y == 0
    }
    const animatedStyle = useAnimatedStyle(
        () => ({
            height: withTiming(animation.value.height, {
                duration: isKeyboardVisible ? 0 : isSwipeUp ? 520 : 300,
            }),
            marginTop: withTiming(animation.value.marginTop, {
                duration: isKeyboardVisible ? 0 : isSwipeUp ? 520 : 300,
            }),
        }),
        [isSwipeUp, isKeyboardVisible]
    )
    const aniBtnStyle = useAnimatedStyle(() => ({
        top: Platform.OS == "ios" && isKeyboardVisible ? "47%" : animation.value.top,
    }))

    const onSelect = (v: IPlayer | null) => {
        if (v?.nID === select?.nID) {
            setselect(null)
            setVisibleChecked(false)
        } else {
            setselect(v)
            setVisibleChecked(true)
        }
    }

    const onClose = () => {
        popupDispatch({ open: false })
    }

    const onConfirm = async () => {
        // popupDispatch({ open: true, children: <CheerTabCompo.DecideBdst profile={profile} /> })

        if (select) {
            await Analytics.logEvent(
                AnalyticsEventName.click_cash_support_next_55,

                {
                    hasNewUserData: true,
                    first_action: "FALSE",
                    game_id: gameData?.GAME_CODE,
                    player_code: select.nPersonID,
                    player_name: select.sPlayerName,
                }
            )
            
            popupDispatch({
                open: true,
                children: (
                    <DonateContents
                        userCoin={100000}
                        player={select}
                        onDonate={(coin, text) => onDonation(text, coin, select.nPersonID)}
                        onDonation={onDonation}
                        profile={profile}
                        gameData={gameData}
                    />
                ),
            })
        } else {
            Alert.alert("선수를 선택해주세요.")
        }
    }

    const insets = useSafeAreaInsets()

    return (
        <Animated.View
            style={[
                {
                    backgroundColor: Colors.WHITE,
                    ...RatioUtil.borderRadius(10, 10, 0, 0),
                    width: RatioUtil.width(360),
                    position: "absolute",
                    bottom: 0,
                },
                animatedStyle,
            ]}
        >
            <GestureRecognizer
                onSwipeDown={onClose}
                onSwipeUp={() => setisSwipeUp(true)}
                style={{
                    // ...RatioUtil.sizeFixedRatio(360, 60),
                    ...liveGeneral.popup.center,
                }}
            >
                <View
                    style={{
                        ...RatioUtil.sizeFixedRatio(320, 60),
                        ...liveGeneral.popup.center,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <PretendText
                        style={{
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(18),
                            color: Colors.BLACK,
                        }}
                    >
                        {/* 후원 보내기 */}
                        {jsonSvc.findLocalById("110100")}
                    </PretendText>
                    <CustomButton
                        onPress={async () => {
                            await Analytics.logEvent(
                                AnalyticsEventName.click_close_55,

                                {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                    game_id: gameData?.GAME_CODE,
                                }
                            )

                            onClose()
                        }}
                        style={{
                            position: "absolute",
                            right: 0,
                        }}
                    >
                        <Image
                            source={nftDetailImg.close}
                            style={{
                                width: RatioUtil.width(30),
                                height: RatioUtil.width(30),
                            }}
                        />
                    </CustomButton>
                </View>
            </GestureRecognizer>
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: RatioUtil.height(20),
                }}
            >
                <PretendText
                    style={{
                        color: Colors.GRAY2,
                        fontSize: RatioUtil.font(14),
                        fontWeight: "400",
                    }}
                >
                    후원은 최소 비용 제외 후 모두 프로에게 전해집니다.
                </PretendText>
            </View>

            <SearchPlayer
                styleCustom={{
                    height: RatioUtil.lengthFixedRatio(48),
                    width: RatioUtil.lengthFixedRatio(320),

                    ...RatioUtil.padding(0, 0, 0, 20),
                }}
                onChange={searchInput.onChange}
                value={searchInput.value}
                onFocus={async () => {
                    await Analytics.logEvent(
                        AnalyticsEventName.click_search_55,

                        {
                            hasNewUserData: true,
                            first_action: "FALSE",
                        }
                    )
                }}
            />

            <ScrollView
                style={{
                    marginTop: RatioUtil.lengthFixedRatio(20),
                    alignSelf: "center",
                }}
                onMomentumScrollBegin={({ nativeEvent }) => {
                    if (ifCloseToTop(nativeEvent)) {
                        setisSwipeUp(false)
                    } else {
                        setisSwipeUp(true)
                    }
                }}
                contentContainerStyle={{
                    width: RatioUtil.width(320),
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                }}
            >
                {nftPlayerJson
                    ?.filter(v => v.sPlayerName.includes(searchInput.value))
                    .map((v, i) => (
                        <CustomButton
                            key={i}
                            style={{
                                // ...mineCompoStyle.photoPopup.galleryBox,
                                ...RatioUtil.sizeFixedRatio(100, 124),
                                ...RatioUtil.marginFixedRatio(0, (i + 1) % 3 === 0 ? 0 : 8, 10, 0),
                            }}
                            onPress={async () => {
                                await Analytics.logEvent(
                                    AnalyticsEventName.click_proSelect_55,

                                    {
                                        hasNewUserData: true,
                                        first_action: "FALSE",
                                    }
                                )

                                onSelect(v)
                            }}
                        >
                            {/* <FastImage
                                source={{ uri: ConfigUtil.getPlayerImage(v.sPlayerImagePath) }}
                                style={{
                                    ...RatioUtil.size(100, 144),
                                }}
                            /> */}
                            <View
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    ...RatioUtil.sizeFixedRatio(100, 124),
                                    backgroundColor: Colors.GRAY9,
                                    borderRadius: RatioUtil.height(10),
                                }}
                            >
                                <FastImage
                                    source={{ uri: ConfigUtil.getPlayerImage(v.sPlayerImagePath) }}
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(60),
                                        height: RatioUtil.lengthFixedRatio(60),
                                        borderRadius: RatioUtil.height(60),
                                    }}
                                />
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        fontSize: RatioUtil.font(14),
                                        lineHeight: RatioUtil.font(14) * 1.3,
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {v.sPlayerName}
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.lengthFixedRatio(4),
                                        fontSize: RatioUtil.font(12),
                                        lineHeight: RatioUtil.font(12) * 1.3,
                                        fontWeight: "400",
                                        color: Colors.GRAY8,
                                    }}
                                >
                                    {v.sTeam}
                                </PretendText>
                            </View>
                            {select?.nPersonID === v.nPersonID && visibleChecked ? (
                                <View
                                    style={{
                                        position: "absolute",
                                        right: "10%",
                                        top: "10%",
                                    }}
                                >
                                    <Image
                                        source={myPageImg.checkPhoto}
                                        style={{
                                            width: RatioUtil.width(20),
                                            height: RatioUtil.width(20),
                                        }}
                                    />
                                </View>
                            ) : null}
                        </CustomButton>
                    ))}
                <View style={{ width: "100%", height: RatioUtil.lengthFixedRatio(20) }} />
            </ScrollView>
            <View
                style={{
                    marginTop: RatioUtil.lengthFixedRatio(60) + Math.max(RatioUtil.lengthFixedRatio(20), insets.bottom),
                }}
            />
            <View
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        position: "absolute",
                        bottom: 0,
                        marginBottom: Math.max(RatioUtil.lengthFixedRatio(20), insets.bottom),
                    },
                ]}
            >
                <CustomButton
                    onPress={async () => {
                        await Analytics.logEvent(
                            AnalyticsEventName.click_cash_support_previous_55,

                            {
                                hasNewUserData: true,
                                first_action: "FALSE",
                                game_id: gameData?.GAME_CODE,
                            }
                        )

                        popupDispatch({ open: false })
                    }}
                    style={buttonProps.cancel}
                >
                    <PretendText
                        style={{
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(16),
                        }}
                    >
                        {/* 이전단계 */}
                        {jsonSvc.findLocalById("110101")}
                    </PretendText>
                </CustomButton>
                <CustomButton
                    onPress={onConfirm}
                    style={[
                        buttonProps.confirm,
                        {
                            backgroundColor: select ? Colors.BLACK : Colors.GRAY7,
                        },
                    ]}
                >
                    <PretendText
                        style={{
                            color: select ? Colors.WHITE : Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(16),
                        }}
                    >
                        {/* 다음 */}
                        {jsonSvc.findLocalById("110102")}
                    </PretendText>
                </CustomButton>
            </View>
        </Animated.View>
    )
}

export const DonateEnd = ({
    donateCoin,
    playerCode,
    gameData,
}: {
    donateCoin: number
    playerCode: number
    gameData?: ISeasonDetail
}) => {
    const modalDispatch = useWrapDispatch(setModal)
    const player = nftSvc.getNftPlayer(playerCode)
    const point = jsonSvc.findConstById(23002).nIntValue || 1

    useAsyncEffect(async () => {
        if (!gameData) return

        await Analytics.logEvent(AnalyticsEventName.view_cash_support_success_60, {
            hasNewUserData: true,
            game_id: gameData.GAME_CODE,
            game_status: gameData.gameStatus,
            player_code: playerCode,
            player_name: player?.sPlayerName,
            shop_nId: jsonSvc.findShopByCost(donateCoin).nID,
        })
    }, [gameData, playerCode, player, donateCoin])

    return (
        <View
            style={{
                backgroundColor: Colors.WHITE,
                ...RatioUtil.size(272, 261),
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                ...RatioUtil.borderRadius(20),
            }}
        >
            <Image source={liveImg.check.end} style={{ marginTop: RatioUtil.height(30) }} />
            <PretendText
                style={{
                    textAlign: "center",
                    ...RatioUtil.margin(19, 0, 9, 0),
                    fontSize: RatioUtil.font(16),
                    color: Colors.BLACK,
                }}
            >
                {/* {`${player?.sPlayerName} 프로에게\n${NumberUtil.denoteComma(donateCoin)}원을 보냈습니다.`} */}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000037"), [
                    player?.sPlayerName ?? "",
                    NumberUtil.denoteComma(donateCoin).toString(),
                ])}
            </PretendText>
            <PretendText style={{ color: Colors.BLACK }}>
                {/* {`응원점수: ${
                point.nIntValue ? (donateCoin / 100) * point.nIntValue : 0
            }점 획득`} */}
                {jsonSvc.formatLocal(jsonSvc.findLocalById("10000038"), [
                    (point ? (donateCoin / 100) * point : 0).toString(),
                ])}
            </PretendText>
            <CustomButton
                style={{
                    backgroundColor: Colors.BLACK,
                    ...RatioUtil.borderRadius(25),
                    ...RatioUtil.sizeFixedRatio(232, 48),
                    alignItems: "center",
                    justifyContent: "center",
                    ...RatioUtil.marginFixedRatio(21, 20, 20, 20),
                }}
                onPress={() => modalDispatch({ open: false })}
            >
                <PretendText style={{ color: Colors.WHITE, fontWeight: "400" }}>
                    {/* 확인 */}
                    {jsonSvc.findLocalById("10010000")}
                </PretendText>
            </CustomButton>
        </View>
    )
}
export const LastDonate = ({ gameId }: { gameId?: number }) => {
    const donatedUser = useAppSelector(state => state.donateReducer, shallowEqual)

    const donatedDispatch = useWrapDispatch(updateDonatedUser)
    const getLastDonate = async () => {
        if (!gameId) return

        const response = await liveSvc.getDonatedUsers(gameId)
        if (response?.RECENT_SPONSORS.length <= 0) return

        const recent = response.RECENT_SPONSORS.reduce((acc, cur) =>
            new Date(acc.REG_AT).getTime() > new Date(cur.REG_AT).getTime() ? acc : cur
        )

        donatedDispatch({
            iconName: recent.ICON_NAME,
            iconType: recent.ICON_TYPE,
            cash: recent.SPONSOR_CASH,
            nick: recent.USER_NICK,
            playerCode: recent.PLAYER_CODE,
        })
    }

    useEffect(() => {
        getLastDonate()
    }, [])

    const { profile } = ConfigUtil.getProfile(donatedUser.iconName, donatedUser.iconType)
    const { colors } = chatSvc.getCashColor(donatedUser.cash)

    return donatedUser.cash ? (
        <View
            style={{
                width: RatioUtil.lengthFixedRatio(360),
                height: RatioUtil.lengthFixedRatio(46),
            }}
        >
            <ImageBackground
                source={liveImg.latestDonatebg}
                style={{
                    top: 0,
                    zIndex: 2,
                    width: RatioUtil.lengthFixedRatio(360),
                    height: RatioUtil.lengthFixedRatio(46),
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <PretendText
                        style={{
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(12),
                            marginLeft: RatioUtil.width(20),
                            marginRight: RatioUtil.width(10),
                        }}
                    >
                        {/* 최근 후원 기록 */}
                        {jsonSvc.findLocalById("110113")}
                    </PretendText>

                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        colors={colors}
                        style={{
                            paddingHorizontal: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                            marginRight: RatioUtil.width(20),
                            height: RatioUtil.lengthFixedRatio(20),
                            borderRadius: RatioUtil.lengthFixedRatio(20),
                        }}
                    >
                        <View
                            style={{
                                borderColor: Colors.WHITE,
                                borderWidth: RatioUtil.width(5),
                                ...RatioUtil.sizeFixedRatio(18, 18),
                                borderRadius: RatioUtil.width(18),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ProfileImage
                                style={{
                                    ...RatioUtil.sizeFixedRatio(18, 18),
                                    borderRadius: 15,
                                }}
                                name={profile.name ?? ""}
                                type={profile.type ?? 0}
                                resizeMode="contain"
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "90%",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <PretendText
                                    style={[
                                        cheerStyle.donatePopup.infoText,
                                        {
                                            marginLeft: RatioUtil.width(11),
                                            fontSize: RatioUtil.font(12),
                                            borderRadius: 5,
                                            fontWeight: RatioUtil.fontWeightBold(),
                                        },
                                    ]}
                                >
                                    {donatedUser.nick}
                                    {/* 후원자 이름 */}
                                </PretendText>
                                <PretendText
                                    style={[
                                        cheerStyle.donatePopup.infoText,
                                        {
                                            marginLeft: RatioUtil.width(6),
                                            fontSize: RatioUtil.font(12),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                        },
                                    ]}
                                >
                                    {nftPlayerJson.find(e => e.nPersonID === donatedUser.playerCode)?.sPlayerName ?? ""}
                                    {/* 후원 선수 이름 */}
                                </PretendText>
                            </View>
                            <PretendText
                                style={[
                                    cheerStyle.donatePopup.infoText,
                                    {
                                        fontSize: RatioUtil.font(12),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        marginRight: RatioUtil.width(5),
                                    },
                                ]}
                            >
                                {NumberUtil.denoteComma(donatedUser.cash)}
                            </PretendText>
                        </View>
                    </LinearGradient>
                </View>
            </ImageBackground>
        </View>
    ) : null
}
