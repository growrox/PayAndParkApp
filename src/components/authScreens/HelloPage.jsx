import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import MainComponent from './MainComponent';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AUTH_LOG_IN_SUCCESS } from '../../redux/types';

const HelloPage = React.memo(() => {
  const navigation = useNavigation();
  const dispatch = useDispatch()

  // useEffect(() => {
  //   dispatch({
  //     type: AUTH_LOG_IN_SUCCESS,
  //     payload: {
  //       token: '',
  //       roleid: '',
  //       name: '',
  //       phoneNo: '',
  //       userId: '',
  //       name: ''
  //     },
  //   });
  // }, [])

  return (
    <MainComponent
      Title="HELLO"
      Description="let's help others park"
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.signInButton}
        >
          <Text style={styles.signInButtonText}>SIGN IN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          style={styles.signUpButton}
        >
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    </MainComponent>
  );
});

export default HelloPage;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
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
  signUpButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 48,
    width: 320,
    borderRadius: 8,
  },
  signUpButtonText: {
    color: '#213C83',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 4,
    paddingBottom: 4,
  },
});
