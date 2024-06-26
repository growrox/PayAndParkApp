import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, TextInput, ImageBackground } from 'react-native';
import DashboardHeader from '../dashboard/DashboardHeader';
import { useToast } from 'react-native-toast-notifications';
import CameraCapture from './cameraCapture/CameraCapture';

export default function VehiclePaymentEntry({ navigation, route }) {
    const { selectedVehicle, selectedAmount, selectedTime } = route.params;
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [remarks, setRemarks] = useState('');

    const toast = useToast();

    const handleSelectMethod = (method) => {
        setSelectedMethod(method === selectedMethod ? null : method);
    };

    const handleSubmit = async () => {
        if (!vehicleNumber) {
            toast.show('Please enter a vehicle number', { type: 'warning', placement: 'top' });
            return;
        }
        if (!phoneNumber) {
            toast.show('Please enter the phone number.', { type: 'warning', placement: 'top' });
            return;
        }
        if (!selectedMethod) {
            toast.show('Please select a payment method.', { type: 'warning', placement: 'top' });
            return;
        }
        if (!imageUri) {
            toast.show('Please capture an image.', { type: 'warning', placement: 'top' });
            return;
        }
        if (selectedMethod === 'Free') {
            if (!remarks) {
                return toast.show("Please enter any remarks.", { type: 'warning', placement: 'top' });
            }
        }


        const userEnteredData = {
            vehicleNumber,
            phoneNumber,
            paymentMethod: selectedMethod,
            vehicleImage: imageUri,
            selectedTime,
            selectedAmount,
            selectedVehicle,
            remarks
        };

        navigation.navigate('PaymentDetails', { userEnteredData });
    };

    const handleRemoveImage = () => {
        setImageUri(null);
    };

    return (
        <View style={styles.container}>
            <DashboardHeader
                headerText={'Assistant'}
                secondaryHeaderText={'Profile'}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.subHeader}>
                    <Text style={styles.subHeaderText}>Vehicle Payment Entry</Text>
                </View>

                <View>
                    <TextInput
                        style={styles.input}
                        value={vehicleNumber}
                        placeholder='Enter Vehicle Number'
                        onChangeText={setVehicleNumber}
                    />
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        placeholder='Enter Phone Number'
                        onChangeText={setPhoneNumber}
                    />
                </View>

                {imageUri ? (
                    <View style={styles.imageContainer}>
                        <View style={styles.imageWrapper}>
                            <ImageBackground source={{ uri: imageUri }} style={styles.image}>
                                <TouchableOpacity style={styles.cancelButton} onPress={handleRemoveImage}>
                                    <Text style={styles.cancelButtonText}>X</Text>
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                    </View>
                ) : (
                    <CameraCapture onCapture={(uri) => setImageUri(uri)} />
                )}

                <Text style={styles.secondHeading}>Payment Method</Text>

                <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => handleSelectMethod('Online')}
                >
                    <Text style={styles.radioText}>Online</Text>
                    <View style={styles.radioCircleOuter}>
                        {selectedMethod === 'Online' && <View style={styles.radioCircleInner} />}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => handleSelectMethod('Cash')}
                >
                    <Text style={styles.radioText}>Cash</Text>
                    <View style={styles.radioCircleOuter}>
                        {selectedMethod === 'Cash' && <View style={styles.radioCircleInner} />}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.radioButton}
                    onPress={() => handleSelectMethod('Free')}
                >
                    <Text style={styles.radioText}>Free</Text>
                    <View style={styles.radioCircleOuter}>
                        {selectedMethod === 'Free' && <View style={styles.radioCircleInner} />}
                    </View>
                </TouchableOpacity>

                {selectedMethod === 'Free' && <>
                    <Text style={styles.label}>Remarks</Text>
                    <TextInput
                        style={styles.input}
                        value={remarks}
                        onChangeText={setRemarks}
                        placeholder='Please Enter Remarks'
                    />
                </>}

                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        padding: 16,
    },
    subHeader: {
        marginBottom: 30,
        marginTop: 10,
    },
    subHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 8,
        marginTop: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginBottom: 26,
        marginTop: 6,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    secondHeading: {
        fontSize: 20,
        marginBottom: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        justifyContent: 'space-between',
    },
    radioText: {
        fontSize: 16,
    },
    radioCircleOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007bff',
    },
    submitButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 30,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30
    },
    imageWrapper: {
        borderRadius: 9,
        overflow: 'hidden',
        width: 100,
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    cancelButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 15,
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 14,
    },
});
