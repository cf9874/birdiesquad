import React, { useState, useEffect, Fragment, useRef, useCallback } from "react"
import {
    View,
    TouchableOpacity,
    Image,
    ImageBackground,
    Modal,
    Alert,
    Platform,
    ActivityIndicator,
    Pressable,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    Dimensions,
} from "react-native"
import {
    useAsyncEffect,
    useDimension,
    useFcmServices,
    useKeyboardVisible,
    useQuery,
    useScreen,
    useToggle,
    useWrapDispatch,
} from "hooks"
import { ConfigUtil, DateUtil, navigate, RatioUtil, checkStopNFT, NumberUtil, GameUtil, ErrorUtil } from "utils"
import { CustomButton, PretendText } from "components/utils"
import {
    AnalyticsEventName,
    Category,
    Colors,
    Dimension,
    GameStatus,
    Grade,
    NftFilterKey,
    NftFilterType,
    NftSortKey,
    Screen,
    ThirdPartyAnalyticsEventName,
    nftFilterMenu,
    nftSortMenu,
} from "const"
import { HomeHeader, MainHeader, MyPageFooter, PageFooterHeight, ProfileHeader } from "components/layouts"
import {
    jsonSvc,
    profileSvc,
    rewardSvc,
    nftSvc,
    liveSvc,
    rewardByAccessSvc,
    raffleSvc,
    mySquadSvc,
    rankSvc,
} from "apis/services"
import {
    NFTCardImages,
    coninImg,
    homeImg,
    liveImg,
    nftDetailImg,
    playerCardImg,
    rankImg,
    FanRank,
    MySquadImg,
    IntroImg,
    TutorialBox,
} from "assets/images"
import {
    IRewardSize,
    ICompetition,
    ICompetitionRoundDetail,
    IRound,
    ISeasonDetail,
    IBdstPlayer,
} from "apis/data/season.data"
import dayjs from "dayjs"
import { WalletToast } from "./components"
import { setLoading, setModal, setPopUp, setToast } from "store/reducers/config.reducer"
import { homeStyle, liveGeneral, mineCompoStyle, rankStyle, playerStyle } from "styles"
import { myPageImg } from "assets/images"
import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import { Carousel, useCarousel } from "components/Carousel"
import { WalletImg } from "assets/images"
import NftImage from "components/utils/NFTImage"
import { PlayerPupUp } from "./components/player"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { NftApiData, RaffleListResultPopup } from "apis/data"
import moment from "moment"
import { Shadow } from "react-native-shadow-2"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { NotifiModal } from "components/Common"
import { ITEM_TYPE } from "const/item.const"
import { HOME_SCREEN_TUTORIAL, SIGNUP_REWARD, TutorialId } from "const/wallet.const"
import { Svg, Path, Polygon } from "react-native-svg"
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { InAppBrowser } from "react-native-inappbrowser-reborn"
import { callSetGameApi, isPossibleRewardDateCheck } from "common/GlobalFunction"
import store from "store"
import { setGameLoader, setSetGameModalData } from "store/reducers/getGame.reducer"
import DeviceInfo from "react-native-device-info"

import semver from "semver"
// import { AppForceUpdatePopup } from "./components/popup/appForceUpdate.popup"

import { MySquadList } from "apis/data/mySquad.data"
import { useDispatch, useSelector } from "react-redux"
import { setGameSeq, gameRound, gameFilterMonday, setGameCode } from "store/reducers/mySquad.reducer/index"
import { APP_USER_ID, NFT_S3, TOKEN_ID } from "utils/env"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
    setNumNfts,
    setNumItems,
    setIsNeedNftUpdate,
    setIsNeedItemUpdate,
    setNfts,
    setItems,
} from "store/reducers/myNft.reducer"
import { setTourGameCalculateResult } from "store/reducers/tourGameCalculate"
import { BlurView } from "@react-native-community/blur"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import FastImage from "react-native-fast-image"
import { isNull } from "lodash"
import { SvgIcon } from "components/Common/SvgIcon"
import nftplayerJson from "json/nft_player.json"
import { scaleSize } from "styles/minixs"
import { Analytics } from "utils/analytics.util"

const ItemListScreen = () => {
    /*state */
    const [showHomeScreenTutorial, setShowHomeScreenTutorial] = useState<boolean>(false)
    const [showSignReward, setShowSignReward] = useState<boolean>(false)
    const [step, setStep] = useState<number>(1)
    const [eventVisible, setEventVisible] = useState<boolean>(false)
    const [listRafflePopup, setListRafflePopup] = useState<RaffleListResultPopup[]>([])
    const [numberEvent, setNumberEvent] = useState<number>(1)
    const [tutorialSlideIndex, setTutorialSlideIndex] = useState<number>(1)
    const [asset, setAsset] = useState<IAsset>({
        bdst: 0,
        tbora: 0,
        trainingPoint: 0,
    })

    useFocusEffect(
        useCallback(() => {
            ;(async () => {
                let retentionDate = await ConfigUtil.getStorage<{ day: number; lastCheck: dayjs.Dayjs }>("retention")
                const currentDate = dayjs()

                if (!retentionDate) {
                    //데이터가 없으면 1일차로 판단
                    retentionDate = {
                        day: 1,
                        lastCheck: currentDate,
                    }
                    await AsyncStorage.setItem("retention", JSON.stringify(retentionDate))
                } else {
                    const lastCheck = dayjs(retentionDate.lastCheck)
                    const diffDays = currentDate.diff(lastCheck, "day")

                    if (diffDays >= 1) {
                        retentionDate.day += 1
                        retentionDate.lastCheck = currentDate
                        await AsyncStorage.setItem("retention", JSON.stringify(retentionDate))
                    }
                }

                const callLogDateList = [1, 7, 30, 60, 90]

                if (callLogDateList.includes(retentionDate.day)) {
                    await Analytics.logEvent(
                        AnalyticsEventName[`retention_d${retentionDate.day}` as AnalyticsEventName]
                    )
                }
            })()
        }, [])
    )
    const [itemSelection, setItemSelection] = useState<any>({})
    const [isVisiblePlayer, setIsVisiblePlayer] = useState(false)
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [nftDisabled, setNftDisabled] = useState(false)
    //const [item, setItem] = useState<IItem[]>([])
    const [gameIds, setGameIds] = useState<IChannel[]>([])
    // const [arrForGameList, setArrForGameList] = useState<any>([])
    const [round, setRound] = useState<number>(0)
    const [reRender, renderToggle] = useToggle()
    const [itemVisible, setItemVisible] = useState(true)
    const [isGrow, setIsGrow] = useState(false)
    const [hasLive, setHasLive] = useState(true)
    const [rewardSeq, setRewardSeq] = useState<number>(0)
    const [rewardCount, setRewardCount] = useState<number>(0)
    const [expectReward, setExpectReward] = useState<number>()

    //const [nftList, setNftList] = useState<NftApiData.NftList.ResDto["data"]>([])
    //const [nftData, setNftData] = useState<NftApiData.NftList.ResDto["data"]>([])
    //const [allNft, setAllNft] = useState<NftApiData.NftList.ResDto["data"]>([])
    //const [nftPageIndex, setNftPageIndex] = useState(1)

    /**BottomSheet state*/
    const bottomSheetRef = useRef<BottomSheet>(null)
    /**modal state */
    const renderScene = SceneMap({
        help: Help,
    })
    const [index, setIndexRankHelp] = useState(0)
    const [routes] = useState([{ key: "help", title: "" }])
    const [isVisibleRankHelp, setIsVisibleRankHelp] = useState(false)
    /* state for test tour reward  */
    const [isVisibleTourReward, setIsVisibleTourReward] = useState(true)
    const [tourRewardData, setTourRewardData] = useState<ITourReward>()
    const [rewardCheerDataforTest, setRewardCheerDataforTest] = useState<IRewardCheer>()
    const [gameCode, setGameCode] = useState<string>("80069419")
    const [rewardTestId, setRewardTestId] = useState<string>("80069421")
    const [testID, setTestID] = useState<number>(80069420)

    const [liveGameData, setLiveGameData] = useState<ISeasonDetail>()
    const onSelectRankHelp = (data: React.SetStateAction<number>) => {
        setIndexRankHelp(data)
    }
    /* state for real tour reward  */
    const [latestGame, setLatestGame] = useState<ISeasonDetail>()
    const [tourReward, setTourReward] = useState<ITourReward>()
    const [cheerReward, setCheerReward] = useState<IRewardCheer>()
    const [openTourReward, setOpenTourReward] = useState<boolean>(false)
    const [settleTime, setSettleTime] = useState(false)
    // const [FourceUpdateModalVisible, setFourceUpdateModalVisible] = useState(false)

    //const [myNfts, setMyNfts] = useState<NftApiData.NftList.ResDto["data"]>()
    //const [nftCount, setNftCount] = useState<number>()
    const [page, setPage] = useState(2)

    const myNfts = useSelector((state: any) => state.myNftReducer.nfts)
    const nftCount = useSelector((state: any) => state.myNftReducer.numNfts)
    const isNeedNftUpdate = useSelector((state: any) => state.myNftReducer.isNeedNftUpdate)

    const item = useSelector((state: any) => state.myNftReducer.items)
    const itemCount = useSelector((state: any) => state.myNftReducer.numItems)
    const isNeedItemUpdate = useSelector((state: any) => state.myNftReducer.isNeedItemUpdate)

    const dispatch = useDispatch()

    /* utils */

    /**list sort */
    // const listSort = (list: ISeasonDetail[]) => {
    //     return list.sort((a, b) => {
    //         const order: Record<string, number> = {
    //             BEFORE: 0,
    //             LIVE: 1,
    //             END: 2,
    //         }
    //         return order[a.gameStatus] - order[b.gameStatus]
    //     })
    // }

    /**game status */
    const getGameStatus = useCallback(
        (gamestatus: string) => {
            switch (gamestatus) {
                case GameStatus.BEFORE:
                    // return "경기 예정"
                    return jsonSvc.findLocalById("120013")
                case GameStatus.CONTINUE:
                    // return `${round}ROUND`
                    return jsonSvc.formatLocal(jsonSvc.findLocalById("120014"), [(round + 1).toString()])
                case GameStatus.LIVE:
                    // return "LIVE"
                    return jsonSvc.findLocalById("120016")
                case GameStatus.SUSPENDED:
                    // return "LIVE"
                    return jsonSvc.findLocalById("TOUR_SUSPENDED")
                case GameStatus.END:
                    // return "경기 종료"
                    return jsonSvc.findLocalById("7006")
                default:
                    return ""
            }
        },
        [round]
    )

    /* get & set Data*/
    // const getNftList = async (page: number = 1) => {
    //     const listNFT = await nftSvc.getMyNftList({ order: "DESC", take: 10, page: page })
    //     const list = [...(nftData ?? []), ...listNFT.data]
    //     const newList = list.reduce((acc: NftApiData.NftData[], cur: NftApiData.NftData) => {
    //         if (acc.findIndex(({ seq }) => seq === cur.seq) === -1) {
    //             acc.push(cur)
    //         }
    //         return acc
    //     }, [])
    //     setNftData(newList)

    //     setNftList(newList)
    // }

    // const getAllNft = async () => {
    //     const allNft = await nftSvc.getMyNftList({ order: "ASC", take: 0, page: 1 })
    //     setAllNft(allNft.data)

    //     const newList = allNft.data.reduce((acc: NftApiData.NftData[], cur: NftApiData.NftData) => {
    //         if (acc.findIndex(({ seq }) => seq === cur.seq) === -1) {
    //             acc.push(cur)
    //         }
    //         return acc
    //     }, [])
    //     setNftData(newList)

    //     setNftList(newList)
    // }
    const setStorageData = async (key: string, value: string): Promise<boolean> => {
        try {
            await AsyncStorage.setItem(key, value)
            return true
        } catch (e: any) {
            console.error(e.message)
            return false
        }
    }
    const getStorageData = async (key: string): Promise<string | null> => {
        try {
            return await AsyncStorage.getItem(key)
        } catch (e: any) {
            console.error(e.message)
            return null
        }
    }

    const getAllNft = async () => {
        dispatch(setIsNeedNftUpdate(false))

        const allNft = await nftSvc.getMyNftListSpending({
            order: "ASC",
            take: 0,
            page: 1,
            filterType: NftFilterType.PROFILE,
        })
        if (!allNft) {
            dispatch(setIsNeedNftUpdate(true))
            return
        }

        dispatch(setNfts(allNft.data))
        dispatch(setNumNfts(allNft.data.length))
    }

    const getItemInfo = async () => {
        dispatch(setIsNeedItemUpdate(false))

        const asset = await profileSvc.getAsset()
        if (!asset) {
            dispatch(setIsNeedItemUpdate(true))
            return
        }

        const { bdst, tbora, training } = asset?.asset
        setAsset({ bdst: bdst ?? 0, tbora: tbora ?? 0, trainingPoint: training ?? 0 })

        const response = await nftSvc.getMyItem({ order: "DESC", page: 1, take: 0 })
        const dataItem = response.data
            .map(item => {
                const infoItem = jsonSvc.filterItemByType(item.itemId, [ITEM_TYPE.DONATE])
                return infoItem ? { ...item, sIcon: infoItem.sIcon } : item
            })
            .filter(e => e.sIcon !== undefined)

        dispatch(setItems(dataItem))
        dispatch(setNumItems(dataItem.length))

        return dataItem
    }

    const [loading, setLoading] = useState(false)

    const getExpectReward = async () => {
        if (!liveGameData?.GAME_CODE) return
        const gameData = await liveSvc.getGameDetail(liveGameData?.GAME_CODE)

        if (!gameData) return
        setLoading(true)
        const expectRewardValue = await rewardSvc.getTotalBdstForPlayerList(gameData)
        setExpectReward(Number(expectRewardValue))

        setLoading(false)
    }

    const getListRafflePopup = async () => {
        const response = await raffleSvc.raffleListResultPopup()
        if (!response) return
        if (response.length == 0) {
            setEventVisible(false)
        } else {
            await Analytics.logEvent(AnalyticsEventName.view_event_popup_40, { hasNewUserData: true })
            setListRafflePopup(response)
            setNumberEvent(1)
            setEventVisible(true)
        }
    }
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_home_45, { newWserCheck: true })
    }, [])
    // // 앱 버전 체크
    // const currentVersion = DeviceInfo.getVersion() // 사용자의 현재 앱 버전을 가져옴
    // const appInfoData = useSelector((state: any) => state.appVersionInfoReducer)

    // useEffect(() => {
    //     if (appInfoData.appForceVersion && semver.lt(currentVersion, appInfoData.appForceVersion)) {
    //         setFourceUpdateModalVisible(true)
    //     }
    // }, [appInfoData])

    // Event popup
    useEffect(() => {
        ;(async () => {
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
            const status = await AsyncStorage.getItem(USER_ID + HOME_SCREEN_TUTORIAL)
            if (status !== "1") {
                getListRafflePopup()
            }
        })()
    }, [])

    const openLinkRafflePopup = async (URL: string) => {
        try {
            if (await InAppBrowser.isAvailable()) {
                const result = await InAppBrowser.open(URL, {
                    // iOS Properties
                    dismissButtonStyle: "close",
                    preferredBarTintColor: Colors.WHITE,
                    preferredControlTintColor: Colors.BLACK,
                    readerMode: false,
                    animated: true,
                    modalPresentationStyle: "fullScreen",
                    modalTransitionStyle: "coverVertical",
                    modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: Colors.WHITE,
                    secondaryToolbarColor: Colors.WHITE,
                    navigationBarColor: Colors.WHITE,
                    navigationBarDividerColor: Colors.BLACK,
                    enableUrlBarHiding: true,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false,
                    animations: {
                        startEnter: "slide_in_right",
                        startExit: "slide_out_left",
                        endEnter: "slide_in_left",
                        endExit: "slide_out_right",
                    },
                    headers: {
                        "my-custom-header": "my custom header value",
                    },
                })
            } else Linking.openURL(URL)
        } catch (error: any) {
            console.error(error?.message)
        }
    }

    // isFirst

    useFocusEffect(
        React.useCallback(() => {
            ;(async () => {
                const openBottomSheet = await AsyncStorage.getItem("openBottomSheet")
                console.log("openBottomSheet: " + openBottomSheet)
                if (openBottomSheet === "1") {
                    refNftBottomSheet.current?.snapToIndex(1)
                    AsyncStorage.setItem("openBottomSheet", "0")
                }

                await getAllNft()
                const myItem = await getItemInfo()
                // *-*-
                const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
                const status = await AsyncStorage.getItem(USER_ID + HOME_SCREEN_TUTORIAL)

                if (!myItem) return
                if (status === "1") {
                    const signupRewardSeq = await AsyncStorage.getItem(SIGNUP_REWARD)
                    const data = await rewardByAccessSvc.handleRewardByAccess()
                    const signupReward = myItem.find(e => e.seq === Number(signupRewardSeq))

                    refNftBottomSheet.current?.snapToIndex(0)

                    if (data && data.reward.SEQ_NO) {
                        setRewardSeq(data.reward.SEQ_NO)
                        setRewardCount(data.count)
                        setShowSignReward(true)
                    } else {
                        if (data && signupReward && signupReward.seq === parseInt(signupRewardSeq ?? "")) {
                            setRewardSeq(signupReward.seq)
                            setRewardCount(data.count)
                            await Analytics.logEvent(AnalyticsEventName.view_open_20, {
                                hasNewUserData: true,
                            })
                            setShowSignReward(true)
                        } else {
                            setShowHomeScreenTutorial(true)
                            await Analytics.logEvent(AnalyticsEventName.view_tuto_1_30, {
                                hasNewUserData: true,
                            })
                        }
                    }
                } else {
                    setShowHomeScreenTutorial(false)
                    const data = await rewardByAccessSvc.handleRewardByAccess()
                    renderToggle()
                    if (data && data.reward.SEQ_NO) {
                        setRewardSeq(data.reward.SEQ_NO)
                        setRewardCount(data.count)
                        await Analytics.logEvent(AnalyticsEventName.view_open_20, {
                            hasNewUserData: true,
                        })
                        setShowSignReward(true)
                    } else {
                        setShowSignReward(false)
                    }
                }
            })()
        }, [])
    )

    const handleUnboxing = async (seq: number, itemId: number, isReward?: boolean) => {
        try {
            const response = await nftSvc.doOpenLucky({ ITEM_SEQ: seq })
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
            const status = await AsyncStorage.getItem(USER_ID + HOME_SCREEN_TUTORIAL)
            if (!response?.USER_NFT) return
            navigate(Screen.UNBOXINGVIDEO, {
                nftseq: response.USER_NFT.SEQ_NO,
                playerCode: response.USER_NFT.PLAYER_CODE,
                nID: itemId,
                isFirst: status === "1" ? true : false,
                toNavigate: Screen.NFTLIST,
                isReward,
                rewardCount: rewardCount,
            })
        } catch (error: any) {
            Alert.alert(error.toString())
        }
    }

    const handleConfirm = async () => {
        if (!itemSelection) return

        const infoItem = jsonSvc.findItemById(itemSelection.itemId)
        if (!infoItem) return

        if ([ITEM_TYPE.SHOPCHOICE, ITEM_TYPE.FREECHOICE].includes(infoItem?.nType)) {
            setIsVisiblePlayer(!isVisiblePlayer)
        } else if (
            [ITEM_TYPE.FREENORMAL, ITEM_TYPE.SHOPNORMAL, ITEM_TYPE.FREEPREMIUM, ITEM_TYPE.SHOPPREMIUM].includes(
                infoItem?.nType
            )
        )
            await handleUnboxing(itemSelection.seq, itemSelection.itemId)
    }
    /* check tour reward popup open */
    // const checkRewardPopupOpen = async () => {}

    /*TEST GAMELIST */
    useFocusEffect(
        React.useCallback(() => {
            const fetchSeasonKey = async () => {
                const filterDate = new Date("2023-07-11")
                const seasonKey = await liveSvc.getSetSeason()
                const gameList = await liveSvc.getGameList(seasonKey)

                const sortedGames = await sortGames(gameList, seasonKey, GameStatus.END)
                const reversedSortedGames = sortedGames.reverse().filter(e => dayjs(e.BEGIN_AT) > dayjs(filterDate))
                const sortedFutureGames = await sortGames(gameList, seasonKey, GameStatus.BEFORE)

                let lastGame = gameList.find(
                    game =>
                        game.gameStatus === GameStatus.LIVE ||
                        game.gameStatus === GameStatus.CONTINUE ||
                        game.gameStatus === GameStatus.SUSPENDED
                )
                if (lastGame) {
                    setLiveGameData(lastGame)
                }
                // else {
                //     const existingGameIds = new Set([
                //         ...reversedSortedGames.map(game => game.gameId),
                //         ...sortedFutureGames.map(game => game.gameId),
                //     ])

                //     const recentGame = gameList
                //         .filter(
                //             game =>
                //                 (game.gameStatus === GameStatus.END || game.gameStatus === GameStatus.CONTINUE) &&
                //                 !existingGameIds.has(game.gameId)
                //         )
                //         .sort(
                //             (a, b) =>
                //                 DateUtil.parseDate(b.startDate).getTime() - DateUtil.parseDate(a.startDate).getTime()
                //         )[0]

                //     if (recentGame) {
                //         recentGame.gameStatus = GameStatus.LIVE
                //         lastGame = recentGame
                //         setLiveGameData(lastGame)
                //     }
                // }

                const { data: roundData } = GameUtil.checkRound(lastGame)
                const { current, prev, isEnd } = roundData.round
                const roundSeq = isEnd ? prev : current
                const mixGameList = lastGame
                    ? [...reversedSortedGames, lastGame, ...sortedFutureGames]
                    : [...reversedSortedGames, ...sortedFutureGames]

                const gameIds = createGameIds(mixGameList)
                setGameIds(gameIds)
                setHasLive(!!lastGame)

                if (roundSeq === undefined || roundSeq === null) return

                setRound(roundSeq)
            }

            const sortGames = async (gameList: ISeasonDetail[], seasonKey: number, status: GameStatus) => {
                const isEnd = status === GameStatus.END
                const games = gameList.filter(game => game.gameStatus === status)

                if (games.length < 5) {
                    const key = isEnd ? seasonKey - 1 : seasonKey + 1
                    const replenishList = await liveSvc.getGameList(key)
                    games.push(...replenishList)
                }

                return games.sort(sortByDate).slice(0, isEnd ? 5 : 3)
            }

            const sortByDate = (a: ISeasonDetail, b: ISeasonDetail) => {
                const dateA = DateUtil.parseDate(a.startDate)
                const dateB = DateUtil.parseDate(b.startDate)
                const currentDate = new Date()
                const diffA = Math.abs(dateA.getTime() - currentDate.getTime())
                const diffB = Math.abs(dateB.getTime() - currentDate.getTime())

                return diffA - diffB
            }

            const createGameIds = (gameList: ISeasonDetail[]) => {
                return gameList.map(game => {
                    return {
                        id: game.gameId,
                        gameStatus: game.gameStatus,
                        seasonKey: game.SEASON_CODE,
                        liveLink: "",
                        BEGIN_AT: game.BEGIN_AT,
                        gameName: game.gameName,
                        startTime: game.startTime,
                        startDate: game.startDate,
                    }
                })
            }

            fetchSeasonKey()
            // checkTourReward()
            getExpectReward()
            getTourReward()
        }, [round])
    )
    useFocusEffect(
        React.useCallback(() => {
            getItemInfo()
            getAllNft()
            //getMyNftListSpending()
        }, [reRender])
    )

    // function test Tour Rewards
    // const testOnPressReward = async () => {
    //     setIsVisibleTourReward(true)
    //     await rewardSvc.postTourRewardApi({ gameId: parseInt(gameCode) })
    //     renderToggle()
    // }

    // function test Tour Rewards
    // const testTourReward = async () => {
    //     const sortGame = async (status: "END" | "BEFORE") => {
    //         const isEnd = status === "END"

    //         const games = gameList.filter(game => game.gameStatus === status)
    //         if (games.length < 5) {
    //             const key = isEnd ? seasonKey - 1 : seasonKey + 1
    //             const replenishList = await liveSvc.getGameList(key)
    //             games.push(...replenishList)
    //         }
    //         const sorted = games.sort((a, b) => {
    //             const dateA = DateUtil.parseDate(a.startDate)
    //             const dateB = DateUtil.parseDate(b.startDate)
    //             const currentDate = new Date()
    //             const diffA = Math.abs(dateA.getTime() - currentDate.getTime())
    //             const diffB = Math.abs(dateB.getTime() - currentDate.getTime())

    //             return diffA - diffB
    //         })

    //         return sorted.slice(0, isEnd ? 5 : 3)
    //     }
    //     const seasonKey = await liveSvc.getSetSeason()
    //     const gameList = await liveSvc.getGameList(seasonKey)
    //     const sortedGames = await sortGame("END")
    //     const reversedSortedGames = sortedGames.reverse()
    //     const data = await liveSvc.showReward(parseInt(gameCode))
    //     if (!data) return
    //     setTourRewardData({
    //         GAME_CODE: parseInt(gameCode),
    //         REWARD_BDST: data.REWARD_TOUR.REWARD_BDST,
    //         REWARD_TRAINING: data.REWARD_TOUR.REWARD_TRAINING,
    //         BEGIN_AT: reversedSortedGames.find(e => e.GAME_CODE === parseInt(gameCode))?.BEGIN_AT ?? "",
    //         END_AT: reversedSortedGames.find(e => e.GAME_CODE === parseInt(gameCode))?.END_AT ?? "",
    //         GAME_NAME: reversedSortedGames.find(e => e.GAME_CODE === parseInt(gameCode))?.gameName ?? "",
    //     })
    //     setRewardCheerDataforTest({
    //         GAME_CODE: parseInt(gameCode),
    //         PLAYER_CODE: data.REWARD_CHEER.PLAYER_CODE,
    //         RANK_TYPE: data.REWARD_CHEER.RANK_TYPE,
    //         RANK_USERS: data.REWARD_CHEER.RANK_USERS,
    //     })

    //     setIsVisibleTourReward(false)
    // }

    const timeToText = (day: any) => {
        const date = moment(day)
        let dDisplay = date.date() + "일"
        let mDisplay = date.month() + 1 + "월  "
        return { type1: mDisplay + dDisplay }
    }

    const settleDateRange = async () => {
        const settleRange = await callSetGameApi(false)
        setSettleTime(!settleRange)
    }

    const getTourReward = async () => {
        const seasonKey = await liveSvc.getSetSeason()
        const gameList = await liveSvc.getGameList(seasonKey)

        if (!gameList) return

        const LatestGame = gameList.reduce((prev, current) => {
            if (current.gameStatus === GameStatus.END) {
                return !prev || new Date(prev.END_AT) < new Date(current.END_AT) ? current : prev
            }
            return prev
        }, null as unknown as ISeasonDetail)

        if (!LatestGame) return

        setLatestGame(LatestGame)

        const possibleGetReward = isPossibleRewardDateCheck(LatestGame.END_AT)
        if (!possibleGetReward) return

        // const data = await liveSvc.showReward(LatestGame.GAME_CODE)
        const data = await liveSvc.showReward(LatestGame.GAME_CODE)

        // 내 보상이 0 이면 return
        if (
            !data ||
            (data.REWARD_TOUR.REWARD_BDST === 0 &&
                data.REWARD_TOUR.REWARD_TRAINING === 0 &&
                data.REWARD_CHEER.RANK_USERS[0].EXPECT_BDST === 0)
        ) {
            return
        }

        // 보상을 받았는지 확인
        const didGetreward = await liveSvc.checkGetReward(LatestGame.GAME_CODE)

        setOpenTourReward(!didGetreward)
        settleDateRange()

        if (settleTime && openTourReward) {
            await Analytics.logEvent(AnalyticsEventName.view_tour_reward_35, { hasNewUserData: true })
        }
        // setSettleTime(!settleTime)
        setTourReward({
            GAME_CODE: LatestGame.GAME_CODE,
            REWARD_BDST: data.REWARD_TOUR.REWARD_BDST,
            REWARD_TRAINING: data.REWARD_TOUR.REWARD_TRAINING,
            BEGIN_AT: LatestGame.BEGIN_AT,
            END_AT: LatestGame.END_AT,
            GAME_NAME: LatestGame.gameName,
        })
        setCheerReward({
            GAME_CODE: LatestGame.GAME_CODE,
            PLAYER_CODE: data.REWARD_CHEER.PLAYER_CODE,
            RANK_TYPE: data.REWARD_CHEER.RANK_TYPE,
            RANK_USERS: data.REWARD_CHEER.RANK_USERS,
        })
    }

    // *-
    const onPressReward = async (gameCode: number) => {
        if (!latestGame) return
        await Analytics.logEvent(AnalyticsEventName.click_get_reward_35, { hasNewUserData: false })
        await rewardSvc.postTourRewardApi({ gameId: gameCode })

        renderToggle()
    }

    const checkUserRank = (data: IRewardCheer | undefined) => {
        const rank = data?.RANK_USERS[0].RANK
        if (data?.PLAYER_CODE == 1) {
            // return `순위 ${rank}위` //1st
            return jsonSvc.formatLocal(jsonSvc.findLocalById("7021"), [(rank ?? "").toString()])
        }
        if (data?.PLAYER_CODE != -1 && rank == -1) {
            // return "순위 없음" // no rank
            return jsonSvc.findLocalById("150101") // no rank
        }
        if (data?.PLAYER_CODE != -1 && rank != -1) {
            // return "다음 대회를 노려보세요!" // next competition
            return jsonSvc.findLocalById("170022")
        }
    }

    const [dimension, onLayout] = useDimension()
    const popUpDispatch = useWrapDispatch(setPopUp)
    const modalDispatch = useWrapDispatch(setModal)

    const onHelpBox = () => {
        setIsVisibleRankHelp(true)
    }

    const { carouselSlideProps, carouselProgress, setData } = useCarousel({ data: gameIds })
    useEffect(() => {
        setData(gameIds)
    }, [gameIds])

    useScreen(() => {
        settleDateRange()
    }, [])
    // const [data] = useQuery(() => rankSvc.playerRankList({ gamecode: 2023, max: 100, min: 1 }))
    // const top3 = data?.rankList?.slice(0, 3)

    const isVisible = useKeyboardVisible()
    const [isSwipeUp, setIsSwipeUp] = useState(false)
    const dispatchSwipeEvent = async (isUp: boolean) => {
        if (isUp)
            await Analytics.logEvent(AnalyticsEventName.swiper_my_nft_45, {
                hasNewUserData: true,
                first_action: "FALSE",
            })
        setTimeout(() => {
            setIsSwipeUp(isUp)
        }, 10)
    }

    const insets = useSafeAreaInsets()

    const checkEnergy = (arr: { num: number }[]) => arr.reduce((acc, curr) => acc + curr.num, 0) - arr.length * 100
    const liveIndex = gameIds.findIndex(
        v =>
            v.gameStatus === GameStatus.LIVE ||
            v.gameStatus === GameStatus.CONTINUE ||
            v.gameStatus === GameStatus.SUSPENDED
    )
    const liveGameId = gameIds.find(
        v =>
            v.gameStatus === GameStatus.LIVE ||
            v.gameStatus === GameStatus.CONTINUE ||
            v.gameStatus === GameStatus.SUSPENDED
    )
    const beforeGameId = gameIds.findIndex(v => v.gameStatus === GameStatus.BEFORE)
    const defaultIndex = liveIndex === -1 ? beforeGameId : liveIndex
    // const statusBarHeight = StatusBar.currentHeight || 0
    const statusBarMargin = insets.top
    const [indexSelected, setIndexSelected] = useState<number>(0) //IndexSelected when change index Carousel
    const [isFirstSelected, setIsFirstSelected] = useState<boolean>(true)

    useEffect(() => {
        setIsFirstSelected(false)
    }, [])
    const baseOptions = {
        vertical: false,
        width: RatioUtil.width(360),
        height: dimension.height / 1.5,
    } as const

    const [filterKey, setFilterKey] = useState<NftFilterKey>(1)
    const [sortKey, setSortKey] = useState<NftSortKey>(1)

    const [allowDragging, setAllowDragging] = useState<boolean>(true)

    const refNftBottomSheet = useRef<BottomSheet | null>(null)
    const refScrollView = useRef<ScrollView | null>(null)

    const finishTutorial = async () => {
        if (step === 1) {
            refNftBottomSheet.current?.snapToIndex(1)
            setIsSwipeUp(true)
            setStep(2)
            await Analytics.logEvent(AnalyticsEventName.click_next_30, { hasNewUserData: true })
            await Analytics.logEvent(AnalyticsEventName.view_tuto_2_30, { hasNewUserData: true })
        } else if (step === 2) {
            refNftBottomSheet.current?.snapToIndex(0)
            setIsSwipeUp(false)
            setStep(3)
            await Analytics.logEvent(AnalyticsEventName.click_complete_30, { hasNewUserData: true })
        } else {
            const USER_ID = await ConfigUtil.getStorage<string>(APP_USER_ID)
            await AsyncStorage.setItem(USER_ID + HOME_SCREEN_TUTORIAL, "2").then(() => {
                Analytics.thirdPartyLogEvent(ThirdPartyAnalyticsEventName.af_tutorial_completion, {
                    af_success: "TRUE",
                    af_tutorial_id: TutorialId[HOME_SCREEN_TUTORIAL],
                })
            })
            refNftBottomSheet.current?.snapToIndex(0)
            setIsSwipeUp(false)
            setShowHomeScreenTutorial(false)
            getListRafflePopup()
        }
    }

    if (myNfts == null) return null
    const nftEnergyArr = myNfts.map((item: INftList) => {
        return {
            num: item.energy,
        }
    })

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

    const carouselRenderItem = (props: IRenderItem) => {
        const { item, index } = props
        const date = DateUtil.format(item.BEGIN_AT)
        const bgImage = jsonSvc.getSlideImageByGameCode(item.id)
        return (
            // <View
            //     style={{
            //         alignItems: "center",
            //         width: "100%",
            //     }}
            //     // onMoveShouldSetResponderCapture={() => {
            //     //     if (Platform.OS === "ios") return true
            //     //     return false
            //     // }}
            // >
            <CustomButton
                style={{
                    width: "100%",
                    height: dimension.height / 1.5,
                    justifyContent: "flex-start",
                    zIndex: 9999999,
                }}
                onPress={async () => {
                    console.log("click click")
                    await Analytics.logEvent(AnalyticsEventName.click_tour_45, {
                        hasNewUserData: true,
                        first_action: "FALSE",
                        game_id: item.id,
                        game_status: item.gameStatus,
                    })
                    navigate(Screen.LIVE, {
                        gameId: item.id,
                        gameStatus: item.gameStatus,
                        liveGameId: liveGameData ? liveGameData.gameId : -1,
                        liveLink: "",
                    })
                }}
            >
                {getGameStatus(item.gameStatus) !== jsonSvc.findLocalById("120013") ? (
                    <View>
                        {/* <ImageBackground
                                source={homeImg.gradation}
                                style={{
                                    width: "100%",
                                    height: dimension.height,
                                    zIndex: -3,
                                    // position: "absolute",
                                    top: 0,
                                }}
                            > */}
                        {/* /*-/*- */}
                        <FastImage
                            source={
                                getGameStatus(item.gameStatus) === jsonSvc.findLocalById("7006")
                                    ? homeImg.finished
                                    : typeof bgImage === "string"
                                    ? { uri: ConfigUtil.getPlayerImage(bgImage) }
                                    : homeImg.sample
                            }
                            style={{
                                width: "100%",
                                height: dimension.height / 1.5,
                                zIndex: -2,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        >
                            <View
                                style={{
                                    height: dimension.height / 1.5,
                                }}
                            >
                                <FastImage
                                    source={homeImg.gradation}
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: dimension.height / 1.5,
                                        bottom: 0,
                                    }}
                                ></FastImage>
                                <View
                                    style={{
                                        width:
                                            getGameStatus(item.gameStatus) === jsonSvc.findLocalById("120016")
                                                ? RatioUtil.width(107)
                                                : RatioUtil.width(96),
                                        height: RatioUtil.height(30),
                                        backgroundColor:
                                            getGameStatus(item.gameStatus) === jsonSvc.findLocalById("120016")
                                                ? Colors.RED6
                                                : Colors.WHITE,
                                        borderRadius: RatioUtil.width(60),
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",

                                        marginLeft: RatioUtil.width(40),
                                        marginTop: RatioUtil.height(197),
                                    }}
                                >
                                    {getGameStatus(item.gameStatus) === jsonSvc.findLocalById("120016") ? (
                                        <View
                                            style={{
                                                backgroundColor: Colors.WHITE,
                                                ...RatioUtil.size(6, 6),
                                                borderRadius: RatioUtil.width(10),
                                                marginRight: RatioUtil.width(6),
                                            }}
                                        />
                                    ) : null}
                                    <PretendText
                                        style={{
                                            color:
                                                getGameStatus(item.gameStatus) === jsonSvc.findLocalById("120016")
                                                    ? Colors.WHITE
                                                    : Colors.BLACK,
                                            fontWeight: "700",
                                            fontSize: RatioUtil.font(14),
                                        }}
                                    >
                                        {/*getGameStatus(item.gameStatus)*/}
                                        {getGameStatus(item.gameStatus) === jsonSvc.findLocalById("120016")
                                            ? jsonSvc.findLocalById("120016") + " " + jsonSvc.findLocalById("120021")
                                            : getGameStatus(item.gameStatus)}
                                    </PretendText>
                                    {getGameStatus(item.gameStatus) === jsonSvc.findLocalById("120016") ? (
                                        <SvgIcon
                                            name={"HomeArrow"}
                                            width={RatioUtil.lengthFixedRatio(20)}
                                            height={RatioUtil.lengthFixedRatio(20)}
                                        />
                                    ) : (
                                        <SvgIcon
                                            name={"HomeArrow2"}
                                            width={RatioUtil.lengthFixedRatio(20)}
                                            height={RatioUtil.lengthFixedRatio(20)}
                                        />
                                    )}
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(300),
                                        height: RatioUtil.height(80),
                                        marginTop: RatioUtil.height(5),
                                        marginLeft: RatioUtil.width(40),
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            marginTop: RatioUtil.height(10),
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(24),
                                            lineHeight: RatioUtil.font(24) * 1.3,
                                        }}
                                    >
                                        {item.gameName}
                                    </PretendText>
                                </View>
                                <PretendText
                                    style={{
                                        marginLeft: RatioUtil.width(40),
                                        color: Colors.GRAY12,
                                        fontSize: RatioUtil.font(16),
                                    }}
                                >
                                    {/* **-- */}
                                    {DateUtil.dateFormat(item.startDate)} {/* {DateUtil.timeFormat(item.startTime)} */}
                                    {/* {date
                                            ? jsonSvc.formatLocal(
                                                    jsonSvc.findLocalById("110000"),
                                                    [
                                                        date.month.toString(),
                                                        date.day.toString(),
                                                        `${date.hour}:${date.minute || "00"}`,
                                                    ]
                                                )
                                            : ""} */}
                                </PretendText>
                            </View>
                        </FastImage>

                        {/* </ImageBackground> */}
                    </View>
                ) : (
                    <View style={{ zIndex: -1 }}>
                        <FastImage
                            source={{
                                uri: ConfigUtil.getPlayerImage(jsonSvc.getSlideImageByGameCode(item.id)),
                            }}
                            style={{
                                width: "100%",
                                height: dimension.height / 1.5,
                                zIndex: -1,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor:
                                        getGameStatus(item.gameStatus) === jsonSvc.findLocalById("120013")
                                            ? "rgba(0, 0, 0, 0.6)"
                                            : "",
                                }}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(96),
                                        height: RatioUtil.height(30),
                                        backgroundColor: Colors.WHITE,
                                        borderRadius: RatioUtil.width(60),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginLeft: RatioUtil.width(40),
                                        marginTop: RatioUtil.height(197),
                                        flexDirection: "row",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.BLACK,
                                            fontWeight: "700",
                                            fontSize: RatioUtil.font(14),
                                        }}
                                    >
                                        {getGameStatus(item.gameStatus)}
                                    </PretendText>
                                    <SvgIcon
                                        name={"HomeArrow2"}
                                        width={RatioUtil.lengthFixedRatio(20)}
                                        height={RatioUtil.lengthFixedRatio(20)}
                                    />
                                </View>
                                <View
                                    style={{
                                        width: RatioUtil.width(300),
                                        height: RatioUtil.height(80),
                                        marginTop: RatioUtil.height(5),
                                        marginLeft: RatioUtil.width(40),
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            marginTop: RatioUtil.height(10),
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(24),
                                            lineHeight: RatioUtil.font(24) * 1.3,
                                        }}
                                    >
                                        {item.gameName}
                                    </PretendText>
                                </View>
                                <PretendText
                                    style={{
                                        marginLeft: RatioUtil.width(40),
                                        color: Colors.GRAY12,
                                        fontSize: RatioUtil.font(16),
                                    }}
                                >
                                    {DateUtil.dateFormat(item.startDate)} {/* {DateUtil.timeFormat(item.startTime)} */}
                                </PretendText>
                            </View>
                        </FastImage>
                    </View>
                )}
            </CustomButton>
            // </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    flex: 1,
                    // height: dimension.height,
                }}
                onLayout={onLayout}
            >
                <View
                    style={{
                        // justifyContent: "center",
                        width: dimension.width,
                        height: dimension.height / 1.5,
                    }}
                >
                    {/* slider */}
                    <View
                        style={{
                            alignItems: "center",
                            // width: dimension.width,
                        }}
                    >
                        <Carousel.Slide
                            {...carouselSlideProps}
                            {...baseOptions}
                            // onSnapToItem={index => {
                            //     setIndexSelected(index)
                            //     if (!isFirstSelected) {
                            //         setIsFirstSelected(true)
                            //     }
                            // }}
                            // style={{ width: dimension.width, height: dimension.height / 1.5, position: "relative" }}
                            renderItem={carouselRenderItem}
                            loop
                            data={gameIds}
                            width={RatioUtil.width(400)}
                            defaultIndex={defaultIndex}
                        />
                        <Carousel.DotContainer
                            data={carouselSlideProps.data}
                            carouselProgress={carouselProgress}
                            indexSelected={!isFirstSelected ? defaultIndex : indexSelected}
                            style={{
                                position: "absolute",
                                top: RatioUtil.height(350) - insets.top / 1.9,
                                left: RatioUtil.width(23),
                                width: RatioUtil.width(
                                    carouselSlideProps.data.length ? carouselSlideProps.data.length * 12 : 100
                                ),
                            }}
                        />
                    </View>
                    <View style={{ position: "absolute", top: insets.top }}>
                        <HomeHeader training={asset?.trainingPoint} bdst={asset?.bdst} tbora={asset?.tbora} />

                        {/* function test Tour Rewards */}
                        {/*<TextInput
                            placeholder={"please input GameCode"}
                            value={gameCode}
                            onChangeText={text => setGameCode(text)}
                            style={{ backgroundColor: "white", marginHorizontal: 20 }}
                            placeholderTextColor={"black"}
                        />
                        <TouchableOpacity
                            onPress={() => testTourReward()}
                            style={{
                                backgroundColor: "black",
                                padding: 10,
                                width: "60%",
                                borderRadius: 10,
                                marginHorizontal: 20,
                            }}
                        >
                            <PretendText style={{ color: "white" }}>Show Tour Rewards Popup</PretendText>
                        </TouchableOpacity>*/}
                        {/* <AppForceUpdatePopup modalVisible={FourceUpdateModalVisible} /> */}
                    </View>
                </View>

                {/* 바텀시트 */}
                <BottomSheet
                    ref={refNftBottomSheet}
                    //snapPoints={[RatioUtil.height(266), RatioUtil.height(Dimension.BASE.HEIGHT) - statusBarMargin]}
                    snapPoints={[RatioUtil.height(266), RatioUtil.height(Dimension.BASE.HEIGHT) - statusBarMargin]}
                    index={0}
                    onChange={(index: number) => {
                        index != 0 ? dispatchSwipeEvent(true) : dispatchSwipeEvent(false)
                    }}
                    handleComponent={null}
                    //style={{
                    //    height: RatioUtil.height(Dimension.BASE.HEIGHT) - statusBarMargin
                    //}}
                    //onMomentumDragEnd={position =>
                    //    position > RatioUtil.height(266) + 100 ? dispatchSwipeEvent(true) : dispatchSwipeEvent(false)
                    //}
                >
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            height: RatioUtil.height(Dimension.BASE.HEIGHT),
                            ...RatioUtil.borderRadius(20),
                        }}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                height: RatioUtil.lengthFixedRatio(26),
                            }}
                        >
                            <View
                                style={{
                                    ...liveGeneral.popup.center,
                                    borderRadius: 20,
                                    backgroundColor: "#DADEE4",
                                    ...RatioUtil.sizeFixedRatio(30, 4),
                                    marginTop: RatioUtil.lengthFixedRatio(8),
                                    marginBottom: RatioUtil.lengthFixedRatio(14),
                                }}
                            ></View>
                        </View>

                        <BottomSheetScrollView
                            ref={refScrollView}
                            style={{
                                height: RatioUtil.height(571),
                                /*
                            height: RatioUtil.height(
                                item.length + nftList.length > 1
                                    ? Math.ceil((item.length + nftList.length + 1) / 2) * 203 + 530
                                    : Math.ceil((item.length + nftList.length + 1) / 2) * 203 + 130
                            ),
                            */
                            }}
                            scrollEnabled={
                                isSwipeUp
                                /*
                                Math.ceil((item.length + nftList.length + 1) / 2) * 203 >
                                Dimension.BASE.HEIGHT - 62 - 227
                                    ? true
                                    : false
                            */
                            }
                            // /*-
                            onScrollEndDrag={async props => {
                                /*
                            const { contentOffset, layoutMeasurement, contentSize } = props.nativeEvent
                            const reachBottom =
                                contentSize.height - (contentOffset.y + layoutMeasurement.height)

                            if (reachBottom <= 1) {
                                console.log(nftPageIndex)
                                setNftPageIndex(page => page + 1)
                                console.log(nftPageIndex)
                                await getNftList(nftPageIndex)
                                console.log(nftPageIndex)
                            }
                            */
                            }} //
                            onScrollBeginDrag={async () =>
                                await Analytics.logEvent(AnalyticsEventName.scroll_my_nft_45, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                            }
                            onTouchStart={() => setAllowDragging(false)}
                            onTouchEnd={() => setAllowDragging(true)}
                            onTouchCancel={() => setAllowDragging(true)}
                            // onScroll={e => {
                            //     let bottom = 1
                            //     bottom += e.nativeEvent.layoutMeasurement.height
                        >
                            <View
                                style={{
                                    marginLeft: RatioUtil.width(20),
                                    marginBottom: RatioUtil.height(30),
                                }}
                            >
                                <RewardCheckComponent
                                    onHelpBox={onHelpBox}
                                    liveGameId={liveGameId}
                                    nftList={myNfts}
                                    rewardBdst={expectReward}
                                    loading={loading}
                                />
                                {/* function test Tour Rewards1 */}
                                {/* <View
                                    style={{
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: RatioUtil.width(320),
                                    }}
                                >
                               
                                    <View
                                        style={{
                                            // flexDirection:'row',
                                            width: RatioUtil.width(150),
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <TextInput
                                            value={rewardTestId}
                                            onChangeText={text => setRewardTestId(text)}
                                            style={{
                                                backgroundColor: "white",
                                                height: 50,
                                                width: 100,
                                                borderWidth: 1,
                                                marginTop: 10,
                                                marginBottom: 10,
                                                borderRadius: 10,
                                            }}
                                            placeholderTextColor={"black"}
                                        />
                                        <TouchableOpacity
                                            onPress={() => {
                                                getExpectRewardTest(Number(rewardTestId))
                                            }}
                                            style={{
                                                backgroundColor: "black",
                                                borderRadius: 10,
                                                height: 30,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                width: "100%",
                                            }}
                                        >
                                            <PretendText style={{ color: "white" }}>예상 보상량 테스트</PretendText>
                                        </TouchableOpacity>
                                    </View>
                                </View> */}
                            </View>

                            <View>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        height: RatioUtil.lengthFixedRatio(20),
                                    }}
                                >
                                    <View style={{ flexDirection: "row" }}>
                                        <PretendText
                                            style={{
                                                fontSize: RatioUtil.font(16),
                                                color: Colors.BLACK,
                                                fontWeight: "700",
                                                marginLeft: RatioUtil.width(20),
                                                lineHeight: RatioUtil.font(16),
                                            }}
                                        >
                                            MY NFT
                                        </PretendText>
                                        <PretendText
                                            style={{
                                                fontSize: RatioUtil.font(13),
                                                color: Colors.BLACK,
                                                fontWeight: "700",
                                                marginLeft: RatioUtil.width(3),
                                                lineHeight: RatioUtil.font(13),
                                            }}
                                        >
                                            {nftCount}
                                        </PretendText>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(320, 54),
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        // ...RatioUtil.margin(4, 4, 4, 4),
                                        // ...RatioUtil.padding(0, 0, 0, 20),
                                        marginLeft: RatioUtil.width(20),
                                    }}
                                >
                                    <View style={[mineCompoStyle.photoNftPopup.menuBox]}>
                                        {nftFilterMenu.map((v, i) => (
                                            <CustomButton
                                                key={i}
                                                style={{
                                                    ...mineCompoStyle.photoNftPopup.menu,
                                                    marginRight: i === 0 ? RatioUtil.width(6) : 0,
                                                    backgroundColor: filterKey === v.key ? Colors.BLACK : Colors.WHITE,
                                                }}
                                                onPress={() => {
                                                    if (!isSwipeUp) {
                                                        refNftBottomSheet.current?.snapToIndex(1)
                                                        setIsSwipeUp(true)
                                                    }
                                                    setFilterKey(v.key)
                                                    if (i) {
                                                        setItemVisible(false)
                                                        setIsGrow(true)
                                                    } else {
                                                        setItemVisible(true)
                                                        setIsGrow(false)
                                                    }
                                                }}
                                                onTouchStart={() => setAllowDragging(false)}
                                                onTouchEnd={() => setAllowDragging(true)}
                                                onTouchCancel={() => setAllowDragging(true)}
                                            >
                                                <PretendText
                                                    style={{
                                                        ...mineCompoStyle.photoNftPopup.menuText,
                                                        color: filterKey === v.key ? Colors.WHITE : Colors.GRAY2,
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {v.title}
                                                </PretendText>
                                            </CustomButton>
                                        ))}
                                    </View>
                                    <CustomButton
                                        style={{
                                            ...mineCompoStyle.photoNftPopup.menuBox,
                                        }}
                                        onTouchStart={() => setAllowDragging(false)}
                                        onTouchEnd={() => setAllowDragging(true)}
                                        onTouchCancel={() => setAllowDragging(true)}
                                    >
                                        <View style={{ flexDirection: "row" }}>
                                            <FastImage
                                                source={myPageImg.arrowUp}
                                                style={{
                                                    width: RatioUtil.width(7),
                                                    height: RatioUtil.lengthFixedRatio(12),
                                                }}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                            <FastImage
                                                source={myPageImg.arrowDown}
                                                style={{
                                                    ...RatioUtil.marginFixedRatio(0, 8, 0, 3),
                                                    width: RatioUtil.width(7),
                                                    height: RatioUtil.lengthFixedRatio(12),
                                                }}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        </View>
                                        <PretendText
                                            style={mineCompoStyle.photoNftPopup.menuText}
                                            onPress={() => {
                                                if (!isSwipeUp) {
                                                    refNftBottomSheet.current?.snapToIndex(1)
                                                    setIsSwipeUp(true)
                                                }
                                                // setItemVisible(true)
                                                // setIsGrow(false)
                                                popUpDispatch({
                                                    open: true,
                                                    children: (
                                                        <View
                                                            style={{
                                                                width: RatioUtil.width(360),
                                                                height: RatioUtil.heightFixedRatio(416) + insets.bottom,
                                                                backgroundColor: Colors.WHITE,
                                                                position: "absolute",
                                                                bottom: 0,
                                                                borderRadius: RatioUtil.width(10),
                                                            }}
                                                        >
                                                            <View
                                                                style={{
                                                                    borderRadius: RatioUtil.width(10),
                                                                    height: RatioUtil.heightFixedRatio(56),
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                }}
                                                            >
                                                                <View
                                                                    style={{
                                                                        alignItems: "center",
                                                                        justifyContent: "center",
                                                                    }}
                                                                >
                                                                    <PretendText
                                                                        style={{
                                                                            textAlign: "center",
                                                                            color: Colors.BLACK,
                                                                            fontWeight: RatioUtil.fontWeightBold(),
                                                                            fontSize: RatioUtil.font(16),
                                                                        }}
                                                                    >
                                                                        {/* 능력 필터 */}
                                                                        {jsonSvc.findLocalById("120022")}
                                                                    </PretendText>
                                                                </View>
                                                                <CustomButton
                                                                    style={{
                                                                        position: "absolute",
                                                                        right: RatioUtil.width(20),
                                                                    }}
                                                                    onPress={() => {
                                                                        popUpDispatch({ open: false })
                                                                    }}
                                                                >
                                                                    <FastImage
                                                                        source={nftDetailImg.close}
                                                                        style={{
                                                                            width: RatioUtil.width(25),
                                                                            height: RatioUtil.width(25),
                                                                        }}
                                                                        resizeMode={FastImage.resizeMode.contain}
                                                                    />
                                                                </CustomButton>
                                                            </View>
                                                            {nftSortMenu.map((v, i) => {
                                                                return (
                                                                    <CustomButton
                                                                        style={{
                                                                            height: RatioUtil.heightFixedRatio(60),
                                                                            ...RatioUtil.paddingFixedRatio(0, 0, 0, 20),
                                                                            backgroundColor:
                                                                                sortKey === v.key
                                                                                    ? Colors.GRAY7
                                                                                    : Colors.WHITE,
                                                                            justifyContent: "center",
                                                                        }}
                                                                        onPress={() => {
                                                                            setSortKey(v.key)
                                                                            popUpDispatch({ open: false })
                                                                        }}
                                                                        key={i}
                                                                    >
                                                                        <PretendText
                                                                            style={{
                                                                                color: Colors.BLACK,
                                                                                fontSize: RatioUtil.font(16),
                                                                                fontWeight:
                                                                                    sortKey === v.key
                                                                                        ? RatioUtil.fontWeightBold()
                                                                                        : "400",
                                                                            }}
                                                                        >
                                                                            {v.title}
                                                                        </PretendText>
                                                                    </CustomButton>
                                                                )
                                                            })}
                                                        </View>
                                                    ),
                                                })
                                            }}
                                        >
                                            {nftSvc.getSortTitle(sortKey)}
                                        </PretendText>
                                    </CustomButton>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        flexDirection: "row",
                                        alignItems: "flex-start",
                                        paddingBottom: PageFooterHeight() + RatioUtil.lengthFixedRatio(68),
                                    }}
                                >
                                    <View
                                        style={{
                                            minHeight: RatioUtil.height(150),
                                            justifyContent: "center",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            width: RatioUtil.width(320),
                                        }}
                                    >
                                        {item.length + myNfts.length > 0 ? (
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    flexWrap: "wrap",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    // ...RatioUtil.padding(0, 20, 0, 20),
                                                }}
                                            >
                                                <NftListComponent
                                                    item={item}
                                                    nftData={myNfts}
                                                    isGrow={isGrow}
                                                    sortKey={sortKey}
                                                    itemVisible={itemVisible}
                                                    showConfirm={showConfirm}
                                                    nftDisabled={nftDisabled}
                                                    setItemSelection={setItemSelection}
                                                    setShowConfirm={setShowConfirm}
                                                    setNftDisabled={setNftDisabled}
                                                />
                                            </View>
                                        ) : (
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    flexWrap: "wrap",
                                                    justifyContent: "flex-start",
                                                }}
                                            >
                                                <CustomButton
                                                    onPress={() => {
                                                        navigate(Screen.NFTTABSCENE)
                                                    }}
                                                    style={{
                                                        ...RatioUtil.size(320, 140),
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderWidth: 1,
                                                        borderRadius: 20,
                                                        borderStyle: "dashed",
                                                        marginBottom: 20,
                                                    }}
                                                >
                                                    <Image
                                                        source={playerCardImg.nftAdd}
                                                        style={{
                                                            ...RatioUtil.size(20, 20),
                                                            marginBottom: RatioUtil.height(10),
                                                        }}
                                                    />
                                                    {/* <PretendText>보유한 NFT가 없습니다.</PretendText>
                                                <PretendText>NFT를 획득해보세요!</PretendText> */}
                                                    <PretendText
                                                        style={{
                                                            fontSize: RatioUtil.font(14),
                                                            color: Colors.GRAY3,
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        {jsonSvc.findLocalById("120019")}
                                                    </PretendText>
                                                </CustomButton>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </BottomSheetScrollView>
                    </View>
                </BottomSheet>

                {/* 에너지 버튼 */}
                <View
                    style={{
                        position: "absolute",
                        height: RatioUtil.lengthFixedRatio(48),
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        zIndex: 15,
                        bottom: RatioUtil.lengthFixedRatio(10) + PageFooterHeight(),
                    }}
                >
                    {checkEnergy(nftEnergyArr) !== 0 ? (
                        <TouchableOpacity
                            onPress={async () => {
                                await Analytics.logEvent(AnalyticsEventName.click_charge_45, {
                                    hasNewUserData: true,
                                    first_action: "FALSE",
                                })
                                try {
                                    const isSettle = await callSetGameApi(true)
                                    if (isSettle) {
                                        store.dispatch(
                                            setSetGameModalData({
                                                // title: "지금은 투어 보상 정산 중입니다.",
                                                title: jsonSvc.findLocalById("10000025"),
                                                // desc2: ""NFT 에너지 충전은\n잠시 후 다시 진행 해 주세요.",
                                                desc1: jsonSvc.findLocalById("10000064"),
                                            })
                                        )
                                        store.dispatch(setGameLoader(false))
                                        return
                                    }
                                    popUpDispatch({
                                        open: true,
                                        children: (
                                            <ChargeEnergy
                                                bdst={asset?.bdst}
                                                nftList={myNfts}
                                                renderToggle={renderToggle}
                                            />
                                        ),
                                    })
                                } catch (err) {
                                    console.log("err", err)
                                }
                            }}
                            style={[{ zIndex: 15 }]}
                            // hitSlop={{
                            //     top: RatioUtil.height(0),
                            //     bottom: RatioUtil.height(0),
                            //     left: RatioUtil.height(0),
                            //     right: RatioUtil.height(0),
                            // }}
                        >
                            <View
                                style={{
                                    width: RatioUtil.lengthFixedRatio(isSwipeUp ? 134 : 48),
                                    height: RatioUtil.lengthFixedRatio(48),
                                    backgroundColor: Colors.BLACK,
                                    borderRadius: RatioUtil.lengthFixedRatio(48),
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    // backgroundColor: Colors.WHITE,
                                    // position: "absolute",
                                    // top: RatioUtil.height(560),
                                    // right: isSwipeUp ? RatioUtil.width(100) : RatioUtil.width(155),
                                }}
                            >
                                <Image
                                    source={homeImg.charge}
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(22),
                                        height: RatioUtil.lengthFixedRatio(22),
                                    }}
                                    resizeMode="contain"
                                />
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(13),
                                        fontWeight: RatioUtil.fontWeightBold(),
                                        height: RatioUtil.lengthFixedRatio(17),
                                        width: isSwipeUp ? RatioUtil.lengthFixedRatio(80) : 0,
                                        marginLeft: isSwipeUp ? RatioUtil.lengthFixedRatio(5) : 0,
                                        textAlign: "center",
                                        textAlignVertical: "center",
                                    }}
                                >
                                    {/* {isSwipeUp ? "에너지 채우기" : ""} */}
                                    {isSwipeUp ? jsonSvc.findLocalById("120020") : ""}
                                </PretendText>
                            </View>
                        </TouchableOpacity>
                    ) : null}
                </View>

                <View>
                    <View>
                        <PlayerPupUp
                            isVisible={isVisiblePlayer}
                            setIsVisible={setIsVisiblePlayer}
                            itemSelection={itemSelection}
                            toNavigate={Screen.NFTLIST}
                            setNftDisabled={setNftDisabled}
                        />
                    </View>
                    <View>
                        {/* 투어 참가 도움말 */}
                        <Modal
                            animationType="fade"
                            statusBarTranslucent
                            transparent={true}
                            style={{
                                marginTop: insets.top,
                                flex: 1,
                            }}
                            // visible={true}
                            visible={isVisibleRankHelp}
                        >
                            <View style={{ ...rankStyle.header.modalMainView, backgroundColor: Colors.BLACK }}>
                                <View style={{ flex: 1, ...RatioUtil.size(360) }}>
                                    <View style={rankStyle.header.con}>
                                        <PretendText style={[rankStyle.header.text, { fontSize: RatioUtil.font(16) }]}>
                                            {/* 투어 참가 도움말 */}
                                            {jsonSvc.findLocalById("900000")}
                                        </PretendText>
                                        <View
                                            style={{
                                                right: RatioUtil.width(20),
                                                position: "absolute",
                                            }}
                                        >
                                            <TouchableOpacity onPress={() => setIsVisibleRankHelp(false)}>
                                                <Image
                                                    source={nftDetailImg.close}
                                                    style={{
                                                        ...RatioUtil.margin(30, 0, 20, 0),
                                                        width: RatioUtil.width(25),
                                                        height: RatioUtil.height(25),
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <TabView
                                        renderTabBar={props => {
                                            return (
                                                <TabBar
                                                    style={{ height: 0 }}
                                                    indicatorStyle={{ opacity: 0 }}
                                                    {...props}
                                                />
                                            )
                                        }}
                                        style={{ backgroundColor: "#F7F9FC" }}
                                        navigationState={{ index, routes }}
                                        renderScene={renderScene}
                                        onIndexChange={onSelectRankHelp}
                                        //   initialLayout={{ width: layout.width }}
                                    />
                                </View>
                            </View>
                        </Modal>
                        {/* 투어 보상 팝업 */}
                        <Modal
                            animationType="fade"
                            animated={true}
                            statusBarTranslucent
                            transparent={true}
                            hardwareAccelerated={true}
                            visible={openTourReward && settleTime}
                        >
                            <View
                                style={{
                                    backgroundColor: `${Colors.BLACK}70`,
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: Colors.WHITE,
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: RatioUtil.width(16),
                                        paddingVertical: RatioUtil.width(30),
                                        paddingHorizontal: RatioUtil.lengthFixedRatio(20),
                                        width: RatioUtil.width(272),
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            textAlign: "center",
                                            color: Colors.BLACK,
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            fontSize: RatioUtil.font(18),
                                            height: RatioUtil.lengthFixedRatio(23),
                                        }}
                                    >
                                        {jsonSvc.findLocalById("110048")}
                                    </PretendText>
                                    <PretendText
                                        style={{
                                            marginTop: RatioUtil.lengthFixedRatio(10),
                                            textAlign: "center",
                                            color: Colors.BLACK,
                                            fontWeight: "400",
                                            fontSize: RatioUtil.font(14),
                                        }}
                                    >
                                        {timeToText(tourReward?.BEGIN_AT).type1} ~{" "}
                                        {timeToText(tourReward?.END_AT).type1}
                                    </PretendText>
                                    <PretendText
                                        style={{
                                            marginBottom: RatioUtil.lengthFixedRatio(20),
                                            textAlign: "center",
                                            color: Colors.BLACK,
                                            fontWeight: "400",
                                            fontSize: RatioUtil.font(14),
                                        }}
                                    >
                                        {tourReward?.GAME_NAME}
                                    </PretendText>
                                    <View
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: Colors.WHITE3,
                                                borderRadius: RatioUtil.width(6),
                                                height: RatioUtil.lengthFixedRatio(49),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                paddingLeft: RatioUtil.width(20),
                                                paddingRight: RatioUtil.width(20),
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Image
                                                    source={FanRank.point_blue}
                                                    style={{
                                                        width: RatioUtil.width(14),
                                                        height: RatioUtil.width(14),
                                                        marginRight: RatioUtil.width(4),
                                                    }}
                                                />
                                                <PretendText
                                                    style={{
                                                        textAlign: "center",
                                                        color: Colors.BLACK,
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        fontSize: RatioUtil.font(13),
                                                    }}
                                                >
                                                    {jsonSvc.findLocalById("10001")}
                                                </PretendText>
                                            </View>
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(16),
                                                    fontWeight: RatioUtil.fontWeightBold(),
                                                    color: Colors.BLACK,
                                                }}
                                            >
                                                {parseFloat((tourReward?.REWARD_BDST ?? 0).toFixed(1))}
                                            </PretendText>
                                        </View>
                                        <View
                                            style={{
                                                backgroundColor: Colors.WHITE3,
                                                borderRadius: RatioUtil.width(6),
                                                height: RatioUtil.lengthFixedRatio(49),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                paddingLeft: RatioUtil.width(20),
                                                paddingRight: RatioUtil.width(20),
                                                marginTop: RatioUtil.lengthFixedRatio(10),
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <Image
                                                    source={FanRank.point_yellow}
                                                    style={{
                                                        width: RatioUtil.width(14),
                                                        height: RatioUtil.width(14),
                                                        marginRight: RatioUtil.width(4),
                                                    }}
                                                />
                                                <PretendText
                                                    style={{
                                                        textAlign: "center",
                                                        color: Colors.BLACK,
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        fontSize: RatioUtil.font(13),
                                                    }}
                                                >
                                                    {jsonSvc.findLocalById("2037")}
                                                </PretendText>
                                            </View>
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(16),
                                                    fontWeight: RatioUtil.fontWeightBold(),
                                                    color: Colors.BLACK,
                                                }}
                                            >
                                                {parseFloat((tourReward?.REWARD_TRAINING ?? 0).toFixed(1))}
                                            </PretendText>
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <View
                                            style={{
                                                marginTop: RatioUtil.lengthFixedRatio(10),
                                                flexDirection: "row",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    color: "#87878D",
                                                    fontWeight: "400",
                                                    fontSize: RatioUtil.font(14),
                                                    marginLeft: RatioUtil.width(6),
                                                    marginRight: RatioUtil.width(6),
                                                }}
                                            >
                                                {`\u2022`}
                                            </PretendText>
                                            <PretendText
                                                style={{
                                                    color: "#87878D",
                                                    fontWeight: "400",
                                                    fontSize: RatioUtil.font(14),
                                                }}
                                            >
                                                {jsonSvc.findLocalById("110058")}
                                            </PretendText>
                                        </View>
                                    </View>
                                    <PretendText
                                        style={{
                                            textAlign: "center",
                                            color: Colors.BLACK,
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            fontSize: RatioUtil.font(16),
                                            marginTop: RatioUtil.lengthFixedRatio(30),
                                            height: RatioUtil.lengthFixedRatio(21),
                                        }}
                                    >
                                        {jsonSvc.findLocalById("170009")}
                                    </PretendText>
                                    <PretendText
                                        style={{
                                            textAlign: "center",
                                            color: Colors.BLACK,
                                            fontWeight: "400",
                                            fontSize: RatioUtil.font(14),
                                            marginTop: RatioUtil.lengthFixedRatio(6),
                                            marginBottom: RatioUtil.lengthFixedRatio(20),
                                        }}
                                    >
                                        {checkUserRank(cheerReward)}
                                    </PretendText>
                                    <View
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <View
                                            style={{
                                                backgroundColor: Colors.WHITE3,
                                                borderRadius: RatioUtil.width(6),
                                                height: RatioUtil.lengthFixedRatio(49),
                                                flexDirection: "row",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                paddingLeft: RatioUtil.width(20),
                                                paddingRight: RatioUtil.width(20),
                                            }}
                                        >
                                            {!nftplayerJson.find(
                                                player => player.nPersonID === cheerReward?.PLAYER_CODE
                                            ) ? (
                                                <PretendText
                                                    style={{
                                                        width: "100%",
                                                        fontSize: RatioUtil.font(13),
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        color: Colors.BLACK,
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {jsonSvc.findLocalById("170023")}
                                                </PretendText>
                                            ) : (
                                                <>
                                                    <View
                                                        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                                                    >
                                                        <Image
                                                            source={FanRank.point_blue}
                                                            style={{
                                                                width: RatioUtil.width(14),
                                                                height: RatioUtil.width(14),
                                                                marginRight: RatioUtil.width(4),
                                                            }}
                                                        />
                                                        <PretendText
                                                            style={{
                                                                textAlign: "center",
                                                                color: Colors.BLACK,
                                                                fontWeight: RatioUtil.fontWeightBold(),
                                                                fontSize: RatioUtil.font(13),
                                                            }}
                                                        >
                                                            {jsonSvc.findLocalById("10001")}
                                                        </PretendText>
                                                    </View>
                                                    <PretendText
                                                        style={{
                                                            fontSize: RatioUtil.font(16),
                                                            fontWeight: RatioUtil.fontWeightBold(),
                                                            color: Colors.BLACK,
                                                        }}
                                                    >
                                                        {parseFloat(
                                                            (cheerReward?.RANK_USERS[0].EXPECT_BDST ?? 0).toFixed(1)
                                                        )}
                                                    </PretendText>
                                                </>
                                            )}
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            width: "100%",
                                        }}
                                    >
                                        <View
                                            style={{
                                                marginTop: RatioUtil.lengthFixedRatio(10),
                                                flexDirection: "row",
                                                alignItems: "flex-start",
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    color: "#87878D",
                                                    fontWeight: "400",
                                                    fontSize: RatioUtil.font(14),
                                                    marginLeft: RatioUtil.width(6),
                                                    marginRight: RatioUtil.width(6),
                                                }}
                                            >
                                                {`\u2022`}
                                            </PretendText>
                                            <PretendText
                                                style={{
                                                    color: "#87878D",
                                                    fontWeight: "400",
                                                    fontSize: RatioUtil.font(14),
                                                }}
                                            >
                                                {jsonSvc.findLocalById("110054")}
                                            </PretendText>
                                        </View>
                                    </View>
                                    <CustomButton
                                        onPress={() => {
                                            if (tourReward) {
                                                onPressReward(tourReward.GAME_CODE)
                                                setOpenTourReward(false)
                                            }
                                        }}
                                        style={{
                                            backgroundColor: Colors.BLACK,
                                            borderRadius: 100,
                                            width: "100%",
                                            height: RatioUtil.lengthFixedRatio(48),
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginTop: RatioUtil.lengthFixedRatio(30),
                                        }}
                                    >
                                        <PretendText
                                            style={{
                                                color: Colors.WHITE,
                                                fontSize: RatioUtil.font(14),
                                                fontWeight: RatioUtil.fontWeightBold(),
                                            }}
                                        >
                                            {jsonSvc.findLocalById("110049")}
                                        </PretendText>
                                    </CustomButton>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>

                {/* CONFIRM OPEN ITEM */}
                <Modal visible={showConfirm} statusBarTranslucent transparent>
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: `${Colors.BLACK}b3`,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                width: RatioUtil.width(272),
                                borderRadius: RatioUtil.width(16),
                                backgroundColor: Colors.WHITE,
                                ...RatioUtil.paddingFixedRatio(30, 20, 30, 20),
                            }}
                        >
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(18),
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: "#101010",
                                    textAlign: "center",
                                }}
                            >
                                {/* 선수팩을 오픈하시겠어요? */}
                                {jsonSvc.findLocalById("10000041")}
                            </PretendText>
                            <View
                                style={{
                                    marginTop: RatioUtil.lengthFixedRatio(29),
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <CustomButton
                                    onPress={() => {
                                        setNftDisabled(false)
                                        setShowConfirm(false)
                                    }}
                                    style={{
                                        width: RatioUtil.width(113),
                                        height: RatioUtil.lengthFixedRatio(48),
                                        borderRadius: RatioUtil.width(24),
                                        backgroundColor: "#E9ECEF",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: "#3F3F44",
                                            textAlign: "center",
                                        }}
                                    >
                                        {/* 취소 */}
                                        {jsonSvc.findLocalById("1021")}
                                    </PretendText>
                                </CustomButton>
                                <CustomButton
                                    onPress={() => {
                                        setShowConfirm(false)
                                        handleConfirm()
                                    }}
                                    style={{
                                        width: RatioUtil.width(113),
                                        height: RatioUtil.lengthFixedRatio(48),
                                        borderRadius: RatioUtil.width(24),
                                        backgroundColor: Colors.BLACK,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: RatioUtil.fontWeightBold(),
                                            color: Colors.WHITE,
                                            textAlign: "center",
                                        }}
                                    >
                                        {/* 확인 */}
                                        {jsonSvc.findLocalById("1012")}
                                    </PretendText>
                                </CustomButton>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* TUTORIAL */}
                <Modal
                    visible={showHomeScreenTutorial && step !== 3}
                    // visible={true}
                    statusBarTranslucent
                    transparent
                >
                    <TouchableOpacity
                        onPress={() => {
                            finishTutorial()
                        }}
                        style={playerStyle.selectionModalTutorial}
                    >
                        {/*  STEP 1*/}
                        {step === 1 && (
                            <View
                                style={{
                                    position: "absolute",
                                    top: insets.top + RatioUtil.lengthFixedRatio(45),
                                    right: RatioUtil.width(10),
                                }}
                            >
                                <FastImage
                                    source={TutorialBox.tutorial_1_1}
                                    style={{
                                        width: RatioUtil.width(236),
                                        height: RatioUtil.heightFixedRatio(64),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    resizeMode="contain"
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            textAlign: "center",
                                            fontWeight: "600",
                                            marginTop: RatioUtil.heightFixedRatio(9),
                                        }}
                                    >
                                        {jsonSvc.findLocalById("6012")}
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
                                        padding: RatioUtil.height(10),
                                        // height: RatioUtil.height(56),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: RatioUtil.height(100),
                                        backgroundColor: `${Colors.BLACK}80`,
                                        borderColor: Colors.WHITE,
                                        borderWidth: 2,
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            textAlign: "center",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {jsonSvc.findLocalById("6012")}
                                    </PretendText>
                                </View> */}
                            </View>
                        )}
                        {step === 1 && (
                            <View style={{ justifyContent: "center", alignItems: "center" }}>
                                <Image
                                    source={TutorialBox.ic}
                                    style={{
                                        width: RatioUtil.width(41),
                                        height: RatioUtil.width(44),
                                    }}
                                    resizeMode="contain"
                                />
                                <FastImage
                                    source={TutorialBox.tutorial_1_2}
                                    style={{
                                        width: RatioUtil.width(236),
                                        height: RatioUtil.height(58),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: RatioUtil.height(10),
                                    }}
                                    resizeMode="contain"
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            textAlign: "center",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {jsonSvc.findLocalById("6013")}
                                    </PretendText>
                                </FastImage>
                                {/* <View
                                    style={{
                                        width: RatioUtil.width(236),
                                        padding: RatioUtil.height(10),
                                        marginTop: RatioUtil.height(10),
                                        // height: RatioUtil.height(56),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: RatioUtil.height(100),
                                        backgroundColor: `${Colors.BLACK}80`,
                                        borderColor: Colors.WHITE,
                                        borderWidth: 2,
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            textAlign: "center",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {jsonSvc.findLocalById("6013")}
                                    </PretendText>
                                </View> */}
                            </View>
                        )}

                        {/*  STEP 2*/}
                        {step === 2 && (
                            <View
                                style={{
                                    position: "absolute",
                                    top:
                                        insets.top +
                                        RatioUtil.height(120) +
                                        (Dimensions.get("screen").height - Dimensions.get("window").height),
                                }}
                            >
                                <FastImage
                                    source={TutorialBox.tutorial_1_3}
                                    style={{
                                        width: RatioUtil.width(320),
                                        height: RatioUtil.heightFixedRatio(88),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    resizeMode="contain"
                                >
                                    <PretendText
                                        style={{
                                            marginTop: RatioUtil.heightFixedRatio(10),
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "400",
                                            lineHeight: RatioUtil.font(14) * 1.3,
                                            textAlign: "center",
                                        }}
                                    >
                                        내가 보유한 NFT를 스쿼드에{"\n"}배치하면 라이브 대회 성적과 연동되어{"\n"}보상을
                                        획득 할 수 있어요.
                                    </PretendText>
                                </FastImage>
                                {/* <View style={{ justifyContent: "center", flexDirection: "row", marginBottom: -2 }}>
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
                                        width: RatioUtil.width(320),
                                        paddingHorizontal: RatioUtil.width(20),
                                        paddingVertical: RatioUtil.width(12),
                                        // height: RatioUtil.height(78),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: RatioUtil.height(100),
                                        backgroundColor: `${Colors.BLACK}80`,
                                        borderColor: Colors.WHITE,
                                        borderWidth: 2,
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "400",
                                            lineHeight: RatioUtil.font(14) * 1.3,
                                            textAlign: "center",
                                        }}
                                    >
                                        내가 보유한 NFT를 스쿼드에{"\n"}배치하면 라이브 대회 성적과 연동되어{"\n"}보상을
                                        획득 할 수 있어요.
                                    </PretendText>
                                </View> */}
                            </View>
                        )}
                        {step === 2 && (
                            <View
                                style={{
                                    position: "absolute",
                                    top:
                                        RatioUtil.height(417) +
                                        (Dimensions.get("screen").height - Dimensions.get("window").height),
                                    left: RatioUtil.width(95),
                                }}
                            >
                                <FastImage
                                    source={TutorialBox.tutorial_1_4}
                                    style={{
                                        width: RatioUtil.width(236),
                                        height: RatioUtil.heightFixedRatio(63),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                    resizeMode="contain"
                                >
                                    <PretendText
                                        style={{
                                            marginTop: RatioUtil.heightFixedRatio(8),
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "400",
                                            textAlign: "center",
                                        }}
                                    >
                                        {/* 최초로 획득한 NFT를 터치하여 선수들의 능력치를 확인해보세요! */}
                                        {jsonSvc.findLocalById("6017")}
                                    </PretendText>
                                </FastImage>
                                {/* <View
                                    style={{
                                        justifyContent: "flex-end",
                                        flexDirection: "row",
                                        right: RatioUtil.width(50),
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
                                        padding: RatioUtil.height(10),
                                        // height: RatioUtil.height(56),
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: RatioUtil.height(100),
                                        backgroundColor: `${Colors.BLACK}80`,
                                        borderColor: Colors.WHITE,
                                        borderWidth: 2,
                                    }}
                                >
                                    <PretendText
                                        style={{
                                            color: Colors.WHITE,
                                            fontSize: RatioUtil.font(14),
                                            fontWeight: "400",
                                            textAlign: "center",
                                        }}
                                    >
                                        {jsonSvc.findLocalById("6017")}
                                    </PretendText>
                                </View> */}
                            </View>
                        )}
                    </TouchableOpacity>
                </Modal>

                {/* Open Signup Reward */}
                <Modal visible={showSignReward} statusBarTranslucent transparent>
                    <TouchableOpacity
                        onPress={async () => {
                            setShowSignReward(false)
                            await Analytics.logEvent(AnalyticsEventName.click_open_20, {
                                hasNewUserData: true,
                            })
                            await handleUnboxing(rewardSeq, itemSelection.itemId, true)
                        }}
                        style={{
                            flex: 1,
                            backgroundColor: `${Colors.BLACK}b3`,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Image
                            source={nftDetailImg.gift}
                            style={{
                                ...RatioUtil.size(188, 230),
                                marginBottom: RatioUtil.height(10),
                            }}
                            resizeMode="contain"
                        />
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(20),
                                color: Colors.WHITE,
                                textAlign: "center",
                                fontWeight: "700",
                            }}
                        >
                            {/* {"3일간 매일 선수 NFT 1장을 \n무료로 받으세요!"} */}
                            {jsonSvc.formatLocal(jsonSvc.findLocalById("6000"), [rewardCount.toString()])}
                        </PretendText>
                        {/* <PretendText
                            style={{
                                color: Colors.WHITE,
                                textAlign: "center",
                                fontWeight: "700",
                                fontSize: RatioUtil.font(14),
                            }}
                        >
                            {" "}
                            {rewardCount}/3
                        </PretendText> */}
                    </TouchableOpacity>
                </Modal>

                {/* *-투어 보상 테스트 팝업 */}
                {/*<Modal
                    animationType="fade"
                    animated={true}
                    transparent={true}
                    hardwareAccelerated={true}
                    statusBarTranslucent
                    visible={!isVisibleTourReward}
                >
                    <View
                        style={{
                            backgroundColor: `${Colors.BLACK}70`,
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: Colors.WHITE,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: RatioUtil.width(20),
                                marginHorizontal: RatioUtil.width(10),
                                marginVertical: RatioUtil.height(40),
                                paddingVertical: 30,
                                paddingHorizontal: 20,
                                width: RatioUtil.width(272),
                            }}
                        >
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    color: Colors.BLACK,
                                    fontWeight: "700",
                                    fontSize: RatioUtil.font(18),
                                }}
                            >
                                {jsonSvc.findLocalById("110048")}
                            </PretendText>
                            <PretendText
                                style={{
                                    marginTop: RatioUtil.height(10),
                                    textAlign: "center",
                                    color: Colors.BLACK,
                                    fontWeight: "400",
                                    fontSize: RatioUtil.font(14),
                                }}
                            >
                                {timeToText(tourRewardData?.BEGIN_AT).type1} ~{"   "}
                                {timeToText(tourRewardData?.END_AT).type1}
                            </PretendText>
                            <PretendText
                                style={{
                                    marginBottom: RatioUtil.height(40),
                                    textAlign: "center",
                                    color: Colors.BLACK,
                                    fontWeight: "400",
                                    fontSize: RatioUtil.font(14),
                                }}
                            >
                                {tourRewardData?.GAME_NAME}
                            </PretendText>
                            <View
                                style={{
                                    width: "100%",
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: Colors.GRAY13,
                                        borderRadius: RatioUtil.width(6),
                                        height: RatioUtil.height(49),
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingLeft: RatioUtil.width(20),
                                        paddingRight: RatioUtil.width(20),
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Image
                                            source={FanRank.point_blue}
                                            style={{
                                                width: RatioUtil.width(14),
                                                height: RatioUtil.width(14),
                                                marginRight: RatioUtil.width(4),
                                            }}
                                        />

                                        <PretendText
                                            style={{
                                                textAlign: "center",
                                                color: Colors.BLACK,
                                                fontWeight: "600",
                                                fontSize: RatioUtil.font(13),
                                            }}
                                        >
                                            {jsonSvc.findLocalById("10001")}
                                        </PretendText>
                                    </View>
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(16),
                                            fontWeight: "600",
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {parseFloat((tourRewardData?.REWARD_BDST ?? 0).toFixed(1))}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        backgroundColor: Colors.GRAY13,
                                        borderRadius: RatioUtil.width(6),
                                        height: RatioUtil.height(49),
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingLeft: RatioUtil.width(20),
                                        paddingRight: RatioUtil.width(20),
                                        marginTop: RatioUtil.height(10),
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Image
                                            source={FanRank.point_yellow}
                                            style={{
                                                width: RatioUtil.width(14),
                                                height: RatioUtil.width(14),
                                                marginRight: RatioUtil.width(4),
                                            }}
                                        />
                                        <PretendText
                                            style={{
                                                textAlign: "center",
                                                color: Colors.BLACK,
                                                fontWeight: "600",
                                                fontSize: RatioUtil.font(13),
                                            }}
                                        >
                                            {jsonSvc.findLocalById("2037")}
                                        </PretendText>
                                    </View>
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(16),
                                            fontWeight: "600",
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {parseFloat((tourRewardData?.REWARD_TRAINING ?? 0).toFixed(1))}
                                    </PretendText>
                                </View>
                            </View>
                            <PretendText
                                style={{
                                    color: "#87878D",
                                    fontWeight: "400",
                                    fontSize: RatioUtil.font(14),
                                    marginTop: RatioUtil.height(10),
                                }}
                            >
                                {`\u2022`} {jsonSvc.findLocalById("110058")}
                            </PretendText>
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    color: Colors.BLACK,
                                    fontWeight: "700",
                                    fontSize: RatioUtil.font(16),
                                    marginTop: RatioUtil.height(30),
                                }}
                            >
                                {jsonSvc.findLocalById("170009")}
                            </PretendText>
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    color: Colors.BLACK,
                                    fontWeight: "400",
                                    fontSize: RatioUtil.font(14),
                                    marginTop: RatioUtil.height(6),
                                    marginBottom: RatioUtil.height(20),
                                }}
                            >
                                {checkUserRank(rewardCheerDataforTest)}
                            </PretendText>
                            <View
                                style={{
                                    width: "100%",
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: Colors.GRAY13,
                                        borderRadius: RatioUtil.width(6),
                                        height: RatioUtil.height(49),
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        paddingLeft: RatioUtil.width(20),
                                        paddingRight: RatioUtil.width(20),
                                    }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                                        <Image
                                            source={FanRank.point_blue}
                                            style={{
                                                width: RatioUtil.width(14),
                                                height: RatioUtil.width(14),
                                                marginRight: RatioUtil.width(4),
                                            }}
                                        />
                                        <PretendText
                                            style={{
                                                textAlign: "center",
                                                color: Colors.BLACK,
                                                fontWeight: "600",
                                                fontSize: RatioUtil.font(13),
                                            }}
                                        >
                                            {jsonSvc.findLocalById("10001")}
                                        </PretendText>
                                    </View>
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(16),
                                            fontWeight: "600",
                                            color: Colors.BLACK,
                                        }}
                                    >
                                        {parseFloat(
                                            (rewardCheerDataforTest?.RANK_USERS[0].EXPECT_BDST ?? 0).toFixed(1)
                                        )}
                                    </PretendText>
                                </View>
                            </View>
                            <PretendText
                                style={{
                                    // textAlign: "center",
                                    color: "#87878D",
                                    fontWeight: "400",
                                    fontSize: RatioUtil.font(14),
                                    marginTop: 13,
                                    marginBottom: 30,
                                }}
                            >
                                {`\u2022`} {jsonSvc.findLocalById("110054")}
                            </PretendText>
                            <CustomButton
                                // onPress={() => onPressReward()}
                                onPress={() => testOnPressReward()}
                                style={{
                                    borderWidth: 0.2,
                                    backgroundColor: Colors.BLACK,
                                    borderRadius: 100,
                                    width: "100%",
                                    height: RatioUtil.height(50),
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginBottom: RatioUtil.height(12),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "600",
                                    }}
                                >
                                    {jsonSvc.findLocalById("110049")}
                                </PretendText>
                            </CustomButton>
                        </View>
                    </View>
                </Modal>*/}
            </View>

            {/* Tutorial POP UP */}
            {showHomeScreenTutorial && step == 3 ? (
                <CustomButton
                    onPress={() => finishTutorial()}
                    style={{
                        ...RatioUtil.size(360, Platform.OS == "ios" ? 660 : 680),
                        ...homeStyle.popUpRaffle.mainView,
                        backgroundColor: `${Colors.BLACK}90`,
                        zIndex: 2,
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
                                            finishTutorial()
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
                                <View style={[homeStyle.popUpRaffle.mainView1, RatioUtil.sizeFixedRatio(360, 522)]}>
                                    <View style={homeStyle.popUpRaffle.mainView2}>
                                        <PretendText style={homeStyle.popUpRaffle.txtPage}>
                                            {tutorialSlideIndex + "/" + 2}
                                        </PretendText>
                                    </View>
                                    <Carousel.Slide
                                        loop={true}
                                        width={RatioUtil.width(360)}
                                        height={RatioUtil.lengthFixedRatio(522)}
                                        style={{ overflow: "hidden" }}
                                        data={[1, 2]}
                                        autoPlay
                                        autoPlayInterval={3000}
                                        scrollAnimationDuration={1000}
                                        onSnapToItem={index => setTutorialSlideIndex(index + 1)}
                                        renderItem={({ item, index }) =>
                                            index == 0 ? (
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
                                                        라이브 대회 연동
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
                                                        스쿼드에 배치한 프로의 실제 대회{"\n"}성적과 나의 보상은
                                                        연동됩니다.
                                                    </PretendText>
                                                    <FastImage
                                                        source={IntroImg.maincard01}
                                                        style={{
                                                            ...RatioUtil.sizeFixedRatio(360, 400),
                                                            marginTop: RatioUtil.lengthFixedRatio(37),
                                                        }}
                                                    />
                                                </View>
                                            ) : (
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
                                                        나만의 스쿼드 만들기
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
                                                        내가 가진 프로 NFT로 최고의{"\n"}스쿼드를 만들고 보상을
                                                        획득하세요!
                                                    </PretendText>
                                                    <FastImage
                                                        source={IntroImg.maincard0201}
                                                        style={{
                                                            ...RatioUtil.sizeFixedRatio(236, 392),
                                                            marginTop: RatioUtil.lengthFixedRatio(38),
                                                        }}
                                                    />
                                                    <FastImage
                                                        source={IntroImg.maincard0202}
                                                        style={{
                                                            ...RatioUtil.sizeFixedRatio(325, 201),
                                                            position: "absolute",
                                                            top: RatioUtil.lengthFixedRatio(200),
                                                            left: RatioUtil.width(17),
                                                        }}
                                                    />
                                                </View>
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        </View>
                    </BottomSheet>
                </CustomButton>
            ) : null}

            {/* EVENT POP UP */}
            {!showHomeScreenTutorial && eventVisible ? (
                <CustomButton
                    onPress={async () => {
                        await Analytics.logEvent(AnalyticsEventName.click_event_popup_close_40, {
                            hasNewUserData: true,
                            first_action: "FALSE",
                        })

                        setEventVisible(false)
                    }}
                    style={{
                        ...RatioUtil.size(360, Platform.OS == "ios" ? 660 : 680),
                        ...homeStyle.popUpRaffle.mainView,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={1}
                        backgroundComponent={MyBackdrop}
                        snapPoints={[RatioUtil.lengthFixedRatio(400), RatioUtil.lengthFixedRatio(400)]}
                        // onChange={handleSheetChanges}
                        handleComponent={null}
                        containerStyle={{ backgroundColor: "transparent" }}
                        style={{ backgroundColor: "transparent" }}
                    >
                        <View
                            style={{ flex: 1, justifyContent: "flex-end", bottom: 0, backgroundColor: "transparent" }}
                        >
                            <View style={{ ...RatioUtil.sizeFixedRatio(360, 400), backgroundColor: "transparent" }}>
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
                                        onPress={async () => {
                                            await Analytics.logEvent(AnalyticsEventName.click_event_popup_close_40, {
                                                hasNewUserData: true,
                                                first_action: "FALSE",
                                            })
                                            setEventVisible(false)
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
                                <View style={homeStyle.popUpRaffle.mainView1}>
                                    <View style={homeStyle.popUpRaffle.mainView2}>
                                        <PretendText style={homeStyle.popUpRaffle.txtPage}>
                                            {numberEvent + "/" + listRafflePopup.length}
                                        </PretendText>
                                    </View>
                                    <Carousel.Slide
                                        loop={listRafflePopup.length > 1 ? true : false}
                                        width={RatioUtil.width(360)}
                                        height={RatioUtil.width(370)}
                                        style={{ overflow: "hidden" }}
                                        data={listRafflePopup.sort((a, b) => (a.POPUP_ORDER > b.POPUP_ORDER ? 1 : -1))}
                                        autoPlay
                                        autoPlayInterval={3000}
                                        scrollAnimationDuration={1000}
                                        onSnapToItem={index => setNumberEvent(index + 1)}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                }}
                                                onPress={async () => {
                                                    await Analytics.logEvent(
                                                        AnalyticsEventName[
                                                            `click_event_popup_${index + 1}_40` as AnalyticsEventName
                                                        ],
                                                        { hasNewUserData: true, first_action: "FALSE" }
                                                    )

                                                    item.POPUP_LINK != null
                                                        ? navigate(Screen.WEBVIEWTERM, {
                                                              url: item.POPUP_LINK,
                                                          })
                                                        : null
                                                }}
                                                activeOpacity={0.8}
                                            >
                                                <FastImage
                                                    source={{ uri: item.POPUP_IMAGE }}
                                                    style={{ flex: 1 }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            </View>
                        </View>
                    </BottomSheet>
                </CustomButton>
            ) : null}
            <MyPageFooter />
        </View>
    )
}

export default ItemListScreen

export const Help = () => {
    const [dimension, onLayout] = useDimension()

    const [nftList] = useQuery(
        () => nftSvc.getMyNftListSpending({ order: "ASC", take: 0, page: 1, filterType: NftFilterType.COMMON }),
        {
            loading: false,
        }
    )

    if (!nftList) return null
    const calculateNftCount = (nftList: INftList[]) => {
        let haveCount = 0
        let gradeCount = 0
        if (nftList.length <= 2) {
            haveCount = 1
        } else if (nftList.length <= 4) {
            haveCount = 2
        } else if (nftList.length <= 7) {
            haveCount = 3
        } else if (nftList.length <= 11) {
            haveCount = 4
        } else if (nftList.length <= 15) {
            haveCount = 6
        } else if (nftList.length <= 19) {
            haveCount = 8
        } else if (nftList.length <= 24) {
            haveCount = 11
        } else if (nftList.length <= 29) {
            haveCount = 14
        } else if (nftList.length <= 35) {
            haveCount = 17
        } else if (nftList.length <= 43) {
            haveCount = 20
        } else if (nftList.length <= 53) {
            haveCount = 24
        } else if (nftList.length <= 65) {
            haveCount = 28
        } else if (nftList.length <= 79) {
            haveCount = 33
        } else {
            haveCount = 38
        }
        for (let i = 0; i < nftList.length; i++) {
            const { grade } = nftList[i]
            nftList[i]
            let result = 0
            if (grade <= 2) {
                result = 0
            } else if (grade === 3) {
                result = 0.5
            } else if (grade === 4) {
                result = 2
            } else if (grade === 5) {
                result = 3
            } else if (grade === 6) {
                result = 5
            } else {
                result = 0
            }
            gradeCount += result
        }

        return { nftCountReward: haveCount, nftGradeReward: Math.floor(gradeCount) }
    }
    const { nftCountReward, nftGradeReward } = calculateNftCount(nftList.data)
    return (
        <View style={{ flex: 1 }} onLayout={onLayout}>
            <ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            width: dimension.width,
                            height: RatioUtil.height(110),
                            paddingLeft: RatioUtil.width(25),
                            paddingRight: RatioUtil.width(50),
                        }}
                    >
                        <PretendText style={homeStyle.home.headerText}>
                            {/* 참가 방식 */}
                            {jsonSvc.findLocalById("900001")}
                        </PretendText>
                        <PretendText
                            style={[
                                homeStyle.home.desc,
                                { marginTop: RatioUtil.height(15), paddingRight: RatioUtil.width(10) },
                            ]}
                        >
                            {/* 예정된 투어에 내가 보유한 모든 NFT가 자동으로 참가합니다. (단, 에너지가 30% 이하인 NFT는
                            토큰 보상을 받을 수 없습니다.) */}
                            {jsonSvc.findLocalById("900002")}
                        </PretendText>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            marginTop: RatioUtil.height(10),
                            backgroundColor: Colors.WHITE,
                            height: RatioUtil.height(180),
                            width: dimension.width,
                            paddingLeft: RatioUtil.width(25),
                            paddingRight: RatioUtil.width(50),
                        }}
                    >
                        <PretendText style={[homeStyle.home.headerText, { marginTop: RatioUtil.height(15) }]}>
                            {/* 보상 방식 */}
                            {jsonSvc.findLocalById("900003")}
                        </PretendText>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.height(10),
                                width: RatioUtil.width(280),
                            }}
                        >
                            <View>
                                <Image
                                    source={homeImg.num1}
                                    style={{
                                        width: RatioUtil.height(16),
                                        height: RatioUtil.height(16),
                                        marginTop: RatioUtil.height(3),
                                        marginRight: RatioUtil.height(5),
                                    }}
                                />
                            </View>
                            <PretendText
                                style={[
                                    homeStyle.home.desc,
                                    {
                                        width: "100%",
                                    },
                                ]}
                            >
                                {/* 투어 종료 후 BDST를 가장 많이 획득한 순으로 순위를 매깁니다. */}
                                {jsonSvc.findLocalById("900004")}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.height(10),
                                width: RatioUtil.width(280),
                            }}
                        >
                            <View>
                                <Image
                                    source={homeImg.num2}
                                    style={{
                                        width: RatioUtil.height(16),
                                        height: RatioUtil.height(16),
                                        marginTop: RatioUtil.height(3),
                                        marginRight: RatioUtil.height(5),
                                    }}
                                />
                            </View>
                            <PretendText
                                style={[
                                    homeStyle.home.desc,
                                    {
                                        width: "100%",
                                    },
                                ]}
                            >
                                {/* 나의 NFT 보유량 및 최고 등급을 기준으로 1위부터 정산 받을 수 있는 NFT의 수를 정하여 BDST
                                보상 수치를 정산합니다. */}
                                {jsonSvc.findLocalById("900010")}
                            </PretendText>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        height: RatioUtil.height(140),
                        backgroundColor: Colors.WHITE,
                        paddingBottom: RatioUtil.height(30),
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-around",
                            marginTop: RatioUtil.height(20),
                            backgroundColor: Colors.WHITE3,
                            width: RatioUtil.width(320),
                            height: RatioUtil.height(90),
                            borderRadius: RatioUtil.height(10),
                        }}
                    >
                        <View>
                            <PretendText style={{ color: Colors.BLACK, fontSize: RatioUtil.font(16) }}>
                                {/* 현재 정산 대상 NFT 수 */}
                                {jsonSvc.findLocalById("900005")}
                            </PretendText>
                            <PretendText style={{ color: Colors.GRAY2, fontSize: RatioUtil.font(14) }}>
                                {/* 보유 기준 {nftCountReward} + 등급 기준 {nftGradeReward} */}
                                {jsonSvc.formatLocal(jsonSvc.findLocalById("900011"), [
                                    nftCountReward.toString(),
                                    nftGradeReward.toString(),
                                ])}
                            </PretendText>
                        </View>
                        <View>
                            <PretendText style={{ color: Colors.BLACK, fontSize: RatioUtil.font(20) }}>
                                {/* {nftCountReward + nftGradeReward}개 */}
                                {jsonSvc.formatLocal(jsonSvc.findLocalById("7025"), [
                                    (nftCountReward + nftGradeReward).toString(),
                                ])}
                            </PretendText>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: Colors.WHITE,
                        marginTop: RatioUtil.height(10),
                        height: RatioUtil.height(530),
                    }}
                >
                    <PretendText
                        style={[
                            homeStyle.home.headerText,
                            {
                                paddingLeft: RatioUtil.width(25),
                                marginTop: RatioUtil.height(30),
                                marginBottom: RatioUtil.height(10),
                            },
                        ]}
                    >
                        {/* 정산 받을 수 있는 NFT 수 */}
                        {jsonSvc.findLocalById("6015")}
                    </PretendText>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        <View style={homeStyle.home.tableLayout}>
                            <View style={[homeStyle.home.grayLayout, homeStyle.home.wholeLayout]}>
                                <PretendText style={homeStyle.home.tableText}>
                                    {/* 보유 기준 */}
                                    {jsonSvc.findLocalById("900008")}
                                </PretendText>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* 1 ~ 2 */}
                                        {jsonSvc.findLocalById("900012")}
                                    </PretendText>
                                </View>
                                <View style={[homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* 1 */}
                                        {jsonSvc.findLocalById("900016")}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* 3 ~ 5 */}
                                        {jsonSvc.findLocalById("900013")}
                                    </PretendText>
                                </View>
                                <View style={[homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* 2 */}
                                        {jsonSvc.findLocalById("900017")}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* 6 ~ 9 */}
                                        {jsonSvc.findLocalById("900014")}
                                    </PretendText>
                                </View>
                                <View style={[homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* 4 */}
                                        {jsonSvc.findLocalById("900018")}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* 10 ~ 14 */}
                                        {jsonSvc.findLocalById("900015")}
                                    </PretendText>
                                </View>
                                <View style={[homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* 6 */}
                                        {jsonSvc.findLocalById("900019")}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={[homeStyle.home.grayLayout, homeStyle.home.wholeLayout]}>
                                <PretendText style={homeStyle.home.tableText}>
                                    {/* 등급 기준 */}
                                    {jsonSvc.findLocalById("900009")}
                                </PretendText>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* RARE (2개) */}
                                        {jsonSvc.findLocalById("900020")}
                                    </PretendText>
                                </View>
                                <View style={[homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* +1 */}
                                        {jsonSvc.findLocalById("900024")}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* SUPER RARE (1개) */}
                                        {jsonSvc.findLocalById("900021")}
                                    </PretendText>
                                </View>
                                <View style={[homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* +1 */}
                                        {jsonSvc.findLocalById("900025")}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* EPIC (1개) */}
                                        {jsonSvc.findLocalById("900022")}
                                    </PretendText>
                                </View>
                                <View style={[homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* +2 */}
                                        {jsonSvc.findLocalById("900026")}
                                    </PretendText>
                                </View>
                            </View>
                            <View style={homeStyle.home.halfLayoutBox}>
                                <View style={[homeStyle.home.grayLayout, homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* LEGENDARY (1개) */}
                                        {jsonSvc.findLocalById("900023")}
                                    </PretendText>
                                </View>
                                <View style={[homeStyle.home.halfLayout]}>
                                    <PretendText style={homeStyle.home.tableText}>
                                        {/* +3 */}
                                        {jsonSvc.findLocalById("900027")}
                                    </PretendText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
export const ChargeEnergy = ({
    bdst,
    nftList,
    renderToggle,
}: {
    bdst: number | undefined
    nftList: INftList[]
    renderToggle: () => void
}) => {
    const [style, setStyle] = useState({
        backgroundColor: Colors.WHITE3,
        color: Colors.GRAY3,
    })
    const popupDispatch = useWrapDispatch(setPopUp)
    const modalDispatch = useWrapDispatch(setModal)
    const toastDispatch = useWrapDispatch(setToast)
    const nftseqList = nftList?.filter(e => e.energy !== 100).map(e => e.seq)
    const energynow = nftList?.map(e => e.energy)
    if (!nftseqList || !energynow) return null

    const requireEnergy = (array: number[]): number => {
        return array.reduce((acc: number, curr: number) => acc + (100 - curr), 0)
    }

    const allCharge = async (arr: number[]) => {
        await nftSvc.chargeAll(arr)
        popupDispatch({
            open: false,
        })
        renderToggle()
    }
    const chargeRatio = jsonSvc.findConstById(10000).dDoubleValue || 1
    const requireCostArray = nftList.map(e => {
        const ratio = jsonSvc.findGradeById(e.grade).n_EnergyChargeCost
        return (100 - e.energy) * ratio
    })
    const requireCost = requireCostArray.reduce((acc: number, curr: number) => {
        return acc + curr
    }, 0)
    const enableCharge = bdst && bdst >= requireCost

    const insets = useSafeAreaInsets()

    return (
        <View
            style={{
                width: RatioUtil.lengthFixedRatio(360),
                height: RatioUtil.lengthFixedRatio(414) + insets.bottom,
                backgroundColor: Colors.WHITE,
                marginTop:
                    RatioUtil.height(Dimension.BASE.HEIGHT) - RatioUtil.lengthFixedRatio(414) - insets.bottom + 1,
                borderTopStartRadius: RatioUtil.width(10),
                borderTopEndRadius: RatioUtil.width(10),
            }}
        >
            <View
                style={{
                    borderRadius: RatioUtil.width(10),
                    height: RatioUtil.lengthFixedRatio(56),
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: RatioUtil.lengthFixedRatio(20),
                }}
            >
                <PretendText
                    style={{
                        textAlign: "center",
                        color: Colors.BLACK,
                        fontWeight: RatioUtil.fontWeightBold(),
                        fontSize: RatioUtil.font(16),
                    }}
                >
                    {/* 에너지 전체 충전 */}
                    {jsonSvc.findLocalById("1014")}
                </PretendText>
                <CustomButton
                    style={{
                        position: "absolute",
                        right: RatioUtil.width(20),
                    }}
                    onPress={() => {
                        popupDispatch({ open: false })
                    }}
                >
                    <Image
                        source={nftDetailImg.close}
                        style={{
                            width: RatioUtil.width(24),
                            height: RatioUtil.width(24),
                        }}
                        resizeMode="contain"
                    />
                </CustomButton>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: RatioUtil.width(320),
                    marginLeft: RatioUtil.width(20),
                }}
            >
                <Shadow distance={2}>
                    <View
                        style={{
                            // borderColor: Colors.BLACK,
                            borderRadius: RatioUtil.lengthFixedRatio(15),
                            width: RatioUtil.lengthFixedRatio(155),
                            height: RatioUtil.lengthFixedRatio(155),
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <View style={{ alignItems: "center", height: RatioUtil.lengthFixedRatio(63) }}>
                            <Image
                                source={homeImg.star}
                                style={{
                                    width: RatioUtil.lengthFixedRatio(36),
                                    height: RatioUtil.lengthFixedRatio(36),
                                    marginBottom: RatioUtil.lengthFixedRatio(6),
                                }}
                            />
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "400",
                                    color: "#87878D",
                                }}
                            >
                                {/* 대상선수 */}
                                {jsonSvc.findLocalById("7082")}
                            </PretendText>
                        </View>

                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(20),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK,
                                marginTop: RatioUtil.lengthFixedRatio(16),
                            }}
                        >
                            {nftseqList.length}
                        </PretendText>
                    </View>
                </Shadow>
                <Shadow distance={2}>
                    <View
                        style={{
                            borderRadius: RatioUtil.lengthFixedRatio(15),
                            width: RatioUtil.lengthFixedRatio(155),
                            height: RatioUtil.lengthFixedRatio(155),
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <View style={{ alignItems: "center", height: RatioUtil.lengthFixedRatio(63) }}>
                            <Image
                                source={homeImg.charge}
                                style={{
                                    width: RatioUtil.lengthFixedRatio(36),
                                    height: RatioUtil.lengthFixedRatio(36),
                                    marginBottom: RatioUtil.lengthFixedRatio(6),
                                }}
                                resizeMode="contain"
                            />
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "400",
                                    color: "#87878D",
                                }}
                            >
                                {/* 충전 에너지 */}
                                {jsonSvc.findLocalById("1016")}
                            </PretendText>
                        </View>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(20),
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.BLACK,
                                marginTop: RatioUtil.lengthFixedRatio(16),
                            }}
                        >
                            {requireEnergy(energynow)}
                        </PretendText>
                    </View>
                </Shadow>
            </View>
            <Shadow
                distance={0}
                containerStyle={{
                    marginLeft: RatioUtil.lengthFixedRatio(20),
                    marginTop: RatioUtil.lengthFixedRatio(10),
                    marginBottom: RatioUtil.lengthFixedRatio(30),
                }}
            >
                <View
                    style={{
                        backgroundColor: Colors.WHITE3,
                        borderRadius: RatioUtil.lengthFixedRatio(10),
                        width: RatioUtil.width(320),
                        height: RatioUtil.lengthFixedRatio(63),
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            width: RatioUtil.width(280),
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(16),
                                color: "#87878D",
                            }}
                        >
                            {/* 가격 */}
                            {jsonSvc.findLocalById("1006")}
                        </PretendText>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image
                                source={FanRank.point_blue}
                                style={{
                                    width: RatioUtil.lengthFixedRatio(20),
                                    height: RatioUtil.lengthFixedRatio(20),
                                }}
                                resizeMode="contain"
                            />
                            <PretendText
                                style={{
                                    fontSize: RatioUtil.font(18),
                                    marginLeft: RatioUtil.width(5),
                                    color: Colors.BLACK,
                                }}
                            >
                                {parseFloat(requireCost.toFixed(1))}
                            </PretendText>
                        </View>
                    </View>
                </View>
            </Shadow>
            <TouchableOpacity
                onPress={() => {
                    if (checkStopNFT()) {
                        //hazel 0718 BSQA-1240 이슈 해결을 위해 toastDispatch=>modalDispatch로 수정
                        modalDispatch({
                            open: true,
                            children: (
                                // "지금은 투어 보상 정산 중입니다."
                                // "NFT 이동은 잠시 후 다시 진행 해 주세요."
                                <NotifiModal
                                    title={jsonSvc.findLocalById("10000025")}
                                    description={jsonSvc.findLocalById("10000064")}
                                />
                            ),
                        })
                        setTimeout(() => {
                            modalDispatch({ open: false })
                        }, 2000)
                    } else if (!enableCharge) {
                        setStyle({
                            backgroundColor: Colors.GRAY4,
                            color: Colors.GRAY3,
                        })
                        popupDispatch({
                            open: true,
                            children: (
                                <WalletToast
                                    // message={"BDP가 부족합니다."}
                                    message={jsonSvc.findLocalById("10000000")}
                                    // image={nftDetailImg.error}
                                    image="NftDetailErrorSvg"
                                />
                            ),
                        })
                        setTimeout(() => {
                            popupDispatch({ open: false })
                        }, 2000)
                        return
                    } else {
                        allCharge(nftseqList)
                        renderToggle()
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
                    }
                }}
                style={{
                    borderWidth: enableCharge ? 0.4 : 0,
                    backgroundColor: enableCharge ? Colors.BLACK : Colors.WHITE3,
                    borderRadius: 100,
                    width: RatioUtil.width(320),
                    height: RatioUtil.height(60),
                    marginLeft: RatioUtil.width(20),
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <PretendText
                    style={{
                        color: enableCharge ? Colors.WHITE : "#C7C7C7",
                        fontSize: RatioUtil.font(16),
                        fontWeight: "600",
                    }}
                >
                    {/* 충전 */}
                    {jsonSvc.findLocalById("1008")}
                </PretendText>
            </TouchableOpacity>
        </View>
    )
}

export const NftListComponent = React.memo(
    ({
        item,
        nftData,
        sortKey,
        isGrow,
        itemVisible,
        showConfirm,
        nftDisabled,
        setItemSelection,
        setShowConfirm,
        setNftDisabled,
    }: {
        item: IItem[]
        nftData: NftApiData.NftList.ResDto["data"] | null
        sortKey: NftSortKey
        isGrow: boolean
        itemVisible: boolean
        showConfirm: boolean
        nftDisabled: boolean
        setItemSelection: React.Dispatch<any>
        setShowConfirm: React.Dispatch<React.SetStateAction<boolean>>
        setNftDisabled: React.Dispatch<React.SetStateAction<boolean>>
    }) => {
        const ItemCategory = (itemId: number) => {
            switch (itemId) {
                case Category.FREENORMAL:
                    return jsonSvc.findLocalById("7080")
                case Category.SHOPNORMAL:
                    return jsonSvc.findLocalById("7080")
                case Category.SHOPPREMIUM:
                    return jsonSvc.findLocalById("7081")
                case Category.SHOPCHOICE:
                    return jsonSvc.findLocalById("7079")
                case Category.FREEPREMIUM:
                    return jsonSvc.findLocalById("7081")
                case Category.FREECHOICE:
                    return jsonSvc.findLocalById("7079")
                default:
                    return ""
            }
        }

        if (!nftData) return null

        useFocusEffect(
            React.useCallback(() => {
                setNftDisabled(false)
            }, [])
        )
        /*
    const nftListArray = isGrow
        ? nftSvc.listSort(sortKey, nftData.slice()).filter(v => v.trainingMax === v.training && v.is_locked != 1)
        : nftSvc.listSort(sortKey, nftData.slice()).filter(v => v.is_locked != 1)
        */
        const nftListArray = isGrow
            ? nftSvc.listSort(sortKey, nftData.slice()).filter(v => v.trainingMax === v.training)
            : nftSvc.listSort(sortKey, nftData.slice())
        //isGrow : 성장가능 필터를 눌렀는지 여부
        //성장가능 필터를 눌렀을 경우 levelup을 최대치까지 한 card filter
        return (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start" }}>
                {isGrow && nftListArray.length === 0 ? (
                    <View
                        style={{
                            width: RatioUtil.width(320),
                            height: RatioUtil.height(200),
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Image
                            source={liveImg.noData}
                            style={{
                                width: RatioUtil.width(100),
                                height: RatioUtil.width(100),
                                marginBottom: RatioUtil.height(5),
                            }}
                        />
                        <PretendText
                            style={{
                                textAlign: "center",
                                fontSize: RatioUtil.font(14),
                                color: Colors.GRAY2,
                            }}
                        >
                            {/* {"성장 가능한 선수가\n없습니다."} */}
                            {jsonSvc.findLocalById("170109")}
                        </PretendText>
                    </View>
                ) : (
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                            width: RatioUtil.width(320),
                        }}
                    >
                        {itemVisible &&
                            item.map((v: IItem, j) => {
                                return (
                                    <Fragment key={j}>
                                        <CustomButton
                                            style={{
                                                flexWrap: "wrap",
                                                ...RatioUtil.sizeFixedRatio(155, 220),
                                                marginTop: RatioUtil.width(5),
                                                marginBottom: RatioUtil.width(5),
                                            }}
                                            onPress={() => {
                                                setNftDisabled(true)
                                                setItemSelection(v)
                                                setShowConfirm(true)
                                            }}
                                            disabled={nftDisabled}
                                        >
                                            {v.sIcon ? (
                                                <FastImage
                                                    source={{
                                                        uri: ConfigUtil.getPlayerImage(v.sIcon),
                                                    }}
                                                    style={{
                                                        ...RatioUtil.sizeFixedRatio(155, 220),
                                                    }}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                >
                                                    <PretendText
                                                        style={{
                                                            color: Colors.WHITE,
                                                            fontSize: RatioUtil.font(14),
                                                            fontWeight: "700",
                                                            marginLeft: RatioUtil.width(20),
                                                            marginTop: RatioUtil.height(20),
                                                        }}
                                                    >
                                                        {ItemCategory(v.itemId)}
                                                    </PretendText>
                                                </FastImage>
                                            ) : null}
                                        </CustomButton>
                                    </Fragment>
                                )
                            })}
                        {nftListArray.map((v, i) => (
                            <CustomButton
                                key={i}
                                style={{
                                    ...RatioUtil.sizeFixedRatio(155, 220),
                                    //marginTop: RatioUtil.width(10),
                                    marginTop: RatioUtil.lengthFixedRatio(5),
                                    marginBottom: RatioUtil.lengthFixedRatio(5),
                                }}
                                // nibble: mynftlist에서 nftDetailVx로만 변경하였습니다.
                                // onPress={() => navigate(Screen.NFT_DETAIL_VX, { nftseq: v.seq })}
                                onPress={() => {
                                    setNftDisabled(true)
                                    navigate(Screen.NFTDETAIL, { nftseq: v.seq })
                                }}
                                disabled={showConfirm}
                            >
                                <NftImage
                                    grade={v.grade}
                                    birdie={v.birdie}
                                    energy={v.energy}
                                    level={v.level}
                                    sortKey={sortKey}
                                    playerCode={v.playerCode}
                                />
                                {/* hazel 0718 NFT스쿼드 "배치중" 상태 표시 ui 추가 */}
                                <View style={styles.isEquippedContainer}>
                                    {v.is_equipped === 1 && <Text style={styles.isEquippedText}>{"배치중"}</Text>}
                                </View>
                            </CustomButton>
                        ))}
                        <CustomButton
                            onPress={() => {
                                navigate(Screen.NFTTABSCENE)
                            }}
                            style={{
                                ...RatioUtil.sizeFixedRatio(155, 220),
                                justifyContent: "center",
                                alignItems: "center",
                                //marginTop: RatioUtil.width(10),
                                marginTop: RatioUtil.lengthFixedRatio(5),
                                //marginLeft: (nftListArray.length + item.length) % 2 ? RatioUtil.width(10) : 0,
                            }}
                        >
                            <ImageBackground
                                source={playerCardImg.dashbox}
                                resizeMode="contain"
                                style={{
                                    ...RatioUtil.sizeFixedRatio(155, 220),
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={playerCardImg.nftAdd}
                                    style={{
                                        width: RatioUtil.width(20),
                                        height: RatioUtil.width(20),

                                        marginBottom: RatioUtil.height(10),
                                    }}
                                    resizeMode="contain"
                                />
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        color: Colors.GRAY3,
                                        textAlign: "center",
                                    }}
                                >
                                    {/* {" NFT를 추가로\n획득해보세요!"} */}
                                    {jsonSvc.findLocalById("120018")}
                                </PretendText>
                            </ImageBackground>
                        </CustomButton>
                    </View>
                )}
            </View>
        )
    }
)

export const RewardCheckComponent = ({
    liveGameId,
    nftList,
    onHelpBox,
    rewardBdst,
    gameData,
}: {
    liveGameId?: IGame
    nftList: INftList[]
    loading: boolean
    onHelpBox: () => void
    gameData?: ISeasonDetail
    rewardBdst?: number
}) => {
    const [gameNames, setGameNames] = useState<GameInfo[]>([])
    const [seasonKey, setSeasonKey] = useState<number>(2023)

    const [weekPlayGame, setWeekPlayGame] = useState<ISeasonDetail[]>()
    const [rounds, setrounds] = useState<IRound[]>()

    const gameRoundInfo = useSelector((state: any) => state.mySquadReducer.gameRound)

    const gameSeq = useSelector((state: any) => state.mySquadReducer.gameSeq)
    const gameCode = useSelector((state: any) => state.mySquadReducer.gameCode)
    const [mySquadData, setMySquadData] = useState<MySquadList | null>(null)

    const dispatch = useDispatch()

    const weekGameName = async () => {
        const seasonKey = await liveSvc.getSetSeason()
        setSeasonKey(seasonKey)
        const weekPlayGame = await liveSvc.getGameList(seasonKey)
        setWeekPlayGame(weekPlayGame)
        const getCurrentData = await liveSvc.getCurrentDate(seasonKey)
        const nowDate = getCurrentData.currentDate?.replace(" ", "T")

        const currentDate = new Date(Date.parse(nowDate))

        let addStartDay = 0
        let addEndDay = 0
        if (currentDate.getDay() == 1) {
            // 현재시간이 월요일이면 0일 00시부터 +5일 00시까지 시작시간 검사
            addStartDay = 0
            addEndDay = 5
        } else if (currentDate.getDay() == 2) {
            // 현재시간이 화요일이면 -1일 00시부터 +4일 00시까지 시작시간 검사
            addStartDay = -1
            addEndDay = 4
        } else if (currentDate.getDay() == 3) {
            // 현재시간이 수요일이면 -2일 00시부터 +3일 00시까지 시작시간 검사
            addStartDay = -2
            addEndDay = 3
        } else if (currentDate.getDay() == 4) {
            // 현재시간이 목요일이면 -3일 00시부터 +2일 00시까지 시작시간 검사
            addStartDay = -3
            addEndDay = 2
        } else if (currentDate.getDay() == 5) {
            // 현재시간이 금요일이면 -4일 00시부터 +1일 00시까지 시작시간 검사
            addStartDay = -4
            addEndDay = 1
        } else if (currentDate.getDay() == 6) {
            // 현재시간이 토요일이면 -5일 00시부터 0일 00시까지 시작시간 검사
            addStartDay = -5
            addEndDay = 0
        } else if (currentDate.getDay() == 0) {
            // 현재시간이 일요일이면 -6일 00시부터 -1일 00시까지 시작시간 검사
            addStartDay = -6
            addEndDay = -1
        }

        const currentStartDate = new Date(Date.parse(nowDate))
        const currentEndDate = new Date(Date.parse(nowDate))
        const currentWeekMonday = new Date(currentStartDate.setDate(currentStartDate.getDate() + addStartDay))
        const currentWeekSunDay = new Date(currentEndDate.setDate(currentEndDate.getDate() + addEndDay))

        if (!weekPlayGame) {
            return
        }
        const filteredGames = []

        for (const game of weekPlayGame) {
            const beginDate = new Date(game.BEGIN_AT)

            if (beginDate >= currentWeekMonday && beginDate <= currentWeekSunDay) {
                const gameInfo = {
                    BEGIN_AT: game.BEGIN_AT,
                    gameName: game.gameName,
                    gameStatus: game.gameStatus,
                    seasonKey: game.SEASON_CODE,
                    liveLink: game.liveLinkId,
                    id: game.gameId,
                }
                filteredGames.push(gameInfo)
                break
            }
        }
        dispatch(gameFilterMonday(filteredGames))
        setGameNames(filteredGames)
    }
    useEffect(() => {
        weekGameName()
    }, [])

    const [timeCountDown, setTimeCountDown] = useState<number | 0>(
        moment().startOf("isoWeek").unix() + 600 - dayjs().unix()
    )
    const timerRef = useRef(timeCountDown)
    const [checkEndWeek, setCheckEndWeek] = useState<Boolean | false>(false)

    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     setLoading(!!rewardBdst)
    // }, [rewardBdst])
    const setTimer = () => {
        let startDateCurrent = moment().startOf("isoWeek").unix()
        let next10Minutes = moment().startOf("isoWeek").unix() + 600
        let today = moment().unix()
        if (today <= next10Minutes && today >= startDateCurrent) {
            const timerId = setInterval(() => {
                timerRef.current -= 1
                if (timerRef.current < 0) {
                    setCheckEndWeek(false)
                    clearInterval(timerId)
                } else {
                    setTimeCountDown(timerRef.current)
                }
            }, 1000)
            return () => {
                clearInterval(timerId)
            }
        }
    }

    /*정산 기간 체크 */
    // const settleCheck = async () => {
    //     const isSettle = await callSetGameApi()=
    //     if (isSettle === undefined) return
    //     setIsSettlePeriod(isSettle)
    //     return isSettle
    // }
    const [gameStatus, setGameStatus] = useState<String>("")

    const gameInfo = async () => {
        const gameList = await liveSvc.getGameList(seasonKey)
        const matchingGames = gameList.filter(game => {
            return gameNames.some(name => name.gameName === game.gameName)
        })
        if (matchingGames.length > 0) {
            const gameSeq = matchingGames[0].SEQ_NO
            const gameCode = matchingGames[0].gameId

            const getGameStatus = matchingGames[0].gameStatus
            setGameStatus(getGameStatus)

            dispatch(setGameSeq(gameSeq))
            dispatch(setGameCode(gameCode))
        }
    }
    const [udtTime, setUdtTime] = useState<string>("")
    const [udtTimeCalculate, setUdtTimeCalculate] = useState<string>("")

    const roundInfo = async () => {
        if (gameCode !== 0) {
            await liveSvc.getCompetitionDetail(gameCode).then(gameRoundInfo => {
                dispatch(gameRound(gameRoundInfo))
                const rounds = gameRoundInfo.ROUNDS
                setrounds(rounds)
                const matchingRounds = gameRoundInfo.ROUNDS.filter(
                    round => round.ROUND_CODE === gameRoundInfo.roundSeq - 1
                )
                const udtAtTimes = matchingRounds.map(round => round.UDT_AT)
                // const udtAtTimes = gameRoundInfo.UDT_AT

                const udtAtTime = udtAtTimes[0].toString()
                setUdtTime(udtAtTime)

                const matchingRoundsChange = gameRoundInfo.ROUNDS.filter(
                    round => round.ROUND_CODE === gameRoundInfo.roundSeq
                )
                const udtAtCalculateTimes = matchingRoundsChange.map(round => round.UDT_AT)
                const udtAtCalculateTime = udtAtCalculateTimes[0].toString()

                setUdtTimeCalculate(udtAtCalculateTime)
            })
        }
    }

    const [calculateFlag, setCalculateFlag] = useState<boolean>(false)
    const [totalReward, setTotalReward] = useState<number>(0)

    const showRewardTest = async () => {
        if ((gameCode !== 0 && (gameStatus === "END" || gameStatus === "SUSPENDED")) || calculateFlag === true) {
            const data = await liveSvc.showReward(gameCode)
            const calculateFlag = data.REWARD_TOUR.isCalculating
            setCalculateFlag(calculateFlag)
            // 게임 정산 여부 상태관리 저장
            dispatch(setTourGameCalculateResult(calculateFlag))

            //경기 중단 (gameRoundInfo.gameStatus === "SUSPENDED")일 때 보상량 출력
            const totalReward = data.REWARD_TOUR.REWARD_BDST
            const totalRewardCalculate = Math.floor(totalReward * 10) / 10
            setTotalReward(totalRewardCalculate)
        }
    }

    const [playerData, setPlayerData] = useState<IBdstPlayer[]>([])

    const getReward = async () => {
        if (!gameData) return
        try {
            const { bdstPlayers } = await rewardSvc.getTotalBdstForPlayerNow(gameData)
            setPlayerData(bdstPlayers)
        } catch (error) {
            setPlayerData([])
        }
    }

    useEffect(() => {
        getReward()
    }, [gameData])

    useEffect(() => {
        gameInfo()
        showRewardTest()
    }, [gameNames, calculateFlag, gameCode, gameStatus])

    useEffect(() => {
        setTimer()
        roundInfo()
    }, [checkEndWeek, gameSeq, gameCode])

    // useEffect(() => {
    //     showRewardTest()
    // }, [calculateFlag])

    useFocusEffect(
        React.useCallback(() => {
            if (gameSeq !== 0) {
                const fetchMySquadList = async () => {
                    const myNftPlayerList = await mySquadSvc.getMySquadList(gameSeq)
                    if (myNftPlayerList.code === "SUCCESS") {
                        setMySquadData(myNftPlayerList?.data)
                    }
                }
                fetchMySquadList()
            }
        }, [checkEndWeek, gameSeq, gameCode])
    )

    const navigation = useNavigation()

    const goMySquad = async () => {
        await Analytics.logEvent(AnalyticsEventName.click_squad_45, { hasNewUserData: true, first_action: "FALSE" })
        navigation.navigate(Screen.MYSQUAD, { gameSeq, gameRound, udtTime })
    }

    const [diffMsToHours, setDiffMsToHours] = useState(0)
    const [diffMsToMinutes, setDiffMsToMinutes] = useState(0)

    let [diffCalculateHours, setDiffCalculateHours] = useState(0)
    let [diffCalculateMinutes, setDiffCalculateMinutes] = useState(0)
    let [diffCalculateSeconds, setDiffCalculateSeconds] = useState(0)
    let [calculateText, setCalculateText] = useState("")

    let interval: any = []
    useEffect(() => {
        interval = setInterval(() => {
            if (gameRoundInfo?.gameStatus === "CONTINUE") {
                // 남은 교체시간
                // 백엔드에서 내려준 시간
                let udtAtTimes = udtTime
                // console.log("mysquad.tsx : udtTime1 : ", udtTime)
                // ISO8601 문자열을 Date 객체로 변환
                let originDt = new Date(udtAtTimes)

                // 기준 시간에서 8시간 더하기
                let timeToAdd = 8
                let addHoursDt = new Date(originDt.getTime() + timeToAdd * 60 * 60 * 1000)

                // 한국 시간 구하기
                let now = new Date() // 현재 시간
                let utcNow = now.getTime() + now.getTimezoneOffset() * 60 * 1000 // 현재 시간을 utc로 변환한 밀리세컨드값
                let koreaTimeDiff = 9 * 60 * 60 * 1000 // 한국 시간은 UTC보다 9시간 빠름
                let koreaNow = new Date(utcNow + koreaTimeDiff) // utc로 변환된 값을 한국 시간으로 변환시키기 위해 9시간(밀리세컨드)를 더함

                // 현재시간에서 기준시간 빼기
                let diffMs = addHoursDt.getTime() - koreaNow.getTime()
                let diffMsToHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
                let diffMsToMinutes = Math.floor((diffMs / (1000 * 60)) % 60)
                // let diffMsToSeconds = Math.floor((diffMs / 1000) % 60)

                // 계산 결과 음수이면 0으로 설정
                if (diffMsToHours < 0 || diffMsToMinutes < 0) {
                    diffMsToHours = 0
                    diffMsToMinutes = 0
                }

                setDiffMsToMinutes(diffMsToMinutes)
                setDiffMsToHours(diffMsToHours)
                // let expressionTime = diffMsToHours + "시간 " + diffMsToMinutes + "분 " + diffMsToSeconds + "초 남음"
                // console.log("mysquad.tsx : expressionTime : ", expressionTime)
            }

            //정산 종료까지의 시간 구하기
            if (gameRoundInfo?.gameStatus === "END" || calculateFlag === true) {
                // 현재시간
                let now = new Date()
                // let now = new Date(2023, 6, 10, 0, 9, 59, 0)

                // 백엔드에서 받은 종료 업데이트 시간(일요일 오후나 저녁)
                let udtAtTimeCalculate = udtTimeCalculate
                let nextDayDateTime = new Date(udtAtTimeCalculate)
                // 정산종료 시간은 STATUS가 END로 업데이트 된 일시의 다음날 00:10으로 설정
                nextDayDateTime.setDate(nextDayDateTime.getDate() + 1)
                nextDayDateTime.setHours(0, 10, 0, 0)
                // console.log("xxx3 : nextDayDateTime : ", nextDayDateTime)

                // 정산종료시간에서 현재시간을 빼고 몇시간, 몇분, 몇초 남았는지 계산
                let diffCalculateMs = nextDayDateTime.getTime() - now.getTime()
                let diffCalculateHours = Math.floor(diffCalculateMs / (1000 * 60 * 60))
                let diffCalculateMinutes = Math.floor((diffCalculateMs % (1000 * 60 * 60)) / (1000 * 60))
                let diffCalculateSeconds = Math.floor((diffCalculateMs % (1000 * 60)) / 1000)

                // 계산된 시,분,초가 하나라도 음수이면 현재시간이 정산종료시간을 넘은것으로 0으로 설정
                if (
                    diffCalculateHours < 0 ||
                    diffCalculateMinutes < 0 ||
                    diffCalculateSeconds < 0 ||
                    (diffCalculateHours === 0 && diffCalculateMinutes === 0 && diffCalculateSeconds === 0)
                ) {
                    diffCalculateHours = 0
                    diffCalculateMinutes = 0
                    diffCalculateSeconds = 0
                    setCalculateText("정산이 연장되고 있습니다. 잠시만 기다려주세요.")
                }

                // 변수 설정
                setDiffCalculateHours(diffCalculateHours)
                setDiffCalculateMinutes(diffCalculateMinutes)
                setDiffCalculateSeconds(diffCalculateSeconds)

                // let expressionTime1 =
                //     diffCalculateHours + "시간 " + diffCalculateMinutes + "분 " + diffCalculateSeconds + "초 남음"
                // console.log("xxx3 : expressionTime1 : ", expressionTime1)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [udtTime, udtTimeCalculate])

    // 1. 투어 대기
    // 게임이 종료되었을 경우
    //  정산중이 아닐경우

    // 2. 투어 진행중
    // 게임이 진행중인경우
    // 정산중이 아닌 경우

    // 3. 투어 정산
    // 게임이 종료되었을 경우
    // 정산중일 경우
    return (
        <View
            style={{
                justifyContent: "flex-start",
                alignItems: "center",
                width: RatioUtil.width(320),
                marginTop: RatioUtil.lengthFixedRatio(13),
            }}
        >
            {calculateFlag === false ? (
                <>
                    {/* hazel - 0706 calculateFlag 값 조건추가 calculateFlag === false 일 때 정산 중이 아닐 때 */}
                    {gameNames.length !== 0 && gameRoundInfo?.gameStatus === "BEFORE" && (
                        <Shadow distance={6} startColor="#0000000a">
                            <TouchableOpacity
                                onPress={goMySquad}
                                style={{ justifyContent: "space-around", borderRadius: RatioUtil.width(15) }}
                            >
                                <View
                                    style={{
                                        width: RatioUtil.width(320),
                                        marginLeft: RatioUtil.width(20),
                                        borderRadius: RatioUtil.width(15),
                                    }}
                                >
                                    <View style={{ justifyContent: "center" }}>
                                        <PretendText
                                            style={{
                                                fontSize: RatioUtil.font(16),
                                                color: Colors.BLACK,
                                                fontWeight: RatioUtil.fontWeightBold(),
                                                alignContent: "flex-start",
                                                justifyContent: "flex-end",
                                                marginTop: RatioUtil.height(20),
                                            }}
                                        >
                                            {mySquadData?.mySquadSeq === null
                                                ? "대회에 출전할\n프로를 스쿼드에 배치하세요."
                                                : "대회 시작 전까지\n교체할 수 있습니다."}
                                        </PretendText>
                                    </View>
                                    {mySquadData?.mySquadSeq === null ? (
                                        <TouchableOpacity onPress={goMySquad}>
                                            <View
                                                style={{
                                                    justifyContent: "space-between",
                                                    flexDirection: "row",
                                                    marginTop: RatioUtil.height(20),
                                                    marginRight: RatioUtil.width(20),
                                                    marginBottom: RatioUtil.height(20),
                                                }}
                                            >
                                                {[...Array(5)].map((_, index) => (
                                                    <Image
                                                        key={index}
                                                        source={MySquadImg.plus}
                                                        style={{
                                                            width: RatioUtil.lengthFixedRatio(48),
                                                            height: RatioUtil.lengthFixedRatio(48),
                                                        }}
                                                    />
                                                ))}
                                            </View>
                                        </TouchableOpacity>
                                    ) : (
                                        <View
                                            style={{
                                                justifyContent: "space-around",
                                                flexDirection: "row",
                                                marginTop: RatioUtil.height(16),
                                            }}
                                        >
                                            {mySquadData?.players.map((value: any, index: any) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    onPress={goMySquad}
                                                    style={{ marginRight: RatioUtil.width(20) }}
                                                >
                                                    {value && value.userNftSeq ? (
                                                        <View style={styles.imageContainer}>
                                                            <FastImage
                                                                source={{ uri: NFT_S3 + value.gradeThumbnailImagePath }}
                                                                style={styles.imageBackground}
                                                                resizeMode={FastImage.resizeMode.cover}
                                                            >
                                                                <FastImage
                                                                    source={{
                                                                        uri: NFT_S3 + value.tumbnailImagePath,
                                                                    }}
                                                                    style={styles.image}
                                                                />
                                                            </FastImage>
                                                        </View>
                                                    ) : (
                                                        <View style={styles.imageContainer}>
                                                            <FastImage source={MySquadImg.plus} style={styles.image} />
                                                        </View>
                                                    )}
                                                    <View style={styles.textContainer}>
                                                        <View>
                                                            <PretendText
                                                                style={[
                                                                    styles.title,
                                                                    value &&
                                                                        value.name &&
                                                                        value.name.length === 2 &&
                                                                        styles.centerAlign,
                                                                ]}
                                                            >
                                                                {value && value.name !== null ? value.name : ""}
                                                            </PretendText>
                                                        </View>
                                                        <View>
                                                            <PretendText style={styles.description}>
                                                                {value && value.level !== null
                                                                    ? `Lv. ${value.level}`
                                                                    : null}
                                                            </PretendText>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        </Shadow>
                    )}

                    {(gameNames.length !== 0 &&
                        gameRoundInfo?.gameStatus === "CONTINUE" &&
                        mySquadData?.isFirst === false) ||
                    (gameRoundInfo?.gameStatus === "PLAY" && mySquadData?.isFirst === false) ||
                    (gameRoundInfo?.gameStatus === "SUSPENDED" &&
                        gameRoundInfo?.periodType === "SUSPENDED" &&
                        mySquadData?.isFirst === false) ? (
                        <>
                            <View>
                                {gameRoundInfo?.gameStatus === "CONTINUE" && (
                                    <View
                                        style={{
                                            backgroundColor: "rgba(84, 101, 255, 0.1)",
                                            width: RatioUtil.width(320),
                                            borderRadius: 6,
                                            marginBottom: RatioUtil.height(16),
                                            flexDirection: "row",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {mySquadData?.isLocked === false && (
                                            <SvgIcon name="Clock" style={RatioUtil.size(13, 13)} />
                                        )}

                                        {loading ? (
                                            <ActivityIndicator size={"large"} color={Colors.GRAY10} />
                                        ) : (
                                            <Text
                                                style={{
                                                    color: "#5465FF",
                                                    fontWeight: "700",
                                                    textAlign: "center",
                                                    fontSize: 13,
                                                    paddingTop: RatioUtil.height(7),
                                                    paddingBottom: RatioUtil.height(6),
                                                    paddingLeft: RatioUtil.width(6),
                                                }}
                                            >
                                                {gameRoundInfo?.gameStatus === "CONTINUE" &&
                                                    mySquadData?.isFirst === false &&
                                                    (isNull(mySquadData) || mySquadData?.isLocked === false) &&
                                                    `교체가능: ${diffMsToHours}시간 ${diffMsToMinutes}분`}

                                                {gameRoundInfo?.gameStatus === "CONTINUE" &&
                                                    mySquadData?.isFirst === false &&
                                                    rounds?.length !== gameRoundInfo.roundSeq &&
                                                    mySquadData?.isLocked === true &&
                                                    "교체 완료"}

                                                {gameRoundInfo?.gameStatus === "CONTINUE" &&
                                                    mySquadData?.isFirst === false &&
                                                    rounds?.length === gameRoundInfo.roundSeq &&
                                                    mySquadData?.isLocked === true &&
                                                    "최종 스쿼드"}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                            <Shadow distance={6} startColor="#0000000a" style={{ width: RatioUtil.width(320) }}>
                                <CustomButton onPress={() => goMySquad()} style={{ borderRadius: RatioUtil.width(15) }}>
                                    <View
                                        style={{
                                            width: RatioUtil.width(285),
                                            marginTop: RatioUtil.lengthFixedRatio(20),
                                            marginLeft: RatioUtil.width(20),
                                            marginRight: RatioUtil.width(15),
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <View
                                            style={{
                                                alignItems: "center",
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(16),
                                                    color: Colors.BLACK,
                                                    fontWeight: RatioUtil.fontWeightBold(),
                                                    lineHeight: RatioUtil.font(16) * 1.3,
                                                }}
                                            >
                                                {/* 0707 hazel 조건 관련 텍스트 이슈로 수정 */}
                                                {/* 획득 가능한\n예상 대회 보상량 */}
                                                {jsonSvc.findLocalById("120008")}
                                            </PretendText>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            {loading ? (
                                                <ActivityIndicator size={"large"} color={Colors.GRAY10} />
                                            ) : (
                                                <PretendText
                                                    style={{
                                                        fontSize: RatioUtil.font(32),
                                                        color: Colors.BLACK,
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                    }}
                                                >
                                                    {mySquadData?.mySquadSeq === null
                                                        ? 0
                                                        : gameRoundInfo?.gameStatus === "SUSPENDED"
                                                        ? totalReward
                                                        : rewardBdst}
                                                    {/* {!mySquadData ? 0 : rewardBdst} */}
                                                    {/* {rewardSvc.getSumBdst(playerData)} */}
                                                </PretendText>
                                            )}

                                            <FastImage
                                                source={homeImg.coin}
                                                style={{
                                                    height: RatioUtil.width(40),
                                                    width: RatioUtil.width(40),
                                                    marginLeft: RatioUtil.width(6),
                                                }}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            justifyContent: "space-around",
                                            flexDirection: "row",
                                            marginTop: RatioUtil.height(16),
                                        }}
                                    >
                                        {mySquadData?.mySquadSeq === null ? (
                                            <TouchableOpacity
                                                onPress={goMySquad}
                                                disabled={
                                                    diffCalculateHours === 0 &&
                                                    diffCalculateMinutes === 0 &&
                                                    diffCalculateSeconds === 0
                                                }
                                            >
                                                <View
                                                    style={{
                                                        justifyContent: "space-between",
                                                        flexDirection: "row",
                                                        marginTop: RatioUtil.height(16),
                                                        marginLeft: RatioUtil.width(10),
                                                    }}
                                                >
                                                    {[...Array(5)].map((_, index) => (
                                                        <Image
                                                            key={index}
                                                            source={MySquadImg.plus}
                                                            style={{
                                                                width: RatioUtil.lengthFixedRatio(48),
                                                                height: RatioUtil.lengthFixedRatio(48),
                                                                marginRight: RatioUtil.width(10),
                                                            }}
                                                        />
                                                    ))}
                                                </View>
                                                <View
                                                    style={{
                                                        marginTop: RatioUtil.height(12),
                                                        marginBottom: RatioUtil.height(14),
                                                    }}
                                                >
                                                    <PretendText style={styles.playText}>
                                                        {"프로가 배치되지 않았습니다."}
                                                    </PretendText>
                                                    {gameRoundInfo?.gameStatus === "CONTINUE" ? (
                                                        <PretendText style={styles.playText}>
                                                            {`${gameRoundInfo.roundSeq} ROUND 시작 전까지만 추가 가능합니다.`}
                                                        </PretendText>
                                                    ) : (
                                                        <PretendText style={styles.playText}>
                                                            {"스쿼드 교체 시간에 추가 가능합니다."}
                                                        </PretendText>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        ) : (
                                            <View
                                                style={{
                                                    justifyContent: "space-around",
                                                    flexDirection: "row",
                                                    marginTop: RatioUtil.height(16),
                                                }}
                                            >
                                                {mySquadData?.players.map((value: any, index: any) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={goMySquad}
                                                        style={{ marginRight: RatioUtil.width(10) }}
                                                    >
                                                        {value && value.userNftSeq ? (
                                                            <View style={styles.imageContainer}>
                                                                <FastImage
                                                                    source={{
                                                                        uri: NFT_S3 + value.gradeThumbnailImagePath,
                                                                    }}
                                                                    style={styles.imageBackground}
                                                                    resizeMode={FastImage.resizeMode.cover}
                                                                >
                                                                    <FastImage
                                                                        source={{
                                                                            uri: NFT_S3 + value.tumbnailImagePath,
                                                                        }}
                                                                        style={styles.image}
                                                                    />
                                                                </FastImage>
                                                            </View>
                                                        ) : (
                                                            <View style={styles.imageContainer}>
                                                                <FastImage
                                                                    source={MySquadImg.plus}
                                                                    style={styles.image}
                                                                />
                                                            </View>
                                                        )}
                                                        <View style={styles.textContainer}>
                                                            <View>
                                                                <PretendText
                                                                    style={[
                                                                        styles.title,
                                                                        value &&
                                                                            value.name &&
                                                                            value.name.length === 2 &&
                                                                            styles.centerAlign,
                                                                    ]}
                                                                >
                                                                    {value && value.name !== null ? value.name : ""}
                                                                </PretendText>
                                                            </View>
                                                            <View>
                                                                <PretendText style={styles.description}>
                                                                    {value && value.level !== null
                                                                        ? `Lv. ${value.level}`
                                                                        : ""}
                                                                </PretendText>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                </CustomButton>
                            </Shadow>
                        </>
                    ) : null}

                    {/* 한번도 스쿼드 배치 한 적 없는 유저 / gameStatus="PLAY", gameStatus="CONTINUE" 일 때 조건처리 */}
                    {/* hazel todo : 한번도 배치 한 적 없는 유저 스쿼드 조건 처리 (gameNames.length !== 0 조건 수정) */}

                    {gameNames.length !== 0 &&
                        mySquadData?.isFirst === true &&
                        (gameRoundInfo?.gameStatus === "PLAY" || gameRoundInfo?.gameStatus === "CONTINUE") && (
                            <Shadow distance={6} startColor="#0000000a" style={{ width: RatioUtil.width(320) }}>
                                <CustomButton
                                    onPress={() => goMySquad()}
                                    style={{ justifyContent: "space-around", borderRadius: RatioUtil.width(15) }}
                                >
                                    <View
                                        style={{
                                            width: RatioUtil.width(285),
                                            marginTop: RatioUtil.lengthFixedRatio(20),
                                            marginLeft: RatioUtil.width(20),
                                            marginRight: RatioUtil.width(15),
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <View
                                            style={{
                                                alignItems: "center",
                                            }}
                                        >
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(16),
                                                    color: Colors.BLACK,
                                                    fontWeight: RatioUtil.fontWeightBold(),
                                                    lineHeight: RatioUtil.font(16) * 1.3,
                                                }}
                                            >
                                                {jsonSvc.findLocalById("120008")}
                                            </PretendText>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                            }}
                                        >
                                            {loading ? (
                                                <ActivityIndicator size={"large"} color={Colors.GRAY10} />
                                            ) : (
                                                <PretendText
                                                    style={{
                                                        fontSize: RatioUtil.font(32),
                                                        color: Colors.BLACK,
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                    }}
                                                >
                                                    {mySquadData?.mySquadSeq === null ? 0 : rewardBdst}
                                                </PretendText>
                                            )}

                                            <FastImage
                                                source={homeImg.coin}
                                                style={{
                                                    height: RatioUtil.width(40),
                                                    width: RatioUtil.width(40),
                                                    marginLeft: RatioUtil.width(6),
                                                }}
                                                resizeMode={FastImage.resizeMode.contain}
                                            />
                                        </View>
                                    </View>
                                    <View
                                        style={{
                                            justifyContent: "space-around",
                                            flexDirection: "row",
                                        }}
                                    >
                                        {mySquadData?.mySquadSeq === null ? (
                                            <CustomButton onPress={() => goMySquad()}>
                                                <View
                                                    style={{
                                                        justifyContent: "space-around",
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            justifyContent: "space-between",
                                                            flexDirection: "row",
                                                            marginTop: RatioUtil.height(16),
                                                            marginLeft: RatioUtil.width(10),
                                                        }}
                                                    >
                                                        {[...Array(5)].map((_, index) => (
                                                            <Image
                                                                key={index}
                                                                source={MySquadImg.plus}
                                                                style={{
                                                                    width: RatioUtil.lengthFixedRatio(48),
                                                                    height: RatioUtil.lengthFixedRatio(48),
                                                                    marginRight: RatioUtil.width(10),
                                                                }}
                                                            />
                                                        ))}
                                                    </View>
                                                    <View
                                                        style={{
                                                            marginTop: RatioUtil.height(13),
                                                            marginBottom: RatioUtil.height(18),
                                                        }}
                                                    >
                                                        <PretendText style={styles.playText}>
                                                            {"프로가 배치되지 않았습니다."}
                                                        </PretendText>
                                                        <PretendText style={styles.playText}>
                                                            {"지금 바로 스쿼드를 만들어 보세요!"}
                                                        </PretendText>
                                                    </View>
                                                </View>
                                            </CustomButton>
                                        ) : (
                                            <View
                                                style={{
                                                    justifyContent: "space-around",
                                                    flexDirection: "row",
                                                    marginTop: RatioUtil.height(16),
                                                }}
                                            >
                                                {mySquadData?.players.map((value: any, index: any) => (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => goMySquad()}
                                                        style={{ marginRight: RatioUtil.width(20) }}
                                                    >
                                                        {value && value.userNftSeq ? (
                                                            <View style={styles.imageContainer}>
                                                                <FastImage
                                                                    source={{
                                                                        uri: NFT_S3 + value.gradeThumbnailImagePath,
                                                                    }}
                                                                    style={styles.imageBackground}
                                                                    resizeMode={FastImage.resizeMode.cover}
                                                                >
                                                                    <FastImage
                                                                        source={{
                                                                            uri: NFT_S3 + value.tumbnailImagePath,
                                                                        }}
                                                                        style={styles.image}
                                                                    />
                                                                </FastImage>
                                                            </View>
                                                        ) : (
                                                            <View style={styles.imageContainer}>
                                                                <Image source={MySquadImg.plus} style={styles.image} />
                                                            </View>
                                                        )}
                                                        <View
                                                            style={[
                                                                styles.textContainerCal,
                                                                { justifyContent: "center", alignItems: "center" },
                                                            ]}
                                                        >
                                                            <View>
                                                                <PretendText style={styles.title}>
                                                                    {value && value.name !== null ? value.name : ""}
                                                                </PretendText>
                                                            </View>
                                                            <View>
                                                                <PretendText style={styles.description}>
                                                                    {value && value.level !== null
                                                                        ? `Lv. ${value.level}`
                                                                        : ""}
                                                                </PretendText>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                </CustomButton>
                            </Shadow>
                        )}

                    {gameNames.length === 0 && (
                        <Shadow distance={6} startColor="#0000000a">
                            <CustomButton style={{ justifyContent: "space-around", borderRadius: RatioUtil.width(15) }}>
                                <View
                                    style={{
                                        width: RatioUtil.width(320),
                                        height: RatioUtil.height(82),
                                        flexDirection: "row",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                        borderRadius: RatioUtil.width(15),
                                    }}
                                >
                                    {gameRoundInfo?.gameStatus === "BEFORE" && gameSeq === 0 && gameCode === 0 ? (
                                        <ActivityIndicator size={"large"} color={Colors.GRAY10} />
                                    ) : (
                                        <View style={{ justifyContent: "center" }}>
                                            <PretendText
                                                style={{
                                                    fontSize: RatioUtil.font(16),
                                                    color: Colors.BLACK,
                                                    fontWeight: "700",
                                                    alignContent: "flex-start",
                                                    justifyContent: "flex-end",
                                                }}
                                            >
                                                {"대회가 없습니다. 다음 대회를 기다려주세요!"}
                                            </PretendText>
                                        </View>
                                    )}
                                </View>
                            </CustomButton>
                        </Shadow>
                    )}
                </>
            ) : (
                <>
                    <View>
                        <View
                            style={{
                                backgroundColor: "rgba(84, 101, 255, 0.1)",
                                width: RatioUtil.width(320),
                                borderRadius: 6,
                                marginBottom: RatioUtil.height(16),

                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <SvgIcon name="Clock" style={RatioUtil.size(13, 13)} />
                            {diffCalculateHours === 0 && diffCalculateMinutes === 0 && diffCalculateSeconds === 0 ? (
                                <>
                                    <Text
                                        style={{
                                            color: "#5465FF",
                                            fontWeight: "700",
                                            textAlign: "center",
                                            fontSize: 13,
                                            paddingTop: RatioUtil.height(7),
                                            paddingBottom: RatioUtil.height(6),
                                            paddingLeft: RatioUtil.height(6),
                                        }}
                                    >
                                        {calculateText}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text
                                        style={{
                                            color: "#5465FF",
                                            fontWeight: "700",
                                            textAlign: "center",
                                            fontSize: 13,
                                            paddingTop: RatioUtil.height(7),
                                            paddingBottom: RatioUtil.height(6),
                                            paddingLeft: RatioUtil.height(6),
                                        }}
                                    >
                                        {`정산 종료까지 ${diffCalculateHours}시간 ${diffCalculateMinutes}분 ${diffCalculateSeconds}초`}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>
                    <Shadow distance={6} startColor="#0000000a" style={{ width: RatioUtil.width(320) }}>
                        <CustomButton
                            onPress={() => goMySquad()}
                            style={{ justifyContent: "space-around", borderRadius: RatioUtil.width(15) }}
                        >
                            <View
                                style={{
                                    width: RatioUtil.width(320),
                                    // height: RatioUtil.height(146),
                                    flexDirection: "row",
                                    marginLeft: RatioUtil.width(20),
                                    borderRadius: RatioUtil.width(15),
                                }}
                            >
                                <View style={{ justifyContent: "center" }}>
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(16),
                                            color: Colors.BLACK,
                                            fontWeight: "700",
                                            alignContent: "flex-start",
                                            justifyContent: "flex-end",
                                            marginTop: RatioUtil.height(20),
                                        }}
                                    >
                                        {jsonSvc.findLocalById("120012")}
                                    </PretendText>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    {loading ? (
                                        <ActivityIndicator size={"large"} color={Colors.GRAY10} />
                                    ) : (
                                        <PretendText
                                            style={{
                                                fontSize: RatioUtil.font(32),
                                                color: Colors.BLACK,
                                                fontWeight: "700",
                                                marginLeft: RatioUtil.width(30),
                                                width: RatioUtil.lengthFixedRatio(120),
                                                height: RatioUtil.lengthFixedRatio(42),
                                                textAlign: "right",
                                            }}
                                        >
                                            {mySquadData?.mySquadSeq === null ? 0 : totalReward}
                                            {/* {rewardSvc.getSumBdst(playerData)} */}
                                        </PretendText>
                                    )}

                                    <Image
                                        source={homeImg.coin}
                                        style={{
                                            height: RatioUtil.width(40),
                                            width: RatioUtil.width(40),
                                            marginRight: RatioUtil.width(6),
                                        }}
                                        resizeMode="contain"
                                    />
                                </View>
                            </View>
                            <View
                                style={{
                                    justifyContent: "space-around",
                                    flexDirection: "row",
                                }}
                            >
                                {mySquadData?.mySquadSeq === null ? (
                                    <CustomButton onPress={() => goMySquad()}>
                                        <View
                                            style={{
                                                justifyContent: "space-around",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    justifyContent: "space-between",
                                                    flexDirection: "row",
                                                    marginTop: RatioUtil.height(16),
                                                    marginLeft: RatioUtil.width(10),
                                                }}
                                            >
                                                {[...Array(5)].map((_, index) => (
                                                    <Image
                                                        key={index}
                                                        source={MySquadImg.plus}
                                                        style={{
                                                            width: RatioUtil.lengthFixedRatio(48),
                                                            height: RatioUtil.lengthFixedRatio(48),
                                                            marginRight: RatioUtil.width(10),
                                                        }}
                                                    />
                                                ))}
                                            </View>
                                            <View
                                                style={{
                                                    marginTop: RatioUtil.height(13),
                                                    marginBottom: RatioUtil.height(18),
                                                }}
                                            >
                                                <PretendText style={styles.playText}>
                                                    {"프로가 배치되지 않았습니다."}
                                                </PretendText>
                                                <PretendText style={styles.playText}>
                                                    {"다음 대회에는 보상의 기회를 잡아보세요!"}
                                                </PretendText>
                                            </View>
                                        </View>
                                    </CustomButton>
                                ) : (
                                    <View
                                        style={{
                                            justifyContent: "space-around",
                                            flexDirection: "row",
                                            marginTop: RatioUtil.height(16),
                                        }}
                                    >
                                        {mySquadData?.players.map((value: any, index: any) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => goMySquad()}
                                                style={{ marginRight: RatioUtil.width(20) }}
                                            >
                                                {value && value.userNftSeq ? (
                                                    <View style={styles.imageContainer}>
                                                        <FastImage
                                                            source={{ uri: NFT_S3 + value.gradeThumbnailImagePath }}
                                                            style={styles.imageBackground}
                                                            resizeMode={FastImage.resizeMode.cover}
                                                        >
                                                            <FastImage
                                                                source={{
                                                                    uri: NFT_S3 + value.tumbnailImagePath,
                                                                }}
                                                                style={styles.image}
                                                            />
                                                        </FastImage>
                                                    </View>
                                                ) : (
                                                    <View style={styles.imageContainer}>
                                                        <Image source={MySquadImg.plus} style={styles.image} />
                                                    </View>
                                                )}
                                                <View
                                                    style={[
                                                        styles.textContainerCal,
                                                        { justifyContent: "center", alignItems: "center" },
                                                    ]}
                                                >
                                                    <View>
                                                        <PretendText style={styles.title}>
                                                            {value && value.name !== null ? value.name : ""}
                                                        </PretendText>
                                                    </View>
                                                    <View>
                                                        <PretendText style={styles.description}>
                                                            {value && value.level !== null ? `Lv. ${value.level}` : ""}
                                                        </PretendText>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        </CustomButton>
                    </Shadow>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        // justifyContent: "center",
        flexDirection: "row",
    },
    circle: {
        width: 48,
        height: 48,
        borderRadius: 25,
        overflow: "hidden",
    },
    textContainer: {
        marginLeft: 28,
        marginTop: 8,
        textAlign: "center",
    },
    textContainerCal: {
        marginLeft: 15,
        marginTop: 8,
        textAlign: "center",
    },
    title: {
        fontSize: 13,
        fontWeight: "700",
        // textAlign: "center",
    },
    description: {
        fontSize: 12,
        marginBottom: RatioUtil.height(24),
        color: "#87878D",
        marginLeft: RatioUtil.width(5),
        // textAlign: "center",
    },

    imageContainer: {
        marginRight: 10,
        marginLeft: 20,
        borderRadius: 25,
        overflow: "hidden",
    },
    image: {
        flex: 1,
        width: RatioUtil.lengthFixedRatio(48),
        height: RatioUtil.lengthFixedRatio(48),
        resizeMode: "cover",
        alignItems: "center",
        justifyContent: "center",
    },
    playText: {
        fontSize: 13,
        fontWeight: "400",
        color: "#87878D",
        textAlign: "center",
    },
    imageBackground: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    centerAlign: {
        marginLeft: RatioUtil.lengthFixedRatio(6),
    },
    isEquippedContainer: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        overflow: "hidden",
    },
    isEquippedText: {
        width: RatioUtil.lengthFixedRatio(45),
        height: RatioUtil.lengthFixedRatio(25),
        backgroundColor: "black",
        color: "white",
        padding: 3,
        textAlign: "center",
        borderRadius: scaleSize(10),
        overflow: "hidden",
        fontSize: 12,
        marginTop: RatioUtil.lengthFixedRatio(10),
        paddingTop: RatioUtil.lengthFixedRatio(5),
        marginRight: RatioUtil.lengthFixedRatio(12),
        zIndex: 1,
    },
})

interface IAsset {
    bdst: number
    tbora: number
    trainingPoint: number
}
interface IChannel {
    id: number
    gameStatus: string
    seasonKey: number
    liveLink: string
    BEGIN_AT: Date
    gameName: string
    startDate: string
}
interface IItem {
    seq: number
    regDate: dayjs.Dayjs
    userSeq: number
    itemId: number
    sIcon?: string
}

interface IRenderItem {
    animationValue: {
        value: number
    }
    index: number
    item: IChannel
}
interface IGame {
    BEGIN_AT: Date
    gameName: string
    gameStatus: string
    liveLink: string
    seasonKey: number
    id: number
}

//hazel BEGIN_AT type 수정
interface IGameName {
    BEGIN_AT: string | Date
    gameName: string
    gameStatus: string
    liveLink: string
    seasonKey: number
    id: number
}
//hazel gameNames를 저장하기 위한 interface
interface GameInfo {
    BEGIN_AT: Date | string
    gameName: string
    gameStatus: string
    seasonKey: number
    liveLink: string
    id: number
}

interface ITourReward {
    REWARD_BDST: number
    REWARD_TRAINING: number

    BEGIN_AT: string | Date
    END_AT: string | Date

    GAME_NAME: String
    GAME_CODE: number
}

interface IRewardCheer {
    GAME_CODE: number
    PLAYER_CODE: number
    RANK_TYPE: string
    RANK_USERS: Array<IRankUser>
}

interface IRankUser {
    EXPECT_BDST: number
    RANK: number
    SCORE: number
    USER_SEQ: number
}
export interface INftList {
    amount: number
    energy: number
    golf: {
        birdie: number
        bogey: number
        doubleBogey: number
        eagle: number
        par: number
    }
    birdie: number
    grade: number
    isNew: boolean
    level: number
    name: string
    playerCode: number
    regDate: dayjs.Dayjs
    season: number
    seiral: string
    seq: number
    training: number
    trainingMax: number
    userSeq: number
    wallet: {
        grade: number
        level: number
    }
    imgUri: string
    json?: {
        nChoiceSalesAmount: number
        nID: number
        nPersonID: number
        nSeasonKey: number
        sBirth: string
        sDebut: string
        sPlayerFullImagePath: string
        sPlayerImagePath: string
        sPlayerName: string
        sPlayerthumbnailImagePath: string
        sPublishYear: string
        sTeam: string
    }
}
