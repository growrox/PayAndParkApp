import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const FilterModal = ({ isVisible, onClose, shiftFilters, handleApplyFilters, selectedShiftFilter, setSelectedShiftFilter, statusQuery, setStatusQuery }) => {

    const toggleFilter = (filter) => {
        if (selectedShiftFilter === filter) {
            setSelectedShiftFilter('')
        } else {
            setSelectedShiftFilter(filter)
        }
    };

    const toggleFilterStatus = (filter) => {
        if (statusQuery === filter) {
            setStatusQuery('')
        } else {
            setStatusQuery(filter)
        }
    };

    const clearFilters = () => {
        setSelectedShiftFilter('')
        setStatusQuery('')
    };

    const chunkArray = (arr, chunkSize) => {
        let index = 0;
        const arrayLength = arr.length;
        const tempArray = [];

        for (index = 0; index < arrayLength; index += chunkSize) {
            const chunk = arr.slice(index, index + chunkSize);
            tempArray.push(chunk);
        }

        return tempArray;
    };

    const rowsOfButtons = chunkArray(shiftFilters, 2);
    // console.log("rowsOfButtons", rowsOfButtons);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Filter Options</Text>

                        <Text style={{ fontWeight: '500', marginBottom: 10 }}>Filter by status</Text>

                        <View style={styles.filterRow}>

                            <TouchableOpacity
                                style={[
                                    styles.filterButton,
                                    statusQuery === "isOnline" && styles.filterButtonSelected,
                                    { marginRight: 6 }
                                ]}
                                onPress={() => toggleFilterStatus("isOnline")}
                            >
                                <Text style={[
                                    styles.filterButtonText,
                                    statusQuery === "isOnline" && styles.filterButtonSelectedText
                                ]}>Online</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.filterButton,
                                    statusQuery === "isOffline" && styles.filterButtonSelected,
                                ]}
                                onPress={() => toggleFilterStatus("isOffline")}
                            >
                                <Text style={[
                                    styles.filterButtonText,
                                    statusQuery === "isOffline" && styles.filterButtonSelectedText
                                ]}>Offline</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontWeight: '500', marginBottom: 10, marginTop: 10 }}>Filter by shift </Text>

                        {rowsOfButtons.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.filterRow}>
                                {row.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.filterButton,
                                            selectedShiftFilter === item._id && styles.filterButtonSelected,
                                            index === 0 && { marginRight: 6 }
                                        ]}
                                        onPress={() => toggleFilter(item._id)}
                                    >
                                        <Text style={[
                                            styles.filterButtonText,
                                            selectedShiftFilter === item._id && styles.filterButtonSelectedText
                                        ]}>{item.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                            <Text style={styles.clearButtonText}>Remove Filter</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleApplyFilters}>
                                <Text style={styles.buttonText}>Apply</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#167afa',
        width: '48%',
        alignItems: 'center',
    },
    filterButtonSelected: {
        backgroundColor: '#167afa',
        borderColor: '#167afa',
    },
    filterButtonText: {
        color: '#167afa',
        fontWeight: 'bold',
    },
    filterButtonSelectedText: {
        color: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#167afa',
        marginHorizontal: 10,
    },
    clearButton: {
        marginTop: 24,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#f0ad4e',
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    closeButton: {
        backgroundColor: '#d9534f',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FilterModal;
