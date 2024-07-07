import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, FlatList } from 'react-native';
import DashboardHeader from './DashboardHeader';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_LOG_OUT } from '../../redux/types';
import { url } from '../../utils/url';
import { Spinner } from '../../utils/Spinner';
import moment from 'moment';

export default function AllAssitantTickets({ navigation }) {
    const [allTickets, setAllTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading] = useState(true);
    const [isFetchingMore, setFetchingMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [isNoData, setNoData] = useState(false);
    const { token, userId } = useSelector(state => state.auth);
    const toast = useToast();
    const dispatch = useDispatch();

    useEffect(() => {
        fetchAllTickets(pageNumber);
    }, [pageNumber]);

    const fetchAllTickets = async (page) => {
        try {
            const response = await fetch(`${url}/api/v1/parking-assistant/tickets?pageNumber=${page}&searchQuery=${searchQuery}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'userId': userId,
                    'Authorization': `Bearer ${token}`,
                    'page_limit': 10,
                },
            });

            const data = await response.json();
            console.log('parking-tickets data', data);

            if (data.message === "No tickets found") {
                setNoData(true);
            }

            if (response.status === 200) {
                if (data.result && data.result.data) {
                    setAllTickets(page === 1 ? data.result.data : [...allTickets, ...data.result.data]);
                }
            } else if ([401, 406].includes(response.status)) {
                dispatch({ type: AUTH_LOG_OUT, payload: {} });
            } else {
                toast.show(data.message, { type: response.status >= 500 ? 'danger' : 'warning', placement: 'top' });
            }

            setLoading(false);
            setFetchingMore(false);
        } catch (error) {
            toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
            console.log('error.message', error.message);
            setLoading(false);
            setFetchingMore(false);
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const handleSubmitSearch = async () => {
        if (searchQuery.length < 1) {
            toast.show('Please enter any keyword to search', { type: 'warning', placement: 'top' });
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
        console.log('onCardClick, item', item);
        navigation.navigate('PaymentDetails', { userEnteredData: {
            ...item,
            type: 'ticketDetailsPreview'
        } });
    };

    const renderTicket = ({ item, index }) => (
        <TouchableOpacity key={item._id} onPress={() => onCardClick(item)} style={styles.cardWrapper}>
            <View key={item._id} style={styles.ticket}>
                <View style={styles.ticketRow}>
                    <Text style={styles.ticketText}>Ticket #0{index + 1}</Text>
                    <Text style={styles.ticketText}>{moment(item.createdAt).format('MM/DD/YYYY h:mm')}</Text>
                </View>
                <View style={styles.separator} />

                <View style={styles.ticketRow}>
                    <Text style={styles.ticketText}>Vehicle No {item.vehicleNumber}</Text>
                    <Text style={styles.ticketText}>{item.paymentMode}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <DashboardHeader headerText={'Assistant'} secondaryHeaderText={'Profile'} />
            <View style={styles.searchContainer}>
                <View style={styles.searchContainerChild}>
                    <Image source={require('../../utils/images/search.png')} style={styles.searchLogo} />
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search"
                        placeholderTextColor={'grey'}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <TouchableOpacity onPress={handleSubmitSearch} style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {isLoading ? (
                <Spinner bottomMargin={30} />
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
