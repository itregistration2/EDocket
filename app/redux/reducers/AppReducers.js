import * as types from "../events/AppEvents";

const initialState = {
    get_Dockets: [],
    get_ShipDockets: [],
    get_DocketHistory: [],
    get_this_Docket: [],
    get_this_language: [],
    get_global_search_data: []
}

export function appReducer(state = initialState, action) {
    switch (action.type) {
        case types.GET_DOCKETS:
            return {
                ...state,
                get_Dockets: action.get_Dockets
            }
        case types.GET_SHIPTODOCKETS:
            return {
                ...state,
                get_ShipDockets: action.get_ShipDockets
            }
        case types.GET_DOCKET_HISTORY:
            return {
                ...state,
                get_DocketHistory: action.get_DocketHistory
            }
        case types.GET_THIS_DOCKET:
            return {
                ...state,
                get_this_Docket: action.get_this_Docket
            }
        case types.GET_THIS_LANGUAGE:
            return {
                ...state,
                get_this_language: action.get_this_language
            }
        case types.GET_GLOBAL_SEARCH_DATA:
            return {
                ...state,
                get_global_search_data: action.get_global_search_data
            }
        default:
            return state
    }
}
