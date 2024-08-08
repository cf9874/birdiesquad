import { NFTCardImages } from "assets/images"
import { Colors } from "const"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { styles } from "./styles"

const ActiveButton = (props: any) => {
    return (
        <TouchableOpacity
            disabled={!props?.active}
            activeOpacity={0.4}
            onPress={() => props?.onPress()}
            style={[
                styles.card1InnerView,
                { backgroundColor: props?.active ? Colors.BLACK : Colors.GRAY, ...props?.style },
            ]}
        >
            <Text
                style={[
                    styles.btnText,
                    {
                        color: props?.active ? Colors.WHITE : Colors.GRAY12,
                    },
                ]}
            >
                {props?.title}
            </Text>
        </TouchableOpacity>
    )
}

export default ActiveButton
