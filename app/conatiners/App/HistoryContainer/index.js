
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Animated, RefreshControl, ScrollView, Keyboard } from 'react-native';
// styles and themes
import { Spacer } from '../../../res/spacer';
import globalStyles from '../../../res/globalStyles';
import { Header } from '../../../components/Header';
import { DeliveryContent } from '../../../components/DeliveryContent';
import { images } from '../../../res/images';
import { fonts } from '../../../res/fonts';
import { colors } from '../../../res/colors';
import { styles } from './style';
import { fmtMSS, HISTORY_LABEL_DATE } from '../../../utils/Constants';
import { Input_Line } from '../../../components/input_line';
import { GradientButton } from '../../../components/GradientButton';
import { AppHeader } from '../../../components/AppHeader';
// Third party libraries & redux
import { onGetDocketHistory, onGetDocketsHistorySearch } from '../../../redux/actions/AppAction';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';
import Modal from "react-native-modal";
import { useSelector, useDispatch } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import DatePicker from 'react-native-date-picker';

let date_pick = null;
export default HistoryContainer = (props) => {
    const dispatch = useDispatch();
    const [searchVal, setSearchVal] = useState('')
    const [filter, setFilter] = useState('')
    const [s_random, setRandom] = useState(Math.random())
    //useState(moment().add(7, 'days'));
    const [selected_min_date, setSelected_min_date] = useState(moment());
    const [selected_max_date, setSelected_max_date] = useState(moment());
    const [isRangeVisible, setIsRangeVisible] = useState(false);
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [date_type, setDateType] = useState(1)
    const sideAnimation = React.useMemo(() => new Animated.ValueXY({ x: 0, y: -120 }), [])
    const scrollY = useRef(new Animated.Value(0));
    const generalReducer = useSelector(state => state.generalReducer)
    const appReducer = useSelector(state => state.appReducer)
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            setFilter(global.filterSelect)
            if (global.filterSelect.trim() != '') {
                dispatch(onGetDocketsHistorySearch(generalReducer.userDetails, global.filterSelect, false))
            } else {
                dispatch(onGetDocketHistory(generalReducer.userDetails, false))
            }
        });
        return unsubscribe;
    }, [generalReducer.userDetails, props.navigation])

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

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setFilter('')
        global.filterSelect = ''
        dispatch(onGetDocketHistory(generalReducer.userDetails, false))
        wait(2000).then(() => setRefreshing(false));
    }, []);

    // empty container
    const emptyContainer = () => {
        return (
            <View style={{ alignSelf: "center" }}>
                <Spacer space={hp(3)} />
                <Image source={images.file_dock} style={styles.ic_dock} />
                <Spacer space={hp(1)} />
                <Text style={{ ...styles.txt_fonts, color: colors.MANATEE, fontFamily: fonts.REGULAR }}>{getLanguageValue('ACM_NO_DELIVERY')}</Text>
            </View>
        )
    }

    const onSearchHistoryDocket = (param) => {
        setFilter(param)
        global.filterSelect = param
        if (param.trim() != '') {
            dispatch(onGetDocketsHistorySearch(generalReducer.userDetails, param, false))
        } else {
            dispatch(onGetDocketHistory(generalReducer.userDetails, false))
        }
    }

    const handleScroll = Animated.event(
        [
            {
                nativeEvent: { contentOffset: { y: scrollY.current } },
            },
        ],
        {
            useNativeDriver: true,
            listener: event => {
                Keyboard.dismiss()
                const currentOffset = event.nativeEvent.contentOffset.y;
                if (currentOffset < 60) {
                    Animated.timing(sideAnimation, {
                        toValue: { x: 0, y: -120 },
                        duration: 60,
                        useNativeDriver: false,
                    }).start()
                } else if (currentOffset > 60) {
                    Animated.timing(sideAnimation, {
                        toValue: { x: 0, y: 0 },
                        duration: 10,
                        useNativeDriver: false,
                    }).start()
                }
            },
        },
    );

    // ship item
    const renderShipItem = ({ item, index }) => {
        return (
            <View key={index} style={{ backgroundColor: colors.WHITE }}>
                <View style={styles.divider} />
                <Spacer space={hp(0.5)} />
                <TouchableOpacity key={index} style={{ flexDirection: "row", paddingLeft: wp(4) }} onPress={() => { item.is_open = !item.is_open, setRandom(Math.random()) }}>
                    <View style={{ width: wp(82) }}>
                        <Text style={{ ...styles.txt_fonts, fontSize: wp(4), width: wp(75) }}>{item.site}</Text>
                        <Text style={{ ...styles.txt_fonts, color: colors.MANATEE, fontFamily: fonts.REGULAR }}>{`(${getLanguageValue("ACM_CUM_TOTAL_3")}${item.cumtotal})`}</Text>
                    </View>
                    <Image source={images.right_arrow} style={{
                        ...styles.ic_right, alignSelf: "center",
                        transform: [{ rotate: item.is_open ? '90deg' : '0deg' }]
                    }} />
                </TouchableOpacity>
                {
                    <>
                        {item.is_open && item.dockets.map((docket_item, index) => {
                            return (
                                <>
                                    {index == 0 && <Spacer space={hp(0.5)} />}
                                    <View style={{ ...styles.divider, backgroundColor: colors.GRAY_93 }} />
                                    <View style={{ backgroundColor: colors.BG_COMMON, paddingLeft: wp(4) }}>
                                        <Spacer space={hp(0.8)} />
                                        <DeliveryContent
                                            back_ground={colors.BG_COMMON}
                                            index={index}
                                            bcolor={docket_item.BCOLOR}
                                            color={docket_item.COLOR}
                                            label={docket_item.GRADE}
                                            ScannedBy={item.ScannedBy}
                                            fleet_no={docket_item.THK_TRUCKID}
                                            address={docket_item.MIX}
                                            docet_no={docket_item.DOCKETID}
                                            _onPress={() => {
                                                props.navigation.navigate("ScanDetails", { "item": docket_item, "status": docket_item.STATUS, is_home: true })
                                            }}
                                        />
                                        <Spacer space={hp(0.6)} />
                                    </View>
                                </>
                            )
                        }
                        )}
                    </>

                }
                {!item.is_open && <Spacer space={hp(0.5)} />}
            </View>
        )
    }

    const renderHistoryItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} style={{ backgroundColor: colors.WHITE }}
                onPress={() => { props.navigation.navigate("ScanDetails", { "status": item.STATUS, "item": item, is_home: false }) }}
            >
                {index == 0 && <View style={styles.b_border_color} />}
                <Spacer space={hp(1.6)} />
                <View style={{ width: wp(90), alignSelf: "center" }}>
                    <View style={styles.flex_row}>
                        <Text style={styles.txt_fonts}>{item.DOCKETID}</Text>
                        <Image source={images.right_arrow} style={styles.ic_right} />
                    </View>
                    <Spacer space={hp(0.6)} />
                    <View style={styles.flex_row}>
                        <View style={{ width: wp(65) }}>
                            <Text style={styles.txt_regular_fonts}>{getLanguageValue('ACM_LOAD_TIME') + ' ' + fmtMSS(item.ACTUALLOADTIME)}</Text>
                            <Text style={styles.txt_regular_fonts}>{getLanguageValue('ACM_FLEET_NO') + ' ' + item.THK_TRUCKID}</Text>
                            <Text style={styles.txt_regular_fonts}>{getLanguageValue('ACM_MIX_NAME_1') + ' ' + item.MIX}</Text>
                            <Text style={styles.txt_regular_fonts}>{`${getLanguageValue('ACM_THIS_LOAD')}: ` + item.DLVQTY + " " + (item.STATUS == "dump" ? `(${getLanguageValue('ACM_RETURN')} ${item.DumpQty != null && item.DumpQty != '' && item.DumpQty > 0 ? item.DumpQty.toFixed(1) : 0.0})` : item.STATUS == "rejected" ? `(${getLanguageValue('ACM_REJECTED_2')} ${item.RejectQty != null && item.RejectQty != '' && item.RejectQty > 0 ? item.RejectQty.toFixed(1) : 0.0})` : '')}</Text>
                            <Text style={styles.txt_regular_fonts}>{getLanguageValue('ACM_CUM_TOTAL_2') + ' ' + item.QTYCUMTOTAL}</Text>
                            <Text style={styles.txt_regular_fonts}>{getLanguageValue('ACM_PLANT_2') + ' ' + item.PLANTID}</Text>
                            <Text style={styles.txt_regular_fonts}>{getLanguageValue("ACM_TC_3") + ' ' + (item.TemperatureControl == null ? '' : item.TemperatureControl)}</Text>
                            {item.STATUS == "dump" && <Text style={{ ...styles.txt_regular_fonts, opacity: 0.4 }}>{`${getLanguageValue('ACM_REQUEST_DUMP_RETURN_SIGN').replace('{0}', `${item.DumpedBy}`)}`}</Text>}
                        </View>
                        <View style={{ ...styles.round_wrapper, backgroundColor: item.STATUS == "accepted" ? colors.CARRABIAN_GREEN : item.STATUS == "dump" ? colors.DODGER_BLUE_1 : colors.RED }}>
                            <Text style={styles.wrapper_txt}>{item.STATUS == "accepted" ? getLanguageValue('ACM_ACCEPTED') : item.STATUS == "dump" ? getLanguageValue('ACM_DUMP') : getLanguageValue('ACM_REJECTED')}</Text>
                        </View>
                    </View>
                </View>
                <Spacer space={hp(1)} />
                <View style={styles.b_border_color} />
            </TouchableOpacity>
        )
    }

    //#region Date Range Selector
    const showMinDatePicker = () => {
        date_pick = new Date(selected_min_date);
        setDateType(1);
        setIsDatePickerVisible(true)
    };

    const showMaxDatePicker = () => {
        date_pick = new Date(selected_max_date);
        setDateType(2);
        setIsDatePickerVisible(true)
    };

    const hideDatePicker = () => {
        setIsDatePickerVisible(false)
    };

    const handleConfirm = (date) => {
        date_type == 1 ? setSelected_min_date(date) : setSelected_max_date(date)
        hideDatePicker();
    };

    const onDateConfirm = () => {
        setIsRangeVisible(!isRangeVisible)
        setFilter('byDate')
        global.filterSelect = ''
        dispatch(onGetDocketsHistorySearch(generalReducer.userDetails, { "dateFrom": moment(selected_min_date).format("YYYY-MM-DD"), "dateTo": moment(selected_max_date).format("YYYY-MM-DD") }, true))
    }

    // render date range modal
    const _renderDateRangeModal = () => {
        return (
            <Modal
                style={styles.modal_container}
                isVisible={isRangeVisible}
                backdropOpacity={0.7}
                onBackdropPress={() => { setIsRangeVisible(false) }}
            >
                <View style={{ ...globalStyles.flex }}>
                    <Spacer space={5} />
                    <AppHeader
                        isShow={false}
                        is_white
                        is_doggler_blue
                        is_right_include
                        is_modal
                        onBackPress={() => { setIsRangeVisible(false) }}
                        hide_title={false}
                        _title={getLanguageValue('ACM_SELECT_DATE_RANGE')} />

                    <DatePicker
                        modal
                        open={isDatePickerVisible}
                        date={date_pick || new Date()}
                        mode={"date"}
                        minimumDate={new Date(new Date().setDate(new Date().getDate() - 6))}
                        maximumDate={new Date()}
                        androidVariant={"iosClone"}
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        title={getLanguageValue('ACM_SELECT_DATE')}
                        cancelText={getLanguageValue('ACM_CANCEL')}
                        confirmText={getLanguageValue('ACM_CONFIRM')}
                    />
                    <Spacer space={5} />
                    <View style={{ ...styles.divider, marginLeft: 0, backgroundColor: colors.GRAY_MBORDER }} />
                    <>
                        <View style={[styles.textInput_calender, { flexDirection: 'row' }]}>
                            <Input_Line
                                value={selected_min_date != null && moment(selected_min_date).format('YYYY-MM-DD')}
                                onChange={(val) => { setSelected_min_date(val) }}
                                headerline={`${getLanguageValue('ACM_FROM')}`}
                                txtstyle={{ width: wp(85) }}
                                placeholder={`${getLanguageValue("ACM_SELECT_DATE_FROM_CALENDAR")}`}
                                editable={false}
                            />
                            <TouchableOpacity
                                onPress={() => showMinDatePicker()}
                                style={styles.dateWrapper}>
                                <Image
                                    source={images.calendar_ic}
                                    resizeMode={'contain'}
                                    style={styles.date_ic}
                                />
                            </TouchableOpacity>
                        </View>
                    </>
                    <View style={{ ...styles.divider, marginLeft: 0, backgroundColor: colors.GRAY_MBORDER }} />
                    <>

                        <View style={[styles.textInput_calender, { flexDirection: 'row' }]}>
                            <Input_Line
                                value={selected_max_date != null && moment(selected_max_date).format('YYYY-MM-DD')}
                                onChange={(val) => { setSelected_max_date(val) }}
                                headerline={`${getLanguageValue('ACM_TO')}`}
                                txtstyle={{ width: wp(85) }}
                                placeholder={getLanguageValue('ACM_SELECT_DATE_FROM_CALENDAR')}
                                editable={false}
                            />
                            <TouchableOpacity
                                onPress={() => showMaxDatePicker()}
                                style={styles.dateWrapper}>
                                <Image
                                    source={images.calendar_ic}
                                    resizeMode={'contain'}
                                    style={styles.date_ic}
                                />
                            </TouchableOpacity>
                        </View>
                    </>
                    <View style={{ ...styles.divider, marginLeft: 0, backgroundColor: colors.GRAY_MBORDER }} />
                    <Spacer space={hp(2)} />
                    <View style={{ paddingBottom: hp(isIphoneX() ? 15 : 10) }}>
                        <GradientButton
                            is_blue={true}
                            buttonText={getLanguageValue('ACM_CONFIRM')}
                            buttonPress={() => {
                                if ((Date.parse(selected_max_date) < Date.parse(selected_min_date))) {
                                    Alert.alert(
                                        `${getLanguageValue('ACM_INPUT_INVALID')}`,
                                        `${getLanguageValue('ACM_INVALID_DATE_INPUT')}`,
                                        [
                                            {
                                                text: `${getLanguageValue("ACM_OK")}`,
                                                onPress: () => { },
                                            },
                                        ]
                                    )
                                } else {
                                    onDateConfirm()
                                }
                            }}
                        />
                    </View>
                    <Spacer space={hp(2)} />
                </View>
            </Modal>
        )
    }


    return (
        <>
            <View style={{ ...globalStyles.flex, backgroundColor: colors.BG_COMMON }}>
                {_renderDateRangeModal()}
                <Animated.FlatList
                    onScroll={handleScroll}
                    bounces={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    data={appReducer.get_DocketHistory}
                    ListHeaderComponent={
                        <>
                            <Animated.View >
                                <Header
                                    onChange={(value) => { setSearchVal(value) }}
                                    search_value={searchVal}
                                    headerText={getLanguageValue('ACM_HISTORY')}
                                    placerholder_text={getLanguageValue('ACM_SEARCH_TEXT')}
                                    sub_headerText={moment(new Date()).format("DD MMMM, YYYY")}
                                    onSetting={() => { props.navigation.navigate("Settings") }}
                                    onRefresh={() => {
                                        setFilter('')
                                        dispatch(onGetDocketHistory(generalReducer.userDetails, false))
                                    }}
                                    is_global_search={true}
                                    onGlobalSearch={() => {
                                        setTimeout(() => {
                                            Promise.all([props.navigation.dispatch(CommonActions.reset({
                                                index: 0,
                                                routes: [{ name: 'Deliveries' }],
                                            }))]).then(() =>
                                                setTimeout(() => {
                                                    props.navigation.navigate("GlobalSearch")
                                                }, 250)
                                            )
                                        }, 250);
                                    }}
                                />
                            </Animated.View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ ...styles.filter_wrapper }}>
                                <TouchableOpacity onPress={() => { onSearchHistoryDocket('') }} style={{ ...styles.round_wrapper, position: "relative", width: wp(25), backgroundColor: filter == '' ? colors.REGUAL_BLUE : colors.PIZZAS }}>
                                    <Text style={styles.wrapper_txt}>{getLanguageValue('ACM_ALL')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { onSearchHistoryDocket('accepted') }} style={{ ...styles.round_wrapper, position: "relative", width: wp(25), backgroundColor: filter == 'accepted' ? colors.REGUAL_BLUE : colors.PIZZAS }}>
                                    <Text style={styles.wrapper_txt}>{getLanguageValue('ACM_ACCEPTED')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { onSearchHistoryDocket('rejected') }} style={{ ...styles.round_wrapper, position: "relative", width: wp(25), backgroundColor: filter == 'rejected' ? colors.REGUAL_BLUE : colors.PIZZAS }}>
                                    <Text style={styles.wrapper_txt}>{getLanguageValue('ACM_REJECTED')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { onSearchHistoryDocket('dump') }} style={{ ...styles.round_wrapper, position: "relative", width: wp(25), backgroundColor: filter == 'dump' ? colors.REGUAL_BLUE : colors.PIZZAS }}>
                                    <Text style={styles.wrapper_txt}>{getLanguageValue('ACM_DUMP')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { onSearchHistoryDocket('byShipTo') }} style={{ ...styles.round_wrapper, position: "relative", marginRight: wp(check_permission(HISTORY_LABEL_DATE) ? 0 : 10), width: wp(25), backgroundColor: filter == 'byShipTo' ? colors.REGUAL_BLUE : colors.PIZZAS }}>
                                    <Text style={styles.wrapper_txt}>{getLanguageValue('ACM_SHIP_TO')}</Text>
                                </TouchableOpacity>
                                {check_permission(HISTORY_LABEL_DATE) &&
                                    <TouchableOpacity onPress={() => { setIsRangeVisible(!isRangeVisible) }} style={{ ...styles.round_wrapper, marginRight: wp(10), position: "relative", width: wp(40), justifyContent: "center", flexDirection: "row", backgroundColor: filter == 'byDate' ? colors.REGUAL_BLUE : colors.PIZZAS }}>
                                        <Text style={styles.wrapper_txt}>{moment(selected_min_date).format("DD MMM") + ' - ' + moment(selected_max_date).format("DD MMM")}</Text><Image source={images.down_arrow_ic} style={styles.dropdown_ic} />
                                    </TouchableOpacity>
                                }
                            </ScrollView>
                            <Spacer space={hp(1)} />
                            <View style={styles.f_row}>
                                <Image source={images.completed_ic} style={{ ...styles.ic_complete_left }} />
                                <Text style={{ ...styles.txt_fonts, fontSize: wp(5), alignSelf: "center" }}>{getLanguageValue('ACM_COMPLETED')}</Text>
                            </View>

                            {appReducer.get_DocketHistory && appReducer.get_DocketHistory.length == 0 && emptyContainer()}
                        </>
                    }
                    contentContainerStyle={{ width: wp(100), alignSelf: "center" }}
                    renderItem={filter == 'byShipTo' ? renderShipItem : renderHistoryItem}
                    keyExtractor={(item, index) => index}
                    ListFooterComponent={
                        <Spacer space={hp(2)} />
                    }
                />


                <Animated.View style={[{ ...styles.f_position }, sideAnimation.getLayout()]} >
                    <Header
                        is_shrink
                        onChange={(value) => { setSearchVal(value) }}
                        search_value={searchVal}
                        headerText={getLanguageValue('ACM_HISTORY')}
                        placerholder_text={getLanguageValue('ACM_SEARCH_TEXT')}
                        sub_headerText={moment(new Date()).format("DD MMMM, YYYY")}
                        onSetting={() => { props.navigation.navigate("Settings") }}
                        onRefresh={() => {
                            setFilter('')
                            dispatch(onGetDocketHistory(generalReducer.userDetails, false))
                        }}
                        is_global_search={true}
                        onGlobalSearch={() => {
                            setTimeout(() => {
                                Promise.all([props.navigation.dispatch(CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Deliveries' }],
                                }))]).then(() =>
                                    setTimeout(() => {
                                        props.navigation.navigate("GlobalSearch")
                                    }, 250)
                                )
                            }, 250);
                        }}
                    />
                </Animated.View>
            </View>
        </>
    );
}

