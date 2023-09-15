import i18next from 'i18next';
import en from './en.json';
import el from './el.json';
import {initReactI18next} from 'react-i18next';

const language = 'el'; // Change to en if you want to start with english , ro for romanian

i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: language,
  resources: {
    el: el,
    en: en,
  },
  react: {
    useSuspense: false,
  },
});

export default i18next;
