import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Image, Alert, Platform } from 'react-native';
// styles and themes
import globalStyles from '../../../../res/globalStyles';
import { images } from '../../../../res/images';
import { colors } from '../../../../res/colors';
import { AppHeader } from '../../../../components/AppHeader';
import { styles } from './style';
// Third party libraries
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DatePicker from 'react-native-date-picker';
import moment from "moment"
import { useSelector, useDispatch } from 'react-redux';
import { onPostDocketFileUpdate } from '../../../../redux/actions/AppAction';
import { Spacer } from '../../../../res/spacer';
import { EDIT_FINISH_DISCHARGE_TIME, EDIT_SITE_DEPART_TIME, EDIT_START_ARRIVAL_TIME, EDIT_START_DISCHARGE_TIME } from '../../../../utils/Constants';

export default TimeStampContainer = (props) => {

    const param = props.route.params.item;

    const [arrival_time, setArrivalTime] = useState(param.SITE_ARRIVAL_TIME || '')
    const [discharge_time, setDischargeTime] = useState(param.START_DISCHARGE_TIME || '')
    const [finish_discharge_time, setFinishDischargeTime] = useState(param.FINISH_DISCHARGE_TIME || '')
    const [depart_time, setDepartTime] = useState(param.SITE_DEPART_TIME || '')

    const [is_arrival_time, setISArrivalTime] = useState(false)
    const [is_discharge_time, setIsDischargeTime] = useState(false)
    const [is_finish_discharge_time, setISFinishDischargeTime] = useState(false)
    const [is_depart_time, setIsDepartTime] = useState(false)

    const [select_type, setSelectType] = useState(1)
    const [open, setOpen] = useState(false)

    const dispatch = useDispatch();
    const generalReducer = useSelector(state => state.generalReducer)
    const appReducer = useSelector(state => state.appReducer)

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    const onTimeStampSelected = (date) => {
        var time = moment(date).utc(true);
        setOpen(false)
        if (select_type == 1) {
            if (param.ACTUALLOADDATE != '' && moment(time).isBefore(param.ACTUALLOADDATE)) {
                common_input_alert(getLanguageValue('ACM_SITE_ARRIVAL_TIME'), true, () => { })
            } else if ((depart_time != '' && moment(time).isAfter(moment(depart_time).utc(true))) ||
                (finish_discharge_time != '' && moment(time).isAfter(moment(finish_discharge_time).utc(true))) ||
                (discharge_time != '' && moment(time).isAfter(moment(discharge_time).utc(true)))) {
                common_input_alert(getLanguageValue('ACM_SITE_ARRIVAL_TIME'), false, () => { })
            } else {
                updationAlert(getLanguageValue('ACM_SITE_ARRIVAL_TIME_SUCCESSFUL'), () => {
                    setArrivalTime(time)
                    setISArrivalTime(true)
                    let a_requestBody = JSON.stringify({
                        "SITE_ARRIVAL_TIME": time,
                        "START_DISCHARGE_TIME": discharge_time != '' ? discharge_time : null,
                        "FINISH_DISCHARGE_TIME": finish_discharge_time != '' ? finish_discharge_time : null,
                        "SITE_DEPART_TIME": depart_time != '' ? depart_time : null,
                    })
                    onPostTime(a_requestBody)
                })
            }
        } else if (select_type == 2) {
            if ((param.ACTUALLOADDATE != '' && moment(time).isBefore(param.ACTUALLOADDATE)) ||
                arrival_time != '' && moment(time).isBefore(moment(arrival_time).utc(true))) {
                common_input_alert(getLanguageValue('ACM_START_DISCHARGE_TIME'), true, () => { })
            } else if ((finish_discharge_time != '' && moment(time).isAfter(moment(finish_discharge_time).utc(true)))
                || (depart_time != '' && moment(time).isAfter(moment(depart_time).utc(true)))) {
                common_input_alert(getLanguageValue('ACM_START_DISCHARGE_TIME'), false, () => { })
            } else {
                updationAlert(getLanguageValue('ACM_START_DISCHARGE_TIME_SUCCESSFUL'), () => {
                    setDischargeTime(time)
                    setIsDischargeTime(true)
                    let a_requestBody = JSON.stringify({
                        "SITE_ARRIVAL_TIME": arrival_time != '' ? arrival_time : null,
                        "START_DISCHARGE_TIME": time,
                        "FINISH_DISCHARGE_TIME": finish_discharge_time != '' ? finish_discharge_time : null,
                        "SITE_DEPART_TIME": depart_time != '' ? depart_time : null,
                    })
                    onPostTime(a_requestBody)
                })
            }
        } else if (select_type == 3) {

            if ((param.ACTUALLOADDATE != '' && moment(time).isBefore(param.ACTUALLOADDATE)) ||
                (arrival_time != '' && moment(time).isBefore(moment(arrival_time).utc(true))) ||
                (discharge_time != '' && moment(time).isBefore(moment(discharge_time).utc(true)))) {
                common_input_alert(getLanguageValue('ACM_FINISH_DISCHARGE_TIME'), true, () => { })
            } else if ((depart_time != '' && moment(time).isAfter(moment(depart_time).utc(true)))) {
                common_input_alert(getLanguageValue('ACM_FINISH_DISCHARGE_TIME'), false, () => { })
            } else {
                updationAlert(getLanguageValue('ACM_FINISH_DISCHARGE_TIME_SUCCESSFUL'), () => {
                    setFinishDischargeTime(time)
                    setISFinishDischargeTime(true)
                    let a_requestBody = JSON.stringify({
                        "SITE_ARRIVAL_TIME": arrival_time != '' ? arrival_time : null,
                        "START_DISCHARGE_TIME": discharge_time != '' ? discharge_time : null,
                        "FINISH_DISCHARGE_TIME": time,
                        "SITE_DEPART_TIME": depart_time != '' ? depart_time : null,
                    })
                    onPostTime(a_requestBody)
                })
            }
        } else if (select_type == 4) {

            if ((param.ACTUALLOADDATE != '' && moment(time).isBefore(param.ACTUALLOADDATE)) ||
                (arrival_time != '' && moment(time).isBefore(moment(arrival_time).utc(true))) ||
                (finish_discharge_time != '' && moment(time).isBefore(moment(finish_discharge_time).utc(true))) ||
                (discharge_time != '' && moment(time).isBefore(moment(discharge_time).utc(true)))) {
                common_input_alert(getLanguageValue('ACM_SITE_DEPART_TIME'), true, () => { })
            } else {
                updationAlert(getLanguageValue('ACM_SITE_DEPART_TIME_SUCCESSFUL'), () => {
                    setDepartTime(time)
                    setIsDepartTime(true)
                    let a_requestBody = JSON.stringify({
                        "SITE_ARRIVAL_TIME": arrival_time != '' ? arrival_time : null,
                        "START_DISCHARGE_TIME": discharge_time != '' ? discharge_time : null,
                        "FINISH_DISCHARGE_TIME": finish_discharge_time != '' ? finish_discharge_time : null,
                        "SITE_DEPART_TIME": time
                    })
                    onPostTime(a_requestBody)
                })
            }
        }
    }

    const onPostTime = (a_requestBody) => {
        dispatch(onPostDocketFileUpdate({
            "user": generalReducer.userDetails.username,
            "docketno": param.DOCKETID,
            "action": "timeStamp",
            "online": "online",
            "phone": generalReducer.userDetails.Phone,
        }, a_requestBody, (data) => {
        }))
    }

    const updationAlert = (time_text, callback) => {
        Alert.alert(
            `${getLanguageValue('ACM_TIMESTAMP_UPDATE_SUCCESSFUL')}`,
            `${time_text}`,
            [
                {
                    text: `${getLanguageValue("ACM_OK")}`,
                    onPress: () => { callback() },
                },
            ]
        )
    }

    const common_input_alert = (time_text, is_early, callback) => {
        Alert.alert(
            `${getLanguageValue(is_early ? 'ACM_INPUT_TIME_EARLY' : 'ACM_INPUT_TIME_LATE')}`,
            `${is_early ? getLanguageValue('ACM_EARLIER_THAN_PREVIOUS_STATUS').replace('{0}', `${time_text}`) : getLanguageValue('ACM_LATER_THAN_NEXT_STATUS').replace('{0}', `${time_text}`)}`,
            [
                {
                    text: `${getLanguageValue("ACM_OK")}`,
                    onPress: () => { callback() },
                },
            ]
        )
    }

    const convertUTCDate = (date, is_change) => {
        if (Platform.OS == "ios") {
            if (is_change) {
                return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
            } else {
                return new Date(moment(date).utc(false))
            }
        } else {
            return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        }
    }

    const check_permission = (number) => {
        if (generalReducer.userDetails != null && generalReducer.userDetails.permissions != undefined) {
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
        <View style={globalStyles.flex}>

            <AppHeader isShow onBackPress={() => { props.navigation.goBack() }} hide_title={false} _title={getLanguageValue('ACM_ADD_TIMESTAMP')} />
            <View style={{ ...globalStyles.subContainer, width: wp(100), backgroundColor: colors.BG_COMMON }}>

                <TouchableOpacity style={styles.wrapper} activeOpacity={0.9}>
                    <Text style={styles.txt_fonts}>{getLanguageValue('ACM_TIME_LOADED')}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ ...styles.txt_fonts, color: colors.MANATEE }}>{param.ACTUALLOADDATE != '' ? moment(param.ACTUALLOADDATE).utc(false).format('hh:mm A') : ''}</Text>
                        {/* <Image source={images.right_arrow} style={{ ...styles.ic_right, tintColor: colors.WHITE }} /> */}
                    </View>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.wrapper} disabled={check_permission(EDIT_START_ARRIVAL_TIME) ? false : true} onPress={() => { setOpen(true), setSelectType(1) }}>
                    <Text style={styles.txt_fonts}>{getLanguageValue('ACM_SITE_ARRIVAL_TIME')}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ ...styles.txt_fonts, color: colors.MANATEE }}>{arrival_time != '' ? moment(arrival_time).format('hh:mm A') : ''}</Text>
                        {check_permission(EDIT_START_ARRIVAL_TIME) && <Image source={images.right_arrow} style={{ ...styles.ic_right }} />}
                    </View>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.wrapper} disabled={check_permission(EDIT_START_DISCHARGE_TIME) ? false : true} onPress={() => { setOpen(true), setSelectType(2) }}>
                    <Text style={styles.txt_fonts}>{getLanguageValue('ACM_START_DISCHARGE_TIME')}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ ...styles.txt_fonts, color: colors.MANATEE }}>{discharge_time != '' ? moment(discharge_time).format('hh:mm A') : ''}</Text>
                        {check_permission(EDIT_START_DISCHARGE_TIME) && <Image source={images.right_arrow} style={{ ...styles.ic_right }} />}
                    </View>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.wrapper} disabled={check_permission(EDIT_FINISH_DISCHARGE_TIME) ? false : true} onPress={() => { setOpen(true), setSelectType(3) }}>
                    <Text style={styles.txt_fonts}>{getLanguageValue('ACM_FINISH_DISCHARGE_TIME')}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ ...styles.txt_fonts, color: colors.MANATEE }}>{finish_discharge_time != '' ? moment(finish_discharge_time).format('hh:mm A') : ''}</Text>
                        {check_permission(EDIT_FINISH_DISCHARGE_TIME) && <Image source={images.right_arrow} style={{ ...styles.ic_right }} />}
                    </View>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.wrapper} disabled={check_permission(EDIT_SITE_DEPART_TIME) ? false : true} onPress={() => { setOpen(true), setSelectType(4) }}>
                    <Text style={styles.txt_fonts}>{getLanguageValue('ACM_SITE_DEPART_TIME')}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ ...styles.txt_fonts, color: colors.MANATEE }}>{depart_time != '' ? moment(depart_time).format('hh:mm A') : ''}</Text>
                        {check_permission(EDIT_SITE_DEPART_TIME) && <Image source={images.right_arrow} style={{ ...styles.ic_right }} />}
                    </View>
                </TouchableOpacity>
                <View style={styles.divider} />
                <Spacer space={4} />
                <Text style={{ ...styles.txt_fonts, fontSize: wp(3.4), color: "rgba(60, 60, 67, 0.6)", alignSelf: "flex-start", marginLeft: wp(3) }}>{getLanguageValue('ACM_TIME_DISCLAIMER\r\n')}</Text>
                <DatePicker
                    modal
                    open={open}
                    date={select_type == 1 && arrival_time != '' ? convertUTCDate(new Date(arrival_time), is_arrival_time) :
                        select_type == 2 && discharge_time != '' ? convertUTCDate(new Date(discharge_time), is_discharge_time) :
                            select_type == 3 && finish_discharge_time != '' ? convertUTCDate(new Date(finish_discharge_time), is_finish_discharge_time) :
                                select_type == 4 && depart_time != '' ? convertUTCDate(new Date(depart_time), is_depart_time) : new Date()}
                    title={getLanguageValue('ACM_ADD_TIMESTAMP')}
                    mode={"time"}
                    androidVariant={"iosClone"}
                    onConfirm={(date) => { onTimeStampSelected(date) }}
                    onCancel={() => { setOpen(false) }}
                    cancelText={getLanguageValue('ACM_CANCEL')}
                    confirmText={getLanguageValue('ACM_CONFIRM')}
                />
            </View>
        </View>
    )
}