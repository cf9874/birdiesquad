import {
    Modal,
    TouchableOpacity,
    useWindowDimensions,
    View,
    Platform,
    Pressable,
} from "react-native"
import { ConfigUtil, DateUtil, RatioUtil } from "utils"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { Tab, useTab } from "components/Tab"
import { Colors } from "const/color.const"
import { liveStyle } from "styles/live.style"
import { TabBarIndicator } from "react-native-tab-view"
import CheerTab from "./tab.cheer"
import CheerPickTab from "./tab.cheerPick"
import InfoTab from "./tab.info"
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native"
import { AnalyticsEventName, GameStatus, Screen, ScreenParams } from "const"
import ParticipantTab from "./tab.participant"
import LeaderBoardTab from "./tab.leaderboard"
import { scaleSize } from "styles/minixs"
import {
    useAsyncEffect,
    useGame,
    useHeart,
    useKeyboardVisible,
    useRandomPoint,
} from "hooks"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import CheerBattle from "./live.cheerBattle"
import { BeforeGame } from "components/Common/BeforeGame"
import NftTab from "./tab.nft"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
    RELAY_SCREEN_BEFORE_TUTORIAL,
    RELAY_SCREEN_ENDED_TUTORIAL,
    RELAY_SCREEN_LIVE_TUTORIAL,
    RELAY_SCREEN_POPUP_TUTORIAL,
} from "const/wallet.const"
import { CustomButton, PretendText } from "components/utils"
import { jsonSvc, profileSvc } from "apis/services"
import { SvgIcon } from "components/Common/SvgIcon"
import { APP_USER_ID } from "utils/env"
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import FastImage from "react-native-fast-image"
import { IntroImg, TutorialBox } from "assets/images"
import { Analytics } from "utils/analytics.util"

const LiveMain = () => {
    const assetBdst = useRef<number | undefined>(undefined)

    const { width, height } = useWindowDimensions()
    const { params } = useRoute<RouteProp<ScreenParams, Screen.LIVE>>()
    const { gameData, isEnd, liveGameId } = useGame(params)
    const heartCtx = useHeart({ gameData, assetBdst })
    const randomPointCtx = useRandomPoint({ gameData, assetBdst })
    const [triggerEffect, setTriggerEffect] = useState(false)
    const [showTutorialLive, setShowTutorialLive] = useState(false)
    const [showTutorialBefore, setShowTutorialBefore] = useState(false)
    const [showTutorialEnd, setShowTutorialEnd] = useState(false)
    const [showTutorialPopup, setShowTutorialPopup] = useState(false)
    const keyboardVisible = useKeyboardVisible()
    const beforeCheerTabOffset = 0
   
    useEffect(() => {
        const backAction = () => {
            Analytics.logEvent(
                AnalyticsEventName.click_back_50,

                {
                    hasNewUserData: true,
                    first_action: "FALSE",
                    game_id: gameData?.GAME_CODE,
                }
            ).then(() => {})

            return false
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)

        return () => backHandler.remove()
    }, [])

    useAsyncEffect(async () => {
        if (!gameData?.GAME_CODE) return

        await Analytics.logEvent(AnalyticsEventName.view_tour_50, {
            hasNewUserData: false,
            game_id: gameData.GAME_CODE,
            game_status: gameData.gameStatus,
        })
    }, [gameData?.GAME_CODE])

    const getAsset = async () => {
        const asset = await profileSvc.getAsset()

        if (asset) {
            const bdst = asset.asset.bdst
            assetBdst.current = bdst
        }
    }

    useFocusEffect(
        useCallback(() => {
            getAsset()
        }, [])
    )

    const tabs = useMemo(
        () => ({
            base: [
                {
                    title:
                        // "응원픽",
                        jsonSvc.findLocalById("8001"),
                    component: <CheerPickTab gameData={gameData} triggerEffect={triggerEffect} isEnd={isEnd} />,
                },
                {
                    title: "스쿼드",
                    // jsonSvc.findLocalById("8008"),
                    component: <NftTab gameData={gameData} />,
                },
                {
                    title:
                        // "리더보드",
                        jsonSvc.findLocalById("8003"),
                    component: <LeaderBoardTab gameData={gameData} isEnd={isEnd} />,
                },
                {
                    title:
                        // "정보",
                        jsonSvc.findLocalById("8006"),
                    component: <InfoTab gameData={gameData} />,
                },
            ],
            cheer: {
                title:
                    // "응원",
                    jsonSvc.findLocalById("8000"),
                component: (
                    <CheerTab
                        id={params.gameId}
                        gameData={gameData}
                        isEnd={isEnd}
                        onAnimate={heartCtx.onPressHeart}
                        onAnimationStart={v => heartCtx.setplayerId(v)}
                        callAnimation={heartCtx.callAnimation}
                        showPoint={randomPointCtx.showPoint}
                        showPoints={randomPointCtx.showPoints}
                        botIdx={randomPointCtx.botIdx}
                        setBotIdx={randomPointCtx.setIdx}
                    />
                ),
            },
            before: [
                {
                    title:
                        // "정보",
                        jsonSvc.findLocalById("8006"),
                    component: <InfoTab gameData={gameData} />,
                },
                {
                    title:
                        // "출전선수",
                        jsonSvc.findLocalById("8007"),
                    component: <ParticipantTab gameData={gameData} />,
                },
            ],
        }),
        [gameData, isEnd, triggerEffect, randomPointCtx.botIdx]
    )

    const TabCtx = useTab(
        useMemo(() => {
            const { gameStatus } = gameData ?? {}

            return gameStatus === GameStatus.BEFORE
                ? (liveGameId < 0 && DateUtil.getWeekNumber(new Date(gameData?.BEGIN_AT)) === DateUtil.getWeekNumber(new Date()) + beforeCheerTabOffset) ? [tabs.cheer, ...tabs.before] : [...tabs.before]
                : gameStatus === GameStatus.LIVE ||
                  gameStatus === GameStatus.CONTINUE ||
                  gameStatus === GameStatus.SUSPENDED
                ? [tabs.cheer, ...tabs.base]
                : [...tabs.base]
        }, [tabs, triggerEffect])
    )

    useAsyncEffect(async () => {
        setTriggerEffect(prev => !prev)
        // getAsset()

        if (!gameData?.GAME_CODE) return

        switch (TabCtx.navigationState.routes[TabCtx.index].title) {
            case jsonSvc.findLocalById("8000"): //응원
                await Analytics.logEvent(AnalyticsEventName.click_menu_support_50, {
                    hasNewUserData: true,
                    game_id: gameData.GAME_CODE,
                    game_status: gameData.gameStatus,
                    first_action: "FALSE",
                })
                break
            case jsonSvc.findLocalById("8001"): //응원픽
                await Analytics.logEvent(AnalyticsEventName.click_menu_supportpick_50, {
                    hasNewUserData: true,
                    game_id: gameData.GAME_CODE,
                    game_status: gameData.gameStatus,
                    first_action: "FALSE",
                })
                break
            case "스쿼드":
                await Analytics.logEvent(AnalyticsEventName.click_menu_nft_50, {
                    hasNewUserData: true,
                    game_id: gameData.GAME_CODE,
                    game_status: gameData.gameStatus,
                    first_action: "FALSE",
                })
                break
            case jsonSvc.findLocalById("8003"): //리더보드
                await Analytics.logEvent(AnalyticsEventName.click_menu_leaderboard_50, {
                    hasNewUserData: true,
                    game_id: gameData.GAME_CODE,
                    game_status: gameData.gameStatus,
                    first_action: "FALSE",
                })
                break
            case jsonSvc.findLocalById("8006"): //정보
                await Analytics.logEvent(AnalyticsEventName.click_menu_info_50, {
                    hasNewUserData: true,
                    game_id: gameData.GAME_CODE,
                    game_status: gameData.gameStatus,
                    first_action: "FALSE",
                })
                break
            case jsonSvc.findLocalById("8007"): //출전선수
                await Analytics.logEvent(AnalyticsEventName.click_menu_enter_50, {
                    hasNewUserData: false,
                    game_id: gameData.GAME_CODE,
                    game_status: gameData.gameStatus,
                })
                break

            default:
                break
        }
    }, [TabCtx.index, gameData?.GAME_CODE])

    const tutorialProcess = async () => {
        const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
        const statusEndedTutorial = await AsyncStorage.getItem(USER_ID + RELAY_SCREEN_ENDED_TUTORIAL)
        const statusLiveTutorial = await AsyncStorage.getItem(USER_ID + RELAY_SCREEN_LIVE_TUTORIAL)
        const statusBeforeTutorial = await AsyncStorage.getItem(USER_ID + RELAY_SCREEN_BEFORE_TUTORIAL)

        const { gameStatus } = gameData ?? {}
        if (gameStatus === GameStatus.BEFORE) {
            if (statusBeforeTutorial === "1") {
                setShowTutorialBefore(true)
                setTimeout(async () => {
                    setShowTutorialBefore(false)
                    await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_BEFORE_TUTORIAL, "2")
                    //await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_POPUP_TUTORIAL, "2")
                }, 5000)
            }
        } else if (gameStatus === GameStatus.LIVE || gameStatus === GameStatus.CONTINUE) {
            if (statusLiveTutorial === "1") {
                setShowTutorialLive(true)
            }
        } else if (gameStatus === GameStatus.END) {
            if (statusEndedTutorial === "1") {
                setShowTutorialEnd(true)
                setTimeout(async () => {
                    setShowTutorialEnd(false)
                    await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_ENDED_TUTORIAL, "2")
                    //await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_POPUP_TUTORIAL, "2")
                }, 5000)
            }
        }
    }

    const finishTutorial = async () => {
        const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
        await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_LIVE_TUTORIAL, "2")
        await AsyncStorage.setItem(USER_ID + RELAY_SCREEN_POPUP_TUTORIAL, "2")
        setShowTutorialLive(false)
    }

    useEffect(() => {
        ;(async () => {
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
            const statusPopupTutorial = await AsyncStorage.getItem(USER_ID + RELAY_SCREEN_POPUP_TUTORIAL)

            const { gameStatus } = gameData ?? {}

            if (statusPopupTutorial === "1" && gameStatus === GameStatus.LIVE) {
                setShowTutorialPopup(true)
                return
            }

            await tutorialProcess()
        })()
    }, [gameData])

    const isCheerTab =
        (gameData?.gameStatus === GameStatus.LIVE ||
            gameData?.gameStatus === GameStatus.CONTINUE ||
            gameData?.gameStatus === GameStatus.SUSPENDED ||
            gameData?.gameStatus === GameStatus.BEFORE && liveGameId < 0 && (DateUtil.getWeekNumber(new Date(gameData?.BEGIN_AT)) === DateUtil.getWeekNumber(new Date()) + beforeCheerTabOffset)) &&
        TabCtx.index === 0

    const MyBackdrop = () => (
        <BottomSheetBackdrop
            style={{
                backgroundColor: "transparent",
            }}
            animatedIndex={{
                value: 0,
            }}
            animatedPosition={{
                value: 0,
            }}
        />
    )

    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View
                style={{
                    position: "absolute",
                    zIndex: 1,
                }}
            >
                {isCheerTab && randomPointCtx.renderPoint()}
                {isCheerTab && randomPointCtx.renderNotify()}
            </View>
            {showTutorialEnd ? (
                <CustomButton
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.width(58),
                        position: "absolute",
                        top: 50,
                        zIndex: 20,
                    }}
                >
                    <View style={{ alignItems: "center" }}>
                        <View
                            style={{
                                flexDirection: "row",
                                width: RatioUtil.width(340),
                                height: RatioUtil.width(58),
                                borderRadius: RatioUtil.width(10),
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                alignItems: "center",
                            }}
                        >
                            <SvgIcon
                                name="NftDetailErrorSvg"
                                style={{
                                    width: RatioUtil.width(22),
                                    height: RatioUtil.width(22),
                                    left: RatioUtil.width(20),
                                    position: "absolute",
                                }}
                            />
                            {/* <WithLocalSvg
                                asset={nftDetailImg.error}
                                style={{
                                    width: RatioUtil.width(22),
                                    height: RatioUtil.width(22),
                                    left: RatioUtil.width(20),
                                    position: "absolute",
                                }}
                            /> */}
                            <View
                                style={{
                                    width: RatioUtil.width(300),
                                    position: "absolute",
                                    left: RatioUtil.width(57),
                                    padding: 0,
                                    paddingRight: RatioUtil.width(20),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(12.5),
                                        paddingTop: RatioUtil.width(0),
                                        paddingBottom: RatioUtil.width(0),
                                        lineHeight: RatioUtil.width(18),
                                        fontWeight: "400",
                                    }}
                                >
                                    {/* 이미 종료된 투어에서는 과거 기록만 확인할 수 있습니다. */}
                                    {jsonSvc.findLocalById("6018")}
                                </PretendText>
                            </View>
                        </View>
                    </View>
                </CustomButton>
            ) : null}
            {showTutorialBefore ? (
                <CustomButton
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.width(58),
                        position: "absolute",
                        top: 50,
                        zIndex: 20,
                    }}
                >
                    <View style={{ alignItems: "center" }}>
                        <View
                            style={{
                                flexDirection: "row",
                                width: RatioUtil.width(340),
                                height: RatioUtil.width(58),
                                borderRadius: RatioUtil.width(10),
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                alignItems: "center",
                            }}
                        >
                            <SvgIcon
                                name="NftDetailErrorSvg"
                                style={{
                                    width: RatioUtil.width(22),
                                    height: RatioUtil.width(22),
                                    left: RatioUtil.width(20),
                                    position: "absolute",
                                }}
                            />
                            {/* <WithLocalSvg
                                asset={nftDetailImg.error}
                                style={{
                                    width: RatioUtil.width(22),
                                    height: RatioUtil.width(22),
                                    left: RatioUtil.width(20),
                                    position: "absolute",
                                }}
                            /> */}
                            <View
                                style={{
                                    width: RatioUtil.width(300),
                                    position: "absolute",
                                    left: RatioUtil.width(57),
                                    padding: 0,
                                    paddingRight: RatioUtil.width(20),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(12.5),
                                        paddingTop: RatioUtil.width(0),
                                        paddingBottom: RatioUtil.width(0),
                                        lineHeight: RatioUtil.width(18),
                                        fontWeight: "400",
                                    }}
                                >
                                    {/* 아직 시작하지 않은 투어에서는 투어 정보와 출전선수 정보만 확인할 수 있습니다. */}

                                    {jsonSvc.findLocalById("6021")}
                                </PretendText>
                            </View>
                        </View>
                    </View>
                </CustomButton>
            ) : null}

            <View
                style={{
                    position: "absolute",
                    bottom: RatioUtil.lengthFixedRatio(100) + insets.bottom,
                    alignSelf: "flex-end",
                    zIndex: 1,
                    elevation: 1,
                    height: scaleSize(TabCtx.index == 0 ? 95 : 0),
                    width: scaleSize(95),
                    alignItems: "center",
                    justifyContent: "flex-end",
                    display: keyboardVisible ? "none" : "flex",
                }}
            >
                {isCheerTab && heartCtx.renderHeartIndex()}
                {isCheerTab && heartCtx.renderHeartArray()}
            </View>

            {gameData?.gameStatus === GameStatus.BEFORE && (liveGameId >= 0 || (DateUtil.getWeekNumber(new Date(gameData?.BEGIN_AT)) !== DateUtil.getWeekNumber(new Date()) + beforeCheerTabOffset)) ? (
                <BeforeGame gameData={gameData} />
            ) : (
                <CheerBattle gameData={gameData} />
            )}
            <Tab.Container
                {...TabCtx}
                lazy
                initialLayout={{ ...RatioUtil.sizeFixedRatio(width, height) }}
                renderTabBar={props => {
                    return (
                        <Tab.Bar
                            {...props}
                            renderIndicator={indicatorProps => {
                                /*
                                const isCheerPick = TabCtx.index === 1
                                const isReaderBoard = TabCtx.index === 3

                                const stlye = {
                                    width:
                                        indicatorProps.getTabWidth(TabCtx.index) -
                                        RatioUtil.width(isReaderBoard ? 0 : isCheerPick ? 13 : 30),
                                    left: RatioUtil.width(isReaderBoard ? 1 : isCheerPick ? 7 : 15),
                                }
                                */

                                return (
                                    <TabBarIndicator
                                        {...indicatorProps}
                                        style={{ ...liveStyle.tabMenu.indicator /*, ...stlye */ }}
                                    />
                                )
                            }}
                            style={liveStyle.tabMenu.con}
                            labelStyle={liveStyle.tabMenu.title}
                            activeColor={Colors.BLACK}
                            pressColor={Colors.WHITE}
                        />
                    )
                }}
            />
            {/* <Button title="test" onPress={() => randomPointCtx.showPoint(0, 100, 10)}></Button> */}

            <Modal visible={showTutorialLive} statusBarTranslucent transparent>
                <TouchableOpacity
                    onPress={() => finishTutorial()}
                    style={{
                        flex: 1,
                        backgroundColor: `${Colors.BLACK}60`,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            position: "absolute",
                            top: RatioUtil.lengthFixedRatio(44),
                            right: RatioUtil.width(10),
                        }}
                    >
                        <FastImage
                            source={TutorialBox.tutorial_2_1}
                            style={{
                                width: RatioUtil.width(240),
                                height: RatioUtil.heightFixedRatio(63),
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            resizeMode="contain"
                        >
                            <PretendText
                                style={{
                                    marginTop: RatioUtil.lengthFixedRatio(-10),
                                    color: Colors.WHITE,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    textAlign: "center",
                                }}
                            >
                                {/* 선수별 응원 순위를 확인하고 팬들과 함께 응원 대결을 펼치세요! */}
                                {jsonSvc.findLocalById("6019")}
                            </PretendText>
                        </FastImage>
                        {/* <View
                            style={{
                                justifyContent: "flex-end",
                                flexDirection: "row",
                                right: RatioUtil.width(60),
                                marginBottom: -2,
                            }}
                        >
                            <Svg height={RatioUtil.width(12)} width={RatioUtil.width(12)} viewBox="0 0 12 12">
                                <Polygon
                                    points="0 12 6 0 12 12"
                                    fill={`${Colors.BLACK}80`}
                                    stroke={Colors.WHITE}
                                    strokeWidth={2}
                                />
                            </Svg>
                        </View>
                        <View
                            style={{
                                width: RatioUtil.width(236),
                                padding: RatioUtil.lengthFixedRatio(10),
                                // height: RatioUtil.height(56),
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: RatioUtil.lengthFixedRatio(100),
                                backgroundColor: `${Colors.BLACK}80`,
                                borderColor: Colors.WHITE,
                                borderWidth: 2,
                            }}
                        >
                            <PretendText
                                style={{
                                    color: Colors.WHITE,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    textAlign: "center",
                                }}
                            >
                                {jsonSvc.findLocalById("6019")}
                            </PretendText>
                        </View> */}
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            bottom: RatioUtil.lengthFixedRatio(60),
                            right: RatioUtil.width(10),
                        }}
                    >
                        <FastImage
                            source={TutorialBox.tutorial_2_1}
                            style={{
                                width: RatioUtil.width(240),
                                height: RatioUtil.heightFixedRatio(64),
                                marginTop: RatioUtil.lengthFixedRatio(10),
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            resizeMode="contain"
                        >
                            <PretendText
                                style={{
                                    marginTop: RatioUtil.lengthFixedRatio(-8),
                                    color: Colors.WHITE,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    textAlign: "center",
                                }}
                            >
                                {/* 프로에게 후원하거나 하트를 보내고\n응원 점수를 올려보세요! */}
                                {jsonSvc.findLocalById("6020")}
                            </PretendText>
                        </FastImage>
                        {/* <View
                            style={{
                                width: RatioUtil.width(236),
                                padding: RatioUtil.lengthFixedRatio(10),
                                marginTop: RatioUtil.lengthFixedRatio(10),
                                // height: RatioUtil.height(56),
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: RatioUtil.lengthFixedRatio(100),
                                backgroundColor: `${Colors.BLACK}80`,
                                borderColor: Colors.WHITE,
                                borderWidth: 2,
                            }}
                        >
                            <PretendText
                                style={{
                                    color: Colors.WHITE,
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    textAlign: "center",
                                }}
                            >
                                {jsonSvc.findLocalById("6020")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                justifyContent: "flex-end",
                                flexDirection: "row",
                                right: RatioUtil.width(30),
                                marginTop: -2,
                            }}
                        >
                            <Svg height={RatioUtil.width(12)} width={RatioUtil.width(12)} viewBox="0 0 12 12">
                                <Polygon
                                    points="0,0 12,0 6,12"
                                    fill={`${Colors.BLACK}80`}
                                    stroke={Colors.WHITE}
                                    strokeWidth={2}
                                />
                            </Svg>
                        </View> */}
                    </View>
                </TouchableOpacity>
            </Modal>

            {showTutorialPopup ? (
                <CustomButton
                    onPress={() => {
                        setShowTutorialPopup(false)
                        tutorialProcess()
                    }}
                    style={{
                        ...RatioUtil.size(360, Platform.OS == "ios" ? 660 : 680),
                        position: "absolute",
                        bottom: 0,
                        backgroundColor: `${Colors.BLACK}90`,
                        zIndex: 1,
                    }}
                >
                    <BottomSheet
                        index={1}
                        backgroundComponent={MyBackdrop}
                        snapPoints={[RatioUtil.lengthFixedRatio(552), RatioUtil.lengthFixedRatio(552)]}
                        // onChange={handleSheetChanges}
                        handleComponent={null}
                        containerStyle={{ backgroundColor: "transparent" }}
                        style={{ backgroundColor: "transparent" }}
                    >
                        <View
                            style={{ flex: 1, justifyContent: "flex-end", bottom: 0, backgroundColor: "transparent" }}
                        >
                            <View style={{ ...RatioUtil.sizeFixedRatio(360, 552), backgroundColor: "transparent" }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Pressable
                                        style={{
                                            marginRight: RatioUtil.lengthFixedRatio(20),
                                            marginBottom: RatioUtil.lengthFixedRatio(15),
                                        }}
                                        onPress={() => {
                                            setShowTutorialPopup(false)
                                            tutorialProcess()
                                        }}
                                    >
                                        <PretendText
                                            style={{
                                                fontWeight: "500",
                                                color: Colors.WHITE,
                                                fontSize: RatioUtil.font(14),
                                                textShadowColor: "#00000030",
                                            }}
                                        >
                                            닫기
                                        </PretendText>
                                    </Pressable>
                                </View>
                                <View
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(360, 522),
                                        overflow: "hidden",
                                        borderTopLeftRadius: RatioUtil.width(15),
                                        borderTopRightRadius: RatioUtil.width(15),
                                        alignItems: "center",
                                        backgroundColor: Colors.WHITE,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: RatioUtil.width(360),
                                            height: RatioUtil.lengthFixedRatio(522),
                                            alignItems: "center",
                                        }}
                                    >
                                        <PretendText
                                            style={{
                                                fontSize: RatioUtil.font(24),
                                                fontWeight: RatioUtil.fontWeightBold(),
                                                color: Colors.BLACK,
                                                height: RatioUtil.lengthFixedRatio(31),
                                                marginTop: RatioUtil.lengthFixedRatio(50),
                                                textAlign: "center",
                                            }}
                                        >
                                            프로 응원하기
                                        </PretendText>
                                        <PretendText
                                            style={{
                                                fontSize: RatioUtil.font(16),
                                                color: "#8787BD",
                                                lineHeight: RatioUtil.font(16) * 1.3,
                                                height: RatioUtil.lengthFixedRatio(42),
                                                marginTop: RatioUtil.lengthFixedRatio(10),
                                                textAlign: "center",
                                            }}
                                        >
                                            리더보드 성적을 확인하며 팬들과 함께{"\n"}프로에게 후원하고 응원해보세요!
                                        </PretendText>
                                        <FastImage
                                            source={IntroImg.livecard01}
                                            style={{
                                                ...RatioUtil.sizeFixedRatio(360, 405),
                                                marginTop: RatioUtil.lengthFixedRatio(37),
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </BottomSheet>
                </CustomButton>
            ) : null}
        </SafeAreaView>
    )
}

export default LiveMain
