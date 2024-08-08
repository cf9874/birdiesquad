import { ABaseApi } from "./base.api"
import { PageMeta } from "../data"
import { ItemApiData } from "apis/data/itemlist.data"

export class ItemApi extends ABaseApi {
    constructor() {
        super()
    }

    async getMyItem(dto?: PageMeta.ReqDto) {
        const { data } = await this.get<ItemApiData.ItemList.ResDao>({
            url: "/api/v1/item/page-my-item?" + PageMeta.toReqDao(dto),
            options: await this.genAuthConfig(),
        })

        return ItemApiData.ItemList.toResDto(data)
    }
}
