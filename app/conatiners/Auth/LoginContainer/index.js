
import React, { useState, useEffect } from 'react';
import { Image, View, StatusBar, ScrollView, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
// styles and themes
import { images } from '../../../res/images';
import { Spacer } from '../../../res/spacer';
import globalStyles from '../../../res/globalStyles';
import { GradientButton } from '../../../components/GradientButton';
import { Input } from '../../../components/Input';
import { styles } from './style';
import BaseClass from '../../../utils/BaseClass';
// third party library
import SplashScreen from 'react-native-splash-screen';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';
import * as generalAction from '../../../redux/actions/GeneralAction';
import { onGetDocketHistory, onGetDockets, onGetShipToDockets } from '../../../redux/actions/AppAction';

// redux files

export default LoginContainer = (props) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('')
    const [img_load, setImgLoad] = useState(false)

    const [password, setPassword] = useState('')
    const [show, setShow] = useState(true)
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
        Keyboard.dismiss()
        if (username == '') {
            Base.showToastAlert(getLanguageValue('ACM_EMAIL_PHONE_NUMBER'));
        } else if (password.trim() == '') {
            Base.showToastAlert(getLanguageValue('ACM_INCORRECT_PASSWORD'));
        } else {
            dispatch(generalAction.onCustomerLogin({ username, password, token: "''" }, (data) => {
                dispatch(onGetDockets(data, true))
                dispatch(onGetShipToDockets(data, true))
                dispatch(onGetDocketHistory(data, true))
                props.navigation.replace("Tab");
            }));
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
                        <Spacer space={hp(1.5)} />
                        <>
                            <Input
                                value={username}
                                onChange={(val) => setUsername(val)}
                                headerText={getLanguageValue('ACM_EMAIL_PHONE_NUMBER')}
                                keyboardType={'email-address'}
                            />
                            <Spacer space={hp(1.2)} />
                            <Input
                                value={password}
                                onChange={(val) => setPassword(val)}
                                headerText={getLanguageValue('ACM_PASSWORD')}
                                passwordInput
                                secureTextEntry={show}
                                onHideShow={() => { setShow(!show) }}
                            />
                        </>
                        <Spacer space={hp(1.2)} />
                        <GradientButton
                            buttonText={getLanguageValue('ACM_SIGN_IN')}
                            buttonPress={() => { onLogin() }}
                        />
                        <Spacer space={hp(0.2)} />
                        <Image source={images.logo} style={styles.bottom_img} resizeMode={"cover"} />
                        <Spacer space={hp(0.5)} />
                    </View>
                </ScrollView>
                {Platform.OS == 'ios' && <KeyboardAvoidingView behavior={'padding'} />}
            </View>
        </>
    );
}

