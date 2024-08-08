import { Dimension } from "const"
import { Dimensions, PixelRatio, Platform } from 'react-native'
import { responsiveHeight, responsiveWidth, responsiveFontSize } from "react-native-responsive-dimensions"

const {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
} = Dimensions.get('window')

export let screenInsets = {
    top: 0,
    bottom: 0
}

export const RatioUtil = {
    width: (width: number): number => {
        return responsiveWidth((width / Dimension.BASE.WIDTH) * 100)
    },

    height: (height: number): number => {
        return responsiveHeight((height / Dimension.BASE.HEIGHT) * 100)
    },
    heightSafeArea: (height: number): number => {
        const insetRate = (screenInsets.top + screenInsets.bottom) / SCREEN_HEIGHT

        return responsiveHeight((height / Dimension.BASE.HEIGHT) * (1 - insetRate) * 100)
    },

    lengthFixedRatio: (_length: number): number => {
        return RatioUtil.width(_length)
    },
    heightFixedRatio: (_length: number): number => {
        return RatioUtil.lengthFixedRatio(_length)
    },

    font: (size: number): number => {
        const scale = Math.min(SCREEN_WIDTH / Dimension.BASE.WIDTH, SCREEN_HEIGHT / Dimension.BASE.HEIGHT)
        return PixelRatio.roundToNearestPixel(size * scale)
        //return responsiveFontSize(size * 0.135)
    },
    fontWeightBold: () => {
        return Platform.OS === 'ios' ? "600" : "700"
    },

    size: (_width = 0, _height = 0) => {
        const width = RatioUtil.width(_width)

        if (_width === _height) {
            return {
                width,
                height: width,
            }
        }

        return {
            width: width,
            height: RatioUtil.height(_height),
        }
    },
    sizeFixedRatio: (_width = 0, _height = 0) => {
        return {
            width: RatioUtil.lengthFixedRatio(_width),
            height: RatioUtil.lengthFixedRatio(_height),
        }
    },
    padding: (top = 0, right = 0, bottom = 0, left = 0) => {
        //if (top === right && top === bottom && top === left)
        //    return {
        //        padding: RatioUtil.width(top),
        //    }

        return {
            paddingTop: RatioUtil.height(top),
            paddingRight: RatioUtil.width(right),
            paddingBottom: RatioUtil.height(bottom),
            paddingLeft: RatioUtil.width(left),
        }
    },
    paddingFixedRatio: (top = 0, right = 0, bottom = 0, left = 0) => {
        //if (top === right && top === bottom && top === left)
        //    return {
        //        padding: RatioUtil.width(top),
        //    }

        return {
            paddingTop: RatioUtil.lengthFixedRatio(top),
            paddingRight: RatioUtil.lengthFixedRatio(right),
            paddingBottom: RatioUtil.lengthFixedRatio(bottom),
            paddingLeft: RatioUtil.lengthFixedRatio(left),
        }
    },
    margin: (top = 0, right = 0, bottom = 0, left = 0) => {
        if (top === right && top === bottom && top === left) {
            return {
                margin: RatioUtil.width(top),
            }
        }

        return {
            marginTop: RatioUtil.height(top),
            marginBottom: RatioUtil.height(bottom),
            marginRight: RatioUtil.width(right),
            marginLeft: RatioUtil.width(left),
        }
    },
    marginFixedRatio: (top = 0, right = 0, bottom = 0, left = 0) => {
        return {
            marginTop: RatioUtil.lengthFixedRatio(top),
            marginBottom: RatioUtil.lengthFixedRatio(bottom),
            marginRight: RatioUtil.lengthFixedRatio(right),
            marginLeft: RatioUtil.lengthFixedRatio(left),
        }
    },
    borderRadius: (top = 0, right = 0, bottom = 0, left = 0) => {
        return {
            borderTopStartRadius: RatioUtil.width(top),
            borderTopEndRadius: RatioUtil.width(right ? right : top),
            borderBottomRightRadius: RatioUtil.width(bottom ? bottom : top),
            borderBottomLeftRadius: RatioUtil.width(left ? left : bottom ? bottom : top),
        }
    },

    position: () => {
        return
    },
}
