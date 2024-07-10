import * as React from 'react';
import { Text, View, TouchableWithoutFeedback, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProfileModal from '../profile/ProfileModal';
import { useNavigation } from '@react-navigation/native';

export default function DashboardHeader({ headerText, secondaryHeaderText }) {
    const navigation = useNavigation()
    const [modalVisible, setModalVisible] = React.useState(false);
    const { isClockedIn } = useSelector(state => state.auth)


    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    const handleProfilePress = () => {
        // console.log('Profile pressed');
        setModalVisible(true);
    };

    return (
        <View style={styles.header}>
            <TouchableWithoutFeedback onPress={handleLogoPress}>
                <Image
                    source={require('../../utils/images/Logo-without-bg.png')}
                    style={styles.logo}
                />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={handleProfilePress}>
                <View style={styles.profileContainer}>
                    <Image
                        source={require('../../utils/images/profile-icon.png')}
                        style={styles.profileLogo}
                    />
                    <View style={{ ...styles.greenIndicator, backgroundColor: isClockedIn ? 'green' : '#CB2027' }} />
                </View>
            </TouchableWithoutFeedback>

            <ProfileModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
        // borderBottomColor: '#cacaca',
        // borderBottomWidth: 1
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
