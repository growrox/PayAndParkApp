import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, TextInput, View, StyleSheet, ActivityIndicator } from 'react-native';
import MainComponent from './MainComponent';
import { useNavigation } from '@react-navigation/native';
import { AUTH_LOG_OUT } from '../../redux/types';
import { useToast } from "react-native-toast-notifications";
import { url } from '../../utils/url';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

const Login = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { appLanguage, token, userId } = useSelector(state => state.auth);
  const [phoneNo, setPhoneNo] = useState('');
  const toast = useToast();
  const [isLoginClicked, setLoginClicked] = useState(false)

  const handleSignInPress = useCallback(async () => {
    if (phoneNo.length < 3) {
      return toast.show(t("Please enter a valid phone number"), { type: 'danger', placement: 'top' });
    }
    setLoginClicked(true)

    try {
      // console.log('clicked login phoneNo', phoneNo);
      const response = await fetch(`${url}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-source': 'app',
          'client-language': appLanguage,
          'Authorization': `Bearer ${token}`,
          'userId': userId
        },
        body: JSON.stringify({ phone: phoneNo }),
      });

      const data = await response?.json();
      console.log('data of response.......', data);
      console.log('response.status', response.status);
      

      if (response.status === 200) {
        toast.show(data.message, { type: 'success', placement: 'top' });
        navigation.navigate('VerifyOTP', { phoneNo, otpFromResponse: data.OTP });
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
      console.log('Error occurred while signInWithPhoneNumber', error);
      toast.show(`Error: ${error.message}`, { type: 'danger', placement: 'top' });
    } finally {
      setLoginClicked(false)
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
      Title={t("Welcome")}
      Description={t("Verify your number to access your account")}
    >
      <>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={t("Enter Phone Number")}
              placeholderTextColor="grey"
              value={phoneNo}
              onChange={handlePhoneNoChange}
              style={styles.textInput}
              keyboardType='phone-pad'
            />
          </View>
          <TouchableOpacity
            disabled={isLoginClicked}
            onPress={handleSignInPress}
            style={styles.signInButton}
          >
            {isLoginClicked ?
              <ActivityIndicator size="small" color="#fff" /> :
              <Text style={styles.signInButtonText}>{t("SIGN IN")}</Text>}
          </TouchableOpacity>
          <View style={styles.footer}>
            <Text disabled={isLoginClicked} style={styles.footerText} onPress={handleSignupPress}>
              {t("Don't have an account? Create one")}.
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
    height: 45,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center'
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
