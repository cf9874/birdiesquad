import { PretendText } from "components/utils"
import React, { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { UserValid } from "validators"

const NickGreet = () => {
    const [nick, setNick] = useState("")
    const [nickCheck, checkNick] = useState("")
    const [greeting, setGreeting] = useState("기본!")
    const [greetingCheck, checkGreeting] = useState("")
    return (
        <>
            <SafeAreaView />
            <View
                style={{
                    height: 60,
                    margin: 12,
                    justifyContent: "center",
                }}
            >
                <TextInput
                    style={{
                        borderBottomWidth: 1,
                        padding: 10,
                    }}
                    onChangeText={value => {
                        try {
                            setNick(UserValid.nickname(value))
                            checkNick("")
                        } catch (error: any) {
                            checkNick(error.message)
                            setNick(value)
                        }
                    }}
                    value={nick}
                    placeholder="닉네임을 입력해주세요"
                />
                <Text style={{ position: "absolute", right: 10 }}>{nick.length} / 9</Text>
            </View>
            <View style={{ height: 20 }}>
                {nickCheck ? <Text style={{ backgroundColor: "#000", color: "#f00" }}>{nickCheck}</Text> : <></>}
            </View>
            <View
                style={{
                    height: 60,
                    margin: 12,
                    justifyContent: "center",
                }}
            >
                <TextInput
                    style={{
                        borderBottomWidth: 1,
                        padding: 10,
                    }}
                    onChangeText={value => {
                        try {
                            setGreeting(UserValid.greeting(value))
                            checkGreeting("")
                        } catch (error: any) {
                            checkGreeting(error.message)
                            setGreeting(value)
                        }
                    }}
                    value={greeting}
                    placeholder="인사말을 입력해주세요"
                />
                <Text style={{ position: "absolute", right: 10 }}>{greeting.length} / 35</Text>
            </View>
            <View style={{ height: 20 }}>
                {greetingCheck ? (
                    <Text style={{ backgroundColor: "#000", color: "#f00" }}>{greetingCheck}</Text>
                ) : (
                    <></>
                )}
            </View>
        </>
    )
}
export default NickGreet
