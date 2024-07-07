import * as React from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TextInput } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
// import { url } from '../../../utils/url';
import { Spinner } from '../../../utils/Spinner';
// import { AUTH_LOG_OUT, ASSISTANT_CLOCK } from '../../../redux/types';

export default function Home({ navigation }) {
  // const { token, userId, isTicketCreated, isClockedIn } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [supervisorStats, setSupervisorStats] = React.useState({
    cashCollection: '500',
    rewardPaid: '500',
    finePaid: '500',
    totalPayable: '500',
  });
  const [isLoading, setLoading] = React.useState(false);

  return (
    <View style={styles.container}>
      <DashboardHeader headerText={'Supervisor'} secondaryHeaderText={'Profile'} />
      {isLoading ? (
        <Spinner size={50} bottomMargin={20} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                <Text style={styles.cardTitle}>Reward Paid</Text>
                <Text style={styles.cardAmount}>{supervisorStats.rewardPaid} RS</Text>
              </View>
              <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeAssistant/punishment.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>Fine Paid</Text>
                <Text style={styles.cardAmount}>{supervisorStats.finePaid} RS</Text>
              </View>
              <View style={styles.separator} />
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>Total Payable</Text>
                <Text style={styles.cardAmount}>{supervisorStats.totalPayable} RS</Text>
              </View>
            </View>
            <View style={styles.searchContainerChild}>
              <Image
                source={require('../../../utils/images/search.png')}
                style={styles.searchLogo}
              />
              <TextInput
                style={styles.searchBar}
                placeholder="Find Parking Sathi"
                placeholderTextColor={'grey'}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
            </View>
            <View style={styles.userCard}>
              <View style={styles.topRow}>
                <Image
                  source={{ uri: 'https://via.placeholder.com/150' }} // Replace with the actual image URL
                  style={styles.avatar}
                />
                <Text style={styles.userName}>Abhishek Kumar</Text>
                <View style={styles.amountSection}>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/50x50' }} // Replace with the actual money icon URL
                    style={styles.moneyIcon}
                  />
                  <Text style={styles.amount}>2500</Text>
                </View>
              </View>
              <View style={styles.bottomRow}>
                <Text style={styles.lastCollection}>Last Collection - 12-Jun-2024</Text>
                <Text style={styles.shift}>Morning Shift</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 16,
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
  userCard: {
    paddingHorizontal: 12,
    paddingVertical:5,
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
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50', // Green color
    marginRight:8
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastCollection: {
    fontSize: 12,
    color: '#888',
  },
  shift: {
    backgroundColor: '#FF9800', // Orange color
    color: '#fff',
    borderRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 5,
    fontSize: 10,
  },
  searchLogo: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
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
});

