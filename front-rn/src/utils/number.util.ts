import { FLAG, MAX_NUM_FOR_NFT, MAX_NUM_FOR_POINT } from "const/wallet.const"

export const NumberUtil = {
    sum: (arr: Array<number | string>) => {
        return arr.reduce<number>((acc, v) => acc + Number(v), 0)
    },

    prize: (num: number) => {
        const billion = 100000000
        const million = 10000

        let result

        if (num >= billion) {
            result = (num / billion).toFixed(2) + " 억원"
        } else if (num >= million) {
            result = (num / million).toFixed(1) + " 만원"
        } else {
            result = num + " 원"
        }

        // .0 제거
        return result.replace(/\.0(?=[^0-9])/g, "")
    },

    //숫자 한글 단위 붙이기
    addUnit: (num: number) => {
        return num > 10000
            ? new Intl.NumberFormat("ko-KR", {
                //   notation: "compact",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 1,
              }).format(num)
            : num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    },
    numRank: (num: number) => {
        return num <= 0
            ? "순위없음"
            : num > 100000
            ? "상위100%"
            : num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    },
    denoteComma: (number: number) => {
        if (number < 999) return number

        return number.toLocaleString()
    },
    toNumber: (string: string) => {
        const num = parseInt(string.replace(/\D/g, ""))
        return isNaN(num) ? 0 : num
    },
    addNumberWallet: (num: number, unit: string = FLAG.POINT) => {
        const flag = unit === FLAG.POINT ? MAX_NUM_FOR_POINT : MAX_NUM_FOR_NFT
        return num > flag ? "9,999,999,999.9" : NumberUtil.denoteComma(parseFloat(num.toFixed(1))).toString()
    },
    unitTransfer: (num: number): string => {
        if (num <= 9999) {
            return num
                .toFixed(0)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                .toString()
        } else if (num <= 99999999) {
            const result = Math.round(num / 10000).toFixed(1)
            if (result.charAt(result.length - 1) === "0") {
                return result.slice(0, -2) + "만"
            }
            return result + "만"
        } else {
            const result = Math.round(num / 100000000).toFixed(1) + "억"
            if (result.charAt(result.length - 1) === "0") {
                return result.slice(0, -2) + "억"
            }
            return result + "억"
        }
    },
    unitTransferFloat: (num: number): string => {
        let unit = ""
        let result = []

        if (num <= 9999) {
            return num
                .toFixed(0)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
                .toString()
        } else if (num <= 99999999) {
            result = (num / 10000).toString().split(".")
            unit = "만"
        } else {
            result = (num / 100000000).toString().split(".")
            unit = "억"
        }
        
        const int = result[0]
        const float = result[1]?result[1].slice(0, 1):''
        console.log(int, float)
        return `${int}${float?("." + float):''}${unit}`
    },
    koreanFormatter: (num: number) => {
        const koreanFormatter = new Intl.NumberFormat("ko-KR", {
            style: "decimal",
        })
        return koreanFormatter.format(num)
    },
    formatFloor: (num: number) => {
        if (num === Math.floor(num)) return num
        else if (num === Number(num.toFixed(1))) return num.toFixed(1)
        else return num.toFixed(2)
    },
}
