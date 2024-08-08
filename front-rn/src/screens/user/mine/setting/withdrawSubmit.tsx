import { View, Image, TextInput, Text, ScrollView, Alert, Settings } from "react-native"
import React, { useState } from "react"
import { MyPageFooter, ProfileHeader } from "components/layouts"
import { CustomButton, PretendText } from "components/utils"
import { mineCompoStyle, mineGStyle, mineStyle, userStyle } from "styles"
import { myPageImg, termImg } from "assets/images"
import { navigate, RatioUtil } from "utils"
import { AnalyticsEventName, Colors, Screen, ScreenParams } from "const"
import { useAsyncEffect, useWrapDispatch } from "hooks"
import { setModal } from "store/reducers/config.reducer"
import { settingGStyle, settingStyle } from "styles/setting.style"
import { SafeAreaView } from "react-native-safe-area-context"
import { WithdrawCompo } from "./setting.Compo"
import { RouteProp, useRoute } from "@react-navigation/native"
import { CheckBox } from "components/Checkbox"
import { jsonSvc } from "apis/services"
import { Analytics } from "utils/analytics.util"
const WithdrawSubmit = () => {
    const [isCheck, setIsCheck] = useState(false)
    const route = useRoute<RouteProp<ScreenParams, Screen.WITHDRAWSUBMIT>>()
    const modalDispatch = useWrapDispatch(setModal)

    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_profile_160, {
            hasNewUserData: true,
        })
    }, [])
    return (
        <SafeAreaView style={mineGStyle.con}>
            {/* <ProfileHeader title="회원탈퇴" /> */}
            <ProfileHeader title={jsonSvc.findLocalById("172012")} />

            <ScrollView>
                <View style={{ ...mineGStyle.bgCon, paddingHorizontal: RatioUtil.width(20) }}>
                    <PretendText
                        style={{
                            marginTop: RatioUtil.height(43),
                            ...settingStyle.withdraw.titleText,
                        }}
                    >
                        {/* {"버디스쿼드를\n정말 떠나시나요?💧"} */}
                        {jsonSvc.findLocalById("172100")}
                    </PretendText>
                    <PretendText
                        style={{
                            marginTop: RatioUtil.height(20),
                            ...settingStyle.withdraw.subText,
                        }}
                    >
                        {/* {"탈퇴 시 고객님의 모든 정보가 소멸되며,\n이전으로 복구가 불가능합니다."} */}
                        {jsonSvc.findLocalById("172200")}
                    </PretendText>
                    <View
                        style={{
                            marginTop: RatioUtil.height(20),
                            width: RatioUtil.width(320),
                        }}
                    >
                        <View
                            style={{
                                borderColor: Colors.GRAY7,
                                width: RatioUtil.width(320),
                                borderRadius: RatioUtil.width(10),
                                borderWidth: 1,

                                // justifyContent: "center",
                                // alignContent: "center",
                            }}
                        >
                            <View
                                style={{
                                    paddingHorizontal: RatioUtil.width(10),
                                    paddingVertical: RatioUtil.height(20),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.BLACK,
                                        fontSize: RatioUtil.font(14),
                                        fontWeight: "700",
                                    }}
                                >
                                    {/* 카카오VX 통합 계정 탈퇴 유의사항 */}
                                    {jsonSvc.findLocalById("172201")}
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.height(20),
                                        ...settingStyle.withdraw.subText,
                                    }}
                                >
                                    {/* {
                                        "회원 탈퇴시,\n‘카카오VX’의 통합계정이 탈퇴됩니다. 카카오 VX의 모든 서비스와 정보가 탈퇴 및 삭제됩니다.\n자세한 내용은 아래를 참조해주세요."
                                    } */}
                                    {jsonSvc.findLocalById("172202")}
                                </PretendText>
                                {/* <PretendText
                                    style={{
                                        marginTop: RatioUtil.height(20),
                                        ...settingStyle.withdraw.subText,
                                    }}
                                >
                                    {
                                        " [버디스쿼드]\n스펜딩에 유료로 구매한 NFT가 존재할 경우 회원 탈퇴가 불가하며 보유한 유료 NFT를 모두 지갑으로 이동 후 회원탈퇴가 가능합니다."
                                    }
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.height(20),
                                        ...settingStyle.withdraw.subText,
                                    }}
                                >
                                    {
                                        "스펜딩에 보유한 재화\n스펜딩에 보유한 무료 지급 NFT\n프로필 정보(닉네임), 인사말, 기록\n대회기록 (보상 획득 내역)"
                                    }
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.height(20),
                                        ...settingStyle.withdraw.subText,
                                    }}
                                >
                                    {
                                        "* 탈퇴 후 아래와 같은 정보는 삭제 되지 않습니다.\n대회에 반영된 응원픽 랭킹 정보\n팬 랭크 정보\n아이디에 연계된 커뮤니티 게시물 및 댓글\n트랜잭션 히스토리\n마켓 결제 기록\n선수 후원 기록\n래플 응모/당첨 기록"
                                    }
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.height(20),
                                        ...settingStyle.withdraw.subText,
                                    }}
                                >
                                    {
                                        "[카카오골프예약]\n라운드를 완료하지 않은 예약건이 있을 경우 회원 탈퇴가 불가하며 예약취소 또는 예약이행 후 회원탈퇴가 가능합니다."
                                    }
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.height(20),
                                        ...settingStyle.withdraw.subText,
                                    }}
                                >
                                    {"프로필 정보(사진, 닉네임), 예약정보\n캐시 및 캐시 내역\n쿠폰 및 쿠폰 내역"}
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.height(20),
                                        ...settingStyle.withdraw.subText,
                                    }}
                                >
                                    {
                                        "[프렌즈 스크린T1, T2, G]\n나의 라운드 기록\n나의 업적미션 기록\n나의 포인트 내 스윙영상 기록\n구매한 나의 캐릭터\n가입 시 등록한 개인정보"
                                    }
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.height(20),
                                        ...settingStyle.withdraw.subText,
                                    }}
                                >
                                    {
                                        "[프렌즈 스크린 R]\n클럽 측정 기록\n나의 라운드 기록\n나의 스윙 영상 기록\n가입 시 등록한 개인 정보"
                                    }
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.height(20),
                                        ...settingStyle.withdraw.subText,
                                    }}
                                >
                                    {
                                        "* 탈퇴 후 아래와 같은 정보는 삭제 되지 않습니다.\n대회에 반영된 랭킹 정보\n아이디에 연계된 커뮤니티 게시물 및 댓글"
                                    }
                                </PretendText>
                                <PretendText
                                    style={{
                                        marginTop: RatioUtil.height(20),
                                        ...settingStyle.withdraw.subText,
                                    }}
                                >
                                    {
                                        "[카카오프렌즈골프 온라인스토어]\n정보소멸/재가입 제한\n주문 내역\n캐시 및 캐시 내역\n쿠폰 및 쿠폰 내역"
                                    }
                                </PretendText> */}
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                        }}
                    >
                        <CheckBox
                            onCheck={() => setIsCheck(state => !state)}
                            ischeck={isCheck}
                            unCheckedView={
                                <Image
                                    source={myPageImg.unchecked}
                                    style={{
                                        width: RatioUtil.width(20),
                                        height: RatioUtil.width(20),
                                    }}
                                    resizeMode="contain"
                                />
                            }
                            checkedView={
                                <Image
                                    source={myPageImg.checked}
                                    style={{
                                        width: RatioUtil.width(20),
                                        height: RatioUtil.width(20),
                                    }}
                                    resizeMode="contain"
                                />
                            }
                            style={{
                                width: RatioUtil.width(320),
                                marginTop: RatioUtil.height(20),
                                height: RatioUtil.height(52),
                            }}
                        >
                            <PretendText
                                style={{
                                    marginLeft: RatioUtil.width(6),
                                    color: isCheck ? Colors.BLACK : Colors.GRAY8,
                                    fontSize: RatioUtil.font(14),
                                }}
                            >
                                {/* 위 내용에 동의합니다. */}
                                {jsonSvc.findLocalById("172203")}
                            </PretendText>
                        </CheckBox>
                    </View>
                    <CustomButton
                        style={[
                            {
                                width: RatioUtil.width(320),
                                height: RatioUtil.height(60),
                                borderRadius: RatioUtil.width(100),
                                backgroundColor: isCheck ? Colors.BLACK4 : Colors.GRAY7,
                                marginBottom: RatioUtil.height(40),
                                justifyContent: "center",
                                alignItems: "center",
                                alignSelf: "center",
                            },
                        ]}
                        disabled={!isCheck}
                        onPress={() => {
                            if (isCheck) {
                                modalDispatch({
                                    open: true,
                                    children: <WithdrawCompo.MoveSpandingModal reason={route.params.reason} />,
                                })
                            }
                        }}
                    >
                        <PretendText style={settingGStyle.blackButton.text}>
                            {/* 탈퇴하기 */}
                            {jsonSvc.findLocalById("170041")}
                        </PretendText>
                    </CustomButton>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default WithdrawSubmit
