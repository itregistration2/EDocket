import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
// styles and themes
import { Spacer } from '../../../../res/spacer';
import globalStyles from '../../../../res/globalStyles';
import { colors } from '../../../../res/colors';
import { AppHeader } from '../../../../components/AppHeader';
import { styles } from './style';
// Third party libraries
import QRCode from 'react-native-qrcode-svg';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import { useDispatch, useSelector } from 'react-redux';
import { onGetHousingQRData } from '../../../../redux/actions/AppAction';
import { GET_HOUSING_QR_CODE } from '../../../../apiHelper/Api';

export default CommonQrCode = (props) => {
    const dispatch = useDispatch();
    const [housing_qr_data, setHousingQRData] = useState(null)
    const appReducer = useSelector(state => state.appReducer)

    useEffect(() => {
        props.type == 1 &&
            dispatch(onGetHousingQRData(GET_HOUSING_QR_CODE + `?docketno=${props.item.DOCKETID}`, (data) => {
                setHousingQRData(data ? JSON.stringify(data) : null)
            }))
    }, [props.type])

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    return (
        <>
            <Modal style={styles.modal_container}
                isVisible={props.isModalVisible}
                backdropOpacity={0.7}
                onBackButtonPress={() => { props.onModalFalse() }}>
                <View style={{ ...globalStyles.flex, }}>
                    <AppHeader isShow back_title={getLanguageValue('ACM_BACK')} is_dark is_ic_right onBackPress={() => { props.onModalFalse() }} hide_title={false} _title={props.type == 0 ? getLanguageValue('ACM_CONFIRMATION_QR_CODE') : getLanguageValue('ACM_HOUSING_QR_CODE')} />
                    <Spacer space={hp(0.2)} />
                    <View style={{ ...styles.divider, backgroundColor: colors.DARK_BORDER_MODEL }} />
                    <View style={{ ...globalStyles.subContainer, width: wp(100), backgroundColor: colors.BG_COMMON }}>
                        <View style={{ alignSelf: "center", alignItems: "center" }}>
                            <Spacer space={hp(1.5)} />
                            <Text style={styles.txt_fonts}>{`${props.type == 0 ? getLanguageValue('ACM_GOOD_RECEIVE_QR_CODE_FOR_DOCKET_NO').replace('{0}', props.item.DOCKETID) : getLanguageValue('ACM_HOUSING_QR_CODE_FOR_DOCKET_NO').replace("{0}", props.item.DOCKETID)}`}</Text>
                            <Spacer space={hp(1.2)} />
                            <QRCode value={(props.type == 1 && housing_qr_data != null) ?
                                housing_qr_data :
                                JSON.stringify(Object.assign({
                                    "DOCKETID": props.item.DOCKETID,
                                    "THK_TRUCKID": props.item.THK_TRUCKID,
                                    "ORDERDATE": props.item.ORDERDATE,
                                    "JobCode": props.item.JobCode,
                                    "PLANTID": props.item.PLANTID,
                                    "STATUS": props.item.STATUS
                                }))
                            } size={wp(75)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}