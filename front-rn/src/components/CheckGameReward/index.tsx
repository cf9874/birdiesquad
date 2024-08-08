import { useState } from "react"
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { RatioUtil } from "utils"
import { Colors } from "const"
import { rewardSvc } from "apis/services/reward.svc"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { TOKEN_ID } from "utils/env"
import { PretendText } from "components/utils"

const CheckGameReward = () => {
    const [visible1, setVisible1] = useState<boolean>(false)
    const [visible2, setVisible2] = useState<boolean>(false)
    const [gameId, setGameId] = useState<number>()
    const [result, setResult] = useState<any>()

    return (
        <>
            <TouchableOpacity onPress={() => setVisible1(true)} style={styles.buttonView}>
                <PretendText>Check Game Reward</PretendText>
            </TouchableOpacity>
            <Modal visible={visible1} statusBarTranslucent transparent>
                <View style={styles.mainView}>
                    <View style={styles.innerView}>
                        <PretendText>GameId</PretendText>
                        <TextInput
                            onChangeText={item => setGameId(parseInt(item))}
                            style={styles.textInputView}
                            maxLength={8}
                            keyboardType={"numeric"}
                        />
                        <TouchableOpacity
                            onPress={async () => {
                                setVisible1(false)
                                setVisible2(true)
                                const res = await rewardSvc.getTourRewardApi({ gameId: gameId || 0 })
                                setResult(res?.data)
                                // console.warn(result);
                            }}
                            style={styles.submitButton}
                        >
                            <PretendText style={{ color: Colors.WHITE }}>Check Game Reward</PretendText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal visible={visible2} statusBarTranslucent transparent>
                <View style={styles.mainView}>
                    <View style={styles.innerView}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <PretendText>GAME ID:- </PretendText>
                            <PretendText>{gameId}</PretendText>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <PretendText>REWARD_BDST:- </PretendText>
                            <PretendText>{result?.REWARD_BDST}</PretendText>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <PretendText>REWARD_TRAINING:- </PretendText>
                            <PretendText>{result?.REWARD_TRAINING}</PretendText>
                        </View>
                        <TouchableOpacity
                            onPress={async () => {
                                setVisible2(false)
                            }}
                            style={styles.submitButton}
                        >
                            <PretendText style={{ color: Colors.WHITE }}>close</PretendText>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default CheckGameReward

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
        borderRadius: RatioUtil.width(10),
        alignItems: "flex-start",
        paddingVertical: RatioUtil.height(30),
        paddingHorizontal: RatioUtil.width(30),
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
    buttonView: {
        height: RatioUtil.width(50),
        width: RatioUtil.width(140),
        backgroundColor: Colors.GRAY,
        alignSelf: "center",
        borderRadius: RatioUtil.width(10),
        alignItems: "center",
        justifyContent: "center",
    },
    textInputView: {
        height: RatioUtil.width(30),
        width: RatioUtil.width(140),
        backgroundColor: Colors.GRAY,
        borderRadius: RatioUtil.width(5),
        marginTop: RatioUtil.width(5),
        paddingVertical: 0,
    },
    submitButton: {
        height: RatioUtil.width(30),
        width: RatioUtil.width(140),
        backgroundColor: Colors.PURPLE,
        borderRadius: RatioUtil.width(5),
        marginTop: RatioUtil.width(5),
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
})
