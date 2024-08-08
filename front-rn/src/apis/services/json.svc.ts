import { ABaseScv } from "./base.svc"

import { Grade, SHOP_CATEGORY, ITEM_TYPE } from "const"

import NFTUPGRADE from "json/nft_upgrade.json"
import constJson from "json/const.json"
import shopJson from "json/shop.json"
import tourImageJson from "json/tour_image.json"
import itemJson from "json/item.json"
import localJson from "json/local.json"
import rewardBirdieJson from "json/reward_birdie.json"
import energyPenaltyJson from "json/penalty_energy.json"
import rewardNftAmountJson from "json/reward_nftAmount.json"
import nftGradeJson from "json/nft_grade.json"
import rankRewardJson from "json/rank_reward.json"
import { homeImg } from "assets/images"
import dailyJson from "json/daily_luckydraw.json"

class JsonSvc extends ABaseScv<JsonSvc>() {
    findItemByCondition = <T>(array: T[], condition: (item: T) => boolean) => {
        const foundItem = array.find(condition)

        if (!foundItem) {
            throw new Error("Item not found.")
        }

        return foundItem
    }

    filterItemsByCondition = <T>(array: T[], condition: (item: T) => boolean) => {
        const filteredItems = array.filter(condition)

        if (filteredItems.length === 0) {
            throw new Error("Items not found.")
        }

        return filteredItems
    }

    findUpgradeByLevelAndGrade = (level: number, grade: number) => {
        try {
            const data = this.findItemByCondition(NFTUPGRADE, v => v.nLevel === level && v.nGrade === grade)
            return data
        } catch (error) {
            throw new Error(`NFTUPGRADE data not found`)
        }
    }

    findUpGradeById = (id: number) => {
        try {
            const data = this.findItemByCondition(NFTUPGRADE, v => v.nID === id)
            return data
        } catch (error) {
            throw new Error(`NFTUPGRADE data not found`)
        }
    }

    findConstById = (id: number) => {
        try {
            const data = this.findItemByCondition(constJson, e => e.nnID === id)

            return {
                ...data,
                bBoolValue: Boolean(data.bBoolValue),
            }
        } catch (error) {
            throw new Error(`CONST data not found`)
        }
    }

    findConstBynId = (id: string) => {
        try {
            const data = this.findItemByCondition(constJson, e => e.nID === id)

            return {
                ...data,
                bBoolValue: Boolean(data.bBoolValue),
            }
        } catch (error) {
            throw new Error(`CONST data not found`)
        }
    }

    findShopById = (id: number) => {
        try {
            const data = this.findItemByCondition(shopJson, e => e.nID === id)
            return data
        } catch (error) {
            throw new Error(`SHOP data not found`)
        }
    }
    findShopByCategory = (category: SHOP_CATEGORY) => {
        try {
            const data = this.filterItemsByCondition(shopJson, e => e.nCategory === category)

            return data
        } catch (error) {
            throw new Error(`SHOP Category data not found`)
        }
    }
    findShopByCost = (cash: number) => {
        try {
            const data = this.filterItemsByCondition(shopJson, e => e.nCategory === SHOP_CATEGORY.DONATE)
            const shop = this.findItemByCondition(data, e => e.dCostValue === cash)

            return shop
        } catch (error) {
            throw new Error(`SHOP Category data not found`)
        }
    }

    mapShopDonateCash = () => {
        try {
            const data = this.filterItemsByCondition(shopJson, e => e.nCategory === SHOP_CATEGORY.DONATE)

            return data.map(v => v.dCostValue).sort((a, b) => a - b)
        } catch (error) {
            throw new Error(`SHOP Category data not found`)
        }
    }

    getSlideImage = (index: number, isLive: boolean) => {
        try {
            const minIndex = isLive ? 6 : 5
            const result = index - minIndex + 1

            const imageObject = this.findItemByCondition(tourImageJson, e => e.nID === (result % 20) + 1)

            return imageObject.sTourImagePath
        } catch (error) {
            throw new Error(`tourImageJson image not found`)
        }
    }
    getSlideImageByGameCode = (gameCode: number) => {
        try {
            const data = this.findItemByCondition(tourImageJson, e => e.nGameCode === gameCode).sTourImagePath
            return data
        } catch (error) {
            return homeImg.sample
            throw new Error(`Item data not found`)
        }
    }

    formatLocal = (format: string, replacements: string[]) => {
        try {
            return format.replace(/{(\d+)}/g, (match, index) => replacements[index] ?? match)
        } catch (error) {
            throw new Error(`fail local format`)
        }
    }

    findLocalById = (key: keyof typeof localJson) => {
        try {
            return (localJson[key]?.sStringKor as string) ?? ""
        } catch (error) {
            throw new Error(`Local Item not found`)
        }
    }
    findItemById = (id: number) => {
        try {
            const data = this.findItemByCondition(itemJson, e => e.nID === id)
            return data
        } catch (error) {
            throw new Error(`Item data not found`)
        }
    }
    filterItemByType = (id: number, nType: ITEM_TYPE[]) => {
        try {
            const data = this.findItemByCondition(itemJson, e => e.nID === id)
            if (nType.includes(data.nType)) return null
            return data
        } catch (error) {
            throw new Error(`Item data not found`)
        }
    }
    findRewardById = (id: number) => {
        try {
            const data = this.findItemByCondition(rewardBirdieJson, e => e.nID === id)
            return data
        } catch (error) {
            throw new Error(`REWARD data not found`)
        }
    }
    findEnergyPenaltyById = (id: number) => {
        try {
            const data = this.findItemByCondition(energyPenaltyJson, e => e.nID === id)
            return data
        } catch (error) {
            throw new Error(`ENERGY data not found`)
        }
    }
    findRewardAmountByLenght = (length: number) => {
        try {
            const data = this.findItemByCondition(
                rewardNftAmountJson,
                e => e.nNftMinAmount <= length && e.nNftMaxAmount >= length
            )
            return data
        } catch (error) {
            throw new Error(`reward nft amount data not found`)
        }
    }
    findGradeById = (grade: Grade) => {
        try {
            const data = this.findItemByCondition(nftGradeJson, e => e.nID === grade)
            return data
        } catch (error) {
            throw new Error(`ENERGY data not found`)
        }
    }
    findRankRewardByRankType = (rankType: number) => {
        try {
            const data = rankRewardJson.filter(e => e.nRankType === rankType)
            return data
        } catch (error) {
            throw new Error(`rank reward data not found`)
        }
    }
    findItemPropablityByType = (itemType: ITEM_TYPE) => {
        try {
            const data = this.findItemByCondition(itemJson, e => e.nType === itemType).listNFTGradeProb
            return data
        } catch (error) {
            throw new Error(`ITEM DATA data not found`)
        }
    }

    findCountById(nID: number) {
        for (let i = 0; i < dailyJson.length; i++) {
            if (dailyJson[i].nID === nID) {
                return i + 1
            }
        }
        return -1
    }
}

export const jsonSvc = JsonSvc.instance
