import { Colors } from 'const';
import { Dimensions, StyleSheet } from 'react-native';
import { scaleSize } from 'styles/minixs';
import { RatioUtil } from 'utils';
const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  cardImage: {
    height: scaleSize(215),
    width: width - scaleSize(40),
  },
  card1MainView: {
    flexDirection: 'row',
    // height: scaleSize(90),
    fontWeight: '400',
    alignItems: 'flex-start',
    paddingVertical: scaleSize(25),
    
    // backgroundColor: 'pink'

  },
  card1InnerView: {
    // marginTop: scaleSize(25),
    paddingHorizontal: scaleSize(17),
    alignItems: 'flex-start'
    
  },
  cardTitle: {
    fontSize: RatioUtil.font(17),
    lineHeight: RatioUtil.font(19),
    color: Colors.WHITE,
    fontWeight: '700'
  },
  cardDesc: {
    fontSize: RatioUtil.font(12),
    lineHeight: RatioUtil.font(15),
    color: Colors.WHITE,
    marginTop: scaleSize(10)

  },
  girlImage: {
    height: scaleSize(40),
    width: scaleSize(40),

  },

});
