import * as Localization from 'expo-localization';
import { I18n } from "i18n-js";
import lang from "./lang";

import ja from './ja'
import en from './en'

const i18n = new I18n({
    ja,
    en
});

i18n.defaultLocale = "ja";
// Set the locale once at the beginning of your app.
// i18n.locale = Localization.locale; // うまく行かない。issue#114で起票
i18n.defaultLocale = "ja";

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;

// デフォルトではメッセージが画面に設定されるため、guessで上書く。そのまま表示は出来ない。guessはピリオドが入ると非表示になるため、defaultValueを利用する。
i18n.missingBehavior = "guess";

export default i18n;
export const i18nLang = lang;