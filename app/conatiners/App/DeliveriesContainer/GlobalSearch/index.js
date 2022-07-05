
import React, { useEffect, useState, useRef } from 'react';
import { View, Animated, ScrollView, Text, Image, TouchableOpacity, Platform } from 'react-native';
// styles and themes
import { Spacer } from '../../../../res/spacer';
import globalStyles from '../../../../res/globalStyles';
import { Header } from '../../../../components/Header';
import { DeliveryContent } from '../../../../components/DeliveryContent';
import { images } from '../../../../res/images';
import { fonts } from '../../../../res/fonts';
import { colors } from '../../../../res/colors';
import { styles } from './style';
import { fmtMSS } from '../../../../utils/Constants'
// Third party libraries
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import { onGetGlobalDocketsSearch } from '../../../../redux/actions/AppAction';


export default DeliveriesContainer = (props) => {
    const dispatch = useDispatch();
    const [globalsearchVal, setGlobalSearchVal] = useState('')
    const [s_random, setRandom] = useState(Math.random())
    const sideAnimation = React.useMemo(() => new Animated.ValueXY({ x: 0, y: -120 }), [])
    const scrollY = useRef(new Animated.Value(0));
    const [filter, setFilter] = useState('')
    const generalReducer = useSelector(state => state.generalReducer)
    const appReducer = useSelector(state => state.appReducer)

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
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
        dispatch(onGetGlobalDocketsSearch(generalReducer.userDetails, '', filter))
        Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustPan();
        const unsubscribe = props.navigation.addListener('focus', () => {
            Platform.OS == "android" && AndroidKeyboardAdjust.setAdjustPan();
        });
        return unsubscribe;
    }, [props.navigation]);


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


    // useEffect(() => {
    //     console.log(globalsearchVal)
    // }, [globalsearchVal, filter]);



    const onGlobalSearchValue = (filter_param) => {
        setFilter(filter_param)
        dispatch(onGetGlobalDocketsSearch(generalReducer.userDetails, globalsearchVal.trim(), filter_param))
    }

    // empty container
    const resultContainer = () => {
        return (
            <View style={{ alignSelf: "center" }}>
                <Spacer space={hp(3)} />
                <Image source={images.search_empty} style={styles.ic_dock} />
                <Spacer space={hp(1)} />
                <Text style={{ ...styles.txt_fonts, color: colors.MANATEE, fontFamily: fonts.REGULAR }}>{getLanguageValue('ACM_NO_RESULTS_FOUND')}</Text>
            </View>
        )
    }

    const renderGlobalItem = ({ item, index }) => {
        return (
            <View style={{ width: wp(90), alignSelf: "center", paddingVertical: wp(2.5) }} key={index}>
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

            </View>
        )
    }

    const renderGlobalShipItem = ({ item, index }) => {
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
                            <Text style={styles.txt_regular_fonts}>{`${getLanguageValue('ACM_THIS_LOAD')}: ` + item.DLVQTY + " " + (item.STATUS == "dump" ? `(${getLanguageValue('ACM_RETURN')} ${item.DumpQty != null && item.DumpQty != '' && item.DumpQty > 0 ? item.DumpQty : 0})` : item.STATUS == "rejected" ? `(${getLanguageValue('ACM_REJECTED_2')} ${item.RejectQty != null && item.RejectQty != '' && item.RejectQty > 0 ? item.RejectQty : 0})` : '')}</Text>
                            <Text style={styles.txt_regular_fonts}>{getLanguageValue('ACM_CUM_TOTAL_2') + ' ' + item.QTYCUMTOTAL}</Text>
                            <Text style={styles.txt_regular_fonts}>{getLanguageValue('ACM_PLANT_2') + ' ' + item.PLANTID}</Text>
                            <Text style={styles.txt_regular_fonts}>{getLanguageValue("ACM_TC_3") + ' ' + (item.TemperatureControl == null ? '' : item.TemperatureControl)}</Text>
                            {item.STATUS == "dump" && <Text style={{ ...styles.txt_regular_fonts, opacity: 0.4 }}>{`${getLanguageValue('ACM_REQUEST_DUMP_RETURN_SIGN') + ' '} ${item.DumpedBy}`}</Text>}
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

    return (
        <>
            <View style={globalStyles.flex}>
                <View style={{ ...globalStyles.flex, backgroundColor: colors.BG_COMMON }}>
                    <Animated.FlatList
                        onScroll={handleScroll}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        data={null}
                        ListHeaderComponent={
                            <>
                                <Animated.View >
                                    <Header
                                        is_shrink
                                        onSearchClear={() => { setGlobalSearchVal(''), onGlobalSearchValue(filter) }}
                                        onChange={(value) => { setGlobalSearchVal(value) }}
                                        search_value={globalsearchVal}
                                        headerText={getLanguageValue('ACM_DELIVERIES')}
                                        placerholder_text={getLanguageValue('ACM_SEARCH_TEXT')}
                                        sub_headerText={moment(new Date()).format("DD MMMM, YYYY")}
                                        onSetting={() => { props.navigation.navigate("Settings") }}
                                        onSubmitEditing={() => { onGlobalSearchValue(filter) }}
                                    />
                                </Animated.View>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ ...styles.filter_wrapper }}>
                                    <TouchableOpacity onPress={() => { onGlobalSearchValue('') }} style={{ ...styles.round_wrapper, position: "relative", width: wp(25), backgroundColor: filter == '' ? colors.REGUAL_BLUE : colors.PIZZAS }}>
                                        <Text numberOfLines={1} style={styles.wrapper_txt}>{getLanguageValue('ACM_ALL')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { onGlobalSearchValue('byTruckId') }} style={{ ...styles.round_wrapper, position: "relative", width: wp(25), backgroundColor: filter == 'byTruckId' ? colors.REGUAL_BLUE : colors.PIZZAS }}>
                                        <Text numberOfLines={1} style={styles.wrapper_txt}>{getLanguageValue('ACM_FLEET_NO_2')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { onGlobalSearchValue('byDocketId') }} style={{ ...styles.round_wrapper, position: "relative", width: wp(25), backgroundColor: filter == 'byDocketId' ? colors.REGUAL_BLUE : colors.PIZZAS }}>
                                        <Text numberOfLines={1} style={styles.wrapper_txt}>{getLanguageValue('ACM_DOCKET_NO_2')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { onGlobalSearchValue('byShipTo') }} style={{ ...styles.round_wrapper, position: "relative", width: wp(25), backgroundColor: filter == 'byShipTo' ? colors.REGUAL_BLUE : colors.PIZZAS, marginRight: wp(10) }}>
                                        <Text numberOfLines={1} style={styles.wrapper_txt}>{getLanguageValue('ACM_SHIP_TO')}</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                                <Spacer space={hp(1)} />

                                {/* {globalsearchVal == '' && appReducer.get_global_search_data && appReducer.get_global_search_data.filter((e) => { return e.STATUS == null }).length == 0 && resultContainer()} */}

                                {globalsearchVal != '' && appReducer.get_global_search_data && appReducer.get_global_search_data.length > 0 ?
                                    <>
                                        <Animated.FlatList
                                            bounces={false}
                                            showsVerticalScrollIndicator={false}
                                            data={appReducer.get_global_search_data && appReducer.get_global_search_data.filter((e) => { return e.STATUS == null })}
                                            ListHeaderComponent={
                                                <>
                                                    <View style={styles.f_row}>
                                                        <Image source={images.send_progress} style={{ ...styles.ic_complete_left }} />
                                                        <Text style={{ ...styles.txt_fonts, fontSize: wp(5), alignSelf: "center" }}>{getLanguageValue('ACM_ONGOING')}</Text>
                                                    </View>
                                                    {appReducer.get_global_search_data && appReducer.get_global_search_data.filter((e) => { return e.STATUS == null }).length == 0 && emptyContainer()}
                                                </>
                                            }
                                            contentContainerStyle={{ width: wp(100), alignSelf: "center", backgroundColor: colors.WHITE }}
                                            renderItem={filter == 'byShipTo' ? renderGlobalShipItem : renderGlobalItem}
                                            listKey={(item, index) => `_key${index.toString()}`}
                                            keyExtractor={(item, index) => `_key${index.toString()}`}
                                            style={{ backgroundColor: colors.WHITE }}
                                        />
                                        <Spacer space={hp(1)} />
                                        <Animated.FlatList
                                            bounces={false}
                                            showsVerticalScrollIndicator={false}
                                            data={appReducer.get_global_search_data && appReducer.get_global_search_data.filter((e) => { return e.STATUS != null })}
                                            ListHeaderComponent={
                                                <>
                                                    <View style={styles.f_row}>
                                                        <Image source={images.completed_ic} style={{ ...styles.ic_complete_left }} />
                                                        <Text style={{ ...styles.txt_fonts, fontSize: wp(5), alignSelf: "center" }}>{getLanguageValue('ACM_COMPLETED')}</Text>
                                                    </View>
                                                    {appReducer.get_global_search_data && appReducer.get_global_search_data.filter((e) => { return e.STATUS != null }).length == 0 && emptyContainer()}
                                                </>
                                            }
                                            contentContainerStyle={{ width: wp(100), alignSelf: "center" }}
                                            renderItem={renderHistoryItem}
                                            listKey={(item, index) => `_key${index.toString()}`}
                                            keyExtractor={(item, index) => `_key${index.toString()}`}
                                            ListFooterComponent={
                                                <Spacer space={hp(2)} />
                                            }
                                        />
                                    </>
                                    :
                                    resultContainer()
                                }
                            </>
                        }
                        contentContainerStyle={{ width: wp(100), alignSelf: "center" }}
                        renderItem={null}
                        keyExtractor={(item, index) => index}
                        ListFooterComponent={
                            <Spacer space={hp(2)} />
                        }
                    />
                </View>

            </View>
        </>
    );
}

