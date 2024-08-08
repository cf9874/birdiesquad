import { RegexUtil } from "utils"
import chatName from "json/filter_name.json"
import chatFilter from "json/filter_chat.json"
import { jsonSvc, profileSvc } from "apis/services"

export const UserValid = {
    nickname: (value: string) => {
        const nickname = value.trim()

        if (nickname.length < 2) {
            // throw new Error("닉네임은 2자 이상 입력해주세요.")
            throw new Error(jsonSvc.findLocalById("160028"))
        } else if (
            value.includes(" ") ||
            RegexUtil.isNickname(nickname) ||
            RegexUtil.isKoreanConsonantsOrVowels(nickname)
        ) {
            // throw new Error("닉네임은 띄어쓰기 없이 한글, 영문, 숫자만 가능합니다.")
            throw new Error(jsonSvc.findLocalById("160029"))
        } else if (nickname.length > 9) {
            // throw new Error("닉네임은 최대 9자까지 입력 가능합니다.")
            throw new Error("닉네임은 최대 9자까지 입력 가능합니다.")
        } else if (chatName.some(name => nickname.toLocaleLowerCase().includes(name.sNameFilter))) {
            // throw new Error("닉네임에 금칙어가 포함되어 있습니다.")
            throw new Error(jsonSvc.findLocalById("160031"))
        }

        return nickname
    },
    greeting: (value: string) => {
        const greeting = value.trim()

        if (chatFilter.some(name => greeting.toLocaleLowerCase().includes(name.sChatFilter))) {
            // throw new Error("인사말에 금칙어가 포함되어 있습니다.")
            throw new Error(jsonSvc.findLocalById("160008"))
        } else if (RegexUtil.isGreeting(greeting)) {
            // throw new Error("“ + / \\ ; : - _ ^ & ( ) < > $ ￦ 이와 같은 특수 문자는 사용할 수 없습니다.")
            throw new Error(jsonSvc.findLocalById("160030"))
        }
        // else if (greeting.length > 35) {
        //     throw new Error("최대 35자까지 입력 가능합니다.")
        // }

        return greeting
    },
}

export const DonateValid = {
    cheering: (value: string) => {
        const cheering = value.trim()

        if (chatFilter.some(name => cheering.toLocaleLowerCase().includes(name.sChatFilter))) {
            // throw new Error("인사말에 금칙어가 포함되어 있습니다.")
            throw new Error(jsonSvc.findLocalById("9900009"))
        } else if (RegexUtil.isGreeting(cheering)) {
            throw new Error("“ + / \\ ; : - _ ^ & ( ) < > $ 이와 같은 특수 문자는 사용할 수 없습니다.")
        } else if (cheering.length > 35) {
            // throw new Error("메시지에 금칙어가 포함되어 있습니다.")
            throw new Error(jsonSvc.findLocalById("9900010"))
        }

        return cheering.replace(/[\n]/g, "")
    },
}
//사용예시
// try {
//     const id = MemberValid.id("")
//     console.log(id)
// } catch ({ message }) {
//     console.error(message)
// }
