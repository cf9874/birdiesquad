import { jsonSvc, nftSvc } from "apis/services"
import { PretendText } from "components/utils"
import { ImageBackground, StyleSheet, View } from "react-native"
import { ConfigUtil, RatioUtil } from "utils"
import nftGradeJson from "json/nft_grade.json"
import { Colors } from "const"
import FastImage from "react-native-fast-image"

export const NftImage = ({ playerCode, grade, birdie, level }: INftImageProps) => {
    const styles = StyleSheet.create({
        person: {
            width: RatioUtil.lengthFixedRatio(115),
            height: RatioUtil.lengthFixedRatio(165),
            overflow: "visible",
        },
        labelBox: {
            justifyContent: "center",
            alignItems: "center",
            marginTop: RatioUtil.lengthFixedRatio(10),
        },
        detailBox: {
            width: "75%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: RatioUtil.lengthFixedRatio(88),
            alignSelf: "center",
        },
    })

    const player = nftSvc.getNftPlayer(playerCode)
    const background = ConfigUtil.getPlayerImage(nftGradeJson.find(v => v.nID === grade)?.sBackgroundPath)
    const gradation = ConfigUtil.getPlayerImage(nftGradeJson.find(v => v.nID === grade)?.sBackgroundGradationPath)
    return (
        <FastImage source={{ uri: background }} style={styles.person} resizeMode={FastImage.resizeMode.contain}>
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
                                fontSize: RatioUtil.font(12),
                                color: Colors.WHITE,
                                fontWeight: "700",
                                height: RatioUtil.lengthFixedRatio(16),
                                marginTop: RatioUtil.height(5),
                            }}
                        >
                            Lv.{level}
                        </PretendText>
                        <PretendText
                            style={{
                                fontSize: RatioUtil.font(12),
                                fontWeight: "700",
                                color: Colors.WHITE,
                                height: RatioUtil.lengthFixedRatio(23),
                            }}
                        >
                            {player?.sPlayerName}
                        </PretendText>
                    </View>
                    <View style={styles.detailBox}>
                        <PretendText
                            style={[
                                {
                                    fontSize: RatioUtil.font(10),
                                    fontWeight: "bold",
                                    color: Colors.WHITE,
                                },
                            ]}
                        >
                            {jsonSvc.formatLocal(jsonSvc.findLocalById("1035"), [(birdie ?? 0).toString()])}
                        </PretendText>
                        <PretendText
                            style={[
                                {
                                    fontSize: RatioUtil.font(10),
                                    fontWeight: "bold",
                                    color: Colors.WHITE,
                                },
                                // subTextStyle,
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
    playerCode: number
    grade?: number
    level?: number
    birdie?: number
    resizeMode?: "cover" | "contain" | "stretch" | "repeat" | "center"
}
