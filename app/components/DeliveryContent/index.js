import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
// Styles
import { images } from '../../res/images';
import { colors } from '../../res/colors';
import { styles } from './style';
import { Spacer } from '../../res/spacer';
import { fonts } from '../../res/fonts';
// redux
import { useSelector } from 'react-redux';
export const DeliveryContent = (props) => {

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
            <TouchableOpacity activeOpacity={0.9} onPress={() => { props._onPress() }} style={{ flexDirection: "row", backgroundColor: props.back_ground, paddingTop: 2 }} key={props.index}>
                <View style={{ flexDirection: "row" }}>
                    <View activeOpacity={1} style={{ ...styles.square_wrapper, backgroundColor: props.bcolor }}>
                        <Text style={{ ...styles.lbl_square, color: props.color }}>{props.label}</Text>
                    </View>
                    <View style={styles.inner_wrapper}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ ...styles.txt_fonts, alignSelf: "center", color: props.is_overdue ? colors.DARK_RED : colors.BLACK }}>{getLanguageValue('ACM_FLEET_NO')}</Text>
                            <View style={styles.round_wrapper}>
                                <Text style={{ ...styles.txt_fonts, fontFamily: fonts.REGULAR, alignSelf: "center", color: colors.WHITE }}>{props.fleet_no}</Text>
                            </View>
                        </View>
                        <Spacer space={1} />
                        <Text style={{ ...styles.txt_fonts, color: props.is_overdue ? colors.DARK_RED : colors.BLACK }}>{getLanguageValue('ACM_DOCKET_NO')} {props.docet_no}</Text>
                        <Spacer space={2} />
                        <Text style={{ ...styles.txt_fonts, color: colors.MANATEE, fontFamily: fonts.REGULAR }}>{props.address}</Text>
                    </View>
                </View>
                {props.ScannedBy != null && <Image source={images.link_scanned} style={styles.ic_link} />}
                <Image source={images.right_arrow} style={styles.ic_right} />
            </TouchableOpacity>
        </>
    )
}