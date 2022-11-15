import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from './en';
import ja from './ja';
import Lang from './Lang';

const i18n = new I18n({
	ja,
	en,
});

// Set the locale once at the beginning of your app.
i18n.defaultLocale = 'ja';

// When a value is missing from a language it'll fallback to another language with the key present.
i18n.enableFallback = true;

// デフォルトではメッセージが画面に設定されるため、guessで上書く。そのまま表示は出来ない。guessはピリオドが入ると非表示になるため、defaultValueを利用する。
i18n.missingBehavior = 'guess';

// 端末の言語設定をi18nに設定
i18n.locale = Localization.locale.slice(0, 2);

export default i18n;
export const i18nLang = Lang;
