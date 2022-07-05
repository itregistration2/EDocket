
import React, { useEffect } from 'react';
import { StatusBar, NativeModules, Platform } from 'react-native';
// styles and themes
import { getData } from '../../../utils/AsyncStorageHelper';
import { StorageKey } from '../../../utils/Constants';
//redux files & thirdpart libraries
import { useDispatch } from 'react-redux';
import { clearAsyncUserDetails, storeAsyncUserDetails } from '../../../redux/actions/GeneralAction';
import SplashScreen from 'react-native-splash-screen';
import { WebView } from 'react-native-webview';
import { onGetDockets, onGetShipToDockets, onGetDocketHistory, onGetLanguageJsonData } from '../../../redux/actions/AppAction';


export default SplashContainer = (props) => {
    const dispatch = useDispatch();

    const deviceLanguage =
        Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
            NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
            : NativeModules.I18nManager.localeIdentifier;

    useEffect(() => {
        getData("language", (data => {
            data != null ? (global.LanguageSelect = data, dispatch(onGetLanguageJsonData())) : (global.LanguageSelect = (deviceLanguage == 'en' ? 'en' : 'zh'), dispatch(onGetLanguageJsonData()))
        }), (err => {
            (global.LanguageSelect = (deviceLanguage == 'en' ? 'en' : 'zh'), dispatch(onGetLanguageJsonData()))
        }))
        SplashScreen.hide()
        setTimeout(() => {
            getData(StorageKey.USER_DETAIL, (data => {
                dispatch(storeAsyncUserDetails(data))
                data != null ?
                    (
                        dispatch(onGetDockets(data, true)),
                        dispatch(onGetShipToDockets(data, true)),
                        dispatch(onGetDocketHistory(data, true)),
                        props.navigation.replace('Tab')
                    )
                    :
                    (props.navigation.replace('Auth'), dispatch(clearAsyncUserDetails()));
            }), (err => {
                dispatch(clearAsyncUserDetails())
                props.navigation.replace('Auth')
            }))
        }, 1000);
    }, [])



    const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `
    return (
        <>
            <StatusBar translucent backgroundColor='transparent' barStyle={"dark-content"} />
            <WebView
                style={{ flex: 1 }}
                source={Platform.OS == "android" ? { uri: 'file:///android_asset/index.html' } : require("../../../assets/index.html")}
                scrollEnabled
                scalesPageToFit={true}
                injectedJavaScript={INJECTEDJAVASCRIPT}
            />
        </>
    );
}

