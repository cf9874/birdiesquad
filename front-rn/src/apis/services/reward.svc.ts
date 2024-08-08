import { TourRewardsApi } from "apis/context/reward.api"
import { ABaseScv } from "./base.svc"
import { jsonSvc } from "./json.svc"
import { GameApi, NftApi } from "apis/context"
import dayjs from "dayjs"
import {
    IBdstPlayer,
    ICourse,
    IHole,
    ILeaderboard,
    IParticipants,
    IParticipantsWithGradeAndExtraData,
    ISeasonDetail,
    counterScore,
} from "apis/data/season.data"
import { callSetGameApi, getContinueRewards, getEnergyPenalty, getPenalty } from "common/GlobalFunction"
import { ArrayUtil, GameUtil, NumberUtil } from "utils"
import { NftApiData } from "apis/data/nft.api.data"
import { ICounterScore, IScore } from "apis/data/reward.data"
import { liveSvc } from "./live.svc"
import { GameStatus, Grade, NftFilterType } from "const"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import utc from "dayjs/plugin/utc"
import weekOfYear from "dayjs/plugin/weekOfYear"
dayjs.extend(isSameOrBefore)
dayjs.extend(utc)
dayjs.extend(weekOfYear)

class RewardSvc extends ABaseScv<RewardSvc>() {
    private readonly tourRewardsApi = new TourRewardsApi()
    private readonly gameApi = new GameApi()
    private readonly nftApi = new NftApi()
    private readonly BALANCE = jsonSvc.findConstBynId("REWARD_FORMULA_VARIABLE").dDoubleValue
    private readonly FEE = 1 + jsonSvc.findConstBynId("TOUR_REWARD_CHARGE").dDoubleValue

    private readonly RAREBONUS = jsonSvc.findConstBynId("NFT_RARE_GRADE_REWARD_BONUS").nIntValue
    private readonly SUPERRAREBOUNS = jsonSvc.findConstBynId("NFT_SUPERRARE_GRADE_REWARD_BONUS").nIntValue
    private readonly EFICBOUNS = jsonSvc.findConstBynId("NFT_EPIC_GRADE_REWARD_BONUS").nIntValue
    private readonly LEGENDBOUNS = jsonSvc.findConstBynId("NFT_LEGENDARY_GRADE_REWARD_BONUS").nIntValue

    checkEndFlag = async (gameData: ISeasonDetail) => {
        let isEndGame = gameData.gameStatus === GameStatus.END
        console.log("========> gameData ", gameData)
        const calculatingData = await liveSvc.getIsCalculating(gameData.GAME_CODE)
        console.log("========> isSettle ", calculatingData.isCalculating)
        const isSettle = calculatingData.isCalculating
        // const endDate = dayjs.utc(gameData.endDate,"YYYY-MM-DD")

        // const daysUntilNextMonday = (7 - endDate.day() + 1) % 7

        // let nextMonday = endDate.add(daysUntilNextMonday, "day").hour(0).minute(10).second(0)

        if (isSettle) {
            isEndGame = false
        }

        return isEndGame
    }

    getRewardTargetData = async (gameData: ISeasonDetail) => {
        try {
            const isEndGame = await this.checkEndFlag(gameData)

            const [joinPlayers, myNfts] = await Promise.all([
                this.gameApi.getAllParticipants(gameData.GAME_CODE),
                isEndGame
                    ? this.nftApi.getSnapNftList(gameData.GAME_CODE)
                    : this.nftApi.getMySquadNftList({
                          order: "ASC",
                          take: 0,
                          page: 1,
                          filterType: NftFilterType.SQUAD,
                      }),
            ])

            const filteredMyNfts = isEndGame
                ? myNfts.data
                : myNfts.data.filter(nft => dayjs(nft.regDate).isBefore(dayjs(gameData.END_AT)))

            const maxRewardCount = this.getbonusRewardsCount(filteredMyNfts)

            // const myPlayersPromises = joinPlayers.reduce((promises, joinPlayer) => {
            //     const foundNft = filteredMyNfts.find(myNft => myNft.playerCode === joinPlayer.PLAYER_CODE)

            //     if (foundNft) {
            //         promises.push(this.getMatchPlayer(joinPlayer, foundNft, gameData))
            //     }

            //     return promises
            // }, [] as Promise<IParticipantsWithGradeAndExtraData>[])

            const myPlayersPromises = joinPlayers.flatMap(joinPlayer => {
                const foundNfts = filteredMyNfts.filter(myNft => myNft.playerCode === joinPlayer.PLAYER_CODE)

                if (foundNfts.length > 0) {
                    return foundNfts.map(foundNft => this.getMatchPlayer(joinPlayer, foundNft, gameData))
                }

                return []
            })

            const players = await Promise.all(myPlayersPromises)

            return { players, maxRewardCount, myNftLength: filteredMyNfts.length }
        } catch (error) {
            return { players: [], maxRewardCount: 0, myNftLength: 0 }
        }
    }

    private getbonusRewardsCount = (myNft: NftApiData.NftList.ResDto["data"]) => {
        if (myNft.length <= 0) return 0

        const rewardJsonData = jsonSvc.findRewardAmountByLenght(myNft.length)

        const gradebonusCount = myNft.reduce((count, { grade }) => {
            switch (grade) {
                case Grade.RARE:
                    return count + this.RAREBONUS
                case Grade.SUPERRARE:
                    return count + this.SUPERRAREBOUNS
                case Grade.EPIC:
                    return count + this.EFICBOUNS
                case Grade.LEGENDARY:
                    return count + this.LEGENDBOUNS
                default:
                    return count
            }
        }, 0)

        // 기본정산 수량 + 등급 보상
        return rewardJsonData.nRewardNftAmount + gradebonusCount
    }

    private getMatchPlayer = async (
        joinPlayer: IParticipants,
        nft: NftApiData.NftList.ResDto["data"][number],
        gameData: ISeasonDetail
    ) => {
        const [leaderboard, holes] = await Promise.all([
            liveSvc.getLeaderboardByPlayer(gameData, gameData.GAME_CODE, joinPlayer.PLAYER_CODE),
            this.gameApi.getHoleByPlayer({
                GAME_CODE: gameData.GAME_CODE,
                PLAYER_CODE: joinPlayer.PLAYER_CODE,
            }),
        ])

        return {
            ...joinPlayer,
            nftSeq: nft.seq,
            grade: nft.grade,
            leaderboard: ArrayUtil.toUniq(leaderboard, (a, b) => a.ROUND_CODE === b.ROUND_CODE),
            holes: ArrayUtil.toUniq(holes, (a, b) => a.ROUND_CODE === b.ROUND_CODE),
            energy: nft.energy,
            season: nft.season,
            maxReward: nft.amount,
            golf: {
                PAR: nft.golf.par,
                EAGLE: nft.golf.eagle,
                DOUBLE_BOGEY: nft.golf.doubleBogey,
                BIRDIE: nft.golf.birdie,
                BOGEY: nft.golf.bogey,
            },
        }
    }

    calcBdstForPlayer = (player: IParticipantsWithGradeAndExtraData, item: ICounterScore, seasonCode: number) => {
        const NFTGradeAttribute = player.golf[item.name]

        if (
            player.energy === undefined ||
            player.grade === undefined ||
            player.season === undefined ||
            item.holeScore === null
        ) {
            return 0
        }

        const BDST =
            (NFTGradeAttribute *
                (1 + getContinueRewards(item.count)) *
                // (1 + getEnergyPenalty(player.energy)) *
                (1 + getPenalty(player.grade, seasonCode, player.season))) /
            this.BALANCE
        //     *
        // this.FEE

        if (isNaN(BDST)) return 0

        // if (BDST >= player.maxReward) return player.maxReward

        return parseFloat(BDST.toFixed(1))
    }

    calcBdstForPlayerCourse = (
        player: IParticipantsWithGradeAndExtraData,
        items: ICounterScore[],
        seasonCode: number
    ) => {
        return NumberUtil.sum(
            items.map(item => {
                return this.calcBdstForPlayer(player, item, seasonCode)
            })
        )
    }

    getTotalBdstForPlayer = (
        player: IParticipantsWithGradeAndExtraData,
        countScores: ICounterScore[],
        seasonCode: number
    ) => {
        const totalBdst = countScores.reduce((total, item) => {
            const bdst = this.calcBdstForPlayer(player, item, seasonCode)

            return total + bdst
        }, 0)

        return totalBdst
    }

    mapCoursesToScores = (courses: ICourse[], holes: IHole, leaderboard: ILeaderboard) => {
        return courses.map(course => {
            const { hole } = course

            const par = parseInt(course.par)

            const holeScore = parseInt(holes[`hole${hole}` as keyof typeof holes].toString())

            const storke = holeScore ? holeScore : par + 3

            const count = storke - par

            let name = ""

            if (count < -1) {
                name = "EAGLE"
            } else if (count == -1) {
                name = "BIRDIE"
            } else if (count == 0) {
                name = "PAR"
            } else if (count == 1) {
                name = "BOGEY"
            } else {
                name = "DOUBLE_BOGEY"
            }

            return {
                course,
                holeScore: holeScore ? holeScore : null,
                score: leaderboard.roundScore,
                par,
                name: name,
                count,
            } as IScore
        })
    }

    getCountScores = (scores: Array<IScore>): ICounterScore[] => {
        let consecutive = false // 연속성 플래그
        let c = 0 // 카운트

        return scores.map(cur => {
            if (cur.count <= -1) {
                // 현재 count 값이 -1 이하일 때
                if (consecutive) {
                    // 이전 count도 -1 이하였다면
                    c++ // c 증가
                } else {
                    c = 1 // 연속이 아니었다면 c를 1로 초기화
                    consecutive = true // 연속성 플래그를 true로 설정
                }
            } else {
                // 현재 count가 0 이상일 때
                c = 0 // 카운트를 0으로 초기화
                consecutive = false // 연속성 플래그를 false로 설정
            }

            return { ...cur, count: c } // 현재 IScore 객체에 c를 추가하여 반환
        })
    }

    getTotalBdstForPlayerList = async (gameData: ISeasonDetail) => {
        try {
            const { data } = GameUtil.checkRound(gameData)
            const { current, prev, isEnd } = data.round
            const round = isEnd ? prev : current

            if (!round) return "0"

            const [rewardTargetData, seasonCode, gameCompetition] = await Promise.all([
                this.getRewardTargetData(gameData),
                this.gameApi.getCurrentSeason(),
                this.gameApi.getCompetitionDetail(gameData.GAME_CODE),
            ])

            // const totalBdstByPlayers = rewardTargetData.players.reduce((total, player) => {
            //     const roundBdst = Array.from({ length: round }, (_, i) => i + 1).reduce((roundTotal, roundSeq) => {
            //         const hole = player.holes.find(hole => hole.roundSeq === roundSeq)
            //         const leaderboard = player.leaderboard.find(lb => lb.roundSeq === roundSeq)

            //         if (!hole || !leaderboard || !player.energy) {
            //             return roundTotal
            //         }

            //         const newArray = this.mapCoursesToScores(gameCompetition.COURSES, hole, leaderboard)

            //         const countScores = this.getCountScores(newArray)

            //         return (
            //             roundTotal +
            //             this.getTotalBdstForPlayer(player, countScores, seasonCode) *
            //                 (1 + getEnergyPenalty(player.energy))
            //         )
            //     }, 0)

            //     return total + roundBdst
            // }, 0)

            const bdstPlayers = rewardTargetData.players.map(player => {
                const roundBdst = Array.from({ length: round }, (_, i) => i + 1).reduce((roundTotal, roundSeq) => {
                    const hole = player.holes.find(hole => hole.roundSeq === roundSeq)
                    const leaderboard = player.leaderboard.find(lb => lb.roundSeq === roundSeq)

                    if (!hole || !leaderboard || !player.energy) {
                        return roundTotal
                    }

                    const newArray = this.mapCoursesToScores(gameCompetition.COURSES, hole, leaderboard)

                    const countScores = this.getCountScores(newArray)

                    const bdst = this.getTotalBdstForPlayer(player, countScores, seasonCode)

                    return roundTotal + bdst * (1 + getEnergyPenalty(player.energy))
                }, 0)

                return {
                    totalBDST:
                        roundBdst <= 0
                            ? "0"
                            : roundBdst >= player.maxReward
                            ? `${player.maxReward}`
                            : `${parseFloat(roundBdst.toFixed(1))}`,
                }
            }, [])

            // const sortedPlayers = bdstPlayers.sort((a, b) => Number(b.totalBDST) - Number(a.totalBDST))

            // const limitedBdstPlayers = sortedPlayers.slice(0, rewardTargetData.maxRewardCount)

            // const totalBdst = bdstPlayers.reduce((total, player) => {
            //     return total + Number(player.totalBDST)
            // }, 0)

            // return (totalBdst * this.FEE).toFixed(1)

            return this.getSumBdst(bdstPlayers)
        } catch {
            return "0"
        }
    }

    getSumBdst = (
        bdstPlayers: {
            totalBDST: string
        }[]
    ) => {
        const totalBdst = bdstPlayers.reduce((total, player) => {
            return total + Number(player.totalBDST)
        }, 0)

        //hazel - 소수점이 있는 totalReward만 소수점 한자리 수까지 출력
        const totalReward = totalBdst * this.FEE
        const totalRewardCalculate = Math.floor(totalReward * 10) / 10

        return totalRewardCalculate

        // return (totalBdst * this.FEE).toFixed(1)
    }

    getTotalBdstForPlayerNow = async (
        gameData: ISeasonDetail
    ): Promise<{
        bdstPlayers: IBdstPlayer[] | []
        myNftLength: number
        expectPlayer: IBdstPlayer[] | []
    }> => {
        try {
            const { data } = GameUtil.checkRound(gameData)
            const { current, prev, isEnd } = data.round
            const round = isEnd ? prev : current
            if (!round) return { bdstPlayers: [], expectPlayer: [], myNftLength: 0 }

            const [rewardTarget, seasonCode, gameCompetition] = await Promise.all([
                this.getRewardTargetData(gameData),
                this.gameApi.getCurrentSeason(),
                this.gameApi.getCompetitionDetail(gameData.GAME_CODE),
            ])

            const bdstPlayers = rewardTarget.players.map(player => {
                const roundBdst = Array.from({ length: round }, (_, i) => i + 1).reduce((roundTotal, roundSeq) => {
                    const hole = player.holes.find(hole => hole.roundSeq === roundSeq)
                    const leaderboard = player.leaderboard.find(lb => lb.roundSeq === roundSeq)

                    if (!hole || !leaderboard) {
                        return roundTotal
                    }

                    const newArray = this.mapCoursesToScores(gameCompetition.COURSES, hole, leaderboard)

                    const countScores = this.getCountScores(newArray)

                    const bdst = this.getTotalBdstForPlayer(player, countScores, seasonCode)
                    //return roundTotal + this.getTotalBdstForPlayer(player, countScores, seasonCode)
                    return roundTotal + bdst * (1 + getEnergyPenalty(player.energy))
                }, 0)

                return {
                    ...player,
                    totalBDST:
                        roundBdst <= 0
                            ? "0"
                            : roundBdst >= player.maxReward
                            ? `${player.maxReward}`
                            : `${parseFloat(roundBdst.toFixed(1))}`,
                    // totalBDST: roundBdst,
                    gameCourse: gameCompetition,
                    currentSeason: seasonCode,
                }
            }, [])

            const sortedPlayers = bdstPlayers.sort((a, b) => Number(b.totalBDST) - Number(a.totalBDST))

            // const limitedBdstPlayers = sortedPlayers.slice(0, rewardTarget.maxRewardCount)
            // const expectPlayer = sortedPlayers.slice(rewardTarget.maxRewardCount)

            // The list of players after calculating the total BDST for each player is as follows:
            return { bdstPlayers: sortedPlayers, expectPlayer: [], myNftLength: rewardTarget.myNftLength }
        } catch {
            return { bdstPlayers: [], expectPlayer: [], myNftLength: 0 }
        }
    }

    showExpectedWeward = async () => {}
    getSeasonKey = async () => {
        return await this.tourRewardsApi.getSeasonKey()
    }

    postTourRewardApi = async ({ gameId }: { gameId: number }) => {
        return await this.tourRewardsApi.postTourRewardApi(gameId)
    }

    getGamesApi = async ({ gameId }: { gameId: number }) => {
        return await this.tourRewardsApi.getGamesApi(gameId)
    }

    getTourRewardCheckApi = async ({ gameId }: { gameId: number }) => {
        return await this.tourRewardsApi.getTourRewardCheckApi(gameId)
    }

    getTourRewardApi = async ({ gameId }: { gameId: number }) => {
        return await this.tourRewardsApi.getTourRewardApi(gameId)
    }
}
export const rewardSvc = RewardSvc.instance
