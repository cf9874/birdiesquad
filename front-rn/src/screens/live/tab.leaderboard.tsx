import React, { useEffect, useState } from "react"
import { View, Text, FlatList, ScrollView, SectionList, Image, SectionListRenderItem, StyleSheet } from "react-native"
import { GameUtil, NumberUtil, RatioUtil, TextUtil } from "utils"
import { CustomButton, PretendText } from "components/utils"
import axios from "axios"
import { liveSvc } from "apis/services/live.svc"
import { Colors, GameStatus } from "const"
import { liveImg } from "assets/images"
import { ICourse, IHole, ILeaderboard, ILikes, ISeasonDetail } from "apis/data/season.data"
import { BoardHeader, ExtensionComponent, MemoizedRankItem, WinnerComponent } from "./tab.leaderboard.compo"
import { ILeaderBoardTab, ILeaderboardByRender, SectionItem } from "./tab.leaderboard.type"
import { jsonSvc } from "apis/services"
const LeaderBoardTab: React.FC<ILeaderBoardTab> = ({ gameData, isEnd }) => {
    // const [endStatus, setEndStatus] = useState(false)
    const [extensionStatus, setExtensionStatus] = useState<IHole[]>([])
    const [leaderboardData, setLeaderboardData] = useState<ILeaderboardByRender>({ like: [], all: [] })
    const [roundSeq, setRoundSeq] = useState<number>(0)
    const [top1Player, setTop1Player] = useState<ILeaderboard>()

    const [courseInfo, setCourseInfo] = useState<ICourse[]>([])

    useEffect(() => {
        initializeLeaderboard()
    }, [gameData])

    const [allLeaderboardData, setAllLeaderboardData] = useState<ILeaderboard[]>([])

    useEffect(() => {
        if (gameData?.gameStatus !== GameStatus.END) return
        async function fetchLeaderboardData() {
            let roundsData: ILeaderboard[] = []
            if (!gameData) return [...roundsData]
            for (let i = 1; i <= gameData.roundSeq; i++) {
                try {
                    const data = await liveSvc.getLeaderboardEachRound(gameData, i)

                    roundsData = [...roundsData, ...data]
                } catch (error) {
                    console.error("Error fetching leaderboard data:", error)
                }
            }
            setAllLeaderboardData(roundsData)
        }

        fetchLeaderboardData()
    }, [gameData])

    const initializeLeaderboard = async () => {
        if (!gameData) return

        const { data } = GameUtil.checkRound(gameData)
        const { current, prev, isEnd } = data.round

        const roundSeq = isEnd ? prev : current //99면 끝

        if (roundSeq === undefined || roundSeq === null) return

        setRoundSeq(roundSeq)

        const extraData = await liveSvc.getExtraInfo(gameData.GAME_CODE)

        extraData && extraData.length > 0 && setExtensionStatus(extraData) // 연장전 여부

        //setEndStatus(gameEnd) // 끝난거 여부 => 99를 임의로 바꿔서 엔드 테스트 가능

        let leaderBoardData = await liveSvc.getLeaderboardEachRound(gameData, roundSeq)

        const likes = await liveSvc.getLikePlayer() // 우리서버에서 관심선수

        const processedLeaderBoardData = processLeaderBoardData(leaderBoardData, likes)

        if (processedLeaderBoardData) leaderBoardData = processedLeaderBoardData

        const likePlayersData = processLikePlayerData(leaderBoardData, likes)

        const top1Player = extraData.length <= 0 ? leaderBoardData.find(player => player.rank === "1") : undefined

        setTop1Player(top1Player)

        setLeaderboardData(prev => ({ ...prev, like: likePlayersData, all: leaderBoardData }))

        const courseInfo = await liveSvc.getCompetitionAllCourse(gameData.GAME_CODE)

        setCourseInfo(courseInfo)
    }

    const processLikePlayerData = (leaderBoardData: ILeaderboard[], likePlayersData: ILikes[]) => {
        const likePlayerCodes = likePlayersData.map(e => e.PLAYER_CODE)
        const likePlayers = leaderBoardData
            .filter(e => likePlayerCodes.includes(e.personId))
            .sort((a, b) => Number(a.rank) - Number(b.rank))
        return likePlayers
    }

    const processLeaderBoardData = (leaderBoardData: ILeaderboard[], likePlayersData: ILikes[]) => {
        if (!leaderBoardData || !likePlayersData) return

        const likePlayerCodes = likePlayersData.map(e => e.PLAYER_CODE)
        leaderBoardData = leaderBoardData.map(e => ({ ...e, like: likePlayerCodes.includes(e.personId) }))
        const processingList = leaderBoardData
            .filter(e => e.playerStatus === "NORMAL")
            .sort((a, b) => Number(a.rank) - Number(b.rank))

        const tossingList = leaderBoardData
            .filter(e => e.playerStatus !== "NORMAL")
            .sort((a, b) => Number(a.rank) - Number(b.rank))

        const cutoff: ILeaderboard = {
            SEQ_NO: 0,
            REG_AT: 0,
            UDT_AT: 0,
            personId: 0,
            cpPersonId: "0",
            nameMain: "cutoff",
            imageUrl: "0",
            namePosition: "0",
            roundSeq: 4,
            rank: "1",
            prize: "144000000",
            hole: "F",
            totalScore: -16,
            roundScore: -2,
            roundStroke: 70,
            playerStatus: "NORMAL",
            orderSeq: 99999,
            PLAYER_CODE: 1639916,
            ROUND_CODE: 4,
            GAME_CODE: 0,
            startHole: 0,
            rankTiedCheck: false,
        }
        return [...processingList, cutoff, ...tossingList]
    }

    const RoundComponent = () => {
        return isEnd ? (
            <View
                style={{
                    ...RatioUtil.sizeFixedRatio(360, 30),
                    backgroundColor: "#EEF1F5",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <PretendText
                    style={{ fontSize: RatioUtil.font(14), fontWeight: RatioUtil.fontWeightBold(), color: "#66666B" }}
                >
                    {/* 경기 종료 */}
                    {jsonSvc.findLocalById("110504")}
                </PretendText>
            </View>
        ) : extensionStatus.length > 0 ? (
            <View
                style={{
                    ...RatioUtil.sizeFixedRatio(360, 30),
                    backgroundColor: "#5465FF10",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <PretendText
                    style={{ fontSize: RatioUtil.font(14), fontWeight: RatioUtil.fontWeightBold(), color: "#5465FF" }}
                >
                    {/* 연장전 */}
                    {jsonSvc.findLocalById("110536")}
                </PretendText>
            </View>
        ) : (
            <View
                style={{
                    ...RatioUtil.sizeFixedRatio(360, 30),
                    backgroundColor: "#5465FF10",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <PretendText
                    style={{ fontSize: RatioUtil.font(14), fontWeight: RatioUtil.fontWeightBold(), color: "#5465FF" }}
                >
                    {/* {roundSeq}R 경기중 */}
                    {gameData?.gameStatus === GameStatus.SUSPENDED
                        ? "대회 중단"
                        : jsonSvc.formatLocal(jsonSvc.findLocalById("110500"), [roundSeq.toString()])}
                </PretendText>
            </View>
        )
    }

    // if (leaderboardData.length === 0) return null

    // leaderboardData[1]?.data[0]?.GAME_COD가 undefined면 로드중인것 0 이면 리더보드 데이터 없는것

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    backgroundColor: Colors.GRAY7,
                    ...RatioUtil.sizeFixedRatio(360, 1),
                }}
            />
            {gameData && leaderboardData.all.length > 0 && leaderboardData.all[0]?.GAME_CODE !== 0 ? (
                <>
                    <RoundComponent />

                    <SectionList<SectionItem>
                        sections={[
                            {
                                status: "header",
                                data: [{ nameMain: "head" }],
                                renderItem: () => (
                                    <View style={{ backgroundColor: "#FFFFFF" }}>
                                        {/* 종료시 우승자*/}
                                        {isEnd && (
                                            <WinnerComponent
                                                top1Player={top1Player}
                                                courseInfo={courseInfo}
                                                gameData={gameData}
                                            />
                                        )}
                                        {/* 연장전일때*/}
                                        {extensionStatus.length <= 0 ? null : (
                                            <ExtensionComponent
                                                extensionStatus={extensionStatus}
                                                // endStatus={isEnd}
                                                leaderboard={leaderboardData?.all ?? []}
                                                setTop1Player={setTop1Player}
                                                gameData={gameData}
                                            />
                                        )}
                                    </View>
                                ),
                            },
                            { status: "like", data: leaderboardData.like },
                            { status: "all", data: leaderboardData.all },
                        ]}
                        keyExtractor={(item, index) => item.nameMain + index}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        extraData={gameData}
                        renderItem={({ item }) => {
                            if (item.nameMain === "header") return null

                            const leaderboardItem = item as ILeaderboard

                            const myPlayerData = allLeaderboardData.filter(
                                data => data.PLAYER_CODE === leaderboardItem.personId
                            )

                            return (
                                <MemoizedRankItem
                                    rank={leaderboardItem.rank}
                                    rankTiedCheck={leaderboardItem?.rankTiedCheck}
                                    totalScore={leaderboardItem.totalScore}
                                    hole={leaderboardItem.hole}
                                    nameMain={leaderboardItem.nameMain}
                                    isPro={leaderboardItem.namePosition === "PRO"}
                                    playerImage={leaderboardItem.imageUrl}
                                    personId={leaderboardItem.personId}
                                    like={leaderboardItem.like}
                                    prize={leaderboardItem.prize}
                                    playerStatus={leaderboardItem.playerStatus}
                                    roundSeq={roundSeq}
                                    roundScore={leaderboardItem.roundScore}
                                    roundStroke={leaderboardItem.roundStroke}
                                    myPlayerData={myPlayerData}
                                    endStatus={isEnd}
                                    courseInfo={courseInfo}
                                    gameData={gameData}
                                    setLeaderboardData={setLeaderboardData}
                                    key={leaderboardItem.personId}
                                />
                            )
                        }}
                        renderSectionHeader={({ section }) => {
                            const name = section.data?.[0]?.nameMain

                            return name === "head" || name === undefined ? (
                                <></>
                            ) : (
                                <BoardHeader
                                    status={section.status}
                                    leaderboardData={leaderboardData}
                                    setLeaderboardData={setLeaderboardData}
                                    endStatus={isEnd}
                                />
                            )
                        }}
                        renderSectionFooter={({ section }) => {
                            const name = section.data?.[0]?.nameMain

                            return name === "head" || name === undefined ? (
                                <></>
                            ) : (
                                <View
                                    style={{
                                        width: "100%",
                                        height: RatioUtil.lengthFixedRatio(10),
                                        backgroundColor: Colors.GRAY9,
                                    }}
                                />
                            )
                        }}
                        stickySectionHeadersEnabled={true}
                    />
                </>
            ) : (
                <View
                    style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.WHITE }}
                >
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Image
                            source={liveImg.noData}
                            style={{
                                width: RatioUtil.width(100),
                                height: RatioUtil.width(100),
                                marginBottom: RatioUtil.lengthFixedRatio(10),
                            }}
                            resizeMode="contain"
                        />
                        <PretendText
                            style={{
                                textAlign: "center",
                                fontSize: RatioUtil.font(14),
                                color: Colors.GRAY2,
                                marginBottom: RatioUtil.lengthFixedRatio(30),
                            }}
                        >
                            {/* {"해당 경기는 리더보드 데이터가\n제공되지 않습니다."} */}
                            {jsonSvc.findLocalById("110305")}
                        </PretendText>
                    </View>
                </View>
            )}
        </View>
    )
}

export default LeaderBoardTab
