import * as React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import DashboardHeader from './DashboardHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { url } from '../../utils/url';
import { Spinner } from '../../utils/Spinner';
import { AUTH_LOG_OUT, ASSISTANT_CLOCK } from '../../redux/types';

export default function Home({ navigation }) {
  const { token, userId, isTicketCreated, isClockedIn } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const toast = useToast()

  const [assistantStats, setAssistantStats] = React.useState({
    cashCollection: '',
    onlineCollection: '',
    totalPayable: '',
    totalCollection: '',
    bonus: ''

  })
  const [isLoading, setLoading] = React.useState(true)
  const [isCreateTicket, setCreateTicket] = React.useState(false)


  const handleCreateTicket = async () => {
    if (!isClockedIn) {
      return toast.show("Please clock-in to create ticket", { type: 'warning' });

    }

    setCreateTicket(true)
    try {
      const response = await fetch(`${url}/api/v1/get-all-vehicle-type`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'userId': `${userId}`,
          'Authorization': `Bearer ${token}`
        },

      });

      const data = await response.json();
      console.log('data of response.......', data);

      switch (response.status) {
        case 200:
          navigation.navigate('VehicleType', { vehicleTypes: data.result });
          break;
        case 300:
        case 400:
          toast.show(data.message, { type: 'warning', placement: 'top' });
          break;

        case 401:
        case 406:
          dispatch({
            type: AUTH_LOG_OUT,
            payload: {
              token: "",
              location: "",
              roleid: "",
              phoneNo: "",
              userId: ""
            },
          });
          break;

        case 500:
          toast.show(data.message, { type: 'danger', placement: 'top' });
          break;

        default:
          console.log('default response.status:', response.status);
          toast.show(data.message, { placement: 'top' })
      }

    } catch (error) {
      console.log('Error occurred while signInWithPhoneNumber', error);
      toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
    } finally {
      setCreateTicket(false)
    }
  };

  React.useEffect(() => {
    fetchAssistantStats()
    fetchUserClockDetails()
  }, [isTicketCreated])

  const fetchAssistantStats = async () => {

    try {
      const response = await fetch(`${url}/api/v1/parking-assistant/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'userId': `${userId}`,
          'Authorization': `Bearer ${token}`
        },

      });

      const data = await response.json();
      console.log('data of response.......', data);

      switch (response.status) {

        case 200:
          const { TotalAmount, TotalCash, TotalOnline, LastSettledDate } = data.result
          const calcPayable = TotalAmount - TotalOnline
          setAssistantStats({
            cashCollection: TotalCash,
            onlineCollection: TotalOnline,
            totalPayable: calcPayable,
            totalCollection: TotalAmount,
            bonus: TotalAmount >= 2000 ? 200 : 0
          })
          break;

        case 300:
        case 400:
          toast.show(data.message, { type: 'warning', placement: 'top' });
          break;

        case 401:
        case 406:
          dispatch({
            type: AUTH_LOG_OUT,
            payload: {
              token: "",
              location: "",
              roleid: "",
              phoneNo: "",
              userId: ""
            },
          });
          break;

        case 500:
          toast.show(data.message, { type: 'danger', placement: 'top' });
          break;

        default:
          console.log('default response.status:', response.status);
          toast.show(data.message, { placement: 'top' })
      }

    } catch (error) {
      console.log('Error occurred while signInWithPhoneNumber', error);
      toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
    } finally {
      setLoading(false)
      console.log('trigger falsae');
    }
  }

  const fetchUserClockDetails = async () => {
    try {
      const response = await fetch(`${url}/api/v1/users/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'userId': userId,
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        const { isOnline } = data.result
        console.log('isOnline.........', isOnline);
        dispatch({
          type: ASSISTANT_CLOCK,
          payload: {
            isClockedIn: isOnline,
          }
        });
      } else if (response.status === 401 || response.status === 406) {
        dispatch({
          type: AUTH_LOG_OUT,
          payload: {
            token: "",
            location: "",
            roleid: "",
            phoneNo: "",
            userId: ""
          }
        });
      } else {
        const toastType = response.status >= 500 ? 'danger' : 'warning';
        toast.show(data.message, { type: toastType, placement: 'top' });
      }
    } catch (error) {
      toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
    }
  }


  return (
    <View style={styles.container}>
      {/* Your existing UI */}
      <DashboardHeader
        headerText={'Assistant'}
        secondaryHeaderText={'Profile'}
      />
      {isLoading ? (
        <Spinner
          size={50}
          bottomMargin={20}
        />
      ) :

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.subHeader}>
            <Text style={styles.subHeaderText}>Today's Collection</Text>
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.collectionCard}>
              <View style={styles.cardRow}>
                <Image
                  source={require('../../utils/images/homeAssistant/rupee.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>Cash Collection</Text>
                <Text style={styles.cardAmount}>{assistantStats.cashCollection} RS</Text>
              </View>

              <View style={styles.cardRow}>
                <Image
                  source={require('../../utils/images/homeAssistant/credit-card.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>Online Collection</Text>
                <Text style={styles.cardAmount}>{assistantStats.onlineCollection} RS</Text>
              </View>
              {/* <View style={styles.cardRow}>
            <Image
              source={require('../../utils/images/homeAssistant/punishment.png')}
              style={styles.cardIcon}
            />
            <Text style={styles.cardTitle}>Fine</Text>
            <Text style={styles.cardAmount}>200 RS</Text>
          </View> */}

              <View style={styles.separator} />

              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>Total Payable</Text>
                <Text style={styles.cardAmount}>{assistantStats.totalPayable} RS</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>Total Collection</Text>
                <Text style={styles.cardAmount}>{assistantStats.totalCollection} RS</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardContainer}>
            <View style={[styles.collectionCard, styles.bonusContainer]}>
              <View style={styles.cardRow}>
                <Image
                  source={require('../../utils/images/homeAssistant/star.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>Bonus</Text>
                <Text style={styles.cardAmount}>{assistantStats.bonus} RS</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity disabled={isCreateTicket} onPress={handleCreateTicket} style={styles.button}>
            <Text style={styles.buttonText}>CREATE PARKING TICKET</Text>
          </TouchableOpacity>

          <View style={styles.recentTicketsHeader}>
            <Text style={styles.recentTicketsTitle}>Recent Parking Tickets</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.ticket}>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketText}>Ticket #001</Text>
              <Text style={styles.ticketText}>10/25/2022 15:30</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.ticketRow}>
              <Text style={styles.ticketText}>Vehicle No MH04 CK 43303</Text>
              <Text style={styles.ticketText}>Cash</Text>
            </View>
          </View>

          <View style={styles.ticket}>
            <View style={styles.ticketRow}>
              <Text style={styles.ticketText}>Ticket #002</Text>
              <Text style={styles.ticketText}>10/25/2022 15:50</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.ticketRow}>
              <Text style={styles.ticketText}>Vehicle No MH04 CK 43303</Text>
              <Text style={styles.ticketText}>Cash</Text>
            </View>
          </View>
        </ScrollView>
      }


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
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  cardContainer: {
    marginBottom: 16,
  },
  collectionCard: {
    backgroundColor: '#167afa',
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
});
