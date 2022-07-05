import { StyleSheet,Platform } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';

export const styles = StyleSheet.create({
    viewWrapper: {
        width: wp(90),
        height: moderateScale(40),
        borderRadius: moderateScale(10),
        justifyContent: "space-evenly",
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: colors.GRAY_93,
        borderWidth: 1,
        borderColor: colors.GRAY_93,
    },
    animatedView: {
        position: "absolute",
        width: wp(45),
        justifyContent: 'center',
    },
    tabWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: wp(45),
        alignItems: "center"
    },
    tabText: {
        fontSize: wp(3.8),
        textAlign: "center",
        color: colors.BLACK,
        fontFamily: fonts.SEMI_BOLD
    },
    gradientMain: {
        height: moderateScale(33),
        marginVertical: wp(0.65),
        marginHorizontal: wp(0.6),
        borderRadius: moderateScale(10),
        ...Platform.select({
            ios: {
                shadowColor: "#aaa",
                shadowOpacity: 8,
                shadowRadius: 8,
                shadowOffset: { height: 8, width: 8 },
            },
            android: {
                elevation: 5
            },
        }),
    },
})