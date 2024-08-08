import { errorModalImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { Colors } from "const"
import { useWrapDispatch } from "hooks"
import React from "react"
import { Image, View } from "react-native"
import { setModal } from "store/reducers/config.reducer"
import { RatioUtil } from "utils"
import { jsonSvc } from "apis/services"
import { errorModalStyle } from "styles"

export const ErrorModal = (props: { msg?: string; onPress?: () => void }) => {
    const modalDispatch = useWrapDispatch(setModal)

    return (
        <View
            style={{
                backgroundColor: Colors.WHITE,
                alignSelf: "center",
                alignItems: "center",
                ...RatioUtil.borderRadius(16),
            }}
        >
            <Image
                source={errorModalImg.error}
                style={{
                    ...RatioUtil.marginFixedRatio(30, 0, 20, 0),
                }}
            ></Image>
            <PretendText
                style={{
                    ...RatioUtil.marginFixedRatio(0, 20, 0, 20),
                    fontSize: RatioUtil.font(14),
                    fontWeight: "400",
                    lineHeight: RatioUtil.font(14) * 1.4,
                    textAlign: "center",
                    color: Colors.BLACK,
                }}
            >
                {props.msg ? props.msg : "앗, 일시적인 문제가 생겼어요.\n잠시 후 다시 확인해 주시겠어요?"}
            </PretendText>
            <CustomButton
                onPress={() => {
                    modalDispatch({ open: false })
                    props.onPress && props.onPress()
                }}
                style={{
                    ...RatioUtil.sizeFixedRatio(232, 48),
                    ...RatioUtil.borderRadius(24),
                    ...RatioUtil.marginFixedRatio(20, 20, 20, 20),
                    backgroundColor: Colors.BLACK,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <PretendText
                    style={{
                        color: Colors.WHITE,
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        lineHeight: RatioUtil.font(14) * 1.3,
                    }}
                >
                    {jsonSvc.findLocalById("10010000")}
                </PretendText>
            </CustomButton>
        </View>
    )
}


export const ErrorTitleModal = (props: { title?: string, msg?: string; onPress?: () => void }) => {
    const modalDispatch = useWrapDispatch(setModal)

    return (
        <View
            style={{
                backgroundColor: Colors.WHITE,
                alignSelf: "center",
                alignItems: "center",
                ...RatioUtil.borderRadius(16),
            }}
        >
            <Image
                source={errorModalImg.error}
                style={{
                    ...RatioUtil.marginFixedRatio(30, 0, 10, 0),
                }}
            ></Image>
            {props.title && (
                <PretendText
                    style={{
                        ...RatioUtil.margin(0, 20, 10, 20),
                        fontSize: RatioUtil.font(16),
                        fontWeight: RatioUtil.fontWeightBold(),
                        lineHeight: RatioUtil.font(16) * 1.4,
                        textAlign: "center",
                        color: Colors.BLACK,
                    }}
                >
                    {props.title}
                </PretendText>
            )}
            <PretendText
                style={{
                    ...RatioUtil.marginFixedRatio(0, 20, 20, 20),
                    fontSize: RatioUtil.font(14),
                    fontWeight: "400",
                    lineHeight: RatioUtil.font(14) * 1.4,
                    textAlign: "center",
                    color: Colors.BLACK3,
                }}
            >
                {props.msg ? props.msg : "앗, 일시적인 문제가 생겼어요.\n잠시 후 다시 확인해 주시겠어요?"}
            </PretendText>
            <CustomButton
                onPress={() => {
                    modalDispatch({ open: false })
                    props.onPress && props.onPress()
                }}
                style={{
                    ...RatioUtil.sizeFixedRatio(232, 48),
                    ...RatioUtil.borderRadius(24),
                    ...RatioUtil.marginFixedRatio(0, 20, 20, 20),
                    // marginBottom: RatioUtil.height(10),
                    backgroundColor: Colors.BLACK,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <PretendText
                    style={{
                        color: Colors.WHITE,
                        fontSize: RatioUtil.font(14),
                        fontWeight: RatioUtil.fontWeightBold(),
                        lineHeight: RatioUtil.font(14) * 1.3,
                    }}
                >
                    {jsonSvc.findLocalById("10010000")}
                </PretendText>
            </CustomButton>
        </View>
    )
}


export const ErrorTitleConfirmCancelModal = (props: { title?: string, msg?: string; onPress?: () => void|Promise<void> }) => {
    const modalDispatch = useWrapDispatch(setModal)

    const onClose = () => {
        modalDispatch({
            open: false,
        })
    }
    return (
        <View
            style={errorModalStyle.cancelConfirm.base}
        >
            <Image
                source={errorModalImg.error}
                style={{
                    ...RatioUtil.marginFixedRatio(30, 0, 10, 0),
                }}
            ></Image>
            {props.title && (
                <PretendText
                    style={errorModalStyle.cancelConfirm.titleText}
                >
                    {props.title}
                </PretendText>
            )}
            <PretendText
                style={errorModalStyle.cancelConfirm.titleContext}
            >
                {props.msg ? props.msg : "앗, 일시적인 문제가 생겼어요.\n잠시 후 다시 확인해 주시겠어요?"}
            </PretendText>
            <View style={errorModalStyle.cancelConfirm.buttonArea}>
                <CustomButton onPress={onClose}
                    style={{...errorModalStyle.cancelConfirm.button, ...errorModalStyle.cancelConfirm.cancelButton}}
                >
                    <PretendText style={{...errorModalStyle.cancelConfirm.buttonTextFont, }}>
                        {/* 취소 */}
                        {jsonSvc.findLocalById("1021")}
                    </PretendText>
                </CustomButton>

                <CustomButton
                    onPress={() => {
                        modalDispatch({ open: false })
                        props.onPress && props.onPress()
                    }}
                    style={{...errorModalStyle.cancelConfirm.button, ...errorModalStyle.cancelConfirm.confirmButton}}
                >
                    <PretendText
                        style={{...errorModalStyle.cancelConfirm.buttonTextFont, ...errorModalStyle.cancelConfirm.confirmTextColor}}
                    >
                        {jsonSvc.findLocalById("10010000")}
                    </PretendText>
                </CustomButton>
            </View>
        </View>
    )
}