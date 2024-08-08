import React, { useState } from "react"
import { ImageBackground, InteractionManager, Text, View } from "react-native"
import { mainHeaderImg } from "assets/images"
import { nftStyle } from "styles/nft.style"
import { CustomButton, PretendText } from "components/utils"
import { useWrapDispatch } from "hooks"
import { setModal, setPopUp } from "store/reducers/config.reducer"
import { jsonSvc, walletSvc } from "apis/services"
import { useDispatch, useSelector } from "react-redux"
import { setNftUpgradeResult } from "store/reducers/nftUpgradeResult.reducer"

export const NftGradeUp = ({
    targetNftId,
    setModalVisible,
    successRate,
    upgradeCost,
}: {
    targetNftId: number
    setModalVisible: Function
    successRate: number
    upgradeCost: number
}) => {
    const dispatch = useDispatch()
    const popUpDispatch = useWrapDispatch(setPopUp)
    const selectedNft = useSelector((state: any) => state.nftUpgradeMaterialsReducer)
    const [isLoading, setIsLoading] = useState(false)
    const gameCode = useSelector((state: any) => state.mySquadReducer.gameCode)

    return (
        <View style={nftStyle.nftAdvancementModal.con}>
            <View style={[nftStyle.nftAdvancementModal.box]}>
                <View style={nftStyle.nftAdvancementModal.titlecon}>
                    <PretendText style={nftStyle.nftAdvancementModal.title}>
                        {/* 승급 하시겠습니까? */}
                        {jsonSvc.findLocalById("ELEVATE_POPUP_TITLE")}
                    </PretendText>
                    <PretendText style={nftStyle.nftAdvancementModal.notice}>
                        {/* 재료로 사용된 NFT는 소멸 됩니다. */}
                        {jsonSvc.findLocalById("ELEVATE_POPUP_CONTENTS")}
                    </PretendText>
                    <View style={nftStyle.nftAdvancementModal.infoBox}>
                        <PretendText style={nftStyle.nftAdvancementModal.infoTitle}>
                            {/* 성공 확률 */}
                            {jsonSvc.findLocalById("ELEVATE_RATE")}
                        </PretendText>
                        <PretendText style={nftStyle.nftAdvancementModal.infoValue}>{successRate}%</PretendText>
                    </View>
                    <View style={nftStyle.nftAdvancementModal.infoBox}>
                        <PretendText style={nftStyle.nftAdvancementModal.infoTitle}>
                            {/* 승급 가격 */}
                            {jsonSvc.findLocalById("ELEVATE_COST")}
                        </PretendText>
                        <View style={nftStyle.nftAdvancementModal.priceValueBox}>
                            <ImageBackground
                                source={mainHeaderImg.point}
                                resizeMode="contain"
                                style={nftStyle.nftAdvancementModal.priceTypeImage}
                            />
                            <Text style={nftStyle.nftAdvancementModal.priceValue}>{upgradeCost}</Text>
                        </View>
                    </View>
                    <View style={nftStyle.nftAdvancementModal.btncon}>
                        <CustomButton
                            style={nftStyle.nftAdvancementModal.closebtn}
                            onPress={() => {
                                popUpDispatch({ open: false })
                            }}
                        >
                            <PretendText style={nftStyle.nftAdvancementModal.btnText}>
                                {/* 취소 */}
                                {jsonSvc.findLocalById("10010001")}
                            </PretendText>
                        </CustomButton>
                        <CustomButton
                            disabled={isLoading}
                            onPress={async () => {
                                setIsLoading(true)
                                popUpDispatch({ open: false })
                                try {
                                    const data = await walletSvc.upgradeNft({
                                        gameCode,
                                        targetNftId,
                                        subNftIds: [selectedNft[0].seq, selectedNft[1].seq],
                                    })
                                    if (data && "isUpgrade" in data) {
                                        InteractionManager.runAfterInteractions(() => setModalVisible(true)) //IOS 모달창 실행 작업을 위해 사용
                                        dispatch(setNftUpgradeResult(data.isUpgrade)) // nft 승급 결과를 전역 상태로 설정
                                    }
                                } catch (error) {
                                    console.log("FAIL:", error)
                                } finally {
                                    setIsLoading(false)
                                }
                            }}
                            style={
                                isLoading
                                    ? [
                                          nftStyle.nftAdvancementModal.gradeUpbtn,
                                          nftStyle.nftAdvancementModal.disabledButtonStyle,
                                      ]
                                    : nftStyle.nftAdvancementModal.gradeUpbtn
                            }
                        >
                            <PretendText style={nftStyle.nftAdvancementModal.gradeUpText}>
                                {/* 승급하기 */}
                                {jsonSvc.findLocalById("ELEVATE_BUTTON")}
                            </PretendText>
                        </CustomButton>
                    </View>
                </View>
            </View>
        </View>
    )
}
