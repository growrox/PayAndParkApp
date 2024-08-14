import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native';

const CashUpdateModal = ({ isVisible, onClose, cashData, setCashData }) => {
    const [cashCountData, setCashCountData] = useState(cashData);
    const { t } = useTranslation();
    // useEffect(() => {
    //     console.log('cashData', cashData);
    // }, [])
    const increment = (id) => {
        setCashCountData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, count: item.count + 1 } : item
            )
        );
    };

    const decrement = (id) => {
        setCashCountData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, count: Math.max(item.count - 1, 0) } : item
            )
        );
    };

    const handleInputChange = (id, value) => {
        setCashCountData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, count: parseInt(value, 10) || 0 } : item
            )
        );
    };

    const handleConfirm = () => {
        setCashData(cashCountData);
        // console.log("cashCountData.......", cashCountData);
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={() => {
                onClose();
                setCashCountData(cashData);
            }}
        >
            <TouchableWithoutFeedback onPress={() => {
                onClose();
                setCashCountData(cashData);
            }}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <Text style={styles.titleTop}>{t("Provide Cash Count")}</Text>
                            {cashCountData.map((data) => (
                                <View key={data.id} style={styles.row}>
                                    <Text style={styles.denominationText}>{data.denomination} {t("Rs")}</Text>
                                    <View style={styles.counterContainer}>
                                        <TouchableOpacity onPress={() => decrement(data.id)} style={styles.button}>
                                            <Text style={styles.buttonText}>-</Text>
                                        </TouchableOpacity>
                                        <TextInput
                                            style={styles.input}
                                            value={data.count.toString()}
                                            onChangeText={(value) => {
                                                // below regex for removing a non numeric characters including dot and comma
                                                const filteredValue = value.replace(/[^0-9]/g, '');
                                                handleInputChange(data.id, filteredValue);
                                            }}
                                            keyboardType='numeric'
                                        />

                                        <TouchableOpacity onPress={() => increment(data.id)} style={styles.button}>
                                            <Text style={styles.buttonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                            <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                                <Text style={styles.confirmButtonText}>{t("Confirm")}</Text>
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
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    titleTop: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 5,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#E5E5E5',
        padding: 6,
    },
    denominationText: {
        fontSize: 18,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#223C83',
        width: 25,
        height: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 8,
    },
    buttonText: {
        fontSize: 18,
        color: '#FFFFFF'
    },
    input: {
        width: 50,
        height: 25,
        padding: 4,
        borderColor: '#223C83',
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 8,
        backgroundColor: '#EFEFEF'
    },
    countText: {
        fontSize: 18,
        marginRight: 3,
        marginLeft: 3
    },
    confirmButton: {
        marginTop: 20,
        backgroundColor: '#223C83',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default CashUpdateModal;
