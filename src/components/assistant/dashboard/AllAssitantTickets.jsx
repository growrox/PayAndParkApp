import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useTranslation } from 'react-i18next';
import SearchableTicketList from './components/SearchableTicketList';
import { url } from '../../../utils/url';
import moment from 'moment';
import { useSelector } from 'react-redux';

function isTicketExpired(expiryDate) {
    if (!expiryDate) {
        return true
    }
    const ticketExpiry = new Date(expiryDate);
    // console.log("ticketExpiry", ticketExpiry);
    const now = new Date();
    // console.log("now", now);
    // console.log("now > ticketExpiry;", now > ticketExpiry);
    return now > ticketExpiry;
}


export default function AllAssitantTickets({ navigation }) {
    const { t } = useTranslation();
    const { role } = useSelector((state) => state.auth);

    const renderTicket = ({ item, index }) => (
        <TouchableOpacity key={`${item._id}${index}`} onPress={() => onCardClick(item)} style={styles.cardWrapper}>
            <View key={item._id} style={styles.ticket}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        ...styles.expiredBadge,
                        backgroundColor: "orange",
                        marginHorizontal: 4,
                    }}>
                        <Text style={{ color: '#ffffff' }}>{item.isPass ? t("Pass") : t("Ticket")}</Text>
                    </View>
                    <View style={{
                        ...styles.settledBadge,
                        ...(item?.status === 'settled' ? { backgroundColor: '#2ecc71' } : { backgroundColor: "#e74c3c" }),
                        marginHorizontal: 4,
                    }}>
                        <Text style={{ color: '#ffffff' }}>{item?.status === 'settled' ? t("Settled") : t("Unsettled")}</Text>
                    </View>
                </View>

                <View style={{ ...styles.ticketRow, marginTop: 10 }}>
                    <Text style={styles.ticketText}>{t("Ticket")}: PNP24-0830-000{index + 1}</Text>
                    <Text style={{ ...styles.ticketText, color: isTicketExpired(item?.ticketExpiry) ? 'red' : '#000' }}>
                        {isTicketExpired(item?.ticketExpiry) ?
                            t("Expired") :
                            moment.utc(item.createdAt).local().format('DD/MM/YY, h:mm A')
                        }
                    </Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.ticketRow}>
                    <Text style={styles.ticketText}>{t("Veh No")}: {String(item.vehicleNumber).toLocaleUpperCase()}</Text>
                    <Text style={styles.ticketText}>{`${item.paymentMode} / ${item.amount}`}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );


    const onCardClick = (item) => {
        navigation.navigate('PaymentDetails', {
            userEnteredData: {
                ...item,
                type: 'ticketDetailsPreview'
            }
        });
    };

    return (
        <View style={styles.container}>
            <DashboardHeader headerText={t('Profile')} secondaryHeaderText={'ASSISTANT'} />
            <View style={styles.container}>
                {console.log("role", role)}
                <SearchableTicketList
                    endpoint={`${url}/api/v1/parking-assistant/tickets`}
                    navigation={navigation}
                    renderItem={renderTicket}
                    headerText={t('Profile')}
                    noDataText={t("No ticket created yet")}
                    searchPlaceholder={t("Search")}
                    clearButtonText={t("Clear")}
                />
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    searchContainer: {
        padding: 16,
    },
    searchContainerChild: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 30,
    },
    searchLogo: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    clearButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        margin: 2,
    },
    clearButtonText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    flatListContent: {
        paddingBottom: 20,
    },
    cardWrapper: {
        paddingHorizontal: 16,
    },
    ticket: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingRight: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    settledBadge: {
        width: 80,
        height: 23,
        alignItems: 'center',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 8
    },
    expiredBadge: {
        width: 80,
        height: 23,
        alignItems: 'center',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 0
    },
    ticketRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    ticketText: {
        fontSize: 14,
        color: '#000',
    },
    separator: {
        height: 1.4,
        backgroundColor: '#FFFFFF',
        marginVertical: 8,
    },
    noDataContainer: {
        borderWidth: 0.4,
        padding: 8,
        marginRight: 20,
        marginLeft: 20,
        marginTop: 0,
        borderColor: '#D0D0D0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        color: '#000',
    },
});
