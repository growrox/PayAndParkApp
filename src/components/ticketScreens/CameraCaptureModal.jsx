import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import CameraCapture from './cameraCapture/CameraCapture';

const CameraCaptureModal = ({ isVisible, handleCapture, handleCloseCaptureModal, setIsCapturing }) => {

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={handleCloseCaptureModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <CameraCapture onCapture={(uri, path) => handleCapture(uri, path)} setIsCapturing={setIsCapturing} />
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
    modalText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
        // marginBottom: 10,
        textAlign: 'center',
    },
});

export default CameraCaptureModal;
