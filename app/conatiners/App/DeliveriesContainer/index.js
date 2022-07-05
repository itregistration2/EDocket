
import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, RefreshControl, Text, Image, TouchableOpacity, Keyboard, Platform } from 'react-native';
// styles and themes
import { Spacer } from '../../../res/spacer';
import globalStyles from '../../../res/globalStyles';
import { Header } from '../../../components/Header';
import { AnimatedTab } from '../../../components/AnimatedTab';
import { DeliveryContent } from '../../../components/DeliveryContent';
import { images } from '../../../res/images';
import { fonts } from '../../../res/fonts';
import { colors } from '../../../res/colors';
import { styles } from './style';
// Third party libraries
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';
import PushNotification from '../PushNotification';

import { useSelector, useDispatch } from 'react-redux';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import { onGetDockets, onGetShipToDockets, onGetDocketsSearch, onGetShipDocketsSearch, onGetGlobalDocketsSearch } from '../../../redux/actions/AppAction';
import { FlatList } from 'react-native-gesture-handler';
import { SEEN_OVERDUE } from '../../../utils/Constants';

export default DeliveriesContainer = (props) => {
    const [type, setType] = useState(1);
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = React.useState(false);
    const [searchVal, setSearchVal] = useState('')
    const [s_random, setRandom] = useState(Math.random())
    const [openOverDue, setOpenOverDue] = useState(false)

    const tabMoveAnimation = React.useMemo(() => new Animated.ValueXY({ x: 0, y: 0 }), [])
    const sideAnimation = React.useMemo(() => new Animated.ValueXY({ x: 0, y: -120 }), [])
    const scrollY = useRef(new Animated.Value(0));
    const generalReducer = useSelector(state => state.generalReducer)
    const appReducer = useSelector(state => state.appReducer)

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
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

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        setSearchVal('')
        setOpenOverDue(false)
        dispatch(onGetDockets(generalReducer.userDetails, false))
        dispatch(onGetShipToDockets(generalReducer.userDetails, false))
        wait(2000).then(() => setRefreshing(false));
    }, []);

    // Change tab request / send
    const onChange = (type, animation_value) => {
        onSearchOngoingDocket(searchVal, type),
            Keyboard.dismiss(),
            setType(type),
            (
                Animated.timing(tabMoveAnimation, {
                    toValue: { x: animation_value, y: 0 },
                    duration: 100,
                    useNativeDriver: false,
                }).start()
            )
    }

    const onSearchOngoingDocket = (param, type) => {
        if (param.trim() != '' && type == 1) {
            dispatch(onGetDocketsSearch(generalReducer.userDetails, param))
        } else if (param.trim() != '' && type == 2) {
            dispatch(onGetShipDocketsSearch(generalReducer.userDetails, param))
        } else {
            dispatch(onGetDockets(generalReducer.userDetails, false))
            dispatch(onGetShipToDockets(generalReducer.userDetails, false))
        }
    }

    const handleScroll = Animated.event(
        [
            {
                nativeEvent: { contentOffset: { y: scrollY.current } },
            },
        ],
        {
            useNativeDriver: false,
            listener: event => {
                //   Keyboard.dismiss()
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

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    useEffect(() => {
        Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustPan();
        global.filterSelect = ''
        const unsubscribe = props.navigation.addListener('focus', () => {
            global.filterSelect = ''
            Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustPan();
        });
        return unsubscribe;
    }, [props.navigation]);


    const renderShipItem = ({ item, index }) => {
        return (
            item.dockets && item.dockets.filter(Fitem => Fitem.STATUS == null).length > 0 ?
                <View key={index}>
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
                            {item.is_open && item.dockets && item.dockets.filter(Fitem => Fitem.STATUS == null)
                                .map((docket_item, index) => {
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
                                                        docket_item.ScannedBy != null ?
                                                            props.navigation.navigate("ScanDetails", { "item": docket_item, "status": docket_item.STATUS, is_home: true })
                                                            :
                                                            props.navigation.navigate("DeliveryDetails", { "item": docket_item })
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
                :
                null
        )
    }

    const renderItem = ({ item, index }) => {
        return (
            item.IsOverdue == false &&
            <View style={{ width: wp(90), alignSelf: "center" }} key={index}>
                <DeliveryContent
                    back_ground={colors.WHITE}
                    index={index}
                    color={item.COLOR}
                    bcolor={item.BCOLOR}
                    label={item.GRADE}
                    ScannedBy={item.ScannedBy}
                    fleet_no={item.THK_TRUCKID}
                    address={item.MIX}
                    docet_no={item.DOCKETID}
                    _onPress={() => {
                        item.ScannedBy != null ?
                            props.navigation.navigate("ScanDetails", { "item": item, "status": item.STATUS, is_home: true })
                            :
                            props.navigation.navigate("DeliveryDetails", { item })
                    }}
                />
                <Spacer space={hp(1.8)} />
            </View>
        )
    }

    const renderOverDueItem = ({ item, index }) => {
        return (
            item.IsOverdue == true &&
            <View style={{ width: wp(90), alignSelf: "center" }} key={index}>
                <DeliveryContent
                    back_ground={colors.WHITE}
                    index={index}
                    color={item.COLOR}
                    bcolor={item.BCOLOR}
                    label={item.GRADE}
                    ScannedBy={item.ScannedBy}
                    fleet_no={item.THK_TRUCKID}
                    address={item.MIX}
                    docet_no={item.DOCKETID}
                    is_overdue={true}
                    _onPress={() => {
                        item.ScannedBy != null ?
                            props.navigation.navigate("ScanDetails", { "item": item, "status": item.STATUS, is_home: true })
                            :
                            props.navigation.navigate("DeliveryDetails", { item })
                    }}
                />
                <Spacer space={hp(1.8)} />
            </View>
        )
    }

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

    return (
        <>
            <View style={globalStyles.flex}>
                <View style={{ flex: 1 }}>
                    <Animated.FlatList
                        bounces={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        onScroll={handleScroll}
                        ListHeaderComponent={
                            <>
                                <Header
                                    onChange={(value) => { setSearchVal(value), onSearchOngoingDocket(value, type) }}
                                    search_value={searchVal}
                                    headerText={getLanguageValue('ACM_DELIVERIES')}
                                    placerholder_text={getLanguageValue('ACM_SEARCH_TEXT')}
                                    sub_headerText={moment(new Date()).format("DD MMMM, YYYY")}
                                    onSetting={() => { props.navigation.navigate("Settings") }}
                                    onRefresh={() => {
                                        setOpenOverDue(false)
                                        dispatch(onGetDockets(generalReducer.userDetails, false))
                                        dispatch(onGetShipToDockets(generalReducer.userDetails, false))
                                    }}
                                    is_global_search={true}
                                    onGlobalSearch={() => { props.navigation.navigate("GlobalSearch") }}
                                />
                                <Spacer space={hp(0.8)} />
                                <PushNotification />
                                <AnimatedTab
                                    tabMoveAnimation={tabMoveAnimation}
                                    onChange={onChange}
                                    type={type}
                                    tab1text={getLanguageValue('ACM_ONGOING')}
                                    tab2text={getLanguageValue('ACM_SHIP_TO')}
                                />
                                {
                                    check_permission(SEEN_OVERDUE) && type == 1 && appReducer.get_Dockets && appReducer.get_Dockets.length != 0 &&
                                    <>
                                        <TouchableOpacity style={styles.overdue_style} onPress={() => { setOpenOverDue(!openOverDue), setRandom(Math.random()) }}>
                                            <Text style={{ ...styles.txt_fonts, color: colors.DARK_RED, fontSize: wp(4), marginLeft: 6 }}>{getLanguageValue("ACM_OVERDUE")}</Text>
                                            <Image source={images.right_arrow} style={{ ...styles.ic_right, marginRight: 4, alignSelf: "center", transform: [{ rotate: openOverDue ? '90deg' : '0deg' }] }} />
                                        </TouchableOpacity>
                                        {
                                            openOverDue &&
                                            <FlatList
                                                showsVerticalScrollIndicator={false}
                                                data={appReducer.get_Dockets}
                                                extraData={s_random}
                                                contentContainerStyle={{ width: wp(100), alignSelf: "flex-end" }}
                                                renderItem={renderOverDueItem}
                                                keyExtractor={(item, index) => index}
                                                ListFooterComponent={
                                                    <Spacer space={hp(5)} />
                                                }
                                            />
                                        }
                                    </>
                                }
                                <Spacer space={hp( check_permission(SEEN_OVERDUE) && type == 1 ? 0.7 : 1.7)} />
                                {type == 1 && appReducer.get_Dockets && appReducer.get_Dockets.length == 0 && emptyContainer()}
                                {type == 2 && appReducer.get_ShipDockets && appReducer.get_ShipDockets.length == 0 && emptyContainer()}
                            </>
                        }
                        showsVerticalScrollIndicator={false}
                        data={type == 1 ? appReducer.get_Dockets : appReducer.get_ShipDockets}
                        extraData={s_random}
                        contentContainerStyle={{ width: wp(100), alignSelf: "flex-end" }}
                        renderItem={type == 1 ? renderItem : renderShipItem}
                        keyExtractor={(item, index) => index}
                        ListFooterComponent={
                            <Spacer space={hp(5)} />
                        }
                    />
                </View>
                <Animated.View style={[{ ...styles.f_position }, sideAnimation.getLayout()]} >
                    <Header
                        is_shrink
                        onChange={(value) => { setSearchVal(value), onSearchOngoingDocket(value, type) }}
                        search_value={searchVal}
                        headerText={getLanguageValue('ACM_DELIVERIES')}
                        placerholder_text={getLanguageValue('ACM_SEARCH_TEXT')}
                        sub_headerText={moment(new Date()).format("DD MMMM, YYYY")}
                        onSetting={() => { props.navigation.navigate("Settings") }}
                        onRefresh={() => {
                            dispatch(onGetDockets(generalReducer.userDetails, false))
                            dispatch(onGetShipToDockets(generalReducer.userDetails, false))
                        }}
                        is_global_search={true}
                        onGlobalSearch={() => { props.navigation.navigate("GlobalSearch") }}
                    />
                </Animated.View>
            </View>
        </>
    );
}

