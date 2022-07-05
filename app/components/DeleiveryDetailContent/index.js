import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
// styles and themes
import { Spacer } from '../../res/spacer';
import { images } from '../../res/images';
import { fonts } from '../../res/fonts';
import { colors } from '../../res/colors';
import { styles } from './style';
import { GradientButton } from '../GradientButton';
// Third party libraries
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SectionList from 'react-native-tabs-section-list';
import moment from "moment";
import { useSelector, useDispatch } from 'react-redux';
import { GET_DOCKET_PDF, GET_HOUSING_DOCKET_PDF, GET_CUSTOMER_QR_CODE } from '../../apiHelper/Api';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { onGetCscPhone } from '../../redux/actions/AppAction';
import { ATTACHMENT_CUSTOMER_QR_CODE, ATTACHMENT_DOCKET_PREVIEW, ATTACHMENT_EDOCKET_QR_CODE, ATTACHMENT_HOUSING_CERTIFICATE, ATTACHMENT_HOUSING_QR_CODE } from '../../utils/Constants';

export default DetailContainer = (props) => {
    const dispatch = useDispatch();
    const appReducer = useSelector(state => state.appReducer)
    const generalReducer = useSelector(state => state.generalReducer)

    const [phone, setPhone] = useState('')

    useEffect(() => {
        dispatch(onGetCscPhone((data) => {
            setPhone(data.PhoneNumber)
        }))
    }, [])

    // Permission check
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

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    return (
        <SectionList
            sections={props.SECTIONS}
            keyExtractor={item => item.title}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            scrollToLocationOffset={0}
            tabBarStyle={styles.tabBar}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderTab={({ title, isActive }) => (
                <>
                    <View style={[styles.tabContainer, { borderBottomWidth: isActive ? 2 : 0 }]}>
                        <Text style={[styles.tabText]}>{title}</Text>
                    </View>
                </>
            )}
            renderSectionHeader={({ section }) => (
                <View>
                    <View style={styles.sectionHeaderContainer} />
                    <View style={styles.section_title_wrapper}>
                        <Image source={section.image} style={styles.icon_style} />
                        <Text style={styles.sectionHeaderText}>{section.id == 2 ? getLanguageValue("ACM_DOCKET_INFORMATION") : section.title}</Text>
                    </View>
                    {section.id == 1 ?
                        <>
                            <View style={styles.seperate_row_st}>
                                <Spacer space={hp(1)}></Spacer>
                                <Text style={styles.sm_bg}>{props.item.GRADE} </Text>
                                <Spacer space={hp(0.2)}></Spacer>
                                <Text style={{ ...styles.sm_bg, fontSize: wp(4.5) }}>{props.item.MIX}</Text>
                                <Spacer space={hp(1.5)}></Spacer>
                            </View>

                            <Spacer space={hp(1)} />
                            <View style={styles.seperate_row_st}>
                                <View style={styles.section_title_wrapper}>
                                    <Image source={images.delievery_status} style={styles.sm_icon_style} />
                                    <Text style={styles.sectionHeaderText}>{getLanguageValue("ACM_DELIVERY_STATUS")}</Text>
                                </View>
                                <Spacer space={hp(1)} />
                                <Text style={{ ...styles.lbl_Bold, fontSize: wp(5), color: props.status == null ? colors.PIZZAS : props.status == "accepted" ? colors.CARRABIAN_GREEN : props.status == "dump" ? colors.DODGER_BLUE : colors.REJECTED }}>{props.status == null ? getLanguageValue('ACM_DELIVERY_WAITING_FOR_CONFIRMATION') : props.status == "accepted" ? getLanguageValue('ACM_DELIVERY_ACCEPTED') : props.status == "dump" ? getLanguageValue('ACM_DELIVERY_ACCEPTED_DUMP') : getLanguageValue('ACM_DELIVERY_REJECTED')}</Text>
                                {
                                    props.status == "rejected" &&
                                    <>
                                        <Spacer space={hp(1)} />
                                        <GradientButton
                                            is_blue
                                            is_icon
                                            txtStyle={{ fontSize: wp(4) }}
                                            buttonstyle={{ width: wp(40) }}
                                            buttonText={getLanguageValue('ACM_CONTACT_CSC')}
                                            buttonPress={() => { Linking.openURL(`tel:${phone}`) }}
                                        />
                                    </>
                                }
                                {/* {
                                    props.status == "dump" &&
                                    <>
                                    <Spacer space={hp(1)} />
                                   <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <GradientButton
                                            is_light_blue
                                            is_icon
                                            is_border_more
                                            txtStyle={{ fontSize: wp(3.5) }}
                                            buttonstyle={{ width: wp(35) }}
                                            buttonText={getLanguageValue("ACM_CONTACT_CSC")}
                                            buttonPress={() => { Linking.openURL(`tel:${phone}`) }}
                                        />

                                        <GradientButton
                                            is_light_blue
                                            is_icon
                                            is_border_more
                                            is_ic_pass
                                            ic_pass={images.union}
                                            txtStyle={{ fontSize: wp(3.5) }}
                                            buttonstyle={{ width: wp(35) }}
                                            buttonText={getLanguageValue("ACM_CONTACT_PLANT")}
                                            buttonPress={() => { Linking.openURL(`tel:${props.item?.PLANTPHONE}`) }}
                                        />
                                    </View>
                                    </>
                                } */}
                                <Spacer space={hp(2)} />
                            </View>
                        </>
                        : section.id == 2 ?
                            <View style={styles.seperate_row_st}>
                                <Spacer space={hp(1.5)}></Spacer>
                                <Text style={styles.sm_sl}>{getLanguageValue("ACM_DELIVERY_DATE")}</Text>
                                <Spacer space={hp(0.2)}></Spacer>
                                <Text style={{ ...styles.sm_sl, fontSize: wp(5), fontFamily: fonts.BOLD }}>{moment(props.item.ACTUALLOADDATE).format("DD MMMM YYYY")}</Text>
                                <Spacer space={hp(1.2)}></Spacer>
                                <>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_DOCKET_NO_2")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.DOCKETID}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_FLEET_NO_2")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44), fontFamily: fonts.BOLD }}>{props.item.THK_TRUCKID + " (" + props.item.TRUCKREGNO + ")"}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_JOB_CODE")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.JobCode}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_ORDER_DATE")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(48) }}>{props.item.ORDERDATE} <Text style={{ fontSize: wp(2.5) }}> (DD/MM/YYYY)</Text></Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_JOB_NAME")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.THK_JOBNAME}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_SITE_ADDRESS")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.JOBCHINESEADDRESS}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_HEADER_DELIVERY_INSTRUCTIONS")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.THK_CSORDERTAKEDLVINSTRLISTHDR}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_DRIVER_REMARK")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.REMARK}</Text>
                                    </View>

                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_MIX_NAME_2")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44), fontFamily: fonts.BOLD }}>{props.item.MIX}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_TC")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.TemperatureControl}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_PLANT")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.PLANTID}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_CUSTOMER_MIX_ID")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.PTVMIXID}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_UNIVERSAL_PO_NO")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.THK_CSUNIVERSALPO}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_THIS_LOAD")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44), fontFamily: fonts.BOLD }}>{props.item.DLVQTY}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_CUM_TOTAL")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44), fontFamily: fonts.BOLD }}>{props.item.QTYCUMTOTAL}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_ORDER_TOTAL")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44),fontFamily: fonts.BOLD }}>{props.item.QTYORDERTOTAL}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_PART_LOAD")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44),fontFamily: fonts.BOLD }}>{props.item.PART_LOAD}</Text>
                                    </View>
                                    <View style={styles.itemRow}>
                                        <Text style={{ ...styles.item_txt, width: wp(38) }}>{getLanguageValue("ACM_RELEASE_PO_NO")}</Text>
                                        <Text style={{ ...styles.item_txt, width: wp(44) }}>{props.item.THK_CSRELEASEPO}</Text>
                                    </View>
                                </>

                                <Spacer space={hp(4)} />
                            </View>
                            :
                            <>
                                {
                                    props.item.THK_JOBISHOUSINGJOB == 0 && props.item.QRCodeType == 0 &&
                                    <>
                                        {check_permission(ATTACHMENT_DOCKET_PREVIEW) &&
                                            <TouchableOpacity onPress={() => props.navigation.navigate("ImagePreview", { "image_url": GET_DOCKET_PDF + `?fileName=${props.item.DOCKETID}`, type: "Docket Preview" })} style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.attbox} style={styles.icon_style} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5) }}>{getLanguageValue("ACM_DOCKET_PREVIEW")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }

                                        {check_permission(ATTACHMENT_EDOCKET_QR_CODE) &&
                                            <TouchableOpacity style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }} onPress={() => { props.openQrCode({ title: "Comfirmation QR code", type: 0 }) }} disabled={props.status == null ? true : false}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.qrcode_m} style={{ ...styles.icon_style, width: wp(5), height: wp(5), alignSelf: "center", marginLeft: wp(3), marginRight: wp(1), tintColor: props.status == null ? colors.GRAY_MBORDER : colors.PIZZAS }} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5), opacity: props.status == null ? 0.2 : 1 }}>{getLanguageValue("ACM_CONFIRMATION_QR_CODE")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }
                                        <Spacer space={hp(isIphoneX() ? 28.5 : 29.5)}></Spacer>
                                    </>
                                }

                                {
                                    props.item.THK_JOBISHOUSINGJOB == 1 && props.item.QRCodeType == 0 &&
                                    <>
                                        {check_permission(ATTACHMENT_DOCKET_PREVIEW) &&
                                            <TouchableOpacity onPress={() => props.navigation.navigate("ImagePreview", { "image_url": GET_DOCKET_PDF + `?fileName=${props.item.DOCKETID}`, type: "Docket Preview" })} style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.attbox} style={styles.icon_style} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5) }}>{getLanguageValue("ACM_DOCKET_PREVIEW")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }

                                        {check_permission(ATTACHMENT_HOUSING_CERTIFICATE) &&
                                            <TouchableOpacity onPress={() => props.navigation.navigate("ImagePreview", { "image_url": GET_HOUSING_DOCKET_PDF + `?fileName=${props.item.DOCKETID}`, type: "Housing certificate" })} style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.home_ic} style={styles.icon_style} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5) }}>{getLanguageValue("ACM_HOUSING_CERTIFICATE")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }

                                        {check_permission(ATTACHMENT_HOUSING_QR_CODE) &&
                                            <TouchableOpacity style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }} onPress={() => { props.openQrCode({ title: "Housing QR code", type: 1 }) }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.h_qrcode} style={styles.icon_style} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5) }}>{getLanguageValue("ACM_HOUSING_QR_CODE")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }

                                        {check_permission(ATTACHMENT_EDOCKET_QR_CODE) &&
                                            <TouchableOpacity style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }} onPress={() => { props.openQrCode({ title: "Comfirmation QR code", type: 0 }) }} disabled={props.status == null ? true : false}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.qrcode_m} style={{ ...styles.icon_style, width: wp(5), height: wp(5), alignSelf: "center", marginLeft: wp(3), marginRight: wp(1), tintColor: props.status == null ? colors.GRAY_MBORDER : colors.PIZZAS }} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5), opacity: props.status == null ? 0.2 : 1 }}>{getLanguageValue("ACM_CONFIRMATION_QR_CODE")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }
                                        <Spacer space={hp(isIphoneX() ? 22.5 : 23.5)}></Spacer>
                                    </>
                                }

                                {
                                    props.item.THK_JOBISHOUSINGJOB == 1 && props.item.QRCodeType != 0 &&
                                    <>
                                        {check_permission(ATTACHMENT_DOCKET_PREVIEW) &&
                                            <TouchableOpacity onPress={() => props.navigation.navigate("ImagePreview", { "image_url": GET_DOCKET_PDF + `?fileName=${props.item.DOCKETID}`, type: "Docket Preview" })} style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.attbox} style={styles.icon_style} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5) }}>{getLanguageValue("ACM_DOCKET_PREVIEW")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }

                                        {check_permission(ATTACHMENT_HOUSING_CERTIFICATE) &&
                                            <TouchableOpacity onPress={() => props.navigation.navigate("ImagePreview", { "image_url": GET_HOUSING_DOCKET_PDF + `?fileName=${props.item.DOCKETID}`, type: "Housing certificate" })} style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.home_ic} style={styles.icon_style} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5) }}>{getLanguageValue("ACM_HOUSING_CERTIFICATE")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }

                                        {check_permission(ATTACHMENT_HOUSING_QR_CODE) &&
                                            <TouchableOpacity style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }} onPress={() => { props.openQrCode({ title: "Housing QR code", type: 1 }) }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.h_qrcode} style={styles.icon_style} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5) }}>{getLanguageValue("ACM_HOUSING_QR_CODE")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }

                                        {check_permission(ATTACHMENT_CUSTOMER_QR_CODE) &&
                                            <TouchableOpacity style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }} onPress={() => props.navigation.navigate("ImagePreview", { "image_url": GET_CUSTOMER_QR_CODE + `?docketno=${props.item.DOCKETID}`, type: "Customer QR code" })}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.c_qrcode} style={styles.icon_style} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5) }}>{getLanguageValue("ACM_CUSTOMER_QR_CODE")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }

                                        {check_permission(ATTACHMENT_EDOCKET_QR_CODE) &&
                                            <TouchableOpacity style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }} onPress={() => { props.openQrCode({ title: "Comfirmation QR code", type: 0 }) }} disabled={props.status == null ? true : false}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.qrcode_m} style={{ ...styles.icon_style, width: wp(5), height: wp(5), alignSelf: "center", marginLeft: wp(3), marginRight: wp(1), tintColor: props.status == null ? colors.GRAY_MBORDER : colors.PIZZAS }} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5), opacity: props.status == null ? 0.2 : 1 }}>{getLanguageValue("ACM_CONFIRMATION_QR_CODE")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }
                                        <Spacer space={hp(isIphoneX() ? 19.5 : 20.5)}></Spacer>
                                    </>
                                }

                                {
                                    props.item.THK_JOBISHOUSINGJOB == 0 && props.item.QRCodeType != 0 &&
                                    <>
                                        {check_permission(ATTACHMENT_DOCKET_PREVIEW) &&
                                            <TouchableOpacity onPress={() => props.navigation.navigate("ImagePreview", { "image_url": GET_DOCKET_PDF + `?fileName=${props.item.DOCKETID}`, type: "Docket Preview" })} style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.attbox} style={styles.icon_style} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5) }}>{getLanguageValue("ACM_DOCKET_PREVIEW")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }

                                        {check_permission(ATTACHMENT_CUSTOMER_QR_CODE) &&
                                            <TouchableOpacity style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }} onPress={() => props.navigation.navigate("ImagePreview", { "image_url": GET_CUSTOMER_QR_CODE + `?docketno=${props.item.DOCKETID}`, type: "Customer QR code" })} >
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.c_qrcode} style={styles.icon_style} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5) }}>{getLanguageValue("ACM_CUSTOMER_QR_CODE")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }

                                        {check_permission(ATTACHMENT_EDOCKET_QR_CODE) &&
                                            <TouchableOpacity style={{ ...styles.section_title_wrapper, justifyContent: "space-between" }} onPress={() => { props.openQrCode({ title: "Comfirmation QR code", type: 0 }) }} disabled={props.status == null ? true : false}>
                                                <View style={{ flexDirection: "row" }}>
                                                    <Image source={images.qrcode_m} style={{ ...styles.icon_style, width: wp(5), height: wp(5), alignSelf: "center", marginLeft: wp(3), marginRight: wp(1), tintColor: props.status == null ? colors.GRAY_MBORDER : colors.PIZZAS }} />
                                                    <Text style={{ ...styles.sectionHeaderText, fontFamily: fonts.SEMI_BOLD, fontSize: wp(4.5), opacity: props.status == null ? 0.2 : 1 }}>{getLanguageValue("ACM_CONFIRMATION_QR_CODE")}</Text>
                                                </View>
                                                <Image source={images.next_grey} style={styles.icon_style} />
                                            </TouchableOpacity>
                                        }
                                        <Spacer space={hp(isIphoneX() ? 25.5 : 26.5)}></Spacer>
                                    </>
                                }
                            </>
                    }
                </View>
            )}
            renderItem={({ item }) => (null)}
        />
    )
}