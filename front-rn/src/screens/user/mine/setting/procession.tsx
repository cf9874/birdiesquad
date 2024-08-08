import { ProfileHeader } from "components/layouts"
import { liveImg, myPageImg, nftDetailImg, playerCardImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import {
    Category,
    Colors,
    Dimension,
    ITEM_TYPE,
    NftFilterKey,
    nftFilterMenu,
    NftFilterType,
    NftSortKey,
    NftSortList,
    nftSortMenu,
    Screen,
} from "const"
import { useQuery, useWrapDispatch } from "hooks"
import { mineCompoStyle, playerStyle } from "styles"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { View, Image, ScrollView, ImageBackground, Modal, Alert, Text, BackHandler, Dimensions, Platform } from "react-native"
import { ArrayUtil, ConfigUtil, RatioUtil, navigate } from "utils"
import React, { Fragment, useCallback, useEffect, useState } from "react"
import { nftSvc } from "apis/services/nft.svc"
import { SafeAreaView } from "react-native-safe-area-context"
import dayjs from "dayjs"
import NftImage from "components/utils/NFTImage"
import { PlayerPupUp } from "screens/nft/components/player"

import { jsonSvc } from "apis/services"
import { NftApiData } from "apis/data"
import { useFocusEffect } from "@react-navigation/native"
import FastImage from "react-native-fast-image"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface IItem {
    seq: number
    regDate: dayjs.Dayjs
    userSeq: number
    itemId: number
    sIcon?: string
}
const Procession = () => {
    const popupDispatch = useWrapDispatch(setPopUp)
    // const [selectPhoto, setselectPhoto] = useState<{ uri: string; type: string; name: string } | "">("")
    const [itemSelection, setItemSelection] = useState<any>({})
    const [isVisiblePlayer, setIsVisiblePlayer] = useState(false)
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const [item, setItem] = useState<IItem[]>([])
    const [filterKey, setFilterKey] = useState<NftFilterKey>(1)
    const [sortKey, setSortKey] = useState<NftSortKey>(1)
    const [sortDesc, setSorkDesc] = useState<NftSortList>("seq")
    const [itemVisible, setItemVisible] = useState(true)
    const [growToggle, setGrowToggle] = useState(false)
    const [myNfts, setMyNfts] = useState<NftApiData.NftList.ResDto["data"]>()
    const [page, setPage] = useState(2)
    const [index, setIndexRankHelp] = useState(1)
    const [routes] = useState([{ key: "help", title: "" }])
    const getItemInfo = async () => {
        const response = await nftSvc.getMyItem({ order: "ASC", page: 1, take: 0 })
        const dataItem = response.data
            .map(item => {
                const infoItem = jsonSvc.filterItemByType(item.itemId, [ITEM_TYPE.DONATE])
                return infoItem ? { ...item, sIcon: infoItem.sIcon } : item
            })
            .filter(e => e.sIcon !== undefined)
        setItem(dataItem)
    }

    const handleConfirm = async () => {
        setShowConfirm(false)
        if (itemSelection) {
            const infoItem = jsonSvc.findItemById(itemSelection.itemId)
            if ([ITEM_TYPE.SHOPCHOICE, ITEM_TYPE.FREECHOICE].includes(infoItem?.nType)) {
                setIsVisiblePlayer(!isVisiblePlayer)
            } else if (
                [ITEM_TYPE.FREENORMAL, ITEM_TYPE.SHOPNORMAL, ITEM_TYPE.FREEPREMIUM, ITEM_TYPE.SHOPPREMIUM].includes(
                    infoItem?.nType
                )
            ) {
                await nftSvc
                    .doOpenLucky({
                        ITEM_SEQ: itemSelection.seq,
                    })
                    .then(async (response: any) => {
                        navigate(Screen.UNBOXINGVIDEO, {
                            nftseq: response?.USER_NFT?.SEQ_NO,
                            playerCode: response.USER_NFT.PLAYER_CODE,
                            nID: infoItem.nID,
                            toNavigate: Screen.PROCESSIN,
                        })
                    })
                    .catch(error => {
                        console.warn(3, error), Alert.alert(error.toString())
                    })
            } else {
                return
            }
        }
    }

    const getNftList = async () => {
        const data = await nftSvc.getMyNftListSpending({
            order: "DESC",
            take: 0,
            page: 1,
            filterType: NftFilterType.PROFILE,
        })
        if (!data) return
        setMyNfts(data.data)
    }

    // const onAddMoreNft = async () => {
    //     const data = await nftSvc.getMyNftListSpending({
    //         order: "DESC",
    //         take: 10,
    //         page,
    //         filterType: NftFilterType.PROFILE,
    //     })
    //     if (!data.data.length || !myNfts || myNfts.findIndex(nft => nft.seq === data.data[0].seq) !== -1) return

    //     setMyNfts([...myNfts, ...data.data])
    //     setPage(page => page + 1)
    // }

    useEffect(() => {
        const backAction = () => {
            navigate(Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])
    useFocusEffect(
        useCallback(() => {
            getItemInfo()
            getNftList()
        }, [])
    )

    const ItemCategory = (itemId: number) => {
        switch (itemId) {
            case Category.FREENORMAL:
                return jsonSvc.findLocalById("7080")
            case Category.SHOPNORMAL:
                return jsonSvc.findLocalById("7080")
            case Category.SHOPPREMIUM:
                return jsonSvc.findLocalById("7081")
            case Category.SHOPCHOICE:
                return jsonSvc.findLocalById("7079")
            case Category.FREEPREMIUM:
                return jsonSvc.findLocalById("7081")
            case Category.FREECHOICE:
                return jsonSvc.findLocalById("7079")
            default:
                return ""
        }
    }
    if (!myNfts) return null
    const nftListArray = growToggle
        ? nftSvc.listSort(sortKey, myNfts).filter(v => v.trainingMax === v.training)
        : nftSvc.listSort(sortKey, myNfts)

    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView
            style={{
                ...mineCompoStyle.photoPopup.con,
                marginTop: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: 0,
                height: "100%",
            }}
        >
            {/* <ProfileHeader title={"보유"} /> */}
            <ProfileHeader title={jsonSvc.findLocalById("170003")} />
            <View
                style={{
                    ...RatioUtil.size(320, 54),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginLeft: RatioUtil.width(20),
                }}
            >
                <View style={mineCompoStyle.photoNftPopup.menuBox}>
                    {nftFilterMenu.map((v, i) => (
                        <CustomButton
                            key={i}
                            style={{
                                ...mineCompoStyle.photoNftPopup.menu,
                                marginRight: i === 0 ? RatioUtil.width(6) : 0,
                                backgroundColor: filterKey === v.key ? Colors.BLACK : Colors.WHITE,
                            }}
                            onPress={() => {
                                setFilterKey(v.key)
                                if (i) {
                                    setItemVisible(false)
                                    setGrowToggle(true)
                                } else {
                                    setItemVisible(true)
                                    setGrowToggle(false)
                                }
                            }}
                        >
                            <PretendText
                                style={{
                                    ...mineCompoStyle.photoNftPopup.menuText,
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
                        style={mineCompoStyle.photoNftPopup.menuText}
                        onPress={() => {
                            // setItemVisible(true)
                            // setGrowToggle(false)
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
            <ScrollView
                contentContainerStyle={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                // onScroll={async e => {
                //     let bottom = 1
                //     bottom += e.nativeEvent.layoutMeasurement.height

                //     if (e.nativeEvent.contentOffset.y + bottom >= e.nativeEvent.contentSize.height) {
                //         await onAddMoreNft()
                //     }
                // }}
            >
                {growToggle && nftListArray.length === 0 ? (
                    <View
                        style={{
                            width: RatioUtil.width(320),
                            height: RatioUtil.height(200),
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: RatioUtil.height(120),
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
                        {itemVisible &&
                            item.map((v: IItem, j) => {
                                return (
                                    <Fragment key={j}>
                                        <CustomButton
                                            style={{
                                                flexWrap: "wrap",
                                                ...RatioUtil.sizeFixedRatio(155, 220),
                                                marginTop: RatioUtil.width(5),
                                                marginBottom: RatioUtil.width(5),
                                            }}
                                            onPress={() => {
                                                setItemSelection(v)
                                                setShowConfirm(true)
                                            }}
                                        >
                                            {v.sIcon ? (
                                                <FastImage
                                                    source={{
                                                        uri: ConfigUtil.getPlayerImage(v.sIcon),
                                                    }}
                                                    style={{
                                                        ...RatioUtil.sizeFixedRatio(155, 220),
                                                    }}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                >
                                                    <PretendText
                                                        style={{
                                                            color: Colors.WHITE,
                                                            fontSize: RatioUtil.font(14),
                                                            fontWeight: "700",
                                                            marginLeft: RatioUtil.width(20),
                                                            marginTop: RatioUtil.height(20),
                                                        }}
                                                    >
                                                        {ItemCategory(v.itemId)}
                                                    </PretendText>
                                                </FastImage>
                                            ) : null}
                                        </CustomButton>
                                    </Fragment>
                                )
                            })}
                        {nftListArray.map((v, i) => (
                            <CustomButton
                                key={i}
                                style={{
                                    ...RatioUtil.sizeFixedRatio(155, 220),
                                    //marginTop: RatioUtil.width(10),
                                    marginTop: RatioUtil.lengthFixedRatio(5),
                                    marginBottom: RatioUtil.lengthFixedRatio(5),
                                }}
                                onPress={() =>
                                    navigate(Screen.NFTDETAIL, { nftseq: v.seq, toNavigate: Screen.PROCESSIN })
                                }
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
                        ))}
                        <CustomButton
                            onPress={() => {
                                navigate(Screen.NFTTABSCENE)
                            }}
                            style={{
                                ...RatioUtil.sizeFixedRatio(155, 220),
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: RatioUtil.width(5),
                                marginBottom: RatioUtil.width(5),
                                // marginLeft: (nftListArray.length + item.length) % 2 ? RatioUtil.width(10) : 0,
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

                <View>
                    <View>
                        <PlayerPupUp
                            isVisible={isVisiblePlayer}
                            setIsVisible={setIsVisiblePlayer}
                            itemSelection={itemSelection}
                            toNavigate={Screen.PROCESSIN}
                        />
                    </View>
                    {/* CONFIRM OPEN ITEM */}

                    <Modal visible={showConfirm} statusBarTranslucent transparent>
                        <View style={playerStyle.selectionModal}>
                            <View style={[playerStyle.selectionModalInner]}>
                                <View style={playerStyle.selectionModalBody}>
                                    <PretendText style={playerStyle.completeTitle}>
                                        {/* 선수팩을 오픈하시겠어요? */}
                                        {jsonSvc.findLocalById("10000041")}
                                    </PretendText>
                                </View>
                                <View style={playerStyle.buttonMainView}>
                                    <CustomButton
                                        onPress={() => {
                                            setShowConfirm(false)
                                        }}
                                        style={[
                                            playerStyle.buttonView,
                                            {
                                                backgroundColor: Colors.GRAY7,
                                            },
                                        ]}
                                    >
                                        <PretendText style={playerStyle.drawProgressLeft}>
                                            {/* 취소 */}
                                            {jsonSvc.findLocalById("1021")}
                                        </PretendText>
                                    </CustomButton>
                                    <CustomButton
                                        onPress={() => {
                                            handleConfirm()
                                        }}
                                        style={[
                                            playerStyle.buttonView,
                                            {
                                                backgroundColor: Colors.BLACK,
                                            },
                                        ]}
                                    >
                                        <PretendText style={playerStyle.drawProgressRight}>
                                            {/* 확인 */}
                                            {jsonSvc.findLocalById("1012")}
                                        </PretendText>
                                    </CustomButton>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default Procession
