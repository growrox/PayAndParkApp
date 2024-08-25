import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';

const VehicleSearchBar = ({
    recentVehicleNumbers,
    setVehicleSearchInput,
    selectedVechicleNumberId,
    setSelectedVechicleNumberId
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const data = recentVehicleNumbers.map(d => ({
        label: d.vehicleNumber,
        value: d._id
    }));

    const filteredData = data.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectItem = item => {
        setSelectedVechicleNumberId(item.value);
    };

    useEffect(() => {
        if (selectedVechicleNumberId) {
            setSearchTerm(
                data.find(d => d.value === selectedVechicleNumberId)?.label
            )
        }
    }, [selectedVechicleNumberId]);

    return (
        <View style={styles.container}>
            <View style={styles.dropdownMenu}>
                <TextInput
                    style={{ ...styles.inputSearch, ...(!selectedVechicleNumberId ? {} : { borderBottomWidth: 0.5 }) }}
                    placeholder="Search vehicle number"
                    value={searchTerm}
                    onChangeText={(text) => {
                        console.log("searchTerm--------", text);

                        setSearchTerm(text);
                        setVehicleSearchInput(text);
                    }}
                />
                {!selectedVechicleNumberId && (
                    <ScrollView style={styles.scrollContainer}>
                        {filteredData.map(item => (
                            <TouchableOpacity
                                key={item.value}
                                style={styles.item}
                                onPress={() => handleSelectItem(item)}
                            >
                                <Text style={styles.itemText}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingBottom: 50,
        paddingTop: 15,
        position: 'relative',
        flex: 1,
    },
    dropdownMenu: {
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        marginTop: 5,
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        zIndex: 1000,
        paddingHorizontal: 8,
    },
    inputSearch: {
        height: 40,
        fontSize: 16,
        paddingHorizontal: 8,
        borderBottomColor: 'gray',
    },
    scrollContainer: {
        maxHeight: 250,
    },
    item: {
        padding: 10,
    },
    itemText: {
        fontSize: 16,
    },
});

export default VehicleSearchBar;
