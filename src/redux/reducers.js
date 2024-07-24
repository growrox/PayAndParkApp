import {
    AUTH_LOG_OUT,
    AUTH_LOG_IN_SUCCESS,
    AUTH_SIGN_UP_SUCCESS,
    CREATE_TICKET,
    ASSISTANT_CLOCK,
    SUPER_SETTLED_AMOUNT
} from "./types";

const authInitialState = {
    loading: false,
    isAuthenticated: false,
    token: "",
    role: "",
    phoneNo: "",
    userId: "",
    name: "",
    code: "",
    isTicketCreated: false,
    isClockedIn: false,
    isTicketSuperVisorSettled: false,
    shiftDetails: {},
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
                role: payload.role,
                phoneNo: payload.phoneNo,
                userId: payload.userId,
                name: payload.name,
                code: payload.code
            };
        }
        case AUTH_LOG_IN_SUCCESS: {
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                token: payload.token,
                role: payload.role,
                phoneNo: payload.phoneNo,
                userId: payload.userId,
                name: payload.name,
                code: payload.code
            };
        }
        case AUTH_LOG_OUT: {
            return {
                loading: false,
                isAuthenticated: false,
                token: "",
                location: "",
                role: "",
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
                shiftDetails: payload.shiftDetails
            };
        }
        case SUPER_SETTLED_AMOUNT: {
            return {
                ...state,
                isTicketSuperVisorSettled: payload.isTicketSuperVisorSettled,
            };
        }

        default: {
            return state;
        }
    }
};


export default authReducer;
