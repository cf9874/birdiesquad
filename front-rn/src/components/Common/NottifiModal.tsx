import { PretendText } from "components/utils"
import { Colors } from "const"
import React from "react"
import { View } from "react-native"
import { RatioUtil } from "utils"

type Props = {
    title?: string
    description: string
}

export const NotifiModal = ({ description, title }: Props) => {
    return (
        <View
            style={{
                backgroundColor: Colors.WHITE,
                borderRadius: RatioUtil.width(16),
                alignSelf: "center",
                alignItems: "center",
                width: RatioUtil.width(272),
                height: RatioUtil.height(127),
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
                        fontSize: RatioUtil.font(16),
                        fontWeight: "600",
                        textAlign: "center",
                        height: RatioUtil.height(50),
                    }}
                >
                    {title}
                </PretendText>
                <PretendText
                    style={{
                        color: Colors.GRAY8,
                        fontSize: RatioUtil.font(14),
                        fontWeight: "400",
                        textAlign: "center",
                        height: RatioUtil.height(50),
                        marginTop: 10,
                    }}
                >
                    {description}
                </PretendText>
            </View>
        </View>
    )
}
