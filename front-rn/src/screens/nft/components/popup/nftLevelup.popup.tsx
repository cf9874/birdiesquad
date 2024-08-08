import React from "react"
import { Image, ImageBackground, View } from "react-native"
import { ConfigUtil, NumberUtil, RatioUtil } from "utils"
import { homeImg, mainHeaderImg, nftDetailImg } from "assets/images"
import { AnalyticsEventName, Colors } from "const"
import { nftGStyle, nftStyle } from "styles/nft.style"
import { CustomButton, PretendText } from "components/utils"
import { useWrapDispatch } from "hooks"
import { setModal, setPopUp, setToast } from "store/reducers/config.reducer"
import { jsonSvc, nftSvc } from "apis/services"
import json from "json/nft_upgrade.json"
import playerJson from "json/nft_player.json"
import { WalletToast } from "./walletToast"
import { Shadow } from "react-native-shadow-2"
import { NftImage } from "../nftImage"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { RotationGesture } from "react-native-gesture-handler/lib/typescript/handlers/gestures/rotationGesture"
import { BlurView } from "@react-native-community/blur"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import { mineCompoStyle } from "styles"
import { Analytics } from "utils/analytics.util"

interface INftLevelUp {
    level: number
    nftseq: number
    bdst: number
    grade: number
    birdie: number
    playerCode: number
    renderToggle: () => void
    setModalStatus?: React.Dispatch<React.SetStateAction<boolean>>
}
export const NftLevelUp = (props: INftLevelUp) => {
    let clicked = false
    const token = jsonSvc.findUpgradeByLevelAndGrade(props.level + 1, props.grade)

    const modalDispatch = useWrapDispatch(setModal)
    const popupDispatch = useWrapDispatch(setPopUp)
    const toastDispatch = useWrapDispatch(setToast)

    const insets = useSafeAreaInsets()

    return (
        <View style={{ flex: 1 }}>
            <View style={[nftStyle.nftModal.con, { height: RatioUtil.lengthFixedRatio(453) + insets.bottom }]}>
                <View
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.lengthFixedRatio(54),
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
                        {/* 선수 레벨업 */}
                        {jsonSvc.findLocalById("1025")}
                    </PretendText>
                </View>
                <View style={nftStyle.nftModal.playerCardcon}>
                    <NftImage
                        playerCode={props.playerCode}
                        grade={props.grade}
                        birdie={props.birdie}
                        level={props.level}
                    />

                    <View style={nftStyle.nftModal.playerLvBox}>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                fontWeight: "500",
                                color: "#3F3F44",
                            }}
                        >
                            {jsonSvc.formatLocal(jsonSvc.findLocalById("1026"), [props.level.toString()])}
                        </PretendText>
                        <Image
                            source={nftDetailImg.arrow}
                            style={{
                                marginLeft: RatioUtil.width(15),
                                marginRight: RatioUtil.width(15),
                                width: RatioUtil.lengthFixedRatio(24),
                                height: RatioUtil.lengthFixedRatio(24),
                            }}
                        />
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                fontWeight: "500",
                                color: Colors.PURPLE,
                            }}
                        >
                            {/* LV {props.level + 1} */}
                            {jsonSvc.formatLocal(jsonSvc.findLocalById("1026"), [(props.level + 1).toString()])}
                        </PretendText>
                    </View>
                </View>

                <View style={[nftStyle.nftModal.showNumcon, { height: RatioUtil.lengthFixedRatio(64) }]}>
                    <Shadow distance={2}>
                        <View
                            style={{
                                width: RatioUtil.width(320),
                                height: RatioUtil.lengthFixedRatio(51),
                                alignItems: "center",
                                borderRadius: 6,
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <PretendText
                                style={{
                                    marginLeft: RatioUtil.width(20),
                                    fontSize: RatioUtil.font(14),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                }}
                            >
                                {jsonSvc.findLocalById("1006")}
                            </PretendText>
                            <View style={{ flexDirection: "row" }}>
                                <Image
                                    source={mainHeaderImg.point}
                                    style={{
                                        resizeMode: "contain",
                                        width: RatioUtil.width(20),
                                        height: RatioUtil.width(20),
                                        marginRight: RatioUtil.width(10),
                                    }}
                                />
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(16),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        marginRight: RatioUtil.width(20),
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {NumberUtil.denoteComma(Number(token?.nRequiredToken))}
                                </PretendText>
                            </View>
                        </View>
                    </Shadow>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        width: RatioUtil.width(360),
                        height: RatioUtil.lengthFixedRatio(97),
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CustomButton
                        style={{
                            marginLeft: RatioUtil.width(20),
                            marginRight: RatioUtil.width(10),
                            width: RatioUtil.width(108),
                            height: RatioUtil.lengthFixedRatio(60),
                            backgroundColor: Colors.GRAY,
                            borderRadius: RatioUtil.width(100),
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={async () => {
                            await Analytics.logEvent(AnalyticsEventName.click_cancel_75, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                            popupDispatch({ open: false })
                            props.renderToggle()
                        }}
                    >
                        <PretendText style={nftStyle.nftModal.btnText}>{jsonSvc.findLocalById("1021")}</PretendText>
                    </CustomButton>
                    <CustomButton
                        style={{
                            marginRight: RatioUtil.width(20),
                            width: RatioUtil.width(202),
                            height: RatioUtil.lengthFixedRatio(60),
                            backgroundColor: Colors.BLACK,
                            borderRadius: RatioUtil.width(100),
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onPress={async () => {
                            if (clicked) return
                            clicked = true
                            if (props.bdst >= token?.nRequiredToken) {
                                popupDispatch({ open: false })
                                await Analytics.logEvent(AnalyticsEventName.click_levelup_start_85, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                    player_grade: props.grade,
                                    player_level: props.level,
                                })
                                await nftSvc.levelup(props.nftseq)
                                props.setModalStatus(true)
                                props.renderToggle()
                                setTimeout(() => {
                                    modalDispatch({
                                        open: true,
                                        children: (
                                            <CustomButton
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    justifyContent: "center",
                                                    alignContent: "center",
                                                }}
                                            >
                                                <View
                                                    style={{
                                                        overflow: "hidden",
                                                        alignSelf: "center",
                                                        borderRadius: RatioUtil.width(10),
                                                        ...RatioUtil.size(144, 170),
                                                    }}
                                                >
                                                    <BlurView
                                                        style={{ ...RatioUtil.size(144, 170) }}
                                                        blurType="dark"
                                                        blurRadius={23}
                                                    />
                                                    <View
                                                        style={{
                                                            position: "relative",
                                                            alignItems: "center",
                                                            bottom: RatioUtil.height(125),
                                                        }}
                                                    >
                                                        <AnimatedLottieView
                                                            source={lotties.check}
                                                            style={{
                                                                width: RatioUtil.font(48),
                                                                height: RatioUtil.font(48),
                                                            }}
                                                            autoPlay
                                                            loop={false}
                                                        />
                                                        <PretendText
                                                            style={[
                                                                mineCompoStyle.editCompleteModal.text,
                                                                {
                                                                    textAlign: "center",
                                                                },
                                                            ]}
                                                        >
                                                            {/* 레벨 업 성공! */}
                                                            {jsonSvc.findLocalById("SUCCESS_LEVELUP")}
                                                        </PretendText>
                                                    </View>
                                                </View>
                                            </CustomButton>
                                        ),
                                    })
                                    setTimeout(() => {
                                        modalDispatch({ open: false })
                                        props.setModalStatus(false)
                                    }, 2000)
                                }, 500)
                            } else {
                                await Analytics.logEvent(AnalyticsEventName.view_bdp_shortage_85, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                    player_grade: props.grade,
                                    player_level: props.level,
                                    need_bdp: token?.nRequiredToken - props.bdst,
                                })
                                popupDispatch({
                                    open: true,
                                    children: (
                                        <WalletToast
                                            message={jsonSvc.findLocalById("10000000")}
                                            // image={nftDetailImg.error}
                                            image="NftDetailErrorSvg"
                                        />
                                    ),
                                })
                                setTimeout(() => {
                                    popupDispatch({ open: false })
                                }, 2000)
                            }
                            setTimeout(() => {
                                popupDispatch({ open: false })
                                clicked = false
                            }, 500)
                        }}
                    >
                        <PretendText style={nftStyle.nftModal.lvUpText}>
                            {/* 레벨업 */}
                            {jsonSvc.findLocalById("1027")}
                        </PretendText>
                    </CustomButton>
                </View>
            </View>
        </View>
    )
}
