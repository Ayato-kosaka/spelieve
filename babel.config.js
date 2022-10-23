module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'transform-inline-environment-variables',
      [
        "module-resolver",
        {
          alias: {
            "@": "./src",
          },
        },
      ],
      [
        "module:react-native-dotenv",
        {
            moduleName: "@env",
            path: ".env",
        },
      ],
    ],
  };
};
