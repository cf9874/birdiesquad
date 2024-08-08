import { nftDetailImg } from "assets/images"
import { PretendText } from "components/utils"
import { Screen } from "const"
import { Image, View } from "react-native"
import { walletTransStlye } from "styles/components/walletTrans.style"
import { RatioUtil, navigate } from "utils"
import AnimatedLottieView from "lottie-react-native"
import lotties from "assets/lotties"
import { jsonSvc } from "apis/services"

export const WalletLoading = (fn: any) => {
    fn({ isloading: true, children: <Sending /> })

    setTimeout(() => {
        fn({ isloading: false, children: <Sending /> })
    }, 4000)

    setTimeout(() => {
        fn({ isloading: true, children: <Success /> })
    }, 4001)

    setTimeout(() => {
        fn({ isloading: false, children: <Success /> })

        navigate(Screen.BACK)
    }, 5500)
    Sending
}

export const Sending = () => {
    return (
        <View style={walletTransStlye.loading.con}>
            <View style={walletTransStlye.loading.loadingBox}>
                <View style={walletTransStlye.loading.imageBox}>
                    <AnimatedLottieView
                        source={lotties.loadingToast}
                        style={{ width: RatioUtil.font(48), height: RatioUtil.font(48) }}
                        autoPlay
                        loop
                    />
                </View>
                <View style={walletTransStlye.loading.loadingTextBox}>
                    <PretendText style={walletTransStlye.loading.loadingText}>
                        {/* 전송중... */}
                        {jsonSvc.findLocalById("10000018")}
                    </PretendText>
                </View>
            </View>
        </View>
    )
}

export const Success = () => {
    return (
        <View style={walletTransStlye.loading.con}>
            <View style={walletTransStlye.loading.loadingBox}>
                <View style={walletTransStlye.loading.imageBox}>
                    <AnimatedLottieView
                        source={lotties.check}
                        style={{ width: RatioUtil.font(48), height: RatioUtil.font(48) }}
                        autoPlay
                        loop={false}
                    />
                </View>
                <View style={walletTransStlye.loading.loadingTextBox2}>
                    <PretendText style={walletTransStlye.loading.loadingText}>
                        {/* 전송이 완료되었습니다. */}
                        {jsonSvc.findLocalById("9900006")}
                    </PretendText>
                </View>
            </View>
        </View>
    )
}

export const Error = () => {
    return (
        <View style={walletTransStlye.loading.con}>
            <View style={walletTransStlye.loading.loadingBox}>
                <View style={walletTransStlye.loading.imageBox}>
                    <AnimatedLottieView
                        source={lotties.warning}
                        style={{ width: RatioUtil.font(48), height: RatioUtil.font(48) }}
                        autoPlay
                        loop={false}
                    />
                </View>
                <View style={walletTransStlye.loading.loadingTextBox3}>
                    <PretendText style={walletTransStlye.loading.loadingText}>
                        {/* 오류로 전송에 실패했습니다. */}
                        {jsonSvc.findLocalById("9900006")}
                    </PretendText>
                </View>
            </View>
        </View>
    )
}
