import * as React from 'react';
import { Text, View, TouchableWithoutFeedback, StyleSheet, Image, Modal, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import ProfileModal from '../profile/ProfileModal';
import { useNavigation } from '@react-navigation/native';

export default function DashboardHeader({ headerText, secondaryHeaderText }) {
    const navigation = useNavigation()
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = React.useState(false);

    const handleLogoPress = () => {
        navigation.navigate('Home');

    };

    const handleProfilePress = () => {
        console.log('Profile pressed');
        setModalVisible(true);

    };

    return (
        <View style={styles.header}>
            <TouchableWithoutFeedback onPress={handleLogoPress}>
                <Image
                    source={require('../../utils/images/Logo.png')}
                    style={styles.logo}
                />
            </TouchableWithoutFeedback>
            {/* <View style={styles.textContainer}>
                <Text style={styles.headerText}>{headerText}</Text>
                <Text style={styles.secondaryHeaderText}>{secondaryHeaderText}</Text>
            </View> */}
            <TouchableWithoutFeedback onPress={handleProfilePress}>
                <Image
                    source={require('../../utils/images/profile-icon.png')}
                    style={styles.profileLogo}
                />
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
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    profileLogo: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
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
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    modalImage: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
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
