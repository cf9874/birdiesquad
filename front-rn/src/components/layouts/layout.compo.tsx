import { jsonSvc, profileSvc } from "apis/services"
import { profileHeaderImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { Colors } from "const"
import { useWrapDispatch } from "hooks"
import { useEffect, useState } from "react"
import { Image, View, ViewStyle, InteractionManager } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { LayoutCompoStyle, LayoutStyle } from "styles/layout.style"
import { NumberUtil, RatioUtil } from "utils"

const Menu = ({ img, text, style, superscript }: { img: any; text: string; style?: ViewStyle; superscript?: any }) => {
    // 기획반영- 버림처리 코드변경
    // const point = Number(text) > 99999999 ? "99,999,999" : NumberUtil.denoteComma(parseFloat(Number(text).toFixed(0)))
    const point = Number(text) > 99999999 ? "99,999,999" : NumberUtil.denoteComma(Math.floor(Number(text)))
    return (
        <View style={{ ...LayoutStyle.menu.con, ...style }}>
            <Image style={LayoutStyle.menu.icon} source={img} />
            <PretendText style={LayoutStyle.menu.text}>{point}</PretendText>
            <PretendText style={LayoutStyle.menu.Superscript}>{superscript}</PretendText>
        </View>
    )
}

const ReportPopUp = ({
    userSeq,
    setToggle,
}: {
    userSeq: number
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const modalDispatch = useWrapDispatch(setModal)
    const popUpDispatch = useWrapDispatch(setPopUp)

    const [isBlame, setIsBlame] = useState<boolean>(false)

    useEffect(() => {
        if (isBlame == false) return

        const interactionPromise = InteractionManager.runAfterInteractions(() => {
            modalDispatch({
                open: true,
                children: (
                    <View
                        style={{
                            backgroundColor: Colors.WHITE,
                            ...RatioUtil.borderRadius(16),
                            alignSelf: "center",
                            alignItems: "center",
                            ...RatioUtil.sizeFixedRatio(272, 220),
                            ...RatioUtil.paddingFixedRatio(30, 20, 20, 20),
                        }}
                    >
                        <View
                            style={{
                                width: RatioUtil.width(50),
                                height: RatioUtil.width(50),
                                borderRadius: RatioUtil.width(25),
                                backgroundColor: Colors.GRAY7,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Image source={profileHeaderImg.check} />
                        </View>
                        <View
                            style={{
                                marginTop: RatioUtil.lengthFixedRatio(20),
                                marginBottom: RatioUtil.lengthFixedRatio(30),
                            }}
                        >
                            <PretendText
                                style={{
                                    color: Colors.BLACK3,
                                    fontSize: RatioUtil.font(16),
                                    fontWeight: "400",
                                    lineHeight: RatioUtil.font(16) * 1.4,
                                }}
                            >
                                {/* 신고 접수가 완료되었습니다. */}
                                {jsonSvc.findLocalById("10000033")}
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
                                {/* 확인 */}
                                {jsonSvc.findLocalById("10010000")}
                            </PretendText>
                        </CustomButton>
                    </View>
                ),
            })
        })

        return () => interactionPromise.cancel()
    }, [isBlame])

    const onBlame = async (userSeq: number) => {
        const data = await profileSvc.Blame(userSeq)
        const isSuccess = !!data.USER_SEQ
        popUpDispatch({ open: false })

        if (isSuccess) {
            setIsBlame(true)
            setToggle(state => !state)
        }
    }

    const insets = useSafeAreaInsets()

    return (
        <View
            style={{
                position: "absolute",
                bottom: 0,
                backgroundColor: Colors.WHITE,
                borderTopRightRadius: RatioUtil.width(16),
                borderTopLeftRadius: RatioUtil.width(16),
                width: RatioUtil.lengthFixedRatio(360),
                alignSelf: "center",
                alignItems: "center",
                paddingTop: RatioUtil.lengthFixedRatio(30),
                paddingHorizontal: RatioUtil.lengthFixedRatio(20),
                paddingBottom: Math.max(RatioUtil.lengthFixedRatio(30), insets.bottom),
            }}
        >
            <View
                style={{
                    width: RatioUtil.width(50),
                    height: RatioUtil.width(50),
                    borderRadius: RatioUtil.width(25),
                    backgroundColor: Colors.GRAY7,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image source={profileHeaderImg.report} />
            </View>
            <PretendText
                style={{
                    color: Colors.BLACK,
                    fontSize: RatioUtil.font(18),
                    fontWeight: RatioUtil.fontWeightBold(),
                    lineHeight: RatioUtil.font(18) * 1.35,
                    textAlign: "center",
                    marginTop: RatioUtil.lengthFixedRatio(20),
                }}
            >
                {/* {"이 계정을 신고 하겠습니까?\n운영자 검토 후 처리하도록 하겠습니다."} */}
                {jsonSvc.findLocalById("171036")}
            </PretendText>
            <PretendText
                style={{
                    color: Colors.GRAY8,
                    fontSize: RatioUtil.font(14),
                    fontWeight: "400",
                    textAlign: "center",
                    marginTop: RatioUtil.lengthFixedRatio(10),
                }}
            >
                {/* {"허위 신고 시 불이익을 당할 수 있으니\n신중하게 신고를 접수해주시기 바랍니다."} */}
                {jsonSvc.findLocalById("171037")}
            </PretendText>
            <View
                style={{
                    width: RatioUtil.width(320),
                    flexDirection: "row",
                    marginTop: RatioUtil.lengthFixedRatio(30),
                    justifyContent: "space-between",
                }}
            >
                <CustomButton
                    onPress={() => {
                        popUpDispatch({ open: false })
                    }}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: RatioUtil.width(157),
                        height: RatioUtil.lengthFixedRatio(48),
                        borderRadius: RatioUtil.width(24),
                        backgroundColor: Colors.GRAY7,
                        borderWidth: 1,
                        borderColor: Colors.GRAY9,
                    }}
                >
                    <PretendText
                        style={{
                            color: Colors.BLACK2,
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            lineHeight: RatioUtil.font(14) * 1.4,
                            textAlign: "center",
                        }}
                    >
                        {/* 취소 */}
                        {jsonSvc.findLocalById("1021")}
                    </PretendText>
                </CustomButton>
                <CustomButton
                    onPress={() => onBlame(userSeq)}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: RatioUtil.width(157),
                        height: RatioUtil.lengthFixedRatio(48),
                        borderRadius: RatioUtil.width(24),
                        backgroundColor: Colors.RED2,
                    }}
                >
                    <PretendText
                        style={{
                            color: Colors.WHITE,
                            fontSize: RatioUtil.font(14),
                            fontWeight: RatioUtil.fontWeightBold(),
                            lineHeight: RatioUtil.font(14) * 1.4,
                            textAlign: "center",
                        }}
                    >
                        {/* 신고하기 */}
                        {jsonSvc.findLocalById("130005")}
                    </PretendText>
                </CustomButton>
            </View>
        </View>
    )
}
export const MainHeaderCompo = {
    Menu,
}
export const ProfileHeaderCompo = {
    ReportPopUp,
}
