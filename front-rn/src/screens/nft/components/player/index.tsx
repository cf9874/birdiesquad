import { Alert, Image, ImageBackground, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { NFTCardImages, myPageImg, nftDetailImg } from "assets/images"
import { Colors, Screen } from "const"
import React, { useState } from "react"
import nftPlayerJson from "json/nft_player.json"

import { styles } from "./styles"
import { ConfigUtil, RatioUtil, navigate } from "utils"
import { nftSvc } from "apis/services/nft.svc"
import { useInputs } from "hooks"
import { SearchPlayer } from "screens/live/tab.cheer.compo"
import { CustomButton, PretendText } from "components/utils"
import { IPlayer } from "apis/data"
import { jsonSvc } from "apis/services"
import FastImage from "react-native-fast-image"

interface IPlayerPupUp {
    isVisible: boolean
    setIsVisible: Function
    itemSelection: any
    toNavigate: string
    setNftDisabled?: React.Dispatch<React.SetStateAction<boolean>>
}

export const PlayerPupUp = (props: IPlayerPupUp) => {
    const [searchValue, setSearchValue] = useState("")
    const [selectedImageIndex, setselectedImageIndex] = useState(-1)
    const [itemPlayerSelected, setItemPlayerSelected] = useState<any>(null)
    const [imageArray] = useState<any>(nftPlayerJson)
    const [select, setselect] = useState<IPlayer | null>()
    const { isVisible, setIsVisible, itemSelection } = props

    const [visibleChecked, setVisibleChecked] = useState<boolean>(false)

    const searchInput = useInputs({
        validCheck: () => {},
        value: "",
    })
    const onSelect = (v: IPlayer) => {
        if (v?.nID === select?.nID) {
            setselect(null)
            setVisibleChecked(false)
        } else {
            setselect(v)
            setVisibleChecked(true)
        }
    }
    const callDoOpenChoice = async () => {
        console.log(`response!!!!`, {
            ITEM_SEQ: itemSelection?.seq,
            PLAYER_CODE: select?.nPersonID,
        })
        if (select && itemSelection) {
            await nftSvc
                .doOpenChoice({
                    ITEM_SEQ: itemSelection?.seq,
                    PLAYER_CODE: select?.nPersonID,
                })
                .then(async (response: any) => {
                    if (response) {
                        setIsVisible(!isVisible)
                        navigate(Screen.UNBOXINGVIDEO, {
                            nftseq: response?.USER_NFT?.SEQ_NO,
                            playerCode: select?.nPersonID,
                            toNavigate: props.toNavigate,
                            nID: itemSelection.itemId,
                        })
                    }
                })
                .catch(error => {
                    console.warn(3, error), Alert.alert(error.toString())
                })
            setVisibleChecked(false)
            setselect(null)
        } else {
            Alert.alert("선수를 선택해주세요.")
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent
                onRequestClose={() => {
                    setIsVisible(false)
                }}
                visible={isVisible}
            >
                <View style={styles.modalView}>
                    <TouchableOpacity onPress={() => setIsVisible(!isVisible)} style={styles.outSideButton} />
                    <View style={styles.centeredView}>
                        <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}>
                            <View>
                                <View>
                                    <PretendText style={styles.playerSelectionTitle}>
                                        {/* 선수 선택 */}
                                        {jsonSvc.findLocalById("2035")}
                                    </PretendText>
                                    <CustomButton
                                        style={{
                                            position: "absolute",
                                            right: 0,
                                        }}
                                        onPress={() => {
                                            if (props.setNftDisabled) props.setNftDisabled(false)
                                            setIsVisible(false)
                                            setselect(null)
                                            searchInput.onClear()
                                        }}
                                    >
                                        <Image
                                            source={nftDetailImg.close}
                                            style={{
                                                width: RatioUtil.width(30),
                                                height: RatioUtil.width(30),
                                            }}
                                        />
                                    </CustomButton>
                                </View>
                                <SearchPlayer
                                    value={searchInput.value}
                                    onChange={searchInput.onChange}
                                    styleCustom={{
                                        height: RatioUtil.lengthFixedRatio(48),
                                        ...RatioUtil.margin(20, 0, 20, 0),
                                    }}
                                />
                                <View style={styles.imageBox}>
                                    {nftPlayerJson
                                        ?.filter(v => v.sPlayerName.includes(searchInput.value))
                                        .map((v, i) => (
                                            <CustomButton
                                                key={i}
                                                style={{
                                                    // ...mineCompoStyle.photoPopup.galleryBox,
                                                    ...RatioUtil.size(100, 144),
                                                    ...RatioUtil.margin(0, (i + 1) % 3 === 0 ? 0 : 10, 10, 0),
                                                    alignSelf: "center",
                                                }}
                                                onPress={() => {
                                                    onSelect(v)
                                                }}
                                            >
                                                {/* <Image
                                source={{ uri: ConfigUtil.getPlayerImage(v.sPlayerImagePath) }}
                                style={{
                                    ...RatioUtil.size(100, 144),
                                }}
                            /> */}
                                                <View
                                                    style={{
                                                        flexDirection: "column",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        ...RatioUtil.size(100, 124),
                                                        ...RatioUtil.margin(5, 5, 5, 5),
                                                        backgroundColor: Colors.GRAY9,
                                                        borderRadius: RatioUtil.height(10),
                                                    }}
                                                >
                                                    <FastImage
                                                        source={{ uri: ConfigUtil.getPlayerImage(v.sPlayerImagePath) }}
                                                        style={{
                                                            width: RatioUtil.height(60),
                                                            height: RatioUtil.height(60),
                                                            borderRadius: RatioUtil.height(60),
                                                        }}
                                                    />
                                                    <PretendText
                                                        style={{
                                                            marginTop: RatioUtil.height(7),
                                                            fontSize: RatioUtil.font(14),
                                                            lineHeight: RatioUtil.font(14) * 1.3,
                                                            fontWeight: "700",
                                                            color: Colors.BLACK,
                                                        }}
                                                    >
                                                        {v.sPlayerName}
                                                    </PretendText>
                                                    <PretendText
                                                        style={{
                                                            fontSize: RatioUtil.font(12),
                                                            lineHeight: RatioUtil.font(12) * 1.3,
                                                            fontWeight: "400",
                                                            color: Colors.GRAY8,
                                                        }}
                                                    >
                                                        {v.sTeam}
                                                    </PretendText>
                                                </View>

                                                {select?.nPersonID == v.nPersonID && visibleChecked ? (
                                                    <View
                                                        style={{
                                                            position: "absolute",
                                                            right: "10%",
                                                            top: "10%",
                                                        }}
                                                    >
                                                        <Image
                                                            source={myPageImg.checkPhoto}
                                                            style={{
                                                                width: RatioUtil.width(20),
                                                                height: RatioUtil.width(20),
                                                            }}
                                                            resizeMode="contain"
                                                        />
                                                    </View>
                                                ) : null}
                                            </CustomButton>
                                        ))}
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        callDoOpenChoice()
                        setselect(null)
                        searchInput.onClear()
                    }}
                    style={[styles.button, { backgroundColor: select?.nID ? Colors.BLACK : Colors.GRAY7 }]}
                >
                    <PretendText
                        style={[
                            styles.purchaseButtonTitle,
                            { color: selectedImageIndex > -1 ? Colors.WHITE : Colors.GRAY12 },
                        ]}
                    >
                        확인
                    </PretendText>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}
