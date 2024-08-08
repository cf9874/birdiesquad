import { API_URL, TOKEN_ID } from "utils/env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import API_CALLER from "apis"
import { doOpenNft } from "apis/endpoints"
import { NFTCardImages } from "assets/images"
import { MyPageFooter } from "components/layouts"
import { useEffect, useState } from "react"
import { Alert, Dimensions, Image, ImageBackground, Modal, SafeAreaView, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import { scaleSize } from "styles/minixs"
import PlayerData from "../../../json/nft_player.json"
import { styles } from "./styles"

const Mynftlist = (props: any) => {
    const { data } = useSelector((state: any) => ({
        data: state?.seasonReducer?.data,
    }))
    const { width } = Dimensions.get("window")
    const [isEnable, setIsEnable] = useState(false)
    const [Player, setPlayer] = useState<Object>()
    const [isVisible, setIsVisible] = useState(true)
    const [searchValue, setSearchValue] = useState("")
    const [selectedImageIndex, setselectedImageIndex] = useState(-1)
    const [showModal1, setshowModal1] = useState<boolean>(false)

    useEffect(() => {
        callDoOpenNftApi()
    }, [])

    const callDoOpenNftApi = async () => {
        const token = await AsyncStorage.getItem(TOKEN_ID)
        await API_CALLER.post(
            API_URL + doOpenNft,
            {
                ITEM_SEQ: props?.route?.params?.seq,
            },
            {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(response => {
                setPlayer(
                    PlayerData?.filter(
                        item =>
                            item?.nPersonID === response?.data?.data?.NFT?.PLAYER_CODE &&
                            item?.nSeasonKey === props?.route?.params?.seasonKey
                    )[0]
                )
                // console.warn(1234567890, response?.data?.data?.NFT?.PLAYER_CODE, PlayerData?.filter(item => item?.nPersonID == response?.data?.data?.NFT?.PLAYER_CODE && item?.nSeasonKey == props?.route?.params?.seasonKey)[0]);

                console.warn(response)
            })
            .catch(error => {
                // console.warn(error);
                Alert.alert(error.toString())
            })
    }

    return (
        <SafeAreaView style={styles.mainView}>
            <View style={styles.headerView}>
                <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.backButton}>
                    <Image resizeMode="contain" source={NFTCardImages.back} style={styles.backImage} />
                </TouchableOpacity>
                {/* <View style={styles.headerTitleView}>
          <Text style={styles.headerTitle}>상품 구입</Text>
        </View> */}
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent
                style={{
                    flex: 1,
                    backgroundColor: "red",
                }}
                visible={isVisible}
            >
                <View style={styles.modalMainView}>
                    <TouchableOpacity onPress={() => setIsVisible(false)}>
                        <ImageBackground source={NFTCardImages.NFTCard3} style={styles.modalView}>
                            <Image
                                borderRadius={scaleSize(100)}
                                source={{ uri: Player?.sPlayerImagePath }}
                                style={styles.playerImage}
                            />
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </Modal>
            <MyPageFooter></MyPageFooter>
        </SafeAreaView>
    )
}

export default Mynftlist
