import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { url } from '../../../utils/url';
import { Spinner } from '../../../utils/Spinner';
import { AUTH_LOG_OUT } from '../../../redux/types';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import SearchableTicketList from '../../assistant/dashboard/components/SearchableTicketList';
import useKeyboardVisibility from '../../../utils/useKeyboardVisibility';
import SiteDetailModal from './SiteDetailModal';

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

export default function Home({ navigation }) {
  const { token, userId, isTicketSuperVisorSettled, role, appLanguage } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const toast = useToast();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [homePageStats, setHomePageStats] = useState({
    todaysColection: '0',
    onlineCollection: '0',
    cashCollection: '0',
    rewardPaid: '0',
    finePaid: '0',
    totalPayable: '0',
    totalCollection: '0',
    cashCollected: '0',
  });
  const [isFetchingMore, setFetchingMore] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoadingAssistData, setLoadingAssistData] = useState(true)
  const [supOrAccData, setSupOrAccData] = useState([])
  const searchTimer = useRef(null);
  const [isTotalCollectionView, setTotalCollectionView] = React.useState(false);
  const [isTotalAssistantView, setTotalAssistantView] = React.useState(false);
  const [superVisorLifeTimeStats, setSuperVisorLifeTimeStats] = React.useState({
    totalCollection: 0,
    cashCollection: '',
    onlineCollection: '',
    reward: '',
    totalFine: ''
  })
  const [assistantCount, setAssistantCount] = useState({
    totalAssistant: 0,
    totalOnlineAssistant: 0,
    totalOfflineAssistant: 0,
  })
  const isKeyboardVisible = useKeyboardVisibility();
  const [sitesData, setSitesData] = useState({
    totalTickets: 0,
    sites: []
  })
  const [siteDetail, setSiteDetail] = useState({
    siteId: '',
    vehicleType: '',
    tickets: '',
    _id: ''
  })
  const [isSiteDetailModaOpen, setSiteDetailModalOpen] = useState(false)


  useEffect(() => {
    fetchHomeStats()
  }, [isTicketSuperVisorSettled])

  useEffect(() => {
    if (role === 'supervisor') {
      fetchSuperVisorLifeTimeStats()
      fetchTotalAssistant()
      fetchSitesDetails()
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
      if (role === 'accountant') {

        fetchSuperVisors(1)
      }
    }, 500);

    return () => clearTimeout(searchTimer.current);
  }, [searchQuery]);

  const fetchHomeStats = async () => {
    try {
      // console.log("ssssURL",`${url}/api/v1/${role === 'accountant' ? "accountant" : "supervisor"}/stats/${userId}`);

      const response = await fetch(`${url}/api/v1/${role === 'accountant' ? "accountant" : "supervisor"}/stats/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'appDate': new Date(),
          'Authorization': `Bearer ${token}`,
          'client-language': appLanguage,
          'userId': userId
        },
      });
      const data = await response.json();
      console.log('fetchHomeStats data', data, "    ", response.status);
      if (response.status === 200) {
        if (role === 'accountant') {
          setHomePageStats({
            cashCollection: data.result.cashCollected,
            onlineCollection: data?.result?.onlineCollection || 0,
            totalPayable: '0',
            rewardPaid: data.result.totalReward,
            finePaid: data.result.totalFine,
            cashCollected: data?.result?.cashCollected || 0,
            totalCollection: data.result.totalCollectedAmount,
            todaysColection: data.result.todaysColection || 0,
          })
        } else {
          setHomePageStats({
            cashCollection: data.result.cashCollected,
            rewardPaid: data.result.TotalReward,
            finePaid: data.result.TotalFine,
            totalPayable: data.result.TotalCollectedAmount,
            totalCollection: '0',
            todaysColection: data.result.TodaysColection,
            onlineCollection: data.result.OnlineCollection,
          })
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
        // console.log('messageData', messageData);
        // toast.show(messageData, { type: toastType, placement: 'top' });
        // console.log('response.status data.message  data.error', response.status, data.message, data.error)
      }
      setLoading(false);
    } catch (error) {
      // toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
      console.log('error.message', error.message);
      setLoading(false);
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


  const onCardClick = (item) => {
    // console.log("onCardClick item", item);
    if (role === 'accountant') {
      navigation.navigate('SupervisorPage', { supervisorData: item })

    }
  }

  const renderTicket = ({ item, index }) => (
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

  const fetchSuperVisorLifeTimeStats = async () => {

    try {
      const response = await fetch(`${url}/api/v1/supervisor/lifetime-stats/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'userId': `${userId}`,
          'Authorization': `Bearer ${token}`,
          'client-language': appLanguage
        },

      });

      const data = await response.json();
      console.log('data.result fetchSuperVisorLifeTimeStats.......', data);

      if (response.status === 200) {
        const { totalCollection, totalReward, cashCollection, onlineCollection, totalFine } = data.result
        setSuperVisorLifeTimeStats({
          totalCollection: totalCollection || 0,
          cashCollection: cashCollection || 0,
          onlineCollection: onlineCollection || 0,
          reward: totalReward,
          totalFine
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
        toast.show(messageData, { type: toastType, placement: 'top' });
        // console.log('response.status data.message  data.error', response.status, data.message, data.error)
      }

    } catch (error) {
      console.log('Error occurred while supervisor/lifetime-stats', error);
      toast.show(`Error: ${error?.message}`, { type: 'danger', placement: 'top' });
    } finally {
      setLoading(false)
      // console.log('trigger falsae');
    }
  }

  const fetchTotalAssistant = async () => {

    try {
      const response = await fetch(`${url}/api/v1/supervisor/parkings-assistants/status/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'userId': `${userId}`,
          'Authorization': `Bearer ${token}`,
          'client-language': appLanguage
        },

      });

      const data = await response.json();
      console.log('data.result fetchTotalAssistant.......', data.result);

      if (response.status === 200) {
        const { totalCount, onlineCount, offlineCount } = data.result
        setAssistantCount({
          totalAssistant: totalCount || 0,
          totalOnlineAssistant: onlineCount || 0,
          totalOfflineAssistant: offlineCount || 0,
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
        toast.show(messageData, { type: toastType, placement: 'top' });
        // console.log('response.status data.message  data.error', response.status, data.message, data.error)
      }

    } catch (error) {
      console.log('Error occurred while parking-assistant/status', error);
      toast.show(`Error: ${error?.message}`, { type: 'danger', placement: 'top' });
    } finally {
      setLoading(false)
      // console.log('trigger falsae');
    }
  }

  const fetchSitesDetails = async () => {

    try {
      const response = await fetch(`${url}/api/v1/site/supervisor/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'userId': `${userId}`,
          'Authorization': `Bearer ${token}`,
          'client-language': appLanguage
        },

      });

      const data = await response.json();
      console.log('data.result fetchSitesDetails.......', data.result);

      if (response.status === 200) {
        const { totalTickets, sites } = data.result
        setSitesData({
          totalTickets: totalTickets,
          sites: sites
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
        toast.show(messageData, { type: toastType, placement: 'top' });
        // console.log('response.status data.message  data.error', response.status, data.message, data.error)
      }

    } catch (error) {
      console.log('Error occurred while site/supervisor', error);
      toast.show(`Error: ${error?.message}`, { type: 'danger', placement: 'top' });
    } finally {
      setLoading(false)
      // console.log('trigger falsae');
    }
  }

  const handleSiteModalOpen = async (siteId) => {
    setSiteDetailModalOpen(true)
    try {
      const response = await fetch(`${url}/api/v1/site/tickets-stats/${siteId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'userId': `${userId}`,
          'Authorization': `Bearer ${token}`,
          'client-language': appLanguage
        },

      });

      const data = await response.json();
      console.log('data.result handleSiteModalOpen.......', data.result);

      if (response.status === 200) {
        const { vehicleType, tickets, _id } = data?.result?.vehicleTypeCounts?.[0]
        setSiteDetail(prev => {
          return ({
            ...prev,
            vehicleType,
            tickets,
            _id
          })
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
        toast.show(messageData, { type: toastType, placement: 'top' });
        // console.log('response.status data.message  data.error', response.status, data.message, data.error)
      }

    } catch (error) {
      console.log('Error occurred while site/tickets-stats', error);
      toast.show(`Error: ${error?.message}`, { type: 'danger', placement: 'top' });
    }
  }

  const handleSearch = (text) => {
    setSearchQuery(text)
    setPageNumber(1);
    setNoData(false)
  }


  const loadMoreSupervisors = () => {
    // console.log("hit loadMoreSupervisors");
    if (role === 'supervisor') return;
    if (isNoData || isFetchingMore) return;
    setFetchingMore(true);
    setPageNumber(prevPage => prevPage + 1);
  };

  const renderTicket2 = ({ item, index }) => (
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
      <DashboardHeader headerText={t('Profile')} secondaryHeaderText={role === "accountant" ? 'ACCOUNTANT' : 'SUPERVISOR'} />
      {isLoading ? (
        <Spinner size={50} bottomMargin={20} />
      ) : (
        <ScrollView style={{ ...styles.scrollContainer, ...(isKeyboardVisible ? { marginTop: -200 } : {}) }}>
          <View style={styles.cardContainer}>
            <View style={styles.collectionCard}>

              <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeAssistant/credit-card.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{t("Online Collection")}</Text>
                <Text style={styles.cardAmount}>{homePageStats.onlineCollection} {t("Rs")}</Text>
              </View>

              <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeAssistant/rupee.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{t("Cash Collection")}</Text>
                <Text style={styles.cardAmount}>{homePageStats.cashCollection} {t("Rs")}</Text>
              </View>

              {role === "accountant" ?
                <>
                  <View style={{ ...styles.separator, marginBottom: 10 }} />
                  <View style={styles.cardRow}>
                    <Image
                      source={require('../../../utils/images/homeAssistant/rupee.png')}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.cardTitle}>{t("Cash Collected")}</Text>
                    <Text style={styles.cardAmount}>{homePageStats.cashCollected} {t("Rs")}</Text>
                  </View>

                </> : <></>}

              <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeSupervisor/assistantPage/money.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{role === 'accountant' ? t("Total Rewards") : t("Reward Paid")}</Text>
                <Text style={styles.cardAmount}>{homePageStats.rewardPaid} {t("Rs")}</Text>
              </View>
              <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeAssistant/punishment.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{role === 'accountant' ? t("Total Fine") : t("Fine Paid")}</Text>
                <Text style={styles.cardAmount}>{homePageStats.finePaid} {t("Rs")}</Text>
              </View>

              {role === "accountant" ?
                <>
                  <View style={{ ...styles.separator, marginBottom: 10 }} />

                  <View style={styles.cardRow}>
                    <Image
                      source={require('../../../utils/images/homeAssistant/rupee.png')}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.cardTitle}>{t("Todays Collection")}</Text>
                    <Text style={styles.cardAmount}>{homePageStats.todaysColection} {t("Rs")}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Image
                      source={require('../../../utils/images/homeAssistant/rupee.png')}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.cardTitle}>{t("Total Collection")}</Text>
                    <Text style={styles.cardAmount}>{homePageStats.totalCollection} {t("Rs")}</Text>
                  </View></> :
                <></>
              }

              {role === "supervisor" && <>
                <View style={styles.separator} />
                <View style={styles.cardRow}>
                  {/* <Image
                    source={require('../../../utils/images/homeAssistant/rupee.png')}
                    style={styles.cardIcon}
                  /> */}
                  <Text style={styles.cardTitle}>{t("Todays Collection")}</Text>
                  <Text style={styles.cardAmount}>{homePageStats.todaysColection} {t("Rs")}</Text>
                </View>
                <View style={styles.separator} />
                <View style={styles.cardRow}>
                  <Text style={styles.cardTitle}>{t("Total Payable")}</Text>
                  <Text style={styles.cardAmount}>{homePageStats.totalPayable} {t("Rs")}</Text>
                </View>
              </>}
            </View>

            {role === "supervisor" &&
              <View style={{ ...styles.collectionCard, paddingTop: 15, paddingBottom: 10 }}>
                <TouchableOpacity onPress={() => setTotalAssistantView((prev) => !prev)} >
                  <View style={{ ...styles.cardRow, position: 'relative' }}>
                    <Image
                      source={require('../../../utils/images/homeAssistant/rupee.png')}
                      style={{ ...styles.cardIcon, marginRight: 10 }}
                    />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.cardTitle}>{t("Total Tickets")}</Text>
                      <View>

                        <Text style={{ ...styles.cardAmount, marginRight: 20 }}>{assistantCount.totalAssistant}</Text>
                        <Image
                          source={require('../../../utils/images/homeAssistant/bottom-arrow.png')}
                          style={{
                            position: 'absolute',
                            width: 20,
                            height: 20,
                            right: -5,
                            top: 1,
                            transform: [
                              {
                                rotate: isTotalAssistantView ? '180deg' : '0deg'
                              }
                            ]
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {isTotalAssistantView && <>
                  <View style={{ ...styles.separator, marginBottom: 10 }} />

                  {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>{t("Sites Names")}</Text>
                  </View> */}

                  {/* <TouchableOpacity onPress={() => handleSiteModalOpen("data._id")} >
                    <View style={styles.cardRow}>
                      <Text style={styles.countText}>{"index" + 1}</Text>
                      <Text style={styles.cardTitle}>{"data.name"}</Text>
                    </View>

                  </TouchableOpacity> */}

                  {sitesData?.sites?.length > 0 && sitesData?.sites?.map((data, index) => {
                    return (
                      <TouchableOpacity key={data._id} onPress={() => handleSiteModalOpen(data._id)} >
                        <View style={styles.cardRow}>
                          <Text style={styles.countText}>{index + 1}</Text>
                          <Text style={styles.cardTitle}>{data.name}</Text>
                          <Text style={styles.cardAmount}>{data?.totalCount || 0}</Text>

                        </View>

                      </TouchableOpacity>
                    )
                  })}

                </>}
              </View>
            }

            {role === "supervisor" &&
              <View style={{ ...styles.collectionCard, paddingTop: 15, paddingBottom: 10 }}>
                <TouchableOpacity onPress={() => setTotalAssistantView((prev) => !prev)} >
                  <View style={{ ...styles.cardRow, position: 'relative' }}>
                    <Image
                      source={require('../../../utils/images/homeSupervisor/group.png')}
                      style={{ ...styles.cardIcon, marginRight: 10 }}
                    />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.cardTitle}>{t("Total Assistant")}</Text>
                      <View>

                        <Text style={{ ...styles.cardAmount, marginRight: 20 }}>{assistantCount.totalAssistant}</Text>
                        <Image
                          source={require('../../../utils/images/homeAssistant/bottom-arrow.png')}
                          style={{
                            position: 'absolute',
                            width: 20,
                            height: 20,
                            right: -5,
                            top: 1,
                            transform: [
                              {
                                rotate: isTotalAssistantView ? '180deg' : '0deg'
                              }
                            ]
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {isTotalAssistantView && <>
                  <View style={{ ...styles.separator, marginBottom: 10 }} />
                  <View style={styles.cardRow}>
                    <Image
                      source={require('../../../utils/images/homeSupervisor/userWhite.png')}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.cardTitle}>{t("Total Online Assistant")}</Text>
                    <Text style={styles.cardAmount}>{assistantCount.totalOnlineAssistant}</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Image
                      source={require('../../../utils/images/homeSupervisor/userWhite.png')}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.cardTitle}>{t("Total Offline Assistant")}</Text>
                    <Text style={styles.cardAmount}>{assistantCount.totalOfflineAssistant}</Text>
                  </View>
                </>}
              </View>
            }

            {role === "supervisor" &&
              <View style={{ ...styles.collectionCard, paddingTop: 15, paddingBottom: 10 }}>
                <TouchableOpacity onPress={() => setTotalCollectionView((prev) => !prev)} >
                  <View style={{ ...styles.cardRow, position: 'relative' }}>
                    <Image
                      source={require('../../../utils/images/homeAssistant/cashCollection2.png')}
                      style={{ ...styles.cardIcon, marginRight: 10 }}
                    />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.cardTitle}>{t("Total Collection")}</Text>
                      <View>

                        <Text style={{ ...styles.cardAmount, marginRight: 20 }}>{superVisorLifeTimeStats.totalCollection} RS</Text>
                        <Image
                          source={require('../../../utils/images/homeAssistant/bottom-arrow.png')}
                          style={{
                            position: 'absolute',
                            width: 20,
                            height: 20,
                            right: -5,
                            top: 1,
                            transform: [
                              {
                                rotate: isTotalCollectionView ? '180deg' : '0deg'
                              }
                            ]
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                {isTotalCollectionView && <>
                  <View style={{ ...styles.separator, marginBottom: 10 }} />
                  <View style={styles.cardRow}>
                    <Image
                      source={require('../../../utils/images/homeAssistant/rupee.png')}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.cardTitle}>{t("Cash Collection")}</Text>
                    <Text style={styles.cardAmount}>{superVisorLifeTimeStats.cashCollection} RS</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Image
                      source={require('../../../utils/images/homeAssistant/credit-card.png')}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.cardTitle}>{t("Online Collection")}</Text>
                    <Text style={styles.cardAmount}>{superVisorLifeTimeStats.onlineCollection} RS</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Image
                      source={require('../../../utils/images/homeSupervisor/assistantPage/money.png')}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.cardTitle}>{t("Reward")}</Text>
                    <Text style={styles.cardAmount}>{superVisorLifeTimeStats.reward} RS</Text>
                  </View>
                  <View style={styles.cardRow}>
                    <Image
                      source={require('../../../utils/images/homeAssistant/punishment.png')}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.cardTitle}>{t("Fine")}</Text>
                    <Text style={styles.cardAmount}>{superVisorLifeTimeStats.totalFine} {t("Rs")}</Text>
                  </View>
                </>}
              </View>
            }

            {role === 'supervisor' && <TouchableOpacity onPress={() => navigation.navigate('AllParkingAssistant')} style={styles.ViewAllAssistantbutton}>
              <Text style={styles.buttonText}>{t("Settle Parking Assistants")}</Text>
            </TouchableOpacity>}

            {role === 'supervisor' && <TouchableOpacity onPress={() => navigation.navigate('AllAssitantTickets')} style={styles.ViewAllAssistantbutton}>
              <Text style={styles.buttonText}>{t("Search Parking Tickets")}</Text>
            </TouchableOpacity>}

            {role === 'accountant' && <TouchableOpacity style={{ ...styles.button }} onPress={() => navigation.navigate('SettledTickets')}>
              <Text style={styles.buttonText}>{t("Your Settled Tickets")}</Text>
            </TouchableOpacity>}

            {role === 'accountant' ? <View style={styles.searchContainerChild}>
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
              {/* {role === 'supervisor' && <TouchableOpacity style={styles.filterIconContainer} onPress={toggleFilterModal}>
                <Image
                  source={require('../../../utils/images/homeSupervisor/filter.png')}
                  style={styles.filterIcon}
                />
              </TouchableOpacity>} */}
            </View> : <></>}

            {role === 'supervisor' ? <></> :

              <>
                {isLoadingAssistData ? (
                  <Spinner topMargin={150} />
                ) : (

                  <View style={{ marginTop: 5 }}>
                    {supOrAccData?.length < 1 ? <View style={{ borderWidth: 0.4, padding: 8, marginRight: 20, marginLeft: 20, marginTop: 0, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' }}>
                      <Text style={styles.phone}>{t("No Assistant Found")}!</Text>
                    </View> : <FlatList
                      data={supOrAccData}
                      renderItem={renderTicket}
                      keyExtractor={(item) => item._id}
                      onEndReached={loadMoreSupervisors}
                      onEndReachedThreshold={0.5}
                      ListFooterComponent={(isFetchingMore && role === 'accountant') && <Spinner size={30} bottomMargin={10} />}
                      contentContainerStyle={styles.flatListContent}
                    />}
                  </View>

                )}

              </>
            }

          </View>
        </ScrollView>
      )}

      <SiteDetailModal
        isVisible={isSiteDetailModaOpen}
        setVisible={setSiteDetailModalOpen}
        siteDetail={siteDetail}
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
  countText: {
    marginRight: 12,
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
  ViewAllAssistantbutton: {
    backgroundColor: '#416DEC',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
});
