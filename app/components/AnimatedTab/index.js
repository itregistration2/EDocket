import React, { Component } from "react";
import { View, Animated, Text, TouchableOpacity } from "react-native";
import { colors } from "../../res/colors";
import { styles } from "./style";

// Third party lib
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export const AnimatedTab = ({ tabMoveAnimation, onChange, type, tab1text, tab2text, disable }) => {
    return (
        <View style={styles.viewWrapper}>
            <Animated.View style={[styles.animatedView, tabMoveAnimation.getLayout()]} >
                <LinearGradient
                    start={{ x: 0, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    colors={[colors.WHITE, colors.WHITE]}
                    style={[styles.gradientMain]} />
            </Animated.View>
            <TouchableOpacity style={styles.tabWrapper} onPress={() => onChange(1, 0)}>
                <Text style={[styles.tabText, { color: colors.BLACK }]}>{tab1text}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabWrapper} onPress={() => onChange(2, wp(44.4))}>
                <Text style={[styles.tabText, { color: colors.BLACK }]}>{tab2text}</Text>
            </TouchableOpacity>
        </View>
    )
}