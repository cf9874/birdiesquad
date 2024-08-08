import {
    StyleSheet,
    View,
} from "react-native"
import { ConfigUtil, RatioUtil } from "utils"
import nftGradeJson from "json/nft_grade.json"
import { PretendText } from "./PretendText"
import { Colors, NftSortKey } from "const"
import { jsonSvc, nftSvc } from "apis/services"
import FastImage from "react-native-fast-image"

const NftImageScale = ({
    playerCode,
    width,
    grade,
    level,
    birdie,
    energy,
    sortKey,
}: INftImageScaleProps) => {
    const scale = width / RatioUtil.width(155)

    const styles = StyleSheet.create({
        person: {
            ...RatioUtil.sizeFixedRatio(155 * scale, 220 * scale),
            overflow: "visible",
        },
        labelBox: {
            justifyContent: "center",
            alignItems: "center",
            marginTop: RatioUtil.lengthFixedRatio(13) * scale,
        },
        detailBox: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: RatioUtil.lengthFixedRatio(138) * scale,
            alignSelf: "center",
            width: "76%",
        },
        checkBox: {
            top: RatioUtil.height(-60) * scale,
            left: RatioUtil.width(90) * scale,
        },
    })

    const player = nftSvc.getNftPlayer(playerCode)
    const background = ConfigUtil.getPlayerImage(nftGradeJson.find(v => v.nID === grade)?.sBackgroundPath)
    const gradation = ConfigUtil.getPlayerImage(nftGradeJson.find(v => v.nID === grade)?.sBackgroundGradationPath)

    console.log('styles.person: ' + JSON.stringify(styles.person))

    return (
        <FastImage
            source={{ uri: background }}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.person}
        >
            <FastImage
                source={{ uri: ConfigUtil.getPlayerImage(player?.sPlayerImagePath) }}
                style={styles.person}
                resizeMode={FastImage.resizeMode.contain}
            >
                <FastImage
                    source={{
                        uri: gradation,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                    style={styles.person}
                >
                    <View style={styles.labelBox}>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(14) * scale,
                                color: Colors.WHITE,
                                fontWeight: RatioUtil.fontWeightBold(),
                                height: RatioUtil.lengthFixedRatio(18) * scale,
                            }}
                        >
                            Lv.{level}
                        </PretendText>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(18) * scale,
                                fontWeight: RatioUtil.fontWeightBold(),
                                color: Colors.WHITE,
                                height: RatioUtil.lengthFixedRatio(23) * scale,
                            }}
                        >
                            {player?.sPlayerName}
                        </PretendText>
                    </View>
                    <View style={styles.detailBox}>
                        <PretendText
                            style={[
                                {
                                    fontSize: RatioUtil.font(12) * scale,
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.WHITE,
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
                            style={{
                                    fontSize: RatioUtil.font(12) * scale,
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.WHITE,
                                }}
                        >
                            {player?.nSeasonKey}
                        </PretendText>
                    </View>
                </FastImage>
            </FastImage>
        </FastImage>
    )
}

interface INftImageScaleProps {
    playerCode: number
    width: number
    grade?: number
    level?: number
    birdie?: number
    energy?: number
    sortKey?: NftSortKey
}

export default NftImageScale
