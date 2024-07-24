import React from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';

const ConfirmationModal = ({ isVisible, handleSettleAmount, handleClose, settlementAmount }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.headerText}>Please confirm the settlement amount.</Text>
                    <Text style={styles.modalText}>Collected Cash: {settlementAmount}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={() => {
                            handleClose()
                            handleSettleAmount()
                        }}>
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
        minWidth: '80%',
        maxWidth: 400,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#416DEC',
        textAlign: 'center',
        marginVertical: 10,
    },
    modalText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#F38235',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#416DEC',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ConfirmationModal;
