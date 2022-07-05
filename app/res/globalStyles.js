import { StyleSheet, Platform } from 'react-native';
// Third party lib
import { getBottomSpace, getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
// Styles
import { colors } from './colors';
import { DEVICE } from '../utils/Constants';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight() + 10
      },
      {
        paddingTop: getStatusBarHeight()
      }
    )
  },
  subContainer: {
    flex: 1,
    width: wp(90),
    alignSelf: 'center'
  },
  flex: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  header: {
    backgroundColor: colors.REGUAL_BLUE,
    ...ifIphoneX(
      {
        paddingTop: getStatusBarHeight() + 15
      },
      {
        paddingTop: Platform.OS == "ios" ? getStatusBarHeight() + 10 : 16 // for android 
      }
    )
  },
  headerSubContainer: {
    flexDirection: 'row',
    width: wp(90),
    alignSelf: 'center',
    paddingBottom: 4
  },
  width: {
    width: DEVICE.DEVICE_WIDTH / 1.1,
    alignSelf: 'center',
  },
  oneFlex: {
    flex: 1
  },
  bottomSpace: {
    ...ifIphoneX(
      {
        marginBottom: getBottomSpace()
      },
      {
        marginBottom: 10
      }
    )
  },
  lg_bottomSpace: {
    ...ifIphoneX(
      {
        marginBottom: getBottomSpace()
      },
      {
        marginBottom: 16
      }
    )
  }
})

export default globalStyles
