import { View, Image, TextInput, Text, ScrollView, Alert } from "react-native"
import React, { useRef, useState } from "react"
import { MyPageFooter, ProfileHeader } from "components/layouts"
import { CustomButton, PretendText } from "components/utils"
import { mineCompoStyle, mineGStyle, mineStyle } from "styles"
import { myPageImg } from "assets/images"
import { navigate, RatioUtil } from "utils"
import { Colors, Screen } from "const"
import { CheckBox, useCheckbox } from "components/Checkbox"
import { settingGStyle, settingStyle } from "styles/setting.style"
import { SafeAreaView } from "react-native-safe-area-context"
import { jsonSvc } from "apis/services"
const SetWithdraw = () => {
    const { checkedList, onOneCheck, isCheck, onCheck } = useCheckbox({
        checkable: [100, 101, 102, 103, 104, 105, 106],
    })
    const [reason, setReason] = useState("")

    const reasonSelect = checkedList.some(v => v.ischeck)

    const scrollRef = useRef<ScrollView>(null)

    return (
        <SafeAreaView style={mineGStyle.con}>
            {/* <ProfileHeader title="회원탈퇴" /> */}
            <ProfileHeader title={jsonSvc.findLocalById("172012")} />
            <ScrollView
                style={mineGStyle.bgCon}
                showsVerticalScrollIndicator={false}
                ref={scrollRef}
                contentContainerStyle={{ paddingBottom: RatioUtil.height(200) }}
            >
                <View style={settingStyle.withdraw.titleCon}>
                    <PretendText style={settingStyle.withdraw.titleText}>
                        {/* {"버디스쿼드를\n정말 떠나시나요?💧"} */}
                        {jsonSvc.findLocalById("172100")}
                    </PretendText>
                </View>
                {checkedList.map((v, i) => (
                    <View key={v.name} style={settingStyle.withdraw.listCon}>
                        <CheckBox
                            onCheck={() => {
                                onCheck(v.name)
                                i === checkedList.length - 1 && setReason("")
                            }}
                            ischeck={v.ischeck}
                            unCheckedView={
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}
                                >
                                    <View style={settingStyle.withdraw.checkCon}>
                                        <View
                                            style={{
                                                ...settingStyle.withdraw.checkIcon,
                                                backgroundColor: Colors.GRAY,
                                            }}
                                        >
                                            <Image source={myPageImg.check} />
                                        </View>
                                    </View>
                                    <PretendText style={settingStyle.withdraw.listText}>
                                        {nameList[v.name].title}
                                    </PretendText>
                                </View>
                            }
                            checkedView={
                                <View
                                    style={{
                                        flexDirection: "row",
                                    }}
                                >
                                    <View style={settingStyle.withdraw.checkCon}>
                                        <View
                                            style={{
                                                ...settingStyle.withdraw.checkIcon,
                                                backgroundColor: Colors.PURPLE,
                                            }}
                                        >
                                            <Image source={myPageImg.check} />
                                        </View>
                                    </View>
                                    <PretendText style={settingStyle.withdraw.listText}>
                                        {nameList[v.name].title}
                                    </PretendText>
                                </View>
                            }
                            style={{ alignItems: "center" }}
                        ></CheckBox>
                        {i === checkedList.length - 1 ? (
                            <TextInput
                                style={settingStyle.withdraw.inputCon}
                                placeholder={jsonSvc.findLocalById("172108")}
                                placeholderTextColor={Colors.GRAY12}
                                maxLength={100}
                                multiline
                                value={isCheck([106]) ? reason : ""}
                                onChangeText={v => setReason(v)}
                                editable={isCheck([106])}
                                onFocus={() => {
                                    scrollRef.current?.scrollToEnd()
                                }}
                                onBlur={() => {
                                    scrollRef.current?.scrollTo({ y: RatioUtil.height(200) })
                                }}
                            />
                        ) : null}
                    </View>
                ))}
                <CustomButton
                    style={{
                        ...settingGStyle.blackButton.con,
                        marginTop: RatioUtil.height(6),
                        backgroundColor: reasonSelect ? Colors.BLACK4 : Colors.GRAY7,
                    }}
                    onPress={() => {
                        if (reasonSelect) {
                            if (isCheck([106])) {
                                if (reason)
                                    navigate(Screen.WITHDRAWSUBMIT, {
                                        reason,
                                    })
                                else Alert.alert("이유를 적어주세요")
                            } else {
                                const { name } = checkedList.find(v => v.ischeck) ?? {}

                                navigate(Screen.WITHDRAWSUBMIT, {
                                    reason: nameList[name as number].title,
                                })
                            }
                        } else {
                            Alert.alert("사유를 선택해 주세요")
                        }
                    }}
                >
                    <PretendText
                        style={[
                            settingGStyle.blackButton.text,
                            {
                                color: reasonSelect ? Colors.WHITE : Colors.GRAY12,
                            },
                        ]}
                    >
                        {/* 다음 */}
                        {jsonSvc.findLocalById("172204")}
                    </PretendText>
                </CustomButton>
            </ScrollView>
        </SafeAreaView>
    )
}

export default SetWithdraw

const nameList: { [key: string]: { title: string; link?: string } } = {
    // 100: { title: "서비스 이용이 불편합니다." },
    100: { title: jsonSvc.findLocalById("172101") },
    // 101: { title: "원하는 콘텐츠가 부족합니다." },
    101: { title: jsonSvc.findLocalById("172102") },
    // 102: { title: "커뮤니티 활동이 불편합니다." },
    102: { title: jsonSvc.findLocalById("172103") },
    // 103: { title: "혜택이 부족합니다." },
    103: { title: jsonSvc.findLocalById("172104") },
    // 104: { title: "응원하는 선수가 없습니다." },
    104: { title: jsonSvc.findLocalById("172105") },
    // 105: { title: "NFT 사용 방법이 어렵습니다." },
    105: { title: jsonSvc.findLocalById("172106") },
    // 106: { title: "기타 (최대 100자 이내)" },
    106: { title: jsonSvc.findLocalById("172107") },
}
