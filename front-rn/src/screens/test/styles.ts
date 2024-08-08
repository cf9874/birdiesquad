import { Platform, Dimensions, StyleSheet } from "react-native";
import { Colors } from "const";
import { RatioUtil } from "utils";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
	mainView: {
        flex: 1,
        // backgroundColor: Colors.BLACK4
    },
    tvPlayerView: {
        height: RatioUtil.width(300),
        width: width,
        backgroundColor: Colors.BLACK3,
    }
});