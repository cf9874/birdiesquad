import { StyleSheet, View, ViewStyle, Image, ImageBackground, TextStyle } from "react-native"
import { ConfigUtil, RatioUtil } from "utils"
import { PretendText } from "./PretendText"
import { Colors, NftSortKey } from "const"
import { nftSvc } from "apis/services"
import { MySquadImg } from "assets/images"
import { CheckBox } from "components/Checkbox"
import { liveCompoStyle } from "styles"
import FastImage from "react-native-fast-image"

const NftImage = ({
    style,
    playerCode,
    grade,
    level,
    birdie,
    energy,
    sortKey,
    levelTextStyle,
    nameTextStyle,
    subTextStyle,
    tempo,
    checkImg,
    isChecked,
    onCheckboxChange,
    background,
}: INftImageProps) => {
    const styles = StyleSheet.create({
        person: {
            ...RatioUtil.size(155, 200),
            overflow: "visible",
        },
        labelBox: {
            justifyContent: "center",
            alignItems: "center",
            marginTop: RatioUtil.height(15),
        },
        detailBox: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: RatioUtil.lengthFixedRatio(190),
            alignSelf: "center",
            width: "75%",
            position: "absolute",
        },
        checkBox: {
            position: "absolute",
            top: RatioUtil.height(4),
            right: RatioUtil.lengthFixedRatio(0),
            zIndex: 9999,
        },
    })

    const player = nftSvc.getNftPlayer(playerCode)

    const toggleCheckbox = () => {
        const newValue = !isChecked
        onCheckboxChange(newValue)
    }

    return (
        <FastImage
            source={{ uri: background }}
            resizeMode={FastImage.resizeMode.cover}
            style={{
                width: "100%",
                padding: 0,
                alignSelf: "flex-start",
                ...style,
                position: "relative",
            }}
            imageStyle={{
                resizeMode: "contain",
                alignSelf: "flex-start",
            }}
        >
            <View style={styles.checkBox}>
                {checkImg === true && (
                    <CheckBox
                        onCheck={toggleCheckbox}
                        ischeck={isChecked}
                        unCheckedView={<Image source={MySquadImg.uncheck} style={RatioUtil.size(20, 20)} />}
                        checkedView={<Image source={MySquadImg.check} style={RatioUtil.size(20, 20)} />}
                        style={liveCompoStyle.confirm.checkBox}
                    />
                )}
            </View>
            <FastImage
                source={{ uri: ConfigUtil.getPlayerImage(player?.sPlayerImagePath) }}
                style={style ? style : styles.person}
                resizeMode={FastImage.resizeMode.contain}
            >
                <View style={styles.labelBox}>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(14),
                            color: Colors.WHITE,
                            fontWeight: "700",
                            ...levelTextStyle,
                        }}
                    >
                        Lv.{level}
                    </PretendText>
                    <PretendText
                        style={{
                            fontSize: tempo ? RatioUtil.font(14) : RatioUtil.font(18),
                            fontWeight: "700",
                            color: Colors.WHITE,
                            ...nameTextStyle,
                        }}
                    >
                        {player?.sPlayerName}
                    </PretendText>
                </View>
                <View style={styles.detailBox}>
                    <PretendText
                        style={[
                            {
                                fontSize: RatioUtil.font(12),
                                fontWeight: "bold",
                                color: Colors.WHITE,
                                ...subTextStyle,
                            },
                        ]}
                    >
                        {sortKey && nftSvc.listSortByProperty(sortKey) === "energy"
                            ? `Energy ${energy}`
                            : `Birdie ${birdie}`}
                    </PretendText>
                    <PretendText
                        style={[
                            {
                                fontSize: RatioUtil.font(12),
                                fontWeight: "bold",
                                color: Colors.WHITE,
                            },
                            subTextStyle,
                        ]}
                    >
                        {player?.nSeasonKey}
                    </PretendText>
                </View>
            </FastImage>
        </FastImage>
    )
}

interface INftImageProps {
    style?: ViewStyle
    isShadow?: boolean
    playerCode: number
    grade?: number
    level?: number
    birdie?: number
    energy?: number
    tempo?: boolean
    levelTextStyle?: TextStyle
    nameTextStyle?: TextStyle
    subTextStyle?: TextStyle
    sortKey?: NftSortKey
    resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center"
    checkImg?: boolean
    isChecked?: boolean
    onCheckboxChange?: any
    background: string
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },
    labelBox: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    labelContainer: {
        flex: 1,
    },
    checkboxButton: {
        marginLeft: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxImage: {
        width: 24,
        height: 24,
    },
})
export default NftImage
