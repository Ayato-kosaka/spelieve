import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languagedetector from "i18next-browser-languagedetector";
import backend from "i18next-xhr-backend";

const resources = {
    en: {
        translation: {
            "野菜設定": "set Vesitalble"
        }
    },
    ja: {
        translation: {
            "野菜設定": "野菜追加！！"
        }
    }
};

const detector = new languagedetector(null, {
   order: ['querystring', 'cookie', 'navigator', 'path', 'localStorage', 'htmlTag', 'sessionStorage',  'subdomain']
});

i18n
    .use(detector)
    .use(backend)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'ja',
        debug: true,
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;