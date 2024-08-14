import * as React from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';

const QRModal = ({ modalVisible, setModalVisible }) => {

    const handleOutsidePress = () => {
        setModalVisible(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <TouchableWithoutFeedback onPress={handleOutsidePress}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <Image
                                source={require('../../../utils/images/QR/QRImage.jpeg')}
                                style={styles.image}
                            />
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
        width: '96%',
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        padding: 6,
    },
    image: {
        width: '100%',
        height: 370,
        resizeMode: 'contain',
    },
});

export default QRModal;
