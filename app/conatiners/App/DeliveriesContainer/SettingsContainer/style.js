import { StyleSheet, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../../res/colors';
import { fonts } from '../../../../res/fonts';

export const styles = StyleSheet.create({
    ic_right: {
        width: wp(7),
        height: wp(7)
    },
    divider: {
        backgroundColor: colors.GRAY_93,
        height: wp(0.4)
    },
    txt_fonts: {
        fontFamily: fonts.REGULAR,
        fontSize: wp(4),
        color: colors.BLACK,
        alignSelf:"center"
    },
    wrapper: {
        backgroundColor: colors.WHITE,
        width: wp(100),
        flexDirection: "row",
        justifyContent: "space-between",
        alignSelf: "center",
        paddingHorizontal: wp(4),
        paddingVertical: wp(4)
    },
    
})