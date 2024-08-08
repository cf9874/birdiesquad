import { useCallback, useRef, useState } from "react"
import { NativeSyntheticEvent, TextInputChangeEventData } from "react-native"

interface IParams<T> {
    value?: string
    errorMsg?: string
    maxLength?: number
    validCheck: T
}

const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

export const useInputs = <T extends (...args: any) => any>({ value = "", errorMsg = "", maxLength=99999, validCheck }: IParams<T>) => {
    const [data, setData] = useState({
        value,
        isValid: true,
        errorMsg,
        maxLength
    })

    let counter = useRef(0).current

    const onClear = () => {
        setData(data => ({ ...data, value, errorMsg, isValid: true }))
    }

    const onChange = useCallback(({ nativeEvent: { text } }: NativeSyntheticEvent<TextInputChangeEventData>) => {
        counter = text.replace(regex, 'a').length
        if (counter <= maxLength) {
            setData(data => ({ ...data, value: text, maxLength: text.length + 2*(maxLength -counter) }))
            return text
        }
        return 
    }, [])
    
    const validHandler = (_value?: string) => {
        let isValid: boolean
        try {
            const value = validCheck(_value !== undefined ? _value : data.value)

            isValid = true

            setData({
                value,
                isValid,
                errorMsg: "",
                maxLength
            })
        } catch (error: any) {
            // const message = validCheck.errorHandler?.(error) ?? ""
            isValid = false

            setData(data => ({
                ...data,
                isValid,
                errorMsg: error.message as string,
            }))
        }

        return isValid
    }

    const onValidChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        validHandler(e.nativeEvent.text)
        onChange(e)
    }

    return {
        ...data,
        onChange,
        onValidChange,
        onValidCheck: validHandler,
        onClear,
    } as const
}
