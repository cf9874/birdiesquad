import { AnalyticsEventName, Colors, Screen, ScreenParams } from "const"
import { useState, useEffect, useRef } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import NFT from "./NFT"
import RaddleTab from "./RaddleTab"
import { styles } from "./styles"
import { TabBar, TabView } from "react-native-tab-view"
import { RatioUtil, navigate } from "utils"
import { MainHeader, MyPageFooter } from "components/layouts"
import { useAsyncEffect, useToggle } from "hooks"
import { jsonSvc, profileSvc } from "apis/services"
import { Analytics } from "utils/analytics.util"
import { RouteProp, useRoute } from "@react-navigation/native"
import { BackHandler } from "react-native"

export interface tab {
    title: string
    component: () => void
}

const NftTabScene = () => {
    const { params } = useRoute<RouteProp<ScreenParams, Screen.NFTTABSCENE>>()
    const [index, setIndex] = useState(params?.tabIndex ?? 0)
    const [asset, setAsset] = useState<{
        bdst: number
        tbora: number
        trainingPoint: number
    }>({
        bdst: 0,
        tbora: 0,
        trainingPoint: 0,
    })
    useEffect(() => {
        const backAction = () => {
            navigate(params?.toNavigate ? params?.toNavigate : Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])
    useEffect(() => {
        const fetchData = async () => {
            const asset = await profileSvc.getAsset()
            const {
                asset: { bdst, tbora, training: trainingPoint },
            } = asset as IAsset

            if (asset) setAsset({ bdst, tbora, trainingPoint })
        }
        fetchData()
    }, [])
    useAsyncEffect(async () => {
        await Analytics.logEvent(AnalyticsEventName.view_market_300, {
            hasNewUserData: true,
        })
    }, [])
    return (
        <SafeAreaView style={styles.mainView}>
            <MainHeader
                training={asset.trainingPoint}
                bdst={asset.bdst}
                tbora={asset.tbora}
                hideArrow={true}
                toNavigate={params?.toNavigate}
            />
            <NFT />
            <MyPageFooter />
        </SafeAreaView>
    )
}

export default NftTabScene

interface IAsset {
    asset: {
        training: number
        bdst: number
        tbora: number
    }
}
