import { StyleSheet, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { colors } from '../../../../res/colors';
import { fonts } from '../../../../res/fonts';
import { getBottomSpace, ifIphoneX, isIphoneX } from 'react-native-iphone-x-helper';

export const styles = StyleSheet.create({
    bottom_container: {
        flexDirection: "row",
        backgroundColor: colors.MERCURY,
        height: isIphoneX() ? wp(22) : wp(16),
        ...ifIphoneX({
            paddingBottom: getBottomSpace() + 10,
        }, { paddingBottom: 5 }),
        justifyContent: 'space-around',
        borderTopColor: colors.GRAY_93,
        borderTopWidth: 1
    },
    bottom_wrapper: {
        alignSelf: 'center',
        width: wp(25)
    },
    sm_image: {
        width: wp(4),
        height: wp(4),
        alignSelf: "center"
    },
    mm_image: {
        width: wp(5),
        height: wp(5),
        alignSelf: "center"
    },
    lm_image: {
        width: wp(20),
        height: wp(20),
        top: isIphoneX() ? -24 : -20
    },
    txt_gray: {
        textAlign: "center",
        fontSize: wp(2.5),
        color: colors.GRAY_SUIT,
        paddingTop: wp(1),
        fontFamily: fonts.SEMI_BOLD
    }
})