import { saveData } from "../../utils/AsyncStorageHelper";
import * as types from "../events/GeneralEvents";
import { CUSTOMER_LOGIN, POST_LOGIN_BY_OTP } from "../../apiHelper/Api"
import { GET, POST_MULTIPART_DATA } from "../../apiHelper/ApiServices"
import { Platform } from "react-native";
import { showAlertWithMessageClick } from "../../utils/Constants";
import BaseClass from "../../utils/BaseClass";

const Base = new BaseClass();

export const onSaveSelectedScreen = (data) => {
    return async dispatch => {
        if (data) {
            dispatch({ type: types.TYPE_SAVE_SELECTED_SCREEN, value: data })
        }
    }
}

export const onSaveUserDataInRedux = (data) => {
    return async dispatch => {
        if (data) {
            dispatch({ type: types.TYPE_SAVE_USER_DATA, value: data })
        }
    }
}

export const clearUserDataInRedux = () => {
    return async dispatch => {
        dispatch({ type: types.TYPE_CLEAR_USER_DATA })
    }
}


export const storeAsyncUserDetails = (userDetails) => {
    return async dispatch => {
        dispatch({ type: types.CUSTOMER_LOGIN, userDetails });
    }
}

export const clearAsyncUserDetails = () => {
    return async dispatch => {
        dispatch({ type: types.CUSTOMER_LOGIN, userDetails: null });
    }
}

const storeUserDetails = (response, dispatch) => {
    saveData('userDetails', response);
    dispatch({ type: types.CUSTOMER_LOGIN, userDetails: response });
}


export const onCustomerLogin = (authRequest, callBack) => {
    return async dispatch => {
        dispatch({ type: types.APP_LOADER, flag: true });
        let platform = Platform.OS == "ios" ? "IOS" : "ANDROID"
        await GET(CUSTOMER_LOGIN + `?username=${authRequest.username}&password=${authRequest.password}&token=${authRequest.token}&platform=${platform}`, dispatch, function (response) {
            if (response.status) {
                dispatch({ type: types.APP_LOADER, flag: false });
                if (response.responseData.isInvalidEmail) {
                    setTimeout(() => {
                        showAlertWithMessageClick(global.LanguageSelect == "zh" ? "找不到該電子郵件的帳戶" : "We could'nt find an account for that email", global.LanguageSelect == "zh" ? '電郵帳號不正確，請檢查錯別字。 如果您是此應用程式用戶，請與我們的銷售人員聯繫。' : 'Incorrect email account, please check the typos. if you are new to this app, please contact our sales for signup.', global.LanguageSelect == "zh" ? '重試' : 'Try again');
                    }, 500);
                } else if (response.responseData.isInvalidEmail == false && response.responseData.isInvalidPassword == true) {
                    setTimeout(() => {
                        showAlertWithMessageClick(global.LanguageSelect == "zh" ? "密碼錯誤" : "Incorrect password", global.LanguageSelect == "zh" ? "密碼錯誤。 請重新輸入，然後重試。" : 'Incorrect password. Please reenter your password and try again.', 'OK');
                    }, 500);
                } else if (response.responseData.permissions == "") {
                    setTimeout(() => {
                        showAlertWithMessageClick(global.LanguageSelect == "zh" ? "權限" : "Permission", global.LanguageSelect == "zh" ? "您沒有權限訪問此應用程式" : "You don't have permissions to access this app", 'OK');
                    }, 500);
                }
                else {
                    dispatch({ type: types.APP_LOADER, flag: false });
                    callBack(response.responseData)
                    storeUserDetails(response.responseData, dispatch);
                }
            }
        });

    }
}

export const onCustomerLoginOtp = (requestBody, callBack) => {
    return async dispatch => {
        dispatch({ type: types.APP_LOADER, flag: true });
        await POST_MULTIPART_DATA(POST_LOGIN_BY_OTP, requestBody, dispatch, function (response) {
         
            dispatch({ type: types.APP_LOADER, flag: false });
            if (response.isInvalidEmail == false && response.isInvalidPassword == true) {
                setTimeout(() => {
                    showAlertWithMessageClick(global.LanguageSelect == "zh" ? "密碼錯誤" : "Incorrect otp", global.LanguageSelect == "zh" ? "請檢查短訊並取得一次性密碼,然後重試" : 'Please check OTP in your SMS and try again', 'OK');
                }, 500);
            } else if (response.permissions == "") {
                setTimeout(() => {
                    showAlertWithMessageClick(global.LanguageSelect == "zh" ? "權限" : "Permission", global.LanguageSelect == "zh" ? "您沒有權限訪問此應用程式" : "You have not permission to access this app.", 'OK');
                }, 500);
            }
            else {
                dispatch({ type: types.APP_LOADER, flag: false });
                callBack(response)
                storeUserDetails(response, dispatch);
            }
        });

    }
}
