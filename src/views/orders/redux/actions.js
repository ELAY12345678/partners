import * as actionTypes from './constants';

export const setSetEstablishmentFilters = (payload) => {
    return {
        payload,
        type: actionTypes.SET_ESTABLISHMENT_FILTERS,
    }
}
export const setCurrentReservationDetails = (payload) => {
    return {
        payload,
        type: actionTypes.SET_CURRENT_RESERVATION_DETAILS,
    }
}

export const updateCurrentReservationDetails = (payload) => {
    return {
        payload,
        type: actionTypes.UPDATE_CURRENT_RESERVATION_DETAILS,
    }
}

export const setReservationsDatas = (payload) => {
    return {
        payload,
        type: actionTypes.SET_RESERVATIONS_DATAS
    }
}

export const changeRefresh = (payload) => {
    return {
        payload,
        type: actionTypes.CHANGE_REFRESH
    }
}

export const setAppartaPayDatas = (payload) => {
    return {
        payload,
        type: actionTypes.SET_APPARTA_PAY_DATAS
    }
}

export const changeAppartaPayRefresh = (payload) => {
    return {
        payload,
        type: actionTypes.CHANGE_APPARTA_PAY_REFRESH
    }
}

export const changeUserFilter = (payload) => {
    return {
        payload,
        type: actionTypes.CHANGE_USER_FILTER
    }
}

export const changePanelSize = (payload) => {
    return {
        payload,
        type: actionTypes.CHANGE_PANEL_SIZE
    }
}

export const changeReportPerDaysOfWeek = (payload) => {
    return {
        payload,
        type: actionTypes.CHANGE_REPORT_PER_DAYS_OF_WEEK
    }
}