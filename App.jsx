import React from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { Provider } from 'react-redux';
import { store, persistor } from './src/utils/reduxStore';
import AppNavigation from './src/navigations/AppNavigation';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastProvider } from 'react-native-toast-notifications'


function App() {

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
