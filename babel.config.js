module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
    [
      'module-resolver',
      {
        alias: {
          '~': './src/',
          '@stores': './src/stores/',
          '@sagas': './src/sagas/',
          '@redux': './src/redux/',
          '@configs': './src/configs/',
          '@screens': './src/screens/',
          '@constants': './src/constants/',
          '@components': './src/components/',
          '@ui': './src/ui/',
        },
      },
    ],
  ],
};
