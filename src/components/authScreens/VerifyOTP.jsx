import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, TextInput, View, StyleSheet, ActivityIndicator } from 'react-native';
import MainComponent from './MainComponent';
import { useToast } from "react-native-toast-notifications";
import { useDispatch } from 'react-redux';
import { AUTH_LOG_IN_SUCCESS } from '../../redux/types';
import {
    getHash, removeListener,
    startOtpListener,
} from 'react-native-otp-verify';
import { url } from '../../utils/url';

const VerifyOTP = ({ navigation, route }) => {
    const { phoneNo, otpFromResponse } = route.params;
    const [OTP, setOTP] = useState('')
    const toast = useToast();
    const dispatch = useDispatch();
    const [isVerifyClicked, setVerifyClicked] = useState(false)
    // ......... when otp will be sent on message for now temperarily it is uncommented  .........
    // useEffect(() => {
    //     if (otpFromResponse) setOTP(otpFromResponse)
    //     getHash().then(hash => {
    //         // use this hash in the message.
    //         console.log('hash', hash);
    //     }).catch(console.log);

    //     startOtpListener(message => {
    //         // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
    //         if (message) {
    //             console.log('message', message);
    //             const gotOtp = /(\d{6})/g.exec(message)[1];
    //             setOTP(gotOtp)
    //             console.log('gotOtp ', gotOtp);
    //         }
    //     });

    //     return () => removeListener();
    // }, []);
    // ......... end  .........

    useEffect(() => {
        if (otpFromResponse) setOTP(otpFromResponse)

    }, [])


    const handleVerifyOTP = useCallback(async () => {
        if (OTP.length !== 6) {
            return toast.show('Please enter a valid OTP', { type: 'danger', placement: 'top' });
        }
        setVerifyClicked(true)
        try {

            const response = await fetch(`${url}/api/v1/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                },
                body: JSON.stringify({ phone: phoneNo, OTP }),
            });

            const data = await response.json();

            console.log('data of response verifyOTP.......', data);
            // console.log('response.status', response.status);

            if (data.attempts === 0) return navigation.navigate('Login');

            if (response.status === 200) {
                toast.show('You are signed in successfully!', { type: 'success', placement: 'top' });
                dispatch({
                    type: AUTH_LOG_IN_SUCCESS,
                    payload: {
                        token: data.token,
                        role: data.role,
                        name: data.name,
                        phoneNo: phoneNo,
                        userId: data.userId,
                        name: data.name
                    },
                });
            } else if (response.status === 401 || response.status === 406) {
                dispatch({
                    type: AUTH_LOG_OUT,
                    payload: {
                        token: "",
                        location: "",
                        role: "",
                        phoneNo: "",
                        userId: "",
                        name: ""
                    }
                });
            } else {
                const toastType = response.status >= 400 ? 'danger' : 'warning';
                const messageData = response.status >= 400 ? data.error : data.message
                toast.show(messageData, { type: toastType, placement: 'top' });
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }

        } catch (error) {
            console.log('Error occurred while verifying OTP', error);
            toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
        } finally {
            setVerifyClicked(false)

        }
        // console.log('OTP', OTP);
    }, [OTP]);

    const handleOTPChange = useCallback((event) => {
        const { text } = event.nativeEvent;
        // console.log('handleOTPChange value', text);
        setOTP(text)
    }, [])

    return (
        <MainComponent
            Title="HELLO"
            Description="Good to see you back"
        >
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Enter Your OTP"
                        placeholderTextColor="grey"
                        value={OTP}
                        onChange={handleOTPChange}
                        style={styles.textInput}
                        keyboardType='numeric'
                    />
                </View>
                <TouchableOpacity
                    onPress={handleVerifyOTP}
                    style={styles.signInButton}
                    disabled={isVerifyClicked}
                >

                    {isVerifyClicked ? <ActivityIndicator size="small" color="#fff" /> : <Text disabled={isVerifyClicked} style={styles.signInButtonText}>VERIFY</Text>}
                </TouchableOpacity>
            </View>
        </MainComponent>
    );
};

export default React.memo(VerifyOTP);

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
    },
    inputContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 14,
        width: 320,
        borderRadius: 8,
        marginBottom: 16,
    },
    textInput: {
        color: 'grey',
        padding: 10,
    },
    signInButton: {
        backgroundColor: '#213C83',
        paddingVertical: 8,
        paddingHorizontal: 48,
        width: 320,
        borderRadius: 8,
        marginBottom: 16,
    },
    signInButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
