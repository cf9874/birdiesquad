import { ABaseApi } from "./base.api"
import { IDataWrapperRes, IErrorResData, SignApiData } from "../data"
import store from "store"
import { setModal } from "store/reducers/config.reducer"
import { ErrorModal } from "components/Common"
import { ErrorUtil } from "utils"
import {
    IMyRankDonation,
    IMyRankList,
    IMyRankMost,
    IPlayerRankCount,
    IPlayerRankList,
    IRankAmount,
    IRankHeartAmout,
    IRankPro,
    IReward,
    ITakeReward,
    IUserCount,
    IUserRankList,
    IUsersRankMostList,
    IUsersRankingList,
    USER_RECORD,
} from "apis/data/rank.data"
import nftPlayerJson from "json/nft_player.json"
import panUsersJson from "json/users_profile.json"
import { Alert } from "react-native"
export class RankApi extends ABaseApi {
    constructor() {
        super()
    }

    async ammout(GAME_CODE: number) {
        const { data } = await this.get<IRankAmount>({
            url: `/api/v1/live/${GAME_CODE}/cheer/pool/amount`,
            options: await this.genAuthConfig(),
        })

        return data
    }

    async playerRankList(GAME_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IPlayerRankList>({
            url: `/api/v1/live/${GAME_CODE}/cheer/players/rank?RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            gameCode: data.GAME_CODE,
            type: data.RANK_TYPE,
            rankList: data.RANK_PLAYERS.map(v => ({
                playerCode: v.PLAYER_CODE,
                score: v.SCORE,
                rank: v.RANK,
                info: nftPlayerJson.find(d => d.nPersonID == v.PLAYER_CODE),
            })),
        }
    }
    async playerRankInfo(GAME_CODE: number, PLAYER_CODE: number) {
        const { data } = await this.get<IPlayerRankList>(
            {
                url: `/api/v1/live/${GAME_CODE}/cheer/players/rank-info?PLAYER_CODE=${PLAYER_CODE}`,

                options: await this.genAuthConfig(),
            },
            err => {}
        )

        return {
            gameCode: data?.GAME_CODE,
            type: data?.RANK_TYPE,
            rank: data?.RANK_PLAYERS.map(v => ({
                playerCode: v.PLAYER_CODE,
                score: v.SCORE,
                rank: v.RANK,
                info: nftPlayerJson.find(d => d.nPersonID == v.PLAYER_CODE),
            }))[0],
        }
    }
    async userRankList(GAME_CODE: number, PLAYER_CODE: number, RANK_MIN: number, RANK_MAX: number, IS_EXPECT: boolean) {
        const { data } = await this.get<IUserRankList>({
            url: `/api/v1/live/${GAME_CODE}/cheer/users/rank?PLAYER_CODE=${PLAYER_CODE}&RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}&IS_EXPECT=${IS_EXPECT}`,
            options: await this.genAuthConfig(),
        })

        return data
    }
    async myRank(GAME_CODE: number, PLAYER_CODE: number, IS_EXPECT: boolean) {
        const { data } = await this.get<IMyRankList>({
            url: `/api/v1/live/${GAME_CODE}/cheer/users/my-rank?PLAYER_CODE=${PLAYER_CODE}&IS_EXPECT=${IS_EXPECT}`,
            options: await this.genAuthConfig(),
        })

        return data
    }
    async userCount(GAME_CODE: number, PLAYER_CODE: number) {
        const { data } = await this.get<IUserCount>({
            url: `/api/v1/live/${GAME_CODE}/cheer/users/count?PLAYER_CODE=${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async rankMost(WEEK_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IUsersRankMostList>({
            url: `/api/v1/rank/${WEEK_CODE}/most/users/rank?RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            weekCode: data.WEEK_CODE,
            type: data.RANK_TYPE,
            rankMost: data.RANK_MOSTS.map(v => ({
                playerCode: v.PLAYER_CODE,
                score: v.SCORE,
                rank: v.RANK,
                info: data.USER_PROFILES.find(d => d.USER_SEQ == v.USER_SEQ),
                info_player: nftPlayerJson.find(d => d.nPersonID == v.PLAYER_CODE),
            })),
        }
    }
    async rankDonation(WEEK_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IUsersRankingList>({
            url: `/api/v1/rank/${WEEK_CODE}/cash-amount/users/rank?RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            weekCode: data.WEEK_CODE,
            type: data.RANK_TYPE,
            rankDonation: data.RANK_USERS.map(v => ({
                score: v.SCORE,
                rank: v.RANK,
                info: data.USER_PROFILES.find(d => d.USER_SEQ == v.USER_SEQ),
                // info: panUsersJson.find(d => d.USER_SEQ == v.USER_SEQ),
            })),
        }
    }
    async rankSponsor(WEEK_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IUsersRankingList>({
            url: `/api/v1/rank/${WEEK_CODE}/cash-count/users/rank?RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            weekCode: data.WEEK_CODE,
            type: data.RANK_TYPE,
            rankSponsor: data.RANK_USERS.map(v => ({
                score: v.SCORE,
                rank: v.RANK,
                totalAmount: v.CASH_AMOUNT,
                info: data.USER_PROFILES.find(d => d.USER_SEQ == v.USER_SEQ),
                // info: panUsersJson.find(d => d.USER_SEQ == v.USER_SEQ),
            })),
        }
    }
    async rankHeart(WEEK_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IUsersRankingList>({
            url: `/api/v1/rank/${WEEK_CODE}/heart-count/users/rank?RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            weekCode: data.WEEK_CODE,
            type: data.RANK_TYPE,
            rankHeart: data.RANK_USERS.map(v => ({
                score: v.SCORE,
                rank: v.RANK,
                info: data.USER_PROFILES.find(d => d.USER_SEQ == v.USER_SEQ),
                // info: panUsersJson.find(d => d.USER_SEQ == v.USER_SEQ),
            })),
        }
    }
    async rankPopularity(WEEK_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IUsersRankingList>({
            url: `/api/v1/rank/${WEEK_CODE}/up-count/users/rank?RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            weekCode: data.WEEK_CODE,
            type: data.RANK_TYPE,
            rankPopularity: data.RANK_USERS.map(v => ({
                score: v.SCORE,
                rank: v.RANK,
                info: data.USER_PROFILES.find(d => d.USER_SEQ == v.USER_SEQ),
                // info: panUsersJson.find(d => d.USER_SEQ == v.USER_SEQ),
            })),
        }
    }
    async rankPassionate(WEEK_CODE: number, PLAYER_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IMyRankList>({
            url: `/api/v1/rank/${WEEK_CODE}/cash-amount/each-player/users/rank?PLAYER_CODE=${PLAYER_CODE}&RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            listPassionate: data.RANK_USERS.map(v => ({
                player_code: data.PLAYER_CODE,
                user_seq: v.USER_SEQ,
                rank: v.RANK,
                score: v.SCORE,
                user_type: data.USER_PROFILES.find(d => d.USER_SEQ == v.USER_SEQ)?.ICON_TYPE,
                user_image: data.USER_PROFILES.find(d => d.USER_SEQ == v.USER_SEQ)?.ICON_NAME,
                // user_image: panUsersJson.find(d => d.USER_SEQ == v.USER_SEQ)?.ICON_NAME,
                user_name: data.USER_PROFILES.find(d => d.USER_SEQ == v.USER_SEQ)?.NICK,
            })),
        }
    }
    async playerRankCount(WEEK_CODE: number, PLAYER_CODE: number) {
        const { data } = await this.get<IPlayerRankCount>({
            url: `/api/v1/rank/${WEEK_CODE}/cash-amount/each-player/users/count?PLAYER_CODE=${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async playerCashAmountScore(WEEK_CODE: number, PLAYER_CODE: number) {
        const { data } = await this.get<IPlayerRankCount>({
            url: `/api/v1/rank/${WEEK_CODE}/cash-amount/players/score?PLAYER_CODE=${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async myRankMost(WEEK_CODE: number) {
        const { data } = await this.get<IMyRankMost>({
            url: `/api/v1/rank/${WEEK_CODE}/most/users/my-rank`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async myRankPassionate(WEEK_CODE: number, PLAYER_CODE: number) {
        const { data } = await this.get<IMyRankDonation>({
            url: `/api/v1/rank/${WEEK_CODE}/cash-amount/each-player/users/my-rank?PLAYER_CODE=${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    async myRankDonation(WEEK_CODE: number) {
        const { data } = await this.get<IMyRankDonation>({
            url: `/api/v1/rank/${WEEK_CODE}/cash-amount/users/my-rank`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async myRankSponsor(WEEK_CODE: number) {
        const { data } = await this.get<IMyRankDonation>({
            url: `/api/v1/rank/${WEEK_CODE}/cash-count/users/my-rank`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async myRankHeart(WEEK_CODE: number) {
        const { data } = await this.get<IMyRankDonation>({
            url: `/api/v1/rank/${WEEK_CODE}/heart-count/users/my-rank`,
            options: await this.genAuthConfig(),
        })
        return data
    }
    async myRankPopularity(WEEK_CODE: number) {
        const { data } = await this.get<IMyRankDonation>({
            url: `/api/v1/rank/${WEEK_CODE}/up-count/users/my-rank`,
            options: await this.genAuthConfig(),
        })
        return data
    }

    ///// PRO RANKING

    async rankRevenuePro(WEEK_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IRankPro>({
            url: `/api/v1/rank/${WEEK_CODE}/cash-amount/players/rank?RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            weekCode: data.WEEK_CODE,
            type: data.RANK_TYPE,
            rankPlayers: data.RANK_PLAYERS.map(v => ({
                score: v.SCORE,
                rank: v.RANK,
                totalFans: v.USER_COUNT,
                info_player: nftPlayerJson.find(d => d.nPersonID == v.PLAYER_CODE),
            })),
        }
    }

    async rankSponsorPro(WEEK_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IRankPro>({
            url: `/api/v1/rank/${WEEK_CODE}/cash-count/players/rank?RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            weekCode: data.WEEK_CODE,
            type: data.RANK_TYPE,
            rankPlayers: data.RANK_PLAYERS.map(v => ({
                score: v.SCORE,
                rank: v.RANK,
                totalCash: v.CASH_AMOUNT,
                info_player: nftPlayerJson.find(d => d.nPersonID == v.PLAYER_CODE),
            })),
        }
    }
    async rankHeartPro(WEEK_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IRankPro>({
            url: `/api/v1/rank/${WEEK_CODE}/heart-count/players/rank?RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            weekCode: data.WEEK_CODE,
            type: data.RANK_TYPE,
            rankPlayers: data.RANK_PLAYERS.map(v => ({
                score: v.SCORE,
                rank: v.RANK,
                info_player: nftPlayerJson.find(d => d.nPersonID == v.PLAYER_CODE),
            })),
        }
    }

    async rankHeartAmountPro(WEEK_CODE: number, PLAYER_CODE: number) {
        const { data } = await this.get<IRankHeartAmout>({
            url: `/api/v1/rank/${WEEK_CODE}/heart-count/players/score?PLAYER_CODE=${PLAYER_CODE}`,
            options: await this.genAuthConfig(),
        })
        return {
            weekCode: data.WEEK_CODE,
            type: data.RANK_TYPE,
            playerCode: data.PLAYER_CODE,
            score: data.RANK_SCORE,
        }
    }

    async rankPopularityPro(WEEK_CODE: number, RANK_MIN: number, RANK_MAX: number) {
        const { data } = await this.get<IRankPro>({
            url: `/api/v1/rank/${WEEK_CODE}/up-count/players/rank?RANK_MIN=${RANK_MIN}&RANK_MAX=${RANK_MAX}`,
            options: await this.genAuthConfig(),
        })
        return {
            weekCode: data.WEEK_CODE,
            type: data.RANK_TYPE,
            rankPlayers: data.RANK_PLAYERS.map(v => ({
                score: v.SCORE,
                rank: v.RANK,
                info_player: nftPlayerJson.find(d => d.nPersonID == v.PLAYER_CODE),
            })),
        }
    }

    /// REWARDS

    async checkReward(WEEK_CODE: number) {
        const { data } = await this.get({
            url: `/api/v1/rank/${WEEK_CODE}/check-reward/users/my-rank`,
            options: await this.genAuthConfig(),
        })

        return data
    }
    async rewardShow(WEEK_CODE: number) {
        const { data } = await this.get<IReward>({
            url: `/api/v1/rank/${WEEK_CODE}/view-reward/users/my-rank`,
            options: await this.genAuthConfig(),
        })
        return {
            rewardMost: data.RANK_MOST.RANK_MOSTS[0]?.RANK,
            rewardDonation: data.RANK_CASH_AMOUNT?.RANK_USERS[0]?.RANK,
            rewardSponsor: data.RANK_CASH_COUNT?.RANK_USERS[0]?.RANK,
            rewardHeart: data.RANK_HEAET_COUNT?.RANK_USERS[0]?.RANK,
            rewardPopularity: data.RANK_UP_COUNT?.RANK_USERS[0]?.RANK,
            collectPoint: data.REWARD_TRAINING,
        }
    }
    async takeReward(WEEK_CODE: number) {
        const { data } = await this.post<ITakeReward>({
            url: `/api/v1/rank/${WEEK_CODE}/take-reward/users/my-rank`,
            body: {
                WEEK_CODE: WEEK_CODE,
            },
            options: await this.genAuthConfig(),
        })
        return data
    }

    async userRecord(USER_SEQ: number) {
        const { data } = await this.get<USER_RECORD>({
            url: `/api/v1/profile/user/record?USER_SEQ=${USER_SEQ}`,
            options: await this.genAuthConfig(),
        })
        console.log("USER_RECORD::", data)

        return data
    }
}
