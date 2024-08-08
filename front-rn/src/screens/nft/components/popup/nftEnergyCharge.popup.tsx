import { Image, InteractionManager, View } from "react-native"
import { RatioUtil, checkStopNFT } from "utils"
import { FanRank, NFTCardImages, coninImg, nftDetailImg, radialCircleSliderImg } from "assets/images"
import { AnalyticsEventName, Colors } from "const"
import { nftGStyle, nftStyle } from "styles/nft.style"
import { CustomButton, PretendText } from "components/utils"
import { useQuery, useWrapDispatch } from "hooks"
import { setModal, setPopUp, setToast } from "store/reducers/config.reducer"
import { RadialSlider } from "components/RadialSlider"
import React, { useEffect, useState } from "react"
import { jsonSvc, nftSvc } from "apis/services"
import { WalletToast } from "./walletToast"
import { Shadow } from "react-native-shadow-2"
import { NotifiModal } from "components/Common/NottifiModal"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BlurView } from "@react-native-community/blur"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import { mineCompoStyle } from "styles"
import { Analytics } from "utils/analytics.util"

interface INftEnergyChage {
    energy: number
    nftseq: number
    bdst: number
    grade: number
    renderToggle: () => void
}

export const NftEnergyChage = (props: INftEnergyChage) => {
    let clicked = false
    const modalDispatch = useWrapDispatch(setModal)
    const popupDispatch = useWrapDispatch(setPopUp)
    const [energy, setEnergy] = useState(props.energy)

    const chargeRatio = jsonSvc.findGradeById(props.grade).n_EnergyChargeCost

    const insets = useSafeAreaInsets()

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: Colors.WHITE,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    position: "absolute",
                    bottom: 0,
                    width: RatioUtil.width(360),
                    height: RatioUtil.lengthFixedRatio(393) + insets.bottom,
                    borderTopLeftRadius: RatioUtil.width(16),
                    borderTopRightRadius: RatioUtil.width(16),
                }}
            >
                <View
                    style={{
                        width: RatioUtil.width(360),
                        height: RatioUtil.lengthFixedRatio(54),
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        paddingTop: RatioUtil.lengthFixedRatio(9),
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(18),
                            fontWeight: RatioUtil.fontWeightBold(),
                            color: Colors.BLACK,
                        }}
                    >
                        {/* 에너지 충전 */}
                        {jsonSvc.findLocalById("1002")}
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
                        titleStyle={{
                            fontSize: RatioUtil.font(34),
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}
                        linearGradient={[
                            { offset: "0%", color: "#5567FF" },
                            { offset: "100%", color: "#A1EF7A" },
                        ]}
                        subTitle={jsonSvc.findLocalById("1020")}
                        subTitleStyle={{
                            position: "absolute",
                            color: Colors.BLACK,
                            fontWeight: "700",
                            fontSize: RatioUtil.font(20),
                            left: RatioUtil.width(40),
                        }}
                        title={energy.toString()}
                        thumbRadius={RatioUtil.width(18)}
                        thumbBorderWidth={0.2}
                        thumbColor={Colors.WHITE}
                        thumbBorderColor={Colors.BLACK}
                        value={energy}
                        isHideValue={true}
                        minimumvalue={0}
                        max={100}
                        isHideButtons={true}
                        isHideLines={true}
                        isHideTailText={true}
                        onChange={value => value && setEnergy(value)}
                        onComplete={async () =>
                            await Analytics.logEvent(AnalyticsEventName.click_energy_gage_75, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            })
                        }
                        iconSource={radialCircleSliderImg.icon}
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
                                justifyContent: "space-between",
                                borderRadius: 6,
                                flexDirection: "row",
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
                                {/* 가격 */}
                                {jsonSvc.findLocalById("1006")}
                            </PretendText>
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <Image
                                    source={FanRank.point_blue}
                                    style={[nftGStyle.nft.coin, { marginRight: RatioUtil.lengthFixedRatio(10) }]}
                                    resizeMode="contain"
                                />
                                <PretendText
                                    style={[nftStyle.nftModal.numText, { marginRight: RatioUtil.lengthFixedRatio(20) }]}
                                >
                                    {energy <= props.energy
                                        ? 0
                                        : parseFloat(((energy - props.energy) * chargeRatio).toFixed(1))}
                                </PretendText>
                            </View>
                        </View>
                    </Shadow>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        width: RatioUtil.width(360),
                        height: RatioUtil.lengthFixedRatio(98),
                        paddingHorizontal: RatioUtil.lengthFixedRatio(20),
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CustomButton
                        style={{
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
                        }}
                    >
                        <PretendText style={nftStyle.nftModal.btnText}>
                            {/* 취소 */}
                            {jsonSvc.findLocalById("1021")}
                        </PretendText>
                    </CustomButton>
                    {energy <= props.energy ? (
                        <CustomButton
                            style={{
                                marginLeft: RatioUtil.width(10),
                                width: RatioUtil.width(202),
                                height: RatioUtil.lengthFixedRatio(60),
                                backgroundColor: Colors.GRAY,
                                borderRadius: RatioUtil.width(100),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={async () => {
                                await Analytics.logEvent(AnalyticsEventName.click_disable_charge_75, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                            }}
                        >
                            <PretendText style={[nftStyle.nftModal.btnText, { opacity: 0.2 }]}>
                                {/* 충전 */}
                                {jsonSvc.findLocalById("1008")}
                            </PretendText>
                        </CustomButton>
                    ) : (
                        <CustomButton
                            style={{
                                marginLeft: RatioUtil.width(10),
                                width: RatioUtil.width(202),
                                height: RatioUtil.lengthFixedRatio(60),
                                backgroundColor: Colors.BLACK,
                                borderRadius: RatioUtil.width(100),
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={async () => {
                                await Analytics.logEvent(AnalyticsEventName.click_able_charge_75, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                                if (clicked) return
                                clicked = true
                                if (checkStopNFT() || props.bdst < (energy - props.energy) * chargeRatio) {
                                    await Analytics.logEvent(AnalyticsEventName.view_bdp_shortage_75, {
                                        hasNewUserData: true,
                                        first_action: "FALSE",
                                        player_energy: props.energy,
                                        need_bdp: props.bdst - (energy - props.energy) * chargeRatio,
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
                                } else {
                                    popupDispatch({ open: false })
                                    await nftSvc.charge({
                                        seq: props.nftseq,
                                        amount: energy,
                                    })
                                    props.renderToggle()
                                    InteractionManager.runAfterInteractions(() => {
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
                                                                {/* 에너지 충전 완료! */}
                                                                {jsonSvc.findLocalById("SUCCESS_RECHARGE_ENERGY")}
                                                            </PretendText>
                                                        </View>
                                                    </View>
                                                </CustomButton>
                                            ),
                                        })
                                        setTimeout(() => {
                                            modalDispatch({ open: false })
                                        }, 2000)
                                    })
                                }
                            }}
                        >
                            <PretendText style={[nftStyle.nftModal.btnText, { color: Colors.WHITE }]}>
                                {jsonSvc.findLocalById("1008")}
                            </PretendText>
                        </CustomButton>
                    )}
                </View>
            </View>
        </View>
    )
}
