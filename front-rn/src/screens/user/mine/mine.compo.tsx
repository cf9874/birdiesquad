import { useRoute } from "@react-navigation/native"
import { liveImg, myPageImg, nftDetailImg, playerCardImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { AnalyticsEventName, Colors, Dimension, IconType, NftSortKey, nftSortMenu, Screen } from "const"
import { useQuery, useWrapDispatch } from "hooks"
import { mineCompoStyle } from "styles"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { View, Image, StyleProp, ScrollView, ImageSourcePropType, FlatList, Text, Platform, Modal, TouchableOpacity } from "react-native"
import { ConfigUtil, navigate, navigateReset, RatioUtil } from "utils"
import { Fragment, useEffect, useState } from "react"
import { nftSvc } from "apis/services/nft.svc"
import { jsonSvc, signSvc } from "apis/services"
import useGallery, { Photo, Album, hasAndroidPermission } from "hooks/useGallery"
import _ from "lodash"
import { IMyProfile, NftApiData } from "apis/data"
import ProfileImage from "components/utils/ProfileImage"
import NftImage from "components/utils/NFTImage"
import Mypage from "./myPage"
import { SvgIcon } from "components/Common/SvgIcon"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Analytics } from "utils/analytics.util"

export const ProfileButton = (props: {
    onPress: () => void
    conStyle?: StyleProp<any>
    imgStyle?: StyleProp<any>
    iconStyle?: StyleProp<any>
    // img: ImageSourcePropType
    name?: string
    type?: number
}) => {
    const route = useRoute()

    return (
        <CustomButton style={{ ...mineCompoStyle.profileButton.con, ...props.conStyle }} onPress={props.onPress}>
            {/* <Image
                source={props.img}
                resizeMode="contain"
                style={{ ...RatioUtil.size(80, 80), borderRadius: 1000, ...props.imgStyle }}
            /> */}
            <ProfileImage
                name={props.name}
                type={props.type}
                style={{ ...RatioUtil.size(80, 80), borderRadius: 1000, ...props.imgStyle }}
            />
            <SvgIcon name="AddIcon" style={{ ...mineCompoStyle.profileButton.editIcon, ...props.iconStyle }} />
        </CustomButton>
    )
}
// export const EditImgPopup = (props: {
//     setEditedImg: React.Dispatch<
//         React.SetStateAction<{
//             uri: string
//             type?: string | undefined
//             name?: string | undefined
//         }>
//     >
// }) => {
//     const popUpDispatch = useWrapDispatch(setPopUp)
//     const menu = [
//         {
//             text: "사진 선택하기",
//             source: myPageImg.photoIcon,
//             style: { marginTop: RatioUtil.height(26.5) },
//             onPress: () => {
//                 popUpDispatch({
//                     open: true,
//                     children: <PhotoPopup {...props} />,
//                 })
//             },
//         },
//         {
//             text: "NFT프로필 선택하기",
//             source: myPageImg.nftIcon,
//             style: { marginBottom: RatioUtil.height(20) },
//             onPress: () => {
//                 popUpDispatch({
//                     open: true,
//                     children: <PhotoNftPopup {...props} />,
//                 })
//             },
//         },
//     ]

//     return (
//         <View style={mineCompoStyle.editImgPopup.con}>
//             <PretendText style={mineCompoStyle.editImgPopup.titleText}>프로필 이미지 변경</PretendText>
//             <CustomButton
//                 style={mineCompoStyle.editImgPopup.closeBox}
//                 onPress={() => {
//                     popUpDispatch({
//                         open: false,
//                     })
//                 }}
//             >
//                 <Image source={nftDetailImg.close} style={mineCompoStyle.editImgPopup.close} />
//             </CustomButton>
//             {menu.map((v, i) => (
//                 <CustomButton
//                     style={{ ...mineCompoStyle.editImgPopup.selectCon, ...v.style }}
//                     key={i}
//                     onPress={v.onPress}
//                 >
//                     <View style={mineCompoStyle.editImgPopup.selectBox}>
//                         <Image source={v.source} style={mineCompoStyle.editImgPopup.icon} />
//                         <PretendText style={mineCompoStyle.editImgPopup.selectBoxText}>{v.text}</PretendText>
//                     </View>
//                     <Image source={myPageImg.showMore} style={mineCompoStyle.editImgPopup.show} />
//                 </CustomButton>
//             ))}
//         </View>
//     )
// }

// enum DispLayType {
//     Image = 0,
//     Album = 1,
//     AlbumDetail = 3,
// }
// const PhotoPopup = (props: {
//     setEditedImg: React.Dispatch<
//         React.SetStateAction<{
//             uri: string
//             type?: string | undefined
//             name?: string | undefined
//         }>
//     >
// }) => {
//     if (Platform.OS === "android") {
//         hasAndroidPermission()
//     }
//     const galleryCtx = useGallery()
//     const [selectPhoto, setSelectPhoto] = useState({ uri: "", type: "", name: "" })
//     const [displayType, setDisPlayType] = useState(DispLayType.Image)
//     const [albumImages, setAlbumImages] = useState<Photo[]>([])
//     const albums = _.chain(galleryCtx.photoes)
//         .groupBy("group_name")
//         .map((value, key) => ({ group_name: key, photoes: value }))
//         .value()

//     const popUpDispatch = useWrapDispatch(setPopUp)

//     const onClose = () => {
//         popUpDispatch({
//             open: false,
//         })
//     }

//     const onSelect = () => {
//         selectPhoto.uri && props.setEditedImg(selectPhoto)
//         onClose()
//     }

//     const renderImage = (uri: string, isAlbum = false) => {
//         return (
//             <Image
//                 source={{ uri: uri }}
//                 style={{
//                     ...RatioUtil.size(100, isAlbum ? 80 : 100),
//                     borderColor: Colors.GRAY11,
//                     borderWidth: 0.5,
//                 }}
//             />
//         )
//     }

//     const renderItemImage = ({ item }: { item: Photo }) => {
//         return (
//             <Fragment>
//                 <CustomButton
//                     style={{
//                         ...mineCompoStyle.photoPopup.galleryBox,
//                         ...RatioUtil.margin(0, 8.5, 8, 0),
//                     }}
//                     onPress={() => setSelectPhoto(item)}
//                 >
//                     {renderImage(item.uri)}
//                     {selectPhoto.uri === item.uri && (
//                         <View style={mineCompoStyle.photoPopup.check}>
//                             <Image source={myPageImg.checkPhoto} />
//                         </View>
//                     )}
//                 </CustomButton>
//             </Fragment>
//         )
//     }

//     const renderItemAlbum = ({ item }: { item: Album }) => {
//         return (
//             <Fragment>
//                 <CustomButton
//                     style={{
//                         ...mineCompoStyle.photoPopup.albumBox,
//                         ...RatioUtil.margin(0, 8.5, 8, 0),
//                     }}
//                     onPress={() => {
//                         setAlbumImages(item.photoes)
//                         setDisPlayType(DispLayType.AlbumDetail)
//                     }}
//                 >
//                     <View>
//                         {renderImage(item.photoes[0].uri ?? "", true)}
//                         <Text
//                             style={{ fontSize: RatioUtil.font(8) }}
//                         >{`${item.group_name}(${item.photoes.length})`}</Text>
//                     </View>
//                 </CustomButton>
//             </Fragment>
//         )
//     }

//     const renderContent = () => {
//         if (displayType == DispLayType.Image || displayType == DispLayType.AlbumDetail) {
//             const data = displayType == DispLayType.Image ? galleryCtx.photoes : albumImages
//             return (
//                 <FlatList
//                     showsVerticalScrollIndicator={false}
//                     style={mineCompoStyle.photoPopup.galleryScroll}
//                     numColumns={3}
//                     data={data}
//                     renderItem={renderItemImage}
//                     keyExtractor={item => item.uri}
//                 />
//             )
//         }

//         return (
//             <FlatList
//                 showsVerticalScrollIndicator={false}
//                 style={mineCompoStyle.photoPopup.galleryScroll}
//                 numColumns={3}
//                 data={albums}
//                 renderItem={renderItemAlbum}
//                 keyExtractor={item => item.group_name}
//             />
//         )
//     }

//     const renderCenterHeader = () => {
//         if (displayType == DispLayType.AlbumDetail) {
//             return (
//                 <PretendText style={mineCompoStyle.photoPopup.headerTab}>{albumImages[0].group_name ?? ""}</PretendText>
//             )
//         }

//         return (
//             <View style={mineCompoStyle.photoPopup.headerCenterCon}>
//                 <CustomButton onPress={() => setDisPlayType(DispLayType.Image)}>
//                     <PretendText
//                         style={
//                             displayType == DispLayType.Image
//                                 ? mineCompoStyle.photoPopup.headerTabActive
//                                 : mineCompoStyle.photoPopup.headerTab
//                         }
//                     >
//                         사진
//                     </PretendText>
//                 </CustomButton>
//                 <CustomButton onPress={() => setDisPlayType(DispLayType.Album)}>
//                     <PretendText
//                         style={
//                             displayType == DispLayType.Album
//                                 ? mineCompoStyle.photoPopup.headerTabActive
//                                 : mineCompoStyle.photoPopup.headerTab
//                         }
//                     >
//                         앨범
//                     </PretendText>
//                 </CustomButton>
//             </View>
//         )
//     }

//     const onBackToAlbum = () => {
//         setAlbumImages([])
//         setDisPlayType(DispLayType.Album)
//     }

//     const renderLeftHeader = () => {
//         if (displayType == DispLayType.AlbumDetail) {
//             return (
//                 <CustomButton onPress={onBackToAlbum}>
//                     <PretendText style={mineCompoStyle.photoPopup.headerCancel}>뒤로가기</PretendText>
//                 </CustomButton>
//             )
//         }

//         return (
//             <CustomButton onPress={onClose}>
//                 <PretendText style={mineCompoStyle.photoPopup.headerCancel}>취소</PretendText>
//             </CustomButton>
//         )
//     }

//     return (
//         <View style={mineCompoStyle.photoPopup.con}>
//             <View style={mineCompoStyle.photoPopup.header}>
//                 {renderLeftHeader()}
//                 {renderCenterHeader()}
//                 <CustomButton onPress={onSelect} disabled={!selectPhoto.uri}>
//                     <PretendText
//                         style={
//                             selectPhoto.uri
//                                 ? mineCompoStyle.photoPopup.headerSelect
//                                 : mineCompoStyle.photoPopup.headerCancel
//                         }
//                     >
//                         선택
//                     </PretendText>
//                 </CustomButton>
//             </View>
//             {renderContent()}
//         </View>
//     )
// }

export const PhotoNftPopup = (props: {
    setEditedImg: React.Dispatch<
        React.SetStateAction<{
            name: string | undefined
            type: number | undefined
            nftSeq: number
        }>
    >
    editedImg: {
        name: string | undefined
        type: number | undefined
        nftSeq: number
    }
}) => {
    const popUpDispatch = useWrapDispatch(setPopUp)
    const modalDispatch = useWrapDispatch(setModal)
    const [selectPhoto, setSelectPhoto] = useState(props.editedImg)
    const [myNfts, setMyNfts] = useState<NftApiData.NftList.ResDto["data"]>()
    const [page, setPage] = useState(2)

    const [sortKey, setSortKey] = useState<NftSortKey>(1)

    const [visible, setVisible] = useState<boolean>(false)
    const onClose = () => {
        popUpDispatch({
            open: false,
        })
        modalDispatch({
            open: false,
        })
    }
    const getNftList = async () => {
        const data = await nftSvc.getMyNftListSpending({ order: "DESC", take: 0, page: 1, filterType: "profile" })
        if (!data) return
        setMyNfts(data.data)
    }

    // const onAddMoreNft = async () => {
    //     const data = await nftSvc.getMyNftListSpending({ order: "DESC", take: 0, page, filterType: "profile" })
    //     if (!data.data.length || !myNfts || myNfts.findIndex(nft => nft.seq === data.data[0].seq) !== -1) return

    //     setMyNfts([...myNfts, ...data.data])
    //     setPage(page => page + 1)
    // }

    useEffect(() => {
        getNftList()
    }, [])

    const onSelect = () => {
        props.setEditedImg(selectPhoto)
        onClose()
    }
    if (!myNfts) return <></>

    console.log(selectPhoto)

    const filterList = nftSvc.listSort(sortKey, myNfts)

    const insets = useSafeAreaInsets()

    return (
        <View style={{
            marginTop: RatioUtil.height(44),
            // ...RatioUtil.margin(44),
            // width: RatioUtil.width(360),
            // height: RatioUtil.height(648),
            ...RatioUtil.size(360, 640),
            backgroundColor: Colors.WHITE,
            // borderTopLeftRadius: 15,
            // borderTopRightRadius: 15,
            ...RatioUtil.borderRadius(15, 15),
        }}>
            <View style={{
                paddingTop: RatioUtil.heightFixedRatio(18),
                paddingHorizontal: RatioUtil.width(20),
                flexDirection: "row",
                width: RatioUtil.width(360),
                justifyContent: "space-between",
                ...RatioUtil.margin(0, 0, 24, 0),
            }}>
                <CustomButton onPress={onClose}>
                    <PretendText style={mineCompoStyle.photoPopup.headerCancel}>
                        {/* 취소 */}
                        {jsonSvc.findLocalById("1021")}
                    </PretendText>
                </CustomButton>
                <PretendText style={mineCompoStyle.photoPopup.headerTitle}>
                    {/* NFT 프로필 선택하기 */}
                    {jsonSvc.findLocalById("170021")}
                </PretendText>
                <CustomButton onPress={onSelect} disabled={!selectPhoto.name}>
                    <PretendText
                        style={
                            selectPhoto.name
                                ? mineCompoStyle.photoPopup.headerSelect
                                : mineCompoStyle.photoPopup.headerCancel
                        }
                    >
                        {/* 선택 */}
                        {jsonSvc.findLocalById("2022")}
                    </PretendText>
                </CustomButton>
            </View>
            <View
                style={{
                    marginHorizontal: RatioUtil.width(20),
                    ...RatioUtil.sizeFixedRatio(320, 54),
                    ...RatioUtil.padding(10, 13, 10, 13),
                    backgroundColor: Colors.GRAY9,
                    ...RatioUtil.borderRadius(10),
                }}
            >
                <PretendText style={{ color: Colors.GRAY3, fontSize: RatioUtil.font(12) }}>
                    {/* 프로필로 지정한 NFT를 판매하거나 지갑으로 이동시킬 경우 프로필 이미지 적용에서 자동 해제됩니다. */}
                    {jsonSvc.findLocalById("170024")}
                </PretendText>
            </View>

            {myNfts.length !== 0 ? (
                <View style={{ 
                    ...RatioUtil.sizeFixedRatio(360, 40),
                    flexDirection: "row",
                    alignItems: "center",
                    ...RatioUtil.marginFixedRatio(8, 0, 8, 0),
                    justifyContent: "flex-end" }}>
                    <CustomButton
                        style={{
                            ...mineCompoStyle.photoNftPopup.menuBox,
                            width: RatioUtil.width(130),
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
                                setVisible(true)
                                // modalDispatch({
                                //     open: true,
                                //     children: (
                                //         <View
                                //             style={{
                                //                 ...RatioUtil.size(360, 500),
                                //                 backgroundColor: Colors.WHITE,
                                //                 marginTop: RatioUtil.height(402),
                                //                 borderRadius: RatioUtil.width(10),
                                //             }}
                                //         >
                                //             <View
                                //                 style={{
                                //                     borderRadius: RatioUtil.width(10),
                                //                     height: RatioUtil.height(60),
                                //                     alignItems: "center",
                                //                     justifyContent: "center",
                                //                 }}
                                //             >
                                //                 <View
                                //                     style={{
                                //                         alignItems: "center",
                                //                         justifyContent: "center",
                                //                     }}
                                //                 >
                                //                     <PretendText
                                //                         style={{
                                //                             textAlign: "center",
                                //                             color: Colors.BLACK,
                                //                             fontWeight: "700",
                                //                             fontSize: RatioUtil.font(16),
                                //                         }}
                                //                     >
                                //                         {jsonSvc.findLocalById("120022")}
                                //                     </PretendText>
                                //                 </View>
                                //                 <CustomButton
                                //                     style={{
                                //                         position: "absolute",
                                //                         right: RatioUtil.width(20),
                                //                     }}
                                //                     onPress={() => {
                                //                         modalDispatch({ open: false })
                                //                     }}
                                //                 >
                                //                     <Image
                                //                         source={nftDetailImg.close}
                                //                         style={{
                                //                             width: RatioUtil.width(25),
                                //                             height: RatioUtil.width(25),
                                //                         }}
                                //                         resizeMode="contain"
                                //                     />
                                //                 </CustomButton>
                                //             </View>

                                //             {nftSortMenu.map((v, i) => (
                                //                 <CustomButton
                                //                     style={{
                                //                         height: RatioUtil.height(60),
                                //                         ...RatioUtil.padding(19, 0, 19, 20),
                                //                         backgroundColor:
                                //                             sortKey === v.key ? Colors.GRAY7 : Colors.WHITE,
                                //                     }}
                                //                     onPress={() => {
                                //                         setSortKey(v.key)
                                //                         modalDispatch({ open: false })
                                //                     }}
                                //                     key={i}
                                //                 >
                                //                     <PretendText
                                //                         style={{
                                //                             color: Colors.BLACK,
                                //                             fontSize: RatioUtil.font(16),
                                //                             fontWeight: sortKey === v.key ? "600" : "400",
                                //                         }}
                                //                     >
                                //                         {v.title}
                                //                     </PretendText>
                                //                 </CustomButton>
                                //             ))}
                                //         </View>
                                //     ),
                                // })
                            }}
                        >
                            {nftSvc.getSortTitle(sortKey)}
                        </PretendText>
                    </CustomButton>
                    
                </View>
            ) : null}

            <ScrollView
                contentContainerStyle={[
                    mineCompoStyle.photoPopup.galleryScroll,
                    {
                        width: "100%",
                        paddingBottom: RatioUtil.height(80),
                    },
                ]}
                onScroll={e => {
                    let bottom = 1
                    bottom += e.nativeEvent.layoutMeasurement.height

                    if (e.nativeEvent.contentOffset.y + bottom >= e.nativeEvent.contentSize.height) {
                        // onAddMoreNft()
                    }
                }}
                style={{
                    marginHorizontal: RatioUtil.width(20)
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        width: RatioUtil.width(320),
                    }}
                >
                    {filterList.length !== 0 ? (
                        filterList.map((v, i) => {
                            return (
                                <Fragment key={i}>
                                    <CustomButton
                                        key={i}
                                        style={{
                                            ...RatioUtil.sizeFixedRatio(155, 220),
                                            marginTop: RatioUtil.height(5),
                                            marginBottom: RatioUtil.height(5),
                                        }}
                                        onPress={() => {
                                            setSelectPhoto({
                                                name: `${v.season}_${v.playerCode}_${v.grade}_${v.seq}`,
                                                type: IconType.NFT,
                                                nftSeq: v.seq,
                                            })
                                        }}
                                    >
                                        <View>
                                            {selectPhoto.name === `${v.season}_${v.playerCode}_${v.grade}_${v.seq}` && (
                                                <View
                                                    style={{
                                                        backgroundColor: "rgba(0,0,0,0.4)",
                                                        ...RatioUtil.sizeFixedRatio(155, 220),
                                                        borderRadius: RatioUtil.width(25),
                                                        position: "absolute",
                                                        zIndex: 5,
                                                    }}
                                                />
                                            )}
                                            <NftImage
                                                level={v.level}
                                                grade={v.grade}
                                                playerCode={v.playerCode}
                                                birdie={v.golf.birdie}
                                                energy={v.energy}
                                                sortKey={sortKey}
                                            />
                                        </View>

                                        {selectPhoto.name === `${v.season}_${v.playerCode}_${v.grade}_${v.seq}` && (
                                            <View
                                                style={{
                                                    ...mineCompoStyle.photoPopup.check,
                                                    bottom: RatioUtil.width(190),
                                                    left: RatioUtil.width(122),
                                                }}
                                            >
                                                <Image
                                                    source={myPageImg.checkPhoto2}
                                                    style={{
                                                        zIndex: 6,
                                                        ...RatioUtil.size(20, 20),
                                                    }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                        )}
                                    </CustomButton>
                                </Fragment>
                            )
                        })
                    ) : (
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "flex-start",
                                paddingTop: RatioUtil.height(20),
                            }}
                        >
                            <CustomButton
                                onPress={() => {
                                    popUpDispatch({ open: false })
                                    navigate(Screen.NFTTABSCENE)
                                }}
                                style={{
                                    ...RatioUtil.size(320, 140),
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderWidth: 1,
                                    borderRadius: 20,
                                    borderStyle: "dashed",
                                    marginTop: RatioUtil.height(20),
                                }}
                            >
                                <Image
                                    source={playerCardImg.nftAdd}
                                    style={{
                                        ...RatioUtil.size(20, 20),
                                        marginBottom: RatioUtil.height(10),
                                    }}
                                />
                                {/* <PretendText>보유한 NFT가 없습니다.</PretendText>
                            <PretendText>NFT를 획득해보세요!</PretendText> */}
                                <PretendText
                                    style={{
                                        fontSize: RatioUtil.font(14),
                                        color: Colors.GRAY3,
                                        textAlign: "center",
                                    }}
                                >
                                    {jsonSvc.findLocalById("120019")}
                                </PretendText>
                            </CustomButton>
                        </View>
                    )}
                </View>
            </ScrollView>
            {visible && (
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundColor: `${Colors.BLACK}90`,
                    }}
                    onPress={() => setVisible(false)}
                >
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
                                        fontWeight: "700",
                                        fontSize: RatioUtil.font(16),
                                    }}
                                >
                                    {jsonSvc.findLocalById("120022")}
                                </PretendText>
                            </View>
                            <CustomButton
                                style={{
                                    position: "absolute",
                                    right: RatioUtil.width(20),
                                }}
                                onPress={() => {
                                    setVisible(false)
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
                                style={{
                                    height: RatioUtil.heightFixedRatio(60),
                                    ...RatioUtil.paddingFixedRatio(0, 0, 0, 20),
                                    backgroundColor: sortKey === v.key ? Colors.GRAY7 : Colors.WHITE,
                                    justifyContent: "center",
                                }}
                                onPress={() => {
                                    setSortKey(v.key)
                                    setVisible(false)
                                }}
                                key={i}
                            >
                                <PretendText
                                    style={{
                                        color: Colors.BLACK,
                                        fontSize: RatioUtil.font(16),
                                        fontWeight: sortKey === v.key ? RatioUtil.fontWeightBold() : "400",
                                    }}
                                >
                                    {v.title}
                                </PretendText>
                            </CustomButton>
                        ))}
                    </View>
                </TouchableOpacity>
            )}
        </View>
    )
}
const LogoutModal = () => {
    const modalDispatch = useWrapDispatch(setModal)

    const onLogout = async () => {
        await Analytics.logEvent(AnalyticsEventName.click_logout_check_420, {
            hasNewUserData: true,
        })
        const isSignOut = await signSvc.logout()
        if (isSignOut !== null) {
            modalDispatch({
                open: false,
            })
            navigateReset(Screen.SIGNIN)
        }
    }

    return (
        <View style={mineCompoStyle.logoutModal.con}>
            <View
                style={{
                    padding: RatioUtil.width(10),
                }}
            >
                <PretendText style={mineCompoStyle.logoutModal.text}>
                    {/* 로그아웃 하시겠습니까? */}
                    {jsonSvc.findLocalById("10000024")}
                </PretendText>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    marginTop: RatioUtil.height(20),
                    width: RatioUtil.width(232),
                    justifyContent: "space-between",
                }}
            >
                <CustomButton
                    style={{ ...mineCompoStyle.logoutModal.buttonCon, backgroundColor: Colors.GRAY7 }}
                    onPress={() => modalDispatch({ open: false })}
                >
                    <PretendText style={{ ...mineCompoStyle.logoutModal.buttonText, color: Colors.BLACK2 }}>
                        {/* 취소 */}
                        {jsonSvc.findLocalById("1021")}
                    </PretendText>
                </CustomButton>
                <CustomButton
                    style={{ ...mineCompoStyle.logoutModal.buttonCon, backgroundColor: Colors.BLACK }}
                    onPress={onLogout}
                >
                    <PretendText style={{ ...mineCompoStyle.logoutModal.buttonText, color: Colors.WHITE }}>
                        {/* 확인 */}
                        {jsonSvc.findLocalById("1012")}
                    </PretendText>
                </CustomButton>
            </View>
        </View>
    )
}

export const SettingCompo = {
    LogoutModal,
}
