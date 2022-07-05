//#region import 
//#region RN
import { StyleSheet } from 'react-native';
//#endregion
//#region third party libs
import { moderateScale } from 'react-native-size-matters';
//#endregion
//#region common files
import { colors } from '../../res/colors';
//#endregion
//#endregion

export const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        backgroundColor: 'transparent',
        flex: 1,
        alignItems: "center",
    },
    spinner_container: {
        borderRadius: 50,
        width: 50,
        height: 50,
        alignSelf: "center",
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor:'transparent',
      //  backgroundColor: "rgba(44, 27, 68, 0.2)",
        borderWidth: 0,

    },
    spinner: {
        alignSelf: 'center',
        zIndex: 999,
        alignItems: 'center',
        alignContent: 'center',
    },
    txtStyle: {
        textAlign: "center",
        color: colors.WHITE,
        margin: moderateScale(4),
        fontSize: moderateScale(12)
    }
})