module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['@react-native-community','plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/member-delimiter-style': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/prop-types': 0,
    'react/display-name': 0,
    'react-native/no-inline-styles': 0,
  }
};
