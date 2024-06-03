/* eslint-disable */
// @ts-nocheck

const fs = require('fs');

/**
 * Recursively lists all files in a given directory.
 * @param targetDirectoryPath - The path of the directory to list files from.
 * @returns A list of file paths.
 */
function listFiles(targetDirectoryPath) {
	return fs.readdirSync(targetDirectoryPath, { withFileTypes: true }).flatMap((dirent) => {
		const name = `${targetDirectoryPath}/${dirent.name}`;
		return dirent.isFile() ? [name] : listFiles(name);
	});
}

const i18nRegex = /i18n\.t\((\t|\n)*'([^']*)'/g;
const matchItemList = {};
const duplicateKeys = [];

listFiles('./src')
	.filter((filePath) => filePath.endsWith('.tsx') || filePath.endsWith('.ts'))
	.forEach((filePath) => {
		const contents = fs.readFileSync(filePath, 'utf-8');
		for (const match of contents.matchAll(i18nRegex)) {
			const key = match[2];
			if (matchItemList[key]) {
				duplicateKeys.push(key);
			}
			matchItemList[key] = key;
		}
	});

if (duplicateKeys.length > 0) {
	console.log(`Duplicate keys found: ${duplicateKeys.join(', ')}`);
}

fs.writeFileSync('./src/Common/Hooks/i18n-js/Lang.json', JSON.stringify(matchItemList, null, '\t'));
