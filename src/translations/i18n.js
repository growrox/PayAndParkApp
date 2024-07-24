import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import hi from './hi.json';
import mr from './mr.json';
import en from './en.json';

i18n.use(initReactI18next).init({
  lng: getLocales()[0].languageCode,
  fallbackLng: 'en',
  compatibilityJSON: 'v3',
  resources: {
    en,
    hi,
    mr
  },
  interpolation: {
    escapeValue: false
  }
});

export default i18n;