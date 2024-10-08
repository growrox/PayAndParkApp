import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { url } from '../../../utils/url';
import { Spinner } from '../../../utils/Spinner';
import { AUTH_LOG_OUT } from '../../../redux/types';
import FilterModal from './FilterModal';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function AllParkingAssistant({ navigation }) {
  const { token, userId, isTicketSuperVisorSettled, role, appLanguage } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const toast = useToast();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [isFetchingMore, setFetchingMore] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoadingAssistData, setLoadingAssistData] = useState(true)
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [supOrAccData, setSupOrAccData] = useState([])
  const [selectedShiftFilter, setSelectedShiftFilter] = useState('');
  const [shiftFilters, setShiftFilters] = useState([])
  const searchTimer = useRef(null);


  const toggleFilterModal = () => {
    setFilterModalVisible(!isFilterModalVisible);
  };


  useEffect(() => {
    if (role === 'supervisor') {
      fetchFilters()
      fetchParkingAssistants()

    } else {
      fetchSuperVisors(pageNumber)
    }
  }, [isTicketSuperVisorSettled, pageNumber])

  useEffect(() => {

    const debounce = (func, delay) => {
      clearTimeout(searchTimer.current);
      searchTimer.current = setTimeout(func, delay);
    };

    debounce(() => {
      if (role === 'supervisor') {

        fetchParkingAssistants();
      } else {
        fetchSuperVisors(1)
      }
    }, 500);

    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);



  const fetchParkingAssistants = async () => {
    try {
      let queryParams = '';

      if (searchQuery) {
        queryParams = searchQuery;
      } else if (statusQuery) {
        queryParams = statusQuery;
      }
      const apiUrl = `${url}/api/v1/supervisor/parkings-assistants/${userId}?queryParam=${queryParams}&shiftID=${selectedShiftFilter}`;
      // console.log("apiUrl", apiUrl);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'userId': userId,
          'Authorization': `Bearer ${token}`,
          'client-language': appLanguage
        },
      });

      const data = await response.json();
      // console.log('fetchParkingAssistants data', data?.result?.assistants);
      if (response.status === 200) {
        setSupOrAccData(data?.result?.assistants || [])
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
      setLoadingAssistData(false);
    } catch (error) {
      // toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
      console.log('error.message', error.message);
      setLoadingAssistData(false);
    }
  }

  const fetchSuperVisors = async (page) => {
    try {
      let pageSize = 20;
      // console.log("page from fetch", page, "  ", searchQuery, "  ", pageSize);
      const apiUrl = `${url}/api/v1/accountant/supervisors?searchQuery=${searchQuery}&page=${page}&pageSize=${pageSize}`;
      console.log("apiUrl", apiUrl);
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'userId': userId,
          'Authorization': `Bearer ${token}`,
          'client-language': appLanguage
        },
      });

      const data = await response.json();
      // console.log('fetchSuperVisors data', data);
      // console.log("data.result.length", data?.result?.supervisors?.length);

      if (response.status === 200) {
        // console.log("fetchSuperVisors response.status", response.status);
        // console.log("data?.result?.supervisors", data?.result?.supervisors);
        setSupOrAccData(page === 1 ? data?.result?.supervisors : [...supOrAccData, ...data?.result?.supervisors]);
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
      if (data?.result?.supervisors?.length === 0 || data?.result?.supervisors?.length !== pageSize) {
        // console.log("hit data?.result?.supervisors?.length 0");
        return setNoData(true);
      }
    } catch (error) {
      // toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
      console.log('error.message', error.message);
      setLoadingAssistData(false);
      setFetchingMore(false);
    } finally {
      setLoadingAssistData(false);
      setLoading(false);
      setFetchingMore(false);
    }
  }

  const fetchFilters = async () => {
    try {
      const response = await fetch(`${url}/api/v1/shifts/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'Authorization': `Bearer ${token}`,
          'client-language': appLanguage,
          'userId': userId
        },
      });

      const data = await response.json();
      // console.log('response.status data.message  data.error', response.status, data.message, data.error)
      if (response.status === 200) {
        setShiftFilters(data.result)
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
    }
  }

  const onCardClick = (item) => {
    // console.log("onCardClick item", item);
    if (role === 'accountant') {
      navigation.navigate('SupervisorPage', { supervisorData: item })

    } else {
      navigation.navigate('AssistantPage', { assistantData: item })
    }
  }

  const renderTicket = ({ item, index }) => (
    <TouchableWithoutFeedback key={item._id} onPress={() => onCardClick(item)}>
      <View style={{ paddingRight: 4, paddingLeft: 4 }}>
        <View style={styles.userCard}>
          <View style={styles.topRow}>
            <Image
              source={item.isOnline ? require('../../../utils/images/homeSupervisor/userGreen.png') :
                require('../../../utils/images/homeSupervisor/userRed.png')}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{item?.name}</Text>
            <View style={styles.amountSection}>
              <Image
                source={require('../../../utils/images/homeSupervisor/money.png')}
                style={styles.moneyIcon}
              />
              <Text style={styles.amount}>{item.amountToCollect}</Text>
            </View>
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.lastCollectionContainer}>
              <Text style={styles.lastCollection}>
                {t("Last Collection")} - {item.lastSettled ? moment(item.lastSettled).format('DD-MMM-yyy') : 'No settlement yet'}
              </Text>
            </View>
            <Text style={styles.shift}>{item?.shiftDetails?.name}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderTicket2 = ({ item, index }) => (
    <TouchableWithoutFeedback key={item._id} onPress={() => onCardClick(item)}>
      <View style={{ paddingRight: 4, paddingLeft: 4 }}>
        <View style={styles.userCard}>
          <View style={styles.topRow}>
            <Image
              source={+item.totalCollectedAmount === 0 ? require('../../../utils/images/homeSupervisor/userGreen.png') : require('../../../utils/images/homeSupervisor/userRed.png')}
              style={styles.avatar}
            />
            <Text style={{ ...styles.userName, color: +item.totalCollectedAmount === 0 ? 'green' : 'red' }}>{item?.name}</Text>
            {/* <TouchableOpacity
              style={{ ...styles.statusButton, borderColor: '#89FF5F' }}
              onPress={() => { }}
            >
              <Text style={{ ...styles.statusText, color: '#89FF5F' }}>Online</Text>
            </TouchableOpacity> */}
          </View>
          <View style={styles.bottomRow}>
            <View style={styles.lastCollectionContainer}>
              {/* <Image
                source={require('../../../utils/images/homeAccountant/supervisorPage/calendar.png')}
                style={styles.calendarIcon}
              /> */}
              <Text style={styles.lastCollection}>
                {t("Last settled")} {item.lastSettledDate ? moment(item?.lastSettledDate).format('DD-MMM-yyy') : 'No settlement yet'}
              </Text>
            </View>
            <View style={styles.amountSection}>
              <Image
                source={require('../../../utils/images/homeSupervisor/money.png')}
                style={styles.moneyIcon}
              />
              <Text style={styles.amount}>{item.totalCollectedAmount}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )


  const handleSearch = (text) => {
    setSearchQuery(text)
    setPageNumber(1);
    setNoData(false)
  }

  const handleApplyFilters = () => {
    toggleFilterModal();
    fetchParkingAssistants()
    setLoadingAssistData(true)
  };

  const loadMoreSupervisors = () => {
    // console.log("hit loadMoreSupervisors");
    if (role === 'supervisor') return;
    if (isNoData || isFetchingMore) return;
    setFetchingMore(true);
    setPageNumber(prevPage => prevPage + 1);
  };

  return (
    <View style={styles.container}>
      <DashboardHeader headerText={t('Profile')} secondaryHeaderText={role === "accountant" ? 'ACCOUNTANT' : 'SUPERVISOR'} />
      {isLoading ? (
        <Spinner size={50} bottomMargin={20} />
      ) : (
        <View style={styles.scrollContainer}>
          <View style={styles.cardContainer}>
            <View style={styles.searchContainerChild}>
              <Image
                source={require('../../../utils/images/search.png')}
                style={styles.searchLogo}
              />
              <TextInput
                style={styles.searchBar}
                placeholder={role === 'accountant' ? t("Find Supervisor") : t("Find Parking Sathi")}
                placeholderTextColor={'grey'}
                value={searchQuery}
                onChangeText={handleSearch}
              />
              {role === 'supervisor' && <TouchableOpacity style={styles.filterIconContainer} onPress={toggleFilterModal}>
                <Image
                  source={require('../../../utils/images/homeSupervisor/filter.png')}
                  style={styles.filterIcon}
                />
              </TouchableOpacity>}
            </View>

            {isLoadingAssistData ? (
              <Spinner topMargin={150} />
            ) : (

              <View style={{ marginTop: 5 }}>
                {supOrAccData?.length < 1 ? <View style={{ borderWidth: 0.4, padding: 8, marginRight: 20, marginLeft: 20, marginTop: 0, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={styles.phone}>{t("No Assistant Found")}!</Text>
                </View> : <FlatList
                  data={supOrAccData}
                  renderItem={role === "accountant" ? renderTicket2 : renderTicket}
                  keyExtractor={(item) => item._id}
                  onEndReached={loadMoreSupervisors}
                  onEndReachedThreshold={role === 'accountant' ? 0.5 : null}
                  ListFooterComponent={(isFetchingMore && role === 'accountant') && <Spinner size={30} bottomMargin={10} />}
                  contentContainerStyle={styles.flatListContent}
                />}
              </View>
            )}

          </View>
        </View>
      )}
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={toggleFilterModal}
        handleApplyFilters={handleApplyFilters}
        selectedShiftFilter={selectedShiftFilter}
        setSelectedShiftFilter={setSelectedShiftFilter}
        shiftFilters={shiftFilters}
        statusQuery={statusQuery}
        setStatusQuery={setStatusQuery}
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
    paddingBottom: 540,
  },
  calendarIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    marginLeft: 5
  },
  statusButton: {
    borderWidth: 1.5,
    paddingLeft: 4,
    paddingBottom: 0.8,
    paddingRight: 4,
    paddingTop: 0.8,
    borderRadius: 8,
  },
  statusText: {
    fontWeight: '500',
    fontSize: 10,
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
  },
  ViewAllAssistantbutton:{
    backgroundColor: '#416DEC',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
});
