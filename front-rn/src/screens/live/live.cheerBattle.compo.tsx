import { liveImg, mainHeaderImg, myPageImg, nftDetailImg, profileHeaderImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { Dimension, Screen } from "const"
import { useCallback, useEffect, useRef, useState, memo } from "react"
import { Button, Platform, Pressable, TouchableOpacity, View, ViewStyle, ScrollView, Image } from "react-native"
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
    interpolate,
    AnimatableValue,
    runOnJS,
    runOnUI,
} from "react-native-reanimated"
import { ArrayUtil, ConfigUtil, NumberUtil, RatioUtil, TextUtil, navigate } from "utils"
import produce from "immer"
import { Colors } from "const"
import { useKeyboardVisible, useQuery, useToggle, useWrapDispatch } from "hooks"
import { setPopUp } from "store/reducers/config.reducer"
import GestureRecognizer from "react-native-swipe-gestures"
import { LayoutStyle, liveGeneral, mineCompoStyle } from "styles"
import nftPlayerJson from "json/nft_player.json"
import { jsonSvc, nftSvc, rankSvc } from "apis/services"
import { IRankList } from "./live.cheerBattle"
import LinearGradient from "react-native-linear-gradient"
import { isEqual } from "lodash"
import FastImage from "react-native-fast-image"

export const Header = ({ rankList }: { rankList: IRankList[] }) => {
    const handleBackPress = () => navigate(Screen.BACK)

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                // alignItems: "center",
                marginRight: RatioUtil.width(10),
                marginLeft: RatioUtil.width(10),
                width: RatioUtil.width(340),
                height: RatioUtil.lengthFixedRatio(44),
                zIndex: 9999,
            }}
        >
            <Pressable
                style={{
                    marginLeft: RatioUtil.lengthFixedRatio(5),
                    ...RatioUtil.sizeFixedRatio(30, 44),
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onPress={handleBackPress}
            >
                {/* <Image
                    resizeMode="contain"
                    style={{ width: RatioUtil.lengthFixedRatio(12), height: RatioUtil.lengthFixedRatio(18) }}
                    source={profileHeaderImg.arrow}
                /> */}
                <SvgIcon name="BackSvg" />
            </Pressable>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: RatioUtil.lengthFixedRatio(10),
                    height: RatioUtil.lengthFixedRatio(44),
                }}
            >
                <RollingPlayer rankList={rankList} />

                <Image
                    source={liveImg.searchIcon}
                    style={{
                        marginLeft: RatioUtil.lengthFixedRatio(3),
                        height: RatioUtil.lengthFixedRatio(20),
                        width: RatioUtil.lengthFixedRatio(20),
                    }}
                    resizeMode="contain"
                />
            </View>
        </View>
    )
}
export const RollingPlayer = ({ rankList }: { rankList: IRankList[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const currentData = rankList[currentIndex]
    const prevRankListRef = useRef<IRankList[]>([])

    const rollingProcess = useSharedValue(0)

    const animate = () => {
        rollingProcess.value = withTiming(
            -1,
            {
                duration: 2700,
                easing: Easing.ease,
            },
            (finished?: boolean, current?: AnimatableValue) => {
                if (finished) {
                    runOnJS(rollingPlayer)()
                }
            }
        )
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(rollingProcess.value, [-1, -0.5, 0, 0.5, 1], [-5, -2.5, 0, 2.5, 5]),
                },
            ],
            opacity: interpolate(rollingProcess.value, [-1, -0.5, 0, 0.5, 1], [0, 0.8, 1, 0.8, 0]),
        }
    })

    useEffect(() => {
        rollingProcess.value = 0
        animate()
    }, [currentIndex])

    const rollingPlayer = () => {
        setCurrentIndex(prevCount => (prevCount + 1 < rankList.length ? prevCount + 1 : 0))
    }

    useEffect(() => {
        let intervalId: NodeJS.Timer | undefined

        if (rankList.length > 1) {
            if (!isEqual(rankList, prevRankListRef.current)) {
                prevRankListRef.current = rankList
                setCurrentIndex(0)
            }
        }

        animate()

        return () => clearInterval(intervalId)
    }, [rankList])

    return currentData ? (
        <View>
            <Animated.View
                style={[
                    {
                        flexDirection: "row",
                        // height: 10,
                    },
                    animatedStyle,
                ]}
            >
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(12),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: Colors.GRAY2,
                        marginRight: RatioUtil.width(2),
                    }}
                >
                    {currentData.cheerRank}위
                </PretendText>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(12),
                        color: Colors.GRAY2,
                        marginRight: RatioUtil.width(5),
                    }}
                >
                    {currentData.info?.sPlayerName ?? ""}
                </PretendText>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(12),

                        color: Colors.GRAY2,
                    }}
                >
                    {NumberUtil.denoteComma(currentData.cheerScore)}
                </PretendText>
            </Animated.View>
        </View>
    ) : null
}
export const SearchPlayer = ({
    rankList,
    setSelectIndex,
}: {
    rankList: IRankList[]
    setSelectIndex: React.Dispatch<React.SetStateAction<number>>
}) => {
    const popupDispatch = useWrapDispatch(setPopUp)
    const [select, setselect] = useState<number>(0)
    const isVisible = useKeyboardVisible()
    const [isSwipeUp, setisSwipeUp] = useState(false)

    const [buttonProps, setButtonProps] = useState({
        confirm: {
            ...RatioUtil.sizeFixedRatio(320, 60),
            ...RatioUtil.borderRadius(30),
            backgroundColor: Colors.BLACK,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: RatioUtil.width(10),
        } as ViewStyle,
        cancel: {
            ...RatioUtil.sizeFixedRatio(320, 60),
            ...RatioUtil.borderRadius(30),
            backgroundColor: Colors.GRAY7,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
        } as ViewStyle,
    })

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

    const first = () => {
        if (isVisible) {
            setButtonProps(state =>
                produce(state, draft => {
                    draft.confirm = {
                        ...state.confirm,
                        width: RatioUtil.width(360),
                        ...RatioUtil.borderRadius(0),
                    }
                    draft.cancel.display = "none"
                })
            )

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
            setButtonProps(state =>
                produce(state, draft => {
                    draft.confirm = {
                        ...state.confirm,
                        width: RatioUtil.width(320),
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
                    height: RatioUtil.height(460),
                    marginTop: RatioUtil.height(280),
                    top: RatioUtil.height(330),
                }
            }
        }
    }

    useEffect(() => {
        first()
    }, [isVisible, isSwipeUp])

    const onSelect = (v: number) => {
        setselect(v)
    }
    const onClose = () => {
        popupDispatch({ open: false })
    }
    const onConfirm = () => {
        setSelectIndex(select)
        if (select) popupDispatch({ open: false })
        else return
    }

    if (!rankList.length) return <></>

    const handleSwipeUp = () => setisSwipeUp(true)
    const handleClosePress = () => popupDispatch({ open: false })

    return (
        <Animated.View
            style={[
                {
                    backgroundColor: Colors.WHITE,
                    ...RatioUtil.borderRadius(10, 10),
                    width: RatioUtil.width(360),
                    position: "absolute",
                    bottom: 0,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                },
                animatedStyle,
            ]}
        >
            <GestureRecognizer
                onSwipeDown={onClose}
                onSwipeUp={handleSwipeUp}
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
                </View>
                <CustomButton
                    style={{
                        position: "absolute",
                        right: 0,
                    }}
                    onPress={handleClosePress}
                >
                    <Image
                        source={nftDetailImg.close}
                        style={{
                            width: RatioUtil.width(30),
                            height: RatioUtil.width(30),
                        }}
                    />
                </CustomButton>
            </GestureRecognizer>

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
                    // minHeight: isSwipeUp ? "50%" : undefined,
                }}
                scrollEnabled={true}
            >
                {rankList && rankList.length > 0 ? (
                    rankList.map((v, i) => (
                        <CustomButton
                            key={v.playerCode}
                            style={{
                                ...RatioUtil.sizeFixedRatio(320, 70),
                                ...RatioUtil.marginFixedRatio(0, (i + 1) % 3 === 0 ? 0 : 8.5, 8, 0),
                                alignSelf: "center",
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexDirection: "row",
                                borderRadius: RatioUtil.width(10),
                                backgroundColor: Colors.GRAY9,
                                borderColor: select === v.playerCode ? Colors.BLUE : Colors.WHITE,
                                borderWidth: 1,
                            }}
                            onPress={() => onSelect(v.playerCode)}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <PretendText
                                    style={{
                                        marginLeft: RatioUtil.width(20),
                                        marginRight: RatioUtil.width(15),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        color: i < 3 ? Colors.PURPLE7 : Colors.GRAY3,
                                    }}
                                >
                                    {v.cheerRank}
                                </PretendText>
                                <FastImage
                                    source={{
                                        uri: ConfigUtil.getPlayerImage(
                                            nftSvc.getNftPlayer(v.playerCode)?.sPlayerImagePath
                                        ),
                                    }}
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(42, 42),
                                        borderRadius: 50,
                                        marginRight: RatioUtil.width(8),
                                    }}
                                />
                                <View>
                                    <PretendText
                                        style={{
                                            marginBottom: RatioUtil.lengthFixedRatio(3),
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                        }}
                                    >
                                        {TextUtil.ellipsis(v.info?.sPlayerName ?? "")}
                                    </PretendText>
                                    <PretendText style={{ fontSize: RatioUtil.font(12) }}>
                                        {NumberUtil.denoteComma(v.cheerScore)}
                                    </PretendText>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    marginRight: RatioUtil.width(20),
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: "center",
                                        marginRight: RatioUtil.width(10),
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            marginBottom: RatioUtil.lengthFixedRatio(3),
                                            fontSize: RatioUtil.font(12),
                                            color: Colors.GRAY8,
                                        }}
                                    >
                                        {/* 하트점수 */}
                                        {jsonSvc.findLocalById("150015")}
                                    </PretendText>
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(12),
                                            color: Colors.GRAY8,
                                        }}
                                    >
                                        {NumberUtil.denoteComma(v.heartScore)}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        alignItems: "center",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            marginBottom: RatioUtil.lengthFixedRatio(3),
                                            fontSize: RatioUtil.font(12),
                                            color: Colors.GRAY8,
                                        }}
                                    >
                                        {/* 후원금액 */}
                                        {jsonSvc.findLocalById("150014")}
                                    </PretendText>
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(12),
                                            color: Colors.GRAY8,
                                        }}
                                    >
                                        {NumberUtil.denoteComma(v.donateScore)}
                                    </PretendText>
                                </View>
                            </View>
                        </CustomButton>
                    ))
                ) : (
                    <View
                        style={{
                            width: RatioUtil.width(320),
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            height: RatioUtil.lengthFixedRatio(100),
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                color: Colors.GRAY8,
                                textAlign: "center",
                            }}
                        >
                            {/* 순위 없음 */}
                            {jsonSvc.findLocalById("150060")}
                        </PretendText>
                    </View>
                )}
            </ScrollView>
            <View style={{ marginTop: RatioUtil.lengthFixedRatio(100) }} />
            <View
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                        position: "absolute",
                        bottom: 0,
                        marginBottom: RatioUtil.lengthFixedRatio(20),
                    },
                ]}
            >
                <CustomButton onPress={onConfirm} style={select ? buttonProps.confirm : buttonProps.cancel}>
                    <PretendText
                        style={{
                            color: select ? Colors.WHITE : Colors.GRAY12,
                            fontSize: RatioUtil.font(16),
                        }}
                    >
                        {/* 확인 */}
                        {jsonSvc.findLocalById("10010000")}
                    </PretendText>
                </CustomButton>
            </View>
        </Animated.View>
    )
}

export const SelectedPlayer = memo(({ left, right }: { left: IRankList | null; right: IRankList | null }) => {
    if (!left && !right)
        return (
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: RatioUtil.lengthFixedRatio(360),
                    height: RatioUtil.lengthFixedRatio(146),
                }}
            >
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(14),
                    }}
                >
                    응원 정보가 없습니다
                </PretendText>
            </View>
        )

    const animValue = useSharedValue(0)

    const animate = () => {
        animValue.value = withTiming(1, {
            duration: 500,
            easing: Easing.linear,
        })
    }

    const leftAnimStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(animValue.value, [0, 1], [-50, 0]),
                },
            ],
            opacity: interpolate(animValue.value, [0, 1], [0, 1]),
        }
    })
    const rightAnimStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: interpolate(animValue.value, [0, 1], [50, 0]),
                },
            ],
            opacity: interpolate(animValue.value, [0, 1], [0, 1]),
        }
    })

    const leftTextAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(animValue.value, [0, 1], [0, 1]),
        }
    })
    const rightTextAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(animValue.value, [0, 1], [0, 1]),
        }
    })

    useEffect(() => {
        animate()
    }, [left?.info?.nPersonID, right?.info?.nPersonID])

    return (
        <View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                {left && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Animated.View style={leftAnimStyle}>
                            <FastImage
                                style={{
                                    width: RatioUtil.lengthFixedRatio(177),
                                    height: RatioUtil.lengthFixedRatio(217),
                                    marginLeft: RatioUtil.lengthFixedRatio(-52),
                                    marginTop: RatioUtil.lengthFixedRatio(-49),
                                }}
                                source={{
                                    uri: ConfigUtil.getPlayerImage(left.info?.sPlayerImagePath ?? ""),
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </Animated.View>

                        <Animated.View
                            style={[
                                {
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    marginTop: RatioUtil.lengthFixedRatio(13),
                                    marginLeft: RatioUtil.lengthFixedRatio(-18),
                                },
                                leftTextAnimStyle,
                            ]}
                        >
                            <PretendText
                                style={{
                                    color: Colors.PURPLE,
                                    fontSize: RatioUtil.font(18),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    opacity: 0.3,
                                    marginBottom: RatioUtil.lengthFixedRatio(2),
                                    height: RatioUtil.lengthFixedRatio(23),
                                    textAlign: "left",
                                }}
                            >
                                {/* 응원 순위 */}
                                {`${left.cheerRank}위`}
                            </PretendText>
                            <PretendText
                                style={{
                                    color: Colors.BLACK,
                                    fontSize: RatioUtil.font(20),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    marginBottom: RatioUtil.lengthFixedRatio(14),
                                    height: RatioUtil.lengthFixedRatio(26),
                                    textAlign: "left",
                                }}
                            >
                                {/* 선수 이름 */}
                                {TextUtil.ellipsis(nftSvc.getNftPlayer(left.playerCode)?.sPlayerName ?? "")}
                            </PretendText>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    height: RatioUtil.lengthFixedRatio(18),
                                    marginBottom: RatioUtil.lengthFixedRatio(4),
                                }}
                            >
                                <Image
                                    source={liveImg.cheerHeart}
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(12),
                                        height: RatioUtil.lengthFixedRatio(12),
                                    }}
                                    resizeMode="contain"
                                />

                                <PretendText
                                    style={{
                                        color: Colors.GRAY8,
                                        fontSize: RatioUtil.font(14),
                                        marginLeft: RatioUtil.width(4),
                                        textAlign: "left",
                                    }}
                                >
                                    {/* 하트 수 */}
                                    {NumberUtil.denoteComma(left.heartScore)}
                                </PretendText>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    height: RatioUtil.lengthFixedRatio(18),
                                }}
                            >
                                <Image
                                    source={liveImg.cheerWon}
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(14),
                                        height: RatioUtil.lengthFixedRatio(14),
                                    }}
                                    resizeMode="contain"
                                />

                                <PretendText
                                    style={{
                                        color: Colors.GRAY8,
                                        fontSize: RatioUtil.font(14),
                                        marginLeft: RatioUtil.width(4),
                                        textAlign: "left",
                                    }}
                                >
                                    {/* 후원 금액 */}
                                    {NumberUtil.unitTransferFloat(left.donateScore)}
                                </PretendText>
                            </View>
                        </Animated.View>
                    </View>
                )}
                <PretendText
                    style={{
                        color: Colors.PURPLE,
                        fontSize: RatioUtil.font(16),
                        fontWeight: RatioUtil.fontWeightBold(),
                        opacity: 0.3,
                        position: "absolute",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        marginTop: RatioUtil.lengthFixedRatio(14),
                    }}
                >
                    {/* 응원대결 */}
                    {jsonSvc.findLocalById("7015")}
                </PretendText>

                {right && (
                    <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
                        <Animated.View
                            style={[
                                {
                                    alignItems: "flex-end",
                                    justifyContent: "flex-start",
                                    marginTop: RatioUtil.lengthFixedRatio(13),
                                    marginRight: RatioUtil.lengthFixedRatio(-18),
                                },
                                rightTextAnimStyle,
                            ]}
                        >
                            <PretendText
                                style={{
                                    color: Colors.PURPLE,
                                    fontSize: RatioUtil.font(18),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    opacity: 0.3,
                                    marginBottom: RatioUtil.lengthFixedRatio(2),
                                    height: RatioUtil.lengthFixedRatio(23),
                                    textAlign: "right",
                                }}
                            >
                                {/* 응원 순위 */}
                                {`${right.cheerRank}위`}
                            </PretendText>
                            <PretendText
                                style={{
                                    color: Colors.BLACK,
                                    fontSize: RatioUtil.font(20),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    marginBottom: RatioUtil.lengthFixedRatio(14),
                                    height: RatioUtil.lengthFixedRatio(26),
                                    textAlign: "right",
                                }}
                            >
                                {/* 선수 이름 */}

                                {TextUtil.ellipsis(nftSvc.getNftPlayer(right.playerCode)?.sPlayerName ?? "")}
                            </PretendText>

                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    height: RatioUtil.lengthFixedRatio(18),
                                    marginBottom: RatioUtil.lengthFixedRatio(4),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.GRAY8,
                                        fontSize: RatioUtil.font(14),
                                        marginRight: RatioUtil.width(4),
                                        textAlign: "right",
                                    }}
                                >
                                    {/* 하트 수 */}
                                    {NumberUtil.denoteComma(right.heartScore)}
                                </PretendText>

                                <Image
                                    source={liveImg.cheerHeart}
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(12),
                                        height: RatioUtil.lengthFixedRatio(12),
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    height: RatioUtil.lengthFixedRatio(18),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.GRAY8,
                                        fontSize: RatioUtil.font(14),
                                        marginRight: RatioUtil.width(4),
                                        textAlign: "right",
                                    }}
                                >
                                    {/* 후원 금액 */}
                                    {NumberUtil.unitTransferFloat(right.donateScore)}
                                </PretendText>

                                <Image
                                    source={liveImg.cheerWon}
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(14),
                                        height: RatioUtil.lengthFixedRatio(14),
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                        </Animated.View>

                        <Animated.View style={rightAnimStyle}>
                            <FastImage
                                style={{
                                    width: RatioUtil.lengthFixedRatio(177),
                                    height: RatioUtil.lengthFixedRatio(217),
                                    marginRight: RatioUtil.width(-52),
                                    marginTop: RatioUtil.lengthFixedRatio(-49),
                                }}
                                source={{
                                    uri: ConfigUtil.getPlayerImage(right.info?.sPlayerImagePath ?? ""),
                                }}
                            />
                        </Animated.View>
                    </View>
                )}
            </View>

            <View
                style={{
                    position: "absolute",
                    bottom: -RatioUtil.lengthFixedRatio(20),
                }}
            >
                <Image
                    source={liveImg.underBackground}
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.lengthFixedRatio(80),
                    }}
                />
            </View>
        </View>
    )
})

import AnimatedNum from "components/utils/AnimatedNum"
import { SvgIcon } from "components/Common/SvgIcon"
export const RankProgress = memo(({ left, right }: { left?: number; right?: number }) => {
    if (!left || !right) {
        return null
    }

    const progressRatio = left && right ? left / (left + right) : left && !right ? 1 : 0.5

    const leftBar = useSharedValue(progressRatio * RatioUtil.width(360))

    const animate = () => {
        leftBar.value = withTiming(progressRatio * RatioUtil.width(360), {
            duration: 500,
        })
    }

    useEffect(() => {
        animate()
    }, [progressRatio])

    return (
        <View style={{ flexDirection: "row", position: "absolute", bottom: 0, width: RatioUtil.width(360) }}>
            {/* <View style={{ position: "absolute", top: 100, zIndex: 9999 }}>
                <Button title="test" onPress={() => setFlag(!flag)}></Button>
            </View> */}
            <Animated.View style={{ width: leftBar, height: RatioUtil.lengthFixedRatio(30) }}>
                <LinearGradient
                    colors={["#5465FF", "#9FA9FF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1, height: "100%" }}
                />
            </Animated.View>

            <Animated.View
                style={{ width: "100%"/*RatioUtil.width(360) - leftBar.value*/, height: RatioUtil.lengthFixedRatio(30) }}
            >
                <LinearGradient
                    colors={["#BCB6FF", "#CECAFF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ flex: 1, height: "100%" }}
                />
            </Animated.View>
            <View style={{ position: "absolute", bottom: RatioUtil.lengthFixedRatio(7) }}>
                {/* <PretendText
                    style={{ color: Colors.WHITE, fontSize: RatioUtil.font(16), marginLeft: RatioUtil.width(15) }}
                >
                    {left ? NumberUtil.denoteComma(left) : 0}
                </PretendText> */}

                <AnimatedNum
                    includeComma
                    animateToNumber={left ?? 0}
                    fontStyle={{
                        color: Colors.WHITE,
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                    }}
                    animationDuration={800}
                    style={{ marginLeft: RatioUtil.lengthFixedRatio(20) }}
                />
            </View>
            <View style={{ position: "absolute", bottom: RatioUtil.lengthFixedRatio(7), right: 0 }}>
                <AnimatedNum
                    includeComma
                    animateToNumber={right ?? 0}
                    fontStyle={{
                        color: Colors.WHITE,
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                    }}
                    animationDuration={800}
                    style={{ marginRight: RatioUtil.lengthFixedRatio(20) }}
                />
            </View>
        </View>
    )
})
