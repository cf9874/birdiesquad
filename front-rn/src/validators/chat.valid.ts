import { RegexUtil } from "utils"
import slangJson from "json/filter_chat.json"
import { jsonSvc } from "apis/services"

const regex =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

export const ChatValid = {
    chatting: (value: string) => {
        const chatMsg = value.trim()

        const string = chatMsg.replace(regex, "1")
        console.log("string", string.length, value, value.trim(), value.length)

        if (slangJson.some(v => chatMsg.toLocaleLowerCase().includes(v.sChatFilter))) {
            // throw new Error("금칙어가 포함되어 있습니다. 다시 확인해주세요.")
            throw new Error(jsonSvc.findLocalById("9900009"))
        }
        if (string.length > jsonSvc.findConstById(20002).nIntValue) {
            // throw new Error("채팅 글자 수를 30자 이내로 입력해주세요.")
            throw new Error(jsonSvc.findLocalById("9900010"))
        }

        return chatMsg
    },
}
//사용예시
// try {
//     const id = MemberValid.id("")
//     console.log(id)
// } catch ({ message }) {
//     console.error(message)
// }
