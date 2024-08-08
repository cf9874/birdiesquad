import { ItemApi } from "apis/context/item.api"
import { NftApi } from "apis/context"
import { ABaseScv } from "./base.svc"
import { NftApiData, PageMeta } from "apis/data"
import { Grade, NftFilterKey, nftFilterMenu, NftSortKey, nftSortMenu } from "const"
import dayjs, { Dayjs } from "dayjs"
import { PlayerCode } from "apis/data/season.data"
import nftPlayer from "json/nft_player.json"
import nftGrade from "json/nft_grade.json"

class NftSvc extends ABaseScv<NftSvc>() {
    private readonly nftApi = new NftApi()
    private readonly ItemApi = new ItemApi()

    getMyNftList = async (dto: PageMeta.ReqDto) => {
        return await this.nftApi.getMyNftList(dto)
    }
    getMyNftListSpending = async (dto: PageMeta.ReqDto) => {
        return await this.nftApi.getMyNftListSpending(dto)
    }

    getSnapNftList = async (gameId: number) => {
        const data = await this.nftApi.getSnapNftList(gameId)

        return data
    }

    getUserNftList = async (dto: NftApiData.NftList.ReqDto) => {
        return await this.nftApi.getUserNftList(dto)
    }

    listSort = (key: NftSortKey, data: NftApiData.NftList.ResDto["data"]) => {
        switch (key) {
            case 1:
                // const Day = 86400000
                // const In24Hours = (a: dayjs.Dayjs, b: dayjs.Dayjs) => {
                //     const isDiff = Math.abs(a.diff(b)) < Day
                //     return isDiff
                // }

                // return data.data.sort((a, b) => {
                //     if (In24Hours(b.regDate, a.regDate)) {
                //         return (
                //             b.grade - a.grade ||
                //             b.level - a.level ||
                //             b.golf.birdie - a.golf.birdie ||
                //             (a.energy ?? 0) - (b.energy ?? 0)
                //         )
                //     } else {
                //         return b.regDate.unix() - a.regDate.unix()
                //     }
                // })
                return data.sort((a, b) => {
                    return (
                        b.regDate.unix() - a.regDate.unix() ||
                        b.grade - a.grade ||
                        b.level - a.level ||
                        b.golf.birdie - a.golf.birdie ||
                        (a.energy ?? 0) - (b.energy ?? 0)
                    )
                })

            case 2:
                return data.sort(
                    (a, b) =>
                        b.grade - a.grade ||
                        b.level - a.level ||
                        b.golf.birdie - a.golf.birdie ||
                        (a.energy ?? 0) - (b.energy ?? 0) ||
                        b.regDate.unix() - a.regDate.unix()
                )

            case 3:
                return data.sort(
                    (a, b) =>
                        b.level - a.level ||
                        b.grade - a.grade ||
                        b.golf.birdie - a.golf.birdie ||
                        (a.energy ?? 0) - (b.energy ?? 0) ||
                        b.regDate.unix() - a.regDate.unix()
                )

            case 4:
                return data.sort(
                    (a, b) =>
                        b.golf.birdie - a.golf.birdie ||
                        b.grade - a.grade ||
                        b.level - a.level ||
                        (a.energy ?? 0) - (b.energy ?? 0) ||
                        b.regDate.unix() - a.regDate.unix()
                )
            case 5:
                return data.sort(
                    (a, b) =>
                        (a.energy ?? 0) - (b.energy ?? 0) ||
                        b.grade - a.grade ||
                        b.level - a.level ||
                        b.golf.birdie - a.golf.birdie ||
                        b.regDate.unix() - a.regDate.unix()
                )
            case 6:
                return data.sort(
                    (a, b) => 
                        a.name.localeCompare(b.name) ||
                        b.grade - a.grade ||
                        b.level - a.level ||
                        b.golf.birdie - a.golf.birdie ||
                        (a.energy ?? 0) - (b.energy ?? 0) ||
                        b.regDate.unix() - a.regDate.unix()
                )
        }
    }
    listSortByProperty = (key: NftSortKey) => {
        switch (key) {
            case 2:
                return nftSortMenu[1].desc
            case 5:
                return nftSortMenu[4].desc
        }
    }

    listFilter = (key: NftFilterKey, data: { training: number; trainingMax: number }[]) => {
        if (key === 2) return data.filter(v => v.training < v.trainingMax)
        else return data
    }

    getFilterTitle = (key: NftFilterKey) => {
        return nftFilterMenu.find(v => v.key === key)?.title ?? ""
    }
    getSortTitle = (key: NftSortKey) => {
        return nftSortMenu.find(v => v.key === key)?.title ?? ""
    }

    getDetail = async (seq: number) => {
        return await this.nftApi.getDetail(seq)
    }

    open = async (seq: number) => {
        return await this.nftApi.open(seq)
    }
    charge = async (dto: NftApiData.ChargeEnergy.ReqDto) => {
        return await this.nftApi.charge(dto)
    }
    chargeAll = async (dto: number[]) => {
        return await this.nftApi.chargeAll(dto)
    }
    training = async (dto: NftApiData.ChargeTraning.ReqDto) => {
        return await this.nftApi.training(dto)
    }
    levelup = async (seq: number) => {
        return await this.nftApi.levelup(seq)
    }

    getMyItem = async (dto: PageMeta.ReqDto) => {
        return await this.ItemApi.getMyItem(dto)
    }
    getNftPlayer = (playerCode: PlayerCode) => {
        return nftPlayer.find(e => e.nPersonID === playerCode)
    }
    getNftGrade = (grade: number) => {
        return nftGrade.find(e => e.nID === grade)
    }
    getGradeText = (grade: number) => {
        switch (grade) {
            case Grade.COMMON:
                return "Common"

            case Grade.UNCOMMON:
                return "Uncommon"

            case Grade.RARE:
                return "Rare"
            case Grade.SUPERRARE:
                return "Super Rare"
            case Grade.EPIC:
                return "Epic"
            case Grade.LEGENDARY:
                return "Legendary"

            default:
                return ""
        }
    }
    getGradeNumber = (grade: string) => {
        switch (grade) {
            case "common":
                return Grade.COMMON

            case "uncommon":
                return Grade.UNCOMMON

            case "rare":
                return Grade.RARE
            case "superRare":
                return Grade.SUPERRARE
            case "epic":
                return Grade.EPIC
            case "legendary":
                return Grade.LEGENDARY
            default:
                return 1
        }
    }
    doOpenChoice = async (dto: NftApiData.IDoOpenChoice) => {
        return await this.nftApi.doOpenChoice(dto)
    }
    doOpenLucky = async (dto: NftApiData.IDoOpenChoice) => {
        return await this.nftApi.doOpenLucky(dto)
    }
}

export const nftSvc = NftSvc.instance
