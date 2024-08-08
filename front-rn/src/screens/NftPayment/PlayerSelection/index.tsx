import AsyncStorage from "@react-native-async-storage/async-storage"
import { jsonSvc, shopSvc } from "apis/services"
import { NFTCardImages, WalletImg, errorModalImg, mainHeaderImg } from "assets/images"
import { MyPageFooter, PageFooterHeight } from "components/layouts"
import { PretendText } from "components/utils"
import { AnalyticsEventName, Colors, ErrorType, ITEM_TYPE, Screen, ThirdPartyAnalyticsEventName } from "const"
import { useEffect, useState } from "react"
import {
    Alert,
    Image,
    ImageBackground,
    Modal,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import {
    ProductPurchase,
    PurchaseError,
    SubscriptionPurchase,
    initConnection,
    purchaseErrorListener,
    purchaseUpdatedListener,
    requestPurchase,
    useIAP,
    finishTransaction,
} from "react-native-iap"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch } from "react-redux"
import store from "store"
import { setGameLoader } from "store/reducers/getGame.reducer"
import { getSeasonRequest } from "store/reducers/season.reducer"
import { scaleSize } from "styles/minixs"
import { ErrorUtil, FuncUtil, NumberUtil, RatioUtil, navigate, navigateReset } from "utils"
import { styles } from "./styles"
import { useNetInfo } from "@react-native-community/netinfo"
import { SvgIcon } from "components/Common/SvgIcon"
import { Analytics } from "utils/analytics.util"
import { useAsyncEffect } from "hooks"

let dataBeginNow: any = null
let transaction: any = null
const PlayerSelection = (props: any) => {
    const { connected, products, getProducts, currentPurchase } = useIAP()
    const netInfo = useNetInfo()
    const dispatch = useDispatch()
    const [isEnable, setIsEnable] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [selectedImageIndex, setselectedImageIndex] = useState(-1)
    const [showModal2, setShowModal2] = useState<boolean>(false)
    const [showModal3, setShowModal3] = useState<boolean>(false)
    const [showModalError, setShowModalError] = useState<boolean>(false)
    const [seq, setSeq] = useState<boolean>()
    const [seasonCode, setseasonCode] = useState<boolean>()
    const [imageArray, setimageArray] = useState<any>([])
    const drawArray = [
        {
            // title: 일반 럭키드로우,
            title: jsonSvc.findLocalById("11001"),
            data: [
                {
                    //  title: "COMMON",
                    title: jsonSvc.findLocalById("1"),
                    progress: jsonSvc.findItemPropablityByType(ITEM_TYPE.SHOPNORMAL)[0],
                    backgroundColor: Colors.GRAY,
                },
                {
                    // title: "UNCOMMON",
                    title: jsonSvc.findLocalById("2"),
                    progress: jsonSvc.findItemPropablityByType(ITEM_TYPE.SHOPNORMAL)[1],
                    backgroundColor: Colors.SNARKYMINT,
                },
            ],
        },
        {
            // title: "고급 럭키드로우",
            title: jsonSvc.findLocalById("11002"),
            data: [
                {
                    // title: "UNCOMMON",
                    title: jsonSvc.findLocalById("2"),
                    progress: jsonSvc.findItemPropablityByType(ITEM_TYPE.SHOPPREMIUM)[0],
                    backgroundColor: Colors.SNARKYMINT,
                },
                {
                    // title: "RARE",
                    title: jsonSvc.findLocalById("3"),
                    progress: jsonSvc.findItemPropablityByType(ITEM_TYPE.SHOPPREMIUM)[1],
                    backgroundColor: Colors.BLUE4,
                },
            ],
        },
    ]

    useEffect(() => {
        netInfo.isInternetReachable === true && initConnection()
        dataBeginNow = dataBeginNow ? dataBeginNow : null
        setselectedImageIndex(!props?.route?.params?.selection ? 0 : -1)
        dispatch(getSeasonRequest())
        //callInAppPurchase()
        const ConsumableErrorListener = purchaseErrorListener(async (error: PurchaseError) => {
            handlePurchaseCancel()
        })
        const PurchaseUpdateConsumable = purchaseUpdatedListener((purchase: SubscriptionPurchase | ProductPurchase) => {
            transaction = purchase
            console.log("updated listener shop")
            const receipt = purchase.transactionReceipt
            if (netInfo.isInternetReachable !== false && receipt) {
                callPurchaseApi(purchase)
            }
        })
        return () => {
            ConsumableErrorListener.remove()
            PurchaseUpdateConsumable.remove()
        }
    }, [netInfo])

    const handlePurchaseCancel = () => {
        if (dataBeginNow) {
            loading(true)
            shopSvc.purchaseCancel(dataBeginNow?.SEQ_NO).then(async response => {
                await AsyncStorage.removeItem("AVAILABLE_PURCHASE_SEQ")
                loading(false)
                if (response) {
                    await Analytics.logEvent(AnalyticsEventName.view_buy_fail_320, {
                        hasNewUserData: true,
                        shop_nID: props.route.params.shopCode,
                    })
                    setShowModalError(true)
                    dataBeginNow = null
                }
            })
        }
    }

    const callInAppPurchase = async () => {
        try {
            // const unfinishedTransactions = await RNIap.getAvailablePurchases();
            // console.log("unfinishedTransactions_list", unfinishedTransactions)
            // const unfinishedProductTransaction = unfinishedTransactions.find(transaction => transaction.productId === props?.route?.params?.sProductCodeIos);
            // console.log("unfinishedProductTransaction:", unfinishedProductTransaction)
            // if (unfinishedProductTransaction) {
            //     // Handle any previously unfinished transactions for the product if they exist.
            //     RNIap.finishTransaction({ purchase: unfinishedProductTransaction, isConsumable: true }).then((res) => console.log('res,', res)).catch((err) => console.log('err,', err))
            // }
        } catch (err: any) {
            if (err) {
                Alert.alert("Error", err.toString())
            }
        }
    }

    const requestConsumable = async (sku: string) => {
        setIsEnable(false)
        loading(true)
        if (dataBeginNow === null) {
            getProducts({ skus: [sku] })
                .then(() => {

                    const shopCode = props?.route?.params?.shopCode;
                    
                    shopSvc
                        .purchase({
                            shopCode,
                            seasonCode: -1,
                            playerCode: -1,
                            billStore: Platform.OS === "android" ? 1 : 2,
                        })
                        .then(async response => {
                            //loading(false)
                            const availablePur = {
                                seqNo: response?.BILL_BEGIN.SEQ_NO.toString(),
                                productId: sku,
                            }
                            await AsyncStorage.setItem("AVAILABLE_PURCHASE_SEQ", JSON.stringify(availablePur))
                            if (response) {
                                dataBeginNow = response?.BILL_BEGIN
                                const purData =
                                    Platform.OS == "android"
                                        ? await requestPurchase({ skus: [sku] })
                                        : await requestPurchase({ sku: sku })

                                if (purData) {

                                    let logData = {
                                        af_quanity: 1,
                                        af_content_id: purData.productId,
                                        af_order_id_aos: "0",
                                        af_transaction_id_ios: "0",
                                        af_currency: "KRW",
                                        af_revenue: jsonSvc.findShopById(shopCode)?.dSaleCostValue
                                    }

                                    if (Platform.OS == "android") {
                                        logData.af_order_id_aos = purData.transactionId ?? "0"
                                    } else {
                                        logData.af_transaction_id_ios = purData.originalTransactionIdentifierIOS ?? "0"
                                    }

                                    Analytics.thirdPartyLogEvent(ThirdPartyAnalyticsEventName.af_purchase, logData)
                                }
                                loading(false)
                            }
                        })
                })
                .catch((err: any) => {
                    loading(false)
                    Alert.alert("Error", err.toString())
                })
        } else if (transaction) {
            callPurchaseApi(transaction)
        }
    }

    const loading = (status: boolean) => {
        store.dispatch(setGameLoader(status))
    }

    // to made button active
    const onEnable = async () => {
        switch (props?.route?.params?.name) {
            case jsonSvc.findLocalById("7079"):
                await Analytics.logEvent(AnalyticsEventName.click_choice_agree_305, {
                    hasNewUserData: true,
                })
                break
            case jsonSvc.findLocalById("7080"):
                await Analytics.logEvent(AnalyticsEventName.click_normal_agree_315, {
                    hasNewUserData: true,
                })
                break
            case jsonSvc.findLocalById("7081"):
                await Analytics.logEvent(AnalyticsEventName.click_premium_agree_310, {
                    hasNewUserData: true,
                })
                break
        }
        setIsEnable(!isEnable)
    }

    // to change color if active
    const onColor = () => {
        if (isEnable) {
            return { backgroundColor: Colors.BLACK }
        } else {
            return { backgroundColor: Colors.GRAY7 }
        }
    }

    const callPurchaseApi = async (purchase: any) => {
        const receipt = purchase.transactionReceipt
        const transID = purchase.transactionId
        // const transID = purchase.originalTransactionIdentifierIOS
        //     ? purchase.originalTransactionIdentifierIOS
        //     : purchase.transactionId

        if (dataBeginNow) {
            loading(true)
            let retryCount = 0
            const maxRetryCount = 3
            let successFlag = false
            let duplicateFlag = false

            while (retryCount < maxRetryCount && !successFlag) {
                try {
                    if (dataBeginNow?.SEQ_NO) {
                        const response: any = await shopSvc.purchaseEnd(dataBeginNow?.SEQ_NO, receipt, transID)
                        retryCount++
                        // console.log("==========> response ",response)
                        if (response.code == "SUCCESS") {
                            await AsyncStorage.removeItem("AVAILABLE_PURCHASE_SEQ")
                            successFlag = true
                            await finishTransaction({ purchase, isConsumable: true })
                            transaction = null
                            dataBeginNow = null
                            loading(false)

                            await Analytics.logEvent(AnalyticsEventName.view_buy_complete_320, {
                                hasNewUserData: true,
                                shop_nID: props.route.params.shopCode,
                            })
                            setShowModal3(true)
                            break
                        } else if (response.code == 400 && response.msg == ErrorType.WRONG_BILLING_RECEIPT_DUPLICATE) {
                            // 영수증이 중복이면 실패 팝업 안띄우기
                            duplicateFlag = true
                            break
                        }
                    }
                } catch (error) {
                    // console.log("==========> error ",error)
                    console.error(error)
                }

                if (retryCount < maxRetryCount) {
                    await FuncUtil.wait(1000)
                }
            }
            if (!duplicateFlag && retryCount === maxRetryCount && !successFlag) {
                await Analytics.logEvent(AnalyticsEventName.view_buy_fail_320, {
                    hasNewUserData: true,
                    shop_nID: props.route.params.shopCode,
                })
                setShowModalError(true)
                loading(false)
            }
        }
    }

    const getTitleHelp = () => {
        switch (props?.route?.params?.name) {
            case jsonSvc.findLocalById("7079"):
                return jsonSvc.findLocalById("911102")
                break
            case jsonSvc.findLocalById("7080"):
                return jsonSvc.findLocalById("911105")
                break
            case jsonSvc.findLocalById("7081"):
                return jsonSvc.findLocalById("911106")
                break
            default:
                return ""
        }
    }
    const getProductNum = (product: string) => {
        switch (product) {
            case "choice":
                return 305
                break
            case "premium":
                return 310
                break
            case "normal":
                return 315
                break
        }
    }
    const handleFinished = () => {
        setShowModal3(false)

        AsyncStorage.setItem("openBottomSheet", "1", () => {
            navigate(Screen.NFTLIST, {
                seq: seq,
                seasonKey: seasonCode,
            })
        })
        // navigate(Screen.NFTLIST, {
        //     seq: seq,
        //     seasonKey: seasonCode,
        // })
    }
    useAsyncEffect(async () => {
        switch (props?.route?.params?.name) {
            case jsonSvc.findLocalById("7079"):
                await Analytics.logEvent(AnalyticsEventName.view_detail_choice_305, {
                    hasNewUserData: true,
                })
                break
            case jsonSvc.findLocalById("7080"):
                await Analytics.logEvent(AnalyticsEventName.view_detail_normal_315, {
                    hasNewUserData: true,
                })
                break
            case jsonSvc.findLocalById("7081"):
                await Analytics.logEvent(AnalyticsEventName.view_detail_premium_310, {
                    hasNewUserData: true,
                })
                break
        }
    }, [])
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.headerViewPurchase}>
                <TouchableOpacity
                    onPress={async () => {
                        switch (props?.route?.params?.name) {
                            case jsonSvc.findLocalById("7079"):
                                await Analytics.logEvent(AnalyticsEventName.click_choice_back_305, {
                                    hasNewUserData: true,
                                })
                                break
                            case jsonSvc.findLocalById("7080"):
                                await Analytics.logEvent(AnalyticsEventName.click_normal_back_315, {
                                    hasNewUserData: true,
                                })
                                break
                            case jsonSvc.findLocalById("7081"):
                                await Analytics.logEvent(AnalyticsEventName.click_premium_back_310, {
                                    hasNewUserData: true,
                                })
                                break
                        }

                        navigate(Screen.BACK)
                    }}
                    style={[styles.backButton]}
                >
                    {/* <Image source={mainHeaderImg.back["1x"]} /> */}
                    <SvgIcon name="BackSvg" />
                </TouchableOpacity>
                <View style={styles.headerTitleView}>
                    <PretendText style={styles.headerTitle}>
                        {/* 상품 구입 */}
                        {jsonSvc.findLocalById("13108")}
                    </PretendText>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: RatioUtil.height(150) }}
            >
                <View style={styles.mainView}>
                    <ImageBackground
                        style={styles.rectangleCard}
                        resizeMode="contain"
                        source={props?.route?.params?.image}
                    >
                        <PretendText
                            style={{
                                color: Colors.WHITE,
                                fontSize: RatioUtil.font(11),
                                fontWeight: RatioUtil.fontWeightBold(),
                                marginLeft: RatioUtil.width(14),
                                marginTop: RatioUtil.height(10),
                            }}
                        >
                            {props?.route?.params?.name || ""}
                        </PretendText>
                    </ImageBackground>
                    <PretendText style={styles.NFTChoiceCardTitle}>{props?.route?.params?.title}</PretendText>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={styles.policyButton}
                        //onPress={() => setShowModal2(true)}
                    >
                        <PretendText style={styles.ratingsTitle}>{getTitleHelp()}</PretendText>
                    </TouchableOpacity>
                    {props?.route?.params?.name === jsonSvc.findLocalById("7079") && (
                        <PretendText
                            style={{
                                marginTop: RatioUtil.lengthFixedRatio(11),
                                color: Colors.GRAY3,
                                fontSize: RatioUtil.font(13),
                                fontWeight: "400",
                                lineHeight: RatioUtil.font(13) * 1.3,
                                textAlign: "center",
                            }}
                        >
                            {/*프로 선택은 구매 완료 후 카드를 오픈할 때 선택 가능합니다.\nUncommon 등급은 5레벨부터 지갑으로 이동 가능합니다.*/}
                            {jsonSvc.findLocalById("911103")}
                        </PretendText>
                    )}
                    {props?.route?.params?.name === jsonSvc.findLocalById("7080") && (
                        <PretendText
                            style={{
                                marginTop: RatioUtil.lengthFixedRatio(11),
                                color: Colors.GRAY3,
                                fontSize: RatioUtil.font(13),
                                fontWeight: "400",
                                lineHeight: RatioUtil.font(13) * 1.3,
                                textAlign: "center",
                            }}
                        >
                            {/* Common 등급은 지갑으로 이동할 수 없습니다.\nUncommon 등급은 5레벨부터 지갑으로 이동 가능합니다.*/}
                            {jsonSvc.findLocalById("911107")}
                        </PretendText>
                    )}
                    {props?.route?.params?.name === jsonSvc.findLocalById("7081") && (
                        <PretendText
                            style={{
                                marginTop: RatioUtil.lengthFixedRatio(11),
                                color: Colors.GRAY3,
                                fontSize: RatioUtil.font(13),
                                fontWeight: "400",
                                lineHeight: RatioUtil.font(13) * 1.3,
                                textAlign: "center",
                            }}
                        >
                            {/* Uncommon 등급은 5레벨부터 지갑으로 이동 가능합니다.\nRare 등급은 3레벨부터 지갑으로 이동 가능합니다.*/}
                            {jsonSvc.findLocalById("911108")}
                        </PretendText>
                    )}
                    <View style={styles.amountMainBox}>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.GRAY8,
                            }}
                        >
                            {/* 결제 금액 */}
                            {jsonSvc.findLocalById("13111")}
                        </PretendText>
                        <View style={styles.amountBox}>
                            <Image style={styles.coinIcon} source={NFTCardImages.priceTag} />
                            <PretendText style={styles.amount}>
                                {NumberUtil.koreanFormatter(props?.route?.params?.price)}
                            </PretendText>
                        </View>
                    </View>
                    <View style={styles.policyMainBox}>
                        <TouchableOpacity activeOpacity={1} onPress={() => onEnable()}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                                // style={{ flex: 0.1 }}
                            >
                                <Image
                                    style={[styles.policyImage]}
                                    source={!isEnable ? NFTCardImages.checkbox : NFTCardImages.selectedCheckbox}
                                />
                                <PretendText
                                    style={[
                                        styles.policy,
                                        { fontWeight: RatioUtil.fontWeightBold(), marginLeft: RatioUtil.width(4) },
                                    ]}
                                >
                                    {jsonSvc.findLocalById("13115")}{" "}
                                </PretendText>
                                <PretendText style={[styles.policy]}>{jsonSvc.findLocalById("13116")}</PretendText>
                            </View>
                        </TouchableOpacity>

                        <View style={[styles.policyBox]}>
                            <TouchableOpacity
                                onPress={async () => {
                                    switch (props?.route?.params?.name) {
                                        case jsonSvc.findLocalById("7079"):
                                            await Analytics.logEvent(AnalyticsEventName.click_choice_agree_link_305, {
                                                hasNewUserData: true,
                                            })
                                            break
                                        case jsonSvc.findLocalById("7080"):
                                            await Analytics.logEvent(AnalyticsEventName.click_normal_agree_link_315, {
                                                hasNewUserData: true,
                                            })
                                            break
                                        case jsonSvc.findLocalById("7081"):
                                            await Analytics.logEvent(AnalyticsEventName.click_premium_agree_link_310, {
                                                hasNewUserData: true,
                                            })
                                            break
                                    }
                                    navigate(Screen.WEBVIEWTERM, {
                                        url: jsonSvc.findConstBynId("MARKET_NFT_REFUND_TERM_LINK").sStrValue,
                                    })
                                }}
                            >
                                <PretendText
                                    style={[
                                        styles.policy,
                                        {
                                            color: Colors.GRAY3,
                                            textAlign: "center",
                                            textDecorationLine: "underline",
                                            fontWeight: RatioUtil.fontWeightBold(),
                                        },
                                    ]}
                                >
                                    {/* 보기 */}
                                    {jsonSvc.findLocalById("13113")}
                                </PretendText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                statusBarTranslucent
                transparent={true}
                style={{
                    backgroundColor: "red",
                }}
                visible={isVisible}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)} style={styles.outSideButton} />
                    <View style={styles.centeredView}>
                        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}>
                            <View>
                                <PretendText style={styles.playerSelectionTitle}>
                                    {/* 선수 선택 */}
                                    {jsonSvc.findLocalById("2035")}
                                </PretendText>
                                <View style={styles.backgroundStyle}>
                                    <Image style={styles.iconStyle} source={NFTCardImages.search} />
                                    <TextInput
                                        style={styles.inputStyle}
                                        autoCapitalize="none"
                                        autoCorrect={true}
                                        // placeholder="선수 이름을 검색하세요"
                                        placeholder={jsonSvc.findLocalById("7018")}
                                        value={searchValue}
                                        onChangeText={setSearchValue}
                                    />
                                </View>
                                <View style={styles.imageBox}>
                                    {imageArray?.map((item: any, index: number) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => setselectedImageIndex(index)}
                                            style={styles.image}
                                        >
                                            <ImageBackground
                                                source={{ uri: item?.sPlayerImagePath }}
                                                style={styles.playerImage}
                                            >
                                                {selectedImageIndex == index ? (
                                                    <Image
                                                        style={[
                                                            styles.policyImage,
                                                            { position: "absolute", right: 5, top: 5 },
                                                        ]}
                                                        source={NFTCardImages.selectedCheckbox}
                                                    />
                                                ) : null}
                                            </ImageBackground>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => setIsVisible(!isVisible)}
                    style={[styles.button, { backgroundColor: selectedImageIndex > -1 ? Colors.BLACK : Colors.GRAY7 }]}
                >
                    <PretendText
                        style={[
                            styles.purchaseButtonTitle,
                            { color: selectedImageIndex > -1 ? Colors.WHITE : Colors.GRAY12 },
                        ]}
                    >
                        {/* 확인 */}
                        {jsonSvc.findLocalById("1012")}
                    </PretendText>
                </TouchableOpacity>
            </Modal>

            <Modal visible={showModal2} statusBarTranslucent transparent>
                <View style={styles.selectionModal}>
                    <View style={styles.selectionModalInner}>
                        <PretendText style={styles.selectionModalInnerTitle}>
                            {/* 럭키드로우 도움말 */}
                            {jsonSvc.findLocalById("911100")}
                        </PretendText>
                        {drawArray?.map((item, index) => (
                            <View style={styles.drawModalMainView} key={index}>
                                <PretendText style={styles.selectionModalInnerDesc}>{item?.title}</PretendText>
                                {item?.data?.map((data, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.drawModalInnerView,
                                            {
                                                backgroundColor: data?.backgroundColor,
                                            },
                                        ]}
                                    >
                                        <PretendText style={styles.drawtitle}>{data?.title}</PretendText>
                                        <PretendText style={styles.drawProgress}>
                                            {data?.progress / 10 == Math.floor(data?.progress / 10)
                                                ? (data?.progress / 10).toFixed(0)
                                                : (data?.progress / 10).toFixed(1)}{" "}
                                            {jsonSvc.findLocalById("1020")}
                                        </PretendText>
                                    </View>
                                ))}
                            </View>
                        ))}
                        <TouchableOpacity onPress={() => setShowModal2(false)} style={styles.modalButtonView}>
                            <PretendText style={styles.modalButtonText}>
                                {/* 확인 */}
                                {jsonSvc.findLocalById("1012")}
                            </PretendText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={showModal3} statusBarTranslucent transparent>
                <View style={styles.selectionModal}>
                    <View style={styles.selectionModalInner}>
                        <Image source={NFTCardImages.selected} style={styles.selectedImage} />
                        <PretendText style={styles.completeTitle}>
                            {/* 구매가 완료되었습니다. */}
                            {jsonSvc.findLocalById("10000039")}
                        </PretendText>
                        <PretendText style={styles.completeDesc}>
                            {/* NFT는 패키지 형태로 지급되며 홈 화면에서 확인 가능합니다. */}
                            {jsonSvc.findLocalById("10000058")}
                        </PretendText>
                        <TouchableOpacity onPress={handleFinished} style={styles.modalButtonView}>
                            <PretendText style={styles.modalButtonText}>
                                {/* 확인 */}
                                {jsonSvc.findLocalById("1012")}
                            </PretendText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal visible={showModalError} statusBarTranslucent transparent>
                <View style={styles.selectionModal}>
                    <View style={styles.selectionModalInner}>
                        <Image
                            source={errorModalImg.error}
                            style={{
                                ...RatioUtil.marginFixedRatio(10, 0, 10, 0),
                            }}
                        ></Image>
                        <PretendText style={styles.completeTitle}>
                            {/* 결제에 실패하였습니다. */}
                            {jsonSvc.findLocalById("10000093")}
                        </PretendText>
                        <PretendText style={styles.completeDesc}>
                            {/* 잠시 후 다시 시도해주세요. */}
                            {jsonSvc.findLocalById("10000067")}
                        </PretendText>
                        <TouchableOpacity
                            onPress={() => {
                                setShowModalError(false)
                                navigate(Screen.NFTTABSCENE)
                            }}
                            style={styles.modalButtonView}
                        >
                            <PretendText style={styles.modalButtonText}>
                                {/* 확인 */}
                                {jsonSvc.findLocalById("1012")}
                            </PretendText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View
                style={[
                    styles.footerView,
                    {
                        position: "absolute",
                        bottom: PageFooterHeight(),
                        width: RatioUtil.width(320),
                    },
                ]}
            >
                <TouchableOpacity
                    disabled={!isEnable}
                    onPress={async () => {
                        const product = props.route.params.name.toLowerCase()
                        const productNum = getProductNum(product)
                        await Analytics.logEvent(
                            AnalyticsEventName[`click_${product}_buy_${productNum}` as AnalyticsEventName],
                            {
                                hasNewUserData: true,
                                first_action: "FALSE",
                            }
                        )
                        requestConsumable(
                            Platform.OS == "android"
                                ? props?.route?.params?.sSkus
                                : props?.route?.params?.sProductCodeIos || ""
                        )
                    }}
                    style={[styles.purchaseButton, onColor()]}
                >
                    <PretendText
                        style={[styles.purchaseButtonTitle, { color: isEnable ? Colors.WHITE : Colors.GRAY12 }]}
                    >
                        {/* 구매하기 */}
                        {jsonSvc.findLocalById("13114")}
                    </PretendText>
                </TouchableOpacity>
            </View>

            <MyPageFooter></MyPageFooter>
        </SafeAreaView>
    )
}

export default PlayerSelection
