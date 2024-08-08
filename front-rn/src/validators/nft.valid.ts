import { jsonSvc } from "apis/services"
import { RegexUtil } from "utils"

export const NftValid = {
    nickname: (value: string) => {
        const nickname = value.trim()

        if (nickname.length < 2) {
            throw new Error(jsonSvc.findLocalById("160028"))
        } else if (nickname.length > 9) {
            throw new Error("닉네임은 최대 9자까지 입력 가능합니다.")
        } else if (RegexUtil.isNickname(nickname)) {
            throw new Error(jsonSvc.findLocalById("160029"))
        }

        return nickname
    },
}
//사용예시
// try {
//     const id = MemberValid.id("")
//     console.log(id)
// } catch ({ message }) {
//     console.error(message)
// }
