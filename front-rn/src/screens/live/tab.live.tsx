import { View, Image, FlatList, TouchableOpacity } from "react-native"
import React, { useEffect, useState } from "react"
import moment from "moment"
import { KakaoLiveApi } from "apis/external/kakao.live.api"
import { Colors } from "const"
import { liveImg } from "assets/images"
import { liveStyle } from "styles/live.style"
import { CustomButton, PretendText } from "components/utils"
import { RatioUtil } from "utils"
import SimpleGradientProgressbarView from "react-native-simple-gradient-progressbar-view"

const kakaoApi = new KakaoLiveApi()
const InfoLive = ({
    gameId,
    onUpdateLive,
    setLink,
}: {
    gameId: number
    onUpdateLive: (vod: IVod) => void
    setLink: any
}) => {
    const [dataVod, setDataVod] = useState<IVod[]>()
    const [selectVod, setSelectVod] = useState<number>(0)
    const [maxReward, setMaxReward] = useState<number>(7)
    const [pointGenerated, setPointGenerated] = useState<number>(0)
    const pointEarned = dataVod !== undefined && selectVod !== undefined ? dataVod[selectVod].pointEarned ?? 0 : 0
    const progressPoint = pointEarned ? pointEarned / maxReward : 0
    const canEarnPoint = pointGenerated > 0 ? pointEarned + pointGenerated <= maxReward : false

    useEffect(() => {
        const fetchData = async () => {
            const data = await kakaoApi.getLinkData(gameId)
            if (data?.contents[0]?.subContent) {
                setDataVod(data?.contents[0]?.subContent)
            }
        }
        if (gameId) {
            fetchData()
        }
    }, [gameId])

    useEffect(() => {
        let interval: any
        if (selectVod !== undefined) {
            interval = setInterval(() => {
                setPointGenerated(prev => prev + 1)
            }, 10000)

            if (pointGenerated + pointEarned == maxReward) {
                clearInterval(interval)
            }
        }

        return () => clearInterval(interval)
    }, [selectVod, pointGenerated, maxReward, pointEarned])

    const handleSelectVod = (index: number) => {
        if (dataVod) {
            const vodSelected = dataVod[index]
            if (selectVod) {
                dataVod[selectVod].pointGenerated = pointGenerated
            }
            const maxReward =
                vodSelected.maxReward ??
                Math.round((vodSelected.contentInfo.video.playTime / (1 - 10000)) * (1 - 10000))
            onUpdateLive(vodSelected)
            //console.log(vodSelected.contentInfo.video.clipLinkId)
            // console.log(vodSelected.contentInfo)
            setLink(
                `https://play-tv.kakao.com/embed/player/cliplink/${vodSelected.contentInfo.video.clipLinkId}?service=kakao_tv`
            )
            setPointGenerated(vodSelected?.pointEarned ?? 0)
            setMaxReward(maxReward)
            setSelectVod(index)
            if (vodSelected.maxReward == undefined) {
                dataVod[index].maxReward = maxReward
            }
            setDataVod([...dataVod])
        }
    }

    const renderItemVod = ({ item, index }: { item: IVod; index: number }) => {
        let isFinishedReward = item.pointEarned && item.maxReward && item.pointEarned == item.maxReward

        return (
            <TouchableOpacity onPress={() => handleSelectVod(index)}>
                <View style={{ display: "flex", flexDirection: "row", paddingVertical: RatioUtil.height(5) }}>
                    <Image
                        source={{ uri: item.contentInfo.displayImage }}
                        style={{ ...RatioUtil.size(146, 82), borderRadius: RatioUtil.width(5) }}
                    />
                    <View style={{ flex: 1, paddingLeft: RatioUtil.width(5) }}>
                        {!isFinishedReward && pointGenerated > 0 && selectVod == index && (
                            <View style={liveStyle.liveTab.infoChildCon}>
                                <Image source={liveImg.coin_perspective} style={liveStyle.liveTab.imageCoin} />
                                <PretendText style={[liveStyle.liveTab.subTitle, { color: Colors.BLUE }]}>
                                    보상
                                </PretendText>
                            </View>
                        )}
                        {isFinishedReward && <PretendText style={liveStyle.liveTab.subTitle}>보상완료</PretendText>}
                        <PretendText numberOfLines={2} style={liveStyle.liveTab.videoTitle}>
                            {item.contentInfo.displayTitle}
                        </PretendText>
                        <PretendText style={liveStyle.liveTab.subTitle}>{`조회수 930회  |  ${
                            dataVod && moment(item.contentInfo?.originalCreatedAt).format("YYYY.MM.DD")
                        }`}</PretendText>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    const handleEarnPoint = () => {
        if (dataVod !== undefined && selectVod !== undefined) {
            if (dataVod[selectVod].pointEarned) {
                const pointEarned = dataVod[selectVod].pointEarned ?? 0
                dataVod[selectVod].pointEarned = pointEarned + pointGenerated
            } else dataVod[selectVod].pointEarned = pointGenerated
            setDataVod([...dataVod])
            setPointGenerated(0)
        }
    }

    return (
        <View style={liveStyle.liveTab.con}>
            <View style={{ padding: RatioUtil.width(10) }}>
                <PretendText style={liveStyle.liveTab.title}>
                    {dataVod && dataVod[selectVod]?.contentInfo?.displayTitle}
                </PretendText>
                <PretendText style={liveStyle.liveTab.subTitle}>{`조회수 930회  |  ${
                    dataVod && moment(dataVod[selectVod].contentInfo?.originalCreatedAt).format("YYYY.MM.DD")
                }`}</PretendText>
            </View>
            <View style={liveStyle.liveTab.infoCon}>
                <View style={liveStyle.liveTab.flexBetween}>
                    <View style={{ width: "78%" }}>
                        <View style={liveStyle.liveTab.infoChildCon}>
                            <PretendText style={liveStyle.liveTab.textInfo}>보상 게이지</PretendText>
                            <Image source={liveImg.info} style={liveStyle.liveTab.imageInfo} />
                        </View>
                        <View>
                            <View style={liveStyle.liveTab.percentCon}>
                                <SimpleGradientProgressbarView
                                    style={{
                                        height: RatioUtil.height(20),
                                    }}
                                    fromColor={Colors.PURPLE3}
                                    toColor={Colors.PURPLE}
                                    progress={progressPoint}
                                    maskedCorners={[1, 1, 1, 1]}
                                    cornerRadius={5.0}
                                />
                            </View>
                            <View style={liveStyle.liveTab.flexBetween}>
                                <PretendText style={liveStyle.liveTab.textPercent}>0%</PretendText>
                                <PretendText style={liveStyle.liveTab.textPercent}>50%</PretendText>
                                <PretendText style={liveStyle.liveTab.textPercent}>100%</PretendText>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: "20%" }}>
                        <View style={liveStyle.liveTab.infoChildCon}>
                            <Image source={liveImg.coin_perspective} style={liveStyle.liveTab.imageCoin} />
                            <PretendText style={liveStyle.liveTab.textInfo}>{`${pointGenerated}P`}</PretendText>
                        </View>
                        <View style={{ justifyContent: "center", flex: 1 }}>
                            {pointEarned == maxReward ? (
                                <PretendText style={liveStyle.liveTab.subTitle}>보상완료</PretendText>
                            ) : (
                                <CustomButton
                                    style={[
                                        liveStyle.liveTab.btnReceive,
                                        canEarnPoint ? { backgroundColor: Colors.PURPLE } : {},
                                    ]}
                                    onPress={handleEarnPoint}
                                    disabled={!canEarnPoint}
                                >
                                    <PretendText
                                        style={[
                                            liveStyle.liveTab.textBtnReceive,
                                            canEarnPoint ? { color: Colors.WHITE } : {},
                                        ]}
                                    >
                                        받기
                                    </PretendText>
                                </CustomButton>
                            )}
                        </View>
                    </View>
                </View>
            </View>
            <View style={liveStyle.liveTab.vodCon}>
                <PretendText style={liveStyle.liveTab.textInfo}>
                    영상<PretendText style={liveStyle.liveTab.textCountVod}>{dataVod && dataVod.length}</PretendText>
                </PretendText>
                <View style={{ height: RatioUtil.height(150), paddingTop: RatioUtil.height(5) }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={dataVod ?? []}
                        keyExtractor={item => item._id}
                        renderItem={renderItemVod}
                    />
                </View>
            </View>
        </View>
    )
}

export default InfoLive

interface IPluster {
    databaseName: string | null
    id: number
    collectionName: string
}

interface IContentInfo {
    displayTitle: string
    originalCreatedAt: string
    displayImage: string
    video: {
        clipLinkId: string
        playTime: number
    }
    mobileUrl: string
    serviceName: string
}

export interface IVod {
    plusters: IPluster[]
    contentInfo: IContentInfo
    _id: string
    pointEarned?: number
    maxReward?: number
    pointGenerated?: number
}
