import { StyleSheet, Platform } from 'react-native';
import { ifIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
    slider_image: {
        height: hp("100%"),
        width: wp("100%"),
    },
    back_wrapper: {
        flexDirection: "row",
        position: "absolute",
        left: wp(3),
        zIndex: 1,
        ...ifIphoneX({
            paddingTop: getStatusBarHeight() + 15
        }, {
            paddingTop: Platform.OS == "ios" ? getStatusBarHeight() + 10 : 16 // for android 
        }),
    },
    dotstyle: {
        width: wp(2),
        height: wp(2),
        borderRadius: wp(2)
    },
    backIcon: {
        width: wp(5),
        height: wp(5),
        resizeMode: "contain",
        alignSelf: 'center',
    },
    bottom_view: {
        alignSelf: "center",
        position: "absolute",
        ...ifIphoneX({
            bottom: getStatusBarHeight() + 15
        }, {
            bottom: Platform.OS == "ios" ? getStatusBarHeight() + 10 : 16 // for android 
        }),
    }
})