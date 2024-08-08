import { useEffect, useState } from "react"
import { Dimensions, FlatList, Image, RefreshControl, View } from "react-native"
import { styles } from "./styles"
import { SafeAreaView } from "react-native-safe-area-context"
import { useWrapDispatch } from "hooks"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { Colors } from "const"
import { jsonSvc } from "apis/services"
import { SHOP_CATEGORY } from "const/shop.const"
import moment from "moment"
import { ItemShop } from "./itemShop"
import { CustomButton, PretendText } from "components/utils"
import { RatioUtil } from "utils"
import { NftPlayerListPopup } from "screens/live/tab.cheerPick.compo"
import { WalletImg } from "assets/images"

const NFT = (props: any) => {
    const popUpDispatch = useWrapDispatch(setPopUp)
    const modalDispatch = useWrapDispatch(setModal)
    const { width } = Dimensions.get("window")
    const [selectedTab, setselectedTab] = useState("NFT")
    const [visible, setvisible] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [dataMarket, setDataMarket] = useState<any>([])
    useEffect(() => {
        initData()
    }, [])
    const initData = () => {
        const choiceCardList = jsonSvc.findShopByCategory(SHOP_CATEGORY.CHOICECARD)
        const LuckDrawCardList = jsonSvc.findShopByCategory(SHOP_CATEGORY.LUCKYDRAW)

        const cardList = [...choiceCardList, ...LuckDrawCardList]
            .filter(card => {
                if (card.sEndTime === "") return card

                return card.sStartTime <= moment().format("YYYYMMDD") && card.sEndTime >= moment().format("YYYYMMDD")
            })
            .sort((acc, cur) => {
                return acc.nSlot - cur.nSlot
            })

        setDataMarket(cardList)
        setRefreshing(false)
    }
    const onRefresh = () => {
        setRefreshing(true)
        initData()
    }
    return (
        <View style={styles.mainView}>
            <View
                style={{
                    backgroundColor: Colors.GRAY9,
                    height: RatioUtil.lengthFixedRatio(36),
                    alignItems: "center",
                    justifyContent: "center",
                    width: RatioUtil.width(320),
                    marginHorizontal: RatioUtil.width(20),
                    marginBottom: RatioUtil.lengthFixedRatio(20),
                    borderRadius: RatioUtil.width(5),
                }}
            >
                <PretendText
                    style={{
                        fontWeight: "400",
                        color: Colors.GRAY2,
                        fontSize: RatioUtil.font(14),
                    }}
                >
                    구매 비용의 일부는 프로에게 전해집니다.
                </PretendText>
            </View>
            <CustomButton
                style={{
                    width: RatioUtil.width(214),
                    height: RatioUtil.lengthFixedRatio(26),
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                }}
                onPress={() => {
                    popUpDispatch({
                        open: true,
                        children: <NftPlayerListPopup />,
                    })
                }}
            >            
                <View
                style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                }}
                >
                    <PretendText
                        style={{
                            color: Colors.GRAY3,
                            fontSize: RatioUtil.font(14),
                        }}
                    >
                        {/* 버디스쿼드 NFT 선수 목록 보기 */}
                        {/* {jsonSvc.findLocalById("110209")} */}
                        버디스쿼드 프로 리스트 보러가기
                    </PretendText>
                    <Image
                        source={WalletImg.arrow.right}
                        style={{
                            width: RatioUtil.width(15),
                            height: RatioUtil.width(15),
                        }}
                        resizeMode="contain"
                    />
                </View>
            </CustomButton>                
            <View
                style={{
                    width: RatioUtil.width(210),
                    height: 1,
                    backgroundColor: Colors.GRAY3,
                    marginTop: RatioUtil.lengthFixedRatio(2),
                    marginBottom: RatioUtil.lengthFixedRatio(20),

                }}
            />

            <FlatList
                contentContainerStyle={{}}
                data={dataMarket}
                keyExtractor={(item, index) => item.nID}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.BLACK} />
                }
                renderItem={({ item, index }) => <ItemShop item={item} />}
                showsVerticalScrollIndicator={false}

            />
        </View>
    )
}

export default NFT
