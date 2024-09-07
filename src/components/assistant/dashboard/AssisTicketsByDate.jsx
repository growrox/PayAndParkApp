import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { AUTH_LOG_OUT } from '../../../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from 'react-native-toast-notifications';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { url } from '../../../utils/url';
import moment from 'moment';

const AssisTicketsByDate = ({ modalVisible, setModalVisible }) => {
  const { token, userId, appLanguage } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [data, setData] = useState(null);
  const toast = useToast();

  const fetchDataByDate = async (date) => {
    // console.log("date", new Date(date).toLocaleDateString());
    console.log("date", moment(new Date(date)).format('YYYY-MM-DD'));

    setData(null);
    try {
      const response = await fetch(`${url}/api/v1/parking-assistant/settlement/${userId}?date=${moment(new Date(date)).format('YYYY-MM-DD')}`, {
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
      console.log("response.status", response.status);


      if (response.status === 200) {
        setData(data?.result);
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
        const messageData = response.status >= 400 ? data.error : data.message;
        toast.show(messageData, { type: toastType, placement: 'top' });
      }

    } catch (error) {
      console.log('Error occurred while supervisor/lifetime-stats', error);
      toast.show(`Error: ${error?.message}`, { type: 'danger', placement: 'top' });
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchDataByDate(date);
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>

          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                mode="single"
                date={selectedDate}
                onChange={(params) => handleDateChange(params.date)}
                style={styles.datePicker}
              />


              {data ? (
                <>
                  <View style={styles.row}>
                    <Text style={styles.label}>Total Cash:</Text>
                    <Text style={styles.value}>{data?.cashCollection}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Total Online:</Text>
                    <Text style={styles.value}>{data?.onlineCollection}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Total Reward:</Text>
                    <Text style={styles.value}>{data?.totalReward}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>Total Fine:</Text>
                    <Text style={styles.value}>{data?.totalFine}</Text>
                  </View>
                  <View style={styles.separator} />
                  <View style={styles.row}>
                    <Text style={styles.label}>Total Collection:</Text>
                    <Text style={styles.value}>{data?.totalCollection}</Text>
                  </View>
                </>
              ) : (
                <Text style={styles.noDataText}>No data available</Text>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datePicker: {
    width: '100%',
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'stretch',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  separator: {
    height: 2,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#333',
  },
  value: {
    fontSize: 16,
    color: '#007bff',
  },
  noDataText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AssisTicketsByDate;
