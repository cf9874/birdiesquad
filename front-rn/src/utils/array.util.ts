export const ArrayUtil = {
    //중복제거
    toUniq: <T>(list: ArrayElType<T>[] = [], isdup = (a: ArrayElType<T>, c: ArrayElType<T>) => a === c) => {
        return list.filter((curr, i, arr) => arr.findIndex(acc => isdup(acc, curr)) === i)
    },
    // 이중 배열 체크
    compare: ({ outer = [], inner = [], flag = () => true }: ICompareParmas) => {
        const result: ICompareResult = {
            cor: [],
            incor: [],
        }

        for (let i = 0; i < outer.length; i++) {
            result[inner.some(data => flag(outer[i], data)) ? "cor" : "incor"].push(outer[i])
        }

        return result
    },
    sort: <T>(array: T[], key: keyof T, order: SortOrder = "asc"): T[] => {
        return [...array].sort((a, b) => {
            const valueA = a[key]
            const valueB = b[key]

            if (typeof valueA === "number" && typeof valueB === "number") {
                return order === "asc" ? valueA - valueB : valueB - valueA
            }

            if (typeof valueA === "string" && typeof valueB === "string") {
                return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
            }

            throw new Error(`Unsupported value types for sorting: ${typeof valueA}, ${typeof valueB}`)
        })
    },
}
type ArrayElType<T> = T extends (infer E)[] ? E[] : T

interface ICompareParmas {
    outer: any[]
    inner: any[]
    flag: (prev: any, curr: any) => boolean
}

interface ICompareResult {
    cor: any[]
    incor: any[]
}

type SortOrder = "asc" | "desc"
