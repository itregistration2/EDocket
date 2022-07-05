import * as types from "../events/GeneralEvents";

const initialState = {
    selectedScreen: '',
    userData: undefined,
    phone_response: [],
    app_load: false,
    userDetails: null,
    appLoading: false,
}

export function generalReducer(state = initialState, action) {
    switch (action.type) {
        case types.TYPE_SAVE_SELECTED_SCREEN:
            return Object.assign({}, state, {
                selectedScreen: action.value,
            })
        case types.TYPE_SAVE_USER_DATA:
            return Object.assign({}, state, {
                userData: action.value,
            })
        case types.APP_LOAD:
            return Object.assign({}, state, {
                app_load: action.value,
            })
        case types.TYPE_CLEAR_USER_DATA:
            return Object.assign({}, state, {
                userData: undefined,
            })
        case types.PHONE_VERIFICATION:
            return Object.assign({}, state, {
                phone_response: action.phone_response,
            })
        case types.CUSTOMER_LOGIN:
            return {
                ...state,
                userDetails: action.userDetails
            }
        case types.APP_LOADER:
            return {
                ...state,
                appLoading: action.flag
            }
        default:
            return state
    }
}
