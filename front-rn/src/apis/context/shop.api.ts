import { shopChoiceBilling } from "apis/endpoints"
import { ABaseApi } from "./base.api"
import { BILL_BEGIN, IPurchaseCancel, IPurchaseEnd, IShopChoice, IShopVerify } from "../data"
import { ErrorUtil } from "utils"
import { Platform } from "react-native"

export class ShopApi extends ABaseApi {
    constructor() {
        super()
    }

    async shopChoiceBilling(reqData: IShopChoice) {
        const { data } = await this.post<IShopChoice>({
            url: `/api/v1/shop/choice/billing/init`,
            body: reqData,
            options: await this.genAuthConfig(),
        })

        return data
    }
    async shopLuckyBilling(reqData: IShopChoice) {
        const { data } = await this.post<any>({
            url: `/api/v1/shop/lucky/billing/init`,
            body: reqData,
            options: await this.genAuthConfig(),
        })

        return data
    }
    async shopVerify(reqData: IShopVerify) {
        const { data } = await this.post<any>({
            url: `/api/v1/shop/billing/verify`,
            body: reqData,
            options: await this.genAuthConfig(),
        })

        return data
    }
    async shopEnd(reqData: IShopVerify) {
        const { data } = await this.post<any>({
            url: `/api/v1/shop/billing/end`,
            body: reqData,
            options: await this.genAuthConfig(),
        })

        return data
    }

    // only dev
    async getCashItem(PLAYER_CODE: number) {
        const { data } = await this.post<any>({
            url: `/api/v1/shop/do-sponsor`,
            body: { PLAYER_CODE },
            options: await this.genAuthConfig(),
        })

        return data
    }
    async purchaceGoods(body: { SHOP_CODE: number; SEASON_CODE: number; PLAYER_CODE: number }) {
        const { data } = await this.post<{
            SHOP_CODE: number
            BILL_ITEMS: {
                SEQ_NO: number
                REG_AT: string
                ITEM_ID: number
                ITEM_COUNT: number
                PLAYER_CODE: number
                SEASON_CODE: number
                USER_SEQ: number
            }[]
        }>({
            url: `/api/v1/shop/do-buy/goods`,
            body,
            options: await this.genAuthConfig(),
        })

        return data
    }
    async getPurchaseCount() {
        const { data } = await this.get<{
            BUY_GOODS: {
                SHOP_CODE: number
                BUY_COUNT: number
            }[]
        }>({
            url: `/api/v1/shop/info-count/goods`,
            options: await this.genAuthConfig(),
        })

        return data
    }

    // new shop api

    async purchaseBegin(SHOP_CODE: number, SEASON_CODE: number, PLAYER_CODE: number, BILL_STORE: number) {
        console.log("Purchase Begin")
        const { data } = await this.post<{
            BILL_BEGIN: BILL_BEGIN
        }>({
            url: `/api/v1/shop/iap/purchase/goods/begin`,
            body: {
                SHOP_CODE,
                SEASON_CODE,
                PLAYER_CODE,
                BILL_STORE,
            },
            options: await this.genAuthConfig(),
        })

        return data
    }
    async purchaseCancel(BILL_SEQ: number) {
        const { data } = await this.post<IPurchaseCancel>({
            url: `/api/v1/shop/iap/purchase/goods/cancel`,
            body: { BILL_SEQ },
            options: await this.genAuthConfig(),
        })

        return data
    }
    async purchaseEnd(BILL_SEQ: number, BILL_RECEIPT: string, BILL_TRANSACTION?: string) {
        console.log("Purchase End", BILL_TRANSACTION)
        let url =
            Platform.OS === "android" ? `/api/v1/shop/google/purchase/goods/end` : `/api/v1/shop/ios/purchase/goods/end`
        let errorData = {};
        const data = await this.post<IPurchaseEnd>(
            {
                url,
                body: {
                    BILL_SEQ,
                    BILL_RECEIPT,
                    ...(Platform.OS === "ios" ? { BILL_TRANSACTION } : {}),
                },
                options: await this.genAuthConfig(),
            },
            error => {
                errorData = error
                ErrorUtil.notFoundUserModal(error), console.log(error)
                
            }
        )
        console.log("=====> res End", data.code)
        return data.code=='SUCCESS'?data:errorData
    }
}
