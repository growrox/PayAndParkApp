import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { url } from '../../../utils/url';
import { Spinner } from '../../../utils/Spinner';
import { SUPER_SETTLED_AMOUNT } from '../../../redux/types';
import moment from 'moment';
import AssistantHeader from '../assistanDetail/AssistantHeader';
import ConfirmationModal from './ConfirmationModal';

export default function SupervisorPage({ navigation, route }) {
    const { supervisorData } = route.params
    const { token, userId, isTicketSuperVisorSettled, role } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const toast = useToast();
    const [supervisorStats, setSupervisorStats] = useState({
        cashCollection: '0',
        rewardPaid: '0',
        finePaid: '0',
        totalCollection: '0',
        totalPayable: '0'
    });
    const [isLoading, setLoading] = useState(true);
    const [isLoadingAssistData, setLoadingAssistData] = useState(true)
    const [isSettling, setSettling] = useState(false)
    const [isNoData, setNoData] = useState(false);
    const [isFetchingMore, setFetchingMore] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [isOpen, setOpen] = useState(false)


    // const [parkingAssistants, setParkingAssistant] = useState([])

    const [parkingAssistants, setParkingAssistant] = useState([
        {
            "_id": "668154ccd54e76eb32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shiftgggggggg",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        },

        {
            "_id": "668154cecd54e76b32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        },
        {
            "_id": "66815ee4ccd54e76b32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54rre76b32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd5tt4e76b32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76b3232rr7f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76brt32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54ge76b32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76rtgb32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76b3232df7f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76b323ss27f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76b3232vv7f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76xxb32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76b32zz327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        },
        {
            "_id": "668154ccd54e76bsa32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76b32vx327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76b32327xcvcxf1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76erweb32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd5ggh4e76b32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76jkjb32327f1c7",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76b3232kli7f1c7ttt",
            "name": "Hasan ",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shift",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        }, {
            "_id": "668154ccd54e76b323weq27foooooooo",
            "name": "Hasaniii",
            "phone": "7218074913",
            "isOnline": true,
            "lastSettled": "2024-07-13T19:25:40.501Z",
            "shiftDetails": {
                "_id": "6682e39a33a494ad258e46eb",
                "name": "Full Day Shiftffff",
                "startTime": "12:00 AM",
                "endTime": "11:59 PM"
            }
        },
    ])
    useEffect(() => {
        console.log("supervisorData", supervisorData);
        fetchSupervisorStats()

    }, [])

    useEffect(() => {
        fetchParkingAssistants(pageNumber)
    }, [pageNumber])


    const fetchSupervisorStats = async () => {

        try {
            const response = await fetch(`${url}/api/v1/supervisor/stats/${supervisorData._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                },
            });

            const data = await response.json();
            console.log('fetchSupervisorStats data', data);
            if (response.status === 200) {
                setSupervisorStats({
                    cashCollection: data.result.cashCollected,
                    rewardPaid: data.result.TotalReward,
                    finePaid: data.result.TotalFine,
                    totalCollection: data.result.TotalCollection,
                    totalPayable: data.result.TotalCollectedAmount
                })
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
                // console.log('messageData', messageData);
                toast.show(messageData, { type: toastType, placement: 'top' });
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }
            setLoading(false);
        } catch (error) {
            // toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
            console.log('error.message', error.message);
            setLoading(false);
        }
    }

    const fetchParkingAssistants = async (page) => {

        try {
            let pageSize = 20;

            const apiUrl = `${url}/api/v1/supervisor/parkings-assistants/${supervisorData._id}?page=${page}&pageSize=${pageSize}`;
            console.log("apiUrl", apiUrl);
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                    'userId': userId,
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            console.log('fetchParkingAssistants data', data?.result?.assistants);
            if (response.status === 200) {
                setParkingAssistant(data?.result?.assistants || [])
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
                // console.log('messageData', messageData);
                toast.show(messageData, { type: toastType, placement: 'top' });
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }
            if (data?.result?.length === 0 || data?.result?.length !== pageSize) {
                // console.log("hit data?.result?.supervisors?.length 0");
                return setNoData(true);
            }
        } catch (error) {
            // toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
            console.log('error.message', error.message);
            setLoadingAssistData(false);
        } finally {
            setLoadingAssistData(false);
        }
    }


    const handleSettleAmount = async () => {

        try {
            setSettling(true)

            const apiData = {
                accountantID: userId,
                totalCollectedAmount: supervisorStats.totalPayable,
            }
            console.log("apiData", apiData);
            const response = await fetch(`${url}/api/v1/accountant/settle-tickets/${supervisorData._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-source': 'app',
                },
                body: JSON.stringify(apiData)
            });

            const data = await response.json();
            console.log('handleSettleAmount data', data);
            console.log('response.status data.message  data.error', response?.status, data?.message, data?.error)
            if (response.status === 200) {
                toast.show(data.message, { type: 'success', placement: 'top' });
                dispatch({
                    type: SUPER_SETTLED_AMOUNT,
                    payload: {
                        isTicketSuperVisorSettled: !isTicketSuperVisorSettled
                    }
                });
                navigation.navigate('Home')
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
                // console.log('messageData', messageData);
                toast.show(messageData, { type: toastType, placement: 'top' });
                // console.log('response.status data.message  data.error', response.status, data.message, data.error)
            }
        } catch (error) {
            // toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
            console.log('error.message', error.message);
            setSettling(false);
        } finally {
            setSettling(false);
        }
    }

    const renderTicket = ({ item, index }) => (
        <View key={item._id} style={{ paddingRight: 4, paddingLeft: 4 }}>
            <View style={styles.userCard}>
                <View style={styles.topRow}>
                    <Image
                        source={require('../../../utils/images/homeSupervisor/userBlack.png')}
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>{item.name}</Text>
                    {/* <TouchableOpacity
                            style={{ ...styles.statusButton, borderColor: '#89FF5F' }}
                            onPress={() => { }}
                        >
                            <Text style={{ ...styles.statusText, color: '#89FF5F' }}>Online</Text>
                        </TouchableOpacity> */}
                </View>
                <View style={styles.bottomRow}>
                    <View style={styles.lastCollectionContainer}>
                        <Image
                            source={require('../../../utils/images/homeAccountant/supervisorPage/calendar.png')}
                            style={styles.calendarIcon}
                        />
                        <Text style={styles.lastCollection}>
                            {item.lastSettled ? moment(item.lastSettled).format('DD-MMM-yyy') : 'No settlement yet'}
                        </Text>
                    </View>
                    {/* <View style={styles.amountSection}>
                        <Image
                            source={require('../../../utils/images/homeSupervisor/money.png')}
                            style={styles.moneyIcon}
                        />
                        <Text style={styles.amount}>{item.amountToCollect}</Text>
                    </View> */}
                </View>
            </View>
        </View>
    );

    const loadMoreTickets = () => {
        if (isNoData || isFetchingMore) return;
        setFetchingMore(true);
        setPageNumber(prevPage => prevPage + 1);

    };

    const toggleModal = () => {
        setOpen(!isOpen)
    }

    return (
        <View style={styles.container}>
            <DashboardHeader headerText={'Profile'} secondaryHeaderText={'SUPERVISOR'} />
            {isLoading ? (
                <Spinner size={50} bottomMargin={20} />
            ) : (
                <View style={styles.scrollContainer}>
                    <AssistantHeader
                        name={supervisorData.name}
                        title={"Supervisor"}
                    />
                    <View style={styles.cardContainer}>
                        <View style={styles.collectionCard}>
                            <View style={styles.cardRow}>
                                <Image
                                    source={require('../../../utils/images/homeAssistant/rupee.png')}
                                    style={styles.cardIcon}
                                />
                                <Text style={styles.cardTitle}>Cash Collection</Text>
                                <Text style={styles.cardAmount}>{supervisorStats.cashCollection} RS</Text>
                            </View>
                            <View style={styles.cardRow}>
                                <Image
                                    source={require('../../../utils/images/homeAssistant/credit-card.png')}
                                    style={styles.cardIcon}
                                />
                                <Text style={styles.cardTitle}>Total Rewards Paid</Text>
                                <Text style={styles.cardAmount}>{supervisorStats.rewardPaid} RS</Text>
                            </View>
                            <View style={styles.cardRow}>
                                <Image
                                    source={require('../../../utils/images/homeAssistant/punishment.png')}
                                    style={styles.cardIcon}
                                />
                                <Text style={styles.cardTitle}>Total Fine Paid</Text>
                                <Text style={styles.cardAmount}>{supervisorStats.finePaid} RS</Text>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.cardRow}>
                                <Text style={styles.cardTitle}> Total Collection</Text>
                                <Text style={styles.cardAmount}>{supervisorStats.totalCollection} RS</Text>
                            </View>
                            <View style={styles.cardRow}>
                                <Text style={styles.cardTitle}> Total Payable</Text>
                                <Text style={styles.cardAmount}>{supervisorStats.totalPayable} RS</Text>
                            </View>
                        </View>
                        <TouchableOpacity disabled={isSettling} style={{ ...styles.button, ...(isSettling && { opacity: 0.5 }) }} onPress={toggleModal}>
                            <Text style={styles.buttonText}>Settle Amount</Text>
                        </TouchableOpacity>

                        {isLoadingAssistData ? (
                            <Spinner topMargin={150} />
                        ) : (

                            <View style={{ marginTop: 5 }}>
                                {parkingAssistants?.length < 1 ? <View style={{ borderWidth: 0.4, padding: 8, marginRight: 20, marginLeft: 20, marginTop: 0, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.phone}>No Assistant Found!</Text>
                                </View> : <FlatList
                                    data={parkingAssistants}
                                    renderItem={renderTicket}
                                    keyExtractor={(item) => item._id}
                                    onEndReached={loadMoreTickets}
                                    onEndReachedThreshold={0.5}
                                    ListFooterComponent={isFetchingMore && <Spinner size={30} bottomMargin={10} />}
                                    contentContainerStyle={styles.flatListContent}
                                />}
                            </View>

                        )}

                    </View>
                </View>
            )}
            <ConfirmationModal
                isVisible={isOpen}
                handleSettleAmount={handleSettleAmount}
                handleClose={toggleModal}
                settlementAmount={supervisorStats.totalPayable}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContainer: {
        flex: 1,
        padding: 16,
    },
    cardContainer: {
        marginBottom: 16,
    },
    collectionCard: {
        backgroundColor: '#416DEC',
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardIcon: {
        width: 24,
        height: 24,
        marginRight: 24,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
    },
    separator: {
        height: 1.4,
        backgroundColor: '#FFFFFF',
        marginVertical: 8,
    },
    cardAmount: {
        fontSize: 15,
        color: '#FFFFFF',
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
    shift: {
        backgroundColor: '#FF7F3E', // Orange color
        color: '#fff',
        borderRadius: 5,
        paddingHorizontal: 12,
        paddingVertical: 4,
        fontSize: 12,
    },
    searchLogo: {
        width: 16,
        height: 16,
        resizeMode: 'contain',
        marginRight: 2
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
    searchBar: {
        flex: 1,
        height: 40,
    },
    filterIconContainer: {
        padding: 10,
    },
    filterIcon: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    },
    flatListContent: {
        paddingBottom: 640,
    },
    calendarIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
        marginLeft: 5
    },
    button: {
        backgroundColor: '#223C83',
        padding: 10,
        borderRadius: 6,
        marginTop: 25,
        marginBottom: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
