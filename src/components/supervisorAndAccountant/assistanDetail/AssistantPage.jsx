import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import DashboardHeader from '../../DashboardHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import { Spinner } from '../../../utils/Spinner';
import { url } from '../../../utils/url';
import CustomCheckbox from '../../CustomCheckbox';
import AssistantHeader from './AssistantHeader';
import CashUpdateModal from './CashUpdateModal';
import { SUPER_SETTLED_AMOUNT } from '../../../redux/types';
import { AUTH_LOG_OUT } from '../../../redux/types';

export default function AssistantPage({ navigation, route }) {
  const { assistantData } = route.params
  const { token, userId, isTicketSuperVisorSettled, role } = useSelector((store) => store.auth)
  const dispatch = useDispatch();
  const toast = useToast();
  const [assistantPageStats, setAssistantStats] = useState({
    cashCollection: 0,
    onlineCollection: 0,
    rewardPaid: 0,
    finePaid: 0,
    totalPayable: 0,
    totalCollection: 0,
  });
  const [isLoading, setLoading] = useState(true);
  const [isSettling, setSettling] = useState(false)
  const [fineChecked, setFineChecked] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [cashData, setCashData] = useState([
    { id: 1, denomination: 500, count: 0 },
    { id: 2, denomination: 200, count: 0 },
    { id: 3, denomination: 100, count: 0 },
    { id: 4, denomination: 50, count: 0 },
    { id: 5, denomination: 20, count: 0 },
    { id: 6, denomination: 10, count: 0 },
    { id: 7, denomination: 5, count: 0 },
    { id: 8, denomination: 2, count: 0 },
    { id: 9, denomination: 1, count: 0 },
  ]);

  useEffect(() => {
    console.log('userId', userId);
    setAssistantStats({
      cashCollection: 0,
      onlineCollection: 0,
      rewardPaid: 0,
      finePaid: 0,
      totalPayable: 0,
      totalCollection: 0,
    })
    fetchAssistantPageStats()
  }, [])

  useEffect(() => {
    setAssistantStats((prev) => ({
      ...prev,

    }))
  }, assistantPageStats)

  useEffect(() => {
    const totalRewards = (assistantPageStats.cashCollection - assistantPageStats.finePaid) >= 2000 ? 200 : 0;
    setAssistantStats((prev) => ({
      ...prev,
      rewardPaid: totalRewards
    }));
  }, [assistantPageStats.finePaid]);


  const calculateTotal = () => {
    return cashData.reduce((total, item) => total + (item.denomination * item.count), 0);
  };

  const fetchAssistantPageStats = async () => {
    try {
      const response = await fetch(`${url}/api/v1/parking-assistant/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'userId': assistantData._id,
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('fetchAssistantPageStats data:', data);
      console.log('fetchAssistantPageStats status:', response.status);
      if (response.status == 200) {
        const rewardMoney = ((data?.result?.TotalCash + data?.result?.TotalOnline) - assistantPageStats?.finePaid) >= 2000 ? 200 : 0

        console.log("hit 200...........");

        setAssistantStats({
          cashCollection: data.result.TotalCash,
          onlineCollection: data.result.TotalOnline,
          rewardPaid: rewardMoney,
          finePaid: 0,
          totalPayable: data.result.TotalCash - (rewardMoney + assistantPageStats.finePaid),
          totalCollection: data.result.TotalAmount,
        })
      } else if (response.status === 401 || response.status === 406) {
        console.log("hit 406...........");
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

  const handleSettleAmount = async () => {
    try {
      setSettling(true)

      const cashObject = cashData.map((d, i) => ({
        denomination: d.denomination,
        count: d.count
      }))
      // console.log("assistantPageStats.", typeof assistantPageStats.cashCollection, "   ", typeof assistantPageStats.finePaid, "  ",
      //   typeof assistantPageStats.rewardPaid, "  ", typeof assistantPageStats.cashCollection, "  ", typeof calculateTotal());
      // console.log("(calculateTotal() + assistantPageStats.finePaid + assistantPageStats.rewardPaid)", (calculateTotal() + assistantPageStats.finePaid + assistantPageStats.rewardPaid));
      if (assistantPageStats.cashCollection > 0) {
        if (assistantPageStats.cashCollection > (+assistantPageStats.finePaid + +assistantPageStats.rewardPaid) &&
          assistantPageStats.cashCollection !== (+calculateTotal() + +assistantPageStats.finePaid + +assistantPageStats.rewardPaid)) {
          return toast.show("please check the cash collection amount", { type: 'warning', placement: 'top' });
        }
      }

      if (fineChecked && +assistantPageStats.finePaid < 1) {
        return toast.show("please add a fine amount.", { type: 'warning', placement: 'top' });
      }

      if (+assistantPageStats.rewardPaid === 0 && +assistantPageStats.finePaid === 0 && +assistantPageStats.totalPayable !== +calculateTotal()) {
        return toast.show("Cash amount and total payable is not matching.", { type: 'warning', placement: 'top' });
      }

      if (+assistantPageStats.totalPayable < (+assistantPageStats.finePaid + +assistantPageStats.rewardPaid) && +calculateTotal() > 0) {
        return toast.show("Cash amount and total payable is not matching.", { type: 'warning', placement: 'top' });
      }

      if (+assistantPageStats.cashCollection !== 0) {
        if ((+assistantPageStats.finePaid > 0 || +assistantPageStats.rewardPaid > 0) && +assistantPageStats.cashCollection === calculateTotal()) {
          return toast.show("Cash collection amount is more than expected .", { type: 'warning', placement: 'top' });
        }
      }
      console.log("+calculateTotal()  +assistantPageStats.rewardPaid +assistantPageStats.finePaid", +calculateTotal(), "  ", +assistantPageStats.rewardPaid, "  ", +assistantPageStats.finePaid);
      const totalCollectedAmount = +assistantPageStats.cashCollection - (+assistantPageStats.rewardPaid + +assistantPageStats.finePaid);
      console.log("totalCollectedAmount...........", totalCollectedAmount);
      const apiData = {
        supervisorID: userId,
        cashComponent: cashObject,
        cashCollected: +calculateTotal(),
        totalCollection: +assistantPageStats.totalCollection,
        totalCollectedAmount: +totalCollectedAmount,
        TotalFine: +assistantPageStats.finePaid || 0,
        TotalRewards: +assistantPageStats.rewardPaid
      }
      console.log("apiData................", apiData);
      const response = await fetch(`${url}/api/v1/supervisor/settle-tickets/${assistantData._id}`, {
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

  const handleFineAmountChange = (_v) => {
    setAssistantStats((prev) => ({
      ...prev,
      finePaid: _v,
    }))

  }


  return (
    <View style={styles.container}>
      <DashboardHeader headerText={'Profile'} secondaryHeaderText={'SUPERVISOR'} />
      {isLoading ? (
        <Spinner size={50} bottomMargin={20} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AssistantHeader
            name={assistantData.name}
            title={"Parking Assistant"}
          />
          <View style={styles.cardContainer}>
            <View style={styles.collectionCard}>
              <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeAssistant/rupee.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>Cash Collection</Text>
                <Text style={styles.cardAmount}>{assistantPageStats.cashCollection} RS</Text>
              </View>
              <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeAssistant/credit-card.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>Online Collection</Text>
                <Text style={styles.cardAmount}>{assistantPageStats.onlineCollection} RS</Text>
              </View>
              {(fineChecked && assistantPageStats.finePaid > 0) && <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeAssistant/punishment.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>Fine Paid</Text>
                <Text style={styles.cardAmount}>{assistantPageStats.finePaid} RS</Text>
              </View>}
              {assistantPageStats.rewardPaid > 0 && <View style={styles.cardRow}>
                <Image
                  source={require('../../../utils/images/homeSupervisor/assistantPage/money.png')}
                  style={styles.cardIcon}
                />
                <Text style={styles.cardTitle}>Total Rewards</Text>
                <Text style={styles.cardAmount}>{assistantPageStats.rewardPaid} RS</Text>
              </View>}
              <View style={styles.separator} />
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>Total Payable</Text>
                <Text style={styles.cardAmount}>{assistantPageStats.totalPayable - assistantPageStats.finePaid} RS</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>Total Collection</Text>
                <Text style={styles.cardAmount}>{assistantPageStats.totalCollection} RS</Text>
              </View>
            </View>
            <View style={styles.customCheckboxContainer}>
              <CustomCheckbox
                title="Parking Assistant Fine"
                isChecked={fineChecked}
                onPress={() => setFineChecked(!fineChecked)}
              />
              <View style={{ margin: 6 }}></View>
              {fineChecked && <TextInput
                style={styles.input}
                placeholder="Enter Fine Amount"
                value={assistantPageStats.finePaid}
                onChangeText={handleFineAmountChange}
                keyboardType="numeric"
                editable={fineChecked}
              />}
            </View>
            <Text style={styles.heading}>Collected Cash</Text>
            <View style={styles.table}>
              <View style={[styles.row, styles.headerRow]}>
                <Text style={styles.headerCell}>Cash Denotions</Text>
                <Text style={styles.headerCell}>Cash Count</Text>
                <Text style={styles.headerCell}>Total</Text>
              </View>
              {cashData.map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.cell}>{item.denomination}</Text>
                  <Text style={styles.cell}>{item.count}</Text>
                  <Text style={styles.cell}>{item.denomination * item.count}</Text>
                </View>
              ))}
              <View style={[styles.footerRow]}>
                <Text style={styles.footerCell}>Total</Text>
                <Text style={styles.footerCell}></Text>
                <Text style={styles.footerCell}>{calculateTotal()}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.button, { backgroundColor: '#D9D9D9', marginRight: 10, }]}>
                <Text style={{ ...styles.buttonText, color: '#000', }} >Update Cash</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={isSettling} onPress={handleSettleAmount} style={{ ...styles.button, backgroundColor: '#223C83', ...(isSettling && { opacity: 0.5 }) }}>
                <Text style={styles.buttonText}>Settle Amount</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
      <CashUpdateModal cashData={cashData} setCashData={setCashData} isVisible={isModalVisible} onClose={() => setModalVisible(false)} />
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
  amount: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginRight: 8
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginBottom: 20
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    fontWeight: '600',
    borderColor: '#ddd',
    textAlign: 'center',
  },
  headerRow: {
    backgroundColor: '#f2f2f2',
  },
  footerRow: {
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
  },
  footerCell: {
    flex: 1,
    padding: 10,
    fontWeight: '600',
    borderColor: '#ddd',
    textAlign: 'center',
    borderBottomWidth: 0,
  },
  customCheckboxContainer: {
    paddingRight: 50,
    paddingBottom: 10,
    paddingTop: 20,
    justifyContent: 'flex-start'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 5,
    maxWidth: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
