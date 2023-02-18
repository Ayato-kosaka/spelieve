module.exports = function (api) {
	api.cache(true);
	return {
		presets: ['babel-preset-expo'],
		plugins: [
			'transform-inline-environment-variables',
			'@babel/plugin-proposal-export-namespace-from',
			'react-native-reanimated/plugin',
			'babel-plugin-styled-components',
			[
				'module-resolver',
				{
					alias: {
						'@': './src',
						'@assets': './assets',
					},
				},
			],
		],
	};
};
