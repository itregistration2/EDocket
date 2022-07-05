
import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
// Third party lib
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
// Styles
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';

export const styles = StyleSheet.create({
    back_wrapper: {
        flexDirection: "row",
        position: "absolute",
        zIndex: 1
    },
    backIcon: {
        width: wp(5),
        height: wp(5),
        resizeMode: "contain",
        alignSelf: 'center',
    },
    txt_back: {
        fontSize: wp(4),
        fontFamily: fonts.REGULAR,
        color: colors.WHITE
    },
    txt_header: {
        color: colors.WHITE,
        fontSize: wp(8),
        textAlign: "center",
        fontFamily: fonts.NOTO_BOLD
    },
    txt_sm: {
        flex: 1,
        textAlign: "center",
        fontSize: wp(4.5),
        fontFamily: fonts.BOLD,
        color: colors.WHITE
    }

})