import { jsonSvc } from "apis/services"

export const TextUtil = {
    ellipsis: (text: string, maxLength: number = 0) => {
        let textLength = maxLength
        if (textLength <= 0)
            textLength = jsonSvc.findConstById(24001).nIntValue || 0

        if (textLength && text.length > textLength) {
            return text.slice(0, textLength) + "..."
        }
        return text
    },
}
