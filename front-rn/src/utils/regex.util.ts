export const RegexUtil = {
    isPwd: (txt: string) => {
        const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/
        return !passwordReg.test(txt)
    },

    isPhone: (txt: string) => {
        const phoneReg = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/
        return !phoneReg.test(txt)
    },

    isEmail: (txt: string) => {
        const emailReg =
            /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
        return !emailReg.test(txt)
    },

    isNumber: (txt: string) => {
        const numberReg = /^[0-9]+$/i
        return !numberReg.test(txt)
    },

    isUrl: (txt: string) => {
        const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
        return urlRegex.test(txt)
    },

    isNickname: (txt: string) => {
        const nicknameRegex = /^[0-9A-Za-zㄱ-ㅎ가-힣]{1,9}$/
        return !nicknameRegex.test(txt)
    },

    isGreeting: (txt: string) => {
        const greetingRegex = /(['"+/\\;:\-_^&()<>$￦₩])/g
        return greetingRegex.test(txt)
    },
    isKoreanConsonantsOrVowels: (txt: string) => {
        const koreanVowelsRegex = /^[ㆍㅏ-ㅣ]+$/g
        const koreanConsonantsRegex = /^[ㄱ-ㅎ]+$/g
        return koreanVowelsRegex.test(txt) || koreanConsonantsRegex.test(txt)
    },
}
