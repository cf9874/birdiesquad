import * as React from "react"
import { Text, View } from "react-native"
import { Carousel, useCarousel } from "components/Carousel"
import { RatioUtil } from "utils"
import { SafeAreaView } from "react-native-safe-area-context"

const NftList = () => {
    const colors = ["#26292E", "#899F9C", "#B3C680", "#5C6265", "#F5D399", "#F1F1F1"]
    const { carouselSlideProps, carouselProgress } = useCarousel({ data: colors })

    return (
        <>
            <SafeAreaView />
            <View
                style={{
                    alignItems: "center",
                }}
            >
                <Carousel.Slide
                    {...carouselSlideProps}
                    renderItem={({ item, index }) => (
                        <Carousel.Item index={index}>
                            <View
                                style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    justifyContent: "center",
                                    backgroundColor: item,
                                    borderRadius: 10,
                                }}
                            >
                                <Text style={{ textAlign: "center", fontSize: RatioUtil.font(30) }}>{item}</Text>
                            </View>
                        </Carousel.Item>
                    )}
                />
                <Carousel.DotContainer data={carouselSlideProps.data} carouselProgress={carouselProgress} />
            </View>
        </>
    )
}

export default NftList
