import React, { useCallback, useEffect, useState } from "react"
import { Dimensions, FlatList, Image, ImageBackground, Platform, Pressable, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ArrayUtil, ConfigUtil, RatioUtil, navigate } from "utils"
import {
    Colors,
    Grade,
    NftFilterKey,
    NftFilterType,
    NftSortKey,
    NftSortList,
    Screen,
    ScreenParams,
    nftFilterMenu,
    nftSortMenu,
} from "const"
import { liveImg, myPageImg, nftDetailImg, playerCardImg, profileHeaderImg, WalletImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { walletStyle } from "styles/wallet.style"
import { jsonSvc, nftSvc, walletSvc } from "apis/services"
import { useRoute, RouteProp, useFocusEffect } from "@react-navigation/native"
import { IWalletRegistNFT, IWalletRegistNFTList } from "apis/data/wallet.api.data"
import NftImage from "components/utils/NFTImage"
import localJson from "json/local.json"
import { NftApiData } from "apis/data"
import { mineCompoStyle } from "styles"
import { useWrapDispatch } from "hooks"
import { setPopUp, setToast } from "store/reducers/config.reducer"
import { ScrollView } from "react-native-gesture-handler"
import { WalletToast } from "screens/nft/components"
import { SvgIcon } from "components/Common/SvgIcon"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const SelectPlayerNFT = () => {
    const route = useRoute<RouteProp<ScreenParams, Screen.SELECTPLAYERNFT>>()
    const popupDispatch = useWrapDispatch(setPopUp)
    const toastDispatch = useWrapDispatch(setToast)

    const [mode, setMode] = useState(route.params.mode)

    const [growToggle, setGrowToggle] = useState(false)
    const [sortDesc, setSorkDesc] = useState<NftSortList>("seq")
    const [filterKey, setFilterKey] = useState<NftFilterKey>(1)
    const [sortKey, setSortKey] = useState<NftSortKey>(1)

    const [selectedItem, setSelectedItem] = useState<NftApiData.NftData | null>(null)
    const handleSelection = (item: NftApiData.NftData) => {
        const selectedId = selectedItem?.seq
        if (selectedId === item.seq) setSelectedItem(null)
        else setSelectedItem(item)
    }

    const [selectedItemWallet, setSelectedItemWallet] = useState<{
        level: number
        grade: number
        season: number
        playerCode: number
        birdie: number
        training: number
        trainingMax: number
        imgUri: string
        energy: number
        seq: number
        name: string
    } | null>(null)
    const handleSelectionWallet = (item: {
        level: number
        grade: number
        season: number
        playerCode: number
        birdie: number
        training: number
        trainingMax: number
        imgUri: string
        energy: number
        seq: number
        name: string
    }) => {
        const selectedId = selectedItemWallet?.seq

        if (selectedId === item.seq) setSelectedItem(null)
        else setSelectedItemWallet(item)
    }

    const [listNFTSpending, setListNFTSpending] = useState<NftApiData.NftList.ResDto["data"]>([])
    const [listNFTWallet, setListNFTWallet] = useState<
        {
            level: number
            grade: number
            season: number
            playerCode: number
            birdie: number
            training: number
            trainingMax: number
            imgUri: string
            energy: number
            seq: number
            name: string
        }[]
    >([])
    const [pageSpending, setPageSpending] = useState(2)

    const fetchListNFTSpending = async () => {
        const data = await nftSvc.getMyNftListSpending({
            order: "DESC",
            take: 0,
            page: 1,
            filterType: NftFilterType.SPENDING,
        })
        if (!data) return

        setListNFTSpending(data.data)
    }
    // const onAddMoreNftSpending = async () => {
    //     const data = await nftSvc.getMyNftListSpending({
    //         order: "DESC",
    //         take: 10,
    //         page: pageSpending,
    //         filterType: NftFilterType.SPENDING,
    //     })
    //     if (
    //         !data.data.length ||
    //         !listNFTSpending ||
    //         listNFTSpending.findIndex(nft => nft.seq === data.data[0].seq) !== -1
    //     )
    //         return

    //     setListNFTSpending([...listNFTSpending, ...data.data])
    //     setPageSpending(page => page + 1)
    // }

    const fetchListNFTWallet = async () => {
        const response = await walletSvc.mapWallettNftList({ start: 1 })
        /* test */
        if (!response) return
        setListNFTWallet(response)
    }

    const autoClose = () => {
        setTimeout(() => {
            toastDispatch({ open: false })
        }, 2000)
    }
    useFocusEffect(
        useCallback(() => {
            mode == 1 ? fetchListNFTSpending() : mode == 2 ? fetchListNFTWallet() : null
        }, [])
    )

    const filterArraySpending = growToggle
        ? nftSvc.listSort(sortKey, listNFTSpending).filter(v => v.trainingMax === v.training && v.energy === 100)
        : nftSvc.listSort(sortKey, listNFTSpending).filter(v => v.energy === 100)

    const filterArrayWallet = growToggle
        ? ArrayUtil.sort(listNFTWallet, sortDesc, "desc").filter(e => e.training === e.trainingMax)
        : ArrayUtil.sort(listNFTWallet, sortDesc, "desc")

    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE, alignItems: "center" }}>
            <View style={{
                ...RatioUtil.sizeFixedRatio(360, 44),
                ...RatioUtil.padding(0, 15, 0, 15),
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
            }}>
                <Pressable
                    onPress={() => {
                        navigate(Screen.BACK)
                    }}
                >
                    {/* <Image resizeMode="contain" style={RatioUtil.size(15, 16)} source={profileHeaderImg.arrow} /> */}
                    <SvgIcon name="BackSvg"/>
                </Pressable>
                <PretendText
                    style={{
                        fontSize: RatioUtil.font(16),
                        fontWeight: RatioUtil.fontWeightBold(),
                        color: Colors.BLACK,
                    }}
                >
                    {/* 프로 선택 */}
                    {jsonSvc.findLocalById("2035")}
                </PretendText>
                <Pressable
                    onPress={() => {
                        navigate(Screen.WALLETS)
                    }}
                >
                    <Image resizeMode="contain" style={RatioUtil.sizeFixedRatio(30, 30)} source={nftDetailImg.close} />
                </Pressable>
            </View>
            <View
                style={{
                    ...RatioUtil.sizeFixedRatio(320, 54),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View style={mineCompoStyle.photoNftPopup.menuBox}>
                    {nftFilterMenu.map((v, i) => (
                        <CustomButton
                            key={i}
                            style={{
                                borderColor: Colors.GRAY7,
                                borderRadius: RatioUtil.width(6),
                                borderWidth: 1,
                                ...RatioUtil.paddingFixedRatio(5, 9, 5, 9),
                                height: RatioUtil.heightFixedRatio(30),
                                marginVertical: RatioUtil.heightFixedRatio(12),
                                minWidth: RatioUtil.width(56),
                                marginRight: i === 0 ? RatioUtil.width(6) : 0,
                                backgroundColor: filterKey === v.key ? Colors.BLACK : Colors.WHITE,
                            }}
                            onPress={() => {
                                setFilterKey(v.key)
                                if (i) {
                                    setGrowToggle(true)
                                } else {
                                    setGrowToggle(false)
                                }
                            }}
                        >
                            <PretendText
                                style={{
                                    fontWeight: RatioUtil.fontWeightBold(),
                                    fontSize: RatioUtil.font(14),
                                    color: filterKey === v.key ? Colors.WHITE : Colors.BLACK,
                                    textAlign: "center",
                                }}
                            >
                                {v.title}
                            </PretendText>
                        </CustomButton>
                    ))}
                </View>
                <CustomButton
                    style={{
                        ...mineCompoStyle.photoNftPopup.menuBox,
                        height: RatioUtil.heightFixedRatio(54)
                    }}
                >
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={myPageImg.arrowUp}
                            style={{
                                width: RatioUtil.width(7),
                                height: RatioUtil.height(12),
                            }}
                            resizeMode="contain"
                        />
                        <Image
                            source={myPageImg.arrowDown}
                            style={{
                                ...RatioUtil.margin(0, 8, 0, 3),
                                width: RatioUtil.width(7),
                                height: RatioUtil.height(12),
                            }}
                            resizeMode="contain"
                        />
                    </View>
                    <PretendText
                        style={{
                            color: Colors.BLACK,
                            fontWeight: RatioUtil.fontWeightBold(),
                            fontSize: RatioUtil.font(14),
                        }}
                        onPress={() => {
                            setGrowToggle(false)
                            popupDispatch({
                                open: true,
                                children: (
                                    <View
                                        style={{
                                            width: RatioUtil.width(360),
                                            height: RatioUtil.heightFixedRatio(416) + insets.bottom,
                                            backgroundColor: Colors.WHITE,
                                            position: "absolute",
                                            bottom: 0,
                                            borderRadius: RatioUtil.width(10),
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderRadius: RatioUtil.width(10),
                                                height: RatioUtil.heightFixedRatio(56),
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <View
                                                style={{
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <PretendText
                                                    style={{
                                                        textAlign: "center",
                                                        color: Colors.BLACK,
                                                        fontWeight: RatioUtil.fontWeightBold(),
                                                        fontSize: RatioUtil.font(16),
                                                    }}
                                                >
                                                    {/* 능력 필터 */}
                                                    {jsonSvc.findLocalById("120022")}
                                                </PretendText>
                                            </View>
                                            <CustomButton
                                                style={{
                                                    position: "absolute",
                                                    right: RatioUtil.width(20),
                                                }}
                                                onPress={() => {
                                                    popupDispatch({ open: false })
                                                }}
                                            >
                                                <Image
                                                    source={nftDetailImg.close}
                                                    style={{
                                                        width: RatioUtil.width(25),
                                                        height: RatioUtil.width(25),
                                                    }}
                                                    resizeMode="contain"
                                                />
                                            </CustomButton>
                                        </View>
                                        {nftSortMenu.map((v, i) => (
                                            <CustomButton
                                                key={i}
                                                style={{
                                                    height: RatioUtil.heightFixedRatio(60),
                                                    ...RatioUtil.paddingFixedRatio(0, 0, 0, 20),
                                                    backgroundColor: sortKey === v.key ? Colors.GRAY7 : Colors.WHITE,
                                                    justifyContent: "center",
                                                }}
                                                onPress={() => {
                                                    setSortKey(v.key)
                                                    setSorkDesc(v.desc)
                                                    popupDispatch({ open: false })
                                                }}
                                            >
                                                <PretendText
                                                    style={{
                                                        color: Colors.BLACK,
                                                        fontSize: RatioUtil.font(16),
                                                        fontWeight:
                                                            sortKey === v.key ? RatioUtil.fontWeightBold() : "400",
                                                    }}
                                                >
                                                    {v.title}
                                                </PretendText>
                                            </CustomButton>
                                        ))}
                                    </View>
                                ),
                            })
                        }}
                    >
                        {nftSvc.getSortTitle(sortKey)}
                    </PretendText>
                </CustomButton>
            </View>
            {mode == 1 ? (
                <ScrollView
                    style={{
                        width: RatioUtil.width(320),
                    }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: RatioUtil.heightFixedRatio(100),
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    // onScroll={e => {
                    //     let bottom = 1
                    //     bottom += e.nativeEvent.layoutMeasurement.height

                    //     if (e.nativeEvent.contentOffset.y + bottom >= e.nativeEvent.contentSize.height) {
                    //         onAddMoreNftSpending()
                    //     }
                    // }}
                >
                    {growToggle && filterArraySpending.length === 0 ? (
                        <View
                            style={{
                                width: RatioUtil.width(320),
                                height: RatioUtil.heightFixedRatio(200),
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: RatioUtil.heightFixedRatio(120),
                            }}
                        >
                            <Image
                                source={liveImg.noData}
                                style={{
                                    width: RatioUtil.width(100),
                                    height: RatioUtil.width(100),
                                    marginBottom: RatioUtil.heightFixedRatio(5),
                                }}
                            />
                            <PretendText
                                style={{
                                    textAlign: "center",
                                    fontSize: RatioUtil.font(14),
                                    color: Colors.GRAY2,
                                }}
                            >
                                {/* {"성장 가능한 선수가\n없습니다."} */}
                                {jsonSvc.findLocalById("170109")}
                            </PretendText>
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                width: RatioUtil.width(320),
                            }}
                        >
                            {filterArraySpending.map((v, i) => (
                                <View>
                                    <CustomButton
                                        key={i}
                                        style={{
                                            ...RatioUtil.sizeFixedRatio(155, 220),
                                            marginTop: RatioUtil.heightFixedRatio(10),
                                        }}
                                        onPress={() => handleSelection(v)}
                                    >
                                        <NftImage
                                            grade={v.grade}
                                            birdie={v.birdie}
                                            energy={v.energy}
                                            level={v.level}
                                            sortKey={sortKey}
                                            playerCode={v.playerCode}
                                        />
                                    </CustomButton>
                                    {v.seq === selectedItem?.seq ? (
                                        <View
                                            style={{
                                                backgroundColor: "rgba(0,0,0,0.4)",
                                                ...RatioUtil.sizeFixedRatio(155, 220),
                                                borderRadius: RatioUtil.width(25),
                                                position: "absolute",
                                                // zIndex: 6,
                                                marginTop: RatioUtil.width(10),
                                            }}
                                        />
                                    ) : null}
                                    {v.seq === selectedItem?.seq ? (
                                        <View
                                            style={{
                                                ...mineCompoStyle.photoPopup.check,
                                                bottom: RatioUtil.height(190),
                                                left: RatioUtil.width(122),
                                            }}
                                        >
                                            <Image
                                                source={myPageImg.checkPhoto2}
                                                style={{
                                                    // zIndex: 5,
                                                    ...RatioUtil.size(20, 20),
                                                }}
                                                resizeMode="contain"
                                            />
                                        </View>
                                    ) : null}
                                </View>
                            ))}
                            <CustomButton
                                onPress={() => {
                                    navigate(Screen.NFTTABSCENE)
                                }}
                                style={{
                                    ...RatioUtil.sizeFixedRatio(155, 220),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginTop: RatioUtil.heightFixedRatio(10),
                                }}
                            >
                                <ImageBackground
                                    source={playerCardImg.dashbox}
                                    resizeMode="contain"
                                    style={{
                                        ...RatioUtil.sizeFixedRatio(155, 220),
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Image
                                        source={playerCardImg.nftAdd}
                                        style={{
                                            width: RatioUtil.width(20),
                                            height: RatioUtil.width(20),

                                            marginBottom: RatioUtil.height(10),
                                        }}
                                        resizeMode="contain"
                                    />
                                    <PretendText
                                        style={{
                                            fontSize: RatioUtil.font(14),
                                            color: Colors.GRAY3,
                                            textAlign: "center",
                                        }}
                                    >
                                        {/* {" NFT를 추가로\n획득해보세요!"} */}
                                        {jsonSvc.findLocalById("120018")}
                                    </PretendText>
                                </ImageBackground>
                            </CustomButton>
                        </View>
                    )}
                </ScrollView>
            ) : mode == 2 ? (
                <FlatList
                    extraData={selectedItemWallet}
                    style={{ width: RatioUtil.width(320) }}
                    contentContainerStyle={{ paddingBottom: 110 }}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    data={filterArrayWallet}
                    numColumns={2}
                    keyExtractor={(item, index) => item.seq.toString()}
                    renderItem={({ item, index }) => (
                        <View>
                            <CustomButton
                                key={index}
                                style={{
                                    ...RatioUtil.sizeFixedRatio(155, 220),
                                    marginTop: RatioUtil.width(10),
                                }}
                                onPress={() => handleSelectionWallet(item)}
                            >
                                <NftImage
                                    level={item.level}
                                    grade={item.grade}
                                    playerCode={item.playerCode}
                                    birdie={item.birdie}
                                />
                                {item.seq === selectedItemWallet?.seq ? (
                                    <View
                                        style={{
                                            backgroundColor: "rgba(0,0,0,0.4)",
                                            ...RatioUtil.sizeFixedRatio(155, 220),
                                            borderRadius: RatioUtil.width(25),
                                            position: "absolute",
                                        }}
                                    />
                                ) : null}
                                {item.seq === selectedItemWallet?.seq ? (
                                    <View
                                        style={{
                                            ...mineCompoStyle.photoPopup.check,
                                            bottom: RatioUtil.height(170),
                                            left: RatioUtil.width(122),
                                        }}
                                    >
                                        <Image
                                            source={myPageImg.checkPhoto2}
                                            style={{
                                                ...RatioUtil.size(20, 20),
                                            }}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ) : null}
                            </CustomButton>
                        </View>
                    )}
                />
            ) : null}
            {mode == 1 ? (
                <TouchableOpacity
                    disabled={selectedItem != null ? false : true}
                    onPress={() => {
                        if (selectedItem) {
                            let grade: string = ""
                            let minLevel: number = 0
                            switch (selectedItem.grade) {
                                case 1:
                                    // grade = "Common"
                                    grade = jsonSvc.findLocalById("1")
                                    minLevel = 15
                                    break
                                case 2:
                                    // grade = "Uncommon"
                                    grade = jsonSvc.findLocalById("2")
                                    minLevel = 5
                                    break
                                case 3:
                                    // grade = "Rare"
                                    grade = jsonSvc.findLocalById("3")
                                    minLevel = 3
                                    break
                                default:
                                    break
                            }
                            if (selectedItem?.grade === Grade.COMMON) {
                                toastDispatch({
                                    open: true,
                                    children: (
                                        <WalletToast
                                            // message={`${grade} 등급은 지갑으로 전송이 불가합니다.`}
                                            message={jsonSvc.findLocalById("10000030")}
                                            // image={nftDetailImg.error}
                                            image="NftDetailErrorSvg"
                                        />
                                    ),
                                })
                                autoClose()
                                return
                            } else if (selectedItem.level < minLevel) {
                                toastDispatch({
                                    open: true,
                                    children: (
                                        <WalletToast
                                            message={`${grade} 등급은 LV. ${minLevel} 이상부터 지갑으로 전송이 가능합니다.`}
                                            // image={nftDetailImg.error}
                                            image="NftDetailErrorSvg"
                                        />
                                    ),
                                })
                                autoClose()
                                return
                            } else {
                                navigate(Screen.CONFIRMPLAYERNFT, {
                                    itemSpending: {
                                        seq: selectedItem?.seq,
                                        level: selectedItem?.level,
                                        grade: selectedItem?.grade,
                                        playerCode: selectedItem?.playerCode,
                                        birdie: selectedItem?.birdie,
                                        imgUri: selectedItem?.imgUri,
                                    },
                                    mode: 1,
                                })
                            }
                        }
                    }}
                    style={{
                        ...walletStyle.header.buttonTransfer,
                        backgroundColor: selectedItem != null ? Colors.BLACK : Colors.WHITE3,
                        position: "absolute",
                        bottom: RatioUtil.heightFixedRatio(20) + insets.bottom,
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(16),
                            color: selectedItem != null ? Colors.WHITE : Colors.GRAY12,
                            fontWeight: "400",
                        }}
                    >
                        {/* 확인 */}
                        {jsonSvc.findLocalById("10010000")}
                    </PretendText>
                </TouchableOpacity>
            ) : mode == 2 ? (
                <TouchableOpacity
                    disabled={selectedItemWallet != null ? false : true}
                    onPress={() => {
                        navigate(Screen.CONFIRMPLAYERNFT, {
                            itemWallet: {
                                seq: selectedItemWallet?.seq,
                                level: selectedItemWallet?.level,
                                grade: selectedItemWallet?.grade,
                                playerCode: selectedItemWallet?.playerCode,
                                birdie: selectedItemWallet?.birdie,
                                imgUri: selectedItemWallet?.imgUri,
                            },
                            mode: 2,
                        })
                    }}
                    style={{
                        ...walletStyle.header.buttonTransfer,
                        backgroundColor: selectedItemWallet != null ? Colors.BLACK : Colors.WHITE3,
                        position: "absolute",
                        bottom: RatioUtil.heightFixedRatio(20) + insets.bottom,
                    }}
                >
                    <PretendText
                        style={{
                            fontSize: RatioUtil.font(16),
                            color: selectedItemWallet != null ? Colors.WHITE : Colors.GRAY12,
                            fontWeight: "400",
                        }}
                    >
                        {/* 확인 */}
                        {jsonSvc.findLocalById("10010000")}
                    </PretendText>
                </TouchableOpacity>
            ) : null}
        </SafeAreaView>
    )
}

export default SelectPlayerNFT
