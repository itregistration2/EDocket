
import * as auth_types from "../redux/events/GeneralEvents";
import BaseClass from "../utils/BaseClass";

const Base = new BaseClass();

export const GET = (url, dispatch, callBack) => {
    fetch(url, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    }).then(response => response.json())
        .then(response => {
            dispatch({ type: auth_types.APP_LOADER, flag: false });
            let responseData = response;
            if (responseData != null) {
                callBack({ status: true, responseData });
            } else {
                callBack({ status: false, responseData: { 'message': "Invalid Credential" } });
            }
        })
        .catch(err => {
            dispatch({ type: auth_types.APP_LOADER, flag: false });
            console.log("Error", err)
            callBack({ status: false, responseData: { 'message': 'Something went wrong..' } });
        });
}


export const GET_WITHOUT_LOAD = (url, callBack) => {
    fetch(url, {
        method: "GET",
        headers: {
            "content-type": "application/json; charset=utf-8",
        },
    }).then(response => response.json())
        .then(response => {
            let responseData = response;
            if (responseData != null) {
                callBack({ status: true, responseData });
            } else {
                callBack({ status: false, responseData: { 'message': "Invalid Credential" } });
            }
        })
        .catch(err => {
            console.log(err)
            callBack({ status: false, responseData: { 'message': 'Something went wrong..' } });
        });
}



export const POST_MULTIPART_DATA = async (url, requestBody, dispatch, callBack) => {
    dispatch({ type: auth_types.APP_LOADER, flag: true });
    fetch(url, {
        method: "POST",
        body: requestBody,
        headers: {  "content-type": "application/json; charset=utf-8", }
    }).then(response => response.json())
        .then(response => {
            let responseData = response;
            dispatch({ type: auth_types.APP_LOADER, flag: false });
            callBack(responseData);
        })
        .catch(err => {
            dispatch({ type: auth_types.APP_LOADER, flag: false });
            callBack({ status: false, responseData: { 'message': 'Something went wrong..' } });
        });
}

export const POST = async (url, requestBody, callBack) => {
    fetch(url, {
        method: "POST",
        body: requestBody,
    }).then(response => response.json())
        .then(response => {
            let responseData = response;
            callBack({ status: response.status, responseData });
        })
        .catch(err => {
            console.log("Error", err)
            callBack({ status: false, responseData: { 'message': 'Something went wrong..' } });
        });
}

export const POST_MULTIPART = async (url, requestBody, dispatch, callBack) => {
    dispatch({ type: auth_types.APP_LOAD, value: true })
    fetch(url, {
        method: "POST",
        body: requestBody,
        headers: { 'Accept': 'application/json', }
    }).then(response => response.json())
        .then(response => {
            dispatch({ type: auth_types.APP_LOAD, value: false })
            let responseData = response;
            if (!responseData.success) {
                setTimeout(() => {
                    Base.showToastAlert(responseData.message)
                }, 500);
            } else {
                callBack(responseData);
            }
        })
        .catch(err => {
            dispatch({ type: auth_types.APP_LOAD, value: false })
            callBack({ status: false, responseData: { 'message': 'Something went wrong..' } });
        });
}


export const GET_LOAD = (url, token, dispatch, callBack) => {
    dispatch({ type: auth_types.APP_LOAD, value: true })
    fetch(url, {
        method: "GET",
        headers: { 'Accept': 'application/json', 'Authorization': 'Bearer ' + token }
    }).then(response => response.json())
        .then(response => {
            dispatch({ type: auth_types.APP_LOAD, value: false })
            let responseData = response;
            callBack({ status: response.status, responseData });
        })
        .catch(err => {
            dispatch({ type: auth_types.APP_LOAD, value: false })
            console.log("Error", err)
            callBack({ status: false, responseData: { 'message': 'Something went wrong..' } });
        });
}
