import React, { useEffect, useRef, useState, useMemo, useCallback } from "react"
import {
    Alert,
    BackHandler,
    FlatList,
    Image,
    ImageStyle,
    Keyboard,
    KeyboardAvoidingView,
    LayoutChangeEvent,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    ScrollView,
    TextInput,
    TextInputChangeEventData,
    TextInputContentSizeChangeEventData,
    View,
    ViewStyle,
} from "react-native"

import { chatSvc, jsonSvc, nftSvc, profileSvc, shopSvc } from "apis/services"
import { errorModalImg, liveImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { DateUtil, ErrorUtil, NumberUtil, RatioUtil, navigate } from "utils"
import { useDidMountEffect, useInputs, useKeyboardVisible, useQuery, useToggle, useWrapDispatch } from "hooks"
import { ChatValid } from "validators"
import { AnalyticsEventName, Colors, ResultSendMessage, Screen, ScreenParams } from "const"
import produce from "immer"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { liveStyle } from "styles/live.style"

import { ChatType, IBotMsg, IChatRes, IPayLoadDonate, IPlayer, IRepeatRes } from "apis/data"
import { ISeasonDetail } from "apis/data/season.data"
import { liveSvc } from "apis/services/live.svc"
import ProfileImage from "components/utils/ProfileImage"
import nftPlayerJson from "json/nft_player.json"
import {
    ProductPurchase,
    PurchaseError,
    SubscriptionPurchase,
    purchaseErrorListener,
    purchaseUpdatedListener,
    requestPurchase,
    useIAP,
} from "react-native-iap"
import LinearGradient from "react-native-linear-gradient"
import store from "store"
import { updateDonatedUser } from "store/reducers/donate.reducer"
import { setGameLoader } from "store/reducers/getGame.reducer"
import { DeclareContents, DonateEnd, DonateSelectPlayer, HeartContents, LastDonate } from "./tab.cheer.compo"
import { styles } from "screens/NftPayment/PlayerSelection/styles"
import { TouchableOpacity } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Analytics } from "utils/analytics.util"
import { SvgIcon } from "components/Common/SvgIcon"
import { Shadow } from "react-native-shadow-2"
import { MAX_NUM_CHAT } from "const/live.const"
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native"

let dataBeginNow: any | undefined | null
let payLoadDonate: IPayLoadDonate | undefined | null
let endReach: boolean = true

const CheerTab = ({
    id,
    gameData,
    onAnimate,
    onAnimationStart,
    callAnimation,
    isEnd,
    botIdx,
    showPoint,
    showPoints,
    setBotIdx,
    //getRecvChatDatas,
}: IChearTab) => {
    const { connected, products, getProducts, finishTransaction, currentPurchase } = useIAP()
    const [chatList, setChatList] = useState<Array<IChatRes | IRepeatRes | IBotMsg>>([])
    const refChatDataUpated = useRef<Map<number, number>>(new Map<number, number>())
    const chatItemHeights = useRef<Array<number>>([])
    const chatItemOffsets = useRef<Array<number>>([])
    const flatlistRef = useRef<FlatList | null>(null)
    const flatListHeight = useRef<number>(0)
    const isBottomReached = useRef<boolean>(true)
    const [isVisibleBottomBtn, showBottomBtn] = useState<boolean>(false)
    const { params } = useRoute<RouteProp<ScreenParams, Screen.LIVE>>()


    const donatedDispatch = useWrapDispatch(updateDonatedUser)
    const modalDispatch = useWrapDispatch(setModal)
    const popUpDispatch = useWrapDispatch(setPopUp)

    const [isCheerEnd, , setIsCheerEnd] = useToggle()
    const [time, setTime] = useState(60)
    const [chatCaution, setChatCaution] = useState(false)
    const [showModalError, setShowModalError] = useState<boolean>(false)

    const [botEventMsgs, setBotEventMsgs] = useState<{ seq: Number; training: Number; bdst: Number }[]>([])

    const [chatDataAggregator, setChatDataAggregator] = useState<Array<IChatRes | IRepeatRes | IBotMsg>>([])
    const refChatDataAggregator = useRef(chatDataAggregator)
    refChatDataAggregator.current = chatDataAggregator

    const [oldChatDatas, setOldChatDatas] = useState<Array<IChatRes | IRepeatRes | IBotMsg>>([])
    const refOldChatDatas = useRef(oldChatDatas)
    refOldChatDatas.current = oldChatDatas

    const refSocketConnectedTime = useRef(Date.now())
    const [olderDataLoadTime, setOlderDataLoadTime] = useState<number>(Date.now())
    const refOlderDataLoadTime = useRef(olderDataLoadTime)
    refOlderDataLoadTime.current = olderDataLoadTime
    
    const loadDataSize = 10

    useEffect(() => {
        const backAction = () => {
            navigate(params?.toNavigate ? params?.toNavigate : Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])

    const connectSocket = async (gameData: ISeasonDetail | undefined) => {
        await chatSvc.init(gameData?.GAME_CODE, () => {
            //chatSvc.removeListen()

            chatSvc.listenMsg(pushMsg)
            chatSvc.listenCashMsg(pushMsg)
            chatSvc.listenReport(policeListen)
            chatSvc.listenHeart(callAnimation)
            chatSvc.listenChatBot(addBotToChat)

            refSocketConnectedTime.current = Date.now()
        })
    }

    useEffect(() => {
        connectSocket(gameData)

        const ConsumableErrorListener = purchaseErrorListener(async (error: PurchaseError) => {
            handlePurchaseCancel()
        })
        const PurchaseUpdateConsumable = purchaseUpdatedListener((purchase: SubscriptionPurchase | ProductPurchase) => {
            const receipt = purchase.transactionReceipt
            console.log("update listener donate")
            if (receipt) {
                callPurchaseApi(purchase)
            }
        })

        // // add dummy chat data
        // let current = Date.now()
        // for (let i = 0; i < MAX_NUM_CHAT - 3; i++) {
        //     pushMsg({
        //         type: ChatType.REPEAT,
        //         // contents: `도배 방지를 위해 ${
        //         //     jsonSvc.findConstById(20003).nIntValue
        //         // }초 동안 채팅 입력이 금지됩니다.`,
        //         seq: current + i,
        //         contents: jsonSvc.formatLocal(jsonSvc.findLocalById("9900011"), [
        //             jsonSvc.findConstById(20003).nIntValue.toString(),
        //         ]),
        //     } as IChatRes)
        // }

        return () => {
            ConsumableErrorListener.remove()
            PurchaseUpdateConsumable.remove()

            chatSvc.disconnect()
        }
    }, [])

    useEffect(() => {
        if (!botEventMsgs || botEventMsgs.length < 1) return

        showPoints(botEventMsgs)
        setBotEventMsgs([])
    }, [botEventMsgs])

    const isKeboardVisible = useKeyboardVisible()
    const textInputRef = useRef<TextInput | null>(null)

    // const [botList, setbotList] = useState<IBotMsg[]>([])
    const botListRef = useRef<IBotMsg[]>([])

    const currentBot = useRef<IBotMsg | null>(null)

    const updateCurrentBot = (index: number) => {
        if (botListRef.current.length === index) {
            setBotIdx(-1)
            return
        }

        console.log("botListRef.current: " + JSON.stringify(botListRef.current))

        const newBot = botListRef.current[index]
        // if (newBot.seq !== currentBot.current?.seq) {
        // currentBot.current = newBot
        showPoint(newBot.seq, newBot.training, newBot.bdst)
        console.log("listenChatBot: " + JSON.stringify(newBot), index)
        // }
    }

    const addBotToChat = (res: IBotMsg[]) => {
        const sliceRes = res.slice(0, 10)
        const eventMsgs: { seq: Number; training: Number; bdst: Number }[] = []

        for (let i = 0; i < sliceRes.length; i++) {
            const element = sliceRes[i]
            pushMsg(element)

            eventMsgs.push({ seq: element.seq, training: element.training, bdst: element.bdst })

            //showPoint(element.seq, element.training, element.bdst)
        }

        setBotEventMsgs(prev => [...prev, ...eventMsgs])

        return

        botListRef.current = sliceRes

        // if (!currentBot.current) {
        updateCurrentBot(0)
        setBotIdx(0)
        // }
    }

    // useDidMountEffect(() => {
    //     if (botIdx !== -1) {
    //         console.log('useDidMountEffect')
    //         updateCurrentBot(botIdx)
    //     }
    // }, [botIdx])

    // useEffect(() => {
    //     if (botIdx < botList.length) {
    //         if (botList[botIdx].seq === currentBot.current?.seq) return
    //         currentBot.current = botList[botIdx]
    //         showPoint(currentBot.current.seq, currentBot.current.training, currentBot.current.bdst)
    //         console.log("listenChatBot: " + JSON.stringify(currentBot.current), botIdx)
    //         pushMsg(currentBot.current)
    //     }
    // }, [botIdx, botList])

    // useEffect(() => {
    //     if (!isKeboardVisible) {
    //         textInputRef.current?.blur()
    //     } else {
    //     }
    // }, [isKeboardVisible])

    useEffect(() => {
        if (isEnd) {
            const countdown = setInterval(() => {
                if (time <= 0) {
                    setIsCheerEnd(true)
                    clearInterval(countdown)
                } else {
                    setTime(time => time - 1)
                }
            }, 1000)

            return () => clearInterval(countdown)
        }
    }, [isEnd, time])

    const handlePurchaseCancel = () => {
        if (dataBeginNow) {
            loading(true)
            shopSvc
                .purchaseCancel(dataBeginNow?.SEQ_NO)
                .then(async response => {
                    await AsyncStorage.removeItem("AVAILABLE_PURCHASE_SEQ")
                    loading(false)
                    if (response) {
                        setShowModalError(true)
                        resetPurchase()
                    }
                })
                .catch(err => {
                    loading(false)
                })
                .finally(() => {
                    loading(false)
                })
        }
    }

    const resetPurchase = () => {
        dataBeginNow = null
        payLoadDonate = null
    }

    const callPurchaseApi = async (purchase: any) => {
        const receipt = purchase.transactionReceipt
        const transID = purchase.transactionId
        // purchase.originalTransactionIdentifierIOS
        //     ? purchase.originalTransactionIdentifierIOS
        //     : purchase.transactionId
        if (dataBeginNow && payLoadDonate) {
            loading(true)
            let retryCount = 0
            const maxRetryCount = 3
            let successFlag = false
            while (retryCount < maxRetryCount && !successFlag) {
                const response: any = await shopSvc.purchaseEnd(dataBeginNow?.SEQ_NO, receipt, transID)
                retryCount++
                // if success return

                if (response && response.code === "SUCCESS") {
                    await AsyncStorage.removeItem("AVAILABLE_PURCHASE_SEQ")
                    successFlag = true
                    await finishTransaction({ purchase, isConsumable: true })
                    const { msg, code } = payLoadDonate

                    loading(false)
                    setTimeout(() => {
                        chatSvc.sendCashMsg(msg, code, response.data, res => {
                            modalDispatch({
                                open: true,
                                children: (
                                    <DonateEnd donateCoin={res.cash} playerCode={res.playerCode} gameData={gameData} />
                                ),
                            })
                            //res)
                            resetPurchase()
                        })
                    }, 500)
                    break
                }

                if (retryCount === maxRetryCount) {
                    loading(false)
                    break
                }
            }
        }
        loading(false)
    }

    const [profile] = useQuery(profileSvc.getMyProfile, {
        loading: false,
    })

    const policeListen = (res: { isDeclare: boolean; seq: number }) => {
        setChatList(list =>
            list.map(v => {
                if (chatSvc.isRepeatMsg(v) || chatSvc.isChatBot(v)) {
                    return v
                } else {
                    return { ...v, isDeclare: v.seq === res.seq ? res.isDeclare : v.isDeclare }
                }
            })
        )
    }

    const pushMsg = (res: IChatRes | IRepeatRes | IBotMsg) => {
        if (refSocketConnectedTime.current + 800 >= Date.now() || refChatDataAggregator.current.length > 0) {
            refChatDataAggregator.current.push(res)
        }
        else {
            if (chatList.length > MAX_NUM_CHAT)
                setChatList(prev => prev.slice(20))

            setChatList(state =>
                produce(state, draft => {
                    draft.push(res)
                })
            )
        }
    }

    const refLastRecvCashItem = useRef<number>(-1)

    useEffect(() => {
        const timerId = setTimeout(() => {
            clearTimeout(timerId)

            const lastCashItem = refChatDataAggregator.current.slice(0).reverse().find((element, index, array) =>
            {
                return element.type === ChatType.CASH
            })
            if (lastCashItem)
                refLastRecvCashItem.current = lastCashItem.seq

            setChatList(state =>
                produce(state, draft => {
                    if (refChatDataAggregator.current.length <= loadDataSize) {
                        draft.push(...refChatDataAggregator.current)
                    }
                    else {
                        draft.push(...refChatDataAggregator.current.slice(refChatDataAggregator.current.length - loadDataSize))
                        refOldChatDatas.current.push(...refChatDataAggregator.current.slice(0, refChatDataAggregator.current.length - loadDataSize))
                    }

                    refChatDataAggregator.current.splice(0)
                })
            )

            flatlistRef.current?.scrollToOffset({animated: false, offset: RatioUtil.width(150) * chatList.length})
            refLastRecvCashItem.current = -1
        }, 800)
    }, [])

    const [selectPlayer, setSelectPlayer] = useState<IPlayer>()

    const [isInputMode, setInputMode] = useState<boolean>(false)
    const [enableSendBtn, setEnableSendBtn] = useState<boolean>(false)

    const chatInput = useInputs({
        validCheck: ChatValid.chatting,
        value: "",
        maxLength: jsonSvc.findConstById(20002).nIntValue,
    })

    const onDonation = async (msg: string, cash: number, code: number) => {
        popUpDispatch({ open: false })
        Platform.OS === "ios"
            ? setTimeout(() => {
                  loading(true)
              }, 500)
            : loading(true)

        const shop = jsonSvc.findShopByCost(cash)
        payLoadDonate = { msg, code }
        const seasonCode = await liveSvc.getSetSeason()

        await Analytics.logEvent(
            AnalyticsEventName.click_cash_support_send_60,

            {
                hasNewUserData: true,
                first_action: "FALSE",
                game_id: gameData?.GAME_CODE,
                player_code: code,
                player_name: nftSvc.getNftPlayer(code)?.sPlayerName,
                shop_nID: shop.nID,
            }
        )
        if (!shop || !code || !seasonCode) {
            ErrorUtil.genModal("현재 서버에 오류가 있습니다.\n잠시후 다시 구매해주세요.")
            loading(false)
            return
        }

        if (!chatSvc.isLive()) {
            ErrorUtil.genModal(
                "현재 채팅연결이 끊어졌습니다\n 다시 입장해주세요.",
                () => navigate(Screen.NFTLIST),
                true
            )
            loading(false)
            return
        }

        getProducts({ skus: [Platform.OS == "android" ? shop?.sSkus : shop?.sProductCodeIos] })
            .then(() => {
                shopSvc
                    .purchase({
                        shopCode: shop?.nID,
                        seasonCode,
                        playerCode: code,
                        billStore: Platform.OS == "android" ? 1 : 2,
                    })
                    .then(async response => {
                        if (response) {
                            dataBeginNow = response?.BILL_BEGIN
                            const availablePur = {
                                seqNo: response?.BILL_BEGIN.SEQ_NO.toString(),
                                productId: Platform.OS == "android" ? shop?.sSkus : shop?.sProductCodeIos,
                            }
                            await AsyncStorage.setItem("AVAILABLE_PURCHASE_SEQ", JSON.stringify(availablePur))
                            const res =
                                Platform.OS == "android"
                                    ? await requestPurchase({ skus: [shop?.sSkus] })
                                    : await requestPurchase({ sku: shop?.sProductCodeIos })
                            loading(false)
                            console.log("response", response)
                            console.log("purchase res", res)
                        }
                    })
            })
            .catch((err: any) => {
                loading(false)
                Alert.alert("Error", err.toString())
            })
    }

    const loading = (status: boolean) => {
        store.dispatch(setGameLoader(status))
    }

    const repeatErrMsg = {
        type: ChatType.REPEAT,
        // contents: `도배 방지를 위해 ${
        //     jsonSvc.findConstById(20003).nIntValue
        // }초 동안 채팅 입력이 금지됩니다.`,
        seq: Date.now(),
        contents: jsonSvc.formatLocal(jsonSvc.findLocalById("9900011"), [
            jsonSvc.findConstById(20003).nIntValue.toString(),
        ]),
    } as IChatRes

    const onSubmit = () => {
        const submit = async () => {
            // addBotToChat([{
            //     seq: 114,
            //     contents: "test",
            //     statMsg: "birdie",
            //     statMsgColor: Colors.RED,
            //     type: ChatType.BOT,
            //     date: '2023-07-24',
            //     bdst: 50,
            //     training: 100,
            //     regAt: '2023-07-24'
            // }])
            // return

            if (!chatSvc.isLive()) {
                ErrorUtil.genModal(
                    "현재 채팅연결이 끊어졌습니다\n 다시 입장해주세요.",
                    () => navigate(Screen.NFTLIST),
                    true
                )
                return
            }

            const isvalid = chatInput.onValidCheck()

            if (isvalid) {
                if (!chatInput.value || chatInput.value.length < 1)
                    return

                Keyboard.dismiss()
                textInputRef.current?.blur()

                const res = chatSvc.sendMsg(chatInput.value, res => {
                    textInputRef.current?.clear()
                    setEnableSendBtn(false)

                    if (res === undefined)
                        pushMsg(repeatErrMsg)
                    //pushMsg(res !== undefined || res !== false ? res : repeatErrMsg)
                })

                if (res !== ResultSendMessage.Success) {
                    pushMsg(repeatErrMsg)
                }
                chatInput.onClear()
            }
            if (!isvalid) {
                setChatCaution(true)
                setTimeout(() => {
                    setChatCaution(false)
                }, 2000)
            }
        }

        submit()
    }

    const onDonateButton = async () => {
        await Analytics.logEvent(AnalyticsEventName.click_cash_support_50, {
            hasNewUserData: true,
            first_action: "FALSE",
            game_id: gameData?.GAME_CODE,
        })
        popUpDispatch({
            open: true,
            children: <DonateSelectPlayer onDonation={onDonation} profile={profile} gameData={gameData} />,
        })
    }

    const handleChatItemLayout = (layout: LayoutChangeEvent, index: number) => {
        while (chatItemHeights.current.length <= index) {
            chatItemHeights.current.push(0)
        }

        chatItemHeights.current[index] = layout.nativeEvent.layout.height
        if (index > 0)
            chatItemOffsets.current[index] = (chatItemHeights.current.slice(0, index).reduce((sum, value) => sum + value))
    }
    const getChatItemLayout = (data: any, index: number) => {
        if (index < 0 || index >= chatItemHeights.current.length)
            return { index: index, length: 0, offset: 0 }

        return {
            index: index, length: chatItemHeights.current[index], offset: index > 0 ? chatItemOffsets.current[index - 1] : 0
        }
    }

    const compareProps = (prevProps, nextProps) => {
        if (prevProps.item.seq !== nextProps.item.seq) {
            refChatDataUpated.current.set(nextProps.item.seq, Date.now())
            return false
        }

        if (refChatDataUpated.current.has(nextProps.item.seq)) {
            const lastUpdatedTm = refChatDataUpated.current.get(nextProps.item.seq)
            if (lastUpdatedTm && lastUpdatedTm + 60000 > Date.now()) {
                return true
            }
        }

        refChatDataUpated.current.set(nextProps.item.seq, Date.now())
        return false
    }
    const compareMsgProps = (prevProps, nextProps) => {
        if (prevProps.item.seq !== nextProps.item.seq ||  prevProps.item.isDeclare !== nextProps.item.isDeclare) {
            refChatDataUpated.current.set(nextProps.item.seq, Date.now())
            return false
        }

        if (refChatDataUpated.current.has(nextProps.item.seq)) {
            const lastUpdatedTm = refChatDataUpated.current.get(nextProps.item.seq)
            if (lastUpdatedTm && lastUpdatedTm + 60000 > Date.now()) {
                return true
            }
        }

        refChatDataUpated.current.set(nextProps.item.seq, Date.now())
        return false
    }

    const ChatRepeatItem = React.memo(({ item, index }: { item: IChatRes; index: number }) => {
        return (
            <View
                style={{
                    ...RatioUtil.sizeFixedRatio(320, 30),
                    backgroundColor: Colors.GRAY3,
                    ...RatioUtil.borderRadius(100),
                    alignItems: "center",
                    justifyContent: "center",
                    //marginTop: RatioUtil.lengthFixedRatio(5),
                    marginBottom: RatioUtil.lengthFixedRatio(10),
                }}
                //onLayout={(layout) => handleChatItemLayout(layout, index)}
            >
                <PretendText
                    style={{
                        color: Colors.WHITE,
                        fontSize: RatioUtil.font(14),
                        fontWeight: "400",
                    }}
                >
                    {item.contents}
                </PretendText>
            </View>
        )
    }, compareProps)

    const ChatCashItem = React.memo(({ item, index }: { item: IChatRes; index: number }) => {
        const { colors, thumbColor } = chatSvc.getCashColor(item.cash)

        if (refLastRecvCashItem.current >= 0 && refLastRecvCashItem.current == item.seq) {
            donatedDispatch({
                iconName: item.icon?.name ?? "",
                iconType: item.icon?.type ?? 0,
                cash: item.cash,
                nick: item.name,
                playerCode: item.playerCode,
            })
            refLastRecvCashItem.current = -1
        }

        const handleDeclarePress = () => {
            if (item.name === profile?.NICK) return

            popUpDispatch({
                open: true,
                children: <DeclareContents data={item} policeListen={policeListen} />,
            })
        }

        return (
            <CustomButton
                style={{
                    width: RatioUtil.lengthFixedRatio(320),
                    height: RatioUtil.lengthFixedRatio(60),
                    marginBottom: RatioUtil.lengthFixedRatio(10),
                }}
                onPress={handleDeclarePress}
                //onLayout={(layout) => handleChatItemLayout(layout, index)}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    colors={colors}
                    style={{
                        borderTopLeftRadius: RatioUtil.width(8),
                        borderTopRightRadius: RatioUtil.width(8),
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        //paddingVertical: RatioUtil.lengthFixedRatio(6),
                        paddingLeft: RatioUtil.lengthFixedRatio(20),
                        paddingRight: RatioUtil.lengthFixedRatio(16),
                        width: RatioUtil.lengthFixedRatio(320),
                        height: RatioUtil.lengthFixedRatio(30),
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <ProfileImage
                            style={{
                                ...RatioUtil.sizeFixedRatio(20, 20),
                                borderRadius: 15,
                            }}
                            name={item.icon?.name}
                            type={item.icon?.type}
                            resizeMode="contain"
                        />
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.WHITE,
                                marginLeft: RatioUtil.lengthFixedRatio(6),
                                textAlign: "center",
                            }}
                        >
                            {item.name ?? ""}
                        </PretendText>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14),
                                color: Colors.WHITE,
                                marginLeft: RatioUtil.lengthFixedRatio(6),
                            }}
                        >
                            {nftPlayerJson.find(e => e.nPersonID === item.playerCode)?.sPlayerName ?? ""}
                            {/* 후원 선수 이름 */}
                        </PretendText>
                    </View>
                    <View
                        style={{
                            backgroundColor: "transparent",
                            borderColor: Colors.WHITE,
                            borderWidth: 2,
                            borderRadius: 30,
                            height: RatioUtil.lengthFixedRatio(18),
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View
                            style={{
                                borderColor: Colors.WHITE,
                                borderWidth: 2,
                                marginLeft: RatioUtil.lengthFixedRatio(-2),
                                width: RatioUtil.lengthFixedRatio(18),
                                height: RatioUtil.lengthFixedRatio(18),
                                borderRadius: RatioUtil.lengthFixedRatio(30),
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "transparent",
                                //backgroundColor: thumbColor,
                            }}
                        >
                            <PretendText
                                style={{
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    fontSize: RatioUtil.font(10),
                                    color: Colors.WHITE,
                                }}
                            >
                                ￦
                            </PretendText>
                        </View>
                        <View
                            style={{
                                marginLeft: RatioUtil.lengthFixedRatio(2),
                                marginRight: RatioUtil.lengthFixedRatio(5),
                                height: RatioUtil.lengthFixedRatio(18),
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "transparent",
                                //backgroundColor: thumbColor,
                            }}
                        >
                            <PretendText
                                style={{
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    fontSize: RatioUtil.font(12),
                                    color: Colors.WHITE,
                                }}
                            >
                                {NumberUtil.denoteComma(item.cash)}
                            </PretendText>
                        </View>
                    </View>
                </LinearGradient>

                <View
                    style={{
                        backgroundColor: thumbColor + "1a",

                        width: RatioUtil.lengthFixedRatio(320),
                        height: RatioUtil.lengthFixedRatio(30),
                        ...RatioUtil.borderRadius(0, 0, 8, 8),
                        // position: "absolute",
                        // top: 0,
                        // left: 0,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            height: RatioUtil.lengthFixedRatio(30),
                        }}
                    >
                        <PretendText
                            style={{
                                color: item.isDeclare ? Colors.RED3 : Colors.GRAY2,
                                marginLeft: RatioUtil.width(16),
                                marginRight: RatioUtil.width(16),
                            }}
                        >
                            {/* {v.isDeclare ? "신고로 인해 숨겨진 메시지입니다." : v.contents} */}
                            {item.isDeclare ? jsonSvc.findLocalById("130004") : item.contents}
                        </PretendText>
                    </View>
                </View>
            </CustomButton>
        )
    }, compareProps)

    const ChatBotItem = React.memo(({ item, index }: { item: IBotMsg; index: number }) => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    marginBottom: RatioUtil.lengthFixedRatio(10),
                    justifyContent: "center",
                    alignItems: "center",
                }}
                key={index}
                //onLayout={(layout) => handleChatItemLayout(layout, index)}
            >
                {/* <ProfileImage style={{ ...RatioUtil.size(30, 30), borderRadius: 99 }} /> */}

                <View style={{ marginLeft: RatioUtil.width(5), flexDirection: "row" }}>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                        }}
                    >
                        {item.contents}
                        {"\r"}
                    </PretendText>

                    <PretendText
                        style={{
                            color: item.statMsgColor,
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            marginLeft: RatioUtil.width(5),
                        }}
                    >
                        {item.statMsg}
                    </PretendText>
                </View>
            </View>
        )
    }, compareProps)

    const ChatMsgItem = React.memo(({ item, index }: { item: IChatRes; index: number }) => {
        const handleProfilePress = async () => {
            await Analytics.logEvent(AnalyticsEventName.view_profile_160, {
                hasNewUserData: true,
            })
            navigate(Screen.USERPROFILE, { userSeq: item.userSeq })
        }
        const handleDeclareContents = () => {
            if (item.name === profile?.NICK) return

            popUpDispatch({
                open: true,
                children: <DeclareContents data={item} policeListen={policeListen} />,
            })
        }

        return (
            <View
                style={{
                    flexDirection: "row",
                    marginBottom: RatioUtil.lengthFixedRatio(10),
                    alignItems: "flex-start",
                }}
                key={index}
                //onLayout={(layout) => handleChatItemLayout(layout, index)}
            >
                <CustomButton onPress={handleProfilePress}>
                    <ProfileImage
                        name={item.icon?.name}
                        type={item.icon?.type}
                        style={{ ...RatioUtil.sizeFixedRatio(30, 30), borderRadius: 99 }}
                    />
                </CustomButton>
                <CustomButton
                    style={{
                        marginLeft: RatioUtil.width(5),
                        width: RatioUtil.width(280),
                    }}
                    onPress={handleDeclareContents}
                    disabled={item.isDeclare}
                >
                    <View style={{ flexDirection: "row" }}>
                        <PretendText style={liveStyle.cheerTab.chatName}>{item.name}</PretendText>
                        <PretendText style={liveStyle.cheerTab.chatDate}>
                            {`${DateUtil.agoUnit(item.date)}`}
                        </PretendText>
                    </View>
                    <PretendText
                        style={item.isDeclare ? liveStyle.cheerTab.chatDeclare : liveStyle.cheerTab.chatContents}
                    >
                        {/* {v.isDeclare ? "신고로 인해 숨겨진 메시지입니다." : v.contents} */}
                        {item.isDeclare ? jsonSvc.findLocalById("130004") : item.contents}
                    </PretendText>
                </CustomButton>
            </View>
        )
    }, compareMsgProps)

    const renderChatItem = useCallback(({ item, index }: { item: IChatRes | IRepeatRes | IBotMsg; index: number }) => {
        if (item.type === ChatType.REPEAT) return <ChatRepeatItem item={item} index={index} />

        if (item.type === ChatType.CASH) return <ChatCashItem item={item} index={index} />

        if (chatSvc.isChatBot(item)) return <ChatBotItem item={item} index={index} />

        if (item.type === ChatType.MSG) return <ChatMsgItem item={item} index={index} />

        return null
    }, [])

    const yOffset = React.useRef<number>(0);
    const prevContentSizeH = React.useRef<number>(0);

    const addOlderChatDatas = () => {
        if (refOldChatDatas.current.length < 1)
            return

        setChatList(state =>
            produce(state, draft => {
                draft.unshift(...refOldChatDatas.current)
                refOldChatDatas.current.splice(0)

                // if (refOldChatDatas.current.length <= loadDataSize) {
                //     draft.unshift(...refOldChatDatas.current)
                //     refOldChatDatas.current.splice(0)
                // }
                // else {
                //     draft.unshift(...refOldChatDatas.current.slice(refOldChatDatas.current.length - loadDataSize))
                //     refOldChatDatas.current.splice(refOldChatDatas.current.length - loadDataSize)
                // }
            })
        )
    }

    const handleContentSizeChange = (w: number, h: number) => {
        if (isBottomReached.current) {
            //flatlistRef.current?.scrollToEnd()
            flatlistRef.current?.scrollToOffset({ animated: refSocketConnectedTime.current + 2000 < Date.now(), offset: RatioUtil.height(150) * chatList.length })
            showBottomBtn(false)
        }
        else {
            showBottomBtn(true)
        }
    }
    const handleOnLayout = (event: LayoutChangeEvent) => {
        flatListHeight.current = (event.nativeEvent.layout.height)
    }
    const handleOnScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const isBottom = (event.nativeEvent.contentSize.height - flatListHeight.current - event.nativeEvent.contentOffset.y - 30 < 0)
        if (isBottom === isBottomReached.current)
            return

        isBottomReached.current = isBottom
        if (isBottomReached.current) {
            showBottomBtn(false)
        }
    }
    const handleInputFocus = () => {
        setInputMode(true)
    }
    const handleInputBlur = () => {
        setInputMode(false)
    }
    const handleInputChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        chatInput.onChange(e)
        //console.log(e.nativeEvent.text)
        setEnableSendBtn(e.nativeEvent.text.length > 0)
    }
    const handleMoveToBottom = () => {
        showBottomBtn(false)
        //flatlistRef.current?.scrollToEnd()
        flatlistRef.current?.scrollToOffset({ offset: RatioUtil.height(100) * chatList.length })
    }
    const handleOnEndReached = () => {
        isBottomReached.current = true
        addOlderChatDatas()
    }

    const keyExtractor = (item: IChatRes | IRepeatRes | IBotMsg) => {
        return item.seq.toString()
    }
    const handleFlatListRef = (ref) => {
        flatlistRef.current = ref
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            {/* <Button title="test" onPress={() => showPoint(0, 100, 10)}></Button> */}
            <LastDonate gameId={id} />
            {isCheerEnd ? (
                <View style={{ alignItems: "center", justifyContent: "center", height: "60%" }}>
                    {/* <PretendText>경기가 종료되어 응원이 마감되었습니다.</PretendText>
                    <PretendText> 다음 시즌에서 만나요!</PretendText> */}
                    <PretendText>{jsonSvc.findLocalById("140015")}</PretendText>
                </View>
            ) : (
                <>
                    {isEnd ? (
                        <View
                            style={{
                                ...RatioUtil.size(320, 60),
                                backgroundColor: Colors.BLACK,
                                opacity: 0.8,
                                alignItems: "center",
                                alignSelf: "center",
                                justifyContent: "center",
                                borderRadius: RatioUtil.width(5),
                            }}
                        >
                            <PretendText style={{ color: Colors.WHITE, fontWeight: RatioUtil.fontWeightBold() }}>
                                {/* {"경기가 종료되었습니다."} */}
                                {jsonSvc.findLocalById("140016")}
                            </PretendText>
                            <View style={{ flexDirection: "row" }}>
                                <PretendText style={{ color: "#FF9505", fontWeight: RatioUtil.fontWeightBold() }}>
                                    {/* {`${time}초`} */}
                                    {jsonSvc.formatLocal(jsonSvc.findLocalById("140017"), [time.toString()])}
                                </PretendText>
                                <PretendText style={{ color: Colors.WHITE, fontWeight: RatioUtil.fontWeightBold() }}>
                                    {/* {` 후 응원이 마감됩니다.`} */}
                                    {jsonSvc.findLocalById("140018")}
                                </PretendText>
                            </View>
                        </View>
                    ) : null}

                    <FlatList
                        ref={handleFlatListRef}
                        contentContainerStyle={{
                            paddingTop: RatioUtil.lengthFixedRatio(10),
                            paddingBottom: RatioUtil.lengthFixedRatio(10),
                        }}
                        style={[liveStyle.cheerTab.chatCon]}
                        data={chatList}
                        keyExtractor={keyExtractor}
                        renderItem={renderChatItem}
                        //getItemLayout={getChatItemLayout}
                        onContentSizeChange={handleContentSizeChange}
                        onLayout={handleOnLayout}
                        onScroll={handleOnScroll}
                        removeClippedSubviews={true}
                        disableVirtualization={false}
                        onEndReached={handleOnEndReached}
                        onEndReachedThreshold={10}
                    />

                    {isVisibleBottomBtn && (
                        <CustomButton
                            onPress={handleMoveToBottom}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                width: RatioUtil.width(106),
                                height: RatioUtil.heightFixedRatio(35),
                                position: "absolute",
                                bottom: RatioUtil.heightFixedRatio(113),
                                left: RatioUtil.width(123),
                            }}
                        >
                            <Shadow
                                distance={4}
                                startColor="#00000010"
                                style={{
                                    elevation: 5,
                                    borderRadius: RatioUtil.width(18),
                                    borderWidth: RatioUtil.width(1),
                                    borderColor: "#E6E6E6",
                                    width: RatioUtil.width(106),
                                    height: RatioUtil.heightFixedRatio(35),
                                    overflow: "hidden",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: Colors.WHITE
                                }}
                                offset={[2, 2]}
                            >
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        color: "#87878D"
                                    }}
                                >
                                    아래로 이동
                                </PretendText>
                                <SvgIcon
                                    name="Arrow"
                                    style={{
                                        width: RatioUtil.width(16),
                                        height: RatioUtil.heightFixedRatio(16),
                                        marginRight: RatioUtil.width(-5),
                                        marginLeft: RatioUtil.width(3),
                                        transform: [{ rotate: "180deg" }],
                                    }}
                                />
                            </Shadow>
                        </CustomButton>
                    )}

                    <KeyboardAvoidingView
                        behavior="position"
                        keyboardVerticalOffset={Platform.OS === "ios" ? RatioUtil.heightSafeArea(300) : RatioUtil.heightSafeArea(-40)}
                        style={{ 
                            ...RatioUtil.paddingFixedRatio(10, 20, 10, 20), 
                            marginTop: (isInputMode) ? 0 : RatioUtil.heightSafeArea(40),
                        }}
                    >
                        {chatCaution ? (
                            <View
                                style={{
                                    ...RatioUtil.sizeFixedRatio(340, 30),
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    ...RatioUtil.borderRadius(20, 20, 20, 20),
                                    marginBottom: RatioUtil.lengthFixedRatio(10),
                                    alignItems: "center",
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    //...metaProps.errorCon.style,
                                    zIndex: 10,
                                }}
                            >
                                <PretendText style={liveStyle.cheerTab.errorMsg}>{chatInput.errorMsg}</PretendText>
                            </View>
                        ) : null}
                        <View style={[liveStyle.cheerTab.chatInputCon, { zIndex: 10 }]}>
                            <TextInput
                                ref={textInputRef}
                                style={{
                                    fontSize: RatioUtil.font(13),
                                    ...RatioUtil.paddingFixedRatio(11, 83, 11, 10),
                                    borderWidth: 1,
                                    borderRadius: RatioUtil.width(5),
                                    borderColor: Colors.GRAY,
                                    backgroundColor: Colors.WHITE,
                                    color: Colors.BLACK,
                                    width: (isInputMode ? RatioUtil.width(320) : RatioUtil.width(262)),
                                    minHeight: RatioUtil.heightFixedRatio(48),
                                    textAlignVertical: "center",
                                }}
                                multiline={true}
                                placeholder={
                                    // "메시지 보내기"
                                    jsonSvc.findLocalById("130002")
                                }
                                onSubmitEditing={onSubmit}
                                blurOnSubmit={true}
                                placeholderTextColor={Colors.GRAY3}
                                maxLength={chatInput.maxLength}
                                // onSubmitEditing={onSubmit}
                                onFocus={handleInputFocus}
                                onBlur={handleInputBlur}
                                textAlignVertical={"center"}
                                onChange={handleInputChange}
                                value={chatInput.value}
                            />
                            <View
                                style={{
                                    position: "absolute",
                                    width: RatioUtil.lengthFixedRatio(73),
                                    height: RatioUtil.lengthFixedRatio(30),
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    right: (isInputMode ? RatioUtil.width(10) : RatioUtil.width(60)),
                                    bottom: RatioUtil.heightFixedRatio(9),
                                    zIndex: 1
                                }}
                            >
                                <CustomButton
                                    onPress={onSubmit}
                                    style={{
                                        alignItems: "center",
                                        ...RatioUtil.sizeFixedRatio(30, 30),
                                        justifyContent: "center",
                                    }}
                                >
                                    <Image
                                        source={enableSendBtn ? liveImg.sendOn : liveImg.sendOff}
                                        resizeMode="contain"
                                        style={{
                                            width: RatioUtil.width(30),
                                            height: RatioUtil.width(30),
                                            marginRight: RatioUtil.width(10),
                                        }}
                                    />
                                </CustomButton>
                                <CustomButton
                                    onPress={onDonateButton}
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(30, 30),
                                        // left: RatioUtil.width(225),
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Image
                                        source={liveImg.donateImg}
                                        resizeMode="contain"
                                        style={{
                                            width: RatioUtil.width(30),
                                            height: RatioUtil.width(30),
                                            marginRight: RatioUtil.width(3),
                                        }}
                                    />
                                </CustomButton>
                            </View>
                            <HeartContents
                                selectPlayer={selectPlayer}
                                setSelectPlayer={setSelectPlayer}
                                id={id}
                                gameData={gameData}
                                isVisible={!isInputMode}
                                onAnimate={onAnimate}
                                onAnimationStart={id => onAnimationStart(id)}
                            />
                        </View>
                    </KeyboardAvoidingView>
                </>
            )}

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
        </View>
    )
}

export default CheerTab

interface IChearTab {
    id: number
    gameData?: ISeasonDetail
    isEnd: boolean
    onAnimate: () => void
    onAnimationStart: (id: number) => void
    callAnimation: (res: any) => void
    botIdx: number
    showPoint: (seq: number, training: number, bdst: number) => void
    showPoints: (points: { seq: Number; training: Number; bdst: Number }[]) => void
    setBotIdx: React.Dispatch<React.SetStateAction<number>>
    //getRecvChatDatas: () => Array<IChatRes | IRepeatRes | IBotMsg>
}

interface IRankData {
    gameCode: number
    type: string
    rankList: {
        playerCode: number
        score: number
        rank: number
        info: IPlayer | undefined
    }[]
}
