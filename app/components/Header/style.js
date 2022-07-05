import { StyleSheet, Platform } from 'react-native';
// Third party lib
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// Styles
import { colors } from '../../res/colors';
import { fonts } from '../../res/fonts';

export const styles = StyleSheet.create({
    backWrapper: {
        justifyContent: 'center',
        marginLeft: wp(2)
    },
    rightIcon: {
        width: wp(6.5),
        height: wp(6.5),
        alignSelf: 'center'
    },
    headerText: {
        color: colors.WHITE,
        fontFamily: fonts.BOLD,
        fontSize: wp(Platform.isPad ? 7 : 9),
        alignSelf: 'flex-start',
        textAlign: 'left'
    },
    topheaderText: {
        color: colors.SUB_HEADER,
        fontFamily: fonts.REGULAR,
        fontSize: wp(Platform.isPad ? 3 : 3.5),
        alignSelf: 'flex-start',
        textAlign: 'left'
    },
    ic_container: {
        position: "absolute",
        right: 0,
        flexDirection: "row",
    },
    input_wrapper: {
        width: wp(90),
        alignSelf: 'center',
        borderRadius: wp(3),
        flexDirection: "row",
        backgroundColor: colors.INPUT_BG,
        height: wp(10),
        margin: wp(2),
        paddingLeft: wp(3),
    },
    img_ic: {
        width: wp(5.5),
        height: wp(5.5),
        alignSelf: "center",
    },
    txt_input: {
        width: wp(80),
        color: colors.WHITE,
        fontSize: wp(3.6),
        paddingLeft: wp(2),
        height: wp(10),
        fontFamily: fonts.REGULAR,
    },
    flexing_row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    close_container: {
        justifyContent: "center",
        position: "absolute",
        right: wp(2),
        height: wp(10),
    },
    close_ic: {
        width: wp(5),
        height: wp(5),
    }
})