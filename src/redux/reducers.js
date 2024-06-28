import {
    AUTH_LOG_OUT,
    AUTH_LOG_IN_SUCCESS,
    AUTH_SIGN_UP_SUCCESS
} from "./types";

const authInitialState = {
    loading: false,
    isAuthenticated: false,
    token: "",
    roleid: "",
    phoneNo: "",

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
                phoneNo: payload.phoneNo
            };
        }
        case AUTH_LOG_IN_SUCCESS: {
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                token: payload.token,
                roleid: payload.roleid,
                phoneNo: payload.phoneNo
            };
        }
        case AUTH_LOG_OUT: {
            return {
                loading: false,
                isAuthenticated: false,
                token: "",
                location: "",
                roleid: "",
                phoneNo: ""

            };
        }

        default: {
            return state;
        }
    }
};


export default authReducer;
