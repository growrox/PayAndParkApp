import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';

const ConfirmationModal = ({ isVisible, handleSettleAmount, handleClose, totalCollected, cashComponents }) => {
    const { t } = useTranslation();

    const [cashData, setCashData] = useState([
        { id: 1, denomination: 500, count: 0 },
        { id: 2, denomination: 200, count: 0 },
        { id: 3, denomination: 100, count: 0 },
        { id: 4, denomination: 50, count: 0 },
        { id: 5, denomination: 20, count: 0 },
        { id: 6, denomination: 10, count: 0 },
        { id: 7, denomination: 5, count: 0 },
        { id: 8, denomination: 2, count: 0 },
        { id: 9, denomination: 1, count: 0 },
    ]);

    // const calculateTotal = () => {
    //     return cashData.reduce((acc, item) => acc + item.denomination * item.count, 0);
    // };

    // useEffect(() => {
    //     console.log("hit modal");

    //     calculateTotal();
    // }, [cashData]);

    useEffect(()=>{
        setCashData([
            { id: 1, denomination: 500, count: cashComponents?.['500'] ?? 0 },
            { id: 2, denomination: 200, count: cashComponents?.['200'] ?? 0 },
            { id: 3, denomination: 100, count: cashComponents?.['100'] ?? 0 },
            { id: 4, denomination: 50, count: cashComponents?.['50'] ?? 0},
            { id: 5, denomination: 20, count: cashComponents?.['20'] ?? 0},
            { id: 6, denomination: 10, count: cashComponents?.['10'] ?? 0},
            { id: 7, denomination: 5, count: cashComponents?.['5'] ?? 0},
            { id: 8, denomination: 2, count: cashComponents?.['2'] ?? 0},
            { id: 9, denomination: 1, count: cashComponents?.['1'] ?? 0},
        ])
    }, [cashComponents])

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.headerText}>{t("Please confirm the settlement amount")}</Text>

                    <View style={styles.table}>
                        <View style={[styles.row, styles.headerRow]}>
                            <Text style={styles.headerCell}>{t("Cash Denominations")}</Text>
                            <Text style={styles.headerCell}>{t("Cash Count")}</Text>
                            <Text style={styles.headerCell}>{t("Total")}</Text>
                        </View>
                        {cashData.map((item) => (
                            <View key={item.id} style={styles.row}>
                                <Text style={styles.cell}>{item.denomination}</Text>
                                <Text style={styles.cell}>{item.count}</Text>
                                <Text style={styles.cell}>{item.denomination * item.count}</Text>
                            </View>
                        ))}
                        <View style={[styles.row, styles.footerRow]}>
                            <Text style={styles.footerCell}>{t("Total Cash")}</Text>
                            <Text style={styles.footerCell}></Text>
                            <Text style={styles.footerCell}>{totalCollected ?? 0}</Text>
                        </View>

                    </View>

                    {/* <Text style={styles.modalText}>{t("Collected Cash")}: {settlementAmount}</Text> */}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                            <Text style={styles.buttonText}>{t("Cancel")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={() => {
                            handleClose();
                            handleSettleAmount();
                        }}>
                            <Text style={styles.buttonText}>{t("Confirm")}</Text>
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
        paddingHorizontal: -4,
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%',
        maxWidth: 500,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#416DEC',
        textAlign: 'center',
        // marginVertical: 10,
        marginBottom: 20,
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
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        textAlign: 'center',
    },
    headerCell: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        fontWeight: '600',
        borderColor: '#ddd',
        textAlign: 'center',
        backgroundColor: '#f2f2f2',
    },
    headerRow: {
        backgroundColor: '#f2f2f2',
    },
    footerRow: {
        backgroundColor: '#f2f2f2',
    },
    footerCell: {
        flex: 1,
        padding: 10,
        fontWeight: '600',
        borderColor: '#ddd',
        textAlign: 'center',
        borderBottomWidth: 0,
    },
});

export default ConfirmationModal;
