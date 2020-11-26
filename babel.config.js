module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@types': './common/types.ts',
          '@actions': './common/redux/actions',
          '@reducers': './src/redux/reducers',
          '@clientUtils': './src/utils.ts',
          '@common': './common',
        },
      },
    ],
    [
      'transform-inline-environment-variables',
      {
        include: ['NODE_ENV', 'HOST'],
      },
    ],
  ],
}
