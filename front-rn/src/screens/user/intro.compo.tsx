import { IntroImg } from "assets/images"
import { PretendText } from "components/utils"
import { Colors } from "const"
import React from "react"
import { Image, View } from "react-native"
import { scaleSize } from "styles/minixs"
import { RatioUtil } from "utils"
interface introType {
    id: number
    title: string
    description: string
    image: string
}
const IntroCompo = ({ id, title, description, image }: introType) => {
    return (
        <View
            style={{
                backgroundColor: Colors.WHITE,
                justifyContent: "center",
                width: "100%",
                height: "100%",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    flex: 0.2,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <PretendText
                    style={{
                        textAlign: "center",
                        fontWeight: "800",
                        fontSize: RatioUtil.font(24),
                        color: Colors.BLACK,
                        lineHeight: RatioUtil.font(24) * 1.3,
                        width: RatioUtil.width(300),
                    }}
                >
                    {title}
                </PretendText>
                <PretendText
                    style={{
                        paddingTop: RatioUtil.height(10),
                        textAlign: "center",
                        fontWeight: "400",
                        fontSize: RatioUtil.font(16),
                        lineHeight: RatioUtil.font(16) * 1.3,
                        width: RatioUtil.width(300),
                        color: Colors.GRAY8,
                    }}
                >
                    {description}
                </PretendText>
            </View>
            <View style={{ flex: 0.8 }}>{image}</View>
        </View>
    )
}

export default IntroCompo
