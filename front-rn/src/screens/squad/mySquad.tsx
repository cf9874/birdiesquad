import { useNavigation } from "@react-navigation/native"
import { face, jsonSvc, mySquadSvc, nftSvc } from "apis/services"
import { homeImg, MySquadImg, nftDetailImg } from "assets/images"
import { ProfileHeader } from "components/layouts"
import { CustomButton, PretendText } from "components/utils"
import { Screen } from "const/navigate.const"
import React, { useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    BackHandler,
    Image,
    ImageBackground,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { navigate, RatioUtil } from "utils"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAsyncEffect, useDimension, useScreen } from "hooks"
import { MySquadList } from "apis/data/mySquad.data"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { homeStyle, rankStyle } from "styles"
import { TabView, TabBar, SceneMap } from "react-native-tab-view"
import MySquadChangeModal from "./mySquadChangeModal"
import MySquadToast from "./mySquadToast"
import { useSelector } from "react-redux"
import MySquadSaveModal from "./mySquadSaveModal"
import { NFT_S3 } from "utils/env"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SvgIcon } from "components/Common/SvgIcon"
import { Analytics } from "utils/analytics.util"
import { AnalyticsEventName } from "const"

const MySquad = ({ route }: any) => {
    const gameSeq = useSelector((state: any) => state.mySquadReducer.gameSeq)
    const gameRoundInfo = useSelector((state: any) => state.mySquadReducer.gameRound)
    const calculateFlag = useSelector((state: any) => state.tourGameCalculateReducer)

    const gameId = gameRoundInfo.gameId

    const navigation = useNavigation()

    const selectedData = route.params

    const { udtTime } = route.params as { udtTime: string }
    const data = [
        { idx: 1, title: "SLOT 1", description: "프로를 선택하세요" },
        { idx: 2, title: "SLOT 2", description: "프로를 선택하세요" },
        { idx: 3, title: "SLOT 3", description: "프로를 선택하세요" },
        { idx: 4, title: "SLOT 4", description: "프로를 선택하세요" },
        { idx: 5, title: "SLOT 5", description: "프로를 선택하세요" },
    ]

    const [mySquadData, setMySquadData] = useState<MySquadList>()
    const [myOriginSquadData, setMyOriginSquadData] = useState<MySquadList>()
    const [loading, setLoading] = useState(false)

    const [selectedBdstValues, setSelectedBdstValues] = useState<any[]>([])
    const [isVisiblePlayer, setIsVisiblePlayer] = useState(false)
    const _Help = () => {
        return (
            <View style={{ flex: 1 }}>
                <Help />
            </View>
        )
    }
    const renderScene = SceneMap({
        help: _Help,
    })
    const [index, setIndexHelp] = useState(0)
    const onSelectHelp = (data: React.SetStateAction<number>) => setIndexHelp(data)

    const [slotModalVisible, setSlotModalVisible] = useState(false)
    const [timeModalVisible, setTimeModalVisible] = useState(false)
    const [successModalVisible, setSuccessModalVisible] = useState(false)

    const [routes] = useState([{ key: "help", title: "" }])

    const [isSelectedPlayer, setIsSelectedPlayer] = useState(false)

    const buttonBackgroundColor = isSelectedPlayer ? "black" : "#E9ECEF"
    const buttonTextColor = isSelectedPlayer ? "white" : "#C7C7C7"

    const getMySquadList = async () => {
        const myNftPlayerList = await mySquadSvc.getMySquadList(gameSeq)
        if (myNftPlayerList.code === "SUCCESS") {
            if (myNftPlayerList?.data.mySquadSeq != null) {
                if (myNftPlayerList?.data.players.length !== 0) {
                    setMySquadData(myNftPlayerList?.data)
                    // 백엔드 데이터 원본 저장
                    setMyOriginSquadData(myNftPlayerList?.data)
                    AsyncStorage.setItem("temp_origin_squad", JSON.stringify(myNftPlayerList?.data)?.toString() || "")

                    AsyncStorage.removeItem("temp_squad")
                } else {
                    setMySquadData(myNftPlayerList?.data)
                    // 백엔드 데이터 원본 저장
                    setMyOriginSquadData(myNftPlayerList?.data)
                    AsyncStorage.removeItem("temp_origin_squad")
                }
            }
        }
    }
    useEffect(() => {
        getMySquadList()
    }, [])

    let squad: any = []
    let extractedData: any[] = []

    const getReward = async () => {
        setLoading(true)

        extractedData = []

        // let playerCnt = mySquadData?.players.length === undefined ? 0 : mySquadData?.players.length
        let playerCnt = mySquadData?.players
        let bdstValues = []

        if (playerCnt) {
            for (let i = 0; i < playerCnt.length; i++) {
                const userNftSeq = playerCnt[i].userNftSeq ?? 0
                if (userNftSeq !== 0 && userNftSeq !== null) {
                    const rewardPlayer = await mySquadSvc.getRewardPlayer(gameId, userNftSeq)
                    setLoading(false)
                    bdstValues.push(rewardPlayer.expectReward.bdst)
                } else {
                    bdstValues.push(0)
                }
            }
        }

        if (bdstValues) {
            const formatBdstValues = bdstValues.map(value => Number(Math.floor(value * 10) / 10))
            setSelectedBdstValues(formatBdstValues)
        } else {
            setSelectedBdstValues([])
        }
    }

    useEffect(() => {
        if (gameRoundInfo.gameStatus !== "BEFORE") {
            getReward()
        }
    }, [mySquadData, gameRoundInfo])

    // 플레이어 정보 저장
    const fetchPlayers = async () => {
        const isBeforePageMain = selectedData.udtTime !== undefined ? true : false

        if (isBeforePageMain) {
            AsyncStorage.removeItem("temp_squad")
        } else {
            if (selectedData) {
                let tempSquad = await AsyncStorage.getItem("temp_squad")

                if (tempSquad !== null && tempSquad !== "null") {
                    squad = JSON.parse(tempSquad)
                }

                if (squad !== null && squad.length !== 0) {
                    // 기존에 저장된 temp_squad가 있음 저장된걸 불러와서 선택한 선수를 끼워넣는 로직
                    const newPlayer = {
                        mySquadPlayerSeq: selectedData.selectedIdx,
                        mySquadSeq: mySquadData?.mySquadSeq,
                        userNftSeq: selectedData.selectedData.userNftSeq,
                        name: selectedData.selectedData.name,
                        playerCode: selectedData.selectedData.playerCode,
                        seasonCode: selectedData.selectedData.seasonCode,
                        tumbnailImagePath: selectedData.selectedData.tumbnailImagePath,
                        gradeThumbnailImagePath: selectedData.selectedData.gradeThumbnailImagePath,
                        gradeImagePath: selectedData.selectedData.gradeImagePath,
                        level: selectedData.selectedData.nftLevel,
                        reward: selectedData.selectedData.maxReward,
                    }

                    squad.players[selectedData.selectedIdx] = newPlayer

                    setMySquadData(squad)
                    checkIsSelectedPlayer(squad)
                } else {
                    // 새로 설정할 플레이어 배열
                    let tempPlayers: any[] = []

                    // 슬롯이 5개니까 5번만큼 반복
                    for (let i = 0; i < 5; i++) {
                        // 추가할 플레이어 객체
                        let addPlayer = {}

                        if (i === selectedData.selectedIdx) {
                            // 선택된 슬롯에는 파라미터로 넘어온 선수 정보 설정
                            addPlayer = {
                                mySquadPlayerSeq: selectedData.selectedIdx,
                                mySquadSeq: 0,
                                userNftSeq: selectedData.selectedData.userNftSeq,
                                name: selectedData.selectedData.name,
                                playerCode: selectedData.selectedData.playerCode,
                                seasonCode: selectedData.selectedData.seasonCode,
                                tumbnailImagePath: selectedData.selectedData.tumbnailImagePath,
                                gradeThumbnailImagePath: selectedData.selectedData.gradeThumbnailImagePath,
                                gradeImagePath: selectedData.selectedData.gradeImagePath,
                                level: selectedData.selectedData.nftLevel,
                                reward: selectedData.selectedData.maxReward,
                            }
                        } else {
                            addPlayer = {
                                mySquadPlayerSeq: 0,
                                mySquadSeq: 0,
                                userNftSeq: 0,
                                name: "",
                                playerCode: 0,
                                seasonCode: 0,
                                gradeImagePath: "",
                                tumbnailImagePath: "",
                                gradeThumbnailImagePath: "",
                                level: 0,
                                reward: 0,
                            }
                        }
                        // 플레이어 배열에 플레이어 객체를 넣음
                        tempPlayers.push(addPlayer)
                    }

                    // 스쿼드 객체에 위에서 설정한 플레이어 배열을 넣음
                    let tempSquad = {
                        mySquadSeq: 0,
                        gameSeq: gameSeq,
                        reward: 0,
                        isLocked: false,
                        isFirst: true,
                        players: tempPlayers,
                    }

                    setMySquadData(tempSquad)
                    checkIsSelectedPlayer(tempSquad)
                }
            }
        }
    }

    const checkIsSelectedPlayer = async (tempSquad: any) => {
        setIsSelectedPlayer(false)
        let tempOriginSquad = await AsyncStorage.getItem("temp_origin_squad")
        if (tempOriginSquad !== null && tempOriginSquad !== "null") {
            let originSquad = JSON.parse(tempOriginSquad)
            for (let i = 0; i < 5; i++) {
                if (originSquad.players[i].userNftSeq !== tempSquad?.players[i].userNftSeq) {
                    setIsSelectedPlayer(true)
                }
            }
        } else {
            setIsSelectedPlayer(true)
        }
    }

    useScreen(() => {
        fetchPlayers()
    }, [selectedData])
    const [showToast, setShowToast] = useState(false)
    const [showToastPlay, setShowToastPlay] = useState(false)

    const selectSquad = (title: string, index: number) => {
        if (mySquadData) {
            AsyncStorage.setItem("temp_squad", JSON.stringify(mySquadData)?.toString() || "")
        }

        // 타이머 종료하고 이동
        clearInterval(interval)

        navigation.navigate(Screen.MYSQUADSELECT, {
            selectedTitle: title,
            selectedIdx: index,
            mySquadData,
        })
    }
    let [transactionType, setTransactionType] = useState<string>("")

    const saveMySquad = async (mySquadPostData: any) => {
        {
            gameRoundInfo?.gameStatus === "CONTINUE" && mySquadData?.isFirst === false
                ? await Analytics.logEvent(AnalyticsEventName.click_squad_change_66, {
                      hasNewUserData: true,
                      first_action: "FALSE",
                  })
                : await Analytics.logEvent(AnalyticsEventName.click_squad_save_66, {
                      hasNewUserData: true,
                      first_action: "FALSE",
                  })
        }
        if (gameRoundInfo?.gameStatus === "BEFORE") {
            if (myOriginSquadData) {
                const updatePlayer = mySquadPostData.players.map((player: any) => ({
                    mySquadPlayerSeq: Number(player.mySquadPlayerSeq),
                    userNftSeq: Number(player.userNftSeq),
                    reward: Number(player.reward),
                }))
                let totalReward = 0
                for (const player of mySquadPostData.players) {
                    totalReward += player.reward
                }

                const patchPlayerbody = {
                    reward: totalReward,
                    mySquadSeq: mySquadPostData.mySquadSeq,
                    players: updatePlayer,
                }
                await mySquadSvc.patchMySquadUpdate(patchPlayerbody)
                navigation.navigate(Screen.NFTLIST, mySquadPostData)
            } else {
                const postPlayer = mySquadPostData.players.map((player: any) => ({
                    userNftSeq: Number(player.userNftSeq),
                    reward: Number(player.reward),
                }))

                // 등록된 스쿼드가 없으면 reward = 0(백엔드 확인완료)
                const postPlayerbody = {
                    gameSeq: gameSeq,
                    reward: 0,
                    players: postPlayer,
                }
                await mySquadSvc.postMySquadInsert(postPlayerbody)
                navigation.navigate(Screen.NFTLIST, mySquadData)
            }
        }

        if (mySquadData?.isLocked) {
            // 슬롯가능개수 alert 모달
            await Analytics.logEvent(AnalyticsEventName.view_squad_change_warning_66, {
                hasNewUserData: true,
                first_action: "FALSE",
            })
            setSlotModalVisible(true)
            return
        }

        // 백엔드에서 내려온 선수리스트와 프론트에서 변경된 선수리스트의 userNftSeq를 비교해서 몇개의 슬롯을 변경했는지 체크하는 로직
        let tempOriginSquad = await AsyncStorage.getItem("temp_origin_squad")
        console.log("xxx : tempOriginSquad", tempOriginSquad)
        let changedSlotCnt = 0

        if (tempOriginSquad !== null && tempOriginSquad !== "null") {
            let originSquad = JSON.parse(tempOriginSquad)

            for (let i = 0; i < 5; i++) {
                if (originSquad.players[i].userNftSeq !== mySquadPostData.players[i].userNftSeq) {
                    changedSlotCnt++
                }
            }
        } else {
            for (let i = 0; i < mySquadPostData.players.length; i++) {
                if (mySquadPostData.players[i].userNftSeq !== 0) {
                    changedSlotCnt++
                }
            }
        }

        if ((mySquadData?.mySquadSeq === null || mySquadData?.mySquadSeq === 0) && mySquadData?.isFirst === true) {
            // 신규 가입자 and 마이스쿼드 구성 이력이 0건
            if (gameRoundInfo?.gameStatus === "CONTINUE" || gameRoundInfo?.gameStatus === "PLAY") {
                // 저장하시겠습니까 confirm 모달
                setTransactionType("INSERT")
                setSuccessModalVisible(true)
            }
        } else if (
            (mySquadData?.mySquadSeq === null || mySquadData?.mySquadSeq === 0) &&
            mySquadData?.isFirst === false
        ) {
            // 기존 가입자 and 마이스쿼드 구성 이력이 1건이상이면
            // 저장하시겠습니까 confirm 모달
            if (gameRoundInfo?.gameStatus === "CONTINUE" && changedSlotCnt > 1) {
                // 슬롯가능개수 alert 모달
                setSlotModalVisible(true)
                return
            }

            // 저장하시겠습니까 confirm 모달
            setTransactionType("INSERT")
            setSuccessModalVisible(true)
        } else {
            // 백엔드에서 내려온 데이터가 있으면(=이미 마이스쿼드에 한번이라도 저장했으면) -> 수정
            // 수정 patch
            if (changedSlotCnt > 1) {
                // 슬롯가능개수 alert 모달
                setSlotModalVisible(true)
                return
            }

            // 저장하시겠습니까 confirm 모달
            setTransactionType("UPDATE")
            setSuccessModalVisible(true)
        }
    }

    const helpClick = () => {
        setIsVisiblePlayer(true)
    }
    const [diffMsToHours, setDiffMsToHours] = useState(0)
    const [diffMsToMinutes, setDiffMsToMinutes] = useState(0)

    const goMain = () => {
        navigation.navigate(Screen.NFTLIST)
    }
    const close = async () => {
        setTimeModalVisible(false)
        if (slotModalVisible === true) {
            setIsSelectedPlayer(false)
            setSlotModalVisible(false)
            let tempOriginSquad = await AsyncStorage.getItem("temp_origin_squad")
            if (tempOriginSquad !== null && tempOriginSquad !== "null") {
                squad = JSON.parse(tempOriginSquad)
                setMySquadData(squad)
            } else {
                setMySquadData(squad)
            }
        }
        setSuccessModalVisible(false)
    }

    const closePopup = () => {
        setIsVisiblePlayer(false)
    }

    const saveSquad = async () => {
        // 모달이 열려있으면 닫음
        setSuccessModalVisible(false)

        // 등록인지 수정인지 확인 후 다른 API를 호출
        if (transactionType === "INSERT") {
            const postPlayer = mySquadData?.players.map((player: any) => ({
                userNftSeq: Number(player.userNftSeq),
                reward: Number(player.reward),
            }))

            // 등록된 스쿼드가 없으면 reward = 0(백엔드 확인완료)
            const postPlayerbody = {
                gameSeq: gameSeq,
                reward: 0,
                players: postPlayer,
            }

            await mySquadSvc.postMySquadInsert(postPlayerbody)
            navigation.navigate(Screen.NFTLIST, mySquadData)
        } else if (transactionType === "UPDATE") {
            const updatePlayer = mySquadData?.players.map((player: any) => ({
                mySquadPlayerSeq: Number(player.mySquadPlayerSeq),
                userNftSeq: Number(player.userNftSeq),
                reward: Number(player.reward),
            }))

            let totalReward = mySquadData?.players.reduce((total, player) => (total = total + player.reward), 0)

            const postPlayer = mySquadData?.players.map((player: any) => ({
                userNftSeq: Number(player.userNftSeq),
                reward: Number(player.reward),
            }))

            const patchPlayerbody = {
                reward: totalReward,
                mySquadSeq: mySquadData?.mySquadSeq,
                players: updatePlayer,
            }

            await mySquadSvc.patchMySquadUpdate(patchPlayerbody)
            navigation.navigate(Screen.NFTLIST, mySquadData)
        }
    }

    // 남은시간 계산
    let interval: any = []
    useEffect(() => {
        interval = setInterval(() => {
            if (gameRoundInfo?.gameStatus === "CONTINUE") {
                // 백엔드에서 내려준 시간
                let udtAtTimes = udtTime
                // let udtAtTimes = "2023-07-16T08:00:00.000Z"

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
                let diffMsToSeconds = Math.floor((diffMs / 1000) % 60)

                // 계산 결과 음수이면 0으로 설정
                if (diffMsToHours < 0 || diffMsToMinutes < 0) {
                    diffMsToHours = 0
                    diffMsToMinutes = 0
                }

                setDiffMsToMinutes(diffMsToMinutes)
                setDiffMsToHours(diffMsToHours)

                let expressionTime = diffMsToHours + "시간 " + diffMsToMinutes + "분 " + diffMsToSeconds + "초 남음"
                // if (diffMsToHours === 0 && diffMsToMinutes === 0) {
                //     clearInterval(interval)
                // }

                // 시간종료 모달
                if (gameRoundInfo?.gameStatus === "CONTINUE" && diffMsToHours === 0 && diffMsToMinutes === 0) {
                    setTimeModalVisible(true)
                }
            }
            // let udtAtTimes = "2023-07-01T03:00:00.000Z"
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const backAction = () => {
            navigate(Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_squad_66, { hasNewUserData: true, first_action: "FALSE" })
    }, [])
    const inset = useSafeAreaInsets()

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <StatusBar translucent={true} barStyle="dark-content" backgroundColor={"transparent"} />
            <View style={{ flexDirection: "column", position: "relative" }}>
                <View style={{ zIndex: 10000, position: "absolute", marginTop: Platform.OS === "ios" ? -18 : 0 }}>
                    {showToastPlay && (
                        <MySquadToast
                            message="대회 중에는 스쿼드를 변경할 수 없습니다."
                            subMessage="라운드 종료 후 교체 가능합니다."
                            onClose={() => setShowToastPlay(false)}
                        />
                    )}
                    {showToast && calculateFlag.isClculate === true && (
                        <MySquadToast
                            message="최종적으로 결정된 스쿼드는 변경할 수 없습니다."
                            onClose={() => setShowToast(false)}
                        />
                    )}
                </View>
                <View
                    style={{
                        flexDirection: "column",
                        position: "relative",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            position: "relative",
                            marginTop: Platform.OS === "ios" ? 0 : RatioUtil.lengthFixedRatio(22),
                        }}
                    >
                        <ProfileHeader title="마이스쿼드" />
                        <TouchableOpacity
                            style={{
                                marginLeft: "auto",
                                marginRight: RatioUtil.lengthFixedRatio(22),
                                width: RatioUtil.lengthFixedRatio(20),
                            }}
                            onPress={helpClick}
                        >
                            <Image
                                source={MySquadImg.notice}
                                style={{
                                    height: RatioUtil.lengthFixedRatio(20),
                                    width: RatioUtil.lengthFixedRatio(20),
                                }}
                            />
                        </TouchableOpacity>
                    </View>

                    <Modal
                        animationType="fade"
                        statusBarTranslucent
                        transparent={false}
                        style={{
                            flex: 1,
                        }}
                        visible={isVisiblePlayer}
                        onRequestClose={() => closePopup()}
                    >
                        <StatusBar translucent={true} barStyle="dark-content" backgroundColor={"white"} />
                        <View
                            style={{
                                ...rankStyle.header.modalMainView,
                                marginTop: inset.top,
                                backgroundColor: "white",
                            }}
                        >
                            <View style={{ flex: 1, ...RatioUtil.size(360) }}>
                                <View style={{ ...rankStyle.header.con }}>
                                    <PretendText style={[rankStyle.header.text, { fontSize: RatioUtil.font(16) }]}>
                                        {"스쿼드 도움말"}
                                    </PretendText>
                                    <View
                                        style={{
                                            top: RatioUtil.lengthFixedRatio(7),
                                            right: RatioUtil.width(15),
                                            position: "absolute",
                                        }}
                                    >
                                        <TouchableOpacity onPress={() => setIsVisiblePlayer(false)}>
                                            <Image
                                                source={nftDetailImg.close}
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(30),
                                                    height: RatioUtil.lengthFixedRatio(30),
                                                    marginTop: RatioUtil.lengthFixedRatio(20),
                                                    zIndex: 99999,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {/* <Help /> */}
                                <TabView
                                    renderTabBar={props => {
                                        return (
                                            <TabBar style={{ height: 0 }} indicatorStyle={{ opacity: 0 }} {...props} />
                                        )
                                    }}
                                    style={{ backgroundColor: "#F7F9FC" }}
                                    navigationState={{ index, routes }}
                                    renderScene={renderScene}
                                    onIndexChange={onSelectHelp}
                                />
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>

            {gameRoundInfo?.gameStatus === "CONTINUE" && mySquadData?.isFirst === false && (
                <>
                    <View>
                        <View style={{ alignItems: "center", marginBottom: RatioUtil.lengthFixedRatio(12) }}>
                            <View style={styles.timeSection}>
                                <SvgIcon name="Clock" style={RatioUtil.size(13, 13)} />
                                <Text style={styles.timeText}>
                                    {/* hazel - 이젤 요청으로 mm분이 아닌 m분으로 통일 */}
                                    {/* {`교체 가능 : ${diffMsToHours}시간 ${diffMsToMinutes
                                        .toString()
                                        .padStart(2, "0")} 분`} */}
                                    {`교체가능 : ${diffMsToHours}시간 ${diffMsToMinutes} 분`}
                                </Text>
                            </View>
                        </View>
                    </View>
                </>
            )}
            {gameRoundInfo?.gameStatus === "BEFORE" && (
                <PretendText style={styles.subTitle}>{"대회에 출전할 프로를 슬롯에 배치하세요"}</PretendText>
            )}

            {/* hazel : 한번도 배치 한 적 없는 유저 스쿼드 조건 처리 */}
            {/* {(mySquadData?.isFirst === true || !mySquadData) &&
                (gameRoundInfo?.gameStatus === "CONTINUE" || gameRoundInfo?.gameStatus === "PLAY") && (
                    <PretendText style={styles.subTitle}>
                        {"가입 유저는 제한 없이 스쿼드 구성을 1번 할 수 있습니다."}
                    </PretendText>
                )}

            {mySquadData?.isFirst === false &&
                (gameRoundInfo?.gameStatus === "PLAY" || gameRoundInfo?.gameStatus === "SUSPENDED") && (
                    <PretendText style={styles.subTitle}>{"대회 중에는 스쿼드를 변경할 수 없습니다"}</PretendText>
                )} */}
            {(gameRoundInfo?.gameStatus === "CONTINUE" ||
                gameRoundInfo?.gameStatus === "PLAY" ||
                gameRoundInfo?.gameStatus === "SUSPENDED") && (
                <PretendText style={styles.subTitle}>
                    {mySquadData?.isFirst || !mySquadData
                        ? "가입 유저는 제한 없이 스쿼드 구성을 1번 할 수 있습니다"
                        : "대회 중에는 스쿼드를 변경할 수 없습니다"}
                </PretendText>
            )}

            {gameRoundInfo?.gameStatus === "CONTINUE" && (mySquadData?.isFirst === false || !mySquadData) && (
                <PretendText style={styles.subTitle}>{"1개의 슬롯만 교체 가능 합니다"}</PretendText>
            )}

            {gameRoundInfo?.gameStatus === "END" && calculateFlag.isClculate === true && (
                <PretendText style={styles.subTitle}>{"대회 보상 정산 중입니다"}</PretendText>
            )}

            <ScrollView>
                <View style={styles.screenContainer}>
                    {data.map((item, index) => {
                        // const player = mySquadData?.players[index]
                        // hazel - 0707 19:14 mySquadData가 undefined 일 때 처리
                        const player = mySquadData?.players ? mySquadData.players[index] : undefined

                        return (
                            <TouchableOpacity
                                key={`${index}-${item.title}`}
                                style={styles.card}
                                onPress={async () => {
                                    if (gameRoundInfo?.gameStatus === "END") {
                                        setShowToast(true)
                                        return
                                    } else if (
                                        (gameRoundInfo?.gameStatus === "PLAY" && mySquadData?.isFirst === false) ||
                                        gameRoundInfo?.gameStatus === "SUSPENDED"
                                    ) {
                                        await Analytics.logEvent(AnalyticsEventName.view_squad_change_warning_66, {
                                            hasNewUserData: true,
                                            first_action: "FALSE",
                                        })
                                        setShowToastPlay(true)
                                        return
                                    }
                                    selectSquad(item.title, index)
                                }}
                                disabled={
                                    gameRoundInfo?.gameStatus === "CONTINUE" &&
                                    mySquadData?.isLocked === true &&
                                    mySquadData?.isFirst === false
                                }
                            >
                                {player && player.userNftSeq ? (
                                    <View style={styles.imageContainer}>
                                        <ImageBackground
                                            source={{ uri: NFT_S3 + player.gradeThumbnailImagePath }}
                                            style={styles.imageBackground}
                                            resizeMode="cover"
                                        >
                                            <ImageBackground
                                                source={{ uri: NFT_S3 + player.tumbnailImagePath }}
                                                style={styles.image}
                                            />
                                        </ImageBackground>
                                    </View>
                                ) : (
                                    <View style={styles.imageContainer}>
                                        <Image source={MySquadImg.plus} style={styles.image} />
                                    </View>
                                )}
                                <View style={styles.textContainer}>
                                    <View
                                        style={{
                                            width: RatioUtil.lengthFixedRatio(86),
                                            justifyContent: "center",
                                            alignItems: "center",
                                            marginLeft:
                                                player?.name && player.name !== null
                                                    ? RatioUtil.lengthFixedRatio(12)
                                                    : RatioUtil.lengthFixedRatio(17),
                                            // marginBottom: RatioUtil.lengthFixedRatio(2),
                                            // marginTop: Platform.OS === "ios" ? RatioUtil.lengthFixedRatio(10) : 0,
                                        }}
                                    >
                                        <PretendText style={styles.title}>
                                            {player && player.name !== "" ? player.name : item.title}
                                        </PretendText>
                                    </View>
                                    {player && player.level !== null && player.level !== 0 ? (
                                        <View style={styles.levelContainer}>
                                            <View
                                                style={{
                                                    width: RatioUtil.lengthFixedRatio(40),
                                                    // marginTop: Platform.OS === "ios" ? RatioUtil.lengthFixedRatio(4) : 0,
                                                }}
                                            >
                                                <PretendText
                                                    style={styles.subTitle}
                                                >{`Lv.${player.level}`}</PretendText>
                                            </View>
                                            {gameRoundInfo?.gameStatus !== "BEFORE" && (
                                                <>
                                                    {loading ? (
                                                        <ActivityIndicator size={"small"} color={Colors.GRAY10} />
                                                    ) : (
                                                        <View
                                                            style={{
                                                                flexDirection: "row",

                                                                width: RatioUtil.width(70),
                                                            }}
                                                        >
                                                            <SvgIcon name="Coin" style={styles.levelImage} />
                                                            <View
                                                                style={{
                                                                    // marginLeft: RatioUtil.width(6),
                                                                    width: RatioUtil.lengthFixedRatio(55),
                                                                }}
                                                            >
                                                                <PretendText
                                                                    style={{
                                                                        fontSize: RatioUtil.font(16),
                                                                        color: Colors.BLACK,
                                                                        fontWeight: "700",
                                                                        textAlign: "right",
                                                                    }}
                                                                >
                                                                    {/* hazel - 0708 보상값이 마이너스일 경우 0으로 리턴 */}
                                                                    {/* {selectedBdstValues[index]} */}
                                                                    {selectedBdstValues[index] < 0
                                                                        ? 0
                                                                        : selectedBdstValues[index]}
                                                                </PretendText>
                                                            </View>
                                                        </View>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                    ) : (
                                        <View style={styles.descriptionContainer}>
                                            <PretendText style={styles.description}>{item.description}</PretendText>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: buttonBackgroundColor }]}
                    onPress={() => saveMySquad(mySquadData)}
                    //hazel 0707 - 선택 선수 없을 때 버튼 disable처리 조건 추가
                    disabled={
                        !isSelectedPlayer ||
                        mySquadData?.isLocked === true ||
                        (mySquadData?.isFirst === false && gameRoundInfo?.gameStatus === "PLAY") ||
                        (mySquadData?.isFirst === false && gameRoundInfo?.gameStatus === "SUSPENDED") ||
                        (gameRoundInfo?.periodType === "END" && gameRoundInfo?.gameStatus === "END")
                    }
                >
                    {gameRoundInfo?.gameStatus === "CONTINUE" && mySquadData?.isFirst === false ? (
                        mySquadData?.isLocked === true ? (
                            <Text style={[styles.buttonText, { color: buttonTextColor }]}>저장 (0회 남음)</Text>
                        ) : (
                            <Text style={[styles.buttonText, { color: buttonTextColor }]}>저장 (1회 남음)</Text>
                        )
                    ) : (
                        <Text style={[styles.buttonText, { color: "white" }]}>저장</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* modal 조건
                case1 : 슬롯을 두개 이상 교체 했을 떄 (슬롯 1개만 교체 가능합니다. 다시 설정해주세요.)
                case2 : 교체 시간이 종료되었을 때
                case3 : 정상적으로 스쿼드 교체가 이뤄졌을 때
            */}
            {timeModalVisible && (
                <MySquadChangeModal
                    modalVisible={timeModalVisible}
                    setModalVisible={setTimeModalVisible}
                    title={"교체 시간이 종료되었습니다. 홈으로 이동합니다."}
                    onPressConfirm={goMain}
                />
            )}

            {slotModalVisible && (
                <MySquadChangeModal
                    modalVisible={slotModalVisible}
                    setModalVisible={setSlotModalVisible}
                    title={"슬롯 1개만 교체 가능 합니다. 다시 설정해주세요."}
                    onPressConfirm={close}
                />
            )}

            {successModalVisible && (
                <MySquadSaveModal
                    modalVisible={successModalVisible}
                    setModalVisible={setSuccessModalVisible}
                    onPressConfirm={saveSquad}
                />
            )}
        </SafeAreaView>
    )
}
export const Help = () => {
    const [dimension, onLayout] = useDimension()

    return (
        <View style={{ flex: 1, backgroundColor: "#F7F9FC" }} onLayout={onLayout}>
            <ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            width: dimension.width,
                            paddingLeft: RatioUtil.width(20),
                            paddingRight: RatioUtil.width(20),
                            paddingTop: RatioUtil.lengthFixedRatio(20),
                            paddingBottom: RatioUtil.lengthFixedRatio(30),
                            justifyContent: "center",
                        }}
                    >
                        <PretendText style={[homeStyle.home.headerText, { fontWeight: RatioUtil.fontWeightBold() }]}>
                            {/* 참가 방식 */}
                            {"마이스쿼드란?"}
                        </PretendText>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(20),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: "#C7C7C7",
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {
                                    "실제 대회 일정에 맞추어 내 프로 NFT로 스쿼드를 만들어 출전시키고 보상을 얻는 방식입니다."
                                }
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(14),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: "#C7C7C7",
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {"내가 출전시킨 프로의 실제 대회 성적과 연동되어 보상이 주어집니다."}
                            </PretendText>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: RatioUtil.lengthFixedRatio(10),
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            width: RatioUtil.width(360),
                            paddingLeft: RatioUtil.width(20),
                            paddingRight: RatioUtil.width(20),
                            paddingTop: RatioUtil.lengthFixedRatio(30),
                            paddingBottom: RatioUtil.lengthFixedRatio(30),
                            justifyContent: "center",
                        }}
                    >
                        <PretendText style={[homeStyle.home.headerText, { fontWeight: RatioUtil.fontWeightBold() }]}>
                            {/* 보상 방식 */}
                            {"스쿼드 배치 방법"}
                        </PretendText>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(20),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: "#C7C7C7",
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {"대회 시작 전 최대 5명의 프로를 출전시킬 수 있습니다."}
                            </PretendText>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(14),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: "#C7C7C7",
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {"대회 시작 전에는 자유롭게 교체 및 추가가 가능합니다."}
                            </PretendText>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(14),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: "#C7C7C7",
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {"해당 대회 미출전 프로는 스쿼드에 배치할 수 없습니다."}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(14),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: "#C7C7C7",
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {"스쿼드에 배치한 프로는 지갑으로 전송하거나 승급 재료로 사용할 수 없습니다."}
                            </PretendText>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(14),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: "#C7C7C7",
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {"대회가 없을 경우 스쿼드는 배치할 수 없습니다."}
                            </PretendText>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: RatioUtil.lengthFixedRatio(10),
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            width: RatioUtil.width(360),
                            paddingLeft: RatioUtil.width(20),
                            paddingRight: RatioUtil.width(20),
                            paddingTop: RatioUtil.lengthFixedRatio(30),
                            paddingBottom: RatioUtil.lengthFixedRatio(50),
                            justifyContent: "center",
                        }}
                    >
                        <PretendText style={[homeStyle.home.headerText, { fontWeight: RatioUtil.fontWeightBold() }]}>
                            {/* 보상 방식 */}
                            {"스쿼드 교체 & 추가 방법"}
                        </PretendText>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(20),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: "#C7C7C7",
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {"라운드가 종료할 때마다 1회 추가 또는 교체가 가능합니다. (마지막 라운드 제외)"}
                            </PretendText>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "flex-start",
                                marginTop: RatioUtil.lengthFixedRatio(14),
                                width: RatioUtil.width(320),
                            }}
                        >
                            <View>
                                <View
                                    style={{
                                        width: RatioUtil.lengthFixedRatio(6),
                                        height: RatioUtil.lengthFixedRatio(6),
                                        marginTop: RatioUtil.lengthFixedRatio(6),
                                        marginRight: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: "#C7C7C7",
                                        borderRadius: RatioUtil.lengthFixedRatio(10),
                                    }}
                                ></View>
                            </View>
                            <PretendText
                                style={{
                                    ...homeStyle.home.desc,
                                    paddingRight: 0,
                                    lineHeight: RatioUtil.font(16) * 1.3,
                                    width: RatioUtil.width(304),
                                }}
                            >
                                {"교체 시간은 라운드 종료 후 8시간 입니다."}
                            </PretendText>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "blue",
        textAlign: "center",
        marginTop: 10,
        fontWeight: "bold",
    },
    screenContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: RatioUtil.lengthFixedRatio(16),
    },
    card: {
        backgroundColor: "#F9F9F9",
        flexDirection: "row",
        padding: 16,
        marginBottom: RatioUtil.lengthFixedRatio(10),
        borderRadius: 10,
        elevation: 3,
        width: RatioUtil.lengthFixedRatio(320),
        height: RatioUtil.lengthFixedRatio(80),
    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: RatioUtil.lengthFixedRatio(80 - 33),
        position: "absolute",
        ...RatioUtil.margin(12, 20, 16, 35),
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
    },
    description: {
        fontSize: 14,
        fontWeight: "400",
        color: "#87878D",
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "700",
        textAlign: "center",
        color: "#87878D",
    },

    button: {
        backgroundColor: "lightgray",
        borderRadius: 100,
        padding: RatioUtil.lengthFixedRatio(20),
        marginBottom: RatioUtil.lengthFixedRatio(20),
        width: RatioUtil.lengthFixedRatio(320),
    },
    buttonText: {
        color: "gray",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    imageBackground: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    imageContainer: {
        marginRight: RatioUtil.lengthFixedRatio(10),
        borderRadius: 25,
        overflow: "hidden",
        width: RatioUtil.lengthFixedRatio(48),
        height: RatioUtil.lengthFixedRatio(48),
    },
    image: {
        flex: 1,
        width: RatioUtil.lengthFixedRatio(48),
        height: RatioUtil.lengthFixedRatio(48),
        resizeMode: "cover",
        alignItems: "center",
        justifyContent: "center",
    },
    timeSection: {
        backgroundColor: "rgba(84, 101, 255, 0.1)",
        width: RatioUtil.lengthFixedRatio(320),
        borderRadius: 6,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    timeText: {
        color: "#5465FF",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 13,
        paddingTop: RatioUtil.lengthFixedRatio(7),
        paddingBottom: RatioUtil.lengthFixedRatio(6),
        paddingLeft: RatioUtil.lengthFixedRatio(6),
    },
    levelContainer: {
        flexDirection: "row",
        marginTop: RatioUtil.lengthFixedRatio(2),
    },
    descriptionContainer: {
        flexDirection: "row",
        alignItems: "flex-end",

        marginLeft: RatioUtil.lengthFixedRatio(60),
    },

    levelImage: {
        marginLeft: RatioUtil.lengthFixedRatio(60),
        marginTop: RatioUtil.lengthFixedRatio(2),
    },
})

export default MySquad
