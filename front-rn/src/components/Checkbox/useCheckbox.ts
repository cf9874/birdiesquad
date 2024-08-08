import { useToggle } from "hooks"
import { useEffect, useState } from "react"

export const useCheckbox = ({ checkable = [], checked = [] }: IParams) => {
    const [checkedList, setCheckedList] = useState(
        checkable.map((name: string | number) => ({
            name,
            ischeck: checked.some(v => v === name),
        }))
    )

    const [isAllcheck, isAllcheckToggle, setIsAllcheckToggle] = useToggle()

    // 전체체크박스 있다고 가정시 checkable.length - 1
    useEffect(() => {
        setIsAllcheckToggle(checkedList.filter(v => v.ischeck).length >= checkable.length - 1)
    }, [checkedList])

    const onAllCheck = () => {
        const leastCheck = checkedList.some(v => v.ischeck === false)
        setCheckedList(list =>
            list.map(v => {
                return { name: v.name, ischeck: leastCheck ? true : false }
            })
        )
        isAllcheckToggle()
    }

    const onCheck = (name: string | number) => {
        setCheckedList(list => list.map(v => (v.name === name ? { ...v, ischeck: !v.ischeck } : v)))
    }

    //하나만 체크
    const onOneCheck = (name: string | number) => {
        setCheckedList(list => list.map(v => ({ name: v.name, ischeck: v.ischeck ? false : v.name === name })))
    }
    //체크여부
    // const isCheck = (name: string | number) => checkedList.find(v => v.name === name)?.ischeck
    const isCheck = (nameList: (string | number)[]) => {
        return !checkedList.some(v => nameList.some(name => v.name === name && !v.ischeck))
    }
    return {
        checkedList,
        onAllCheck,
        onCheck,
        isAllcheck,
        onOneCheck,
        isCheck,
        isAllcheckToggle,
    }
}

export interface IParams {
    checked?: Array<string | number>
    checkable: Array<string | number>
}

// type CheckType = {
//   name: Name
//   ischeck: boolean
// }
