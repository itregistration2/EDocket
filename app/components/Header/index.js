import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, Image, StatusBar, TextInput } from 'react-native';
// styles & themes
import globalStyles from '../../res/globalStyles';
import { images } from '../../res/images';
import { colors } from '../../res/colors';
import { styles } from './style';
import { Spacer } from '../../res/spacer';
// third party libraries
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useSelector, useDispatch } from 'react-redux';
import { DELEIVERY_TAB, SEARCH_FUNCTIONS } from '../../utils/Constants';


export const Header = (props) => {
    const inputRef = useRef(null);
    const generalReducer = useSelector(state => state.generalReducer)

    const check_permission = (number) => {
        if (generalReducer.userDetails != null) {
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
        <>
            <StatusBar backgroundColor={colors.REGUAL_BLUE} barStyle="light-content" translucent={false} />
            <View style={globalStyles.header}>
                <View style={globalStyles.headerSubContainer}>
                    <View style={{ flex: 1 }}>
                        {props.is_shrink ?
                            <Text style={{ ...styles.headerText, alignSelf: "center", fontSize: wp(4.5) }}>{props.headerText}</Text>
                            :
                            <>
                                <Spacer space={5} />
                                <Text style={[styles.topheaderText]}>{props.sub_headerText}</Text>
                                <View style={styles.flexing_row}>
                                    <Text style={[styles.headerText]}>{props.headerText}</Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <TouchableOpacity onPress={() => { props.onRefresh() }}>
                                            <Image source={images.arrow_clockwise} style={{ ...styles.img_ic, marginRight: wp(4), width: wp(5), height: wp(5), resizeMode: "contain" }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { props.onSetting() }}>
                                            <Image source={images.setting_line} style={styles.img_ic} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Spacer space={3} />
                            </>
                        }

                        {(check_permission(DELEIVERY_TAB) && check_permission(SEARCH_FUNCTIONS)) &&
                            <>
                                {props.is_global_search ?
                                    <TouchableOpacity style={styles.input_wrapper} activeOpacity={0.7} onPress={() => { props.onGlobalSearch() }} >
                                        <Image source={images.search} style={styles.img_ic} />
                                        <Text style={{
                                            width: wp(80),
                                            color: colors.WHITE,
                                            fontSize: wp(3.6),
                                            paddingLeft: wp(2),
                                            alignSelf: "center"
                                        }}>{props.placerholder_text}</Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={{ ...styles.input_wrapper, alignContent: "center" }}>
                                        <Image source={images.search} style={styles.img_ic} />
                                        <View>
                                            <TextInput
                                                ref={inputRef}
                                                returnKeyType={"go"}
                                                autoFocus={true}
                                                placeholder={props.placerholder_text}
                                                placeholderTextColor={colors.SUB_HEADER}
                                                value={props.search_value}
                                                onChangeText={(value) => props.onChange(value)}
                                                style={{ ...styles.txt_input }}
                                                onSubmitEditing={() => { props.onSubmitEditing() }}
                                            />
                                            {
                                                props.search_value.length > 0 &&
                                                <TouchableOpacity style={styles.close_container} onPress={() => { inputRef.current.clear(), props.onSearchClear() }}>
                                                    <Image source={images.round_close} style={styles.close_ic} />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                    </View>
                                }
                            </>
                        }
                    </View>
                </View>
            </View >
        </>
    )
}