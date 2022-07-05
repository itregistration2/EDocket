
import React, { useState, useEffect } from 'react';
import { Image, View, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// styles and themes
import { images } from '../../../res/images';
import { Spacer } from '../../../res/spacer';
import globalStyles from '../../../res/globalStyles';
import { GradientButton } from '../../../components/GradientButton';
import { Input } from '../../../components/Input';
import { styles } from './style';
import BaseClass from '../../../utils/BaseClass';
// redux files
// third party library 
import { onGetOtpForTest, onPostAskForOtp } from '../../../redux/actions/AppAction';
import SplashScreen from 'react-native-splash-screen';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';

export default LoginOtpContainer = (props) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('')
    const [img_load, setImgLoad] = useState(false)

    const Base = new BaseClass();
    const appReducer = useSelector(state => state.appReducer)

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
        Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustResize();
        const unsubscribe = props.navigation.addListener('focus', () => {
            Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustResize();
        });
        return unsubscribe;
    }, [props.navigation]);

    const onLogin = () => {
        if (username == '') {
            Base.showToastAlert(getLanguageValue('ACM_EMAIL_PHONE_NUMBER'));
        } else {
            let s_requestBody = JSON.stringify({
                "Username": username,
                "Lang": global.LanguageSelect
            })
            dispatch(onPostAskForOtp(s_requestBody, (data) => {
                console.log(data)
                if (data.response.IsSuccessful) {
                    // dispatch(onGetOtpForTest(data.Phone, (result) => {
                    //     console.log(result)
                    //     if (result.status) {
                    //         props.navigation.navigate("Otp", { phone: username });
                    //     }
                    // }))
                     props.navigation.navigate("Otp", { phone: username });
                    setTimeout(() => {
                        Base.showToastSucess(data.response.Message);
                    }, 500);
                } else {
                    Base.showToastAlert(data.response.Message);
                }
            }))
        }
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
                            resizeMode={"stretch"} />
                        {img_load && <Image source={images.linear_bg} resizeMode={"cover"} style={styles.linear_img_ic} />}
                    </View>
                    <View style={{ ...globalStyles.subContainer }}>
                        <Spacer space={hp(2)} />
                        <>
                            <Input
                                value={username}
                                onChange={(val) => setUsername(val)}
                                headerText={getLanguageValue('ACM_EMAIL_PHONE_NUMBER')}
                                keyboardType={'phone-pad'}
                            />
                        </>
                        <Spacer space={hp(2)} />
                        <GradientButton
                            buttonText={getLanguageValue('ACM_GET_OTP')}
                            buttonPress={() => { onLogin() }}
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

