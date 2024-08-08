기획변경으로 없앤 rank팝업 관련부분
해당 내용들은 tab.cheer.tsx에 적용했었음
const { modal, popUp } = useAppSelector(state => state.configReducer, shallowEqual)

    const [rankData, setRankData] = useState<IRankData>()
    const getRankList = async () => {
        const data = await rankSvc.playerRankList({ gamecode: id, max: 3, min: 1 })
        setRankData(data)
    }

    useScreen(() => {
        getRankList()

        const countdown = setInterval(getRankList, 1000 * 60 * 10) // 10분
        return () => clearInterval(countdown)
    }, [modal.open, popUp.open])

함수

        const onRankBox = () => {
         popUpDispatch({
             open: true,
             children: <RankContents id={id} />,
         })
     }

view :: endtoast 팝업 아래에 위치

         {/* {rankData?.rankList?.length ? (
                <CustomButton
                    style={[
                        liveStyle.cheerTab.rankBox,
                        {
                            zIndex: -1,
                            elevation: -1,
                            position: "relative",
                        },
                    ]}
                    onPress={onRankBox}
                >
                    {rankData.rankList.map((v, i, { length }) => (
                        <View style={liveStyle.cheerTab.rank} key={i}>
                            <Image source={rankImg[v.rank]} style={liveStyle.cheerTab.rankImg} />
                            <PretendText style={liveStyle.cheerTab.rankName}>{v.info?.sPlayerName}</PretendText>
                            <PretendText style={liveStyle.cheerTab.rankPoint}>
                                {NumberUtil.addUnit(v.score)}
                            </PretendText>
                            {i !== length - 1 && (
                                <Hr
                                    style={{
                                        marginLeft: RatioUtil.width(15),
                                        backgroundColor: Colors.GRAY,
                                        height: RatioUtil.height(10),
                                        marginTop: RatioUtil.height(4),
                                    }}
                                />
                            )}
                        </View>
                    ))}
                </CustomButton>
            ) : null} */}
