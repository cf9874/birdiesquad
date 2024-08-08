import { useNavigation } from "@react-navigation/native"

import { mySquadSvc } from "apis/services/mySquad.svc"
import { ProfileHeader } from "components/layouts"
import MySquadNFTImage from "components/utils/MySquadNFTImage"
import { Screen } from "const/navigate.const"
import React, { useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { navigate, RatioUtil } from "utils"
import { useDispatch, useSelector } from "react-redux"
import { mySquadNft } from "store/reducers/mySquad.reducer"
import { jsonSvc, nftSvc } from "apis/services"
import { myPageImg, nftDetailImg, playerCardImg } from "assets/images"
import { CustomButton, PretendText } from "components/utils"
import { NftSortKey, Dimension, nftSortMenu } from "const"
import { useWrapDispatch } from "hooks"
import { Colors } from "react-native/Libraries/NewAppScreen"
import SlidingUpPanel from "rn-sliding-up-panel"
import { setPopUp } from "store/reducers/config.reducer"
import { mineCompoStyle } from "styles"
import { NFT_S3 } from "utils/env"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import FastImage from "react-native-fast-image"

const MySquadSelect = ({ route }: any) => {
    const gameSeq = useSelector((state: any) => state.mySquadReducer.gameSeq)
    const myNftList = useSelector((state: any) => state.mySquadReducer.mySquadNft)

    const { selectedTitle, selectedIdx, mySquadData } = route.params

    const navigation = useNavigation()

    const [allowDragging, setAllowDragging] = useState<boolean>(true)
    const [selectedData, setSelectedData] = useState({})
    const dispatch = useDispatch()

    const [isChecked, setIsChecked] = useState<boolean[]>([])

    useEffect(() => {
        if (myNftList?.nfts) {
            setIsChecked(Array(myNftList?.nfts.length).fill(false))
        }
    }, [])

    const handleCheckboxChange = (index: number, value: boolean, data: any) => {
        const isSlotEquipped = mySquadData?.players?.find((player: any) => player.userNftSeq === data.userNftSeq)

        // isParticipating 출전 여부 (true : 출전, false : 미출전)
        // isSlotEquipped : 장착여부 (undefined : 미장착, object : 장착)

        if (data.isParticipating && isSlotEquipped === undefined) {
            setIsChecked(prevState => {
                const newState = prevState.map((isChecked, idx) => (idx === index ? value : false))
                return newState
            })

            const selectData = value ? data : {}
            setSelectedData(selectData)
        }
    }

    const getMySquadNftsList = async () => {
        const mynftList = await mySquadSvc.getMySquadNftsList(gameSeq)
        dispatch(mySquadNft(mynftList))
        // 체크박스 변수 설정
        let initCheckVal = []
        for (let i = 0; i < mynftList.nfts.length; i++) {
            initCheckVal.push(false)
        }
        setIsChecked(initCheckVal)
    }

    useEffect(() => {
        getMySquadNftsList()
    }, [gameSeq])

    const selectedPlayerCard = (data: any) => {
        navigation.navigate(Screen.MYSQUAD, { selectedData: data, selectedIdx })
    }

    const saveButtonBackgroundColor = isChecked.some(value => value) ? "#000000" : "#E9ECEF"
    const saveButtonTextColor = isChecked.some(value => value) ? "#FFFFFF" : "#C7C7C7"
    const isAnyDataSelected = isChecked.some(value => value)

    const handleCardImagePress = (data: any, index: number) => {
        if (data.isParticipating === false || data.isEquipped === true) {
            return
        }
    }
    //정렬 popup
    const popUpDispatch = useWrapDispatch(setPopUp)
    const [itemVisible, setItemVisible] = useState<boolean>(true)
    const [isGrow, setIsGrow] = useState<boolean>(false)
    const [isSwipeUp, setIsSwipeUp] = useState(false)

    const refSlidingUpPanel = useRef<SlidingUpPanel | null>(null)
    const [sortKey, setSortKey] = useState<NftSortKey>(2)

    const sortNftList = (nftList: any[], sortKey: number) => {
        if (!nftList) {
            return nftList
        }
        let sortedList = [...nftList]
        switch (sortKey) {
            case 1:
                sortedList.sort((a, b) => {
                    // 최신순(획득순)
                    if (a.userNftSeq !== b.userNftSeq) {
                        return b.userNftSeq - a.userNftSeq
                    } else if (a.nftGrade !== b.nftGrade) {
                        return b.nftGrade - a.nftGrade // 등급순
                    } else if (a.nftLevel !== b.nftLevel) {
                        return b.nftLevel - a.nftLevel // 레벨순
                    } else if (a.birdie !== b.birdie) {
                        return b.birdie - a.birdie // 버디순
                    } else {
                        return a.energy - b.energy // 에너지순
                    }
                })
                break
            case 4:
                sortedList.sort((a, b) => {
                    //버디
                    if (a.birdie !== b.birdie) {
                        return b.birdie - a.birdie
                        // 등급순
                    } else if (a.nftGrade !== b.nftGrade) {
                        return b.nftGrade - a.nftGrade
                        // 레벨순
                    } else if (a.nftLevel !== b.nftLevel) {
                        return b.nftLevel - a.nftLevel
                        // 에너지순
                    } else if (a.energy !== b.energy) {
                        return a.energy - b.energy
                    } else {
                        // 최신순(획득순)
                        return b.userNftSeq - a.userNftSeq
                    }
                })
                break
            case 3:
                sortedList.sort((a, b) => {
                    //레벨
                    if (a.nftLevel !== b.nftLevel) {
                        return b.nftLevel - a.nftLevel
                    } else if (a.nftGrade !== b.nftGrade) {
                        return b.nftGrade - a.nftGrade // 등급순
                    } else if (a.birdie !== b.birdie) {
                        return b.birdie - a.birdie // 버디순
                    } else if (a.energy !== b.energy) {
                        return a.energy - b.energy // 에너지순
                    } else {
                        return b.userNftSeq - a.userNftSeq // 최신순(획득순)
                    }
                })
                break
            case 5:
                sortedList.sort((a, b) => {
                    //에너지순
                    if (a.energy !== b.energy) {
                        return a.energy - b.energy
                    } else if (a.nftGrade !== b.nftGrade) {
                        return b.nftGrade - a.nftGrade // 등급순
                    } else if (a.nftLevel !== b.nftLevel) {
                        return b.nftLevel - a.nftLevel // 레벨
                    } else if (a.birdie !== b.birdie) {
                        return b.birdie - a.birdie // 버디
                    } else {
                        return b.userNftSeq - a.userNftSeq // 최신순(획득순)
                    }
                })
                break
            case 6:
                sortedList.sort((a, b) => {
                    //에너지순
                    const nameCompare = a.name.localeCompare(b.name)
                    if (nameCompare !== 0) {
                        return nameCompare
                    } else if (a.nftGrade !== b.nftGrade) {
                        return b.nftGrade - a.nftGrade // 등급순
                    } else if (a.nftLevel !== b.nftLevel) {
                        return b.nftLevel - a.nftLevel // 레벨
                    } else if (a.birdie !== b.birdie) {
                        return b.birdie - a.birdie // 버디
                    } else if (a.energy !== b.energy) {
                        return a.energy - b.energy
                    } else {
                        return b.userNftSeq - a.userNftSeq // 최신순(획득순)
                    }
                })
                break
            default:
            case 2:
                sortedList.sort((a, b) => {
                    //등급순
                    if (a.nftGrade !== b.nftGrade) {
                        return b.nftGrade - a.nftGrade
                    } else if (a.nftLevel !== b.nftLevel) {
                        return b.nftLevel - a.nftLevel //레벨
                    } else if (a.birdie != b.birdie) {
                        return b.birdie - a.birdie // 버디
                    } else if (a.energy !== b.energy) {
                        return a.energy - b.energy // 에너지
                    } else {
                        return b.userNftSeq - a.userNftSeq // 최신순(획득순)
                    }
                })
                break
        }

        return sortedList
    }

    const [sortedNftList, setSortedNftList] = useState<any[]>([])

    useEffect(() => {
        const sortedList = sortNftList(myNftList?.nfts, sortKey)
        setSortedNftList(sortedList)
    }, [sortKey, myNftList])
    useEffect(() => {
        const backAction = () => {
            navigate(Screen.BACK)
            return true
        }

        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
        return () => backHandler.remove()
    }, [])

    const insets = useSafeAreaInsets()

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ marginTop: Platform.OS === "ios" ? 0 : RatioUtil.lengthFixedRatio(20) }}>
                <ProfileHeader title={selectedTitle} />
            </View>

            <View
                style={{
                    ...RatioUtil.size(320, 54),
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginLeft: RatioUtil.width(20),
                    height: RatioUtil.height(54),
                }}
            >
                <CustomButton
                    style={{
                        ...mineCompoStyle.photoNftPopup.menuBox,
                    }}
                    onTouchStart={() => setAllowDragging(false)}
                    onTouchEnd={() => setAllowDragging(true)}
                    onTouchCancel={() => setAllowDragging(true)}
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
                            if (!isSwipeUp) {
                                refSlidingUpPanel?.current?.show()
                                setIsSwipeUp(true)
                            }
                            setItemVisible(true)
                            setIsGrow(false)
                            popUpDispatch({
                                open: true,
                                children: (
                                    <View
                                        style={{
                                            width: RatioUtil.width(360),
                                            height: RatioUtil.heightFixedRatio(416),
                                            backgroundColor: "white",
                                            marginTop:
                                                RatioUtil.height(Dimension.BASE.HEIGHT) -
                                                RatioUtil.heightFixedRatio(416) +
                                                1,
                                            borderRadius: RatioUtil.width(20),
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
                                                    popUpDispatch({ open: false })
                                                }}
                                            >
                                                <FastImage
                                                    source={nftDetailImg.close}
                                                    style={{
                                                        width: RatioUtil.width(25),
                                                        height: RatioUtil.width(25),
                                                    }}
                                                    resizeMode={FastImage.resizeMode.contain}
                                                />
                                            </CustomButton>
                                        </View>
                                        {nftSortMenu.map((v, i) => {
                                            return (
                                                <CustomButton
                                                    style={{
                                                        height: RatioUtil.heightFixedRatio(60),
                                                        ...RatioUtil.paddingFixedRatio(0, 0, 0, 20),
                                                        backgroundColor:
                                                            sortKey === v.key ? Colors.GRAY7 : Colors.WHITE,
                                                        justifyContent: "center",
                                                    }}
                                                    onPress={() => {
                                                        setSortKey(v.key)
                                                        popUpDispatch({ open: false })
                                                    }}
                                                    key={i}
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
                                            )
                                        })}
                                    </View>
                                ),
                            })
                        }}
                    >
                        {nftSvc.getSortTitle(sortKey)}
                    </PretendText>
                </CustomButton>
            </View>
            {myNftList.nfts ? (
                <FlatList
                    data={sortedNftList}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    renderItem={({ item: data, index }) => {
                        const selectedSlot = mySquadData?.players?.find(
                            (player: any) => player.userNftSeq === data.userNftSeq
                        )

                        const selectedSlotIdx = mySquadData?.players?.findIndex(
                            (player: any) => player.userNftSeq === data.userNftSeq
                        )

                        const isLastItem = index === sortedNftList.length - 1

                        return (
                            <TouchableOpacity
                                key={index}
                                style={{
                                    margin: RatioUtil.height(10),
                                    marginBottom: isLastItem ? 100 : 0,
                                }}
                                onPress={() => handleCardImagePress(data, index)}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        if (data.isParticipating === true && !selectedSlot) {
                                            navigate(Screen.MYSQUADNFTDETAIL, {
                                                nftseq: data.userNftSeq,
                                                data,
                                                selectedIdx,
                                            })
                                        }
                                    }}
                                >
                                    <View
                                        style={[
                                            styles.imageContainer,
                                            data.isParticipating === false || selectedSlot ? styles.dimImage : null,
                                            isChecked[index] ? styles.selectDimImage : null,
                                        ]}
                                    >
                                        <MySquadNFTImage
                                            grade={data.maxReward}
                                            birdie={data.birdie}
                                            energy={data.energy}
                                            level={data.nftLevel}
                                            playerCode={data.playerCode}
                                            checkImg={true}
                                            isChecked={isChecked[index]}
                                            sortKey={sortKey}
                                            onCheckboxChange={(value: boolean) => {
                                                handleCheckboxChange(index, value, data)
                                            }}
                                            background={NFT_S3 + data.gradeImagePath}
                                            style={{
                                                width: RatioUtil.lengthFixedRatio(155),
                                                height: RatioUtil.lengthFixedRatio(220),
                                            }}
                                        />
                                    </View>
                                    <View style={styles.dimContainer}>
                                        {data.isParticipating === false && (
                                            <Text style={styles.noParticulatingText}>{"미출전 프로"}</Text>
                                        )}
                                    </View>
                                    <View style={styles.dimContainer}>
                                        {selectedSlot && (
                                            <Text style={styles.noParticulatingText}>{`SLOT ${
                                                selectedSlotIdx + 1
                                            } 배치 됨`}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        )
                    }}
                />
            ) : (
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                    }}
                >
                    <CustomButton
                        onPress={() => {
                            navigate(Screen.NFTTABSCENE)
                        }}
                        style={{
                            ...RatioUtil.size(320, 140),
                            justifyContent: "center",
                            alignItems: "center",
                            borderWidth: 1,
                            borderRadius: 20,
                            borderStyle: "dashed",
                            borderColor: "lightgray",
                            marginBottom: 20,
                        }}
                    >
                        <Image
                            source={playerCardImg.nftAdd}
                            style={{
                                ...RatioUtil.size(20, 20),
                                marginBottom: RatioUtil.height(10),
                            }}
                        />

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

            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: saveButtonBackgroundColor }]}
                    onPress={() => selectedPlayerCard(selectedData)}
                    disabled={!isAnyDataSelected}
                >
                    <View>
                        <Text style={[styles.buttonText, { color: saveButtonTextColor }]}>{"선택"}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 100,
        padding: 20,
        marginBottom: 20,
        width: RatioUtil.lengthFixedRatio(320),
        position: "absolute",
        bottom: 0,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
    imageContainer: {
        opacity: 1,
    },
    dimImage: {
        opacity: 0.4,
    },
    selectDimImage: {
        opacity: 0.4,
        backgroundColor: "#000000",
        width: RatioUtil.lengthFixedRatio(154),
        height: RatioUtil.lengthFixedRatio(220),
        borderRadius: 21,
    },
    dimContainer: {
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
    },
    noParticulatingText: {
        width: RatioUtil.lengthFixedRatio(115),
        height: RatioUtil.lengthFixedRatio(30),
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
        padding: 3,
        textAlign: "center",
        borderRadius: 10,
        fontSize: 12,
        marginTop: RatioUtil.lengthFixedRatio(13),
        paddingTop: RatioUtil.lengthFixedRatio(6),
        zIndex: 1,
        overflow: "hidden",
    },
    container: {
        width: "50%",
        alignItems: "center",
        paddingBottom: RatioUtil.lengthFixedRatio(20),
    },
})
export default MySquadSelect
