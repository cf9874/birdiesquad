import React from "react"
import { Text } from "react-native"
import { CheckBox, useCheckbox } from "components/Checkbox"
import { PretendText } from "components/utils"

const CheckBoxTest = () => {
    const { checkedList, onAllCheck, onCheck, onOneCheck, isAllcheck } = useCheckbox({
        checkable: [100, 101, 102, 103],
        checked: [100],
    })
    console.log(checkedList)

    return (
        <>
            {checkedList.map(v => {
                return (
                    <CheckBox onCheck={() => onCheck(v.name)} ischeck={v.ischeck} key={v.name}>
                        <PretendText>설명문구</PretendText>
                    </CheckBox>
                )
            })}
            <CheckBox onCheck={onAllCheck} ischeck={isAllcheck}>
                <Text>전체 동의</Text>
            </CheckBox>
        </>
    )
}

export default CheckBoxTest
