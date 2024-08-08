import { ABaseScv } from "./base.svc"
import { ProfileApiData } from "apis/data"
import { KakaoSignApi } from "apis/external"
import { RankApi } from "apis/context/rank.api"

class RankeSvc extends ABaseScv<RankeSvc>() {
    private readonly rankApi = new RankApi()
    playerRankList = async ({ gamecode, min, max }: { gamecode: number; min: number; max: number }) => {
        return await this.rankApi.playerRankList(gamecode, min, max)
    }
    getAmount = async (gamecode: number) => {
        return await this.rankApi.ammout(gamecode)
    }

    playerRank = async ({ gamecode, playercode }: { gamecode: number; playercode: number }) => {
        return await this.rankApi.playerRankInfo(gamecode, playercode)
    }
    userRankList = async ({
        gamecode,
        playercode,
        min,
        max,
        isExpect,
    }: {
        gamecode: number
        playercode: number
        min: number
        max: number
        isExpect?: boolean
    }) => {
        return await this.rankApi.userRankList(gamecode, playercode, min, max, (isExpect = true))
    }
    myRank = async ({
        gamecode,
        playercode,
        isExpect,
    }: {
        gamecode: number
        playercode: number
        isExpect?: boolean
    }) => {
        return await this.rankApi.myRank(gamecode, playercode, (isExpect = true))
    }
    userCount = async ({ gamecode, playercode }: { gamecode: number; playercode: number }) => {
        return await this.rankApi.userCount(gamecode, playercode)
    }
    rankMost = async ({ weekcode, min, max }: { weekcode: number; min: number; max: number }) => {
        return await this.rankApi.rankMost(weekcode, min, max)
    }
    rankDonation = async ({ weekcode, min, max }: { weekcode: number; min: number; max: number }) => {
        return await this.rankApi.rankDonation(weekcode, min, max)
    }
    rankSponsor = async ({ weekcode, min, max }: { weekcode: number; min: number; max: number }) => {
        return await this.rankApi.rankSponsor(weekcode, min, max)
    }
    rankHeart = async ({ weekcode, min, max }: { weekcode: number; min: number; max: number }) => {
        return await this.rankApi.rankHeart(weekcode, min, max)
    }
    rankPopularity = async ({ weekcode, min, max }: { weekcode: number; min: number; max: number }) => {
        return await this.rankApi.rankPopularity(weekcode, min, max)
    }
    rankPassionate = async ({
        weekcode,
        playercode,
        min,
        max,
    }: {
        weekcode: number
        playercode: number
        min: number
        max: number
    }) => {
        return await this.rankApi.rankPassionate(weekcode, playercode, min, max)
    }

    myRankMost = async ({ weekcode }: { weekcode: number }) => {
        return await this.rankApi.myRankMost(weekcode)
    }
    myRankDonation = async ({ weekcode }: { weekcode: number }) => {
        return await this.rankApi.myRankDonation(weekcode)
    }
    myRankPassionate = async ({ weekcode, player_code }: { weekcode: number; player_code: number }) => {
        return await this.rankApi.myRankPassionate(weekcode, player_code)
    }
    myPlayerRankCount = async ({ weekcode, player_code }: { weekcode: number; player_code: number }) => {
        return await this.rankApi.playerRankCount(weekcode, player_code)
    }
    myPlayerCashAmountScore = async ({ weekcode, player_code }: { weekcode: number; player_code: number }) => {
        return await this.rankApi.playerCashAmountScore(weekcode, player_code)
    }
    myRankSponsor = async ({ weekcode }: { weekcode: number }) => {
        return await this.rankApi.myRankSponsor(weekcode)
    }
    myRankHeart = async ({ weekcode }: { weekcode: number }) => {
        return await this.rankApi.myRankHeart(weekcode)
    }
    myRankPopularity = async ({ weekcode }: { weekcode: number }) => {
        return await this.rankApi.myRankPopularity(weekcode)
    }

    //// PRO RANKING

    rankRevenuePro = async ({ weekcode, min, max }: { weekcode: number; min: number; max: number }) => {
        return await this.rankApi.rankRevenuePro(weekcode, min, max)
    }
    rankSponsorPro = async ({ weekcode, min, max }: { weekcode: number; min: number; max: number }) => {
        return await this.rankApi.rankSponsorPro(weekcode, min, max)
    }
    rankHeartPro = async ({ weekcode, min, max }: { weekcode: number; min: number; max: number }) => {
        return await this.rankApi.rankHeartPro(weekcode, min, max)
    }
    rankHeartAmount = async ({ weekcode, playercode }: { weekcode: number; playercode: number }) => {
        return await this.rankApi.rankHeartAmountPro(weekcode, playercode)
    }
    rankPopularityPro = async ({ weekcode, min, max }: { weekcode: number; min: number; max: number }) => {
        return await this.rankApi.rankPopularityPro(weekcode, min, max)
    }

    ///REWARDS
    checkReward = async ({ weekcode }: { weekcode: number }) => {
        return await this.rankApi.checkReward(weekcode)
    }
    rewardShow = async ({ weekcode }: { weekcode: number }) => {
        return await this.rankApi.rewardShow(weekcode)
    }
    takeReward = async ({ weekcode }: { weekcode: number }) => {
        return await this.rankApi.takeReward(weekcode)
    }

    userRecord = async ({ userseq }: { userseq: number }) => {
        return await this.rankApi.userRecord(userseq)
    }
}

export const rankSvc = RankeSvc.instance
