import * as React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import DashboardHeader from '../dashboard/DashboardHeader';

export default function TimeSlot({ navigation, route }) {
    const { selectedVehicle } = route.params;

    React.useEffect(() => {
        console.log('selectedVehicle', selectedVehicle);
    }, [selectedVehicle])

    const handleCardPress = (slot) => {
        console.log(`Selected time slot type: ${slot}`);
        navigation.navigate('VehiclePaymentEntry', { selectedTimeSlot: slot, selectedVehicle })
    };

    return (
        <View style={styles.container}>
            <DashboardHeader
                headerText={'Assistant'}
                secondaryHeaderText={'Profile'}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.subHeader}>
                    <Text style={styles.subHeaderText}>Select Time Slot</Text>
                </View>

                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.collectionCard}
                        onPress={() => handleCardPress('6 Hours')}
                    >
                        <Text style={styles.cardTitle}>6 Hours</Text>
                        <Text style={styles.cardTitle}>18 Rs</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.collectionCard}
                        onPress={() => handleCardPress('12 Hours')}
                    >
                        <Text style={styles.cardTitle}>12 Hours</Text>
                        <Text style={styles.cardTitle}>30 Rs</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.collectionCard}
                        onPress={() => handleCardPress('24 Hours')}
                    >
                        <Text style={styles.cardTitle}>24 Hours</Text>
                        <Text style={styles.cardTitle}>129 Rs</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.collectionCard, { justifyContent: 'center' }]}
                        onPress={() => handleCardPress('All Month Pass')}
                    >
                        <Text style={styles.cardTitle}>All Month Pass</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    scrollContainer: {
        padding: 16,
    },
    subHeader: {
        marginBottom: 60,
        marginTop: 10,
    },
    subHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },
    cardContainer: {
        marginBottom: 16,
    },
    collectionCard: {
        backgroundColor: '#167afa',
        borderRadius: 9,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardIcon: {
        width: 80,
        height: 80,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
    },
});
