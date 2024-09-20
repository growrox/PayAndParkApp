import * as React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image, ActivityIndicator, PermissionsAndroid } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { url } from '../../../utils/url';
import { Spinner } from '../../../utils/Spinner';
import { AUTH_LOG_OUT, ASSISTANT_CLOCK } from '../../../redux/types';
import moment from 'moment';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import AssisTicketsByDate from './AssisTicketsByDate';


export default function Home({ navigation }) {
  const { token, userId, isTicketCreated, isClockedIn, appLanguage, shiftDetails } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const toast = useToast()
  const [assistantStats, setAssistantStats] = React.useState({
    cashCollection: '',
    onlineCollection: '',
    totalPayable: '',
    totalCollection: '',
    bonus: '',
    totalTickets: '',
    vehicleTypes: []
  })
  const [assistantLifeTimeStats, setAssistantLifeTimeStats] = React.useState({
    totalCollection: 0,
    cashCollection: '',
    onlineCollection: '',
    reward: '',
    fine: '',
  })
  const [isLoading, setLoading] = React.useState(true)
  const [isCreateTicket, setCreateTicket] = React.useState(false)
  const [recentTickets, setRecentTickets] = React.useState([]);
  const [siteName, setSiteName] = React.useState('');
  const { t } = useTranslation();
  const [isVehicleTypeView, setVehicleTypeView] = React.useState(false);
  const [isTotalCollectionView, setTotalCollectionView] = React.useState(false);
  const [isByDateModalVisible, setByDateModalVisible] = React.useState(false);



  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: t('Camera Permission'),
          message:
            t('App needs access to your camera ') + t('so you can take pictures.'),
          // buttonNeutral: 'Ask Me Later',
          buttonNegative: t('Cancel'),
          buttonPositive: t('OK'),
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };


  React.useEffect(() => {
    requestCameraPermission();
  }, []);

  React.useEffect(() => {
    fetchAssistantStats()
    fetchAssistantLifeTimeStats()
    fetchUserClockDetails()
    // fetchRecentTickets()
  }, [isTicketCreated])

  const handleCreateTicket = async () => {
    if (!isClockedIn) {
      return toast.show(t("Please clock-in to create ticket"), { type: 'warning' });

    }

    setCreateTicket(true)
    try {
      const response = await fetch(`${url}/api/v1/get-all-vehicle-type`, {
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
      // console.log('data of response get-all-vehicle-type .......', data.result[0].hourlyPrices);

      if (response.status === 200) {
        navigation.navigate('VehicleType', { vehicleTypes: data.result });
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
      console.log('Error occurred while get-all-vehicle-type', error);
      toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
    } finally {
      setCreateTicket(false)
    }
  };


  const fetchAssistantStats = async () => {

    try {
      const response = await fetch(`${url}/api/v1/parking-assistant/stats`, {
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
      // console.log('data.result.VehicleTypes.......', data.result.VehicleTypes);
      console.log('data.result.......', data.result);


      if (response.status === 200) {
        const { TotalAmount, TotalCash, TotalOnline, LastSettledDate, TotalTickets, VehicleTypes } = data.result
        const calcPayable = TotalAmount - TotalOnline
        setAssistantStats({
          cashCollection: TotalCash,
          onlineCollection: TotalOnline,
          totalPayable: calcPayable,
          totalCollection: TotalAmount,
          bonus: TotalAmount >= 2000 ? 200 : 0,
          totalTickets: TotalTickets,
          vehicleTypes: VehicleTypes
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
      console.log('Error occurred while parking-assistant/stats', error);
      toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
    } finally {
      setLoading(false)
      // console.log('trigger falsae');
    }
  }

  const fetchAssistantLifeTimeStats = async () => {

    try {
      const response = await fetch(`${url}/api/v1/parking-assistant/lifetime-stats`, {
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
      console.log('data.result fetchAssistantLifeTimeStats.......', data.result);

      if (response.status === 200) {
        const { totalCollection, totalReward, cashCollection, onlineCollection, totalFine } = data.result
        setAssistantLifeTimeStats({
          totalCollection: totalCollection || 0,
          cashCollection: cashCollection || 0,
          onlineCollection: onlineCollection || 0,
          reward: totalReward,
          fine: totalFine
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
      console.log('Error occurred while parking-assistant/stats', error);
      toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
    } finally {
      setLoading(false)
      // console.log('trigger falsae');
    }
  }

  const fetchUserClockDetails = async () => {

    console.log('userId.......fetchUserClockDetails..............', userId);
    console.log('token........fetchUserClockDetails.............', token);

    try {
      const response = await fetch(`${url}/api/v1/users/status`, {
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
      console.log("data offetchUserClockDetails", data);
      if (response.status === 200) {
        const { isOnline, shiftId } = data.result
        console.log('isOnline.........', isOnline);
        console.log("shiftId", shiftId);
        setSiteName(data?.result?.siteId?.name || 'NA')
        dispatch({
          type: ASSISTANT_CLOCK,
          payload: {
            isClockedIn: isOnline,
            shiftDetails: shiftId
          }
        });
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
      toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
    }
  }

  // const fetchRecentTickets = async () => {
  //   try {
  //     const response = await fetch(`${url}/api/v1/parking-assistant/tickets`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'x-client-source': 'app',
  //         'userId': userId,
  //         'Authorization': `Bearer ${token}`,
  //         'page': 'home',
  //         'client-language': appLanguage
  //       },
  //     });

  //     const data = await response.json();
  //     // console.log('fetchRecentTickets data', data.result.data);
  //     if (response.status === 200) {
  //       setRecentTickets(data?.result?.data || []);
  //     } else if (response.status === 401 || response.status === 406) {
  //       dispatch({
  //         type: AUTH_LOG_OUT,
  //         payload: {
  //           token: "",
  //           location: "",
  //           role: "",
  //           phoneNo: "",
  //           userId: "",
  //           name: ""
  //         }
  //       });
  //     } else {
  //       const toastType = response.status >= 400 ? 'danger' : 'warning';
  //       const messageData = response.status >= 400 ? data.error : data.message
  //       // console.log('messageData', messageData);
  //       toast.show(messageData, { type: toastType, placement: 'top' });
  //       // console.log('response.status data.message  data.error', response.status, data.message, data.error)
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     // toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
  //     console.log('error.message', error.message);
  //     setLoading(false);
  //   }
  // }

  // const onCardClick = (item) => {
  //   // console.log('onCardClick, item', item);
  //   navigation.navigate('PaymentDetails', {
  //     userEnteredData: {
  //       ...item,
  //       type: 'ticketDetailsPreview'
  //     }
  //   });
  // };

  // function isTicketExpired(expiryDate) {
  //   if (!expiryDate) {
  //     return true
  //   }
  //   const ticketExpiry = new Date(expiryDate);
  //   // console.log("ticketExpiry", ticketExpiry);
  //   const now = new Date();
  //   // console.log("now", now);
  //   // console.log("now > ticketExpiry;", now > ticketExpiry);
  //   return now > ticketExpiry;
  // }



  return (
    <View style={styles.container}>
      {/* Your existing UI */}
      <DashboardHeader
        headerText={t('Profile')}
        secondaryHeaderText={'ASSISTANT'}
      />
      {isLoading ? (
        <Spinner
          size={50}
          bottomMargin={20}
        />
      ) :

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.subHeader}>
            <Text style={styles.subdiscText}>{t("Site Name")}: {siteName}</Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.collectionCard}>
              <View style={styles.subHeader}>
                <Text style={styles.subHeaderText}>{t("Today's Collection")}</Text>
              </View>
              <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeAssistant/rupee.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{t("Cash Collection")}</Text>
                <Text style={styles.cardAmount}>{assistantStats.cashCollection} {t("Rs")}</Text>
              </View>
              <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeAssistant/credit-card.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{t("Online Collection")}</Text>
                <Text style={styles.cardAmount}>{assistantStats.onlineCollection} {t("Rs")}</Text>
              </View>
              {/* <View style={styles.cardRow}>
                    <Image
                      source={require('../../utils/images/homeAssistant/punishment.png')}
                      style={styles.cardIcon}
                    />
                      <Text style={styles.cardTitle}>Fine</Text>
                      <Text style={styles.cardAmount}>200 {t("Rs")}</Text>
                    </View> 
              */}
              <View style={styles.separator} />
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{t("Total Payable")}</Text>
                <Text style={styles.cardAmount}>{assistantStats.totalPayable} {t("Rs")}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{t("Total Collection")}</Text>
                <Text style={styles.cardAmount}>{assistantStats.totalCollection} {t("Rs")}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={[styles.BonusCard, styles.bonusContainer]}>
              <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeAssistant/star.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>{t("Bonus")}</Text>
                <Text style={styles.cardAmount}>{assistantStats.bonus} {t("Rs")}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={{ ...styles.collectionCard, paddingTop: 15, paddingBottom: 10 }}>
              <TouchableOpacity onPress={() => setVehicleTypeView((prev) => !prev)} >
                <View style={{ ...styles.cardRow, position: 'relative' }}>
                  <Image
                    source={require('../../../utils/images/homeAssistant/ticket.png')}
                    style={{ ...styles.cardIcon, marginRight: 10 }}
                  />
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>{t("Total Tickets")}</Text>
                    <View>

                      <Text style={{ ...styles.cardAmount, marginRight: 20 }}>{assistantStats.totalTickets}</Text>
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
                              rotate: isVehicleTypeView ? '180deg' : '0deg'
                            }
                          ]
                        }}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              {isVehicleTypeView && <>
                <View style={{ ...styles.separator, marginBottom: 10 }} />
                {assistantStats?.vehicleTypes.length > 0 ? assistantStats?.vehicleTypes?.map((da, i) =>
                (<View key={i} style={styles.cardRow}>
                  <Text style={styles.cardTitle}>{da.vehicleType}</Text>
                  <Text style={styles.cardAmount}>{da.TicketCount}</Text>
                </View>)
                ) : <Text style={{ textAlign: 'center', color: '#fff', fontSize: 16 }}>{t("No tickets to show")}!</Text>
                }
              </>}
            </View>
          </View>


          <View style={styles.cardContainer}>
            <View style={{ ...styles.collectionCard, paddingTop: 15, paddingBottom: 10 }}>
              <TouchableOpacity onPress={() => setTotalCollectionView((prev) => !prev)} >
                <View style={{ ...styles.cardRow, position: 'relative' }}>
                  <Image
                    source={require('../../../utils/images/homeAssistant/cashCollection2.png')}
                    style={{ ...styles.cardIcon, marginRight: 10 }}
                  />
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.cardTitle}>{t("Life Time Collection")}</Text>
                    <View>

                      <Text style={{ ...styles.cardAmount, marginRight: 20 }}>{assistantLifeTimeStats.totalCollection} RS</Text>
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
                  <Text style={styles.cardAmount}>{assistantLifeTimeStats.cashCollection} RS</Text>
                </View>
                <View style={styles.cardRow}>
                  <Image
                    source={require('../../../utils/images/homeAssistant/credit-card.png')}
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardTitle}>{t("Online Collection")}</Text>
                  <Text style={styles.cardAmount}>{assistantLifeTimeStats.onlineCollection} RS</Text>
                </View>
                <View style={styles.cardRow}>
                  <Image
                    source={require('../../../utils/images/homeSupervisor/assistantPage/money.png')}
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardTitle}>{t("Reward")}</Text>
                  <Text style={styles.cardAmount}>{assistantLifeTimeStats.reward} RS</Text>
                </View>
                <View style={styles.cardRow}>
                  <Image
                    source={require('../../../utils/images/homeAssistant/punishment.png')}
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardTitle}>{t("Fine")}</Text>
                  <Text style={styles.cardAmount}>{assistantLifeTimeStats.fine} RS</Text>
                </View>
              </>}
            </View>
          </View>

          <TouchableOpacity disabled={isCreateTicket} onPress={handleCreateTicket} style={styles.button}>
            {isCreateTicket ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{t("Create Parking Ticket")}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('AllAssitantTickets')} style={styles.button}>
            <Text style={styles.buttonText}>{t("View All Parking Tickets")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setByDateModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>{t("View Collection By Date")}</Text>
          </TouchableOpacity>


          {/* recent parking tickets */}
          {/* <View style={styles.recentTicketsHeader}>
            <Text style={styles.recentTicketsTitle}>{t("Recent Parking Tickets")}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllAssitantTickets')}>
              <Text style={styles.seeAllText}>{t("See All")}</Text>
            </TouchableOpacity>
          </View>
          {recentTickets?.length < 1 ? <View style={{ flex: 1, borderWidth: 0.4, padding: 8, marginTop: 15, borderColor: '#D0D0D0', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={styles.phone}>{t("No ticket created yet")}!</Text>
          </View> : <>
            {
              recentTickets.map((item, i) => {
                // console.log('item', item);

                return (
                  <TouchableOpacity key={item._id} onPress={() => onCardClick(item)} style={styles.cardWrapper}>
                    <View key={item._id} style={styles.ticket}>
                      <View style={{ ...styles.settledBadge, ...(item?.status === 'settled' ? { backgroundColor: '#2ecc71' } : { backgroundColor: "#e74c3c" }) }}>
                        <Text style={{ color: '#ffffff' }}>{item?.status === 'settled' ? t("Settled") : t("Unsettled")}</Text>
                      </View>
                      <View style={{ ...styles.expiredBadge, backgroundColor: "orange" }}>
                        <Text style={{ color: '#ffffff' }}>{item.isPass ? t("Pass") : t("Ticket")}</Text>
                      </View>
                      <View style={{ ...styles.ticketRow, marginTop: 10 }}>
                        <Text style={styles.ticketText}>{t("Ticket")}: PNP24-0830-000{i + 1}</Text>
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

                )
              })
            }
          </>} */}
          {/* end */}

        </ScrollView>
      }
      <AssisTicketsByDate
        modalVisible={isByDateModalVisible}
        setModalVisible={setByDateModalVisible}
      />
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
    marginBottom: 18,
    marginTop: -14
  },
  subHeaderText: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  subdiscText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 10
  },
  cardContainer: {
    marginBottom: 6,
  },
  collectionCard: {
    backgroundColor: '#167afa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  BonusCard: {
    backgroundColor: '#167afa',
    borderRadius: 8,
    padding: 12,
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
  bonusContainer: {
    backgroundColor: '#ff9500',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  recentTicketsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recentTicketsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007bff',
  },
  ticket: {
    position: 'relative',
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
  picker: {
    height: 52,
    width: 40,
  },
  pickerItem: {
    fontSize: 14,
    color: "#000"
  },
});
