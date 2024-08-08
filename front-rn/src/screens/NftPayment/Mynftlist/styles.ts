import { Colors } from 'const';
import {Platform, Dimensions, StyleSheet} from 'react-native';
import { globalStyle } from 'styles';
import { scaleSize } from 'styles/minixs';
const {width, height} = Dimensions.get('window');

export const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  backButton: {
    height: scaleSize(50),
    width: scaleSize(50),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    elevation: 1,


  },
  headerView: {
    flexDirection: 'row',
    height: scaleSize(50),
    alignItems: 'center',
  },
  backImage: {
    height: scaleSize(15),
    width: scaleSize(15),

  },
  headerTitleView: {
    height: scaleSize(50),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    
  },
  headerTitle: {
    fontSize: scaleSize(15),
    lineHeight: scaleSize(17),
    fontWeight: '800',
    
  },
  modalMainView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  modalView: {
    height: scaleSize(300),
    width: scaleSize(200),
    alignItems: 'center',
    justifyContent: 'center',

  },
  playerImage: {
    height: scaleSize(150),
    width: scaleSize(150),
    
  },

});
