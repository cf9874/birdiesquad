// export const CheerTabCompo = {
//     DecideBdst: ({ profile }: { profile?: ProfileApiData.Info.ResDto }) => {
//         const popupDispatch = useWrapDispatch(setPopUp)
//         const modalDispatch = useWrapDispatch(setModal)
//         const isVisible = useKeyboardVisible()
//         const [buttonProps, setButtonProps] = useState({
//             confirm: {
//                 ...RatioUtil.size(202, 60),
//                 ...RatioUtil.borderRadius(30),
//                 backgroundColor: Colors.BLACK,
//                 alignSelf: "center",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginLeft: RatioUtil.width(10),
//             } as ViewStyle,
//             cancel: {
//                 ...RatioUtil.size(108, 60),
//                 ...RatioUtil.borderRadius(30),
//                 backgroundColor: Colors.GRAY7,
//                 alignItems: "center",
//                 justifyContent: "center",
//                 marginLeft: RatioUtil.width(10),
//             } as ViewStyle,
//         })

//         useEffect(() => {
//             if (isVisible) {
//                 setButtonProps(state =>
//                     produce(state, draft => {
//                         draft.confirm = {
//                             ...state.confirm,
//                             width: RatioUtil.width(370),
//                             ...RatioUtil.borderRadius(0),
//                         }
//                         draft.cancel.display = "none"
//                     })
//                 )
//             } else {
//                 setButtonProps(state =>
//                     produce(state, draft => {
//                         draft.confirm = {
//                             ...state.confirm,
//                             width: RatioUtil.width(202),
//                             ...RatioUtil.borderRadius(30),
//                         }
//                         draft.cancel.display = "flex"
//                     })
//                 )
//             }
//         }, [isVisible])

//         const onBack = () => {
//             popupDispatch({
//                 open: true,
//                 children: <CheerTabCompo.SendBdst />,
//             })
//         }
//         const onSend = () => {
//             popupDispatch({
//                 open: false,
//             })
//             modalDispatch({
//                 open: true,
//                 children: (
//                     <View
//                         style={{
//                             backgroundColor: Colors.WHITE,
//                             ...RatioUtil.size(272, 261),
//                             alignSelf: "center",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             ...RatioUtil.borderRadius(20),
//                         }}
//                     >
//                         <Image source={liveImg.check.end} style={{ marginTop: RatioUtil.height(30) }} />
//                         <PretendText
//                             style={{
//                                 textAlign: "center",
//                                 ...RatioUtil.margin(19, 0, 9, 0),
//                                 fontSize: RatioUtil.font(16),
//                                 color: Colors.BLACK,
//                             }}
//                         >
//                             {"한진선 프로에게\n2,000원을 보냈습니다."}
//                         </PretendText>
//                         <PretendText style={{ color: Colors.BLACK }}>{"응원점수: 3점 획득"}</PretendText>
//                         <CustomButton
//                             style={{
//                                 backgroundColor: Colors.BLACK,
//                                 ...RatioUtil.borderRadius(25),
//                                 ...RatioUtil.size(232, 48),
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 ...RatioUtil.margin(21, 20, 20, 20),
//                             }}
//                             onPress={() => modalDispatch({ open: false })}
//                         >
//                             <PretendText style={{ color: Colors.WHITE, fontWeight: "400" }}>확인</PretendText>
//                         </CustomButton>
//                     </View>
//                 ),
//             })
//         }

//         return (
//             <View
//                 style={{
//                     position: "absolute",
//                     backgroundColor: Colors.WHITE,
//                     ...RatioUtil.size(360, 400),
//                     marginTop: RatioUtil.height(292),
//                     bottom: 0,
//                     ...RatioUtil.borderRadius(15),
//                 }}
//             >
//                 <View
//                     style={{
//                         ...RatioUtil.size(320, 60),
//                         ...liveGeneral.popup.center,
//                         alignSelf: "center",
//                     }}
//                 >
//                     <PretendText style={liveGeneral.popup.title}>후원 보내기</PretendText>
//                 </View>
//                 {/* 박스 */}
//                 <CheerTabCompo.BdstBox profile={profile} money={6000} />
//                 {/* <Progress.Bar
//                     progress={0.3}
//                     width={RatioUtil.width(320)}
//                     style={{ alignSelf: "center", marginTop: RatioUtil.height(40) }}
//                 /> */}

//                 <View
//                     style={{
//                         flexDirection: "row",
//                         marginTop: RatioUtil.height(isVisible ? 90 : 70),
//                         alignSelf: "center",
//                         alignItems: "center",
//                         justifyContent: "center",
//                     }}
//                 >
//                     <CustomButton onPress={onBack} style={buttonProps.cancel}>
//                         <PretendText style={{ color: Colors.BLACK, fontWeight: "600" }}>이전단계</PretendText>
//                     </CustomButton>
//                     <CustomButton onPress={onSend} style={buttonProps.confirm}>
//                         <PretendText style={{ color: Colors.WHITE, fontWeight: "600" }}>
//                             {isVisible ? "완료" : "구매 후 보내기"}
//                         </PretendText>
//                     </CustomButton>
//                 </View>
//             </View>
//         )
//     },
//     BdstBox: ({ profile, money = 0 }: { profile?: ProfileApiData.Info.ResDto; money?: number }) => {
//         const grade = (() => {
//             if (money <= 2000) {
//                 return Grade.COMMON
//             } else if (money <= 5000) {
//                 return Grade.UNCOMMON
//             } else if (money <= 10000) {
//                 return Grade.RARE
//             } else if (money <= 30000) {
//                 return Grade.SUPERRARE
//             } else if (money <= 50000) {
//                 return Grade.EPIC
//             } else if (money <= 100000) {
//                 return Grade.LEGENDARY
//             }
//         })()

//         const colorStyle = {
//             [Grade.COMMON]: {
//                 colors: [Colors.WHITE3, Colors.GRAY3],
//                 backgroundColor: "rgba(187, 187, 187, 0.1)",
//             },
//             [Grade.UNCOMMON]: {
//                 colors: [Colors.GREEN2, Colors.GREEN],
//                 backgroundColor: "rgba(161, 239, 122, 0.1)",
//             },
//             [Grade.RARE]: {
//                 colors: [Colors.BLUE4, Colors.BLUE5],
//                 backgroundColor: "rgba(135, 191, 255, 0.1)",
//             },
//             [Grade.SUPERRARE]: {
//                 colors: [Colors.PURPLE3, Colors.PURPLE4],
//                 backgroundColor: "rgba(188, 182, 255, 0.1)",
//             },
//             [Grade.EPIC]: {
//                 colors: [Colors.YELLOW5, Colors.YELLOW6],
//                 backgroundColor: "rgba(252, 215, 87, 0.1)",
//             },
//             [Grade.LEGENDARY]: {
//                 colors: [Colors.RED3, Colors.RED4],
//                 backgroundColor: "rgba(255, 104, 107, 0.1)",
//             },
//         }
//         if (!grade || !profile) return null
//         return (
//             <View
//                 style={{
//                     alignSelf: "center",
//                 }}
//             >
//                 <LinearGradient
//                     start={{ x: 0.79, y: 0 }}
//                     end={{ x: 0, y: 0 }}
//                     colors={colorStyle[grade].colors}
//                     style={{
//                         ...RatioUtil.size(320, 48),
//                         // backgroundColor: Colors.GREEN,
//                         borderTopLeftRadius: RatioUtil.width(15),
//                         borderTopRightRadius: RatioUtil.width(15),
//                         ...RatioUtil.padding(12, 20, 12, 20),
//                         flexDirection: "row",
//                         justifyContent: "space-between",
//                     }}
//                 >
//                     <View style={{ ...RatioUtil.size(94, 24), flexDirection: "row" }}>
//                         <Image
//                             source={{ uri: ConfigUtil.getImage(profile?.profile.icon).uri }}
//                             style={{
//                                 ...RatioUtil.size(24, 24),
//                                 ...RatioUtil.borderRadius(100),
//                                 marginRight: RatioUtil.width(10),
//                             }}
//                         />
//                         <PretendText style={{ fontSize: RatioUtil.font(16), fontWeight: "700", color: Colors.WHITE }}>
//                             {profile?.profile.nickname}
//                         </PretendText>
//                     </View>
//                     <View
//                         style={{
//                             borderWidth: 1.5,
//                             ...RatioUtil.borderRadius(100),
//                             ...RatioUtil.size(22.91, 23),
//                             alignItems: "center",
//                             justifyContent: "center",
//                             borderColor: Colors.WHITE,
//                             position: "relative",
//                             left: RatioUtil.width(65.5),
//                         }}
//                     >
//                         <WithLocalSvg asset={liveImg.won} />
//                     </View>
//                     <View
//                         style={{
//                             ...RatioUtil.size(77, 23),
//                             borderWidth: 1.5,
//                             borderColor: Colors.WHITE,
//                             ...RatioUtil.borderRadius(30),
//                             paddingRight: RatioUtil.width(10),
//                             alignItems: "flex-end",
//                         }}
//                     >
//                         <PretendText style={{ color: Colors.WHITE }}>{money}</PretendText>
//                     </View>
//                 </LinearGradient>
//                 <View
//                     style={{
//                         ...RatioUtil.size(320, 94),
//                         backgroundColor: colorStyle[grade].backgroundColor,
//                         ...RatioUtil.padding(14, 10, 10, 20),
//                         ...RatioUtil.borderRadius(0, 0, 15, 15),
//                     }}
//                 >
//                     <TextInput
//                         style={{ opacity: 1, padding: 0, alignSelf: "center", marginRight: RatioUtil.width(25) }}
//                         maxLength={35}
//                         placeholder={"구매 금액 및 메세지가 공개적으로 표시됩니다."}
//                     />
//                     <View style={{ alignSelf: "flex-end", marginTop: 30, flexDirection: "row" }}>
//                         <PretendText style={{ color: Colors.BLACK }}>14</PretendText>
//                         <PretendText style={{ color: Colors.GRAY3 }}>/35</PretendText>
//                     </View>
//                 </View>
//             </View>
//         )
//     },
// }

export const name = () => {}
