import * as React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useTranslation } from 'react-i18next';

export default function TimeSlot({ navigation, route }) {
    const { selectedVehicle, vehicleName } = route.params;
    const { t } = useTranslation();

    const handleCardPress = (slot, amount) => {
        // console.log(`Selected time slot type: ${slot}`);
        // if (slot === 'All Month Pass') {
        //     return
        // }
        navigation.navigate('VehiclePaymentEntry', { selectedTime: slot, selectedAmount: amount, selectedVehicle: selectedVehicle.name })
    };

    return (
        <View style={styles.container}>
            <DashboardHeader
                headerText={t('Profile')}
                secondaryHeaderText={'ASSISTANT'}
            />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.subHeader}>
                    <Text style={styles.subHeaderText}>{t("Select Time Slot")}</Text>
                    <Text style={styles.subdiscText}>{t("Vehicle Type")}: {vehicleName}</Text>
                </View>

                <View style={styles.cardContainer}>
                    {selectedVehicle.hourlyPrices.map((_d, i) => {
                        return (
                            <React.Fragment key={_d._id}>
                                {_d.hour == 720 ?
                                    <TouchableOpacity
                                        style={{ ...styles.collectionCard, justifyContent: 'center' }}
                                        onPress={() => handleCardPress(_d.hour, _d.price)}
                                    >
                                        <Text style={styles.cardTitle}>{t("All Month Pass")}</Text>
                                    </TouchableOpacity> :
                                    <TouchableOpacity
                                        style={styles.collectionCard}
                                        onPress={() => handleCardPress(_d.hour, _d.price)}
                                    >
                                        <Text style={styles.cardTitle}>{_d.hour} {t("Hours")}</Text>
                                        <Text style={styles.cardTitle}>{_d.price} {t("Rs")}</Text>
                                    </TouchableOpacity>}
                            </React.Fragment>
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
        marginBottom: 60,
        marginTop: 10,
    },
    subHeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
    },
    subdiscText: {
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
        fontWeight: '500',
        marginTop: 5
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
