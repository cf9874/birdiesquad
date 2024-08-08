import { useState } from "react"
import { ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RatioUtil } from "utils"
import { Colors } from "const"
import { rankHelpStyle, rankStyle } from "styles/rank.style"
import { PretendText } from "components/utils"
import localJson from "json/local.json"
import { jsonSvc } from "apis/services"

const ProHelp = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={RatioUtil.margin(0, 15, 0, 15)}>
                    <PretendText style={{ ...rankStyle.header.text, fontSize: 16, ...RatioUtil.margin(15, 0, 20, 0) }}>
                        {/* 순위안내 */}
                        {jsonSvc.findLocalById("912022")}
                    </PretendText>
                    <View style={{ ...rankStyle.header.row, borderTopColor: Colors.GRAY11, borderTopWidth: 1 }}>
                        <View style={rankHelpStyle.popup.itemLeftPro}>
                            <PretendText style={{ color: Colors.BLACK, fontWeight: "500" }}>
                                {/* 수익 */}
                                {jsonSvc.findLocalById("150054")}
                            </PretendText>
                        </View>
                        <View style={rankHelpStyle.popup.rowCenterPro}>
                            <PretendText style={{ ...rankStyle.listItem.textBold, fontWeight: "500" }}>
                                {/* 프로가 받은 후원 금액이 많은 순위 */}
                                {jsonSvc.findLocalById("912024")}
                            </PretendText>
                        </View>
                    </View>
                    <View style={{ ...rankStyle.header.row, borderTopColor: Colors.GRAY11, borderTopWidth: 1 }}>
                        <View style={rankHelpStyle.popup.itemLeftPro}>
                            <PretendText style={{ color: Colors.BLACK, fontWeight: "500" }}>
                                {jsonSvc.findLocalById("150068")}
                            </PretendText>
                        </View>
                        <View style={rankHelpStyle.popup.rowCenterPro}>
                            <PretendText
                                style={{
                                    ...rankStyle.listItem.textBold,
                                    fontWeight: "500",

                                    width: "100%",
                                }}
                            >
                                {/* 후원을 받은 횟수가 많은 순위 */}
                                {jsonSvc.findLocalById("912026")}
                            </PretendText>
                        </View>
                    </View>
                    <View style={{ ...rankStyle.header.row, borderTopColor: Colors.GRAY11, borderTopWidth: 1 }}>
                        <View style={rankHelpStyle.popup.itemLeftPro}>
                            <PretendText style={{ color: Colors.BLACK, fontWeight: "500" }}>
                                {/* 하트 */}
                                {jsonSvc.findLocalById("150070")}
                            </PretendText>
                        </View>
                        <View style={rankHelpStyle.popup.rowCenterPro}>
                            <PretendText style={{ ...rankStyle.listItem.textBold, fontWeight: "500" }}>
                                {/* 하트를 받은 횟수가\n많은 순위 */}
                                {jsonSvc.findLocalById("912028")}
                            </PretendText>
                        </View>
                    </View>
                    <View style={rankHelpStyle.popup.itemEndPro}>
                        <View style={rankHelpStyle.popup.itemLeftPro}>
                            <PretendText style={{ color: Colors.BLACK, fontWeight: "500" }}>
                                {/* 프로필 인기 순위 */}
                                {jsonSvc.findLocalById("150011")}
                            </PretendText>
                        </View>
                        <View style={rankHelpStyle.popup.rowCenterPro}>
                            <PretendText style={{ ...rankStyle.listItem.textBold, fontWeight: "500" }}>
                                {/* 프로필 인기 점수가\n높은 순위 */}
                                {jsonSvc.findLocalById("912030")}
                            </PretendText>
                        </View>
                    </View>
                    <PretendText style={{ fontWeight: "400", color: Colors.GRAY8, ...RatioUtil.margin(6, 0, 0, 0) }}>
                        {` • ${jsonSvc.findLocalById("912031")}`}
                    </PretendText>
                    <PretendText style={{ fontWeight: "400", color: Colors.GRAY8, ...RatioUtil.margin(6, 0, 50, 0) }}>
                        {` • ${jsonSvc.findLocalById("912017")}`}
                    </PretendText>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ProHelp
