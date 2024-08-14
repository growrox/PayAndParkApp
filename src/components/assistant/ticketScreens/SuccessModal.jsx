import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const SuccessModal = ({ isVisible }) => {
    const navigation = useNavigation();
    const { t } = useTranslation();

    const onNavigateHome = () => {
        navigation.navigate('Home');
    };

    // Disable closing modal on tap outside or pressing hardware back button
    const onRequestClose = () => { };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onRequestClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>✓ {t("Successfully Created")}</Text>
                    <Text style={styles.modalSubText}>{t("Your ticket has been created successfully")}.</Text>
                    <TouchableOpacity style={styles.modalButton} onPress={onNavigateHome}>
                        <Text style={styles.modalButtonText}>{t("Go to Home Page")}</Text>
                    </TouchableOpacity>
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
        marginBottom: 10,
        textAlign: 'center',
    },
    modalSubText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    modalButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 4,
        width: '80%', // Adjust button width as needed
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SuccessModal;
