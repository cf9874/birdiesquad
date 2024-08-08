import {
    SeasonCode,
    GameCode,
    RoundCode,
    GroupCode,
    HoleCode,
    ICompetition,
    ICourse,
    IGroup,
    IHole,
    ILeaderboard,
    IParticipants,
    IRound,
    ISeason,
    ISeasonDetail,
    IWinners,
    PlayerCode,
    ILikePlayers,
    ILikePlayer,
    IRewardSize,
    IReward,
    IROUNDINFO,
    ICompetitionRoundDetail,
    CurrentDate,
    IsCalculating,
} from "apis/data/season.data"
import { ABaseApi } from "./base.api"
import { ErrorUtil } from "utils"
import { REWARD_TYPE } from "const"

export class GameApi extends ABaseApi {
    constructor() {
        super()
    }
    //현재 세팅된 시즌
    async getCurrentSeason() {
        const { data } = await this.get<number>({
            url: "/api/v1/season-n/season-key",
            options: await this.genAuthConfig(),
        })

        return data
    }
    //[시즌 정보] - 전체
    async getAllSeason() {
        const { data } = await this.get<ISeason[]>({
            url: "/api/v1/season-n/seasons",
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [시즌 정보] - 개별
    async getSeason(SEASON_CODE: number) {
        const { data } = await this.get<ISeasonDetail[]>({
            url: `/api/v1/season-n/seasons/${SEASON_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [전체 대회 정보] - 특정시즌
    async getCurrentSeasonAllCompetitions(SEASON_CODE: number | string) {
        const { data } = await this.get<ISeasonDetail[]>({
            url: `/api/v1/season-n/${SEASON_CODE}/games`,
            options: await this.genAuthConfig(),
        })

        return data
    }

    //hazel currentDate 가져오기

    async getCurrentDate(SEASON_CODE: number | string) {
        const currentDate = await this.get<CurrentDate>({
            url: `/api/v1/season-n/${SEASON_CODE}/games`,
            options: await this.genAuthConfig(),
        })

        return currentDate
    }
    // [개별 대회 정보] - 특정시즌
    async getCompetition(GAME_CODE: number) {
        const { data } = await this.get<ISeasonDetail>({
            url: `/api/v1/season-n/games/${GAME_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [개별 대회 상세 정보]
    async getCompetitionDetail(GAME_CODE: number) {
        const { data } = await this.get<ICompetitionRoundDetail>({
            url: `/api/v1/season-n/games/${GAME_CODE}/detail`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 라운드 정보]
    async getCompetitionAllRound(GAME_CODE: number) {
        const { data } = await this.get<IRound[]>({
            url: `/api/v1/season-n/seasons/${GAME_CODE}/rounds`, //연장전을 해당 api로 요청시 roundStatus가 정수가 아닌 extra로 옴
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 개별 라운드 정보]
    async getCompetitionRoundDetail({
        GAME_CODE: GAME_CODE,
        ROUND_CONDE: ROUND_CONDE,
    }: {
        GAME_CODE: GameCode
        ROUND_CONDE: RoundCode
    }) {
        const { data } = await this.get<IRound[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/rounds/${ROUND_CONDE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 코스 정보]
    async getCompetitionAllCourse(GAME_CODE: number) {
        const { data } = await this.get<ICourse[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/courses`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // hazel - [대회 라운드 정보]
    async getCompetitionRoundInfo(GAME_CODE: number) {
        const { data } = await this.get<IROUNDINFO>({
            url: `/api/v1/season-n/games/${GAME_CODE}/rounds`,
            options: await this.genAuthConfig(),
        })

        return data
    }

    // [ 대회 개별 코스 정보 ]
    async getCompetitionCourseDetail({
        GAME_CODE: GAME_CODE,
        HOLE_CODE: HOLE_CODE,
    }: {
        GAME_CODE: GameCode
        HOLE_CODE: HoleCode
    }) {
        const { data } = await this.get<ICourse[]>({
            url: `/api/v1/season-n/seasons/${GAME_CODE}/courses/${HOLE_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    // [대회 과거 우승자 정보]
    async getWinnersBefore(GAME_CODE: number) {
        const { data } = await this.get<IWinners[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/winners`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 특정 시즌 과거 우승자 정보]
    async getWinnersInSeason({
        GAME_CODE: GAME_CODE,
        SEASON_CODE: SEASON_CODE,
    }: {
        GAME_CODE: GameCode
        SEASON_CODE: SeasonCode
    }) {
        const { data } = await this.get<IWinners[]>({
            url: `/api/v1/season-n/seasons/${GAME_CODE}/winners/${SEASON_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 참가자 정보]
    async getAllParticipants(GAME_CODE: number) {
        const { data } = await this.get<IParticipants[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/participants`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 참가자 개별 정보]
    async getParticipants({
        GAME_CODE: GAME_CODE,
        PLAYER_CODE: PLAYER_CODE,
    }: {
        GAME_CODE: GameCode
        PLAYER_CODE: PlayerCode
    }) {
        const { data } = await this.get<IParticipants[]>({
            url: `/api/v1/season-n/seasons/${GAME_CODE}/participants/${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    //
    // [대회 조편성]
    async getGroup(GAME_CODE: number) {
        const { data } = await this.get<IGroup[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/groupings`,

            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 라운드별 조편성]
    async getGroupEachRound({
        GAME_CODE: GAME_CODE,
        ROUND_CODE: ROUND_CODE,
    }: {
        GAME_CODE: GameCode
        ROUND_CODE: RoundCode
    }) {
        const { data } = await this.get<IGroup[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/rounds/${ROUND_CODE}/groupings`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 라운드별 조편성 - 그룹 번호]
    async getGroupEachRoundInGroup({
        GAME_CODE: GAME_CODE,
        ROUND_CODE: ROUND_CODE,
        GROUP_CODE: GROUP_CODE,
    }: {
        GAME_CODE: GameCode
        ROUND_CODE: RoundCode
        GROUP_CODE: GroupCode
    }) {
        const { data } = await this.get<IGroup[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/rounds/${ROUND_CODE}/groupings/${GROUP_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 라운드별 조편성 - 플레이어]
    async getGroupEachRoundInGroupByPlayer({
        GAME_CODE: GAME_CODE,
        ROUND_CODE: ROUND_CODE,
        GROUP_CODE: GROUP_CODE,
    }: {
        GAME_CODE: GameCode
        ROUND_CODE: RoundCode
        GROUP_CODE: GroupCode
    }) {
        const { data } = await this.get<IGroup[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/rounds/${ROUND_CODE}/groupings/${GROUP_CODE}/groupings`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 리더보드 - 라운드별]
    async getLeaderboardEachRound({
        GAME_CODE: GAME_CODE,
        ROUND_CODE: ROUND_CODE,
    }: {
        GAME_CODE: GameCode
        ROUND_CODE: RoundCode
    }) {
        const { data } = await this.get<ILeaderboard[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/rounds/${ROUND_CODE}/leaderboard`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 라운드별 개별 플레이어 리더보드]
    async getLeaderboardEachRoundByPlayer({
        GAME_CODE: GAME_CODE,
        ROUND_CODE: ROUND_CODE,
        PLAYER_CODE: PLAYER_CODE,
    }: {
        GAME_CODE: GameCode
        ROUND_CODE: RoundCode
        PLAYER_CODE: PlayerCode
    }) {
        const { data } = await this.get<ILeaderboard[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/rounds/${ROUND_CODE}/leaderboard/players/${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 플레이어별 리더보드]
    async getLeaderboardByPlayer({
        GAME_CODE: GAME_CODE,
        PLAYER_CODE: PLAYER_CODE,
    }: {
        GAME_CODE: GameCode
        PLAYER_CODE: PlayerCode
    }) {
        const { data } = await this.get<ILeaderboard[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/leaderboard/players/${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 라운드별 홀 정보]
    async getHoleEachRound({
        GAME_CODE: GAME_CODE,
        PLAYER_CODE: PLAYER_CODE,
    }: {
        GAME_CODE: GameCode
        PLAYER_CODE: PlayerCode
    }) {
        const { data } = await this.get<IHole[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/rounds/${PLAYER_CODE}/hole`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 라운드별 플레이어 홀 정보]
    async getHoleEachRoundByPlayer({
        GAME_CODE: GAME_CODE,
        ROUND_CODE: ROUND_CODE,
        PLAYER_CODE: PLAYER_CODE,
    }: {
        GAME_CODE: GameCode
        ROUND_CODE: RoundCode
        PLAYER_CODE: PlayerCode
    }) {
        const { data } = await this.get<IHole[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/rounds/${ROUND_CODE}/players/${PLAYER_CODE}/hole`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 플레이어 홀 정보]
    async getHoleByPlayer({
        GAME_CODE: GAME_CODE,
        PLAYER_CODE: PLAYER_CODE,
    }: {
        GAME_CODE: PlayerCode
        PLAYER_CODE: PlayerCode
    }) {
        const { data } = await this.get<IHole[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/players/${PLAYER_CODE}/hole`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    // [대회 연장전]
    async getExtraInfo(GAME_CODE: number) {
        const { data } = await this.get<IHole[]>({
            url: `/api/v1/season-n/games/${GAME_CODE}/extra`,
            options: await this.genAuthConfig(),
        })

        return data
    }

    async getLikePlayer() {
        const { data } = await this.get<ILikePlayers>({
            url: "/api/v1/season/like-all",
            options: await this.genAuthConfig(),
        })

        return data
    }

    async likePlayerToggle(playerCode: number) {
        const { data } = await this.post<ILikePlayer>({
            url: "/api/v1/season/do-like",
            options: await this.genAuthConfig(),
            body: {
                PLAYER_CODE: playerCode,
            },
        })
        return data
    }
    async checkGetReward(GAME_CODE: number) {
        const { data } = await this.get<boolean>({
            url: `/api/v1/live/${GAME_CODE}/tour-reward/check`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async showReward(GAME_CODE: number) {
        const { data } = await this.get<IRewardSize>({
            url: `/api/v1/live/${GAME_CODE}/tour-reward`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async getReward(GAME_CODE: number) {
        const { data } = await this.post<IReward>(
            {
                url: `/api/v1/live/${GAME_CODE}/tour-reward`,
                options: await this.genAuthConfig(),
                body: {
                    GAME_CODE: GAME_CODE,
                },
            },
            error => ErrorUtil.tourPeriod(error)
        )
        return data
    }
    async getMyRewardedList(GAME_CODE: number) {
        const { data } = await this.get<{
            GAME_CODE: 0
            REWARDS: {
                REWARD_TYPE: REWARD_TYPE
                REWARD_DATA: any[]
            }[]
        }>({
            url: `/api/v1/profile/my/reward?GAME_CODE=${GAME_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async isCalculating(GAME_CODE: number) {
        const { data } = await this.get<IsCalculating>({
            url: `/api/v1/live/${GAME_CODE}/is-calculating`,
            options: await this.genAuthConfig(),
        })
        return data
    }
}
