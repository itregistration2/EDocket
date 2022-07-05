import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../res/colors';
import { fonts } from '../../../res/fonts';

export const styles = StyleSheet.create({
    logo_ic: {
        width: wp(100),
        height: hp(Platform.isPad ? 44 : 52),
        alignSelf: "center",
        opacity: 0.5
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
        color: colors.BLACK,
        fontSize: wp(3.2),
        alignSelf: 'flex-end',
    },
    btm_container: {
        alignSelf: "center",
        paddingBottom: wp(5)
    },
    bottom_img: {
        width: wp(Platform.isPad ? 45 : 55),
        height: wp(15),
        alignSelf: "center"
    },
    codeFieldRoot: {
        width: wp(82),
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    cellRoot: {
        width: wp(12),
        height: wp(13),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.WHITE_OTP,
        borderColor: colors.ALBASTER,
        borderWidth: 0.5,
        borderRadius: 5
    },
    cellText: {
        color: colors.BLACK,
        fontSize: wp(5),
        textAlign: 'center',
    },
    focusCell: {
        borderColor: colors.GRAY_TXT,
        borderWidth: 1,
    },
    txt_regular_center: {
        fontFamily: fonts.REGULAR,
        fontSize: wp(4.2),
        width: wp(80),
        alignSelf: "center",
        textAlign: "center"
    }
})