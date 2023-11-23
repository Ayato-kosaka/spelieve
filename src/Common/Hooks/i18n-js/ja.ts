import Lang from './Lang.json';

const ja: typeof Lang = {
	// App.tsx
	Itinerary: 'しおり',
	Place: '場所',

	// NotFoundScreen.tsx
	'Go to home screen!': 'ホームに戻る',

	// Utils
	'Advertisement Area': 'Advertisement Area',

	// HelloSpelieve.tsx
	新規作成: '新規作成',
	最近作成した旅行しおり: '最近作成した旅行しおり',
	'No Thumbnail': 'サムネイル画像なし',
	'Spelieve の特徴': 'Spelieve の特徴',
	自動計算機能: '自動計算機能',
	'1つのプラン変更しても自動計算で全体が調整 旅の途中にプランの変更があっても安心':
		'1つのプラン変更しても自動計算で全体が調整\n旅の途中にプランの変更があっても安心',
	サムネイル機能: 'サムネイル機能',
	'独自の旅しおりをカスタマイズ 写真でプランを鮮やかに表現し 個性的な冒険を創造しましょう':
		'独自の旅しおりをカスタマイズ\n写真でプランを鮮やかに表現し\n個性的な冒険を創造しましょう',
	共同作成機能: '共同作成機能',
	'予定調整やアイデア共有が簡単！ 共有された側もインストール不要！ 思い出に残る旅行を一緒に作り上げよう':
		'予定調整やアイデア共有が簡単！\n共有された側もインストール不要！\n思い出に残る旅行を一緒に作り上げよう',
	新しく始める: '新しく始める',
	サンプルしおりを参照: 'サンプルしおりを参照',
	eTUHLh152sFWMNGLLwSg: 'BJFEXf5jRhy6JSRpH7iq',
	'Spelieve の使い方': 'Spelieve の使い方',
	しおりを作成: 'しおりを作成',
	'新しく始めるボタンから しおりを新規作成できます': '新しく始めるボタンから\nしおりを新規作成できます',
	訪れる予定の場所を入力: '訪れる予定の場所を入力',
	'訪れる場所を追加しましょう Add Plan ボタンを押すと 新しく場所を追加できます':
		'訪れる場所を追加しましょう\nプラン追加ボタンを押すと\n新しく場所を追加できます',
	'URLをコピーし、友達にシェア': 'URLをコピーし、友達にシェア',
	'画面下部でしおりのURLをコピー可能 一緒に行く友人や家族に共有しよう!':
		'画面下部でしおりのURLをコピー可能\n一緒に行く友人や家族に共有しよう!',
	'旅行を楽しむ！': '旅行を楽しむ！',
	お問い合わせ: 'お問い合わせ',
	フィードバック: 'フィードバック',
	'Copyright © Spelieve ': 'Copyright © Spelieve ',
	開発者用: '開発者用',

	// ImagePickerCOntroller.ts
	'Upload failed, sorry :(': 'アップロードに失敗しました',

	// TrafficMovementEdit.tsx
	'Add Plan': 'プラン追加',

	// EditDirectionMode.tsx
	'Route with Fewest transfer': '乗り換えの少ないルート',
	'Route with Shortest walking distance': '歩く距離の少ないルート',
	Select: '決定',

	// INV002ItineraryTopTabNavigator
	Edit: '編集',
	Preview: 'プレビュー',

	// ItineraryPageNavigator
	'Plan setting': 'プラン設定',

	// IPA001ItineraryEdit
	'Add Plan group': 'プラングループ追加',
	'day N': '%{count} 日目',
	'copy Share URL': 'URL をコピー',
	'Add Tag': 'タグ追加',
	'Start date': '開始日',
	Description: '説明',

	// IPA003EditPlan
	Memo: 'メモ',
	'Stay time': '滞在時間',
	'Representative plan Start date': '代表プランの開始日',
	'Set this Plan to Representative one': 'このプランを代表プランに設定',

	// PCO002GooglePlacesAUtocomplete.tsx
	'Search Place': '場所を検索',

	// PHK001GooglePlaceAPI.ts
	Bicycling: '自転車',
	Driving: '車',
	Transit: '交通機関',
	Walking: '徒歩',
	Bus: 'バス',
	Rail: '鉄道',
	Subway: '地下鉄',
	Train: '電車',
	Tram: 'トラム',
	'Avoid highways': '高速道路を除外',
	'Avoid tolls': '有料道路を除外',
	'Avoid ferries': 'フェリーを除外',
	'Avoid Indoors': 'インドアを除外',

	// MPlaceOne.tsx
	'No Opening Hours Infomation': '営業時間の情報はありません',
	'Open 24hours': '24時間営業',
	Sunday: '日曜日',
	Monday: '月曜日',
	Tuesday: '火曜日',
	Wednesday: '水曜日',
	Thursday: '木曜日',
	Friday: '金曜日',
	Saturday: '土曜日',

	// PMC012202PlaceInformation.tsx
	'Opening Hours': '営業時間',
	'Customer Reviews': '顧客レビュー',
	'Show more Info at Google Map': 'Googleマップの詳細情報',

	// PPA002Place
	'Place Not Found': '場所が見つかりませんでした',

	// Thumbnail
	'Border Color': 'Border Color',
	Cancel: 'キャンセル',
	Save: '保存',
	Color: 'Color',
	テキスト入力: 'テキスト入力',
	EditText: 'EditText',
	Replace: 'Replace',
	Mask: 'Mask',
	Order: 'Order',
	Duplication: 'Duplication',
	Delete: 'Delete',
	'Dummy Text': 'テキスト',
	テキストを入力してください: 'テキストを入力してください',
	'Discard Thumbnail?': 'サムネイルを破棄しますか?',
	'変更を保存せずに戻りますか？': '変更を保存せずに戻りますか？',
	Discard: '破棄',
	'go to select template': 'サムネイルテンプレートを選択する',
	'Bring to Front': '最前面へ',
	'Bring Forward': '前面へ',
	'Send Backward': '背面へ',
	'Send to Back': '最背面へ',
	サムネイルテンプレート選択: 'サムネイルテンプレート選択',

	// IMC03101PlanEdit
	上へ: '上へ',
	下へ: '下へ',
	削除: '削除',
};
export default ja;
