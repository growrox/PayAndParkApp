import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, TextInput, View, StyleSheet } from 'react-native';
import MainComponent from './MainComponent';
import { useNavigation } from '@react-navigation/native';
import { useToast } from "react-native-toast-notifications";
import { url } from '../../utils/url';

const Login = () => {
  const navigation = useNavigation();
  const [phoneNo, setPhoneNo] = useState('');
  const toast = useToast();

  const handleSignInPress = useCallback(async () => {
    if (phoneNo.length < 3) {
      return toast.show("Please enter a valid phone number", { type: 'danger', placement: 'top' });
    }

    try {
      console.log('clicked login phoneNo', phoneNo);
      const response = await fetch(`${url}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
        },
        body: JSON.stringify({ phone: phoneNo }),
      });

      const data = await response.json();
      console.log('data of response.......', data);

      switch (response.status) {
        case 400:
        case 300:
          toast.show(data.message, { type: 'warning', placement: 'top' });
          break;
        case 200:
          toast.show(data.message, { type: 'success', placement: 'top' });
          navigation.navigate('VerifyOTP', { phoneNo, otpFromResponse: data.OTP });
          break;
        default:
          console.log('default response.status:', response.status);
          toast.show(data.message, { placement: 'top' })
      }

    } catch (error) {
      console.log('Error occurred while signInWithPhoneNumber', error);
      toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
    }
  }, [phoneNo, navigation, toast]);

  const handleSignupPress = useCallback(() => {
    navigation.navigate('Signup');
  }, [navigation]);

  const handlePhoneNoChange = (event) => {
    setPhoneNo(event.nativeEvent.text);
  };

  return (
    <MainComponent
      Title="Welcome"
      Description="Verify your number to access your account"
    >
      <>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter Phone Number"
              placeholderTextColor="grey"
              value={phoneNo}
              onChange={handlePhoneNoChange}
              style={styles.textInput}
              keyboardType='phone-pad'
            />
          </View>
          <TouchableOpacity
            onPress={handleSignInPress}
            style={styles.signInButton}
          >
            <Text style={styles.signInButtonText}>SIGN IN</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text style={styles.footerText} onPress={handleSignupPress}>
              Don't have an account? Create one.
            </Text>
          </View>
        </View>
      </>
    </MainComponent>
  );
};

export default React.memo(Login);

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    width: 320,
    borderRadius: 8,
    marginBottom: 16,
  },
  textInput: {
    color: 'grey',
    padding: 10,
  },
  signInButton: {
    backgroundColor: '#213C83',
    paddingVertical: 6,
    paddingHorizontal: 48,
    width: 320,
    borderRadius: 8,
    marginBottom: 16,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
  footer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  footerText: {
    position: 'absolute',
    top: 45,
    color: '#FFFFFF',
  },
});
