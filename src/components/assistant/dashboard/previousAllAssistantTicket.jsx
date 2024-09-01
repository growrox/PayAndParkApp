import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, FlatList } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_LOG_OUT } from '../../../redux/types';
import { url } from '../../../utils/url';
import { Spinner } from '../../../utils/Spinner';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';

export default function AllAssitantTickets({ navigation }) {
    const [allTickets, setAllTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [isFetchingMore, setFetchingMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [isNoData, setNoData] = useState(false);
    const { token, userId, appLanguage } = useSelector(state => state.auth);
    const toast = useToast();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const fetchTickets = useCallback(
        debounce(async (query, page) => {
            try {
                let pageSize = 10;
                const finalURL = `${url}/api/v1/parking-assistant${query ? "/global/tickets" : "/tickets"}?page=${page}&pageSize=${pageSize}&searchQuery=${query}`;
                const response = await fetch(finalURL, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-client-source': 'app',
                        'userId': userId,
                        'Authorization': `Bearer ${token}`,
                        'client-language': appLanguage
                    },
                });

                const data = await response?.json();
                // console.log('parking-tickets data', data?.result?.data);

                if (response.status === 200) {
                    if (data?.result && data?.result?.data) {
                        setAllTickets(page === 1 ? data?.result?.data : [...allTickets, ...data?.result?.data]);
                    }
                } else if (response.status === 401 || response.status === 406) {
                    dispatch({
                        type: AUTH_LOG_OUT,
                        payload: {
                            token: "",
                            location: "",
                            role: "",
                            phoneNo: "",
                            userId: "",
                            name: ""
                        }
                    });
                } else {
                    const toastType = response.status >= 400 ? 'danger' : 'warning';
                    const messageData = response.status >= 400 ? data.error : data.message;
                    toast.show(messageData, { type: toastType, placement: 'top' });
                }
                if (data.message === "No tickets found" || data?.result?.data?.length !== pageSize) {
                    setNoData(true);
                } else {
                    setNoData(false);
                }
            } catch (error) {
                toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
                console.log('error.message', error.message);
                setLoading(false);
                setFetchingMore(false);
            } finally {
                setLoading(false);
                setFetchingMore(false);
            }
        }, 1000),
        [allTickets, appLanguage, dispatch, token, userId, toast]
    );

    useEffect(() => {
        fetchTickets(searchQuery, pageNumber);
    }, [searchQuery, pageNumber]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setPageNumber(1);
        setAllTickets([]);
    };

    const loadMoreTickets = () => {
        if (isNoData || isFetchingMore) return;
        setFetchingMore(true);
        setPageNumber(prevPage => prevPage + 1);
    };

    const onCardClick = (item) => {
        navigation.navigate('PaymentDetails', {
            userEnteredData: {
                ...item,
                type: 'ticketDetailsPreview'
            }
        });
    };

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

    const renderTicket = ({ item, index }) => (
        <TouchableOpacity key={item._id} onPress={() => onCardClick(item)} style={styles.cardWrapper}>
            <View key={item._id} style={styles.ticket}>
                <View style={{ ...styles.settledBadge, ...(item?.status === 'settled' ? { backgroundColor: '#2ecc71' } : { backgroundColor: "#e74c3c" }) }}>
                    <Text style={{ color: '#ffffff' }}>{item?.status === 'settled' ? t("Settled") : t("Unsettled")}</Text>
                </View>
                <View style={{ ...styles.expiredBadge, backgroundColor: "orange" }}>
                    <Text style={{ color: '#ffffff' }}>{item.isPass ? t("Pass") : t("Ticket")}</Text>
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

    return (
        <View style={styles.container}>
            <DashboardHeader headerText={t('Profile')} secondaryHeaderText={'ASSISTANT'} />
            <View style={styles.searchContainer}>
                <View style={styles.searchContainerChild}>
                    <Image source={require('../../../utils/images/search.png')} style={styles.searchLogo} />
                    <TextInput
                        style={styles.searchBar}
                        placeholder={t("Search")}
                        placeholderTextColor={'grey'}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                            <Text style={styles.clearButtonText}>{t("Clear")}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
            {isLoading ? (
                <Spinner bottomMargin={30} />
            ) : (
                <>
                    {allTickets?.length < 1 ? (
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>{t("No ticket created yet")}!</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={allTickets}
                            renderItem={renderTicket}
                            keyExtractor={(item) => item._id}
                            onEndReached={loadMoreTickets}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={isFetchingMore && <Spinner size={30} bottomMargin={10} />}
                            contentContainerStyle={styles.flatListContent}
                        />
                    )}
                </>
            )}
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
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    settledBadge: {
        position: 'absolute',
        top: -1.2,
        left: 175,
        width: 80,
        height: 23,
        // justifyContent: 'center',
        alignItems: 'center',
        // alignSelf: 'center',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 8
      },
    expiredBadge: {
        position: 'absolute',
        top: -1.2,
        left: 90,
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
