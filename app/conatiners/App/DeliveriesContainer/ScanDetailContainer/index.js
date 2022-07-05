import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, Alert } from 'react-native';
// styles and themes
import globalStyles from '../../../../res/globalStyles';
import { images } from '../../../../res/images';
import { colors } from '../../../../res/colors';
import { AppHeader } from '../../../../components/AppHeader';
import { styles } from './style';
// Third party libraries
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomerRemarkContainer from '../CustomerRemarkContainer';
import DeleiveryDetailContent from '../../../../components/DeleiveryDetailContent';
import RejectContainer from '../RejectContainer';
import DumpRequestContainer from '../DumpRequestContainer';
import CommonQrCode from '../CommonQrCode';
import { CommonActions } from '@react-navigation/native';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { onGetShipToDockets, onGetThisDockets, onPostDocketFileUpdate, onGetDockets } from '../../../../redux/actions/AppAction';
import { CUSTOMER_REMARK, HIDE_RECIEVED_ACTIONS, TIME_STAMP } from '../../../../utils/Constants';

export default ScanDetailContainer = (props) => {
    const param = props.route.params;
    const [isRemarkModalVisible, setRemarkModalVisible] = useState(false);
    const [isRejectModalVisible, setRejectModalVisible] = useState(false);
    const [isDumpModalVisible, setDumpModalVisible] = useState(false);
    const [isQrCodeVisible, setQrCodeVisible] = useState(false);
    const [qr_page, setQrPage] = useState({ title: "Comfirmation QR code", type: 0 });

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

    useEffect(() => {

        const unsubscribe = props.navigation.addListener('focus', () => {
            dispatch(onGetThisDockets({ "docketno": param.item.DOCKETID }, (data) => {
                param.item.SITE_ARRIVAL_TIME = data.SITE_ARRIVAL_TIME
                param.item.START_DISCHARGE_TIME = data.START_DISCHARGE_TIME
                param.item.FINISH_DISCHARGE_TIME = data.FINISH_DISCHARGE_TIME
                param.item.SITE_DEPART_TIME = data.SITE_DEPART_TIME
            }))
        });
        return unsubscribe;
    }, [])


    const onHomePress = () => {
        Promise.all([
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Deliveries' }],
                })
            )
        ]).then(() => props.navigation.navigate('Deliveries'))
    }

    const SECTIONS = [
        {
            id: 1,
            image: images.circle_check_ic,
            title: getLanguageValue('ACM_GRADE_LEVEL_MIX_NAME'),
            data: []
        },
        {
            id: 2,
            image: images.d_box_ic,
            title: getLanguageValue('ACM_DOCKET_INFO'),
            data: []
        },
        {
            id: 3,
            image: images.attach_ic,
            title: getLanguageValue('ACM_ATTACHMENT'),
            data: []
        },
    ];

    const onAccept = () => {
        Alert.alert(
            `${getLanguageValue('ACM_CONFIRM_DELIVERY')}`,
            `${getLanguageValue('ACM_ONCE_CONFIRMED')}`,
            [
                {
                    text: `${getLanguageValue("ACM_CONFIRM")}`,
                    onPress: () => { onAcceptWithScan() },
                },
                {
                    text: `${getLanguageValue("ACM_BACK")}`,
                    onPress: () => { console.log('back') },
                },
            ],
            { cancelable: false }
        )
    }


    const onAcceptWithScan = () => {
        let a_requestBody = JSON.stringify({
            "AcceptedBy": generalReducer.userDetails.username,
            "STATUS": "accepted",
            "AcceptedTime": moment().toISOString()
        })
        dispatch(onPostDocketFileUpdate({
            "user": generalReducer.userDetails.username,
            "docketno": param.item.DOCKETID,
            "action": "accept",
            "online": "online",
            "phone": generalReducer.userDetails.Phone,
        }, a_requestBody, (data) => {
            if (data) {
                dispatch(onGetDockets(generalReducer.userDetails, false))
                dispatch(onGetShipToDockets(generalReducer.userDetails, false))
                setTimeout(() => {
                    dispatch(onGetThisDockets({ "docketno": param.item.DOCKETID }, (data) => {
                        Promise.all([props.navigation.dispatch(CommonActions.reset({
                            index: 0,
                            routes: [{ name: param.is_home ? 'Deliveries' : 'History' }],
                        }))]).then(() =>
                            setTimeout(() => {
                                props.navigation.navigate('ScanDetails', { "status": data.STATUS, "item": data, is_home: param.is_home, is_update: true })
                            }, 250)
                        )
                    }))
                }, 250);
            }
        }))
    }


    return (
        <View style={globalStyles.flex}>
            {/* onHomePress() */}
            <AppHeader isShow onBackPress={() => { param.is_update ? onHomePress() : props.navigation.goBack() }} back_title={param.is_update ? getLanguageValue('ACM_HOME').replace(/(?:\r\n|\r|\n|\t)/g, '') : getLanguageValue('ACM_BACK').replace(/(?:\r\n|\r|\n|\t)/g, '')} hide_title={false} _title={getLanguageValue('ACM_DELIVERY_DETAILS').replace(/(?:\r\n|\r|\n|\t)/g, '')} />
            <View style={{ ...globalStyles.subContainer, width: wp(100), backgroundColor: colors.BG_COMMON }}>

                <CustomerRemarkContainer
                    item={param.item}
                    navigation={props.navigation}
                    is_home={param.is_home}
                    isModalVisible={isRemarkModalVisible}
                    onModalFalse={() => { setRemarkModalVisible(!isRemarkModalVisible) }}
                />

                <RejectContainer
                    item={param.item}
                    navigation={props.navigation}
                    is_home={param.is_home}
                    isModalVisible={isRejectModalVisible}
                    onModalFalse={() => { setRejectModalVisible(!isRejectModalVisible) }}
                />

                <DumpRequestContainer
                    navigation={props.navigation}
                    item={param.item}
                    is_home={param.is_home}
                    isModalVisible={isDumpModalVisible}
                    onModalFalse={() => { setDumpModalVisible(!isDumpModalVisible) }}
                />

                <CommonQrCode
                    navigation={props.navigation}
                    isModalVisible={isQrCodeVisible}
                    status={param.status}
                    item={param.item}
                    title={qr_page.title}
                    type={qr_page.type}
                    onModalFalse={() => { setQrCodeVisible(!isQrCodeVisible) }} />

                <DeleiveryDetailContent
                    SECTIONS={SECTIONS}
                    status={param.status}
                    item={param.item}
                    navigation={props.navigation}
                    openQrCode={(item) => { setQrCodeVisible(!isQrCodeVisible), setQrPage(item) }}
                />
            </View>
            <View style={styles.bottom_container}>

                {check_permission(HIDE_RECIEVED_ACTIONS) ?
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { (param.status == "rejected" || param.status == null) ? setRejectModalVisible(!isRejectModalVisible) : onHomePress() }} style={{ ...styles.bottom_wrapper, marginTop: 2 }}>
                        <Image source={param.status == null ? images.remove_ic : (param.status == "dump" || param.status == "accepted") ? images.dashboard_ic : images.revise} style={(param.status == "dump" || param.status == "accepted") ? styles.mm_image : styles.sm_image} />
                        <Text style={styles.txt_gray}>{param.status == null ? getLanguageValue("ACM_REJECT") : (param.status == "accepted" || param.status == "dump") ? getLanguageValue("ACM_HOME") : getLanguageValue("ACM_REVISE_TEST_RESULT")}</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity activeOpacity={0.7} onPress={() => onHomePress()} style={{ ...styles.bottom_wrapper, marginTop: 2 }}>
                        <Image source={images.dashboard_ic} style={styles.mm_image} />
                        <Text style={styles.txt_gray}>{getLanguageValue("ACM_HOME")}</Text>
                    </TouchableOpacity>
                }

                {check_permission(TIME_STAMP) &&
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { props.navigation.navigate("TimeStamp", { "item": param.item }) }} style={styles.bottom_wrapper}>
                        <Image source={images.timestamp} style={styles.mm_image} />
                        <Text style={styles.txt_gray}>{getLanguageValue("ACM_TIMESTAMP")}</Text>
                    </TouchableOpacity>
                }

                {check_permission(CUSTOMER_REMARK) &&
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { setRemarkModalVisible(!isRemarkModalVisible) }} style={styles.bottom_wrapper}>
                        <Image source={images.remark} style={styles.mm_image} />
                        <Text style={styles.txt_gray}>{getLanguageValue("ACM_CUSTOMER_REMARK")}</Text>
                    </TouchableOpacity>
                }

                {check_permission(HIDE_RECIEVED_ACTIONS) ?
                    <TouchableOpacity activeOpacity={0.7}
                        onPress={() => { param.status == "accepted" ? setDumpModalVisible(!isDumpModalVisible) : param.status == "dump" ? props.navigation.navigate("QrCode") : onAccept() }}
                        style={{ ...styles.bottom_wrapper, top: -wp(10), right: -wp(2) }}>
                        <Image source={param.status == null ? (global.LanguageSelect == "en" ? images.accept_ic : images.ch_accept) : param.status == "accepted" ? (global.LanguageSelect == "en" ? images.dump_ic : images.ch_scan_btn) : param.status == "dump" ? images.scan_btn : (global.LanguageSelect == "en" ? images.accept_btn : images.ch_change_to_accept)} resizeMode={'contain'} style={styles.lm_image} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity activeOpacity={0.7}
                        onPress={() => { props.navigation.navigate("QrCode") }}
                        style={{ ...styles.bottom_wrapper, top: -wp(10), right: -wp(2) }}>
                        <Image source={images.scan_btn} resizeMode={'contain'} style={styles.lm_image} />
                    </TouchableOpacity>
                }

            </View>
        </View >
    )
}