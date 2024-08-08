import { View, Text, Image } from "react-native"
import React, { useEffect, useState } from "react"
import { useQuery } from "hooks"
import { liveSvc } from "apis/services/live.svc"
import axios from "axios"
import { PretendText } from "components/utils"
import { RatioUtil, TextUtil } from "utils"
import { ScrollView } from "react-native-gesture-handler"
import { IParticipants, ISeasonDetail } from "apis/data/season.data"
import { Colors } from "const"
import { liveImg } from "assets/images"
import { jsonSvc } from "apis/services"
import FastImage from "react-native-fast-image"

const ParticipantTab: React.FC<IParticipantTab> = ({ gameData }) => {
    const [participantData, setParticipantData] = useState<IParticipants[]>([])
    const getParticipantData = async (gameData?: ISeasonDetail) => {
        if (!gameData) return

        const data = await liveSvc.getGameParticipant(gameData.GAME_CODE)
        const sortList = data.sort((a, b) => {
            const _a = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(a.nameKo)
            const _b = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(b.nameKo)

            if ((_a && _b) || (!_a && !_b)) a.nameKo.localeCompare(b.nameKo)

            if (_a) {
                return -1
            } else {
                return 1
            }
        })

        setParticipantData(sortList)
    }
    useEffect(() => {
        getParticipantData(gameData)
    }, [gameData])

    if (participantData.length <= 0) {
        return (
            <View style={{ flex: 1, width: RatioUtil.width(360), backgroundColor: Colors.WHITE }}>
                <View style={{
                    backgroundColor: Colors.GRAY7,
                    ...RatioUtil.sizeFixedRatio(360, 1)
                }} />
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        source={liveImg.noData}
                        style={{
                            width: RatioUtil.lengthFixedRatio(100),
                            height: RatioUtil.lengthFixedRatio(100),
                        }}
                        resizeMode="contain"
                    />
                    <PretendText
                        style={{
                            textAlign: "center",
                            color: Colors.GRAY2,
                            fontSize: RatioUtil.font(14),
                            marginTop: RatioUtil.lengthFixedRatio(10),
                            marginBottom: RatioUtil.lengthFixedRatio(30),
                        }}
                    >
                        {/* {"출전 선수 목록이 없어요"} */}
                        {jsonSvc.findLocalById("110430")}
                    </PretendText>
                </View>
            </View>
        )
    }

    return (
        <View style={{ width: RatioUtil.width(360), backgroundColor: Colors.WHITE }}>
            <View style={{
                backgroundColor: Colors.GRAY7,
                ...RatioUtil.sizeFixedRatio(360, 1)
            }} />
            <ScrollView
                contentContainerStyle={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    backgroundColor: Colors.WHITE,
                    ...RatioUtil.marginFixedRatio(30, 20, 0, 20),
                    paddingBottom: RatioUtil.height(50),
                }}
            >
                {participantData.map(item => (
                    <View key={item.PLAYER_CODE}>
                        <View
                            style={{
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                ...RatioUtil.sizeFixedRatio(100, 124),
                                marginBottom: RatioUtil.lengthFixedRatio(10),
                                backgroundColor: Colors.GRAY9,
                                borderRadius: RatioUtil.height(10),
                            }}
                        >
                            <FastImage
                                source={{ uri: item.imageUrl }}
                                style={{
                                    width: RatioUtil.lengthFixedRatio(60),
                                    height: RatioUtil.lengthFixedRatio(60),
                                    borderRadius: RatioUtil.lengthFixedRatio(60),
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                            <PretendText
                                style={{
                                    marginTop: RatioUtil.lengthFixedRatio(6),
                                    fontSize: RatioUtil.font(14),
                                    lineHeight: RatioUtil.font(14) * 1.3,
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    color: Colors.BLACK,
                                }}
                            >
                                {TextUtil.ellipsis(item.nameKo)}
                            </PretendText>
                            <PretendText
                                style={{
                                    marginTop: RatioUtil.lengthFixedRatio(4),
                                    fontSize: RatioUtil.font(12),
                                    lineHeight: RatioUtil.font(12) * 1.3,
                                    fontWeight: "normal",
                                    color: Colors.GRAY8,
                                }}
                            >
                                {item.sponsor}
                            </PretendText>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default ParticipantTab

interface IParticipantTab {
    gameData?: ISeasonDetail
}
