import { ISeasonDetail } from "apis/data/season.data"
import { liveSvc } from "apis/services/live.svc"
import { liveImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { Colors } from "const"
import { useState, useEffect, useRef, useCallback } from "react"
import {
    Animated,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
} from "react-native"
import { RatioUtil } from "utils"
import { useWrapDispatch } from "./useWrapDispatch"
import { setToast } from "store/reducers/config.reducer"
import { BlurView } from "@react-native-community/blur"
import { jsonSvc } from "apis/services"
import { Modal } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgIcon } from "components/Common/SvgIcon"
import SoundPlayer from "react-native-sound-player"

const chatLiveTime = jsonSvc.findConstBynId("TV_CHATBOT_BOX_REMOVE_TIME_SEC").nIntValue * 1000
const chatBlinkTime = jsonSvc.findConstBynId("TV_CHATBOT_BOX_BLINK_TIME_SEC").nIntValue * 1000

export const useRandomPoint = ({
    gameData,
    assetBdst,
}: {
    gameData?: ISeasonDetail
    assetBdst: React.MutableRefObject<number | undefined>
}) => {
    const toastDispatch = useWrapDispatch(setToast)

    const fadeAnimRef = useRef(new Animated.Value(0)).current
    const blinkAnimRef = useRef(new Animated.Value(1)).current
    const blinkAnimation = useRef<Animated.CompositeAnimation | null>(null)
    const [toastOpen, setToastOpen] = useState(false)
    const [botData, setbotData] = useState<null | { seq: number; training: number; bdst: number }>(null)
    const [notifyMessage, setNotifyMessage] = useState<string | null>(null)
    const [boxPosX, setBoxPosX] = useState<number>(0)
    const [boxPosY, setBoxPosY] = useState<number>(0)

    const [botEventDatas, setBotEventDatas] = useState<{ seq: number; training: number; bdst: number }[]>([])
    const refBotEventDatas = useRef(botEventDatas)
    refBotEventDatas.current = botEventDatas

    const [botIdx, setIdx] = useState(-1)

    useEffect(() => {
        if (botData !== null) {
            const blinkTimeout = setTimeout(() => startBlink(), chatLiveTime - chatBlinkTime) // 5000
            const hideTimeout = setTimeout(() => {
                hidePoint()
                setIdx(prev => prev + 1)
            }, chatLiveTime) // 10000   chatLiveTime
            return () => {
                clearTimeout(blinkTimeout)
                clearTimeout(hideTimeout)
                // stopBlink()

                if (blinkAnimation.current)
                    blinkAnimation.current.stop()
            }
        }
    }, [botData])

    useEffect(() => {
        if (botEventDatas.length < 1)
            return

        if (botData === null)
            popupBotEvent()
    }, [botEventDatas])

    const startBlink = () => {
        blinkAnimation.current = Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnimRef, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnimRef, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            {
                iterations: -1,
            }
        )
        blinkAnimation.current.start()
    }

    // const stopBlink = () => {
    //     if (blinkAnimation.current) {
    //         blinkAnimation.current.stop()
    //         blinkAnimation.current = null
    //     }
    // }

    const getPoint = useCallback(async () => {
        if (!gameData || botData === null) return

        const data = await liveSvc.getChatBotReward(gameData.gameId, botData.seq)
        if (data) {
            if (!(assetBdst.current === undefined || assetBdst.current === null)) {
                assetBdst.current += data.USER_ASSET.BDST
            }

            setNotifyMessage(
                !botData.bdst
                    ? // ? `${botData.training} 육성 포인트\n획득하였습니다.`
                      // : `${botData.training} 육성 포인트\n${botData.bdst} BDST \n획득하였습니다.`
                      jsonSvc.formatLocal(jsonSvc.findLocalById("110018"), [botData.training.toString()])
                    : jsonSvc.formatLocal(jsonSvc.findLocalById("110019"), [
                          botData.training.toString(),
                          botData.bdst.toString(),
                      ])
            )
            showNotify()
            setToastOpen(true)
            setTimeout(() => {
                setToastOpen(false)
            }, 4000)
            hidePoint()

            try {
                console.log('play sound file: ui_01.wav')
                // play the file tone.mp3
                SoundPlayer.playSoundFile('ui_01', 'wav')
            } catch (e) {
                console.log('cannot play the sound file: ui_01 ', e)
            }
        }

        //hidePoint()
    }, [botData])

    const showNotify = () => {
        Animated.sequence([
            Animated.timing(fadeAnimRef, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.delay(500),
            Animated.timing(fadeAnimRef, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => setIdx(idx => idx + 1))
    }

    const insets = useSafeAreaInsets()

    const popupBotEvent = () => {
        if (refBotEventDatas.current.length < 1)
            return

        const eventData = refBotEventDatas.current[0]

        //setBoxPosX(RatioUtil.width(20) + RatioUtil.width(Math.floor(Math.random() * RatioUtil.width(240))))
        //setBoxPosY(insets.top + RatioUtil.heightSafeArea(40) + RatioUtil.heightSafeArea(Math.floor(Math.random() * RatioUtil.heightSafeArea(108))))

        setBoxPosX(RatioUtil.width(263))
        setBoxPosY(insets.top + RatioUtil.heightSafeArea(40) + RatioUtil.heightSafeArea(226))

        blinkAnimRef.setValue(1)
        setbotData(eventData)
        setBotEventDatas(prev => prev.slice(1, prev.length))

        try {
            console.log('play sound file: ui_02.wav')
            // play the file tone.mp3
            SoundPlayer.playSoundFile('ui_02', 'wav')
        } catch (e) {
            console.log('cannot play the sound file: ui_02 ', e)
        }
    }

    const showPoint = (seq: number, training: number, bdst: number) => {
        setBotEventDatas(prev => [...prev, {seq, training, bdst}])
    }
    const showPoints = (points: {seq: number, training: number, bdst: number}[]) => {
        setBotEventDatas(prev => [...prev, ...points])
    }

    const hidePoint = () => {
        if (blinkAnimation.current)
            blinkAnimation.current.stop()

        setbotData(null)
        popupBotEvent()
        // stopBlink()
    }

    const renderNotify = useCallback(
        () => (
            <View style={{ flex: 1, height: RatioUtil.width(58) }}>
                <Modal statusBarTranslucent transparent visible={toastOpen}>
                    <CustomButton
                        onPress={() => {
                            toastDispatch({ open: false })
                        }}
                        style={{
                            width: RatioUtil.width(360),
                            height: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                width: RatioUtil.width(360),
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <BlurView
                                style={[
                                    styles.notifyEarnPointCon,
                                    {
                                        borderRadius: RatioUtil.width(15),
                                    },
                                ]}
                                overlayColor="rgba(0,0,0,0.2)"
                            />
                            <View
                                style={{
                                    position: "absolute",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    width: RatioUtil.width(144),
                                    height: RatioUtil.height(170),
                                    borderRadius: RatioUtil.width(15),
                                }}
                            >
                                <Image
                                    source={liveImg.checkbox}
                                    style={{ ...RatioUtil.size(40, 40), marginBottom: RatioUtil.height(10) }}
                                    resizeMode="contain"
                                />
                                <View>
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            textAlign: "center",
                                        }}
                                    >
                                        {notifyMessage}
                                    </PretendText>
                                </View>
                            </View>
                        </View>
                    </CustomButton>
                </Modal>
            </View>
        ),
        [botData, toastOpen]
    )

    const renderPoint = () => {
        if (!botData)
            return null

        return (
            <TouchableOpacity
                onPress={() => getPoint()}
                style={{
                    position: "absolute",
                    top: boxPosY,
                    left: boxPosX,
                    zIndex: 1,
                    ...RatioUtil.sizeFixedRatio(80, 80),
                }}
            >
                <Animated.View
                    style={{
                        opacity: blinkAnimRef,
                        ...styles.animatedCon,
                    }}
                    pointerEvents="box-none"
                >
                    <View
                        style={{
                            backgroundColor: Colors.BLACK,
                            borderRadius: RatioUtil.width(5),
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: RatioUtil.width(-6),
                        }}
                    >
                        <PretendText
                            style={{
                                color: Colors.WHITE,
                                fontSize: RatioUtil.font(12),
                                fontWeight: RatioUtil.fontWeightBold(),
                                paddingVertical: RatioUtil.heightFixedRatio(5),
                                paddingHorizontal: RatioUtil.width(8),
                                //minWidth: RatioUtil.width(70)
                            }}
                            numberOfLines={1}
                        >보상 획득!</PretendText>
                    </View>
                    <SvgIcon name={"ArrowDownBlack"} width={RatioUtil.width(12)} height={RatioUtil.heightFixedRatio(7)}
                        style={{
                            marginLeft: RatioUtil.width(-6),
                            marginTop: RatioUtil.heightSafeArea(-1)
                        }} />
                    <Image source={liveImg.randomGift} style={{ ...RatioUtil.sizeFixedRatio(80, 80), marginTop: RatioUtil.heightSafeArea(-6) }} resizeMode="contain" />
                </Animated.View>
            </TouchableOpacity>
        )
    }

    return {
        getPoint,
        renderNotify,
        showPoint,
        showPoints,
        renderPoint,
        botIdx,
        setIdx,
    }
}

const styles = StyleSheet.create({
    animatedCon: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        width: "100%",
        zIndex: 9999,
    },
    notifyEarnPointCon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...RatioUtil.padding(5, 10, 5, 10),
        width: RatioUtil.width(144),
        height: RatioUtil.height(170),
    },
})
