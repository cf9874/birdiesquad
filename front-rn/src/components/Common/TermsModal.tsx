import { CustomButton, PretendText } from "components/utils"
import { Colors } from "const"
import { useWrapDispatch } from "hooks"
import React from "react"
import { View } from "react-native"
import { setModal } from "store/reducers/config.reducer"
import { RatioUtil } from "utils"
import { jsonSvc } from "apis/services"


// 권한 동의 안내 모달
export const TermsModal = () => {
  const modalDispatch = useWrapDispatch(setModal)

  return (
    <View
      style={{
          padding: RatioUtil.lengthFixedRatio(30),
          backgroundColor: Colors.WHITE,
          alignSelf: "center",
          alignItems: "center",
          ...RatioUtil.borderRadius(16),
      }}
    >
      <PretendText
        style={{
          marginBottom: RatioUtil.lengthFixedRatio(10),
          fontSize: RatioUtil.font(18),
          fontWeight: RatioUtil.fontWeightBold(),
          textAlign: "center",
          color: Colors.BLACK,
        }}
      >
        {`권한 동의 안내`}
      </PretendText>
      <PretendText
        style={{
          marginBottom: RatioUtil.lengthFixedRatio(10),
          fontSize: RatioUtil.font(14),
          textAlign: "center",
          lineHeight: RatioUtil.lengthFixedRatio(19.6),
        }}
      >
        {`원활한 버디스쿼드 서비스 이용을 위해\n접근 권한 동의가 필요합니다.`}
      </PretendText>
      <PretendText
        style={{
          fontSize: RatioUtil.font(14),
          textAlign: "center",
          fontWeight: RatioUtil.fontWeightBold(),
          lineHeight: RatioUtil.lengthFixedRatio(19.6),
        }}
      >
        {`선택 카메라 및 사진첩`}
      </PretendText>
      <PretendText
        style={{
          fontSize: RatioUtil.font(14),
          textAlign: "center",
        }}
      >
        {`1:1 문의하기 작성 시 사용됩니다.`}
      </PretendText>
      <CustomButton
        onPress={() => {
          modalDispatch({ open: false })
        }}
        style={{
          ...RatioUtil.sizeFixedRatio(232, 48),
          ...RatioUtil.borderRadius(24),
          ...RatioUtil.marginFixedRatio(20, 0, 0, 0),
          backgroundColor: Colors.BLACK,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PretendText
            style={{
                color: Colors.WHITE,
                fontSize: RatioUtil.font(14),
                fontWeight: RatioUtil.fontWeightBold(),
                lineHeight: RatioUtil.font(14) * 1.3,
            }}
        >
          {jsonSvc.findLocalById("10010000")}
        </PretendText>
      </CustomButton>
    </View>
  )
}