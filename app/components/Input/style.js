import { Platform, StyleSheet } from 'react-native';
// Third party lib
import { scale, verticalScale } from 'react-native-size-matters';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
// Styles
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';

export const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: colors.GRAY_RGB,
        width: wp(85),
        alignSelf: "center",
        borderRadius: wp(1.5),
        paddingVertical: Platform.OS == "ios" ? wp(0.6) : 0
    },
    textInput: {
        width: wp(80),
        alignSelf: 'center',
        color: colors.MIDDLE_GRAY,
        fontSize: wp(4.2),
        fontFamily: fonts.SEMI_BOLD,
        margin: wp(1),
        marginBottom: 0,
        padding: wp(4),
        paddingLeft: wp(1)
    },
    headertxt: {
        fontFamily: fonts.REGULAR,
        color: colors.FLOAT_LABEL_GRAY,
        alignSelf: 'flex-start',
        fontSize: wp(12),
    },
    animatedStyle: {
        top: Platform.isPad ? 2 : 5,
        left: Platform.isPad ? 26 : 14,
        position: 'absolute',
    },
    inputView: {
        width: wp(80),
        alignSelf: 'center',
        margin: wp(1),
        marginBottom: 0,
    },
    insideText: {
        fontFamily: fonts.SEMI_BOLD,
        color: colors.MIDDLE_GRAY,
        fontSize: wp(4.2),
        padding: wp(4),
        paddingLeft: wp(1),
        flex: 1,
    },
    eyeWrapper: {
        padding: 5,
        justifyContent: 'center'
    },
    eye: {
        width: scale(24),
        height: verticalScale(24),
        alignSelf: 'center',
        zIndex: 1,
    }
})