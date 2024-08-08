import { View, Image, Pressable } from "react-native"
import React, { useEffect, useState } from "react"
import { profileHeaderImg } from "assets/images"
import { navigate, RatioUtil } from "utils"
import { Colors, Screen, ScreenParams } from "const"
import { useQuery, useWrapDispatch } from "hooks"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { LayoutStyle } from "styles/layout.style"
import { RouteProp, useRoute } from "@react-navigation/native"
import { CustomButton, PretendText } from "components/utils"
import { ProfileHeaderCompo } from "./layout.compo"
import { profileSvc } from "apis/services"
import dayjs from "dayjs"
import { IMyProfile, IProfileBlameHistory } from "apis/data"
import { SvgIcon } from "components/Common/SvgIcon"

export const ProfileHeader = (props: {
    title: string
    userSeq?: number
    rotateMenu?: boolean
    backHome?: typeof Screen[keyof typeof Screen] | undefined
}) => {
    const route = useRoute<RouteProp<ScreenParams, Screen.USERPROFILE>>()
    const params = route.params
    const [profile, setProfile] = useState<IMyProfile>()
    const [blameData, setBlameData] = useState<IProfileBlameHistory>()
    const popUpDispatch = useWrapDispatch(setPopUp)
    const modalDispatch = useWrapDispatch(setModal)

    const dataInitailize = async (seq: number) => {
        const profile = await profileSvc.getMyProfile()
        const blameData = await profileSvc.BlameCheck(seq)

        if (!profile || !blameData) return

        setProfile(profile)
        setBlameData(blameData)
    }
    // const [data] = useQuery({
    //     profile: profileSvc.getMyProfile,
    // })

    const [toggle, setToggle] = useState(false)

    useEffect(() => {
        if (params?.userSeq) {
            dataInitailize(params.userSeq)
        }
    }, [toggle, params])
    // const [blameList] = useQuery(() => profileSvc.BlameCheck(params.userSeq ?? 99999999), { deps: [toggle] })
    // if (!data || !blameList) return <Text>1</Text>

    const BlameCheckDate = (blameDate?: string) => {
        return dayjs(blameDate) > dayjs()
    }

    const isBanned = BlameCheckDate(profile?.BLAME_END_AT)
    const isBlamed = blameData?.BLAME_HISTORY.find(v => v.WANTED_SEQ === params.userSeq)?.BLAME_COUNT

    return (
        <View style={LayoutStyle.profileHeader.con}>
            <Pressable
                style={[
                    {
                        ...RatioUtil.sizeFixedRatio(44, 44),
                        alignItems: "center",
                        justifyContent: "center",
                        // nibble 뒤로가기 버튼 마진 때문에 이상해짐 주석 처리하면 괜찮아짐
                        // marginLeft: RatioUtil.width(7.5),
                    },
                ]}
                onPress={() => {
                    navigate(props.backHome ?? Screen.BACK)
                }}
            >
                {/* <Image resizeMode="contain" source={mainHeaderImg.back["1x"]} /> */}
                <SvgIcon name="BackSvg"/>
                
            </Pressable>

            <PretendText style={LayoutStyle.profileHeader.text}>{props.title}</PretendText>
            {profile?.USER_SEQ !== props.userSeq ? (
                route.name === Screen.USERPROFILE ? (
                    <Pressable
                        style={{
                            ...LayoutStyle.profileHeader.reportIcon,
                            transform: [{ rotate: props.rotateMenu ? "90deg" : "0deg" }],
                        }}
                        onPress={() => {
                            if (isBanned) {
                                modalDispatch({
                                    open: true,
                                    children: <AlreadyBalemModal errorMsg="이미 이용제재된 계정입니다" />,
                                })
                            } else if (isBlamed) {
                                modalDispatch({
                                    open: true,
                                    children: <AlreadyBalemModal errorMsg="이미 신고한 계정입니다" />,
                                })
                            } else {
                                popUpDispatch({
                                    open: true,
                                    children: (
                                        <ProfileHeaderCompo.ReportPopUp
                                            userSeq={params.userSeq}
                                            setToggle={setToggle}
                                        />
                                    ),
                                })
                            }
                        }}
                    >
                        <Image resizeMode="contain" source={profileHeaderImg.menu} />
                    </Pressable>
                ) : (
                    <View style={{ ...RatioUtil.sizeFixedRatio(52.5, 44) }} />
                )
            ) : (
                <View style={{ ...RatioUtil.sizeFixedRatio(52.5, 44) }} />
            )}
        </View>
    )
}
type IErrorMsg = {
    errorMsg: string
}
export const AlreadyBalemModal = (props: IErrorMsg) => {
    const modalDispatch = useWrapDispatch(setModal)

    return (
        <View
            style={{
                backgroundColor: Colors.WHITE,
                borderRadius: RatioUtil.width(16),
                alignSelf: "center",
                alignItems: "center",
                width: RatioUtil.width(272),
                paddingHorizontal: RatioUtil.width(20),
                paddingVertical: RatioUtil.width(30),
            }}
        >
            <View>
                <PretendText
                    style={{
                        color: Colors.BLACK3,
                        fontSize: RatioUtil.font(16),
                        fontWeight: RatioUtil.fontWeightBold(),
                        textAlign: "center",
                    }}
                >
                    {props.errorMsg}
                </PretendText>
            </View>
            <CustomButton
                onPress={() => {
                    modalDispatch({ open: false })
                }}
                style={{
                    width: RatioUtil.width(232),
                    height: RatioUtil.lengthFixedRatio(48),
                    borderRadius: RatioUtil.width(24),
                    backgroundColor: Colors.BLACK,
                    marginTop: RatioUtil.lengthFixedRatio(30),
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <PretendText
                    style={{
                        color: Colors.WHITE,
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        lineHeight: RatioUtil.font(14) * 1.4,
                    }}
                >
                    확인
                </PretendText>
            </CustomButton>
        </View>
    )
}
