import * as React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import DashboardHeader from '../dashboard/DashboardHeader';

export default function VehicleType({ navigation }) {


    const handleCardPress = (title) => {
        console.log(`Selected vehicle type: ${title}`);
        navigation.navigate('TimeSlot', { selectedVehicle: title })
    };

    return (
        <View style={styles.container}>
            <DashboardHeader
                headerText={'Assistant'}
                secondaryHeaderText={'Profile'}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.subHeader}>
                    <Text style={styles.subHeaderText}>Select Vehicle Type</Text>
                </View>

                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        style={styles.collectionCard}
                        onPress={() => handleCardPress('Bike')}
                    >
                        <Image
                            source={require('../../utils/images/ticket/bike.png')}
                            style={styles.cardIcon}
                        />
                        <Text style={styles.cardTitle}>Bike</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.collectionCard}
                        onPress={() => handleCardPress('Car')}
                    >
                        <Image
                            source={require('../../utils/images/ticket/car.png')}
                            style={styles.cardIcon}
                        />
                        <Text style={styles.cardTitle}>Car</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.collectionCard}
                        onPress={() => handleCardPress('Light Vehicle')}
                    >
                        <Image
                            source={require('../../utils/images/ticket/truck.png')}
                            style={styles.cardIcon}
                        />
                        <Text style={styles.cardTitle}>Light Vehicle</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.collectionCard}
                        onPress={() => handleCardPress('Heavy Vehicle')}
                    >
                        <Image
                            source={require('../../utils/images/ticket/heavy-vehicle.png')}
                            style={styles.cardIcon}
                        />
                        <Text style={styles.cardTitle}>Heavy Vehicle</Text>
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
        marginBottom: 38,
        marginTop: -14
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
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
    },
    cardIcon: {
        width: 80,
        height: 80,
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});
