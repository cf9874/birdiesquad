import { AnalyticsEventName, Colors, Screen, ScreenParams } from "const"
import { useEffect, useState } from "react"
import { Image, Modal, TouchableOpacity, View, FlatList, BackHandler } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { styles } from "./RaddleTab/styles"
import { TabBar, TabView } from "react-native-tab-view"
import { ErrorUtil, RatioUtil, navigate } from "utils"
import { MainHeader, MyPageFooter } from "components/layouts"
import { jsonSvc, signSvc, raffleSvc, profileSvc } from "apis/services"
import { Raffle, RaffleListApply } from "apis/data"
import { useAsyncEffect, useWrapDispatch } from "hooks"
import { setToast } from "store/reducers/config.reducer"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { WALLET_ADDRESS } from "const/wallet.const"
import { WalletToast } from "screens/nft/components"
import { faceWalletSvc } from "apis/services/faceWallet.svc"
import { useScreen } from "hooks/useScreen"
import { ItemRaffle, RaffleHelp, messageRule } from "./RaddleTab/raffle.compo"
import { PageFooterHeight } from "components/layouts"
import Verification from "components/Verification"
import { rankStyle } from "styles"
import { PretendText } from "components/utils"
import { FanRank, RaffleImg, liveImg, mainHeaderImg } from "assets/images"
import { walletStyle } from "styles/wallet.style"
import { BlurView } from "@react-native-community/blur"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import { RouteProp, useRoute } from "@react-navigation/native"
import { Analytics } from "utils/analytics.util"

export interface tab {
    title: string
    component: () => void
}

const RaffleTabScene = () => {
    const toastDispatch = useWrapDispatch(setToast)

    // const [isCert, setIsCert] = useState(false) // 본인인증했는지
    // const [isAdult, setIsAdult] = useState(false) // 성인인지
    const [certVisible, setCertVisible] = useState(false) // 본인인증창 보일지 말지
    const [isCompleteWallet, setIsCompleteWallet] = useState(false)
    const [visibleRule, setvisibleRule] = useState(false) //래플 응모 조건 보기
    const [isVisibleWallet, setIsVisibleWallet] = useState(false) // 지갑 생성 관련 팝업 1. 지갑생성하세요 2. 지갑생성됐습니다.
    const [visibleApply, setVisibleApply] = useState(false) // 래플에 응모하시겠습니까
    const [applySuccess, setApplySuccess] = useState(false) //래플 응모 잘 됐는지
    const [listData0, setListData0] = useState<Raffle[]>([]) // 진행중인 래플 데이터
    const [listDataApply, setListDataApply] = useState<RaffleListApply[]>([]) // 내가 응모한 래플 리스트
    const [listData2, setListData2] = useState<Raffle[]>([]) // 종료된 래플
    const [itemApply, setItemApply] = useState<Raffle>() // 응모하려고하는 래플
    const [walletAddress, setWalletAddress] = useState<string | null>(null) // 지갑주소
    const [checkMode, setCheckMode] = useState(0)
    let applyFlag = false
    //지갑 주소 가져오기
    const fetchSpending = async () => {
        const walletAddress = await AsyncStorage.getItem(WALLET_ADDRESS)
        setWalletAddress(walletAddress)
    }

    const [asset, setAsset] = useState<{
        bdst: number
        tbora: number
        trainingPoint: number
    }>({
        bdst: 0,
        tbora: 0,
        trainingPoint: 0,
    })

    const getAssetData = async () => {
        const asset = await profileSvc.getAsset()
        const {
            asset: { bdst, tbora, training: trainingPoint },
        } = asset as IAsset

        if (asset) setAsset({ bdst, tbora, trainingPoint })
    }

    // 본인인증 여부 확인
    // const checkCertAndAdult = async () => {
    //     const response = await signSvc.checkCert()
    //     setIsCert(response)
    //     if (response === true) {
    //         const isAdult = await signSvc.checkAdult()
    //         setIsAdult(isAdult)
    //     }
    // }
    const checkUnit = (raffleUnit: string) => {
        const handleError = {
            unit: 0,
            msg: "",
        }

        if (raffleUnit === "bdst") {
            handleError.unit = asset.bdst
            handleError.msg = jsonSvc.findLocalById("10000016")
        } else if (raffleUnit === "tbora") {
            handleError.unit = asset.tbora
            handleError.msg = jsonSvc.findLocalById("10000017")
        } else if (raffleUnit === "training") {
            handleError.unit = asset.trainingPoint
            handleError.msg = jsonSvc.findLocalById("10000001")
        }

        return handleError
    }

    // 래플에 응모하는 함수
    const applyRaffle = async (raffle_id: number) => {
        const applyAmount = (
            (itemApply?.RAFFLE_AMOUNT ?? 0) +
            (itemApply?.RAFFLE_AMOUNT_INCREASEMENT ?? 0) *
                Number(listDataApply.find(e => e.RAFFLE_SEQ === Number(itemApply?.SEQ_NO))?.TOTAL_APPLIED ?? 0)
        )
            .toFixed(0)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        const checkApplyHandle = checkUnit(itemApply?.RAFFLE_AMOUNT_UNIT.toLowerCase() ?? "")

        if (checkApplyHandle.unit < Number(applyAmount)) {
            if (itemApply?.RAFFLE_AMOUNT_UNIT.toLowerCase() === "bdst") {
                await Analytics.logEvent(AnalyticsEventName.view_raffle_bdp_shortage_365, {
                    hasNewUserData: true,
                    raffle_name: itemApply?.RAFFLE_NAME,
                })
            }
            setVisibleApply(false)
            toastDispatch({
                open: true,
                children: <WalletToast message={checkApplyHandle.msg} image="NftDetailErrorSvg" />,
            })
            setTimeout(() => {
                toastDispatch({ open: false })
            }, 2000)
            return
        }

        const response = await raffleSvc.raffleApply(raffle_id)
        if (!response) return
        if (response === null) {
            setVisibleApply(false)
        } else {
            setVisibleApply(false)
            await Analytics.logEvent(AnalyticsEventName.view_raffle_entry_complete_toast_365, {
                hasNewUserData: true,
                raffle_name: itemApply?.RAFFLE_NAME,
            })
            setApplySuccess(true)
            getAssetData()
            setTimeout(() => {
                setApplySuccess(false)
                setVisibleApply(false)
            }, 1500)
        }
    }

    //응모하기 눌렀을 때 실행되는 함수
    const onRaffleApply = async (item: Raffle, applyUnit: number) => {
        const isCert = await signSvc.checkCert()
        setItemApply(item)
        if (item.CHECK_MATCH_RULE) {
            if (applyUnit === 1) {
                if (!walletAddress) {
                    if (!isCert) {
                        setCheckMode(1)
                        setCertVisible(true)
                        return
                    }
                    const isAdult = await signSvc.checkAdult()
                    if (isAdult) {
                        await Analytics.logEvent(AnalyticsEventName.view_facewallet_105, {
                            hasNewUserData: true,
                            first_action: "FALSE",
                        })
                        const isSuccess = await faceWalletSvc.loginAndGetAddressWallet()
                        if (!isSuccess) return
                    }
                }
            } else {
                //일반 래플
                if (!isCert) {
                    //미인증 user는 본인인증 창 켜기
                    setCheckMode(0)
                    setCertVisible(true)
                    return
                }
            }
            await Analytics.logEvent(AnalyticsEventName.view_raffle_entry_check_365, {
                hasNewUserData: true,
            })
            setVisibleApply(true)
        } else {
            // NFT 조건 팝업 뷰 로깅
            await Analytics.logEvent(AnalyticsEventName.view_raffle_nft_limit_350, {
                hasNewUserData: true,
                first_action: "FALSE",
            })
            setvisibleRule(true)
        }
    }
    //진행중인 래플 가져오기
    const getListData1 = async () => {
        const data = await raffleSvc.raffleList({ order: "ASC", page: 1, take: 50, status: 1 })
        console.log("listData0", data)
        setListData0(data.data)
    }

    // 내가 응모한 래플 가져오기
    const getListApply = async () => {
        const data = await raffleSvc.raffleListApply()
        setListDataApply(data)
    }

    // 종료된 래플 가져오기
    const getListData2 = async () => {
        const data = await raffleSvc.raffleList({ order: "DESC", page: 1, take: 10, status: 2 })
        setListData2(data.data)
    }

    const { params } = useRoute<RouteProp<ScreenParams, Screen.RAFFLETABSCENE>>()
    const [index, setIndex] = useState(params?.tabIndex ?? 0)
    const [routes] = useState([
        { key: "process", title: jsonSvc.findLocalById("13008") },
        { key: "ended", title: jsonSvc.findLocalById("13009") },
    ])
    useEffect(() => {
        const backAction = () => {
            navigate(params?.toNavigate ? params?.toNavigate : Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])
    useScreen(() => {
        fetchSpending()
        getListApply()
        getListData1()
        getListData2()
    }, [applySuccess, certVisible])

    useScreen(() => {
        //화면 바뀔때마다 스펜딩 정보 불러오기
        fetchSpending()
        getAssetData()
    }, [index])

    const onSelect = async (data: React.SetStateAction<number>) => {
        if (data === 0) {
            await Analytics.logEvent(AnalyticsEventName.click_progress_raffle_tab_350, {
                hasNewUserData: true,
                first_action: "FALSE",
            })
        } else {
            await Analytics.logEvent(AnalyticsEventName.click_end_raffle_tab_350, {
                hasNewUserData: true,
                first_action: "FALSE",
            })
        }
        setIndex(data)
    }
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_raffle_350, {
            hasNewUserData: true,
        })
    }, [])
    const route = useRoute<any>()

    useScreen(() => {
        if (route?.params?.isEnd === true) setIndex(1)
    }, [route?.params])
    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case "process":
                return (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: PageFooterHeight() + RatioUtil.lengthFixedRatio(20),
                        }}
                        data={listData0.sort((a, b) => (a.RAFFLE_ORDER > b.RAFFLE_ORDER ? 1 : -1))}
                        keyExtractor={(item, index) => item.SEQ_NO.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <ItemRaffle
                                    type={"progress"}
                                    index={index}
                                    onPress={() => onRaffleApply(item, item.IS_TBORA_RAFFLE)}
                                    data={item}
                                    listDataApply={listDataApply}
                                />
                            )
                        }}
                        ListEmptyComponent={
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: RatioUtil.height(450),
                                }}
                            >
                                <Image
                                    source={liveImg.noData}
                                    style={{
                                        width: RatioUtil.height(100),
                                        height: RatioUtil.height(100),
                                        marginBottom: RatioUtil.height(10),
                                    }}
                                    resizeMode="contain"
                                />
                                <PretendText
                                    style={{
                                        color: Colors.GRAY2,
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "400",
                                        textAlign: "center",
                                    }}
                                >
                                    {/* 진행 중인 래플이\n없습니다. */}
                                    {jsonSvc.findLocalById("13028")}
                                </PretendText>
                            </View>
                        }
                        ListFooterComponent={listData0.length ? <RaffleHelp /> : null}
                    />
                )

            case "ended":
                return (
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: RatioUtil.height(100) }}
                        data={listData2}
                        keyExtractor={(item, index) => item.SEQ_NO.toString()}
                        renderItem={({ item, index }) => (
                            <ItemRaffle
                                type={"end"}
                                index={index}
                                onPress={() => {}}
                                data={item}
                                listDataApply={listDataApply}
                            />
                        )}
                        ListEmptyComponent={
                            <View
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: RatioUtil.height(450),
                                }}
                            >
                                <Image
                                    source={liveImg.noData}
                                    style={{
                                        width: RatioUtil.height(100),
                                        height: RatioUtil.height(100),
                                        marginBottom: RatioUtil.height(10),
                                    }}
                                    resizeMode="contain"
                                />
                                <PretendText
                                    style={{
                                        color: Colors.GRAY2,
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "400",
                                        textAlign: "center",
                                    }}
                                >
                                    {/* 종료된 래플이\n없습니다. */}
                                    {jsonSvc.findLocalById("13027")}
                                </PretendText>
                            </View>
                        }
                        ListFooterComponent={<View style={{ height: RatioUtil.height(50) }} />}
                    />
                )

            default:
                return null
        }
    }

    return (
        <SafeAreaView style={[styles.mainView, { flex: 1 }]}>
            <MainHeader
                training={asset.trainingPoint}
                bdst={asset.bdst}
                tbora={asset.tbora}
                hideArrow={true}
                toNavigate={params?.toNavigate}
            />
            <TabView
                renderTabBar={props => (
                    <TabBar
                        style={{ backgroundColor: Colors.WHITE }}
                        indicatorStyle={{ backgroundColor: Colors.BLACK }}
                        activeColor={Colors.BLACK}
                        inactiveColor={Colors.GRAY18}
                        labelStyle={{ color: Colors.BLACK, fontWeight: "600", fontSize: RatioUtil.font(14) }}
                        {...props}
                    />
                )}
                style={{ backgroundColor: Colors.WHITE, width: RatioUtil.width(360) }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={onSelect}
            />
            <MyPageFooter />

            <>
                {/* 본인인증 창 */}
                <Verification
                    visible={certVisible}
                    closeToggle={setCertVisible}
                    setIsCompleteWallet={setIsCompleteWallet}
                    checkMode={checkMode}
                />

                {/* Check do have Wallet */}
                {/* 지갑생성 끝났으면 지갑생성 완료 팝업, 지갑없으면 지갑생성팝업 */}
                <Modal
                    animationType="fade"
                    statusBarTranslucent
                    transparent={true}
                    style={{
                        flex: 1,
                    }}
                    visible={isVisibleWallet}
                    onRequestClose={() => {
                        setIsVisibleWallet(false)
                    }}
                >
                    <View style={rankStyle.header.modalMainView}>
                        <View
                            style={{
                                ...RatioUtil.size(280, 170),

                                backgroundColor: Colors.WHITE,
                                alignItems: "center",
                                justifyContent: "center",
                                ...RatioUtil.borderRadius(20, 20, 20, 20),
                            }}
                        >
                            {isCompleteWallet ? (
                                // 지갑 생성 완료
                                <>
                                    <Image
                                        style={{ ...RatioUtil.size(50, 50), ...RatioUtil.margin(5, 0, 5, 0) }}
                                        source={RaffleImg.complete_raffle}
                                    />
                                    <View style={RatioUtil.size(175, 40)}>
                                        <PretendText
                                            numberOfLines={2}
                                            style={{ fontSize: RatioUtil.font(16), textAlign: "center" }}
                                        >
                                            {/* 지갑 생성이 완료되었습니다. 래플에 응모해보세요! */}
                                            {jsonSvc.findLocalById("10010000")}
                                        </PretendText>
                                    </View>
                                    <View
                                        style={{
                                            ...RatioUtil.size(280, 70),
                                            ...RatioUtil.padding(10, 15, 0, 15),
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={async () => {
                                                setIsVisibleWallet(false)
                                            }}
                                        >
                                            <View
                                                style={{
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    // ...RatioUtil.padding(0, 10, 0, 10),
                                                    backgroundColor: Colors.BLACK,
                                                    borderRadius: 50,
                                                    ...RatioUtil.size(250, 45),
                                                }}
                                            >
                                                <PretendText style={walletStyle.header.textConWhite}>
                                                    {jsonSvc.findLocalById("10010000")}
                                                </PretendText>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            ) : (
                                // 지갑 생성 팝업
                                <>
                                    <PretendText
                                        style={{ ...walletStyle.header.text, ...RatioUtil.padding(0, 0, 10, 0) }}
                                    >
                                        {/* 지갑 생성 */}
                                        {jsonSvc.findLocalById("10000043")}
                                    </PretendText>
                                    <View style={RatioUtil.size(175, 40)}>
                                        <PretendText
                                            numberOfLines={2}
                                            style={{
                                                fontSize: RatioUtil.font(16),
                                                textAlign: "center",
                                                textAlignVertical: "center",
                                                height: RatioUtil.height(50),
                                            }}
                                        >
                                            {/* {"래플에 참여하기 위해서는\n지갑을 생성하여야 합니다."} */}
                                            {jsonSvc.findLocalById("10000044")}
                                        </PretendText>
                                    </View>
                                    <View
                                        style={{
                                            ...RatioUtil.size(280, 70),
                                            ...walletStyle.header.rowCenter,
                                            justifyContent: "space-between",
                                            ...RatioUtil.padding(5, 15, 0, 15),
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={async () => {
                                                await Analytics.logEvent(AnalyticsEventName.click_create_cancel_360, {
                                                    hasNewUserData: true,
                                                    first_action: "FALSE",
                                                })
                                                setIsVisibleWallet(false)
                                            }}
                                        >
                                            <View
                                                style={{
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    ...RatioUtil.padding(0, 10, 0, 10),
                                                    backgroundColor: Colors.GRAY7,
                                                    borderRadius: 50,
                                                    ...RatioUtil.size(115, 45),
                                                }}
                                            >
                                                <PretendText style={walletStyle.header.textConBlack}>
                                                    {/* 취소 */}
                                                    {jsonSvc.findLocalById("10010001")}
                                                </PretendText>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={async () => {
                                                const isCert = await signSvc.checkCert()
                                                // const isAdult = await signSvc.checkAdult()
                                                if (!isCert) {
                                                    //미인증 user는 본인인증 창 켜기
                                                    setCheckMode(1)
                                                    setCertVisible(true)
                                                    return
                                                } else {
                                                    const isAdult = await signSvc.checkAdult()

                                                    setIsVisibleWallet(false)
                                                    if (!isAdult) {
                                                        ErrorUtil.genModal("지갑생성은 성인만 가능합니다.")
                                                        return
                                                    } else {
                                                        await Analytics.logEvent(
                                                            AnalyticsEventName.view_facewallet_105,
                                                            {
                                                                hasNewUserData: true,
                                                                first_action: "FALSE",
                                                            }
                                                        )
                                                        const isSuccess = await faceWalletSvc.loginAndGetAddressWallet()
                                                        if (!isSuccess) return
                                                    }
                                                }
                                            }}
                                        >
                                            <View
                                                style={{
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    ...RatioUtil.padding(0, 10, 0, 10),
                                                    backgroundColor: Colors.BLACK,
                                                    borderRadius: 50,
                                                    ...RatioUtil.size(115, 45),
                                                }}
                                            >
                                                <PretendText style={walletStyle.header.textConWhite}>
                                                    {/* 지갑 생성 */}
                                                    {jsonSvc.findLocalById("10000043")}
                                                </PretendText>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>

                {/* APPLY RAFFLE */}
                <Modal visible={visibleApply} statusBarTranslucent transparent>
                    <View style={styles.mainView1}>
                        <View style={styles.modalMainView}>
                            <PretendText style={{ ...styles.title1, marginVertical: 0 }}>
                                {/* 래플에 응모 하시겠습니까? */}
                                {jsonSvc.findLocalById("10000045")}
                            </PretendText>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "400",
                                        color: Colors.BLACK,
                                    }}
                                >
                                    {/* 참여 비용{" "} */}
                                    {jsonSvc.findLocalById("10000046")}{" "}
                                </PretendText>

                                <Image
                                    source={
                                        itemApply?.RAFFLE_AMOUNT_UNIT.toLowerCase() === "bdst"
                                            ? FanRank.point_blue
                                            : itemApply?.RAFFLE_AMOUNT_UNIT.toLowerCase() === "training"
                                            ? FanRank.point_yellow
                                            : mainHeaderImg.tbora
                                    }
                                    style={styles.priceTag}
                                />
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "400",
                                        color: Colors.BLACK,
                                        textAlign: "center",
                                    }}
                                >
                                    {(
                                        (itemApply?.RAFFLE_AMOUNT ?? 0) +
                                        (itemApply?.RAFFLE_AMOUNT_INCREASEMENT ?? 0) *
                                            Number(
                                                listDataApply?.find(e => e.RAFFLE_SEQ === Number(itemApply?.SEQ_NO))
                                                    ?.TOTAL_APPLIED ?? 0
                                            )
                                    )
                                        .toFixed(0)
                                        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                                </PretendText>
                            </View>
                            <View style={styles.buttonMainView}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        await Analytics.logEvent(AnalyticsEventName.click_check_entry_cancel_365, {
                                            hasNewUserData: true,
                                            first_action: "FALSE",
                                        })
                                        setVisibleApply(false)
                                    }}
                                    style={[
                                        styles.buttonView1,
                                        {
                                            backgroundColor: Colors.GRAY15,
                                        },
                                    ]}
                                >
                                    <PretendText
                                        style={[
                                            styles.btnText,
                                            {
                                                color: Colors.BLACK,
                                            },
                                        ]}
                                    >
                                        {/* 취소 */}
                                        {jsonSvc.findLocalById("10010001")}
                                    </PretendText>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={async () => {
                                        await Analytics.logEvent(AnalyticsEventName.click_check_entry_365, {
                                            hasNewUserData: true,
                                            first_action: "FALSE",
                                            raffle_name: itemApply?.RAFFLE_NAME,
                                        })
                                        if (applyFlag) return
                                        applyFlag = true
                                        applyRaffle(itemApply?.SEQ_NO ?? 0)
                                    }}
                                    style={[
                                        styles.buttonView1,
                                        {
                                            backgroundColor: Colors.BLACK,
                                        },
                                    ]}
                                >
                                    <PretendText
                                        style={[
                                            styles.btnText,
                                            {
                                                color: Colors.WHITE,
                                            },
                                        ]}
                                    >
                                        {/* 응모하기 */}
                                        {jsonSvc.findLocalById("13018")}
                                    </PretendText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Apply success */}
                <Modal visible={applySuccess} statusBarTranslucent transparent>
                    <View style={styles.mainView1}>
                        <BlurView style={styles.blurView} blurType="extraDark">
                            <View style={styles.blurView}>
                                <AnimatedLottieView
                                    source={lotties.check}
                                    style={{ width: RatioUtil.font(50), height: RatioUtil.font(50) }}
                                    autoPlay
                                    loop={false}
                                />
                                <PretendText style={styles.authText}>
                                    {/* 래플 응모가 완료되었습니다. */}
                                    {jsonSvc.findLocalById("9900015")}
                                </PretendText>
                            </View>
                        </BlurView>
                    </View>
                </Modal>
                {/* Popup message RULE */}
                <Modal visible={visibleRule} statusBarTranslucent transparent>
                    <View style={styles.mainView1}>
                        <View style={{ ...styles.modalMainView, ...RatioUtil.size(270, 190) }}>
                            <Image style={RatioUtil.size(50, 50)} source={RaffleImg.raffle_alert} />
                            {messageRule(
                                itemApply?.RAFFLE_RULE.RANKING_LIMIT ?? 0,
                                itemApply?.RAFFLE_RULE.USERS_LIMIT ?? 0,
                                itemApply?.RAFFLE_RULE.QUANTITY_LIMIT ?? 0
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    setvisibleRule(false)
                                }}
                                style={[
                                    styles.buttonView1,
                                    {
                                        ...RatioUtil.size(240, 50),
                                        ...RatioUtil.padding(5, 5, 5, 5),
                                        backgroundColor: Colors.BLACK,
                                    },
                                ]}
                            >
                                <PretendText
                                    style={[
                                        // styles.btnText,
                                        {
                                            color: Colors.WHITE,
                                        },
                                    ]}
                                >
                                    {/* 확인 */}
                                    {jsonSvc.findLocalById("10010000")}
                                </PretendText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        </SafeAreaView>
    )
}

export default RaffleTabScene

interface IAsset {
    asset: {
        training: number
        bdst: number
        tbora: number
    }
}
