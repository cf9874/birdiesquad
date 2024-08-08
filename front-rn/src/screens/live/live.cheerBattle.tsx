import { ImageBackground, View, Image, Platform } from "react-native"
import { GameUtil, RatioUtil } from "utils"
import { Header, RankProgress, SelectedPlayer } from "./live.cheerBattle.compo"
import { liveImg } from "assets/images"
import { useEffect, useRef, useState } from "react"
import { ISeasonDetail } from "apis/data/season.data"
import { liveSvc } from "apis/services/live.svc"
import { rankSvc } from "apis/services"
import { useAppSelector, useWrapDispatch } from "hooks"
import { shallowEqual } from "react-redux"
import { CustomButton } from "components/utils"
import { SearchPlayer } from "./live.cheerBattle.compo"
import { setPopUp } from "store/reducers/config.reducer"
import { Shadow } from "react-native-shadow-2"
import { Analytics } from "utils/analytics.util"
import { AnalyticsEventName } from "const"
const CheerBattle: React.FC<ICheearBattle> = ({ gameData }) => {
    const popupDispatch = useWrapDispatch(setPopUp)
    const [selectIndex, setSelectIndex] = useState<number>(0)

    const [player, setPlayer] = useState<IPlayer>({
        left: null,
        right: null,
    })
    const [playerArray, setPlayerArray] = useState<IRankList[]>([])
    const getPlayers = async () => {
        if (!gameData) return

        const { data } = GameUtil.checkRound(gameData)
        const { current, prev, isEnd } = data.round

        const roundSeq = isEnd ? prev : current

        if (roundSeq === undefined || roundSeq === null) return

        // const leaderBoardData = await liveSvc.getLeaderboardEachRound(gameData, roundSeq)

        const rankData = await rankSvc.playerRankList({
            gamecode: gameData.gameId,
            min: 1,
            max: 100,
        })

        if (!rankData) return

        const playerCodes = rankData.rankList.map(v => `PLAYER_CODES=${v.playerCode}`).join("&")

        if (!playerCodes) return
        const battleList = await liveSvc.getBattlePlayerList(gameData.GAME_CODE, playerCodes)
        if (!battleList) return

        const playersData: IRankList[] = []
        rankData.rankList.map(rankItem => {
            const matchingBattle = battleList.CHOICE_PLAYERS.find(battle => battle.PLAYER_CODE === rankItem.playerCode)
            playersData.push({
                playerCode: rankItem.playerCode,
                cheerRank: rankItem.rank,
                cheerScore: rankItem.score,
                heartScore: matchingBattle?.SCORE_HEART_COUNT ?? 0,
                donateScore: matchingBattle?.SCORE_CASH_AMOUNT ?? 0,
                // leaderBoardrank: matchingLeaderBoardItem ? matchingLeaderBoardItem.rank : "",
                // roundScore: matchingLeaderBoardItem ? matchingLeaderBoardItem.roundScore : 0,
                // roundSeq: matchingLeaderBoardItem ? matchingLeaderBoardItem.roundSeq : 0,
                // roundStroke: matchingLeaderBoardItem ? matchingLeaderBoardItem.roundStroke : 0,
                info: rankItem.info,
            })
        })

        setPlayerArray(playersData)
    }
    useEffect(() => {
        getPlayers()

        const interval = setInterval(() => {
            getPlayers()
        }, 15000)

        return () => clearInterval(interval)
    }, [gameData])

    useEffect(() => {
        if (!playerArray || playerArray.length === 0) return

        const index = !selectIndex ? selectIndex : playerArray.findIndex(player => player.playerCode === selectIndex)

        if (index === 0) {
            setPlayer({
                left: playerArray[0],
                right: playerArray[1],
            })
        } else if (index > 0 && index < playerArray.length) {
            setPlayer({
                left: playerArray[index - 1],
                right: playerArray[index],
            })
        }
    }, [selectIndex, playerArray])

    const handlePress = async () => {
        await Analytics.logEvent(
            AnalyticsEventName.click_other_player_50,

            {
                hasNewUserData: true,
                first_action: "FALSE",
                game_id: gameData?.GAME_CODE,
                game_status: gameData?.gameStatus,
            }
        )

        playerArray?.length > 0 &&
            popupDispatch({
                open: true,
                children: <SearchPlayer rankList={playerArray} setSelectIndex={setSelectIndex} />,
            })
    }

    return (
        <View style={{ ...RatioUtil.sizeFixedRatio(360, 220) }}>
            <CustomButton onPress={handlePress}>
                <ImageBackground
                    source={liveImg.cheerBackground}
                    style={{ ...RatioUtil.sizeFixedRatio(360, 220) }}
                    resizeMode="stretch"
                >
                    <Header rankList={playerArray} />
                    <View
                        style={{
                            width: RatioUtil.lengthFixedRatio(360),
                            height: RatioUtil.lengthFixedRatio(146),
                        }}
                    >
                        <SelectedPlayer left={player.left} right={player.right} />
                    </View>
                    <RankProgress left={player.left?.cheerScore} right={player.right?.cheerScore} />
                </ImageBackground>
            </CustomButton>
        </View>
    )
}
interface ICheearBattle {
    gameData?: ISeasonDetail
}
export interface IRankList {
    playerCode: number
    cheerRank: number // 응원랭킹 순위
    cheerScore: number // 응원 점수
    heartScore: number // 받은 하트 수
    donateScore: number // 받은 후원 금액
    // leaderBoardrank: string // 리더보드 랭킹
    // roundScore: number // 라운드 점수
    // roundSeq: number // 라운드 수
    // roundStroke: number //
    info?: {
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
interface IPlayer {
    left: IRankList | null
    right: IRankList | null
}

export default CheerBattle
