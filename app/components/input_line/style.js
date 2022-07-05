import { Platform, StyleSheet } from 'react-native';
// Third party lib
import { scale, verticalScale } from 'react-native-size-matters';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
// Styles
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';

export const styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: colors.WHITE,
        alignSelf: "center",
        paddingVertical: Platform.OS == "ios" ? wp(0.6) : 0
    },
    textInput: {
        width: wp(100),
        alignSelf: 'center',
        color: colors.MIDDLE_GRAY,
        fontSize: wp(4.2),
        fontFamily: fonts.REGULAR,
        paddingHorizontal: wp(4),
        paddingBottom: wp(2),
        paddingTop: wp(Platform.OS == "android" ? 0 : 1)
    },
    headertxt: {
        fontFamily: fonts.SEMI_BOLD,
        color: colors.BLACK,
        alignSelf: 'flex-start',
        fontSize: wp(4),
        paddingTop: wp(1),
        paddingHorizontal: wp(4)
    },
    animatedStyle: {
        top: 5,
        left: 14,
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
    },
    position_top_ic: {
        position: "absolute",
        top: wp(4.5),
        right: wp(6),
        alignSelf: "center"
    },
    operation_ic: {
        width: wp(6),
        height: wp(6),
        resizeMode: "contain"
    }
})