import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
// styles and themes
import globalStyles from '../../../res/globalStyles';
import { AppHeader } from '../../../components/AppHeader';
// Third party libraries
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { WebView } from 'react-native-webview';
import * as Progress from 'react-native-progress';

export default WebViewContainer = (props) => {
    const [load, setLoad] = useState(true);
   // const INJECTEDJAVASCRIPT = 'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta); '
   const INJECTEDJAVASCRIPT = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `
    
   return (
        <View style={globalStyles.flex}>
            <AppHeader isShow is_white onBackPress={() => { props.navigation.goBack() }} hide_title />

            {load &&
                // <View style={{ zIndex: 9999, position: "absolute", top: hp(100) / 2, left: wp(88) / 2 }}>
                //     <Progress.Circle borderWidth={8} thickness={10} size={50} indeterminate={true} color={'#004070'} />
                // </View>
                
                <WebView
                    style={{ flex: 1 }}
                    //source={require("../../../assets/index.html")}
                    source={Platform.OS == "android" ? { uri: 'file:///android_asset/index.html' } : require("../../../assets/index.html")}
                    scrollEnabled
                   scalesPageToFit={true}
                    injectedJavaScript={INJECTEDJAVASCRIPT}
                />
            }

            <WebView
                onLoad={() => setLoad(false)}
               // scalesPageToFit={Platform.OS == "android" ? false : true}
                scrollEnabled
                originWhitelist={['*']}
                injectedJavaScript={INJECTEDJAVASCRIPT}
                style={{ flex: 1 }}
                source={{ uri: 'https://hub.concrete.hk' }} />
        </View>
    )
}