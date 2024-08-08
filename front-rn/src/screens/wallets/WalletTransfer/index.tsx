import { useState } from "react"
import { Image, Pressable, ScrollView, TextInput, TouchableOpacity, View, TouchableHighlight } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RatioUtil, navigate } from "utils"
import { AnalyticsEventName, Colors, Screen, ScreenParams } from "const"
import { WalletImg, nftDetailImg } from "assets/images"
import { PretendText } from "components/utils"
import { walletStyle } from "styles/wallet.style"
import { useRoute, RouteProp } from "@react-navigation/native"
import { LayoutStyle } from "styles"
import { BottomSheet } from "react-native-btr"
import { jsonSvc } from "apis/services"
import { callSetGameApi } from "common/GlobalFunction"
import store from "store"
import { setSetGameModalData, setShowGameModal } from "store/reducers/getGame.reducer"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Analytics } from "utils/analytics.util"

const WalletTransfer = () => {
    const route = useRoute<RouteProp<ScreenParams, Screen.WALLETTRANSFER>>()
    const [mode, setMode] = useState<number | 1 | 2>(route.params.swapMode)
    const [visible, setVisible] = useState(false)
    const [selectItem, setSelectItem] = useState<string>(jsonSvc.findLocalById("2022"))
    const [transferValue, setTransferValue] = useState<string>("")

    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            <View
                style={{
                    height: RatioUtil.heightFixedRatio(44),
                    backgroundColor: Colors.WHITE,
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flexDirection: "row",
                }}
            >
                <Pressable
                    style={{
                        marginRight: RatioUtil.width(15),
                        ...RatioUtil.sizeFixedRatio(30, 30),
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        navigate(Screen.BACK)
                    }}
                >
                    <Image resizeMode="contain" style={RatioUtil.sizeFixedRatio(30, 30)} source={nftDetailImg.close} />
                </Pressable>
            </View>

            <View style={{ justifyContent: "center" }}>
                <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: Colors.WHITE,
                    ...RatioUtil.paddingFixedRatio(0, 20, 0, 20),
                    ...RatioUtil.sizeFixedRatio(360, 70),
                    marginTop: RatioUtil.heightFixedRatio(20),
                    marginBottom: RatioUtil.heightFixedRatio(30)
                }}>
                    <TouchableOpacity onPress={() => {}} style={{
                        ...RatioUtil.sizeFixedRatio(158, 70),
                        ...RatioUtil.borderRadius(10, 1, 1, 10),
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: Colors.PURPLE,
                    }}>
                        <PretendText
                            style={{ fontSize: RatioUtil.font(18), fontWeight: RatioUtil.fontWeightBold(), color: Colors.WHITE }}
                        >
                            {/* {mode == 1 ? "스펜딩" : "지갑"} */}
                            {mode == 1 ? jsonSvc.findLocalById("1107") : jsonSvc.findLocalById("1108")}
                        </PretendText>
                        <PretendText style={{
                            color: Colors.WHITE,
                            opacity: 0.5,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(14),
                            marginTop: RatioUtil.heightFixedRatio(3)
                        }}>
                            {/* 에서 */}
                            {jsonSvc.findLocalById("2017")}
                        </PretendText>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...RatioUtil.sizeFixedRatio(158, 70),
                        ...RatioUtil.borderRadius(1, 10, 10, 1),
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: Colors.PURPLE,
                    }}>
                        <PretendText
                            style={{ fontSize: RatioUtil.font(18), fontWeight: RatioUtil.fontWeightBold(), color: Colors.WHITE }}
                        >
                            {/* {mode == 1 ? "지갑" : "스펜딩"} */}
                            {mode == 1 ? jsonSvc.findLocalById("1108") : jsonSvc.findLocalById("1107")}
                        </PretendText>
                        <PretendText style={{
                            color: Colors.WHITE,
                            opacity: 0.5,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(14),
                            marginTop: RatioUtil.heightFixedRatio(3)
                        }}>
                            {/* 으로 */}
                            {jsonSvc.findLocalById("2018")}
                        </PretendText>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={async () => {
                        // 스펜딩<>지갑 스왑 버튼
                        await Analytics.logEvent(AnalyticsEventName.click_send_swap_120, {
                            hasNewUserData: true,
                            first_action: "FALSE",
                            sendStart_title: mode == 1 ? "SPENDING" : "WALLET",
                        })
                        setMode(mode == 1 ? 2 : 1)
                    }}
                    activeOpacity={0.5}
                    style={{
                        ...RatioUtil.sizeFixedRatio(60, 40),
                        ...RatioUtil.borderRadius(100),
                        backgroundColor: Colors.WHITE,
                        elevation: 6,
                        position: "absolute",
                        alignSelf: "center",
                        justifyContent: "center",
                        alignItems: "center",
                        top: RatioUtil.heightFixedRatio(35),
                    }}
                >
                    <Image
                        resizeMode="contain"
                        style={RatioUtil.size(20, 20)}
                        source={WalletImg.wallet_switch}
                    />
                </TouchableOpacity>
            </View>
            <View style={{ height: 10 }} />
            <View style={{ height: 10, backgroundColor: Colors.GRAY9 }} />
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginHorizontal: RatioUtil.width(20),
                    marginTop: RatioUtil.heightFixedRatio(30),
                    marginBottom: RatioUtil.heightFixedRatio(20),
                }}
            >
                <View style={{ width: RatioUtil.width(320) }}>
                    <PretendText style={{ fontSize: RatioUtil.font(14), fontWeight: RatioUtil.fontWeightBold(), color: Colors.BLACK }}>
                        {/* 전송 자산 */}
                        {jsonSvc.findLocalById("2021")}
                    </PretendText>
                    <TouchableOpacity
                        onPress={async () => {
                            //전송 자산 선택 버튼
                            await Analytics.logEvent(AnalyticsEventName.click_select_property_120, {
                                hasNewUserData: true,
                                first_action: "FALSE",
                                sendStart_title: mode === 1 ? "SPENDING" : "WALLET",
                            })
                            setVisible(true)
                        }}
                        style={walletStyle.header.selectButton}
                    >
                        <PretendText style={{ fontSize: RatioUtil.font(13), fontWeight: "400", color: Colors.BLACK }}>
                            {selectItem}
                        </PretendText>

                        <Image
                            resizeMode="contain"
                            style={{
                                ...RatioUtil.sizeFixedRatio(12, 12),
                                marginRight: RatioUtil.width(5),
                                transform: [{ rotate: visible ? "180deg" : "0deg" }],
                            }}
                            source={WalletImg.arrow_down}
                        />
                    </TouchableOpacity>
                    <PretendText style={{ 
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: Colors.BLACK,
                        marginTop: RatioUtil.heightFixedRatio(30),
                    }}>
                        {/* 전송 수량 */}
                        {jsonSvc.findLocalById("2023")}
                    </PretendText>
                    <View style={walletStyle.header.selectButton}>
                        <TextInput
                            value={transferValue}
                            style={{
                                flex: 1,
                                ...RatioUtil.padding(10, 10, 10, 0),
                                backgroundColor: Colors.WHITE,
                                fontSize: RatioUtil.font(14),
                                color: Colors.BLACK
                            }}
                            placeholder="0"
                            onChangeText={setTransferValue}
                            underlineColorAndroid="transparent"
                        />
                        <TouchableOpacity onPress={() => {}} style={{
                            ...RatioUtil.sizeFixedRatio(42, 24),
                            ...RatioUtil.borderRadius(50),
                            backgroundColor: Colors.BLACK,
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <PretendText
                                style={{ fontWeight: RatioUtil.fontWeightBold(), fontSize: RatioUtil.font(12), color: Colors.WHITE }}
                            >
                                {/* 전체 */}
                                {jsonSvc.findLocalById("2024")}
                            </PretendText>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={async () => {
                        const showModal = await callSetGameApi(true)

                        if (!showModal) {
                            // setSelectItem("선수")
                            setSelectItem(jsonSvc.findLocalById("2022"))
                            setVisible(false)
                        } else {
                            store.dispatch(setShowGameModal(true))
                            store.dispatch(
                                setSetGameModalData({
                                    // title: "지금은 투어 보상 정산 중입니다.",
                                    title: jsonSvc.findLocalById("10000025"),
                                    // desc1: "NFT 에너지 충전은",
                                    // desc2: "잠시 후 다시 진행 해 주세요",
                                    desc1: jsonSvc.findLocalById("10000063"),
                                })
                            )
                        }
                    }}
                    style={{
                        ...RatioUtil.sizeFixedRatio(320, 60),
                        ...RatioUtil.borderRadius(100),
                        backgroundColor: Colors.WHITE3,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(16),
                            color: Colors.GRAY12,
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}
                    >
                        {/* 전송 */}
                        {jsonSvc.findLocalById("2048")}
                    </PretendText>
                </TouchableOpacity>
            </View>
            
            <BottomSheet
                visible={visible}
                onBackButtonPress={() => setVisible(!visible)}
                onBackdropPress={() => setVisible(!visible)}
            >
                <View style={{
                    backgroundColor: "#fff",
                    ...RatioUtil.borderRadius(10, 10, 0, 0),
                    height: RatioUtil.heightFixedRatio(140) + insets.bottom,
                    alignItems: "center",
                }}>
                    <View style={{
                        height: RatioUtil.heightFixedRatio(60),
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <PretendText style={{
                            textAlign: "center",
                            fontSize: RatioUtil.font(18),
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}>
                            {/* 전송 자산 */}
                            {jsonSvc.findLocalById("2021")}
                        </PretendText>
                    </View>
                    <TouchableHighlight
                        onPress={() => {
                            // setSelectItem("선수")
                            setSelectItem(jsonSvc.findLocalById("2041"))
                            setVisible(false)
                            navigate(Screen.SELECTPLAYERNFT, { mode: mode })
                        }}
                        underlayColor="#EEF1F5"
                        activeOpacity={1}
                        style={{
                            ...RatioUtil.sizeFixedRatio(360, 60),
                            ...RatioUtil.padding(0, 20, 0, 20),
                            backgroundColor: Colors.WHITE3,
                            justifyContent: "center",
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                color: Colors.BLACK,
                                fontWeight: "400",
                            }}
                        >
                            {/* 선수 */}
                            {jsonSvc.findLocalById("2041")}
                        </PretendText>
                    </TouchableHighlight>
                </View>
            </BottomSheet>
        </SafeAreaView>
    )
}

export default WalletTransfer
