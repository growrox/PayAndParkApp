import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH_LOG_OUT } from '../../../redux/types';
import { url } from '../../../utils/url';
import { Spinner } from '../../../utils/Spinner';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import FilterModal from '../dashboard/FilterModal';

export default function SettledTickets({ navigation }) {
    const { token, userId, appLanguage } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const toast = useToast();
    const { t } = useTranslation();
    // const [statusQuery, setStatusQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isFetchingMore, setFetchingMore] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [isNoData, setNoData] = useState(false);
    const [allSettledTickets, setAllSettledTickets] = useState([]);
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    // const [selectedShiftFilter, setSelectedShiftFilter] = useState('');
    // const [shiftFilters, setShiftFilters] = useState([])
    const [date, setDate] = useState({
        selectedStartDate: '',
        selectedEndDate: ''
    })

    const searchTimer = useRef(null);

    useEffect(() => {
        fetchAllSettledTickets(pageNumber);
    }, [pageNumber]);

    useEffect(() => {

        const debounce = (func, delay) => {
            clearTimeout(searchTimer.current);
            searchTimer.current = setTimeout(func, delay);
        };

        debounce(() => {
            fetchAllSettledTickets(1);
        }, 500);

        return () => clearTimeout(searchTimer.current);
    }, [searchQuery]);

    const toggleFilterModal = () => {
        setFilterModalVisible(!isFilterModalVisible);
    };

    const fetchAllSettledTickets = async (page) => {
        try {
            let pageSize = 10;
            const startDate = date?.selectedStartDate ? moment(date?.selectedStartDate).format('YYYY-MM-DD') : date?.selectedStartDate
            const endDate = date?.selectedEndDate ? moment(date?.selectedEndDate).format('YYYY-MM-DD') : date?.selectedEndDate
            // console.log("page from fetch page", page, " searchQuery ", searchQuery, " pageSize ", pageSize, " startDate ", startDate, " endDate ", endDate,"appLanguage",appLanguage);

            // console.log("url.............",`${url}/api/v1/accountant/tickets/settled/${userId}?page=${page}&
            //     pageSize=${pageSize}&
            //     startDate=${startDate}&
            //     endDate=${endDate}&
            //     searchQuery=${searchQuery}
            //     `);

            const response = await fetch(`${url}/api/v1/accountant/tickets/settled/${userId}?page=${page}&pageSize=${10}&startDate=${startDate}&endDate=${endDate}&searchQuery=${searchQuery}
                `, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'Authorization': `Bearer ${token}`,
                    'client-language': appLanguage,
                    'userId': userId
                },
            });

            const data = await response?.json();
            // console.log('accountant-settled-tickets data11111', data?.result);

            if (response.status === 200) {
                if (data?.result && data?.result?.tickets) {
                    setAllSettledTickets(page === 1 ? data?.result?.tickets : [...allSettledTickets, ...data?.result?.tickets]);
                } else {
                    setAllSettledTickets([]);
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
        setSearchQuery(text)
        setPageNumber(1);
        setNoData(false)
    }


    const loadMoreTickets = () => {
        if (isNoData || isFetchingMore) return;
        setFetchingMore(true);
        setPageNumber(prevPage => prevPage + 1);

    };

    const handleApplyFilters = () => {
        toggleFilterModal();
        fetchAllSettledTickets(1)
        setLoading(true)
    };


    const renderTicket = ({ item, index }) => (
        <TouchableWithoutFeedback key={item._id} onPress={() => { }}>
            <View style={styles.subContainer}>
                <View style={styles.userCard}>
                    <View style={styles.topRow}>
                        <Image
                            source={require('../../../utils/images/homeSupervisor/assistantPage/user.png')}
                            style={styles.avatar}
                        />
                        <Text style={{ ...styles.userName }}>{item?.accountantName}</Text>
                        <View style={styles.amountSection}>
                            <Image
                                source={require('../../../utils/images/homeSupervisor/money.png')}
                                style={styles.moneyIcon}
                            />
                            <Text style={styles.amount}>{item?.totalCollectedAmount}</Text>
                        </View>

                    </View>
                    <View style={styles.bottomRow}>
                        <View style={styles.lastCollectionContainer}>
                            <Text style={styles.lastCollection}>
                                {t("Last settled")} {item?.createdAt ? moment(item?.createdAt).format('DD-MMM-yyy') : 'No settlement yet'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.phoneNumberContainer}
                            onPress={() => { }}
                        >
                            <Image
                                source={require('../../../utils/images/homeAssistant/telephone.png')}
                                style={styles.phoneIcon}
                            />
                            <Text style={{ ...styles.phoneNumber }}>{item?.supervisorPhone}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    return (
        <View style={styles.container}>
            <DashboardHeader headerText={t('Profile')} secondaryHeaderText={'ACCOUNTANT'} />
            <View style={styles.searchContainer}>
                <View style={styles.searchContainerChild}>
                    <Image
                        source={require('../../../utils/images/search.png')}
                        style={styles.searchLogo}
                    />
                    <TextInput
                        style={styles.searchBar}
                        placeholder={t("Find Settled Tickets")}
                        placeholderTextColor={'grey'}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <TouchableOpacity style={styles.filterIconContainer} onPress={toggleFilterModal}>
                        <Image
                            source={require('../../../utils/images/homeSupervisor/filter.png')}
                            style={styles.filterIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {isLoading ? (
                <Spinner bottomMargin={30} />
            ) : (

                <>
                    {allSettledTickets?.length < 1 ? <View style={{ borderWidth: 0.4, padding: 8, marginRight: 20, marginLeft: 20, marginTop: 0, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.phone}>{t("No ticket settled yet")}!</Text>
                    </View> : <FlatList
                        data={allSettledTickets}
                        renderItem={renderTicket}
                        keyExtractor={(item) => item._id}
                        onEndReached={loadMoreTickets}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={isFetchingMore && <Spinner size={30} bottomMargin={10} />}
                        contentContainerStyle={styles.flatListContent}
                    />}
                </>

            )}
            <FilterModal
                isVisible={isFilterModalVisible}
                onClose={toggleFilterModal}
                handleApplyFilters={handleApplyFilters}
                date={date}
                setDate={setDate}
            />
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
        paddingStart: 10,
        marginBottom: 10,
        marginTop: 20,
    },
    searchLogo: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginRight: 2
    },
    searchBar: {
        flex: 1,
        height: 40,
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
    userCard: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 5,
        marginTop: 20,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        marginTop: 2
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        fontSize: 17,
        fontWeight: 'bold',
        flex: 1,
        color: '#000'
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastCollectionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastCollection: {
        fontSize: 12,
        color: '#888',
    },
    amountSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moneyIcon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    amount: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#4CAF50', // Green color
        marginRight: 8
    },
    filterIconContainer: {
        padding: 10,
    },
    filterIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    phoneNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    phoneIcon: {
        width: 11,
        height: 11,
        marginRight: 5,
    },
    phoneNumber: {
        fontSize: 12,
        color: '#000',
    },
    subContainer: {
        paddingRight: 14,
        paddingLeft: 14
    }
});
