import { jsonSvc } from "apis/services"
import { liveImg, NFTCardImages } from "assets/images"
import { Colors } from "const"
import { useEffect, useRef, useState } from "react"
import { Animated, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import CircularProgress from "react-native-circular-progress-indicator"
import { setIsFirst } from "store/reducers/sign.reducer"
import { scaleSize } from "styles/minixs"
import { RatioUtil } from "utils"

export interface ProgressBarProps {
    onChangeStatus: () => void
    onUnlocked: () => void
    onPress: () => void
    onAnimationStart: () => void
    onChangeFirst: (isFirst: boolean) => void
    isEnd?: boolean
    isFirst?: boolean
}

const ProgressBar: React.FC<ProgressBarProps> = ({ ...props }) => {
    const [isPress, setisPress] = useState<boolean>(false)
    const [locked, setLocked] = useState<boolean>(true)
    const [isFirstClick, setIsFirstClick] = useState<boolean>(false)

    const countTime = () => {
        let dataTime = jsonSvc.findConstById(21006).dDoubleValue * 1000
        return dataTime
    }

    useEffect(() => {
        if (props.isEnd) {
            setisPress(false)
        }
    }, [props.isEnd])

    const handlePress = () => {
        if (isPress) {
            props?.onPress()
        }
    }
    const handleLongPress = () => {
        if (!isPress) {
            setisPress(true)
            setIsFirstClick(true)
        } else if (isPress && props.isFirst) {
            setIsFirstClick(false)
            setisPress(false)
        }
    }
    const handlePressOut = () => {
        locked ? (setisPress(false), setIsFirstClick(false)) : (setisPress(true), setIsFirstClick(true))
    }
    const handleAnimationComplete = () => {
        props.onChangeFirst(isFirstClick)
        isPress && isFirstClick
            ? (setLocked(false), props?.onChangeStatus(), props?.onUnlocked())
            : setLocked(true)
    }

    return (
        <TouchableOpacity
            disabled={props.isEnd}
            activeOpacity={0.9}
            onPress={handlePress}
            onLongPress={handleLongPress}
            onPressOut={handlePressOut}
        >
            <CircularProgress
                value={isPress && isFirstClick ? 100 : 0}
                radius={scaleSize(25)}
                // duration={isPress ? 3000 : 1000}
                duration={countTime()}
                progressValueColor={"#ecf0f1"}
                maxValue={100}
                onAnimationComplete={handleAnimationComplete}
                activeStrokeColor={Colors.PURPLE}
                activeStrokeSecondaryColor={Colors.PURPLE4}
            />
            <View style={styles.progressBarHeartView}>
                <Image source={liveImg.heartImg} style={styles.progressBarHeart} resizeMode="contain" />
            </View>
        </TouchableOpacity>
    )
}
export default ProgressBar

const styles = StyleSheet.create({
    progressBarHeart: {
        position: "absolute",
        alignSelf: "center",
        borderRadius: 100,
        ...RatioUtil.size(25, 25),
        bottom: "13%",
    },
    progressBarHeartView: {
        backgroundColor: Colors.WHITE,
        borderRadius: 100,
        position: "absolute",
        ...RatioUtil.size(35, 35),
        alignSelf: "center",
        bottom: "12%",
    },
    onTapImageView: {
        height: scaleSize(40),
        width: scaleSize(40),
        // backgroundColor: 'orange',
        position: "absolute",
        zIndex: 9999,
        elevation: 9999,
        // alignSelf :'flex-end',
        // bottom: scaleSize(85),
        // right: '5%',
        // alignSelf: 'flex-end',
    },
})
