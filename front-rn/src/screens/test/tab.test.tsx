import * as React from "react"
import { Animated, Text, useWindowDimensions, View } from "react-native"
import { Carousel, useCarousel } from "components/Carousel"
import { RatioUtil } from "utils"
import { SafeAreaView } from "react-native-safe-area-context"
import { Tab, useTab } from "components/Tab"
import { profileStyle } from "styles"
import { Colors } from "const/color.const"
import { LiveMidea } from "components/Common"
import { useDimension } from "hooks"
import { liveStyle } from "styles/live.style"
import { PretendText } from "components/utils"
const Live = () => {
    const TabCtx = useTab(tabMenu.map((title, i) => ({ title, component: tabMeunComponents[i] })))
    const { width, height } = useWindowDimensions()

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LiveMidea />
            <Tab.Container
                {...TabCtx}
                initialLayout={{ ...RatioUtil.size(width, height) }}
                renderTabBar={props => {
                    return (
                        <Tab.Bar
                            {...props}
                            style={liveStyle.tabMenu.con}
                            indicatorStyle={liveStyle.tabMenu.indicator}
                            labelStyle={liveStyle.tabMenu.title}
                            activeColor={Colors.BLACK}
                            pressColor={Colors.WHITE}
                        />
                    )
                }}
            />
        </SafeAreaView>
    )
}

export default Live

const tabMenu = ["응원", "응원픽", "NFT", "리더보드", "정보", "영상"]
const tabMeunComponents = [
    <PretendText>응원</PretendText>,
    <PretendText>응원픽</PretendText>,
    <PretendText>NFT</PretendText>,
    <PretendText>리더보드</PretendText>,
    <PretendText>정보</PretendText>,
    <PretendText>영상</PretendText>,
]
