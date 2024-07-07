import {
    AUTH_LOG_OUT,
    AUTH_LOG_IN_SUCCESS,
    AUTH_SIGN_UP_SUCCESS,
    CREATE_TICKET,
    ASSISTANT_CLOCK
} from "./types";

const authInitialState = {
    loading: false,
    isAuthenticated: false,
    token: "",
    roleid: "",
    phoneNo: "",
    userId: "",
    name: "",
    isTicketCreated: false,
    isClockedIn: false
};


const authReducer = (state = authInitialState, { type, payload }) => {
    console.log('authReducer type', type);
    console.log('authReducer payload', payload)

    switch (type) {
        case AUTH_SIGN_UP_SUCCESS: {
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                token: payload.token,
                roleid: payload.roleid,
                phoneNo: payload.phoneNo,
                userId: payload.userId,
                name: payload.name
            };
        }
        case AUTH_LOG_IN_SUCCESS: {
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                token: payload.token,
                roleid: payload.roleid,
                phoneNo: payload.phoneNo,
                userId: payload.userId,
                name: payload.name
            };
        }
        case AUTH_LOG_OUT: {
            return {
                loading: false,
                isAuthenticated: false,
                token: "",
                location: "",
                roleid: "",
                phoneNo: "",
                userId: "",
                name: ""

            };
        }
        case CREATE_TICKET: {
            return {
                ...state,
                isTicketCreated: payload.isTicketCreated,
            };
        }
        case ASSISTANT_CLOCK: {
            return {
                ...state,
                isClockedIn: payload.isClockedIn,
            };
        }

        default: {
            return state;
        }
    }
};


export default authReducer;
