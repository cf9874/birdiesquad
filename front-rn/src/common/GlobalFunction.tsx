import { TOKEN_ID } from "utils/env"
import { jsonSvc, rewardSvc } from "apis/services"
import store from "store"
import { setGetGameData, setShowGameModal } from "store/reducers/getGame.reducer"
import energyPenaltyJson from "json/penalty_energy.json"
import penaltyJson from "json/penalty_season.json"
import { liveSvc } from "apis/services/live.svc"
export const callSetGameApi = async (showModal: boolean) => {
    const seasonkey = await liveSvc.getSetSeason()
    const gameList = await liveSvc.getGameList(seasonkey)

    const today = new Date(new Date().getTime() + 9 * 60 * 60 * 1000)
    const startOfWeek = getWeekStartTime(today)
    const endOfWeek = getWeekEndTime(startOfWeek)

    const startOfNextDay = new Date(getNextDayStartTime(startOfWeek).getTime() + 9 * 60 * 60 * 1000)
    const tenMinutesAfterMidnight = new Date(getCalculatingTime(startOfNextDay).getTime() + 9 * 60 * 60 * 1000)

    const filteredArray = gameList.filter(item => isInCurrentWeek(item.startDate, startOfWeek, endOfWeek))
    if (filteredArray.length > 0) {
        store.dispatch(setGetGameData(filteredArray))
    }

    const isInRange = today >= startOfNextDay && today <= tenMinutesAfterMidnight
    if (showModal) store.dispatch(setShowGameModal(isInRange))
    return isInRange
}

export const isPossibleRewardDateCheck = (gameEndDate: Date) => {
    const gameEndDateInKST = new Date(new Date(gameEndDate).getTime() + 9 * 60 * 60 * 1000)

    const daysTillNextMonday = (8 - gameEndDateInKST.getDay()) % 7
    const nextMonday = new Date(gameEndDateInKST)
    nextMonday.setDate(nextMonday.getDate() + daysTillNextMonday)
    nextMonday.setHours(0, 10, 0, 0)
    const nextWednesday = new Date(nextMonday)
    nextWednesday.setDate(nextMonday.getDate() + 2)
    nextWednesday.setHours(23, 59, 59, 999)

    const currentDateInKST = new Date(Date.now() + 9 * 60 * 60 * 1000)

    return (
        new Date(nextMonday.getTime() + 9 * 60 * 60 * 1000) <= currentDateInKST &&
        currentDateInKST <= new Date(nextWednesday.getTime() + 9 * 60 * 60 * 1000)
    )
}

const getWeekStartTime = (date: Date) => {
    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)
    const diff = koreaDate.getDay()
    return new Date(koreaDate.getFullYear(), koreaDate.getMonth(), koreaDate.getDate() - diff, 0, 0, 0)
}

const getWeekEndTime = (date: Date) => {
    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)
    return new Date(koreaDate.getFullYear(), koreaDate.getMonth(), koreaDate.getDate() + 6, 23, 59, 59)
}

const getNextDayStartTime = (date: Date) => {
    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)
    // return new Date(koreaDate.getFullYear(), koreaDate.getMonth(), koreaDate.getDate() + 1, 0, 0, 0)
    return new Date(koreaDate.getFullYear(), koreaDate.getMonth(), koreaDate.getDate(), 23, 59, 59)
}

const getCalculatingTime = (date: Date) => {
    const koreaDate = new Date(date.getTime())
    return new Date(koreaDate.getFullYear(), koreaDate.getMonth(), koreaDate.getDate(), 0, 10, 0)
}
//[이후 정산시간  변경시 아래 주석해제하여 시간 설정]
// const getNextDayStartTime = (date: Date) => {
//     const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000)
//     return new Date(koreaDate.getFullYear(), koreaDate.getMonth(), koreaDate.getDate() + 5, 10, 0, 0)
// }

// const getCalculatingTime = (date: Date) => {
//     const koreaDate = new Date(date.getTime())
//     return new Date(koreaDate.getFullYear(), koreaDate.getMonth(), koreaDate.getDate(), 10, 30, 0)
// }
const isInCurrentWeek = (dateStr: string, startOfWeek: Date, endOfWeek: Date) => {
    const year = parseInt(dateStr.substring(0, 4))
    const month = parseInt(dateStr.substring(4, 6)) - 1
    const day = parseInt(dateStr.substring(6, 8))
    const date = new Date(year, month, day)
    return date >= startOfWeek && date <= endOfWeek
}

export const scoreCardType = (holeScore: number | string, holePar: number | string) => {
    if (holeScore == holePar) {
        return "Par"
    } else if (parseInt(holeScore.toString()) == parseInt(holePar.toString()) - 1) {
        return "Birdies"
    } else if (parseInt(holeScore.toString()) == parseInt(holePar.toString()) + 1) {
        return "Bogeys"
    } else if (parseInt(holeScore.toString()) >= parseInt(holePar.toString()) + 2) {
        return "Double Bogeys+"
    } else if (parseInt(holeScore.toString()) <= parseInt(holePar.toString()) - 2) {
        return "Engles+"
    }
}

export const getPerformanceAttributes = (name?: string) => {
    if (name === "Engles+") {
        return "EAGLE"
    } else if (name === "Birdies") {
        return "BIRDIE"
    } else if (name === "Par") {
        return "PAR"
    } else if (name === "Bogeys") {
        return "BOGEY"
    } else if (name === "Double Bogeys+") {
        return "DOUBLE_BOGEY"
    } else {
        return null
    }
}

export const getContinueRewards = (value: number) => {
    // const result = jsonSvc.findRewardById(value + 2).nAdditionalBonusReward

    return jsonSvc.findRewardById(value === 0 ? 1 : value).nAdditionalBonusReward
}

export const getEnergyPenalty = (value: number) => {
    const result = energyPenaltyJson.find(e => value >= e.nEnergyMin && value <= e.nEnergyMax)?.nEnergyPenalty ?? 0
    return result
}

export const getPenalty = (grade: number, currentSeason: number, nftSeason: number) => {
    const seasonGap = currentSeason - nftSeason <= 0 ? 0 : currentSeason - nftSeason

    return penaltyJson.find(item => item.nGrade == grade && item.nSeasonGap == seasonGap)?.nSeasonPenalty ?? 0
}
// export const getPenaltyIssue = (value: number) => {
//     const rewardArray = [0, 0.5, 1, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
//     return rewardArray[value]
// }
