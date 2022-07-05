import { StyleSheet, Platform } from 'react-native';
import { isIphoneX, ifIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../../res/colors';
import { fonts } from '../../../../res/fonts';

export const styles = StyleSheet.create({

    view_wrapper: {
        ...ifIphoneX(
            {
                paddingTop: getStatusBarHeight() + 15
            },
            {
                paddingTop: Platform.OS == "ios" ? getStatusBarHeight() + 10 : 16 // for android 
            }
        ),
        backgroundColor: colors.BLACK
    },
    view_wrapper_bottom: {
        ...ifIphoneX(
            {
                paddingBottom: getStatusBarHeight() + 15
            },
            {
                paddingBottom: Platform.OS == "ios" ? getStatusBarHeight() + 10 : 16 // for android 
            }
        ),
        backgroundColor: colors.BLACK
    },
    backIcon: {
        width: wp(5),
        height: wp(5),
        resizeMode: "contain",
        alignSelf: 'center',
    },
})