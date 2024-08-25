import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, TextInput, ImageBackground, PermissionsAndroid, Image, Pressable } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useToast } from 'react-native-toast-notifications';
import CameraCapture from './cameraCapture/CameraCapture';
import { Icon, Card } from '@rneui/themed';
import { AUTH_LOG_OUT } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { url } from '../../../utils/url';
import CameraCaptureModal from './CameraCaptureModal';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import VehicleSearchBar from './VehicleSearchBar';
import { Spinner } from '../../../utils/Spinner';

const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Geolocation Permission',
                message: 'Please allow to access your location.',
                //   buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        // console.log('granted', granted);
        if (granted === 'granted') {
            console.log('You can use Geolocation');
            return true;
        } else {
            console.log('You cannot use Geolocation');
            return false;
        }
    } catch (err) {
        return false;
    }
};


export default function VehiclePaymentEntry({ navigation, route }) {
    const { selectedVehicle, selectedAmount, selectedTime } = route.params;
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [imageUri, setImageUri] = useState({
        uri: '',
        path: ''
    });
    const [remarks, setRemarks] = useState('');
    const [passData, setPassData] = useState([]);
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [isCapture, setCapture] = useState({
        capturing: false,
        actionID: '',
        name: '',
        phoneNumber: '',
        vehicleNumber: '',
        passId: ''
    })
    const [isCapturing, setIsCapturing] = useState(false)
    const [location, setLocation] = useState(false);
    const { t } = useTranslation();
    const { appLanguage, token, userId } = useSelector(state => state.auth);
    const [vehicleSearchInput, setVehicleSearchInput] = useState('');
    const [recentVehicleNumbers, setRecentVehicleNumbers] = useState([]);
    const [selectedVechicleNumberId, setSelectedVechicleNumberId] = useState('');
    const [debouncedSearchInput, setDebouncedSearchInput] = useState(vehicleSearchInput);
    const [isNewVihicle, setIsNewVihicle] = useState(false);
    const toast = useToast();

    const handleSelectMethod = (method) => {
        setSelectedMethod(method === selectedMethod ? null : method);
    };

    useEffect(() => {
        // console.log("selectedVehicle, selectedAmount, selectedTime", selectedVehicle, selectedAmount, selectedTime);
        getLocation()
    }, [])

    useEffect(() => {
        // console.log("recentVehicleNumbers", recentVehicleNumbers);
        // console.log("selectedVechicleNumberId", selectedVechicleNumberId);
        if (selectedVechicleNumberId && recentVehicleNumbers.length > 0) {
            const filteredVehicleData = recentVehicleNumbers.filter(item => item._id === selectedVechicleNumberId);
            console.log("filteredVehicleData", filteredVehicleData);
            if (filteredVehicleData.length > 0) {
                const [vehicleData] = filteredVehicleData;
                console.log("vehicleData", vehicleData);
                setVehicleNumber(vehicleData.vehicleNumber)
                setPhoneNumber(vehicleData.phoneNumber)
                setName(vehicleData.name)
                setIsNewVihicle(false)
            }
        }
    }, [selectedVechicleNumberId, recentVehicleNumbers]);

    useEffect(() => {
        console.log("vehicleSearchInput-------------", vehicleSearchInput);

        const handler = setTimeout(() => {
            setDebouncedSearchInput(vehicleSearchInput);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [vehicleSearchInput]);

    useEffect(() => {

        if (debouncedSearchInput.length > 3) {
            console.log("debouncedSearchInput", debouncedSearchInput);
            
            fetchRecentVehiclehNumber();
        } else if (debouncedSearchInput.length === 0) {
            setRecentVehicleNumbers([]);
        }
    }, [debouncedSearchInput]);

    const fetchRecentVehiclehNumber = async () => {
        try {
            const response = await fetch(`${url}/api/v1/ticket/previous?vehicleType=${selectedVehicle}&vehicleNumber=${vehicleSearchInput}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'userId': userId,
                    'Authorization': `Bearer ${token}`,
                    'page': 'home',
                    'client-language': appLanguage
                },
            });

            const data = await response.json();
            console.log('fetchRecentVehiclehNumber data', data);
            console.log('fetchRecentVehiclehNumber status', response.status);

            if (response.status === 200) {
                setRecentVehicleNumbers(data?.result || []);
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
                const messageData = data.message
                // console.log('messageData', messageData);
                toast.show(messageData, { type: toastType, placement: 'top' });
                setIsNewVihicle(true)
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }
        } catch (error) {
            // toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
            console.log('error.message', error.message);
        } finally {
            setVehicleNumber('')
            setSelectedVechicleNumberId('')
        }
    }


    const handleSubmit = async () => {
        if (!vehicleNumber || vehicleNumber.replace(/\s+/g, '').length > 10) {
            toast.show(t('Please enter a vehicle number with no more than 10 characters'), { type: 'warning', placement: 'top' });
            return;
        }
        if (phoneNumber.length !== 10) {
            toast.show(t('Phone number cannot be less than ten digits'), { type: 'warning', placement: 'top' });
            return;
        }
        if (!selectedMethod) {
            toast.show(t('Please select a payment method'), { type: 'warning', placement: 'top' });
            return;
        }
        if (!imageUri?.uri) {
            toast.show(t('Please capture an image'), { type: 'warning', placement: 'top' });
            return;
        }
        if (!name) {
            toast.show(t('Please Enter a Owner name'), { type: 'warning', placement: 'top' });
            return;
        }

        {/* I am showing a alert on 'Online' for temporarily as client dont have a online qr
                setup that's why I am showing it on 'Online' once the qr is setup I will show it on 'Free'. */}

        if (selectedMethod === 'Online') {
            if (!remarks) {
                return toast.show(t("Please enter any remarks"), { type: 'warning', placement: 'top' });
            }
        }
        // console.log("imageUri", imageUri);


        const userEnteredData = {
            vehicleNumber,
            phoneNumber,
            paymentMethod: selectedMethod,
            vehicleImage: imageUri,
            selectedTime,
            selectedAmount,
            selectedVehicle,
            remarks,
            address: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            },
            name: name,
            passId: isCapture.passId,
            isPass: selectedTime === 'All Month Pass' ? true : false
        };

        navigation.navigate('PaymentDetails', { userEnteredData });
    };

    const handleRemoveImage = async () => {
        // try {
        //     const response = await fetch(`${url}/api/v1/vehicle-passes`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'x-client-source': 'app',
        //         },
        //     });

        //     const data = await response.json();
        //     // console.log('vehicle-passes search data', data.result.length);
        //     if (response.status === 200) {
        //         // console.log('data.result', data.result);
        //         setPassData(data.result)
        //     } else if (response.status === 401 || response.status === 406) {
        //         dispatch({
        //             type: AUTH_LOG_OUT,
        //             payload: {
        //                 token: "",
        //                 location: "",
        //                 role: "",
        //                 phoneNo: "",
        //                 userId: "",
        //                 name: ""
        //             }
        //         });
        //     } else {
        //         const toastType = response.status >= 400 ? 'danger' : 'warning';
        //         const messageData = response.status >= 400 ? data.error : data.message
        //         console.log('messageData', messageData);
        //         // toast.show(messageData, { type: toastType, placement: 'top' });
        //         // console.log('response.status data.message  data.error', response.status, data.message, data.error)
        //     }
        // } catch (error) {
        //     toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
        //     console.log('error.message', error.message);
        // } finally {
        setImageUri({
            uri: '',
            path: ''
        });
        // }

    };

    const handleSubmitSearch = async () => {

        if (searchQuery.length < 1) {
            toast.show(t('Please enter any keyword to search'), { type: 'warning', placement: 'top' });
        }
        try {
            const response = await fetch(`${url}/api/v1/vehicle-passes/${searchQuery}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'client-language': appLanguage,
                    'Authorization': `Bearer ${token}`,
                    'userId': userId
                },
            });

            const data = await response.json();
            // console.log('vehicle-passes search data', data.result.length);
            if (response.status === 200) {
                // console.log('data.result', data.result);
                setPassData(data.result)
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
                console.log('messageData', messageData);
                // toast.show(messageData, { type: toastType, placement: 'top' });
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }
        } catch (error) {
            toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
            console.log('error.message', error.message);
        }
    }

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
            // console.log('res is:', res);
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        // console.log('position', position);
                        setLocation(position);
                    },
                    error => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                        setLocation(false);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        });
        // console.log(location);
    };

    // const renderItem = ({ item }) => (
    //     <Card containerStyle={styles.card} >
    //         <View style={styles.cardContent}>
    //             <Image
    //                 source={require('../../utils/images/vehiclePaymentEntry/ticket.png')}
    //                 style={styles.ticketLogo}
    //             />
    //             <Text style={styles.plate}>{item.plate}</Text>
    //         </View>
    //         <View style={styles.cardContent}>
    //             <Image
    //                 source={require('../../utils/images/vehiclePaymentEntry/phone.png')}
    //                 style={styles.logo}
    //             />
    //             <Text style={styles.phone}>{item.phone}</Text>
    //         </View>
    //     </Card>
    // );

    const onCardClick = (_data) => {

        // console.log('id, isActive name', _data._id, '   ', _data.isActive, '  ', _data.name);
        if (!_data.isActive) {
            return toast.show(t('Your pass is expired'), { type: 'warning', placement: 'top' });
        }
        setCapture({
            capturing: true,
            actionID: _data._id,
            name: _data.name,
            vehicleNumber: _data.vehicleNo,
            phoneNumber: _data.phone,
            isPass: _data._id
        })
    }

    const handleCapture = (uri, path) => {
        // console.log('uri, path on handleCapture ', uri, path);
        // console.log("selectedTime", selectedTime);

        const userEnteredData = {
            vehicleNumber: isCapture.phoneNumber,
            phoneNumber: isCapture.phoneNumber,
            paymentMethod: selectedTime === 'All Month Pass' ? 'Pass' : 'Free',
            vehicleImage: {
                path,
                uri
            },
            selectedTime: 0,
            selectedAmount: 0,
            selectedVehicle,
            passId: isCapture.actionID,
            remarks,
            address: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            },
            name: isCapture.name,
            passId: isCapture.passId,
            isPass: selectedTime === 'All Month Pass' ? true : false
        };
        setCapture({
            capturing: false,
            actionID: ''
        })

        navigation.navigate('PaymentDetails', { userEnteredData });
    }

    const handleCloseCaptureModal = () => {
        setCapture({
            capturing: false,
            actionID: ''
        })
    }


    return (
        <View style={styles.container}>
            <DashboardHeader
                headerText={t('Profile')}
                secondaryHeaderText={'ASSISTANT'}
            />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.subHeader}>
                    <Text style={styles.subHeaderText}>{t("Vehicle Payment Entry")}</Text>
                </View>

                <View>
                    {selectedTime !== 'All Month Pass' && <>
                        <VehicleSearchBar
                            recentVehicleNumbers={recentVehicleNumbers}
                            vehicleSearchInput={vehicleSearchInput}
                            setVehicleSearchInput={setVehicleSearchInput}
                            selectedVechicleNumberId={selectedVechicleNumberId}
                            setSelectedVechicleNumberId={setSelectedVechicleNumberId}
                        />
                        {isNewVihicle ? <TextInput
                            style={styles.input}
                            value={vehicleNumber}
                            placeholder={t('Enter Vehicle Number')}
                            placeholderTextColor={'grey'}
                            onChangeText={setVehicleNumber}
                        /> : <></>}

                        <TextInput
                            style={styles.input}
                            value={name}
                            placeholder={t('Enter vehicle Owner Name')}
                            placeholderTextColor={'grey'}
                            onChangeText={setName}
                        />
                        <TextInput
                            style={styles.input}
                            value={phoneNumber}
                            placeholder={t('Enter Phone Number')}
                            placeholderTextColor={'grey'}
                            onChangeText={setPhoneNumber}
                        />
                    </>}
                </View>

                {
                    selectedTime !== 'All Month Pass' && <>
                        {
                            imageUri.uri ? (
                                <View style={styles.imageContainer} >
                                    <View style={styles.imageWrapper}>
                                        <ImageBackground source={{ uri: imageUri.uri }} style={styles.image}>
                                            <TouchableOpacity style={styles.cancelButton} onPress={handleRemoveImage}>
                                                <Text style={styles.cancelButtonText}>X</Text>
                                            </TouchableOpacity>
                                        </ImageBackground>
                                    </View>
                                </View>
                            ) : (
                                <CameraCapture setIsCapturing={setIsCapturing} onCapture={(uri, path) => setImageUri({
                                    uri: uri,
                                    path: path
                                })} />
                            )
                        }
                    </>
                }

                {
                    selectedTime !== 'All Month Pass' && <>
                        <Text style={styles.secondHeading}>{t("Payment Method")}</Text>


                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => handleSelectMethod('Cash')}
                        >
                            <Text style={styles.radioText}>{t("Cash")}</Text>
                            <View style={styles.radioCircleOuter}>
                                {selectedMethod === 'Cash' && <View style={styles.radioCircleInner} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => handleSelectMethod('Online')}
                        >
                            <Text style={styles.radioText}>{t("Online")}</Text>
                            <View style={styles.radioCircleOuter}>
                                {selectedMethod === 'Online' && <View style={styles.radioCircleInner} />}
                            </View>
                        </TouchableOpacity>
                        {/*<TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => handleSelectMethod('Free')}
                        >
                            <Text style={styles.radioText}>{t("Free")}</Text>
                            <View style={styles.radioCircleOuter}>
                                {selectedMethod === 'Free' && <View style={styles.radioCircleInner} />}
                            </View>
                        </TouchableOpacity> */}
                    </>
                }

                {/* I am showing a remark on 'Online' for temporarily as client dont have a online qr
                setup that's why I am showing it on 'Online' once the qr is setup I will show it on 'Free'. */}

                {
                    (selectedMethod === 'Online' && selectedTime !== 'All Month Pass') && <>
                        <Text style={styles.label}>{t("Remarks")}</Text>
                        <TextInput
                            style={styles.input}
                            value={remarks}
                            onChangeText={setRemarks}
                            placeholder={('Please Enter Remarks')}
                        />
                    </>
                }
                {
                    selectedTime === 'All Month Pass' && (
                        <View style={styles.searchContainer}>
                            <View style={styles.searchContainerChild}>
                                <Image
                                    source={require('../../../utils/images/search.png')}
                                    style={styles.searchLogo}
                                />
                                <TextInput
                                    style={styles.searchBar}
                                    placeholder={t("Search")}
                                    placeholderTextColor={'grey'}
                                    value={searchQuery}
                                    onChangeText={handleSearch}
                                />
                                <TouchableOpacity onPress={handleSubmitSearch} style={styles.searchButton}>
                                    <Text style={styles.searchButtonText}>{t("Search")}</Text>
                                </TouchableOpacity>
                            </View>
                            {passData.length < 1 ? <View style={{ flex: 1, borderWidth: 0.4, padding: 8, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={styles.phone}>{t("No data found")}!</Text>
                            </View> :
                                <>
                                    {passData.map((item) => (
                                        <Pressable key={item._id} onPress={() => onCardClick(item)}>
                                            {console.log('item............', item)}
                                            <Card containerStyle={styles.card}>
                                                <View style={styles.cardContent}>
                                                    <Text style={styles.plate}>{item.vehicleNo}</Text>
                                                    <View style={{
                                                        padding: 3,
                                                        backgroundColor: item.isActive ? '#2ecc71' : '#e74c3c',
                                                        width: 55,
                                                        height: 24,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        borderRadius: 5,
                                                        marginBottom: 6
                                                    }}>
                                                        <Text style={{ textAlign: 'center', color: 'white' }}>
                                                            {item.isActive ? 'Active' : 'Expired'}
                                                        </Text>
                                                    </View>

                                                </View>
                                                <View style={styles.cardContent}>
                                                    <Text style={styles.phone}>{item.phone}</Text>
                                                    <Text style={{ ...styles.phone, fontSize: 14 }}>{moment(item.passExpiryDate).format('DD-MMM-YY')}</Text>
                                                </View>
                                            </Card>
                                        </Pressable>
                                    ))}
                                </>
                            }


                        </View>
                    )
                }
                {selectedTime !== 'All Month Pass' && <TouchableOpacity disabled={isCapturing} onPress={handleSubmit} style={{ ...styles.submitButton, ...(isCapturing ? { opacity: 0.5 } : {}) }}>
                    <Text style={styles.buttonText}>{t("Submit")}</Text>
                </TouchableOpacity>}
            </ScrollView >


            <CameraCaptureModal
                isVisible={isCapture.capturing}
                handleCapture={handleCapture}
                handleCloseCaptureModal={handleCloseCaptureModal}
                setIsCapturing={setIsCapturing}
            />
        </View >
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
        marginBottom: 10,
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
        marginTop: 20,
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

    card: {
        padding: 6,
        borderRadius: 5,
        margin: 0,
        marginBottom: 20,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    plate: {
        marginLeft: 5,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    phone: {
        marginLeft: 5,
        fontSize: 14,
        color: '#000',
    },
    logo: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
    },
    ticketLogo: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    flatListContent: {
        paddingBottom: 20,
    },
    searchButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 16,
        margin: 2
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    searchContainer: {
        flex: 1,
        marginTop: 10
    },
    searchContainerChild: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 30,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10, // Add padding to match the search icon
    },
    searchLogo: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginRight: 10, // Adjust as needed for spacing
    },
});