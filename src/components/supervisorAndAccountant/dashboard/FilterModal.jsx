import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import DatePickerModal from '../../DatePickerModal';
import moment from 'moment';

const FilterModal = ({
    isVisible, onClose,
    shiftFilters,
    handleApplyFilters,
    selectedShiftFilter,
    setSelectedShiftFilter,
    statusQuery,
    setStatusQuery,
    date,
    setDate
}) => {
    const [isClear, setClear] = useState(false);
    const isFirstRender = useRef(true);
    const { role } = useSelector(state => state.auth);
    const { t } = useTranslation();
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())

    const toggleFilter = (filter) => {
        if (selectedShiftFilter === filter) {
            setSelectedShiftFilter('');
        } else {
            setSelectedShiftFilter(filter);
        }
    };

    const toggleFilterStatus = (filter) => {
        if (statusQuery === filter) {
            setStatusQuery('');
        } else {
            setStatusQuery(filter);
        }
    };

    const clearFilters = () => {
        setSelectedShiftFilter('');
        setStatusQuery('');
        setClear(prev => !prev);
    };

    const clearDateFilters = () => {
        setDate({
            selectedStartDate: '',
            selectedEndDate: ''
        })
        setClear(prev => !prev);
    };

    useEffect(() => {
        if (!isFirstRender.current) {
            handleApplyFilters();
        } else {
            isFirstRender.current = false;
        }
    }, [isClear]);

    const chunkArray = (arr, chunkSize) => {
        let index = 0;
        const arrayLength = arr?.length;
        const tempArray = [];

        for (index = 0; index < arrayLength; index += chunkSize) {
            const chunk = arr.slice(index, index + chunkSize);
            tempArray.push(chunk);
        }

        return tempArray;
    };

    const rowsOfButtons = chunkArray(shiftFilters, 2);

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
                        <Text style={styles.modalTitle}>{t("Filter Options")}</Text>

                        {role === "accountant" ?
                            <View style={styles.container}>
                            <TouchableOpacity style={styles.buttonDate} onPress={() => setOpenStartDate(true)}>
                                <Text style={styles.label}>{t("Start Date")}:</Text>
                                <Text style={styles.dateButtonText}>
                                    {date?.selectedStartDate ? moment(date?.selectedStartDate).format('YYYY-MM-DD') : t("Select Start Date")}
                                </Text>
                            </TouchableOpacity>
                    
                            <TouchableOpacity style={styles.buttonDate} onPress={() => setOpenEndDate(true)}>
                                <Text style={styles.label}>{t("End Date")}:</Text>
                                <Text style={styles.dateButtonText}>
                                    {date?.selectedEndDate ? moment(date?.selectedEndDate).format('YYYY-MM-DD') : t("Select End Date")}
                                </Text>
                            </TouchableOpacity>
                        </View>
                            :
                            <>
                                <Text style={styles.filterStatusTitle}>{t("Filter by status")}</Text>

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
                                        ]}>{t("Online")}</Text>
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
                                        ]}>{t("Offline")}</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.filterShiftTitle}>{t("Filter by shift")}</Text>

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
                            </>
                        }
                        <TouchableOpacity style={styles.clearButton} onPress={() => { role === "accountant" ? clearDateFilters() : clearFilters() }}>
                            <Text style={styles.clearButtonText}>{t("Remove Filters")}</Text>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleApplyFilters}>
                                <Text style={styles.buttonText}>{t("Apply")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
                                <Text style={styles.buttonText}>{t("Close")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <DatePickerModal
                date={startDate}
                setDate={setStartDate}
                open={openStartDate}
                setOpen={setOpenStartDate}
                setSelectedDate={setDate}
                type="startDate"
            />
            <DatePickerModal
                date={endDate}
                setDate={setEndDate}
                open={openEndDate}
                setOpen={setOpenEndDate}
                setSelectedDate={setDate}
                type="endDate"
            />
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
    filterStatusTitle: {
        fontWeight: '500',
        marginBottom: 10,
    },
    filterShiftTitle: {
        fontWeight: '500',
        marginBottom: 10,
        marginTop: 10,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    filterButton: {
        paddingVertical: 10,
        paddingHorizontal: 4,
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
    container: {
        padding: 16,
    },
    buttonDate: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    label: {
        paddingRight: 8,
        fontSize: 16,
        color: '#333',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#555',
    },
});

export default FilterModal;
