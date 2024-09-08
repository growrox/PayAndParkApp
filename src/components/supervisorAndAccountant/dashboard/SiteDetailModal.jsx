import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableWithoutFeedback, ActivityIndicator, TouchableOpacity } from 'react-native';

const SiteDetailModal = ({ isVisible, setVisible, siteDetail, setSiteDetail, isSiteClickLoading }) => {
    const handleBackgroundPress = () => {
        setVisible(false);
        setSiteDetail([])
    };
    // useEffect(() => {
    //     console.log("siteDetail", siteDetail);

    // }, [siteDetail])
    return (
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setVisible(false)
                setSiteDetail([])
            }}
        >
            <TouchableWithoutFeedback onPress={handleBackgroundPress}>
                <View style={styles.modalBackground}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>

                            {isSiteClickLoading ? <ActivityIndicator size="large" color="#007BFF" /> : <>
                                {siteDetail.length > 0 ?
                                    <>
                                        <Text style={styles.modalTitle}>Site Ticket Details</Text>

                                        <View style={styles.modalRow}>
                                            <Text style={{ ...styles.modalText, fontWeight: 'bold' }}>Vehicle Type</Text>
                                            <Text style={{ ...styles.modalText, fontWeight: 'bold' }}>Tickets</Text>
                                        </View>

                                        {siteDetail.map((d, i) => {
                                            return (
                                                <View style={styles.modalRow} key={i}>
                                                    <Text style={styles.modalText}>{d.vehicleType || 'N/A'}</Text>
                                                    <Text style={styles.modalText}>{d.count || 'N/A'}</Text>
                                                </View>
                                            )
                                        })}
                                    </>

                                    : (
                                        <Text style={{ ...styles.modalText, marginBottom: 0, }}>No Tickets Found!</Text>

                                    )}
                            </>}

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback >
        </Modal >
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
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginBottom: 10,
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
