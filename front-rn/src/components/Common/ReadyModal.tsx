import { CustomButton, PretendText } from "components/utils"
import { Colors } from "const"
import { useWrapDispatch } from "hooks"
import React from "react"
import { View } from "react-native"
import { setModal } from "store/reducers/config.reducer"
import { RatioUtil } from "utils"
import { jsonSvc } from "apis/services"

export const ReadyModal = () => {
    const modalDispatch = useWrapDispatch(setModal)
    // const time = 1500

    // useEffect(() => {
    //     setTimeout(() => {
    //         modalDispatch({ open: false })
    //     }, time)
    // }, [])

    return (
        <View
            style={{
                backgroundColor: Colors.WHITE,
                borderRadius: RatioUtil.width(16),
                alignSelf: "center",
                alignItems: "center",
                width: RatioUtil.width(272),
                height: RatioUtil.height(150),
                paddingHorizontal: RatioUtil.width(20),
                paddingTop: RatioUtil.width(20),
                paddingBottom: RatioUtil.width(30),
            }}
        >
            <View
                style={{
                    padding: RatioUtil.width(10),
                    marginBottom: RatioUtil.height(20),
                }}
            >
                <PretendText
                    style={{
                        color: Colors.BLACK2,
                        fontSize: RatioUtil.font(18),
                        fontWeight: RatioUtil.fontWeightBold(),
                        textAlign: "center",
                    }}
                >
                    {/* COMING SOON */}
                    {jsonSvc.findLocalById("10000002")}
                </PretendText>
            </View>
            <CustomButton
                onPress={() => {
                    modalDispatch({ open: false })
                }}
                style={{
                    width: RatioUtil.width(232),
                    height: RatioUtil.height(48),
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
                    {jsonSvc.findLocalById("1012")}
                </PretendText>
            </CustomButton>
        </View>
    )
}
