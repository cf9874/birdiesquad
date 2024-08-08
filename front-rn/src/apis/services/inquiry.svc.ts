import { ABaseScv } from "./base.svc"
import { InquiryApi } from "apis/context/inquiry.api"

class InquirySvc extends ABaseScv<InquirySvc>() {
    private readonly inquiryApi = new InquiryApi()

    submitInquiry = async ({ formData }: { formData: FormData }) => {
        return await this.inquiryApi.submitInquiry(formData)
    }
    getMyInquiry = async () => {
        return await this.inquiryApi.myInquiry()
    }
}

export const inquirySvc = InquirySvc.instance
