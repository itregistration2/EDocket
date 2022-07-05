
import React, { useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, Text } from 'react-native';
// styles & themes
import { styles } from './style';
import { images } from '../../res/images';
import { fonts } from '../../res/fonts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const Input_Line = (props) => {
    return (
        <View style={styles.viewContainer}>
            <Text style={{ ...styles.headertxt }}>{props.headerline}</Text>
            <TextInput
                value={props.value}
                autoCompleteType='off'
                placeholder={props.placeholder}
                onChangeText={(value) => props.onChange(value)}
                style={{ ...styles.textInput, ...props.txtstyle }}
                keyboardType={props.keyboardType ? props.keyboardType : "default"}
                returnKeyType={props.returnKeyType ? props.returnKeyType : "default"}
                blurOnSubmit={props.blurOnSubmit}
                multiline={props.multiline}
                numberOfLines={props.multiline ? 6 : 1}
                maxLength={props.maxLength}
                placeholderTextColor={'rgba(60, 60, 67, 0.33)'}
                editable={props.editable == false ? false : true}
            />
            {props.is_add_slump &&
                <TouchableOpacity onPress={() => props.onAddSlump()} style={styles.position_top_ic}>
                    <Image source={images.add_slump} style={styles.operation_ic} />
                </TouchableOpacity>
            }
            {props.is_remove_slump &&
                <TouchableOpacity onPress={() => props.onRemoveSlump()} style={styles.position_top_ic}>
                    <Image source={images.rm_slump} style={styles.operation_ic} />
                </TouchableOpacity>
            }
            {
                props.is_right_text &&
                <TouchableOpacity style={{ ...styles.position_top_ic, right: wp(2) }}>
                    <Text style={{ ...styles.headertxt, fontFamily: fonts.REGULAR, color: 'rgba(60, 60, 67, 0.33)' }}>{props.right_text}</Text>
                </TouchableOpacity>
            }
        </View>
    )
}