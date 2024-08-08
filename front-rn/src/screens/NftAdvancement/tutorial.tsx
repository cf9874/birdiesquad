import { jsonSvc } from "apis/services"
import { PretendText } from "components/utils"
import { Colors } from "const"
import { Modal, TouchableOpacity, View } from "react-native"
import Svg, { Polygon, Rect } from "react-native-svg"
import { playerStyle } from "styles"
import { RatioUtil } from "utils"
import { styles } from "./styles"

const NftAdvancementTutorial = ({
    showAdvancementScreenTutorial,
    finishTutorial,
    step,
}: {
    showAdvancementScreenTutorial: boolean
    finishTutorial: Function
    step: number
}) => {
    return (
        <Modal visible={showAdvancementScreenTutorial} statusBarTranslucent transparent>
            <TouchableOpacity
                onPress={() => {
                    finishTutorial()
                }}
                style={playerStyle.selectionModalTutorial}
            >
                {/*  STEP 1*/}
                {step === 1 && (
                    <View style={styles.tutorialFirstStepMainBox}>
                        <View style={styles.tutorialFirstStepAArrowBox}>
                            <Svg height={RatioUtil.width(12)} width={RatioUtil.width(12)} viewBox="0 0 12 12">
                                <Polygon
                                    points="0 12 6 0 12 12"
                                    fill={`${Colors.BLACK}80`}
                                    stroke={Colors.WHITE}
                                    strokeWidth={2}
                                />
                            </Svg>
                        </View>
                        <View style={styles.tutorialFirstStepTextBox}>
                            <PretendText style={styles.tutorialText}>
                                {/* 승급 성공 시 변화된 NFT\n모습을 확인할 수 있어요! */}
                                {jsonSvc.findLocalById("ELEVATE_TUTORIAL_1")}
                            </PretendText>
                        </View>
                    </View>
                )}
                {/*  STEP 2*/}
                {step === 2 && (
                    <View style={styles.tutorialSecondStepAMainBox}>
                        <View style={styles.tutorialSecondStepASvgBox}>
                            <Svg height={RatioUtil.width(12)} width={RatioUtil.width(12)} viewBox="0 0 12 12">
                                <Polygon
                                    points="0 0 12 0 6 12"
                                    fill={`${Colors.BLACK}80`}
                                    stroke={Colors.WHITE}
                                    strokeWidth={2}
                                />
                            </Svg>
                        </View>
                        <View style={styles.tutorialSecondStepTextBox}>
                            <PretendText style={styles.tutorialText}>
                                {/* 승급 재료로 사용할 NFT를 선택해 보세요!\n사용한 재료는 소멸됩니다. */}
                                {jsonSvc.findLocalById("ELEVATE_TUTORIAL_2")}
                            </PretendText>
                        </View>
                    </View>
                )}
                {step === 2 && (
                    <View style={styles.tutorialSecondStepBMainBox}>
                        <View style={styles.tutorialSecondStepBSvgBox}>
                            <Svg
                                height={RatioUtil.width(12)}
                                width={RatioUtil.width(12)}
                                viewBox="0 0 12 12"
                                style={{ transform: [{ rotate: "180deg" }] }}
                            >
                                <Polygon
                                    points="0 0 12 0 6 12"
                                    fill={`${Colors.BLACK}80`}
                                    stroke={Colors.WHITE}
                                    strokeWidth={2}
                                />
                            </Svg>
                        </View>
                        <View style={styles.tutorialSecondStepTextBox}>
                            <PretendText style={styles.tutorialText}>
                                {/* 승급 대상 NFT와 동일한 프로를\n선택하면 더욱 높은 성공 확률이 적용됩니다! */}
                                {jsonSvc.findLocalById("ELEVATE_TUTORIAL_3")}
                            </PretendText>
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        </Modal>
    )
}
export default NftAdvancementTutorial
