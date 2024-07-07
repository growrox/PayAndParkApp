import React, { useCallback, useEffect, useState } from 'react';
import { Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';
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

            console.log('data of response.......', data);
            console.log('response.status', response.status);

            if (data.attempts === 0) return navigation.navigate('Login');

            switch (response.status) {
                case 400:
                case 300:
                    toast.show(data.message, { type: 'warning', placement: 'top' });
                    break;
                case 200:
                    toast.show('You are signed in successfully!', { type: 'success' });
                    dispatch({
                        type: AUTH_LOG_IN_SUCCESS,
                        payload: {
                            token: data.token,
                            roleid: '',
                            name: data.name,
                            phoneNo: phoneNo,
                            userId: data.userId,
                            name: data.name
                        },
                    });
                    break;
                default:
                    console.log('default response.status:', response.status);
            }

        } catch (error) {
            console.log('Error occurred while verifying OTP', error);
            toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
        }
        console.log('OTP', OTP);
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
                >
                    <Text style={styles.signInButtonText}>VERIFY</Text>
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
        paddingVertical: 6,
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
