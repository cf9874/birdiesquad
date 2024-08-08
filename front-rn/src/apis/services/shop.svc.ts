import { IShopVerify, IShopChoice, BillError } from "apis/data/shop.data"
import { ABaseScv } from "./base.svc"
import { ShopApi } from "apis/context/shop.api"

class ShopSvc extends ABaseScv<ShopSvc>() {
    private readonly shopApi = new ShopApi()
    shopChoiceBilling = async ({ SHOP_CODE, PLAYER_CODE }: IShopChoice) => {
        return await this.shopApi.shopChoiceBilling({ SHOP_CODE, PLAYER_CODE })
    }
    shopLuckyBilling = async ({ SHOP_CODE, PLAYER_CODE }: IShopChoice) => {
        return await this.shopApi.shopLuckyBilling({ SHOP_CODE, PLAYER_CODE })
    }
    shopVerify = async ({ BILL_SEQ }: IShopVerify) => {
        return await this.shopApi.shopVerify({ BILL_SEQ })
    }
    shopEnd = async ({ BILL_SEQ }: IShopVerify) => {
        return await this.shopApi.shopEnd({ BILL_SEQ })
    }

    purchaceGoods = async (SHOP_CODE: number, SEASON_CODE: number, PLAYER_CODE: number) => {
        return await this.shopApi.purchaceGoods({ SHOP_CODE, SEASON_CODE, PLAYER_CODE })
    }
    getPurchaseCount = async () => {
        return await this.shopApi.getPurchaseCount()
    }
    purchaseCancel = async (BILL_SEQ: number) => {
        return await this.shopApi.purchaseCancel(BILL_SEQ)
    }
    purchase = async ({
        shopCode,
        seasonCode,
        playerCode,
        billStore
    }: {
        shopCode: number
        seasonCode: number
        playerCode: number
        billStore: number
    }) => {
        return await this.shopApi.purchaseBegin(shopCode, seasonCode, playerCode, billStore)
    }

    purchaseEnd = async (BILL_SEQ: number, BILL_RECEIPT: string, BILL_TRANSACTION?: string) => {
        return await this.shopApi.purchaseEnd(BILL_SEQ, BILL_RECEIPT, BILL_TRANSACTION)
    }
}

export const shopSvc = ShopSvc.instance
