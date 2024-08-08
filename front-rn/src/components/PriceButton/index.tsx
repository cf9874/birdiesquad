import { NFTCardImages, liveImg } from "assets/images"
import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native"
import { styles } from "./styles"
import { PretendText } from "components/utils"
import { RatioUtil } from "utils"
import { Colors } from "const"
import { scaleSize } from "styles/minixs"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { useTimer } from "hooks"
const PriceButton = (props: {
    price: string
    onPress: () => void
    disabled?: boolean | undefined
    showHurry?: boolean | undefined
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => props?.onPress()}
            disabled={props?.disabled || false}
            style={{ 
                width: RatioUtil.width(110),
                height: RatioUtil.lengthFixedRatio(30),
                alignItems: "center",
                flexDirection: "row"
            }}
        >
            {props.showHurry ? (
                <ImageBackground
                    resizeMode="contain"
                    style={{
                        position: "absolute",
                        top: -RatioUtil.lengthFixedRatio(26),
                        left: RatioUtil.width(15),
                        alignItems: "center",
                        width: RatioUtil.width(79),
                        height: RatioUtil.lengthFixedRatio(24),
                    }}
                    source={NFTCardImages.tooltip}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(12),
                            lineHeight: RatioUtil.font(12) * 1.3,
                            fontWeight: "700",
                            color: Colors.WHITE,
                            marginTop: RatioUtil.lengthFixedRatio(2)
                        }}
                    >
                        HURRY UP!
                    </PretendText>
                </ImageBackground>
            ) : null}
            <View style={styles.priceButton}>
                {!props?.disabled ? <Image source={NFTCardImages.priceTag} style={styles.priceTagImage} /> : null}
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(16),
                        fontWeight: "700",
                        color: props?.disabled ? Colors.GRAY12 : Colors.BLACK,
                    }}
                >
                    {props?.price}
                </PretendText>
            </View>
        </TouchableOpacity>
    )
}

export default PriceButton
