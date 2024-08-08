import { Colors } from "const"
import { useState, useEffect } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import NFT from "./NFT"
import RaddleTab from "./RaddleTab"
import { styles } from "./styles"
import { TabBar, TabView } from "react-native-tab-view"
import { RatioUtil } from "utils"
import { MainHeader, MyPageFooter } from "components/layouts"
import { useToggle } from "hooks"
import { jsonSvc, profileSvc } from "apis/services"

import { useFocusEffect, useRoute } from "@react-navigation/native"
import React from "react"

export interface tab {
    title: string
    component: () => void
}

const NftPayment = () => {
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        // { key: "NFT", title: "NFT" },
        { key: jsonSvc.findLocalById("8002"), title: jsonSvc.findLocalById("8002") },
        // { key: "Raffle", title: "래플" },
        { key: "Raffle", title: jsonSvc.findLocalById("13107") },
    ])
    const [asset, setAsset] = useState<{
        bdst: number
        tbora: number
        trainingPoint: number
    }>({
        bdst: 0,
        tbora: 0,
        trainingPoint: 0,
    })
    const onSelect = (data: React.SetStateAction<number>) => {
        setIndex(data)
    }

    const route = useRoute<any>()
    const params = route?.params

    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case "NFT":
                return <NFT />
            case "Raffle":
                return <RaddleTab toggle={toggle} params={params} asset={asset} />
            default:
                return null
        }
    }

    const [flag, toggle, setState] = useToggle()

    useEffect(() => {
        const fetchData = async () => {
            const asset = await profileSvc.getAsset()
            const {
                asset: { bdst, tbora, training: trainingPoint },
            } = asset as IAsset

            if (asset) setAsset({ bdst, tbora, trainingPoint })
        }
        fetchData()
    }, [flag])

    return (
        <SafeAreaView style={styles.mainView}>
            <MainHeader training={asset.trainingPoint} bdst={asset.bdst} tbora={asset.tbora} hideArrow={true} />
            <TabView
                lazy={({ route }) => route.key === "Raffle"}
                renderTabBar={props => (
                    <TabBar
                        style={{ backgroundColor: Colors.WHITE }}
                        indicatorStyle={{ backgroundColor: Colors.BLACK }}
                        activeColor={Colors.BLACK}
                        inactiveColor={Colors.GRAY18}
                        labelStyle={{ color: Colors.BLACK, fontWeight: "600", fontSize: RatioUtil.font(14) }}
                        {...props}
                    />
                )}
                style={{ backgroundColor: Colors.WHITE }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={onSelect}
            />
            <MyPageFooter />
        </SafeAreaView>
    )
}

export default NftPayment

interface IAsset {
    asset: {
        training: number
        bdst: number
        tbora: number
    }
}
