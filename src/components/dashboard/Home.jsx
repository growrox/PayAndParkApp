import * as React from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import DashboardHeader from './DashboardHeader';

export default function Home({ navigation }) {

  const handleCreateTicket = () => {
    navigation.navigate('VehicleType');
  };

  return (
    <View style={styles.container}>
      <DashboardHeader
        headerText={'Assistant'}
        secondaryHeaderText={'Profile'}
      />
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
              <Text style={styles.cardAmount}>500 RS</Text>
            </View>

            <View style={styles.cardRow}>
              <Image
                source={require('../../utils/images/homeAssistant/credit-card.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Online Collection</Text>
              <Text style={styles.cardAmount}>1500 RS</Text>
            </View>
            <View style={styles.cardRow}>
              <Image
                source={require('../../utils/images/homeAssistant/punishment.png')}
                style={styles.cardIcon}
              />
              <Text style={styles.cardTitle}>Fine</Text>
              <Text style={styles.cardAmount}>200 RS</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>Total Payable</Text>
              <Text style={styles.cardAmount}>300 RS</Text>
            </View>
            <View style={styles.cardRow}>
              <Text style={styles.cardTitle}>Total Collection</Text>
              <Text style={styles.cardAmount}>2000 RS</Text>
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
              <Text style={styles.cardAmount}>200 RS</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={handleCreateTicket} style={styles.button}>
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
