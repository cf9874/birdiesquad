import { ProfileHeader, ProfileHeaderVx } from "components/layouts"
import { ActivityIndicator, Alert, BackHandler, FlatList, Image, Platform, SafeAreaView, StatusBar, Text, View } from "react-native"
import { styles } from "./styles"
import NftImage from "components/utils/NFTImage"
import { RatioUtil, navigate } from "utils"
import { Colors, Screen } from "const"
import { CustomButton, PretendText } from "components/utils"
import { useEffect, useState } from "react"
import { walletSvc } from "apis/services"
import { useSelector } from "react-redux"
import { liveImg } from "assets/images"
import { INft } from "./nftDetailVx"
import { ResponseUpgradeNftMaterials } from "./types"

// list 목록의 끝에 다가갈 때 얼마나 멀리 떨어져 있을 때 onEndReached 콜백을 호출할지를 결정
const END_REACHED_THRESHOLD = 0.5

// 선택되지 않은 nft 리스트
const extractNotSelectedNftMaterials = (nftMaterials: any, selectedNft: any, upgradeNft: any) => {
    const selectedSeqs = selectedNft.map((nft: INft) => nft.seq)
    return nftMaterials.filter((material: ResponseUpgradeNftMaterials) => {
        return !selectedSeqs.includes(material.seqNo) && material.seqNo !== upgradeNft.seq
    })
}

const NftAdvancementMaterials = ({ route }: any) => {
    // 재료 NFT 리스트
    const [nftMaterials, setNftMaterials] = useState<ResponseUpgradeNftMaterials[]>([])
    // 재료로 선택된 NFT
    const selectedNft = useSelector((state: any) => state.nftUpgradeMaterialsReducer)
    // 승급할 NFT
    const upgradeNft = useSelector((state: any) => state.upgradeNftReducer)
    // 선택되지 않은 NFT
    const filteredNftMaterials = extractNotSelectedNftMaterials(nftMaterials, selectedNft, upgradeNft)
    // 페이지 번호
    const [page, setPage] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const getNftMaterials = async () => {
        setIsLoading(true)
        try {
            const materials = await walletSvc.getNftMaterials({
                grade: upgradeNft.grade,
                level: upgradeNft.level,
                playerCode: upgradeNft.playerCode,
                page,
            })
            if (materials) {
                setNftMaterials(prev => [...prev, ...materials])
                setPage(prevPage => prevPage + 1)
            }
        } catch (error) {
            console.error(error)
            Alert.alert("서버 에러")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getNftMaterials()
        const backAction = () => {
            navigate(Screen.NFTADVANCEMENT)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])

    const NoDataComponent = () => (
        <View
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "50%",
            }}
        >
            <Image
                source={liveImg.noData}
                style={{
                    width: RatioUtil.width(100),
                    height: RatioUtil.width(100),
                    marginBottom: RatioUtil.height(5),
                }}
            />
            <PretendText
                style={{
                    textAlign: "center",
                    fontSize: RatioUtil.font(14),
                    color: Colors.GRAY2,
                }}
            >
                <View style={styles.nftUpgradeMaterialListNoData}>
                    <Text style={styles.nftUpgradeMaterialListNoDataInfo}>선택 가능한 프로가 없습니다.</Text>
                    <Text style={styles.nftUpgradeMaterialListNoDataText}>(15레벨의 같은 등급 NFT만 선택 가능)</Text>
                </View>
            </PretendText>
        </View>
    )

    const renderItem = ({ item: v }: { item: any }) => (
        <CustomButton
            key={v.seqNo}
            style={{
                ...RatioUtil.sizeFixedRatio(155, 220),
                marginTop: RatioUtil.lengthFixedRatio(5),
                marginBottom: RatioUtil.lengthFixedRatio(5),
            }}
            onPress={() => {
                navigate(Screen.NFTDETAIL, {
                    nftseq: v.seqNo,
                    nftChoiceBtn: true,
                    navigationParams: route.params.navigationParams,
                })
            }}
        >
            <NftImage grade={v.grade} birdie={v.birdie} level={v.level} playerCode={v.playerCode} />
        </CustomButton>
    )

    return (
        <SafeAreaView style={styles.nftUpgradeMaterialsMain}>
            <View style={{ marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
                <ProfileHeaderVx title={"승급 재료 선택"} backHome={Screen.NFTADVANCEMENT} />
            </View>
            <FlatList
                data={filteredNftMaterials}
                keyExtractor={item => item.seqNo.toString()}
                onEndReached={getNftMaterials}
                onEndReachedThreshold={END_REACHED_THRESHOLD}
                numColumns={2}
                renderItem={renderItem}
                columnWrapperStyle={styles.nftUpgradeMaterialsListWrapper}
                ListHeaderComponent={() => (
                    <>
                        {isLoading === false && filteredNftMaterials.length === 0 ? (
                            <View style={{ display: "flex", alignItems: "center" }}>
                                <NoDataComponent />
                            </View>
                        ) : (
                            <Text style={styles.nftUpgradeMaterialsMainDescription}>
                                승급 NFT와 재료 모두 동일한 프로일 경우{"\n"}가장 높은 확률이 적용됩니다.
                            </Text>
                        )}
                    </>
                )}
                ListEmptyComponent={() =>
                    isLoading ? <ActivityIndicator size={"large"} color={Colors.GRAY10} /> : null
                }
            />
        </SafeAreaView>
    )
}

export default NftAdvancementMaterials
