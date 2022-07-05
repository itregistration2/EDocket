import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { fonts } from '../../../res/fonts';
import { colors } from '../../../res/colors';
import { moderateScale } from 'react-native-size-matters';
import { Platform } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

export const styles = StyleSheet.create({
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
    txt_fonts: {
        fontFamily: fonts.BOLD,
        fontSize: wp(4),
        color: colors.BLACK
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
    },
    divider: {
        backgroundColor: colors.DIVIDER,
        height: wp(0.4),
        marginLeft: wp(4)
    },
    textInput_calender: {
        width: wp(96),
        alignSelf: 'center',
        borderColor: colors.WHITE,
    },
    date_ic: {
        width: wp(6),
        height: wp(6),
        alignSelf: 'center',
        zIndex: 1,
    },
    dateWrapper: {
        padding: 5,
        marginRight: 10,
        justifyContent: 'center'
    },
    modal_container: {
        width: wp(100),
        height: hp(40),
        marginHorizontal: 0,
        marginVertical: 0,
        bottom: 0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: "hidden",
        position: "absolute"
    },
    dropdown_ic: {
        width: wp(3),
        height: wp(3),
        resizeMode: "contain",
        alignSelf: "center",
        marginLeft: wp(1)
    }
})