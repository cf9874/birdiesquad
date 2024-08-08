import { NFTCardImages } from "assets/images"
import { callSetGameApi } from "common/GlobalFunction"
import InfiniteScroll from "components/InfiniteScroll"
import { checkStopNFT, navigate } from "utils"
import PriceButton from "components/PriceButton"
import { useEffect, useRef, useState } from "react"
import { Animated, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native"
import store from "store"
import { setGameLoader, setSetGameModalData } from "store/reducers/getGame.reducer"
import { scaleSize } from "styles/minixs"
import { styles } from "./styles"
import { Screen } from "const"
import { jsonSvc } from "apis/services"
import { NotifiModal } from "components/Common/NottifiModal"
import { setModal } from "store/reducers/config.reducer"
import { useWrapDispatch } from "hooks"
// import Carousel from 'react-native-snap-carousel';

const ScrollableCard = (props: any) => {
    const modalDispatch = useWrapDispatch(setModal)
    const [currentIndex, setCurrentIndex] = useState(0)
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const card1ImagesArray = [...data, ...data]
    const flatListRef = useRef(0)

    const scrollX = useRef(new Animated.Value(0)).current

    return (
        <TouchableOpacity
            disabled={false}
            activeOpacity={1}
            onPress={async () => {
                store.dispatch(setGameLoader(true))
                const showModal = await callSetGameApi()
                if (!showModal) {
                    store.dispatch(setGameLoader(false))
                    navigate(Screen.PLAYERSELECTION, {
                        active: false,
                        image: NFTCardImages.NFTCard4,
                        selection: true,
                        title: "NFT 초이스 카드",
                        price: "99,000",
                        shopCode: 1,
                    })
                } else {
                    store.dispatch(
                        setSetGameModalData({
                            title: "지금은 투어 보상 정산 중입니다.",
                            desc1: "구입은",
                            desc2: "잠시 후 다시 진행 해 주세요.",
                        })
                    )
                    store.dispatch(setGameLoader(false))
                }
            }}
        >
            <ImageBackground borderRadius={scaleSize(10)} source={NFTCardImages.NFTCard1} style={styles.cardImage}>
                <View style={styles.card1MainView}>
                    <View style={[styles.card1InnerView, { flex: 0.6 }]}>
                        <Text style={styles.cardTitle}>NFT 초이스 카드</Text>
                        <Text style={styles.cardDesc}>응원하는 선수를 직접 선택하여 NFT를 획득할 수 있습니다.</Text>
                    </View>
                    <PriceButton
                        price={"99,000"}
                        onPress={async () => {
                            store.dispatch(setGameLoader(true))
                            const showModal = await callSetGameApi()
                            if (checkStopNFT()) {
                                modalDispatch({
                                    open: true,
                                    children: (
                                        <NotifiModal
                                            title="지금은 투어 보상 정산 중입니다."
                                            description="지금은 투어 보상 정산 중입니다. NFT 이동은 잠시 후 다시 진행 해 주세요."
                                        />
                                    ),
                                })
                            } else {
                                if (!showModal) {
                                    store.dispatch(setGameLoader(false))
                                    navigate(Screen.PLAYERSELECTION, {
                                        active: false,
                                        image: NFTCardImages.NFTCard4,
                                        selection: true,
                                        title: "NFT 초이스 카드",
                                        price: "99,000",
                                        shopCode: 1,
                                    })
                                } else {
                                    store.dispatch(
                                        setSetGameModalData({
                                            title: "지금은 투어 보상 정산 중입니다.",
                                            desc1: "구입은",
                                            desc2: "잠시 후 다시 진행 해 주세요.",
                                        })
                                    )
                                    store.dispatch(setGameLoader(false))
                                }
                            }
                        }}
                    />
                </View>
                <InfiniteScroll />
            </ImageBackground>
        </TouchableOpacity>
    )
}

export default ScrollableCard
