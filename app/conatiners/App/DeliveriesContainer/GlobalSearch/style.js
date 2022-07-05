import { StyleSheet, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../../res/colors';
import { fonts } from '../../../../res/fonts';

export const styles = StyleSheet.create({
    txt_fonts: {
        fontFamily: fonts.BOLD,
        fontSize: wp(3.6),
        color: colors.BLACK
    },
    ic_right: {
        width: wp(6),
        height: wp(6),
        alignSelf: "flex-start"
    },
    ic_dock: {
        width: wp(30),
        alignSelf: "center",
        height: wp(30)
    },
    divider: {
        backgroundColor: colors.DIVIDER,
        height: wp(0.4),
        marginLeft: wp(4)
    },
    f_position: {
        position: "absolute",
        width: wp(100),
        zIndex: 0
    },
    inner_wrapper: {
        paddingLeft: hp(1.5),
        width: wp(60)
    },
    txt_regular_fonts: {
        fontFamily: fonts.REGULAR,
        fontSize: wp(3.6),
        color: colors.BLACK
    },
    round_wrapper: {
        position: "absolute",
        right: 5,
        paddingVertical: wp(1.5),
        paddingHorizontal: wp(3),
        backgroundColor: colors.PIZZAS,
        borderRadius: wp(10),
        marginLeft: wp(2),
        alignSelf: "flex-start"
    },
    wrapper_txt: {
        fontFamily: fonts.BOLD,
        fontSize: wp(3.8),
        alignSelf: "center",
        color: colors.WHITE
    },
 
    ic_complete_left: {
        width: wp(5.5),
        height: wp(5.5),
        alignSelf: "center",
        marginRight: 4
    },
    f_row: {
        flexDirection: "row",
        paddingHorizontal: wp(5),
        paddingVertical: wp(2),
        backgroundColor: colors.WHITE,
    },
    b_border_color: {
        backgroundColor: colors.GRAY_MBORDER,
        height: wp(0.4)
    },
    filter_wrapper: {
        flexDirection: "row",
        backgroundColor: colors.WHITE,
        paddingHorizontal: wp(5),
        paddingVertical: wp(3)
    },
    flex_row: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})