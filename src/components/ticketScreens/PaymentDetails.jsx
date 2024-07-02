import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    ScrollView
} from 'react-native';
import DashboardHeader from '../dashboard/DashboardHeader';
import { url } from '../../utils/url';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { AUTH_LOG_OUT } from '../../redux/types';
import { CREATE_TICKET } from '../../redux/types';
import SuccessModal from './SuccessModal'; // Import the SuccessModal component

const PaymentDetails = ({ navigation, route }) => {
    const { userEnteredData } = route.params;
    const { token, userId, isTicketCreated } = useSelector(state => state.auth);
    const toast = useToast();
    const dispatch = useDispatch();

    const [details, setDetails] = useState({
        vehicleNumber: '',
        phoneNumber: '',
        paymentMode: '',
        amount: '',
        duration: '',
        remarks: ''
    });

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (userEnteredData) {
            setDetails({
                vehicleNumber: userEnteredData.vehicleNumber,
                phoneNumber: userEnteredData.phoneNumber,
                paymentMode: userEnteredData.paymentMethod,
                amount: userEnteredData.selectedAmount,
                duration: userEnteredData.selectedTime,
                remarks: userEnteredData.remarks
            });
        }
    }, [userEnteredData]);

    const handleConfirm = async () => {
        const { vehicleNumber, phoneNumber, paymentMode, amount, duration, remarks } = details;

        if (!amount) {
            return toast.show("Please enter an amount.", { type: 'warning', placement: 'top' });
        }
        try {
            const apiData = {
                vehicleType: userEnteredData.selectedVehicle,
                duration,
                paymentMode,
                vehicleNumber,
                phoneNumber,
                amount,
                vehicleImage: userEnteredData.vehicleImage,
                remarks
            };

            const response = await fetch(`${url}/api/v1/parking-tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'userId': userId,
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(apiData)
            });

            const data = await response.json();

            if (response.status === 200) {
                setShowSuccessModal(true);
                dispatch({
                    type: CREATE_TICKET,
                    payload: {
                        isTicketCreated: !isTicketCreated
                    },
                });
                setTimeout(() => {
                    navigation.navigate('Home')
                }, 2000)
            } else if (response.status === 401 || response.status === 406) {
                dispatch({
                    type: AUTH_LOG_OUT,
                    payload: {
                        token: "",
                        location: "",
                        roleid: "",
                        phoneNo: "",
                        userId: ""
                    }
                });
            } else {
                const toastType = response.status >= 500 ? 'danger' : 'warning';
                toast.show(data.message, { type: toastType, placement: 'top' });
            }
        } catch (error) {
            toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
        }
    };

    return (
        <>
            <DashboardHeader headerText="Assistant" secondaryHeaderText="Profile" />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.subHeader}>
                    <Text style={styles.subHeaderText}>Payment Details</Text>
                </View>
                <Text style={styles.label}>Vehicle Number</Text>
                <TextInput
                    style={styles.input}
                    value={details.vehicleNumber}
                    editable={false}
                />
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    value={details.phoneNumber}
                    editable={false}
                />

                <Text style={styles.label}>Payment Method</Text>
                <TextInput
                    style={styles.input}
                    value={details.paymentMode}
                    editable={false}
                />

                <Text style={styles.label}>Amount</Text>
                <TextInput
                    style={styles.input}
                    value={String(details.amount)}
                    editable={false}
                />

                <Text style={styles.label}>Duration of Time</Text>
                <TextInput
                    style={styles.input}
                    value={String(details.duration)}
                    editable={false}
                />

                {details.paymentMode === 'Free' && (
                    <View>
                        <Text style={styles.label}>Remarks (if free)</Text>
                        <TextInput
                            style={styles.input}
                            value={details.remarks}
                            editable={false}
                        />
                    </View>
                )}
                <View style={styles.imageContainer}>
                    <View style={styles.imageWrapper}>
                        <ImageBackground source={{ uri: userEnteredData.vehicleImage }} style={styles.image} />
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                    <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>

                {/* Success Modal */}
                <SuccessModal isVisible={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1
    },
    subHeader: {
        marginBottom: 30,
        marginTop: 10
    },
    subHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000'
    },
    label: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 20
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
        height: 200
    },
    image: {
        width: '100%',
        height: '100%'
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 4,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default PaymentDetails;
