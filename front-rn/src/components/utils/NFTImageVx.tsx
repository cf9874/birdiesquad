import { StyleSheet, View, ViewStyle, ImageBackground, TextStyle } from "react-native"
import { ConfigUtil, RatioUtil } from "utils"
import nftGradeJson from "json/nft_grade.json"
import { PretendText } from "./PretendText"
import { Colors, NftSortKey, Screen } from "const"
import { jsonSvc, nftSvc } from "apis/services"
import { useRoute } from "@react-navigation/native"
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
}: INftImageProps) => {
    const route = useRoute()
    const styles = StyleSheet.create({
        person: {
            ...RatioUtil.sizeFixedRatio(155, 220),
            overflow: "visible",
        },
        labelBox: {
            justifyContent: "center",
            alignItems: "center",
            marginTop: tempo
                ? RatioUtil.lengthFixedRatio(10)
                : style
                ? route.name === Screen.NFTADVANCEMENT
                    ? RatioUtil.lengthFixedRatio(8)
                    : RatioUtil.lengthFixedRatio(22)
                : RatioUtil.lengthFixedRatio(13),
        },
        detailBox: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: tempo
                ? RatioUtil.lengthFixedRatio(102)
                : style
                ? route.name === Screen.NFTADVANCEMENT
                    ? 0
                    : RatioUtil.lengthFixedRatio(187)
                : RatioUtil.lengthFixedRatio(138),
            alignSelf: "center",
            width: route.name === Screen.NFTADVANCEMENT ? "81%" : "66%",
            bottom: route.name === Screen.NFTADVANCEMENT ? RatioUtil.lengthFixedRatio(10) : "",
            position: route.name === Screen.NFTADVANCEMENT ? "absolute" : "relative",
        },
        checkBox: {
            top: RatioUtil.height(-60),
            left: RatioUtil.width(90),
        },
    })

    const player = nftSvc.getNftPlayer(playerCode)
    const background = ConfigUtil.getPlayerImage(nftGradeJson.find(v => v.nID === grade)?.sBackgroundPath)
    const gradation = ConfigUtil.getPlayerImage(nftGradeJson.find(v => v.nID === grade)?.sBackgroundGradationPath)

    return (
        <FastImage
            source={{ uri: background }}
            resizeMode={FastImage.resizeMode.contain}
            style={{
                // width: RatioUtil.width(155),
                // height: RatioUtil.height(200),
                ...style,
            }}
        >
            <FastImage
                source={{ uri: ConfigUtil.getPlayerImage(player?.sPlayerImagePath) }}
                style={style ? style : styles.person}
                resizeMode={FastImage.resizeMode.contain}
            >
                <FastImage
                    source={{
                        uri: gradation,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={style ? style : styles.person}
                >
                    <View style={styles.labelBox}>
                        <PretendText
                            style={{
                                fontSize:
                                    route.name === Screen.NFTADVANCEMENT ? RatioUtil.font(11) : RatioUtil.font(14),
                                color: Colors.WHITE,
                                fontWeight: "700",
                                height: route.name === Screen.NFTADVANCEMENT ? "auto" : RatioUtil.lengthFixedRatio(14),
                                ...levelTextStyle,
                            }}
                        >
                            Lv.{level}
                        </PretendText>
                        <PretendText
                            style={{
                                fontSize: tempo
                                    ? RatioUtil.font(14)
                                    : route.name === Screen.NFTADVANCEMENT
                                    ? RatioUtil.font(13)
                                    : RatioUtil.font(18),
                                fontWeight: "700",
                                color: Colors.WHITE,
                                height: RatioUtil.lengthFixedRatio(17),
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
                                    fontSize:
                                        route.name === Screen.NFTADVANCEMENT ? RatioUtil.font(9) : RatioUtil.font(12),
                                    fontWeight: "700",
                                    color: Colors.WHITE,
                                    ...subTextStyle,
                                },
                            ]}
                        >
                            {sortKey && nftSvc.listSortByProperty(sortKey) === "energy"
                                ? jsonSvc.formatLocal(jsonSvc.findLocalById("1038"), [(energy ?? 0).toString()])
                                : birdie
                                ? jsonSvc.formatLocal(jsonSvc.findLocalById("1035"), [(birdie ?? 0).toString()])
                                : jsonSvc.formatLocal(jsonSvc.findLocalById("1035"), [("" ?? 0).toString()])}
                        </PretendText>
                        <PretendText
                            style={[
                                {
                                    fontSize:
                                        route.name === Screen.NFTADVANCEMENT ? RatioUtil.font(9) : RatioUtil.font(12),
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
}
export default NftImage
