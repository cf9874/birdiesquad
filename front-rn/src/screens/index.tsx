import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React from "react"
import Test from "./test/main.test"
import NftDetail from "./nft/nftdetail"
import NftList from "./nft/mynftlist"
import Signin from "./user/signin"
import Term from "./user/term"
import Pro from "./user/profile/pro"
import { Screen } from "const"
import { navigationRef } from "utils"
import User from "./user/profile/user"
import Intro from "./user/intro"
import IntroTutorial from "./user/intro.tutorial"
import Mypage from "./user/mine/myPage"
import Myedit from "./user/mine/myEdit"
import Setting from "./user/mine/setting"
import SetAlarm from "./user/mine/setting/setAlarm"
import SetMyInfo from "./user/mine/setting/setMyInfo"
import SetFAQ from "./user/mine/setting/setFAQ"
import SetInquiry from "./user/mine/setting/setInquiry"
import SetWithdraw from "./user/mine/setting/setWithdraw"
import WithdrawSubmit from "./user/mine/setting/withdrawSubmit"
import ContestRecord from "./user/mine/contestRecord"
import Ranking from "./rank/ranking"
import RankingDetail from "./rank/rankingDetail"
import Procession from "./user/mine/setting/procession"
import TransWallet from "./nft/transWallet"
import Wallets from "./wallets"
import LiveMain from "./live/main"
import NftPayment from "./NftPayment"
import NftTabScene from "./NftPayment/nftTabScene"
import RaffleTabScene from "./NftPayment/raffleTabScene"
import NftAdvancement from "./NftAdvancement"
import NftAdvancementMaterials from "./NftAdvancement/nftMaterials"
import PlayerSelection from "./NftPayment/PlayerSelection"
import Mynftlist from "./NftPayment/Mynftlist"
import PassionateFans from "./rank/passionateFans"
import SpendingTabDetail from "./wallets/SpendingTabDetail"
import WalletTransfer from "./wallets/WalletTransfer"
import SelectPlayerNFT from "./wallets/SelectPlayerNFT"
import ConfirmPlayerNFT from "./wallets/SelectPlayerNFT/confirmNftPlayer"
import WebViewTerm from "./NftPayment/WebViewTerm"
import UnboxingVideo from "./nft/components/unboxingVideo"
import OpenNftScreen from "./nft/openNft"
import SplashScreenView from "./user/splash"
import MySquad from "./squad/mySquad"
import MySquadSelect from "./squad/mySquadSelect"
import MySquadNftDetail from "./squad/mySquadNftdetail"

const Main = () => {
    const Stack = createStackNavigator()

    const defaultOption = {
        headerShown: false,
        animationEnabled: false,
    }

    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={Screen.SPLASH}>
                {/* <Stack.Navigator initialRouteName={Screen.WALLETS}> */}
                <Stack.Screen name={Screen.NFTPAYMENT} component={NftPayment} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.NFTTABSCENE} component={NftTabScene} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.RAFFLETABSCENE} component={RaffleTabScene} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.NFTADVANCEMENT} component={NftAdvancement} options={{ ...defaultOption }} />
                <Stack.Screen
                    name={Screen.NFT_ADVANCEMENT_MATERIALS}
                    component={NftAdvancementMaterials}
                    options={{ ...defaultOption }}
                />
                <Stack.Screen
                    name={Screen.PLAYERSELECTION}
                    component={PlayerSelection}
                    options={{ ...defaultOption }}
                />
                <Stack.Screen name="Mynftlist" component={Mynftlist} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.TEST} component={Test} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.LIVE} component={LiveMain} options={{ ...defaultOption }} />
                <Stack.Screen
                    name={Screen.PROCESSIN}
                    component={Procession}
                    options={{ ...defaultOption, animationEnabled: true }}
                />
                <Stack.Screen name={Screen.MYPAGE} component={Mypage} options={{ ...defaultOption }} />
                <Stack.Screen
                    name={Screen.MYEDIT}
                    component={Myedit}
                    options={{ ...defaultOption, animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.CONTESTRECORD}
                    component={ContestRecord}
                    options={{ ...defaultOption, animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.MYSETTING}
                    component={Setting}
                    options={{ ...defaultOption, animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.SETMYINFO}
                    component={SetMyInfo}
                    options={{ ...defaultOption, animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.SETALARM}
                    component={SetAlarm}
                    options={{ ...defaultOption, animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.SETFAQ}
                    component={SetFAQ}
                    options={{ ...defaultOption, animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.SETINQUIRY}
                    component={SetInquiry}
                    options={{ ...defaultOption, animationTypeForReplace: "push", animationEnabled: true }}
                />
                <Stack.Screen name={Screen.SETWITHDRAW} component={SetWithdraw} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.WITHDRAWSUBMIT} component={WithdrawSubmit} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.INTRO} component={Intro} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.INTROTUTORIAL} component={IntroTutorial} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.SIGNIN} component={Signin} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.NFTDETAIL} component={NftDetail} options={{ ...defaultOption }} />
                {/* <Stack.Screen name={Screen.NFT_DETAIL_VX} component={NftDetailVx} options={{ ...defaultOption }} /> */}
                <Stack.Screen name={Screen.NFTLIST} component={NftList} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.TERM} component={Term} options={{ ...defaultOption }} />
                <Stack.Screen
                    name={Screen.PROPROFILE}
                    component={Pro}
                    options={{ ...defaultOption, animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.USERPROFILE}
                    component={User}
                    options={{ ...defaultOption, animationEnabled: true }}
                />
                <Stack.Screen name={Screen.RANK} component={Ranking} options={{ ...defaultOption }} />
                <Stack.Screen
                    name={Screen.RANKDETAIL}
                    component={RankingDetail}
                    options={{ ...defaultOption, animationTypeForReplace: "push", animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.PASSIONATEFANS}
                    component={PassionateFans}
                    options={{ ...defaultOption, animationEnabled: true }}
                />
                <Stack.Screen name={Screen.TRANSWALLET} component={TransWallet} options={{ ...defaultOption }} />
                <Stack.Screen
                    name={Screen.WALLETS}
                    component={Wallets}
                    options={{ ...defaultOption, animationTypeForReplace: "push", animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.SPENDINGTABDETAIL}
                    component={SpendingTabDetail}
                    options={{ ...defaultOption, animationTypeForReplace: "push", animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.WALLETTRANSFER}
                    component={WalletTransfer}
                    options={{ ...defaultOption, animationTypeForReplace: "push", animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.SELECTPLAYERNFT}
                    component={SelectPlayerNFT}
                    options={{ ...defaultOption, animationTypeForReplace: "push", animationEnabled: true }}
                />
                <Stack.Screen
                    name={Screen.CONFIRMPLAYERNFT}
                    component={ConfirmPlayerNFT}
                    options={{ ...defaultOption, animationTypeForReplace: "push", animationEnabled: true }}
                />
                <Stack.Screen name={Screen.WEBVIEWTERM} component={WebViewTerm} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.UNBOXINGVIDEO} component={UnboxingVideo} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.OPENNFTSCREEN} component={OpenNftScreen} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.SPLASH} component={SplashScreenView} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.MYSQUAD} component={MySquad} options={{ ...defaultOption }} />
                <Stack.Screen name={Screen.MYSQUADSELECT} component={MySquadSelect} options={{ ...defaultOption }} />
                <Stack.Screen
                    name={Screen.MYSQUADNFTDETAIL}
                    component={MySquadNftDetail}
                    options={{ ...defaultOption }}
                />

                {/* MySquadSelect */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Main
