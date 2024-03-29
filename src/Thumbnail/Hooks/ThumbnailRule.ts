/*
## ruleJSON の作り方
https://www.convertcsv.com/csv-to-json.htm
で、CSV to Keyd JSON を選択する

## テーブルの整形方法
https://www.tablesgenerator.com/text_tables

*/

import { DecorationsMapInterface } from '../Contexts/TCT023DecorationsMap/DecorationsMapInterface';

/* 
Footer ルール
https://docs.google.com/spreadsheets/d/1BPeKHqCv-_5kgNvtpAC83pegNnN0g19VU8vYzMKiqEU/edit#gid=0
+--------+----------+---------+-------+------+-------------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| key    | EditText | Replace | Color | Mask | AspectRatio | Order | Animation | Border | BorderColor | Shadow | Opacity | Duplicate | Delete |
+--------+----------+---------+-------+------+-------------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| Video  |          |   TRUE  |       | TRUE |             |  TRUE |    TRUE   |  TRUE  |     TRUE    |  TRUE  |   TRUE  |    TRUE   |  TRUE  |
+--------+----------+---------+-------+------+-------------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| Image  |          |   TRUE  |       | TRUE |             |  TRUE |    TRUE   |  TRUE  |     TRUE    |  TRUE  |   TRUE  |    TRUE   |  TRUE  |
+--------+----------+---------+-------+------+-------------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| Figure |          |         |  TRUE | TRUE |     TRUE    |  TRUE |    TRUE   |  TRUE  |     TRUE    |  TRUE  |   TRUE  |    TRUE   |  TRUE  |
+--------+----------+---------+-------+------+-------------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| Text   |   TRUE   |         |  TRUE |      |             |  TRUE |    TRUE   |  TRUE  |     TRUE    |  TRUE  |   TRUE  |    TRUE   |  TRUE  |
+--------+----------+---------+-------+------+-------------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
*/
const FooterDisplay = () =>
	({
		Video: {
			EditText: null,
			Replace: true,
			Color: null,
			Mask: true,
			AspectRatio: null,
			Order: true,
			Animation: true,
			Border: true,
			BorderColor: true,
			Shadow: true,
			Opacity: true,
			Duplicate: true,
			Delete: true,
		},
		Image: {
			EditText: null,
			Replace: true,
			Color: null,
			Mask: true,
			AspectRatio: null,
			Order: true,
			Animation: true,
			Border: true,
			BorderColor: true,
			Shadow: true,
			Opacity: true,
			Duplicate: true,
			Delete: true,
		},
		Figure: {
			EditText: null,
			Replace: null,
			Color: true,
			Mask: true,
			AspectRatio: true,
			Order: true,
			Animation: true,
			Border: true,
			BorderColor: true,
			Shadow: true,
			Opacity: true,
			Duplicate: true,
			Delete: true,
		},
		Text: {
			EditText: true,
			Replace: null,
			Color: true,
			Mask: null,
			AspectRatio: null,
			Order: true,
			Animation: true,
			Border: true,
			BorderColor: true,
			Shadow: true,
			Opacity: true,
			Duplicate: true,
			Delete: true,
		},
	} as const);

export const decorationTypeFeature = (decoration: DecorationsMapInterface) => {
	switch (decoration.decorationType) {
		case 'Video':
			return { designItemStyle: {} };
		case 'Image':
			return { designItemStyle: {} };
		case 'Figure':
			return { designItemStyle: { aspectRatio: 1 } };
		case 'Text':
			return { designItemStyle: {} };
		default: {
			// TypeScriptのnever型を使用して、列挙型にない値が指定された場合にエラーを検出
			const exhaustiveCheck: never = decoration.decorationType;
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			throw new Error(`Unexpected decoration type: ${exhaustiveCheck}`);
		}
	}
};

export const ThumnailRule = {
	FooterDisplay,
	decorationTypeFeature,
};
