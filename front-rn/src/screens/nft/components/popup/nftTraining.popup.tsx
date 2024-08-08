import { jsonSvc, nftSvc } from "apis/services"
import { coninImg, nftDetailImg, radialCircleSliderImg } from "assets/images"
import { NotifiModal } from "components/Common/NottifiModal"
import { RadialSlider } from "components/RadialSlider"
import { CustomButton, PretendText } from "components/utils"
import { AnalyticsEventName, Colors } from "const"
import { useAsyncEffect, useWrapDispatch } from "hooks"
import React, { useEffect, useState } from "react"
import {
    BackHandler,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Shadow } from "react-native-shadow-2"
import { setPopUp, setToast } from "store/reducers/config.reducer"
import { nftStyle } from "styles/nft.style"
import { RatioUtil, checkStopNFT } from "utils"
import { WalletToast } from "./walletToast"
import { Analytics } from "utils/analytics.util"

interface INftTraining {
    levelPoint: number
    training: number
    max: number
    level: number
    nftseq: number
    setTrainingSuccess: any
    renderToggle: () => void
}

export const NftTraining = (props: INftTraining) => {
    let clicked = false
    const popupDispatch = useWrapDispatch(setPopUp)
    const toastDispatch = useWrapDispatch(setToast)
    const [focused, setFocused] = useState(false)
    const [levelPoint, setLevelPoint] = useState(props.levelPoint)
    const [sumInputValue, setSumInputValue] = useState(props.levelPoint)
    const [inputValue, setInputValue] = useState<number>(0)

    // const sliderStep = props.max / 100 // 1%당 값
    const numForShow = Math.floor(Number(inputValue) + levelPoint)
    const [loading, setLoading] = useState(false)
    const [isShowToastMessage, ShowToastMessage] = useState<boolean>(false)
    const [toastMessage, SetToastMessage] = useState<string>("")

    const insets = useSafeAreaInsets()

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                flex: 1,
            }}
        >
            <TouchableWithoutFeedback
                onPress={() => {
                    Keyboard.dismiss()
                }}
            >
                <View style={{ flex: 1 }}>
                    <View
                        style={[
                            nftStyle.nftModal.con,
                            {
                                height:
                                    insets.bottom +
                                    (focused
                                        ? Platform.OS === "ios"
                                            ? RatioUtil.lengthFixedRatio(385)
                                            : RatioUtil.lengthFixedRatio(427)
                                        : RatioUtil.lengthFixedRatio(400)),
                            },
                        ]}
                    >
                        <View
                            style={{
                                width: RatioUtil.width(360),
                                height: RatioUtil.lengthFixedRatio(52),
                                marginTop: RatioUtil.lengthFixedRatio(7),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(18),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                }}
                            >
                                {/* 프로 육성 */}
                                {jsonSvc.findLocalById("1011")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                width: RatioUtil.width(360),
                                height: RatioUtil.lengthFixedRatio(175),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <RadialSlider
                                subTitleStyle={{
                                    position: "absolute",
                                    color: Colors.BLACK,
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    lineHeight: RatioUtil.height(28),
                                    fontSize: RatioUtil.font(20),
                                    left: RatioUtil.width(30.8),
                                }}
                                linearGradient={[
                                    { offset: "0%", color: Colors.YELLOW15 },
                                    { offset: "100%", color: Colors.YELLOW16 },
                                ]}
                                titleStyle={{
                                    fontSize: RatioUtil.font(34),
                                    color: Colors.BLACK,
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    lineHeight: RatioUtil.height(47.6),
                                    marginRight: RatioUtil.width(1.02),
                                }}
                                value={numForShow}
                                thumbRadius={RatioUtil.width(18)}
                                thumbBorderWidth={0.2}
                                thumbColor={Colors.WHITE}
                                thumbBorderColor={Colors.BLACK}
                                title={props.level.toString()}
                                step={1}
                                subTitle={jsonSvc.findLocalById("1023")}
                                isHideValue={true}
                                min={0}
                                max={props.max}
                                isHideButtons={true}
                                isHideLines={true}
                                isHideTailText={true}
                                iconSource={radialCircleSliderImg.icon}
                                onChange={value => value != undefined && setInputValue(value - props.levelPoint)}
                                onComplete={async () => {
                                    await Analytics.logEvent(AnalyticsEventName.click_grow_gage_80, {
                                        hasNewUserData: true,
                                        first_action: "FALSE",
                                    })
                                }}
                                radius={RatioUtil.lengthFixedRatio(80)}
                                sliderWidth={RatioUtil.lengthFixedRatio(18)}
                            />
                        </View>
                        <View style={[nftStyle.nftModal.showNumcon, { height: RatioUtil.lengthFixedRatio(64) }]}>
                            <Shadow distance={2}>
                                <View
                                    style={{
                                        width: RatioUtil.width(320),
                                        height: RatioUtil.lengthFixedRatio(51),
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        borderRadius: 6,
                                        flexDirection: "row",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            position: "absolute",
                                            left: RatioUtil.width(20),
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {/* 육성 포인트 */}
                                        {jsonSvc.findLocalById("10000")}
                                    </PretendText>
                                    <Image
                                        source={coninImg.coinPointGradation}
                                        style={{
                                            width: RatioUtil.width(20),
                                            height: RatioUtil.width(20),
                                            marginRight: RatioUtil.width(21),
                                        }}
                                        resizeMode="contain"
                                    />
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(18),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: numForShow > props.levelPoint ? Colors.PURPLE : Colors.GRAY3,
                                        }}
                                    >
                                        {numForShow < props.levelPoint ? props.levelPoint : numForShow}&nbsp;
                                    </PretendText>
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(18),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: Colors.BLACK,
                                            marginRight: RatioUtil.lengthFixedRatio(20),
                                        }}
                                    >
                                        /&nbsp;{props.max}
                                    </PretendText>
                                </View>
                            </Shadow>
                        </View>
                        {focused ? (
                            <CustomButton
                                style={{
                                    width: RatioUtil.width(360),
                                    height: RatioUtil.lengthFixedRatio(54),
                                    backgroundColor: Colors.BLACK,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                onPress={() => {
                                    setSumInputValue(inputValue + props.levelPoint)
                                    setFocused(false)
                                    Keyboard.dismiss()
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(16),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                    }}
                                >
                                    {/* 확인 */}
                                    {jsonSvc.findLocalById("1012")}
                                </PretendText>
                            </CustomButton>
                        ) : (
                            <View
                                style={{
                                    flexDirection: "row",
                                    width: RatioUtil.width(360),
                                    height: RatioUtil.lengthFixedRatio(98),
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <CustomButton
                                    style={{
                                        marginLeft: RatioUtil.width(20),
                                        width: RatioUtil.width(108),
                                        height: RatioUtil.lengthFixedRatio(60),
                                        backgroundColor: Colors.GRAY,
                                        borderRadius: RatioUtil.width(100),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onPress={async () => {
                                        await Analytics.logEvent(AnalyticsEventName.click_cancel_80, {
                                            hasNewUserData: true,
                                            first_action: "FALSE",
                                        })
                                        popupDispatch({ open: false })
                                    }}
                                >
                                    <PretendText style={nftStyle.nftModal.btnText}>
                                        {/* 취소 */}
                                        {jsonSvc.findLocalById("1021")}
                                    </PretendText>
                                </CustomButton>

                                <CustomButton
                                    style={{
                                        marginLeft: RatioUtil.width(10),
                                        marginRight: RatioUtil.width(20),
                                        width: RatioUtil.width(202),
                                        height: RatioUtil.lengthFixedRatio(60),
                                        backgroundColor: inputValue ? Colors.BLACK : Colors.GRAY,
                                        borderRadius: RatioUtil.width(100),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    // disabled={numForShow <= props.levelPoint}
                                    onPress={async () => {
                                        if (numForShow <= props.levelPoint) {
                                            await Analytics.logEvent(AnalyticsEventName.click_disable_grow_80, {
                                                hasNewUserData: true,
                                                first_action: "FALSE",
                                            })
                                            return
                                        }
                                        if (clicked) return
                                        clicked = true
                                        if (checkStopNFT()) {
                                            popupDispatch({
                                                open: true,
                                                children: (
                                                    <NotifiModal
                                                        title={jsonSvc.findLocalById("10000025")}
                                                        // description={"NFT 이동은\n잠시 후 다시 진행 해 주세요"}
                                                        description={jsonSvc.findLocalById("10000063")}
                                                    />
                                                ),
                                            })
                                        } else {
                                            if (inputValue <= props.training && props.levelPoint < props.training) {
                                                await Analytics.logEvent(AnalyticsEventName.click_able_grow_80, {
                                                    hasNewUserData: true,
                                                    first_action: "FALSE",
                                                })
                                                await nftSvc.training({
                                                    seq: props.nftseq,
                                                    amount: Math.floor(inputValue + props.levelPoint),
                                                })
                                                popupDispatch({ open: false })
                                                props.renderToggle()
                                                // nft 육성포인트 모드 채운 후 육성 성공 플래그 전달
                                                if (props.levelPoint + inputValue === props.max) {
                                                    props.setTrainingSuccess(true)
                                                }
                                            } else {
                                                await Analytics.logEvent(AnalyticsEventName.view_point_shortage_80, {
                                                    hasNewUserData: true,
                                                    player_level: props.level,
                                                    need_levelpoint: props.max - (props.levelPoint + inputValue),
                                                })
                                                popupDispatch({
                                                    open: true,
                                                    children: (
                                                        <WalletToast
                                                            message={jsonSvc.findLocalById("10000001")}
                                                            image="NftDetailErrorSvg"
                                                        />
                                                    ),
                                                })
                                                setTimeout(() => {
                                                    popupDispatch({ open: false })
                                                }, 2000)
                                            }
                                        }
                                    }}
                                >
                                    <PretendText
                                        style={[
                                            nftStyle.nftModal.btnText,
                                            { color: inputValue ? Colors.WHITE : Colors.GRAY12 },
                                        ]}
                                    >
                                        {/* 육성 */}
                                        {jsonSvc.findLocalById("1024")}
                                    </PretendText>
                                </CustomButton>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>

            {isShowToastMessage && toastMessage && toastMessage.length > 0 && (
                <View
                    style={{
                        position: "absolute",
                        top: RatioUtil.height(30),
                        justifyContent: "center",
                        alignItems: "center",
                        width: RatioUtil.width(340),
                        height: RatioUtil.height(58),
                        marginHorizontal: RatioUtil.width(10),
                        backgroundColor: "#757575",
                        borderRadius: RatioUtil.width(10),
                        zIndex: 99999,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Image
                            source={nftDetailImg.error3}
                            style={{
                                ...RatioUtil.sizeFixedRatio(22, 22),
                                ...RatioUtil.marginFixedRatio(18, 15, 18, 20),
                            }}
                        />

                        <PretendText
                            style={{
                                width: RatioUtil.width(263),
                                marginVertical: RatioUtil.lengthFixedRatio(11),
                                marginRight: RatioUtil.width(20),
                                fontSize: RatioUtil.font(13),
                                lineHeight: RatioUtil.lengthFixedRatio(18),
                                color: Colors.WHITE,
                            }}
                        >
                            {jsonSvc.findLocalById("10000001")}
                        </PretendText>
                    </View>
                </View>
            )}
        </KeyboardAvoidingView>
    )
}
