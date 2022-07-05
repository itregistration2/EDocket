import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, StatusBar, Alert, AppState } from 'react-native';
// Third party libraries
import { check, PERMISSIONS, request } from 'react-native-permissions';
import Permissions from 'react-native-permissions';
import moment from 'moment';
import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
// styles & themes
import { useSelector, useDispatch } from 'react-redux';
import { fonts } from '../../../res/fonts';
import globalStyles from '../../../res/globalStyles';
import { colors } from '../../../res/colors';
import { images } from '../../../res/images';
import { onPostDocketFileUpdate, onGetThisDocketsQrCode, onGetDockets } from '../../../redux/actions/AppAction';
Icon.loadFont();

export default QrCodeContainer = (props) => {

    const dispatch = useDispatch();
    const qrCodeRef = useRef(null);
    const appReducer = useSelector(state => state.appReducer)
    const generalReducer = useSelector(state => state.generalReducer)
    const [viewFocused, setViewFocused] = useState(false);

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    const openSettings = () => {
        Alert.alert(
            "Edocket",
            `${getLanguageValue('ACM_CAMERA_PERMISSION')}`,
            [
                {
                    text: `${getLanguageValue("ACM_OK")}`,
                    onPress: () => { Permissions.openSettings() },
                },
            ],
            {
                cancelable: false,
            }
        )
    }

    useEffect(() => {
        const listener = AppState.addEventListener('change', (status) => {
            if (Platform.OS === 'ios' && status === 'active') {
                check(PERMISSIONS.IOS.CAMERA).then(response => {
                    //    console.log(response);
                    if (response === "granted") {
                        setViewFocused(true);
                    }
                    else {
                        openSettings()
                    }
                });
            }
        });

        return listener.remove;
    }, []);

    const onSuccess = e => {
        try {
            let e_data = JSON.parse(e.data)
            setTimeout(() => {
                // let _isFound = appReducer.get_Dockets && appReducer.get_Dockets.filter((e) => { return e.DOCKETID == e_data.DOCKETID });
                let project_array = generalReducer.userDetails && generalReducer.userDetails.projects.split(",");
                let _is_avilable_project = project_array.includes(e_data.JobCode)
                if (e_data && e_data.DOCKETID) {
                    //_isFound.length > 0 && 
                    if (_is_avilable_project) {
                        setViewFocused(false)
                        let s_requestBody = JSON.stringify({
                            "ScannedBy": generalReducer.userDetails.username,
                            "ScannedTime": moment().toISOString(),
                        })
                        dispatch(onPostDocketFileUpdate({
                            "user": generalReducer.userDetails.username,
                            "docketno": e_data.DOCKETID,
                            "action": "scan",
                            "online": "online",
                            "phone": generalReducer.userDetails.Phone,
                        }, s_requestBody, (data) => {
                            if (data) {
                                dispatch(onGetDockets(generalReducer.userDetails, false))
                                dispatch(onGetThisDocketsQrCode({ "docketno": e_data.DOCKETID }, (_data) => {
                                    if (_data != null) {
                                        props.navigation.goBack()
                                        props.navigation.navigate("ScanDetails", { "item": _data, "status": _data.STATUS, is_home: true })
                                    } else {
                                        Alert.alert(
                                            `${getLanguageValue('ACM_DELIVERY_NOT_FOUND')}`,
                                            `${getLanguageValue('ACM_DELIVERY_NOT_FOUND_CONTENT').replace('{0}', e_data.DOCKETID)}`,
                                            [{
                                                text: `${getLanguageValue('ACM_TRY_AGAIN')}`,
                                                onPress: () => {
                                                    setTimeout(() => {
                                                        props.navigation.goBack()
                                                    }, 100);
                                                },
                                            }
                                            ],
                                            { cancelable: false },
                                        );
                                    }
                                }))
                            }
                        }))
                    } else {
                        setViewFocused(false)
                        Alert.alert(
                            `${getLanguageValue('ACM_DELIVERY_NOT_FOUND')}`,
                            `${getLanguageValue('ACM_DELIVERY_NOT_FOUND_CONTENT').replace('{0}', e_data.DOCKETID)}`,
                            [{
                                text: `${getLanguageValue('ACM_TRY_AGAIN')}`,
                                onPress: () => {
                                    setTimeout(() => {
                                        props.navigation.goBack()
                                    }, 100);
                                },
                            }
                            ],
                            { cancelable: false },
                        );
                    }
                } else {
                    Alert.alert(
                        "Edocket",
                        `${getLanguageValue('ACM_QR_CODE_RECOGNIZED')}`,
                        [
                            {
                                text: `${getLanguageValue('ACM_TRY_AGAIN')}`,
                                onPress: () => {
                                    setTimeout(() => {
                                        props.navigation.goBack()
                                    }, 100);
                                },
                            }
                        ],
                        { cancelable: false },
                    );
                }

            }, 250);
        } catch (error) {
            Alert.alert(
                "Edocket",
                `${getLanguageValue('ACM_UNABLE_SCAN_DETAIL')}`,
                [
                    {
                        text: `${getLanguageValue('ACM_TRY_AGAIN')}`,
                        onPress: () => {
                            setTimeout(() => {
                                props.navigation.goBack()
                            }, 100);
                        },
                    }
                ],
                { cancelable: false },
            );
            setViewFocused(false)
        }
    };


    useEffect(() => {
        const onFocus = props.navigation.addListener('focus', () => {
            if (Platform.OS === 'ios') {
                request(PERMISSIONS.IOS.CAMERA).then(response => {
                    if (response === "granted") {
                        setViewFocused(true);
                    }
                    else {
                        openSettings()
                    }
                });
            } else {
                setViewFocused(true);
            }
        });

        const onBlur = props.navigation.addListener('blur', () => {
            setViewFocused(false);
        });

        return { onFocus, onBlur };
    }, [props.navigation]);


    const makeSlideOutTranslation = (translationType, fromValue) => {
        return {
            from: {
                [translationType]: wp(100) * 0.10
            },
            to: {
                [translationType]: fromValue
            }
        };
    }

    return (
        <>
            {viewFocused &&
                <QRCodeScanner
                    showMarker
                    ref={qrCodeRef}
                    onRead={onSuccess}
                    cameraStyle={{ height: hp(100) }}
                    customMarker={
                        <View style={styles.rectangleContainer}>
                            <StatusBar backgroundColor={overlayColor} barStyle={"light-content"} />

                            <View style={{ ...globalStyles.header, backgroundColor: overlayColor, zIndex: 1, padding: 16 }}>
                                <View style={{ ...globalStyles.headerSubContainer, width: wp(100) }}>
                                    <TouchableOpacity style={styles.back_wrapper} onPress={() => props.navigation.goBack()}>
                                        <Image resizeMode={'contain'} source={images.prev_ic} style={{ ...styles.backIcon, tintColor: colors.WHITE }} />
                                        <Text style={{ ...styles.txt_back, color: colors.WHITE }}>{getLanguageValue('ACM_BACK')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.topOverlay} />
                            <View style={{ flexDirection: "row" }}>
                                <View style={styles.leftAndRightOverlay} />
                                <View style={styles.rectangle}>
                                    <>
                                        <Image source={images.top_left_curve} style={{ ...styles.position_ic, top: -6, left: -6, }} />
                                        <Image source={images.top_right_curve} style={{ ...styles.position_ic, top: -6, right: -6, }} />
                                        <Image source={images.bottom_left_curve} style={{ ...styles.position_ic, bottom: -6, left: -6, }} />
                                        <Image source={images.bottom_right_curve} style={{ ...styles.position_ic, bottom: -6, right: -6, }} />
                                    </>
                                    <Animatable.View
                                        style={styles.scanBar}
                                        direction="alternate-reverse"
                                        iterationCount="infinite"
                                        duration={1700}
                                        easing="linear"
                                        animation={makeSlideOutTranslation("translateY", wp(100) * 0.60)}
                                    />
                                </View>
                                <View style={styles.leftAndRightOverlay} />
                            </View>

                            <View style={styles.bottomOverlay} >
                                <Text style={styles.txt_bold}>{getLanguageValue('ACM_SCAN')}</Text>
                            </View>
                        </View>
                    }
                />
            }
        </>

    )
}

const overlayColor = "rgba(0,0,0,0.4)"; // this gives us a black color with a 50% transparency

const rectDimensions = wp(100) * 0.70; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = wp(100) * 0.005; // this is equivalent to 2 from a 393 device width

const scanBarWidth = wp(100) * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = wp(90) * 0.0025; //this is equivalent to 1 from a 393 device width


const styles = StyleSheet.create({
    back_wrapper: {
        flexDirection: "row",
        position: "absolute",
        zIndex: 1,
        marginLeft: 6,
    },
    rectangleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: overlayColor
    },
    rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        borderWidth: wp(0.5),
        borderRadius: wp(5),
        borderColor: colors.WHITE,
        alignItems: "center",
        zIndex: 1,
        backgroundColor: overlayColor
    },
    topOverlay: {
        flex: 1,
        height: wp(100),
        width: wp(100),
        backgroundColor: overlayColor,
        // justifyContent: "center",
        alignItems: "center"
    },
    bottomOverlay: {
        flex: 1,
        height: wp(100),
        width: wp(100),
        backgroundColor: overlayColor,
        paddingBottom: wp(100) * 0.25,
        paddingTop: wp(10)
    },
    leftAndRightOverlay: {
        // height: wp(100) * 0.55,
        width: wp(100),
        backgroundColor: overlayColor
    },
    scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        backgroundColor: colors.PIZZAS
    },
    position_ic: {
        width: wp(14),
        height: wp(14),
        position: "absolute",
    },
    txt_bold: {
        fontSize: wp(4),
        fontFamily: fonts.SEMI_BOLD,
        color: colors.WHITE,
        alignSelf: "center"
    },
    backIcon: {
        width: wp(5),
        height: wp(5),
        resizeMode: "contain",
        alignSelf: 'center',
    },
    txt_back: {
        fontSize: wp(4),
        fontFamily: fonts.REGULAR,
        color: colors.WHITE
    },
});