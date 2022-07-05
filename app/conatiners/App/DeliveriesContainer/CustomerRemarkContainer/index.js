import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
// styles and themes
import { Spacer } from '../../../../res/spacer';
import globalStyles from '../../../../res/globalStyles';
import { fonts } from '../../../../res/fonts';
import { colors } from '../../../../res/colors';
import { AppHeader } from '../../../../components/AppHeader';
import { styles } from './style';
import { GradientButton } from '../../../../components/GradientButton';
import { Input_Line } from '../../../../components/input_line';
// Third party libraries
import moment from 'moment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import Modal from "react-native-modal";
import { isIphoneX } from 'react-native-iphone-x-helper';
import { showAlertWithMessageClick } from '../../../../utils/Constants';
import { useSelector, useDispatch } from 'react-redux';
import { onPostDocketFileUpdate, onGetTestRange } from '../../../../redux/actions/AppAction';

let slump_range;
let flow_range;
let tc_range;

export default CustomerRemarkContainer = (props) => {

    const [remark, setRemark] = useState(props.item.CUST_REMARK || '')
    const [flow, setFlow] = useState(props.item.RejectFlow ? props.item.RejectFlow + '' : '')
    const [slump, setSlump] = useState(props.item.RejectSlump ? props.item.RejectSlump + '' : '')
    const [slump2, setSlump2] = useState(props.item.RejectSlump2 ? props.item.RejectSlump2 + '' : '')
    const [slump2_show, setSlump2_show] = useState(props.item.RejectSlump2 ? true : false)
    const [tc, setTC] = useState(props.item.RejectTC ? props.item.RejectTC + '' : '')
    const [ppFibreTestValue, setppFibreTestValue] = useState(props.item.PPFibreTestValue ? props.item.PPFibreTestValue + '' : '')
    const dispatch = useDispatch();
    const generalReducer = useSelector(state => state.generalReducer)
    const appReducer = useSelector(state => state.appReducer)

    // const Base = new BaseClass();

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    useEffect(() => {
        dispatch(onGetTestRange('flow', (data) => { flow_range = data }))
        dispatch(onGetTestRange('slump', (data) => { slump_range = data }))
        dispatch(onGetTestRange('tc', (data) => { tc_range = data }))
    }, [props.navigation])

    useEffect(() => {
        if (props.isModalVisible) {
            Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustPan();
        } else {
            Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustResize();
        }
    }, [props.isModalVisible]);

    const onSubmit = () => {
        Keyboard.dismiss()
        var validNumber = new RegExp(/^\d*\.?\d*$/);
        if ((flow != '' && flow < 0) || (slump != '' && slump < 0) || (tc != '' && tc < 0)) {
            showAlertWithMessageClick(getLanguageValue('ACM_INPUT_INVALID'), getLanguageValue('ACM_NON_NEGATIVE_NUMBER_REQUIRED'), getLanguageValue("ACM_OK"))
        } else if ((flow != '' && validNumber.test(flow) == false) || (slump != '' && validNumber.test(slump) == false) || (tc != '' && validNumber.test(tc) == false)) {
            showAlertWithMessageClick(getLanguageValue('ACM_INPUT_INVALID'), getLanguageValue('ACM_TEST_VALUES_INPUT_NUMERICAL_ONLY'), getLanguageValue("ACM_OK"))
        } else if (flow != '' && (flow < flow_range.MIN || flow > flow_range.MAX)) {
            showAlertWithMessageClick(getLanguageValue("ACM_INVALID_FLOW"), getLanguageValue("ACM_INPUT_FLOW_LIMITATION").replace('{0}', flow_range.MIN).replace('{1}', flow_range.MAX), getLanguageValue("ACM_OK"))
        } else if (slump != '' && (slump < slump_range.MIN || slump > slump_range.MAX)) {
            showAlertWithMessageClick(getLanguageValue('ACM_INVALID_SLUMP'), getLanguageValue("ACM_INPUT_SLUMP_LIMITATION").replace('{0}', slump_range.MIN).replace('{1}', slump_range.MAX), getLanguageValue("ACM_OK"))
        } else if (slump2 != '' && (slump2 < slump_range.MIN || slump2 > slump_range.MAX)) {
            showAlertWithMessageClick(getLanguageValue('ACM_INVALID_SLUMP'), getLanguageValue("ACM_INPUT_SLUMP_LIMITATION").replace('{0}', slump_range.MIN).replace('{1}', slump_range.MAX), getLanguageValue("ACM_OK"))
        } else if (tc != '' && (tc < tc_range.MIN || tc > tc_range.MAX)) {
            showAlertWithMessageClick(getLanguageValue('ACM_INVALID_TC'), getLanguageValue('ACM_INPUT_TC_LIMITATION').replace('{0}', tc_range.MIN).replace('{1}', tc_range.MAX), getLanguageValue("ACM_OK"))
        } else {
            let s_requestBody = JSON.stringify({
                "CUST_REMARK": remark,
                "CUST_REMARK_BY": generalReducer.userDetails.username,
                "CUST_REMARK_TIME": moment().toISOString(),
                "RejectFlow": flow,
                "RejectSlump": slump,
                "RejectSlump2": slump2_show ? slump2 == '' ? null : slump2 : null,
                "RejectTC": tc,
                "PPFibreTestValue": ppFibreTestValue
            })
            dispatch(onPostDocketFileUpdate({
                "user": generalReducer.userDetails.username,
                "docketno": props.item.DOCKETID,
                "action": "remark",
                "online": "online",
                "phone": generalReducer.userDetails.Phone,
            }, s_requestBody, (data) => {
                if (data) {
                    //dispatch(onGetDocketHistory(generalReducer.userDetails, false))
                    props.onModalFalse()
                    setTimeout(() => {
                        showAlertWithMessageClick(getLanguageValue('ACM_SUBMISSION_SUCCESSFUL'), getLanguageValue('ACM_CUSTOMER_REMARK_SUBMITTED_SUCCESSFULLY'), getLanguageValue("ACM_OK"))
                    }, 150);
                }
            }))
        }
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
                        hide_title={false}
                        _title={getLanguageValue('ACM_ADD_CUSTOMER_REMARK')} />
                    <Spacer space={hp(0.2)} />
                    <View style={{ ...styles.divider, backgroundColor: colors.DARK_BORDER_MODEL }} />
                    <View style={{ ...globalStyles.subContainer, width: wp(100), backgroundColor: colors.BG_COMMON }}>
                        <ScrollView
                            bounces={false}
                            showsVerticalScrollIndicator={false}
                            keyboardDismissMode={'interactive'}
                            keyboardShouldPersistTaps={'handled'}
                        >
                            <Input_Line
                                multiline
                                maxLength={50}
                                value={remark}
                                onChange={(val) => { setRemark(val) }}
                                txtstyle={{ textAlignVertical: "top", height: hp(20) }}
                                headerline={getLanguageValue('ACM_CUSTOMER_REMARK')}
                                placeholder={getLanguageValue('ACM_CUSTOMER_REMARK_HINTS')}
                            />

                            <Spacer space={hp(1.2)} />
                            <View style={{ ...styles.divider }} />
                            <View style={styles.wrapper} onPress={() => { setOpen(true), setSelectType(2) }}>
                                <Text style={{ ...styles.txt_fonts, fontFamily: fonts.BOLD, fontSize: wp(4.5) }}>{getLanguageValue('ACM_PROVIDE_TEST_VALUES')}</Text>
                            </View>
                            <View style={{ ...styles.divider }} />
                            <Input_Line
                                value={flow}
                                keyboardType={'decimal-pad'}
                                onChange={(val) => { setFlow(val) }}
                                headerline={getLanguageValue('ACM_FLOW_2')}
                                returnKeyType={"done"}
                                placeholder={getLanguageValue('ACM_FLOW_HINTS')}
                            />
                            <View style={{ ...styles.divider }} />
                            <Input_Line
                                value={slump}
                                onChange={(val) => { setSlump(val) }}
                                headerline={getLanguageValue('ACM_SLUMP_2')}
                                returnKeyType={"done"}
                                is_add_slump={slump2_show ? false : true}
                                keyboardType={'decimal-pad'}
                                onAddSlump={() => { setSlump2_show(true) }}
                                placeholder={getLanguageValue('ACM_SLUMP_HINTS')}
                            />
                            {slump2_show &&
                                <>
                                    <View style={{ ...styles.divider }} />
                                    <Input_Line
                                        value={slump2}
                                        onChange={(val) => { setSlump2(val) }}
                                        headerline={getLanguageValue('ACM_SLUMP_3')}
                                        returnKeyType={"done"}
                                        is_remove_slump={true}
                                        onRemoveSlump={() => { setSlump2_show(false) }}
                                        keyboardType={'decimal-pad'}
                                        placeholder={getLanguageValue('ACM_SLUMP_2_HINTS')}
                                    />
                                </>
                            }
                            <View style={{ ...styles.divider }} />
                            <Input_Line
                                value={tc}
                                onChange={(val) => { setTC(val) }}
                                headerline={getLanguageValue('ACM_TC')}
                                returnKeyType={"done"}
                                keyboardType={'decimal-pad'}
                                placeholder={getLanguageValue('ACM_TC_HINTS')}
                            />
                            <View style={{ ...styles.divider }} />
                            <Input_Line
                                value={ppFibreTestValue}
                                onChange={(val) => { setppFibreTestValue(val) }}
                                headerline={getLanguageValue('ACM_PPFIBRE')}
                                returnKeyType={"done"}
                                keyboardType={'decimal-pad'}
                                placeholder={getLanguageValue('ACM_PPFIBRE_HINTS')}
                                is_right_text
                                right_text={getLanguageValue('ACM_KG')}
                            />
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