import { StyleSheet, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';

export const styles = StyleSheet.create({
    section_title_wrapper: {
        flexDirection: "row",
        padding: wp(2),
        backgroundColor: colors.WHITE,
        borderBottomColor: colors.GRAY_MBORDER,
        borderBottomWidth: wp(0.5)
    },
    icon_style: {
        height: wp(8),
        width: wp(8),
        marginLeft: wp(2)
    },
    sm_icon_style: {
        height: wp(6),
        width: wp(6),
        marginHorizontal: wp(2)
    },
    tabBar: {
        backgroundColor: colors.WHITE,
        borderBottomColor: colors.BORDER_GRAY,
        borderBottomWidth: 1,
    },
    tabContainer: {
        width: wp(100) / 3,
        borderBottomColor: colors.BOTTOM_BORDER,
        height: wp(15),
        paddingHorizontal: 6,
        justifyContent: "center",
    },
    tabText: {
        color: colors.BOTTOM_BORDER,
        fontFamily: fonts.SEMI_BOLD,
        fontSize: wp(3.8),
        textAlign: "center"
    },
    separator: {
        height: 0.5,
        width: wp(96),
        alignSelf: 'flex-end',
        backgroundColor: colors.SEPERATOR_COLOR
    },
    sectionHeaderContainer: {
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
        borderBottomColor: '#f4f4f4',
        borderBottomWidth: 1,
        height: wp(3),
        backgroundColor: colors.BG_COMMON,
    },
    sectionHeaderText: {
        color: colors.GRAY_TXT,
        marginLeft: wp(2),
        fontSize: wp(5.5),
        fontFamily: fonts.BOLD,
        alignSelf: "center"
    },
    itemRow: {
        flexDirection: "row",
        width: wp(84),
        alignSelf: "center",
        paddingVertical: wp(1.5)
    },
    item_txt: {
        textAlign: "left",
        letterSpacing: wp(0.2),
        fontSize: wp(3.6),
        fontFamily: fonts.REGULAR,
        color: colors.GRAY_TXT,
    },
    lbl_Bold: {
        textAlign: "center",
        fontSize: wp(8),
        fontFamily: fonts.BOLD,
        color: colors.DARK_SPRING_GREEN
    },
    seperate_row_st: {
        alignSelf: "center",
        backgroundColor: colors.WHITE,
        width: wp(100)
    },
    sm_bg: {
        textAlign: "center",
        fontSize: wp(8),
        fontFamily: fonts.BOLD,
        color: colors.DARK_SPRING_GREEN
    },
    sm_sl: {
        textAlign: "center",
        fontSize: wp(3.5),
        fontFamily: fonts.REGULAR,
        color: colors.GRAY_TXT
    }
})