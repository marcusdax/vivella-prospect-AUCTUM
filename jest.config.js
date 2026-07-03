const config = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((react-native.*)?|expo.*|@expo.*|@react-native.*|nativewind|react-native-css-interop))',
  ],
};

module.exports = config;
