import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../res/colors';

export const styles = StyleSheet.create({
    logo_ic: {
        width: wp(100),
        height: hp(Platform.isPad ? 55 : 62),
        alignSelf: "center"
    },
    linear_img_ic: {
        width: wp(100),
        height: wp(25),
        position: "absolute",
        bottom: 0
    },
    stausbar_img_ic: {
        width: wp(100),
        height: wp(15),
        position: "absolute",
        top: 0,
        zIndex: 1
    },
    txt_m: {
        color: colors.LIGHT_RED,
        fontSize: wp(4),
        alignSelf: 'flex-end',
        right: wp(2)
    },
    btm_container: {
        alignSelf: "center",
        paddingBottom: wp(5)
    },
    bottom_img: {
        width: wp(Platform.isPad ? 45 : 55),
        height: wp(15),
        alignSelf: "center"
    }
})