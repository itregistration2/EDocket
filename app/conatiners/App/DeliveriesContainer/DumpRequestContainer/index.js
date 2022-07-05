import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, Keyboard } from 'react-native';
// styles and themes
import { Spacer } from '../../../../res/spacer';
import globalStyles from '../../../../res/globalStyles';
import { colors } from '../../../../res/colors';
import { AppHeader } from '../../../../components/AppHeader';
import { styles } from './style';
import BaseClass from '../../../../utils/BaseClass';
import { GradientButton } from '../../../../components/GradientButton';
import { Input_Line } from '../../../../components/input_line';
// Third party libraries
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import Modal from "react-native-modal";
import { isIphoneX } from 'react-native-iphone-x-helper';
import { useSelector, useDispatch } from 'react-redux';
import { onGetThisDockets, onPostDocketFileUpdate } from '../../../../redux/actions/AppAction';
import { CommonActions } from '@react-navigation/native';
import { showAlertWithMessageClick } from '../../../../utils/Constants';

export default DumpRequestContainer = (props) => {

    const [qty, setQty] = useState('')
    const [reason, setReason] = useState('')
    const dispatch = useDispatch();
    const generalReducer = useSelector(state => state.generalReducer)
    const appReducer = useSelector(state => state.appReducer)
    const Base = new BaseClass();

    useEffect(() => {
        if (props.isModalVisible) {
            Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustPan();
        } else {
            Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustResize();
        }
    }, [props.isModalVisible]);

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    const onSubmit = () => {
        Keyboard.dismiss()
        var validNumber = new RegExp(/^\d*\.?\d*$/);
        if (qty == '') {
            Base.showToastAlert(getLanguageValue("ACM_ENTER_DUMP_QTY"));
        } else if (validNumber.test(qty) == false) {
            showAlertWithMessageClick(getLanguageValue('ACM_INPUT_INVALID'), getLanguageValue('ACM_QTY_INPUT_NUMERICAL_ONLY'), getLanguageValue("ACM_OK"))
        } else if (reason == '') {
            Base.showToastAlert(getLanguageValue("ACM_ENTER_DUMP_REASON"));
        } else if (qty > parseFloat(props.item.DLVQTY)) {
            showAlertWithMessageClick(getLanguageValue('ACM_QUANTITY_INVALID'), getLanguageValue("ACM_DUMP_QTY_NOT_GREATER_THAN_THIS_LOAD"), getLanguageValue("ACM_OK"))
        } else {
            Alert.alert(
                `${getLanguageValue('ACM_REQUEST_DUMP_RETURN')}`,
                `${getLanguageValue('ACM_DUMP_CONFIRMED_MSG')}`,
                [
                    {
                        text: `${getLanguageValue('ACM_CONFIRM')}`,
                        onPress: () => {
                            Alert.alert(
                                `${getLanguageValue('ACM_DUMP_CONFIRMATION')}`,
                                `${getLanguageValue('ACM_DUMP_CONFIRMATION_MSG')}`,
                                [
                                    {
                                        text: `${getLanguageValue("ACM_OK")}`,
                                        onPress: () => { ondumpReqest() },
                                    },
                                ],
                            )
                        },
                    },
                    {
                        text: `${getLanguageValue('ACM_BACK')}`,
                        onPress: () => { console.log('just back') },
                    },
                ],
                { cancelable: false }
            )
        }
    }


    const ondumpReqest = () => {
        let s_requestBody = JSON.stringify({
            "DumpedBy": generalReducer.userDetails.username,
            "DumpedTime": moment().toISOString(),
            "DumpQty": qty,
            "DumpReason": reason,
            "STATUS": "dump"
        })
        dispatch(onPostDocketFileUpdate({
            "user": generalReducer.userDetails.username,
            "docketno": props.item.DOCKETID,
            "action": "dump",
            "online": "online",
            "phone": generalReducer.userDetails.Phone,
        }, s_requestBody, (data) => {
            if (data) {
                props.onModalFalse()
                setTimeout(() => {
                    dispatch(onGetThisDockets({ "docketno": props.item.DOCKETID }, (data) => {
                        Promise.all([props.navigation.dispatch(CommonActions.reset({
                            index: 0,
                            routes: [{ name: props.is_home ? 'Deliveries' : 'History' }],
                        }))]).then(() =>
                            setTimeout(() => {
                                props.navigation.navigate('ScanDetails', { "status": data.STATUS, "item": data, is_home: props.is_home, is_update: true })
                            }, 200)
                        )
                    }))
                }, 150);
            }
        }))
    }

    return (
        <>
            <Modal style={styles.modal_container}
                isVisible={props.isModalVisible}
                backdropOpacity={0.7}
                onBackButtonPress={() => { props.onModalFalse() }}
            >
                <View style={{ ...globalStyles.flex }}>
                    <AppHeader
                        isShow
                        is_white
                        is_doggler_blue
                        is_right_include
                        is_modal
                        onBackPress={() => { props.onModalFalse() }}
                        hide_title={false} _title={`${getLanguageValue('ACM_SUBMIT_DUMP_REQUEST')}`} />
                    <Spacer space={hp(0.2)} />
                    <View style={{ ...styles.divider, backgroundColor: colors.DARK_BORDER_MODEL }} />
                    <View style={{ ...globalStyles.subContainer, width: wp(100), backgroundColor: colors.BG_COMMON }}>
                        <ScrollView
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            keyboardDismissMode={'interactive'}
                            keyboardShouldPersistTaps={'handled'}
                        >
                            <View style={{ flexDirection: "row", backgroundColor: colors.WHITE }}>
                                <Input_Line
                                    value={qty}
                                    onChange={(val) => { setQty(val) }}
                                    headerline={`${getLanguageValue('ACM_DUMP_QTY')}`}
                                    returnKeyType={"done"}
                                    keyboardType={'decimal-pad'}
                                    placeholder={getLanguageValue('ACM_DUMP_QTY_HINTS')}
                                    txtstyle={{ width: wp(90) }}
                                />
                                <Text style={styles.txt_ms}>{getLanguageValue('ACM_M3')}</Text>
                            </View>
                            <View style={{ ...styles.divider }} />
                            <Input_Line
                                multiline
                                maxLength={50}
                                value={reason}
                                onChange={(val) => { setReason(val) }}
                                txtstyle={{ textAlignVertical: "top", height: hp(20) }}
                                headerline={getLanguageValue('ACM_PROVIDE_DUMP_REASON')}
                                placeholder={getLanguageValue('ACM_PROVIDE_DUMP_REASON_HINTS')}
                            />
                            <View style={{ ...styles.divider }} />
                            <Spacer space={hp(0.5)} />
                            <Text style={styles.txt_gray}>{getLanguageValue('ACM_SURCHARGE_INVOLVED')}</Text>
                            <Spacer space={hp(1.2)} />
                        </ScrollView>
                        <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={160} />
                        {Platform.OS == "ios" &&
                            <View style={{ paddingBottom: hp(isIphoneX() ? 15 : 10) }}>
                                <GradientButton
                                    is_blue={true}
                                    buttonText={getLanguageValue('ACM_SUBMIT')}
                                    buttonPress={() => { onSubmit() }}
                                />
                            </View>
                        }
                    </View>
                </View>
                {Platform.OS == "android" &&
                    <View style={{ paddingBottom: hp(10), backgroundColor: colors.BG_COMMON }} >
                        <GradientButton
                            is_blue={true}
                            buttonText={getLanguageValue('ACM_SUBMIT')}
                            buttonPress={() => { onSubmit() }}
                        />
                    </View>
                }
            </Modal>

        </>
    )
}