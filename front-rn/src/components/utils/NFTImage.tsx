import {
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    Image,
    ImageBackground,
    TextStyle,
    Text,
    TouchableOpacity,
} from "react-native"
import { ConfigUtil, RatioUtil } from "utils"
import nftGradeJson from "json/nft_grade.json"
import nftPlayer from "json/nft_player.json"
import { NftApiData } from "apis/data"
import dayjs from "dayjs"
import { PretendText } from "./PretendText"
import { Colors, NftSortKey } from "const"
import { jsonSvc, nftSvc } from "apis/services"
import { log } from "console"
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
    checkImg,
    isChecked,
    onCheckboxChange,
}: INftImageProps) => {
    const styles = StyleSheet.create({
        person: {
            ...RatioUtil.sizeFixedRatio(155, 220),
            overflow: "visible",
        },
        labelBox: {
            justifyContent: "center",
            alignItems: "center",
            marginTop: style ? RatioUtil.lengthFixedRatio(22) : RatioUtil.lengthFixedRatio(13),
        },
        detailBox: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: style ? RatioUtil.lengthFixedRatio(180) : RatioUtil.lengthFixedRatio(138),
            alignSelf: "center",
            width: "76%",
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
                                fontSize: RatioUtil.font(14),
                                color: Colors.WHITE,
                                fontWeight: "700",
                                height: RatioUtil.lengthFixedRatio(18),
                                ...levelTextStyle,
                            }}
                        >
                            Lv.{level}
                        </PretendText>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(18),
                                fontWeight: "700",
                                color: Colors.WHITE,
                                height: RatioUtil.lengthFixedRatio(23),
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
                                ? // ? `ENERGY ${energy}`
                                  jsonSvc.formatLocal(jsonSvc.findLocalById("1038"), [(energy ?? 0).toString()])
                                : // : `BIRDIE ${birdie}`}
                                  jsonSvc.formatLocal(jsonSvc.findLocalById("1035"), [(birdie ?? 0).toString()])}
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
