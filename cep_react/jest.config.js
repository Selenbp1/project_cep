module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)',
    '\\.pnp\\.[^\\/]+$',
    "\\.css$"
  ],
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
