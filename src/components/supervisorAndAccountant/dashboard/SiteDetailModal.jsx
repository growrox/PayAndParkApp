import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity } from 'react-native';

const SiteDetailModal = ({ isVisible, setVisible, siteDetail }) => {
    const handleBackgroundPress = () => {
        setVisible(false);
    };

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={() => setVisible(false)}
        >
            <TouchableWithoutFeedback onPress={handleBackgroundPress}>
                <View style={styles.modalBackground}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            
                            {siteDetail.vehicleType ? (
                                <>
                                    <Text style={styles.modalTitle}>Site Details</Text>
                                    <Text style={styles.modalText}>Vehicle Type: {siteDetail.vehicleType || 'N/A'}</Text>
                                    <Text style={styles.modalText}>Tickets: {siteDetail.tickets || 'N/A'}</Text>
                                </>
                            ) : (
                                <ActivityIndicator size="large" color="#007BFF" />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
        width: '85%',
        maxWidth: 350,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        alignItems: 'center',
        elevation: 5, 
        shadowColor: '#000000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        padding: 5,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 20,
        color: '#333333',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333333',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333333',
    },
});

export default SiteDetailModal;
