import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import DashboardHeader from '../dashboard/DashboardHeader';

const PaymentDetails = ({ navigation, route }) => {
    const { userEnteredData } = route.params;
    const [vehicleNumber, setVehicleNumber] = useState(userEnteredData.vehicleNumber);
    const [phoneNumber, setPhoneNumber] = useState(userEnteredData.phoneNumber);
    const [paymentMode, setPaymentMode] = useState(userEnteredData.paymentMethod);
    const [amount, setAmount] = useState('138');
    const [duration, setDuration] = useState(userEnteredData.selectedTimeSlot);
    const [remarks, setRemarks] = useState('Remarks');

    // useEffect(() => {
    //     console.log('userEnteredData', userEnteredData);
    //     console.log('vehicleNumber', userEnteredData.vehicleNumber);
    //     console.log('phoneNumber', userEnteredData.phoneNumber);
    //     console.log('paymentMode', userEnteredData.paymentMethod);
    //     console.log('vehicleImage', userEnteredData.vehicleImage);
    //     console.log('selectedTimeSlot', userEnteredData.selectedTimeSlot);
    //     console.log('selectedVehicle', userEnteredData.selectedVehicle);

    // }, [])

    const handleConfirm = async () => {
        if (!amount) {
            return toast.show("Please enter an amount.", { type: 'warning', placement: 'top' });
        }

        if (!remarks) {
            return toast.show("Please enter any remarks.", { type: 'warning', placement: 'top' });
        }

        try {
            console.log('clicked handleConfirm ');
            const apiData = {
                vehicleType: userEnteredData.selectedVehicle,
                duration,
                paymentMode,
                vehicleNumber,
                phoneNumber,
                amount
            }
            const response = await fetch('https://payandparkserver.onrender.com/api/v1/parking-tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                },
                body: JSON.stringify(apiData),
            });

            const data = await response.json();
            console.log('data of response.......', data);

            switch (response.status) {
                case 400:
                case 300:
                    toast.show(data.message, { type: 'warning', placement: 'top' });
                    break;
                case 200:
                    toast.show(data.message, { type: 'success', placement: 'top' });
                    navigation.navigate('VerifyOTP', { phoneNo, otpFromResponse: data.OTP });
                    break;
                default:
                    console.log('default response.status:', response.status);
                    toast.show(data.message, { placement: 'top' })
            }

        } catch (error) {
            console.log('Error occurred while handleConfirm', error);
            toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
        }
    }

    return (
        <>
            <DashboardHeader
                headerText={'Assistant'}
                secondaryHeaderText={'Profile'}
            />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Vehicle Number</Text>
                <TextInput
                    style={styles.input}
                    value={vehicleNumber}
                    onChangeText={setVehicleNumber}
                />

                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Payment Method</Text>
                <TextInput
                    style={styles.input}
                    value={paymentMode}
                    onChangeText={setPaymentMode}
                />

                <Text style={styles.label}>Amount</Text>
                <TextInput
                    style={styles.input}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Duration of Time</Text>
                <TextInput
                    style={styles.input}
                    value={duration}
                    onChangeText={setDuration}
                />

                <Text style={styles.label}>Remarks (if free)</Text>
                <TextInput
                    style={styles.input}
                    value={remarks}
                    onChangeText={setRemarks}
                />

                <Image
                    source={{ uri: userEnteredData.vehicleImage.uri }}
                    style={styles.image}
                />

                <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
            </ScrollView>
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PaymentDetails;
