/*
## ruleJSON の作り方
https://www.convertcsv.com/csv-to-json.htm
で、CSV to Keyd JSON を選択する

## テーブルの整形方法
https://www.tablesgenerator.com/text_tables

*/

/* 
Footer ルール
https://docs.google.com/spreadsheets/d/1BPeKHqCv-_5kgNvtpAC83pegNnN0g19VU8vYzMKiqEU/edit#gid=0
+------------+----------+---------+-------+------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| key        | EditText | Replace | Color | Crop | Order | Animation | Border | BorderColor | Shadow | Opacity | Duplicate | Delete |
+------------+----------+---------+-------+------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| Background |          |   TRUE  |  TRUE | TRUE |       |    TRUE   |  TRUE  |     TRUE    |  TRUE  |   TRUE  |           |        |
+------------+----------+---------+-------+------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| Video      |          |   TRUE  |       | TRUE |  TRUE |    TRUE   |  TRUE  |     TRUE    |  TRUE  |   TRUE  |    TRUE   |  TRUE  |
+------------+----------+---------+-------+------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| Image      |          |   TRUE  |       | TRUE |  TRUE |    TRUE   |  TRUE  |     TRUE    |  TRUE  |   TRUE  |    TRUE   |  TRUE  |
+------------+----------+---------+-------+------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| Figure     |          |   TRUE  |  TRUE | TRUE |  TRUE |    TRUE   |  TRUE  |     TRUE    |  TRUE  |   TRUE  |    TRUE   |  TRUE  |
+------------+----------+---------+-------+------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
| Text       |   TRUE   |         |  TRUE |      |  TRUE |    TRUE   |  TRUE  |     TRUE    |  TRUE  |   TRUE  |           |        |
+------------+----------+---------+-------+------+-------+-----------+--------+-------------+--------+---------+-----------+--------+
*/
const FooterDisplay = () =>
	({
		Background: {
			EditText: false,
			Replace: true,
			Color: true,
			Crop: true,
			Order: false,
			Animation: true,
			Border: true,
			BorderColor: true,
			Shadow: true,
			Opacity: true,
			Duplicate: false,
			Delete: false,
		},
		Video: {
			EditText: false,
			Replace: true,
			Color: false,
			Crop: true,
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
			EditText: false,
			Replace: true,
			Color: false,
			Crop: true,
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
			EditText: false,
			Replace: true,
			Color: true,
			Crop: true,
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
			Replace: false,
			Color: true,
			Crop: false,
			Order: true,
			Animation: true,
			Border: true,
			BorderColor: true,
			Shadow: true,
			Opacity: true,
			Duplicate: false,
			Delete: false,
		},
	} as const);

export const ThumnailRule = {
	FooterDisplay,
};
