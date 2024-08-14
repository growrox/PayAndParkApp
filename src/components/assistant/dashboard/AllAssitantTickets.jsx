import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, FlatList } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_LOG_OUT } from '../../../redux/types';
import { url } from '../../../utils/url';
import { Spinner } from '../../../utils/Spinner';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

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

    useEffect(() => {
        fetchAllTickets(pageNumber);
    }, [pageNumber]);

    const fetchAllTickets = async (page) => {
        try {
            let pageSize = 10;
            const response = await fetch(`${url}/api/v1/parking-assistant/tickets?page=${page}&pageSize=${pageSize}&searchQuery=${searchQuery}`, {
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
            console.log('parking-tickets data', data);



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
                const messageData = response.status >= 400 ? data.error : data.message
                toast.show(messageData, { type: toastType, placement: 'top' });
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }
            if (data.message === "No tickets found" || data?.result?.data?.length !== pageSize) {
                return setNoData(true);
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
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const handleSubmitSearch = async () => {
        if (searchQuery.length < 1) {
            toast.show(t('Please enter any keyword to search'), { type: 'warning', placement: 'top' });
            return;
        }
        setLoading(true);
        setPageNumber(1);
        fetchAllTickets(1);
    };

    const loadMoreTickets = () => {
        if (isNoData || isFetchingMore) return;
        setFetchingMore(true);
        setPageNumber(prevPage => prevPage + 1);

    };

    const onCardClick = (item) => {
        // console.log('onCardClick, item', item);
        navigation.navigate('PaymentDetails', {
            userEnteredData: {
                ...item,
                type: 'ticketDetailsPreview'
            }
        });
    };

    const renderTicket = ({ item, index }) => (
        <TouchableOpacity key={item._id} onPress={() => onCardClick(item)} style={styles.cardWrapper}>
            <View key={item._id} style={styles.ticket}>
                <View style={{ ...styles.settledBadge, ...(item?.status === 'settled' ? { backgroundColor: '#2ecc71' } : { backgroundColor: "#e74c3c" }) }}>
                    <Text style={{ color: '#ffffff' }}>{item?.status === 'settled' ? t("Settled") : t("Unsettled")}</Text>
                </View>
                <View style={{ ...styles.ticketRow, marginTop: 10 }}>
                    <Text style={styles.ticketText}>{t("Ticket")} #0{index + 1}</Text>
                    <Text style={styles.ticketText}>{moment(item.createdAt).format('MM/DD/YYYY h:mm')}</Text>
                </View>
                <View style={styles.separator} />

                <View style={styles.ticketRow}>
                    <Text style={styles.ticketText}>{t("Vehicle No")} {item.vehicleNumber}</Text>
                    <Text style={styles.ticketText}>{item.paymentMode}</Text>
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
                    <TouchableOpacity onPress={handleSubmitSearch} style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>{t("Search")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {isLoading ? (
                <Spinner bottomMargin={30} />
            ) : (

                <>
                    {allTickets?.length < 1 ? <View style={{ borderWidth: 0.4, padding: 8, marginRight: 20, marginLeft: 20, marginTop: 0, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.phone}>{t("No ticket created yet")}!</Text>
                    </View> : <FlatList
                        data={allTickets}
                        renderItem={renderTicket}
                        keyExtractor={(item) => item._id}
                        onEndReached={loadMoreTickets}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={isFetchingMore && <Spinner size={30} bottomMargin={10} />}
                        contentContainerStyle={styles.flatListContent}
                    />}
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
    searchButton: {
        backgroundColor: '#007bff',
        borderRadius: 5,
        paddingVertical: 10,
        paddingHorizontal: 16,
        margin: 2,
    },
    searchButtonText: {
        color: '#fff',
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
        width: 80,
        height: 23,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
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
});
