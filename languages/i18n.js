import i18next from 'i18next';
import en from './en.json';
import el from './el.json';
import { initReactI18next } from 'react-i18next';

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: 'el', // Change to en if you want to start with english
    resources: {
        el: el,
        en: en
    },
    react: {
        useSuspense: false,
    },
});

export default i18next;