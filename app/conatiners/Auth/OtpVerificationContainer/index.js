
import React, { useState, useEffect } from 'react';
import { Image, Text, View, StatusBar, ScrollView, Alert, KeyboardAvoidingView, Keyboard, Platform, TouchableOpacity } from 'react-native';
// styles and themes
import { images } from '../../../res/images';
import { Spacer } from '../../../res/spacer';
import globalStyles from '../../../res/globalStyles';
import { GradientButton } from '../../../components/GradientButton';
import { styles } from './style';
import { colors } from '../../../res/colors';
import { fonts } from '../../../res/fonts';
// third party library
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import SplashScreen from 'react-native-splash-screen';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import { useSelector, useDispatch } from 'react-redux';
import * as generalAction from '../../../redux/actions/GeneralAction';
import { onGetDocketHistory, onGetDockets, onGetShipToDockets, onPostAskForOtp } from '../../../redux/actions/AppAction';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import firebase from 'react-native-firebase';

// redux files
export default OtpVerificationContainer = (props) => {
    const dispatch = useDispatch();
    const [img_load, setImgLoad] = useState(false)
    const appReducer = useSelector(state => state.appReducer)
    const param = props.route.params;
    const [value, setValue] = useState('');
    const [timerCount, setTimer] = useState(600)
    const [resendTimerCount, setResendTimer] = useState(60)
    const [startTimer, setStartTimer] = useState(false)
    const codeInputRef = useBlurOnFulfill({ value, cellCount: 6 });
    const [s_props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    useEffect(() => {
        SplashScreen.hide()
    }, [])

    useEffect(() => {
        let interval = setInterval(() => {
            timerCount > 0 &&
                setTimer(lastTimerCount => {
                    lastTimerCount <= 1 && clearInterval(interval)
                    return lastTimerCount - 1
                })
        }, 1000)
        return () => clearInterval(interval)
    }, [timerCount]);

    useEffect(() => {
        let interval = setInterval(() => {
            {
                startTimer && resendTimerCount > 0 &&
                    setResendTimer(lastTimerCount => {
                        lastTimerCount <= 1 && clearInterval(interval)
                        return lastTimerCount - 1
                    })
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [startTimer, resendTimerCount]);

    useEffect(() => {
        Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustResize();
        const unsubscribe = props.navigation.addListener('focus', () => {
            Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustResize();
        });
        return unsubscribe;
    }, [props.navigation]);

    const onOtpLogin = async () => {
        Keyboard.dismiss()
        if (value.length === 6) {
            let token = await firebase.messaging().getToken();
            let s_requestBody = JSON.stringify({
                "Username": param.phone,
                "OTP": value,
                "Platform": Platform.OS == "ios" ? "IOS" : "android",
                "DeviceRegistrationToken": token
            })
            dispatch(generalAction.onCustomerLoginOtp(s_requestBody, (data) => {
                dispatch(onGetDockets(data, true))
                dispatch(onGetShipToDockets(data, true))
                dispatch(onGetDocketHistory(data, true))
                props.navigation.replace("Tab");
            }));
        } else {
            setTimeout(() => {
                Alert.alert(
                    getLanguageValue("ACM_INCORRECT_CODE"),
                    getLanguageValue("ACM_CHECK_CODE"),
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                setValue('')
                            },
                        }
                    ],
                    { cancelable: false },
                )
            }, 350);
        }
    }

    const onResend = () => {
        let s_requestBody = JSON.stringify({
            "Username": param.phone,
            "Lang": global.LanguageSelect
        })
        dispatch(onPostAskForOtp(s_requestBody, (data) => {
            if (data.response.IsSuccessful) {
                setTimeout(() => {
                    Alert.alert(
                        getLanguageValue("ACM_RESEND"),
                        getLanguageValue("ACM_RESEND_CONTENT"),
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    setStartTimer(true)
                                    setResendTimer(60)
                                    setTimer(600)
                                    setValue('')
                                },
                            }
                        ],
                        { cancelable: false },
                    )
                }, 350);
            }
        }))
    }

    return (
        <>
            <StatusBar translucent backgroundColor='transparent' barStyle={'light-content'} />
            {Platform.OS == 'ios' && <Image source={images.header_gradient} style={styles.stausbar_img_ic} resizeMode={"cover"} />}
            <View style={globalStyles.flex}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardDismissMode={'interactive'}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View>
                        <Image
                            source={images.image_bg}
                            onLoadStart={() => setImgLoad(false)}
                            onLoadEnd={() => setImgLoad(true)}
                            style={styles.logo_ic}
                            resizeMethod={"resize"}
                            resizeMode={"cover"} />
                        {img_load && <Image source={images.linear_bg} resizeMode={"cover"} style={styles.linear_img_ic} />}
                    </View>
                    <View style={{ ...globalStyles.subContainer }}>
                        <Spacer space={hp(1.2)} />
                        <Text style={styles.txt_regular_center}>{getLanguageValue('ACM_SEND_TO_MOBILE_NUMBER')}</Text>
                        <Spacer space={hp(1)} />
                        <Text style={{ ...styles.txt_regular_center, fontFamily: fonts.BOLD }}>{param.phone}</Text>
                        <Spacer space={hp(1.6)} />
                        <View style={[globalStyles.width]}>
                            <View style={{ height: Platform.isPad ? 60 : 50 }}>
                                <CodeField
                                    ref={codeInputRef}
                                    {...s_props}
                                    value={value}
                                    autoFocus={true}
                                    caretHidden={false}
                                    onChangeText={setValue}
                                    cellCount={6}
                                    rootStyle={styles.codeFieldRoot}
                                    keyboardType="number-pad"
                                    textContentType="oneTimeCode"
                                    renderCell={({ index, symbol, isFocused }) => (
                                        <View
                                            onLayout={getCellOnLayoutHandler(index)}
                                            key={index}
                                            style={[styles.cellRoot, isFocused && styles.focusCell]}>
                                            <Text style={styles.cellText}>
                                                {symbol || (isFocused ? <Cursor /> : null)}
                                            </Text>
                                        </View>
                                    )}
                                />
                            </View>
                            <Spacer space={hp(0.5)} />
                            <View style={{ alignSelf: "center", width: wp(82) }}>
                                <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => { onResend() }} disabled={(startTimer && resendTimerCount > 0) ? true : false}>
                                        <Text style={{ ...styles.txt_m, color: (startTimer && resendTimerCount > 0) ? colors.BLACK : colors.DODGER_BLUE, opacity: (startTimer && resendTimerCount > 0) ? 0.4 : 1 }}>{(startTimer && resendTimerCount > 0) ? getLanguageValue('ACM_RESEND') + '(' + resendTimerCount + 's)' : getLanguageValue('ACM_RESEND')}</Text>
                                    </TouchableOpacity>
                                    <Text style={{ ...styles.txt_m, color: timerCount == 0 ? colors.RED : colors.BLACK }}>{timerCount == 0 ? getLanguageValue("ACM_OTP_EXPIRED") : getLanguageValue('ACM_OTP_SECONDS').replace('{0}', timerCount)}</Text>
                                </View>
                            </View>
                        </View>
                        <Spacer space={hp(2)} />
                        <GradientButton
                            buttonText={getLanguageValue('ACM_SIGN_IN')}
                            buttonPress={() => { onOtpLogin() }}
                        />
                        <Spacer space={hp(1.5)} />
                        <Image source={images.logo} style={styles.bottom_img} resizeMode={"cover"} />
                        <Spacer space={hp(0.5)} />
                    </View>
                </ScrollView>
                {Platform.OS == 'ios' && <KeyboardAvoidingView behavior={'padding'} />}
            </View>
        </>
    );
}

