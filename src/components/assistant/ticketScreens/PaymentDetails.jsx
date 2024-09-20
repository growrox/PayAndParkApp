import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    ScrollView, ActivityIndicator
} from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { url } from '../../../utils/url';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { AUTH_LOG_OUT } from '../../../redux/types';
import { CREATE_TICKET } from '../../../redux/types';
import SuccessModal from './SuccessModal';
import RazorpayCheckout from 'react-native-razorpay';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import QRModal from './QRModal';

const PaymentDetails = ({ navigation, route }) => {
    const { userEnteredData, selectedSlotID, selectedVehicleID } = route.params;
    const { token, userId, isTicketCreated, appLanguage } = useSelector(state => state.auth);
    const toast = useToast();
    const dispatch = useDispatch();
    const [details, setDetails] = useState({
        vehicleNumber: '',
        vehicleType: '',
        phoneNumber: '',
        paymentMode: '',
        amount: '',
        duration: '',
        remarks: '',
        name: '',
        isPass: '',
        passId: '',
        ticketExpiry: '',
        ticketNo: ''
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isConfirmLoader, setConfirmLoader] = useState(false)
    const [QRModalVisible, setQRModalVisible] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        // console.log("userEnteredData", userEnteredData);
        // console.log("userEnteredData?.ticketExpiry", userEnteredData?.ticketExpiry);
        // console.log("moment(userEnteredData?.ticketExpiry).format('YYYY-MM-DD HH:mm:ss')", moment(userEnteredData?.ticketExpiry).format('YYYY-MM-DD HH:mm:ss'));

        if (userEnteredData) {
            console.log("userEnteredData", userEnteredData);

            if (userEnteredData.type === 'ticketDetailsPreview') {
                setDetails({
                    vehicleNumber: userEnteredData.vehicleNumber,
                    vehicleType: userEnteredData.vehicleType,
                    phoneNumber: userEnteredData.phoneNumber,
                    paymentMode: userEnteredData.paymentMode,
                    amount: userEnteredData.amount,
                    duration: userEnteredData.duration == 720 ? '30 Days' : userEnteredData.duration,
                    remarks: userEnteredData?.remarks || "",
                    name: userEnteredData.name || 'Pay And Park',
                    isPass: userEnteredData.isPass,
                    passId: userEnteredData.passId,
                    ticketExpiry: userEnteredData.isPass ? moment(userEnteredData?.ticketExpiry).format('YYYY-MM-DD') : moment(userEnteredData?.ticketExpiry).format('YYYY-MM-DD hh:mm:ss A') || "NA",
                    ticketNo: userEnteredData?.ticketRefId
                });
            } else {
                setDetails({
                    vehicleNumber: userEnteredData.vehicleNumber,
                    vehicleType: userEnteredData.selectedVehicle,
                    phoneNumber: userEnteredData.phoneNumber,
                    paymentMode: userEnteredData.paymentMethod,
                    amount: userEnteredData.paymentMethod === 'Free' ? 0 : userEnteredData.selectedAmount,
                    duration: userEnteredData.selectedTime == 720 ? '30 Days' : userEnteredData.selectedTime,
                    remarks: userEnteredData.remarks,
                    name: userEnteredData.name || 'Pay And Park',
                    isPass: userEnteredData.isPass,
                    passId: userEnteredData.passId,
                });
            }
        }
    }, [userEnteredData]);

    // useEffect(() => {
    //     console.log('details', details);
    //     console.log("selectedSlotID, selectedVehicleID----------->", selectedSlotID, selectedVehicleID);

    // }, [details])


    const initiatePayment = async () => {
        // console.log('url ', url, token);

        const response = await fetch(`${url}/api/v1/ticket/generate-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-source': 'app',
                'Authorization': `Bearer ${token}`,
                'client-language': appLanguage,
                'userId': userId
            },
            body: JSON.stringify({ amount: details.amount })
        });

        const data = await response.json();
        // console.log('generate-order data.............', data);

        if (response.status === 200) {
            const options = {
                description: 'online ticket transaction',
                image: "https://i.ibb.co/98bN27m/IMG-20240612-WA0012-fotor-enhance-20240612222420-transformed-1.png",
                currency: 'INR',
                key: "rzp_test_ZpP0aWTsOfzQeR",
                amount: 35,
                name: 'Acme Corp',
                order_id: data.result.id,
                // callback_url: `${url}/api/v1/ticket/payment-status`,
                prefill: {
                    email: 'hasan@example.com',
                    contact: '9191919191',
                    name: details.name
                },
                // method: {
                //     netbanking: false,
                //     card: false,
                //     upi: true,
                //     wallet: false,
                // },
                theme: { color: '#53a20e' },
            };

            try {
                const paymentResult = await RazorpayCheckout.open(options);
                // console.log('paymentResult', paymentResult);
                return { result: paymentResult, order_id: data.result.id, ref_id: data.result.reference_id };
            } catch (error) {
                console.error('Razorpay error', error);
                return { result: false, order_id: data.result.id, ref_id: data.result.reference_id };
            }
        } else {
            handleErrorResponse(response, data);
        }
    };

    const handleErrorResponse = (response, data) => {
        if (response.status === 401 || response.status === 406) {
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
            // console.log('messageData', messageData);
            toast.show(messageData, { type: toastType, placement: 'top' });
            // console.log('response.status data.message  data.error', response.status, data.message, data.error)
        }
    };

    const deleteOrder = async (refID) => {
        // console.log('deleteOrder refID', refID);
        try {
            const response = await fetch(`${url}/api/v1/ticket/order/${refID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'userId': userId,
                    'Authorization': `Bearer ${token}`,
                    'client-language': appLanguage
                }
            });

            const data = await response.json();
            // console.log('data of delete........', data);

            if (response.status === 200) {
                toast.show(t('Order deleted successfully'), { type: 'success', placement: 'top' });
            } else {
                handleErrorResponse(response, data);
            }
        } catch (error) {
            toast.show(`Error from deleteOrder: ${error.message}`, { type: 'danger', placement: 'top' });
        }
    };

    const successPayment = async (result) => {
        console.log('successOrder result', result);
        try {
            const response = await fetch(`${url}/api/v1/ticket/payment-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'userId': userId,
                    'Authorization': `Bearer ${token}`,
                    'client-language': appLanguage
                },
                body: JSON.stringify(result)
            });

            const data = await response.json();
            // console.log('data of delete........', data);

            if (response.status === 200) {
                toast.show(t('Payment completed successfully'), { type: 'success', placement: 'top' });
            } else {
                handleErrorResponse(response, data);
            }
        } catch (error) {
            toast.show(`Error from successPayment: ${error.message}`, { type: 'danger', placement: 'top' });
        }
    };
    // useEffect(() => {
    //     console.log('moment().utcOffset("+05:30").format()', moment().utcOffset("+05:30").format());

    // }, [])

    // temporary code for a qr code as client dont have online setup properly 
    const handleConfirm = async () => {
        const { vehicleNumber, phoneNumber, paymentMode, amount, duration, remarks } = details;
        // console.log('paymentMode:', paymentMode);
        // console.log('Details:', vehicleNumber, phoneNumber, paymentMode, amount, duration, remarks);
        // console.log("amount:", amount);

        // if (!amount && paymentMode !== 'Free') {
        //     return toast.show("Please enter an amount.", { type: 'warning', placement: 'top' });
        // }

        try {
            setConfirmLoader(true)

            const apiData = {
                vehicleType: userEnteredData.selectedVehicle,
                duration: duration === 'All Month Pass' ? 0 : duration,
                paymentMode,
                vehicleNumber,
                phoneNumber,
                amount: paymentMode === 'Free' ? 0 : amount,
                image: userEnteredData.vehicleImage.path,
                remarks,
                onlineTransactionId: paymentMode === 'Online' ? "668173dbd607b64798e92929" : "",
                name: details.name,
                createdAtClient: moment().utcOffset("+05:30").format(),
                address: userEnteredData.address,
                isPass: duration === "30 Days" ? true : details.isPass,
                ...(duration === 'All Month Pass' ? { passId: details.passId } : {}),
                vehicleID: selectedVehicleID,
                priceID: selectedSlotID
            };
            console.log(`userId  ${userId}  url ${url}  token   ${token}   appLanguage    ${appLanguage}`);
            console.log('apiData,,,hit ,,,,,,,,,,,,,,,', JSON.stringify(apiData));


            // return;

            const response = await fetch(`${url}/api/v1/parking-tickets/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'userId': userId,
                    'Authorization': `Bearer ${token}`,
                    'client-language': appLanguage
                },
                body: JSON.stringify(apiData),
            });

            // console.log("response of parking-tickets/tickets", response);
            // console.log("status of parking-tickets/tickets", response.status);

            if (!response.ok) {
                // console.log('res[posmne', response);
                const errorText = await response.text();
                console.error('Error Response Text:', errorText);
                throw new Error(`Server Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Parking Tickets Data:', data);

            if (response.status === 200) {
                setShowSuccessModal(true);
                dispatch({
                    type: CREATE_TICKET,
                    payload: { isTicketCreated: !isTicketCreated }
                });
                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigation.navigate('Home')
                }, 2000);
            } else {
                handleErrorResponse(response, data);
            }
        } catch (error) {
            console.error('Error from handleConfirm:', error);
            toast.show(`Error from handleConfirm: ${error.message}`, { type: 'danger', placement: 'top' });
        } finally {
            setConfirmLoader(false)
        }
    };

    // permanent code but temporarily commented
    // const handleConfirm = async () => {
    //     const { vehicleNumber, phoneNumber, paymentMode, amount, duration, remarks } = details;
    //     // console.log('paymentMode:', paymentMode);
    //     // console.log('Details:', vehicleNumber, phoneNumber, paymentMode, amount, duration, remarks);
    //     // console.log("amount:", amount);

    //     // if (!amount && paymentMode !== 'Free') {
    //     //     return toast.show("Please enter an amount.", { type: 'warning', placement: 'top' });
    //     // }

    //     try {
    //         setConfirmLoader(true)
    //         let paymentResult;
    //         if (paymentMode === "Online") {
    //             paymentResult = await initiatePayment();
    //             console.log('Payment Result:', paymentResult);

    //             if (!paymentResult.result) {
    //                 await deleteOrder(paymentResult.ref_id);
    //                 return;
    //             } else {
    //                 await successPayment(paymentResult.result)
    //             }
    //         }
    //         console.log('paymentResult.ref_id', paymentResult?.ref_id);
    //         const apiData = {
    //             vehicleType: userEnteredData.selectedVehicle,
    //             duration: duration === 'All Month Pass' ? 0 : duration,
    //             paymentMode,
    //             vehicleNumber,
    //             phoneNumber,
    //             amount: paymentMode === 'Free' ? 0 : amount,
    //             image: userEnteredData.vehicleImage.path,
    //             remarks,
    //             onlineTransactionId: paymentMode === 'Online' ? paymentResult.ref_id : "",
    //             name: details.name,
    //             createdAtClient: moment().utcOffset("+05:30").format(),
    //             address: userEnteredData.address,
    //             isPass: details.isPass,
    //             ...(duration === 'All Month Pass' ? { passId: details.passId } : {})
    //         };
    //         console.log('apiData,,,hit ,,,,,,,,,,,,,,,', apiData);

    //         const response = await fetch(`${url}/api/v1/parking-tickets/tickets`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'x-client-source': 'app',
    //                 'userId': userId,
    //                 'Authorization': `Bearer ${token}`,
    //                 'client-language': appLanguage
    //             },
    //             body: JSON.stringify(apiData),
    //         });

    //         if (!response.ok) {
    //             console.log('res[posmne', response);
    //             const errorText = await response.text();
    //             console.error('Error Response Text:', errorText);
    //             throw new Error(`Server Error: ${response.status} ${response.statusText}`);
    //         }

    //         const data = await response.json();
    //         console.log('Parking Tickets Data:', data);

    //         if (response.status === 200) {
    //             setShowSuccessModal(true);
    //             dispatch({
    //                 type: CREATE_TICKET,
    //                 payload: { isTicketCreated: !isTicketCreated }
    //             });
    //             setTimeout(() => {
    //                 setShowSuccessModal(false);
    //                 navigation.navigate('Home')
    //             }, 2000);
    //         } else {
    //             handleErrorResponse(response, data);
    //         }
    //     } catch (error) {
    //         console.error('Error from handleConfirm:', error);
    //         toast.show(`Error from handleConfirm: ${error.message}`, { type: 'danger', placement: 'top' });
    //     } finally {
    //         setConfirmLoader(false)
    //     }
    // };

    return (
        <>
            <DashboardHeader headerText={t('Profile')} secondaryHeaderText={'ASSISTANT'} />
            <ScrollView contentContainerStyle={styles.container}>
                {(details.paymentMode === "Online" && userEnteredData.type !== 'ticketDetailsPreview') && <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => setQRModalVisible(true)} style={styles.QrContainer}>
                        <Text style={styles.QrText}>{t("Show QR")}</Text>
                    </TouchableOpacity>
                </View>}
                <View style={styles.subHeader}>
                    <Text style={styles.subHeaderText}>{userEnteredData.type === 'ticketDetailsPreview' ? t("Ticket Details") : t("Payment Details")}</Text>
                </View>
                {userEnteredData.type === 'ticketDetailsPreview' ? <>
                    <Text style={styles.label}>{t("Ticket No")}</Text>
                    <TextInput
                        style={styles.input}
                        value={details.ticketNo}
                        editable={false}
                    /> </>
                    : <></>}
                <Text style={styles.label}>{t("Customer Name")}</Text>
                <TextInput
                    style={styles.input}
                    value={details.name}
                    editable={false}
                />
                <Text style={styles.label}>{t("Vehicle Type")}</Text>
                <TextInput
                    style={styles.input}
                    value={details.vehicleType}
                    editable={false}
                />
                <Text style={styles.label}>{t("Vehicle Number")}</Text>
                <TextInput
                    style={styles.input}
                    value={details.vehicleNumber}
                    editable={false}
                />
                <Text style={styles.label}>{t("Phone Number")}</Text>
                <TextInput
                    style={styles.input}
                    value={details.phoneNumber}
                    editable={false}
                />

                <Text style={styles.label}>{t("Payment Method")}</Text>
                <TextInput
                    style={styles.input}
                    value={details.paymentMode}
                    editable={false}
                />

                <Text style={styles.label}>{t("Amount")}</Text>
                <TextInput
                    style={styles.input}
                    value={String(details.amount)}
                    editable={false}
                />

                <Text style={styles.label}>{t("Duration of Time")}</Text>
                <TextInput
                    style={styles.input}
                    value={String(details.duration)}
                    editable={false}
                />

                {userEnteredData.type === 'ticketDetailsPreview' ? <>
                    <Text style={styles.label}>{t("Expiry Date")}</Text>
                    <TextInput
                        style={styles.input}
                        value={String(details.ticketExpiry)}
                        editable={false}
                    />
                </> : <></>}

                {/* I am showing a remark section on 'Online' for temporarily as client dont have a online qr
                setup that's why I am showing it on 'Online' once the qr is setup I will show it on 'Free'. */}
                {details.paymentMode === 'Online' && (
                    <View>
                        <Text style={styles.label}>{t("Remarks (if free)")}</Text>
                        <TextInput
                            style={styles.input}
                            value={details.remarks}
                            editable={false}
                        />
                    </View>
                )}
                {userEnteredData.type !== 'ticketDetailsPreview' ?
                    <>
                        <View style={styles.imageContainer}>
                            <View style={styles.imageWrapper}>
                                <ImageBackground source={{ uri: userEnteredData.vehicleImage.uri }} style={styles.image} />
                            </View>
                        </View>
                        <TouchableOpacity disabled={isConfirmLoader} style={styles.button} onPress={handleConfirm}>
                            {isConfirmLoader ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>{t("Confirm")}</Text>
                            )}
                        </TouchableOpacity>
                    </> :
                    <>
                        <View style={styles.imageContainer}>
                            {userEnteredData.image ? <View style={styles.imageWrapper}>
                                <ImageBackground source={{ uri: `${url}/api/v1${userEnteredData.image}` }} style={styles.image} />
                            </View> : <Text>{t("No image preview")}!</Text>}
                        </View>
                    </>
                }

                {userEnteredData.type === 'ticketDetailsPreview' ? (
                    <Text style={styles.noteParent}>
                        Note:
                        <Text style={styles.noteChild}>
                            {' '}
                            Park your vehicle at your own risk. The company and MBMC are not responsible for any loss, theft, or damage to your vehicle.
                        </Text>
                    </Text>
                ) : null}




                {/* Success Modal */}
                <SuccessModal isVisible={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
                <QRModal modalVisible={QRModalVisible} setModalVisible={setQRModalVisible} />
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
    headerContainer: {
        alignItems: 'flex-end',
        marginBottom: -3,
        marginTop: -9
    },
    QrContainer: {
        padding: 10
    },
    QrText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff'
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
    },
    noteParent: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#d9534f',
        fontSize: 14,
        marginBottom: 10
    },
    noteChild: {
        fontWeight: 'normal'
    }
});

export default PaymentDetails;
