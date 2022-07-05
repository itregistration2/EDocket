import React, { useState } from 'react';
import { View } from 'react-native';
// styles and themes
import globalStyles from '../../../../res/globalStyles';
import { images } from '../../../../res/images';
import { colors } from '../../../../res/colors';
import { AppHeader } from '../../../../components/AppHeader';
// Third party libraries
import { useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DeleiveryDetailContent from '../../../../components/DeleiveryDetailContent';
import CommonQrCode from '../CommonQrCode';

export default DetailContainer = (props) => {
    const [qr_page, setQrPage] = useState({ title: "Comfirmation QR code", type: 0 });
    const [isQrCodeVisible, setQrCodeVisible] = useState(false);
    const param = props.route.params.item;
    const appReducer = useSelector(state => state.appReducer)

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
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



    return (
        <View style={globalStyles.flex}>

            <CommonQrCode
                item={param}
                navigation={props.navigation}
                isModalVisible={isQrCodeVisible}
                title={qr_page.title}
                type={qr_page.type}
                onModalFalse={() => { setQrCodeVisible(!isQrCodeVisible) }} />
           
            <AppHeader isShow back_title={getLanguageValue('ACM_BACK')} onBackPress={() => { props.navigation.goBack() }} hide_title={false} _title={getLanguageValue('ACM_DELIVERY_DETAILS')} />
           
            <View style={{ ...globalStyles.subContainer, width: wp(100), backgroundColor: colors.BG_COMMON }}>
                <DeleiveryDetailContent
                    SECTIONS={SECTIONS}
                    status={null}
                    item={param}
                    navigation={props.navigation}
                    openQrCode={(item) => { setQrCodeVisible(!isQrCodeVisible), setQrPage(item) }}
                />
            </View>
        </View>
    )
}