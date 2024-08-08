import { useFocusEffect } from "@react-navigation/native"
import { NFTCardImages } from "assets/images"
import React, { useEffect, useRef, useState } from "react"
import { FlatList, View, Text, Image } from "react-native"
import { scaleSize } from "styles/minixs"
import nftPlayer from "json/nft_player.json"
import { ConfigUtil } from "utils"
import { Colors } from "const"
import FastImage from "react-native-fast-image"

const InfiniteFlatList = () => {
    const flatListRef = useRef<FlatList>(null);
    const DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const [data, setData] = useState([...nftPlayer, ...nftPlayer, ...nftPlayer])

    const ITEM_WIDTH = scaleSize(50)

    var offset = scaleSize(10)

    useFocusEffect(
        React.useCallback(() => {
            offset = scaleSize(10)
            flatListRef?.current?.scrollToOffset({ animated: false, offset: 0 })
            const intervalId = setInterval(() => {
                // check whether reached end to scroll infinite
                flatListRef?.current?.scrollToOffset({ animated: true, offset: offset })
                offset += scaleSize(10)
            }, 130)
            return () => clearInterval(intervalId)
        }, [])
    )

    const getItemLayout = (data: any, index: number) => ({
        length: ITEM_WIDTH,
        offset: ITEM_WIDTH * index,
        index,
    })

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <FastImage
            source={{ uri: ConfigUtil.getPlayerImage(item.sPlayerImagePath) }}
            style={[
                {
                    height: scaleSize(40),
                    width: scaleSize(40),
                    backgroundColor: Colors.WHITE,
                    borderRadius: scaleSize(50)
                },
                {
                    marginTop: index % 2 === 0 ? scaleSize(20) : 0,
                },
                index === data?.length - 1
                    ? { marginLeft: scaleSize(12), marginRight: scaleSize(27) }
                    : { marginHorizontal: scaleSize(12) },
            ]}
        />
    )

    const onEndReached = () => {
        setData([...data, ...nftPlayer])
    }

    return (
        <FlatList
            ref={flatListRef}
            data={data}
            renderItem={renderItem}
            horizontal
            getItemLayout={getItemLayout}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
        />
    )
}

export default InfiniteFlatList
