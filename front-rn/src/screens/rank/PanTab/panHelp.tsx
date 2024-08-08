import { useState } from "react"
import { FlatList, Image, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RatioUtil } from "utils"
import { Colors } from "const"
import { rankHelpStyle, rankStyle } from "styles/rank.style"
import { ScrollView } from "react-native-gesture-handler"
import { FanRank } from "assets/images"
import { useRef } from "react"
import { PretendText } from "components/utils"
import { jsonSvc } from "apis/services"
import { rankKey } from "const/rank.const"

const PanHelp = () => {
    const [indexChooseRankHelp, setIndexChooseRankHelp] = useState(0)
    const scrollRef = useRef<ScrollView | null>(null)
    const onPressTouch = () => {
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        })
    }
    const getRankReward = (key: number) => {}
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "center", ...RatioUtil.margin(15, 15, 0, 15) }}>
                <FlatList
                    horizontal
                    style={{ marginBottom: 10 }}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    data={[
                        { label: jsonSvc.findLocalById("150066") }, //모스트
                        { label: jsonSvc.findLocalById("150056") }, //후원금
                        { label: jsonSvc.findLocalById("150068") }, //후원수
                        { label: jsonSvc.findLocalById("150070") }, //하트
                        { label: jsonSvc.findLocalById("7031") }, //프로필
                    ]}
                    keyExtractor={(item: { label: any }) => item.label}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={{ ...RatioUtil.margin(0, 2, 0, 2) }}
                            onPress={() => {
                                setIndexChooseRankHelp(index)
                                onPressTouch()
                            }}
                        >
                            <View
                                style={{
                                    ...rankStyle.detailMain.tab,
                                    backgroundColor: indexChooseRankHelp == index ? Colors.BLACK2 : Colors.WHITE,
                                }}
                            >
                                <PretendText
                                    allowFontScaling={false}
                                    style={{
                                        fontWeight: "700",
                                        color: indexChooseRankHelp == index ? Colors.WHITE : Colors.BLACK,
                                    }}
                                >
                                    {item.label}
                                </PretendText>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
                <View style={RatioUtil.margin(0, 15, 0, 15)}>
                    <PretendText
                        style={{
                            ...rankStyle.header.text,
                            fontSize: 16,
                            ...RatioUtil.margin(15, 0, 20, 0),
                        }}
                    >
                        {indexChooseRankHelp == 0
                            ? jsonSvc.findLocalById("912000") //한 명의 프로에게 후원한 금액이 많은 순위
                            : indexChooseRankHelp == 1
                            ? jsonSvc.findLocalById("912001") //합산한 후원 금액이 많은 순위
                            : indexChooseRankHelp == 2
                            ? jsonSvc.findLocalById("912002") //후원 전송 횟수가 많은 순위
                            : indexChooseRankHelp == 3
                            ? jsonSvc.findLocalById("912003") //하트 전송 횟수가 많은 순위
                            : indexChooseRankHelp == 4
                            ? jsonSvc.findLocalById("912004") //프로필 인기 점수가 높은 순위
                            : ""}
                    </PretendText>
                    <View style={rankStyle.header.row}>
                        <View style={rankHelpStyle.popup.header}>
                            <PretendText style={rankStyle.listItem.textBold}>
                                {jsonSvc.findLocalById("7030")}
                            </PretendText>
                        </View>
                        <View style={rankHelpStyle.popup.header}>
                            <PretendText style={rankStyle.listItem.textBold}>
                                {/* 순위 */}
                                {jsonSvc.findLocalById("7032")}
                            </PretendText>
                        </View>
                    </View>
                    <RankRewardList rankType={indexChooseRankHelp + 1} />
                    <PretendText style={{ fontWeight: "400", color: Colors.GRAY8, ...RatioUtil.margin(20, 0, 0, 0) }}>
                        {` • ${jsonSvc.findLocalById("912018")}`}
                    </PretendText>
                    <PretendText style={{ fontWeight: "400", color: Colors.GRAY8, ...RatioUtil.margin(6, 0, 0, 0) }}>
                        {` • ${jsonSvc.findLocalById("912019")}`}
                    </PretendText>
                    <PretendText style={{ fontWeight: "400", color: Colors.GRAY8, ...RatioUtil.margin(6, 0, 0, 0) }}>
                        {` • ${jsonSvc.findLocalById("912020")}`}
                    </PretendText>
                    <PretendText style={{ fontWeight: "400", color: Colors.GRAY8, ...RatioUtil.margin(6, 0, 50, 0) }}>
                        {` • ${jsonSvc.findLocalById("912017")}`}
                    </PretendText>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
const RankRewardList = ({ rankType }: { rankType: number }) => {
    const data = jsonSvc.findRankRewardByRankType(rankType)

    const rewardList = data.map((e, i) => {
        return {
            title: rankKey[i].title,
            value: e.dRewardAmount,
        }
    })
    return (
        <View>
            {rewardList.map((v, i) => {
                return (
                    <View style={{ ...rankStyle.header.row, borderTopColor: Colors.GRAY11, borderTopWidth: 1 }}>
                        <View style={rankHelpStyle.popup.itemLeft}>
                            <PretendText style={{ color: Colors.BLACK, fontWeight: "400" }}>{v.title}</PretendText>
                        </View>

                        <View style={rankHelpStyle.popup.rowCenter}>
                            <View style={rankHelpStyle.popup.viewImage}>
                                <Image source={FanRank.point_yellow} style={RatioUtil.size(15, 15)} />
                            </View>
                            <PretendText style={{ ...rankStyle.listItem.textBold, fontWeight: "400" }}>
                                {v.value}
                            </PretendText>
                        </View>
                    </View>
                )
            })}
        </View>
    )
}

export default PanHelp
