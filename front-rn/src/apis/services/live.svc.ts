import { ItemApi } from "apis/context/item.api"
import { NftApi } from "apis/context"
import { ABaseScv } from "./base.svc"
import { NftApiData, PageMeta } from "apis/data"
import { setModal } from "store/reducers/config.reducer"
import store from "store"
import NFTUPGRADE from "json/nft_upgrade.json"
import { LiveApi } from "apis/context/live.api"
import { GameStatus, PeriodType, RoundType } from "const/live.const"
import { GameApi } from "apis/context/game.api"
import { ICourse, ILeaderboard, ISeasonDetail } from "apis/data/season.data"
import { BattleApi } from "apis/context/battle.api"

class LiveSvc extends ABaseScv<LiveSvc>() {
    private readonly gameApi = new GameApi()
    private readonly battleApi = new BattleApi()

    getBattlePlayer = async (gameId: number, playerCode: number) => {
        return await this.battleApi.getBattlePlayer(gameId, playerCode)
    }
    getBattlePlayerList = async (gameId: number, playerCode: string) => {
        return await this.battleApi.getBattlePlayerList(gameId, playerCode)
    }

    getDonatedUsers = async (gameId: number) => {
        return await this.battleApi.getDonatedUsers(gameId)
    }

    getSetSeason = async () => {
        // return await this.liveApi.getSeasonKey()
        return await this.gameApi.getCurrentSeason()
    }
    getGameList = async (seasonKey: number | string) => {
        // return await this.liveApi.getGameList(seasonKey)
        return await this.gameApi.getCurrentSeasonAllCompetitions(seasonKey)
    }
    //hazel 추가
    getCurrentDate = async (seasonKey: number | string) => {
        return await this.gameApi.getCurrentDate(seasonKey)
    }
    getGameDetail = async (gameId: number) => {
        return await this.gameApi.getCompetition(gameId)
    }

    getWinnersBefore = async (gameId: number) => {
        return await this.gameApi.getWinnersBefore(gameId)
    }
    getCompetitionAllCourse = async (gameId: number) => {
        return await this.gameApi.getCompetitionAllCourse(gameId)
    }

    //hazel - 대회 라운드 정보 api추가
    getCompetitionRoundInfo = async (gameId: number) => {
        return await this.gameApi.getCompetitionRoundInfo(gameId)
    }

    //hazel - 대회 라운드 상세 정보 api 추가
    getCompetitionDetail = async (gameId: number) => {
        return await this.gameApi.getCompetitionDetail(gameId)
    }

    getGroupEachRound = async (gameId: number, round: number) => {
        return await this.gameApi.getGroupEachRound({
            GAME_CODE: gameId,
            ROUND_CODE: round,
        })
    }
    getHoleByPlayer = async (gameId: number, PLAYER_CODE: number) => {
        return await this.gameApi.getHoleByPlayer({
            GAME_CODE: gameId,
            PLAYER_CODE,
        })
    }
    getLeaderboardEachRound = async (gameData: ISeasonDetail, round: number) => {
        // 연장전 테스트는 999로 라운드 임의로 테스트

        let lb = await this.gameApi.getLeaderboardEachRound({
            GAME_CODE: gameData.GAME_CODE,
            ROUND_CODE: round,
        })
        return this.filterLeaderboard(lb, gameData)
    }
    getLeaderboardByPlayer = async (gameData: ISeasonDetail, gameId: number, PLAYER_CODE: number) => {
        const lb = await this.gameApi.getLeaderboardByPlayer({
            GAME_CODE: gameId,
            PLAYER_CODE,
        })
        return this.filterLeaderboard(lb, gameData)
    }
    getExtraInfo = async (gameId: number) => {
        // 연장전 테스트는 999로 라운드 임의로 테스트
        return await this.gameApi.getExtraInfo(gameId)
    }
    getGameParticipant = async (gameId: number) => {
        return await this.gameApi.getAllParticipants(gameId)
    }
    getParticipants = async (gameId: number, PLAYER_CODE: number) => {
        return await this.gameApi.getParticipants({ GAME_CODE: gameId, PLAYER_CODE })
    }
    getLikePlayer = async () => {
        const { LIKES } = await this.gameApi.getLikePlayer()
        return LIKES
    }
    likePlayerToggle = async (playerCode: number) => {
        return await this.gameApi.likePlayerToggle(playerCode)
    }
    filterByHoleRange = (courses: ICourse[], min: number, max: number) => {
        return courses.filter(course => course.hole >= min && course.hole <= max).map(course => course.par)
    }
    checkGetReward = async (GAME_CODE: number) => {
        return await this.gameApi.checkGetReward(GAME_CODE)
    }
    showReward = async (GAME_CODE: number) => {
        return await this.gameApi.showReward(GAME_CODE)
    }
    getIsCalculating = async (GAME_CODE: number) => {
        return await this.gameApi.isCalculating(GAME_CODE)
    }
    getReward = async (GAME_CODE: number) => {
        return await this.gameApi.getReward(GAME_CODE)
    }

    // getCompetitionDetail = async (gameId: number) => {
    //     return await this.gameApi.getCompetitionDetail(gameId)
    // }
    getHoleEachRound = async (gameId: number, PLAYER_CODE: number) => {
        return await this.gameApi.getHoleEachRound({
            GAME_CODE: gameId,
            PLAYER_CODE,
        })
    }
    testChatbot = async (gameId: number, round: number) => {
        return await this.battleApi.testChatbot(gameId, round)
    }
    getChatBotReward = async (gameId: number, botSeq: number) => {
        return await this.battleApi.getChatBotReward(gameId, botSeq)
    }
    getMyRewardedList = async (gameId: number) => {
        return await this.gameApi.getMyRewardedList(gameId)
    }

    private filterLeaderboard = (lbList: ILeaderboard[], gameData: ISeasonDetail) => {
        if (
            gameData.gameStatus === GameStatus.PLAY ||
            gameData.gameStatus === GameStatus.CONTINUE ||
            gameData.gameStatus === GameStatus.SUSPENDED ||
            gameData.gameStatus === GameStatus.END
        ) {
            return lbList.filter(lb => lb.totalScore !== 999)
        }

        return lbList
    }
}
export const liveSvc = LiveSvc.instance
