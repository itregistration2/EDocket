import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
// styles and themes
import { Spacer } from '../../../../res/spacer';
import globalStyles from '../../../../res/globalStyles';
import { images } from '../../../../res/images';
import { fonts } from '../../../../res/fonts';
import { colors } from '../../../../res/colors';
import { AppHeader } from '../../../../components/AppHeader';
import { styles } from './style';
// Third party libraries & redux
import firebase from 'react-native-firebase';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { showConfirmationDialogYesNoClick } from '../../../../utils/Constants';
import { useSelector, useDispatch } from 'react-redux';
import { removeData } from '../../../../utils/AsyncStorageHelper';
import { clearAsyncUserDetails } from '../../../../redux/actions/GeneralAction';
import { onCustomerLogoutOtp, onGetAppVersion } from '../../../../redux/actions/AppAction';

export default Settings = (props) => {
    const dispatch = useDispatch();
    const [appVersion, setAppVersion] = useState('')
    const appReducer = useSelector(state => state.appReducer)
    const generalReducer = useSelector(state => state.generalReducer)

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    // useEffect(async () => {
    //     let token = await firebase.messaging().getToken();
    //     console.log(token)
    // })

    useEffect(() => {
        dispatch(onGetAppVersion((data) => {
            console.log(data)
            setAppVersion(data.responseData.AppVersion)
        }))
    }, [])

    const onLogout = () => {
        showConfirmationDialogYesNoClick(`${getLanguageValue('ACM_LOGOUT_CONFIRM')}`, () => {
            removeData('userDetails');
            dispatch(clearAsyncUserDetails())
            setTimeout(async () => {
                let token = await firebase.messaging().getToken();
                let s_requestBody = JSON.stringify({
                    "UserName": generalReducer.userDetails?.username,
                    "DeviceRegistrationToken": token
                })
                dispatch(onCustomerLogoutOtp(s_requestBody, (data) => { }))
                props.navigation.replace('Auth');
            }, 150);
        })
    }

    return (
        <View style={globalStyles.flex}>
            <AppHeader isShow onBackPress={() => { props.navigation.goBack() }} hide_title={false} _title={getLanguageValue('ACM_SETTINGS')} />
            <View style={{ ...globalStyles.subContainer, width: wp(100), backgroundColor: colors.BG_COMMON }}>
                <View style={{ padding: wp(4) }}>
                    <Text style={{ ...styles.txt_fonts, textAlign: "center" }}>{generalReducer.userDetails && generalReducer.userDetails.username}</Text>
                    <Text style={{ ...styles.txt_fonts, textAlign: "center", fontSize: wp(3.5), color: colors.GRAY_PLACEHOLDER }}>{generalReducer.userDetails && generalReducer.userDetails.Phone}</Text>
                </View>

                <TouchableOpacity style={styles.wrapper} onPress={() => { props.navigation.navigate("Language") }}>
                    <Text style={styles.txt_fonts}>{getLanguageValue('ACM_LANGUAGE')}</Text>
                    <Image source={images.next_grey} style={{ ...styles.ic_right, alignSelf: "center" }} resizeMode={"contain"} />
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.wrapper} onPress={() => { props.navigation.navigate("Introductions") }}>
                    <Text style={styles.txt_fonts}>{getLanguageValue('ACM_INTRODUCTION')}</Text>
                    <Image source={images.next_grey} style={{ ...styles.ic_right, alignSelf: "center" }} resizeMode={"contain"} />
                </TouchableOpacity>
                <Spacer space={hp(0.8)} />
                <>
                    <View style={styles.divider} />
                    <TouchableOpacity style={{ ...styles.wrapper, justifyContent: "center" }} onPress={() => { onLogout() }}>
                        <Text style={{ ...styles.txt_fonts, fontFamily: fonts.BOLD, color: colors.RED }}>{getLanguageValue('ACM_LOGOUT')}</Text>
                    </TouchableOpacity>
                    <View style={styles.divider} />
                </>

                {/* <TouchableOpacity style={{ ...styles.wrapper, alignSelf: "flex-end", backgroundColor: colors.BG_COMMON, position: "absolute", bottom: wp(2), left: wp(2) }}>
                    <Text style={styles.txt_fonts}>{getLanguageValue('ACM_VERSION') + ' ' + appVersion}</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    )
}