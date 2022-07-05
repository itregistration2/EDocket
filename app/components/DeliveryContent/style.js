import { StyleSheet, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';

export const styles = StyleSheet.create({
    square_wrapper: {
        marginLeft: 2,
        width: wp(22),
        height: wp(22),
        borderRadius: wp(4),
        justifyContent: "center",
        ...Platform.select({
            ios: {
                shadowColor: "#aaa",
                shadowOpacity: 1,
                shadowRadius: 2,
                shadowOffset: { height: 2, width: 0 },
            },
            android: {
                elevation: 3
            },
        }),

    },
    lbl_square: {
        fontSize: wp(6.2),
        alignSelf: "center",
        fontFamily: fonts.BOLD,
        color: colors.DARK_SPRING_GREEN,
    },
    inner_wrapper: {
        paddingLeft: hp(1.5),
        width: wp(60)
    },
    txt_fonts: {
        fontFamily: fonts.BOLD,
        fontSize: wp(3.6),
        color: colors.BLACK
    },
    round_wrapper: {
        paddingVertical: wp(1),
        paddingHorizontal: wp(5),
        backgroundColor: colors.PIZZAS,
        borderRadius: wp(10),
        marginLeft: wp(2),
    },
    ic_right: {
        width: wp(6),
        height: wp(6),
        alignSelf: "flex-start"
    },
    ic_link: {
        position: "absolute",
        right: wp(1.5),
        alignSelf: "center",
        width: wp(6),
        height: wp(6),
    }
})