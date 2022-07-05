import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
// styles and themes
import { Spacer } from '../../../../res/spacer';
import globalStyles from '../../../../res/globalStyles';
import { fonts } from '../../../../res/fonts';
import { colors } from '../../../../res/colors';
import { AppHeader } from '../../../../components/AppHeader';
import BaseClass from '../../../../utils/BaseClass';
import { GradientButton } from '../../../../components/GradientButton';
import { Input_Line } from '../../../../components/input_line';
import { styles } from './style';

// Third party libraries
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import Modal from "react-native-modal";
import { isIphoneX } from 'react-native-iphone-x-helper';
import { showAlertWithMessageClick } from '../../../../utils/Constants';
import { useSelector, useDispatch } from 'react-redux';
import { onGetThisDockets, onPostDocketFileUpdate, onGetDockets, onGetShipToDockets, onGetTestRange } from '../../../../redux/actions/AppAction';
import { CommonActions } from '@react-navigation/native';

let slump_range;
let flow_range;
let tc_range;

export default RejectContainer = (props) => {

    const [reject_qty, setReject_qty] = useState('')
    const [flow, setFlow] = useState('')
    const [slump, setSlump] = useState('')
    const [tc, setTC] = useState('')
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

    useEffect(() => {
        dispatch(onGetTestRange('flow', (data) => { flow_range = data }))
        dispatch(onGetTestRange('slump', (data) => { slump_range = data }))
        dispatch(onGetTestRange('tc', (data) => { tc_range = data }))
        const unsubscribe = props.navigation.addListener('focus', () => {
            onClear()
        });
        return unsubscribe;
    }, [props.navigation])


    const onClear = () => {
        setFlow('')
        setReject_qty('')
        setSlump('')
        setTC('')
    }

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
        if (reject_qty == '') {
            Base.showToastAlert(`${getLanguageValue('ACM_ENTER_QTY')}`);
        } else if (flow != '' || slump != '' || tc != '') {
            if (reject_qty > parseFloat(props.item.DLVQTY)) {
                showAlertWithMessageClick(getLanguageValue('ACM_QUANTITY_INVALID'), getLanguageValue('ACM_REJECT_QTY_NOT_GREATER_THAN_THIS_LOAD'), getLanguageValue("ACM_OK"))
            } else if (validNumber.test(reject_qty) == false) {
                showAlertWithMessageClick(getLanguageValue('ACM_INPUT_INVALID'), getLanguageValue('ACM_QTY_INPUT_NUMERICAL_ONLY'), getLanguageValue("ACM_OK"))
            } else if (reject_qty < 0 || flow < 0 || slump < 0 || tc < 0) {
                showAlertWithMessageClick(`${getLanguageValue('ACM_INPUT_INVALID')}`, getLanguageValue('ACM_NON_NEGATIVE_NUMBER_REQUIRED'), getLanguageValue("ACM_OK"))
            } else if (flow != '' && (flow < flow_range.MIN || flow > flow_range.MAX)) {
                showAlertWithMessageClick(getLanguageValue('ACM_INVALID_FLOW'), getLanguageValue('ACM_INPUT_FLOW_LIMITATION').replace('{0}', flow_range.MIN).replace('{1}', flow_range.MAX), getLanguageValue("ACM_OK"))
            } else if (slump != '' && (slump < slump_range.MIN || slump > slump_range.MAX)) {
                showAlertWithMessageClick(getLanguageValue("ACM_INVALID_SLUMP"), getLanguageValue("ACM_INPUT_SLUMP_LIMITATION").replace('{0}', slump_range.MIN).replace('{1}', slump_range.MAX), getLanguageValue("ACM_OK"))
            } else if (tc != '' && (tc < tc_range.MIN || tc > tc_range.MAX)) {
                showAlertWithMessageClick(getLanguageValue("ACM_INVALID_TC"), getLanguageValue("ACM_INPUT_TC_LIMITATION").replace('{0}', tc_range.MIN).replace('{1}', tc_range.MAX), getLanguageValue("ACM_OK"))
            } else if ((flow != '' && validNumber.test(flow) == false) || (slump != '' && validNumber.test(slump) == false) || (tc != '' && validNumber.test(tc) == false)) {
                showAlertWithMessageClick(getLanguageValue('ACM_INPUT_INVALID'), getLanguageValue('ACM_TEST_VALUES_INPUT_NUMERICAL_ONLY'), getLanguageValue("ACM_OK"))
            } else {
                Alert.alert(
                    `${getLanguageValue("ACM_REJECT_DELIVERY_2")}`,
                    `${getLanguageValue("ACM_REJECT_DELIVERY_MSG")}`,
                    [
                        {
                            text: `${getLanguageValue("ACM_CONFIRM")}`,
                            onPress: () => { onRejectDelievery() }
                        },
                        {
                            text: `${getLanguageValue("ACM_BACK")}`,
                            onPress: () => { onClear(), props.onModalFalse() }
                        },

                    ],
                    { cancelable: false }
                )
            }
        } else {
            Base.showToastAlert(getLanguageValue("ACM_ENTER_LEAST_ONE_TEST_VALUE"));
        }
    }

    const onRejectDelievery = () => {
        let s_requestBody = JSON.stringify({
            "RejectedBy": generalReducer.userDetails.username,
            "RejectedTime": moment().toISOString(),
            "RejectQty": reject_qty,
            "RejectFlow": flow,
            "RejectSlump": slump,
            "RejectTC": tc,
            "STATUS": "rejected"
        })
        dispatch(onPostDocketFileUpdate({
            "user": generalReducer.userDetails.username,
            "docketno": props.item.DOCKETID,
            "action": "reject",
            "online": "online",
            "phone": generalReducer.userDetails.Phone,
        }, s_requestBody, (data) => {
            if (data) {
                props.onModalFalse()
                dispatch(onGetDockets(generalReducer.userDetails, false))
                dispatch(onGetShipToDockets(generalReducer.userDetails, false))
                setTimeout(() => {
                    dispatch(onGetThisDockets({ "docketno": props.item.DOCKETID }, (data) => {
                        Promise.all([props.navigation.dispatch(CommonActions.reset({
                            index: 0,
                            routes: [{ name: props.is_home ? 'Deliveries' : 'History' }],
                        }))]).then(() =>
                            setTimeout(() => {
                                props.navigation.navigate('ScanDetails', { "status": data.STATUS, "item": data, is_home: props.is_home, is_update: true })
                            }, 250)
                        )
                    }))
                }, 250);
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
                        hide_title={false} _title={getLanguageValue('ACM_REJECT_DELIVERY')} />
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
                                    value={reject_qty}
                                    returnKeyType={"done"}
                                    onChange={(val) => { setReject_qty(val) }}
                                    headerline={getLanguageValue('ACM_REJECT_QTY')}
                                    keyboardType={'decimal-pad'}
                                    txtstyle={{ width: wp(90) }}
                                    placeholder={getLanguageValue('ACM_REJECT_HINTS')}
                                />
                                <Text style={styles.txt_ms}>m³</Text>
                            </View>
                            <Spacer space={hp(1.2)} />
                            <View style={{ ...styles.divider }} />
                            <View style={styles.wrapper} onPress={() => { setOpen(true), setSelectType(2) }}>
                                <Text style={{ ...styles.txt_fonts, fontFamily: fonts.BOLD, fontSize: wp(4.5) }}>{getLanguageValue('ACM_PROVIDE_FAIL_TEST_VALUES')}</Text>
                            </View>
                            <View style={{ ...styles.divider }} />
                            <Input_Line
                                value={flow}
                                onChange={(val) => { setFlow(val) }}
                                headerline={getLanguageValue('ACM_FLOW')}
                                returnKeyType={"done"}
                                keyboardType={'decimal-pad'}
                                placeholder={getLanguageValue('ACM_FLOW_HINTS')}
                            />
                            <View style={{ ...styles.divider }} />
                            <Input_Line
                                value={slump}
                                onChange={(val) => { setSlump(val) }}
                                headerline={getLanguageValue('ACM_SLUMP')}
                                returnKeyType={"done"}
                                keyboardType={'decimal-pad'}
                                placeholder={getLanguageValue('ACM_SLUMP_HINTS')}
                            />
                            <View style={{ ...styles.divider }} />
                            <Input_Line
                                value={tc}
                                onChange={(val) => { setTC(val) }}
                                headerline={getLanguageValue('ACM_TC_2')}
                                keyboardType={'decimal-pad'}
                                returnKeyType={"done"}
                                placeholder={getLanguageValue('ACM_TC_HINTS')}
                            />

                            <View style={{ ...styles.divider }} />
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