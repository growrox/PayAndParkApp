import * as React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useTranslation } from 'react-i18next';

export default function VehicleType({ navigation, route }) {

    const { t } = useTranslation();

    const { vehicleTypes } = route.params;


    const handleCardPress = (data, name) => {
        // console.log(`Selected vehicle type: ${data}`);
        navigation.navigate('TimeSlot', { selectedVehicle: data, vehicleName: name })
    };

    return (
        <View style={styles.container}>
            <DashboardHeader
                headerText={t('Profile')}
                secondaryHeaderText={'ASSISTANT'}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.subHeader}>
                    <Text style={styles.subHeaderText}>{t("Select Vehicle Type")}</Text>
                </View>

                <View style={styles.cardContainer}>

                    {vehicleTypes.map((_d, _i) => {
                        return (
                            <TouchableOpacity
                                key={_d._id}
                                style={styles.collectionCard}
                                onPress={() => handleCardPress(_d, _d.name)}
                            >
                                <Image
                                    src={_d.image}
                                    style={styles.cardIcon}
                                />
                                <Text style={styles.cardTitle}>{_d.name}</Text>
                            </TouchableOpacity>
                        )
                    })}

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
        width: 100,
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
