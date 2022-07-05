import 'react-native-gesture-handler';
import * as React from 'react';
import { StyleSheet, Platform, Image, Text, View, ColorPropType, TouchableOpacity, Linking } from 'react-native';
//Third Party libraries
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { isIphoneX } from 'react-native-iphone-x-helper';
//Auth Container
import LoginContainer from '../conatiners/Auth/LoginContainer';
import LoginOtpContainer from '../conatiners/Auth/LoginOtpContainer';
import SplashContainer from '../conatiners/Auth/SplashContainer';
import OtpContainer from '../conatiners/Auth/OtpVerificationContainer';
//App Container
import Deliveries from '../conatiners/App/DeliveriesContainer';
import Settings from '../conatiners/App/DeliveriesContainer/SettingsContainer';
import LanguageContainer from '../conatiners/App/DeliveriesContainer/LanguageContainer';
import WebViewContainer from '../conatiners/App/WebViewContainer';
import QrCodeContainer from '../conatiners/App/QrCodeContainer';
import HistoryContainer from '../conatiners/App/HistoryContainer';
import ScanDetailContainer from '../conatiners/App/DeliveriesContainer/ScanDetailContainer';
import DetailsContainer from '../conatiners/App/DeliveriesContainer/DetailsContainer';
import TimestampContainer from '../conatiners/App/DeliveriesContainer/TimestampContainer';
import ImagePreviewContainer from '../conatiners/App/DeliveriesContainer/ImagePreviewContainer';
import GlobalSearch from '../conatiners/App/DeliveriesContainer/GlobalSearch';
//Themes & custom components
import { Network } from '../NetworkProvider';
import { Loader } from '../Loader';
import { images } from '../res/images';
import { colors } from '../res/colors';
//redux configuration
import { useSelector, useDispatch } from 'react-redux';
import { Provider } from 'react-redux';
import configureStore from "../redux/store/store";
import { fonts } from '../res/fonts';
import { AppLodar } from '../components/AppLoader';
import ImageIntroductions from '../conatiners/App/DeliveriesContainer/ImageIntroductions';
import { DELEIVERY_TAB, HISTORY_TAB, SCAN_ACTION, StorageKey } from '../utils/Constants';
import { getData } from '../utils/AsyncStorageHelper';
// constants
const Stack = Platform.OS == "ios" ? createStackNavigator() : createNativeStackNavigator();
const store = configureStore();
const Tab = createBottomTabNavigator();

const options = {
    headerShown: false,
    animation: "slide_from_right",
    gestureEnabled: Platform.OS == "android" ? false : true,
    ...TransitionPresets.SlideFromRightIOS,

};

export default function AppNavigator() {
    return (
        <Provider store={store}>
            {/* check for the network issue globally */}
            <Network />
            <AppLodar />
            <NavigationContainer>
                <Stack.Navigator initialRouteName={'Splash'} >
                    <Stack.Screen name={'Splash'} component={SplashContainer} options={options}></Stack.Screen>
                    <Stack.Screen name={'Auth'} component={AuthtackNavigator} options={options}></Stack.Screen>
                    <Stack.Screen name={'Tab'} component={TabNavigator} options={options}></Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
            <Loader />
        </Provider>
    );
}

const AuthtackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'Login'}>
            {/* without otp uncomment below */}
            {/* <Stack.Screen name={'Login'} component={LoginContainer} options={options}></Stack.Screen> */}
            {/* with otp uncomment below */}
            <Stack.Screen name={'Login'} component={LoginOtpContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'Otp'} component={OtpContainer} options={options}></Stack.Screen>
        </Stack.Navigator>
    )
}

const DeliveryStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName={'Deliveries'} >
            <Stack.Screen name={'Deliveries'} component={Deliveries} options={options}></Stack.Screen>
            <Stack.Screen name={'DeliveryDetails'} component={DetailsContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'ScanDetails'} component={ScanDetailContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'Settings'} component={Settings} options={options}></Stack.Screen>
            <Stack.Screen name={'Language'} component={LanguageContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'Introductions'} component={ImageIntroductions} options={options}></Stack.Screen>
            <Stack.Screen name={'WebHub'} component={WebViewContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'QrCode'} component={QrCodeContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'TimeStamp'} component={TimestampContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'ImagePreview'} component={ImagePreviewContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'GlobalSearch'} component={GlobalSearch} options={options}></Stack.Screen>
        </Stack.Navigator>
    )
}


const HistoryStackContainer = () => {
    return (
        <Stack.Navigator initialRouteName={'History'} >
            <Stack.Screen name={'History'} component={HistoryContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'ScanDetails'} component={ScanDetailContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'Settings'} component={Settings} options={options}></Stack.Screen>
            <Stack.Screen name={'Language'} component={LanguageContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'Introductions'} component={ImageIntroductions} options={options}></Stack.Screen>
            <Stack.Screen name={'TimeStamp'} component={TimestampContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'WebHub'} component={WebViewContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'QrCode'} component={QrCodeContainer} options={options}></Stack.Screen>
            <Stack.Screen name={'ImagePreview'} component={ImagePreviewContainer} options={options}></Stack.Screen>
        </Stack.Navigator>
    )
}

const TabNavigator = () => {
    React.useEffect(() => {
        SplashScreen.hide()
    }, [])

    const appReducer = useSelector(state => state.appReducer)
    const generalReducer = useSelector(state => state.generalReducer)


    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    const check_permission = (number) => {
        if (generalReducer.userDetails != null && generalReducer.userDetails.permissions != undefined) {
            let permissions_array = generalReducer.userDetails.permissions.split(",");
            if (permissions_array.indexOf(number) != -1) {
                return true
            } else {
                return false
            }
        }
        else {
            return true
        }
    }

    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false, }}
            initialRouteName={"Deliveries"}
            tabBarOptions={{
                tabStyle: { backgroundColor: colors.MERCURY, height: isIphoneX() ? wp(22) : wp(16) },
                labelStyle: styles.tab_label,
            }}

            tabBar={(props) => {
                return (
                    <BottomTabBar
                        {...props}
                        style={{
                            paddingBottom: 0,
                            height: isIphoneX() ? wp(22) : wp(16),
                            backgroundColor: colors.MERCURY,
                        }}
                        labelPosition={'below-icon'}
                    />
                );
            }}
        >

            {check_permission(DELEIVERY_TAB) &&
                <Tab.Screen
                    name={getLanguageValue('ACM_DELIVERIES')}
                    component={DeliveryStackNavigator}
                    options={({ route }) => ({
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.tabIcon}>
                                <Image
                                    resizeMode={'contain'}
                                    style={{ ...styles.tabImage, tintColor: focused ? colors.DODGER_BLUE : colors.GRAY_SUIT }}
                                    source={images.box_ut} />
                            </View>
                        ),
                        unmountOnBlur: true,
                        tabBarShowLabel: true,
                        tabBarStyle: { display: getTabBarVisibility(route) ? "flex" : "none" }
                    })}
                />
            }

            {check_permission(HISTORY_TAB) &&
                <Tab.Screen
                    name={getLanguageValue('ACM_HISTORY')}
                    component={HistoryStackContainer}
                    options={({ route }) => ({
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.tabIcon}>
                                <Image
                                    resizeMode={'contain'}
                                    style={{ ...styles.tabImage, tintColor: focused ? colors.DODGER_BLUE : colors.GRAY_SUIT }}
                                    source={images.history_ut} />
                            </View>
                        ),
                        unmountOnBlur: true,
                        tabBarShowLabel: true,
                        tabBarStyle: { display: getTabBarVisibility(route) ? "flex" : "none" }
                    })}
                />
            }

            <Tab.Screen
                name={getLanguageValue('ACM_HUB')}
                component={View}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate("WebHub")
                    },
                })}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabIcon}>
                            <Image
                                resizeMode={'contain'}
                                style={{ ...styles.tabImage }}
                                source={images.hub_ut} />
                        </View>
                    ),
                    tabBarShowLabel: true,
                    tabBarStyle: { display: "none" }
                })}
            />

            {check_permission(SCAN_ACTION) &&
                <Tab.Screen
                    name="scan_btn"
                    component={View}
                    listeners={({ navigation }) => ({
                        tabPress: (e) => {
                            e.preventDefault();
                            navigation.navigate("QrCode")
                        },
                    })}
                    options={({ route }) => ({
                        tabBarLabelStyle: { color: colors.MERCURY },
                        tabBarIcon: ({ focused }) => (
                            <View style={styles.tabIcon}>
                                <Image
                                    resizeMode={'contain'}
                                    style={{ ...styles.tabImage, width: wp(20), height: wp(20), top: Platform.isPad ? -50 : isIphoneX() ? -24 : -20 }}
                                    source={images.scan_btn} />
                            </View>
                        ),
                        tabBarShowLabel: true,
                        tabBarStyle: { display: getTabBarVisibility(route) ? "flex" : "none" }
                    })}
                />
            }
        </Tab.Navigator >
    );
}

// Hide Show Tab bar Visiblity
const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
    const hideOnScreens = ['ImagePreview', 'WebHub', 'QrCode', 'ScanDetails', 'TimeStamp', 'Introductions'];
    if (hideOnScreens.indexOf(routeName) > -1) return false;
    return true;
};

const styles = StyleSheet.create({
    tabImage: {
        width: wp(6),
        height: wp(6),
    },
    tab_style: {
        height: isIphoneX() ? wp(22) : wp(16),
    },
    tab_label: {
        fontSize: wp(2.8),
        fontFamily: fonts.REGULAR,
        marginBottom: isIphoneX() ? 24 : 10,
        marginTop: isIphoneX() ? -10 : -5,
        padding: 0,
    },
    tabIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
})


