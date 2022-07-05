import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';
// Third party lib
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    buttonContainer: {
        width: wp(85),
        alignSelf: 'center',
    },
    gradientMain: {
        padding: moderateScale(12),
        borderColor: colors.VIOLET,
        borderRadius: moderateScale(2),
    },
    insideText: {
        fontSize: wp(4.5),
        textAlign: 'center',
        color: colors.WHITE,
        fontFamily: fonts.BOLD,
    },
    goole_ic: {
        width: wp(6),
        height: wp(6),
        marginRight: wp(2)
    },
    flexing_row: {
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "center"
    },
    ic_image: {
        width: wp(5),
        height: wp(5),
        alignSelf: "center",
        resizeMode: "stretch"
    },
    f_row: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    }
})