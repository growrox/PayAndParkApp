import React, { useEffect } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { Provider } from 'react-redux';
import { store, persistor } from './src/utils/reduxStore';
import AppNavigation from './src/navigations/AppNavigation';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastProvider } from 'react-native-toast-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';


function App() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    (async () => {
      const language = await AsyncStorage.getItem('language');
      if (language) {
        i18n.changeLanguage(language);
      }
    })();
  },[]);
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastProvider
          textStyle={{ fontSize: 18 }}
          offset={50} 
          offsetTop={30}
          offsetBottom={40}
        >
          <AppNavigation />
        </ToastProvider>
      </PersistGate>
    </Provider >
  );
}

export default App;
