import * as React from "react"
import { PretendText } from "components/utils"
import { AnalyticsEventName, Screen, ScreenParams } from "const"
import { Button, Image, Pressable, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Colors, Dimension } from "const"
import { navigate, RatioUtil } from "utils"
import { rankStyle } from "styles/rank.style"
import PagerView from "react-native-pager-view"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import PANDETAIL from "./PanTabDetail"
import PRODETAIL from "./ProTabDetail"
import { RouteProp, useRoute } from "@react-navigation/native"
import { LayoutStyle } from "styles/layout.style"
import { jsonSvc } from "apis/services"
import { SvgIcon } from "components/Common/SvgIcon"
import { useAsyncEffect } from "hooks"
import { Analytics } from "utils/analytics.util"
const renderScene = SceneMap({
    pandetail: PANDETAIL,
    prodetail: PRODETAIL,
})

const RankingDetail = () => {
    const route = useRoute<RouteProp<ScreenParams, Screen.RANKDETAIL>>()

    const [index, setTabIndex] = React.useState(route.params.tabIndex ?? 0)
    const [routes] = React.useState([
        // { key: "pandetail", title: "팬" },
        { key: "pandetail", title: jsonSvc.findLocalById("150002") },
        // { key: "prodetail", title: "프로" },
        { key: "prodetail", title: jsonSvc.findLocalById("2041") },
    ])
    useAsyncEffect(async () => {
        console.log(route.params.tabIndex)
        if (route.params.tabIndex === 0) {
            switch (route.params.subTabIndex) {
                case 0:
                    await Analytics.logEvent(AnalyticsEventName.view_detail_most_150, {
                        hasNewUserData: true,
                    })
                    break
                case 1:
                    await Analytics.logEvent(AnalyticsEventName.view_detail_support_150, {
                        hasNewUserData: true,
                    })
                    break
                case 2:
                    await Analytics.logEvent(AnalyticsEventName.view_detail_supportCount_150, {
                        hasNewUserData: true,
                    })
                    break
                case 3:
                    await Analytics.logEvent(AnalyticsEventName.view_detail_heart_150, {
                        hasNewUserData: true,
                    })
                    break
                case 4:
                    await Analytics.logEvent(AnalyticsEventName.view_detail_profile_150, {
                        hasNewUserData: true,
                    })
                    break
            }
            return
        } else {
            switch (route.params.subTabIndex) {
                case 0:
                    await Analytics.logEvent(AnalyticsEventName.view_detail_earning_155, {
                        hasNewUserData: true,
                    })
                    break
                case 1:
                    await Analytics.logEvent(AnalyticsEventName.view_detail_supportCount_155, {
                        hasNewUserData: true,
                    })
                    break
                case 2:
                    await Analytics.logEvent(AnalyticsEventName.view_detail_heart_155, {
                        hasNewUserData: true,
                    })
                    break
                case 3:
                    await Analytics.logEvent(AnalyticsEventName.view_detail_profile_155, {
                        hasNewUserData: true,
                    })
                    break
            }
            return
        }
    }, [])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            {/* <ProfileHeader title="랭크" /> */}

            <View
                style={{
                    height: RatioUtil.lengthFixedRatio(44),
                    flexDirection: "row",
                    backgroundColor: Colors.WHITE,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Pressable
                    style={LayoutStyle.profileHeader.arrowIcon}
                    onPress={() => {
                        navigate(Screen.BACK)
                    }}
                >
                    {/* <Image
                        resizeMode="contain"
                        style={{ width: RatioUtil.width(8), height: RatioUtil.width(16) }}
                        source={profileHeaderImg.arrow}
                    /> */}
                    <SvgIcon name="BackSvg" />
                </Pressable>
                <PretendText style={rankStyle.header.text}>
                    {/* 랭크 */}
                    {jsonSvc.findLocalById("150000")}
                </PretendText>
            </View>

            <TabView
                lazy={({ route }) => route.key === "prodetail"}
                renderTabBar={props => (
                    <TabBar
                        style={{ height: RatioUtil.lengthFixedRatio(49), backgroundColor: Colors.WHITE }}
                        indicatorStyle={{ backgroundColor: Colors.BLACK }}
                        activeColor={Colors.BLACK}
                        inactiveColor={Colors.GRAY18}
                        labelStyle={{
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(14),
                        }}
                        {...props}
                    />
                )}
                style={{ backgroundColor: Colors.WHITE }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setTabIndex}
                //   initialLayout={{ width: layout.width }}
            />
        </SafeAreaView>
    )
}

export default RankingDetail
