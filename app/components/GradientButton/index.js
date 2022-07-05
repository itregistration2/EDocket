import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

// Third party lib
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Styles
import { colors } from '../../res/colors';
import { images } from '../../res/images';
import { styles } from './style';


export const GradientButton = ({ buttonText, is_ic_pass = false, ic_pass, buttonPress, buttonstyle, is_blue, txtStyle, is_icon, is_light_blue, is_border_more = false }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => buttonPress()}
            style={[styles.buttonContainer, buttonstyle]}
        >
            <LinearGradient
                start={{ x: 0, y: 1 }}
                end={{ x: 0.5, y: 0 }}
                colors={is_light_blue ? [colors.DODGER_BLUE, colors.DODGER_BLUE] : is_blue ? [colors.DODGER_BLUE, colors.DODGER_BLUE] : [colors.PIZZAS, colors.PIZZAS]}
                style={{ ...styles.gradientMain, borderWidth: 0, borderRadius: wp(is_border_more ? 4 : is_blue ? 3 : 1) }}>

                {is_icon ?
                    <View style={styles.f_row}>
                        <Image source={is_ic_pass ? ic_pass : images.phone_ic} style={styles.ic_image} />
                        <Text style={[styles.insideText, { color: colors.WHITE, padding: wp(0.5) }, txtStyle]}> {buttonText} </Text>
                    </View>
                    :
                    <Text style={[styles.insideText, { color: colors.WHITE, padding: wp(0.5) }, txtStyle]}> {buttonText} </Text>
                }
            </LinearGradient>
        </TouchableOpacity >
    )
}

// export const GradientButton = ({ buttonText, buttonPress, buttonstyle, is_blue, txtStyle, is_icon }) => {
//     return (
//         <TouchableOpacity
//             activeOpacity={0.7}
//             onPress={() => buttonPress()}
//             style={[styles.buttonContainer, buttonstyle]}
//         >
//             <LinearGradient
//                 start={{ x: 0, y: 1 }}
//                 end={{ x: 0.5, y: 0 }}
//                 colors={is_blue ? [colors.DODGER_BLUE, colors.DODGER_BLUE] : [colors.PIZZAS, colors.PIZZAS]}
//                 style={{ ...styles.gradientMain, borderWidth: 0, borderRadius: wp(is_blue ? 3 : 1) }}>

//                 {is_icon ?
//                     <View style={styles.f_row}>
//                         <Image source={images.phone_ic} style={styles.ic_image} />
//                         <Text style={[styles.insideText, { color: colors.WHITE, padding: wp(0.5) }, txtStyle]}> {buttonText} </Text>
//                     </View>
//                     :
//                     <Text style={[styles.insideText, { color: colors.WHITE, padding: wp(0.5) }, txtStyle]}> {buttonText} </Text>
//                 }
//             </LinearGradient>
//         </TouchableOpacity >
//     )
// }