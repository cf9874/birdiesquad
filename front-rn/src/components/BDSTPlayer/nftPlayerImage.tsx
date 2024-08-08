import { StyleProp, StyleSheet, View, ViewStyle, Image, ImageBackground, TextStyle, Text } from "react-native"
import { ConfigUtil, RatioUtil } from "utils"
import nftGradeJson from "json/nft_grade.json"
import nftPlayer from "json/nft_player.json"
import { NftApiData } from "apis/data"
import dayjs from "dayjs"
import { Colors, NftSortKey } from "const"
import { jsonSvc, nftSvc } from "apis/services"
import { PretendText } from "components/utils"
import FastImage from "react-native-fast-image"

const NftPlayerImage = ({ playerCode, grade, birdie }: INftImageProps) => {
    const styles = StyleSheet.create({
        labelBox: {
            justifyContent: "center",
            alignItems: "center",
            marginTop: RatioUtil.height(10),
        },
        detailBox: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: RatioUtil.height(75),
            alignSelf: "center",
            width: "85%",
        },
    })

    const player = nftSvc.getNftPlayer(playerCode)
    const background = ConfigUtil.getPlayerImage(nftGradeJson.find(v => v.nID === grade)?.sBackgroundPath)

    return (
        <FastImage
            source={{ uri: background }}
            resizeMode={FastImage.resizeMode.contain}
            style={{
                width: RatioUtil.width(90),
                height: RatioUtil.height(115),
            }}
        >
            <FastImage
                source={{ uri: ConfigUtil.getPlayerImage(player?.sPlayerImagePath) }}
                style={{ width: RatioUtil.width(85), height: RatioUtil.height(115), overflow: "visible" }}
                resizeMode={FastImage.resizeMode.contain}
            >
                <View style={styles.labelBox}>
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(11),
                            fontWeight: "700",
                            color: Colors.WHITE,
                        }}
                    >
                        {player?.sPlayerName}
                    </PretendText>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <View style={styles.detailBox}>
                        <PretendText
                            style={[
                                {
                                    fontSize: RatioUtil.font(9),
                                    fontWeight: "bold",
                                    color: Colors.WHITE,
                                },
                            ]}
                        >
                            {/* BIRDIE {birdie} */}
                            {jsonSvc.formatLocal(jsonSvc.findLocalById("1035"), [(birdie ?? 0).toString()])}
                        </PretendText>
                        <PretendText
                            style={[
                                {
                                    fontSize: RatioUtil.font(9),
                                    fontWeight: "bold",
                                    color: Colors.WHITE,
                                },
                            ]}
                        >
                            {player?.nSeasonKey}
                        </PretendText>
                    </View>
                </View>
            </FastImage>
        </FastImage>
    )
}

interface INftImageProps {
    playerCode: number
    grade?: number
    birdie?: number
}
export default NftPlayerImage
