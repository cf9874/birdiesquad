import { CustomButton, PretendText } from "components/utils"
import { Colors } from "const"
import { useWrapDispatch } from "hooks"
import { Modal, Platform, StatusBar } from "react-native"
import { Image, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { setToast } from "store/reducers/config.reducer"
import { scaleSize } from "styles/minixs"
import { RatioUtil } from "utils"
import { SvgIcon } from "components/Common/SvgIcon"

export interface IToastModalProps {
    message?: string
    message2?: string
    image?: any
}
export const WalletToast = (props: IToastModalProps) => {
    const toastDispatch = useWrapDispatch(setToast)
    const inset = useSafeAreaInsets()

    return (
        <View style={{ flex: 1, height: RatioUtil.width(58) }}>
            <Modal statusBarTranslucent transparent>
                <CustomButton
                    onPress={() => {
                        toastDispatch({ open: false })
                    }}
                    style={{
                        width: RatioUtil.width(360),
                        height: "100%",
                        top: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
                        zIndex: 20,
                    }}
                >
                    <View style={{ alignItems: "center", marginTop: inset.top }}>
                        <View
                            style={{
                                flexDirection: "row",
                                width: RatioUtil.width(340),
                                height: RatioUtil.width(58),
                                borderRadius: RatioUtil.width(10),
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                alignItems: "center",
                            }}
                        >
                            <SvgIcon
                                name={props.image ?? "NftDetailErrorSvg"}
                                style={{
                                    width: RatioUtil.width(22),
                                    height: RatioUtil.width(22),
                                    left: RatioUtil.width(20),
                                    position: "absolute",
                                }}
                            />
                            <View
                                style={{
                                    width: RatioUtil.width(300),
                                    position: "absolute",
                                    left: RatioUtil.width(57),
                                    padding: 0,
                                    paddingRight: RatioUtil.width(20),
                                }}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.WHITE,
                                        fontSize: RatioUtil.font(12.5),
                                        paddingTop: RatioUtil.width(0),
                                        paddingBottom: RatioUtil.width(0),
                                        lineHeight: RatioUtil.width(18),
                                        fontWeight: "400",
                                    }}
                                >
                                    {props.message}
                                </PretendText>
                            </View>
                        </View>
                    </View>
                </CustomButton>
            </Modal>
        </View>
    )
}
