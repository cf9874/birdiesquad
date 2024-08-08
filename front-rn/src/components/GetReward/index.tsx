import React, { useEffect, useState } from "react"
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TOKEN_ID } from "utils/env"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { rewardSvc } from "apis/services/reward.svc"
import { RatioUtil } from "utils"
import { Colors } from "const"
import { NFTCardImages } from "assets/images"
import { useFocusEffect } from "@react-navigation/native"
import { liveSvc } from "apis/services/live.svc"

const GetReward = () => {
    const [visible, setvisible] = useState<boolean>(false)
    const [gameId, setgameId] = useState<string | number>()

    const [data, setdata] = useState([
        { title: "BDST", image: NFTCardImages.bitcoin, value: "" },
        { title: "육성포인트", image: NFTCardImages.training, value: "" },
    ])

    useEffect(() => {
        // callApi()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            callApi()
        }, [])
    )

    const callApi = async () => {
        const seasonKey = await liveSvc.getSetSeason()
        const getGames = await rewardSvc.getGamesApi({ gameId: seasonKey })
        const endDateFilter = 7
        const filteredArray = getGames?.data?.filter(item => {
            const endDate = new Date(
                item.endDate.substring(0, 4),
                item.endDate.substring(4, 6) - 1,
                item.endDate.substring(6, 8)
            ).getTime()
            const pastEndDate = new Date(new Date().setDate(new Date().getDate() - endDateFilter))
            const currentDate = new Date()
            return endDate >= pastEndDate && endDate <= currentDate
        })
        const checkReward = await rewardSvc.getTourRewardCheckApi(filteredArray[0]?.gameId)

        setgameId(filteredArray[0]?.gameId)

        const currentDate = new Date()
        const currentDay = currentDate.getDay()
        const currentTime = currentDate.getTime() - new Date().setHours(0, 0, 0, 0)
        const mondayStart = new Date()
        mondayStart.setHours(0, 10, 0, 0)
        mondayStart.setDate(mondayStart.getDate() - (currentDay === 0 ? 6 : currentDay - 1))
        const wednesdayEnd = new Date()
        wednesdayEnd.setHours(23, 59, 59, 999)
        wednesdayEnd.setDate(mondayStart.getDate() + 2)

        if (
            !checkReward?.data &&
            currentDate.getTime() >= mondayStart.getTime() &&
            currentDate.getTime() <= wednesdayEnd.getTime()
        ) {
            const tourReward = await rewardSvc.getTourRewardApi(filteredArray[0]?.gameId)
            var newArray = data
            tourReward?.code == "SUCCESS"
                ? (setvisible(true),
                  (newArray[0].value = tourReward?.data?.REWARD_BDST),
                  (newArray[1].value = tourReward?.data?.REWARD_TRAINING),
                  setdata([...newArray]))
                : null
        }
    }

    return (
        // <Modal
        //     transparent
        //     visible={visible}
        //     style={{ flex: 1 }}
        // >
        //     <View style={styles.mainView}>
        //         <View style={styles.innerView}>
        //             <Text style={styles.title}>투어 대회 보상</Text>
        //             <Text style={styles.desc}>7월 1일 ~ 7월 3일</Text>
        //             <Text style={[styles.desc, {
        //                 marginBottom: RatioUtil.height(25),
        //             }]}>모나미파크 오픈 with SBS Golf</Text>
        //             {
        //                 data?.map((item: any) => (
        //                     <View style={styles.dataMainView}>
        //                         <View style={styles.dataInnerView}>
        //                             <Image source={item?.image} style={styles.dataImage} />
        //                             <Text style={styles.dataTitle}>{item?.title}</Text>
        //                         </View>
        //                         <Text style={styles.dataDesc}>{item?.value}</Text>
        //                     </View>
        //                 ))
        //             }
        //             <View style={styles.bottomDescMainView}>
        //                 <View style={styles.bottomDotView}/>
        //                 <Text style={styles.bottomDesc}>BDST 보상은 패널티와 수수료가 적용 된 결과 입니다.</Text>
        //             </View>
        //             <TouchableOpacity activeOpacity={.9} onPress={async() => {
        //                 const token = await AsyncStorage.getItem(TOKEN_ID)
        //                 const res = await getPostTourRewardApi(gameId, token)
        //                 res?.code == 'SUCCESS' ? setvisible(false) : null

        //             }} style={styles.buttonView}>
        //                 <Text style={styles.buttonText}>수령하기</Text>
        //             </TouchableOpacity>
        //         </View>
        //     </View>
        // </Modal>
        <></>
    )
}

export default GetReward

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: "#00000080",
        alignItems: "center",
        justifyContent: "center",
    },
    innerView: {
        width: RatioUtil.width(270),
        backgroundColor: Colors.WHITE,
        borderRadius: RatioUtil.width(15),
        alignItems: "center",
        paddingVertical: RatioUtil.height(30),
    },
    title: {
        fontSize: RatioUtil.width(17),
        lineHeight: RatioUtil.width(19),
        fontWeight: "700",
        color: Colors.BLACK,
        marginBottom: RatioUtil.height(25),
    },
    desc: {
        fontSize: RatioUtil.width(13),
        lineHeight: RatioUtil.width(15),
        color: Colors.BLACK,
    },
    dataMainView: {
        backgroundColor: Colors.WHITE3,
        height: RatioUtil.width(45),
        width: "85%",
        marginTop: RatioUtil.width(5),
        borderRadius: RatioUtil.width(5),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: RatioUtil.width(20),
    },
    dataInnerView: {
        flexDirection: "row",
        alignItems: "center",
    },
    dataImage: {
        height: RatioUtil.width(13),
        width: RatioUtil.width(13),
    },
    dataTitle: {
        fontSize: RatioUtil.width(13),
        lineHeight: RatioUtil.width(15),
        fontWeight: "700",
        color: Colors.BLACK,
        marginLeft: RatioUtil.width(4),
    },
    dataDesc: {
        fontSize: RatioUtil.width(15),
        lineHeight: RatioUtil.width(17),
        fontWeight: "700",
        color: Colors.BLACK,
        marginLeft: RatioUtil.width(4),
    },
    bottomDescMainView: {
        flexDirection: "row",
        marginVertical: RatioUtil.width(20),
    },
    bottomDotView: {
        height: RatioUtil.width(2),
        width: RatioUtil.width(2),
        backgroundColor: Colors.GRAY10,
        borderRadius: RatioUtil.width(50),
        marginTop: RatioUtil.width(6),
    },
    bottomDesc: {
        fontSize: RatioUtil.width(13),
        lineHeight: RatioUtil.width(15),
        color: Colors.GRAY10,
        marginLeft: RatioUtil.width(4),
        maxWidth: "80%",
    },
    buttonView: {
        height: RatioUtil.width(45),
        width: "85%",
        backgroundColor: Colors.BLACK,
        borderRadius: RatioUtil.width(50),
        alignItems: "center",
        justifyContent: "center",
        marginTop: RatioUtil.width(5),
    },
    buttonText: {
        fontSize: RatioUtil.width(13),
        lineHeight: RatioUtil.width(15),
        color: Colors.WHITE,
        marginLeft: RatioUtil.width(4),
    },
})
