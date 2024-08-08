import { ABaseApi } from "./base.api"
import { MyListInquiry } from "apis/data/inquiry.data"
export class InquiryApi extends ABaseApi {
    constructor() {
        super()
    }

    async submitInquiry(formData: FormData) {
        const header = await this.genAuthHeader()
        const { data } = await this.post(
            {
                url: `/api/v1/profile/my/inquiry`,
                options: {
                    headers: {
                        ...header,
                        "content-type": `multipart/form-data`,
                    },
                },
                body: formData,
            },
            error => console.log("ERR:", error)
        )

        return data
    }

    async myInquiry() {
        const { data } = await this.get<MyListInquiry[]>({
            url: `/api/v1/profile/my/inquiry`,
            options: await this.genAuthConfig(),
        })
        return data
    }
}
