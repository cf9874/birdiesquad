import React, { useEffect, useState } from "react"
import { ProfileHeader } from "components/layouts"
import { mineGStyle } from "styles"
import { Colors, Screen, ScreenParams } from "const"
import { SafeAreaView } from "react-native-safe-area-context"
import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import PostInquiry from "./tabInquiry/postInquiry"
import MyInquiry from "./tabInquiry/myInquiry"
import { jsonSvc } from "apis/services"
import { navigate } from "utils"
import { BackHandler } from "react-native"
import { RouteProp, useRoute } from "@react-navigation/native"

export interface tab {
    title: string
    component: () => void
}

const SetInquiry = () => {
    const { params } = useRoute<RouteProp<ScreenParams, Screen.SETINQUIRY>>()
    const [index, setIndex] = useState(params?.tabIndex ?? 0)
    const [routes] = useState([
        // { key: "POST_INQUIRY", title: "문의하기" },
        { key: "POST_INQUIRY", title: jsonSvc.findLocalById("173105") },
        // { key: "MY_INQUIRY", title: "내 문의" },
        { key: "MY_INQUIRY", title: jsonSvc.findLocalById("173106") },
    ])
    const onSelect = (data: React.SetStateAction<number>) => {
        setIndex(data)
    }
    const randomKey = (min: any, max: any) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    const renderScene = ({ route, jumpTo }: { route: any; jumpTo: any }) => {
        switch (route.key) {
            case "POST_INQUIRY":
                return <PostInquiry onSelect={onSelect} />
            case "MY_INQUIRY":
                return <MyInquiry reRender={randomKey(1, 9999)} />
        }
    }
    useEffect(() => {
        const backAction = () => {
            navigate(params?.toNavigate ? params?.toNavigate : Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])
    return (
        <SafeAreaView style={mineGStyle.con}>
            <ProfileHeader title="1:1 문의" backHome={params?.toNavigate} />
            <TabView
                lazy={({ route }) => route.key === "MY_INQUIRY"}
                renderTabBar={props => (
                    <TabBar
                        style={{ backgroundColor: Colors.WHITE }}
                        indicatorStyle={{ backgroundColor: Colors.BLACK }}
                        activeColor={Colors.BLACK}
                        inactiveColor={Colors.GRAY18}
                        labelStyle={{ color: Colors.BLACK, fontWeight: "600" }}
                        {...props}
                    />
                )}
                style={{ backgroundColor: Colors.WHITE }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={onSelect}
            />
        </SafeAreaView>
    )
}

export default SetInquiry
