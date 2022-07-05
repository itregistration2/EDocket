import * as types from "../events/AppEvents";
import { GET_DOCKETS, GET_DOCKET_GLOBAL_SEARCH, GET_DOCKET_HISTORY, GET_SHIP_TO_DOCKETS, GET_DOCKET_PDF, UPDATE_DOCKET, GET_THIS_DOCKET, GET_LANGUAGE_JSON, GET_TEST_RANGE, GET_CSC_PHONE, POST_ASK_FOR_OTP, GET_OTP_FOR_TEST_ONLY, CHECK_VERSION, POST_LOGOUT } from "../../apiHelper/Api"
import { GET, GET_WITHOUT_LOAD, POST_MULTIPART_DATA } from "../../apiHelper/ApiServices"
import { APP_LOADER } from "../events/GeneralEvents";
import { Platform } from "react-native";

export const onGetDockets = (authRequest, is_load) => {
    return async dispatch => {
        if (is_load) {
            dispatch({ type: APP_LOADER, flag: true });
            await GET(GET_DOCKETS + `?username=${authRequest.username}`, dispatch, function (response) {
                dispatch({ type: APP_LOADER, flag: false });
                if (response.status) {
                    let result = response && response.responseData.filter((e) => { return e.STATUS == null  });
                    dispatch({ type: types.GET_DOCKETS, get_Dockets: result })
                }
            });
        } else {
            await GET_WITHOUT_LOAD(GET_DOCKETS + `?username=${authRequest.username}`, function (response) {
                if (response.status) {
                    let result = response && response.responseData.filter((e) => { return e.STATUS == null });
                    dispatch({ type: types.GET_DOCKETS, get_Dockets: result })
                }
            });
        }
    }
}

// for search ongoing data
export const onGetDocketsSearch = (authRequest, search_param) => {
    return async dispatch => {
        await GET_WITHOUT_LOAD(GET_DOCKETS + `?username=${authRequest.username}&searchStr=${search_param}`, function (response) {
            if (response.status) {
                let result = response && response.responseData.filter((e) => { return e.STATUS == null });
                dispatch({ type: types.GET_DOCKETS, get_Dockets: result })
            }
        });
    }
}


export const onGetShipToDockets = (authRequest, is_load) => {
    return async dispatch => {
        if (is_load) {
            dispatch({ type: APP_LOADER, flag: true });
            await GET(GET_SHIP_TO_DOCKETS + `?username=${authRequest.username}`, dispatch, function (response) {
                dispatch({ type: APP_LOADER, flag: false });
                if (response.status) {
                    dispatch({ type: types.GET_SHIPTODOCKETS, get_ShipDockets: response.responseData })
                }
            });
        } else {
            await GET_WITHOUT_LOAD(GET_SHIP_TO_DOCKETS + `?username=${authRequest.username}`, function (response) {
                if (response.status) {
                    dispatch({ type: types.GET_SHIPTODOCKETS, get_ShipDockets: response.responseData })
                }
            });
        }
    }
}


// for search ship data
export const onGetShipDocketsSearch = (authRequest, search_param) => {
    return async dispatch => {
        await GET_WITHOUT_LOAD(GET_SHIP_TO_DOCKETS + `?username=${authRequest.username}&searchStr=${search_param}`, function (response) {
            if (response.status) {
                dispatch({ type: types.GET_SHIPTODOCKETS, get_ShipDockets: response.responseData })
            }
        });
    }
}

export const onGetDocketHistory = (authRequest, is_load) => {
    return async dispatch => {
        if (is_load) {
            dispatch({ type: APP_LOADER, flag: true });
            await GET(GET_DOCKET_HISTORY + `?username=${authRequest.username}`, dispatch, function (response) {
                dispatch({ type: APP_LOADER, flag: false });
                if (response.status) {
                    dispatch({ type: types.GET_DOCKET_HISTORY, get_DocketHistory: response.responseData })
                }
            });
        } else {
            await GET_WITHOUT_LOAD(GET_DOCKET_HISTORY + `?username=${authRequest.username}`, function (response) {
                if (response.status) {
                    dispatch({ type: types.GET_DOCKET_HISTORY, get_DocketHistory: response.responseData })
                }
            });
        }
    }
}



// for search history data
export const onGetDocketsHistorySearch = (authRequest, search_param, is_date) => {
    return async dispatch => {
        let url = '';
        dispatch({ type: APP_LOADER, flag: true });
        if (is_date) {
            url = GET_DOCKET_HISTORY + `?username=${authRequest.username}&dateFrom=${search_param.dateFrom}&dateTo=${search_param.dateTo}`;
        } else {
            url = search_param == 'byShipTo' ? GET_DOCKET_HISTORY + `?username=${authRequest.username}&searchButtonStr=${search_param}` : GET_DOCKET_HISTORY + `?username=${authRequest.username}&searchStr=${search_param}`;
        }
        await GET_WITHOUT_LOAD(url, function (response) {
            dispatch({ type: APP_LOADER, flag: false });
            if (response.status) {
                dispatch({ type: types.GET_DOCKET_HISTORY, get_DocketHistory: response.responseData })
            }
        });
    }
}


export const onGetDocketFile = (dockent_no, callback) => {
    return async dispatch => {
        await GET(GET_DOCKET_PDF + `?fileName=${dockent_no}`, dispatch, function (response) {
            callback(response)
        });
    }
}


export const onGetAppVersion = (callback) => {
    return async dispatch => {
        await GET(CHECK_VERSION + `?platform=${Platform.OS == "ios" ? "IOS" : "android"}&version=1.0.1`, dispatch, function (response) {
            callback(response)
        });
    }
}

export const onPostDocketFileUpdate = (param, requestBody, callback) => {
    return async dispatch => {
        await POST_MULTIPART_DATA(UPDATE_DOCKET + `?user=${param.user}&docketno=${param.docketno}&action=${param.action}&phone=${param.phone}&online=${param.online}`, requestBody, dispatch, function (response) {
            callback(response)
        });
    }
}

export const onPostAskForOtp = (requestBody, callback) => {
    return async dispatch => {
        await POST_MULTIPART_DATA(POST_ASK_FOR_OTP, requestBody, dispatch, function (response) {
            callback(response)
        });
    }
}

export const onGetOtpForTest = (phone, callback) => {
    return async dispatch => {
        await GET(GET_OTP_FOR_TEST_ONLY + `?Phone=${phone}`, dispatch, function (response) {
            callback(response)
        });
    }
}

export const onGetThisDockets = (authRequest, callback) => {
    return async dispatch => {
        await GET_WITHOUT_LOAD(GET_THIS_DOCKET + `?docketno=${authRequest.docketno}`, function (response) {
            if (response.status) {
                callback(response.responseData)
                dispatch({ type: types.GET_THIS_DOCKET })
            }
        });
    }
}

export const onGetThisDocketsQrCode = (authRequest, callback) => {
    return async dispatch => {
        await GET_WITHOUT_LOAD(GET_THIS_DOCKET + `?docketno=${authRequest.docketno}`, function (response) {
            if (response.status) {
                callback(response.responseData)
                dispatch({ type: types.GET_THIS_DOCKET })
            }else{
                callback(null)
            }
        });
    }
}

export const onGetImageDockets = (url, callback) => {
    return async dispatch => {
        await GET_WITHOUT_LOAD(url, function (response) {
            if (response.status) {
                callback(response.responseData)
            }
        });
    }
}

// get Housing QR data 
export const onGetHousingQRData = (url, callback) => {
    return async dispatch => {
        await GET_WITHOUT_LOAD(url, function (response) {
            if (response.status) {
                callback(response.responseData)
            }
        });
    }
}

// get language json data
export const onGetLanguageJsonData = () => {
    return async dispatch => {
        await GET_WITHOUT_LOAD(GET_LANGUAGE_JSON + `?lang=${global.LanguageSelect}`, function (response) {
            if (response.status) {
                dispatch({ type: types.GET_THIS_LANGUAGE, get_this_language: response.responseData })
            }
        });
    }
}


// get test range
export const onGetTestRange = (type, callback) => {
    return async dispatch => {
        await GET_WITHOUT_LOAD(GET_TEST_RANGE + `?type=${type}`, function (response) {
            if (response.status) {
                callback(response.responseData)
            }
        });
    }
}


// for search global data
export const onGetGlobalDocketsSearch = (authRequest, searchTextStr, searchButtonStr) => {
    return async dispatch => {
        let url = GET_DOCKET_GLOBAL_SEARCH + `?username=${authRequest.username}`;
        let final_url = (searchTextStr != '' && searchButtonStr != '') ? url + `&searchTextStr=${searchTextStr}&searchButtonStr=${searchButtonStr}` : searchButtonStr != '' ? url + `&searchButtonStr=${searchButtonStr}` : url + `&searchTextStr=${searchTextStr}`;
        dispatch({ type: APP_LOADER, flag: true });
        await GET(final_url, dispatch, function (response) {
            if (response.status) {
                dispatch({ type: APP_LOADER, flag: false })
                dispatch({ type: types.GET_GLOBAL_SEARCH_DATA, get_global_search_data: response.responseData })
            } else {
                dispatch({ type: APP_LOADER, flag: false });
                dispatch({ type: types.GET_GLOBAL_SEARCH_DATA, get_global_search_data: [] })
            }
        });
    }
}

// get test range
export const onGetCscPhone = (callback) => {
    return async dispatch => {
        await GET_WITHOUT_LOAD(GET_CSC_PHONE, function (response) {
            if (response.status) {
                callback(response.responseData)
            }
        });
    }
}

export const onCustomerLogoutOtp = (requestBody, callback) => {
    return async dispatch => {
        dispatch({ type: APP_LOADER, flag: true });
        await POST_MULTIPART_DATA(POST_LOGOUT, requestBody, dispatch, function (response) {
            dispatch({ type: APP_LOADER, flag: false });
            if (response.response.IsSuccessful) {
               callback(response)
            }
        });
    }
}



