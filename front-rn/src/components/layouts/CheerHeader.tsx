import { SvgIcon } from "components/Common/SvgIcon"
import { CustomButton, PretendText } from "components/utils"
import { Screen } from "const"
import { View } from "react-native"
import { Image } from "react-native"
import { RatioUtil, navigate } from "utils"

export const CheerHeader = () => {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginRight: RatioUtil.width(10),
                marginLeft: RatioUtil.width(10),
            }}
        >
            <View>
                <CustomButton
                    style={{
                        ...RatioUtil.size(8, 16),
                        alignItems: "center",
                        justifyContent: "center",
                        left: RatioUtil.width(32),
                        margin: 0,
                        padding: 0,
                        position: "absolute",
                    }}
                    onPress={() => navigate(Screen.BACK)}
                >
                    {/* <Image source={mainHeaderImg.back["1x"]} /> */}
                    <SvgIcon name="BackSvg" />
                </CustomButton>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <View>
                    <PretendText>선수롤링 </PretendText>
                </View>
                <PretendText> 검색</PretendText>
            </View>
        </View>
    )
}
