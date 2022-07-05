import { StyleSheet, Platform } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../../res/colors';
import { fonts } from '../../../../res/fonts';

export const styles = StyleSheet.create({
    ic_right: {
        width: wp(7),
        height: wp(7),
        resizeMode: "center",
        alignSelf: "center",
        marginTop: 4
    },
    divider: {
        backgroundColor: colors.DARK_BORDER_MODEL,
        height: wp(0.3)
    },
    txt_fonts: {
        fontFamily: fonts.REGULAR,
        fontSize: wp(4.2),
        color: colors.BLACK,
        alignSelf: "center"
    },
    wrapper: {
        backgroundColor: colors.WHITE,
        width: wp(100),
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
        paddingHorizontal: wp(3.5),
        paddingRight: wp(1.5),
        paddingVertical: wp(3)
    },
    modal_container: {
        width: wp(100),
        height:hp(100),
        marginHorizontal: 0,
        marginVertical: 0,
        top: hp(isIphoneX() ? 6 : 3),
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: "hidden",
        position: "absolute"
    }
})