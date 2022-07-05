
import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, StatusBar, Platform } from 'react-native';
// Styles & themes
import globalStyles from '../../res/globalStyles';
import { images } from '../../res/images';
import { colors } from '../../res/colors';
import { styles } from './style';
// third party library
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { getStatusBarHeight, ifIphoneX } from 'react-native-iphone-x-helper';
import { useSelector, useDispatch } from 'react-redux';

export const AppHeader = (props) => {
    const appReducer = useSelector(state => state.appReducer)

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    return (
        <>
            {props.is_dark ? <StatusBar backgroundColor={colors.BLACK} barStyle={"light-content"} /> : <StatusBar backgroundColor={props.is_white ? props.is_doggler_blue ? colors.BLACK : colors.WHITE : colors.REGUAL_BLUE} barStyle={props.is_white ? "dark-content" : "light-content"} />}
            <View style={{
                ...ifIphoneX({
                    paddingTop: props.is_dark || props.is_modal ? 20 : getStatusBarHeight() + 15
                }, {
                    paddingTop: Platform.OS == "ios" ? getStatusBarHeight() + 10 : 16 // for android 
                }),
                backgroundColor: props.is_white ? colors.WHITE : colors.REGUAL_BLUE
            }}>
                <View style={{ ...globalStyles.headerSubContainer, paddingBottom: wp(3), width: wp(95) }}>
                    {props.isShow &&
                        <TouchableOpacity style={styles.back_wrapper} onPress={() => props.onBackPress()}>
                            <Image resizeMode={'contain'} source={images.prev_ic} style={{ ...styles.backIcon, tintColor: props.is_doggler_blue ? colors.DODGER_BLUE_1 : props.is_white ? colors.BLACK : colors.WHITE }} />
                            <Text style={{ ...styles.txt_back, color: props.is_doggler_blue ? colors.DODGER_BLUE_1 : props.is_white ? colors.BLACK : colors.WHITE }}>{props.back_title || getLanguageValue('ACM_BACK')}</Text>
                        </TouchableOpacity>
                    }
                    {!props.hide_title ?
                        <Text style={{ ...styles.txt_sm, color: props.is_white ? colors.BLACK : colors.WHITE }}>{props.hide_title ? '' : props._title}</Text>
                        :
                        <Text style={styles.txt_sm}>{''}</Text>
                    }

                    {props.is_right_include &&
                        <TouchableOpacity style={{ ...styles.back_wrapper, right: wp(1) }} onPress={() => props.onBackPress()}>
                            <Text style={{ ...styles.txt_back, color: props.is_doggler_blue ? colors.DODGER_BLUE_1 : props.is_white ? colors.BLACK : colors.WHITE }}>{getLanguageValue('ACM_CANCEL')}</Text>
                        </TouchableOpacity>
                    }

                    {props.is_ic_right &&
                        <TouchableOpacity style={{ ...styles.back_wrapper, right: wp(1.5) }} onPress={() => props.onBackPress()}>
                            <Image resizeMode={'contain'} source={images.close_white} style={{ ...styles.backIcon }} />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </>
    )
}