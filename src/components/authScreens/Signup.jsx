import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';
import MainComponent from './MainComponent';
import { useNavigation } from '@react-navigation/native';
import { useToast } from 'react-native-toast-notifications';
import { url } from '../../utils/url';

const Signup = () => {
  const navigation = useNavigation();
  const [signupData, setSignupData] = useState({
    name: '',
    phoneNo: '',
    supervisorCode: ''
  })
  const toast = useToast()

  const handleSignupPress = useCallback(async () => {
    // navigation.navigate('Signup');

    if (!signupData.name || !signupData.phoneNo || !signupData.supervisorCode) toast.show('Please enter all the fields correctly!', { type: 'warning' })

    const apiData = {
      name: signupData.name,
      phone: signupData.phoneNo,
      supervisorCode: signupData.supervisorCode
    }

    // console.log('hit signup', signupData);
    try {
      // console.log('clicked login ');
      const response = await fetch(`${url}/api/v1/sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();
      // console.log('data of response.......', data);

      if (response.status === 200) {
        toast.show(data.message, { type: 'success', placement: 'top' });
        navigation.navigate('VerifyOTP', { phoneNo: signupData.phoneNo, otpFromResponse: data.OTP });
      } else if (response.status === 401 || response.status === 406) {
        dispatch({
          type: AUTH_LOG_OUT,
          payload: {
            token: "",
            location: "",
            roleid: "",
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
      console.log('Error occurred while signup', error);
      toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
    }

  }, [signupData])


  const handleInputChange = useCallback((event, type) => {
    const { text } = event.nativeEvent;

    // console.log('text, type', text, '   ', type);
    setSignupData((prev) => ({
      ...prev,
      [type]: text
    }))
  }, [])

  return (
    <MainComponent
      Title="Create Account"
      Description="Here there will be a slogan is there is"
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Your Name"
            placeholderTextColor="grey"
            value={signupData.name}
            onChange={(v) => handleInputChange(v, 'name')}
            style={styles.textInput}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Phone Number"
            value={signupData.phoneNo}
            onChange={(v) => handleInputChange(v, 'phoneNo')}
            placeholderTextColor="grey"
            style={styles.textInput}
            keyboardType='numeric'
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Supervisor Code"
            placeholderTextColor="grey"
            value={signupData.supervisorCode}
            onChange={(v) => handleInputChange(v, 'supervisorCode')}
            style={styles.textInput}
          />
        </View>
        <TouchableOpacity
          onPress={handleSignupPress}
          style={styles.signUpButton}
        >
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>

      </View>
    </MainComponent>
  );
};

export default React.memo(Signup);

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    width: 320,
    borderRadius: 8,
    marginBottom: 16,
  },
  textInput: {
    color: 'grey',
    padding: 10,
  },
  signUpButton: {
    backgroundColor: '#213C83',
    paddingVertical: 6,
    paddingHorizontal: 48,
    width: 320,
    borderRadius: 8,
    marginBottom: 16,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
});
