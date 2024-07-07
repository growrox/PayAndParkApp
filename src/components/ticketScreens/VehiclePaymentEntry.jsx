import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, TextInput, ImageBackground, PermissionsAndroid, Image } from 'react-native';
import DashboardHeader from '../dashboard/DashboardHeader';
import { useToast } from 'react-native-toast-notifications';
import CameraCapture from './cameraCapture/CameraCapture';
import { Icon, Card } from '@rneui/themed';
import { AUTH_LOG_OUT } from '../../redux/types';
import { useDispatch } from 'react-redux';
import { url } from '../../utils/url';
import CameraCaptureModal from './CameraCaptureModal';
import Geolocation from 'react-native-geolocation-service';


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
        console.log('granted', granted);
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
        actionID: ''
    })
    const [location, setLocation] = useState(false);


    const toast = useToast();

    const handleSelectMethod = (method) => {
        setSelectedMethod(method === selectedMethod ? null : method);
    };

    useEffect(() => {
        getLocation()
    }, [])

    const handleSubmit = async () => {
        if (!vehicleNumber) {
            toast.show('Please enter a vehicle number', { type: 'warning', placement: 'top' });
            return;
        }

        if (phoneNumber.length !== 10) {
            toast.show('Phone number cannot be less than ten digits.', { type: 'warning', placement: 'top' });
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
        console.log("imageUri", imageUri);


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
            }
        };

        navigation.navigate('PaymentDetails', { userEnteredData });
    };

    const handleRemoveImage = () => {
        setImageUri({
            uri: '',
            path: ''
        });
    };

    const handleSubmitSearch = async () => {
        if (!vehicleNumber) {
            toast.show('Please enter a vehicle number', { type: 'warning', placement: 'top' });
            return;
        }

        if (phoneNumber.length !== 10) {
            toast.show('Phone number cannot be less than ten digits.', { type: 'warning', placement: 'top' });
            return;
        }

        if (searchQuery.length < 1) {
            toast.show('Please enter any keyword to search', { type: 'warning', placement: 'top' });
        }
        try {
            const response = await fetch(`${url}/api/v1/vehicle-passes/${searchQuery}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                },
            });

            const data = await response.json();
            console.log('vehicle-passes search data', data);
            if (response.status === 200) {
                setPassData(data.result)
            } else if (response.status === 401 || response.status === 406) {
                dispatch({
                    type: AUTH_LOG_OUT,
                    payload: {
                        token: "",
                        location: "",
                        roleid: "",
                        phoneNo: "",
                        userId: "",
                        name: ""
                    }
                });
            } else {
                const toastType = response.status >= 500 ? 'danger' : 'warning';
                toast.show(data.message, { type: toastType, placement: 'top' });
                console.log('data.message ', data.message);
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
            console.log('res is:', res);
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        console.log('position', position);
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
        console.log(location);
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

    const onCardClick = (id, isActive) => {

        console.log('id, isActive', id, '   ', isActive);
        if (!isActive) {
            toast.show('Your pass is expired', { type: 'warning', placement: 'top' });
        }
        setCapture({
            capturing: true,
            actionID: id
        })
    }

    const handleCapture = (URI, type, name) => {
        console.log('URI, type, name', URI, type, name);


        const userEnteredData = {
            vehicleNumber,
            phoneNumber,
            paymentMethod: 'Free',
            vehicleImage: {
                name,
                type,
                uri: URI
            },
            selectedTime: 0,
            selectedAmount: 0,
            selectedVehicle,
            passId: isCapture.actionID,
            remarks,
            address: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
        };
        setCapture({
            capturing: false,
            actionID: ''
        })

        navigation.navigate('PaymentDetails', { userEnteredData });
    }

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
                        placeholderTextColor={'grey'}
                        onChangeText={setVehicleNumber}
                    />
                    <TextInput
                        style={styles.input}
                        value={phoneNumber}
                        placeholder='Enter Phone Number'
                        placeholderTextColor={'grey'}
                        onChangeText={setPhoneNumber}
                    />
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
                                <CameraCapture onCapture={(uri, path) => setImageUri({
                                    uri: uri,
                                    path: path
                                })} />
                            )
                        }
                    </>
                }

                {
                    selectedTime !== 'All Month Pass' && <>
                        <Text style={styles.secondHeading}>Payment Method</Text>+

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
                    </>
                }

                {
                    (selectedMethod === 'Free' && selectedTime !== 'All Month Pass') && <>
                        <Text style={styles.label}>Remarks</Text>
                        <TextInput
                            style={styles.input}
                            value={remarks}
                            onChangeText={setRemarks}
                            placeholder='Please Enter Remarks'
                        />
                    </>
                }
                {
                    selectedTime === 'All Month Pass' && (
                        <View style={styles.searchContainer}>
                            <View style={styles.searchContainerChild}>
                                <Image
                                    source={require('../../utils/images/search.png')}
                                    style={styles.searchLogo}
                                />
                                <TextInput
                                    style={styles.searchBar}
                                    placeholder="Search"
                                    placeholderTextColor={'grey'}
                                    value={searchQuery}
                                    onChangeText={handleSearch}
                                />
                                <TouchableOpacity onPress={handleSubmitSearch} style={styles.searchButton}>
                                    <Text style={styles.searchButtonText}>Search</Text>
                                </TouchableOpacity>
                            </View>

                            {passData.map((item) => (
                                <TouchableOpacity key={item._id} onPress={() => onCardClick(item._id, item.isActive)}>
                                    <Card containerStyle={styles.card}>
                                        <View style={styles.cardContent}>
                                            <Image
                                                source={require('../../utils/images/vehiclePaymentEntry/ticket.png')}
                                                style={styles.ticketLogo}
                                            />
                                            <Text style={styles.plate}>{item.vehicleNo}</Text>
                                        </View>
                                        <View style={styles.cardContent}>
                                            <Image
                                                source={require('../../utils/images/vehiclePaymentEntry/phone.png')}
                                                style={styles.logo}
                                            />
                                            <Text style={styles.phone}>{item.phone}</Text>
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                            ))}

                        </View>
                    )
                }
                {selectedTime !== 'All Month Pass' && <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>}
            </ScrollView >

            <CameraCaptureModal
                isVisible={isCapture.capturing}
                handleCapture={handleCapture}
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

    card: {
        padding: 5,
        borderRadius: 5,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    plate: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF7F50', // Coral color
    },
    phone: {
        marginLeft: 10,
        fontSize: 16,
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
    },
    searchContainerChild: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 10,
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