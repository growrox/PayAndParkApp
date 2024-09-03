import * as React from 'react';
import { Text, View, TouchableWithoutFeedback, StyleSheet, Image, Modal, PermissionsAndroid } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProfileModal from './profile/ProfileModal';
import { useNavigation } from '@react-navigation/native';
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
export default function DashboardHeader({ headerText, secondaryHeaderText }) {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = React.useState(false);
    const { isClockedIn } = useSelector(state => state.auth)
    const [location, setLocation] = React.useState(false);

    React.useEffect(() => {
        getLocation()
    }, [])

    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    const handleProfilePress = () => {
        // console.log('Profile pressed');
        setModalVisible(true);
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

    return (
        <View style={styles.header}>
            <TouchableWithoutFeedback onPress={handleLogoPress}>
                <Image
                    source={require('../utils/images/Logo-without-bg.png')}
                    style={styles.logo}
                />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={handleProfilePress}>
                <View style={styles.profileContainer}>
                    <Image
                        source={require('../utils/images/profile-icon.png')}
                        style={styles.profileLogo}
                    />
                    {secondaryHeaderText === 'ASSISTANT' && <View style={{ ...styles.greenIndicator, backgroundColor: isClockedIn ? 'green' : '#CB2027' }} />}
                </View>
            </TouchableWithoutFeedback>

            <ProfileModal location={location} secondaryHeaderText={secondaryHeaderText} headerText={headerText} modalVisible={modalVisible} setModalVisible={setModalVisible} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#cacaca',
        borderBottomColor: '#abaaaa',
        borderBottomWidth: 1,
        zIndex: 999
    },
    logo: {
        width: 90,
        height: 65,
        resizeMode: 'contain',
    },
    profileLogo: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    profileContainer: {
        position: 'relative',
    },
    greenIndicator: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        right: -3,
        top: -2.3,
    },
    textContainer: {
        alignItems: 'center',
    },
    secondaryHeaderText: {
        fontSize: 12,
        fontWeight: '600',
        marginRight: 65,
        marginTop: -3,
    },
    headerText: {
        fontSize: 18,
        marginRight: 25,
        fontWeight: '900',
        color: 'black',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        width: '100%',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});
