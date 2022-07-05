
import React, { useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, Text, Animated, Platform } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
// styles & themes
import { styles } from './style';
import { images } from '../../res/images';

export const Input = ({ hide_icon = false, value, multiline = false, onChange, headerText, secureTextEntry, keyboardType, returnKeyType, onHideShow, passwordInput = false }) => {
    const moveText = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (value !== "") {
            moveTextTop();
        } else if (value === "") {
            moveTextBottom();
        }
    }, [value])

    const onFocusHandler = () => {
        if (value !== "") {
            moveTextTop();
        }
    };

    const onBlurHandler = () => {
        if (value === "") {
            moveTextBottom();
        }
    };

    const moveTextTop = () => {
        Animated.timing(moveText, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const moveTextBottom = () => {
        Animated.timing(moveText, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const yVal = moveText.interpolate({
        inputRange: [0, Platform.isPad ? 2 : 1],
        outputRange: [Platform.isPad ? 24 : 10, 2],
    });

    const animStyle = {
        transform: [
            {
                translateY: yVal,
            },
        ],
    };


    return (
        <View style={styles.viewContainer}>
            <Animated.View style={[styles.animatedStyle, animStyle]}>
                <Text style={{ ...styles.headertxt, fontSize: value != '' ? wp(2.8) : wp(4.2), }}>{headerText}</Text>
            </Animated.View>
            {!passwordInput ?
                <TextInput
                    value={value}
                    autoCompleteType='off'
                    autoCapitalize='none'
                    onChangeText={(value) => onChange(value)}
                    style={{ ...styles.textInput, paddingBottom: value != '' ? wp(1.5) : wp(2.5), paddingTop: value != '' ? wp(3.5) : wp(2.5) }}
                    keyboardType={keyboardType ? keyboardType : "default"}
                    returnKeyType={returnKeyType ? returnKeyType : "default"}
                    multiline={multiline}
                    numberOfLines={multiline ? 4 : 1}
                    onFocus={onFocusHandler}
                    onBlur={onBlurHandler}
                    blurOnSubmit
                    maxLength={30}
                />
                :
                <View style={[styles.inputView, { flexDirection: 'row' }]}>
                    <TextInput
                        value={value}
                        autoCompleteType='off'
                        style={{ ...styles.insideText, paddingBottom: value != '' ? wp(1.5) : wp(2.5), paddingTop: value != '' ? wp(3.5) : wp(2.5) }}
                        keyboardType={keyboardType ? keyboardType : "default"}
                        returnKeyType={returnKeyType ? returnKeyType : "default"}
                        onChangeText={(value) => onChange(value)}
                        secureTextEntry={secureTextEntry}
                        onFocus={onFocusHandler}
                        onBlur={onBlurHandler}
                        blurOnSubmit
                        maxLength={50}
                    />
                    {
                        hide_icon == false &&
                        <TouchableOpacity style={styles.eyeWrapper} onPress={() => onHideShow()}>
                            <Image
                                source={secureTextEntry ? images.hide_icon : images.show_icon}
                                resizeMode={'contain'}
                                style={styles.eye}
                            />
                        </TouchableOpacity>
                    }
                </View>
            }
        </View >
    )
}