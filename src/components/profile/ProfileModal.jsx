import * as React from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useDispatch } from 'react-redux';
import { AUTH_LOG_OUT } from '../../redux/types';
import { useToast } from 'react-native-toast-notifications';

const ProfileModal = ({ modalVisible, setModalVisible }) => {
    const toast = useToast()
    const dispatch = useDispatch()
    const handleOutsidePress = () => {
        setModalVisible(false);
    };

    const handleLogout = () => {
        console.log('Logged out');
        setModalVisible(false);
        dispatch({
            type: AUTH_LOG_OUT,
            payload: {
                token: "",
                location: "",
                roleid: "",
                phoneNo: ""
            },
        });
        toast.show('You are logged out successfully!', { type: 'warning' });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                            {/* <Text style={styles.modalTitle}>Profile: <Text style={styles.modalSubtitle}>Assistant</Text></Text> */}
                            <Text style={styles.modalTitle}>Assistant Profile </Text>


                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={handleLogout}
                            >
                                <Text style={styles.logoutButtonText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#000',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
        marginTop: 25,
        marginLeft: 10
    },
    modalSubtitle: {
        fontSize: 18,
        fontWeight: 'normal',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#007bff',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    logoutButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ProfileModal;
